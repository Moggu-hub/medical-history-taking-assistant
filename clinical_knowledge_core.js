/**
 * ============================================================================
 * CLINICAL KNOWLEDGE BASE & MEDICAL ALGORITHM REGISTRY (clinical_knowledge.js)
 * ============================================================================
 * Project: ระบบผู้ช่วยซักประวัติอัจฉริยะสำหรับห้องฉุกเฉิน (Smart Triage & Clinical Intake Assistant)
 * Target Facility: ห้องฉุกเฉิน โรงพยาบาลราชบุรี (Ratchaburi Hospital Emergency Room)
 *
 * PURPOSE FOR HOSPITAL IT & DEVELOPERS:
 * ไฟล์นี้แยกองค์ความรู้ทางการแพทย์ (Medical Knowledge Base), รายการอาการสำคัญ 23 อาการ,
 * โครงสร้างคำถามภาษาชาวบ้าน (Patient-friendly Thai), คำศัพท์แพทย์ (Medical Thai/English),
 * เงื่อนไขการแตกกิ่ง (Progressive Disclosure Rules), เกณฑ์สัญญาณอันตราย (Red Flag Algorithms),
 * ข้อมูลผู้ป่วยจำลอง 12 เคส (Seed Patients) และโครงสร้างคำสั่งปรึกษา AI (1-Click Medical AI Consultant)
 * ออกจากโค้ดส่วนแสดงผล (UI) อย่างชัดเจน เพื่อให้ทีมพัฒนา HIS ของโรงพยาบาลสามารถดึงชุดคำถามและ
 * อัลกอริทึมไปเชื่อมต่อกับฐานข้อมูลโรงพยาบาลได้ทันที
 * ============================================================================
 */

// 1. UNIVERSAL CONSTANTS (ใช้เป็นมาตรฐานเดียวกันทุกอาการนำ)
const UNIVERSAL_DURATION_UNITS = [
  { value: 'minutes', labelTh: 'นาที', labelEn: 'Minutes' },
  { value: 'hours', labelTh: 'ชั่วโมง', labelEn: 'Hours' },
  { value: 'days', labelTh: 'วัน', labelEn: 'Days' },
  { value: 'weeks', labelTh: 'สัปดาห์', labelEn: 'Weeks' },
  { value: 'months', labelTh: 'เดือน', labelEn: 'Months' },
  { value: 'years', labelTh: 'ปี', labelEn: 'Years' }
];

const PATIENT_TITLES = [
  { value: 'นาย (Mr.)', labelTh: 'นาย (Mr.)', gender: 'ชาย', genderEn: 'Male' },
  { value: 'นาง (Mrs.)', labelTh: 'นาง (Mrs.)', gender: 'หญิง', genderEn: 'Female' },
  { value: 'นางสาว (Ms.)', labelTh: 'นางสาว (Ms.)', gender: 'หญิง', genderEn: 'Female' },
  { value: 'ด.ช. (Master)', labelTh: 'ด.ช. (Master)', gender: 'ชาย', genderEn: 'Male' },
  { value: 'ด.ญ. (Miss)', labelTh: 'ด.ญ. (Miss)', gender: 'หญิง', genderEn: 'Female' }
];

// 2. 28 ER CHIEF COMPLAINTS REGISTRY
const CHIEF_COMPLAINTS = [
  { id: 'abdpain', schemaCode: 'abdominal_pain', titleTh: 'ปวดท้อง', titleEn: 'Abdominal pain', icon: 'utensils', active: true, phase: 2 },
  { id: 'chestpain', schemaCode: 'chest_pain', titleTh: 'เจ็บแน่นหน้าอก', titleEn: 'Chest pain', icon: 'heart', active: true, phase: 3 },
  { id: 'dyspnea', schemaCode: 'dyspnea', titleTh: 'เหนื่อย / หายใจหอบเหนื่อย / หายใจลำบาก', titleEn: 'Dyspnea / Shortness of breath', icon: 'wind', active: true, phase: 4 },
  { id: 'fever', schemaCode: 'fever_and_chills', titleTh: 'ไข้ / หนาวสั่น', titleEn: 'Fever / Chills', icon: 'flame', active: true, phase: 1 },
  { id: 'dizziness', schemaCode: 'dizziness_vertigo', titleTh: 'เวียนศีรษะ / บ้านหมุน', titleEn: 'Dizziness / Vertigo', icon: 'compass', active: true, phase: 5 },
  { id: 'headache', schemaCode: 'headache', titleTh: 'ปวดศีรษะ', titleEn: 'Headache', icon: 'frown', active: true, phase: 6 },
  { id: 'traffic_accident', schemaCode: 'traffic_accident', titleTh: 'ได้รับบาดเจ็บจากอุบัติเหตุจราจร', titleEn: 'Traffic accident injury', icon: 'car', active: false, phase: 6 },
  { id: 'fall_trauma', schemaCode: 'fall_trauma', titleTh: 'พลัดตกหกล้ม / ได้รับบาดเจ็บทางกายภาพ', titleEn: 'Falls / Blunt trauma', icon: 'user-x', active: false, phase: 6 },
  { id: 'laceration_bleeding', schemaCode: 'laceration_bleeding', titleTh: 'บาดแผลฉีกขาด / มีเลือดออก', titleEn: 'Laceration / Active bleeding', icon: 'bandage', active: false, phase: 6 },
  { id: 'stroke_deficit', schemaCode: 'stroke_deficit', titleTh: 'ปากเบี้ยว อ่อนแรง ชา ข้างใดข้างหนึ่ง พูดไม่ชัด', titleEn: 'Focal neurological deficit / Hemiparesis / Dysarthria', icon: 'brain', active: true, phase: 5 },
  { id: 'seizure', schemaCode: 'seizure', titleTh: 'ชัก / เกร็งกระตุก', titleEn: 'Seizure / Convulsion', icon: 'zap', active: true, phase: 5 },
  { id: 'pediatric_seizure', schemaCode: 'pediatric_seizure', titleTh: 'ชักเกร็งในเด็กอายุ < 6 ปี', titleEn: 'Pediatric seizure / Febrile seizure (< 6 years)', icon: 'baby', active: false, phase: 6 },
  { id: 'syncope', schemaCode: 'syncope', titleTh: 'หมดสติ / วูบ / เป็นลม', titleEn: 'Syncope / Loss of consciousness', icon: 'sparkles', active: true, phase: 5 },
  { id: 'altered_mental', schemaCode: 'altered_mental_status', titleTh: 'ซึมลง / สับสนเฉียบพลัน / ระดับความรู้สึกตัวเปลี่ยนแปลง', titleEn: 'Altered mental status / Confusion', icon: 'help-circle', active: true, phase: 5 },
  { id: 'vomiting', schemaCode: 'severe_nausea_vomiting', titleTh: 'คลื่นไส้ / อาเจียนรุนแรง', titleEn: 'Nausea & Severe Vomiting', icon: 'frown', active: true, phase: 6 },
  { id: 'diarrhea', schemaCode: 'diarrhea', titleTh: 'ถ่ายเหลว / ถ่ายเป็นน้ำ', titleEn: 'Diarrhea', icon: 'droplets', active: true, phase: 7 },
  { id: 'gi_bleed', schemaCode: 'gi_bleeding', titleTh: 'อาเจียนเป็นเลือด / ถ่ายดำ / ถ่ายเป็นเลือดสด', titleEn: 'Hematemesis / Melena / Hematochezia', icon: 'alert-triangle', active: true, phase: 7 },
  { id: 'palpitation', schemaCode: 'palpitations', titleTh: 'ใจสั่น', titleEn: 'Palpitations', icon: 'activity', active: true, phase: 8 },
  { id: 'weakness', schemaCode: 'generalized_weakness', titleTh: 'อ่อนเพลีย / กินไม่ได้ / ไม่มีแรง', titleEn: 'Generalized weakness / Poor intake', icon: 'battery-low', active: true, phase: 8 },
  { id: 'allergy', schemaCode: 'acute_allergy', titleTh: 'ผื่นแพ้เฉียบพลัน / แน่นคอ ตาบวม ปากบวม', titleEn: 'Acute allergic reaction / Angioedema', icon: 'shield-alert', active: true, phase: 8 },
  { id: 'urinary_retention', schemaCode: 'urinary_retention', titleTh: 'ปัสสาวะไม่ออก / เล็ดราด / กะปริดกะปรอย', titleEn: 'Urinary retention / Overflow dribbling / Inability to void', icon: 'droplet', active: true, phase: 9 },
  { id: 'dysuria', schemaCode: 'dysuria', titleTh: 'ปัสสาวะแสบขัด', titleEn: 'Dysuria / Painful urination', icon: 'flame', active: true, phase: 9 },
  { id: 'hematuria', schemaCode: 'hematuria', titleTh: 'ปัสสาวะเป็นเลือด', titleEn: 'Hematuria / Blood in urine', icon: 'droplets', active: true, phase: 9 },
  { id: 'back_pain', schemaCode: 'back_pain', titleTh: 'ปวดหลัง', titleEn: 'Back pain / Lumbago', icon: 'activity', active: true, phase: 9 },
  { id: 'neck_shoulder_pain', schemaCode: 'neck_shoulder_pain', titleTh: 'ปวดต้นคอ / บ่า / หลังช่วงบน', titleEn: 'Neck / Shoulder / Upper back pain', icon: 'activity', active: true, phase: 9 },
  { id: 'hemoptysis', schemaCode: 'hemoptysis', titleTh: 'ไอเป็นเลือด', titleEn: 'Hemoptysis / Coughing up blood', icon: 'droplet', active: false, phase: 10 },
  { id: 'epistaxis', schemaCode: 'epistaxis', titleTh: 'เลือดกำเดาไหล', titleEn: 'Epistaxis / Nosebleed', icon: 'droplets', active: false, phase: 10 },
  { id: 'physical_assault', schemaCode: 'physical_assault', titleTh: 'ถูกทำร้ายร่างกาย', titleEn: 'Physical assault / Violence injury', icon: 'shield-alert', active: false, phase: 10 },
  { id: 'self_harm', schemaCode: 'self_harm', titleTh: 'ทำร้ายตนเอง / พยายามฆ่าตัวตาย', titleEn: 'Self-harm / Suicidal attempt', icon: 'heart-crack', active: false, phase: 10 },
  { id: 'psychiatric_emergency', schemaCode: 'psychiatric_emergency', titleTh: 'เอะอะโวยวาย / จิตเวช', titleEn: 'Acute agitation / Psychiatric emergency', icon: 'alert-octagon', active: false, phase: 10 },
  { id: 'hypertension', schemaCode: 'hypertension_detected', titleTh: 'ตรวจพบความดันโลหิตสูง', titleEn: 'Asymptomatic severe hypertension / High BP screen', icon: 'activity', active: false, phase: 9 },
  { id: 'animal_bite', schemaCode: 'mammalian_bite', titleTh: 'สุนัข แมว สัตว์เลี้ยงลูกด้วยนมกัด', titleEn: 'Animal / Dog / Cat bites (Rabies risk)', icon: 'paw-print', active: false, phase: 10 },
  { id: 'venomous_bite', schemaCode: 'venomous_bite_sting', titleTh: 'แมลง / งู / สัตว์มีพิษกัดต่อย', titleEn: 'Insect sting / Snake & Venomous creature bites', icon: 'bug', active: false, phase: 10 },
  { id: 'poisoning', schemaCode: 'poisoning_overdose', titleTh: 'ได้รับสารพิษ / กินยาเกินขนาด', titleEn: 'Poisoning / Drug overdose', icon: 'skull', active: false, phase: 10 }
];

// 3. STRUCTURED CLINICAL ALGORITHM SPECIFICATION (สำหรับทีมพัฒนา HIS ดึงชุดคำถามและเงื่อนไข)
const CLINICAL_KNOWLEDGE_BASE = {
  version: '2.0.0-ER-Ratchaburi',
  designPrinciples: {
    noDefaultBias: 'ห้ามตั้งค่าเริ่มต้น (Default Selection) บน Radio, Checkbox หรือ Pain Score Slider เพื่อป้องกันข้อมูลเท็จทางการแพทย์',
    hiddenRedFlags: 'ห้ามแสดงป้ายคำว่า Red Flag หรือสีแดงข่มขู่ในหน้าจอคนไข้ ให้ฝังตัวเลือกไว้ในหมวดอาการร่วมตามธรรมชาติ',
    dualTranslation: 'แปลงภาษาชาวบ้านฝั่งคนไข้ เป็นศัพท์แพทย์ภาษาไทย (Clinical Note) และ JSON ภาษาอังกฤษ (API Schema) อัตโนมัติ',
    progressiveDisclosure: 'ซ่อนคำถามเจาะลึกไว้ก่อน และแสดงเฉพาะเมื่อผู้ป่วยเลือกอาการตั้งต้นที่เกี่ยวข้อง'
  },
  algorithms: {
  }
};

// 4. 1-CLICK MEDICAL AI CONSULTANT CONFIGURATION (PDPA-COMPLIANT & GEMINI/OPENAI READY)
var AI_CONSULTANT_CONFIG = {
  defaultProvider: 'gemini',
  defaultModel: 'gemini-3.8-flash',
  defaultEndpoint: 'https://generativelanguage.googleapis.com',
  systemInstruction: `ROLE: Evidence-Based Clinical Decision Support System assisting junior physicians with initial DDx, Red Flag detection, and initial ER management.
STRICT ANTI-HALLUCINATION & CLOSED-WORLD RULES:
1. ZERO ASSUMPTION: วิเคราะห์จาก CC, History, V/S และ PE ที่ให้มาเท่านั้น ห้ามสมมุติ แต่งเติม หรือสรุปอาการ/ผลตรวจที่ไม่ได้ระบุ
2. MISSING DATA HANDLING: หากขาดข้อมูลสำคัญยิ่งยวดต่อการ Rule out ภาวะวิกฤต ให้ระบุว่า "ต้องตรวจ/ถามทันที" ห้ามเดาเอง
3. EVIDENCE ANCHORING: ทุกข้อวินิจฉัย (DDx) ต้องอิงหลักฐาน Pertinent Positives/Negatives ที่ปรากฏจริงในเคส
4. SAFE MANAGEMENT & DOSING: ระบุแนวทาง Investigation, Resuscitation และยามาตรฐาน หากไม่ทราบน้ำหนัก/ไต ห้ามระบุโดสเจาะจง ให้ระบุชื่อกลุ่มยามาตรฐานและให้ re-check CPG
TOKEN EFFICIENCY: ไม่มีคำทักทาย เกริ่นนำ หรือข้อความปิดท้าย เริ่มต้นที่โครงสร้างทันที ใช้คำย่อการแพทย์มาตรฐาน (V/S, CBC, CXR, EKG, POCUS, IV, PO, stat, R/O)

REQUIRED OUTPUT FORMAT (ตอบเป็นภาษาไทยผสมศัพท์แพทย์สากลตามโครงสร้างนี้เท่านั้น):

[PROVISIONAL_DDX]
• <การวินิจฉัยลำดับที่ 1>: <เหตุผลสั้นๆ ไม่เกิน 1 บรรทัด>
• <การวินิจฉัยลำดับที่ 2>: <เหตุผลสั้นๆ ไม่เกิน 1 บรรทัด>
• <การวินิจฉัยลำดับที่ 3>: <เหตุผลสั้นๆ ไม่เกิน 1 บรรทัด>
(สามารถระบุจำนวนโรคตามความน่าจะเป็นทางคลินิกได้ตามจริง)
**ภาวะวิกฤตที่ต้องเฝ้าระวังหรือ Rule out:** (ระบุเฉพาะเมื่อมีโรคหรือภาวะวิกฤตฉุกเฉินที่ต้องเฝ้าระวังหรือ Rule out พร้อมเหตุผลสั้นๆ รวมความยาวไม่เกิน 5 บรรทัด หากไม่มีให้ไม่ต้องใส่หัวข้อนี้)

[ER_ORDERS]
2.1 การส่งตรวจเพิ่มเติมทันที (Immediate Investigations):
- [ ] <รายการตรวจทางห้องปฏิบัติการ/พิเศษ เช่น 12-lead EKG, CBC, CXR, POCUS>
- [ ] ...

2.2 แผนการรักษาเบื้องต้น & ข้อควรระวังด้านยา (Initial Management & Drug Safety):
- [ ] <การรักษา/ยาที่ต้องให้ทันที เช่น IV fluid, ยาฉีด/ยากิน>
- [ ] ⚠️ <ข้อควรระวัง/ข้อห้ามใช้ยาในเคสนี้ เช่น ห้าม NSAIDs, ยาที่ผู้ป่วยแพ้>`,

  buildConsultationPrompt: function(patient, clinicalTextSummary) {
    if (!patient) return '';
    const rfText = (patient.redFlags && patient.redFlags.length > 0)
      ? patient.redFlags.map((rf, i) => `  ${i + 1}. 🚩 ${rf.textTh} (${rf.risk})`).join('\n')
      : '  - ไม่พบสัญญาณเตือนวิกฤตเบื้องต้น';

    const vs = patient.vital_signs;
    const vsStr = vs
      ? `BP: ${vs.bp || ((vs.sbp || vs.dbp) ? `${vs.sbp || '-'}/${vs.dbp || '-'}` : '-')} mmHg, PR: ${vs.pr || '-'} bpm, RR: ${vs.rr || '-'} /min, BT: ${vs.bt || '-'} °C, SpO2: ${vs.spo2 ? vs.spo2 + '%' : '-'}, SI: ${(vs.sbp && vs.pr) ? (vs.pr / vs.sbp).toFixed(2) : '-'}`
      : 'ไม่มีข้อมูลสัญญาณชีพแรกรับ';

    // PDPA Protection: Strip patient name, HN, queue, and hospital names
    let cleanSummary = (clinicalTextSummary || '').trim();
    if (patient.name && patient.name.trim()) {
      cleanSummary = cleanSummary.split(patient.name.trim()).join('[ผู้ป่วย]');
      const parts = patient.name.trim().split(/\s+/).filter(p => p.length >= 3 && !['นาย', 'นาง', 'นางสาว', 'ด.ช.', 'ด.ญ.'].includes(p));
      for (const part of parts) {
        cleanSummary = cleanSummary.split(part).join('[ผู้ป่วย]');
      }
    }
    if (patient.hn && patient.hn.trim()) {
      cleanSummary = cleanSummary.split(patient.hn.trim()).join('[HN]');
    }
    if (patient.queue_number && patient.queue_number.trim()) {
      cleanSummary = cleanSummary.split(patient.queue_number.trim()).join('[QUEUE]');
    }
    cleanSummary = cleanSummary.replace(/(?:โรงพยาบาล[^\s,\n\]]*|Ratchaburi Hospital)/gi, '');
    cleanSummary = cleanSummary.replace(/(?:Hospital|โรงพยาบาล)\s*:\s*[^\n|]+/gi, '');
    cleanSummary = cleanSummary.replace(/(?:Name|ชื่อผู้ป่วย|ชื่อ-นามสกุล|ชื่อ-สกุล|ชื่อ)\s*:\s*[^\n|]+/gi, '');
    cleanSummary = cleanSummary.replace(/(?:HN|Hospital Number)\s*:\s*[^\n|]+/gi, '');
    cleanSummary = cleanSummary.replace(/(?:Queue|คิว|ลำดับคิว)\s*:\s*[^\n|]+/gi, '');
    cleanSummary = cleanSummary.replace(/\n{3,}/g, '\n\n').trim();

    const docNotes = patient.doctor_notes || {};
    const ageStr = (patient.age && patient.age !== 'ไม่ระบุ') ? `${patient.age} ปี` : 'ไม่ระบุอายุ';
    const udList = Array.isArray(patient.underlying) && patient.underlying.length > 0
      ? patient.underlying.join(', ')
      : (typeof patient.underlying === 'string' && patient.underlying ? patient.underlying : 'ปฏิเสธ/ไม่มี');

    return `[คำขอปรึกษาแนวทางเวชปฏิบัติฉุกเฉิน (De-identified Clinical Profile - PDPA Compliant)]

1. ข้อมูลทางคลินิกเบื้องต้น:
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
- ประวัติเพิ่มเติมจากแพทย์ (Clarified HPI): ${docNotes.additional_hpi || 'ไม่มี'}

กรุณาวิเคราะห์และตอบตามโครงสร้าง [PROVISIONAL_DDX] และ [ER_ORDERS] (ใช้ bullet point - [ ] สำหรับคำสั่งการรักษาทันที)`;
  }
};

// =========================================================================
// 5. MODULAR CHIEF COMPLAINT REGISTRY & PLUGIN LOADER (Double-Click file:/// Ready)
// =========================================================================
const CC_MODULES = {};
const SEED_PATIENTS_REGISTRY = [];

function mountCcQuestionnaireHtml(mod) {
  if (!mod || !mod.formHtml || typeof document === 'undefined') return;
  if (mod.sectionDomId && document.getElementById(mod.sectionDomId)) return;
  const container = document.getElementById('ccQuestionnairesContainer');
  if (!container) return;
  if (typeof container.insertAdjacentHTML === 'function') {
    container.insertAdjacentHTML('beforeend', mod.formHtml);
  } else {
    container.innerHTML += mod.formHtml;
  }
}

function mountAllCcQuestionnaires() {
  Object.values(CC_MODULES).forEach(mod => {
    mountCcQuestionnaireHtml(mod);
  });
}

function registerCcModule(mod) {
  if (!mod || !mod.id) return;
  CC_MODULES[mod.id] = mod;
  if (mod.recordCc) {
    CC_MODULES[mod.recordCc] = mod;
  }
  const ccEntry = CHIEF_COMPLAINTS.find(c => c.id === mod.id || (mod.recordCc && c.schemaCode === mod.recordCc));
  if (ccEntry && mod.active !== false) {
    ccEntry.active = true;
  }
  if (typeof CC_REGISTRY !== 'undefined' && !CC_REGISTRY[mod.id]) {
    CC_REGISTRY[mod.id] = {
      formId: mod.id,
      recordKey: mod.recordCc || mod.id,
      sectionId: mod.sectionDomId || `${mod.id}QuestionnaireSection`,
      titleTh: mod.titleTh || (ccEntry ? ccEntry.titleTh : mod.id),
      headerTh: mod.headerTh || `แบบฟอร์มซักประวัติ: ${mod.titleTh || (ccEntry ? ccEntry.titleTh : mod.id)}`,
      headerEn: mod.headerEn || (ccEntry ? `(${ccEntry.titleEn})` : ''),
      badgeHtml: mod.patientBadgeHtml || `<i data-lucide="${ccEntry ? ccEntry.icon : 'activity'}" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"></i><span class="whitespace-nowrap">${mod.titleTh || (ccEntry ? ccEntry.titleTh : mod.id)}</span>`
    };
  }
  if (mod.algorithm) {
    CLINICAL_KNOWLEDGE_BASE.algorithms[mod.id] = mod.algorithm;
  }
  if (Array.isArray(mod.seedPatients)) {
    mod.seedPatients.forEach(sp => {
      if (!SEED_PATIENTS_REGISTRY.some(existing => existing.id === sp.id)) {
        SEED_PATIENTS_REGISTRY.push(sp);
      }
    });
  }
  mountCcQuestionnaireHtml(mod);
}

function getCcModule(ccIdOrRecordCc) {
  return CC_MODULES[ccIdOrRecordCc] || null;
}

function getSeedPatients() {
  const sorted = [...SEED_PATIENTS_REGISTRY].sort((a, b) =>
    String(a.id || '').localeCompare(String(b.id || ''), undefined, { numeric: true })
  );
  return JSON.parse(JSON.stringify(sorted));
}

// =========================================================================
// 6. OWASP SECURITY & UNIVERSAL DATE (dd/mm/yyyy) / 24H TIME (HH:mm) ENGINE
// =========================================================================
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDateDdMmYyyy(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return '';
  const trimmed = dateStr.trim();
  const m = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return `${m[3].padStart(2, '0')}/${m[2].padStart(2, '0')}/${m[1]}`;
  const m2 = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m2) return `${m2[1].padStart(2, '0')}/${m2[2].padStart(2, '0')}/${m2[3]}`;
  return trimmed;
}

function toIsoDateValue(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return '';
  const trimmed = dateStr.trim();
  const m1 = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m1) return trimmed;
  const m2 = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m2) return `${m2[3]}-${m2[2].padStart(2, '0')}-${m2[1].padStart(2, '0')}`;
  return trimmed;
}

function formatTime24h(val) {
  if (!val) return '';
  if (val instanceof Date && !isNaN(val.getTime())) {
    return `${String(val.getHours()).padStart(2, '0')}:${String(val.getMinutes()).padStart(2, '0')}`;
  }
  const str = String(val).trim();
  const hmMatch = str.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM|am|pm))?$/);
  if (hmMatch) {
    let h = parseInt(hmMatch[1], 10);
    const m = parseInt(hmMatch[2], 10);
    const ampm = hmMatch[3] ? hmMatch[3].toUpperCase() : null;
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    if (h >= 0 && h <= 23 && m >= 0 && m <= 59) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }
  if (str.includes('T') || str.includes('-')) {
    const d = new Date(str);
    if (!isNaN(d.getTime())) return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
  return str.replace(/\s*(AM|PM|am|pm)\b/g, '').trim();
}

let activeUniversalPickerCleanup = null;

function closeActiveUniversalPicker() {
  if (typeof activeUniversalPickerCleanup === 'function') {
    activeUniversalPickerCleanup();
    activeUniversalPickerCleanup = null;
  }
}

function initUniversalDateTimeInputs() {
  if (typeof document === 'undefined') return;
  const protoDesc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');

  document.querySelectorAll('input[data-universal-date="true"]').forEach(input => {
    if (input.dataset.universalDateBound === 'true') return;
    input.dataset.universalDateBound = 'true';

    if (protoDesc && protoDesc.get && protoDesc.set) {
      Object.defineProperty(input, 'value', {
        configurable: true,
        enumerable: true,
        get() { return protoDesc.get.call(this); },
        set(newVal) { protoDesc.set.call(this, formatDateDdMmYyyy(String(newVal || ''))); }
      });
    }
    if (input.value) input.value = formatDateDdMmYyyy(input.value);

    if (input.parentElement && !input.parentElement.classList.contains('universal-dt-wrapper')) {
      const wrap = document.createElement('div');
      wrap.className = 'universal-dt-wrapper relative flex items-center w-full';
      input.parentNode.insertBefore(wrap, input);
      wrap.appendChild(input);
      input.classList.add('pr-9');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.tabIndex = -1;
      btn.className = 'universal-dt-trigger absolute right-2.5 text-slate-400 hover:text-medical-600 focus:outline-none';
      btn.title = 'เลือกวันที่ (วว/ดด/ปปปป dd/mm/yyyy)';
      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!input.disabled) openUniversalDatePicker(input);
      });
      wrap.appendChild(btn);
    }

    input.addEventListener('input', () => {
      const raw = input.value;
      if (/^\d{4}-\d{2}-\d{2}$/.test(raw.trim())) {
        input.value = formatDateDdMmYyyy(raw.trim());
        return;
      }
      const digits = raw.replace(/\D/g, '').slice(0, 8);
      let masked = digits;
      if (digits.length > 4) masked = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
      else if (digits.length > 2) masked = `${digits.slice(0, 2)}/${digits.slice(2)}`;
      if (masked !== raw) protoDesc.set.call(input, masked);
    });
    input.addEventListener('blur', () => { if (input.value) input.value = formatDateDdMmYyyy(input.value); });
    input.addEventListener('click', (e) => { e.stopPropagation(); if (!input.disabled) openUniversalDatePicker(input); });
  });

  document.querySelectorAll('input[data-universal-time="true"]').forEach(input => {
    if (input.dataset.universalTimeBound === 'true') return;
    input.dataset.universalTimeBound = 'true';

    if (protoDesc && protoDesc.get && protoDesc.set) {
      Object.defineProperty(input, 'value', {
        configurable: true,
        enumerable: true,
        get() { return protoDesc.get.call(this); },
        set(newVal) { protoDesc.set.call(this, formatTime24h(String(newVal || ''))); }
      });
    }
    if (input.value) input.value = formatTime24h(input.value);

    if (input.parentElement && !input.parentElement.classList.contains('universal-dt-wrapper')) {
      const wrap = document.createElement('div');
      wrap.className = 'universal-dt-wrapper relative flex items-center w-full';
      input.parentNode.insertBefore(wrap, input);
      wrap.appendChild(input);
      input.classList.add('pr-9');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.tabIndex = -1;
      btn.className = 'universal-dt-trigger absolute right-2.5 text-slate-400 hover:text-medical-600 focus:outline-none';
      btn.title = 'เลือกเวลา 24 ชั่วโมง (00:00 - 23:59)';
      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!input.disabled) openUniversalTimePicker(input);
      });
      wrap.appendChild(btn);
    }

    input.addEventListener('input', () => {
      const raw = input.value;
      const digits = raw.replace(/\D/g, '').slice(0, 4);
      let masked = digits;
      if (digits.length >= 3) {
        let hh = parseInt(digits.slice(0, 2), 10);
        if (hh > 23) hh = 23;
        let mm = digits.slice(2);
        if (mm.length === 2 && parseInt(mm, 10) > 59) mm = '59';
        masked = `${String(hh).padStart(2, '0')}:${mm}`;
      }
      if (masked !== raw) protoDesc.set.call(input, masked);
    });
    input.addEventListener('blur', () => { if (input.value) input.value = formatTime24h(input.value); });
    input.addEventListener('click', (e) => { e.stopPropagation(); if (!input.disabled) openUniversalTimePicker(input); });
  });
}

function openUniversalDatePicker(input) {
  closeActiveUniversalPicker();
  const now = new Date();
  let selDay = now.getDate();
  let selMonth = now.getMonth() + 1;
  let selYear = now.getFullYear();

  const currentVal = formatDateDdMmYyyy(input.value || '');
  const m = currentVal.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) {
    selDay = parseInt(m[1], 10);
    selMonth = parseInt(m[2], 10);
    selYear = parseInt(m[3], 10);
  }
  let viewMonth = selMonth;
  let viewYear = selYear;

  const popover = document.createElement('div');
  popover.className = 'universal-date-popover fixed z-50 bg-white border border-slate-300 rounded-xl shadow-xl p-3 w-72 text-xs select-none';
  const positionPopover = () => {
    const rect = input.getBoundingClientRect();
    popover.style.top = `${Math.min(window.innerHeight - 310, Math.max(8, rect.bottom + 6))}px`;
    popover.style.left = `${Math.min(window.innerWidth - 296, Math.max(8, rect.left))}px`;
  };
  const monthNamesTh = ['ม.ค. (01)', 'ก.พ. (02)', 'มี.ค. (03)', 'เม.ย. (04)', 'พ.ค. (05)', 'มิ.ย. (06)', 'ก.ค. (07)', 'ส.ค. (08)', 'ก.ย. (09)', 'ต.ค. (10)', 'พ.ย. (11)', 'ธ.ค. (12)'];

  const renderCalendar = () => {
    const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
    const firstDow = new Date(viewYear, viewMonth - 1, 1).getDay();
    let dayCells = '';
    for (let i = 0; i < firstDow; i++) dayCells += `<div class="h-7"></div>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const isSelected = d === selDay && viewMonth === selMonth && viewYear === selYear;
      dayCells += `<button type="button" data-day="${d}" class="h-7 w-7 mx-auto rounded-lg font-semibold flex items-center justify-center transition ${isSelected ? 'bg-medical-600 text-white shadow-xs' : 'text-slate-700 hover:bg-sky-100'}">${String(d).padStart(2, '0')}</button>`;
    }
    const yearOptions = [];
    for (let y = now.getFullYear() + 1; y >= now.getFullYear() - 5; y--) {
      yearOptions.push(`<option value="${y}" ${y === viewYear ? 'selected' : ''}>${y}</option>`);
    }
    popover.innerHTML = `
      <div class="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100">
        <span class="font-bold text-slate-700">เลือกวันที่ (dd/mm/yyyy)</span>
        <span class="text-[10px] font-mono bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded border border-sky-200">${String(selDay).padStart(2, '0')}/${String(viewMonth).padStart(2, '0')}/${viewYear}</span>
      </div>
      <div class="flex items-center justify-between gap-1 mb-2">
        <button type="button" data-nav="prev" class="px-2 py-1 rounded border border-slate-200 hover:bg-slate-100 font-bold">&lt;</button>
        <select data-role="month" class="border border-slate-200 rounded px-1.5 py-1 text-xs font-semibold text-slate-700 bg-white">
          ${monthNamesTh.map((name, idx) => `<option value="${idx + 1}" ${idx + 1 === viewMonth ? 'selected' : ''}>${name}</option>`).join('')}
        </select>
        <select data-role="year" class="border border-slate-200 rounded px-1.5 py-1 text-xs font-semibold text-slate-700 bg-white">${yearOptions.join('')}</select>
        <button type="button" data-nav="next" class="px-2 py-1 rounded border border-slate-200 hover:bg-slate-100 font-bold">&gt;</button>
      </div>
      <div class="grid grid-cols-7 gap-0.5 text-center text-[10px] font-bold text-slate-400 mb-1"><div>อา</div><div>จ</div><div>อ</div><div>พ</div><div>พฤ</div><div>ศ</div><div>ส</div></div>
      <div class="grid grid-cols-7 gap-0.5 text-center">${dayCells}</div>
      <div class="mt-2 pt-2 border-t border-slate-100 flex justify-between items-center">
        <button type="button" data-action="today" class="text-[11px] font-semibold text-medical-600 hover:underline">วันนี้ (${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()})</button>
        <button type="button" data-action="clear" class="text-[11px] text-rose-600 hover:underline">ล้างค่า</button>
      </div>`;

    popover.querySelector('[data-nav="prev"]')?.addEventListener('click', (e) => { e.stopPropagation(); viewMonth--; if (viewMonth < 1) { viewMonth = 12; viewYear--; } renderCalendar(); });
    popover.querySelector('[data-nav="next"]')?.addEventListener('click', (e) => { e.stopPropagation(); viewMonth++; if (viewMonth > 12) { viewMonth = 1; viewYear++; } renderCalendar(); });
    popover.querySelector('[data-role="month"]')?.addEventListener('change', (e) => { viewMonth = parseInt(e.target.value, 10); renderCalendar(); });
    popover.querySelector('[data-role="year"]')?.addEventListener('change', (e) => { viewYear = parseInt(e.target.value, 10); renderCalendar(); });
    popover.querySelectorAll('[data-day]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const d = parseInt(btn.getAttribute('data-day'), 10);
        input.value = `${String(d).padStart(2, '0')}/${String(viewMonth).padStart(2, '0')}/${viewYear}`;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        closeActiveUniversalPicker();
      });
    });
    popover.querySelector('[data-action="today"]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      input.value = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      closeActiveUniversalPicker();
    });
    popover.querySelector('[data-action="clear"]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      input.value = '';
      input.dispatchEvent(new Event('change', { bubbles: true }));
      closeActiveUniversalPicker();
    });
  };

  renderCalendar();
  document.body.appendChild(popover);
  positionPopover();
  const onOutsideClick = (e) => { if (!popover.contains(e.target) && e.target !== input) closeActiveUniversalPicker(); };
  setTimeout(() => document.addEventListener('click', onOutsideClick), 0);
  activeUniversalPickerCleanup = () => {
    document.removeEventListener('click', onOutsideClick);
    if (popover.parentNode) popover.parentNode.removeChild(popover);
  };
}

function openUniversalTimePicker(input) {
  closeActiveUniversalPicker();
  let selHour = 12;
  let selMin = 0;
  const currentVal = formatTime24h(input.value || '');
  const m = currentVal.match(/^(\d{2}):(\d{2})$/);
  if (m) {
    selHour = parseInt(m[1], 10);
    selMin = parseInt(m[2], 10);
  } else {
    const now = new Date();
    selHour = now.getHours();
    selMin = Math.floor(now.getMinutes() / 5) * 5;
  }

  const popover = document.createElement('div');
  popover.className = 'universal-time-popover fixed z-50 bg-white border border-slate-300 rounded-xl shadow-xl p-3 w-64 text-xs select-none';
  const rect = input.getBoundingClientRect();
  popover.style.top = `${Math.min(window.innerHeight - 240, Math.max(8, rect.bottom + 6))}px`;
  popover.style.left = `${Math.min(window.innerWidth - 264, Math.max(8, rect.left))}px`;

  const hourOpts = [];
  for (let h = 0; h <= 23; h++) {
    const hs = String(h).padStart(2, '0');
    hourOpts.push(`<option value="${hs}" ${h === selHour ? 'selected' : ''}>${hs} น.</option>`);
  }
  const minOpts = [];
  for (let mn = 0; mn <= 59; mn++) {
    const ms = String(mn).padStart(2, '0');
    minOpts.push(`<option value="${ms}" ${mn === selMin ? 'selected' : ''}>${ms} นาที</option>`);
  }

  popover.innerHTML = `
    <div class="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100"><span class="font-bold text-slate-700">ระบบเวลา 24 ชั่วโมง (00:00–23:59)</span></div>
    <div class="grid grid-cols-2 gap-2 mb-2.5">
      <div><label class="block text-[10px] font-semibold text-slate-500 mb-1">ชั่วโมง (00–23)</label><select data-role="hour24" class="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-800 bg-white">${hourOpts.join('')}</select></div>
      <div><label class="block text-[10px] font-semibold text-slate-500 mb-1">นาที (00–59)</label><select data-role="min24" class="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-800 bg-white">${minOpts.join('')}</select></div>
    </div>
    <div class="flex items-center justify-between pt-2 border-t border-slate-100">
      <button type="button" data-action="now24" class="text-[11px] font-semibold text-medical-600 hover:underline">เวลานี้ (24 ชม.)</button>
      <div class="flex items-center gap-1.5">
        <button type="button" data-action="clear24" class="text-[11px] text-rose-600 hover:underline px-1.5 py-1">ล้างค่า</button>
        <button type="button" data-action="apply24" class="bg-medical-600 hover:bg-medical-700 text-white font-bold px-3 py-1 rounded-lg">ตกลง</button>
      </div>
    </div>`;

  const applySelection = () => {
    input.value = `${popover.querySelector('[data-role="hour24"]').value}:${popover.querySelector('[data-role="min24"]').value}`;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  };
  popover.querySelector('[data-role="hour24"]')?.addEventListener('change', applySelection);
  popover.querySelector('[data-role="min24"]')?.addEventListener('change', applySelection);
  popover.querySelector('[data-action="apply24"]')?.addEventListener('click', (e) => { e.stopPropagation(); applySelection(); closeActiveUniversalPicker(); });
  popover.querySelector('[data-action="now24"]')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const now = new Date();
    input.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    closeActiveUniversalPicker();
  });
  popover.querySelector('[data-action="clear24"]')?.addEventListener('click', (e) => {
    e.stopPropagation();
    input.value = '';
    input.dispatchEvent(new Event('change', { bubbles: true }));
    closeActiveUniversalPicker();
  });

  document.body.appendChild(popover);
  const onOutsideClick = (e) => { if (!popover.contains(e.target) && e.target !== input) closeActiveUniversalPicker(); };
  setTimeout(() => document.addEventListener('click', onOutsideClick), 0);
  activeUniversalPickerCleanup = () => {
    document.removeEventListener('click', onOutsideClick);
    if (popover.parentNode) popover.parentNode.removeChild(popover);
  };
}

// =========================================================================
// 7. SEED PATIENT REALISTIC VITAL SIGNS & VITAL RED FLAGS ENGINE
// =========================================================================
function isSeedPatientRecord(p) {
  if (!p || !p.id) return false;
  const idStr = String(p.id);
  return idStr.startsWith('seed-') || (/^case-\d{1,5}$/.test(idStr));
}

function isLegacyStuckDefaultVitals(vs) {
  if (!vs || typeof vs !== 'object') return false;
  return vs.bt === 37.2 && vs.sbp === 125 && vs.dbp === 80 && vs.pr === 84 && vs.rr === 18 && vs.spo2 === 98;
}

function deriveSeedPatientVitalSigns(p) {
  const seedKey = `${p?.id || ''}|${p?.hn || ''}|${p?.name || ''}`;
  let h = 2166136261;
  for (let i = 0; i < seedKey.length; i++) {
    h ^= seedKey.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  const q = String(p?.queue_number || '');
  const isCritQueue = q.startsWith('A-') || q.startsWith('E1-');
  const isEmergQueue = q.startsWith('B-') || q.startsWith('E2-');
  const cc = p?.chief_complaint || '';

  let sbp = 114 + (h % 25);
  let dbp = 70 + ((h >>> 4) % 16);
  let pr = 74 + ((h >>> 8) % 18);
  let rr = 16 + ((h >>> 12) % 5);
  let bt = Number((36.6 + (((h >>> 16) % 7) * 0.1)).toFixed(1));
  let spo2 = 97 + ((h >>> 20) % 3);

  if (cc === 'fever_and_chills' || (p?.maxTemp && Number(p.maxTemp) >= 38)) {
    bt = p?.maxTemp ? Number(Number(p.maxTemp).toFixed(1)) : Number((38.5 + ((h % 13) * 0.1)).toFixed(1));
    pr = 98 + (h % 20);
    rr = 20 + (h % 5);
    if (isCritQueue) { sbp = 86 + (h % 6); dbp = 52 + (h % 8); pr = 122 + (h % 12); rr = 26 + (h % 4); spo2 = 93 + (h % 3); }
  } else if (cc === 'dyspnea') {
    rr = isCritQueue ? (28 + (h % 6)) : (22 + (h % 5));
    spo2 = isCritQueue ? (88 + (h % 4)) : (93 + (h % 4));
    pr = 96 + (h % 22);
    sbp = 134 + (h % 24);
    dbp = 82 + (h % 12);
  } else if (cc === 'chest_pain') {
    if (Array.isArray(p?.chestpainChars) && p.chestpainChars.includes('tearing_sharp')) {
      sbp = 188 + (h % 18); dbp = 108 + (h % 10); pr = 98 + (h % 14); rr = 22 + (h % 4);
    } else if (p?.chestpain_rf_diaphoresis || p?.chestpain_rf_syncope || isCritQueue) {
      sbp = 92 + (h % 14); dbp = 58 + (h % 10); pr = 106 + (h % 16); rr = 22 + (h % 4); spo2 = 95 + (h % 3);
    } else {
      sbp = 142 + (h % 18); dbp = 86 + (h % 10); pr = 86 + (h % 14);
    }
  } else if (cc === 'stroke_deficit') {
    sbp = 166 + (h % 26); dbp = 94 + (h % 16); pr = 80 + (h % 16); rr = 18 + (h % 4);
  } else if (cc === 'gi_bleed' || cc === 'diarrhea' || cc === 'vomiting') {
    if (isCritQueue) {
      sbp = 86 + (h % 8); dbp = 52 + (h % 8); pr = 118 + (h % 16); rr = 22 + (h % 4);
    } else if (isEmergQueue) {
      sbp = 100 + (h % 12); dbp = 64 + (h % 8); pr = 102 + (h % 14); rr = 20 + (h % 3);
    }
  } else if (cc === 'palpitation') {
    pr = isCritQueue ? (148 + (h % 24)) : (116 + (h % 22));
    sbp = isCritQueue ? (92 + (h % 12)) : (122 + (h % 18));
    dbp = 74 + (h % 12);
  } else if (cc === 'allergy') {
    if (isCritQueue) {
      sbp = 84 + (h % 8); dbp = 50 + (h % 8); pr = 124 + (h % 12); rr = 26 + (h % 4); spo2 = 91 + (h % 3);
    }
  } else if (cc === 'seizure' || cc === 'altered_mental' || cc === 'syncope') {
    if (isCritQueue) {
      sbp = 154 + (h % 26); dbp = 90 + (h % 12); pr = 104 + (h % 18); rr = 22 + (h % 4); spo2 = 94 + (h % 3);
    }
  } else if (cc === 'urinary_retention' || cc === 'dysuria' || cc === 'hematuria' || cc === 'abdominal_pain') {
    if (isCritQueue) {
      sbp = 90 + (h % 10); dbp = 56 + (h % 8); pr = 114 + (h % 14); bt = Number((38.6 + ((h % 8) * 0.1)).toFixed(1));
    } else if (isEmergQueue) {
      sbp = 138 + (h % 18); dbp = 84 + (h % 10); pr = 94 + (h % 14);
    }
  }

  return { bt, sbp, dbp, bp: `${sbp}/${dbp}`, pr, rr, spo2 };
}

function detectVitalSignsRedFlags(patient) {
  const flags = [];
  const vs = patient?.vital_signs;
  if (!vs) return flags;
  if ((vs.sbp && vs.sbp >= 180) || (vs.dbp && vs.dbp >= 110)) {
    flags.push({ key: 'vs_severe_htn', textTh: `ภาวะความดันโลหิตสูงวิกฤต (BP: ${vs.bp || vs.sbp + '/' + vs.dbp} mmHg)`, risk: 'เสี่ยงต่อ Hypertensive Urgency / Emergency และอวัยวะเป้าหมายถูกทำลาย' });
  }
  if (vs.sbp && vs.sbp < 90) {
    flags.push({ key: 'vs_hypotension', textTh: `ภาวะความดันโลหิตต่ำรุนแรง (SBP: ${vs.sbp} mmHg)`, risk: 'เสี่ยงต่อภาวะช็อก (Hypotensive Shock) และเนื้อเยื่อขาดเลือด' });
  }
  if (vs.sbp && vs.pr && (vs.pr / vs.sbp >= 0.9)) {
    const si = (vs.pr / vs.sbp).toFixed(2);
    flags.push({ key: 'vs_shock_index', textTh: `Shock Index สูงผิดปกติ (${si} >= 0.9)`, risk: 'ดัชนีเตือนภัยภาวะช็อกเฉียบพลัน (Occult / Impending Shock) ต้องประเมินสารน้ำทันที' });
  }
  if (vs.spo2 && vs.spo2 < 92) {
    flags.push({ key: 'vs_severe_hypoxemia', textTh: `ภาวะพร่องออกซิเจนรุนแรง (SpO2: ${vs.spo2}%)`, risk: 'เสี่ยงต่อภาวะหายใจล้มเหลวเฉียบพลัน (Hypoxic Respiratory Failure) ต้องให้ออกซิเจนทันที' });
  } else if (vs.spo2 && vs.spo2 < 95) {
    flags.push({ key: 'vs_mild_hypoxemia', textTh: `ระดับออกซิเจนในเลือดต่ำกว่าเกณฑ์ (SpO2: ${vs.spo2}%)`, risk: 'ควรเฝ้าระวังระบบทางเดินหายใจอย่างใกล้ชิด' });
  }
  if (vs.pr && vs.pr >= 130) {
    flags.push({ key: 'vs_tachycardia', textTh: `หัวใจเต้นเร็วรุนแรง (PR: ${vs.pr} bpm)`, risk: 'อาจเกิดจากภาวะขาดน้ำ ติดเชื้อรุนแรง เสียเลือด หรือ Arrhythmia' });
  } else if (vs.pr && vs.pr < 50) {
    flags.push({ key: 'vs_bradycardia', textTh: `หัวใจเต้นช้าผิดปกติ (PR: ${vs.pr} bpm)`, risk: 'เสี่ยงต่อภาวะ Heart Block หรือ Cardiac Output ไม่เพียงพอ' });
  }
  if (vs.rr && vs.rr >= 24) {
    flags.push({ key: 'vs_tachypnea', textTh: `อัตราการหายใจเร็วผิดปกติ (RR: ${vs.rr} /min)`, risk: 'ดัชนีเตือนภาวะ Sepsis (qSOFA), Metabolic Acidosis หรือ Respiratory Distress' });
  }
  if (vs.bt && vs.bt >= 39.0) {
    flags.push({ key: 'vs_high_fever', textTh: `ไข้สูงมาก (BT: ${vs.bt} °C)`, risk: 'เสี่ยงต่อภาวะติดเชื้อรุนแรง (Severe Sepsis) หรือชักจากไข้สูง' });
  }
  return flags;
}

// =========================================================================
// 8. TRIAGE STATION SIMULATOR, VITAL SIGNS CARD & DEXTOR EXPORT BRIDGE
// =========================================================================
let currentGeneratedTicketData = null;

function openTriageSimulatorModal() {
  const m = document.getElementById('triageStationModal');
  if (m) m.classList.remove('hidden');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeTriageSimulatorModal() {
  const m = document.getElementById('triageStationModal');
  if (m) m.classList.add('hidden');
}

function handleTriageEsiChange() {
  const esi = parseInt(document.getElementById('triageEsiSelect')?.value || '3', 10);
  const qInput = document.getElementById('triageQueueNoInput');
  if (!qInput) return;
  const pfx = { 1: 'E1', 2: 'E2', 3: 'E3', 4: 'E4', 5: 'E5' }[esi] || 'E3';
  const dbLen = (typeof patientDatabase !== 'undefined' && Array.isArray(patientDatabase)) ? patientDatabase.length : 19;
  const curr = qInput.value.trim().replace(/^(?:E[1-5]|[A-E])-?/, '') || String(dbLen + 50).padStart(3, '0');
  qInput.value = `${pfx}-${curr}`;
}

function applyTriagePreset(num) {
  const presets = {
    1: { esi: 1, name: 'นายมานพ หัวใจวาย', age: 62, gender: 'ชาย', sbp: 85, dbp: 50, pr: 128, rr: 28, bt: 36.5, spo2: 90 },
    2: { esi: 2, name: 'นางวรรณา เจ็บแน่นอก', age: 55, gender: 'หญิง', sbp: 195, dbp: 115, pr: 98, rr: 22, bt: 37.0, spo2: 96 },
    3: { esi: 3, name: 'นายสมเกียรติ มั่นคง', age: 48, gender: 'ชาย', sbp: 135, dbp: 85, pr: 104, rr: 22, bt: 38.8, spo2: 96 },
    4: { esi: 4, name: 'น.ส.วิภา เวียนหัว', age: 34, gender: 'หญิง', sbp: 118, dbp: 74, pr: 76, rr: 18, bt: 36.8, spo2: 99 }
  };
  const p = presets[num];
  if (!p) return;
  document.getElementById('triageEsiSelect').value = p.esi;
  handleTriageEsiChange();
  const map = { triageHnInput: `67${Math.floor(10000 + Math.random() * 89999)}`, triageNameInput: p.name, triageAgeInput: p.age, triageGenderSelect: p.gender, triageBtInput: p.bt, triageSbpInput: p.sbp, triageDbpInput: p.dbp, triagePrInput: p.pr, triageRrInput: p.rr, triageSpo2Input: p.spo2 };
  Object.entries(map).forEach(([id, val]) => { const el = document.getElementById(id); if (el) el.value = val; });
}

function randomizeTriageCase() {
  applyTriagePreset(Math.floor(Math.random() * 4) + 1);
}

function generateTriageTicket() {
  const getVal = id => String(document.getElementById(id)?.value ?? '').trim();
  const esi = parseInt(getVal('triageEsiSelect') || '3', 10);
  const queue = getVal('triageQueueNoInput') || 'E3-054';
  const hn = getVal('triageHnInput');
  const name = getVal('triageNameInput');
  const age = getVal('triageAgeInput');
  const gender = document.getElementById('triageGenderSelect')?.value || 'ชาย';
  const bt = getVal('triageBtInput');
  const sbp = getVal('triageSbpInput');
  const dbp = getVal('triageDbpInput');
  const pr = getVal('triagePrInput');
  const rr = getVal('triageRrInput');
  const spo2 = getVal('triageSpo2Input');

  const bp = (sbp || dbp) ? `${sbp || '-'}/${dbp || '-'}` : '';
  const vitals = (bt || sbp || dbp || pr || rr || spo2)
    ? { bt: bt ? parseFloat(bt) : null, sbp: sbp ? parseInt(sbp, 10) : null, dbp: dbp ? parseInt(dbp, 10) : null, bp, pr: pr ? parseInt(pr, 10) : null, rr: rr ? parseInt(rr, 10) : null, spo2: spo2 ? parseInt(spo2, 10) : null }
    : null;

  currentGeneratedTicketData = { queue, hn, name, age, gender, esi, vitals };

  document.getElementById('ticketQueueDisplay').textContent = queue;
  document.getElementById('ticketHnDisplay').textContent = hn || '-';
  document.getElementById('ticketNameDisplay').textContent = name || 'ผู้รับบริการ';
  document.getElementById('ticketDemogDisplay').textContent = `อายุ ${age || 'ไม่ระบุ'}${age ? ' ปี' : ''} • ${gender}`;

  const now = new Date();
  document.getElementById('ticketTimestampDisplay').textContent = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${formatTime24h(now)} น.`;

  const esiTexts = { 1: 'ESI 1: กู้ชีพทันที (Resuscitation)', 2: 'ESI 2: ฉุกเฉินวิกฤต (Emergent)', 3: 'ESI 3: ฉุกเฉินเร่งด่วน (Urgent)', 4: 'ESI 4: ฉุกเฉินไม่รุนแรง (Semi-Urgent)', 5: 'ESI 5: ไม่ฉุกเฉิน (Non-Urgent)' };
  const esiBadge = document.getElementById('ticketEsiBadge');
  if (esiBadge) {
    esiBadge.textContent = esiTexts[esi] || `ESI ${esi}`;
    esiBadge.className = `text-[11px] font-bold px-2.5 py-0.5 rounded-full ${esi === 1 ? 'bg-rose-100 text-rose-900 border border-rose-300' : esi === 2 ? 'bg-orange-100 text-orange-900 border border-orange-300' : esi === 3 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'}`;
  }

  const vsParts = [];
  if (bp) vsParts.push(`BP: ${bp}`);
  if (pr) vsParts.push(`PR: ${pr}`);
  if (rr) vsParts.push(`RR: ${rr}`);
  if (bt) vsParts.push(`BT: ${bt}°C`);
  if (spo2) vsParts.push(`SpO2: ${spo2}%`);
  document.getElementById('ticketVsDisplay').textContent = vsParts.length ? vsParts.join(' | ') : 'ไม่มีข้อมูลสัญญาณชีพแรกรับ';

  const baseLoc = typeof window !== 'undefined' ? window.location.href.split('?')[0] : 'index.html';
  const pMap = { role: 'patient', queue, hn, esi, bt, sbp, dbp, pr, rr, spo2 };
  const urlParams = new URLSearchParams();
  Object.entries(pMap).forEach(([k, v]) => { if (v !== '' && v !== null && v !== undefined) urlParams.set(k, v); });
  const targetUrl = `${baseLoc}?${urlParams.toString()}`;
  const linkEl = document.getElementById('ticketQrLink');
  if (linkEl) { linkEl.href = targetUrl; linkEl.textContent = targetUrl; }

  const qrContainer = document.getElementById('ticketQrContainer');
  if (qrContainer) {
    qrContainer.innerHTML = '';
    let rendered = false;
    if (typeof QRCode !== 'undefined') {
      try {
        new QRCode(qrContainer, { text: targetUrl, width: 176, height: 176, correctLevel: QRCode.CorrectLevel.M });
        rendered = true;
      } catch (e) { rendered = false; }
    }
    if (!rendered) {
      const img = document.createElement('img');
      img.id = 'ticketQrImage';
      img.src = `https://api.qrserver.com/v1/create-qr-code/?size=176x176&data=${encodeURIComponent(targetUrl)}`;
      img.alt = 'QR Code';
      img.className = 'w-44 h-44 rounded-xl object-contain bg-white';
      qrContainer.appendChild(img);
    }
  }

  closeTriageSimulatorModal();
  const ticketModal = document.getElementById('triageTicketModal');
  if (ticketModal) ticketModal.classList.remove('hidden');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeTriageTicketModal() {
  const m = document.getElementById('triageTicketModal');
  if (m) m.classList.add('hidden');
}

function printTriageTicket() {
  if (typeof window !== 'undefined' && typeof window.print === 'function') window.print();
  else if (typeof showToast === 'function') showToast('ระบบพร้อมส่งออกบัตรคิว 80mm');
}

function renderTriageVitalSignsCard(patient) {
  const card = document.getElementById('doctorTriageVsCard');
  const badge = document.getElementById('docVsEsiBadge');
  const timeEl = document.getElementById('docVsTimestamp');
  const grid = document.getElementById('docVsGrid');
  if (!card || !grid || !patient) return;
  const vs = patient.vital_signs;
  const esi = patient.esi_level || 3;
  const esiNames = { 1: 'ESI 1 (Resuscitation)', 2: 'ESI 2 (Emergent)', 3: 'ESI 3 (Urgent)', 4: 'ESI 4 (Semi-urgent)', 5: 'ESI 5 (Non-urgent)' };
  const esiColors = { 1: 'bg-rose-100 text-rose-800 border-rose-300', 2: 'bg-orange-100 text-orange-800 border-orange-300', 3: 'bg-amber-100 text-amber-800 border-amber-300', 4: 'bg-sky-100 text-sky-800 border-sky-300', 5: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
  if (badge) {
    badge.textContent = esiNames[esi] || `ESI ${esi}`;
    badge.className = `text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${esiColors[esi] || esiColors[3]}`;
  }
  if (timeEl) {
    const dt = patient.timestamp ? new Date(patient.timestamp) : new Date();
    timeEl.textContent = vs ? `บันทึก ณ จุดคัดกรอง ER (${formatTime24h(dt)} น.) • คิว ${patient.queue_number || '-'}` : `คิว ${patient.queue_number || '-'} (ไม่ระบุสัญญาณชีพแรกรับ)`;
  }
  const hasAnyVs = vs && (vs.bp || vs.sbp || vs.dbp || vs.pr || vs.rr || vs.bt || vs.spo2);
  if (!hasAnyVs) {
    const emptyBox = (label) => `<div class="p-2 rounded-xl border bg-slate-50 border-slate-200 text-slate-400"><span class="text-[10px] uppercase font-bold text-slate-400 block">${label}</span><span class="text-xs font-semibold">ไม่ระบุ</span></div>`;
    grid.innerHTML = ['BP (mmHg)', 'PR (bpm)', 'RR (/min)', 'BT (°C)', 'SpO2 (%)', 'Shock Index'].map(emptyBox).join('');
    return;
  }
  const bpVal = vs.bp || ((vs.sbp || vs.dbp) ? `${vs.sbp || '-'}/${vs.dbp || '-'}` : 'ไม่ระบุ');
  const isBpAlert = (vs.sbp && (vs.sbp >= 180 || vs.sbp < 90)) || (vs.dbp && vs.dbp >= 110);
  const isPrAlert = vs.pr && (vs.pr >= 120 || vs.pr < 50);
  const isRrAlert = vs.rr && (vs.rr >= 24 || vs.rr < 10);
  const isBtAlert = vs.bt && (vs.bt >= 38.5 || vs.bt < 35.5);
  const isSpo2Alert = vs.spo2 && vs.spo2 < 95;
  const siVal = (vs.sbp && vs.pr) ? (vs.pr / vs.sbp).toFixed(2) : 'ไม่ระบุ';
  const isSiAlert = vs.sbp && vs.pr && (vs.pr / vs.sbp >= 0.9);

  grid.innerHTML = `
    <div class="p-2 rounded-xl border ${isBpAlert ? 'bg-rose-50 border-rose-300 text-rose-900 ring-1 ring-rose-300' : 'bg-slate-50 border-slate-200 text-slate-800'}">
      <span class="text-[10px] uppercase font-bold text-slate-500 block">BP (mmHg)</span>
      <span class="text-sm font-bold font-mono">${escapeHtml(String(bpVal))}</span>
    </div>
    <div class="p-2 rounded-xl border ${isPrAlert ? 'bg-rose-50 border-rose-300 text-rose-900 ring-1 ring-rose-300' : 'bg-slate-50 border-slate-200 text-slate-800'}">
      <span class="text-[10px] uppercase font-bold text-slate-500 block">PR (bpm)</span>
      <span class="text-sm font-bold font-mono">${vs.pr || 'ไม่ระบุ'}</span>
    </div>
    <div class="p-2 rounded-xl border ${isRrAlert ? 'bg-amber-50 border-amber-300 text-amber-900 ring-1 ring-amber-300' : 'bg-slate-50 border-slate-200 text-slate-800'}">
      <span class="text-[10px] uppercase font-bold text-slate-500 block">RR (/min)</span>
      <span class="text-sm font-bold font-mono">${vs.rr || 'ไม่ระบุ'}</span>
    </div>
    <div class="p-2 rounded-xl border ${isBtAlert ? 'bg-amber-50 border-amber-300 text-amber-900 ring-1 ring-amber-300' : 'bg-slate-50 border-slate-200 text-slate-800'}">
      <span class="text-[10px] uppercase font-bold text-slate-500 block">BT (°C)</span>
      <span class="text-sm font-bold font-mono">${vs.bt || 'ไม่ระบุ'}</span>
    </div>
    <div class="p-2 rounded-xl border ${isSpo2Alert ? 'bg-rose-50 border-rose-300 text-rose-900 ring-1 ring-rose-300' : 'bg-slate-50 border-slate-200 text-slate-800'}">
      <span class="text-[10px] uppercase font-bold text-slate-500 block">SpO2 (%)</span>
      <span class="text-sm font-bold font-mono">${vs.spo2 ? vs.spo2 + '%' : 'ไม่ระบุ'}</span>
    </div>
    <div class="p-2 rounded-xl border ${isSiAlert ? 'bg-rose-50 border-rose-300 text-rose-900 ring-1 ring-rose-300 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-800'}">
      <span class="text-[10px] uppercase font-bold text-slate-500 block">Shock Index</span>
      <span class="text-sm font-bold font-mono">${siVal}</span>
    </div>`;
}

function openIntermediateExportModal() {
  const patient = (typeof patientDatabase !== 'undefined' && Array.isArray(patientDatabase)) ? patientDatabase.find(p => p.id === activePatientId) : null;
  if (!patient) return typeof showToast === 'function' ? showToast('กรุณาเลือกผู้ป่วยก่อนส่งออกข้อมูลเข้า Dextor') : null;
  const modal = document.getElementById('intermediateExportModal');
  const badge = document.getElementById('intermediateModalPatientBadge');
  if (badge) badge.textContent = `ผู้ป่วยคิว [${patient.queue_number}] ${patient.name} (${patient.gender || 'ไม่ระบุ'}, อายุ: ${patient.age || 'ไม่ระบุ'})`;
  const txtArea = document.getElementById('intermediateExportText');
  const jsonArea = document.getElementById('intermediateExportJson');
  if (txtArea) txtArea.value = generateIntermediateTextPayload(patient);
  if (jsonArea) jsonArea.value = JSON.stringify(generateIntermediateJsonPayload(patient), null, 2);
  switchIntermediateExportTab('text');
  if (modal) modal.classList.remove('hidden');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeIntermediateExportModal() {
  const m = document.getElementById('intermediateExportModal');
  if (m) m.classList.add('hidden');
}

function switchIntermediateExportTab(tab) {
  const btnTxt = document.getElementById('exportTabBtnText');
  const btnJson = document.getElementById('exportTabBtnJson');
  const txtArea = document.getElementById('intermediateExportText');
  const jsonArea = document.getElementById('intermediateExportJson');
  if (!btnTxt || !btnJson || !txtArea || !jsonArea) return;
  const isTxt = tab === 'text';
  txtArea.classList.toggle('hidden', !isTxt);
  jsonArea.classList.toggle('hidden', isTxt);
  btnTxt.className = `px-3.5 py-1.5 rounded-xl transition ${isTxt ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`;
  btnJson.className = `px-3.5 py-1.5 rounded-xl transition ${!isTxt ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`;
}

function copyIntermediateCurrentPayload() {
  const txtArea = document.getElementById('intermediateExportText');
  const jsonArea = document.getElementById('intermediateExportJson');
  const isJson = jsonArea && !jsonArea.classList.contains('hidden');
  const text = (isJson ? jsonArea?.value : txtArea?.value) || '';
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(() => { if (typeof showToast === 'function') showToast('คัดลอกข้อมูลสำหรับส่งเข้า Dextor เรียบร้อย!'); });
  }
}

function downloadIntermediateJson() {
  const patient = (typeof patientDatabase !== 'undefined' && Array.isArray(patientDatabase)) ? patientDatabase.find(p => p.id === activePatientId) : null;
  const text = document.getElementById('intermediateExportJson')?.value || '{}';
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dextor_${patient ? patient.queue_number : 'export'}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  if (typeof showToast === 'function') showToast('บันทึกไฟล์ JSON สำหรับ Dextor เรียบร้อย!');
}

function generateIntermediateTextPayload(patient) {
  const rapid = document.getElementById('rapidTextView')?.value || '';
  const vs = patient.vital_signs;
  const vsStr = vs ? `BP: ${vs.bp || 'ไม่ระบุ'} mmHg | PR: ${vs.pr || 'ไม่ระบุ'} bpm | RR: ${vs.rr || 'ไม่ระบุ'} /min | BT: ${vs.bt || 'ไม่ระบุ'} °C | SpO2: ${vs.spo2 ? vs.spo2 + '%' : 'ไม่ระบุ'} (ESI ${patient.esi_level || 3})` : 'ไม่ระบุสัญญาณชีพแรกรับ';
  const ageStr = (patient.age && patient.age !== 'ไม่ระบุ') ? `${patient.age} ปี` : 'ไม่ระบุอายุ';
  return `[โรงพยาบาลราชบุรี - งานการพยาบาลผู้ป่วยฉุกเฉิน (Dextor Bridge)]
คิว: ${patient.queue_number} | HN: ${patient.hn || '-'} | ชื่อ: ${patient.name} (${ageStr}, ${patient.gender || 'ไม่ระบุ'})
สัญญาณชีพแรกรับ: ${vsStr}
อาการสำคัญ: ${patient.chief_complaint_title || patient.chief_complaint}
------------------------------------------------------------
${rapid}
------------------------------------------------------------
บันทึกตรวจเพิ่มเติมของแพทย์:
- PE: ${patient.doctor_notes?.physical_exam || '-'}
- Prelim Dx: ${patient.doctor_notes?.preliminary_dx || '-'}
- Plan: ${patient.doctor_notes?.plan || '-'}`;
}

function generateIntermediateJsonPayload(patient) {
  return {
    hospital: 'โรงพยาบาลราชบุรี',
    department: 'Emergency Department',
    target_system: 'Dextor',
    export_timestamp: new Date().toISOString(),
    patient: { queue_number: patient.queue_number, hn: patient.hn, name: patient.name, age: patient.age || 'ไม่ระบุ', gender: patient.gender || 'ไม่ระบุ', esi_level: patient.esi_level || 3 },
    triage_vital_signs: patient.vital_signs || null,
    chief_complaint: { code: patient.chief_complaint, title: patient.chief_complaint_title },
    history_summary: { rapid_text: document.getElementById('rapidTextView')?.value || '', narrative_text: document.getElementById('narrativeTextView')?.value || '' },
    clinical_decision_support: { red_flags: patient.redFlags || [], shock_index: (patient.vital_signs?.sbp && patient.vital_signs?.pr) ? (patient.vital_signs.pr / patient.vital_signs.sbp).toFixed(2) : null },
    doctor_notes: patient.doctor_notes || {}
  };
}
