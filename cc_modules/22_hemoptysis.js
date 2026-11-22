// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 22_hemoptysis.js
// อาการนำ: ไอเป็นเลือด (Hemoptysis / Coughing Up Blood)
// ปรับปรุงตามมาตรฐาน plan_hemoptysis.md, plan-cc และ code-cc (กลุ่ม B1)
// =========================================================================

// --- Internal DOM & UI Helpers ---
function getHemoEl(id) {
  return typeof document !== 'undefined' ? document.getElementById(id) : null;
}

function queryHemoOne(selector) {
  return typeof document !== 'undefined' ? document.querySelector(selector) : null;
}

function queryHemoAll(selector) {
  return typeof document !== 'undefined' ? Array.from(document.querySelectorAll(selector)) : [];
}

function wrapHemoWords(chunks) {
  if (!Array.isArray(chunks)) return chunks;
  return chunks.map(c => `<span class="inline-block whitespace-nowrap">${c}</span>`).join(' ');
}

function renderHemoOption(cfg) {
  const {
    kind = 'checkbox',
    id = '',
    name = '',
    value = '',
    title,
    desc = '',
    onchange = '',
    compact = false,
    colSpan2 = false
  } = cfg;
  const idAttr = id ? `id="${id}" ` : '';
  const nameAttr = name ? `name="${name}" ` : '';
  const valAttr = value ? `value="${value}" ` : '';
  const chgAttr = onchange ? `onchange="${onchange}" ` : '';
  const alignCls = desc ? 'items-start' : 'items-center';
  const padCls = compact ? 'p-2.5' : 'p-3';
  const spanCls = colSpan2 ? ' sm:col-span-2' : '';
  const roundCls = kind === 'checkbox' ? 'rounded ' : '';
  const topCls = desc ? 'mt-0.5 ' : '';
  const szCls = compact ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const titleHtml = Array.isArray(title) ? wrapHemoWords(title) : title;
  const bodyHtml = desc
    ? `<div class="ml-3 leading-snug"><span class="block text-xs sm:text-sm font-semibold text-slate-800">${titleHtml}</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">${desc}</span></div>`
    : `<span class="ml-3 ${compact ? 'text-xs' : 'text-xs sm:text-sm'} font-semibold text-slate-800 leading-snug">${titleHtml}</span>`;
  return `<label class="selectable-card bg-white flex ${alignCls} ${padCls} rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition${spanCls}"><input type="${kind}" ${idAttr}${nameAttr}${valAttr}${chgAttr}class="${topCls}${roundCls}text-medical-600 focus:ring-medical-500 ${szCls} flex-shrink-0">${bodyHtml}</label>`;
}

function renderHemoGrid(colsCls, items, shared = {}) {
  return `<div class="grid ${colsCls} gap-2.5">${items.map(it => renderHemoOption({ ...shared, ...it })).join('\n')}</div>`;
}

function renderHemoSysHeader({
  label,
  icon,
  colorClass,
  toggleId = '',
  toggleLabel = '',
  toggleOnchange = '',
  toggleName = '',
  toggleValue = ''
}) {
  const nameAttr = toggleName ? `name="${toggleName}" ` : '';
  const valAttr = toggleValue ? `value="${toggleValue}" ` : '';
  const toggleHtml = toggleId
    ? `<label class="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-medium text-slate-700 cursor-pointer transition select-none flex-shrink-0">
      <input type="checkbox" id="${toggleId}" ${nameAttr}${valAttr}onchange="${toggleOnchange}" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded">
      <span class="ml-1.5 whitespace-nowrap">${toggleLabel}</span>
    </label>`
    : '';
  return `<div class="flex flex-wrap items-center justify-between gap-2 mb-2.5">
    <label class="flex items-center text-xs sm:text-sm font-bold text-slate-800">
      <span class="${colorClass} p-1.5 rounded-lg mr-2 inline-flex items-center justify-center"><i data-lucide="${icon}" class="w-4 h-4"></i></span>
      <span>${label}</span>
    </label>
    ${toggleHtml}
  </div>`;
}

// --- Pain Score Touch State Tracking (Matching 01_abdpain.js Emoji Pain Scale) ---
let hemoPainScoreTouched = false;

function clearHemoPainScore() {
  hemoPainScoreTouched = false;
  const slider = getHemoEl('hemoPainScore');
  if (slider) slider.value = 0;
  const emojiEl = getHemoEl('hemoPainScoreEmoji');
  const textEl = getHemoEl('hemoPainScoreText');
  const badgeEl = getHemoEl('hemoPainScoreBadge');
  const clearBtn = getHemoEl('hemoPainScoreClearBtn');
  if (emojiEl) emojiEl.textContent = '⚪';
  if (textEl) textEl.textContent = 'ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)';
  if (badgeEl) badgeEl.className = 'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all';
  if (clearBtn) clearBtn.classList.add('hidden');
}

function handleHemoPainScoreChange(val) {
  hemoPainScoreTouched = true;
  const parsed = parseInt(val, 10);
  const num = isNaN(parsed) ? 0 : Math.min(10, Math.max(0, parsed));
  const slider = getHemoEl('hemoPainScore');
  if (slider && String(slider.value) !== String(num)) slider.value = num;
  const emojiEl = getHemoEl('hemoPainScoreEmoji');
  const textEl = getHemoEl('hemoPainScoreText');
  const badgeEl = getHemoEl('hemoPainScoreBadge');
  const clearBtn = getHemoEl('hemoPainScoreClearBtn');
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

function setHemoPainScore(score) {
  hemoPainScoreTouched = true;
  const slider = getHemoEl('hemoPainScore');
  if (slider) slider.value = score;
  handleHemoPainScoreChange(score);
}

// --- Progressive Disclosure & Corner-Toggle Handlers ---
function clearHemoProdromeNone() {
  const el = getHemoEl('hemo_prodrome_none');
  if (el) el.checked = false;
}

function clearHemoWarnNone() {
  const el = getHemoEl('hemo_warn_none');
  if (el) el.checked = false;
}

function toggleHemoPreCoughSub(isVisible) {
  const el = getHemoEl('hemoPreCoughSub');
  if (!el) return;
  el.classList.toggle('hidden', !isVisible);
  if (isVisible) {
    clearHemoProdromeNone();
  } else {
    const valInput = getHemoEl('hemoPreCoughDurVal');
    if (valInput) valInput.value = '';
  }
}

function toggleHemoPriorSputumSub(isVisible) {
  const el = getHemoEl('hemoPriorSputumSub');
  if (!el) return;
  el.classList.toggle('hidden', !isVisible);
  if (isVisible) {
    clearHemoProdromeNone();
  } else {
    el.querySelectorAll('input[type="radio"]').forEach(r => { r.checked = false; });
  }
}

function toggleHemoProdromeGroup(groupId, isVisible) {
  const el = getHemoEl(groupId);
  if (!el) return;
  el.classList.toggle('hidden', !isVisible);
  if (isVisible) {
    clearHemoProdromeNone();
  } else {
    el.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    el.querySelectorAll('input[type="number"]').forEach(inp => { inp.value = ''; });
    if (groupId === 'hemoWeightLossSub') {
      const wlUnit = getHemoEl('hemoWeightLossDurUnit');
      if (wlUnit) wlUnit.value = 'months';
    }
  }
}

function handleHemoProdromeItemChange(clickedEl) {
  if (clickedEl && clickedEl.checked) clearHemoProdromeNone();
}

function handleHemoProdromeNoneToggle(clickedEl) {
  if (!clickedEl || !clickedEl.checked) return;
  ['hemoPreCoughParent', 'hemoPriorSputumParent', 'hemoWarningFeverParent', 'hemoWeightLossParent'].forEach(id => {
    const p = getHemoEl(id);
    if (p) p.checked = false;
  });
  toggleHemoPreCoughSub(false);
  toggleHemoPriorSputumSub(false);
  toggleHemoProdromeGroup('hemoWarningFeverSub', false);
  toggleHemoProdromeGroup('hemoWeightLossSub', false);
  const hoarse = queryHemoOne('input[name="hemoWarningSigns"][value="warn_hoarseness_weeks"]');
  if (hoarse) hoarse.checked = false;
}

function toggleHemoDyspneaSub(isVisible) {
  const el = getHemoEl('hemoDyspneaSub');
  if (!el) return;
  el.classList.toggle('hidden', !isVisible);
  if (isVisible) {
    clearHemoWarnNone();
  } else {
    el.querySelectorAll('input[type="radio"]').forEach(r => { r.checked = false; });
  }
}

function toggleHemoChestPainSub(isVisible) {
  const el = getHemoEl('hemoChestPainSub');
  if (!el) return;
  el.classList.toggle('hidden', !isVisible);
  if (isVisible) {
    clearHemoWarnNone();
  } else {
    el.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    clearHemoPainScore();
  }
}

function toggleHemoWarningGroup(groupId, isVisible) {
  if (groupId === 'hemoDyspneaSub') return toggleHemoDyspneaSub(isVisible);
  if (groupId === 'hemoWarningFeverSub') return toggleHemoProdromeGroup(groupId, isVisible);
  const el = getHemoEl(groupId);
  if (!el) return;
  el.classList.toggle('hidden', !isVisible);
  if (isVisible) {
    clearHemoWarnNone();
  } else {
    el.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
  }
}

function toggleHemoSmokingSub(isVisible) {
  const el = getHemoEl('hemoSmokingSub');
  if (!el) return;
  el.classList.toggle('hidden', !isVisible);
  if (!isVisible) {
    const yrs = getHemoEl('hemoSmokingYears');
    const pks = getHemoEl('hemoSmokingPacks');
    if (yrs) yrs.value = '';
    if (pks) pks.value = '';
  }
}

function handleHemoWarnItemChange(clickedEl) {
  if (clickedEl && clickedEl.checked) clearHemoWarnNone();
}

function handleHemoWarnNoneToggle(clickedEl) {
  if (!clickedEl || !clickedEl.checked) return;
  ['hemoDyspneaParent', 'hemoChestPainParent', 'hemoWarningSyncopeParent', 'hemoWarningDvtPeParent'].forEach(id => {
    const p = getHemoEl(id);
    if (p) p.checked = false;
  });
  toggleHemoDyspneaSub(false);
  toggleHemoChestPainSub(false);
  toggleHemoWarningGroup('hemoWarningSyncopeSub', false);
  toggleHemoWarningGroup('hemoWarningDvtPeSub', false);
  const choke = queryHemoOne('input[name="hemoWarningSigns"][value="warn_choking_airway_threat"]');
  if (choke) choke.checked = false;
}

function handleHemoPulmChange(clickedEl) {
  if (!clickedEl) return;
  if (clickedEl.value === 'pulm_none') {
    if (clickedEl.checked) {
      queryHemoAll('input[name="hemoPastPulmonary"]').forEach(cb => {
        if (cb.value !== 'pulm_none') cb.checked = false;
      });
    }
  } else if (clickedEl.checked) {
    const noneEl = getHemoEl('hemo_pulm_none');
    if (noneEl) noneEl.checked = false;
  }
}

function handleHemoMedChange(clickedEl) {
  if (!clickedEl) return;
  if (clickedEl.value === 'meds_none') {
    if (clickedEl.checked) {
      queryHemoAll('input[name="hemoBleedingMeds"]').forEach(cb => {
        if (cb.value !== 'meds_none') cb.checked = false;
      });
    }
  } else if (clickedEl.checked) {
    const noneEl = getHemoEl('hemo_meds_none');
    if (noneEl) noneEl.checked = false;
  }
}

// --- Red Flag Evaluator ---
function evaluateHemoptysisRedFlags(patient) {
  const rfs = [];
  if (!patient) return rfs;

  const warnSigns = Array.isArray(patient.hemoWarningSigns) ? patient.hemoWarningSigns : [];
  const chestPainTypes = Array.isArray(patient.hemoChestPainType) ? patient.hemoChestPainType : [];
  const meds = Array.isArray(patient.hemoBleedingMeds) ? patient.hemoBleedingMeds : [];
  const pastPulm = Array.isArray(patient.hemoPastPulmonary) ? patient.hemoPastPulmonary : [];
  const vs = patient.vital_signs || {};

  const sbp = typeof vs.sbp === 'number' ? vs.sbp : (parseInt(vs.sbp, 10) || null);
  const pr = typeof vs.pr === 'number' ? vs.pr : (parseInt(vs.pr, 10) || null);
  const spo2 = typeof vs.spo2 === 'number' ? vs.spo2 : (parseInt(vs.spo2, 10) || null);
  const shockIndex = (sbp && pr && sbp > 0) ? (pr / sbp) : null;

  // 1. Massive Hemoptysis with Impending Asphyxiation (ESI 1)
  if (patient.hemoBloodVolume === 'vol_massive_over_cup' || warnSigns.includes('warn_choking_airway_threat')) {
    rfs.push({
      key: 'rf_massive_asphyxiation',
      level: 1,
      textTh: 'Massive Hemoptysis with Impending Asphyxiation / เลือดออกปริมาณมากเสี่ยงทางเดินหายใจอุดกั้นเฉียบพลัน',
      risk: 'Asphyxiation from blood flooding the airways; high mortality if not protected immediately.',
      suggestedAction: 'Immediate Resuscitation Room placement, prepare for immediate large-bore ETT intubation or Rigid Bronchoscopy, stat Blood crossmatch.'
    });
  }

  // 2. Hemodynamic Instability / Hypovolemic Shock (ESI 1)
  if (warnSigns.includes('warn_fainting_syncope') || warnSigns.includes('warn_profuse_sweat_cold_shock') || (sbp !== null && sbp < 90) || (shockIndex !== null && shockIndex >= 0.9)) {
    rfs.push({
      key: 'rf_hemodynamic_shock',
      level: 1,
      textTh: 'Hemodynamic Instability / Hypovolemic Shock (สัญญาณชีพไม่คงที่จากภาวะเลือดออกในปอด)',
      risk: 'Circulatory collapse secondary to ongoing blood loss.',
      suggestedAction: 'Two large-bore IV lines (18G), aggressive fluid resuscitation, type and crossmatch PRC 4 units.'
    });
  }

  // 3. Acute Respiratory Failure / Severe Hypoxemia (ESI 1)
  if (patient.hemoDyspnea === 'dyspnea_severe_rest_orthopnea' || (spo2 !== null && spo2 < 90)) {
    rfs.push({
      key: 'rf_respiratory_failure',
      level: 1,
      textTh: 'Acute Respiratory Failure / Severe Hypoxemia (หายใจหอบเหนื่อยรุนแรง หรือ SpO2 < 90%)',
      risk: 'Severe gas exchange failure due to alveolar flooding and bronchial obstruction.',
      suggestedAction: 'High-flow oxygen or HFNC, maintain SpO2 >= 95%, prepare airway equipment.'
    });
  }

  // 4. Suspected Thoracic Aortic Dissection / Tearing Chest Pain (ESI 1)
  if (chestPainTypes.includes('tearing_ripping_back')) {
    rfs.push({
      key: 'rf_aortic_dissection_chest',
      level: 1,
      textTh: 'Suspected Thoracic Aortic Dissection / Aortobronchial Fistula (สงสัยหลอดเลือดเอออร์ตาฉีกขาดร้าวทะลุหลัง)',
      risk: 'Aortobronchial fistula or acute aortic dissection rupture with catastrophic hemoptysis.',
      suggestedAction: 'Stat CT Angiography Chest, emergent Cardiothoracic surgery consultation, avoid anticoagulants.'
    });
  }

  // 5. Suspected Pulmonary Embolism (PE) with Infarction (ESI 2)
  if (chestPainTypes.includes('pleuritic_sharp') || warnSigns.includes('warn_unilateral_leg_swelling') || warnSigns.includes('warn_long_travel_immobility') || warnSigns.includes('warn_post_op_bedridden') || warnSigns.includes('warn_history_dvt_pe')) {
    rfs.push({
      key: 'rf_suspected_pe_dvt',
      level: 2,
      textTh: 'Suspected Pulmonary Embolism (PE) with Infarction / สงสัยลิ่มเลือดอุดกั้นปอด',
      risk: 'Pulmonary infarction from thromboembolism; risk of sudden hemodynamic collapse.',
      suggestedAction: 'Stat CTPA (CT Pulmonary Angiography), 12-lead ECG, bedside cardiac echo, evaluate for anticoagulation.'
    });
  }

  // 6. Submassive Hemoptysis with Active Bleeding (ESI 2)
  if (patient.hemoBloodVolume === 'vol_half_to_full_cup' && patient.hemoActiveStatus === 'status_active_bleeding') {
    rfs.push({
      key: 'rf_submassive_active',
      level: 2,
      textTh: 'Submassive Hemoptysis with Active Bleeding / ไอเลือดสดปานกลางและยังมีเลือดออกต่อเนื่อง',
      risk: 'Progression to massive hemoptysis; bronchial artery erosion.',
      suggestedAction: 'Admit to intermediate/ICU bed, urgent Chest CT Angiogram, consult Pulmonology/Interventional Radiology.'
    });
  }

  // 7. Suspected Active Cavitary Pulmonary TB (ESI 2)
  if ((warnSigns.includes('warn_fever_afternoon_night_sweat') || warnSigns.includes('warn_unintentional_weight_loss')) && (pastPulm.includes('tb_prior_or_contact') || patient.hemoBloodChar === 'char_true_frothy_red')) {
    rfs.push({
      key: 'rf_cavitary_tb',
      level: 2,
      textTh: 'Suspected Active Cavitary Tuberculosis (TB) with Hemoptysis / สงสัยวัณโรคปอดระยะลุกลาม',
      risk: 'Airborne transmission to healthcare workers and patients, Rasmussen aneurysm erosion.',
      suggestedAction: 'Strict Airborne Isolation in Negative Pressure room, Sputum AFB x 3, GeneXpert MTB/RIF, stat CXR.'
    });
  }

  // 8. Anticoagulant-Associated Hemoptysis / Coagulopathy (ESI 2)
  if (meds.includes('med_anticoagulant') || meds.includes('med_antiplatelet') || meds.includes('med_unknown_prescribed')) {
    rfs.push({
      key: 'rf_anticoagulant_bleeding',
      level: 2,
      textTh: 'Anticoagulant-Associated Hemoptysis / ภาวะเลือดออกจากยาต้านการแข็งตัวของเลือด',
      risk: 'Uncontrolled pulmonary hemorrhage due to impaired coagulation cascade.',
      suggestedAction: 'Hold anticoagulants immediately, stat Coagulogram (PT, INR, PTT), prepare reversal agents (Vit K, PCC, Protamine).'
    });
  }

  // 9. Necrotizing Pneumonia / Lung Abscess with Sepsis (ESI 2)
  const hasHighFeverOrChills = warnSigns.includes('warn_high_fever_chills') || warnSigns.includes('warn_high_fever') || warnSigns.includes('warn_chills');
  const hasActualDyspnea = patient.hemoDyspnea === 'dyspnea_exertional' || patient.hemoDyspnea === 'dyspnea_severe_rest_orthopnea' || !!patient.hemoDyspneaParent;
  if (patient.hemoPriorSputum === 'sputum_foul_abscess_green' || (hasHighFeverOrChills && hasActualDyspnea)) {
    rfs.push({
      key: 'rf_necrotizing_abscess',
      level: 2,
      textTh: 'Necrotizing Pneumonia / Lung Abscess / สงสัยปอดอักเสบเนื้อตายหรือฝีในปอด',
      risk: 'Pulmonary necrosis, cavitary lung destruction, sepsis.',
      suggestedAction: 'Blood and sputum cultures, stat IV Broad-spectrum antibiotics (covering anaerobes and MRSA/Pseudomonas), CXR/CT Chest.'
    });
  }

  // 10. Suspected Bronchogenic Carcinoma (Lung Cancer) (ESI 3)
  if (warnSigns.includes('warn_unintentional_weight_loss') || warnSigns.includes('warn_hoarseness_weeks') || pastPulm.includes('past_lung_cancer') || (patient.age >= 50 && patient.hemoSmokingStatus === 'smoking_regular' && (patient.hemoSmokingYears || 0) >= 20)) {
    if (!rfs.some(r => r.key === 'rf_cavitary_tb')) {
      rfs.push({
        key: 'rf_lung_malignancy',
        level: 3,
        textTh: 'Suspected Bronchogenic Carcinoma (Lung Cancer) / สงสัยโรคมะเร็งปอด',
        risk: 'Endobronchial tumor vascular invasion.',
        suggestedAction: 'Stat CXR, schedule Contrast-enhanced CT Chest, outpatient or inpatient Pulmonology referral.'
      });
    }
  }

  return rfs;
}

// --- Thai Dictionaries & Formatters (Zero Raw Enum Leaks / Zero Flag Icons) ---
const HEMO_DUR_UNIT_MAP = {
  minutes: 'นาที',
  hours: 'ชั่วโมง',
  days: 'วัน',
  weeks: 'สัปดาห์',
  months: 'เดือน',
  years: 'ปี'
};

const HEMO_BLOOD_CHAR_MAP = {
  char_true_frothy_red: 'เลือดสดสีแดง หรือมีฟองอากาศปน',
  char_streaked_sputum: 'เสมหะปนเลือดเป็นเส้นๆ สีแดงเรื่อหรือน้ำตาล',
  char_coffee_ground_vomit: 'ขย้อนหรืออาเจียนเป็นสีกาแฟ หรือมีเศษอาหารปน',
  char_postnasal_epistaxis: 'เลือดกำเดาไหลลงคอแล้วบ้วนออกมา'
};

const HEMO_VOLUME_MAP = {
  vol_streaks_sputum: 'เลือดออกเป็นเส้นๆ ปนในเสมหะ (น้อยกว่า 1 ช้อนชา)',
  vol_tablespoon: 'ประมาณ 1–2 ช้อนโต๊ะ (10–30 มล.)',
  vol_half_to_full_cup: 'ประมาณครึ่งแก้วถึงเต็มแก้วน้ำ (50–100 มล.)',
  vol_massive_over_cup: 'เลือดสดทะลักมากกว่าแก้วน้ำ (มากกว่า 100–200 มล. หรือมีลิ่มเลือดต่อเนื่อง)'
};

const HEMO_FREQUENCY_MAP = {
  episodes_single: 'เป็นเพียงครั้งเดียวแล้วหยุด',
  episodes_two_four: 'เป็น 2–4 ครั้ง',
  episodes_over_5: 'เป็นมากกว่า 5 ครั้งขึ้นไป',
  episodes_frequent_continuous: 'ไอเป็นเลือดแทบทุกครั้ง หรือต่อเนื่องตลอด'
};

const HEMO_ACTIVE_MAP = {
  status_active_bleeding: 'ยังมีอาการไอเป็นเลือดสดอยู่เรื่อยๆ',
  status_streaks_only: 'เลือดหยุดแล้ว เหลือเพียงเสมหะปนเลือดจางๆ',
  status_stopped_completely: 'เลือดหยุดไหลสนิทแล้ว'
};

const HEMO_DYSPNEA_MAP = {
  dyspnea_none: 'หายใจปกติ ไม่เหนื่อย',
  dyspnea_exertional: 'หายใจหอบเหนื่อยเวลาออกแรงหรือเดิน',
  dyspnea_severe_rest_orthopnea: 'หายใจหอบเหนื่อยรุนแรงแม้ขณะพัก หรือนอนราบไม่ได้'
};

const HEMO_SPUTUM_MAP = {
  sputum_none_dry_cough: 'ไอแห้งๆ ไม่มีเสมหะ',
  sputum_normal_white_yellow: 'เสมหะสีขาวใสหรือสีเหลืองปกติ',
  sputum_foul_abscess_green: 'เสมหะสีเขียวข้น หรือมีกลิ่นเหม็นเน่ารุนแรง',
  sputum_pink_frothy_edema: 'เสมหะเป็นฟองสีชมพูจางๆ'
};

const HEMO_CHEST_PAIN_MAP = {
  pleuritic_sharp: 'เจ็บแปล๊บเวลาหายใจเข้าลึกหรือไอ',
  ischemic_pressure: 'เจ็บแน่นอึดอัดกลางหน้าอก',
  tearing_ripping_back: 'เจ็บเหมือนฉีกขาดในอกร้าวทะลุหลัง'
};

const HEMO_WARN_MAP = {
  warn_choking_airway_threat: 'ไอสำลักเลือด หายใจติดขัด กลืนไม่ลง',
  warn_fainting_syncope: 'หน้ามืด วูบ หรือหมดสติไปชั่วขณะ',
  warn_profuse_sweat_cold_shock: 'เหงื่อแตกท่วมตัว ตัวซีดเย็น ตัวสั่น',
  warn_palpitation_tachycardia: 'ใจสั่น หัวใจเต้นรัวเร็ว',
  warn_unilateral_leg_swelling: 'ขาบวมโต หรือปวดตึงน่องข้างใดข้างหนึ่งชัดเจน',
  warn_bilateral_leg_swelling: 'ขาบวมทั้งสองข้าง',
  warn_long_travel_immobility: 'เดินทางไกลนั่งรถยนต์หรือเครื่องบินต่อเนื่องเกิน 4–6 ชั่วโมง',
  warn_post_op_bedridden: 'เพิ่งผ่าตัดใหญ่ หรือนอนพักรักษาตัวติดเตียงเกิน 3 วัน',
  warn_history_dvt_pe: 'เคยมีประวัติลิ่มเลือดอุดตันที่แขนหรือขามาก่อน',
  warn_low_grade_fever: 'มีไข้ตัวรุมๆ',
  warn_high_fever: 'มีไข้สูง',
  warn_chills: 'มีอาการหนาวสั่น',
  warn_high_fever_chills: 'มีไข้สูง หนาวสั่นสะท้าน',
  warn_fever_afternoon_night_sweat: 'เหงื่อออกท่วมตัวตอนกลางคืน หรือมีไข้ต่ำตอนบ่าย',
  warn_unintentional_weight_loss: 'น้ำหนักตัวลดลงผิดปกติ หรือเบื่ออาหารมาก',
  warn_hoarseness_weeks: 'มีอาการเสียงแหบลงผิดปกติต่อเนื่องหลายสัปดาห์'
};

const HEMO_PULM_MAP = {
  tb_prior_or_contact: 'เคยป่วยเป็นวัณโรคปอด หรืออยู่ร่วมบ้านผู้ป่วยวัณโรค',
  past_bronchiectasis: 'โรคถุงลมโป่งพอง หอบหืด หรือโรคปอดเรื้อรัง',
  past_copd_asthma: 'โรคถุงลมโป่งพอง หอบหืด หรือโรคปอดเรื้อรัง',
  past_lung_cancer: 'โรคมะเร็งปอด หรือมะเร็งอวัยวะอื่น',
  past_heart_failure_valvular: 'โรคหัวใจ (ลิ้นหัวใจตีบ หรือหัวใจล้มเหลว)'
};

const HEMO_SMOKING_MAP = {
  smoking_regular: 'สูบบุหรี่เป็นประจำ',
  smoking_quit: 'เคยสูบแต่เลิกแล้ว',
  smoking_never: 'ไม่เคยสูบบุหรี่'
};

const HEMO_MED_MAP = {
  med_anticoagulant: 'รับประทานยาละลายลิ่มเลือด (เช่น Warfarin, Eliquis, Xarelto, Pradaxa)',
  med_antiplatelet: 'รับประทานยาต้านเกล็ดเลือด (เช่น Aspirin, Clopidogrel, Plavix)',
  med_unknown_prescribed: 'มียาประจำตัวที่มีผลต่อเลือดออก แต่ไม่ทราบชื่อยา'
};

const HEMO_HOSP_MAP = {
  ratchaburi: 'มีประวัติการรักษาที่ รพ.ราชบุรี',
  complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
  additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
  self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
  unspecified: 'ไม่ได้ระบุ'
};

function formatHemoBloodChar(patient) {
  return HEMO_BLOOD_CHAR_MAP[patient.hemoBloodChar] || 'ไม่ได้ระบุ';
}

function formatHemoBloodVolume(patient) {
  return HEMO_VOLUME_MAP[patient.hemoBloodVolume] || 'ไม่ได้ระบุ';
}

function formatHemoFrequency(patient) {
  return HEMO_FREQUENCY_MAP[patient.hemoEpisodeCount] || 'ไม่ได้ระบุ';
}

function formatHemoActiveStatus(patient) {
  return HEMO_ACTIVE_MAP[patient.hemoActiveStatus] || 'ไม่ได้ระบุ';
}

function formatHemoDyspnea(patient) {
  if (HEMO_DYSPNEA_MAP[patient.hemoDyspnea]) return HEMO_DYSPNEA_MAP[patient.hemoDyspnea];
  if (patient.hemoDyspneaParent) return 'มีอาการเหนื่อยหอบ / หายใจลำบาก (ไม่ได้ระบุระดับ)';
  if (patient.hemoWarnNone) return HEMO_DYSPNEA_MAP.dyspnea_none;
  return 'ไม่ได้ระบุ';
}

function formatHemoSputum(patient) {
  if (HEMO_SPUTUM_MAP[patient.hemoPriorSputum]) return HEMO_SPUTUM_MAP[patient.hemoPriorSputum];
  if (patient.hemoPriorSputumParent) return 'มีเสมหะนำมาก่อน (ไม่ได้ระบุลักษณะ)';
  return 'ไม่ได้ระบุ';
}

function formatHemoWeightLossDetail(patient) {
  const parts = [];
  if (patient.hemoWeightLossKg) parts.push(`ลดลงประมาณ ${patient.hemoWeightLossKg} กก.`);
  if (patient.hemoWeightLossDurVal) {
    const unit = HEMO_DUR_UNIT_MAP[patient.hemoWeightLossDurUnit] || 'เดือน';
    parts.push(`ในช่วง ${patient.hemoWeightLossDurVal} ${unit}`);
  }
  return parts.length > 0
    ? `${HEMO_WARN_MAP.warn_unintentional_weight_loss} (${parts.join(' ')})`
    : HEMO_WARN_MAP.warn_unintentional_weight_loss;
}

function formatHemoChestPain(patient) {
  if (patient.hemoChestPainMaster === 'no') return 'ปฏิเสธอาการเจ็บหน้าอก';
  if (patient.hemoChestPainMaster === 'yes') {
    const types = Array.isArray(patient.hemoChestPainType) ? patient.hemoChestPainType : [];
    const desc = types.map(t => HEMO_CHEST_PAIN_MAP[t] || t).join(', ') || 'มีอาการเจ็บหน้าอก';
    const scoreStr = (typeof patient.painScore === 'number') ? ` (Pain Score: ${patient.painScore}/10)` : '';
    return `${desc}${scoreStr}`;
  }
  return 'ไม่ได้ระบุ';
}

function formatHemoPastPulmDisplay(pastPulm) {
  if (!Array.isArray(pastPulm) || pastPulm.length === 0) return 'ไม่ได้ระบุ';
  if (pastPulm.includes('pulm_none')) return 'ปฏิเสธ';
  const mapped = [...new Set(pastPulm.map(k => HEMO_PULM_MAP[k]).filter(Boolean))];
  return mapped.length > 0 ? mapped.join(', ') : 'ไม่ได้ระบุ';
}

// --- Rapid Note Renderer (Doctor View) ---
function renderHemoptysisRapidHpi(patient) {
  const durVal = patient.durationVal;
  const durUnit = HEMO_DUR_UNIT_MAP[patient.durationUnit] || 'ชั่วโมง';
  const durationStr = durVal ? `${durVal} ${durUnit}` : 'ไม่ได้ระบุ';

  const warnSigns = Array.isArray(patient.hemoWarningSigns) ? patient.hemoWarningSigns : [];
  const meds = Array.isArray(patient.hemoBleedingMeds) ? patient.hemoBleedingMeds : [];
  const pastPulm = Array.isArray(patient.hemoPastPulmonary) ? patient.hemoPastPulmonary : [];
  const prodParents = patient.hemoProdromeParents || {};
  const warnParents = patient.hemoWarnParents || {};

  const feverKeys = ['warn_low_grade_fever', 'warn_high_fever', 'warn_chills', 'warn_high_fever_chills', 'warn_fever_afternoon_night_sweat'];
  const syncopeKeys = ['warn_fainting_syncope', 'warn_profuse_sweat_cold_shock', 'warn_palpitation_tachycardia'];
  const dvtKeys = ['warn_unilateral_leg_swelling', 'warn_bilateral_leg_swelling', 'warn_long_travel_immobility', 'warn_post_op_bedridden', 'warn_history_dvt_pe'];
  const card2SignKeys = [...feverKeys, 'warn_unintentional_weight_loss', 'warn_hoarseness_weeks'];
  const card3SignKeys = ['warn_choking_airway_threat', ...syncopeKeys, ...dvtKeys];

  const posList = [];
  const negList = [];

  if (patient.hemoPreCoughMaster === 'yes') {
    const preDurStr = patient.hemoPreCoughDurVal
      ? `${patient.hemoPreCoughDurVal} ${HEMO_DUR_UNIT_MAP[patient.hemoPreCoughDurUnit] || 'สัปดาห์'}`
      : 'ไม่ได้ระบุระยะเวลา';
    posList.push(`มีอาการไอเรื้อรังนำมาก่อน (${preDurStr})`);
  }

  warnSigns.forEach(k => {
    if (k === 'warn_unintentional_weight_loss') {
      posList.push(formatHemoWeightLossDetail(patient));
    } else if (HEMO_WARN_MAP[k]) {
      posList.push(HEMO_WARN_MAP[k]);
    }
  });

  if (prodParents.fever && !warnSigns.some(k => feverKeys.includes(k))) {
    posList.push('มีไข้หรือเหงื่อออกกลางคืน (ไม่ได้ระบุรายละเอียด)');
  }
  if (prodParents.weightLoss && !warnSigns.includes('warn_unintentional_weight_loss')) {
    posList.push(formatHemoWeightLossDetail(patient));
  }
  if (warnParents.syncope && !warnSigns.some(k => syncopeKeys.includes(k))) {
    posList.push('มีอาการหน้ามืด วูบ หรือใจสั่นเหงื่อแตก (ไม่ได้ระบุรายละเอียด)');
  }
  if (warnParents.dvtPe && !warnSigns.some(k => dvtKeys.includes(k))) {
    posList.push('มีอาการขาบวมปวดน่อง หรือประวัติเดินทางไกล/ติดเตียง (ไม่ได้ระบุรายละเอียด)');
  }

  const dedupPulm = [...new Set(pastPulm.filter(k => k !== 'pulm_none').map(k => HEMO_PULM_MAP[k]).filter(Boolean))];
  dedupPulm.forEach(txt => { posList.push(txt); });

  if (patient.hemoSmokingStatus === 'smoking_regular') {
    const yrs = patient.hemoSmokingYears ? `${patient.hemoSmokingYears} ปี` : 'ไม่ระบุปี';
    const pks = patient.hemoSmokingPacks ? `, ${patient.hemoSmokingPacks} ซอง/วัน` : '';
    posList.push(`สูบบุหรี่เป็นประจำ (${yrs}${pks})`);
  } else if (patient.hemoSmokingStatus === 'smoking_quit') {
    posList.push('เคยสูบบุหรี่แต่เลิกแล้ว');
  }

  meds.filter(k => k !== 'meds_none').forEach(k => {
    if (HEMO_MED_MAP[k]) posList.push(HEMO_MED_MAP[k]);
  });

  if (patient.otherSymptomsFree) {
    posList.push(patient.otherSymptomsFree);
  }

  // Confirmed negatives only (Zero Default Bias)
  const hasCard2Pos = patient.hemoPreCoughMaster === 'yes' || !!patient.hemoPriorSputumParent || warnSigns.some(k => card2SignKeys.includes(k)) || !!prodParents.fever || !!prodParents.weightLoss;
  const hasCard3Pos = warnSigns.some(k => card3SignKeys.includes(k)) || !!patient.hemoDyspneaParent || (!!patient.hemoDyspnea && patient.hemoDyspnea !== 'dyspnea_none') || patient.hemoChestPainMaster === 'yes' || !!warnParents.syncope || !!warnParents.dvtPe;

  if (patient.hemoProdromeNone) {
    negList.push('ปฏิเสธอาการไอนำ เสมหะนำ ไข้ เหงื่อออกกลางคืน น้ำหนักลด และเสียงแหบ');
  } else if (hasCard2Pos) {
    if (patient.hemoPreCoughMaster !== 'yes') negList.push('ปฏิเสธอาการไอนำมาก่อนหน้า');
    if (!warnSigns.some(k => feverKeys.includes(k)) && !prodParents.fever) negList.push('ปฏิเสธอาการไข้ หนาวสั่น และเหงื่อออกกลางคืน');
    if (!warnSigns.includes('warn_unintentional_weight_loss') && !prodParents.weightLoss) negList.push('ปฏิเสธน้ำหนักตัวลดฮวบหรือเบื่ออาหาร');
    if (!warnSigns.includes('warn_hoarseness_weeks')) negList.push('ปฏิเสธเสียงแหบเรื้อรัง');
  } else if (patient.hemoPreCoughMaster === 'no') {
    negList.push('ปฏิเสธอาการไอนำมาก่อนหน้า');
  }

  if (patient.hemoActiveStatus === 'status_stopped_completely') negList.push('เลือดหยุดไหลสนิทแล้ว');
  if (patient.hemoSmokingStatus === 'smoking_never') negList.push('ไม่เคยสูบบุหรี่');

  if (patient.hemoWarnNone) {
    negList.push('ปฏิเสธอาการเหนื่อยหอบ เจ็บหน้าอก ไอสำลักเลือด หน้ามืดวูบ และอาการบ่งชี้ลิ่มเลือดอุดตันที่ขา');
  } else {
    if (patient.hemoDyspnea === 'dyspnea_none') negList.push('ปฏิเสธอาการหายใจหอบเหนื่อย');
    if (patient.hemoChestPainMaster === 'no') negList.push('ปฏิเสธอาการเจ็บหน้าอก');
    if (hasCard3Pos) {
      if (!warnSigns.includes('warn_choking_airway_threat')) negList.push('ปฏิเสธอาการไอสำลักเลือดหรือขวางทางเดินหายใจ');
      if (!warnSigns.some(k => syncopeKeys.includes(k)) && !warnParents.syncope) negList.push('ปฏิเสธหน้ามืด วูบ และเหงื่อแตกตัวเย็น');
      if (!warnSigns.some(k => dvtKeys.includes(k)) && !warnParents.dvtPe) negList.push('ปฏิเสธอาการขาบวม ปวดตึงน่อง และประวัติเดินทางไกล/ติดเตียง');
    }
  }

  if (pastPulm.includes('pulm_none')) negList.push('ปฏิเสธโรคประจำตัวทางปอดและหัวใจ');
  if (meds.includes('meds_none')) negList.push('ปฏิเสธการใช้ยาละลายลิ่มเลือดและยาต้านเกล็ดเลือด');

  const hospLabel = HEMO_HOSP_MAP[patient.hospRecordStatus] || 'ไม่ได้ระบุ';
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
  const redFlags = evaluateHemoptysisRedFlags(patient);

  let preCoughLine = 'ไม่ได้ระบุ';
  const hasPriorSputumInfo = !!patient.hemoPriorSputumParent || (!!patient.hemoPriorSputum && patient.hemoPriorSputum !== 'sputum_none_dry_cough');
  if (patient.hemoPreCoughMaster === 'yes') {
    const durPart = patient.hemoPreCoughDurVal
      ? `${patient.hemoPreCoughDurVal} ${HEMO_DUR_UNIT_MAP[patient.hemoPreCoughDurUnit] || 'สัปดาห์'}`
      : 'ไม่ระบุระยะเวลา';
    const sputumPart = hasPriorSputumInfo ? `เสมหะเดิม: ${formatHemoSputum(patient)}` : 'ไอแห้งไม่มีเสมหะ';
    preCoughLine = `มีไอนำมาก่อน ${durPart} (${sputumPart})`;
  } else if (hasPriorSputumInfo) {
    preCoughLine = `ไม่มีไอนำ แต่มี${formatHemoSputum(patient)}`;
  } else if (patient.hemoProdromeNone || patient.hemoPreCoughMaster === 'no') {
    preCoughLine = `ไม่มีไอนำและไม่มีเสมหะผิดปกติมาก่อน`;
  }

  return `[Chief Complaint (CC)]
ไอเป็นเลือด (Hemoptysis) มา ${durationStr}

[History of Present Illness (HPI)]
• ระยะเวลาที่มีอาการ: ${durVal ? `ไอเป็นเลือดมา ${durationStr}` : 'ไม่ได้ระบุ'} (สถานะ: ${formatHemoActiveStatus(patient)}, ความถี่: ${formatHemoFrequency(patient)})
• ลักษณะของเลือด: ${formatHemoBloodChar(patient)}
• ปริมาณเลือดในครั้งที่ออกมากที่สุด: ${formatHemoBloodVolume(patient)}
• ประวัติไอนำและเสมหะเดิม: ${preCoughLine}
• อาการเหนื่อยหอบ: ${formatHemoDyspnea(patient)}
• อาการเจ็บหน้าอก: ${formatHemoChestPain(patient)}

• Pertinent Positives:
${posList.length > 0 ? posList.map(p => `  - ${p}`).join('\n') : '  - ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม'}

• Pertinent Negatives:
${negList.length > 0 ? negList.map(n => `  - ${n}`).join('\n') : '  - ผู้ป่วยไม่ได้ระบุคำตอบยืนยันในหมวดอาการร่วม'}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• โรคประจำตัว (U/D): ${udDisplay}
• ประวัติโรคปอดเดิม: ${formatHemoPastPulmDisplay(pastPulm)}
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
}

// --- Narrative Note Generator (Doctor View) ---
function renderHemoptysisNarrative(patient) {
  const durUnit = HEMO_DUR_UNIT_MAP[patient.durationUnit] || 'ชั่วโมง';
  const durStr = patient.durationVal ? `${patient.durationVal} ${durUnit}` : 'ไม่ระบุระยะเวลา';

  const charStr = formatHemoBloodChar(patient);
  const volStr = formatHemoBloodVolume(patient);
  const freqStr = formatHemoFrequency(patient);
  const activeStr = formatHemoActiveStatus(patient);
  const dyspneaStr = formatHemoDyspnea(patient);
  const chestPainStr = formatHemoChestPain(patient);

  const warnSigns = Array.isArray(patient.hemoWarningSigns) ? patient.hemoWarningSigns : [];
  const pastPulm = Array.isArray(patient.hemoPastPulmonary) ? patient.hemoPastPulmonary.filter(k => k !== 'pulm_none') : [];
  const meds = Array.isArray(patient.hemoBleedingMeds) ? patient.hemoBleedingMeds.filter(k => k !== 'meds_none') : [];

  const genderLabel = (patient.gender && patient.gender !== 'ไม่ระบุ') ? patient.gender : '';
  let note = `ผู้ป่วย${genderLabel} อายุ ${patient.age || 'ไม่ได้ระบุ'} ปี มารับการตรวจด้วยอาการไอเป็นเลือด เป็นมา ${durStr} ก่อนมาโรงพยาบาล ลักษณะเลือดที่ไอออกมาคือ${charStr} ปริมาณในครั้งที่ออกมากที่สุดคือ${volStr} ความถี่${freqStr} สถานะปัจจุบัน${activeStr} การหายใจประเมินได้ว่า${dyspneaStr} อาการเจ็บหน้าอก: ${chestPainStr}`;

  if (warnSigns.length > 0) {
    const warnTexts = warnSigns.map(k => (k === 'warn_unintentional_weight_loss' ? formatHemoWeightLossDetail(patient) : (HEMO_WARN_MAP[k] || k)));
    note += ` ร่วมกับมีอาการสำคัญ ได้แก่ ${warnTexts.join(', ')}`;
  }

  if (pastPulm.length > 0) {
    const pulmTexts = [...new Set(pastPulm.map(k => HEMO_PULM_MAP[k] || k))];
    note += ` ประวัติโรคปอดและหัวใจเดิม: ${pulmTexts.join(', ')}`;
  }

  if (patient.hemoSmokingStatus && HEMO_SMOKING_MAP[patient.hemoSmokingStatus]) {
    note += ` ประวัติสูบบุหรี่: ${HEMO_SMOKING_MAP[patient.hemoSmokingStatus]}`;
    if (patient.hemoSmokingStatus === 'smoking_regular' && patient.hemoSmokingYears) {
      note += ` (${patient.hemoSmokingYears} ปี, ${patient.hemoSmokingPacks || 0} ซอง/วัน)`;
    }
  }

  if (meds.length > 0) {
    note += ` ประวัติการใช้ยา: ${meds.map(k => HEMO_MED_MAP[k] || k).join(', ')}`;
  }

  return note;
}

function renderHemoptysisDoctorHpi(patient) {
  return renderHemoptysisRapidHpi(patient);
}

// --- Output Dispatcher ---
function updateHemoptysisOutputs(rec) {
  if (!rec) return null;
  const rapidText = renderHemoptysisRapidHpi(rec);
  const narrativeText = renderHemoptysisNarrative(rec);
  const finalRapid = rec.custom_rapid_note || rapidText;
  const finalNarrative = rec.custom_narrative_note || narrativeText;

  if (typeof document !== 'undefined') {
    const rapidEl = document.getElementById('rapidTextView');
    const narrativeEl = document.getElementById('narrativeTextView');
    if (rapidEl) rapidEl.value = finalRapid;
    if (narrativeEl) narrativeEl.value = finalNarrative;
  }

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

  const redFlags = evaluateHemoptysisRedFlags(rec);
  rec.redFlags = redFlags;

  const jsonOutput = {
    encounter: {
      chief_complaint: 'hemoptysis',
      chief_complaint_title_th: 'ไอเป็นเลือด',
      timestamp: rec.timestamp || new Date().toISOString(),
      duration_val: rec.durationVal || null,
      duration_unit: rec.durationUnit || 'hours'
    },
    patient_identification: {
      id: rec.id || null,
      queue_number: rec.queue_number || null,
      hn: rec.hn || null,
      name: rec.name || null,
      age: rec.age || null,
      gender: rec.gender || null
    },
    triage_assessment: {
      blood_character: rec.hemoBloodChar || null,
      blood_volume: rec.hemoBloodVolume || null,
      episode_frequency: rec.hemoEpisodeCount || null,
      active_bleeding_status: rec.hemoActiveStatus || null,
      pre_existing_cough: {
        present: rec.hemoPreCoughMaster === 'yes' ? true : (rec.hemoPreCoughMaster === 'no' ? false : null),
        duration_val: rec.hemoPreCoughDurVal || null,
        duration_unit: rec.hemoPreCoughDurUnit || 'weeks',
        prior_sputum: rec.hemoPriorSputum || null
      },
      dyspnea_grade: rec.hemoDyspnea || null,
      chest_pain: {
        present: rec.hemoChestPainMaster === 'yes' ? true : (rec.hemoChestPainMaster === 'no' ? false : null),
        types: Array.isArray(rec.hemoChestPainType) ? rec.hemoChestPainType : [],
        pain_score: rec.painScore !== null && rec.painScore !== undefined ? rec.painScore : null
      },
      warning_signs: Array.isArray(rec.hemoWarningSigns) ? rec.hemoWarningSigns : [],
      weight_loss: {
        kg: rec.hemoWeightLossKg || null,
        duration_val: rec.hemoWeightLossDurVal || null,
        duration_unit: rec.hemoWeightLossDurUnit || 'months'
      },
      past_pulmonary_cardiac: Array.isArray(rec.hemoPastPulmonary) ? rec.hemoPastPulmonary : [],
      smoking: {
        status: rec.hemoSmokingStatus || null,
        years: rec.hemoSmokingYears || null,
        packs_per_day: rec.hemoSmokingPacks || null
      },
      bleeding_meds: Array.isArray(rec.hemoBleedingMeds) ? rec.hemoBleedingMeds : [],
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

  rec.rapidHpi = finalRapid;
  rec.narrativeHpi = finalNarrative;
  rec.medicalJson = jsonOutput;

  if (typeof document !== 'undefined') {
    const jsonEl = document.getElementById('jsonViewer');
    if (jsonEl) jsonEl.textContent = JSON.stringify(jsonOutput, null, 2);
  }

  return { rapid: finalRapid, narrative: finalNarrative, json: jsonOutput };
}

// =========================================================================
// UI TEMPLATE FRAGMENTS (Golden UI/UX — 4 Cards + Universal PMH Card 5)
// =========================================================================
const HEMO_PAIN_SCALE_HTML = `<div class="pt-2 border-t border-slate-200">
  <div class="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <label class="block text-xs font-semibold text-slate-800 tracking-wider">ระดับความเจ็บแน่นหน้าอก (Pain Score: 0–10)</label>
      <div class="flex items-center space-x-2">
        <span id="hemoPainScoreBadge" class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all">
          <span id="hemoPainScoreEmoji" class="text-base">⚪</span>
          <span id="hemoPainScoreText">ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)</span>
        </span>
        <button type="button" id="hemoPainScoreClearBtn" onclick="clearHemoPainScore()" class="text-xs text-slate-500 hover:text-slate-800 underline hidden transition" title="ล้างค่าเพื่อให้เป็นไม่ได้ระบุ">ล้างค่า</button>
      </div>
    </div>
    <div class="px-1 pt-1">
      <input type="range" id="hemoPainScore" min="0" max="10" value="0" step="1" oninput="handleHemoPainScoreChange(this.value)" class="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-600 focus:outline-none focus:ring-2 focus:ring-medical-500">
    </div>
    <div class="grid grid-cols-5 text-center text-[10px] sm:text-[11px] pt-1 gap-1 text-slate-500 font-medium">
      <div class="cursor-pointer hover:text-medical-600 transition" onclick="setHemoPainScore(0)"><span class="text-lg sm:text-xl block">😊</span><span>0: สบายดี</span></div>
      <div class="cursor-pointer hover:text-medical-600 transition" onclick="setHemoPainScore(2)"><span class="text-lg sm:text-xl block">🙂</span><span>1–3: เล็กน้อย</span></div>
      <div class="cursor-pointer hover:text-medical-600 transition" onclick="setHemoPainScore(5)"><span class="text-lg sm:text-xl block">😐</span><span>4–6: ปานกลาง</span></div>
      <div class="cursor-pointer hover:text-medical-600 transition" onclick="setHemoPainScore(8)"><span class="text-lg sm:text-xl block">😣</span><span>7–9: ปวดมาก</span></div>
      <div class="cursor-pointer hover:text-medical-600 transition" onclick="setHemoPainScore(10)"><span class="text-lg sm:text-xl block">😭</span><span>10: ปวดที่สุด</span></div>
    </div>
  </div>
</div>`;

const HEMO_PRODROME_SUBS_HTML = [
  `<div id="hemoPreCoughSub" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-3 space-y-2">
    <span class="text-xs font-semibold text-slate-700 block">ระบุระยะเวลาที่มีอาการไอนำมาก่อนหน้านี้:</span>
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
      <div class="col-span-1 sm:col-span-2">
        <input type="number" id="hemoPreCoughDurVal" min="1" max="365"
          class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800"
          placeholder="เช่น 2">
      </div>
      <div class="col-span-1">
        <select id="hemoPreCoughDurUnit"
          class="w-full bg-white border border-slate-300 rounded-lg px-2 py-2 text-xs font-medium text-slate-800">
          <option value="days">วัน</option>
          <option value="weeks" selected>สัปดาห์</option>
          <option value="months">เดือน</option>
          <option value="years">ปี</option>
        </select>
      </div>
    </div>
  </div>`,
  `<div id="hemoPriorSputumSub" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-3 space-y-2.5">
    <div class="text-xs font-semibold text-slate-700">ลักษณะเสมหะเดิมก่อนมีเลือดปน</div>
    ${renderHemoGrid('grid-cols-1 sm:grid-cols-2', [
      { kind: 'radio', name: 'hemoPriorSputum', value: 'sputum_normal_white_yellow', title: ['เสมหะขาวใส /', 'เหลืองปกติ'] },
      { kind: 'radio', name: 'hemoPriorSputum', value: 'sputum_foul_abscess_green', title: ['เสมหะเขียวข้น', 'กลิ่นเหม็นเน่า'] },
      { kind: 'radio', name: 'hemoPriorSputum', value: 'sputum_pink_frothy_edema', title: ['เสมหะเป็นฟอง', 'สีชมพู'], colSpan2: true }
    ], { compact: true })}
  </div>`,
  `<div id="hemoWarningFeverSub" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-3 space-y-2.5">
    <div class="text-xs font-semibold text-slate-700">ลักษณะอาการไข้และเหงื่อออกกลางคืน (เลือกได้หลายข้อ)</div>
    ${renderHemoGrid('grid-cols-1 sm:grid-cols-2', [
      { name: 'hemoWarningSigns', value: 'warn_low_grade_fever', title: ['ตัวรุมๆ'], onchange: 'handleHemoProdromeItemChange(this)' },
      { name: 'hemoWarningSigns', value: 'warn_high_fever', title: ['ไข้สูง'], onchange: 'handleHemoProdromeItemChange(this)' },
      { name: 'hemoWarningSigns', value: 'warn_chills', title: ['หนาวสั่น'], onchange: 'handleHemoProdromeItemChange(this)' },
      { name: 'hemoWarningSigns', value: 'warn_fever_afternoon_night_sweat', title: ['เหงื่อออกท่วม', 'ตอนกลางคืน'], onchange: 'handleHemoProdromeItemChange(this)' }
    ], { compact: true })}
  </div>`,
  `<div id="hemoWeightLossSub" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-3 space-y-2">
    <span class="text-xs font-semibold text-slate-700 block">ระบุน้ำหนักที่ลดลงโดยประมาณ และช่วงเวลา:</span>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
      <div>
        <label class="block text-[11px] font-medium text-slate-600 mb-1">ลดลงประมาณกี่ kg</label>
        <input type="number" step="0.5" id="hemoWeightLossKg" min="0.5" max="100"
          class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800"
          placeholder="เช่น 5">
      </div>
      <div>
        <label class="block text-[11px] font-medium text-slate-600 mb-1">ในช่วงเวลานาน</label>
        <input type="number" id="hemoWeightLossDurVal" min="1" max="120"
          class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800"
          placeholder="เช่น 2">
      </div>
      <div>
        <label class="block text-[11px] font-medium text-slate-600 mb-1">หน่วยเวลา</label>
        <select id="hemoWeightLossDurUnit"
          class="w-full bg-white border border-slate-300 rounded-lg px-2 py-2 text-xs font-medium text-slate-800">
          <option value="weeks">สัปดาห์</option>
          <option value="months" selected>เดือน</option>
          <option value="years">ปี</option>
        </select>
      </div>
    </div>
  </div>`
].join('\n');

const HEMO_WARN_SUBS_HTML = [
  `<div id="hemoDyspneaSub" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-3 space-y-2.5">
    <div class="text-xs font-semibold text-slate-700">ระดับอาการเหนื่อยหอบ</div>
    ${renderHemoGrid('grid-cols-1 sm:grid-cols-2', [
      { kind: 'radio', name: 'hemoDyspnea', value: 'dyspnea_exertional', title: ['เหนื่อยเวลา', 'ออกแรง / เดิน'] },
      { kind: 'radio', name: 'hemoDyspnea', value: 'dyspnea_severe_rest_orthopnea', title: ['เหนื่อยรุนแรงขณะพัก', '/ นอนราบไม่ได้'] }
    ], { compact: true })}
  </div>`,
  `<div id="hemoChestPainSub" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-3 space-y-3">
    <div>
      <span class="text-xs font-semibold text-slate-700 block mb-2">ลักษณะอาการเจ็บหน้าอก (เลือกได้หลายข้อ):</span>
      ${renderHemoGrid('grid-cols-1 sm:grid-cols-2', [
        { name: 'hemoChestPainType', value: 'pleuritic_sharp', title: ['เจ็บแปล๊บเวลา', 'หายใจลึก / ไอ'], onchange: 'handleHemoWarnItemChange(this)' },
        { name: 'hemoChestPainType', value: 'ischemic_pressure', title: ['เจ็บแน่นอึดอัด', 'กลางหน้าอก'], onchange: 'handleHemoWarnItemChange(this)' },
        { name: 'hemoChestPainType', value: 'tearing_ripping_back', title: ['เจ็บเหมือนฉีกขาด', 'ร้าวทะลุหลัง'], onchange: 'handleHemoWarnItemChange(this)', colSpan2: true }
      ], { compact: true })}
    </div>
    ${HEMO_PAIN_SCALE_HTML}
  </div>`,
  `<div id="hemoWarningSyncopeSub" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-3 space-y-2.5">
    <div class="text-xs font-semibold text-slate-700">อาการหน้ามืด วูบ หรือใจสั่นเหงื่อแตก (เลือกได้หลายข้อ)</div>
    ${renderHemoGrid('grid-cols-1 sm:grid-cols-2', [
      { name: 'hemoWarningSigns', value: 'warn_fainting_syncope', title: ['หน้ามืด / วูบ', 'หรือหมดสติ'], onchange: 'handleHemoWarnItemChange(this)' },
      { name: 'hemoWarningSigns', value: 'warn_profuse_sweat_cold_shock', title: ['เหงื่อแตกตัวเย็น /', 'ซีดสั่น'], onchange: 'handleHemoWarnItemChange(this)' },
      { name: 'hemoWarningSigns', value: 'warn_palpitation_tachycardia', title: ['ใจสั่น /', 'หัวใจเต้นรัว'], onchange: 'handleHemoWarnItemChange(this)', colSpan2: true }
    ], { compact: true })}
  </div>`,
  `<div id="hemoWarningDvtPeSub" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-3 space-y-2.5">
    <div class="text-xs font-semibold text-slate-700">อาการที่ขาและการอยู่นิ่งๆ / เดินทางไกล (เลือกได้หลายข้อ)</div>
    ${renderHemoGrid('grid-cols-1 sm:grid-cols-2', [
      { name: 'hemoWarningSigns', value: 'warn_unilateral_leg_swelling', title: ['ขาบวมโต /', 'ปวดตึงน่องข้างเดียว'], onchange: 'handleHemoWarnItemChange(this)' },
      { name: 'hemoWarningSigns', value: 'warn_bilateral_leg_swelling', title: ['ขาบวม 2 ข้าง'], onchange: 'handleHemoWarnItemChange(this)' },
      { name: 'hemoWarningSigns', value: 'warn_long_travel_immobility', title: ['นั่งเดินทางไกลเกิน', '4–6 ชั่วโมง'], onchange: 'handleHemoWarnItemChange(this)' },
      { name: 'hemoWarningSigns', value: 'warn_post_op_bedridden', title: ['เพิ่งผ่าตัดใหญ่ /', 'นอนติดเตียง', 'เกิน 3 วัน'], onchange: 'handleHemoWarnItemChange(this)' },
      { name: 'hemoWarningSigns', value: 'warn_history_dvt_pe', title: ['เคยมีลิ่มเลือด', 'อุดตันที่แขนหรือขา'], onchange: 'handleHemoWarnItemChange(this)', colSpan2: true }
    ], { compact: true })}
  </div>`
].join('\n');

// =========================================================================
// MODULE DEFINITION
// =========================================================================
const hemoptysisModule = {
  id: 'hemoptysis',
  schemaCode: 'hemoptysis',
  recordCc: 'hemoptysis',
  titleTh: 'ไอเป็นเลือด',
  titleEn: 'Hemoptysis / Coughing up blood',
  icon: 'droplet',
  sectionDomId: 'hemoptysisQuestionnaireSection',
  doctorCcBadgeHtml: '<i data-lucide="droplet" class="w-3.5 h-3.5 mr-1 text-rose-500"></i> CC: ไอเป็นเลือด (Hemoptysis)',
  pmhSectionNumber: 5,
  getPmhSectionNumber: () => 5,
  dateFields: [],
  timeFields: [],
  branchIds: [
    'hemoPreCoughSub',
    'hemoPriorSputumSub',
    'hemoWarningFeverSub',
    'hemoWeightLossSub',
    'hemoDyspneaSub',
    'hemoChestPainSub',
    'hemoWarningSyncopeSub',
    'hemoWarningDvtPeSub',
    'hemoSmokingSub'
  ],
  inputIdsToClear: [
    'hemoDurationVal',
    'hemoPreCoughDurVal',
    'hemoWeightLossKg',
    'hemoWeightLossDurVal',
    'hemoSmokingYears',
    'hemoSmokingPacks',
    'hemoptysis_other_free'
  ],

  algorithm: {
    chiefComplaint: 'hemoptysis',
    titleTh: 'ไอเป็นเลือด',
    schemaCode: 'hemoptysis',
    version: '2.0.0',
    redFlagDefinitions: [
      { key: 'rf_massive_asphyxiation', level: 1, textTh: 'Massive Hemoptysis with Impending Asphyxiation / เสี่ยงทางเดินหายใจอุดกั้นเฉียบพลัน' },
      { key: 'rf_hemodynamic_shock', level: 1, textTh: 'Hemodynamic Instability / Hypovolemic Shock (สัญญาณชีพไม่คงที่/เสี่ยงภาวะช็อกจากการเสียเลือด)' },
      { key: 'rf_respiratory_failure', level: 1, textTh: 'Acute Respiratory Failure / หายใจหอบเหนื่อยรุนแรงเฉียบพลัน (SpO2 < 90%)' },
      { key: 'rf_aortic_dissection_chest', level: 1, textTh: 'Suspected Thoracic Aortic Dissection / สงสัยหลอดเลือดเอออร์ตาฉีกขาดร้าวทะลุหลัง' },
      { key: 'rf_suspected_pe_dvt', level: 2, textTh: 'Suspected Pulmonary Embolism (PE) with Infarction / สงสัยลิ่มเลือดอุดกั้นปอด' },
      { key: 'rf_submassive_active', level: 2, textTh: 'Submassive Hemoptysis with Active Bleeding / ไอเลือดสดปานกลางและยังมีเลือดออกต่อเนื่อง' },
      { key: 'rf_cavitary_tb', level: 2, textTh: 'Suspected Active Cavitary Pulmonary Tuberculosis (TB) / สงสัยวัณโรคปอดระยะลุกลาม' },
      { key: 'rf_anticoagulant_bleeding', level: 2, textTh: 'Anticoagulant-Associated Hemoptysis / ภาวะเลือดออกจากยาต้านการแข็งตัวของเลือด' },
      { key: 'rf_necrotizing_abscess', level: 2, textTh: 'Necrotizing Pneumonia / Lung Abscess / สงสัยปอดอักเสบเนื้อตายหรือฝีในปอด' },
      { key: 'rf_lung_malignancy', level: 3, textTh: 'Suspected Bronchogenic Carcinoma (Lung Cancer) / สงสัยโรคมะเร็งปอด' }
    ]
  },

  formHtml: `
    <div id="hemoptysisQuestionnaireSection" class="hidden space-y-6">
      <div data-cc-top-banner="hemoptysis">
        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
          <div class="bg-amber-100 text-amber-800 p-2.5 rounded-xl flex-shrink-0 mt-0.5">
            <i data-lucide="alert-circle" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-amber-900 mb-1">คำแนะนำเบื้องต้นและป้องกันการแพร่กระจายเชื้อระหว่างรอตรวจ</h3>
            <p class="text-xs text-amber-800 leading-relaxed">
              กรุณานั่งพักนิ่งๆ หลีกเลี่ยงการไอหรือขากแรงๆ <strong>สวมหน้ากากอนามัยตลอดเวลา</strong> และเก็บภาชนะหรือทิชชูเปื้อนเลือดไว้ให้แพทย์ประเมินปริมาณ หากไอเลือดสดมาก สำลักเลือด หอบเหนื่อย หรือหน้ามืดวูบ กรุณาแจ้งพยาบาลทันที
            </p>
          </div>
        </div>
      </div>

      <!-- CARD 1: ระยะเวลา ลักษณะ และปริมาณเลือดที่ไอออก -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="droplet" class="w-5 h-5"></i>
          </div>
          <h2 class="text-base font-bold text-slate-900">1. ระยะเวลา ลักษณะ และปริมาณเลือดที่ไอออก</h2>
        </div>

        <div class="space-y-4">
          <div>
            ${renderHemoSysHeader({
              label: '1.1 ระยะเวลาที่เริ่มมีอาการไอเป็นเลือด',
              icon: 'clock',
              colorClass: 'bg-sky-100 text-sky-700'
            })}
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div class="col-span-1 sm:col-span-2">
                <input type="number" id="hemoDurationVal" min="1" max="1000" placeholder="ระบุตัวเลข เช่น 2"
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm placeholder:text-slate-400 placeholder:font-normal">
              </div>
              <div class="col-span-1">
                <select id="hemoDurationUnit"
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm">
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

          <div class="pt-4 border-t border-slate-100">
            ${renderHemoSysHeader({
              label: '1.2 ลักษณะของเลือดที่ออกมา',
              icon: 'droplet',
              colorClass: 'bg-sky-100 text-sky-700'
            })}
            ${renderHemoGrid('grid-cols-1 sm:grid-cols-2', [
              { kind: 'radio', name: 'hemoBloodChar', value: 'char_true_frothy_red', title: ['เลือดสดสีแดง', 'หรือมีฟองปน'] },
              { kind: 'radio', name: 'hemoBloodChar', value: 'char_streaked_sputum', title: ['เสมหะปนเลือด', 'เป็นเส้นๆ'], desc: 'มีเส้นสีแดงเรื่อๆ หรือสีน้ำตาลปนในก้อนเสมหะ' },
              { kind: 'radio', name: 'hemoBloodChar', value: 'char_coffee_ground_vomit', title: ['ขย้อนสีกาแฟ /', 'มีเศษอาหาร'] },
              { kind: 'radio', name: 'hemoBloodChar', value: 'char_postnasal_epistaxis', title: ['เลือดกำเดา', 'ไหลลงคอ'] }
            ])}
          </div>

          <div class="pt-4 border-t border-slate-100">
            ${renderHemoSysHeader({
              label: '1.3 ปริมาณเลือดในครั้งที่ออกมากที่สุด',
              icon: 'gauge',
              colorClass: 'bg-sky-100 text-sky-700'
            })}
            ${renderHemoGrid('grid-cols-1 sm:grid-cols-2', [
              { kind: 'radio', name: 'hemoBloodVolume', value: 'vol_streaks_sputum', title: ['เป็นเส้นปนเสมหะ', 'เล็กน้อย'], desc: 'น้อยกว่า 1 ช้อนชา' },
              { kind: 'radio', name: 'hemoBloodVolume', value: 'vol_tablespoon', title: ['ประมาณ 1–2 ช้อนโต๊ะ'], desc: 'ประมาณ 10–30 มล.' },
              { kind: 'radio', name: 'hemoBloodVolume', value: 'vol_half_to_full_cup', title: ['ครึ่งแก้ว –', 'เต็มแก้วน้ำ'], desc: 'ประมาณ 50–100 มล.' },
              { kind: 'radio', name: 'hemoBloodVolume', value: 'vol_massive_over_cup', title: ['ทะลักเกิน 1 แก้ว /', 'ลิ่มเลือดมาก'], desc: 'มากกว่า 100–200 มล.' }
            ])}
          </div>

          <div class="pt-4 border-t border-slate-100">
            ${renderHemoSysHeader({
              label: '1.4 จำนวนครั้งที่ไอเป็นเลือด',
              icon: 'repeat',
              colorClass: 'bg-sky-100 text-sky-700'
            })}
            ${renderHemoGrid('grid-cols-1 sm:grid-cols-2', [
              { kind: 'radio', name: 'hemoEpisodeCount', value: 'episodes_single', title: ['ครั้งเดียว', 'แล้วหยุด'] },
              { kind: 'radio', name: 'hemoEpisodeCount', value: 'episodes_two_four', title: ['2–4 ครั้ง'] },
              { kind: 'radio', name: 'hemoEpisodeCount', value: 'episodes_over_5', title: ['มากกว่า', '5 ครั้งขึ้นไป'] },
              { kind: 'radio', name: 'hemoEpisodeCount', value: 'episodes_frequent_continuous', title: ['ไอเป็นเลือด', 'ต่อเนื่องตลอด'] }
            ])}
          </div>

          <div class="pt-4 border-t border-slate-100">
            ${renderHemoSysHeader({
              label: '1.5 สถานะการมีเลือดออกในขณะนี้',
              icon: 'activity',
              colorClass: 'bg-sky-100 text-sky-700'
            })}
            ${renderHemoGrid('grid-cols-1 sm:grid-cols-2', [
              { kind: 'radio', name: 'hemoActiveStatus', value: 'status_active_bleeding', title: ['ยังไอเป็น', 'เลือดสดอยู่'] },
              { kind: 'radio', name: 'hemoActiveStatus', value: 'status_streaks_only', title: ['เหลือเสมหะ', 'ปนเลือดจางๆ'] },
              { kind: 'radio', name: 'hemoActiveStatus', value: 'status_stopped_completely', title: ['เลือดหยุดสนิทแล้ว'], colSpan2: true }
            ])}
          </div>
        </div>
      </div>

      <!-- CARD 2: อาการนำก่อนไอเป็นเลือด -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="wind" class="w-5 h-5"></i>
          </div>
          <h2 class="text-base font-bold text-slate-900">2. อาการนำก่อนไอเป็นเลือด</h2>
        </div>

        <div>
          ${renderHemoSysHeader({
            label: 'อาการนำก่อนไอเป็นเลือด (เลือกได้หลายข้อ)',
            icon: 'history',
            colorClass: 'bg-teal-100 text-teal-700',
            toggleId: 'hemo_prodrome_none',
            toggleLabel: 'ไม่มีอาการนำเหล่านี้',
            toggleOnchange: 'handleHemoProdromeNoneToggle(this)'
          })}
          ${renderHemoGrid('grid-cols-1 sm:grid-cols-2', [
            { id: 'hemoPreCoughParent', title: ['ไอเรื้อรัง', 'นำมาก่อน'], onchange: 'toggleHemoPreCoughSub(this.checked)' },
            { id: 'hemoPriorSputumParent', title: ['มีเสมหะ', 'นำมาก่อน'], onchange: 'toggleHemoPriorSputumSub(this.checked)' },
            { id: 'hemoWarningFeverParent', title: ['มีไข้ / เหงื่อออก', 'กลางคืน'], onchange: `toggleHemoProdromeGroup('hemoWarningFeverSub', this.checked)` },
            { id: 'hemoWeightLossParent', title: ['น้ำหนักลด /', 'เบื่ออาหาร'], onchange: `toggleHemoProdromeGroup('hemoWeightLossSub', this.checked)` },
            { name: 'hemoWarningSigns', value: 'warn_hoarseness_weeks', title: ['เสียงแหบต่อเนื่อง', 'หลายสัปดาห์'], onchange: 'handleHemoProdromeItemChange(this)', colSpan2: true }
          ])}
          ${HEMO_PRODROME_SUBS_HTML}
        </div>
      </div>

      <!-- CARD 3: อาการผิดปกติร่วมในขณะนี้และสัญญาณเตือนสำคัญ -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="shield-alert" class="w-5 h-5"></i>
          </div>
          <h2 class="text-base font-bold text-slate-900">3. อาการผิดปกติร่วมในขณะนี้และสัญญาณเตือนสำคัญ</h2>
        </div>

        <div>
          ${renderHemoSysHeader({
            label: 'อาการผิดปกติร่วมในขณะนี้ (เลือกได้หลายข้อ)',
            icon: 'alert-triangle',
            colorClass: 'bg-amber-100 text-amber-700',
            toggleId: 'hemo_warn_none',
            toggleLabel: 'ไม่มีอาการในหมวดนี้',
            toggleOnchange: 'handleHemoWarnNoneToggle(this)'
          })}
          ${renderHemoGrid('grid-cols-1 sm:grid-cols-2', [
            { id: 'hemoDyspneaParent', title: ['เหนื่อยหอบ /', 'หายใจลำบาก'], onchange: 'toggleHemoDyspneaSub(this.checked)' },
            { name: 'hemoWarningSigns', value: 'warn_choking_airway_threat', title: ['ไอสำลักเลือด /', 'หายใจติดขัด'], onchange: 'handleHemoWarnItemChange(this)' },
            { id: 'hemoChestPainParent', title: ['เจ็บหน้าอก /', 'แน่นหน้าอก'], onchange: 'toggleHemoChestPainSub(this.checked)' },
            { id: 'hemoWarningSyncopeParent', title: ['หน้ามืด วูบ /', 'ใจสั่นเหงื่อแตก'], onchange: `toggleHemoWarningGroup('hemoWarningSyncopeSub', this.checked)` },
            { id: 'hemoWarningDvtPeParent', title: ['ขาบวมปวดน่อง /', 'เดินทางไกล /', 'ติดเตียง'], onchange: `toggleHemoWarningGroup('hemoWarningDvtPeSub', this.checked)`, colSpan2: true }
          ])}
          ${HEMO_WARN_SUBS_HTML}
        </div>
      </div>

      <!-- CARD 4: ประวัติโรคปอด การสูบบุหรี่ และยาที่มีผลต่อเลือดออก -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="file-text" class="w-5 h-5"></i>
          </div>
          <h2 class="text-base font-bold text-slate-900">4. ประวัติโรคปอด การสูบบุหรี่ และยาที่มีผลต่อเลือดออก</h2>
        </div>

        <div class="space-y-4">
          <div>
            ${renderHemoSysHeader({
              label: '4.1 ประวัติโรคทางเดินหายใจและหัวใจเดิม (เลือกได้หลายข้อ)',
              icon: 'heart-pulse',
              colorClass: 'bg-sky-100 text-sky-700',
              toggleId: 'hemo_pulm_none',
              toggleName: 'hemoPastPulmonary',
              toggleValue: 'pulm_none',
              toggleLabel: 'ไม่มีประวัติในหมวดนี้',
              toggleOnchange: 'handleHemoPulmChange(this)'
            })}
            ${renderHemoGrid('grid-cols-1 sm:grid-cols-2', [
              { name: 'hemoPastPulmonary', value: 'tb_prior_or_contact', title: ['เคยป่วย /', 'สัมผัสผู้ป่วยวัณโรค'], onchange: 'handleHemoPulmChange(this)' },
              { name: 'hemoPastPulmonary', value: 'past_copd_asthma', title: ['โรคถุงลมโป่งพอง /', 'หอบหืด /', 'โรคปอดเรื้อรัง'], onchange: 'handleHemoPulmChange(this)' },
              { name: 'hemoPastPulmonary', value: 'past_lung_cancer', title: ['โรคมะเร็งปอด /', 'มะเร็งอื่น'], onchange: 'handleHemoPulmChange(this)' },
              { name: 'hemoPastPulmonary', value: 'past_heart_failure_valvular', title: ['โรคหัวใจ /', 'ลิ้นหัวใจตีบ'], onchange: 'handleHemoPulmChange(this)' }
            ])}
          </div>

          <div class="pt-4 border-t border-slate-100">
            ${renderHemoSysHeader({
              label: '4.2 ประวัติการสูบบุหรี่',
              icon: 'flame',
              colorClass: 'bg-amber-100 text-amber-700'
            })}
            ${renderHemoGrid('grid-cols-1 sm:grid-cols-3', [
              { kind: 'radio', name: 'hemoSmokingStatus', value: 'smoking_regular', title: ['สูบบุหรี่ประจำ'], onchange: 'toggleHemoSmokingSub(true)' },
              { kind: 'radio', name: 'hemoSmokingStatus', value: 'smoking_quit', title: ['เคยสูบ', 'แต่เลิกแล้ว'], onchange: 'toggleHemoSmokingSub(false)' },
              { kind: 'radio', name: 'hemoSmokingStatus', value: 'smoking_never', title: ['ไม่เคยสูบบุหรี่'], onchange: 'toggleHemoSmokingSub(false)' }
            ])}
            <div id="hemoSmokingSub" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label class="block font-medium text-slate-700 mb-1">สูบมานานกี่ปี?</label>
                <input type="number" id="hemoSmokingYears" min="1" max="80"
                  class="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs"
                  placeholder="เช่น 20">
              </div>
              <div>
                <label class="block font-medium text-slate-700 mb-1">เฉลี่ยวันละกี่ซอง?</label>
                <input type="number" step="0.5" id="hemoSmokingPacks" min="0.1" max="10"
                  class="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs"
                  placeholder="เช่น 1">
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100">
            ${renderHemoSysHeader({
              label: '4.3 ยาที่มีผลต่อการแข็งตัวของเลือด (เลือกได้หลายข้อ)',
              icon: 'pill',
              colorClass: 'bg-indigo-100 text-indigo-700',
              toggleId: 'hemo_meds_none',
              toggleName: 'hemoBleedingMeds',
              toggleValue: 'meds_none',
              toggleLabel: 'ไม่มีประวัติในหมวดนี้',
              toggleOnchange: 'handleHemoMedChange(this)'
            })}
            ${renderHemoGrid('grid-cols-1 sm:grid-cols-2', [
              { name: 'hemoBleedingMeds', value: 'med_anticoagulant', title: ['ยาละลายลิ่มเลือด'], desc: 'เช่น Warfarin, Eliquis, Xarelto, Pradaxa', onchange: 'handleHemoMedChange(this)' },
              { name: 'hemoBleedingMeds', value: 'med_antiplatelet', title: ['ยาต้านเกล็ดเลือด'], desc: 'เช่น Aspirin, Clopidogrel, Plavix', onchange: 'handleHemoMedChange(this)' },
              { name: 'hemoBleedingMeds', value: 'med_unknown_prescribed', title: ['มียาโรคหัวใจ /', 'หลอดเลือด', 'ไม่ทราบชื่อยา'], onchange: 'handleHemoMedChange(this)', colSpan2: true }
            ])}
          </div>
        </div>
      </div>

      <!-- อาการอื่นๆ เป็นช่องกรอกอิสระ -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100">
          <div class="bg-slate-100 text-slate-600 p-2 rounded-xl"><i data-lucide="message-square-plus" class="w-5 h-5"></i></div>
          <h2 class="text-base font-bold text-slate-800">อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2>
        </div>
        <textarea id="hemoptysis_other_free" rows="2" placeholder="พิมพ์ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)..."
          class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"></textarea>
      </div>
    </div>
  `,

  // --- Lifecycle Hooks ---
  init: function() {
    if (typeof lucide !== 'undefined') lucide.createIcons();
    clearHemoPainScore();
  },
  onSelectForm: function() {},
  onActivate: function() {},
  onTitleChange: function() {},

  collectIntake: function(ctx) {
    ctx = ctx || {};
    const rawDur = parseInt(getHemoEl('hemoDurationVal')?.value, 10);
    const durVal = (!isNaN(rawDur) && rawDur > 0) ? rawDur : null;
    const durUnit = getHemoEl('hemoDurationUnit')?.value || 'hours';

    const getRadio = (name) => {
      const el = queryHemoOne(`input[name="${name}"]:checked`);
      return el ? el.value : null;
    };
    const getChecks = (name) => queryHemoAll(`input[name="${name}"]:checked`).map(el => el.value);

    const hemoBloodChar = getRadio('hemoBloodChar');
    const hemoBloodVolume = getRadio('hemoBloodVolume');
    const hemoEpisodeCount = getRadio('hemoEpisodeCount');
    const hemoActiveStatus = getRadio('hemoActiveStatus');
    const hemoProdromeNoneChecked = !!getHemoEl('hemo_prodrome_none')?.checked;
    const preCoughParentChecked = !!getHemoEl('hemoPreCoughParent')?.checked;
    const hemoPriorSputumParent = !!getHemoEl('hemoPriorSputumParent')?.checked;
    const feverParentChecked = !!getHemoEl('hemoWarningFeverParent')?.checked;
    const weightLossParentChecked = !!getHemoEl('hemoWeightLossParent')?.checked;

    const hemoPreCoughMaster = preCoughParentChecked ? 'yes' : (hemoProdromeNoneChecked ? 'no' : '');
    const rawPreDur = parseInt(getHemoEl('hemoPreCoughDurVal')?.value, 10);
    const hemoPreCoughDurVal = (hemoPreCoughMaster === 'yes' && !isNaN(rawPreDur) && rawPreDur > 0) ? rawPreDur : null;
    const hemoPreCoughDurUnit = getHemoEl('hemoPreCoughDurUnit')?.value || 'weeks';

    const selectedPriorSputum = hemoPriorSputumParent ? getRadio('hemoPriorSputum') : null;
    const hemoPriorSputum = selectedPriorSputum || ((hemoProdromeNoneChecked || (hemoPreCoughMaster === 'yes' && !hemoPriorSputumParent)) ? 'sputum_none_dry_cough' : null);

    const rawWlKg = parseFloat(getHemoEl('hemoWeightLossKg')?.value);
    const rawWlDur = parseInt(getHemoEl('hemoWeightLossDurVal')?.value, 10);
    const hemoWeightLossKg = (weightLossParentChecked && !isNaN(rawWlKg) && rawWlKg > 0) ? rawWlKg : null;
    const hemoWeightLossDurVal = (weightLossParentChecked && !isNaN(rawWlDur) && rawWlDur > 0) ? rawWlDur : null;
    const hemoWeightLossDurUnit = getHemoEl('hemoWeightLossDurUnit')?.value || 'months';

    const hemoWarnNoneChecked = !!getHemoEl('hemo_warn_none')?.checked;
    const hemoDyspneaParent = !!getHemoEl('hemoDyspneaParent')?.checked;
    const chestPainParentChecked = !!getHemoEl('hemoChestPainParent')?.checked;
    const syncopeParentChecked = !!getHemoEl('hemoWarningSyncopeParent')?.checked;
    const dvtParentChecked = !!getHemoEl('hemoWarningDvtPeParent')?.checked;

    const selectedDyspnea = hemoDyspneaParent ? getRadio('hemoDyspnea') : null;
    const hemoDyspnea = selectedDyspnea || (hemoWarnNoneChecked ? 'dyspnea_none' : null);

    const hemoChestPainMaster = chestPainParentChecked ? 'yes' : (hemoWarnNoneChecked ? 'no' : '');
    const hemoChestPainType = hemoChestPainMaster === 'yes' ? getChecks('hemoChestPainType') : [];
    const painScore = (hemoChestPainMaster === 'yes' && hemoPainScoreTouched)
      ? parseInt(getHemoEl('hemoPainScore')?.value || '0', 10)
      : null;

    const rawWarnChecks = getChecks('hemoWarningSigns');
    const hemoWarningSigns = [...rawWarnChecks];
    if (weightLossParentChecked && !hemoWarningSigns.includes('warn_unintentional_weight_loss')) {
      hemoWarningSigns.push('warn_unintentional_weight_loss');
    }

    const hemoProdromeParents = { fever: feverParentChecked, weightLoss: weightLossParentChecked };
    const hemoWarnParents = { syncope: syncopeParentChecked, dvtPe: dvtParentChecked };

    const card2Active = preCoughParentChecked || hemoPriorSputumParent || feverParentChecked || weightLossParentChecked ||
      rawWarnChecks.some(w => ['warn_low_grade_fever', 'warn_high_fever', 'warn_chills', 'warn_high_fever_chills', 'warn_fever_afternoon_night_sweat', 'warn_hoarseness_weeks'].includes(w));
    const card3Active = hemoDyspneaParent || chestPainParentChecked || syncopeParentChecked || dvtParentChecked ||
      rawWarnChecks.some(w => ['warn_choking_airway_threat', 'warn_fainting_syncope', 'warn_profuse_sweat_cold_shock', 'warn_palpitation_tachycardia', 'warn_unilateral_leg_swelling', 'warn_bilateral_leg_swelling', 'warn_long_travel_immobility', 'warn_post_op_bedridden', 'warn_history_dvt_pe'].includes(w));

    const hemoProdromeNone = hemoProdromeNoneChecked && !card2Active;
    const hemoWarnNone = hemoWarnNoneChecked && !card3Active;

    const hemoPastPulmonary = getChecks('hemoPastPulmonary');
    const hemoSmokingStatus = getRadio('hemoSmokingStatus') || '';
    const rawSmokeYrs = parseInt(getHemoEl('hemoSmokingYears')?.value, 10);
    const rawSmokePks = parseFloat(getHemoEl('hemoSmokingPacks')?.value);
    const hemoSmokingYears = (hemoSmokingStatus === 'smoking_regular' && !isNaN(rawSmokeYrs) && rawSmokeYrs > 0) ? rawSmokeYrs : null;
    const hemoSmokingPacks = (hemoSmokingStatus === 'smoking_regular' && !isNaN(rawSmokePks) && rawSmokePks > 0) ? rawSmokePks : null;
    const hemoBleedingMeds = getChecks('hemoBleedingMeds');
    const otherSymptomsFree = getHemoEl('hemoptysis_other_free')?.value?.trim() || ctx.otherSymptomsFree || '';

    const rec = {
      id: ctx.recordId || ctx.id || `case-${Date.now()}`,
      queue_number: ctx.queueNumber || ctx.queue_number || 'ER-NEW',
      hn: ctx.randomHn || ctx.hn || '-',
      name: ctx.patientName || ctx.name || 'ไม่ระบุชื่อ',
      age: ctx.patientAge !== undefined ? ctx.patientAge : (ctx.age !== undefined ? ctx.age : 'ไม่ได้ระบุ'),
      gender: ctx.gender || 'ไม่ระบุ',
      chief_complaint: 'hemoptysis',
      chief_complaint_title: 'ไอเป็นเลือด',
      timestamp: new Date().toISOString(),
      status: ctx.recordStatus || ctx.status || 'waiting',
      durationVal: durVal,
      durationUnit: durUnit,
      hospRecordStatus: ctx.hospRecordStatus || 'unspecified',
      underlying: Array.isArray(ctx.underlying) ? ctx.underlying : [],
      drugAllergy: ctx.drugAllergy || 'ไม่ได้ระบุ',
      currentMeds: ctx.currentMeds || 'ไม่ได้ระบุ',
      otherSymptomsFree,
      doctor_notes: ctx.preservedDoctorNotes || ctx.doctor_notes || { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      hemoBloodChar,
      hemoBloodVolume,
      hemoEpisodeCount,
      hemoActiveStatus,
      hemoPreCoughMaster,
      hemoPreCoughDurVal,
      hemoPreCoughDurUnit,
      hemoPriorSputumParent,
      hemoPriorSputum,
      hemoWeightLossKg,
      hemoWeightLossDurVal,
      hemoWeightLossDurUnit,
      hemoProdromeParents,
      hemoProdromeNone,
      hemoDyspneaParent,
      hemoDyspnea,
      hemoChestPainMaster,
      hemoChestPainType,
      painScore,
      hemoWarningSigns,
      hemoWarnParents,
      hemoWarnNone,
      hemoPastPulmonary,
      hemoSmokingStatus,
      hemoSmokingYears,
      hemoSmokingPacks,
      hemoBleedingMeds
    };

    updateHemoptysisOutputs(rec);
    return rec;
  },

  populateForm: function(patient) {
    if (!patient) return;
    this.resetForm();

    const setVal = (id, val) => {
      const el = getHemoEl(id);
      if (el && val !== undefined && val !== null) el.value = val;
    };
    const setRadio = (name, val) => {
      if (!val) return;
      const el = queryHemoOne(`input[name="${name}"][value="${val}"]`);
      if (el) el.checked = true;
    };
    const setChecks = (name, arr) => {
      if (!Array.isArray(arr)) return;
      arr.forEach(val => {
        const mappedVal = (name === 'hemoPastPulmonary' && val === 'past_bronchiectasis') ? 'past_copd_asthma' : val;
        const el = queryHemoOne(`input[name="${name}"][value="${mappedVal}"]`);
        if (el) el.checked = true;
      });
    };

    setVal('hemoDurationVal', patient.durationVal);
    setVal('hemoDurationUnit', patient.durationUnit || 'hours');

    setRadio('hemoBloodChar', patient.hemoBloodChar);
    setRadio('hemoBloodVolume', patient.hemoBloodVolume);
    setRadio('hemoEpisodeCount', patient.hemoEpisodeCount);
    setRadio('hemoActiveStatus', patient.hemoActiveStatus);

    // Card 2: Prodrome
    const warnSigns = Array.isArray(patient.hemoWarningSigns) ? [...patient.hemoWarningSigns] : [];
    if (warnSigns.includes('warn_high_fever_chills')) {
      if (!warnSigns.includes('warn_high_fever')) warnSigns.push('warn_high_fever');
      if (!warnSigns.includes('warn_chills')) warnSigns.push('warn_chills');
    }
    setChecks('hemoWarningSigns', warnSigns);

    const hasPreCough = patient.hemoPreCoughMaster === 'yes' || !!patient.hemoPreCoughDurVal;
    const preCoughParent = getHemoEl('hemoPreCoughParent');
    if (preCoughParent) preCoughParent.checked = hasPreCough;
    toggleHemoPreCoughSub(hasPreCough);
    setVal('hemoPreCoughDurVal', patient.hemoPreCoughDurVal);
    setVal('hemoPreCoughDurUnit', patient.hemoPreCoughDurUnit || 'weeks');

    const hasPriorSputum = !!patient.hemoPriorSputumParent || (!!patient.hemoPriorSputum && patient.hemoPriorSputum !== 'sputum_none_dry_cough');
    const priorSputumParent = getHemoEl('hemoPriorSputumParent');
    if (priorSputumParent) priorSputumParent.checked = hasPriorSputum;
    toggleHemoPriorSputumSub(hasPriorSputum);
    if (patient.hemoPriorSputum && patient.hemoPriorSputum !== 'sputum_none_dry_cough') {
      setRadio('hemoPriorSputum', patient.hemoPriorSputum);
    }

    const feverKeys = ['warn_low_grade_fever', 'warn_high_fever', 'warn_chills', 'warn_high_fever_chills', 'warn_fever_afternoon_night_sweat'];
    const prodParents = patient.hemoProdromeParents || {};
    const hasFever = !!prodParents.fever || warnSigns.some(w => feverKeys.includes(w));
    const feverParent = getHemoEl('hemoWarningFeverParent');
    if (feverParent) feverParent.checked = hasFever;
    toggleHemoProdromeGroup('hemoWarningFeverSub', hasFever);

    const hasWeightLoss = !!prodParents.weightLoss || warnSigns.includes('warn_unintentional_weight_loss') || !!patient.hemoWeightLossKg || !!patient.hemoWeightLossDurVal;
    const wlParent = getHemoEl('hemoWeightLossParent');
    if (wlParent) wlParent.checked = hasWeightLoss;
    toggleHemoProdromeGroup('hemoWeightLossSub', hasWeightLoss);
    setVal('hemoWeightLossKg', patient.hemoWeightLossKg);
    setVal('hemoWeightLossDurVal', patient.hemoWeightLossDurVal);
    setVal('hemoWeightLossDurUnit', patient.hemoWeightLossDurUnit || 'months');

    const hasHoarseness = warnSigns.includes('warn_hoarseness_weeks');
    if ((patient.hemoProdromeNone || patient.hemoPreCoughMaster === 'no') && !hasPreCough && !hasPriorSputum && !hasFever && !hasWeightLoss && !hasHoarseness) {
      const prodNoneEl = getHemoEl('hemo_prodrome_none');
      if (prodNoneEl) prodNoneEl.checked = true;
    }

    // Card 3: Current Warning & Associated Symptoms
    const hasDyspnea = !!patient.hemoDyspneaParent || (!!patient.hemoDyspnea && patient.hemoDyspnea !== 'dyspnea_none');
    const dyspneaParent = getHemoEl('hemoDyspneaParent');
    if (dyspneaParent) dyspneaParent.checked = hasDyspnea;
    toggleHemoDyspneaSub(hasDyspnea);
    if (patient.hemoDyspnea && patient.hemoDyspnea !== 'dyspnea_none') {
      setRadio('hemoDyspnea', patient.hemoDyspnea);
    }

    const hasChestPain = patient.hemoChestPainMaster === 'yes' || (Array.isArray(patient.hemoChestPainType) && patient.hemoChestPainType.length > 0);
    const chestPainParent = getHemoEl('hemoChestPainParent');
    if (chestPainParent) chestPainParent.checked = hasChestPain;
    toggleHemoChestPainSub(hasChestPain);
    setChecks('hemoChestPainType', patient.hemoChestPainType);

    if (hasChestPain && typeof patient.painScore === 'number' && patient.painScore >= 0) {
      setHemoPainScore(patient.painScore);
    } else {
      clearHemoPainScore();
    }

    const syncopeKeys = ['warn_fainting_syncope', 'warn_profuse_sweat_cold_shock', 'warn_palpitation_tachycardia'];
    const dvtKeys = ['warn_unilateral_leg_swelling', 'warn_bilateral_leg_swelling', 'warn_long_travel_immobility', 'warn_post_op_bedridden', 'warn_history_dvt_pe'];
    const warnParents = patient.hemoWarnParents || {};
    const hasSyncope = !!warnParents.syncope || warnSigns.some(w => syncopeKeys.includes(w));
    const hasDvt = !!warnParents.dvtPe || warnSigns.some(w => dvtKeys.includes(w));

    const syncopeParent = getHemoEl('hemoWarningSyncopeParent');
    if (syncopeParent) syncopeParent.checked = hasSyncope;
    toggleHemoWarningGroup('hemoWarningSyncopeSub', hasSyncope);

    const dvtParent = getHemoEl('hemoWarningDvtPeParent');
    if (dvtParent) dvtParent.checked = hasDvt;
    toggleHemoWarningGroup('hemoWarningDvtPeSub', hasDvt);

    const hasCard3Sign = warnSigns.some(w => ['warn_choking_airway_threat', ...syncopeKeys, ...dvtKeys].includes(w));
    if (patient.hemoWarnNone && !hasDyspnea && !hasChestPain && !hasSyncope && !hasDvt && !hasCard3Sign) {
      const warnNoneEl = getHemoEl('hemo_warn_none');
      if (warnNoneEl) warnNoneEl.checked = true;
    }

    setChecks('hemoPastPulmonary', patient.hemoPastPulmonary);
    setRadio('hemoSmokingStatus', patient.hemoSmokingStatus);
    toggleHemoSmokingSub(patient.hemoSmokingStatus === 'smoking_regular');
    setVal('hemoSmokingYears', patient.hemoSmokingYears);
    setVal('hemoSmokingPacks', patient.hemoSmokingPacks);

    setChecks('hemoBleedingMeds', patient.hemoBleedingMeds);
    const otherFreeEl = getHemoEl('hemoptysis_other_free');
    if (otherFreeEl) otherFreeEl.value = patient.otherSymptomsFree || '';
  },

  resetForm: function() {
    this.inputIdsToClear.forEach(id => {
      const el = getHemoEl(id);
      if (el) el.value = '';
    });

    const durUnit = getHemoEl('hemoDurationUnit');
    if (durUnit) durUnit.value = 'hours';
    const preUnit = getHemoEl('hemoPreCoughDurUnit');
    if (preUnit) preUnit.value = 'weeks';
    const wlUnit = getHemoEl('hemoWeightLossDurUnit');
    if (wlUnit) wlUnit.value = 'months';

    [
      'hemoBloodChar', 'hemoBloodVolume', 'hemoEpisodeCount', 'hemoActiveStatus',
      'hemoPriorSputum', 'hemoDyspnea', 'hemoSmokingStatus'
    ].forEach(name => {
      queryHemoAll(`input[name="${name}"]`).forEach(r => { r.checked = false; });
    });

    ['hemoChestPainType', 'hemoWarningSigns', 'hemoPastPulmonary', 'hemoBleedingMeds'].forEach(name => {
      queryHemoAll(`input[name="${name}"]`).forEach(cb => { cb.checked = false; });
    });

    [
      'hemo_prodrome_none',
      'hemoPreCoughParent',
      'hemoPriorSputumParent',
      'hemoWarningFeverParent',
      'hemoWeightLossParent',
      'hemo_warn_none',
      'hemoDyspneaParent',
      'hemoChestPainParent',
      'hemoWarningSyncopeParent',
      'hemoWarningDvtPeParent',
      'hemo_pulm_none',
      'hemo_meds_none'
    ].forEach(id => {
      const el = getHemoEl(id);
      if (el) el.checked = false;
    });

    this.branchIds.forEach(id => {
      const el = getHemoEl(id);
      if (el) el.classList.add('hidden');
    });

    clearHemoPainScore();
  },

  clearForm: function() {
    this.resetForm();
  },

  hydrateForm: function(patient) {
    this.populateForm(patient);
  },
  isRedFlag: function(patient) {
    return evaluateHemoptysisRedFlags(patient).length > 0;
  },
  updateOutputs: updateHemoptysisOutputs,
  renderRapidHpi: renderHemoptysisRapidHpi,
  renderNarrative: renderHemoptysisNarrative,
  renderDoctorHpi: renderHemoptysisDoctorHpi,
  evaluateRedFlags: evaluateHemoptysisRedFlags,

  // --- Seed Patients Registry ---
  seedPatients: [
    // Case 1: Massive Hemoptysis & Shock (ESI 1)
    {
      id: 'case-hemo-01',
      queue_number: 'E1-101',
      hn: '7890101',
      name: 'นายบุญช่วย สำลักโลหิต',
      age: 58,
      gender: 'ชาย',
      chief_complaint: 'hemoptysis',
      chief_complaint_title: 'ไอเป็นเลือด',
      timestamp: '2026-11-03T09:15:00.000Z',
      status: 'waiting',
      durationVal: 2,
      durationUnit: 'hours',
      hospRecordStatus: 'complete',
      underlying: ['ความดันโลหิตสูง'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Amlodipine (5 mg) 1 tab od pc',
      otherSymptomsFree: 'ไอสำลักเลือดสดทะลักพุ่งต่อเนื่อง หน้ามืด วูบ ตัวสั่น เหงื่อแตกท่วมตัว',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.5, sbp: 85, dbp: 50, bp: '85/50', pr: 124, rr: 26, spo2: 88 },
      esi_level: 1,

      hemoBloodChar: 'char_true_frothy_red',
      hemoBloodVolume: 'vol_massive_over_cup',
      hemoEpisodeCount: 'episodes_frequent_continuous',
      hemoActiveStatus: 'status_active_bleeding',
      hemoPreCoughMaster: 'no',
      hemoPriorSputum: 'sputum_none_dry_cough',
      hemoProdromeNone: true,
      hemoDyspneaParent: true,
      hemoDyspnea: 'dyspnea_severe_rest_orthopnea',
      hemoChestPainMaster: 'no',
      hemoChestPainType: [],
      hemoWarningSigns: ['warn_choking_airway_threat', 'warn_fainting_syncope', 'warn_profuse_sweat_cold_shock'],
      hemoWarnNone: false,
      hemoPastPulmonary: ['pulm_none'],
      hemoSmokingStatus: 'smoking_quit',
      hemoBleedingMeds: ['meds_none']
    },

    // Case 2: Pulmonary Embolism with DVT (ESI 2)
    {
      id: 'case-hemo-02',
      queue_number: 'E2-102',
      hn: '7890102',
      name: 'น.ส.วิภาภรณ์ แน่นอกเฉียบพลัน',
      age: 42,
      gender: 'หญิง',
      chief_complaint: 'hemoptysis',
      chief_complaint_title: 'ไอเป็นเลือด',
      timestamp: '2026-11-03T10:00:00.000Z',
      status: 'waiting',
      durationVal: 6,
      durationUnit: 'hours',
      hospRecordStatus: 'complete',
      underlying: [],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'ไม่มี',
      otherSymptomsFree: 'ไอเป็นเลือดสด เจ็บแปล๊บหน้าอกเวลาหายใจลึก น่องซ้ายบวมตึงมาก เพิ่งบินกลับจากต่างประเทศ',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 37.0, sbp: 125, dbp: 80, bp: '125/80', pr: 108, rr: 22, spo2: 94 },
      esi_level: 2,

      hemoBloodChar: 'char_true_frothy_red',
      hemoBloodVolume: 'vol_tablespoon',
      hemoEpisodeCount: 'episodes_two_four',
      hemoActiveStatus: 'status_active_bleeding',
      hemoPreCoughMaster: 'no',
      hemoPriorSputum: 'sputum_none_dry_cough',
      hemoProdromeNone: true,
      hemoDyspneaParent: true,
      hemoDyspnea: 'dyspnea_exertional',
      hemoChestPainMaster: 'yes',
      hemoChestPainType: ['pleuritic_sharp'],
      painScore: 7,
      hemoWarningSigns: ['warn_unilateral_leg_swelling', 'warn_long_travel_immobility'],
      hemoWarnNone: false,
      hemoPastPulmonary: ['pulm_none'],
      hemoSmokingStatus: 'smoking_never',
      hemoBleedingMeds: ['meds_none']
    },

    // Case 3: Active Cavitary TB / Malignancy Risk (ESI 2)
    {
      id: 'case-hemo-03',
      queue_number: 'E2-103',
      hn: '7890103',
      name: 'นายสมศักดิ์ ไอเรื้อรังผอมลง',
      age: 64,
      gender: 'ชาย',
      chief_complaint: 'hemoptysis',
      chief_complaint_title: 'ไอเป็นเลือด',
      timestamp: '2026-11-03T10:30:00.000Z',
      status: 'waiting',
      durationVal: 3,
      durationUnit: 'days',
      hospRecordStatus: 'complete',
      underlying: ['ถุงลมโป่งพอง'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Seretide accuhaler 1 puff bid, Ventolin inhaler 2 puffs prn',
      otherSymptomsFree: 'ไอเรื้อรังมา 1 เดือน วันนี้ไอเลือดสดออกมากกว่าครึ่งแก้ว มีไข้รุมๆ เหงื่อท่วมตอนกลางคืน น้ำหนักลด 7 กก.',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 37.8, sbp: 118, dbp: 72, bp: '118/72', pr: 86, rr: 18, spo2: 96 },
      esi_level: 2,

      hemoBloodChar: 'char_true_frothy_red',
      hemoBloodVolume: 'vol_half_to_full_cup',
      hemoEpisodeCount: 'episodes_over_5',
      hemoActiveStatus: 'status_active_bleeding',
      hemoPreCoughMaster: 'yes',
      hemoPreCoughDurVal: 1,
      hemoPreCoughDurUnit: 'months',
      hemoPriorSputumParent: true,
      hemoPriorSputum: 'sputum_foul_abscess_green',
      hemoDyspneaParent: true,
      hemoDyspnea: 'dyspnea_exertional',
      hemoChestPainMaster: 'no',
      hemoChestPainType: [],
      hemoWarningSigns: ['warn_fever_afternoon_night_sweat', 'warn_unintentional_weight_loss'],
      hemoWeightLossKg: 7,
      hemoWeightLossDurVal: 1,
      hemoWeightLossDurUnit: 'months',
      hemoWarnNone: false,
      hemoPastPulmonary: ['tb_prior_or_contact', 'past_copd_asthma'],
      hemoSmokingStatus: 'smoking_regular',
      hemoSmokingYears: 30,
      hemoSmokingPacks: 1,
      hemoBleedingMeds: ['meds_none']
    },

    // Case 4: Acute Bronchitis with Blood-Streaked Sputum (ESI 4)
    {
      id: 'case-hemo-04',
      queue_number: 'E4-104',
      hn: '7890104',
      name: 'นายกิตติวัฒน์ ไอหลอดลมอักเสบ',
      age: 26,
      gender: 'ชาย',
      chief_complaint: 'hemoptysis',
      chief_complaint_title: 'ไอเป็นเลือด',
      timestamp: '2026-11-03T11:00:00.000Z',
      status: 'waiting',
      durationVal: 2,
      durationUnit: 'days',
      hospRecordStatus: 'self',
      underlying: [],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'ไม่มี',
      otherSymptomsFree: 'ไอมีเสมหะปนเส้นเลือดแดงเล็กน้อยหลังไอสะบัดแรงๆ 2 วัน ตอนนี้เลือดหยุดแล้ว ไม่เหนื่อย',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.8, sbp: 120, dbp: 78, bp: '120/78', pr: 74, rr: 16, spo2: 99 },
      esi_level: 4,

      hemoBloodChar: 'char_streaked_sputum',
      hemoBloodVolume: 'vol_streaks_sputum',
      hemoEpisodeCount: 'episodes_single',
      hemoActiveStatus: 'status_stopped_completely',
      hemoPreCoughMaster: 'yes',
      hemoPreCoughDurVal: 3,
      hemoPreCoughDurUnit: 'days',
      hemoPriorSputumParent: true,
      hemoPriorSputum: 'sputum_normal_white_yellow',
      hemoDyspnea: 'dyspnea_none',
      hemoChestPainMaster: 'no',
      hemoChestPainType: [],
      hemoWarningSigns: [],
      hemoWarnNone: true,
      hemoPastPulmonary: ['pulm_none'],
      hemoSmokingStatus: 'smoking_never',
      hemoBleedingMeds: ['meds_none']
    }
  ]
};

// Register module in Ratchaburi ER Core Registry
if (typeof registerCcModule === 'function') {
  registerCcModule(hemoptysisModule);
} else if (typeof window !== 'undefined' && typeof window.registerCcModule === 'function') {
  window.registerCcModule(hemoptysisModule);
}

if (typeof window !== 'undefined') {
  window.clearHemoPainScore = clearHemoPainScore;
  window.handleHemoPainScoreChange = handleHemoPainScoreChange;
  window.setHemoPainScore = setHemoPainScore;
  window.toggleHemoPreCoughSub = toggleHemoPreCoughSub;
  window.toggleHemoPreCough = toggleHemoPreCoughSub;
  window.toggleHemoPriorSputumSub = toggleHemoPriorSputumSub;
  window.toggleHemoProdromeGroup = toggleHemoProdromeGroup;
  window.handleHemoProdromeItemChange = handleHemoProdromeItemChange;
  window.handleHemoProdromeNoneToggle = handleHemoProdromeNoneToggle;
  window.toggleHemoDyspneaSub = toggleHemoDyspneaSub;
  window.toggleHemoChestPainSub = toggleHemoChestPainSub;
  window.toggleHemoChestPain = toggleHemoChestPainSub;
  window.toggleHemoWarningGroup = toggleHemoWarningGroup;
  window.toggleHemoSmokingSub = toggleHemoSmokingSub;
  window.toggleHemoSmoking = toggleHemoSmokingSub;
  window.handleHemoWarnItemChange = handleHemoWarnItemChange;
  window.handleHemoWarnNoneToggle = handleHemoWarnNoneToggle;
  window.handleHemoPulmChange = handleHemoPulmChange;
  window.handleHemoMedChange = handleHemoMedChange;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = hemoptysisModule;
}
