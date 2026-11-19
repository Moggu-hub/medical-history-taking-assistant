// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 04_fever.js
// อาการนำ: ไข้ / หนาวสั่น (Fever / Chills — Gold Standard 2-Card UI/UX + Complete Clinical Capture)
// ควบรวม 2 การ์ดตาราง 4 คอลัมน์ + ไอคอนสี + ปุ่มมุมขวาบน "ไม่มีอาการในหมวดนี้" + กิ่งย่อยใต้แถว + กิ่งสตรีตามบริบท
// =========================================================================

// --- Lookup Dictionaries (Zero Raw Enum Leaks: C-AP14) ---
const FN_LABELS = {
  durationUnit: {
    minutes: 'นาที',
    hours: 'ชั่วโมง',
    days: 'วัน',
    weeks: 'สัปดาห์',
    months: 'เดือน',
    years: 'ปี'
  },
  tempMeasured: {
    measured: 'ได้วัดไข้ด้วยตัวเอง',
    not_measured: 'ไม่ได้วัดไข้',
    unspecified: 'ไม่ได้ระบุการวัดไข้'
  },
  pattern: {
    chills_and_rigor: 'ไข้สูง หนาวสั่นสะท้าน (Chills & rigor)',
    continuous_high: 'ไข้สูงลอยตลอดเวลา (Continuous high grade)',
    intermittent: 'ไข้เป็นๆ หายๆ (Intermittent fever)',
    low_grade: 'ไข้ต่ำๆ ตัวรุมๆ (Low grade fever)',
    unspecified: 'ไม่ได้ระบุลักษณะไข้'
  },
  antipyreticTaken: {
    taken: 'ทานยาลดไข้แล้ว',
    not_taken: 'ยังไม่ได้ทานยา',
    unspecified: 'ไม่ได้ระบุการทานยาลดไข้'
  },
  antipyreticResp: {
    temporary_relief: 'ไข้ลดลงชั่วคราว',
    refractory: 'ไข้ไม่ลดลงเลย',
    unspecified: 'ไม่ได้ระบุผลหลังทานยา'
  },
  antipyreticType: {
    paracetamol: 'พาราเซตามอล',
    nsaid_aspirin: 'ยาแก้ปวดลดไข้สูง หรือยาชุด (NSAIDs/แอสไพริน)',
    unknown_med: 'ไม่ทราบชื่อยา'
  },
  coughDetail: {
    dry: 'ไอแห้งๆ ไม่มีเสมหะ',
    throat_phlegm: 'เสมหะในคอ',
    clear: 'เสมหะสีขาวใส',
    purulent: 'เสมหะสีเขียวหรือเหลือง',
    blood: 'เสมหะปนเลือด'
  },
  soreThroatLoc: {
    left: 'ด้านซ้าย',
    right: 'ด้านขวา',
    diffuse: 'ทั่วๆ ลำคอ',
    odinophagia_trismus: 'กลืนน้ำลายลำบาก / อ้าปากได้น้อย'
  },
  dyspneaPattern: {
    continuous: 'เหนื่อยตลอดเวลา แม้อยู่เฉยๆ',
    on_exertion: 'เหนื่อยเมื่อออกแรงหรือเดิน',
    orthopnea: 'เหนื่อยมากขึ้นเมื่อนอนราบ (Orthopnea)',
    with_cough: 'เหนื่อยเวลาไอหรือพูดต่อเนื่อง'
  },
  abdpainLoc: {
    diffuse: 'ทั่วทั้งท้อง',
    epigastrium: 'ใต้ลิ้นปี่',
    ruq: 'ชายโครงขวา',
    luq: 'ชายโครงซ้าย',
    periumbilical: 'รอบสะดือ',
    rlq: 'ท้องน้อยขวา',
    llq: 'ท้องน้อยซ้าย',
    suprapubic: 'ท้องน้อยตรงกลาง/หัวหน่าว'
  },
  abdpainChar: {
    burning: 'แสบร้อน',
    sharp_tearing: 'เสียดแทง',
    crampy: 'บิดเกร็ง',
    dull: 'ตื้อ'
  },
  abdpainRad: {
    back_left: 'ร้าวหลังซ้าย',
    back_right: 'ร้าวหลังขวา',
    back_mid: 'ร้าวทะลุหลังตรงกลาง',
    chest: 'ร้าวขึ้นหน้าอก',
    groin_thigh_genitalia: 'ร้าวลงต้นขา/ขาหนีบ/อวัยวะเพศ'
  },
  diarrheaStool: {
    watery: 'เหลวเป็นน้ำ',
    loose_mushy: 'เละๆ',
    melena_tarry: 'ดำหนืดเหมือนยางมะตอย (Melena)',
    bloody_mucus: 'มีมูกเลือดปน'
  },
  vomitContent: {
    food_gastric: 'อาหาร/น้ำย่อยเหลือง',
    bilious_green: 'สีเขียวน้ำดี',
    coffee_ground: 'สีดำคล้ายน้ำโค้ก (Coffee-ground)',
    bloody: 'เป็นเลือด/ปนเลือด (Hematemesis)'
  },
  pregnancy: {
    not_pregnant: 'ไม่ได้ตั้งครรภ์ / ประจำเดือนปกติ',
    missed_period: 'ขาดประจำเดือน / สงสัยตั้งครรภ์',
    pregnant: 'กำลังตั้งครรภ์',
    postpartum_6w: 'เพิ่งคลอดหรือแท้งใน 6 สัปดาห์',
    menopause_hysterectomy: 'วัยหมดประจำเดือน / ผ่าตัดมดลูก',
    unsure: 'ไม่แน่ใจสถานะการตั้งครรภ์',
    unspecified: 'ไม่ได้ระบุสถานะการตั้งครรภ์',
    not_applicable: 'ไม่เกี่ยวข้อง (ผู้ป่วยชาย)'
  },
  hospStatus: {
    complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
    additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
    self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
    unspecified: 'ไม่ได้ระบุ'
  }
};

// --- DOM Helpers & Dynamic Context Handlers (Scoped fn* — Modular Isolated Handlers) ---
function toggleFnBranch(id, show) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('hidden', !show);
}

function getFnRadioVal(name) {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : '';
}

function setFnRadioVal(name, val) {
  document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
    r.checked = Boolean(val && r.value === val);
  });
}

function getFnCheckedVals(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(el => el.value);
}

function setFnCheckboxGroup(name, vals) {
  const list = Array.isArray(vals) ? vals : [];
  document.querySelectorAll(`input[name="${name}"]`).forEach(cb => {
    cb.checked = list.includes(cb.value);
  });
}

function clearFnNoneCheckbox(noneId) {
  const noneEl = document.getElementById(noneId);
  if (noneEl) noneEl.checked = false;
}

function handleFnOtherTextChk(chkId, wrapId, textId) {
  const chk = document.getElementById(chkId);
  const active = Boolean(chk && chk.checked);
  toggleFnBranch(wrapId, active);
  if (!active) {
    const inp = document.getElementById(textId);
    if (inp) inp.value = '';
  }
}

// Card 1: Antipyretic Taken + Latest Time & Self Temp
function handleFnAntipyreticTakenChange(val) {
  const current = val || getFnRadioVal('fnAntipyreticTaken');
  const isTaken = current === 'taken';
  toggleFnBranch('fnAntipyreticBranch', isTaken);
  if (!isTaken) {
    setFnRadioVal('fnAntipyreticResponse', '');
    setFnCheckboxGroup('fnAntipyreticTypes', []);
    const tInp = document.getElementById('fnAntipyreticLastTime');
    const tUnk = document.getElementById('fnAntipyreticTimeUnknown');
    if (tInp) tInp.value = '';
    if (tUnk) tUnk.checked = false;
  }
}

function handleFnAntipyreticTimeUnknownToggle(el) {
  const inp = document.getElementById('fnAntipyreticLastTime');
  if (el && el.checked && inp) inp.value = '';
}

function handleFnAntipyreticTimeInput() {
  const inp = document.getElementById('fnAntipyreticLastTime');
  const unk = document.getElementById('fnAntipyreticTimeUnknown');
  if (inp && inp.value.trim() && unk) unk.checked = false;
}

function handleFnTempMeasuredChange(val) {
  const current = val || getFnRadioVal('fnTempMeasured');
  const isMeasured = current === 'measured';
  toggleFnBranch('fnMaxTempWrap', isMeasured);
  if (!isMeasured) {
    const inp = document.getElementById('fnMaxTempVal');
    const unk = document.getElementById('fnMaxTempUnknown');
    if (inp) inp.value = '';
    if (unk) unk.checked = false;
  }
}

function handleFnMaxTempUnknownToggle(el) {
  const inp = document.getElementById('fnMaxTempVal');
  if (el && el.checked && inp) inp.value = '';
}

function handleFnMaxTempInput() {
  const inp = document.getElementById('fnMaxTempVal');
  const unk = document.getElementById('fnMaxTempUnknown');
  if (inp && inp.value.trim() && unk) unk.checked = false;
}

// System Corner "ไม่มีอาการในหมวดนี้" Master Toggle
function handleFnGroupNoneChange(noneId, itemIds, branchConfigs = []) {
  const noneEl = document.getElementById(noneId);
  if (!noneEl || !noneEl.checked) return;
  itemIds.forEach(id => {
    const cb = document.getElementById(id);
    if (cb) cb.checked = false;
  });
  branchConfigs.forEach(cfg => {
    toggleFnBranch(cfg.wrap, false);
    if (cfg.clearInputs) {
      cfg.clearInputs.forEach(iId => {
        const inp = document.getElementById(iId);
        if (inp) inp.value = '';
      });
    }
    if (cfg.clearNames) {
      cfg.clearNames.forEach(n => setFnCheckboxGroup(n, []));
    }
    if (cfg.clearChecks) {
      cfg.clearChecks.forEach(cId => {
        const c = document.getElementById(cId);
        if (c) c.checked = false;
      });
    }
  });
  updateFnFemaleContext();
}

function handleFnRespItemChange(chkId, branchId) {
  const cb = document.getElementById(chkId);
  const checked = Boolean(cb && cb.checked);
  if (checked) clearFnNoneCheckbox('fn_sx_resp_none');
  if (branchId) toggleFnBranch(branchId, checked);
  if (!checked && branchId === 'fnCoughBranch') {
    setFnCheckboxGroup('fnCoughDetail', []);
    const oc = document.getElementById('fn_cough_other_chk');
    if (oc) oc.checked = false;
    handleFnOtherTextChk('fn_cough_other_chk', 'fn_cough_other_wrap', 'fn_cough_other_text');
  } else if (!checked && branchId === 'fnSorethroatBranch') {
    setFnCheckboxGroup('fnSorethroatLoc', []);
    const oc = document.getElementById('fn_st_other_chk');
    if (oc) oc.checked = false;
    handleFnOtherTextChk('fn_st_other_chk', 'fn_st_other_wrap', 'fn_st_other_text');
  } else if (!checked && branchId === 'fnDyspneaBranch') {
    setFnCheckboxGroup('fnDyspneaPattern', []);
    const oc = document.getElementById('fn_dyspnea_other_chk');
    if (oc) oc.checked = false;
    handleFnOtherTextChk('fn_dyspnea_other_chk', 'fn_dyspnea_other_wrap', 'fn_dyspnea_other_text');
  }
}

function handleFnGiItemChange(chkId, branchId) {
  const cb = document.getElementById(chkId);
  const checked = Boolean(cb && cb.checked);
  if (checked) clearFnNoneCheckbox('fn_sx_gi_none');
  if (branchId) toggleFnBranch(branchId, checked);
  if (!checked && branchId === 'fnAbdpainBranch') {
    ['fnAbdpainLoc', 'fnAbdpainChar', 'fnAbdpainRad'].forEach(n => setFnCheckboxGroup(n, []));
    [
      ['fn_abdpain_loc_other_chk', 'fn_abdpain_loc_other_wrap', 'fn_abdpain_loc_other_text'],
      ['fn_abdpain_char_other_chk', 'fn_abdpain_char_other_wrap', 'fn_abdpain_char_other_text'],
      ['fn_abdpain_rad_other_chk', 'fn_abdpain_rad_other_wrap', 'fn_abdpain_rad_other_text']
    ].forEach(([c, w, t]) => {
      const cel = document.getElementById(c);
      if (cel) cel.checked = false;
      handleFnOtherTextChk(c, w, t);
    });
  } else if (!checked && branchId === 'fnDiarrheaBranch') {
    const df = document.getElementById('fnDiarrheaFreq');
    if (df) df.value = '';
    setFnCheckboxGroup('fnDiarrheaStool', []);
    const oc = document.getElementById('fn_diarrhea_other_chk');
    if (oc) oc.checked = false;
    handleFnOtherTextChk('fn_diarrhea_other_chk', 'fn_diarrhea_other_wrap', 'fn_diarrhea_other_text');
  } else if (!checked && branchId === 'fnVomitBranch') {
    const noChk = document.getElementById('fn_vomit_nausea_only');
    if (noChk) noChk.checked = false;
    handleFnNauseaOnlyToggle(false);
    const vf = document.getElementById('vomitFreq');
    if (vf) vf.value = '';
    setFnCheckboxGroup('fnVomitContent', []);
    const oc = document.getElementById('fn_vomit_other_chk');
    if (oc) oc.checked = false;
    handleFnOtherTextChk('fn_vomit_other_chk', 'fn_vomit_other_wrap', 'fn_vomit_other_text');
  }
  updateFnFemaleContext();
}

function handleFnNauseaOnlyToggle(checked) {
  toggleFnBranch('vomitCharSection', !checked);
  if (checked) {
    const vf = document.getElementById('vomitFreq');
    if (vf) vf.value = '';
    setFnCheckboxGroup('fnVomitContent', []);
    const oc = document.getElementById('fn_vomit_other_chk');
    if (oc) oc.checked = false;
    handleFnOtherTextChk('fn_vomit_other_chk', 'fn_vomit_other_wrap', 'fn_vomit_other_text');
  }
}

function handleFnSkinItemChange(chkId, wrapId, textId) {
  const cb = document.getElementById(chkId);
  const checked = Boolean(cb && cb.checked);
  if (checked) clearFnNoneCheckbox('fn_sx_skin_none');
  if (wrapId) toggleFnBranch(wrapId, checked);
  if (!checked && textId) {
    const inp = document.getElementById(textId);
    if (inp) inp.value = '';
  }
}

function handleFnTropicalItemChange(chkId) {
  const cb = document.getElementById(chkId);
  if (cb && cb.checked) clearFnNoneCheckbox('fn_sx_tropical_none');
  updateFnFemaleContext();
}

// Context-Triggered Female Sub-branch (C-AP13 + User /grill-me Rule: show ONLY for females WITH pelvic abd pain OR dengue bleeding/exposure risk)
function isFnFemaleTitle(arg) {
  if (arg && typeof arg === 'object') {
    if (typeof arg.isFemale === 'boolean') return arg.isFemale;
    if (typeof arg.title === 'string') return /^(?:นาง|นางสาว|น\.ส\.|ด\.ญ\.|หญิง)/.test(arg.title.trim());
  }
  let titleStr = typeof arg === 'string' ? arg : '';
  if (!titleStr) {
    const sel = document.getElementById('patientTitleSelect');
    titleStr = sel ? (sel.value || '') : '';
  }
  return /^(?:นาง|นางสาว|น\.ส\.|ด\.ญ\.|หญิง)/.test(titleStr.trim());
}

function handleFnPregnancyChange(val) {
  const current = val || getFnRadioVal('fnPregnancyStatus');
  const isPreg = current === 'pregnant';
  toggleFnBranch('fnPregnancyWeeksWrap', isPreg);
  if (!isPreg) {
    const inp = document.getElementById('fnPregnancyWeeks');
    if (inp) inp.value = '';
  }
}

function shouldShowFnFemaleBranch(forceFemaleBool) {
  const isFem = typeof forceFemaleBool === 'boolean' ? forceFemaleBool : isFnFemaleTitle();
  if (!isFem) return false;

  const hasAbd = Boolean(document.getElementById('fn_sx_abdpain')?.checked);
  const abdLocs = hasAbd ? getFnCheckedVals('fnAbdpainLoc') : [];
  const hasLowerAbd = ['rlq', 'llq', 'suprapubic'].some(loc => abdLocs.includes(loc));
  const hasPetechiae = Boolean(document.getElementById('fn_sx_petechiae')?.checked);
  const hasDengueExposure = Boolean(document.getElementById('fn_sx_close_contact_fever')?.checked);

  return hasLowerAbd || hasPetechiae || hasDengueExposure;
}

function updateFnFemaleContext(forceFemaleBool) {
  const showFem = shouldShowFnFemaleBranch(forceFemaleBool);
  toggleFnBranch('fnFemaleContextBranch', showFem);
  if (!showFem) {
    setFnRadioVal('fnPregnancyStatus', '');
    handleFnPregnancyChange('');
    ['fn_fem_pv_bleeding', 'fn_fem_pelvic_discharge'].forEach(id => {
      const c = document.getElementById(id);
      if (c) c.checked = false;
    });
    const lmp = document.getElementById('fnLmpDate');
    if (lmp) lmp.value = '';
  }
}

// --- Red Flag Evaluator (Sepsis-3, CNS, Deep Neck, Cholangitis, Severe Dengue, HAI/Neutropenia, Maternal Sepsis) ---
function evaluateFeverNewRedFlags(patient) {
  const flags = [];
  if (!patient) return flags;

  const coughDetails = Array.isArray(patient.coughDetails) ? patient.coughDetails : [];
  const soreThroatLocs = Array.isArray(patient.soreThroatLocs) ? patient.soreThroatLocs : [];
  const dyspneaPatterns = Array.isArray(patient.dyspneaPatterns) ? patient.dyspneaPatterns : [];
  const abdpainChars = Array.isArray(patient.abdpainChars) ? patient.abdpainChars : [];
  const abdpainRads = Array.isArray(patient.abdpainRads) ? patient.abdpainRads : [];
  const diarrheaStools = Array.isArray(patient.diarrheaStools) ? patient.diarrheaStools : [];
  const vomitContents = Array.isArray(patient.vomitContents) ? patient.vomitContents : [];
  const antiTypes = Array.isArray(patient.fnAntipyreticTypes) ? patient.fnAntipyreticTypes : [];

  // 1. Acute CNS Infection
  if (patient.stiffNeck || patient.alteredMental || patient.seizure) {
    const parts = [];
    if (patient.stiffNeck) parts.push('คอแข็งก้มคอไม่ลง');
    if (patient.alteredMental) parts.push('ซึมลง/สับสน');
    if (patient.seizure) parts.push('ชักเกร็ง');
    flags.push({
      key: 'fn_rf_cns_infection',
      textTh: `สงสัยติดเชื้อระบบประสาทส่วนกลาง: ${parts.join(', ')} (Acute Meningitis / Encephalitis)`,
      risk: 'เสี่ยง Acute Meningitis / Encephalitis / Septic Encephalopathy ต้องประเมิน GCS, Hemoculture และพิจารณา CT/LP + Empirical Antibiotics',
      triageLevel: 1
    });
  }

  // 2. Sepsis / Respiratory Failure / Hemoptysis / Oliguria
  const hasHemoptysis = patient.cough && coughDetails.includes('blood');
  if (patient.dyspnea || patient.fnOliguria || hasHemoptysis) {
    const parts = [];
    if (patient.dyspnea) parts.push(dyspneaPatterns.includes('orthopnea') ? 'หายใจเหนื่อยหอบร่วมกับนอนราบไม่ได้ (Orthopnea)' : 'หายใจเหนื่อยหอบ');
    if (hasHemoptysis) parts.push('ไอเสมหะปนเลือด');
    if (patient.fnOliguria) parts.push('ปัสสาวะออกน้อยผิดปกติ');
    flags.push({
      key: 'fn_rf_sepsis_respiratory',
      textTh: `สัญญาณเตือนติดเชื้อในกระแสเลือดหรือระบบหายใจล้มเหลว: ${parts.join(', ')} (Sepsis / Respiratory Risk)`,
      risk: 'เสี่ยง Severe Pneumonia / Sepsis / Acute Respiratory Failure / AKI ต้องประเมิน ABC, SpO2, Lactate, Hemoculture ทันที',
      triageLevel: 1
    });
  }

  // 3. Upper Airway / Deep Neck Infection
  if (patient.soreThroat && soreThroatLocs.includes('odinophagia_trismus')) {
    flags.push({
      key: 'fn_rf_deep_neck_airway',
      textTh: 'เจ็บคอร่วมกับกลืนลำบากหรืออ้าปากได้น้อย (Suspected Deep Neck / Peritonsillar Abscess / Epiglottitis)',
      risk: 'เสี่ยงอุดกั้นทางเดินหายใจส่วนบนและการติดเชื้อช่องคอส่วนลึก ต้องประเมิน Airway และปรึกษา ENT เร่งด่วน',
      triageLevel: 2
    });
  }

  // 4. Cholangitis / GI Bleed / Surgical Abdomen
  if (patient.fnJaundice) {
    flags.push({
      key: 'fn_rf_acute_cholangitis',
      textTh: 'ไข้ร่วมกับตาเหลืองหรือตัวเหลือง (Suspected Acute Cholangitis / Biliary Sepsis)',
      risk: 'เสี่ยงท่อน้ำดีอักเสบเฉียบพลันหรือติดเชื้อตับ/ทางเดินน้ำดีรุนแรง ต้องตรวจ LFTs, Hemoculture และ Ultrasound Abdomen',
      triageLevel: 2
    });
  }
  const hasMelena = patient.diarrhea && diarrheaStools.includes('melena_tarry');
  const hasHematemesis = patient.vomit && !patient.isNauseaOnly && (vomitContents.includes('bloody') || vomitContents.includes('coffee_ground'));
  const hasTearingAbd = patient.abdpain && abdpainChars.includes('sharp_tearing') &&
    ['back_left', 'back_right', 'back_mid', 'chest'].some(r => abdpainRads.includes(r));

  if (hasMelena || hasHematemesis || hasTearingAbd) {
    flags.push({
      key: 'fn_rf_gi_surgical_emergency',
      textTh: 'ภาวะฉุกเฉินทางเดินอาหารหรือช่องท้องร่วมกับไข้ (GI Bleeding / Suspected Perforation)',
      risk: 'พบอาเจียนเป็นเลือด/ถ่ายดำ หรือปวดท้องเสียดแทงร้าวหลัง/อก ต้องเปิด IV ตรวจ CBC, G/M และประเมินศัลยกรรมทันที',
      triageLevel: 2
    });
  }

  // 5. Severe Dengue Warning Signs / NSAIDs Bleeding Risk
  const tookNsaid = antiTypes.includes('nsaid_aspirin');
  const dengueWarningGi = patient.abdpain || (patient.vomit && !patient.isNauseaOnly);
  const femaleBleedWithDengueRisk = patient.gender === 'หญิง' && patient.fn_fem_pv_bleeding && (patient.petechiae || patient.fnCloseContactFever);
  if (patient.petechiae || femaleBleedWithDengueRisk || (tookNsaid && dengueWarningGi)) {
    flags.push({
      key: 'fn_rf_dengue_bleeding',
      textTh: (patient.petechiae || femaleBleedWithDengueRisk)
        ? 'จุดจ้ำเลือดหรือเลือดออกผิดปกติร่วมกับไข้ (Suspected Severe Dengue / Bleeding Tendency / DIC)'
        : 'ไข้ร่วมกับทานยากลุ่ม NSAIDs/ยาชุด และมีปวดท้องหรืออาเจียน (High GI Bleeding Risk)',
      risk: 'เสี่ยงภาวะเลือดออกผิดปกติ ไข้เลือดออก หรือเกล็ดเลือดต่ำ ต้องตรวจ CBC, Dengue NS1 Ag และงด NSAIDs เด็ดขาด',
      triageLevel: 2
    });
  }

  // 6. Immunocompromised / HAI < 3m / Indwelling Device / Maternal or Pelvic Sepsis
  if (patient.fnChemoImmuno) {
    flags.push({
      key: 'fn_rf_febrile_neutropenia',
      textTh: 'ภาวะไข้ในผู้ป่วยได้รับเคมีบำบัดหรือยากดภูมิคุ้มกัน (Suspected Febrile Neutropenia)',
      risk: 'ภาวะฉุกเฉินในผู้ป่วยภูมิคุ้มกันต่ำ ต้องตรวจ CBC (ANC), Hemoculture และให้ Broad-spectrum IV Antibiotics ทันที',
      triageLevel: 2
    });
  }
  if (patient.fnRecentHosp3m || patient.fnIndwellingPostOp) {
    flags.push({
      key: 'fn_rf_hai_mdr_risk',
      textTh: 'เสี่ยงติดเชื้อในโรงพยาบาล/เชื้อดื้อยา หรือติดเชื้อสายสวน (HAI / MDR / Device Infection Risk)',
      risk: 'เคยนอน รพ. ในช่วง 3 เดือน หรือมีสายสวน/เพิ่งผ่าตัด ต้องพิจารณาเชื้อดื้อยาในโรงพยาบาล (ESBL/MRSA) และประเมินสายสวน',
      triageLevel: 2
    });
  }
  const isHighRiskFemale = patient.gender === 'หญิง' && (
    ['pregnant', 'postpartum_6w'].includes(patient.fnPregnancyStatus) ||
    patient.fn_fem_pelvic_discharge ||
    (patient.fn_fem_pv_bleeding && !femaleBleedWithDengueRisk)
  );
  if (isHighRiskFemale) {
    flags.push({
      key: 'fn_rf_maternal_pelvic_sepsis',
      textTh: 'ไข้ในผู้ป่วยตั้งครรภ์/หลังคลอด หรือสงสัยติดเชื้อในอุ้งเชิงกราน (Maternal / Pelvic Sepsis Risk)',
      risk: 'เสี่ยงติดเชื้อในครรภ์ แท้งติดเชื้อ หรือ PID ต้องตรวจประเมินสูตินรีเวชและเฝ้าระวังภาวะช็อกเร่งด่วน',
      triageLevel: 2
    });
  }

  return flags;
}

// --- Outputs Updater (Smart Corner Negative Reporting + C-AP5/6/9/12/13/14) ---
function updateFeverNewOutputs(patient) {
  if (!patient) return;

  const rfs = evaluateFeverNewRedFlags(patient);
  const unitTh = FN_LABELS.durationUnit[patient.durationUnit] || patient.durationUnit || 'วัน';
  const durationText = patient.durationVal ? `${patient.durationVal} ${unitTh}` : 'ไม่ระบุระยะเวลา';

  const patternStr = FN_LABELS.pattern[patient.feverPattern] || 'ไม่ได้ระบุลักษณะไข้';

  let antipyreticStr = FN_LABELS.antipyreticTaken[patient.fnAntipyreticTaken] || 'ไม่ได้ระบุการทานยาลดไข้';
  const antiTypes = Array.isArray(patient.fnAntipyreticTypes) ? patient.fnAntipyreticTypes : [];
  if (patient.fnAntipyreticTaken === 'taken') {
    const respLabel = FN_LABELS.antipyreticResp[patient.antipyreticResponse];
    const typeLabel = antiTypes.length > 0 ? antiTypes.map(t => FN_LABELS.antipyreticType[t] || t).join(', ') : '';
    const timeLabel = patient.fnAntipyreticTimeUnknown
      ? 'จำเวลาทานล่าสุดไม่ได้'
      : (patient.fnAntipyreticLastTime ? `ทานล่าสุดเวลา ${patient.fnAntipyreticLastTime} น.` : '');
    const details = [respLabel, typeLabel, timeLabel].filter(Boolean);
    if (details.length > 0) antipyreticStr += ` (${details.join(' | ')})`;
  }

  let tempStr = FN_LABELS.tempMeasured[patient.fnTempMeasured] || 'ไม่ได้ระบุการวัดไข้';
  if (patient.fnTempMeasured === 'measured') {
    if (patient.fnMaxTempUnknown) tempStr = 'ได้วัดไข้ด้วยตัวเอง (จำตัวเลขไม่ได้)';
    else if (patient.fnMaxTempVal) tempStr = `ได้วัดไข้ด้วยตัวเอง สูงสุด ${patient.fnMaxTempVal} °C`;
  }

  // Positives & Smart Negatives (Respects corner "ไม่มีอาการในหมวดนี้" toggle vs silent/unfilled systems; Zero 🚩 or category prefix per C-AP5)
  const positives = [];
  const negatives = [];

  // 1. Respiratory
  const anyResp = Boolean(patient.cough || patient.soreThroat || patient.rhinorrhea || patient.dyspnea);
  if (anyResp || patient.fnRespNone) {
    if (patient.cough) {
      const cList = (patient.coughDetails || []).map(d => FN_LABELS.coughDetail[d] || d);
      if (patient.fnCoughOtherText) cList.push(patient.fnCoughOtherText);
      positives.push(`มีอาการไอ (${cList.join(', ') || 'ไม่ระบุลักษณะ'})`);
    } else negatives.push('ปฏิเสธอาการไอ');

    if (patient.soreThroat) {
      const sList = (patient.soreThroatLocs || []).map(l => FN_LABELS.soreThroatLoc[l] || l);
      if (patient.fnSoreThroatOtherText) sList.push(patient.fnSoreThroatOtherText);
      positives.push(`เจ็บคอ (${sList.join(', ') || 'ไม่ระบุรายละเอียด'})`);
    } else negatives.push('ไม่เจ็บคอ');

    if (patient.rhinorrhea) positives.push('มีน้ำมูก/คัดจมูก');
    else negatives.push('ไม่มีน้ำมูก');

    if (patient.dyspnea) {
      const dList = (patient.dyspneaPatterns || []).map(p => FN_LABELS.dyspneaPattern[p] || p);
      if (patient.fnDyspneaOtherText) dList.push(patient.fnDyspneaOtherText);
      positives.push(`หายใจเหนื่อยหอบ (${dList.join(', ') || 'ไม่ระบุลักษณะ'})`);
    } else negatives.push('ปฏิเสธอาการหายใจเหนื่อยหอบ');
  }

  // 2. GI
  const anyGi = Boolean(patient.abdpain || patient.diarrhea || patient.vomit || patient.fnJaundice);
  if (anyGi || patient.fnGiNone) {
    if (patient.abdpain) {
      const lList = (patient.abdpainLocs || []).map(l => FN_LABELS.abdpainLoc[l] || l);
      if (patient.fnAbdpainLocOtherText) lList.push(patient.fnAbdpainLocOtherText);
      const cList = (patient.abdpainChars || []).map(c => FN_LABELS.abdpainChar[c] || c);
      if (patient.fnAbdpainCharOtherText) cList.push(patient.fnAbdpainCharOtherText);
      const rList = (patient.abdpainRads || []).map(r => FN_LABELS.abdpainRad[r] || r);
      if (patient.fnAbdpainRadOtherText) rList.push(patient.fnAbdpainRadOtherText);
      const rSuffix = rList.length > 0 ? `, ร้าวไป ${rList.join(', ')}` : '';
      positives.push(`ปวดท้องบริเวณ ${lList.join(', ') || 'ไม่ระบุ'} (${cList.join(', ') || 'ไม่ระบุลักษณะ'}${rSuffix})`);
    } else negatives.push('ปฏิเสธอาการปวดท้อง');

    if (patient.diarrhea) {
      const sList = (patient.diarrheaStools || []).map(s => FN_LABELS.diarrheaStool[s] || s);
      if (patient.fnDiarrheaOtherText) sList.push(patient.fnDiarrheaOtherText);
      positives.push(`ถ่ายเหลว ${patient.diarrheaFreq || 1} ครั้ง/วัน (${sList.join(', ') || 'ไม่ระบุลักษณะ'})`);
    } else negatives.push('ปฏิเสธอาการถ่ายเหลว');

    if (patient.vomit) {
      if (patient.isNauseaOnly) positives.push('คลื่นไส้ ยังไม่อาเจียน');
      else {
        const vList = (patient.vomitContents || []).map(v => FN_LABELS.vomitContent[v] || v);
        if (patient.fnVomitOtherText) vList.push(patient.fnVomitOtherText);
        positives.push(`อาเจียน ${patient.vomitFreq || 1} ครั้ง/วัน (${vList.join(', ') || 'ไม่ระบุลักษณะ'})`);
      }
    } else negatives.push('ไม่มีคลื่นไส้อาเจียน');

    if (patient.fnJaundice) positives.push('ตาเหลืองหรือตัวเหลือง');
    else negatives.push('ไม่มีตาเหลืองตัวเหลือง');
  }

  // 3. GU
  const anyGu = Boolean(patient.dysuria || patient.turbidUrine || patient.flankPain || patient.fnOliguria);
  if (anyGu || patient.fnGuNone) {
    if (patient.dysuria) positives.push('ปัสสาวะแสบขัด');
    else negatives.push('ปัสสาวะไม่แสบขัด');
    if (patient.turbidUrine) positives.push('ปัสสาวะขุ่น/มีเลือดปน');
    if (patient.flankPain) positives.push('ปวดบั้นเอว/หลัง');
    else negatives.push('ไม่ปวดบั้นเอว');
    if (patient.fnOliguria) positives.push('ปัสสาวะออกน้อยผิดปกติ');
    else negatives.push('ปริมาณปัสสาวะปกติ');
  }

  // 4. Neuro
  const anyNeuro = Boolean(patient.headache || patient.stiffNeck || patient.alteredMental || patient.seizure);
  if (anyNeuro || patient.fnNeuroNone) {
    if (patient.headache) positives.push('ปวดศีรษะรุนแรง');
    if (patient.stiffNeck) positives.push('คอแข็งก้มคอไม่ลง');
    else negatives.push('ไม่มีคอแข็ง');
    if (patient.alteredMental) positives.push('ซึมลงหรือสับสน');
    else negatives.push('รู้สึกตัวดี ถามตอบรู้เรื่อง');
    if (patient.seizure) positives.push('มีอาการชักเกร็ง');
  }

  // 5. Skin & MSK
  const anySkin = Boolean(patient.rash || patient.wound || patient.abscess || patient.arthralgia);
  if (anySkin || patient.fnSkinNone) {
    if (patient.rash) positives.push(`มีผื่นผิวหนัง${patient.rashLoc ? ` (${patient.rashLoc})` : ''}`);
    if (patient.wound) positives.push(`มีแผล${patient.woundLoc ? ` (${patient.woundLoc})` : ''}`);
    if (patient.abscess) positives.push(`มีตุ่มฝี/แผลมีหนอง${patient.abscessLoc ? ` (${patient.abscessLoc})` : ''}`);
    if (patient.arthralgia) positives.push(`ปวดตามข้อ${patient.arthralgiaLoc ? ` (${patient.arthralgiaLoc})` : ''}`);
    else negatives.push('ไม่มีอาการปวดตามข้อ');
  }

  // 6. Tropical & Host Risks
  const anyTropical = Boolean(
    patient.myalgia || patient.petechiae || patient.floodWater || patient.forestTravel ||
    patient.fnCloseContactFever || patient.fnRecentHosp3m || patient.fnChemoImmuno || patient.fnIndwellingPostOp
  );
  if (anyTropical || patient.fnTropicalNone) {
    if (patient.myalgia) positives.push('ปวดเมื่อยตัว/เบ้าตา');
    if (patient.petechiae) positives.push('มีจุดจ้ำเลือด/ผื่นเลือดออกตามตัว');
    else negatives.push('ไม่มีจุดจ้ำเลือดตามตัว');
    if (patient.floodWater) positives.push('มีประวัติลุยน้ำท่วม/น้ำขังใน 3 สัปดาห์');
    if (patient.forestTravel) positives.push('มีประวัติเข้าป่า/ยุงกัดใน 1 เดือน');
    if (patient.fnCloseContactFever) positives.push('คนใกล้ชิดมีไข้/ไข้หวัดใหญ่/โควิด/ไข้เลือดออก');
    if (patient.fnRecentHosp3m) positives.push('เคยนอนโรงพยาบาลในช่วง 3 เดือนที่ผ่านมา');
    if (patient.fnChemoImmuno) positives.push('ได้รับยาเคมีบำบัดหรือยากดภูมิคุ้มกัน');
    if (patient.fnIndwellingPostOp) positives.push('คาสายสวนหรือเพิ่งผ่าตัด');
  }

  // Female-only Context Branch (C-AP13)
  let femaleSummaryStr = '';
  if (patient.gender === 'หญิง') {
    const femParts = [];
    const pregLabel = FN_LABELS.pregnancy[patient.fnPregnancyStatus];
    if (pregLabel && patient.fnPregnancyStatus !== 'not_applicable') {
      femParts.push(
        patient.fnPregnancyStatus === 'pregnant' && patient.fnPregnancyWeeks
          ? `${pregLabel} (${patient.fnPregnancyWeeks})`
          : pregLabel
      );
    }
    if (patient.fn_fem_pv_bleeding) {
      positives.push('ประจำเดือนมามากผิดปกติหรือมีเลือดออกทางช่องคลอด');
      femParts.push('เลือดออกผิดปกติทางช่องคลอด');
    }
    if (patient.fn_fem_pelvic_discharge) {
      positives.push('ตกขาวผิดปกติ มีกลิ่นเหม็น หรือปวดหน่วงท้องน้อย');
      femParts.push('ตกขาวผิดปกติ/ปวดท้องน้อย');
    }
    if (patient.fnLmpDate) femParts.push(`LMP: ${patient.fnLmpDate}`);
    femaleSummaryStr = femParts.join(', ');
  }

  if (patient.otherSymptomsFree) {
    positives.push(patient.otherSymptomsFree);
  }

  patient.pertinentPositives = positives.length > 0 ? positives : ['ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม'];
  patient.pertinentNegatives = negatives.length > 0 ? negatives : ['ผู้ป่วยไม่ได้ระบุคำตอบยืนยันในหมวดอาการร่วม'];

  const hostRiskList = [];
  if (patient.fnRecentHosp3m) hostRiskList.push('เคยนอน รพ. ช่วง 3 เดือน');
  if (patient.fnChemoImmuno) hostRiskList.push('ได้ยาเคมีบำบัด/ยากดภูมิ');
  if (patient.fnIndwellingPostOp) hostRiskList.push('คาสายสวน/เพิ่งผ่าตัด');

  const hospLabel = FN_LABELS.hospStatus[patient.hospRecordStatus] || 'ไม่ได้ระบุ';
  const docNotes = patient.doctor_notes || {};
  const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ') ? 'ไม่ได้ระบุ' : patient.currentMeds;
  const udExplicitDeny = Array.isArray(patient.underlying) && patient.underlying.some(u => u && (u.includes('ปฏิเสธ') || u === 'ไม่มี' || u === 'ไม่มีโรคประจำตัว'));
  let udDisplay = (patient.hospRecordStatus === 'self' || patient.hospRecordStatus === 'additional' || udExplicitDeny) ? 'ปฏิเสธ' : 'ไม่ได้ระบุ';
  if (Array.isArray(patient.underlying) && patient.underlying.length > 0) {
    const filteredUd = patient.underlying.filter(u => u && !u.includes('ปฏิเสธ') && u !== 'ไม่มี' && u !== 'ไม่มีโรคประจำตัว');
    if (filteredUd.length > 0) udDisplay = filteredUd.join(', ');
  }
  const allergyDisplay = (!patient.drugAllergy || patient.drugAllergy === 'ไม่ได้ระบุ')
    ? 'ไม่ได้ระบุ'
    : ((patient.drugAllergy.includes('ปฏิเสธ') || patient.drugAllergy === 'ไม่มี') ? 'ปฏิเสธ' : patient.drugAllergy);
  const hostRiskText = hostRiskList.length > 0
    ? hostRiskList.join(', ')
    : ((anyTropical || patient.fnTropicalNone) ? 'ปฏิเสธ' : 'ไม่ได้ระบุ');
  const femaleLine = (patient.gender === 'หญิง' && femaleSummaryStr) ? `\n• ประวัติสตรี: ${femaleSummaryStr}` : '';

  const defaultRapid =
`[Chief Complaint (CC)]
มีไข้ / หนาวสั่น (Fever / Chills) มา ${durationText}

[History of Present Illness (HPI)]
• ลักษณะไข้: ${patternStr}
• การทานยาลดไข้ก่อนมา รพ.: ${antipyreticStr}
• การวัดไข้ด้วยตัวเอง: ${tempStr}${femaleLine}

• Pertinent Positives:
${patient.pertinentPositives.map(p => `  - ${p}`).join('\n')}

• Pertinent Negatives:
${patient.pertinentNegatives.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• ปัจจัยเสี่ยงภูมิคุ้มกัน/นอน รพ. 3 เดือน: ${hostRiskText}
• โรคประจำตัว (U/D): ${udDisplay}
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
`ผู้ป่วย [${patient.name || 'ไม่ระบุชื่อ'}] อายุ ${patient.age || '-'} ปี เพศ ${patient.gender || 'ไม่ระบุ'} มารับการตรวจที่ห้องฉุกเฉิน รพ.ราชบุรี ด้วยอาการไข้/หนาวสั่น มา ${durationText}
ข้อมูลไข้: [${patternStr}] ยาลดไข้ [${antipyreticStr}] วัดไข้เอง [${tempStr}]${(patient.gender === 'หญิง' && femaleSummaryStr) ? ` ประวัติสตรี [${femaleSummaryStr}]` : ''}
อาการร่วมที่พบ: ${patient.pertinentPositives.join(', ')}
อาการสำคัญที่ปฏิเสธ: ${patient.pertinentNegatives.join(', ')}
ประวัติสุขภาพและปัจจัยเสี่ยง: [${hospLabel}], ความเสี่ยงจำเพาะ: ${hostRiskText}, โรคประจำตัว: ${udDisplay}, ยาประจำตัว: ${medsText}, แพ้ยา: ${allergyDisplay}${rfs.length > 0 ? `\n[🚩 แจ้งเตือนสัญญาณวิกฤต (Red Flags)]: ${rfs.map(rf => rf.textTh).join('; ')}` : ''}

[บันทึกการตรวจและการประเมินโดยแพทย์]:
${docNotes.additional_hpi ? `• ประวัติเพิ่มเติม: ${docNotes.additional_hpi}\n` : ''}${docNotes.physical_exam ? `• การตรวจร่างกาย: ${docNotes.physical_exam}\n` : ''}${docNotes.preliminary_dx ? `• การวินิจฉัย: ${docNotes.preliminary_dx}\n` : ''}${docNotes.plan ? `• แผนการรักษา: ${docNotes.plan}` : ''}`;

  const jsonPayload = {
    '$schema': 'https://json-schema.org/draft/2020-12/schema',
    encounter: {
      hospital_site: 'Ratchaburi Hospital',
      queue_id: patient.queue_number || null,
      hn: patient.hn || null,
      patient_name: patient.name || null,
      age: patient.age !== undefined ? patient.age : null,
      gender: patient.gender || null,
      timestamp: patient.timestamp || null,
      status: patient.status || null,
      triage_urgency_flag: rfs.length > 0,
      calculated_triage_level: rfs.length > 0 ? Math.min(...rfs.map(r => r.triageLevel || 2)) : 4,
      red_flags_count: rfs.length
    },
    chief_complaint: 'fever_and_chills',
    fever_profile: {
      duration_value: patient.durationVal || null,
      duration_unit: patient.durationUnit || null,
      pattern: patient.feverPattern || null,
      antipyretic_taken: patient.fnAntipyreticTaken || null,
      antipyretic_response: patient.antipyreticResponse || null,
      antipyretic_types: antiTypes,
      antipyretic_last_time: patient.fnAntipyreticTimeUnknown ? 'unknown' : (patient.fnAntipyreticLastTime || null),
      temp_measured: patient.fnTempMeasured || null,
      max_temp_c: patient.fnMaxTempVal || null
    },
    red_flags_detected: rfs.map(rf => ({ code: rf.key, label: rf.textTh, clinical_risk: rf.risk })),
    pertinent_positives: patient.pertinentPositives,
    pertinent_negatives: patient.pertinentNegatives
  };

  patient.rapidHpi = patient.custom_rapid_note || defaultRapid;
  patient.narrativeHpi = patient.custom_narrative_note || defaultNarrative;
  patient.medicalJson = jsonPayload;

  const rapidBox = document.getElementById('rapidTextView');
  if (rapidBox) rapidBox.value = patient.rapidHpi;
  const narrativeBox = document.getElementById('narrativeTextView');
  if (narrativeBox) narrativeBox.value = patient.narrativeHpi;
  const jsonBox = document.getElementById('jsonViewer');
  if (jsonBox) jsonBox.textContent = JSON.stringify(jsonPayload, null, 2);

  return { rapid: patient.rapidHpi, narrative: patient.narrativeHpi, json: jsonPayload };
}

// --- Compact UI Helpers (Compact 2-Card UI + Thai Word-Boundary Wrap Guard + C-AP1 Compliant) ---
function fnWrap(...chunks) {
  return chunks.map(c => `<span class="inline-block whitespace-nowrap">${c}</span>`).join(' ');
}

function renderFnOpt(opt) {
  const kind = opt.kind || 'checkbox';
  const idAttr = opt.id ? `id="${opt.id}"` : '';
  const nameAttr = opt.name ? `name="${opt.name}"` : '';
  const valAttr = opt.value !== undefined ? `value="${opt.value}"` : '';
  const chgAttr = opt.onchange ? `onchange="${opt.onchange}"` : '';
  const spanCls = opt.colSpan2 ? ' sm:col-span-2' : (opt.colSpan4 ? ' col-span-2 sm:col-span-4' : '');
  const padCls = opt.compact ? 'p-2.5' : 'p-3';
  const bgCls = opt.bgWhite ? 'bg-white ' : '';
  const txtCls = opt.compact ? 'text-xs font-medium' : 'text-xs sm:text-sm font-semibold';
  const iconSz = opt.compact ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const mlCls = opt.compact ? 'ml-2' : 'ml-3';

  if (opt.desc) {
    return `<label class="selectable-card ${bgCls}flex items-start ${padCls} rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition${spanCls}"><input type="${kind}" ${idAttr} ${nameAttr} ${valAttr} ${chgAttr} class="mt-0.5 text-medical-600 focus:ring-medical-500 ${iconSz} rounded flex-shrink-0"><div class="${mlCls} leading-snug"><span class="block ${txtCls} text-slate-800">${opt.title}</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">${opt.desc}</span></div></label>`;
  }

  return `<label class="selectable-card ${bgCls}flex items-center ${padCls} rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition${spanCls}"><input type="${kind}" ${idAttr} ${nameAttr} ${valAttr} ${chgAttr} class="text-medical-600 focus:ring-medical-500 ${iconSz} rounded flex-shrink-0"><span class="${mlCls} ${txtCls} text-slate-800 leading-snug">${opt.title}</span></label>`;
}

function renderFnGrid(colsCls, opts) {
  return `<div class="grid ${colsCls} gap-2">${opts.map(renderFnOpt).join('')}</div>`;
}

function renderFnSysHeader(icon, iconColorCls, title, noneId, noneHandler, noneLabel = fnWrap('ไม่มีอาการ', 'ในหมวดนี้')) {
  return `<div class="flex flex-wrap items-center justify-between gap-2 mb-2.5">
    <span class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center">
      <i data-lucide="${icon}" class="w-4 h-4 mr-1.5 ${iconColorCls}"></i> ${title}
    </span>
    <label class="selectable-card inline-flex items-center px-2.5 py-1 rounded-lg border border-slate-200 hover:border-medical-300 bg-slate-50 cursor-pointer transition">
      <input type="checkbox" id="${noneId}" onchange="${noneHandler}" class="h-3.5 w-3.5 rounded text-medical-600 focus:ring-medical-500 flex-shrink-0">
      <span class="ml-2 text-[11px] font-medium text-slate-700 leading-snug">${noneLabel}</span>
    </label>
  </div>`;
}

// --- 2-Card Gold Standard Form HTML Assembly ---
const FN_CARD1_HTML = `
<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
  <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
    <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="clock" class="w-5 h-5"></i></div>
    <div>
      <h2 class="text-base font-bold text-slate-900">1. ระยะเวลาและลักษณะของไข้ (Fever Profile)</h2>
      <p class="text-xs text-slate-500">ข้อมูลเริ่มต้นเกี่ยวกับอาการไข้ของท่าน</p>
    </div>
  </div>
  <div class="space-y-5">
    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">มีไข้มานานเท่าไรแล้ว? <span class="text-rose-500">*</span></label>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div class="col-span-1 sm:col-span-2">
          <input type="number" id="fnDurationVal" min="1" max="1000" placeholder="เช่น 3" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm placeholder:text-slate-400 placeholder:font-normal">
        </div>
        <div class="col-span-1">
          <select id="fnDurationUnit" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm">
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

    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">ลักษณะอาการไข้ที่เป็นส่วนใหญ่</label>
      ${renderFnGrid('grid-cols-1 sm:grid-cols-2', [
        { kind: 'radio', name: 'fnPattern', value: 'chills_and_rigor', title: fnWrap('ไข้สูง', 'หนาวสั่นสะท้าน') },
        { kind: 'radio', name: 'fnPattern', value: 'continuous_high', title: fnWrap('ไข้สูงลอย', 'ตลอดเวลา') },
        { kind: 'radio', name: 'fnPattern', value: 'intermittent', title: fnWrap('ไข้เป็นๆ หายๆ') },
        { kind: 'radio', name: 'fnPattern', value: 'low_grade', title: fnWrap('ไข้ต่ำๆ', 'ตัวรุมๆ') }
      ])}
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 items-start">
      <div>
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">ได้ทานยาลดไข้ก่อนมา รพ. แล้วหรือไม่?</label>
        ${renderFnGrid('grid-cols-2', [
          { kind: 'radio', name: 'fnAntipyreticTaken', value: 'taken', onchange: "handleFnAntipyreticTakenChange('taken')", title: fnWrap('ทานยาลดไข้', 'แล้ว') },
          { kind: 'radio', name: 'fnAntipyreticTaken', value: 'not_taken', onchange: "handleFnAntipyreticTakenChange('not_taken')", title: fnWrap('ยังไม่ได้', 'ทานยา') }
        ])}
        <div id="fnAntipyreticBranch" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2.5 space-y-3">
          <div>
            <span class="block text-xs font-bold text-slate-800 mb-1.5">ผลหลังรับประทานยาลดไข้:</span>
            ${renderFnGrid('grid-cols-2', [
              { kind: 'radio', name: 'fnAntipyreticResponse', value: 'temporary_relief', title: fnWrap('ไข้ลดลง', 'ชั่วคราว'), compact: true, bgWhite: true },
              { kind: 'radio', name: 'fnAntipyreticResponse', value: 'refractory', title: fnWrap('ไข้', 'ไม่ลดลงเลย'), compact: true, bgWhite: true }
            ])}
          </div>
          <div>
            <span class="block text-xs font-bold text-slate-800 mb-1.5">ชนิดยาที่ทาน (เลือกได้หลายข้อ):</span>
            <div class="space-y-1.5">
              ${renderFnOpt({ name: 'fnAntipyreticTypes', value: 'paracetamol', title: fnWrap('พาราเซตามอล'), compact: true, bgWhite: true })}
              ${renderFnOpt({ name: 'fnAntipyreticTypes', value: 'nsaid_aspirin', title: fnWrap('ยาแก้ปวด', 'ลดไข้สูง', 'หรือยาชุด'), desc: 'เช่น Ibuprofen, Ponstan, แอสไพริน', compact: true, bgWhite: true })}
              ${renderFnOpt({ name: 'fnAntipyreticTypes', value: 'unknown_med', title: fnWrap('ไม่ทราบชื่อยา'), compact: true, bgWhite: true })}
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-800 mb-1.5">เวลาที่ทานยาล่าสุด (24 ชม.):</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
              <input type="text" id="fnAntipyreticLastTime" data-universal-time="true" oninput="handleFnAntipyreticTimeInput()" placeholder="ชช:นน (เช่น 06:30)" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
              ${renderFnOpt({ id: 'fnAntipyreticTimeUnknown', value: 'unknown', onchange: 'handleFnAntipyreticTimeUnknownToggle(this)', title: fnWrap('จำเวลาไม่ได้'), compact: true, bgWhite: true })}
            </div>
          </div>
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">ได้วัดไข้ด้วยตัวเองก่อนมา รพ. หรือไม่?</label>
        ${renderFnGrid('grid-cols-2', [
          { kind: 'radio', name: 'fnTempMeasured', value: 'measured', onchange: "handleFnTempMeasuredChange('measured')", title: fnWrap('ได้วัดไข้') },
          { kind: 'radio', name: 'fnTempMeasured', value: 'not_measured', onchange: "handleFnTempMeasuredChange('not_measured')", title: fnWrap('ไม่ได้วัดไข้') }
        ])}
        <div id="fnMaxTempWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2.5 space-y-2">
          <span class="block text-xs font-bold text-slate-800">อุณหภูมิสูงสุดที่วัดได้ (°C):</span>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
            <input type="number" step="0.1" min="34" max="43" id="fnMaxTempVal" oninput="handleFnMaxTempInput()" placeholder="เช่น 39.2" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
            ${renderFnOpt({ id: 'fnMaxTempUnknown', value: 'unknown', onchange: 'handleFnMaxTempUnknownToggle(this)', title: fnWrap('จำตัวเลขไม่ได้'), compact: true, bgWhite: true })}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;

const FN_CARD2_HTML = `
<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
  <div class="flex items-center space-x-3 mb-2 pb-3 border-b border-slate-100">
    <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="check-square" class="w-5 h-5"></i></div>
    <div>
      <h2 class="text-base font-bold text-slate-900">2. อาการร่วมที่ท่านมี (เลือกอาการที่ตรงกับท่าน)</h2>
      <p class="text-xs text-slate-500">ระบบจะเปิดคำถามเจาะลึกเพิ่มเติมเฉพาะข้อที่ท่านเลือก</p>
    </div>
  </div>

  <!-- SYSTEM 1: ระบบทางเดินหายใจ & ลำคอ -->
  <div class="py-4 border-b border-slate-100">
    ${renderFnSysHeader('wind', 'text-sky-500', 'ระบบทางเดินหายใจ &amp; ลำคอ', 'fn_sx_resp_none', "handleFnGroupNoneChange('fn_sx_resp_none',['fn_sx_cough','fn_sx_sorethroat','fn_sx_rhinorrhea','fn_sx_dyspnea'],[{wrap:'fnCoughBranch',clearNames:['fnCoughDetail'],clearChecks:['fn_cough_other_chk'],clearInputs:['fn_cough_other_text']},{wrap:'fn_cough_other_wrap'},{wrap:'fnSorethroatBranch',clearNames:['fnSorethroatLoc'],clearChecks:['fn_st_other_chk'],clearInputs:['fn_st_other_text']},{wrap:'fn_st_other_wrap'},{wrap:'fnDyspneaBranch',clearNames:['fnDyspneaPattern'],clearChecks:['fn_dyspnea_other_chk'],clearInputs:['fn_dyspnea_other_text']},{wrap:'fn_dyspnea_other_wrap'}])")}
    ${renderFnGrid('grid-cols-2 sm:grid-cols-4', [
      { id: 'fn_sx_cough', onchange: "handleFnRespItemChange('fn_sx_cough','fnCoughBranch')", title: fnWrap('มีอาการไอ') },
      { id: 'fn_sx_sorethroat', onchange: "handleFnRespItemChange('fn_sx_sorethroat','fnSorethroatBranch')", title: fnWrap('เจ็บคอ') },
      { id: 'fn_sx_rhinorrhea', onchange: "handleFnRespItemChange('fn_sx_rhinorrhea')", title: fnWrap('มีน้ำมูก /', 'คัดจมูก') },
      { id: 'fn_sx_dyspnea', onchange: "handleFnRespItemChange('fn_sx_dyspnea','fnDyspneaBranch')", title: fnWrap('หายใจ', 'เหนื่อยหอบ') }
    ])}

    <div id="fnCoughBranch" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2.5">
      <span class="text-xs font-bold text-slate-800 block mb-2 flex items-center"><i data-lucide="corner-down-right" class="w-3.5 h-3.5 mr-1 text-medical-600"></i> เจาะลึกอาการไอ (เลือกได้หลายข้อ)</span>
      ${renderFnGrid('grid-cols-2 sm:grid-cols-3', [
        { name: 'fnCoughDetail', value: 'dry', title: fnWrap('ไอแห้งๆ', 'ไม่มีเสมหะ'), compact: true, bgWhite: true },
        { name: 'fnCoughDetail', value: 'throat_phlegm', title: fnWrap('เสมหะในคอ'), compact: true, bgWhite: true },
        { name: 'fnCoughDetail', value: 'clear', title: fnWrap('เสมหะ', 'สีขาวใส'), compact: true, bgWhite: true },
        { name: 'fnCoughDetail', value: 'purulent', title: fnWrap('เสมหะ', 'สีเขียวหรือเหลือง'), compact: true, bgWhite: true },
        { name: 'fnCoughDetail', value: 'blood', title: fnWrap('เสมหะ', 'ปนเลือด'), compact: true, bgWhite: true },
        { id: 'fn_cough_other_chk', onchange: "handleFnOtherTextChk('fn_cough_other_chk','fn_cough_other_wrap','fn_cough_other_text')", title: fnWrap('อื่นๆ (ระบุ)'), compact: true, bgWhite: true }
      ])}
      <div id="fn_cough_other_wrap" class="hidden mt-2">
        <input type="text" id="fn_cough_other_text" placeholder="ระบุรายละเอียดอาการไอเพิ่มเติม..." class="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400">
      </div>
    </div>

    <div id="fnSorethroatBranch" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2.5">
      <span class="text-xs font-bold text-slate-800 block mb-2 flex items-center"><i data-lucide="corner-down-right" class="w-3.5 h-3.5 mr-1 text-medical-600"></i> เจาะลึกอาการเจ็บคอ (เลือกได้หลายข้อ)</span>
      ${renderFnGrid('grid-cols-2 sm:grid-cols-3', [
        { name: 'fnSorethroatLoc', value: 'left', title: fnWrap('ด้านซ้าย'), compact: true, bgWhite: true },
        { name: 'fnSorethroatLoc', value: 'right', title: fnWrap('ด้านขวา'), compact: true, bgWhite: true },
        { name: 'fnSorethroatLoc', value: 'diffuse', title: fnWrap('ทั่วๆ ลำคอ'), compact: true, bgWhite: true },
        { name: 'fnSorethroatLoc', value: 'odinophagia_trismus', title: fnWrap('กลืนน้ำลายลำบาก /', 'อ้าปากได้น้อย'), compact: true, bgWhite: true, colSpan2: true },
        { id: 'fn_st_other_chk', onchange: "handleFnOtherTextChk('fn_st_other_chk','fn_st_other_wrap','fn_st_other_text')", title: fnWrap('อื่นๆ (ระบุ)'), compact: true, bgWhite: true }
      ])}
      <div id="fn_st_other_wrap" class="hidden mt-2">
        <input type="text" id="fn_st_other_text" placeholder="ระบุตำแหน่งหรือลักษณะเจ็บคอเพิ่มเติม..." class="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400">
      </div>
    </div>

    <div id="fnDyspneaBranch" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2.5">
      <span class="text-xs font-bold text-slate-800 block mb-2 flex items-center"><i data-lucide="corner-down-right" class="w-3.5 h-3.5 mr-1 text-medical-600"></i> เจาะลึกลักษณะอาการหายใจเหนื่อย (เลือกได้หลายข้อ)</span>
      ${renderFnGrid('grid-cols-1 sm:grid-cols-2', [
        { name: 'fnDyspneaPattern', value: 'continuous', title: fnWrap('เหนื่อยตลอดเวลา', 'แม้อยู่เฉยๆ'), compact: true, bgWhite: true },
        { name: 'fnDyspneaPattern', value: 'on_exertion', title: fnWrap('เหนื่อยเมื่อออกแรง', 'หรือเดิน'), compact: true, bgWhite: true },
        { name: 'fnDyspneaPattern', value: 'orthopnea', title: fnWrap('เหนื่อยมากขึ้น', 'เมื่อนอนราบ', '(ต้องหนุนหมอนสูง)'), compact: true, bgWhite: true },
        { name: 'fnDyspneaPattern', value: 'with_cough', title: fnWrap('เหนื่อยเวลาไอ', 'หรือพูดต่อเนื่อง'), compact: true, bgWhite: true },
        { id: 'fn_dyspnea_other_chk', onchange: "handleFnOtherTextChk('fn_dyspnea_other_chk','fn_dyspnea_other_wrap','fn_dyspnea_other_text')", title: fnWrap('อื่นๆ (ระบุ)'), compact: true, bgWhite: true, colSpan2: true }
      ])}
      <div id="fn_dyspnea_other_wrap" class="hidden mt-2">
        <input type="text" id="fn_dyspnea_other_text" placeholder="ระบุลักษณะอาการเหนื่อยเพิ่มเติม..." class="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400">
      </div>
    </div>
  </div>

  <!-- SYSTEM 2: ระบบทางเดินอาหาร & ช่องท้อง -->
  <div class="py-4 border-b border-slate-100">
    ${renderFnSysHeader('utensils', 'text-amber-500', 'ระบบทางเดินอาหาร &amp; ช่องท้อง', 'fn_sx_gi_none', "handleFnGroupNoneChange('fn_sx_gi_none',['fn_sx_abdpain','fn_sx_diarrhea','fn_sx_vomit','fn_sx_jaundice'],[{wrap:'fnAbdpainBranch',clearNames:['fnAbdpainLoc','fnAbdpainChar','fnAbdpainRad'],clearChecks:['fn_abdpain_loc_other_chk','fn_abdpain_char_other_chk','fn_abdpain_rad_other_chk'],clearInputs:['fn_abdpain_loc_other_text','fn_abdpain_char_other_text','fn_abdpain_rad_other_text']},{wrap:'fn_abdpain_loc_other_wrap'},{wrap:'fn_abdpain_char_other_wrap'},{wrap:'fn_abdpain_rad_other_wrap'},{wrap:'fnDiarrheaBranch',clearNames:['fnDiarrheaStool'],clearChecks:['fn_diarrhea_other_chk'],clearInputs:['fnDiarrheaFreq','fn_diarrhea_other_text']},{wrap:'fn_diarrhea_other_wrap'},{wrap:'fnVomitBranch',clearNames:['fnVomitContent'],clearChecks:['fn_vomit_nausea_only','fn_vomit_other_chk'],clearInputs:['vomitFreq','fn_vomit_other_text']},{wrap:'fn_vomit_other_wrap'}])")}
    ${renderFnGrid('grid-cols-2 sm:grid-cols-4', [
      { id: 'fn_sx_abdpain', onchange: "handleFnGiItemChange('fn_sx_abdpain','fnAbdpainBranch')", title: fnWrap('ปวดท้อง') },
      { id: 'fn_sx_diarrhea', onchange: "handleFnGiItemChange('fn_sx_diarrhea','fnDiarrheaBranch')", title: fnWrap('ถ่ายเหลว /', 'ท้องเสีย') },
      { id: 'fn_sx_vomit', onchange: "handleFnGiItemChange('fn_sx_vomit','fnVomitBranch')", title: fnWrap('คลื่นไส้ /', 'อาเจียน') },
      { id: 'fn_sx_jaundice', onchange: "handleFnGiItemChange('fn_sx_jaundice')", title: fnWrap('ตาเหลือง /', 'ตัวเหลือง') }
    ])}

    <div id="fnAbdpainBranch" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2.5 space-y-4">
      <div>
        <span class="text-xs font-bold text-slate-800 block mb-1.5 flex items-center"><i data-lucide="corner-down-right" class="w-3.5 h-3.5 mr-1 text-medical-600"></i> ตำแหน่งที่ปวดท้อง (เลือกได้หลายจุด)</span>
        ${renderFnGrid('grid-cols-2 sm:grid-cols-4', [
          { name: 'fnAbdpainLoc', value: 'diffuse', onchange: 'updateFnFemaleContext()', title: fnWrap('ทั่วทั้งท้อง'), compact: true, bgWhite: true },
          { name: 'fnAbdpainLoc', value: 'epigastrium', onchange: 'updateFnFemaleContext()', title: fnWrap('ใต้ลิ้นปี่'), compact: true, bgWhite: true },
          { name: 'fnAbdpainLoc', value: 'ruq', onchange: 'updateFnFemaleContext()', title: fnWrap('ชายโครงขวา'), compact: true, bgWhite: true },
          { name: 'fnAbdpainLoc', value: 'luq', onchange: 'updateFnFemaleContext()', title: fnWrap('ชายโครงซ้าย'), compact: true, bgWhite: true },
          { name: 'fnAbdpainLoc', value: 'periumbilical', onchange: 'updateFnFemaleContext()', title: fnWrap('รอบสะดือ'), compact: true, bgWhite: true },
          { name: 'fnAbdpainLoc', value: 'rlq', onchange: 'updateFnFemaleContext()', title: fnWrap('ท้องน้อยขวา'), compact: true, bgWhite: true },
          { name: 'fnAbdpainLoc', value: 'llq', onchange: 'updateFnFemaleContext()', title: fnWrap('ท้องน้อยซ้าย'), compact: true, bgWhite: true },
          { name: 'fnAbdpainLoc', value: 'suprapubic', onchange: 'updateFnFemaleContext()', title: fnWrap('ท้องน้อยตรงกลาง /', 'หัวหน่าว'), compact: true, bgWhite: true },
          { id: 'fn_abdpain_loc_other_chk', onchange: "handleFnOtherTextChk('fn_abdpain_loc_other_chk','fn_abdpain_loc_other_wrap','fn_abdpain_loc_other_text')", title: fnWrap('ตำแหน่งอื่นๆ', '(ระบุ)'), compact: true, bgWhite: true, colSpan4: true }
        ])}
        <div id="fn_abdpain_loc_other_wrap" class="hidden mt-2">
          <input type="text" id="fn_abdpain_loc_other_text" placeholder="ระบุตำแหน่งปวดท้องเพิ่มเติม..." class="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400">
        </div>
      </div>

      <div>
        <span class="text-xs font-bold text-slate-800 block mb-1.5">ลักษณะการปวดท้อง (เลือกได้หลายข้อ)</span>
        ${renderFnGrid('grid-cols-2 sm:grid-cols-4', [
          { name: 'fnAbdpainChar', value: 'burning', title: fnWrap('แสบร้อน'), compact: true, bgWhite: true },
          { name: 'fnAbdpainChar', value: 'sharp_tearing', title: fnWrap('เสียดแทง'), compact: true, bgWhite: true },
          { name: 'fnAbdpainChar', value: 'crampy', title: fnWrap('บิดเกร็ง'), compact: true, bgWhite: true },
          { name: 'fnAbdpainChar', value: 'dull', title: fnWrap('ตื้อ'), compact: true, bgWhite: true },
          { id: 'fn_abdpain_char_other_chk', onchange: "handleFnOtherTextChk('fn_abdpain_char_other_chk','fn_abdpain_char_other_wrap','fn_abdpain_char_other_text')", title: fnWrap('ลักษณะอื่นๆ', '(ระบุ)'), compact: true, bgWhite: true, colSpan4: true }
        ])}
        <div id="fn_abdpain_char_other_wrap" class="hidden mt-2">
          <input type="text" id="fn_abdpain_char_other_text" placeholder="ระบุลักษณะการปวดเพิ่มเติม..." class="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400">
        </div>
      </div>

      <div>
        <span class="text-xs font-bold text-slate-800 block mb-1.5">มีอาการปวดร้าวไปตำแหน่งอื่นหรือไม่? (เลือกได้หลายข้อ)</span>
        ${renderFnGrid('grid-cols-1 sm:grid-cols-2', [
          { name: 'fnAbdpainRad', value: 'back_left', title: fnWrap('ร้าวหลังซ้าย'), compact: true, bgWhite: true },
          { name: 'fnAbdpainRad', value: 'back_right', title: fnWrap('ร้าวหลังขวา'), compact: true, bgWhite: true },
          { name: 'fnAbdpainRad', value: 'back_mid', title: fnWrap('ร้าวทะลุหลัง', '(ตรงกลาง)'), compact: true, bgWhite: true },
          { name: 'fnAbdpainRad', value: 'chest', title: fnWrap('ร้าวขึ้นหน้าอก'), compact: true, bgWhite: true },
          { name: 'fnAbdpainRad', value: 'groin_thigh_genitalia', title: fnWrap('ร้าวลงต้นขา /', 'ขาหนีบ /', 'อวัยวะเพศ'), compact: true, bgWhite: true, colSpan2: true },
          { id: 'fn_abdpain_rad_other_chk', onchange: "handleFnOtherTextChk('fn_abdpain_rad_other_chk','fn_abdpain_rad_other_wrap','fn_abdpain_rad_other_text')", title: fnWrap('ร้าวไปตำแหน่งอื่น', '(ระบุ)'), compact: true, bgWhite: true, colSpan2: true }
        ])}
        <div id="fn_abdpain_rad_other_wrap" class="hidden mt-2">
          <input type="text" id="fn_abdpain_rad_other_text" placeholder="ระบุตำแหน่งที่ร้าวไปเพิ่มเติม..." class="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400">
        </div>
      </div>
    </div>

    <div id="fnDiarrheaBranch" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2.5 space-y-3">
      <span class="text-xs font-bold text-slate-800 block flex items-center"><i data-lucide="corner-down-right" class="w-3.5 h-3.5 mr-1 text-medical-600"></i> เจาะลึกอาการถ่ายเหลว</span>
      <div>
        <label class="text-[11px] font-semibold text-slate-700 block mb-1">ถ่ายเหลวประมาณกี่ครั้งต่อวัน?</label>
        <div class="flex items-center space-x-2">
          <input type="number" id="fnDiarrheaFreq" min="1" max="50" placeholder="เช่น 3" class="w-24 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-semibold placeholder:text-slate-400 placeholder:font-normal">
          <span class="text-xs text-slate-500">ครั้ง/วัน</span>
        </div>
      </div>
      <div>
        <label class="text-[11px] font-semibold text-slate-700 block mb-1.5">ลักษณะอุจจาระ (เลือกได้หลายข้อ)</label>
        ${renderFnGrid('grid-cols-2 sm:grid-cols-3', [
          { name: 'fnDiarrheaStool', value: 'watery', title: fnWrap('เหลวเป็นน้ำ'), compact: true, bgWhite: true },
          { name: 'fnDiarrheaStool', value: 'loose_mushy', title: fnWrap('เละๆ'), compact: true, bgWhite: true },
          { name: 'fnDiarrheaStool', value: 'melena_tarry', title: fnWrap('ดำหนืดเหมือน', 'ยางมะตอย'), compact: true, bgWhite: true },
          { name: 'fnDiarrheaStool', value: 'bloody_mucus', title: fnWrap('มีมูกเลือดปน'), compact: true, bgWhite: true },
          { id: 'fn_diarrhea_other_chk', onchange: "handleFnOtherTextChk('fn_diarrhea_other_chk','fn_diarrhea_other_wrap','fn_diarrhea_other_text')", title: fnWrap('อื่นๆ (ระบุ)'), compact: true, bgWhite: true, colSpan2: true }
        ])}
        <div id="fn_diarrhea_other_wrap" class="hidden mt-2">
          <input type="text" id="fn_diarrhea_other_text" placeholder="ระบุลักษณะอุจจาระเพิ่มเติม..." class="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400">
        </div>
      </div>
    </div>

    <div id="fnVomitBranch" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2.5 space-y-3">
      <span class="text-xs font-bold text-slate-800 block flex items-center"><i data-lucide="corner-down-right" class="w-3.5 h-3.5 mr-1 text-medical-600"></i> เจาะลึกอาการคลื่นไส้ / อาเจียน</span>
      <div>
        <label class="text-[11px] font-semibold text-slate-700 block mb-1">ความถี่ของอาการอาเจียน</label>
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex items-center space-x-2">
            <input type="number" id="vomitFreq" min="1" max="50" placeholder="เช่น 2" class="w-24 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-semibold placeholder:text-slate-400 placeholder:font-normal">
            <span class="text-xs text-slate-500">ครั้ง/วัน</span>
          </div>
          ${renderFnOpt({ id: 'fn_vomit_nausea_only', onchange: 'handleFnNauseaOnlyToggle(this.checked)', title: fnWrap('คลื่นไส้', 'ยังไม่อาเจียน'), compact: true, bgWhite: true })}
        </div>
      </div>
      <div id="vomitCharSection">
        <label class="text-[11px] font-semibold text-slate-700 block mb-1.5">ลักษณะสิ่งที่อาเจียนออกมา (เลือกได้หลายข้อ)</label>
        ${renderFnGrid('grid-cols-1 sm:grid-cols-2', [
          { name: 'fnVomitContent', value: 'food_gastric', title: fnWrap('เป็นอาหาร หรือ', 'น้ำย่อยเหลือง'), compact: true, bgWhite: true },
          { name: 'fnVomitContent', value: 'bilious_green', title: fnWrap('เป็นสีเขียว', 'น้ำดี'), compact: true, bgWhite: true },
          { name: 'fnVomitContent', value: 'coffee_ground', title: fnWrap('สีดำคล้าย', 'น้ำโค้ก'), compact: true, bgWhite: true },
          { name: 'fnVomitContent', value: 'bloody', title: fnWrap('เป็นเลือด หรือ', 'ปนเลือด'), compact: true, bgWhite: true },
          { id: 'fn_vomit_other_chk', onchange: "handleFnOtherTextChk('fn_vomit_other_chk','fn_vomit_other_wrap','fn_vomit_other_text')", title: fnWrap('อื่นๆ (ระบุ)'), compact: true, bgWhite: true, colSpan2: true }
        ])}
        <div id="fn_vomit_other_wrap" class="hidden mt-2">
          <input type="text" id="fn_vomit_other_text" placeholder="ระบุลักษณะการอาเจียนเพิ่มเติม..." class="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400">
        </div>
      </div>
    </div>
  </div>

  <!-- SYSTEM 3: ระบบทางเดินปัสสาวะ -->
  <div class="py-4 border-b border-slate-100">
    ${renderFnSysHeader('droplet', 'text-indigo-500', 'ระบบทางเดินปัสสาวะ', 'fn_sx_gu_none', "handleFnGroupNoneChange('fn_sx_gu_none',['fn_sx_dysuria','fn_sx_turbidurine','fn_sx_flankpain','fn_sx_oliguria'])")}
    ${renderFnGrid('grid-cols-2 sm:grid-cols-4', [
      { id: 'fn_sx_dysuria', onchange: "if(this.checked) clearFnNoneCheckbox('fn_sx_gu_none')", title: fnWrap('ปัสสาวะ', 'แสบขัด') },
      { id: 'fn_sx_turbidurine', onchange: "if(this.checked) clearFnNoneCheckbox('fn_sx_gu_none')", title: fnWrap('ปัสสาวะขุ่น /', 'มีเลือดปน') },
      { id: 'fn_sx_flankpain', onchange: "if(this.checked) clearFnNoneCheckbox('fn_sx_gu_none')", title: fnWrap('ปวดบั้นเอว /', 'หลัง') },
      { id: 'fn_sx_oliguria', onchange: "if(this.checked) clearFnNoneCheckbox('fn_sx_gu_none')", title: fnWrap('ปัสสาวะ', 'ออกน้อย', 'ผิดปกติ') }
    ])}
  </div>

  <!-- SYSTEM 4: ระบบประสาท -->
  <div class="py-4 border-b border-slate-100">
    ${renderFnSysHeader('brain', 'text-rose-500', 'ระบบประสาท', 'fn_sx_neuro_none', "handleFnGroupNoneChange('fn_sx_neuro_none',['fn_sx_headache','fn_sx_stiffneck','fn_sx_alteredmental','fn_sx_seizure'])")}
    ${renderFnGrid('grid-cols-2 sm:grid-cols-4', [
      { id: 'fn_sx_headache', onchange: "if(this.checked) clearFnNoneCheckbox('fn_sx_neuro_none')", title: fnWrap('ปวดศีรษะ', 'รุนแรง') },
      { id: 'fn_sx_stiffneck', onchange: "if(this.checked) clearFnNoneCheckbox('fn_sx_neuro_none')", title: fnWrap('คอแข็ง', 'ก้มคอไม่ลง') },
      { id: 'fn_sx_alteredmental', onchange: "if(this.checked) clearFnNoneCheckbox('fn_sx_neuro_none')", title: fnWrap('ซึมลง /', 'สับสน') },
      { id: 'fn_sx_seizure', onchange: "if(this.checked) clearFnNoneCheckbox('fn_sx_neuro_none')", title: fnWrap('มีอาการ', 'ชักเกร็ง') }
    ])}
  </div>

  <!-- SYSTEM 5: ระบบผิวหนัง & กระดูกและกล้ามเนื้อ -->
  <div class="py-4 border-b border-slate-100">
    ${renderFnSysHeader('bone', 'text-orange-500', 'ระบบผิวหนัง &amp; กระดูกและกล้ามเนื้อ', 'fn_sx_skin_none', "handleFnGroupNoneChange('fn_sx_skin_none',['fn_sx_rash','fn_sx_wound','fn_sx_abscess','fn_sx_arthralgia'],[{wrap:'fn_rash_loc_wrap',clearInputs:['fn_rash_loc_text']},{wrap:'fn_wound_loc_wrap',clearInputs:['fn_wound_loc_text']},{wrap:'fn_abscess_loc_wrap',clearInputs:['fn_abscess_loc_text']},{wrap:'fn_arthralgia_loc_wrap',clearInputs:['fn_arthralgia_loc_text']}])")}
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div class="selectable-card p-3 rounded-xl border border-slate-200 hover:border-medical-300 transition">
        <label class="flex items-center cursor-pointer">
          <input type="checkbox" id="fn_sx_rash" onchange="handleFnSkinItemChange('fn_sx_rash','fn_rash_loc_wrap','fn_rash_loc_text')" class="rounded text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0">
          <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800 leading-snug">${fnWrap('มีผื่น', 'ตามผิวหนัง')}</span>
        </label>
        <div id="fn_rash_loc_wrap" class="hidden mt-2 pt-2 border-t border-slate-100">
          <input type="text" id="fn_rash_loc_text" placeholder="ระบุตำแหน่งของผื่น เช่น แขน, ขา, ลำตัว..." class="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400">
        </div>
      </div>

      <div class="selectable-card p-3 rounded-xl border border-slate-200 hover:border-medical-300 transition">
        <label class="flex items-center cursor-pointer">
          <input type="checkbox" id="fn_sx_wound" onchange="handleFnSkinItemChange('fn_sx_wound','fn_wound_loc_wrap','fn_wound_loc_text')" class="rounded text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0">
          <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800 leading-snug">${fnWrap('มีแผล')}</span>
        </label>
        <div id="fn_wound_loc_wrap" class="hidden mt-2 pt-2 border-t border-slate-100">
          <input type="text" id="fn_wound_loc_text" placeholder="ระบุตำแหน่งของแผล เช่น เท้าซ้าย, แผ่นหลัง..." class="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400">
        </div>
      </div>

      <div class="selectable-card p-3 rounded-xl border border-slate-200 hover:border-medical-300 transition">
        <label class="flex items-center cursor-pointer">
          <input type="checkbox" id="fn_sx_abscess" onchange="handleFnSkinItemChange('fn_sx_abscess','fn_abscess_loc_wrap','fn_abscess_loc_text')" class="rounded text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0">
          <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800 leading-snug">${fnWrap('มีตุ่มฝี /', 'แผลมีหนอง')}</span>
        </label>
        <div id="fn_abscess_loc_wrap" class="hidden mt-2 pt-2 border-t border-slate-100">
          <input type="text" id="fn_abscess_loc_text" placeholder="ระบุตำแหน่งฝี/หนอง เช่น ก้น, รักแร้, ขาหนีบ..." class="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400">
        </div>
      </div>

      <div class="selectable-card p-3 rounded-xl border border-slate-200 hover:border-medical-300 transition">
        <label class="flex items-center cursor-pointer">
          <input type="checkbox" id="fn_sx_arthralgia" onchange="handleFnSkinItemChange('fn_sx_arthralgia','fn_arthralgia_loc_wrap','fn_arthralgia_loc_text')" class="rounded text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0">
          <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800 leading-snug">${fnWrap('ปวดตามข้อ')}</span>
        </label>
        <div id="fn_arthralgia_loc_wrap" class="hidden mt-2 pt-2 border-t border-slate-100">
          <input type="text" id="fn_arthralgia_loc_text" placeholder="ระบุข้อที่ปวด เช่น ข้อเข่า 2 ข้าง, ข้อมือ..." class="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400">
        </div>
      </div>
    </div>
  </div>

  <!-- SYSTEM 6: โรคติดเชื้อเขตร้อน & ประวัติความเสี่ยง -->
  <div class="py-4 border-b border-slate-100">
    ${renderFnSysHeader('bug', 'text-emerald-600', 'โรคติดเชื้อเขตร้อน &amp; ประวัติความเสี่ยง', 'fn_sx_tropical_none', "handleFnGroupNoneChange('fn_sx_tropical_none',['fn_sx_myalgia','fn_sx_petechiae','fn_sx_floodwater','fn_sx_forestravel','fn_sx_close_contact_fever','fn_sx_recent_hosp_3m','fn_sx_chemo_immuno','fn_sx_indwelling_postop'])", fnWrap('ไม่มีอาการหรือ', 'ประวัติเสี่ยง', 'ในหมวดนี้'))}
    ${renderFnGrid('grid-cols-2 sm:grid-cols-4', [
      { id: 'fn_sx_myalgia', onchange: "handleFnTropicalItemChange('fn_sx_myalgia')", title: fnWrap('ปวดเมื่อยตัว /', 'เบ้าตา') },
      { id: 'fn_sx_petechiae', onchange: "handleFnTropicalItemChange('fn_sx_petechiae')", title: fnWrap('จุดจ้ำเลือด /', 'ผื่นเลือดออก') },
      { id: 'fn_sx_floodwater', onchange: "handleFnTropicalItemChange('fn_sx_floodwater')", title: fnWrap('ลุยน้ำท่วม / ขัง', '(ใน 3 สัปดาห์)') },
      { id: 'fn_sx_forestravel', onchange: "handleFnTropicalItemChange('fn_sx_forestravel')", title: fnWrap('เข้าป่า / ยุงกัด', '(ใน 1 เดือน)') },
      { id: 'fn_sx_close_contact_fever', onchange: "handleFnTropicalItemChange('fn_sx_close_contact_fever')", title: fnWrap('คนใกล้ชิดมีไข้ /', 'ไข้หวัดใหญ่ /', 'โควิด /', 'ไข้เลือดออก') },
      { id: 'fn_sx_recent_hosp_3m', onchange: "handleFnTropicalItemChange('fn_sx_recent_hosp_3m')", title: fnWrap('เคยนอน รพ.', 'ในช่วง 3 เดือน') },
      { id: 'fn_sx_chemo_immuno', onchange: "handleFnTropicalItemChange('fn_sx_chemo_immuno')", title: fnWrap('ได้ยาเคมีบำบัด /', 'ยากดภูมิ') },
      { id: 'fn_sx_indwelling_postop', onchange: "handleFnTropicalItemChange('fn_sx_indwelling_postop')", title: fnWrap('คาสายสวน /', 'เพิ่งผ่าตัด') }
    ])}

    <!-- Context-Triggered Female Sub-branch (แสดงเฉพาะหญิงที่มี ปวดท้องน้อย OR จุดจ้ำเลือด OR สัมผัสเสี่ยงไข้เลือดออก) -->
    <div id="fnFemaleContextBranch" class="hidden bg-pink-50/70 border border-pink-200 rounded-xl p-4 mt-3 space-y-3">
      <div class="text-xs font-bold text-pink-900">ข้อมูลเพิ่มเติมเฉพาะผู้ป่วยหญิง (เกี่ยวข้องกับอาการปวดท้องน้อยหรือความเสี่ยงไข้เลือดออก):</div>
      <div>
        <span class="block text-xs font-semibold text-slate-700 mb-1.5">สถานะการตั้งครรภ์และประจำเดือน</span>
        ${renderFnGrid('grid-cols-2 sm:grid-cols-3', [
          { kind: 'radio', name: 'fnPregnancyStatus', value: 'not_pregnant', onchange: "handleFnPregnancyChange('not_pregnant')", title: fnWrap('ไม่ได้ตั้งครรภ์ /', 'ประจำเดือนปกติ'), compact: true, bgWhite: true },
          { kind: 'radio', name: 'fnPregnancyStatus', value: 'missed_period', onchange: "handleFnPregnancyChange('missed_period')", title: fnWrap('ขาดประจำเดือน /', 'สงสัยตั้งครรภ์'), compact: true, bgWhite: true },
          { kind: 'radio', name: 'fnPregnancyStatus', value: 'pregnant', onchange: "handleFnPregnancyChange('pregnant')", title: fnWrap('กำลังตั้งครรภ์'), compact: true, bgWhite: true },
          { kind: 'radio', name: 'fnPregnancyStatus', value: 'postpartum_6w', onchange: "handleFnPregnancyChange('postpartum_6w')", title: fnWrap('เพิ่งคลอดหรือแท้ง', 'ใน 6 สัปดาห์'), compact: true, bgWhite: true },
          { kind: 'radio', name: 'fnPregnancyStatus', value: 'menopause_hysterectomy', onchange: "handleFnPregnancyChange('menopause_hysterectomy')", title: fnWrap('วัยหมดประจำเดือน /', 'ผ่าตัดมดลูก'), compact: true, bgWhite: true },
          { kind: 'radio', name: 'fnPregnancyStatus', value: 'unsure', onchange: "handleFnPregnancyChange('unsure')", title: fnWrap('ไม่แน่ใจ'), compact: true, bgWhite: true }
        ])}
        <div id="fnPregnancyWeeksWrap" class="hidden mt-2">
          <input type="text" id="fnPregnancyWeeks" placeholder="ระบุอายุครรภ์ เช่น 24 สัปดาห์" class="w-full sm:w-72 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
        </div>
      </div>
      <div>
        <span class="block text-xs font-semibold text-slate-700 mb-1.5">อาการทางนรีเวชและประจำเดือน (เลือกได้หลายข้อ)</span>
        ${renderFnGrid('grid-cols-1 sm:grid-cols-2', [
          { id: 'fn_fem_pv_bleeding', title: fnWrap('ประจำเดือนมามากผิดปกติ', 'หรือมีเลือดออก', 'ทางช่องคลอด'), compact: true, bgWhite: true },
          { id: 'fn_fem_pelvic_discharge', title: fnWrap('ตกขาวผิดปกติ', 'มีกลิ่นเหม็น', 'หรือปวดหน่วงท้องน้อย'), compact: true, bgWhite: true }
        ])}
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">วันแรกของประจำเดือนครั้งสุดท้าย (LMP)</label>
        <input type="text" id="fnLmpDate" data-universal-date="true" placeholder="วว/ดด/ปปปป (dd/mm/yyyy)" class="w-full sm:w-64 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
      </div>
    </div>
  </div>

  <!-- SYSTEM 7: อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม -->
  <div class="pt-4">
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center">
        <i data-lucide="message-square-plus" class="w-4 h-4 mr-1.5 text-slate-500"></i> อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม
      </span>
    </div>
    <textarea id="sx_other_free" rows="2" placeholder="พิมพ์ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"></textarea>
  </div>
</div>`;

const FN_FORM_HTML = `
<div id="feverQuestionnaireSection" class="space-y-6 hidden">
  <div data-cc-top-banner="fever"><div class="flex flex-col gap-4">
  <div class="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-2xl flex items-start space-x-3">
    <i data-lucide="alert-triangle" class="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"></i>
    <div class="text-xs text-amber-900 leading-relaxed">
      <strong class="font-bold">ข้อความแจ้งเตือนจุดคัดกรอง:</strong> กรณีผู้ป่วยเป็นเด็กอายุ &lt; 5 ปี ที่มีอาการไข้ กรุณาเลือกอาการสำคัญ <strong>&lt;ไข้ ในเด็กอายุ &lt; 5 ปี&gt;</strong> แทน เพื่อการประเมินภาวะไข้ในเด็กตามช่วงวัยอย่างเหมาะสม
    </div>
  </div>
  <div class="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-start space-x-3 text-xs text-slate-800 leading-relaxed">
    <i data-lucide="info" class="w-5 h-5 text-medical-600 mt-0.5 flex-shrink-0"></i>
    <div class="space-y-1">
      <p class="font-bold text-slate-900">ข้อแนะนำการปฏิบัติตัวเบื้องต้นระหว่างรอตรวจ:</p>
      <p>1. <strong>หากมีอาการปวดท้องรุนแรง อาเจียนซ้ำหลายครั้ง หรือหายใจเหนื่อยหอบ:</strong> ควรงดน้ำและอาหารชั่วคราว</p>
      <p>2. <strong>แจ้งพยาบาลหน้าห้องตรวจทันทีหากมีอาการต่อไปนี้:</strong> หายใจหอบเหนื่อย หน้ามืดคล้ายจะเป็นลม ซึมลง สับสน หรืออาเจียน/ถ่ายอุจจาระเป็นเลือด</p>
    </div>
  </div>
  </div></div>

  ${FN_CARD1_HTML}
  ${FN_CARD2_HTML}
</div>`;

// --- Module Registration ---
registerCcModule({
  id: 'fever',
  recordCc: 'fever_and_chills',
  titleTh: 'ไข้ / หนาวสั่น',
  titleEn: 'Fever / Chills',
  sectionDomId: 'feverQuestionnaireSection',
  pmhSectionNumber: 3,
  getPmhSectionNumber: () => 3,
  doctorCcBadgeHtml: '<i data-lucide="flame" class="w-3.5 h-3.5 mr-1 text-rose-500"></i> CC: ไข้ / หนาวสั่น',
  dateFields: ['fnLmpDate'],
  timeFields: ['fnAntipyreticLastTime'],
  branchIds: [
    'fnAntipyreticBranch', 'fnMaxTempWrap', 'fnCoughBranch', 'fn_cough_other_wrap',
    'fnSorethroatBranch', 'fn_st_other_wrap', 'fnDyspneaBranch', 'fn_dyspnea_other_wrap',
    'fnAbdpainBranch', 'fn_abdpain_loc_other_wrap', 'fn_abdpain_char_other_wrap', 'fn_abdpain_rad_other_wrap',
    'fnDiarrheaBranch', 'fn_diarrhea_other_wrap', 'fnVomitBranch', 'fn_vomit_other_wrap',
    'fn_rash_loc_wrap', 'fn_wound_loc_wrap', 'fn_abscess_loc_wrap', 'fn_arthralgia_loc_wrap',
    'fnFemaleContextBranch', 'fnPregnancyWeeksWrap'
  ],
  inputIdsToClear: [
    'fnDurationVal', 'fnAntipyreticLastTime', 'fnMaxTempVal',
    'fn_cough_other_text', 'fn_st_other_text', 'fn_dyspnea_other_text',
    'fn_abdpain_loc_other_text', 'fn_abdpain_char_other_text', 'fn_abdpain_rad_other_text',
    'fnDiarrheaFreq', 'fn_diarrhea_other_text', 'vomitFreq', 'fn_vomit_other_text',
    'fn_rash_loc_text', 'fn_wound_loc_text', 'fn_abscess_loc_text', 'fn_arthralgia_loc_text',
    'fnPregnancyWeeks', 'fnLmpDate', 'sx_other_free'
  ],
  formHtml: FN_FORM_HTML,

  algorithm: {
    id: 'fever',
    schemaCode: 'fever_and_chills',
    titleTh: 'ไข้ / หนาวสั่น',
    titleEn: 'Fever / Chills',
    triageLevelRules: [
      { level: 1, criteria: 'Acute CNS infection signs (stiff neck / altered mental / seizure), Severe sepsis / dyspnea / orthopnea / oliguria / hemoptysis' },
      { level: 2, criteria: 'Odinophagia/trismus, Jaundice (Acute Cholangitis), GI bleed or tearing abd pain, Petechiae or NSAIDs bleeding risk, Febrile neutropenia, HAI <3m / indwelling device, Maternal / pelvic sepsis' },
      { level: 4, criteria: 'Uncomplicated acute viral fever / mild URI or mild AGE without sepsis or red flags' }
    ]
  },

  onTitleChange(arg) {
    updateFnFemaleContext(isFnFemaleTitle(arg));
  },

  onSelectForm() {
    updateFnFemaleContext();
  },

  onActivate(patient) {
    if (patient && (patient.gender === 'หญิง' || patient.gender === 'ชาย')) {
      updateFnFemaleContext(patient.gender === 'หญิง');
    } else {
      updateFnFemaleContext();
    }
    handleFnAntipyreticTakenChange();
    handleFnTempMeasuredChange();
  },

  resetForm() {
    ['fnPattern', 'fnAntipyreticTaken', 'fnAntipyreticResponse', 'fnTempMeasured', 'fnPregnancyStatus'].forEach(n => setFnRadioVal(n, ''));
    ['fnAntipyreticTypes', 'fnCoughDetail', 'fnSorethroatLoc', 'fnDyspneaPattern', 'fnAbdpainLoc', 'fnAbdpainChar', 'fnAbdpainRad', 'fnDiarrheaStool', 'fnVomitContent'].forEach(n => setFnCheckboxGroup(n, []));
    [
      'fnAntipyreticTimeUnknown', 'fnMaxTempUnknown',
      'fn_sx_cough', 'fn_cough_other_chk', 'fn_sx_sorethroat', 'fn_st_other_chk', 'fn_sx_rhinorrhea', 'fn_sx_dyspnea', 'fn_dyspnea_other_chk', 'fn_sx_resp_none',
      'fn_sx_abdpain', 'fn_abdpain_loc_other_chk', 'fn_abdpain_char_other_chk', 'fn_abdpain_rad_other_chk',
      'fn_sx_diarrhea', 'fn_diarrhea_other_chk', 'fn_sx_vomit', 'fn_vomit_nausea_only', 'fn_vomit_other_chk', 'fn_sx_jaundice', 'fn_sx_gi_none',
      'fn_sx_dysuria', 'fn_sx_turbidurine', 'fn_sx_flankpain', 'fn_sx_oliguria', 'fn_sx_gu_none',
      'fn_sx_headache', 'fn_sx_stiffneck', 'fn_sx_alteredmental', 'fn_sx_seizure', 'fn_sx_neuro_none',
      'fn_sx_rash', 'fn_sx_wound', 'fn_sx_abscess', 'fn_sx_arthralgia', 'fn_sx_skin_none',
      'fn_sx_myalgia', 'fn_sx_petechiae', 'fn_sx_floodwater', 'fn_sx_forestravel',
      'fn_sx_close_contact_fever', 'fn_sx_recent_hosp_3m', 'fn_sx_chemo_immuno', 'fn_sx_indwelling_postop', 'fn_sx_tropical_none',
      'fn_fem_pv_bleeding', 'fn_fem_pelvic_discharge'
    ].forEach(id => {
      const c = document.getElementById(id);
      if (c) c.checked = false;
    });
    this.branchIds.forEach(bId => toggleFnBranch(bId, false));
    toggleFnBranch('vomitCharSection', true);
    this.inputIdsToClear.forEach(iId => {
      const inp = document.getElementById(iId);
      if (inp) inp.value = '';
    });
    const durUnit = document.getElementById('fnDurationUnit');
    if (durUnit) durUnit.value = 'days';
  },

  collectIntake(ctx) {
    ctx = ctx || {};
    const _rawDur = parseFloat(document.getElementById('fnDurationVal')?.value);
    const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
    const durationUnit = document.getElementById('fnDurationUnit')?.value || 'days';
    const feverPattern = getFnRadioVal('fnPattern') || 'unspecified';

    const fnAntipyreticTaken = getFnRadioVal('fnAntipyreticTaken') || 'unspecified';
    const antipyreticResponse = fnAntipyreticTaken === 'taken' ? (getFnRadioVal('fnAntipyreticResponse') || 'unspecified') : 'unspecified';
    const fnAntipyreticTypes = fnAntipyreticTaken === 'taken' ? getFnCheckedVals('fnAntipyreticTypes') : [];
    const fnAntipyreticTimeUnknown = fnAntipyreticTaken === 'taken' && Boolean(document.getElementById('fnAntipyreticTimeUnknown')?.checked);
    const fnAntipyreticLastTime = (fnAntipyreticTaken === 'taken' && !fnAntipyreticTimeUnknown)
      ? (document.getElementById('fnAntipyreticLastTime')?.value?.trim() || '')
      : '';

    const fnTempMeasured = getFnRadioVal('fnTempMeasured') || 'unspecified';
    const fnMaxTempUnknown = fnTempMeasured === 'measured' && Boolean(document.getElementById('fnMaxTempUnknown')?.checked);
    const _rawTemp = parseFloat(document.getElementById('fnMaxTempVal')?.value);
    const fnMaxTempVal = (fnTempMeasured === 'measured' && !fnMaxTempUnknown && !isNaN(_rawTemp)) ? _rawTemp : null;

    const fnRespNone = Boolean(document.getElementById('fn_sx_resp_none')?.checked);
    const cough = Boolean(document.getElementById('fn_sx_cough')?.checked);
    const coughDetails = cough ? getFnCheckedVals('fnCoughDetail') : [];
    const fnCoughOtherText = (cough && document.getElementById('fn_cough_other_chk')?.checked) ? (document.getElementById('fn_cough_other_text')?.value?.trim() || '') : '';
    const soreThroat = Boolean(document.getElementById('fn_sx_sorethroat')?.checked);
    const soreThroatLocs = soreThroat ? getFnCheckedVals('fnSorethroatLoc') : [];
    const fnSoreThroatOtherText = (soreThroat && document.getElementById('fn_st_other_chk')?.checked) ? (document.getElementById('fn_st_other_text')?.value?.trim() || '') : '';
    const rhinorrhea = Boolean(document.getElementById('fn_sx_rhinorrhea')?.checked);
    const dyspnea = Boolean(document.getElementById('fn_sx_dyspnea')?.checked);
    const dyspneaPatterns = dyspnea ? getFnCheckedVals('fnDyspneaPattern') : [];
    const fnDyspneaOtherText = (dyspnea && document.getElementById('fn_dyspnea_other_chk')?.checked) ? (document.getElementById('fn_dyspnea_other_text')?.value?.trim() || '') : '';

    const fnGiNone = Boolean(document.getElementById('fn_sx_gi_none')?.checked);
    const abdpain = Boolean(document.getElementById('fn_sx_abdpain')?.checked);
    const abdpainLocs = abdpain ? getFnCheckedVals('fnAbdpainLoc') : [];
    const fnAbdpainLocOtherText = (abdpain && document.getElementById('fn_abdpain_loc_other_chk')?.checked) ? (document.getElementById('fn_abdpain_loc_other_text')?.value?.trim() || '') : '';
    const abdpainChars = abdpain ? getFnCheckedVals('fnAbdpainChar') : [];
    const fnAbdpainCharOtherText = (abdpain && document.getElementById('fn_abdpain_char_other_chk')?.checked) ? (document.getElementById('fn_abdpain_char_other_text')?.value?.trim() || '') : '';
    const abdpainRads = abdpain ? getFnCheckedVals('fnAbdpainRad') : [];
    const fnAbdpainRadOtherText = (abdpain && document.getElementById('fn_abdpain_rad_other_chk')?.checked) ? (document.getElementById('fn_abdpain_rad_other_text')?.value?.trim() || '') : '';
    const diarrhea = Boolean(document.getElementById('fn_sx_diarrhea')?.checked);
    const diarrheaFreq = diarrhea ? (parseInt(document.getElementById('fnDiarrheaFreq')?.value, 10) || 1) : 0;
    const diarrheaStools = diarrhea ? getFnCheckedVals('fnDiarrheaStool') : [];
    const fnDiarrheaOtherText = (diarrhea && document.getElementById('fn_diarrhea_other_chk')?.checked) ? (document.getElementById('fn_diarrhea_other_text')?.value?.trim() || '') : '';
    const vomit = Boolean(document.getElementById('fn_sx_vomit')?.checked);
    const isNauseaOnly = vomit && Boolean(document.getElementById('fn_vomit_nausea_only')?.checked);
    const vomitFreq = (vomit && !isNauseaOnly) ? (parseInt(document.getElementById('vomitFreq')?.value, 10) || 1) : 0;
    const vomitContents = (vomit && !isNauseaOnly) ? getFnCheckedVals('fnVomitContent') : [];
    const fnVomitOtherText = (vomit && !isNauseaOnly && document.getElementById('fn_vomit_other_chk')?.checked) ? (document.getElementById('fn_vomit_other_text')?.value?.trim() || '') : '';
    const fnJaundice = Boolean(document.getElementById('fn_sx_jaundice')?.checked);

    const fnGuNone = Boolean(document.getElementById('fn_sx_gu_none')?.checked);
    const dysuria = Boolean(document.getElementById('fn_sx_dysuria')?.checked);
    const turbidUrine = Boolean(document.getElementById('fn_sx_turbidurine')?.checked);
    const flankPain = Boolean(document.getElementById('fn_sx_flankpain')?.checked);
    const fnOliguria = Boolean(document.getElementById('fn_sx_oliguria')?.checked);

    const fnNeuroNone = Boolean(document.getElementById('fn_sx_neuro_none')?.checked);
    const headache = Boolean(document.getElementById('fn_sx_headache')?.checked);
    const stiffNeck = Boolean(document.getElementById('fn_sx_stiffneck')?.checked);
    const alteredMental = Boolean(document.getElementById('fn_sx_alteredmental')?.checked);
    const seizure = Boolean(document.getElementById('fn_sx_seizure')?.checked);

    const fnSkinNone = Boolean(document.getElementById('fn_sx_skin_none')?.checked);
    const rash = Boolean(document.getElementById('fn_sx_rash')?.checked);
    const rashLoc = rash ? (document.getElementById('fn_rash_loc_text')?.value?.trim() || '') : '';
    const wound = Boolean(document.getElementById('fn_sx_wound')?.checked);
    const woundLoc = wound ? (document.getElementById('fn_wound_loc_text')?.value?.trim() || '') : '';
    const abscess = Boolean(document.getElementById('fn_sx_abscess')?.checked);
    const abscessLoc = abscess ? (document.getElementById('fn_abscess_loc_text')?.value?.trim() || '') : '';
    const arthralgia = Boolean(document.getElementById('fn_sx_arthralgia')?.checked);
    const arthralgiaLoc = arthralgia ? (document.getElementById('fn_arthralgia_loc_text')?.value?.trim() || '') : '';

    const fnTropicalNone = Boolean(document.getElementById('fn_sx_tropical_none')?.checked);
    const myalgia = Boolean(document.getElementById('fn_sx_myalgia')?.checked);
    const petechiae = Boolean(document.getElementById('fn_sx_petechiae')?.checked);
    const floodWater = Boolean(document.getElementById('fn_sx_floodwater')?.checked);
    const forestTravel = Boolean(document.getElementById('fn_sx_forestravel')?.checked);
    const fnCloseContactFever = Boolean(document.getElementById('fn_sx_close_contact_fever')?.checked);
    const fnRecentHosp3m = Boolean(document.getElementById('fn_sx_recent_hosp_3m')?.checked);
    const fnChemoImmuno = Boolean(document.getElementById('fn_sx_chemo_immuno')?.checked);
    const fnIndwellingPostOp = Boolean(document.getElementById('fn_sx_indwelling_postop')?.checked);

    const gender = ctx.gender || 'ไม่ระบุ';
    const isFemCtx = shouldShowFnFemaleBranch(gender === 'หญิง' || isFnFemaleTitle());
    const fnPregnancyStatus = isFemCtx ? (getFnRadioVal('fnPregnancyStatus') || 'unspecified') : 'not_applicable';
    const fnPregnancyWeeks = (isFemCtx && fnPregnancyStatus === 'pregnant') ? (document.getElementById('fnPregnancyWeeks')?.value?.trim() || '') : '';
    const fn_fem_pv_bleeding = isFemCtx && Boolean(document.getElementById('fn_fem_pv_bleeding')?.checked);
    const fn_fem_pelvic_discharge = isFemCtx && Boolean(document.getElementById('fn_fem_pelvic_discharge')?.checked);
    const fnLmpDate = isFemCtx ? (document.getElementById('fnLmpDate')?.value?.trim() || '') : '';

    return {
      id: ctx.recordId || `case-${Date.now()}`,
      queue_number: ctx.queueNumber || 'ER-NEW',
      hn: ctx.randomHn || '-',
      name: ctx.patientName || 'ไม่ระบุชื่อ',
      age: ctx.patientAge !== undefined ? ctx.patientAge : 'ไม่ระบุ',
      gender,
      chief_complaint: 'fever_and_chills',
      chief_complaint_title: 'ไข้ / หนาวสั่น',
      status: ctx.recordStatus || 'waiting',
      timestamp: new Date().toISOString(),
      durationVal,
      durationUnit,
      feverPattern,
      fnAntipyreticTaken,
      antipyreticResponse,
      fnAntipyreticTypes,
      fnAntipyreticTimeUnknown,
      fnAntipyreticLastTime,
      fnTempMeasured,
      fnMaxTempUnknown,
      fnMaxTempVal,
      fnRespNone,
      cough,
      coughDetails,
      fnCoughOtherText,
      soreThroat,
      soreThroatLocs,
      fnSoreThroatOtherText,
      rhinorrhea,
      dyspnea,
      dyspneaPatterns,
      fnDyspneaOtherText,
      fnGiNone,
      abdpain,
      abdpainLocs,
      fnAbdpainLocOtherText,
      abdpainChars,
      fnAbdpainCharOtherText,
      abdpainRads,
      fnAbdpainRadOtherText,
      diarrhea,
      diarrheaFreq,
      diarrheaStools,
      fnDiarrheaOtherText,
      vomit,
      isNauseaOnly,
      vomitFreq,
      vomitContents,
      fnVomitOtherText,
      fnJaundice,
      fnGuNone,
      dysuria,
      turbidUrine,
      flankPain,
      fnOliguria,
      fnNeuroNone,
      headache,
      stiffNeck,
      alteredMental,
      seizure,
      fnSkinNone,
      rash,
      rashLoc,
      wound,
      woundLoc,
      abscess,
      abscessLoc,
      arthralgia,
      arthralgiaLoc,
      fnTropicalNone,
      myalgia,
      petechiae,
      floodWater,
      forestTravel,
      fnCloseContactFever,
      fnRecentHosp3m,
      fnChemoImmuno,
      fnIndwellingPostOp,
      fnPregnancyStatus,
      fnPregnancyWeeks,
      fn_fem_pv_bleeding,
      fn_fem_pelvic_discharge,
      fnLmpDate,
      otherSymptomsFree: document.getElementById('sx_other_free')?.value?.trim() || ctx.otherSymptomsFree || '',
      hospRecordStatus: ctx.hospRecordStatus || 'unspecified',
      underlying: (Array.isArray(ctx.underlying) && ctx.underlying.length > 0) ? ctx.underlying : ((ctx.hospRecordStatus === 'self' || ctx.hospRecordStatus === 'additional') ? ['ปฏิเสธ'] : []),
      drugAllergy: ctx.drugAllergy || 'ไม่ได้ระบุ',
      currentMeds: ctx.currentMeds || 'ไม่ได้ระบุ',
      doctor_notes: ctx.preservedDoctorNotes || { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' }
    };
  },

  populateForm(patient) {
    if (!patient) return;
    this.resetForm();

    const setElVal = (id, v) => { const e = document.getElementById(id); if (e) e.value = v ?? ''; };
    const setElChk = (id, v, wrapId) => {
      const e = document.getElementById(id);
      if (e) e.checked = Boolean(v);
      if (wrapId) toggleFnBranch(wrapId, Boolean(v));
    };

    setElVal('fnDurationVal', patient.durationVal || '');
    setElVal('fnDurationUnit', patient.durationUnit || 'days');
    setFnRadioVal('fnPattern', patient.feverPattern);

    setFnRadioVal('fnAntipyreticTaken', patient.fnAntipyreticTaken);
    handleFnAntipyreticTakenChange(patient.fnAntipyreticTaken);
    if (patient.fnAntipyreticTaken === 'taken') {
      setFnRadioVal('fnAntipyreticResponse', patient.antipyreticResponse);
      setFnCheckboxGroup('fnAntipyreticTypes', patient.fnAntipyreticTypes);
      setElChk('fnAntipyreticTimeUnknown', patient.fnAntipyreticTimeUnknown);
      setElVal('fnAntipyreticLastTime', patient.fnAntipyreticTimeUnknown ? '' : (patient.fnAntipyreticLastTime || ''));
    }

    setFnRadioVal('fnTempMeasured', patient.fnTempMeasured);
    handleFnTempMeasuredChange(patient.fnTempMeasured);
    setElChk('fnMaxTempUnknown', patient.fnMaxTempUnknown);
    setElVal('fnMaxTempVal', patient.fnMaxTempUnknown ? '' : (patient.fnMaxTempVal ?? ''));

    setElChk('fn_sx_resp_none', patient.fnRespNone);
    setElChk('fn_sx_cough', patient.cough, 'fnCoughBranch');
    if (patient.cough) {
      setFnCheckboxGroup('fnCoughDetail', patient.coughDetails);
      setElChk('fn_cough_other_chk', Boolean(patient.fnCoughOtherText), 'fn_cough_other_wrap');
      setElVal('fn_cough_other_text', patient.fnCoughOtherText || '');
    }
    setElChk('fn_sx_sorethroat', patient.soreThroat, 'fnSorethroatBranch');
    if (patient.soreThroat) {
      setFnCheckboxGroup('fnSorethroatLoc', patient.soreThroatLocs);
      setElChk('fn_st_other_chk', Boolean(patient.fnSoreThroatOtherText), 'fn_st_other_wrap');
      setElVal('fn_st_other_text', patient.fnSoreThroatOtherText || '');
    }
    setElChk('fn_sx_rhinorrhea', patient.rhinorrhea);
    setElChk('fn_sx_dyspnea', patient.dyspnea, 'fnDyspneaBranch');
    if (patient.dyspnea) {
      setFnCheckboxGroup('fnDyspneaPattern', patient.dyspneaPatterns);
      setElChk('fn_dyspnea_other_chk', Boolean(patient.fnDyspneaOtherText), 'fn_dyspnea_other_wrap');
      setElVal('fn_dyspnea_other_text', patient.fnDyspneaOtherText || '');
    }

    setElChk('fn_sx_gi_none', patient.fnGiNone);
    setElChk('fn_sx_abdpain', patient.abdpain, 'fnAbdpainBranch');
    if (patient.abdpain) {
      setFnCheckboxGroup('fnAbdpainLoc', patient.abdpainLocs);
      setElChk('fn_abdpain_loc_other_chk', Boolean(patient.fnAbdpainLocOtherText), 'fn_abdpain_loc_other_wrap');
      setElVal('fn_abdpain_loc_other_text', patient.fnAbdpainLocOtherText || '');
      setFnCheckboxGroup('fnAbdpainChar', patient.abdpainChars);
      setElChk('fn_abdpain_char_other_chk', Boolean(patient.fnAbdpainCharOtherText), 'fn_abdpain_char_other_wrap');
      setElVal('fn_abdpain_char_other_text', patient.fnAbdpainCharOtherText || '');
      setFnCheckboxGroup('fnAbdpainRad', patient.abdpainRads);
      setElChk('fn_abdpain_rad_other_chk', Boolean(patient.fnAbdpainRadOtherText), 'fn_abdpain_rad_other_wrap');
      setElVal('fn_abdpain_rad_other_text', patient.fnAbdpainRadOtherText || '');
    }
    setElChk('fn_sx_diarrhea', patient.diarrhea, 'fnDiarrheaBranch');
    if (patient.diarrhea) {
      setElVal('fnDiarrheaFreq', patient.diarrheaFreq || 1);
      setFnCheckboxGroup('fnDiarrheaStool', patient.diarrheaStools);
      setElChk('fn_diarrhea_other_chk', Boolean(patient.fnDiarrheaOtherText), 'fn_diarrhea_other_wrap');
      setElVal('fn_diarrhea_other_text', patient.fnDiarrheaOtherText || '');
    }
    setElChk('fn_sx_vomit', patient.vomit, 'fnVomitBranch');
    if (patient.vomit) {
      setElChk('fn_vomit_nausea_only', patient.isNauseaOnly);
      handleFnNauseaOnlyToggle(Boolean(patient.isNauseaOnly));
      if (!patient.isNauseaOnly) {
        setElVal('vomitFreq', patient.vomitFreq || 1);
        setFnCheckboxGroup('fnVomitContent', patient.vomitContents);
        setElChk('fn_vomit_other_chk', Boolean(patient.fnVomitOtherText), 'fn_vomit_other_wrap');
        setElVal('fn_vomit_other_text', patient.fnVomitOtherText || '');
      }
    }
    setElChk('fn_sx_jaundice', patient.fnJaundice);

    setElChk('fn_sx_gu_none', patient.fnGuNone);
    setElChk('fn_sx_dysuria', patient.dysuria);
    setElChk('fn_sx_turbidurine', patient.turbidUrine);
    setElChk('fn_sx_flankpain', patient.flankPain);
    setElChk('fn_sx_oliguria', patient.fnOliguria);

    setElChk('fn_sx_neuro_none', patient.fnNeuroNone);
    setElChk('fn_sx_headache', patient.headache);
    setElChk('fn_sx_stiffneck', patient.stiffNeck);
    setElChk('fn_sx_alteredmental', patient.alteredMental);
    setElChk('fn_sx_seizure', patient.seizure);

    setElChk('fn_sx_skin_none', patient.fnSkinNone);
    setElChk('fn_sx_rash', patient.rash, 'fn_rash_loc_wrap');
    setElVal('fn_rash_loc_text', patient.rashLoc || '');
    setElChk('fn_sx_wound', patient.wound, 'fn_wound_loc_wrap');
    setElVal('fn_wound_loc_text', patient.woundLoc || '');
    setElChk('fn_sx_abscess', patient.abscess, 'fn_abscess_loc_wrap');
    setElVal('fn_abscess_loc_text', patient.abscessLoc || '');
    setElChk('fn_sx_arthralgia', patient.arthralgia, 'fn_arthralgia_loc_wrap');
    setElVal('fn_arthralgia_loc_text', patient.arthralgiaLoc || '');

    setElChk('fn_sx_tropical_none', patient.fnTropicalNone);
    setElChk('fn_sx_myalgia', patient.myalgia);
    setElChk('fn_sx_petechiae', patient.petechiae);
    setElChk('fn_sx_floodwater', patient.floodWater);
    setElChk('fn_sx_forestravel', patient.forestTravel);
    setElChk('fn_sx_close_contact_fever', patient.fnCloseContactFever);
    setElChk('fn_sx_recent_hosp_3m', patient.fnRecentHosp3m);
    setElChk('fn_sx_chemo_immuno', patient.fnChemoImmuno);
    setElChk('fn_sx_indwelling_postop', patient.fnIndwellingPostOp);

    const isFem = patient.gender === 'หญิง';
    updateFnFemaleContext(isFem);
    if (shouldShowFnFemaleBranch(isFem)) {
      setFnRadioVal('fnPregnancyStatus', patient.fnPregnancyStatus);
      handleFnPregnancyChange(patient.fnPregnancyStatus);
      setElVal('fnPregnancyWeeks', patient.fnPregnancyWeeks || '');
      setElChk('fn_fem_pv_bleeding', patient.fn_fem_pv_bleeding);
      setElChk('fn_fem_pelvic_discharge', patient.fn_fem_pelvic_discharge);
      setElVal('fnLmpDate', patient.fnLmpDate || '');
    }

    setElVal('sx_other_free', patient.otherSymptomsFree || '');
  },

  hydrateForm(patient) {
    this.populateForm(patient);
  },

  isRedFlag(patient) {
    return evaluateFeverNewRedFlags(patient).length > 0;
  },

  evaluateRedFlags: evaluateFeverNewRedFlags,
  updateOutputs: updateFeverNewOutputs,

  seedPatients: [
    {
      id: 'case-040',
      queue_number: 'A-040',
      hn: '6701124',
      name: 'นางสมพร ศรีสุข',
      age: 58,
      gender: 'หญิง',
      chief_complaint: 'fever_and_chills',
      chief_complaint_title: 'ไข้ / หนาวสั่น',
      status: 'waiting',
      timestamp: '2026-10-26T02:01:26.411Z',
      durationVal: 4,
      durationUnit: 'days',
      feverPattern: 'chills_and_rigor',
      fnAntipyreticTaken: 'taken',
      antipyreticResponse: 'refractory',
      fnAntipyreticTypes: ['paracetamol'],
      fnAntipyreticTimeUnknown: false,
      fnAntipyreticLastTime: '05:00',
      fnTempMeasured: 'measured',
      fnMaxTempUnknown: false,
      fnMaxTempVal: 39.2,
      fnRespNone: false,
      cough: true,
      coughDetails: ['purulent', 'throat_phlegm'],
      soreThroat: true,
      soreThroatLocs: ['diffuse'],
      rhinorrhea: false,
      dyspnea: true,
      dyspneaPatterns: ['continuous', 'orthopnea'],
      fnGiNone: true,
      fnGuNone: true,
      fnNeuroNone: true,
      fnSkinNone: true,
      fnTropicalNone: true,
      fnPregnancyStatus: 'menopause_hysterectomy',
      otherSymptomsFree: '',
      hospRecordStatus: 'self',
      underlying: ['เบาหวาน (DM)', 'ความดันสูง (HT)'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Metformin 500mg, Amlodipine 5mg',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' }
    },
    {
      id: 'case-041',
      queue_number: 'A-041',
      hn: '6703489',
      name: 'นายกิตติศักดิ์ เจริญพร',
      age: 24,
      gender: 'ชาย',
      chief_complaint: 'fever_and_chills',
      chief_complaint_title: 'ไข้ / หนาวสั่น',
      status: 'waiting',
      timestamp: '2026-10-26T02:21:26.423Z',
      durationVal: 2,
      durationUnit: 'days',
      feverPattern: 'low_grade',
      fnAntipyreticTaken: 'taken',
      antipyreticResponse: 'temporary_relief',
      fnAntipyreticTypes: ['paracetamol'],
      fnAntipyreticTimeUnknown: true,
      fnAntipyreticLastTime: '',
      fnTempMeasured: 'not_measured',
      fnMaxTempUnknown: false,
      fnMaxTempVal: null,
      fnRespNone: true,
      fnGiNone: false,
      abdpain: true,
      abdpainLocs: ['periumbilical', 'epigastrium'],
      abdpainChars: ['crampy'],
      abdpainRads: [],
      diarrhea: true,
      diarrheaFreq: 4,
      diarrheaStools: ['watery'],
      vomit: true,
      isNauseaOnly: true,
      fnJaundice: false,
      fnGuNone: true,
      fnNeuroNone: true,
      fnSkinNone: true,
      fnTropicalNone: true,
      fnPregnancyStatus: 'not_applicable',
      otherSymptomsFree: 'ทานส้มตำปูปลาร้าเมื่อวานตอนเย็น',
      hospRecordStatus: 'self',
      underlying: ['ปฏิเสธ'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'ไม่มี',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' }
    },
    {
      id: 'case-042',
      queue_number: 'A-042',
      hn: '6709842',
      name: 'นางสาวกานดา ใจดี',
      age: 29,
      gender: 'หญิง',
      chief_complaint: 'fever_and_chills',
      chief_complaint_title: 'ไข้ / หนาวสั่น',
      status: 'waiting',
      timestamp: '2026-10-26T02:36:26.423Z',
      durationVal: 3,
      durationUnit: 'days',
      feverPattern: 'continuous_high',
      fnAntipyreticTaken: 'taken',
      antipyreticResponse: 'temporary_relief',
      fnAntipyreticTypes: ['nsaid_aspirin'],
      fnAntipyreticTimeUnknown: false,
      fnAntipyreticLastTime: '06:00',
      fnTempMeasured: 'measured',
      fnMaxTempUnknown: false,
      fnMaxTempVal: 39.4,
      fnRespNone: true,
      fnGiNone: false,
      abdpain: true,
      abdpainLocs: ['ruq'],
      abdpainChars: ['dull'],
      abdpainRads: [],
      diarrhea: false,
      vomit: false,
      fnJaundice: false,
      fnGuNone: true,
      fnNeuroNone: false,
      headache: true,
      stiffNeck: false,
      alteredMental: false,
      seizure: false,
      fnSkinNone: false,
      rash: true,
      rashLoc: 'ลำตัวและแขน 2 ข้าง',
      arthralgia: true,
      arthralgiaLoc: 'ข้อมือและข้อเท้า 2 ข้าง',
      fnTropicalNone: false,
      myalgia: true,
      petechiae: true,
      fnCloseContactFever: true,
      fnPregnancyStatus: 'not_pregnant',
      fn_fem_pv_bleeding: true,
      fn_fem_pelvic_discharge: false,
      fnLmpDate: '10/10/2026',
      otherSymptomsFree: '',
      hospRecordStatus: 'self',
      underlying: ['ปฏิเสธ'],
      drugAllergy: 'Amoxicillin (ผื่นลมพิษ)',
      currentMeds: 'ไม่มี',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' }
    },
    {
      id: 'seed-fever-04',
      queue_number: 'A-049',
      hn: '6709943',
      name: 'นายประเสริฐ ทองคำ',
      age: 64,
      gender: 'ชาย',
      chief_complaint: 'fever_and_chills',
      chief_complaint_title: 'ไข้ / หนาวสั่น',
      status: 'waiting',
      timestamp: '2026-10-26T03:00:00.000Z',
      durationVal: 2,
      durationUnit: 'days',
      feverPattern: 'chills_and_rigor',
      fnAntipyreticTaken: 'not_taken',
      antipyreticResponse: 'unspecified',
      fnAntipyreticTypes: [],
      fnTempMeasured: 'measured',
      fnMaxTempUnknown: false,
      fnMaxTempVal: 39.6,
      fnRespNone: true,
      fnGiNone: false,
      abdpain: true,
      abdpainLocs: ['ruq', 'epigastrium'],
      abdpainChars: ['dull'],
      abdpainRads: [],
      fnJaundice: true,
      fnGuNone: true,
      fnNeuroNone: true,
      fnSkinNone: true,
      fnTropicalNone: false,
      myalgia: true,
      forestTravel: true,
      fnRecentHosp3m: true,
      fnPregnancyStatus: 'not_applicable',
      otherSymptomsFree: 'เพิ่งนอน รพ. เพื่อส่องกล้องท่อน้ำดีเมื่อ 3 สัปดาห์ก่อน',
      hospRecordStatus: 'self',
      underlying: ['นิ่วในท่อน้ำดี'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'ไม่มี',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' }
    }
  ]
});
