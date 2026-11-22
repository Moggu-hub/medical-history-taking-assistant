// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 21_neck_shoulder_pain.js
// อาการนำ: ปวดต้นคอ / บ่า / หลังช่วงบน (Neck, Shoulder & Upper Back Pain)
// รองรับ Zero Default Bias, Progressive Disclosure, Universal Date/Time,
// Rapid Note De-duplication, และ TDD Core Guard
// =========================================================================

// --- Pain Score Touch State Tracking ---
let neckpainPainScoreTouched = false;

function clearNeckpainPainScore() {
  neckpainPainScoreTouched = false;
  const slider = document.getElementById('neckpainPainScore');
  if (slider) slider.value = 0;
  const emojiEl = document.getElementById('neckpainPainScoreEmoji');
  const textEl = document.getElementById('neckpainPainScoreText');
  const badgeEl = document.getElementById('neckpainPainScoreBadge');
  const clearBtn = document.getElementById('neckpainPainScoreClearBtn');
  if (emojiEl) emojiEl.textContent = '⚪';
  if (textEl) textEl.textContent = 'ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)';
  if (badgeEl) badgeEl.className = 'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all';
  if (clearBtn) clearBtn.classList.add('hidden');
}

function handleNeckpainPainScoreChange(val) {
  neckpainPainScoreTouched = true;
  const num = parseInt(val, 10) || 0;
  const slider = document.getElementById('neckpainPainScore');
  if (slider && String(slider.value) !== String(num)) slider.value = num;
  const emojiEl = document.getElementById('neckpainPainScoreEmoji');
  const textEl = document.getElementById('neckpainPainScoreText');
  const badgeEl = document.getElementById('neckpainPainScoreBadge');
  const clearBtn = document.getElementById('neckpainPainScoreClearBtn');
  if (clearBtn) clearBtn.classList.remove('hidden');
  if (!emojiEl || !textEl || !badgeEl) return;

  let emoji = '😐', label = 'ปวดปานกลาง', badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
  if (num === 0) { emoji = '😊'; label = 'สบายดี (ไม่ปวดเลย)'; badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300'; }
  else if (num <= 3) { emoji = '🙂'; label = 'ปวดเล็กน้อย (ทนได้)'; badgeClass = 'bg-lime-100 text-lime-800 border-lime-300'; }
  else if (num <= 6) { emoji = '😐'; label = 'ปวดปานกลาง (รบกวนสมาธิ)'; badgeClass = 'bg-amber-100 text-amber-800 border-amber-300'; }
  else if (num <= 9) { emoji = '😣'; label = 'ปวดมาก (ทนแทบไม่ไหว)'; badgeClass = 'bg-rose-100 text-rose-800 border-rose-300'; }
  else { emoji = '😭'; label = 'เจ็บปวดรุนแรงที่สุดในชีวิต'; badgeClass = 'bg-red-200 text-red-900 border-red-400 animate-pulse'; }

  emojiEl.textContent = emoji;
  textEl.textContent = `${num} / 10 (${label})`;
  badgeEl.className = `inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border transition ${badgeClass}`;
}

function setNeckpainPainScore(score) {
  neckpainPainScoreTouched = true;
  const slider = document.getElementById('neckpainPainScore');
  if (slider) slider.value = score;
  handleNeckpainPainScoreChange(score);
}
if (typeof window !== 'undefined') { window.clearNeckpainPainScore = clearNeckpainPainScore; window.handleNeckpainPainScoreChange = handleNeckpainPainScoreChange; window.setNeckpainPainScore = setNeckpainPainScore; }

// --- Toggle UI Helper Functions ---
function syncNeckpainSideWrap() {
  const wrap = document.getElementById('neckSideBranchesWrap');
  if (!wrap) return;
  const anyVisible = ['neckPostSideGroup', 'neckLatSideGroup', 'neckTrapSideGroup', 'neckScapSideGroup'].some(id => {
    const g = document.getElementById(id);
    return g && !g.classList.contains('hidden');
  });
  wrap.classList.toggle('hidden', !anyVisible);
}

function toggleNeckpainSideGroup(groupId, isVisible) {
  const el = document.getElementById(groupId);
  if (el) {
    el.classList.toggle('hidden', !isVisible);
    if (!isVisible) {
      el.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    }
  }
  syncNeckpainSideWrap();
}

function toggleNeckpainRadiationSub(isVisible) {
  const el = document.getElementById('neckpainRadiationSub');
  if (el) {
    el.classList.toggle('hidden', !isVisible);
    if (!isVisible) {
      el.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    }
  }
}

const NECK_WARN_GROUPS = {
  arm: ['hand_clumsy_weak', 'arm_weakness_abduction', 'arm_numbness_fingers', 'gait_ataxia_spastic'],
  neuro: ['nuchal_rigidity_headache', 'diplopia_ptosis_horner', 'facial_numb_speech', 'ataxia_vertigo_syncope'],
  sys: ['fever_chills', 'dysphagia_stridor', 'chest_dyspnea_sweat', 'local_mass_wound_pus', 'cancer_weight_loss']
};

function handleNeckWarningItemChange(noneId, el) {
  if (el && el.checked) {
    const noneEl = document.getElementById(noneId);
    if (noneEl) noneEl.checked = false;
  }
}

function handleNeckWarningNoneToggle(groupKey, el) {
  if (!el || !el.checked) return;
  const keys = NECK_WARN_GROUPS[groupKey] || [];
  document.querySelectorAll('input[name="neckpainWarningSigns"]').forEach(cb => {
    if (keys.includes(cb.value)) cb.checked = false;
  });
}

function handleNeckErgoItemChange(el) {
  if (el && el.checked) {
    const noneEl = document.getElementById('neck_ergo_none');
    if (noneEl) noneEl.checked = false;
  }
}

function handleNeckErgoNoneToggle(el) {
  if (!el || !el.checked) return;
  document.querySelectorAll('input[name="neckpainErgonomics"]').forEach(cb => {
    cb.checked = false;
  });
}

function toggleNeckpainWarningGroup() {}

function toggleNeckpainTraumaSub(isVisible) {
  const el = document.getElementById('neckpainTraumaSub');
  if (el) {
    el.classList.toggle('hidden', !isVisible);
    if (!isVisible) {
      el.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
      const otherWrap = document.getElementById('neckpainTraumaOtherWrap');
      if (otherWrap) otherWrap.classList.add('hidden');
      const otherInput = document.getElementById('neckpainTraumaOtherText');
      if (otherInput) otherInput.value = '';
    }
  }
}

function toggleNeckpainTraumaOther(isVisible) {
  const el = document.getElementById('neckpainTraumaOtherWrap');
  if (el) {
    el.classList.toggle('hidden', !isVisible);
    if (!isVisible) {
      const input = document.getElementById('neckpainTraumaOtherText');
      if (input) input.value = '';
    }
  }
}

// --- Golden UI Helpers & Word-Wrap Guard (P-AP10 / P-AP12 / C-AP1 / C-AP18) ---
function wrapNeckWords(chunks) {
  if (!Array.isArray(chunks)) return chunks;
  return chunks.map(c => `<span class="inline-block whitespace-nowrap">${c}</span>`).join(' ');
}

function renderNeckCard(opt) {
  const kind = opt.kind || 'checkbox';
  const idAttr = opt.id ? `id="${opt.id}"` : '';
  const nameAttr = opt.name ? `name="${opt.name}"` : '';
  const valAttr = opt.value !== undefined ? `value="${opt.value}"` : '';
  const onchangeAttr = opt.onchange ? `onchange="${opt.onchange}"` : '';
  const onclickAttr = opt.onclick ? `onclick="${opt.onclick}"` : '';
  const titleHtml = Array.isArray(opt.title) ? wrapNeckWords(opt.title) : opt.title;

  if (opt.desc) {
    return `<label ${onclickAttr} class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
      <input type="${kind}" ${idAttr} ${nameAttr} ${valAttr} ${onchangeAttr} class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
      <div class="ml-3 leading-snug">
        <span class="block text-xs sm:text-sm font-semibold text-slate-800">${titleHtml}</span>
        <span class="block text-[11px] text-slate-500 font-normal mt-0.5">${opt.desc}</span>
      </div>
    </label>`;
  }

  return `<label ${onclickAttr} class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
    <input type="${kind}" ${idAttr} ${nameAttr} ${valAttr} ${onchangeAttr} class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
    <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800 leading-snug">${titleHtml}</span>
  </label>`;
}

function renderNeckGrid(colsClass, options) {
  return `<div class="grid ${colsClass} gap-2.5">${options.map(renderNeckCard).join('')}</div>`;
}

function renderNeckSysHeader({ label, icon, colorClass, toggleId, toggleLabel, toggleOnchange }) {
  return `<div class="flex flex-wrap items-center justify-between gap-2 mb-2.5">
    <label class="flex items-center text-xs sm:text-sm font-bold text-slate-800">
      <span class="${colorClass} p-1.5 rounded-lg mr-2 inline-flex items-center justify-center"><i data-lucide="${icon}" class="w-4 h-4"></i></span>
      <span>${label}</span>
    </label>
    <label class="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-medium text-slate-700 cursor-pointer transition select-none flex-shrink-0">
      <input type="checkbox" id="${toggleId}" onchange="${toggleOnchange}" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded">
      <span class="ml-1.5 whitespace-nowrap">${toggleLabel}</span>
    </label>
  </div>`;
}

function renderNeckSidePickerRow(id, label, name) {
  return `<div id="${id}" class="hidden flex flex-wrap items-center justify-between gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs">
    <span class="font-semibold text-slate-700 whitespace-nowrap">${label} — ข้างที่ปวด:</span>
    <div class="flex flex-wrap items-center gap-2">
      <label class="selectable-card inline-flex items-center px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer transition">
        <input type="checkbox" name="${name}" value="left" class="h-3.5 w-3.5 text-medical-600 rounded">
        <span class="ml-3 font-medium text-slate-800 whitespace-nowrap">ซ้าย</span>
      </label>
      <label class="selectable-card inline-flex items-center px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer transition">
        <input type="checkbox" name="${name}" value="right" class="h-3.5 w-3.5 text-medical-600 rounded">
        <span class="ml-3 font-medium text-slate-800 whitespace-nowrap">ขวา</span>
      </label>
      <label class="selectable-card inline-flex items-center px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer transition">
        <input type="checkbox" name="${name}" value="both" class="h-3.5 w-3.5 text-medical-600 rounded">
        <span class="ml-3 font-medium text-slate-800 whitespace-nowrap">ทั้งสองข้าง</span>
      </label>
    </div>
  </div>`;
}

// --- Clinical Red Flag Evaluator ---
function evaluateNeckpainRedFlags(patient) {
  const rfs = [];
  if (!patient) return rfs;

  const warnSigns = Array.isArray(patient.neckpainWarningSigns) ? patient.neckpainWarningSigns : [];
  const traumaTypes = Array.isArray(patient.neckpainTraumaTypes) ? patient.neckpainTraumaTypes : [];
  const radLocs = Array.isArray(patient.neckpainRadLoc) ? patient.neckpainRadLoc : [];
  const charTypes = Array.isArray(patient.neckpainChar) ? patient.neckpainChar : [];
  const locs = Array.isArray(patient.neckpainLoc) ? patient.neckpainLoc : [];
  const vs = patient.vital_signs || {};
  const sbp = typeof vs.sbp === 'number' ? vs.sbp : parseFloat(vs.sbp);
  const pr = typeof vs.pr === 'number' ? vs.pr : parseFloat(vs.pr);
  const bt = typeof vs.bt === 'number' ? vs.bt : parseFloat(vs.bt);
  const shockIndex = (sbp && pr) ? (pr / sbp) : 0;
  const isHypotensive = (sbp && sbp < 90) || (shockIndex >= 0.9);

  // 1. Vertebral / Carotid Artery Dissection with Brainstem/Cerebral Ischemia (ESI 1)
  const isSudden = patient.neckpainOnsetMode === 'sudden_severe';
  const hasOcciputHead = radLocs.includes('rad_head_occiput') || locs.includes('suboccipital_posterior') || locs.includes('lateral_neck');
  const hasNeuroDissection = warnSigns.includes('diplopia_ptosis_horner') || warnSigns.includes('facial_numb_speech') || warnSigns.includes('ataxia_vertigo_syncope');

  if (hasNeuroDissection && (isSudden || hasOcciputHead)) {
    rfs.push({
      key: 'rf_vertebral_carotid_dissection',
      level: 1,
      textTh: 'สงสัยหลอดเลือดแดงคอหรือท้ายทอยฉีกขาดร่วมกับภาวะสมองขาดเลือด (Vertebral / Carotid Artery Dissection with Stroke)',
      risk: 'วิกฤตเฉียบพลัน: เสี่ยงหลอดเลือดสมองขาดเลือดรุนแรง, Stat CT/CTA Brain & Neck Whole Cervical Vessels, ปรึกษาอายุรแพทย์ประสาท/ศัลยแพทย์หลอดเลือดทันที'
    });
  }

  // 2. Suspected ACS / Stanford Type A Aortic Dissection with Interscapular / Neck Radiation (ESI 1)
  const hasChestRad = radLocs.includes('rad_jaw_chest') || radLocs.includes('rad_interscapular_tearing');
  const isTearing = charTypes.includes('tearing_ripping');
  const hasChestSweat = warnSigns.includes('chest_dyspnea_sweat');

  if (hasChestSweat || (hasChestRad && (isTearing || isHypotensive || isSudden))) {
    rfs.push({
      key: 'rf_acs_aortic_dissection_referred',
      level: 1,
      textTh: 'สงสัยภาวะหลอดเลือดหัวใจอุดกั้นเฉียบพลัน หรือหลอดเลือดแดงใหญ่ฉีกขาดทะลุสะบัก (Suspected ACS / Type A Aortic Dissection)',
      risk: 'วิกฤตระบบไหลเวียน: Stat 12-lead EKG, Trop-T, เปิดเส้น IV 2 เส้น, สารน้ำ, Stat CTA Aorta หากสงสัย Dissection และเตรียมทีมกู้ชีพ'
    });
  }

  // 3. Cervical Spondylotic Myelopathy (CSM) / Acute Spinal Cord Compression (ESI 2)
  const hasClumsyHand = warnSigns.includes('hand_clumsy_weak');
  const hasSpasticGait = warnSigns.includes('gait_ataxia_spastic');
  const hasArmNumb = warnSigns.includes('arm_numbness_fingers');

  if (hasClumsyHand || (hasSpasticGait && hasArmNumb)) {
    rfs.push({
      key: 'rf_cervical_myelopathy',
      level: 2,
      textTh: 'สงสัยภาวะไขสันหลังระดับคอถูกกดทับวิกฤต (Cervical Spondylotic Myelopathy - CSM)',
      risk: 'เสี่ยงอัมพาตทั้งสี่รยางค์ถาวร: ตรวจ Motor power C5-T1, Deep tendon reflexes, Hoffmann sign, Stat MRI Cervical Spine, ปรึกษาศัลยแพทย์กระดูกสันหลัง'
    });
  }

  // 4. Meningitis / Retropharyngeal Abscess / Deep Neck Space Infection (ESI 2)
  const hasFever = warnSigns.includes('fever_chills') || (bt && bt >= 38.5);
  const hasAirwayDysphagia = warnSigns.includes('dysphagia_stridor');
  const hasNuchalStiff = warnSigns.includes('nuchal_rigidity_headache');
  const hasLocalPus = warnSigns.includes('local_mass_wound_pus');

  if (hasAirwayDysphagia || (hasFever && (hasNuchalStiff || hasLocalPus))) {
    rfs.push({
      key: 'rf_cervical_infection_airway',
      level: 2,
      textTh: 'สงสัยการติดเชื้อรุนแรง คอแข็ง หรือฝีในช่องคอกดเบียดทางเดินหายใจ (Meningitis / Retropharyngeal Abscess / Airway Threat)',
      risk: 'เสี่ยงอุดกั้นทางเดินหายใจและติดเชื้อในกระแสเลือด: ประเมิน Stridor/Airway ทันที, เตรียมอุปกรณ์ใส่ท่อช่วยหายใจ, Stat CT Soft Tissue Neck with Contrast, Hemoculture และเริ่ม IV Antibiotics'
    });
  }

  // 5. Unstable Cervical Spine Trauma / High-Risk Canadian C-Spine (ESI 2)
  const isHighImpactTrauma = traumaTypes.includes('high_impact_mva_whiplash') || traumaTypes.includes('fall_diving_head_neck');
  const hasWeakness = warnSigns.includes('arm_weakness_abduction');
  const isElderlyTrauma = isHighImpactTrauma && (patient.age >= 65 || hasWeakness);

  if (isHighImpactTrauma || isElderlyTrauma) {
    rfs.push({
      key: 'rf_cervical_trauma_unstable',
      level: 2,
      textTh: 'สงสัยกระดูกต้นคอหักหรือบาดเจ็บไขสันหลังชนิดไม่มั่นคง (Cervical Spine Fracture / Cord Injury - Canadian C-Spine High Risk)',
      risk: 'อันตรายต่อไขสันหลัง: ใส่ Hard Cervical Collar ทันที, ห้ามขยับดัดคอ, Spinal Immobilization (Log-roll), Stat CT Cervical Spine'
    });
  }

  // 6. Acute Cervical Radiculopathy with Motor Deficit (ESI 3)
  if (hasWeakness) {
    rfs.push({
      key: 'rf_cervical_radiculopathy_motor',
      level: 3,
      textTh: 'รากประสาทคอถูกกดทับร่วมกับกล้ามเนื้อแขนอ่อนแรง (Cervical Radiculopathy with Motor Deficit)',
      risk: 'ประเมิน Motor power แขน/ข้อมือ/นิ้วมือ C5-T1, พักการใช้งานคอ, ให้ยาแก้ปวดลดการอักเสบ และพิจารณาส่งต่อศัลยแพทย์กระดูกและข้อ'
    });
  }

  // 7. Cervical Spine Malignancy / Metastasis Risk (ESI 2-3)
  const hasCancer = warnSigns.includes('cancer_weight_loss');
  if (hasCancer) {
    rfs.push({
      key: 'rf_cervical_malignancy',
      level: 2,
      textTh: 'สงสัยมะเร็งแพร่กระจายมายังกระดูกต้นคอ (Cervical Spine Malignancy / Metastasis)',
      risk: 'ตรวจ Plain Film C-Spine, พิจารณา MRI C-Spine เพื่อประเมิน Cord compression, ปรึกษาแพทย์เฉพาะทาง'
    });
  }

  return rfs;
}

function makeNeckSeed(overrides) {
  return Object.assign({
    chief_complaint: 'neck_shoulder_pain',
    chief_complaint_title: 'ปวดต้นคอ / บ่า / หลังช่วงบน',
    status: 'waiting',
    hospRecordStatus: 'complete',
    underlying: [],
    drugAllergy: 'ปฏิเสธ',
    currentMeds: 'ไม่มี',
    otherSymptomsFree: '',
    doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
    neckpainLocPostSide: [],
    neckpainLocLatSide: [],
    neckpainLocTrapSide: [],
    neckpainLocScapSide: [],
    neckpainRadLoc: [],
    neckpainWarningSigns: [],
    neckWarningArmMovementParent: false,
    neckWarningNeuroHeadParent: false,
    neckWarnArmNone: false,
    neckWarnNeuroNone: false,
    neckWarnSysNone: false,
    neckpainTraumaMaster: 'no',
    neckpainTraumaTypes: [],
    neckpainTraumaOtherText: '',
    neckpainErgonomics: [],
    neckErgoNone: false
  }, overrides);
}

// --- Register Module to Core Knowledge Base ---
registerCcModule({
  id: 'neck_shoulder_pain',
  recordCc: 'neck_shoulder_pain',
  titleTh: 'ปวดต้นคอ / บ่า / หลังช่วงบน',
  titleEn: 'Neck / Shoulder / Upper back pain',
  icon: 'activity',
  sectionDomId: 'neck_shoulder_painQuestionnaireSection',
  headerTh: 'แบบฟอร์มซักประวัติ: ปวดต้นคอ / บ่า / หลังช่วงบน (Neck / Shoulder / Upper Back Pain)',
  headerEn: '(Cervical Myelopathy, Dissection & Cardiovascular Triage)',
  patientBadgeHtml: '<i data-lucide="activity" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-amber-500"></i><span class="whitespace-nowrap">ปวดต้นคอ / บ่า / หลังช่วงบน</span>',
  doctorCcBadgeHtml: '<i data-lucide="activity" class="w-3.5 h-3.5 mr-1 text-amber-500"></i> CC: ปวดต้นคอ / บ่า / หลังช่วงบน (Neck & Shoulder pain)',
  pmhSectionNumber: 5,
  getPmhSectionNumber: () => 5,
  dateFields: [],
  timeFields: [],
  branchIds: [
    'neckSideBranchesWrap',
    'neckPostSideGroup',
    'neckLatSideGroup',
    'neckTrapSideGroup',
    'neckScapSideGroup',
    'neckpainRadiationSub',
    'neckpainTraumaSub',
    'neckpainTraumaOtherWrap'
  ],
  inputIdsToClear: [
    'neckpainDurationVal',
    'neckpainTraumaOtherText',
    'neckpain_other_free'
  ],

  algorithm: {
    chiefComplaint: 'neck_shoulder_pain',
    titleTh: 'ปวดต้นคอ / บ่า / หลังช่วงบน',
    schemaCode: 'neck_shoulder_pain',
    version: '3.0.0',
    redFlagDefinitions: [
      { key: 'rf_vertebral_carotid_dissection', level: 1, textTh: 'Vertebral / Carotid Artery Dissection (สงสัยหลอดเลือดแดงคอฉีกขาดร่วมกับภาวะสมองขาดเลือด)' },
      { key: 'rf_acs_aortic_dissection_referred', level: 1, textTh: 'Acute Coronary Syndrome / Aortic Dissection (สงสัยหลอดเลือดหัวใจอุดกั้นหรือหลอดเลือดใหญ่ฉีกขาดทะลุสะบัก)' },
      { key: 'rf_cervical_myelopathy', level: 2, textTh: 'Cervical Spondylotic Myelopathy (สงสัยไขสันหลังระดับคอถูกกดทับวิกฤต/มือล้า/เดินเซ)' },
      { key: 'rf_cervical_infection_airway', level: 2, textTh: 'Meningitis / Retropharyngeal Abscess (สงสัยติดเชื้อรุนแรง คอแข็ง หรือฝีกดเบียดทางเดินหายใจ)' },
      { key: 'rf_cervical_trauma_unstable', level: 2, textTh: 'Unstable Cervical Spine Trauma (สงสัยกระดูกต้นคอหักหรือบาดเจ็บไขสันหลังชนิดไม่มั่นคง)' },
      { key: 'rf_cervical_radiculopathy_motor', level: 3, textTh: 'Cervical Radiculopathy with Motor Deficit (รากประสาทคอถูกกดทับร่วมกับกล้ามเนื้อแขนอ่อนแรง)' },
      { key: 'rf_cervical_malignancy', level: 2, textTh: 'Cervical Spine Malignancy (สงสัยมะเร็งแพร่กระจายมายังกระดูกต้นคอ)' }
    ]
  },

  // --- HTML Template for Patient Intake Form ---
  formHtml: `
    <div id="neck_shoulder_painQuestionnaireSection" class="hidden space-y-6">
      <div data-cc-top-banner="neck_shoulder_pain"><div class="flex flex-col gap-4">
        <div class="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-start space-x-3 text-xs text-slate-800 leading-relaxed">
          <i data-lucide="info" class="w-5 h-5 text-medical-600 mt-0.5 flex-shrink-0"></i>
          <div class="space-y-1">
            <p class="font-bold text-slate-900">ข้อแนะนำความปลอดภัยระหว่างรอตรวจ:</p>
            <p>1. <strong>งดบิด ดัด สะบัด หรือกดนวดคอแรงๆ ระหว่างรอตรวจ</strong> เพื่อป้องกันการบาดเจ็บต่อหลอดเลือดและเส้นประสาทต้นคอ</p>
            <p>2. <strong>หากเพิ่งประสบอุบัติเหตุกระแทกหรือตกจากที่สูง:</strong> ให้นั่งหรือนอนนิ่งๆ หลีกเลี่ยงการก้มเงยหรือหันคอ</p>
            <p>3. <strong>แจ้งพยาบาลทันทีหากมีอาการต่อไปนี้:</strong> แขนขาอ่อนแรง ชาตามแขน/มือ เดินเซ เห็นภาพซ้อน พูดไม่ชัด กลืนลำบาก หรือแน่นหน้าอก</p>
          </div>
        </div>
      </div></div>

      <!-- CARD 1: ระยะเวลาและตำแหน่งที่ปวด -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="clock" class="w-5 h-5"></i>
          </div>
          <h2 class="text-base font-bold text-slate-900">1. ระยะเวลาและตำแหน่งที่ปวด</h2>
        </div>

        <div class="space-y-5">
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              1.1 มีอาการปวดมานานเท่าไรแล้ว?
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div class="col-span-1 sm:col-span-2">
                <input type="number" id="neckpainDurationVal" min="1" max="1000" placeholder="เช่น 2"
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm placeholder:text-slate-400">
              </div>
              <div class="col-span-1">
                <select id="neckpainDurationUnit"
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm">
                  <option value="minutes">นาที</option>
                  <option value="hours">ชั่วโมง</option>
                  <option value="days" selected>วัน</option>
                  <option value="weeks">สัปดาห์</option>
                  <option value="months">เดือน</option>
                  <option value="years">ปี</option>
                </select>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100">
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              1.2 ตำแหน่งที่ปวด (เลือกได้หลายข้อ)
            </label>
            ${renderNeckGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', [
              { name: 'neckpainLoc', value: 'suboccipital_posterior', onchange: "toggleNeckpainSideGroup('neckPostSideGroup', this.checked)", title: ['ต้นคอด้านหลัง /', 'ท้ายทอย'] },
              { name: 'neckpainLoc', value: 'lateral_neck', onchange: "toggleNeckpainSideGroup('neckLatSideGroup', this.checked)", title: ['ต้นคอด้านข้าง'], desc: 'แนวลำคอใต้ใบหูหรือขากรรไกร' },
              { name: 'neckpainLoc', value: 'trapezius_shoulder', onchange: "toggleNeckpainSideGroup('neckTrapSideGroup', this.checked)", title: ['บ่า / หัวไหล่'] },
              { name: 'neckpainLoc', value: 'interscapular_upper', onchange: "toggleNeckpainSideGroup('neckScapSideGroup', this.checked)", title: ['สะบัก / หลังช่วงบน'], desc: 'ร่องระหว่างสะบักสองข้าง' },
              { name: 'neckpainLoc', value: 'diffuse', title: ['ปวดเมื่อยระบม', 'ทั่วคอบ่าไหล่'] }
            ])}

            <div id="neckSideBranchesWrap" class="hidden bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-3 space-y-2.5">
              <span class="text-xs font-bold text-slate-800 block">ระบุข้างที่มีอาการปวด:</span>
              ${renderNeckSidePickerRow('neckPostSideGroup', 'ต้นคอด้านหลัง / ท้ายทอย', 'neckpainLocPostSide')}
              ${renderNeckSidePickerRow('neckLatSideGroup', 'ต้นคอด้านข้าง', 'neckpainLocLatSide')}
              ${renderNeckSidePickerRow('neckTrapSideGroup', 'บ่า / หัวไหล่', 'neckpainLocTrapSide')}
              ${renderNeckSidePickerRow('neckScapSideGroup', 'สะบัก / หลังช่วงบน', 'neckpainLocScapSide')}
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100">
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              1.3 ลักษณะการเริ่มปวด
            </label>
            ${renderNeckGrid('grid-cols-1 sm:grid-cols-2', [
              { kind: 'radio', name: 'neckpainOnsetMode', value: 'sudden_severe', title: ['ปวดรุนแรงทันทีทันใด', '(เฉียบพลัน)'] },
              { kind: 'radio', name: 'neckpainOnsetMode', value: 'gradual_worsening', title: ['ค่อยๆ ปวดเพิ่มขึ้นเรื่อยๆ'] }
            ])}
          </div>
        </div>
      </div>

      <!-- CARD 2: การปวดร้าว ลักษณะปวด และระดับความปวด -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="activity" class="w-5 h-5"></i>
          </div>
          <h2 class="text-base font-bold text-slate-900">2. การปวดร้าว ลักษณะปวด และระดับความปวด</h2>
        </div>

        <div class="space-y-5">
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              2.1 อาการปวดร้าวไปบริเวณอื่น
            </label>
            ${renderNeckGrid('grid-cols-1 sm:grid-cols-2', [
              { kind: 'radio', name: 'neckpainRadMaster', value: 'none', onchange: 'toggleNeckpainRadiationSub(false)', title: ['ปวดเฉพาะที่ ไม่ร้าวไปไหน'] },
              { kind: 'radio', name: 'neckpainRadMaster', value: 'yes', onchange: 'toggleNeckpainRadiationSub(true)', title: ['มีปวดร้าวไปบริเวณอื่น'] }
            ])}

            <div id="neckpainRadiationSub" class="hidden bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-3 space-y-2.5">
              <span class="text-xs font-bold text-slate-800 block">ระบุบริเวณที่ปวดร้าว (เลือกได้หลายข้อ):</span>
              ${renderNeckGrid('grid-cols-1 sm:grid-cols-2', [
                { name: 'neckpainRadLoc', value: 'rad_arm_fingers', title: ['ร้าวลงแขน ข้อศอก /', 'ปลายนิ้วมือ'] },
                { name: 'neckpainRadLoc', value: 'rad_head_occiput', title: ['ร้าวขึ้นศีรษะ ท้ายทอย /', 'ขมับ'] },
                { name: 'neckpainRadLoc', value: 'rad_jaw_chest', title: ['ร้าวไปขากรรไกร คอหอย /', 'หน้าอก'] },
                { name: 'neckpainRadLoc', value: 'rad_interscapular_tearing', title: ['ร้าวทะลุหลัง', 'ไประหว่างสะบัก'] }
              ])}
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100">
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              2.2 ลักษณะอาการปวด (เลือกได้หลายข้อ)
            </label>
            ${renderNeckGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-4', [
              { name: 'neckpainChar', value: 'dull_muscle_tight', title: ['ปวดเมื่อย ตึง ระบม'] },
              { name: 'neckpainChar', value: 'sharp_electric', title: ['ปวดแปล๊บ /', 'เหมือนไฟช็อต'] },
              { name: 'neckpainChar', value: 'throbbing_pulsatile', title: ['ปวดเต้นตุบๆ', 'ตามชีพจร'] },
              { name: 'neckpainChar', value: 'tearing_ripping', title: ['ปวดฉีกขาด', 'รุนแรงจัด'] }
            ])}
          </div>

          <!-- 2.3 ระดับความเจ็บปวด (Universal Slider 0-10) -->
          <div class="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label class="block text-xs font-semibold text-slate-800 uppercase tracking-wider">ระดับความเจ็บปวดในขณะนี้ (Pain Score: 0 – 10)</label>
              <div class="flex items-center space-x-2">
                <span id="neckpainPainScoreBadge" class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all">
                  <span id="neckpainPainScoreEmoji" class="text-base">⚪</span>
                  <span id="neckpainPainScoreText">ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)</span>
                </span>
                <button type="button" id="neckpainPainScoreClearBtn" onclick="clearNeckpainPainScore()" class="text-xs text-slate-400 hover:text-rose-600 underline hidden transition" title="ล้างค่าเพื่อให้เป็นไม่ได้ระบุ">ล้างค่า</button>
              </div>
            </div>
            <div class="px-1 pt-1">
              <input type="range" id="neckpainPainScore" min="0" max="10" value="0" step="1" oninput="handleNeckpainPainScoreChange(this.value)" class="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-600 focus:outline-none focus:ring-2 focus:ring-medical-500">
            </div>
            <div class="grid grid-cols-5 text-center text-[10px] sm:text-[11px] pt-1 gap-1 text-slate-500 font-medium">
              <div class="cursor-pointer hover:text-medical-600 transition" onclick="setNeckpainPainScore(0)"><span class="text-lg sm:text-xl block">😊</span><span>0: สบายดี</span></div>
              <div class="cursor-pointer hover:text-medical-600 transition" onclick="setNeckpainPainScore(2)"><span class="text-lg sm:text-xl block">🙂</span><span>1–3: เล็กน้อย</span></div>
              <div class="cursor-pointer hover:text-medical-600 transition" onclick="setNeckpainPainScore(5)"><span class="text-lg sm:text-xl block">😐</span><span>4–6: ปานกลาง</span></div>
              <div class="cursor-pointer hover:text-medical-600 transition" onclick="setNeckpainPainScore(8)"><span class="text-lg sm:text-xl block">😣</span><span>7–9: ปวดมาก</span></div>
              <div class="cursor-pointer hover:text-medical-600 transition" onclick="setNeckpainPainScore(10)"><span class="text-lg sm:text-xl block">😭</span><span>10: ปวดที่สุด</span></div>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 3: สัญญาณเตือนและอาการร่วมสำคัญทางระบบประสาท -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="shield-alert" class="w-5 h-5"></i>
          </div>
          <h2 class="text-base font-bold text-slate-900">3. สัญญาณเตือนและอาการร่วมสำคัญทางระบบประสาท</h2>
        </div>

        <div class="space-y-5">
          <div>
            ${renderNeckSysHeader({
              label: '3.1 อาการผิดปกติที่แขน มือ หรือการเดิน (เลือกได้หลายข้อ)',
              icon: 'zap',
              colorClass: 'bg-amber-100 text-amber-700',
              toggleId: 'neck_warn_arm_none',
              toggleLabel: 'ไม่มีอาการในหมวดนี้',
              toggleOnchange: "handleNeckWarningNoneToggle('arm', this)"
            })}
            ${renderNeckGrid('grid-cols-1 sm:grid-cols-2', [
              { name: 'neckpainWarningSigns', value: 'hand_clumsy_weak', onchange: "handleNeckWarningItemChange('neck_warn_arm_none', this)", title: ['มืออ่อนแรง', 'หยิบของหลุด /', 'ติดกระดุมลำบาก'] },
              { name: 'neckpainWarningSigns', value: 'arm_weakness_abduction', onchange: "handleNeckWarningItemChange('neck_warn_arm_none', this)", title: ['แขนอ่อนแรง', 'ยกไม่ขึ้น /', 'งอศอกไม่ได้'] },
              { name: 'neckpainWarningSigns', value: 'arm_numbness_fingers', onchange: "handleNeckWarningItemChange('neck_warn_arm_none', this)", title: ['ชาตามแนวแขน /', 'ฝ่ามือ /', 'ปลายนิ้ว'] },
              { name: 'neckpainWarningSigns', value: 'gait_ataxia_spastic', onchange: "handleNeckWarningItemChange('neck_warn_arm_none', this)", title: ['เดินเซ /', 'ขาแข็งกระตุก /', 'ก้าวลำบาก'] }
            ])}
          </div>

          <div class="pt-3 border-t border-slate-100">
            ${renderNeckSysHeader({
              label: '3.2 อาการทางระบบประสาท ศีรษะ และการมองเห็น (เลือกได้หลายข้อ)',
              icon: 'eye',
              colorClass: 'bg-purple-100 text-purple-700',
              toggleId: 'neck_warn_neuro_none',
              toggleLabel: 'ไม่มีอาการในหมวดนี้',
              toggleOnchange: "handleNeckWarningNoneToggle('neuro', this)"
            })}
            ${renderNeckGrid('grid-cols-1 sm:grid-cols-2', [
              { name: 'neckpainWarningSigns', value: 'nuchal_rigidity_headache', onchange: "handleNeckWarningItemChange('neck_warn_neuro_none', this)", title: ['ปวดท้ายทอย', 'เฉียบพลัน /', 'คอแข็งก้มไม่ลง'] },
              { name: 'neckpainWarningSigns', value: 'diplopia_ptosis_horner', onchange: "handleNeckWarningItemChange('neck_warn_neuro_none', this)", title: ['ตาพร่า /', 'เห็นภาพซ้อน /', 'หนังตาตกข้างเดียว'] },
              { name: 'neckpainWarningSigns', value: 'facial_numb_speech', onchange: "handleNeckWarningItemChange('neck_warn_neuro_none', this)", title: ['หน้าชา /', 'ปากเบี้ยว /', 'พูดไม่ชัด'] },
              { name: 'neckpainWarningSigns', value: 'ataxia_vertigo_syncope', onchange: "handleNeckWarningItemChange('neck_warn_neuro_none', this)", title: ['วูบ / หน้ามืด /', 'บ้านหมุน', 'โคลงเคลง'] }
            ])}
          </div>

          <div class="pt-3 border-t border-slate-100">
            ${renderNeckSysHeader({
              label: '3.3 อาการเตือนสำคัญอื่นร่วมด้วย (เลือกได้หลายข้อ)',
              icon: 'shield-alert',
              colorClass: 'bg-rose-100 text-rose-700',
              toggleId: 'neck_warn_sys_none',
              toggleLabel: 'ไม่มีอาการในหมวดนี้',
              toggleOnchange: "handleNeckWarningNoneToggle('sys', this)"
            })}
            ${renderNeckGrid('grid-cols-1 sm:grid-cols-2', [
              { name: 'neckpainWarningSigns', value: 'fever_chills', onchange: "handleNeckWarningItemChange('neck_warn_sys_none', this)", title: ['มีไข้สูง /', 'หนาวสั่นสะท้าน'] },
              { name: 'neckpainWarningSigns', value: 'dysphagia_stridor', onchange: "handleNeckWarningItemChange('neck_warn_sys_none', this)", title: ['กลืนลำบาก /', 'เจ็บคอมาก /', 'หายใจมีเสียงหวีด'] },
              { name: 'neckpainWarningSigns', value: 'chest_dyspnea_sweat', onchange: "handleNeckWarningItemChange('neck_warn_sys_none', this)", title: ['แน่นหน้าอก /', 'หอบเหนื่อย /', 'เหงื่อแตกตัวเย็น'] },
              { name: 'neckpainWarningSigns', value: 'local_mass_wound_pus', onchange: "handleNeckWarningItemChange('neck_warn_sys_none', this)", title: ['มีก้อน แผล', 'หนอง ผื่น /', 'ฝีบริเวณที่มีอาการ'] },
              { name: 'neckpainWarningSigns', value: 'cancer_weight_loss', onchange: "handleNeckWarningItemChange('neck_warn_sys_none', this)", title: ['ประวัติโรคมะเร็ง /', 'น้ำหนักลดฮวบ', 'ผิดปกติ'] }
            ])}
          </div>
        </div>
      </div>

      <!-- CARD 4: ประวัติอุบัติเหตุ และพฤติกรรมการทำงานหรือท่าทาง -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="alert-triangle" class="w-5 h-5"></i>
          </div>
          <h2 class="text-base font-bold text-slate-900">4. ประวัติอุบัติเหตุ และพฤติกรรมการทำงานหรือท่าทาง</h2>
        </div>

        <div class="space-y-5">
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              4.1 ประวัติอุบัติเหตุและการบาดเจ็บที่คอ
            </label>
            ${renderNeckGrid('grid-cols-1 sm:grid-cols-2', [
              { kind: 'radio', name: 'neckpainTraumaMaster', value: 'no', onchange: 'toggleNeckpainTraumaSub(false)', title: ['ไม่มีประวัติอุบัติเหตุ', '(เริ่มปวดเอง)'] },
              { kind: 'radio', name: 'neckpainTraumaMaster', value: 'yes', onchange: 'toggleNeckpainTraumaSub(true)', title: ['มีประวัติอุบัติเหตุนำมาก่อน'] }
            ])}

            <div id="neckpainTraumaSub" class="hidden bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-3 space-y-3">
              <span class="text-xs font-bold text-slate-800 block">ระบุประเภทอุบัติเหตุ (เลือกได้หลายข้อ):</span>
              ${renderNeckGrid('grid-cols-1 sm:grid-cols-2', [
                { name: 'neckpainTraumaTypes', value: 'high_impact_mva_whiplash', title: ['รถชน / ถูกชนท้าย /', 'คอกระชากสะบัดแรง'] },
                { name: 'neckpainTraumaTypes', value: 'fall_diving_head_neck', title: ['พลัดตกจากที่สูง / หกล้ม /', 'กระโดดน้ำกระแทก'] },
                { name: 'neckpainTraumaTypes', value: 'sports_neck_injury', title: ['อุบัติเหตุเล่นกีฬา', 'ที่มีการกระแทกคอ'] },
                { name: 'neckpainTraumaTypes', value: 'trauma_other', onchange: 'toggleNeckpainTraumaOther(this.checked)', title: ['อุบัติเหตุอื่นๆ (ระบุ)'] }
              ])}
              <div id="neckpainTraumaOtherWrap" class="hidden pt-1">
                <input type="text" id="neckpainTraumaOtherText" placeholder="ระบุเหตุการณ์ เช่น ศีรษะชนขอบประตู..."
                  class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100">
            ${renderNeckSysHeader({
              label: '4.2 พฤติกรรมการทำงาน ท่าทาง และปัจจัยกระตุ้น (เลือกได้หลายข้อ)',
              icon: 'laptop',
              colorClass: 'bg-sky-100 text-sky-700',
              toggleId: 'neck_ergo_none',
              toggleLabel: 'ไม่มีปัจจัยท่าทางข้างต้น',
              toggleOnchange: 'handleNeckErgoNoneToggle(this)'
            })}
            ${renderNeckGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', [
              { name: 'neckpainErgonomics', value: 'office_tech_neck', onchange: 'handleNeckErgoItemChange(this)', title: ['นั่งหน้าคอมฯ /', 'ก้มดูจอนาน'] },
              { name: 'neckpainErgonomics', value: 'awkward_twist_strain', onchange: 'handleNeckErgoItemChange(this)', title: ['บิดตัว / ออกแรงผิดท่า'] },
              { name: 'neckpainErgonomics', value: 'poor_sleep_posture', onchange: 'handleNeckErgoItemChange(this)', title: ['นอนตกหมอน /', 'คอบิดเกร็ง'] },
              { name: 'neckpainErgonomics', value: 'heavy_bag_shoulder', onchange: 'handleNeckErgoItemChange(this)', title: ['สะพายกระเป๋าหนัก'] },
              { name: 'neckpainErgonomics', value: 'worse_neck_motion', onchange: 'handleNeckErgoItemChange(this)', title: ['ปวดมากขึ้นเมื่อ', 'ก้ม เงย / เอียงคอ'] }
            ])}
          </div>
        </div>
      </div>

      <!-- CARD Universal: อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-3 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="message-square-plus" class="w-5 h-5"></i></div>
          <h2 class="text-base font-bold text-slate-900">อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2>
        </div>
        <textarea id="neckpain_other_free" rows="2" placeholder="เช่น เคยไปนวดดัดคอมาก่อนหน้านี้ 2 วัน, รู้สึกตึงรั้งขึ้นขมับ..."
          class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white placeholder:text-slate-400"></textarea>
      </div>
    </div>
  `,

  onTitleChange() {},

  onSelectForm() {
    syncNeckpainSideWrap();
  },

  onActivate() {
    syncNeckpainSideWrap();
  },

  onMounted: function() {
    clearNeckpainPainScore();
  },

  // --- Collect Intake Hook ---
  collectIntake: function(ctx) {
    ctx = ctx || {};
    const _rawDur = parseFloat(document.getElementById('neckpainDurationVal')?.value);
    const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
    const durationUnit = document.getElementById('neckpainDurationUnit')?.value || 'days';

    const neckpainLoc = Array.from(document.querySelectorAll('input[name="neckpainLoc"]:checked')).map(el => el.value);
    const neckpainLocPostSide = neckpainLoc.includes('suboccipital_posterior')
      ? Array.from(document.querySelectorAll('input[name="neckpainLocPostSide"]:checked')).map(el => el.value)
      : [];
    const neckpainLocLatSide = neckpainLoc.includes('lateral_neck')
      ? Array.from(document.querySelectorAll('input[name="neckpainLocLatSide"]:checked')).map(el => el.value)
      : [];
    const neckpainLocTrapSide = neckpainLoc.includes('trapezius_shoulder')
      ? Array.from(document.querySelectorAll('input[name="neckpainLocTrapSide"]:checked')).map(el => el.value)
      : [];
    const neckpainLocScapSide = neckpainLoc.includes('interscapular_upper')
      ? Array.from(document.querySelectorAll('input[name="neckpainLocScapSide"]:checked')).map(el => el.value)
      : [];

    const neckpainOnsetMode = document.querySelector('input[name="neckpainOnsetMode"]:checked')?.value || '';

    const neckpainRadMaster = document.querySelector('input[name="neckpainRadMaster"]:checked')?.value || '';
    const neckpainRadLoc = neckpainRadMaster === 'yes'
      ? Array.from(document.querySelectorAll('input[name="neckpainRadLoc"]:checked')).map(el => el.value)
      : [];

    const neckpainChar = Array.from(document.querySelectorAll('input[name="neckpainChar"]:checked')).map(el => el.value);

    let painScore = null;
    if (neckpainPainScoreTouched) {
      const pSlider = document.getElementById('neckpainPainScore');
      if (pSlider) painScore = parseInt(pSlider.value, 10);
    }

    const neckpainWarningSigns = Array.from(document.querySelectorAll('input[name="neckpainWarningSigns"]:checked')).map(el => el.value);
    const neckWarnArmNone = !!document.getElementById('neck_warn_arm_none')?.checked;
    const neckWarnNeuroNone = !!document.getElementById('neck_warn_neuro_none')?.checked;
    const neckWarnSysNone = !!document.getElementById('neck_warn_sys_none')?.checked;
    const neckWarningArmMovementParent = NECK_WARN_GROUPS.arm.some(k => neckpainWarningSigns.includes(k));
    const neckWarningNeuroHeadParent = NECK_WARN_GROUPS.neuro.some(k => neckpainWarningSigns.includes(k));

    const neckpainTraumaMaster = document.querySelector('input[name="neckpainTraumaMaster"]:checked')?.value || '';
    const neckpainTraumaTypes = neckpainTraumaMaster === 'yes'
      ? Array.from(document.querySelectorAll('input[name="neckpainTraumaTypes"]:checked')).map(el => el.value)
      : [];
    const neckpainTraumaOtherText = (neckpainTraumaMaster === 'yes' && neckpainTraumaTypes.includes('trauma_other'))
      ? (document.getElementById('neckpainTraumaOtherText')?.value?.trim() || '')
      : '';

    const neckpainErgonomics = Array.from(document.querySelectorAll('input[name="neckpainErgonomics"]:checked')).map(el => el.value);
    const neckErgoNone = !!document.getElementById('neck_ergo_none')?.checked;
    const otherSymptomsFree = document.getElementById('neckpain_other_free')?.value?.trim() || ctx.otherSymptomsFree || '';

    const rec = {
      id: ctx.recordId || `case-${Date.now()}`,
      queue_number: ctx.queueNumber || 'ER-NEW',
      hn: ctx.randomHn || '-',
      name: ctx.patientName || 'ไม่ระบุชื่อ',
      age: ctx.patientAge !== undefined ? ctx.patientAge : 'ไม่ระบุ',
      gender: ctx.gender || 'ไม่ระบุ',
      chief_complaint: 'neck_shoulder_pain',
      chief_complaint_title: 'ปวดต้นคอ / บ่า / หลังช่วงบน',
      timestamp: new Date().toISOString(),
      status: ctx.recordStatus || 'waiting',
      durationVal,
      durationUnit,
      hospRecordStatus: ctx.hospRecordStatus || 'unspecified',
      underlying: (Array.isArray(ctx.underlying) && ctx.underlying.length > 0) ? ctx.underlying : ((ctx.hospRecordStatus === 'self' || ctx.hospRecordStatus === 'additional') ? ['ปฏิเสธ'] : []),
      drugAllergy: ctx.drugAllergy || 'ไม่ได้ระบุ',
      currentMeds: ctx.currentMeds || 'ไม่ได้ระบุ',
      otherSymptomsFree,
      doctor_notes: ctx.preservedDoctorNotes || { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },

      neckpainLoc,
      neckpainLocPostSide,
      neckpainLocLatSide,
      neckpainLocTrapSide,
      neckpainLocScapSide,
      neckpainOnsetMode,
      neckpainRadMaster,
      neckpainRadLoc,
      neckpainChar,
      painScore,
      neckpainWarningSigns,
      neckWarnArmNone,
      neckWarnNeuroNone,
      neckWarnSysNone,
      neckWarningArmMovementParent,
      neckWarningNeuroHeadParent,
      neckpainTraumaMaster,
      neckpainTraumaTypes,
      neckpainTraumaOtherText,
      neckpainErgonomics,
      neckErgoNone
    };

    updateNeckpainOutputs(rec);
    return rec;
  },

  // --- Populate / Hydrate Form Hook ---
  populateForm: function(patient) {
    if (!patient) return;
    this.resetForm();

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val !== undefined && val !== null ? val : '';
    };

    setVal('neckpainDurationVal', patient.durationVal);
    setVal('neckpainDurationUnit', patient.durationUnit || 'days');

    const setCheckedArr = (name, arr) => {
      if (!Array.isArray(arr)) return;
      document.querySelectorAll(`input[name="${name}"]`).forEach(cb => {
        cb.checked = arr.includes(cb.value);
      });
    };

    setCheckedArr('neckpainLoc', patient.neckpainLoc);
    setCheckedArr('neckpainLocPostSide', patient.neckpainLocPostSide);
    setCheckedArr('neckpainLocLatSide', patient.neckpainLocLatSide);
    setCheckedArr('neckpainLocTrapSide', patient.neckpainLocTrapSide);
    setCheckedArr('neckpainLocScapSide', patient.neckpainLocScapSide);

    const locs = Array.isArray(patient.neckpainLoc) ? patient.neckpainLoc : [];
    toggleNeckpainSideGroup('neckPostSideGroup', locs.includes('suboccipital_posterior'));
    toggleNeckpainSideGroup('neckLatSideGroup', locs.includes('lateral_neck'));
    toggleNeckpainSideGroup('neckTrapSideGroup', locs.includes('trapezius_shoulder'));
    toggleNeckpainSideGroup('neckScapSideGroup', locs.includes('interscapular_upper'));
    syncNeckpainSideWrap();

    if (patient.neckpainOnsetMode) {
      const r = document.querySelector(`input[name="neckpainOnsetMode"][value="${patient.neckpainOnsetMode}"]`);
      if (r) r.checked = true;
    }

    if (patient.neckpainRadMaster) {
      const r = document.querySelector(`input[name="neckpainRadMaster"][value="${patient.neckpainRadMaster}"]`);
      if (r) r.checked = true;
    }
    toggleNeckpainRadiationSub(patient.neckpainRadMaster === 'yes');
    setCheckedArr('neckpainRadLoc', patient.neckpainRadLoc);

    setCheckedArr('neckpainChar', patient.neckpainChar);

    if (typeof patient.painScore === 'number' && patient.painScore >= 0) {
      const slider = document.getElementById('neckpainPainScore');
      if (slider) slider.value = patient.painScore;
      handleNeckpainPainScoreChange(patient.painScore);
    } else {
      clearNeckpainPainScore();
    }

    setCheckedArr('neckpainWarningSigns', patient.neckpainWarningSigns);
    const armNone = document.getElementById('neck_warn_arm_none');
    if (armNone) armNone.checked = Boolean(patient.neckWarnArmNone);
    const neuroNone = document.getElementById('neck_warn_neuro_none');
    if (neuroNone) neuroNone.checked = Boolean(patient.neckWarnNeuroNone);
    const sysNone = document.getElementById('neck_warn_sys_none');
    if (sysNone) sysNone.checked = Boolean(patient.neckWarnSysNone);

    if (patient.neckpainTraumaMaster) {
      const r = document.querySelector(`input[name="neckpainTraumaMaster"][value="${patient.neckpainTraumaMaster}"]`);
      if (r) r.checked = true;
    }
    toggleNeckpainTraumaSub(patient.neckpainTraumaMaster === 'yes');
    setCheckedArr('neckpainTraumaTypes', patient.neckpainTraumaTypes);

    const hasOtherTrauma = Array.isArray(patient.neckpainTraumaTypes) && patient.neckpainTraumaTypes.includes('trauma_other');
    toggleNeckpainTraumaOther(hasOtherTrauma);
    setVal('neckpainTraumaOtherText', patient.neckpainTraumaOtherText);

    setCheckedArr('neckpainErgonomics', patient.neckpainErgonomics);
    const ergoNone = document.getElementById('neck_ergo_none');
    if (ergoNone) ergoNone.checked = Boolean(patient.neckErgoNone);
    setVal('neckpain_other_free', patient.otherSymptomsFree);
  },

  // --- Reset Form Hook ---
  resetForm: function() {
    const ids = ['neckpainDurationVal', 'neckpainTraumaOtherText', 'neckpain_other_free'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const unitEl = document.getElementById('neckpainDurationUnit');
    if (unitEl) unitEl.value = 'days';

    const radios = ['neckpainOnsetMode', 'neckpainRadMaster', 'neckpainTraumaMaster'];
    radios.forEach(name => {
      document.querySelectorAll(`input[name="${name}"]`).forEach(r => { r.checked = false; });
    });

    const cbs = [
      'neckpainLoc', 'neckpainLocPostSide', 'neckpainLocLatSide', 'neckpainLocTrapSide',
      'neckpainLocScapSide', 'neckpainRadLoc', 'neckpainChar', 'neckpainWarningSigns',
      'neckpainTraumaTypes', 'neckpainErgonomics'
    ];
    cbs.forEach(name => {
      document.querySelectorAll(`input[name="${name}"]`).forEach(cb => { cb.checked = false; });
    });

    ['neck_warn_arm_none', 'neck_warn_neuro_none', 'neck_warn_sys_none', 'neck_ergo_none'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.checked = false;
    });

    ['neckSideBranchesWrap', 'neckPostSideGroup', 'neckLatSideGroup', 'neckTrapSideGroup', 'neckScapSideGroup',
     'neckpainRadiationSub', 'neckpainTraumaSub', 'neckpainTraumaOtherWrap'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });

    clearNeckpainPainScore();
  },

  // --- Clinical Output Generators ---
  hydrateForm: function(patient) {
    this.populateForm(patient);
  },
  isRedFlag: function(patient) {
    return evaluateNeckpainRedFlags(patient).length > 0;
  },
  updateOutputs: updateNeckpainOutputs,
  renderRapidHpi: renderNeckpainRapidHpi,
  renderNarrative: renderNeckpainNarrative,
  renderDoctorHpi: renderNeckpainDoctorHpi,
  evaluateRedFlags: evaluateNeckpainRedFlags,

  // --- Seed Patients Registry ---
  seedPatients: [
    // Case 1: Cervical Spondylotic Myelopathy (CSM) (ESI 2)
    makeNeckSeed({
      id: 'case-neck-01',
      queue_number: 'E2-101',
      hn: '6789101',
      name: 'นายสมศักดิ์ มือชาติดกระดุมไม่ได้',
      age: 64,
      gender: 'ชาย',
      timestamp: '2026-11-03T08:15:00.000Z',
      durationVal: 2,
      durationUnit: 'months',
      underlying: ['เบาหวาน (DM)', 'ความดันสูง (HT)'],
      currentMeds: 'Metformin (500 mg) 1 tab bid pc, Enalapril (10 mg) 1 tab od pc',
      otherSymptomsFree: 'ปวดคอร้าวลงบ่า มือล้าหยิบช้อนหล่น ติดกระดุมเสื้อลำบาก เดินขากระตุกก้าวขาลำบาก',
      vital_signs: { bt: 36.8, sbp: 138, dbp: 82, bp: '138/82', pr: 76, rr: 18, spo2: 98 },
      esi_level: 2,
      neckpainLoc: ['suboccipital_posterior', 'trapezius_shoulder'],
      neckpainLocPostSide: ['both'],
      neckpainLocTrapSide: ['both'],
      neckpainOnsetMode: 'gradual_worsening',
      neckpainRadMaster: 'yes',
      neckpainRadLoc: ['rad_arm_fingers'],
      neckpainChar: ['dull_muscle_tight', 'sharp_electric'],
      painScore: 6,
      neckpainWarningSigns: ['hand_clumsy_weak', 'arm_numbness_fingers', 'gait_ataxia_spastic'],
      neckWarningArmMovementParent: true,
      neckWarnNeuroNone: true,
      neckWarnSysNone: true,
      neckpainErgonomics: ['worse_neck_motion']
    }),

    // Case 2: Vertebral Artery Dissection with Brainstem Ischemia (ESI 1)
    makeNeckSeed({
      id: 'case-neck-02',
      queue_number: 'E1-102',
      hn: '6789102',
      name: 'นางวราภรณ์ ปวดคอเห็นภาพซ้อน',
      age: 42,
      gender: 'หญิง',
      timestamp: '2026-11-03T08:45:00.000Z',
      durationVal: 3,
      durationUnit: 'hours',
      underlying: ['ไมเกรน (Migraine)'],
      otherSymptomsFree: 'ปวดคอด้านซ้ายร้าวขึ้นท้ายทอยรุนแรงฉับพลันหลังไปนวดดัดคอ ตาเห็นภาพซ้อน เวียนศีรษะเดินเซ ทรงตัวไม่อยู่',
      vital_signs: { bt: 36.6, sbp: 155, dbp: 95, bp: '155/95', pr: 88, rr: 20, spo2: 99 },
      esi_level: 1,
      neckpainLoc: ['lateral_neck', 'suboccipital_posterior'],
      neckpainLocPostSide: ['left'],
      neckpainLocLatSide: ['left'],
      neckpainOnsetMode: 'sudden_severe',
      neckpainRadMaster: 'yes',
      neckpainRadLoc: ['rad_head_occiput'],
      neckpainChar: ['throbbing_pulsatile', 'tearing_ripping'],
      painScore: 9,
      neckpainWarningSigns: ['diplopia_ptosis_horner', 'ataxia_vertigo_syncope'],
      neckWarningNeuroHeadParent: true,
      neckWarnArmNone: true,
      neckWarnSysNone: true
    }),

    // Case 3: Acute Cervical Radiculopathy with Motor Deficit C6/C7 (ESI 3)
    makeNeckSeed({
      id: 'case-neck-03',
      queue_number: 'E3-103',
      hn: '6789103',
      name: 'นายธีระ แปล๊บลงแขนยกของไม่ขึ้น',
      age: 47,
      gender: 'ชาย',
      timestamp: '2026-11-03T09:15:00.000Z',
      durationVal: 4,
      durationUnit: 'days',
      drugAllergy: 'Aspirin (แน่นหน้าอกผื่นลมพิษ)',
      otherSymptomsFree: 'ปวดคอร้าวแปล๊บเหมือนไฟช็อตลงแขนขวาถึงนิ้วชี้และกลาง งอข้อศอกและยกแขนขวาไม่ค่อยขึ้น',
      vital_signs: { bt: 36.7, sbp: 126, dbp: 78, bp: '126/78', pr: 72, rr: 16, spo2: 100 },
      esi_level: 3,
      neckpainLoc: ['suboccipital_posterior', 'trapezius_shoulder'],
      neckpainLocPostSide: ['right'],
      neckpainLocTrapSide: ['right'],
      neckpainOnsetMode: 'gradual_worsening',
      neckpainRadMaster: 'yes',
      neckpainRadLoc: ['rad_arm_fingers'],
      neckpainChar: ['sharp_electric'],
      painScore: 7,
      neckpainWarningSigns: ['arm_weakness_abduction', 'arm_numbness_fingers'],
      neckWarningArmMovementParent: true,
      neckWarnNeuroNone: true,
      neckWarnSysNone: true,
      neckpainErgonomics: ['awkward_twist_strain', 'worse_neck_motion']
    }),

    // Case 4: Musculoskeletal Trapezius Myalgia / Office Syndrome (ESI 4)
    makeNeckSeed({
      id: 'case-neck-04',
      queue_number: 'E4-104',
      hn: '6789104',
      name: 'นางสาวกุลธิดา ตึงบ่าทำงานหน้าจอ',
      age: 28,
      gender: 'หญิง',
      timestamp: '2026-11-03T09:40:00.000Z',
      durationVal: 3,
      durationUnit: 'weeks',
      otherSymptomsFree: 'นั่งทำงานคอมพิวเตอร์วันละ 8-10 ชม. ปวดเมื่อยตึงบ่าและสะบักทั้งสองข้าง ขยับแล้วตึงตัว ไม่ชา ไม่อ่อนแรง',
      vital_signs: { bt: 36.5, sbp: 118, dbp: 74, bp: '118/74', pr: 68, rr: 16, spo2: 99 },
      esi_level: 4,
      neckpainLoc: ['trapezius_shoulder', 'interscapular_upper'],
      neckpainLocTrapSide: ['both'],
      neckpainLocScapSide: ['both'],
      neckpainOnsetMode: 'gradual_worsening',
      neckpainRadMaster: 'none',
      neckpainChar: ['dull_muscle_tight'],
      painScore: 4,
      neckWarnArmNone: true,
      neckWarnNeuroNone: true,
      neckWarnSysNone: true,
      neckpainErgonomics: ['office_tech_neck', 'poor_sleep_posture']
    })
  ]
});

// --- Helper Formatting Functions for Neck Pain ---
function formatNeckpainLocations(patient) {
  const locs = Array.isArray(patient.neckpainLoc) ? patient.neckpainLoc : [];
  if (locs.length === 0) return 'ไม่ได้ระบุ';

  const parts = [];
  const sideFormat = (sides) => {
    if (!Array.isArray(sides) || sides.length === 0) return '';
    const map = { left: 'ซ้าย', right: 'ขวา', both: 'ทั้งสองข้าง' };
    return ` (ข้าง${sides.map(s => map[s] || s).join(', ')})`;
  };

  locs.forEach(l => {
    if (l === 'suboccipital_posterior') parts.push(`ต้นคอด้านหลัง${sideFormat(patient.neckpainLocPostSide)}`);
    else if (l === 'lateral_neck') parts.push(`ต้นคอด้านข้าง${sideFormat(patient.neckpainLocLatSide)}`);
    else if (l === 'trapezius_shoulder') parts.push(`บ่า/ไหล่${sideFormat(patient.neckpainLocTrapSide)}`);
    else if (l === 'interscapular_upper') parts.push(`สะบัก/หลังช่วงบน${sideFormat(patient.neckpainLocScapSide)}`);
    else if (l === 'diffuse') parts.push('ปวดเมื่อยระบมทั่วคอบ่าไหล่');
    else parts.push(l);
  });

  return parts.join(', ');
}

function formatNeckpainChars(patient) {
  const chars = Array.isArray(patient.neckpainChar) ? patient.neckpainChar : [];
  if (chars.length === 0) return 'ไม่ได้ระบุ';
  const map = {
    dull_muscle_tight: 'ปวดเมื่อย ตึง ระบม',
    sharp_electric: 'ปวดแปล๊บ เหมือนไฟช็อต',
    throbbing_pulsatile: 'ปวดเต้นตุบๆ ตามชีพจร',
    tearing_ripping: 'ปวดฉีกขาด รุนแรงจัด'
  };
  return chars.map(c => map[c] || c).join(', ');
}

function formatNeckpainRadiation(patient) {
  if (!patient.neckpainRadMaster) return 'ไม่ได้ระบุ';
  if (patient.neckpainRadMaster === 'none') return 'ปวดเฉพาะที่ ไม่ร้าวไปไหน';
  const rads = Array.isArray(patient.neckpainRadLoc) ? patient.neckpainRadLoc : [];
  if (rads.length === 0) return 'มีปวดร้าว (ไม่ได้ระบุตำแหน่ง)';
  const map = {
    rad_arm_fingers: 'ร้าวลงแขน ข้อศอก หรือปลายนิ้วมือ',
    rad_head_occiput: 'ร้าวขึ้นศีรษะ ท้ายทอย หรือขมับ',
    rad_jaw_chest: 'ร้าวไปขากรรไกร คอหอย หรือหน้าอก',
    rad_interscapular_tearing: 'ร้าวทะลุหลังไประหว่างสะบักสองข้าง'
  };
  return `ปวดร้าวไปยัง: ${rads.map(r => map[r] || r).join(', ')}`;
}

function formatNeckpainErgonomics(patient) {
  const ergos = Array.isArray(patient.neckpainErgonomics) ? patient.neckpainErgonomics : [];
  if (ergos.length === 0) return patient.neckErgoNone ? 'ปฏิเสธปัจจัยท่าทางข้างต้น' : 'ไม่ได้ระบุ';
  const map = {
    office_tech_neck: 'นั่งทำงานหน้าจอคอมฯ หรือก้มดูจอนาน',
    awkward_twist_strain: 'บิดตัวหรือออกแรงผิดท่าก่อนมีอาการ',
    poor_sleep_posture: 'นอนตกหมอนหรือคอบิดเกร็ง',
    heavy_bag_shoulder: 'สะพายกระเป๋าหนักบ่อยๆ',
    worse_neck_motion: 'ปวดมากขึ้นเมื่อก้ม เงย หรือเอียงคอ'
  };
  return ergos.map(e => map[e] || e).join(', ');
}

// --- Rapid Note HPI Renderer (Doctor View) ---
function renderNeckpainRapidHpi(patient) {
  const durVal = patient.durationVal;
  const durUnitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durUnit = durUnitMap[patient.durationUnit] || 'วัน';
  const durationStr = durVal ? `${durVal} ${durUnit}` : 'ไม่ระบุ';

  const onsetMap = {
    sudden_severe: 'ปวดรุนแรงทันทีทันใด (ฉับพลัน)',
    gradual_worsening: 'ค่อยๆ ปวดเพิ่มขึ้นเรื่อยๆ'
  };
  const onsetStr = onsetMap[patient.neckpainOnsetMode] || 'ไม่ได้ระบุ';

  const pScore = (typeof patient.painScore === 'number' && patient.painScore > 0)
    ? `${patient.painScore}/10 คะแนน`
    : (patient.painScore === 0 ? '0/10 คะแนน (ไม่ปวด / สบายดี)' : 'ไม่ได้ระบุ');

  const warnSigns = Array.isArray(patient.neckpainWarningSigns) ? patient.neckpainWarningSigns : [];
  const traumaTypes = Array.isArray(patient.neckpainTraumaTypes) ? patient.neckpainTraumaTypes : [];

  const posList = [];
  const negList = [];

  if (patient.neckpainOnsetMode === 'sudden_severe') posList.push('ปวดรุนแรงทันทีทันใด (ฉับพลัน)');
  if (Array.isArray(patient.neckpainRadLoc) && patient.neckpainRadLoc.includes('rad_arm_fingers')) {
    posList.push('ปวดร้าวลงแขนถึงปลายนิ้ว');
  }
  if (Array.isArray(patient.neckpainRadLoc) && patient.neckpainRadLoc.includes('rad_jaw_chest')) {
    posList.push('ปวดร้าวไปขากรรไกรหรือหน้าอก');
  }
  if (Array.isArray(patient.neckpainRadLoc) && patient.neckpainRadLoc.includes('rad_interscapular_tearing')) {
    posList.push('ปวดร้าวทะลุหลังระหว่างสะบักสองข้าง');
  }

  if (warnSigns.includes('hand_clumsy_weak')) posList.push('มืออ่อนแรง หยิบของหลุดง่าย ติดกระดุมเสื้อลำบาก');
  if (warnSigns.includes('arm_weakness_abduction')) posList.push('แขนอ่อนแรง ยกแขนไม่ขึ้น หรืองอข้อศอกไม่ได้');
  if (warnSigns.includes('arm_numbness_fingers')) posList.push('ชาตามแนวแขน ฝ่ามือ หรือปลายนิ้ว');
  if (warnSigns.includes('gait_ataxia_spastic')) posList.push('เดินเซ ขาแข็งกระตุก ทรงตัวไม่อยู่');
  if (warnSigns.includes('nuchal_rigidity_headache')) posList.push('ปวดท้ายทอยรุนแรงฉับพลัน หรือคอแข็งก้มไม่ลง');
  if (warnSigns.includes('diplopia_ptosis_horner')) posList.push('ตาพร่ามัว เห็นภาพซ้อน หรือหนังตาตกข้างหนึ่ง');
  if (warnSigns.includes('facial_numb_speech')) posList.push('หน้าชา ปากเบี้ยว หรือพูดไม่ชัด');
  if (warnSigns.includes('ataxia_vertigo_syncope')) posList.push('วูบ หน้ามืด หรือมีอาการบ้านหมุนโคลงเคลงรุนแรง');
  if (warnSigns.includes('fever_chills')) posList.push('มีไข้สูง หนาวสั่นสะท้าน');
  if (warnSigns.includes('dysphagia_stridor')) posList.push('กลืนอาหารลำบาก เจ็บคอมาก หรือหายใจมีเสียงหวีด');
  if (warnSigns.includes('chest_dyspnea_sweat')) posList.push('แน่นหน้าอก หอบเหนื่อย หรือเหงื่อแตกตัวเย็น');
  if (warnSigns.includes('local_mass_wound_pus')) posList.push('มีก้อน แผล หนอง ผื่น หรือฝีบริเวณคอบ่า');
  if (warnSigns.includes('cancer_weight_loss')) posList.push('มีประวัติโรคมะเร็ง และน้ำหนักลดลงฮวบผิดปกติ');

  if (patient.neckpainTraumaMaster === 'yes') {
    if (traumaTypes.includes('high_impact_mva_whiplash')) posList.push('ประวัติรถชน/ถูกชนท้าย/คอกระชากสะบัดแรง');
    if (traumaTypes.includes('fall_diving_head_neck')) posList.push('พลัดตกจากที่สูง/หกล้ม/กระโดดน้ำศีรษะกระแทก');
    if (traumaTypes.includes('sports_neck_injury')) posList.push('อุบัติเหตุจากการเล่นกีฬาที่มีการกระแทกคอ');
    if (traumaTypes.includes('trauma_other') && patient.neckpainTraumaOtherText) {
      posList.push(`อุบัติเหตุอื่นๆ: ${patient.neckpainTraumaOtherText}`);
    }
  }

  if (patient.otherSymptomsFree) {
    posList.push(patient.otherSymptomsFree);
  }

  // Per-group Zero Default Bias Prevention (P-AP14 / C-AP20)
  const armConfirmed = Boolean(patient.neckWarnArmNone) || NECK_WARN_GROUPS.arm.some(k => warnSigns.includes(k));
  const neuroConfirmed = Boolean(patient.neckWarnNeuroNone) || NECK_WARN_GROUPS.neuro.some(k => warnSigns.includes(k));
  const sysConfirmed = Boolean(patient.neckWarnSysNone) || NECK_WARN_GROUPS.sys.some(k => warnSigns.includes(k));

  if (armConfirmed) {
    if (!warnSigns.includes('hand_clumsy_weak') && !warnSigns.includes('arm_weakness_abduction')) {
      negList.push('แขนและมือไม่อ่อนแรง ติดกระดุมได้ปกติ');
    }
    if (!warnSigns.includes('arm_numbness_fingers')) {
      negList.push('ไม่มีอาการชาตามแขนหรือปลายนิ้ว');
    }
    if (!warnSigns.includes('gait_ataxia_spastic')) {
      negList.push('เดินได้ปกติ ขาไม่แข็งกระตุก ไม่เดินเซ');
    }
  }
  if (neuroConfirmed) {
    if (!warnSigns.includes('nuchal_rigidity_headache') && !warnSigns.includes('diplopia_ptosis_horner') && !warnSigns.includes('facial_numb_speech') && !warnSigns.includes('ataxia_vertigo_syncope')) {
      negList.push('ปฏิเสธคอแข็ง ภาพซ้อน หนังตาตก ปากเบี้ยว หรือบ้านหมุน');
    } else {
      if (!warnSigns.includes('nuchal_rigidity_headache')) negList.push('ปฏิเสธคอแข็งก้มไม่ลง');
      if (!warnSigns.includes('diplopia_ptosis_horner')) negList.push('ปฏิเสธตาพร่า ภาพซ้อน หรือหนังตาตก');
      if (!warnSigns.includes('facial_numb_speech')) negList.push('ปฏิเสธหน้าชา ปากเบี้ยว หรือพูดไม่ชัด');
    }
  }
  if (sysConfirmed) {
    if (!warnSigns.includes('fever_chills')) negList.push('ปฏิเสธไข้หนาวสั่น');
    if (!warnSigns.includes('dysphagia_stridor')) negList.push('กลืนได้ปกติ หายใจไม่มีเสียงหวีด');
    if (!warnSigns.includes('chest_dyspnea_sweat')) negList.push('ปฏิเสธแน่นหน้าอก หอบเหนื่อย หรือเหงื่อแตกตัวเย็น');
    if (!warnSigns.includes('local_mass_wound_pus')) negList.push('ไม่มีก้อนบวม แผล ตุ่มหนอง หรือฝีบริเวณคอบ่า');
    if (!warnSigns.includes('cancer_weight_loss')) negList.push('ปฏิเสธประวัติมะเร็งเดิม และน้ำหนักไม่ลดฮวบ');
  }
  if (patient.neckpainTraumaMaster === 'no') {
    negList.push('ปฏิเสธประวัติอุบัติเหตุหรือแรงกระแทกนำมาก่อน');
  }

  const hospLabel = {
    complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
    additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
    self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
    unspecified: 'ไม่ได้ระบุ'
  }[patient.hospRecordStatus] || 'ไม่ได้ระบุ';

  const udArr = Array.isArray(patient.underlying) ? patient.underlying : (patient.underlying ? [patient.underlying] : []);
  const filteredUd = udArr.filter(u => u && !u.includes('ปฏิเสธ') && u !== 'ไม่มี' && u !== 'ไม่มีโรคประจำตัว' && u !== 'ไม่ได้ระบุ');
  const hasExplicitUdDeny = udArr.some(u => u && (u.includes('ปฏิเสธ') || u === 'ไม่มี' || u === 'ไม่มีโรคประจำตัว'));
  const udDisplay = filteredUd.length > 0
    ? filteredUd.join(', ')
    : ((hasExplicitUdDeny || patient.hospRecordStatus === 'self' || patient.hospRecordStatus === 'additional') ? 'ปฏิเสธ' : 'ไม่ได้ระบุ');

  const allergyDisplay = (!patient.drugAllergy || patient.drugAllergy === 'ไม่ได้ระบุ')
    ? 'ไม่ได้ระบุ'
    : ((patient.drugAllergy.includes('ปฏิเสธ') || patient.drugAllergy === 'ไม่มี') ? 'ปฏิเสธ' : patient.drugAllergy);
  const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ')
    ? 'ไม่ได้ระบุ'
    : (patient.currentMeds === 'ไม่มี' ? 'ไม่มี' : patient.currentMeds);
  const docNotes = patient.doctor_notes || {};
  const redFlags = evaluateNeckpainRedFlags(patient);

  const defaultRapid =
`[Chief Complaint (CC)]
ปวดต้นคอ / บ่า / หลังช่วงบน (Neck, Shoulder & Upper Back Pain) มา ${durationStr}

[History of Present Illness (HPI)]
• ระยะเวลาที่มีอาการ: ${durVal ? `ปวดมา ${durationStr}` : 'ไม่ระบุ'}
• ตำแหน่งที่ปวด: ${formatNeckpainLocations(patient)}
• ลักษณะการเริ่มปวด: ${onsetStr}
• ลักษณะอาการปวด: ${formatNeckpainChars(patient)}
• การปวดร้าว: ${formatNeckpainRadiation(patient)}
• พฤติกรรมและปัจจัยกระตุ้น: ${formatNeckpainErgonomics(patient)}
• ระดับความเจ็บปวด (Pain Score): ${pScore}

• Pertinent Positives:
${posList.length > 0 ? posList.map(p => `  - ${p}`).join('\n') : '  - ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม'}

• Pertinent Negatives:
${negList.length > 0 ? negList.map(n => `  - ${n}`).join('\n') : '  - ผู้ป่วยไม่ได้ระบุคำตอบยืนยันในหมวดอาการร่วม'}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• โรคประจำตัว (U/D): ${udDisplay}
• ยาประจำตัว (Current Meds): ${medsText}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${allergyDisplay}

[Emergency Risk Assessment (Red Flags)]
${redFlags.length > 0
  ? `🚩 RED FLAGS DETECTED:\n${redFlags.map(rf => `  * ${rf.textTh}`).join('\n')}`
  : '✓ ไม่พบสัญญาณเตือนวิกฤตเฉียบพลันเบื้องต้น'}

[Doctor's Clinical Addendum & Exam]
• ประวัติเพิ่มเติม/แก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}
• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}
• แผนการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

  return defaultRapid;
}

// --- Narrative Note Generator (Doctor View) ---
function renderNeckpainNarrative(patient) {
  const durStr = patient.durationVal
    ? `${patient.durationVal} ${patient.durationUnit === 'minutes' ? 'นาที' : (patient.durationUnit === 'hours' ? 'ชั่วโมง' : (patient.durationUnit === 'weeks' ? 'สัปดาห์' : (patient.durationUnit === 'months' ? 'เดือน' : (patient.durationUnit === 'years' ? 'ปี' : 'วัน'))))}`
    : 'ไม่ระบุระยะเวลา';

  const locStr = formatNeckpainLocations(patient);
  const charStr = formatNeckpainChars(patient);
  const radStr = formatNeckpainRadiation(patient);
  const pScore = (typeof patient.painScore === 'number') ? `${patient.painScore}/10 คะแนน` : 'ไม่ได้ระบุ';

  const warnSigns = Array.isArray(patient.neckpainWarningSigns) ? patient.neckpainWarningSigns : [];
  const genderLabel = (patient.gender && patient.gender !== 'ไม่ระบุ') ? patient.gender : '';

  let note = `ผู้ป่วย${genderLabel} อายุ ${patient.age || 'ไม่ระบุ'} ปี มารับการตรวจที่ห้องฉุกเฉินด้วยอาการปวดต้นคอ/บ่า/หลังช่วงบน เป็นมา ${durStr} ก่อนมาโรงพยาบาล ตำแหน่งปวดบริเวณ${locStr} ลักษณะปวดเป็นแบบ${charStr} ${radStr} ระดับความเจ็บปวดประเมินได้ ${pScore}`;

  if (warnSigns.length > 0) {
    const warnTexts = [];
    if (warnSigns.includes('hand_clumsy_weak')) warnTexts.push('มืออ่อนแรงหยิบของหลุดง่าย');
    if (warnSigns.includes('arm_weakness_abduction')) warnTexts.push('แขนอ่อนแรงยกไม่ขึ้น');
    if (warnSigns.includes('arm_numbness_fingers')) warnTexts.push('ชาตามแนวแขนหรือปลายนิ้ว');
    if (warnSigns.includes('gait_ataxia_spastic')) warnTexts.push('เดินเซขากระตุก');
    if (warnSigns.includes('nuchal_rigidity_headache')) warnTexts.push('ปวดท้ายทอยคอแข็งก้มไม่ลง');
    if (warnSigns.includes('diplopia_ptosis_horner')) warnTexts.push('เห็นภาพซ้อนหรือหนังตาตก');
    if (warnSigns.includes('facial_numb_speech')) warnTexts.push('หน้าชาหรือพูดไม่ชัด');
    if (warnSigns.includes('ataxia_vertigo_syncope')) warnTexts.push('วูบหน้ามืดหรือบ้านหมุน');
    if (warnSigns.includes('fever_chills')) warnTexts.push('มีไข้สูงหนาวสั่น');
    if (warnSigns.includes('dysphagia_stridor')) warnTexts.push('กลืนลำบากหรือหายใจมีเสียงหวีด');
    if (warnSigns.includes('chest_dyspnea_sweat')) warnTexts.push('แน่นหน้าอกหอบเหนื่อยเหงื่อแตก');
    if (warnSigns.includes('local_mass_wound_pus')) warnTexts.push('มีก้อน แผล หนอง ผื่น หรือฝีบริเวณคอบ่า');
    if (warnSigns.includes('cancer_weight_loss')) warnTexts.push('น้ำหนักลดลงฮวบผิดปกติ');
    note += ` ร่วมกับมีอาการสำคัญ: ${warnTexts.join(', ')}`;
  } else if (patient.neckpainTraumaMaster === 'no') {
    note += ' ผู้ป่วยปฏิเสธประวัติอุบัติเหตุหรือแรงกระแทกนำมาก่อน';
  }

  if (patient.neckpainTraumaMaster === 'yes') {
    const tTypes = Array.isArray(patient.neckpainTraumaTypes) ? patient.neckpainTraumaTypes : [];
    const tTexts = [];
    if (tTypes.includes('high_impact_mva_whiplash')) tTexts.push('อุบัติเหตุรถชน/คอกระชากสะบัด');
    if (tTypes.includes('fall_diving_head_neck')) tTexts.push('ตกจากที่สูง/หกล้ม/กระโดดน้ำศีรษะกระแทก');
    if (tTypes.includes('sports_neck_injury')) tTexts.push('อุบัติเหตุกระแทกคอจากการเล่นกีฬา');
    if (tTypes.includes('trauma_other') && patient.neckpainTraumaOtherText) tTexts.push(patient.neckpainTraumaOtherText);
    if (tTexts.length > 0) note += ` โดยมีประวัตินำมาก่อนคือ: ${tTexts.join(', ')}`;
  }

  return note;
}

function renderNeckpainDoctorHpi(patient) {
  return renderNeckpainRapidHpi(patient);
}

function updateNeckpainOutputs(rec) {
  if (!rec) return null;
  const rapidText = renderNeckpainRapidHpi(rec);
  const narrativeText = renderNeckpainNarrative(rec);

  rec.rapidHpi = rec.custom_rapid_note || rapidText;
  rec.narrativeHpi = rec.custom_narrative_note || narrativeText;

  const hasDoc = typeof document !== 'undefined';
  const rapidEl = hasDoc ? document.getElementById('rapidTextView') : null;
  const narrativeEl = hasDoc ? document.getElementById('narrativeTextView') : null;
  if (rapidEl) rapidEl.value = rec.rapidHpi;
  if (narrativeEl) narrativeEl.value = rec.narrativeHpi;

  const posMatch = rapidText.match(/• Pertinent Positives:\n((?:\s*-[^\n]+\n?)+)/);
  if (posMatch) {
    rec.pertinentPositives = posMatch[1].trim().split('\n').map(l => l.replace(/^[-*\s]+/, '').trim());
  } else {
    rec.pertinentPositives = ['ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม'];
  }

  const negMatch = rapidText.match(/• Pertinent Negatives:\n((?:\s*-[^\n]+\n?)+)/);
  if (negMatch) {
    rec.pertinentNegatives = negMatch[1].trim().split('\n').map(l => l.replace(/^[-*\s]+/, '').trim());
  } else {
    rec.pertinentNegatives = ['ผู้ป่วยไม่ได้ระบุคำตอบยืนยันในหมวดอาการร่วม'];
  }

  const redFlags = evaluateNeckpainRedFlags(rec);
  rec.redFlags = redFlags;

  const jsonOutput = {
    encounter: {
      chief_complaint: 'neck_shoulder_pain',
      chief_complaint_title_th: 'ปวดต้นคอ / บ่า / หลังช่วงบน',
      timestamp: rec.timestamp || new Date().toISOString(),
      duration_val: rec.durationVal || null,
      duration_unit: rec.durationUnit || 'days'
    },
    patient_identification: {
      id: rec.id || null,
      queue_number: rec.queue_number || null,
      hn: rec.hn || null,
      name: rec.name || null,
      age: rec.age !== undefined ? rec.age : null,
      gender: rec.gender || null
    },
    triage_assessment: {
      locations: Array.isArray(rec.neckpainLoc) ? rec.neckpainLoc : [],
      location_sides: {
        posterior: Array.isArray(rec.neckpainLocPostSide) ? rec.neckpainLocPostSide : [],
        lateral: Array.isArray(rec.neckpainLocLatSide) ? rec.neckpainLocLatSide : [],
        trapezius_shoulder: Array.isArray(rec.neckpainLocTrapSide) ? rec.neckpainLocTrapSide : [],
        interscapular: Array.isArray(rec.neckpainLocScapSide) ? rec.neckpainLocScapSide : []
      },
      onset_mode: rec.neckpainOnsetMode || null,
      pain_characteristics: Array.isArray(rec.neckpainChar) ? rec.neckpainChar : [],
      radiation_master: rec.neckpainRadMaster || null,
      radiation: Array.isArray(rec.neckpainRadLoc) ? rec.neckpainRadLoc : [],
      ergonomics: Array.isArray(rec.neckpainErgonomics) ? rec.neckpainErgonomics : [],
      pain_score: rec.painScore !== null && rec.painScore !== undefined ? rec.painScore : null,
      warning_signs: Array.isArray(rec.neckpainWarningSigns) ? rec.neckpainWarningSigns : [],
      trauma_master: rec.neckpainTraumaMaster || null,
      trauma_types: Array.isArray(rec.neckpainTraumaTypes) ? rec.neckpainTraumaTypes : [],
      other_symptoms_free: rec.otherSymptomsFree || ''
    },
    safety_and_red_flags: {
      red_flags_detected: redFlags.map(rf => ({
        key: rf.key,
        level: rf.level,
        title_th: rf.textTh,
        clinical_risk: rf.risk,
        action: rf.suggestedAction
      })),
      total_red_flags: redFlags.length
    }
  };
  rec.medicalJson = jsonOutput;

  const jsonEl = hasDoc ? document.getElementById('jsonViewer') : null;
  if (jsonEl) jsonEl.textContent = JSON.stringify(jsonOutput, null, 2);

  return { rapid: rec.rapidHpi, narrative: rec.narrativeHpi, json: jsonOutput };
}

if (typeof window !== 'undefined') {
  Object.assign(window, {
    syncNeckpainSideWrap,
    toggleNeckpainSideGroup,
    toggleNeckpainRadiationSub,
    toggleNeckpainWarningGroup,
    handleNeckWarningItemChange,
    handleNeckWarningNoneToggle,
    handleNeckErgoItemChange,
    handleNeckErgoNoneToggle,
    toggleNeckpainTraumaSub,
    toggleNeckpainTraumaOther
  });
}
