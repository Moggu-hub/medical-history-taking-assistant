// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 08_seizure.js
// อาการนำ: ชัก / เกร็งกระตุก (Seizure / Convulsion — Golden 4-Card UX)
// ปรับปรุงตาม plan_seizure.md, SKILL_PLAN_CC (P-AP1–P-AP14) และ SKILL_CODE_CC (C-AP1–C-AP20)
// รองรับการเรียกร่วมกับ 09_syncope.js (calculateSheldonScore & evaluateHyperventilationScreen)
// และ core_engine.js (checkSeizurePediatricAgeGuidance)
// =========================================================================

function checkSeizurePediatricAgeGuidance() {
  syncSnFemaleSection();
  updateSnPostIctalContext();
}

function wrapSnWords(...chunks) {
  return chunks.map(c => `<span class="inline-block whitespace-nowrap">${c}</span>`).join(' ');
}

function toggleSnBranch(id, show) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('hidden', !show);
}

function renderSnCard(cfg) {
  const {
    kind = 'radio', id = '', name = '', value = '', title,
    desc = '', onchange = '', wrapId = '', colSpan2 = false, compact = false
  } = cfg;
  const wrapAttr = wrapId ? `id="${wrapId}" ` : '';
  const idAttr = id ? `id="${id}" ` : '';
  const nameAttr = name ? `name="${name}" ` : '';
  const valAttr = value ? `value="${value}" ` : '';
  const chgAttr = onchange ? `onchange="${onchange}" ` : '';
  const alignCls = desc ? 'items-start' : 'items-center';
  const padCls = compact ? 'p-2.5' : 'p-3';
  const spanCls = colSpan2 ? ' sm:col-span-2' : '';
  const roundCls = kind === 'checkbox' ? 'rounded ' : '';
  const topCls = desc ? 'mt-0.5 ' : '';
  const mlCls = compact ? 'ml-2' : 'ml-3';
  const titleCls = compact ? 'text-xs' : 'text-xs sm:text-sm';
  const bodyHtml = desc
    ? `<div class="${mlCls} leading-snug"><span class="block ${titleCls} font-semibold text-slate-800">${title}</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">${desc}</span></div>`
    : `<span class="${mlCls} ${titleCls} font-semibold text-slate-800 leading-snug">${title}</span>`;
  return `<label ${wrapAttr}class="selectable-card flex ${alignCls} ${padCls} rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition${spanCls}"><input type="${kind}" ${idAttr}${nameAttr}${valAttr}${chgAttr}class="${topCls}${roundCls}text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0">${bodyHtml}</label>`;
}

function renderSnGrid(colsCls, items, shared = {}) {
  return `<div class="grid ${colsCls} gap-2.5">${items.map(it => renderSnCard({ ...shared, ...it })).join('\n')}</div>`;
}

function renderSnSysHeader({ icon, iconBg, iconColor, title, noneId, noneLabel = 'ไม่มีอาการในหมวดนี้', noneOnchange }) {
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

function setSnRadioChecked(name, val) {
  if (val === undefined || val === null || val === '') return;
  const el = document.querySelector(`input[name="${name}"][value="${val}"]`);
  if (el) el.checked = true;
}

function clearSnRadioGroup(name) {
  document.querySelectorAll(`input[name="${name}"]`).forEach(el => {
    el.checked = false;
  });
}

function clearSnCheckboxesByIds(ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.checked = false;
  });
}

function getSnRadioValue(name) {
  return document.querySelector(`input[name="${name}"]:checked`)?.value || '';
}

function getSnCheckedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(el => el.value);
}

function isSnFemaleTitle(arg) {
  if (typeof arg === 'boolean') return arg;
  if (typeof arg === 'object' && arg !== null) {
    if (typeof arg.isFemale === 'boolean') return arg.isFemale;
    if (typeof arg.title === 'string') return /นาง|น\.ส\.|ด\.ญ\.|หญิง|Mrs|Miss|Ms/i.test(arg.title);
  }
  if (typeof arg === 'string') return /นาง|น\.ส\.|ด\.ญ\.|หญิง|Mrs|Miss|Ms/i.test(arg);
  const pfx = document.getElementById('patientTitleSelect')?.value || '';
  return /นาง|น\.ส\.|ด\.ญ\.|หญิง|Mrs|Miss|Ms/i.test(pfx);
}

function syncSnFemaleSection(explicitFemale) {
  const isFem = explicitFemale !== undefined ? Boolean(explicitFemale) : isSnFemaleTitle();
  const sec = document.getElementById('seizureFemaleSection');
  if (sec) sec.classList.toggle('hidden', !isFem);
  if (!isFem) {
    clearSnRadioGroup('snPregnancyStatus');
    toggleSnBranch('snPregnancyWeeksWrap', false);
    const wEl = document.getElementById('snPregnancyWeeks');
    if (wEl) wEl.value = '';
    const lmpEl = document.getElementById('snLmpDate');
    if (lmpEl) lmpEl.value = '';
  }
}

function handleSnExactTimeUnknownChange() {
  const unk = Boolean(document.getElementById('snExactTimeUnknown')?.checked);
  toggleSnBranch('snExactTimeWrap', !unk);
  if (unk) {
    const tEl = document.getElementById('snExactTime');
    if (tEl) tEl.value = '';
  }
}

function handleSnLossDurationChange() {
  const val = getSnRadioValue('snLossDuration');
  const isProlonged = val === 'prolonged_gte_5m';
  toggleSnBranch('snDurationGte5mWrap', isProlonged);
  if (!isProlonged) {
    const el = document.getElementById('snDurationGte5mVal');
    if (el) el.value = '';
  }
  updateSnPostIctalContext();
}

function handleSnEpisodeCountChange() {
  const val = getSnRadioValue('snEpisodeCount');
  const isMultiple = val === 'multiple_cluster';
  toggleSnBranch('snClusterSubWrap', isMultiple);
  if (!isMultiple) {
    const cnt = document.getElementById('snEpisodeCountVal');
    if (cnt) cnt.value = '';
    clearSnRadioGroup('snInterictalState');
  }
  updateSnPostIctalContext();
}

function handleSnPostureChange() {
  const val = getSnRadioValue('snPrecedingPosture');
  const isOther = val === 'other';
  toggleSnBranch('snPostureOtherWrap', isOther);
  if (!isOther) {
    const el = document.getElementById('snPostureOtherText');
    if (el) el.value = '';
  }
}

function handleSnProdromeNoneChange() {
  const noneEl = document.getElementById('sn_prodrome_none');
  if (noneEl && noneEl.checked) {
    document.querySelectorAll('input[name="snWarningProdrome"]').forEach(cb => {
      cb.checked = false;
    });
  }
}

function handleSnWarningChange(el) {
  if (!el) return;
  const noneEl = document.getElementById('sn_prodrome_none');
  if (el.checked && noneEl) noneEl.checked = false;
  if (el.checked && el.value === 'unknown') {
    document.querySelectorAll('input[name="snWarningProdrome"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  } else if (el.checked) {
    document.querySelectorAll('input[name="snWarningProdrome"]').forEach(cb => {
      if (cb.value === 'unknown') cb.checked = false;
    });
  }
}

function handleSnMotorPatternChange() {
  const val = getSnRadioValue('snMotorPattern');
  const isFocal = val === 'focal_motor';
  toggleSnBranch('snFocalBranchWrap', isFocal);
  if (!isFocal) {
    document.querySelectorAll('input[name="snFocalParts"]').forEach(cb => { cb.checked = false; });
    clearSnRadioGroup('snFocalSide');
    clearSnRadioGroup('snFocalAwareness');
  }
}

const SN_ICTAL_IDS = [
  'sn_lateral_tongue_bite', 'sn_eye_deviation', 'sn_incontinence',
  'sn_cyanosis_apnea', 'sn_marked_pallor_sweat'
];

function handleSnIctalNoneChange() {
  const noneEl = document.getElementById('sn_ictal_none');
  if (noneEl && noneEl.checked) {
    clearSnCheckboxesByIds(SN_ICTAL_IDS);
  }
}

function handleSnIctalItemChange(el) {
  if (el && el.checked) {
    const noneEl = document.getElementById('sn_ictal_none');
    if (noneEl) noneEl.checked = false;
  }
}

const SN_POST_IDS = [
  'sn_post_weakness', 'sn_post_headache', 'sn_post_myalgia', 'sn_post_nausea_vomit'
];

function handleSnRecoveryChange() {
  const rec = getSnRadioValue('snRecoveryDuration');
  const hidePostSymptoms = rec === 'persistent_unconscious';
  toggleSnBranch('snPostRecoverySymptomsWrap', !hidePostSymptoms);
  if (hidePostSymptoms) {
    clearSnCheckboxesByIds([...SN_POST_IDS, 'sn_post_none']);
    toggleSnBranch('snToddSideWrap', false);
    clearSnRadioGroup('snToddSide');
  }
}

function updateSnPostIctalContext() {
  const lossDur = getSnRadioValue('snLossDuration');
  const epCount = getSnRadioValue('snEpisodeCount');
  const interictal = getSnRadioValue('snInterictalState');
  const isActiveUnconscious =
    lossDur === 'continuous_unstopped' ||
    (epCount === 'multiple_cluster' && interictal === 'unconscious_or_drowsy');

  toggleSnBranch('snUnconsciousContextNotice', isActiveUnconscious);
  ['snRecOptWrap_rapid', 'snRecOptWrap_confused', 'snRecOptWrap_tearful'].forEach(id => {
    toggleSnBranch(id, !isActiveUnconscious);
  });

  if (isActiveUnconscious) {
    const rec = getSnRadioValue('snRecoveryDuration');
    if (rec && rec !== 'persistent_unconscious') {
      clearSnRadioGroup('snRecoveryDuration');
    }
    toggleSnBranch('snPostRecoverySymptomsWrap', false);
    clearSnCheckboxesByIds([...SN_POST_IDS, 'sn_post_none']);
    toggleSnBranch('snToddSideWrap', false);
    clearSnRadioGroup('snToddSide');
  } else {
    handleSnRecoveryChange();
  }
}

function handleSnPostNoneChange() {
  const noneEl = document.getElementById('sn_post_none');
  if (noneEl && noneEl.checked) {
    clearSnCheckboxesByIds(SN_POST_IDS);
    toggleSnBranch('snToddSideWrap', false);
    clearSnRadioGroup('snToddSide');
  }
}

function handleSnPostSymptomChange(el) {
  if (el && el.id === 'sn_post_none') {
    handleSnPostNoneChange();
    return;
  }
  if (el && el.checked) {
    const noneCb = document.getElementById('sn_post_none');
    if (noneCb) noneCb.checked = false;
  }
  const hasWeak = Boolean(document.getElementById('sn_post_weakness')?.checked);
  toggleSnBranch('snToddSideWrap', hasWeak);
  if (!hasWeak) clearSnRadioGroup('snToddSide');
}

function handleSnFallInjuryChange() {
  const hasFall = getSnRadioValue('snFallInjury') === 'yes';
  toggleSnBranch('snFallInjuryDetailWrap', hasFall);
  if (!hasFall) {
    clearSnCheckboxesByIds(['sn_fall_head_impact', 'sn_fall_open_wound', 'sn_fall_pain_swelling']);
    const txt = document.getElementById('snFallInjuryDetailText');
    if (txt) txt.value = '';
  }
}

function handleSnPriorHistoryChange() {
  const isEpilepsy = getSnRadioValue('snPriorHistory') === 'known_epilepsy';
  toggleSnBranch('snMedComplianceWrap', isEpilepsy);
  if (!isEpilepsy) clearSnRadioGroup('snMedCompliance');
}

const SN_RF_IDS = [
  'sn_rf_fever', 'sn_rf_meningismus', 'sn_rf_recent_head_trauma',
  'sn_rf_sleep_deprivation', 'sn_rf_alcohol_withdrawal', 'sn_rf_diabetic_hypo',
  'sn_rf_cardiac_history', 'sn_rf_family_scd', 'sn_rf_emotional_panic',
  'sn_rf_substance_toxin'
];

function handleSnRfNoneChange() {
  const noneEl = document.getElementById('sn_rf_none');
  if (noneEl && noneEl.checked) {
    clearSnCheckboxesByIds(SN_RF_IDS);
    toggleSnBranch('snSubstanceDetailsWrap', false);
    const el = document.getElementById('snSubstanceDetails');
    if (el) el.value = '';
  }
}

function handleSnRfItemChange(el) {
  if (el && el.checked) {
    const noneEl = document.getElementById('sn_rf_none');
    if (noneEl) noneEl.checked = false;
  }
  handleSnSubstanceChange();
}

function handleSnSubstanceChange() {
  const hasSub = Boolean(document.getElementById('sn_rf_substance_toxin')?.checked);
  toggleSnBranch('snSubstanceDetailsWrap', hasSub);
  if (!hasSub) {
    const el = document.getElementById('snSubstanceDetails');
    if (el) el.value = '';
  }
}

function handleSnPregnancyChange() {
  const isPreg = getSnRadioValue('snPregnancyStatus') === 'pregnant';
  toggleSnBranch('snPregnancyWeeksWrap', isPreg);
  if (!isPreg) {
    const el = document.getElementById('snPregnancyWeeks');
    if (el) el.value = '';
  }
}

// -------------------------------------------------------------------------
// SHARED TLOC DIFFERENTIAL SCORING (Used by both 08_seizure.js & 09_syncope.js)
// -------------------------------------------------------------------------
function calculateSheldonScore(patient) {
  let score = 0;
  const details = [];
  const isSyncope = patient?.chief_complaint === 'syncope';

  const prodromes = isSyncope
    ? (patient.syncopeProdromes || [])
    : (Array.isArray(patient.snWarningProdromes)
      ? patient.snWarningProdromes
      : (Array.isArray(patient.seizureWarningProdromes) ? patient.seizureWarningProdromes : []));

  const hasTongueBite = isSyncope
    ? (patient.syncopeSigns || []).includes('syncope_lateral_tongue_bite')
    : Boolean(patient.sn_lateral_tongue_bite || patient.seizure_lateral_tongue_bite);
  if (hasTongueBite) {
    score += 2;
    details.push('กัดลิ้นด้านข้าง (+2)');
  }

  const hasAura = prodromes.some(p => p === 'epigastric_rising' || p === 'olfactory_gustatory' || p === 'olfactory_visual_aura');
  if (hasAura) {
    score += 1;
    details.push('มีอาการเตือน Aura ในท้อง/กลิ่นไหม้ (+1)');
  }

  const hasEyeDev = isSyncope ? false : Boolean(patient.sn_eye_deviation || patient.seizure_eye_deviation);
  if (hasEyeDev) {
    score += 1;
    details.push('ตาค้าง/ตาเหลือกเบนไปข้างหนึ่ง (+1)');
  }

  const recov = patient.snRecoveryDuration || patient.seizureRecoveryDuration;
  const hasConfusionGt5m = isSyncope
    ? (patient.syncopeRecoveryPattern === 'prolonged_confusion' || patient.syncopeRecoveryPattern === 'persistent_drowsy_coma')
    : recov === 'confusion_drowsy_gt_5m';
  if (hasConfusionGt5m) {
    score += 1;
    details.push('สับสนมึนงงหลังฟื้นนานเกิน 5 นาที (+1)');
  }

  const hasHeadacheMyalgia = isSyncope
    ? (patient.syncopePostSymptoms || []).includes('post_severe_headache_myalgia')
    : Boolean(patient.sn_post_headache || patient.sn_post_myalgia || patient.seizurePostEventSymptoms === 'headache_severe_myalgia');
  if (hasHeadacheMyalgia) {
    score += 1;
    details.push('ปวดศีรษะรุนแรงและปวดกล้ามเนื้อระบม (+1)');
  }

  const motor = isSyncope
    ? ((patient.syncopeMotorCategory === 'abnormal_movements' && patient.syncopeMotorSign) || patient.syncopeMotorSign)
    : (patient.snMotorPattern || patient.seizureMotorPattern);
  if (motor === 'generalized_tonic_clonic') {
    score += 1;
    details.push('เกร็งกระตุกเป็นจังหวะต่อเนื่องเป็นหลักนาที (+1)');
  }

  if (prodromes.includes('lightheaded_tunnel_vision')) {
    score -= 2;
    details.push('มีอาการหน้ามืด/ตามัว/หูอื้อนำมาก่อน (-2)');
  }

  const hasSweatPallorNausea = isSyncope
    ? (prodromes.includes('cold_sweat_pallor_nausea') || (patient.syncopeSigns || []).includes('syncope_marked_pallor_sweat'))
    : (prodromes.includes('cold_sweat_pallor_nausea') || Boolean(patient.sn_marked_pallor_sweat || patient.seizure_marked_pallor_sweat));
  if (hasSweatPallorNausea) {
    score -= 1;
    details.push('เหงื่อแตกตัวเย็นหน้าซีด (-1)');
  }

  const posture = isSyncope ? patient.syncopePosture : (patient.snPrecedingPosture || patient.seizurePrecedingPosture);
  if (posture === 'prolonged_standing' || posture === 'sudden_standing') {
    score -= 2;
    details.push('เกิดขึ้นขณะยืนนานหรือลุกเร็ว (-2)');
  }

  const hasRapidRecovery = isSyncope
    ? patient.syncopeRecoveryPattern === 'rapid_spontaneous'
    : recov === 'rapid_under_2m_alert';
  if (hasRapidRecovery) {
    score -= 2;
    details.push('ฟื้นคืนสติอย่างรวดเร็วภายใน 1-2 นาทีไม่งง (-2)');
  }

  return {
    score,
    details,
    interpretation: score >= 1
      ? `⚡ เข้าได้กับโรคลมชัก (Probable Epileptic Seizure — Sheldon Score = ${score} >= 1)`
      : `💧 เข้าได้กับภาวะเป็นลมหมดสติ (Probable Syncope / Convulsive Syncope — Sheldon Score = ${score} < 1)`
  };
}

function evaluateHyperventilationScreen(patient) {
  const isSyncope = patient?.chief_complaint === 'syncope';
  const prodromes = Array.isArray(patient.snWarningProdromes)
    ? patient.snWarningProdromes
    : (Array.isArray(patient.seizureWarningProdromes) ? patient.seizureWarningProdromes : []);
  const isHvs = isSyncope
    ? Boolean(
        (patient.syncopeMotorCategory === 'abnormal_movements' && patient.syncopeMotorSign === 'carpopedal_spasm') ||
        patient.syncopeMotorSign === 'carpopedal_spasm' ||
        (patient.syncopeProdromes || []).includes('hyperventilation_tingling')
      )
    : Boolean(
        (patient.snMotorPattern || patient.seizureMotorPattern) === 'carpopedal_spasm' ||
        prodromes.includes('hyperventilation_tingling') ||
        (patient.snRecoveryDuration || patient.seizureRecoveryDuration) === 'tearful_emotional_tachypnea' ||
        patient.sn_rf_emotional_panic ||
        patient.seizure_rf_emotional_panic_trigger
      );
  return {
    isSuspected: isHvs,
    label: isHvs
      ? '🫁 เข้าได้กับกลุ่มอาการหายใจหอบเร็วและมือจีบเกร็ง (Suspected Hyperventilation Syndrome with Carpopedal Spasm / Tetany)'
      : '✓ ไม่พบอาการจำเพาะของกลุ่มอาการหายใจหอบเร็ว'
  };
}

// --- Lookup Tables (Thai Labels for 100% Zero Raw Enum Leaks — C-AP14 / C-AP19) ---
const SN_LABELS = {
  reporter: {
    patient_self: 'ผู้ป่วยให้ข้อมูลด้วยตนเอง',
    witness_relative: 'ญาติหรือผู้เห็นเหตุการณ์เป็นผู้เล่า',
    both_patient_witness: 'ผู้ป่วยและผู้เห็นเหตุการณ์ร่วมกันให้ข้อมูล',
    unspecified: 'ไม่ได้ระบุ'
  },
  posture: {
    prolonged_standing: 'ยืนนาน หรืออยู่ในที่ร้อนแออัด',
    sudden_standing: 'ลุกยืนหรือเปลี่ยนท่าเร็ว',
    during_exertion: 'ขณะออกแรง หรือออกกำลังกาย',
    supine_or_resting: 'ขณะนั่งพัก หรือนอนอยู่เฉยๆ',
    sleep: 'ขณะกำลังนอนหลับ',
    standing_or_walking_normal: 'ขณะยืนหรือเดินตามปกติ',
    micturition_defecation: 'ขณะหรือหลังขับถ่าย ปัสสาวะ หรือไอแรง',
    unspecified: 'ไม่ได้ระบุ'
  },
  lossDuration: {
    brief_seconds: 'สั้นมาก (< 1 นาที ประมาณ 10–30 วินาที)',
    typical_1_4m: 'ประมาณ 1–4 นาที',
    continuous_unstopped: 'ชักต่อเนื่องยังไม่หยุดจนถึงขณะนี้',
    unknown_duration: 'ไม่ทราบระยะเวลาที่แน่นอน',
    unspecified: 'ไม่ได้ระบุ'
  },
  interictal: {
    full_recovery: 'ระหว่างรอบฟื้นคืนสติ พูดคุยรู้เรื่องดี',
    unconscious_or_drowsy: 'ระหว่างรอบไม่ฟื้นสติ หรือซึมตลอดเวลา',
    unspecified: 'ไม่ได้ระบุสภาพระหว่างรอบ'
  },
  prodrome: {
    none_sudden: 'ไม่มีอาการเตือน เกิดขึ้นกะทันหัน',
    lightheaded_tunnel_vision: 'หน้ามืด ตาพร่ามัว หรือหูอื้อ',
    cold_sweat_pallor_nausea: 'เหงื่อแตก ตัวเย็น หรือหน้าซีด',
    sudden_palpitation: 'ใจสั่นรัว หรือหัวใจเต้นสะดุด',
    chest_pain: 'เจ็บแน่นหน้าอก',
    hyperventilation_tingling: 'หายใจหอบเร็ว หรือชารอบปากและปลายมือ',
    epigastric_rising: 'จุกโหวงในท้องลอยขึ้นมาที่คอ (Aura)',
    olfactory_visual_aura: 'ได้กลิ่นแปลกๆ หรือเห็นแสงวูบวาบ (Aura)',
    unknown: 'ไม่ทราบ / จำไม่ได้'
  },
  motor: {
    generalized_tonic_clonic: 'เกร็งแข็งและกระตุกทั้งตัว (GTCS)',
    focal_motor: 'เกร็งหรือกระตุกเฉพาะบางส่วน (Focal)',
    brief_myoclonic_syncope: 'วูบล้มแล้วกระตุกเบาๆ สั้นๆ',
    carpopedal_spasm: 'มือจีบเกร็งทั้งสองข้าง',
    absence_automatism: 'เหม่อลอย นิ่งค้างไม่ตอบสนอง',
    atonic_limp: 'ตัวอ่อนปวกเปียก ไม่เกร็ง',
    thrashing_closed_eyes: 'ดิ้นสะบัด หรือส่ายหน้าขณะหลับตา',
    unknown_or_unobserved: 'ไม่ทราบ / ไม่มีผู้เห็นเหตุการณ์',
    unspecified: 'ไม่ได้ระบุ'
  },
  focalParts: {
    face_mouth: 'ใบหน้า/มุมปาก',
    arm_hand: 'แขน/มือ',
    leg_foot: 'ขา/เท้า'
  },
  focalSides: {
    left: 'ข้างซ้าย',
    right: 'ข้างขวา',
    bilateral_or_secondarily_generalized: 'สลับข้างหรือลามทั้งตัว'
  },
  focalAwareness: {
    aware: 'รู้สึกตัวดีขณะกระตุก',
    impaired: 'เหม่อลอยหรือไม่รู้สึกตัว'
  },
  recovery: {
    rapid_under_2m_alert: 'ฟื้นสติเร็วมาก (ภายใน 1–2 นาที)',
    confusion_drowsy_gt_5m: 'สับสน มึนงง หรือหลับลึกนานเกิน 5 นาที',
    tearful_emotional_tachypnea: 'รู้สึกตัวดี แต่ยังหอบ ร้องไห้ หรือมือชา',
    persistent_unconscious: 'ขณะนี้ยังไม่ฟื้นสติ หรือซึมปลุกตื่นยาก',
    unspecified: 'ไม่ได้ระบุ'
  },
  toddSides: {
    left: 'ซีกซ้าย',
    right: 'ซีกขวา',
    both: 'ทั้งสองข้าง'
  },
  priorHistory: {
    first_time_tloc: 'เพิ่งเคยเป็นครั้งแรกในชีวิต',
    known_epilepsy: 'เป็นโรคลมชักเดิมอยู่แล้ว',
    recurrent_vasovagal: 'เคยเป็นลมหน้ามืดบ่อยๆ',
    unspecified: 'ไม่ได้ระบุ'
  },
  compliance: {
    compliant: 'รับประทานยาสม่ำเสมอทุกวัน',
    missed_or_stopped: 'ขาดยา ลืมกิน หรือหยุดยาเอง',
    dose_changed: 'เพิ่งปรับขนาดยาหรือเปลี่ยนชนิดยา',
    lost_followup: 'ไม่ได้รักษาต่อเนื่อง หรือขาดนัด',
    unspecified: 'ไม่ได้ระบุ'
  },
  pregnancy: {
    not_pregnant: 'ไม่ได้ตั้งครรภ์',
    pregnant: 'กำลังตั้งครรภ์',
    postpartum_6w: 'เพิ่งคลอด หรือแท้งบุตรภายใน 6 สัปดาห์',
    menopause_or_hysterectomy: 'หมดประจำเดือน / ผ่าตัดมดลูกแล้ว',
    unknown: 'ไม่แน่ใจสถานะการตั้งครรภ์'
  }
};

function formatSnMotorSummary(patient) {
  const base = SN_LABELS.motor[patient.snMotorPattern] || SN_LABELS.motor.unspecified;
  if (patient.snMotorPattern !== 'focal_motor') return base;
  const parts = Array.isArray(patient.snFocalParts) ? patient.snFocalParts.map(x => SN_LABELS.focalParts[x] || x) : [];
  const side = patient.snFocalSide ? (SN_LABELS.focalSides[patient.snFocalSide] || patient.snFocalSide) : '';
  const aware = patient.snFocalAwareness ? (SN_LABELS.focalAwareness[patient.snFocalAwareness] || patient.snFocalAwareness) : '';
  const extras = [];
  if (parts.length > 0) extras.push(`ตำแหน่ง: ${parts.join(', ')}`);
  if (side) extras.push(side);
  if (aware) extras.push(aware);
  return extras.length > 0 ? `${base} [${extras.join(' | ')}]` : base;
}

function makeSnSeed(ov) {
  return {
    chief_complaint: 'seizure', chief_complaint_title: 'ชัก / เกร็งกระตุก', status: 'waiting',
    snExactTimeUnknown: false, snExactTime: '', snDurationGte5mVal: null, snEpisodeCount: 'single',
    snEpisodeCountVal: 1, snInterictalState: '', snPostureOtherText: '', sn_prodrome_none: false,
    snWarningProdromes: [], snFocalParts: [], snFocalSide: '', snFocalAwareness: '', sn_ictal_none: false,
    sn_lateral_tongue_bite: false, sn_eye_deviation: false, sn_incontinence: false, sn_cyanosis_apnea: false,
    sn_marked_pallor_sweat: false, sn_post_weakness: false, snToddSide: '', sn_post_headache: false,
    sn_post_myalgia: false, sn_post_nausea_vomit: false, sn_post_none: false, snFallInjury: 'no',
    sn_fall_head_impact: false, sn_fall_open_wound: false, sn_fall_pain_swelling: false, snFallInjuryDetailText: '',
    snMedCompliance: 'unspecified', sn_rf_none: false, sn_rf_fever: false, sn_rf_meningismus: false,
    sn_rf_fever_meningismus: false, sn_rf_recent_head_trauma: false, sn_rf_sleep_deprivation: false,
    sn_rf_alcohol_withdrawal: false, sn_rf_diabetic_hypo: false, sn_rf_cardiac_history: false,
    sn_rf_family_scd: false, sn_rf_cardiac_family: false, sn_rf_emotional_panic: false,
    sn_rf_substance_toxin: false, snSubstanceDetails: '', snPregnancyStatus: '', snPregnancyWeeks: '',
    snLmpDate: '', otherSymptomsFree: '', drugAllergy: 'ปฏิเสธ', ...ov
  };
}

const seizureModule = {
  id: 'seizure',
  recordCc: 'seizure',
  titleTh: 'ชัก / เกร็งกระตุก',
  titleEn: 'Seizure / Convulsion',
  icon: 'zap',
  sectionDomId: 'seizureQuestionnaireSection',
  pmhSectionNumber: 5,
  getPmhSectionNumber: () => 5,
  doctorCcBadgeHtml: '<i data-lucide="zap" class="w-3 h-3 mr-1"></i> CC: ชัก / เกร็งกระตุก (Seizure / TLOC)',
  dateFields: ['snLmpDate'],
  timeFields: ['snExactTime'],
  branchIds: [
    'snExactTimeWrap', 'snDurationGte5mWrap', 'snClusterSubWrap', 'snPostureOtherWrap',
    'snFocalBranchWrap', 'snUnconsciousContextNotice', 'snPostRecoverySymptomsWrap',
    'snToddSideWrap', 'snFallInjuryDetailWrap', 'snMedComplianceWrap',
    'snSubstanceDetailsWrap', 'seizureFemaleSection', 'snPregnancyWeeksWrap'
  ],
  inputIdsToClear: [
    'snDurationVal', 'snExactTime', 'snDurationGte5mVal', 'snEpisodeCountVal',
    'snPostureOtherText', 'snFallInjuryDetailText', 'snSubstanceDetails',
    'snPregnancyWeeks', 'snLmpDate', 'seizure_other_free'
  ],

  formHtml: `
    <div id="seizureQuestionnaireSection" class="hidden space-y-6">
      <!-- TOP BANNER: แสดงเหนือการ์ดข้อมูลผู้ป่วยเบื้องต้น (ไม่สร้างแบนเนอร์เด็กซ้ำซ้อน; คง hidden node รองรับ core_engine.js) -->
      <div data-cc-top-banner="seizure">
        <div id="seizurePediatricAgeBanner" class="hidden" aria-hidden="true"></div>
        <div class="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-start space-x-3 text-xs text-slate-800 leading-relaxed">
          <i data-lucide="info" class="w-5 h-5 text-medical-600 mt-0.5 flex-shrink-0"></i>
          <div class="space-y-1">
            <p class="font-bold text-slate-900">ข้อแนะนำการดูแลความปลอดภัยเบื้องต้นระหว่างรอพบแพทย์:</p>
            <p>1. <strong>จัดท่านอนตะแคงกึ่งคว่ำ:</strong> หากผู้ป่วยยังเกร็งกระตุกหรือง่วงซึม ให้จัดนอนตะแคงและหนุนศีรษะด้วยของนุ่ม เพื่อป้องกันการสำลักและป้องกันศีรษะกระแทก</p>
            <p>2. <strong>ห้ามงัดปากหรือใส่สิ่งของเข้าปากเด็ดขาด:</strong> ห้ามใช้ช้อน นิ้วมือ หรือสิ่งของงัดปาก และให้งดน้ำงดอาหารทุกชนิดไว้ก่อน</p>
            <p>3. <strong>แจ้งพยาบาลหน้าห้องตรวจทันที:</strong> หากเริ่มชักซ้ำ ชักนานต่อเนื่อง หายใจลำบาก ริมฝีปากเขียวคล้ำ หรือปลุกไม่ตื่น</p>
          </div>
        </div>
      </div>

      <!-- CARD 1: ข้อมูลเหตุการณ์ ช่วงเวลา ความถี่ และท่าทางก่อนเกิดเหตุ -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
        <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="clock" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">1. ข้อมูลเหตุการณ์ ช่วงเวลา ความถี่ และท่าทางก่อนเกิดเหตุ</h2>
            <p class="text-xs text-slate-500">ระบุเวลาเกิดเหตุ ระยะเวลาที่ชัก ความถี่ และกิจกรรมก่อนมีอาการ</p>
          </div>
        </div>

        <!-- 1.1 ผู้ให้ข้อมูล -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-2">1.1 ผู้ให้ข้อมูลประวัติเหตุการณ์: <span class="text-rose-500">*</span></label>
          ${renderSnGrid('grid-cols-1 sm:grid-cols-3', [
            { value: 'patient_self', title: wrapSnWords('ผู้ป่วยให้ข้อมูลเอง') },
            { value: 'witness_relative', title: wrapSnWords('ญาติ /', 'ผู้เห็นเหตุการณ์') },
            { value: 'both_patient_witness', title: wrapSnWords('ให้ข้อมูลร่วมกัน') }
          ], { kind: 'radio', name: 'snReporter' })}
        </div>

        <!-- 1.2 ระยะเวลาและเวลาเกิดเหตุ -->
        <div class="space-y-3 pt-2 border-t border-slate-100">
          <label class="block text-xs font-bold text-slate-700">1.2 ระยะเวลาตั้งแต่เริ่มเกิดเหตุ และเวลาเกิดเหตุล่าสุด: <span class="text-rose-500">*</span></label>
          <div class="flex flex-wrap items-center gap-3">
            <div class="flex items-center space-x-2">
              <input type="number" id="snDurationVal" min="0" placeholder="เช่น 30"
                class="w-24 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 text-center font-bold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white">
              <select id="snDurationUnit" class="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white">
                <option value="minutes">นาที</option>
                <option value="hours" selected>ชั่วโมง</option>
                <option value="days">วัน</option>
                <option value="weeks">สัปดาห์</option>
                <option value="months">เดือน</option>
                <option value="years">ปี</option>
              </select>
            </div>
            <div id="snExactTimeWrap" class="flex items-center space-x-2">
              <span class="text-xs font-semibold text-slate-600 whitespace-nowrap">เวลาเกิดเหตุ (24 ชม.):</span>
              <input type="text" id="snExactTime" data-universal-time="true" placeholder="เช่น 14:30"
                class="w-28 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white">
            </div>
            <label class="selectable-card inline-flex items-center px-3 py-2 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="snExactTimeUnknown" onchange="handleSnExactTimeUnknownChange()" class="rounded text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0">
              <span class="ml-3 text-xs font-semibold text-slate-800 whitespace-nowrap">ไม่ทราบเวลาแน่ชัด</span>
            </label>
          </div>
        </div>

        <!-- 1.3 ระยะเวลาที่ชักเกร็งหรือหมดสติในแต่ละครั้ง -->
        <div class="pt-2 border-t border-slate-100">
          <label class="block text-xs font-bold text-slate-700 mb-2">1.3 ระยะเวลาที่ชักเกร็งหรือหมดสติในแต่ละครั้ง: <span class="text-rose-500">*</span></label>
          ${renderSnGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', [
            { value: 'brief_seconds', title: wrapSnWords('สั้นมาก', '(< 1 นาที)'), desc: 'ประมาณ 10–30 วินาที' },
            { value: 'typical_1_4m', title: wrapSnWords('ประมาณ 1–4 นาที') },
            { value: 'prolonged_gte_5m', title: wrapSnWords('ตั้งแต่ 5 นาทีขึ้นไป') },
            { value: 'continuous_unstopped', title: wrapSnWords('ชักต่อเนื่อง', 'ยังไม่หยุด') },
            { value: 'unknown_duration', title: wrapSnWords('ไม่ทราบระยะเวลา') }
          ], { kind: 'radio', name: 'snLossDuration', onchange: 'handleSnLossDurationChange()' })}
          <div id="snDurationGte5mWrap" class="hidden mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <span class="font-semibold text-slate-800 block">ระบุระยะเวลาโดยประมาณ:</span>
            <div class="flex items-center space-x-2 max-w-xs">
              <input type="number" id="snDurationGte5mVal" min="5" max="720" placeholder="เช่น 10, 15, 30"
                class="w-28 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 text-center font-bold focus:outline-none focus:ring-2 focus:ring-medical-500">
              <span class="text-slate-600 font-medium">นาที</span>
            </div>
          </div>
        </div>

        <!-- 1.4 จำนวนครั้งที่มีอาการในรอบ 24 ชั่วโมงที่ผ่านมา -->
        <div class="pt-2 border-t border-slate-100">
          <label class="block text-xs font-bold text-slate-700 mb-2">1.4 จำนวนครั้งที่มีอาการใน 24 ชั่วโมงที่ผ่านมา: <span class="text-rose-500">*</span></label>
          ${renderSnGrid('grid-cols-1 sm:grid-cols-2', [
            { value: 'single', title: wrapSnWords('เกิดขึ้นครั้งเดียว') },
            { value: 'multiple_cluster', title: wrapSnWords('เกิดซ้ำตั้งแต่', '2 ครั้งขึ้นไป') }
          ], { kind: 'radio', name: 'snEpisodeCount', onchange: 'handleSnEpisodeCountChange()' })}
          <div id="snClusterSubWrap" class="hidden mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
            <div class="space-y-1.5">
              <span class="font-semibold text-slate-800 block">1.4.1 จำนวนครั้งทั้งหมดในวันนี้:</span>
              <div class="flex items-center space-x-2 max-w-xs">
                <input type="number" id="snEpisodeCountVal" min="2" max="50" placeholder="เช่น 2 หรือ 3"
                  class="w-24 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 text-center font-bold focus:outline-none focus:ring-2 focus:ring-medical-500">
                <span class="text-slate-600 font-medium">ครั้ง</span>
              </div>
            </div>
            <div class="pt-2 border-t border-slate-200 space-y-2">
              <span class="font-semibold text-slate-800 block">1.4.2 ความรู้สึกตัวระหว่างรอบ:</span>
              ${renderSnGrid('grid-cols-1 sm:grid-cols-2', [
                { value: 'full_recovery', title: wrapSnWords('ฟื้นคืนสติ', 'พูดคุยรู้เรื่อง'), desc: 'ระหว่างรอบตื่นรู้ตัวและพูดคุยตอบสนองได้ตามปกติ' },
                { value: 'unconscious_or_drowsy', title: wrapSnWords('ไม่ฟื้นสติ /', 'ซึมตลอดเวลา'), desc: 'ระหว่างรอบยังไม่ตื่นรู้ตัว ซึมมาก หรือชักซ้ำต่อเนื่องทันที' }
              ], { kind: 'radio', name: 'snInterictalState', onchange: 'updateSnPostIctalContext()' })}
            </div>
          </div>
        </div>

        <!-- 1.5 ท่าทางหรือกิจกรรมก่อนเกิดอาการ -->
        <div class="pt-2 border-t border-slate-100">
          <label class="block text-xs font-bold text-slate-700 mb-2">1.5 ท่าทางหรือกิจกรรมก่อนเกิดอาการทันที: <span class="text-rose-500">*</span></label>
          ${renderSnGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-4', [
            { value: 'prolonged_standing', title: wrapSnWords('ยืนนาน /', 'อยู่ในที่ร้อนแออัด') },
            { value: 'sudden_standing', title: wrapSnWords('ลุกยืน /', 'เปลี่ยนท่าเร็ว') },
            { value: 'during_exertion', title: wrapSnWords('ขณะออกแรง /', 'ออกกำลังกาย') },
            { value: 'supine_or_resting', title: wrapSnWords('ขณะนั่งพัก /', 'นอนเฉยๆ') },
            { value: 'sleep', title: wrapSnWords('ขณะกำลังนอนหลับ') },
            { value: 'standing_or_walking_normal', title: wrapSnWords('ยืนหรือเดินตามปกติ') },
            { value: 'micturition_defecation', title: wrapSnWords('ขณะขับถ่าย /', 'ปัสสาวะ /', 'ไอแรง') },
            { value: 'other', title: wrapSnWords('อื่นๆ') }
          ], { kind: 'radio', name: 'snPrecedingPosture', onchange: 'handleSnPostureChange()' })}
          <div id="snPostureOtherWrap" class="hidden mt-2.5">
            <input type="text" id="snPostureOtherText" placeholder="ระบุท่าทางหรือกิจกรรมก่อนเกิดอาการ..."
              class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white">
          </div>
        </div>
      </div>

      <!-- CARD 2: อาการเตือนนำ ลักษณะการเกร็งกระตุก และอาการร่วมขณะเกิดเหตุ -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
        <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="activity" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">2. อาการเตือนนำ ลักษณะการเกร็งกระตุก และอาการร่วมขณะเกิดเหตุ</h2>
            <p class="text-xs text-slate-500">ประเมินอาการนำก่อนหมดสติ ลักษณะการเคลื่อนไหว และอาการร่วมที่สังเกตเห็น</p>
          </div>
        </div>

        <!-- 2.1 อาการเตือนนำ -->
        <div>
          ${renderSnSysHeader({
            icon: 'alert-circle',
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-600',
            title: '2.1 อาการเตือนก่อนหมดสติหรือชัก (เลือกได้หลายข้อ)',
            noneId: 'sn_prodrome_none',
            noneLabel: 'ไม่มีอาการเตือน (เกิดขึ้นทันที)',
            noneOnchange: 'handleSnProdromeNoneChange()'
          })}
          ${renderSnGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-4', [
            { value: 'lightheaded_tunnel_vision', title: wrapSnWords('หน้ามืด /', 'ตาพร่ามัว /', 'หูอื้อ') },
            { value: 'cold_sweat_pallor_nausea', title: wrapSnWords('เหงื่อแตก /', 'ตัวเย็น /', 'หน้าซีด') },
            { value: 'sudden_palpitation', title: wrapSnWords('ใจสั่นรัว /', 'หัวใจเต้นสะดุด') },
            { value: 'chest_pain', title: wrapSnWords('เจ็บแน่นหน้าอก') },
            { value: 'hyperventilation_tingling', title: wrapSnWords('หายใจหอบเร็ว /', 'ชารอบปาก-มือ') },
            { value: 'epigastric_rising', title: wrapSnWords('จุกโหวงในท้อง', 'ลอยขึ้นคอ'), desc: 'คล้ายลมตีจากท้องขึ้นหน้าอก/คอ' },
            { value: 'olfactory_visual_aura', title: wrapSnWords('ได้กลิ่นแปลก /', 'เห็นแสงวูบวาบ'), desc: 'เช่น กลิ่นเหม็นไหม้ หรือแสงกะพริบ' },
            { value: 'unknown', title: wrapSnWords('ไม่ทราบ /', 'จำไม่ได้') }
          ], { kind: 'checkbox', name: 'snWarningProdrome', onchange: 'handleSnWarningChange(this)' })}
        </div>

        <!-- 2.2 ลักษณะการเกร็งหรือกระตุกของร่างกายขณะเกิดเหตุ -->
        <div class="pt-2 border-t border-slate-100">
          <label class="block text-xs font-bold text-slate-700 mb-2">2.2 ลักษณะการเกร็งหรือกระตุกขณะเกิดเหตุ: <span class="text-rose-500">*</span></label>
          ${renderSnGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-4', [
            { value: 'generalized_tonic_clonic', title: wrapSnWords('เกร็งแข็งและ', 'กระตุกทั้งตัว') },
            { value: 'focal_motor', title: wrapSnWords('เกร็งหรือกระตุก', 'เฉพาะบางส่วน'), desc: 'เช่น เฉพาะมุมปาก แขน หรือขาข้างเดียว' },
            { value: 'brief_myoclonic_syncope', title: wrapSnWords('วูบล้มแล้วกระตุก', 'เบาๆ สั้นๆ'), desc: 'กระตุกไม่กี่ครั้งเพียงไม่กี่วินาที' },
            { value: 'carpopedal_spasm', title: wrapSnWords('มือจีบเกร็ง', 'ทั้งสองข้าง'), desc: 'ข้อมือและนิ้วงุ้มจีบเข้าหากัน' },
            { value: 'absence_automatism', title: wrapSnWords('เหม่อลอย /', 'นิ่งค้างไม่ตอบสนอง'), desc: 'อาจเคี้ยวปากหรือขยำมือซ้ำๆ' },
            { value: 'atonic_limp', title: wrapSnWords('ตัวอ่อนปวกเปียก', 'ไม่เกร็ง') },
            { value: 'thrashing_closed_eyes', title: wrapSnWords('ดิ้นสะบัด /', 'ส่ายหน้าขณะหลับตา') },
            { value: 'unknown_or_unobserved', title: wrapSnWords('ไม่ทราบ /', 'ไม่มีผู้เห็นเหตุการณ์') }
          ], { kind: 'radio', name: 'snMotorPattern', onchange: 'handleSnMotorPatternChange()' })}

          <!-- 2.2.1 กิ่งย่อย Focal Seizure (วางใต้แถวตาราง แยกแถวตำแหน่ง / ข้าง / ความรู้สึกตัว) -->
          <div id="snFocalBranchWrap" class="hidden mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
            <div>
              <span class="font-semibold text-slate-800 block mb-1.5">ตำแหน่งที่มีอาการเกร็งหรือกระตุก (เลือกได้หลายข้อ):</span>
              ${renderSnGrid('grid-cols-1 sm:grid-cols-3', [
                { value: 'face_mouth', title: wrapSnWords('ใบหน้า /', 'มุมปาก') },
                { value: 'arm_hand', title: wrapSnWords('แขน /', 'มือ') },
                { value: 'leg_foot', title: wrapSnWords('ขา /', 'เท้า') }
              ], { kind: 'checkbox', name: 'snFocalParts', compact: true })}
            </div>
            <div class="pt-2 border-t border-slate-200">
              <span class="font-semibold text-slate-800 block mb-1.5">ข้างที่มีอาการ:</span>
              ${renderSnGrid('grid-cols-1 sm:grid-cols-3', [
                { value: 'left', title: wrapSnWords('ข้างซ้าย') },
                { value: 'right', title: wrapSnWords('ข้างขวา') },
                { value: 'bilateral_or_secondarily_generalized', title: wrapSnWords('สลับข้าง /', 'ลามทั้งตัว') }
              ], { kind: 'radio', name: 'snFocalSide', compact: true })}
            </div>
            <div class="pt-2 border-t border-slate-200">
              <span class="font-semibold text-slate-800 block mb-1.5">ความรู้สึกตัวขณะกระตุก:</span>
              ${renderSnGrid('grid-cols-1 sm:grid-cols-2', [
                { value: 'aware', title: wrapSnWords('รู้สึกตัวดี') },
                { value: 'impaired', title: wrapSnWords('เหม่อลอย /', 'ไม่รู้สึกตัว') }
              ], { kind: 'radio', name: 'snFocalAwareness', compact: true })}
            </div>
          </div>
        </div>

        <!-- 2.3 อาการร่วมที่สังเกตเห็นขณะเกิดเหตุ -->
        <div class="pt-2 border-t border-slate-100">
          ${renderSnSysHeader({
            icon: 'eye',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
            title: '2.3 อาการร่วมที่สังเกตเห็นขณะเกิดเหตุ (เลือกได้หลายข้อ)',
            noneId: 'sn_ictal_none',
            noneLabel: 'ไม่มีอาการในหมวดนี้',
            noneOnchange: 'handleSnIctalNoneChange()'
          })}
          ${renderSnGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', [
            { id: 'sn_lateral_tongue_bite', title: wrapSnWords('กัดลิ้น /', 'เลือดออกในปาก') },
            { id: 'sn_eye_deviation', title: wrapSnWords('ตาค้าง /', 'ตาเหลือกเบนข้างเดียว') },
            { id: 'sn_incontinence', title: wrapSnWords('ปัสสาวะราด /', 'อุจจาระราด') },
            { id: 'sn_cyanosis_apnea', title: wrapSnWords('ปากเขียวคล้ำ /', 'หยุดหายใจชั่วขณะ') },
            { id: 'sn_marked_pallor_sweat', title: wrapSnWords('หน้าซีดเผือด /', 'ตัวเย็นเหงื่อชุ่ม') }
          ], { kind: 'checkbox', onchange: 'handleSnIctalItemChange(this)' })}
        </div>
      </div>

      <!-- CARD 3: การฟื้นคืนสติ อาการหลังชัก และการบาดเจ็บจากการล้ม -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
        <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="refresh-cw" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">3. การฟื้นคืนสติ อาการหลังชัก และการบาดเจ็บจากการล้ม</h2>
            <p class="text-xs text-slate-500">ประเมินการฟื้นคืนสติ อาการอ่อนแรงหลังชัก และภาวะบาดเจ็บจากการล้ม</p>
          </div>
        </div>

        <div id="snUnconsciousContextNotice" class="hidden p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-slate-700">
          ระบบตรวจพบว่าผู้ป่วยยังมีอาการชักต่อเนื่องหรือยังไม่ฟื้นสติระหว่างรอบ จึงปรับตัวเลือกคำถามด้านล่างให้สอดคล้องกับสถานะปัจจุบันโดยอัตโนมัติ
        </div>

        <!-- 3.1 การฟื้นคืนสติ -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-2">3.1 การฟื้นคืนสติหลังหยุดชัก: <span class="text-rose-500">*</span></label>
          ${renderSnGrid('grid-cols-1 sm:grid-cols-2', [
            { wrapId: 'snRecOptWrap_rapid', value: 'rapid_under_2m_alert', title: wrapSnWords('ฟื้นสติเร็วมาก', '(ภายใน 1–2 นาที)'), desc: 'พูดคุยรู้เรื่องเป็นปกติทันที ไม่งง' },
            { wrapId: 'snRecOptWrap_confused', value: 'confusion_drowsy_gt_5m', title: wrapSnWords('สับสน /', 'มึนงง /', 'หลับลึกเกิน 5 นาที') },
            { wrapId: 'snRecOptWrap_tearful', value: 'tearful_emotional_tachypnea', title: wrapSnWords('รู้สึกตัวดี', 'แต่ยังหอบ /', 'ร้องไห้ /', 'มือชา') },
            { value: 'persistent_unconscious', title: wrapSnWords('ขณะนี้ยังไม่ฟื้นสติ /', 'ซึมปลุกตื่นยาก') }
          ], { kind: 'radio', name: 'snRecoveryDuration', onchange: 'handleSnRecoveryChange()' })}
        </div>

        <!-- 3.2 อาการผิดปกติหลังจากเริ่มรู้สึกตัว (Context-Filtered) -->
        <div id="snPostRecoverySymptomsWrap" class="pt-2 border-t border-slate-100 space-y-2.5">
          ${renderSnSysHeader({
            icon: 'stethoscope',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            title: '3.2 อาการผิดปกติหลังจากเริ่มรู้สึกตัว (เลือกได้หลายข้อ)',
            noneId: 'sn_post_none',
            noneLabel: 'ไม่มีอาการในหมวดนี้',
            noneOnchange: 'handleSnPostNoneChange()'
          })}
          ${renderSnGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-4', [
            { id: 'sn_post_weakness', title: wrapSnWords('แขนขาอ่อนแรง /', 'ปากเบี้ยว /', 'พูดไม่ชัด') },
            { id: 'sn_post_headache', title: wrapSnWords('ปวดศีรษะรุนแรง') },
            { id: 'sn_post_myalgia', title: wrapSnWords('ปวดเมื่อย /', 'ระบมกล้ามเนื้อ') },
            { id: 'sn_post_nausea_vomit', title: wrapSnWords('คลื่นไส้ /', 'อาเจียน') }
          ], { kind: 'checkbox', onchange: 'handleSnPostSymptomChange(this)' })}
          <div id="snToddSideWrap" class="hidden mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <span class="font-semibold text-slate-800 block">ข้างที่มีอาการอ่อนแรง / ปากเบี้ยว:</span>
            ${renderSnGrid('grid-cols-1 sm:grid-cols-3', [
              { value: 'left', title: wrapSnWords('ซีกซ้าย') },
              { value: 'right', title: wrapSnWords('ซีกขวา') },
              { value: 'both', title: wrapSnWords('ทั้งสองข้าง') }
            ], { kind: 'radio', name: 'snToddSide', compact: true })}
          </div>
        </div>

        <!-- 3.3 การบาดเจ็บจากการล้มหรือกระแทก -->
        <div class="pt-2 border-t border-slate-100">
          <label class="block text-xs font-bold text-slate-700 mb-2">3.3 การบาดเจ็บจากการล้มหรือกระแทกขณะเกิดเหตุ: <span class="text-rose-500">*</span></label>
          ${renderSnGrid('grid-cols-1 sm:grid-cols-2', [
            { value: 'no', title: wrapSnWords('ไม่มีการบาดเจ็บ', 'จากการล้ม') },
            { value: 'yes', title: wrapSnWords('มีศีรษะกระแทก /', 'บาดเจ็บตามร่างกาย') }
          ], { kind: 'radio', name: 'snFallInjury', onchange: 'handleSnFallInjuryChange()' })}
          <div id="snFallInjuryDetailWrap" class="hidden mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
            <span class="font-semibold text-slate-800 block">ลักษณะการบาดเจ็บ (เลือกได้หลายข้อ):</span>
            ${renderSnGrid('grid-cols-1 sm:grid-cols-3', [
              { id: 'sn_fall_head_impact', title: wrapSnWords('ศีรษะ /', 'ใบหน้ากระแทกพื้น') },
              { id: 'sn_fall_open_wound', title: wrapSnWords('แผลฉีกขาด /', 'เลือดออก') },
              { id: 'sn_fall_pain_swelling', title: wrapSnWords('ปวดบวม /', 'ฟกช้ำ') }
            ], { kind: 'checkbox', compact: true })}
            <div>
              <span class="block text-xs font-semibold text-slate-700 mb-1">ตำแหน่งที่บาดเจ็บ (ถ้ามี):</span>
              <input type="text" id="snFallInjuryDetailText" placeholder="เช่น หน้าผากแตก, ท้ายทอยโน, ปวดไหล่ขวา..."
                class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 4: ประวัติเดิม ปัจจัยกระตุ้น และข้อมูลเฉพาะสตรี -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
        <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="shield-alert" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">4. ประวัติเดิม ปัจจัยกระตุ้น และข้อมูลเฉพาะสตรี</h2>
            <p class="text-xs text-slate-500">ประวัติการชัก การรับประทานยา ปัจจัยกระตุ้น และข้อมูลเฉพาะสตรี</p>
          </div>
        </div>

        <!-- 4.1 ประวัติการชักหรือหมดสติในอดีต -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-2">4.1 ประวัติการชักหรือหมดสติในอดีต: <span class="text-rose-500">*</span></label>
          ${renderSnGrid('grid-cols-1 sm:grid-cols-3', [
            { value: 'first_time_tloc', title: wrapSnWords('เพิ่งเคยเป็นครั้งแรก') },
            { value: 'known_epilepsy', title: wrapSnWords('เป็นโรคลมชักเดิมอยู่แล้ว') },
            { value: 'recurrent_vasovagal', title: wrapSnWords('เคยเป็นลมหน้ามืดบ่อยๆ') }
          ], { kind: 'radio', name: 'snPriorHistory', onchange: 'handleSnPriorHistoryChange()' })}
          <div id="snMedComplianceWrap" class="hidden mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <span class="font-semibold text-slate-800 block">การรับประทานยากันชักในช่วง 7 วันที่ผ่านมา:</span>
            ${renderSnGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-4', [
              { value: 'compliant', title: wrapSnWords('กินยาสม่ำเสมอทุกวัน') },
              { value: 'missed_or_stopped', title: wrapSnWords('ขาดยา /', 'ลืมกิน /', 'หยุดยาเอง') },
              { value: 'dose_changed', title: wrapSnWords('เพิ่งปรับขนาด /', 'เปลี่ยนชนิดยา') },
              { value: 'lost_followup', title: wrapSnWords('ไม่ได้รักษาต่อเนื่อง /', 'ขาดนัด') }
            ], { kind: 'radio', name: 'snMedCompliance', compact: true })}
          </div>
        </div>

        <!-- 4.2 ปัจจัยกระตุ้นหรือภาวะเสี่ยงก่อนเกิดเหตุ -->
        <div class="pt-2 border-t border-slate-100">
          ${renderSnSysHeader({
            icon: 'flame',
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
            title: '4.2 ปัจจัยกระตุ้นหรือภาวะเสี่ยงก่อนเกิดเหตุ (เลือกได้หลายข้อ)',
            noneId: 'sn_rf_none',
            noneLabel: 'ไม่มีปัจจัยในหมวดนี้',
            noneOnchange: 'handleSnRfNoneChange()'
          })}
          ${renderSnGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-4', [
            { id: 'sn_rf_fever', title: wrapSnWords('มีไข้สูง /', 'หนาวสั่น') },
            { id: 'sn_rf_meningismus', title: wrapSnWords('ปวดหัวรุนแรง /', 'คอแข็ง') },
            { id: 'sn_rf_recent_head_trauma', title: wrapSnWords('เพิ่งบาดเจ็บศีรษะ', 'มาก่อน') },
            { id: 'sn_rf_sleep_deprivation', title: wrapSnWords('อดนอน /', 'พักผ่อนน้อย') },
            { id: 'sn_rf_alcohol_withdrawal', title: wrapSnWords('เพิ่งหยุดหรือ', 'ลดดื่มสุรา'), desc: 'ดื่มประจำแล้วหยุดภายใน 1–3 วัน' },
            { id: 'sn_rf_diabetic_hypo', title: wrapSnWords('เป็นเบาหวาน /', 'อดอาหาร'), desc: 'ฉีดยา/กินยาเบาหวาน หรือหิวมือสั่น' },
            { id: 'sn_rf_cardiac_history', title: wrapSnWords('มีโรคหัวใจเดิม') },
            { id: 'sn_rf_family_scd', title: wrapSnWords('ครอบครัวเสียชีวิต', 'อายุน้อย'), desc: 'ญาติสายตรงเสียชีวิตกะทันหันก่อนอายุ 50 ปี' },
            { id: 'sn_rf_emotional_panic', title: wrapSnWords('เครียดหนัก /', 'ตกใจ /', 'ร้องไห้') },
            { id: 'sn_rf_substance_toxin', title: wrapSnWords('ใช้ยาทรามาดอล /', 'สารเสพติด /', 'สารพิษ'), desc: 'ยาโปร, ยาเกินขนาด, ยาบ้า, กระท่อม หรือสารเคมี' }
          ], { kind: 'checkbox', onchange: 'handleSnRfItemChange(this)' })}
          <div id="snSubstanceDetailsWrap" class="hidden mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <span class="font-semibold text-slate-800 block">ชื่อยา สารเสพติด หรือสารพิษที่ได้รับ (ถ้าทราบ):</span>
            <input type="text" id="snSubstanceDetails" placeholder="เช่น ทรามาดอล(ยาโปร), ยาบ้า, ยาฆ่าแมลง..."
              class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
          </div>
        </div>

        <!-- 4.3 เฉพาะผู้ป่วยสตรี (Hidden by default - C-AP13) -->
        <div id="seizureFemaleSection" class="hidden pt-3 border-t border-slate-100 space-y-3">
          <div class="flex items-center space-x-2">
            <span class="px-2 py-0.5 text-[10px] font-bold bg-pink-100 text-pink-700 rounded-md">เฉพาะสตรี</span>
            <label class="block text-xs font-bold text-slate-700">4.3 ประจำเดือนและการตั้งครรภ์ (LMP &amp; Pregnancy)</label>
          </div>
          <div class="space-y-3 bg-pink-50/40 p-3.5 rounded-xl border border-pink-200">
            <div>
              <span class="block text-xs font-semibold text-slate-700 mb-2">สถานะการตั้งครรภ์ / หลังคลอด:</span>
              ${renderSnGrid('grid-cols-1 sm:grid-cols-3', [
                { value: 'not_pregnant', title: wrapSnWords('ไม่ได้ตั้งครรภ์') },
                { value: 'pregnant', title: wrapSnWords('กำลังตั้งครรภ์') },
                { value: 'postpartum_6w', title: wrapSnWords('เพิ่งคลอด /', 'แท้งใน 6 สัปดาห์') },
                { value: 'menopause_or_hysterectomy', title: wrapSnWords('หมดประจำเดือน /', 'ผ่าตัดมดลูก') },
                { value: 'unknown', title: wrapSnWords('ไม่แน่ใจ') }
              ], { kind: 'radio', name: 'snPregnancyStatus', onchange: 'handleSnPregnancyChange()', compact: true })}
              <div id="snPregnancyWeeksWrap" class="hidden mt-2.5 max-w-xs">
                <input type="text" id="snPregnancyWeeks" placeholder="ระบุอายุครรภ์ เช่น 32 สัปดาห์"
                  class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
              </div>
            </div>
            <div class="max-w-xs pt-1">
              <span class="block text-xs font-semibold text-slate-700 mb-1">วันแรกของประจำเดือนครั้งสุดท้าย (LMP):</span>
              <input type="text" id="snLmpDate" data-universal-date="true" placeholder="วว/ดด/ปปปป (dd/mm/yyyy)"
                class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 5 (UNIVERSAL): อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100">
          <div class="bg-slate-100 text-slate-600 p-2 rounded-xl"><i data-lucide="message-square-plus" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2>
            <p class="text-xs text-slate-500">ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)</p>
          </div>
        </div>
        <textarea id="seizure_other_free" rows="2" placeholder="พิมพ์ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)..."
          class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"></textarea>
      </div>
    </div>
  `,

  algorithm: {
    id: 'seizure',
    titleTh: 'ชัก / เกร็งกระตุก (Seizure & TLOC Workup)',
    titleEn: 'Seizure / Convulsion / Transient Loss of Consciousness (TLOC)',
    triageLevelRules: [
      { level: 1, criteria: 'Active continuous seizure, Seizure >= 5 min (Status Epilepticus T1), Cluster seizures without interictal recovery, Antepartum/Postpartum Eclampsia' },
      { level: 2, criteria: 'Focal motor seizure, Post-ictal Todd paresis, High-risk cardiac TLOC (exertion/palpitation/cardiac history/family SCD), CNS infection suspect, Head trauma/fall head impact, Hypoglycemia, Alcohol withdrawal, Toxin/Drug overdose, First-onset adult epileptic seizure >= 18y' },
      { level: 3, criteria: 'Breakthrough epilepsy seizure with full recovery, Uncomplicated TLOC with no cardiac/neurological red flags' },
      { level: 4, criteria: 'Benign vasovagal convulsive syncope or acute hyperventilation with rapid full recovery and normal neuro exam' }
    ]
  },

  clearForm() {
    [
      'snReporter', 'snLossDuration', 'snEpisodeCount', 'snInterictalState',
      'snPrecedingPosture', 'snMotorPattern', 'snFocalSide', 'snFocalAwareness',
      'snRecoveryDuration', 'snToddSide', 'snFallInjury', 'snPriorHistory',
      'snMedCompliance', 'snPregnancyStatus'
    ].forEach(clearSnRadioGroup);

    document.querySelectorAll('input[name="snWarningProdrome"], input[name="snFocalParts"]').forEach(cb => {
      cb.checked = false;
    });

    clearSnCheckboxesByIds([
      'snExactTimeUnknown', 'sn_prodrome_none', 'sn_ictal_none', 'sn_post_none', 'sn_rf_none',
      ...SN_ICTAL_IDS, ...SN_POST_IDS, ...SN_RF_IDS,
      'sn_fall_head_impact', 'sn_fall_open_wound', 'sn_fall_pain_swelling'
    ]);

    this.inputIdsToClear.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const durUnit = document.getElementById('snDurationUnit');
    if (durUnit) durUnit.value = 'hours';

    this.branchIds.forEach(b => toggleSnBranch(b, false));
    toggleSnBranch('snExactTimeWrap', true);
    toggleSnBranch('snPostRecoverySymptomsWrap', true);
    ['snRecOptWrap_rapid', 'snRecOptWrap_confused', 'snRecOptWrap_tearful'].forEach(id => toggleSnBranch(id, true));
  },

  resetForm() {
    this.clearForm();
  },

  onTitleChange(arg) {
    syncSnFemaleSection(isSnFemaleTitle(arg));
  },

  onSelectForm() {
    syncSnFemaleSection();
    updateSnPostIctalContext();
  },

  onActivate(patient) {
    if (patient && (patient.gender === 'หญิง' || patient.gender === 'ชาย')) {
      syncSnFemaleSection(patient.gender === 'หญิง');
    } else {
      syncSnFemaleSection();
    }
  },

  hydrateForm(patient) {
    if (!patient) return;
    this.clearForm();
    const setVal = (id, v) => {
      const el = document.getElementById(id);
      if (el) el.value = v !== undefined && v !== null ? v : '';
    };
    const setChk = (id, v) => {
      const el = document.getElementById(id);
      if (el) el.checked = Boolean(v);
    };

    setVal('snDurationVal', patient.durationVal || '');
    setVal('snDurationUnit', patient.durationUnit || 'hours');
    setChk('snExactTimeUnknown', patient.snExactTimeUnknown);
    setVal('snExactTime', patient.snExactTime || '');
    handleSnExactTimeUnknownChange();

    setSnRadioChecked('snReporter', patient.snReporter || patient.seizureReporter);
    setSnRadioChecked('snLossDuration', patient.snLossDuration);
    setVal('snDurationGte5mVal', patient.snDurationGte5mVal || patient.seizureDurationGte5mVal || '');
    handleSnLossDurationChange();

    setSnRadioChecked('snEpisodeCount', patient.snEpisodeCount || patient.seizureEpisodeCount);
    setVal('snEpisodeCountVal', patient.snEpisodeCountVal || patient.seizureEpisodeCountVal || '');
    setSnRadioChecked('snInterictalState', patient.snInterictalState || patient.seizureInterictalState);
    handleSnEpisodeCountChange();

    setSnRadioChecked('snPrecedingPosture', patient.snPrecedingPosture || patient.seizurePrecedingPosture);
    setVal('snPostureOtherText', patient.snPostureOtherText || patient.seizurePrecedingPostureOtherText || '');
    handleSnPostureChange();

    const prodromes = Array.isArray(patient.snWarningProdromes) ? patient.snWarningProdromes : [];
    const prodromeNone = Boolean(patient.sn_prodrome_none || prodromes.includes('none_sudden'));
    setChk('sn_prodrome_none', prodromeNone);
    document.querySelectorAll('input[name="snWarningProdrome"]').forEach(cb => {
      cb.checked = !prodromeNone && prodromes.includes(cb.value);
    });

    setSnRadioChecked('snMotorPattern', patient.snMotorPattern || patient.seizureMotorPattern);
    const focalParts = Array.isArray(patient.snFocalParts) ? patient.snFocalParts : [];
    document.querySelectorAll('input[name="snFocalParts"]').forEach(cb => {
      cb.checked = focalParts.includes(cb.value);
    });
    setSnRadioChecked('snFocalSide', patient.snFocalSide);
    setSnRadioChecked('snFocalAwareness', patient.snFocalAwareness);
    handleSnMotorPatternChange();

    setChk('sn_ictal_none', patient.sn_ictal_none);
    setChk('sn_lateral_tongue_bite', patient.sn_lateral_tongue_bite || patient.seizure_lateral_tongue_bite);
    setChk('sn_eye_deviation', patient.sn_eye_deviation || patient.seizure_eye_deviation);
    setChk('sn_incontinence', patient.sn_incontinence || patient.seizure_incontinence);
    setChk('sn_cyanosis_apnea', patient.sn_cyanosis_apnea || patient.seizure_cyanosis_apnea);
    setChk('sn_marked_pallor_sweat', patient.sn_marked_pallor_sweat || patient.seizure_marked_pallor_sweat);

    setSnRadioChecked('snRecoveryDuration', patient.snRecoveryDuration || patient.seizureRecoveryDuration);
    setChk('sn_post_weakness', patient.sn_post_weakness || patient.seizureHasToddParesis === 'yes');
    setSnRadioChecked('snToddSide', patient.snToddSide || patient.seizureToddSide);
    setChk('sn_post_headache', patient.sn_post_headache);
    setChk('sn_post_myalgia', patient.sn_post_myalgia);
    setChk('sn_post_nausea_vomit', patient.sn_post_nausea_vomit);
    setChk('sn_post_none', patient.sn_post_none);
    updateSnPostIctalContext();
    handleSnPostSymptomChange();

    setSnRadioChecked('snFallInjury', patient.snFallInjury);
    setChk('sn_fall_head_impact', patient.sn_fall_head_impact);
    setChk('sn_fall_open_wound', patient.sn_fall_open_wound);
    setChk('sn_fall_pain_swelling', patient.sn_fall_pain_swelling);
    setVal('snFallInjuryDetailText', patient.snFallInjuryDetailText || '');
    handleSnFallInjuryChange();

    setSnRadioChecked('snPriorHistory', patient.snPriorHistory || patient.seizurePriorHistory);
    setSnRadioChecked('snMedCompliance', patient.snMedCompliance || patient.seizureMedCompliance);
    handleSnPriorHistoryChange();

    setChk('sn_rf_none', patient.sn_rf_none);
    setChk('sn_rf_fever', patient.sn_rf_fever || patient.sn_rf_fever_meningismus || patient.seizure_rf_fever_meningismus);
    setChk('sn_rf_meningismus', patient.sn_rf_meningismus || patient.sn_rf_fever_meningismus || patient.seizure_rf_fever_meningismus);
    setChk('sn_rf_recent_head_trauma', patient.sn_rf_recent_head_trauma || patient.seizure_rf_recent_head_trauma);
    setChk('sn_rf_sleep_deprivation', patient.sn_rf_sleep_deprivation);
    setChk('sn_rf_alcohol_withdrawal', patient.sn_rf_alcohol_withdrawal || patient.seizure_rf_alcohol_withdrawal);
    setChk('sn_rf_diabetic_hypo', patient.sn_rf_diabetic_hypo || patient.seizure_rf_diabetic_hypo);
    setChk('sn_rf_cardiac_history', patient.sn_rf_cardiac_history || patient.sn_rf_cardiac_family || patient.seizure_rf_known_cardiac_disease);
    setChk('sn_rf_family_scd', patient.sn_rf_family_scd || patient.seizure_rf_family_sudden_death);
    setChk('sn_rf_emotional_panic', patient.sn_rf_emotional_panic || patient.seizure_rf_emotional_panic_trigger);
    setChk('sn_rf_substance_toxin', patient.sn_rf_substance_toxin || patient.seizure_rf_substance_toxin);
    setVal('snSubstanceDetails', patient.snSubstanceDetails || patient.seizureSubstanceDetails || '');
    handleSnSubstanceChange();

    const isFem = patient.gender === 'หญิง';
    syncSnFemaleSection(isFem);
    if (isFem) {
      setSnRadioChecked('snPregnancyStatus', patient.snPregnancyStatus);
      setVal('snPregnancyWeeks', patient.snPregnancyWeeks || '');
      handleSnPregnancyChange();
      setVal('snLmpDate', patient.snLmpDate || '');
    }

    setVal('seizure_other_free', patient.otherSymptomsFree || '');
  },

  collectIntake(ctx = {}) {
    const {
      recordId, queueNumber, randomHn, patientName, patientAge, gender,
      recordStatus, hospRecordStatus, underlying, drugAllergy, currentMeds, preservedDoctorNotes
    } = ctx;
    const freeBoxVal = document.getElementById('seizure_other_free')?.value?.trim() || '';
    const otherSymptomsFree = (ctx.otherSymptomsFree && String(ctx.otherSymptomsFree).trim()) || freeBoxVal;

    const rawDur = parseFloat(document.getElementById('snDurationVal')?.value);
    const durationVal = (!isNaN(rawDur) && rawDur > 0) ? rawDur : null;
    const durationUnit = document.getElementById('snDurationUnit')?.value || 'hours';
    const snExactTimeUnknown = Boolean(document.getElementById('snExactTimeUnknown')?.checked);
    const snExactTime = !snExactTimeUnknown ? (document.getElementById('snExactTime')?.value?.trim() || '') : '';

    const snReporter = getSnRadioValue('snReporter') || 'unspecified';
    const snLossDuration = getSnRadioValue('snLossDuration') || 'unspecified';
    const rawDur5m = parseInt(document.getElementById('snDurationGte5mVal')?.value, 10);
    const snDurationGte5mVal = snLossDuration === 'prolonged_gte_5m' && !isNaN(rawDur5m) && rawDur5m > 0 ? rawDur5m : null;

    // Zero Default Bias (P-AP14 / C-AP20): Never fabricate count=1 or full_recovery when unanswered
    const snEpisodeCount = getSnRadioValue('snEpisodeCount') || 'unspecified';
    const rawEpCnt = parseInt(document.getElementById('snEpisodeCountVal')?.value, 10);
    const snEpisodeCountVal = snEpisodeCount === 'multiple_cluster'
      ? (!isNaN(rawEpCnt) && rawEpCnt >= 2 ? rawEpCnt : null)
      : (snEpisodeCount === 'single' ? 1 : null);
    const snInterictalState = snEpisodeCount === 'multiple_cluster'
      ? (getSnRadioValue('snInterictalState') || 'unspecified')
      : '';

    const snPrecedingPosture = getSnRadioValue('snPrecedingPosture') || 'unspecified';
    const snPostureOtherText = snPrecedingPosture === 'other' ? (document.getElementById('snPostureOtherText')?.value?.trim() || '') : '';

    const sn_prodrome_none = Boolean(document.getElementById('sn_prodrome_none')?.checked);
    const checkedProdromes = getSnCheckedValues('snWarningProdrome');
    const snWarningProdromes = sn_prodrome_none ? ['none_sudden'] : checkedProdromes;

    const snMotorPattern = getSnRadioValue('snMotorPattern') || 'unspecified';
    const snFocalParts = snMotorPattern === 'focal_motor' ? getSnCheckedValues('snFocalParts') : [];
    const snFocalSide = snMotorPattern === 'focal_motor' ? (getSnRadioValue('snFocalSide') || '') : '';
    const snFocalAwareness = snMotorPattern === 'focal_motor' ? (getSnRadioValue('snFocalAwareness') || '') : '';

    const sn_ictal_none = Boolean(document.getElementById('sn_ictal_none')?.checked);
    const sn_lateral_tongue_bite = !sn_ictal_none && Boolean(document.getElementById('sn_lateral_tongue_bite')?.checked);
    const sn_eye_deviation = !sn_ictal_none && Boolean(document.getElementById('sn_eye_deviation')?.checked);
    const sn_incontinence = !sn_ictal_none && Boolean(document.getElementById('sn_incontinence')?.checked);
    const sn_cyanosis_apnea = !sn_ictal_none && Boolean(document.getElementById('sn_cyanosis_apnea')?.checked);
    const sn_marked_pallor_sweat = !sn_ictal_none && Boolean(document.getElementById('sn_marked_pallor_sweat')?.checked);

    const isActiveUnconscious =
      snLossDuration === 'continuous_unstopped' ||
      (snEpisodeCount === 'multiple_cluster' && snInterictalState === 'unconscious_or_drowsy');
    const snRecoveryDuration = getSnRadioValue('snRecoveryDuration') || 'unspecified';
    const hidePost = isActiveUnconscious || snRecoveryDuration === 'persistent_unconscious';

    const sn_post_none = !hidePost && Boolean(document.getElementById('sn_post_none')?.checked);
    const sn_post_weakness = !hidePost && !sn_post_none && Boolean(document.getElementById('sn_post_weakness')?.checked);
    const snToddSide = sn_post_weakness ? (getSnRadioValue('snToddSide') || '') : '';
    const sn_post_headache = !hidePost && !sn_post_none && Boolean(document.getElementById('sn_post_headache')?.checked);
    const sn_post_myalgia = !hidePost && !sn_post_none && Boolean(document.getElementById('sn_post_myalgia')?.checked);
    const sn_post_nausea_vomit = !hidePost && !sn_post_none && Boolean(document.getElementById('sn_post_nausea_vomit')?.checked);

    const snFallInjury = getSnRadioValue('snFallInjury') || 'unspecified';
    const hasFall = snFallInjury === 'yes';
    const sn_fall_head_impact = hasFall && Boolean(document.getElementById('sn_fall_head_impact')?.checked);
    const sn_fall_open_wound = hasFall && Boolean(document.getElementById('sn_fall_open_wound')?.checked);
    const sn_fall_pain_swelling = hasFall && Boolean(document.getElementById('sn_fall_pain_swelling')?.checked);
    const snFallInjuryDetailText = hasFall ? (document.getElementById('snFallInjuryDetailText')?.value?.trim() || '') : '';

    const snPriorHistory = getSnRadioValue('snPriorHistory') || 'unspecified';
    const snMedCompliance = snPriorHistory === 'known_epilepsy' ? (getSnRadioValue('snMedCompliance') || 'unspecified') : 'unspecified';

    const sn_rf_none = Boolean(document.getElementById('sn_rf_none')?.checked);
    const sn_rf_fever = !sn_rf_none && Boolean(document.getElementById('sn_rf_fever')?.checked);
    const sn_rf_meningismus = !sn_rf_none && Boolean(document.getElementById('sn_rf_meningismus')?.checked);
    const sn_rf_fever_meningismus = sn_rf_fever || sn_rf_meningismus;
    const sn_rf_recent_head_trauma = !sn_rf_none && Boolean(document.getElementById('sn_rf_recent_head_trauma')?.checked);
    const sn_rf_sleep_deprivation = !sn_rf_none && Boolean(document.getElementById('sn_rf_sleep_deprivation')?.checked);
    const sn_rf_alcohol_withdrawal = !sn_rf_none && Boolean(document.getElementById('sn_rf_alcohol_withdrawal')?.checked);
    const sn_rf_diabetic_hypo = !sn_rf_none && Boolean(document.getElementById('sn_rf_diabetic_hypo')?.checked);
    const sn_rf_cardiac_history = !sn_rf_none && Boolean(document.getElementById('sn_rf_cardiac_history')?.checked);
    const sn_rf_family_scd = !sn_rf_none && Boolean(document.getElementById('sn_rf_family_scd')?.checked);
    const sn_rf_cardiac_family = sn_rf_cardiac_history || sn_rf_family_scd;
    const sn_rf_emotional_panic = !sn_rf_none && Boolean(document.getElementById('sn_rf_emotional_panic')?.checked);
    const sn_rf_substance_toxin = !sn_rf_none && Boolean(document.getElementById('sn_rf_substance_toxin')?.checked);
    const snSubstanceDetails = sn_rf_substance_toxin ? (document.getElementById('snSubstanceDetails')?.value?.trim() || '') : '';

    const isFemale = gender === 'หญิง';
    const snPregnancyStatus = isFemale ? (getSnRadioValue('snPregnancyStatus') || '') : '';
    const snPregnancyWeeks = (isFemale && snPregnancyStatus === 'pregnant')
      ? (document.getElementById('snPregnancyWeeks')?.value?.trim() || '')
      : '';
    const snLmpDate = isFemale ? (document.getElementById('snLmpDate')?.value?.trim() || '') : '';

    return {
      id: recordId,
      queue_number: queueNumber,
      hn: randomHn,
      name: patientName,
      age: patientAge,
      gender,
      chief_complaint: 'seizure',
      chief_complaint_title: 'ชัก / เกร็งกระตุก',
      status: recordStatus,
      timestamp: new Date().toISOString(),
      durationVal,
      durationUnit,
      snExactTimeUnknown,
      snExactTime,
      snReporter,
      snLossDuration,
      snDurationGte5mVal,
      snEpisodeCount,
      snEpisodeCountVal,
      snInterictalState,
      snPrecedingPosture,
      snPostureOtherText,
      sn_prodrome_none,
      snWarningProdromes,
      snMotorPattern,
      snFocalParts,
      snFocalSide,
      snFocalAwareness,
      sn_ictal_none,
      sn_lateral_tongue_bite,
      sn_eye_deviation,
      sn_incontinence,
      sn_cyanosis_apnea,
      sn_marked_pallor_sweat,
      snRecoveryDuration,
      sn_post_weakness,
      snToddSide,
      sn_post_headache,
      sn_post_myalgia,
      sn_post_nausea_vomit,
      sn_post_none,
      snFallInjury,
      sn_fall_head_impact,
      sn_fall_open_wound,
      sn_fall_pain_swelling,
      snFallInjuryDetailText,
      snPriorHistory,
      snMedCompliance,
      sn_rf_none,
      sn_rf_fever,
      sn_rf_meningismus,
      sn_rf_fever_meningismus,
      sn_rf_recent_head_trauma,
      sn_rf_sleep_deprivation,
      sn_rf_alcohol_withdrawal,
      sn_rf_diabetic_hypo,
      sn_rf_cardiac_history,
      sn_rf_family_scd,
      sn_rf_cardiac_family,
      sn_rf_emotional_panic,
      sn_rf_substance_toxin,
      snSubstanceDetails,
      snPregnancyStatus,
      snPregnancyWeeks,
      snLmpDate,
      otherSymptomsFree,
      hospRecordStatus: hospRecordStatus || 'unspecified',
      underlying: Array.isArray(underlying) && underlying.length > 0 ? underlying : ((hospRecordStatus === 'self' || hospRecordStatus === 'additional') ? ['ปฏิเสธ'] : []),
      drugAllergy: drugAllergy || 'ไม่ได้ระบุ',
      currentMeds: currentMeds || 'ไม่ได้ระบุ',
      doctor_notes: preservedDoctorNotes
    };
  },

  isRedFlag(p) {
    if (!p) return false;
    return this.evaluateRedFlags(p).length > 0;
  },

  evaluateRedFlags(patient) {
    const redFlags = [];
    if (!patient) return redFlags;
    const prodromes = Array.isArray(patient.snWarningProdromes) ? patient.snWarningProdromes : [];
    const isFemale = patient.gender === 'หญิง';

    if (
      patient.snLossDuration === 'prolonged_gte_5m' ||
      patient.snLossDuration === 'continuous_unstopped'
    ) {
      const durText = patient.snDurationGte5mVal ? ` (ประมาณ ${patient.snDurationGte5mVal} นาที)` : '';
      redFlags.push({
        key: 'status_epilepticus_duration',
        textTh: patient.snLossDuration === 'continuous_unstopped'
          ? 'ชักต่อเนื่องไม่หยุด (Active Convulsive Status Epilepticus — T1)'
          : `ชักเกร็งหรือหมดสตินานตั้งแต่ 5 นาทีขึ้นไป${durText} (Prolonged Seizure / Status Epilepticus — T1)`,
        risk: 'เข้าเกณฑ์ Time point 1 ของ Status Epilepticus เสี่ยงสมองขาดออกซิเจนและบาดเจ็บถาวร ต้องดูแลทางเดินหายใจ เจาะ DTX และให้ IV Benzodiazepine ทันที'
      });
    }

    if (
      (patient.snEpisodeCount === 'multiple_cluster' && patient.snInterictalState === 'unconscious_or_drowsy') ||
      patient.snRecoveryDuration === 'persistent_unconscious'
    ) {
      redFlags.push({
        key: 'status_epilepticus_cluster',
        textTh: 'ชักซ้ำโดยไม่ฟื้นคืนสติระหว่างรอบ หรือยังไม่ฟื้นสติในขณะนี้ (Impending / Non-Recovery Status Epilepticus)',
        risk: 'เสี่ยงภาวะ Status Epilepticus ต่อเนื่อง หรือสาเหตุวิกฤตทางสมอง ต้องเฝ้าระวังทางเดินหายใจและให้ยากันชักทางหลอดเลือดดำเร่งด่วน'
      });
    }

    if (isFemale && (patient.snPregnancyStatus === 'pregnant' || patient.snPregnancyStatus === 'postpartum_6w')) {
      redFlags.push({
        key: 'eclampsia',
        textTh: 'หญิงตั้งครรภ์หรือเพิ่งคลอด/แท้งบุตรภายใน 6 สัปดาห์มีอาการชัก (Suspected Eclampsia)',
        risk: 'ภาวะฉุกเฉินทางสูติศาสตร์วิกฤต ต้องตรวจวัดความดันโลหิต ให้ IV Magnesium Sulfate เป็นยาหลักลำดับแรก และปรึกษาสูติแพทย์ทันที'
      });
    }

    if (patient.snMotorPattern === 'focal_motor' || patient.sn_post_weakness) {
      redFlags.push({
        key: 'focal_seizure_todd_paresis',
        textTh: 'ชักกระตุกเฉพาะที่ หรือมีแขนขาอ่อนแรง/ปากเบี้ยวหลังชัก (Focal Onset Seizure / Todd Paresis)',
        risk: 'บ่งชี้รอยโรคเฉพาะที่ในสมอง (Stroke / ICH / Mass / Cortical lesion) ควรพิจารณาตรวจ CT Brain เร่งด่วน'
      });
    }

    if (
      patient.snPrecedingPosture === 'during_exertion' ||
      prodromes.includes('sudden_palpitation') ||
      prodromes.includes('chest_pain') ||
      patient.sn_rf_cardiac_history ||
      patient.sn_rf_family_scd ||
      patient.sn_rf_cardiac_family
    ) {
      redFlags.push({
        key: 'cardiac_syncope_high_risk',
        textTh: 'หมดสติชักเกร็งขณะออกแรง/มีใจสั่นหรือเจ็บอกนำ/โรคหัวใจหรือครอบครัวเสียชีวิตอายุน้อย (High-Risk Cardiac Syncope)',
        risk: 'เสี่ยงหัวใจเต้นผิดจังหวะรุนแรง (Arrhythmia / Brugada / Long QT) หรือ ACS ต้องตรวจ 12-lead EKG และติด Cardiac Monitor ทันที'
      });
    }

    if (patient.sn_rf_fever || patient.sn_rf_meningismus || patient.sn_rf_fever_meningismus) {
      redFlags.push({
        key: 'cns_infection_meningismus',
        textTh: 'มีไข้สูง หนาวสั่น ปวดศีรษะรุนแรง หรือคอแข็งนำมาก่อน (Suspected CNS Infection: Meningitis / Encephalitis)',
        risk: 'เสี่ยงเยื่อหุ้มสมองหรือเนื้อสมองอักเสบ ต้องประเมิน Neuroimaging / Lumbar Puncture และให้ Empiric IV Antimicrobial ทันที'
      });
    }

    if (patient.sn_rf_recent_head_trauma || (patient.snFallInjury === 'yes' && patient.sn_fall_head_impact)) {
      redFlags.push({
        key: 'head_trauma_or_fall_head_impact',
        textTh: 'มีประวัติอุบัติเหตุศีรษะกระแทกก่อนชัก หรือล้มศีรษะกระแทกพื้นโดยตรง (Post-Traumatic Seizure / Secondary TBI)',
        risk: 'เสี่ยงเลือดออกในกะโหลกศีรษะ (EDH / SDH / ICH) ควรประเมินแผลและพิจารณาส่งตรวจ Non-contrast CT Brain'
      });
    }

    if (patient.sn_rf_diabetic_hypo) {
      redFlags.push({
        key: 'hypoglycemia',
        textTh: 'ผู้ป่วยเบาหวาน/อดอาหารก่อนหมดสติ (Suspected Hypoglycemia-Induced Seizure)',
        risk: 'ต้องเจาะ DTX STAT ทันที หากน้ำตาลต่ำให้ 50% Glucose IV ทันทีเพื่อป้องกันสมองเสียหายถาวร'
      });
    }

    if (patient.sn_rf_alcohol_withdrawal) {
      redFlags.push({
        key: 'alcohol_withdrawal',
        textTh: 'ดื่มสุราประจำและเพิ่งหยุด/ลดปริมาณ (Alcohol Withdrawal Seizure)',
        risk: 'เสี่ยง Delirium Tremens (DT) ต้องให้ High-dose IV Thiamine และควบคุมอาการด้วย Benzodiazepine'
      });
    }

    if (patient.sn_rf_substance_toxin) {
      const det = patient.snSubstanceDetails ? ` [${patient.snSubstanceDetails}]` : '';
      redFlags.push({
        key: 'substance_toxin_overdose',
        textTh: `ใช้ยาทรามาดอล(ยาโปร) สารเสพติด หรือได้รับสารพิษ${det} (Toxin / Drug-Induced Seizure)`,
        risk: 'ระวัง Tramadol, Amphetamine, สารกำจัดศัตรูพืช หรือยาเกินขนาด เฝ้าระวังทางเดินหายใจและให้การรักษาเฉพาะทาง'
      });
    }

    const numericAge = parseFloat(patient.age);
    const isAdultAge = isNaN(numericAge) || numericAge >= 18;
    const hasEpilepticFeatures =
      patient.snMotorPattern === 'generalized_tonic_clonic' ||
      patient.snMotorPattern === 'focal_motor' ||
      patient.sn_lateral_tongue_bite ||
      patient.sn_eye_deviation ||
      patient.snRecoveryDuration === 'confusion_drowsy_gt_5m';

    if (patient.snPriorHistory === 'first_time_tloc' && isAdultAge && hasEpilepticFeatures) {
      redFlags.push({
        key: 'adult_first_onset',
        textTh: 'อาการชักแบบโรคลมชักครั้งแรกในผู้ใหญ่ (First-Onset Adult Epileptic Seizure >= 18 ปี)',
        risk: 'จำเป็นต้องสืบค้นหาสาเหตุทุติยภูมิ (Metabolic disturbance, Stroke, Structural Brain Lesion) ด้วย Electrolytes, DTX และ CT Brain'
      });
    }

    return redFlags;
  },

  updateOutputs(patient) {
    if (!patient) return { rapid: '', narrative: '', json: '{}' };
    const unitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
    const durationText = patient.durationVal ? `${patient.durationVal} ${unitMap[patient.durationUnit] || 'ชั่วโมง'}` : 'ไม่ได้ระบุ';
    const timeText = patient.snExactTimeUnknown
      ? 'ไม่ทราบเวลาแน่ชัด'
      : (patient.snExactTime ? `เวลา ${patient.snExactTime} น.` : '');

    const reporterStr = SN_LABELS.reporter[patient.snReporter] || SN_LABELS.reporter.unspecified;
    const postureStr = patient.snPrecedingPosture === 'other'
      ? (patient.snPostureOtherText ? `อื่นๆ: ${patient.snPostureOtherText}` : 'อื่นๆ')
      : (SN_LABELS.posture[patient.snPrecedingPosture] || SN_LABELS.posture.unspecified);

    const lossDurationStr = patient.snLossDuration === 'prolonged_gte_5m'
      ? `ตั้งแต่ 5 นาทีขึ้นไป${patient.snDurationGte5mVal ? ` (ประมาณ ${patient.snDurationGte5mVal} นาที)` : ''}`
      : (SN_LABELS.lossDuration[patient.snLossDuration] || SN_LABELS.lossDuration.unspecified);

    let clusterStr = 'ไม่ได้ระบุ';
    if (patient.snEpisodeCount === 'single') {
      clusterStr = 'เกิดขึ้นครั้งเดียว';
    } else if (patient.snEpisodeCount === 'multiple_cluster') {
      const cntPart = patient.snEpisodeCountVal ? `${patient.snEpisodeCountVal} ครั้ง` : 'ตั้งแต่ 2 ครั้งขึ้นไป';
      const interPart = SN_LABELS.interictal[patient.snInterictalState] || SN_LABELS.interictal.unspecified;
      clusterStr = `เกิดซ้ำ ${cntPart} (${interPart})`;
    }

    const prodromes = Array.isArray(patient.snWarningProdromes) ? patient.snWarningProdromes : [];
    let prodromesStr = 'ไม่ได้ระบุ';
    if (patient.sn_prodrome_none || prodromes.includes('none_sudden')) {
      prodromesStr = SN_LABELS.prodrome.none_sudden;
    } else if (prodromes.length > 0) {
      prodromesStr = prodromes.map(p => SN_LABELS.prodrome[p] || p).join(', ');
    }

    const motorStr = formatSnMotorSummary(patient);
    const recoveryStr = SN_LABELS.recovery[patient.snRecoveryDuration] || SN_LABELS.recovery.unspecified;

    let fallStr = patient.snFallInjury === 'no' ? 'ไม่มีการบาดเจ็บจากการล้ม' : 'ไม่ได้ระบุ';
    if (patient.snFallInjury === 'yes') {
      const fParts = [];
      if (patient.sn_fall_head_impact) fParts.push('ศีรษะหรือใบหน้ากระแทกพื้น');
      if (patient.sn_fall_open_wound) fParts.push('แผลฉีกขาด/เลือดออก');
      if (patient.sn_fall_pain_swelling) fParts.push('ปวดบวม/ฟกช้ำ');
      if (patient.snFallInjuryDetailText) fParts.push(patient.snFallInjuryDetailText);
      fallStr = fParts.length > 0 ? `มีบาดเจ็บ (${fParts.join(', ')})` : 'มีบาดเจ็บจากการล้ม';
    }

    const priorStr = SN_LABELS.priorHistory[patient.snPriorHistory] || SN_LABELS.priorHistory.unspecified;
    const complianceStr = patient.snPriorHistory === 'known_epilepsy'
      ? (SN_LABELS.compliance[patient.snMedCompliance] || SN_LABELS.compliance.unspecified)
      : '';

    // Pertinent Positives & Zero-Default-Bias Pertinent Negatives (P-AP14 / C-AP20)
    const positives = [];
    const negatives = [];

    // 2.3 Ictal Associated Signs
    const anyIctalPos = Boolean(
      patient.sn_lateral_tongue_bite || patient.sn_eye_deviation || patient.sn_incontinence ||
      patient.sn_cyanosis_apnea || patient.sn_marked_pallor_sweat
    );
    if (patient.sn_ictal_none) {
      negatives.push('ไม่มีอาการกัดลิ้น ตาค้าง ปัสสาวะราด ปากเขียว หรือหน้าซีดขณะเกิดเหตุ');
    } else if (anyIctalPos) {
      if (patient.sn_lateral_tongue_bite) positives.push('กัดลิ้นหรือมีเลือดออกในปาก');
      else negatives.push('ไม่พบแผลกัดลิ้น');

      if (patient.sn_eye_deviation) positives.push('ตาค้างหรือตาเหลือกเบนไปข้างเดียว');
      else negatives.push('ไม่มีตาค้างหรือตาเหลือก');

      if (patient.sn_incontinence) positives.push('ปัสสาวะหรืออุจจาระราดขณะหมดสติ');
      else negatives.push('ไม่มีปัสสาวะหรืออุจจาระราด');

      if (patient.sn_cyanosis_apnea) positives.push('ริมฝีปากเขียวคล้ำหรือหยุดหายใจชั่วขณะ');
      else negatives.push('ไม่มีปากเขียวหรือหยุดหายใจ');

      if (patient.sn_marked_pallor_sweat) positives.push('หน้าซีดเผือด ตัวเย็น เหงื่อออกชุ่ม');
      else negatives.push('ไม่มีหน้าซีดเหงื่อออกชุ่ม');
    }

    // 3.2 Post-ictal Symptoms
    const anyPostPos = Boolean(
      patient.sn_post_weakness || patient.sn_post_headache || patient.sn_post_myalgia || patient.sn_post_nausea_vomit
    );
    if (patient.sn_post_none && patient.snRecoveryDuration !== 'persistent_unconscious') {
      negatives.push('ไม่มีอาการอ่อนแรง ปวดศีรษะ ปวดกล้ามเนื้อ หรือคลื่นไส้อาเจียนหลังฟื้น');
    } else if (anyPostPos) {
      if (patient.sn_post_weakness) {
        const tSide = patient.snToddSide ? ` (${SN_LABELS.toddSides[patient.snToddSide] || patient.snToddSide})` : '';
        positives.push(`แขนขาอ่อนแรง ปากเบี้ยว หรือพูดไม่ชัดหลังชัก${tSide}`);
      } else if (patient.snRecoveryDuration !== 'persistent_unconscious') {
        negatives.push('ไม่มีแขนขาอ่อนแรงหลังหยุดชัก');
      }
      if (patient.sn_post_headache) positives.push('ปวดศีรษะรุนแรงหลังฟื้น');
      if (patient.sn_post_myalgia) positives.push('ปวดเมื่อยระบมกล้ามเนื้อหลังชัก');
      if (patient.sn_post_nausea_vomit) positives.push('คลื่นไส้หรืออาเจียนหลังเกิดเหตุ');
    }

    // 3.3 Secondary Injury details (when positive)
    if (patient.sn_fall_head_impact) positives.push('ล้มศีรษะหรือใบหน้ากระแทกพื้น');
    if (patient.sn_fall_open_wound) positives.push('มีแผลฉีกขาดหรือเลือดออกจากการล้ม');
    if (patient.sn_fall_pain_swelling) positives.push('มีอาการปวดบวมหรือฟกช้ำจากการล้ม');

    // 4.2 Triggers & Risk Factors (Explicit None vs Positive Only — Zero Default Bias)
    const hasFever = Boolean(patient.sn_rf_fever || (!('sn_rf_fever' in patient) && patient.sn_rf_fever_meningismus));
    const hasMeningismus = Boolean(patient.sn_rf_meningismus || (!('sn_rf_meningismus' in patient) && patient.sn_rf_fever_meningismus));
    const hasCardiac = Boolean(patient.sn_rf_cardiac_history || (!('sn_rf_cardiac_history' in patient) && patient.sn_rf_cardiac_family));
    const hasFamilyScd = Boolean(patient.sn_rf_family_scd);

    if (patient.sn_rf_none) {
      negatives.push('ไม่มีปัจจัยกระตุ้นหรือภาวะเสี่ยงสำคัญก่อนเกิดเหตุ (ไข้ คอแข็ง บาดเจ็บศีรษะ อดนอน หยุดสุรา เบาหวาน โรคหัวใจ หรือสารพิษ)');
    } else {
      if (hasFever) positives.push('มีไข้สูงหรือหนาวสั่นนำมาก่อน');
      if (hasMeningismus) positives.push('ปวดศีรษะรุนแรงหรือคอแข็งนำมาก่อน');
      if (patient.sn_rf_recent_head_trauma) positives.push('เพิ่งบาดเจ็บศีรษะมาก่อนหน้านี้');
      if (patient.sn_rf_sleep_deprivation) positives.push('อดนอนหรือพักผ่อนน้อยก่อนเกิดอาการ');
      if (patient.sn_rf_alcohol_withdrawal) positives.push('ดื่มสุราประจำและเพิ่งหยุดหรือลดปริมาณภายใน 1–3 วัน');
      if (patient.sn_rf_diabetic_hypo) positives.push('เป็นเบาหวานหรืออดอาหารก่อนหมดสติ');
      if (hasCardiac) positives.push('มีโรคหัวใจเดิม');
      if (hasFamilyScd) positives.push('มีประวัติครอบครัวเสียชีวิตกะทันหันอายุน้อย (< 50 ปี)');
      if (patient.sn_rf_emotional_panic) positives.push('เครียดหนัก ตกใจ หรือร้องไห้ก่อนเกิดเหตุ');
      if (patient.sn_rf_substance_toxin) {
        positives.push(`ใช้ยาทรามาดอล(ยาโปร) สารเสพติด หรือได้รับสารพิษ${patient.snSubstanceDetails ? ` (${patient.snSubstanceDetails})` : ''}`);
      }
    }

    if (patient.otherSymptomsFree && String(patient.otherSymptomsFree).trim()) {
      positives.push(String(patient.otherSymptomsFree).trim());
    }
    if (positives.length === 0) {
      if (patient.snMotorPattern && patient.snMotorPattern !== 'unspecified') {
        positives.push(`ชักเกร็งหรือหมดสติ: ${motorStr}`);
      } else {
        positives.push('ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม');
      }
    }

    patient.pertinentPositives = positives;
    patient.pertinentNegatives = negatives.length > 0 ? negatives : ['ผู้ป่วยไม่ได้ระบุคำตอบยืนยันในหมวดอาการร่วม'];

    const isFemale = patient.gender === 'หญิง';
    let femaleLine = '';
    let femaleStr = '';
    if (isFemale && (patient.snPregnancyStatus || patient.snLmpDate)) {
      const pregText = SN_LABELS.pregnancy[patient.snPregnancyStatus] || 'ไม่ได้ระบุสถานะการตั้งครรภ์';
      const gaText = (patient.snPregnancyStatus === 'pregnant' && patient.snPregnancyWeeks) ? ` (GA ${patient.snPregnancyWeeks})` : '';
      const lmpText = patient.snLmpDate ? `, LMP ${patient.snLmpDate}` : '';
      femaleStr = `${pregText}${gaText}${lmpText}`;
      femaleLine = `\n• ประวัติสตรี: ${femaleStr}`;
    }

    const hospLabel = {
      complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
      additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
      self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
      unspecified: 'ไม่ได้ระบุ'
    }[patient.hospRecordStatus] || 'ไม่ได้ระบุ';

    const docNotes = patient.doctor_notes || {};
    const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ') ? 'ไม่ได้ระบุ' : patient.currentMeds;
    const udArr = Array.isArray(patient.underlying) ? patient.underlying.filter(u => u && !u.includes('ปฏิเสธ') && u !== 'ไม่มี' && u !== 'ไม่มีโรคประจำตัว') : [];
    const udExplicitDeny = Array.isArray(patient.underlying) && patient.underlying.some(u => u && u.includes('ปฏิเสธ'));
    const udText = udArr.length > 0 ? udArr.join(', ') : ((patient.hospRecordStatus === 'self' || patient.hospRecordStatus === 'additional' || udExplicitDeny) ? 'ปฏิเสธ' : 'ไม่ได้ระบุ');
    const allergyText = (!patient.drugAllergy || patient.drugAllergy === 'ไม่ได้ระบุ') ? 'ไม่ได้ระบุ' : patient.drugAllergy;
    const effectiveRfs = this.evaluateRedFlags(patient);
    const sheldon = calculateSheldonScore(patient);
    const hvs = evaluateHyperventilationScreen(patient);

    const rapid =
`[Chief Complaint (CC)]
ชัก / เกร็งกระตุก (Seizure / TLOC Workup) มา ${durationText}${timeText ? ` (${timeText})` : ''}

[History of Present Illness (HPI)]
• ผู้ให้ข้อมูล: ${reporterStr}
• ท่าทางก่อนเกิดเหตุ: ${postureStr}
• อาการเตือนล่วงหน้า (Prodrome/Aura): ${prodromesStr}
• ลักษณะการเกร็ง/กระตุก: ${motorStr}
• ระยะเวลาที่ชักหรือหมดสติ: ${lossDurationStr}
• ความถี่และรอบการเกิดเหตุ: ${clusterStr}
• การฟื้นคืนสติ: ${recoveryStr}
• การบาดเจ็บจากการล้ม: ${fallStr}${femaleLine}

• Pertinent Positives:
${positives.map(p => `  - ${p}`).join('\n')}

• Pertinent Negatives:
${patient.pertinentNegatives.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• ประวัติการชัก/เป็นลมเดิม: ${priorStr}
${complianceStr ? `• การรับประทานยากันชัก: ${complianceStr}\n` : ''}• โรคประจำตัว (U/D): ${udText}
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

    const narrative =
`ผู้ป่วย [${patient.name || 'ไม่ระบุชื่อ'}] อายุ ${patient.age || '-'} ปี เพศ ${patient.gender || 'ไม่ระบุ'} มารับการตรวจที่ห้องฉุกเฉิน รพ.ราชบุรี ด้วยอาการชัก / เกร็งกระตุก มา ${durationText}${timeText ? ` (${timeText})` : ''} ให้ประวัติโดย [${reporterStr}]
เหตุการณ์เกิดขณะ [${postureStr}] อาการเตือนก่อนเกิดเหตุ: [${prodromesStr}] ลักษณะขณะชักหรือหมดสติคือ [${motorStr}] ระยะเวลาที่หมดสติ/ชัก: [${lossDurationStr}] ความถี่: [${clusterStr}] การฟื้นคืนสติ: [${recoveryStr}] การบาดเจ็บจากการล้ม: [${fallStr}]${femaleStr ? ` ประวัติสตรี: [${femaleStr}]` : ''}
การประเมินแยกโรคเบื้องต้น (Sheldon Score = ${sheldon.score}): ${sheldon.interpretation}; ${hvs.label}
อาการร่วมสำคัญที่ตรวจพบ: ${positives.join(', ')}
อาการสำคัญที่ปฏิเสธ: ${patient.pertinentNegatives.join(', ')}
ประวัติการชัก/เป็นลมเดิม: [${priorStr}]${complianceStr ? ` (การรับประทานยากันชัก: ${complianceStr})` : ''}, โรคประจำตัว: ${udText}, ยาประจำตัว: ${medsText}, แพ้ยา: ${allergyText}${effectiveRfs.length > 0 ? `\n[แจ้งเตือนความเสี่ยงสูง]: ${effectiveRfs.map(rf => rf.textTh).join('; ')}` : ''}`;

    const jsonSchema = {
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
      chief_complaint: 'seizure',
      seizure_tloc_profile: {
        duration_value: patient.durationVal || null,
        duration_unit: patient.durationUnit || null,
        event_time: timeText || null,
        informant: reporterStr,
        preceding_posture: postureStr,
        warning_prodromes: prodromes.map(p => SN_LABELS.prodrome[p] || p),
        motor_manifestation: motorStr,
        loss_of_consciousness_duration: lossDurationStr,
        episode_frequency: clusterStr,
        recovery_status: recoveryStr,
        fall_injury: fallStr,
        sheldon_score: sheldon.score,
        sheldon_interpretation: sheldon.interpretation,
        hyperventilation_suspected: hvs.isSuspected
      },
      past_history_and_triggers: {
        prior_history: priorStr,
        med_compliance: complianceStr || null,
        female_pregnancy_lmp: isFemale ? (femaleStr || null) : null
      },
      pertinent_positives: positives,
      pertinent_negatives: patient.pertinentNegatives,
      other_symptoms_free_text: patient.otherSymptomsFree || '',
      red_flags: effectiveRfs.map(r => r.key),
      doctor_clinical_addendum: docNotes
    };

    const jsonStr = JSON.stringify(jsonSchema, null, 2);
    patient.rapidHpi = patient.custom_rapid_note || rapid;
    patient.narrativeHpi = patient.custom_narrative_note || narrative;
    patient.medicalJson = jsonSchema;

    const rapidEl = document.getElementById('rapidTextView');
    const narrEl = document.getElementById('narrativeTextView');
    const jsonEl = document.getElementById('jsonViewer');
    if (rapidEl) rapidEl.value = patient.rapidHpi;
    if (narrEl) narrEl.value = patient.narrativeHpi;
    if (jsonEl) jsonEl.textContent = jsonStr;

    return { rapid, narrative, json: jsonStr };
  },

  seedPatients: [
    makeSnSeed({
      id: 'case-091', queue_number: 'A-091', hn: '6708101', name: 'นายภาณุพงศ์ กิตติคุณ', age: 28, gender: 'ชาย',
      timestamp: '2026-10-26T02:31:26.424Z', durationVal: 45, durationUnit: 'minutes', snExactTime: '08:45',
      snReporter: 'witness_relative', snLossDuration: 'prolonged_gte_5m', snDurationGte5mVal: 20,
      snEpisodeCount: 'multiple_cluster', snEpisodeCountVal: 2, snInterictalState: 'unconscious_or_drowsy',
      snPrecedingPosture: 'sleep', sn_prodrome_none: true, snWarningProdromes: ['none_sudden'],
      snMotorPattern: 'generalized_tonic_clonic', sn_lateral_tongue_bite: true, sn_eye_deviation: true,
      sn_incontinence: true, sn_cyanosis_apnea: true, snRecoveryDuration: 'persistent_unconscious',
      snPriorHistory: 'known_epilepsy', snMedCompliance: 'missed_or_stopped', sn_rf_sleep_deprivation: true,
      otherSymptomsFree: 'ยังซึมปลุกไม่ตื่นขณะนำส่งโรงพยาบาล', hospRecordStatus: 'complete',
      underlying: ['โรคลมชัก (Epilepsy)'],
      currentMeds: 'Sodium Valproate 500 mg bid, Levetiracetam 500 mg bid (ขาดยา 3 วัน)',
      doctor_notes: {
        additional_hpi: 'ผู้ป่วยโรคลมชักเดิม ขาดยามา 3 วันและอดนอน ชักเกร็งทั้งตัวนาน 20 นาที ซ้ำ 2 รอบ ระหว่างรอบไม่ฟื้นสติ',
        physical_exam: 'BT 37.2 C, PR 122/min, RR 26/min, BP 148/92 mmHg, SpO2 93% -> 99% O2 cannula. DTX 114 mg/dL. GCS E2V2M4.',
        preliminary_dx: 'Convulsive Status Epilepticus secondary to Antiseizure Non-Compliance',
        plan: 'Airway support + high-flow O2, IV Diazepam 10 mg STAT, IV Levetiracetam loading, STAT labs & CT Brain'
      }
    }),
    makeSnSeed({
      id: 'case-092', queue_number: 'A-092', hn: '6708214', name: 'น.ส.ชุติมา ธนสถิตย์', age: 24, gender: 'หญิง',
      timestamp: '2026-10-26T02:21:26.424Z', durationVal: 1, durationUnit: 'hours', snExactTime: '08:20',
      snReporter: 'both_patient_witness', snLossDuration: 'typical_1_4m', snPrecedingPosture: 'supine_or_resting',
      sn_prodrome_none: true, snWarningProdromes: ['none_sudden'], snMotorPattern: 'generalized_tonic_clonic',
      sn_eye_deviation: true, sn_incontinence: true, sn_cyanosis_apnea: true,
      snRecoveryDuration: 'confusion_drowsy_gt_5m', sn_post_headache: true, sn_post_myalgia: true,
      snPriorHistory: 'first_time_tloc', sn_rf_none: true, snPregnancyStatus: 'pregnant',
      snPregnancyWeeks: '34 สัปดาห์', snLmpDate: '20/03/2026',
      otherSymptomsFree: 'ปวดศีรษะท้ายทอยและตาพร่ามัวก่อนชัก', hospRecordStatus: 'complete',
      underlying: ['ความดันโลหิตสูงขณะตั้งครรภ์'], currentMeds: 'Methyldopa 250 mg tid',
      doctor_notes: {
        additional_hpi: 'หญิงตั้งครรภ์ 34 สัปดาห์ มีอาการชักเกร็งทั้งตัวเป็นครั้งแรกหลังปวดศีรษะและตาพร่ามัว',
        physical_exam: 'BT 36.8 C, PR 96/min, RR 20/min, BP 178/112 mmHg, SpO2 98%. Urine dipstick: Protein 3+.',
        preliminary_dx: 'Antepartum Eclampsia [OBSTETRIC CRITICAL EMERGENCY]',
        plan: 'IV MgSO4 loading 4g then 1g/hr, IV Nicardipine titration, Emergency OB-GYN consult'
      }
    }),
    makeSnSeed({
      id: 'case-093', queue_number: 'A-093', hn: '6708325', name: 'นายประเสริฐ ทองสุข', age: 58, gender: 'ชาย',
      timestamp: '2026-10-26T02:16:26.424Z', durationVal: 2, durationUnit: 'hours', snExactTimeUnknown: true,
      snReporter: 'witness_relative', snLossDuration: 'typical_1_4m', snPrecedingPosture: 'standing_or_walking_normal',
      snWarningProdromes: ['unknown'], snMotorPattern: 'focal_motor', snFocalParts: ['face_mouth', 'arm_hand'],
      snFocalSide: 'left', snFocalAwareness: 'aware', sn_ictal_none: true,
      snRecoveryDuration: 'confusion_drowsy_gt_5m', sn_post_weakness: true, snToddSide: 'left',
      sn_post_headache: true, snFallInjury: 'yes', sn_fall_head_impact: true, sn_fall_open_wound: true,
      snFallInjuryDetailText: 'แผลถลอกและปูดโนบริเวณหน้าผากซ้าย', snPriorHistory: 'first_time_tloc', sn_rf_none: true,
      hospRecordStatus: 'self', underlying: ['ความดันโลหิตสูง'], currentMeds: 'Amlodipine 5 mg od',
      doctor_notes: {
        additional_hpi: 'ชักกระตุกเฉพาะมุมปากและแขนซ้ายครั้งแรกในชีวิต หลังหยุดชักแขนซ้ายอ่อนแรงและล้มศีรษะกระแทกพื้น',
        physical_exam: 'BT 36.9 C, PR 88/min, RR 18/min, BP 164/96 mmHg. Left hemiparesis grade 3/5, scalp abrasion left frontal.',
        preliminary_dx: 'First-Onset Focal Motor Seizure with Todd Paresis & Secondary Head Impact',
        plan: 'STAT Non-contrast CT Brain, Electrolytes, DTX, Neuro consult'
      }
    }),
    makeSnSeed({
      id: 'case-094', queue_number: 'A-094', hn: '6708436', name: 'น.ส.พิมพ์ชนก สุวรรณเวช', age: 19, gender: 'หญิง',
      timestamp: '2026-10-26T02:11:26.424Z', durationVal: 30, durationUnit: 'minutes', snExactTime: '08:40',
      snReporter: 'both_patient_witness', snLossDuration: 'brief_seconds', snPrecedingPosture: 'prolonged_standing',
      snWarningProdromes: ['lightheaded_tunnel_vision', 'cold_sweat_pallor_nausea'],
      snMotorPattern: 'brief_myoclonic_syncope', sn_marked_pallor_sweat: true,
      snRecoveryDuration: 'rapid_under_2m_alert', sn_post_none: true, snPriorHistory: 'recurrent_vasovagal',
      sn_rf_none: true, snPregnancyStatus: 'not_pregnant', snLmpDate: '01/11/2026',
      otherSymptomsFree: 'ไม่ได้ทานข้าวเช้า ยืนเข้าแถวกลางแดดร้อนจัด รู้สึกหูอื้อและภาพตัดวูบไป',
      hospRecordStatus: 'self', underlying: ['ปฏิเสธ'], currentMeds: 'ไม่มี',
      doctor_notes: {
        additional_hpi: 'ยืนกลางแดดนาน หน้ามืดตัวเย็นเหงื่อซึมแล้ววูบกระตุกสั้นๆ 10 วินาที ฟื้นสติรู้เรื่องเต็มที่ภายใน 1 นาที',
        physical_exam: 'BT 36.7 C, PR 72/min, RR 16/min, BP 112/68 mmHg, SpO2 99%. Neuro exam normal. 12-lead EKG NSR.',
        preliminary_dx: 'Neurocardiogenic / Vasovagal Syncope with Brief Convulsive Myoclonus',
        plan: 'Hydration, reassurance, EKG screen, discharge instructions'
      }
    })
  ]
};

if (typeof registerCcModule === 'function') {
  registerCcModule(seizureModule);
} else if (typeof window !== 'undefined' && typeof window.registerCcModule === 'function') {
  window.registerCcModule(seizureModule);
}

if (typeof window !== 'undefined') {
  window.checkSeizurePediatricAgeGuidance = checkSeizurePediatricAgeGuidance;
  window.calculateSheldonScore = calculateSheldonScore;
  window.evaluateHyperventilationScreen = evaluateHyperventilationScreen;
  window.toggleSnBranch = toggleSnBranch;
  window.handleSnExactTimeUnknownChange = handleSnExactTimeUnknownChange;
  window.handleSnLossDurationChange = handleSnLossDurationChange;
  window.handleSnEpisodeCountChange = handleSnEpisodeCountChange;
  window.handleSnPostureChange = handleSnPostureChange;
  window.handleSnProdromeNoneChange = handleSnProdromeNoneChange;
  window.handleSnWarningChange = handleSnWarningChange;
  window.handleSnMotorPatternChange = handleSnMotorPatternChange;
  window.handleSnIctalNoneChange = handleSnIctalNoneChange;
  window.handleSnIctalItemChange = handleSnIctalItemChange;
  window.handleSnRecoveryChange = handleSnRecoveryChange;
  window.updateSnPostIctalContext = updateSnPostIctalContext;
  window.handleSnPostNoneChange = handleSnPostNoneChange;
  window.handleSnPostSymptomChange = handleSnPostSymptomChange;
  window.handleSnFallInjuryChange = handleSnFallInjuryChange;
  window.handleSnPriorHistoryChange = handleSnPriorHistoryChange;
  window.handleSnRfNoneChange = handleSnRfNoneChange;
  window.handleSnRfItemChange = handleSnRfItemChange;
  window.handleSnSubstanceChange = handleSnSubstanceChange;
  window.handleSnPregnancyChange = handleSnPregnancyChange;
}
