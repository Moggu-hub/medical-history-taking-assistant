// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 25_psychiatric_emergency.js
// อาการนำ: เอะอะโวยวาย / จิตเวช (Acute Agitation / Psychiatric Emergency)
// ปรับปรุงตามมาตรฐาน plan_psychiatric_emergency.md, plan-cc และ code-cc (กลุ่ม B2)
// =========================================================================

// --- Internal DOM & UI Helpers ---
function getPsychEl(id) {
  return typeof document !== 'undefined' ? document.getElementById(id) : null;
}

function queryPsychOne(selector) {
  return typeof document !== 'undefined' ? document.querySelector(selector) : null;
}

function queryPsychAll(selector) {
  return typeof document !== 'undefined' ? Array.from(document.querySelectorAll(selector)) : [];
}

function wrapPsychWords(chunks) {
  if (!Array.isArray(chunks)) return chunks;
  return chunks.map(c => `<span class="inline-block whitespace-nowrap">${c}</span>`).join(' ');
}

function renderPsychOption(cfg) {
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
  const titleHtml = Array.isArray(title) ? wrapPsychWords(title) : title;
  const bodyHtml = desc
    ? `<div class="ml-3 leading-snug"><span class="block text-xs sm:text-sm font-semibold text-slate-800">${titleHtml}</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">${desc}</span></div>`
    : `<span class="ml-3 ${compact ? 'text-xs' : 'text-xs sm:text-sm'} font-semibold text-slate-800 leading-snug">${titleHtml}</span>`;
  return `<label class="selectable-card bg-white flex ${alignCls} ${padCls} rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition${spanCls}"><input type="${kind}" ${idAttr}${nameAttr}${valAttr}${chgAttr}class="${topCls}${roundCls}text-medical-600 focus:ring-medical-500 ${szCls} flex-shrink-0">${bodyHtml}</label>`;
}

function renderPsychGrid(colsCls, items, shared = {}) {
  return `<div class="grid ${colsCls} gap-2.5">${items.map(it => renderPsychOption({ ...shared, ...it })).join('\n')}</div>`;
}

function renderPsychSysHeader({
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
function togglePsychGroup(subId, show) {
  const el = getPsychEl(subId);
  if (!el) return;
  if (show) {
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
    el.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    el.querySelectorAll('input[type="radio"]').forEach(rb => { rb.checked = false; });
    el.querySelectorAll('input[type="text"], input[type="number"]').forEach(inp => { inp.value = ''; });
  }
}

function handlePsychInformantChange(value) {
  const container = getPsychEl('psychInformantRelContainer');
  const input = getPsychEl('psychInformantRel');
  if (!container || !input) return;

  if (value === 'family_relative') {
    container.classList.remove('hidden');
    input.placeholder = 'ระบุความสัมพันธ์ เช่น บิดา, มารดา, สามี, ภรรยา, บุตร...';
  } else if (value === 'police_ems') {
    container.classList.remove('hidden');
    input.placeholder = 'ระบุหน่วยงาน หรือสถานที่พบตัว เช่น สภ.เมืองราชบุรี, กู้ภัย...';
  } else if (value === 'caregiver_neighbor') {
    container.classList.remove('hidden');
    input.placeholder = 'ระบุความเกี่ยวข้อง เช่น ผู้ดูแล, เพื่อนบ้าน, ผู้พบเห็นเหตุการณ์...';
  } else {
    container.classList.add('hidden');
    input.value = '';
  }
}

function handlePsychPriorBaselineChange(value) {
  togglePsychGroup('psychPriorBaselineSubContainer', value === 'known_psych_history');
}

function handlePsychBehaviorOtherChange(cb) {
  const checked = Boolean(cb && cb.checked);
  togglePsychGroup('psychBehaviorOtherDetailContainer', checked);
  if (checked) {
    const noneCb = getPsychEl('psych_behavior_none');
    if (noneCb) noneCb.checked = false;
  }
}

function handlePsychBehaviorNoneToggle(el) {
  if (el && el.checked) {
    queryPsychAll('input[name="psychBehaviors"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
    togglePsychGroup('psychBehaviorOtherDetailContainer', false);
  }
}

function handlePsychBehaviorItemChange(el) {
  if (el && el.checked) {
    const noneCb = getPsychEl('psych_behavior_none') || queryPsychOne('input[name="psychBehaviors"][value="no_behavior"]');
    if (noneCb) noneCb.checked = false;
  }
}

function handlePsychHarmNoneToggle(el) {
  if (el && el.checked) {
    queryPsychAll('input[name="psychHarmRisks"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handlePsychHarmItemChange(el) {
  if (el && el.checked) {
    const noneCb = getPsychEl('psych_harm_none') || queryPsychOne('input[name="psychHarmRisks"][value="no_harm_threat"]');
    if (noneCb) noneCb.checked = false;
  }
}

function togglePsychMentalParent(subId, checked) {
  togglePsychGroup(subId, checked);
  if (checked) {
    const noneCb = getPsychEl('psych_mental_none');
    if (noneCb) noneCb.checked = false;
  }
}

function handlePsychMentalNoneToggle(el) {
  if (el && el.checked) {
    [
      ['psychParentHallucination', 'psychHallucinationSubGroup'],
      ['psychParentDelusion', 'psychDelusionSubGroup'],
      ['psychParentMood', 'psychMoodSubGroup'],
      ['psychParentSleep', 'psychSleepSubGroup']
    ].forEach(([parentId, subId]) => {
      const p = getPsychEl(parentId);
      if (p) p.checked = false;
      togglePsychGroup(subId, false);
    });
  }
}

function handlePsychSubstanceToggle(checked) {
  togglePsychGroup('psychSubstanceSubGroup', checked);
  if (checked) {
    const noneCb = getPsychEl('psych_substance_none');
    if (noneCb) noneCb.checked = false;
  }
}

function handlePsychSubstanceNoneToggle(el) {
  if (el && el.checked) {
    const p = getPsychEl('psychParentSubstance');
    if (p) p.checked = false;
    togglePsychGroup('psychSubstanceSubGroup', false);
  }
}

function handlePsychOrganicNoneToggle(el) {
  if (el && el.checked) {
    queryPsychAll('input[name="psychOrganicSigns"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handlePsychOrganicItemChange(el) {
  if (el && el.checked) {
    const noneCb = getPsychEl('psych_organic_none') || queryPsychOne('input[name="psychOrganicSigns"][value="no_organic_signs"]');
    if (noneCb) noneCb.checked = false;
  }
}

function handlePsychComplianceChange(value) {
  togglePsychGroup('psychMissedDaysContainer', value === 'missed_days');
}

function handlePsychPastViolenceNoneToggle(el) {
  if (el && el.checked) {
    queryPsychAll('input[name="psychPastViolence"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handlePsychPastViolenceItemChange(el) {
  if (el && el.checked) {
    const noneCb = getPsychEl('psych_past_violence_none') || queryPsychOne('input[name="psychPastViolence"][value="no_past_violence"]');
    if (noneCb) noneCb.checked = false;
  }
}

// --- Clinical Decision Support & Evaluation Functions (Preserving 7 Rules & core_guard_test.js) ---
function evaluatePsychiatricRedFlags(patient) {
  const rfs = [];
  if (!patient) return rfs;
  const vs = patient.vital_signs || {};
  const pr = vs.pr !== undefined && vs.pr !== null ? parseInt(vs.pr, 10) : null;
  const bt = vs.bt !== undefined && vs.bt !== null ? parseFloat(vs.bt) : null;

  const behaviors = Array.isArray(patient.psychBehaviors) ? patient.psychBehaviors : [];
  const harmRisks = Array.isArray(patient.psychHarmRisks) ? patient.psychHarmRisks : [];
  const hallucinations = Array.isArray(patient.psychHallucinations) ? patient.psychHallucinations : [];
  const delusions = Array.isArray(patient.psychDelusions) ? patient.psychDelusions : [];
  const substances = Array.isArray(patient.psychSubstances) ? patient.psychSubstances : [];
  const rawOrganic = Array.isArray(patient.psychOrganicSigns) ? patient.psychOrganicSigns : [];
  const organicSigns = rawOrganic.filter(x => x && x !== 'no_organic_signs');
  const pastViolence = Array.isArray(patient.psychPastViolence) ? patient.psychPastViolence : [];

  // 1. Active Extreme Violence / Physical Assault / Weapon Threat (ESI 1 / 2)
  const hasWeapon = harmRisks.includes('weapon_possession') || behaviors.includes('weapon_possession');
  const hasPhysicalAssault = harmRisks.includes('physical_assault_others');
  const hasPhysicalViolenceWithThreat = (hasPhysicalAssault || behaviors.includes('property_destruction')) && harmRisks.includes('threat_harm_others');
  if (hasWeapon || hasPhysicalAssault || hasPhysicalViolenceWithThreat) {
    let redFlagTitle = '';
    let redFlagRisk = '';
    if (hasWeapon) {
      redFlagTitle = hasPhysicalAssault
        ? 'ภาวะก้าวร้าวรุนแรงเฉียบพลัน ทำร้ายร่างกายผู้อื่น และมีอาวุธในครอบครอง (Active Physical Assault with Weapon Threat)'
        : 'ภาวะก้าวร้าวรุนแรงเฉียบพลัน และมีอาวุธในครอบครอง (Active Extreme Violence with Weapon Threat)';
      redFlagRisk = 'เสี่ยงต่อการบาดเจ็บร้ายแรงหรือเสียชีวิตจากอาวุธต่อบุคลากร ผู้ป่วย หรือผู้พบเห็น (Severe physical injury or fatality with weapon).';
    } else if (hasPhysicalAssault) {
      redFlagTitle = 'ภาวะก้าวร้าวรุนแรงเฉียบพลัน และทำร้ายร่างกายผู้อื่น (Active Physical Assault / Severe Violence)';
      redFlagRisk = 'เสี่ยงต่อการบาดเจ็บทางร่างกายต่อบุคลากรทางการแพทย์ ผู้ป่วยข้างเคียง หรือทำลายทรัพย์สินในห้องฉุกเฉิน';
    } else {
      redFlagTitle = 'ภาวะก้าวร้าวรุนแรงเฉียบพลัน และข่มขู่ทำร้ายผู้อื่น (Active Severe Agitation / Threat of Violence)';
      redFlagRisk = 'เสี่ยงต่อการระเบิดอารมณ์ทำร้ายร่างกายหรือทำลายทรัพย์สินในห้องฉุกเฉิน';
    }

    rfs.push({
      key: 'rf_psych_active_violence_weapon',
      level: 1,
      textTh: redFlagTitle,
      risk: redFlagRisk,
      suggestedAction: 'Immediate Code White Activation. Security perimeter control, quiet seclusion room, and chemical/physical restraint protocol under continuous medical monitoring.'
    });
  }

  // 2. Suspected Organic Delirium / CNS Infection / Acute Medical Emergency (ESI 2)
  const hasOrganicThreat = organicSigns.includes('high_fever_hyperthermia') ||
    organicSigns.includes('head_trauma_fall') ||
    organicSigns.includes('seizure_tongue_bite') ||
    organicSigns.includes('diabetes_hypoglycemia_risk') ||
    organicSigns.includes('severe_headache_stiff_neck') ||
    organicSigns.includes('muscle_rigidity_lead_pipe');

  if (hasOrganicThreat) {
    rfs.push({
      key: 'rf_psych_organic_delirium_cns',
      level: 2,
      textTh: 'สงสัยภาวะสับสนเพ้อคลั่งจากสาเหตุทางกายหรือติดเชื้อในระบบประสาท (Suspected Organic Delirium or CNS Infection)',
      risk: 'Meningitis, encephalitis, intracranial hemorrhage, severe hypoglycemia, or neuroleptic malignant syndrome (NMS).',
      suggestedAction: 'Medical Clearance First! Stat Bedside DTX, CBC, BUN, Cr, Electrolytes, Hemoculture, and Non-contrast CT Brain before psychiatric referral.'
    });
  }

  // 3. Severe Substance Intoxication / Sympathomimetic Crisis (ESI 2)
  const hasMethStimulant = substances.includes('meth_stimulants');
  const isHyperdynamic = (pr !== null && pr >= 110) || (bt !== null && bt >= 38.0) || organicSigns.includes('high_fever_hyperthermia');
  const isAggressiveWithMeth = hasMethStimulant && (
    behaviors.includes('verbal_aggression') ||
    behaviors.includes('property_destruction') ||
    harmRisks.includes('physical_assault_others') ||
    isHyperdynamic
  );
  if (isAggressiveWithMeth) {
    rfs.push({
      key: 'rf_psych_sympathomimetic_hyperthermia',
      level: 2,
      textTh: 'ภาวะเป็นพิษจากสารกระตุ้นประสาท (ยาบ้า/ยาไอซ์) ร่วมกับไข้สูงหรือหัวใจเต้นเร็ว (Severe Sympathomimetic Toxicity)',
      risk: 'Lethal hyperthermia, rhabdomyolysis, acute renal failure, malignant ventricular arrhythmias, and DIC.',
      suggestedAction: 'Aggressive IV fluid resuscitation, active cooling, titrate IV Diazepam/Lorazepam, stat Urine Tox, CPK, Troponin, and 12-lead ECG.'
    });
  }

  // 4. Severe Alcohol Withdrawal / Delirium Tremens (DT) (ESI 2)
  if (substances.includes('alcohol_withdrawal')) {
    rfs.push({
      key: 'rf_psych_alcohol_delirium_tremens',
      level: 2,
      textTh: 'ภาวะถอนสุราขั้นรุนแรง หรือเพ้อคลั่งสับสน (Severe Alcohol Withdrawal / Delirium Tremens)',
      risk: 'Status epilepticus, severe autonomic instability, aspiration pneumonia, and cardiovascular collapse.',
      suggestedAction: 'Monitored bed, CIWA-Ar symptom-triggered IV Diazepam protocol, IV Thiamine 100-200 mg BEFORE glucose, and correct K/Mg.'
    });
  }

  // 5. High-Lethality Suicidal Intent or High-Risk Elopement (ESI 2)
  if (harmRisks.includes('threat_self_harm') || harmRisks.includes('elopement_high_risk') || pastViolence.includes('past_suicide_attempt')) {
    rfs.push({
      key: 'rf_psych_high_suicidal_intent',
      level: 2,
      textTh: 'มีความเสี่ยงสูงต่อการพยายามฆ่าตัวตาย ทำร้ายตนเอง หรือกระโดดตึกหลบหนี (High-Lethality Suicidal Intent or Elopement Risk)',
      risk: 'Completed suicide, jumping from heights, severe laceration, hanging, or wandering into traffic.',
      suggestedAction: 'Immediate 1:1 Nursing/Security observation, remove all sharps/belts/cords, secure windows/exits, and stat psychiatric crisis consult.'
    });
  }

  // 6. Command Auditory Hallucinations with Paranoia (ESI 3)
  if (hallucinations.includes('auditory_command') || delusions.includes('persecutory_paranoia')) {
    rfs.push({
      key: 'rf_psych_command_hallucination',
      level: 3,
      textTh: 'ได้ยินเสียงแว่วสั่งการ หรือมีความคิดหวาดระแวงปองร้ายรุนแรง (Command Auditory Hallucinations with Severe Paranoia)',
      risk: 'Unpredictable impulsive violence or self-harm driven by command auditory voices or intense persecutory delusion.',
      suggestedAction: 'Calm low-stimulation environment, non-confrontational communication, and physician-ordered antipsychotic under monitoring.'
    });
  }

  // 7. New-Onset Psychosis / Agitation in Adult (First in Life) (ESI 3)
  const isFirstTime = patient.psychPriorBaseline === 'first_time_never';
  const isElderlyOrMedical = (patient.age !== undefined && patient.age !== null && parseInt(patient.age, 10) >= 45) || organicSigns.length > 0;
  if (isFirstTime && isElderlyOrMedical) {
    rfs.push({
      key: 'rf_psych_first_episode_late_onset',
      level: 3,
      textTh: 'อาการทางจิตเวชหรือเอะอะโวยวายเกิดขึ้นเป็นครั้งแรกในชีวิตในผู้ใหญ่ (New-Onset Psychosis or Agitation in Adult)',
      risk: 'Underlying structural brain lesion (tumor, subdural hematoma, stroke), autoimmune encephalitis, or metabolic derangement.',
      suggestedAction: 'Full neurologic exam, CBC, LFT, BUN, Cr, Electrolytes, TSH/Free T4, VDRL, Anti-HIV, and emergent non-contrast CT Brain.'
    });
  }

  return rfs;
}

// --- Thai Lookup Dictionaries (Zero Flag & Zero Raw Enum Leaks) ---
const PSYCH_UNIT_MAP = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };

const PSYCH_INFORMANT_MAP = {
  family_relative: 'ญาติสายตรงหรือบุคคลในครอบครัว',
  police_ems: 'เจ้าหน้าที่ตำรวจ หรือเจ้าหน้าที่กู้ภัย / EMS',
  caregiver_neighbor: 'ผู้ดูแล เพื่อนบ้าน หรือผู้พบเห็นเหตุการณ์',
  patient_self: 'ผู้ป่วยสื่อสารให้ข้อมูลด้วยตนเอง'
};

const PSYCH_BASELINE_STATUS_MAP = {
  baseline_normal_asymptomatic: 'เดิมอาการสงบดี ใช้ชีวิตและทำงานได้ตามปกติ',
  baseline_mild_independent: 'เดิมมีอาการอยู่บ้าง แต่ยังดูแลช่วยเหลือตนเองได้',
  baseline_chronic_confusion: 'เดิมมีอาการสับสนหลงลืมเป็นประจำ แต่ไม่เคยรุนแรงขนาดนี้',
  baseline_intermittent_agitation: 'เดิมมีพฤติกรรมหงุดหงิดก้าวร้าวควบคุมอารมณ์ยากเป็นระยะ'
};

const PSYCH_COMPLIANCE_MAP = {
  regular: 'รับประทานยาจิตเวชสม่ำเสมอครบถ้วนตามแพทย์สั่ง',
  self_adjusted: 'ปรับขนาดยาเอง หรือหยุดรับประทานยาเอง',
  no_prior_rx: 'ไม่เคยมียาจิตเวชมารับประทาน',
  unsure_self_prepared: 'ไม่แน่ใจ หรือผู้ป่วยจัดยารับประทานเอง'
};

const PSYCH_BEHAVIOR_MAP = {
  verbal_aggression: 'ส่งเสียงดัง เอะอะโวยวาย หรือก้าวร้าวทางวาจา',
  property_destruction: 'ขว้างปาหรือทำลายข้าวของ',
  restless_pacing: 'กระสับกระส่าย เดินวนไปมา หงุดหงิดฉุนเฉียว',
  talking_alone: 'พูดคนเดียว',
  paranoia_behavior: 'มีพฤติกรรมหวาดระแวง',
  spaced_out_withdrawn: 'เหม่อลอย แยกตัว ไม่พูดคุย',
  no_behavior: 'ปฏิเสธพฤติกรรมเอะอะโวยวายหรือทำลายข้าวของ'
};

const PSYCH_HARM_MAP = {
  physical_assault_others: 'ทุบตี ทำร้ายร่างกายผู้อื่น',
  weapon_possession: 'มีอาวุธในครอบครอง หรือพยายามหยิบสิ่งของมาเป็นอาวุธ',
  threat_harm_others: 'ข่มขู่ว่าจะทำร้ายหรือเอาชีวิตผู้อื่น',
  threat_self_harm: 'มีพฤติกรรมหรือคำพูดว่าจะทำร้ายตนเองหรือฆ่าตัวตาย',
  elopement_high_risk: 'พยายามวิ่งหนี เตลิด หรือปีนที่สูง/กระโดดออกนอกอาคาร',
  no_harm_threat: 'ปฏิเสธความคิดและพฤติกรรมทำร้ายตนเองหรือผู้อื่น'
};

const PSYCH_HALLUCINATION_MAP = {
  auditory_command: 'ได้ยินเสียงแว่ว (เสียงพูดคุย ด่าทอ หรือเสียงสั่งการ)',
  visual_hallucination: 'มองเห็นภาพหลอน (เงาดำ คน สัตว์ หรือสิ่งไม่มีจริง)',
  tactile_hallucination: 'รู้สึกสัมผัสผิดปกติ (เหมือนมีแมลงไต่ตามผิวหรือกระแสไฟ)'
};

const PSYCH_DELUSION_MAP = {
  persecutory_paranoia: 'หวาดระแวงรุนแรงว่ามีคนปองร้าย ลอบวางยา หรือสะกดรอยตาม',
  grandiosity_delusion: 'หลงผิดว่าตนเป็นบุคคลพิเศษ มีอำนาจวิเศษ หรือร่ำรวย',
  mind_control_thought: 'คิดว่ามีคนควบคุมสมอง ดักฟัง หรือส่งสัญญาณความคิดเข้ามา'
};

const PSYCH_MOOD_MAP = {
  mania_hyperactive: 'อารมณ์ครื้นเครงผิดปกติ พูดเร็วไม่หยุด มีพลังงานล้นเหลือ',
  irritability_aggression: 'หงุดหงิดฉุนเฉียว ก้าวร้าว ระเบิดอารมณ์ง่าย',
  severe_depression_crying: 'ซึมเศร้า ร้องไห้ เก็บตัว ไม่ทานอาหาร ไม่อยากมีชีวิตอยู่',
  flat_blunted_affect: 'อารมณ์ทื่อเฉย หรือแสดงอารมณ์ไม่เข้ากับสถานการณ์'
};

const PSYCH_SLEEP_MAP = {
  insomnia_decreased_need: 'นอนไม่หลับหลายคืนติดต่อกัน โดยไม่ง่วงและยังดูกระปรี้กระเปร่า',
  insomnia_anxiety_paranoia: 'นอนไม่หลับจากความเครียด วิตกกังวล หรือหวาดระแวง',
  insomnia_fatigue_day_drowsy: 'นอนไม่หลับ ง่วงเพลีย กลางวันเหม่อลอย',
  sundowning_day_night_reversal: 'นอนสลับกลางวันกลางคืน หรือตื่นมาเอะอะสับสนช่วงหัวค่ำ/กลางดึก'
};

const PSYCH_SUBSTANCE_MAP = {
  meth_stimulants: 'มีประวัติใช้ยาบ้า ยาไอซ์ โคเคน หรือสารกระตุ้นประสาท',
  alcohol_withdrawal: 'ดื่มสุราหนักประจำ หรือเพิ่งหยุด/อดดื่มสุรามา 1–3 วัน (เสี่ยงถอนสุรา DT)',
  cannabis_kratom_cough: 'มีประวัติใช้กัญชา น้ำกระท่อม ยาแก้ไอผสม หรือสารระเหย',
  sedative_overdose: 'รับประทานยานอนหลับหรือยากดประสาทเกินขนาด'
};

const PSYCH_ORGANIC_MAP = {
  high_fever_hyperthermia: 'มีไข้สูง ตัวร้อนจัด เหงื่อแตกพลั่ก หรือตัวสั่นรุนแรง',
  head_trauma_fall: 'มีประวัติศีรษะกระแทกหรือหกล้มก่อนมีอาการ',
  seizure_tongue_bite: 'มีอาการชักเกร็ง ตาค้าง กัดลิ้น หรือปัสสาวะราดนำมาก่อน',
  diabetes_hypoglycemia_risk: 'เป็นเบาหวาน ทานได้น้อย หรือฉีดยาเบาหวาน (เสี่ยงน้ำตาลต่ำ)',
  severe_headache_stiff_neck: 'ปวดศีรษะรุนแรงเฉียบพลัน คอแข็งเกร็ง หรือแขนขาอ่อนแรง',
  muscle_rigidity_lead_pipe: 'กล้ามเนื้อเกร็งแข็งทั่วตัวหรือขากรรไกรเกร็งค้าง'
};

const PSYCH_HOSP_MAP = {
  complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
  additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
  self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
  unspecified: 'ไม่ได้ระบุ'
};

function formatPsychInformant(patient) {
  const base = PSYCH_INFORMANT_MAP[patient.psychInformant] || 'ไม่ได้ระบุ';
  return patient.psychInformantRel ? `${base} (${patient.psychInformantRel})` : base;
}

function formatPsychBaselineStatus(patient) {
  if (patient.psychPriorBaseline === 'first_time_never') {
    return 'ไม่เคยมีประวัติทางจิตเวชมาก่อนเลย (เกิดอาการครั้งแรกในชีวิต)';
  }
  if (patient.psychPriorBaseline === 'unsure') {
    return 'ไม่ทราบหรือไม่แน่ใจประวัติเดิม';
  }
  if (patient.psychPriorBaseline === 'known_psych_history') {
    return PSYCH_BASELINE_STATUS_MAP[patient.psychBaselineStatus] || 'มีประวัติโรคจิตเวชเดิม (ไม่ได้ระบุระดับอาการเดิม)';
  }
  return 'ไม่ได้ระบุ';
}

function formatPsychCompliance(patient) {
  if (patient.psychCompliance === 'missed_days') {
    return patient.psychMissedDays
      ? `ลืมรับประทานยา หรือขาดยามา ${patient.psychMissedDays} วัน`
      : 'ลืมรับประทานยา หรือขาดยามาหลายวัน';
  }
  return PSYCH_COMPLIANCE_MAP[patient.psychCompliance] || 'ไม่ได้ระบุ';
}

// --- Output Dispatcher & Rapid/Narrative Generators ---
function updatePsychiatricOutputs(rec) {
  if (!rec) return null;

  const durVal = rec.durationVal;
  const durationStr = durVal ? `${durVal} ${PSYCH_UNIT_MAP[rec.durationUnit] || 'ชั่วโมง'}` : 'ไม่ได้ระบุ';

  const behaviors = Array.isArray(rec.psychBehaviors) ? rec.psychBehaviors : [];
  const harmRisks = Array.isArray(rec.psychHarmRisks) ? rec.psychHarmRisks : [];
  const hallucinations = Array.isArray(rec.psychHallucinations) ? rec.psychHallucinations : [];
  const delusions = Array.isArray(rec.psychDelusions) ? rec.psychDelusions : [];
  const moodSigns = Array.isArray(rec.psychMoodSigns) ? rec.psychMoodSigns : [];
  const sleepSigns = Array.isArray(rec.psychSleepSigns) ? rec.psychSleepSigns : [];
  const substances = Array.isArray(rec.psychSubstances) ? rec.psychSubstances : [];
  const organicSigns = Array.isArray(rec.psychOrganicSigns) ? rec.psychOrganicSigns : [];
  const pastViolence = Array.isArray(rec.psychPastViolence) ? rec.psychPastViolence : [];

  const behaviorsPos = behaviors.filter(b => b !== 'no_behavior');
  const harmPos = harmRisks.filter(h => h !== 'no_harm_threat');
  const organicPos = organicSigns.filter(o => o !== 'no_organic_signs');
  const pastPos = pastViolence.filter(v => v !== 'no_past_violence');

  const behaviorSummaryList = behaviorsPos.map(b => {
    if (b === 'other_behavior') {
      return rec.psychBehaviorOtherDetail ? `พฤติกรรมอื่น: ${rec.psychBehaviorOtherDetail}` : 'มีพฤติกรรมผิดปกติอื่น';
    }
    return PSYCH_BEHAVIOR_MAP[b];
  }).filter(Boolean);
  const behaviorsTh = behaviorSummaryList.length > 0
    ? behaviorSummaryList.join(', ')
    : (behaviors.includes('no_behavior') ? PSYCH_BEHAVIOR_MAP.no_behavior : 'ไม่ได้ระบุ');

  const harmSummaryList = harmPos.map(h => PSYCH_HARM_MAP[h]).filter(Boolean);
  const harmRisksTh = harmSummaryList.length > 0
    ? harmSummaryList.join(', ')
    : (harmRisks.includes('no_harm_threat') ? PSYCH_HARM_MAP.no_harm_threat : 'ไม่ได้ระบุ');

  const posList = [];
  const negList = [];

  behaviorSummaryList.forEach(txt => posList.push(txt));
  harmSummaryList.forEach(txt => posList.push(txt));
  hallucinations.forEach(k => { if (PSYCH_HALLUCINATION_MAP[k]) posList.push(PSYCH_HALLUCINATION_MAP[k]); });
  delusions.forEach(k => { if (PSYCH_DELUSION_MAP[k]) posList.push(PSYCH_DELUSION_MAP[k]); });
  moodSigns.forEach(k => { if (PSYCH_MOOD_MAP[k]) posList.push(PSYCH_MOOD_MAP[k]); });
  sleepSigns.forEach(k => { if (PSYCH_SLEEP_MAP[k]) posList.push(PSYCH_SLEEP_MAP[k]); });
  substances.forEach(k => { if (PSYCH_SUBSTANCE_MAP[k]) posList.push(PSYCH_SUBSTANCE_MAP[k]); });
  if (rec.psychSubstanceDetail) posList.push(`รายละเอียดสารเสพติด/แอลกอฮอล์: ${rec.psychSubstanceDetail}`);
  organicPos.forEach(k => { if (PSYCH_ORGANIC_MAP[k]) posList.push(PSYCH_ORGANIC_MAP[k]); });

  if (pastPos.includes('history_violence_assault')) {
    posList.push('เคยมีประวัติทำร้ายร่างกายผู้อื่นหรือคดีความเกี่ยวกับความรุนแรงในอดีต');
  }
  if (pastPos.includes('past_suicide_attempt')) {
    posList.push('เคยพยายามฆ่าตัวตายมาก่อนในอดีต');
  }
  if (rec.otherSymptomsFree) posList.push(rec.otherSymptomsFree);

  // Negatives (Zero Default Bias: strictly explicit confirmations)
  if (behaviors.includes('no_behavior') && behaviorsPos.length === 0) {
    negList.push(PSYCH_BEHAVIOR_MAP.no_behavior);
  }
  if (harmRisks.includes('no_harm_threat') && harmPos.length === 0) {
    negList.push('ไม่มีอาวุธและปฏิเสธความคิดทำร้ายตนเองหรือผู้อื่น');
  } else if (harmPos.length > 0) {
    if (!harmPos.includes('weapon_possession')) negList.push('ไม่มีอาวุธในครอบครอง');
    if (!harmPos.includes('physical_assault_others')) negList.push('ไม่มีประวัติทำร้ายร่างกายผู้อื่นในครั้งนี้');
  }
  if (rec.psychMentalNone && hallucinations.length === 0 && delusions.length === 0 && moodSigns.length === 0 && sleepSigns.length === 0) {
    negList.push('ปฏิเสธประสาทหลอน ความคิดหลงผิด ปัญหาอารมณ์ และการนอนผิดปกติ');
  }
  if (rec.psychSubstanceNone && substances.length === 0) {
    negList.push('ปฏิเสธการใช้สารเสพติดและแอลกอฮอล์');
  }
  if (organicSigns.includes('no_organic_signs') && organicPos.length === 0) {
    negList.push('ปฏิเสธไข้สูง อุบัติเหตุศีรษะ ชักเกร็ง และอาการทางกายเฉียบพลัน');
  }
  if (pastViolence.includes('no_past_violence') && pastPos.length === 0) {
    negList.push('ไม่มีประวัติความรุนแรงหรือพยายามฆ่าตัวตายในอดีต');
  }

  rec.pertinentPositives = posList.length > 0 ? posList : ['ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม'];
  rec.pertinentNegatives = negList.length > 0 ? negList : ['ผู้ป่วยไม่ได้ระบุคำตอบยืนยันในหมวดอาการร่วม'];

  const hospLabel = PSYCH_HOSP_MAP[rec.hospRecordStatus] || 'ไม่ได้ระบุ';
  const udArr = Array.isArray(rec.underlying) ? rec.underlying : (rec.underlying ? [rec.underlying] : []);
  const filteredUd = udArr.filter(u => u && !u.includes('ปฏิเสธ') && u !== 'ไม่มี' && u !== 'ไม่มีโรคประจำตัว' && u !== 'ไม่ได้ระบุ');
  const hasExplicitUdDeny = udArr.some(u => u && (u.includes('ปฏิเสธ') || u === 'ไม่มี' || u === 'ไม่มีโรคประจำตัว'));
  const udDisplay = filteredUd.length > 0
    ? filteredUd.join(', ')
    : ((hasExplicitUdDeny || rec.hospRecordStatus === 'self' || rec.hospRecordStatus === 'additional') ? 'ปฏิเสธ' : 'ไม่ได้ระบุ');

  const allergyDisplay = (!rec.drugAllergy || rec.drugAllergy === 'ไม่ได้ระบุ')
    ? 'ไม่ได้ระบุ'
    : ((rec.drugAllergy.includes('ปฏิเสธ') || rec.drugAllergy === 'ไม่มี') ? 'ปฏิเสธ' : rec.drugAllergy);
  const medsText = (!rec.currentMeds || rec.currentMeds === 'ไม่ได้ระบุ')
    ? 'ไม่ได้ระบุ'
    : (rec.currentMeds === 'ไม่มี' ? 'ไม่มี' : rec.currentMeds);
  const docNotes = rec.doctor_notes || {};
  const redFlags = evaluatePsychiatricRedFlags(rec);
  rec.redFlags = redFlags;

  const defaultRapid = `[Chief Complaint (CC)]
เอะอะโวยวาย / อาการทางจิตเวชฉุกเฉิน เริ่มมีอาการหรือกำเริบขึ้นมา ${durationStr}

[History of Present Illness (HPI)]
• ผู้ให้ประวัติและระยะเวลา: ${formatPsychInformant(rec)} | เริ่มมีอาการ ${durationStr}
• ระดับอาการเดิมก่อนกำเริบ: ${formatPsychBaselineStatus(rec)}
• การรับประทานยาจิตเวช: ${formatPsychCompliance(rec)}
• พฤติกรรมที่พบในขณะนี้: ${behaviorsTh}
• ความเสี่ยงทำร้ายตนเอง/ผู้อื่น: ${harmRisksTh}

• Pertinent Positives:
${rec.pertinentPositives.map(p => `  - ${p}`).join('\n')}

• Pertinent Negatives:
${rec.pertinentNegatives.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• โรคประจำตัว (U/D): ${udDisplay}
• ยาประจำตัว (Current Meds): ${medsText}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${allergyDisplay}

[Emergency Risk Assessment (Red Flags)]
${redFlags.length > 0
  ? `🚩 RED FLAGS DETECTED:\n${redFlags.map(rf => `  * ${rf.textTh}`).join('\n')}`
  : '✓ ไม่พบสัญญาณเตือนความรุนแรงวิกฤตเฉียบพลันเบื้องต้น'}

[Doctor's Clinical Addendum & Exam]
• บันทึกประวัติเพิ่มเติมหรือแก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}
• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}
• แผนการรักษาและคำสั่งการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

  const genderLabel = (rec.gender && rec.gender !== 'ไม่ระบุ') ? rec.gender : '';
  let narrative = `ผู้ป่วย${genderLabel} อายุ ${rec.age || 'ไม่ได้ระบุ'} ปี มารับการตรวจที่ห้องฉุกเฉินด้วยอาการเอะอะโวยวาย / จิตเวชฉุกเฉิน ` +
    `มา ${durationStr} ผู้ให้ข้อมูล: ${formatPsychInformant(rec)} สถานะเดิม: ${formatPsychBaselineStatus(rec)} ` +
    `การรับประทานยา: ${formatPsychCompliance(rec)}`;
  if (posList.length > 0) narrative += ` อาการสำคัญที่พบ: ${posList.join(', ')}`;
  if (negList.length > 0) narrative += ` โดยยืนยันปฏิเสธ: ${negList.join(', ')}`;

  const jsonOutput = {
    encounter: {
      chief_complaint: 'psychiatric_emergency',
      chief_complaint_title_th: 'เอะอะโวยวาย / จิตเวช',
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
      informant: rec.psychInformant || null,
      informant_detail: rec.psychInformantRel || '',
      prior_baseline_type: rec.psychPriorBaseline || null,
      baseline_status: rec.psychBaselineStatus || null,
      behaviors,
      behavior_other_detail: rec.psychBehaviorOtherDetail || '',
      harm_risks: harmRisks,
      mental_symptoms_none_confirmed: Boolean(rec.psychMentalNone),
      hallucinations,
      delusions,
      mood_signs: moodSigns,
      sleep_signs: sleepSigns,
      substances_none_confirmed: Boolean(rec.psychSubstanceNone),
      substances,
      substance_detail: rec.psychSubstanceDetail || '',
      organic_signs: organicSigns,
      compliance: rec.psychCompliance || null,
      missed_days: rec.psychMissedDays || null,
      past_violence: pastViolence,
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

  const finalRapid = rec.custom_rapid_note || defaultRapid;
  const finalNarrative = rec.custom_narrative_note || narrative;
  rec.rapidHpi = finalRapid;
  rec.narrativeHpi = finalNarrative;
  rec.medicalJson = jsonOutput;

  if (typeof document !== 'undefined') {
    const rapidEl = getPsychEl('rapidTextView');
    const narrativeEl = getPsychEl('narrativeTextView');
    const jsonEl = getPsychEl('jsonViewer');
    if (rapidEl) rapidEl.value = finalRapid;
    if (narrativeEl) narrativeEl.value = finalNarrative;
    if (jsonEl) jsonEl.textContent = JSON.stringify(jsonOutput, null, 2);
  }

  return { rapid: finalRapid, narrative: finalNarrative, json: jsonOutput };
}

function renderPsychiatricRapidHpi(patient) {
  const res = updatePsychiatricOutputs(patient);
  return res ? res.rapid : '';
}

function renderPsychiatricNarrative(patient) {
  const res = updatePsychiatricOutputs(patient);
  return res ? res.narrative : '';
}

function renderPsychiatricDoctorHpi(patient) {
  return renderPsychiatricRapidHpi(patient);
}

// --- Patient Form HTML Template ---
const PSYCHIATRIC_FORM_HTML = `
<div id="cc-psychiatric-emergency-section" class="hidden space-y-6">
  <div data-cc-top-banner="psychiatric_emergency">
    <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
      <div class="bg-amber-100 text-amber-800 p-2.5 rounded-xl flex-shrink-0 mt-0.5">
        <i data-lucide="alert-circle" class="w-5 h-5"></i>
      </div>
      <div>
        <h3 class="text-sm font-bold text-amber-900 mb-1">คำแนะนำเบื้องต้นระหว่างรอตรวจ</h3>
        <p class="text-xs text-amber-800 leading-relaxed">
          แนะนำให้ญาติหรือผู้พามาดูแลและสื่อสารด้วยน้ำเสียงสงบ นุ่มนวล หลีกเลี่ยงการโต้เถียงหรือเข้าประชิดหากผู้ป่วยกำลังอาละวาด หากพบผู้ป่วยมีอาวุธ พยายามทำร้ายตนเองหรือผู้อื่น หรือพยายามวิ่งหนี/ปีนที่สูง กรุณาแจ้งพยาบาลหรือเจ้าหน้าที่รักษาความปลอดภัยทันที
        </p>
      </div>
    </div>
  </div>

  <!-- CARD 1: ข้อมูลเหตุการณ์ ผู้ให้ประวัติ สถานะเดิม และพฤติกรรมขณะนี้ -->
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
        <i data-lucide="alert-octagon" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900">1. ผู้ให้ข้อมูล ระยะเวลา สถานะเดิม และพฤติกรรมขณะนี้</h2>
        <p class="text-xs text-slate-500">ข้อมูลผู้ให้ประวัติ ระยะเวลา อาการเดิมก่อนกำเริบ และความเสี่ยงอันตราย</p>
      </div>
    </div>

    <div class="space-y-4">
      <div>
        ${renderPsychSysHeader({
          label: '1.1 ผู้ให้ข้อมูลอาการในวันนี้',
          icon: 'user-check',
          colorClass: 'bg-sky-100 text-sky-700'
        })}
        ${renderPsychGrid('grid-cols-1 sm:grid-cols-2', [
          { kind: 'radio', name: 'psychInformant', value: 'family_relative', title: ['ญาติสายตรง', '/ ครอบครัว'], onchange: 'handlePsychInformantChange(this.value)' },
          { kind: 'radio', name: 'psychInformant', value: 'police_ems', title: ['เจ้าหน้าที่ตำรวจ', '/ กู้ภัย / EMS'], onchange: 'handlePsychInformantChange(this.value)' },
          { kind: 'radio', name: 'psychInformant', value: 'caregiver_neighbor', title: ['ผู้ดูแล / เพื่อนบ้าน', '/ ผู้พบเห็นเหตุการณ์'], onchange: 'handlePsychInformantChange(this.value)' },
          { kind: 'radio', name: 'psychInformant', value: 'patient_self', title: ['ผู้ป่วยสื่อสาร', 'ให้ข้อมูลได้เอง'], onchange: 'handlePsychInformantChange(this.value)' }
        ])}
        <div id="psychInformantRelContainer" class="hidden mt-3 pl-4 border-l-2 border-medical-200">
          <label class="block text-xs font-medium text-slate-600 mb-1">ระบุความสัมพันธ์หรือหน่วยงานผู้ให้ข้อมูล:</label>
          <input type="text" id="psychInformantRel" placeholder="ระบุความสัมพันธ์ เช่น บิดา, มารดา, บุตร..."
            class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white transition">
        </div>
      </div>

      <div class="pt-4 border-t border-slate-100">
        ${renderPsychSysHeader({
          label: '1.2 เริ่มมีอาการ หรืออาการกำเริบขึ้นกว่าเดิมมานานเท่าใด',
          icon: 'clock',
          colorClass: 'bg-sky-100 text-sky-700'
        })}
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div class="col-span-1 sm:col-span-2">
            <input type="number" id="psychDurationVal" min="1" max="365" placeholder="ระบุตัวเลข เช่น 2"
              class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white transition">
          </div>
          <div class="col-span-1">
            <select id="psychDurationUnit"
              class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white transition">
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
        ${renderPsychSysHeader({
          label: '1.3 ประวัติโรคทางจิตเวชเดิมก่อนกำเริบในครั้งนี้',
          icon: 'history',
          colorClass: 'bg-teal-100 text-teal-700'
        })}
        ${renderPsychGrid('grid-cols-1 sm:grid-cols-3', [
          { kind: 'radio', name: 'psychPriorBaseline', value: 'known_psych_history', title: ['เคยมีประวัติ /', 'โรคจิตเวชเดิม'], onchange: 'handlePsychPriorBaselineChange(this.value)' },
          { kind: 'radio', name: 'psychPriorBaseline', value: 'first_time_never', title: ['ไม่เคยเป็นมาก่อน', '(ครั้งแรกในชีวิต)'], onchange: 'handlePsychPriorBaselineChange(this.value)' },
          { kind: 'radio', name: 'psychPriorBaseline', value: 'unsure', title: ['ไม่ทราบประวัติเดิม'], onchange: 'handlePsychPriorBaselineChange(this.value)' }
        ])}

        <div id="psychPriorBaselineSubContainer" class="hidden mt-3 pl-4 sm:pl-6 space-y-2 border-l-2 border-medical-200">
          <p class="text-xs font-bold text-slate-700 mb-1">ระดับอาการและการใช้ชีวิตเดิมก่อนกำเริบ:</p>
          ${renderPsychGrid('grid-cols-1 sm:grid-cols-2', [
            { kind: 'radio', name: 'psychBaselineStatus', value: 'baseline_normal_asymptomatic', title: ['เดิมอาการสงบดี', 'ทำงานได้ปกติ'] },
            { kind: 'radio', name: 'psychBaselineStatus', value: 'baseline_mild_independent', title: ['เดิมมีอาการบ้าง', 'แต่ยังช่วยเหลือ', 'ตัวเองได้'] },
            { kind: 'radio', name: 'psychBaselineStatus', value: 'baseline_chronic_confusion', title: ['เดิมสับสนหลงลืมประจำ', 'แต่ไม่เคย', 'รุนแรงเท่านี้'] },
            { kind: 'radio', name: 'psychBaselineStatus', value: 'baseline_intermittent_agitation', title: ['เดิมหงุดหงิดก้าวร้าว', 'คุมอารมณ์ยากเป็นระยะ'] }
          ])}
        </div>
      </div>

      <div class="pt-4 border-t border-slate-100">
        ${renderPsychSysHeader({
          label: '1.4 พฤติกรรมที่ตรวจพบในขณะนี้ (เลือกได้หลายข้อ)',
          icon: 'activity',
          colorClass: 'bg-sky-100 text-sky-700',
          toggleId: 'psych_behavior_none',
          toggleName: 'psychBehaviors',
          toggleValue: 'no_behavior',
          toggleLabel: 'ไม่มีในหมวดนี้',
          toggleOnchange: 'handlePsychBehaviorNoneToggle(this)'
        })}
        ${renderPsychGrid('grid-cols-1 sm:grid-cols-2', [
          { name: 'psychBehaviors', value: 'verbal_aggression', title: ['ส่งเสียงดัง', 'เอะอะโวยวาย', '/ ก้าวร้าวทางวาจา'], onchange: 'handlePsychBehaviorItemChange(this)' },
          { name: 'psychBehaviors', value: 'property_destruction', title: ['ขว้างปาหรือ', 'ทำลายข้าวของ'], onchange: 'handlePsychBehaviorItemChange(this)' },
          { name: 'psychBehaviors', value: 'restless_pacing', title: ['กระสับกระส่าย เดินวน', '/ หงุดหงิดฉุนเฉียว'], onchange: 'handlePsychBehaviorItemChange(this)' },
          { name: 'psychBehaviors', value: 'talking_alone', title: ['พูดคนเดียว'], onchange: 'handlePsychBehaviorItemChange(this)' },
          { name: 'psychBehaviors', value: 'paranoia_behavior', title: ['มีอาการหวาดระแวง'], onchange: 'handlePsychBehaviorItemChange(this)' },
          { name: 'psychBehaviors', value: 'spaced_out_withdrawn', title: ['เหม่อลอย แยกตัว'], onchange: 'handlePsychBehaviorItemChange(this)' },
          { name: 'psychBehaviors', value: 'other_behavior', title: ['มีพฤติกรรม', 'ผิดปกติอื่น'], onchange: 'handlePsychBehaviorOtherChange(this)', colSpan2: true }
        ])}
        <div id="psychBehaviorOtherDetailContainer" class="hidden mt-3 pl-4 border-l-2 border-medical-200">
          <label class="block text-xs font-medium text-slate-600 mb-1">ระบุพฤติกรรมผิดปกติเพิ่มเติม:</label>
          <input type="text" id="psychBehaviorOtherDetail" placeholder="ระบุ เช่น ร้องไห้ไม่หยุด, ถอดเสื้อผ้า, หัวเราะคนเดียว..."
            class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white transition">
        </div>
      </div>

      <div class="pt-4 border-t border-slate-100">
        ${renderPsychSysHeader({
          label: '1.5 ความเสี่ยงทำร้ายตนเองหรือผู้อื่น (เลือกได้หลายข้อ)',
          icon: 'alert-triangle',
          colorClass: 'bg-amber-100 text-amber-700',
          toggleId: 'psych_harm_none',
          toggleName: 'psychHarmRisks',
          toggleValue: 'no_harm_threat',
          toggleLabel: 'ไม่มีความเสี่ยงนี้',
          toggleOnchange: 'handlePsychHarmNoneToggle(this)'
        })}
        ${renderPsychGrid('grid-cols-1 sm:grid-cols-2', [
          { name: 'psychHarmRisks', value: 'physical_assault_others', title: ['ทุบตี / ทำร้าย', 'ร่างกายผู้อื่น'], onchange: 'handlePsychHarmItemChange(this)' },
          { name: 'psychHarmRisks', value: 'weapon_possession', title: ['มีอาวุธในครอบครอง', '/ หยิบของมาเป็นอาวุธ'], onchange: 'handlePsychHarmItemChange(this)' },
          { name: 'psychHarmRisks', value: 'threat_harm_others', title: ['ข่มขู่จะทำร้าย', 'หรือเอาชีวิตผู้อื่น'], onchange: 'handlePsychHarmItemChange(this)' },
          { name: 'psychHarmRisks', value: 'threat_self_harm', title: ['ขู่ทำร้ายตนเอง', '/ พยายามฆ่าตัวตาย'], onchange: 'handlePsychHarmItemChange(this)' },
          { name: 'psychHarmRisks', value: 'elopement_high_risk', title: ['วิ่งหนีเตลิด', '/ ปีนที่สูง', '/ กระโดดออกนอกอาคาร'], onchange: 'handlePsychHarmItemChange(this)', colSpan2: true }
        ])}
      </div>
    </div>
  </div>

  <!-- CARD 2: อาการทางจิต ประสาทหลอน ความคิดหลงผิด อารมณ์ และการนอน -->
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
        <i data-lucide="brain" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900">2. อาการทางจิต ประสาทหลอน ความคิดหลงผิด อารมณ์ และการนอน</h2>
        <p class="text-xs text-slate-500">เลือกหัวข้อหลักหากพบอาการผิดปกติ หรือกดปุ่มมุมขวาบนหากไม่มี</p>
      </div>
    </div>

    ${renderPsychSysHeader({
      label: 'กลุ่มอาการทางจิตเวช อารมณ์ และการนอนหลับ',
      icon: 'brain',
      colorClass: 'bg-teal-100 text-teal-700',
      toggleId: 'psych_mental_none',
      toggleLabel: 'ไม่มีอาการในหมวดนี้',
      toggleOnchange: 'handlePsychMentalNoneToggle(this)'
    })}

    <div class="space-y-4">
      <!-- 2.1 ประสาทหลอน -->
      <div class="space-y-3">
        <label class="selectable-card flex items-center p-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 hover:border-medical-400 transition cursor-pointer">
          <input type="checkbox" id="psychParentHallucination" onchange="togglePsychMentalParent('psychHallucinationSubGroup', this.checked)"
            class="text-medical-600 focus:ring-medical-500 h-5 w-5 rounded flex-shrink-0">
          <div class="ml-3">
            <span class="text-sm font-bold text-slate-800">2.1 มีอาการประสาทหลอน หรือการรับรู้ผิดปกติ</span>
            <p class="text-xs text-slate-500">เช่น ได้ยินเสียงแว่ว มองเห็นภาพหลอน หรือรู้สึกเหมือนมีสิ่งของไต่ตามผิวหนัง</p>
          </div>
        </label>
        <div id="psychHallucinationSubGroup" class="hidden pl-4 sm:pl-6 space-y-2 border-l-2 border-medical-200">
          <p class="text-xs text-slate-600 font-medium mb-1">เลือกอาการที่พบ (เลือกได้หลายข้อ):</p>
          ${renderPsychGrid('grid-cols-1 sm:grid-cols-2', [
            { name: 'psychHallucinations', value: 'auditory_command', title: ['ได้ยินเสียงแว่ว', '/ เสียงด่า', '/ เสียงสั่งให้', 'ทำสิ่งต่างๆ'] },
            { name: 'psychHallucinations', value: 'visual_hallucination', title: ['มองเห็นภาพหลอน', '(เงาดำ คน สัตว์)'] },
            { name: 'psychHallucinations', value: 'tactile_hallucination', title: ['รู้สึกเหมือน', 'แมลงไต่ตัว', 'หรือมีกระแสไฟตามผิว'], colSpan2: true }
          ])}
        </div>
      </div>

      <!-- 2.2 ความคิดหลงผิด -->
      <div class="space-y-3">
        <label class="selectable-card flex items-center p-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 hover:border-medical-400 transition cursor-pointer">
          <input type="checkbox" id="psychParentDelusion" onchange="togglePsychMentalParent('psychDelusionSubGroup', this.checked)"
            class="text-medical-600 focus:ring-medical-500 h-5 w-5 rounded flex-shrink-0">
          <div class="ml-3">
            <span class="text-sm font-bold text-slate-800">2.2 มีความคิดหลงผิดและความหวาดระแวง</span>
            <p class="text-xs text-slate-500">เช่น ระแวงคนปองร้าย เชื่อว่าตนมีอำนาจวิเศษ หรือถูกควบคุมความคิด</p>
          </div>
        </label>
        <div id="psychDelusionSubGroup" class="hidden pl-4 sm:pl-6 space-y-2 border-l-2 border-medical-200">
          <p class="text-xs text-slate-600 font-medium mb-1">เลือกความคิดหลงผิดที่พบ (เลือกได้หลายข้อ):</p>
          ${renderPsychGrid('grid-cols-1 sm:grid-cols-2', [
            { name: 'psychDelusions', value: 'persecutory_paranoia', title: ['หวาดระแวงรุนแรง', 'กลัวถูกปองร้าย', '/ วางยา'] },
            { name: 'psychDelusions', value: 'grandiosity_delusion', title: ['หลงผิดว่าตนวิเศษ', 'มีอำนาจหรือ', 'ร่ำรวยผิดปกติ'] },
            { name: 'psychDelusions', value: 'mind_control_thought', title: ['คิดว่ามีคนควบคุมสมอง', 'ดักฟัง หรือส่ง', 'สัญญาณจิต'], colSpan2: true }
          ])}
        </div>
      </div>

      <!-- 2.3 ปัญหาทางอารมณ์ -->
      <div class="space-y-3">
        <label class="selectable-card flex items-center p-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 hover:border-medical-400 transition cursor-pointer">
          <input type="checkbox" id="psychParentMood" onchange="togglePsychMentalParent('psychMoodSubGroup', this.checked)"
            class="text-medical-600 focus:ring-medical-500 h-5 w-5 rounded flex-shrink-0">
          <div class="ml-3">
            <span class="text-sm font-bold text-slate-800">2.3 มีปัญหาทางอารมณ์ผิดปกติ</span>
            <p class="text-xs text-slate-500">เช่น ครื้นเครงพูดเร็วไม่หยุด ฉุนเฉียวก้าวร้าว ซึมเศร้าร้องไห้ หรืออารมณ์ทื่อเฉย</p>
          </div>
        </label>
        <div id="psychMoodSubGroup" class="hidden pl-4 sm:pl-6 space-y-2 border-l-2 border-medical-200">
          <p class="text-xs text-slate-600 font-medium mb-1">เลือกอาการทางอารมณ์ที่พบ (เลือกได้หลายข้อ):</p>
          ${renderPsychGrid('grid-cols-1 sm:grid-cols-2', [
            { name: 'psychMoodSigns', value: 'mania_hyperactive', title: ['ครื้นเครงพูดเร็ว', 'ไม่หยุด', 'พลังงานล้นเหลือ', 'ไม่อยู่นิ่ง'] },
            { name: 'psychMoodSigns', value: 'irritability_aggression', title: ['หงุดหงิด ฉุนเฉียว', 'ระเบิดอารมณ์ก้าวร้าว'] },
            { name: 'psychMoodSigns', value: 'severe_depression_crying', title: ['ซึมเศร้า ร้องไห้', 'เก็บตัว', 'ไม่ทานอาหาร', 'ไม่อยากอยู่'] },
            { name: 'psychMoodSigns', value: 'flat_blunted_affect', title: ['อารมณ์ทื่อเฉย', 'ไม่เข้ากับสถานการณ์'] }
          ])}
        </div>
      </div>

      <!-- 2.4 ปัญหาการนอน -->
      <div class="space-y-3">
        <label class="selectable-card flex items-center p-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 hover:border-medical-400 transition cursor-pointer">
          <input type="checkbox" id="psychParentSleep" onchange="togglePsychMentalParent('psychSleepSubGroup', this.checked)"
            class="text-medical-600 focus:ring-medical-500 h-5 w-5 rounded flex-shrink-0">
          <div class="ml-3">
            <span class="text-sm font-bold text-slate-800">2.4 มีปัญหาในการนอนหลับ</span>
            <p class="text-xs text-slate-500">เช่น นอนไม่หลับหลายคืน นอนสลับกลางวันกลางคืน หรือตื่นมาสับสนกลางดึก</p>
          </div>
        </label>
        <div id="psychSleepSubGroup" class="hidden pl-4 sm:pl-6 space-y-2 border-l-2 border-medical-200">
          <p class="text-xs text-slate-600 font-medium mb-1">เลือกปัญหาการนอนที่พบ (เลือกได้หลายข้อ):</p>
          ${renderPsychGrid('grid-cols-1 sm:grid-cols-2', [
            { name: 'psychSleepSigns', value: 'insomnia_decreased_need', title: ['ไม่หลับหลายคืน', 'แต่ไม่ง่วงและ', 'กระปรี้กระเปร่า'] },
            { name: 'psychSleepSigns', value: 'insomnia_anxiety_paranoia', title: ['ไม่หลับเพราะเครียด', 'วิตกกังวล /', 'หวาดระแวง'] },
            { name: 'psychSleepSigns', value: 'insomnia_fatigue_day_drowsy', title: ['ไม่หลับ ง่วงเพลีย', 'กลางวันเหม่อลอย'] },
            { name: 'psychSleepSigns', value: 'sundowning_day_night_reversal', title: ['นอนสลับ', 'กลางวันกลางคืน', '/ สับสนช่วง', 'หัวค่ำกลางดึก'] }
          ])}
        </div>
      </div>
    </div>
  </div>

  <!-- CARD 3: การคัดกรองภาวะทางกาย และสารเสพติด/แอลกอฮอล์ -->
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
        <i data-lucide="shield-alert" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900">3. การคัดกรองภาวะทางกาย และสารเสพติด/แอลกอฮอล์</h2>
        <p class="text-xs text-slate-500">คัดกรองสารกระตุ้น ภาวะถอนสุรา และสัญญาณเตือนความผิดปกติทางกาย</p>
      </div>
    </div>

    <div class="space-y-4">
      <!-- 3.1 สารเสพติด / แอลกอฮอล์ -->
      <div class="space-y-3">
        ${renderPsychSysHeader({
          label: '3.1 ประวัติสารเสพติด หรือเครื่องดื่มแอลกอฮอล์',
          icon: 'flask-conical',
          colorClass: 'bg-sky-100 text-sky-700',
          toggleId: 'psych_substance_none',
          toggleLabel: 'ไม่มีในหมวดนี้',
          toggleOnchange: 'handlePsychSubstanceNoneToggle(this)'
        })}
        <label class="selectable-card flex items-center p-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 hover:border-medical-400 transition cursor-pointer">
          <input type="checkbox" id="psychParentSubstance" onchange="handlePsychSubstanceToggle(this.checked)"
            class="text-medical-600 focus:ring-medical-500 h-5 w-5 rounded flex-shrink-0">
          <div class="ml-3">
            <span class="text-sm font-bold text-slate-800">มีประวัติเสพสารเสพติด สารกระตุ้น หรือดื่มสุรา</span>
            <p class="text-xs text-slate-500">ติ๊กเลือกหากใช้ยาบ้า ยาไอซ์ กัญชา น้ำกระท่อม กินยานอนหลับเกินขนาด หรือเพิ่งหยุดสุรา</p>
          </div>
        </label>
        <div id="psychSubstanceSubGroup" class="hidden pl-4 sm:pl-6 space-y-3 border-l-2 border-medical-200">
          <p class="text-xs text-slate-600 font-medium mb-1">เลือกประวัติสารเสพติดหรือสุราที่พบ (เลือกได้หลายข้อ):</p>
          ${renderPsychGrid('grid-cols-1 sm:grid-cols-2', [
            { name: 'psychSubstances', value: 'meth_stimulants', title: ['ใช้ยาบ้า / ยาไอซ์ /', 'โคเคน / สารกระตุ้น'] },
            { name: 'psychSubstances', value: 'alcohol_withdrawal', title: ['ดื่มสุราหนักประจำ', '/ เพิ่งหยุดดื่ม', '1–3 วัน'] },
            { name: 'psychSubstances', value: 'cannabis_kratom_cough', title: ['ใช้กัญชา /', 'น้ำกระท่อม', '/ ยาแก้ไอ / สารระเหย'] },
            { name: 'psychSubstances', value: 'sedative_overdose', title: ['กินยานอนหลับ หรือ', 'ยากดประสาทเกินขนาด'] }
          ])}
          <div id="psychSubstanceDetailContainer" class="pt-2 border-t border-slate-100">
            <label class="block text-xs font-medium text-slate-600 mb-1">ระบุรายละเอียดสารเสพติด ปริมาณ หรือระยะเวลา (ถ้ามี):</label>
            <input type="text" id="psychSubstanceDetail" placeholder="ระบุ เช่น ยาบ้า 2 เม็ด/วัน, เพิ่งหยุดเหล้าขาว 2 วัน..."
              class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white transition">
          </div>
        </div>
      </div>

      <!-- 3.2 สัญญาณเตือนภาวะทางกายเฉียบพลัน -->
      <div class="pt-4 border-t border-slate-100">
        ${renderPsychSysHeader({
          label: '3.2 สัญญาณเตือนภาวะทางกายเฉียบพลัน (เลือกได้หลายข้อ)',
          icon: 'alert-triangle',
          colorClass: 'bg-amber-100 text-amber-700',
          toggleId: 'psych_organic_none',
          toggleName: 'psychOrganicSigns',
          toggleValue: 'no_organic_signs',
          toggleLabel: 'ไม่มีอาการในหมวดนี้',
          toggleOnchange: 'handlePsychOrganicNoneToggle(this)'
        })}
        ${renderPsychGrid('grid-cols-1 sm:grid-cols-2', [
          { name: 'psychOrganicSigns', value: 'high_fever_hyperthermia', title: ['ไข้สูง ตัวร้อนจัด', 'เหงื่อแตก /', 'ตัวสั่นแรง'], onchange: 'handlePsychOrganicItemChange(this)' },
          { name: 'psychOrganicSigns', value: 'head_trauma_fall', title: ['ศีรษะกระแทก หรือ', 'หกล้มก่อนมีอาการ'], onchange: 'handlePsychOrganicItemChange(this)' },
          { name: 'psychOrganicSigns', value: 'seizure_tongue_bite', title: ['ชักเกร็ง ตาค้าง', 'กัดลิ้น / ปัสสาวะราด'], onchange: 'handlePsychOrganicItemChange(this)' },
          { name: 'psychOrganicSigns', value: 'diabetes_hypoglycemia_risk', title: ['เป็นเบาหวาน กินน้อย', 'หรือฉีดยาเบาหวาน'], onchange: 'handlePsychOrganicItemChange(this)' },
          { name: 'psychOrganicSigns', value: 'severe_headache_stiff_neck', title: ['ปวดศีรษะรุนแรง', 'คอแข็งเกร็ง', '/ อ่อนแรง'], onchange: 'handlePsychOrganicItemChange(this)' },
          { name: 'psychOrganicSigns', value: 'muscle_rigidity_lead_pipe', title: ['กล้ามเนื้อเกร็ง', 'แข็งทั่วตัว', '/ ขากรรไกรเกร็งค้าง'], onchange: 'handlePsychOrganicItemChange(this)' }
        ])}
      </div>
    </div>
  </div>

  <!-- CARD 4: การรับประทานยาจิตเวช และประวัติความรุนแรงในอดีต -->
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
        <i data-lucide="pill" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900">4. การรับประทานยาจิตเวช และประวัติความรุนแรงในอดีต</h2>
        <p class="text-xs text-slate-500">ความสม่ำเสมอการทานยาจิตเวช และประวัติการทำร้ายตนเอง/ผู้อื่นในอดีต</p>
      </div>
    </div>

    <div class="space-y-4">
      <div>
        ${renderPsychSysHeader({
          label: '4.1 การรับประทานยาจิตเวชของผู้ป่วย',
          icon: 'pill',
          colorClass: 'bg-sky-100 text-sky-700'
        })}
        ${renderPsychGrid('grid-cols-1 sm:grid-cols-2', [
          { kind: 'radio', name: 'psychCompliance', value: 'regular', title: ['ทานยาจิตเวชสม่ำเสมอ', 'ครบตามแพทย์สั่ง'], onchange: 'handlePsychComplianceChange(this.value)' },
          { kind: 'radio', name: 'psychCompliance', value: 'missed_days', title: ['ลืมทานยา /', 'ขาดยามาหลายวัน', '- สัปดาห์'], onchange: 'handlePsychComplianceChange(this.value)' },
          { kind: 'radio', name: 'psychCompliance', value: 'self_adjusted', title: ['ปรับขนาดยาเอง', '/ หยุดยาเอง'], onchange: 'handlePsychComplianceChange(this.value)' },
          { kind: 'radio', name: 'psychCompliance', value: 'no_prior_rx', title: ['ไม่เคยมียาจิตเวช', 'มารับประทานมาก่อน'], onchange: 'handlePsychComplianceChange(this.value)' },
          { kind: 'radio', name: 'psychCompliance', value: 'unsure_self_prepared', title: ['ไม่แน่ใจ หรือ', 'ผู้ป่วยจัดยาทานเอง'], onchange: 'handlePsychComplianceChange(this.value)', colSpan2: true }
        ])}

        <div id="psychMissedDaysContainer" class="hidden mt-3 pl-4 border-l-2 border-medical-200">
          <div class="flex items-center gap-2">
            <label class="text-xs font-medium text-slate-600">ขาดยามาประมาณ:</label>
            <input type="number" id="psychMissedDays" placeholder="เช่น 7" min="1" max="365"
              class="w-24 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-medical-500 focus:outline-none">
            <span class="text-xs text-slate-600">วัน</span>
          </div>
        </div>
      </div>

      <div class="pt-4 border-t border-slate-100">
        ${renderPsychSysHeader({
          label: '4.2 ประวัติความรุนแรงหรือพยายามฆ่าตัวตายในอดีต (เลือกได้หลายข้อ)',
          icon: 'history',
          colorClass: 'bg-teal-100 text-teal-700',
          toggleId: 'psych_past_violence_none',
          toggleName: 'psychPastViolence',
          toggleValue: 'no_past_violence',
          toggleLabel: 'ไม่มีในหมวดนี้',
          toggleOnchange: 'handlePsychPastViolenceNoneToggle(this)'
        })}
        ${renderPsychGrid('grid-cols-1 sm:grid-cols-2', [
          { name: 'psychPastViolence', value: 'history_violence_assault', title: ['เคยทำร้ายร่างกาย', 'ผู้อื่น', '/ มีคดีความรุนแรง'], onchange: 'handlePsychPastViolenceItemChange(this)' },
          { name: 'psychPastViolence', value: 'past_suicide_attempt', title: ['เคยลงมือพยายาม', 'ฆ่าตัวตายมาก่อน'], onchange: 'handlePsychPastViolenceItemChange(this)' }
        ])}
      </div>
    </div>
  </div>

  <!-- อาการอื่นๆ เป็นช่องกรอกอิสระ -->
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100">
      <div class="bg-slate-100 text-slate-600 p-2 rounded-xl"><i data-lucide="message-square-plus" class="w-5 h-5"></i></div>
      <div>
        <h2 class="text-base font-bold text-slate-800">อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2>
        <p class="text-xs text-slate-500">ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)</p>
      </div>
    </div>
    <textarea id="psychiatric_emergency_other_free" rows="2" placeholder="พิมพ์ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)..."
      class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"></textarea>
  </div>
</div>
`;

// --- Master Module Definition ---
const psychiatricEmergencyModule = {
  id: 'psychiatric_emergency',
  recordCc: 'psychiatric_emergency',
  schemaCode: 'psychiatric_emergency',
  titleTh: 'เอะอะโวยวาย / จิตเวช',
  titleEn: 'Acute agitation / Psychiatric emergency',
  icon: 'alert-octagon',
  doctorCcBadgeHtml: '<i data-lucide="alert-octagon" class="w-3.5 h-3.5 mr-1 text-purple-600"></i> CC: เอะอะโวยวาย / จิตเวช (Psychiatric Emergency)',
  algorithm: 'psychiatric-emergency-protocol',
  sectionDomId: 'cc-psychiatric-emergency-section',
  pmhSectionNumber: 5,
  dateFields: [],
  timeFields: [],
  branchIds: [
    'psychInformantRelContainer', 'psychPriorBaselineSubContainer',
    'psychBehaviorOtherDetailContainer', 'psychHallucinationSubGroup',
    'psychDelusionSubGroup', 'psychMoodSubGroup', 'psychSleepSubGroup',
    'psychSubstanceSubGroup', 'psychMissedDaysContainer'
  ],
  inputIdsToClear: [
    'psychDurationVal', 'psychInformantRel', 'psychBehaviorOtherDetail',
    'psychSubstanceDetail', 'psychMissedDays', 'psychiatric_emergency_other_free'
  ],
  getPmhSectionNumber: function() {
    return 5;
  },
  formHtml: PSYCHIATRIC_FORM_HTML,

  init: function() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  },

  onSelectForm: function() {},
  onActivate: function() {},

  collectIntake: function(ctx = {}) {
    ctx = ctx || {};
    const durVal = parseInt(getPsychEl('psychDurationVal')?.value, 10);
    const durUnit = getPsychEl('psychDurationUnit')?.value || 'hours';

    const getRadio = (name) => {
      const el = queryPsychOne(`input[name="${name}"]:checked`);
      return el ? el.value : null;
    };
    const getChecks = (name) => queryPsychAll(`input[name="${name}"]:checked`).map(el => el.value);

    const informant = getRadio('psychInformant');
    const needsInfDetail = informant && informant !== 'patient_self';
    const informantRel = needsInfDetail ? (getPsychEl('psychInformantRel')?.value?.trim() || '') : '';

    const priorBaseline = getRadio('psychPriorBaseline');
    const baselineStatus = (priorBaseline === 'known_psych_history') ? getRadio('psychBaselineStatus') : null;

    const behaviors = getChecks('psychBehaviors');
    const behaviorOtherDetail = behaviors.includes('other_behavior')
      ? (getPsychEl('psychBehaviorOtherDetail')?.value?.trim() || '')
      : '';
    const harmRisks = getChecks('psychHarmRisks');

    const parentHallucination = Boolean(getPsychEl('psychParentHallucination')?.checked);
    const hallucinations = parentHallucination ? getChecks('psychHallucinations') : [];

    const parentDelusion = Boolean(getPsychEl('psychParentDelusion')?.checked);
    const delusions = parentDelusion ? getChecks('psychDelusions') : [];

    const parentMood = Boolean(getPsychEl('psychParentMood')?.checked);
    const moodSigns = parentMood ? getChecks('psychMoodSigns') : [];

    const parentSleep = Boolean(getPsychEl('psychParentSleep')?.checked);
    const sleepSigns = parentSleep ? getChecks('psychSleepSigns') : [];

    const psychMentalNone = Boolean(getPsychEl('psych_mental_none')?.checked) &&
      !parentHallucination && !parentDelusion && !parentMood && !parentSleep;

    const parentSubstance = Boolean(getPsychEl('psychParentSubstance')?.checked);
    const substances = parentSubstance ? getChecks('psychSubstances') : [];
    const substanceDetail = parentSubstance ? (getPsychEl('psychSubstanceDetail')?.value?.trim() || '') : '';
    const psychSubstanceNone = Boolean(getPsychEl('psych_substance_none')?.checked) && !parentSubstance;

    const organicSigns = getChecks('psychOrganicSigns');
    const compliance = getRadio('psychCompliance');
    const missedDaysVal = compliance === 'missed_days' ? parseInt(getPsychEl('psychMissedDays')?.value, 10) : NaN;
    const pastViolence = getChecks('psychPastViolence');

    const otherSymptomsFree = getPsychEl('psychiatric_emergency_other_free')?.value?.trim() || ctx.otherSymptomsFree || '';

    const rec = {
      id: ctx.recordId || ctx.id || `case-${Date.now()}`,
      queue_number: ctx.queueNumber || ctx.queue_number || 'ER-NEW',
      hn: ctx.randomHn || ctx.hn || '-',
      name: ctx.patientName || ctx.name || 'ไม่ระบุชื่อ',
      age: ctx.patientAge !== undefined ? ctx.patientAge : (ctx.age !== undefined ? ctx.age : 'ไม่ได้ระบุ'),
      gender: ctx.gender || 'ไม่ระบุ',
      chief_complaint: 'psychiatric_emergency',
      chief_complaint_title: 'เอะอะโวยวาย / จิตเวช',
      timestamp: new Date().toISOString(),
      status: ctx.recordStatus || ctx.status || 'waiting',
      durationVal: !isNaN(durVal) && durVal > 0 ? durVal : null,
      durationUnit: durUnit,
      hospRecordStatus: ctx.hospRecordStatus || 'unspecified',
      underlying: Array.isArray(ctx.underlying) ? ctx.underlying : [],
      drugAllergy: ctx.drugAllergy || 'ไม่ได้ระบุ',
      currentMeds: ctx.currentMeds || 'ไม่ได้ระบุ',
      otherSymptomsFree,
      doctor_notes: ctx.preservedDoctorNotes || ctx.doctor_notes || { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },

      psychInformant: informant,
      psychInformantRel: informantRel,
      psychPriorBaseline: priorBaseline,
      psychBaselineStatus: baselineStatus,
      psychBehaviors: behaviors,
      psychBehaviorOtherDetail: behaviorOtherDetail,
      psychHarmRisks: harmRisks,
      psychMentalNone,
      psychHallucinations: hallucinations,
      psychDelusions: delusions,
      psychMoodSigns: moodSigns,
      psychSleepSigns: sleepSigns,
      psychSubstanceNone,
      psychSubstances: substances,
      psychSubstanceDetail: substanceDetail,
      psychOrganicSigns: organicSigns,
      psychCompliance: compliance,
      psychMissedDays: !isNaN(missedDaysVal) ? missedDaysVal : null,
      psychPastViolence: pastViolence
    };

    updatePsychiatricOutputs(rec);
    return rec;
  },

  collectFormData: function(ctx = {}) {
    return this.collectIntake(ctx);
  },

  populateForm: function(data = {}) {
    if (!data) return;
    this.resetForm();

    if (data.durationVal) {
      const valEl = getPsychEl('psychDurationVal');
      if (valEl) valEl.value = data.durationVal;
    }
    const unitEl = getPsychEl('psychDurationUnit');
    if (unitEl) unitEl.value = data.durationUnit || 'hours';

    const setRadio = (name, val) => {
      if (!val) return;
      const el = queryPsychOne(`input[name="${name}"][value="${val}"]`);
      if (el) el.checked = true;
    };
    const setChecks = (name, arr) => {
      if (!Array.isArray(arr)) return;
      arr.forEach(val => {
        const el = queryPsychOne(`input[name="${name}"][value="${val}"]`);
        if (el) el.checked = true;
      });
    };

    setRadio('psychInformant', data.psychInformant);
    if (data.psychInformant) handlePsychInformantChange(data.psychInformant);
    if (data.psychInformantRel) {
      const relEl = getPsychEl('psychInformantRel');
      if (relEl) relEl.value = data.psychInformantRel;
    }

    setRadio('psychPriorBaseline', data.psychPriorBaseline);
    if (data.psychPriorBaseline) handlePsychPriorBaselineChange(data.psychPriorBaseline);
    setRadio('psychBaselineStatus', data.psychBaselineStatus);

    setChecks('psychBehaviors', data.psychBehaviors);
    if (Array.isArray(data.psychBehaviors) && data.psychBehaviors.includes('other_behavior')) {
      togglePsychGroup('psychBehaviorOtherDetailContainer', true);
      const oEl = getPsychEl('psychBehaviorOtherDetail');
      if (oEl) oEl.value = data.psychBehaviorOtherDetail || '';
    }

    setChecks('psychHarmRisks', data.psychHarmRisks);

    const hasHal = Array.isArray(data.psychHallucinations) && data.psychHallucinations.length > 0;
    const hasDel = Array.isArray(data.psychDelusions) && data.psychDelusions.length > 0;
    const hasMood = Array.isArray(data.psychMoodSigns) && data.psychMoodSigns.length > 0;
    const hasSleep = Array.isArray(data.psychSleepSigns) && data.psychSleepSigns.length > 0;

    if (hasHal) {
      const p = getPsychEl('psychParentHallucination'); if (p) p.checked = true;
      togglePsychMentalParent('psychHallucinationSubGroup', true);
      setChecks('psychHallucinations', data.psychHallucinations);
    }
    if (hasDel) {
      const p = getPsychEl('psychParentDelusion'); if (p) p.checked = true;
      togglePsychMentalParent('psychDelusionSubGroup', true);
      setChecks('psychDelusions', data.psychDelusions);
    }
    if (hasMood) {
      const p = getPsychEl('psychParentMood'); if (p) p.checked = true;
      togglePsychMentalParent('psychMoodSubGroup', true);
      setChecks('psychMoodSigns', data.psychMoodSigns);
    }
    if (hasSleep) {
      const p = getPsychEl('psychParentSleep'); if (p) p.checked = true;
      togglePsychMentalParent('psychSleepSubGroup', true);
      setChecks('psychSleepSigns', data.psychSleepSigns);
    }
    if (!hasHal && !hasDel && !hasMood && !hasSleep && data.psychMentalNone) {
      const noneCb = getPsychEl('psych_mental_none');
      if (noneCb) noneCb.checked = true;
    }

    const hasSub = Array.isArray(data.psychSubstances) && data.psychSubstances.length > 0;
    if (hasSub) {
      const p = getPsychEl('psychParentSubstance'); if (p) p.checked = true;
      handlePsychSubstanceToggle(true);
      setChecks('psychSubstances', data.psychSubstances);
      if (data.psychSubstanceDetail) {
        const sDetEl = getPsychEl('psychSubstanceDetail');
        if (sDetEl) sDetEl.value = data.psychSubstanceDetail;
      }
    } else if (data.psychSubstanceNone) {
      const noneCb = getPsychEl('psych_substance_none');
      if (noneCb) noneCb.checked = true;
    }

    setChecks('psychOrganicSigns', data.psychOrganicSigns);

    setRadio('psychCompliance', data.psychCompliance);
    if (data.psychCompliance) handlePsychComplianceChange(data.psychCompliance);
    if (data.psychMissedDays) {
      const mEl = getPsychEl('psychMissedDays');
      if (mEl) mEl.value = data.psychMissedDays;
    }

    setChecks('psychPastViolence', data.psychPastViolence);
    const otherFreeEl = getPsychEl('psychiatric_emergency_other_free');
    if (otherFreeEl) otherFreeEl.value = data.otherSymptomsFree || '';
  },

  hydrateForm: function(data = {}) {
    this.populateForm(data);
  },

  resetForm: function() {
    this.inputIdsToClear.forEach(id => {
      const el = getPsychEl(id);
      if (el) el.value = '';
    });

    const durUnit = getPsychEl('psychDurationUnit');
    if (durUnit) durUnit.value = 'hours';

    [
      'psychParentHallucination', 'psychParentDelusion', 'psychParentMood',
      'psychParentSleep', 'psychParentSubstance', 'psych_behavior_none',
      'psych_harm_none', 'psych_mental_none', 'psych_substance_none',
      'psych_organic_none', 'psych_past_violence_none'
    ].forEach(id => {
      const el = getPsychEl(id);
      if (el) el.checked = false;
    });

    this.branchIds.forEach(id => {
      const el = getPsychEl(id);
      if (el) el.classList.add('hidden');
    });

    [
      'psychInformant', 'psychPriorBaseline', 'psychBaselineStatus', 'psychCompliance'
    ].forEach(n => {
      queryPsychAll(`input[name="${n}"]`).forEach(r => { r.checked = false; });
    });

    [
      'psychBehaviors', 'psychHarmRisks', 'psychHallucinations', 'psychDelusions',
      'psychMoodSigns', 'psychSleepSigns', 'psychSubstances', 'psychOrganicSigns', 'psychPastViolence'
    ].forEach(n => {
      queryPsychAll(`input[name="${n}"]`).forEach(c => { c.checked = false; });
    });

    queryPsychAll('#cc-psychiatric-emergency-section input[type="radio"]').forEach(r => { r.checked = false; });
    queryPsychAll('#cc-psychiatric-emergency-section input[type="checkbox"]').forEach(c => { c.checked = false; });
  },

  clearForm: function() {
    this.resetForm();
  },

  isRedFlag: function(patient) {
    return evaluatePsychiatricRedFlags(patient).length > 0;
  },

  evaluateRedFlags: evaluatePsychiatricRedFlags,
  updateOutputs: updatePsychiatricOutputs,
  renderRapidHpi: renderPsychiatricRapidHpi,
  renderNarrative: renderPsychiatricNarrative,
  renderDoctorHpi: renderPsychiatricDoctorHpi,

  // --- Seed Patients Registry (4 Cases Preserved, C-AP11 Allergy Concise) ---
  seedPatients: [
    {
      id: 'case-psych-01',
      queue_number: 'E2-101',
      hn: '7890401',
      name: 'นายวีระ คลั่งยาถือมีดอาละวาด',
      age: 28,
      gender: 'ชาย',
      chief_complaint: 'psychiatric_emergency',
      chief_complaint_title: 'เอะอะโวยวาย / จิตเวช',
      timestamp: '2026-11-04T18:00:00.000Z',
      status: 'waiting',
      durationVal: 3,
      durationUnit: 'hours',
      hospRecordStatus: 'self',
      underlying: ['ปฏิเสธ'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'ไม่มี',
      otherSymptomsFree: 'ตำรวจนำส่ง ถือมีดพร้าอาละวาด ตะโกนด่าทอเพื่อนบ้าน หวาดระแวงว่ามีคนจะมาฆ่า เสพยาบ้าต่อเนื่อง 3 วัน เหงื่อแตกท่วมตัว',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 37.8, sbp: 165, dbp: 100, bp: '165/100', pr: 124, rr: 24, spo2: 99 },
      esi_level: 2,

      psychInformant: 'police_ems',
      psychInformantRel: 'สภ.เมืองราชบุรี',
      psychPriorBaseline: 'known_psych_history',
      psychBaselineStatus: 'baseline_normal_asymptomatic',
      psychBehaviors: ['verbal_aggression', 'property_destruction'],
      psychBehaviorOtherDetail: '',
      psychHarmRisks: ['physical_assault_others', 'weapon_possession', 'threat_harm_others'],
      psychMentalNone: false,
      psychHallucinations: ['auditory_command'],
      psychDelusions: ['persecutory_paranoia'],
      psychMoodSigns: ['irritability_aggression'],
      psychSleepSigns: ['insomnia_decreased_need'],
      psychSubstanceNone: false,
      psychSubstances: ['meth_stimulants'],
      psychSubstanceDetail: 'เสพยาบ้าต่อเนื่อง 3 วัน',
      psychOrganicSigns: ['no_organic_signs'],
      psychCompliance: 'no_prior_rx',
      psychMissedDays: null,
      psychPastViolence: ['history_violence_assault']
    },
    {
      id: 'case-psych-02',
      queue_number: 'E2-102',
      hn: '7890402',
      name: 'นางสมจิต สับสนโวยวายไข้สูง',
      age: 74,
      gender: 'หญิง',
      chief_complaint: 'psychiatric_emergency',
      chief_complaint_title: 'เอะอะโวยวาย / จิตเวช',
      timestamp: '2026-11-04T18:30:00.000Z',
      status: 'waiting',
      durationVal: 1,
      durationUnit: 'days',
      hospRecordStatus: 'complete',
      underlying: ['เบาหวาน (DM)', 'ความดันสูง (HT)', 'สมองเสื่อมระยะเริ่มต้น (Dementia)'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Metformin 500 mg 1 tab bid pc, Amlodipine 5 mg 1 tab po od',
      otherSymptomsFree: 'บุตรสาวนำส่ง เริ่มมีอาการสับสน เอะอะโวยวายชี้มือชี้ไม้บอกว่าเห็นแมลงไต่บนเตียง มีไข้สูงหนาวสั่น ปัสสาวะแสบขัดขุ่น สับสนขึ้นๆ ลงๆ',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 38.9, sbp: 95, dbp: 58, bp: '95/58', pr: 112, rr: 24, spo2: 95 },
      esi_level: 2,

      psychInformant: 'family_relative',
      psychInformantRel: 'บุตรสาว',
      psychPriorBaseline: 'known_psych_history',
      psychBaselineStatus: 'baseline_chronic_confusion',
      psychBehaviors: ['verbal_aggression', 'restless_pacing'],
      psychBehaviorOtherDetail: '',
      psychHarmRisks: ['no_harm_threat'],
      psychMentalNone: false,
      psychHallucinations: ['visual_hallucination', 'tactile_hallucination'],
      psychDelusions: [],
      psychMoodSigns: ['irritability_aggression'],
      psychSleepSigns: ['sundowning_day_night_reversal'],
      psychSubstanceNone: true,
      psychSubstances: [],
      psychSubstanceDetail: '',
      psychOrganicSigns: ['high_fever_hyperthermia', 'diabetes_hypoglycemia_risk'],
      psychCompliance: 'regular',
      psychMissedDays: null,
      psychPastViolence: ['no_past_violence']
    },
    {
      id: 'case-psych-03',
      queue_number: 'E2-103',
      hn: '7890403',
      name: 'นายอนุชา ขาดยาได้ยินเสียงแว่วสั่งทำร้าย',
      age: 35,
      gender: 'ชาย',
      chief_complaint: 'psychiatric_emergency',
      chief_complaint_title: 'เอะอะโวยวาย / จิตเวช',
      timestamp: '2026-11-04T19:00:00.000Z',
      status: 'waiting',
      durationVal: 4,
      durationUnit: 'days',
      hospRecordStatus: 'complete',
      underlying: ['โรคจิตเภท (Schizophrenia)'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Haloperidol 5 mg 1 tab bid, Artane 2 mg 1 tab bid (ขาดยามา 1 เดือน)',
      otherSymptomsFree: 'มารดานำส่ง ขังตัวเองในห้อง ไม่ยอมนอน 4 วัน บ่นว่าได้ยินเสียงคนสั่งให้เอามีดแทงตัวเองและกระโดดระเบียง ขาดยารักษาจิตเภทมา 1 เดือนเต็ม',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.8, sbp: 130, dbp: 82, bp: '130/82', pr: 88, rr: 18, spo2: 99 },
      esi_level: 2,

      psychInformant: 'family_relative',
      psychInformantRel: 'มารดา',
      psychPriorBaseline: 'known_psych_history',
      psychBaselineStatus: 'baseline_mild_independent',
      psychBehaviors: ['talking_alone', 'spaced_out_withdrawn'],
      psychBehaviorOtherDetail: '',
      psychHarmRisks: ['threat_self_harm', 'elopement_high_risk'],
      psychMentalNone: false,
      psychHallucinations: ['auditory_command'],
      psychDelusions: ['persecutory_paranoia'],
      psychMoodSigns: ['severe_depression_crying'],
      psychSleepSigns: ['insomnia_anxiety_paranoia'],
      psychSubstanceNone: true,
      psychSubstances: [],
      psychSubstanceDetail: '',
      psychOrganicSigns: ['no_organic_signs'],
      psychCompliance: 'missed_days',
      psychMissedDays: 30,
      psychPastViolence: ['past_suicide_attempt']
    },
    {
      id: 'case-psych-04',
      queue_number: 'E2-104',
      hn: '7890404',
      name: 'นายประเสริฐ ดื่มเหล้าหนักหยุดดื่มมือสั่นหวาดระแวง',
      age: 52,
      gender: 'ชาย',
      chief_complaint: 'psychiatric_emergency',
      chief_complaint_title: 'เอะอะโวยวาย / จิตเวช',
      timestamp: '2026-11-04T19:30:00.000Z',
      status: 'waiting',
      durationVal: 2,
      durationUnit: 'days',
      hospRecordStatus: 'self',
      underlying: ['โรคตับจากแอลกอฮอล์ (Alcoholic liver disease)'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'วิตามิน B-complex',
      otherSymptomsFree: 'เพื่อนบ้านนำส่ง กระสับกระส่าย เดินพล่าน มือสั่น ตัวสั่น เหงื่อท่วมตัว มองเห็นเงาดำและสัตว์เลื้อยคลาน เพิ่งหยุดดื่มเหล้าขาวกะทันหันมาได้ 2 วัน',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 37.4, sbp: 158, dbp: 96, bp: '158/96', pr: 118, rr: 20, spo2: 97 },
      esi_level: 2,

      psychInformant: 'caregiver_neighbor',
      psychInformantRel: 'เพื่อนบ้าน',
      psychPriorBaseline: 'known_psych_history',
      psychBaselineStatus: 'baseline_mild_independent',
      psychBehaviors: ['restless_pacing', 'verbal_aggression'],
      psychBehaviorOtherDetail: '',
      psychHarmRisks: ['no_harm_threat'],
      psychMentalNone: false,
      psychHallucinations: ['visual_hallucination'],
      psychDelusions: ['persecutory_paranoia'],
      psychMoodSigns: ['irritability_aggression'],
      psychSleepSigns: ['insomnia_anxiety_paranoia'],
      psychSubstanceNone: false,
      psychSubstances: ['alcohol_withdrawal'],
      psychSubstanceDetail: 'หยุดดื่มเหล้าขาวกะทันหันมาได้ 2 วัน',
      psychOrganicSigns: ['no_organic_signs'],
      psychCompliance: 'no_prior_rx',
      psychMissedDays: null,
      psychPastViolence: ['no_past_violence']
    }
  ]
};

// Register module in Ratchaburi ER Core Registry
if (typeof registerCcModule === 'function') {
  registerCcModule(psychiatricEmergencyModule);
} else if (typeof window !== 'undefined' && typeof window.registerCcModule === 'function') {
  window.registerCcModule(psychiatricEmergencyModule);
}

// Export inline event handlers to window scope
if (typeof window !== 'undefined') {
  window.togglePsychGroup = togglePsychGroup;
  window.handlePsychInformantChange = handlePsychInformantChange;
  window.handlePsychPriorBaselineChange = handlePsychPriorBaselineChange;
  window.handlePsychBehaviorOtherChange = handlePsychBehaviorOtherChange;
  window.handlePsychBehaviorNoneToggle = handlePsychBehaviorNoneToggle;
  window.handlePsychBehaviorItemChange = handlePsychBehaviorItemChange;
  window.handlePsychHarmNoneToggle = handlePsychHarmNoneToggle;
  window.handlePsychHarmItemChange = handlePsychHarmItemChange;
  window.togglePsychMentalParent = togglePsychMentalParent;
  window.handlePsychMentalNoneToggle = handlePsychMentalNoneToggle;
  window.handlePsychSubstanceToggle = handlePsychSubstanceToggle;
  window.handlePsychSubstanceNoneToggle = handlePsychSubstanceNoneToggle;
  window.handlePsychOrganicNoneToggle = handlePsychOrganicNoneToggle;
  window.handlePsychOrganicItemChange = handlePsychOrganicItemChange;
  window.handlePsychComplianceChange = handlePsychComplianceChange;
  window.handlePsychPastViolenceNoneToggle = handlePsychPastViolenceNoneToggle;
  window.handlePsychPastViolenceItemChange = handlePsychPastViolenceItemChange;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = psychiatricEmergencyModule;
}
