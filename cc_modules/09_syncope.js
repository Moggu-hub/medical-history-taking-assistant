// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 09_syncope.js
// อาการนำ: หมดสติ / วูบ / เป็นลม (Syncope / Blackout / Collapse)
// ปรับปรุงตาม plan_syncope.md, SKILL_PLAN_CC และ SKILL_CODE_CC (C-AP1 ถึง C-AP16)
// =========================================================================

function toggleSyncopeBranch(id, show) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('hidden', !show);
}

function renderSyncopeCard(cfg) {
  const {
    kind = 'radio', id = '', name = '', value = '', title,
    desc = '', onchange = '', colSpan2 = false, compact = false, bgWhite = false
  } = cfg;
  const idAttr = id ? `id="${id}" ` : '';
  const nameAttr = name ? `name="${name}" ` : '';
  const valAttr = value ? `value="${value}" ` : '';
  const chgAttr = onchange ? `onchange="${onchange}" ` : '';
  const alignCls = desc ? 'items-start' : 'items-center';
  const padCls = compact ? 'p-2.5' : 'p-3';
  const bgCls = bgWhite ? 'bg-white ' : '';
  const spanCls = colSpan2 ? ' sm:col-span-2' : '';
  const roundCls = kind === 'checkbox' ? 'rounded ' : '';
  const topCls = desc ? 'mt-0.5 ' : '';
  const szCls = compact ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const bodyHtml = desc
    ? `<div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">${title}</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">${desc}</span></div>`
    : `<span class="ml-3 ${compact ? 'text-xs' : 'text-xs sm:text-sm'} font-semibold text-slate-800">${title}</span>`;
  return `<label class="selectable-card ${bgCls}flex ${alignCls} ${padCls} rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition${spanCls}"><input type="${kind}" ${idAttr}${nameAttr}${valAttr}${chgAttr}class="${topCls}${roundCls}text-medical-600 focus:ring-medical-500 ${szCls} flex-shrink-0">${bodyHtml}</label>`;
}

function renderSyncopeGrid(colsCls, items, shared = {}) {
  return `<div class="grid ${colsCls} gap-2.5">${items.map(it => renderSyncopeCard({ ...shared, ...it })).join('\n')}</div>`;
}

function setSyncopeRadioChecked(name, val) {
  if (val === undefined || val === null || val === '') return;
  const el = document.querySelector(`input[name="${name}"][value="${val}"]`);
  if (el) el.checked = true;
}

function clearSyncopeRadioGroup(name) {
  document.querySelectorAll(`input[name="${name}"]`).forEach(el => {
    el.checked = false;
  });
}

function clearSyncopeCheckboxes(ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.checked = false;
  });
}

function getSyncopeRadioValue(name) {
  return document.querySelector(`input[name="${name}"]:checked`)?.value || '';
}

function isSyncopeFemaleTitle(arg) {
  if (typeof arg === 'boolean') return arg;
  if (typeof arg === 'object' && arg !== null) {
    if (typeof arg.isFemale === 'boolean') return arg.isFemale;
    if (typeof arg.title === 'string') return /นาง|น\.ส\.|ด\.ญ\.|หญิง|Mrs|Miss|Ms/i.test(arg.title);
  }
  if (typeof arg === 'string') return /นาง|น\.ส\.|ด\.ญ\.|หญิง|Mrs|Miss|Ms/i.test(arg);
  const pfx = document.getElementById('patientTitleSelect')?.value || '';
  return /นาง|น\.ส\.|ด\.ญ\.|หญิง|Mrs|Miss|Ms/i.test(pfx);
}

function syncSyncopeFemaleSection(explicitFemale) {
  const isFem = explicitFemale !== undefined ? Boolean(explicitFemale) : isSyncopeFemaleTitle();
  const sec = document.getElementById('syncopeFemaleSection');
  if (sec) sec.classList.toggle('hidden', !isFem);
  if (!isFem) {
    clearSyncopeRadioGroup('syncopePregnancyStatus');
    toggleSyncopeBranch('syncopePregnancyWeeksWrap', false);
    clearSyncopeCheckboxes(['syncope_fem_lower_abd_pain', 'syncope_fem_pv_bleeding']);
    const wEl = document.getElementById('syncopePregnancyWeeks');
    if (wEl) wEl.value = '';
    const lmpEl = document.getElementById('syncopeLmpDate');
    if (lmpEl) lmpEl.value = '';
  }
}

function handleSyncopePostureChange() {
  const val = getSyncopeRadioValue('syncopePosture');
  const isExertion = val === 'during_exertion';
  const isResting = val === 'supine_or_resting';
  const isOther = val === 'other';

  toggleSyncopeBranch('syncopeExertionSubWrap', isExertion);
  toggleSyncopeBranch('syncopeRestingSubWrap', isResting);
  toggleSyncopeBranch('syncopePostureOtherWrap', isOther);

  if (!isExertion) clearSyncopeRadioGroup('syncopeExertionTiming');
  if (!isResting) clearSyncopeRadioGroup('syncopeRestingPosition');
  if (!isOther) {
    const txt = document.getElementById('syncopePostureOtherText');
    if (txt) txt.value = '';
  }
}

function updateSyncopeRecoveryContext() {
  const consLevel = getSyncopeRadioValue('syncopeConsciousnessLevel');
  const durVal = getSyncopeRadioValue('syncopeUnconsciousDuration');
  if (consLevel === 'true_syncope' && durVal === 'continuous_unconscious') {
    setSyncopeRadioChecked('syncopeRecoveryPattern', 'persistent_drowsy_coma');
  }
  const recVal = getSyncopeRadioValue('syncopeRecoveryPattern');
  const stillComa = (consLevel === 'true_syncope' && durVal === 'continuous_unconscious') || recVal === 'persistent_drowsy_coma';
  toggleSyncopeBranch('syncopePostSymptomsSectionWrap', !stillComa);
  if (stillComa) {
    document.querySelectorAll('input[name="syncopePostSymptoms"]').forEach(cb => {
      cb.checked = false;
    });
  }
}

function handleSyncopeConsciousnessLevelChange() {
  const val = getSyncopeRadioValue('syncopeConsciousnessLevel');
  const isTrue = val === 'true_syncope';
  toggleSyncopeBranch('syncopeUnconsciousDurationWrap', isTrue);
  if (!isTrue) {
    clearSyncopeRadioGroup('syncopeUnconsciousDuration');
    toggleSyncopeBranch('syncopeDurationGte5mWrap', false);
    const minEl = document.getElementById('syncopeDurationGte5mVal');
    if (minEl) minEl.value = '';
  }
  updateSyncopeRecoveryContext();
}

function handleSyncopeUnconsciousDurationChange() {
  const val = getSyncopeRadioValue('syncopeUnconsciousDuration');
  const showMin = val === 'prolonged_gte_5m';
  toggleSyncopeBranch('syncopeDurationGte5mWrap', showMin);
  if (!showMin) {
    const minEl = document.getElementById('syncopeDurationGte5mVal');
    if (minEl) minEl.value = '';
  }
  updateSyncopeRecoveryContext();
}

function handleSyncopeEpisodeCountChange() {
  const val = getSyncopeRadioValue('syncopeEpisodeCount');
  const showCnt = val === 'multiple_cluster';
  toggleSyncopeBranch('syncopeEpisodeCountWrap', showCnt);
  if (!showCnt) {
    const cntEl = document.getElementById('syncopeEpisodeCountVal');
    if (cntEl) cntEl.value = '';
  }
}

function handleSyncopeWarningChange(el) {
  if (!el) return;
  if (el.value === 'none_sudden' && el.checked) {
    document.querySelectorAll('input[name="syncopeProdromes"]').forEach(cb => {
      if (cb.value !== 'none_sudden') cb.checked = false;
    });
  } else if (el.checked && el.value !== 'none_sudden') {
    const noneCb = document.querySelector('input[name="syncopeProdromes"][value="none_sudden"]');
    if (noneCb) noneCb.checked = false;
  }
}

function handleSyncopeMotorCategoryChange() {
  const val = getSyncopeRadioValue('syncopeMotorCategory');
  const isAbnormal = val === 'abnormal_movements';
  toggleSyncopeBranch('syncopeMotorSubWrap', isAbnormal);
  if (!isAbnormal) clearSyncopeRadioGroup('syncopeMotorSign');
}

function handleSyncopePostSymptomChange(el) {
  if (!el) return;
  if (el.value === 'post_none_asymptomatic' && el.checked) {
    document.querySelectorAll('input[name="syncopePostSymptoms"]').forEach(cb => {
      if (cb.value !== 'post_none_asymptomatic') cb.checked = false;
    });
  } else if (el.checked && el.value !== 'post_none_asymptomatic') {
    const noneCb = document.querySelector('input[name="syncopePostSymptoms"][value="post_none_asymptomatic"]');
    if (noneCb) noneCb.checked = false;
  }
}

function handleSyncopeFallInjuryChange() {
  const val = getSyncopeRadioValue('syncopeFallInjury');
  const hasInjury = val === 'yes';
  toggleSyncopeBranch('syncopeFallInjuryDetailWrap', hasInjury);
  if (!hasInjury) {
    clearSyncopeCheckboxes(['syncope_fall_head_impact', 'syncope_fall_open_wound', 'syncope_fall_limb_pain']);
    const txt = document.getElementById('syncopeFallInjuryDetailText');
    if (txt) txt.value = '';
  }
}

function handleSyncopeRiskChange(el) {
  if (!el) return;
  if (el.value === 'none_unremarkable' && el.checked) {
    document.querySelectorAll('input[name="syncopeRiskFactors"]').forEach(cb => {
      if (cb.value !== 'none_unremarkable') cb.checked = false;
    });
  } else if (el.checked && el.value !== 'none_unremarkable') {
    const noneCb = document.querySelector('input[name="syncopeRiskFactors"][value="none_unremarkable"]');
    if (noneCb) noneCb.checked = false;
  }
}

function handleSyncopePregnancyChange() {
  const val = getSyncopeRadioValue('syncopePregnancyStatus');
  const isPreg = val === 'pregnant';
  toggleSyncopeBranch('syncopePregnancyWeeksWrap', isPreg);
  if (!isPreg) {
    const wEl = document.getElementById('syncopePregnancyWeeks');
    if (wEl) wEl.value = '';
  }
}

// --- Lookup Tables (Thai Labels — 100% Zero Raw Enum Leaks, C-AP14) ---
const SYNCOPE_LABELS = {
  units: { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' },
  reporter: {
    patient_self: 'ผู้ป่วยรู้สึกตัวดีและให้ข้อมูลด้วยตนเอง',
    witness_relative: 'ญาติหรือผู้เห็นเหตุการณ์ขณะหมดสติเป็นผู้เล่า',
    both_patient_witness: 'ทั้งผู้ป่วยและผู้เห็นเหตุการณ์ร่วมกันให้ข้อมูล',
    unspecified: 'ไม่ได้ระบุผู้ให้ข้อมูล'
  },
  posture: {
    prolonged_standing: 'ยืนอยู่นานหรืออยู่ในที่ร้อนแออัด',
    sudden_standing: 'เพิ่งลุกขึ้นยืนหรือเปลี่ยนท่าเร็วๆ จากท่านั่งหรือนอน',
    during_exertion: 'ขณะออกแรงหรือออกกำลังกาย',
    supine_or_resting: 'ขณะพักผ่อนอยู่เฉยๆ',
    standing_or_walking_normal: 'ขณะยืนหรือเดินตามปกติ ไม่ได้ออกแรงหนัก',
    micturition_defecation: 'ขณะหรือทันทีหลังปัสสาวะ ถ่ายอุจจาระ กลืนอาหาร หรือไอแรงๆ',
    neck_movement: 'ขณะหันศีรษะ เงยหน้า หรือสวมเสื้อคอแน่น',
    other: 'ท่าทางหรือกิจกรรมอื่นๆ',
    unspecified: 'ไม่ได้ระบุท่าทางก่อนเกิดเหตุ'
  },
  exertionTiming: {
    during_active_exertion: 'ระหว่างกำลังออกแรงหรือออกกำลังกาย',
    immediately_post_exertion: 'หยุดออกกำลังกายกะทันหันก่อน แล้วจึงมีอาการ',
    unspecified: ''
  },
  restingPosition: {
    while_lying_supine: 'ขณะนอน (Supine)',
    while_sitting_resting: 'ขณะนั่งพักอยู่เฉยๆ',
    unspecified: ''
  },
  consciousLevel: {
    true_syncope: 'หมดสติไปชั่วขณะ ไม่รู้สึกตัว (True Syncope / TLOC)',
    near_syncope: 'เกือบหมดสติ หรือแค่วูบหน้ามืด แต่ยังรู้สึกตัว (Near-Syncope)',
    unspecified: 'ไม่ได้ระบุระดับความรู้สึกตัว'
  },
  lossDuration: {
    brief_seconds: 'สั้นมากไม่เกิน 1 นาที (ประมาณ 10–30 วินาที)',
    typical_minutes: 'นานประมาณ 1 – 4 นาที',
    typical_1_to_2m: 'นานประมาณ 1 – 2 นาที',
    prolonged_gte_5m: 'นานตั้งแต่ 5 นาทีขึ้นไป',
    continuous_unconscious: 'ยังไม่ฟื้นสติจนถึงขณะนี้',
    unknown_unobserved: 'ไม่ทราบระยะเวลา (ไม่ได้สังเกต)',
    unspecified: 'ไม่ได้ระบุระยะเวลาหมดสติ'
  },
  prodrome: {
    none_sudden: 'ไม่มีอาการเตือน ล้มลงหมดสติทันที',
    lightheaded_tunnel_vision: 'หน้ามืด วิงเวียน หรือตาพร่ามัวเห็นภาพมืดลง',
    cold_sweat_pallor_nausea: 'เหงื่อแตกตัวเย็น หน้าซีด หรือคลื่นไส้',
    sudden_palpitation: 'ใจสั่นรัวหรือหัวใจเต้นสะดุดกะทันหันก่อนวูบ',
    chest_pain_pressure: 'เจ็บแน่นหน้าอกหรือปวดร้าวไปกราม/สะบักหลัง',
    severe_dyspnea: 'หายใจหอบเหนื่อยหรือหายใจไม่อิ่มกะทันหันก่อนวูบ',
    thunderclap_headache: 'ปวดศีรษะรุนแรงเฉียบพลันก่อนหมดสติ',
    hyperventilation_tingling: 'หายใจหอบเร็ว ชารอบปาก หรือชาปลายมือ',
    aura_epigastric_olfactory: 'จุกแน่นในท้องลอยขึ้นคอ ได้กลิ่นแปลกๆ หรือเห็นแสงวาบ (Aura)',
    unspecified: 'ไม่ได้ระบุอาการเตือน'
  },
  motorSign: {
    brief_myoclonic_jerks: 'กระตุกเบาๆ สั้นๆ ไม่กี่ครั้งหลังล้มลง (Convulsive Syncope)',
    generalized_tonic_clonic: 'เกร็งแข็งและกระตุกรุนแรงทั้งตัวต่อเนื่องเป็นนาที (GTCS)',
    carpopedal_spasm: 'มือจีบเกร็งทั้งสองข้าง นิ้วมืองุ้มเข้าหากัน (Carpopedal spasm)',
    thrashing_closed_eyes: 'ดิ้นสะบัดไปมา ส่ายศีรษะ หรือหลับตาแน่น',
    unknown_unobserved: 'ไม่ทราบแน่ชัด (ไม่ได้สังเกต)',
    limp_flaccid: 'ตัวอ่อนปวกเปียกล้มลง ไม่มีการเกร็งกระตุก',
    unspecified: 'ไม่ได้ระบุลักษณะการเคลื่อนไหว'
  },
  recovery: {
    rapid_spontaneous: 'หลังเริ่มตื่นรู้เรื่องทันทีภายใน 1–2 นาที ไม่งง ไม่สับสน',
    prolonged_confusion: 'หลังตื่นยังสับสน มึนงง จำเหตุการณ์ไม่ได้ หรือหลับต่อนานเกิน 5 นาที',
    persistent_drowsy_coma: 'ยังมีอาการสับสน มึนงง ปลุกยากจนถึงขณะนี้',
    unspecified: 'ไม่ได้ระบุสภาพหลังเริ่มฟื้น'
  },
  postSymptom: {
    post_focal_weakness: 'แขนขาอ่อนแรงครึ่งซีก ปากเบี้ยว หรือพูดไม่ชัดหลังฟื้น',
    post_ongoing_chestpain: 'ยังคงเจ็บแน่นหน้าอก หอบเหนื่อย หรือใจสั่นต่อเนื่องหลังฟื้น',
    post_orthostatic_intolerance: 'หน้ามืดจะเป็นลมซ้ำทันทีเมื่อพยายามลุกนั่งหรือยืน',
    post_severe_abdpain_melena: 'ปวดท้องรุนแรงหรือปวดร้าวไปที่หลัง',
    post_severe_headache: 'ปวดศีรษะรุนแรงต่อเนื่องหลังฟื้น',
    post_diffuse_muscle_pain: 'ปวดเมื่อยระบมกล้ามเนื้อทั่วตัวหลังฟื้น',
    post_severe_headache_myalgia: 'ปวดศีรษะรุนแรงและปวดเมื่อยระบมกล้ามเนื้อทั่วตัว',
    post_mild_fatigue: 'อ่อนเพลียเล็กน้อยหลังฟื้น',
    post_none_asymptomatic: 'ไม่มีอาการผิดปกติหลังฟื้นสติ',
    none: 'ไม่มีอาการผิดปกติหลังฟื้นสติ'
  },
  riskFactor: {
    known_heart_disease: 'มีโรคหัวใจเดิมหรือเคยผ่าตัดหัวใจ',
    known_arrhythmia_pacemaker: 'มีภาวะหัวใจเต้นผิดจังหวะหรือใส่เครื่องกระตุ้นหัวใจ (Pacemaker/ICD)',
    family_sudden_death_young: 'มีประวัติครอบครัวสายตรงเสียชีวิตกะทันหันอายุน้อย (< 50 ปี)',
    recent_bp_med_adjustment: 'เพิ่งเริ่มทานยาความดัน ยาขับปัสสาวะ หรือเพิ่งปรับเพิ่มขนาดยา',
    dehydration_diarrhea: 'มีอาการท้องเสีย อาเจียน ดื่มน้ำน้อย หรือขาดน้ำมาก่อนวูบ',
    suspected_gi_bleeding: 'ถ่ายอุจจาระดำ ถ่ายเป็นเลือดสด หรืออาเจียนเป็นเลือด',
    diabetic_on_meds: 'เป็นเบาหวานที่ฉีดอินซูลินหรือทานยาลดน้ำตาล',
    known_diabetes_insulin: 'เป็นเบาหวานที่ฉีดอินซูลินหรือทานยาลดน้ำตาล',
    known_epilepsy_seizure: 'มีโรคประจำตัวเป็นโรคลมชักหรือเคยชักมาก่อน',
    recurrent_syncope_history: 'เคยวูบ เป็นลม หรือหมดสติซ้ำตั้งแต่ 2 ครั้งขึ้นไป',
    female_missed_period: 'ขาดประจำเดือนหรือสงสัยตั้งครรภ์',
    none_unremarkable: 'ไม่มีปัจจัยเสี่ยงจำเพาะดังกล่าว'
  },
  pregnancy: {
    not_pregnant: 'ประจำเดือนมาตามปกติ / ไม่ได้ตั้งครรภ์',
    missed_period: 'ขาดประจำเดือนหรือสงสัยว่าอาจตั้งครรภ์',
    pregnant: 'กำลังตั้งครรภ์',
    postpartum_6w: 'เพิ่งคลอดบุตรหรือแท้งบุตรภายใน 6 สัปดาห์',
    menopause_hysterectomy: 'วัยหมดประจำเดือนหรือผ่าตัดมดลูกแล้ว',
    unsure: 'ไม่แน่ใจสถานะการตั้งครรภ์',
    not_applicable: ''
  },
  hospStatus: {
    ratchaburi: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
    complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
    additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
    self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
    unspecified: 'ไม่ได้ระบุ'
  }
};

function computeSyncopeSheldonAndHvs(patient) {
  const sheldon = typeof calculateSheldonScore === 'function'
    ? calculateSheldonScore(patient)
    : { score: 0, interpretation: 'ไม่ได้คำนวณ (ไม่มีโมดูล 08_seizure)' };
  const hvs = typeof evaluateHyperventilationScreen === 'function'
    ? evaluateHyperventilationScreen(patient)
    : { isSuspected: false, label: '✓ ไม่พบอาการจำเพาะของกลุ่มอาการหายใจหอบเร็ว' };
  return { sheldon, hvs };
}

function evaluateSyncopeRedFlags(patient) {
  const redFlags = [];
  if (!patient) return redFlags;

  const prodromes = Array.isArray(patient.syncopeProdromes) ? patient.syncopeProdromes : [];
  const signs = Array.isArray(patient.syncopeSigns) ? patient.syncopeSigns : [];
  const postSx = Array.isArray(patient.syncopePostSymptoms) ? patient.syncopePostSymptoms : [];
  const risks = Array.isArray(patient.syncopeRiskFactors) ? patient.syncopeRiskFactors : [];

  const isCardiacRiskPresent = Boolean(
    prodromes.includes('sudden_palpitation') ||
    prodromes.includes('chest_pain_pressure') ||
    prodromes.includes('none_sudden') ||
    risks.includes('known_heart_disease') ||
    risks.includes('known_arrhythmia_pacemaker') ||
    risks.includes('family_sudden_death_young') ||
    Number(patient.age) >= 40
  );

  if (patient.syncopePosture === 'during_exertion') {
    if (patient.syncopeExertionTiming !== 'immediately_post_exertion') {
      redFlags.push({
        key: 'syncope_exertional',
        textTh: 'หมดสติเกิดขึ้นระหว่างกำลังออกแรงหรือออกกำลังกาย (Exertional Syncope)',
        risk: 'สงสัยภาวะหัวใจเต้นผิดจังหวะหรือโรคโครงสร้างหัวใจ (HOCM / Severe AS / ACS) ต้องตรวจ 12-lead EKG และติด Cardiac Monitor ด่วน'
      });
    } else if (isCardiacRiskPresent) {
      redFlags.push({
        key: 'syncope_post_exertion_cardiac_risk',
        textTh: 'วูบหลังหยุดออกกำลังกายกะทันหันร่วมกับปัจจัยเสี่ยงทางหัวใจ/อายุ ≥ 40 ปี',
        risk: 'แม้พบได้ใน post-exercise pooling แต่เมื่อมีปัจจัยเสี่ยงร่วมต้องคัดกรอง 12-lead EKG เพื่อตัดภาวะหัวใจเต้นผิดจังหวะหรือกล้ามเนื้อหัวใจขาดเลือด'
      });
    }
  }

  if (patient.syncopePosture === 'supine_or_resting') {
    const restText = patient.syncopeRestingPosition === 'while_sitting_resting'
      ? 'ขณะนั่งพักอยู่เฉยๆ'
      : 'ขณะนอนราบ (Supine Syncope)';
    redFlags.push({
      key: 'syncope_supine',
      textTh: `หมดสติเกิดขึ้น${restText} โดยไม่ได้ออกแรงหรือเปลี่ยนท่า`,
      risk: 'บ่งชี้ Cardiac Arrhythmia หรือ Seizure มากกว่า Reflex syncope ต้องตรวจ 12-lead EKG และประเมินคลื่นไฟฟ้าหัวใจต่อเนื่อง'
    });
  }

  if (prodromes.includes('sudden_palpitation')) {
    redFlags.push({
      key: 'syncope_palpitation',
      textTh: 'มีอาการใจสั่นรัวหรือหัวใจเต้นสะดุดกะทันหันก่อนวูบ (Arrhythmic Syncope)',
      risk: 'เสี่ยงหัวใจเต้นผิดจังหวะรุนแรง (VT / Brugada / Long QT / High-grade AV block) ต้องตรวจ 12-lead EKG ภายใน 10 นาที'
    });
  }

  if (prodromes.includes('none_sudden')) {
    redFlags.push({
      key: 'syncope_no_prodrome',
      textTh: 'หมดสติฉับพลันโดยไม่มีอาการเตือนล่วงหน้า (Sudden Collapse Without Prodrome)',
      risk: 'ลักษณะจำเพาะของ Arrhythmic Syncope หรือ Stokes-Adams attack เสี่ยงบาดเจ็บรุนแรงและหัวใจหยุดเต้น'
    });
  }

  if (prodromes.includes('chest_pain_pressure') || postSx.includes('post_ongoing_chestpain')) {
    redFlags.push({
      key: 'syncope_chest_pain',
      textTh: 'เจ็บแน่นหน้าอกนำมาก่อนหรือยังแน่นหน้าอกต่อเนื่องหลังฟื้น (Cardiogenic / ACS / Aortic Dissection)',
      risk: 'เสี่ยง Acute Coronary Syndrome, Aortic Dissection หรือ Pulmonary Embolism ต้องทำ EKG 12 สาย ตรวจ Troponin และวัดความดัน 2 แขน'
    });
  }

  if (prodromes.includes('severe_dyspnea') || signs.includes('syncope_cyanosis_apnea')) {
    redFlags.push({
      key: 'syncope_dyspnea',
      textTh: 'หายใจหอบเหนื่อยรุนแรงหรือริมฝีปากเขียวคล้ำ (Suspected Massive PE / Acute Hypoxia)',
      risk: 'เสี่ยงภาวะลิ่มเลือดอุดกั้นในปอดเฉียบพลันหรือหัวใจล้มเหลวเฉียบพลัน ประเมิน SpO2, EKG และ POCUS ทันที'
    });
  }

  if (prodromes.includes('thunderclap_headache')) {
    redFlags.push({
      key: 'syncope_thunderclap',
      textTh: 'ปวดศีรษะรุนแรงเฉียบพลันก่อนหมดสติ (Suspected SAH / Intracranial Hemorrhage)',
      risk: 'เสี่ยงภาวะเลือดออกใต้เยื่อหุ้มสมอง (SAH) ต้องส่งตรวจ Non-contrast CT Brain เร่งด่วน'
    });
  }

  if (postSx.includes('post_focal_weakness')) {
    redFlags.push({
      key: 'syncope_focal_neuro',
      textTh: 'แขนขาอ่อนแรงครึ่งซีก ปากเบี้ยว หรือพูดไม่ชัดหลังฟื้น (Acute Stroke / Todd Paresis)',
      risk: 'ต้องคัดกรอง Stroke Fast Track ทันทีและส่ง CT Brain ด่วน'
    });
  }

  const hasSeizureFeature = Boolean(
    (patient.syncopeMotorCategory === 'abnormal_movements' && patient.syncopeMotorSign === 'generalized_tonic_clonic') ||
    patient.syncopeMotorSign === 'generalized_tonic_clonic' ||
    signs.includes('syncope_lateral_tongue_bite') ||
    patient.syncopeRecoveryPattern === 'prolonged_confusion'
  );
  if (hasSeizureFeature) {
    redFlags.push({
      key: 'syncope_epileptic_seizure',
      textTh: 'เกร็งกระตุกทั้งตัวต่อเนื่องเป็นนาที / กัดลิ้น / สับสนมึนงงหลังฟื้นนานเกิน 5 นาที (Suspected Epileptic Seizure)',
      risk: 'เข้าได้กับอาการชักแท้ ต้องเจาะ DTX ทันที ตรวจ Electrolytes และพิจารณา CT Brain ตามข้อบ่งชี้'
    });
  }

  if (
    patient.syncopeUnconsciousDuration === 'prolonged_gte_5m' ||
    patient.syncopeUnconsciousDuration === 'continuous_unconscious' ||
    patient.syncopeRecoveryPattern === 'persistent_drowsy_coma'
  ) {
    redFlags.push({
      key: 'syncope_prolonged_coma',
      textTh: 'หมดสตินานตั้งแต่ 5 นาทีขึ้นไป หรือยังไม่ฟื้นสติ / ยังซึมสับสนปลุกยากจนถึงขณะนี้ (Prolonged Coma / Persistent Altered Mental Status)',
      risk: 'ภาวะวิกฤตฉุกเฉิน ต้องประเมิน ABC เจาะ DTX ทันที และดูแลในห้อง Resuscitation'
    });
  }

  if (risks.includes('known_heart_disease') || risks.includes('known_arrhythmia_pacemaker')) {
    redFlags.push({
      key: 'syncope_structural_heart',
      textTh: 'มีโรคหัวใจเดิม ภาวะหัวใจเต้นผิดจังหวะ หรือใส่เครื่องกระตุ้นหัวใจ Pacemaker/ICD (CSRS High Risk)',
      risk: 'ความเสี่ยงสูงต่อ Sudden Cardiac Death ต้องตรวจ 12-lead EKG และพิจารณา Admit Telemetry / CCU'
    });
  }

  if (risks.includes('family_sudden_death_young')) {
    redFlags.push({
      key: 'syncope_family_sudden_death',
      textTh: 'ประวัติครอบครัวเสียชีวิตกะทันหันโดยไม่ทราบสาเหตุอายุน้อย < 50 ปี (Inherited Arrhythmia Risk)',
      risk: 'เสี่ยงภาวะหัวใจเต้นผิดจังหวะถ่ายทอดทางพันธุกรรม (Brugada, Long QT, HCM) ต้องตรวจ EKG ละเอียด'
    });
  }

  const isFemale = patient.gender === 'หญิง';
  const isPregMissed = Boolean(
    risks.includes('female_missed_period') ||
    (isFemale && (patient.syncopePregnancyStatus === 'missed_period' || patient.syncopePregnancyStatus === 'pregnant')) ||
    patient.syncope_lmp_status === 'missed_period' ||
    patient.syncope_lmp_status === 'pregnant' ||
    (isFemale && (patient.syncope_fem_lower_abd_pain || patient.syncope_fem_pv_bleeding || postSx.includes('post_severe_abdpain_melena')))
  );
  if (isPregMissed) {
    redFlags.push({
      key: 'syncope_ectopic_risk',
      textTh: 'สตรีขาดประจำเดือน / ตั้งครรภ์ / ปวดท้องน้อยหรือเลือดออกทางช่องคลอดร่วมกับวูบ (Suspected Ectopic Pregnancy)',
      risk: 'เสี่ยงภาวะท้องนอกมดลูกแตกช็อกจากการเสียเลือดภายใน ต้องตรวจ Urine Pregnancy Test และ FAST Ultrasound ด่วนที่สุด'
    });
  }

  if (
    risks.includes('suspected_gi_bleeding') ||
    postSx.includes('post_severe_abdpain_melena') ||
    postSx.includes('post_orthostatic_intolerance')
  ) {
    redFlags.push({
      key: 'syncope_gi_or_orthostatic_bleed',
      textTh: 'ถ่ายดำ/อาเจียนเลือด หรือปวดท้อง/หลังรุนแรง หรือหน้ามืดซ้ำทันทีเมื่อลุกนั่ง/ยืน (Occult Bleeding / Shock Risk)',
      risk: 'เสี่ยงภาวะเสียเลือดในทางเดินอาหารหรือหลอดเลือดแดงใหญ่โป่งพองแตก (Ruptured AAA) เปิดเส้น IV เบอร์ใหญ่ 2 เส้น เจาะ CBC และจองเลือดด่วน'
    });
  }

  const hasHeadTrauma = Boolean(
    signs.includes('syncope_head_facial_injury') ||
    (patient.syncopeFallInjury === 'yes' && patient.syncope_fall_head_impact)
  );
  if (hasHeadTrauma) {
    redFlags.push({
      key: 'syncope_head_injury',
      textTh: 'มีศีรษะหรือใบหน้ากระแทกพื้นจากการล้มหมดสติ (Secondary Head Injury)',
      risk: 'เสี่ยงเลือดออกในกะโหลกศีรษะจากการล้มหมดสติโดยไม่ทันป้องกันตัว ประเมินตามเกณฑ์ส่ง CT Brain'
    });
  }

  if (patient.syncopeEpisodeCount === 'multiple_cluster') {
    redFlags.push({
      key: 'syncope_cluster',
      textTh: `มีอาการวูบหรือหมดสติซ้ำหลายครั้งใน 24 ชม. (${patient.syncopeEpisodeCountVal || 2} ครั้ง)`,
      risk: 'บ่งชี้ความไม่คงที่ของการไหลเวียนเลือดสมองหรือหัวใจเต้นผิดจังหวะซ้ำ ต้องติดตามใกล้ชิด'
    });
  }

  return redFlags;
}

function updateSyncopeOutputs(patient) {
  const durationText = patient.durationVal
    ? `${patient.durationVal} ${SYNCOPE_LABELS.units[patient.durationUnit] || 'ชั่วโมง'}`
    : 'ไม่ระบุระยะเวลา';

  const { sheldon, hvs } = computeSyncopeSheldonAndHvs(patient);

  const reporterStr = SYNCOPE_LABELS.reporter[patient.syncopeReporter] || 'ไม่ได้ระบุผู้ให้ข้อมูล';
  let postureStr = SYNCOPE_LABELS.posture[patient.syncopePosture] || 'ไม่ได้ระบุท่าทางก่อนเกิดเหตุ';
  if (patient.syncopePosture === 'during_exertion' && patient.syncopeExertionTiming) {
    const exStr = SYNCOPE_LABELS.exertionTiming[patient.syncopeExertionTiming];
    if (exStr) postureStr += ` (${exStr})`;
  } else if (patient.syncopePosture === 'supine_or_resting' && patient.syncopeRestingPosition) {
    const restStr = SYNCOPE_LABELS.restingPosition[patient.syncopeRestingPosition];
    if (restStr) postureStr = restStr;
  } else if (patient.syncopePosture === 'other' && patient.syncopePostureOtherText) {
    postureStr = `อื่นๆ (${patient.syncopePostureOtherText})`;
  }

  const consciousStr = SYNCOPE_LABELS.consciousLevel[patient.syncopeConsciousnessLevel] || 'ไม่ได้ระบุระดับความรู้สึกตัว';
  const durMinExtra = (patient.syncopeUnconsciousDuration === 'prolonged_gte_5m' && patient.syncopeDurationGte5mVal)
    ? ` (ประมาณ ${patient.syncopeDurationGte5mVal} นาที)`
    : '';
  const lossDurationStr = patient.syncopeConsciousnessLevel === 'true_syncope'
    ? `${SYNCOPE_LABELS.lossDuration[patient.syncopeUnconsciousDuration] || 'ไม่ได้ระบุระยะเวลาหมดสติ'}${durMinExtra}`
    : (patient.syncopeConsciousnessLevel === 'near_syncope' ? 'ไม่หมดสติเต็มที่ (เกือบหมดสติ/หน้ามืด)' : 'ไม่ได้ระบุระยะเวลาหมดสติ');

  const episodeStr = patient.syncopeEpisodeCount === 'multiple_cluster'
    ? `เกิดซ้ำตั้งแต่ 2 ครั้งขึ้นไป (${patient.syncopeEpisodeCountVal || 2} ครั้งใน 24 ชม.)`
    : (patient.syncopeEpisodeCount === 'single' ? 'เกิดขึ้นเพียงครั้งเดียว' : 'ไม่ได้ระบุจำนวนครั้ง');

  const prodromesRaw = Array.isArray(patient.syncopeProdromes) && patient.syncopeProdromes.length > 0
    ? patient.syncopeProdromes
    : [];
  const prodromesStr = prodromesRaw.length > 0
    ? prodromesRaw.map(p => SYNCOPE_LABELS.prodrome[p] || p).join(', ')
    : 'ไม่ได้ระบุอาการเตือน';

  let motorStr = 'ไม่ได้ระบุลักษณะการเคลื่อนไหว';
  if (patient.syncopeMotorCategory === 'limp_flaccid') {
    motorStr = SYNCOPE_LABELS.motorSign.limp_flaccid;
  } else if (patient.syncopeMotorCategory === 'abnormal_movements') {
    motorStr = SYNCOPE_LABELS.motorSign[patient.syncopeMotorSign] || 'มีอาการเกร็งกระตุกหรือเคลื่อนไหวผิดปกติ';
  }

  const recoveryStr = SYNCOPE_LABELS.recovery[patient.syncopeRecoveryPattern] || 'ไม่ได้ระบุสภาพหลังเริ่มฟื้น';

  const postSxRaw = Array.isArray(patient.syncopePostSymptoms) ? patient.syncopePostSymptoms : [];
  const postSxStr = postSxRaw.length > 0
    ? postSxRaw.map(s => SYNCOPE_LABELS.postSymptom[s] || s).join(', ')
    : 'ไม่ได้ระบุ';

  // Fall Injury Summary
  const signs = Array.isArray(patient.syncopeSigns) ? patient.syncopeSigns : [];
  const hasFallYes = patient.syncopeFallInjury === 'yes' || signs.includes('syncope_head_facial_injury');
  let fallStr = patient.syncopeFallInjury === 'no' ? 'ไม่มีการบาดเจ็บจากการล้ม' : 'ไม่ได้ระบุ';
  if (hasFallYes) {
    const fallParts = [];
    if (patient.syncope_fall_head_impact || signs.includes('syncope_head_facial_injury')) fallParts.push('ศีรษะหรือใบหน้ากระแทกพื้น');
    if (patient.syncope_fall_open_wound) fallParts.push('มีบาดแผลฉีกขาดหรือเลือดออก');
    if (patient.syncope_fall_limb_pain) fallParts.push('ปวดบวมฟกช้ำหรือผิดรูปบริเวณแขนขา/ลำตัว');
    if (patient.syncopeFallInjuryDetailText) fallParts.push(`ตำแหน่ง: ${patient.syncopeFallInjuryDetailText}`);
    fallStr = `มีการบาดเจ็บจากการล้ม (${fallParts.join(', ') || 'ระบุว่าบาดเจ็บ'})`;
  }

  const positives = [];
  const negatives = [];
  const signsAnswered = signs.length > 0 || Boolean(patient.syncopeMotorCategory && patient.syncopeMotorCategory !== 'unspecified');

  if (signs.includes('syncope_marked_pallor_sweat')) positives.push('มีใบหน้าซีดเผือด ตัวเย็น เหงื่อออกชุ่มขณะเกิดเหตุ');
  else if (signsAnswered) negatives.push('ไม่มีหน้าซีดเหงื่อออกชุ่มชัดเจน');

  if (signs.includes('syncope_cyanosis_apnea')) positives.push('มีริมฝีปากเขียวคล้ำหรือหยุดหายใจชั่วขณะ');
  else if (signsAnswered) negatives.push('ไม่มีริมฝีปากเขียวคล้ำหรือหยุดหายใจ');

  if (signs.includes('syncope_lateral_tongue_bite')) positives.push('มีอาการกัดลิ้นหรือมีเลือดออกในปาก');
  else if (signsAnswered) negatives.push('ไม่มีแผลกัดลิ้นหรือเลือดออกในปาก');

  if (signs.includes('syncope_eyes_open_deviated')) positives.push('มีตาค้าง ตาเหลือกขึ้นบน หรือเบนไปข้างเดียว');
  else if (signsAnswered) negatives.push('ไม่มีตาค้างหรือตาเหลือกเบน');

  if (signs.includes('syncope_incontinence')) positives.push('มีปัสสาวะราดหรืออุจจาระราดขณะหมดสติ');
  else if (signsAnswered) negatives.push('ไม่มีปัสสาวะหรืออุจจาระราด');

  if (hasFallYes) positives.push(fallStr);
  else if (patient.syncopeFallInjury === 'no') negatives.push('ไม่มีบาดเจ็บหรือศีรษะกระแทกพื้นจากการล้ม');

  postSxRaw.forEach(s => {
    if (s !== 'post_none_asymptomatic' && SYNCOPE_LABELS.postSymptom[s]) {
      positives.push(SYNCOPE_LABELS.postSymptom[s]);
    }
  });

  const risksRaw = Array.isArray(patient.syncopeRiskFactors) ? patient.syncopeRiskFactors : [];
  const riskLabels = risksRaw
    .filter(r => r !== 'none_unremarkable')
    .map(r => SYNCOPE_LABELS.riskFactor[r] || r);
  riskLabels.forEach(rl => positives.push(rl));
  const riskSummaryText = riskLabels.length > 0
    ? riskLabels.join(', ')
    : (risksRaw.includes('none_unremarkable') ? 'ปฏิเสธ' : 'ไม่ได้ระบุ');

  if (patient.otherSymptomsFree && String(patient.otherSymptomsFree).trim()) {
    positives.push(`ผู้ป่วยแจ้งอาการเพิ่มเติม: "${String(patient.otherSymptomsFree).trim()}"`);
  }

  if (positives.length === 0) {
    if (patient.syncopeConsciousnessLevel && patient.syncopeConsciousnessLevel !== 'unspecified') {
      positives.push(`${consciousStr} (${postureStr})`);
    } else {
      positives.push('ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม');
    }
  }

  patient.pertinentPositives = positives;
  patient.pertinentNegatives = negatives.length > 0 ? negatives : ['ผู้ป่วยไม่ได้ระบุคำตอบยืนยันในหมวดอาการร่วม'];

  // Female Reproductive Section (C-AP13 — never emitted for males)
  const isFemale = patient.gender === 'หญิง';
  let femaleLine = '';
  let femaleStr = '';
  const effPregStatus = (patient.syncopePregnancyStatus && patient.syncopePregnancyStatus !== 'not_applicable')
    ? patient.syncopePregnancyStatus
    : (patient.syncope_lmp_status || '');
  if (isFemale && (effPregStatus || patient.syncopeLmpDate || patient.syncope_fem_lower_abd_pain || patient.syncope_fem_pv_bleeding)) {
    const pregText = SYNCOPE_LABELS.pregnancy[effPregStatus] || 'ไม่ได้ระบุสถานะประจำเดือน';
    const gaText = (effPregStatus === 'pregnant' && patient.syncopePregnancyWeeks) ? ` (GA ${patient.syncopePregnancyWeeks})` : '';
    const lmpText = patient.syncopeLmpDate ? `, LMP ${patient.syncopeLmpDate}` : '';
    const gynExtra = [];
    if (patient.syncope_fem_lower_abd_pain) gynExtra.push('ปวดท้องน้อย');
    if (patient.syncope_fem_pv_bleeding) gynExtra.push('มีเลือดออกทางช่องคลอด');
    femaleStr = `${pregText}${gaText}${lmpText}${gynExtra.length > 0 ? `, ${gynExtra.join(', ')}` : ''}`;
    femaleLine = `\n• ประวัติสตรี: ${femaleStr}`;
  }

  const hospLabel = SYNCOPE_LABELS.hospStatus[patient.hospRecordStatus] || 'ไม่ได้ระบุ';
  const docNotes = patient.doctor_notes || {};
  const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ') ? 'ไม่ได้ระบุ' : patient.currentMeds;
  const udArr = Array.isArray(patient.underlying) ? patient.underlying.filter(u => u && !u.includes('ปฏิเสธ') && u !== 'ไม่มี' && u !== 'ไม่มีโรคประจำตัว') : [];
  const udExplicitDeny = Array.isArray(patient.underlying) && patient.underlying.some(u => u && u.includes('ปฏิเสธ'));
  const udList = udArr.length > 0 ? udArr.join(', ') : ((patient.hospRecordStatus === 'self' || patient.hospRecordStatus === 'additional' || udExplicitDeny) ? 'ปฏิเสธ' : 'ไม่ได้ระบุ');
  const allergyText = (!patient.drugAllergy || patient.drugAllergy === 'ไม่ได้ระบุ') ? 'ไม่ได้ระบุ' : patient.drugAllergy;
  const effectiveRfs = Array.isArray(patient.redFlags) ? patient.redFlags : evaluateSyncopeRedFlags(patient);

  const defaultRapid =
`[Chief Complaint (CC)]
หมดสติ / วูบ / เป็นลม (Syncope / TLOC Workup) มา ${durationText}

[History of Present Illness (HPI)]
• ผู้ให้ข้อมูล: ${reporterStr}
• ระดับความรู้สึกตัวขณะเกิดเหตุ: ${consciousStr}
• ท่าทางหรือกิจกรรมก่อนเกิดเหตุ: ${postureStr}
• อาการเตือนนำก่อนวูบ: ${prodromesStr}
• ลักษณะการเคลื่อนไหวขณะเกิดเหตุ: ${motorStr}
• ระยะเวลาที่หมดสติไม่รู้ตัว: ${lossDurationStr}
• ความถี่ใน 24 ชม.: ${episodeStr}
• สภาพหลังเริ่มฟื้นคืนสติ: ${recoveryStr}
• อาการหลังฟื้นและการบาดเจ็บ: ${postSxStr}; ${fallStr}${femaleLine}

• Pertinent Positives:
${positives.map(p => `  - ${p}`).join('\n')}

• Pertinent Negatives:
${patient.pertinentNegatives.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• ปัจจัยเสี่ยงจำเพาะเดิม: ${riskSummaryText}
• โรคประจำตัว (U/D): ${udList}
• ยาประจำตัว (Current Meds): ${medsText}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${allergyText}

[Emergency Risk Assessment (Red Flags)]
${effectiveRfs.length > 0
  ? `🚩 RED FLAGS DETECTED:\n${effectiveRfs.map(rf => `  * ${rf.textTh}`).join('\n')}`
  : '✓ ไม่พบสัญญาณเตือนวิกฤตเฉียบพลันเบื้องต้น'}

[Doctor's Clinical Addendum & Exam]
• ประวัติเพิ่มเติม/แก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}
• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}
• แผนการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

  const defaultNarrative =
`ผู้ป่วย [${patient.name || 'ไม่ระบุชื่อ'}] อายุ ${patient.age || '-'} ปี เพศ ${patient.gender || 'ไม่ระบุ'} มารับการตรวจที่ห้องฉุกเฉิน รพ.ราชบุรี ด้วยอาการหมดสติ / วูบ / เป็นลม มา ${durationText} ให้ข้อมูลโดย [${reporterStr}]
เหตุการณ์: [${consciousStr}] เกิดเหตุขณะ [${postureStr}] อาการเตือนก่อนวูบ: [${prodromesStr}] ลักษณะขณะเกิดเหตุ: [${motorStr}] ระยะเวลาที่หมดสติ: [${lossDurationStr}] ความถี่: [${episodeStr}] การฟื้นคืนสติหลังตื่น: [${recoveryStr}] อาการหลังฟื้น: [${postSxStr}] การบาดเจ็บจากการล้ม: [${fallStr}]${femaleStr ? ` ประวัติสตรี: [${femaleStr}]` : ''}
การประเมินแยกโรค TLOC (Sheldon Score = ${sheldon.score}): ${sheldon.interpretation}; ${hvs.label}
อาการร่วมสำคัญที่พบ: ${positives.join(', ')}
อาการสำคัญที่ปฏิเสธ: ${patient.pertinentNegatives.join(', ')}
ประวัติสุขภาพและยา: [${hospLabel}], ปัจจัยเสี่ยง: ${riskSummaryText}, โรคประจำตัว: ${udList}, ยาประจำตัว: ${medsText}, แพ้ยา: ${allergyText}${effectiveRfs.length > 0 ? `\n[🚩 สัญญาณเตือนอันตราย (Red Flags)]: ${effectiveRfs.map(rf => rf.textTh).join('; ')}` : ''}

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
      triage_urgency_flag: effectiveRfs.length > 0,
      red_flags_count: effectiveRfs.length,
      hospital_record_status: patient.hospRecordStatus || null
    },
    chief_complaint: 'syncope',
    syncope_tloc_profile: {
      duration_value: patient.durationVal || null,
      duration_unit: patient.durationUnit || null,
      history_informant: patient.syncopeReporter || 'unspecified',
      preceding_posture: patient.syncopePosture || 'unspecified',
      exertion_timing: patient.syncopeExertionTiming || '',
      resting_position: patient.syncopeRestingPosition || '',
      preceding_posture_other_text: patient.syncopePostureOtherText || '',
      consciousness_level: patient.syncopeConsciousnessLevel || 'unspecified',
      unconscious_duration: patient.syncopeUnconsciousDuration || 'unspecified',
      unconscious_duration_gte_5m_approx_minutes: patient.syncopeDurationGte5mVal || null,
      episode_frequency: {
        type: patient.syncopeEpisodeCount || 'unspecified',
        total_count: patient.syncopeEpisodeCountVal || 1
      },
      warning_prodromes: prodromesRaw,
      motor_manifestation: {
        category: patient.syncopeMotorCategory || 'unspecified',
        pattern: patient.syncopeMotorSign || 'unspecified'
      },
      associated_physical_signs: signs,
      post_event_recovery: {
        recovery_pattern: patient.syncopeRecoveryPattern || 'unspecified',
        post_symptoms: postSxRaw
      },
      fall_injury: {
        status: hasFallYes ? 'yes' : 'no',
        head_facial_impact: Boolean(patient.syncope_fall_head_impact || signs.includes('syncope_head_facial_injury')),
        open_wound_bleeding: Boolean(patient.syncope_fall_open_wound),
        limb_or_trunk_pain_swelling: Boolean(patient.syncope_fall_limb_pain),
        details: patient.syncopeFallInjuryDetailText || ''
      },
      high_risk_and_etiology_factors: risksRaw,
      female_reproductive_history: isFemale ? {
        pregnancy_status: effPregStatus || 'unsure',
        gestational_age_weeks: patient.syncopePregnancyWeeks || '',
        lower_abdominal_pain: Boolean(patient.syncope_fem_lower_abd_pain),
        abnormal_vaginal_bleeding: Boolean(patient.syncope_fem_pv_bleeding),
        lmp_date: patient.syncopeLmpDate || ''
      } : null,
      clinical_differentiation_scores: {
        sheldon_score: sheldon.score,
        sheldon_interpretation: sheldon.interpretation,
        hyperventilation_suspected: hvs.isSuspected
      }
    },
    pertinent_positives: positives,
    pertinent_negatives: negatives,
    other_symptoms_free_text: patient.otherSymptomsFree || '',
    patient_background: {
      hospital_record_status: patient.hospRecordStatus || null,
      underlying_diseases: patient.underlying,
      drug_and_food_allergies: allergyText,
      current_medications: medsText
    },
    doctor_clinical_addendum: {
      additional_or_corrected_history: docNotes.additional_hpi || '',
      vitals_and_physical_exam: docNotes.physical_exam || '',
      provisional_diagnosis: docNotes.preliminary_dx || '',
      treatment_plan: docNotes.plan || ''
    }
  };

  const finalRapid = patient.custom_rapid_note || defaultRapid;
  const finalNarrative = patient.custom_narrative_note || defaultNarrative;
  patient.rapidHpi = finalRapid;
  patient.narrativeHpi = finalNarrative;
  patient.medicalJson = jsonPayload;

  const rapidEl = document.getElementById('rapidTextView');
  const narrEl = document.getElementById('narrativeTextView');
  const jsonEl = document.getElementById('jsonViewer');
  if (rapidEl) rapidEl.value = finalRapid;
  if (narrEl) narrEl.value = finalNarrative;
  if (jsonEl) jsonEl.textContent = JSON.stringify(jsonPayload, null, 2);

  return { rapid: finalRapid, narrative: finalNarrative, json: jsonPayload };
}

// --- Build Form HTML cleanly using C-AP1 / C-AP16 compliant templates ---
const SYNCOPE_CARD1_HTML = `
<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
  <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
    <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="clock" class="w-5 h-5"></i></div>
    <div>
      <h2 class="text-base font-bold text-slate-900">1. ข้อมูลเหตุการณ์ เวลา ท่าทางก่อนเกิดเหตุ และระดับความรู้สึกตัว</h2>
      <p class="text-xs text-slate-500 font-sans">Event Timing, Preceding Posture &amp; Consciousness Assessment</p>
    </div>
  </div>
  <div class="space-y-5">
    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">1.1 ระยะเวลาตั้งแต่เกิดอาการวูบหรือหมดสติครั้งนี้จนถึงปัจจุบัน <span class="text-rose-500">*</span></label>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div class="col-span-1 sm:col-span-2">
          <input type="number" id="syncopeDurationVal" min="1" max="1000" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm placeholder:text-slate-400 placeholder:font-normal" placeholder="เช่น 30 หรือ 2">
        </div>
        <div class="col-span-1">
          <select id="syncopeDurationUnit" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm">
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
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">1.2 ผู้ให้ข้อมูลประวัติเหตุการณ์</label>
      ${renderSyncopeGrid('grid-cols-1 sm:grid-cols-3', [
        { name: 'syncopeReporter', value: 'patient_self', title: 'ผู้ป่วยให้ข้อมูลเอง', desc: 'ผู้ป่วยรู้สึกตัวดีและเล่าเหตุการณ์ได้ด้วยตนเอง' },
        { name: 'syncopeReporter', value: 'witness_relative', title: 'ญาติ หรือผู้เห็นเหตุการณ์', desc: 'ผู้อยู่ในเหตุการณ์ขณะผู้ป่วยวูบหรือหมดสติเป็นผู้เล่า' },
        { name: 'syncopeReporter', value: 'both_patient_witness', title: 'ผู้ป่วยและญาติร่วมกันเล่า', desc: 'ทั้งผู้ป่วยและผู้เห็นเหตุการณ์ช่วยกันให้ข้อมูล' }
      ])}
    </div>

    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">1.3 ท่าทางหรือกิจกรรมที่กำลังทำก่อนเกิดอาการทันที</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        ${renderSyncopeCard({ name: 'syncopePosture', value: 'prolonged_standing', onchange: 'handleSyncopePostureChange()', title: 'ยืนนาน หรืออยู่ในที่ร้อนแออัด', desc: 'เช่น ยืนเข้าแถวนานๆ ยืนตากแดด หรืออยู่ในห้องที่ร้อนอบอ้าว' })}
        ${renderSyncopeCard({ name: 'syncopePosture', value: 'sudden_standing', onchange: 'handleSyncopePostureChange()', title: 'เพิ่งลุกขึ้นยืนหรือเปลี่ยนท่าเร็วๆ', desc: 'ลุกขึ้นยืนอย่างรวดเร็วจากท่านั่งหรือท่านอน' })}
        ${renderSyncopeCard({ name: 'syncopePosture', value: 'standing_or_walking_normal', onchange: 'handleSyncopePostureChange()', title: 'ขณะยืนหรือเดินตามปกติ', desc: 'ยืนหรือเดินทำกิจวัตรทั่วไปโดยไม่ได้ออกแรงหนัก' })}
        ${renderSyncopeCard({ name: 'syncopePosture', value: 'micturition_defecation', onchange: 'handleSyncopePostureChange()', title: 'ขณะหรือหลังปัสสาวะ ขับถ่าย หรือไอแรงๆ', desc: 'เกิดอาการทันทีขณะเบ่งปัสสาวะ ถ่ายอุจจาระ กลืนอาหาร หรือไอติดต่อกันรุนแรง' })}
        ${renderSyncopeCard({ name: 'syncopePosture', value: 'during_exertion', onchange: 'handleSyncopePostureChange()', colSpan2: true, title: 'ขณะออกแรง หรือออกกำลังกาย', desc: 'เกิดขึ้นในขณะที่กำลังเดินเร็ว วิ่ง ยกของหนัก หรือออกกำลังกาย' })}
        <div id="syncopeExertionSubWrap" class="hidden sm:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
          <span class="font-semibold text-slate-800 block">ช่วงเวลาที่เกิดอาการสัมพันธ์กับการออกแรง:</span>
          ${renderSyncopeGrid('grid-cols-1 sm:grid-cols-2', [
            { name: 'syncopeExertionTiming', value: 'during_active_exertion', title: 'ระหว่างกำลังออกแรง/ออกกำลังกาย', desc: 'เกิดขึ้นในขณะที่กำลังออกแรงหรือวิ่งอยู่', compact: true, bgWhite: true },
            { name: 'syncopeExertionTiming', value: 'immediately_post_exertion', title: 'หยุดออกกำลังกายกะทันหันก่อน แล้วจึงมีอาการ', desc: 'หยุดวิ่งหรือหยุดออกแรงทันทีแล้วจึงหน้ามืดวูบตามมา', compact: true, bgWhite: true }
          ])}
        </div>
        ${renderSyncopeCard({ name: 'syncopePosture', value: 'supine_or_resting', onchange: 'handleSyncopePostureChange()', colSpan2: true, title: 'ขณะนอนราบ หรือนั่งพักอยู่เฉยๆ', desc: 'เกิดขึ้นขณะพักผ่อนโดยไม่ได้ออกแรงหรือเปลี่ยนท่า' })}
        <div id="syncopeRestingSubWrap" class="hidden sm:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
          <span class="font-semibold text-slate-800 block">ท่าทางขณะพักที่เกิดเหตุ:</span>
          ${renderSyncopeGrid('grid-cols-1 sm:grid-cols-2', [
            { name: 'syncopeRestingPosition', value: 'while_lying_supine', title: 'ขณะนอน', desc: 'เกิดขึ้นในขณะที่กำลังนอนหงาย นอนตะแคง หรือนอนพักอยู่', compact: true, bgWhite: true },
            { name: 'syncopeRestingPosition', value: 'while_sitting_resting', title: 'ขณะนั่ง', desc: 'เกิดขึ้นในขณะที่กำลังนั่งพักหรือนั่งทำงานอยู่เฉยๆ', compact: true, bgWhite: true }
          ])}
        </div>
        ${renderSyncopeCard({ name: 'syncopePosture', value: 'neck_movement', onchange: 'handleSyncopePostureChange()', title: 'ขณะหันศีรษะ เงยหน้า หรือสวมเสื้อคอแน่น', desc: 'เกิดอาการทันทีเมื่อหันคอ โกนหนวด หรือถูกกดบริเวณลำคอ' })}
        ${renderSyncopeCard({ name: 'syncopePosture', value: 'other', onchange: 'handleSyncopePostureChange()', title: 'อื่นๆ', desc: 'ระบุท่าทางหรือกิจกรรมก่อนเกิดเหตุเพิ่มเติม' })}
        <div id="syncopePostureOtherWrap" class="hidden sm:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
          <label class="block text-xs font-semibold text-slate-700">ระบุท่าทางหรือกิจกรรมก่อนเกิดเหตุ:</label>
          <input type="text" id="syncopePostureOtherText" placeholder="เช่น กำลังขับรถ หรือนั่งทำงาน..." class="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 placeholder:text-slate-400">
        </div>
      </div>
    </div>

    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">1.4 ลักษณะความรู้สึกตัวขณะเกิดเหตุ</label>
      <div class="grid grid-cols-1 gap-2.5">
        ${renderSyncopeCard({ name: 'syncopeConsciousnessLevel', value: 'true_syncope', onchange: 'handleSyncopeConsciousnessLevelChange()', title: 'หมดสติไปชั่วขณะ ไม่รู้สึกตัว', desc: 'หมดสติไปเลยชั่วคราว จำช่วงที่ล้มลงหรือช่วงที่สลบไปไม่ได้' })}
        <div id="syncopeUnconsciousDurationWrap" class="hidden bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs">
          <span class="font-semibold text-slate-800 block">ระยะเวลาที่หมดสติไม่รู้สึกตัว (สลบไปนานกี่นาทีก่อนจะเริ่มฟื้น):</span>
          ${renderSyncopeGrid('grid-cols-1 sm:grid-cols-2', [
            { name: 'syncopeUnconsciousDuration', value: 'brief_seconds', onchange: 'handleSyncopeUnconsciousDurationChange()', title: 'สั้นมาก ไม่เกิน 1 นาที', desc: 'ประมาณ 10–30 วินาที แล้วเริ่มตื่นรู้ตัว', compact: true, bgWhite: true },
            { name: 'syncopeUnconsciousDuration', value: 'typical_minutes', onchange: 'handleSyncopeUnconsciousDurationChange()', title: 'นานประมาณ 1 – 4 นาที', compact: true, bgWhite: true },
            { name: 'syncopeUnconsciousDuration', value: 'prolonged_gte_5m', onchange: 'handleSyncopeUnconsciousDurationChange()', title: 'นานตั้งแต่ 5 นาทีขึ้นไป', compact: true, bgWhite: true },
            { name: 'syncopeUnconsciousDuration', value: 'continuous_unconscious', onchange: 'handleSyncopeUnconsciousDurationChange()', title: 'ยังไม่ฟื้นสติจนถึงขณะนี้', compact: true, bgWhite: true },
            { name: 'syncopeUnconsciousDuration', value: 'unknown_unobserved', onchange: 'handleSyncopeUnconsciousDurationChange()', title: 'ไม่ทราบระยะเวลา (ไม่ได้สังเกต)', desc: 'อยู่คนเดียวขณะเป็นลม หรือไม่มีผู้สังเกตเวลา', colSpan2: true, compact: true, bgWhite: true }
          ])}
          <div id="syncopeDurationGte5mWrap" class="hidden bg-white border border-slate-200 rounded-xl p-3 flex items-center space-x-2">
            <label class="text-xs font-semibold text-slate-700 whitespace-nowrap">ระบุเวลาที่หมดสติโดยประมาณ:</label>
            <input type="number" id="syncopeDurationGte5mVal" min="5" max="999" placeholder="เช่น 10" class="w-24 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-medical-500">
            <span class="text-xs text-slate-600">นาที</span>
          </div>
        </div>
        ${renderSyncopeCard({ name: 'syncopeConsciousnessLevel', value: 'near_syncope', onchange: 'handleSyncopeConsciousnessLevelChange()', title: 'เกือบหมดสติ หรือแค่วูบหน้ามืด', desc: 'รู้สึกเหมือนจะเป็นลม เข่าอ่อน ทรงตัวไม่อยู่ แต่ยังรู้สึกตัวและได้ยินเสียงรอบข้างตลอดเวลา' })}
      </div>
    </div>

    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">1.5 จำนวนครั้งที่มีอาการวูบหรือหมดสติในรอบ 24 ชั่วโมงที่ผ่านมา</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        ${renderSyncopeCard({ name: 'syncopeEpisodeCount', value: 'single', onchange: 'handleSyncopeEpisodeCountChange()', title: 'เกิดขึ้นเพียงครั้งเดียว', compact: true })}
        ${renderSyncopeCard({ name: 'syncopeEpisodeCount', value: 'multiple_cluster', onchange: 'handleSyncopeEpisodeCountChange()', title: 'เกิดซ้ำตั้งแต่ 2 ครั้งขึ้นไป', compact: true })}
        <div id="syncopeEpisodeCountWrap" class="hidden sm:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center space-x-2 text-xs">
          <label class="font-semibold text-slate-700 whitespace-nowrap">ระบุจำนวนครั้งทั้งหมดในวันนี้:</label>
          <input type="number" id="syncopeEpisodeCountVal" min="2" max="50" placeholder="เช่น 2" class="w-24 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-medical-500">
          <span class="text-slate-600">ครั้ง</span>
        </div>
      </div>
    </div>
  </div>
</div>`;

const SYNCOPE_CARD2_HTML = `
<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
  <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
    <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="bell-ring" class="w-5 h-5"></i></div>
    <div>
      <h2 class="text-base font-bold text-slate-900">2. อาการเตือนนำก่อนวูบ และลักษณะที่สังเกตเห็นขณะเกิดเหตุ</h2>
      <p class="text-xs text-slate-500 font-sans">Prodromal Symptoms &amp; Witnessed Event Characteristics</p>
    </div>
  </div>
  <div class="space-y-5">
    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">2.1 อาการเตือนที่รู้สึกได้ก่อนจะวูบหรือหมดสติ (เลือกได้หลายข้อ)</label>
      ${renderSyncopeGrid('grid-cols-1 sm:grid-cols-2', [
        { kind: 'checkbox', name: 'syncopeProdromes', value: 'none_sudden', onchange: 'handleSyncopeWarningChange(this)', title: 'ไม่มีอาการเตือน ล้มหมดสติทันที', desc: 'อยู่ดีๆ ก็วูบล้มลงทันทีโดยไม่มีอาการหน้ามืดหรือใจสั่นเตือนล่วงหน้า' },
        { kind: 'checkbox', name: 'syncopeProdromes', value: 'lightheaded_tunnel_vision', onchange: 'handleSyncopeWarningChange(this)', title: 'หน้ามืด วิงเวียน หรือตาพร่ามัว', desc: 'รู้สึกศีรษะเบาหวิว ภาพมืดลงเรื่อยๆ หรือมีเสียงดังอื้อในหู' },
        { kind: 'checkbox', name: 'syncopeProdromes', value: 'cold_sweat_pallor_nausea', onchange: 'handleSyncopeWarningChange(this)', title: 'เหงื่อแตกตัวเย็น หน้าซีด หรือคลื่นไส้', desc: 'เหงื่อออกชุ่มตัว ตัวเย็นเฉียบ หรือรู้สึกพะอืดพะอมคล้ายจะอาเจียนก่อนวูบ' },
        { kind: 'checkbox', name: 'syncopeProdromes', value: 'sudden_palpitation', onchange: 'handleSyncopeWarningChange(this)', title: 'ใจสั่นรัว หรือหัวใจเต้นสะดุด', desc: 'รู้สึกหัวใจเต้นเร็วแรงหรือเต้นผิดจังหวะขึ้นมาอย่างกะทันหันก่อนวูบ' },
        { kind: 'checkbox', name: 'syncopeProdromes', value: 'chest_pain_pressure', onchange: 'handleSyncopeWarningChange(this)', title: 'เจ็บแน่นหน้าอก หรือปวดร้าวไปกราม/หลัง', desc: 'มีอาการเจ็บแน่นอึดอัดหน้าอก หรือปวดร้าวไปที่คอ กราม หรือสะบักหลัง' },
        { kind: 'checkbox', name: 'syncopeProdromes', value: 'severe_dyspnea', onchange: 'handleSyncopeWarningChange(this)', title: 'หายใจหอบเหนื่อย หรือหายใจไม่อิ่ม', desc: 'รู้สึกเหนื่อยหอบรุนแรงหรืออึดอัดหายใจไม่ทันก่อนที่จะหมดสติ' },
        { kind: 'checkbox', name: 'syncopeProdromes', value: 'thunderclap_headache', onchange: 'handleSyncopeWarningChange(this)', title: 'ปวดศีรษะรุนแรงเฉียบพลันก่อนหมดสติ', desc: 'อยู่ดีๆ ก็ปวดศีรษะรุนแรงขึ้นมาทันทีก่อนที่จะวูบหมดสติไป' },
        { kind: 'checkbox', name: 'syncopeProdromes', value: 'hyperventilation_tingling', onchange: 'handleSyncopeWarningChange(this)', title: 'หายใจหอบเร็ว ชารอบปาก หรือชาปลายมือ', desc: 'มักเกิดร่วมกับความเครียด ตกใจกลัว หรือร้องไห้หนักก่อนมีอาการ' },
        { kind: 'checkbox', name: 'syncopeProdromes', value: 'aura_epigastric_olfactory', onchange: 'handleSyncopeWarningChange(this)', title: 'จุกแน่นในท้องลอยขึ้นคอ หรือได้กลิ่นแปลกๆ', desc: 'รู้สึกโหวงหรือจุกแน่นจากลิ้นปี่ลอยขึ้นคอ ได้กลิ่นแปลกประหลาด หรือเห็นแสงวูบวาบ', colSpan2: true }
      ])}
    </div>

    <div class="pt-3 border-t border-slate-100">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">2.2 ลักษณะการเคลื่อนไหวของร่างกายขณะเกิดเหตุ</label>
      <div class="grid grid-cols-1 gap-2.5">
        ${renderSyncopeCard({ name: 'syncopeMotorCategory', value: 'limp_flaccid', onchange: 'handleSyncopeMotorCategoryChange()', title: 'ตัวอ่อนปวกเปียกล้มลง ไม่มีการเกร็งกระตุก', desc: 'หมดสติตัวอ่อนพับลงเฉยๆ โดยไม่มีอาการเกร็งแข็งหรือกระตุก' })}
        ${renderSyncopeCard({ name: 'syncopeMotorCategory', value: 'abnormal_movements', onchange: 'handleSyncopeMotorCategoryChange()', title: 'มีอาการเกร็ง กระตุก หรือเคลื่อนไหวผิดปกติ', desc: 'พบอาการกระตุก เกร็ง มือจีบ หรือดิ้นสะบัดขณะหมดสติ' })}
        <div id="syncopeMotorSubWrap" class="hidden bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
          <span class="font-semibold text-slate-800 block">ลักษณะการเกร็งหรือกระตุกที่สังเกตพบ:</span>
          ${renderSyncopeGrid('grid-cols-1 sm:grid-cols-2', [
            { name: 'syncopeMotorSign', value: 'brief_myoclonic_jerks', title: 'กระตุกเบาๆ สั้นๆ ไม่กี่ครั้งหลังล้มลง', desc: 'กระตุกสั้นๆ เพียง 5–15 วินาทีหลังจากล้มลงไปแล้ว', compact: true, bgWhite: true },
            { name: 'syncopeMotorSign', value: 'generalized_tonic_clonic', title: 'เกร็งแข็งและกระตุกรุนแรงทั้งตัวต่อเนื่องเป็นนาที', desc: 'ตัวแข็งเกร็งแล้วกระตุกพร้อมกันทั้งตัวนานเป็นนาที', compact: true, bgWhite: true },
            { name: 'syncopeMotorSign', value: 'carpopedal_spasm', title: 'มือจีบเกร็งทั้งสองข้าง นิ้วมืองุ้มเข้าหากัน', desc: 'ข้อมือและนิ้วมือทั้งสองข้างเกร็งจีบ หรือเกร็งปลายเท้างุ้ม', compact: true, bgWhite: true },
            { name: 'syncopeMotorSign', value: 'thrashing_closed_eyes', title: 'ดิ้นสะบัดไปมา ส่ายศีรษะ หรือหลับตาแน่น', desc: 'แขนขาสะบัดไม่พร้อมกัน ส่ายศีรษะ หรือแอ่นลำตัวขณะหลับตา', compact: true, bgWhite: true },
            { name: 'syncopeMotorSign', value: 'unknown_unobserved', title: 'ไม่ทราบแน่ชัด (ไม่ได้สังเกต)', colSpan2: true, compact: true, bgWhite: true }
          ])}
        </div>
      </div>
    </div>

    <div class="pt-3 border-t border-slate-100">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">2.3 อาการร่วมที่สังเกตเห็นขณะเกิดเหตุ (เลือกได้หลายข้อ)</label>
      ${renderSyncopeGrid('grid-cols-1 sm:grid-cols-2', [
        { kind: 'checkbox', name: 'syncopeSigns', value: 'syncope_marked_pallor_sweat', title: 'ใบหน้าซีดเผือด ตัวเย็น เหงื่อออกชุ่ม', desc: 'สังเกตเห็นหน้าซีดขาว มือเท้าเย็น และเหงื่อออกเปียกชุ่มตัว' },
        { kind: 'checkbox', name: 'syncopeSigns', value: 'syncope_cyanosis_apnea', title: 'ริมฝีปากเขียวคล้ำ หรือหยุดหายใจชั่วขณะ', desc: 'สังเกตเห็นปากเขียว หน้าคล้ำ หรือมีเสียงหายใจครืดคราด' },
        { kind: 'checkbox', name: 'syncopeSigns', value: 'syncope_lateral_tongue_bite', title: 'กัดลิ้น หรือมีเลือดออกในปาก', desc: 'มีแผลกัดที่ลิ้น กระพุ้งแก้ม หรือมีน้ำลายปนเลือด' },
        { kind: 'checkbox', name: 'syncopeSigns', value: 'syncope_eyes_open_deviated', title: 'ตาค้าง หรือตาเหลือกเบนไปข้างเดียว', desc: 'ลูกตาเหลือกค้างขึ้นด้านบน หรือหันเบนค้างไปด้านซ้ายหรือขวา' },
        { kind: 'checkbox', name: 'syncopeSigns', value: 'syncope_incontinence', title: 'ปัสสาวะราด หรืออุจจาระราด', desc: 'ไม่สามารถกลั้นปัสสาวะหรืออุจจาระได้ในขณะหมดสติ', colSpan2: true }
      ])}
    </div>
  </div>
</div>`;

const SYNCOPE_CARD3_HTML = `
<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
  <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
    <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="rotate-ccw" class="w-5 h-5"></i></div>
    <div>
      <h2 class="text-base font-bold text-slate-900">3. การฟื้นคืนสติ อาการผิดปกติหลังฟื้น และการบาดเจ็บจากการล้ม</h2>
      <p class="text-xs text-slate-500 font-sans">Recovery Phase, Post-Event Symptoms &amp; Fall Trauma</p>
    </div>
  </div>
  <div class="space-y-5">
    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">3.1 สภาพความรู้สึกตัว "หลังจากเริ่มฟื้นตื่นแล้ว" (เมื่อลืมตาขึ้นมาแล้ว รู้เรื่องเป็นปกติทันทีหรือไม่?)</label>
      <p class="text-[11px] text-slate-500 mb-2.5">หมายเหตุ: ข้อนี้ถามถึงอาการ <strong>หลังจากผู้ป่วยเริ่มฟื้นตื่นแล้ว</strong> ว่าสมองโล่งรู้เรื่องทันทีหรือยังงง/ซึมอยู่นาน (ต่างจากข้อ 1.4 ที่ถามว่าสลบไปนานกี่นาที)</p>
      ${renderSyncopeGrid('grid-cols-1 sm:grid-cols-3', [
        { name: 'syncopeRecoveryPattern', value: 'rapid_spontaneous', onchange: 'updateSyncopeRecoveryContext()', title: 'ฟื้นแล้วรู้เรื่องทันที ไม่งง ไม่สับสน', desc: 'ทันทีที่ตื่นขึ้นมา สามารถพูดคุยโต้ตอบ รู้วันเวลาสถานที่ และจำเรื่องราวก่อนวูบได้เป็นปกติภายใน 1–2 นาที' },
        { name: 'syncopeRecoveryPattern', value: 'prolonged_confusion', onchange: 'updateSyncopeRecoveryContext()', title: 'ตื่นแล้วแต่ยังสับสน มึนงง หรือหลับต่อ', desc: 'พ้นช่วงหมดสติ/ชักแล้ว แต่หลังจากฟื้นขึ้นมายังถามซ้ำๆ พูดจาสับสน จำเหตุการณ์ไม่ได้ หรือซึมหลับลึกต่อนานเกิน 5 นาที' },
        { name: 'syncopeRecoveryPattern', value: 'persistent_drowsy_coma', onchange: 'updateSyncopeRecoveryContext()', title: 'ยังมีอาการสับสน มึนงง ปลุกยากจนถึงขณะนี้', desc: 'จนถึงขณะนี้ผู้ป่วยยังไม่ตื่นรู้เรื่องเป็นปกติ ยังสับสน มึนงง ซึมมาก หรือต้องปลุกกระตุ้นจึงจะตอบสนอง' }
      ])}
    </div>

    <div id="syncopePostSymptomsSectionWrap" class="pt-3 border-t border-slate-100">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">3.2 อาการผิดปกติที่ยังคงมีอยู่หลังฟื้นคืนสติ (เลือกได้หลายข้อ)</label>
      ${renderSyncopeGrid('grid-cols-1 sm:grid-cols-2', [
        { kind: 'checkbox', name: 'syncopePostSymptoms', value: 'post_focal_weakness', onchange: 'handleSyncopePostSymptomChange(this)', title: 'แขนขาอ่อนแรง ปากเบี้ยว หรือพูดไม่ชัด', desc: 'ยกแขนหรือขาข้างใดข้างหนึ่งไม่ขึ้น ชาครึ่งซีก มุมปากตก หรือพูดอ้อแอ้' },
        { kind: 'checkbox', name: 'syncopePostSymptoms', value: 'post_ongoing_chestpain', onchange: 'handleSyncopePostSymptomChange(this)', title: 'ยังคงเจ็บแน่นหน้าอก หอบเหนื่อย หรือใจสั่นต่อเนื่อง', desc: 'ฟื้นแล้วแต่ยังรู้สึกแน่นหน้าอก หายใจไม่อิ่ม หรือหัวใจเต้นรัวไม่หยุด' },
        { kind: 'checkbox', name: 'syncopePostSymptoms', value: 'post_orthostatic_intolerance', onchange: 'handleSyncopePostSymptomChange(this)', title: 'หน้ามืดจะเป็นลมซ้ำทันทีเมื่อพยายามลุกนั่งหรือยืน', desc: 'นอนราบแล้วดีขึ้น แต่พอลุกขึ้นนั่งหรือยืนจะหน้ามืดวูบซ้ำทันที' },
        { kind: 'checkbox', name: 'syncopePostSymptoms', value: 'post_severe_abdpain_melena', onchange: 'handleSyncopePostSymptomChange(this)', title: 'ปวดท้องรุนแรง หรือปวดร้าวไปที่หลัง', desc: 'มีอาการปวดบิดเกร็งในท้อง ท้องอืดตึง หรือปวดร้าวทะลุกลางหลัง' },
        { kind: 'checkbox', name: 'syncopePostSymptoms', value: 'post_severe_headache', onchange: 'handleSyncopePostSymptomChange(this)', title: 'ปวดศีรษะรุนแรงต่อเนื่อง', desc: 'มีอาการปวดศีรษะตุ๊บๆ หรือปวดตื้อรุนแรงหลังจากฟื้น' },
        { kind: 'checkbox', name: 'syncopePostSymptoms', value: 'post_diffuse_muscle_pain', onchange: 'handleSyncopePostSymptomChange(this)', title: 'ปวดเมื่อยหรือระบมกล้ามเนื้อทั่วตัว', desc: 'รู้สึกปวดตึงระบมกล้ามเนื้อแขนขาและลำตัวหลังจากเกร็งกระตุก' },
        { kind: 'checkbox', name: 'syncopePostSymptoms', value: 'post_none_asymptomatic', onchange: 'handleSyncopePostSymptomChange(this)', title: 'ไม่มีอาการผิดปกติหลังฟื้น (หรืออ่อนเพลียเล็กน้อย)', desc: 'เมื่อเลือกข้อนี้ ระบบจะยกเลิกอาการผิดปกติข้ออื่นอัตโนมัติ', colSpan2: true }
      ])}
    </div>

    <div class="pt-3 border-t border-slate-100">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">3.3 การบาดเจ็บจากการล้มหรือกระแทกพื้นในครั้งนี้</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        ${renderSyncopeCard({ name: 'syncopeFallInjury', value: 'no', onchange: 'handleSyncopeFallInjuryChange()', title: 'ไม่มีการบาดเจ็บจากการล้ม', desc: 'มีคนช่วยประคองไว้ทัน หรือค่อยๆ ทรุดตัวลงโดยไม่ได้กระแทกพื้น' })}
        ${renderSyncopeCard({ name: 'syncopeFallInjury', value: 'yes', onchange: 'handleSyncopeFallInjuryChange()', title: 'มีการบาดเจ็บจากการล้มกระแทกพื้น', desc: 'ศีรษะหรือร่างกายกระแทกพื้น มีแผล หรือมีอาการปวดบวม' })}
      </div>
      <div id="syncopeFallInjuryDetailWrap" class="hidden bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-2.5 space-y-3 text-xs">
        <span class="font-semibold text-slate-800 block">ลักษณะและตำแหน่งการบาดเจ็บ (เลือกได้หลายข้อ):</span>
        ${renderSyncopeGrid('grid-cols-1 sm:grid-cols-3', [
          { kind: 'checkbox', id: 'syncope_fall_head_impact', title: 'ศีรษะหรือใบหน้ากระแทกพื้น', compact: true, bgWhite: true },
          { kind: 'checkbox', id: 'syncope_fall_open_wound', title: 'มีบาดแผลฉีกขาด หรือมีเลือดออก', compact: true, bgWhite: true },
          { kind: 'checkbox', id: 'syncope_fall_limb_pain', title: 'ปวดบวม ฟกช้ำ หรือผิดรูปบริเวณแขนขา/ลำตัว', compact: true, bgWhite: true }
        ])}
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">ระบุตำแหน่งบาดเจ็บเพิ่มเติม (ถ้ามี):</label>
          <input type="text" id="syncopeFallInjuryDetailText" placeholder="เช่น คิ้วขวาแตก, ท้ายทอยโน, ปวดข้อมือซ้าย..." class="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-medical-500 placeholder:text-slate-400">
        </div>
      </div>
    </div>
  </div>
</div>`;

const SYNCOPE_CARD4_HTML = `
<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
  <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
    <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="shield-alert" class="w-5 h-5"></i></div>
    <div>
      <h2 class="text-base font-bold text-slate-900">4. ปัจจัยเสี่ยงสำคัญ ประวัติการใช้ยา และข้อมูลเฉพาะสตรี</h2>
      <p class="text-xs text-slate-500 font-sans">Cardiac Risk, Volume Depletion, Medications &amp; Female History</p>
    </div>
  </div>
  <div class="space-y-5">
    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">4.1 ประวัติความเสี่ยงทางหัวใจ การเสียเลือด และเหตุการณ์นำก่อนวูบ (เลือกได้หลายข้อ)</label>
      ${renderSyncopeGrid('grid-cols-1 sm:grid-cols-2', [
        { kind: 'checkbox', name: 'syncopeRiskFactors', value: 'known_heart_disease', onchange: 'handleSyncopeRiskChange(this)', title: 'มีโรคหัวใจเดิม หรือเคยผ่าตัดหัวใจ', desc: 'เช่น โรคหลอดเลือดหัวใจตีบ กล้ามเนื้อหัวใจหนา หัวใจล้มเหลว หรือลิ้นหัวใจตีบ' },
        { kind: 'checkbox', name: 'syncopeRiskFactors', value: 'known_arrhythmia_pacemaker', onchange: 'handleSyncopeRiskChange(this)', title: 'มีภาวะหัวใจเต้นผิดจังหวะ หรือใส่เครื่องกระตุ้นหัวใจ', desc: 'เคยตรวจพบหัวใจเต้นผิดจังหวะ หรือใส่เครื่องกระตุ้นหัวใจไว้ที่หน้าอก' },
        { kind: 'checkbox', name: 'syncopeRiskFactors', value: 'family_sudden_death_young', onchange: 'handleSyncopeRiskChange(this)', title: 'มีคนในครอบครัวสายตรงเสียชีวิตกะทันหันตั้งแต่อายุน้อย', desc: 'พ่อ แม่ พี่น้อง หรือลูก เสียชีวิตกะทันหันโดยไม่ทราบสาเหตุก่อนอายุ 50 ปี' },
        { kind: 'checkbox', name: 'syncopeRiskFactors', value: 'recent_bp_med_adjustment', onchange: 'handleSyncopeRiskChange(this)', title: 'เพิ่งเริ่มทานยาความดัน ยาขับปัสสาวะ หรือเพิ่งปรับเพิ่มขนาดยา', desc: 'เพิ่งเปลี่ยนยาหรือเพิ่มขนาดยาลดความดันโลหิต ยาขับปัสสาวะ หรือยาต่อมลูกหมาก' },
        { kind: 'checkbox', name: 'syncopeRiskFactors', value: 'suspected_gi_bleeding', onchange: 'handleSyncopeRiskChange(this)', title: 'ถ่ายอุจจาระดำ ถ่ายเป็นเลือด หรืออาเจียนเป็นเลือด', desc: 'มีอาการถ่ายดำเหนียวเหมือนยางมะตอย ถ่ายปนเลือดสด หรืออาเจียนมีเลือดปน' },
        { kind: 'checkbox', name: 'syncopeRiskFactors', value: 'dehydration_diarrhea', onchange: 'handleSyncopeRiskChange(this)', title: 'ท้องเสีย อาเจียน ดื่มน้ำน้อย หรือเสียเหงื่อมากก่อนวูบ', desc: 'มีภาวะสูญเสียน้ำในร่างกาย หรืออดอาหารและน้ำก่อนเกิดอาการ' },
        { kind: 'checkbox', name: 'syncopeRiskFactors', value: 'known_diabetes_insulin', onchange: 'handleSyncopeRiskChange(this)', title: 'เป็นโรคเบาหวานที่ฉีดอินซูลินหรือทานยาลดน้ำตาล', desc: 'โดยเฉพาะกรณีทานอาหารน้อยกว่าปกติหรือผิดเวลา' },
        { kind: 'checkbox', name: 'syncopeRiskFactors', value: 'known_epilepsy_seizure', onchange: 'handleSyncopeRiskChange(this)', title: 'เคยมีประวัติโรคลมชัก หรือเคยวูบหมดสติซ้ำหลายครั้ง', desc: 'เคยได้รับการวินิจฉัยโรคลมชัก หรือเคยวูบเป็นลมมาแล้วตั้งแต่ 2 ครั้งขึ้นไป' },
        { kind: 'checkbox', name: 'syncopeRiskFactors', value: 'none_unremarkable', onchange: 'handleSyncopeRiskChange(this)', title: 'ไม่มีปัจจัยเสี่ยงดังกล่าวข้างต้น', colSpan2: true, compact: true }
      ])}
    </div>

    <div id="syncopeFemaleSection" class="hidden pt-4 border-t border-slate-100 space-y-4">
      <div class="p-3 bg-pink-50 border border-pink-200 rounded-xl text-xs text-pink-900">
        <strong>4.2 เฉพาะผู้ป่วยหญิง:</strong> ข้อมูลประจำเดือนและการตั้งครรภ์สำคัญอย่างยิ่งต่อการคัดกรองภาวะเสียเลือดภายในช่องท้องหรือการตั้งครรภ์นอกมดลูก
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">สถานะประจำเดือนและการตั้งครรภ์</label>
        ${renderSyncopeGrid('grid-cols-1 sm:grid-cols-2', [
          { name: 'syncopePregnancyStatus', value: 'not_pregnant', onchange: 'handleSyncopePregnancyChange()', title: 'ประจำเดือนมาตามปกติ / ไม่ได้ตั้งครรภ์', compact: true },
          { name: 'syncopePregnancyStatus', value: 'missed_period', onchange: 'handleSyncopePregnancyChange()', title: 'ขาดประจำเดือน หรือสงสัยว่าอาจตั้งครรภ์', compact: true },
          { name: 'syncopePregnancyStatus', value: 'pregnant', onchange: 'handleSyncopePregnancyChange()', title: 'กำลังตั้งครรภ์', compact: true },
          { name: 'syncopePregnancyStatus', value: 'postpartum_6w', onchange: 'handleSyncopePregnancyChange()', title: 'เพิ่งคลอดบุตร หรือแท้งบุตรภายใน 6 สัปดาห์ที่ผ่านมา', compact: true },
          { name: 'syncopePregnancyStatus', value: 'menopause_hysterectomy', onchange: 'handleSyncopePregnancyChange()', title: 'วัยหมดประจำเดือน หรือผ่าตัดมดลูกแล้ว', compact: true },
          { name: 'syncopePregnancyStatus', value: 'unsure', onchange: 'handleSyncopePregnancyChange()', title: 'ไม่แน่ใจ / จำไม่ได้', compact: true }
        ])}
        <div id="syncopePregnancyWeeksWrap" class="hidden mt-2.5 bg-slate-50 border border-slate-200 rounded-xl p-3">
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">อายุครรภ์โดยประมาณ</label>
          <input type="text" id="syncopePregnancyWeeks" placeholder="ระบุอายุครรภ์ เช่น 8 สัปดาห์" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 placeholder:text-slate-400">
        </div>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">อาการทางสูตินรีเวชที่พบร่วมด้วย (เลือกได้หลายข้อ)</label>
        ${renderSyncopeGrid('grid-cols-1 sm:grid-cols-2', [
          { kind: 'checkbox', id: 'syncope_fem_lower_abd_pain', title: 'ปวดหน่วงหรือปวดบิดเกร็งบริเวณท้องน้อย', compact: true },
          { kind: 'checkbox', id: 'syncope_fem_pv_bleeding', title: 'มีเลือดออกผิดปกติทางช่องคลอด', compact: true }
        ])}
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">วันแรกของประจำเดือนครั้งสุดท้าย (LMP)</label>
        <input type="text" id="syncopeLmpDate" data-universal-date="true" placeholder="วว/ดด/ปปปป (dd/mm/yyyy)" class="w-full sm:w-72 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white placeholder:text-slate-400">
      </div>
    </div>
  </div>
</div>`;

const SYNCOPE_FORM_HTML = `
<div id="syncopeQuestionnaireSection" class="hidden space-y-6">
  <div data-cc-top-banner="syncope"><div class="flex flex-col gap-4">
  <div class="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-start space-x-3">
    <i data-lucide="info" class="w-5 h-5 text-sky-700 mt-0.5 flex-shrink-0"></i>
    <div class="text-xs text-sky-900 leading-relaxed space-y-1">
      <div class="font-bold">ข้อแนะนำการดูแลความปลอดภัยเบื้องต้นระหว่างรอพบแพทย์</div>
      <p>1. <strong>นั่งพักหรือนอนราบและห้ามลุกยืนเร็วๆ:</strong> หากยังรู้สึกหน้ามืดวิงเวียน ให้นอนราบหนุนขาสูงเล็กน้อย และห้ามเดินไปเข้าห้องน้ำตามลำพังเพื่อป้องกันการวูบล้มศีรษะกระแทกซ้ำ</p>
      <p>2. <strong>งดน้ำและอาหารไว้ก่อนชั่วคราว:</strong> เพื่อความปลอดภัยเผื่อกรณีต้องตรวจพิเศษหรือให้การรักษาฉุกเฉิน</p>
      <p>3. <strong>แจ้งพยาบาลหน้าห้องตรวจทันที:</strong> หากมีอาการ <strong>วูบซ้ำ เจ็บแน่นหน้าอก ใจสั่นรัว หายใจหอบเหนื่อย ปวดท้องรุนแรง ปากเบี้ยว แขนขาอ่อนแรง หรือเริ่มซึมลง</strong></p>
    </div>
  </div>
  </div></div>

  ${SYNCOPE_CARD1_HTML}
  ${SYNCOPE_CARD2_HTML}
  ${SYNCOPE_CARD3_HTML}
  ${SYNCOPE_CARD4_HTML}

  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-3 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="message-square-plus" class="w-5 h-5"></i></div>
      <div>
        <h2 class="text-base font-bold text-slate-900">อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2>
        <p class="text-xs text-slate-500 font-sans">Additional Symptoms or Concerns (ระบุอิสระ)</p>
      </div>
    </div>
    <textarea id="syncope_other_free" rows="2" placeholder="ระบุรายละเอียดหรือข้อสังเกตเพิ่มเติมที่ต้องการแจ้งแพทย์หรือพยาบาล..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white placeholder:text-slate-400"></textarea>
  </div>
</div>`;

const syncopeModule = {
  id: 'syncope',
  recordCc: 'syncope',
  titleTh: 'หมดสติ / วูบ / เป็นลม',
  titleEn: 'Syncope / Blackout / Collapse',
  sectionDomId: 'syncopeQuestionnaireSection',
  pmhSectionNumber: 5,
  getPmhSectionNumber: () => 5,
  doctorCcBadgeHtml: '<i data-lucide="sparkles" class="w-3 h-3 mr-1"></i> CC: หมดสติ / วูบ / เป็นลม (Syncope / TLOC)',
  dateFields: ['syncopeLmpDate'],
  branchIds: [
    'syncopeExertionSubWrap',
    'syncopeRestingSubWrap',
    'syncopePostureOtherWrap',
    'syncopeUnconsciousDurationWrap',
    'syncopeDurationGte5mWrap',
    'syncopeEpisodeCountWrap',
    'syncopeMotorSubWrap',
    'syncopeFallInjuryDetailWrap',
    'syncopeFemaleSection',
    'syncopePregnancyWeeksWrap'
  ],
  inputIdsToClear: [
    'syncopeDurationVal',
    'syncopePostureOtherText',
    'syncopeDurationGte5mVal',
    'syncopeEpisodeCountVal',
    'syncopeFallInjuryDetailText',
    'syncopePregnancyWeeks',
    'syncopeLmpDate',
    'syncope_other_free'
  ],
  formHtml: SYNCOPE_FORM_HTML,

  algorithm: {
    id: 'syncope',
    titleTh: 'หมดสติ / วูบ / เป็นลม',
    titleEn: 'Syncope / Blackout / Collapse',
    triageLevelRules: [
      { level: 1, criteria: 'Continuous unconsciousness / persistent coma, Syncope with acute chest pain / severe dyspnea / cyanosis, Exertional cardiac collapse, Suspected ruptured ectopic pregnancy with shock, Prolonged seizure >= 5 min' },
      { level: 2, criteria: 'Exertional syncope (especially during active exertion), Supine/resting syncope, Sudden collapse without prodrome, Palpitations before syncope, Thunderclap headache / focal neuro deficit, Known structural heart disease / arrhythmia / pacemaker / family SCD < 50y, Suspected GI bleed / severe orthostatic intolerance, Secondary head trauma, Recurrent cluster syncope' },
      { level: 3, criteria: 'First-time unexplained syncope or atypical presyncope without cardiac or hemorrhagic red flags' },
      { level: 4, criteria: 'Typical vasovagal / situational / mild orthostatic syncope with clear prodrome, rapid spontaneous full recovery, and zero red flags' }
    ]
  },

  onTitleChange(arg) {
    syncSyncopeFemaleSection(isSyncopeFemaleTitle(arg));
  },

  onSelectForm() {
    syncSyncopeFemaleSection();
    updateSyncopeRecoveryContext();
  },

  onActivate(patient) {
    if (patient && (patient.gender === 'หญิง' || patient.gender === 'ชาย')) {
      syncSyncopeFemaleSection(patient.gender === 'หญิง');
    } else {
      syncSyncopeFemaleSection();
    }
    updateSyncopeRecoveryContext();
  },

  resetForm() {
    clearSyncopeRadioGroup('syncopeReporter');
    clearSyncopeRadioGroup('syncopePosture');
    clearSyncopeRadioGroup('syncopeExertionTiming');
    clearSyncopeRadioGroup('syncopeRestingPosition');
    clearSyncopeRadioGroup('syncopeConsciousnessLevel');
    clearSyncopeRadioGroup('syncopeUnconsciousDuration');
    clearSyncopeRadioGroup('syncopeEpisodeCount');
    clearSyncopeRadioGroup('syncopeMotorCategory');
    clearSyncopeRadioGroup('syncopeMotorSign');
    clearSyncopeRadioGroup('syncopeRecoveryPattern');
    clearSyncopeRadioGroup('syncopeFallInjury');
    clearSyncopeRadioGroup('syncopePregnancyStatus');
    document.querySelectorAll('input[name="syncopeProdromes"], input[name="syncopeSigns"], input[name="syncopePostSymptoms"], input[name="syncopeRiskFactors"]').forEach(cb => {
      cb.checked = false;
    });
    clearSyncopeCheckboxes([
      'syncope_fall_head_impact',
      'syncope_fall_open_wound',
      'syncope_fall_limb_pain',
      'syncope_fem_lower_abd_pain',
      'syncope_fem_pv_bleeding'
    ]);
    this.branchIds.forEach(bId => toggleSyncopeBranch(bId, false));
    toggleSyncopeBranch('syncopePostSymptomsSectionWrap', true);
    this.inputIdsToClear.forEach(iId => {
      const el = document.getElementById(iId);
      if (el) el.value = '';
    });
    const unitEl = document.getElementById('syncopeDurationUnit');
    if (unitEl) unitEl.value = 'hours';
  },

  seedPatients: [
    {
      id: 'case-095',
      queue_number: 'A-095',
      hn: '6709841',
      name: 'นายเกริกเกียรติ สว่างวงศ์',
      age: 48,
      gender: 'ชาย',
      chief_complaint: 'syncope',
      chief_complaint_title: 'หมดสติ / วูบ / เป็นลม',
      status: 'waiting',
      timestamp: '2026-10-26T02:11:26.425Z',
      durationVal: 1,
      durationUnit: 'hours',
      syncopeReporter: 'both_patient_witness',
      syncopePosture: 'during_exertion',
      syncopeExertionTiming: 'during_active_exertion',
      syncopeRestingPosition: '',
      syncopePostureOtherText: '',
      syncopeConsciousnessLevel: 'true_syncope',
      syncopeUnconsciousDuration: 'brief_seconds',
      syncopeDurationGte5mVal: '',
      syncopeEpisodeCount: 'single',
      syncopeEpisodeCountVal: 1,
      syncopeProdromes: ['sudden_palpitation', 'chest_pain_pressure'],
      syncopeMotorCategory: 'abnormal_movements',
      syncopeMotorSign: 'brief_myoclonic_jerks',
      syncopeSigns: ['syncope_marked_pallor_sweat'],
      syncopeRecoveryPattern: 'rapid_spontaneous',
      syncopePostSymptoms: ['post_ongoing_chestpain'],
      syncopeFallInjury: 'yes',
      syncope_fall_head_impact: true,
      syncope_fall_open_wound: true,
      syncope_fall_limb_pain: false,
      syncopeFallInjuryDetailText: 'คิ้วขวาแตก',
      syncopeRiskFactors: ['known_heart_disease', 'family_sudden_death_young'],
      syncopePregnancyStatus: 'not_applicable',
      syncopePregnancyWeeks: '',
      syncope_fem_lower_abd_pain: false,
      syncope_fem_pv_bleeding: false,
      syncopeLmpDate: '',
      otherSymptomsFree: 'หมดสติขณะกำลังวิ่งจ็อกกิ้งรอบสวนสาธารณะ มีอาการใจสั่นรัวและแน่นหน้าอกนำ ล้มหน้ากระแทกพื้นมีแผลคิ้วแตก',
      hospRecordStatus: 'ratchaburi',
      underlying: ['โรคหลอดเลือดหัวใจตีบ (CAD s/p PCI 2 ปีก่อน)', 'ไขมันในเลือดสูง (DLP)'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Aspirin 81 mg 1x1 pc, Atorvastatin 40 mg 1x1 hs, Metoprolol 50 mg 1/2x2 pc',
      doctor_notes: {
        additional_hpi: 'ชาย 48 ปี ประวัติ CAD เคยทำบอลลูน 2 ปีก่อน ขณะวิ่งจ็อกกิ้ง 15 นาที เกิดใจสั่นรัวและแน่นหน้าอกร้าวกรามซ้าย หน้ามืดหมดสติล้มคิ้วขวาแตก กระตุกสั้นๆ 3-4 ครั้ง 10 วินาที ฟื้นสติไม่งงแต่ยังแน่นหน้าอกต่อเนื่อง',
        physical_exam: 'BT 36.6 C, PR 112/min (irregular), RR 20/min, BP 98/62 mmHg, SpO2 96% RA. 2.5 cm laceration at right eyebrow. Alert, motor V all.',
        preliminary_dx: 'Exertional Cardiac Syncope (Ventricular Arrhythmia / ACS) with Facial Laceration',
        plan: 'Telemetry monitor, STAT 12-lead EKG (NSVT / ST depression V4-V6), Hs-Troponin-I, Electrolytes, urgent Cardiology consult & CCU'
      }
    },
    {
      id: 'case-096',
      queue_number: 'A-096',
      hn: '6709952',
      name: 'น.ส.แพรวพรรณ โสภณพิทักษ์',
      age: 21,
      gender: 'หญิง',
      chief_complaint: 'syncope',
      chief_complaint_title: 'หมดสติ / วูบ / เป็นลม',
      status: 'waiting',
      timestamp: '2026-10-26T01:56:26.425Z',
      durationVal: 1,
      durationUnit: 'hours',
      syncopeReporter: 'both_patient_witness',
      syncopePosture: 'prolonged_standing',
      syncopeExertionTiming: '',
      syncopeRestingPosition: '',
      syncopePostureOtherText: '',
      syncopeConsciousnessLevel: 'true_syncope',
      syncopeUnconsciousDuration: 'brief_seconds',
      syncopeDurationGte5mVal: '',
      syncopeEpisodeCount: 'single',
      syncopeEpisodeCountVal: 1,
      syncopeProdromes: ['lightheaded_tunnel_vision', 'cold_sweat_pallor_nausea'],
      syncopeMotorCategory: 'limp_flaccid',
      syncopeMotorSign: 'limp_flaccid',
      syncopeSigns: ['syncope_marked_pallor_sweat'],
      syncopeRecoveryPattern: 'rapid_spontaneous',
      syncopePostSymptoms: ['post_none_asymptomatic'],
      syncopeFallInjury: 'no',
      syncope_fall_head_impact: false,
      syncope_fall_open_wound: false,
      syncope_fall_limb_pain: false,
      syncopeFallInjuryDetailText: '',
      syncopeRiskFactors: ['none_unremarkable'],
      syncopePregnancyStatus: 'not_pregnant',
      syncopePregnancyWeeks: '',
      syncope_fem_lower_abd_pain: false,
      syncope_fem_pv_bleeding: false,
      syncopeLmpDate: '10/10/2026',
      otherSymptomsFree: 'ยืนเข้าแถวกลางแดดนาน ร้อนอบอ้าว เพื่อนช่วยพยุงตัวลง ไม่ศีรษะกระแทก',
      hospRecordStatus: 'self',
      underlying: ['ปฏิเสธ'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'ไม่มี',
      doctor_notes: {
        additional_hpi: 'หญิง 21 ปี ยืนเข้าแถวกลางแดดเกือบ 45 นาที อากาศร้อน ดื่มน้ำน้อย หน้ามืดตาพร่า เหงื่อแตกตัวเย็น แล้วตัวอ่อนล้มพับ เพื่อนประคองลง หมดสติ 15-20 วินาที ฟื้นรู้เรื่องทันที ไม่งง ไม่มีบาดเจ็บ',
        physical_exam: 'BT 36.8 C, PR 72/min, RR 16/min, BP 106/68 mmHg, SpO2 99% RA. No orthostatic drop. Neuro intact, no trauma.',
        preliminary_dx: 'Simple Vasovagal / Reflex Syncope (Low Risk)',
        plan: 'Reassurance, ORS hydration, 12-lead EKG baseline normal, counterpressure maneuver education, discharge'
      }
    },
    {
      id: 'case-097',
      queue_number: 'A-097',
      hn: '6710063',
      name: 'นายอัครเดช บวรเกียรติ',
      age: 33,
      gender: 'ชาย',
      chief_complaint: 'syncope',
      chief_complaint_title: 'หมดสติ / วูบ / เป็นลม',
      status: 'waiting',
      timestamp: '2026-10-26T01:31:26.425Z',
      durationVal: 2,
      durationUnit: 'hours',
      syncopeReporter: 'both_patient_witness',
      syncopePosture: 'supine_or_resting',
      syncopeExertionTiming: '',
      syncopeRestingPosition: 'while_sitting_resting',
      syncopePostureOtherText: '',
      syncopeConsciousnessLevel: 'true_syncope',
      syncopeUnconsciousDuration: 'typical_minutes',
      syncopeDurationGte5mVal: '',
      syncopeEpisodeCount: 'single',
      syncopeEpisodeCountVal: 1,
      syncopeProdromes: ['aura_epigastric_olfactory'],
      syncopeMotorCategory: 'abnormal_movements',
      syncopeMotorSign: 'generalized_tonic_clonic',
      syncopeSigns: ['syncope_cyanosis_apnea', 'syncope_lateral_tongue_bite', 'syncope_incontinence', 'syncope_eyes_open_deviated'],
      syncopeRecoveryPattern: 'prolonged_confusion',
      syncopePostSymptoms: ['post_diffuse_muscle_pain', 'post_severe_headache'],
      syncopeFallInjury: 'no',
      syncope_fall_head_impact: false,
      syncope_fall_open_wound: false,
      syncope_fall_limb_pain: false,
      syncopeFallInjuryDetailText: '',
      syncopeRiskFactors: ['known_epilepsy_seizure'],
      syncopePregnancyStatus: 'not_applicable',
      syncopePregnancyWeeks: '',
      syncope_fem_lower_abd_pain: false,
      syncope_fem_pv_bleeding: false,
      syncopeLmpDate: '',
      otherSymptomsFree: 'หมดสติขณะนั่งทำงาน เพื่อนเห็นเกร็งกระตุกทั้งตัว ตาเหลือก กัดลิ้นเลือดออก มีปัสสาวะราด ฟื้นแล้วงงมาก',
      hospRecordStatus: 'self',
      underlying: ['โรคลมชัก (Epilepsy - ขาดยา 3 วัน)'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Sodium Valproate 500 mg 1x2 pc (ขาดยา 3 วัน)',
      doctor_notes: {
        additional_hpi: 'ชาย 33 ปี U/D Epilepsy ขาดยากันชัก 3 วัน ขณะนั่งทำงานรู้สึกโหวงในท้องลอยขึ้นคอและได้กลิ่นไหม้ แล้วชักเกร็งกระตุกทั้งตัว 2 นาที ตาเหลือก กัดลิ้น ปัสสาวะราด หลังฟื้นสับสนหลับลึกนานกว่า 20 นาที',
        physical_exam: 'BT 37.1 C, PR 88/min, RR 18/min, BP 124/78 mmHg, DTX 114 mg/dL. Post-ictal drowsiness E4V4M6. 1 cm laceration left lateral tongue.',
        preliminary_dx: 'Generalized Tonic-Clonic Seizure (Breakthrough due to missed Valproate)',
        plan: 'Airway monitoring, CBC, Electrolytes, Ca, Mg, Valproic acid level, IV Valproate loading, compliance counseling'
      }
    },
    {
      id: 'case-098',
      queue_number: 'A-098',
      hn: '6710174',
      name: 'น.ส.กมลวรรณ ธนสารเจริญ',
      age: 27,
      gender: 'หญิง',
      chief_complaint: 'syncope',
      chief_complaint_title: 'หมดสติ / วูบ / เป็นลม',
      status: 'waiting',
      timestamp: '2026-10-26T02:06:26.425Z',
      durationVal: 2,
      durationUnit: 'hours',
      syncopeReporter: 'both_patient_witness',
      syncopePosture: 'sudden_standing',
      syncopeExertionTiming: '',
      syncopeRestingPosition: '',
      syncopePostureOtherText: '',
      syncopeConsciousnessLevel: 'true_syncope',
      syncopeUnconsciousDuration: 'brief_seconds',
      syncopeDurationGte5mVal: '',
      syncopeEpisodeCount: 'single',
      syncopeEpisodeCountVal: 1,
      syncopeProdromes: ['lightheaded_tunnel_vision', 'cold_sweat_pallor_nausea'],
      syncopeMotorCategory: 'limp_flaccid',
      syncopeMotorSign: 'limp_flaccid',
      syncopeSigns: ['syncope_marked_pallor_sweat'],
      syncopeRecoveryPattern: 'rapid_spontaneous',
      syncopePostSymptoms: ['post_severe_abdpain_melena', 'post_orthostatic_intolerance'],
      syncopeFallInjury: 'no',
      syncope_fall_head_impact: false,
      syncope_fall_open_wound: false,
      syncope_fall_limb_pain: false,
      syncopeFallInjuryDetailText: '',
      syncopeRiskFactors: [],
      syncopePregnancyStatus: 'missed_period',
      syncopePregnancyWeeks: '',
      syncope_fem_lower_abd_pain: true,
      syncope_fem_pv_bleeding: true,
      syncopeLmpDate: '12/09/2026',
      otherSymptomsFree: 'ปวดท้องน้อยรุนแรงร้าวสะบักขวา ขาดประจำเดือน 6 สัปดาห์ ลุกจากเตียงแล้ววูบล้ม หน้ามืดซ้ำตลอดเวลานั่ง',
      hospRecordStatus: 'self',
      underlying: ['ปฏิเสธ'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'ไม่มี',
      doctor_notes: {
        additional_hpi: 'หญิง 27 ปี ขาดประจำเดือน 6 สัปดาห์ ปวดบิดท้องน้อยขวาร้าวสะบักขวา ลุกยืนแล้วหน้ามืดเหงื่อแตกวูบหมดสติ 20-30 วินาที ฟื้นแล้วยังหน้ามืดเมื่อลุกนั่ง มีเลือดออกกะปริบกะปรอยทางช่องคลอด',
        physical_exam: 'BT 36.4 C, PR 118/min, BP 86/52 mmHg, SpO2 97% RA. Marked pallor, RLQ & suprapubic guarding with rebound tenderness.',
        preliminary_dx: 'Hemorrhagic Shock secondary to Ruptured Ectopic Pregnancy',
        plan: 'Code Shock Red, 2 large-bore IV NSS bolus, STAT Urine Pregnancy Test, FAST POCUS (hemoperitoneum), Crossmatch 4U PRC, STAT OB-GYN'
      }
    }
  ],

  hydrateForm(patient) {
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val !== undefined && val !== null ? val : '';
    };
    const setChk = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.checked = Boolean(val);
    };

    setVal('syncopeDurationVal', patient.durationVal || '');
    const unitEl = document.getElementById('syncopeDurationUnit');
    if (unitEl) unitEl.value = patient.durationUnit || 'hours';

    setSyncopeRadioChecked('syncopeReporter', patient.syncopeReporter);
    setSyncopeRadioChecked('syncopePosture', patient.syncopePosture);
    handleSyncopePostureChange();
    if (patient.syncopePosture === 'during_exertion' && patient.syncopeExertionTiming) {
      setSyncopeRadioChecked('syncopeExertionTiming', patient.syncopeExertionTiming);
    }
    if (patient.syncopePosture === 'supine_or_resting' && patient.syncopeRestingPosition) {
      setSyncopeRadioChecked('syncopeRestingPosition', patient.syncopeRestingPosition);
    }
    if (patient.syncopePosture === 'other') {
      setVal('syncopePostureOtherText', patient.syncopePostureOtherText || '');
    }

    setSyncopeRadioChecked('syncopeConsciousnessLevel', patient.syncopeConsciousnessLevel);
    handleSyncopeConsciousnessLevelChange();
    if (patient.syncopeConsciousnessLevel === 'true_syncope') {
      const mappedDur = patient.syncopeUnconsciousDuration === 'typical_1_to_2m' ? 'typical_minutes' : patient.syncopeUnconsciousDuration;
      setSyncopeRadioChecked('syncopeUnconsciousDuration', mappedDur);
      handleSyncopeUnconsciousDurationChange();
      if (mappedDur === 'prolonged_gte_5m') {
        setVal('syncopeDurationGte5mVal', patient.syncopeDurationGte5mVal || '');
      }
    }

    setSyncopeRadioChecked('syncopeEpisodeCount', patient.syncopeEpisodeCount);
    handleSyncopeEpisodeCountChange();
    if (patient.syncopeEpisodeCount === 'multiple_cluster') {
      setVal('syncopeEpisodeCountVal', patient.syncopeEpisodeCountVal || '');
    }

    document.querySelectorAll('input[name="syncopeProdromes"]').forEach(cb => {
      cb.checked = Array.isArray(patient.syncopeProdromes) && patient.syncopeProdromes.includes(cb.value);
    });

    setSyncopeRadioChecked('syncopeMotorCategory', patient.syncopeMotorCategory);
    handleSyncopeMotorCategoryChange();
    if (patient.syncopeMotorCategory === 'abnormal_movements') {
      setSyncopeRadioChecked('syncopeMotorSign', patient.syncopeMotorSign);
    }

    const signsArr = Array.isArray(patient.syncopeSigns) ? patient.syncopeSigns : [];
    document.querySelectorAll('input[name="syncopeSigns"]').forEach(cb => {
      cb.checked = signsArr.includes(cb.value);
    });

    setSyncopeRadioChecked('syncopeRecoveryPattern', patient.syncopeRecoveryPattern);
    updateSyncopeRecoveryContext();

    const postArr = Array.isArray(patient.syncopePostSymptoms) ? patient.syncopePostSymptoms : [];
    document.querySelectorAll('input[name="syncopePostSymptoms"]').forEach(cb => {
      cb.checked = postArr.includes(cb.value);
    });

    // Fall injury hydration (supporting explicit field + legacy head_facial sign)
    const derivedFall = patient.syncopeFallInjury
      ? patient.syncopeFallInjury
      : (signsArr.includes('syncope_head_facial_injury') ? 'yes' : 'no');
    if (derivedFall === 'yes' || derivedFall === 'no') {
      setSyncopeRadioChecked('syncopeFallInjury', derivedFall);
    }
    handleSyncopeFallInjuryChange();
    if (derivedFall === 'yes') {
      setChk('syncope_fall_head_impact', Boolean(patient.syncope_fall_head_impact || signsArr.includes('syncope_head_facial_injury')));
      setChk('syncope_fall_open_wound', patient.syncope_fall_open_wound);
      setChk('syncope_fall_limb_pain', patient.syncope_fall_limb_pain);
      setVal('syncopeFallInjuryDetailText', patient.syncopeFallInjuryDetailText || '');
    }

    const risksArr = Array.isArray(patient.syncopeRiskFactors) ? patient.syncopeRiskFactors : [];
    document.querySelectorAll('input[name="syncopeRiskFactors"]').forEach(cb => {
      cb.checked = risksArr.includes(cb.value);
    });

    // Female section (C-AP13)
    const isFem = patient.gender === 'หญิง' || isSyncopeFemaleTitle();
    syncSyncopeFemaleSection(isFem);
    if (isFem) {
      let pregStat = patient.syncopePregnancyStatus;
      if (!pregStat || pregStat === 'not_applicable') {
        if (patient.syncope_lmp_status === 'pregnant') pregStat = 'pregnant';
        else if (patient.syncope_lmp_status === 'missed_period' || risksArr.includes('female_missed_period')) pregStat = 'missed_period';
        else if (patient.syncope_lmp_status === 'menopause') pregStat = 'menopause_hysterectomy';
        else if (patient.syncope_lmp_status === 'exact_date') pregStat = 'not_pregnant';
      }
      if (pregStat && pregStat !== 'not_applicable') {
        setSyncopeRadioChecked('syncopePregnancyStatus', pregStat);
      }
      handleSyncopePregnancyChange();
      if (pregStat === 'pregnant') {
        setVal('syncopePregnancyWeeks', patient.syncopePregnancyWeeks || '');
      }
      setChk('syncope_fem_lower_abd_pain', patient.syncope_fem_lower_abd_pain);
      setChk('syncope_fem_pv_bleeding', patient.syncope_fem_pv_bleeding);
      setVal('syncopeLmpDate', patient.syncopeLmpDate || '');
    }

    setVal('syncope_other_free', patient.otherSymptomsFree || '');
  },

  collectIntake(ctx) {
    const {
      recordId,
      queueNumber,
      randomHn,
      patientName,
      patientAge,
      gender,
      recordStatus,
      hospRecordStatus,
      underlying,
      drugAllergy,
      currentMeds,
      preservedDoctorNotes,
      otherSymptomsFree
    } = ctx;

    const rawDur = parseFloat(document.getElementById('syncopeDurationVal')?.value);
    const durationVal = (!isNaN(rawDur) && rawDur > 0) ? rawDur : null;
    const durationUnit = document.getElementById('syncopeDurationUnit')?.value || 'hours';

    const syncopeReporter = getSyncopeRadioValue('syncopeReporter') || 'unspecified';
    const syncopePosture = getSyncopeRadioValue('syncopePosture') || 'unspecified';
    const syncopeExertionTiming = syncopePosture === 'during_exertion'
      ? (getSyncopeRadioValue('syncopeExertionTiming') || 'during_active_exertion')
      : '';
    const syncopeRestingPosition = syncopePosture === 'supine_or_resting'
      ? (getSyncopeRadioValue('syncopeRestingPosition') || 'while_lying_supine')
      : '';
    const syncopePostureOtherText = syncopePosture === 'other'
      ? (document.getElementById('syncopePostureOtherText')?.value.trim() || '')
      : '';

    const syncopeConsciousnessLevel = getSyncopeRadioValue('syncopeConsciousnessLevel') || 'unspecified';
    const syncopeUnconsciousDuration = syncopeConsciousnessLevel === 'true_syncope'
      ? (getSyncopeRadioValue('syncopeUnconsciousDuration') || 'unspecified')
      : 'brief_seconds';
    const syncopeDurationGte5mVal = (syncopeConsciousnessLevel === 'true_syncope' && syncopeUnconsciousDuration === 'prolonged_gte_5m')
      ? (parseInt(document.getElementById('syncopeDurationGte5mVal')?.value, 10) || null)
      : null;

    const syncopeEpisodeCount = getSyncopeRadioValue('syncopeEpisodeCount') || 'unspecified';
    const syncopeEpisodeCountVal = syncopeEpisodeCount === 'multiple_cluster'
      ? (parseInt(document.getElementById('syncopeEpisodeCountVal')?.value, 10) || 2)
      : 1;

    const syncopeProdromes = Array.from(document.querySelectorAll('input[name="syncopeProdromes"]:checked')).map(cb => cb.value);
    const syncopeMotorCategory = getSyncopeRadioValue('syncopeMotorCategory') || 'unspecified';
    const syncopeMotorSign = syncopeMotorCategory === 'abnormal_movements'
      ? (getSyncopeRadioValue('syncopeMotorSign') || 'unknown_unobserved')
      : (syncopeMotorCategory === 'limp_flaccid' ? 'limp_flaccid' : 'unspecified');

    const syncopeSigns = Array.from(document.querySelectorAll('input[name="syncopeSigns"]:checked')).map(cb => cb.value);

    const syncopeRecoveryPattern = getSyncopeRadioValue('syncopeRecoveryPattern') || 'unspecified';
    const stillUnconscious = (syncopeConsciousnessLevel === 'true_syncope' && syncopeUnconsciousDuration === 'continuous_unconscious') ||
      syncopeRecoveryPattern === 'persistent_drowsy_coma';
    const syncopePostSymptoms = stillUnconscious
      ? []
      : Array.from(document.querySelectorAll('input[name="syncopePostSymptoms"]:checked')).map(cb => cb.value);

    const syncopeFallInjury = getSyncopeRadioValue('syncopeFallInjury') || 'unspecified';
    const syncope_fall_head_impact = syncopeFallInjury === 'yes' && (document.getElementById('syncope_fall_head_impact')?.checked || false);
    const syncope_fall_open_wound = syncopeFallInjury === 'yes' && (document.getElementById('syncope_fall_open_wound')?.checked || false);
    const syncope_fall_limb_pain = syncopeFallInjury === 'yes' && (document.getElementById('syncope_fall_limb_pain')?.checked || false);
    const syncopeFallInjuryDetailText = syncopeFallInjury === 'yes'
      ? (document.getElementById('syncopeFallInjuryDetailText')?.value.trim() || '')
      : '';

    const syncopeRiskFactors = Array.from(document.querySelectorAll('input[name="syncopeRiskFactors"]:checked')).map(cb => cb.value);

    const isFem = gender === 'หญิง' || isSyncopeFemaleTitle();
    const syncopePregnancyStatus = isFem ? (getSyncopeRadioValue('syncopePregnancyStatus') || '') : 'not_applicable';
    const syncopePregnancyWeeks = (isFem && syncopePregnancyStatus === 'pregnant')
      ? (document.getElementById('syncopePregnancyWeeks')?.value.trim() || '')
      : '';
    const syncope_fem_lower_abd_pain = isFem && (document.getElementById('syncope_fem_lower_abd_pain')?.checked || false);
    const syncope_fem_pv_bleeding = isFem && (document.getElementById('syncope_fem_pv_bleeding')?.checked || false);
    const syncopeLmpDate = isFem ? (document.getElementById('syncopeLmpDate')?.value.trim() || '') : '';

    return {
      id: recordId,
      queue_number: queueNumber,
      hn: randomHn,
      name: patientName,
      age: patientAge,
      gender: gender,
      chief_complaint: 'syncope',
      chief_complaint_title: 'หมดสติ / วูบ / เป็นลม',
      status: recordStatus,
      timestamp: new Date().toISOString(),
      durationVal,
      durationUnit,
      syncopeReporter,
      syncopePosture,
      syncopeExertionTiming,
      syncopeRestingPosition,
      syncopePostureOtherText,
      syncopeConsciousnessLevel,
      syncopeUnconsciousDuration,
      syncopeDurationGte5mVal,
      syncopeEpisodeCount,
      syncopeEpisodeCountVal,
      syncopeProdromes,
      syncopeMotorCategory,
      syncopeMotorSign,
      syncopeSigns,
      syncopeRecoveryPattern,
      syncopePostSymptoms,
      syncopeFallInjury,
      syncope_fall_head_impact,
      syncope_fall_open_wound,
      syncope_fall_limb_pain,
      syncopeFallInjuryDetailText,
      syncopeRiskFactors,
      syncopePregnancyStatus,
      syncopePregnancyWeeks,
      syncope_fem_lower_abd_pain,
      syncope_fem_pv_bleeding,
      syncopeLmpDate,
      otherSymptomsFree: otherSymptomsFree || '',
      hospRecordStatus: hospRecordStatus || 'unspecified',
      underlying: underlying && underlying.length > 0 ? underlying : ((hospRecordStatus === 'self' || hospRecordStatus === 'additional') ? ['ปฏิเสธ'] : []),
      drugAllergy: drugAllergy || 'ไม่ได้ระบุ',
      currentMeds: currentMeds || 'ไม่ได้ระบุ',
      doctor_notes: preservedDoctorNotes
    };
  },

  isRedFlag(p) {
    return evaluateSyncopeRedFlags(p).length > 0;
  },

  evaluateRedFlags(patient) {
    return evaluateSyncopeRedFlags(patient);
  },

  updateOutputs(patient) {
    return updateSyncopeOutputs(patient);
  }
};

if (typeof registerCcModule === 'function') {
  registerCcModule(syncopeModule);
} else if (typeof window !== 'undefined' && typeof window.registerCcModule === 'function') {
  window.registerCcModule(syncopeModule);
}

if (typeof window !== 'undefined') {
  window.toggleSyncopeBranch = toggleSyncopeBranch;
  window.handleSyncopePostureChange = handleSyncopePostureChange;
  window.updateSyncopeRecoveryContext = updateSyncopeRecoveryContext;
  window.handleSyncopeConsciousnessLevelChange = handleSyncopeConsciousnessLevelChange;
  window.handleSyncopeUnconsciousDurationChange = handleSyncopeUnconsciousDurationChange;
  window.handleSyncopeEpisodeCountChange = handleSyncopeEpisodeCountChange;
  window.handleSyncopeWarningChange = handleSyncopeWarningChange;
  window.handleSyncopeMotorCategoryChange = handleSyncopeMotorCategoryChange;
  window.handleSyncopePostSymptomChange = handleSyncopePostSymptomChange;
  window.handleSyncopeFallInjuryChange = handleSyncopeFallInjuryChange;
  window.handleSyncopeRiskChange = handleSyncopeRiskChange;
  window.handleSyncopePregnancyChange = handleSyncopePregnancyChange;
}
