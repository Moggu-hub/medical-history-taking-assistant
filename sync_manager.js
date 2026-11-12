/**
 * ============================================================================
 * sync_manager.js — Client-Side Cloud Sync & Pilot Mode Controller
 * ============================================================================
 * ฟังก์ชันหลัก:
 * 1. ตรวจจับการเชื่อมต่อกับ Sync Server (เมื่อเปิดผ่าน HTTP/HTTPS)
 * 2. ตรวจจับอุปกรณ์:
 *    - หน้าจอมือถือ (<=768px): สลับเข้ามุมมองผู้ป่วย (Landing / ซักประวัติ) ให้อัตโนมัติ
 *    - คอมพิวเตอร์ รพ. (>768px): สลับเข้ามุมมองแพทย์ (Doctor Dashboard) พร้อมระบบ PIN 4 หลัก
 * 3. เคลียร์เคสจำลอง (Seed Patients 117 เคส) ออก 100% ในโหมด Pilot เพื่อแสดงเฉพาะเคสจริงที่คุณหมอกรอก
 * 4. ซ่อนข้อมูลจำลอง (HN จำลอง, เลขคิวจำลอง, สัญญาณชีพจำลอง, แบนเนอร์ QR จำลอง)
 * 5. Hook ปุ่ม Submit Intake บนมือถือ -> ส่งข้อมูลขึ้น Cloud ผ่าน POST /api/intake ทันที
 * 6. ดึงเคสล่าสุดจาก VPS มาแทนที่ใน patientDatabase โดยตรง พร้อมปุ่ม [🔄 ดึงเคสล่าสุด]
 * ============================================================================
 */

(function () {
  'use strict';

  // Safe guard: Exit immediately if running in Node.js VM / Test Sandbox
  if (typeof window === 'undefined' || typeof document === 'undefined' || !window.location) {
    return;
  }

  // Check if running on HTTP / HTTPS
  const isServerMode = window.location.protocol && window.location.protocol.startsWith('http');
  if (!isServerMode) {
    console.log('[SyncManager] Running in local offline file mode (file://). Cloud sync inactive.');
    return;
  }

  // --- IMMEDIATE SYNC SETUP BEFORE DOMCONTENTLOADED ---
  // 1. Override getSeedPatients so initDatabase cannot seed 117 mock patients
  window.getSeedPatients = function () {
    return [];
  };

  // 2. Clear localStorage of any legacy seed patients immediately
  try {
    const raw = localStorage.getItem('medhistory_patients_v16');
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        const cleaned = list.filter(p => !isSeedPatientRecord(p));
        localStorage.setItem('medhistory_patients_v16', JSON.stringify(cleaned));
      }
    }
  } catch (e) {}

  const SYNC_STATE = {
    isConnected: false,
    doctorPin: sessionStorage.getItem('er_doctor_pin') || '',
    pollingInterval: null
  };

  // --- 1. INITIALIZATION & HEALTH CHECK ---
  async function initSyncManager() {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        SYNC_STATE.isConnected = true;
        console.log('[SyncManager] Connected to Sync Server successfully.');
        renderSyncStatusBadge(true);
        activatePilotMode();
        setupDeviceDefaultView();
        injectRefreshButton();
        hideSimulatedUiElements();
      } else {
        renderSyncStatusBadge(false);
      }
    } catch (e) {
      console.warn('[SyncManager] Sync server unreachable, offline mode.');
      renderSyncStatusBadge(false);
    }
  }

  // Auto-switch to patient intake on mobile if no explicit role in URL
  function setupDeviceDefaultView() {
    const params = new URLSearchParams(window.location.search);
    const hasExplicitRole = params.has('role');
    const isMobile = window.innerWidth <= 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

    if (!hasExplicitRole && isMobile) {
      console.log('[SyncManager] Mobile detected: Switching to patient intake view.');
      if (typeof window.switchUserRole === 'function') {
        window.switchUserRole('patient', { targetView: 'landing', silent: true });
      }
    }
  }

  // --- 2. PILOT MODE: CLEAR SEED PATIENTS & HIDE SIMULATED DEMOGRAPHICS ---
  function activatePilotMode() {
    // Clear in-memory patientDatabase of any seed patients
    if (typeof patientDatabase !== 'undefined' && Array.isArray(patientDatabase)) {
      const realPatients = patientDatabase.filter(p => !isSeedPatientRecord(p));
      patientDatabase.length = 0;
      patientDatabase.push(...realPatients);

      if (typeof saveDatabase === 'function') {
        try {
          localStorage.setItem('medhistory_patients_v16', JSON.stringify(realPatients));
        } catch (err) {}
      }
      if (typeof renderQueueCards === 'function') renderQueueCards();
      if (typeof renderDoctorDashboard === 'function') renderDoctorDashboard();
      if (typeof updateTopCounter === 'function') updateTopCounter();
    }

    // Reset simulated QR queue pass so it doesn't stamp fake HN / Queue / Vitals
    if (typeof activeQrQueuePass !== 'undefined') {
      activeQrQueuePass.queue_number = '';
      activeQrQueuePass.hn = '';
      activeQrQueuePass.title = '';
      activeQrQueuePass.name = '';
      activeQrQueuePass.age = '';
      activeQrQueuePass.gender = '';
      activeQrQueuePass.esi = null;
      activeQrQueuePass.vital_signs = null;
    }

    hideSimulatedUiElements();
    hookRoleSwitching();

    // If PIN is already authenticated in this session, fetch cases immediately
    if (SYNC_STATE.doctorPin) {
      fetchCasesFromServer();
    } else if (window.innerWidth > 768 && !window.location.search.includes('role=patient')) {
      // On desktop doctor screen, prompt PIN if not entered yet
      setTimeout(() => {
        if (!SYNC_STATE.doctorPin) openDoctorPinModal();
      }, 300);
    }

    // Background polling (every 8 seconds)
    if (!SYNC_STATE.pollingInterval) {
      SYNC_STATE.pollingInterval = setInterval(() => {
        if (SYNC_STATE.doctorPin && isDoctorViewVisible()) {
          fetchCasesFromServer(true);
        }
      }, 8000);
    }
  }

  function hideSimulatedUiElements() {
    // 1. Hide Triage QR Ticket Banner on landing
    const qrBanner = document.querySelector('#qrQueueTicketBanner');
    if (qrBanner) qrBanner.style.setProperty('display', 'none', 'important');

    // 2. Hide Top-right QR Queue badge
    const qrHeaderBadge = document.querySelector('#patientQrHeaderBadge');
    if (qrHeaderBadge) qrHeaderBadge.style.setProperty('display', 'none', 'important');

    // 3. Hide Triage Vital Signs card in Doctor View (Pilot mode focuses on history)
    const vsCard = document.querySelector('#doctorTriageVsCard');
    if (vsCard) vsCard.style.setProperty('display', 'none', 'important');

    // 4. Hide Seed Patient Reload button in Empty Queue notice
    const reloadSeedBtn = document.querySelector('button[onclick*="restoreInitialDatabase"]');
    if (reloadSeedBtn) reloadSeedBtn.style.setProperty('display', 'none', 'important');

    // 5. Hide Simulator Buttons in devRoleBar
    const simBtns = document.querySelectorAll(
      'button[onclick*="openTriageSimulatorModal"], #devSimulateQrBtn, #devLockStaffBtn, #resetDbBtn, #simBtnDesktop'
    );
    simBtns.forEach(b => {
      if (b.id === 'simBtnDesktop' && b.parentElement) {
        b.parentElement.style.setProperty('display', 'none', 'important');
      } else {
        b.style.setProperty('display', 'none', 'important');
      }
    });
  }

  function cleanPilotPatientRecord(p) {
    if (!p) return;
    // Remove fake random HN (e.g. 67xxxxx)
    if (p.hn && (String(p.hn).startsWith('67') || p.hn === '6788412')) {
      p.hn = 'ไม่ระบุ';
    }
    // Set sequential friendly queue number (เคสที่ 1, เคสที่ 2...)
    const realCount = (typeof patientDatabase !== 'undefined' && Array.isArray(patientDatabase))
      ? patientDatabase.filter(x => !isSeedPatientRecord(x)).length
      : 1;
    if (!p.queue_number || p.queue_number.startsWith('E1-') || p.queue_number.startsWith('E3-') || p.queue_number.startsWith('A-')) {
      p.queue_number = `เคสที่ ${realCount || 1}`;
    }
    // Remove fake default vitals
    p.vital_signs = null;
    p.esi_level = null;
  }

  function isDoctorViewVisible() {
    const docSection = document.querySelector('#doctorView');
    return docSection && docSection.offsetParent !== null;
  }

  function hookRoleSwitching() {
    const origSwitchRole = window.switchUserRole;
    window.switchUserRole = function (role, options = {}) {
      if ((role === 'doctor' || role === 'admin') && SYNC_STATE.isConnected && !SYNC_STATE.doctorPin) {
        openDoctorPinModal();
        return;
      }
      if (typeof origSwitchRole === 'function') {
        origSwitchRole(role, options);
      }
      hideSimulatedUiElements();
      if (role === 'doctor' && SYNC_STATE.isConnected && SYNC_STATE.doctorPin) {
        fetchCasesFromServer(true);
      }
    };
  }

  // --- 3. MOBILE INTAKE HOOK: UPLOAD CASE TO SERVER ---
  function hookIntakeSubmission() {
    const originalSubmit = window.handlePatientSubmit;
    window.handlePatientSubmit = async function (e) {
      if (typeof originalSubmit === 'function') {
        originalSubmit(e);
      }

      if (!SYNC_STATE.isConnected) return;

      setTimeout(async () => {
        try {
          // Retrieve newly submitted patient from global patientDatabase or localStorage
          let allPatients = [];
          if (typeof patientDatabase !== 'undefined' && Array.isArray(patientDatabase) && patientDatabase.length > 0) {
            allPatients = patientDatabase;
          } else {
            const raw = localStorage.getItem('medhistory_patients_v16');
            allPatients = raw ? JSON.parse(raw) : [];
          }

          const patientRecord = allPatients[allPatients.length - 1];

          if (patientRecord) {
            cleanPilotPatientRecord(patientRecord);
            // Save cleaned record to local storage
            try {
              localStorage.setItem('medhistory_patients_v16', JSON.stringify(allPatients));
            } catch (err) {}

            await uploadCaseToServer(patientRecord);
          }
        } catch (err) {
          console.error('[SyncManager] Submit upload error:', err);
        }
      }, 250);
    };
  }

  async function uploadCaseToServer(patientRecord) {
    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientRecord)
      });

      if (res.ok) {
        const data = await res.json();
        showSyncToast(`✅ ซิงค์เคส ${patientRecord.name || ''} (${patientRecord.queue_number}) ขึ้น Cloud สำเร็จแล้ว`, 'success');
      } else {
        showSyncToast('⚠️ ไม่สามารถซิงค์เคสขึ้นเซิร์ฟเวอร์ได้ กรุณาตรวจสอบอินเทอร์เน็ต', 'warn');
      }
    } catch (err) {
      console.error('[SyncManager] Failed to post intake:', err);
      showSyncToast('⚠️ การซิงค์ขัดข้อง ข้อมูลยังคงอยู่ในเครื่องมือถือ', 'warn');
    }
  }

  // --- 4. HOSPITAL PC: FETCH CASES & REFRESH ---
  async function fetchCasesFromServer(isSilent = false) {
    if (!SYNC_STATE.doctorPin) return;

    try {
      const res = await fetch('/api/cases', {
        headers: { 'x-doctor-pin': SYNC_STATE.doctorPin }
      });

      if (res.status === 401) {
        SYNC_STATE.doctorPin = '';
        sessionStorage.removeItem('er_doctor_pin');
        if (!isSilent) {
          openDoctorPinModal('รหัส PIN ไม่ถูกต้องหรือหมดอายุ กรุณาใส่รหัสใหม่');
        }
        return;
      }

      if (res.ok) {
        const data = await res.json();
        const serverCases = (data.cases || []).filter(p => !isSeedPatientRecord(p));

        // Update global patientDatabase in place so all core_engine functions see it
        if (typeof patientDatabase !== 'undefined') {
          patientDatabase.length = 0;
          patientDatabase.push(...serverCases);
        }

        try {
          localStorage.setItem('medhistory_patients_v16', JSON.stringify(serverCases));
        } catch (e) {}

        // Set active patient to most recent if not selected or current one no longer exists
        if (typeof activePatientId !== 'undefined') {
          if (!activePatientId || !serverCases.some(c => c.id === activePatientId)) {
            activePatientId = serverCases.length > 0 ? serverCases[0].id : null;
          }
        }

        if (typeof renderQueueCards === 'function') renderQueueCards();
        if (typeof renderDoctorDashboard === 'function') renderDoctorDashboard();
        if (typeof updateTopCounter === 'function') updateTopCounter();

        hideSimulatedUiElements();

        if (!isSilent) {
          showSyncToast(`🔄 อัปเดตรายชื่อเคสล่าสุดแล้ว (${serverCases.length} เคส)`, 'info');
        }
      }
    } catch (err) {
      if (!isSilent) {
        console.error('[SyncManager] Fetch cases error:', err);
        showSyncToast('⚠️ ไม่สามารถเชื่อมต่อเพื่อดึงเคสได้', 'warn');
      }
    }
  }

  window.manualRefreshDoctorCases = function () {
    fetchCasesFromServer(false);
  };

  function injectRefreshButton() {
    const queueHeader = document.querySelector('#queueTabCompleted')?.parentElement;
    if (queueHeader && !document.querySelector('#manualRefreshCasesBtn')) {
      const refreshBtn = document.createElement('button');
      refreshBtn.id = 'manualRefreshCasesBtn';
      refreshBtn.type = 'button';
      refreshBtn.className = 'px-2.5 py-1.5 rounded-lg font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition flex items-center space-x-1 text-xs cursor-pointer ml-1.5 shadow-2xs';
      refreshBtn.innerHTML = `
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
        <span>ดึงเคสล่าสุด</span>
      `;
      refreshBtn.onclick = () => window.manualRefreshDoctorCases();
      queueHeader.appendChild(refreshBtn);
    }
  }

  // --- 5. UI COMPONENTS: PIN MODAL & STATUS BADGE ---
  function openDoctorPinModal(errorMsg = '') {
    let modal = document.querySelector('#doctorPinModal');
    if (!modal) {
      modal = createPinModalElement();
      document.body.appendChild(modal);
    }

    const errElem = document.querySelector('#doctorPinErrorText');
    if (errElem) {
      errElem.textContent = errorMsg;
      errElem.classList.toggle('hidden', !errorMsg);
    }

    const pinInput = document.querySelector('#doctorPinInput');
    if (pinInput) {
      pinInput.value = '';
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => pinInput && pinInput.focus(), 100);
  }

  function closeDoctorPinModal() {
    const modal = document.querySelector('#doctorPinModal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  function createPinModalElement() {
    const modal = document.createElement('div');
    modal.id = 'doctorPinModal';
    modal.className = 'fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 hidden items-center justify-center p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-slate-200">
        <div class="text-center mb-5">
          <div class="w-12 h-12 bg-medical-50 text-medical-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          </div>
          <h3 class="text-base font-bold text-slate-800">รหัส PIN แพทย์ (Doctor Access)</h3>
          <p class="text-xs text-slate-500 mt-1">กรุณาระบุรหัส PIN 4 หลัก เพื่อปลดล็อกดูประวัติผู้ป่วย</p>
        </div>

        <form id="doctorPinForm" onsubmit="handleDoctorPinSubmit(event)" class="space-y-4">
          <div>
            <input type="password" id="doctorPinInput" maxlength="6" inputmode="numeric" placeholder="••••"
              class="w-full text-center text-2xl tracking-[0.5em] font-mono py-2.5 px-4 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-medical-500 focus:bg-white outline-none transition" />
            <p id="doctorPinErrorText" class="text-xs text-rose-600 text-center mt-2 font-medium hidden"></p>
          </div>

          <div class="flex space-x-2.5">
            <button type="button" onclick="cancelDoctorPin()" class="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition">
              มุมมองผู้ป่วย
            </button>
            <button type="submit" class="flex-1 py-2.5 px-4 bg-medical-600 hover:bg-medical-700 text-white font-semibold rounded-xl text-xs transition shadow-sm">
              ปลดล็อก (Unlock)
            </button>
          </div>
        </form>
      </div>
    `;
    return modal;
  }

  window.handleDoctorPinSubmit = async function (e) {
    if (e) e.preventDefault();
    const pinInput = document.querySelector('#doctorPinInput');
    const pin = (pinInput?.value || '').trim();

    if (!pin) return;

    try {
      const res = await fetch('/api/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });

      const data = await res.json();
      if (res.ok && data.valid) {
        SYNC_STATE.doctorPin = pin;
        sessionStorage.setItem('er_doctor_pin', pin);
        closeDoctorPinModal();
        if (typeof window.switchUserRole === 'function') window.switchUserRole('doctor');
        fetchCasesFromServer();
      } else {
        const errElem = document.querySelector('#doctorPinErrorText');
        if (errElem) {
          errElem.textContent = data.error || 'รหัส PIN ไม่ถูกต้อง';
          errElem.classList.remove('hidden');
        }
        if (pinInput) {
          pinInput.value = '';
          pinInput.focus();
        }
      }
    } catch (err) {
      console.error('[SyncManager] PIN verify failed:', err);
    }
  };

  window.cancelDoctorPin = function () {
    closeDoctorPinModal();
    if (typeof window.switchUserRole === 'function') window.switchUserRole('patient', { targetView: 'landing' });
  };

  function renderSyncStatusBadge(connected) {
    const container = document.querySelector('#devRoleBar > div');
    if (!container) return;

    let badge = document.querySelector('#cloudSyncStatusBadge');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'cloudSyncStatusBadge';
      badge.className = 'inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition ml-2 cursor-pointer';
      badge.onclick = () => {
        if (isDoctorViewVisible()) {
          window.manualRefreshDoctorCases();
        }
      };
      container.appendChild(badge);
    }

    if (connected) {
      badge.className = 'inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 transition ml-2 shadow-2xs';
      badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span><span>Sync Active</span>`;
      badge.title = 'เชื่อมต่อเซิร์ฟเวอร์สำเร็จ คลิกเพื่อรีเฟรชเคส';
    } else {
      badge.className = 'inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-400 border border-slate-700 transition ml-2';
      badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-slate-500"></span><span>Offline Mode</span>`;
    }
  }

  function showSyncToast(message, type = 'info') {
    if (typeof window.showToast === 'function') {
      window.showToast(message);
      return;
    }
    const toast = document.createElement('div');
    toast.className = `fixed bottom-5 right-5 z-50 py-2.5 px-4 rounded-xl text-xs font-semibold shadow-lg text-white ${
      type === 'success' ? 'bg-emerald-600' : type === 'warn' ? 'bg-amber-600' : 'bg-slate-800'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  // --- 6. AUTO-START ON DOM LOAD ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      hookIntakeSubmission();
      initSyncManager();
    });
  } else {
    hookIntakeSubmission();
    initSyncManager();
  }

})();
