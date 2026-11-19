// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 08_seizure.js
// อาการนำ: ชัก / เกร็งกระตุก (Seizure / Convulsion)
// ปรับปรุงตาม plan_seizure.md, SKILL_PLAN_CC และ SKILL_CODE_CC (C-AP1 ถึง C-AP16)
// รองรับการเรียกร่วมกับ 09_syncope.js (calculateSheldonScore & evaluateHyperventilationScreen)
// และ core_engine.js (checkSeizurePediatricAgeGuidance & #seizurePediatricAgeBanner)
// =========================================================================

function checkSeizurePediatricAgeGuidance() {
  const ageVal = parseInt(document.getElementById('patientAgeInput')?.value, 10);
  const banner = document.getElementById('seizurePediatricAgeBanner');
  if (banner) {
    banner.classList.remove('hidden');
    if (!isNaN(ageVal) && ageVal < 6) {
      banner.classList.add('ring-2', 'ring-amber-500', 'bg-amber-100');
    } else {
      banner.classList.remove('ring-2', 'ring-amber-500', 'bg-amber-100');
    }
  }
  syncSnFemaleSection();
  updateSnPostIctalContext();
}

function toggleSnBranch(id, show) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('hidden', !show);
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
  const bodyHtml = desc
    ? `<div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">${title}</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">${desc}</span></div>`
    : `<span class="ml-3 ${compact ? 'text-xs' : 'text-xs sm:text-sm'} font-semibold text-slate-800">${title}</span>`;
  return `<label ${wrapAttr}class="selectable-card flex ${alignCls} ${padCls} rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition${spanCls}"><input type="${kind}" ${idAttr}${nameAttr}${valAttr}${chgAttr}class="${topCls}${roundCls}text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0">${bodyHtml}</label>`;
}

function renderSnGrid(colsCls, items, shared = {}) {
  return `<div class="grid ${colsCls} gap-2.5">${items.map(it => renderSnCard({ ...shared, ...it })).join('\n')}</div>`;
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
  const unk = document.getElementById('snExactTimeUnknown')?.checked;
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

function handleSnWarningChange(el) {
  if (!el) return;
  const exclusiveVals = new Set(['none_sudden', 'unknown']);
  if (el.checked && exclusiveVals.has(el.value)) {
    document.querySelectorAll('input[name="snWarningProdrome"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  } else if (el.checked) {
    document.querySelectorAll('input[name="snWarningProdrome"]').forEach(cb => {
      if (exclusiveVals.has(cb.value)) cb.checked = false;
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

function handleSnRecoveryChange() {
  const rec = getSnRadioValue('snRecoveryDuration');
  const hidePostSymptoms = rec === 'persistent_unconscious';
  toggleSnBranch('snPostRecoverySymptomsWrap', !hidePostSymptoms);
  if (hidePostSymptoms) {
    clearSnCheckboxesByIds([
      'sn_post_weakness', 'sn_post_headache', 'sn_post_myalgia', 'sn_post_nausea_vomit', 'sn_post_none'
    ]);
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
    clearSnCheckboxesByIds([
      'sn_post_weakness', 'sn_post_headache', 'sn_post_myalgia', 'sn_post_nausea_vomit', 'sn_post_none'
    ]);
    toggleSnBranch('snToddSideWrap', false);
    clearSnRadioGroup('snToddSide');
  } else {
    handleSnRecoveryChange();
  }
}

function handleSnPostSymptomChange(el) {
  const symIds = ['sn_post_weakness', 'sn_post_headache', 'sn_post_myalgia', 'sn_post_nausea_vomit'];
  if (el && el.id === 'sn_post_none' && el.checked) {
    clearSnCheckboxesByIds(symIds);
  } else if (el && el.checked && el.id !== 'sn_post_none') {
    const noneCb = document.getElementById('sn_post_none');
    if (noneCb) noneCb.checked = false;
  }
  const hasWeak = document.getElementById('sn_post_weakness')?.checked;
  toggleSnBranch('snToddSideWrap', Boolean(hasWeak));
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

function handleSnSubstanceChange() {
  const hasSub = document.getElementById('sn_rf_substance_toxin')?.checked;
  toggleSnBranch('snSubstanceDetailsWrap', Boolean(hasSub));
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

// --- Lookup Tables (Thai Labels for 100% Zero Raw Enum Leaks — C-AP14) ---
const SN_LABELS = {
  reporter: {
    patient_self: 'ผู้ป่วยให้ข้อมูลด้วยตนเอง',
    witness_relative: 'ญาติหรือผู้เห็นเหตุการณ์เป็นผู้เล่า',
    both_patient_witness: 'ผู้ป่วยและผู้เห็นเหตุการณ์ร่วมกันให้ข้อมูล',
    unspecified: 'ไม่ได้ระบุผู้ให้ข้อมูล'
  },
  posture: {
    prolonged_standing: 'ยืนนาน หรืออยู่ในที่ร้อนแออัด',
    sudden_standing: 'ลุกขึ้นยืนหรือเปลี่ยนท่าเร็วๆ',
    during_exertion: 'ขณะออกแรง หรือออกกำลังกาย',
    supine_or_resting: 'ขณะนั่งพัก หรือนอนอยู่เฉยๆ',
    sleep: 'ขณะกำลังนอนหลับ',
    standing_or_walking_normal: 'ขณะยืนหรือเดินตามปกติ',
    micturition_defecation: 'ขณะหรือหลังปัสสาวะ ขับถ่าย หรือไอแรงๆ',
    unspecified: 'ไม่ได้ระบุท่าทางก่อนเกิดเหตุ'
  },
  lossDuration: {
    brief_seconds: 'สั้นมาก ไม่เกิน 1 นาที (ประมาณ 10–30 วินาที)',
    typical_1_4m: 'นานประมาณ 1 – 4 นาที',
    continuous_unstopped: 'ชักต่อเนื่องไม่หยุดจนถึงขณะนี้',
    unknown_duration: 'ไม่ทราบระยะเวลาที่แน่นอน (ไม่ได้สังเกต)',
    unspecified: 'ไม่ได้ระบุระยะเวลาที่ชักหรือหมดสติ'
  },
  interictal: {
    full_recovery: 'ระหว่างรอบฟื้นคืนสติ พูดคุยรู้เรื่องดี',
    unconscious_or_drowsy: 'ระหว่างรอบไม่ฟื้นสติ หรือซึมตลอดเวลา'
  },
  prodrome: {
    none_sudden: 'ไม่มีอาการเตือน เกิดขึ้นกะทันหัน',
    lightheaded_tunnel_vision: 'หน้ามืด วิงเวียน หรือตาพร่ามัว',
    cold_sweat_pallor_nausea: 'เหงื่อแตกตัวเย็น หรือหน้าซีด',
    sudden_palpitation: 'ใจสั่นรัว หรือหัวใจเต้นสะดุด',
    chest_pain: 'เจ็บแน่นหน้าอก หรืออึดอัดกลางอก',
    hyperventilation_tingling: 'หายใจหอบเร็ว หรือชารอบปากและปลายมือ',
    epigastric_rising: 'จุกแน่นหรือโหวงในท้องลอยขึ้นมาที่คอ (Aura)',
    olfactory_visual_aura: 'ได้กลิ่นแปลกๆ หรือเห็นแสงวูบวาบ (Aura)',
    unknown: 'ไม่ทราบ หรือจำอาการก่อนเกิดเหตุไม่ได้'
  },
  motor: {
    generalized_tonic_clonic: 'เกร็งแข็งและกระตุกพร้อมกันทั้งตัว (GTCS)',
    focal_motor: 'เกร็งหรือกระตุกเฉพาะบางส่วนของร่างกาย (Focal)',
    brief_myoclonic_syncope: 'วูบล้มลงแล้วกระตุกเบาๆ สั้นๆ ไม่กี่ครั้ง',
    carpopedal_spasm: 'มือจีบเกร็งทั้งสองข้าง นิ้วงุ้มเข้าหากัน',
    absence_automatism: 'เหม่อลอย นิ่งค้าง เรียกไม่ตอบสนอง',
    atonic_limp: 'ตัวอ่อนปวกเปียกล้มลง ไม่มีการเกร็งกระตุก',
    thrashing_closed_eyes: 'ดิ้นสะบัดไปมา หรือส่ายศีรษะขณะหลับตา',
    unknown_or_unobserved: 'ไม่ทราบแน่ชัด หรือไม่มีผู้เห็นตอนเกิดเหตุ',
    unspecified: 'ไม่ได้ระบุลักษณะการเกร็ง'
  },
  focalParts: {
    face_mouth: 'ใบหน้า/มุมปาก',
    arm_hand: 'แขน/มือ',
    leg_foot: 'ขา/เท้า'
  },
  focalSides: {
    left: 'ข้างซ้าย',
    right: 'ข้างขวา',
    bilateral_or_secondarily_generalized: 'สลับข้างหรือลามไปทั้งตัว'
  },
  focalAwareness: {
    aware: 'รู้สึกตัวดีขณะกระตุก',
    impaired: 'เหม่อลอยหรือไม่รู้สึกตัว'
  },
  recovery: {
    rapid_under_2m_alert: 'ฟื้นคืนสติเร็วมาก ภายใน 1–2 นาที',
    confusion_drowsy_gt_5m: 'สับสน มึนงง หรือจำเหตุการณ์ไม่ได้นานเกิน 5 นาที',
    tearful_emotional_tachypnea: 'รู้สึกตัวดีแต่ยังเหนื่อยหอบ ร้องไห้ หรือมือชา',
    persistent_unconscious: 'ขณะนี้ยังไม่ฟื้นคืนสติ หรือยังซึมมากปลุกตื่นยาก',
    unspecified: 'ไม่ได้ระบุการฟื้นตัว'
  },
  toddSides: {
    left: 'ซีกซ้าย',
    right: 'ซีกขวา',
    both: 'ทั้งสองข้าง'
  },
  priorHistory: {
    first_time_tloc: 'เพิ่งเคยมีอาการครั้งนี้เป็นครั้งแรกในชีวิต',
    known_epilepsy: 'เป็นโรคลมชักเดิมอยู่แล้ว',
    recurrent_vasovagal: 'เคยมีประวัติเป็นลมหน้ามืดบ่อยๆ',
    unspecified: 'ไม่ได้ระบุ'
  },
  compliance: {
    compliant: 'รับประทานยาสม่ำเสมอทุกวัน',
    missed_or_stopped: 'ขาดยา ลืมกินยา หรือหยุดยาเอง',
    dose_changed: 'เพิ่งปรับขนาดยาหรือเปลี่ยนชนิดยา',
    lost_followup: 'ไม่ได้รักษาต่อเนื่อง หรือขาดนัด',
    unspecified: 'ไม่ได้ระบุการรับประทานยา'
  },
  pregnancy: {
    not_pregnant: 'ไม่ได้ตั้งครรภ์',
    pregnant: 'กำลังตั้งครรภ์',
    postpartum_6w: 'เพิ่งคลอดบุตร หรือแท้งบุตรภายใน 6 สัปดาห์ที่ผ่านมา',
    menopause_or_hysterectomy: 'วัยหมดประจำเดือน หรือผ่าตัดมดลูกแล้ว',
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
      <div data-cc-top-banner="seizure"><div class="flex flex-col gap-4">
      <!-- PEDIATRIC AGE (< 6 YEARS) GUIDANCE BANNER -->
      <div id="seizurePediatricAgeBanner" class="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-2xl flex items-start space-x-3">
        <i data-lucide="alert-triangle" class="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"></i>
        <div class="text-xs text-amber-900 leading-relaxed">
          <strong class="font-bold">ข้อความแจ้งเตือนจุดคัดกรอง:</strong> ในกรณีผู้ป่วยเป็นเด็กอายุ &lt; 6 ปี ที่มีอาการชักหรือชักเกร็งจากไข้สูง กรุณาเลือกอาการสำคัญใช้ <strong>&lt;ชักเกร็งในเด็กอายุ &lt; 6 ปี&gt;</strong> แทน เพื่อการประเมินภาวะชักในเด็กอย่างถูกต้อง หรือแจ้งพยาบาลคัดกรองทันที
        </div>
      </div>

      <!-- FIRST-AID SAFETY GUIDANCE BANNER -->
      <div class="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-start space-x-3 text-xs text-slate-800 leading-relaxed">
        <i data-lucide="info" class="w-5 h-5 text-medical-600 mt-0.5 flex-shrink-0"></i>
        <div class="space-y-1">
          <p class="font-bold text-slate-900">ข้อแนะนำการดูแลความปลอดภัยเบื้องต้นระหว่างรอพบแพทย์:</p>
          <p>1. <strong>จัดท่านอนตะแคงกึ่งคว่ำ:</strong> หากผู้ป่วยยังมีอาการเกร็งกระตุกหรือง่วงซึม ให้จัดนอนตะแคงและหนุนศีรษะด้วยของนุ่ม เพื่อป้องกันการสำลักและป้องกันศีรษะกระแทก</p>
          <p>2. <strong>ห้ามงัดปากหรือใส่สิ่งของเข้าปากเด็ดขาด:</strong> ห้ามใช้ช้อน นิ้วมือ หรือสิ่งของใดๆ งัดปากผู้ป่วย และให้งดน้ำงดอาหารทุกชนิดไว้ก่อน</p>
          <p>3. <strong>แจ้งพยาบาลหน้าห้องตรวจทันที:</strong> หากผู้ป่วยเริ่มชักซ้ำ ชักนานต่อเนื่อง หายใจลำบาก ริมฝีปากเขียวคล้ำ หรือปลุกไม่ตื่น</p>
        </div>
      </div>
      </div></div>

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
            { value: 'patient_self', title: 'ผู้ป่วยให้ข้อมูลด้วยตนเอง', desc: 'ผู้ป่วยรู้สึกตัวดีและเล่าเหตุการณ์ได้ด้วยตนเอง' },
            { value: 'witness_relative', title: 'ญาติ หรือผู้เห็นเหตุการณ์', desc: 'ผู้อยู่ในเหตุการณ์ขณะผู้ป่วยชักหรือหมดสติเป็นผู้ให้ข้อมูล' },
            { value: 'both_patient_witness', title: 'ผู้ป่วยและผู้เห็นเหตุการณ์ร่วมกัน', desc: 'ทั้งผู้ป่วยและผู้เห็นเหตุการณ์ช่วยกันให้ข้อมูล' }
          ], { kind: 'radio', name: 'snReporter' })}
        </div>

        <!-- 1.2 ระยะเวลาและเวลาเกิดเหตุ -->
        <div class="space-y-3 pt-2 border-t border-slate-100">
          <label class="block text-xs font-bold text-slate-700">1.2 ระยะเวลาตั้งแต่เริ่มเกิดเหตุการณ์ครั้งนี้จนถึงปัจจุบัน: <span class="text-rose-500">*</span></label>
          <div class="flex items-center space-x-2 max-w-xs">
            <input type="number" id="snDurationVal" min="0" placeholder="เช่น 30"
              class="w-24 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 text-center font-bold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white">
            <select id="snDurationUnit" class="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white flex-1">
              <option value="minutes">นาที</option>
              <option value="hours" selected>ชั่วโมง</option>
              <option value="days">วัน</option>
              <option value="weeks">สัปดาห์</option>
              <option value="months">เดือน</option>
              <option value="years">ปี</option>
            </select>
          </div>
          <div class="space-y-2 pt-1 max-w-md">
            ${renderSnCard({ kind: 'checkbox', id: 'snExactTimeUnknown', onchange: 'handleSnExactTimeUnknownChange()', title: 'ไม่ทราบเวลาที่เกิดเหตุแน่ชัด', desc: 'เมื่อติ๊กข้อนี้ ระบบจะซ่อนช่องระบุเวลาด้านล่าง' })}
            <div id="snExactTimeWrap" class="max-w-xs">
              <span class="block text-xs font-semibold text-slate-600 mb-1">เวลาที่เกิดเหตุล่าสุด (ระบบ 24 ชม.):</span>
              <input type="text" id="snExactTime" data-universal-time="true" placeholder="เช่น 14:30"
                class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white">
            </div>
          </div>
        </div>

        <!-- 1.3 ระยะเวลาที่ชักเกร็งหรือหมดสติในแต่ละครั้ง -->
        <div class="pt-2 border-t border-slate-100">
          <label class="block text-xs font-bold text-slate-700 mb-2">1.3 ระยะเวลาที่ชักเกร็งหรือหมดสติในแต่ละครั้ง: <span class="text-rose-500">*</span></label>
          ${renderSnGrid('grid-cols-1 sm:grid-cols-2', [
            { value: 'brief_seconds', title: 'สั้นมาก ไม่เกิน 1 นาที', desc: 'วูบหรือเกร็งสั้นๆ ประมาณ 10–30 วินาที แล้วเริ่มรู้สึกตัว' },
            { value: 'typical_1_4m', title: 'นานประมาณ 1 – 4 นาที', desc: 'มีอาการชักเกร็งหรือหมดสตินานเป็นนาที แล้วหยุดเอง' },
            { value: 'prolonged_gte_5m', title: 'นานตั้งแต่ 5 นาทีขึ้นไป', desc: 'ชักเกร็งหรือหมดสติติดต่อกันนานตั้งแต่ 5 นาทีขึ้นไป' },
            { value: 'continuous_unstopped', title: 'ยังชักต่อเนื่องไม่หยุดจนถึงขณะนี้', desc: 'ขณะนี้ยังมีอาการเกร็งกระตุกต่อเนื่องไม่หยุด ควรแจ้งพยาบาลทันที' },
            { value: 'unknown_duration', title: 'ไม่ทราบระยะเวลาที่แน่นอน', desc: 'ไม่ได้สังเกต หรือพบผู้ป่วยหลังจากหยุดชักแล้ว', colSpan2: true }
          ], { kind: 'radio', name: 'snLossDuration', onchange: 'handleSnLossDurationChange()' })}
          <div id="snDurationGte5mWrap" class="hidden mt-3 ml-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
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
          <label class="block text-xs font-bold text-slate-700 mb-2">1.4 จำนวนครั้งที่มีอาการในรอบ 24 ชั่วโมงที่ผ่านมา: <span class="text-rose-500">*</span></label>
          ${renderSnGrid('grid-cols-1 sm:grid-cols-2', [
            { value: 'single', title: 'เกิดขึ้นเพียงครั้งเดียว', desc: 'มีอาการชักหรือหมดสติเพียง 1 ครั้งในวันนี้' },
            { value: 'multiple_cluster', title: 'เกิดซ้ำตั้งแต่ 2 ครั้งขึ้นไป', desc: 'มีอาการชักหรือหมดสติซ้ำหลายรอบในวันนี้' }
          ], { kind: 'radio', name: 'snEpisodeCount', onchange: 'handleSnEpisodeCountChange()' })}
          <div id="snClusterSubWrap" class="hidden mt-3 ml-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
            <div class="space-y-1.5">
              <span class="font-semibold text-slate-800 block">1.4.1 จำนวนครั้งที่มีอาการทั้งหมดในวันนี้:</span>
              <div class="flex items-center space-x-2 max-w-xs">
                <input type="number" id="snEpisodeCountVal" min="2" max="50" placeholder="เช่น 2 หรือ 3"
                  class="w-24 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 text-center font-bold focus:outline-none focus:ring-2 focus:ring-medical-500">
                <span class="text-slate-600 font-medium">ครั้ง</span>
              </div>
            </div>
            <div class="pt-2 border-t border-slate-200 space-y-2">
              <span class="font-semibold text-slate-800 block">1.4.2 สภาพความรู้สึกตัวในช่วงพักระหว่างรอบ:</span>
              ${renderSnGrid('grid-cols-1 sm:grid-cols-2', [
                { value: 'full_recovery', title: 'ฟื้นคืนสติ พูดคุยรู้เรื่องดี', desc: 'ระหว่างรอบตื่นรู้ตัวและพูดคุยตอบสนองได้ตามปกติ' },
                { value: 'unconscious_or_drowsy', title: 'ไม่ฟื้นสติ หรือซึมตลอดเวลา', desc: 'ระหว่างรอบยังไม่ตื่นรู้ตัว ซึมมาก หรือชักซ้ำต่อเนื่องทันที' }
              ], { kind: 'radio', name: 'snInterictalState', onchange: 'updateSnPostIctalContext()' })}
            </div>
          </div>
        </div>

        <!-- 1.5 ท่าทางหรือกิจกรรมก่อนเกิดอาการ -->
        <div class="pt-2 border-t border-slate-100">
          <label class="block text-xs font-bold text-slate-700 mb-2">1.5 ท่าทางหรือกิจกรรมที่กำลังทำก่อนเกิดอาการทันที: <span class="text-rose-500">*</span></label>
          ${renderSnGrid('grid-cols-1 sm:grid-cols-2', [
            { value: 'prolonged_standing', title: 'ยืนนาน หรืออยู่ในที่ร้อนแออัด', desc: 'เช่น ยืนเข้าแถวนานๆ ยืนตากแดด หรืออยู่ในห้องที่ร้อนอบอ้าว' },
            { value: 'sudden_standing', title: 'ลุกขึ้นยืนหรือเปลี่ยนท่าเร็วๆ', desc: 'เพิ่งลุกขึ้นยืนอย่างรวดเร็วจากท่านั่งหรือท่านอน' },
            { value: 'during_exertion', title: 'ขณะออกแรง หรือออกกำลังกาย', desc: 'เกิดอาการขึ้นในขณะที่กำลังทำงานหนัก วิ่ง หรือออกกำลังกาย' },
            { value: 'supine_or_resting', title: 'ขณะนั่งพัก หรือนอนอยู่เฉยๆ', desc: 'เกิดขึ้นขณะนั่งพักผ่อนหรือนอนหงายอยู่ตามปกติ ไม่ได้ออกแรง' },
            { value: 'sleep', title: 'ขณะกำลังนอนหลับ', desc: 'เกิดอาการชักขึ้นระหว่างนอนหลับ หรือสังเกตเห็นอาการตอนตื่นนอน' },
            { value: 'standing_or_walking_normal', title: 'ขณะยืนหรือเดินตามปกติ', desc: 'ยืนหรือเดินทำกิจวัตรทั่วไปโดยไม่ได้ออกแรงหนัก' },
            { value: 'micturition_defecation', title: 'ขณะหรือหลังปัสสาวะ ขับถ่าย หรือไอแรงๆ', desc: 'เกิดอาการทันทีขณะเบ่งปัสสาวะ ถ่ายอุจจาระ หรือไอติดต่อกันรุนแรง' },
            { value: 'other', title: 'อื่นๆ', desc: 'ท่าทางหรือกิจกรรมอื่นๆ (ระบุเพิ่มเติมด้านล่าง)' }
          ], { kind: 'radio', name: 'snPrecedingPosture', onchange: 'handleSnPostureChange()' })}
          <div id="snPostureOtherWrap" class="hidden mt-2.5">
            <input type="text" id="snPostureOtherText" placeholder="ระบุท่าทางหรือกิจกรรมที่กำลังทำก่อนเกิดอาการ..."
              class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white">
          </div>
        </div>
      </div>

      <!-- CARD 2: อาการเตือนนำ และลักษณะการเกร็งกระตุกขณะเกิดเหตุ -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
        <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="activity" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">2. อาการเตือนนำ และลักษณะการเกร็งกระตุกขณะเกิดเหตุ</h2>
            <p class="text-xs text-slate-500">ประเมินอาการนำก่อนหมดสติ ลักษณะการเคลื่อนไหว และอาการร่วมที่สังเกตเห็น</p>
          </div>
        </div>

        <!-- 2.1 อาการเตือนนำ -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-2">2.1 อาการเตือนที่ผู้ป่วยรู้สึกได้ก่อนที่จะหมดสติหรือเกร็งกระตุก: (เลือกได้หลายข้อ)</label>
          ${renderSnGrid('grid-cols-1 sm:grid-cols-2', [
            { value: 'none_sudden', title: 'ไม่มีอาการเตือน เกิดขึ้นกะทันหัน', desc: 'อยู่ดีๆ ก็หมดสติหรือชักเกร็งขึ้นมาทันทีโดยไม่มีอาการเตือนล่วงหน้า' },
            { value: 'lightheaded_tunnel_vision', title: 'หน้ามืด วิงเวียน หรือตาพร่ามัว', desc: 'รู้สึกศีรษะเบาหวิว ภาพมืดลงเรื่อยๆ หรือมีเสียงดังอื้อในหู' },
            { value: 'cold_sweat_pallor_nausea', title: 'เหงื่อแตกตัวเย็น หรือหน้าซีด', desc: 'เหงื่อออกชุ่มตัว ตัวเย็นเฉียบ หรือรู้สึกคลื่นไส้พะอืดพะอมก่อนวูบ' },
            { value: 'sudden_palpitation', title: 'ใจสั่นรัว หรือหัวใจเต้นสะดุด', desc: 'รู้สึกหัวใจเต้นเร็วแรงผิดจังหวะอย่างกะทันหันก่อนหมดสติ' },
            { value: 'chest_pain', title: 'เจ็บแน่นหน้าอก หรืออึดอัดกลางอก', desc: 'มีอาการเจ็บแน่นหน้าอกหรือจุกแน่นลิ้นปี่นำมาก่อน' },
            { value: 'hyperventilation_tingling', title: 'หายใจหอบเร็ว หรือชารอบปากและปลายมือ', desc: 'รู้สึกหายใจไม่อิ่ม หายใจเร็วลึก ร่วมกับชาซ่าๆ รอบริมฝีปากหรือปลายนิ้ว' },
            { value: 'epigastric_rising', title: 'จุกแน่นหรือโหวงในท้องลอยขึ้นมาที่คอ', desc: 'รู้สึกแปลกๆ ในช่องท้องคล้ายมีก้อนหรือลมตีลอยขึ้นมาที่หน้าอกและลำคอ' },
            { value: 'olfactory_visual_aura', title: 'ได้กลิ่นแปลกๆ หรือเห็นแสงวูบวาบ', desc: 'เช่น ได้กลิ่นเหม็นไหม้ รสชาติแปลกในปาก เห็นภาพแสงกะพริบ หรือรู้สึกคุ้นเคยประหลาด' },
            { value: 'unknown', title: 'ไม่ทราบ หรือจำอาการก่อนเกิดเหตุไม่ได้', desc: 'ผู้ป่วยจำช่วงก่อนเกิดเหตุไม่ได้ หรือไม่มีผู้ทราบข้อมูล', colSpan2: true }
          ], { kind: 'checkbox', name: 'snWarningProdrome', onchange: 'handleSnWarningChange(this)' })}
        </div>

        <!-- 2.2 ลักษณะการเกร็งหรือกระตุกของร่างกายขณะเกิดเหตุ -->
        <div class="pt-2 border-t border-slate-100">
          <label class="block text-xs font-bold text-slate-700 mb-2">2.2 ลักษณะการเกร็งหรือกระตุกของร่างกายขณะเกิดเหตุ: <span class="text-rose-500">*</span></label>
          ${renderSnGrid('grid-cols-1 sm:grid-cols-2', [
            { value: 'generalized_tonic_clonic', title: 'เกร็งแข็งและกระตุกพร้อมกันทั้งตัว', desc: 'แขนขาและลำตัวแข็งเกร็ง ตามด้วยกระตุกเป็นจังหวะทั้งสองข้างพร้อมกัน' },
            { value: 'focal_motor', title: 'เกร็งหรือกระตุกเฉพาะบางส่วนของร่างกาย', desc: 'เช่น กระตุกเฉพาะใบหน้า มุมปาก แขน หรือขาเพียงข้างเดียว' },
            { value: 'brief_myoclonic_syncope', title: 'วูบล้มลงแล้วกระตุกเบาๆ สั้นๆ ไม่กี่ครั้ง', desc: 'ตัวอ่อนล้มลงก่อน แล้วมีแขนขากระตุกเบาๆ เพียงไม่กี่วินาที' },
            { value: 'carpopedal_spasm', title: 'มือจีบเกร็งทั้งสองข้าง นิ้วงุ้มเข้าหากัน', desc: 'ข้อมือและนิ้วมือทั้งสองข้างเกร็งจีบเข้าหากัน หรือเกร็งปลายเท้างุ้ม' },
            { value: 'absence_automatism', title: 'เหม่อลอย นิ่งค้าง เรียกไม่ตอบสนอง', desc: 'นิ่งเหม่อไปชั่วขณะ อาจมีอาการเคี้ยวปาก เม้มปาก หรือขยำมือซ้ำๆ' },
            { value: 'atonic_limp', title: 'ตัวอ่อนปวกเปียกล้มลง ไม่มีการเกร็งกระตุก', desc: 'หมดสติตัวอ่อนพับลงกับพื้นเฉยๆ โดยไม่มีอาการเกร็งหรือกระตุก' },
            { value: 'thrashing_closed_eyes', title: 'ดิ้นสะบัดไปมา หรือส่ายศีรษะขณะหลับตา', desc: 'แขนขาสะบัดไม่พร้อมกัน ส่ายศีรษะไปมา หรือแอ่นลำตัว' },
            { value: 'unknown_or_unobserved', title: 'ไม่ทราบแน่ชัด หรือไม่มีผู้เห็นตอนเกิดเหตุ', desc: 'ไม่มีคนเห็นเหตุการณ์ขณะกำลังชักหรือหมดสติ' }
          ], { kind: 'radio', name: 'snMotorPattern', onchange: 'handleSnMotorPatternChange()' })}

          <!-- 2.2.1 กิ่งย่อย Focal Seizure (แยกแถวตำแหน่ง / ข้าง / ความรู้สึกตัว ชัดเจนตาม P-AP9) -->
          <div id="snFocalBranchWrap" class="hidden mt-3 ml-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
            <div>
              <span class="font-semibold text-slate-800 block mb-1.5">ตำแหน่งที่มีอาการเกร็งหรือกระตุก (เลือกได้หลายข้อ):</span>
              ${renderSnGrid('grid-cols-1 sm:grid-cols-3', [
                { value: 'face_mouth', title: 'ใบหน้า / มุมปาก' },
                { value: 'arm_hand', title: 'แขน / มือ' },
                { value: 'leg_foot', title: 'ขา / เท้า' }
              ], { kind: 'checkbox', name: 'snFocalParts', compact: true })}
            </div>
            <div class="pt-2 border-t border-slate-200">
              <span class="font-semibold text-slate-800 block mb-1.5">ข้างที่มีอาการกระตุก:</span>
              ${renderSnGrid('grid-cols-1 sm:grid-cols-3', [
                { value: 'left', title: 'ข้างซ้าย' },
                { value: 'right', title: 'ข้างขวา' },
                { value: 'bilateral_or_secondarily_generalized', title: 'สลับข้างหรือลามทั้งตัว' }
              ], { kind: 'radio', name: 'snFocalSide', compact: true })}
            </div>
            <div class="pt-2 border-t border-slate-200">
              <span class="font-semibold text-slate-800 block mb-1.5">ความรู้สึกตัวขณะกระตุก:</span>
              ${renderSnGrid('grid-cols-1 sm:grid-cols-2', [
                { value: 'aware', title: 'รู้สึกตัวดีขณะกระตุก' },
                { value: 'impaired', title: 'เหม่อลอยหรือไม่รู้สึกตัว' }
              ], { kind: 'radio', name: 'snFocalAwareness', compact: true })}
            </div>
          </div>
        </div>

        <!-- 2.3 อาการร่วมที่สังเกตเห็นขณะเกิดเหตุ -->
        <div class="pt-2 border-t border-slate-100">
          <label class="block text-xs font-bold text-slate-700 mb-2">2.3 อาการร่วมที่สังเกตเห็นขณะเกิดเหตุ: (เลือกได้หลายข้อ)</label>
          ${renderSnGrid('grid-cols-1 sm:grid-cols-2', [
            { id: 'sn_lateral_tongue_bite', title: 'กัดลิ้น หรือมีเลือดออกในปาก', desc: 'มีแผลกัดที่ด้านข้างของลิ้น กระพุ้งแก้ม หรือมีน้ำลายปนเลือด' },
            { id: 'sn_eye_deviation', title: 'ตาค้าง หรือตาเหลือกเบนไปข้างเดียว', desc: 'ลูกตาเหลือกค้างขึ้นด้านบน หรือหันเบนค้างไปทางซ้ายหรือขวา' },
            { id: 'sn_incontinence', title: 'ปัสสาวะราด หรืออุจจาระราด', desc: 'ไม่สามารถกลั้นปัสสาวะหรืออุจจาระได้ในขณะหมดสติ' },
            { id: 'sn_cyanosis_apnea', title: 'ริมฝีปากเขียวคล้ำ หรือหยุดหายใจชั่วขณะ', desc: 'สังเกตเห็นปากเขียว หน้าเขียวคล้ำ หรือมีเสียงหายใจครืดคราด' },
            { id: 'sn_marked_pallor_sweat', title: 'ใบหน้าซีดเผือด ตัวเย็น เหงื่อออกชุ่ม', desc: 'หน้าซีดขาว มือเท้าเย็น และมีเหงื่อออกเปียกชุ่มตัว', colSpan2: true }
          ], { kind: 'checkbox' })}
        </div>
      </div>

      <!-- CARD 3: สภาพความรู้สึกตัวหลังเกิดเหตุ อาการทางกาย และการบาดเจ็บจากการล้ม -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
        <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="refresh-cw" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">3. สภาพความรู้สึกตัวหลังเกิดเหตุ อาการทางกาย และการบาดเจ็บจากการล้ม</h2>
            <p class="text-xs text-slate-500">ประเมินการฟื้นคืนสติ อาการอ่อนแรงหลังชัก และภาวะบาดเจ็บจากการล้ม</p>
          </div>
        </div>

        <div id="snUnconsciousContextNotice" class="hidden p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-slate-700">
          ระบบตรวจพบว่าผู้ป่วยยังมีอาการชักต่อเนื่องหรือยังไม่ฟื้นสติระหว่างรอบ จึงปรับตัวเลือกคำถามด้านล่างให้สอดคล้องกับสถานะปัจจุบันโดยอัตโนมัติ
        </div>

        <!-- 3.1 การฟื้นคืนสติ -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-2">3.1 การฟื้นคืนสติและสภาพความรู้สึกตัวหลังหยุดชัก: <span class="text-rose-500">*</span></label>
          ${renderSnGrid('grid-cols-1 sm:grid-cols-2', [
            { wrapId: 'snRecOptWrap_rapid', value: 'rapid_under_2m_alert', title: 'ฟื้นคืนสติเร็วมาก ภายใน 1 – 2 นาที', desc: 'ตื่นรู้ตัวและพูดคุยรู้เรื่องเป็นปกติทันทีภายในไม่กี่นาที ไม่งง' },
            { wrapId: 'snRecOptWrap_confused', value: 'confusion_drowsy_gt_5m', title: 'สับสน มึนงง หรือจำไม่ได้นานเกิน 5 นาที', desc: 'หลังหยุดชักยังมีอาการงง ถามซ้ำๆ จำไม่ได้ หรือหลับลึกอยู่นาน' },
            { wrapId: 'snRecOptWrap_tearful', value: 'tearful_emotional_tachypnea', title: 'รู้สึกตัวดีแต่ยังเหนื่อยหอบ ร้องไห้ หรือมือชา', desc: 'ตื่นรู้เรื่องดีแต่ยังหายใจหอบเร็ว ตกใจกลัว หรือยังมีอาการมือจีบชา' },
            { value: 'persistent_unconscious', title: 'ขณะนี้ยังไม่ฟื้นคืนสติ หรือยังซึมมาก', desc: 'จนถึงขณะนี้ผู้ป่วยยังไม่ตื่นเป็นปกติ หรือเรียกแล้วไม่ค่อยตอบสนอง' }
          ], { kind: 'radio', name: 'snRecoveryDuration', onchange: 'handleSnRecoveryChange()' })}
        </div>

        <!-- 3.2 อาการผิดปกติหลังจากเริ่มรู้สึกตัว (Context-Filtered) -->
        <div id="snPostRecoverySymptomsWrap" class="pt-2 border-t border-slate-100 space-y-2.5">
          <label class="block text-xs font-bold text-slate-700">3.2 อาการผิดปกติหลังจากเริ่มรู้สึกตัว: (เลือกได้หลายข้อ)</label>
          ${renderSnGrid('grid-cols-1 sm:grid-cols-2', [
            { id: 'sn_post_weakness', title: 'แขนขาอ่อนแรง ปากเบี้ยว หรือพูดไม่ชัด', desc: 'ขยับแขนหรือขาข้างใดข้างหนึ่งได้น้อยลง ยกไม่ขึ้น หรือมุมปากตกหลังหยุดชัก' },
            { id: 'sn_post_headache', title: 'ปวดศีรษะรุนแรง', desc: 'มีอาการปวดศีรษะตุบๆ หรือปวดมึนศีรษะมากหลังฟื้น' },
            { id: 'sn_post_myalgia', title: 'ปวดเมื่อยหรือระบมกล้ามเนื้อตามตัว', desc: 'รู้สึกปวดตึงหรือระบมกล้ามเนื้อแขนขาและลำตัวหลังเกร็งกระตุก' },
            { id: 'sn_post_nausea_vomit', title: 'คลื่นไส้ หรืออาเจียน', desc: 'มีอาการคลื่นไส้หรืออาเจียนหลังเกิดเหตุ' },
            { id: 'sn_post_none', title: 'ไม่มีอาการผิดปกติ (หรืออ่อนเพลียเล็กน้อยเท่านั้น)', desc: 'เมื่อเลือกข้อนี้ ระบบจะยกเลิกอาการผิดปกติข้ออื่นในหมวด 3.2 อัตโนมัติ', colSpan2: true }
          ], { kind: 'checkbox', onchange: 'handleSnPostSymptomChange(this)' })}
          <div id="snToddSideWrap" class="hidden mt-3 ml-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <span class="font-semibold text-slate-800 block">ข้างที่มีอาการอ่อนแรงหรือปากเบี้ยว:</span>
            ${renderSnGrid('grid-cols-1 sm:grid-cols-3', [
              { value: 'left', title: 'ซีกซ้าย' },
              { value: 'right', title: 'ซีกขวา' },
              { value: 'both', title: 'ทั้งสองข้าง' }
            ], { kind: 'radio', name: 'snToddSide', compact: true })}
          </div>
        </div>

        <!-- 3.3 การบาดเจ็บจากการล้มหรือกระแทก -->
        <div class="pt-2 border-t border-slate-100">
          <label class="block text-xs font-bold text-slate-700 mb-2">3.3 การบาดเจ็บจากการล้มหรือกระแทกขณะเกิดเหตุ: <span class="text-rose-500">*</span></label>
          ${renderSnGrid('grid-cols-1 sm:grid-cols-2', [
            { value: 'no', title: 'ไม่มีการบาดเจ็บจากการล้ม', desc: 'มีคนประคองทัน หรือเกิดเหตุบนเตียง/ที่ปลอดภัย ไม่มีแผลกระแทก' },
            { value: 'yes', title: 'มีศีรษะกระแทกพื้น หรือบาดเจ็บตามร่างกาย', desc: 'ล้มกระแทกพื้นหรือของแข็งจนมีแผล เลือดออก หรือปวดบวม' }
          ], { kind: 'radio', name: 'snFallInjury', onchange: 'handleSnFallInjuryChange()' })}
          <div id="snFallInjuryDetailWrap" class="hidden mt-3 ml-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
            <span class="font-semibold text-slate-800 block">ลักษณะการบาดเจ็บที่เกิดขึ้น (เลือกได้หลายข้อ):</span>
            ${renderSnGrid('grid-cols-1 sm:grid-cols-3', [
              { id: 'sn_fall_head_impact', title: 'ศีรษะหรือใบหน้ากระแทกพื้นโดยตรง' },
              { id: 'sn_fall_open_wound', title: 'มีแผลฉีกขาดหรือเลือดออก' },
              { id: 'sn_fall_pain_swelling', title: 'มีอาการปวดบวม ฟกช้ำ หรือปวดกระดูก' }
            ], { kind: 'checkbox', compact: true })}
            <div>
              <span class="block text-xs font-semibold text-slate-700 mb-1">ระบุตำแหน่งที่ได้รับบาดเจ็บ (ถ้ามี):</span>
              <input type="text" id="snFallInjuryDetailText" placeholder="เช่น หน้าผากแตก, ท้ายทอยโน, ปวดหัวไหล่ขวา..."
                class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 4: ประวัติโรคลมชักเดิม ปัจจัยกระตุ้น และข้อมูลเฉพาะสตรี -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
        <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="shield-alert" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">4. ประวัติโรคลมชักเดิม ปัจจัยกระตุ้น และข้อมูลเฉพาะสตรี</h2>
            <p class="text-xs text-slate-500">ประวัติการชัก การรับประทานยา ปัจจัยกระตุ้น และประวัติการตั้งครรภ์เฉพาะสตรี</p>
          </div>
        </div>

        <!-- 4.1 ประวัติการชักหรือหมดสติในอดีต -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-2">4.1 ประวัติการชักหรือหมดสติในอดีต: <span class="text-rose-500">*</span></label>
          ${renderSnGrid('grid-cols-1 sm:grid-cols-3', [
            { value: 'first_time_tloc', title: 'เพิ่งเคยมีอาการครั้งแรก', desc: 'ไม่เคยมีอาการชักหรือเป็นลมหมดสติลักษณะนี้มาก่อนเลย' },
            { value: 'known_epilepsy', title: 'เป็นโรคลมชักเดิมอยู่แล้ว', desc: 'เคยได้รับการวินิจฉัยว่าเป็นโรคลมชัก หรือรับประทานยากันชักอยู่' },
            { value: 'recurrent_vasovagal', title: 'เคยเป็นลมหน้ามืดบ่อยๆ', desc: 'เคยเป็นลมเวลาเหนื่อย ยืนนาน อากาศร้อน ตกใจ หรือเห็นเลือด' }
          ], { kind: 'radio', name: 'snPriorHistory', onchange: 'handleSnPriorHistoryChange()' })}
          <div id="snMedComplianceWrap" class="hidden mt-3 ml-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <span class="font-semibold text-slate-800 block">การรับประทานยากันชักในช่วง 7 วันที่ผ่านมา:</span>
            ${renderSnGrid('grid-cols-1 sm:grid-cols-2', [
              { value: 'compliant', title: 'รับประทานยาสม่ำเสมอทุกวัน', desc: 'กินยาครบตรงเวลาตามแพทย์สั่งทุกวัน' },
              { value: 'missed_or_stopped', title: 'ขาดยา ลืมกินยา หรือหยุดยาเอง', desc: 'ลืมทานยาหรือหยุดยาเองในช่วง 1 – 7 วันนี้' },
              { value: 'dose_changed', title: 'เพิ่งปรับขนาดยาหรือเปลี่ยนชนิดยา', desc: 'เพิ่งเปลี่ยนสูตรยาหรือปรับลดขนาดยาเมื่อเร็วๆ นี้' },
              { value: 'lost_followup', title: 'ไม่ได้รักษาต่อเนื่อง หรือขาดนัด', desc: 'ขาดนัดรักษานานแล้วและไม่ได้กินยากันชักต่อเนื่อง' }
            ], { kind: 'radio', name: 'snMedCompliance' })}
          </div>
        </div>

        <!-- 4.2 ปัจจัยกระตุ้นหรืออาการเจ็บป่วยร่วมก่อนเกิดเหตุ -->
        <div class="pt-2 border-t border-slate-100">
          <label class="block text-xs font-bold text-slate-700 mb-2">4.2 ปัจจัยกระตุ้นหรืออาการเจ็บป่วยร่วมก่อนเกิดเหตุครั้งนี้: (เลือกได้หลายข้อ)</label>
          ${renderSnGrid('grid-cols-1 sm:grid-cols-2', [
            { id: 'sn_rf_fever_meningismus', title: 'มีไข้สูง หนาวสั่น หรือคอแข็งก้มคอไม่ได้', desc: 'มีไข้ร่วมกับปวดศีรษะรุนแรง คอแข็งตึง หรือซึมสับสนนำมาก่อน' },
            { id: 'sn_rf_recent_head_trauma', title: 'เพิ่งได้รับอุบัติเหตุศีรษะกระแทกมาก่อนหน้านี้', desc: 'เคยหกล้ม รถชน หรือถูกกระแทกที่ศีรษะก่อนเริ่มมีอาการชัก' },
            { id: 'sn_rf_sleep_deprivation', title: 'อดนอน หรือพักผ่อนน้อยผิดปกติ', desc: 'นอนดึก ทำงานกะดึกติดต่อกัน หรือไม่ได้นอนก่อนเกิดอาการ' },
            { id: 'sn_rf_alcohol_withdrawal', title: 'ดื่มสุราเป็นประจำ และเพิ่งหยุดดื่มหรือลดปริมาณลง', desc: 'หยุดดื่มสุราหรือดื่มน้อยลงในช่วง 1 – 3 วันที่ผ่านมา' },
            { id: 'sn_rf_diabetic_hypo', title: 'เป็นเบาหวาน ฉีดยา/กินยาเบาหวาน หรืออดอาหาร', desc: 'ไม่ได้ทานอาหารตามมื้อ หรือมีอาการหิว มือสั่น เหงื่อออกก่อนหมดสติ' },
            { id: 'sn_rf_cardiac_family', title: 'มีโรคหัวใจเดิม หรือครอบครัวเสียชีวิตอายุน้อย', desc: 'โรคหัวใจเต้นผิดจังหวะ/หลอดเลือดหัวใจ หรือญาติสายตรงเสียชีวิตกะทันหันก่อนอายุ 50 ปี' },
            { id: 'sn_rf_emotional_panic', title: 'มีความเครียดรุนแรง ตกใจ หรือร้องไห้หนัก', desc: 'เพิ่งมีเรื่องกระทบจิตใจรุนแรง ทะเลาะวิวาท หรือตื่นตระหนกก่อนเกิดเหตุ' },
            { id: 'sn_rf_substance_toxin', title: 'ใช้ยาทรามาดอล สารเสพติด หรือได้รับสารพิษ', desc: 'เช่น กินยาเกินขนาด ใช้ยาแก้ปวดทรามาดอล ยาบ้า กระท่อม หรือสัมผัสสารเคมี', onchange: 'handleSnSubstanceChange()' }
          ], { kind: 'checkbox' })}
          <div id="snSubstanceDetailsWrap" class="hidden mt-3 ml-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <span class="font-semibold text-slate-800 block">ระบุชื่อยา สารเสพติด หรือสารที่ได้รับ (ถ้าทราบ):</span>
            <input type="text" id="snSubstanceDetails" placeholder="เช่น Tramadol, ยาบ้า, ยาฆ่าแมลง..."
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
              <span class="block text-xs font-semibold text-slate-700 mb-2">สถานะการตั้งครรภ์หรือหลังคลอด:</span>
              ${renderSnGrid('grid-cols-1 sm:grid-cols-2', [
                { value: 'not_pregnant', title: 'ไม่ได้ตั้งครรภ์' },
                { value: 'pregnant', title: 'กำลังตั้งครรภ์' },
                { value: 'postpartum_6w', title: 'เพิ่งคลอด หรือแท้งบุตรภายใน 6 สัปดาห์' },
                { value: 'menopause_or_hysterectomy', title: 'วัยหมดประจำเดือน / ผ่าตัดมดลูกแล้ว' },
                { value: 'unknown', title: 'ไม่แน่ใจ / ไม่ทราบ', colSpan2: true }
              ], { kind: 'radio', name: 'snPregnancyStatus', onchange: 'handleSnPregnancyChange()' })}
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
      'snExactTimeUnknown', 'sn_lateral_tongue_bite', 'sn_eye_deviation',
      'sn_incontinence', 'sn_cyanosis_apnea', 'sn_marked_pallor_sweat',
      'sn_post_weakness', 'sn_post_headache', 'sn_post_myalgia',
      'sn_post_nausea_vomit', 'sn_post_none', 'sn_fall_head_impact',
      'sn_fall_open_wound', 'sn_fall_pain_swelling', 'sn_rf_fever_meningismus',
      'sn_rf_recent_head_trauma', 'sn_rf_sleep_deprivation', 'sn_rf_alcohol_withdrawal',
      'sn_rf_diabetic_hypo', 'sn_rf_cardiac_family', 'sn_rf_emotional_panic',
      'sn_rf_substance_toxin'
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
    checkSeizurePediatricAgeGuidance();
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
    document.querySelectorAll('input[name="snWarningProdrome"]').forEach(cb => {
      cb.checked = prodromes.includes(cb.value);
    });

    setSnRadioChecked('snMotorPattern', patient.snMotorPattern || patient.seizureMotorPattern);
    const focalParts = Array.isArray(patient.snFocalParts) ? patient.snFocalParts : [];
    document.querySelectorAll('input[name="snFocalParts"]').forEach(cb => {
      cb.checked = focalParts.includes(cb.value);
    });
    setSnRadioChecked('snFocalSide', patient.snFocalSide);
    setSnRadioChecked('snFocalAwareness', patient.snFocalAwareness);
    handleSnMotorPatternChange();

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

    setChk('sn_rf_fever_meningismus', patient.sn_rf_fever_meningismus || patient.seizure_rf_fever_meningismus);
    setChk('sn_rf_recent_head_trauma', patient.sn_rf_recent_head_trauma || patient.seizure_rf_recent_head_trauma);
    setChk('sn_rf_sleep_deprivation', patient.sn_rf_sleep_deprivation);
    setChk('sn_rf_alcohol_withdrawal', patient.sn_rf_alcohol_withdrawal || patient.seizure_rf_alcohol_withdrawal);
    setChk('sn_rf_diabetic_hypo', patient.sn_rf_diabetic_hypo || patient.seizure_rf_diabetic_hypo);
    setChk('sn_rf_cardiac_family', patient.sn_rf_cardiac_family || patient.seizure_rf_known_cardiac_disease || patient.seizure_rf_family_sudden_death);
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
    checkSeizurePediatricAgeGuidance();
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

    const snEpisodeCount = getSnRadioValue('snEpisodeCount') || 'unspecified';
    const rawEpCnt = parseInt(document.getElementById('snEpisodeCountVal')?.value, 10);
    const snEpisodeCountVal = snEpisodeCount === 'multiple_cluster' && !isNaN(rawEpCnt) && rawEpCnt >= 2 ? rawEpCnt : 1;
    const snInterictalState = snEpisodeCount === 'multiple_cluster' ? (getSnRadioValue('snInterictalState') || 'full_recovery') : 'full_recovery';

    const snPrecedingPosture = getSnRadioValue('snPrecedingPosture') || 'unspecified';
    const snPostureOtherText = snPrecedingPosture === 'other' ? (document.getElementById('snPostureOtherText')?.value?.trim() || '') : '';

    const snWarningProdromes = getSnCheckedValues('snWarningProdrome');
    const snMotorPattern = getSnRadioValue('snMotorPattern') || 'unspecified';
    const snFocalParts = snMotorPattern === 'focal_motor' ? getSnCheckedValues('snFocalParts') : [];
    const snFocalSide = snMotorPattern === 'focal_motor' ? (getSnRadioValue('snFocalSide') || '') : '';
    const snFocalAwareness = snMotorPattern === 'focal_motor' ? (getSnRadioValue('snFocalAwareness') || '') : '';

    const sn_lateral_tongue_bite = Boolean(document.getElementById('sn_lateral_tongue_bite')?.checked);
    const sn_eye_deviation = Boolean(document.getElementById('sn_eye_deviation')?.checked);
    const sn_incontinence = Boolean(document.getElementById('sn_incontinence')?.checked);
    const sn_cyanosis_apnea = Boolean(document.getElementById('sn_cyanosis_apnea')?.checked);
    const sn_marked_pallor_sweat = Boolean(document.getElementById('sn_marked_pallor_sweat')?.checked);

    const isActiveUnconscious =
      snLossDuration === 'continuous_unstopped' ||
      (snEpisodeCount === 'multiple_cluster' && snInterictalState === 'unconscious_or_drowsy');
    const snRecoveryDuration = getSnRadioValue('snRecoveryDuration') || (isActiveUnconscious ? 'persistent_unconscious' : 'unspecified');
    const hidePost = isActiveUnconscious || snRecoveryDuration === 'persistent_unconscious';

    const sn_post_weakness = !hidePost && Boolean(document.getElementById('sn_post_weakness')?.checked);
    const snToddSide = sn_post_weakness ? (getSnRadioValue('snToddSide') || '') : '';
    const sn_post_headache = !hidePost && Boolean(document.getElementById('sn_post_headache')?.checked);
    const sn_post_myalgia = !hidePost && Boolean(document.getElementById('sn_post_myalgia')?.checked);
    const sn_post_nausea_vomit = !hidePost && Boolean(document.getElementById('sn_post_nausea_vomit')?.checked);
    const sn_post_none = !hidePost && Boolean(document.getElementById('sn_post_none')?.checked);

    const snFallInjury = getSnRadioValue('snFallInjury') || 'unspecified';
    const hasFall = snFallInjury === 'yes';
    const sn_fall_head_impact = hasFall && Boolean(document.getElementById('sn_fall_head_impact')?.checked);
    const sn_fall_open_wound = hasFall && Boolean(document.getElementById('sn_fall_open_wound')?.checked);
    const sn_fall_pain_swelling = hasFall && Boolean(document.getElementById('sn_fall_pain_swelling')?.checked);
    const snFallInjuryDetailText = hasFall ? (document.getElementById('snFallInjuryDetailText')?.value?.trim() || '') : '';

    const snPriorHistory = getSnRadioValue('snPriorHistory') || 'unspecified';
    const snMedCompliance = snPriorHistory === 'known_epilepsy' ? (getSnRadioValue('snMedCompliance') || 'unspecified') : 'unspecified';

    const sn_rf_fever_meningismus = Boolean(document.getElementById('sn_rf_fever_meningismus')?.checked);
    const sn_rf_recent_head_trauma = Boolean(document.getElementById('sn_rf_recent_head_trauma')?.checked);
    const sn_rf_sleep_deprivation = Boolean(document.getElementById('sn_rf_sleep_deprivation')?.checked);
    const sn_rf_alcohol_withdrawal = Boolean(document.getElementById('sn_rf_alcohol_withdrawal')?.checked);
    const sn_rf_diabetic_hypo = Boolean(document.getElementById('sn_rf_diabetic_hypo')?.checked);
    const sn_rf_cardiac_family = Boolean(document.getElementById('sn_rf_cardiac_family')?.checked);
    const sn_rf_emotional_panic = Boolean(document.getElementById('sn_rf_emotional_panic')?.checked);
    const sn_rf_substance_toxin = Boolean(document.getElementById('sn_rf_substance_toxin')?.checked);
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
      snWarningProdromes,
      snMotorPattern,
      snFocalParts,
      snFocalSide,
      snFocalAwareness,
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
      sn_rf_fever_meningismus,
      sn_rf_recent_head_trauma,
      sn_rf_sleep_deprivation,
      sn_rf_alcohol_withdrawal,
      sn_rf_diabetic_hypo,
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
      drugAllergy,
      currentMeds,
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
      patient.sn_rf_cardiac_family
    ) {
      redFlags.push({
        key: 'cardiac_syncope_high_risk',
        textTh: 'หมดสติชักเกร็งขณะออกแรง/มีใจสั่นหรือเจ็บอกนำ/โรคหัวใจหรือครอบครัวเสียชีวิตอายุน้อย (High-Risk Cardiac Syncope)',
        risk: 'เสี่ยงหัวใจเต้นผิดจังหวะรุนแรง (Arrhythmia / Brugada / Long QT) หรือ ACS ต้องตรวจ 12-lead EKG และติด Cardiac Monitor ทันที'
      });
    }

    if (patient.sn_rf_fever_meningismus) {
      redFlags.push({
        key: 'cns_infection_meningismus',
        textTh: 'มีไข้สูง ปวดศีรษะรุนแรง หรือคอแข็งนำมาก่อน (Suspected CNS Infection: Meningitis / Encephalitis)',
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
        textTh: `ใช้ยาทรามาดอล สารเสพติด หรือได้รับสารพิษ${det} (Toxin / Drug-Induced Seizure)`,
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
    const durationText = patient.durationVal ? `${patient.durationVal} ${unitMap[patient.durationUnit] || 'ชั่วโมง'}` : 'ไม่ระบุ';
    const timeText = patient.snExactTimeUnknown
      ? 'ไม่ทราบเวลาแน่ชัด'
      : (patient.snExactTime ? `เวลา ${patient.snExactTime} น.` : '');

    const reporterStr = SN_LABELS.reporter[patient.snReporter] || SN_LABELS.reporter.unspecified;
    const postureStr = patient.snPrecedingPosture === 'other'
      ? (patient.snPostureOtherText ? `อื่นๆ: ${patient.snPostureOtherText}` : 'อื่นๆ')
      : (SN_LABELS.posture[patient.snPrecedingPosture] || SN_LABELS.posture.unspecified);

    const lossDurationStr = patient.snLossDuration === 'prolonged_gte_5m'
      ? `นานตั้งแต่ 5 นาทีขึ้นไป${patient.snDurationGte5mVal ? ` (ประมาณ ${patient.snDurationGte5mVal} นาที)` : ''}`
      : (SN_LABELS.lossDuration[patient.snLossDuration] || SN_LABELS.lossDuration.unspecified);

    const clusterStr = patient.snEpisodeCount === 'multiple_cluster'
      ? `เกิดซ้ำ ${patient.snEpisodeCountVal || 2} ครั้ง (${SN_LABELS.interictal[patient.snInterictalState] || 'ไม่ระบุสภาพระหว่างรอบ'})`
      : (patient.snEpisodeCount === 'single' ? 'เกิดขึ้นเพียงครั้งเดียว' : 'ไม่ได้ระบุจำนวนครั้ง');

    const prodromes = Array.isArray(patient.snWarningProdromes) && patient.snWarningProdromes.length > 0
      ? patient.snWarningProdromes
      : [];
    const prodromesStr = prodromes.length > 0
      ? prodromes.map(p => SN_LABELS.prodrome[p] || p).join(', ')
      : 'ไม่ได้ระบุอาการเตือน';

    const motorStr = formatSnMotorSummary(patient);
    const recoveryStr = SN_LABELS.recovery[patient.snRecoveryDuration] || SN_LABELS.recovery.unspecified;

    let fallStr = patient.snFallInjury === 'no' ? 'ไม่มีการบาดเจ็บจากการล้ม' : 'ไม่ได้ระบุ';
    if (patient.snFallInjury === 'yes') {
      const fParts = [];
      if (patient.sn_fall_head_impact) fParts.push('ศีรษะหรือใบหน้ากระแทกพื้นโดยตรง');
      if (patient.sn_fall_open_wound) fParts.push('มีแผลฉีกขาด/เลือดออก');
      if (patient.sn_fall_pain_swelling) fParts.push('ปวดบวม/ฟกช้ำ');
      if (patient.snFallInjuryDetailText) fParts.push(patient.snFallInjuryDetailText);
      fallStr = fParts.length > 0 ? `มีบาดเจ็บ (${fParts.join(', ')})` : 'มีบาดเจ็บจากการล้ม';
    }

    const priorStr = SN_LABELS.priorHistory[patient.snPriorHistory] || SN_LABELS.priorHistory.unspecified;
    const complianceStr = patient.snPriorHistory === 'known_epilepsy'
      ? (SN_LABELS.compliance[patient.snMedCompliance] || SN_LABELS.compliance.unspecified)
      : '';

    const positives = [];
    const negatives = [];
    const anyIctalAnswered = Boolean(
      patient.sn_lateral_tongue_bite || patient.sn_eye_deviation || patient.sn_incontinence ||
      patient.sn_cyanosis_apnea || patient.sn_marked_pallor_sweat ||
      (patient.snMotorPattern && patient.snMotorPattern !== 'unspecified')
    );
    const anyPostAnswered = Boolean(
      patient.sn_post_weakness || patient.sn_post_headache || patient.sn_post_myalgia ||
      patient.sn_post_nausea_vomit || patient.sn_post_none ||
      (patient.snRecoveryDuration && patient.snRecoveryDuration !== 'unspecified')
    );
    const anyTriggerRiskAnswered = Boolean(
      patient.sn_rf_fever_meningismus || patient.sn_rf_recent_head_trauma || patient.sn_rf_sleep_deprivation ||
      patient.sn_rf_alcohol_withdrawal || patient.sn_rf_diabetic_hypo || patient.sn_rf_cardiac_family ||
      patient.sn_rf_emotional_panic || patient.sn_rf_substance_toxin
    );

    if (patient.sn_lateral_tongue_bite) positives.push('กัดลิ้นหรือมีเลือดออกในปาก');
    else if (anyIctalAnswered) negatives.push('ไม่พบแผลกัดลิ้น');

    if (patient.sn_eye_deviation) positives.push('ตาค้างหรือตาเหลือกเบนไปข้างเดียว');
    else if (anyIctalAnswered) negatives.push('ไม่มีตาค้างหรือตาเหลือก');

    if (patient.sn_incontinence) positives.push('ปัสสาวะหรืออุจจาระราดขณะหมดสติ');
    else if (anyIctalAnswered) negatives.push('ไม่มีปัสสาวะหรืออุจจาระราด');

    if (patient.sn_cyanosis_apnea) positives.push('ริมฝีปากเขียวคล้ำหรือหยุดหายใจชั่วขณะ');
    else if (anyIctalAnswered) negatives.push('ไม่มีปากเขียวหรือหยุดหายใจ');

    if (patient.sn_marked_pallor_sweat) positives.push('หน้าซีด ตัวเย็น เหงื่อออกชุ่ม');
    else if (anyIctalAnswered) negatives.push('ไม่มีหน้าซีดเหงื่อออกชุ่ม');

    if (patient.sn_post_weakness) {
      const tSide = patient.snToddSide ? ` (${SN_LABELS.toddSides[patient.snToddSide] || patient.snToddSide})` : '';
      positives.push(`แขนขาอ่อนแรง ปากเบี้ยว หรือพูดไม่ชัดหลังชัก${tSide}`);
    } else if (anyPostAnswered && patient.snRecoveryDuration !== 'persistent_unconscious') {
      negatives.push('ไม่มีแขนขาอ่อนแรงหลังหยุดชัก');
    }

    if (patient.sn_post_headache) positives.push('ปวดศีรษะรุนแรงหลังฟื้น');
    if (patient.sn_post_myalgia) positives.push('ปวดเมื่อยระบมกล้ามเนื้อหลังชัก');
    if (patient.sn_post_nausea_vomit) positives.push('คลื่นไส้หรืออาเจียนหลังเกิดเหตุ');
    if (patient.sn_fall_head_impact) positives.push('ล้มศีรษะกระแทกพื้นโดยตรงขณะเกิดเหตุ');
    if (patient.sn_fall_open_wound) positives.push('มีแผลฉีกขาดหรือเลือดออกจากการล้ม');
    if (patient.sn_fall_pain_swelling) positives.push('มีอาการปวดบวมหรือฟกช้ำจากการล้ม');

    if (patient.sn_rf_fever_meningismus) positives.push('มีไข้สูง หนาวสั่น หรือคอแข็งนำมาก่อน');
    else if (anyTriggerRiskAnswered) negatives.push('ไม่มีไข้สูงหรือคอแข็งนำมาก่อน');

    if (patient.sn_rf_recent_head_trauma) positives.push('เพิ่งได้รับอุบัติเหตุศีรษะกระแทกมาก่อนหน้านี้');
    if (patient.sn_rf_sleep_deprivation) positives.push('อดนอนหรือพักผ่อนน้อยก่อนเกิดอาการ');
    if (patient.sn_rf_alcohol_withdrawal) positives.push('ดื่มสุราประจำและเพิ่งหยุดดื่มภายใน 1–3 วัน');
    if (patient.sn_rf_diabetic_hypo) positives.push('เป็นเบาหวานหรืออดอาหารก่อนหมดสติ');
    if (patient.sn_rf_cardiac_family) positives.push('มีโรคหัวใจเดิมหรือครอบครัวเสียชีวิตอายุน้อย');
    if (patient.sn_rf_emotional_panic) positives.push('มีความเครียดรุนแรง ตกใจ หรือร้องไห้หนักก่อนเกิดเหตุ');
    if (patient.sn_rf_substance_toxin) {
      positives.push(`ใช้ยาทรามาดอล สารเสพติด หรือได้รับสารพิษ${patient.snSubstanceDetails ? ` (${patient.snSubstanceDetails})` : ''}`);
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
ประวัติการชัก/เป็นลมเดิม: [${priorStr}]${complianceStr ? ` (การรับประทานยากันชัก: ${complianceStr})` : ''}, โรคประจำตัว: ${udText}, ยาประจำตัว: ${medsText}, แพ้ยา: ${allergyText}${effectiveRfs.length > 0 ? `\n[🚩 สัญญาณเตือนอันตราย (Red Flags)]: ${effectiveRfs.map(rf => rf.textTh).join('; ')}` : ''}`;

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
      pertinent_negatives: negatives,
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
    {
      id: 'case-091',
      queue_number: 'A-091',
      hn: '6708101',
      name: 'นายภาณุพงศ์ กิตติคุณ',
      age: 28,
      gender: 'ชาย',
      chief_complaint: 'seizure',
      chief_complaint_title: 'ชัก / เกร็งกระตุก',
      status: 'waiting',
      timestamp: '2026-10-26T02:31:26.424Z',
      durationVal: 45,
      durationUnit: 'minutes',
      snExactTimeUnknown: false,
      snExactTime: '08:45',
      snReporter: 'witness_relative',
      snLossDuration: 'prolonged_gte_5m',
      snDurationGte5mVal: 20,
      snEpisodeCount: 'multiple_cluster',
      snEpisodeCountVal: 2,
      snInterictalState: 'unconscious_or_drowsy',
      snPrecedingPosture: 'sleep',
      snPostureOtherText: '',
      snWarningProdromes: ['none_sudden'],
      snMotorPattern: 'generalized_tonic_clonic',
      snFocalParts: [],
      snFocalSide: '',
      snFocalAwareness: '',
      sn_lateral_tongue_bite: true,
      sn_eye_deviation: true,
      sn_incontinence: true,
      sn_cyanosis_apnea: true,
      sn_marked_pallor_sweat: false,
      snRecoveryDuration: 'persistent_unconscious',
      sn_post_weakness: false,
      snToddSide: '',
      sn_post_headache: false,
      sn_post_myalgia: false,
      sn_post_nausea_vomit: false,
      sn_post_none: false,
      snFallInjury: 'no',
      sn_fall_head_impact: false,
      sn_fall_open_wound: false,
      sn_fall_pain_swelling: false,
      snFallInjuryDetailText: '',
      snPriorHistory: 'known_epilepsy',
      snMedCompliance: 'missed_or_stopped',
      sn_rf_fever_meningismus: false,
      sn_rf_recent_head_trauma: false,
      sn_rf_sleep_deprivation: true,
      sn_rf_alcohol_withdrawal: false,
      sn_rf_diabetic_hypo: false,
      sn_rf_cardiac_family: false,
      sn_rf_emotional_panic: false,
      sn_rf_substance_toxin: false,
      snSubstanceDetails: '',
      snPregnancyStatus: '',
      snPregnancyWeeks: '',
      snLmpDate: '',
      otherSymptomsFree: 'ยังซึมปลุกไม่ตื่นขณะนำส่งโรงพยาบาล',
      hospRecordStatus: 'complete',
      underlying: ['โรคลมชัก (Epilepsy)'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Sodium Valproate 500 mg bid, Levetiracetam 500 mg bid (ขาดยา 3 วัน)',
      doctor_notes: {
        additional_hpi: 'ผู้ป่วยโรคลมชักเดิม ขาดยามา 3 วันและอดนอน ชักเกร็งทั้งตัวนาน 20 นาที ซ้ำ 2 รอบ ระหว่างรอบไม่ฟื้นสติ',
        physical_exam: 'BT 37.2 C, PR 122/min, RR 26/min, BP 148/92 mmHg, SpO2 93% -> 99% O2 cannula. DTX 114 mg/dL. GCS E2V2M4.',
        preliminary_dx: 'Convulsive Status Epilepticus secondary to Antiseizure Non-Compliance 🚩',
        plan: 'Airway support + high-flow O2, IV Diazepam 10 mg STAT, IV Levetiracetam loading, STAT labs & CT Brain'
      }
    },
    {
      id: 'case-092',
      queue_number: 'A-092',
      hn: '6708214',
      name: 'น.ส.ชุติมา ธนสถิตย์',
      age: 24,
      gender: 'หญิง',
      chief_complaint: 'seizure',
      chief_complaint_title: 'ชัก / เกร็งกระตุก',
      status: 'waiting',
      timestamp: '2026-10-26T02:21:26.424Z',
      durationVal: 1,
      durationUnit: 'hours',
      snExactTimeUnknown: false,
      snExactTime: '08:20',
      snReporter: 'both_patient_witness',
      snLossDuration: 'typical_1_4m',
      snDurationGte5mVal: null,
      snEpisodeCount: 'single',
      snEpisodeCountVal: 1,
      snInterictalState: 'full_recovery',
      snPrecedingPosture: 'supine_or_resting',
      snPostureOtherText: '',
      snWarningProdromes: ['none_sudden'],
      snMotorPattern: 'generalized_tonic_clonic',
      snFocalParts: [],
      snFocalSide: '',
      snFocalAwareness: '',
      sn_lateral_tongue_bite: false,
      sn_eye_deviation: true,
      sn_incontinence: true,
      sn_cyanosis_apnea: true,
      sn_marked_pallor_sweat: false,
      snRecoveryDuration: 'confusion_drowsy_gt_5m',
      sn_post_weakness: false,
      snToddSide: '',
      sn_post_headache: true,
      sn_post_myalgia: true,
      sn_post_nausea_vomit: false,
      sn_post_none: false,
      snFallInjury: 'no',
      sn_fall_head_impact: false,
      sn_fall_open_wound: false,
      sn_fall_pain_swelling: false,
      snFallInjuryDetailText: '',
      snPriorHistory: 'first_time_tloc',
      snMedCompliance: 'compliant',
      sn_rf_fever_meningismus: false,
      sn_rf_recent_head_trauma: false,
      sn_rf_sleep_deprivation: false,
      sn_rf_alcohol_withdrawal: false,
      sn_rf_diabetic_hypo: false,
      sn_rf_cardiac_family: false,
      sn_rf_emotional_panic: false,
      sn_rf_substance_toxin: false,
      snSubstanceDetails: '',
      snPregnancyStatus: 'pregnant',
      snPregnancyWeeks: '34 สัปดาห์',
      snLmpDate: '20/03/2026',
      otherSymptomsFree: 'ปวดศีรษะท้ายทอยและตาพร่ามัวก่อนชัก',
      hospRecordStatus: 'complete',
      underlying: ['ความดันโลหิตสูงขณะตั้งครรภ์'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Methyldopa 250 mg tid',
      doctor_notes: {
        additional_hpi: 'หญิงตั้งครรภ์ 34 สัปดาห์ มีอาการชักเกร็งทั้งตัวเป็นครั้งแรกหลังปวดศีรษะและตาพร่ามัว',
        physical_exam: 'BT 36.8 C, PR 96/min, RR 20/min, BP 178/112 mmHg, SpO2 98%. Urine dipstick: Protein 3+.',
        preliminary_dx: 'Antepartum Eclampsia 🚩 [OBSTETRIC CRITICAL EMERGENCY]',
        plan: 'IV MgSO4 loading 4g then 1g/hr, IV Nicardipine titration, Emergency OB-GYN consult'
      }
    },
    {
      id: 'case-093',
      queue_number: 'A-093',
      hn: '6708325',
      name: 'นายประเสริฐ ทองสุข',
      age: 58,
      gender: 'ชาย',
      chief_complaint: 'seizure',
      chief_complaint_title: 'ชัก / เกร็งกระตุก',
      status: 'waiting',
      timestamp: '2026-10-26T02:16:26.424Z',
      durationVal: 2,
      durationUnit: 'hours',
      snExactTimeUnknown: true,
      snExactTime: '',
      snReporter: 'witness_relative',
      snLossDuration: 'typical_1_4m',
      snDurationGte5mVal: null,
      snEpisodeCount: 'single',
      snEpisodeCountVal: 1,
      snInterictalState: 'full_recovery',
      snPrecedingPosture: 'standing_or_walking_normal',
      snPostureOtherText: '',
      snWarningProdromes: ['unknown'],
      snMotorPattern: 'focal_motor',
      snFocalParts: ['face_mouth', 'arm_hand'],
      snFocalSide: 'left',
      snFocalAwareness: 'aware',
      sn_lateral_tongue_bite: false,
      sn_eye_deviation: false,
      sn_incontinence: false,
      sn_cyanosis_apnea: false,
      sn_marked_pallor_sweat: false,
      snRecoveryDuration: 'confusion_drowsy_gt_5m',
      sn_post_weakness: true,
      snToddSide: 'left',
      sn_post_headache: true,
      sn_post_myalgia: false,
      sn_post_nausea_vomit: false,
      sn_post_none: false,
      snFallInjury: 'yes',
      sn_fall_head_impact: true,
      sn_fall_open_wound: true,
      sn_fall_pain_swelling: false,
      snFallInjuryDetailText: 'แผลถลอกและปูดโนบริเวณหน้าผากซ้าย',
      snPriorHistory: 'first_time_tloc',
      snMedCompliance: 'compliant',
      sn_rf_fever_meningismus: false,
      sn_rf_recent_head_trauma: false,
      sn_rf_sleep_deprivation: false,
      sn_rf_alcohol_withdrawal: false,
      sn_rf_diabetic_hypo: false,
      sn_rf_cardiac_family: false,
      sn_rf_emotional_panic: false,
      sn_rf_substance_toxin: false,
      snSubstanceDetails: '',
      snPregnancyStatus: '',
      snPregnancyWeeks: '',
      snLmpDate: '',
      otherSymptomsFree: '',
      hospRecordStatus: 'self',
      underlying: ['ความดันโลหิตสูง'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Amlodipine 5 mg od',
      doctor_notes: {
        additional_hpi: 'ชักกระตุกเฉพาะมุมปากและแขนซ้ายครั้งแรกในชีวิต หลังหยุดชักแขนซ้ายอ่อนแรงและล้มศีรษะกระแทกพื้น',
        physical_exam: 'BT 36.9 C, PR 88/min, RR 18/min, BP 164/96 mmHg. Left hemiparesis grade 3/5, scalp abrasion left frontal.',
        preliminary_dx: 'First-Onset Focal Motor Seizure with Todd Paresis & Secondary Head Impact 🚩',
        plan: 'STAT Non-contrast CT Brain, Electrolytes, DTX, Neuro consult'
      }
    },
    {
      id: 'case-094',
      queue_number: 'A-094',
      hn: '6708436',
      name: 'น.ส.พิมพ์ชนก สุวรรณเวช',
      age: 19,
      gender: 'หญิง',
      chief_complaint: 'seizure',
      chief_complaint_title: 'ชัก / เกร็งกระตุก',
      status: 'waiting',
      timestamp: '2026-10-26T02:11:26.424Z',
      durationVal: 30,
      durationUnit: 'minutes',
      snExactTimeUnknown: false,
      snExactTime: '08:40',
      snReporter: 'both_patient_witness',
      snLossDuration: 'brief_seconds',
      snDurationGte5mVal: null,
      snEpisodeCount: 'single',
      snEpisodeCountVal: 1,
      snInterictalState: 'full_recovery',
      snPrecedingPosture: 'prolonged_standing',
      snPostureOtherText: '',
      snWarningProdromes: ['lightheaded_tunnel_vision', 'cold_sweat_pallor_nausea'],
      snMotorPattern: 'brief_myoclonic_syncope',
      snFocalParts: [],
      snFocalSide: '',
      snFocalAwareness: '',
      sn_lateral_tongue_bite: false,
      sn_eye_deviation: false,
      sn_incontinence: false,
      sn_cyanosis_apnea: false,
      sn_marked_pallor_sweat: true,
      snRecoveryDuration: 'rapid_under_2m_alert',
      sn_post_weakness: false,
      snToddSide: '',
      sn_post_headache: false,
      sn_post_myalgia: false,
      sn_post_nausea_vomit: false,
      sn_post_none: true,
      snFallInjury: 'no',
      sn_fall_head_impact: false,
      sn_fall_open_wound: false,
      sn_fall_pain_swelling: false,
      snFallInjuryDetailText: '',
      snPriorHistory: 'recurrent_vasovagal',
      snMedCompliance: 'compliant',
      sn_rf_fever_meningismus: false,
      sn_rf_recent_head_trauma: false,
      sn_rf_sleep_deprivation: false,
      sn_rf_alcohol_withdrawal: false,
      sn_rf_diabetic_hypo: false,
      sn_rf_cardiac_family: false,
      sn_rf_emotional_panic: false,
      sn_rf_substance_toxin: false,
      snSubstanceDetails: '',
      snPregnancyStatus: 'not_pregnant',
      snPregnancyWeeks: '',
      snLmpDate: '01/11/2026',
      otherSymptomsFree: 'ไม่ได้ทานข้าวเช้า ยืนเข้าแถวกลางแดดร้อนจัด รู้สึกหูอื้อและภาพตัดวูบไป',
      hospRecordStatus: 'self',
      underlying: ['ปฏิเสธ'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'ไม่มี',
      doctor_notes: {
        additional_hpi: 'ยืนกลางแดดนาน หน้ามืดตัวเย็นเหงื่อซึมแล้ววูบกระตุกสั้นๆ 10 วินาที ฟื้นสติรู้เรื่องเต็มที่ภายใน 1 นาที',
        physical_exam: 'BT 36.7 C, PR 72/min, RR 16/min, BP 112/68 mmHg, SpO2 99%. Neuro exam normal. 12-lead EKG NSR.',
        preliminary_dx: 'Neurocardiogenic / Vasovagal Syncope with Brief Convulsive Myoclonus',
        plan: 'Hydration, reassurance, EKG screen, discharge instructions'
      }
    }
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
  window.handleSnWarningChange = handleSnWarningChange;
  window.handleSnMotorPatternChange = handleSnMotorPatternChange;
  window.handleSnRecoveryChange = handleSnRecoveryChange;
  window.updateSnPostIctalContext = updateSnPostIctalContext;
  window.handleSnPostSymptomChange = handleSnPostSymptomChange;
  window.handleSnFallInjuryChange = handleSnFallInjuryChange;
  window.handleSnPriorHistoryChange = handleSnPriorHistoryChange;
  window.handleSnSubstanceChange = handleSnSubstanceChange;
  window.handleSnPregnancyChange = handleSnPregnancyChange;
}
