// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 07_stroke_deficit.js
// อาการนำ: ปากเบี้ยว อ่อนแรง ชา ข้างใดข้างหนึ่ง พูดไม่ชัด (Acute Stroke / Focal Neuro Deficit)
// Golden UI/UX 4+1 Cards + Dynamic <=4.5h Safety Screening + Zero Default Bias
// =========================================================================

// --- Shared Helpers (Word-Wrap Guard, Option Card, Grid, System Header, Seed) ---
function wrapStrokeWords(...chunks) {
  return chunks.map(c => `<span class="inline-block whitespace-nowrap">${c}</span>`).join(' ');
}

function renderStrokeCard(opts) {
  const { kind = 'radio', id = '', name = '', value = '', title, desc = '', onchange = '', compact = false, bgWhite = false } = opts;
  const attrs = [
    id ? `id="${id}"` : '',
    name ? `name="${name}"` : '',
    value !== undefined && value !== '' ? `value="${value}"` : '',
    onchange ? `onchange="${onchange}"` : ''
  ].filter(Boolean).join(' ');
  const bg = bgWhite ? 'bg-white' : '';
  const pad = compact ? 'p-2.5 rounded-lg' : 'p-3 rounded-xl';
  const sz = compact ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const titleCls = compact ? 'text-xs font-medium text-slate-800' : 'text-xs sm:text-sm font-semibold text-slate-800';
  if (desc) {
    return `<label class="selectable-card flex items-start ${pad} ${bg} border border-slate-200 hover:border-medical-300 cursor-pointer transition">
      <input type="${kind}" ${attrs} class="mt-0.5 text-medical-600 focus:ring-medical-500 ${sz} rounded flex-shrink-0">
      <div class="ml-3 leading-snug"><span class="block ${titleCls}">${title}</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">${desc}</span></div>
    </label>`;
  }
  return `<label class="selectable-card flex items-center ${pad} ${bg} border border-slate-200 hover:border-medical-300 cursor-pointer transition">
    <input type="${kind}" ${attrs} class="text-medical-600 focus:ring-medical-500 ${sz} rounded flex-shrink-0">
    <span class="ml-3 ${titleCls} leading-snug">${title}</span>
  </label>`;
}

function renderStrokeGrid(colsCls, items, defaults = {}) {
  return `<div class="grid ${colsCls} gap-2.5">${items.map(it => renderStrokeCard({ ...defaults, ...it })).join('')}</div>`;
}

function renderStrokeSysHeader({ icon, iconBg, iconColor, title, noneId, noneLabel = 'ไม่มีอาการในหมวดนี้', noneOnchange }) {
  return `<div class="flex items-center justify-between gap-2 mb-2.5">
    <div class="flex items-center space-x-2 min-w-0">
      <div class="w-6 h-6 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center flex-shrink-0"><i data-lucide="${icon}" class="w-3.5 h-3.5"></i></div>
      <span class="text-xs font-bold text-slate-800">${title}</span>
    </div>
    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:border-medical-300 cursor-pointer transition flex-shrink-0">
      <input type="checkbox" id="${noneId}" onchange="${noneOnchange}" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded flex-shrink-0">
      <span class="ml-3 text-[11px] font-medium text-slate-700 whitespace-nowrap">${noneLabel}</span>
    </label>
  </div>`;
}

function makeStrokeSeed(ov) {
  return {
    chief_complaint: 'stroke_deficit',
    chief_complaint_title: 'ปากเบี้ยว อ่อนแรง ชา ข้างใดข้างหนึ่ง พูดไม่ชัด',
    status: 'waiting', hospRecordStatus: 'complete', drugAllergy: 'ปฏิเสธ',
    strokeExactDate: '', strokeExactTime: '', strokeLsnDate: '', strokeLsnTime: '',
    strokeDiscoveryDate: '', strokeDiscoveryTime: '', strokeTransientVal: null, strokeTransientUnit: 'minutes',
    stroke_weakness_hemi: false, strokeHemiSide: 'none', stroke_weakness_arm_only: false, strokeArmSide: 'none',
    stroke_weakness_leg_only: false, strokeLegSide: 'none', stroke_weakness_both_legs: false, strokeWeaknessSeverity: '',
    stroke_numbness_hemi: false, strokeNumbnessLocs: [], strokeNumbnessSide: 'none',
    stroke_pain_neck_radiating: false, stroke_pain_back_radiating: false,
    stroke_pain_limb_cold_pale: false, stroke_pain_chest_back_tearing: false,
    stroke_face_droop: false, strokeFaceSide: 'none', strokeFaceUpperPattern: 'none',
    stroke_speech_dysarthria: false, stroke_speech_expressive_aphasia: false, stroke_speech_receptive_aphasia: false,
    stroke_has_dysphagia: false, stroke_vision_monocular: false, stroke_vision_hemianopia: false, stroke_vision_diplopia: false,
    stroke_rf_altered_mental: false, stroke_rf_severe_headache: false, stroke_rf_projectile_vomiting: false,
    stroke_rf_seizure: false, stroke_rf_ataxia_dizziness: false, stroke_rf_neck_stiffness: false,
    stroke_ci_prior_ich: false, stroke_ci_brain_lesion: false, stroke_ci_cns_surgery_trauma_3m: false,
    stroke_ci_ischemic_stroke_3m: false, stroke_ci_active_bleeding: false, stroke_ci_gi_bleed_malignancy_21d: false,
    stroke_ci_anticoagulant: false, stroke_ci_major_surgery_trauma_14d: false, stroke_ci_recent_mi_3m: false,
    stroke_ci_arterial_puncture_7d: false, stroke_ci_pregnancy: false,
    stroke_motor_none: false, stroke_sensory_pain_none: false, stroke_speech_none: false,
    stroke_bulbar_vision_none: false, stroke_rf_none: false, stroke_ci_none: false,
    doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
    ...ov
  };
}

// --- Static Clinical Dictionaries ---
const STROKE_LABELS = {
  units: { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' },
  side: { left: 'ข้างซ้าย', right: 'ข้างขวา', both: 'ทั้งสองข้าง', none: '' },
  progression: {
    sudden_maximal: 'เป็นขึ้นมาทันทีทันใด และอาการรุนแรงเต็มที่ตั้งแต่แรก (Sudden maximal)',
    gradual_worse: 'อาการค่อยๆ เป็นมากขึ้นเรื่อยๆ ตามลำดับเวลา (Progressive worsening)',
    fluctuating: 'อาการเป็นๆ หายๆ สลับดีขึ้นและแย่ลง (Fluctuating course)',
    unspecified: 'ไม่ได้ระบุการดำเนินโรค'
  },
  severity: {
    complete_plegia: 'อ่อนแรงมากจนยกไม่ขึ้นเลย หรือขยับไม่ได้เลย (Plegia)',
    moderate_drift: 'พอยกได้บ้างแต่ต้านแรงไม่ไหว หรือหยิบของหลุด (Moderate paresis)',
    mild: 'อ่อนแรงเล็กน้อย ยังพอขยับหรือเดินเองได้ (Mild weakness)',
    none: ''
  },
  numbLoc: { face: 'ใบหน้า/รอบริมฝีปาก', arm: 'แขน/มือ', leg: 'ขา/เท้า', hemi: 'ซีกใดซีกหนึ่งของร่างกาย' },
  hospStatus: {
    complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
    ratchaburi: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
    additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
    self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
    unspecified: 'ไม่ได้ระบุ'
  }
};

const STROKE_MOTOR_IDS = ['stroke_weakness_hemi', 'stroke_weakness_arm_only', 'stroke_weakness_leg_only', 'stroke_weakness_both_legs', 'stroke_face_droop'];
const STROKE_SENSORY_PAIN_IDS = ['stroke_numbness_hemi', 'stroke_pain_neck_radiating', 'stroke_pain_back_radiating', 'stroke_pain_limb_cold_pale', 'stroke_pain_chest_back_tearing'];
const STROKE_SPEECH_IDS = ['stroke_speech_dysarthria', 'stroke_speech_expressive_aphasia', 'stroke_speech_receptive_aphasia'];
const STROKE_BULBAR_VISION_IDS = ['stroke_has_dysphagia', 'stroke_vision_monocular', 'stroke_vision_hemianopia', 'stroke_vision_diplopia'];
const STROKE_RF_IDS = ['stroke_rf_altered_mental', 'stroke_rf_severe_headache', 'stroke_rf_projectile_vomiting', 'stroke_rf_seizure', 'stroke_rf_ataxia_dizziness', 'stroke_rf_neck_stiffness'];
const STROKE_CI_IDS = [
  'stroke_ci_prior_ich', 'stroke_ci_brain_lesion', 'stroke_ci_cns_surgery_trauma_3m',
  'stroke_ci_ischemic_stroke_3m', 'stroke_ci_active_bleeding', 'stroke_ci_gi_bleed_malignancy_21d',
  'stroke_ci_anticoagulant', 'stroke_ci_major_surgery_trauma_14d', 'stroke_ci_recent_mi_3m',
  'stroke_ci_arterial_puncture_7d', 'stroke_ci_pregnancy'
];

// --- Global Helpers & Dynamic Context Handlers (Contract with core_engine.js) ---
function getStrokeDurationInMinutes(val, unit) {
  const num = parseFloat(val);
  if (isNaN(num) || num <= 0) return null;
  const mult = { minutes: 1, hours: 60, days: 1440, weeks: 10080, months: 43200, years: 525600 }[unit] || 60;
  return num * mult;
}

function isStrokePatientWithin4_5Hours(p) {
  if (!p) return false;
  const mins = getStrokeDurationInMinutes(p.durationVal, p.durationUnit);
  return mins !== null && mins <= 270;
}

function isStrokeFemale(arg) {
  if (typeof arg === 'boolean') return arg;
  if (arg && typeof arg === 'object') {
    if (typeof arg.title === 'string') {
      if (/น\.ส\.|นาง|ด\.ญ\.|Mrs|Ms|Miss|Female|หญิง/i.test(arg.title)) return true;
      if (/นาย|ด\.ช\.|\(Mr\.\)|Master|ชาย/i.test(arg.title)) return false;
    }
    if (typeof arg.isFemale === 'boolean') return arg.isFemale;
  }
  const titleVal = typeof arg === 'string' ? arg : (document.getElementById('patientTitleSelect')?.value || '');
  if (/นาง|น\.ส\.|ด\.ญ\.|Mrs|Ms|Miss|Female|หญิง/i.test(titleVal)) return true;
  if (/นาย|ด\.ช\.|\(Mr\.\)|Master|ชาย/i.test(titleVal)) return false;
  const triageGender = document.getElementById('triageGenderSelect')?.value || '';
  return /หญิง|female/i.test(triageGender);
}

function syncStrokeFemaleSection(overrideIsFemale) {
  const sec = document.getElementById('strokeFemaleSection');
  if (!sec) return;
  const fem = isStrokeFemale(overrideIsFemale);
  sec.classList.toggle('hidden', !fem);
  if (!fem) {
    const preg = document.getElementById('stroke_ci_pregnancy');
    if (preg) preg.checked = false;
  }
}

function clearStrokeGroupItems(ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.checked = false;
  });
}

function uncheckStrokeNone(noneId) {
  const el = document.getElementById(noneId);
  if (el) el.checked = false;
}

function handleStrokeOnsetContextChange() {
  const onsetCtx = document.querySelector('input[name="strokeOnsetContext"]:checked')?.value || '';
  toggleBranch('stroke_exact_time_wrap', onsetCtx === 'known_exact');
  toggleBranch('stroke_lsn_time_wrap', onsetCtx === 'wake_up_or_unknown');
  toggleBranch('stroke_transient_duration_wrap', onsetCtx === 'transient_resolved');
  checkStrokeFibrinolyticTrigger();
}

function handleStrokeWeaknessChange() {
  const isHemi = Boolean(document.getElementById('stroke_weakness_hemi')?.checked);
  const isArm = Boolean(document.getElementById('stroke_weakness_arm_only')?.checked);
  const isLeg = Boolean(document.getElementById('stroke_weakness_leg_only')?.checked);
  const isBothLegs = Boolean(document.getElementById('stroke_weakness_both_legs')?.checked);
  const hasAnyLimbWeakness = isHemi || isArm || isLeg || isBothLegs;
  if (hasAnyLimbWeakness) uncheckStrokeNone('stroke_motor_none');

  toggleBranch('stroke_hemi_side_wrap', isHemi);
  toggleBranch('stroke_arm_side_wrap', isArm);
  toggleBranch('stroke_leg_side_wrap', isLeg);
  toggleBranch('stroke_weakness_severity_wrap', hasAnyLimbWeakness);

  if (!isHemi) document.querySelectorAll('input[name="strokeHemiSide"]').forEach(r => { r.checked = false; });
  if (!isArm) document.querySelectorAll('input[name="strokeArmSide"]').forEach(r => { r.checked = false; });
  if (!isLeg) document.querySelectorAll('input[name="strokeLegSide"]').forEach(r => { r.checked = false; });
  if (!hasAnyLimbWeakness) document.querySelectorAll('input[name="strokeWeaknessSeverity"]').forEach(r => { r.checked = false; });
  checkStrokeFibrinolyticTrigger();
}

function handleStrokeFaceChange() {
  const isFace = Boolean(document.getElementById('stroke_face_droop')?.checked);
  if (isFace) uncheckStrokeNone('stroke_motor_none');
  toggleBranch('stroke_face_detail_wrap', isFace);
  if (!isFace) {
    document.querySelectorAll('input[name="strokeFaceSide"]').forEach(r => { r.checked = false; });
    document.querySelectorAll('input[name="strokeFaceUpperPattern"]').forEach(r => { r.checked = false; });
  }
}

function handleStrokeMotorNoneChange(checked) {
  if (!checked) return;
  clearStrokeGroupItems(STROKE_MOTOR_IDS);
  handleStrokeWeaknessChange();
  handleStrokeFaceChange();
}

function handleStrokeNumbnessChange() {
  const isNumb = Boolean(document.getElementById('stroke_numbness_hemi')?.checked);
  if (isNumb) uncheckStrokeNone('stroke_sensory_pain_none');
  toggleBranch('stroke_numbness_side_wrap', isNumb);
  if (!isNumb) {
    document.querySelectorAll('input[name="strokeNumbnessLoc"]').forEach(cb => { cb.checked = false; });
    document.querySelectorAll('input[name="strokeNumbnessSide"]').forEach(r => { r.checked = false; });
  }
}

function handleStrokeSensoryPainItemChange(el) {
  if (el && el.checked) uncheckStrokeNone('stroke_sensory_pain_none');
  if (el && el.id === 'stroke_pain_chest_back_tearing') checkStrokeFibrinolyticTrigger();
}

function handleStrokeSensoryPainNoneChange(checked) {
  if (!checked) return;
  clearStrokeGroupItems(STROKE_SENSORY_PAIN_IDS);
  handleStrokeNumbnessChange();
  checkStrokeFibrinolyticTrigger();
}

function handleStrokeSpeechItemChange(el) { if (el && el.checked) uncheckStrokeNone('stroke_speech_none'); }
function handleStrokeSpeechNoneChange(checked) { if (checked) clearStrokeGroupItems(STROKE_SPEECH_IDS); }

function handleStrokeBulbarVisionItemChange(el) { if (el && el.checked) uncheckStrokeNone('stroke_bulbar_vision_none'); }
function handleStrokeBulbarVisionNoneChange(checked) { if (checked) clearStrokeGroupItems(STROKE_BULBAR_VISION_IDS); }

function handleStrokeRfItemChange(el) {
  if (el && el.checked) uncheckStrokeNone('stroke_rf_none');
  if (el && ['stroke_rf_severe_headache', 'stroke_rf_seizure', 'stroke_rf_neck_stiffness'].includes(el.id)) {
    checkStrokeFibrinolyticTrigger();
  }
}

function handleStrokeRfNoneChange(checked) {
  if (!checked) return;
  clearStrokeGroupItems(STROKE_RF_IDS);
  checkStrokeFibrinolyticTrigger();
}

function handleStrokeCiItemChange(el) { if (el && el.checked) uncheckStrokeNone('stroke_ci_none'); }
function handleStrokeCiNoneChange(checked) { if (checked) clearStrokeGroupItems(STROKE_CI_IDS); }

function checkStrokeFibrinolyticTrigger() {
  const durVal = document.getElementById('strokeDurationVal')?.value;
  const durUnit = document.getElementById('strokeDurationUnit')?.value || 'hours';
  const mins = getStrokeDurationInMinutes(durVal, durUnit);
  const shouldOpen = mins !== null && mins <= 270;

  const section = document.getElementById('stroke_fibrinolytic_contra_section');
  if (section) section.classList.toggle('hidden', !shouldOpen);

  const noticeEl = document.getElementById('stroke_auto_detected_ci_notice');
  if (noticeEl) {
    const autoItems = [];
    const hasSevereHa = Boolean(document.getElementById('stroke_rf_severe_headache')?.checked);
    const hasStiffNeck = Boolean(document.getElementById('stroke_rf_neck_stiffness')?.checked);
    const hasTearingPain = Boolean(document.getElementById('stroke_pain_chest_back_tearing')?.checked);
    const hasSeizure = Boolean(document.getElementById('stroke_rf_seizure')?.checked);
    const onsetCtx = document.querySelector('input[name="strokeOnsetContext"]:checked')?.value || '';
    const severity = document.querySelector('input[name="strokeWeaknessSeverity"]:checked')?.value || '';

    if (hasSevereHa || hasStiffNeck) autoItems.push('มีอาการปวดศีรษะรุนแรงเฉียบพลัน หรือคอแข็งเกร็ง');
    if (hasTearingPain) autoItems.push('มีอาการเจ็บแน่นหน้าอก ปวดท้องรุนแรง หรือปวดทะลุกลางหลังรุนแรง');
    if (hasSeizure) autoItems.push('มีอาการชักเกร็งขณะเริ่มมีอาการ');
    if (onsetCtx === 'transient_resolved') autoItems.push('อาการเป็นชั่วคราวแล้วทุเลาลงจนหายเป็นปกติ');
    else if (severity === 'mild') autoItems.push('อาการอ่อนแรงเป็นเพียงเล็กน้อย');

    if (shouldOpen && autoItems.length > 0) {
      noticeEl.classList.remove('hidden');
      noticeEl.innerHTML = `<strong>ข้อมูลจากคำถามก่อนหน้าที่ระบบบันทึกไว้ให้แพทย์ตรวจสอบแล้ว:</strong> ${autoItems.map(item => escapeHtml(item)).join(' • ')}`;
    } else {
      noticeEl.classList.add('hidden');
      noticeEl.innerHTML = '';
    }
  }
  if (typeof updateSectionNumbering === 'function') updateSectionNumbering();
}

function evaluateStrokeFibrinolysisContraindications(patient) {
  const fmtD = d => (typeof formatDateDdMmYyyy === 'function' ? formatDateDdMmYyyy(d) : (d || ''));
  const durStr = patient.durationVal ? `${patient.durationVal} ${STROKE_LABELS.units[patient.durationUnit] || 'ชั่วโมง'}` : 'ไม่ได้ระบุ';
  const durationMinutes = getStrokeDurationInMinutes(patient.durationVal, patient.durationUnit);
  const isWithin4_5Hours = durationMinutes !== null && durationMinutes <= 270;

  let timeSummaryText = `ระยะเวลาตั้งแต่เริ่มมีอาการ/LSN: ${durStr}`;
  if (patient.strokeOnsetContext === 'known_exact') {
    const dtParts = [fmtD(patient.strokeExactDate), patient.strokeExactTime ? `${patient.strokeExactTime} น.` : ''].filter(Boolean).join(' เวลา ');
    timeSummaryText += ` • ทราบเวลาเริ่มมีอาการแน่นอน${dtParts ? ` (${dtParts})` : ''}`;
  } else if (patient.strokeOnsetContext === 'wake_up_or_unknown') {
    const lsnParts = [fmtD(patient.strokeLsnDate), patient.strokeLsnTime ? `${patient.strokeLsnTime} น.` : ''].filter(Boolean).join(' ');
    const discParts = [fmtD(patient.strokeDiscoveryDate), patient.strokeDiscoveryTime ? `${patient.strokeDiscoveryTime} น.` : ''].filter(Boolean).join(' ');
    timeSummaryText += ` • ตื่นมาพบ/ไม่ทราบเวลาแน่นอน [LSN: ${lsnParts || 'ไม่ระบุ'} | เวลาที่พบอาการ: ${discParts || 'ไม่ระบุ'}]`;
  } else if (patient.strokeOnsetContext === 'transient_resolved') {
    const trStr = patient.strokeTransientVal ? `${patient.strokeTransientVal} ${STROKE_LABELS.units[patient.strokeTransientUnit] || 'นาที'}` : 'ไม่ระบุ';
    timeSummaryText += ` • อาการเป็นชั่วคราวแล้วทุเลาลงจนหายเป็นปกติ (ระยะเวลาที่เป็น: ${trStr})`;
  }

  const absoluteList = [];
  const relativeList = [];
  if (patient.stroke_rf_severe_headache || patient.stroke_rf_neck_stiffness) {
    absoluteList.push('อาการทางคลินิกสงสัยภาวะเลือดออกใต้เยื่อหุ้มสมองชั้นกลาง (Suspected Subarachnoid Hemorrhage: ปวดศีรษะรุนแรงเฉียบพลัน / คอแข็งเกร็ง) [Auto-detected]');
  }
  if (patient.stroke_pain_chest_back_tearing) {
    absoluteList.push('มีอาการเจ็บแน่นหน้าอก ปวดท้องรุนแรง หรือปวดฉีกขาดทะลุกลางหลัง สงสัยหลอดเลือดแดงใหญ่ฉีกขาด (Suspected Acute Aortic Dissection) [Auto-detected]');
  }
  if (patient.stroke_ci_prior_ich) absoluteList.push('มีประวัติเคยเกิดภาวะเลือดออกในกะโหลกศีรษะ / เลือดออกในสมองมาก่อน (Prior Intracranial Hemorrhage)');
  if (patient.stroke_ci_brain_lesion) absoluteList.push('มีรอยโรคในสมองเสี่ยงสูง เช่น Aneurysm ขนาดใหญ่, AVM หรือเนื้องอกในสมอง (High-risk Intracranial Lesion / Neoplasm)');
  if (patient.stroke_ci_cns_surgery_trauma_3m) absoluteList.push('เคยผ่าตัดสมองหรือไขสันหลัง หรือมีภาวะบาดเจ็บที่ศีรษะขั้นรุนแรง ภายใน 3 เดือน (CNS Surgery or Severe Head Trauma < 3 months)');
  if (patient.stroke_ci_ischemic_stroke_3m) absoluteList.push('มีประวัติโรคหลอดเลือดสมองตีบ (Ischemic Stroke) ภายใน 3 เดือน');
  if (patient.stroke_ci_active_bleeding) absoluteList.push('มีภาวะเลือดออกในอวัยวะภายในที่กำลังดำเนินอยู่ (Active Internal Bleeding)');
  if (patient.stroke_ci_gi_bleed_malignancy_21d) absoluteList.push('มีมะเร็งในทางเดินอาหาร (GI Malignancy) หรือมีประวัติเลือดออกในทางเดินอาหาร ภายใน 21 วัน');
  if (patient.stroke_ci_anticoagulant) absoluteList.push('ได้รับยาต้านการแข็งตัวของเลือด (DOAC/NOAC ภายใน 48 ชม., LMWH ขนาดรักษาภายใน 24 ชม., หรือ Warfarin ที่ต้องตรวจ INR > 1.7)');

  if (patient.strokeOnsetContext === 'transient_resolved') relativeList.push('อาการสมองขาดเลือดชั่วคราวที่ทุเลาลงจนหายเป็นปกติแล้ว (Transient Ischemic Attack - TIA) [Auto-detected — ข้อพิจารณาไม่ให้ยา]');
  else if (patient.strokeWeaknessSeverity === 'mild') relativeList.push('อาการทางระบบประสาทเป็นเพียงเล็กน้อยและไม่ทำให้ทุพพลภาพ (Nondisabling Minor Stroke) [Auto-detected — ข้อพิจารณาไม่ให้ยา]');
  if (patient.stroke_rf_seizure) relativeList.push('มีอาการชักขณะเริ่มมีอาการ (Seizure at onset) ที่สงสัยภาวะอ่อนแรงหลังชัก (Postictal Todd’s paralysis) [Auto-detected — ข้อพิจารณาไม่ให้ยา]');
  const hasMigraineUd = Array.isArray(patient.underlying) && patient.underlying.some(u => u.includes('ไมเกรน') || u.toLowerCase().includes('migraine'));
  if (hasMigraineUd && patient.stroke_rf_severe_headache) relativeList.push('มีประวัติโรคไมเกรนร่วมกับอาการปวดศีรษะในครั้งนี้ (Suspected Hemiplegic / Complex Migraine Mimic) [Auto-detected — ข้อพิจารณาไม่ให้ยา]');
  if (patient.stroke_ci_major_surgery_trauma_14d) relativeList.push('ได้รับการผ่าตัดใหญ่ภายนอกระบบประสาท หรือการบาดเจ็บรุนแรง ภายใน 14 วัน (Major non-CNS surgery or serious trauma < 14 days)');
  if (patient.stroke_ci_arterial_puncture_7d) relativeList.push('เคยได้รับการเจาะหลอดเลือดแดงในตำแหน่งที่กดห้ามเลือดไม่ได้ ภายใน 7 วัน (Non-compressible arterial puncture < 7 days)');
  if (patient.stroke_ci_recent_mi_3m) relativeList.push('มีประวัติภาวะกล้ามเนื้อหัวใจตายเฉียบพลัน (Acute Myocardial Infarction) ภายใน 3 เดือน (ระวัง Myocardial rupture และ Hemopericardium)');
  if (patient.stroke_ci_pregnancy && patient.gender === 'หญิง') relativeList.push('สตรีตั้งครรภ์ (Pregnancy — พิจารณาให้ได้หากประโยชน์ในการลดความพิการสูงกว่าความเสี่ยงอย่างชัดเจน)');

  return { isWithin4_5Hours, durationMinutes, timeSummaryText, absoluteList, relativeList };
}

function updateStrokeOutputs(patient) {
  if (!patient) return { rapid: '', narrative: '', json: {} };
  const fmtD = d => (typeof formatDateDdMmYyyy === 'function' ? formatDateDdMmYyyy(d) : (d || ''));
  const fmtT = t => (typeof formatTime24h === 'function' ? formatTime24h(t) : (t || ''));
  const durationText = patient.durationVal ? `${patient.durationVal} ${STROKE_LABELS.units[patient.durationUnit] || 'ชั่วโมง'}` : 'ไม่ได้ระบุ';
  const evalCi = evaluateStrokeFibrinolysisContraindications(patient);

  const onsetContextMap = {
    known_exact: `ทราบเวลาเริ่มอาการแน่นอน${(patient.strokeExactDate || patient.strokeExactTime) ? ` [วันที่ ${fmtD(patient.strokeExactDate) || '-'} เวลา ${fmtT(patient.strokeExactTime) || '-'} น.]` : ''}`,
    wake_up_or_unknown: `ตื่นมาพบอาการ / ไม่ทราบเวลาแน่นอน [LSN: ${fmtD(patient.strokeLsnDate) || ''} ${patient.strokeLsnTime ? `${fmtT(patient.strokeLsnTime)} น.` : 'ไม่ระบุ'} | พบอาการ: ${fmtD(patient.strokeDiscoveryDate) || ''} ${patient.strokeDiscoveryTime ? `${fmtT(patient.strokeDiscoveryTime)} น.` : 'ไม่ระบุ'}]`,
    transient_resolved: `เป็นชั่วคราวแล้วหายเป็นปกติ [นาน ${patient.strokeTransientVal || '-'} ${STROKE_LABELS.units[patient.strokeTransientUnit] || 'นาที'}]`,
    unspecified: 'ไม่ได้ระบุ'
  };

  const positives = [];
  const negatives = [];

  // 1. Motor & Facial Palsy (Group-scoped Zero Default Bias)
  const hasWeaknessItem = Boolean(patient.stroke_weakness_hemi || patient.stroke_weakness_arm_only || patient.stroke_weakness_leg_only || patient.stroke_weakness_both_legs);
  const motorItems = [];
  if (patient.stroke_weakness_hemi) motorItems.push(`อ่อนแรงครึ่งซีกทั้งแขนและขา (Hemiparesis)${STROKE_LABELS.side[patient.strokeHemiSide] ? ` [${STROKE_LABELS.side[patient.strokeHemiSide]}]` : ''}`);
  if (patient.stroke_weakness_arm_only) motorItems.push(`อ่อนแรงเฉพาะแขนข้างเดียว (Upper limb monoparesis)${STROKE_LABELS.side[patient.strokeArmSide] ? ` [${STROKE_LABELS.side[patient.strokeArmSide]}]` : ''}`);
  if (patient.stroke_weakness_leg_only) motorItems.push(`อ่อนแรงเฉพาะขาข้างเดียว (Lower limb monoparesis)${STROKE_LABELS.side[patient.strokeLegSide] ? ` [${STROKE_LABELS.side[patient.strokeLegSide]}]` : ''}`);
  if (patient.stroke_weakness_both_legs) motorItems.push('อ่อนแรงขาทั้งสองข้างพร้อมกัน (Paraparesis)');

  if (motorItems.length > 0) {
    const sev = STROKE_LABELS.severity[patient.strokeWeaknessSeverity] ? ` [${STROKE_LABELS.severity[patient.strokeWeaknessSeverity]}]` : '';
    positives.push(`${motorItems.join(', ')}${sev}`);
  }

  if (patient.stroke_face_droop) {
    const fSide = STROKE_LABELS.side[patient.strokeFaceSide] ? ` [${STROKE_LABELS.side[patient.strokeFaceSide]}]` : '';
    const fPattern = patient.strokeFaceUpperPattern === 'forehead_spared'
      ? ' (ยักคิ้วและหลับตาได้ปกติ — Central CN VII)'
      : (patient.strokeFaceUpperPattern === 'forehead_involved' ? ' (หลับตาไม่สนิท/ยักคิ้วไม่ได้ — Peripheral CN VII / Bell’s Palsy)' : '');
    positives.push(`มีมุมปากตก ปากเบี้ยว ยิ้มไม่เท่ากัน${fSide}${fPattern}`);
  }

  const motorAnswered = Boolean(patient.stroke_motor_none || hasWeaknessItem || patient.stroke_face_droop);
  if (motorAnswered) {
    if (!hasWeaknessItem) negatives.push('ไม่มีอาการแขนขาอ่อนแรง (กำลังแขนขาปกติ)');
    if (!patient.stroke_face_droop) negatives.push('ไม่มีมุมปากตกหรือปากเบี้ยว');
  }

  // 2. Sensory & Specific Pain Differential
  const hasSensoryPainItem = Boolean(
    patient.stroke_numbness_hemi || patient.stroke_pain_neck_radiating ||
    patient.stroke_pain_back_radiating || patient.stroke_pain_limb_cold_pale || patient.stroke_pain_chest_back_tearing
  );
  if (patient.stroke_numbness_hemi) {
    const locs = Array.isArray(patient.strokeNumbnessLocs) && patient.strokeNumbnessLocs.length > 0
      ? ` (ตำแหน่ง: ${patient.strokeNumbnessLocs.map(l => STROKE_LABELS.numbLoc[l] || l).join(', ')})`
      : '';
    const s = STROKE_LABELS.side[patient.strokeNumbnessSide] ? ` [${STROKE_LABELS.side[patient.strokeNumbnessSide]}]` : '';
    positives.push(`มีอาการชา / ความรู้สึกสัมผัสลดลง${locs}${s}`);
  }
  if (patient.stroke_pain_neck_radiating) positives.push('มีปวดต้นคอ/สะบัก ร้าวลงแขนหรือมือ (Cervical radiculopathy differential)');
  if (patient.stroke_pain_back_radiating) positives.push('มีปวดหลัง/บั้นเอว ร้าวลงขาหรือเท้า (Lumbar radiculopathy differential)');
  if (patient.stroke_pain_limb_cold_pale) positives.push('ปวดแขนหรือขาข้างที่อ่อนแรงรุนแรง ร่วมกับปลายมือ/เท้าซีดเย็น (Suspected Acute Limb Ischemia)');
  if (patient.stroke_pain_chest_back_tearing) positives.push('เจ็บแน่นหน้าอก / ปวดท้องรุนแรง / ปวดฉีกขาดทะลุกลางหลัง (Suspected Acute Aortic Dissection)');

  if (patient.stroke_sensory_pain_none || hasSensoryPainItem) {
    if (!patient.stroke_numbness_hemi) negatives.push('ไม่มีอาการชาครึ่งซีก');
    if (!patient.stroke_pain_neck_radiating && !patient.stroke_pain_back_radiating && !patient.stroke_pain_limb_cold_pale && !patient.stroke_pain_chest_back_tearing) {
      negatives.push('ไม่มีปวดร้าวต้นคอ/หลัง, ไม่มีแขนขาซีดเย็น, ไม่มีเจ็บหน้าอก/ปวดทะลุหลัง');
    }
  }

  // 3. Speech & Language
  const speechItems = [];
  if (patient.stroke_speech_dysarthria) speechItems.push('พูดไม่ชัด ลิ้นแข็ง เสียงอ้อแอ้ (Dysarthria)');
  if (patient.stroke_speech_expressive_aphasia) speechItems.push('พูดไม่ออก นึกคำพูดไม่ได้ พูดเป็นคำสั้นๆ (Expressive aphasia)');
  if (patient.stroke_speech_receptive_aphasia) speechItems.push('ฟังไม่เข้าใจ ถามตอบไม่ตรงคำถาม (Receptive aphasia)');
  if (speechItems.length > 0) positives.push(speechItems.join(', '));
  else if (patient.stroke_speech_none) negatives.push('การพูดและการสื่อสารปกติ ไม่พูดอ้อแอ้ ไม่สับสนภาษา');

  // 4. Bulbar & Vision
  const bulbarVisionAnswered = Boolean(patient.stroke_bulbar_vision_none || patient.stroke_has_dysphagia || patient.stroke_vision_monocular || patient.stroke_vision_hemianopia || patient.stroke_vision_diplopia);
  if (patient.stroke_has_dysphagia) positives.push('กลืนลำบาก หรือดื่มน้ำ/อาหารแล้วสำลัก (Dysphagia)');
  const visionItems = [];
  if (patient.stroke_vision_monocular) visionItems.push('ตามืดมัวลงเฉียบพลันข้างเดียว (Amaurosis fugax)');
  if (patient.stroke_vision_hemianopia) visionItems.push('ลานสายตามืดไปครึ่งซีก (Hemianopia)');
  if (patient.stroke_vision_diplopia) visionItems.push('มองเห็นภาพซ้อน 2 ภาพ (Diplopia)');
  if (visionItems.length > 0) positives.push(visionItems.join(', '));
  if (bulbarVisionAnswered) {
    if (!patient.stroke_has_dysphagia) negatives.push('การกลืนปกติ ไม่มีกลืนสำลัก');
    if (visionItems.length === 0) negatives.push('การมองเห็นปกติ ไม่มีภาพซ้อนหรือลานสายตามืดครึ่งซีก');
  }

  // 5. Neurological Warning Signs
  const hasRfItem = Boolean(
    patient.stroke_rf_altered_mental || patient.stroke_rf_severe_headache || patient.stroke_rf_projectile_vomiting ||
    patient.stroke_rf_seizure || patient.stroke_rf_ataxia_dizziness || patient.stroke_rf_neck_stiffness
  );
  if (patient.stroke_rf_altered_mental) positives.push('ซึมลง สับสน เรียกปลุกตื่นยาก หรือหมดสติ (Altered mental status)');
  if (patient.stroke_rf_severe_headache) positives.push('ปวดศีรษะรุนแรงเฉียบพลันร่วมด้วย (Severe headache)');
  if (patient.stroke_rf_projectile_vomiting) positives.push('คลื่นไส้อาเจียนรุนแรง / อาเจียนพุ่ง (Projectile vomiting)');
  if (patient.stroke_rf_seizure) positives.push('มีอาการชักเกร็ง กระตุก หรือกัดลิ้นร่วมด้วย (Seizure at onset)');
  if (patient.stroke_rf_ataxia_dizziness) positives.push('เวียนศีรษะบ้านหมุนรุนแรง เดินเซทรงตัวไม่ได้ (Severe vertigo / Ataxia)');
  if (patient.stroke_rf_neck_stiffness) positives.push('คอแข็งเกร็ง ก้มคอไม่ลง (Nuchal rigidity)');
  if (patient.stroke_rf_none || hasRfItem) {
    if (!patient.stroke_rf_altered_mental) negatives.push('รู้สึกตัวดี ถามตอบรู้เรื่อง');
    if (!patient.stroke_rf_severe_headache) negatives.push('ไม่มีปวดศีรษะรุนแรงเฉียบพลัน');
    if (!patient.stroke_rf_projectile_vomiting) negatives.push('ไม่มีอาเจียนพุ่ง');
    if (!patient.stroke_rf_seizure) negatives.push('ไม่มีอาการชักเกร็ง');
    if (!patient.stroke_rf_ataxia_dizziness) negatives.push('ไม่มีเวียนศีรษะบ้านหมุนหรือเดินเซ');
    if (!patient.stroke_rf_neck_stiffness) negatives.push('ไม่มีคอแข็งเกร็ง');
  }

  if (patient.otherSymptomsFree && String(patient.otherSymptomsFree).trim()) {
    positives.push(String(patient.otherSymptomsFree).trim());
  }

  patient.pertinentPositives = positives.length > 0 ? positives : ['ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม'];
  patient.pertinentNegatives = negatives.length > 0 ? negatives : ['ผู้ป่วยไม่ได้ระบุคำตอบยืนยันในหมวดอาการร่วม'];

  const hospLabel = STROKE_LABELS.hospStatus[patient.hospRecordStatus] || 'ไม่ได้ระบุ';
  const docNotes = patient.doctor_notes || {};
  const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ') ? 'ไม่ได้ระบุ' : (patient.currentMeds === 'ไม่มี' ? 'ไม่มี' : patient.currentMeds);
  const udRaw = Array.isArray(patient.underlying) ? patient.underlying : (patient.underlying ? [patient.underlying] : []);
  const udArr = udRaw.filter(u => u && !u.includes('ปฏิเสธ') && u !== 'ไม่มี' && u !== 'ไม่มีโรคประจำตัว' && u !== 'ไม่ได้ระบุ');
  const udExplicitDeny = udRaw.some(u => u && (u.includes('ปฏิเสธ') || u === 'ไม่มี' || u === 'ไม่มีโรคประจำตัว'));
  const udText = udArr.length > 0 ? udArr.join(', ') : ((patient.hospRecordStatus === 'self' || patient.hospRecordStatus === 'additional' || udExplicitDeny) ? 'ปฏิเสธ' : 'ไม่ได้ระบุ');
  const allergyText = (!patient.drugAllergy || patient.drugAllergy === 'ไม่ได้ระบุ') ? 'ไม่ได้ระบุ' : ((patient.drugAllergy.includes('ปฏิเสธ') || patient.drugAllergy === 'ไม่มี') ? 'ปฏิเสธ' : patient.drugAllergy);

  const anyCiChecked = Boolean(
    patient.stroke_ci_prior_ich || patient.stroke_ci_brain_lesion || patient.stroke_ci_cns_surgery_trauma_3m ||
    patient.stroke_ci_ischemic_stroke_3m || patient.stroke_ci_active_bleeding || patient.stroke_ci_gi_bleed_malignancy_21d ||
    patient.stroke_ci_anticoagulant || patient.stroke_ci_major_surgery_trauma_14d || patient.stroke_ci_recent_mi_3m ||
    patient.stroke_ci_arterial_puncture_7d || (patient.stroke_ci_pregnancy && patient.gender === 'หญิง')
  );
  const hasTimeWindow = Boolean(patient.durationVal || (patient.strokeOnsetContext && patient.strokeOnsetContext !== 'unspecified'));
  const timeWindowBadge = hasTimeWindow ? ` (${evalCi.isWithin4_5Hours ? '⚡ ภายใน Golden Period ≤ 4.5 ชม.' : '⏰ เกิน 4.5 ชม.'})` : '';
  const ciScreened = Boolean(anyCiChecked || patient.stroke_ci_none || (evalCi.isWithin4_5Hours && (motorAnswered || hasSensoryPainItem || speechItems.length > 0 || bulbarVisionAnswered || hasRfItem)));

  const rfs = Array.isArray(patient.redFlags) ? patient.redFlags : [];
  const ageStr = (patient.age && patient.age !== 'ไม่ระบุ') ? `${patient.age} ปี` : 'ไม่ระบุ';
  const genderPart = (patient.gender && patient.gender !== 'ไม่ระบุ') ? ` เพศ ${patient.gender}` : '';

  const defaultRapid =
`[Chief Complaint (CC)]
ปากเบี้ยว อ่อนแรง ชา ข้างใดข้างหนึ่ง พูดไม่ชัด เป็นมา ${durationText}

[History of Present Illness (HPI)]
• ระยะเวลาและกรอบเวลา (Time Window): ${durationText}${timeWindowBadge}
• การเริ่มต้นและเวลาปกติครั้งสุดท้าย (LSN): ${onsetContextMap[patient.strokeOnsetContext] || 'ไม่ได้ระบุ'}
• การดำเนินของอาการ: ${STROKE_LABELS.progression[patient.strokeProgression] || 'ไม่ได้ระบุ'}

• Pertinent Positives:
${patient.pertinentPositives.map(p => `  - ${p}`).join('\n')}

• Pertinent Negatives:
${patient.pertinentNegatives.map(n => `  - ${n}`).join('\n')}

[IV Fibrinolysis (rt-PA / Tenecteplase) Contraindication Screening]
• Absolute Contraindications:
${evalCi.absoluteList.length > 0 ? evalCi.absoluteList.map(c => `  - [ข้อห้ามเด็ดขาด] ${c}`).join('\n') : (ciScreened ? '  ✓ ไม่พบข้อห้ามเด็ดขาดจากประวัติผู้ป่วย' : '  - ไม่ได้ระบุ (ยังไม่ได้คัดกรองข้อห้าม)')}
• Relative Contraindications / Warnings:
${evalCi.relativeList.length > 0 ? evalCi.relativeList.map(c => `  ⚠️ ${c}`).join('\n') : (ciScreened ? '  ✓ ไม่พบข้อห้ามสัมพัทธ์จากประวัติผู้ป่วย' : '  - ไม่ได้ระบุ (ยังไม่ได้คัดกรองข้อห้าม)')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• โรคประจำตัว (U/D): ${udText}
• ยาประจำตัว (Current Meds): ${medsText}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${allergyText}

[Emergency Risk Assessment (Red Flags)]
${rfs.length > 0
  ? `🚩 RED FLAGS DETECTED:\n${rfs.map(rf => `  * ${rf.textTh}`).join('\n')}`
  : '✓ ไม่พบสัญญาณเตือนวิกฤตของโรคหลอดเลือดสมองเฉียบพลัน'}

[Doctor's Clinical Addendum & Exam]
• ประวัติเพิ่มเติม/แก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}
• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}
• แผนการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

  const defaultNarrative =
`ผู้ป่วย [${patient.name || 'ไม่ระบุชื่อ'}] อายุ ${ageStr}${genderPart} มารับการตรวจที่ห้องฉุกเฉิน รพ.ราชบุรี ด้วยอาการปากเบี้ยว อ่อนแรง ชา ข้างใดข้างหนึ่ง พูดไม่ชัด มา ${durationText}
รายละเอียดเวลาที่เริ่มมีอาการ: ${onsetContextMap[patient.strokeOnsetContext] || 'ไม่ได้ระบุ'} ลักษณะการดำเนินโรค: ${STROKE_LABELS.progression[patient.strokeProgression] || 'ไม่ได้ระบุ'}

อาการร่วมและการซักประวัติตามระบบประสาท: ${patient.pertinentPositives.join(', ')}
อาการสำคัญที่ปฏิเสธ: ${patient.pertinentNegatives.join(', ')}

การคัดกรองข้อห้ามการให้ยาสลายลิ่มเลือด (IV Fibrinolysis): ข้อห้ามเด็ดขาด: ${evalCi.absoluteList.length > 0 ? evalCi.absoluteList.join('; ') : (ciScreened ? 'ไม่พบ' : 'ไม่ได้ระบุ')} | ข้อควรระวังสัมพัทธ์: ${evalCi.relativeList.length > 0 ? evalCi.relativeList.join('; ') : (ciScreened ? 'ไม่พบ' : 'ไม่ได้ระบุ')}

ประวัติการเจ็บป่วยในอดีต: [${hospLabel}], โรคประจำตัว: ${udText}, ยาประจำตัว: ${medsText}, แพ้ยา: ${allergyText}${rfs.length > 0 ? `\n\n[แจ้งเตือนความเสี่ยงสูง]: ${rfs.map(rf => rf.textTh).join(', ')}` : ''}

[บันทึกการตรวจและการประเมินโดยแพทย์]:
${docNotes.additional_hpi ? `• ประวัติเพิ่มเติม: ${docNotes.additional_hpi}\n` : ''}${docNotes.physical_exam ? `• การตรวจร่างกาย: ${docNotes.physical_exam}\n` : ''}${docNotes.preliminary_dx ? `• การวินิจฉัย: ${docNotes.preliminary_dx}\n` : ''}${docNotes.plan ? `• แผนการรักษา: ${docNotes.plan}` : ''}`;

  const jsonPayload = {
    '$schema': 'https://json-schema.org/draft/2020-12/schema',
    encounter: {
      hospital_site: 'Ratchaburi Hospital', queue_id: patient.queue_number || null, hn: patient.hn || null,
      patient_name: patient.name || null, age: patient.age !== undefined ? patient.age : null, gender: patient.gender || null,
      timestamp: patient.timestamp || null, status: patient.status || null,
      triage_urgency_flag: rfs.length > 0, red_flags_count: rfs.length, hospital_record_status: patient.hospRecordStatus || null
    },
    chief_complaint: 'stroke_deficit',
    stroke_onset_and_time_window: {
      duration_value: patient.durationVal || null, duration_unit: patient.durationUnit || null,
      duration_in_minutes: evalCi.durationMinutes, within_4_5_hour_fast_track_window: evalCi.isWithin4_5Hours,
      onset_context: patient.strokeOnsetContext || null,
      exact_onset_datetime: { date: fmtD(patient.strokeExactDate || ''), time: fmtT(patient.strokeExactTime || '') },
      last_seen_normal_and_discovery: {
        lsn_date: fmtD(patient.strokeLsnDate || ''), lsn_time: fmtT(patient.strokeLsnTime || ''),
        discovery_date: fmtD(patient.strokeDiscoveryDate || ''), discovery_time: fmtT(patient.strokeDiscoveryTime || '')
      },
      transient_episode_duration: { value: patient.strokeTransientVal || null, unit: patient.strokeTransientUnit || '' },
      symptom_progression: patient.strokeProgression || null
    },
    motor_sensory_and_pain_differential: {
      hemiparesis: { present: Boolean(patient.stroke_weakness_hemi), side: patient.strokeHemiSide || 'none' },
      arm_monoparesis: { present: Boolean(patient.stroke_weakness_arm_only), side: patient.strokeArmSide || 'none' },
      leg_monoparesis: { present: Boolean(patient.stroke_weakness_leg_only), side: patient.strokeLegSide || 'none' },
      paraparesis_both_legs: Boolean(patient.stroke_weakness_both_legs),
      facial_palsy: { present: Boolean(patient.stroke_face_droop), side: patient.strokeFaceSide || 'none', upper_face_pattern: patient.strokeFaceUpperPattern || 'none' },
      weakness_severity: patient.strokeWeaknessSeverity || 'none',
      sensory_loss_or_numbness: { present: Boolean(patient.stroke_numbness_hemi), locations: patient.strokeNumbnessLocs || [], side: patient.strokeNumbnessSide || 'none' },
      associated_pain_differential: {
        neck_radiating_to_arm_radiculopathy: Boolean(patient.stroke_pain_neck_radiating),
        back_radiating_to_leg_radiculopathy: Boolean(patient.stroke_pain_back_radiating),
        severe_limb_pain_with_pallor_coldness_ali: Boolean(patient.stroke_pain_limb_cold_pale),
        chest_abdominal_or_tearing_back_pain_aortic_dissection: Boolean(patient.stroke_pain_chest_back_tearing)
      }
    },
    speech_bulbar_and_visual_deficits: {
      speech_and_language: {
        dysarthria: Boolean(patient.stroke_speech_dysarthria),
        expressive_aphasia: Boolean(patient.stroke_speech_expressive_aphasia),
        receptive_aphasia: Boolean(patient.stroke_speech_receptive_aphasia)
      },
      dysphagia: Boolean(patient.stroke_has_dysphagia),
      visual_symptoms: {
        monocular_vision_loss: Boolean(patient.stroke_vision_monocular),
        hemianopia: Boolean(patient.stroke_vision_hemianopia),
        diplopia: Boolean(patient.stroke_vision_diplopia)
      }
    },
    neurological_warning_signs: {
      altered_mental_status: Boolean(patient.stroke_rf_altered_mental),
      severe_or_thunderclap_headache: Boolean(patient.stroke_rf_severe_headache),
      projectile_vomiting: Boolean(patient.stroke_rf_projectile_vomiting),
      seizure_at_onset: Boolean(patient.stroke_rf_seizure),
      severe_vertigo_or_ataxia: Boolean(patient.stroke_rf_ataxia_dizziness),
      neck_stiffness_or_fever: Boolean(patient.stroke_rf_neck_stiffness),
      other_symptoms_free_text: patient.otherSymptomsFree || ''
    },
    fibrinolysis_contraindication_screening: {
      auto_triggered_by_4_5_hr_window: evalCi.isWithin4_5Hours,
      absolute_contraindications_detected: evalCi.absoluteList,
      relative_contraindications_detected: evalCi.relativeList
    },
    red_flags_detected: rfs.map(rf => ({ code: rf.key, label: rf.textTh, clinical_risk: rf.risk })),
    pertinent_positives: patient.pertinentPositives,
    pertinent_negatives: patient.pertinentNegatives,
    patient_background: {
      hospital_record_status: patient.hospRecordStatus || null,
      underlying_diseases: patient.underlying || [], drug_and_food_allergies: patient.drugAllergy || 'ไม่ได้ระบุ', current_medications: patient.currentMeds || 'ไม่ได้ระบุ'
    },
    doctor_clinical_addendum: {
      additional_or_corrected_history: docNotes.additional_hpi || '',
      vitals_and_physical_exam: docNotes.physical_exam || '',
      provisional_diagnosis: docNotes.preliminary_dx || '',
      treatment_plan: docNotes.plan || ''
    }
  };

  patient.rapidHpi = patient.custom_rapid_note || defaultRapid;
  patient.narrativeHpi = patient.custom_narrative_note || defaultNarrative;
  patient.medicalJson = jsonPayload;

  const rapidEl = document.getElementById('rapidTextView');
  const narrativeEl = document.getElementById('narrativeTextView');
  const jsonEl = document.getElementById('jsonViewer');
  if (rapidEl) rapidEl.value = patient.rapidHpi;
  if (narrativeEl) narrativeEl.value = patient.narrativeHpi;
  if (jsonEl) jsonEl.textContent = JSON.stringify(jsonPayload, null, 2);

  return { rapid: patient.rapidHpi, narrative: patient.narrativeHpi, json: jsonPayload };
}

// --- Golden Form HTML Assembly ---
const STROKE_FORM_HTML = `
<div id="strokeQuestionnaireSection" class="hidden space-y-6">
  <div data-cc-top-banner="stroke_deficit">
    <div class="bg-teal-50 border border-teal-200 rounded-2xl p-4 sm:p-5 text-teal-900 shadow-2xs space-y-2">
      <div class="flex items-center space-x-2 text-teal-800 font-bold text-sm">
        <i data-lucide="info" class="w-5 h-5 text-teal-600 flex-shrink-0"></i>
        <span>คำแนะนำสำคัญระหว่างรอพบแพทย์ (Stroke Fast Track)</span>
      </div>
      <ul class="text-xs text-teal-800 space-y-1.5 pl-6 list-disc">
        <li><strong>งดดื่มน้ำ งดอาหาร และงดรับประทานยาทุกชนิดไว้ก่อน:</strong> เพื่อป้องกันการสำลักเข้าปอดในกรณีที่กล้ามเนื้อการกลืนอ่อนแรง</li>
        <li><strong>จดจำเวลาปกติครั้งสุดท้าย:</strong> เตรียมข้อมูลเวลาสุดท้ายที่เห็นผู้ป่วยยังพูดคุยหรือเดินได้ปกติ และรายชื่อยาที่ทานประจำ (โดยเฉพาะยาละลายลิ่มเลือด)</li>
        <li><strong>รีบแจ้งพยาบาลทันทีหากอาการแย่ลง:</strong> เช่น ซึมลง เรียกไม่รู้ตัว หายใจลำบาก สำลัก ชักเกร็ง หรือปวดศีรษะรุนแรงเฉียบพลัน</li>
      </ul>
    </div>
  </div>

  <!-- CARD 1: ระยะเวลาที่เริ่มมีอาการ และเวลาสุดท้ายที่เห็นว่าปกติ -->
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
    <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="clock" class="w-5 h-5"></i></div>
      <div>
        <h2 class="text-base font-bold text-slate-900 section-title" data-base-title="ระยะเวลาที่เริ่มมีอาการ และเวลาสุดท้ายที่เห็นว่าปกติ">1. ระยะเวลาที่เริ่มมีอาการ และเวลาสุดท้ายที่เห็นว่าปกติ</h2>
        <p class="text-xs text-slate-500">ข้อมูลเวลามีความสำคัญอย่างยิ่งต่อการพิจารณายาสลายลิ่มเลือดและรักษาเร่งด่วน</p>
      </div>
    </div>

    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">1.1 ระยะเวลาที่มีอาการผิดปกติจนถึงปัจจุบัน <span class="text-rose-500">*</span></label>
      <div class="flex items-center space-x-2 max-w-xs">
        <input type="number" id="strokeDurationVal" min="1" placeholder="ระบุตัวเลข เช่น 1" oninput="checkStrokeFibrinolyticTrigger()" class="w-36 bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 text-sm font-semibold placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-medical-500">
        <select id="strokeDurationUnit" onchange="checkStrokeFibrinolyticTrigger()" class="bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-medical-500">
          <option value="minutes">นาที</option>
          <option value="hours" selected>ชั่วโมง</option>
          <option value="days">วัน</option>
          <option value="weeks">สัปดาห์</option>
          <option value="months">เดือน</option>
          <option value="years">ปี</option>
        </select>
      </div>
    </div>

    <div class="pt-3 border-t border-slate-100 space-y-3">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider">1.2 รูปแบบเวลาที่เริ่มมีอาการ <span class="text-rose-500">*</span></label>
      ${renderStrokeGrid('grid-cols-1 sm:grid-cols-3', [
        { value: 'known_exact', title: wrapStrokeWords('ทราบเวลาเริ่มอาการ', 'แน่นอน') },
        { value: 'wake_up_or_unknown', title: wrapStrokeWords('ตื่นมาพบ /', 'ไม่ทราบเวลาแน่นอน'), desc: 'ต้องระบุเวลาปกติครั้งสุดท้าย' },
        { value: 'transient_resolved', title: wrapStrokeWords('เป็นชั่วคราว', 'แล้วหายเป็นปกติ') }
      ], { kind: 'radio', name: 'strokeOnsetContext', onchange: 'handleStrokeOnsetContextChange()' })}

      <div id="stroke_exact_time_wrap" class="hidden p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
        <span class="font-semibold text-slate-800 block">ระบุวันที่และเวลาที่เริ่มมีอาการ:</span>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
          <div>
            <label class="block text-[11px] text-slate-600 mb-1">วันที่เริ่มมีอาการ (dd/mm/yyyy):</label>
            <input type="text" id="strokeExactDate" data-universal-date="true" placeholder="วว/ดด/ปปปป" autocomplete="off" onchange="checkStrokeFibrinolyticTrigger()" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 text-xs">
          </div>
          <div>
            <label class="block text-[11px] text-slate-600 mb-1">เวลาที่เริ่มมีอาการ (24 ชม.):</label>
            <input type="text" id="strokeExactTime" data-universal-time="true" placeholder="เช่น 14:30" autocomplete="off" onchange="checkStrokeFibrinolyticTrigger()" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 text-xs">
          </div>
        </div>
      </div>

      <div id="stroke_lsn_time_wrap" class="hidden p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3.5 text-xs">
        <div class="space-y-1.5">
          <span class="font-semibold text-slate-800 block">1) เวลาสุดท้ายที่เห็นว่าปกติ (ก่อนเข้านอน / ก่อนขาดการติดต่อ):</span>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md pt-1">
            <div>
              <label class="block text-[11px] text-slate-600 mb-1">วันที่เห็นปกติครั้งสุดท้าย (dd/mm/yyyy):</label>
              <input type="text" id="strokeLsnDate" data-universal-date="true" placeholder="วว/ดด/ปปปป" autocomplete="off" onchange="checkStrokeFibrinolyticTrigger()" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 text-xs">
            </div>
            <div>
              <label class="block text-[11px] text-slate-600 mb-1">เวลาที่เห็นปกติครั้งสุดท้าย (24 ชม.):</label>
              <input type="text" id="strokeLsnTime" data-universal-time="true" placeholder="เช่น 23:00" autocomplete="off" onchange="checkStrokeFibrinolyticTrigger()" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 text-xs">
            </div>
          </div>
        </div>
        <div class="pt-2.5 border-t border-slate-200 space-y-1.5">
          <span class="font-semibold text-slate-800 block">2) เวลาที่รู้ตัวว่ามีอาการ หรือเวลาที่ญาติมาพบเห็น:</span>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md pt-1">
            <div>
              <label class="block text-[11px] text-slate-600 mb-1">วันที่พบอาการ (dd/mm/yyyy):</label>
              <input type="text" id="strokeDiscoveryDate" data-universal-date="true" placeholder="วว/ดด/ปปปป" autocomplete="off" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 text-xs">
            </div>
            <div>
              <label class="block text-[11px] text-slate-600 mb-1">เวลาที่พบอาการ (24 ชม.):</label>
              <input type="text" id="strokeDiscoveryTime" data-universal-time="true" placeholder="เช่น 06:30" autocomplete="off" class="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 text-xs">
            </div>
          </div>
        </div>
      </div>

      <div id="stroke_transient_duration_wrap" class="hidden p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
        <span class="font-semibold text-slate-800 block">มีอาการอยู่นานเท่าใด ก่อนจะหายเป็นปกติ:</span>
        <div class="flex items-center space-x-2 max-w-xs">
          <input type="number" id="strokeTransientVal" min="1" placeholder="เช่น 15" class="w-36 bg-white border border-slate-300 rounded-lg p-2 text-slate-800 text-xs font-semibold placeholder:text-slate-400">
          <select id="strokeTransientUnit" class="bg-white border border-slate-300 rounded-lg p-2 text-slate-800 text-xs font-semibold">
            <option value="minutes" selected>นาที</option>
            <option value="hours">ชั่วโมง</option>
            <option value="days">วัน</option>
          </select>
        </div>
      </div>
    </div>

    <div class="pt-3 border-t border-slate-100">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">1.3 ลักษณะการดำเนินของอาการ</label>
      ${renderStrokeGrid('grid-cols-1 sm:grid-cols-3', [
        { value: 'sudden_maximal', title: wrapStrokeWords('เป็นทันทีทันใด') },
        { value: 'gradual_worse', title: wrapStrokeWords('ค่อยๆ เป็นมากขึ้น', 'เรื่อยๆ') },
        { value: 'fluctuating', title: wrapStrokeWords('เป็นๆ หายๆ', 'สลับกัน') }
      ], { kind: 'radio', name: 'strokeProgression' })}
    </div>
  </div>

  <!-- CARD 2: อาการอ่อนแรง ปากเบี้ยว อาการชา และอาการปวดร่วม -->
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
    <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="user-check" class="w-5 h-5"></i></div>
      <div>
        <h2 class="text-base font-bold text-slate-900 section-title" data-base-title="อาการอ่อนแรง ปากเบี้ยว อาการชา และอาการปวดร่วม">2. อาการอ่อนแรง ปากเบี้ยว อาการชา และอาการปวดร่วม</h2>
        <p class="text-xs text-slate-500">เลือกอาการที่พบและระบุข้างที่มีความผิดปกติ</p>
      </div>
    </div>

    <div class="space-y-3">
      ${renderStrokeSysHeader({
        icon: 'user-check', iconBg: 'bg-blue-100', iconColor: 'text-blue-600',
        title: '2.1 อาการอ่อนแรงของแขนขา หรือปากเบี้ยว (เลือกได้หลายข้อ)',
        noneId: 'stroke_motor_none', noneOnchange: 'handleStrokeMotorNoneChange(this.checked)'
      })}
      ${renderStrokeGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', [
        { id: 'stroke_weakness_hemi', title: wrapStrokeWords('อ่อนแรงแขนและขา', 'ซีกเดียวกัน'), onchange: 'handleStrokeWeaknessChange()' },
        { id: 'stroke_weakness_arm_only', title: wrapStrokeWords('อ่อนแรงเฉพาะแขน', 'หรือมือข้างเดียว'), onchange: 'handleStrokeWeaknessChange()' },
        { id: 'stroke_weakness_leg_only', title: wrapStrokeWords('อ่อนแรงเฉพาะขา', 'ข้างเดียว'), onchange: 'handleStrokeWeaknessChange()' },
        { id: 'stroke_weakness_both_legs', title: wrapStrokeWords('อ่อนแรงขา', 'ทั้งสองข้าง'), onchange: 'handleStrokeWeaknessChange()' },
        { id: 'stroke_face_droop', title: wrapStrokeWords('มุมปากตก /', 'ปากเบี้ยว'), desc: 'ยิ้มไม่เท่ากัน หรือน้ำลายไหลมุมปาก', onchange: 'handleStrokeFaceChange()' }
      ], { kind: 'checkbox' })}

      <div id="stroke_hemi_side_wrap" class="hidden p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
        <span class="font-semibold text-slate-800 block">ระบุซีกที่แขนและขาอ่อนแรง:</span>
        ${renderStrokeGrid('grid-cols-2 max-w-md', [
          { value: 'left', title: wrapStrokeWords('ซีกซ้าย', '(แขนและขาซ้าย)') },
          { value: 'right', title: wrapStrokeWords('ซีกขวา', '(แขนและขาขวา)') }
        ], { kind: 'radio', name: 'strokeHemiSide', compact: true, bgWhite: true })}
      </div>

      <div id="stroke_arm_side_wrap" class="hidden p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
        <span class="font-semibold text-slate-800 block">ระบุข้างที่แขนอ่อนแรง:</span>
        ${renderStrokeGrid('grid-cols-2 max-w-md', [
          { value: 'left', title: wrapStrokeWords('แขนข้างซ้าย') },
          { value: 'right', title: wrapStrokeWords('แขนข้างขวา') }
        ], { kind: 'radio', name: 'strokeArmSide', compact: true, bgWhite: true })}
      </div>

      <div id="stroke_leg_side_wrap" class="hidden p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
        <span class="font-semibold text-slate-800 block">ระบุข้างที่ขาอ่อนแรง:</span>
        ${renderStrokeGrid('grid-cols-2 max-w-md', [
          { value: 'left', title: wrapStrokeWords('ขาข้างซ้าย') },
          { value: 'right', title: wrapStrokeWords('ขาข้างขวา') }
        ], { kind: 'radio', name: 'strokeLegSide', compact: true, bgWhite: true })}
      </div>

      <div id="stroke_face_detail_wrap" class="hidden p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
        <div>
          <span class="font-semibold text-slate-800 block mb-1.5">ระบุข้างที่มุมปากตกหรือใบหน้าเบี้ยว:</span>
          ${renderStrokeGrid('grid-cols-2 max-w-xs', [
            { value: 'left', title: wrapStrokeWords('ข้างซ้าย') },
            { value: 'right', title: wrapStrokeWords('ข้างขวา') }
          ], { kind: 'radio', name: 'strokeFaceSide', compact: true, bgWhite: true })}
        </div>
        <div class="pt-2.5 border-t border-slate-200">
          <span class="font-semibold text-slate-800 block mb-1.5">การหลับตาและการยักคิ้วของใบหน้าข้างที่เบี้ยว:</span>
          ${renderStrokeGrid('grid-cols-1 sm:grid-cols-2', [
            { value: 'forehead_spared', title: wrapStrokeWords('ยักคิ้วได้และหลับตาสนิท', '(เบี้ยวเฉพาะมุมปาก)') },
            { value: 'forehead_involved', title: wrapStrokeWords('ยักคิ้วไม่ขึ้น', 'และหลับตาไม่สนิทด้วย') }
          ], { kind: 'radio', name: 'strokeFaceUpperPattern', compact: true, bgWhite: true })}
        </div>
      </div>
    </div>

    <div id="stroke_weakness_severity_wrap" class="hidden pt-3 border-t border-slate-100 space-y-2">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider">2.2 ระดับความรุนแรงของแรงแขนหรือขา:</label>
      ${renderStrokeGrid('grid-cols-1 sm:grid-cols-3', [
        { value: 'complete_plegia', title: wrapStrokeWords('ยกไม่ขึ้นเลย /', 'ขยับไม่ได้') },
        { value: 'moderate_drift', title: wrapStrokeWords('พอยกได้', 'แต่ต้านแรงไม่ไหว') },
        { value: 'mild', title: wrapStrokeWords('อ่อนแรงเล็กน้อย', 'พอใช้งานได้') }
      ], { kind: 'radio', name: 'strokeWeaknessSeverity', onchange: 'checkStrokeFibrinolyticTrigger()' })}
    </div>

    <div class="pt-3 border-t border-slate-100 space-y-3">
      ${renderStrokeSysHeader({
        icon: 'zap', iconBg: 'bg-amber-100', iconColor: 'text-amber-600',
        title: '2.3 อาการชา และอาการปวดจำเพาะร่วมด้วย (เลือกได้หลายข้อ)',
        noneId: 'stroke_sensory_pain_none', noneOnchange: 'handleStrokeSensoryPainNoneChange(this.checked)'
      })}
      ${renderStrokeGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', [
        { id: 'stroke_numbness_hemi', title: wrapStrokeWords('มีอาการชา /', 'ความรู้สึกสัมผัสลดลง'), onchange: 'handleStrokeNumbnessChange()' },
        { id: 'stroke_pain_neck_radiating', title: wrapStrokeWords('ปวดต้นคอ-สะบัก', 'ร้าวลงแขน/มือ'), onchange: 'handleStrokeSensoryPainItemChange(this)' },
        { id: 'stroke_pain_back_radiating', title: wrapStrokeWords('ปวดหลัง-บั้นเอว', 'ร้าวลงขา/เท้า'), onchange: 'handleStrokeSensoryPainItemChange(this)' },
        { id: 'stroke_pain_limb_cold_pale', title: wrapStrokeWords('ปวดแขนขารุนแรง', 'ร่วมกับซีดหรือเย็น'), desc: 'แขนหรือขาข้างที่ปวดคลำแล้วเย็นเฉียบ สีซีดขาวหรือคล้ำ และขยับได้น้อยลงมาก', onchange: 'handleStrokeSensoryPainItemChange(this)' },
        { id: 'stroke_pain_chest_back_tearing', title: wrapStrokeWords('เจ็บแน่นอก / ปวดท้อง /', 'ปวดทะลุกลางหลัง'), onchange: 'handleStrokeSensoryPainItemChange(this)' }
      ], { kind: 'checkbox' })}

      <div id="stroke_numbness_side_wrap" class="hidden p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
        <div>
          <span class="font-semibold text-slate-800 block mb-1.5">ระบุตำแหน่งที่มีอาการชา (เลือกได้หลายข้อ):</span>
          ${renderStrokeGrid('grid-cols-2 sm:grid-cols-4', [
            { value: 'face', title: wrapStrokeWords('ใบหน้า /', 'รอบริมฝีปาก') },
            { value: 'arm', title: wrapStrokeWords('แขน หรือมือ') },
            { value: 'leg', title: wrapStrokeWords('ขา หรือเท้า') },
            { value: 'hemi', title: wrapStrokeWords('ซีกใดซีกหนึ่ง', 'ของร่างกาย') }
          ], { kind: 'checkbox', name: 'strokeNumbnessLoc', compact: true, bgWhite: true })}
        </div>
        <div class="pt-2.5 border-t border-slate-200">
          <span class="font-semibold text-slate-800 block mb-1.5">ระบุข้างที่มีอาการชา:</span>
          ${renderStrokeGrid('grid-cols-3 max-w-md', [
            { value: 'left', title: wrapStrokeWords('ข้างซ้าย') },
            { value: 'right', title: wrapStrokeWords('ข้างขวา') },
            { value: 'both', title: wrapStrokeWords('ทั้งสองข้าง') }
          ], { kind: 'radio', name: 'strokeNumbnessSide', compact: true, bgWhite: true })}
        </div>
      </div>
    </div>
  </div>

  <!-- CARD 3: ความผิดปกติของการพูด การกลืน และการมองเห็น -->
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
    <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="message-square-warning" class="w-5 h-5"></i></div>
      <div>
        <h2 class="text-base font-bold text-slate-900 section-title" data-base-title="ความผิดปกติของการพูด การกลืน และการมองเห็น">3. ความผิดปกติของการพูด การกลืน และการมองเห็น</h2>
        <p class="text-xs text-slate-500">ประเมินลักษณะการสื่อสาร การกลืน และการมองเห็นที่เปลี่ยนแปลง</p>
      </div>
    </div>

    <div>
      ${renderStrokeSysHeader({
        icon: 'message-square', iconBg: 'bg-blue-100', iconColor: 'text-blue-600',
        title: '3.1 ความผิดปกติของการพูดและการสื่อสาร (เลือกได้หลายข้อ)',
        noneId: 'stroke_speech_none', noneOnchange: 'handleStrokeSpeechNoneChange(this.checked)'
      })}
      ${renderStrokeGrid('grid-cols-1 sm:grid-cols-3', [
        { id: 'stroke_speech_dysarthria', title: wrapStrokeWords('พูดไม่ชัด /', 'ลิ้นแข็ง / เสียงอ้อแอ้') },
        { id: 'stroke_speech_expressive_aphasia', title: wrapStrokeWords('นึกคำพูดไม่ออก /', 'พูดไม่เป็นประโยค') },
        { id: 'stroke_speech_receptive_aphasia', title: wrapStrokeWords('ฟังไม่เข้าใจ /', 'ถามตอบไม่ตรงคำถาม') }
      ], { kind: 'checkbox', onchange: 'handleStrokeSpeechItemChange(this)' })}
    </div>

    <div class="pt-3 border-t border-slate-100">
      ${renderStrokeSysHeader({
        icon: 'eye', iconBg: 'bg-purple-100', iconColor: 'text-purple-600',
        title: '3.2 อาการกลืนและการมองเห็น (เลือกได้หลายข้อ)',
        noneId: 'stroke_bulbar_vision_none', noneOnchange: 'handleStrokeBulbarVisionNoneChange(this.checked)'
      })}
      ${renderStrokeGrid('grid-cols-1 sm:grid-cols-2', [
        { id: 'stroke_has_dysphagia', title: wrapStrokeWords('กลืนลำบาก /', 'ดื่มน้ำสำลัก') },
        { id: 'stroke_vision_monocular', title: wrapStrokeWords('ตามืดบอดเฉียบพลัน', 'ข้างเดียว') },
        { id: 'stroke_vision_hemianopia', title: wrapStrokeWords('ลานสายตามืดดับ', 'ครึ่งซีก'), desc: 'มองไม่เห็นภาพด้านซ้ายหรือขวาครึ่งซีก เช่น เห็นคนหรือวัตถุขาดหายไปครึ่งหนึ่ง' },
        { id: 'stroke_vision_diplopia', title: wrapStrokeWords('มองเห็นภาพซ้อน', '2 ภาพ') }
      ], { kind: 'checkbox', onchange: 'handleStrokeBulbarVisionItemChange(this)' })}
    </div>
  </div>

  <!-- CARD 4: อาการร่วมสำคัญทางระบบประสาท -->
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
    <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="shield-alert" class="w-5 h-5"></i></div>
      <div>
        <h2 class="text-base font-bold text-slate-900 section-title" data-base-title="อาการร่วมสำคัญทางระบบประสาท">4. อาการร่วมสำคัญทางระบบประสาท</h2>
        <p class="text-xs text-slate-500">เลือกอาการที่ท่านมีร่วมด้วย หรือกดไม่มีอาการที่มุมขวาบน</p>
      </div>
    </div>

    <div>
      ${renderStrokeSysHeader({
        icon: 'alert-circle', iconBg: 'bg-amber-100', iconColor: 'text-amber-600',
        title: 'อาการทางระบบประสาทและอาการเตือนร่วม (เลือกได้หลายข้อ)',
        noneId: 'stroke_rf_none', noneOnchange: 'handleStrokeRfNoneChange(this.checked)'
      })}
      ${renderStrokeGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', [
        { id: 'stroke_rf_altered_mental', title: wrapStrokeWords('ซึมลง / สับสน /', 'หมดสติ') },
        { id: 'stroke_rf_severe_headache', title: wrapStrokeWords('ปวดศีรษะรุนแรง', 'เฉียบพลัน') },
        { id: 'stroke_rf_projectile_vomiting', title: wrapStrokeWords('คลื่นไส้ /', 'อาเจียนพุ่งรุนแรง') },
        { id: 'stroke_rf_seizure', title: wrapStrokeWords('ชักเกร็ง / กระตุก', 'ขณะเริ่มมีอาการ') },
        { id: 'stroke_rf_ataxia_dizziness', title: wrapStrokeWords('เดินเซมาก /', 'บ้านหมุนรุนแรง') },
        { id: 'stroke_rf_neck_stiffness', title: wrapStrokeWords('คอแข็งเกร็ง /', 'ก้มคอไม่ลง') }
      ], { kind: 'checkbox', onchange: 'handleStrokeRfItemChange(this)' })}
    </div>
  </div>

  <!-- CARD 5 (DYNAMIC <= 4.5 ชม.): คัดกรองความปลอดภัยการใช้ยาสลายลิ่มเลือด -->
  <div id="stroke_fibrinolytic_contra_section" class="hidden bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4 transition-all">
    <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
      <div class="bg-amber-100 text-amber-800 p-2 rounded-xl"><i data-lucide="shield-check" class="w-5 h-5"></i></div>
      <div>
        <h2 class="text-base font-bold text-slate-900">5. คัดกรองความปลอดภัยการใช้ยาสลายลิ่มเลือด</h2>
        <p class="text-xs text-slate-500">แบบคัดกรองประวัติเพื่อความปลอดภัย (เปิดอัตโนมัติเมื่ออาการอยู่ในช่วงไม่เกิน 4.5 ชั่วโมง)</p>
      </div>
    </div>

    <div class="bg-amber-50/80 border border-amber-300 rounded-xl p-4 text-xs text-amber-900 flex items-start space-x-3">
      <i data-lucide="alert-circle" class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"></i>
      <div class="leading-relaxed">
        <p class="font-medium text-slate-800">“เนื่องจากอาการของท่านอยู่ในช่วงเวลาเร่งด่วนไม่เกิน 4.5 ชั่วโมง ท่านอาจมีโอกาสได้รับยาสลายลิ่มเลือดทางหลอดเลือดดำ โปรดเลือกประวัติที่มีอยู่จริงอย่างระมัดระวัง”</p>
        <p id="stroke_auto_detected_ci_notice" class="hidden mt-1.5 text-[11px] font-semibold text-amber-800"></p>
      </div>
    </div>

    <div>
      ${renderStrokeSysHeader({
        icon: 'shield-check', iconBg: 'bg-teal-100', iconColor: 'text-teal-700',
        title: 'ประวัติเสี่ยงหรือข้อควรระวังก่อนให้ยา (เลือกได้หลายข้อ)',
        noneId: 'stroke_ci_none', noneLabel: 'ไม่มีประวัติข้างต้น', noneOnchange: 'handleStrokeCiNoneChange(this.checked)'
      })}
      ${renderStrokeGrid('grid-cols-1 sm:grid-cols-2', [
        { id: 'stroke_ci_prior_ich', title: wrapStrokeWords('เคยมีเลือดออกในสมอง', 'มาก่อน') },
        { id: 'stroke_ci_brain_lesion', title: wrapStrokeWords('เคยพบเนื้องอกในสมอง /', 'เส้นเลือดสมองโป่งพอง') },
        { id: 'stroke_ci_cns_surgery_trauma_3m', title: wrapStrokeWords('ผ่าตัดสมอง-สันหลัง /', 'เจ็บศีรษะรุนแรงใน 3 เดือน') },
        { id: 'stroke_ci_ischemic_stroke_3m', title: wrapStrokeWords('เส้นเลือดสมองตีบ', 'ภายใน 3 เดือน') },
        { id: 'stroke_ci_active_bleeding', title: wrapStrokeWords('กำลังมีเลือดออกภายใน', '(อาเจียน/ถ่ายเป็นเลือด)') },
        { id: 'stroke_ci_gi_bleed_malignancy_21d', title: wrapStrokeWords('เลือดออกทางเดินอาหารใน 21 วัน /', 'มะเร็งทางเดินอาหาร') },
        { id: 'stroke_ci_anticoagulant', title: wrapStrokeWords('รับประทานหรือฉีด', 'ยาละลายลิ่มเลือดใน 24–48 ชม.'), desc: 'เช่น Warfarin, DOAC (Xarelto/Eliquis/Pradaxa) หรือยาฉีดใต้ผิวหนัง' },
        { id: 'stroke_ci_major_surgery_trauma_14d', title: wrapStrokeWords('ผ่าตัดใหญ่ / บาดเจ็บรุนแรง', 'ภายใน 14 วัน') },
        { id: 'stroke_ci_recent_mi_3m', title: wrapStrokeWords('กล้ามเนื้อหัวใจตายเฉียบพลัน', 'ภายใน 3 เดือน') },
        { id: 'stroke_ci_arterial_puncture_7d', title: wrapStrokeWords('ถูกเจาะหลอดเลือดแดงใหญ่', 'กดไม่ได้ภายใน 7 วัน') }
      ], { kind: 'checkbox', onchange: 'handleStrokeCiItemChange(this)' })}
    </div>

    <div id="strokeFemaleSection" class="hidden pt-3 border-t border-slate-100 space-y-2">
      <div class="flex items-center space-x-2">
        <span class="px-2 py-0.5 text-[10px] font-bold bg-pink-100 text-pink-700 rounded-md">เฉพาะสตรี</span>
        <span class="text-xs font-bold text-slate-700">ประวัติการตั้งครรภ์ปัจจุบัน:</span>
      </div>
      ${renderStrokeCard({ kind: 'checkbox', id: 'stroke_ci_pregnancy', title: wrapStrokeWords('กำลังตั้งครรภ์'), onchange: 'handleStrokeCiItemChange(this)' })}
    </div>
  </div>

  <!-- CARD UNIVERSAL: อาการอื่นๆ เพิ่มเติม -->
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100">
      <div class="bg-slate-100 text-slate-600 p-2 rounded-xl"><i data-lucide="message-square-plus" class="w-5 h-5"></i></div>
      <div>
        <h2 class="text-base font-bold text-slate-900">อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2>
        <p class="text-xs text-slate-500">ระบุอาการอื่นๆ ที่ต้องการแจ้งแพทย์เพิ่มเติม (ถ้ามี)</p>
      </div>
    </div>
    <textarea id="stroke_other_free" rows="2" placeholder="พิมพ์ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"></textarea>
  </div>
</div>`;

// --- Module Registration ---
registerCcModule({
  id: 'stroke_deficit',
  recordCc: 'stroke_deficit',
  titleTh: 'ปากเบี้ยว อ่อนแรง ชา ข้างใดข้างหนึ่ง พูดไม่ชัด',
  titleEn: 'Acute Stroke / Focal Neurological Deficit',
  sectionDomId: 'strokeQuestionnaireSection',
  doctorCcBadgeHtml: '<i data-lucide="brain" class="w-3 h-3 mr-1"></i> CC: ปากเบี้ยว อ่อนแรง ชา ข้างใดข้างหนึ่ง พูดไม่ชัด (Acute Stroke)',
  dateFields: ['strokeExactDate', 'strokeLsnDate', 'strokeDiscoveryDate'],
  timeFields: ['strokeExactTime', 'strokeLsnTime', 'strokeDiscoveryTime'],
  branchIds: [
    'stroke_exact_time_wrap', 'stroke_lsn_time_wrap', 'stroke_transient_duration_wrap',
    'stroke_hemi_side_wrap', 'stroke_arm_side_wrap', 'stroke_leg_side_wrap',
    'stroke_weakness_severity_wrap', 'stroke_numbness_side_wrap', 'stroke_face_detail_wrap',
    'stroke_fibrinolytic_contra_section', 'stroke_auto_detected_ci_notice', 'strokeFemaleSection'
  ],
  formHtml: STROKE_FORM_HTML,

  algorithm: {
    id: 'stroke_deficit',
    titleTh: 'ปากเบี้ยว อ่อนแรง ชา ข้างใดข้างหนึ่ง พูดไม่ชัด',
    titleEn: 'Focal Neurological Deficit / Hemiparesis / Dysarthria',
    version: '3.0.0',
    triageLevelRules: [
      { level: 1, criteria: 'Stroke Fast Track Candidate <= 4.5h, ICH/SAH suspected, Altered mental status, Acute Aortic Dissection / ALI mimic' },
      { level: 2, criteria: 'Focal neuro deficit > 4.5h, Posterior circulation / Brainstem signs, High-risk TIA' },
      { level: 3, criteria: 'Isolated peripheral Bell’s Palsy with forehead involvement and intact neuro exam' }
    ]
  },

  onTitleChange(arg) {
    syncStrokeFemaleSection(arg);
  },
  onSelectForm({ editingPatientId } = {}) {
    syncStrokeFemaleSection(document.getElementById('patientTitleSelect')?.value || '');
    if (!editingPatientId) checkStrokeFibrinolyticTrigger();
  },
  onActivate(patient) {
    if (patient && (patient.gender === 'หญิง' || patient.gender === 'ชาย')) {
      syncStrokeFemaleSection(patient.gender === 'หญิง');
    } else {
      syncStrokeFemaleSection();
    }
    checkStrokeFibrinolyticTrigger();
  },
  resetForm() {
    const sec = document.getElementById(this.sectionDomId);
    if (sec && typeof sec.querySelectorAll === 'function') {
      sec.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(el => { el.checked = false; });
      sec.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach(el => { el.value = ''; });
    }
    const durUnit = document.getElementById('strokeDurationUnit');
    if (durUnit) durUnit.value = 'hours';
    const trUnit = document.getElementById('strokeTransientUnit');
    if (trUnit) trUnit.value = 'minutes';
    this.branchIds.forEach(id => toggleBranch(id, false));
    syncStrokeFemaleSection(false);
  },

  seedPatients: [
    makeStrokeSeed({
      id: 'case-081', queue_number: 'A-081', hn: '6709102', name: 'นายสมศักดิ์ วงศ์สว่าง', age: 64, gender: 'ชาย',
      timestamp: '2026-10-26T02:26:26.424Z', durationVal: 1, durationUnit: 'hours',
      strokeOnsetContext: 'known_exact', strokeExactDate: '20/10/2026', strokeExactTime: '09:00',
      strokeProgression: 'sudden_maximal', stroke_weakness_hemi: true, strokeHemiSide: 'left', strokeWeaknessSeverity: 'complete_plegia',
      stroke_numbness_hemi: true, strokeNumbnessLocs: ['face', 'arm', 'leg', 'hemi'], strokeNumbnessSide: 'left',
      stroke_face_droop: true, strokeFaceSide: 'left', strokeFaceUpperPattern: 'forehead_spared',
      stroke_speech_dysarthria: true, stroke_bulbar_vision_none: true, stroke_rf_none: true, stroke_ci_none: true,
      underlying: ['ความดันสูง (HT)', 'เบาหวาน (DM)', 'ไขมันในเลือดสูง (DLP)'],
      currentMeds: 'Enalapril 5 mg 1 tab po od, Metformin 500 mg 1 tab po bid, Atorvastatin 20 mg 1 tab po hs',
      doctor_notes: {
        additional_hpi: '1 ชั่วโมงก่อน ขณะนั่งรับประทานอาหารเช้ากับครอบครัว จู่ๆ ยกตะเกียบไม่ขึ้น แขนและขาซ้ายอ่อนแรงยกไม่ขึ้นทันที มุมปากซ้ายตก พูดไม่ชัดแต่ยังรู้สึกตัวดีและทำตามคำสั่งได้ ปฏิเสธปวดศีรษะ ไม่ชัก ไม่มีประวัติเลือดออกผิดปกติ',
        physical_exam: 'BT 36.8 C, PR 84/min regular, RR 18/min, BP 168/94 mmHg, SpO2 98%, Bedside DTX 138 mg/dL. Neuro: E4V5M6, left facial palsy (UMN type, forehead spared), dysarthria, motor right grade V, left arm grade 0, left leg grade I, left hemisensory decrease. NIHSS = 11.',
        preliminary_dx: 'Acute Right MCA Ischemic Stroke (Onset 1 hr - Stroke Fast Track Candidate for IV rt-PA / TNK)',
        plan: 'Activate Stroke Fast Track immediately! STAT Non-contrast CT Brain + CTA Brain & Neck. Prepare IV Alteplase (rt-PA) 0.9 mg/kg once ICH excluded.'
      }
    }),
    makeStrokeSeed({
      id: 'case-082', queue_number: 'A-082', hn: '6704855', name: 'นางวรรณา จิตต์แจ่มใส', age: 58, gender: 'หญิง',
      timestamp: '2026-10-26T02:11:26.424Z', durationVal: 2, durationUnit: 'hours',
      strokeOnsetContext: 'wake_up_or_unknown', strokeLsnDate: '20/10/2026', strokeLsnTime: '06:00',
      strokeDiscoveryDate: '20/10/2026', strokeDiscoveryTime: '08:00', strokeProgression: 'gradual_worse',
      stroke_weakness_hemi: true, strokeHemiSide: 'right', strokeWeaknessSeverity: 'complete_plegia',
      stroke_numbness_hemi: true, strokeNumbnessLocs: ['face', 'arm', 'leg', 'hemi'], strokeNumbnessSide: 'right',
      stroke_face_droop: true, strokeFaceSide: 'right', strokeFaceUpperPattern: 'forehead_spared',
      stroke_speech_dysarthria: true, stroke_speech_expressive_aphasia: true, stroke_has_dysphagia: true,
      stroke_rf_altered_mental: true, stroke_rf_severe_headache: true, stroke_rf_projectile_vomiting: true,
      stroke_ci_anticoagulant: true, underlying: ['ความดันสูง (HT)', 'โรคหัวใจเต้นผิดจังหวะ (AF)'],
      currentMeds: 'Warfarin 3 mg 1 tab po od hs, Amlodipine 10 mg 1 tab po od',
      doctor_notes: {
        additional_hpi: 'ญาติเห็นผู้ป่วยปกติครั้งสุดท้าย (LSN) เวลา 06:00 น. ต่อมาเวลา 08:00 น. พบว่าผู้ป่วยบ่นปวดศีรษะรุนแรงมาก อาเจียนพุ่ง 2 ครั้ง แขนและขาขวาอ่อนแรงยกไม่ขึ้น นึกคำพูดไม่ออก และเริ่มซึมลง มีโรคประจำตัว AF รับประทานยา Warfarin เป็นประจำ',
        physical_exam: 'BT 37.0 C, PR 98/min irregular, RR 22/min, BP 212/114 mmHg, SpO2 96%, DTX 118 mg/dL. Neuro: Drowsy, E3V2M5 (GCS 10), right facial palsy (UMN), right hemiplegia grade 0, Babinski dorsiflexion on right.',
        preliminary_dx: 'Suspected Acute Left Putaminal/Thalamic Intracerebral Hemorrhage (Warfarin-associated ICH)',
        plan: 'DO NOT give Fibrinolytics! STAT Non-contrast CT Brain. Hold Warfarin; prepare Vitamin K 10 mg IV + 4-factor PCC. Urgent Neurosurgery consult.'
      }
    }),
    makeStrokeSeed({
      id: 'case-083', queue_number: 'A-083', hn: '6707931', name: 'นายธีรเดช สุขเกษม', age: 42, gender: 'ชาย',
      timestamp: '2026-10-26T01:56:26.424Z', durationVal: 6, durationUnit: 'hours',
      strokeOnsetContext: 'wake_up_or_unknown', strokeLsnDate: '19/10/2026', strokeLsnTime: '23:00',
      strokeDiscoveryDate: '20/10/2026', strokeDiscoveryTime: '05:00', strokeProgression: 'sudden_maximal',
      stroke_face_droop: true, strokeFaceSide: 'right', strokeFaceUpperPattern: 'forehead_involved',
      stroke_sensory_pain_none: true, stroke_speech_none: true, stroke_bulbar_vision_none: true, stroke_rf_none: true,
      hospRecordStatus: 'self', underlying: ['ปฏิเสธ'], currentMeds: 'ไม่มี',
      doctor_notes: {
        additional_hpi: 'ตื่นเช้ามาตอน 05:00 น. สังเกตว่าแปรงฟันแล้วน้ำไหลออกทางมุมปากขวา ยิ้มแล้วมุมปากขวาไม่ยก ตาขวาหลับไม่สนิทและยักคิ้วขวาไม่ขึ้น ไม่มีแขนขาอ่อนแรง ไม่มีชา เดินและพูดคุยได้ชัดเจนปกติ',
        physical_exam: 'BT 36.6 C, PR 74/min, RR 16/min, BP 124/78 mmHg. Neuro: Alert, LMN right facial nerve palsy (incomplete right eye closure with Bell phenomenon). Motor grade V all 4 limbs.',
        preliminary_dx: 'Acute Right Bell Palsy (Idiopathic Peripheral Facial Nerve Palsy)',
        plan: 'Prednisolone 60 mg/day po for 5 days then taper. Artificial tears + night eye ointment/patch protection.'
      }
    }),
    makeStrokeSeed({
      id: 'case-084', queue_number: 'A-084', hn: '6708412', name: 'น.ส.กมลพร สุขใจ', age: 56, gender: 'หญิง',
      timestamp: '2026-10-26T03:00:00.000Z', durationVal: 1, durationUnit: 'hours',
      strokeOnsetContext: 'transient_resolved', strokeTransientVal: 15, strokeTransientUnit: 'minutes',
      strokeProgression: 'fluctuating', stroke_weakness_arm_only: true, strokeArmSide: 'right', strokeWeaknessSeverity: 'mild',
      stroke_speech_dysarthria: true, stroke_sensory_pain_none: true, stroke_bulbar_vision_none: true, stroke_rf_none: true,
      hospRecordStatus: 'complete', underlying: ['ไขมันในเลือดสูง (DLP)'], currentMeds: 'Simvastatin 20 mg 1 tab po hs',
      doctor_notes: { additional_hpi: 'มีอาการแขนขวาอ่อนแรงและพูดไม่ชัดนาน 15 นาที แล้วหายกลับมาเป็นปกติก่อนมาถึงห้องฉุกเฉิน', physical_exam: '', preliminary_dx: 'Suspected High-Risk TIA', plan: 'STAT CT Brain + ABCD2 risk score + EKG + DAPT workup' }
    })
  ],

  hydrateForm(patient) {
    if (!patient) return;
    this.resetForm();

    const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = v !== undefined && v !== null ? v : ''; };
    const setChk = (id, v) => { const el = document.getElementById(id); if (el) el.checked = Boolean(v); };

    setVal('strokeDurationVal', patient.durationVal);
    if (patient.durationUnit) setVal('strokeDurationUnit', patient.durationUnit);

    setRadioValue('strokeOnsetContext', patient.strokeOnsetContext);
    handleStrokeOnsetContextChange();
    if (patient.strokeOnsetContext === 'known_exact') {
      setVal('strokeExactDate', patient.strokeExactDate);
      setVal('strokeExactTime', patient.strokeExactTime);
    } else if (patient.strokeOnsetContext === 'wake_up_or_unknown') {
      setVal('strokeLsnDate', patient.strokeLsnDate);
      setVal('strokeLsnTime', patient.strokeLsnTime);
      setVal('strokeDiscoveryDate', patient.strokeDiscoveryDate);
      setVal('strokeDiscoveryTime', patient.strokeDiscoveryTime);
    } else if (patient.strokeOnsetContext === 'transient_resolved') {
      setVal('strokeTransientVal', patient.strokeTransientVal);
      if (patient.strokeTransientUnit) setVal('strokeTransientUnit', patient.strokeTransientUnit);
    }
    setRadioValue('strokeProgression', patient.strokeProgression);

    setChk('stroke_motor_none', patient.stroke_motor_none);
    setChk('stroke_weakness_hemi', patient.stroke_weakness_hemi);
    setChk('stroke_weakness_arm_only', patient.stroke_weakness_arm_only);
    setChk('stroke_weakness_leg_only', patient.stroke_weakness_leg_only);
    setChk('stroke_weakness_both_legs', patient.stroke_weakness_both_legs);
    handleStrokeWeaknessChange();
    if (patient.stroke_weakness_hemi && patient.strokeHemiSide && patient.strokeHemiSide !== 'none') setRadioValue('strokeHemiSide', patient.strokeHemiSide);
    if (patient.stroke_weakness_arm_only && patient.strokeArmSide && patient.strokeArmSide !== 'none') setRadioValue('strokeArmSide', patient.strokeArmSide);
    if (patient.stroke_weakness_leg_only && patient.strokeLegSide && patient.strokeLegSide !== 'none') setRadioValue('strokeLegSide', patient.strokeLegSide);
    if (patient.strokeWeaknessSeverity && patient.strokeWeaknessSeverity !== 'none') setRadioValue('strokeWeaknessSeverity', patient.strokeWeaknessSeverity);

    setChk('stroke_face_droop', patient.stroke_face_droop);
    handleStrokeFaceChange();
    if (patient.stroke_face_droop) {
      if (patient.strokeFaceSide && patient.strokeFaceSide !== 'none') setRadioValue('strokeFaceSide', patient.strokeFaceSide);
      if (patient.strokeFaceUpperPattern && patient.strokeFaceUpperPattern !== 'none') setRadioValue('strokeFaceUpperPattern', patient.strokeFaceUpperPattern);
    }

    setChk('stroke_sensory_pain_none', patient.stroke_sensory_pain_none);
    setChk('stroke_numbness_hemi', patient.stroke_numbness_hemi);
    handleStrokeNumbnessChange();
    if (patient.stroke_numbness_hemi) {
      if (Array.isArray(patient.strokeNumbnessLocs)) setMultiCheckboxes('strokeNumbnessLoc', patient.strokeNumbnessLocs);
      if (patient.strokeNumbnessSide && patient.strokeNumbnessSide !== 'none') setRadioValue('strokeNumbnessSide', patient.strokeNumbnessSide);
    }
    setChk('stroke_pain_neck_radiating', patient.stroke_pain_neck_radiating || patient.stroke_pain_neck_back_radiating);
    setChk('stroke_pain_back_radiating', patient.stroke_pain_back_radiating || patient.stroke_pain_neck_back_radiating);
    setChk('stroke_pain_limb_cold_pale', patient.stroke_pain_limb_cold_pale);
    setChk('stroke_pain_chest_back_tearing', patient.stroke_pain_chest_back_tearing);

    setChk('stroke_speech_none', patient.stroke_speech_none);
    STROKE_SPEECH_IDS.forEach(id => setChk(id, patient[id]));
    setChk('stroke_bulbar_vision_none', patient.stroke_bulbar_vision_none);
    STROKE_BULBAR_VISION_IDS.forEach(id => setChk(id, patient[id]));
    setChk('stroke_rf_none', patient.stroke_rf_none);
    STROKE_RF_IDS.forEach(id => setChk(id, patient[id]));

    const isFemale = patient.gender === 'หญิง' ? true : (patient.gender === 'ชาย' ? false : isStrokeFemale(patient.name || ''));
    syncStrokeFemaleSection(isFemale);

    setChk('stroke_ci_none', patient.stroke_ci_none);
    STROKE_CI_IDS.forEach(id => setChk(id, id === 'stroke_ci_pregnancy' ? (isFemale && patient[id]) : patient[id]));
    setVal('stroke_other_free', patient.otherSymptomsFree);
    checkStrokeFibrinolyticTrigger();
  },

  collectIntake(ctx = {}) {
    const {
      recordId, queueNumber, randomHn, patientName, patientAge, gender,
      recordStatus, hospRecordStatus, underlying, drugAllergy, currentMeds,
      preservedDoctorNotes, otherSymptomsFree
    } = ctx;

    const _rawDur = parseFloat(document.getElementById('strokeDurationVal')?.value);
    const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
    const durationUnit = document.getElementById('strokeDurationUnit')?.value || 'hours';
    const strokeOnsetContext = document.querySelector('input[name="strokeOnsetContext"]:checked')?.value || 'unspecified';

    const strokeExactDate = strokeOnsetContext === 'known_exact' ? (document.getElementById('strokeExactDate')?.value || '') : '';
    const strokeExactTime = strokeOnsetContext === 'known_exact' ? (document.getElementById('strokeExactTime')?.value || '') : '';
    const strokeLsnDate = strokeOnsetContext === 'wake_up_or_unknown' ? (document.getElementById('strokeLsnDate')?.value || '') : '';
    const strokeLsnTime = strokeOnsetContext === 'wake_up_or_unknown' ? (document.getElementById('strokeLsnTime')?.value || '') : '';
    const strokeDiscoveryDate = strokeOnsetContext === 'wake_up_or_unknown' ? (document.getElementById('strokeDiscoveryDate')?.value || '') : '';
    const strokeDiscoveryTime = strokeOnsetContext === 'wake_up_or_unknown' ? (document.getElementById('strokeDiscoveryTime')?.value || '') : '';
    const strokeTransientVal = strokeOnsetContext === 'transient_resolved' ? (parseFloat(document.getElementById('strokeTransientVal')?.value) || null) : null;
    const strokeTransientUnit = strokeOnsetContext === 'transient_resolved' ? (document.getElementById('strokeTransientUnit')?.value || 'minutes') : '';
    const strokeProgression = document.querySelector('input[name="strokeProgression"]:checked')?.value || 'unspecified';

    const chk = id => Boolean(document.getElementById(id)?.checked);
    const rad = name => document.querySelector(`input[name="${name}"]:checked`)?.value || 'none';

    const stroke_motor_none = chk('stroke_motor_none');
    const stroke_weakness_hemi = !stroke_motor_none && chk('stroke_weakness_hemi');
    const strokeHemiSide = stroke_weakness_hemi ? rad('strokeHemiSide') : 'none';
    const stroke_weakness_arm_only = !stroke_motor_none && chk('stroke_weakness_arm_only');
    const strokeArmSide = stroke_weakness_arm_only ? rad('strokeArmSide') : 'none';
    const stroke_weakness_leg_only = !stroke_motor_none && chk('stroke_weakness_leg_only');
    const strokeLegSide = stroke_weakness_leg_only ? rad('strokeLegSide') : 'none';
    const stroke_weakness_both_legs = !stroke_motor_none && chk('stroke_weakness_both_legs');
    const hasAnyLimbWeakness = stroke_weakness_hemi || stroke_weakness_arm_only || stroke_weakness_leg_only || stroke_weakness_both_legs;
    const strokeWeaknessSeverity = hasAnyLimbWeakness ? rad('strokeWeaknessSeverity') : 'none';
    const stroke_face_droop = !stroke_motor_none && chk('stroke_face_droop');
    const strokeFaceSide = stroke_face_droop ? rad('strokeFaceSide') : 'none';
    const strokeFaceUpperPattern = stroke_face_droop ? rad('strokeFaceUpperPattern') : 'none';

    const stroke_sensory_pain_none = chk('stroke_sensory_pain_none');
    const stroke_numbness_hemi = !stroke_sensory_pain_none && chk('stroke_numbness_hemi');
    const strokeNumbnessLocs = stroke_numbness_hemi ? Array.from(document.querySelectorAll('input[name="strokeNumbnessLoc"]:checked')).map(cb => cb.value) : [];
    const strokeNumbnessSide = stroke_numbness_hemi ? rad('strokeNumbnessSide') : 'none';
    const stroke_pain_neck_radiating = !stroke_sensory_pain_none && chk('stroke_pain_neck_radiating');
    const stroke_pain_back_radiating = !stroke_sensory_pain_none && chk('stroke_pain_back_radiating');
    const stroke_pain_limb_cold_pale = !stroke_sensory_pain_none && chk('stroke_pain_limb_cold_pale');
    const stroke_pain_chest_back_tearing = !stroke_sensory_pain_none && chk('stroke_pain_chest_back_tearing');

    const stroke_speech_none = chk('stroke_speech_none');
    const stroke_speech_dysarthria = !stroke_speech_none && chk('stroke_speech_dysarthria');
    const stroke_speech_expressive_aphasia = !stroke_speech_none && chk('stroke_speech_expressive_aphasia');
    const stroke_speech_receptive_aphasia = !stroke_speech_none && chk('stroke_speech_receptive_aphasia');

    const stroke_bulbar_vision_none = chk('stroke_bulbar_vision_none');
    const stroke_has_dysphagia = !stroke_bulbar_vision_none && chk('stroke_has_dysphagia');
    const stroke_vision_monocular = !stroke_bulbar_vision_none && chk('stroke_vision_monocular');
    const stroke_vision_hemianopia = !stroke_bulbar_vision_none && chk('stroke_vision_hemianopia');
    const stroke_vision_diplopia = !stroke_bulbar_vision_none && chk('stroke_vision_diplopia');

    const stroke_rf_none = chk('stroke_rf_none');
    const stroke_rf_altered_mental = !stroke_rf_none && chk('stroke_rf_altered_mental');
    const stroke_rf_severe_headache = !stroke_rf_none && chk('stroke_rf_severe_headache');
    const stroke_rf_projectile_vomiting = !stroke_rf_none && chk('stroke_rf_projectile_vomiting');
    const stroke_rf_seizure = !stroke_rf_none && chk('stroke_rf_seizure');
    const stroke_rf_ataxia_dizziness = !stroke_rf_none && chk('stroke_rf_ataxia_dizziness');
    const stroke_rf_neck_stiffness = !stroke_rf_none && chk('stroke_rf_neck_stiffness');

    const stroke_ci_none = chk('stroke_ci_none');
    const isFem = gender === 'หญิง';
    const safeHospStatus = hospRecordStatus || 'unspecified';
    const udArr = Array.isArray(underlying) ? underlying : [];

    return {
      id: recordId || `case-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      queue_number: queueNumber || 'A-000', hn: randomHn || '6700000',
      name: patientName || 'ผู้ป่วย (ไม่ระบุชื่อ)', age: patientAge !== undefined ? patientAge : 'ไม่ระบุ', gender: gender || 'ไม่ระบุ',
      chief_complaint: 'stroke_deficit', chief_complaint_title: 'ปากเบี้ยว อ่อนแรง ชา ข้างใดข้างหนึ่ง พูดไม่ชัด',
      status: recordStatus || 'waiting', timestamp: new Date().toISOString(),
      durationVal, durationUnit, strokeOnsetContext, strokeExactDate, strokeExactTime,
      strokeLsnDate, strokeLsnTime, strokeDiscoveryDate, strokeDiscoveryTime, strokeTransientVal, strokeTransientUnit, strokeProgression,
      stroke_motor_none, stroke_weakness_hemi, strokeHemiSide, stroke_weakness_arm_only, strokeArmSide,
      stroke_weakness_leg_only, strokeLegSide, stroke_weakness_both_legs, strokeWeaknessSeverity,
      stroke_face_droop, strokeFaceSide, strokeFaceUpperPattern,
      stroke_sensory_pain_none, stroke_numbness_hemi, strokeNumbnessLocs, strokeNumbnessSide,
      stroke_pain_neck_radiating, stroke_pain_back_radiating, stroke_pain_limb_cold_pale, stroke_pain_chest_back_tearing,
      stroke_speech_none, stroke_speech_dysarthria, stroke_speech_expressive_aphasia, stroke_speech_receptive_aphasia,
      stroke_bulbar_vision_none, stroke_has_dysphagia, stroke_vision_monocular, stroke_vision_hemianopia, stroke_vision_diplopia,
      stroke_rf_none, stroke_rf_altered_mental, stroke_rf_severe_headache, stroke_rf_projectile_vomiting, stroke_rf_seizure, stroke_rf_ataxia_dizziness, stroke_rf_neck_stiffness,
      stroke_ci_none,
      stroke_ci_prior_ich: !stroke_ci_none && chk('stroke_ci_prior_ich'),
      stroke_ci_brain_lesion: !stroke_ci_none && chk('stroke_ci_brain_lesion'),
      stroke_ci_cns_surgery_trauma_3m: !stroke_ci_none && chk('stroke_ci_cns_surgery_trauma_3m'),
      stroke_ci_ischemic_stroke_3m: !stroke_ci_none && chk('stroke_ci_ischemic_stroke_3m'),
      stroke_ci_active_bleeding: !stroke_ci_none && chk('stroke_ci_active_bleeding'),
      stroke_ci_gi_bleed_malignancy_21d: !stroke_ci_none && chk('stroke_ci_gi_bleed_malignancy_21d'),
      stroke_ci_anticoagulant: !stroke_ci_none && chk('stroke_ci_anticoagulant'),
      stroke_ci_major_surgery_trauma_14d: !stroke_ci_none && chk('stroke_ci_major_surgery_trauma_14d'),
      stroke_ci_recent_mi_3m: !stroke_ci_none && chk('stroke_ci_recent_mi_3m'),
      stroke_ci_arterial_puncture_7d: !stroke_ci_none && chk('stroke_ci_arterial_puncture_7d'),
      stroke_ci_pregnancy: !stroke_ci_none && isFem && chk('stroke_ci_pregnancy'),
      otherSymptomsFree: document.getElementById('stroke_other_free')?.value?.trim() || otherSymptomsFree || '',
      hospRecordStatus: safeHospStatus,
      underlying: udArr.length > 0 ? udArr : ((safeHospStatus === 'self' || safeHospStatus === 'additional') ? ['ปฏิเสธ'] : []),
      drugAllergy: drugAllergy || 'ไม่ได้ระบุ', currentMeds: currentMeds || 'ไม่ได้ระบุ',
      doctor_notes: preservedDoctorNotes || { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' }
    };
  },

  isRedFlag(p) {
    const isIsolatedPeripheralFacialPalsy = Boolean(
      !p.stroke_weakness_hemi && !p.stroke_weakness_arm_only && !p.stroke_weakness_leg_only && !p.stroke_weakness_both_legs &&
      !p.stroke_numbness_hemi && !p.stroke_pain_limb_cold_pale && !p.stroke_pain_chest_back_tearing &&
      p.stroke_face_droop && p.strokeFaceUpperPattern === 'forehead_involved' &&
      !p.stroke_speech_dysarthria && !p.stroke_speech_expressive_aphasia && !p.stroke_speech_receptive_aphasia &&
      !p.stroke_has_dysphagia && !p.stroke_vision_monocular && !p.stroke_vision_hemianopia && !p.stroke_vision_diplopia &&
      !p.stroke_rf_altered_mental && !p.stroke_rf_severe_headache && !p.stroke_rf_projectile_vomiting &&
      !p.stroke_rf_seizure && !p.stroke_rf_ataxia_dizziness && !p.stroke_rf_neck_stiffness
    );
    if (isIsolatedPeripheralFacialPalsy) return false;
    return Boolean(
      p.stroke_weakness_hemi || p.stroke_weakness_arm_only || p.stroke_weakness_leg_only || p.stroke_weakness_both_legs ||
      p.stroke_numbness_hemi || p.stroke_pain_limb_cold_pale || p.stroke_pain_chest_back_tearing ||
      (p.stroke_face_droop && p.strokeFaceUpperPattern !== 'forehead_involved') ||
      p.stroke_speech_dysarthria || p.stroke_speech_expressive_aphasia || p.stroke_speech_receptive_aphasia ||
      p.stroke_has_dysphagia || p.stroke_vision_monocular || p.stroke_vision_hemianopia || p.stroke_vision_diplopia ||
      p.stroke_rf_altered_mental || p.stroke_rf_severe_headache || p.stroke_rf_projectile_vomiting ||
      p.stroke_rf_seizure || p.stroke_rf_ataxia_dizziness || p.stroke_rf_neck_stiffness ||
      p.strokeOnsetContext === 'transient_resolved'
    );
  },

  evaluateRedFlags(patient) {
    const redFlags = [];
    if (!patient) return redFlags;
    const within4_5h = isStrokePatientWithin4_5Hours(patient);
    const hasCentralMotorSpeechFace = Boolean(
      patient.stroke_weakness_hemi || patient.stroke_weakness_arm_only || patient.stroke_weakness_leg_only ||
      patient.stroke_speech_dysarthria || patient.stroke_speech_expressive_aphasia || patient.stroke_speech_receptive_aphasia ||
      (patient.stroke_face_droop && patient.strokeFaceUpperPattern !== 'forehead_involved') ||
      patient.stroke_vision_monocular || patient.stroke_vision_hemianopia || patient.stroke_vision_diplopia
    );

    if (within4_5h && hasCentralMotorSpeechFace && patient.strokeOnsetContext !== 'transient_resolved') {
      redFlags.push({
        key: 'stroke_fast_track_window',
        textTh: 'ผู้ป่วยอยู่ในเกณฑ์เวลา Golden Period ≤ 4.5 ชั่วโมง (Activate Stroke Fast Track / Code Stroke)',
        risk: 'ต้องส่งตรวจ STAT Non-contrast CT Brain ทันที (Door-to-CT < 25 นาที), เจาะ DTX ปลายนิ้ว, CBC, PT/INR, aPTT และประเมิน NIHSS เพื่อพิจารณาให้ยาละลายลิ่มเลือด (IV rt-PA / Tenecteplase) หรือ Mechanical Thrombectomy'
      });
    }
    if (patient.stroke_rf_severe_headache || patient.stroke_rf_projectile_vomiting || patient.stroke_rf_neck_stiffness || patient.stroke_ci_anticoagulant) {
      redFlags.push({
        key: 'suspected_ich_or_sah',
        textTh: 'ปวดศีรษะรุนแรงเฉียบพลัน / อาเจียนพุ่ง / คอแข็งเกร็ง / ทานยาต้านการแข็งตัวของเลือด (Suspected Hemorrhagic Stroke / ICH / SAH)',
        risk: 'เสี่ยงภาวะเลือดออกในสมอง (Intracranial Hemorrhage) หรือเลือดออกใต้เยื่อหุ้มสมอง (SAH) ห้ามให้ยาต้านเกล็ดเลือดหรือยาสลายลิ่มเลือดเด็ดขาดจนกว่าจะเห็นผล CT Brain และเตรียมยาลดความดันโลหิต/ยาต้านฤทธิ์ Anticoagulant'
      });
    }
    if (patient.stroke_rf_altered_mental) {
      redFlags.push({
        key: 'altered_mental_herniation',
        textTh: 'ซึมลง สับสน ปลุกตื่นยาก หรือหมดสติ (Altered Mental Status / Threatened Brain Herniation)',
        risk: 'เสี่ยงภาวะความดันในกะโหลกศีรษะสูงวิกฤต ก้านสมองถูกกดทับ หรือ Basilar Artery Occlusion ต้องประเมิน Airway (GCS ≤ 8 พิจารณาใส่ท่อช่วยหายใจ) ทันที'
      });
    }
    if (hasCentralMotorSpeechFace && patient.strokeOnsetContext !== 'transient_resolved') {
      redFlags.push({
        key: 'acute_focal_neuro_deficit',
        textTh: 'อาการทางระบบประสาทเฉพาะที่เฉียบพลัน: แขนขาอ่อนแรง / ปากเบี้ยวแบบ Central / พูดไม่ชัดหรือสับสนภาษา / การมองเห็นผิดปกติ (BE-FAST Positive)',
        risk: 'บ่งชี้รอยโรคหลอดเลือดสมองส่วนหน้าหรือส่วนหลัง (Anterior / Posterior Circulation Stroke) ประเมิน NIHSS และงดน้ำ-อาหาร (NPO) ป้องกันการสำลัก'
      });
    }
    if (patient.stroke_rf_ataxia_dizziness || patient.stroke_vision_diplopia || patient.stroke_has_dysphagia) {
      redFlags.push({
        key: 'posterior_circulation_brainstem_stroke',
        textTh: 'เดินเซทรงตัวไม่ได้ / เวียนศีรษะบ้านหมุน / เห็นภาพซ้อน / กลืนสำลัก (Suspected Posterior Circulation / Brainstem / Cerebellar Stroke)',
        risk: 'เสี่ยงภาวะหลอดเลือดสมองส่วนหลังหรือก้านสมองตีบ/แตก (Vertebrobasilar / PICA / AICA Stroke) ต้องเฝ้าระวังภาวะสมองน้อยบวมกดก้านสมองและการสำลักอุดกั้นทางเดินหายใจ'
      });
    }
    if (patient.stroke_pain_chest_back_tearing || patient.stroke_pain_limb_cold_pale || patient.stroke_weakness_both_legs || patient.stroke_pain_neck_radiating || patient.stroke_pain_back_radiating || patient.stroke_pain_neck_back_radiating) {
      redFlags.push({
        key: 'vascular_or_spinal_emergency_mimic',
        textTh: 'อาการปวดจำเพาะร่วมกับอ่อนแรง: เจ็บอก/ปวดท้องรุนแรงทะลุหลัง / ปวดขาซีดเย็น / ขาอ่อนแรง 2 ข้างหรือปวดร้าวต้นคอ-หลัง (Suspected Aortic Dissection / Acute Limb Ischemia / Spinal Cord Compression)',
        risk: 'ต้องตรวจคลำชีพจรส่วนปลายทั้ง 4 รยางค์ (4-extremity pulses & BP), ตรวจ Sensory level และตัดโรค Aortic Dissection ก่อนพิจารณาให้ยาสลายลิ่มเลือด'
      });
    }
    if (patient.stroke_rf_seizure) {
      redFlags.push({
        key: 'seizure_at_onset_todd_paralysis',
        textTh: 'มีอาการชักเกร็ง กระตุก หรือกัดลิ้นร่วมด้วย (Seizure at Onset / Suspected Todd’s Paralysis or Cortical Haemorrhage)',
        risk: 'ต้องแยกภาวะอ่อนแรงหลังชัก (Postictal Todd’s paralysis) ออกจาก Cortical Stroke หรือ Intracranial Hemorrhage และเป็นข้อควรระวังในการให้ IV Fibrinolysis'
      });
    }
    if (patient.strokeOnsetContext === 'transient_resolved') {
      redFlags.push({
        key: 'transient_ischemic_attack_high_risk',
        textTh: 'อาการทางระบบประสาทเป็นชั่วคราวแล้วทุเลาลงจนหายสนิท (Suspected High-Risk TIA)',
        risk: 'มีความเสี่ยงสูงที่จะเกิด Acute Ischemic Stroke ซ้ำภายใน 48 ชั่วโมง ต้องประเมิน ABCD2 Score, ตรวจ 12-lead EKG (หา AF), ส่ง CT/MRI Brain และพิจารณา Dual Antiplatelet Therapy เร่งด่วน'
      });
    }
    return redFlags;
  },

  updateOutputs(patient) {
    return updateStrokeOutputs(patient);
  }
});

if (typeof window !== 'undefined') {
  window.handleStrokeOnsetContextChange = handleStrokeOnsetContextChange;
  window.handleStrokeWeaknessChange = handleStrokeWeaknessChange;
  window.handleStrokeFaceChange = handleStrokeFaceChange;
  window.handleStrokeMotorNoneChange = handleStrokeMotorNoneChange;
  window.handleStrokeNumbnessChange = handleStrokeNumbnessChange;
  window.handleStrokeSensoryPainItemChange = handleStrokeSensoryPainItemChange;
  window.handleStrokeSensoryPainNoneChange = handleStrokeSensoryPainNoneChange;
  window.handleStrokeSpeechItemChange = handleStrokeSpeechItemChange;
  window.handleStrokeSpeechNoneChange = handleStrokeSpeechNoneChange;
  window.handleStrokeBulbarVisionItemChange = handleStrokeBulbarVisionItemChange;
  window.handleStrokeBulbarVisionNoneChange = handleStrokeBulbarVisionNoneChange;
  window.handleStrokeRfItemChange = handleStrokeRfItemChange;
  window.handleStrokeRfNoneChange = handleStrokeRfNoneChange;
  window.handleStrokeCiItemChange = handleStrokeCiItemChange;
  window.handleStrokeCiNoneChange = handleStrokeCiNoneChange;
  window.checkStrokeFibrinolyticTrigger = checkStrokeFibrinolyticTrigger;
}
