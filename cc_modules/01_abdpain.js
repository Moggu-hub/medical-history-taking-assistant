// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 01_abdpain.js
// อาการนำ: ปวดท้อง (Abdominal pain — 3-Card Balanced UX + Complete Clinical Capture)
// ไฟล์นี้แยกอิสระสำหรับอาการนำ abdpain เพื่อให้ทีมแพทย์และ IT โรงพยาบาลนำไปพัฒนาต่อได้โดยไม่กระทบระบบหลัก
// =========================================================================

// --- Pain Score State & Helpers (Global contracts called by core_engine.js) ---
let abdpainPainScoreTouched = false;

function clearAbdpainPainScore() {
  abdpainPainScoreTouched = false;
  const slider = document.getElementById('abdpainPainScore');
  if (slider) slider.value = 0;
  const emojiEl = document.getElementById('abdpainPainScoreEmoji');
  const textEl = document.getElementById('abdpainPainScoreText');
  const badgeEl = document.getElementById('abdpainPainScoreBadge');
  const clearBtn = document.getElementById('abdpainPainScoreClearBtn');
  if (emojiEl) emojiEl.textContent = '⚪';
  if (textEl) textEl.textContent = 'ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)';
  if (badgeEl) badgeEl.className = 'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all';
  if (clearBtn) clearBtn.classList.add('hidden');
}

function handleAbdpainPainScoreChange(val) {
  abdpainPainScoreTouched = true;
  const num = parseInt(val, 10);
  const emojiEl = document.getElementById('abdpainPainScoreEmoji');
  const textEl = document.getElementById('abdpainPainScoreText');
  const badgeEl = document.getElementById('abdpainPainScoreBadge');
  const clearBtn = document.getElementById('abdpainPainScoreClearBtn');
  if (clearBtn) clearBtn.classList.remove('hidden');
  if (!emojiEl || !textEl || !badgeEl) return;

  let emoji = '😐';
  let label = 'ปวดปานกลาง';
  let badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';

  if (num === 0) {
    emoji = '😊';
    label = 'สบายดี (ไม่ปวดเลย)';
    badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  } else if (num <= 3) {
    emoji = '🙂';
    label = 'ปวดเล็กน้อย (ทนได้)';
    badgeClass = 'bg-lime-100 text-lime-800 border-lime-300';
  } else if (num <= 6) {
    emoji = '😐';
    label = 'ปวดปานกลาง (รบกวนสมาธิ)';
    badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
  } else if (num <= 9) {
    emoji = '😣';
    label = 'ปวดมาก (ทนแทบไม่ไหว)';
    badgeClass = 'bg-rose-100 text-rose-800 border-rose-300';
  } else {
    emoji = '😭';
    label = 'เจ็บปวดรุนแรงที่สุดในชีวิต';
    badgeClass = 'bg-red-200 text-red-900 border-red-400 animate-pulse';
  }

  emojiEl.textContent = emoji;
  textEl.textContent = `${num} / 10 (${label})`;
  badgeEl.className = `inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border transition ${badgeClass}`;
}

function setAbdpainPainScore(score) {
  abdpainPainScoreTouched = true;
  const slider = document.getElementById('abdpainPainScore');
  if (slider) {
    slider.value = score;
    handleAbdpainPainScoreChange(score);
  }
}

// --- Static Dictionaries & Output Maps ---
const ABD_LABELS = {
  units: { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' },
  onset: {
    sudden_severe: 'ปวดรุนแรงเฉียบพลันทันที',
    gradual_worsening: 'ค่อยๆ ปวดมากขึ้นเรื่อยๆ',
    intermittent_cramps: 'ปวดเป็นพักๆ เป็นๆ หายๆ',
    intermittent_chronic: 'ปวดเป็นพักๆ เป็นๆ หายๆ'
  },
  intermittentBaseline: {
    pain_free: 'ช่วงเว้นหายสนิท ไม่ปวดเลย',
    improved_persistent: 'ช่วงเว้นทุเลาลง แต่ยังปวดอยู่ตลอด'
  },
  chars: {
    colicky: 'บิดเกร็งเป็นพักๆ',
    crampy_colic: 'บิดเกร็งเป็นพักๆ',
    colicky_crampy: 'บิดเกร็งเป็นพักๆ',
    burning: 'แสบร้อน / จุกแสบ',
    burning_gnawing: 'แสบร้อน / จุกแสบ',
    dull: 'ตื้อๆ แน่นๆ หน่วงๆ',
    dull_aching: 'ตื้อๆ แน่นๆ หน่วงๆ',
    constant_dull: 'ตื้อๆ แน่นๆ หน่วงๆ',
    sharp_stabbing: 'เสียดแทง / เหมือนฉีกขาด',
    throbbing: 'ตุบๆ ตามชีพจร'
  },
  locs: {
    epigastrium: 'ใต้ลิ้นปี่',
    ruq: 'ชายโครงขวา (RUQ)',
    luq: 'ชายโครงซ้าย (LUQ)',
    periumbilical: 'รอบสะดือ',
    rlq: 'ท้องน้อยขวา (RLQ)',
    llq: 'ท้องน้อยซ้าย (LLQ)',
    suprapubic: 'ท้องน้อยตรงกลาง/เหนือหัวหน่าว',
    diffuse: 'ทั่วทั้งท้อง',
    generalized: 'ทั่วทั้งท้อง'
  },
  rads: {
    back_mid: 'ร้าวทะลุกลางหลัง',
    back_right: 'ร้าวไปหลังขวา / สะบักขวา',
    scapula_right_shoulder: 'ร้าวไปหลังขวา / สะบักขวา',
    back_left: 'ร้าวไปหลังซ้าย / บั้นเอวซ้าย',
    groin_thigh_genitalia: 'ร้าวลงขาหนีบ / อวัยวะเพศ',
    chest: 'ร้าวขึ้นหน้าอก / ลำคอ / กราม',
    chest_neck: 'ร้าวขึ้นหน้าอก / ลำคอ / กราม',
    none: 'ไม่ร้าวไปที่อื่น'
  },
  factors: {
    jarring_movement: 'ขยับตัว / ไอ / เดินสะเทือนแล้วเจ็บสะท้าน',
    lean_forward_relief: 'นอนราบยืดตัวแล้วปวด นั่งหรืองอตัวแล้วดีขึ้น',
    forward_bend_relief: 'นอนราบยืดตัวแล้วปวด นั่งหรืองอตัวแล้วดีขึ้น',
    postprandial_worse: 'ปวดมากขึ้นหลังทานอาหาร',
    fatty_food_worse: 'ปวดมากขึ้นหลังทานอาหาร',
    empty_stomach_worse: 'ปวดมากขึ้นตอนท้องว่าง',
    antacid_relief: 'ทานยาลดกรดแล้วดีขึ้น',
    defecation_relief: 'ถ่ายอุจจาระหรือผายลมแล้วดีขึ้น',
    food_relieves: 'ทานอาหารแล้วทุเลาลง'
  },
  vomitContents: {
    food_gastric: 'เศษอาหาร / น้ำย่อยเหลือง',
    bilious: 'น้ำดีสีเขียว',
    bilious_green: 'น้ำดีสีเขียว',
    coffee_ground: 'สีดำคล้ายกากกาแฟ',
    bloody: 'เลือดสด / ลิ่มเลือด',
    coffee_ground_blood: 'สีดำคล้ายกากกาแฟ / มีเลือดปน',
    feculent: 'กลิ่นเหม็นคล้ายอุจจาระ'
  },
  obstipationType: {
    no_stool_no_gas: 'ไม่ถ่ายอุจจาระและไม่ผายลมเลย',
    constipation_with_gas: 'ท้องผูกหลายวัน แต่ยังผายลมได้',
    overflow_watery_seepage: 'อุจจาระเป็นน้ำ ไหลซึมออกมาทีละนิด ไม่มีก้อนปน'
  },
  lmpApprox: {
    '1_week_ago': 'ประมาณ 1 สัปดาห์ก่อน',
    '2_weeks_ago': 'ประมาณ 2 สัปดาห์ก่อน',
    '3_4_weeks_ago': 'ประมาณ 3-4 สัปดาห์ก่อน',
    '1_2_months_ago': 'ประมาณ 1-2 เดือนก่อน',
    'gt_2_months_ago': 'มากกว่า 2 เดือนก่อน'
  },
  lmpStatus: {
    missed_period: 'ขาดประจำเดือน / สงสัยตั้งครรภ์',
    premenarche: 'วัยก่อนมีประจำเดือน (ยังไม่เคยมีประจำเดือน)',
    menopause: 'วัยหมดประจำเดือน / ผ่าตัดมดลูกแล้ว',
    unsure: 'ไม่แน่ใจสถานะการตั้งครรภ์'
  },
  alcohol: {
    daily_heavy: 'ดื่มเป็นประจำทุกวัน',
    regular_heavy: 'ดื่มสุราประจำ หรือดื่มหนักก่อนปวด',
    occasional: 'ดื่มสังสรรค์นานๆ ครั้ง',
    social: 'ดื่มนานๆ ครั้ง',
    none: 'ไม่ดื่มแอลกอฮอล์'
  },
  hospStatus: {
    complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
    additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
    self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
    unspecified: 'ไม่ได้ระบุ'
  }
};

// --- DOM Helpers & Dynamic Context Handlers (Scoped abd*) ---
function toggleAbdBranch(id, show) {
  if (typeof toggleBranch === 'function') {
    toggleBranch(id, show);
    return;
  }
  const el = document.getElementById(id);
  if (el) el.classList.toggle('hidden', !show);
}

function getAbdRadioVal(name) {
  return document.querySelector(`input[name="${name}"]:checked`)?.value || '';
}

function setAbdRadioVal(name, val) {
  document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
    r.checked = (val !== undefined && val !== null && val !== '' && r.value === val);
  });
}

function getAbdCheckedVals(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(c => c.value);
}

function setAbdCheckboxGroup(name, vals) {
  const arr = Array.isArray(vals) ? vals : [];
  document.querySelectorAll(`input[name="${name}"]`).forEach(c => {
    c.checked = arr.includes(c.value);
  });
}

function clearAbdNoneCheckbox(noneId) {
  const n = document.getElementById(noneId);
  if (n) n.checked = false;
}

function handleAbdpainOnsetChange() {
  const val = getAbdRadioVal('abdpainOnsetMode');
  const isIntermittent = (val === 'intermittent_cramps' || val === 'intermittent_chronic');
  toggleAbdBranch('abdpain_onset_intermittent_branch', isIntermittent);
  if (!isIntermittent) setAbdRadioVal('abdpainIntermittentBaseline', '');
}

function handleAbdpainLocationChange() {
  const selectedLocs = getAbdCheckedVals('abdpain_loc');
  toggleAbdBranch('abdpain_branch_rlq', selectedLocs.includes('rlq'));
  toggleAbdBranch('abdpain_branch_epigastric_ruq', selectedLocs.includes('epigastrium') || selectedLocs.includes('ruq'));
  if (!selectedLocs.includes('rlq')) {
    ['abdpain_rlq_migration', 'abdpain_rlq_jarring'].forEach(id => {
      const c = document.getElementById(id);
      if (c) c.checked = false;
    });
  }
  if (!selectedLocs.includes('epigastrium') && !selectedLocs.includes('ruq')) {
    ['abdpain_epi_fatty_meal', 'abdpain_epi_gallstone_alcohol'].forEach(id => {
      const c = document.getElementById(id);
      if (c) c.checked = false;
    });
  }
}

function handleAbdpainLocOtherToggle(checked) {
  toggleAbdBranch('abdpain_loc_other_wrap', checked);
  if (!checked) {
    const inp = document.getElementById('abdpain_loc_other_text');
    if (inp) inp.value = '';
  }
}

function handleAbdpainRadiationChange() {
  const hasAny = getAbdCheckedVals('abdpain_rad').length > 0 || Boolean(document.getElementById('abdpain_rad_other_chk')?.checked);
  if (hasAny) clearAbdNoneCheckbox('abdpain_rad_none');
}

function handleAbdpainRadNoneChange(checked) {
  if (!checked) return;
  setAbdCheckboxGroup('abdpain_rad', []);
  const oc = document.getElementById('abdpain_rad_other_chk');
  if (oc) oc.checked = false;
  handleAbdpainRadOtherToggle(false, true);
}

function handleAbdpainRadOtherToggle(checked, keepNone) {
  toggleAbdBranch('abdpain_rad_other_wrap', checked);
  if (checked && !keepNone) clearAbdNoneCheckbox('abdpain_rad_none');
  if (!checked) {
    const inp = document.getElementById('abdpain_rad_other_text');
    if (inp) inp.value = '';
  }
}

function handleAbdpainFactorChange() {
  if (getAbdCheckedVals('abdpain_factor').length > 0) clearAbdNoneCheckbox('abdpain_factor_none');
}

function handleAbdpainFactorNoneChange(checked) {
  if (checked) setAbdCheckboxGroup('abdpain_factor', []);
}

function handleAbdpainVomitNauseaToggle(checked) {
  toggleAbdBranch('abdpain_vomit_char_wrap', !checked);
  const vf = document.getElementById('abdpainVomitFreq');
  if (vf) {
    vf.disabled = Boolean(checked);
    if (checked) vf.value = '';
  }
  if (checked) setAbdCheckboxGroup('abdpain_vomit_content', []);
}

function syncAbdpainGiBranches() {
  const giIds = [
    'abdpain_gi_vomit', 'abdpain_gi_diarrhea', 'abdpain_gi_constipation', 'abdpain_gi_anorexia',
    'abdpain_rf_hematemesis', 'abdpain_rf_melena', 'abdpain_gi_distension', 'abdpain_jaundice'
  ];
  const anyChecked = giIds.some(id => Boolean(document.getElementById(id)?.checked));
  if (anyChecked) clearAbdNoneCheckbox('abdpain_gi_none');

  const hasVomit = Boolean(document.getElementById('abdpain_gi_vomit')?.checked) || Boolean(document.getElementById('abdpain_rf_hematemesis')?.checked);
  toggleAbdBranch('abdpain_vomit_detail_wrap', hasVomit);
  if (!hasVomit) {
    const noChk = document.getElementById('abdpain_vomit_nausea_only');
    if (noChk) noChk.checked = false;
    handleAbdpainVomitNauseaToggle(false);
  }

  const hasDiarrhea = Boolean(document.getElementById('abdpain_gi_diarrhea')?.checked);
  toggleAbdBranch('abdpain_diarrhea_freq_wrap', hasDiarrhea);
  if (!hasDiarrhea) {
    const df = document.getElementById('abdpainDiarrheaFreq');
    if (df) df.value = '';
  }

  const hasConstip = Boolean(document.getElementById('abdpain_gi_constipation')?.checked);
  toggleAbdBranch('abdpain_obstipation_wrap', hasConstip);
  if (!hasConstip) {
    const days = document.getElementById('abdpainConstipationDays');
    if (days) days.value = '';
    setAbdRadioVal('abdpain_obstipation_type', '');
  }
}

function handleAbdpainGroupNoneChange(noneId, itemIds, onClear) {
  const checked = Boolean(document.getElementById(noneId)?.checked);
  if (!checked) return;
  itemIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.checked = false;
  });
  if (typeof onClear === 'function') onClear();
}

function handleAbdpainGroupItemChange(noneId, chkId) {
  if (document.getElementById(chkId)?.checked) clearAbdNoneCheckbox(noneId);
}

function handleAbdpainSurgeryChange() {
  const checked = Boolean(document.getElementById('abdpain_risk_surgery')?.checked);
  if (checked) clearAbdNoneCheckbox('abdpain_risk_none');
  toggleAbdBranch('abdpain_surgery_detail_wrap', checked);
  if (!checked) {
    const inp = document.getElementById('abdpainSurgeryDetail');
    if (inp) inp.value = '';
  }
}

function handleAbdpainLmpToggle(status) {
  const s = status || getAbdRadioVal('abdpain_lmp_status');
  toggleAbdBranch('abdpain_lmp_date_wrap', s === 'exact_date');
  toggleAbdBranch('abdpain_lmp_approx_wrap', s === 'approx');
  toggleAbdBranch('abdpain_lmp_pregnant_weeks_wrap', s === 'pregnant');
  if (s !== 'exact_date') {
    const d = document.getElementById('abdpainLmpDate');
    if (d) d.value = '';
  }
  if (s !== 'approx') setAbdRadioVal('abdpain_lmp_approx', '');
  if (s !== 'pregnant') {
    const w = document.getElementById('abdpainPregnancyWeeks');
    if (w) w.value = '';
  }
}

function handleAbdpainGynItemChange(chkId) {
  if (document.getElementById(chkId)?.checked) clearAbdNoneCheckbox('abdpain_gyn_none');
}

function isAbdFemaleTitle() {
  const t = document.getElementById('patientTitleSelect')?.value || '';
  return ['นางสาว', 'นาง', 'เด็กหญิง', 'หญิง'].includes(t);
}

function updateAbdpainFemaleContext(forceFemaleBool) {
  const show = typeof forceFemaleBool === 'boolean' ? forceFemaleBool : isAbdFemaleTitle();
  toggleAbdBranch('abdpain_branch_female', show);
}

// --- Legacy Global Compatibility Hooks ---
function handleAbdpainVomitToggle(status) {
  toggleAbdBranch('abdpain_vomit_detail_wrap', status === 'vomiting');
}

function handleAbdpainStoolToggle(status) {
  toggleAbdBranch('abdpain_diarrhea_freq_wrap', status === 'diarrhea');
  toggleAbdBranch('abdpain_obstipation_wrap', status === 'constipation' || status === 'constipation_no_gas');
}

// --- Doctor UI & Red Flag Rendering Helpers ---
function buildAbdpainFemaleSummary(patient) {
  if (patient.gender !== 'หญิง') return '';
  const lmpStatus = patient.abdpain_lmp_status;
  const parts = [];
  if (lmpStatus === 'exact_date') {
    const fmt = (typeof formatDateDdMmYyyy === 'function') ? formatDateDdMmYyyy(patient.abdpainLmpDate) : patient.abdpainLmpDate;
    parts.push(`LMP วันที่ ${fmt || 'ไม่ระบุวัน'}`);
  } else if (lmpStatus === 'approx') {
    parts.push(`LMP ${ABD_LABELS.lmpApprox[patient.abdpain_lmp_approx] || 'จำวันที่ไม่ได้แน่ชัด (โดยประมาณ)'}`);
  } else if (lmpStatus === 'pregnant') {
    parts.push(patient.abdpainPregnancyWeeks ? `กำลังตั้งครรภ์ (${patient.abdpainPregnancyWeeks})` : 'กำลังตั้งครรภ์');
  } else if (ABD_LABELS.lmpStatus[lmpStatus]) {
    parts.push(ABD_LABELS.lmpStatus[lmpStatus]);
  }
  return parts.join(', ');
}

function resolveAbdpainObstipationInfo(patient) {
  const days = patient.abdpainConstipationDays ? ` ${patient.abdpainConstipationDays} วัน` : '';
  const type = patient.abdpain_obstipation_type;
  const legacyObst = patient.abdpain_stool_status === 'constipation_no_gas' || patient.abdpain_stool_status === 'constipation' || patient.abdpain_rf_obstruction;
  if (!patient.abdpain_gi_constipation && !type && !legacyObst) return null;
  if (type === 'no_stool_no_gas' || patient.abdpain_rf_obstruction || patient.abdpain_stool_status === 'constipation_no_gas') {
    return { isComplete: true, text: `ท้องผูก${days} ไม่ถ่ายอุจจาระและไม่ผายลมเลย` };
  }
  if (type === 'overflow_watery_seepage') {
    return { isOverflow: true, text: `ท้องผูก${days} ร่วมกับอุจจาระเป็นน้ำ ไหลซึมออกมาทีละนิด ไม่มีก้อนปน` };
  }
  if (type === 'constipation_with_gas') {
    return { text: `ท้องผูก${days} แต่ยังผายลมได้` };
  }
  return { text: `ท้องผูก / ไม่ผายลม${days}` };
}

function evaluateAbdpainRedFlags(patient) {
  const redFlags = [];
  const locs = Array.isArray(patient.abdpainLocs) ? patient.abdpainLocs : [];
  const chars = Array.isArray(patient.abdpainChars) ? patient.abdpainChars : [];
  const rads = Array.isArray(patient.abdpainRads) ? patient.abdpainRads : [];
  const factors = Array.isArray(patient.abdpainFactors) ? patient.abdpainFactors : [];
  const vContents = Array.isArray(patient.abdpain_vomit_contents) ? patient.abdpain_vomit_contents : [];
  const obst = resolveAbdpainObstipationInfo(patient);

  const hasVomBlood = patient.abdpain_rf_hematemesis || vContents.some(c => c === 'coffee_ground_blood' || c === 'coffee_ground' || c === 'bloody');
  const hasMelena = patient.abdpain_rf_melena || patient.abdpain_stool_status === 'melena_bloody';
  const hasChestCardio = patient.abdpain_rf_chest_dyspnea && (locs.includes('epigastrium') || rads.includes('chest') || rads.includes('chest_neck'));
  const hasAaaPattern = patient.abdpainOnsetMode === 'sudden_severe' && chars.includes('sharp_stabbing') && rads.includes('back_mid');

  if (patient.abdpain_rf_shock || (patient.abdpain_rf_syncope && (hasMelena || hasVomBlood)) || hasChestCardio || hasAaaPattern) {
    redFlags.push({
      key: 'shock_collapse',
      textTh: 'ภาวะช็อก / เหงื่อแตกตัวเย็นซีด / สงสัยฉุกเฉินหลอดเลือด-หัวใจ (Impending Shock / Ruptured AAA / ACS Mimic)',
      risk: 'เสี่ยงภาวะช็อกเสียเลือดรุนแรง หลอดเลือดแดงใหญ่ช่องท้องปริแตก หรือภาวะหัวใจขาดเลือดฉับพลัน'
    });
  }
  if (hasMelena) {
    redFlags.push({
      key: 'melena',
      textTh: 'ถ่ายดำเหนียวเหมือนยางมะตอย หรือถ่ายเป็นเลือดสด (Melena / Hematochezia)',
      risk: 'เสี่ยงภาวะเลือดออกในทางเดินอาหารเฉียบพลัน (Severe Upper/Lower GI Hemorrhage)'
    });
  }
  if (hasVomBlood) {
    redFlags.push({
      key: 'hematemesis',
      textTh: 'อาเจียนเป็นเลือดสดหรือสีดำคล้ายกากกาแฟ (Hematemesis / Coffee-ground emesis)',
      risk: 'เสี่ยงภาวะเลือดออกในทางเดินอาหารส่วนต้นเฉียบพลัน (Acute Upper GI Bleeding)'
    });
  }
  if (obst?.isComplete || vContents.includes('feculent') || (obst?.isOverflow && (patient.abdpain_gi_distension || patient.abdpain_risk_surgery || patient.abdpain_surgery_status === 'yes' || chars.includes('colicky') || chars.includes('crampy_colic') || chars.includes('colicky_crampy')))) {
    redFlags.push({
      key: 'obstruction',
      textTh: obst?.isComplete
        ? 'ไม่ถ่ายอุจจาระและไม่ผายลมเลย (Complete Bowel Obstruction)'
        : 'สงสัยลำไส้อุดตัน (อุจจาระเป็นน้ำไหลซึม/อาเจียนกลิ่นอุจจาระ)',
      risk: 'เสี่ยงภาวะลำไส้อุดตันเฉียบพลัน / ลำไส้ขาดเลือด (Mechanical Bowel Obstruction / Strangulation)'
    });
  }
  if (patient.abdpain_rf_fever) {
    redFlags.push({
      key: 'fever_acute_abdomen',
      textTh: 'มีไข้สูง หนาวสั่นร่วมกับปวดท้อง (High Fever with Acute Abdomen)',
      risk: 'เสี่ยงการติดเชื้อรุนแรงในช่องท้อง (Acute Cholangitis / Intra-abdominal Sepsis / Peritonitis)'
    });
  } else if (patient.abdpain_jaundice && (locs.includes('ruq') || locs.includes('epigastrium'))) {
    redFlags.push({
      key: 'acute_cholangitis',
      textTh: 'ตาเหลือง/ตัวเหลืองร่วมกับปวดใต้ลิ้นปี่หรือชายโครงขวา (Suspected Biliary Obstruction / Cholangitis)',
      risk: 'เสี่ยงภาวะท่อน้ำดีอุดตันหรือท่อน้ำดีอักเสบเฉียบพลัน'
    });
  }
  if (patient.gender === 'หญิง' && (patient.abdpain_gyn_bleeding || patient.abdpain_lmp_status === 'missed_period' || patient.abdpain_lmp_status === 'pregnant')) {
    redFlags.push({
      key: 'ectopic_pregnancy',
      textTh: 'สตรีวัยเจริญพันธุ์ปวดท้องร่วมกับขาดประจำเดือน/ตั้งครรภ์ หรือเลือดออกทางช่องคลอด (Suspected Ectopic / Obstetric Emergency)',
      risk: 'เสี่ยงภาวะตั้งครรภ์นอกมดลูกแตก ต้องส่งตรวจ UPT และประเมินสัญญาณชีพทันที'
    });
  }
  if (locs.includes('rlq') && patient.abdpain_rlq_migration && patient.abdpain_rlq_jarring) {
    redFlags.push({
      key: 'acute_appendicitis',
      textTh: 'ปวดท้องน้อยขวา มี Pain Migration และ Jarring Pain ชัดเจน (Classic Appendicitis)',
      risk: 'เสี่ยงไส้ติ่งอักเสบเฉียบพลัน (Acute Appendicitis) เสี่ยงต่อการแตกทะลุ ต้องปรึกษาศัลยแพทย์'
    });
  }
  if (factors.includes('jarring_movement') && (patient.abdpainOnsetMode === 'sudden_severe' || chars.includes('sharp_stabbing'))) {
    redFlags.push({
      key: 'peritonitis',
      textTh: 'ปวดท้องรุนแรงฉับพลัน ขยับตัว/ไอแล้วเจ็บสะท้านท้อง (Peritoneal Irritation / Suspected Perforation)',
      risk: 'เสี่ยงภาวะอวัยวะกลวงทะลุหรือเยื่อบุช่องท้องอักเสบ (Hollow Viscus Perforation / Peritonitis)'
    });
  }
  if (patient.abdpain_rf_chest_dyspnea && !hasChestCardio) {
    redFlags.push({
      key: 'cardiopulmonary_warning',
      textTh: 'แน่นหน้าอก หรือหายใจเหนื่อยหอบร่วมกับปวดท้อง (Cardiopulmonary Warning)',
      risk: 'เสี่ยงภาวะหัวใจขาดเลือด หรือภาวะวิกฤตทางเดินหายใจ/ไหลเวียนโลหิต'
    });
  }
  if (patient.abdpain_rf_syncope && !redFlags.some(r => r.key === 'shock_collapse')) {
    redFlags.push({
      key: 'syncope',
      textTh: 'หน้ามืด วูบ หรือจะเป็นลม (Syncope / Orthostatic Hypotension)',
      risk: 'เสี่ยงภาวะความดันโลหิตตกเฉียบพลันจากภาวะขาดน้ำหรือเสียเลือด'
    });
  }
  return redFlags;
}

function updateAbdominalPainOutputs(patient) {
  const durationText = patient.durationVal ? `${patient.durationVal} ${ABD_LABELS.units[patient.durationUnit] || 'ชั่วโมง'}` : 'ไม่ระบุ';
  const onsetBase = ABD_LABELS.onset[patient.abdpainOnsetMode] || '';
  const onsetSub = ABD_LABELS.intermittentBaseline[patient.abdpainIntermittentBaseline] || '';
  const onsetStr = onsetBase ? (onsetSub ? `${onsetBase} (${onsetSub})` : onsetBase) : 'ไม่ได้ระบุ';

  const charsStr = (patient.abdpainChars?.length > 0)
    ? patient.abdpainChars.map(c => ABD_LABELS.chars[c] || c).join(', ')
    : 'ไม่ได้ระบุ';
  const locsStr = (patient.abdpainLocs?.length > 0)
    ? patient.abdpainLocs.map(l => ABD_LABELS.locs[l] || l).join(', ')
    : 'ไม่ได้ระบุ';

  const radsRaw = Array.isArray(patient.abdpainRads) ? patient.abdpainRads : [];
  const radsStr = radsRaw.length > 0
    ? radsRaw.map(r => ABD_LABELS.rads[r] || r).join(', ')
    : 'ไม่ได้ระบุ';

  const factorsRaw = Array.isArray(patient.abdpainFactors) ? patient.abdpainFactors : [];
  const factorsStr = factorsRaw.length > 0
    ? factorsRaw.map(f => ABD_LABELS.factors[f] || f).join(', ')
    : (patient.abdpain_factor_none ? 'ไม่มีปัจจัยกระตุ้น/บรรเทาชัดเจน' : 'ไม่ได้ระบุ');

  const painScoreText = (patient.abdpainPainScore !== undefined && patient.abdpainPainScore !== null)
    ? `${patient.abdpainPainScore}/10`
    : 'ไม่ได้ระบุ';

  const positives = [];
  const negatives = [];

  if (radsRaw.includes('none')) negatives.push('ไม่ปวดร้าวไปที่อื่น');
  if (patient.abdpain_factor_none) negatives.push('ไม่มีปัจจัยกระตุ้นหรือบรรเทาชัดเจน');

  // --- GI Section (Zero Default Bias) ---
  const hasVomitChk = Boolean(patient.abdpain_gi_vomit) || patient.abdpain_vomit_status === 'vomiting' || patient.abdpain_vomit_status === 'nausea_only';
  const hasDiarrheaChk = Boolean(patient.abdpain_gi_diarrhea) || patient.abdpain_stool_status === 'diarrhea';
  const obstInfo = resolveAbdpainObstipationInfo(patient);
  const hasAnorexia = Boolean(patient.abdpain_gi_anorexia) || patient.abdpain_anorexia === 'loss_appetite';
  const hasHemate = Boolean(patient.abdpain_rf_hematemesis);
  const hasMelena = Boolean(patient.abdpain_rf_melena) || patient.abdpain_stool_status === 'melena_bloody';
  const hasDistension = Boolean(patient.abdpain_gi_distension);
  const hasJaundice = Boolean(patient.abdpain_jaundice);

  const giAnswered = Boolean(
    patient.abdpain_gi_none || hasVomitChk || hasDiarrheaChk || obstInfo || hasAnorexia ||
    hasHemate || hasMelena || hasDistension || hasJaundice ||
    (patient.abdpain_vomit_status && patient.abdpain_vomit_status !== 'unspecified') ||
    (patient.abdpain_stool_status && patient.abdpain_stool_status !== 'unspecified') ||
    (patient.abdpain_anorexia && patient.abdpain_anorexia !== 'unspecified')
  );

  if (giAnswered) {
    const vContents = Array.isArray(patient.abdpain_vomit_contents) ? patient.abdpain_vomit_contents : [];
    const isNauseaOnly = Boolean(patient.abdpain_vomit_nausea_only) || patient.abdpain_vomit_status === 'nausea_only';
    if (isNauseaOnly && !hasHemate) {
      positives.push('มีอาการคลื่นไส้ ยังไม่อาเจียน');
    } else if (hasVomitChk || hasHemate) {
      const vTxt = vContents.map(c => ABD_LABELS.vomitContents[c] || c).join(', ');
      const freqTxt = patient.abdpainVomitFreq ? ` ${patient.abdpainVomitFreq} ครั้ง/วัน` : '';
      const detailTxt = vTxt ? ` (${vTxt})` : '';
      if (hasHemate && vContents.length === 0) positives.push(`อาเจียนเป็นเลือด / สีกาแฟ${freqTxt}`);
      else if (hasVomitChk || vTxt) positives.push(`คลื่นไส้ / อาเจียน${freqTxt}${detailTxt}`);
    } else {
      negatives.push('ปฏิเสธคลื่นไส้อาเจียน');
    }

    if (hasDiarrheaChk) {
      positives.push(`ถ่ายเหลว / ท้องเสีย${patient.abdpainDiarrheaFreq ? ` ${patient.abdpainDiarrheaFreq} ครั้ง/วัน` : ''}`);
    }
    if (obstInfo) positives.push(obstInfo.text);
    if (!hasDiarrheaChk && !obstInfo && !hasMelena) negatives.push('การขับถ่ายอุจจาระปกติ');

    if (hasAnorexia) positives.push('เบื่ออาหาร ทานไม่ได้');
    else if (patient.abdpain_anorexia === 'normal' || patient.abdpain_gi_none) negatives.push('รับประทานอาหารได้ปกติ');

    if (hasMelena) positives.push('ถ่ายปนเลือด หรือดำเหนียว (เหมือนยางมะตอย)');
    else negatives.push('ปฏิเสธถ่ายดำหรือถ่ายปนเลือด');

    if (hasDistension) positives.push('ท้องอืดตึง แน่นท้องมาก');
    if (hasJaundice) positives.push('ตาเหลือง / ตัวเหลือง');
    else negatives.push('ไม่มีตาเหลืองตัวเหลือง');
  }

  // --- Anatomical Branches (RLQ / RUQ-Epigastrium) ---
  if (patient.abdpainLocs?.includes('rlq') || patient.abdpain_rlq_migration || patient.abdpain_rlq_jarring) {
    if (patient.abdpain_rlq_migration) positives.push('ปวดย้ายที่จากรอบสะดือ/ลิ้นปี่ มาที่ท้องน้อยขวา (Pain Migration)');
    else negatives.push('ไม่มีประวัติปวดย้ายที่');
    if (patient.abdpain_rlq_jarring) positives.push('เดินลงส้นเท้า / ไอแล้วเจ็บสะท้านท้องน้อยขวา (Jarring Sign)');
    else negatives.push('ไม่มีเจ็บสะท้านท้องน้อยขวาเวลาเดิน/ไอ');
  }
  if (patient.abdpainLocs?.includes('epigastrium') || patient.abdpainLocs?.includes('ruq') || patient.abdpain_epi_fatty_meal || patient.abdpain_epi_gallstone_alcohol) {
    if (patient.abdpain_epi_fatty_meal) positives.push('ปวดจุกแน่นมากขึ้นหลังทานอาหารมื้อใหญ่/ของมัน');
    if (patient.abdpain_epi_gallstone_alcohol) positives.push('มีประวัติเคยตรวจพบนิ่วในถุงน้ำดี');
  }

  // --- GU Section (Zero Default Bias) ---
  const hasDysuria = Boolean(patient.abdpain_supra_dysuria);
  const hasHematuria = Boolean(patient.abdpain_flank_hematuria);
  const hasOliguria = Boolean(patient.abdpain_gu_oliguria);
  const hasFlankRestless = Boolean(patient.abdpain_flank_restless);
  const guAnswered = Boolean(patient.abdpain_gu_none || hasDysuria || hasHematuria || hasOliguria || hasFlankRestless);
  if (guAnswered) {
    if (hasDysuria) positives.push('ปัสสาวะแสบขัด / กะปริดกะปรอย');
    else negatives.push('ไม่มีปัสสาวะแสบขัด');
    if (hasHematuria) positives.push('ปัสสาวะสีแดง / มีเลือดปน');
    else negatives.push('ปัสสาวะไม่มีเลือดปน');
    if (hasOliguria) positives.push('ปัสสาวะไม่ออก / ออกน้อยมาก');
    if (hasFlankRestless) positives.push('ปวดบิดบั้นเอวรุนแรง นอนนิ่งไม่ได้');
  }

  // --- Circulatory / Fever Warning Section (Zero Default Bias) ---
  const hasSyncope = Boolean(patient.abdpain_rf_syncope);
  const hasShock = Boolean(patient.abdpain_rf_shock);
  const hasFever = Boolean(patient.abdpain_rf_fever);
  const hasChestDyspnea = Boolean(patient.abdpain_rf_chest_dyspnea);
  const sysAnswered = Boolean(patient.abdpain_sys_none || hasSyncope || hasShock || hasFever || hasChestDyspnea);
  if (sysAnswered) {
    if (hasSyncope) positives.push('หน้ามืด / วูบ / จะเป็นลม');
    else negatives.push('ปฏิเสธหน้ามืดวูบเป็นลม');
    if (hasShock) positives.push('เหงื่อแตก ตัวเย็น ซีดเพลีย');
    else negatives.push('ปฏิเสธเหงื่อแตกตัวเย็น');
    if (hasFever) positives.push('มีไข้สูง / หนาวสั่น');
    else negatives.push('ไม่มีไข้สูงหนาวสั่น');
    if (hasChestDyspnea) positives.push('แน่นหน้าอก / หายใจเหนื่อยหอบ');
    else negatives.push('ปฏิเสธแน่นหน้าอก/หอบเหนื่อย');
  }

  // --- Female Section (Zero Default Bias, Gender-Guarded per C-AP13) ---
  const femaleSummaryStr = buildAbdpainFemaleSummary(patient);
  const gynAnswered = patient.gender === 'หญิง' && Boolean(patient.abdpain_gyn_none || patient.abdpain_gyn_bleeding || patient.abdpain_gyn_discharge);
  if (gynAnswered) {
    if (patient.abdpain_gyn_bleeding) positives.push('มีเลือดออกกะปริดกะปรอยทางช่องคลอดผิดปกติ');
    else negatives.push('ไม่มีเลือดออกทางช่องคลอดผิดปกติ');
    if (patient.abdpain_gyn_discharge) positives.push('มีตกขาวผิดปกติ สีเหลืองเขียว / มีกลิ่นเหม็น');
    else negatives.push('ไม่มีตกขาวผิดปกติ');
  }

  if (patient.otherSymptomsFree) positives.push(patient.otherSymptomsFree);

  patient.pertinentPositives = positives.length > 0 ? positives : ['ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม'];
  patient.pertinentNegatives = negatives.length > 0 ? negatives : ['ผู้ป่วยไม่ได้ระบุคำตอบยืนยันในหมวดอาการร่วม'];

  // --- Past Medical History, Surgery, Med Risk & Alcohol ---
  const rfs = evaluateAbdpainRedFlags(patient);
  patient.redFlags = rfs;

  const hasSurgYes = Boolean(patient.abdpain_risk_surgery) || patient.abdpain_surgery_status === 'yes';
  const hasRiskNsaids = Boolean(patient.abdpain_med_nsaids);
  const hasRiskSteroids = Boolean(patient.abdpain_med_steroids);
  const hasRiskAnti = Boolean(patient.abdpain_med_anticoagulants);
  const hasRiskAlc = Boolean(patient.abdpain_risk_alcohol) || (patient.abdpain_alcohol && patient.abdpain_alcohol !== 'none' && patient.abdpain_alcohol !== 'unspecified');
  const hasRiskGerd = Boolean(patient.abdpain_risk_gerd_pud);
  const hasRiskMedUnsure = Boolean(patient.abdpain_risk_med_unsure);
  const anyRiskTick = Boolean(
    patient.abdpain_risk_none || hasSurgYes || hasRiskNsaids || hasRiskSteroids || hasRiskAnti ||
    hasRiskAlc || hasRiskGerd || hasRiskMedUnsure ||
    patient.abdpain_surgery_status === 'no' || patient.abdpain_alcohol === 'none'
  );

  const surgeryText = hasSurgYes
    ? (patient.abdpainSurgeryDetail || 'เคยผ่าตัดในช่องท้อง / ผ่าคลอด (ไม่ได้ระบุชนิด)')
    : (anyRiskTick ? 'ปฏิเสธ' : 'ไม่ได้ระบุ');

  const riskMedList = [];
  if (hasRiskNsaids || hasRiskSteroids) riskMedList.push('NSAIDs / ยาชุด / สเตียรอยด์');
  if (hasRiskAnti) riskMedList.push('ยาละลายลิ่มเลือด / ต้านเกล็ดเลือด');
  if (hasRiskGerd) riskMedList.push('เคยเป็นโรคกระเพาะ / กรดไหลย้อน');
  if (hasRiskMedUnsure) riskMedList.push('ไม่แน่ใจชื่อยาที่รับประทาน');
  const riskMedsText = riskMedList.length > 0 ? riskMedList.join(', ') : (anyRiskTick ? 'ไม่มี' : 'ไม่ได้ระบุ');

  const alcoholText = hasRiskAlc
    ? (ABD_LABELS.alcohol[patient.abdpain_alcohol] || 'ดื่มสุราประจำ หรือดื่มหนักก่อนปวด')
    : (anyRiskTick ? 'ไม่ดื่มแอลกอฮอล์' : 'ไม่ได้ระบุ');

  const hospLabel = ABD_LABELS.hospStatus[patient.hospRecordStatus] || 'ไม่ได้ระบุ';
  const docNotes = patient.doctor_notes || {};
  const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ') ? 'ไม่ได้ระบุ' : patient.currentMeds;
  const udExplicitDeny = Array.isArray(patient.underlying) && patient.underlying.some(u => u && (u.includes('ปฏิเสธ') || u === 'ไม่มี' || u === 'ไม่มีโรคประจำตัว'));
  const udArr = Array.isArray(patient.underlying) ? patient.underlying.filter(u => u && !u.includes('ปฏิเสธ') && u !== 'ไม่มี' && u !== 'ไม่มีโรคประจำตัว') : [];
  const udText = udArr.length > 0 ? udArr.join(', ') : ((patient.hospRecordStatus === 'self' || patient.hospRecordStatus === 'additional' || udExplicitDeny) ? 'ปฏิเสธ' : 'ไม่ได้ระบุ');
  const allergyText = (!patient.drugAllergy || patient.drugAllergy === 'ไม่ได้ระบุ')
    ? 'ไม่ได้ระบุ'
    : ((patient.drugAllergy.includes('ปฏิเสธ') || patient.drugAllergy === 'ไม่มี') ? 'ปฏิเสธ' : patient.drugAllergy);

  const femaleLine = (patient.gender === 'หญิง' && femaleSummaryStr) ? `\n• ประวัติสตรี: ${femaleSummaryStr}` : '';

  const defaultRapid =
`[Chief Complaint (CC)]
ปวดท้อง (Abdominal pain) มา ${durationText}

[History of Present Illness (HPI)]
• การเริ่มต้นและระยะเวลา: ปวดมา ${durationText}, การเริ่ม: ${onsetStr}
• ลักษณะอาการปวด: ${charsStr}
• ตำแหน่งปวด: ${locsStr}
• อาการปวดร้าว: ${radsStr}
• ระดับความปวด (Pain Score): ${painScoreText}
• ปัจจัยกระตุ้น/บรรเทา: ${factorsStr}${femaleLine}

• Pertinent Positives:
${patient.pertinentPositives.map(p => `  - ${p}`).join('\n')}

• Pertinent Negatives:
${patient.pertinentNegatives.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• ประวัติผ่าตัดช่องท้อง: ${surgeryText}
• ปัจจัยเสี่ยงยา/โรคกระเพาะ: ${riskMedsText}
• ประวัติดื่มสุรา: ${alcoholText}
• โรคประจำตัว (U/D): ${udText}
• ยาประจำตัว (Current Meds): ${medsText}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${allergyText}

[Emergency Risk Assessment (Red Flags)]
${rfs.length > 0
  ? `🚩 RED FLAGS DETECTED:\n${rfs.map(rf => `  * ${rf.textTh}`).join('\n')}`
  : '✓ ไม่พบสัญญาณวิกฤต (No Immediate Red Flag)'}

[Doctor's Clinical Addendum & Exam]
• ประวัติเพิ่มเติม/แก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}
• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}
• แผนการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

  const defaultNarrative =
`ผู้ป่วย [${patient.name || 'ไม่ระบุชื่อ'}] อายุ ${patient.age || '-'} ปี เพศ ${patient.gender || 'ไม่ระบุ'} มารับการตรวจที่ห้องฉุกเฉิน รพ.ราชบุรี ด้วยอาการปวดท้องมา ${durationText}
การเริ่มปวด: ${onsetStr}, ตำแหน่งปวด: ${locsStr}, ลักษณะปวด: ${charsStr}, ปวดร้าว: ${radsStr}, Pain Score: ${painScoreText}, ปัจจัยร่วม: ${factorsStr}${(patient.gender === 'หญิง' && femaleSummaryStr) ? `, ประวัติสตรี: ${femaleSummaryStr}` : ''}
อาการร่วมที่พบ: ${patient.pertinentPositives.join(', ')}
อาการสำคัญที่ปฏิเสธ: ${patient.pertinentNegatives.join(', ')}
ประวัติสุขภาพและความเสี่ยง: [${hospLabel}] ผ่าตัดช่องท้อง: ${surgeryText}, ความเสี่ยงยา/โรคกระเพาะ: ${riskMedsText}, ดื่มสุรา: ${alcoholText}, โรคประจำตัว: ${udText}, ยาประจำตัว: ${medsText}, แพ้ยา: ${allergyText}
${rfs.length > 0 ? `[🚩 แจ้งเตือนสัญญาณวิกฤต (Red Flags)]: ${rfs.map(rf => rf.textTh).join('; ')}` : ''}

[บันทึกการตรวจและการประเมินโดยแพทย์]:
${docNotes.additional_hpi ? `• ประวัติเพิ่มเติม: ${docNotes.additional_hpi}\n` : ''}${docNotes.physical_exam ? `• การตรวจร่างกาย: ${docNotes.physical_exam}\n` : ''}${docNotes.preliminary_dx ? `• การวินิจฉัย: ${docNotes.preliminary_dx}\n` : ''}${docNotes.plan ? `• แผนการรักษา: ${docNotes.plan}` : ''}`;

  const rapidEl = document.getElementById('rapidTextView');
  const narEl = document.getElementById('narrativeTextView');
  if (rapidEl) rapidEl.value = patient.custom_rapid_note || defaultRapid;
  if (narEl) narEl.value = patient.custom_narrative_note || defaultNarrative;

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
      "triage_urgency_flag": rfs.length > 0,
      "red_flags_count": rfs.length,
      "hospital_record_status": patient.hospRecordStatus || 'unspecified'
    },
    "chief_complaint": "abdominal_pain",
    "abdominal_pain_profile": {
      "duration_value": patient.durationVal || null,
      "duration_unit": patient.durationVal ? (patient.durationUnit || 'hours') : null,
      "pain_score": (patient.abdpainPainScore !== undefined && patient.abdpainPainScore !== null) ? patient.abdpainPainScore : null,
      "onset_mode": patient.abdpainOnsetMode || null,
      "intermittent_baseline": patient.abdpainIntermittentBaseline || null,
      "pain_characteristics": patient.abdpainChars || [],
      "pain_locations": patient.abdpainLocs || [],
      "pain_radiation": radsRaw,
      "aggravating_and_relieving_factors": factorsRaw
    },
    "associated_symptoms": {
      "gi_and_bowel": {
        "answered_none": Boolean(patient.abdpain_gi_none),
        "nausea_vomiting": Boolean(hasVomitChk),
        "nausea_only": Boolean(patient.abdpain_vomit_nausea_only || patient.abdpain_vomit_status === 'nausea_only'),
        "vomit_frequency_per_day": patient.abdpainVomitFreq || 0,
        "vomit_contents": patient.abdpain_vomit_contents || [],
        "diarrhea": Boolean(hasDiarrheaChk),
        "diarrhea_frequency_per_day": patient.abdpainDiarrheaFreq || 0,
        "constipation_obstipation": obstInfo ? obstInfo.text : null,
        "constipation_days": patient.abdpainConstipationDays || null,
        "obstipation_type": patient.abdpain_obstipation_type || null,
        "anorexia": Boolean(hasAnorexia),
        "hematemesis": Boolean(hasHemate),
        "melena_hematochezia": Boolean(hasMelena),
        "abdominal_distension": Boolean(hasDistension),
        "jaundice": Boolean(hasJaundice)
      },
      "genitourinary": {
        "answered_none": Boolean(patient.abdpain_gu_none),
        "dysuria": Boolean(hasDysuria),
        "gross_hematuria": Boolean(hasHematuria),
        "oliguria_retention": Boolean(hasOliguria),
        "flank_renal_colic": Boolean(hasFlankRestless)
      },
      "circulatory_and_fever_warnings": {
        "answered_none": Boolean(patient.abdpain_sys_none),
        "syncope_presyncope": Boolean(hasSyncope),
        "shock_diaphoresis": Boolean(hasShock),
        "high_fever_chills": Boolean(hasFever),
        "chest_pain_dyspnea": Boolean(hasChestDyspnea)
      },
      "anatomical_branches": {
        "rlq_migration": Boolean(patient.abdpain_rlq_migration),
        "rlq_jarring": Boolean(patient.abdpain_rlq_jarring),
        "epi_postprandial_fatty": Boolean(patient.abdpain_epi_fatty_meal),
        "epi_hx_gallstone": Boolean(patient.abdpain_epi_gallstone_alcohol)
      },
      "female_reproductive": patient.gender === 'หญิง' ? {
        "lmp_status": patient.abdpain_lmp_status || null,
        "lmp_approx": patient.abdpain_lmp_approx || null,
        "lmp_date": (typeof formatDateDdMmYyyy === 'function' ? formatDateDdMmYyyy(patient.abdpainLmpDate) : patient.abdpainLmpDate) || null,
        "pregnancy_weeks": patient.abdpainPregnancyWeeks || null,
        "gyn_answered_none": Boolean(patient.abdpain_gyn_none),
        "abnormal_vaginal_bleeding": Boolean(patient.abdpain_gyn_bleeding),
        "abnormal_vaginal_discharge": Boolean(patient.abdpain_gyn_discharge)
      } : null
    },
    "surgical_and_medication_risks": {
      "answered_none": Boolean(patient.abdpain_risk_none),
      "prior_abdominal_surgery": Boolean(hasSurgYes),
      "surgery_detail": patient.abdpainSurgeryDetail || null,
      "nsaids_steroids": Boolean(hasRiskNsaids || hasRiskSteroids),
      "anticoagulants_antiplatelets": Boolean(hasRiskAnti),
      "alcohol_heavy_or_regular": Boolean(hasRiskAlc),
      "hx_peptic_ulcer_gerd": Boolean(hasRiskGerd),
      "unsure_medication_names": Boolean(hasRiskMedUnsure),
      "other_symptoms_free_text": patient.otherSymptomsFree || ''
    },
    "red_flags_detected": rfs.map(rf => ({ code: rf.key, label: rf.textTh, clinical_risk: rf.risk })),
    "pertinent_positives": patient.pertinentPositives,
    "pertinent_negatives": patient.pertinentNegatives,
    "patient_background": {
      "hospital_record_status": patient.hospRecordStatus || 'unspecified',
      "underlying_diseases": patient.underlying || [],
      "drug_and_food_allergies": patient.drugAllergy || 'ไม่ได้ระบุ',
      "current_medications": patient.currentMeds || 'ไม่ได้ระบุ'
    },
    "doctor_clinical_addendum": {
      "additional_or_corrected_history": docNotes.additional_hpi || '',
      "vitals_and_physical_exam": docNotes.physical_exam || '',
      "provisional_diagnosis": docNotes.preliminary_dx || '',
      "treatment_plan": docNotes.plan || ''
    }
  };

  const jsonEl = document.getElementById('jsonViewer');
  if (jsonEl) jsonEl.textContent = JSON.stringify(jsonPayload, null, 2);
}

// --- Compact UI Builders (3-Card Layout + Thai Word-Boundary Wrap Guard + C-AP1 Compliant) ---
function abdWrap(...chunks) {
  return chunks.map(c => `<span class="inline-block whitespace-nowrap">${c}</span>`).join(' ');
}

function renderAbdOpt(opt) {
  const kind = opt.kind || 'checkbox';
  const padCls = opt.compact ? 'p-2.5' : 'p-3';
  const bgCls = opt.bgWhite ? 'bg-white ' : '';
  const iconSz = opt.compact ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const txtCls = opt.compact ? 'font-medium text-xs' : 'font-semibold text-xs';
  const spanCls = opt.spanClass ? ` ${opt.spanClass}` : '';
  const idAttr = opt.id ? `id="${opt.id}"` : '';
  const nameAttr = opt.name ? `name="${opt.name}"` : '';
  const valAttr = opt.value ? `value="${opt.value}"` : '';
  const chgAttr = opt.onchange ? `onchange="${opt.onchange}"` : '';
  return `<label class="selectable-card ${bgCls}flex items-center ${padCls} rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition${spanCls}"><input type="${kind}" ${idAttr} ${nameAttr} ${valAttr} ${chgAttr} class="text-medical-600 focus:ring-medical-500 ${iconSz} rounded flex-shrink-0"><span class="ml-3 ${txtCls} text-slate-800 leading-snug">${opt.title}</span></label>`;
}

function renderAbdGrid(colsClass, options) {
  return `<div class="grid ${colsClass} gap-2">${options.map(renderAbdOpt).join('\n        ')}</div>`;
}

function renderAbdSysHeader(icon, colorClass, title, noneId, noneHandler, noneText = 'ไม่มีอาการในหมวดนี้') {
  return `<div class="flex items-center justify-between gap-2 pb-2 mb-2.5 border-b border-slate-100">
    <h3 class="text-xs sm:text-sm font-bold text-slate-800 flex items-center">
      <i data-lucide="${icon}" class="w-4 h-4 ${colorClass} mr-1.5 flex-shrink-0"></i>${title}
    </h3>
    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-lg border border-slate-200 hover:border-medical-300 bg-slate-50 cursor-pointer transition flex-shrink-0">
      <input type="checkbox" id="${noneId}" onchange="${noneHandler}" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded flex-shrink-0">
      <span class="ml-3 text-[11px] font-medium text-slate-600 whitespace-nowrap">${noneText}</span>
    </label>
  </div>`;
}

// --- Patient Form HTML Templates (3 Balanced Cards) ---
const ABD_CARD1_HTML = `
<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
  <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
    <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="clock" class="w-5 h-5"></i></div>
    <div>
      <h2 class="text-base font-bold text-slate-900">1. ระยะเวลา ลักษณะ และตำแหน่งที่ปวดท้อง</h2>
      <p class="text-xs text-slate-500">ข้อมูลสำคัญเกี่ยวกับอาการปวดท้องของท่าน</p>
    </div>
  </div>
  <div class="space-y-5">
    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">ปวดท้องมานานเท่าไรแล้ว? <span class="text-rose-500">*</span></label>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div class="col-span-1 sm:col-span-2">
          <input type="number" id="abdpainDurationVal" min="1" max="1000" placeholder="เช่น 4" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm placeholder:text-slate-400 placeholder:font-normal">
        </div>
        <div class="col-span-1">
          <select id="abdpainDurationUnit" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm">
            <option value="minutes">นาที</option>
            <option value="hours" selected>ชั่วโมง</option>
            <option value="days">วัน</option>
            <option value="weeks">สัปดาห์</option>
            <option value="months">เดือน</option>
            <option value="years">ปี</option>
          </select>
        </div>
      </div>
    </div>

    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">ลักษณะการเริ่มต้นของอาการปวด</label>
      ${renderAbdGrid('grid-cols-1 sm:grid-cols-3', [
        { kind: 'radio', name: 'abdpainOnsetMode', value: 'sudden_severe', onchange: 'handleAbdpainOnsetChange()', title: abdWrap('ปวดรุนแรง', 'เฉียบพลันทันที') },
        { kind: 'radio', name: 'abdpainOnsetMode', value: 'gradual_worsening', onchange: 'handleAbdpainOnsetChange()', title: abdWrap('ค่อยๆ ปวดมากขึ้น', 'เรื่อยๆ') },
        { kind: 'radio', name: 'abdpainOnsetMode', value: 'intermittent_cramps', onchange: 'handleAbdpainOnsetChange()', title: abdWrap('ปวดเป็นพักๆ', 'เป็นๆ หายๆ') }
      ])}
      <div id="abdpain_onset_intermittent_branch" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-2.5 space-y-2">
        <label class="block text-xs font-semibold text-slate-700">ช่วงเว้นจากอาการปวด มีอาการอย่างไร?</label>
        ${renderAbdGrid('grid-cols-1 sm:grid-cols-2', [
          { kind: 'radio', name: 'abdpainIntermittentBaseline', value: 'pain_free', title: abdWrap('หายสนิท ไม่ปวดเลย'), compact: true, bgWhite: true },
          { kind: 'radio', name: 'abdpainIntermittentBaseline', value: 'improved_persistent', title: abdWrap('ทุเลาลง แต่ยังปวดอยู่ตลอด'), compact: true, bgWhite: true }
        ])}
      </div>
    </div>

    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">ตำแหน่งที่ปวดชัดเจนที่สุดในขณะนี้ (เลือกได้หลายจุด) <span class="text-rose-500">*</span></label>
      ${renderAbdGrid('grid-cols-2 sm:grid-cols-4', [
        { name: 'abdpain_loc', value: 'epigastrium', onchange: 'handleAbdpainLocationChange()', title: abdWrap('ใต้ลิ้นปี่') },
        { name: 'abdpain_loc', value: 'ruq', onchange: 'handleAbdpainLocationChange()', title: abdWrap('ชายโครงขวา') },
        { name: 'abdpain_loc', value: 'luq', onchange: 'handleAbdpainLocationChange()', title: abdWrap('ชายโครงซ้าย') },
        { name: 'abdpain_loc', value: 'periumbilical', onchange: 'handleAbdpainLocationChange()', title: abdWrap('รอบสะดือ') },
        { name: 'abdpain_loc', value: 'rlq', onchange: 'handleAbdpainLocationChange()', title: abdWrap('ท้องน้อยขวา') },
        { name: 'abdpain_loc', value: 'llq', onchange: 'handleAbdpainLocationChange()', title: abdWrap('ท้องน้อยซ้าย') },
        { name: 'abdpain_loc', value: 'suprapubic', onchange: 'handleAbdpainLocationChange()', title: abdWrap('ท้องน้อยตรงกลาง /', 'หัวหน่าว') },
        { name: 'abdpain_loc', value: 'diffuse', onchange: 'handleAbdpainLocationChange()', title: abdWrap('ทั่วทั้งท้อง') },
        { id: 'abdpain_loc_other_chk', onchange: 'handleAbdpainLocOtherToggle(this.checked)', title: abdWrap('ตำแหน่งอื่นๆ (ระบุ)'), spanClass: 'col-span-2 sm:col-span-4' }
      ])}
      <div id="abdpain_loc_other_wrap" class="hidden mt-2">
        <input type="text" id="abdpain_loc_other_text" placeholder="ระบุตำแหน่งปวดท้องเพิ่มเติม..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white">
      </div>
      <div id="abdpain_branch_rlq" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2.5 space-y-2.5">
        <div class="text-xs font-bold text-slate-800 flex items-center"><i data-lucide="crosshair" class="w-4 h-4 text-medical-600 mr-1.5"></i>คำถามเจาะลึกอาการปวดท้องน้อยขวา</div>
        ${renderAbdGrid('grid-cols-1', [
          { id: 'abdpain_rlq_migration', title: abdWrap('เริ่มปวดรอบสะดือหรือลิ้นปี่', 'แล้วย้ายลงมาปวดที่ท้องน้อยขวา'), compact: true, bgWhite: true },
          { id: 'abdpain_rlq_jarring', title: abdWrap('เดินลงส้นเท้า ไอ หรือนั่งรถสะเทือน', 'แล้วเจ็บสะท้านที่ท้องน้อยขวา'), compact: true, bgWhite: true }
        ])}
      </div>
      <div id="abdpain_branch_epigastric_ruq" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2.5 space-y-2.5">
        <div class="text-xs font-bold text-slate-800 flex items-center"><i data-lucide="utensils" class="w-4 h-4 text-amber-500 mr-1.5"></i>คำถามเจาะลึกอาการปวดใต้ลิ้นปี่ / ชายโครงขวา</div>
        ${renderAbdGrid('grid-cols-1 sm:grid-cols-2', [
          { id: 'abdpain_epi_fatty_meal', title: abdWrap('ปวดจุกแน่นมากขึ้นหลังทานอาหารมื้อใหญ่', 'หรือของมัน / ของทอด'), compact: true, bgWhite: true },
          { id: 'abdpain_epi_gallstone_alcohol', title: abdWrap('เคยตรวจพบนิ่วในถุงน้ำดี'), compact: true, bgWhite: true }
        ])}
      </div>
    </div>

    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">ลักษณะอาการปวด (เลือกได้หลายข้อ)</label>
      ${renderAbdGrid('grid-cols-2 sm:grid-cols-4', [
        { name: 'abdpain_char', value: 'colicky', title: abdWrap('บิดเกร็ง', 'เป็นพักๆ') },
        { name: 'abdpain_char', value: 'burning', title: abdWrap('แสบร้อน /', 'จุกแสบ') },
        { name: 'abdpain_char', value: 'dull', title: abdWrap('ตื้อๆ แน่นๆ', 'หน่วงๆ') },
        { name: 'abdpain_char', value: 'sharp_stabbing', title: abdWrap('เสียดแทง /', 'เหมือนฉีกขาด') }
      ])}
    </div>

    <div>
      <div class="flex items-center justify-between gap-2 mb-2">
        <label class="text-xs font-semibold text-slate-700 uppercase tracking-wider">อาการปวดร้าวไปตำแหน่งอื่น</label>
        <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-lg border border-slate-200 hover:border-medical-300 bg-slate-50 cursor-pointer transition flex-shrink-0">
          <input type="checkbox" id="abdpain_rad_none" onchange="handleAbdpainRadNoneChange(this.checked)" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded flex-shrink-0">
          <span class="ml-3 text-[11px] font-medium text-slate-600 whitespace-nowrap">ไม่ร้าวไปที่อื่น</span>
        </label>
      </div>
      ${renderAbdGrid('grid-cols-2 sm:grid-cols-3', [
        { name: 'abdpain_rad', value: 'back_mid', onchange: 'handleAbdpainRadiationChange()', title: abdWrap('ร้าวทะลุ', 'กลางหลัง') },
        { name: 'abdpain_rad', value: 'back_right', onchange: 'handleAbdpainRadiationChange()', title: abdWrap('ร้าวไปหลังขวา /', 'สะบักขวา') },
        { name: 'abdpain_rad', value: 'back_left', onchange: 'handleAbdpainRadiationChange()', title: abdWrap('ร้าวไปหลังซ้าย /', 'บั้นเอวซ้าย') },
        { name: 'abdpain_rad', value: 'groin_thigh_genitalia', onchange: 'handleAbdpainRadiationChange()', title: abdWrap('ร้าวลงขาหนีบ /', 'อวัยวะเพศ') },
        { name: 'abdpain_rad', value: 'chest', onchange: 'handleAbdpainRadiationChange()', title: abdWrap('ร้าวขึ้นหน้าอก /', 'ลำคอ / กราม') },
        { id: 'abdpain_rad_other_chk', onchange: 'handleAbdpainRadOtherToggle(this.checked)', title: abdWrap('ร้าวไปตำแหน่งอื่น', '(ระบุ)') }
      ])}
      <div id="abdpain_rad_other_wrap" class="hidden mt-2">
        <input type="text" id="abdpain_rad_other_text" placeholder="ระบุตำแหน่งที่ปวดร้าวไปเพิ่มเติม..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white">
      </div>
    </div>

    <div>
      <div class="flex items-center justify-between gap-2 mb-2">
        <label class="text-xs font-semibold text-slate-700 uppercase tracking-wider">สิ่งที่ทำให้ปวดมากขึ้น หรือทุเลาลง</label>
        <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-lg border border-slate-200 hover:border-medical-300 bg-slate-50 cursor-pointer transition flex-shrink-0">
          <input type="checkbox" id="abdpain_factor_none" onchange="handleAbdpainFactorNoneChange(this.checked)" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded flex-shrink-0">
          <span class="ml-3 text-[11px] font-medium text-slate-600 whitespace-nowrap">ไม่มีปัจจัยชัดเจน</span>
        </label>
      </div>
      ${renderAbdGrid('grid-cols-1 sm:grid-cols-2', [
        { name: 'abdpain_factor', value: 'jarring_movement', onchange: 'handleAbdpainFactorChange()', title: abdWrap('ขยับตัว / ไอ / เดินสะเทือน', 'แล้วเจ็บสะท้าน') },
        { name: 'abdpain_factor', value: 'lean_forward_relief', onchange: 'handleAbdpainFactorChange()', title: abdWrap('นอนราบยืดตัวแล้วปวด', 'นั่งหรืองอตัวแล้วดีขึ้น') },
        { name: 'abdpain_factor', value: 'postprandial_worse', onchange: 'handleAbdpainFactorChange()', title: abdWrap('ปวดมากขึ้นหลังทานอาหาร') },
        { name: 'abdpain_factor', value: 'empty_stomach_worse', onchange: 'handleAbdpainFactorChange()', title: abdWrap('ปวดมากขึ้นตอนท้องว่าง') },
        { name: 'abdpain_factor', value: 'antacid_relief', onchange: 'handleAbdpainFactorChange()', title: abdWrap('ทานยาลดกรดแล้วดีขึ้น') },
        { name: 'abdpain_factor', value: 'defecation_relief', onchange: 'handleAbdpainFactorChange()', title: abdWrap('ถ่ายอุจจาระหรือผายลม', 'แล้วดีขึ้น') }
      ])}
    </div>

    <div class="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label class="block text-xs font-semibold text-slate-800 uppercase tracking-wider">ระดับความเจ็บปวดในขณะนี้ (Pain Score: 0 – 10)</label>
        <div class="flex items-center space-x-2">
          <span id="abdpainPainScoreBadge" class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all">
            <span id="abdpainPainScoreEmoji" class="text-base">⚪</span>
            <span id="abdpainPainScoreText">ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)</span>
          </span>
          <button type="button" id="abdpainPainScoreClearBtn" onclick="clearAbdpainPainScore()" class="text-xs text-slate-400 hover:text-rose-600 underline hidden transition" title="ล้างค่าเพื่อให้เป็นไม่ได้ระบุ">ล้างค่า</button>
        </div>
      </div>
      <div class="px-1 pt-1">
        <input type="range" id="abdpainPainScore" min="0" max="10" value="0" step="1" oninput="handleAbdpainPainScoreChange(this.value)" class="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-600 focus:outline-none focus:ring-2 focus:ring-medical-500">
      </div>
      <div class="grid grid-cols-5 text-center text-[10px] sm:text-[11px] pt-1 gap-1 text-slate-500 font-medium">
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setAbdpainPainScore(0)"><span class="text-lg sm:text-xl block">😊</span><span>0: สบายดี</span></div>
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setAbdpainPainScore(2)"><span class="text-lg sm:text-xl block">🙂</span><span>1–3: เล็กน้อย</span></div>
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setAbdpainPainScore(5)"><span class="text-lg sm:text-xl block">😐</span><span>4–6: ปานกลาง</span></div>
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setAbdpainPainScore(8)"><span class="text-lg sm:text-xl block">😣</span><span>7–9: ปวดมาก</span></div>
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setAbdpainPainScore(10)"><span class="text-lg sm:text-xl block">😭</span><span>10: ปวดที่สุด</span></div>
      </div>
    </div>
  </div>
</div>`;

const ABD_CARD2_HTML = `
<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
  <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
    <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="check-square" class="w-5 h-5"></i></div>
    <div>
      <h2 class="text-base font-bold text-slate-900">2. อาการร่วมที่ท่านมี (เลือกอาการที่ตรงกับท่าน)</h2>
      <p class="text-xs text-slate-500">ระบบจะเปิดคำถามเจาะลึกเพิ่มเติมเฉพาะข้อที่ท่านเลือก</p>
    </div>
  </div>
  <div class="space-y-6">
    <div>
      ${renderAbdSysHeader('utensils', 'text-amber-500', 'ระบบทางเดินอาหาร &amp; การขับถ่าย', 'abdpain_gi_none', "handleAbdpainGroupNoneChange('abdpain_gi_none',['abdpain_gi_vomit','abdpain_gi_diarrhea','abdpain_gi_constipation','abdpain_gi_anorexia','abdpain_rf_hematemesis','abdpain_rf_melena','abdpain_gi_distension','abdpain_jaundice'],syncAbdpainGiBranches)")}
      ${renderAbdGrid('grid-cols-2 sm:grid-cols-4', [
        { id: 'abdpain_gi_vomit', onchange: 'syncAbdpainGiBranches()', title: abdWrap('คลื่นไส้ /', 'อาเจียน') },
        { id: 'abdpain_gi_diarrhea', onchange: 'syncAbdpainGiBranches()', title: abdWrap('ถ่ายเหลว /', 'ท้องเสีย') },
        { id: 'abdpain_gi_constipation', onchange: 'syncAbdpainGiBranches()', title: abdWrap('ท้องผูก /', 'ไม่ผายลม') },
        { id: 'abdpain_gi_anorexia', onchange: 'syncAbdpainGiBranches()', title: abdWrap('เบื่ออาหาร', 'ทานไม่ได้') },
        { id: 'abdpain_rf_hematemesis', onchange: 'syncAbdpainGiBranches()', title: abdWrap('อาเจียนเป็นเลือด /', 'สีกาแฟ') },
        { id: 'abdpain_rf_melena', onchange: 'syncAbdpainGiBranches()', title: abdWrap('ถ่ายปนเลือด หรือดำเหนียว', '(เหมือนยางมะตอย)') },
        { id: 'abdpain_gi_distension', onchange: 'syncAbdpainGiBranches()', title: abdWrap('ท้องอืดตึง', 'แน่นท้องมาก') },
        { id: 'abdpain_jaundice', onchange: 'syncAbdpainGiBranches()', title: abdWrap('ตาเหลือง /', 'ตัวเหลือง') }
      ])}

      <div id="abdpain_vomit_detail_wrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2.5 space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center space-x-2">
            <span class="text-xs font-semibold text-slate-700">อาเจียนกี่ครั้ง/วัน:</span>
            <input type="number" id="abdpainVomitFreq" min="1" max="50" placeholder="เช่น 3" class="w-20 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-semibold placeholder:text-slate-400 placeholder:font-normal">
            <span class="text-xs text-slate-500">ครั้ง/วัน</span>
          </div>
          <label class="selectable-card bg-white px-3 py-1.5 rounded-lg border border-slate-200 hover:border-medical-300 flex items-center cursor-pointer">
            <input type="checkbox" id="abdpain_vomit_nausea_only" onchange="handleAbdpainVomitNauseaToggle(this.checked)" class="rounded text-medical-600 h-3.5 w-3.5">
            <span class="ml-3 text-xs font-medium text-slate-700 whitespace-nowrap">คลื่นไส้อย่างเดียว ยังไม่อาเจียน</span>
          </label>
        </div>
        <div id="abdpain_vomit_char_wrap">
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">ลักษณะสิ่งที่อาเจียนออกมา:</label>
          ${renderAbdGrid('grid-cols-2 sm:grid-cols-3', [
            { name: 'abdpain_vomit_content', value: 'food_gastric', title: abdWrap('เศษอาหาร /', 'น้ำย่อยเหลือง'), compact: true, bgWhite: true },
            { name: 'abdpain_vomit_content', value: 'bilious', title: abdWrap('น้ำดีสีเขียว'), compact: true, bgWhite: true },
            { name: 'abdpain_vomit_content', value: 'coffee_ground', title: abdWrap('สีดำคล้าย', 'กากกาแฟ'), compact: true, bgWhite: true },
            { name: 'abdpain_vomit_content', value: 'bloody', title: abdWrap('เลือดสด /', 'ลิ่มเลือด'), compact: true, bgWhite: true },
            { name: 'abdpain_vomit_content', value: 'feculent', title: abdWrap('กลิ่นเหม็นคล้าย', 'อุจจาระ'), compact: true, bgWhite: true }
          ])}
        </div>
      </div>

      <div id="abdpain_diarrhea_freq_wrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-2.5 flex items-center space-x-2">
        <label class="text-xs font-semibold text-slate-700">ถ่ายเหลวประมาณกี่ครั้งต่อวัน?</label>
        <input type="number" id="abdpainDiarrheaFreq" min="1" max="50" placeholder="เช่น 4" class="w-20 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-semibold placeholder:text-slate-400 placeholder:font-normal">
        <span class="text-xs text-slate-500">ครั้ง/วัน</span>
      </div>

      <div id="abdpain_obstipation_wrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2.5 space-y-3">
        <div class="flex flex-wrap items-center gap-2">
          <label class="text-xs font-semibold text-slate-700">ไม่ถ่ายอุจจาระมากี่วันแล้ว?</label>
          <input type="number" id="abdpainConstipationDays" min="1" max="60" placeholder="เช่น 3" class="w-20 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-semibold placeholder:text-slate-400 placeholder:font-normal">
          <span class="text-xs text-slate-500">วัน</span>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">ลักษณะการขับถ่ายและผายลม:</label>
          ${renderAbdGrid('grid-cols-1 sm:grid-cols-3', [
            { kind: 'radio', name: 'abdpain_obstipation_type', value: 'no_stool_no_gas', title: abdWrap('ไม่ถ่ายอุจจาระและ', 'ไม่ผายลมเลย'), compact: true, bgWhite: true },
            { kind: 'radio', name: 'abdpain_obstipation_type', value: 'constipation_with_gas', title: abdWrap('ท้องผูกหลายวัน', 'แต่ยังผายลมได้'), compact: true, bgWhite: true },
            { kind: 'radio', name: 'abdpain_obstipation_type', value: 'overflow_watery_seepage', title: abdWrap('อุจจาระเป็นน้ำ ไหลซึม', 'ออกมาทีละนิด ไม่มีก้อนปน'), compact: true, bgWhite: true }
          ])}
        </div>
      </div>
    </div>

    <div>
      ${renderAbdSysHeader('droplet', 'text-sky-500', 'ระบบทางเดินปัสสาวะ', 'abdpain_gu_none', "handleAbdpainGroupNoneChange('abdpain_gu_none',['abdpain_supra_dysuria','abdpain_flank_hematuria','abdpain_gu_oliguria','abdpain_flank_restless'])")}
      ${renderAbdGrid('grid-cols-2 sm:grid-cols-4', [
        { id: 'abdpain_supra_dysuria', onchange: "handleAbdpainGroupItemChange('abdpain_gu_none','abdpain_supra_dysuria')", title: abdWrap('ปัสสาวะแสบขัด /', 'กะปริดกะปรอย') },
        { id: 'abdpain_flank_hematuria', onchange: "handleAbdpainGroupItemChange('abdpain_gu_none','abdpain_flank_hematuria')", title: abdWrap('ปัสสาวะสีแดง /', 'มีเลือดปน') },
        { id: 'abdpain_gu_oliguria', onchange: "handleAbdpainGroupItemChange('abdpain_gu_none','abdpain_gu_oliguria')", title: abdWrap('ปัสสาวะไม่ออก /', 'ออกน้อยมาก') },
        { id: 'abdpain_flank_restless', onchange: "handleAbdpainGroupItemChange('abdpain_gu_none','abdpain_flank_restless')", title: abdWrap('ปวดบิดบั้นเอวรุนแรง', 'นอนนิ่งไม่ได้') }
      ])}
    </div>

    <div>
      ${renderAbdSysHeader('activity', 'text-rose-500', 'อาการเตือนสำคัญทางระบบไหลเวียนโลหิตและไข้', 'abdpain_sys_none', "handleAbdpainGroupNoneChange('abdpain_sys_none',['abdpain_rf_syncope','abdpain_rf_shock','abdpain_rf_fever','abdpain_rf_chest_dyspnea'])")}
      ${renderAbdGrid('grid-cols-2 sm:grid-cols-4', [
        { id: 'abdpain_rf_syncope', onchange: "handleAbdpainGroupItemChange('abdpain_sys_none','abdpain_rf_syncope')", title: abdWrap('หน้ามืด / วูบ /', 'จะเป็นลม') },
        { id: 'abdpain_rf_shock', onchange: "handleAbdpainGroupItemChange('abdpain_sys_none','abdpain_rf_shock')", title: abdWrap('เหงื่อแตก ตัวเย็น', 'ซีดเพลีย') },
        { id: 'abdpain_rf_fever', onchange: "handleAbdpainGroupItemChange('abdpain_sys_none','abdpain_rf_fever')", title: abdWrap('มีไข้สูง /', 'หนาวสั่น') },
        { id: 'abdpain_rf_chest_dyspnea', onchange: "handleAbdpainGroupItemChange('abdpain_sys_none','abdpain_rf_chest_dyspnea')", title: abdWrap('แน่นหน้าอก /', 'หายใจเหนื่อยหอบ') }
      ])}
    </div>
  </div>
</div>`;

const ABD_CARD3_HTML = `
<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
  <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
    <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="clipboard-list" class="w-5 h-5"></i></div>
    <div>
      <h2 class="text-base font-bold text-slate-900">3. ประวัติผ่าตัดช่องท้อง ยาความเสี่ยง และข้อมูลเพิ่มเติม</h2>
      <p class="text-xs text-slate-500">ปัจจัยเสี่ยงสำคัญและอาการอื่นๆ ที่ต้องการแจ้งแพทย์</p>
    </div>
  </div>
  <div class="space-y-6">
    <div>
      ${renderAbdSysHeader('scissors', 'text-indigo-500', 'ประวัติผ่าตัดช่องท้อง ยาความเสี่ยง และแอลกอฮอล์', 'abdpain_risk_none', "handleAbdpainGroupNoneChange('abdpain_risk_none',['abdpain_risk_surgery','abdpain_med_nsaids','abdpain_med_anticoagulants','abdpain_risk_alcohol','abdpain_risk_gerd_pud','abdpain_risk_med_unsure'],handleAbdpainSurgeryChange)", 'ไม่มีประวัติเสี่ยงในหมวดนี้')}
      ${renderAbdGrid('grid-cols-1 sm:grid-cols-2', [
        { id: 'abdpain_risk_surgery', onchange: 'handleAbdpainSurgeryChange()', title: abdWrap('เคยผ่าตัดในช่องท้อง /', 'ผ่าคลอด') },
        { id: 'abdpain_med_nsaids', onchange: "handleAbdpainGroupItemChange('abdpain_risk_none','abdpain_med_nsaids')", title: abdWrap('ทานยาแก้ปวด NSAIDs / ยาชุด / สเตียรอยด์', '(Ibuprofen, Ponstan, ยาลูกกลอน, ฯลฯ)') },
        { id: 'abdpain_med_anticoagulants', onchange: "handleAbdpainGroupItemChange('abdpain_risk_none','abdpain_med_anticoagulants')", title: abdWrap('ทานยาละลายลิ่มเลือด / ต้านเกล็ดเลือด', '(Warfarin, Aspirin, ฯลฯ)') },
        { id: 'abdpain_risk_alcohol', onchange: "handleAbdpainGroupItemChange('abdpain_risk_none','abdpain_risk_alcohol')", title: abdWrap('ดื่มสุราประจำ หรือ', 'ดื่มหนักก่อนปวด') },
        { id: 'abdpain_risk_gerd_pud', onchange: "handleAbdpainGroupItemChange('abdpain_risk_none','abdpain_risk_gerd_pud')", title: abdWrap('เคยเป็นโรคกระเพาะ /', 'กรดไหลย้อน') },
        { id: 'abdpain_risk_med_unsure', onchange: "handleAbdpainGroupItemChange('abdpain_risk_none','abdpain_risk_med_unsure')", title: abdWrap('ไม่แน่ใจชื่อยาที่รับประทาน') }
      ])}
      <div id="abdpain_surgery_detail_wrap" class="hidden mt-2.5">
        <input type="text" id="abdpainSurgeryDetail" placeholder="ระบุชนิดการผ่าตัด เช่น เคยผ่าไส้ติ่ง, ผ่าคลอดทางหน้าท้อง, ผ่าตัดนิ่วในถุงน้ำดี..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white">
      </div>
    </div>

    <div id="abdpain_branch_female" class="hidden bg-slate-50/70 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
      <h3 class="text-xs sm:text-sm font-bold text-slate-800 flex items-center pb-2 border-b border-slate-200">
        <i data-lucide="heart-pulse" class="w-4 h-4 text-pink-500 mr-1.5"></i>ข้อมูลเพิ่มเติมเฉพาะผู้ป่วยหญิง
      </h3>
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-2">สถานะประจำเดือนและการตั้งครรภ์:</label>
        ${renderAbdGrid('grid-cols-2 sm:grid-cols-3', [
          { kind: 'radio', name: 'abdpain_lmp_status', value: 'exact_date', onchange: "handleAbdpainLmpToggle('exact_date')", title: abdWrap('จำวันแรกของ', 'ประจำเดือนล่าสุดได้'), compact: true, bgWhite: true },
          { kind: 'radio', name: 'abdpain_lmp_status', value: 'approx', onchange: "handleAbdpainLmpToggle('approx')", title: abdWrap('จำวันที่ไม่ได้แน่ชัด', '(เลือกช่วงเวลา)'), compact: true, bgWhite: true },
          { kind: 'radio', name: 'abdpain_lmp_status', value: 'missed_period', onchange: "handleAbdpainLmpToggle('missed_period')", title: abdWrap('ขาดประจำเดือน /', 'สงสัยตั้งครรภ์'), compact: true, bgWhite: true },
          { kind: 'radio', name: 'abdpain_lmp_status', value: 'pregnant', onchange: "handleAbdpainLmpToggle('pregnant')", title: abdWrap('กำลังตั้งครรภ์'), compact: true, bgWhite: true },
          { kind: 'radio', name: 'abdpain_lmp_status', value: 'menopause', onchange: "handleAbdpainLmpToggle('menopause')", title: abdWrap('วัยหมดประจำเดือน /', 'ผ่าตัดมดลูกแล้ว'), compact: true, bgWhite: true },
          { kind: 'radio', name: 'abdpain_lmp_status', value: 'unsure', onchange: "handleAbdpainLmpToggle('unsure')", title: abdWrap('ไม่แน่ใจ'), compact: true, bgWhite: true }
        ])}
        <div id="abdpain_lmp_date_wrap" class="hidden mt-2.5 flex flex-wrap items-center gap-2">
          <span class="text-xs text-slate-600">วันแรกของประจำเดือนล่าสุด:</span>
          <input type="text" id="abdpainLmpDate" data-universal-date="true" placeholder="วว/ดด/ปปปป (dd/mm/yyyy)" class="w-full sm:w-64 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
        </div>
        <div id="abdpain_lmp_approx_wrap" class="hidden mt-2.5">
          ${renderAbdGrid('grid-cols-2 sm:grid-cols-5', [
            { kind: 'radio', name: 'abdpain_lmp_approx', value: '1_week_ago', title: abdWrap('1 สัปดาห์ก่อน'), compact: true, bgWhite: true },
            { kind: 'radio', name: 'abdpain_lmp_approx', value: '2_weeks_ago', title: abdWrap('2 สัปดาห์ก่อน'), compact: true, bgWhite: true },
            { kind: 'radio', name: 'abdpain_lmp_approx', value: '3_4_weeks_ago', title: abdWrap('3–4 สัปดาห์ก่อน'), compact: true, bgWhite: true },
            { kind: 'radio', name: 'abdpain_lmp_approx', value: '1_2_months_ago', title: abdWrap('1–2 เดือนก่อน'), compact: true, bgWhite: true },
            { kind: 'radio', name: 'abdpain_lmp_approx', value: 'gt_2_months_ago', title: abdWrap('มากกว่า 2 เดือน'), compact: true, bgWhite: true }
          ])}
        </div>
        <div id="abdpain_lmp_pregnant_weeks_wrap" class="hidden mt-2.5 flex flex-wrap items-center gap-2">
          <span class="text-xs text-slate-600">อายุครรภ์โดยประมาณ:</span>
          <input type="text" id="abdpainPregnancyWeeks" placeholder="เช่น 8 สัปดาห์" class="w-48 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500">
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between gap-2 mb-2">
          <label class="text-xs font-semibold text-slate-700">อาการทางนรีเวชร่วมด้วย:</label>
          <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-lg border border-slate-200 hover:border-medical-300 bg-white cursor-pointer transition flex-shrink-0">
            <input type="checkbox" id="abdpain_gyn_none" onchange="handleAbdpainGroupNoneChange('abdpain_gyn_none',['abdpain_gyn_bleeding','abdpain_gyn_discharge'])" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded flex-shrink-0">
            <span class="ml-3 text-[11px] font-medium text-slate-600 whitespace-nowrap">ไม่มีอาการทางนรีเวช</span>
          </label>
        </div>
        ${renderAbdGrid('grid-cols-1 sm:grid-cols-2', [
          { id: 'abdpain_gyn_bleeding', onchange: "handleAbdpainGynItemChange('abdpain_gyn_bleeding')", title: abdWrap('มีเลือดออกกะปริดกะปรอย', 'ทางช่องคลอดผิดปกติ'), compact: true, bgWhite: true },
          { id: 'abdpain_gyn_discharge', onchange: "handleAbdpainGynItemChange('abdpain_gyn_discharge')", title: abdWrap('มีตกขาวผิดปกติ สีเหลืองเขียว', 'หรือมีกลิ่นเหม็น'), compact: true, bgWhite: true }
        ])}
      </div>
    </div>

    <div>
      <label class="text-xs sm:text-sm font-bold text-slate-800 flex items-center pb-2 mb-2.5 border-b border-slate-100">
        <i data-lucide="message-square-plus" class="w-4 h-4 text-slate-600 mr-1.5"></i>อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม
      </label>
      <textarea id="abdpain_other_free" rows="2" placeholder="พิมพ์ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี เช่น อ่อนเพลียมาก, วิงเวียนศีรษะ)..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"></textarea>
    </div>
  </div>
</div>`;

const ABD_FORM_HTML = `
<div id="abdpainQuestionnaireSection" class="space-y-6 hidden">
  <div data-cc-top-banner="abdpain"><div class="flex flex-col gap-4">
    <div class="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-2xl flex items-start space-x-3">
      <i data-lucide="alert-triangle" class="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"></i>
      <div class="text-xs text-amber-900 leading-relaxed">
        <strong class="font-bold">ข้อความแจ้งเตือนจุดคัดกรอง:</strong> กรณีผู้ป่วยเป็นเด็กอายุ &lt; 12 ปี ที่มีอาการปวดท้อง กรุณาเลือกอาการสำคัญ <strong>&lt;ปวดท้อง ในเด็กอายุ &lt; 12 ปี&gt;</strong> แทน เพื่อการประเมินภาวะฉุกเฉินในเด็กตามช่วงวัยอย่างเหมาะสม
      </div>
    </div>
    <div class="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-start space-x-3 text-xs text-slate-800 leading-relaxed">
      <i data-lucide="info" class="w-5 h-5 text-medical-600 mt-0.5 flex-shrink-0"></i>
      <div class="space-y-1">
        <p class="font-bold text-slate-900">ข้อแนะนำการปฏิบัติตัวเบื้องต้นระหว่างรอตรวจ:</p>
        <p>1. <strong>งดน้ำและอาหารทุกชนิดชั่วคราว (NPO):</strong> เผื่อกรณีต้องตรวจเอกซเรย์คอมพิวเตอร์ หรือผ่าตัดฉุกเฉิน และงดรับประทานยาแก้ปวดด้วยตนเองก่อนพบแพทย์เพราะอาจบดบังอาการ</p>
        <p>2. <strong>แจ้งพยาบาลหน้าห้องตรวจทันทีหากมีอาการต่อไปนี้:</strong> หน้ามืดคล้ายจะเป็นลม เหงื่อแตกตัวเย็น อาเจียนเป็นเลือด/สีกาแฟ ถ่ายอุจจาระสีดำ/เป็นเลือดสด หรือปวดท้องรุนแรงมากจนทนไม่ไหว</p>
      </div>
    </div>
  </div></div>

  ${ABD_CARD1_HTML}
  ${ABD_CARD2_HTML}
  ${ABD_CARD3_HTML}
</div>`;

// --- Module Registration ---
registerCcModule({
  id: 'abdpain',
  recordCc: 'abdominal_pain',
  titleTh: 'ปวดท้อง',
  titleEn: 'Abdominal pain',
  sectionDomId: 'abdpainQuestionnaireSection',
  pmhSectionNumber: 4,
  getPmhSectionNumber: () => 4,
  doctorCcBadgeHtml: '<i data-lucide="utensils" class="w-3.5 h-3.5 mr-1 text-amber-600"></i> CC: ปวดท้อง (Abdominal pain)',
  dateFields: ['abdpainLmpDate'],
  branchIds: [
    'abdpain_onset_intermittent_branch', 'abdpain_loc_other_wrap', 'abdpain_branch_rlq',
    'abdpain_branch_epigastric_ruq', 'abdpain_rad_other_wrap', 'abdpain_vomit_detail_wrap',
    'abdpain_vomit_char_wrap', 'abdpain_diarrhea_freq_wrap', 'abdpain_obstipation_wrap',
    'abdpain_surgery_detail_wrap', 'abdpain_branch_female', 'abdpain_lmp_date_wrap',
    'abdpain_lmp_approx_wrap', 'abdpain_lmp_pregnant_weeks_wrap'
  ],
  inputIdsToClear: [
    'abdpainDurationVal', 'abdpain_loc_other_text', 'abdpain_rad_other_text',
    'abdpainVomitFreq', 'abdpainDiarrheaFreq', 'abdpainConstipationDays',
    'abdpainSurgeryDetail', 'abdpainLmpDate', 'abdpainPregnancyWeeks', 'abdpain_other_free'
  ],
  formHtml: ABD_FORM_HTML,

  algorithm: {
    id: 'abdpain',
    schemaCode: 'abdominal_pain',
    titleTh: 'ปวดท้อง',
    titleEn: 'Abdominal pain',
    sections: [
      { sectionNo: 1, titleTh: 'ระยะเวลา ลักษณะ และตำแหน่งที่ปวดท้อง (OPQRST & Pain Score)' },
      { sectionNo: 2, titleTh: 'อาการร่วมตามระบบร่างกาย (GI, GU, Circulatory & Fever Warnings)' },
      { sectionNo: 3, titleTh: 'ประวัติผ่าตัดช่องท้อง ยาความเสี่ยง และข้อมูลเฉพาะสตรี' }
    ]
  },

  seedPatients: [
    {
      id: 'case-043',
      queue_number: 'A-043',
      hn: '6704512',
      name: 'นายวีระชัย บุญส่ง',
      age: 28,
      gender: 'ชาย',
      chief_complaint: 'abdominal_pain',
      chief_complaint_title: 'ปวดท้อง',
      status: 'waiting',
      timestamp: '2026-10-26T02:31:26.423Z',
      durationVal: 18,
      durationUnit: 'hours',
      abdpainPainScore: 7,
      abdpainOnsetMode: 'gradual_worsening',
      abdpainChars: ['dull', 'sharp_stabbing'],
      abdpainLocs: ['rlq', 'periumbilical'],
      abdpainRads: ['none'],
      abdpainFactors: ['jarring_movement'],
      abdpain_gi_vomit: true,
      abdpain_vomit_nausea_only: true,
      abdpain_gi_anorexia: true,
      abdpain_gu_none: true,
      abdpain_sys_none: true,
      abdpain_risk_none: true,
      abdpain_rf_syncope: false,
      abdpain_rf_melena: false,
      abdpain_rf_hematemesis: false,
      abdpain_rf_obstruction: false,
      abdpain_rf_shock: false,
      abdpain_rf_fever: false,
      abdpain_anorexia: 'loss_appetite',
      abdpain_vomit_status: 'nausea_only',
      abdpainVomitFreq: 0,
      abdpain_vomit_contents: [],
      abdpain_stool_status: 'normal',
      abdpainDiarrheaFreq: 0,
      abdpain_jaundice: false,
      abdpain_rlq_migration: true,
      abdpain_rlq_jarring: true,
      abdpain_epi_fatty_meal: false,
      abdpain_epi_gallstone_alcohol: false,
      abdpain_flank_restless: false,
      abdpain_flank_hematuria: false,
      abdpain_supra_dysuria: false,
      abdpain_lmp_status: 'unspecified',
      abdpainLmpDate: '',
      abdpain_gyn_bleeding: false,
      abdpain_gyn_discharge: false,
      abdpain_surgery_status: 'no',
      abdpainSurgeryDetail: '',
      abdpain_med_nsaids: false,
      abdpain_med_steroids: false,
      abdpain_med_anticoagulants: false,
      abdpain_alcohol: 'none',
      hospRecordStatus: 'self',
      underlying: ['ปฏิเสธ'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'ไม่มี',
      doctor_notes: {
        additional_hpi: '18 ชั่วโมงก่อนมา เริ่มปวดตื้อๆ แถวรอบสะดือ หลังจากนั้นประมาณ 8 ชั่วโมง ย้ายมาปวดชัดเจนที่ท้องน้อยด้านขวา เดินกระแทกส้นเท้าแล้วเจ็บสะท้าน',
        physical_exam: 'BT 37.8 C, PR 92/min, RR 20/min, BP 122/78 mmHg. Abdomen: Guarding and marked tenderness at McBurney point, Rovsing sign positive, Psoas sign positive',
        preliminary_dx: 'Acute Appendicitis',
        plan: 'NPO, IV Acetar 1000 ml IV drip 100 ml/hr, IV Cefazolin 1g, Consult General Surgery for Emergency Appendectomy'
      }
    },
    {
      id: 'case-044',
      queue_number: 'A-044',
      hn: '6707823',
      name: 'นางสาวสุดารัตน์ ใจดี',
      age: 26,
      gender: 'หญิง',
      chief_complaint: 'abdominal_pain',
      chief_complaint_title: 'ปวดท้อง',
      status: 'waiting',
      timestamp: '2026-10-26T02:41:26.423Z',
      durationVal: 3,
      durationUnit: 'hours',
      abdpainPainScore: 9,
      abdpainOnsetMode: 'sudden_severe',
      abdpainChars: ['sharp_stabbing'],
      abdpainLocs: ['rlq', 'suprapubic'],
      abdpainRads: ['groin_thigh_genitalia'],
      abdpainFactors: ['jarring_movement'],
      abdpain_gi_vomit: true,
      abdpain_gi_anorexia: true,
      abdpain_gu_none: true,
      abdpain_risk_none: true,
      abdpain_rf_syncope: true,
      abdpain_rf_melena: false,
      abdpain_rf_hematemesis: false,
      abdpain_rf_obstruction: false,
      abdpain_rf_shock: true,
      abdpain_rf_fever: false,
      abdpain_anorexia: 'loss_appetite',
      abdpain_vomit_status: 'vomiting',
      abdpainVomitFreq: 2,
      abdpain_vomit_contents: ['food_gastric'],
      abdpain_stool_status: 'normal',
      abdpainDiarrheaFreq: 0,
      abdpain_jaundice: false,
      abdpain_rlq_migration: false,
      abdpain_rlq_jarring: true,
      abdpain_epi_fatty_meal: false,
      abdpain_epi_gallstone_alcohol: false,
      abdpain_flank_restless: false,
      abdpain_flank_hematuria: false,
      abdpain_supra_dysuria: false,
      abdpain_lmp_status: 'missed_period',
      abdpainLmpDate: '',
      abdpain_gyn_bleeding: true,
      abdpain_gyn_discharge: false,
      abdpain_surgery_status: 'no',
      abdpainSurgeryDetail: '',
      abdpain_med_nsaids: false,
      abdpain_med_steroids: false,
      abdpain_med_anticoagulants: false,
      abdpain_alcohol: 'none',
      hospRecordStatus: 'self',
      underlying: ['ปฏิเสธ'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'ไม่มี',
      doctor_notes: {
        additional_hpi: 'หญิงวัยเจริญพันธุ์ ขาดประจำเดือนประมาณ 6 สัปดาห์ ปวดท้องน้อยขวาเฉียบพลันรุนแรง 3 ชั่วโมงก่อนมา มีเลือดออกกะปริดกะปรอยทางช่องคลอด หน้ามืดวูบคล้ายจะเป็นลม เหงื่อแตกตัวเย็น',
        physical_exam: 'BT 36.8 C, PR 118/min, RR 22/min, BP 88/56 mmHg, SpO2 98%. Marked pallor, cold clammy skin. Abdomen: Distended, marked tenderness and rebound at RLQ and suprapubic',
        preliminary_dx: 'Ruptured Right Ectopic Pregnancy with Hypovolemic Shock',
        plan: 'STAT 2 Large-bore IV lines (18G), Rush Normal Saline 1000 ml IV, STAT UPT (Positive), STAT CBC, Coagulogram, G/M PRC 2 units, STAT emergency consult Ob-Gyn for Emergency Laparotomy'
      }
    },
    {
      id: 'case-045',
      queue_number: 'A-045',
      hn: '6709120',
      name: 'นายประวิทย์ มงคลศิลป์',
      age: 62,
      gender: 'ชาย',
      chief_complaint: 'abdominal_pain',
      chief_complaint_title: 'ปวดท้อง',
      status: 'waiting',
      timestamp: '2026-10-26T02:26:26.423Z',
      durationVal: 2,
      durationUnit: 'days',
      abdpainPainScore: 6,
      abdpainOnsetMode: 'gradual_worsening',
      abdpainChars: ['burning'],
      abdpainLocs: ['epigastrium'],
      abdpainRads: ['back_mid'],
      abdpainFactors: ['empty_stomach_worse', 'antacid_relief'],
      abdpain_gi_vomit: true,
      abdpain_gi_anorexia: true,
      abdpain_gu_none: true,
      abdpain_risk_alcohol: true,
      abdpain_rf_syncope: true,
      abdpain_rf_melena: true,
      abdpain_rf_hematemesis: true,
      abdpain_rf_obstruction: false,
      abdpain_rf_shock: false,
      abdpain_rf_fever: false,
      abdpain_anorexia: 'loss_appetite',
      abdpain_vomit_status: 'vomiting',
      abdpainVomitFreq: 3,
      abdpain_vomit_contents: ['coffee_ground_blood'],
      abdpain_stool_status: 'melena_bloody',
      abdpainDiarrheaFreq: 0,
      abdpain_jaundice: false,
      abdpain_rlq_migration: false,
      abdpain_rlq_jarring: false,
      abdpain_epi_fatty_meal: false,
      abdpain_epi_gallstone_alcohol: false,
      abdpain_flank_restless: false,
      abdpain_flank_hematuria: false,
      abdpain_supra_dysuria: false,
      abdpain_lmp_status: 'unspecified',
      abdpainLmpDate: '',
      abdpain_gyn_bleeding: false,
      abdpain_gyn_discharge: false,
      abdpain_surgery_status: 'no',
      abdpainSurgeryDetail: '',
      abdpain_med_nsaids: true,
      abdpain_med_steroids: false,
      abdpain_med_anticoagulants: false,
      abdpain_alcohol: 'regular_heavy',
      hospRecordStatus: 'additional',
      underlying: ['ความดันสูง (HT)', 'ข้อเข่าเสื่อม (OA Knee)'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Amlodipine 5mg, Ibuprofen 400mg tid pc (ซื้อทานเองจากร้านขายยา 2 สัปดาห์)',
      doctor_notes: {
        additional_hpi: 'มีประวัติซื้อยา NSAIDs ทานแก้ปวดข้อเข่าต่อเนื่อง 2 สัปดาห์ ปวดแสบลิ้นปี่ 2 วัน วันนี้อาเจียนสีกาแฟ 3 ครั้ง และถ่ายดำเหนียวยางมะตอย 2 ครั้ง หน้ามืดตอนลุกยืน',
        physical_exam: 'BT 37.0 C, PR 104/min, RR 20/min, BP 102/64 mmHg. Mild pale conjunctivae. Abdomen: Mild epigastric tenderness, no guarding, no rebound. DRE: Melena stool on examining glove',
        preliminary_dx: 'Acute Upper GI Bleeding secondary to NSAID-induced Gastric/Duodenal Ulcer',
        plan: 'NPO, NG tube on gravity, Pantoprazole 80 mg IV bolus then 8 mg/hr continuous infusion, NSS 1000 ml IV rate 120 ml/hr, CBC, BUN/Cr, Electrolytes, Coagulogram, CXR upright, Consult GI for urgent EGD within 24 hr'
      }
    },
    {
      id: 'seed-abdpain-04',
      queue_number: 'B-043',
      hn: '6709318',
      name: 'นางสาวนภา รุ่งเรือง',
      age: 34,
      gender: 'หญิง',
      chief_complaint: 'abdominal_pain',
      chief_complaint_title: 'ปวดท้อง',
      status: 'waiting',
      timestamp: '2026-10-26T03:05:00.000Z',
      durationVal: 6,
      durationUnit: 'hours',
      abdpainPainScore: 4,
      abdpainOnsetMode: 'intermittent_cramps',
      abdpainIntermittentBaseline: 'pain_free',
      abdpainChars: ['burning'],
      abdpainLocs: ['epigastrium'],
      abdpainRads: ['none'],
      abdpainFactors: ['empty_stomach_worse', 'antacid_relief'],
      abdpain_gi_none: true,
      abdpain_gu_none: true,
      abdpain_sys_none: true,
      abdpain_risk_gerd_pud: true,
      abdpain_epi_fatty_meal: false,
      abdpain_epi_gallstone_alcohol: false,
      abdpain_lmp_status: 'exact_date',
      abdpainLmpDate: '05/11/2026',
      abdpain_gyn_none: true,
      abdpain_gyn_bleeding: false,
      abdpain_gyn_discharge: false,
      hospRecordStatus: 'self',
      underlying: ['ปฏิเสธ'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'ไม่มี',
      doctor_notes: {
        additional_hpi: 'ปวดแสบใต้ลิ้นปี่เป็นพักๆ ช่วงเว้นหายสนิท ปวดมากขึ้นตอนท้องว่าง ทานยาลดกรดแล้วทุเลา ไม่มีอาเจียน ไม่มีถ่ายดำ ประวัติเคยเป็นโรคกระเพาะมาก่อน',
        physical_exam: 'BT 36.7 C, PR 78/min, RR 16/min, BP 116/72 mmHg. Abdomen: Soft, mild epigastric tenderness, no guarding, no rebound',
        preliminary_dx: 'Acute Gastritis / Dyspepsia (Non-Red Flag)',
        plan: 'IV/Oral PPI + Antacid, dietary advice (avoid spicy/sour food, NSAIDs), observe and discharge with warning signs'
      }
    }
  ],

  onActivate: () => updateAbdpainFemaleContext(),
  onSelectForm: () => updateAbdpainFemaleContext(),
  onTitleChange: (isFem) => updateAbdpainFemaleContext(isFem),

  resetForm() {
    ['abdpainOnsetMode', 'abdpainIntermittentBaseline', 'abdpain_obstipation_type', 'abdpain_lmp_status', 'abdpain_lmp_approx'].forEach(n => setAbdRadioVal(n, ''));
    ['abdpain_char', 'abdpain_loc', 'abdpain_rad', 'abdpain_factor', 'abdpain_vomit_content'].forEach(n => setAbdCheckboxGroup(n, []));
    [
      'abdpain_loc_other_chk', 'abdpain_rlq_migration', 'abdpain_rlq_jarring',
      'abdpain_epi_fatty_meal', 'abdpain_epi_gallstone_alcohol', 'abdpain_rad_none',
      'abdpain_rad_other_chk', 'abdpain_factor_none', 'abdpain_gi_none',
      'abdpain_gi_vomit', 'abdpain_gi_diarrhea', 'abdpain_gi_constipation', 'abdpain_gi_anorexia',
      'abdpain_rf_hematemesis', 'abdpain_rf_melena', 'abdpain_gi_distension', 'abdpain_jaundice',
      'abdpain_vomit_nausea_only', 'abdpain_gu_none', 'abdpain_supra_dysuria', 'abdpain_flank_hematuria',
      'abdpain_gu_oliguria', 'abdpain_flank_restless', 'abdpain_sys_none', 'abdpain_rf_syncope',
      'abdpain_rf_shock', 'abdpain_rf_fever', 'abdpain_rf_chest_dyspnea', 'abdpain_risk_none',
      'abdpain_risk_surgery', 'abdpain_med_nsaids', 'abdpain_med_anticoagulants', 'abdpain_risk_alcohol',
      'abdpain_risk_gerd_pud', 'abdpain_risk_med_unsure', 'abdpain_gyn_none',
      'abdpain_gyn_bleeding', 'abdpain_gyn_discharge'
    ].forEach(id => {
      const c = document.getElementById(id);
      if (c) c.checked = false;
    });
    this.branchIds.forEach(bId => toggleAbdBranch(bId, false));
    toggleAbdBranch('abdpain_vomit_char_wrap', true);
    const vf = document.getElementById('abdpainVomitFreq');
    if (vf) vf.disabled = false;
    this.inputIdsToClear.forEach(id => {
      const inp = document.getElementById(id);
      if (inp) inp.value = '';
    });
    const durUnit = document.getElementById('abdpainDurationUnit');
    if (durUnit) durUnit.value = 'hours';
    clearAbdpainPainScore();
  },

  hydrateForm(patient) {
    this.resetForm();
    const setElVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val ?? ''; };
    const setElChk = (id, checked) => { const el = document.getElementById(id); if (el) el.checked = Boolean(checked); };

    setElVal('abdpainDurationVal', patient.durationVal || '');
    setElVal('abdpainDurationUnit', patient.durationUnit || 'hours');

    const onsetVal = patient.abdpainOnsetMode === 'intermittent_chronic' ? 'intermittent_cramps' : (patient.abdpainOnsetMode || '');
    setAbdRadioVal('abdpainOnsetMode', onsetVal);
    handleAbdpainOnsetChange();
    if (onsetVal === 'intermittent_cramps') {
      setAbdRadioVal('abdpainIntermittentBaseline', patient.abdpainIntermittentBaseline || '');
    }

    const normChars = (patient.abdpainChars || []).map(c => ({
      crampy_colic: 'colicky', colicky_crampy: 'colicky', dull_aching: 'dull', constant_dull: 'dull', burning_gnawing: 'burning'
    }[c] || c));
    setAbdCheckboxGroup('abdpain_char', normChars);

    const locs = Array.isArray(patient.abdpainLocs) ? patient.abdpainLocs : [];
    const normLocs = locs.map(l => l === 'generalized' ? 'diffuse' : l);
    const otherLoc = normLocs.find(l => String(l).startsWith('อื่นๆ: '));
    setAbdCheckboxGroup('abdpain_loc', normLocs.filter(l => !String(l).startsWith('อื่นๆ: ')));
    if (otherLoc) {
      setElChk('abdpain_loc_other_chk', true);
      toggleAbdBranch('abdpain_loc_other_wrap', true);
      setElVal('abdpain_loc_other_text', String(otherLoc).replace(/^อื่นๆ:\s*/, ''));
    }
    handleAbdpainLocationChange();
    setElChk('abdpain_rlq_migration', patient.abdpain_rlq_migration);
    setElChk('abdpain_rlq_jarring', patient.abdpain_rlq_jarring);
    setElChk('abdpain_epi_fatty_meal', patient.abdpain_epi_fatty_meal);
    setElChk('abdpain_epi_gallstone_alcohol', patient.abdpain_epi_gallstone_alcohol);

    const rads = Array.isArray(patient.abdpainRads) ? patient.abdpainRads : [];
    if (rads.includes('none')) {
      setElChk('abdpain_rad_none', true);
    } else {
      const normRads = rads.map(r => r === 'chest_neck' ? 'chest' : (r === 'scapula_right_shoulder' ? 'back_right' : r));
      const otherRad = normRads.find(r => String(r).startsWith('อื่นๆ: '));
      setAbdCheckboxGroup('abdpain_rad', normRads.filter(r => !String(r).startsWith('อื่นๆ: ')));
      if (otherRad) {
        setElChk('abdpain_rad_other_chk', true);
        toggleAbdBranch('abdpain_rad_other_wrap', true);
        setElVal('abdpain_rad_other_text', String(otherRad).replace(/^อื่นๆ:\s*/, ''));
      }
    }

    if (patient.abdpain_factor_none) {
      setElChk('abdpain_factor_none', true);
    } else {
      const normFactors = (patient.abdpainFactors || []).map(f => f === 'forward_bend_relief' ? 'lean_forward_relief' : (f === 'fatty_food_worse' ? 'postprandial_worse' : f));
      setAbdCheckboxGroup('abdpain_factor', normFactors);
    }

    if (patient.abdpainPainScore !== null && patient.abdpainPainScore !== undefined) {
      setAbdpainPainScore(patient.abdpainPainScore);
    }

    // GI & Bowel
    const hasVomit = Boolean(patient.abdpain_gi_vomit) || patient.abdpain_vomit_status === 'vomiting' || patient.abdpain_vomit_status === 'nausea_only';
    const hasDiarrhea = Boolean(patient.abdpain_gi_diarrhea) || patient.abdpain_stool_status === 'diarrhea';
    const hasConstip = Boolean(patient.abdpain_gi_constipation) || patient.abdpain_rf_obstruction || patient.abdpain_stool_status === 'constipation' || patient.abdpain_stool_status === 'constipation_no_gas';
    const hasAnorexia = Boolean(patient.abdpain_gi_anorexia) || patient.abdpain_anorexia === 'loss_appetite';
    const hasMelena = Boolean(patient.abdpain_rf_melena) || patient.abdpain_stool_status === 'melena_bloody';

    setElChk('abdpain_gi_vomit', hasVomit);
    setElChk('abdpain_gi_diarrhea', hasDiarrhea);
    setElChk('abdpain_gi_constipation', hasConstip);
    setElChk('abdpain_gi_anorexia', hasAnorexia);
    setElChk('abdpain_rf_hematemesis', patient.abdpain_rf_hematemesis);
    setElChk('abdpain_rf_melena', hasMelena);
    setElChk('abdpain_gi_distension', patient.abdpain_gi_distension || patient.abdpain_rf_obstruction);
    setElChk('abdpain_jaundice', patient.abdpain_jaundice);
    setElChk('abdpain_gi_none', patient.abdpain_gi_none);
    syncAbdpainGiBranches();

    if (hasVomit || patient.abdpain_rf_hematemesis) {
      const isNausea = Boolean(patient.abdpain_vomit_nausea_only) || patient.abdpain_vomit_status === 'nausea_only';
      setElChk('abdpain_vomit_nausea_only', isNausea);
      handleAbdpainVomitNauseaToggle(isNausea);
      if (!isNausea) {
        if (patient.abdpainVomitFreq) setElVal('abdpainVomitFreq', patient.abdpainVomitFreq);
        const normVomit = [];
        (patient.abdpain_vomit_contents || []).forEach(v => {
          if (v === 'bilious_green') normVomit.push('bilious');
          else if (v === 'coffee_ground_blood') normVomit.push('coffee_ground');
          else normVomit.push(v);
        });
        setAbdCheckboxGroup('abdpain_vomit_content', normVomit);
      }
    }
    if (hasDiarrhea && patient.abdpainDiarrheaFreq) setElVal('abdpainDiarrheaFreq', patient.abdpainDiarrheaFreq);
    if (hasConstip) {
      if (patient.abdpainConstipationDays) setElVal('abdpainConstipationDays', patient.abdpainConstipationDays);
      const oType = patient.abdpain_obstipation_type || ((patient.abdpain_rf_obstruction || patient.abdpain_stool_status === 'constipation_no_gas') ? 'no_stool_no_gas' : '');
      if (oType) setAbdRadioVal('abdpain_obstipation_type', oType);
    }

    // GU & Circulatory
    setElChk('abdpain_supra_dysuria', patient.abdpain_supra_dysuria);
    setElChk('abdpain_flank_hematuria', patient.abdpain_flank_hematuria);
    setElChk('abdpain_gu_oliguria', patient.abdpain_gu_oliguria);
    setElChk('abdpain_flank_restless', patient.abdpain_flank_restless);
    setElChk('abdpain_gu_none', patient.abdpain_gu_none);

    setElChk('abdpain_rf_syncope', patient.abdpain_rf_syncope);
    setElChk('abdpain_rf_shock', patient.abdpain_rf_shock);
    setElChk('abdpain_rf_fever', patient.abdpain_rf_fever);
    setElChk('abdpain_rf_chest_dyspnea', patient.abdpain_rf_chest_dyspnea);
    setElChk('abdpain_sys_none', patient.abdpain_sys_none);

    // Risk & Surgery
    const hasSurg = Boolean(patient.abdpain_risk_surgery) || patient.abdpain_surgery_status === 'yes';
    setElChk('abdpain_risk_surgery', hasSurg);
    handleAbdpainSurgeryChange();
    if (hasSurg) setElVal('abdpainSurgeryDetail', patient.abdpainSurgeryDetail || '');
    setElChk('abdpain_med_nsaids', patient.abdpain_med_nsaids || patient.abdpain_med_steroids);
    setElChk('abdpain_med_anticoagulants', patient.abdpain_med_anticoagulants);
    setElChk('abdpain_risk_alcohol', patient.abdpain_risk_alcohol || (patient.abdpain_alcohol && patient.abdpain_alcohol !== 'none' && patient.abdpain_alcohol !== 'unspecified'));
    setElChk('abdpain_risk_gerd_pud', patient.abdpain_risk_gerd_pud);
    setElChk('abdpain_risk_med_unsure', patient.abdpain_risk_med_unsure);
    setElChk('abdpain_risk_none', patient.abdpain_risk_none);

    // Female section
    updateAbdpainFemaleContext(patient.gender === 'หญิง' || isAbdFemaleTitle());
    setAbdRadioVal('abdpain_lmp_status', patient.abdpain_lmp_status);
    handleAbdpainLmpToggle(patient.abdpain_lmp_status);
    if (patient.abdpain_lmp_status === 'exact_date') setElVal('abdpainLmpDate', patient.abdpainLmpDate || '');
    if (patient.abdpain_lmp_status === 'approx') setAbdRadioVal('abdpain_lmp_approx', patient.abdpain_lmp_approx || '');
    if (patient.abdpain_lmp_status === 'pregnant') setElVal('abdpainPregnancyWeeks', patient.abdpainPregnancyWeeks || '');
    setElChk('abdpain_gyn_bleeding', patient.abdpain_gyn_bleeding);
    setElChk('abdpain_gyn_discharge', patient.abdpain_gyn_discharge);
    setElChk('abdpain_gyn_none', patient.abdpain_gyn_none);
    setElVal('abdpain_other_free', patient.otherSymptomsFree || '');
  },

  collectIntake(ctx) {
    ctx = ctx || {};
    const _rawDur = parseFloat(document.getElementById('abdpainDurationVal')?.value);
    const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
    const durationUnit = durationVal ? (document.getElementById('abdpainDurationUnit')?.value || 'hours') : null;
    const abdpainOnsetMode = getAbdRadioVal('abdpainOnsetMode') || 'unspecified';
    const abdpainIntermittentBaseline = (abdpainOnsetMode === 'intermittent_cramps') ? (getAbdRadioVal('abdpainIntermittentBaseline') || '') : '';
    const abdpainChars = getAbdCheckedVals('abdpain_char');

    const abdpainLocs = getAbdCheckedVals('abdpain_loc');
    if (document.getElementById('abdpain_loc_other_chk')?.checked) {
      const txt = document.getElementById('abdpain_loc_other_text')?.value?.trim();
      if (txt) abdpainLocs.push(`อื่นๆ: ${txt}`);
    }

    const abdpain_rad_none = Boolean(document.getElementById('abdpain_rad_none')?.checked);
    const abdpainRads = abdpain_rad_none ? ['none'] : getAbdCheckedVals('abdpain_rad');
    if (!abdpain_rad_none && document.getElementById('abdpain_rad_other_chk')?.checked) {
      const txt = document.getElementById('abdpain_rad_other_text')?.value?.trim();
      if (txt) abdpainRads.push(`อื่นๆ: ${txt}`);
    }

    const abdpain_factor_none = Boolean(document.getElementById('abdpain_factor_none')?.checked);
    const abdpainFactors = abdpain_factor_none ? [] : getAbdCheckedVals('abdpain_factor');
    const abdpainPainScore = abdpainPainScoreTouched ? parseInt(document.getElementById('abdpainPainScore')?.value, 10) : null;

    const abdpain_gi_none = Boolean(document.getElementById('abdpain_gi_none')?.checked);
    const abdpain_gi_vomit = !abdpain_gi_none && Boolean(document.getElementById('abdpain_gi_vomit')?.checked);
    const abdpain_gi_diarrhea = !abdpain_gi_none && Boolean(document.getElementById('abdpain_gi_diarrhea')?.checked);
    const abdpain_gi_constipation = !abdpain_gi_none && Boolean(document.getElementById('abdpain_gi_constipation')?.checked);
    const abdpain_gi_anorexia = !abdpain_gi_none && Boolean(document.getElementById('abdpain_gi_anorexia')?.checked);
    const abdpain_rf_hematemesis = !abdpain_gi_none && Boolean(document.getElementById('abdpain_rf_hematemesis')?.checked);
    const abdpain_rf_melena = !abdpain_gi_none && Boolean(document.getElementById('abdpain_rf_melena')?.checked);
    const abdpain_gi_distension = !abdpain_gi_none && Boolean(document.getElementById('abdpain_gi_distension')?.checked);
    const abdpain_jaundice = !abdpain_gi_none && Boolean(document.getElementById('abdpain_jaundice')?.checked);

    const hasVomitBranch = abdpain_gi_vomit || abdpain_rf_hematemesis;
    const abdpain_vomit_nausea_only = hasVomitBranch && Boolean(document.getElementById('abdpain_vomit_nausea_only')?.checked);
    const _vFreq = parseInt(document.getElementById('abdpainVomitFreq')?.value, 10);
    const abdpainVomitFreq = (hasVomitBranch && !abdpain_vomit_nausea_only && !isNaN(_vFreq) && _vFreq > 0) ? _vFreq : 0;
    const abdpain_vomit_contents = (hasVomitBranch && !abdpain_vomit_nausea_only) ? getAbdCheckedVals('abdpain_vomit_content') : [];
    const _dFreq = parseInt(document.getElementById('abdpainDiarrheaFreq')?.value, 10);
    const abdpainDiarrheaFreq = (abdpain_gi_diarrhea && !isNaN(_dFreq) && _dFreq > 0) ? _dFreq : 0;
    const _cDays = parseInt(document.getElementById('abdpainConstipationDays')?.value, 10);
    const abdpainConstipationDays = (abdpain_gi_constipation && !isNaN(_cDays) && _cDays > 0) ? _cDays : null;
    const abdpain_obstipation_type = abdpain_gi_constipation ? (getAbdRadioVal('abdpain_obstipation_type') || '') : '';
    const abdpain_rf_obstruction = abdpain_gi_constipation && abdpain_obstipation_type === 'no_stool_no_gas';

    const abdpain_gu_none = Boolean(document.getElementById('abdpain_gu_none')?.checked);
    const abdpain_supra_dysuria = !abdpain_gu_none && Boolean(document.getElementById('abdpain_supra_dysuria')?.checked);
    const abdpain_flank_hematuria = !abdpain_gu_none && Boolean(document.getElementById('abdpain_flank_hematuria')?.checked);
    const abdpain_gu_oliguria = !abdpain_gu_none && Boolean(document.getElementById('abdpain_gu_oliguria')?.checked);
    const abdpain_flank_restless = !abdpain_gu_none && Boolean(document.getElementById('abdpain_flank_restless')?.checked);

    const abdpain_sys_none = Boolean(document.getElementById('abdpain_sys_none')?.checked);
    const abdpain_rf_syncope = !abdpain_sys_none && Boolean(document.getElementById('abdpain_rf_syncope')?.checked);
    const abdpain_rf_shock = !abdpain_sys_none && Boolean(document.getElementById('abdpain_rf_shock')?.checked);
    const abdpain_rf_fever = !abdpain_sys_none && Boolean(document.getElementById('abdpain_rf_fever')?.checked);
    const abdpain_rf_chest_dyspnea = !abdpain_sys_none && Boolean(document.getElementById('abdpain_rf_chest_dyspnea')?.checked);

    const abdpain_rlq_migration = abdpainLocs.includes('rlq') && Boolean(document.getElementById('abdpain_rlq_migration')?.checked);
    const abdpain_rlq_jarring = abdpainLocs.includes('rlq') && Boolean(document.getElementById('abdpain_rlq_jarring')?.checked);
    const hasEpiRuq = abdpainLocs.includes('epigastrium') || abdpainLocs.includes('ruq');
    const abdpain_epi_fatty_meal = hasEpiRuq && Boolean(document.getElementById('abdpain_epi_fatty_meal')?.checked);
    const abdpain_epi_gallstone_alcohol = hasEpiRuq && Boolean(document.getElementById('abdpain_epi_gallstone_alcohol')?.checked);

    const abdpain_risk_none = Boolean(document.getElementById('abdpain_risk_none')?.checked);
    const abdpain_risk_surgery = !abdpain_risk_none && Boolean(document.getElementById('abdpain_risk_surgery')?.checked);
    const abdpainSurgeryDetail = abdpain_risk_surgery ? (document.getElementById('abdpainSurgeryDetail')?.value?.trim() || '') : '';
    const abdpain_med_nsaids = !abdpain_risk_none && Boolean(document.getElementById('abdpain_med_nsaids')?.checked);
    const abdpain_med_anticoagulants = !abdpain_risk_none && Boolean(document.getElementById('abdpain_med_anticoagulants')?.checked);
    const abdpain_risk_alcohol = !abdpain_risk_none && Boolean(document.getElementById('abdpain_risk_alcohol')?.checked);
    const abdpain_risk_gerd_pud = !abdpain_risk_none && Boolean(document.getElementById('abdpain_risk_gerd_pud')?.checked);
    const abdpain_risk_med_unsure = !abdpain_risk_none && Boolean(document.getElementById('abdpain_risk_med_unsure')?.checked);
    const anyRiskTick = abdpain_risk_none || abdpain_risk_surgery || abdpain_med_nsaids || abdpain_med_anticoagulants || abdpain_risk_alcohol || abdpain_risk_gerd_pud || abdpain_risk_med_unsure;

    const gender = ctx.gender || 'ไม่ระบุ';
    const isFem = gender === 'หญิง' || isAbdFemaleTitle();
    const abdpain_lmp_status = isFem ? (getAbdRadioVal('abdpain_lmp_status') || 'unspecified') : 'unspecified';
    const abdpain_lmp_approx = (isFem && abdpain_lmp_status === 'approx') ? (getAbdRadioVal('abdpain_lmp_approx') || '') : '';
    const abdpainLmpDate = (isFem && abdpain_lmp_status === 'exact_date') ? (document.getElementById('abdpainLmpDate')?.value?.trim() || '') : '';
    const abdpainPregnancyWeeks = (isFem && abdpain_lmp_status === 'pregnant') ? (document.getElementById('abdpainPregnancyWeeks')?.value?.trim() || '') : '';
    const abdpain_gyn_none = isFem && Boolean(document.getElementById('abdpain_gyn_none')?.checked);
    const abdpain_gyn_bleeding = isFem && !abdpain_gyn_none && Boolean(document.getElementById('abdpain_gyn_bleeding')?.checked);
    const abdpain_gyn_discharge = isFem && !abdpain_gyn_none && Boolean(document.getElementById('abdpain_gyn_discharge')?.checked);

    const hospRecordStatus = ctx.hospRecordStatus || 'unspecified';
    const underlying = Array.isArray(ctx.underlying) ? ctx.underlying : [];

    return {
      id: ctx.recordId || `case-${Date.now()}`,
      queue_number: ctx.queueNumber || 'ER-NEW',
      hn: ctx.randomHn || '-',
      name: ctx.patientName || 'ไม่ระบุชื่อ',
      age: ctx.patientAge !== undefined ? ctx.patientAge : 'ไม่ระบุ',
      gender,
      chief_complaint: 'abdominal_pain',
      chief_complaint_title: 'ปวดท้อง',
      status: ctx.recordStatus || 'waiting',
      timestamp: new Date().toISOString(),
      durationVal,
      durationUnit,
      abdpainPainScore,
      abdpainOnsetMode,
      abdpainIntermittentBaseline,
      abdpainChars,
      abdpainLocs,
      abdpainRads,
      abdpain_factor_none,
      abdpainFactors,
      abdpain_gi_none,
      abdpain_gi_vomit,
      abdpain_vomit_nausea_only,
      abdpain_vomit_status: abdpain_vomit_nausea_only ? 'nausea_only' : (hasVomitBranch ? 'vomiting' : (abdpain_gi_none ? 'none' : 'unspecified')),
      abdpainVomitFreq,
      abdpain_vomit_contents,
      abdpain_gi_diarrhea,
      abdpain_stool_status: abdpain_rf_melena ? 'melena_bloody' : (abdpain_rf_obstruction ? 'constipation_no_gas' : (abdpain_gi_diarrhea ? 'diarrhea' : (abdpain_gi_constipation ? 'constipation' : (abdpain_gi_none ? 'normal' : 'unspecified')))),
      abdpainDiarrheaFreq,
      abdpain_gi_constipation,
      abdpainConstipationDays,
      abdpain_obstipation_type,
      abdpain_gi_anorexia,
      abdpain_anorexia: abdpain_gi_anorexia ? 'loss_appetite' : (abdpain_gi_none ? 'normal' : 'unspecified'),
      abdpain_rf_hematemesis,
      abdpain_rf_melena,
      abdpain_gi_distension,
      abdpain_rf_obstruction,
      abdpain_jaundice,
      abdpain_rlq_migration,
      abdpain_rlq_jarring,
      abdpain_epi_fatty_meal,
      abdpain_epi_gallstone_alcohol,
      abdpain_gu_none,
      abdpain_supra_dysuria,
      abdpain_flank_hematuria,
      abdpain_gu_oliguria,
      abdpain_flank_restless,
      abdpain_sys_none,
      abdpain_rf_syncope,
      abdpain_rf_shock,
      abdpain_rf_fever,
      abdpain_rf_chest_dyspnea,
      abdpain_lmp_status,
      abdpain_lmp_approx,
      abdpainLmpDate,
      abdpainPregnancyWeeks,
      abdpain_gyn_none,
      abdpain_gyn_bleeding,
      abdpain_gyn_discharge,
      abdpain_risk_none,
      abdpain_risk_surgery,
      abdpain_surgery_status: abdpain_risk_surgery ? 'yes' : (anyRiskTick ? 'no' : 'unspecified'),
      abdpainSurgeryDetail,
      abdpain_med_nsaids,
      abdpain_med_steroids: false,
      abdpain_med_anticoagulants,
      abdpain_risk_alcohol,
      abdpain_alcohol: abdpain_risk_alcohol ? 'regular_heavy' : (anyRiskTick ? 'none' : 'unspecified'),
      abdpain_risk_gerd_pud,
      abdpain_risk_med_unsure,
      otherSymptomsFree: document.getElementById('abdpain_other_free')?.value?.trim() || ctx.otherSymptomsFree || '',
      hospRecordStatus,
      underlying: underlying.length > 0 ? underlying : ((hospRecordStatus === 'self' || hospRecordStatus === 'additional') ? ['ปฏิเสธ'] : []),
      drugAllergy: ctx.drugAllergy || 'ไม่ได้ระบุ',
      currentMeds: ctx.currentMeds || 'ไม่ได้ระบุ',
      doctor_notes: ctx.preservedDoctorNotes || { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' }
    };
  },

  isRedFlag(p) {
    return evaluateAbdpainRedFlags(p).length > 0;
  },

  evaluateRedFlags: evaluateAbdpainRedFlags,
  updateOutputs: updateAbdominalPainOutputs,

  generateCds(patient, ctx) {
    const { rfs, ddxList, workupList, managementList } = ctx;
    if (rfs.some(r => r.key === 'ectopic_pregnancy')) {
      ddxList.push('1. Ruptured Ectopic Pregnancy (ต้องตัดออกเป็นอันดับแรกในหญิงวัยเจริญพันธุ์!)');
      ddxList.push('2. Ruptured Ovarian Cyst / Pelvic Inflammatory Disease (PID) / Tubo-ovarian Abscess');
      ddxList.push('3. Acute Appendicitis');
      workupList.push('• Urine Pregnancy Test (UPT) ด่วนที่สุด + Bedside Pelvic/FAST Ultrasound ดู Free fluid ในช่องท้อง');
      workupList.push('• CBC, Crossmatch จองเลือด, Serum beta-hCG');
      managementList.push('• เปิดเส้น IV เข็มใหญ่ 2 เส้น, Resuscitate ด้วย Crystalloid หากมีภาวะช็อก และปรึกษาสูตินรีแพทย์ฉุกเฉินทันที');
    } else if (rfs.some(r => r.key === 'acute_appendicitis' || r.key === 'peritonitis')) {
      ddxList.push('1. Acute Appendicitis (with/without localized perforation)');
      ddxList.push('2. Hollow Viscus Perforation (เช่น Peptic Ulcer Perforation) / Acute Peritonitis');
      ddxList.push('3. Acute Cholecystitis / Acute Diverticulitis');
      workupList.push('• CBC, UA, Electrolytes, BUN/Cr, UPT (ถ้าเป็นหญิงวัยเจริญพันธุ์)');
      workupList.push('• Acute Abdomen Series (CXR upright ดู Free air ใต้กะบังลม) / Ultrasound หรือ CT Whole Abdomen');
      managementList.push('• งดน้ำและอาหารทางปาก (NPO), เปิดเส้นให้สารน้ำ IV, ให้ยาแก้ปวดเหมาะสม และปรึกษาศัลยแพทย์');
    } else {
      ddxList.push('1. Acute Gastritis / Peptic Ulcer Disease / Upper GI Bleeding');
      ddxList.push('2. Biliary Colic / Acute Cholecystitis / Acute Pancreatitis');
      ddxList.push('3. Acute Gastroenteritis / Ureteric Calculi (Renal Colic)');
      workupList.push('• CBC, BUN/Cr, Electrolytes, LFT, Serum Amylase/Lipase, UA, EKG (ในผู้สูงอายุที่ปวด Epigastrium เพื่อแยก Inferior MI)');
      managementList.push('• ประเมินภาวะขาดน้ำ/เสียเลือด หลีกเลี่ยงการใช้ยากลุ่ม NSAIDs ในผู้ป่วยสงสัยแผลในกระเพาะหรือเลือดออกทางเดินอาหาร');
    }
  }
});
