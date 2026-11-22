// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 16_allergy.js
// อาการนำ: ผื่นแพ้เฉียบพลัน / แน่นคอ ตาบวม ปากบวม (Acute Allergic Reaction / Angioedema / Anaphylaxis)
// แผนการพัฒนา: 4 การ์ดมาตรฐาน + Universal Free-Text Card + Dynamic Context Filtering (C-AP1 ถึง C-AP16)
// =========================================================================

// --- Lookup Dictionaries (Zero Raw Enum Leaks: C-AP14) ---
const ALLERGY_LABELS = {
  durationUnit: {
    minutes: 'นาที',
    hours: 'ชั่วโมง',
    days: 'วัน',
    weeks: 'สัปดาห์',
    months: 'เดือน',
    years: 'ปี'
  },
  onsetSpeed: {
    rapid_within_minutes: 'เกิดขึ้นเร็วมากภายในไม่กี่นาทีถึง 2 ชั่วโมง',
    gradual_throughout_day: 'ค่อยๆ เป็นมากขึ้นใน 2 ถึง 24 ชั่วโมง',
    chronic_gt_6weeks: 'เป็นผื่นต่อเนื่องหรือเป็นๆ หายๆ หลายวัน (มากกว่า 1 วัน)',
    unspecified: 'ไม่ได้ระบุความเร็วในการเกิดอาการ'
  },
  onsetTimeKnown: {
    known: 'ระบุวันที่และเวลาที่เริ่มมีอาการได้',
    unknown: 'ไม่ทราบเวลาที่แน่นอน',
    unspecified: 'ไม่ได้ระบุเวลาเริ่มอาการ'
  },
  trigger: {
    food: 'รับประทานอาหาร',
    medication: 'รับประทานยา หรือฉีดยาแผนปัจจุบัน',
    herbal_supplement: 'ทานสมุนไพร ยาชุด ยาต้ม หรืออาหารเสริม',
    insect_sting: 'ถูกแมลงกัดหรือต่อย',
    radiocontrast_anesthesia: 'ฉีดสารทึบรังสี หรือได้รับยาชา',
    contact_latex_chemical: 'สัมผัสสารเคมี ถุงมือยาง หรือเครื่องสำอาง',
    unknown_trigger: 'ไม่ทราบสิ่งกระตุ้นแน่ชัด'
  },
  skinRash: {
    urticaria: 'ผื่นลมพิษนูนแดง คันมาก',
    flushing: 'ผิวหนังแดงก่ำ ร้อนวูบวาบ',
    erythema_maculopapular: 'ผื่นแดงราบ หรือตุ่มแดงเล็กๆ',
    blisters_peeling: 'ตุ่มน้ำพอง หรือผิวหนังลอก',
    purpura_petechiae: 'จุดเลือดออกใต้ผิวหนัง หรือจ้ำม่วง',
    none_rash: 'ไม่มีผื่นขึ้นตามผิวหนัง'
  },
  mucosaFever: {
    mucosal_oral_ulcer: 'มีแผลเจ็บในปาก หรือริมฝีปากลอกแตก',
    mucosal_ocular: 'ตาแดง แสบตา หรือมีขี้ตามากผิดปกติ',
    skin_pain_tenderness: 'ปวดแสบปวดร้อนบริเวณผิวหนังที่เป็นผื่น',
    fever_chills: 'มีไข้ ตัวร้อน หรือหนาวสั่นร่วมด้วย',
    none_mucosa_fever: 'ไม่มีอาการเจ็บเยื่อบุหรือไข้ข้างต้น'
  },
  angioedema: {
    lips: 'ริมฝีปากบวมเจ่อ',
    tongue_palate: 'ลิ้นบวมคับปาก หรือเพดานปากบวม',
    periorbital_face: 'เปลือกตาบวม หรือใบหน้าบวมตึง',
    ears_neck: 'ใบหูบวม หรือลำคอด้านนอกบวม',
    extremities_genitalia: 'มือบวม เท้าบวม หรืออวัยวะเพศบวม',
    none_angioedema: 'ไม่มีอาการบวมตามร่างกาย'
  },
  upperAirway: {
    throat_tightness: 'แน่นในลำคอ หรือจุกคอหอย',
    dysphagia_drooling: 'กลืนลำบาก หรือน้ำลายไหลย้อย',
    voice_hoarseness: 'เสียงแหบ หรือพูดเสียงเปลี่ยน',
    stridor: 'หายใจมีเสียงฮืดแหลมในลำคอ',
    nasal_congestion: 'คัดแน่นจมูก น้ำมูกไหล หรือจามรัว',
    none_upper_airway: 'ไม่มีอาการทางลำคอและทางเดินหายใจส่วนบน'
  },
  lowerAirway: {
    dyspnea: 'หายใจหอบเหนื่อย หรือหายใจไม่อิ่ม',
    wheezing: 'หายใจมีเสียงหวีดในหน้าอก',
    chest_tightness: 'แน่นอึดอัดหน้าอก หรือไอแห้งๆ รัวๆ',
    cyanosis: 'ริมฝีปากเขียว หรือปลายมือเขียวคล้ำ',
    none_lower_airway: 'ไม่มีอาการเหนื่อยหอบหรือทางเดินหายใจส่วนล่าง'
  },
  circulation: {
    presyncope_dizziness: 'หน้ามืด วิงเวียน หรือตาพร่ามัว',
    syncope: 'วูบ เป็นลม หรือหมดสติ',
    cold_diaphoresis: 'เหงื่อแตกตัวเย็น หน้าซีด หรือใจสั่น',
    altered_mental: 'สับสน กระสับกระส่าย หรือซึมลง',
    none_circulation: 'ไม่มีอาการหน้ามืด วูบ หรือภาวะช็อก'
  },
  gi: {
    severe_abd_cramps: 'ปวดบิดเกร็งท้องรุนแรง',
    repetitive_vomiting: 'คลื่นไส้ หรืออาเจียนหลายครั้ง',
    watery_diarrhea: 'ถ่ายเหลวเป็นน้ำเฉียบพลัน',
    none_gi: 'ไม่มีอาการระบบทางเดินอาหาร'
  },
  priorAnaphylaxis: {
    prior_severe_hosp: 'เคยแพ้รุนแรงจนต้องฉีดยาที่ต้นขาหรือนอนโรงพยาบาล',
    prior_mild_urticaria: 'เคยมีเฉพาะผื่นลมพิษหรือผื่นคันธรรมดา (ไม่ได้นอน รพ.)',
    first_time_never: 'ไม่เคยมีประวัติแพ้มาก่อน ครั้งนี้เป็นครั้งแรก',
    unspecified: 'ไม่ได้ระบุประวัติการแพ้ในอดีต'
  },
  epipenUsage: {
    used_prehospital: 'ได้ฉีดยาแก้แพ้พกพา (EpiPen) แล้วก่อนมาโรงพยาบาล',
    has_not_used: 'มียาฉีดแก้แพ้พกพา (EpiPen) แต่ยังไม่ได้ฉีด',
    none_epipen: 'ไม่มียาฉีดแก้แพ้พกพาประจำตัว',
    unspecified: 'ไม่ได้ระบุการใช้ยาฉีดแก้แพ้พกพา'
  },
  prehospOralMed: {
    none_oral_med: 'ยังไม่ได้รับประทานยาแก้แพ้ใดๆ',
    antihistamine_no_improve: 'รับประทานยาแก้แพ้มาแล้วแต่อาการยังไม่ดีขึ้น',
    unspecified: 'ไม่ได้ระบุการทานยาแก้แพ้เบื้องต้น'
  },
  specialMed: {
    ace_inhibitors: 'ยาลดความดันกลุ่ม ACE inhibitors (-pril)',
    beta_blockers: 'ยาลดความดัน/ลดชีพจรกลุ่ม Beta-blockers (-lol)',
    unknown_special_meds: 'ไม่แน่ใจ (มียาประจำตัวแต่ไม่ทราบกลุ่มยา)',
    none_special_meds: 'ไม่ได้รับประทานยากลุ่มเสี่ยงดังกล่าว'
  },
  pmh: {
    asthma: 'โรคหอบหืด หรือโรคปอดเรื้อรัง',
    cad_cvd: 'โรคหัวใจ หรือโรคหลอดเลือดหัวใจ',
    atopic_dermatitis: 'โรคผื่นภูมิแพ้ผิวหนัง',
    none_pmh_specific: 'ไม่มีโรคประจำตัวดังกล่าว'
  },
  hospStatus: {
    complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
    additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
    self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
    unspecified: 'ไม่ได้ระบุ'
  }
};

// --- DOM Helpers & Dynamic Context Handlers ---
function toggleAllergyBranch(id, show) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('hidden', !show);
}

function getAllergyRadioValue(name) {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : '';
}

function setAllergyRadioValue(name, val) {
  document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
    r.checked = Boolean(val && r.value === val);
  });
}

function getAllergyCheckedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(el => el.value);
}

function setAllergyCheckboxGroup(name, values) {
  const list = Array.isArray(values) ? values : [];
  document.querySelectorAll(`input[name="${name}"]`).forEach(cb => {
    cb.checked = list.includes(cb.value);
  });
}

function handleAllergyExclusiveGroup(name, noneVal, el) {
  if (!el || !el.checked) return;
  if (el.value === noneVal) {
    document.querySelectorAll(`input[name="${name}"]`).forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  } else {
    const noneEl = document.querySelector(`input[name="${name}"][value="${noneVal}"]`);
    if (noneEl) noneEl.checked = false;
  }
}

function handleAllergyOnsetTimeKnownChange(val) {
  const isKnown = (val || getAllergyRadioValue('allergyOnsetTimeKnown')) === 'known';
  toggleAllergyBranch('allergyExactTimeWrap', isKnown);
  if (!isKnown) {
    const d = document.getElementById('allergyOnsetExactDate');
    const t = document.getElementById('allergyOnsetExactTime');
    if (d) d.value = '';
    if (t) t.value = '';
  }
}

const ALLERGY_TRIGGER_WRAPS = {
  food: { wrap: 'allergyTriggerFoodWrap', input: 'allergyTriggerFoodText' },
  medication: { wrap: 'allergyTriggerMedWrap', input: 'allergyTriggerMedText' },
  herbal_supplement: { wrap: 'allergyTriggerHerbWrap', input: 'allergyTriggerHerbText' },
  insect_sting: { wrap: 'allergyTriggerInsectWrap', input: 'allergyTriggerInsectText' }
};

function syncAllergyTriggerBranches() {
  Object.entries(ALLERGY_TRIGGER_WRAPS).forEach(([val, cfg]) => {
    const cb = document.querySelector(`input[name="allergySuspectedTriggers"][value="${val}"]`);
    const active = Boolean(cb && cb.checked);
    toggleAllergyBranch(cfg.wrap, active);
    if (!active) {
      const inp = document.getElementById(cfg.input);
      if (inp) inp.value = '';
    }
  });
}

function handleAllergyTriggerChange(el) {
  handleAllergyExclusiveGroup('allergySuspectedTriggers', 'unknown_trigger', el);
  syncAllergyTriggerBranches();
}

function updateAllergyMucosaContext() {
  const checked = getAllergyCheckedValues('allergySkinRash');
  const needsMucosa = ['blisters_peeling', 'erythema_maculopapular', 'purpura_petechiae'].some(k => checked.includes(k));
  toggleAllergyBranch('allergyMucosaFeverWrap', needsMucosa);
  if (!needsMucosa) {
    document.querySelectorAll('input[name="allergyMucosaFever"]').forEach(cb => {
      cb.checked = false;
    });
  }
}

function handleAllergySkinRashChange(el) {
  handleAllergyExclusiveGroup('allergySkinRash', 'none_rash', el);
  updateAllergyMucosaContext();
}

function handleAllergyPriorAnaphylaxisChange(val) {
  const current = val || getAllergyRadioValue('allergyPriorAnaphylaxis');
  const showEpi = current === 'prior_severe_hosp';
  toggleAllergyBranch('allergyEpipenWrap', showEpi);
  if (!showEpi) {
    setAllergyRadioValue('allergyEpipenUsage', '');
    handleAllergyEpipenUsageChange('');
  }
}

function handleAllergyEpipenUsageChange(val) {
  const current = val || getAllergyRadioValue('allergyEpipenUsage');
  const showTime = current === 'used_prehospital';
  toggleAllergyBranch('allergyEpipenTimeWrap', showTime);
  if (!showTime) {
    const inp = document.getElementById('allergyEpipenTimeText');
    const unk = document.getElementById('allergyEpipenTimeUnknown');
    if (inp) inp.value = '';
    if (unk) unk.checked = false;
  }
}

function handleAllergyEpipenTimeUnknownToggle(el) {
  const inp = document.getElementById('allergyEpipenTimeText');
  if (el && el.checked && inp) {
    inp.value = '';
  }
}

function handleAllergyEpipenTimeInput() {
  const inp = document.getElementById('allergyEpipenTimeText');
  const unk = document.getElementById('allergyEpipenTimeUnknown');
  if (inp && inp.value.trim() && unk) {
    unk.checked = false;
  }
}

// --- Red Flag Evaluator (WAO 2020 / NIAID Anaphylaxis + SCARs + ACEi — No Under, No Over) ---
function evaluateAllergyRedFlags(patient) {
  const flags = [];
  if (!patient) return flags;

  const skinRash = Array.isArray(patient.allergySkinRash) ? patient.allergySkinRash : [];
  const mucosaFever = Array.isArray(patient.allergyMucosaFever) ? patient.allergyMucosaFever : [];
  const angioedema = Array.isArray(patient.allergyAngioedema) ? patient.allergyAngioedema : [];
  const upperAirway = Array.isArray(patient.allergyUpperAirway) ? patient.allergyUpperAirway : [];
  const lowerAirway = Array.isArray(patient.allergyLowerAirway) ? patient.allergyLowerAirway : [];
  const circulation = Array.isArray(patient.allergyCirculationShock) ? patient.allergyCirculationShock : [];
  const gi = Array.isArray(patient.allergyGiSymptoms) ? patient.allergyGiSymptoms : [];
  const triggers = Array.isArray(patient.allergySuspectedTriggers) ? patient.allergySuspectedTriggers : [];
  const specialMeds = Array.isArray(patient.allergySpecialMeds) ? patient.allergySpecialMeds : [];
  const pmhSpecific = Array.isArray(patient.allergyPmhSpecific) ? patient.allergyPmhSpecific : [];

  const hasSkinMucosa = ['urticaria', 'flushing'].some(k => skinRash.includes(k)) ||
    ['lips', 'tongue_palate', 'periorbital_face'].some(k => angioedema.includes(k));
  const hasUpperCompromise = ['throat_tightness', 'dysphagia_drooling', 'voice_hoarseness', 'stridor'].some(k => upperAirway.includes(k));
  const hasLowerAirway = ['dyspnea', 'wheezing', 'chest_tightness', 'cyanosis'].some(k => lowerAirway.includes(k));
  const hasCirculation = ['presyncope_dizziness', 'syncope', 'cold_diaphoresis', 'altered_mental'].some(k => circulation.includes(k));
  const hasSevereGi = ['severe_abd_cramps', 'repetitive_vomiting', 'watery_diarrhea'].some(k => gi.includes(k));
  const hasKnownTrigger = triggers.some(t => ['food', 'medication', 'herbal_supplement', 'insect_sting', 'radiocontrast_anesthesia'].includes(t));

  // 1. Anaphylaxis Critical Alert (WAO 2020 / NIAID Criteria)
  const isAnaphylaxisCriteria1 = hasSkinMucosa && (hasUpperCompromise || hasLowerAirway || hasCirculation || hasSevereGi);
  const isAnaphylaxisCriteria2 = (hasKnownTrigger && (hasUpperCompromise || hasLowerAirway || hasCirculation)) ||
    patient.allergyEpipenUsage === 'used_prehospital';
  const isAnaphylaxis = isAnaphylaxisCriteria1 || isAnaphylaxisCriteria2;

  if (isAnaphylaxis) {
    flags.push({
      key: 'allergy_rf_anaphylaxis_shock',
      textTh: 'ภาวะแพ้รุนแรงเฉียบพลันคุกคามชีวิต (Anaphylaxis / Impending Shock)',
      risk: 'เข้าเกณฑ์วินิจฉัย Anaphylaxis ตามแนวทาง WAO/NIAID ต้องได้รับยา Adrenaline 1:1,000 IM ทันที นอนราบยกขาสูง และเฝ้าระวัง Biphasic reaction',
      triageLevel: 1,
      severity: 'CRITICAL'
    });
  }

  // 2. Impending Upper Airway Obstruction
  if (hasUpperCompromise || angioedema.includes('tongue_palate')) {
    flags.push({
      key: 'allergy_rf_airway_obstruction',
      textTh: 'เสี่ยงต่อการอุดกั้นทางเดินหายใจส่วนบนเฉียบพลัน (Upper Airway / Laryngeal Edema)',
      risk: 'พบลิ้นบวมคับปาก แน่นคอ เสียงแหบ กลืนน้ำลายลำบาก หรือมีเสียง Stridor เสี่ยงทางเดินหายใจอุดกั้นฉับพลัน ต้องเตรียมอุปกรณ์เปิดทางเดินหายใจขั้นสูง',
      triageLevel: 1,
      severity: 'CRITICAL'
    });
  }

  // 3. Severe Cutaneous Adverse Reactions (SCARs: SJS / TEN / DRESS / Vasculitis)
  const hasScars = skinRash.includes('blisters_peeling') ||
    mucosaFever.includes('mucosal_oral_ulcer') ||
    mucosaFever.includes('mucosal_ocular') ||
    mucosaFever.includes('skin_pain_tenderness') ||
    (skinRash.includes('purpura_petechiae') && mucosaFever.includes('fever_chills'));

  if (hasScars) {
    flags.push({
      key: 'allergy_rf_blistering_mucocutaneous',
      textTh: 'สงสัยกลุ่มอาการผื่นแพ้ยารุนแรงทางผิวหนังและเยื่อบุ (Suspected SCARs / SJS / TEN / DRESS)',
      risk: 'มีตุ่มน้ำพอง ผิวลอก เจ็บแสบผิว แผลในปาก ตาแดง หรือจุดเลือดออกร่วมกับไข้ ต้องหยุดยาที่สงสัยทันทีและประเมินระดับความรุนแรงของเยื่อบุ',
      triageLevel: 2,
      severity: 'HIGH'
    });
  }

  // 4. ACE-Inhibitor Induced Angioedema
  const medAndUdText = [
    patient.currentMeds || '',
    ...(Array.isArray(patient.underlying) ? patient.underlying : [])
  ].join(' ');
  const takesAcei = specialMeds.includes('ace_inhibitors') ||
    /acei|enalapril|ramipril|captopril|lisinopril|perindopril/i.test(medAndUdText);

  if (takesAcei && (angioedema.includes('lips') || angioedema.includes('tongue_palate') || upperAirway.includes('throat_tightness'))) {
    flags.push({
      key: 'allergy_rf_acei_angioedema',
      textTh: 'สงสัยภาวะบวมจากยากลุ่ม ACE Inhibitors (Bradykinin-Mediated Angioedema)',
      risk: 'ผู้ป่วยรับประทานยากลุ่ม ACEi มีอาการปากบวม ลิ้นบวม หรือแน่นคอ มักไม่ตอบสนองต่อ Antihistamine/Steroid ต้องเฝ้าระวังทางเดินหายใจใกล้ชิดและสั่งหยุดยา',
      triageLevel: 2,
      severity: 'HIGH'
    });
  }

  // 5. Refractory Anaphylaxis / Severe Bronchospasm Risk
  const takesBetaBlockers = specialMeds.includes('beta_blockers') ||
    /atenolol|propranolol|metoprolol|carvedilol|bisoprolol|nebivolol/i.test(medAndUdText);
  const hasAsthma = pmhSpecific.includes('asthma');

  if ((isAnaphylaxis || hasLowerAirway || hasUpperCompromise) && (takesBetaBlockers || (hasAsthma && hasLowerAirway))) {
    flags.push({
      key: 'allergy_rf_beta_blocker_refractory',
      textTh: 'ความเสี่ยงสูงต่อภาวะดื้อยา Adrenaline หรือหลอดลมตีบรุนแรง (Beta-blocker / Asthma)',
      risk: 'ผู้ป่วยที่ใช้ยา Beta-blocker เสี่ยงไม่ตอบสนองต่อ Adrenaline (พิจารณาเตรียม IV Glucagon) หรือผู้ป่วยหอบหืดมีอาการทางหายใจเสี่ยงหลอดลมตีบรุนแรง',
      triageLevel: 2,
      severity: 'HIGH'
    });
  }

  return flags;
}

// --- Outputs Updater (Rapid Note, Narrative Note, JSON Schema: C-AP5/6/9/11/12/14) ---
function updateAllergyOutputs(patient) {
  if (!patient) return;

  const rfs = evaluateAllergyRedFlags(patient);
  const skinRash = Array.isArray(patient.allergySkinRash) ? patient.allergySkinRash : [];
  const mucosaFever = Array.isArray(patient.allergyMucosaFever) ? patient.allergyMucosaFever : [];
  const angioedema = Array.isArray(patient.allergyAngioedema) ? patient.allergyAngioedema : [];
  const upperAirway = Array.isArray(patient.allergyUpperAirway) ? patient.allergyUpperAirway : [];
  const lowerAirway = Array.isArray(patient.allergyLowerAirway) ? patient.allergyLowerAirway : [];
  const circulation = Array.isArray(patient.allergyCirculationShock) ? patient.allergyCirculationShock : [];
  const gi = Array.isArray(patient.allergyGiSymptoms) ? patient.allergyGiSymptoms : [];
  const triggers = Array.isArray(patient.allergySuspectedTriggers) ? patient.allergySuspectedTriggers : [];
  const specialMeds = Array.isArray(patient.allergySpecialMeds) ? patient.allergySpecialMeds : [];
  const pmhSpecific = Array.isArray(patient.allergyPmhSpecific) ? patient.allergyPmhSpecific : [];

  const durationStr = patient.durationVal
    ? `${patient.durationVal} ${ALLERGY_LABELS.durationUnit[patient.durationUnit] || patient.durationUnit || 'นาที'}`
    : 'ไม่ระบุระยะเวลา';

  const speedStr = ALLERGY_LABELS.onsetSpeed[patient.allergyOnsetSpeed] || 'ไม่ได้ระบุ';
  let onsetTimeStr = ALLERGY_LABELS.onsetTimeKnown[patient.allergyOnsetTimeKnown] || '';
  if (patient.allergyOnsetTimeKnown === 'known' && (patient.allergyOnsetExactDate || patient.allergyOnsetExactTime)) {
    onsetTimeStr = `เริ่มเมื่อ ${patient.allergyOnsetExactDate || '-'} เวลา ${patient.allergyOnsetExactTime || '-'} น.`;
  } else if (!patient.allergyOnsetTimeKnown && (patient.allergyOnsetExactDate || patient.allergyOnsetExactTime)) {
    onsetTimeStr = `เริ่มเมื่อ ${patient.allergyOnsetExactDate || '-'} เวลา ${patient.allergyOnsetExactTime || '-'} น.`;
  }

  const trigThs = triggers.map(t => {
    if (t === 'food') return patient.allergyTriggerFoodText ? `อาหาร (${patient.allergyTriggerFoodText})` : ALLERGY_LABELS.trigger.food;
    if (t === 'medication') return patient.allergyTriggerMedText ? `ยาแผนปัจจุบัน (${patient.allergyTriggerMedText})` : ALLERGY_LABELS.trigger.medication;
    if (t === 'herbal_supplement') return patient.allergyTriggerHerbText ? `สมุนไพร/ยาชุด (${patient.allergyTriggerHerbText})` : ALLERGY_LABELS.trigger.herbal_supplement;
    if (t === 'insect_sting') return patient.allergyTriggerInsectText ? `แมลงกัดต่อย (${patient.allergyTriggerInsectText})` : ALLERGY_LABELS.trigger.insect_sting;
    return ALLERGY_LABELS.trigger[t] || t;
  });
  const triggersStr = trigThs.length > 0 ? trigThs.join(', ') : 'ไม่ได้ระบุ';

  const priorStr = ALLERGY_LABELS.priorAnaphylaxis[patient.allergyPriorAnaphylaxis] || 'ไม่ได้ระบุ';
  let epipenStr = (patient.allergyEpipenUsage && patient.allergyEpipenUsage !== 'none_epipen') ? '' : (patient.allergyEpipenUsage === 'none_epipen' ? 'ไม่ได้ใช้ยาฉีดแก้แพ้พกพา' : 'ไม่ได้ระบุ');
  if (patient.allergyPriorAnaphylaxis === 'prior_severe_hosp') {
    if (patient.allergyEpipenUsage === 'used_prehospital') {
      const timeDetail = patient.allergyEpipenTimeUnknown
        ? 'จำเวลาที่ฉีดไม่ได้'
        : (patient.allergyEpipenTimeText ? `เวลา ${patient.allergyEpipenTimeText} น.` : 'ไม่ระบุเวลา');
      epipenStr = `ฉีดยาแก้แพ้พกพา (EpiPen) แล้วก่อนมา รพ. (${timeDetail})`;
    } else {
      epipenStr = ALLERGY_LABELS.epipenUsage[patient.allergyEpipenUsage] || 'ไม่ได้ระบุสถานะยาพกพา';
    }
  }
  const oralMedStr = ALLERGY_LABELS.prehospOralMed[patient.allergyPrehospOralMed] || 'ไม่ได้ระบุ';

  const specMedThs = specialMeds
    .filter(m => m !== 'none_special_meds')
    .map(m => ALLERGY_LABELS.specialMed[m] || m);
  const specPmhThs = pmhSpecific
    .filter(m => m !== 'none_pmh_specific')
    .map(m => ALLERGY_LABELS.pmh[m] || m);
  const specMedText = specMedThs.length > 0 ? specMedThs.join(', ') : (specialMeds.includes('none_special_meds') ? 'ปฏิเสธ' : 'ไม่ได้ระบุ');
  const specPmhText = specPmhThs.length > 0 ? specPmhThs.join(', ') : (pmhSpecific.includes('none_pmh_specific') ? 'ปฏิเสธ' : 'ไม่ได้ระบุ');

  // Pertinent Positives & Negatives (NO 🚩 symbols in patient-facing pertinent arrays: P-AP8 / Single-placement: C-AP5)
  const positives = [];
  const negatives = [];

  skinRash.forEach(s => {
    if (s === 'none_rash') negatives.push(ALLERGY_LABELS.skinRash.none_rash);
    else positives.push(ALLERGY_LABELS.skinRash[s] || s);
  });

  mucosaFever.forEach(m => {
    if (m === 'none_mucosa_fever') negatives.push(ALLERGY_LABELS.mucosaFever.none_mucosa_fever);
    else positives.push(ALLERGY_LABELS.mucosaFever[m] || m);
  });

  angioedema.forEach(a => {
    if (a === 'none_angioedema') negatives.push(ALLERGY_LABELS.angioedema.none_angioedema);
    else positives.push(ALLERGY_LABELS.angioedema[a] || a);
  });

  upperAirway.forEach(u => {
    if (u === 'none_upper_airway') negatives.push(ALLERGY_LABELS.upperAirway.none_upper_airway);
    else positives.push(ALLERGY_LABELS.upperAirway[u] || u);
  });

  lowerAirway.forEach(l => {
    if (l === 'none_lower_airway') negatives.push(ALLERGY_LABELS.lowerAirway.none_lower_airway);
    else positives.push(ALLERGY_LABELS.lowerAirway[l] || l);
  });

  circulation.forEach(c => {
    if (c === 'none_circulation') negatives.push(ALLERGY_LABELS.circulation.none_circulation);
    else positives.push(ALLERGY_LABELS.circulation[c] || c);
  });

  gi.forEach(g => {
    if (g === 'none_gi') negatives.push(ALLERGY_LABELS.gi.none_gi);
    else positives.push(ALLERGY_LABELS.gi[g] || g);
  });

  if (patient.otherSymptomsFree) {
    positives.push(patient.otherSymptomsFree);
  }

  patient.pertinentPositives = positives.length > 0 ? positives : ['ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม'];
  patient.pertinentNegatives = negatives.length > 0 ? negatives : ['ผู้ป่วยไม่ได้ระบุคำตอบยืนยันในหมวดอาการร่วม'];

  const hospLabel = ALLERGY_LABELS.hospStatus[patient.hospRecordStatus] || 'ไม่ได้ระบุ';
  const docNotes = patient.doctor_notes || {};
  const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ') ? 'ไม่ได้ระบุ' : patient.currentMeds;
  const udExplicitDeny = Array.isArray(patient.underlying) && patient.underlying.some(u => u && u.includes('ปฏิเสธ'));
  let udDisplay = (patient.hospRecordStatus === 'self' || patient.hospRecordStatus === 'additional' || udExplicitDeny) ? 'ปฏิเสธ' : 'ไม่ได้ระบุ';
  if (Array.isArray(patient.underlying) && patient.underlying.length > 0) {
    const filteredUd = patient.underlying.filter(u => u && !u.includes('ปฏิเสธ') && u !== 'ไม่มี' && u !== 'ไม่มีโรคประจำตัว');
    if (filteredUd.length > 0) udDisplay = filteredUd.join(', ');
  }
  const allergyDisplay = (!patient.drugAllergy || patient.drugAllergy === 'ไม่ได้ระบุ')
    ? 'ไม่ได้ระบุ'
    : ((patient.drugAllergy.includes('ปฏิเสธ') || patient.drugAllergy === 'ไม่มี') ? 'ปฏิเสธ' : patient.drugAllergy);

  const hpiTimelineLine = onsetTimeStr ? `${speedStr} (${onsetTimeStr})` : speedStr;
  const rapidEpipenLine = patient.allergyPriorAnaphylaxis === 'prior_severe_hosp' ? `\n• การใช้ยาฉีดพกพา (EpiPen): ${epipenStr}` : '';

  const defaultRapid =
`[Chief Complaint (CC)]
ผื่นแพ้เฉียบพลัน / แน่นคอ ตาบวม ปากบวม (Acute Allergic Reaction / Anaphylaxis) มา ${durationStr}

[History of Present Illness (HPI)]
• ลักษณะการเริ่มมีอาการ: ${hpiTimelineLine}
• สิ่งกระตุ้นที่สงสัย: ${triggersStr}
• ประวัติการแพ้เดิม: ${priorStr}${rapidEpipenLine}
• ยาแก้แพ้เบื้องต้นก่อนมา รพ.: ${oralMedStr}

• Pertinent Positives:
${patient.pertinentPositives.map(p => `  - ${p}`).join('\n')}

• Pertinent Negatives:
${patient.pertinentNegatives.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• ยาประจำตัวกลุ่มเสี่ยง (ACEi / Beta-blocker): ${specMedText}
• โรคประจำตัวกลุ่มเสี่ยงเฉพาะ: ${specPmhText}
• โรคประจำตัวทั่วไป (U/D): ${udDisplay}
• ยาประจำตัว (Current Meds): ${medsText}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${allergyDisplay}

[Emergency Risk Assessment (Red Flags)]
${rfs.length > 0
  ? `🚩 RED FLAGS DETECTED:\n${rfs.map(rf => `  * ${rf.textTh}`).join('\n')}`
  : '✓ ไม่พบสัญญาณเตือนวิกฤตเฉียบพลันเบื้องต้น'}

[Doctor's Clinical Addendum & Exam]
• ประวัติเพิ่มเติม/แก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}
• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}
• แผนการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

  const defaultNarrative =
`ผู้ป่วย [${patient.name || 'ไม่ระบุชื่อ'}] อายุ ${patient.age || '-'} ปี เพศ ${patient.gender || 'ไม่ระบุ'} มารับการตรวจที่ห้องฉุกเฉิน รพ.ราชบุรี ด้วยอาการผื่นแพ้เฉียบพลัน / แน่นคอ ตาบวม ปากบวม มา ${durationStr}
ประวัติปัจจุบัน: อาการเริ่มเกิดลักษณะ [${hpiTimelineLine}] สิ่งกระตุ้นที่สงสัย [${triggersStr}] ประวัติแพ้เดิม [${priorStr}]${patient.allergyPriorAnaphylaxis === 'prior_severe_hosp' ? ` การใช้ยาพกพา [${epipenStr}]` : ''} การดูแลเบื้องต้น [${oralMedStr}]
อาการสำคัญที่ตรวจพบ: ${patient.pertinentPositives.join(', ')}
อาการสำคัญที่ปฏิเสธ: ${patient.pertinentNegatives.join(', ')}
ประวัติสุขภาพและยา: [${hospLabel}], ยากลุ่มเสี่ยง: ${specMedText}, โรคกลุ่มเสี่ยง: ${specPmhText}, โรคประจำตัว (U/D): ${udDisplay}, ยาประจำตัว: ${medsText}, แพ้ยาเดิม: ${allergyDisplay}${rfs.length > 0 ? `\n[แจ้งเตือนความเสี่ยงสูง]: ${rfs.map(rf => rf.textTh).join('; ')}` : ''}

[บันทึกการตรวจและการประเมินโดยแพทย์]:
${docNotes.additional_hpi ? `• ประวัติเพิ่มเติม: ${docNotes.additional_hpi}\n` : ''}${docNotes.physical_exam ? `• การตรวจร่างกาย: ${docNotes.physical_exam}\n` : ''}${docNotes.preliminary_dx ? `• การวินิจฉัย: ${docNotes.preliminary_dx}\n` : ''}${docNotes.plan ? `• แผนการรักษา: ${docNotes.plan}` : ''}`;

  const jsonSchema = {
    '$schema': 'https://json-schema.org/draft/2020-12/schema',
    encounter: {
      hospital_site: 'Ratchaburi Hospital',
      queue_id: patient.queue_number || null,
      hn: patient.hn || null,
      patient_name: patient.name || null,
      age: patient.age !== undefined ? patient.age : null,
      gender: patient.gender || null,
      chief_complaint: 'allergy',
      chief_complaint_title_th: 'ผื่นแพ้เฉียบพลัน / แน่นคอ ตาบวม ปากบวม',
      calculated_triage_level: rfs.length > 0 ? Math.min(...rfs.map(r => r.triageLevel)) : 4,
      red_flags_count: rfs.length,
      entry_timestamp: patient.timestamp || new Date().toISOString()
    },
    clinical_assessment: {
      onset: {
        duration_value: patient.durationVal || null,
        duration_unit: patient.durationUnit || 'minutes',
        onset_speed: patient.allergyOnsetSpeed || null,
        onset_time_known: patient.allergyOnsetTimeKnown || null,
        exact_onset_date: patient.allergyOnsetExactDate || null,
        exact_onset_time: patient.allergyOnsetExactTime || null
      },
      suspected_triggers: triggers,
      trigger_details: {
        food: patient.allergyTriggerFoodText || '',
        medication: patient.allergyTriggerMedText || '',
        herbal_supplement: patient.allergyTriggerHerbText || '',
        insect_sting: patient.allergyTriggerInsectText || ''
      },
      skin_and_mucosa: {
        skin_rash: skinRash,
        mucosa_and_fever: mucosaFever,
        angioedema
      },
      systemic_anaphylaxis: {
        upper_airway: upperAirway,
        lower_airway: lowerAirway,
        circulation,
        gastrointestinal: gi
      },
      history_and_meds: {
        prior_anaphylaxis: patient.allergyPriorAnaphylaxis || null,
        epipen_usage: patient.allergyEpipenUsage || null,
        epipen_time: patient.allergyEpipenTimeUnknown ? 'unknown' : (patient.allergyEpipenTimeText || null),
        prehospital_oral_med: patient.allergyPrehospOralMed || null,
        special_meds: specialMeds,
        pmh_specific: pmhSpecific
      },
      red_flags: rfs.map(rf => ({ id: rf.key, severity: rf.severity, title: rf.textTh, triage_level: rf.triageLevel }))
    }
  };

  patient.rapidHpi = patient.custom_rapid_note || defaultRapid;
  patient.narrativeHpi = patient.custom_narrative_note || defaultNarrative;
  patient.medicalJson = jsonSchema;

  const hasDoc = typeof document !== 'undefined';
  const rapidBox = hasDoc ? document.getElementById('rapidTextView') : null;
  if (rapidBox) rapidBox.value = patient.rapidHpi;

  const narrativeBox = hasDoc ? document.getElementById('narrativeTextView') : null;
  if (narrativeBox) narrativeBox.value = patient.narrativeHpi;

  const jsonBox = hasDoc ? document.getElementById('jsonViewer') : null;
  if (jsonBox) jsonBox.textContent = JSON.stringify(jsonSchema, null, 2);

  return { rapid: patient.rapidHpi, narrative: patient.narrativeHpi, json: jsonSchema };
}

// --- Golden UI Helpers & Word-Wrap Guard (P-AP10 / P-AP12 / C-AP1 / C-AP18) ---
function wrapAllergyWords(chunks) {
  if (!Array.isArray(chunks)) return chunks;
  return chunks.map(c => `<span class="inline-block whitespace-nowrap">${c}</span>`).join(' ');
}

function renderAllergyCard(opt) {
  const kind = opt.kind || 'radio';
  const idAttr = opt.id ? `id="${opt.id}"` : '';
  const nameAttr = opt.name ? `name="${opt.name}"` : '';
  const valAttr = opt.value !== undefined ? `value="${opt.value}"` : '';
  const onchangeAttr = opt.onchange ? `onchange="${opt.onchange}"` : '';
  const titleHtml = Array.isArray(opt.title) ? wrapAllergyWords(opt.title) : opt.title;

  if (opt.desc) {
    return `<label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
      <input type="${kind}" ${idAttr} ${nameAttr} ${valAttr} ${onchangeAttr} class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
      <div class="ml-3 leading-snug">
        <span class="block text-xs sm:text-sm font-semibold text-slate-800">${titleHtml}</span>
        <span class="block text-[11px] text-slate-500 font-normal mt-0.5">${opt.desc}</span>
      </div>
    </label>`;
  }

  return `<label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
    <input type="${kind}" ${idAttr} ${nameAttr} ${valAttr} ${onchangeAttr} class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
    <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800 leading-snug">${titleHtml}</span>
  </label>`;
}

function renderAllergyGrid(colsClass, options) {
  return `<div class="grid ${colsClass} gap-2.5">${options.map(renderAllergyCard).join('')}</div>`;
}

function renderAllergySysHeader({ label, icon, colorClass, toggleName, toggleVal, toggleLabel, toggleOnchange }) {
  return `<div class="flex flex-wrap items-center justify-between gap-2 mb-2.5">
    <label class="flex items-center text-xs sm:text-sm font-bold text-slate-800">
      <span class="${colorClass} p-1.5 rounded-lg mr-2 inline-flex items-center justify-center"><i data-lucide="${icon}" class="w-4 h-4"></i></span>
      <span>${label}</span>
    </label>
    <label class="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-medium text-slate-700 cursor-pointer transition select-none flex-shrink-0">
      <input type="checkbox" name="${toggleName}" value="${toggleVal}" onchange="${toggleOnchange}" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded">
      <span class="ml-1.5 whitespace-nowrap">${toggleLabel}</span>
    </label>
  </div>`;
}

// --- 4-Card Form HTML Assembly ---
const ALLERGY_CARD1_HTML = `
<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
  <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
    <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="clock" class="w-5 h-5"></i></div>
    <h2 class="text-base font-bold text-slate-900">1. ระยะเวลา ความเร็วในการเกิดอาการ และสิ่งกระตุ้นที่สงสัย</h2>
  </div>
  <div class="space-y-5">
    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">1.1 ระยะเวลาตั้งแต่เริ่มมีอาการผื่น คัน หรือบวมในครั้งนี้ <span class="text-rose-500">*</span></label>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div class="col-span-1 sm:col-span-2">
          <input type="number" id="allergyDurationVal" min="1" max="1000" placeholder="เช่น 30" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm placeholder:text-slate-400 placeholder:font-normal">
        </div>
        <div class="col-span-1">
          <select id="allergyDurationUnit" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm">
            <option value="minutes" selected>นาที</option>
            <option value="hours">ชั่วโมง</option>
            <option value="days">วัน</option>
            <option value="weeks">สัปดาห์</option>
            <option value="months">เดือน</option>
            <option value="years">ปี</option>
          </select>
        </div>
      </div>
    </div>

    <div class="pt-3 border-t border-slate-100 space-y-4">
      <div>
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">1.2 ความรวดเร็วในการเกิดอาการ และเวลาที่เริ่มสังเกตเห็น</label>
        ${renderAllergyGrid('grid-cols-1 sm:grid-cols-3', [
          { name: 'allergyOnsetSpeed', value: 'rapid_within_minutes', title: ['เร็วมากภายใน', 'ไม่กี่นาที–2 ชม.'] },
          { name: 'allergyOnsetSpeed', value: 'gradual_throughout_day', title: ['ค่อยๆ เป็นมากขึ้น', 'ใน 2–24 ชม.'] },
          { name: 'allergyOnsetSpeed', value: 'chronic_gt_6weeks', title: ['เป็นผื่นต่อเนื่อง /', 'เป็นๆ หายๆ เกิน 1 วัน'] }
        ])}
      </div>
      <div>
        <label class="block text-xs font-medium text-slate-700 mb-2">เวลาที่เริ่มสังเกตเห็นอาการครั้งแรก:</label>
        ${renderAllergyGrid('grid-cols-1 sm:grid-cols-2', [
          { name: 'allergyOnsetTimeKnown', value: 'known', onchange: "handleAllergyOnsetTimeKnownChange('known')", title: ['ระบุวันที่และเวลา', 'ที่เริ่มอาการได้'] },
          { name: 'allergyOnsetTimeKnown', value: 'unknown', onchange: "handleAllergyOnsetTimeKnownChange('unknown')", title: ['ไม่ทราบเวลาที่แน่นอน /', 'จำไม่ได้'] }
        ])}
        <div id="allergyExactTimeWrap" class="hidden bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">วันที่เริ่มมีอาการ</label>
            <input type="text" id="allergyOnsetExactDate" data-universal-date="true" placeholder="วว/ดด/ปปปป (dd/mm/yyyy)" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">เวลาที่เริ่มมีอาการ (24 ชม.)</label>
            <input type="text" id="allergyOnsetExactTime" data-universal-time="true" placeholder="ชช:นน (เช่น 14:30)" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
          </div>
        </div>
      </div>
    </div>

    <div class="pt-3 border-t border-slate-100">
      ${renderAllergySysHeader({
        label: '1.3 สิ่งกระตุ้นที่สงสัยก่อนเริ่มมีอาการ (เลือกได้หลายข้อ)',
        icon: 'zap',
        colorClass: 'bg-amber-100 text-amber-700',
        toggleName: 'allergySuspectedTriggers',
        toggleVal: 'unknown_trigger',
        toggleLabel: 'ไม่ทราบสิ่งกระตุ้นแน่ชัด',
        toggleOnchange: 'handleAllergyTriggerChange(this)'
      })}
      ${renderAllergyGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', [
        { kind: 'checkbox', name: 'allergySuspectedTriggers', value: 'food', onchange: 'handleAllergyTriggerChange(this)', title: ['รับประทานอาหาร'], desc: 'เช่น กุ้ง ปู หอย ถั่ว ไข่ นม แป้งสาลี' },
        { kind: 'checkbox', name: 'allergySuspectedTriggers', value: 'medication', onchange: 'handleAllergyTriggerChange(this)', title: ['รับประทานหรือฉีด', 'ยาแผนปัจจุบัน'], desc: 'เช่น ยาฆ่าเชื้อ ยาแก้ปวด ยากันชัก' },
        { kind: 'checkbox', name: 'allergySuspectedTriggers', value: 'herbal_supplement', onchange: 'handleAllergyTriggerChange(this)', title: ['สมุนไพร / ยาชุด /', 'อาหารเสริม'], desc: 'เช่น ยาชุดแก้ปวด ยาหม้อ ยาลูกกลอน' },
        { kind: 'checkbox', name: 'allergySuspectedTriggers', value: 'insect_sting', onchange: 'handleAllergyTriggerChange(this)', title: ['ถูกแมลงกัดหรือต่อย'], desc: 'เช่น ผึ้ง ต่อ แตน มดตะนอย' },
        { kind: 'checkbox', name: 'allergySuspectedTriggers', value: 'radiocontrast_anesthesia', onchange: 'handleAllergyTriggerChange(this)', title: ['ฉีดสีเอกซเรย์ /', 'ยาชา / ดมยาสลบ'] },
        { kind: 'checkbox', name: 'allergySuspectedTriggers', value: 'contact_latex_chemical', onchange: 'handleAllergyTriggerChange(this)', title: ['สารเคมี / ถุงมือยาง /', 'เครื่องสำอาง'] }
      ])}
      <div class="space-y-2.5 mt-3">
        <div id="allergyTriggerFoodWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4">
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">ชื่ออาหารที่รับประทาน</label>
          <input type="text" id="allergyTriggerFoodText" placeholder="เช่น ต้มยำกุ้ง, ส้มตำปูม้า, ถั่วลิสง" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
        </div>
        <div id="allergyTriggerMedWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4">
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">ชื่อยาหรือชนิดยาที่สงสัย</label>
          <input type="text" id="allergyTriggerMedText" placeholder="เช่น ยาฆ่าเชื้อ Amoxicillin, ยาแก้ปวด Ibuprofen" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
        </div>
        <div id="allergyTriggerHerbWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4">
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">ชื่อสมุนไพร ยาชุด หรืออาหารเสริมที่ทาน</label>
          <input type="text" id="allergyTriggerHerbText" placeholder="เช่น ยาชุดแก้ปวดซองสีชมพู, ยาต้มสมุนไพร" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
        </div>
        <div id="allergyTriggerInsectWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4">
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">ชนิดแมลงและตำแหน่งที่ถูกกัดต่อย</label>
          <input type="text" id="allergyTriggerInsectText" placeholder="เช่น แตนต่อยที่แขนขวา 2 จุด" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
        </div>
      </div>
    </div>
  </div>
</div>`;

const ALLERGY_CARD2_HTML = `
<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
  <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
    <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="activity" class="w-5 h-5"></i></div>
    <h2 class="text-base font-bold text-slate-900">2. ลักษณะผื่นผิวหนัง และอาการบวมตามใบหน้าหรือร่างกาย</h2>
  </div>
  <div class="space-y-5">
    <div>
      ${renderAllergySysHeader({
        label: '2.1 ลักษณะผื่นหรือความผิดปกติทางผิวหนัง (เลือกได้หลายข้อ)',
        icon: 'sparkles',
        colorClass: 'bg-rose-100 text-rose-700',
        toggleName: 'allergySkinRash',
        toggleVal: 'none_rash',
        toggleLabel: 'ไม่มีผื่นขึ้นตามผิวหนัง',
        toggleOnchange: 'handleAllergySkinRashChange(this)'
      })}
      ${renderAllergyGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', [
        { kind: 'checkbox', name: 'allergySkinRash', value: 'urticaria', onchange: 'handleAllergySkinRashChange(this)', title: ['ผื่นลมพิษนูนแดง', 'คันมาก'], desc: 'ขอบชัด คล้ายรอยยุงกัด ยุบย้ายที่ได้' },
        { kind: 'checkbox', name: 'allergySkinRash', value: 'flushing', onchange: 'handleAllergySkinRashChange(this)', title: ['ผิวหนังแดงก่ำ', 'ร้อนวูบวาบ'] },
        { kind: 'checkbox', name: 'allergySkinRash', value: 'erythema_maculopapular', onchange: 'handleAllergySkinRashChange(this)', title: ['ผื่นแดงราบ /', 'ตุ่มแดงเล็กๆ'] },
        { kind: 'checkbox', name: 'allergySkinRash', value: 'blisters_peeling', onchange: 'handleAllergySkinRashChange(this)', title: ['ตุ่มน้ำพอง /', 'ผิวหนังลอก'] },
        { kind: 'checkbox', name: 'allergySkinRash', value: 'purpura_petechiae', onchange: 'handleAllergySkinRashChange(this)', title: ['จุดเลือดออก /', 'จ้ำม่วงใต้ผิวหนัง'], desc: 'กดทับแล้วสีไม่จางหาย' }
      ])}

      <div id="allergyMucosaFeverWrap" class="hidden bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-3">
        ${renderAllergySysHeader({
          label: 'อาการทางเยื่อบุและอาการร่วมที่พบพร้อมผื่น (เลือกได้หลายข้อ)',
          icon: 'alert-circle',
          colorClass: 'bg-orange-100 text-orange-700',
          toggleName: 'allergyMucosaFever',
          toggleVal: 'none_mucosa_fever',
          toggleLabel: 'ไม่มีอาการเจ็บเยื่อบุหรือไข้',
          toggleOnchange: "handleAllergyExclusiveGroup('allergyMucosaFever','none_mucosa_fever',this)"
        })}
        ${renderAllergyGrid('grid-cols-1 sm:grid-cols-2', [
          { kind: 'checkbox', name: 'allergyMucosaFever', value: 'mucosal_oral_ulcer', onchange: "handleAllergyExclusiveGroup('allergyMucosaFever','none_mucosa_fever',this)", title: ['มีแผลเจ็บในปาก /', 'ริมฝีปากลอกแตก'] },
          { kind: 'checkbox', name: 'allergyMucosaFever', value: 'mucosal_ocular', onchange: "handleAllergyExclusiveGroup('allergyMucosaFever','none_mucosa_fever',this)", title: ['ตาแดง / แสบตา /', 'มีขี้ตามากผิดปกติ'] },
          { kind: 'checkbox', name: 'allergyMucosaFever', value: 'skin_pain_tenderness', onchange: "handleAllergyExclusiveGroup('allergyMucosaFever','none_mucosa_fever',this)", title: ['ปวดแสบปวดร้อน', 'ผิวหนังบริเวณผื่น'] },
          { kind: 'checkbox', name: 'allergyMucosaFever', value: 'fever_chills', onchange: "handleAllergyExclusiveGroup('allergyMucosaFever','none_mucosa_fever',this)", title: ['มีไข้ / ตัวร้อน /', 'หนาวสั่นร่วมด้วย'] }
        ])}
      </div>
    </div>

    <div class="pt-3 border-t border-slate-100">
      ${renderAllergySysHeader({
        label: '2.2 บริเวณที่มีอาการบวมของใบหน้าหรือร่างกาย (เลือกได้หลายข้อ)',
        icon: 'eye',
        colorClass: 'bg-purple-100 text-purple-700',
        toggleName: 'allergyAngioedema',
        toggleVal: 'none_angioedema',
        toggleLabel: 'ไม่มีอาการบวมในหมวดนี้',
        toggleOnchange: "handleAllergyExclusiveGroup('allergyAngioedema','none_angioedema',this)"
      })}
      ${renderAllergyGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', [
        { kind: 'checkbox', name: 'allergyAngioedema', value: 'lips', onchange: "handleAllergyExclusiveGroup('allergyAngioedema','none_angioedema',this)", title: ['ริมฝีปากบวมเจ่อ'] },
        { kind: 'checkbox', name: 'allergyAngioedema', value: 'tongue_palate', onchange: "handleAllergyExclusiveGroup('allergyAngioedema','none_angioedema',this)", title: ['ลิ้นบวมคับปาก /', 'เพดานปากบวม'] },
        { kind: 'checkbox', name: 'allergyAngioedema', value: 'periorbital_face', onchange: "handleAllergyExclusiveGroup('allergyAngioedema','none_angioedema',this)", title: ['เปลือกตาบวม /', 'ใบหน้าบวมตึง'] },
        { kind: 'checkbox', name: 'allergyAngioedema', value: 'ears_neck', onchange: "handleAllergyExclusiveGroup('allergyAngioedema','none_angioedema',this)", title: ['ใบหูบวม /', 'ลำคอภายนอกบวม'] },
        { kind: 'checkbox', name: 'allergyAngioedema', value: 'extremities_genitalia', onchange: "handleAllergyExclusiveGroup('allergyAngioedema','none_angioedema',this)", title: ['มือบวม เท้าบวม /', 'อวัยวะเพศบวม'] }
      ])}
    </div>
  </div>
</div>`;

const ALLERGY_CARD3_HTML = `
<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
  <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
    <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="shield-alert" class="w-5 h-5"></i></div>
    <h2 class="text-base font-bold text-slate-900">3. อาการทางลำคอ การหายใจ ระบบไหลเวียนโลหิต และทางเดินอาหาร</h2>
  </div>
  <div class="space-y-5">
    <div>
      ${renderAllergySysHeader({
        label: '3.1 อาการทางลำคอและทางเดินหายใจส่วนบน (เลือกได้หลายข้อ)',
        icon: 'mic',
        colorClass: 'bg-amber-100 text-amber-700',
        toggleName: 'allergyUpperAirway',
        toggleVal: 'none_upper_airway',
        toggleLabel: 'ไม่มีอาการในหมวดนี้',
        toggleOnchange: "handleAllergyExclusiveGroup('allergyUpperAirway','none_upper_airway',this)"
      })}
      ${renderAllergyGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', [
        { kind: 'checkbox', name: 'allergyUpperAirway', value: 'throat_tightness', onchange: "handleAllergyExclusiveGroup('allergyUpperAirway','none_upper_airway',this)", title: ['แน่นในลำคอ /', 'จุกคอหอย'] },
        { kind: 'checkbox', name: 'allergyUpperAirway', value: 'dysphagia_drooling', onchange: "handleAllergyExclusiveGroup('allergyUpperAirway','none_upper_airway',this)", title: ['กลืนลำบาก /', 'น้ำลายไหลย้อย'] },
        { kind: 'checkbox', name: 'allergyUpperAirway', value: 'voice_hoarseness', onchange: "handleAllergyExclusiveGroup('allergyUpperAirway','none_upper_airway',this)", title: ['เสียงแหบ /', 'พูดเสียงเปลี่ยน'] },
        { kind: 'checkbox', name: 'allergyUpperAirway', value: 'stridor', onchange: "handleAllergyExclusiveGroup('allergyUpperAirway','none_upper_airway',this)", title: ['หายใจมีเสียงฮืดแหลม', 'ในลำคอ'] },
        { kind: 'checkbox', name: 'allergyUpperAirway', value: 'nasal_congestion', onchange: "handleAllergyExclusiveGroup('allergyUpperAirway','none_upper_airway',this)", title: ['คัดแน่นจมูก /', 'น้ำมูกไหล / จามรัว'] }
      ])}
    </div>

    <div class="pt-3 border-t border-slate-100">
      ${renderAllergySysHeader({
        label: '3.2 อาการทางปอดและการหายใจ (เลือกได้หลายข้อ)',
        icon: 'wind',
        colorClass: 'bg-sky-100 text-sky-700',
        toggleName: 'allergyLowerAirway',
        toggleVal: 'none_lower_airway',
        toggleLabel: 'ไม่มีอาการในหมวดนี้',
        toggleOnchange: "handleAllergyExclusiveGroup('allergyLowerAirway','none_lower_airway',this)"
      })}
      ${renderAllergyGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-4', [
        { kind: 'checkbox', name: 'allergyLowerAirway', value: 'dyspnea', onchange: "handleAllergyExclusiveGroup('allergyLowerAirway','none_lower_airway',this)", title: ['หายใจหอบเหนื่อย /', 'หายใจไม่อิ่ม'] },
        { kind: 'checkbox', name: 'allergyLowerAirway', value: 'wheezing', onchange: "handleAllergyExclusiveGroup('allergyLowerAirway','none_lower_airway',this)", title: ['หายใจมีเสียงหวีด', 'ในหน้าอก'] },
        { kind: 'checkbox', name: 'allergyLowerAirway', value: 'chest_tightness', onchange: "handleAllergyExclusiveGroup('allergyLowerAirway','none_lower_airway',this)", title: ['แน่นอึดอัดหน้าอก /', 'ไอแห้งๆ รัวๆ'] },
        { kind: 'checkbox', name: 'allergyLowerAirway', value: 'cyanosis', onchange: "handleAllergyExclusiveGroup('allergyLowerAirway','none_lower_airway',this)", title: ['ริมฝีปากเขียว /', 'ปลายมือเขียวคล้ำ'] }
      ])}
    </div>

    <div class="pt-3 border-t border-slate-100">
      ${renderAllergySysHeader({
        label: '3.3 อาการหน้ามืด วูบ และระบบไหลเวียนโลหิต (เลือกได้หลายข้อ)',
        icon: 'heart-pulse',
        colorClass: 'bg-rose-100 text-rose-700',
        toggleName: 'allergyCirculationShock',
        toggleVal: 'none_circulation',
        toggleLabel: 'ไม่มีอาการในหมวดนี้',
        toggleOnchange: "handleAllergyExclusiveGroup('allergyCirculationShock','none_circulation',this)"
      })}
      ${renderAllergyGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-4', [
        { kind: 'checkbox', name: 'allergyCirculationShock', value: 'presyncope_dizziness', onchange: "handleAllergyExclusiveGroup('allergyCirculationShock','none_circulation',this)", title: ['หน้ามืด / วิงเวียน /', 'ตาพร่ามัว'] },
        { kind: 'checkbox', name: 'allergyCirculationShock', value: 'syncope', onchange: "handleAllergyExclusiveGroup('allergyCirculationShock','none_circulation',this)", title: ['วูบ เป็นลม /', 'หมดสติ'] },
        { kind: 'checkbox', name: 'allergyCirculationShock', value: 'cold_diaphoresis', onchange: "handleAllergyExclusiveGroup('allergyCirculationShock','none_circulation',this)", title: ['เหงื่อแตกตัวเย็น /', 'หน้าซีด / ใจสั่น'] },
        { kind: 'checkbox', name: 'allergyCirculationShock', value: 'altered_mental', onchange: "handleAllergyExclusiveGroup('allergyCirculationShock','none_circulation',this)", title: ['สับสน / กระสับกระส่าย /', 'ซึมลง'] }
      ])}
    </div>

    <div class="pt-3 border-t border-slate-100">
      ${renderAllergySysHeader({
        label: '3.4 อาการระบบทางเดินอาหารที่เกิดร่วมด้วย (เลือกได้หลายข้อ)',
        icon: 'utensils',
        colorClass: 'bg-emerald-100 text-emerald-700',
        toggleName: 'allergyGiSymptoms',
        toggleVal: 'none_gi',
        toggleLabel: 'ไม่มีอาการในหมวดนี้',
        toggleOnchange: "handleAllergyExclusiveGroup('allergyGiSymptoms','none_gi',this)"
      })}
      ${renderAllergyGrid('grid-cols-1 sm:grid-cols-3', [
        { kind: 'checkbox', name: 'allergyGiSymptoms', value: 'severe_abd_cramps', onchange: "handleAllergyExclusiveGroup('allergyGiSymptoms','none_gi',this)", title: ['ปวดบิดเกร็งท้อง', 'รุนแรง'] },
        { kind: 'checkbox', name: 'allergyGiSymptoms', value: 'repetitive_vomiting', onchange: "handleAllergyExclusiveGroup('allergyGiSymptoms','none_gi',this)", title: ['คลื่นไส้ /', 'อาเจียนหลายครั้ง'] },
        { kind: 'checkbox', name: 'allergyGiSymptoms', value: 'watery_diarrhea', onchange: "handleAllergyExclusiveGroup('allergyGiSymptoms','none_gi',this)", title: ['ถ่ายเหลวเป็นน้ำ', 'เฉียบพลัน'] }
      ])}
    </div>
  </div>
</div>`;

const ALLERGY_CARD4_HTML = `
<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
  <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
    <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="file-text" class="w-5 h-5"></i></div>
    <h2 class="text-base font-bold text-slate-900">4. ประวัติการแพ้ในอดีต การดูแลเบื้องต้น และยาประจำตัวกลุ่มเสี่ยง</h2>
  </div>
  <div class="space-y-5">
    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">4.1 ประวัติการแพ้ในอดีต และการพกยาฉีดแก้แพ้ฉุกเฉิน</label>
      ${renderAllergyGrid('grid-cols-1 sm:grid-cols-3', [
        { name: 'allergyPriorAnaphylaxis', value: 'prior_severe_hosp', onchange: "handleAllergyPriorAnaphylaxisChange('prior_severe_hosp')", title: ['เคยแพ้รุนแรง'], desc: 'ต้องฉีดยาที่ต้นขาหรือนอนโรงพยาบาล' },
        { name: 'allergyPriorAnaphylaxis', value: 'prior_mild_urticaria', onchange: "handleAllergyPriorAnaphylaxisChange('prior_mild_urticaria')", title: ['เคยมีเฉพาะผื่นคัน', 'ธรรมดา'], desc: 'ทานยา หรือฉีดยาเข้าเส้นเลือดเท่านั้น ไม่ได้นอน รพ.' },
        { name: 'allergyPriorAnaphylaxis', value: 'first_time_never', onchange: "handleAllergyPriorAnaphylaxisChange('first_time_never')", title: ['ไม่เคยแพ้มาก่อน', 'ครั้งนี้เป็นครั้งแรก'] }
      ])}
      <div id="allergyEpipenWrap" class="hidden bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-3 space-y-3">
        <span class="block text-xs font-semibold text-slate-800">การใช้ยาฉีดแก้แพ้พกพาประจำตัวในครั้งนี้:</span>
        ${renderAllergyGrid('grid-cols-1 sm:grid-cols-3', [
          { name: 'allergyEpipenUsage', value: 'used_prehospital', onchange: "handleAllergyEpipenUsageChange('used_prehospital')", title: ['ฉีดยาแก้แพ้พกพาแล้ว', 'ก่อนมา รพ.'] },
          { name: 'allergyEpipenUsage', value: 'has_not_used', onchange: "handleAllergyEpipenUsageChange('has_not_used')", title: ['มียาฉีดแก้แพ้พกพา', 'แต่ยังไม่ได้ฉีด'] },
          { name: 'allergyEpipenUsage', value: 'none_epipen', onchange: "handleAllergyEpipenUsageChange('none_epipen')", title: ['ไม่มียาฉีดแก้แพ้', 'พกพาประจำตัว'] }
        ])}
        <div id="allergyEpipenTimeWrap" class="hidden bg-white border border-slate-200 rounded-xl p-3 space-y-2">
          <label class="block text-xs font-semibold text-slate-700">เวลาที่ฉีดยาแก้แพ้พกพา (24 ชม.)</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-center">
            <input type="text" id="allergyEpipenTimeText" data-universal-time="true" oninput="handleAllergyEpipenTimeInput()" placeholder="ชช:นน (เช่น 11:30)" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
            ${renderAllergyCard({ kind: 'checkbox', id: 'allergyEpipenTimeUnknown', value: 'unknown', onchange: 'handleAllergyEpipenTimeUnknownToggle(this)', title: ['จำเวลาที่ฉีดไม่ได้'] })}
          </div>
        </div>
      </div>
    </div>

    <div class="pt-3 border-t border-slate-100">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">4.2 การรับประทานยาแก้แพ้เบื้องต้นในครั้งนี้ก่อนมาโรงพยาบาล</label>
      ${renderAllergyGrid('grid-cols-1 sm:grid-cols-2', [
        { name: 'allergyPrehospOralMed', value: 'none_oral_med', title: ['ยังไม่ได้รับประทาน', 'ยาแก้แพ้ใดๆ'] },
        { name: 'allergyPrehospOralMed', value: 'antihistamine_no_improve', title: ['รับประทานยาแก้แพ้มาแล้ว', 'แต่อาการยังไม่ดีขึ้น'] }
      ])}
    </div>

    <div class="pt-3 border-t border-slate-100 space-y-4">
      <div>
        ${renderAllergySysHeader({
          label: '4.3 ยาประจำตัวกลุ่มเสี่ยงที่รับประทานอยู่ (เลือกได้หลายข้อ)',
          icon: 'pill',
          colorClass: 'bg-amber-100 text-amber-700',
          toggleName: 'allergySpecialMeds',
          toggleVal: 'none_special_meds',
          toggleLabel: 'ไม่ได้ทานยากลุ่มเสี่ยง',
          toggleOnchange: "handleAllergyExclusiveGroup('allergySpecialMeds','none_special_meds',this)"
        })}
        ${renderAllergyGrid('grid-cols-1 sm:grid-cols-3', [
          { kind: 'checkbox', name: 'allergySpecialMeds', value: 'ace_inhibitors', onchange: "handleAllergyExclusiveGroup('allergySpecialMeds','none_special_meds',this)", title: ['ยาลดความดันโลหิต', 'กลุ่มลงท้ายด้วย -pril'], desc: 'เช่น Enalapril, Ramipril, Captopril, Lisinopril' },
          { kind: 'checkbox', name: 'allergySpecialMeds', value: 'beta_blockers', onchange: "handleAllergyExclusiveGroup('allergySpecialMeds','none_special_meds',this)", title: ['ยาลดความดัน / ชีพจร', 'กลุ่มลงท้ายด้วย -lol'], desc: 'เช่น Propranolol, Atenolol, Metoprolol, Bisoprolol' },
          { kind: 'checkbox', name: 'allergySpecialMeds', value: 'unknown_special_meds', onchange: "handleAllergyExclusiveGroup('allergySpecialMeds','none_special_meds',this)", title: ['ไม่แน่ใจชื่อยาประจำตัว'] }
        ])}
      </div>

      <div>
        ${renderAllergySysHeader({
          label: 'โรคประจำตัวที่สำคัญ (เลือกได้หลายข้อ)',
          icon: 'heart',
          colorClass: 'bg-indigo-100 text-indigo-700',
          toggleName: 'allergyPmhSpecific',
          toggleVal: 'none_pmh_specific',
          toggleLabel: 'ไม่มีโรคประจำตัวข้างต้น',
          toggleOnchange: "handleAllergyExclusiveGroup('allergyPmhSpecific','none_pmh_specific',this)"
        })}
        ${renderAllergyGrid('grid-cols-1 sm:grid-cols-3', [
          { kind: 'checkbox', name: 'allergyPmhSpecific', value: 'asthma', onchange: "handleAllergyExclusiveGroup('allergyPmhSpecific','none_pmh_specific',this)", title: ['โรคหอบหืด /', 'โรคปอดเรื้อรัง'] },
          { kind: 'checkbox', name: 'allergyPmhSpecific', value: 'cad_cvd', onchange: "handleAllergyExclusiveGroup('allergyPmhSpecific','none_pmh_specific',this)", title: ['โรคหัวใจ /', 'โรคหลอดเลือดหัวใจ'] },
          { kind: 'checkbox', name: 'allergyPmhSpecific', value: 'atopic_dermatitis', onchange: "handleAllergyExclusiveGroup('allergyPmhSpecific','none_pmh_specific',this)", title: ['โรคผื่นภูมิแพ้ผิวหนัง'] }
        ])}
      </div>
    </div>
  </div>
</div>`;

const ALLERGY_FORM_HTML = `
<div id="allergyQuestionnaireSection" class="space-y-6 hidden">
  <div data-cc-top-banner="allergy"><div class="flex flex-col gap-4">
  <div class="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-start space-x-3 text-xs text-slate-800 leading-relaxed">
    <i data-lucide="info" class="w-5 h-5 text-medical-600 mt-0.5 flex-shrink-0"></i>
    <div class="space-y-1">
      <p class="font-bold text-slate-900">ข้อแนะนำการปฏิบัติตัวเบื้องต้นระหว่างรอตรวจ:</p>
      <p>1. <strong>หากรู้สึกหน้ามืด วิงเวียน หรือเหนื่อยหอบ:</strong> ห้ามลุกขึ้นยืนหรือเดินไปมาตามลำพัง แจ้งพยาบาลเพื่อขอเตียงนอนราบ (แต่หากนอนราบแล้วเหนื่อยมากขึ้น ให้นั่งเอนหลังพิงพนักในท่าที่หายใจสะดวกที่สุดได้)</p>
      <p>2. <strong>หากนำซองยาหรือตัวอย่างอาหารมาด้วย:</strong> กรุณาเตรียมไว้ให้แพทย์ดู แนะนำงดดื่มน้ำหรือรับประทานอาหารเพิ่มเติมระหว่างรอตรวจ</p>
      <p>3. <strong>แจ้งพยาบาลหน้าห้องตรวจทันทีหากมีอาการต่อไปนี้:</strong> รู้สึกแน่นในลำคอ กลืนน้ำลายลำบาก เสียงแหบ ลิ้นหรือริมฝีปากบวมโต หายใจมีเสียงหวีด หรือหน้ามืดคล้ายจะเป็นลม</p>
    </div>
  </div>
  </div></div>

  ${ALLERGY_CARD1_HTML}
  ${ALLERGY_CARD2_HTML}
  ${ALLERGY_CARD3_HTML}
  ${ALLERGY_CARD4_HTML}

  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-3 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="message-square-plus" class="w-5 h-5"></i></div>
      <h2 class="text-base font-bold text-slate-900">อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2>
    </div>
    <textarea id="allergy_other_free" rows="2" placeholder="ระบุอาการอื่นๆ ชื่อร้านอาหาร หรือข้อมูลยาที่นำติดตัวมาเพิ่มเติม..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white placeholder:text-slate-400"></textarea>
  </div>
</div>`;

function makeAllergySeed(overrides) {
  return Object.assign({
    chief_complaint: 'allergy',
    chief_complaint_title: 'ผื่นแพ้เฉียบพลัน / แน่นคอ ตาบวม ปากบวม',
    status: 'waiting',
    hospRecordStatus: 'self',
    underlying: ['ปฏิเสธ'],
    drugAllergy: 'ปฏิเสธ',
    currentMeds: 'ไม่มี',
    otherSymptomsFree: '',
    doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
    allergyTriggerFoodText: '',
    allergyTriggerMedText: '',
    allergyTriggerHerbText: '',
    allergyTriggerInsectText: '',
    allergyMucosaFever: [],
    allergyEpipenUsage: '',
    allergyEpipenTimeUnknown: false,
    allergyEpipenTimeText: ''
  }, overrides);
}

// --- Module Registration ---
registerCcModule({
  id: 'allergy',
  recordCc: 'allergy',
  titleTh: 'ผื่นแพ้เฉียบพลัน / แน่นคอ ตาบวม ปากบวม',
  titleEn: 'Acute allergic reaction / Angioedema',
  sectionDomId: 'allergyQuestionnaireSection',
  headerTh: 'แบบฟอร์มซักประวัติ: ผื่นแพ้เฉียบพลัน / แน่นคอ ตาบวม ปากบวม (Acute Allergic Reaction / Angioedema / Anaphylaxis)',
  headerEn: '(Airway & Hemodynamic Triage)',
  patientBadgeHtml: '<i data-lucide="shield-alert" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-rose-500"></i><span class="whitespace-nowrap">ผื่นแพ้เฉียบพลัน / แน่นคอ ตาบวม ปากบวม</span>',
  doctorCcBadgeHtml: '<i data-lucide="shield-alert" class="w-3.5 h-3.5 mr-1 text-rose-500"></i> CC: ผื่นแพ้เฉียบพลัน / แน่นคอ ตาบวม ปากบวม',
  pmhSectionNumber: 5,
  getPmhSectionNumber: () => 5,
  dateFields: ['allergyOnsetExactDate'],
  timeFields: ['allergyOnsetExactTime', 'allergyEpipenTimeText'],
  branchIds: [
    'allergyExactTimeWrap',
    'allergyTriggerFoodWrap',
    'allergyTriggerMedWrap',
    'allergyTriggerHerbWrap',
    'allergyTriggerInsectWrap',
    'allergyMucosaFeverWrap',
    'allergyEpipenWrap',
    'allergyEpipenTimeWrap'
  ],
  inputIdsToClear: [
    'allergyDurationVal',
    'allergyOnsetExactDate',
    'allergyOnsetExactTime',
    'allergyTriggerFoodText',
    'allergyTriggerMedText',
    'allergyTriggerHerbText',
    'allergyTriggerInsectText',
    'allergyEpipenTimeText',
    'allergy_other_free'
  ],

  algorithm: {
    chiefComplaint: 'acute_allergy',
    titleTh: 'ผื่นแพ้เฉียบพลัน / แน่นคอ ตาบวม ปากบวม',
    schemaCode: 'acute_allergy',
    version: '3.0.0',
    triageLevelRules: [
      { level: 1, criteria: 'Anaphylaxis (WAO/NIAID criteria met), Prehospital EpiPen administered, Impending Upper Airway Obstruction (Stridor / Hoarseness / Dysphagia / Tongue or Throat edema)' },
      { level: 2, criteria: 'Suspected SCARs (SJS/TEN/DRESS: blistering, skin peeling, mucosal ulcer/ocular pain, purpura + fever), ACEi-induced angioedema, Refractory risk on Beta-blocker or severe Asthma bronchospasm' },
      { level: 4, criteria: 'Uncomplicated acute urticaria / flushing / mild localized rash without airway, hemodynamic, GI, mucosal or ACEi risk' }
    ]
  },

  formHtml: ALLERGY_FORM_HTML,

  onTitleChange() {},

  onSelectForm() {
    updateAllergyMucosaContext();
  },

  onActivate() {
    updateAllergyMucosaContext();
    handleAllergyOnsetTimeKnownChange();
    syncAllergyTriggerBranches();
    handleAllergyPriorAnaphylaxisChange();
    handleAllergyEpipenUsageChange();
  },

  resetForm() {
    ['allergyOnsetSpeed', 'allergyOnsetTimeKnown', 'allergyPriorAnaphylaxis', 'allergyEpipenUsage', 'allergyPrehospOralMed'].forEach(n => {
      setAllergyRadioValue(n, '');
    });
    ['allergySuspectedTriggers', 'allergySkinRash', 'allergyMucosaFever', 'allergyAngioedema', 'allergyUpperAirway', 'allergyLowerAirway', 'allergyCirculationShock', 'allergyGiSymptoms', 'allergySpecialMeds', 'allergyPmhSpecific'].forEach(n => {
      setAllergyCheckboxGroup(n, []);
    });
    const unk = document.getElementById('allergyEpipenTimeUnknown');
    if (unk) unk.checked = false;
    this.branchIds.forEach(bId => toggleAllergyBranch(bId, false));
    this.inputIdsToClear.forEach(iId => {
      const el = document.getElementById(iId);
      if (el) el.value = '';
    });
    const durUnit = document.getElementById('allergyDurationUnit');
    if (durUnit) durUnit.value = 'minutes';
  },

  collectIntake(ctx) {
    ctx = ctx || {};
    const _rawDur = parseFloat(document.getElementById('allergyDurationVal')?.value);
    const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
    const durationUnit = document.getElementById('allergyDurationUnit')?.value || 'minutes';

    const allergyOnsetSpeed = getAllergyRadioValue('allergyOnsetSpeed');
    const allergyOnsetTimeKnown = getAllergyRadioValue('allergyOnsetTimeKnown');
    const allergyOnsetExactDate = allergyOnsetTimeKnown === 'known' ? (document.getElementById('allergyOnsetExactDate')?.value?.trim() || '') : '';
    const allergyOnsetExactTime = allergyOnsetTimeKnown === 'known' ? (document.getElementById('allergyOnsetExactTime')?.value?.trim() || '') : '';

    const allergySuspectedTriggers = getAllergyCheckedValues('allergySuspectedTriggers');
    const allergyTriggerFoodText = allergySuspectedTriggers.includes('food') ? (document.getElementById('allergyTriggerFoodText')?.value?.trim() || '') : '';
    const allergyTriggerMedText = allergySuspectedTriggers.includes('medication') ? (document.getElementById('allergyTriggerMedText')?.value?.trim() || '') : '';
    const allergyTriggerHerbText = allergySuspectedTriggers.includes('herbal_supplement') ? (document.getElementById('allergyTriggerHerbText')?.value?.trim() || '') : '';
    const allergyTriggerInsectText = allergySuspectedTriggers.includes('insect_sting') ? (document.getElementById('allergyTriggerInsectText')?.value?.trim() || '') : '';

    const allergySkinRash = getAllergyCheckedValues('allergySkinRash');
    const needsMucosa = ['blisters_peeling', 'erythema_maculopapular', 'purpura_petechiae'].some(k => allergySkinRash.includes(k));
    const allergyMucosaFever = needsMucosa ? getAllergyCheckedValues('allergyMucosaFever') : [];

    const allergyAngioedema = getAllergyCheckedValues('allergyAngioedema');
    const allergyUpperAirway = getAllergyCheckedValues('allergyUpperAirway');
    const allergyLowerAirway = getAllergyCheckedValues('allergyLowerAirway');
    const allergyCirculationShock = getAllergyCheckedValues('allergyCirculationShock');
    const allergyGiSymptoms = getAllergyCheckedValues('allergyGiSymptoms');

    const allergyPriorAnaphylaxis = getAllergyRadioValue('allergyPriorAnaphylaxis');
    const allergyEpipenUsage = allergyPriorAnaphylaxis === 'prior_severe_hosp' ? getAllergyRadioValue('allergyEpipenUsage') : '';
    const allergyEpipenTimeUnknown = allergyEpipenUsage === 'used_prehospital' && Boolean(document.getElementById('allergyEpipenTimeUnknown')?.checked);
    const allergyEpipenTimeText = (allergyEpipenUsage === 'used_prehospital' && !allergyEpipenTimeUnknown)
      ? (document.getElementById('allergyEpipenTimeText')?.value?.trim() || '')
      : '';

    const allergyPrehospOralMed = getAllergyRadioValue('allergyPrehospOralMed');
    const allergySpecialMeds = getAllergyCheckedValues('allergySpecialMeds');
    const allergyPmhSpecific = getAllergyCheckedValues('allergyPmhSpecific');

    const patient = {
      id: ctx.recordId || `case-${Date.now()}`,
      queue_number: ctx.queueNumber || 'ER-NEW',
      hn: ctx.randomHn || '-',
      name: ctx.patientName || 'ไม่ระบุชื่อ',
      age: ctx.patientAge !== undefined ? ctx.patientAge : 'ไม่ระบุ',
      gender: ctx.gender || 'ไม่ระบุ',
      chief_complaint: 'allergy',
      chief_complaint_title: 'ผื่นแพ้เฉียบพลัน / แน่นคอ ตาบวม ปากบวม',
      timestamp: new Date().toISOString(),
      status: ctx.recordStatus || 'waiting',
      durationVal,
      durationUnit,
      hospRecordStatus: ctx.hospRecordStatus || 'unspecified',
      underlying: (Array.isArray(ctx.underlying) && ctx.underlying.length > 0) ? ctx.underlying : ((ctx.hospRecordStatus === 'self' || ctx.hospRecordStatus === 'additional') ? ['ปฏิเสธ'] : []),
      drugAllergy: ctx.drugAllergy || 'ไม่ได้ระบุ',
      currentMeds: ctx.currentMeds || 'ไม่ได้ระบุ',
      otherSymptomsFree: document.getElementById('allergy_other_free')?.value?.trim() || ctx.otherSymptomsFree || '',
      doctor_notes: ctx.preservedDoctorNotes || { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },

      allergyOnsetSpeed,
      allergyOnsetTimeKnown,
      allergyOnsetExactDate,
      allergyOnsetExactTime,
      allergySuspectedTriggers,
      allergyTriggerFoodText,
      allergyTriggerMedText,
      allergyTriggerHerbText,
      allergyTriggerInsectText,
      allergySkinRash,
      allergyMucosaFever,
      allergyAngioedema,
      allergyUpperAirway,
      allergyLowerAirway,
      allergyCirculationShock,
      allergyGiSymptoms,
      allergyPriorAnaphylaxis,
      allergyEpipenUsage,
      allergyEpipenTimeUnknown,
      allergyEpipenTimeText,
      allergyPrehospOralMed,
      allergySpecialMeds,
      allergyPmhSpecific
    };

    return patient;
  },

  populateForm(patient) {
    if (!patient) return;
    this.resetForm();

    const durVal = document.getElementById('allergyDurationVal');
    if (durVal) durVal.value = patient.durationVal || '';
    const durUnit = document.getElementById('allergyDurationUnit');
    if (durUnit) durUnit.value = patient.durationUnit || 'minutes';

    setAllergyRadioValue('allergyOnsetSpeed', patient.allergyOnsetSpeed);
    const timeKnown = patient.allergyOnsetTimeKnown || ((patient.allergyOnsetExactDate || patient.allergyOnsetExactTime) ? 'known' : '');
    setAllergyRadioValue('allergyOnsetTimeKnown', timeKnown);
    handleAllergyOnsetTimeKnownChange(timeKnown);

    const onDate = document.getElementById('allergyOnsetExactDate');
    if (onDate) onDate.value = patient.allergyOnsetExactDate || '';
    const onTime = document.getElementById('allergyOnsetExactTime');
    if (onTime) onTime.value = patient.allergyOnsetExactTime || '';

    setAllergyCheckboxGroup('allergySuspectedTriggers', patient.allergySuspectedTriggers);
    syncAllergyTriggerBranches();

    const trigInputs = {
      allergyTriggerFoodText: patient.allergyTriggerFoodText,
      allergyTriggerMedText: patient.allergyTriggerMedText,
      allergyTriggerHerbText: patient.allergyTriggerHerbText,
      allergyTriggerInsectText: patient.allergyTriggerInsectText
    };
    Object.entries(trigInputs).forEach(([id, v]) => {
      const el = document.getElementById(id);
      if (el) el.value = v || '';
    });

    setAllergyCheckboxGroup('allergySkinRash', patient.allergySkinRash);
    updateAllergyMucosaContext();
    setAllergyCheckboxGroup('allergyMucosaFever', patient.allergyMucosaFever);

    setAllergyCheckboxGroup('allergyAngioedema', patient.allergyAngioedema);
    setAllergyCheckboxGroup('allergyUpperAirway', patient.allergyUpperAirway);
    setAllergyCheckboxGroup('allergyLowerAirway', patient.allergyLowerAirway);
    setAllergyCheckboxGroup('allergyCirculationShock', patient.allergyCirculationShock);
    setAllergyCheckboxGroup('allergyGiSymptoms', patient.allergyGiSymptoms);

    setAllergyRadioValue('allergyPriorAnaphylaxis', patient.allergyPriorAnaphylaxis);
    handleAllergyPriorAnaphylaxisChange(patient.allergyPriorAnaphylaxis);
    setAllergyRadioValue('allergyEpipenUsage', patient.allergyEpipenUsage);
    handleAllergyEpipenUsageChange(patient.allergyEpipenUsage);

    const unk = document.getElementById('allergyEpipenTimeUnknown');
    if (unk) unk.checked = Boolean(patient.allergyEpipenTimeUnknown);
    const epTime = document.getElementById('allergyEpipenTimeText');
    if (epTime) epTime.value = patient.allergyEpipenTimeUnknown ? '' : (patient.allergyEpipenTimeText || '');

    setAllergyRadioValue('allergyPrehospOralMed', patient.allergyPrehospOralMed);
    setAllergyCheckboxGroup('allergySpecialMeds', patient.allergySpecialMeds);
    setAllergyCheckboxGroup('allergyPmhSpecific', patient.allergyPmhSpecific);

    const oText = document.getElementById('allergy_other_free');
    if (oText) oText.value = patient.otherSymptomsFree || '';
  },

  hydrateForm(patient) {
    this.populateForm(patient);
  },

  isRedFlag(patient) {
    return evaluateAllergyRedFlags(patient).length > 0;
  },

  evaluateRedFlags: evaluateAllergyRedFlags,
  updateOutputs: updateAllergyOutputs,

  seedPatients: [
    makeAllergySeed({
      id: 'case-160',
      queue_number: 'Q-001',
      hn: '6716012',
      name: 'นายกฤษณะ เมธาชัย',
      age: 28,
      gender: 'ชาย',
      timestamp: '2026-10-26T07:00:00.000Z',
      durationVal: 30,
      durationUnit: 'minutes',
      underlying: ['หอบหืด (Bronchial Asthma)'],
      currentMeds: 'Budesonide/Formoterol Turbuhaler',
      otherSymptomsFree: 'ความดันโลหิตแรกรับ 82/48 mmHg ชีพจร 128 ครั้ง/นาที',
      allergyOnsetSpeed: 'rapid_within_minutes',
      allergyOnsetTimeKnown: 'known',
      allergyOnsetExactDate: '26/10/2026',
      allergyOnsetExactTime: '06:30',
      allergySuspectedTriggers: ['food'],
      allergyTriggerFoodText: 'ต้มยำกุ้ง',
      allergySkinRash: ['urticaria', 'flushing'],
      allergyAngioedema: ['lips', 'tongue_palate', 'periorbital_face'],
      allergyUpperAirway: ['throat_tightness', 'voice_hoarseness', 'dysphagia_drooling'],
      allergyLowerAirway: ['dyspnea', 'wheezing', 'chest_tightness'],
      allergyCirculationShock: ['presyncope_dizziness', 'cold_diaphoresis'],
      allergyGiSymptoms: ['severe_abd_cramps', 'repetitive_vomiting'],
      allergyPriorAnaphylaxis: 'prior_mild_urticaria',
      allergyPrehospOralMed: 'none_oral_med',
      allergySpecialMeds: ['none_special_meds'],
      allergyPmhSpecific: ['asthma']
    }),
    makeAllergySeed({
      id: 'case-161',
      queue_number: 'Q-002',
      hn: '6716123',
      name: 'นางทองดี ศรีสวัสดิ์',
      age: 68,
      gender: 'หญิง',
      timestamp: '2026-10-26T07:45:00.000Z',
      durationVal: 2,
      durationUnit: 'hours',
      underlying: ['ความดันสูง (HT)', 'เบาหวาน (DM)'],
      currentMeds: 'Enalapril 10 mg วันละ 1 ครั้ง, Metformin 500 mg',
      otherSymptomsFree: 'ตื่นเช้ามาลิ้นบวมคับปาก พูดไม่ชัด น้ำลายย้อย ไม่มีลมพิษ ไม่คัน',
      allergyOnsetSpeed: 'rapid_within_minutes',
      allergyOnsetTimeKnown: 'known',
      allergyOnsetExactDate: '26/10/2026',
      allergyOnsetExactTime: '05:45',
      allergySuspectedTriggers: ['medication'],
      allergyTriggerMedText: 'Enalapril 10 mg ทานมา 6 เดือน',
      allergySkinRash: ['none_rash'],
      allergyAngioedema: ['lips', 'tongue_palate'],
      allergyUpperAirway: ['throat_tightness', 'dysphagia_drooling', 'voice_hoarseness'],
      allergyLowerAirway: ['none_lower_airway'],
      allergyCirculationShock: ['none_circulation'],
      allergyGiSymptoms: ['none_gi'],
      allergyPriorAnaphylaxis: 'first_time_never',
      allergyPrehospOralMed: 'none_oral_med',
      allergySpecialMeds: ['ace_inhibitors'],
      allergyPmhSpecific: ['none_pmh_specific']
    }),
    makeAllergySeed({
      id: 'case-162',
      queue_number: 'Q-003',
      hn: '6716234',
      name: 'ด.ช. ภัทรพล สุขสม',
      age: 11,
      gender: 'ชาย',
      timestamp: '2026-10-26T08:30:00.000Z',
      durationVal: 15,
      durationUnit: 'minutes',
      underlying: ['หอบหืด (Asthma)'],
      currentMeds: 'Salbutamol MDI prn',
      otherSymptomsFree: 'โดนแตนต่อยที่ต้นแขนขวา 2 จุด ลมพิษขึ้นเร็ว แน่นหน้าอก หายใจหวีด ฉีด EpiPen แล้วก่อนมา',
      allergyOnsetSpeed: 'rapid_within_minutes',
      allergyOnsetTimeKnown: 'known',
      allergyOnsetExactDate: '26/10/2026',
      allergyOnsetExactTime: '08:15',
      allergySuspectedTriggers: ['insect_sting'],
      allergyTriggerInsectText: 'แตนต่อยที่แขนขวา 2 จุด',
      allergySkinRash: ['urticaria', 'flushing'],
      allergyAngioedema: ['none_angioedema'],
      allergyUpperAirway: ['throat_tightness'],
      allergyLowerAirway: ['dyspnea', 'wheezing', 'chest_tightness'],
      allergyCirculationShock: ['none_circulation'],
      allergyGiSymptoms: ['none_gi'],
      allergyPriorAnaphylaxis: 'prior_severe_hosp',
      allergyEpipenUsage: 'used_prehospital',
      allergyEpipenTimeText: '08:20',
      allergyPrehospOralMed: 'none_oral_med',
      allergySpecialMeds: ['none_special_meds'],
      allergyPmhSpecific: ['asthma']
    }),
    makeAllergySeed({
      id: 'case-163',
      queue_number: 'Q-004',
      hn: '6716345',
      name: 'นางสาววรรณภา อินทรา',
      age: 24,
      gender: 'หญิง',
      timestamp: '2026-10-26T09:15:00.000Z',
      durationVal: 3,
      durationUnit: 'hours',
      otherSymptomsFree: 'ทานส้มตำปูม้าเมื่อ 3 ชม.ก่อน มีผื่นลมพิษคันตามแขนขาและแผ่นหลัง ไม่แน่นคอ หายใจปกติ',
      allergyOnsetSpeed: 'gradual_throughout_day',
      allergyOnsetTimeKnown: 'known',
      allergyOnsetExactDate: '26/10/2026',
      allergyOnsetExactTime: '06:15',
      allergySuspectedTriggers: ['food'],
      allergyTriggerFoodText: 'ส้มตำปูม้า',
      allergySkinRash: ['urticaria'],
      allergyAngioedema: ['none_angioedema'],
      allergyUpperAirway: ['none_upper_airway'],
      allergyLowerAirway: ['none_lower_airway'],
      allergyCirculationShock: ['none_circulation'],
      allergyGiSymptoms: ['none_gi'],
      allergyPriorAnaphylaxis: 'first_time_never',
      allergyPrehospOralMed: 'antihistamine_no_improve',
      allergySpecialMeds: ['none_special_meds'],
      allergyPmhSpecific: ['none_pmh_specific']
    })
  ]
});

if (typeof window !== 'undefined') {
  Object.assign(window, {
    handleAllergyExclusiveGroup,
    handleAllergyOnsetTimeKnownChange,
    syncAllergyTriggerBranches,
    handleAllergyTriggerChange,
    updateAllergyMucosaContext,
    handleAllergySkinRashChange,
    handleAllergyPriorAnaphylaxisChange,
    handleAllergyEpipenUsageChange,
    handleAllergyEpipenTimeUnknownToggle,
    handleAllergyEpipenTimeInput
  });
}
