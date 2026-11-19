// =========================================================================
// USER FEEDBACK & ADMIN REVIEW TABLE MODULE: feedback_module.js
// เก็บคำแนะนำและปัญหาการใช้งานแยกขาดจากฐานข้อมูลผู้ป่วย พร้อมตารางเปิดอ่านสำหรับแอดมิน
// =========================================================================

const APP_SYSTEM_VERSION = 'v2.82';
const FEEDBACK_STORAGE_KEY = 'medhistory_user_feedback_v1';

const FEEDBACK_CATEGORY_LABELS = {
  bug: '🐛 แจ้งบั๊ก / ระบบผิดพลาด',
  suggestion: '💡 ข้อเสนอแนะคำถาม / ข้อความ',
  performance: '⚡ ระบบช้า / หน้าจอเพี้ยน',
  other: '📝 อื่นๆ'
};

const FEEDBACK_STATUS_LABELS = {
  new: 'ใหม่',
  acknowledged: 'รับทราบแล้ว',
  resolved: 'แก้ไขแล้ว'
};

function fbEscapeHtml(str) {
  if (typeof escapeHtml === 'function') return escapeHtml(str);
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function fbFormatDateTime24h(isoStr) {
  const d = isoStr ? new Date(isoStr) : new Date();
  if (isNaN(d.getTime())) return '-';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

function loadFeedbackRecords() {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

function writeFeedbackRecordsLocal(records) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(Array.isArray(records) ? records : []));
  } catch (_) {}
}

function saveFeedbackRecord(record) {
  const list = loadFeedbackRecords();
  const normalized = {
    id: record.id || `fb-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    created_at: record.created_at || new Date().toISOString(),
    app_version: record.app_version || APP_SYSTEM_VERSION,
    cc_id: record.cc_id || 'system_general',
    cc_title: record.cc_title || 'ภาพรวมระบบ / ทั่วไป',
    source_role: record.source_role || 'doctor',
    source_screen: record.source_screen || 'doctor_report',
    category: record.category || 'suggestion',
    message: String(record.message || '').trim(),
    status: record.status || 'new'
  };
  list.unshift(normalized);
  writeFeedbackRecordsLocal(list);
  if (typeof window !== 'undefined' && window.ErStorageAdapter && typeof window.ErStorageAdapter.saveFeedback === 'function') {
    window.ErStorageAdapter.saveFeedback(normalized);
  }
  return normalized;
}

function updateFeedbackRecordStatus(id, status) {
  if (typeof currentUserRole !== 'undefined' && currentUserRole !== 'admin') {
    if (typeof showToast === 'function') showToast('🔒 เฉพาะผู้ดูแลระบบ (Admin) เท่านั้นที่สามารถปรับสถานะคำแนะนำได้');
    return false;
  }
  const allowed = new Set(['new', 'acknowledged', 'resolved']);
  if (!allowed.has(status)) return false;
  const list = loadFeedbackRecords();
  const target = list.find(r => r && r.id === id);
  if (target) {
    target.status = status;
    target.updated_at = new Date().toISOString();
    writeFeedbackRecordsLocal(list);
  }
  if (typeof window !== 'undefined' && window.ErStorageAdapter && typeof window.ErStorageAdapter.updateFeedbackStatus === 'function') {
    window.ErStorageAdapter.updateFeedbackStatus(id, status);
  }
  if (fbUiRefs.adminModal && !fbUiRefs.adminModal.classList.contains('hidden')) {
    renderFeedbackAdminTable();
  }
  syncFeedbackDockVisibility();
  return true;
}

async function syncFeedbackFromAdapter() {
  if (typeof window === 'undefined' || !window.ErStorageAdapter || typeof window.ErStorageAdapter.fetchFeedbacks !== 'function') {
    return loadFeedbackRecords();
  }
  const serverList = await window.ErStorageAdapter.fetchFeedbacks();
  if (!Array.isArray(serverList)) return loadFeedbackRecords();

  const localList = loadFeedbackRecords();
  const mergedMap = new Map();
  serverList.forEach(item => { if (item && item.id) mergedMap.set(item.id, item); });
  localList.forEach(item => {
    if (item && item.id && !mergedMap.has(item.id)) {
      mergedMap.set(item.id, item);
      window.ErStorageAdapter.saveFeedback(item);
    }
  });
  const merged = Array.from(mergedMap.values()).sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')));
  writeFeedbackRecordsLocal(merged);
  return merged;
}

function resolveCcMetaByIdOrCode(rawCc) {
  if (!rawCc || rawCc === 'system_general') {
    return { ccId: 'system_general', ccTitle: 'ภาพรวมระบบ / ทั่วไป' };
  }
  if (typeof resolveCcFormId === 'function' && typeof resolveCcTitleTh === 'function') {
    const fid = resolveCcFormId(rawCc) || rawCc;
    const ftitle = resolveCcTitleTh(fid) || resolveCcTitleTh(rawCc);
    if (ftitle) return { ccId: fid, ccTitle: ftitle };
  }
  if (typeof CHIEF_COMPLAINTS !== 'undefined' && Array.isArray(CHIEF_COMPLAINTS)) {
    const found = CHIEF_COMPLAINTS.find(c => c.id === rawCc || c.schemaCode === rawCc);
    if (found) return { ccId: found.id, ccTitle: found.titleTh };
  }
  return { ccId: rawCc, ccTitle: rawCc };
}

let _lastDoctorSubmitContext = null;

function resolveFeedbackContext(sourceScreen = 'doctor_report') {
  const role = (typeof currentUserRole !== 'undefined' && currentUserRole) ? currentUserRole : 'doctor';
  const effectiveRole = sourceScreen === 'patient_status' ? 'patient' : role;
  const ptList = (typeof patientDatabase !== 'undefined' && Array.isArray(patientDatabase)) ? patientDatabase : [];

  if (sourceScreen === 'patient_status') {
    const subId = typeof lastSubmittedPatientId !== 'undefined' ? lastSubmittedPatientId : null;
    const pt = subId ? ptList.find(p => p.id === subId) : null;
    const rawCc = pt?.chief_complaint || (typeof currentPatientFormCC !== 'undefined' ? currentPatientFormCC : '');
    const meta = resolveCcMetaByIdOrCode(rawCc);
    return {
      ccId: meta.ccId,
      ccTitle: pt?.chief_complaint_title || meta.ccTitle,
      sourceRole: 'patient',
      sourceScreen: 'patient_status'
    };
  }

  if (sourceScreen === 'doctor_post_submit') {
    if (_lastDoctorSubmitContext) {
      return {
        ccId: _lastDoctorSubmitContext.ccId,
        ccTitle: _lastDoctorSubmitContext.ccTitle,
        sourceRole: effectiveRole,
        sourceScreen: 'doctor_post_submit'
      };
    }
  }

  const actId = typeof activePatientId !== 'undefined' ? activePatientId : null;
  const actPt = actId ? ptList.find(p => p.id === actId) : null;
  const fallbackCc = (typeof currentView !== 'undefined' && currentView === 'patient' && typeof currentPatientFormCC !== 'undefined')
    ? currentPatientFormCC
    : (actPt?.chief_complaint || '');
  const meta = resolveCcMetaByIdOrCode(fallbackCc);
  return {
    ccId: meta.ccId,
    ccTitle: actPt?.chief_complaint_title || meta.ccTitle,
    sourceRole: effectiveRole,
    sourceScreen
  };
}

// --- Dynamic UI Elements (Referenced directly, NO literal dynamic getElementById!) ---
const fbUiRefs = {
  mounted: false,
  dock: null,
  dockAdminBtn: null,
  badge: null,
  postToast: null,
  postToastText: null,
  postToastTimer: null,
  feedbackModal: null,
  versionBadge: null,
  ccSelect: null,
  categorySelect: null,
  messageInput: null,
  sourceScreenInput: null,
  sourceRoleInput: null,
  adminModal: null,
  filterCc: null,
  filterVersion: null,
  filterStatus: null,
  filterQuery: null,
  adminTbody: null,
  adminCountLabel: null
};

function ensureFeedbackUiMounted() {
  if (fbUiRefs.mounted || typeof document === 'undefined' || !document.body) return;
  fbUiRefs.mounted = true;

  // 1. Doctor Report Bottom-Left Floating Dock
  const dock = document.createElement('div');
  dock.className = 'hidden fixed bottom-4 left-4 z-40 flex items-center space-x-2';
  dock.innerHTML = `
    <button type="button" data-fb="dockSendBtn" onclick="openUserFeedbackModal('doctor_report')"
      class="bg-slate-900/90 hover:bg-slate-800 text-white text-[11px] font-semibold px-3 py-2 rounded-full shadow-lg border border-slate-700 flex items-center space-x-1.5 transition cursor-pointer">
      <span>💬</span>
      <span>Feedback / แจ้งปัญหา</span>
    </button>
    <button type="button" data-fb="dockAdminBtn" onclick="openFeedbackAdminModal()"
      class="bg-white/95 hover:bg-slate-50 text-slate-800 text-[11px] font-semibold px-3 py-2 rounded-full shadow-lg border border-slate-300 flex items-center space-x-1.5 transition cursor-pointer">
      <span>📋</span>
      <span>ดูตาราง</span>
      <span data-fb="badge" class="hidden bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">0</span>
    </button>
  `;
  document.body.appendChild(dock);
  fbUiRefs.dock = dock;
  fbUiRefs.dockAdminBtn = dock.querySelector('[data-fb="dockAdminBtn"]');
  fbUiRefs.badge = dock.querySelector('[data-fb="badge"]');

  // 2. Doctor Post-Submit Non-Blocking Actionable Toast
  const postToast = document.createElement('div');
  postToast.className = 'hidden fixed bottom-4 right-4 z-40 max-w-sm bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between gap-3';
  postToast.innerHTML = `
    <div class="text-xs leading-snug">
      <div data-fb="postSubmitText" class="font-semibold text-emerald-300">✓ บันทึกข้อมูลเรียบร้อย</div>
      <div class="text-[11px] text-slate-300 mt-0.5">พบข้อผิดพลาดหรือจุดควรปรับปรุงในฟอร์มนี้หรือไม่?</div>
    </div>
    <div class="flex items-center space-x-1.5 flex-shrink-0">
      <button type="button" onclick="openUserFeedbackModal('doctor_post_submit')"
        class="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-[11px] px-2.5 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer">
        💬 แจ้งปัญหาฟอร์มนี้
      </button>
      <button type="button" onclick="dismissDoctorPostSubmitFeedbackToast()"
        class="text-slate-400 hover:text-white text-sm font-bold px-1.5 py-1 rounded cursor-pointer" title="ปิด">×</button>
    </div>
  `;
  document.body.appendChild(postToast);
  fbUiRefs.postToast = postToast;
  fbUiRefs.postToastText = postToast.querySelector('[data-fb="postSubmitText"]');

  // 3. Feedback Submission Modal
  const fbModal = document.createElement('div');
  fbModal.className = 'hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4';
  fbModal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
      <div class="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h3 class="text-base font-bold text-slate-900">💬 ส่งคำแนะนำ / แจ้งปัญหาการใช้งานระบบ</h3>
          <p class="text-[11px] text-slate-500 mt-0.5">ข้อมูลจะถูกจัดเก็บแยกจากประวัติคนไข้ เพื่อนำไปปรับปรุงระบบห้องฉุกเฉิน</p>
        </div>
        <button type="button" onclick="closeUserFeedbackModal()" class="text-slate-400 hover:text-slate-600 text-lg font-bold px-2 cursor-pointer">×</button>
      </div>

      <div class="bg-sky-50 border border-sky-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span class="text-sky-900 font-semibold">ตรวจจับบริบทอัตโนมัติ</span>
        <span data-fb="versionBadge" class="font-mono text-[11px] bg-white text-sky-800 border border-sky-200 px-2 py-0.5 rounded-md font-bold">Version: ${APP_SYSTEM_VERSION}</span>
      </div>

      <input type="hidden" data-fb="sourceScreen" value="doctor_report">
      <input type="hidden" data-fb="sourceRole" value="doctor">

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">อาการนำ (CC) ที่เกี่ยวข้อง:</label>
          <select data-fb="ccSelect" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500"></select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">หมวดหมู่คำแนะนำ:</label>
          <select data-fb="category" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500">
            <option value="bug">🐛 แจ้งบั๊ก / ระบบผิดพลาด</option>
            <option value="suggestion" selected>💡 ข้อเสนอแนะคำถาม / ข้อความ</option>
            <option value="performance">⚡ ระบบช้า / หน้าจอเพี้ยน</option>
            <option value="other">📝 อื่นๆ</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">รายละเอียดปัญหาหรือคำแนะนำ <span class="text-rose-500">*</span>:</label>
        <textarea data-fb="message" rows="4" placeholder="พิมพ์คำแนะนำ ข้อความที่ควรแก้ไข หรือปัญหาที่พบ..."
          class="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"></textarea>
      </div>

      <div class="flex items-center justify-end space-x-2 pt-2">
        <button type="button" onclick="closeUserFeedbackModal()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer">ยกเลิก</button>
        <button type="button" onclick="submitUserFeedbackForm()" class="px-5 py-2 bg-medical-600 hover:bg-medical-700 text-white rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer">ส่งคำแนะนำ</button>
      </div>
    </div>
  `;
  document.body.appendChild(fbModal);
  fbUiRefs.feedbackModal = fbModal;
  fbUiRefs.versionBadge = fbModal.querySelector('[data-fb="versionBadge"]');
  fbUiRefs.ccSelect = fbModal.querySelector('[data-fb="ccSelect"]');
  fbUiRefs.categorySelect = fbModal.querySelector('[data-fb="category"]');
  fbUiRefs.messageInput = fbModal.querySelector('[data-fb="message"]');
  fbUiRefs.sourceScreenInput = fbModal.querySelector('[data-fb="sourceScreen"]');
  fbUiRefs.sourceRoleInput = fbModal.querySelector('[data-fb="sourceRole"]');

  // 4. Admin Feedback Review Table Modal
  const adminModal = document.createElement('div');
  adminModal.className = 'hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5';
  adminModal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
      <div class="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
        <div>
          <h3 class="text-base font-bold text-slate-900">📋 ตารางรวมคำแนะนำและปัญหาจากผู้ใช้ (User Feedback Log)</h3>
          <p data-fb="adminCountLabel" class="text-xs text-slate-500 mt-0.5">ทั้งหมด 0 รายการ</p>
        </div>
        <div class="flex items-center space-x-2">
          <button type="button" onclick="refreshFeedbackAdminTable()" class="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer">🔄 รีเฟรช</button>
          <button type="button" onclick="exportFeedbackCsv()" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer">⬇️ Export CSV</button>
          <button type="button" onclick="closeFeedbackAdminModal()" class="text-slate-400 hover:text-slate-700 text-lg font-bold px-2 cursor-pointer">×</button>
        </div>
      </div>

      <div class="p-3 sm:p-4 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-4 gap-2 bg-white text-xs">
        <select data-fb="filterCc" onchange="renderFeedbackAdminTable()" class="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-800 font-medium">
          <option value="all">ทุกอาการนำ (CC)</option>
        </select>
        <select data-fb="filterVersion" onchange="renderFeedbackAdminTable()" class="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-800 font-medium">
          <option value="all">ทุก Version</option>
        </select>
        <select data-fb="filterStatus" onchange="renderFeedbackAdminTable()" class="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-800 font-medium">
          <option value="all">ทุกสถานะ</option>
          <option value="new">ใหม่</option>
          <option value="acknowledged">รับทราบแล้ว</option>
          <option value="resolved">แก้ไขแล้ว</option>
        </select>
        <input type="text" data-fb="filterQuery" oninput="renderFeedbackAdminTable()" placeholder="ค้นหาคำแนะนำ / CC..."
          class="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500">
      </div>

      <div class="flex-1 overflow-auto p-3 sm:p-4">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="border-b border-slate-200 text-slate-600 bg-slate-50">
              <th class="py-2.5 px-3 font-bold whitespace-nowrap">1. วันที่แจ้ง</th>
              <th class="py-2.5 px-3 font-bold whitespace-nowrap">2. Version</th>
              <th class="py-2.5 px-3 font-bold whitespace-nowrap">3. จาก CC อะไร</th>
              <th class="py-2.5 px-3 font-bold">4. ปัญหาหรือคำแนะนำที่พบ</th>
              <th class="py-2.5 px-3 font-bold whitespace-nowrap">สถานะ</th>
            </tr>
          </thead>
          <tbody data-fb="adminTbody" class="divide-y divide-slate-100"></tbody>
        </table>
      </div>
    </div>
  `;
  document.body.appendChild(adminModal);
  fbUiRefs.adminModal = adminModal;
  fbUiRefs.filterCc = adminModal.querySelector('[data-fb="filterCc"]');
  fbUiRefs.filterVersion = adminModal.querySelector('[data-fb="filterVersion"]');
  fbUiRefs.filterStatus = adminModal.querySelector('[data-fb="filterStatus"]');
  fbUiRefs.filterQuery = adminModal.querySelector('[data-fb="filterQuery"]');
  fbUiRefs.adminTbody = adminModal.querySelector('[data-fb="adminTbody"]');
  fbUiRefs.adminCountLabel = adminModal.querySelector('[data-fb="adminCountLabel"]');
}

function populateCcDropdownOptions(selectEl, includeAllOption) {
  if (!selectEl) return;
  const opts = [];
  if (includeAllOption) {
    opts.push('<option value="all">ทุกอาการนำ (CC)</option>');
  }
  opts.push('<option value="system_general">ภาพรวมระบบ / ทั่วไป (system_general)</option>');
  if (typeof CHIEF_COMPLAINTS !== 'undefined' && Array.isArray(CHIEF_COMPLAINTS)) {
    CHIEF_COMPLAINTS.forEach(cc => {
      opts.push(`<option value="${fbEscapeHtml(cc.id)}">${fbEscapeHtml(cc.titleTh)} (${fbEscapeHtml(cc.id)})</option>`);
    });
  }
  selectEl.innerHTML = opts.join('');
}

function dismissDoctorPostSubmitFeedbackToast() {
  if (fbUiRefs.postToastTimer && typeof clearTimeout === 'function') {
    clearTimeout(fbUiRefs.postToastTimer);
    fbUiRefs.postToastTimer = null;
  }
  if (fbUiRefs.postToast) fbUiRefs.postToast.classList.add('hidden');
}

function showDoctorPostSubmitFeedbackToast(ccTitle) {
  ensureFeedbackUiMounted();
  if (!fbUiRefs.postToast) return;
  if (fbUiRefs.postToastText) {
    fbUiRefs.postToastText.textContent = `✓ บันทึกประวัติ [${ccTitle || 'ภาพรวมระบบ'}] สำเร็จ`;
  }
  fbUiRefs.postToast.classList.remove('hidden');
  if (fbUiRefs.postToastTimer && typeof clearTimeout === 'function') clearTimeout(fbUiRefs.postToastTimer);
  if (typeof setTimeout === 'function') {
    fbUiRefs.postToastTimer = setTimeout(() => {
      if (fbUiRefs.postToast) fbUiRefs.postToast.classList.add('hidden');
    }, 8000);
  }
}

function openUserFeedbackModal(sourceScreen = 'doctor_report') {
  ensureFeedbackUiMounted();
  dismissDoctorPostSubmitFeedbackToast();
  const ctx = resolveFeedbackContext(sourceScreen);
  if (fbUiRefs.versionBadge) fbUiRefs.versionBadge.textContent = `Version: ${APP_SYSTEM_VERSION}`;
  if (fbUiRefs.sourceScreenInput) fbUiRefs.sourceScreenInput.value = ctx.sourceScreen;
  if (fbUiRefs.sourceRoleInput) fbUiRefs.sourceRoleInput.value = ctx.sourceRole;
  populateCcDropdownOptions(fbUiRefs.ccSelect, false);
  if (fbUiRefs.ccSelect) {
    fbUiRefs.ccSelect.value = ctx.ccId || 'system_general';
    if (!fbUiRefs.ccSelect.value) fbUiRefs.ccSelect.value = 'system_general';
  }
  if (fbUiRefs.messageInput) fbUiRefs.messageInput.value = '';
  if (fbUiRefs.feedbackModal) fbUiRefs.feedbackModal.classList.remove('hidden');
  if (fbUiRefs.messageInput && typeof fbUiRefs.messageInput.focus === 'function') fbUiRefs.messageInput.focus();
}

function closeUserFeedbackModal() {
  if (fbUiRefs.feedbackModal) fbUiRefs.feedbackModal.classList.add('hidden');
}

function submitUserFeedbackForm() {
  ensureFeedbackUiMounted();
  const msg = fbUiRefs.messageInput ? fbUiRefs.messageInput.value.trim() : '';
  if (!msg) {
    if (typeof showToast === 'function') showToast('⚠️ กรุณาพิมพ์คำแนะนำหรือปัญหาที่พบก่อนส่ง');
    return null;
  }
  const selectedCc = fbUiRefs.ccSelect ? fbUiRefs.ccSelect.value : 'system_general';
  const meta = resolveCcMetaByIdOrCode(selectedCc);
  const category = fbUiRefs.categorySelect ? fbUiRefs.categorySelect.value : 'suggestion';
  const sourceScreen = fbUiRefs.sourceScreenInput ? fbUiRefs.sourceScreenInput.value : 'doctor_report';
  const sourceRole = fbUiRefs.sourceRoleInput ? fbUiRefs.sourceRoleInput.value : 'doctor';

  const saved = saveFeedbackRecord({
    app_version: APP_SYSTEM_VERSION,
    cc_id: meta.ccId,
    cc_title: meta.ccTitle,
    source_role: sourceRole,
    source_screen: sourceScreen,
    category,
    message: msg,
    status: 'new'
  });

  closeUserFeedbackModal();
  syncFeedbackDockVisibility();
  if (typeof showToast === 'function') {
    showToast('✅ บันทึกคำแนะนำเรียบร้อยแล้ว ขอบคุณสำหรับข้อมูลครับ');
  }
  return saved;
}

function getFilteredFeedbackRecords() {
  const list = loadFeedbackRecords();
  const ccVal = fbUiRefs.filterCc ? fbUiRefs.filterCc.value : 'all';
  const verVal = fbUiRefs.filterVersion ? fbUiRefs.filterVersion.value : 'all';
  const stVal = fbUiRefs.filterStatus ? fbUiRefs.filterStatus.value : 'all';
  const query = fbUiRefs.filterQuery ? fbUiRefs.filterQuery.value.trim().toLowerCase() : '';

  return list
    .filter(r => {
      if (!r) return false;
      if (ccVal && ccVal !== 'all' && r.cc_id !== ccVal) return false;
      if (verVal && verVal !== 'all' && r.app_version !== verVal) return false;
      if (stVal && stVal !== 'all' && r.status !== stVal) return false;
      if (query) {
        const hay = `${r.message || ''} ${r.cc_title || ''} ${r.cc_id || ''} ${r.app_version || ''}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    })
    .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')));
}

function renderFeedbackAdminTable() {
  ensureFeedbackUiMounted();
  const all = loadFeedbackRecords();
  if (fbUiRefs.filterVersion) {
    const prevVer = fbUiRefs.filterVersion.value || 'all';
    const versions = Array.from(new Set(all.map(r => r?.app_version).filter(Boolean)));
    if (!versions.includes(APP_SYSTEM_VERSION)) versions.unshift(APP_SYSTEM_VERSION);
    fbUiRefs.filterVersion.innerHTML = ['<option value="all">ทุก Version</option>']
      .concat(versions.map(v => `<option value="${fbEscapeHtml(v)}">${fbEscapeHtml(v)}</option>`))
      .join('');
    fbUiRefs.filterVersion.value = versions.includes(prevVer) ? prevVer : 'all';
  }

  const rows = getFilteredFeedbackRecords();
  if (fbUiRefs.adminCountLabel) {
    fbUiRefs.adminCountLabel.textContent = `แสดง ${rows.length} จากทั้งหมด ${all.length} รายการ`;
  }
  if (!fbUiRefs.adminTbody) return;
  if (rows.length === 0) {
    fbUiRefs.adminTbody.innerHTML = `
      <tr>
        <td colspan="5" class="py-8 text-center text-slate-400">ยังไม่มีข้อมูลคำแนะนำที่ตรงตามตัวกรอง</td>
      </tr>
    `;
    return;
  }

  const roleBadgeMap = {
    patient: '<span class="bg-sky-100 text-sky-800 text-[10px] font-semibold px-1.5 py-0.5 rounded">คนไข้</span>',
    doctor: '<span class="bg-indigo-100 text-indigo-800 text-[10px] font-semibold px-1.5 py-0.5 rounded">แพทย์</span>',
    admin: '<span class="bg-purple-100 text-purple-800 text-[10px] font-semibold px-1.5 py-0.5 rounded">Admin</span>'
  };

  fbUiRefs.adminTbody.innerHTML = rows.map(r => {
    const safeId = fbEscapeHtml(r.id);
    const dt = fbFormatDateTime24h(r.created_at);
    const ver = fbEscapeHtml(r.app_version || APP_SYSTEM_VERSION);
    const ccTh = fbEscapeHtml(r.cc_title || 'ภาพรวมระบบ / ทั่วไป');
    const ccCode = fbEscapeHtml(r.cc_id || 'system_general');
    const catLabel = fbEscapeHtml(FEEDBACK_CATEGORY_LABELS[r.category] || r.category || '');
    const roleTag = roleBadgeMap[r.source_role] || roleBadgeMap.doctor;
    const msgHtml = fbEscapeHtml(r.message || '').replace(/\n/g, '<br>');
    const statusOpts = ['new', 'acknowledged', 'resolved'].map(st =>
      `<option value="${st}"${r.status === st ? ' selected' : ''}>${fbEscapeHtml(FEEDBACK_STATUS_LABELS[st])}</option>`
    ).join('');

    return `
      <tr class="hover:bg-slate-50/80 align-top">
        <td class="py-2.5 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">${dt}</td>
        <td class="py-2.5 px-3 font-mono text-[11px] font-bold text-slate-700 whitespace-nowrap">${ver}</td>
        <td class="py-2.5 px-3 whitespace-nowrap">
          <div class="font-semibold text-slate-800">${ccTh}</div>
          <div class="text-[10px] font-mono text-slate-400">${ccCode}</div>
        </td>
        <td class="py-2.5 px-3 text-slate-800">
          <div class="flex flex-wrap items-center gap-1.5 mb-1">
            ${roleTag}
            <span class="bg-slate-100 text-slate-700 text-[10px] font-medium px-1.5 py-0.5 rounded">${catLabel}</span>
          </div>
          <div class="leading-relaxed">${msgHtml}</div>
        </td>
        <td class="py-2.5 px-3 whitespace-nowrap">
          <select onchange="updateFeedbackRecordStatus('${safeId}', this.value)"
            class="bg-white border border-slate-300 rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-700">
            ${statusOpts}
          </select>
        </td>
      </tr>
    `;
  }).join('');
}

async function refreshFeedbackAdminTable() {
  await syncFeedbackFromAdapter();
  renderFeedbackAdminTable();
}

function openFeedbackAdminModal() {
  if (typeof currentUserRole === 'undefined' || currentUserRole !== 'admin') {
    if (typeof showToast === 'function') showToast('🔒 เฉพาะผู้ดูแลระบบ (Admin) เท่านั้นที่สามารถเปิดดูตารางคำแนะนำได้');
    return;
  }
  ensureFeedbackUiMounted();
  populateCcDropdownOptions(fbUiRefs.filterCc, true);
  renderFeedbackAdminTable();
  if (fbUiRefs.adminModal) fbUiRefs.adminModal.classList.remove('hidden');
  refreshFeedbackAdminTable();
}

function closeFeedbackAdminModal() {
  if (fbUiRefs.adminModal) fbUiRefs.adminModal.classList.add('hidden');
}

function buildFeedbackCsvString(records) {
  const escCsv = (val) => {
    const s = String(val ?? '').replace(/\r?\n/g, ' ');
    return `"${s.replace(/"/g, '""')}"`;
  };
  const header = ['วันที่แจ้ง', 'Version ระบบ', 'รหัส CC', 'ชื่อ CC', 'บทบาทผู้แจ้ง', 'จุดแจ้ง', 'หมวดหมู่', 'ปัญหาหรือคำแนะนำที่พบ', 'สถานะ'];
  const rows = (Array.isArray(records) ? records : []).map(r => [
    fbFormatDateTime24h(r.created_at),
    r.app_version || APP_SYSTEM_VERSION,
    r.cc_id || 'system_general',
    r.cc_title || 'ภาพรวมระบบ / ทั่วไป',
    r.source_role || 'doctor',
    r.source_screen || '',
    FEEDBACK_CATEGORY_LABELS[r.category] || r.category || '',
    r.message || '',
    FEEDBACK_STATUS_LABELS[r.status] || r.status || 'new'
  ]);
  return '\uFEFF' + [header, ...rows].map(row => row.map(escCsv).join(',')).join('\r\n');
}

function exportFeedbackCsv() {
  const rows = getFilteredFeedbackRecords();
  const csvStr = buildFeedbackCsvString(rows);
  if (typeof Blob !== 'undefined' && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function' && typeof document !== 'undefined') {
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `er_user_feedback_${APP_SYSTEM_VERSION}.csv`;
    a.click();
    if (typeof URL.revokeObjectURL === 'function') URL.revokeObjectURL(url);
  }
  return csvStr;
}

function syncFeedbackDockVisibility() {
  if (typeof document === 'undefined') return;
  const view = typeof currentView !== 'undefined' ? currentView : '';
  const role = typeof currentUserRole !== 'undefined' ? currentUserRole : 'doctor';
  const showDock = view === 'doctor' && role !== 'patient';
  const isAdmin = role === 'admin';

  if (showDock) ensureFeedbackUiMounted();
  if (fbUiRefs.dock) {
    fbUiRefs.dock.classList.toggle('hidden', !showDock);
  }
  if (fbUiRefs.dockAdminBtn) {
    fbUiRefs.dockAdminBtn.classList.toggle('hidden', !isAdmin);
  }
  if (fbUiRefs.badge) {
    const newCount = loadFeedbackRecords().filter(r => r && r.status === 'new').length;
    fbUiRefs.badge.textContent = String(newCount);
    fbUiRefs.badge.classList.toggle('hidden', !isAdmin || newCount <= 0);
  }
}

(function wireFeedbackModule() {
  const globalObj = typeof window !== 'undefined' ? window : globalThis;
  Object.assign(globalObj, {
    APP_SYSTEM_VERSION,
    FEEDBACK_STORAGE_KEY,
    loadFeedbackRecords,
    saveFeedbackRecord,
    updateFeedbackRecordStatus,
    resolveFeedbackContext,
    openUserFeedbackModal,
    closeUserFeedbackModal,
    submitUserFeedbackForm,
    openFeedbackAdminModal,
    closeFeedbackAdminModal,
    refreshFeedbackAdminTable,
    renderFeedbackAdminTable,
    buildFeedbackCsvString,
    exportFeedbackCsv,
    syncFeedbackDockVisibility,
    dismissDoctorPostSubmitFeedbackToast,
    showDoctorPostSubmitFeedbackToast
  });

  if (typeof document === 'undefined') return;

  const _fbOrigNavigateTo = typeof navigateTo === 'function' ? navigateTo : null;
  const _fbOrigUpdateRoleUi = typeof updateRoleUiState === 'function' ? updateRoleUiState : null;
  const _fbOrigSelectPatient = typeof selectPatient === 'function' ? selectPatient : null;
  const _fbOrigHandleSubmit = typeof handlePatientSubmit === 'function' ? handlePatientSubmit : null;

  if (_fbOrigNavigateTo) {
    navigateTo = function (view) {
      const res = _fbOrigNavigateTo(view);
      syncFeedbackDockVisibility();
      return res;
    };
  }
  if (_fbOrigUpdateRoleUi) {
    updateRoleUiState = function () {
      const res = _fbOrigUpdateRoleUi();
      syncFeedbackDockVisibility();
      return res;
    };
  }
  if (_fbOrigSelectPatient) {
    selectPatient = function (patientId) {
      const res = _fbOrigSelectPatient(patientId);
      syncFeedbackDockVisibility();
      return res;
    };
  }
  if (_fbOrigHandleSubmit) {
    handlePatientSubmit = function (e) {
      const roleBefore = typeof currentUserRole !== 'undefined' ? currentUserRole : 'doctor';
      const ccBefore = typeof currentPatientFormCC !== 'undefined' ? currentPatientFormCC : '';
      const prevSubId = typeof lastSubmittedPatientId !== 'undefined' ? lastSubmittedPatientId : null;
      const prevPtList = (typeof patientDatabase !== 'undefined' && Array.isArray(patientDatabase)) ? patientDatabase : [];
      const prevSubTs = prevSubId ? (prevPtList.find(p => p.id === prevSubId)?.timestamp || '') : '';

      const res = _fbOrigHandleSubmit(e);

      if (roleBefore !== 'patient') {
        const afterSubId = typeof lastSubmittedPatientId !== 'undefined' ? lastSubmittedPatientId : null;
        const afterPt = afterSubId ? prevPtList.find(p => p.id === afterSubId) : null;
        const actuallySubmitted = Boolean(
          afterPt && (afterSubId !== prevSubId || (afterPt.timestamp && afterPt.timestamp !== prevSubTs))
        );
        if (actuallySubmitted) {
          const meta = resolveCcMetaByIdOrCode(afterPt.chief_complaint || ccBefore);
          _lastDoctorSubmitContext = {
            ccId: meta.ccId,
            ccTitle: afterPt.chief_complaint_title || meta.ccTitle
          };
          showDoctorPostSubmitFeedbackToast(_lastDoctorSubmitContext.ccTitle);
          syncFeedbackDockVisibility();
        }
      }
      return res;
    };
  }
})();
