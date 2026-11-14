// =========================================================================

// CORE ENGINE (core_engine.js) — LOCKED UNDER CORE SYSTEM FREEZE

// ห้ามแก้ไขไฟล์นี้เมื่อเพิ่ม Chief Complaint (CC) ใหม่ ให้สร้างเฉพาะไฟล์ใน cc_modules/

// =========================================================================

/**
 * ============================================================================
 * CORE APPLICATION LOGIC, RBAC, FORM HYDRATION & AI CONSULTANT (app.js)
 * ============================================================================
 * Project: ระบบผู้ช่วยซักประวัติอัจฉริยะสำหรับห้องฉุกเฉิน (Smart Triage & Clinical Intake Assistant)
 * Target Facility: ห้องฉุกเฉิน โรงพยาบาลราชบุรี (Ratchaburi Hospital ER)
 *
 * Modules included in this file:
 * 1. OWASP Top 10 Security & XSS Sanitization Utilities (escapeHtml)
 * 2. Database & State Management (localStorage + 12 Seed Cases)
 * 3. Role-Based Access Control (RBAC: Patient QR / ER Doctor / Admin) & Staff Login
 * 4. Triage QR Queue Pass Handler (URL Params + Simulated QR Ticket Generator)
 * 5. Patient Queue Status Screen & Self-Edit Workflow
 * 6. Bidirectional Form Hydration Engine (populateFormFromPatient for all 4 CCs)
 * 7. Dynamic Progressive Disclosure & Form Submission Engine
 * 8. Doctor Clinical Dashboard, Red Flag Engine & Contraindication Screening
 * 9. Modular Doctor Text & JSON Dispatcher (AI Consultant logic moved to ai_consultant_core.js)
 * ============================================================================
 */

// =========================================================================
// 1. APPLICATION STATE & DATABASE CONFIGURATION
// (Security & Universal Date/Time Utilities live in clinical_knowledge_core.js)
// =========================================================================
const DB_STORAGE_KEY = 'medhistory_patients_v16';
const AI_KEY_STORAGE = 'medhistory_ai_api_key_v1';

// Canonical Registry of Active Chief Complaints (shared with clinical_knowledge_core.js; dynamically populated for unlimited CCs)
Object.assign(CC_REGISTRY, {
  fever: {
    formId: 'fever',
    recordKey: 'fever_and_chills',
    sectionId: 'feverQuestionnaireSection',
    titleTh: 'ไข้ / หนาวสั่น',
    headerTh: 'แบบฟอร์มซักประวัติ: มีไข้ / หนาวสั่น',
    headerEn: '(Fever / Chills)',
    badgeHtml: '<i data-lucide="flame" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"></i><span class="whitespace-nowrap">ไข้ / หนาวสั่น</span>'
  },
  abdpain: {
    formId: 'abdpain',
    recordKey: 'abdominal_pain',
    sectionId: 'abdpainQuestionnaireSection',
    titleTh: 'ปวดท้อง',
    headerTh: 'แบบฟอร์มซักประวัติ: ปวดท้อง',
    headerEn: '(Abdominal pain)',
    badgeHtml: '<i data-lucide="utensils" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"></i><span class="whitespace-nowrap">ปวดท้อง</span>'
  },
  chestpain: {
    formId: 'chestpain',
    recordKey: 'chest_pain',
    sectionId: 'chestpainQuestionnaireSection',
    titleTh: 'เจ็บแน่นหน้าอก',
    headerTh: 'แบบฟอร์มซักประวัติ: เจ็บแน่นหน้าอก',
    headerEn: '(Chest pain / Chest discomfort)',
    badgeHtml: '<i data-lucide="heart" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"></i><span class="whitespace-nowrap">เจ็บแน่นหน้าอก</span>'
  },
  dyspnea: {
    formId: 'dyspnea',
    recordKey: 'dyspnea',
    sectionId: 'dyspneaQuestionnaireSection',
    titleTh: 'เหนื่อย / หายใจหอบเหนื่อย / หายใจลำบาก',
    headerTh: 'แบบฟอร์มซักประวัติ: เหนื่อย / หายใจหอบเหนื่อย / หายใจลำบาก',
    headerEn: '(Dyspnea / Shortness of breath)',
    badgeHtml: '<i data-lucide="wind" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"></i><span class="whitespace-nowrap">หายใจหอบเหนื่อย</span>'
  },
  dizziness: {
    formId: 'dizziness',
    recordKey: 'dizziness',
    sectionId: 'dizzinessQuestionnaireSection',
    titleTh: 'เวียนศีรษะ / บ้านหมุน',
    headerTh: 'แบบฟอร์มซักประวัติ: เวียนศีรษะ / บ้านหมุน',
    headerEn: '(Dizziness / Vertigo)',
    badgeHtml: '<i data-lucide="compass" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"></i><span class="whitespace-nowrap">เวียนศีรษะ / บ้านหมุน</span>'
  },
  headache: {
    formId: 'headache',
    recordKey: 'headache',
    sectionId: 'headacheQuestionnaireSection',
    titleTh: 'ปวดศีรษะ',
    headerTh: 'แบบฟอร์มซักประวัติ: ปวดศีรษะ',
    headerEn: '(Headache)',
    badgeHtml: '<i data-lucide="frown" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"></i><span class="whitespace-nowrap">ปวดศีรษะ</span>'
  },
  stroke_deficit: {
    formId: 'stroke_deficit',
    recordKey: 'stroke_deficit',
    sectionId: 'strokeQuestionnaireSection',
    titleTh: 'ปากเบี้ยว อ่อนแรง ชา ข้างใดข้างหนึ่ง พูดไม่ชัด',
    headerTh: 'แบบฟอร์มซักประวัติ: ปากเบี้ยว อ่อนแรง ชา ข้างใดข้างหนึ่ง พูดไม่ชัด',
    headerEn: '(Acute Stroke / Focal Neurological Deficit)',
    badgeHtml: '<i data-lucide="brain" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"></i><span class="whitespace-nowrap">ปากเบี้ยว / อ่อนแรง / ชา</span>'
  },
  seizure: {
    formId: 'seizure',
    recordKey: 'seizure',
    sectionId: 'seizureQuestionnaireSection',
    titleTh: 'ชัก / เกร็งกระตุก',
    headerTh: 'แบบฟอร์มซักประวัติ: ชัก / เกร็งกระตุก',
    headerEn: '(Seizure / Convulsion / TLOC Differential)',
    badgeHtml: '<i data-lucide="zap" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"></i><span class="whitespace-nowrap">ชัก / เกร็งกระตุก</span>'
  },
  syncope: {
    formId: 'syncope',
    recordKey: 'syncope',
    sectionId: 'syncopeQuestionnaireSection',
    titleTh: 'หมดสติ / วูบ / เป็นลม',
    headerTh: 'แบบฟอร์มซักประวัติ: หมดสติ / วูบ / เป็นลม',
    headerEn: '(Syncope / Transient Loss of Consciousness - TLOC)',
    badgeHtml: '<i data-lucide="sparkles" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"></i><span class="whitespace-nowrap">หมดสติ / วูบ / เป็นลม</span>'
  },
  altered_mental: {
    formId: 'altered_mental',
    recordKey: 'altered_mental',
    sectionId: 'alteredMentalQuestionnaireSection',
    titleTh: 'ซึมลง / สับสนเฉียบพลัน / ระดับความรู้สึกตัวเปลี่ยนแปลง',
    headerTh: 'แบบฟอร์มซักประวัติ: ซึมลง / สับสนเฉียบพลัน / ระดับความรู้สึกตัวเปลี่ยนแปลง',
    headerEn: '(Altered Mental Status / Acute Confusion / Delirium / Coma)',
    badgeHtml: '<i data-lucide="help-circle" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"></i><span class="whitespace-nowrap">ซึมลง / สับสน</span>'
  },
  vomiting: {
    formId: 'vomiting',
    recordKey: 'vomiting',
    sectionId: 'vomitingQuestionnaireSection',
    titleTh: 'คลื่นไส้ / อาเจียนรุนแรง',
    headerTh: 'แบบฟอร์มซักประวัติ: คลื่นไส้ / อาเจียนรุนแรง',
    headerEn: '(Nausea & Severe Vomiting / Intractable Vomiting)',
    badgeHtml: '<i data-lucide="frown" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"></i><span class="whitespace-nowrap">คลื่นไส้ / อาเจียนรุนแรง</span>'
  }
});

function ensureCcRegistryEntry(ccIdOrCode) {
  if (!ccIdOrCode) return null;
  if (Object.prototype.hasOwnProperty.call(CC_REGISTRY, ccIdOrCode)) return CC_REGISTRY[ccIdOrCode];
  const dynMod = typeof getCcModule === 'function' ? getCcModule(ccIdOrCode) : null;
  const ccEntry = typeof CHIEF_COMPLAINTS !== 'undefined'
    ? CHIEF_COMPLAINTS.find(c => c.id === (dynMod ? dynMod.id : ccIdOrCode) || c.schemaCode === ccIdOrCode)
    : null;
  const targetMod = dynMod || (ccEntry && typeof getCcModule === 'function' ? getCcModule(ccEntry.id) : null);
  if (!targetMod) return null;
  if (!Object.prototype.hasOwnProperty.call(CC_REGISTRY, targetMod.id)) {
    CC_REGISTRY[targetMod.id] = {
      formId: targetMod.id,
      recordKey: targetMod.recordCc || (ccEntry ? ccEntry.schemaCode : targetMod.id),
      sectionId: targetMod.sectionDomId || `${targetMod.id}QuestionnaireSection`,
      titleTh: targetMod.titleTh || (ccEntry ? ccEntry.titleTh : targetMod.id),
      headerTh: targetMod.headerTh || `แบบฟอร์มซักประวัติ: ${targetMod.titleTh || (ccEntry ? ccEntry.titleTh : targetMod.id)}`,
      headerEn: targetMod.headerEn || (ccEntry ? `(${ccEntry.titleEn})` : ''),
      badgeHtml: targetMod.patientBadgeHtml || `<i data-lucide="${ccEntry ? ccEntry.icon : 'activity'}" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"></i><span class="whitespace-nowrap">${targetMod.titleTh || (ccEntry ? ccEntry.titleTh : targetMod.id)}</span>`
    };
  }
  return CC_REGISTRY[targetMod.id];
}

function resolveCcFormId(ccIdOrCode) {
  const reg = ensureCcRegistryEntry(ccIdOrCode);
  if (reg) return reg.formId;
  const legacyAlias = { altered_mental_status: 'altered_mental', severe_nausea_vomiting: 'vomiting' };
  return legacyAlias[ccIdOrCode] || null;
}

function resolveCcTitleTh(ccIdOrCode) {
  if (!ccIdOrCode) return '';
  const reg = ensureCcRegistryEntry(ccIdOrCode);
  if (reg && reg.titleTh) return reg.titleTh;
  const ccEntry = typeof CHIEF_COMPLAINTS !== 'undefined'
    ? CHIEF_COMPLAINTS.find(c => c.id === ccIdOrCode || c.schemaCode === ccIdOrCode)
    : null;
  return ccEntry ? ccEntry.titleTh : '';
}

if (typeof CC_MODULES !== 'undefined') {
  Object.values(CC_MODULES).forEach(mod => { if (mod && mod.id) ensureCcRegistryEntry(mod.id); });
}

function sanitizePatientRecord(p) {
  if (!p || typeof p !== 'object') return p;
  if (!Array.isArray(p.underlying)) p.underlying = ['ปฏิเสธโรคประจำตัว'];
  if (!p.doctor_notes || typeof p.doctor_notes !== 'object') {
    p.doctor_notes = { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' };
  }
  if (typeof isSeedPatientRecord === 'function' && isSeedPatientRecord(p)) {
    if (!p.vital_signs || (typeof isLegacyStuckDefaultVitals === 'function' && isLegacyStuckDefaultVitals(p.vital_signs))) {
      p.vital_signs = deriveSeedPatientVitalSigns(p);
    }
  } else if (typeof isLegacyStuckDefaultVitals === 'function' && isLegacyStuckDefaultVitals(p.vital_signs)) {
    p.vital_signs = null;
  }
  if (!p.esi_level) {
    const q = String(p.queue_number || '');
    p.esi_level = (q.startsWith('A-') || q.startsWith('E1-')) ? 1
      : (q.startsWith('B-') || q.startsWith('E2-')) ? 2
      : (q.startsWith('C-') || q.startsWith('E3-')) ? 3
      : (q.startsWith('D-') || q.startsWith('E4-')) ? 4
      : (q.startsWith('E-') || q.startsWith('E5-')) ? 5 : 3;
  }
  ['abdpainLmpDate', 'strokeExactDate', 'strokeLsnDate', 'strokeDiscoveryDate', 'syncopeLmpDate', 'alteredMentalLsnDate', 'vomitingLmpDate'].forEach(df => {
    if (p[df]) p[df] = formatDateDdMmYyyy(p[df]);
  });
  ['strokeExactTime', 'strokeLsnTime', 'strokeDiscoveryTime', 'alteredMentalLsnTime'].forEach(tf => {
    if (p[tf]) p[tf] = formatTime24h(p[tf]);
  });
  const ccMod = typeof getCcModule === 'function' ? getCcModule(p.chief_complaint) : null;
  if (ccMod) {
    if (Array.isArray(ccMod.dateFields)) {
      ccMod.dateFields.forEach(df => { if (p[df]) p[df] = formatDateDdMmYyyy(p[df]); });
    }
    if (Array.isArray(ccMod.timeFields)) {
      ccMod.timeFields.forEach(tf => { if (p[tf]) p[tf] = formatTime24h(p[tf]); });
    }
  }
  return p;
}

let patientDatabase = [];
let activePatientId = null;
let currentQueueFilter = 'waiting'; // 'waiting' or 'completed'
let currentView = 'doctor'; // 'landing' | 'patient' | 'patientStatus' | 'doctor'
let currentTextFormat = 'rapid'; // 'rapid' or 'narrative'
let currentPatientFormCC = 'abdpain';

// RBAC & Staff Authentication State (OWASP A01: Broken Access Control Prevention)
let currentUserRole = 'doctor'; // 'patient' | 'doctor' | 'admin'
let isStaffAuthenticated = true; // Default true for instant demo; can lock to test Staff Login modal
let staffDisplayName = 'นพ.เวรฉุกเฉิน (ER Attending)';
let pendingLoginRole = 'doctor';

// Triage QR Code Queue Pass & Edit Mode State (Option 2: name, age, gender omitted from QR)
let activeQrQueuePass = {
  queue_number: 'E3-054',
  hn: '6788412',
  title: '',
  name: '',
  age: '',
  gender: '',
  esi: 3,
  vital_signs: null
};
let editingPatientId = null; // Non-null when Patient or Doctor is editing an existing patient's history
let lastSubmittedPatientId = null; // Tracks the patient submitted in the current Patient QR session

// Initialize Database from localStorage or Seeds (from clinical_knowledge.js)
function initDatabase() {
  const stored = localStorage.getItem(DB_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        patientDatabase = parsed.map(sanitizePatientRecord);
        saveDatabase();
      } else {
        patientDatabase = getSeedPatients().map(sanitizePatientRecord);
        saveDatabase();
      }
    } catch (e) {
      patientDatabase = getSeedPatients().map(sanitizePatientRecord);
      saveDatabase();
    }
  } else {
    patientDatabase = getSeedPatients().map(sanitizePatientRecord);
    saveDatabase();
  }

  // Set active patient to first waiting patient
  const firstWaiting = patientDatabase.find(p => p.status === 'waiting');
  activePatientId = firstWaiting ? firstWaiting.id : (patientDatabase[0]?.id || null);
  updateTopCounter();
}

function saveDatabase() {
  localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(patientDatabase));
  updateTopCounter();
}

function restoreInitialDatabase() {
  executeResetDatabase();
}

// Reset Test Database Modal & Action
function confirmResetDatabase() {
  if (currentUserRole === 'patient') {
    showToast('🔒 เฉพาะแพทย์และผู้ดูแลระบบเท่านั้นที่สามารถรีเซ็ตฐานข้อมูลได้');
    return;
  }
  const modal = document.getElementById('resetDbModal');
  if (modal) modal.classList.remove('hidden');
}

function hideResetDbModal() {
  const modal = document.getElementById('resetDbModal');
  if (modal) modal.classList.add('hidden');
}

function executeResetDatabase() {
  hideResetDbModal();
  localStorage.removeItem(DB_STORAGE_KEY);
  patientDatabase = getSeedPatients().map(sanitizePatientRecord);
  const firstWaiting = patientDatabase.find(p => p.status === 'waiting');
  activePatientId = firstWaiting ? firstWaiting.id : (patientDatabase[0]?.id || null);
  editingPatientId = null;
  lastSubmittedPatientId = null;
  saveDatabase();
  renderQueueCards();
  renderDoctorDashboard();
  showToast(`รีเซ็ตข้อมูลและคืนค่าเริ่มต้น (${patientDatabase.length} เคสทดสอบ ครบทั้ง 11 อาการสำคัญ) สำเร็จแล้ว`);
}

function updateTopCounter() {
  const waitingCount = patientDatabase.filter(p => p.status === 'waiting').length;
  const badgeWaiting = document.getElementById('badgeCountWaiting');
  if (badgeWaiting) badgeWaiting.textContent = waitingCount;
  const completedCount = patientDatabase.filter(p => p.status === 'completed').length;
  const badgeCompleted = document.getElementById('badgeCountCompleted');
  if (badgeCompleted) badgeCompleted.textContent = completedCount;
}

// =========================================================================
// 3. ROLE-BASED ACCESS CONTROL (RBAC) & STAFF LOGIN
// =========================================================================
function switchUserRole(role, options = {}) {
  if (role === 'patient') {
    currentUserRole = 'patient';
    editingPatientId = null;
    hideFormEditBanner();
    updateRoleUiState();
    updateQrBannerUi();
    if (options.targetView) {
      navigateTo(options.targetView);
    } else if (lastSubmittedPatientId && patientDatabase.some(p => p.id === lastSubmittedPatientId)) {
      navigateTo('patientStatus');
    } else {
      navigateTo('landing');
    }
    if (!options.silent) {
      showToast(`📱 สลับสู่มุมมองผู้ป่วย (บัตรคิว QR: ${activeQrQueuePass.queue_number})`);
    }
    return;
  }

  // Switching to 'doctor' or 'admin'
  if (options.requireLogin || !isStaffAuthenticated) {
    openStaffLoginModal(role);
    return;
  }

  currentUserRole = role === 'admin' ? 'admin' : 'doctor';
  staffDisplayName = currentUserRole === 'admin' ? 'ผู้ดูแลระบบ (ER Admin)' : 'นพ.เวรฉุกเฉิน (ER Attending)';
  editingPatientId = null;
  hideFormEditBanner();
  updateRoleUiState();
  navigateTo(options.targetView || 'doctor');
  if (!options.silent) {
    showToast(`👨‍⚕️ เข้าสู่มุมมอง${currentUserRole === 'admin' ? 'ผู้ดูแลระบบ (Admin)' : 'แพทย์ห้องฉุกเฉิน (ER Doctor)'}`);
  }
}

function updateRoleUiState() {
  const btnPatient = document.getElementById('roleBtnPatient');
  const btnDoctor = document.getElementById('roleBtnDoctor');
  const btnAdmin = document.getElementById('roleBtnAdmin');
  const qrSimBtn = document.getElementById('devSimulateQrBtn');
  const lockStaffBtn = document.getElementById('devLockStaffBtn');

  const activeClass = 'px-2.5 py-1 rounded-lg text-[11px] font-bold bg-medical-500 text-white shadow-xs transition flex items-center space-x-1';
  const inactiveClass = 'px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition flex items-center space-x-1';

  if (btnPatient) btnPatient.className = currentUserRole === 'patient' ? activeClass : inactiveClass;
  if (btnDoctor) btnDoctor.className = currentUserRole === 'doctor' ? activeClass : inactiveClass;
  if (btnAdmin) btnAdmin.className = currentUserRole === 'admin' ? activeClass : inactiveClass;

  if (qrSimBtn) qrSimBtn.classList.toggle('hidden', currentUserRole !== 'patient');
  if (lockStaffBtn) lockStaffBtn.classList.toggle('hidden', currentUserRole === 'patient');

  // Header controls visibility based on Role
  const mainNavTabs = document.getElementById('mainNavTabs');
  const navLandingBtn = document.getElementById('navLandingBtn');
  const navPatientBtn = document.getElementById('navPatientBtn');
  const navDoctorBtn = document.getElementById('navDoctorBtn');
  const resetDbBtn = document.getElementById('resetDbBtn');
  const patientQrHeaderBadge = document.getElementById('patientQrHeaderBadge');
  const staffHeaderBadge = document.getElementById('staffHeaderBadge');
  const staffHeaderName = document.getElementById('staffHeaderName');

  const isPat = currentUserRole === 'patient';
  const isAdm = currentUserRole === 'admin';

  if (mainNavTabs) {
    mainNavTabs.classList.toggle('hidden', isPat);
    mainNavTabs.classList.toggle('sm:flex', !isPat);
  }
  if (navLandingBtn) {
    navLandingBtn.classList.toggle('hidden', !isAdm);
    navLandingBtn.classList.toggle('lg:flex', isAdm);
  }
  if (navPatientBtn) {
    navPatientBtn.classList.toggle('hidden', !isAdm);
    navPatientBtn.classList.toggle('lg:flex', isAdm);
  }
  if (navDoctorBtn) navDoctorBtn.classList.toggle('hidden', isPat);
  if (staffHeaderBadge) {
    staffHeaderBadge.classList.toggle('hidden', isPat);
    staffHeaderBadge.classList.toggle('flex', !isPat);
    staffHeaderBadge.title = staffDisplayName;
    if (staffHeaderName) staffHeaderName.textContent = staffDisplayName;
  }
  if (patientQrHeaderBadge) {
    patientQrHeaderBadge.classList.toggle('hidden', !isPat);
    patientQrHeaderBadge.classList.toggle('flex', isPat);
    const qSpan = document.getElementById('headerQrQueueNo');
    if (qSpan) qSpan.textContent = activeQrQueuePass.queue_number;
  }
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function openStaffLoginModal(targetRole = 'doctor') {
  pendingLoginRole = targetRole;
  const modal = document.getElementById('staffLoginModal');
  const errEl = document.getElementById('staffLoginError');
  if (errEl) errEl.classList.add('hidden');
  if (modal) {
    modal.classList.remove('hidden');
    const userInp = document.getElementById('staffUsernameInput');
    if (userInp) {
      userInp.value = targetRole === 'admin' ? 'admin' : 'doctor';
      userInp.focus();
    }
    const passInp = document.getElementById('staffPasswordInput');
    if (passInp) passInp.value = '';
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}

function closeStaffLoginModal() {
  const modal = document.getElementById('staffLoginModal');
  if (modal) modal.classList.add('hidden');
}

function handleStaffLoginSubmit(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  const username = (document.getElementById('staffUsernameInput')?.value || '').trim().toLowerCase();
  const password = (document.getElementById('staffPasswordInput')?.value || '').trim();
  const errEl = document.getElementById('staffLoginError');

  if (!username || !password) {
    if (errEl) {
      errEl.textContent = 'กรุณากรอกชื่อผู้ใช้งานและรหัสผ่าน หรือกดปุ่ม 1-Click Quick Login ด้านล่าง';
      errEl.classList.remove('hidden');
    }
    return;
  }

  isStaffAuthenticated = true;
  const role = username.includes('admin') ? 'admin' : pendingLoginRole;
  closeStaffLoginModal();
  switchUserRole(role);
}

function quickStaffLogin(role) {
  isStaffAuthenticated = true;
  closeStaffLoginModal();
  switchUserRole(role || 'doctor');
}

function lockStaffSession() {
  isStaffAuthenticated = false;
  switchUserRole('patient', { silent: true });
  openStaffLoginModal('doctor');
  showToast('🔒 ล็อกเซสชันแพทย์แล้ว (สามารถทดสอบหน้าเข้าสู่ระบบสำหรับแพทย์ได้)');
}

// =========================================================================
// 4. TRIAGE QR CODE QUEUE PASS & URL PARAMETER HANDLER
// =========================================================================
function initQrQueueFromUrl() {
  try {
    if (typeof window === 'undefined' || !window.location) return;
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role');
    const queueParam = params.get('queue');
    const hnParam = params.get('hn');
    const titleParam = params.get('title');
    const nameParam = params.get('name');
    const ageParam = params.get('age');
    const genderParam = params.get('gender');
    const esiParam = params.get('esi');
    const ccParam = params.get('cc');

    if (queueParam) activeQrQueuePass.queue_number = queueParam.trim();
    else activeQrQueuePass.queue_number = `E3-0${patientDatabase.length + 42}`;

    if (hnParam) activeQrQueuePass.hn = hnParam.trim();
    activeQrQueuePass.title = titleParam ? titleParam.trim() : '';
    activeQrQueuePass.name = nameParam ? nameParam.trim() : '';
    activeQrQueuePass.age = ageParam ? ageParam.trim() : '';
    activeQrQueuePass.gender = genderParam ? genderParam.trim() : '';
    if (esiParam) activeQrQueuePass.esi = parseInt(esiParam, 10) || 3;

    const bt = params.get('bt');
    const sbp = params.get('sbp');
    const dbp = params.get('dbp');
    const bp = params.get('bp');
    const pr = params.get('pr');
    const rr = params.get('rr');
    const spo2 = params.get('spo2');

    let sbpVal = sbp ? parseInt(sbp, 10) : null;
    let dbpVal = dbp ? parseInt(dbp, 10) : null;
    let bpStr = bp || '';
    if (!bpStr && (sbpVal || dbpVal)) bpStr = `${sbpVal || '-'}/${dbpVal || '-'}`;
    else if (bpStr && (!sbpVal || !dbpVal)) {
      const parts = bpStr.split('/');
      if (parts.length === 2) { sbpVal = parseInt(parts[0], 10) || null; dbpVal = parseInt(parts[1], 10) || null; }
    }

    if (bt || sbpVal || dbpVal || bpStr || pr || rr || spo2) {
      activeQrQueuePass.vital_signs = {
        bt: bt ? parseFloat(bt) : null,
        sbp: sbpVal,
        dbp: dbpVal,
        bp: bpStr,
        pr: pr ? parseInt(pr, 10) : null,
        rr: rr ? parseInt(rr, 10) : null,
        spo2: spo2 ? parseInt(spo2, 10) : null
      };
    }

    updateQrBannerUi();

    if (roleParam === 'patient' || queueParam) {
      applyQrDemographicsToForm();
      const resolvedUrlCc = ccParam ? resolveCcFormId(ccParam.trim()) : null;
      if (resolvedUrlCc && setPatientFormChiefComplaint(resolvedUrlCc)) {
        switchUserRole('patient', { targetView: 'patient', silent: true });
      } else {
        switchUserRole('patient', { targetView: 'landing', silent: true });
      }
    }
  } catch (err) {
    console.warn('URL param parse warning:', err);
  }
}

function applyQrDemographicsToForm() {
  const titleSelect = document.getElementById('patientTitleSelect');
  const nameInput = document.getElementById('patientNameInput');
  const ageInput = document.getElementById('patientAgeInput');
  let rawName = activeQrQueuePass.name || '';

  if (rawName && titleSelect) {
    if (rawName.startsWith('นาย')) { titleSelect.value = 'นาย (Mr.)'; rawName = rawName.replace(/^นาย\s*/, ''); }
    else if (rawName.startsWith('นางสาว') || rawName.startsWith('น.ส.')) { titleSelect.value = 'น.ส. (Miss)'; rawName = rawName.replace(/^(นางสาว|น\.ส\.)\s*/, ''); }
    else if (rawName.startsWith('นาง')) { titleSelect.value = 'นาง (Mrs.)'; rawName = rawName.replace(/^นาง\s*/, ''); }
    else if (rawName.startsWith('เด็กชาย') || rawName.startsWith('ด.ช.')) { titleSelect.value = 'ด.ช. (Master)'; rawName = rawName.replace(/^(เด็กชาย|ด\.ช\.)\s*/, ''); }
    else if (rawName.startsWith('เด็กหญิง') || rawName.startsWith('ด.ญ.')) { titleSelect.value = 'ด.ญ. (Miss)'; rawName = rawName.replace(/^(เด็กหญิง|ด\.ญ\.)\s*/, ''); }
    handlePatientTitleChange();
  } else if (activeQrQueuePass.title && titleSelect) {
    titleSelect.value = activeQrQueuePass.title;
    handlePatientTitleChange();
  } else if (!rawName && titleSelect) {
    titleSelect.selectedIndex = 0;
  }
  if (nameInput) nameInput.value = rawName;
  if (ageInput) ageInput.value = activeQrQueuePass.age || '';
}

function updateQrBannerUi() {
  const qEls = document.querySelectorAll('.qr-pass-queue-display');
  qEls.forEach(el => { el.textContent = activeQrQueuePass.queue_number; });
  const hnEls = document.querySelectorAll('.qr-pass-hn-display');
  hnEls.forEach(el => { el.textContent = activeQrQueuePass.hn; });
  const headerQ = document.getElementById('headerQrQueueNo');
  if (headerQ) headerQ.textContent = activeQrQueuePass.queue_number;
}

function simulateNewQrQueuePass() {
  const nextNum = 50 + Math.floor(Math.random() * 49);
  const randHn = `67${Math.floor(10000 + Math.random() * 89999)}`;
  const randSbp = 112 + Math.floor(Math.random() * 34);
  const randDbp = 70 + Math.floor(Math.random() * 20);
  const randPr = 72 + Math.floor(Math.random() * 32);
  const randRr = 16 + Math.floor(Math.random() * 6);
  const randBt = Number((36.6 + Math.random() * 1.8).toFixed(1));
  const randSpo2 = 96 + Math.floor(Math.random() * 4);
  activeQrQueuePass = {
    queue_number: `E3-0${nextNum}`, hn: randHn, title: '', name: '', age: '', gender: '', esi: 3,
    vital_signs: { bt: randBt, sbp: randSbp, dbp: randDbp, bp: `${randSbp}/${randDbp}`, pr: randPr, rr: randRr, spo2: randSpo2 }
  };
  editingPatientId = null;
  lastSubmittedPatientId = null;
  resetIntakeFormClean();
  applyQrDemographicsToForm();
  updateQrBannerUi();
  switchUserRole('patient', { targetView: 'landing', silent: true });
  showToast(`🎫 จำลองสแกน QR Code บัตรคิวใหม่สำเร็จ: คิว ${activeQrQueuePass.queue_number} (HN: ${randHn})`);
}

function simulateScanTicketOnThisDevice() {
  if (!currentGeneratedTicketData) return;
  const d = currentGeneratedTicketData;
  activeQrQueuePass = {
    queue_number: d.queue, hn: d.hn, title: '', name: '', age: '', gender: '', esi: d.esi, vital_signs: d.vitals
  };
  closeTriageTicketModal();
  editingPatientId = null;
  lastSubmittedPatientId = null;
  resetIntakeFormClean();
  applyQrDemographicsToForm();
  updateQrBannerUi();
  switchUserRole('patient', { targetView: 'landing', silent: true });
  showToast(`📱 สแกน QR (Option 2) สำเร็จ: รับข้อมูลคิว ${d.queue} (HN: ${d.hn}) โดยไม่ส่งชื่อ/อายุ`);
}

// =========================================================================
// 5. PATIENT QUEUE STATUS SCREEN & BIDIRECTIONAL FORM HYDRATION
// =========================================================================
function renderPatientStatusView() {
  const patientId = lastSubmittedPatientId || activePatientId;
  const patient = patientDatabase.find(p => p.id === patientId);
  if (!patient) return;

  const qEl = document.getElementById('statusViewQueueNo');
  const nameEl = document.getElementById('statusViewPatientName');
  const demogEl = document.getElementById('statusViewPatientDemog');
  const ccEl = document.getElementById('statusViewCcTitle');
  const timeEl = document.getElementById('statusViewTimestamp');
  const summaryEl = document.getElementById('statusViewSummaryList');

  const ageText = (patient.age && patient.age !== 'ไม่ระบุ') ? `${patient.age} ปี` : 'ไม่ระบุ';
  if (qEl) qEl.textContent = patient.queue_number || '-';
  if (nameEl) nameEl.textContent = patient.name || '-';
  if (demogEl) demogEl.textContent = `อายุ ${ageText} • เพศ${patient.gender || 'ไม่ระบุ'} • HN: ${patient.hn || '-'}`;
  if (ccEl) ccEl.textContent = patient.chief_complaint_title || patient.chief_complaint;
  if (timeEl) {
    const dtObj = patient.timestamp ? new Date(patient.timestamp) : new Date();
    const dateDdMm = !isNaN(dtObj.getTime())
      ? `${String(dtObj.getDate()).padStart(2, '0')}/${String(dtObj.getMonth() + 1).padStart(2, '0')}/${dtObj.getFullYear()}`
      : '';
    const tStr = formatTime24h(dtObj);
    timeEl.textContent = `บันทึกข้อมูลเมื่อ ${dateDdMm ? `${dateDdMm} ` : ''}เวลา ${tStr} น.`;
  }

  // Ensure outputs are computed so pertinentPositives are populated
  updateDoctorTextAndJsonOutputs(patient);

  if (summaryEl) {
    const unitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
    const durStr = patient.durationVal ? `${patient.durationVal} ${unitMap[patient.durationUnit] || 'วัน'}` : 'ไม่ระบุ';
    const posItems = (patient.pertinentPositives || []).slice(0, 8);
    summaryEl.innerHTML = `
      <li><strong>อาการสำคัญที่มาตรวจ:</strong> ${escapeHtml(patient.chief_complaint_title || '')} (ระยะเวลา: ${escapeHtml(durStr)})</li>
      ${posItems.map(item => `<li>${escapeHtml(item.replace(/🚩/g, ''))}</li>`).join('')}
      <li><strong>โรคประจำตัว:</strong> ${escapeHtml((patient.underlying || []).join(', '))}</li>
      <li><strong>ประวัติแพ้ยา/อาหาร:</strong> ${escapeHtml(patient.drugAllergy || 'ไม่ได้ระบุ')}</li>
      <li><strong>ยาประจำตัว:</strong> ${escapeHtml(patient.currentMeds || 'ไม่ได้ระบุ')}</li>
    `;
  }
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Seizure Progressive Disclosure Handlers & Pediatric Guidance

function resetIntakeFormClean() {
  const form = document.getElementById('intakeForm');
  if (form) form.reset();
  const titleSelect = document.getElementById('patientTitleSelect');
  if (titleSelect) titleSelect.selectedIndex = 0;

  // Hide all conditional branches (matched 1-to-1 with index.html DOM IDs)
  const branchIds = [
    'coughBranch', 'cough_other_wrap', 'sorethroatBranch', 'st_other_wrap', 'dyspneaBranch', 'dyspnea_other_wrap', 'abdpainBranch', 'fever_abdpain_loc_other_wrap', 'fever_abdpain_char_other_wrap', 'fever_abdpain_rad_other_wrap', 'diarrheaBranch', 'diarrhea_other_wrap', 'vomitBranch', 'vomit_other_wrap', 'rash_loc_wrap', 'wound_loc_wrap', 'abscess_loc_wrap', 'arthralgia_loc_wrap', 'abdpain_loc_other_wrap', 'abdpain_rad_other_wrap', 'abdpain_vomit_detail_wrap', 'abdpain_diarrhea_freq_wrap', 'abdpain_branch_rlq', 'abdpain_branch_epigastric_ruq', 'abdpain_branch_flank_groin', 'abdpain_branch_suprapubic', 'abdpain_branch_female', 'abdpain_lmp_date_wrap', 'abdpain_lmp_approx_wrap', 'abdpain_surgery_detail_wrap', 'chestpain_rad_other_wrap', 'chestpain_char_other_wrap', 'chestpain_ntg_detail_wrap', 'chestpain_dyspnea_wrap', 'chestpain_abdpain_wrap', 'chestpain_branch_pulm', 'chestpain_branch_gi', 'chestpain_branch_msk', 'chestpain_trauma_detail_wrap', 'chestpain_high_risk_med_section', 'dyspnea_orthopnea_wrap', 'dyspnea_char_other_wrap', 'dyspnea_cough_wrap', 'dyspnea_sputum_color_wrap', 'dyspnea_chestpain_wrap', 'dyspnea_leg_wrap', 'dyspnea_allergy_wrap', 'ud_inhaler_detail_wrap', 'ud_cad_detail_wrap', 'ud_cad_other_hosp_wrap', 'cancer_type_wrap', 'drugAllergyInputWrap', 'hospRecordCompleteNotice', 'dizziness_trig_other_wrap', 'dizziness_tinnitus_side_wrap', 'dizziness_hearing_loss_side_wrap', 'dizziness_fullness_side_wrap', 'dizziness_vomit_detail_wrap', 'dizziness_vomit_actual_wrap', 'dizziness_diarrhea_detail_wrap', 'headache_unilateral_side_wrap', 'headache_periorbital_side_wrap', 'headache_loc_other_wrap', 'headache_trig_other_wrap', 'headache_vomit_detail_wrap', 'stroke_exact_time_wrap', 'stroke_lsn_time_wrap', 'stroke_transient_duration_wrap', 'stroke_hemi_side_wrap', 'stroke_arm_side_wrap', 'stroke_leg_side_wrap', 'stroke_weakness_severity_wrap', 'stroke_numbness_side_wrap', 'stroke_face_detail_wrap', 'stroke_fibrinolytic_contra_section', 'seizurePrecedingPostureOtherWrap', 'seizureDurationGte5mWrap', 'seizureEpisodeCountWrap', 'seizureInterictalWrap', 'seizureToddSideWrap', 'seizureMedComplianceWrap', 'seizureSubstanceDetailsWrap', 'syncopePostureOtherWrap', 'syncopeUnconsciousDurationWrap', 'syncopeDurationGte5mWrap', 'syncopeEpisodeCountWrap', 'syncopeMotorSubWrap', 'syncope_branch_female_lmp', 'syncope_lmp_date_wrap', 'syncope_lmp_approx_wrap', 'alteredMentalBedriddenDetailsWrap', 'alteredMentalHeadTraumaWrap', 'alteredMentalHeadWoundDetailsWrap', 'alteredMentalAbdpainWrap', 'alteredMentalDiarrheaWrap', 'alteredMentalVomitWrap', 'alteredMentalToxinDetailsWrap', 'vomitingAbdpainWrap', 'vomitingDiarrheaWrap', 'vomitingBloodyStoolWrap', 'vomitingConstipationWrap', 'vomitingMedsWrap', 'vomitingToxinFoodWrap', 'vomitingChemicalWrap', 'vomiting_branch_female_lmp', 'vomiting_lmp_date_wrap'
  ];
  branchIds.forEach(id => toggleBranch(id, false));
  const pmhSec = document.getElementById('pmhDetailsSection');
  if (pmhSec) pmhSec.classList.remove('hidden');

  const lsnDateEl = document.getElementById('alteredMentalLsnDate');
  const lsnTimeEl = document.getElementById('alteredMentalLsnTime');
  if (lsnDateEl) { lsnDateEl.disabled = false; lsnDateEl.value = ''; }
  if (lsnTimeEl) { lsnTimeEl.disabled = false; lsnTimeEl.value = ''; }

  clearChestpainPainScore();
  clearAbdpainPainScore();
  clearHeadachePainScore();
  [
    'sx_other_free', 'abdpain_other_free', 'chestpain_other_free', 'dyspnea_other_free', 'dizziness_other_free', 'headache_other_free', 'stroke_other_free', 'seizure_other_free', 'syncope_other_free', 'vomiting_other_free', 'seizureDurationVal', 'seizureEpisodeCountVal', 'seizureSubstanceDetails', 'seizurePrecedingPostureOtherText', 'seizureDurationGte5mVal', 'syncopeDurationVal', 'syncopeDurationGte5mVal', 'syncopeEpisodeCountVal', 'syncopePostureOtherText', 'syncopeLmpDate', 'alteredMentalDurationVal', 'alteredMentalReporterRelation', 'alteredMentalReporterPhone', 'alteredMentalHeadWoundLocation', 'alteredMentalDiarrheaFreq', 'alteredMentalVomitFreq', 'alteredMentalToxinDetails', 'alteredMentalAdditionalNotes', 'vomitingDurationVal', 'vomitingDiarrheaFreq', 'vomitingToxinFoodType', 'vomitingToxinFoodTime', 'vomitingToxinFoodPlace', 'vomitingToxinFoodCoEaters', 'vomitingToxinFoodDetails', 'vomitingChemicalDetails', 'vomitingLmpDate', 'vomitingAdditionalNotes', 'abdpainLmpDate', 'strokeExactDate', 'strokeExactTime', 'strokeLsnDate', 'strokeLsnTime', 'strokeDiscoveryDate', 'strokeDiscoveryTime'
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  if (typeof CC_MODULES !== 'undefined') {
    Object.values(CC_MODULES).forEach(mod => {
      if (mod && Array.isArray(mod.branchIds)) {
        mod.branchIds.forEach(bId => toggleBranch(bId, false));
      }
      if (mod && Array.isArray(mod.inputIdsToClear)) {
        mod.inputIdsToClear.forEach(iId => {
          const el = document.getElementById(iId);
          if (el) el.value = '';
        });
      }
      if (mod && typeof mod.resetForm === 'function') {
        mod.resetForm();
      }
    });
  }
  const medsUnknownChk = document.getElementById('currentMedsUnknown');
  if (medsUnknownChk) medsUnknownChk.checked = false;
  handleCurrentMedsUnknownToggle(false);
  updateSectionNumbering();
}

function handleCurrentMedsUnknownToggle(checked) {
  const medsInput = document.getElementById('currentMeds');
  if (!medsInput) return;
  if (checked) {
    medsInput.placeholder = 'ระบุลักษณะเม็ดยา/ซองยาเท่าที่จำได้ (หรือเว้นว่างไว้หากไม่ทราบเลย)...';
  } else {
    medsInput.placeholder = "เช่น Amlodipine 5mg, ยาเบาหวาน หรือระบุ 'ไม่มี'";
  }
}

function showFormEditBanner(patient) {
  const banner = document.getElementById('formEditModeBanner');
  const label = document.getElementById('formEditModeLabel');
  const submitSpan = document.getElementById('submitIntakeBtnText');
  if (banner && patient) {
    banner.classList.remove('hidden');
    const modeDesc = currentUserRole === 'patient' ? 'ผู้ป่วยแก้ไขข้อมูลประวัติของตนเอง' : 'แพทย์ซักประวัติ/แก้ไขคำตอบผู้ป่วย (Doctor Guided Edit)';
    if (label) label.textContent = `กำลังแก้ไขประวัติของ [${patient.queue_number}] ${patient.name} (${modeDesc})`;
  }
  if (submitSpan) {
    submitSpan.textContent = 'บันทึกการแก้ไขข้อมูลประวัติ (Update Intake Record)';
  }
}

function hideFormEditBanner() {
  const banner = document.getElementById('formEditModeBanner');
  const submitSpan = document.getElementById('submitIntakeBtnText');
  if (banner) banner.classList.add('hidden');
  if (submitSpan) {
    submitSpan.textContent = 'ส่งข้อมูลประวัติเข้าคิวห้องฉุกเฉิน (Submit Intake)';
  }
}

function cancelFormEditMode() {
  editingPatientId = null;
  hideFormEditBanner();
  resetIntakeFormClean();
  if (currentUserRole === 'patient') {
    if (lastSubmittedPatientId) navigateTo('patientStatus');
    else navigateTo('landing');
  } else {
    navigateTo('doctor');
  }
}

function startDoctorGuidedNewIntake() {
  editingPatientId = null;
  hideFormEditBanner();
  resetIntakeFormClean();
  const nextNum = patientDatabase.length + 45;
  activeQrQueuePass.queue_number = `E1-0${nextNum}`;
  activeQrQueuePass.hn = `67${Math.floor(10000 + Math.random() * 89999)}`;
  updateQrBannerUi();
  navigateTo('landing');
  showToast('📋 โหมดแพทย์ซักประวัติผู้ป่วยใหม่: กรุณาเลือกอาการสำคัญเพื่อเปิดฟอร์ม');
}

function startChangePatientCc(patientId) {
  const targetId = patientId || lastSubmittedPatientId || activePatientId;
  const patient = patientDatabase.find(p => p.id === targetId);
  if (patient) {
    editingPatientId = patient.id;
  }
  navigateTo('landing');
  showToast('กรุณาเลือกอาการสำคัญหลักที่ต้องการเปลี่ยน');
}

// Start editing an existing patient's history in the Guided Form (works for both Patient and Doctor!)
function startEditPatientHistory(patientId) {
  const targetId = patientId || (currentUserRole === 'patient' ? lastSubmittedPatientId : activePatientId);
  const patient = patientDatabase.find(p => p.id === targetId);
  if (!patient) {
    showToast('⚠️ ไม่พบข้อมูลผู้ป่วยที่ต้องการแก้ไข');
    return;
  }

  editingPatientId = patient.id;
  populateFormFromPatient(patient);
  showFormEditBanner(patient);
  navigateTo('patient');
  showToast(`✏️ โหลดข้อมูลของ [${patient.queue_number}] ${patient.name} เข้าสู่แบบฟอร์มเรียบร้อย`);
}

// Helper for setting radio input by name and value
function setRadioValue(name, val) {
  if (val === undefined || val === null || val === '') return;
  const el = document.querySelector(`input[name="${name}"][value="${val}"]`);
  if (el) el.checked = true;
}

// Helper for setting checkbox group and "อื่นๆ: ..." free text
function setMultiCheckboxes(name, valuesArray, otherChkId, otherWrapId, otherTextId) {
  if (!Array.isArray(valuesArray)) return;
  document.querySelectorAll(`input[name="${name}"]`).forEach(cb => {
    cb.checked = valuesArray.includes(cb.value);
  });
  const otherItem = valuesArray.find(v => typeof v === 'string' && v.startsWith('อื่นๆ:'));
  if (otherItem && otherChkId) {
    const chk = document.getElementById(otherChkId);
    if (chk) chk.checked = true;
    if (otherWrapId) toggleBranch(otherWrapId, true);
    if (otherTextId) {
      const txt = document.getElementById(otherTextId);
      if (txt) txt.value = otherItem.replace(/^อื่นๆ:s*/, '');
    }
  }
}

// Hydrate all form controls from a patient object (Supports all 4 active CCs + PMH)
function populateFormFromPatient(patient) {
  if (!patient) return;
  resetIntakeFormClean();

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val !== undefined && val !== null ? val : '';
  };
  const setChk = (id, val, branchId) => {
    const el = document.getElementById(id);
    if (el) el.checked = Boolean(val);
    if (branchId) toggleBranch(branchId, Boolean(val));
  };

  // 1. Map chief_complaint schema code to form CC id
  const formCc = resolveCcFormId(patient.chief_complaint) || 'fever';
  setPatientFormChiefComplaint(formCc);

  // 2. Demographics (Title, Name, Age)
  const rawFullName = patient.name || '';
  let detectedTitle = '';
  let cleanName = rawFullName;

  const titleCandidates = [
    { match: 'นางสาว (Ms.)', std: 'นางสาว (Ms.)' }, { match: 'นาง (Mrs.)', std: 'นาง (Mrs.)' },
    { match: 'นาย (Mr.)', std: 'นาย (Mr.)' }, { match: 'ด.ช. (Master)', std: 'ด.ช. (Master)' },
    { match: 'ด.ญ. (Miss)', std: 'ด.ญ. (Miss)' }, { match: 'นางสาว', std: 'นางสาว (Ms.)' },
    { match: 'น.ส.', std: 'นางสาว (Ms.)' }, { match: 'นาง', std: 'นาง (Mrs.)' },
    { match: 'นาย', std: 'นาย (Mr.)' }, { match: 'ด.ช.', std: 'ด.ช. (Master)' },
    { match: 'ด.ญ.', std: 'ด.ญ. (Miss)' }
  ];

  for (const item of titleCandidates) {
    if (rawFullName.startsWith(item.match)) {
      detectedTitle = item.std;
      cleanName = rawFullName.slice(item.match.length).trim();
      break;
    }
  }
  if (!detectedTitle) {
    detectedTitle = patient.gender === 'หญิง' ? 'นาง (Mrs.)' : 'นาย (Mr.)';
  }

  const titleSelect = document.getElementById('patientTitleSelect');
  const nameInput = document.getElementById('patientNameInput');
  const ageInput = document.getElementById('patientAgeInput');
  if (titleSelect) titleSelect.value = detectedTitle;
  if (nameInput) nameInput.value = cleanName;
  if (ageInput) ageInput.value = (patient.age && patient.age !== 'ไม่ระบุ') ? patient.age : '';
  handlePatientTitleChange();

  // 3. Hydrate Shared PMH, Allergies, and Current Meds
  const hospStatus = patient.hospRecordStatus && patient.hospRecordStatus !== 'unspecified' ? patient.hospRecordStatus : 'self';
  setRadioValue('hospRecordStatus', hospStatus);
  handleHospRecordChange(hospStatus);

  if (hospStatus !== 'complete') {
    const uds = Array.isArray(patient.underlying) ? patient.underlying : [];
    const otherUds = [];

    uds.forEach(u => {
      if (!u || u === 'ปฏิเสธโรคประจำตัว' || u.includes('มีประวัติเดิมครบถ้วน')) return;
      if (u.includes('เบาหวาน') || u.includes('DM')) { const el = document.getElementById('ud_dm'); if (el) el.checked = true; }
      else if (u.includes('ความดัน') || u.includes('HT')) { const el = document.getElementById('ud_ht'); if (el) el.checked = true; }
      else if (u.includes('ไขมัน') || u.includes('DLP') || u.includes('Dyslipidemia')) { const el = document.getElementById('ud_dlp'); if (el) el.checked = true; }
      else if (u.includes('หลอดเลือดหัวใจ') || u.includes('CAD') || u.includes('หัวใจขาดเลือด')) { const el = document.getElementById('ud_cad'); if (el) el.checked = true; toggleBranch('ud_cad_detail_wrap', true); }
      else if (u.includes('หลอดเลือดสมอง') || u.includes('Stroke') || u.includes('อัมพฤกษ์')) { const el = document.getElementById('ud_stroke'); if (el) el.checked = true; }
      else if (u.includes('ไตเรื้อรัง') || u.includes('CKD')) { const el = document.getElementById('ud_ckd'); if (el) el.checked = true; }
      else if (u.includes('หอบหืด') || u.includes('Asthma')) { const el = document.getElementById('ud_asthma'); if (el) el.checked = true; }
      else if (u.includes('ถุงลมโป่งพอง') || u.includes('COPD')) { const el = document.getElementById('ud_copd'); if (el) el.checked = true; }
      else if (u.includes('มะเร็ง') || u.includes('Cancer')) {
        const el = document.getElementById('ud_cancer'); if (el) el.checked = true; toggleBranch('cancer_type_wrap', true);
        const match = u.match(/\((.*?)\)/);
        if (match && document.getElementById('ud_cancer_type')) document.getElementById('ud_cancer_type').value = match[1];
      } else otherUds.push(u);
    });

    if (otherUds.length > 0 && document.getElementById('ud_other')) {
      document.getElementById('ud_other').value = otherUds.join(', ');
    }
    handleAsthmaCopdToggle();

    // Drug allergy
    const alg = patient.drugAllergy || '';
    if (alg.includes('ปฏิเสธ') || alg === 'ไม่มี') {
      setRadioValue('hasDrugAllergy', 'no');
      toggleBranch('drugAllergyInputWrap', false);
    } else if (alg && alg !== 'ไม่ได้ระบุ' && !alg.includes('ตามฐานข้อมูล')) {
      setRadioValue('hasDrugAllergy', 'yes');
      toggleBranch('drugAllergyInputWrap', true);
      const algInput = document.getElementById('drugAllergyDetails');
      if (algInput) algInput.value = alg.replace(/^มีประวัติแพ้ยา\/แพ้อาหาร:\s*/, '');
    }

    // Current meds
    const meds = patient.currentMeds || '';
    const medsInput = document.getElementById('currentMeds');
    const medsUnknownChk = document.getElementById('currentMedsUnknown');
    if (meds.includes('ไม่ทราบชื่อ')) {
      if (medsUnknownChk) medsUnknownChk.checked = true;
      handleCurrentMedsUnknownToggle(true);
      if (medsInput) {
        const detailMatch = meds.match(/ไม่ทราบชื่อยา:\s*(.+?)\)?$/);
        medsInput.value = detailMatch ? detailMatch[1].trim() : '';
      }
    } else {
      if (medsUnknownChk) medsUnknownChk.checked = false;
      handleCurrentMedsUnknownToggle(false);
      if (medsInput && meds && meds !== 'ไม่ได้ระบุ' && !meds.includes('ตามฐานข้อมูล')) {
        medsInput.value = meds;
      }
    }
  }


  // 4. Hydrate CC-Specific Fields via Modular CC Registry
  mountAllCcQuestionnaires();
  initUniversalDateTimeInputs();
  const ccMod = getCcModule(formCc);
  if (ccMod && typeof ccMod.hydrateForm === 'function') {
    ccMod.hydrateForm(patient);
  }

  const otherSymptomsText = patient.otherSymptomsFree || '';
  ['sx_other_free', 'abdpain_other_free', 'chestpain_other_free', 'dyspnea_other_free', 'dizziness_other_free', 'headache_other_free', 'stroke_other_free', 'seizure_other_free', 'syncope_other_free', 'vomiting_other_free'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = otherSymptomsText;
  });

  updateSectionNumbering();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// =========================================================================
// 6. QUEUE MANAGEMENT, SEARCH & RED FLAG TRIAGE SORTING
// =========================================================================
let currentQueueSearchQuery = '';

function handleQueueSearch(val) {
  currentQueueSearchQuery = (val || '').trim();
  const clearBtn = document.getElementById('queueSearchClearBtn');
  if (clearBtn) {
    clearBtn.classList.toggle('hidden', !currentQueueSearchQuery);
  }
  renderQueueCards();
}

function clearQueueSearch() {
  currentQueueSearchQuery = '';
  const searchInput = document.getElementById('queueSearchInput');
  if (searchInput) searchInput.value = '';
  const clearBtn = document.getElementById('queueSearchClearBtn');
  if (clearBtn) clearBtn.classList.add('hidden');
  renderQueueCards();
}

function getFilteredQueuePatients() {
  const q = (currentQueueSearchQuery || '').trim().toLowerCase();
  return patientDatabase.filter(p => {
    if (p.status !== currentQueueFilter) return false;
    if (!q) return true;
    const ccTitle = p.chief_complaint_title || resolveCcTitleTh(p.chief_complaint) || '';
    const searchable = [
      p.name || '',
      p.queue_number || '',
      p.hn || '',
      ccTitle,
      p.chief_complaint || '',
      String(p.age || '')
    ].join(' ').toLowerCase();
    return searchable.includes(q);
  });
}

function selectFirstSearchedPatient() {
  const filtered = getFilteredQueuePatients();
  if (filtered.length > 0) {
    selectPatient(filtered[0].id);
  }
}

function switchQueueFilter(filter) {
  currentQueueFilter = filter;
  const tabWaiting = document.getElementById('queueTabWaiting');
  const tabCompleted = document.getElementById('queueTabCompleted');

  if (filter === 'waiting') {
    tabWaiting.className = "px-3 py-1.5 rounded-lg font-semibold bg-white text-medical-700 shadow-xs transition flex items-center space-x-1";
    tabCompleted.className = "px-3 py-1.5 rounded-lg font-medium text-slate-600 hover:text-slate-900 transition flex items-center space-x-1";
  } else {
    tabWaiting.className = "px-3 py-1.5 rounded-lg font-medium text-slate-600 hover:text-slate-900 transition flex items-center space-x-1";
    tabCompleted.className = "px-3 py-1.5 rounded-lg font-semibold bg-white text-medical-700 shadow-xs transition flex items-center space-x-1";
  }
  renderQueueCards();
}

// Helper: ตรวจสอบว่าผู้ป่วยมีอาการเตือนอันตราย (Red Flag) หรือไม่
function isPatientRedFlag(p) {
  if (!p) return false;
  if (p.redFlags && p.redFlags.length > 0) return true;


  const ccMod = getCcModule(p.chief_complaint);
  if (ccMod && typeof ccMod.isRedFlag === 'function') {
    return Boolean(ccMod.isRedFlag(p));
  }
  const fallbackMod = getCcModule('fever');
  return fallbackMod && typeof fallbackMod.isRedFlag === 'function' ? Boolean(fallbackMod.isRedFlag(p)) : false;
}

function scrollQueue(offset) {
  const container = document.getElementById('patientQueueList');
  if (container) {
    container.scrollBy({ left: offset, behavior: 'smooth' });
  }
}

function selectNextPatient() {
  const filtered = getFilteredQueuePatients();
  if (filtered.length === 0) return;
  const currentIndex = filtered.findIndex(p => p.id === activePatientId);
  if (currentIndex === -1 || currentIndex >= filtered.length - 1) {
    selectPatient(filtered[0].id);
  } else {
    selectPatient(filtered[currentIndex + 1].id);
  }
}

function selectPrevPatient() {
  const filtered = getFilteredQueuePatients();
  if (filtered.length === 0) return;
  const currentIndex = filtered.findIndex(p => p.id === activePatientId);
  if (currentIndex <= 0) {
    selectPatient(filtered[filtered.length - 1].id);
  } else {
    selectPatient(filtered[currentIndex - 1].id);
  }
}

// Render Patient Cards in Doctor View Queue (OWASP XSS-safe via escapeHtml)
function renderQueueCards() {
  const container = document.getElementById('patientQueueList');
  if (!container) return;
  updateTopCounter();
  const filtered = getFilteredQueuePatients();

  if (filtered.length === 0) {
    const hasQuery = Boolean(currentQueueSearchQuery && currentQueueSearchQuery.trim());
    container.innerHTML = hasQuery ? `
      <div class="py-6 px-4 text-center text-xs text-slate-500 w-full bg-slate-50 rounded-xl border border-dashed border-slate-200">
        ไม่พบผู้ป่วยที่ตรงกับคำค้นหา <span class="font-bold text-slate-700">"${escapeHtml(currentQueueSearchQuery.trim())}"</span> ในรายการ${currentQueueFilter === 'waiting' ? 'รอตรวจ' : 'ที่ตรวจเสร็จแล้ว'}
        <button type="button" onclick="clearQueueSearch()" class="ml-2 text-medical-600 hover:text-medical-700 font-semibold underline cursor-pointer">ล้างคำค้นหา</button>
      </div>
    ` : `
      <div class="py-6 px-4 text-center text-xs text-slate-400 w-full bg-slate-50 rounded-xl border border-dashed border-slate-200">
        ไม่มีผู้ป่วยในรายการ${currentQueueFilter === 'waiting' ? 'รอตรวจ' : 'ที่ตรวจเสร็จแล้ว'}
      </div>
    `;
    return;
  }

  // Sort: Red Flag patients first, then by queue_number
  filtered.sort((a, b) => {
    const aRf = isPatientRedFlag(a) ? 1 : 0;
    const bRf = isPatientRedFlag(b) ? 1 : 0;
    if (aRf !== bRf) return bRf - aRf;
    return (a.queue_number || '').localeCompare(b.queue_number || '', undefined, { numeric: true });
  });

  container.innerHTML = filtered.map(p => {
    const isActive = p.id === activePatientId;
    const hasRedFlag = isPatientRedFlag(p);
    const safeId = escapeHtml(p.id);
    const safeQueue = escapeHtml(p.queue_number);
    const safeName = escapeHtml(p.name);
    const safeGender = escapeHtml(p.gender || 'ไม่ระบุ');
    const safeAge = (p.age && p.age !== 'ไม่ระบุ') ? `${escapeHtml(p.age)} ปี` : 'ไม่ระบุ';
    const safeHn = p.hn ? escapeHtml(p.hn) : '';
    const rawCcTitle = p.chief_complaint_title || resolveCcTitleTh(p.chief_complaint) || 'ไข้ / หนาวสั่น';
    const safeCcTitle = escapeHtml(rawCcTitle);

    return `
      <div onclick="selectPatient('${safeId}')" 
        class="selectable-card flex-shrink-0 w-64 p-3.5 rounded-xl cursor-pointer relative transition ${isActive ? 'border-medical-600 ring-2 ring-medical-500 bg-sky-50/70 shadow-sm' : 'hover:border-slate-300'}">
        
        <div class="flex items-center justify-between mb-1.5">
          <span class="font-mono text-xs font-bold px-2 py-0.5 rounded-md ${isActive ? 'bg-medical-600 text-white' : 'bg-slate-100 text-slate-700'}">
            ${safeQueue}
          </span>
          ${hasRedFlag ? '<span class="bg-rose-100 text-rose-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center">🚩 Red Flag</span>' : ''}
          ${p.status === 'completed' ? '<span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">✓ ปิดเคส</span>' : ''}
        </div>

        <h4 class="text-xs font-bold text-slate-800 truncate">${safeName}</h4>
        <p class="text-[11px] text-slate-500 mt-0.5">${safeGender} • อายุ ${safeAge}${safeHn ? ` • HN: ${safeHn}` : ''}</p>
        
        <div class="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span class="text-slate-500 truncate max-w-[140px] font-medium">CC: ${safeCcTitle}</span>
          <span class="font-semibold ${isActive ? 'text-medical-600' : 'text-slate-500'}">
            ${isActive ? 'กำลังตรวจ' : 'เลือกตรวจ'}
          </span>
        </div>
      </div>
    `;
  }).join('');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function selectPatient(patientId) {
  activePatientId = patientId;
  renderQueueCards();
  renderDoctorDashboard();
}

// =========================================================================
// COMPLETE & CLOSE CASE
// =========================================================================
function confirmCloseActiveCase() {
  const patient = patientDatabase.find(p => p.id === activePatientId);
  if (!patient) return;
  document.getElementById('closeCaseModalMsg').textContent = `ยืนยันการบันทึกประวัติและปิดเคส [${patient.queue_number} : ${patient.name}] หรือไม่? เมื่อปิดเคสแล้ว ผู้ป่วยรายนี้จะถูกนำออกจากรายการรอตรวจ`;
  document.getElementById('closeCaseModal').classList.remove('hidden');
}

function hideCloseCaseModal() {
  document.getElementById('closeCaseModal').classList.add('hidden');
}

function executeCloseActiveCase() {
  hideCloseCaseModal();
  const patient = patientDatabase.find(p => p.id === activePatientId);
  if (!patient) return;

  patient.status = 'completed';
  patient.completed_at = new Date().toISOString();
  saveDatabase();

  showToast(`บันทึกข้อมูลและปิดเคส ${patient.queue_number} เรียบร้อยแล้ว`);

  const nextWaiting = patientDatabase.find(p => p.status === 'waiting');
  if (nextWaiting) {
    activePatientId = nextWaiting.id;
  } else {
    activePatientId = null;
  }

  renderQueueCards();
  renderDoctorDashboard();
}

function executeReopenActiveCase() {
  const patient = patientDatabase.find(p => p.id === activePatientId);
  if (!patient) return;

  patient.status = 'waiting';
  delete patient.completed_at;
  saveDatabase();

  showToast(`ย้ายเคส ${patient.queue_number} กลับไปรายการรอตรวจเรียบร้อยแล้ว`);

  renderQueueCards();
  renderDoctorDashboard();
}

// =========================================================================
// DOCTOR CLINICAL ADDENDUM & DIRECT NOTE EDITING
// =========================================================================
let isDoctorAddendumOpen = false;

function toggleDoctorAddendumSection(forceState) {
  const fields = document.getElementById('doctorAddendumFields');
  const btnText = document.getElementById('toggleDoctorAddendumText');
  const btnIcon = document.getElementById('toggleDoctorAddendumIcon');
  if (!fields || !btnText || !btnIcon) return;

  if (typeof forceState === 'boolean') {
    isDoctorAddendumOpen = forceState;
  } else {
    isDoctorAddendumOpen = !isDoctorAddendumOpen;
  }

  if (isDoctorAddendumOpen) {
    fields.classList.remove('hidden');
    btnText.textContent = 'ซ่อนช่องบันทึก';
    btnIcon.setAttribute('data-lucide', 'chevron-up');
  } else {
    fields.classList.add('hidden');
    const patient = patientDatabase.find(p => p.id === activePatientId);
    const notes = patient?.doctor_notes || {};
    const hasNotes = Boolean(notes.additional_hpi || notes.physical_exam || notes.preliminary_dx || notes.plan);
    btnText.textContent = hasNotes ? 'แก้ไขบันทึกเพิ่มเติม (มีบันทึกแล้ว)' : 'เปิดบันทึกเพิ่มเติม';
    btnIcon.setAttribute('data-lucide', 'chevron-down');
  }
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function handleDoctorAddendumChange() {
  const patient = patientDatabase.find(p => p.id === activePatientId);
  if (!patient) return;

  if (!patient.doctor_notes) patient.doctor_notes = {};
  patient.doctor_notes.additional_hpi = document.getElementById('doctorAdditionalHpi').value;
  patient.doctor_notes.physical_exam = document.getElementById('doctorPhysicalExam').value;
  patient.doctor_notes.preliminary_dx = document.getElementById('doctorPrelimDx').value;
  patient.doctor_notes.plan = document.getElementById('doctorPlan').value;

  saveDatabase();
  updateDoctorTextAndJsonOutputs(patient);

  const ind = document.getElementById('saveStatusIndicator');
  if (ind) ind.innerHTML = '<i data-lucide="check" class="w-3.5 h-3.5 mr-1"></i> บันทึกแล้ว';
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function handleDirectNoteEdit(format) {
  const patient = patientDatabase.find(p => p.id === activePatientId);
  if (!patient) return;

  if (format === 'rapid') {
    patient.custom_rapid_note = document.getElementById('rapidTextView').value;
  } else {
    patient.custom_narrative_note = document.getElementById('narrativeTextView').value;
  }
  saveDatabase();
}

// =========================================================================
// MULTI-DEVICE RESPONSIVE WORKSPACE & VIEWPORT SIMULATOR
// =========================================================================
let currentSimulatedViewport = 'desktop';

function setDeviceViewportSimulator(mode) {
  currentSimulatedViewport = mode || 'desktop';
  const main = document.getElementById('mainAppContainer') || document.querySelector('main');
  const btnDesktop = document.getElementById('simBtnDesktop');
  const btnTablet = document.getElementById('simBtnTablet');
  const btnMobileStd = document.getElementById('simBtnMobileStd');
  const btnMobileSe = document.getElementById('simBtnMobileSe');

  const allBtns = [
    { btn: btnDesktop, key: 'desktop' },
    { btn: btnTablet, key: 'tablet' },
    { btn: btnMobileStd, key: 'mobile_std' },
    { btn: btnMobileSe, key: 'mobile_se' }
  ];

  allBtns.forEach(item => {
    if (!item.btn) return;
    item.btn.className = item.key === currentSimulatedViewport
      ? 'px-1.5 py-0.5 rounded font-bold bg-slate-700 text-white transition'
      : 'px-1.5 py-0.5 rounded text-slate-300 hover:text-white transition';
  });

  if (main) {
    main.classList.remove('sim-frame-mobile-se', 'sim-frame-mobile-std', 'sim-frame-tablet');
    if (currentSimulatedViewport === 'mobile_se') main.classList.add('sim-frame-mobile-se');
    else if (currentSimulatedViewport === 'mobile_std') main.classList.add('sim-frame-mobile-std');
    else if (currentSimulatedViewport === 'tablet') main.classList.add('sim-frame-tablet');
  }
  if (typeof document !== 'undefined' && document.body && document.body.classList) {
    document.body.classList.remove('sim-viewport-mobile-se', 'sim-viewport-mobile-std', 'sim-viewport-tablet');
    if (currentSimulatedViewport === 'mobile_se') document.body.classList.add('sim-viewport-mobile-se');
    else if (currentSimulatedViewport === 'mobile_std') document.body.classList.add('sim-viewport-mobile-std');
    else if (currentSimulatedViewport === 'tablet') document.body.classList.add('sim-viewport-tablet');
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

let currentDoctorMobileTab = 'note';

function switchDoctorMobileTab(tab) {
  currentDoctorMobileTab = tab || 'note';
  const btnNote = document.getElementById('docTabBtnNote');
  const btnCds = document.getElementById('docTabBtnCds');
  const cdsSection = document.getElementById('doctorCdsSection');
  const textCol = document.getElementById('doctorTextCol');
  const addendumCard = document.getElementById('doctorAddendumCard');
  if (btnNote && btnCds) {
    const isNote = currentDoctorMobileTab === 'note';
    btnNote.className = `flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center space-x-1.5 ${isNote ? 'font-bold bg-medical-600 text-white shadow-xs' : 'font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200'}`;
    btnCds.className = `flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center space-x-1.5 ${!isNote ? 'font-bold bg-medical-600 text-white shadow-xs' : 'font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200'}`;
    if (cdsSection) { cdsSection.classList.toggle('hidden', isNote); cdsSection.classList.toggle('block', !isNote); }
    if (textCol) { textCol.classList.toggle('hidden', !isNote); textCol.classList.toggle('block', isNote); }
    if (addendumCard) addendumCard.classList.toggle('hidden', !isNote);
  }
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

let isJsonDevViewerOpen = false;

function toggleJsonDevViewer(forceState) {
  isJsonDevViewerOpen = typeof forceState === 'boolean' ? forceState : !isJsonDevViewerOpen;
  const textCol = document.getElementById('doctorTextCol');
  const jsonCol = document.getElementById('doctorJsonCol');
  const btnText = document.getElementById('toggleJsonDevText');
  if (isJsonDevViewerOpen) {
    if (textCol) { textCol.classList.remove('lg:col-span-12'); textCol.classList.add('lg:col-span-7'); }
    if (jsonCol) { jsonCol.classList.remove('hidden'); jsonCol.classList.add('lg:block', 'lg:col-span-5'); }
    if (btnText) btnText.textContent = 'ซ่อน JSON (สำหรับ Dev)';
  } else {
    if (textCol) { textCol.classList.remove('lg:col-span-7'); textCol.classList.add('lg:col-span-12'); }
    if (jsonCol) { jsonCol.classList.add('hidden'); jsonCol.classList.remove('lg:block', 'lg:col-span-5'); }
    if (btnText) btnText.textContent = 'เปิดแสดง JSON (สำหรับ Dev)';
  }
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// =========================================================================
// INITIALIZATION & ROUTING
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
  mountAllCcQuestionnaires();
  initUniversalDateTimeInputs();
  renderChiefComplaints();
  initDatabase();
  clearChestpainPainScore();
  clearAbdpainPainScore();
  toggleBranch('dyspnea_orthopnea_wrap', false); toggleBranch('dyspnea_cough_wrap', false);
  toggleBranch('dyspnea_sputum_color_wrap', false); toggleBranch('dyspnea_chestpain_wrap', false);
  toggleBranch('dyspnea_leg_wrap', false); toggleBranch('dyspnea_allergy_wrap', false);
  toggleBranch('dyspnea_char_other_wrap', false); toggleBranch('ud_inhaler_detail_wrap', false);
  toggleBranch('dizziness_trig_other_wrap', false); toggleBranch('dizziness_tinnitus_side_wrap', false);
  toggleBranch('dizziness_hearing_loss_side_wrap', false); toggleBranch('dizziness_fullness_side_wrap', false);
  toggleBranch('dizziness_vomit_detail_wrap', false); toggleBranch('dizziness_vomit_actual_wrap', false);
  toggleBranch('dizziness_diarrhea_detail_wrap', false);
  updateRoleUiState();
  updateQrBannerUi();
  toggleJsonDevViewer(false);
  switchDoctorMobileTab('note');
  navigateTo('doctor'); // Open doctor view as default
  initQrQueueFromUrl(); // Override if URL has ?role=patient or ?queue=...
  if (typeof lucide !== 'undefined') lucide.createIcons();
});

// Render Chief Complaints Cards in Landing Page
function renderChiefComplaints() {
  const container = document.getElementById('ccGrid');
  if (!container) return;
  container.innerHTML = CHIEF_COMPLAINTS.map(cc => `
    <div onclick="selectChiefComplaint('${escapeHtml(cc.id)}', ${Boolean(cc.active)})" 
      class="selectable-card p-4 rounded-2xl cursor-pointer relative flex flex-col justify-between ${cc.active ? 'border-medical-500 ring-1 ring-medical-500 bg-sky-50/50' : 'hover:border-slate-300'}">
      <div>
        <div class="flex items-center justify-between mb-2">
          <div class="${cc.active ? 'bg-medical-600 text-white' : 'bg-slate-100 text-slate-600'} p-2 rounded-xl">
            <i data-lucide="${escapeHtml(cc.icon)}" class="w-4 h-4"></i>
          </div>
          ${cc.active 
            ? '<span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">พร้อมใช้งาน (Active)</span>'
            : '<span class="bg-slate-100 text-slate-500 text-[10px] font-medium px-2 py-0.5 rounded-full">ระยะถัดไป</span>'
          }
        </div>
        <h3 class="text-xs sm:text-sm font-bold text-slate-800 leading-snug">${escapeHtml(cc.titleTh)}</h3>
        <p class="text-[11px] text-slate-400 mt-1 font-sans">${escapeHtml(cc.titleEn)}</p>
      </div>
      <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] ${cc.active ? 'text-medical-600 font-semibold' : 'text-slate-400'}">
        <span>${cc.active ? 'คลิกเพื่อเริ่มตอบประวัติ' : 'กำลังจัดทำ Algorithm'}</span>
        <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
      </div>
    </div>
  `).join('');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function filterChiefComplaints() {
  const query = document.getElementById('ccSearchInput').value.toLowerCase().trim();
  const cards = document.querySelectorAll('#ccGrid > div');
  CHIEF_COMPLAINTS.forEach((cc, index) => {
    const text = `${cc.titleTh} ${cc.titleEn}`.toLowerCase();
    if (text.includes(query)) {
      cards[index].classList.remove('hidden');
    } else {
      cards[index].classList.add('hidden');
    }
  });
}

function selectChiefComplaint(id, isActive) {
  if (isActive) {
    setPatientFormChiefComplaint(id);
    navigateTo('patient');
    const found = CHIEF_COMPLAINTS.find(c => c.id === id);
    if (id === 'seizure') {
      showToast('เปิดแบบประเมินอาการ: ชัก / เกร็งกระตุก (หากอายุ < 6 ปี กรุณาใช้ CC: ชักเกร็งในเด็กอายุ < 6 ปี)');
    } else {
      showToast(`เปิดแบบประเมินอาการ: ${found ? found.titleTh : id}`);
    }
  } else {
    const found = CHIEF_COMPLAINTS.find(c => c.id === id);
    showToast(`กำลังพัฒนาแบบประเมิน: ${found ? found.titleTh : id} (เวอร์ชันนี้โปรดเลือก 'ปวดท้อง', 'ไข้ / หนาวสั่น', 'เจ็บแน่นหน้าอก', 'เหนื่อย' หรือ 'เวียนศีรษะ / บ้านหมุน')`);
  }
}

function setPatientFormChiefComplaint(ccId) {
  const reg = ensureCcRegistryEntry(ccId);
  if (!reg) {
    const found = typeof CHIEF_COMPLAINTS !== 'undefined' ? CHIEF_COMPLAINTS.find(c => c.id === ccId || c.schemaCode === ccId) : null;
    showToast(`กำลังพัฒนาแบบประเมิน: ${found ? found.titleTh : ccId} (โปรดแจ้งเจ้าหน้าที่พยาบาลจุดคัดกรอง)`);
    return false;
  }
  ccId = reg.formId;
  const dynMod = typeof getCcModule === 'function' ? getCcModule(ccId) : null;

  mountAllCcQuestionnaires();
  initUniversalDateTimeInputs();
  currentPatientFormCC = ccId;

  Object.values(CC_REGISTRY).forEach(entry => {
    const sec = document.getElementById(entry.sectionId);
    if (sec) {
      if (entry.formId === ccId) sec.classList.remove('hidden');
      else sec.classList.add('hidden');
    }
  });
  if (typeof CC_MODULES !== 'undefined') {
    Object.values(CC_MODULES).forEach(mod => {
      if (!mod || !mod.sectionDomId) return;
      const sec = document.getElementById(mod.sectionDomId);
      if (sec) {
        if (mod.id === ccId) sec.classList.remove('hidden');
        else sec.classList.add('hidden');
      }
    });
  }

  const headerTitleTh = document.getElementById('patientFormHeaderTitleTh');
  const headerTitleEn = document.getElementById('patientFormHeaderTitleEn');
  const headerSubtitle = document.getElementById('patientFormHeaderSubtitle');
  const ccBadge = document.getElementById('patientFormCcBadge');

  if (headerSubtitle) {
    headerSubtitle.textContent = 'กรุณาเลือกอาการที่ตรงกับท่าน เพื่อให้ท่านได้รับการรักษาอย่างถูกต้องและเหมาะสม';
  }
  if (headerTitleTh) headerTitleTh.textContent = reg.headerTh;
  if (headerTitleEn) headerTitleEn.textContent = reg.headerEn;
  if (ccBadge) ccBadge.innerHTML = reg.badgeHtml;

  if (ccId === 'abdpain') {
    handlePatientTitleChange();
    if (!editingPatientId) clearAbdpainPainScore();
  } else if (ccId === 'headache') {
    if (!editingPatientId) clearHeadachePainScore();
  } else if (ccId === 'stroke_deficit') {
    if (!editingPatientId) checkStrokeFibrinolyticTrigger();
  } else if (ccId === 'seizure') {
    checkSeizurePediatricAgeGuidance();
  } else if (ccId === 'vomiting') {
    handlePatientTitleChange();
  } else if (dynMod && typeof dynMod.onSelectForm === 'function') {
    dynMod.onSelectForm({ editingPatientId });
  }

  updateSectionNumbering();
  if (ccId === 'chestpain' && !editingPatientId) {
    clearChestpainPainScore();
    checkChestpainHighRiskMedTrigger();
  }
  if (typeof lucide !== 'undefined') lucide.createIcons();
  return true;
}


function updateSectionNumbering() {
  const pmhNumEl = document.getElementById('pmhSectionNumber');
  if (!pmhNumEl) return;

  const dynMod = typeof getCcModule === 'function' ? getCcModule(currentPatientFormCC) : null;
  if (dynMod && typeof dynMod.getPmhSectionNumber === 'function') {
    pmhNumEl.textContent = String(dynMod.getPmhSectionNumber());
    return;
  }
  if (dynMod && dynMod.pmhSectionNumber) {
    pmhNumEl.textContent = String(dynMod.pmhSectionNumber);
    return;
  }

  if (currentPatientFormCC === 'fever') {
    pmhNumEl.textContent = '3';
  } else if (currentPatientFormCC === 'abdpain') {
    pmhNumEl.textContent = '5';
  } else if (currentPatientFormCC === 'chestpain') {
    const highRiskCard = document.getElementById('chestpain_high_risk_med_section');
    const isHighRiskVisible = highRiskCard && !highRiskCard.classList.contains('hidden');
    pmhNumEl.textContent = isHighRiskVisible ? '5' : '4';
  } else if (currentPatientFormCC === 'dyspnea') {
    pmhNumEl.textContent = '4';
  } else if (currentPatientFormCC === 'dizziness') {
    pmhNumEl.textContent = '6';
  } else if (currentPatientFormCC === 'headache') {
    pmhNumEl.textContent = '6';
  } else if (currentPatientFormCC === 'stroke_deficit') {
    const strokeContraCard = document.getElementById('stroke_fibrinolytic_contra_section');
    const isStrokeContraVisible = strokeContraCard && !strokeContraCard.classList.contains('hidden');
    pmhNumEl.textContent = isStrokeContraVisible ? '6' : '5';
  } else if (currentPatientFormCC === 'seizure') {
    pmhNumEl.textContent = '7';
  } else if (currentPatientFormCC === 'syncope') {
    pmhNumEl.textContent = '7';
  } else if (currentPatientFormCC === 'altered_mental') {
    pmhNumEl.textContent = '7';
  } else if (currentPatientFormCC === 'vomiting') {
    const branchVomitingFemale = document.getElementById('vomiting_branch_female_lmp');
    const isFemaleVisible = branchVomitingFemale && !branchVomitingFemale.classList.contains('hidden');
    pmhNumEl.textContent = isFemaleVisible ? '7' : '6';
  }
}

// Headache Pain Score & Handlers

function handlePatientTitleChange() {
  const title = document.getElementById('patientTitleSelect')?.value || '';
  const isFemale = title.includes('นาง') || title.includes('ด.ญ.') || title.includes('Mrs') || title.includes('Ms') || title.includes('Miss');
  const branchFemale = document.getElementById('abdpain_branch_female');
  if (branchFemale) {
    if (currentPatientFormCC === 'abdpain' && isFemale) {
      branchFemale.classList.remove('hidden');
    } else {
      branchFemale.classList.add('hidden');
    }
  }
  const branchVomitingFemale = document.getElementById('vomiting_branch_female_lmp');
  if (branchVomitingFemale) {
    if (currentPatientFormCC === 'vomiting' && isFemale) {
      branchVomitingFemale.classList.remove('hidden');
    } else if (currentPatientFormCC === 'vomiting' && !isFemale) {
      branchVomitingFemale.classList.add('hidden');
    }
  }
  const dynMod = typeof getCcModule === 'function' ? getCcModule(currentPatientFormCC) : null;
  if (dynMod && typeof dynMod.onTitleChange === 'function') {
    dynMod.onTitleChange({ title, isFemale });
  }
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Navigation Router with RBAC View Guard
function navigateTo(view) {
  // OWASP A01: Role-Based Access Control View Guard
  if (currentUserRole === 'patient' && view === 'doctor') {
    showToast('🔒 เฉพาะแพทย์และเจ้าหน้าที่ห้องฉุกเฉินเท่านั้น (กรุณาเข้าสู่ระบบสำหรับแพทย์)');
    openStaffLoginModal('doctor');
    return;
  }

  currentView = view;
  const landingView = document.getElementById('ccLandingView');
  const patientView = document.getElementById('patientView');
  const patientStatusView = document.getElementById('patientStatusView');
  const doctorView = document.getElementById('doctorView');
  
  const navLandingBtn = document.getElementById('navLandingBtn');
  const navPatientBtn = document.getElementById('navPatientBtn');
  const navDoctorBtn = document.getElementById('navDoctorBtn');

  if (landingView) landingView.classList.add('hidden');
  if (patientView) patientView.classList.add('hidden');
  if (patientStatusView) patientStatusView.classList.add('hidden');
  if (doctorView) doctorView.classList.add('hidden');

  const navBtns = [navLandingBtn, navPatientBtn, navDoctorBtn];
  navBtns.forEach(btn => {
    if (btn) {
      btn.classList.remove('bg-white', 'text-medical-700', 'shadow-sm');
      btn.classList.add('text-slate-600');
    }
  });

  if (view === 'landing') {
    if (landingView) landingView.classList.remove('hidden');
    if (navLandingBtn) {
      navLandingBtn.classList.add('bg-white', 'text-medical-700', 'shadow-sm');
      navLandingBtn.classList.remove('text-slate-600');
    }
  } else if (view === 'patient') {
    if (patientView) patientView.classList.remove('hidden');
    if (navPatientBtn) {
      navPatientBtn.classList.add('bg-white', 'text-medical-700', 'shadow-sm');
      navPatientBtn.classList.remove('text-slate-600');
    }
  } else if (view === 'patientStatus') {
    if (patientStatusView) patientStatusView.classList.remove('hidden');
    if (navPatientBtn) {
      navPatientBtn.classList.add('bg-white', 'text-medical-700', 'shadow-sm');
      navPatientBtn.classList.remove('text-slate-600');
    }
    try {
      renderPatientStatusView();
    } catch (err) {
      console.error('renderPatientStatusView error:', err);
    }
  } else if (view === 'doctor') {
    if (doctorView) doctorView.classList.remove('hidden');
    if (navDoctorBtn) {
      navDoctorBtn.classList.add('bg-white', 'text-medical-700', 'shadow-sm');
      navDoctorBtn.classList.remove('text-slate-600');
    }
    try {
      renderQueueCards();
      renderDoctorDashboard();
    } catch (err) {
      console.error('renderDoctorDashboard error:', err);
    }
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();
  if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function toggleBranch(elementId, isVisible) {
  const el = document.getElementById(elementId);
  if (!el) return;
  if (isVisible) el.classList.remove('hidden');
  else el.classList.add('hidden');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function toggleOtherInput(wrapId, isChecked) {
  const el = document.getElementById(wrapId);
  if (!el) return;
  if (isChecked) {
    el.classList.remove('hidden');
    const input = el.querySelector('input');
    if (input) input.focus();
  } else {
    el.classList.add('hidden');
  }
}

function handleHospRecordChange(status) {
  const notice = document.getElementById('hospRecordCompleteNotice');
  const pmhDetails = document.getElementById('pmhDetailsSection');
  if (!notice || !pmhDetails) return;
  if (status === 'complete') {
    notice.classList.remove('hidden');
    pmhDetails.classList.add('hidden');
  } else {
    notice.classList.add('hidden');
    pmhDetails.classList.remove('hidden');
  }
}

function handleNauseaOnlyToggle(isNauseaOnly) {
  const charSection = document.getElementById('vomitCharSection');
  const freqInput = document.getElementById('vomitFreq');
  if (!charSection || !freqInput) return;
  if (isNauseaOnly) {
    freqInput.value = 0;
    freqInput.disabled = true;
    charSection.classList.add('opacity-40', 'pointer-events-none');
  } else {
    freqInput.disabled = false;
    charSection.classList.remove('opacity-40', 'pointer-events-none');
  }
}

function switchTextFormat(fmt) {
  currentTextFormat = fmt;
  const rapidBtn = document.getElementById('formatRapidBtn');
  const narrativeBtn = document.getElementById('formatNarrativeBtn');
  const rapidView = document.getElementById('rapidTextView');
  const narrativeView = document.getElementById('narrativeTextView');

  if (fmt === 'rapid') {
    rapidView.classList.remove('hidden');
    narrativeView.classList.add('hidden');
    rapidBtn.className = "px-2.5 py-1 rounded-md font-semibold bg-white text-medical-700 shadow-xs transition";
    narrativeBtn.className = "px-2.5 py-1 rounded-md font-medium text-slate-600 hover:text-slate-900 transition";
  } else {
    rapidView.classList.add('hidden');
    narrativeView.classList.remove('hidden');
    rapidBtn.className = "px-2.5 py-1 rounded-md font-medium text-slate-600 hover:text-slate-900 transition";
    narrativeBtn.className = "px-2.5 py-1 rounded-md font-semibold bg-white text-medical-700 shadow-xs transition";
  }
}

// =========================================================================
// 8. SUBMIT NEW OR EDITED PATIENT INTAKE
// =========================================================================
function getOtherSymptomsFree() {
  const activeId = `${currentPatientFormCC}_other_free`;
  const activeEl = document.getElementById(activeId);
  if (activeEl && activeEl.value && activeEl.value.trim()) {
    return activeEl.value.trim();
  }
  const fallbackIds = [
    'sx_other_free',
    'abdpain_other_free',
    'chestpain_other_free',
    'dyspnea_other_free',
    'dizziness_other_free',
    'headache_other_free',
    'stroke_other_free',
    'seizure_other_free',
    'syncope_other_free',
    'alteredMentalAdditionalNotes',
    'vomitingAdditionalNotes'
  ];
  for (const id of fallbackIds) {
    const el = document.getElementById(id);
    if (el && el.value && el.value.trim()) {
      return el.value.trim();
    }
  }
  return '';
}

function handlePatientSubmit(e) {
  if (e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
  }

  try {
    const titleSelect = document.getElementById('patientTitleSelect');
    const nameInput = document.getElementById('patientNameInput');
    const ageInput = document.getElementById('patientAgeInput');

    const patientTitle = titleSelect?.value || '';
    const rawName = nameInput?.value?.trim() || '';
    const rawAgeStr = ageInput?.value?.trim() || '';
    const patientAge = rawAgeStr ? parseInt(rawAgeStr, 10) : 0;

    const hasVerifiedQrTicket = Boolean(activeQrQueuePass && activeQrQueuePass.hn);

    if (rawAgeStr && (isNaN(patientAge) || patientAge <= 0 || patientAge > 130)) {
      showToast('⚠️ กรุณาระบุอายุผู้ป่วยให้ถูกต้อง (1-120 ปี)');
      if (ageInput) {
        ageInput.focus();
        ageInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Check if we are updating an existing patient record (Patient self-edit or Doctor Guided Edit)
    const existingPatient = editingPatientId ? patientDatabase.find(p => p.id === editingPatientId) : null;

    const nextQueueNum = patientDatabase.length + 40;
    const queueNumber = existingPatient
      ? existingPatient.queue_number
      : (currentUserRole === 'patient' && activeQrQueuePass.queue_number ? activeQrQueuePass.queue_number : `E1-0${nextQueueNum}`);
    const randomHn = existingPatient
      ? existingPatient.hn
      : (currentUserRole === 'patient' && activeQrQueuePass.hn ? activeQrQueuePass.hn : `67${Math.floor(10000 + Math.random() * 90000)}`);

    const cleanTitle = patientTitle.replace(/\s*\(.*?\)/, '').trim();
    let patientName = '';
    if (rawName) {
      patientName = (rawName.startsWith(patientTitle) || (cleanTitle && rawName.startsWith(cleanTitle))) ? rawName : `${patientTitle ? patientTitle + ' ' : ''}${rawName}`;
    } else if (existingPatient && existingPatient.name) {
      patientName = existingPatient.name;
    } else if (hasVerifiedQrTicket) {
      patientName = activeQrQueuePass.name || `ผู้ป่วย (HN: ${activeQrQueuePass.hn})`;
    } else {
      patientName = 'ผู้รับบริการ (ไม่ระบุชื่อ)';
    }
    const qrAge = parseInt(activeQrQueuePass.age, 10);
    const effectiveAge = (patientAge > 0 && patientAge <= 130)
      ? patientAge
      : ((qrAge > 0 && qrAge <= 130) ? qrAge : 'ไม่ระบุ');

    // Infer gender from prefix (check female first to prevent 'Mrs.' matching 'Mr')
    let gender = 'ไม่ระบุ';
    if (patientTitle.includes('นาง') || patientTitle.includes('ด.ญ.') || patientTitle.includes('Mrs') || patientTitle.includes('Ms') || patientTitle.includes('Miss')) {
      gender = 'หญิง';
    } else if (patientTitle.includes('นาย') || patientTitle.includes('ด.ช.') || patientTitle.includes('(Mr.)') || patientTitle.includes('Master')) {
      gender = 'ชาย';
    }

    // Shared PMH, Allergies & Current Medications
    const hospRecordStatus = document.querySelector('input[name="hospRecordStatus"]:checked')?.value || 'unspecified';
    const underlying = [];
    let drugAllergy = 'ไม่ได้ระบุ';
    let currentMeds = 'ไม่ได้ระบุ';

    if (hospRecordStatus === 'complete') {
      underlying.push('มีประวัติเดิมครบถ้วนในฐานข้อมูล รพ.ราชบุรี (ดึงข้อมูลอัตโนมัติ)');
      drugAllergy = 'ตามฐานข้อมูล รพ.ราชบุรี';
      currentMeds = 'ตามฐานข้อมูล รพ.ราชบุรี';
    } else {
      if (document.getElementById('ud_dm')?.checked) underlying.push('เบาหวาน (DM)');
      if (document.getElementById('ud_ht')?.checked) underlying.push('ความดันสูง (HT)');
      if (document.getElementById('ud_dlp')?.checked) underlying.push('ไขมันในเลือดสูง (Dyslipidemia)');
      if (document.getElementById('ud_cad')?.checked) underlying.push('หลอดเลือดหัวใจ (CAD)');
      if (document.getElementById('ud_stroke')?.checked) underlying.push('หลอดเลือดสมอง (Stroke)');
      if (document.getElementById('ud_ckd')?.checked) underlying.push('ไตเรื้อรัง (CKD)');
      if (document.getElementById('ud_asthma')?.checked) underlying.push('หอบหืด (Asthma)');
      if (document.getElementById('ud_copd')?.checked) underlying.push('ถุงลมโป่งพอง (COPD)');
      if (document.getElementById('ud_cancer')?.checked) {
        const cancerType = document.getElementById('ud_cancer_type')?.value.trim();
        underlying.push(`มะเร็ง${cancerType ? ` (${cancerType})` : ''}`);
      }
      const udOther = document.getElementById('ud_other')?.value.trim();
      if (udOther) underlying.push(udOther);

      const hasAllergy = document.querySelector('input[name="hasDrugAllergy"]:checked')?.value;
      if (hasAllergy === 'yes') {
        const details = document.getElementById('drugAllergyDetails')?.value.trim();
        drugAllergy = details ? `มีประวัติแพ้ยา/แพ้อาหาร: ${details}` : 'มีประวัติแพ้ยา/แพ้อาหาร (ไม่ระบุชื่อ)';
      } else if (hasAllergy === 'no') {
        drugAllergy = 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร';
      } else {
        drugAllergy = 'ไม่ได้ระบุ';
      }

      const medsInput = document.getElementById('currentMeds')?.value.trim();
      const medsUnknown = document.getElementById('currentMedsUnknown')?.checked;
      if (medsUnknown) {
        currentMeds = medsInput && medsInput !== 'ไม่มี'
          ? `มียาประจำตัว (ไม่ทราบชื่อยา: ${medsInput})`
          : 'มียาประจำตัว (ไม่ทราบชื่อยา)';
      } else {
        currentMeds = medsInput || 'ไม่ได้ระบุ';
      }
    }

    const preservedDoctorNotes = existingPatient?.doctor_notes || {
      additional_hpi: '',
      physical_exam: '',
      preliminary_dx: '',
      plan: ''
    };
    const recordId = existingPatient ? existingPatient.id : `case-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const recordStatus = existingPatient ? existingPatient.status : 'waiting';
    const otherSymptomsFree = getOtherSymptomsFree();

    let newPatient;
    mountAllCcQuestionnaires();
    const ccMod = getCcModule(currentPatientFormCC) || getCcModule('fever');
    if (ccMod && typeof ccMod.collectIntake === 'function') {
      newPatient = ccMod.collectIntake({
        recordId,
        queueNumber,
        randomHn,
        patientName,
        patientAge: effectiveAge,
        gender,
        recordStatus,
        hospRecordStatus,
        underlying,
        drugAllergy,
        currentMeds,
        preservedDoctorNotes,
        otherSymptomsFree
      });
    }


    sanitizePatientRecord(newPatient);
    newPatient.vital_signs = existingPatient?.vital_signs || (currentUserRole === 'patient' && activeQrQueuePass.vital_signs ? activeQrQueuePass.vital_signs : newPatient.vital_signs);
    newPatient.esi_level = existingPatient?.esi_level || (currentUserRole === 'patient' && activeQrQueuePass.esi ? activeQrQueuePass.esi : newPatient.esi_level);
    if (activeQrQueuePass.gender && currentUserRole === 'patient') {
      newPatient.gender = activeQrQueuePass.gender;
    }
    updateDoctorTextAndJsonOutputs(newPatient);

    const wasEditing = Boolean(existingPatient);
    if (wasEditing) {
      const idx = patientDatabase.findIndex(p => p.id === existingPatient.id);
      if (idx !== -1) patientDatabase[idx] = newPatient;
    } else {
      patientDatabase.push(newPatient);
    }

    activePatientId = newPatient.id;
    lastSubmittedPatientId = newPatient.id;
    editingPatientId = null;
    hideFormEditBanner();
    saveDatabase();

    // Reset form
    resetIntakeFormClean();

    // Role-based routing after submit:
    // - Patient stays on their own Queue Status Confirmation screen (can edit their own history, cannot see Doctor View)
    // - Doctor / Admin returns to the Doctor Dashboard with the patient active
    if (currentUserRole === 'patient') {
      navigateTo('patientStatus');
      showToast(wasEditing
        ? `บันทึกการแก้ไขข้อมูลประวัติเรียบร้อย (บัตรคิว: ${queueNumber})`
        : `ส่งข้อมูลประวัติเข้าคิวห้องฉุกเฉินเรียบร้อย (บัตรคิว: ${queueNumber})`
      );
    } else {
      navigateTo('doctor');
      showToast(wasEditing
        ? `อัปเดตข้อมูลประวัติผู้ป่วย [${queueNumber}] เรียบร้อยแล้ว`
        : `ส่งข้อมูลประวัติเข้าคิวห้องฉุกเฉินเรียบร้อย (บัตรคิว: ${queueNumber} - ${newPatient.chief_complaint_title})`
      );
    }
  } catch (err) {
    console.error('Submit intake error:', err);
    alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + err.message);
  }
}

// =========================================================================
// 9. RENDER ACTIVE PATIENT IN DOCTOR DASHBOARD (OWASP XSS-SAFE)
// =========================================================================
function renderDoctorDashboard() {
  const workspace = document.getElementById('activePatientWorkspace');
  const emptyNotice = document.getElementById('emptyQueueNotice');
  if (!workspace || !emptyNotice) return;

  const patient = patientDatabase.find(p => p.id === activePatientId);

  if (!patient) {
    workspace.classList.add('hidden');
    emptyNotice.classList.remove('hidden');
    return;
  }

  workspace.classList.remove('hidden');
  emptyNotice.classList.add('hidden');

  renderTriageVitalSignsCard(patient);

  // 1. Patient Header Info (textContent is inherently XSS-safe)
  const ageLabel = (patient.age && patient.age !== 'ไม่ระบุ') ? `${patient.age} ปี` : 'ไม่ระบุ';
  document.getElementById('activeQueueDisplay').textContent = patient.queue_number;
  document.getElementById('activeNameDisplay').textContent = patient.name;
  document.getElementById('activeDemogDisplay').textContent = `อายุ ${ageLabel} | ${patient.gender || 'ไม่ระบุ'}`;
  document.getElementById('activeHnDisplay').textContent = patient.hn;
  
  const dtObj = patient.timestamp ? new Date(patient.timestamp) : new Date();
  const dateDdMm = !isNaN(dtObj.getTime())
    ? `${String(dtObj.getDate()).padStart(2, '0')}/${String(dtObj.getMonth() + 1).padStart(2, '0')}/${dtObj.getFullYear()}`
    : '';
  const timeStr = formatTime24h(dtObj);
  document.getElementById('activeTimestampDisplay').textContent = `บันทึกเมื่อ: ${dateDdMm ? `${dateDdMm} ` : ''}เวลา ${timeStr} น.`;

  const activeCcDisplay = document.getElementById('activeCcDisplay');
  if (activeCcDisplay) {

    const ccModForBadge = getCcModule(patient.chief_complaint) || getCcModule('fever');
    if (ccModForBadge && ccModForBadge.doctorCcBadgeHtml) {
      activeCcDisplay.innerHTML = ccModForBadge.doctorCcBadgeHtml;
    }
  }

  const statusBadge = document.getElementById('activeStatusBadge');
  const closeBtn = document.getElementById('closeCaseBtn');
  const reopenBtn = document.getElementById('reopenCaseBtn');
  if (patient.status === 'completed') {
    statusBadge.textContent = 'ตรวจแล้ว / ปิดเคส';
    statusBadge.className = 'text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full';
    if (closeBtn) closeBtn.classList.add('hidden');
    if (reopenBtn) reopenBtn.classList.remove('hidden');
  } else {
    statusBadge.textContent = 'รอการตรวจ';
    statusBadge.className = 'text-[10px] bg-sky-100 text-sky-800 font-semibold px-2 py-0.5 rounded-full';
    if (closeBtn) closeBtn.classList.remove('hidden');
    if (reopenBtn) reopenBtn.classList.add('hidden');
  }

  // 2. Load Doctor Addendum values
  const notes = patient.doctor_notes || {};
  document.getElementById('doctorAdditionalHpi').value = notes.additional_hpi || '';
  document.getElementById('doctorPhysicalExam').value = notes.physical_exam || '';
  document.getElementById('doctorPrelimDx').value = notes.preliminary_dx || '';
  document.getElementById('doctorPlan').value = notes.plan || '';

  const hasNotes = Boolean(notes.additional_hpi || notes.physical_exam || notes.preliminary_dx || notes.plan);
  const btnText = document.getElementById('toggleDoctorAddendumText');
  if (btnText) {
    if (isDoctorAddendumOpen) {
      btnText.textContent = 'ซ่อนช่องบันทึก';
    } else {
      btnText.textContent = hasNotes ? 'แก้ไขบันทึกเพิ่มเติม (มีบันทึกแล้ว)' : 'เปิดบันทึกเพิ่มเติม';
    }
  }

  // 3. Red Flags Detection (Chief Complaint + Triage Vital Signs)
  const redFlags = [];
  const ccModForRf = getCcModule(patient.chief_complaint) || getCcModule('fever');
  if (ccModForRf && typeof ccModForRf.evaluateRedFlags === 'function') {
    const detected = ccModForRf.evaluateRedFlags(patient) || [];
    detected.forEach(rf => redFlags.push(rf));
  }
  const vsRedFlags = detectVitalSignsRedFlags(patient);
  vsRedFlags.forEach(rf => redFlags.unshift(rf));

  patient.redFlags = redFlags;

  const rfBanner = document.getElementById('redFlagBanner');
  const safeBanner = document.getElementById('safeFlagBanner');
  const rfList = document.getElementById('redFlagList');
  const redDot = document.getElementById('redFlagDot');

  if (redFlags.length > 0) {
    rfBanner.classList.remove('hidden');
    safeBanner.classList.add('hidden');
    if (redDot) redDot.classList.remove('hidden');
    rfList.innerHTML = redFlags.map(rf => `
      <li>
        <strong class="text-rose-900">${escapeHtml(rf.textTh)}</strong>:
        <span class="text-rose-700 font-normal">${escapeHtml(rf.risk)}</span>
      </li>
    `).join('');
  } else {
    rfBanner.classList.add('hidden');
    safeBanner.classList.remove('hidden');
    if (redDot) redDot.classList.add('hidden');
  }

  // 3.1 Render Contraindication Banner for Chest Pain
  const contraBanner = document.getElementById('cardiacContraindicationBanner');
  if (contraBanner) {
    if (patient.chief_complaint === 'chest_pain') {
      contraBanner.classList.remove('hidden');
      const absoluteList = [];
      const relativeList = [];
      const ntgList = [];

      if (patient.ci_ich_tumor_avm) absoluteList.push('เคยมีเลือดออกในสมอง / เนื้องอกในสมอง / หลอดเลือดสมองโป่งพองหรือขด (Prior ICH / Brain Tumor / AVM)');
      if (patient.ci_ischemic_stroke === 'within_3m') absoluteList.push('มีประวัติหลอดเลือดสมองตีบหรืออัมพฤกษ์ ภายใน 3 เดือน (Ischemic Stroke < 3 months)');
      if (patient.ci_cns_surgery_3m) absoluteList.push('ได้รับการผ่าตัดสมองหรือไขสันหลัง ภายใน 3 เดือน (Recent CNS Surgery < 3 months)');
      if (patient.ci_major_surgery_3w) absoluteList.push('ได้รับการผ่าตัดใหญ่ ภายใน 3 สัปดาห์ (Major Surgery < 3 weeks)');
      if (patient.ci_head_facial_trauma_3m) absoluteList.push('ได้รับการบาดเจ็บรุนแรงที่ศีรษะหรือใบหน้า ภายใน 3 เดือน (Severe Head/Facial Trauma < 3 months)');
      if (patient.ci_internal_bleeding === 'current_active') absoluteList.push('มีแผลหรือเลือดออกจากภายใน/ทางเดินอาหาร ที่กำลังดำเนินอยู่ในปัจจุบัน (Active Internal/GI Bleeding)');
      if (patient.chestpainChars?.includes('tearing_sharp') || redFlags.some(rf => rf.key === 'aortic_dissection')) absoluteList.push('มีอาการสงสัยภาวะหลอดเลือดแดงใหญ่ฉีกขาด (Suspected Aortic Dissection)');

      if (patient.ci_ischemic_stroke === '3_to_6m') relativeList.push('มีประวัติหลอดเลือดสมองตีบหรืออัมพฤกษ์ ในช่วง 3-6 เดือน (Ischemic Stroke 3-6 months)');
      if (patient.ci_internal_bleeding === 'within_1m') relativeList.push('มีประวัติแผลหรือเลือดออกจากภายใน/ทางเดินอาหาร ในช่วงไม่เกิน 1 เดือน (Internal/GI Bleeding < 1 month)');
      if (patient.ci_prior_fibrinolytic) relativeList.push('เคยได้รับยาสลายลิ่มเลือดทางหลอดเลือดโดยด่วนมาก่อน (Prior Fibrinolytic Therapy)');
      if (patient.ci_coagulopathy_anticoagulant) relativeList.push('มีภาวะเลือดออกผิดปกติ หรือกำลังได้รับยาต้านการแข็งตัวของเลือด เช่น Warfarin (Bleeding Diathesis / Anticoagulants)');
      if (patient.ci_pregnancy_postpartum_1w) relativeList.push('การตั้งครรภ์ หรือหลังคลอดบุตรภายใน 1 สัปดาห์ (Pregnancy / Postpartum < 1 week)');
      relativeList.push('ความดันโลหิตสูงรุนแรง: SBP > 180 หรือ DBP > 110 mmHg (Severe Uncontrolled HT - ต้องประเมิน V/S)');

      if (patient.ci_pde5_inhibitor) ntgList.push('🚫 ได้รับยากลุ่มรักษาหย่อนสมรรถภาพทางเพศ (PDE-5 Inhibitor เช่น Viagra/Sildenafil, Cialis/Tadalafil) ภายใน 24-48 ชม. (เสี่ยง Severe Hypotension / Shock)');
      if (patient.chestpain_rf_diaphoresis || patient.chestpain_rf_syncope) ntgList.push('⚠️ มีอาการหน้ามืด วูบ หรือเหงื่อแตกตัวเย็นซีด (ต้องตรวจวัดระดับความดันโลหิตก่อนให้ ห้ามให้หาก SBP < 90 mmHg)');

      const absEl = document.getElementById('absoluteContraList');
      const relEl = document.getElementById('relativeContraList');
      const ntgEl = document.getElementById('ntgContraList');
      const fibBadge = document.getElementById('fibrinolyticStatusBadge');
      const ntgBadge = document.getElementById('ntgStatusBadge');

      if (absEl && relEl && ntgEl && fibBadge && ntgBadge) {
        if (absoluteList.length > 0) {
          absEl.innerHTML = absoluteList.map(item => `<li class="text-rose-400 font-medium">${escapeHtml(item)}</li>`).join('');
          fibBadge.textContent = '🛑 มีข้อห้ามเด็ดขาด (Absolute CI)';
          fibBadge.className = 'text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30';
        } else {
          absEl.innerHTML = '<li class="text-emerald-400 font-normal">✓ ไม่พบข้อห้ามเด็ดขาด (No Absolute Contraindications Detected)</li>';
          if (relativeList.length > 1) {
            fibBadge.textContent = '⚠️ มีข้อห้ามสัมพัทธ์ (Relative CI)';
            fibBadge.className = 'text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30';
          } else {
            fibBadge.textContent = '✓ ปลอดภัยเบื้องต้น';
            fibBadge.className = 'text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
          }
        }

        relEl.innerHTML = relativeList.map(item => `<li class="text-amber-300/90 font-normal">${escapeHtml(item)}</li>`).join('');

        if (patient.ci_pde5_inhibitor) {
          ntgEl.innerHTML = ntgList.map(item => `<li class="text-rose-400 font-medium">${escapeHtml(item)}</li>`).join('');
          ntgBadge.textContent = '🚫 ห้ามใช้ (Contraindicated)';
          ntgBadge.className = 'text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30';
        } else {
          ntgEl.innerHTML = ntgList.length > 0 ? ntgList.map(item => `<li class="text-amber-300/90 font-normal">${escapeHtml(item)}</li>`).join('') : '<li class="text-emerald-400 font-normal">✓ ไม่พบข้อห้ามใช้ Nitroglycerin (No PDE-5 inhibitor use)</li>';
          ntgBadge.textContent = ntgList.length > 0 ? '⚠️ ควรวัด BP ก่อนให้' : '✓ ปลอดภัย';
          ntgBadge.className = `text-[10px] px-2 py-0.5 rounded-full font-bold ${ntgList.length > 0 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`;
        }
      }
    } else {
      contraBanner.classList.add('hidden');
    }
  }

  // 3.2 Render Contraindication Banner for Stroke (IV Fibrinolysis rt-PA / Tenecteplase)
  const strokeContraBanner = document.getElementById('strokeContraindicationBanner');
  if (strokeContraBanner) {
    if (patient.chief_complaint === 'stroke_deficit') {
      strokeContraBanner.classList.remove('hidden');
      const evalStrokeCi = evaluateStrokeFibrinolysisContraindications(patient);

      const timeSummaryEl = document.getElementById('strokeTimeWindowSummaryText');
      const windowBadgeEl = document.getElementById('strokeFastTrackWindowBadge');
      const fibStatusBadgeEl = document.getElementById('strokeFibrinolyticStatusBadge');
      const absListEl = document.getElementById('strokeAbsoluteContraList');
      const relListEl = document.getElementById('strokeRelativeContraList');

      if (timeSummaryEl) timeSummaryEl.textContent = evalStrokeCi.timeSummaryText;

      if (windowBadgeEl) {
        if (patient.strokeOnsetContext === 'transient_resolved') {
          windowBadgeEl.textContent = '⏱️ อาการทุเลาลงแล้ว (Suspected TIA)';
          windowBadgeEl.className = 'text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30';
        } else if (evalStrokeCi.isWithin4_5Hours) {
          windowBadgeEl.textContent = '⚡ ภายใน 4.5 ชม. (Stroke Fast Track Window)';
          windowBadgeEl.className = 'text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
        } else {
          windowBadgeEl.textContent = '⏰ เกิน 4.5 ชม. (Outside Standard IV rt-PA Window)';
          windowBadgeEl.className = 'text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-slate-700 text-slate-300 border border-slate-600';
        }
      }

      if (absListEl && relListEl && fibStatusBadgeEl) {
        if (evalStrokeCi.absoluteList.length > 0) {
          absListEl.innerHTML = evalStrokeCi.absoluteList.map(item => `<li class="text-rose-400 font-medium">${escapeHtml(item)}</li>`).join('');
          fibStatusBadgeEl.textContent = '🛑 มีข้อห้ามเด็ดขาด (Absolute CI)';
          fibStatusBadgeEl.className = 'text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30';
        } else {
          absListEl.innerHTML = '<li class="text-emerald-400 font-normal">✓ ไม่พบข้อห้ามเด็ดขาดจากประวัติผู้ป่วย (ต้องรอผล Non-contrast CT Brain + Lab ยืนยัน)</li>';
          if (!evalStrokeCi.isWithin4_5Hours) {
            fibStatusBadgeEl.textContent = '⏰ เกิน 4.5 ชม. (พิจารณา Thrombectomy หาก LVO)';
            fibStatusBadgeEl.className = 'text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30';
          } else if (evalStrokeCi.relativeList.length > 0) {
            fibStatusBadgeEl.textContent = '⚠️ มีข้อควรระวังสัมพัทธ์ (Relative CI)';
            fibStatusBadgeEl.className = 'text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30';
          } else {
            fibStatusBadgeEl.textContent = '✓ ผ่านเกณฑ์ประวัติเบื้องต้น';
            fibStatusBadgeEl.className = 'text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
          }
        }
        relListEl.innerHTML = evalStrokeCi.relativeList.length > 0 ? evalStrokeCi.relativeList.map(item => `<li class="text-amber-300/90 font-normal">${escapeHtml(item)}</li>`).join('') : '<li class="text-emerald-400 font-normal">✓ ไม่พบข้อห้ามสัมพัทธ์จากประวัติผู้ป่วย</li>';
      }
    } else {
      strokeContraBanner.classList.add('hidden');
    }
  }

  // 4. Update Outputs
  updateDoctorTextAndJsonOutputs(patient);
}


// =========================================================================
// 9. MODULAR DOCTOR TEXT & JSON SCHEMA DISPATCHER
// =========================================================================
function formatAddendumSectionForClinicalNote(patient) {
  const docNotes = patient?.doctor_notes || {};
  const dx = (docNotes.preliminary_dx || '').trim();
  const plan = (docNotes.plan || '').trim();
  const dxDisplay = dx ? (/^\[Provisional/i.test(dx) ? `\n${dx}` : dx) : '-';
  const planDisplay = plan ? (plan.includes('\n') ? `\n${plan}` : plan) : '-';
  return `\n\n[Doctor's Clinical Addendum & Exam]\n• ประวัติเพิ่มเติม/แก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}\n• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}\n• การวินิจฉัยเบื้องต้น (Impression): ${dxDisplay}\n• แผนการรักษา (Plan/Orders): ${planDisplay}`;
}

function formatClinicalAddendumDisplay(text) {
  return (text || '')
    .replace(/(• การวินิจฉัยเบื้องต้น(?:\s*\(Impression\))?:)\s*(\[Provisional\s*&\s*Differential\s*Diagnosis\])/gi, '$1\n$2')
    .replace(/(• แผนการรักษา(?:\s*\(Plan\/Orders\))?:)\s*(\[Treatment Plan|2\.1\s)/gi, '$1\n$2');
}

function buildFallbackMedicalJson(patient) {
  return {
    encounter: {
      hospital: 'Ratchaburi Hospital',
      department: 'Emergency Department',
      queue_number: patient.queue_number || '-',
      chief_complaint: patient.chief_complaint || '-',
      chief_complaint_title_th: patient.chief_complaint_title || patient.chief_complaint || '-',
      timestamp: patient.timestamp || new Date().toISOString(),
      esi_level: patient.esi_level || 3
    },
    patient_identification: {
      id: patient.id || '-',
      hn: patient.hn || '-',
      name: patient.name || '-',
      age: patient.age || 'ไม่ระบุ',
      gender: patient.gender || 'ไม่ระบุ'
    },
    red_flags_detected: (patient.redFlags || []).map(rf => ({ key: rf.key, description: rf.textTh, risk: rf.risk })),
    pertinent_positives: Array.isArray(patient.pertinentPositives) ? patient.pertinentPositives : [],
    pertinent_negatives: Array.isArray(patient.pertinentNegatives) ? patient.pertinentNegatives : [],
    doctor_clinical_addendum: patient.doctor_notes || { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' }
  };
}

function updateDoctorTextAndJsonOutputs(patient) {
  if (!patient) return;
  const jsonEl = document.getElementById('jsonViewer');
  const jsonSentinel = '__JSON_PENDING__';
  if (jsonEl) jsonEl.textContent = jsonSentinel;

  const ccMod = getCcModule(patient.chief_complaint) || getCcModule('fever');
  if (ccMod && typeof ccMod.updateOutputs === 'function') {
    ccMod.updateOutputs(patient);
  }

  const rapidEl = document.getElementById('rapidTextView');
  const narrativeEl = document.getElementById('narrativeTextView');
  const docNotes = patient.doctor_notes || {};
  const hasAnyAddendum = Boolean(
    (docNotes.additional_hpi || '').trim() ||
    (docNotes.physical_exam || '').trim() ||
    (docNotes.preliminary_dx || '').trim() ||
    (docNotes.plan || '').trim()
  );

  if (rapidEl && rapidEl.value) {
    if (!patient.age || patient.age === 'ไม่ระบุ') {
      rapidEl.value = rapidEl.value.replace(/อายุ\s*(ไม่ระบุ|null|undefined|-)\s*ปี/g, 'อายุ ไม่ระบุ');
    }
    if (!rapidEl.value.includes("[Doctor's Clinical Addendum & Exam]") && !patient.custom_rapid_note) {
      rapidEl.value += formatAddendumSectionForClinicalNote(patient);
    }
    rapidEl.value = formatClinicalAddendumDisplay(rapidEl.value);
    patient.rapidHpi = rapidEl.value;
  }

  if (narrativeEl && narrativeEl.value) {
    if (!patient.age || patient.age === 'ไม่ระบุ') {
      narrativeEl.value = narrativeEl.value.replace(/อายุ\s*(ไม่ระบุ|null|undefined|-)\s*ปี/g, 'อายุ ไม่ระบุ');
    }
    if (hasAnyAddendum && !narrativeEl.value.includes("[Doctor's Clinical Addendum & Exam]") && !patient.custom_narrative_note) {
      narrativeEl.value += formatAddendumSectionForClinicalNote(patient);
    }
    narrativeEl.value = formatClinicalAddendumDisplay(narrativeEl.value);
    patient.narrativeHpi = narrativeEl.value;
  }

  if (jsonEl && jsonEl.textContent === jsonSentinel) {
    const fallbackJson = buildFallbackMedicalJson(patient);
    jsonEl.textContent = JSON.stringify(fallbackJson, null, 2);
    patient.medicalJson = fallbackJson;
  }
}

// Section 10 (1-Click Medical AI Consultant & Admin Workbench) lives in ai_consultant_core.js

// =========================================================================
// 11. CLIPBOARD, DOWNLOAD & TOAST HELPERS
// =========================================================================
function copyClinicalText() {
  const isRapid = currentTextFormat === 'rapid';
  const textToCopy = isRapid ? document.getElementById('rapidTextView')?.value : document.getElementById('narrativeTextView')?.value;
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(textToCopy || '').then(() => showToast('คัดลอกข้อความสรุปประวัติแพทย์เรียบร้อย!'));
  }
}

function copyJsonOutput() {
  const jsonText = document.getElementById('jsonViewer')?.textContent || '';
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(jsonText).then(() => showToast('คัดลอก JSON Schema เรียบร้อย!'));
  }
}

function downloadJsonFile() {
  const patient = patientDatabase.find(p => p.id === activePatientId);
  const jsonText = document.getElementById('jsonViewer')?.textContent || '';
  const blob = new Blob([jsonText], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `intake_${patient?.chief_complaint || 'case'}_${patient ? patient.queue_number : 'case'}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('ดาวน์โหลดไฟล์ JSON เรียบร้อย!');
}

function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const msg = document.getElementById('toastMsg');
  if (!toast || !msg) return;
  msg.textContent = message;
  toast.classList.remove('translate-y-24', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');
  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-24', 'opacity-0');
  }, 2500);
}
