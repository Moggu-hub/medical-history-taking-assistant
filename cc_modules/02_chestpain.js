// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 02_chestpain.js
// อาการนำ: เจ็บแน่นหน้าอก (Chest pain — 3-Card + Dynamic High-Risk Med Safety)
// ไฟล์นี้แยกอิสระสำหรับอาการนำ chestpain เพื่อให้ทีมแพทย์และ IT โรงพยาบาลนำไปพัฒนาต่อได้โดยไม่กระทบระบบหลัก
// =========================================================================

let chestpainPainScoreTouched = false;
let chestpainHighRiskForcedOpen = false;

// --- Pain Score Helpers (Global contracts called by core_engine.js) ---
function clearChestpainPainScore() {
  chestpainPainScoreTouched = false;
  const slider = document.getElementById('chestpainPainScore');
  if (slider) slider.value = 0;
  const emojiEl = document.getElementById('chestpainPainScoreEmoji');
  const textEl = document.getElementById('chestpainPainScoreText');
  const badgeEl = document.getElementById('chestpainPainScoreBadge');
  const clearBtn = document.getElementById('chestpainPainScoreClearBtn');
  if (emojiEl) emojiEl.textContent = '⚪';
  if (textEl) textEl.textContent = 'ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)';
  if (badgeEl) badgeEl.className = 'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all';
  if (clearBtn) clearBtn.classList.add('hidden');
}

function handleChestpainPainScoreChange(val) {
  chestpainPainScoreTouched = true;
  const num = parseInt(val, 10);
  const emojiEl = document.getElementById('chestpainPainScoreEmoji');
  const textEl = document.getElementById('chestpainPainScoreText');
  const badgeEl = document.getElementById('chestpainPainScoreBadge');
  const clearBtn = document.getElementById('chestpainPainScoreClearBtn');
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

function setChestpainPainScore(score) {
  chestpainPainScoreTouched = true;
  const slider = document.getElementById('chestpainPainScore');
  if (slider) {
    slider.value = score;
    handleChestpainPainScoreChange(score);
  }
}

// --- Static Dictionaries ---
const CP_LABELS = {
  units: { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' },
  onset: {
    sudden_peak: 'เจ็บรุนแรงทันทีทันใด',
    gradual: 'ค่อยๆ แน่นมากขึ้น',
    intermittent: 'เป็นๆ หายๆ เป็นพักๆ',
    chronic_stable: 'มีอาการเรื้อรังมานาน'
  },
  intermittentBaseline: {
    pain_free: 'ช่วงเว้นหายสนิท ไม่เจ็บเลย',
    improved_persistent: 'ช่วงเว้นทุเลาลง แต่ยังแน่นตื้อๆ อยู่'
  },
  locs: {
    substernal: 'กลางหน้าอก / หลังกระดูกอก',
    left_chest: 'อกซ้าย',
    right_chest: 'อกขวา',
    epigastrium: 'ใต้ลิ้นปี่ / เหนือลิ้นปี่',
    diffuse: 'ทั่วทั้งหน้าอก'
  },
  rads: {
    scapula: 'ร้าวไปสะบัก / กลางหลัง',
    neck_jaw: 'ร้าวขึ้นคอ / กราม / คาง',
    left_arm_shoulder: 'ร้าวลงไหล่ซ้าย / แขนซ้าย',
    right_shoulder: 'ร้าวลงไหล่ขวา / แขนขวา',
    abdomen: 'ร้าวลงท้อง / ลิ้นปี่',
    none: 'ไม่ร้าวไปที่อื่น'
  },
  chars: {
    crushing_heavy: 'แน่นเหมือนโดนของทับ / บีบรัด',
    tight_dyspneic: 'แน่นอึดอัด หายใจไม่สะดวก',
    tearing_sharp: 'เจ็บแหลมคมเหมือนฉีกขาด / เสียบแทง',
    pleuritic_sharp: 'เจ็บแปล๊บเวลาหายใจลึก หรือไอ',
    burning_heartburn: 'แสบร้อนกลางอก / เหนือลิ้นปี่',
    aching_tender: 'เจ็บระบม เมื่อขยับตัว / กดโดน'
  },
  anginaExertion: {
    on_exertion: 'แน่นมากขึ้นเวลาออกแรง / เดินเร็ว',
    rest: 'แน่นขึ้นมาเองขณะนั่งหรือนอนพักเฉยๆ',
    unrelated: 'ไม่สัมพันธ์กับการออกแรง'
  },
  ntgCurrent: {
    not_taken: 'ยังไม่ได้ลองอมยา',
    relief: 'อมยาแล้วทุเลาลง',
    no_relief: 'อมยาแล้วไม่ดีขึ้น'
  },
  dyspneaPattern: {
    continuous: 'เหนื่อยตลอดเวลา แม้อยู่เฉยๆ',
    on_exertion: 'เหนื่อยเฉพาะเวลาออกแรง',
    orthopnea: 'เหนื่อยมากขึ้นเวลานอนราบ',
    sudden_onset: 'เหนื่อยหอบฉับพลันทันที'
  },
  abdpainLoc: {
    epigastrium: 'ใต้ลิ้นปี่',
    ruq: 'ขวาบน',
    luq: 'ซ้ายบน',
    periumbilical: 'รอบสะดือ',
    rlq: 'ขวาล่าง',
    llq: 'ซ้ายล่าง',
    suprapubic: 'ท้องน้อย',
    diffuse: 'ทั่วท้อง'
  },
  abdpainChar: {
    burning: 'แสบร้อน',
    sharp_tearing: 'เสียบแทง/ฉีกขาด',
    crampy: 'บิดเกร็ง',
    dull: 'ตื้อๆ แน่นๆ'
  },
  abdpainRad: {
    back_left: 'ร้าวหลังซ้าย',
    back_right: 'ร้าวหลังขวา',
    back_mid: 'ร้าวทะลุหลังกลาง',
    chest: 'ร้าวขึ้นเหนือลิ้นปี่',
    groin_thigh_genitalia: 'ร้าวลงขาหนีบ/อวัยวะเพศ'
  },
  hospStatus: {
    complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
    additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
    self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
    unspecified: 'ไม่ได้ระบุ'
  }
};

// --- DOM Helpers & Dynamic Context Handlers (Scoped cp* / Legacy Contract) ---
function toggleCpBranch(id, show) {
  if (typeof toggleBranch === 'function') {
    toggleBranch(id, show);
    return;
  }
  const el = document.getElementById(id);
  if (el) el.classList.toggle('hidden', !show);
}

function getCpRadioVal(name) {
  return document.querySelector(`input[name="${name}"]:checked`)?.value || '';
}

function setCpRadioVal(name, val) {
  document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
    r.checked = (val !== undefined && val !== null && val !== '' && r.value === val);
  });
}

function getCpCheckedVals(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(c => c.value);
}

function setCpCheckboxGroup(name, vals) {
  const arr = Array.isArray(vals) ? vals : [];
  document.querySelectorAll(`input[name="${name}"]`).forEach(c => {
    c.checked = arr.includes(c.value);
  });
}

function clearCpNone(noneId) {
  const n = document.getElementById(noneId);
  if (n) n.checked = false;
}

function isCpFemaleTitle() {
  const t = document.getElementById('patientTitleSelect')?.value || '';
  return ['นางสาว', 'นาง', 'เด็กหญิง', 'หญิง'].includes(t);
}

function updateChestpainFemaleCiVisibility(forceFemaleBool) {
  const showFem = typeof forceFemaleBool === 'boolean' ? forceFemaleBool : isCpFemaleTitle();
  toggleCpBranch('chestpain_ci_preg_wrap', showFem);
  if (!showFem) {
    const p = document.getElementById('ci_pregnancy_postpartum_1w');
    if (p) p.checked = false;
  }
}

function handleChestpainOnsetChange() {
  const val = getCpRadioVal('chestpainOnsetMode');
  const isInter = val === 'intermittent';
  toggleCpBranch('chestpain_onset_intermittent_branch', isInter);
  if (!isInter) setCpRadioVal('chestpainIntermittentBaseline', '');
}

function handleChestpainLocOtherToggle(checked) {
  toggleCpBranch('chestpain_loc_other_wrap', checked);
  if (!checked) {
    const inp = document.getElementById('chestpain_loc_other_text');
    if (inp) inp.value = '';
  }
}

function handleChestpainRadNoneChange(checked) {
  if (!checked) return;
  setCpCheckboxGroup('chestpain_rad', []);
  const oc = document.getElementById('chestpain_rad_other_chk');
  if (oc) oc.checked = false;
  handleChestpainRadOtherToggle(false, true);
  checkChestpainHighRiskMedTrigger();
}

function handleChestpainRadOtherToggle(checked, keepNone) {
  toggleCpBranch('chestpain_rad_other_wrap', checked);
  if (checked && !keepNone) clearCpNone('chestpain_rad_none');
  if (!checked) {
    const inp = document.getElementById('chestpain_rad_other_text');
    if (inp) inp.value = '';
  }
}

function handleChestpainRadChange() {
  const hasAny = getCpCheckedVals('chestpain_rad').length > 0 || Boolean(document.getElementById('chestpain_rad_other_chk')?.checked);
  if (hasAny) clearCpNone('chestpain_rad_none');
  checkChestpainHighRiskMedTrigger();
}

function handleChestpainCharOtherToggle(checked) {
  toggleCpBranch('chestpain_char_other_wrap', checked);
  if (!checked) {
    const inp = document.getElementById('chestpain_char_other_text');
    if (inp) inp.value = '';
  }
  handleChestpainCharChange();
}

function handleChestpainCharChange() {
  const chars = getCpCheckedVals('chestpain_char');
  const isDyspnea = Boolean(document.getElementById('chestpain_rf_dyspnea')?.checked);
  const isHemoptysis = Boolean(document.getElementById('chestpain_rf_hemoptysis')?.checked);
  const isCalf = Boolean(document.getElementById('chestpain_rf_calf_swelling')?.checked);
  const isBilatLeg = Boolean(document.getElementById('chestpain_bilateral_leg_edema')?.checked);
  const isAbdpain = Boolean(document.getElementById('chestpain_abdpain')?.checked);

  toggleCpBranch('chestpain_branch_pulm', chars.includes('pleuritic_sharp') || isDyspnea || isHemoptysis || isCalf || isBilatLeg);
  toggleCpBranch('chestpain_branch_gi', chars.includes('burning_heartburn') || isAbdpain);
  toggleCpBranch('chestpain_branch_msk', chars.includes('aching_tender'));
  checkChestpainHighRiskMedTrigger();
}

function handleChestpainNtgChange(val) {
  const v = val || getCpRadioVal('chestpainNtgHx');
  const show = v === 'yes';
  toggleCpBranch('chestpain_ntg_current_wrap', show);
  if (!show) setCpRadioVal('chestpainNtgCurrent', '');
}

function handleChestpainCardioItemChange(chkId) {
  if (document.getElementById(chkId)?.checked) clearCpNone('chestpain_cardio_none');
  checkChestpainHighRiskMedTrigger();
}

function syncChestpainAssocBranches() {
  const isDyspnea = Boolean(document.getElementById('chestpain_rf_dyspnea')?.checked);
  toggleCpBranch('chestpain_dyspnea_wrap', isDyspnea);
  if (!isDyspnea) setCpCheckboxGroup('chestpain_dyspnea_pattern', []);

  const isAbd = Boolean(document.getElementById('chestpain_abdpain')?.checked);
  toggleCpBranch('chestpain_abdpain_wrap', isAbd);
  if (!isAbd) {
    ['chestpain_abdpain_loc', 'chestpain_abdpain_char', 'chestpain_abdpain_rad'].forEach(n => setCpCheckboxGroup(n, []));
  }
  handleChestpainCharChange();
}

function handleChestpainAssocItemChange(chkId) {
  if (chkId && document.getElementById(chkId)?.checked) clearCpNone('chestpain_assoc_none');
  syncChestpainAssocBranches();
}

function handleChestpainGroupNoneChange(noneId, itemIds, onClear) {
  if (!document.getElementById(noneId)?.checked) return;
  itemIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.checked = false;
  });
  if (typeof onClear === 'function') onClear();
}

function handleChestpainMskTraumaToggle(checked) {
  if (checked) clearCpNone('chestpain_msk_none');
  toggleCpBranch('chestpain_trauma_detail_wrap', checked);
  if (!checked) {
    const inp = document.getElementById('chestpainTraumaDetail');
    if (inp) inp.value = '';
  }
}

function getChestpainAcsCriteriaCount() {
  const chars = getCpCheckedVals('chestpain_char');
  const rads = getCpCheckedVals('chestpain_rad');
  const criteria = [
    chars.includes('crushing_heavy'),
    getCpRadioVal('chestpainAnginaExertion') === 'rest',
    getCpRadioVal('chestpainAnginaOver20m') === 'yes',
    rads.includes('left_arm_shoulder'),
    rads.includes('neck_jaw'),
    Boolean(document.getElementById('chestpain_rf_diaphoresis')?.checked),
    Boolean(document.getElementById('chestpain_rf_syncope')?.checked),
    Boolean(document.getElementById('chestpain_rf_dyspnea')?.checked)
  ];
  return criteria.filter(Boolean).length;
}

function checkChestpainHighRiskMedTrigger() {
  const count = getChestpainAcsCriteriaCount();
  const shouldOpen = count >= 2 || chestpainHighRiskForcedOpen;

  toggleCpBranch('chestpain_high_risk_med_section', shouldOpen);
  toggleCpBranch('chestpain_ci_none_wrap', shouldOpen);
  toggleCpBranch('chestpain_high_risk_skipped_notice', !shouldOpen);
  toggleCpBranch('chestpain_high_risk_collapse_btn', count < 2 && chestpainHighRiskForcedOpen);
}

function forceOpenChestpainHighRiskMed() {
  chestpainHighRiskForcedOpen = true;
  checkChestpainHighRiskMedTrigger();
}

function collapseChestpainHighRiskMed() {
  chestpainHighRiskForcedOpen = false;
  checkChestpainHighRiskMedTrigger();
}

function handleChestpainCiSubToggle(chkId, wrapId, radioName) {
  const checked = Boolean(document.getElementById(chkId)?.checked);
  if (checked) clearCpNone('chestpain_ci_none');
  toggleCpBranch(wrapId, checked);
  if (!checked && radioName) setCpRadioVal(radioName, '');
}

function handleChestpainCiItemChange(chkId) {
  if (document.getElementById(chkId)?.checked) clearCpNone('chestpain_ci_none');
}

function handleChestpainCiNoneChange(checked) {
  if (!checked) return;
  [
    'ci_ich_tumor_avm', 'ci_ischemic_stroke_chk', 'ci_cns_surgery_3m', 'ci_major_surgery_3w',
    'ci_head_facial_trauma_3m', 'ci_internal_bleeding_chk', 'ci_prior_fibrinolytic',
    'ci_coagulopathy_anticoagulant', 'ci_pde5_inhibitor', 'ci_pregnancy_postpartum_1w'
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.checked = false;
  });
  setCpRadioVal('ci_ischemic_stroke', '');
  setCpRadioVal('ci_internal_bleeding', '');
  toggleCpBranch('ci_ischemic_stroke_wrap', false);
  toggleCpBranch('ci_internal_bleeding_wrap', false);
}

// --- Red Flags Evaluator (No Under, No Over) ---
function evaluateChestpainRedFlags(patient) {
  const redFlags = [];
  const chars = Array.isArray(patient.chestpainChars) ? patient.chestpainChars : [];
  const rads = Array.isArray(patient.chestpainRads) ? patient.chestpainRads : [];
  const dysPatterns = Array.isArray(patient.chestpainDyspneaPatterns) ? patient.chestpainDyspneaPatterns : [];

  if (patient.chestpain_rf_diaphoresis || patient.chestpain_rf_syncope) {
    redFlags.push({
      key: 'cardiogenic_shock',
      textTh: 'ภาวะช็อก / เหงื่อแตกตัวเย็นซีด / หน้ามืดหมดสติ (Impending Cardiogenic Shock / Syncope)',
      risk: 'เสี่ยงกล้ามเนื้อหัวใจขาดเลือดรุนแรงร่วมกับช็อก หรือหัวใจเต้นผิดจังหวะอันตราย ต้องทำ 12-lead EKG ภายใน 10 นาที'
    });
  }
  if ((chars.includes('tearing_sharp') || rads.includes('scapula')) && patient.chestpainOnsetMode === 'sudden_peak') {
    redFlags.push({
      key: 'aortic_dissection',
      textTh: 'เจ็บเสียบแทงฉีกขาดรุนแรงฉับพลันทะลุสะบักหลัง (Suspected Acute Aortic Dissection)',
      risk: 'เสี่ยงหลอดเลือดแดงใหญ่ฉีกขาดเฉียบพลัน ห้ามให้ยาต้านเกล็ดเลือด/สลายลิ่มเลือดก่อนตัดโรค และต้องวัด BP แขน 2 ข้าง'
    });
  }
  if ((patient.chestpain_rf_dyspnea || chars.includes('pleuritic_sharp')) &&
      (patient.chestpain_rf_hemoptysis || patient.chestpain_rf_calf_swelling || patient.chestpain_pulm_travel || patient.chestpain_pulm_bedridden || patient.chestpain_pulm_cancer_ocp)) {
    redFlags.push({
      key: 'pulmonary_embolism',
      textTh: 'เจ็บหน้าอกร่วมกับหอบเหนื่อย / ขาบวมข้างเดียว / ไอเป็นเลือด หรือมีปัจจัยเสี่ยงลิ่มเลือด (Suspected Acute PE)',
      risk: 'เสี่ยงภาวะลิ่มเลือดอุดกั้นในปอดเฉียบพลัน ควรประเมิน SpO2 และพิจารณาตรวจเพิ่มเติม'
    });
  }
  if ((chars.includes('crushing_heavy') || chars.includes('tight_dyspneic')) &&
      (patient.chestpainAnginaOver20m === true || patient.chestpainAnginaExertion === 'rest' || rads.includes('left_arm_shoulder') || rads.includes('neck_jaw') || patient.chestpainNtgCurrent === 'no_relief')) {
    redFlags.push({
      key: 'acute_coronary_syndrome',
      textTh: 'เจ็บแน่นเหมือนโดนของทับหน้าอก ต่อเนื่องเกิน 20 นาที / เจ็บขณะพัก / ไม่ดีขึ้นหลังอมยา (Suspected ACS)',
      risk: 'เสี่ยงกล้ามเนื้อหัวใจขาดเลือดเฉียบพลัน (STEMI / NSTEMI / High-risk UA) ต้องส่งตรวจ EKG 12 สายและ Troponin ทันที'
    });
  }
  if (patient.chestpain_rf_orthopnea || (patient.chestpain_rf_dyspnea && dysPatterns.includes('orthopnea'))) {
    redFlags.push({
      key: 'pulmonary_edema',
      textTh: 'แน่นหน้าอกร่วมกับนอนราบไม่ได้ ต้องลุกนั่งหอบ/นอนหัวสูง (Acute Pulmonary Edema)',
      risk: patient.chestpain_bilateral_leg_edema
        ? 'เสี่ยงภาวะหัวใจวายน้ำท่วมปอดและภาวะน้ำเกินในร่างกาย (พบร่วมกับขาบวม 2 ข้าง)'
        : 'เสี่ยงภาวะหัวใจวายน้ำท่วมปอดเฉียบพลัน'
    });
  }
  if (patient.chestpain_gi_severe_emesis) {
    redFlags.push({
      key: 'boerhaave_perforation',
      textTh: 'มีอาการอาเจียนรุนแรงนำมาก่อนเจ็บแน่นหน้าอก (Suspected Boerhaave Syndrome)',
      risk: 'เสี่ยงภาวะหลอดอาหารฉีกขาดทะลุ (Esophageal Perforation / Mediastinitis)'
    });
  }
  return redFlags;
}

// --- Doctor Note, CI Banner & JSON Output Renderer ---
function syncChestpainContraBanner(patient, absoluteList, relativeList, ciNoneConfirmed) {
  const banner = document.getElementById('cardiacContraindicationBanner');
  if (!banner) return;
  const absEl = document.getElementById('absoluteContraList');
  const relEl = document.getElementById('relativeContraList');
  const ntgEl = document.getElementById('ntgContraList');
  const fibBadge = document.getElementById('fibrinolyticStatusBadge');
  const ntgBadge = document.getElementById('ntgStatusBadge');
  if (!absEl || !relEl || !ntgEl || !fibBadge || !ntgBadge) return;

  const esc = (s) => (typeof escapeHtml === 'function' ? escapeHtml(s) : String(s || ''));

  if (absoluteList.length > 0) {
    absEl.innerHTML = absoluteList.map(item => `<li class="text-rose-400 font-medium">${esc(item)}</li>`).join('');
    fibBadge.textContent = '🛑 มีข้อห้ามเด็ดขาด (Absolute CI)';
    fibBadge.className = 'text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30';
  } else if (ciNoneConfirmed) {
    absEl.innerHTML = '<li class="text-emerald-400 font-normal">✓ ไม่พบข้อห้ามเด็ดขาด (No Absolute Contraindications Detected)</li>';
    if (relativeList.length > 0) {
      fibBadge.textContent = '⚠️ มีข้อห้ามสัมพัทธ์ (Relative CI)';
      fibBadge.className = 'text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30';
    } else {
      fibBadge.textContent = '✓ ปลอดภัยเบื้องต้น';
      fibBadge.className = 'text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
    }
  } else {
    absEl.innerHTML = '<li class="text-slate-300 font-normal">⏳ ยังไม่ได้ประเมิน</li>';
    if (relativeList.length > 0) {
      fibBadge.textContent = '⚠️ มีข้อห้ามสัมพัทธ์ (ส่วนอื่นยังไม่ได้ประเมิน)';
      fibBadge.className = 'text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30';
    } else {
      fibBadge.textContent = '⏳ ยังไม่ได้ประเมิน';
      fibBadge.className = 'text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-700 text-slate-200 border border-slate-500/40';
    }
  }

  if (relativeList.length > 0) {
    const bpWarn = '<li class="text-amber-300/90 font-normal">ความดันโลหิตสูงรุนแรง: SBP &gt; 180 หรือ DBP &gt; 110 mmHg (ต้องประเมิน V/S)</li>';
    relEl.innerHTML = relativeList.map(item => `<li class="text-amber-300/90 font-normal">${esc(item)}</li>`).join('') + bpWarn;
  } else if (ciNoneConfirmed) {
    relEl.innerHTML = '<li class="text-amber-300/90 font-normal">ความดันโลหิตสูงรุนแรง: SBP &gt; 180 หรือ DBP &gt; 110 mmHg (ต้องประเมิน V/S)</li>';
  } else {
    relEl.innerHTML = '<li class="text-slate-300 font-normal">⏳ ยังไม่ได้ประเมิน (และต้องตรวจวัด V/S: SBP &gt; 180 / DBP &gt; 110 mmHg ก่อนให้ยา)</li>';
  }

  const bpLowWarn = (patient.chestpain_rf_diaphoresis || patient.chestpain_rf_syncope)
    ? '<li class="text-amber-300/90 font-normal">⚠️ มีอาการหน้ามืด วูบ หรือเหงื่อแตกตัวเย็นซีด (ห้ามให้หาก SBP &lt; 90 mmHg)</li>'
    : '';
  if (patient.ci_pde5_inhibitor) {
    ntgEl.innerHTML = '<li class="text-rose-400 font-medium">🚫 ใช้ยากลุ่มเสริมสมรรถภาพทางเพศ (PDE-5 Inhibitor) ภายใน 24–48 ชม. (เสี่ยง Severe Hypotension / Shock)</li>' + bpLowWarn;
    ntgBadge.textContent = '🚫 ห้ามใช้ (Contraindicated)';
    ntgBadge.className = 'text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30';
  } else if (ciNoneConfirmed) {
    ntgEl.innerHTML = bpLowWarn || '<li class="text-emerald-400 font-normal">✓ ไม่พบข้อห้ามใช้ Nitroglycerin (ปฏิเสธ PDE-5 inhibitor)</li>';
    ntgBadge.textContent = bpLowWarn ? '⚠️ ควรวัด BP ก่อนให้' : '✓ ปลอดภัย';
    ntgBadge.className = `text-[10px] px-2 py-0.5 rounded-full font-bold ${bpLowWarn ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`;
  } else {
    ntgEl.innerHTML = '<li class="text-slate-300 font-normal">⏳ ยังไม่ได้ประเมิน</li>' + bpLowWarn;
    ntgBadge.textContent = bpLowWarn ? '⚠️ ยังไม่ได้ประเมิน (วัด BP ก่อนให้)' : '⏳ ยังไม่ได้ประเมิน';
    ntgBadge.className = `text-[10px] px-2 py-0.5 rounded-full font-bold ${bpLowWarn ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-700 text-slate-200 border border-slate-500/40'}`;
  }
}

function updateChestPainOutputs(patient) {
  const durationText = patient.durationVal ? `${patient.durationVal} ${CP_LABELS.units[patient.durationUnit] || 'ชั่วโมง'}` : 'ไม่ระบุ';
  const onsetBase = CP_LABELS.onset[patient.chestpainOnsetMode] || '';
  const onsetSub = CP_LABELS.intermittentBaseline[patient.chestpainIntermittentBaseline] || '';
  const onsetStr = onsetBase ? (onsetSub ? `${onsetBase} (${onsetSub})` : onsetBase) : 'ไม่ได้ระบุ';

  const locsStr = (patient.chestpainLocs?.length > 0)
    ? patient.chestpainLocs.map(l => CP_LABELS.locs[l] || l).join(', ')
    : 'ไม่ได้ระบุ';
  const radsArr = Array.isArray(patient.chestpainRads) ? patient.chestpainRads : [];
  const radsStr = radsArr.length > 0
    ? radsArr.map(r => CP_LABELS.rads[r] || r).join(', ')
    : 'ไม่ได้ระบุ';
  const charsStr = (patient.chestpainChars?.length > 0)
    ? patient.chestpainChars.map(c => CP_LABELS.chars[c] || c).join(', ')
    : 'ไม่ได้ระบุ';
  const painScoreText = (patient.chestpainPainScore !== undefined && patient.chestpainPainScore !== null)
    ? `${patient.chestpainPainScore}/10`
    : 'ไม่ได้ระบุ';

  const exertionStr = CP_LABELS.anginaExertion[patient.chestpainAnginaExertion] || 'ไม่ได้ระบุ';
  const over20mStr = patient.chestpainAnginaOver20m === true
    ? 'แน่นต่อเนื่องเกิน 20 นาที'
    : (patient.chestpainAnginaOver20m === false
      ? 'แน่นไม่เกิน 20 นาทีแล้วทุเลา'
      : (patient.chestpainAnginaOver20mStatus === 'unsure' ? 'ไม่แน่ใจ' : 'ไม่ได้ระบุ'));

  let ntgStr = 'ไม่ได้ระบุ';
  if (patient.chestpainNtgHx === true) {
    const resp = CP_LABELS.ntgCurrent[patient.chestpainNtgCurrent];
    ntgStr = resp ? `เคยได้รับ (${resp})` : 'เคยได้รับ (ไม่ได้ระบุผลรอบนี้)';
  } else if (patient.chestpainNtgHx === false) {
    ntgStr = 'ไม่เคยได้รับ';
  } else if (patient.chestpainNtgHxStatus === 'unsure') {
    ntgStr = 'ไม่แน่ใจ';
  }

  const positives = [];
  const negatives = [];

  if (radsArr.includes('none')) negatives.push('ไม่ปวดร้าวไปตำแหน่งอื่น');
  if (patient.chestpainAnginaOver20m === false) negatives.push('แน่นไม่เกิน 20 นาทีแล้วทุเลา');
  if (patient.chestpainNtgHx === false) negatives.push('ไม่เคยได้รับยาอมใต้ลิ้น');

  // Cardiovascular / Circulatory Warning Section (Zero Default Bias)
  const hasDiaph = Boolean(patient.chestpain_rf_diaphoresis);
  const hasSync = Boolean(patient.chestpain_rf_syncope);
  const hasPalp = Boolean(patient.chestpain_rf_palpitation);
  const hasOrtho = Boolean(patient.chestpain_rf_orthopnea);
  const cardioAnswered = Boolean(patient.chestpain_cardio_none || hasDiaph || hasSync || hasPalp || hasOrtho);
  if (cardioAnswered) {
    if (hasDiaph) positives.push('มีเหงื่อแตก ตัวเย็น / ซีดเพลีย');
    else negatives.push('ไม่มีเหงื่อแตกตัวเย็น');
    if (hasSync) positives.push('มีอาการหน้ามืด / วูบ / หมดสติ');
    else negatives.push('ไม่มีหน้ามืดวูบหมดสติ');
    if (hasPalp) positives.push('มีอาการใจสั่น / หัวใจเต้นสะดุด');
    else negatives.push('ไม่มีอาการใจสั่น');
    if (hasOrtho) positives.push('นอนราบไม่ได้ ลุกนั่งหอบ / ต้องนอนหัวสูง');
    else negatives.push('นอนราบได้ปกติ');
  }

  // Resp / Vascular / Abd Associated Symptoms (Zero Default Bias)
  const hasDysp = Boolean(patient.chestpain_rf_dyspnea);
  const hasHemopt = Boolean(patient.chestpain_rf_hemoptysis);
  const hasCalf = Boolean(patient.chestpain_rf_calf_swelling);
  const hasBilat = Boolean(patient.chestpain_bilateral_leg_edema);
  const hasAbd = Boolean(patient.chestpain_abdpain);
  const assocAnswered = Boolean(patient.chestpain_assoc_none || hasDysp || hasHemopt || hasCalf || hasBilat || hasAbd);
  if (assocAnswered) {
    if (hasDysp) {
      const pStr = patient.chestpainDyspneaPatterns?.map(p => CP_LABELS.dyspneaPattern[p] || p).join(', ');
      positives.push(pStr ? `หายใจหอบเหนื่อย (${pStr})` : 'มีอาการหายใจหอบเหนื่อย');
    } else negatives.push('ปฏิเสธหายใจหอบเหนื่อย');

    if (hasHemopt) positives.push('ไอมีเสมหะปนเลือดสด');
    else negatives.push('ไม่มีไอเป็นเลือด');

    if (hasCalf) positives.push('ขาบวม หรือปวดน่องข้างเดียว');
    if (hasBilat) positives.push('ขาบวม 2 ข้าง');
    if (!hasCalf && !hasBilat) negatives.push('ไม่มีขาบวมหรือปวดน่อง');

    if (hasAbd) {
      const lStr = patient.chestpainAbdpainLocs?.map(l => CP_LABELS.abdpainLoc[l] || l).join(', ') || 'ไม่ระบุตำแหน่ง';
      const cStr = patient.chestpainAbdpainChars?.map(c => CP_LABELS.abdpainChar[c] || c).join(', ') || 'ไม่ระบุลักษณะ';
      const rStr = patient.chestpainAbdpainRads?.length > 0 ? `, ร้าวไป: ${patient.chestpainAbdpainRads.map(r => CP_LABELS.abdpainRad[r] || r).join(', ')}` : '';
      positives.push(`มีอาการปวดท้องร่วมด้วย: ตำแหน่ง [${lStr}] ลักษณะ [${cStr}]${rStr}`);
    } else negatives.push('ไม่มีอาการปวดท้อง');
  }

  // Differential Sub-branches
  const hasPulmItems = patient.chestpain_pulm_travel || patient.chestpain_pulm_bedridden || patient.chestpain_pulm_cancer_ocp;
  if (patient.chestpain_pulm_travel) positives.push('นั่งรถ/เครื่องบินทางไกล > 4 ชม. ในช่วง 4 สัปดาห์');
  if (patient.chestpain_pulm_bedridden) positives.push('นอนติดเตียง / เพิ่งผ่าตัดใหญ่ / เพิ่งเข้าเฝือกขา');
  if (patient.chestpain_pulm_cancer_ocp) positives.push('มีโรคมะเร็ง หรือทานยาคุม-ฮอร์โมน');
  if (patient.chestpain_pulm_none && !hasPulmItems) negatives.push('ไม่มีปัจจัยเสี่ยงลิ่มเลือดอุดกั้นปอด');

  const hasGiItems = patient.chestpain_gi_heartburn_up || patient.chestpain_gi_regurgitation || patient.chestpain_gi_post_meal || patient.chestpain_gi_dysphagia || patient.chestpain_gi_severe_emesis;
  if (patient.chestpain_gi_heartburn_up) positives.push('แสบร้อนเหนือลิ้นปี่ / มีลมดันตีขึ้น');
  if (patient.chestpain_gi_regurgitation) positives.push('มีขย้อนเปรี้ยว / เรอเปรี้ยว');
  if (patient.chestpain_gi_post_meal) positives.push('จุกแน่นหลังอาหารมื้อใหญ่ หรือเมื่อนอนราบ');
  if (patient.chestpain_gi_dysphagia) positives.push('มีอาการกลืนลำบาก หรือกลืนเจ็บ');
  if (patient.chestpain_gi_severe_emesis) positives.push('คลื่นไส้อาเจียนรุนแรงนำมาก่อนเจ็บหน้าอก');
  if (patient.chestpain_gi_none && !hasGiItems) negatives.push('ไม่มีอาการทางเดินอาหาร/กรดไหลย้อนร่วมด้วย');

  const hasMskItems = patient.chestpain_msk_tender || patient.chestpain_msk_movement || patient.chestpain_msk_heavy_lifting || patient.chestpain_msk_trauma;
  if (patient.chestpain_msk_tender) positives.push('กดเจ็บชัดเจนบนกระดูกซี่โครง');
  if (patient.chestpain_msk_movement) positives.push('เจ็บมากขึ้นเมื่อเอี้ยวหรือบิดตัว');
  if (patient.chestpain_msk_heavy_lifting) positives.push('มีประวัติยกของหนักหรือบิดผิดท่า');
  if (patient.chestpain_msk_trauma) positives.push(`มีประวัติอุบัติเหตุ: "${patient.chestpainTraumaDetail || 'ไม่ระบุรายละเอียด'}"`);
  if (patient.chestpain_msk_none && !hasMskItems) negatives.push('ไม่มีอาการทางกล้ามเนื้อ/กระดูกทรวงอก');

  if (patient.otherSymptomsFree) positives.push(patient.otherSymptomsFree);

  patient.pertinentPositives = positives.length > 0 ? positives : ['ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม'];
  patient.pertinentNegatives = negatives.length > 0 ? negatives : ['ผู้ป่วยไม่ได้ระบุคำตอบยืนยันในหมวดอาการร่วม'];

  // CAD Background
  const udArr = Array.isArray(patient.underlying) ? patient.underlying.filter(u => u && !u.includes('ปฏิเสธ') && u !== 'ไม่มี' && u !== 'ไม่มีโรคประจำตัว') : [];
  const udExplicitDeny = Array.isArray(patient.underlying) && patient.underlying.some(u => u && (u.includes('ปฏิเสธ') || u === 'ไม่มี' || u === 'ไม่มีโรคประจำตัว'));
  const pmhAnswered = patient.hospRecordStatus === 'self' || patient.hospRecordStatus === 'additional' || udExplicitDeny || udArr.length > 0;
  let cadSummary = pmhAnswered ? 'ปฏิเสธ' : 'ไม่ได้ระบุ';
  if (udArr.some(u => u.includes('หลอดเลือดหัวใจ') || u.includes('CAD'))) {
    if (patient.ud_cad_hosp_status === 'ratchaburi') {
      cadSummary = 'รักษาที่ รพ.ราชบุรี ครบถ้วน';
    } else {
      const txArr = [];
      if (patient.ud_cad_pci) txArr.push('PCI/Stent');
      if (patient.ud_cad_cabg) txArr.push('CABG');
      if (patient.ud_cad_meds) txArr.push('ยาควบคุมอาการ');
      cadSummary = `รพ.อื่น [${patient.ud_cad_hosp_name || 'ไม่ระบุชื่อ รพ.'}] (${txArr.join(', ') || 'ไม่ระบุหัตถการ'})`;
    }
  }

  // Contraindications Evaluation
  const rfs = evaluateChestpainRedFlags(patient);
  patient.redFlags = rfs;

  const isStrokePositive = patient.ci_ischemic_stroke && patient.ci_ischemic_stroke !== 'none' && patient.ci_ischemic_stroke !== 'unspecified';
  const isBleedPositive = patient.ci_internal_bleeding && patient.ci_internal_bleeding !== 'none' && patient.ci_internal_bleeding !== 'unspecified';
  const isPregTriggered = patient.gender === 'หญิง' && patient.ci_pregnancy_postpartum_1w;
  const ciAnswered = Boolean(
    patient.chestpain_ci_none || patient.ci_ich_tumor_avm || isStrokePositive ||
    patient.ci_ischemic_stroke === 'none' || patient.ci_cns_surgery_3m ||
    patient.ci_major_surgery_3w || patient.ci_head_facial_trauma_3m || isBleedPositive ||
    patient.ci_internal_bleeding === 'none' || patient.ci_prior_fibrinolytic ||
    patient.ci_coagulopathy_anticoagulant || isPregTriggered || patient.ci_pde5_inhibitor
  );

  const absoluteList = [];
  const relativeList = [];
  if (patient.ci_ich_tumor_avm) absoluteList.push('เคยมีเลือดออก/เนื้องอก/หลอดเลือดผิดปกติในสมอง');
  if (patient.ci_ischemic_stroke === 'within_3m') absoluteList.push('Ischemic Stroke < 3 เดือน');
  if (patient.ci_cns_surgery_3m) absoluteList.push('ผ่าตัดสมอง/ไขสันหลัง < 3 เดือน');
  if (patient.ci_major_surgery_3w) absoluteList.push('ผ่าตัดใหญ่ < 3 สัปดาห์');
  if (patient.ci_head_facial_trauma_3m) absoluteList.push('บาดเจ็บรุนแรงศีรษะ/ใบหน้า < 3 เดือน');
  if (patient.ci_internal_bleeding === 'current_active') absoluteList.push('แผลเลือดออกภายใน/ทางเดินอาหารที่กำลังดำเนินอยู่');
  if (patient.chestpainChars?.includes('tearing_sharp') || rfs.some(rf => rf.key === 'aortic_dissection')) {
    absoluteList.push('สงสัย Aortic Dissection');
  }

  if (patient.ci_ischemic_stroke === '3_to_6m') relativeList.push('Ischemic Stroke 3–6 เดือน');
  else if (patient.ci_ischemic_stroke === 'gt_6m') relativeList.push('Ischemic Stroke > 6 เดือน (ต้องทบทวนร่วมด้วย)');
  else if (patient.ci_ischemic_stroke === 'unsure') relativeList.push('ประวัติหลอดเลือดสมองตีบ (ไม่แน่ใจช่วงเวลา)');
  else if (patient.ci_ischemic_stroke === 'timing_unspecified') relativeList.push('มีประวัติหลอดเลือดสมองตีบ (ไม่ได้ระบุช่วงเวลา)');

  if (patient.ci_internal_bleeding === 'within_1m') relativeList.push('เลือดออกภายใน/ทางเดินอาหาร < 1 เดือน');
  else if (patient.ci_internal_bleeding === 'gt_1m') relativeList.push('ประวัติเลือดออกภายใน > 1 เดือน (ต้องทบทวนร่วมด้วย)');
  else if (patient.ci_internal_bleeding === 'unsure') relativeList.push('ประวัติเลือดออกภายใน/ทางเดินอาหาร (ไม่แน่ใจช่วงเวลา)');
  else if (patient.ci_internal_bleeding === 'timing_unspecified') relativeList.push('มีประวัติเลือดออกภายใน/ทางเดินอาหาร (ไม่ได้ระบุช่วงเวลา)');

  if (patient.ci_prior_fibrinolytic) relativeList.push('เคยได้รับยาสลายลิ่มเลือดจากหัวใจขาดเลือดในอดีต');
  if (patient.ci_coagulopathy_anticoagulant) relativeList.push('เลือดออกง่ายหยุดยาก / ทานยาละลายลิ่มเลือด');
  if (isPregTriggered) relativeList.push('ตั้งครรภ์ / หลังคลอด < 1 สัปดาห์');

  const ciNoneConfirmed = Boolean(patient.chestpain_ci_none);
  const absCiText = absoluteList.length > 0 ? absoluteList.join(', ') : (ciNoneConfirmed ? 'ไม่พบข้อห้ามเด็ดขาด' : 'ยังไม่ได้ประเมิน');
  const relCiText = relativeList.length > 0 ? relativeList.join(', ') : (ciNoneConfirmed ? 'ไม่พบข้อห้ามสัมพัทธ์' : 'ยังไม่ได้ประเมิน');
  const ntgSafetyText = patient.ci_pde5_inhibitor
    ? '🚫 CONTRAINDICATED (ใช้ PDE-5 inhibitor ใน 24–48 ชม.)'
    : (ciNoneConfirmed ? '✓ ปลอดภัย (ปฏิเสธ PDE-5 inhibitor)' : 'ยังไม่ได้ประเมิน');

  syncChestpainContraBanner(patient, absoluteList, relativeList, ciNoneConfirmed);

  const hospLabel = CP_LABELS.hospStatus[patient.hospRecordStatus] || 'ไม่ได้ระบุ';
  const docNotes = patient.doctor_notes || {};
  const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ') ? 'ไม่ได้ระบุ' : patient.currentMeds;
  const udText = udArr.length > 0 ? udArr.join(', ') : (pmhAnswered ? 'ปฏิเสธ' : 'ไม่ได้ระบุ');
  const allergyText = (!patient.drugAllergy || patient.drugAllergy === 'ไม่ได้ระบุ')
    ? 'ไม่ได้ระบุ'
    : ((patient.drugAllergy.includes('ปฏิเสธ') || patient.drugAllergy === 'ไม่มี') ? 'ปฏิเสธ' : patient.drugAllergy);

  const defaultRapid =
`[Chief Complaint (CC)]
เจ็บแน่นหน้าอกมา ${durationText}

[History of Present Illness (HPI)]
• การเริ่มต้นและระยะเวลา: แน่นมา ${durationText}, การเริ่ม: ${onsetStr}
• ตำแหน่งและอาการร้าว: ตำแหน่ง [${locsStr}], ร้าวไป [${radsStr}]
• ลักษณะอาการแน่น/เจ็บ: ${charsStr}
• ระดับความปวด (Pain Score): ${painScoreText}
• ความสัมพันธ์ Angina & ยาอมใต้ลิ้น: ออกแรง/พัก [${exertionStr}], ระยะเวลา [${over20mStr}], ยาอมใต้ลิ้น [${ntgStr}]

• Pertinent Positives:
${patient.pertinentPositives.map(p => `  - ${p}`).join('\n')}

• Pertinent Negatives:
${patient.pertinentNegatives.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• โรคหลอดเลือดหัวใจเดิม (CAD Background): ${cadSummary}
• โรคประจำตัว (U/D): ${udText}
• ยาประจำตัว (Current Meds): ${medsText}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${allergyText}
• Fibrinolytic Absolute CI: ${absCiText}
• Fibrinolytic Relative CI: ${relCiText}
• Nitroglycerin Safety: ${ntgSafetyText}

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
`ผู้ป่วย [${patient.name || 'ไม่ระบุชื่อ'}] อายุ ${patient.age || '-'} ปี เพศ ${patient.gender || 'ไม่ระบุ'} มารับการตรวจที่ห้องฉุกเฉิน รพ.ราชบุรี ด้วยอาการเจ็บแน่นหน้าอกมา ${durationText}
การเริ่มเจ็บ: ${onsetStr}, ตำแหน่ง: ${locsStr}, ลักษณะ: ${charsStr}, ปวดร้าว: ${radsStr}, Pain Score: ${painScoreText}, ความสัมพันธ์การออกแรง: ${exertionStr}, ระยะเวลาต่อครั้ง: ${over20mStr}, ยาอมใต้ลิ้น: ${ntgStr}
อาการร่วมที่พบ: ${patient.pertinentPositives.join(', ')}
อาการสำคัญที่ปฏิเสธ: ${patient.pertinentNegatives.join(', ')}
ประวัติสุขภาพ: [${hospLabel}], CAD เดิม: ${cadSummary}, โรคประจำตัว: ${udText}, ยาประจำตัว: ${medsText}, แพ้ยา: ${allergyText}
คัดกรองยาฉุกเฉิน: Absolute CI [${absCiText}], Relative CI [${relCiText}], Nitroglycerin [${ntgSafetyText}]
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
    "chief_complaint": "chest_pain",
    "chest_pain_history": {
      "duration_value": patient.durationVal || null,
      "duration_unit": patient.durationVal ? (patient.durationUnit || 'hours') : null,
      "pain_score": (patient.chestpainPainScore !== undefined && patient.chestpainPainScore !== null) ? patient.chestpainPainScore : null,
      "onset_mode": patient.chestpainOnsetMode || null,
      "intermittent_baseline": patient.chestpainIntermittentBaseline || null,
      "pain_locations": patient.chestpainLocs || [],
      "pain_radiation": radsArr,
      "pain_characteristics": patient.chestpainChars || [],
      "angina_evaluation": {
        "exertion_relation": patient.chestpainAnginaExertion || null,
        "duration_over_20_mins": patient.chestpainAnginaOver20m !== undefined ? patient.chestpainAnginaOver20m : null,
        "duration_over_20_mins_status": patient.chestpainAnginaOver20mStatus || null,
        "sublingual_ntg_history": patient.chestpainNtgHx !== undefined ? patient.chestpainNtgHx : null,
        "sublingual_ntg_status": patient.chestpainNtgHxStatus || null,
        "sublingual_ntg_response": patient.chestpainNtgCurrent || null
      }
    },
    "associated_symptoms_and_review_of_systems": {
      "cardio_answered_none": Boolean(patient.chestpain_cardio_none),
      "diaphoresis": Boolean(patient.chestpain_rf_diaphoresis),
      "syncope": Boolean(patient.chestpain_rf_syncope),
      "palpitations": Boolean(patient.chestpain_rf_palpitation),
      "orthopnea": Boolean(patient.chestpain_rf_orthopnea),
      "assoc_answered_none": Boolean(patient.chestpain_assoc_none),
      "dyspnea": { "present": Boolean(patient.chestpain_rf_dyspnea), "patterns": patient.chestpainDyspneaPatterns || [] },
      "hemoptysis": Boolean(patient.chestpain_rf_hemoptysis),
      "unilateral_calf_swelling": Boolean(patient.chestpain_rf_calf_swelling),
      "bilateral_leg_edema": Boolean(patient.chestpain_bilateral_leg_edema),
      "associated_abdominal_pain": {
        "present": Boolean(patient.chestpain_abdpain),
        "locations": patient.chestpainAbdpainLocs || [],
        "characteristics": patient.chestpainAbdpainChars || [],
        "radiation": patient.chestpainAbdpainRads || []
      },
      "pulmonary_embolism_risk_screen": {
        "answered_none": Boolean(patient.chestpain_pulm_none),
        "prolonged_travel_over_4hr": Boolean(patient.chestpain_pulm_travel),
        "recent_immobilization_or_surgery": Boolean(patient.chestpain_pulm_bedridden),
        "malignancy_or_hormone_therapy": Boolean(patient.chestpain_pulm_cancer_ocp)
      },
      "gastrointestinal_gerd_screen": {
        "answered_none": Boolean(patient.chestpain_gi_none),
        "heartburn_or_upward_gas": Boolean(patient.chestpain_gi_heartburn_up),
        "acid_regurgitation": Boolean(patient.chestpain_gi_regurgitation),
        "postprandial_or_recumbent": Boolean(patient.chestpain_gi_post_meal),
        "dysphagia": Boolean(patient.chestpain_gi_dysphagia),
        "severe_emesis_preceding_pain": Boolean(patient.chestpain_gi_severe_emesis)
      },
      "musculoskeletal_chest_wall": {
        "answered_none": Boolean(patient.chestpain_msk_none),
        "point_tenderness_on_ribs": Boolean(patient.chestpain_msk_tender),
        "worse_with_torso_movement": Boolean(patient.chestpain_msk_movement),
        "heavy_lifting_or_twisting_history": Boolean(patient.chestpain_msk_heavy_lifting),
        "trauma_history": { "present": Boolean(patient.chestpain_msk_trauma), "trauma_details": patient.chestpainTraumaDetail || '' }
      },
      "other_symptoms_free_text": patient.otherSymptomsFree || ''
    },
    "high_risk_medication_contraindications": {
      "screened": ciAnswered,
      "answered_none": Boolean(patient.chestpain_ci_none),
      "ischemic_stroke_status": patient.ci_ischemic_stroke || 'unspecified',
      "internal_bleeding_status": patient.ci_internal_bleeding || 'unspecified',
      "fibrinolytic_absolute_contraindications": absoluteList,
      "fibrinolytic_relative_contraindications": relativeList,
      "nitroglycerin_contraindicated_pde5_use": Boolean(patient.ci_pde5_inhibitor)
    },
    "red_flags_detected": rfs.map(rf => ({ code: rf.key, label: rf.textTh, clinical_risk: rf.risk })),
    "pertinent_positives": patient.pertinentPositives,
    "pertinent_negatives": patient.pertinentNegatives,
    "patient_background": {
      "hospital_record_status": patient.hospRecordStatus || 'unspecified',
      "coronary_artery_disease_background": {
        "known_cad": udArr.some(u => u.includes('หลอดเลือดหัวใจ') || u.includes('CAD')),
        "ratchaburi_hospital_record": patient.ud_cad_hosp_status === 'ratchaburi',
        "prior_pci_stent": Boolean(patient.ud_cad_pci),
        "prior_cabg": Boolean(patient.ud_cad_cabg),
        "medical_therapy_only": Boolean(patient.ud_cad_meds),
        "original_hospital_name": patient.ud_cad_hosp_name || ''
      },
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

// --- Compact UI Helpers (Thai Word-Boundary Wrap Guard + C-AP1 Compliant) ---
function cpWrap(...chunks) {
  return chunks.map(c => `<span class="inline-block whitespace-nowrap">${c}</span>`).join(' ');
}

function renderCpOpt(opt) {
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
  if (opt.desc) {
    return `<label class="selectable-card ${bgCls}flex items-start ${padCls} rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition${spanCls}"><input type="${kind}" ${idAttr} ${nameAttr} ${valAttr} ${chgAttr} class="mt-0.5 text-medical-600 focus:ring-medical-500 ${iconSz} rounded flex-shrink-0"><div class="ml-3 leading-snug"><span class="block ${txtCls} text-slate-800">${opt.title}</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">${opt.desc}</span></div></label>`;
  }
  return `<label class="selectable-card ${bgCls}flex items-center ${padCls} rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition${spanCls}"><input type="${kind}" ${idAttr} ${nameAttr} ${valAttr} ${chgAttr} class="text-medical-600 focus:ring-medical-500 ${iconSz} rounded flex-shrink-0"><span class="ml-3 ${txtCls} text-slate-800 leading-snug">${opt.title}</span></label>`;
}

function renderCpGrid(colsClass, options) {
  return `<div class="grid ${colsClass} gap-2">${options.map(renderCpOpt).join('\n        ')}</div>`;
}

function renderCpSysHeader(icon, colorClass, title, noneId, noneHandler, noneText = 'ไม่มีอาการในหมวดนี้') {
  return `<div class="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2.5 border-b border-slate-100">
    <h3 class="text-xs sm:text-sm font-bold text-slate-800 flex items-center">
      <i data-lucide="${icon}" class="w-4 h-4 ${colorClass} mr-1.5 flex-shrink-0"></i>${title}
    </h3>
    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-lg border border-slate-200 hover:border-medical-300 bg-slate-50 cursor-pointer transition flex-shrink-0">
      <input type="checkbox" id="${noneId}" onchange="${noneHandler}" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded flex-shrink-0">
      <span class="ml-3 text-[11px] font-medium text-slate-600 whitespace-nowrap">${noneText}</span>
    </label>
  </div>`;
}

// --- Patient Form HTML Templates (3 Main Cards + Card 4 Dynamic High-Risk Med Screening) ---
const CP_CARD1_HTML = `
<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
  <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
    <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="clock" class="w-5 h-5"></i></div>
    <div>
      <h2 class="text-base font-bold text-slate-900">1. ระยะเวลา ตำแหน่ง และลักษณะการเจ็บหน้าอก</h2>
      <p class="text-xs text-slate-500">ข้อมูลเริ่มต้นเกี่ยวกับอาการเจ็บแน่นหน้าอกของท่าน</p>
    </div>
  </div>
  <div class="space-y-5">
    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">เจ็บแน่นหน้าอกมานานเท่าไรแล้ว? <span class="text-rose-500">*</span></label>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div class="col-span-1 sm:col-span-2">
          <input type="number" id="chestpainDurationVal" min="1" max="1000" placeholder="เช่น 1 หรือ 30" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm placeholder:text-slate-400 placeholder:font-normal">
        </div>
        <div class="col-span-1">
          <select id="chestpainDurationUnit" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm">
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
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">การเริ่มต้นของอาการ</label>
      ${renderCpGrid('grid-cols-2 sm:grid-cols-4', [
        { kind: 'radio', name: 'chestpainOnsetMode', value: 'sudden_peak', onchange: 'handleChestpainOnsetChange()', title: cpWrap('เจ็บรุนแรง', 'ทันทีทันใด') },
        { kind: 'radio', name: 'chestpainOnsetMode', value: 'gradual', onchange: 'handleChestpainOnsetChange()', title: cpWrap('ค่อยๆ แน่น', 'มากขึ้น') },
        { kind: 'radio', name: 'chestpainOnsetMode', value: 'intermittent', onchange: 'handleChestpainOnsetChange()', title: cpWrap('เป็นๆ หายๆ', 'เป็นพักๆ') },
        { kind: 'radio', name: 'chestpainOnsetMode', value: 'chronic_stable', onchange: 'handleChestpainOnsetChange()', title: cpWrap('มีอาการเรื้อรัง', 'มานาน') }
      ])}
      <div id="chestpain_onset_intermittent_branch" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-2.5 space-y-2">
        <label class="block text-xs font-semibold text-slate-700">ช่วงเว้นจากอาการเจ็บ เป็นอย่างไร?</label>
        ${renderCpGrid('grid-cols-1 sm:grid-cols-2', [
          { kind: 'radio', name: 'chestpainIntermittentBaseline', value: 'pain_free', title: cpWrap('หายสนิท ไม่เจ็บเลย'), compact: true, bgWhite: true },
          { kind: 'radio', name: 'chestpainIntermittentBaseline', value: 'improved_persistent', title: cpWrap('ทุเลาลง แต่ยังแน่นตื้อๆ อยู่'), compact: true, bgWhite: true }
        ])}
      </div>
    </div>

    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">ตำแหน่งที่รู้สึกเจ็บชัดเจนที่สุด (เลือกได้หลายข้อ)</label>
      ${renderCpGrid('grid-cols-2 sm:grid-cols-3', [
        { name: 'chestpain_loc', value: 'substernal', title: cpWrap('กลางหน้าอก /', 'หลังกระดูกอก') },
        { name: 'chestpain_loc', value: 'left_chest', title: cpWrap('อกซ้าย') },
        { name: 'chestpain_loc', value: 'right_chest', title: cpWrap('อกขวา') },
        { name: 'chestpain_loc', value: 'epigastrium', title: cpWrap('ใต้ลิ้นปี่ /', 'เหนือลิ้นปี่') },
        { name: 'chestpain_loc', value: 'diffuse', title: cpWrap('ทั่วทั้งหน้าอก', '(ระบุจุดไม่ได้)') },
        { id: 'chestpain_loc_other_chk', onchange: 'handleChestpainLocOtherToggle(this.checked)', title: cpWrap('ตำแหน่งอื่นๆ (ระบุ)') }
      ])}
      <div id="chestpain_loc_other_wrap" class="hidden mt-2">
        <input type="text" id="chestpain_loc_other_text" placeholder="ระบุตำแหน่งที่เจ็บหน้าอกเพิ่มเติม..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white">
      </div>
    </div>

    <div>
      <div class="flex items-center justify-between gap-2 mb-2">
        <label class="text-xs font-semibold text-slate-700 uppercase tracking-wider">อาการเจ็บร้าวไปตำแหน่งอื่น</label>
        <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-lg border border-slate-200 hover:border-medical-300 bg-slate-50 cursor-pointer transition flex-shrink-0">
          <input type="checkbox" id="chestpain_rad_none" onchange="handleChestpainRadNoneChange(this.checked)" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded flex-shrink-0">
          <span class="ml-3 text-[11px] font-medium text-slate-600 whitespace-nowrap">ไม่ร้าวไปที่อื่น</span>
        </label>
      </div>
      ${renderCpGrid('grid-cols-2 sm:grid-cols-3', [
        { name: 'chestpain_rad', value: 'scapula', onchange: 'handleChestpainRadChange()', title: cpWrap('สะบัก / กลางหลัง') },
        { name: 'chestpain_rad', value: 'neck_jaw', onchange: 'handleChestpainRadChange()', title: cpWrap('คอ / กราม / คาง') },
        { name: 'chestpain_rad', value: 'left_arm_shoulder', onchange: 'handleChestpainRadChange()', title: cpWrap('ไหล่ซ้าย / แขนซ้าย') },
        { name: 'chestpain_rad', value: 'right_shoulder', onchange: 'handleChestpainRadChange()', title: cpWrap('ไหล่ขวา / แขนขวา') },
        { name: 'chestpain_rad', value: 'abdomen', onchange: 'handleChestpainRadChange()', title: cpWrap('ลงท้อง / ลิ้นปี่') },
        { id: 'chestpain_rad_other_chk', onchange: 'handleChestpainRadOtherToggle(this.checked)', title: cpWrap('ร้าวไปตำแหน่งอื่น', '(ระบุ)') }
      ])}
      <div id="chestpain_rad_other_wrap" class="hidden mt-2">
        <input type="text" id="chestpain_rad_other_text" placeholder="ระบุตำแหน่งที่เจ็บร้าวไปเพิ่มเติม..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white">
      </div>
    </div>

    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">ลักษณะความรู้สึกเจ็บหน้าอก (เลือกได้หลายข้อ)</label>
      ${renderCpGrid('grid-cols-2 sm:grid-cols-3', [
        { name: 'chestpain_char', value: 'crushing_heavy', onchange: 'handleChestpainCharChange()', title: cpWrap('แน่นเหมือนโดนของทับ /', 'บีบรัด') },
        { name: 'chestpain_char', value: 'tight_dyspneic', onchange: 'handleChestpainCharChange()', title: cpWrap('แน่นอึดอัด', 'หายใจไม่สะดวก') },
        { name: 'chestpain_char', value: 'tearing_sharp', onchange: 'handleChestpainCharChange()', title: cpWrap('เจ็บแหลมคมเหมือนฉีกขาด /', 'เสียบแทง') },
        { name: 'chestpain_char', value: 'pleuritic_sharp', onchange: 'handleChestpainCharChange()', title: cpWrap('เจ็บแปล๊บเวลาหายใจลึก', 'หรือไอ') },
        { name: 'chestpain_char', value: 'burning_heartburn', onchange: 'handleChestpainCharChange()', title: cpWrap('แสบร้อนกลางอก /', 'เหนือลิ้นปี่') },
        { name: 'chestpain_char', value: 'aching_tender', onchange: 'handleChestpainCharChange()', title: cpWrap('เจ็บระบม เมื่อขยับตัว /', 'กดโดน') },
        { id: 'chestpain_char_other_chk', onchange: 'handleChestpainCharOtherToggle(this.checked)', title: cpWrap('ลักษณะอื่นๆ (ระบุ)'), spanClass: 'col-span-2 sm:col-span-3' }
      ])}
      <div id="chestpain_char_other_wrap" class="hidden mt-2">
        <input type="text" id="chestpain_char_other_text" placeholder="ระบุลักษณะความรู้สึกเจ็บหน้าอกเพิ่มเติม..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white">
      </div>
    </div>

    <div class="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label class="block text-xs font-semibold text-slate-800 uppercase tracking-wider">ระดับความเจ็บปวดในขณะนี้ (Pain Score: 0 – 10)</label>
        <div class="flex items-center space-x-2">
          <span id="chestpainPainScoreBadge" class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all">
            <span id="chestpainPainScoreEmoji" class="text-base">⚪</span>
            <span id="chestpainPainScoreText">ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)</span>
          </span>
          <button type="button" id="chestpainPainScoreClearBtn" onclick="clearChestpainPainScore()" class="text-xs text-slate-400 hover:text-rose-600 underline hidden transition" title="ล้างค่าเพื่อให้เป็นไม่ได้ระบุ">ล้างค่า</button>
        </div>
      </div>
      <div class="px-1 pt-1">
        <input type="range" id="chestpainPainScore" min="0" max="10" value="0" step="1" oninput="handleChestpainPainScoreChange(this.value)" class="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-600 focus:outline-none focus:ring-2 focus:ring-medical-500">
      </div>
      <div class="grid grid-cols-5 text-center text-[10px] sm:text-[11px] pt-1 gap-1 text-slate-500 font-medium">
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setChestpainPainScore(0)"><span class="text-lg sm:text-xl block">😊</span><span>0: สบายดี</span></div>
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setChestpainPainScore(2)"><span class="text-lg sm:text-xl block">🙂</span><span>1–3: เล็กน้อย</span></div>
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setChestpainPainScore(5)"><span class="text-lg sm:text-xl block">😐</span><span>4–6: ปานกลาง</span></div>
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setChestpainPainScore(8)"><span class="text-lg sm:text-xl block">😣</span><span>7–9: ปวดมาก</span></div>
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setChestpainPainScore(10)"><span class="text-lg sm:text-xl block">😭</span><span>10: ปวดที่สุด</span></div>
      </div>
    </div>
  </div>
</div>`;

const CP_CARD2_HTML = `
<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
  <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
    <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="heart" class="w-5 h-5"></i></div>
    <div>
      <h2 class="text-base font-bold text-slate-900">2. ความเสี่ยงหัวใจขาดเลือดและอาการเตือนระบบไหลเวียนโลหิต</h2>
      <p class="text-xs text-slate-500">คำถามสำคัญเพื่อประเมินภาวะกล้ามเนื้อหัวใจขาดเลือดและอาการเตือนฉุกเฉิน</p>
    </div>
  </div>
  <div class="space-y-5">
    <div class="space-y-4">
      <div>
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">อาการแน่นหน้าอกสัมพันธ์กับการออกแรงอย่างไร?</label>
        ${renderCpGrid('grid-cols-1 sm:grid-cols-2', [
          { kind: 'radio', name: 'chestpainAnginaExertion', value: 'on_exertion', onchange: 'checkChestpainHighRiskMedTrigger()', title: cpWrap('แน่นมากขึ้นเวลาออกแรง /', 'เดินเร็ว') },
          { kind: 'radio', name: 'chestpainAnginaExertion', value: 'rest', onchange: 'checkChestpainHighRiskMedTrigger()', title: cpWrap('แน่นขึ้นมาเองขณะนั่งหรือนอนพัก', 'เฉยๆ') }
        ])}
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">อาการแน่นหน้าอกแต่ละระลอกเป็นนานต่อเนื่องเกิน 20 นาทีหรือไม่?</label>
        ${renderCpGrid('grid-cols-1 sm:grid-cols-3', [
          { kind: 'radio', name: 'chestpainAnginaOver20m', value: 'yes', onchange: 'checkChestpainHighRiskMedTrigger()', title: cpWrap('เกิน 20 นาที', '(หรือยังเจ็บต่อเนื่อง)') },
          { kind: 'radio', name: 'chestpainAnginaOver20m', value: 'no', onchange: 'checkChestpainHighRiskMedTrigger()', title: cpWrap('ไม่เกิน 20 นาที', 'แล้วทุเลา') },
          { kind: 'radio', name: 'chestpainAnginaOver20m', value: 'unsure', onchange: 'checkChestpainHighRiskMedTrigger()', title: cpWrap('ไม่แน่ใจ /', 'ยังนับเวลาไม่ได้') }
        ])}
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">ท่านเคยได้รับ "ยาอมใต้ลิ้น" ขยายหลอดเลือดหัวใจมาก่อนหรือไม่?</label>
        ${renderCpGrid('grid-cols-1 sm:grid-cols-3', [
          { kind: 'radio', name: 'chestpainNtgHx', value: 'yes', onchange: "handleChestpainNtgChange('yes')", title: cpWrap('เคยได้รับ') },
          { kind: 'radio', name: 'chestpainNtgHx', value: 'no', onchange: "handleChestpainNtgChange('no')", title: cpWrap('ไม่เคยได้รับ') },
          { kind: 'radio', name: 'chestpainNtgHx', value: 'unsure', onchange: "handleChestpainNtgChange('unsure')", title: cpWrap('ไม่แน่ใจ') }
        ])}
        <div id="chestpain_ntg_current_wrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-2.5 space-y-2">
          <label class="block text-xs font-semibold text-slate-700">ในการเจ็บหน้าอกรอบนี้ ท่านได้ลองอมยาใต้ลิ้นหรือไม่?</label>
          ${renderCpGrid('grid-cols-1 sm:grid-cols-3', [
            { kind: 'radio', name: 'chestpainNtgCurrent', value: 'not_taken', title: cpWrap('ยังไม่ได้ลองอมยา'), compact: true, bgWhite: true },
            { kind: 'radio', name: 'chestpainNtgCurrent', value: 'relief', title: cpWrap('อมยาแล้วทุเลาลง'), compact: true, bgWhite: true },
            { kind: 'radio', name: 'chestpainNtgCurrent', value: 'no_relief', title: cpWrap('อมยาแล้วไม่ดีขึ้น'), compact: true, bgWhite: true }
          ])}
        </div>
      </div>
    </div>

    <div>
      ${renderCpSysHeader('heart-pulse', 'text-rose-500', 'อาการเตือนทางหัวใจและระบบไหลเวียนโลหิต', 'chestpain_cardio_none', "handleChestpainGroupNoneChange('chestpain_cardio_none',['chestpain_rf_diaphoresis','chestpain_rf_syncope','chestpain_rf_palpitation','chestpain_rf_orthopnea'],checkChestpainHighRiskMedTrigger)")}
      ${renderCpGrid('grid-cols-2 sm:grid-cols-4', [
        { id: 'chestpain_rf_diaphoresis', onchange: "handleChestpainCardioItemChange('chestpain_rf_diaphoresis')", title: cpWrap('เหงื่อแตก ตัวเย็น /', 'ซีดเพลีย') },
        { id: 'chestpain_rf_syncope', onchange: "handleChestpainCardioItemChange('chestpain_rf_syncope')", title: cpWrap('หน้ามืด / วูบ /', 'หมดสติ') },
        { id: 'chestpain_rf_palpitation', onchange: "handleChestpainCardioItemChange('chestpain_rf_palpitation')", title: cpWrap('ใจสั่น /', 'หัวใจเต้นสะดุด') },
        { id: 'chestpain_rf_orthopnea', onchange: "handleChestpainCardioItemChange('chestpain_rf_orthopnea')", title: cpWrap('นอนราบไม่ได้ ลุกนั่งหอบ /', 'ต้องนอนหัวสูง') }
      ])}
    </div>
  </div>
</div>`;

const CP_CARD3_HTML = `
<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
  <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
    <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="activity" class="w-5 h-5"></i></div>
    <div>
      <h2 class="text-base font-bold text-slate-900">3. อาการร่วมตามระบบอื่น ปัจจัยเฉพาะ และข้อมูลเพิ่มเติม</h2>
      <p class="text-xs text-slate-500">เลือกอาการที่มีร่วมด้วย ระบบจะเปิดคำถามเจาะลึกเฉพาะข้อที่เกี่ยวข้อง</p>
    </div>
  </div>
  <div class="space-y-6">
    <div>
      ${renderCpSysHeader('wind', 'text-sky-500', 'ระบบทางเดินหายใจ หลอดเลือด และช่องท้อง', 'chestpain_assoc_none', "handleChestpainGroupNoneChange('chestpain_assoc_none',['chestpain_rf_dyspnea','chestpain_rf_hemoptysis','chestpain_rf_calf_swelling','chestpain_bilateral_leg_edema','chestpain_abdpain'],syncChestpainAssocBranches)")}
      ${renderCpGrid('grid-cols-2 sm:grid-cols-3', [
        { id: 'chestpain_rf_dyspnea', onchange: "handleChestpainAssocItemChange('chestpain_rf_dyspnea')", title: cpWrap('หายใจหอบเหนื่อย') },
        { id: 'chestpain_rf_hemoptysis', onchange: "handleChestpainAssocItemChange('chestpain_rf_hemoptysis')", title: cpWrap('ไอมีเสมหะ', 'ปนเลือดสด') },
        { id: 'chestpain_rf_calf_swelling', onchange: "handleChestpainAssocItemChange('chestpain_rf_calf_swelling')", title: cpWrap('ขาบวม หรือ', 'ปวดน่องข้างเดียว') },
        { id: 'chestpain_bilateral_leg_edema', onchange: "handleChestpainAssocItemChange('chestpain_bilateral_leg_edema')", title: cpWrap('ขาบวม 2 ข้าง') },
        { id: 'chestpain_abdpain', onchange: "handleChestpainAssocItemChange('chestpain_abdpain')", title: cpWrap('มีอาการปวดท้อง', 'ร่วมด้วย'), spanClass: 'col-span-2 sm:col-span-2' }
      ])}

      <div id="chestpain_dyspnea_wrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2.5 space-y-2">
        <div class="text-xs font-bold text-slate-800 flex items-center"><i data-lucide="wind" class="w-4 h-4 text-sky-500 mr-1.5"></i>เจาะลึกอาการหายใจหอบเหนื่อย:</div>
        ${renderCpGrid('grid-cols-1 sm:grid-cols-2', [
          { name: 'chestpain_dyspnea_pattern', value: 'continuous', title: cpWrap('เหนื่อยตลอดเวลา แม้อยู่เฉยๆ'), compact: true, bgWhite: true },
          { name: 'chestpain_dyspnea_pattern', value: 'on_exertion', title: cpWrap('เหนื่อยเฉพาะเวลาออกแรง'), compact: true, bgWhite: true },
          { name: 'chestpain_dyspnea_pattern', value: 'orthopnea', title: cpWrap('เหนื่อยมากขึ้นเวลานอนราบ'), compact: true, bgWhite: true },
          { name: 'chestpain_dyspnea_pattern', value: 'sudden_onset', title: cpWrap('เหนื่อยหอบฉับพลันทันที'), compact: true, bgWhite: true }
        ])}
      </div>

      <div id="chestpain_abdpain_wrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2.5 space-y-3 text-xs">
        <div class="font-bold text-slate-800 flex items-center"><i data-lucide="utensils" class="w-4 h-4 text-amber-500 mr-1.5"></i>เจาะลึกอาการปวดท้องที่พบร่วมด้วย:</div>
        <div>
          <label class="block font-semibold text-slate-700 mb-1.5">ตำแหน่งที่ปวดท้อง (เลือกได้หลายข้อ):</label>
          ${renderCpGrid('grid-cols-2 sm:grid-cols-4', [
            { name: 'chestpain_abdpain_loc', value: 'epigastrium', title: cpWrap('ใต้ลิ้นปี่'), compact: true, bgWhite: true },
            { name: 'chestpain_abdpain_loc', value: 'ruq', title: cpWrap('ขวาบน'), compact: true, bgWhite: true },
            { name: 'chestpain_abdpain_loc', value: 'luq', title: cpWrap('ซ้ายบน'), compact: true, bgWhite: true },
            { name: 'chestpain_abdpain_loc', value: 'periumbilical', title: cpWrap('รอบสะดือ'), compact: true, bgWhite: true },
            { name: 'chestpain_abdpain_loc', value: 'rlq', title: cpWrap('ขวาล่าง'), compact: true, bgWhite: true },
            { name: 'chestpain_abdpain_loc', value: 'llq', title: cpWrap('ซ้ายล่าง'), compact: true, bgWhite: true },
            { name: 'chestpain_abdpain_loc', value: 'suprapubic', title: cpWrap('ท้องน้อย'), compact: true, bgWhite: true },
            { name: 'chestpain_abdpain_loc', value: 'diffuse', title: cpWrap('ทั่วท้อง'), compact: true, bgWhite: true }
          ])}
        </div>
        <div>
          <label class="block font-semibold text-slate-700 mb-1.5">ลักษณะการปวดท้อง:</label>
          ${renderCpGrid('grid-cols-2 sm:grid-cols-4', [
            { name: 'chestpain_abdpain_char', value: 'burning', title: cpWrap('แสบร้อน'), compact: true, bgWhite: true },
            { name: 'chestpain_abdpain_char', value: 'sharp_tearing', title: cpWrap('เสียบแทง /', 'ฉีกขาด'), compact: true, bgWhite: true },
            { name: 'chestpain_abdpain_char', value: 'crampy', title: cpWrap('บิดเกร็ง'), compact: true, bgWhite: true },
            { name: 'chestpain_abdpain_char', value: 'dull', title: cpWrap('ตื้อๆ แน่นๆ'), compact: true, bgWhite: true }
          ])}
        </div>
        <div>
          <label class="block font-semibold text-slate-700 mb-1.5">การปวดร้าวจากท้อง:</label>
          ${renderCpGrid('grid-cols-2 sm:grid-cols-3', [
            { name: 'chestpain_abdpain_rad', value: 'back_left', title: cpWrap('ร้าวหลังซ้าย'), compact: true, bgWhite: true },
            { name: 'chestpain_abdpain_rad', value: 'back_right', title: cpWrap('ร้าวหลังขวา'), compact: true, bgWhite: true },
            { name: 'chestpain_abdpain_rad', value: 'back_mid', title: cpWrap('ร้าวทะลุหลังกลาง'), compact: true, bgWhite: true },
            { name: 'chestpain_abdpain_rad', value: 'chest', title: cpWrap('ร้าวขึ้นเหนือลิ้นปี่'), compact: true, bgWhite: true },
            { name: 'chestpain_abdpain_rad', value: 'groin_thigh_genitalia', title: cpWrap('ร้าวลงขาหนีบ /', 'อวัยวะเพศ'), compact: true, bgWhite: true }
          ])}
        </div>
      </div>
    </div>

    <div id="chestpain_branch_pulm" class="hidden bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
      ${renderCpSysHeader('shield-alert', 'text-sky-600', 'ประเมินความเสี่ยงปอดและลิ่มเลือดอุดกั้นปอด', 'chestpain_pulm_none', "handleChestpainGroupNoneChange('chestpain_pulm_none',['chestpain_pulm_travel','chestpain_pulm_bedridden','chestpain_pulm_cancer_ocp'])", 'ไม่มีประวัติเสี่ยงในหมวดนี้')}
      ${renderCpGrid('grid-cols-1 sm:grid-cols-3', [
        { id: 'chestpain_pulm_travel', onchange: "if(this.checked)clearCpNone('chestpain_pulm_none')", title: cpWrap('นั่งรถ/เครื่องบินทางไกล > 4 ชม.', '(ใน 4 สัปดาห์)'), compact: true, bgWhite: true },
        { id: 'chestpain_pulm_bedridden', onchange: "if(this.checked)clearCpNone('chestpain_pulm_none')", title: cpWrap('นอนติดเตียง / เพิ่งผ่าตัดใหญ่ /', 'เพิ่งเข้าเฝือกขา'), compact: true, bgWhite: true },
        { id: 'chestpain_pulm_cancer_ocp', onchange: "if(this.checked)clearCpNone('chestpain_pulm_none')", title: cpWrap('มีโรคมะเร็ง /', 'ทานยาคุม-ฮอร์โมน'), compact: true, bgWhite: true }
      ])}
    </div>

    <div id="chestpain_branch_gi" class="hidden bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
      ${renderCpSysHeader('droplet', 'text-amber-600', 'ประเมินอาการระบบทางเดินอาหารและหลอดอาหาร', 'chestpain_gi_none', "handleChestpainGroupNoneChange('chestpain_gi_none',['chestpain_gi_heartburn_up','chestpain_gi_regurgitation','chestpain_gi_post_meal','chestpain_gi_dysphagia','chestpain_gi_severe_emesis'])")}
      ${renderCpGrid('grid-cols-1 sm:grid-cols-2', [
        { id: 'chestpain_gi_heartburn_up', onchange: "if(this.checked)clearCpNone('chestpain_gi_none')", title: cpWrap('แสบร้อนเหนือลิ้นปี่ /', 'มีลมดันตีขึ้น'), compact: true, bgWhite: true },
        { id: 'chestpain_gi_regurgitation', onchange: "if(this.checked)clearCpNone('chestpain_gi_none')", title: cpWrap('ขย้อนเปรี้ยว /', 'เรอเปรี้ยว'), compact: true, bgWhite: true },
        { id: 'chestpain_gi_post_meal', onchange: "if(this.checked)clearCpNone('chestpain_gi_none')", title: cpWrap('จุกแน่นหลังมื้อใหญ่', 'หรือเมื่อนอนราบ'), compact: true, bgWhite: true },
        { id: 'chestpain_gi_dysphagia', onchange: "if(this.checked)clearCpNone('chestpain_gi_none')", title: cpWrap('กลืนลำบาก /', 'กลืนเจ็บ'), compact: true, bgWhite: true },
        { id: 'chestpain_gi_severe_emesis', onchange: "if(this.checked)clearCpNone('chestpain_gi_none')", title: cpWrap('คลื่นไส้อาเจียนรุนแรง', 'นำมาก่อนเจ็บหน้าอก'), compact: true, bgWhite: true, spanClass: 'sm:col-span-2' }
      ])}
    </div>

    <div id="chestpain_branch_msk" class="hidden bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
      ${renderCpSysHeader('bone', 'text-emerald-600', 'ประเมินอาการทางกระดูกและกล้ามเนื้อทรวงอก', 'chestpain_msk_none', "handleChestpainGroupNoneChange('chestpain_msk_none',['chestpain_msk_tender','chestpain_msk_movement','chestpain_msk_heavy_lifting','chestpain_msk_trauma'],()=>handleChestpainMskTraumaToggle(false))")}
      ${renderCpGrid('grid-cols-2 sm:grid-cols-4', [
        { id: 'chestpain_msk_tender', onchange: "if(this.checked)clearCpNone('chestpain_msk_none')", title: cpWrap('กดเจ็บชัดเจน', 'บนกระดูกซี่โครง'), compact: true, bgWhite: true },
        { id: 'chestpain_msk_movement', onchange: "if(this.checked)clearCpNone('chestpain_msk_none')", title: cpWrap('เจ็บมากขึ้นเมื่อเอี้ยว /', 'บิดตัว'), compact: true, bgWhite: true },
        { id: 'chestpain_msk_heavy_lifting', onchange: "if(this.checked)clearCpNone('chestpain_msk_none')", title: cpWrap('ยกของหนัก หรือ', 'บิดผิดท่า'), compact: true, bgWhite: true },
        { id: 'chestpain_msk_trauma', onchange: 'handleChestpainMskTraumaToggle(this.checked)', title: cpWrap('มีประวัติอุบัติเหตุ'), compact: true, bgWhite: true }
      ])}
      <div id="chestpain_trauma_detail_wrap" class="hidden pt-1">
        <input type="text" id="chestpainTraumaDetail" placeholder="ระบุลักษณะการเกิดอุบัติเหตุ เช่น โดนกระแทกหน้าอก, รถล้ม..." class="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-medical-500">
      </div>
    </div>

    <div>
      <label class="text-xs sm:text-sm font-bold text-slate-800 flex items-center pb-2 mb-2.5 border-b border-slate-100">
        <i data-lucide="message-square-plus" class="w-4 h-4 text-slate-600 mr-1.5"></i>อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม
      </label>
      <textarea id="chestpain_other_free" rows="2" placeholder="พิมพ์ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี เช่น อ่อนเพลียมาก, วิงเวียนศีรษะ)..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"></textarea>
    </div>
  </div>
</div>`;

const CP_CARD4_HTML = `
<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 transition-all">
  <div class="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
    <div class="flex items-center space-x-3">
      <div class="bg-amber-100 text-amber-800 p-2 rounded-xl"><i data-lucide="shield-check" class="w-5 h-5"></i></div>
      <div>
        <h2 class="text-base font-bold text-slate-900">4. คัดกรองความปลอดภัยการใช้ยาความเสี่ยงสูง</h2>
        <p class="text-xs text-slate-500">คำถามเพื่อความปลอดภัยในการให้ยาสลายลิ่มเลือดและยาขยายหลอดเลือด</p>
      </div>
    </div>
    <div id="chestpain_ci_none_wrap" class="hidden flex items-center gap-2">
      <button type="button" id="chestpain_high_risk_collapse_btn" onclick="collapseChestpainHighRiskMed()" class="hidden px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition cursor-pointer">พับเก็บหมวดนี้</button>
      <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-lg border border-slate-200 hover:border-medical-300 bg-slate-50 cursor-pointer transition flex-shrink-0">
        <input type="checkbox" id="chestpain_ci_none" onchange="handleChestpainCiNoneChange(this.checked)" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded flex-shrink-0">
        <span class="ml-3 text-[11px] font-medium text-slate-600 whitespace-nowrap">ไม่มีประวัติเสี่ยงข้อห้ามใดๆ</span>
      </label>
    </div>
  </div>

  <div id="chestpain_high_risk_skipped_notice" class="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div class="flex items-center space-x-2.5 text-xs text-slate-700">
      <i data-lucide="check-circle-2" class="w-4 h-4 text-slate-500 flex-shrink-0"></i>
      <span class="font-medium">จากอาการของท่าน ยังไม่ต้องตอบคำถามในหมวดนี้</span>
    </div>
    <button type="button" id="chestpainForceOpenHighRiskBtn" onclick="forceOpenChestpainHighRiskMed()" class="self-start sm:self-auto px-3 py-1.5 rounded-lg text-xs font-semibold text-medical-700 bg-white hover:bg-medical-50 border border-medical-300 transition cursor-pointer whitespace-nowrap">
      เปิดแบบคัดกรองหมวดนี้เพิ่มเติม (สำหรับแพทย์)
    </button>
  </div>

  <div id="chestpain_high_risk_med_section" class="hidden space-y-4">
    <div class="bg-amber-50/80 border border-amber-300 rounded-xl p-4 text-xs text-amber-900 flex items-start space-x-3">
      <i data-lucide="alert-circle" class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"></i>
      <p class="font-medium text-slate-800 leading-relaxed">
        “จากอาการของท่าน ท่านอาจมีโอกาสต้องได้รับยาที่มีความเสี่ยงสูง เพื่อความรวดเร็วในการรักษา โปรดตอบคำถามเหล่านี้โดยระมัดระวัง ทั้งนี้แพทย์ผู้ทำการรักษาจะทำการสอบถามและให้ข้อมูลท่านซ้ำอีกครั้งก่อนการรักษา”
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
      ${renderCpOpt({ id: 'ci_ich_tumor_avm', onchange: "handleChestpainCiItemChange('ci_ich_tumor_avm')", title: cpWrap('เคยมีเลือดออก / เนื้องอก /', 'หลอดเลือดผิดปกติในสมอง') })}
      ${renderCpOpt({ id: 'ci_ischemic_stroke_chk', onchange: "handleChestpainCiSubToggle('ci_ischemic_stroke_chk','ci_ischemic_stroke_wrap','ci_ischemic_stroke')", title: cpWrap('มีประวัติหลอดเลือดสมองตีบ /', 'อัมพฤกษ์') })}
      ${renderCpOpt({ id: 'ci_cns_surgery_3m', onchange: "handleChestpainCiItemChange('ci_cns_surgery_3m')", title: cpWrap('ผ่าตัดสมอง / ไขสันหลัง', 'ภายใน 3 เดือน') })}
      ${renderCpOpt({ id: 'ci_major_surgery_3w', onchange: "handleChestpainCiItemChange('ci_major_surgery_3w')", title: cpWrap('ผ่าตัดใหญ่ ภายใน 3 สัปดาห์', '(ช่องอก, ช่องท้อง, กระดูกข้อใหญ่)') })}
      ${renderCpOpt({ id: 'ci_head_facial_trauma_3m', onchange: "handleChestpainCiItemChange('ci_head_facial_trauma_3m')", title: cpWrap('บาดเจ็บรุนแรงที่ศีรษะ / ใบหน้า', 'ภายใน 3 เดือน') })}
      ${renderCpOpt({ id: 'ci_internal_bleeding_chk', onchange: "handleChestpainCiSubToggle('ci_internal_bleeding_chk','ci_internal_bleeding_wrap','ci_internal_bleeding')", title: cpWrap('มีแผลหรือเลือดออกภายใน /', 'ทางเดินอาหาร (ไม่รวมประจำเดือน)') })}
      ${renderCpOpt({ id: 'ci_prior_fibrinolytic', onchange: "handleChestpainCiItemChange('ci_prior_fibrinolytic')", title: cpWrap('เคยได้รับยาฉีดสลายลิ่มเลือด', 'จากภาวะหัวใจขาดเลือดมาก่อนในอดีต (เช่น Streptokinase)') })}
      ${renderCpOpt({ id: 'ci_coagulopathy_anticoagulant', onchange: "handleChestpainCiItemChange('ci_coagulopathy_anticoagulant')", title: cpWrap('มีภาวะเลือดออกง่ายหยุดยาก หรือ', 'ทานยาละลายลิ่มเลือด (เช่น Warfarin)') })}
      ${renderCpOpt({ id: 'ci_pde5_inhibitor', onchange: "handleChestpainCiItemChange('ci_pde5_inhibitor')", title: cpWrap('ทานยาเสริมสมรรถภาพทางเพศ ใน 24–48 ชม.', '(เช่น Viagra, Sildenafil, Cialis)') })}
      <div id="chestpain_ci_preg_wrap" class="hidden">
        ${renderCpOpt({ id: 'ci_pregnancy_postpartum_1w', onchange: "handleChestpainCiItemChange('ci_pregnancy_postpartum_1w')", title: cpWrap('ตั้งครรภ์ หรือหลังคลอด', 'ไม่เกิน 1 สัปดาห์') })}
      </div>
    </div>

    <div id="ci_ischemic_stroke_wrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
      <label class="block text-xs font-semibold text-slate-700">ระบุช่วงเวลาที่มีอาการหลอดเลือดสมองตีบ / อัมพฤกษ์:</label>
      ${renderCpGrid('grid-cols-2 sm:grid-cols-4', [
        { kind: 'radio', name: 'ci_ischemic_stroke', value: 'within_3m', title: cpWrap('ภายใน 3 เดือน'), compact: true, bgWhite: true },
        { kind: 'radio', name: 'ci_ischemic_stroke', value: '3_to_6m', title: cpWrap('ในช่วง 3–6 เดือน'), compact: true, bgWhite: true },
        { kind: 'radio', name: 'ci_ischemic_stroke', value: 'gt_6m', title: cpWrap('มากกว่า 6 เดือน'), compact: true, bgWhite: true },
        { kind: 'radio', name: 'ci_ischemic_stroke', value: 'unsure', title: cpWrap('ไม่แน่ใจ'), compact: true, bgWhite: true }
      ])}
    </div>

    <div id="ci_internal_bleeding_wrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
      <label class="block text-xs font-semibold text-slate-700">ระบุช่วงเวลาที่มีแผลหรือเลือดออกภายใน / ทางเดินอาหาร:</label>
      ${renderCpGrid('grid-cols-2 sm:grid-cols-4', [
        { kind: 'radio', name: 'ci_internal_bleeding', value: 'current_active', title: cpWrap('กำลังมีอยู่ในปัจจุบัน'), compact: true, bgWhite: true },
        { kind: 'radio', name: 'ci_internal_bleeding', value: 'within_1m', title: cpWrap('ในช่วง < 1 เดือน'), compact: true, bgWhite: true },
        { kind: 'radio', name: 'ci_internal_bleeding', value: 'gt_1m', title: cpWrap('มากกว่า 1 เดือน'), compact: true, bgWhite: true },
        { kind: 'radio', name: 'ci_internal_bleeding', value: 'unsure', title: cpWrap('ไม่แน่ใจ'), compact: true, bgWhite: true }
      ])}
    </div>
  </div>
</div>`;

const CP_FORM_HTML = `
<div id="chestpainQuestionnaireSection" class="space-y-6 hidden">
  <div data-cc-top-banner="chestpain"><div class="flex flex-col gap-4">
    <div class="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-start space-x-3 text-xs text-slate-800 leading-relaxed">
      <i data-lucide="info" class="w-5 h-5 text-medical-600 mt-0.5 flex-shrink-0"></i>
      <div class="space-y-1">
        <p class="font-bold text-slate-900">ข้อแนะนำการปฏิบัติตัวเบื้องต้นระหว่างรอตรวจ:</p>
        <p>1. <strong>นั่งพักหรือนอนพักนิ่งๆ ทันที:</strong> หลีกเลี่ยงการเดินหรือออกแรงใดๆ เพื่อลดภาระการทำงานของหัวใจ</p>
        <p>2. <strong>แจ้งพยาบาลหน้าห้องตรวจทันทีหากมีอาการต่อไปนี้:</strong> เจ็บแน่นกลางอกรุนแรง เหงื่อแตกตัวเย็น หน้ามืดคล้ายจะเป็นลม หรือหายใจหอบเหนื่อยมาก (เพื่อรับการตรวจคลื่นไฟฟ้าหัวใจด่วน)</p>
      </div>
    </div>
  </div></div>

  ${CP_CARD1_HTML}
  ${CP_CARD2_HTML}
  ${CP_CARD3_HTML}
  ${CP_CARD4_HTML}
</div>`;

// --- Module Registration ---
registerCcModule({
  id: 'chestpain',
  recordCc: 'chest_pain',
  titleTh: 'เจ็บแน่นหน้าอก',
  titleEn: 'Chest pain',
  sectionDomId: 'chestpainQuestionnaireSection',
  pmhSectionNumber: 5,
  getPmhSectionNumber: () => 5,
  doctorCcBadgeHtml: '<i data-lucide="heart" class="w-3.5 h-3.5 mr-1 text-rose-500"></i> CC: เจ็บแน่นหน้าอก (Chest pain)',
  branchIds: [
    'chestpain_onset_intermittent_branch', 'chestpain_loc_other_wrap', 'chestpain_rad_other_wrap',
    'chestpain_char_other_wrap', 'chestpain_ntg_current_wrap', 'chestpain_dyspnea_wrap',
    'chestpain_abdpain_wrap', 'chestpain_branch_pulm', 'chestpain_branch_gi',
    'chestpain_branch_msk', 'chestpain_trauma_detail_wrap', 'chestpain_high_risk_med_section',
    'chestpain_ci_none_wrap', 'chestpain_high_risk_collapse_btn', 'chestpain_ci_preg_wrap',
    'ci_ischemic_stroke_wrap', 'ci_internal_bleeding_wrap'
  ],
  inputIdsToClear: [
    'chestpainDurationVal', 'chestpain_loc_other_text', 'chestpain_rad_other_text',
    'chestpain_char_other_text', 'chestpainTraumaDetail', 'chestpain_other_free'
  ],
  formHtml: CP_FORM_HTML,

  algorithm: {
    id: 'chestpain',
    schemaCode: 'chest_pain',
    titleTh: 'เจ็บแน่นหน้าอก',
    titleEn: 'Chest pain',
    sections: [
      { sectionNo: 1, titleTh: 'ระยะเวลา ตำแหน่ง และลักษณะการเจ็บหน้าอก (OPQRST & Pain Score)' },
      { sectionNo: 2, titleTh: 'ความเสี่ยงหัวใจขาดเลือดและอาการเตือนระบบไหลเวียนโลหิต' },
      { sectionNo: 3, titleTh: 'อาการร่วมตามระบบอื่น ปัจจัยเฉพาะ และข้อมูลเพิ่มเติม' },
      { sectionNo: 4, titleTh: 'คัดกรองความปลอดภัยการใช้ยาความเสี่ยงสูง (ACS >= 2 Criteria หรือเปิดเพิ่มเติม)' }
    ]
  },

  seedPatients: [
    {
      id: 'case-046',
      queue_number: 'A-046',
      hn: '6705512',
      name: 'นายสมชาย มั่นคง',
      age: 58,
      gender: 'ชาย',
      chief_complaint: 'chest_pain',
      chief_complaint_title: 'เจ็บแน่นหน้าอก',
      status: 'waiting',
      timestamp: '2026-10-26T02:31:26.423Z',
      durationVal: 1,
      durationUnit: 'hours',
      chestpainPainScore: 10,
      chestpainOnsetMode: 'sudden_peak',
      chestpainLocs: ['substernal'],
      chestpainRads: ['left_arm_shoulder', 'neck_jaw'],
      chestpainChars: ['crushing_heavy', 'tight_dyspneic'],
      chestpainAnginaExertion: 'rest',
      chestpainAnginaOver20m: true,
      chestpainNtgHx: true,
      chestpainNtgCurrent: 'no_relief',
      chestpain_rf_diaphoresis: true,
      chestpain_rf_syncope: false,
      chestpain_rf_dyspnea: true,
      chestpainDyspneaPatterns: ['continuous', 'sudden_onset'],
      chestpain_rf_orthopnea: false,
      chestpain_rf_palpitation: false,
      chestpain_rf_hemoptysis: false,
      chestpain_rf_calf_swelling: false,
      chestpain_bilateral_leg_edema: false,
      chestpain_abdpain: false,
      chestpain_pulm_none: true,
      chestpain_ci_none: true,
      ci_ich_tumor_avm: false,
      ci_ischemic_stroke: 'none',
      ci_cns_surgery_3m: false,
      ci_major_surgery_3w: false,
      ci_head_facial_trauma_3m: false,
      ci_internal_bleeding: 'none',
      ci_prior_fibrinolytic: false,
      ci_coagulopathy_anticoagulant: false,
      ci_pregnancy_postpartum_1w: false,
      ci_pde5_inhibitor: false,
      hospRecordStatus: 'additional',
      underlying: ['หลอดเลือดหัวใจ (CAD)', 'เบาหวาน (DM)', 'ไขมันในเลือดสูง (DLP)'],
      ud_cad_hosp_status: 'other',
      ud_cad_pci: true,
      ud_cad_cabg: false,
      ud_cad_meds: true,
      ud_cad_hosp_name: 'รพ.ศิริราช (PCI ใส่ Stent 2 ปีก่อน)',
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Aspirin 81mg, Clopidogrel 75mg, Atorvastatin 40mg, Metformin 500mg, ISDN 5mg SL prn',
      doctor_notes: {
        additional_hpi: 'ผู้ป่วยชาย 58 ปี ทราบประวัติ CAD s/p PCI จาก รพ.ศิริราช 2 ปีก่อน มีอาการแน่นหน้าอกรุนแรงเหมือนของหนักทับกลางอก ร้าวไปกรามและแขนซ้าย 1 ชม. ก่อนมา มีเหงื่อแตกท่วมตัวตัวเย็น ลองอมยาใต้ลิ้นเดิม 1 เม็ดไม่ทุเลา',
        physical_exam: 'BT 36.6 C, PR 96/min, RR 22/min, BP 138/84 mmHg, SpO2 97%. Marked diaphoresis, pale clammy skin. Heart: Normal S1 S2, no murmur. Lungs: Clear, no adventitious sounds.',
        preliminary_dx: 'Acute ST-elevation Myocardial Infarction (STEMI), Anterior wall with High-Risk Features',
        plan: 'STAT EKG 12 leads (ST elevation V1-V4), Oxygen cannula 3 LPM, ASA 300 mg chew stat, Ticagrelor 180 mg stat, Morphine 2-4 mg IV prn pain, STAT consult Cardiology for Primary PCI via Fast Track Cath Lab Ratchaburi'
      }
    },
    {
      id: 'case-047',
      queue_number: 'A-047',
      hn: '6708910',
      name: 'นางวันดี สิริโสภา',
      age: 66,
      gender: 'หญิง',
      chief_complaint: 'chest_pain',
      chief_complaint_title: 'เจ็บแน่นหน้าอก',
      status: 'waiting',
      timestamp: '2026-10-26T02:16:26.424Z',
      durationVal: 2,
      durationUnit: 'hours',
      chestpainPainScore: 9,
      chestpainOnsetMode: 'sudden_peak',
      chestpainLocs: ['substernal'],
      chestpainRads: ['scapula', 'abdomen'],
      chestpainChars: ['tearing_sharp'],
      chestpainAnginaOver20m: true,
      chestpainNtgHx: false,
      chestpain_rf_diaphoresis: true,
      chestpain_rf_syncope: true,
      chestpain_rf_dyspnea: false,
      chestpain_rf_orthopnea: false,
      chestpain_rf_palpitation: false,
      chestpain_rf_hemoptysis: false,
      chestpain_rf_calf_swelling: false,
      chestpain_bilateral_leg_edema: false,
      chestpain_abdpain: true,
      chestpainAbdpainLocs: ['epigastrium'],
      chestpainAbdpainChars: ['sharp_tearing'],
      chestpainAbdpainRads: ['back_mid'],
      chestpain_gi_none: true,
      chestpain_ci_none: true,
      ci_ich_tumor_avm: false,
      ci_ischemic_stroke: 'none',
      ci_cns_surgery_3m: false,
      ci_major_surgery_3w: false,
      ci_head_facial_trauma_3m: false,
      ci_internal_bleeding: 'none',
      ci_prior_fibrinolytic: false,
      ci_coagulopathy_anticoagulant: false,
      ci_pregnancy_postpartum_1w: false,
      ci_pde5_inhibitor: false,
      hospRecordStatus: 'self',
      underlying: ['ความดันสูง (HT)'],
      ud_cad_hosp_status: 'none',
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'ขาดยาความดัน 6 เดือน',
      doctor_notes: {
        additional_hpi: 'มีโรคประจำตัวความดันโลหิตสูงขาดยา เจ็บหน้าอกฉับพลันรุนแรงสูงสุดตั้งแต่เริ่มแรก เหมือนถูกมีดเสียบแทงทะลุไปสะบักหลังและร้าวลงท้อง วูบเกือบหมดสติ',
        physical_exam: 'BT 36.8 C, PR 108/min, RR 24/min, BP Right arm 194/112 mmHg, BP Left arm 146/88 mmHg (Unequal BP > 30 mmHg), SpO2 96%. Heart: Early diastolic murmur at right sternal border.',
        preliminary_dx: 'Suspected Acute Aortic Dissection (Stanford Type A) with Severe Hypertensive Crisis',
        plan: 'CONTRAINDICATED: Do NOT give antiplatelet/anticoagulant/fibrinolytic. STAT 2 IV lines, Labetalol 20 mg IV slow push then infusion target SBP 100-120, STAT CTA Chest & Whole Aorta, STAT Consult CT Surgery'
      }
    },
    {
      id: 'case-048',
      queue_number: 'A-048',
      hn: '6704199',
      name: 'นายธนากร รัตนวิมล',
      age: 34,
      gender: 'ชาย',
      chief_complaint: 'chest_pain',
      chief_complaint_title: 'เจ็บแน่นหน้าอก',
      status: 'waiting',
      timestamp: '2026-10-26T01:56:26.424Z',
      durationVal: 3,
      durationUnit: 'days',
      chestpainPainScore: 4,
      chestpainOnsetMode: 'gradual',
      chestpainLocs: ['epigastrium', 'substernal'],
      chestpainRads: ['none'],
      chestpainChars: ['burning_heartburn', 'aching_tender'],
      chestpainAnginaOver20m: false,
      chestpainNtgHx: false,
      chestpain_cardio_none: true,
      chestpain_abdpain: true,
      chestpainAbdpainLocs: ['epigastrium'],
      chestpainAbdpainChars: ['burning'],
      chestpainAbdpainRads: ['chest'],
      chestpain_gi_heartburn_up: true,
      chestpain_gi_regurgitation: true,
      chestpain_gi_post_meal: true,
      chestpain_msk_tender: true,
      chestpain_msk_movement: true,
      chestpain_msk_heavy_lifting: true,
      chestpain_msk_trauma: false,
      ci_ischemic_stroke: 'unspecified',
      ci_internal_bleeding: 'unspecified',
      hospRecordStatus: 'self',
      underlying: ['ปฏิเสธ'],
      ud_cad_hosp_status: 'none',
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'ไม่มี',
      doctor_notes: {
        additional_hpi: 'ปวดแสบร้อนกลางอกและมีลมดันตีขึ้น ขย้อนเปรี้ยว เป็นมากขึ้นหลังรับประทานอาหารมื้อดึกและล้มตัวนอนราบ ร่วมกับมีจุดกดเจ็บบนกระดูกซี่โครงด้านหน้า ปฏิเสธอาการเหนื่อยหอบหรือเหงื่อแตก',
        physical_exam: 'BT 36.8 C, PR 78/min, RR 16/min, BP 122/76 mmHg. Chest: Point tenderness reproducible on 4th-5th costochondral junctions, no swelling. Heart: Normal, no murmur. Lungs: Clear.',
        preliminary_dx: 'Gastroesophageal Reflux Disease (GERD) with Costochondritis (Non-cardiac chest pain)',
        plan: 'EKG 12 leads (Normal sinus rhythm), Antacid liquid 30 ml po stat, Omeprazole 20 mg bid ac, Paracetamol 500 mg prn'
      }
    },
    {
      id: 'seed-chestpain-04',
      queue_number: 'A-050',
      hn: '6709612',
      name: 'นางสุภาพร วงศ์ษา',
      age: 48,
      gender: 'หญิง',
      chief_complaint: 'chest_pain',
      chief_complaint_title: 'เจ็บแน่นหน้าอก',
      status: 'waiting',
      timestamp: '2026-10-26T02:50:00.000Z',
      durationVal: 5,
      durationUnit: 'hours',
      chestpainPainScore: 7,
      chestpainOnsetMode: 'sudden_peak',
      chestpainLocs: ['right_chest'],
      chestpainRads: ['none'],
      chestpainChars: ['pleuritic_sharp', 'tight_dyspneic'],
      chestpainAnginaOver20m: true,
      chestpainNtgHx: false,
      chestpain_cardio_none: true,
      chestpain_rf_dyspnea: true,
      chestpainDyspneaPatterns: ['sudden_onset', 'on_exertion'],
      chestpain_rf_calf_swelling: true,
      chestpain_bilateral_leg_edema: false,
      chestpain_pulm_travel: true,
      chestpain_pulm_cancer_ocp: true,
      chestpain_ci_none: true,
      ci_ischemic_stroke: 'none',
      ci_internal_bleeding: 'none',
      hospRecordStatus: 'self',
      underlying: ['ปฏิเสธ'],
      ud_cad_hosp_status: 'none',
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'ยาคุมกำเนิดชนิดฮอร์โมนรวม',
      doctor_notes: {
        additional_hpi: 'เพิ่งเดินทางโดยรถทัวร์จากต่างจังหวัดนาน 9 ชม. เมื่อ 2 วันก่อน มีอาการเจ็บอกขวาแปล๊บเวลาหายใจลึก หายใจหอบเหนื่อยเฉียบพลัน และปวดน่องขวาบวมข้างเดียว กินยาคุมกำเนิดต่อเนื่อง',
        physical_exam: 'BT 37.1 C, PR 114/min, RR 26/min, BP 112/74 mmHg, SpO2 90% room air. Right calf circumference 3 cm > left, mild tenderness.',
        preliminary_dx: 'Suspected Acute Pulmonary Embolism (PE) with Right Lower Extremity DVT',
        plan: 'Oxygen mask/cannula keep SpO2 >= 94%, STAT 12-lead EKG, Bedside POCUS (RV strain / DVT compression), D-dimer / STAT CTPA'
      }
    }
  ],

  onActivate: () => { updateChestpainFemaleCiVisibility(); checkChestpainHighRiskMedTrigger(); },
  onSelectForm: () => { updateChestpainFemaleCiVisibility(); checkChestpainHighRiskMedTrigger(); },
  onTitleChange: (isFem) => updateChestpainFemaleCiVisibility(isFem),

  resetForm() {
    chestpainHighRiskForcedOpen = false;
    [
      'chestpainOnsetMode', 'chestpainIntermittentBaseline', 'chestpainAnginaExertion',
      'chestpainAnginaOver20m', 'chestpainNtgHx', 'chestpainNtgCurrent',
      'ci_ischemic_stroke', 'ci_internal_bleeding'
    ].forEach(n => setCpRadioVal(n, ''));
    [
      'chestpain_loc', 'chestpain_rad', 'chestpain_char', 'chestpain_dyspnea_pattern',
      'chestpain_abdpain_loc', 'chestpain_abdpain_char', 'chestpain_abdpain_rad'
    ].forEach(n => setCpCheckboxGroup(n, []));
    [
      'chestpain_loc_other_chk', 'chestpain_rad_none', 'chestpain_rad_other_chk', 'chestpain_char_other_chk',
      'chestpain_cardio_none', 'chestpain_rf_diaphoresis', 'chestpain_rf_syncope', 'chestpain_rf_palpitation', 'chestpain_rf_orthopnea',
      'chestpain_assoc_none', 'chestpain_rf_dyspnea', 'chestpain_rf_hemoptysis', 'chestpain_rf_calf_swelling',
      'chestpain_bilateral_leg_edema', 'chestpain_abdpain',
      'chestpain_pulm_none', 'chestpain_pulm_travel', 'chestpain_pulm_bedridden', 'chestpain_pulm_cancer_ocp',
      'chestpain_gi_none', 'chestpain_gi_heartburn_up', 'chestpain_gi_regurgitation', 'chestpain_gi_post_meal', 'chestpain_gi_dysphagia', 'chestpain_gi_severe_emesis',
      'chestpain_msk_none', 'chestpain_msk_tender', 'chestpain_msk_movement', 'chestpain_msk_heavy_lifting', 'chestpain_msk_trauma',
      'chestpain_ci_none', 'ci_ich_tumor_avm', 'ci_ischemic_stroke_chk', 'ci_cns_surgery_3m', 'ci_major_surgery_3w',
      'ci_head_facial_trauma_3m', 'ci_internal_bleeding_chk', 'ci_prior_fibrinolytic', 'ci_coagulopathy_anticoagulant',
      'ci_pde5_inhibitor', 'ci_pregnancy_postpartum_1w'
    ].forEach(id => {
      const c = document.getElementById(id);
      if (c) c.checked = false;
    });
    this.branchIds.forEach(bId => toggleCpBranch(bId, false));
    this.inputIdsToClear.forEach(id => {
      const inp = document.getElementById(id);
      if (inp) inp.value = '';
    });
    const durUnit = document.getElementById('chestpainDurationUnit');
    if (durUnit) durUnit.value = 'hours';
    clearChestpainPainScore();
    checkChestpainHighRiskMedTrigger();
  },

  hydrateForm(patient) {
    this.resetForm();
    const setElVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val ?? ''; };
    const setElChk = (id, checked) => { const el = document.getElementById(id); if (el) el.checked = Boolean(checked); };

    setElVal('chestpainDurationVal', patient.durationVal || '');
    setElVal('chestpainDurationUnit', patient.durationUnit || 'hours');

    setCpRadioVal('chestpainOnsetMode', patient.chestpainOnsetMode || '');
    handleChestpainOnsetChange();
    if (patient.chestpainOnsetMode === 'intermittent') {
      setCpRadioVal('chestpainIntermittentBaseline', patient.chestpainIntermittentBaseline || '');
    }

    const locs = Array.isArray(patient.chestpainLocs) ? patient.chestpainLocs : [];
    const otherLoc = locs.find(l => String(l).startsWith('อื่นๆ: '));
    setCpCheckboxGroup('chestpain_loc', locs.filter(l => !String(l).startsWith('อื่นๆ: ')));
    if (otherLoc) {
      setElChk('chestpain_loc_other_chk', true);
      toggleCpBranch('chestpain_loc_other_wrap', true);
      setElVal('chestpain_loc_other_text', String(otherLoc).replace(/^อื่นๆ:\s*/, ''));
    }

    const rads = Array.isArray(patient.chestpainRads) ? patient.chestpainRads : [];
    if (rads.includes('none')) {
      setElChk('chestpain_rad_none', true);
    } else {
      const otherRad = rads.find(r => String(r).startsWith('อื่นๆ: '));
      setCpCheckboxGroup('chestpain_rad', rads.filter(r => !String(r).startsWith('อื่นๆ: ')));
      if (otherRad) {
        setElChk('chestpain_rad_other_chk', true);
        toggleCpBranch('chestpain_rad_other_wrap', true);
        setElVal('chestpain_rad_other_text', String(otherRad).replace(/^อื่นๆ:\s*/, ''));
      }
    }

    const chars = Array.isArray(patient.chestpainChars) ? patient.chestpainChars : [];
    const otherChar = chars.find(c => String(c).startsWith('อื่นๆ: '));
    setCpCheckboxGroup('chestpain_char', chars.filter(c => !String(c).startsWith('อื่นๆ: ')));
    if (otherChar) {
      setElChk('chestpain_char_other_chk', true);
      toggleCpBranch('chestpain_char_other_wrap', true);
      setElVal('chestpain_char_other_text', String(otherChar).replace(/^อื่นๆ:\s*/, ''));
    }

    if (patient.chestpainPainScore !== null && patient.chestpainPainScore !== undefined) {
      setChestpainPainScore(patient.chestpainPainScore);
    }

    if (patient.chestpainAnginaExertion && patient.chestpainAnginaExertion !== 'unrelated' && patient.chestpainAnginaExertion !== 'unspecified') {
      setCpRadioVal('chestpainAnginaExertion', patient.chestpainAnginaExertion);
    }
    if (patient.chestpainAnginaOver20m === true) setCpRadioVal('chestpainAnginaOver20m', 'yes');
    else if (patient.chestpainAnginaOver20m === false) setCpRadioVal('chestpainAnginaOver20m', 'no');
    else if (patient.chestpainAnginaOver20mStatus === 'unsure') setCpRadioVal('chestpainAnginaOver20m', 'unsure');

    if (patient.chestpainNtgHx === true) setCpRadioVal('chestpainNtgHx', 'yes');
    else if (patient.chestpainNtgHx === false) setCpRadioVal('chestpainNtgHx', 'no');
    else if (patient.chestpainNtgHxStatus === 'unsure') setCpRadioVal('chestpainNtgHx', 'unsure');
    handleChestpainNtgChange(getCpRadioVal('chestpainNtgHx'));
    if (patient.chestpainNtgHx === true && patient.chestpainNtgCurrent && patient.chestpainNtgCurrent !== 'not_applicable') {
      setCpRadioVal('chestpainNtgCurrent', patient.chestpainNtgCurrent);
    }

    // Cardio & Associated symptoms
    setElChk('chestpain_rf_diaphoresis', patient.chestpain_rf_diaphoresis);
    setElChk('chestpain_rf_syncope', patient.chestpain_rf_syncope);
    setElChk('chestpain_rf_palpitation', patient.chestpain_rf_palpitation);
    setElChk('chestpain_rf_orthopnea', patient.chestpain_rf_orthopnea);
    setElChk('chestpain_cardio_none', patient.chestpain_cardio_none);

    setElChk('chestpain_rf_dyspnea', patient.chestpain_rf_dyspnea);
    toggleCpBranch('chestpain_dyspnea_wrap', Boolean(patient.chestpain_rf_dyspnea));
    if (patient.chestpain_rf_dyspnea) setCpCheckboxGroup('chestpain_dyspnea_pattern', patient.chestpainDyspneaPatterns);
    setElChk('chestpain_rf_hemoptysis', patient.chestpain_rf_hemoptysis);
    setElChk('chestpain_rf_calf_swelling', patient.chestpain_rf_calf_swelling);
    setElChk('chestpain_bilateral_leg_edema', patient.chestpain_bilateral_leg_edema);
    setElChk('chestpain_abdpain', patient.chestpain_abdpain);
    toggleCpBranch('chestpain_abdpain_wrap', Boolean(patient.chestpain_abdpain));
    if (patient.chestpain_abdpain) {
      setCpCheckboxGroup('chestpain_abdpain_loc', patient.chestpainAbdpainLocs);
      setCpCheckboxGroup('chestpain_abdpain_char', patient.chestpainAbdpainChars);
      setCpCheckboxGroup('chestpain_abdpain_rad', patient.chestpainAbdpainRads);
    }
    setElChk('chestpain_assoc_none', patient.chestpain_assoc_none);

    handleChestpainCharChange();
    setElChk('chestpain_pulm_travel', patient.chestpain_pulm_travel);
    setElChk('chestpain_pulm_bedridden', patient.chestpain_pulm_bedridden);
    setElChk('chestpain_pulm_cancer_ocp', patient.chestpain_pulm_cancer_ocp);
    setElChk('chestpain_pulm_none', patient.chestpain_pulm_none);

    setElChk('chestpain_gi_heartburn_up', patient.chestpain_gi_heartburn_up);
    setElChk('chestpain_gi_regurgitation', patient.chestpain_gi_regurgitation);
    setElChk('chestpain_gi_post_meal', patient.chestpain_gi_post_meal);
    setElChk('chestpain_gi_dysphagia', patient.chestpain_gi_dysphagia);
    setElChk('chestpain_gi_severe_emesis', patient.chestpain_gi_severe_emesis);
    setElChk('chestpain_gi_none', patient.chestpain_gi_none);

    setElChk('chestpain_msk_tender', patient.chestpain_msk_tender);
    setElChk('chestpain_msk_movement', patient.chestpain_msk_movement);
    setElChk('chestpain_msk_heavy_lifting', patient.chestpain_msk_heavy_lifting);
    setElChk('chestpain_msk_trauma', patient.chestpain_msk_trauma);
    toggleCpBranch('chestpain_trauma_detail_wrap', Boolean(patient.chestpain_msk_trauma));
    if (patient.chestpain_msk_trauma) setElVal('chestpainTraumaDetail', patient.chestpainTraumaDetail || '');
    setElChk('chestpain_msk_none', patient.chestpain_msk_none);

    // Contraindications + Female guard + Forced open preservation
    updateChestpainFemaleCiVisibility(patient.gender === 'หญิง' || isCpFemaleTitle());
    const hasCiPositives = Boolean(
      patient.ci_ich_tumor_avm ||
      (patient.ci_ischemic_stroke && patient.ci_ischemic_stroke !== 'none' && patient.ci_ischemic_stroke !== 'unspecified') ||
      patient.ci_cns_surgery_3m || patient.ci_major_surgery_3w || patient.ci_head_facial_trauma_3m ||
      (patient.ci_internal_bleeding && patient.ci_internal_bleeding !== 'none' && patient.ci_internal_bleeding !== 'unspecified') ||
      patient.ci_prior_fibrinolytic || patient.ci_coagulopathy_anticoagulant ||
      patient.ci_pregnancy_postpartum_1w || patient.ci_pde5_inhibitor
    );
    const hasCiExplicitNone = Boolean(
      patient.chestpain_ci_none ||
      (patient.ci_ischemic_stroke === 'none' && patient.ci_internal_bleeding === 'none' && !hasCiPositives)
    );
    if (hasCiPositives || patient.chestpainHighRiskForcedOpen) {
      chestpainHighRiskForcedOpen = true;
    }

    setElChk('ci_ich_tumor_avm', patient.ci_ich_tumor_avm);
    const hasStroke = Boolean(patient.ci_ischemic_stroke && patient.ci_ischemic_stroke !== 'none' && patient.ci_ischemic_stroke !== 'unspecified');
    setElChk('ci_ischemic_stroke_chk', hasStroke);
    toggleCpBranch('ci_ischemic_stroke_wrap', hasStroke);
    if (hasStroke && patient.ci_ischemic_stroke !== 'timing_unspecified') {
      setCpRadioVal('ci_ischemic_stroke', patient.ci_ischemic_stroke);
    }

    setElChk('ci_cns_surgery_3m', patient.ci_cns_surgery_3m);
    setElChk('ci_major_surgery_3w', patient.ci_major_surgery_3w);
    setElChk('ci_head_facial_trauma_3m', patient.ci_head_facial_trauma_3m);

    const hasBleed = Boolean(patient.ci_internal_bleeding && patient.ci_internal_bleeding !== 'none' && patient.ci_internal_bleeding !== 'unspecified');
    setElChk('ci_internal_bleeding_chk', hasBleed);
    toggleCpBranch('ci_internal_bleeding_wrap', hasBleed);
    if (hasBleed && patient.ci_internal_bleeding !== 'timing_unspecified') {
      setCpRadioVal('ci_internal_bleeding', patient.ci_internal_bleeding);
    }

    setElChk('ci_prior_fibrinolytic', patient.ci_prior_fibrinolytic);
    setElChk('ci_coagulopathy_anticoagulant', patient.ci_coagulopathy_anticoagulant);
    setElChk('ci_pde5_inhibitor', patient.ci_pde5_inhibitor);
    setElChk('ci_pregnancy_postpartum_1w', patient.gender === 'หญิง' && patient.ci_pregnancy_postpartum_1w);
    if (!hasCiPositives && hasCiExplicitNone) setElChk('chestpain_ci_none', true);

    checkChestpainHighRiskMedTrigger();

    if (patient.ud_cad_hosp_status && patient.ud_cad_hosp_status !== 'none') {
      setCpRadioVal('ud_cad_hosp_status', patient.ud_cad_hosp_status);
      toggleCpBranch('ud_cad_other_hosp_wrap', patient.ud_cad_hosp_status === 'other');
      setElChk('ud_cad_tx_pci', patient.ud_cad_pci);
      setElChk('ud_cad_tx_cabg', patient.ud_cad_cabg);
      setElChk('ud_cad_tx_meds', patient.ud_cad_meds);
      setElVal('ud_cad_hosp_name', patient.ud_cad_hosp_name || '');
    }
    setElVal('chestpain_other_free', patient.otherSymptomsFree || '');
  },

  collectIntake(ctx) {
    ctx = ctx || {};
    const _rawDur = parseFloat(document.getElementById('chestpainDurationVal')?.value);
    const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
    const durationUnit = durationVal ? (document.getElementById('chestpainDurationUnit')?.value || 'hours') : null;
    const chestpainOnsetMode = getCpRadioVal('chestpainOnsetMode') || 'unspecified';
    const chestpainIntermittentBaseline = (chestpainOnsetMode === 'intermittent') ? (getCpRadioVal('chestpainIntermittentBaseline') || '') : '';

    const chestpainLocs = getCpCheckedVals('chestpain_loc');
    if (document.getElementById('chestpain_loc_other_chk')?.checked) {
      const txt = document.getElementById('chestpain_loc_other_text')?.value?.trim();
      if (txt) chestpainLocs.push(`อื่นๆ: ${txt}`);
    }

    const chestpain_rad_none = Boolean(document.getElementById('chestpain_rad_none')?.checked);
    const chestpainRads = chestpain_rad_none ? ['none'] : getCpCheckedVals('chestpain_rad');
    if (!chestpain_rad_none && document.getElementById('chestpain_rad_other_chk')?.checked) {
      const txt = document.getElementById('chestpain_rad_other_text')?.value?.trim();
      if (txt) chestpainRads.push(`อื่นๆ: ${txt}`);
    }

    const chestpainChars = getCpCheckedVals('chestpain_char');
    if (document.getElementById('chestpain_char_other_chk')?.checked) {
      const txt = document.getElementById('chestpain_char_other_text')?.value?.trim();
      if (txt) chestpainChars.push(`อื่นๆ: ${txt}`);
    }

    const chestpainPainScore = chestpainPainScoreTouched ? parseInt(document.getElementById('chestpainPainScore')?.value, 10) : null;
    const chestpainAnginaExertion = getCpRadioVal('chestpainAnginaExertion') || 'unspecified';
    const _ov20 = getCpRadioVal('chestpainAnginaOver20m');
    const chestpainAnginaOver20m = _ov20 === 'yes' ? true : (_ov20 === 'no' ? false : null);
    const chestpainAnginaOver20mStatus = _ov20 || 'unspecified';

    const _ntgRaw = getCpRadioVal('chestpainNtgHx');
    const chestpainNtgHx = _ntgRaw === 'yes' ? true : (_ntgRaw === 'no' ? false : null);
    const chestpainNtgHxStatus = _ntgRaw || 'unspecified';
    const chestpainNtgCurrent = chestpainNtgHx === true ? (getCpRadioVal('chestpainNtgCurrent') || '') : 'not_applicable';

    const chestpain_cardio_none = Boolean(document.getElementById('chestpain_cardio_none')?.checked);
    const chestpain_rf_diaphoresis = !chestpain_cardio_none && Boolean(document.getElementById('chestpain_rf_diaphoresis')?.checked);
    const chestpain_rf_syncope = !chestpain_cardio_none && Boolean(document.getElementById('chestpain_rf_syncope')?.checked);
    const chestpain_rf_palpitation = !chestpain_cardio_none && Boolean(document.getElementById('chestpain_rf_palpitation')?.checked);
    const chestpain_rf_orthopnea = !chestpain_cardio_none && Boolean(document.getElementById('chestpain_rf_orthopnea')?.checked);

    const chestpain_assoc_none = Boolean(document.getElementById('chestpain_assoc_none')?.checked);
    const chestpain_rf_dyspnea = !chestpain_assoc_none && Boolean(document.getElementById('chestpain_rf_dyspnea')?.checked);
    const chestpainDyspneaPatterns = chestpain_rf_dyspnea ? getCpCheckedVals('chestpain_dyspnea_pattern') : [];
    const chestpain_rf_hemoptysis = !chestpain_assoc_none && Boolean(document.getElementById('chestpain_rf_hemoptysis')?.checked);
    const chestpain_rf_calf_swelling = !chestpain_assoc_none && Boolean(document.getElementById('chestpain_rf_calf_swelling')?.checked);
    const chestpain_bilateral_leg_edema = !chestpain_assoc_none && Boolean(document.getElementById('chestpain_bilateral_leg_edema')?.checked);
    const chestpain_abdpain = !chestpain_assoc_none && Boolean(document.getElementById('chestpain_abdpain')?.checked);
    const chestpainAbdpainLocs = chestpain_abdpain ? getCpCheckedVals('chestpain_abdpain_loc') : [];
    const chestpainAbdpainChars = chestpain_abdpain ? getCpCheckedVals('chestpain_abdpain_char') : [];
    const chestpainAbdpainRads = chestpain_abdpain ? getCpCheckedVals('chestpain_abdpain_rad') : [];

    const chestpain_pulm_none = Boolean(document.getElementById('chestpain_pulm_none')?.checked);
    const chestpain_pulm_travel = !chestpain_pulm_none && Boolean(document.getElementById('chestpain_pulm_travel')?.checked);
    const chestpain_pulm_bedridden = !chestpain_pulm_none && Boolean(document.getElementById('chestpain_pulm_bedridden')?.checked);
    const chestpain_pulm_cancer_ocp = !chestpain_pulm_none && Boolean(document.getElementById('chestpain_pulm_cancer_ocp')?.checked);

    const chestpain_gi_none = Boolean(document.getElementById('chestpain_gi_none')?.checked);
    const chestpain_gi_heartburn_up = !chestpain_gi_none && Boolean(document.getElementById('chestpain_gi_heartburn_up')?.checked);
    const chestpain_gi_regurgitation = !chestpain_gi_none && Boolean(document.getElementById('chestpain_gi_regurgitation')?.checked);
    const chestpain_gi_post_meal = !chestpain_gi_none && Boolean(document.getElementById('chestpain_gi_post_meal')?.checked);
    const chestpain_gi_dysphagia = !chestpain_gi_none && Boolean(document.getElementById('chestpain_gi_dysphagia')?.checked);
    const chestpain_gi_severe_emesis = !chestpain_gi_none && Boolean(document.getElementById('chestpain_gi_severe_emesis')?.checked);

    const chestpain_msk_none = Boolean(document.getElementById('chestpain_msk_none')?.checked);
    const chestpain_msk_tender = !chestpain_msk_none && Boolean(document.getElementById('chestpain_msk_tender')?.checked);
    const chestpain_msk_movement = !chestpain_msk_none && Boolean(document.getElementById('chestpain_msk_movement')?.checked);
    const chestpain_msk_heavy_lifting = !chestpain_msk_none && Boolean(document.getElementById('chestpain_msk_heavy_lifting')?.checked);
    const chestpain_msk_trauma = !chestpain_msk_none && Boolean(document.getElementById('chestpain_msk_trauma')?.checked);
    const chestpainTraumaDetail = chestpain_msk_trauma ? (document.getElementById('chestpainTraumaDetail')?.value?.trim() || '') : '';

    // Contraindications (Zero Default Bias: unscreened Card 4 -> none/false/unspecified strictly)
    const gender = ctx.gender || 'ไม่ระบุ';
    const isFem = gender === 'หญิง' || isCpFemaleTitle();
    const ciSectionEl = document.getElementById('chestpain_high_risk_med_section');
    const isCiSectionOpen = ciSectionEl ? !ciSectionEl.classList.contains('hidden') : Boolean(chestpainHighRiskForcedOpen || getChestpainAcsCriteriaCount() >= 2);

    const chestpain_ci_none = isCiSectionOpen && Boolean(document.getElementById('chestpain_ci_none')?.checked);
    const ci_ich_tumor_avm = isCiSectionOpen && !chestpain_ci_none && Boolean(document.getElementById('ci_ich_tumor_avm')?.checked);
    const ci_cns_surgery_3m = isCiSectionOpen && !chestpain_ci_none && Boolean(document.getElementById('ci_cns_surgery_3m')?.checked);
    const ci_major_surgery_3w = isCiSectionOpen && !chestpain_ci_none && Boolean(document.getElementById('ci_major_surgery_3w')?.checked);
    const ci_head_facial_trauma_3m = isCiSectionOpen && !chestpain_ci_none && Boolean(document.getElementById('ci_head_facial_trauma_3m')?.checked);
    const ci_prior_fibrinolytic = isCiSectionOpen && !chestpain_ci_none && Boolean(document.getElementById('ci_prior_fibrinolytic')?.checked);
    const ci_coagulopathy_anticoagulant = isCiSectionOpen && !chestpain_ci_none && Boolean(document.getElementById('ci_coagulopathy_anticoagulant')?.checked);
    const ci_pde5_inhibitor = isCiSectionOpen && !chestpain_ci_none && Boolean(document.getElementById('ci_pde5_inhibitor')?.checked);
    const ci_pregnancy_postpartum_1w = isCiSectionOpen && isFem && !chestpain_ci_none && Boolean(document.getElementById('ci_pregnancy_postpartum_1w')?.checked);

    const strokeChk = isCiSectionOpen && !chestpain_ci_none && Boolean(document.getElementById('ci_ischemic_stroke_chk')?.checked);
    const bleedChk = isCiSectionOpen && !chestpain_ci_none && Boolean(document.getElementById('ci_internal_bleeding_chk')?.checked);
    const anyCiAnswered = isCiSectionOpen && Boolean(
      chestpain_ci_none || ci_ich_tumor_avm || strokeChk || ci_cns_surgery_3m || ci_major_surgery_3w ||
      ci_head_facial_trauma_3m || bleedChk || ci_prior_fibrinolytic || ci_coagulopathy_anticoagulant ||
      ci_pde5_inhibitor || ci_pregnancy_postpartum_1w
    );
    const ci_ischemic_stroke = strokeChk
      ? (getCpRadioVal('ci_ischemic_stroke') || 'timing_unspecified')
      : (anyCiAnswered ? 'none' : 'unspecified');
    const ci_internal_bleeding = bleedChk
      ? (getCpRadioVal('ci_internal_bleeding') || 'timing_unspecified')
      : (anyCiAnswered ? 'none' : 'unspecified');

    const hasCad = Boolean(document.getElementById('ud_cad')?.checked);
    const ud_cad_hosp_status = hasCad ? (getCpRadioVal('ud_cad_hosp_status') || 'ratchaburi') : 'none';
    const ud_cad_pci = hasCad && Boolean(document.getElementById('ud_cad_tx_pci')?.checked);
    const ud_cad_cabg = hasCad && Boolean(document.getElementById('ud_cad_tx_cabg')?.checked);
    const ud_cad_meds = hasCad && Boolean(document.getElementById('ud_cad_tx_meds')?.checked);
    const ud_cad_hosp_name = hasCad ? (document.getElementById('ud_cad_hosp_name')?.value?.trim() || '') : '';

    const hospRecordStatus = ctx.hospRecordStatus || 'unspecified';
    const underlying = Array.isArray(ctx.underlying) ? ctx.underlying : [];

    return {
      id: ctx.recordId || `case-${Date.now()}`,
      queue_number: ctx.queueNumber || 'ER-NEW',
      hn: ctx.randomHn || '-',
      name: ctx.patientName || 'ไม่ระบุชื่อ',
      age: ctx.patientAge !== undefined ? ctx.patientAge : 'ไม่ระบุ',
      gender,
      chief_complaint: 'chest_pain',
      chief_complaint_title: 'เจ็บแน่นหน้าอก',
      status: ctx.recordStatus || 'waiting',
      timestamp: new Date().toISOString(),
      durationVal,
      durationUnit,
      chestpainPainScore,
      chestpainOnsetMode,
      chestpainIntermittentBaseline,
      chestpainLocs,
      chestpainRads,
      chestpainChars,
      chestpainAnginaExertion,
      chestpainAnginaOver20m,
      chestpainAnginaOver20mStatus,
      chestpainNtgHx,
      chestpainNtgHxStatus,
      chestpainNtgCurrent,
      chestpain_cardio_none,
      chestpain_rf_diaphoresis,
      chestpain_rf_syncope,
      chestpain_rf_palpitation,
      chestpain_rf_orthopnea,
      chestpain_assoc_none,
      chestpain_rf_dyspnea,
      chestpainDyspneaPatterns,
      chestpain_rf_hemoptysis,
      chestpain_rf_calf_swelling,
      chestpain_bilateral_leg_edema,
      chestpain_abdpain,
      chestpainAbdpainLocs,
      chestpainAbdpainChars,
      chestpainAbdpainRads,
      chestpain_pulm_none,
      chestpain_pulm_travel,
      chestpain_pulm_bedridden,
      chestpain_pulm_cancer_ocp,
      chestpain_gi_none,
      chestpain_gi_heartburn_up,
      chestpain_gi_regurgitation,
      chestpain_gi_post_meal,
      chestpain_gi_dysphagia,
      chestpain_gi_severe_emesis,
      chestpain_msk_none,
      chestpain_msk_tender,
      chestpain_msk_movement,
      chestpain_msk_heavy_lifting,
      chestpain_msk_trauma,
      chestpainTraumaDetail,
      chestpainHighRiskForcedOpen,
      chestpain_ci_none,
      ci_ich_tumor_avm,
      ci_ischemic_stroke,
      ci_cns_surgery_3m,
      ci_major_surgery_3w,
      ci_head_facial_trauma_3m,
      ci_internal_bleeding,
      ci_prior_fibrinolytic,
      ci_coagulopathy_anticoagulant,
      ci_pregnancy_postpartum_1w,
      ci_pde5_inhibitor,
      ud_cad_hosp_status,
      ud_cad_pci,
      ud_cad_cabg,
      ud_cad_meds,
      ud_cad_hosp_name,
      otherSymptomsFree: document.getElementById('chestpain_other_free')?.value?.trim() || ctx.otherSymptomsFree || '',
      hospRecordStatus,
      underlying: underlying.length > 0 ? underlying : ((hospRecordStatus === 'self' || hospRecordStatus === 'additional') ? ['ปฏิเสธ'] : []),
      drugAllergy: ctx.drugAllergy || 'ไม่ได้ระบุ',
      currentMeds: ctx.currentMeds || 'ไม่ได้ระบุ',
      doctor_notes: ctx.preservedDoctorNotes || { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' }
    };
  },

  isRedFlag(p) {
    return evaluateChestpainRedFlags(p).length > 0;
  },

  evaluateRedFlags: evaluateChestpainRedFlags,
  updateOutputs: updateChestPainOutputs
});
