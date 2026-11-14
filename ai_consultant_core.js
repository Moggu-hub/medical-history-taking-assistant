// ============================================================================
// 1-CLICK MEDICAL AI CONSULTANT & ADMIN WORKBENCH (ai_consultant_core.js)
// Strict Role Separation: Doctor (Direct API, Zero Built-in CDS) vs Admin (3-Zone Pre-Send Inspector)
// ============================================================================

const AI_GATEWAY_CONFIG_KEY = 'er_ai_gateway_config_v2';
const AI_PROMPT_TEMPLATES_KEY = 'er_ai_prompt_templates_v1';
const AI_LEGACY_KEY_STORAGE = 'medhistory_ai_api_key_v1';

const AI_PROVIDER_PRESETS = {
  gemini: { endpoint: 'https://generativelanguage.googleapis.com', model: 'gemini-3.8-flash' },
  gemini_3_1_pro: { endpoint: 'https://generativelanguage.googleapis.com', model: 'gemini-3.1-pro-preview' },
  gemini_2_5_flash: { endpoint: 'https://generativelanguage.googleapis.com', model: 'gemini-2.5-flash' },
  custom_openai: { endpoint: 'https://api.openai.com/v1/chat/completions', model: 'gpt-4o-mini' },
  z_ai: { endpoint: 'https://api.z.ai/api/coding/paas/v4/chat/completions', model: 'glm-4-plus' }
};

const DEFAULT_AI_PROMPT_TEMPLATES = {
  systemInstruction: `ROLE: Evidence-Based Emergency Physician Consultant assisting physicians in the ER with differential diagnosis (with ICD-10 codes) and structured initial ER orders.
STRICT ANTI-HALLUCINATION & CLOSED-WORLD RULES:
1. ZERO ASSUMPTION: วิเคราะห์จาก CC, History, V/S และ PE ที่ให้มาเท่านั้น ห้ามสมมุติ แต่งเติม หรือสรุปอาการ/ผลตรวจที่ไม่ได้ระบุ
2. MISSING DATA HANDLING: หากขาดข้อมูลสำคัญยิ่งยวดต่อการ Rule out ภาวะวิกฤต ให้ระบุในหัวข้อ 2.1 ประวัติและการตรวจร่างกายเพิ่มเติม ที่ควรทำทันที ห้ามเดาเอง
3. EVIDENCE ANCHORING: ทุกข้อวินิจฉัย (DDx) ต้องอิงหลักฐาน Pertinent Positives/Negatives ที่ปรากฏจริงในเคส
4. ICD-10 & EXTERNAL CAUSE: ทุกการวินิจฉัยต้องระบุรหัส ICD-10 ต่อท้ายเสมอ และกรณีอุบัติเหตุ การบาดเจ็บ ถูกทำร้าย ทำร้ายตนเอง สารพิษ หรือสัตว์กัดต่อย ต้องระบุ External Cause Code ที่เกี่ยวข้องด้วย (เช่น S09.9, V29.xx, X84.x, T65.x, W54.x)
5. SAFE MANAGEMENT & DOSING: ระบุแนวทาง Investigation, Resuscitation และยามาตรฐาน หากไม่ทราบน้ำหนัก/ค่าไต ห้ามระบุโดสเจาะจง ให้ระบุชื่อกลุ่มยามาตรฐานและเตือน re-check CPG
TOKEN EFFICIENCY: ไม่มีคำทักทาย เกริ่นนำ หรือข้อความปิดท้าย เริ่มต้นที่โครงสร้างทันที ใช้คำย่อการแพทย์มาตรฐาน (V/S, CBC, CXR, EKG, POCUS, IV, PO, stat, R/O)

REQUIRED OUTPUT FORMAT (ตอบเป็นภาษาไทยผสมศัพท์แพทย์สากลตามโครงสร้างนี้เท่านั้น):

[PROVISIONAL_DDX]
[Provisional & Differential Diagnosis]
• 1. <การวินิจฉัยลำดับที่ 1> (ICD-10: <รหัสโรค เช่น K35.80 หรือ S09.9>[, External Cause: <รหัสสาเหตุภายนอก เช่น V29.xx กรณีบาดเจ็บ/พิษ/สัตว์กัด>]): <เหตุผลอ้างอิงสั้นๆ ไม่เกิน 1 บรรทัด>
• 2. <การวินิจฉัยลำดับที่ 2> (ICD-10: <รหัสโรค>): <เหตุผลอ้างอิงสั้นๆ ไม่เกิน 1 บรรทัด>
• 3. <การวินิจฉัยลำดับที่ 3> (ICD-10: <รหัสโรค>): <เหตุผลอ้างอิงสั้นๆ ไม่เกิน 1 บรรทัด>
(สามารถระบุจำนวนโรคตามความน่าจะเป็นทางคลินิกได้ตามจริง)
**ภาวะวิกฤตที่ต้องเฝ้าระวังหรือ Rule out:** (ระบุเฉพาะเมื่อมีภาวะวิกฤตฉุกเฉินที่ต้องเฝ้าระวัง พร้อม ICD-10 และเหตุผลสั้นๆ รวมไม่เกิน 5 บรรทัด หากไม่มีไม่ต้องใส่หัวข้อนี้)

[ER_ORDERS]
2.1 ประวัติ และการตรวจร่างกายเพิ่มเติม ที่ควรทำทันที (Immediate Focused History & Physical Exam):
- [ ] <ประวัติที่ควรถามเพิ่มเติมเร่งด่วน หรือการตรวจร่างกายเจาะจงที่ควรทำทันที เช่น Abdominal/PR exam, Neuro exam, FAST, Capillary refill>
- [ ] ...

2.2 การส่งตรวจเพิ่มเติมทันที (Immediate Investigations):
- [ ] <รายการตรวจทางห้องปฏิบัติการ/พิเศษ เช่น 12-lead EKG, CBC, CXR, POCUS, CT>
- [ ] ...

2.3 แผนการรักษาเบื้องต้น & ข้อควรระวังด้านยา (Initial Management & Drug Safety):
- [ ] <การรักษา/ยาที่ต้องให้ทันที เช่น IV fluid, ยาฉีด/ยากิน>
- [ ] ⚠️ <ข้อควรระวัง/ข้อห้ามใช้ยาในเคสนี้ เช่น ห้าม NSAIDs, ยาที่ผู้ป่วยแพ้>`,

  promptHeader: `[คำขอปรึกษาแนวทางเวชปฏิบัติฉุกเฉิน (De-identified Clinical Profile - PDPA Compliant)]
โปรดประเมินข้อมูลผู้ป่วยฉุกเฉินที่ไม่ระบุตัวตนด้านล่างตามหลักฐานเชิงประจักษ์อย่างเคร่งครัด:`,

  promptFooter: `กรุณาวิเคราะห์และตอบตามโครงสร้าง [PROVISIONAL_DDX] และ [ER_ORDERS] เท่านั้น:
1) ส่วน [PROVISIONAL_DDX] ต้องขึ้นต้นด้วยหัวข้อ [Provisional & Differential Diagnosis] อย่างชัดเจน และระบุรหัส ICD-10 (พร้อม External Cause Code ที่เกี่ยวข้อง เช่น (S09.9), (V29.xx) ในเคสบาดเจ็บ/อุบัติเหตุ/สารพิษ/สัตว์กัด/ทำร้ายตนเอง) ต่อท้ายทุก diagnosis
2) ส่วน [ER_ORDERS] ต้องแยก 3 หัวข้อย่อยชัดเจน:
   - 2.1 ประวัติ และการตรวจร่างกายเพิ่มเติม ที่ควรทำทันที
   - 2.2 การส่งตรวจเพิ่มเติมทันที (Immediate Investigations)
   - 2.3 แผนการรักษาเบื้องต้น & ข้อควรระวังด้านยา (Initial Management & Drug Safety)
   โดยใช้ bullet point (- [ ]) สำหรับทุกรายการ`
};

let inMemoryAiApiKey = '';
let pendingAiApplyMode = null;
let currentAiParsedDx = '';
let currentAiParsedOrders = '';

function safeAiStorageGet(key) {
  try {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
  } catch (_) {
    return null;
  }
}

function safeAiStorageSet(key, val) {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, val);
  } catch (_) {}
}

function safeAiStorageRemove(key) {
  try {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
  } catch (_) {}
}

function getAiUserRole() {
  return (typeof currentUserRole !== 'undefined' && currentUserRole === 'admin') ? 'admin' : 'doctor';
}

function getStoredAiPromptTemplates() {
  const defaults = { ...DEFAULT_AI_PROMPT_TEMPLATES };
  try {
    const raw = safeAiStorageGet(AI_PROMPT_TEMPLATES_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return {
      systemInstruction: (parsed.systemInstruction || '').trim() ? parsed.systemInstruction : defaults.systemInstruction,
      promptHeader: (parsed.promptHeader || '').trim() ? parsed.promptHeader : defaults.promptHeader,
      promptFooter: (parsed.promptFooter || '').trim() ? parsed.promptFooter : defaults.promptFooter
    };
  } catch (_) {
    return defaults;
  }
}

function getActiveAiPromptTemplatesForRun() {
  if (getAiUserRole() === 'admin' && typeof document !== 'undefined') {
    const sysEl = document.getElementById('aiPromptSystemInput');
    const hdrEl = document.getElementById('aiPromptHeaderInput');
    const ftrEl = document.getElementById('aiPromptFooterInput');
    const stored = getStoredAiPromptTemplates();
    return {
      systemInstruction: (sysEl?.value || '').trim() || stored.systemInstruction,
      promptHeader: (hdrEl?.value || '').trim() || stored.promptHeader,
      promptFooter: (ftrEl?.value || '').trim() || stored.promptFooter
    };
  }
  return getStoredAiPromptTemplates();
}

function stripPdpaFromSummary(rawSummary, patient) {
  let cleanSummary = (rawSummary || '').trim();
  if (patient?.name && patient.name.trim()) {
    cleanSummary = cleanSummary.split(patient.name.trim()).join('[ผู้ป่วย]');
    const parts = patient.name.trim().split(/\s+/).filter(p => p.length >= 3 && !['นาย', 'นาง', 'นางสาว', 'ด.ช.', 'ด.ญ.'].includes(p));
    for (const part of parts) {
      cleanSummary = cleanSummary.split(part).join('[ผู้ป่วย]');
    }
  }
  if (patient?.hn && String(patient.hn).trim()) {
    cleanSummary = cleanSummary.split(String(patient.hn).trim()).join('[HN]');
  }
  if (patient?.queue_number && String(patient.queue_number).trim()) {
    cleanSummary = cleanSummary.split(String(patient.queue_number).trim()).join('[QUEUE]');
  }
  cleanSummary = cleanSummary.replace(/(?:โรงพยาบาล[^\s,\n\]]*|รพ\.[^\s,\n\]]+|Ratchaburi Hospital)/gi, '');
  cleanSummary = cleanSummary.replace(/(?:Hospital|โรงพยาบาล)\s*:\s*[^\n|]+/gi, '');
  cleanSummary = cleanSummary.replace(/(?:Name|ชื่อผู้ป่วย|ชื่อ-นามสกุล|ชื่อ-สกุล|ชื่อ)\s*:\s*[^\n|]+/gi, '');
  cleanSummary = cleanSummary.replace(/(?:HN|Hospital Number)\s*:\s*[^\n|]+/gi, '');
  cleanSummary = cleanSummary.replace(/(?:Queue|คิว|ลำดับคิว)\s*:\s*[^\n|]+/gi, '');
  return cleanSummary.replace(/\n{3,}/g, '\n\n').trim();
}

function extractPatientClinicalPayload(patient, clinicalTextSummary) {
  if (!patient) return '';
  const rfText = (patient.redFlags && patient.redFlags.length > 0)
    ? patient.redFlags.map((rf, i) => `  ${i + 1}. 🚩 ${rf.textTh} (${rf.risk})`).join('\n')
    : '  - ไม่พบสัญญาณเตือนวิกฤตเบื้องต้น';

  const vs = patient.vital_signs;
  const vsStr = vs
    ? `BP: ${vs.bp || ((vs.sbp || vs.dbp) ? `${vs.sbp || '-'}/${vs.dbp || '-'}` : '-')} mmHg, PR: ${vs.pr || '-'} bpm, RR: ${vs.rr || '-'} /min, BT: ${vs.bt || '-'} °C, SpO2: ${vs.spo2 ? vs.spo2 + '%' : '-'}, SI: ${(vs.sbp && vs.pr) ? (vs.pr / vs.sbp).toFixed(2) : '-'}`
    : 'ไม่มีข้อมูลสัญญาณชีพแรกรับ';

  const cleanSummary = stripPdpaFromSummary(clinicalTextSummary, patient);
  const docNotes = patient.doctor_notes || {};
  const ageStr = (patient.age && patient.age !== 'ไม่ระบุ') ? `${patient.age} ปี` : 'ไม่ระบุอายุ';
  const udList = Array.isArray(patient.underlying) && patient.underlying.length > 0
    ? patient.underlying.join(', ')
    : (typeof patient.underlying === 'string' && patient.underlying ? patient.underlying : 'ปฏิเสธ/ไม่มี');

  return `1. ข้อมูลทางคลินิกเบื้องต้น:
- เพศ: ${patient.gender || 'ไม่ระบุ'} | อายุ: ${ageStr}
- อาการสำคัญ (CC): ${patient.chief_complaint_title || patient.chief_complaint}
- สัญญาณชีพและ Shock Index: ${vsStr}
- สัญญาณเตือนวิกฤต (Red Flags):
${rfText}

2. สรุปประวัติการเจ็บป่วยและอาการสำคัญ:
${cleanSummary || 'ไม่มีรายงานประวัติย่อ'}

3. ข้อมูลเดิมและการตรวจร่างกายโดยแพทย์:
- โรคประจำตัว (U/D): ${udList}
- ประวัติแพ้ยา/แพ้อาหาร: ${patient.drugAllergy || 'ปฏิเสธ/ไม่ได้ระบุ'}
- ยาประจำตัวเดิม: ${patient.currentMeds || 'ไม่มี/ไม่ได้ระบุ'}
- ผลตรวจร่างกาย (PE): ${docNotes.physical_exam || 'ยังไม่ได้บันทึก'}
- ประวัติเพิ่มเติมจากแพทย์ (Clarified HPI): ${docNotes.additional_hpi || 'ไม่มี'}`;
}

function auditPdpaStripping(extractedText, patient) {
  const leaks = [];
  if (!extractedText) return { clean: true, leaks };
  const name = (patient?.name || '').trim();
  if (name.length > 2 && extractedText.includes(name)) leaks.push('ชื่อ-สกุลผู้ป่วย');
  const hn = String(patient?.hn || '').trim();
  if (hn && extractedText.includes(hn)) leaks.push('HN');
  const queueNo = String(patient?.queue_number || '').trim();
  if (queueNo && extractedText.includes(queueNo)) leaks.push('หมายเลขคิว');
  if (/Ratchaburi Hospital|โรงพยาบาลราชบุรี/i.test(extractedText)) leaks.push('ชื่อโรงพยาบาล');
  return { clean: leaks.length === 0, leaks };
}

function composeAiUserPrompt(templates, extractedData) {
  const tpl = templates || getStoredAiPromptTemplates();
  return [tpl.promptHeader?.trim(), extractedData?.trim(), tpl.promptFooter?.trim()].filter(Boolean).join('\n\n');
}

var AI_CONSULTANT_CONFIG = {
  defaultProvider: 'gemini',
  defaultModel: 'gemini-3.8-flash',
  defaultEndpoint: 'https://generativelanguage.googleapis.com',
  get systemInstruction() {
    return getStoredAiPromptTemplates().systemInstruction;
  },
  get promptHeader() {
    return getStoredAiPromptTemplates().promptHeader;
  },
  get promptFooter() {
    return getStoredAiPromptTemplates().promptFooter;
  },
  extractPatientData: extractPatientClinicalPayload,
  auditPdpa: auditPdpaStripping,
  buildConsultationPrompt: function(patient, clinicalTextSummary, overrideTemplates = null) {
    if (!patient) return '';
    const extracted = extractPatientClinicalPayload(patient, clinicalTextSummary);
    return composeAiUserPrompt(overrideTemplates || getStoredAiPromptTemplates(), extracted);
  }
};

function getStoredAiConfig() {
  const defaults = {
    provider: 'gemini',
    endpoint: 'https://generativelanguage.googleapis.com',
    model: 'gemini-3.8-flash'
  };
  try {
    const raw = safeAiStorageGet(AI_GATEWAY_CONFIG_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    const cfg = { ...defaults, ...parsed };
    if (parsed.provider === 'z_ai' && (!parsed.model || parsed.model === 'glm-4-plus')) {
      cfg.provider = 'gemini';
      cfg.endpoint = 'https://generativelanguage.googleapis.com';
      cfg.model = 'gemini-3.8-flash';
    } else if (!cfg.model || cfg.model.includes('1.5') || cfg.model.includes('2.0')) {
      cfg.model = 'gemini-3.8-flash';
    }
    return cfg;
  } catch (_) {
    return defaults;
  }
}

function getActiveAiGatewayConfigForRun() {
  const stored = getStoredAiConfig();
  if (getAiUserRole() === 'admin' && typeof document !== 'undefined') {
    const provider = document.getElementById('aiProviderSelect')?.value || stored.provider;
    const endpoint = (document.getElementById('aiApiEndpointInput')?.value || '').trim() || stored.endpoint;
    const model = (document.getElementById('aiApiModelInput')?.value || '').trim() || stored.model;
    return { provider, endpoint, model };
  }
  return stored;
}

function getStoredAiApiKey() {
  if (inMemoryAiApiKey) return inMemoryAiApiKey;
  try {
    const rawObf = safeAiStorageGet('er_ai_k_obf_v2') || safeAiStorageGet(AI_LEGACY_KEY_STORAGE) || '';
    if (!rawObf) return '';
    if (rawObf.startsWith('obf:') && typeof atob === 'function') {
      const decoded = atob(rawObf.slice(4));
      inMemoryAiApiKey = decoded;
      return decoded;
    }
    inMemoryAiApiKey = rawObf;
    return rawObf;
  } catch (_) {
    return '';
  }
}

function saveAiAdminSettings() {
  if (typeof document === 'undefined') return;
  const provider = document.getElementById('aiProviderSelect')?.value || 'gemini';
  const endpoint = (document.getElementById('aiApiEndpointInput')?.value || '').trim();
  const model = (document.getElementById('aiApiModelInput')?.value || '').trim();
  const rawKey = (document.getElementById('aiApiKeyInput')?.value || '').trim();

  safeAiStorageSet(AI_GATEWAY_CONFIG_KEY, JSON.stringify({ provider, endpoint, model }));
  if (rawKey && !rawKey.includes('••••')) {
    inMemoryAiApiKey = rawKey;
    try {
      safeAiStorageSet('er_ai_k_obf_v2', typeof btoa === 'function' ? 'obf:' + btoa(rawKey) : rawKey);
    } catch (_) {
      safeAiStorageSet('er_ai_k_obf_v2', rawKey);
    }
  }
  updateAiAdminUiState();
  if (typeof showToast === 'function') showToast('✓ บันทึกการตั้งค่า AI Gateway และจัดเก็บคีย์เรียบร้อย');
}

function clearAiAdminApiKey() {
  inMemoryAiApiKey = '';
  safeAiStorageRemove('er_ai_k_obf_v2');
  safeAiStorageRemove(AI_LEGACY_KEY_STORAGE);
  if (typeof document !== 'undefined') {
    const keyInput = document.getElementById('aiApiKeyInput');
    if (keyInput) keyInput.value = '';
  }
  updateAiAdminUiState();
  if (typeof showToast === 'function') showToast('🔒 ล้าง API Key ออกจากอุปกรณ์เรียบร้อยแล้ว');
}

function saveAiPromptTemplates() {
  if (typeof document === 'undefined') return;
  const sysVal = (document.getElementById('aiPromptSystemInput')?.value || '').trim() || DEFAULT_AI_PROMPT_TEMPLATES.systemInstruction;
  const hdrVal = (document.getElementById('aiPromptHeaderInput')?.value || '').trim() || DEFAULT_AI_PROMPT_TEMPLATES.promptHeader;
  const ftrVal = (document.getElementById('aiPromptFooterInput')?.value || '').trim() || DEFAULT_AI_PROMPT_TEMPLATES.promptFooter;

  safeAiStorageSet(AI_PROMPT_TEMPLATES_KEY, JSON.stringify({
    systemInstruction: sysVal,
    promptHeader: hdrVal,
    promptFooter: ftrVal
  }));
  updateCombinedPromptPreview();
  if (typeof showToast === 'function') showToast('✓ บันทึก System / Prompt Header & Footer เรียบร้อย');
}

function resetAiPromptTemplates() {
  safeAiStorageRemove(AI_PROMPT_TEMPLATES_KEY);
  if (typeof document !== 'undefined') {
    const sysEl = document.getElementById('aiPromptSystemInput');
    const hdrEl = document.getElementById('aiPromptHeaderInput');
    const ftrEl = document.getElementById('aiPromptFooterInput');
    if (sysEl) sysEl.value = DEFAULT_AI_PROMPT_TEMPLATES.systemInstruction;
    if (hdrEl) hdrEl.value = DEFAULT_AI_PROMPT_TEMPLATES.promptHeader;
    if (ftrEl) ftrEl.value = DEFAULT_AI_PROMPT_TEMPLATES.promptFooter;
    updateCombinedPromptPreview();
  }
  if (typeof showToast === 'function') showToast('↺ รีเซ็ต Prompt Templates กลับค่าเริ่มต้นแล้ว');
}

function updateCombinedPromptPreview() {
  if (typeof document === 'undefined') return;
  const extracted = document.getElementById('aiExtractedDataBox')?.value || '';
  const templates = getActiveAiPromptTemplatesForRun();
  const previewEl = document.getElementById('aiConsultantPromptText');
  if (previewEl) previewEl.value = composeAiUserPrompt(templates, extracted);
}

function updateAiAdminUiState() {
  if (typeof document === 'undefined') return;
  const cfg = getStoredAiConfig();
  const hasKey = Boolean(getStoredAiApiKey());

  const providerSelect = document.getElementById('aiProviderSelect');
  const endpointInput = document.getElementById('aiApiEndpointInput');
  const modelInput = document.getElementById('aiApiModelInput');
  const keyInput = document.getElementById('aiApiKeyInput');
  const keyBadge = document.getElementById('aiKeyStatusBadge');

  if (providerSelect) providerSelect.value = cfg.provider;
  if (endpointInput) endpointInput.value = cfg.endpoint;
  if (modelInput) modelInput.value = cfg.model;

  if (keyInput) {
    keyInput.value = hasKey ? '••••••••••••••••' : '';
    keyInput.placeholder = hasKey ? 'มีคีย์บันทึกอยู่แล้ว (กรอกใหม่เพื่อเปลี่ยน)' : 'กรอก API Key สำหรับเชื่อมต่อโมเดล AI ภายนอก';
  }

  if (keyBadge) {
    keyBadge.innerHTML = hasKey
      ? '<span class="inline-flex items-center text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold text-[10px]"><i data-lucide="shield-check" class="w-3 h-3 mr-1"></i> API Key พร้อมใช้งาน</span>'
      : '<span class="inline-flex items-center text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full font-semibold text-[10px]"><i data-lucide="key-round" class="w-3 h-3 mr-1"></i> ยังไม่ตั้งค่า API Key</span>';
  }
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function handleAiProviderPresetChange() {
  if (typeof document === 'undefined') return;
  const provider = document.getElementById('aiProviderSelect')?.value || 'gemini';
  const endpointInput = document.getElementById('aiApiEndpointInput');
  const modelInput = document.getElementById('aiApiModelInput');
  const preset = AI_PROVIDER_PRESETS[provider];
  if (preset && endpointInput && modelInput) {
    endpointInput.value = preset.endpoint;
    modelInput.value = preset.model;
  }
}

function normalizeDxOutputHeader(dxText) {
  const clean = (dxText || '').replace(/\[PROVISIONAL_DDX\]/gi, '').trim();
  if (!clean) return '';
  if (/^\[Provisional\s*&\s*Differential\s*Diagnosis\]/i.test(clean)) return clean;
  return `[Provisional & Differential Diagnosis]\n${clean}`;
}

function parseAiConsultantResponse(rawText) {
  const text = String(rawText || '').trim();
  if (!text) return { dxText: '', ordersText: '' };

  let dxText = '';
  let ordersText = '';
  if (text.includes('[PROVISIONAL_DDX]') && text.includes('[ER_ORDERS]')) {
    const parts = text.split('[ER_ORDERS]');
    dxText = parts[0].replace('[PROVISIONAL_DDX]', '').trim();
    ordersText = parts[1].trim();
  } else if (text.includes('### 1.') && text.includes('### 2.')) {
    const parts = text.split(/###\s*2\./);
    dxText = parts[0].replace(/###\s*1\./, '').trim();
    ordersText = parts[1].trim();
  } else if (text.includes('1.') && (text.includes('2.1') || text.includes('2.'))) {
    const splitIdx = text.search(/\n\s*2\./);
    if (splitIdx !== -1) {
      dxText = text.substring(0, splitIdx).trim();
      ordersText = text.substring(splitIdx).trim();
    } else {
      dxText = text;
      ordersText = text;
    }
  } else {
    dxText = text;
    ordersText = text;
  }

  return { dxText: normalizeDxOutputHeader(dxText), ordersText };
}

function renderAiConsultantOutput(rawText) {
  const { dxText, ordersText } = parseAiConsultantResponse(rawText);
  currentAiParsedDx = dxText;
  currentAiParsedOrders = ordersText;
  if (typeof document !== 'undefined') {
    const dxBox = document.getElementById('aiResultDxBox');
    const ordersBox = document.getElementById('aiResultOrdersBox');
    if (dxBox) dxBox.value = dxText;
    if (ordersBox) ordersBox.value = ordersText;
  }
}

function setAiStatusMessage(text, tone = 'neutral') {
  if (typeof document === 'undefined') return;
  const el = document.getElementById('aiApiStatusMsg');
  if (!el) return;
  const toneClasses = {
    neutral: 'text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2',
    loading: 'text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl px-3 py-2 font-medium animate-pulse',
    success: 'text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 font-semibold',
    error: 'text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 font-semibold'
  };
  el.textContent = text;
  el.className = toneClasses[tone] || toneClasses.neutral;
}

function openAiConsultantModal() {
  const patient = (typeof patientDatabase !== 'undefined' && Array.isArray(patientDatabase))
    ? patientDatabase.find(p => p.id === activePatientId)
    : null;
  if (!patient) {
    if (typeof showToast === 'function') showToast('⚠️ กรุณาเลือกผู้ป่วยในคิวก่อนเปิดระบบปรึกษา AI');
    return null;
  }

  if (typeof updateDoctorTextAndJsonOutputs === 'function') updateDoctorTextAndJsonOutputs(patient);
  const rapidText = document.getElementById('rapidTextView')?.value || '';
  const extractedData = extractPatientClinicalPayload(patient, rapidText);
  const templates = getStoredAiPromptTemplates();
  const combinedPrompt = composeAiUserPrompt(templates, extractedData);
  const pdpaAudit = auditPdpaStripping(extractedData, patient);

  const isAdmin = getAiUserRole() === 'admin';
  const adminPanel = document.getElementById('aiAdminWorkbenchSection');
  const roleBadgeEl = document.getElementById('aiModalRoleBadge');
  const badgeEl = document.getElementById('aiModalPatientBadge');
  const runBtn = document.getElementById('runAiAnalysisBtn');

  if (badgeEl) {
    badgeEl.textContent = `[ผู้ป่วย] อายุ ${patient.age || 'ไม่ระบุ'} ปี, เพศ${patient.gender || 'ไม่ระบุ'} • CC: ${patient.chief_complaint_title || patient.chief_complaint}`;
  }
  if (roleBadgeEl) {
    roleBadgeEl.textContent = isAdmin ? 'Admin Pre-Send Workbench' : 'Doctor Direct 1-Click';
    roleBadgeEl.className = isAdmin
      ? 'text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-100 border border-amber-300/40'
      : 'text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-400/25 text-white border border-indigo-300/40';
  }
  if (adminPanel) adminPanel.classList.toggle('hidden', !isAdmin);

  // Sync data & templates into DOM (used directly by Admin Workbench & API payload)
  const extBox = document.getElementById('aiExtractedDataBox');
  const sysEl = document.getElementById('aiPromptSystemInput');
  const hdrEl = document.getElementById('aiPromptHeaderInput');
  const ftrEl = document.getElementById('aiPromptFooterInput');
  const promptEl = document.getElementById('aiConsultantPromptText');
  const pdpaBadge = document.getElementById('aiPdpaAuditBadge');

  if (extBox) extBox.value = extractedData;
  if (sysEl) sysEl.value = templates.systemInstruction;
  if (hdrEl) hdrEl.value = templates.promptHeader;
  if (ftrEl) ftrEl.value = templates.promptFooter;
  if (promptEl) promptEl.value = combinedPrompt;
  if (pdpaBadge) {
    pdpaBadge.textContent = pdpaAudit.clean
      ? '✓ PDPA Verified: ตัดชื่อ-สกุล / HN / คิว / ชื่อ รพ. ออกครบ 100%'
      : `⚠️ พบข้อมูลระบุตัวตน: ${pdpaAudit.leaks.join(', ')}`;
    pdpaBadge.className = pdpaAudit.clean
      ? 'text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300'
      : 'text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300';
  }

  updateAiAdminUiState();

  if (isAdmin) {
    if (runBtn) runBtn.innerHTML = '<i data-lucide="send" class="w-3.5 h-3.5"></i><span>ยืนยันส่งคำถามออก API</span>';
    let savedAi = patient.aiConsultResult;
    if (!savedAi) {
      try {
        const cached = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('er_ai_consult_' + patient.id) : null;
        if (cached) {
          savedAi = JSON.parse(cached);
          patient.aiConsultResult = savedAi;
        }
      } catch (_) {}
    }
    if (savedAi && savedAi.rawText) {
      renderAiConsultantOutput(savedAi.rawText);
      setAiStatusMessage(`✓ แสดงผลจาก AI ล่าสุด (${savedAi.model || 'API'}) — Admin สามารถปรับ Prompt/Model ด้านบนแล้วกด "ยืนยันส่งคำถามออก API"`, 'success');
    } else {
      renderAiConsultantOutput('');
      setAiStatusMessage('🛠️ โหมด Admin Workbench: ตรวจสอบข้อมูลคนไข้, แก้ไข Prompt ส่วนหัว/ท้าย และตั้งค่า API ก่อนกดยืนยันส่งคำถามออก API', 'neutral');
    }
    const modal = document.getElementById('aiConsultantModal');
    if (modal) modal.classList.remove('hidden');
    if (typeof lucide !== 'undefined') lucide.createIcons();
    return null;
  }

  // Doctor Role: Bypass intermediate screen & Built-in CDS completely -> fire API immediately
  if (runBtn) runBtn.innerHTML = '<i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i><span>วิเคราะห์ซ้ำ (Re-run AI)</span>';
  renderAiConsultantOutput('');
  const modal = document.getElementById('aiConsultantModal');
  if (modal) modal.classList.remove('hidden');

  const apiKey = getStoredAiApiKey();
  if (!apiKey) {
    setAiStatusMessage('❌ ยังไม่ได้ตั้งค่า API Key — กรุณาติดต่อ Admin เพื่อตั้งค่า API Key ในมุมมองผู้ดูแลระบบ (Admin)', 'error');
    if (typeof showToast === 'function') showToast('⚠️ ยังไม่ได้ตั้งค่า API Key กรุณาติดต่อ Admin');
    if (typeof lucide !== 'undefined') lucide.createIcons();
    return null;
  }

  setAiStatusMessage('⏳ กำลังส่งข้อมูลเคสไปยังโมเดล AI ผ่าน API กรุณารอสักครู่...', 'loading');
  if (typeof lucide !== 'undefined') lucide.createIcons();
  return runDirectAiConsultation();
}

function closeAiConsultantModal() {
  const modal = document.getElementById('aiConsultantModal');
  if (modal) modal.classList.add('hidden');
}

function copyAiExtractedData() {
  const el = document.getElementById('aiExtractedDataBox');
  if (!el) return;
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(el.value || '').then(() => showToast('📋 คัดลอกข้อมูลคนไข้ (De-identified) เรียบร้อย!'));
  }
}

function copyAiConsultantPrompt() {
  const el = document.getElementById('aiConsultantPromptText');
  if (!el) return;
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(el.value || '').then(() => showToast('📋 คัดลอก AI Final Prompt เรียบร้อย! (PDPA Protected)'));
  } else {
    el.select();
    document.execCommand('copy');
    showToast('📋 คัดลอก AI Final Prompt เรียบร้อย!');
  }
}

async function executeGeminiConsultWithRetry(apiKey, baseUrl, promptText, onProgress, customAttempts = null, systemInstructionOverride = null, preferredModel = null) {
  const fallbackModels = ['gemini-3.8-flash', 'gemini-3-flash-preview', 'gemini-3.1-pro-preview'];
  let attempts = customAttempts;
  if (!attempts) {
    const primary = (preferredModel || 'gemini-3.8-flash').trim();
    const fallbacks = fallbackModels.filter(m => m !== primary);
    attempts = [
      { model: primary, delay: 0, label: 'Primary Attempt' },
      { model: primary, delay: () => 1200 + Math.floor(Math.random() * 400), label: 'Fast Retry on Primary' },
      ...fallbacks.map((m, idx) => ({ model: m, delay: idx === 0 ? 500 : 0, label: `Fallback ${idx + 1}` }))
    ];
  }

  const systemText = (systemInstructionOverride || getStoredAiPromptTemplates().systemInstruction || '').trim();
  let lastError = null;

  for (let i = 0; i < attempts.length; i++) {
    const step = attempts[i];
    const currentModel = step.model;
    const attemptNum = i + 1;
    const waitMs = typeof step.delay === 'function' ? step.delay() : step.delay;
    if (waitMs > 0) await new Promise(r => setTimeout(r, waitMs));

    if (typeof onProgress === 'function') {
      onProgress({ attempt: attemptNum, total: attempts.length, model: currentModel, label: step.label });
    }

    const abortCtrl = new AbortController();
    const timeoutId = setTimeout(() => abortCtrl.abort(), 25000);

    try {
      const url = `${baseUrl}/v1beta/models/${encodeURIComponent(currentModel)}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const payload = {
        system_instruction: { parts: [{ text: systemText }] },
        contents: [{ role: 'user', parts: [{ text: promptText }] }],
        generationConfig: {
          temperature: 0.1,
          topP: 0.85,
          maxOutputTokens: 1536,
          responseMimeType: 'text/plain',
          thinkingConfig: { thinkingBudget: 1024, includeThoughts: false }
        }
      };

      let response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify(payload),
        signal: abortCtrl.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok && response.status === 400) {
        let errJson = null;
        try { errJson = await response.clone().json(); } catch (_) {}
        const msg = errJson?.error?.message || '';
        if (msg.includes('thinkingConfig') || msg.includes('thinkingBudget')) {
          const payloadNoThinking = {
            ...payload,
            generationConfig: { temperature: 0.1, topP: 0.85, maxOutputTokens: 1536, responseMimeType: 'text/plain' }
          };
          response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
            body: JSON.stringify(payloadNoThinking)
          });
        }
      }

      if (!response.ok) {
        let errDetail = '';
        try {
          const errData = await response.json();
          errDetail = errData?.error?.message || errData?.message || '';
        } catch (_) {}
        const status = response.status;
        const isClientNonRetryable = (status === 400 && !errDetail.includes('thinking')) || status === 401 || status === 403;
        if (isClientNonRetryable) {
          throw new Error(`HTTP ${status}: ${errDetail || 'API Key หรือสิทธิ์การใช้งานไม่ถูกต้อง'}`);
        }
        const isRetryable = status === 503 || status === 429 || status === 500 || status === 502 || status === 504 ||
          /high demand|overloaded|UNAVAILABLE|RESOURCE_EXHAUSTED/i.test(errDetail);
        if (!isRetryable && status !== 404) {
          throw new Error(`HTTP ${status}: ${errDetail || 'เกิดข้อผิดพลาดในการเชื่อมต่อ'}`);
        }
        lastError = new Error(`HTTP ${status}: ${errDetail || 'โมเดลไม่พร้อมให้บริการชั่วคราว'}`);
        continue;
      }

      const data = await response.json();
      const candidate = data?.candidates?.[0];
      const textParts = (candidate?.content?.parts || []).filter(p => !p.thought && p.text);
      const aiReply = textParts.map(p => p.text).join('\n') || candidate?.content?.parts?.[0]?.text || '';
      if (!aiReply && candidate?.finishReason) {
        throw new Error(`โมเดลสิ้นสุดด้วยสถานะ: ${candidate.finishReason}`);
      }
      return { reply: aiReply, modelUsed: currentModel, attemptCount: attemptNum, usageMetadata: data?.usageMetadata || null };
    } catch (err) {
      clearTimeout(timeoutId);
      const isAbort = err.name === 'AbortError' || err.message?.includes('Timeout');
      if (/HTTP 401|HTTP 403|HTTP 400/i.test(err.message)) throw err;
      lastError = isAbort ? new Error(`HTTP 504 Timeout (25s timeout on ${currentModel})`) : err;
    }
  }
  throw lastError || new Error('การเชื่อมต่อ Gemini API ล้มเหลวครบทุกรอบสำรอง');
}

async function runDirectAiConsultation() {
  const patient = (typeof patientDatabase !== 'undefined' && Array.isArray(patientDatabase))
    ? patientDatabase.find(p => p.id === activePatientId)
    : null;
  if (!patient) return;
  const reqPatientId = patient.id;

  const cfg = getActiveAiGatewayConfigForRun();
  const templates = getActiveAiPromptTemplatesForRun();
  let apiKey = getStoredAiApiKey();

  if (getAiUserRole() === 'admin' && typeof document !== 'undefined') {
    const inputKey = (document.getElementById('aiApiKeyInput')?.value || '').trim();
    if (inputKey && !inputKey.includes('••••')) apiKey = inputKey;
  }

  apiKey = (apiKey || '').trim();
  if (apiKey.startsWith('Bearer ')) apiKey = apiKey.slice(7).trim();

  const runBtn = document.getElementById('runAiAnalysisBtn');
  if (!apiKey) {
    setAiStatusMessage('❌ ยังไม่ได้ตั้งค่า API Key — กรุณาติดต่อ Admin เพื่อตั้งค่า API Key ก่อนใช้งาน 1-Click AI Consultant', 'error');
    if (typeof showToast === 'function') showToast('⚠️ ยังไม่ได้ตั้งค่า API Key กรุณาติดต่อ Admin');
    return;
  }

  const rapidText = document.getElementById('rapidTextView')?.value || '';
  const extractedData = (getAiUserRole() === 'admin' && document.getElementById('aiExtractedDataBox')?.value)
    ? document.getElementById('aiExtractedDataBox').value
    : extractPatientClinicalPayload(patient, rapidText);
  const promptText = composeAiUserPrompt(templates, extractedData);

  try {
    if (runBtn) runBtn.disabled = true;
    const isGemini = cfg.provider === 'gemini' || cfg.provider?.startsWith('gemini');
    const provLabel = isGemini ? `Gemini (${cfg.model || 'gemini-3.8-flash'})` : `${cfg.provider} (${cfg.model || 'API'})`;
    setAiStatusMessage(`⏳ กำลังส่งข้อมูลปรึกษา ${provLabel} ผ่าน API...`, 'loading');

    let aiReply = '';
    let finalModelUsed = cfg.model || 'gemini-3.8-flash';
    let finalAttemptCount = 1;

    if (isGemini) {
      const baseUrl = (cfg.endpoint && cfg.endpoint.includes('googleapis.com'))
        ? cfg.endpoint.replace(/\/+$/, '')
        : 'https://generativelanguage.googleapis.com';
      const consultResult = await executeGeminiConsultWithRetry(
        apiKey,
        baseUrl,
        promptText,
        ({ attempt, total, model, label }) => {
          if (attempt > 1) setAiStatusMessage(`⏳ กำลังลองใหม่ (${model} - ${label}) รอบที่ ${attempt}/${total}...`, 'loading');
        },
        null,
        templates.systemInstruction,
        cfg.model
      );
      aiReply = consultResult.reply;
      finalModelUsed = consultResult.modelUsed;
      finalAttemptCount = consultResult.attemptCount;
    } else {
      let endpoint = (cfg.endpoint || 'https://api.z.ai/api/coding/paas/v4/chat/completions').trim();
      if (endpoint.includes('api.z.ai/v1') || endpoint === 'https://api.z.ai') {
        endpoint = 'https://api.z.ai/api/coding/paas/v4/chat/completions';
      } else if (endpoint.includes('open.bigmodel.cn/v1') || endpoint === 'https://open.bigmodel.cn') {
        endpoint = 'https://open.bigmodel.cn/api/coding/paas/v4/chat/completions';
      }
      if (!endpoint.endsWith('/chat/completions')) endpoint = endpoint.replace(/\/+$/, '') + '/chat/completions';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: (cfg.model || 'glm-4-plus').trim(),
          messages: [
            { role: 'system', content: templates.systemInstruction },
            { role: 'user', content: promptText }
          ],
          temperature: 0.2
        })
      });
      if (!response.ok) {
        let errDetail = '';
        try {
          const errData = await response.json();
          errDetail = errData?.error?.message || errData?.message || '';
        } catch (_) {
          try { errDetail = (await response.text()).slice(0, 150); } catch (_) {}
        }
        throw new Error(`HTTP ${response.status}: ${errDetail || 'ตรวจสอบ API Key หรือ Endpoint'}`);
      }
      const data = await response.json();
      aiReply = data?.choices?.[0]?.message?.content || '';
    }

    if (!aiReply) throw new Error('ไม่ได้รับข้อความตอบกลับจากโมเดล AI');

    const parsedForTarget = parseAiConsultantResponse(aiReply);
    patient.aiConsultResult = {
      rawText: aiReply,
      dxText: parsedForTarget.dxText,
      ordersText: parsedForTarget.ordersText,
      model: finalModelUsed,
      attemptCount: finalAttemptCount,
      timestamp: new Date().toISOString()
    };
    try {
      if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('er_ai_consult_' + patient.id, JSON.stringify(patient.aiConsultResult));
    } catch (_) {}

    if (typeof activePatientId === 'undefined' || activePatientId === reqPatientId) {
      renderAiConsultantOutput(aiReply);
      const retryNote = finalAttemptCount > 1 ? ` (สลับใช้โมเดลสำรองรอบที่ ${finalAttemptCount})` : '';
      setAiStatusMessage(`✓ ได้รับผลการวิเคราะห์จาก AI (${finalModelUsed}${retryNote}) สำเร็จแล้ว`, 'success');
    }
    if (typeof showToast === 'function') showToast('🤖 ได้รับคำแนะนำจาก AI เรียบร้อยแล้ว!');
  } catch (err) {
    console.warn('AI API Call error:', err);
    const isNetworkErr = err.message?.includes('Failed to fetch') || err.name === 'TypeError';
    const reason = isNetworkErr ? 'ไม่สามารถเชื่อมต่อไปยัง Endpoint ได้ (ตรวจ Endpoint URL หรือเครือข่าย)' : err.message;
    setAiStatusMessage(`❌ เชื่อมต่อ AI API ไม่สำเร็จ (${reason}) — โปรดลองใหม่หรือติดต่อ Admin ตรวจสอบการตั้งค่า`, 'error');
    if (typeof showToast === 'function') showToast(`⚠️ เชื่อมต่อ AI ไม่สำเร็จ: ${err.message}`);
  } finally {
    if (runBtn) runBtn.disabled = false;
  }
}

function applyAiResultToDoctorAddendum(mode = 'both') {
  const patient = (typeof patientDatabase !== 'undefined' && Array.isArray(patientDatabase))
    ? patientDatabase.find(p => p.id === activePatientId)
    : null;
  if (!patient) return typeof showToast === 'function' ? showToast('⚠️ กรุณาเลือกผู้ป่วยก่อน') : null;

  const newDx = normalizeDxOutputHeader(document.getElementById('aiResultDxBox')?.value || currentAiParsedDx || '');
  const newPlan = (document.getElementById('aiResultOrdersBox')?.value || currentAiParsedOrders || '').trim();
  if (!newDx && !newPlan) return typeof showToast === 'function' ? showToast('⚠️ ยังไม่มีผลวิเคราะห์จาก AI สำหรับนำเข้า') : null;

  const existingDx = document.getElementById('doctorPrelimDx')?.value.trim() || '';
  const existingPlan = document.getElementById('doctorPlan')?.value.trim() || '';
  const hasConflict = (mode === 'both' && (existingDx || existingPlan))
    || (mode === 'dx' && existingDx)
    || (mode === 'plan' && existingPlan);

  if (hasConflict) {
    pendingAiApplyMode = mode;
    openAiApplyConfirmModal();
    return;
  }
  executeAiApplyToFields(mode, 'replace');
}

function openAiApplyConfirmModal() {
  const modal = document.getElementById('aiApplyConfirmModal');
  if (modal) modal.classList.remove('hidden');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeAiApplyConfirmModal() {
  const modal = document.getElementById('aiApplyConfirmModal');
  if (modal) modal.classList.add('hidden');
  pendingAiApplyMode = null;
}

function confirmApplyAiResult(action) {
  executeAiApplyToFields(pendingAiApplyMode || 'both', action);
}

function executeAiApplyToFields(mode, action) {
  const newDx = normalizeDxOutputHeader(document.getElementById('aiResultDxBox')?.value || currentAiParsedDx || '');
  const newPlan = (document.getElementById('aiResultOrdersBox')?.value || currentAiParsedOrders || '').trim();
  const dxEl = document.getElementById('doctorPrelimDx');
  const planEl = document.getElementById('doctorPlan');

  if ((mode === 'both' || mode === 'dx') && dxEl && newDx) {
    dxEl.value = (action === 'append' && dxEl.value.trim()) ? `${dxEl.value.trim()}\n\n${newDx}` : newDx;
  }
  if ((mode === 'both' || mode === 'plan') && planEl && newPlan) {
    const planBlock = /^\[Treatment Plan/i.test(newPlan) ? newPlan : `[Treatment Plan & ER Orders]\n${newPlan}`;
    planEl.value = (action === 'append' && planEl.value.trim()) ? `${planEl.value.trim()}\n\n${planBlock}` : newPlan;
  }

  if (typeof toggleDoctorAddendumSection === 'function') toggleDoctorAddendumSection(true);
  if (typeof handleDoctorAddendumChange === 'function') handleDoctorAddendumChange();
  closeAiApplyConfirmModal();
  closeAiConsultantModal();
  if (typeof showToast === 'function') {
    showToast(action === 'append'
      ? '📥 นำข้อมูล AI ไปเขียนต่อท้ายในช่องตรวจของแพทย์เรียบร้อยแล้ว'
      : '✓ นำผลวิเคราะห์ AI เข้าช่องตรวจของแพทย์เรียบร้อยแล้ว');
  }
}

function copyAiResultSection(section) {
  const el = section === 'dx' ? document.getElementById('aiResultDxBox') : document.getElementById('aiResultOrdersBox');
  if (!el) return;
  const raw = (el.value || '').trim();
  const text = section === 'dx' ? (normalizeDxOutputHeader(raw) || raw) : raw;
  if (!text) return typeof showToast === 'function' ? showToast('⚠️ ยังไม่มีข้อความสำหรับคัดลอก') : null;
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(() => showToast(`📋 คัดลอกข้อมูล ${section === 'dx' ? 'การวินิจฉัย (Dx)' : 'คำสั่งการรักษา (Orders)'} เรียบร้อย!`));
  } else {
    el.select();
    document.execCommand('copy');
    showToast('📋 คัดลอกเรียบร้อย!');
  }
}
