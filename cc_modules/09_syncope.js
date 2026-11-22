// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 09_syncope.js
// อาการนำ: หมดสติ / วูบ / เป็นลม (Syncope / Blackout / Collapse — Golden 4-Card UX)
// ปรับปรุงตาม SKILL_PLAN_CC (P-AP1–P-AP14) และ SKILL_CODE_CC (C-AP1–C-AP20)
// รองรับการเรียกร่วมกับ 08_seizure.js (calculateSheldonScore & evaluateHyperventilationScreen)
// =========================================================================

function wrapSyncWords(...chunks) {
  return chunks.map(c => `<span class="inline-block whitespace-nowrap">${c}</span>`).join(' ');
}

function toggleSyncopeBranch(id, show) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('hidden', !show);
}

function renderSyncopeCard(cfg) {
  const {
    kind = 'radio', id = '', name = '', value = '', title,
    desc = '', onchange = '', wrapId = '', compact = false, bgWhite = false
  } = cfg;
  const wrapAttr = wrapId ? `id="${wrapId}" ` : '';
  const idAttr = id ? `id="${id}" ` : '';
  const nameAttr = name ? `name="${name}" ` : '';
  const valAttr = value ? `value="${value}" ` : '';
  const chgAttr = onchange ? `onchange="${onchange}" ` : '';
  const alignCls = desc ? 'items-start' : 'items-center';
  const padCls = compact ? 'p-2.5' : 'p-3';
  const bgCls = bgWhite ? 'bg-white ' : '';
  const roundCls = kind === 'checkbox' ? 'rounded ' : '';
  const topCls = desc ? 'mt-0.5 ' : '';
  const mlCls = compact ? 'ml-2' : 'ml-3';
  const szCls = compact ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const titleCls = compact ? 'text-xs' : 'text-xs sm:text-sm';
  const bodyHtml = desc
    ? `<div class="${mlCls} leading-snug"><span class="block ${titleCls} font-semibold text-slate-800">${title}</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">${desc}</span></div>`
    : `<span class="${mlCls} ${titleCls} font-semibold text-slate-800 leading-snug">${title}</span>`;
  return `<label ${wrapAttr}class="selectable-card ${bgCls}flex ${alignCls} ${padCls} rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition"><input type="${kind}" ${idAttr}${nameAttr}${valAttr}${chgAttr}class="${topCls}${roundCls}text-medical-600 focus:ring-medical-500 ${szCls} flex-shrink-0">${bodyHtml}</label>`;
}

function renderSyncopeGrid(colsCls, items, shared = {}) {
  return `<div class="grid ${colsCls} gap-2.5">${items.map(it => renderSyncopeCard({ ...shared, ...it })).join('\n')}</div>`;
}

function renderSyncSysHeader({ icon, iconBg, iconColor, title, noneId, noneLabel = 'ไม่มีอาการในหมวดนี้', noneOnchange }) {
  return `<div class="flex flex-wrap items-center justify-between gap-2 mb-2.5">
    <div class="flex items-center space-x-2">
      <span class="inline-flex items-center justify-center w-6 h-6 rounded-lg ${iconBg} ${iconColor} flex-shrink-0"><i data-lucide="${icon}" class="w-3.5 h-3.5"></i></span>
      <span class="text-xs font-bold text-slate-700">${title}</span>
    </div>
    <label class="inline-flex items-center px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:border-medical-300 cursor-pointer transition">
      <input type="checkbox" id="${noneId}" onchange="${noneOnchange}" class="rounded text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 flex-shrink-0">
      <span class="ml-2 text-xs font-semibold text-slate-800 whitespace-nowrap">${noneLabel}</span>
    </label>
  </div>`;
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

function handleSyncopeExactTimeUnknownChange() {
  const unk = Boolean(document.getElementById('syncopeExactTimeUnknown')?.checked);
  toggleSyncopeBranch('syncopeExactTimeWrap', !unk);
  if (unk) {
    const tEl = document.getElementById('syncopeExactTime');
    if (tEl) tEl.value = '';
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
  const recVal = getSyncopeRadioValue('syncopeRecoveryPattern');
  const isContinuous = consLevel === 'true_syncope' && durVal === 'continuous_unconscious';
  const stillComa = isContinuous || recVal === 'persistent_drowsy_coma';

  toggleSyncopeBranch('syncopeUnconsciousContextNotice', isContinuous);
  ['syncopeRecOptWrap_rapid', 'syncopeRecOptWrap_confused'].forEach(id => {
    toggleSyncopeBranch(id, !isContinuous);
  });

  if (isContinuous && recVal && recVal !== 'persistent_drowsy_coma') {
    clearSyncopeRadioGroup('syncopeRecoveryPattern');
  }

  toggleSyncopeBranch('syncopePostSymptomsSectionWrap', !stillComa);
  if (stillComa) {
    document.querySelectorAll('input[name="syncopePostSymptoms"]').forEach(cb => { cb.checked = false; });
    const postNone = document.getElementById('syncope_post_none');
    if (postNone) postNone.checked = false;
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

function handleSyncopeProdromeNoneChange() {
  const noneEl = document.getElementById('syncope_prodrome_none');
  if (noneEl && noneEl.checked) {
    document.querySelectorAll('input[name="syncopeProdromes"]').forEach(cb => { cb.checked = false; });
  }
}

function handleSyncopeWarningChange(el) {
  if (!el) return;
  const noneEl = document.getElementById('syncope_prodrome_none');
  if (el.checked && noneEl) noneEl.checked = false;
  if (el.checked && el.value === 'unknown') {
    document.querySelectorAll('input[name="syncopeProdromes"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  } else if (el.checked) {
    document.querySelectorAll('input[name="syncopeProdromes"]').forEach(cb => {
      if (cb.value === 'unknown') cb.checked = false;
    });
  }
}

function handleSyncopeMotorCategoryChange() {
  const val = getSyncopeRadioValue('syncopeMotorCategory');
  const isAbnormal = val === 'abnormal_movements';
  toggleSyncopeBranch('syncopeMotorSubWrap', isAbnormal);
  if (!isAbnormal) clearSyncopeRadioGroup('syncopeMotorSign');
}

function handleSyncopeSignsNoneChange() {
  if (!document.getElementById('syncope_signs_none')?.checked) return;
  document.querySelectorAll('input[name="syncopeSigns"]').forEach(cb => { cb.checked = false; });
}

function handleSyncopeSignsItemChange(el) {
  if (el && el.checked) {
    const noneEl = document.getElementById('syncope_signs_none');
    if (noneEl) noneEl.checked = false;
  }
}

function handleSyncopePostNoneChange() {
  if (!document.getElementById('syncope_post_none')?.checked) return;
  document.querySelectorAll('input[name="syncopePostSymptoms"]').forEach(cb => { cb.checked = false; });
}

function handleSyncopePostSymptomChange(el) {
  if (el && el.checked) {
    const noneCb = document.getElementById('syncope_post_none');
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

function handleSyncopeRiskNoneChange() {
  if (!document.getElementById('syncope_risk_none')?.checked) return;
  document.querySelectorAll('input[name="syncopeRiskFactors"]').forEach(cb => { cb.checked = false; });
}

function handleSyncopeRiskChange(el) {
  if (el && el.checked) {
    const noneEl = document.getElementById('syncope_risk_none');
    if (noneEl) noneEl.checked = false;
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

// --- Lookup Tables (Thai Labels — 100% Zero Raw Enum Leaks, C-AP14 / C-AP19) ---
const SYNCOPE_LABELS = {
  units: { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' },
  reporter: {
    patient_self: 'ผู้ป่วยให้ข้อมูลเอง',
    witness_relative: 'ญาติหรือผู้เห็นเหตุการณ์เป็นผู้เล่า',
    both_patient_witness: 'ผู้ป่วยและผู้เห็นเหตุการณ์ร่วมกันให้ข้อมูล',
    unspecified: 'ไม่ได้ระบุ'
  },
  posture: {
    prolonged_standing: 'ยืนนาน หรืออยู่ในที่ร้อนแออัด',
    sudden_standing: 'ลุกยืนหรือเปลี่ยนท่าเร็ว',
    during_exertion: 'ขณะออกแรงหรือออกกำลังกาย',
    supine_or_resting: 'ขณะพักผ่อนอยู่เฉยๆ',
    standing_or_walking_normal: 'ขณะยืนหรือเดินตามปกติ',
    micturition_defecation: 'ขณะหรือหลังปัสสาวะ ขับถ่าย กลืน หรือไอแรง',
    neck_movement: 'ขณะหันศีรษะ เงยหน้า หรือสวมเสื้อคอแน่น',
    other: 'อื่นๆ',
    unspecified: 'ไม่ได้ระบุ'
  },
  exertionTiming: {
    during_active_exertion: 'ระหว่างกำลังออกแรงหรือออกกำลังกาย',
    immediately_post_exertion: 'หยุดออกกำลังกายกะทันหันก่อนแล้วจึงมีอาการ',
    unspecified: ''
  },
  restingPosition: {
    while_lying_supine: 'ขณะนอน (Supine)',
    while_sitting_resting: 'ขณะนั่งพักอยู่เฉยๆ',
    unspecified: ''
  },
  consciousLevel: {
    true_syncope: 'หมดสติไม่รู้สึกตัว (True Syncope / TLOC)',
    near_syncope: 'เกือบหมดสติ / แค่วูบหน้ามืด (Near-Syncope)',
    unspecified: 'ไม่ได้ระบุ'
  },
  lossDuration: {
    brief_seconds: 'สั้นมาก (< 1 นาที ประมาณ 10–30 วินาที)',
    typical_minutes: 'ประมาณ 1–4 นาที',
    typical_1_to_2m: 'ประมาณ 1–2 นาที',
    prolonged_gte_5m: 'ตั้งแต่ 5 นาทีขึ้นไป',
    continuous_unconscious: 'ยังไม่ฟื้นสติจนถึงขณะนี้',
    unknown_unobserved: 'ไม่ทราบระยะเวลา',
    not_applicable: 'ไม่หมดสติเต็มที่ (เกือบหมดสติ/หน้ามืด)',
    unspecified: 'ไม่ได้ระบุ'
  },
  prodrome: {
    none_sudden: 'ไม่มีอาการเตือน ล้มหมดสติทันที',
    lightheaded_tunnel_vision: 'หน้ามืด ตาพร่ามัว หรือหูอื้อ',
    cold_sweat_pallor_nausea: 'เหงื่อแตก ตัวเย็น หรือหน้าซีดคลื่นไส้',
    sudden_palpitation: 'ใจสั่นรัว หรือหัวใจเต้นสะดุด',
    chest_pain_pressure: 'เจ็บแน่นหน้าอก หรือปวดร้าวกราม/หลัง',
    severe_dyspnea: 'หายใจหอบเหนื่อย หรือหายใจไม่อิ่ม',
    thunderclap_headache: 'ปวดศีรษะรุนแรงเฉียบพลันก่อนหมดสติ',
    hyperventilation_tingling: 'หายใจหอบเร็ว หรือชารอบปากและปลายมือ',
    aura_epigastric_olfactory: 'จุกในท้องลอยขึ้นคอ ได้กลิ่นแปลก หรือเห็นแสงวาบ (Aura)',
    unknown: 'ไม่ทราบ / จำไม่ได้',
    unspecified: 'ไม่ได้ระบุ'
  },
  motorSign: {
    brief_myoclonic_jerks: 'กระตุกเบาๆ สั้นๆ หลังล้ม (Convulsive Syncope)',
    generalized_tonic_clonic: 'เกร็งแข็งและกระตุกทั้งตัวเป็นนาที (GTCS)',
    carpopedal_spasm: 'มือจีบเกร็งทั้งสองข้าง (Carpopedal spasm)',
    thrashing_closed_eyes: 'ดิ้นสะบัด หรือส่ายหน้าหลับตาแน่น',
    unknown_unobserved: 'ไม่ทราบ / ไม่ได้สังเกต',
    limp_flaccid: 'ตัวอ่อนปวกเปียก ไม่เกร็งกระตุก',
    unspecified: 'ไม่ได้ระบุ'
  },
  recovery: {
    rapid_spontaneous: 'ฟื้นแล้วรู้เรื่องทันที ไม่งง (ภายใน 1–2 นาที)',
    prolonged_confusion: 'ตื่นแล้วยังสับสน มึนงง หรือหลับต่อนานเกิน 5 นาที',
    persistent_drowsy_coma: 'ยังไม่ตื่น หรือซึมปลุกยากจนถึงขณะนี้',
    unspecified: 'ไม่ได้ระบุ'
  },
  postSymptom: {
    post_focal_weakness: 'แขนขาอ่อนแรง ปากเบี้ยว หรือพูดไม่ชัดหลังฟื้น',
    post_ongoing_chestpain: 'ยังเจ็บแน่นหน้าอก หอบ หรือใจสั่นต่อเนื่องหลังฟื้น',
    post_orthostatic_intolerance: 'หน้ามืดจะเป็นลมซ้ำทันทีเมื่อลุกนั่งหรือยืน',
    post_severe_abdpain_melena: 'ปวดท้องรุนแรงหรือปวดร้าวหลัง',
    post_severe_headache: 'ปวดศีรษะรุนแรงต่อเนื่องหลังฟื้น',
    post_diffuse_muscle_pain: 'ปวดเมื่อยระบมกล้ามเนื้อทั่วตัวหลังฟื้น',
    post_severe_headache_myalgia: 'ปวดศีรษะรุนแรงและปวดเมื่อยระบมกล้ามเนื้อทั่วตัว',
    post_mild_fatigue: 'อ่อนเพลียเล็กน้อยหลังฟื้น',
    post_none_asymptomatic: 'ไม่มีอาการผิดปกติหลังฟื้นคืนสติ',
    none: 'ไม่มีอาการผิดปกติหลังฟื้นคืนสติ'
  },
  riskFactor: {
    known_heart_disease: 'มีโรคหัวใจเดิมหรือเคยผ่าตัดหัวใจ',
    known_arrhythmia_pacemaker: 'ภาวะหัวใจเต้นผิดจังหวะหรือใส่เครื่องกระตุ้นหัวใจ (Pacemaker/ICD)',
    family_sudden_death_young: 'ประวัติครอบครัวเสียชีวิตกะทันหันอายุน้อย (< 50 ปี)',
    recent_bp_med_adjustment: 'เพิ่งเริ่มหรือปรับเพิ่มยาความดัน/ยาขับปัสสาวะ',
    dehydration_diarrhea: 'ท้องเสีย อาเจียน ดื่มน้ำน้อย หรือขาดน้ำมาก',
    suspected_gi_bleeding: 'ถ่ายดำ ถ่ายเป็นเลือดสด หรืออาเจียนเป็นเลือด',
    diabetic_on_meds: 'เป็นเบาหวานฉีดอินซูลินหรือทานยาลดน้ำตาล',
    known_diabetes_insulin: 'เป็นเบาหวานฉีดอินซูลินหรือทานยาลดน้ำตาล',
    known_epilepsy_seizure: 'เป็นโรคลมชักหรือเคยวูบซ้ำบ่อย',
    recurrent_syncope_history: 'เคยวูบ เป็นลม หรือหมดสติซ้ำตั้งแต่ 2 ครั้งขึ้นไป',
    female_missed_period: 'ขาดประจำเดือนหรือสงสัยตั้งครรภ์',
    none_unremarkable: 'ไม่มีปัจจัยเสี่ยงสำคัญทางหัวใจหรือการเสียเลือด'
  },
  pregnancy: {
    not_pregnant: 'ไม่ได้ตั้งครรภ์ / ประจำเดือนปกติ',
    missed_period: 'ขาดประจำเดือน / สงสัยอาจตั้งครรภ์',
    pregnant: 'กำลังตั้งครรภ์',
    postpartum_6w: 'เพิ่งคลอดหรือแท้งภายใน 6 สัปดาห์',
    menopause_hysterectomy: 'หมดประจำเดือน / ผ่าตัดมดลูกแล้ว',
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

  if (signs.includes('syncope_head_facial_injury') || (patient.syncopeFallInjury === 'yes' && patient.syncope_fall_head_impact)) {
    redFlags.push({
      key: 'syncope_head_injury',
      textTh: 'มีศีรษะหรือใบหน้ากระแทกพื้นจากการล้มหมดสติ (Secondary Head Injury)',
      risk: 'เสี่ยงเลือดออกในกะโหลกศีรษะจากการล้มหมดสติโดยไม่ทันป้องกันตัว ประเมินตามเกณฑ์ส่ง CT Brain'
    });
  }

  if (patient.syncopeEpisodeCount === 'multiple_cluster') {
    redFlags.push({
      key: 'syncope_cluster',
      textTh: `มีอาการวูบหรือหมดสติซ้ำหลายครั้งใน 24 ชม. (${patient.syncopeEpisodeCountVal ? `${patient.syncopeEpisodeCountVal} ครั้ง` : 'ตั้งแต่ 2 ครั้งขึ้นไป'})`,
      risk: 'บ่งชี้ความไม่คงที่ของการไหลเวียนเลือดสมองหรือหัวใจเต้นผิดจังหวะซ้ำ ต้องติดตามใกล้ชิด'
    });
  }

  return redFlags;
}

function updateSyncopeOutputs(patient) {
  const durationText = patient.durationVal
    ? `${patient.durationVal} ${SYNCOPE_LABELS.units[patient.durationUnit] || 'ชั่วโมง'}`
    : 'ไม่ได้ระบุระยะเวลา';
  const timeText = patient.syncopeExactTimeUnknown
    ? 'ไม่ทราบเวลาแน่ชัด'
    : (patient.syncopeExactTime ? `เวลา ${patient.syncopeExactTime} น.` : '');

  const { sheldon, hvs } = computeSyncopeSheldonAndHvs(patient);

  const reporterStr = SYNCOPE_LABELS.reporter[patient.syncopeReporter] || 'ไม่ได้ระบุ';
  let postureStr = SYNCOPE_LABELS.posture[patient.syncopePosture] || 'ไม่ได้ระบุ';
  if (patient.syncopePosture === 'during_exertion' && patient.syncopeExertionTiming) {
    const exStr = SYNCOPE_LABELS.exertionTiming[patient.syncopeExertionTiming];
    if (exStr) postureStr += ` (${exStr})`;
  } else if (patient.syncopePosture === 'supine_or_resting' && patient.syncopeRestingPosition) {
    const restStr = SYNCOPE_LABELS.restingPosition[patient.syncopeRestingPosition];
    if (restStr) postureStr = restStr;
  } else if (patient.syncopePosture === 'other' && patient.syncopePostureOtherText) {
    postureStr = `อื่นๆ (${patient.syncopePostureOtherText})`;
  }

  const consciousStr = SYNCOPE_LABELS.consciousLevel[patient.syncopeConsciousnessLevel] || 'ไม่ได้ระบุ';
  const durMinExtra = (patient.syncopeUnconsciousDuration === 'prolonged_gte_5m' && patient.syncopeDurationGte5mVal)
    ? ` (ประมาณ ${patient.syncopeDurationGte5mVal} นาที)`
    : '';
  const lossDurationStr = patient.syncopeConsciousnessLevel === 'true_syncope'
    ? `${SYNCOPE_LABELS.lossDuration[patient.syncopeUnconsciousDuration] || 'ไม่ได้ระบุ'}${durMinExtra}`
    : (patient.syncopeConsciousnessLevel === 'near_syncope' ? SYNCOPE_LABELS.lossDuration.not_applicable : 'ไม่ได้ระบุ');

  let episodeStr = 'ไม่ได้ระบุ';
  if (patient.syncopeEpisodeCount === 'single') {
    episodeStr = 'เกิดขึ้นเพียงครั้งเดียว';
  } else if (patient.syncopeEpisodeCount === 'multiple_cluster') {
    episodeStr = patient.syncopeEpisodeCountVal
      ? `เกิดซ้ำ ${patient.syncopeEpisodeCountVal} ครั้งใน 24 ชม.`
      : 'เกิดซ้ำตั้งแต่ 2 ครั้งขึ้นไป';
  }

  const prodromesRaw = Array.isArray(patient.syncopeProdromes) ? patient.syncopeProdromes : [];
  let prodromesStr = 'ไม่ได้ระบุ';
  if (patient.syncope_prodrome_none || prodromesRaw.includes('none_sudden')) {
    prodromesStr = SYNCOPE_LABELS.prodrome.none_sudden;
  } else if (prodromesRaw.length > 0) {
    prodromesStr = prodromesRaw.map(p => SYNCOPE_LABELS.prodrome[p] || p).join(', ');
  }

  let motorStr = 'ไม่ได้ระบุ';
  if (patient.syncopeMotorCategory === 'limp_flaccid') {
    motorStr = SYNCOPE_LABELS.motorSign.limp_flaccid;
  } else if (patient.syncopeMotorCategory === 'abnormal_movements') {
    motorStr = SYNCOPE_LABELS.motorSign[patient.syncopeMotorSign] || 'มีเกร็งกระตุกหรือเคลื่อนไหวผิดปกติ';
  }

  const recoveryStr = SYNCOPE_LABELS.recovery[patient.syncopeRecoveryPattern] || 'ไม่ได้ระบุ';

  const postSxRaw = Array.isArray(patient.syncopePostSymptoms) ? patient.syncopePostSymptoms : [];
  let postSxStr = 'ไม่ได้ระบุ';
  if (patient.syncope_post_none || postSxRaw.includes('post_none_asymptomatic')) {
    postSxStr = SYNCOPE_LABELS.postSymptom.post_none_asymptomatic;
  } else if (postSxRaw.length > 0) {
    postSxStr = postSxRaw.map(s => SYNCOPE_LABELS.postSymptom[s] || s).join(', ');
  }

  const signs = Array.isArray(patient.syncopeSigns) ? patient.syncopeSigns : [];
  const hasFallYes = patient.syncopeFallInjury === 'yes' || signs.includes('syncope_head_facial_injury');
  let fallStr = patient.syncopeFallInjury === 'no' ? 'ไม่มีการบาดเจ็บจากการล้ม' : 'ไม่ได้ระบุ';
  if (hasFallYes) {
    const fallParts = [];
    if (patient.syncope_fall_head_impact || signs.includes('syncope_head_facial_injury')) fallParts.push('ศีรษะหรือใบหน้ากระแทกพื้น');
    if (patient.syncope_fall_open_wound) fallParts.push('มีแผลฉีกขาดหรือเลือดออก');
    if (patient.syncope_fall_limb_pain) fallParts.push('ปวดบวมฟกช้ำหรือผิดรูป');
    if (patient.syncopeFallInjuryDetailText) fallParts.push(`ตำแหน่ง: ${patient.syncopeFallInjuryDetailText}`);
    fallStr = `มีการบาดเจ็บจากการล้ม (${fallParts.join(', ') || 'ระบุว่าบาดเจ็บ'})`;
  }

  // Zero-Default-Bias Positives & Negatives (P-AP14 / C-AP20)
  const positives = [];
  const negatives = [];

  if (patient.syncope_signs_none) {
    negatives.push('ไม่มีหน้าซีด ปากเขียว กัดลิ้น ตาค้าง หรือปัสสาวะอุจจาระราดขณะเกิดเหตุ');
  } else if (signs.length > 0) {
    if (signs.includes('syncope_marked_pallor_sweat')) positives.push('หน้าซีดเผือด ตัวเย็น เหงื่อออกชุ่มขณะเกิดเหตุ');
    else negatives.push('ไม่มีหน้าซีดเหงื่อออกชุ่มชัดเจน');

    if (signs.includes('syncope_cyanosis_apnea')) positives.push('ริมฝีปากเขียวคล้ำหรือหยุดหายใจชั่วขณะ');
    else negatives.push('ไม่มีริมฝีปากเขียวคล้ำหรือหยุดหายใจ');

    if (signs.includes('syncope_lateral_tongue_bite')) positives.push('กัดลิ้นหรือมีเลือดออกในปาก');
    else negatives.push('ไม่มีแผลกัดลิ้นหรือเลือดออกในปาก');

    if (signs.includes('syncope_eyes_open_deviated')) positives.push('ตาค้าง หรือตาเหลือกเบนไปข้างเดียว');
    else negatives.push('ไม่มีตาค้างหรือตาเหลือกเบน');

    if (signs.includes('syncope_incontinence')) positives.push('ปัสสาวะราดหรืออุจจาระราดขณะหมดสติ');
    else negatives.push('ไม่มีปัสสาวะหรืออุจจาระราด');
  }

  if (hasFallYes) positives.push(fallStr);
  else if (patient.syncopeFallInjury === 'no') negatives.push('ไม่มีบาดเจ็บหรือศีรษะกระแทกพื้นจากการล้ม');

  if (patient.syncope_post_none || postSxRaw.includes('post_none_asymptomatic')) {
    negatives.push('ไม่มีอาการผิดปกติหลังฟื้นคืนสติ');
  } else {
    postSxRaw.forEach(s => {
      if (s !== 'post_none_asymptomatic' && SYNCOPE_LABELS.postSymptom[s]) {
        positives.push(SYNCOPE_LABELS.postSymptom[s]);
      }
    });
  }

  const risksRaw = Array.isArray(patient.syncopeRiskFactors) ? patient.syncopeRiskFactors : [];
  const riskLabels = risksRaw
    .filter(r => r !== 'none_unremarkable')
    .map(r => SYNCOPE_LABELS.riskFactor[r] || r);
  riskLabels.forEach(rl => positives.push(rl));
  if (patient.syncope_risk_none || risksRaw.includes('none_unremarkable')) {
    negatives.push('ไม่มีปัจจัยเสี่ยงสำคัญทางหัวใจหรือการเสียเลือด');
  }
  const riskSummaryText = riskLabels.length > 0
    ? riskLabels.join(', ')
    : ((patient.syncope_risk_none || risksRaw.includes('none_unremarkable')) ? 'ปฏิเสธ' : 'ไม่ได้ระบุ');

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
หมดสติ / วูบ / เป็นลม (Syncope / TLOC Workup) มา ${durationText}${timeText ? ` (${timeText})` : ''}

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
`ผู้ป่วย [${patient.name || 'ไม่ระบุชื่อ'}] อายุ ${patient.age || '-'} ปี เพศ ${patient.gender || 'ไม่ระบุ'} มารับการตรวจที่ห้องฉุกเฉิน รพ.ราชบุรี ด้วยอาการหมดสติ / วูบ / เป็นลม มา ${durationText}${timeText ? ` (${timeText})` : ''} ให้ข้อมูลโดย [${reporterStr}]
เหตุการณ์: [${consciousStr}] เกิดเหตุขณะ [${postureStr}] อาการเตือนก่อนวูบ: [${prodromesStr}] ลักษณะขณะเกิดเหตุ: [${motorStr}] ระยะเวลาที่หมดสติ: [${lossDurationStr}] ความถี่: [${episodeStr}] การฟื้นคืนสติหลังตื่น: [${recoveryStr}] อาการหลังฟื้น: [${postSxStr}] การบาดเจ็บจากการล้ม: [${fallStr}]${femaleStr ? ` ประวัติสตรี: [${femaleStr}]` : ''}
การประเมินแยกโรค TLOC (Sheldon Score = ${sheldon.score}): ${sheldon.interpretation}; ${hvs.label}
อาการร่วมสำคัญที่พบ: ${positives.join(', ')}
อาการสำคัญที่ปฏิเสธ: ${patient.pertinentNegatives.join(', ')}
ประวัติสุขภาพและยา: [${hospLabel}], ปัจจัยเสี่ยง: ${riskSummaryText}, โรคประจำตัว: ${udList}, ยาประจำตัว: ${medsText}, แพ้ยา: ${allergyText}${effectiveRfs.length > 0 ? `\n[แจ้งเตือนความเสี่ยงสูง]: ${effectiveRfs.map(rf => rf.textTh).join('; ')}` : ''}

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
      event_time: timeText || null,
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
        total_count: patient.syncopeEpisodeCountVal || null
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
        status: patient.syncopeFallInjury || 'unspecified',
        head_facial_impact: Boolean(patient.syncope_fall_head_impact || signs.includes('syncope_head_facial_injury')),
        open_wound_bleeding: Boolean(patient.syncope_fall_open_wound),
        limb_or_trunk_pain_swelling: Boolean(patient.syncope_fall_limb_pain),
        details: patient.syncopeFallInjuryDetailText || ''
      },
      high_risk_and_etiology_factors: risksRaw,
      female_reproductive_history: isFemale ? {
        pregnancy_status: effPregStatus || null,
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
    pertinent_negatives: patient.pertinentNegatives,
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

// --- Golden 4-Card HTML (Word-Boundary Guarded, Branch Below Grid, Corner Rejections) ---
const SYNCOPE_CARD1_HTML = `
<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
  <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
    <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="clock" class="w-5 h-5"></i></div>
    <div>
      <h2 class="text-base font-bold text-slate-900">1. เวลา ท่าทางก่อนเกิดเหตุ ระดับความรู้สึกตัว และความถี่</h2>
      <p class="text-xs text-slate-500">ระบุเวลาเกิดเหตุ ท่าทางก่อนวูบ ระดับความรู้สึกตัว และจำนวนครั้งใน 24 ชม.</p>
    </div>
  </div>
  <div class="space-y-5">
    <div>
      <label class="block text-xs font-bold text-slate-700 mb-2">1.1 ระยะเวลาตั้งแต่เกิดอาการครั้งนี้ และเวลาเกิดเหตุล่าสุด: <span class="text-rose-500">*</span></label>
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex items-center space-x-2">
          <input type="number" id="syncopeDurationVal" min="1" max="1000" placeholder="เช่น 30"
            class="w-24 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 text-center font-bold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white">
          <select id="syncopeDurationUnit" class="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white">
            <option value="minutes">นาที</option>
            <option value="hours" selected>ชั่วโมง</option>
            <option value="days">วัน</option>
            <option value="weeks">สัปดาห์</option>
            <option value="months">เดือน</option>
            <option value="years">ปี</option>
          </select>
        </div>
        <div id="syncopeExactTimeWrap" class="flex items-center space-x-2">
          <span class="text-xs font-semibold text-slate-600 whitespace-nowrap">เวลาเกิดเหตุ (24 ชม.):</span>
          <input type="text" id="syncopeExactTime" data-universal-time="true" placeholder="เช่น 14:30"
            class="w-28 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white">
        </div>
        <label class="selectable-card inline-flex items-center px-3 py-2 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
          <input type="checkbox" id="syncopeExactTimeUnknown" onchange="handleSyncopeExactTimeUnknownChange()" class="rounded text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0">
          <span class="ml-3 text-xs font-semibold text-slate-800 whitespace-nowrap">ไม่ทราบเวลาแน่ชัด</span>
        </label>
      </div>
    </div>

    <div class="pt-2 border-t border-slate-100">
      <label class="block text-xs font-bold text-slate-700 mb-2">1.2 ผู้ให้ข้อมูลประวัติเหตุการณ์:</label>
      ${renderSyncopeGrid('grid-cols-1 sm:grid-cols-3', [
        { value: 'patient_self', title: wrapSyncWords('ผู้ป่วยให้ข้อมูลเอง') },
        { value: 'witness_relative', title: wrapSyncWords('ญาติ /', 'ผู้เห็นเหตุการณ์') },
        { value: 'both_patient_witness', title: wrapSyncWords('ให้ข้อมูลร่วมกัน') }
      ], { kind: 'radio', name: 'syncopeReporter' })}
    </div>

    <div class="pt-2 border-t border-slate-100">
      <label class="block text-xs font-bold text-slate-700 mb-2">1.3 ท่าทางหรือกิจกรรมก่อนเกิดอาการทันที:</label>
      ${renderSyncopeGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-4', [
        { value: 'prolonged_standing', title: wrapSyncWords('ยืนนาน /', 'ร้อนแออัด') },
        { value: 'sudden_standing', title: wrapSyncWords('ลุกยืน /', 'เปลี่ยนท่าเร็ว') },
        { value: 'standing_or_walking_normal', title: wrapSyncWords('ยืนหรือเดินตามปกติ') },
        { value: 'micturition_defecation', title: wrapSyncWords('ขับถ่าย /', 'ปัสสาวะ /', 'ไอแรง') },
        { value: 'during_exertion', title: wrapSyncWords('ขณะออกแรง /', 'ออกกำลังกาย') },
        { value: 'supine_or_resting', title: wrapSyncWords('ขณะนอนราบ /', 'นั่งพักเฉยๆ') },
        { value: 'neck_movement', title: wrapSyncWords('หันคอ /', 'เงยหน้า /', 'คอเสื้อแน่น') },
        { value: 'other', title: wrapSyncWords('อื่นๆ') }
      ], { kind: 'radio', name: 'syncopePosture', onchange: 'handleSyncopePostureChange()' })}
      <div id="syncopeExertionSubWrap" class="hidden mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
        <span class="font-semibold text-slate-800 block">ช่วงเวลาที่เกิดอาการสัมพันธ์กับการออกแรง:</span>
        ${renderSyncopeGrid('grid-cols-1 sm:grid-cols-2', [
          { value: 'during_active_exertion', title: wrapSyncWords('ระหว่างกำลังออกแรง /', 'ออกกำลังกาย') },
          { value: 'immediately_post_exertion', title: wrapSyncWords('หยุดออกกำลังกะทันหัน', 'แล้วจึงวูบ') }
        ], { kind: 'radio', name: 'syncopeExertionTiming', compact: true, bgWhite: true })}
      </div>
      <div id="syncopeRestingSubWrap" class="hidden mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
        <span class="font-semibold text-slate-800 block">ท่าทางขณะพักที่เกิดเหตุ:</span>
        ${renderSyncopeGrid('grid-cols-1 sm:grid-cols-2', [
          { value: 'while_lying_supine', title: wrapSyncWords('ขณะนอนราบ') },
          { value: 'while_sitting_resting', title: wrapSyncWords('ขณะนั่งพักเฉยๆ') }
        ], { kind: 'radio', name: 'syncopeRestingPosition', compact: true, bgWhite: true })}
      </div>
      <div id="syncopePostureOtherWrap" class="hidden mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
        <label class="block text-xs font-semibold text-slate-700">ระบุท่าทางหรือกิจกรรมก่อนเกิดเหตุ:</label>
        <input type="text" id="syncopePostureOtherText" placeholder="เช่น กำลังขับรถ หรือนั่งทำงาน..." class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-medical-500">
      </div>
    </div>

    <div class="pt-2 border-t border-slate-100">
      <label class="block text-xs font-bold text-slate-700 mb-2">1.4 ลักษณะความรู้สึกตัวขณะเกิดเหตุ:</label>
      ${renderSyncopeGrid('grid-cols-1 sm:grid-cols-2', [
        { value: 'true_syncope', title: wrapSyncWords('หมดสติไม่รู้สึกตัว'), desc: 'สลบไปชั่วคราว จำช่วงที่ล้มลงไม่ได้' },
        { value: 'near_syncope', title: wrapSyncWords('เกือบหมดสติ /', 'แค่วูบหน้ามืด'), desc: 'เข่าอ่อนหน้ามืด แต่ยังรู้สึกตัวและได้ยินเสียงรอบข้าง' }
      ], { kind: 'radio', name: 'syncopeConsciousnessLevel', onchange: 'handleSyncopeConsciousnessLevelChange()' })}
      <div id="syncopeUnconsciousDurationWrap" class="hidden mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3 text-xs">
        <span class="font-semibold text-slate-800 block">ระยะเวลาที่หมดสติไม่รู้สึกตัว (สลบไปนานกี่นาที):</span>
        ${renderSyncopeGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', [
          { value: 'brief_seconds', title: wrapSyncWords('สั้นมาก (< 1 นาที)'), desc: 'ประมาณ 10–30 วินาที' },
          { value: 'typical_minutes', title: wrapSyncWords('ประมาณ 1–4 นาที') },
          { value: 'prolonged_gte_5m', title: wrapSyncWords('ตั้งแต่ 5 นาทีขึ้นไป') },
          { value: 'continuous_unconscious', title: wrapSyncWords('ยังไม่ฟื้นสติ', 'จนถึงขณะนี้') },
          { value: 'unknown_unobserved', title: wrapSyncWords('ไม่ทราบระยะเวลา') }
        ], { kind: 'radio', name: 'syncopeUnconsciousDuration', onchange: 'handleSyncopeUnconsciousDurationChange()', compact: true, bgWhite: true })}
        <div id="syncopeDurationGte5mWrap" class="hidden bg-white border border-slate-200 rounded-xl p-3 flex items-center space-x-2 max-w-xs">
          <label class="text-xs font-semibold text-slate-700 whitespace-nowrap">ระบุเวลาโดยประมาณ:</label>
          <input type="number" id="syncopeDurationGte5mVal" min="5" max="999" placeholder="เช่น 10" class="w-20 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-slate-800 font-semibold text-xs text-center focus:outline-none focus:ring-2 focus:ring-medical-500">
          <span class="text-xs text-slate-600">นาที</span>
        </div>
      </div>
    </div>

    <div class="pt-2 border-t border-slate-100">
      <label class="block text-xs font-bold text-slate-700 mb-2">1.5 จำนวนครั้งใน 24 ชั่วโมงที่ผ่านมา:</label>
      ${renderSyncopeGrid('grid-cols-1 sm:grid-cols-2', [
        { value: 'single', title: wrapSyncWords('เกิดขึ้นครั้งเดียว') },
        { value: 'multiple_cluster', title: wrapSyncWords('เกิดซ้ำตั้งแต่', '2 ครั้งขึ้นไป') }
      ], { kind: 'radio', name: 'syncopeEpisodeCount', onchange: 'handleSyncopeEpisodeCountChange()' })}
      <div id="syncopeEpisodeCountWrap" class="hidden mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center space-x-2 text-xs max-w-xs">
        <label class="font-semibold text-slate-700 whitespace-nowrap">จำนวนครั้งทั้งหมดวันนี้:</label>
        <input type="number" id="syncopeEpisodeCountVal" min="2" max="50" placeholder="เช่น 2" class="w-20 bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-slate-800 font-semibold text-xs text-center focus:outline-none focus:ring-2 focus:ring-medical-500">
        <span class="text-slate-600">ครั้ง</span>
      </div>
    </div>
  </div>
</div>`;

const SYNCOPE_CARD2_HTML = `
<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
  <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
    <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="bell-ring" class="w-5 h-5"></i></div>
    <div>
      <h2 class="text-base font-bold text-slate-900">2. อาการเตือนนำ ลักษณะการเคลื่อนไหว และอาการขณะเกิดเหตุ</h2>
      <p class="text-xs text-slate-500">ประเมินอาการนำก่อนวูบ ลักษณะการเกร็งกระตุก และอาการร่วมที่สังเกตเห็น</p>
    </div>
  </div>
  <div class="space-y-5">
    <div>
      ${renderSyncSysHeader({
        icon: 'alert-circle',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        title: '2.1 อาการเตือนก่อนวูบหรือหมดสติ (เลือกได้หลายข้อ)',
        noneId: 'syncope_prodrome_none',
        noneLabel: 'ไม่มีอาการเตือน (ล้มทันที)',
        noneOnchange: 'handleSyncopeProdromeNoneChange()'
      })}
      ${renderSyncopeGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-4', [
        { value: 'lightheaded_tunnel_vision', title: wrapSyncWords('หน้ามืด /', 'ตาพร่ามัว /', 'หูอื้อ') },
        { value: 'cold_sweat_pallor_nausea', title: wrapSyncWords('เหงื่อแตก /', 'ตัวเย็น /', 'หน้าซีด') },
        { value: 'sudden_palpitation', title: wrapSyncWords('ใจสั่นรัว /', 'หัวใจเต้นสะดุด') },
        { value: 'chest_pain_pressure', title: wrapSyncWords('เจ็บแน่นหน้าอก /', 'ร้าวกราม-หลัง') },
        { value: 'severe_dyspnea', title: wrapSyncWords('หอบเหนื่อย /', 'หายใจไม่อิ่ม') },
        { value: 'thunderclap_headache', title: wrapSyncWords('ปวดศีรษะรุนแรง', 'เฉียบพลัน') },
        { value: 'hyperventilation_tingling', title: wrapSyncWords('หายใจหอบเร็ว /', 'ชารอบปาก-มือ') },
        { value: 'aura_epigastric_olfactory', title: wrapSyncWords('จุกในท้องลอยขึ้นคอ /', 'ได้กลิ่นแปลก'), desc: 'หรือเห็นแสงวาบก่อนวูบ (Aura)' },
        { value: 'unknown', title: wrapSyncWords('ไม่ทราบ /', 'จำไม่ได้') }
      ], { kind: 'checkbox', name: 'syncopeProdromes', onchange: 'handleSyncopeWarningChange(this)' })}
    </div>

    <div class="pt-3 border-t border-slate-100">
      <label class="block text-xs font-bold text-slate-700 mb-2">2.2 ลักษณะการเคลื่อนไหวของร่างกายขณะเกิดเหตุ:</label>
      ${renderSyncopeGrid('grid-cols-1 sm:grid-cols-2', [
        { value: 'limp_flaccid', title: wrapSyncWords('ตัวอ่อนปวกเปียก', 'ไม่เกร็งกระตุก') },
        { value: 'abnormal_movements', title: wrapSyncWords('มีเกร็ง /', 'กระตุก /', 'เคลื่อนไหวผิดปกติ') }
      ], { kind: 'radio', name: 'syncopeMotorCategory', onchange: 'handleSyncopeMotorCategoryChange()' })}
      <div id="syncopeMotorSubWrap" class="hidden mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
        <span class="font-semibold text-slate-800 block">ลักษณะการเกร็งหรือกระตุกที่สังเกตพบ:</span>
        ${renderSyncopeGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', [
          { value: 'brief_myoclonic_jerks', title: wrapSyncWords('กระตุกเบาๆ สั้นๆ', 'หลังล้ม'), desc: 'เพียง 5–15 วินาทีหลังล้มลง' },
          { value: 'generalized_tonic_clonic', title: wrapSyncWords('เกร็งแข็งกระตุก', 'ทั้งตัวเป็นนาที') },
          { value: 'carpopedal_spasm', title: wrapSyncWords('มือจีบเกร็ง', 'ทั้งสองข้าง'), desc: 'นิ้วมืองุ้มจีบเข้าหากัน' },
          { value: 'thrashing_closed_eyes', title: wrapSyncWords('ดิ้นสะบัด /', 'ส่ายหน้าหลับตาแน่น') },
          { value: 'unknown_unobserved', title: wrapSyncWords('ไม่ทราบ /', 'ไม่ได้สังเกต') }
        ], { kind: 'radio', name: 'syncopeMotorSign', compact: true, bgWhite: true })}
      </div>
    </div>

    <div class="pt-3 border-t border-slate-100">
      ${renderSyncSysHeader({
        icon: 'eye',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        title: '2.3 อาการร่วมที่สังเกตเห็นขณะเกิดเหตุ (เลือกได้หลายข้อ)',
        noneId: 'syncope_signs_none',
        noneLabel: 'ไม่มีอาการในหมวดนี้',
        noneOnchange: 'handleSyncopeSignsNoneChange()'
      })}
      ${renderSyncopeGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', [
        { value: 'syncope_marked_pallor_sweat', title: wrapSyncWords('หน้าซีดเผือด /', 'ตัวเย็นเหงื่อชุ่ม') },
        { value: 'syncope_cyanosis_apnea', title: wrapSyncWords('ปากเขียวคล้ำ /', 'หยุดหายใจชั่วขณะ') },
        { value: 'syncope_lateral_tongue_bite', title: wrapSyncWords('กัดลิ้น /', 'เลือดออกในปาก') },
        { value: 'syncope_eyes_open_deviated', title: wrapSyncWords('ตาค้าง /', 'ตาเหลือกเบนข้างเดียว') },
        { value: 'syncope_incontinence', title: wrapSyncWords('ปัสสาวะราด /', 'อุจจาระราด') }
      ], { kind: 'checkbox', name: 'syncopeSigns', onchange: 'handleSyncopeSignsItemChange(this)' })}
    </div>
  </div>
</div>`;

const SYNCOPE_CARD3_HTML = `
<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
  <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
    <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="rotate-ccw" class="w-5 h-5"></i></div>
    <div>
      <h2 class="text-base font-bold text-slate-900">3. การฟื้นคืนสติ อาการผิดปกติหลังฟื้น และการบาดเจ็บจากการล้ม</h2>
      <p class="text-xs text-slate-500">ประเมินสภาพหลังฟื้นตื่น อาการคงค้าง และการบาดเจ็บจากการล้มกระแทก</p>
    </div>
  </div>
  <div class="space-y-5">
    <div id="syncopeUnconsciousContextNotice" class="hidden p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-slate-700">
      ระบบตรวจพบว่าผู้ป่วยยังไม่ฟื้นสติในข้อ 1.4 จึงซ่อนตัวเลือกฟื้นตัวเร็วและอาการหลังฟื้นโดยอัตโนมัติ
    </div>

    <div>
      <label class="block text-xs font-bold text-slate-700 mb-2">3.1 สภาพความรู้สึกตัว "หลังจากเริ่มฟื้นตื่นแล้ว":</label>
      ${renderSyncopeGrid('grid-cols-1 sm:grid-cols-3', [
        { wrapId: 'syncopeRecOptWrap_rapid', value: 'rapid_spontaneous', title: wrapSyncWords('ฟื้นแล้วรู้เรื่องทันที', 'ไม่งง'), desc: 'พูดคุยโต้ตอบเป็นปกติภายใน 1–2 นาที' },
        { wrapId: 'syncopeRecOptWrap_confused', value: 'prolonged_confusion', title: wrapSyncWords('ตื่นแล้วยังสับสน /', 'หลับต่อ > 5 นาที'), desc: 'ถามซ้ำๆ หรือจำเหตุการณ์ไม่ได้' },
        { value: 'persistent_drowsy_coma', title: wrapSyncWords('ยังไม่ตื่น /', 'ซึมปลุกยากจนถึงขณะนี้') }
      ], { kind: 'radio', name: 'syncopeRecoveryPattern', onchange: 'updateSyncopeRecoveryContext()' })}
    </div>

    <div id="syncopePostSymptomsSectionWrap" class="pt-3 border-t border-slate-100">
      ${renderSyncSysHeader({
        icon: 'stethoscope',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        title: '3.2 อาการผิดปกติที่ยังคงมีอยู่หลังฟื้นคืนสติ (เลือกได้หลายข้อ)',
        noneId: 'syncope_post_none',
        noneLabel: 'ไม่มีอาการในหมวดนี้',
        noneOnchange: 'handleSyncopePostNoneChange()'
      })}
      ${renderSyncopeGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', [
        { value: 'post_focal_weakness', title: wrapSyncWords('แขนขาอ่อนแรง /', 'ปากเบี้ยว /', 'พูดไม่ชัด') },
        { value: 'post_ongoing_chestpain', title: wrapSyncWords('ยังเจ็บแน่นหน้าอก /', 'หอบ /', 'ใจสั่น') },
        { value: 'post_orthostatic_intolerance', title: wrapSyncWords('หน้ามืดจะเป็นลมซ้ำ', 'เมื่อลุกนั่ง/ยืน') },
        { value: 'post_severe_abdpain_melena', title: wrapSyncWords('ปวดท้องรุนแรง /', 'ปวดร้าวไปที่หลัง') },
        { value: 'post_severe_headache', title: wrapSyncWords('ปวดศีรษะรุนแรง', 'ต่อเนื่อง') },
        { value: 'post_diffuse_muscle_pain', title: wrapSyncWords('ปวดเมื่อย /', 'ระบมกล้ามเนื้อทั่วตัว') }
      ], { kind: 'checkbox', name: 'syncopePostSymptoms', onchange: 'handleSyncopePostSymptomChange(this)' })}
    </div>

    <div class="pt-3 border-t border-slate-100">
      <label class="block text-xs font-bold text-slate-700 mb-2">3.3 การบาดเจ็บจากการล้มหรือกระแทกพื้นในครั้งนี้:</label>
      ${renderSyncopeGrid('grid-cols-1 sm:grid-cols-2', [
        { value: 'no', title: wrapSyncWords('ไม่มีการบาดเจ็บ', 'จากการล้ม') },
        { value: 'yes', title: wrapSyncWords('มีการบาดเจ็บจากการล้ม', 'กระแทกพื้น') }
      ], { kind: 'radio', name: 'syncopeFallInjury', onchange: 'handleSyncopeFallInjuryChange()' })}
      <div id="syncopeFallInjuryDetailWrap" class="hidden mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3 text-xs">
        <span class="font-semibold text-slate-800 block">ลักษณะการบาดเจ็บ (เลือกได้หลายข้อ):</span>
        ${renderSyncopeGrid('grid-cols-1 sm:grid-cols-3', [
          { kind: 'checkbox', id: 'syncope_fall_head_impact', title: wrapSyncWords('ศีรษะ /', 'ใบหน้ากระแทกพื้น'), compact: true, bgWhite: true },
          { kind: 'checkbox', id: 'syncope_fall_open_wound', title: wrapSyncWords('แผลฉีกขาด /', 'เลือดออก'), compact: true, bgWhite: true },
          { kind: 'checkbox', id: 'syncope_fall_limb_pain', title: wrapSyncWords('ปวดบวม /', 'ฟกช้ำ /', 'ผิดรูป'), compact: true, bgWhite: true }
        ])}
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">ตำแหน่งบาดเจ็บเพิ่มเติม (ถ้ามี):</label>
          <input type="text" id="syncopeFallInjuryDetailText" placeholder="เช่น คิ้วขวาแตก, ท้ายทอยโน, ปวดข้อมือซ้าย..." class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-medical-500">
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
      <h2 class="text-base font-bold text-slate-900">4. ปัจจัยเสี่ยงสำคัญ</h2>
      <p class="text-xs text-slate-500">ประวัติความเสี่ยงทางหัวใจ โรคประจำตัว และการเสียเลือด</p>
    </div>
  </div>
  <div class="space-y-5">
    <div>
      ${renderSyncSysHeader({
        icon: 'shield-alert',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        title: '4.1 ประวัติความเสี่ยงทางหัวใจ การเสียเลือด และโรคเดิม (เลือกได้หลายข้อ)',
        noneId: 'syncope_risk_none',
        noneLabel: 'ไม่มีปัจจัยเสี่ยงในหมวดนี้',
        noneOnchange: 'handleSyncopeRiskNoneChange()'
      })}
      ${renderSyncopeGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-4', [
        { value: 'known_heart_disease', title: wrapSyncWords('มีโรคหัวใจเดิม /', 'เคยผ่าตัดหัวใจ') },
        { value: 'known_arrhythmia_pacemaker', title: wrapSyncWords('หัวใจเต้นผิดจังหวะ /', 'ใส่เครื่องกระตุ้น'), desc: 'Pacemaker / ICD' },
        { value: 'family_sudden_death_young', title: wrapSyncWords('ครอบครัวเสียชีวิต', 'อายุน้อย'), desc: 'ญาติสายตรงเสียชีวิตกะทันหันก่อนอายุ 50 ปี' },
        { value: 'recent_bp_med_adjustment', title: wrapSyncWords('เพิ่งเริ่มหรือเพิ่ม', 'ยาความดัน / ขับปัสสาวะ') },
        { value: 'suspected_gi_bleeding', title: wrapSyncWords('ถ่ายดำ /', 'ถ่ายเป็นเลือด /', 'อาเจียนเลือด') },
        { value: 'dehydration_diarrhea', title: wrapSyncWords('ท้องเสีย /', 'อาเจียน /', 'ขาดน้ำมาก') },
        { value: 'known_diabetes_insulin', title: wrapSyncWords('เบาหวานฉีดอินซูลิน /', 'กินยาลดน้ำตาล') },
        { value: 'known_epilepsy_seizure', title: wrapSyncWords('เป็นโรคลมชัก /', 'วูบซ้ำบ่อย') }
      ], { kind: 'checkbox', name: 'syncopeRiskFactors', onchange: 'handleSyncopeRiskChange(this)' })}
    </div>

    <div id="syncopeFemaleSection" class="hidden pt-4 border-t border-slate-100 space-y-3">
      <div class="flex items-center space-x-2">
        <span class="px-2 py-0.5 text-[10px] font-bold bg-pink-100 text-pink-700 rounded-md">เฉพาะสตรี</span>
        <label class="block text-xs font-bold text-slate-700">4.2 ประจำเดือนและการตั้งครรภ์ (LMP &amp; Pregnancy)</label>
      </div>
      <div class="space-y-3 bg-pink-50/40 p-3.5 rounded-xl border border-pink-200">
        <div>
          <span class="block text-xs font-semibold text-slate-700 mb-2">สถานะประจำเดือนและการตั้งครรภ์:</span>
          ${renderSyncopeGrid('grid-cols-1 sm:grid-cols-3', [
            { value: 'not_pregnant', title: wrapSyncWords('ไม่ได้ตั้งครรภ์') },
            { value: 'missed_period', title: wrapSyncWords('ขาดประจำเดือน /', 'สงสัยตั้งครรภ์') },
            { value: 'pregnant', title: wrapSyncWords('กำลังตั้งครรภ์') },
            { value: 'postpartum_6w', title: wrapSyncWords('เพิ่งคลอด /', 'แท้งใน 6 สัปดาห์') },
            { value: 'menopause_hysterectomy', title: wrapSyncWords('หมดประจำเดือน /', 'ผ่าตัดมดลูก') },
            { value: 'unsure', title: wrapSyncWords('ไม่แน่ใจ') }
          ], { kind: 'radio', name: 'syncopePregnancyStatus', onchange: 'handleSyncopePregnancyChange()', compact: true, bgWhite: true })}
          <div id="syncopePregnancyWeeksWrap" class="hidden mt-2.5 max-w-xs">
            <input type="text" id="syncopePregnancyWeeks" placeholder="ระบุอายุครรภ์ เช่น 8 สัปดาห์" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-medical-500">
          </div>
        </div>
        <div>
          <span class="block text-xs font-semibold text-slate-700 mb-2">อาการทางสูตินรีเวชที่พบร่วม (เลือกได้หลายข้อ):</span>
          ${renderSyncopeGrid('grid-cols-1 sm:grid-cols-2', [
            { kind: 'checkbox', id: 'syncope_fem_lower_abd_pain', title: wrapSyncWords('ปวดหน่วง /', 'ปวดบิดท้องน้อย'), compact: true, bgWhite: true },
            { kind: 'checkbox', id: 'syncope_fem_pv_bleeding', title: wrapSyncWords('เลือดออกผิดปกติ', 'ทางช่องคลอด'), compact: true, bgWhite: true }
          ])}
        </div>
        <div class="max-w-xs">
          <span class="block text-xs font-semibold text-slate-700 mb-1">วันแรกของประจำเดือนครั้งสุดท้าย (LMP):</span>
          <input type="text" id="syncopeLmpDate" data-universal-date="true" placeholder="วว/ดด/ปปปป (dd/mm/yyyy)" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-medical-500">
        </div>
      </div>
    </div>
  </div>
</div>`;

const SYNCOPE_FORM_HTML = `
<div id="syncopeQuestionnaireSection" class="hidden space-y-6">
  <div data-cc-top-banner="syncope">
    <div class="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-start space-x-3">
      <i data-lucide="info" class="w-5 h-5 text-sky-700 mt-0.5 flex-shrink-0"></i>
      <div class="text-xs text-sky-900 leading-relaxed space-y-1">
        <div class="font-bold">ข้อแนะนำการดูแลความปลอดภัยเบื้องต้นระหว่างรอพบแพทย์</div>
        <p>1. <strong>นั่งพักหรือนอนราบและห้ามลุกยืนเร็วๆ:</strong> หากยังรู้สึกหน้ามืดวิงเวียน ให้นอนราบหนุนขาสูงเล็กน้อย และห้ามเดินไปเข้าห้องน้ำตามลำพัง</p>
        <p>2. <strong>งดน้ำและอาหารไว้ก่อนชั่วคราว:</strong> เพื่อความปลอดภัยเผื่อกรณีต้องตรวจพิเศษหรือให้การรักษาฉุกเฉิน</p>
        <p>3. <strong>แจ้งพยาบาลหน้าห้องตรวจทันที:</strong> หากมีอาการ <strong>วูบซ้ำ เจ็บแน่นหน้าอก ใจสั่นรัว หอบเหนื่อย ปวดท้องรุนแรง ปากเบี้ยว อ่อนแรง หรือซึมลง</strong></p>
      </div>
    </div>
  </div>
  ${SYNCOPE_CARD1_HTML}
  ${SYNCOPE_CARD2_HTML}
  ${SYNCOPE_CARD3_HTML}
  ${SYNCOPE_CARD4_HTML}
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100">
      <div class="bg-slate-100 text-slate-600 p-2 rounded-xl"><i data-lucide="message-square-plus" class="w-5 h-5"></i></div>
      <div>
        <h2 class="text-base font-bold text-slate-900">อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2>
        <p class="text-xs text-slate-500">ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)</p>
      </div>
    </div>
    <textarea id="syncope_other_free" rows="2" placeholder="ระบุรายละเอียดหรือข้อสังเกตเพิ่มเติม..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"></textarea>
  </div>
</div>`;

function makeSyncSeed(ov) {
  return {
    chief_complaint: 'syncope', chief_complaint_title: 'หมดสติ / วูบ / เป็นลม', status: 'waiting',
    syncopeExactTimeUnknown: false, syncopeExactTime: '', syncopeExertionTiming: '', syncopeRestingPosition: '',
    syncopePostureOtherText: '', syncopeDurationGte5mVal: '', syncopeEpisodeCount: 'single', syncopeEpisodeCountVal: 1,
    syncope_prodrome_none: false, syncope_signs_none: false, syncope_post_none: false, syncope_risk_none: false,
    syncopeFallInjury: 'no', syncope_fall_head_impact: false, syncope_fall_open_wound: false, syncope_fall_limb_pain: false,
    syncopeFallInjuryDetailText: '', syncopePregnancyStatus: 'not_applicable', syncopePregnancyWeeks: '',
    syncope_fem_lower_abd_pain: false, syncope_fem_pv_bleeding: false, syncopeLmpDate: '',
    drugAllergy: 'ปฏิเสธ', otherSymptomsFree: '', ...ov
  };
}

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
  timeFields: ['syncopeExactTime'],
  branchIds: [
    'syncopeExactTimeWrap', 'syncopeExertionSubWrap', 'syncopeRestingSubWrap', 'syncopePostureOtherWrap',
    'syncopeUnconsciousDurationWrap', 'syncopeDurationGte5mWrap', 'syncopeEpisodeCountWrap', 'syncopeMotorSubWrap',
    'syncopeUnconsciousContextNotice', 'syncopePostSymptomsSectionWrap',
    'syncopeFallInjuryDetailWrap', 'syncopeFemaleSection', 'syncopePregnancyWeeksWrap'
  ],
  inputIdsToClear: [
    'syncopeDurationVal', 'syncopeExactTime', 'syncopePostureOtherText', 'syncopeDurationGte5mVal',
    'syncopeEpisodeCountVal', 'syncopeFallInjuryDetailText', 'syncopePregnancyWeeks',
    'syncopeLmpDate', 'syncope_other_free'
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
    [
      'syncopeReporter', 'syncopePosture', 'syncopeExertionTiming', 'syncopeRestingPosition',
      'syncopeConsciousnessLevel', 'syncopeUnconsciousDuration', 'syncopeEpisodeCount',
      'syncopeMotorCategory', 'syncopeMotorSign', 'syncopeRecoveryPattern',
      'syncopeFallInjury', 'syncopePregnancyStatus'
    ].forEach(clearSyncopeRadioGroup);
    document.querySelectorAll('input[name="syncopeProdromes"], input[name="syncopeSigns"], input[name="syncopePostSymptoms"], input[name="syncopeRiskFactors"]').forEach(cb => {
      cb.checked = false;
    });
    clearSyncopeCheckboxes([
      'syncopeExactTimeUnknown', 'syncope_prodrome_none', 'syncope_signs_none',
      'syncope_post_none', 'syncope_risk_none', 'syncope_fall_head_impact',
      'syncope_fall_open_wound', 'syncope_fall_limb_pain',
      'syncope_fem_lower_abd_pain', 'syncope_fem_pv_bleeding'
    ]);
    this.branchIds.forEach(bId => toggleSyncopeBranch(bId, false));
    toggleSyncopeBranch('syncopeExactTimeWrap', true);
    toggleSyncopeBranch('syncopePostSymptomsSectionWrap', true);
    ['syncopeRecOptWrap_rapid', 'syncopeRecOptWrap_confused'].forEach(id => toggleSyncopeBranch(id, true));
    this.inputIdsToClear.forEach(iId => {
      const el = document.getElementById(iId);
      if (el) el.value = '';
    });
    const unitEl = document.getElementById('syncopeDurationUnit');
    if (unitEl) unitEl.value = 'hours';
  },

  seedPatients: [
    makeSyncSeed({
      id: 'case-095', queue_number: 'A-095', hn: '6709841', name: 'นายเกริกเกียรติ สว่างวงศ์', age: 48, gender: 'ชาย',
      timestamp: '2026-10-26T02:11:26.425Z', durationVal: 1, durationUnit: 'hours', syncopeExactTime: '08:15',
      syncopeReporter: 'both_patient_witness', syncopePosture: 'during_exertion', syncopeExertionTiming: 'during_active_exertion',
      syncopeConsciousnessLevel: 'true_syncope', syncopeUnconsciousDuration: 'brief_seconds',
      syncopeProdromes: ['sudden_palpitation', 'chest_pain_pressure'], syncopeMotorCategory: 'abnormal_movements',
      syncopeMotorSign: 'brief_myoclonic_jerks', syncopeSigns: ['syncope_marked_pallor_sweat'],
      syncopeRecoveryPattern: 'rapid_spontaneous', syncopePostSymptoms: ['post_ongoing_chestpain'],
      syncopeFallInjury: 'yes', syncope_fall_head_impact: true, syncope_fall_open_wound: true,
      syncopeFallInjuryDetailText: 'คิ้วขวาแตก', syncopeRiskFactors: ['known_heart_disease', 'family_sudden_death_young'],
      otherSymptomsFree: 'หมดสติขณะกำลังวิ่งจ็อกกิ้งรอบสวนสาธารณะ มีอาการใจสั่นรัวและแน่นหน้าอกนำ ล้มหน้ากระแทกพื้นมีแผลคิ้วแตก',
      hospRecordStatus: 'ratchaburi', underlying: ['โรคหลอดเลือดหัวใจตีบ (CAD s/p PCI 2 ปีก่อน)', 'ไขมันในเลือดสูง (DLP)'],
      currentMeds: 'Aspirin 81 mg 1x1 pc, Atorvastatin 40 mg 1x1 hs, Metoprolol 50 mg 1/2x2 pc',
      doctor_notes: {
        additional_hpi: 'ชาย 48 ปี ประวัติ CAD เคยทำบอลลูน 2 ปีก่อน ขณะวิ่งจ็อกกิ้ง 15 นาที เกิดใจสั่นรัวและแน่นหน้าอกร้าวกรามซ้าย หน้ามืดหมดสติล้มคิ้วขวาแตก กระตุกสั้นๆ 3-4 ครั้ง 10 วินาที ฟื้นสติไม่งงแต่ยังแน่นหน้าอกต่อเนื่อง',
        physical_exam: 'BT 36.6 C, PR 112/min (irregular), RR 20/min, BP 98/62 mmHg, SpO2 96% RA. 2.5 cm laceration at right eyebrow. Alert, motor V all.',
        preliminary_dx: 'Exertional Cardiac Syncope (Ventricular Arrhythmia / ACS) with Facial Laceration',
        plan: 'Telemetry monitor, STAT 12-lead EKG (NSVT / ST depression V4-V6), Hs-Troponin-I, Electrolytes, urgent Cardiology consult & CCU'
      }
    }),
    makeSyncSeed({
      id: 'case-096', queue_number: 'A-096', hn: '6709952', name: 'น.ส.แพรวพรรณ โสภณพิทักษ์', age: 21, gender: 'หญิง',
      timestamp: '2026-10-26T01:56:26.425Z', durationVal: 1, durationUnit: 'hours', syncopeExactTime: '08:05',
      syncopeReporter: 'both_patient_witness', syncopePosture: 'prolonged_standing',
      syncopeConsciousnessLevel: 'true_syncope', syncopeUnconsciousDuration: 'brief_seconds',
      syncopeProdromes: ['lightheaded_tunnel_vision', 'cold_sweat_pallor_nausea'],
      syncopeMotorCategory: 'limp_flaccid', syncopeMotorSign: 'limp_flaccid',
      syncopeSigns: ['syncope_marked_pallor_sweat'], syncopeRecoveryPattern: 'rapid_spontaneous',
      syncope_post_none: true, syncopePostSymptoms: ['post_none_asymptomatic'],
      syncope_risk_none: true, syncopeRiskFactors: ['none_unremarkable'],
      syncopePregnancyStatus: 'not_pregnant', syncopeLmpDate: '10/10/2026',
      otherSymptomsFree: 'ยืนเข้าแถวกลางแดดนาน ร้อนอบอ้าว เพื่อนช่วยพยุงตัวลง ไม่ศีรษะกระแทก',
      hospRecordStatus: 'self', underlying: ['ปฏิเสธ'], currentMeds: 'ไม่มี',
      doctor_notes: {
        additional_hpi: 'หญิง 21 ปี ยืนเข้าแถวกลางแดดเกือบ 45 นาที อากาศร้อน ดื่มน้ำน้อย หน้ามืดตาพร่า เหงื่อแตกตัวเย็น แล้วตัวอ่อนล้มพับ เพื่อนประคองลง หมดสติ 15-20 วินาที ฟื้นรู้เรื่องทันที ไม่งง ไม่มีบาดเจ็บ',
        physical_exam: 'BT 36.8 C, PR 72/min, RR 16/min, BP 106/68 mmHg, SpO2 99% RA. No orthostatic drop. Neuro intact, no trauma.',
        preliminary_dx: 'Simple Vasovagal / Reflex Syncope (Low Risk)',
        plan: 'Reassurance, ORS hydration, 12-lead EKG baseline normal, counterpressure maneuver education, discharge'
      }
    }),
    makeSyncSeed({
      id: 'case-097', queue_number: 'A-097', hn: '6710063', name: 'นายอัครเดช บวรเกียรติ', age: 33, gender: 'ชาย',
      timestamp: '2026-10-26T01:31:26.425Z', durationVal: 2, durationUnit: 'hours', syncopeExactTimeUnknown: true,
      syncopeReporter: 'both_patient_witness', syncopePosture: 'supine_or_resting', syncopeRestingPosition: 'while_sitting_resting',
      syncopeConsciousnessLevel: 'true_syncope', syncopeUnconsciousDuration: 'typical_minutes',
      syncopeProdromes: ['aura_epigastric_olfactory'], syncopeMotorCategory: 'abnormal_movements',
      syncopeMotorSign: 'generalized_tonic_clonic',
      syncopeSigns: ['syncope_cyanosis_apnea', 'syncope_lateral_tongue_bite', 'syncope_incontinence', 'syncope_eyes_open_deviated'],
      syncopeRecoveryPattern: 'prolonged_confusion', syncopePostSymptoms: ['post_diffuse_muscle_pain', 'post_severe_headache'],
      syncopeRiskFactors: ['known_epilepsy_seizure'],
      otherSymptomsFree: 'หมดสติขณะนั่งทำงาน เพื่อนเห็นเกร็งกระตุกทั้งตัว ตาเหลือก กัดลิ้นเลือดออก มีปัสสาวะราด ฟื้นแล้วงงมาก',
      hospRecordStatus: 'self', underlying: ['โรคลมชัก (Epilepsy - ขาดยา 3 วัน)'],
      currentMeds: 'Sodium Valproate 500 mg 1x2 pc (ขาดยา 3 วัน)',
      doctor_notes: {
        additional_hpi: 'ชาย 33 ปี U/D Epilepsy ขาดยากันชัก 3 วัน ขณะนั่งทำงานรู้สึกโหวงในท้องลอยขึ้นคอและได้กลิ่นไหม้ แล้วชักเกร็งกระตุกทั้งตัว 2 นาที ตาเหลือก กัดลิ้น ปัสสาวะราด หลังฟื้นสับสนหลับลึกนานกว่า 20 นาที',
        physical_exam: 'BT 37.1 C, PR 88/min, RR 18/min, BP 124/78 mmHg, DTX 114 mg/dL. Post-ictal drowsiness E4V4M6. 1 cm laceration left lateral tongue.',
        preliminary_dx: 'Generalized Tonic-Clonic Seizure (Breakthrough due to missed Valproate)',
        plan: 'Airway monitoring, CBC, Electrolytes, Ca, Mg, Valproic acid level, IV Valproate loading, compliance counseling'
      }
    }),
    makeSyncSeed({
      id: 'case-098', queue_number: 'A-098', hn: '6710174', name: 'น.ส.กมลวรรณ ธนสารเจริญ', age: 27, gender: 'หญิง',
      timestamp: '2026-10-26T02:06:26.425Z', durationVal: 2, durationUnit: 'hours', syncopeExactTime: '07:45',
      syncopeReporter: 'both_patient_witness', syncopePosture: 'sudden_standing',
      syncopeConsciousnessLevel: 'true_syncope', syncopeUnconsciousDuration: 'brief_seconds',
      syncopeProdromes: ['lightheaded_tunnel_vision', 'cold_sweat_pallor_nausea'],
      syncopeMotorCategory: 'limp_flaccid', syncopeMotorSign: 'limp_flaccid',
      syncopeSigns: ['syncope_marked_pallor_sweat'], syncopeRecoveryPattern: 'rapid_spontaneous',
      syncopePostSymptoms: ['post_severe_abdpain_melena', 'post_orthostatic_intolerance'],
      syncopeRiskFactors: [], syncopePregnancyStatus: 'missed_period',
      syncope_fem_lower_abd_pain: true, syncope_fem_pv_bleeding: true, syncopeLmpDate: '12/09/2026',
      otherSymptomsFree: 'ปวดท้องน้อยรุนแรงร้าวสะบักขวา ขาดประจำเดือน 6 สัปดาห์ ลุกจากเตียงแล้ววูบล้ม หน้ามืดซ้ำตลอดเวลานั่ง',
      hospRecordStatus: 'self', underlying: ['ปฏิเสธ'], currentMeds: 'ไม่มี',
      doctor_notes: {
        additional_hpi: 'หญิง 27 ปี ขาดประจำเดือน 6 สัปดาห์ ปวดบิดท้องน้อยขวาร้าวสะบักขวา ลุกยืนแล้วหน้ามืดเหงื่อแตกวูบหมดสติ 20-30 วินาที ฟื้นแล้วยังหน้ามืดเมื่อลุกนั่ง มีเลือดออกกะปริบกะปรอยทางช่องคลอด',
        physical_exam: 'BT 36.4 C, PR 118/min, BP 86/52 mmHg, SpO2 97% RA. Marked pallor, RLQ & suprapubic guarding with rebound tenderness.',
        preliminary_dx: 'Hemorrhagic Shock secondary to Ruptured Ectopic Pregnancy',
        plan: 'Code Shock Red, 2 large-bore IV NSS bolus, STAT Urine Pregnancy Test, FAST POCUS (hemoperitoneum), Crossmatch 4U PRC, STAT OB-GYN'
      }
    })
  ],

  hydrateForm(patient) {
    if (!patient) return;
    this.resetForm();
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
    setChk('syncopeExactTimeUnknown', patient.syncopeExactTimeUnknown);
    setVal('syncopeExactTime', patient.syncopeExactTime || '');
    handleSyncopeExactTimeUnknownChange();

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

    const prodArr = Array.isArray(patient.syncopeProdromes) ? patient.syncopeProdromes : [];
    const prodNone = Boolean(patient.syncope_prodrome_none || prodArr.includes('none_sudden'));
    setChk('syncope_prodrome_none', prodNone);
    document.querySelectorAll('input[name="syncopeProdromes"]').forEach(cb => {
      cb.checked = !prodNone && prodArr.includes(cb.value);
    });

    setSyncopeRadioChecked('syncopeMotorCategory', patient.syncopeMotorCategory);
    handleSyncopeMotorCategoryChange();
    if (patient.syncopeMotorCategory === 'abnormal_movements') {
      setSyncopeRadioChecked('syncopeMotorSign', patient.syncopeMotorSign);
    }

    const signsArr = Array.isArray(patient.syncopeSigns) ? patient.syncopeSigns : [];
    setChk('syncope_signs_none', patient.syncope_signs_none);
    document.querySelectorAll('input[name="syncopeSigns"]').forEach(cb => {
      cb.checked = !patient.syncope_signs_none && signsArr.includes(cb.value);
    });

    setSyncopeRadioChecked('syncopeRecoveryPattern', patient.syncopeRecoveryPattern);
    updateSyncopeRecoveryContext();

    const postArr = Array.isArray(patient.syncopePostSymptoms) ? patient.syncopePostSymptoms : [];
    const postNone = Boolean(patient.syncope_post_none || postArr.includes('post_none_asymptomatic'));
    setChk('syncope_post_none', postNone);
    document.querySelectorAll('input[name="syncopePostSymptoms"]').forEach(cb => {
      cb.checked = !postNone && postArr.includes(cb.value);
    });

    // Zero Default Bias (P-AP14): Never default missing syncopeFallInjury to 'no'
    const derivedFall = patient.syncopeFallInjury && patient.syncopeFallInjury !== 'unspecified'
      ? patient.syncopeFallInjury
      : (signsArr.includes('syncope_head_facial_injury') ? 'yes' : '');
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
    const riskNone = Boolean(patient.syncope_risk_none || risksArr.includes('none_unremarkable'));
    setChk('syncope_risk_none', riskNone);
    document.querySelectorAll('input[name="syncopeRiskFactors"]').forEach(cb => {
      cb.checked = !riskNone && risksArr.includes(cb.value);
    });

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
      if (pregStat === 'pregnant') setVal('syncopePregnancyWeeks', patient.syncopePregnancyWeeks || '');
      setChk('syncope_fem_lower_abd_pain', patient.syncope_fem_lower_abd_pain);
      setChk('syncope_fem_pv_bleeding', patient.syncope_fem_pv_bleeding);
      setVal('syncopeLmpDate', patient.syncopeLmpDate || '');
    }

    setVal('syncope_other_free', patient.otherSymptomsFree || '');
  },

  collectIntake(ctx = {}) {
    const {
      recordId, queueNumber, randomHn, patientName, patientAge, gender,
      recordStatus, hospRecordStatus, underlying, drugAllergy, currentMeds,
      preservedDoctorNotes, otherSymptomsFree
    } = ctx;

    const rawDur = parseFloat(document.getElementById('syncopeDurationVal')?.value);
    const durationVal = (!isNaN(rawDur) && rawDur > 0) ? rawDur : null;
    const durationUnit = document.getElementById('syncopeDurationUnit')?.value || 'hours';
    const syncopeExactTimeUnknown = Boolean(document.getElementById('syncopeExactTimeUnknown')?.checked);
    const syncopeExactTime = syncopeExactTimeUnknown ? '' : (document.getElementById('syncopeExactTime')?.value?.trim() || '');

    const syncopeReporter = getSyncopeRadioValue('syncopeReporter') || 'unspecified';
    const syncopePosture = getSyncopeRadioValue('syncopePosture') || 'unspecified';
    const syncopeExertionTiming = syncopePosture === 'during_exertion' ? (getSyncopeRadioValue('syncopeExertionTiming') || '') : '';
    const syncopeRestingPosition = syncopePosture === 'supine_or_resting' ? (getSyncopeRadioValue('syncopeRestingPosition') || '') : '';
    const syncopePostureOtherText = syncopePosture === 'other' ? (document.getElementById('syncopePostureOtherText')?.value?.trim() || '') : '';

    const syncopeConsciousnessLevel = getSyncopeRadioValue('syncopeConsciousnessLevel') || 'unspecified';
    const syncopeUnconsciousDuration = syncopeConsciousnessLevel === 'true_syncope'
      ? (getSyncopeRadioValue('syncopeUnconsciousDuration') || 'unspecified')
      : (syncopeConsciousnessLevel === 'near_syncope' ? 'not_applicable' : 'unspecified');
    const syncopeDurationGte5mVal = (syncopeConsciousnessLevel === 'true_syncope' && syncopeUnconsciousDuration === 'prolonged_gte_5m')
      ? (parseInt(document.getElementById('syncopeDurationGte5mVal')?.value, 10) || null)
      : null;

    const syncopeEpisodeCount = getSyncopeRadioValue('syncopeEpisodeCount') || 'unspecified';
    const rawEpCnt = parseInt(document.getElementById('syncopeEpisodeCountVal')?.value, 10);
    const syncopeEpisodeCountVal = syncopeEpisodeCount === 'multiple_cluster'
      ? (!isNaN(rawEpCnt) && rawEpCnt >= 2 ? rawEpCnt : null)
      : (syncopeEpisodeCount === 'single' ? 1 : null);

    const syncope_prodrome_none = Boolean(document.getElementById('syncope_prodrome_none')?.checked);
    const checkedProdromes = Array.from(document.querySelectorAll('input[name="syncopeProdromes"]:checked')).map(cb => cb.value);
    const syncopeProdromes = syncope_prodrome_none ? ['none_sudden'] : checkedProdromes;

    const syncopeMotorCategory = getSyncopeRadioValue('syncopeMotorCategory') || 'unspecified';
    const syncopeMotorSign = syncopeMotorCategory === 'abnormal_movements'
      ? (getSyncopeRadioValue('syncopeMotorSign') || 'unspecified')
      : (syncopeMotorCategory === 'limp_flaccid' ? 'limp_flaccid' : 'unspecified');

    const syncope_signs_none = Boolean(document.getElementById('syncope_signs_none')?.checked);
    const syncopeSigns = syncope_signs_none
      ? []
      : Array.from(document.querySelectorAll('input[name="syncopeSigns"]:checked')).map(cb => cb.value);

    const syncopeRecoveryPattern = getSyncopeRadioValue('syncopeRecoveryPattern') || 'unspecified';
    const stillUnconscious = (syncopeConsciousnessLevel === 'true_syncope' && syncopeUnconsciousDuration === 'continuous_unconscious') ||
      syncopeRecoveryPattern === 'persistent_drowsy_coma';
    const syncope_post_none = !stillUnconscious && Boolean(document.getElementById('syncope_post_none')?.checked);
    const syncopePostSymptoms = stillUnconscious
      ? []
      : (syncope_post_none
        ? ['post_none_asymptomatic']
        : Array.from(document.querySelectorAll('input[name="syncopePostSymptoms"]:checked')).map(cb => cb.value));

    const syncopeFallInjury = getSyncopeRadioValue('syncopeFallInjury') || 'unspecified';
    const syncope_fall_head_impact = syncopeFallInjury === 'yes' && Boolean(document.getElementById('syncope_fall_head_impact')?.checked);
    const syncope_fall_open_wound = syncopeFallInjury === 'yes' && Boolean(document.getElementById('syncope_fall_open_wound')?.checked);
    const syncope_fall_limb_pain = syncopeFallInjury === 'yes' && Boolean(document.getElementById('syncope_fall_limb_pain')?.checked);
    const syncopeFallInjuryDetailText = syncopeFallInjury === 'yes'
      ? (document.getElementById('syncopeFallInjuryDetailText')?.value?.trim() || '')
      : '';

    const syncope_risk_none = Boolean(document.getElementById('syncope_risk_none')?.checked);
    const syncopeRiskFactors = syncope_risk_none
      ? ['none_unremarkable']
      : Array.from(document.querySelectorAll('input[name="syncopeRiskFactors"]:checked')).map(cb => cb.value);

    const isFem = gender === 'หญิง' || isSyncopeFemaleTitle();
    const syncopePregnancyStatus = isFem ? (getSyncopeRadioValue('syncopePregnancyStatus') || '') : 'not_applicable';
    const syncopePregnancyWeeks = (isFem && syncopePregnancyStatus === 'pregnant')
      ? (document.getElementById('syncopePregnancyWeeks')?.value?.trim() || '')
      : '';
    const syncope_fem_lower_abd_pain = isFem && Boolean(document.getElementById('syncope_fem_lower_abd_pain')?.checked);
    const syncope_fem_pv_bleeding = isFem && Boolean(document.getElementById('syncope_fem_pv_bleeding')?.checked);
    const syncopeLmpDate = isFem ? (document.getElementById('syncopeLmpDate')?.value?.trim() || '') : '';

    const freeBoxVal = document.getElementById('syncope_other_free')?.value?.trim() || '';
    const mergedFree = (otherSymptomsFree && String(otherSymptomsFree).trim()) || freeBoxVal;

    return {
      id: recordId,
      queue_number: queueNumber,
      hn: randomHn,
      name: patientName,
      age: patientAge,
      gender,
      chief_complaint: 'syncope',
      chief_complaint_title: 'หมดสติ / วูบ / เป็นลม',
      status: recordStatus,
      timestamp: new Date().toISOString(),
      durationVal,
      durationUnit,
      syncopeExactTimeUnknown,
      syncopeExactTime,
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
      syncope_prodrome_none,
      syncopeProdromes,
      syncopeMotorCategory,
      syncopeMotorSign,
      syncope_signs_none,
      syncopeSigns,
      syncopeRecoveryPattern,
      syncope_post_none,
      syncopePostSymptoms,
      syncopeFallInjury,
      syncope_fall_head_impact,
      syncope_fall_open_wound,
      syncope_fall_limb_pain,
      syncopeFallInjuryDetailText,
      syncope_risk_none,
      syncopeRiskFactors,
      syncopePregnancyStatus,
      syncopePregnancyWeeks,
      syncope_fem_lower_abd_pain,
      syncope_fem_pv_bleeding,
      syncopeLmpDate,
      otherSymptomsFree: mergedFree,
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
  window.handleSyncopeExactTimeUnknownChange = handleSyncopeExactTimeUnknownChange;
  window.handleSyncopePostureChange = handleSyncopePostureChange;
  window.updateSyncopeRecoveryContext = updateSyncopeRecoveryContext;
  window.handleSyncopeConsciousnessLevelChange = handleSyncopeConsciousnessLevelChange;
  window.handleSyncopeUnconsciousDurationChange = handleSyncopeUnconsciousDurationChange;
  window.handleSyncopeEpisodeCountChange = handleSyncopeEpisodeCountChange;
  window.handleSyncopeProdromeNoneChange = handleSyncopeProdromeNoneChange;
  window.handleSyncopeWarningChange = handleSyncopeWarningChange;
  window.handleSyncopeMotorCategoryChange = handleSyncopeMotorCategoryChange;
  window.handleSyncopeSignsNoneChange = handleSyncopeSignsNoneChange;
  window.handleSyncopeSignsItemChange = handleSyncopeSignsItemChange;
  window.handleSyncopePostNoneChange = handleSyncopePostNoneChange;
  window.handleSyncopePostSymptomChange = handleSyncopePostSymptomChange;
  window.handleSyncopeFallInjuryChange = handleSyncopeFallInjuryChange;
  window.handleSyncopeRiskNoneChange = handleSyncopeRiskNoneChange;
  window.handleSyncopeRiskChange = handleSyncopeRiskChange;
  window.handleSyncopePregnancyChange = handleSyncopePregnancyChange;
}
