// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 15_weakness.js
// อาการนำ: อ่อนเพลีย / กินไม่ได้ / ไม่มีแรง (Generalized Weakness / Failure to Thrive)
// ปรับปรุงตามมาตรฐาน plan_generalized_weakness.md, plan-cc และ code-cc (กลุ่ม B2)
// =========================================================================

// --- Internal DOM & UI Helpers ---
function getWeakEl(id) {
  return typeof document !== 'undefined' ? document.getElementById(id) : null;
}

function queryWeakOne(selector) {
  return typeof document !== 'undefined' ? document.querySelector(selector) : null;
}

function queryWeakAll(selector) {
  return typeof document !== 'undefined' ? Array.from(document.querySelectorAll(selector)) : [];
}

function wrapWeakWords(chunks) {
  if (!Array.isArray(chunks)) return chunks;
  return chunks.map(c => `<span class="inline-block whitespace-nowrap">${c}</span>`).join(' ');
}

function renderWeakOption(cfg) {
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
  const titleHtml = Array.isArray(title) ? wrapWeakWords(title) : title;
  const bodyHtml = desc
    ? `<div class="ml-3 leading-snug"><span class="block text-xs sm:text-sm font-semibold text-slate-800">${titleHtml}</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">${desc}</span></div>`
    : `<span class="ml-3 ${compact ? 'text-xs' : 'text-xs sm:text-sm'} font-semibold text-slate-800 leading-snug">${titleHtml}</span>`;
  return `<label class="selectable-card bg-white flex ${alignCls} ${padCls} rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition${spanCls}"><input type="${kind}" ${idAttr}${nameAttr}${valAttr}${chgAttr}class="${topCls}${roundCls}text-medical-600 focus:ring-medical-500 ${szCls} flex-shrink-0">${bodyHtml}</label>`;
}

function renderWeakGrid(colsCls, items, shared = {}) {
  return `<div class="grid ${colsCls} gap-2.5">${items.map(it => renderWeakOption({ ...shared, ...it })).join('\n')}</div>`;
}

function renderWeakSysHeader({
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

// --- Progressive Disclosure & Corner-Toggle Handlers ---
function handleWeaknessWarningItemChange(el) {
  if (el && el.checked) {
    const noneCb = getWeakEl('weakness_warn_none');
    if (noneCb) noneCb.checked = false;
  }
}

function handleWeaknessWarningNoneToggle(el) {
  if (el && el.checked) {
    queryWeakAll('input[name="weaknessWarningSigns"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function resetWeaknessSubInputs(wrap) {
  if (!wrap) return;
  wrap.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(el => { el.checked = false; });
  wrap.querySelectorAll('input[type="text"], input[type="number"]').forEach(el => { el.value = ''; });
}

function toggleWeaknessNoneSiblingSub(el, noneId, wrapId, afterClearFn = null) {
  const wrap = getWeakEl(wrapId);
  if (el && el.checked) {
    const noneCb = getWeakEl(noneId);
    if (noneCb) noneCb.checked = false;
    if (wrap) wrap.classList.remove('hidden');
  } else {
    if (wrap) {
      wrap.classList.add('hidden');
      resetWeaknessSubInputs(wrap);
    }
    if (typeof afterClearFn === 'function') afterClearFn();
  }
}

function handleWeaknessInfectionItemChange(el) {
  if (el && el.checked) {
    const noneCb = getWeakEl('weakness_inf_none');
    if (noneCb) noneCb.checked = false;
  }
}

function handleWeaknessInfUrtiToggle(el) {
  toggleWeaknessNoneSiblingSub(el, 'weakness_inf_none', 'weaknessUrtiSubWrap');
}

function handleWeaknessInfPneumoniaToggle(el) {
  toggleWeaknessNoneSiblingSub(el, 'weakness_inf_none', 'weaknessPneumoniaSubWrap');
}

function handleWeaknessInfectionNoneToggle(el) {
  if (el && el.checked) {
    queryWeakAll('input[name="weaknessInfectionSigns"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
    ['weaknessUrtiSubWrap', 'weaknessPneumoniaSubWrap'].forEach(id => {
      const wrap = getWeakEl(id);
      if (wrap) {
        wrap.classList.add('hidden');
        resetWeaknessSubInputs(wrap);
      }
    });
  }
}

function handleWeaknessGiAnemiaItemChange(el) {
  if (el && el.checked) {
    const noneCb = getWeakEl('weakness_gi_none');
    if (noneCb) noneCb.checked = false;
  }
}

function handleWeaknessGiAbdpainToggle(el) {
  toggleWeaknessNoneSiblingSub(el, 'weakness_gi_none', 'weaknessAbdpainSubWrap');
}

function handleWeaknessGiVomitToggle(el) {
  toggleWeaknessNoneSiblingSub(el, 'weakness_gi_none', 'weaknessVomitSubWrap', () => {
    const contentsWrap = getWeakEl('weaknessVomitContentsWrap');
    if (contentsWrap) contentsWrap.classList.remove('hidden');
  });
  if (el && el.checked) {
    const contentsWrap = getWeakEl('weaknessVomitContentsWrap');
    const nauseaOnlyEl = getWeakEl('weaknessVomitNauseaOnly');
    if (contentsWrap && !(nauseaOnlyEl && nauseaOnlyEl.checked)) {
      contentsWrap.classList.remove('hidden');
    }
  }
}

function handleWeaknessVomitNauseaOnlyToggle(el) {
  const wrap = getWeakEl('weaknessVomitContentsWrap');
  const freqEl = getWeakEl('weaknessVomitFreq');
  if (el && el.checked) {
    const giVomitCb = getWeakEl('weaknessGiVomitCb');
    if (giVomitCb) giVomitCb.checked = true;
    const noneCb = getWeakEl('weakness_gi_none');
    if (noneCb) noneCb.checked = false;
    if (freqEl) freqEl.value = '';
    queryWeakAll('input[name="weaknessVomitContents"]').forEach(cb => { cb.checked = false; });
    if (wrap) wrap.classList.add('hidden');
  } else if (wrap) {
    wrap.classList.remove('hidden');
  }
}

function handleWeaknessGiWeightLossToggle(el) {
  toggleWeaknessNoneSiblingSub(el, 'weakness_gi_none', 'weaknessWeightLossSubWrap', () => {
    const unitEl = getWeakEl('weaknessWeightLossDurUnit');
    if (unitEl) unitEl.value = 'months';
  });
}

function handleWeaknessGiAnemiaNoneToggle(el) {
  if (el && el.checked) {
    queryWeakAll('input[name="weaknessGiAnemiaSigns"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
    ['weaknessAbdpainSubWrap', 'weaknessVomitSubWrap', 'weaknessWeightLossSubWrap'].forEach(id => {
      const wrap = getWeakEl(id);
      if (wrap) {
        wrap.classList.add('hidden');
        resetWeaknessSubInputs(wrap);
      }
    });
    const vomitContentsWrap = getWeakEl('weaknessVomitContentsWrap');
    if (vomitContentsWrap) vomitContentsWrap.classList.remove('hidden');
    const wlUnit = getWeakEl('weaknessWeightLossDurUnit');
    if (wlUnit) wlUnit.value = 'months';
  }
}

function handleWeaknessMedsItemChange(el) {
  if (el && el.checked) {
    const noneCb = getWeakEl('weakness_meds_none');
    if (noneCb) noneCb.checked = false;
  }
}

function handleWeaknessMedsNoneToggle(el) {
  if (el && el.checked) {
    queryWeakAll('input[name="weaknessCurrentMedsList"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleWeaknessFoodIntakeChange(val) {
  const wrap = getWeakEl('weaknessFoodSubWrap');
  if (!wrap) return;
  if (val === 'reduced') {
    wrap.classList.remove('hidden');
  } else {
    wrap.classList.add('hidden');
    queryWeakAll('input[name="weaknessFoodSubLevel"]').forEach(r => { r.checked = false; });
  }
}

function handleWeaknessCustomSubstanceChange(val) {
  const wrap = getWeakEl('weaknessCustomSubstanceWrap');
  if (!wrap) return;
  if (val === 'has_custom_substance') {
    wrap.classList.remove('hidden');
  } else {
    wrap.classList.add('hidden');
    const inp = getWeakEl('weaknessCustomSubstanceText');
    if (inp) inp.value = '';
  }
}

// --- Red Flag Evaluator ---
function evaluateWeaknessRedFlags(patient) {
  const flags = [];
  if (!patient) return flags;

  const warningSigns = Array.isArray(patient.weaknessWarningSigns) ? patient.weaknessWarningSigns : [];
  const hasAlteredMental = warningSigns.includes('altered_mental');
  const hasTachypnea = warningSigns.includes('tachypnea');
  const hasSyncopeOrthostasis = warningSigns.includes('syncope_orthostasis');
  const hasColdDiaphoresis = warningSigns.includes('cold_diaphoresis');
  const hasFeverHypothermia = warningSigns.includes('fever_hypothermia');
  const hasChestTightness = warningSigns.includes('chest_tightness');

  const focalNeuro = patient.weaknessFocalNeuro || '';
  const foodIntake = patient.weaknessFoodIntake || '';
  const foodSub = patient.weaknessFoodSubLevel || '';
  const drinkStatus = patient.weaknessDrinkStatus || '';
  const urineOutput = patient.weaknessUrineOutput || '';
  const currentFunctional = patient.weaknessCurrentFunctional || '';

  const infectionSigns = Array.isArray(patient.weaknessInfectionSigns) ? patient.weaknessInfectionSigns : [];
  const hasUti = infectionSigns.includes('uti');
  const hasPneumonia = infectionSigns.includes('pneumonia');

  const takesSteroidOrHerbal = patient.weaknessSteroidHistory === 'steroid_withdrawal';
  const medsList = Array.isArray(patient.weaknessCurrentMedsList) ? patient.weaknessCurrentMedsList : [];
  const takesDiabeticMeds = medsList.includes('diabetic_meds');

  const underlying = Array.isArray(patient.underlying) ? patient.underlying : [];
  const hasDiabetes = underlying.some(u => /เบาหวาน|dm|diabetes/i.test(u)) || takesDiabeticMeds;
  const hasCad = underlying.some(u => /หลอดเลือดหัวใจ|cad|coronary|stemi|mi/i.test(u));
  const isElderly = (Number(patient.age) || 0) >= 60;

  // 1. Occult Sepsis / Septic Shock Risk (Critical)
  if ((hasFeverHypothermia || hasTachypnea || hasAlteredMental) &&
      (hasUti || hasPneumonia || foodIntake === 'none' || urineOutput === 'anuria_gte8h')) {
    flags.push({
      key: 'weakness_rf_septic_shock',
      textTh: 'สงสัยภาวะติดเชื้อในกระแสเลือดแอบแฝง (Suspected Occult Sepsis / Septic Shock)',
      risk: 'ผู้ป่วยอ่อนเพลีย ซึมลง หรือกินไม่ได้ ร่วมกับมีสัญญาณการติดเชื้อ (ปัสสาวะผิดปกติ/ไอหอบ/ไข้หรือตัวเย็น)',
      triageLevel: 1,
      severity: 'CRITICAL',
      suggestedAction: 'Triage Level 1/2: Sepsis Fast-Track, STAT Hemoculture x 2, CBC/BUN/Cr/Electrolytes/Lactate/UA, IV Crystalloid, Empiric IV Antibiotics ใน 1 ชม.'
    });
  }

  // 2. Severe Hypoglycemia Risk (Critical)
  if ((hasDiabetes || takesDiabeticMeds) &&
      (hasAlteredMental || hasColdDiaphoresis || foodIntake === 'none' || foodSub === 'reduced_severe')) {
    flags.push({
      key: 'weakness_rf_hypoglycemia',
      textTh: 'เสี่ยงต่อภาวะน้ำตาลในเลือดต่ำรุนแรง (Suspected Severe Hypoglycemia in Diabetic Patient)',
      risk: 'ผู้ป่วยเบาหวานที่ทานอาหารไม่ได้ หรือมีอาการเหงื่อแตก ซึมลง สับสน',
      triageLevel: 1,
      severity: 'CRITICAL',
      suggestedAction: 'STAT DTX ทันที หาก < 70 mg/dL ให้ 50% Glucose 50 mL IV push และเฝ้าระวังน้ำตาลต่ำซ้ำ'
    });
  }

  // 3. Acute Adrenal Crisis (Critical)
  if (takesSteroidOrHerbal && (hasSyncopeOrthostasis || hasAlteredMental || foodIntake === 'none' || hasColdDiaphoresis)) {
    flags.push({
      key: 'weakness_rf_adrenal_crisis',
      textTh: 'สงสัยภาวะวิกฤตต่อมหมวกไตจากการหยุดสเตียรอยด์ (Suspected Acute Adrenal Crisis)',
      risk: 'มีประวัติใช้ยาชุด ยาลูกกลอน หรือสเตียรอยด์ แล้วมีอาการอ่อนเพลียหมดแรง กินไม่ได้ หรือความดันตก',
      triageLevel: 1,
      severity: 'CRITICAL',
      suggestedAction: 'STAT Electrolytes/BS/Cortisol, IV Fluid Resuscitation ด้วย D5NSS และ IV Hydrocortisone 100 mg STAT'
    });
  }

  // 4. Severe Dehydration & Prerenal AKI (High)
  if (urineOutput === 'anuria_gte8h' || (foodIntake === 'none' && drinkStatus === 'none_or_vomit') ||
      (drinkStatus === 'minimal_dry' && urineOutput === 'oliguria_dark' && (currentFunctional === 'bedbound' || currentFunctional === 'unresponsive'))) {
    flags.push({
      key: 'weakness_rf_severe_dehydration_aki',
      textTh: 'ภาวะขาดสารน้ำรุนแรงและเสี่ยงต่อไตวายเฉียบพลัน (Severe Dehydration / Impending AKI)',
      risk: 'ไม่สามารถรับประทานอาหารหรือดื่มน้ำได้เลย ร่วมกับไม่มีปัสสาวะออกนานเกิน 8–12 ชั่วโมง',
      triageLevel: 2,
      severity: 'HIGH',
      suggestedAction: 'STAT BUN/Cr/Electrolytes, EKG 12 leads, ให้ IV Fluid Replacement อย่างเหมาะสม'
    });
  }

  // 5. Silent Acute Coronary Syndrome (High)
  if ((isElderly || hasDiabetes || hasCad) && (hasChestTightness || (hasTachypnea && hasColdDiaphoresis))) {
    flags.push({
      key: 'weakness_rf_silent_acs',
      textTh: 'สงสัยภาวะกล้ามเนื้อหัวใจขาดเลือดเงียบ (Suspected Silent Myocardial Infarction)',
      risk: 'ผู้สูงอายุหรือผู้ป่วยเบาหวานที่มีอาการอ่อนเพลียรุนแรงกะทันหัน เหงื่อแตก แน่นอึดอัดอก หรือหายใจเหนื่อย',
      triageLevel: 2,
      severity: 'HIGH',
      suggestedAction: 'STAT EKG 12 leads ภายใน 10 นาที, STAT Troponin-T, Cardiac Monitor'
    });
  }

  // 6. Focal Stroke / Acute Paralysis (Critical)
  if (focalNeuro === 'unilateral_weakness') {
    flags.push({
      key: 'weakness_rf_focal_stroke',
      textTh: 'ตรวจพบอาการอ่อนแรงครึ่งซีก เข้าข่ายโรคหลอดเลือดสมอง (Acute Stroke Alert)',
      risk: 'ผู้ป่วยมีอาการแขนหรือขาข้างใดข้างหนึ่งยกไม่ขึ้น ปากเบี้ยว หรือพูดไม่ชัด',
      triageLevel: 1,
      severity: 'CRITICAL',
      suggestedAction: 'Activate Stroke Fast-Track, STAT Non-contrast CT Brain'
    });
  } else if (focalNeuro === 'ascending_paralysis') {
    flags.push({
      key: 'weakness_rf_focal_stroke',
      textTh: 'ตรวจพบอาการอ่อนแรงจากปลายเท้าไล่ขึ้นมา สงสัยกลุ่มอาการ Guillain-Barré (Acute Ascending Paralysis)',
      risk: 'อาการแขนขาอ่อนแรงเริ่มจากปลายเท้าไล่ขึ้นมาที่มือและลำตัวอย่างรวดเร็ว เสี่ยงต่อกล้ามเนื้อหายใจล้มเหลว',
      triageLevel: 1,
      severity: 'CRITICAL',
      suggestedAction: 'ประเมิน Single Breath Count และ Vital Capacity, เฝ้าระวัง Respiratory failure, Electrolytes, ปรึกษาประสาทวิทยา'
    });
  }

  return flags;
}

// --- Thai Lookup Dictionaries ---
const WEAK_UNIT_MAP = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
const WEAK_ONSET_MAP = {
  sudden: 'เกิดขึ้นฉับพลันทันที (ภายใน 1–2 ชม.)',
  acute_rapid: 'เกิดขึ้นรวดเร็ว (ทรุดลงภายใน 1–2 วัน)',
  chronic_gradual: 'ค่อยๆ เป็นมากขึ้นต่อเนื่องหลายวันถึงสัปดาห์',
  chronic_intermittent: 'มีอาการเป็นๆ หายๆ อ่อนเพลียเรื้อรัง'
};
const WEAK_BASELINE_MAP = {
  independent: 'เดิมเดินได้ปกติและช่วยเหลือตัวเองได้ดี',
  needs_assistance: 'เดิมเดินได้แต่ต้องมีคนช่วยพยุง',
  wheelchair_bound: 'เดิมนั่งบนเตียงหรือรถเข็น เดินไม่ได้',
  bedbound: 'เดิมเป็นผู้ป่วยนอนติดเตียง'
};
const WEAK_CURRENT_MAP = {
  fatigued_mobile: 'ยังพอลุกเดินได้เอง แต่อ่อนเพลียกว่าเดิม',
  needs_assistance: 'เดินไม่ค่อยไหว ขาสั่น ต้องมีคนช่วยพยุง',
  bedbound: 'ลุกไม่ไหว เดินไม่ได้ ต้องนอนติดเตียง',
  unresponsive: 'ซึมลงมาก ปลุกไม่ค่อยตื่น หรือไม่ตอบสนอง'
};
const WEAK_FOOD_SUB_MAP = {
  reduced_mild: 'เบื่ออาหารแต่ทานได้ใกล้เคียงเดิม (> 75%)',
  reduced_moderate: 'ทานได้ประมาณครึ่งหนึ่ง (~50%)',
  reduced_severe: 'ทานได้น้อยลงมาก ไม่เกิน 1–2 คำ (< 25%)'
};
const WEAK_DRINK_MAP = {
  normal: 'ดื่มน้ำได้ตามปกติ',
  minimal_dry: 'ดื่มน้ำได้น้อยมาก ปากแห้ง คอแห้ง',
  none_or_vomit: 'ดื่มน้ำไม่ได้เลย จิบแล้วสำลักหรืออาเจียนออกหมด'
};
const WEAK_URINE_MAP = {
  normal: 'ปัสสาวะออกปกติ',
  oliguria_dark: 'ปัสสาวะออกน้อยมาก สีเหลืองเข้มจัด',
  anuria_gte8h: 'ไม่มีปัสสาวะออกเลยนานเกิน 8–12 ชั่วโมง',
  unnoticed: 'ไม่ได้สังเกต'
};
const WEAK_NEURO_MAP = {
  unilateral_weakness: 'แขนหรือขาอ่อนแรงครึ่งซีก ปากเบี้ยว หรือพูดไม่ชัด',
  generalized_symmetric: 'แขนขาอ่อนแรง 2 ข้างเท่ากัน',
  ascending_paralysis: 'อ่อนแรงเริ่มจากปลายเท้าไล่ขึ้นมาที่มือและลำตัว',
  no_motor_weakness: 'ไม่มีอาการแขนขาอ่อนแรงชัดเจน เพียงอ่อนเพลียทั้งตัว'
};
const WEAK_WARN_MAP = {
  altered_mental: 'ซึมลงมาก ปลุกตื่นยาก สับสน',
  tachypnea: 'หายใจหอบเร็ว หรือหายใจเหนื่อยลึก',
  syncope_orthostasis: 'หน้ามืด วูบหมดสติขณะลุกยืน',
  cold_diaphoresis: 'เหงื่อแตกท่วมตัว ตัวเย็นชืด มือเท้าเย็น',
  fever_hypothermia: 'ไข้สูง หนาวสั่น หรือตัวเย็นจัดผิดปกติ',
  chest_tightness: 'แน่นอึดอัดกลางหน้าอก หรือจุกคอหอย'
};
const WEAK_INF_MAP = {
  urti: 'มีน้ำมูก เจ็บคอ หรือครั่นเนื้อครั่นตัว',
  uti: 'ปัสสาวะแสบขัด ขุ่น หรือกลิ่นเหม็นผิดปกติ',
  pneumonia: 'มีอาการไอ เสมหะเหลืองเขียว หรือหายใจครืดคราด'
};
const WEAK_URTI_DETAIL_MAP = {
  urti_sore_throat: 'เจ็บคอ/กลืนน้ำลายเจ็บ',
  urti_rhinorrhea: 'น้ำมูก/คัดจมูก',
  urti_viral_myalgia: 'ปวดเมื่อยตามตัว/ปวดกระบอกตา',
  urti_viral_rash_eye: 'มีผื่นตามตัว/ตาแดง'
};
const WEAK_PNEU_DETAIL_MAP = {
  pneu_purulent_sputum: 'เสมหะข้นสีเหลืองหรือเขียว',
  pneu_hemoptysis_rusty: 'เสมหะปนเลือดหรือสีสนิม',
  pneu_noisy_wheeze: 'หายใจเสียงครืดคราดหรือหวีด',
  pneu_pleuritic_pain: 'เจ็บแปล๊บหน้าอกเวลาไอหรือหายใจ',
  pneu_aspiration_history: 'มีประวัติสำลักน้ำหรืออาหาร',
  pneu_chronic_cough_2w: 'ไอมานานเกิน 2 สัปดาห์'
};
const WEAK_GI_MAP = {
  abdominal_pain: 'ปวดท้อง',
  nausea_vomiting: 'คลื่นไส้หรืออาเจียนหลายครั้ง',
  constipation: 'ท้องผูกไม่ถ่ายหลายวัน',
  melena_hematochezia: 'ถ่ายอุจจาระสีดำยางมะตอย หรือถ่ายเป็นเลือดสด',
  pallor: 'ผิวซีดลงมาก หรือเยื่อบุตาซีดขาว',
  weight_loss: 'น้ำหนักตัวลดลงรวดเร็วโดยไม่ได้ตั้งใจ'
};
const WEAK_ABDP_LOC_MAP = {
  epigastrium: 'ใต้ลิ้นปี่',
  ruq: 'ชายโครงขวา',
  luq: 'ชายโครงซ้าย',
  periumbilical: 'รอบสะดือ',
  rlq: 'ท้องน้อยขวา',
  llq: 'ท้องน้อยซ้าย',
  suprapubic: 'เหนือหัวเหน่า',
  diffuse: 'ทั่วท้อง'
};
const WEAK_ABDP_CHAR_MAP = {
  colicky_spasm: 'ปวดบิดเกร็งเป็นพักๆ',
  dull_aching: 'ปวดตื้อแน่นตลอดเวลา',
  burning: 'แสบร้อนกลางอก/ลิ้นปี่',
  sharp_severe: 'ปวดรุนแรงเฉียบพลัน/เสียดแทง'
};
const WEAK_VOMIT_CONTENT_MAP = {
  food_gastric: 'เศษอาหาร/น้ำย่อยเหลือง',
  bile_green: 'น้ำดีสีเขียว',
  coffee_ground: 'สีกาแฟคั่ว/สีดำคล้ำ',
  bloody: 'มีเลือดสดปน'
};
const WEAK_WL_UNIT_MAP = { weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
const WEAK_MEDS_MAP = {
  diabetic_meds: 'ยารักษาโรคเบาหวาน (ยากินลดน้ำตาลหรืออินซูลิน)',
  diuretics: 'ยาขับปัสสาวะ',
  cardiac_meds: 'ยารักษาโรคหัวใจ',
  sedatives: 'ยานอนหลับหรือยากล่อมประสาท'
};
const WEAK_HOSP_MAP = {
  ratchaburi: 'มีประวัติการรักษาที่ รพ.ราชบุรี',
  complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
  additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
  self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
  unspecified: 'ไม่ได้ระบุ'
};

// --- Outputs Updater (Rapid, Narrative, JSON Schema) ---
function updateWeaknessOutputs(patient) {
  if (!patient) return null;

  const rfs = evaluateWeaknessRedFlags(patient);
  patient.redFlags = rfs;

  const warningSigns = Array.isArray(patient.weaknessWarningSigns) ? patient.weaknessWarningSigns : [];
  const infectionSigns = Array.isArray(patient.weaknessInfectionSigns) ? patient.weaknessInfectionSigns : [];
  const giAnemiaSigns = Array.isArray(patient.weaknessGiAnemiaSigns) ? patient.weaknessGiAnemiaSigns : [];
  const medsList = Array.isArray(patient.weaknessCurrentMedsList) ? patient.weaknessCurrentMedsList : [];

  const durVal = patient.durationVal;
  const durationStr = durVal ? `${durVal} ${WEAK_UNIT_MAP[patient.durationUnit] || 'วัน'}` : 'ไม่ได้ระบุ';
  const onsetTh = WEAK_ONSET_MAP[patient.weaknessOnsetPattern] || 'ไม่ได้ระบุ';

  let onsetExactStr = '';
  if (patient.weaknessOnsetExactDate || patient.weaknessOnsetExactTime) {
    onsetExactStr = ` (เริ่มวันที่ ${patient.weaknessOnsetExactDate || '-'} เวลา ${patient.weaknessOnsetExactTime || '-'} น.)`;
  }

  const baselineTh = WEAK_BASELINE_MAP[patient.weaknessBaselineFunctional] || 'ไม่ได้ระบุ';
  const currentTh = WEAK_CURRENT_MAP[patient.weaknessCurrentFunctional] || 'ไม่ได้ระบุ';

  let foodTh = 'ไม่ได้ระบุ';
  if (patient.weaknessFoodIntake === 'normal') foodTh = 'ทานได้ปกติ';
  else if (patient.weaknessFoodIntake === 'none') foodTh = 'กินไม่ได้เลยแม้แต่คำเดียว';
  else if (patient.weaknessFoodIntake === 'reduced') {
    foodTh = WEAK_FOOD_SUB_MAP[patient.weaknessFoodSubLevel] || 'เบื่ออาหาร ทานได้น้อยลง';
  }

  const drinkTh = WEAK_DRINK_MAP[patient.weaknessDrinkStatus] || 'ไม่ได้ระบุ';
  const urineTh = WEAK_URINE_MAP[patient.weaknessUrineOutput] || 'ไม่ได้ระบุ';
  const neuroTh = WEAK_NEURO_MAP[patient.weaknessFocalNeuro] || 'ไม่ได้ระบุ';

  const warnPosKeys = warningSigns.filter(k => k !== 'none_warning');
  const infPosKeys = infectionSigns.filter(k => k !== 'none_infection');
  const giPosKeys = giAnemiaSigns.filter(k => k !== 'none_gi_anemia');
  const medsPosKeys = medsList.filter(k => k !== 'none_meds');

  const positives = [];
  const negatives = [];

  warnPosKeys.forEach(k => { if (WEAK_WARN_MAP[k]) positives.push(WEAK_WARN_MAP[k]); });
  if (warningSigns.includes('none_warning')) {
    negatives.push('ปฏิเสธอาการซึม สับสน หายใจหอบเร็ว หน้ามืดวูบ เหงื่อแตกตัวเย็น ไข้สูง และแน่นหน้าอก');
  } else if (warnPosKeys.length > 0) {
    if (!warnPosKeys.includes('altered_mental')) negatives.push('ปฏิเสธซึมลงสับสน');
    if (!warnPosKeys.includes('tachypnea')) negatives.push('ปฏิเสธหายใจหอบเร็ว');
    if (!warnPosKeys.includes('syncope_orthostasis')) negatives.push('ปฏิเสธหน้ามืดหรือวูบหมดสติ');
    if (!warnPosKeys.includes('cold_diaphoresis')) negatives.push('ปฏิเสธเหงื่อแตกตัวเย็น');
    if (!warnPosKeys.includes('chest_tightness')) negatives.push('ปฏิเสธแน่นหน้าอก');
  }

  if (patient.weaknessFocalNeuro === 'unilateral_weakness') {
    positives.push(WEAK_NEURO_MAP.unilateral_weakness);
  } else if (patient.weaknessFocalNeuro === 'ascending_paralysis') {
    positives.push(WEAK_NEURO_MAP.ascending_paralysis);
  } else if (patient.weaknessFocalNeuro === 'generalized_symmetric') {
    positives.push(WEAK_NEURO_MAP.generalized_symmetric);
    negatives.push('ปฏิเสธแขนขาอ่อนแรงครึ่งซีก');
  } else if (patient.weaknessFocalNeuro === 'no_motor_weakness') {
    negatives.push('ปฏิเสธอาการแขนขาอ่อนแรงชัดเจน');
  }

  const urtiDetails = Array.isArray(patient.weaknessUrtiDetails) ? patient.weaknessUrtiDetails : [];
  const pneuDetails = Array.isArray(patient.weaknessPneumoniaDetails) ? patient.weaknessPneumoniaDetails : [];
  infPosKeys.forEach(k => {
    if (k === 'urti') {
      const sub = urtiDetails.map(d => WEAK_URTI_DETAIL_MAP[d] || d).filter(Boolean);
      positives.push(sub.length > 0 ? `${WEAK_INF_MAP.urti} (${sub.join(', ')})` : WEAK_INF_MAP.urti);
    } else if (k === 'pneumonia') {
      const sub = pneuDetails.map(d => WEAK_PNEU_DETAIL_MAP[d] || d).filter(Boolean);
      positives.push(sub.length > 0 ? `${WEAK_INF_MAP.pneumonia} (${sub.join(', ')})` : WEAK_INF_MAP.pneumonia);
    } else if (WEAK_INF_MAP[k]) {
      positives.push(WEAK_INF_MAP[k]);
    }
  });
  if (infectionSigns.includes('none_infection')) {
    negatives.push('ปฏิเสธน้ำมูกเจ็บคอ ปัสสาวะแสบขัด และไอมีเสมหะ');
  }

  const abdpLocs = Array.isArray(patient.weaknessAbdpainLocs) ? patient.weaknessAbdpainLocs : [];
  const abdpChar = patient.weaknessAbdpainChar || '';
  const vomitFreq = patient.weaknessVomitFreq ? Number(patient.weaknessVomitFreq) : null;
  const vomitNauseaOnly = Boolean(patient.weaknessVomitNauseaOnly);
  const vomitContents = Array.isArray(patient.weaknessVomitContents) ? patient.weaknessVomitContents : [];
  const wlKg = patient.weaknessWeightLossKg ? Number(patient.weaknessWeightLossKg) : null;
  const wlDurVal = patient.weaknessWeightLossDurVal ? Number(patient.weaknessWeightLossDurVal) : null;
  const wlDurUnit = patient.weaknessWeightLossDurUnit || 'months';

  giPosKeys.forEach(k => {
    if (k === 'abdominal_pain') {
      const parts = [];
      if (abdpLocs.length > 0) parts.push(`บริเวณ${abdpLocs.map(l => WEAK_ABDP_LOC_MAP[l] || l).join(', ')}`);
      if (abdpChar) parts.push(`ลักษณะ${WEAK_ABDP_CHAR_MAP[abdpChar] || abdpChar}`);
      positives.push(parts.length > 0 ? `ปวดท้อง (${parts.join(' ')})` : WEAK_GI_MAP.abdominal_pain);
    } else if (k === 'nausea_vomiting') {
      if (vomitNauseaOnly) {
        positives.push('คลื่นไส้อย่างเดียว (ยังไม่อาเจียน)');
      } else {
        const subParts = [];
        if (vomitFreq > 0) subParts.push(`${vomitFreq} ครั้ง/วัน`);
        if (vomitContents.length > 0) subParts.push(vomitContents.map(v => WEAK_VOMIT_CONTENT_MAP[v] || v).join(', '));
        positives.push(subParts.length > 0 ? `คลื่นไส้/อาเจียน (${subParts.join(' — ')})` : WEAK_GI_MAP.nausea_vomiting);
      }
    } else if (k === 'weight_loss') {
      const wlParts = [];
      if (wlKg > 0) wlParts.push(`ลดประมาณ ${wlKg} กก.`);
      if (wlDurVal > 0) wlParts.push(`ในช่วง ${wlDurVal} ${WEAK_WL_UNIT_MAP[wlDurUnit] || 'เดือน'}`);
      positives.push(wlParts.length > 0 ? `${WEAK_GI_MAP.weight_loss} (${wlParts.join(' ')})` : WEAK_GI_MAP.weight_loss);
    } else if (WEAK_GI_MAP[k]) {
      positives.push(WEAK_GI_MAP[k]);
    }
  });
  if (giAnemiaSigns.includes('none_gi_anemia')) {
    negatives.push('ปฏิเสธปวดท้อง คลื่นไส้อาเจียน ท้องผูก ถ่ายดำ ถ่ายเป็นเลือด ซีด และน้ำหนักลด');
  }

  if (patient.weaknessCustomSubstanceCheck === 'has_custom_substance' && patient.weaknessCustomSubstanceText) {
    positives.push(`ประวัติยา อาหาร หรือสารที่สงสัย: ${patient.weaknessCustomSubstanceText}`);
  } else if (patient.weaknessCustomSubstanceCheck === 'no_custom_substance') {
    negatives.push('ปฏิเสธยา อาหาร หรือสารต้องสงสัยอื่น');
  }

  if (patient.otherSymptomsFree) positives.push(patient.otherSymptomsFree);

  const steroidTh = patient.weaknessSteroidHistory === 'steroid_withdrawal'
    ? 'มีประวัติใช้ยาชุด/ยาลูกกลอน/สเตียรอยด์ แล้วเพิ่งหยุดยา'
    : (patient.weaknessSteroidHistory === 'none_steroid' ? 'ปฏิเสธประวัติใช้ยาชุด/ยาลูกกลอน/สเตียรอยด์' : 'ไม่ได้ระบุ');
  if (patient.weaknessSteroidHistory === 'steroid_withdrawal') positives.push(steroidTh);
  else if (patient.weaknessSteroidHistory === 'none_steroid') negatives.push('ปฏิเสธประวัติใช้ยาชุด ยาลูกกลอน หรือสเตียรอยด์');

  patient.pertinentPositives = positives.length > 0 ? positives : ['ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม'];
  patient.pertinentNegatives = negatives.length > 0 ? negatives : ['ผู้ป่วยไม่ได้ระบุคำตอบยืนยันในหมวดอาการร่วม'];

  const docNotes = patient.doctor_notes || {};
  const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ')
    ? 'ไม่ได้ระบุ'
    : (patient.currentMeds === 'ไม่มี' ? 'ไม่มี' : patient.currentMeds);
  const udList = Array.isArray(patient.underlying) ? patient.underlying : (patient.underlying ? [patient.underlying] : []);
  const filteredUd = udList.filter(u => u && !u.includes('ปฏิเสธ') && u !== 'ไม่มี' && u !== 'ไม่มีโรคประจำตัว' && u !== 'ไม่ได้ระบุ');
  const hasExplicitUdDeny = udList.some(u => u && (u.includes('ปฏิเสธ') || u === 'ไม่มี' || u === 'ไม่มีโรคประจำตัว'));
  const udText = filteredUd.length > 0
    ? filteredUd.join(', ')
    : ((hasExplicitUdDeny || patient.hospRecordStatus === 'self' || patient.hospRecordStatus === 'additional') ? 'ปฏิเสธ' : 'ไม่ได้ระบุ');

  const allergyText = (!patient.drugAllergy || patient.drugAllergy === 'ไม่ได้ระบุ')
    ? 'ไม่ได้ระบุ'
    : ((patient.drugAllergy.includes('ปฏิเสธ') || patient.drugAllergy === 'ไม่มี') ? 'ปฏิเสธ' : patient.drugAllergy);

  const riskMedsText = medsPosKeys.length > 0
    ? medsPosKeys.map(k => WEAK_MEDS_MAP[k] || k).join(', ')
    : (medsList.includes('none_meds') ? 'ปฏิเสธยากลุ่มเสี่ยงสำคัญ' : 'ไม่ได้ระบุ');
  const hospLabel = WEAK_HOSP_MAP[patient.hospRecordStatus] || 'ไม่ได้ระบุ';

  const defaultRapid = `[Chief Complaint (CC)]
อ่อนเพลีย / กินไม่ได้ / ไม่มีแรง (Generalized Weakness) มา ${durationStr}

[History of Present Illness (HPI)]
• รูปแบบการเริ่มมีอาการ: ${onsetTh}${onsetExactStr}
• ความสามารถทางกายภาพ: เดิม (${baselineTh}) -> ปัจจุบัน (${currentTh})
• การรับประทานอาหารและน้ำ: อาหาร (${foodTh}), น้ำ (${drinkTh}), ปัสสาวะ (${urineTh})

• Pertinent Positives:
${patient.pertinentPositives.map(p => `  - ${p}`).join('\n')}

• Pertinent Negatives:
${patient.pertinentNegatives.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• ประวัติการใช้ยาสเตียรอยด์/ยาลูกกลอน: ${steroidTh}
• ยาประจำตัวกลุ่มเสี่ยงสำคัญ: ${riskMedsText}
• โรคประจำตัว (U/D): ${udText}
• ยาประจำตัว (Current Meds): ${medsText}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${allergyText}

[Emergency Risk Assessment (Red Flags)]
${rfs.length > 0
  ? `🚩 RED FLAGS DETECTED:\n${rfs.map(rf => `  * ${rf.textTh}`).join('\n')}`
  : '✓ ไม่พบสัญญาณเตือนวิกฤตเฉียบพลันเบื้องต้น'}

[Doctor's Clinical Addendum & Exam]
• ประวัติเพิ่มเติม/แก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}
• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}
• แผนการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

  const genderLabel = (patient.gender && patient.gender !== 'ไม่ระบุ') ? patient.gender : '';
  let narrative = `ผู้ป่วย${genderLabel} อายุ ${patient.age || 'ไม่ได้ระบุ'} ปี มารับบริการด้วยอาการอ่อนเพลีย กินไม่ได้ หรือไม่มีแรง มา ${durationStr} รูปแบบการเริ่ม: ${onsetTh}${onsetExactStr} ` +
    `ความสามารถเดิม: ${baselineTh} ปัจจุบัน: ${currentTh} การทานอาหาร: ${foodTh} การดื่มน้ำ: ${drinkTh} ปัสสาวะ: ${urineTh} การคัดกรองกำลังกล้ามเนื้อ: ${neuroTh}`;

  if (positives.length > 0) narrative += ` อาการร่วมและประวัติที่พบ: ${positives.join(', ')}`;
  narrative += rfs.length > 0
    ? `\n\nการประเมินสัญญาณวิกฤตห้องฉุกเฉิน: ตรวจพบ ${rfs.map(r => r.textTh).join(', ')}`
    : `\n\nการประเมินสัญญาณวิกฤตห้องฉุกเฉิน: ไม่พบสัญญาณวิกฤตที่ต้องช่วยชีวิตเร่งด่วน`;

  const jsonSchema = {
    encounter: {
      chief_complaint: 'generalized_weakness',
      chief_complaint_title_th: 'อ่อนเพลีย / กินไม่ได้ / ไม่มีแรง',
      triage_category: 'emergency_medicine',
      calculated_triage_level: rfs.length > 0 ? Math.min(...rfs.map(r => r.triageLevel)) : 4,
      entry_timestamp: patient.timestamp || new Date().toISOString()
    },
    clinical_assessment: {
      onset: {
        duration_value: durVal || null,
        duration_unit: patient.durationUnit || 'days',
        onset_pattern: patient.weaknessOnsetPattern || null,
        exact_onset_date: patient.weaknessOnsetExactDate || null,
        exact_onset_time: patient.weaknessOnsetExactTime || null
      },
      functional_trajectory: {
        baseline: patient.weaknessBaselineFunctional || null,
        current: patient.weaknessCurrentFunctional || null
      },
      intake_and_hydration: {
        food_intake: patient.weaknessFoodIntake || null,
        food_intake_sublevel: patient.weaknessFoodSubLevel || null,
        fluid_intake: patient.weaknessDrinkStatus || null,
        urine_output: patient.weaknessUrineOutput || null
      },
      warning_signs: warnPosKeys,
      focal_neuro: patient.weaknessFocalNeuro || null,
      infection_signs: infPosKeys,
      infection_details: {
        urti_details: urtiDetails,
        pneumonia_details: pneuDetails
      },
      gi_anemia_signs: giPosKeys,
      gi_anemia_details: {
        abdominal_pain: giPosKeys.includes('abdominal_pain') ? { locations: abdpLocs, characteristic: abdpChar || null } : null,
        vomiting: giPosKeys.includes('nausea_vomiting') ? { frequency: vomitFreq || null, nausea_only: vomitNauseaOnly, contents: vomitContents } : null,
        weight_loss: giPosKeys.includes('weight_loss') ? { kg: wlKg || null, duration_val: wlDurVal || null, duration_unit: wlDurUnit } : null
      },
      medications_and_substances: {
        steroid_history: patient.weaknessSteroidHistory || null,
        current_meds_list: medsPosKeys,
        suspected_custom_substance: patient.weaknessCustomSubstanceCheck === 'has_custom_substance' ? (patient.weaknessCustomSubstanceText || null) : null
      },
      red_flags: rfs.map(rf => ({
        id: rf.key,
        severity: rf.severity,
        title: rf.textTh,
        triage_level: rf.triageLevel
      }))
    }
  };

  const finalRapid = patient.custom_rapid_note || defaultRapid;
  const finalNarrative = patient.custom_narrative_note || narrative;
  patient.rapidHpi = finalRapid;
  patient.narrativeHpi = finalNarrative;
  patient.medicalJson = jsonSchema;

  if (typeof document !== 'undefined') {
    const rapidBox = document.getElementById('rapidTextView');
    const narrativeBox = document.getElementById('narrativeTextView');
    const jsonBox = document.getElementById('jsonViewer');
    if (rapidBox) rapidBox.value = finalRapid;
    if (narrativeBox) narrativeBox.value = finalNarrative;
    if (jsonBox) jsonBox.textContent = JSON.stringify(jsonSchema, null, 2);
  }

  return { rapid: finalRapid, narrative: finalNarrative, json: jsonSchema };
}

// --- Module Registration ---
const weaknessModule = {
  id: 'weakness',
  schemaCode: 'generalized_weakness',
  recordCc: 'generalized_weakness',
  titleTh: 'อ่อนเพลีย / กินไม่ได้ / ไม่มีแรง',
  titleEn: 'Generalized Weakness / Poor Intake',
  icon: 'battery-low',
  sectionDomId: 'weaknessQuestionnaireSection',
  headerTh: 'แบบฟอร์มซักประวัติ: อ่อนเพลีย / กินไม่ได้ / ไม่มีแรง',
  headerEn: '(Generalized Weakness & Failure to Thrive)',
  patientBadgeHtml: '<i data-lucide="battery-low" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-amber-500"></i><span class="whitespace-nowrap">อ่อนเพลีย /</span> <span class="whitespace-nowrap">กินไม่ได้ /</span> <span class="whitespace-nowrap">ไม่มีแรง</span>',
  doctorCcBadgeHtml: '<i data-lucide="battery-low" class="w-3.5 h-3.5 mr-1 text-amber-500"></i> CC: อ่อนเพลีย / กินไม่ได้ / ไม่มีแรง',
  pmhSectionNumber: 5,
  getPmhSectionNumber: () => 5,
  dateFields: ['weaknessOnsetExactDate'],
  timeFields: ['weaknessOnsetExactTime'],
  branchIds: [
    'weaknessFoodSubWrap',
    'weaknessUrtiSubWrap',
    'weaknessPneumoniaSubWrap',
    'weaknessAbdpainSubWrap',
    'weaknessVomitSubWrap',
    'weaknessWeightLossSubWrap',
    'weaknessCustomSubstanceWrap'
  ],
  inputIdsToClear: [
    'weaknessDurationVal',
    'weaknessOnsetExactDate',
    'weaknessOnsetExactTime',
    'weaknessVomitFreq',
    'weaknessWeightLossKg',
    'weaknessWeightLossDurVal',
    'weaknessCustomSubstanceText',
    'weakness_other_free'
  ],

  algorithm: {
    chiefComplaint: 'generalized_weakness',
    titleTh: 'อ่อนเพลีย / กินไม่ได้ / ไม่มีแรง',
    schemaCode: 'generalized_weakness',
    version: '2.0.0',
    redFlagDefinitions: [
      { key: 'weakness_rf_septic_shock', level: 1, textTh: 'สงสัยภาวะติดเชื้อในกระแสเลือดแอบแฝง (Occult Sepsis / Septic Shock)' },
      { key: 'weakness_rf_hypoglycemia', level: 1, textTh: 'เสี่ยงต่อภาวะน้ำตาลในเลือดต่ำรุนแรง (Severe Hypoglycemia)' },
      { key: 'weakness_rf_adrenal_crisis', level: 1, textTh: 'สงสัยภาวะวิกฤตต่อมหมวกไตจากการหยุดสเตียรอยด์ (Acute Adrenal Crisis)' },
      { key: 'weakness_rf_severe_dehydration_aki', level: 2, textTh: 'ภาวะขาดสารน้ำรุนแรงและเสี่ยงต่อไตวายเฉียบพลัน (Severe Dehydration / Impending AKI)' },
      { key: 'weakness_rf_silent_acs', level: 2, textTh: 'สงสัยภาวะกล้ามเนื้อหัวใจขาดเลือดเงียบ (Silent Acute Coronary Syndrome)' },
      { key: 'weakness_rf_focal_stroke', level: 1, textTh: 'ตรวจพบอาการอ่อนแรงครึ่งซีก เข้าข่ายโรคหลอดเลือดสมอง (Acute Stroke Alert)' }
    ]
  },

  formHtml: `
    <div id="weaknessQuestionnaireSection" class="space-y-6 hidden">
      <div data-cc-top-banner="weakness">
        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
          <div class="bg-amber-100 text-amber-800 p-2.5 rounded-xl flex-shrink-0 mt-0.5">
            <i data-lucide="alert-circle" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-amber-900 mb-1">คำแนะนำเบื้องต้นระหว่างรอตรวจ</h3>
            <p class="text-xs text-amber-800 leading-relaxed">
              กรุณานั่งหรือนอนพักนิ่งๆ เพื่อป้องกันการหน้ามืดล้ม <strong>หากมีโรคเบาหวานร่วมกับเหงื่อแตก ใจสั่น หรือซึมลง</strong> หรือมีแขนขาอ่อนแรงครึ่งซีก ปากเบี้ยว หายใจเหนื่อยหอบ หรือวูบหมดสติ กรุณาแจ้งพยาบาลทันที
            </p>
          </div>
        </div>
      </div>

      <!-- CARD 1: ระยะเวลา รูปแบบ และระดับความสามารถทางกายภาพ -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="clock" class="w-5 h-5"></i>
          </div>
          <h2 class="text-base font-bold text-slate-900">1. ระยะเวลา รูปแบบ และระดับความสามารถทางกายภาพ</h2>
        </div>

        <div class="space-y-4">
          <div>
            ${renderWeakSysHeader({
              label: '1.1 ระยะเวลาที่มีอาการอ่อนเพลียในครั้งนี้',
              icon: 'clock',
              colorClass: 'bg-sky-100 text-sky-700'
            })}
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div class="col-span-1 sm:col-span-2">
                <input type="number" id="weaknessDurationVal" min="1" max="1000" placeholder="ระบุตัวเลข เช่น 2"
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm placeholder:text-slate-400 placeholder:font-normal">
              </div>
              <div class="col-span-1">
                <select id="weaknessDurationUnit"
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm">
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

          <div class="pt-4 border-t border-slate-100">
            ${renderWeakSysHeader({
              label: '1.2 รูปแบบการเริ่มมีอาการ',
              icon: 'calendar-clock',
              colorClass: 'bg-sky-100 text-sky-700'
            })}
            ${renderWeakGrid('grid-cols-1 sm:grid-cols-2', [
              { kind: 'radio', name: 'weaknessOnsetPattern', value: 'sudden', title: ['เกิดขึ้นฉับพลันทันที', '(1–2 ชม.)'] },
              { kind: 'radio', name: 'weaknessOnsetPattern', value: 'acute_rapid', title: ['ทรุดลงรวดเร็ว', 'ใน 1–2 วันนี้'] },
              { kind: 'radio', name: 'weaknessOnsetPattern', value: 'chronic_gradual', title: ['ค่อยๆ เป็นมากขึ้น', 'หลายวัน – สัปดาห์'] },
              { kind: 'radio', name: 'weaknessOnsetPattern', value: 'chronic_intermittent', title: ['เป็นๆ หายๆ เรื้อรัง', 'หลายเดือน'] }
            ])}
            <div class="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] font-semibold text-slate-600 mb-1">วันที่เริ่มสังเกตเห็นอาการ (วว/ดด/ปปปป): <span class="font-normal text-slate-500">(ถ้าทราบ)</span></label>
                <input type="text" id="weaknessOnsetExactDate" placeholder="วว/ดด/ปปปป เช่น 26/10/2026" data-universal-date="true" autocomplete="off"
                  class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 font-medium">
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-slate-600 mb-1">เวลาที่เริ่มสังเกตเห็น (24 ชม.): <span class="font-normal text-slate-500">(ถ้าทราบ)</span></label>
                <input type="text" id="weaknessOnsetExactTime" placeholder="เช่น 10:15" data-universal-time="true" autocomplete="off"
                  class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 font-medium">
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100">
            ${renderWeakSysHeader({
              label: '1.3 ความสามารถเดิมก่อนป่วย',
              icon: 'user-check',
              colorClass: 'bg-sky-100 text-sky-700'
            })}
            ${renderWeakGrid('grid-cols-1 sm:grid-cols-2', [
              { kind: 'radio', name: 'weaknessBaselineFunctional', value: 'independent', title: ['เดิมเดินได้ปกติ', 'ช่วยเหลือตัวเอง', 'ได้ดี'] },
              { kind: 'radio', name: 'weaknessBaselineFunctional', value: 'needs_assistance', title: ['เดินได้แต่ต้อง', 'มีคนช่วยพยุง'] },
              { kind: 'radio', name: 'weaknessBaselineFunctional', value: 'wheelchair_bound', title: ['นั่งได้บนเตียง /', 'รถเข็น (เดินไม่ได้)'] },
              { kind: 'radio', name: 'weaknessBaselineFunctional', value: 'bedbound', title: ['นอนติดเตียงเดิม'] }
            ])}
          </div>

          <div class="pt-4 border-t border-slate-100">
            ${renderWeakSysHeader({
              label: '1.4 สภาพร่างกายและความสามารถในปัจจุบัน',
              icon: 'activity',
              colorClass: 'bg-sky-100 text-sky-700'
            })}
            ${renderWeakGrid('grid-cols-1 sm:grid-cols-2', [
              { kind: 'radio', name: 'weaknessCurrentFunctional', value: 'fatigued_mobile', title: ['ยังเดินได้เอง', 'แต่อ่อนเพลีย', 'กว่าเดิม'] },
              { kind: 'radio', name: 'weaknessCurrentFunctional', value: 'needs_assistance', title: ['เดินไม่ไหว ขาสั่น', 'ต้องมีคนช่วยพยุง'] },
              { kind: 'radio', name: 'weaknessCurrentFunctional', value: 'bedbound', title: ['ลุกไม่ไหว', 'เดินไม่ได้', 'ต้องนอนติดเตียง'] },
              { kind: 'radio', name: 'weaknessCurrentFunctional', value: 'unresponsive', title: ['ซึมลงมาก', 'ปลุกไม่ค่อยตื่น'] }
            ])}
          </div>
        </div>
      </div>

      <!-- CARD 2: การรับประทานอาหาร น้ำดื่ม และปริมาณปัสสาวะ -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="droplet" class="w-5 h-5"></i>
          </div>
          <h2 class="text-base font-bold text-slate-900">2. การรับประทานอาหาร น้ำดื่ม และปริมาณปัสสาวะ</h2>
        </div>

        <div class="space-y-4">
          <div>
            ${renderWeakSysHeader({
              label: '2.1 การรับประทานอาหารในรอบ 24–48 ชั่วโมง',
              icon: 'utensils',
              colorClass: 'bg-teal-100 text-teal-700'
            })}
            ${renderWeakGrid('grid-cols-1 sm:grid-cols-3', [
              { kind: 'radio', name: 'weaknessFoodIntake', value: 'normal', title: ['ทานได้ปกติ', 'ไม่เบื่ออาหาร'], onchange: `handleWeaknessFoodIntakeChange('normal')` },
              { kind: 'radio', name: 'weaknessFoodIntake', value: 'reduced', title: ['เบื่ออาหาร /', 'ทานได้น้อยลง'], onchange: `handleWeaknessFoodIntakeChange('reduced')` },
              { kind: 'radio', name: 'weaknessFoodIntake', value: 'none', title: ['กินไม่ได้เลย', 'แม้แต่คำเดียว'], onchange: `handleWeaknessFoodIntakeChange('none')` }
            ])}
            <div id="weaknessFoodSubWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-3 space-y-2.5">
              <div class="text-xs font-semibold text-slate-700">ระดับปริมาณอาหารที่ทานได้ลดลง</div>
              ${renderWeakGrid('grid-cols-1 sm:grid-cols-3', [
                { kind: 'radio', name: 'weaknessFoodSubLevel', value: 'reduced_mild', title: ['ทานได้ใกล้เคียงเดิม', '(> 75%)'] },
                { kind: 'radio', name: 'weaknessFoodSubLevel', value: 'reduced_moderate', title: ['ทานได้ประมาณ', 'ครึ่งหนึ่ง (~50%)'] },
                { kind: 'radio', name: 'weaknessFoodSubLevel', value: 'reduced_severe', title: ['ทานได้ไม่เกิน', '1–2 คำ (< 25%)'] }
              ], { compact: true })}
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100">
            ${renderWeakSysHeader({
              label: '2.2 การดื่มน้ำและของเหลว',
              icon: 'cup-soda',
              colorClass: 'bg-teal-100 text-teal-700'
            })}
            ${renderWeakGrid('grid-cols-1 sm:grid-cols-3', [
              { kind: 'radio', name: 'weaknessDrinkStatus', value: 'normal', title: ['ดื่มน้ำได้ตามปกติ'] },
              { kind: 'radio', name: 'weaknessDrinkStatus', value: 'minimal_dry', title: ['ดื่มน้ำได้น้อยมาก', 'ปากคอแห้ง'] },
              { kind: 'radio', name: 'weaknessDrinkStatus', value: 'none_or_vomit', title: ['ดื่มไม่ได้เลย /', 'อาเจียนออกหมด'] }
            ])}
          </div>

          <div class="pt-4 border-t border-slate-100">
            ${renderWeakSysHeader({
              label: '2.3 ปริมาณปัสสาวะและการขับถ่าย',
              icon: 'droplet',
              colorClass: 'bg-teal-100 text-teal-700'
            })}
            ${renderWeakGrid('grid-cols-1 sm:grid-cols-2', [
              { kind: 'radio', name: 'weaknessUrineOutput', value: 'normal', title: ['ปัสสาวะออกปกติ'] },
              { kind: 'radio', name: 'weaknessUrineOutput', value: 'oliguria_dark', title: ['ปัสสาวะออกน้อย', 'สีเหลืองเข้มจัด'] },
              { kind: 'radio', name: 'weaknessUrineOutput', value: 'anuria_gte8h', title: ['ไม่มีปัสสาวะเลย', 'เกิน 8–12 ชั่วโมง'] },
              { kind: 'radio', name: 'weaknessUrineOutput', value: 'unnoticed', title: ['ไม่ได้สังเกต'] }
            ])}
          </div>
        </div>
      </div>

      <!-- CARD 3: สัญญาณเตือน อาการทางสมอง และอาการร่วมในระบบอื่น -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="shield-alert" class="w-5 h-5"></i>
          </div>
          <h2 class="text-base font-bold text-slate-900">3. สัญญาณเตือน อาการทางสมอง และอาการร่วมในระบบอื่น</h2>
        </div>

        <div class="space-y-4">
          <div>
            ${renderWeakSysHeader({
              label: '3.1 อาการเตือนสำคัญในขณะนี้ (เลือกได้หลายข้อ)',
              icon: 'alert-triangle',
              colorClass: 'bg-amber-100 text-amber-700',
              toggleId: 'weakness_warn_none',
              toggleName: 'weaknessWarningSigns',
              toggleValue: 'none_warning',
              toggleLabel: 'ไม่มีอาการในหมวดนี้',
              toggleOnchange: 'handleWeaknessWarningNoneToggle(this)'
            })}
            ${renderWeakGrid('grid-cols-1 sm:grid-cols-2', [
              { name: 'weaknessWarningSigns', value: 'altered_mental', title: ['ซึมลงมาก สับสน', 'ปลุกตื่นยาก'], onchange: 'handleWeaknessWarningItemChange(this)' },
              { name: 'weaknessWarningSigns', value: 'tachypnea', title: ['หายใจหอบเร็ว /', 'เหนื่อยลึก'], onchange: 'handleWeaknessWarningItemChange(this)' },
              { name: 'weaknessWarningSigns', value: 'syncope_orthostasis', title: ['หน้ามืด วูบหมดสติ', 'ขณะลุกยืน'], onchange: 'handleWeaknessWarningItemChange(this)' },
              { name: 'weaknessWarningSigns', value: 'cold_diaphoresis', title: ['เหงื่อแตกท่วมตัว', 'มือเท้าเย็นจัด'], onchange: 'handleWeaknessWarningItemChange(this)' },
              { name: 'weaknessWarningSigns', value: 'fever_hypothermia', title: ['ไข้สูง หนาวสั่น', 'หรือตัวเย็นจัด'], onchange: 'handleWeaknessWarningItemChange(this)' },
              { name: 'weaknessWarningSigns', value: 'chest_tightness', title: ['แน่นอึดอัดหน้าอก', '/ จุกคอหอย'], onchange: 'handleWeaknessWarningItemChange(this)' }
            ])}
          </div>

          <div class="pt-4 border-t border-slate-100">
            ${renderWeakSysHeader({
              label: '3.2 ลักษณะอาการแขนขาอ่อนแรง',
              icon: 'zap',
              colorClass: 'bg-amber-100 text-amber-700'
            })}
            ${renderWeakGrid('grid-cols-1 sm:grid-cols-2', [
              { kind: 'radio', name: 'weaknessFocalNeuro', value: 'unilateral_weakness', title: ['อ่อนแรงครึ่งซีก', '/ ปากเบี้ยว /', 'พูดไม่ชัด'] },
              { kind: 'radio', name: 'weaknessFocalNeuro', value: 'ascending_paralysis', title: ['อ่อนแรงไล่จากเท้า', 'ขึ้นมาที่แขน', 'และลำตัว'] },
              { kind: 'radio', name: 'weaknessFocalNeuro', value: 'generalized_symmetric', title: ['อ่อนแรง 2 ข้าง', 'เท่ากัน'] },
              { kind: 'radio', name: 'weaknessFocalNeuro', value: 'no_motor_weakness', title: ['ไม่อ่อนแรงแขนขา', 'แค่อ่อนเพลียทั้งตัว'] }
            ])}
          </div>

          <div class="pt-4 border-t border-slate-100">
            ${renderWeakSysHeader({
              label: '3.3 อาการบ่งชี้การติดเชื้อ (เลือกได้หลายข้อ)',
              icon: 'thermometer',
              colorClass: 'bg-sky-100 text-sky-700',
              toggleId: 'weakness_inf_none',
              toggleName: 'weaknessInfectionSigns',
              toggleValue: 'none_infection',
              toggleLabel: 'ไม่มีอาการในหมวดนี้',
              toggleOnchange: 'handleWeaknessInfectionNoneToggle(this)'
            })}
            ${renderWeakGrid('grid-cols-1 sm:grid-cols-3', [
              { id: 'weaknessInfUrtiCb', name: 'weaknessInfectionSigns', value: 'urti', title: ['น้ำมูก / เจ็บคอ', 'ครั่นเนื้อครั่นตัว'], onchange: 'handleWeaknessInfUrtiToggle(this)' },
              { name: 'weaknessInfectionSigns', value: 'uti', title: ['ปัสสาวะแสบขัด /', 'ขุ่น / กลิ่นเหม็น'], onchange: 'handleWeaknessInfectionItemChange(this)' },
              { id: 'weaknessInfPneumoniaCb', name: 'weaknessInfectionSigns', value: 'pneumonia', title: ['ไอเสมหะเหลืองเขียว', '/ หายใจครืดคราด'], onchange: 'handleWeaknessInfPneumoniaToggle(this)' }
            ])}
            <div id="weaknessUrtiSubWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-3 space-y-2.5">
              <div class="text-xs font-bold text-slate-800 flex items-center"><i data-lucide="corner-down-right" class="w-3.5 h-3.5 mr-1 text-medical-600"></i> เจาะลึกอาการไข้หวัด / ติดเชื้อทางเดินหายใจส่วนบน (เลือกได้หลายข้อ)</div>
              ${renderWeakGrid('grid-cols-1 sm:grid-cols-2', [
                { name: 'weaknessUrtiDetails', value: 'urti_sore_throat', title: ['เจ็บคอ /', 'กลืนน้ำลายเจ็บ'] },
                { name: 'weaknessUrtiDetails', value: 'urti_rhinorrhea', title: ['มีน้ำมูก /', 'คัดจมูก'] },
                { name: 'weaknessUrtiDetails', value: 'urti_viral_myalgia', title: ['ปวดเมื่อยตามตัว /', 'ปวดกระบอกตา'] },
                { name: 'weaknessUrtiDetails', value: 'urti_viral_rash_eye', title: ['มีผื่นตามตัว /', 'ตาแดง'] }
              ], { compact: true })}
            </div>
            <div id="weaknessPneumoniaSubWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-3 space-y-2.5">
              <div class="text-xs font-bold text-slate-800 flex items-center"><i data-lucide="corner-down-right" class="w-3.5 h-3.5 mr-1 text-medical-600"></i> เจาะลึกอาการไอเสมหะเหลืองเขียว / หายใจครืดคราด (เลือกได้หลายข้อ)</div>
              ${renderWeakGrid('grid-cols-1 sm:grid-cols-2', [
                { name: 'weaknessPneumoniaDetails', value: 'pneu_purulent_sputum', title: ['เสมหะข้นสีเหลือง', '/ สีเขียว'] },
                { name: 'weaknessPneumoniaDetails', value: 'pneu_hemoptysis_rusty', title: ['เสมหะปนเลือด', '/ สีสนิม'] },
                { name: 'weaknessPneumoniaDetails', value: 'pneu_noisy_wheeze', title: ['หายใจมีเสียง', 'ครืดคราด / หวีด'] },
                { name: 'weaknessPneumoniaDetails', value: 'pneu_pleuritic_pain', title: ['เจ็บแปล๊บหน้าอก', 'เวลาไอ / หายใจ'] },
                { name: 'weaknessPneumoniaDetails', value: 'pneu_aspiration_history', title: ['มีประวัติสำลักน้ำ', 'หรืออาหาร'] },
                { name: 'weaknessPneumoniaDetails', value: 'pneu_chronic_cough_2w', title: ['ไอมานาน', 'เกิน 2 สัปดาห์'] }
              ], { compact: true })}
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100">
            ${renderWeakSysHeader({
              label: '3.4 อาการทางเดินอาหารและภาวะซีด (เลือกได้หลายข้อ)',
              icon: 'heart-pulse',
              colorClass: 'bg-rose-100 text-rose-700',
              toggleId: 'weakness_gi_none',
              toggleName: 'weaknessGiAnemiaSigns',
              toggleValue: 'none_gi_anemia',
              toggleLabel: 'ไม่มีอาการในหมวดนี้',
              toggleOnchange: 'handleWeaknessGiAnemiaNoneToggle(this)'
            })}
            ${renderWeakGrid('grid-cols-1 sm:grid-cols-2', [
              { id: 'weaknessGiAbdpainCb', name: 'weaknessGiAnemiaSigns', value: 'abdominal_pain', title: ['ปวดท้อง'], onchange: 'handleWeaknessGiAbdpainToggle(this)' },
              { id: 'weaknessGiVomitCb', name: 'weaknessGiAnemiaSigns', value: 'nausea_vomiting', title: ['คลื่นไส้ / อาเจียน', 'หลายครั้ง'], onchange: 'handleWeaknessGiVomitToggle(this)' },
              { name: 'weaknessGiAnemiaSigns', value: 'constipation', title: ['ท้องผูกไม่ถ่าย', 'หลายวัน'], onchange: 'handleWeaknessGiAnemiaItemChange(this)' },
              { name: 'weaknessGiAnemiaSigns', value: 'melena_hematochezia', title: ['ถ่ายอุจจาระดำ', 'หรือถ่ายเป็น', 'เลือดสด'], onchange: 'handleWeaknessGiAnemiaItemChange(this)' },
              { name: 'weaknessGiAnemiaSigns', value: 'pallor', title: ['ผิวซีด / เยื่อบุตา', 'ซีดขาวผิดปกติ'], onchange: 'handleWeaknessGiAnemiaItemChange(this)' },
              { id: 'weaknessGiWeightLossCb', name: 'weaknessGiAnemiaSigns', value: 'weight_loss', title: ['น้ำหนักลดฮวบ', 'โดยไม่ได้ตั้งใจ'], onchange: 'handleWeaknessGiWeightLossToggle(this)' }
            ])}
            <div id="weaknessAbdpainSubWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-3 space-y-3">
              <div class="text-xs font-bold text-slate-800 flex items-center"><i data-lucide="corner-down-right" class="w-3.5 h-3.5 mr-1 text-medical-600"></i> เจาะลึกอาการปวดท้อง</div>
              <div>
                <div class="text-[11px] font-semibold text-slate-600 mb-1.5">ตำแหน่งที่ปวดท้อง (เลือกได้หลายข้อ):</div>
                ${renderWeakGrid('grid-cols-2 sm:grid-cols-4', [
                  { name: 'weaknessAbdpainLocs', value: 'epigastrium', title: ['ใต้ลิ้นปี่'] },
                  { name: 'weaknessAbdpainLocs', value: 'ruq', title: ['ชายโครงขวา'] },
                  { name: 'weaknessAbdpainLocs', value: 'luq', title: ['ชายโครงซ้าย'] },
                  { name: 'weaknessAbdpainLocs', value: 'periumbilical', title: ['รอบสะดือ'] },
                  { name: 'weaknessAbdpainLocs', value: 'rlq', title: ['ท้องน้อยขวา'] },
                  { name: 'weaknessAbdpainLocs', value: 'llq', title: ['ท้องน้อยซ้าย'] },
                  { name: 'weaknessAbdpainLocs', value: 'suprapubic', title: ['เหนือหัวเหน่า'] },
                  { name: 'weaknessAbdpainLocs', value: 'diffuse', title: ['ปวดทั่วท้อง'] }
                ], { compact: true })}
              </div>
              <div>
                <div class="text-[11px] font-semibold text-slate-600 mb-1.5">ลักษณะการปวดท้อง:</div>
                ${renderWeakGrid('grid-cols-1 sm:grid-cols-2', [
                  { kind: 'radio', name: 'weaknessAbdpainChar', value: 'colicky_spasm', title: ['ปวดบิดเกร็ง', 'เป็นพักๆ'] },
                  { kind: 'radio', name: 'weaknessAbdpainChar', value: 'dull_aching', title: ['ปวดตื้อแน่น', 'ตลอดเวลา'] },
                  { kind: 'radio', name: 'weaknessAbdpainChar', value: 'burning', title: ['แสบร้อน', 'กลางอก / ลิ้นปี่'] },
                  { kind: 'radio', name: 'weaknessAbdpainChar', value: 'sharp_severe', title: ['ปวดรุนแรงเฉียบพลัน', '/ เสียดแทง'] }
                ], { compact: true })}
              </div>
            </div>
            <div id="weaknessVomitSubWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-3 space-y-2.5">
              <div class="text-xs font-bold text-slate-800 flex items-center"><i data-lucide="corner-down-right" class="w-3.5 h-3.5 mr-1 text-medical-600"></i> เจาะลึกอาการคลื่นไส้ / อาเจียน</div>
              <div class="flex flex-wrap items-center gap-3">
                <div class="flex items-center space-x-2">
                  <label class="text-xs font-semibold text-slate-700">จำนวนครั้งต่อวัน:</label>
                  <input type="number" id="weaknessVomitFreq" min="0" max="50" placeholder="เช่น 3"
                    class="w-20 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-semibold">
                  <span class="text-xs text-slate-500">ครั้ง/วัน</span>
                </div>
                ${renderWeakOption({ id: 'weaknessVomitNauseaOnly', title: ['คลื่นไส้อย่างเดียว', '(ยังไม่อาเจียน)'], onchange: 'handleWeaknessVomitNauseaOnlyToggle(this)', compact: true })}
              </div>
              <div id="weaknessVomitContentsWrap" class="space-y-1.5">
                <div class="text-[11px] font-semibold text-slate-600">ลักษณะสิ่งที่อาเจียนออกมา (เลือกได้หลายข้อ):</div>
                ${renderWeakGrid('grid-cols-2 sm:grid-cols-4', [
                  { name: 'weaknessVomitContents', value: 'food_gastric', title: ['เศษอาหาร /', 'น้ำย่อยเหลือง'] },
                  { name: 'weaknessVomitContents', value: 'bile_green', title: ['น้ำดีสีเขียว'] },
                  { name: 'weaknessVomitContents', value: 'coffee_ground', title: ['สีกาแฟคั่ว /', 'สีดำคล้ำ'] },
                  { name: 'weaknessVomitContents', value: 'bloody', title: ['มีเลือดสดปน'] }
                ], { compact: true })}
              </div>
            </div>
            <div id="weaknessWeightLossSubWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-3 space-y-2">
              <div class="text-xs font-bold text-slate-800 flex items-center"><i data-lucide="corner-down-right" class="w-3.5 h-3.5 mr-1 text-medical-600"></i> ระบุน้ำหนักที่ลดลงโดยประมาณ และช่วงเวลา</div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label class="block text-[11px] font-medium text-slate-600 mb-1">ลดลงประมาณกี่ kg</label>
                  <input type="number" step="0.5" id="weaknessWeightLossKg" min="0.5" max="150" placeholder="เช่น 5"
                    class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800">
                </div>
                <div>
                  <label class="block text-[11px] font-medium text-slate-600 mb-1">ในช่วงเวลานาน</label>
                  <input type="number" id="weaknessWeightLossDurVal" min="1" max="120" placeholder="เช่น 2"
                    class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800">
                </div>
                <div>
                  <label class="block text-[11px] font-medium text-slate-600 mb-1">หน่วยเวลา</label>
                  <select id="weaknessWeightLossDurUnit"
                    class="w-full bg-white border border-slate-300 rounded-lg px-2 py-2 text-xs font-medium text-slate-800">
                    <option value="weeks">สัปดาห์</option>
                    <option value="months" selected>เดือน</option>
                    <option value="years">ปี</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 4: ประวัติยา สเตียรอยด์ และสารต้องสงสัย -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="pill" class="w-5 h-5"></i>
          </div>
          <h2 class="text-base font-bold text-slate-900">4. ประวัติยา สเตียรอยด์ และสารต้องสงสัย</h2>
        </div>

        <div class="space-y-4">
          <div>
            ${renderWeakSysHeader({
              label: '4.1 ยาประจำตัวกลุ่มสำคัญที่ใช้อยู่ (เลือกได้หลายข้อ)',
              icon: 'pill',
              colorClass: 'bg-indigo-100 text-indigo-700',
              toggleId: 'weakness_meds_none',
              toggleName: 'weaknessCurrentMedsList',
              toggleValue: 'none_meds',
              toggleLabel: 'ไม่มีในหมวดนี้',
              toggleOnchange: 'handleWeaknessMedsNoneToggle(this)'
            })}
            ${renderWeakGrid('grid-cols-1 sm:grid-cols-2', [
              { name: 'weaknessCurrentMedsList', value: 'diabetic_meds', title: ['ยารักษาเบาหวาน', '(ยากิน / อินซูลิน)'], onchange: 'handleWeaknessMedsItemChange(this)' },
              { name: 'weaknessCurrentMedsList', value: 'diuretics', title: ['ยาขับปัสสาวะ'], desc: 'เช่น Furosemide, HCTZ', onchange: 'handleWeaknessMedsItemChange(this)' },
              { name: 'weaknessCurrentMedsList', value: 'cardiac_meds', title: ['ยารักษาโรคหัวใจ'], desc: 'เช่น Digoxin, Amiodarone', onchange: 'handleWeaknessMedsItemChange(this)' },
              { name: 'weaknessCurrentMedsList', value: 'sedatives', title: ['ยานอนหลับ /', 'ยากล่อมประสาท'], onchange: 'handleWeaknessMedsItemChange(this)' }
            ])}
          </div>

          <div class="pt-4 border-t border-slate-100">
            ${renderWeakSysHeader({
              label: '4.2 ประวัติยาชุด ยาลูกกลอน และสเตียรอยด์',
              icon: 'shield-check',
              colorClass: 'bg-indigo-100 text-indigo-700'
            })}
            ${renderWeakGrid('grid-cols-1 sm:grid-cols-2', [
              { kind: 'radio', name: 'weaknessSteroidHistory', value: 'steroid_withdrawal', title: ['กินยาชุด / ยาลูกกลอน', '/ สเตียรอยด์', 'แล้วเพิ่งหยุดยา'] },
              { kind: 'radio', name: 'weaknessSteroidHistory', value: 'none_steroid', title: ['ไม่มีประวัติยาชุด', 'หรือสเตียรอยด์'] }
            ])}
          </div>

          <div class="pt-4 border-t border-slate-100">
            ${renderWeakSysHeader({
              label: '4.3 ประวัติยา อาหาร หรือสารอื่นที่สงสัย',
              icon: 'flask-conical',
              colorClass: 'bg-amber-100 text-amber-700'
            })}
            ${renderWeakGrid('grid-cols-1 sm:grid-cols-2', [
              { kind: 'radio', name: 'weaknessCustomSubstanceCheck', value: 'has_custom_substance', title: ['มียา อาหาร /', 'สารอื่นที่สงสัย'], onchange: `handleWeaknessCustomSubstanceChange('has_custom_substance')` },
              { kind: 'radio', name: 'weaknessCustomSubstanceCheck', value: 'no_custom_substance', title: ['ไม่มีสาร / ยา', 'ที่สงสัย'], onchange: `handleWeaknessCustomSubstanceChange('no_custom_substance')` }
            ])}
            <div id="weaknessCustomSubstanceWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-3 space-y-2">
              <label class="block text-xs font-semibold text-slate-700">ระบุชื่อยา อาหาร หรือสารที่สงสัย:</label>
              <input type="text" id="weaknessCustomSubstanceText" placeholder="เช่น ยาสมุนไพร ยาต้ม ยาชุด..."
                class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
            </div>
          </div>
        </div>
      </div>

      <!-- อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100">
          <div class="bg-slate-100 text-slate-600 p-2 rounded-xl">
            <i data-lucide="message-square-plus" class="w-5 h-5"></i>
          </div>
          <h2 class="text-base font-bold text-slate-800">อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2>
        </div>
        <textarea id="weakness_other_free" rows="2" placeholder="พิมพ์ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)..."
          class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"></textarea>
      </div>
    </div>
  `,

  // --- Lifecycle Hooks ---
  onMounted: function() {},
  onSelectForm: function() {},
  onActivate: function() {},
  onTitleChange: function() {},

  collectIntake: function(ctx) {
    ctx = ctx || {};
    const _rawDur = parseFloat(getWeakEl('weaknessDurationVal')?.value);
    const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
    const durationUnit = getWeakEl('weaknessDurationUnit')?.value || 'days';

    const getRadio = (name) => queryWeakOne(`input[name="${name}"]:checked`)?.value || '';
    const getChecks = (name) => queryWeakAll(`input[name="${name}"]:checked`).map(el => el.value);

    const weaknessOnsetPattern = getRadio('weaknessOnsetPattern');
    const weaknessOnsetExactDate = getWeakEl('weaknessOnsetExactDate')?.value?.trim() || '';
    const weaknessOnsetExactTime = getWeakEl('weaknessOnsetExactTime')?.value?.trim() || '';

    const weaknessBaselineFunctional = getRadio('weaknessBaselineFunctional');
    const weaknessCurrentFunctional = getRadio('weaknessCurrentFunctional');

    const weaknessFoodIntake = getRadio('weaknessFoodIntake');
    const weaknessFoodSubLevel = weaknessFoodIntake === 'reduced' ? getRadio('weaknessFoodSubLevel') : '';
    const weaknessDrinkStatus = getRadio('weaknessDrinkStatus');
    const weaknessUrineOutput = getRadio('weaknessUrineOutput');

    const weaknessWarningSigns = getChecks('weaknessWarningSigns');
    const weaknessFocalNeuro = getRadio('weaknessFocalNeuro');

    const weaknessInfectionSigns = getChecks('weaknessInfectionSigns');
    const weaknessUrtiDetails = weaknessInfectionSigns.includes('urti') ? getChecks('weaknessUrtiDetails') : [];
    const weaknessPneumoniaDetails = weaknessInfectionSigns.includes('pneumonia') ? getChecks('weaknessPneumoniaDetails') : [];

    const weaknessGiAnemiaSigns = getChecks('weaknessGiAnemiaSigns');
    const weaknessAbdpainLocs = weaknessGiAnemiaSigns.includes('abdominal_pain') ? getChecks('weaknessAbdpainLocs') : [];
    const weaknessAbdpainChar = weaknessGiAnemiaSigns.includes('abdominal_pain') ? getRadio('weaknessAbdpainChar') : '';
    const hasGiVomit = weaknessGiAnemiaSigns.includes('nausea_vomiting');
    const weaknessVomitNauseaOnly = hasGiVomit ? Boolean(getWeakEl('weaknessVomitNauseaOnly')?.checked) : false;
    const _rawVomitFreq = parseInt(getWeakEl('weaknessVomitFreq')?.value, 10);
    const weaknessVomitFreq = (hasGiVomit && !weaknessVomitNauseaOnly && !isNaN(_rawVomitFreq) && _rawVomitFreq > 0) ? _rawVomitFreq : null;
    const weaknessVomitContents = (hasGiVomit && !weaknessVomitNauseaOnly) ? getChecks('weaknessVomitContents') : [];
    const hasGiWl = weaknessGiAnemiaSigns.includes('weight_loss');
    const _rawWlKg = parseFloat(getWeakEl('weaknessWeightLossKg')?.value);
    const weaknessWeightLossKg = (hasGiWl && !isNaN(_rawWlKg) && _rawWlKg > 0) ? _rawWlKg : null;
    const _rawWlDur = parseInt(getWeakEl('weaknessWeightLossDurVal')?.value, 10);
    const weaknessWeightLossDurVal = (hasGiWl && !isNaN(_rawWlDur) && _rawWlDur > 0) ? _rawWlDur : null;
    const weaknessWeightLossDurUnit = hasGiWl ? (getWeakEl('weaknessWeightLossDurUnit')?.value || 'months') : 'months';

    const weaknessSteroidHistory = getRadio('weaknessSteroidHistory');
    const weaknessCurrentMedsList = getChecks('weaknessCurrentMedsList');
    const weaknessCustomSubstanceCheck = getRadio('weaknessCustomSubstanceCheck');
    const weaknessCustomSubstanceText = weaknessCustomSubstanceCheck === 'has_custom_substance'
      ? (getWeakEl('weaknessCustomSubstanceText')?.value?.trim() || '')
      : '';

    const rec = {
      id: ctx.recordId || ctx.id || `case-${Date.now()}`,
      queue_number: ctx.queueNumber || ctx.queue_number || 'ER-NEW',
      hn: ctx.randomHn || ctx.hn || '-',
      name: ctx.patientName || ctx.name || 'ไม่ระบุชื่อ',
      age: ctx.patientAge !== undefined ? ctx.patientAge : (ctx.age !== undefined ? ctx.age : 'ไม่ได้ระบุ'),
      gender: ctx.gender || 'ไม่ระบุ',
      chief_complaint: 'weakness',
      chief_complaint_title: 'อ่อนเพลีย / กินไม่ได้ / ไม่มีแรง',
      timestamp: new Date().toISOString(),
      status: ctx.recordStatus || ctx.status || 'waiting',
      durationVal,
      durationUnit,
      hospRecordStatus: ctx.hospRecordStatus || 'unspecified',
      underlying: Array.isArray(ctx.underlying) ? ctx.underlying : [],
      drugAllergy: ctx.drugAllergy || 'ไม่ได้ระบุ',
      currentMeds: ctx.currentMeds || 'ไม่ได้ระบุ',
      otherSymptomsFree: getWeakEl('weakness_other_free')?.value?.trim() || ctx.otherSymptomsFree || '',
      doctor_notes: ctx.preservedDoctorNotes || ctx.doctor_notes || { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },

      weaknessOnsetPattern,
      weaknessOnsetExactDate,
      weaknessOnsetExactTime,
      weaknessBaselineFunctional,
      weaknessCurrentFunctional,
      weaknessFoodIntake,
      weaknessFoodSubLevel,
      weaknessDrinkStatus,
      weaknessUrineOutput,
      weaknessWarningSigns,
      weaknessFocalNeuro,
      weaknessInfectionSigns,
      weaknessUrtiDetails,
      weaknessPneumoniaDetails,
      weaknessGiAnemiaSigns,
      weaknessAbdpainLocs,
      weaknessAbdpainChar,
      weaknessVomitNauseaOnly,
      weaknessVomitFreq,
      weaknessVomitContents,
      weaknessWeightLossKg,
      weaknessWeightLossDurVal,
      weaknessWeightLossDurUnit,
      weaknessSteroidHistory,
      weaknessCurrentMedsList,
      weaknessCustomSubstanceCheck,
      weaknessCustomSubstanceText
    };

    updateWeaknessOutputs(rec);
    return rec;
  },

  populateForm: function(patient) {
    if (!patient) return;
    this.resetForm();

    const setVal = (id, val) => {
      const el = getWeakEl(id);
      if (el) el.value = val !== undefined && val !== null ? val : '';
    };
    const setRadio = (name, val) => {
      if (!val) return;
      const r = queryWeakOne(`input[name="${name}"][value="${val}"]`);
      if (r) r.checked = true;
    };
    const setChecks = (name, arr) => {
      if (!Array.isArray(arr)) return;
      queryWeakAll(`input[name="${name}"]`).forEach(cb => {
        cb.checked = arr.includes(cb.value);
      });
    };

    setVal('weaknessDurationVal', patient.durationVal || '');
    setVal('weaknessDurationUnit', patient.durationUnit || 'days');
    setVal('weaknessOnsetExactDate', patient.weaknessOnsetExactDate || '');
    setVal('weaknessOnsetExactTime', patient.weaknessOnsetExactTime || '');

    setRadio('weaknessOnsetPattern', patient.weaknessOnsetPattern);
    setRadio('weaknessBaselineFunctional', patient.weaknessBaselineFunctional);
    setRadio('weaknessCurrentFunctional', patient.weaknessCurrentFunctional);

    setRadio('weaknessFoodIntake', patient.weaknessFoodIntake);
    handleWeaknessFoodIntakeChange(patient.weaknessFoodIntake);
    setRadio('weaknessFoodSubLevel', patient.weaknessFoodSubLevel);

    setRadio('weaknessDrinkStatus', patient.weaknessDrinkStatus);
    setRadio('weaknessUrineOutput', patient.weaknessUrineOutput);

    setChecks('weaknessWarningSigns', patient.weaknessWarningSigns);
    setRadio('weaknessFocalNeuro', patient.weaknessFocalNeuro);

    const infArr = Array.isArray(patient.weaknessInfectionSigns) ? patient.weaknessInfectionSigns : [];
    setChecks('weaknessInfectionSigns', infArr);
    handleWeaknessInfUrtiToggle({ checked: infArr.includes('urti') });
    setChecks('weaknessUrtiDetails', patient.weaknessUrtiDetails);
    handleWeaknessInfPneumoniaToggle({ checked: infArr.includes('pneumonia') });
    setChecks('weaknessPneumoniaDetails', patient.weaknessPneumoniaDetails);

    const giArr = Array.isArray(patient.weaknessGiAnemiaSigns) ? patient.weaknessGiAnemiaSigns : [];
    setChecks('weaknessGiAnemiaSigns', giArr);
    handleWeaknessGiAbdpainToggle({ checked: giArr.includes('abdominal_pain') });
    setChecks('weaknessAbdpainLocs', patient.weaknessAbdpainLocs);
    setRadio('weaknessAbdpainChar', patient.weaknessAbdpainChar);

    handleWeaknessGiVomitToggle({ checked: giArr.includes('nausea_vomiting') });
    const nauseaOnlyEl = getWeakEl('weaknessVomitNauseaOnly');
    if (nauseaOnlyEl) {
      nauseaOnlyEl.checked = Boolean(patient.weaknessVomitNauseaOnly);
      handleWeaknessVomitNauseaOnlyToggle(nauseaOnlyEl);
    }
    setVal('weaknessVomitFreq', patient.weaknessVomitFreq || '');
    setChecks('weaknessVomitContents', patient.weaknessVomitContents);

    handleWeaknessGiWeightLossToggle({ checked: giArr.includes('weight_loss') });
    setVal('weaknessWeightLossKg', patient.weaknessWeightLossKg || '');
    setVal('weaknessWeightLossDurVal', patient.weaknessWeightLossDurVal || '');
    setVal('weaknessWeightLossDurUnit', patient.weaknessWeightLossDurUnit || 'months');

    setRadio('weaknessSteroidHistory', patient.weaknessSteroidHistory);
    setChecks('weaknessCurrentMedsList', patient.weaknessCurrentMedsList);

    setRadio('weaknessCustomSubstanceCheck', patient.weaknessCustomSubstanceCheck);
    handleWeaknessCustomSubstanceChange(patient.weaknessCustomSubstanceCheck);
    setVal('weaknessCustomSubstanceText', patient.weaknessCustomSubstanceText || '');
    setVal('weakness_other_free', patient.otherSymptomsFree || '');
  },

  resetForm: function() {
    this.inputIdsToClear.forEach(id => {
      const el = getWeakEl(id);
      if (el) el.value = '';
    });
    const durUnit = getWeakEl('weaknessDurationUnit');
    if (durUnit) durUnit.value = 'days';
    const wlUnit = getWeakEl('weaknessWeightLossDurUnit');
    if (wlUnit) wlUnit.value = 'months';

    [
      'weaknessOnsetPattern', 'weaknessBaselineFunctional', 'weaknessCurrentFunctional',
      'weaknessFoodIntake', 'weaknessFoodSubLevel', 'weaknessDrinkStatus',
      'weaknessUrineOutput', 'weaknessFocalNeuro', 'weaknessAbdpainChar',
      'weaknessSteroidHistory', 'weaknessCustomSubstanceCheck'
    ].forEach(n => queryWeakAll(`input[name="${n}"]`).forEach(r => { r.checked = false; }));

    [
      'weaknessWarningSigns', 'weaknessInfectionSigns', 'weaknessUrtiDetails', 'weaknessPneumoniaDetails',
      'weaknessGiAnemiaSigns', 'weaknessAbdpainLocs', 'weaknessVomitContents', 'weaknessCurrentMedsList'
    ].forEach(n => queryWeakAll(`input[name="${n}"]`).forEach(cb => { cb.checked = false; }));

    const nauseaOnlyEl = getWeakEl('weaknessVomitNauseaOnly');
    if (nauseaOnlyEl) nauseaOnlyEl.checked = false;

    this.branchIds.forEach(id => {
      const el = getWeakEl(id);
      if (!el) return;
      if (id === 'weaknessVomitContentsWrap') el.classList.remove('hidden');
      else el.classList.add('hidden');
    });
  },

  hydrateForm: function(patient) {
    this.populateForm(patient);
  },

  isRedFlag: function(patient) {
    return evaluateWeaknessRedFlags(patient).length > 0;
  },

  evaluateRedFlags: evaluateWeaknessRedFlags,
  updateOutputs: updateWeaknessOutputs,

  seedPatients: [
    {
      id: 'case-150',
      queue_number: 'Q-001',
      hn: '6715012',
      name: 'นางสมควร บุญเรือง',
      age: 76,
      gender: 'หญิง',
      chief_complaint: 'weakness',
      chief_complaint_title: 'อ่อนเพลีย / กินไม่ได้ / ไม่มีแรง',
      timestamp: '2026-10-26T06:45:00.000Z',
      status: 'waiting',
      durationVal: 2,
      durationUnit: 'days',
      hospRecordStatus: 'self',
      underlying: ['เบาหวาน (DM)', 'ความดันสูง (HT)'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Glipizide 5 mg, Metformin 500 mg, Amlodipine 5 mg',
      otherSymptomsFree: '',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 38.6, sbp: 90, dbp: 56, bp: '90/56', pr: 118, rr: 24, spo2: 95 },

      weaknessOnsetPattern: 'acute_rapid',
      weaknessOnsetExactDate: '24/10/2026',
      weaknessOnsetExactTime: '08:00',
      weaknessBaselineFunctional: 'independent',
      weaknessCurrentFunctional: 'bedbound',
      weaknessFoodIntake: 'none',
      weaknessFoodSubLevel: '',
      weaknessDrinkStatus: 'minimal_dry',
      weaknessUrineOutput: 'anuria_gte8h',
      weaknessWarningSigns: ['altered_mental', 'tachypnea', 'fever_hypothermia', 'cold_diaphoresis'],
      weaknessFocalNeuro: 'generalized_symmetric',
      weaknessInfectionSigns: ['uti'],
      weaknessGiAnemiaSigns: ['none_gi_anemia'],
      weaknessSteroidHistory: 'none_steroid',
      weaknessCurrentMedsList: ['diabetic_meds'],
      weaknessCustomSubstanceCheck: 'no_custom_substance',
      weaknessCustomSubstanceText: ''
    },
    {
      id: 'case-151',
      queue_number: 'Q-002',
      hn: '6715123',
      name: 'นายประสิทธิ์ มงคลชัย',
      age: 71,
      gender: 'ชาย',
      chief_complaint: 'weakness',
      chief_complaint_title: 'อ่อนเพลีย / กินไม่ได้ / ไม่มีแรง',
      timestamp: '2026-10-26T07:30:00.000Z',
      status: 'waiting',
      durationVal: 4,
      durationUnit: 'hours',
      hospRecordStatus: 'self',
      underlying: ['เบาหวาน (DM)'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Glipizide 5 mg 1 tab acเช้า',
      otherSymptomsFree: 'DTX ปลายนิ้วได้ 36 mg/dL',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.4, sbp: 130, dbp: 78, bp: '130/78', pr: 108, rr: 20, spo2: 98 },

      weaknessOnsetPattern: 'sudden',
      weaknessOnsetExactDate: '26/10/2026',
      weaknessOnsetExactTime: '03:30',
      weaknessBaselineFunctional: 'independent',
      weaknessCurrentFunctional: 'unresponsive',
      weaknessFoodIntake: 'none',
      weaknessFoodSubLevel: '',
      weaknessDrinkStatus: 'none_or_vomit',
      weaknessUrineOutput: 'normal',
      weaknessWarningSigns: ['altered_mental', 'cold_diaphoresis'],
      weaknessFocalNeuro: 'generalized_symmetric',
      weaknessInfectionSigns: ['none_infection'],
      weaknessGiAnemiaSigns: ['none_gi_anemia'],
      weaknessSteroidHistory: 'none_steroid',
      weaknessCurrentMedsList: ['diabetic_meds'],
      weaknessCustomSubstanceCheck: 'no_custom_substance',
      weaknessCustomSubstanceText: ''
    },
    {
      id: 'case-152',
      queue_number: 'Q-003',
      hn: '6715234',
      name: 'นางประนอม ศิริวัฒน์',
      age: 64,
      gender: 'หญิง',
      chief_complaint: 'weakness',
      chief_complaint_title: 'อ่อนเพลีย / กินไม่ได้ / ไม่มีแรง',
      timestamp: '2026-10-26T08:15:00.000Z',
      status: 'waiting',
      durationVal: 3,
      durationUnit: 'days',
      hospRecordStatus: 'self',
      underlying: ['ข้อเข่าเสื่อม (OA Knee)'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'ยาสมุนไพรลูกกลอนแก้ปวดเมื่อย (เพิ่งหยุดยา 3 วันก่อน)',
      otherSymptomsFree: 'ความดันโลหิตตก 88/54 mmHg',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.7, sbp: 88, dbp: 54, bp: '88/54', pr: 112, rr: 20, spo2: 98 },

      weaknessOnsetPattern: 'acute_rapid',
      weaknessOnsetExactDate: '23/10/2026',
      weaknessOnsetExactTime: '09:00',
      weaknessBaselineFunctional: 'needs_assistance',
      weaknessCurrentFunctional: 'bedbound',
      weaknessFoodIntake: 'reduced',
      weaknessFoodSubLevel: 'reduced_severe',
      weaknessDrinkStatus: 'minimal_dry',
      weaknessUrineOutput: 'oliguria_dark',
      weaknessWarningSigns: ['syncope_orthostasis', 'cold_diaphoresis'],
      weaknessFocalNeuro: 'generalized_symmetric',
      weaknessInfectionSigns: ['none_infection'],
      weaknessGiAnemiaSigns: ['nausea_vomiting'],
      weaknessSteroidHistory: 'steroid_withdrawal',
      weaknessCurrentMedsList: ['none_meds'],
      weaknessCustomSubstanceCheck: 'has_custom_substance',
      weaknessCustomSubstanceText: 'ยาสมุนไพรลูกกลอนแก้ปวดข้อ ทานต่อเนื่องมา 1 ปี เพิ่งหยุด 3 วันก่อน'
    },
    {
      id: 'case-153',
      queue_number: 'Q-004',
      hn: '6715345',
      name: 'นายวีระยุทธ คงเจริญ',
      age: 29,
      gender: 'ชาย',
      chief_complaint: 'weakness',
      chief_complaint_title: 'อ่อนเพลีย / กินไม่ได้ / ไม่มีแรง',
      timestamp: '2026-10-26T09:00:00.000Z',
      status: 'waiting',
      durationVal: 3,
      durationUnit: 'days',
      hospRecordStatus: 'self',
      underlying: ['ปฏิเสธ'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'ไม่มี',
      otherSymptomsFree: '',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 37.3, sbp: 118, dbp: 76, bp: '118/76', pr: 78, rr: 16, spo2: 99 },

      weaknessOnsetPattern: 'chronic_gradual',
      weaknessOnsetExactDate: '23/10/2026',
      weaknessOnsetExactTime: '10:00',
      weaknessBaselineFunctional: 'independent',
      weaknessCurrentFunctional: 'fatigued_mobile',
      weaknessFoodIntake: 'reduced',
      weaknessFoodSubLevel: 'reduced_mild',
      weaknessDrinkStatus: 'normal',
      weaknessUrineOutput: 'normal',
      weaknessWarningSigns: ['none_warning'],
      weaknessFocalNeuro: 'no_motor_weakness',
      weaknessInfectionSigns: ['urti'],
      weaknessGiAnemiaSigns: ['none_gi_anemia'],
      weaknessSteroidHistory: 'none_steroid',
      weaknessCurrentMedsList: ['none_meds'],
      weaknessCustomSubstanceCheck: 'no_custom_substance',
      weaknessCustomSubstanceText: ''
    }
  ]
};

// --- Register Module to Core Knowledge Base ---
if (typeof registerCcModule === 'function') {
  registerCcModule(weaknessModule);
} else if (typeof window !== 'undefined' && typeof window.registerCcModule === 'function') {
  window.registerCcModule(weaknessModule);
}

if (typeof window !== 'undefined') {
  window.handleWeaknessWarningItemChange = handleWeaknessWarningItemChange;
  window.handleWeaknessWarningNoneToggle = handleWeaknessWarningNoneToggle;
  window.handleWeaknessInfectionItemChange = handleWeaknessInfectionItemChange;
  window.handleWeaknessInfUrtiToggle = handleWeaknessInfUrtiToggle;
  window.handleWeaknessInfPneumoniaToggle = handleWeaknessInfPneumoniaToggle;
  window.handleWeaknessInfectionNoneToggle = handleWeaknessInfectionNoneToggle;
  window.handleWeaknessGiAnemiaItemChange = handleWeaknessGiAnemiaItemChange;
  window.handleWeaknessGiAbdpainToggle = handleWeaknessGiAbdpainToggle;
  window.handleWeaknessGiVomitToggle = handleWeaknessGiVomitToggle;
  window.handleWeaknessVomitNauseaOnlyToggle = handleWeaknessVomitNauseaOnlyToggle;
  window.handleWeaknessGiWeightLossToggle = handleWeaknessGiWeightLossToggle;
  window.handleWeaknessGiAnemiaNoneToggle = handleWeaknessGiAnemiaNoneToggle;
  window.handleWeaknessMedsItemChange = handleWeaknessMedsItemChange;
  window.handleWeaknessMedsNoneToggle = handleWeaknessMedsNoneToggle;
  window.handleWeaknessFoodIntakeChange = handleWeaknessFoodIntakeChange;
  window.handleWeaknessCustomSubstanceChange = handleWeaknessCustomSubstanceChange;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = weaknessModule;
}
