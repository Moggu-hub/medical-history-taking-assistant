// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 11_vomiting.js
// อาการนำ: คลื่นไส้ / อาเจียน (Nausea & Vomiting — 3-Card Golden UX)
// ไฟล์นี้แยกอิสระสำหรับอาการนำ vomiting เพื่อให้ทีมแพทย์และ IT โรงพยาบาลนำไปพัฒนาต่อได้โดยไม่กระทบระบบหลัก
// =========================================================================

// --- Sync CC Registry Metadata (ตัดคำว่า "รุนแรง" โดยไม่แก้ไข core_engine.js) ---
function syncVomitingCcRegistryMeta() {
  if (typeof CC_REGISTRY !== 'undefined' && CC_REGISTRY.vomiting) {
    CC_REGISTRY.vomiting.titleTh = 'คลื่นไส้ / อาเจียน';
    CC_REGISTRY.vomiting.headerTh = 'แบบฟอร์มซักประวัติ: คลื่นไส้ / อาเจียน';
    CC_REGISTRY.vomiting.headerEn = '(Nausea & Vomiting)';
    CC_REGISTRY.vomiting.badgeHtml = '<i data-lucide="frown" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"></i><span class="whitespace-nowrap">คลื่นไส้ / อาเจียน</span>';
  }
  if (typeof currentPatientFormCC !== 'undefined' && currentPatientFormCC === 'vomiting') {
    const hTh = document.getElementById('patientFormHeaderTitleTh');
    const hEn = document.getElementById('patientFormHeaderTitleEn');
    const badge = document.getElementById('patientFormCcBadge');
    if (hTh) hTh.textContent = 'แบบฟอร์มซักประวัติ: คลื่นไส้ / อาเจียน';
    if (hEn) hEn.textContent = '(Nausea & Vomiting)';
    if (badge) badge.innerHTML = '<i data-lucide="frown" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"></i><span class="whitespace-nowrap">คลื่นไส้ / อาเจียน</span>';
  }
}

if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
  document.addEventListener('DOMContentLoaded', syncVomitingCcRegistryMeta);
}

// --- Static Dictionaries & Lookup Maps (100% Thai Clinical Output, Zero Raw Enum Leaks) ---
const VOM_LABELS = {
  units: { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' },
  onset: {
    sudden_severe: 'เป็นทันที รุนแรงตั้งแต่แรก',
    gradual_worsening: 'ค่อยๆ คลื่นไส้ แล้วอาเจียนถี่ขึ้น',
    intermittent_spells: 'เป็นๆ หายๆ เป็นระลอก'
  },
  freq: {
    mild_1_2: '1–2 ครั้ง',
    moderate_3_5: '3–5 ครั้ง',
    severe_6_10: '6–10 ครั้ง',
    intractable_gt_10: 'มากกว่า 10 ครั้ง / ตลอดเวลา (Intractable)'
  },
  foodRel: {
    immediate_postprandial: 'อาเจียนทันที หลังทานไม่เกิน 15 นาที',
    delayed_postprandial_hours: 'อาเจียนหลังทาน 1–3 ชม.',
    morning_fasting: 'อาเจียนตอนเช้า / ขณะท้องว่าง',
    independent_constant: 'อาเจียนตลอดเวลา แม้ไม่ทานอะไร'
  },
  vomitusChar: {
    clear_gastric_juice: 'น้ำใส / น้ำลาย / น้ำย่อยใสๆ',
    food_particles: 'เศษอาหารที่เพิ่งทาน',
    undigested_old_food: 'เศษอาหารเก่าค้างมื้อ (หลายชั่วโมงหรือข้ามวัน)',
    yellow_green_bile: 'น้ำดีสีเขียว / เหลืองเข้ม (Bile-stained)',
    brown_feculent: 'สีน้ำตาล กลิ่นเหม็นคล้ายอุจจาระ 🚩 (Feculent Vomiting)',
    blood_bright_red: 'มีเลือดสีแดงสดปน 🚩 (Hematemesis)',
    blood_coffee_ground: 'สีกาแฟคั่ว / กากสีดำ 🚩 (Coffee-ground Vomitus)'
  },
  patternType: {
    normal_retching: 'มีคลื่นไส้พะอืดพะอมนำมาก่อน',
    projectile_vomiting: 'อาเจียนพุ่งแรงทันที แทบไม่คลื่นไส้นำ 🚩 (Projectile Vomiting)'
  },
  volume: {
    small_sip: 'เล็กน้อย (ไม่เกินครึ่งแก้ว)',
    moderate_cup: 'ปานกลาง (ประมาณ 1 แก้ว)',
    large_bowl: 'มาก (เต็มชามหรือกะละมัง)'
  },
  oral: {
    can_drink_water: 'จิบน้ำ / เกลือแร่ได้บ้าง',
    intolerant_vomit_all: 'ดื่มไม่ได้เลย ทานแล้วอาเจียนออกหมด 🚩 (Oral Intolerance)'
  },
  dehy: {
    oliguria_anuria: 'ปัสสาวะออกน้อย / ไม่ออก > 8 ชม. 🚩',
    marked_dry_mouth_thirst: 'ปากแห้งมาก / กระหายน้ำจัด',
    postural_dizziness_blackout: 'ลุกยืนแล้วหน้ามืด / วูบ 🚩',
    cold_clammy_extremities: 'มือเท้าเย็นชืด 🚩'
  },
  abdpainLoc: {
    epigastrium: 'ใต้ลิ้นปี่',
    ruq: 'ใต้ชายโครงขวา',
    periumbilical: 'รอบสะดือ',
    rlq: 'ท้องน้อยขวา',
    llq: 'ท้องน้อยซ้าย',
    diffuse: 'ทั่วท้อง'
  },
  abdpainChar: {
    cramping_colicky: 'ปวดบิดเป็นพักๆ',
    constant_severe: 'ปวดรุนแรงต่อเนื่อง ขยับเจ็บสะเทือน 🚩',
    dull_aching: 'ปวดตื้อๆ แน่นๆ'
  },
  diarrheaStool: {
    watery: 'น้ำเหลวล้วน',
    mucus: 'มีมูกปน',
    bloody: 'มีเลือดสดปน 🚩',
    dark_tarry: 'สีดำคล้ำ 🚩'
  },
  bloodyStool: {
    bright_red_coating: 'เลือดแดงสดเคลือบก้อนอุจจาระ',
    pure_bright_red: 'ถ่ายเป็นเลือดแดงสดล้วน 🚩',
    dark_clots: 'ถ่ายเป็นลิ่มเลือดสีคล้ำ 🚩',
    black_tarry_melena: 'ถ่ายดำเหนียวคล้ายยางมะตอย 🚩 (Melena)',
    maroon_wash: 'ถ่ายสีแดงคล้ำคล้ายน้ำล้างเนื้อ 🚩'
  },
  constipationSub: {
    no_stool_no_gas: 'ไม่ถ่ายและไม่ผายลมเลย 🚩 (Complete Obstipation)',
    no_stool_can_pass_gas: 'ไม่ถ่าย แต่ยังผายลมได้ (Partial Obstruction)',
    hard_pellet_stool: 'ถ่ายก้อนแข็งเม็ดกระสุน',
    watery_overflow_scant: 'ถ่ายเหลวเล็ดครั้งละน้อย'
  },
  priorSurgery: {
    yes: 'เคยผ่าตัดช่องท้อง 🚩',
    no: 'ไม่เคย',
    unsure: 'ไม่แน่ใจ'
  },
  cardiac: {
    chest_tightness_pressure: 'แน่น / เจ็บหน้าอก (หรือร้าวไปกราม/แขนซ้าย) 🚩',
    diaphoresis_cold_sweat: 'เหงื่อแตกท่วมตัว ตัวเย็น 🚩',
    syncope_presyncope: 'หน้ามืด / วูบหมดสติ 🚩',
    palpitation_racing_heart: 'ใจสั่น / หัวใจเต้นรัว'
  },
  neuro: {
    severe_sudden_headache: 'ปวดศีรษะรุนแรงฉับพลัน 🚩',
    stiff_neck: 'คอแข็ง ก้มคอไม่ได้ 🚩',
    focal_weakness_numbness: 'แขนขาอ่อนแรง / ปากเบี้ยว 🚩',
    diplopia_blurred_vision: 'เห็นภาพซ้อน / ตามัวเฉียบพลัน 🚩',
    vertigo_ataxia: 'เวียนหัวบ้านหมุน / เดินเซ',
    confusion_drowsiness: 'ซึมลง / สับสน 🚩'
  },
  precip: {
    general_food_poisoning: 'อาหารค้างคืน / มีผู้ร่วมทานป่วยคล้ายกัน',
    natural_toxin_food: 'อาหารเสี่ยงสารพิษธรรมชาติ (เห็ดป่า/กลอย/หน่อไม้/แมงดาถ้วย/ปลาปักเป้า/ลูกเนียง/สบู่ดำ-แดง) 🚩',
    high_risk_medications: 'ทานยากลุ่มความเสี่ยงสูง',
    missed_dm_insulin: 'ขาดยาเบาหวาน / ไม่ได้ฉีดอินซูลิน 🚩',
    known_diabetes: 'มีประวัติโรคเบาหวาน',
    heavy_alcohol_or_withdrawal: 'ดื่มสุราหนัก / เพิ่งหยุดดื่มกะทันหัน',
    suspected_toxin_chemical: 'กินยาเกินขนาด / สารเคมีเกษตร 🚩'
  },
  medList: {
    digoxin: 'ยาหัวใจ Digoxin 🚩',
    nsaids: 'ยาแก้ปวดข้อ NSAIDs',
    herbal_bolus: 'ยาต้ม / ยาลูกกลอน',
    chemotherapy: 'ยาเคมีบำบัด',
    antibiotics: 'ยาปฏิชีวนะ',
    lithium_psych: 'ยาจิตเวช Lithium 🚩'
  },
  coEaters: {
    symptomatic: 'มีผู้อื่นมีอาการเหมือนกัน',
    asymptomatic: 'ผู้อื่นไม่มีอาการ',
    ate_alone: 'ทานคนเดียว'
  },
  pregnancyStatus: {
    pregnant: 'กำลังตั้งครรภ์ 🚩',
    suspected: 'สงสัยว่าอาจตั้งครรภ์ 🚩',
    not_pregnant: 'ไม่ได้ตั้งครรภ์',
    unsure: 'ไม่แน่ใจสถานะการตั้งครรภ์',
    menopause: 'หมดประจำเดือนแล้ว'
  },
  lmpStatus: {
    regular_lmp_exact: 'จำวันที่แน่นอนได้',
    approx_recent: 'จำได้คร่าวๆ (1–4 สัปดาห์ก่อน)',
    missed_period: 'ประจำเดือนขาดอย่างน้อย 1 รอบ 🚩',
    unknown: 'จำไม่ได้ / ไม่แน่ใจ',
    post_menopausal_or_hysterectomy: 'หมดประจำเดือนแล้ว',
    not_applicable_child: 'ยังไม่เคยมีประจำเดือน'
  },
  pregTest: {
    not_tested: 'ยังไม่ได้ตรวจครรภ์',
    tested_negative: 'ตรวจครรภ์ผลลบ (1 ขีด)',
    tested_positive: 'ตรวจครรภ์ผลบวก (2 ขีด) 🚩'
  },
  hospStatus: {
    complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
    additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
    self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
    unspecified: 'ไม่ได้ระบุ'
  }
};

// --- DOM Helpers ---
function toggleVomBranch(id, show) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('hidden', !show);
}

function getVomRadioVal(name) {
  return document.querySelector(`input[name="${name}"]:checked`)?.value || '';
}

function setVomRadioVal(name, val) {
  document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
    r.checked = Boolean(val) && r.value === val;
  });
}

function getVomCheckedVals(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(el => el.value);
}

function setVomCheckedVals(name, vals) {
  const arr = Array.isArray(vals) ? vals : [];
  document.querySelectorAll(`input[name="${name}"]`).forEach(el => {
    el.checked = arr.includes(el.value);
  });
}

function clearVomNone(noneId) {
  const el = document.getElementById(noneId);
  if (el) el.checked = false;
}

// --- Group Toggle & Dynamic Context Branching Handlers ---
function handleVomitingGroupNoneChange(noneId, itemIds, afterClear) {
  const checked = Boolean(document.getElementById(noneId)?.checked);
  if (!checked) return;
  itemIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.checked = false;
  });
  if (typeof afterClear === 'function') afterClear();
}

function handleVomitingGroupItemChange(noneId, itemId, afterChange) {
  if (itemId && document.getElementById(itemId)?.checked) {
    clearVomNone(noneId);
  }
  if (typeof afterChange === 'function') afterChange();
}

function syncVomitingGiBranches() {
  const hasAbd = Boolean(document.getElementById('vomitingHasAbdominalPain')?.checked);
  toggleVomBranch('vomitingAbdpainWrap', hasAbd);
  if (!hasAbd) {
    setVomCheckedVals('vomitingAbdpainLocs', []);
    setVomRadioVal('vomitingAbdpainChar', '');
  }

  const hasDiar = Boolean(document.getElementById('vomiting_gi_diarrhea')?.checked);
  toggleVomBranch('vomitingDiarrheaWrap', hasDiar);
  if (!hasDiar) {
    const f = document.getElementById('vomitingDiarrheaFreq');
    if (f) f.value = '';
    setVomCheckedVals('vomitingDiarrheaStools', []);
  }

  const hasBlood = Boolean(document.getElementById('vomiting_gi_bloody_stool')?.checked);
  toggleVomBranch('vomitingBloodyStoolWrap', hasBlood);
  if (!hasBlood) {
    setVomRadioVal('vomitingBloodyStoolChar', '');
  }

  const hasConst = Boolean(document.getElementById('vomiting_gi_constipation')?.checked);
  toggleVomBranch('vomitingConstipationWrap', hasConst);
  if (!hasConst) {
    setVomRadioVal('vomitingConstipationSub', '');
    setVomRadioVal('vomitingPriorAbdominalSurgery', '');
  }
}

function syncVomitingPrecipBranches() {
  const hasToxFood = Boolean(document.getElementById('vomitingToxinFoodCb')?.checked);
  toggleVomBranch('vomitingToxinFoodWrap', hasToxFood);
  if (!hasToxFood) {
    ['vomitingToxinFoodType', 'vomitingToxinFoodTime'].forEach(id => {
      const inp = document.getElementById(id);
      if (inp) { inp.value = ''; inp.disabled = false; }
    });
    const unk = document.getElementById('vomitingToxinFoodTimeUnknown');
    if (unk) unk.checked = false;
    setVomRadioVal('vomitingToxinFoodCoEaters', '');
  }

  const hasMeds = Boolean(document.getElementById('vomitingMedsCb')?.checked);
  toggleVomBranch('vomitingMedsWrap', hasMeds);
  if (!hasMeds) {
    setVomCheckedVals('vomitingMedList', []);
  }

  const hasChem = Boolean(document.getElementById('vomitingChemicalCb')?.checked);
  toggleVomBranch('vomitingChemicalWrap', hasChem);
  if (!hasChem) {
    const inp = document.getElementById('vomitingChemicalDetails');
    if (inp) inp.value = '';
  }
}

function handleVomitingToxinTimeUnknownChange(checked) {
  const inp = document.getElementById('vomitingToxinFoodTime');
  if (!inp) return;
  if (checked) {
    inp.value = '';
    inp.disabled = true;
  } else {
    inp.disabled = false;
  }
}

function handleVomitingPregnancyStatusChange(val) {
  const status = val !== undefined ? val : getVomRadioVal('vomitingPregnancyStatus');
  const showDetail = ['pregnant', 'suspected', 'unsure'].includes(status);
  toggleVomBranch('vomiting_female_detail_wrap', showDetail);
  if (!showDetail) {
    setVomRadioVal('vomiting_lmp_status', '');
    setVomRadioVal('vomitingPregnancyTestSelf', '');
    toggleVomBranch('vomiting_lmp_date_wrap', false);
    const d = document.getElementById('vomitingLmpDate');
    if (d) d.value = '';
  }
}

function handleVomitingLmpStatusChange(val) {
  const s = val !== undefined ? val : getVomRadioVal('vomiting_lmp_status');
  const showDate = s === 'regular_lmp_exact';
  toggleVomBranch('vomiting_lmp_date_wrap', showDate);
  if (!showDate) {
    const d = document.getElementById('vomitingLmpDate');
    if (d) d.value = '';
  }
}

function isVomFemaleTitle() {
  const t = document.getElementById('patientTitleSelect')?.value || '';
  return t.includes('นาง') || t.includes('ด.ญ.') || t.includes('เด็กหญิง') || t.includes('หญิง') || t.includes('Mrs') || t.includes('Ms') || t.includes('Miss');
}

function updateVomitingFemaleContext(arg) {
  let isFem;
  if (typeof arg === 'boolean') isFem = arg;
  else if (arg && typeof arg.isFemale === 'boolean') isFem = arg.isFemale;
  else isFem = isVomFemaleTitle();

  toggleVomBranch('vomiting_branch_female_lmp', isFem);
  if (!isFem) {
    setVomRadioVal('vomitingPregnancyStatus', '');
    handleVomitingPregnancyStatusChange('');
  }
}

// --- Red Flags Evaluator (10 Syndromes — No Under, No Over) ---
function detectVomitingRedFlags(patient) {
  if (!patient || patient.chief_complaint !== 'vomiting') return [];
  const flags = [];

  const char = patient.vomitusCharacter || '';
  const bowel = patient.vomitingBowelHabit || '';
  const hasDiar = Boolean(patient.vomitingHasDiarrhea || bowel === 'diarrhea_active');
  const hasBloodStool = Boolean(patient.vomitingHasBloodyStool || bowel === 'bloody_melena_stool');
  const hasConst = Boolean(patient.vomitingHasConstipation || bowel === 'constipation_obstipation_gte24h');
  const bloodyStoolChar = patient.vomitingBloodyStoolChar || '';
  const diarrheaStools = Array.isArray(patient.vomitingDiarrheaStools) ? patient.vomitingDiarrheaStools : [];
  const constipationSub = patient.vomitingConstipationSub || '';
  const isMarkedDistension = Boolean(patient.vomitingHasDistension || patient.vomitingAbdominalDistension === 'marked_distension_tight');
  const priorSurgery = patient.vomitingPriorAbdominalSurgery === 'yes';

  const cardiac = Array.isArray(patient.vomitingCardiacFlags) ? patient.vomitingCardiacFlags : [];
  const neuro = Array.isArray(patient.vomitingNeuroFlags) ? patient.vomitingNeuroFlags : [];
  const dehy = Array.isArray(patient.vomitingDehydrationSigns) ? patient.vomitingDehydrationSigns : [];
  const precipitants = Array.isArray(patient.vomitingPrecipitants) ? patient.vomitingPrecipitants : [];
  const meds = Array.isArray(patient.vomitingMedList) ? patient.vomitingMedList : [];
  const oralIntol = patient.vomitingOralIntolerance === 'intolerant_vomit_all';

  const hasDmUnderlying = (Array.isArray(patient.underlying) && patient.underlying.some(u => /เบาหวาน|\bDM\b|diabetes/i.test(String(u))))
    || precipitants.includes('known_diabetes')
    || precipitants.includes('missed_dm_insulin');

  // 1. Acute GI Bleeding
  const isHematemesis = char === 'blood_bright_red' || char === 'blood_coffee_ground';
  const isMelenaOrGrossBleed = hasBloodStool && ['black_tarry_melena', 'pure_bright_red', 'dark_clots', 'maroon_wash'].includes(bloodyStoolChar);
  const isDiarrheaBleed = hasDiar && (diarrheaStools.includes('bloody') || diarrheaStools.includes('dark_tarry'));
  if (isHematemesis || isMelenaOrGrossBleed || isDiarrheaBleed) {
    flags.push({
      key: 'vomiting_rf_hematemesis_melena',
      textTh: 'อาเจียนเป็นเลือดแดงสด/สีกาแฟคั่ว หรือถ่ายดำยางมะตอย/ถ่ายเป็นเลือด (Acute GI Bleeding)',
      risk: 'เสี่ยงเลือดออกทางเดินอาหารส่วนต้นรุนแรง (Bleeding PUD / Mallory-Weiss / Varices) ต้องเปิดเส้น IV ขนาดใหญ่ เตรียมเลือด และประเมิน EGD ด่วน'
    });
  }

  // 2. Feculent Vomiting or Severe Peritonitis
  const isFeculent = char === 'brown_feculent';
  const isPeritonitis = Boolean(patient.vomitingHasAbdominalPain && patient.vomitingAbdpainChar === 'constant_severe');
  if (isFeculent || isPeritonitis) {
    flags.push({
      key: 'vomiting_rf_feculent_peritonitis',
      textTh: isFeculent
        ? 'อาเจียนสีน้ำตาลกลิ่นเหม็นคล้ายอุจจาระ (Feculent Vomiting)'
        : 'ปวดท้องรุนแรงต่อเนื่อง ขยับตัวเจ็บสะเทือนมาก (Peritoneal Irritation)',
      risk: 'บ่งชี้ภาวะลำไส้อุดตันขั้นรุนแรงหรือเยื่อบุช่องท้องอักเสบ/ลำไส้ขาดเลือด ต้อง NPO, ใส่ NG tube และปรึกษาศัลยแพทย์ด่วน'
    });
  }

  // 3. Mechanical Small Bowel Obstruction (SBO)
  const isObstipation = hasConst && (constipationSub === 'no_stool_no_gas' || constipationSub === 'no_stool_can_pass_gas');
  const sboScore = [isObstipation, isMarkedDistension, priorSurgery].filter(Boolean).length;
  const isBiliousObstipation = char === 'yellow_green_bile' && hasConst && constipationSub === 'no_stool_no_gas';
  if (sboScore >= 2 || isBiliousObstipation) {
    flags.push({
      key: 'vomiting_rf_obstipation_sbo',
      textTh: 'สงสัยลำไส้อุดตันเฉียบพลัน: ท้องอืดแน่นตึง / ไม่ถ่ายไม่ผายลม / เคยผ่าตัดช่องท้อง (Suspected Mechanical SBO)',
      risk: 'เสี่ยงภาวะลำไส้อุดตันเฉียบพลัน (Mechanical Small Bowel Obstruction) ต้อง NPO, ใส่ NG tube, ส่ง Plain Abdomen / CT และปรึกษาศัลยแพทย์'
    });
  }

  // 4. Atypical ACS / Inferior STEMI
  const hasChestTightness = cardiac.includes('chest_tightness_pressure');
  const hasDiaphoresis = cardiac.includes('diaphoresis_cold_sweat');
  const hasSyncope = cardiac.includes('syncope_presyncope');
  if (hasChestTightness || (hasDiaphoresis && ((patient.age && patient.age >= 50) || hasDmUnderlying || hasSyncope))) {
    flags.push({
      key: 'vomiting_rf_atypical_acs',
      textTh: 'แน่น/เจ็บหน้าอก หรือเหงื่อแตกตัวเย็นร่วมกับปัจจัยเสี่ยงหัวใจ (Suspected Atypical ACS / Inferior STEMI)',
      risk: 'คลื่นไส้อาเจียนอาจเป็นอาการนำของกล้ามเนื้อหัวใจขาดเลือดเฉียบพลันผนังล่าง (Inferior STEMI) ต้องทำ 12-lead EKG ภายใน 10 นาที'
    });
  }

  // 5. Diabetic Ketoacidosis (DKA) / Severe Ketosis
  const hasDkaMarker = dehy.includes('marked_dry_mouth_thirst')
    || dehy.includes('oliguria_anuria')
    || oralIntol
    || patient.vomitingFrequencyToday === 'intractable_gt_10'
    || neuro.includes('confusion_drowsiness');
  if (hasDmUnderlying && hasDkaMarker) {
    flags.push({
      key: 'vomiting_rf_dka_ketosis',
      textTh: 'ผู้ป่วยเบาหวาน/ขาดยาอินซูลินที่มีอาเจียนรุนแรง ขาดน้ำจัด หรือซึมสับสน (Suspected DKA / Severe Ketosis)',
      risk: 'เสี่ยงภาวะเลือดเป็นกรดจากคีโตน (DKA / HHS) ต้องเจาะ DTX ทันที และส่งตรวจ Ketone, Electrolytes และ Blood Gas'
    });
  }

  // 6. Increased ICP / Acute Neurological Deficit
  const isProjectile = patient.vomitingPatternType === 'projectile_vomiting';
  const hasSevereHeadache = neuro.includes('severe_sudden_headache');
  const hasStiffNeck = neuro.includes('stiff_neck');
  const hasFocalDeficit = neuro.includes('focal_weakness_numbness') || neuro.includes('diplopia_blurred_vision');
  const hasAlteredSensorium = neuro.includes('confusion_drowsiness');
  if (isProjectile || hasSevereHeadache || hasStiffNeck || hasFocalDeficit || hasAlteredSensorium) {
    flags.push({
      key: 'vomiting_rf_intracranial_hypertension',
      textTh: isProjectile
        ? 'อาเจียนพุ่งแรงทันทีโดยแทบไม่คลื่นไส้นำ (Projectile Vomiting / Increased ICP)'
        : 'มีอาการเตือนระบบประสาทร่วมด้วย: ปวดศีรษะรุนแรง / คอแข็ง / อ่อนแรงปากเบี้ยว / ภาพซ้อน / ซึมสับสน',
      risk: 'เสี่ยงความดันในกะโหลกศีรษะสูง เลือดออกในสมอง (ICH/SAH) หรือเยื่อหุ้มสมองอักเสบ ต้องตรวจ CT Brain ด่วนและประเมินทางเดินหายใจ'
    });
  }

  // 7. Severe Dehydration / Impending Hypovolemic Shock
  const hasSevereDehySign = dehy.includes('oliguria_anuria')
    || dehy.includes('postural_dizziness_blackout')
    || dehy.includes('cold_clammy_extremities');
  if (oralIntol && hasSevereDehySign) {
    flags.push({
      key: 'vomiting_rf_acute_hypovolemic_shock',
      textTh: 'ดื่มน้ำไม่ได้เลยร่วมกับปัสสาวะไม่ออก / ลุกยืนหน้ามืดวูบ / มือเท้าเย็นชืด (Severe Dehydration / Impending Shock)',
      risk: 'เสี่ยงภาวะช็อกจากการขาดน้ำ ไตวายเฉียบพลัน (Prerenal AKI) และเกลือแร่ผิดปกติ ต้องเปิดเส้นให้สารน้ำ IV ทันที'
    });
  }

  // 8. Natural Food Toxin Poisoning
  if (precipitants.includes('natural_toxin_food')) {
    const detail = patient.vomitingToxinFoodType || patient.vomitingToxinFoodDetails || '';
    flags.push({
      key: 'vomiting_rf_natural_toxin_ingestion',
      textTh: `ประวัติรับประทานอาหารเสี่ยงสารพิษธรรมชาติ${detail ? ` (${detail})` : ''} (Suspected Natural Toxin Poisoning)`,
      risk: 'เสี่ยงภาวะตับวาย ไตวาย หรือพิษต่อระบบประสาทเฉียบพลัน (เห็ดป่า กลอย แมงดาถ้วย ปลาปักเป้า ฯลฯ) ต้องปรึกษาศูนย์พิษวิทยา (1367) ด่วน'
    });
  }

  // 9. High-Risk Drug Toxicity / Chemical Overdose
  const hasDigoxin = meds.includes('digoxin');
  const hasLithium = meds.includes('lithium_psych');
  const isChemical = precipitants.includes('suspected_toxin_chemical');
  if (isChemical || (precipitants.includes('high_risk_medications') && (hasDigoxin || hasLithium))) {
    const toxicList = [];
    if (hasDigoxin) toxicList.push('Digoxin');
    if (hasLithium) toxicList.push('Lithium');
    if (isChemical) toxicList.push(patient.vomitingChemicalDetails || 'สารเคมี/ยาเกินขนาด');
    flags.push({
      key: 'vomiting_rf_high_risk_drug_toxicity',
      textTh: `สงสัยพิษยาหรือสารเคมี: ${toxicList.join(', ')} (Suspected Drug Toxicity / Overdose)`,
      risk: 'เสี่ยงภาวะพิษยา Digoxin/Lithium หรือสารเคมีเกษตร ต้องตรวจ 12-lead EKG, ระดับยา/เฝ้าระวังคลื่นหัวใจ และปรึกษาศูนย์พิษวิทยา'
    });
  }

  // 10. Ruptured Ectopic Pregnancy / Severe Hyperemesis (No Over-triage on mild uncomplicated morning sickness)
  const isFemalePregRisk = patient.gender === 'หญิง' && (
    patient.vomitingPregnancyStatus === 'pregnant'
    || patient.vomitingPregnancyStatus === 'suspected'
    || patient.vomiting_lmp_status === 'missed_period'
    || patient.vomitingPregnancyTestSelf === 'tested_positive'
  );
  const hasPositiveDehy = dehy.some(d => d && d !== 'none_dehydration');
  const hasEctopicOrHyperemesisComplication = Boolean(
    patient.vomitingHasAbdominalPain
    || hasSyncope
    || dehy.includes('postural_dizziness_blackout')
    || oralIntol
    || hasPositiveDehy
  );
  if (isFemalePregRisk && hasEctopicOrHyperemesisComplication) {
    flags.push({
      key: 'vomiting_rf_ruptured_ectopic',
      textTh: 'สตรีตั้งครรภ์/ประจำเดือนขาดที่มีปวดท้อง หน้ามืดวูบ หรือขาดน้ำรุนแรง (Suspected Ectopic Pregnancy / Severe Hyperemesis)',
      risk: 'ต้องแยกภาวะตั้งครรภ์นอกมดลูกแตก (Ruptured Ectopic Pregnancy) และภาวะแพ้ท้องรุนแรงขาดน้ำ ควรตรวจ UPT และอัลตราซาวด์ด่วน'
    });
  }

  return flags;
}

// --- Doctor Output Generation (Rapid Bullet + Narrative + JSON — Zero Default Bias) ---
function updateVomitingOutputs(patient) {
  syncVomitingCcRegistryMeta();

  const durationText = patient.durationVal
    ? `${patient.durationVal} ${VOM_LABELS.units[patient.durationUnit] || 'ชั่วโมง'}`
    : 'ไม่ระบุ';
  const onsetStr = VOM_LABELS.onset[patient.vomitingOnsetMode] || 'ไม่ได้ระบุ';
  const freqStr = VOM_LABELS.freq[patient.vomitingFrequencyToday] || 'ไม่ได้ระบุ';
  const foodRelStr = VOM_LABELS.foodRel[patient.vomitingFoodRelation] || 'ไม่ได้ระบุ';
  const charStr = VOM_LABELS.vomitusChar[patient.vomitusCharacter] || 'ไม่ได้ระบุ';
  const patternStr = VOM_LABELS.patternType[patient.vomitingPatternType] || 'ไม่ได้ระบุ';
  const volStr = VOM_LABELS.volume[patient.vomitusVolumePerTime] || 'ไม่ได้ระบุ';
  const oralStr = VOM_LABELS.oral[patient.vomitingOralIntolerance] || 'ไม่ได้ระบุ';

  // Abdominal pain (Single-Placement at top HPI when positive)
  let abdpainLine = '';
  let abdpainNarr = '';
  if (patient.vomitingHasAbdominalPain) {
    const locs = (Array.isArray(patient.vomitingAbdpainLocs) ? patient.vomitingAbdpainLocs : [])
      .map(l => VOM_LABELS.abdpainLoc[l] || l).join(', ');
    const pChar = VOM_LABELS.abdpainChar[patient.vomitingAbdpainChar] || '';
    const detail = [locs ? `ตำแหน่ง ${locs}` : '', pChar ? `ลักษณะ${pChar}` : ''].filter(Boolean).join(', ');
    abdpainNarr = detail ? `ปวดท้อง (${detail})` : 'มีอาการปวดท้องร่วมด้วย';
    abdpainLine = `\n• อาการปวดท้อง: ${abdpainNarr}`;
  }

  // Female Reproductive History (P-AP13 / C-AP13 / C-AP19: never show for male; 'unsure' -> 'ไม่แน่ใจสถานะการตั้งครรภ์')
  let femaleSummaryStr = '';
  if (patient.gender === 'หญิง') {
    const fParts = [];
    const pregStatus = patient.vomitingPregnancyStatus || '';
    const lmpSt = patient.vomiting_lmp_status || '';
    const pregSelf = patient.vomitingPregnancyTestSelf || '';

    if (pregStatus && VOM_LABELS.pregnancyStatus[pregStatus]) {
      fParts.push(VOM_LABELS.pregnancyStatus[pregStatus]);
    }
    if (lmpSt && VOM_LABELS.lmpStatus[lmpSt]) {
      if (lmpSt === 'regular_lmp_exact') {
        const dt = typeof formatDateDdMmYyyy === 'function' ? formatDateDdMmYyyy(patient.vomitingLmpDate) : (patient.vomitingLmpDate || '');
        fParts.push(dt ? `LMP ${dt}` : 'จำวันแรกประจำเดือนล่าสุดได้ (ไม่ได้ระบุวันที่)');
      } else {
        fParts.push(`ประจำเดือนล่าสุด: ${VOM_LABELS.lmpStatus[lmpSt]}`);
      }
    }
    if (pregSelf && VOM_LABELS.pregTest[pregSelf]) {
      fParts.push(VOM_LABELS.pregTest[pregSelf]);
    }
    femaleSummaryStr = fParts.join(', ');
  }
  const femaleLine = (patient.gender === 'หญิง' && femaleSummaryStr) ? `\n• ประวัติสตรี: ${femaleSummaryStr}` : '';

  // Pertinent Positives & Pertinent Negatives (Zero Default Bias, No Category Prefix in Positives)
  const positives = [];
  const negatives = [];

  // 1) Dehydration
  const dehyArr = Array.isArray(patient.vomitingDehydrationSigns) ? patient.vomitingDehydrationSigns : [];
  const dehyPos = dehyArr.filter(k => k && k !== 'none_dehydration').map(k => VOM_LABELS.dehy[k] || k);
  if (dehyPos.length > 0) dehyPos.forEach(d => positives.push(d));
  else if (patient.vomitingDehydrationNone || dehyArr.includes('none_dehydration')) negatives.push('ไม่มีสัญญาณขาดน้ำรุนแรง');

  // 2) GI / Abdominal & Bowel
  const bowel = patient.vomitingBowelHabit || '';
  const hasDistension = Boolean(patient.vomitingHasDistension || patient.vomitingAbdominalDistension === 'marked_distension_tight');
  const hasFever = Boolean(patient.vomitingHasFever);
  const hasDiar = Boolean(patient.vomitingHasDiarrhea || bowel === 'diarrhea_active');
  const hasBlood = Boolean(patient.vomitingHasBloodyStool || bowel === 'bloody_melena_stool');
  const hasConst = Boolean(patient.vomitingHasConstipation || bowel === 'constipation_obstipation_gte24h');

  if (hasDistension) positives.push('ท้องอืด แน่นตึงมาก 🚩');
  if (hasFever) positives.push('มีไข้ / หนาวสั่น');
  if (hasDiar) {
    const dStools = (Array.isArray(patient.vomitingDiarrheaStools) ? patient.vomitingDiarrheaStools : [])
      .map(s => VOM_LABELS.diarrheaStool[s] || s).join(', ');
    const freqPart = patient.vomitingDiarrheaFreq ? ` ${patient.vomitingDiarrheaFreq} ครั้ง/วัน` : '';
    positives.push(`ถ่ายเหลว${freqPart}${dStools ? ` (${dStools})` : ''}`);
  }
  if (hasBlood) {
    const bChar = VOM_LABELS.bloodyStool[patient.vomitingBloodyStoolChar] || '';
    positives.push(bChar ? `ถ่ายดำ/ถ่ายเป็นเลือด (${bChar})` : 'ถ่ายดำ / ถ่ายเป็นเลือด 🚩');
  }
  if (hasConst) {
    const cChar = VOM_LABELS.constipationSub[patient.vomitingConstipationSub] || '';
    positives.push(cChar ? `ท้องผูก > 24 ชม. (${cChar})` : 'ท้องผูก / ไม่ถ่าย > 24 ชม.');
  }

  const giExplicitNone = Boolean(
    patient.vomitingGiNone
    || (bowel === 'normal_bowel' && !patient.vomitingHasAbdominalPain && !hasDistension && !hasFever && !hasDiar && !hasBlood && !hasConst)
  );
  if (giExplicitNone) {
    negatives.push('ไม่มีอาการทางช่องท้องและขับถ่ายปกติ');
  } else if (bowel === 'normal_bowel' && !hasDiar && !hasBlood && !hasConst) {
    negatives.push('ขับถ่ายอุจจาระและผายลมปกติ');
  }

  // 3) Cardiac
  const cardiacArr = Array.isArray(patient.vomitingCardiacFlags) ? patient.vomitingCardiacFlags : [];
  const cardiacPos = cardiacArr.filter(k => k && k !== 'none_cardiac').map(k => VOM_LABELS.cardiac[k] || k);
  if (cardiacPos.length > 0) cardiacPos.forEach(c => positives.push(c));
  else if (patient.vomitingCardiacNone || cardiacArr.includes('none_cardiac')) negatives.push('ปฏิเสธอาการแน่นหน้าอก เหงื่อแตกตัวเย็น หรือวูบ');

  // 4) Neuro
  const neuroArr = Array.isArray(patient.vomitingNeuroFlags) ? patient.vomitingNeuroFlags : [];
  const neuroPos = neuroArr.filter(k => k && k !== 'none_neuro').map(k => VOM_LABELS.neuro[k] || k);
  if (neuroPos.length > 0) neuroPos.forEach(n => positives.push(n));
  else if (patient.vomitingNeuroNone || neuroArr.includes('none_neuro')) negatives.push('ปฏิเสธอาการปวดศีรษะรุนแรง คอแข็ง แขนขาอ่อนแรง หรือซึมสับสน');

  // 5) Precipitants, High-Risk Meds & Toxins
  const precipArr = Array.isArray(patient.vomitingPrecipitants) ? patient.vomitingPrecipitants : [];
  const precipPosRaw = precipArr.filter(k => k && k !== 'none_precipitants');
  precipPosRaw.forEach(k => {
    if (k === 'high_risk_medications') {
      const mList = (Array.isArray(patient.vomitingMedList) ? patient.vomitingMedList : [])
        .map(m => VOM_LABELS.medList[m] || m).join(', ');
      positives.push(mList ? `ทานยากลุ่มเสี่ยง (${mList})` : 'ทานยากลุ่มความเสี่ยงสูง');
    } else if (k === 'natural_toxin_food') {
      const toxParts = [];
      if (patient.vomitingToxinFoodType) toxParts.push(`ชนิด: ${patient.vomitingToxinFoodType}`);
      if (patient.vomitingToxinFoodTimeUnknown) toxParts.push('ไม่ทราบเวลาที่ทาน');
      else if (patient.vomitingToxinFoodTime) toxParts.push(`เวลา ${patient.vomitingToxinFoodTime} น.`);
      if (patient.vomitingToxinFoodCoEaters) {
        toxParts.push(VOM_LABELS.coEaters[patient.vomitingToxinFoodCoEaters] || patient.vomitingToxinFoodCoEaters);
      }
      if (toxParts.length === 0 && patient.vomitingToxinFoodDetails) toxParts.push(patient.vomitingToxinFoodDetails);
      positives.push(`อาหารเสี่ยงสารพิษธรรมชาติ 🚩${toxParts.length > 0 ? ` (${toxParts.join(', ')})` : ''}`);
    } else if (k === 'suspected_toxin_chemical') {
      const chem = patient.vomitingChemicalDetails ? ` (${patient.vomitingChemicalDetails})` : '';
      positives.push(`กินยาเกินขนาด / สารเคมีเกษตร 🚩${chem}`);
    } else {
      positives.push(VOM_LABELS.precip[k] || k);
    }
  });
  if (precipPosRaw.length === 0 && (patient.vomitingPrecipitantNone || precipArr.includes('none_precipitants'))) {
    negatives.push('ปฏิเสธประวัติอาหารเสี่ยงสารพิษ ยากลุ่มเสี่ยง หรือสารเคมี');
  }

  // Additional notes
  if (patient.vomitingAdditionalNotes) positives.push(patient.vomitingAdditionalNotes);
  else if (patient.otherSymptomsFree) positives.push(patient.otherSymptomsFree);

  const redFlags = detectVomitingRedFlags(patient);
  patient.redFlags = redFlags;
  patient.pertinentPositives = positives.length > 0 ? positives : ['ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม'];
  patient.pertinentNegatives = negatives.length > 0 ? negatives : ['ผู้ป่วยไม่ได้ระบุคำตอบยืนยันในหมวดอาการร่วม'];

  // PMH (Zero Default Bias 100%)
  const hospLabel = VOM_LABELS.hospStatus[patient.hospRecordStatus] || 'ไม่ได้ระบุ';
  const surgText = VOM_LABELS.priorSurgery[patient.vomitingPriorAbdominalSurgery] || 'ไม่ได้ระบุ';
  const docNotes = patient.doctor_notes || {};
  const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ') ? 'ไม่ได้ระบุ' : patient.currentMeds;
  const udExplicitDeny = Array.isArray(patient.underlying) && patient.underlying.some(u => u && (u.includes('ปฏิเสธ') || u === 'ไม่มี' || u === 'ไม่มีโรคประจำตัว'));
  const udArr = Array.isArray(patient.underlying) ? patient.underlying.filter(u => u && !u.includes('ปฏิเสธ') && u !== 'ไม่มี' && u !== 'ไม่มีโรคประจำตัว') : [];
  const udText = udArr.length > 0 ? udArr.join(', ') : ((patient.hospRecordStatus === 'self' || patient.hospRecordStatus === 'additional' || udExplicitDeny) ? 'ปฏิเสธ' : 'ไม่ได้ระบุ');
  const allergyText = (!patient.drugAllergy || patient.drugAllergy === 'ไม่ได้ระบุ')
    ? 'ไม่ได้ระบุ'
    : ((patient.drugAllergy.includes('ปฏิเสธ') || patient.drugAllergy === 'ไม่มี') ? 'ปฏิเสธ' : patient.drugAllergy);

  const defaultRapid =
`[Chief Complaint (CC)]
คลื่นไส้ / อาเจียน (Nausea & Vomiting) มา ${durationText}

[History of Present Illness (HPI)]
• การเริ่มต้นและความถี่: เริ่มแบบ${onsetStr}, ความถี่วันนี้ ${freqStr}
• ลักษณะของสิ่งที่อาเจียน: ${charStr}
• การพุ่งและปริมาณ: ${patternStr}, ปริมาณ ${volStr}
• ความสัมพันธ์กับอาหาร: ${foodRelStr}
• ความสามารถในการดื่มน้ำ: ${oralStr}${abdpainLine}${femaleLine}

• Pertinent Positives:
${patient.pertinentPositives.map(p => `  - ${p}`).join('\n')}

• Pertinent Negatives:
${patient.pertinentNegatives.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• ประวัติผ่าตัดช่องท้อง: ${surgText}
• โรคประจำตัว (U/D): ${udText}
• ยาประจำตัว (Current Meds): ${medsText}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${allergyText}

[Emergency Risk Assessment (Red Flags)]
${redFlags.length > 0
  ? `🚩 RED FLAGS DETECTED:\n${redFlags.map(rf => `  * ${rf.textTh}\n    ความเสี่ยง: ${rf.risk}`).join('\n')}`
  : '✓ ไม่พบสัญญาณวิกฤต (No Immediate Red Flag)'}

[Doctor's Clinical Addendum & Exam]
• ประวัติเพิ่มเติม/แก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}
• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}
• แผนการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

  const defaultNarrative =
`ผู้ป่วย [${patient.name || 'ไม่ระบุชื่อ'}] อายุ ${patient.age || 'ไม่ระบุ'} ปี เพศ ${patient.gender || 'ไม่ระบุ'} มารับการตรวจที่ห้องฉุกเฉิน รพ.ราชบุรี ด้วยอาการคลื่นไส้ / อาเจียน มา ${durationText}
ลักษณะการอาเจียน: การเริ่ม [${onsetStr}], ความถี่วันนี้ [${freqStr}], สัมพันธ์กับอาหาร [${foodRelStr}], สิ่งที่อาเจียน [${charStr}], การพุ่ง [${patternStr}], ปริมาณต่อครั้ง [${volStr}], การดื่มน้ำ [${oralStr}]${abdpainNarr ? `, อาการปวดท้อง [${abdpainNarr}]` : ''}${(patient.gender === 'หญิง' && femaleSummaryStr) ? `, ประวัติสตรี [${femaleSummaryStr}]` : ''}
อาการร่วมที่พบ: ${patient.pertinentPositives.join(', ')}
อาการสำคัญที่ปฏิเสธ: ${patient.pertinentNegatives.join(', ')}
ประวัติสุขภาพ: [${hospLabel}], ผ่าตัดช่องท้อง: ${surgText}, โรคประจำตัว: ${udText}, ยาประจำตัว: ${medsText}, แพ้ยา: ${allergyText}
${redFlags.length > 0 ? `[🚩 สัญญาณเตือนภาวะวิกฤต]: ${redFlags.map(rf => rf.textTh).join('; ')}` : ''}

[บันทึกการตรวจและการประเมินโดยแพทย์]:
${docNotes.additional_hpi ? `• ประวัติเพิ่มเติม: ${docNotes.additional_hpi}\n` : ''}${docNotes.physical_exam ? `• การตรวจร่างกาย: ${docNotes.physical_exam}\n` : ''}${docNotes.preliminary_dx ? `• การวินิจฉัย: ${docNotes.preliminary_dx}\n` : ''}${docNotes.plan ? `• แผนการรักษา: ${docNotes.plan}` : ''}`;

  const jsonPayload = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "encounter": {
      "hospital_site": "Ratchaburi Hospital",
      "queue_id": patient.queue_number || null,
      "hn": patient.hn || null,
      "patient_name": patient.name || null,
      "age": patient.age !== undefined ? patient.age : null,
      "gender": patient.gender || 'ไม่ระบุ',
      "timestamp": patient.timestamp || new Date().toISOString(),
      "status": patient.status || 'waiting',
      "triage_urgency_flag": redFlags.length > 0,
      "red_flags_count": redFlags.length,
      "hospital_record_status": patient.hospRecordStatus || 'unspecified'
    },
    "chief_complaint": "vomiting",
    "chief_complaint_label": "คลื่นไส้ / อาเจียน",
    "schema_version": "3.0",
    "vomiting_profile": {
      "duration": {
        "value": patient.durationVal || null,
        "unit": patient.durationVal ? (patient.durationUnit || 'hours') : null
      },
      "onset_mode": patient.vomitingOnsetMode && patient.vomitingOnsetMode !== 'unspecified' ? patient.vomitingOnsetMode : null,
      "frequency_today": patient.vomitingFrequencyToday && patient.vomitingFrequencyToday !== 'unspecified' ? patient.vomitingFrequencyToday : null,
      "food_relation": patient.vomitingFoodRelation && patient.vomitingFoodRelation !== 'unspecified' ? patient.vomitingFoodRelation : null,
      "vomitus_character": patient.vomitusCharacter && patient.vomitusCharacter !== 'unspecified' ? patient.vomitusCharacter : null,
      "vomiting_pattern_type": patient.vomitingPatternType && patient.vomitingPatternType !== 'unspecified' ? patient.vomitingPatternType : null,
      "vomitus_volume_per_time": patient.vomitusVolumePerTime && patient.vomitusVolumePerTime !== 'unspecified' ? patient.vomitusVolumePerTime : null,
      "oral_tolerance": patient.vomitingOralIntolerance && patient.vomitingOralIntolerance !== 'unspecified' ? patient.vomitingOralIntolerance : null,
      "abdominal_symptoms": {
        "answered_none": giExplicitNone,
        "has_abdominal_pain": Boolean(patient.vomitingHasAbdominalPain),
        "pain_locations": patient.vomitingAbdpainLocs || [],
        "pain_character": patient.vomitingAbdpainChar || null,
        "marked_distension": hasDistension,
        "fever_chills": hasFever,
        "diarrhea": hasDiar,
        "diarrhea_frequency": hasDiar ? (patient.vomitingDiarrheaFreq || null) : null,
        "diarrhea_stool_characters": hasDiar ? (patient.vomitingDiarrheaStools || []) : [],
        "bloody_or_melena_stool": hasBlood,
        "bloody_stool_character": hasBlood ? (patient.vomitingBloodyStoolChar || null) : null,
        "constipation_gt_24h": hasConst,
        "constipation_sub_type": hasConst ? (patient.vomitingConstipationSub || null) : null,
        "prior_abdominal_surgery": patient.vomitingPriorAbdominalSurgery && patient.vomitingPriorAbdominalSurgery !== 'unspecified' ? patient.vomitingPriorAbdominalSurgery : null
      },
      "extra_abdominal_flags": {
        "dehydration_signs": dehyArr,
        "cardiac_flags": cardiacArr,
        "neuro_flags": neuroArr
      },
      "precipitants_and_toxic": {
        "precipitants": precipArr,
        "high_risk_med_list": patient.vomitingMedList || [],
        "natural_toxin_food": {
          "type": patient.vomitingToxinFoodType || null,
          "time": patient.vomitingToxinFoodTimeUnknown ? 'unknown' : (patient.vomitingToxinFoodTime || null),
          "co_eaters": patient.vomitingToxinFoodCoEaters || null
        },
        "suspected_chemical_overdose": patient.vomitingChemicalDetails || null
      },
      "female_reproductive_history": patient.gender === 'หญิง' ? {
        "pregnancy_status": patient.vomitingPregnancyStatus || null,
        "lmp_status": patient.vomiting_lmp_status || null,
        "lmp_date": (typeof formatDateDdMmYyyy === 'function' ? formatDateDdMmYyyy(patient.vomitingLmpDate) : patient.vomitingLmpDate) || null,
        "pregnancy_test_self": patient.vomitingPregnancyTestSelf || null
      } : null,
      "informant_additional_notes": patient.vomitingAdditionalNotes || null
    },
    "pertinent_positives": patient.pertinentPositives,
    "pertinent_negatives": patient.pertinentNegatives,
    "red_flags": redFlags,
    "past_medical_history": {
      "hospital_record_status": hospLabel,
      "underlying_diseases": udArr,
      "drug_allergies": allergyText === 'ไม่ได้ระบุ' ? null : allergyText,
      "current_medications": medsText === 'ไม่ได้ระบุ' ? null : medsText
    },
    "doctor_notes": {
      "history": docNotes.additional_hpi || "",
      "vitals_and_physical_exam": docNotes.physical_exam || "",
      "provisional_diagnosis": docNotes.preliminary_dx || "",
      "treatment_plan": docNotes.plan || ""
    }
  };

  patient.rapidHpi = patient.custom_rapid_note || defaultRapid;
  patient.narrativeHpi = patient.custom_narrative_note || defaultNarrative;
  patient.medicalJson = jsonPayload;

  const rapidView = document.getElementById('rapidTextView');
  const narrativeView = document.getElementById('narrativeTextView');
  const jsonView = document.getElementById('jsonViewer');
  if (rapidView) rapidView.value = patient.rapidHpi;
  if (narrativeView) narrativeView.value = patient.narrativeHpi;
  if (jsonView) jsonView.textContent = JSON.stringify(jsonPayload, null, 2);

  return { rapid: patient.rapidHpi, narrative: patient.narrativeHpi, json: jsonPayload };
}

// --- Patient Form HTML Builders (3-Card Golden UI/UX) ---
function vomWrap(...chunks) {
  return chunks.map(c => `<span class="inline-block whitespace-nowrap">${c}</span>`).join(' ');
}

function renderVomOpt(opt) {
  const kind = opt.kind || 'checkbox';
  const idAttr = opt.id ? ` id="${opt.id}"` : '';
  const nameAttr = opt.name ? ` name="${opt.name}"` : '';
  const valAttr = opt.value !== undefined ? ` value="${opt.value}"` : '';
  const onchgAttr = opt.onchange ? ` onchange="${opt.onchange}"` : '';
  const pad = opt.compact ? 'p-2.5' : 'p-3';
  const bg = opt.bgWhite ? 'bg-white' : '';
  const span = opt.spanClass ? ` ${opt.spanClass}` : '';
  const align = opt.desc ? 'items-start' : 'items-center';
  const inCls = `${opt.desc ? 'mt-0.5 ' : ''}text-medical-600 focus:ring-medical-500 h-4 w-4 ${kind === 'checkbox' ? 'rounded ' : ''}flex-shrink-0`;
  const textCls = opt.compact ? 'text-xs' : 'text-xs sm:text-sm';

  if (opt.desc) {
    return `<label class="selectable-card flex ${align} ${pad} rounded-xl border border-slate-200 hover:border-medical-300 ${bg} cursor-pointer transition${span}">
      <input type="${kind}"${idAttr}${nameAttr}${valAttr}${onchgAttr} class="${inCls}">
      <div class="ml-3 leading-snug">
        <span class="block ${textCls} font-semibold text-slate-800">${opt.title}</span>
        <span class="block text-[11px] text-slate-500 font-normal mt-0.5">${opt.desc}</span>
      </div>
    </label>`;
  }
  return `<label class="selectable-card flex ${align} ${pad} rounded-xl border border-slate-200 hover:border-medical-300 ${bg} cursor-pointer transition${span}">
    <input type="${kind}"${idAttr}${nameAttr}${valAttr}${onchgAttr} class="${inCls}">
    <span class="ml-3 ${textCls} font-semibold text-slate-800 leading-snug">${opt.title}</span>
  </label>`;
}

function renderVomGrid(colsClass, items) {
  return `<div class="grid ${colsClass} gap-2">${items.map(renderVomOpt).join('')}</div>`;
}

function renderVomSysHeader(icon, iconColor, title, noneId, noneOnchange, noneLabel = 'ไม่มีอาการในหมวดนี้') {
  return `<div class="flex items-center justify-between gap-2 mb-2.5">
    <div class="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-800">
      <i data-lucide="${icon}" class="w-4 h-4 ${iconColor} flex-shrink-0"></i>
      <span>${title}</span>
    </div>
    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-lg border border-slate-200 hover:border-medical-300 bg-slate-50 cursor-pointer transition flex-shrink-0">
      <input type="checkbox" id="${noneId}" onchange="${noneOnchange}" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded flex-shrink-0">
      <span class="ml-3 text-[11px] font-medium text-slate-600 whitespace-nowrap">${noneLabel}</span>
    </label>
  </div>`;
}

const VOM_CARD1_HTML = `
<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
  <div class="flex items-center space-x-3 mb-5 pb-3 border-b border-slate-100">
    <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="clock" class="w-5 h-5"></i></div>
    <div>
      <h2 class="text-base font-bold text-slate-900">1. ระยะเวลา ความถี่ และลักษณะการอาเจียน</h2>
      <p class="text-xs text-slate-500">ข้อมูลพื้นฐานเกี่ยวกับอาการคลื่นไส้และสิ่งที่อาเจียนออกมา</p>
    </div>
  </div>
  <div class="space-y-5">
    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">เริ่มมีอาการคลื่นไส้อาเจียนมานานเท่าไร?</label>
      <div class="flex items-center space-x-2 max-w-xs">
        <input type="number" id="vomitingDurationVal" min="1" max="999" placeholder="เช่น 6" class="w-28 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white">
        <select id="vomitingDurationUnit" class="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white">
          <option value="minutes">นาที</option>
          <option value="hours" selected>ชั่วโมง</option>
          <option value="days">วัน</option>
          <option value="weeks">สัปดาห์</option>
          <option value="months">เดือน</option>
          <option value="years">ปี</option>
        </select>
      </div>
    </div>

    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">รูปแบบการเริ่มมีอาการ</label>
      ${renderVomGrid('grid-cols-1 sm:grid-cols-3', [
        { kind: 'radio', name: 'vomitingOnsetMode', value: 'sudden_severe', title: vomWrap('เป็นทันที', 'รุนแรงตั้งแต่แรก') },
        { kind: 'radio', name: 'vomitingOnsetMode', value: 'gradual_worsening', title: vomWrap('ค่อยๆ คลื่นไส้', 'แล้วอาเจียนถี่ขึ้น') },
        { kind: 'radio', name: 'vomitingOnsetMode', value: 'intermittent_spells', title: vomWrap('เป็นๆ หายๆ', 'เป็นระลอก') }
      ])}
    </div>

    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">จำนวนครั้งที่อาเจียนในวันนี้</label>
      ${renderVomGrid('grid-cols-2 sm:grid-cols-4', [
        { kind: 'radio', name: 'vomitingFrequencyToday', value: 'mild_1_2', title: vomWrap('1–2 ครั้ง') },
        { kind: 'radio', name: 'vomitingFrequencyToday', value: 'moderate_3_5', title: vomWrap('3–5 ครั้ง') },
        { kind: 'radio', name: 'vomitingFrequencyToday', value: 'severe_6_10', title: vomWrap('6–10 ครั้ง') },
        { kind: 'radio', name: 'vomitingFrequencyToday', value: 'intractable_gt_10', title: vomWrap('> 10 ครั้ง /', 'ตลอดเวลา') }
      ])}
    </div>

    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">ความสัมพันธ์กับอาหารและน้ำ</label>
      ${renderVomGrid('grid-cols-1 sm:grid-cols-2', [
        { kind: 'radio', name: 'vomitingFoodRelation', value: 'immediate_postprandial', title: vomWrap('อาเจียนทันที', 'หลังทานไม่เกิน 15 นาที') },
        { kind: 'radio', name: 'vomitingFoodRelation', value: 'delayed_postprandial_hours', title: vomWrap('อาเจียนหลังทาน', '1–3 ชม.') },
        { kind: 'radio', name: 'vomitingFoodRelation', value: 'morning_fasting', title: vomWrap('อาเจียนตอนเช้า /', 'ขณะท้องว่าง') },
        { kind: 'radio', name: 'vomitingFoodRelation', value: 'independent_constant', title: vomWrap('อาเจียนตลอดเวลา', 'แม้ไม่ทานอะไร') }
      ])}
    </div>

    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">ลักษณะสิ่งที่อาเจียนออกมา (เลือกข้อที่ตรงที่สุด)</label>
      ${renderVomGrid('grid-cols-2 sm:grid-cols-3 lg:grid-cols-4', [
        { kind: 'radio', name: 'vomitusCharacter', value: 'clear_gastric_juice', title: vomWrap('น้ำใส /', 'น้ำลาย /', 'น้ำย่อยใสๆ') },
        { kind: 'radio', name: 'vomitusCharacter', value: 'food_particles', title: vomWrap('เศษอาหาร', 'ที่เพิ่งทาน') },
        { kind: 'radio', name: 'vomitusCharacter', value: 'undigested_old_food', title: vomWrap('เศษอาหารเก่า', 'ค้างมื้อ'), desc: 'ทานไปหลายชั่วโมงหรือข้ามวัน' },
        { kind: 'radio', name: 'vomitusCharacter', value: 'yellow_green_bile', title: vomWrap('น้ำดีสีเขียว /', 'เหลืองเข้ม') },
        { kind: 'radio', name: 'vomitusCharacter', value: 'brown_feculent', title: vomWrap('สีน้ำตาล', 'กลิ่นคล้ายอุจจาระ') },
        { kind: 'radio', name: 'vomitusCharacter', value: 'blood_bright_red', title: vomWrap('มีเลือดสีแดงสดปน') },
        { kind: 'radio', name: 'vomitusCharacter', value: 'blood_coffee_ground', title: vomWrap('สีกาแฟคั่ว /', 'กากสีดำ'), spanClass: 'col-span-2 sm:col-span-1 lg:col-span-2' }
      ])}
    </div>

    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">ลักษณะการพุ่งของการอาเจียน</label>
      ${renderVomGrid('grid-cols-1 sm:grid-cols-2', [
        { kind: 'radio', name: 'vomitingPatternType', value: 'normal_retching', title: vomWrap('มีคลื่นไส้พะอืดพะอม', 'นำมาก่อน') },
        { kind: 'radio', name: 'vomitingPatternType', value: 'projectile_vomiting', title: vomWrap('อาเจียนพุ่งแรงทันที', 'แทบไม่คลื่นไส้นำ') }
      ])}
    </div>

    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">ปริมาณที่อาเจียนต่อครั้ง</label>
      ${renderVomGrid('grid-cols-1 sm:grid-cols-3', [
        { kind: 'radio', name: 'vomitusVolumePerTime', value: 'small_sip', title: vomWrap('เล็กน้อย'), desc: 'ไม่เกินครึ่งแก้ว' },
        { kind: 'radio', name: 'vomitusVolumePerTime', value: 'moderate_cup', title: vomWrap('ปานกลาง'), desc: 'ประมาณ 1 แก้ว' },
        { kind: 'radio', name: 'vomitusVolumePerTime', value: 'large_bowl', title: vomWrap('มาก'), desc: 'เต็มชามหรือกะละมัง' }
      ])}
    </div>
  </div>
</div>`;

const VOM_CARD2_HTML = `
<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
  <div class="flex items-center space-x-3 mb-5 pb-3 border-b border-slate-100">
    <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="activity" class="w-5 h-5"></i></div>
    <div>
      <h2 class="text-base font-bold text-slate-900">2. ภาวะขาดน้ำ และอาการร่วมทางช่องท้อง / ระบบอื่น</h2>
      <p class="text-xs text-slate-500">เลือกเฉพาะอาการที่มีร่วมด้วย ระบบจะเปิดคำถามเจาะลึกเฉพาะข้อที่เกี่ยวข้อง</p>
    </div>
  </div>
  <div class="space-y-6">
    <div>
      ${renderVomSysHeader('droplets', 'text-sky-500', 'ความสามารถในการดื่มน้ำและสัญญาณขาดน้ำ', 'vomiting_dehy_none', "handleVomitingGroupNoneChange('vomiting_dehy_none',['vomiting_dehy_oliguria','vomiting_dehy_dry_mouth','vomiting_dehy_postural','vomiting_dehy_cold_ext'])", 'ไม่มีสัญญาณขาดน้ำ')}
      <div class="space-y-2.5">
        ${renderVomGrid('grid-cols-1 sm:grid-cols-2', [
          { kind: 'radio', name: 'vomitingOralIntolerance', value: 'can_drink_water', title: vomWrap('จิบน้ำ / เกลือแร่ได้บ้าง') },
          { kind: 'radio', name: 'vomitingOralIntolerance', value: 'intolerant_vomit_all', title: vomWrap('ดื่มไม่ได้เลย', 'ทานแล้วอาเจียนออกหมด') }
        ])}
        ${renderVomGrid('grid-cols-2 sm:grid-cols-2', [
          { id: 'vomiting_dehy_oliguria', name: 'vomitingDehydrationSigns', value: 'oliguria_anuria', onchange: "handleVomitingGroupItemChange('vomiting_dehy_none','vomiting_dehy_oliguria')", title: vomWrap('ปัสสาวะออกน้อย /', 'ไม่ออก > 8 ชม.') },
          { id: 'vomiting_dehy_dry_mouth', name: 'vomitingDehydrationSigns', value: 'marked_dry_mouth_thirst', onchange: "handleVomitingGroupItemChange('vomiting_dehy_none','vomiting_dehy_dry_mouth')", title: vomWrap('ปากแห้งมาก /', 'กระหายน้ำจัด') },
          { id: 'vomiting_dehy_postural', name: 'vomitingDehydrationSigns', value: 'postural_dizziness_blackout', onchange: "handleVomitingGroupItemChange('vomiting_dehy_none','vomiting_dehy_postural')", title: vomWrap('ลุกยืนแล้วหน้ามืด /', 'วูบ') },
          { id: 'vomiting_dehy_cold_ext', name: 'vomitingDehydrationSigns', value: 'cold_clammy_extremities', onchange: "handleVomitingGroupItemChange('vomiting_dehy_none','vomiting_dehy_cold_ext')", title: vomWrap('มือเท้าเย็นชืด') }
        ])}
      </div>
    </div>

    <div>
      ${renderVomSysHeader('utensils', 'text-amber-500', 'อาการร่วมทางช่องท้องและการขับถ่าย', 'vomiting_gi_none', "handleVomitingGroupNoneChange('vomiting_gi_none',['vomitingHasAbdominalPain','vomiting_gi_distension','vomiting_gi_fever','vomiting_gi_diarrhea','vomiting_gi_bloody_stool','vomiting_gi_constipation'],syncVomitingGiBranches)", 'ไม่มีอาการทางท้องและขับถ่ายปกติ')}
      ${renderVomGrid('grid-cols-2 sm:grid-cols-3', [
        { id: 'vomitingHasAbdominalPain', onchange: "handleVomitingGroupItemChange('vomiting_gi_none','vomitingHasAbdominalPain',syncVomitingGiBranches)", title: vomWrap('ปวดท้องร่วมด้วย') },
        { id: 'vomiting_gi_distension', onchange: "handleVomitingGroupItemChange('vomiting_gi_none','vomiting_gi_distension')", title: vomWrap('ท้องอืด', 'แน่นตึงมาก') },
        { id: 'vomiting_gi_fever', onchange: "handleVomitingGroupItemChange('vomiting_gi_none','vomiting_gi_fever')", title: vomWrap('มีไข้ /', 'หนาวสั่น') },
        { id: 'vomiting_gi_diarrhea', onchange: "handleVomitingGroupItemChange('vomiting_gi_none','vomiting_gi_diarrhea',syncVomitingGiBranches)", title: vomWrap('ถ่ายเหลว /', 'ท้องเสีย') },
        { id: 'vomiting_gi_bloody_stool', onchange: "handleVomitingGroupItemChange('vomiting_gi_none','vomiting_gi_bloody_stool',syncVomitingGiBranches)", title: vomWrap('ถ่ายดำ /', 'ถ่ายเป็นเลือด') },
        { id: 'vomiting_gi_constipation', onchange: "handleVomitingGroupItemChange('vomiting_gi_none','vomiting_gi_constipation',syncVomitingGiBranches)", title: vomWrap('ท้องผูก /', 'ไม่ถ่าย > 24 ชม.') }
      ])}

      <div id="vomitingAbdpainWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2.5 space-y-3 text-xs">
        <div class="font-bold text-slate-800 flex items-center"><i data-lucide="crosshair" class="w-4 h-4 text-amber-500 mr-1.5"></i>เจาะลึกอาการปวดท้อง</div>
        <div>
          <label class="block font-semibold text-slate-700 mb-1.5">ตำแหน่งที่ปวด (เลือกได้หลายข้อ):</label>
          ${renderVomGrid('grid-cols-2 sm:grid-cols-3', [
            { name: 'vomitingAbdpainLocs', value: 'epigastrium', title: vomWrap('ใต้ลิ้นปี่'), compact: true, bgWhite: true },
            { name: 'vomitingAbdpainLocs', value: 'ruq', title: vomWrap('ใต้ชายโครงขวา'), compact: true, bgWhite: true },
            { name: 'vomitingAbdpainLocs', value: 'periumbilical', title: vomWrap('รอบสะดือ'), compact: true, bgWhite: true },
            { name: 'vomitingAbdpainLocs', value: 'rlq', title: vomWrap('ท้องน้อยขวา'), compact: true, bgWhite: true },
            { name: 'vomitingAbdpainLocs', value: 'llq', title: vomWrap('ท้องน้อยซ้าย'), compact: true, bgWhite: true },
            { name: 'vomitingAbdpainLocs', value: 'diffuse', title: vomWrap('ปวดทั่วท้อง'), compact: true, bgWhite: true }
          ])}
        </div>
        <div>
          <label class="block font-semibold text-slate-700 mb-1.5">ลักษณะการปวดท้อง:</label>
          ${renderVomGrid('grid-cols-1 sm:grid-cols-3', [
            { kind: 'radio', name: 'vomitingAbdpainChar', value: 'cramping_colicky', title: vomWrap('ปวดบิดเป็นพักๆ'), compact: true, bgWhite: true },
            { kind: 'radio', name: 'vomitingAbdpainChar', value: 'constant_severe', title: vomWrap('ปวดรุนแรงต่อเนื่อง', 'ขยับเจ็บสะเทือน'), compact: true, bgWhite: true },
            { kind: 'radio', name: 'vomitingAbdpainChar', value: 'dull_aching', title: vomWrap('ปวดตื้อๆ แน่นๆ'), compact: true, bgWhite: true }
          ])}
        </div>
      </div>

      <div id="vomitingDiarrheaWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2.5 space-y-3 text-xs">
        <div class="font-bold text-slate-800 flex items-center"><i data-lucide="droplets" class="w-4 h-4 text-sky-500 mr-1.5"></i>เจาะลึกอาการถ่ายเหลว / ท้องเสีย</div>
        <div class="flex items-center space-x-2">
          <label class="font-semibold text-slate-700">จำนวนครั้งในวันนี้:</label>
          <input type="number" id="vomitingDiarrheaFreq" min="1" max="50" placeholder="เช่น 3" class="w-20 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500">
          <span class="text-slate-500">ครั้ง/วัน</span>
        </div>
        <div>
          <label class="block font-semibold text-slate-700 mb-1.5">ลักษณะอุจจาระ (เลือกได้หลายข้อ):</label>
          ${renderVomGrid('grid-cols-2 sm:grid-cols-4', [
            { name: 'vomitingDiarrheaStools', value: 'watery', title: vomWrap('น้ำเหลวล้วน'), compact: true, bgWhite: true },
            { name: 'vomitingDiarrheaStools', value: 'mucus', title: vomWrap('มีมูกปน'), compact: true, bgWhite: true },
            { name: 'vomitingDiarrheaStools', value: 'bloody', title: vomWrap('มีเลือดสดปน'), compact: true, bgWhite: true },
            { name: 'vomitingDiarrheaStools', value: 'dark_tarry', title: vomWrap('สีดำคล้ำ'), compact: true, bgWhite: true }
          ])}
        </div>
      </div>

      <div id="vomitingBloodyStoolWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2.5 space-y-2.5 text-xs">
        <div class="font-bold text-slate-800 flex items-center"><i data-lucide="alert-circle" class="w-4 h-4 text-rose-500 mr-1.5"></i>เจาะลึกลักษณะเลือดหรือสีอุจจาระ</div>
        ${renderVomGrid('grid-cols-1 sm:grid-cols-3', [
          { kind: 'radio', name: 'vomitingBloodyStoolChar', value: 'bright_red_coating', title: vomWrap('เลือดแดงสด', 'เคลือบก้อน'), compact: true, bgWhite: true },
          { kind: 'radio', name: 'vomitingBloodyStoolChar', value: 'pure_bright_red', title: vomWrap('เลือดแดงสดล้วน'), compact: true, bgWhite: true },
          { kind: 'radio', name: 'vomitingBloodyStoolChar', value: 'dark_clots', title: vomWrap('ลิ่มเลือดสีคล้ำ'), compact: true, bgWhite: true },
          { kind: 'radio', name: 'vomitingBloodyStoolChar', value: 'black_tarry_melena', title: vomWrap('ดำเหนียว', 'คล้ายยางมะตอย'), compact: true, bgWhite: true },
          { kind: 'radio', name: 'vomitingBloodyStoolChar', value: 'maroon_wash', title: vomWrap('แดงคล้ำ', 'คล้ายน้ำล้างเนื้อ'), compact: true, bgWhite: true }
        ])}
      </div>

      <div id="vomitingConstipationWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2.5 space-y-3 text-xs">
        <div class="font-bold text-slate-800 flex items-center"><i data-lucide="ban" class="w-4 h-4 text-amber-600 mr-1.5"></i>เจาะลึกอาการท้องผูก / ไม่ถ่าย > 24 ชม.</div>
        <div>
          <label class="block font-semibold text-slate-700 mb-1.5">ลักษณะการขับถ่ายและผายลม:</label>
          ${renderVomGrid('grid-cols-1 sm:grid-cols-2', [
            { kind: 'radio', name: 'vomitingConstipationSub', value: 'no_stool_no_gas', title: vomWrap('ไม่ถ่ายและ', 'ไม่ผายลมเลย'), compact: true, bgWhite: true },
            { kind: 'radio', name: 'vomitingConstipationSub', value: 'no_stool_can_pass_gas', title: vomWrap('ไม่ถ่าย แต่ยัง', 'ผายลมได้'), compact: true, bgWhite: true },
            { kind: 'radio', name: 'vomitingConstipationSub', value: 'hard_pellet_stool', title: vomWrap('ถ่ายก้อนแข็ง', 'เม็ดกระสุน'), compact: true, bgWhite: true },
            { kind: 'radio', name: 'vomitingConstipationSub', value: 'watery_overflow_scant', title: vomWrap('ถ่ายเหลวเล็ด', 'ครั้งละน้อย'), compact: true, bgWhite: true }
          ])}
        </div>
        <div>
          <label class="block font-semibold text-slate-700 mb-1.5">ประวัติการผ่าตัดช่องท้องในอดีต:</label>
          ${renderVomGrid('grid-cols-3', [
            { kind: 'radio', name: 'vomitingPriorAbdominalSurgery', value: 'yes', title: vomWrap('เคยผ่าตัดช่องท้อง'), compact: true, bgWhite: true },
            { kind: 'radio', name: 'vomitingPriorAbdominalSurgery', value: 'no', title: vomWrap('ไม่เคย'), compact: true, bgWhite: true },
            { kind: 'radio', name: 'vomitingPriorAbdominalSurgery', value: 'unsure', title: vomWrap('ไม่แน่ใจ'), compact: true, bgWhite: true }
          ])}
        </div>
      </div>
    </div>

    <div>
      ${renderVomSysHeader('heart-pulse', 'text-rose-500', 'อาการเตือนระบบหัวใจและไหลเวียนโลหิต', 'vomiting_cardiac_none', "handleVomitingGroupNoneChange('vomiting_cardiac_none',['vomiting_cardiac_chest','vomiting_cardiac_diaphoresis','vomiting_cardiac_syncope','vomiting_cardiac_palpitation'])")}
      ${renderVomGrid('grid-cols-1 sm:grid-cols-2', [
        { id: 'vomiting_cardiac_chest', name: 'vomitingCardiacFlags', value: 'chest_tightness_pressure', onchange: "handleVomitingGroupItemChange('vomiting_cardiac_none','vomiting_cardiac_chest')", title: vomWrap('แน่น /', 'เจ็บหน้าอก'), desc: 'หรือร้าวไปกราม / แขนซ้าย' },
        { id: 'vomiting_cardiac_diaphoresis', name: 'vomitingCardiacFlags', value: 'diaphoresis_cold_sweat', onchange: "handleVomitingGroupItemChange('vomiting_cardiac_none','vomiting_cardiac_diaphoresis')", title: vomWrap('เหงื่อแตกท่วมตัว', 'ตัวเย็น') },
        { id: 'vomiting_cardiac_syncope', name: 'vomitingCardiacFlags', value: 'syncope_presyncope', onchange: "handleVomitingGroupItemChange('vomiting_cardiac_none','vomiting_cardiac_syncope')", title: vomWrap('หน้ามืด /', 'วูบหมดสติ') },
        { id: 'vomiting_cardiac_palpitation', name: 'vomitingCardiacFlags', value: 'palpitation_racing_heart', onchange: "handleVomitingGroupItemChange('vomiting_cardiac_none','vomiting_cardiac_palpitation')", title: vomWrap('ใจสั่น /', 'หัวใจเต้นรัว') }
      ])}
    </div>

    <div>
      ${renderVomSysHeader('brain', 'text-purple-500', 'อาการเตือนระบบประสาทและสมอง', 'vomiting_neuro_none', "handleVomitingGroupNoneChange('vomiting_neuro_none',['vomiting_neuro_headache','vomiting_neuro_stiff_neck','vomiting_neuro_focal','vomiting_neuro_diplopia','vomiting_neuro_vertigo','vomiting_neuro_confusion'])")}
      ${renderVomGrid('grid-cols-2 sm:grid-cols-3', [
        { id: 'vomiting_neuro_headache', name: 'vomitingNeuroFlags', value: 'severe_sudden_headache', onchange: "handleVomitingGroupItemChange('vomiting_neuro_none','vomiting_neuro_headache')", title: vomWrap('ปวดศีรษะรุนแรง', 'ฉับพลัน') },
        { id: 'vomiting_neuro_stiff_neck', name: 'vomitingNeuroFlags', value: 'stiff_neck', onchange: "handleVomitingGroupItemChange('vomiting_neuro_none','vomiting_neuro_stiff_neck')", title: vomWrap('คอแข็ง', 'ก้มคอไม่ได้') },
        { id: 'vomiting_neuro_focal', name: 'vomitingNeuroFlags', value: 'focal_weakness_numbness', onchange: "handleVomitingGroupItemChange('vomiting_neuro_none','vomiting_neuro_focal')", title: vomWrap('แขนขาอ่อนแรง /', 'ปากเบี้ยว') },
        { id: 'vomiting_neuro_diplopia', name: 'vomitingNeuroFlags', value: 'diplopia_blurred_vision', onchange: "handleVomitingGroupItemChange('vomiting_neuro_none','vomiting_neuro_diplopia')", title: vomWrap('เห็นภาพซ้อน /', 'ตามัวเฉียบพลัน') },
        { id: 'vomiting_neuro_vertigo', name: 'vomitingNeuroFlags', value: 'vertigo_ataxia', onchange: "handleVomitingGroupItemChange('vomiting_neuro_none','vomiting_neuro_vertigo')", title: vomWrap('เวียนหัวบ้านหมุน /', 'เดินเซ') },
        { id: 'vomiting_neuro_confusion', name: 'vomitingNeuroFlags', value: 'confusion_drowsiness', onchange: "handleVomitingGroupItemChange('vomiting_neuro_none','vomiting_neuro_confusion')", title: vomWrap('ซึมลง /', 'สับสน') }
      ])}
    </div>
  </div>
</div>`;

const VOM_CARD3_HTML = `
<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
  <div class="flex items-center space-x-3 mb-5 pb-3 border-b border-slate-100">
    <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="clipboard-list" class="w-5 h-5"></i></div>
    <div>
      <h2 class="text-base font-bold text-slate-900">3. ปัจจัยกระตุ้น ยา สารพิษ ประวัติสตรี และข้อมูลเพิ่มเติม</h2>
      <p class="text-xs text-slate-500">อาหารเสี่ยง ยาที่รับประทาน ประวัติเฉพาะ และข้อสังเกตที่ต้องการแจ้งแพทย์</p>
    </div>
  </div>
  <div class="space-y-6">
    <div>
      ${renderVomSysHeader('alert-triangle', 'text-amber-500', 'ปัจจัยกระตุ้น อาหารเสี่ยง ยา และสารพิษ', 'vomitingPrecipitantNoneCb', "handleVomitingGroupNoneChange('vomitingPrecipitantNoneCb',['vomiting_precip_food_poison','vomitingToxinFoodCb','vomitingMedsCb','vomiting_precip_dm_missed','vomiting_precip_alcohol','vomitingChemicalCb'],syncVomitingPrecipBranches)", 'ไม่มีประวัติเสี่ยงในหมวดนี้')}
      ${renderVomGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', [
        { id: 'vomiting_precip_food_poison', name: 'vomitingPrecipitants', value: 'general_food_poisoning', onchange: "handleVomitingGroupItemChange('vomitingPrecipitantNoneCb','vomiting_precip_food_poison')", title: vomWrap('อาหารค้างคืน /', 'มีคนป่วยร่วมกัน') },
        { id: 'vomitingToxinFoodCb', name: 'vomitingPrecipitants', value: 'natural_toxin_food', onchange: "handleVomitingGroupItemChange('vomitingPrecipitantNoneCb','vomitingToxinFoodCb',syncVomitingPrecipBranches)", title: vomWrap('อาหารเสี่ยง', 'สารพิษธรรมชาติ'), desc: 'เห็ดป่า กลอย หน่อไม้ แมงดาถ้วย ปลาปักเป้า ลูกเนียง สบู่ดำ/แดง' },
        { id: 'vomitingMedsCb', name: 'vomitingPrecipitants', value: 'high_risk_medications', onchange: "handleVomitingGroupItemChange('vomitingPrecipitantNoneCb','vomitingMedsCb',syncVomitingPrecipBranches)", title: vomWrap('ทานยากลุ่ม', 'ความเสี่ยงสูง'), desc: 'ยาหัวใจ Digoxin, ยาแก้ปวดข้อ NSAIDs, ยาต้ม/ลูกกลอน, เคมีบำบัด, ยาปฏิชีวนะ, Lithium' },
        { id: 'vomiting_precip_dm_missed', name: 'vomitingPrecipitants', value: 'missed_dm_insulin', onchange: "handleVomitingGroupItemChange('vomitingPrecipitantNoneCb','vomiting_precip_dm_missed')", title: vomWrap('ขาดยาเบาหวาน /', 'ไม่ได้ฉีดอินซูลิน') },
        { id: 'vomiting_precip_alcohol', name: 'vomitingPrecipitants', value: 'heavy_alcohol_or_withdrawal', onchange: "handleVomitingGroupItemChange('vomitingPrecipitantNoneCb','vomiting_precip_alcohol')", title: vomWrap('ดื่มสุราหนัก /', 'เพิ่งหยุดดื่ม') },
        { id: 'vomitingChemicalCb', name: 'vomitingPrecipitants', value: 'suspected_toxin_chemical', onchange: "handleVomitingGroupItemChange('vomitingPrecipitantNoneCb','vomitingChemicalCb',syncVomitingPrecipBranches)", title: vomWrap('กินยาเกินขนาด /', 'สารเคมีเกษตร') }
      ])}

      <div id="vomitingToxinFoodWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2.5 space-y-3 text-xs">
        <div class="font-bold text-slate-800 flex items-center"><i data-lucide="utensils" class="w-4 h-4 text-amber-600 mr-1.5"></i>รายละเอียดอาหารเสี่ยงสารพิษธรรมชาติ</div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">ชื่อหรือชนิดอาหารที่รับประทาน:</label>
            <input type="text" id="vomitingToxinFoodType" placeholder="เช่น เห็ดป่า, แมงดาถ้วย, กลอย" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500">
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1">เวลาที่รับประทาน (24 ชม.):</label>
            <div class="flex flex-wrap items-center gap-2">
              <input type="text" id="vomitingToxinFoodTime" data-universal-time="true" placeholder="เช่น 12:30" class="w-32 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
              <label class="selectable-card inline-flex items-center px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                <input type="checkbox" id="vomitingToxinFoodTimeUnknown" onchange="handleVomitingToxinTimeUnknownChange(this.checked)" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded flex-shrink-0">
                <span class="ml-3 text-[11px] font-medium text-slate-700 whitespace-nowrap">ไม่ทราบเวลาที่แน่นอน</span>
              </label>
            </div>
          </div>
        </div>
        <div>
          <label class="block font-semibold text-slate-700 mb-1.5">ผู้ร่วมรับประทาน:</label>
          ${renderVomGrid('grid-cols-1 sm:grid-cols-3', [
            { kind: 'radio', name: 'vomitingToxinFoodCoEaters', value: 'symptomatic', title: vomWrap('มีผู้อื่นมีอาการเหมือนกัน'), compact: true, bgWhite: true },
            { kind: 'radio', name: 'vomitingToxinFoodCoEaters', value: 'asymptomatic', title: vomWrap('ผู้อื่นไม่มีอาการ'), compact: true, bgWhite: true },
            { kind: 'radio', name: 'vomitingToxinFoodCoEaters', value: 'ate_alone', title: vomWrap('ทานคนเดียว'), compact: true, bgWhite: true }
          ])}
        </div>
      </div>

      <div id="vomitingMedsWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2.5 space-y-2.5 text-xs">
        <div class="font-bold text-slate-800 flex items-center"><i data-lucide="pill" class="w-4 h-4 text-medical-600 mr-1.5"></i>ระบุกลุ่มยาที่รับประทาน (เลือกได้หลายข้อ)</div>
        ${renderVomGrid('grid-cols-2 sm:grid-cols-3', [
          { name: 'vomitingMedList', value: 'digoxin', title: vomWrap('ยาหัวใจ', 'Digoxin'), compact: true, bgWhite: true },
          { name: 'vomitingMedList', value: 'nsaids', title: vomWrap('ยาแก้ปวดข้อ', 'NSAIDs'), compact: true, bgWhite: true },
          { name: 'vomitingMedList', value: 'herbal_bolus', title: vomWrap('ยาต้ม /', 'ยาลูกกลอน'), compact: true, bgWhite: true },
          { name: 'vomitingMedList', value: 'chemotherapy', title: vomWrap('ยาเคมีบำบัด'), compact: true, bgWhite: true },
          { name: 'vomitingMedList', value: 'antibiotics', title: vomWrap('ยาปฏิชีวนะ'), compact: true, bgWhite: true },
          { name: 'vomitingMedList', value: 'lithium_psych', title: vomWrap('ยาจิตเวช', 'Lithium'), compact: true, bgWhite: true }
        ])}
      </div>

      <div id="vomitingChemicalWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2.5 space-y-2.5 text-xs">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="font-bold text-slate-800 flex items-center"><i data-lucide="skull" class="w-4 h-4 text-rose-500 mr-1.5"></i>รายละเอียดยาเกินขนาดหรือสารพิษ</div>
          <button type="button" onclick="if(typeof selectChiefComplaint==='function') selectChiefComplaint('poisoning', true);" class="text-[11px] font-semibold text-medical-700 underline hover:text-medical-800 cursor-pointer">สลับไปแบบซักประวัติสารพิษ / ยาเกินขนาด →</button>
        </div>
        <input type="text" id="vomitingChemicalDetails" placeholder="ระบุชื่อยา หรือชนิดของสารพิษที่ได้รับ (ถ้าทราบ)..." class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500">
      </div>
    </div>

    <div id="vomiting_branch_female_lmp" class="hidden bg-slate-50/70 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
      <h3 class="text-xs sm:text-sm font-bold text-slate-800 flex items-center pb-2 border-b border-slate-200">
        <i data-lucide="heart-pulse" class="w-4 h-4 text-pink-500 mr-1.5"></i>ประวัติสตรีและการตั้งครรภ์
      </h3>
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-2">สถานะการตั้งครรภ์:</label>
        ${renderVomGrid('grid-cols-2 sm:grid-cols-3', [
          { kind: 'radio', name: 'vomitingPregnancyStatus', value: 'pregnant', onchange: "handleVomitingPregnancyStatusChange('pregnant')", title: vomWrap('กำลังตั้งครรภ์'), compact: true, bgWhite: true },
          { kind: 'radio', name: 'vomitingPregnancyStatus', value: 'suspected', onchange: "handleVomitingPregnancyStatusChange('suspected')", title: vomWrap('สงสัยว่าอาจตั้งครรภ์'), compact: true, bgWhite: true },
          { kind: 'radio', name: 'vomitingPregnancyStatus', value: 'not_pregnant', onchange: "handleVomitingPregnancyStatusChange('not_pregnant')", title: vomWrap('ไม่ได้ตั้งครรภ์'), compact: true, bgWhite: true },
          { kind: 'radio', name: 'vomitingPregnancyStatus', value: 'unsure', onchange: "handleVomitingPregnancyStatusChange('unsure')", title: vomWrap('ไม่แน่ใจ'), compact: true, bgWhite: true },
          { kind: 'radio', name: 'vomitingPregnancyStatus', value: 'menopause', onchange: "handleVomitingPregnancyStatusChange('menopause')", title: vomWrap('หมดประจำเดือนแล้ว'), compact: true, bgWhite: true }
        ])}
      </div>
      <div id="vomiting_female_detail_wrap" class="hidden space-y-3 pt-2 border-t border-slate-200/80">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">วันแรกของประจำเดือนครั้งล่าสุด:</label>
          ${renderVomGrid('grid-cols-1 sm:grid-cols-2', [
            { kind: 'radio', name: 'vomiting_lmp_status', value: 'regular_lmp_exact', onchange: "handleVomitingLmpStatusChange('regular_lmp_exact')", title: vomWrap('จำวันที่แน่นอนได้'), compact: true, bgWhite: true },
            { kind: 'radio', name: 'vomiting_lmp_status', value: 'approx_recent', onchange: "handleVomitingLmpStatusChange('approx_recent')", title: vomWrap('จำได้คร่าวๆ', '(1–4 สัปดาห์ก่อน)'), compact: true, bgWhite: true },
            { kind: 'radio', name: 'vomiting_lmp_status', value: 'missed_period', onchange: "handleVomitingLmpStatusChange('missed_period')", title: vomWrap('ประจำเดือนขาด', 'อย่างน้อย 1 รอบ'), compact: true, bgWhite: true },
            { kind: 'radio', name: 'vomiting_lmp_status', value: 'unknown', onchange: "handleVomitingLmpStatusChange('unknown')", title: vomWrap('จำไม่ได้ /', 'ไม่แน่ใจ'), compact: true, bgWhite: true }
          ])}
          <div id="vomiting_lmp_date_wrap" class="hidden mt-2 flex flex-wrap items-center gap-2">
            <span class="text-xs text-slate-600">วันแรกของประจำเดือนล่าสุด:</span>
            <input type="text" id="vomitingLmpDate" data-universal-date="true" placeholder="วว/ดด/ปปปป (dd/mm/yyyy)" class="w-full sm:w-64 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">การตรวจการตั้งครรภ์ด้วยตนเอง:</label>
          ${renderVomGrid('grid-cols-1 sm:grid-cols-3', [
            { kind: 'radio', name: 'vomitingPregnancyTestSelf', value: 'not_tested', title: vomWrap('ยังไม่ได้ตรวจ'), compact: true, bgWhite: true },
            { kind: 'radio', name: 'vomitingPregnancyTestSelf', value: 'tested_negative', title: vomWrap('ผลลบ (1 ขีด)'), compact: true, bgWhite: true },
            { kind: 'radio', name: 'vomitingPregnancyTestSelf', value: 'tested_positive', title: vomWrap('ผลบวก (2 ขีด)'), compact: true, bgWhite: true }
          ])}
        </div>
      </div>
    </div>

    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">ข้อมูลเพิ่มเติมจากผู้ป่วยหรือญาติ (ถ้ามี)</label>
      <textarea id="vomitingAdditionalNotes" rows="2" placeholder="ระบุรายละเอียดอื่นๆ เช่น ชื่ออาหารที่ทาน อาการที่กังวล หรือยาที่ทานไปก่อนมา รพ...." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"></textarea>
    </div>
  </div>
</div>`;

const VOM_FORM_HTML = `
<div id="vomitingQuestionnaireSection" class="hidden space-y-6">
  <div data-cc-top-banner="vomiting">
    <div class="p-3.5 bg-sky-50 border border-sky-200 rounded-2xl flex items-start space-x-3 shadow-sm">
      <i data-lucide="info" class="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5"></i>
      <div class="text-xs text-sky-900 leading-relaxed">
        <span class="font-bold text-sky-950 block mb-0.5">คำแนะนำการปฏิบัติตัวระหว่างรอตรวจ:</span>
        ให้นั่งเอนตัวหรือนอนตะแคงเพื่อป้องกันการสำลัก งดฝืนดื่มน้ำทีละมากๆ หากยังอาเจียนไม่หยุด เตรียมถุงรองรับอาเจียน และแจ้งพยาบาลทันทีหากเริ่มหน้ามืด ใจสั่น หรืออาเจียนเป็นเลือด
      </div>
    </div>
  </div>
  ${VOM_CARD1_HTML}
  ${VOM_CARD2_HTML}
  ${VOM_CARD3_HTML}
</div>`;

// --- Seed Cases (3 Red Flag Cases + 1 Low-Risk Case, Clean Syntax) ---
const VOM_SEED_PATIENTS = [
  {
    id: 'case-105',
    queue_number: 'A-105',
    hn: '6710512',
    name: 'นายสมพร กิจพาณิชย์',
    age: 62,
    gender: 'ชาย',
    chief_complaint: 'vomiting',
    chief_complaint_title: 'คลื่นไส้ / อาเจียน',
    status: 'waiting',
    timestamp: '2026-10-26T02:06:26.425Z',
    durationVal: 18,
    durationUnit: 'hours',
    vomitingOnsetMode: 'sudden_severe',
    vomitingFrequencyToday: 'severe_6_10',
    vomitingFoodRelation: 'independent_constant',
    vomitusCharacter: 'yellow_green_bile',
    vomitingPatternType: 'normal_retching',
    vomitusVolumePerTime: 'large_bowl',
    vomitingHasAbdominalPain: true,
    vomitingAbdpainLocs: ['periumbilical', 'diffuse'],
    vomitingAbdpainChar: 'cramping_colicky',
    vomitingHasDistension: true,
    vomitingHasConstipation: true,
    vomitingBowelHabit: 'constipation_obstipation_gte24h',
    vomitingConstipationSub: 'no_stool_no_gas',
    vomitingAbdominalDistension: 'marked_distension_tight',
    vomitingPriorAbdominalSurgery: 'yes',
    vomitingCardiacNone: true,
    vomitingCardiacFlags: ['none_cardiac'],
    vomitingNeuroNone: true,
    vomitingNeuroFlags: ['none_neuro'],
    vomitingOralIntolerance: 'intolerant_vomit_all',
    vomitingDehydrationSigns: ['oliguria_anuria', 'marked_dry_mouth_thirst'],
    vomitingPrecipitantNone: true,
    vomitingPrecipitants: ['none_precipitants'],
    vomitingAdditionalNotes: 'ปวดท้องบิดเป็นพักๆ ท้องอืดป่องแน่นตึง ไม่ผายลมมา 2 วัน เคยผ่าตัดไส้ติ่งเมื่อ 10 ปีก่อน',
    hospRecordStatus: 'additional',
    underlying: ['ความดันโลหิตสูง (HT)', 'เคยผ่าตัดไส้ติ่งอักเสบ (Appendectomy 10 ปีก่อน)'],
    drugAllergy: 'ปฏิเสธ',
    currentMeds: 'Amlodipine (5) 1x1 pc',
    doctor_notes: {
      additional_hpi: 'ชายอายุ 62 ปี มีประวัติเคยผ่าตัดไส้ติ่ง 10 ปีก่อน 18 ชั่วโมงก่อนมารพ. เริ่มมีอาการปวดท้องบิดเกร็งเป็นพักๆ ทั่วท้อง ท้องอืดแน่นตึงอย่างรวดเร็ว ร่วมกับอาเจียนพุ่งเป็นน้ำดีสีเขียวจัด 7 ครั้ง ปริมาณมาก ทานน้ำทานข้าวไม่ได้เลย ไม่ถ่ายอุจจาระและไม่ผายลมมา 2 วัน ปัสสาวะไม่ออกตั้งแต่เมื่อคืน',
      physical_exam: 'BT 37.2 C, PR 104/min, RR 20/min, BP 118/74 mmHg, SpO2 98%. Abdomen: Marked distension, hyperactive high-pitched bowel sounds, appendectomy surgical scar at RLQ, generalized tenderness without rebound. DRE: Empty rectal vault.',
      preliminary_dx: 'Mechanical Small Bowel Obstruction (SBO), likely secondary to Post-operative Peritoneal Adhesions',
      plan: '1. Strict NPO, insert NG tube for decompression.\n2. IV fluid resuscitation with 0.9% NSS 1,000 mL load.\n3. STAT Plain Film Abdomen (Supine & Upright).\n4. Labs: CBC, Electrolytes, BUN, Cr, Coagulogram.\n5. Urgent Surgical Consultation.'
    }
  },
  {
    id: 'case-106',
    queue_number: 'A-106',
    hn: '6710589',
    name: 'นางปราณี ว่องวิชิต',
    age: 68,
    gender: 'หญิง',
    chief_complaint: 'vomiting',
    chief_complaint_title: 'คลื่นไส้ / อาเจียน',
    status: 'waiting',
    timestamp: '2026-10-26T02:21:26.425Z',
    durationVal: 3,
    durationUnit: 'hours',
    vomitingOnsetMode: 'sudden_severe',
    vomitingFrequencyToday: 'moderate_3_5',
    vomitingFoodRelation: 'morning_fasting',
    vomitusCharacter: 'clear_gastric_juice',
    vomitingPatternType: 'normal_retching',
    vomitusVolumePerTime: 'moderate_cup',
    vomitingHasAbdominalPain: true,
    vomitingAbdpainLocs: ['epigastrium'],
    vomitingAbdpainChar: 'dull_aching',
    vomitingBowelHabit: 'normal_bowel',
    vomitingAbdominalDistension: 'none',
    vomitingCardiacFlags: ['chest_tightness_pressure', 'diaphoresis_cold_sweat', 'syncope_presyncope'],
    vomitingNeuroNone: true,
    vomitingNeuroFlags: ['none_neuro'],
    vomitingOralIntolerance: 'intolerant_vomit_all',
    vomitingDehydrationSigns: ['cold_clammy_extremities', 'postural_dizziness_blackout'],
    vomitingPrecipitantNone: true,
    vomitingPrecipitants: ['none_precipitants'],
    vomitingPregnancyStatus: 'menopause',
    vomitingAdditionalNotes: 'ตื่นเช้ามาคลื่นไส้อาเจียน เหงื่อแตกท่วมตัว ตัวเย็นเฉียบ จุกแน่นลิ้นปี่และคอหอย',
    hospRecordStatus: 'additional',
    underlying: ['เบาหวานชนิดที่ 2 (DM type 2)', 'ไขมันในเลือดสูง (Dyslipidemia)'],
    drugAllergy: 'ปฏิเสธ',
    currentMeds: 'Metformin (500) 1x2 pc, Glipizide (5) 1x1 ac, Atorvastatin (20) 1x1 hs',
    doctor_notes: {
      additional_hpi: 'หญิงอายุ 68 ปี โรคประจำตัวเบาหวานและไขมันในเลือดสูง เช้าวันนี้คลื่นไส้อาเจียน 4 ครั้ง เป็นน้ำย่อยใสๆ ร่วมกับเหงื่อแตกท่วมตัว ตัวเย็น หน้ามืดจะหมดสติ และจุกแน่นใต้ลิ้นปี่ร้าวขึ้นคอหอย',
      physical_exam: 'BT 36.4 C, PR 54/min, RR 20/min, BP 88/56 mmHg, SpO2 97%. General: Pale, marked diaphoresis, cool clammy extremities. Abdomen: Soft, mild epigastric discomfort.',
      preliminary_dx: 'Acute Inferior Wall STEMI with Sinus Bradycardia and Cardiogenic Shock (Atypical ACS)',
      plan: '1. Immediate 12-lead EKG STAT including right-sided leads (V3R, V4R).\n2. Activate STEMI Fast Track / Primary PCI.\n3. IV access x 2, cautious IV fluid resuscitation (avoid nitrates if BP < 90 or RV infarction suspected).\n4. STAT hs-Troponin, CBC, Electrolytes, BUN/Cr.'
    }
  },
  {
    id: 'case-107',
    queue_number: 'A-107',
    hn: '6710644',
    name: 'นางสาวกานดา สุขเจริญ',
    age: 24,
    gender: 'หญิง',
    chief_complaint: 'vomiting',
    chief_complaint_title: 'คลื่นไส้ / อาเจียน',
    status: 'waiting',
    timestamp: '2026-10-26T02:31:26.425Z',
    durationVal: 12,
    durationUnit: 'hours',
    vomitingOnsetMode: 'sudden_severe',
    vomitingFrequencyToday: 'intractable_gt_10',
    vomitingFoodRelation: 'independent_constant',
    vomitusCharacter: 'food_particles',
    vomitingPatternType: 'normal_retching',
    vomitusVolumePerTime: 'moderate_cup',
    vomitingHasAbdominalPain: true,
    vomitingAbdpainLocs: ['diffuse'],
    vomitingAbdpainChar: 'cramping_colicky',
    vomitingBowelHabit: 'normal_bowel',
    vomitingCardiacFlags: ['palpitation_racing_heart'],
    vomitingNeuroFlags: ['confusion_drowsiness'],
    vomitingOralIntolerance: 'intolerant_vomit_all',
    vomitingDehydrationSigns: ['oliguria_anuria', 'marked_dry_mouth_thirst', 'postural_dizziness_blackout'],
    vomitingPrecipitants: ['missed_dm_insulin'],
    vomitingPregnancyStatus: 'not_pregnant',
    vomitingAdditionalNotes: 'เป็นเบาหวานชนิดที่ 1 ขาดยาอินซูลิน 2 วัน อาเจียนเกิน 10 ครั้ง หายใจหอบลึก กระหายน้ำมาก ปัสสาวะไม่ออก',
    hospRecordStatus: 'additional',
    underlying: ['เบาหวานชนิดที่ 1 (Type 1 DM on Basal-Bolus Insulin)'],
    drugAllergy: 'ปฏิเสธ',
    currentMeds: 'Insulin Glargine 18 units hs, Insulin Lispro 6 units ac (ขาดยา 2 วัน)',
    doctor_notes: {
      additional_hpi: 'หญิงอายุ 24 ปี เป็นเบาหวานชนิดที่ 1 ขาดฉีดอินซูลิน 2 วัน 12 ชั่วโมงก่อนมารพ. คลื่นไส้อาเจียนมากกว่า 10 ครั้ง ทานน้ำไม่ได้เลย ปวดเกร็งทั่วท้อง กระหายน้ำมาก หายใจหอบลึก และเริ่มซึมลงสับสน',
      physical_exam: 'BT 36.8 C, PR 122/min, RR 28/min (Kussmaul breathing), BP 94/60 mmHg, SpO2 99%. General: Lethargic, severely dehydrated. DTX: High (> 500 mg/dL), Urine Ketone 4+.',
      preliminary_dx: 'Diabetic Ketoacidosis (DKA) with Severe Dehydration secondary to Insulin Non-compliance',
      plan: '1. 0.9% NSS 1,000-1,500 mL IV load in first hour.\n2. STAT VBG, Electrolytes, BUN/Cr, Blood Ketone, CBC.\n3. Initiate Regular Insulin IV infusion 0.1 unit/kg/hr once K > 3.3 mEq/L.\n4. Admit ICU/HDU for DKA protocol.'
    }
  },
  {
    id: 'case-108',
    queue_number: 'A-108',
    hn: '6710701',
    name: 'นายชวลิต มณีโชติ',
    age: 32,
    gender: 'ชาย',
    chief_complaint: 'vomiting',
    chief_complaint_title: 'คลื่นไส้ / อาเจียน',
    status: 'waiting',
    timestamp: '2026-10-26T02:36:26.425Z',
    durationVal: 6,
    durationUnit: 'hours',
    vomitingOnsetMode: 'gradual_worsening',
    vomitingFrequencyToday: 'moderate_3_5',
    vomitingFoodRelation: 'delayed_postprandial_hours',
    vomitusCharacter: 'food_particles',
    vomitingPatternType: 'normal_retching',
    vomitusVolumePerTime: 'moderate_cup',
    vomitingHasAbdominalPain: true,
    vomitingAbdpainLocs: ['epigastrium', 'periumbilical'],
    vomitingAbdpainChar: 'cramping_colicky',
    vomitingHasDiarrhea: true,
    vomitingBowelHabit: 'diarrhea_active',
    vomitingDiarrheaFreq: 3,
    vomitingDiarrheaStools: ['watery'],
    vomitingCardiacNone: true,
    vomitingCardiacFlags: ['none_cardiac'],
    vomitingNeuroNone: true,
    vomitingNeuroFlags: ['none_neuro'],
    vomitingOralIntolerance: 'can_drink_water',
    vomitingDehydrationNone: true,
    vomitingDehydrationSigns: ['none_dehydration'],
    vomitingPrecipitants: ['general_food_poisoning'],
    vomitingAdditionalNotes: 'คลื่นไส้อาเจียน 4 ครั้ง ถ่ายเหลวเป็นน้ำ 3 ครั้ง หลังทานส้มตำปูปลาร้าเมื่อคืน ไม่มีไข้ จิบน้ำเกลือแร่ได้',
    hospRecordStatus: 'self',
    underlying: ['ปฏิเสธ'],
    drugAllergy: 'ปฏิเสธ',
    currentMeds: 'ไม่มี',
    doctor_notes: {
      additional_hpi: 'ชายอายุ 32 ปี ไม่มีโรคประจำตัว รับประทานส้มตำปูปลาร้ากับเพื่อนเมื่อคืน 6 ชั่วโมงก่อนมารพ. มวนท้อง คลื่นไส้อาเจียนเป็นเศษอาหาร 4 ครั้ง ถ่ายเหลวเป็นน้ำ 3 ครั้ง ไม่มีมูกเลือด ไม่มีไข้ จิบน้ำเกลือแร่ได้ ปัสสาวะปกติ',
      physical_exam: 'BT 36.7 C, PR 82/min, RR 16/min, BP 122/78 mmHg, SpO2 99%. General: Alert, good skin turgor. Abdomen: Soft, non-distended, hyperactive bowel sounds, mild diffuse tenderness.',
      preliminary_dx: 'Acute Food Poisoning / Acute Gastroenteritis with Mild Dehydration',
      plan: '1. Oral Rehydration Therapy (ORS) in frequent small sips.\n2. Antiemetic: Ondansetron 4 mg IV or Domperidone PO.\n3. Discharge with ORS, symptomatic meds, and return precautions.'
    }
  }
];

registerCcModule({
  id: 'vomiting',
  recordCc: 'vomiting',
  titleTh: 'คลื่นไส้ / อาเจียน',
  titleEn: 'Nausea & Vomiting',
  headerTh: 'แบบฟอร์มซักประวัติ: คลื่นไส้ / อาเจียน',
  headerEn: '(Nausea & Vomiting)',
  patientBadgeHtml: '<i data-lucide="frown" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"></i><span class="whitespace-nowrap">คลื่นไส้ / อาเจียน</span>',
  sectionDomId: 'vomitingQuestionnaireSection',
  pmhSectionNumber: 4,
  getPmhSectionNumber: () => 4,
  doctorCcBadgeHtml: '<i data-lucide="frown" class="w-3 h-3 mr-1"></i> CC: คลื่นไส้ / อาเจียน (Nausea & Vomiting)',
  branchIds: [
    'vomitingAbdpainWrap', 'vomitingDiarrheaWrap', 'vomitingBloodyStoolWrap',
    'vomitingConstipationWrap', 'vomitingToxinFoodWrap', 'vomitingMedsWrap',
    'vomitingChemicalWrap', 'vomiting_branch_female_lmp', 'vomiting_female_detail_wrap',
    'vomiting_lmp_date_wrap'
  ],
  inputIdsToClear: [
    'vomitingDurationVal', 'vomitingDiarrheaFreq', 'vomitingToxinFoodType',
    'vomitingToxinFoodTime', 'vomitingChemicalDetails', 'vomitingLmpDate',
    'vomitingAdditionalNotes'
  ],
  formHtml: VOM_FORM_HTML,
  algorithm: {
    id: 'vomiting',
    schemaCode: 'severe_nausea_vomiting',
    titleTh: 'คลื่นไส้ / อาเจียน',
    titleEn: 'Nausea & Vomiting',
    sections: [
      { sectionNo: 1, titleTh: 'ระยะเวลา ความถี่ และลักษณะการอาเจียน' },
      { sectionNo: 2, titleTh: 'ภาวะขาดน้ำ และอาการร่วมทางช่องท้อง / ระบบอื่น' },
      { sectionNo: 3, titleTh: 'ปัจจัยกระตุ้น ยา สารพิษ ประวัติสตรี และข้อมูลเพิ่มเติม' }
    ]
  },
  seedPatients: VOM_SEED_PATIENTS,

  onTitleChange(arg) {
    syncVomitingCcRegistryMeta();
    updateVomitingFemaleContext(arg);
  },

  onSelectForm() {
    syncVomitingCcRegistryMeta();
    updateVomitingFemaleContext();
  },

  onActivate() {
    syncVomitingCcRegistryMeta();
    updateVomitingFemaleContext();
  },

  resetForm() {
    const sec = document.getElementById('vomitingQuestionnaireSection');
    if (sec) {
      sec.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(el => { el.checked = false; });
      sec.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach(el => {
        el.value = '';
        el.disabled = false;
      });
    }
    const unitEl = document.getElementById('vomitingDurationUnit');
    if (unitEl) unitEl.value = 'hours';
    syncVomitingGiBranches();
    syncVomitingPrecipBranches();
    handleVomitingPregnancyStatusChange('');
    updateVomitingFemaleContext();
  },

  hydrateForm(patient) {
    syncVomitingCcRegistryMeta();
    if (!patient) return;
    this.resetForm();

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = (val !== undefined && val !== null) ? val : '';
    };
    const setChk = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.checked = Boolean(val);
    };

    setVal('vomitingDurationVal', patient.durationVal || '');
    setVal('vomitingDurationUnit', patient.durationUnit || 'hours');

    setVomRadioVal('vomitingOnsetMode', patient.vomitingOnsetMode !== 'unspecified' ? patient.vomitingOnsetMode : '');
    setVomRadioVal('vomitingFrequencyToday', patient.vomitingFrequencyToday !== 'unspecified' ? patient.vomitingFrequencyToday : '');
    setVomRadioVal('vomitingFoodRelation', patient.vomitingFoodRelation !== 'unspecified' ? patient.vomitingFoodRelation : '');
    setVomRadioVal('vomitusCharacter', patient.vomitusCharacter !== 'unspecified' ? patient.vomitusCharacter : '');
    setVomRadioVal('vomitingPatternType', patient.vomitingPatternType !== 'unspecified' ? patient.vomitingPatternType : '');
    setVomRadioVal('vomitusVolumePerTime', patient.vomitusVolumePerTime !== 'unspecified' ? patient.vomitusVolumePerTime : '');

    // Hydration & Dehydration
    setVomRadioVal('vomitingOralIntolerance', patient.vomitingOralIntolerance !== 'unspecified' ? patient.vomitingOralIntolerance : '');
    const dehyArr = Array.isArray(patient.vomitingDehydrationSigns) ? patient.vomitingDehydrationSigns : [];
    const dehyPos = dehyArr.filter(k => k && k !== 'none_dehydration');
    setVomCheckedVals('vomitingDehydrationSigns', dehyPos);
    setChk('vomiting_dehy_none', dehyPos.length === 0 && (patient.vomitingDehydrationNone || dehyArr.includes('none_dehydration')));

    // GI & Bowel
    const bowel = patient.vomitingBowelHabit || '';
    const hasAbd = Boolean(patient.vomitingHasAbdominalPain);
    const hasDist = Boolean(patient.vomitingHasDistension || patient.vomitingAbdominalDistension === 'marked_distension_tight');
    const hasFev = Boolean(patient.vomitingHasFever);
    const hasDiar = Boolean(patient.vomitingHasDiarrhea || bowel === 'diarrhea_active');
    const hasBlood = Boolean(patient.vomitingHasBloodyStool || bowel === 'bloody_melena_stool');
    const hasConst = Boolean(patient.vomitingHasConstipation || bowel === 'constipation_obstipation_gte24h');

    setChk('vomitingHasAbdominalPain', hasAbd);
    setChk('vomiting_gi_distension', hasDist);
    setChk('vomiting_gi_fever', hasFev);
    setChk('vomiting_gi_diarrhea', hasDiar);
    setChk('vomiting_gi_bloody_stool', hasBlood);
    setChk('vomiting_gi_constipation', hasConst);
    const anyGiPos = hasAbd || hasDist || hasFev || hasDiar || hasBlood || hasConst;
    setChk('vomiting_gi_none', !anyGiPos && (Boolean(patient.vomitingGiNone) || (bowel === 'normal_bowel' && patient.vomitingAbdominalDistension === 'none')));
    syncVomitingGiBranches();

    if (hasAbd) {
      setVomCheckedVals('vomitingAbdpainLocs', patient.vomitingAbdpainLocs);
      setVomRadioVal('vomitingAbdpainChar', patient.vomitingAbdpainChar || '');
    }
    if (hasDiar) {
      setVal('vomitingDiarrheaFreq', patient.vomitingDiarrheaFreq || '');
      setVomCheckedVals('vomitingDiarrheaStools', patient.vomitingDiarrheaStools);
    }
    if (hasBlood) {
      setVomRadioVal('vomitingBloodyStoolChar', patient.vomitingBloodyStoolChar || '');
    }
    if (hasConst) {
      setVomRadioVal('vomitingConstipationSub', patient.vomitingConstipationSub || '');
      setVomRadioVal('vomitingPriorAbdominalSurgery', patient.vomitingPriorAbdominalSurgery && patient.vomitingPriorAbdominalSurgery !== 'unspecified' ? patient.vomitingPriorAbdominalSurgery : '');
    }

    // Cardiac & Neuro
    const cArr = Array.isArray(patient.vomitingCardiacFlags) ? patient.vomitingCardiacFlags : [];
    const cPos = cArr.filter(k => k && k !== 'none_cardiac');
    setVomCheckedVals('vomitingCardiacFlags', cPos);
    setChk('vomiting_cardiac_none', cPos.length === 0 && (patient.vomitingCardiacNone || cArr.includes('none_cardiac')));

    const nArr = Array.isArray(patient.vomitingNeuroFlags) ? patient.vomitingNeuroFlags : [];
    const nPos = nArr.filter(k => k && k !== 'none_neuro');
    setVomCheckedVals('vomitingNeuroFlags', nPos);
    setChk('vomiting_neuro_none', nPos.length === 0 && (patient.vomitingNeuroNone || nArr.includes('none_neuro')));

    // Precipitants, Meds & Toxins
    const pArr = Array.isArray(patient.vomitingPrecipitants) ? patient.vomitingPrecipitants : [];
    const pPos = pArr.filter(k => k && k !== 'none_precipitants');
    setVomCheckedVals('vomitingPrecipitants', pPos);
    setChk('vomitingPrecipitantNoneCb', pPos.length === 0 && (patient.vomitingPrecipitantNone || pArr.includes('none_precipitants')));
    syncVomitingPrecipBranches();

    if (pPos.includes('natural_toxin_food')) {
      setVal('vomitingToxinFoodType', patient.vomitingToxinFoodType || patient.vomitingToxinFoodDetails || '');
      setChk('vomitingToxinFoodTimeUnknown', Boolean(patient.vomitingToxinFoodTimeUnknown));
      handleVomitingToxinTimeUnknownChange(Boolean(patient.vomitingToxinFoodTimeUnknown));
      if (!patient.vomitingToxinFoodTimeUnknown) setVal('vomitingToxinFoodTime', patient.vomitingToxinFoodTime || '');
      setVomRadioVal('vomitingToxinFoodCoEaters', patient.vomitingToxinFoodCoEaters || '');
    }
    if (pPos.includes('high_risk_medications')) {
      setVomCheckedVals('vomitingMedList', patient.vomitingMedList);
    }
    if (pPos.includes('suspected_toxin_chemical')) {
      setVal('vomitingChemicalDetails', patient.vomitingChemicalDetails || '');
    }

    // Female Reproductive History
    const isFemale = patient.gender === 'หญิง';
    updateVomitingFemaleContext(isFemale);
    if (isFemale) {
      let pregStatus = patient.vomitingPregnancyStatus || '';
      if (!pregStatus && patient.vomiting_lmp_status) {
        if (patient.vomiting_lmp_status === 'post_menopausal_or_hysterectomy') pregStatus = 'menopause';
        else if (patient.vomiting_lmp_status === 'missed_period' || patient.vomitingPregnancyTestSelf === 'tested_positive') pregStatus = 'suspected';
        else if (patient.vomitingPregnancyTestSelf === 'tested_negative') pregStatus = 'not_pregnant';
      }
      setVomRadioVal('vomitingPregnancyStatus', pregStatus);
      handleVomitingPregnancyStatusChange(pregStatus);
      if (['pregnant', 'suspected', 'unsure'].includes(pregStatus)) {
        setVomRadioVal('vomiting_lmp_status', patient.vomiting_lmp_status || '');
        handleVomitingLmpStatusChange(patient.vomiting_lmp_status || '');
        const dt = typeof formatDateDdMmYyyy === 'function' ? formatDateDdMmYyyy(patient.vomitingLmpDate || '') : (patient.vomitingLmpDate || '');
        setVal('vomitingLmpDate', dt);
        setVomRadioVal('vomitingPregnancyTestSelf', patient.vomitingPregnancyTestSelf || '');
      }
    }

    setVal('vomitingAdditionalNotes', patient.vomitingAdditionalNotes || '');
  },

  collectIntake(ctx = {}) {
    syncVomitingCcRegistryMeta();
    const {
      recordId = `pat-${Date.now()}`,
      queueNumber = '',
      randomHn = '',
      patientName = '',
      patientAge = null,
      gender = 'ไม่ระบุ',
      recordStatus = 'waiting',
      hospRecordStatus = 'unspecified',
      underlying = [],
      drugAllergy = '',
      currentMeds = '',
      preservedDoctorNotes = {}
    } = ctx;
    let { otherSymptomsFree = '' } = ctx;

    const rawDur = parseFloat(document.getElementById('vomitingDurationVal')?.value);
    const durationVal = (!isNaN(rawDur) && rawDur > 0) ? rawDur : null;
    const durationUnit = document.getElementById('vomitingDurationUnit')?.value || 'hours';

    const vomitingOnsetMode = getVomRadioVal('vomitingOnsetMode') || 'unspecified';
    const vomitingFrequencyToday = getVomRadioVal('vomitingFrequencyToday') || 'unspecified';
    const vomitingFoodRelation = getVomRadioVal('vomitingFoodRelation') || 'unspecified';
    const vomitusCharacter = getVomRadioVal('vomitusCharacter') || 'unspecified';
    const vomitingPatternType = getVomRadioVal('vomitingPatternType') || 'unspecified';
    const vomitusVolumePerTime = getVomRadioVal('vomitusVolumePerTime') || 'unspecified';

    // Hydration & Dehydration (Zero Default Bias)
    const vomitingOralIntolerance = getVomRadioVal('vomitingOralIntolerance') || 'unspecified';
    const dehyPos = getVomCheckedVals('vomitingDehydrationSigns');
    const vomitingDehydrationNone = dehyPos.length === 0 && Boolean(document.getElementById('vomiting_dehy_none')?.checked);
    const vomitingDehydrationSigns = dehyPos.length > 0 ? dehyPos : (vomitingDehydrationNone ? ['none_dehydration'] : []);

    // GI & Bowel
    const vomitingHasAbdominalPain = Boolean(document.getElementById('vomitingHasAbdominalPain')?.checked);
    const vomitingAbdpainLocs = vomitingHasAbdominalPain ? getVomCheckedVals('vomitingAbdpainLocs') : [];
    const vomitingAbdpainChar = vomitingHasAbdominalPain ? getVomRadioVal('vomitingAbdpainChar') : '';

    const vomitingHasDistension = Boolean(document.getElementById('vomiting_gi_distension')?.checked);
    const vomitingHasFever = Boolean(document.getElementById('vomiting_gi_fever')?.checked);
    const vomitingHasDiarrhea = Boolean(document.getElementById('vomiting_gi_diarrhea')?.checked);
    const vomitingHasBloodyStool = Boolean(document.getElementById('vomiting_gi_bloody_stool')?.checked);
    const vomitingHasConstipation = Boolean(document.getElementById('vomiting_gi_constipation')?.checked);

    const anyGiPos = vomitingHasAbdominalPain || vomitingHasDistension || vomitingHasFever || vomitingHasDiarrhea || vomitingHasBloodyStool || vomitingHasConstipation;
    const vomitingGiNone = !anyGiPos && Boolean(document.getElementById('vomiting_gi_none')?.checked);

    const rawDiarFreq = parseInt(document.getElementById('vomitingDiarrheaFreq')?.value, 10);
    const vomitingDiarrheaFreq = (vomitingHasDiarrhea && !isNaN(rawDiarFreq) && rawDiarFreq > 0) ? rawDiarFreq : 0;
    const vomitingDiarrheaStools = vomitingHasDiarrhea ? getVomCheckedVals('vomitingDiarrheaStools') : [];
    const vomitingBloodyStoolChar = vomitingHasBloodyStool ? getVomRadioVal('vomitingBloodyStoolChar') : '';
    const vomitingConstipationSub = vomitingHasConstipation ? getVomRadioVal('vomitingConstipationSub') : '';
    const vomitingPriorAbdominalSurgery = vomitingHasConstipation ? (getVomRadioVal('vomitingPriorAbdominalSurgery') || 'unspecified') : 'unspecified';

    let vomitingBowelHabit = 'unspecified';
    if (vomitingHasBloodyStool) vomitingBowelHabit = 'bloody_melena_stool';
    else if (vomitingHasConstipation) vomitingBowelHabit = 'constipation_obstipation_gte24h';
    else if (vomitingHasDiarrhea) vomitingBowelHabit = 'diarrhea_active';
    else if (vomitingGiNone) vomitingBowelHabit = 'normal_bowel';

    const vomitingAbdominalDistension = vomitingHasDistension
      ? 'marked_distension_tight'
      : (vomitingGiNone ? 'none' : 'unspecified');

    // Cardiac & Neuro
    const cPos = getVomCheckedVals('vomitingCardiacFlags');
    const vomitingCardiacNone = cPos.length === 0 && Boolean(document.getElementById('vomiting_cardiac_none')?.checked);
    const vomitingCardiacFlags = cPos.length > 0 ? cPos : (vomitingCardiacNone ? ['none_cardiac'] : []);

    const nPos = getVomCheckedVals('vomitingNeuroFlags');
    const vomitingNeuroNone = nPos.length === 0 && Boolean(document.getElementById('vomiting_neuro_none')?.checked);
    const vomitingNeuroFlags = nPos.length > 0 ? nPos : (vomitingNeuroNone ? ['none_neuro'] : []);

    // Precipitants, Meds & Toxins
    const pPos = getVomCheckedVals('vomitingPrecipitants');
    const vomitingPrecipitantNone = pPos.length === 0 && Boolean(document.getElementById('vomitingPrecipitantNoneCb')?.checked);
    const vomitingPrecipitants = pPos.length > 0 ? pPos : (vomitingPrecipitantNone ? ['none_precipitants'] : []);

    const vomitingMedList = pPos.includes('high_risk_medications') ? getVomCheckedVals('vomitingMedList') : [];
    const vomitingToxinFoodType = pPos.includes('natural_toxin_food') ? (document.getElementById('vomitingToxinFoodType')?.value.trim() || '') : '';
    const vomitingToxinFoodTimeUnknown = pPos.includes('natural_toxin_food') && Boolean(document.getElementById('vomitingToxinFoodTimeUnknown')?.checked);
    const vomitingToxinFoodTime = (pPos.includes('natural_toxin_food') && !vomitingToxinFoodTimeUnknown) ? (document.getElementById('vomitingToxinFoodTime')?.value.trim() || '') : '';
    const vomitingToxinFoodCoEaters = pPos.includes('natural_toxin_food') ? getVomRadioVal('vomitingToxinFoodCoEaters') : '';
    const vomitingToxinFoodDetails = [vomitingToxinFoodType, vomitingToxinFoodTime].filter(Boolean).join(', ');
    const vomitingChemicalDetails = pPos.includes('suspected_toxin_chemical') ? (document.getElementById('vomitingChemicalDetails')?.value.trim() || '') : '';

    // Female Reproductive History (Strictly guarded for gender === 'หญิง')
    const isFemale = gender === 'หญิง';
    const vomitingPregnancyStatus = isFemale ? getVomRadioVal('vomitingPregnancyStatus') : '';
    const detailOpen = isFemale && ['pregnant', 'suspected', 'unsure'].includes(vomitingPregnancyStatus);
    const vomiting_lmp_status = detailOpen ? getVomRadioVal('vomiting_lmp_status') : '';
    const vomitingLmpDate = (detailOpen && vomiting_lmp_status === 'regular_lmp_exact') ? (document.getElementById('vomitingLmpDate')?.value.trim() || '') : '';
    const vomitingPregnancyTestSelf = detailOpen ? getVomRadioVal('vomitingPregnancyTestSelf') : '';

    const vomitingAdditionalNotes = document.getElementById('vomitingAdditionalNotes')?.value.trim() || '';
    if (vomitingAdditionalNotes) otherSymptomsFree = vomitingAdditionalNotes;

    return {
      id: recordId,
      queue_number: queueNumber,
      hn: randomHn,
      name: patientName,
      age: patientAge,
      gender,
      chief_complaint: 'vomiting',
      chief_complaint_title: 'คลื่นไส้ / อาเจียน',
      status: recordStatus,
      timestamp: new Date().toISOString(),
      durationVal,
      durationUnit,
      vomitingOnsetMode,
      vomitingFrequencyToday,
      vomitingFoodRelation,
      vomitusCharacter,
      vomitingPatternType,
      vomitusVolumePerTime,
      vomitingOralIntolerance,
      vomitingDehydrationNone,
      vomitingDehydrationSigns,
      vomitingGiNone,
      vomitingHasAbdominalPain,
      vomitingAbdpainLocs,
      vomitingAbdpainChar,
      vomitingHasDistension,
      vomitingHasFever,
      vomitingHasDiarrhea,
      vomitingHasBloodyStool,
      vomitingHasConstipation,
      vomitingBowelHabit,
      vomitingDiarrheaFreq,
      vomitingDiarrheaStools,
      vomitingBloodyStoolChar,
      vomitingConstipationSub,
      vomitingAbdominalDistension,
      vomitingPriorAbdominalSurgery,
      vomitingCardiacNone,
      vomitingCardiacFlags,
      vomitingNeuroNone,
      vomitingNeuroFlags,
      vomitingPrecipitantNone,
      vomitingPrecipitants,
      vomitingMedList,
      vomitingToxinFoodType,
      vomitingToxinFoodTimeUnknown,
      vomitingToxinFoodTime,
      vomitingToxinFoodCoEaters,
      vomitingToxinFoodDetails,
      vomitingChemicalDetails,
      vomitingPregnancyStatus,
      vomiting_lmp_status,
      vomitingLmpDate,
      vomitingPregnancyTestSelf,
      vomitingAdditionalNotes,
      otherSymptomsFree,
      hospRecordStatus,
      underlying: underlying.length > 0 ? underlying : ((hospRecordStatus === 'self' || hospRecordStatus === 'additional') ? ['ปฏิเสธ'] : []),
      drugAllergy,
      currentMeds,
      doctor_notes: preservedDoctorNotes
    };
  },

  isRedFlag(p) {
    return detectVomitingRedFlags(p).length > 0;
  },

  evaluateRedFlags(patient) {
    return detectVomitingRedFlags(patient);
  },

  updateOutputs(patient) {
    return updateVomitingOutputs(patient);
  }
});
