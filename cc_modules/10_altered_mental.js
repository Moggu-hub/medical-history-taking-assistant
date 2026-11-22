// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 10_altered_mental.js
// อาการนำ: ซึมลง / สับสนเฉียบพลัน / ระดับความรู้สึกตัวเปลี่ยนแปลง (Altered Mental Status)
// ปรับปรุงตามมาตรฐาน plan_altered_mental_status.md, plan-cc และ code-cc (กลุ่ม B2)
// =========================================================================

// --- Internal DOM & UI Helpers ---
function getAmEl(id) {
  return typeof document !== 'undefined' ? document.getElementById(id) : null;
}

function queryAmOne(selector) {
  return typeof document !== 'undefined' ? document.querySelector(selector) : null;
}

function queryAmAll(selector) {
  return typeof document !== 'undefined' ? Array.from(document.querySelectorAll(selector)) : [];
}

function wrapAmWords(chunks) {
  if (!Array.isArray(chunks)) return chunks;
  return chunks.map(c => `<span class="inline-block whitespace-nowrap">${c}</span>`).join(' ');
}

function renderAmOption(cfg) {
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
  const titleHtml = Array.isArray(title) ? wrapAmWords(title) : title;
  const bodyHtml = desc
    ? `<div class="ml-3 leading-snug"><span class="block text-xs sm:text-sm font-semibold text-slate-800">${titleHtml}</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">${desc}</span></div>`
    : `<span class="ml-3 ${compact ? 'text-xs' : 'text-xs sm:text-sm'} font-semibold text-slate-800 leading-snug">${titleHtml}</span>`;
  return `<label class="selectable-card bg-white flex ${alignCls} ${padCls} rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition${spanCls}"><input type="${kind}" ${idAttr}${nameAttr}${valAttr}${chgAttr}class="${topCls}${roundCls}text-medical-600 focus:ring-medical-500 ${szCls} flex-shrink-0">${bodyHtml}</label>`;
}

function renderAmGrid(colsCls, items, shared = {}) {
  return `<div class="grid ${colsCls} gap-2.5">${items.map(it => renderAmOption({ ...shared, ...it })).join('\n')}</div>`;
}

function renderAmSysHeader({
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

function safeAmFormatDate(val) {
  if (!val) return '';
  return typeof formatDateDdMmYyyy === 'function' ? formatDateDdMmYyyy(val) : String(val);
}

function safeAmFormatTime(val) {
  if (!val) return '';
  return typeof formatTime24h === 'function' ? formatTime24h(val) : String(val);
}

function safeAmToggleBranch(id, show) {
  if (typeof toggleBranch === 'function') {
    toggleBranch(id, show);
    return;
  }
  const el = getAmEl(id);
  if (el) el.classList.toggle('hidden', !show);
}

// --- Progressive Disclosure & Corner-Toggle Handlers ---
function handleAlteredMentalBaselineChange(val) {
  const wrap = getAmEl('alteredMentalBedriddenDetailsWrap');
  if (!wrap) return;
  if (val === 'bedridden_totally_dependent') {
    wrap.classList.remove('hidden');
  } else {
    wrap.classList.add('hidden');
    [
      'alteredMentalBedriddenCommunication',
      'alteredMentalBedriddenMobility',
      'alteredMentalBedriddenFeeding',
      'alteredMentalBedriddenElimination'
    ].forEach(n => queryAmAll(`input[name="${n}"]`).forEach(r => { r.checked = false; }));
  }
}

function handleAlteredMentalLsnUnknownToggle(el) {
  const dateInput = getAmEl('alteredMentalLsnDate');
  const timeInput = getAmEl('alteredMentalLsnTime');
  if (el && el.checked) {
    if (dateInput) { dateInput.value = ''; dateInput.disabled = true; }
    if (timeInput) { timeInput.value = ''; timeInput.disabled = true; }
  } else {
    if (dateInput) dateInput.disabled = false;
    if (timeInput) timeInput.disabled = false;
  }
}

function handleAlteredMentalCogItemChange(el) {
  if (el && el.checked) {
    const noneCb = getAmEl('alteredMental_cog_none');
    if (noneCb) noneCb.checked = false;
  }
}

function handleAlteredMentalCogNoneToggle(el) {
  if (el && el.checked) {
    queryAmAll('input[name="alteredMentalCognitiveBehaviors"]').forEach(cb => { cb.checked = false; });
  }
}

function handleAlteredMentalNeuroItemChange(el) {
  if (el && el.checked) {
    const noneCb = getAmEl('alteredMentalNeuroNoneCb');
    if (noneCb) noneCb.checked = false;
  }
}

function handleAlteredMentalHeadTraumaToggle(el) {
  const wrap = getAmEl('alteredMentalHeadTraumaWrap');
  if (el && el.checked) {
    if (wrap) wrap.classList.remove('hidden');
    const noneCb = getAmEl('alteredMentalNeuroNoneCb');
    if (noneCb) noneCb.checked = false;
  } else {
    if (wrap) wrap.classList.add('hidden');
    queryAmAll('input[name="alteredMentalHeadTraumaTime"]').forEach(r => { r.checked = false; });
    queryAmAll('input[name="alteredMentalRemoteTraumaTime"]').forEach(r => { r.checked = false; });
  }
}

function handleAlteredMentalRemoteTraumaToggle(el) {
  handleAlteredMentalHeadTraumaToggle(el);
}

function handleAlteredMentalHeadWoundToggle(el) {
  const wrap = getAmEl('alteredMentalHeadWoundDetailsWrap');
  if (el && el.checked) {
    if (wrap) wrap.classList.remove('hidden');
    const noneCb = getAmEl('alteredMentalNeuroNoneCb');
    if (noneCb) noneCb.checked = false;
  } else {
    if (wrap) wrap.classList.add('hidden');
    const locInput = getAmEl('alteredMentalHeadWoundLocation');
    if (locInput) locInput.value = '';
  }
}

function handleAlteredMentalNeuroNoneToggle(el) {
  if (el && el.checked) {
    queryAmAll('input[name="alteredMentalNeuroFlags"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
    const traumaWrap = getAmEl('alteredMentalHeadTraumaWrap');
    if (traumaWrap) traumaWrap.classList.add('hidden');
    queryAmAll('input[name="alteredMentalHeadTraumaTime"]').forEach(r => { r.checked = false; });
    queryAmAll('input[name="alteredMentalRemoteTraumaTime"]').forEach(r => { r.checked = false; });
    const woundWrap = getAmEl('alteredMentalHeadWoundDetailsWrap');
    if (woundWrap) woundWrap.classList.add('hidden');
    const locInput = getAmEl('alteredMentalHeadWoundLocation');
    if (locInput) locInput.value = '';
  }
}

function handleAlteredMentalSysItemChange(el) {
  if (el && el.checked) {
    const noneCb = getAmEl('alteredMental_sys_none');
    if (noneCb) noneCb.checked = false;
  }
}

function handleAlteredMentalSysNoneToggle(el) {
  if (el && el.checked) {
    queryAmAll('input[name="alteredMentalSystemicFlags"]').forEach(cb => { cb.checked = false; });
  }
}

function handleAlteredMentalGiToggle() {
  const abdpainCb = getAmEl('alteredMentalGiAbdpain');
  const abdpainWrap = getAmEl('alteredMentalAbdpainWrap');
  if (abdpainCb && abdpainWrap) {
    if (abdpainCb.checked) {
      abdpainWrap.classList.remove('hidden');
    } else {
      abdpainWrap.classList.add('hidden');
      queryAmAll('input[name="alteredMentalAbdpainLocs"]').forEach(cb => { cb.checked = false; });
      queryAmAll('input[name="alteredMentalAbdpainChar"]').forEach(r => { r.checked = false; });
    }
  }

  const diarrheaCb = getAmEl('alteredMentalGiDiarrhea');
  const diarrheaWrap = getAmEl('alteredMentalDiarrheaWrap');
  if (diarrheaCb && diarrheaWrap) {
    if (diarrheaCb.checked) {
      diarrheaWrap.classList.remove('hidden');
    } else {
      diarrheaWrap.classList.add('hidden');
      const f = getAmEl('alteredMentalDiarrheaFreq');
      if (f) f.value = '';
      queryAmAll('input[name="alteredMentalDiarrheaStools"]').forEach(cb => { cb.checked = false; });
    }
  }

  const vomitCb = getAmEl('alteredMentalGiVomit');
  const vomitWrap = getAmEl('alteredMentalVomitWrap');
  if (vomitCb && vomitWrap) {
    if (vomitCb.checked) {
      vomitWrap.classList.remove('hidden');
    } else {
      vomitWrap.classList.add('hidden');
      const f = getAmEl('alteredMentalVomitFreq');
      if (f) f.value = '';
      queryAmAll('input[name="alteredMentalVomitContents"]').forEach(cb => { cb.checked = false; });
    }
  }

  if ((abdpainCb && abdpainCb.checked) || (diarrheaCb && diarrheaCb.checked) || (vomitCb && vomitCb.checked)) {
    const giNone = getAmEl('alteredMental_gi_none');
    if (giNone) giNone.checked = false;
  }
}

function handleAlteredMentalGiNoneToggle(el) {
  if (!el || !el.checked) return;
  ['alteredMentalGiAbdpain', 'alteredMentalGiDiarrhea', 'alteredMentalGiVomit'].forEach(id => {
    const cb = getAmEl(id);
    if (cb) cb.checked = false;
  });
  handleAlteredMentalGiToggle();
}

function handleAlteredMentalRiskItemChange(el) {
  if (el && el.checked) {
    const noneCb = getAmEl('alteredMentalRiskNoneCb');
    if (noneCb) noneCb.checked = false;
  }
}

function handleAlteredMentalToxinToggle(el) {
  const wrap = getAmEl('alteredMentalToxinDetailsWrap');
  if (el && el.checked) {
    if (wrap) wrap.classList.remove('hidden');
    const noneCb = getAmEl('alteredMentalRiskNoneCb');
    if (noneCb) noneCb.checked = false;
  } else {
    if (wrap) wrap.classList.add('hidden');
    const input = getAmEl('alteredMentalToxinDetails');
    if (input) input.value = '';
  }
}

function handleAlteredMentalRiskNoneToggle(el) {
  if (el && el.checked) {
    queryAmAll('input[name="alteredMentalRiskPrecipitants"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
    const wrap = getAmEl('alteredMentalToxinDetailsWrap');
    if (wrap) wrap.classList.add('hidden');
    const input = getAmEl('alteredMentalToxinDetails');
    if (input) input.value = '';
  }
}

// --- Red Flag Evaluator ---
function detectAlteredMentalRedFlags(patient) {
  if (!patient) return [];
  const flags = [];
  const neuro = patient.alteredMentalNeuroFlags || patient.alteredMentalNeuroSigns || [];
  const systemic = patient.alteredMentalSystemicFlags || patient.alteredMentalSystemicSigns || [];
  const risks = patient.alteredMentalRiskPrecipitants || [];
  const diarrheaStools = patient.alteredMentalDiarrheaStools || [];
  const vomitContents = patient.alteredMentalVomitContents || patient.altered_mental_vomit_contents || [];

  const hasFocalNeuro = neuro.includes('focal_weakness_numbness') || neuro.includes('focal_weakness_face_limb');
  const hasSeizure = neuro.includes('seizure_or_abnormal_movement') || neuro.includes('seizure_or_twitching');
  const hasStiffNeck = neuro.includes('stiff_neck_or_severe_headache') || neuro.includes('neck_stiffness_headache');
  const hasGazeDeviation = neuro.includes('gaze_deviation_or_fixed') || neuro.includes('anisocoria_or_fixed_pupil') || neuro.includes('unequal_pupils_or_deviation');

  const traumaTime = patient.alteredMentalHeadTraumaTime || patient.alteredMentalRemoteTraumaTime || '';
  const isAcuteTrauma = neuro.includes('head_injury_recent_24h') || traumaTime === 'within_24h';
  const isRemoteTrauma = neuro.includes('remote_trauma_weeks') || ['gt24h_to_1w', 'remote_1_2w', 'remote_2_4w', 'remote_1_2m', 'remote_gt_2m', 'remote_unknown'].includes(traumaTime);
  const hasHeadTrauma = neuro.includes('head_trauma_history') || isAcuteTrauma || isRemoteTrauma;

  if (patient.alteredMentalLevelOfConsciousness === 'stupor_pain_only') {
    flags.push({ key: 'am_stupor', textTh: 'ระดับการตื่นตัวลดลงรุนแรง หลับลึก ต้องกระตุ้นเจ็บจึงจะตอบสนอง (Stupor)', risk: 'เสี่ยงต่อการกดการหายใจและสำลัก', isRedFlag: true });
  } else if (patient.alteredMentalLevelOfConsciousness === 'coma_unresponsive') {
    flags.push({ key: 'am_coma', textTh: 'หมดสติ โคม่า ไม่ตอบสนองต่อเสียงเรียกและการเขย่าตัวแรงๆ (Coma / GCS <= 8)', risk: 'ภาวะวิกฤตสูญเสียการปกป้องทางเดินหายใจ (Loss of Airway Reflexes)', isRedFlag: true });
  }

  if (patient.alteredMentalOnsetPattern === 'hyperacute_minutes') {
    flags.push({ key: 'am_hyperacute', textTh: 'ซึมลงหรือสับสนเฉียบพลันทันทีทันใดในหลักนาที (Hyperacute Onset)', risk: 'สงสัย Acute Stroke, Non-convulsive Seizure หรือ Severe Hypoglycemia', isRedFlag: true });
  } else if (patient.alteredMentalOnsetPattern === 'acute_hours') {
    flags.push({ key: 'am_acute_hours', textTh: 'ซึมลงหรือสับสนเฉียบพลันภายในไม่กี่ชั่วโมงของวันนี้ (Acute Deterioration)', risk: 'สงสัย Severe Sepsis, Metabolic Derangement หรือ Toxin Ingestion', isRedFlag: true });
  }

  if (patient.alteredMentalBaselineStatus === 'known_dementia_partially_dependent') {
    flags.push({ key: 'am_acute_on_chronic_delirium', textTh: 'มีสมองเสื่อมเดิมแต่ซึมลง/สับสนเฉียบพลันทรุดลงกว่าเดิมมาก (Acute-on-Chronic Delirium)', risk: 'บ่งชี้มีพยาธิสภาพเฉียบพลันกระตุ้น (Underlying Acute Precipitant)', isRedFlag: true });
  } else if (patient.alteredMentalBaselineStatus === 'bedridden_totally_dependent') {
    flags.push({ key: 'am_bedridden_deterioration', textTh: 'ผู้ป่วยติดเตียงมีระดับการตื่นตัวลดลงผิดปกติ (Bedridden with Acute Deterioration)', risk: 'เสี่ยงต่อ Sepsis, Severe Electrolyte Imbalance หรือ Aspiration', isRedFlag: true });
  }

  if (hasFocalNeuro) {
    flags.push({ key: 'am_focal_neuro', textTh: 'มีแขนขาอ่อนแรงครึ่งซีก ปากเบี้ยว ยิ้มไม่เท่ากัน หรือชาครึ่งซีก (Focal Neurologic Deficit)', risk: 'สงสัย Acute Ischemic/Hemorrhagic Stroke หรือ Intracranial Lesion', isRedFlag: true });
  }
  if (hasSeizure) {
    flags.push({ key: 'am_seizure', textTh: 'มีอาการชักเกร็ง กระตุก ตาค้าง เหม่อลอย หรือเคี้ยวปากร่วมด้วย (Seizure / NCSE)', risk: 'สงสัย Status Epilepticus หรือ Non-convulsive Seizure', isRedFlag: true });
  }
  if (hasStiffNeck) {
    flags.push({ key: 'am_meningismus_headache', textTh: 'คอแข็งเกร็ง ก้มคอไม่ลง หรือปวดศีรษะรุนแรงมากนำมาก่อน (Meningismus / Severe Headache)', risk: 'สงสัย Meningitis, Encephalitis หรือ Subarachnoid Hemorrhage', isRedFlag: true });
  }
  if (hasGazeDeviation) {
    flags.push({ key: 'am_gaze_deviation', textTh: 'ตากลอกไม่มา หรือมองค้างไปข้างใดข้างหนึ่ง (Conjugate Gaze Deviation / Herniation sign)', risk: 'สงสัยสมองบวมรุนแรง ก้อนกดทับเนื้อสมอง หรือเนื้อสมองเคลื่อนตัวกดทับก้านสมอง (Impending Herniation)', isRedFlag: true });
  }
  if (isAcuteTrauma) {
    flags.push({ key: 'am_acute_head_trauma', textTh: 'มีประวัติศีรษะกระแทก ลื่นล้ม หรืออุบัติเหตุภายใน 24 ชั่วโมง (Acute Traumatic Brain Injury)', risk: 'สงสัยภาวะเลือดออกในกะโหลกศีรษะเฉียบพลัน (Acute Epidural/Subdural/ICH)', isRedFlag: true });
  } else if (isRemoteTrauma || hasHeadTrauma) {
    flags.push({ key: 'am_remote_head_trauma', textTh: 'มีประวัติลื่นล้ม ศีรษะกระแทกมาก่อนหน้านี้ (Suspected Subacute/Chronic Subdural Hematoma)', risk: 'สงสัยเลือดออกใต้เยื่อหุ้มสมองเรื้อรัง (Subacute/Chronic SDH) ซึ่งมักค่อยๆ ซึมลง', isRedFlag: true });
  }

  if (systemic.includes('high_fever_or_hypothermia')) {
    flags.push({ key: 'am_fever_hypothermia', textTh: 'มีไข้สูง หนาวสั่น หรือตัวเย็นเฉียบผิดปกติ (Systemic Infection / Sepsis)', risk: 'สงสัย Severe Sepsis หรือ Septic Encephalopathy', isRedFlag: true });
  }
  if (systemic.includes('tachypnea_labored_breathing')) {
    flags.push({ key: 'am_tachypnea', textTh: 'หายใจหอบเร็ว หายใจเหนื่อยรุนแรง หรือมีเสียงครืดคราด (Respiratory Distress / Severe Acidosis)', risk: 'สงสัย Respiratory Failure หรือ Severe Metabolic Acidosis (DKA/Uremia/Sepsis)', isRedFlag: true });
  }
  if (systemic.includes('cyanosis_cold_clammy')) {
    flags.push({ key: 'am_poor_perfusion_shock', textTh: 'ปลายมือเท้าเย็นเฉียบ หน้าซีด ลายพร้อย หรือปากเขียวคล้ำ (Impending Shock / Hypoxia)', risk: 'ภาวะช็อก การไหลเวียนโลหิตล้มเหลว หรือ Hypoxia รุนแรง', isRedFlag: true });
  }

  if (diarrheaStools.includes('bloody') || diarrheaStools.includes('melena_tarry') || vomitContents.includes('coffee_ground_blood') || vomitContents.includes('bloody_coffee_ground') || vomitContents.includes('coffee_ground') || vomitContents.includes('bloody')) {
    flags.push({ key: 'am_gi_bleeding', textTh: 'มีอาการถ่ายเป็นเลือด ถ่ายดำยางมะตอย หรืออาเจียนเป็นเลือด (Acute GI Bleed)', risk: 'ภาวะเลือดออกในทางเดินอาหารเฉียบพลัน นำไปสู่ Hypovolemic Shock / Hepatic Encephalopathy', isRedFlag: true });
  }
  if (vomitContents.includes('projectile')) {
    flags.push({ key: 'am_projectile_vomiting', textTh: 'มีอาการอาเจียนพุ่งรุนแรง (Projectile Vomiting)', risk: 'สงสัยภาวะความดันในกะโหลกศีรษะสูง (Increased Intracranial Pressure - IICP)', isRedFlag: true });
  }

  if (risks.includes('diabetic_insulin_meds')) {
    flags.push({ key: 'am_diabetic_meds', textTh: 'ผู้ป่วยโรคเบาหวาน หรือฉีดอินซูลินหรือทานยาลดน้ำตาล (Diabetic on Medication)', risk: 'เสี่ยงต่อ Severe Hypoglycemia (ต้องเจาะ DTX STAT ทันที) หรือ HHS/DKA', isRedFlag: true });
  }
  if (risks.includes('chronic_kidney_missed_dialysis')) {
    flags.push({ key: 'am_ckd_uremia', textTh: 'โรคไตวายเรื้อรัง ขาดการฟอกเลือด หรือปัสสาวะไม่ออก (CKD / Missed Dialysis)', risk: 'สงสัย Uremic Encephalopathy, Severe Hyperkalemia, Fluid Overload', isRedFlag: true });
  }
  if (risks.includes('cirrhosis_jaundice_ascites')) {
    flags.push({ key: 'am_cirrhosis_hepatic_enc', textTh: 'โรคตับแข็ง มีตาเหลือง ท้องมาน (Cirrhosis / Jaundice)', risk: 'สงสัย Hepatic Encephalopathy กระตุ้นโดยการติดเชื้อ เลือดออก หรือท้องผูก', isRedFlag: true });
  }
  if (risks.includes('new_meds_or_sedatives')) {
    flags.push({ key: 'am_sedative_toxicity', textTh: 'เพิ่งเริ่มยาใหม่ ทานยานอนหลับ ยากดประสาท ยาแก้ปวด Opioid (Sedative / Neuroactive Drugs)', risk: 'สงสัย Drug-induced Delirium หรือ Overdose / Toxicity', isRedFlag: true });
  }
  if (risks.includes('alcohol_heavy_or_abrupt_stop')) {
    flags.push({ key: 'am_alcohol_withdrawal', textTh: 'ดื่มสุราหนักเป็นประจำ หรือเพิ่งหยุดดื่มกะทันหัน 1-4 วัน (Heavy Alcohol / Abrupt Cessation)', risk: 'สงสัย Delirium Tremens (DT), Wernicke Encephalopathy หรือ Alcoholic Ketoacidosis', isRedFlag: true });
  }
  if (risks.includes('suspected_overdose_toxin')) {
    flags.push({ key: 'am_suspected_poisoning', textTh: 'สงสัยรับประทานยาเกินขนาด กินยาพิษ ยาฆ่าแมลง/สารเคมี (Acute Toxic Ingestion)', risk: 'ภาวะได้รับสารพิษเฉียบพลัน ต้องประเมิน Toxidrome และให้ Antidote ทันที', isRedFlag: true });
  }

  return flags;
}

// --- Thai Lookup Dictionaries (Zero Raw Enum Leaks / Zero Flag Icons) ---
const AM_UNIT_MAP = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };

const AM_REPORTER_MAP = {
  caregiver_family: 'ญาติหรือผู้ดูแลที่อยู่ด้วยกันประจำ',
  relative_occasional: 'ญาติที่ไม่ได้อยู่ด้วยกันประจำ (เพิ่งมาเยี่ยม)',
  witness_rescuer: 'ผู้พบเห็นเหตุการณ์ / เพื่อนร่วมงาน / กู้ชีพ',
  patient_confused: 'ผู้ป่วยเล่าเองแต่สับสน'
};

const AM_BASELINE_MAP = {
  normal_independent: 'เดิมปกติ ช่วยเหลือตัวเองได้สมบูรณ์',
  mild_cognitive_independent: 'เดิมหลงลืมเล็กน้อยตามวัย แต่ช่วยเหลือตัวเองได้',
  known_dementia_partially_dependent: 'มีสมองเสื่อมเดิม ช่วยเหลือตัวเองได้บางส่วน (ทรุดลงกว่าเดิมชัดเจน)',
  bedridden_totally_dependent: 'ผู้ป่วยติดเตียงเดิม (ระดับการตื่นตัวลดลงผิดปกติ)'
};

const AM_BEDRIDDEN_COMM_MAP = { talk_normal: 'เดิมพูดเป็นประโยครู้เรื่อง', talk_limited: 'เดิมพูดได้เป็นคำสั้นๆ', mute_sounds: 'เดิมไม่พูด ส่งเสียงอืออา' };
const AM_BEDRIDDEN_MOB_MAP = { turn_sit: 'เดิมพลิกตัว/พยุงนั่งได้', limb_move_only: 'เดิมขยับแขนขาได้ แต่นั่งไม่ได้', flaccid_no_move: 'เดิมนอนนิ่ง ไม่ขยับแขนขา' };
const AM_BEDRIDDEN_FEED_MAP = { oral_self: 'เดิมทานอาหารเองได้', oral_assisted: 'เดิมญาติต้องป้อน', ng_tube: 'เดิมให้อาหารทางสายยางจมูก', peg_tube: 'เดิมให้อาหารทางสายหน้าท้อง' };
const AM_BEDRIDDEN_ELIM_MAP = { continent: 'เดิมขับถ่ายรู้ตัว บอกได้', foley_catheter: 'เดิมคาสายสวนปัสสาวะ', diapers: 'เดิมใส่ผ้าอ้อม ขับถ่ายไม่รู้ตัว' };

const AM_ONSET_MAP = {
  hyperacute_minutes: 'เกิดขึ้นทันทีทันใดในหลักนาที',
  acute_hours: 'ทรุดลงชัดเจนภายในไม่กี่ชั่วโมงของวันนี้',
  subacute_days: 'ค่อยๆ ซึมลง สับสนสะสมมาหลายวัน',
  fluctuating_day_night: 'เป็นๆ หายๆ หรือสับสนช่วงเย็น-กลางคืน'
};

const AM_CONSCIOUS_MAP = {
  drowsy_lethargic: 'ซึมลง ปลุกตื่นง่ายเมื่อเรียก ลืมตาตอบได้ช้า',
  stupor_pain_only: 'หลับลึก ต้องเขย่าแรงๆ หรือกระตุ้นเจ็บจึงจะตื่น',
  coma_unresponsive: 'หมดสติ ไม่ลืมตา ไม่ตอบสนองต่อเสียงเรียกหรือเขย่าแรงๆ',
  awake_but_confused: 'ตื่นลืมตาได้เอง แต่พูดคุยสับสน จำบุคคล/เวลา/สถานที่ไม่ได้'
};

const AM_COG_MAP = {
  inattention_unfocused: 'ขาดสมาธิ เหม่อลอย เรียกไม่ค่อยหัน',
  disoriented_time_place: 'สับสนวันเวลา สถานที่ หรือบุคคล',
  agitated_restless: 'กระสับกระส่าย เอะอะโวยวาย ลุกเดินพล่าน',
  hallucinations_paranoid: 'มองเห็นภาพหลอน ได้ยินเสียงแว่ว หรือหวาดระแวง',
  speech_slurred_or_incoherent: 'พูดจาเลอะเลือน ไม่ปะติดปะต่อ หรือพูดไม่ชัด',
  apathy_mute: 'นิ่งเฉย ไม่ยอมพูด ไม่ยอมสบตา',
  poor_intake_refusal: 'ไม่รับประทานอาหารและน้ำ หรือดื่มน้ำได้น้อยมาก'
};

const AM_NEURO_MAP = {
  focal_weakness_numbness: 'แขนหรือขาอ่อนแรงครึ่งซีก ปากเบี้ยว หรือชาครึ่งซีก',
  focal_weakness_face_limb: 'แขนหรือขาอ่อนแรงครึ่งซีก ปากเบี้ยว หรือชาครึ่งซีก',
  seizure_or_abnormal_movement: 'มีอาการชักเกร็ง กระตุก ตาค้าง หรือเหม่อลอย',
  stiff_neck_or_severe_headache: 'คอแข็งเกร็ง ก้มคอไม่ลง หรือปวดศีรษะรุนแรงนำมาก่อน',
  gaze_deviation_or_fixed: 'ตากลอกไม่มา หรือมองค้างไปข้างใดข้างหนึ่ง',
  anisocoria_or_fixed_pupil: 'ตากลอกไม่มา หรือมองค้างไปข้างใดข้างหนึ่ง',
  head_trauma_history: 'มีประวัติลื่นล้ม ศีรษะกระแทก หรืออุบัติเหตุที่ศีรษะ',
  head_injury_recent_24h: 'ศีรษะกระแทกภายใน 24 ชั่วโมงที่ผ่านมา',
  remote_trauma_weeks: 'มีประวัติศีรษะกระแทกในช่วงสัปดาห์–เดือนที่ผ่านมา',
  visible_head_wound: 'มีบาดแผล บวมโน หรือรอยฟกช้ำที่ศีรษะหรือใบหน้า'
};

const AM_TRAUMA_TIME_MAP = {
  within_24h: 'ภายใน 24 ชั่วโมงที่ผ่านมา',
  gt24h_to_1w: '1–7 วันก่อน',
  remote_1_2w: '1–2 สัปดาห์ก่อน',
  remote_2_4w: '2–4 สัปดาห์ก่อน',
  remote_1_2m: '1–2 เดือนก่อน',
  remote_gt_2m: 'มากกว่า 2 เดือนขึ้นไป',
  remote_unknown: 'จำระยะเวลาที่แน่นอนไม่ได้'
};

const AM_SYSTEMIC_MAP = {
  high_fever_or_hypothermia: 'มีไข้สูง หนาวสั่น หรือตัวเย็นเฉียบผิดปกติ',
  tachypnea_labored_breathing: 'หายใจหอบเร็ว หายใจเหนื่อยรุนแรง หรือมีเสียงครืดคราด',
  cyanosis_cold_clammy: 'ปลายมือเท้าเย็นเฉียบ หน้าซีด หรือริมฝีปากเขียวคล้ำ',
  cough_purulent_sputum: 'มีอาการไอ มีเสมหะข้นสีเหลืองหรือเขียว',
  rhinorrhea_sore_throat: 'มีน้ำมูก คัดจมูก หรือเจ็บคอ',
  foul_cloudy_urine: 'ปัสสาวะขุ่น กลิ่นเหม็นรุนแรง หรือมีสีแดงปนเลือด',
  infected_bedsore_wound: 'มีแผลกดทับ แผลเบาหวาน หรือแผลผ่าตัดมีหนองติดเชื้อ'
};

const AM_ABDPAIN_LOC_MAP = {
  ruq: 'ชายโครงขวา',
  epigastrium: 'ลิ้นปี่',
  luq: 'ชายโครงซ้าย',
  rlq: 'ท้องน้อยขวา',
  suprapubic: 'เหนือหัวเหน่า',
  llq: 'ท้องน้อยซ้าย',
  diffuse: 'ทั่วท้อง',
  lower: 'ท้องน้อย',
  upper: 'ท้องส่วนบน',
  generalized: 'ทั่วท้อง'
};

const AM_ABDPAIN_CHAR_MAP = {
  colicky_spasm: 'ปวดบิดเกร็งเป็นพักๆ',
  dull_aching: 'ปวดตื้อแน่นถ่วงๆ ตลอดเวลา',
  burning: 'ปวดแสบร้อนกลางอก/ลิ้นปี่',
  sharp_severe: 'ปวดรุนแรงเฉียบพลัน/เสียดแทง',
  colicky: 'ปวดบิดเกร็งเป็นพักๆ',
  dull: 'ปวดตื้อแน่นตลอดเวลา'
};

const AM_STOOL_MAP = {
  watery: 'ถ่ายเป็นน้ำเหลว',
  mucous: 'มีมูกปน',
  bloody: 'มีเลือดสดปน',
  melena_tarry: 'อุจจาระสีดำเหมือนยางมะตอย'
};

const AM_VOMIT_MAP = {
  food_content: 'เศษอาหาร',
  bile_green: 'น้ำดีสีเขียว/เหลือง',
  coffee_ground_blood: 'มีเลือดสดหรือสีกาแฟคั่ว',
  bloody_coffee_ground: 'มีเลือดสดหรือสีกาแฟคั่ว',
  coffee_ground: 'สีกาแฟคั่ว',
  bloody: 'เลือดสด',
  projectile: 'อาเจียนพุ่งรุนแรง'
};

const AM_RISK_MAP = {
  diabetic_insulin_meds: 'โรคเบาหวานที่ฉีดอินซูลินหรือทานยาลดน้ำตาล',
  chronic_kidney_missed_dialysis: 'โรคไตวายเรื้อรัง ขาดการฟอกเลือด หรือปัสสาวะไม่ออก',
  cirrhosis_jaundice_ascites: 'โรคตับแข็ง มีตาเหลือง ท้องมาน หรือถ่ายดำ/ท้องผูก',
  new_meds_or_sedatives: 'เพิ่งเริ่มยาใหม่ ทานยานอนหลับ ยาคลายกังวล หรือยาแก้ปวดกลุ่มแรง',
  alcohol_heavy_or_abrupt_stop: 'ดื่มสุราหนักเป็นประจำ หรือเพิ่งหยุดดื่มกะทันหัน 1–4 วัน',
  suspected_overdose_toxin: 'สงสัยรับประทานยาเกินขนาด กินยาพิษ หรือสารเคมีกำจัดศัตรูพืช',
  baseline_psychiatric_history: 'มีประวัติโรคทางจิตเวช'
};

// --- Output Renderer & Dispatcher (Doctor View) ---
function updateAlteredMentalOutputs(patient) {
  if (!patient) return null;

  const durVal = patient.durationVal;
  const durationText = durVal ? `${durVal} ${AM_UNIT_MAP[patient.durationUnit] || 'ชั่วโมง'}` : 'ไม่ได้ระบุ';

  const baselineDetails = [];
  if (patient.alteredMentalBaselineStatus === 'bedridden_totally_dependent') {
    if (patient.alteredMentalBedriddenCommunication) baselineDetails.push(AM_BEDRIDDEN_COMM_MAP[patient.alteredMentalBedriddenCommunication] || patient.alteredMentalBedriddenCommunication);
    if (patient.alteredMentalBedriddenMobility) baselineDetails.push(AM_BEDRIDDEN_MOB_MAP[patient.alteredMentalBedriddenMobility] || patient.alteredMentalBedriddenMobility);
    if (patient.alteredMentalBedriddenFeeding) baselineDetails.push(AM_BEDRIDDEN_FEED_MAP[patient.alteredMentalBedriddenFeeding] || patient.alteredMentalBedriddenFeeding);
    if (patient.alteredMentalBedriddenElimination) baselineDetails.push(AM_BEDRIDDEN_ELIM_MAP[patient.alteredMentalBedriddenElimination] || patient.alteredMentalBedriddenElimination);
  }
  const baselineText = AM_BASELINE_MAP[patient.alteredMentalBaselineStatus]
    ? `${AM_BASELINE_MAP[patient.alteredMentalBaselineStatus]}${baselineDetails.length > 0 ? ` (${baselineDetails.join(', ')})` : ''}`
    : 'ไม่ได้ระบุ';

  let lsnText = 'ไม่ได้ระบุ';
  if (patient.alteredMentalLsnUnknown) {
    lsnText = 'ไม่ทราบเวลาปกติครั้งสุดท้ายแน่ชัด';
  } else if (patient.alteredMentalLsnDate || patient.alteredMentalLsnTime) {
    lsnText = `${safeAmFormatDate(patient.alteredMentalLsnDate) || 'ไม่ระบุวันที่'} เวลา ${safeAmFormatTime(patient.alteredMentalLsnTime) || 'ไม่ระบุเวลา'} น.`;
  }

  const cogs = Array.isArray(patient.alteredMentalCognitiveBehaviors) ? patient.alteredMentalCognitiveBehaviors : [];
  const neuro = Array.isArray(patient.alteredMentalNeuroFlags) ? patient.alteredMentalNeuroFlags : [];
  const systemic = Array.isArray(patient.alteredMentalSystemicFlags) ? patient.alteredMentalSystemicFlags : [];
  const risks = Array.isArray(patient.alteredMentalRiskPrecipitants) ? patient.alteredMentalRiskPrecipitants : [];

  const positives = [];
  const negatives = [];

  // Cognitive behaviors
  if (patient.alteredMentalCogNone) {
    negatives.push('ปฏิเสธพฤติกรรมสับสน เหม่อลอย กระสับกระส่าย ภาพหลอน หรือพูดเลอะเลือน');
  } else {
    cogs.forEach(k => { if (AM_COG_MAP[k]) positives.push(AM_COG_MAP[k]); });
  }

  // Neuro flags
  const hasTraumaTime = patient.alteredMentalHeadTraumaTime || patient.alteredMentalRemoteTraumaTime;
  const hasGaze = neuro.includes('gaze_deviation_or_fixed') || neuro.includes('anisocoria_or_fixed_pupil');
  const hasHeadTrauma = neuro.includes('head_trauma_history') || neuro.includes('head_injury_recent_24h') || neuro.includes('remote_trauma_weeks');

  if (neuro.includes('none_neuro_flags')) {
    negatives.push('ปฏิเสธแขนขาอ่อนแรง ชัก คอแข็ง ตากลอกค้าง และประวัติศีรษะกระแทก');
  } else if (neuro.length > 0) {
    if (neuro.includes('focal_weakness_numbness') || neuro.includes('focal_weakness_face_limb')) {
      positives.push(AM_NEURO_MAP.focal_weakness_numbness);
    } else negatives.push('ปฏิเสธแขนขาอ่อนแรงครึ่งซีกหรือปากเบี้ยว');

    if (neuro.includes('seizure_or_abnormal_movement')) positives.push(AM_NEURO_MAP.seizure_or_abnormal_movement);
    else negatives.push('ปฏิเสธอาการชักเกร็งหรือกระตุก');

    if (neuro.includes('stiff_neck_or_severe_headache')) positives.push(AM_NEURO_MAP.stiff_neck_or_severe_headache);
    else negatives.push('ปฏิเสธคอแข็งเกร็งหรือปวดศีรษะรุนแรงนำมาก่อน');

    if (hasGaze) positives.push(AM_NEURO_MAP.gaze_deviation_or_fixed);
    else negatives.push('ปฏิเสธตากลอกค้างหรือมองค้างข้างเดียว');

    if (hasHeadTrauma) {
      let tDesc = AM_NEURO_MAP.head_trauma_history;
      if (hasTraumaTime && AM_TRAUMA_TIME_MAP[hasTraumaTime]) {
        tDesc += ` (${AM_TRAUMA_TIME_MAP[hasTraumaTime]})`;
      } else if (neuro.includes('head_injury_recent_24h')) {
        tDesc = AM_NEURO_MAP.head_injury_recent_24h;
      }
      positives.push(tDesc);
    } else {
      negatives.push('ปฏิเสธประวัติศีรษะกระแทกหรือลื่นล้ม');
    }

    if (neuro.includes('visible_head_wound')) {
      let wDesc = AM_NEURO_MAP.visible_head_wound;
      if (patient.alteredMentalHeadWoundLocation) wDesc += ` (ตำแหน่ง: ${patient.alteredMentalHeadWoundLocation})`;
      positives.push(wDesc);
    }
  }

  // Systemic flags
  const sysPositiveKeys = systemic.filter(k => k !== 'none_systemic_flags');
  if (patient.alteredMentalSysNone || systemic.includes('none_systemic_flags')) {
    negatives.push('ปฏิเสธไข้สูง ตัวเย็นเฉียบ หอบเหนื่อย ปลายมือเท้าเย็น ไอเสมหะ ปัสสาวะขุ่น และแผลติดเชื้อ');
  } else if (sysPositiveKeys.length > 0) {
    sysPositiveKeys.forEach(k => { if (AM_SYSTEMIC_MAP[k]) positives.push(AM_SYSTEMIC_MAP[k]); });
    if (!sysPositiveKeys.includes('high_fever_or_hypothermia')) negatives.push('ปฏิเสธไข้สูงหรือตัวเย็นเฉียบ');
    if (!sysPositiveKeys.includes('tachypnea_labored_breathing')) negatives.push('ปฏิเสธหายใจหอบเร็วเหนื่อยรุนแรง');
    if (!sysPositiveKeys.includes('cyanosis_cold_clammy')) negatives.push('ปฏิเสธมือเท้าเย็นหรือปากเขียวคล้ำ');
    if (!sysPositiveKeys.includes('cough_purulent_sputum')) negatives.push('ปฏิเสธไอเสมหะข้น');
    if (!sysPositiveKeys.includes('foul_cloudy_urine')) negatives.push('ปฏิเสธปัสสาวะขุ่นกลิ่นเหม็น');
    if (!sysPositiveKeys.includes('infected_bedsore_wound')) negatives.push('ปฏิเสธแผลกดทับหรือแผลติดเชื้อ');
  }

  // GI review
  const anyAmGi = Boolean(patient.alteredMentalGiAbdpain || patient.alteredMentalGiDiarrhea || patient.alteredMentalGiVomit);
  if (patient.alteredMentalGiNone && !anyAmGi) {
    negatives.push('ปฏิเสธอาการปวดท้อง ถ่ายเหลว และคลื่นไส้อาเจียน');
  } else {
    if (patient.alteredMentalGiAbdpain) {
      let abdDesc = 'มีอาการปวดท้อง';
      const locs = (patient.alteredMentalAbdpainLocs || []).map(l => AM_ABDPAIN_LOC_MAP[l] || l);
      if (locs.length > 0) abdDesc += ` บริเวณ${locs.join(', ')}`;
      if (patient.alteredMentalAbdpainChar) abdDesc += ` (${AM_ABDPAIN_CHAR_MAP[patient.alteredMentalAbdpainChar] || patient.alteredMentalAbdpainChar})`;
      positives.push(abdDesc);
    } else if (anyAmGi) {
      negatives.push('ปฏิเสธอาการปวดท้อง');
    }

    if (patient.alteredMentalGiDiarrhea) {
      let diaDesc = `ถ่ายเหลว ${patient.alteredMentalDiarrheaFreq || 0} ครั้ง/วัน`;
      const stools = (patient.alteredMentalDiarrheaStools || []).map(s => AM_STOOL_MAP[s] || s);
      if (stools.length > 0) diaDesc += ` (${stools.join(', ')})`;
      positives.push(diaDesc);
    } else if (anyAmGi) {
      negatives.push('ปฏิเสธอาการถ่ายเหลวหรือท้องเสีย');
    }

    if (patient.alteredMentalGiVomit) {
      let vomDesc = `อาเจียน ${patient.alteredMentalVomitFreq || 0} ครั้ง/วัน`;
      const contents = [...new Set((patient.alteredMentalVomitContents || []).map(v => AM_VOMIT_MAP[v] || v))];
      if (contents.length > 0) vomDesc += ` (${contents.join(', ')})`;
      positives.push(vomDesc);
    } else if (anyAmGi) {
      negatives.push('ปฏิเสธอาการคลื่นไส้อาเจียน');
    }
  }

  // Risk Precipitants
  if (risks.includes('none_risk_factors')) {
    negatives.push('ปฏิเสธประวัติเบาหวานใช้ยา ไตวาย ตับแข็ง ยานอนหลับ สุรา และสารพิษ');
  } else if (risks.length > 0) {
    risks.forEach(k => {
      if (k === 'suspected_overdose_toxin') {
        let toxDesc = AM_RISK_MAP.suspected_overdose_toxin;
        if (patient.alteredMentalToxinDetails) toxDesc += ` (${patient.alteredMentalToxinDetails})`;
        positives.push(toxDesc);
      } else if (AM_RISK_MAP[k]) {
        positives.push(AM_RISK_MAP[k]);
      }
    });
  }

  const extraNote = patient.alteredMentalAdditionalNotes || patient.otherSymptomsFree || '';
  if (extraNote) positives.push(extraNote);

  patient.pertinentPositives = positives.length > 0 ? positives : ['ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม'];
  patient.pertinentNegatives = negatives.length > 0 ? negatives : ['ผู้ป่วยไม่ได้ระบุคำตอบยืนยันในหมวดอาการร่วม'];

  // CAM-ICU Screening
  const cam1 = Boolean(
    patient.alteredMentalOnsetPattern === 'hyperacute_minutes' ||
    patient.alteredMentalOnsetPattern === 'acute_hours' ||
    patient.alteredMentalOnsetPattern === 'fluctuating_day_night'
  );
  const cam2 = cogs.includes('inattention_unfocused');
  const cam3 = Boolean(patient.alteredMentalLevelOfConsciousness && patient.alteredMentalLevelOfConsciousness !== 'unspecified' && patient.alteredMentalLevelOfConsciousness !== 'normal_alert');
  const cam4 = Boolean(cogs.includes('speech_slurred_or_incoherent') || cogs.includes('disoriented_time_place') || cogs.includes('hallucinations_paranoid'));
  const camPositive = (cam1 && cam2 && (cam3 || cam4));
  const camInputPresent = Boolean(
    (patient.alteredMentalOnsetPattern && patient.alteredMentalOnsetPattern !== 'unspecified') ||
    (patient.alteredMentalLevelOfConsciousness && patient.alteredMentalLevelOfConsciousness !== 'unspecified') ||
    cogs.length > 0
  );
  const camStatusText = camPositive
    ? 'CAM Positive: เข้าได้กับภาวะเพ้อเฉียบพลัน (Delirium) ต้องหาสาเหตุกระตุ้นทันที'
    : (camInputPresent
      ? 'CAM Incomplete / Stupor-Coma: ระดับความรู้สึกตัวลดลง ต้องแยก Metabolic / Sepsis / Brain Lesion'
      : 'ไม่ได้ระบุข้อมูลเพียงพอสำหรับการคัดกรอง CAM-ICU');

  const redFlags = detectAlteredMentalRedFlags(patient);
  patient.redFlags = redFlags;

  const hospLabel = {
    ratchaburi: 'มีประวัติการรักษาที่ รพ.ราชบุรี',
    complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
    additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
    self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
    unspecified: 'ไม่ได้ระบุ'
  }[patient.hospRecordStatus] || 'ไม่ได้ระบุ';

  const docNotes = patient.doctor_notes || {};
  const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ')
    ? 'ไม่ได้ระบุ'
    : (patient.currentMeds === 'ไม่มี' ? 'ไม่มี' : patient.currentMeds);
  const udArr = Array.isArray(patient.underlying) ? patient.underlying : (patient.underlying ? [patient.underlying] : []);
  const filteredUd = udArr.filter(u => u && !u.includes('ปฏิเสธ') && u !== 'ไม่มี' && u !== 'ไม่มีโรคประจำตัว' && u !== 'ไม่ได้ระบุ');
  const udExplicitDeny = udArr.some(u => u && (u.includes('ปฏิเสธ') || u === 'ไม่มี' || u === 'ไม่มีโรคประจำตัว'));
  const udText = filteredUd.length > 0
    ? filteredUd.join(', ')
    : ((udExplicitDeny || patient.hospRecordStatus === 'self' || patient.hospRecordStatus === 'additional') ? 'ปฏิเสธ' : 'ไม่ได้ระบุ');
  const allergyText = (!patient.drugAllergy || patient.drugAllergy === 'ไม่ได้ระบุ')
    ? 'ไม่ได้ระบุ'
    : ((patient.drugAllergy.includes('ปฏิเสธ') || patient.drugAllergy === 'ไม่มี') ? 'ปฏิเสธ' : patient.drugAllergy);

  const reporterStr = AM_REPORTER_MAP[patient.alteredMentalReporter] || 'ไม่ได้ระบุ';
  const reporterExtra = `${patient.alteredMentalReporterRelation ? ` (${patient.alteredMentalReporterRelation})` : ''}${patient.alteredMentalReporterPhone ? ` โทร: ${patient.alteredMentalReporterPhone}` : ''}`;

  const defaultRapid = `[Chief Complaint (CC)]
ซึมลง / สับสนเฉียบพลัน / ระดับความรู้สึกตัวเปลี่ยนแปลง (Altered Mental Status) มา ${durationText}

[History of Present Illness (HPI)]
• ผู้ให้ประวัติ: ${reporterStr}${reporterExtra}
• ระดับความสามารถเดิม (Baseline): ${baselineText}
• รูปแบบการเริ่มมีอาการ: ${AM_ONSET_MAP[patient.alteredMentalOnsetPattern] || 'ไม่ได้ระบุ'}
• เวลาปกติครั้งสุดท้าย (LSN): ${lsnText}
• ระดับการตื่นตัวในขณะนี้: ${AM_CONSCIOUS_MAP[patient.alteredMentalLevelOfConsciousness] || 'ไม่ได้ระบุ'}
• การรู้คิดที่เปลี่ยนไป: ${cogs.length > 0 ? cogs.map(k => AM_COG_MAP[k] || k).join(', ') : (patient.alteredMentalCogNone ? 'ปฏิเสธพฤติกรรมผิดปกติ' : 'ไม่ได้ระบุ')}

• Pertinent Positives:
${patient.pertinentPositives.map(p => `  - ${p}`).join('\n')}

• Pertinent Negatives:
${patient.pertinentNegatives.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• โรคประจำตัว (U/D): ${udText}
• ยาประจำตัว (Current Meds): ${medsText}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${allergyText}

[Emergency Risk Assessment (Red Flags)]
${redFlags.length > 0
  ? `🚩 RED FLAGS DETECTED:\n${redFlags.map(rf => `  * ${rf.textTh} — ${rf.risk}`).join('\n')}`
  : '✓ ไม่พบสัญญาณเตือนวิกฤตเฉียบพลันเบื้องต้น'}
• การคัดกรอง Delirium (CAM-ICU): ${camStatusText}

[Doctor's Clinical Addendum & Exam]
• ประวัติเพิ่มเติม/แก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}
• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}
• แผนการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

  const genderLabel = (patient.gender && patient.gender !== 'ไม่ระบุ') ? patient.gender : '';
  const durPhrase = durVal ? `มา ${durationText} ก่อนมาโรงพยาบาล` : 'ไม่ระบุระยะเวลา';
  const defaultNarrative = `ผู้ป่วย${genderLabel} อายุ ${patient.age || 'ไม่ได้ระบุ'} ปี มารับการตรวจด้วยอาการซึมลง / สับสนเฉียบพลัน ${durPhrase} ` +
    `ผู้ให้ประวัติ: ${reporterStr}${reporterExtra} ระดับเดิมก่อนป่วย: ${baselineText} ` +
    `เริ่มมีอาการแบบ${AM_ONSET_MAP[patient.alteredMentalOnsetPattern] || 'ไม่ได้ระบุรูปแบบ'} เวลาปกติครั้งสุดท้าย: ${lsnText} ` +
    `ระดับการตื่นตัวในขณะนี้: ${AM_CONSCIOUS_MAP[patient.alteredMentalLevelOfConsciousness] || 'ไม่ได้ระบุ'} ` +
    `อาการร่วมสำคัญ: ${patient.pertinentPositives.join(', ')}`;

  const jsonPayload = {
    encounter: {
      chief_complaint: 'altered_mental',
      chief_complaint_title_th: 'ซึมลง / สับสนเฉียบพลัน',
      timestamp: patient.timestamp || new Date().toISOString(),
      duration_value: durVal || null,
      duration_unit: patient.durationUnit || 'hours'
    },
    patient_identification: {
      id: patient.id || null,
      queue_number: patient.queue_number || null,
      hn: patient.hn || null,
      name: patient.name || null,
      age: patient.age || null,
      gender: patient.gender || null
    },
    triage_assessment: {
      informant_type: patient.alteredMentalReporter || null,
      baseline_status: patient.alteredMentalBaselineStatus || null,
      onset_pattern: patient.alteredMentalOnsetPattern || null,
      last_seen_normal: {
        unknown: Boolean(patient.alteredMentalLsnUnknown),
        date: safeAmFormatDate(patient.alteredMentalLsnDate) || null,
        time: safeAmFormatTime(patient.alteredMentalLsnTime) || null
      },
      level_of_consciousness: patient.alteredMentalLevelOfConsciousness || null,
      cognitive_behaviors: cogs,
      neuro_flags: neuro,
      head_trauma_timeframe: hasTraumaTime || null,
      systemic_flags: sysPositiveKeys,
      gastrointestinal: {
        abdominal_pain: Boolean(patient.alteredMentalGiAbdpain),
        diarrhea: Boolean(patient.alteredMentalGiDiarrhea),
        vomiting: Boolean(patient.alteredMentalGiVomit)
      },
      risk_precipitants: risks,
      cam_positive: camPositive
    },
    safety_and_red_flags: {
      red_flags_detected: redFlags.map(rf => ({
        key: rf.key,
        title_th: rf.textTh,
        clinical_risk: rf.risk
      })),
      total_red_flags: redFlags.length
    }
  };

  const finalRapid = patient.custom_rapid_note || defaultRapid;
  const finalNarrative = patient.custom_narrative_note || defaultNarrative;
  patient.rapidHpi = finalRapid;
  patient.narrativeHpi = finalNarrative;
  patient.medicalJson = jsonPayload;

  if (typeof document !== 'undefined') {
    const rapidEl = document.getElementById('rapidTextView');
    const narrativeEl = document.getElementById('narrativeTextView');
    const jsonEl = document.getElementById('jsonViewer');
    if (rapidEl) rapidEl.value = finalRapid;
    if (narrativeEl) narrativeEl.value = finalNarrative;
    if (jsonEl) jsonEl.textContent = JSON.stringify(jsonPayload, null, 2);
  }

  return { rapid: finalRapid, narrative: finalNarrative, json: jsonPayload };
}

// =========================================================================
// UI TEMPLATE FRAGMENTS (Golden UI/UX — 4 Cards + Additional + PMH Card 5)
// =========================================================================
const AM_BEDRIDDEN_SUB_HTML = `<div id="alteredMentalBedriddenDetailsWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-3 space-y-3">
  <div class="text-xs font-semibold text-slate-700">ข้อมูลสถานะเดิมก่อนเกิดอาการ (ผู้ป่วยติดเตียง)</div>
  <div>
    <div class="text-[11px] font-semibold text-slate-600 mb-1.5">การสื่อสารเดิม:</div>
    ${renderAmGrid('grid-cols-1 sm:grid-cols-3', [
      { kind: 'radio', name: 'alteredMentalBedriddenCommunication', value: 'talk_normal', title: ['พูดเป็นประโยค', 'รู้เรื่อง'] },
      { kind: 'radio', name: 'alteredMentalBedriddenCommunication', value: 'talk_limited', title: ['พูดได้เป็นคำสั้นๆ'] },
      { kind: 'radio', name: 'alteredMentalBedriddenCommunication', value: 'mute_sounds', title: ['ไม่พูด / ส่งเสียง', 'อืออา'] }
    ], { compact: true })}
  </div>
  <div>
    <div class="text-[11px] font-semibold text-slate-600 mb-1.5">การขยับตัวเดิม:</div>
    ${renderAmGrid('grid-cols-1 sm:grid-cols-3', [
      { kind: 'radio', name: 'alteredMentalBedriddenMobility', value: 'turn_sit', title: ['พลิกตัว / พยุงนั่ง', 'บนเตียงได้'] },
      { kind: 'radio', name: 'alteredMentalBedriddenMobility', value: 'limb_move_only', title: ['ขยับแขนขาได้', 'แต่นั่งไม่ได้'] },
      { kind: 'radio', name: 'alteredMentalBedriddenMobility', value: 'flaccid_no_move', title: ['นอนนิ่ง ไม่ขยับ', 'แขนขาเอง'] }
    ], { compact: true })}
  </div>
  <div>
    <div class="text-[11px] font-semibold text-slate-600 mb-1.5">การรับประทานอาหารเดิม:</div>
    ${renderAmGrid('grid-cols-2 sm:grid-cols-4', [
      { kind: 'radio', name: 'alteredMentalBedriddenFeeding', value: 'oral_self', title: ['ทานเองได้'] },
      { kind: 'radio', name: 'alteredMentalBedriddenFeeding', value: 'oral_assisted', title: ['ญาติต้องป้อน'] },
      { kind: 'radio', name: 'alteredMentalBedriddenFeeding', value: 'ng_tube', title: ['สายยางจมูก (NG)'] },
      { kind: 'radio', name: 'alteredMentalBedriddenFeeding', value: 'peg_tube', title: ['สายหน้าท้อง (PEG)'] }
    ], { compact: true })}
  </div>
  <div>
    <div class="text-[11px] font-semibold text-slate-600 mb-1.5">การขับถ่ายเดิม:</div>
    ${renderAmGrid('grid-cols-1 sm:grid-cols-3', [
      { kind: 'radio', name: 'alteredMentalBedriddenElimination', value: 'continent', title: ['ขับถ่ายรู้ตัว', 'บอกได้'] },
      { kind: 'radio', name: 'alteredMentalBedriddenElimination', value: 'foley_catheter', title: ['คาสายสวนปัสสาวะ'] },
      { kind: 'radio', name: 'alteredMentalBedriddenElimination', value: 'diapers', title: ['ใส่ผ้าอ้อม', 'ไม่รู้ตัว'] }
    ], { compact: true })}
  </div>
</div>`;

const AM_NEURO_SUBS_HTML = [
  `<div id="alteredMentalHeadTraumaWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-3 space-y-2.5">
    <div class="text-xs font-semibold text-slate-700">ระบุช่วงเวลาที่เกิดเหตุศีรษะกระแทกหรือลื่นล้ม</div>
    ${renderAmGrid('grid-cols-1 sm:grid-cols-2', [
      { kind: 'radio', name: 'alteredMentalHeadTraumaTime', value: 'within_24h', title: ['ภายใน 24 ชั่วโมง'] },
      { kind: 'radio', name: 'alteredMentalHeadTraumaTime', value: 'gt24h_to_1w', title: ['1–7 วันก่อน'] },
      { kind: 'radio', name: 'alteredMentalHeadTraumaTime', value: 'remote_1_2w', title: ['1–2 สัปดาห์ก่อน'] },
      { kind: 'radio', name: 'alteredMentalHeadTraumaTime', value: 'remote_2_4w', title: ['2–4 สัปดาห์ก่อน'] },
      { kind: 'radio', name: 'alteredMentalHeadTraumaTime', value: 'remote_1_2m', title: ['1–2 เดือนก่อน'] },
      { kind: 'radio', name: 'alteredMentalHeadTraumaTime', value: 'remote_gt_2m', title: ['มากกว่า 2 เดือนก่อน'] },
      { kind: 'radio', name: 'alteredMentalHeadTraumaTime', value: 'remote_unknown', title: ['จำระยะเวลาไม่ได้'], colSpan2: true }
    ], { compact: true })}
  </div>`,
  `<div id="alteredMentalHeadWoundDetailsWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-3 space-y-2">
    <label class="block text-xs font-semibold text-slate-700">ระบุตำแหน่งบาดแผล รอยบวมโน หรือรอยฟกช้ำ</label>
    <input type="text" id="alteredMentalHeadWoundLocation" placeholder="เช่น ขมับขวา, หน้าผาก, ท้ายทอย, รอบเบ้าตา"
      class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400">
  </div>`
].join('\n');

const AM_GI_SUBS_HTML = [
  `<div id="alteredMentalAbdpainWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-3 space-y-2.5">
    <div class="text-xs font-semibold text-slate-700">รายละเอียดอาการปวดท้อง</div>
    <div>
      <div class="text-[11px] font-semibold text-slate-600 mb-1.5">ตำแหน่งที่ปวดท้อง (เลือกได้หลายตำแหน่ง):</div>
      ${renderAmGrid('grid-cols-2 sm:grid-cols-4', [
        { name: 'alteredMentalAbdpainLocs', value: 'ruq', title: ['ชายโครงขวา'] },
        { name: 'alteredMentalAbdpainLocs', value: 'epigastrium', title: ['ลิ้นปี่'] },
        { name: 'alteredMentalAbdpainLocs', value: 'luq', title: ['ชายโครงซ้าย'] },
        { name: 'alteredMentalAbdpainLocs', value: 'rlq', title: ['ท้องน้อยขวา'] },
        { name: 'alteredMentalAbdpainLocs', value: 'suprapubic', title: ['เหนือหัวเหน่า'] },
        { name: 'alteredMentalAbdpainLocs', value: 'llq', title: ['ท้องน้อยซ้าย'] },
        { name: 'alteredMentalAbdpainLocs', value: 'diffuse', title: ['ปวดทั่วท้อง /', 'ระบุตำแหน่งไม่ได้'], colSpan2: true }
      ], { compact: true })}
    </div>
    <div>
      <div class="text-[11px] font-semibold text-slate-600 mb-1.5">ลักษณะการปวดท้อง:</div>
      ${renderAmGrid('grid-cols-1 sm:grid-cols-2', [
        { kind: 'radio', name: 'alteredMentalAbdpainChar', value: 'colicky_spasm', title: ['ปวดบิดเกร็ง', 'เป็นพักๆ'] },
        { kind: 'radio', name: 'alteredMentalAbdpainChar', value: 'dull_aching', title: ['ปวดตื้อแน่น', 'ตลอดเวลา'] },
        { kind: 'radio', name: 'alteredMentalAbdpainChar', value: 'burning', title: ['ปวดแสบร้อน', 'กลางอก/ลิ้นปี่'] },
        { kind: 'radio', name: 'alteredMentalAbdpainChar', value: 'sharp_severe', title: ['ปวดรุนแรงเฉียบพลัน', '/ เสียดแทง'] }
      ], { compact: true })}
    </div>
  </div>`,
  `<div id="alteredMentalDiarrheaWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-3 space-y-2.5">
    <div class="flex flex-wrap items-center gap-2">
      <label class="text-xs font-semibold text-slate-700">จำนวนครั้งที่ถ่ายเหลวต่อวัน:</label>
      <input type="number" id="alteredMentalDiarrheaFreq" min="0" placeholder="เช่น 3"
        class="w-24 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800">
      <span class="text-xs text-slate-500">ครั้ง/วัน</span>
    </div>
    <div>
      <div class="text-[11px] font-semibold text-slate-600 mb-1.5">ลักษณะอุจจาระ (เลือกได้หลายข้อ):</div>
      ${renderAmGrid('grid-cols-2 sm:grid-cols-4', [
        { name: 'alteredMentalDiarrheaStools', value: 'watery', title: ['ถ่ายเป็นน้ำเหลว'] },
        { name: 'alteredMentalDiarrheaStools', value: 'mucous', title: ['มีมูกปน'] },
        { name: 'alteredMentalDiarrheaStools', value: 'bloody', title: ['มีเลือดสดปน'] },
        { name: 'alteredMentalDiarrheaStools', value: 'melena_tarry', title: ['อุจจาระสีดำ', 'ยางมะตอย'] }
      ], { compact: true })}
    </div>
  </div>`,
  `<div id="alteredMentalVomitWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-3 space-y-2.5">
    <div class="flex flex-wrap items-center gap-2">
      <label class="text-xs font-semibold text-slate-700">จำนวนครั้งที่อาเจียนต่อวัน:</label>
      <input type="number" id="alteredMentalVomitFreq" min="0" placeholder="เช่น 2"
        class="w-24 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800">
      <span class="text-xs text-slate-500">ครั้ง/วัน</span>
    </div>
    <div>
      <div class="text-[11px] font-semibold text-slate-600 mb-1.5">สิ่งที่อาเจียนออกมา (เลือกได้หลายข้อ):</div>
      ${renderAmGrid('grid-cols-2 sm:grid-cols-4', [
        { name: 'alteredMentalVomitContents', value: 'food_content', title: ['เศษอาหาร'] },
        { name: 'alteredMentalVomitContents', value: 'bile_green', title: ['น้ำดีสีเขียว', '/ เหลือง'] },
        { name: 'alteredMentalVomitContents', value: 'coffee_ground_blood', title: ['เลือดสด /', 'สีกาแฟคั่ว'] },
        { name: 'alteredMentalVomitContents', value: 'projectile', title: ['อาเจียนพุ่ง', 'รุนแรง'] }
      ], { compact: true })}
    </div>
  </div>`
].join('\n');

const alteredMentalModule = {
  id: 'altered_mental',
  schemaCode: 'altered_mental_status',
  recordCc: 'altered_mental',
  titleTh: 'ซึมลง / สับสนเฉียบพลัน / ระดับความรู้สึกตัวเปลี่ยนแปลง',
  titleEn: 'Altered Mental Status / Delirium / Lethargy',
  icon: 'help-circle',
  sectionDomId: 'alteredMentalQuestionnaireSection',
  doctorCcBadgeHtml: '<i data-lucide="help-circle" class="w-3.5 h-3.5 mr-1 text-amber-500"></i> CC: ซึมลง / สับสนเฉียบพลัน / ระดับความรู้สึกตัวเปลี่ยนแปลง (Altered Mental Status)',
  pmhSectionNumber: 5,
  getPmhSectionNumber: () => 5,
  dateFields: ['alteredMentalLsnDate'],
  timeFields: ['alteredMentalLsnTime'],
  branchIds: [
    'alteredMentalBedriddenDetailsWrap',
    'alteredMentalHeadTraumaWrap',
    'alteredMentalHeadWoundDetailsWrap',
    'alteredMentalAbdpainWrap',
    'alteredMentalDiarrheaWrap',
    'alteredMentalVomitWrap',
    'alteredMentalToxinDetailsWrap'
  ],
  inputIdsToClear: [
    'alteredMentalDurationVal',
    'alteredMentalReporterRelation',
    'alteredMentalReporterPhone',
    'alteredMentalLsnDate',
    'alteredMentalLsnTime',
    'alteredMentalHeadWoundLocation',
    'alteredMentalDiarrheaFreq',
    'alteredMentalVomitFreq',
    'alteredMentalToxinDetails',
    'alteredMentalAdditionalNotes'
  ],

  algorithm: {
    id: 'altered_mental',
    schemaCode: 'altered_mental_status',
    titleTh: 'ซึมลง / สับสนเฉียบพลัน / ระดับความรู้สึกตัวเปลี่ยนแปลง',
    titleEn: 'Altered Mental Status / Delirium / Coma',
    version: '2.0.0'
  },

  formHtml: `
    <div id="alteredMentalQuestionnaireSection" class="hidden space-y-6">
      <div data-cc-top-banner="altered_mental">
        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
          <div class="bg-amber-100 text-amber-800 p-2.5 rounded-xl flex-shrink-0 mt-0.5">
            <i data-lucide="alert-circle" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-amber-900 mb-1">คำแนะนำการดูแลเบื้องต้นระหว่างรอตรวจ</h3>
            <p class="text-xs text-amber-800 leading-relaxed">
              หากผู้ป่วยซึมมากหรืออาเจียน กรุณาจัดให้นอนตะแคงกึ่งคว่ำเพื่อป้องกันการสำลัก <strong>ห้ามป้อนน้ำ อาหาร หรือยาทางปากขณะซึมหรือสับสน</strong> หากปลุกไม่ตื่น ชักเกร็ง หายใจเฮือกหรือติดขัด หรือปากเขียวคล้ำ กรุณาแจ้งพยาบาลทันที และเตรียมซองยา/ประวัติเดิมให้แพทย์ดู
            </p>
          </div>
        </div>
      </div>

      <!-- CARD 1: ผู้ให้ประวัติ ระดับเดิมก่อนป่วย และเวลาปกติครั้งสุดท้าย -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="help-circle" class="w-5 h-5"></i>
          </div>
          <h2 class="text-base font-bold text-slate-900">1. ผู้ให้ประวัติ ระดับเดิมก่อนป่วย และเวลาปกติครั้งสุดท้าย</h2>
        </div>

        <div class="space-y-4">
          <div>
            ${renderAmSysHeader({
              label: '1.1 ระยะเวลาที่เริ่มสังเกตเห็นอาการซึมลงหรือสับสน',
              icon: 'clock',
              colorClass: 'bg-sky-100 text-sky-700'
            })}
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div class="col-span-1 sm:col-span-2">
                <input type="number" id="alteredMentalDurationVal" min="1" max="1000" placeholder="ระบุตัวเลข เช่น 2"
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm placeholder:text-slate-400 placeholder:font-normal">
              </div>
              <div class="col-span-1">
                <select id="alteredMentalDurationUnit"
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
            ${renderAmSysHeader({
              label: '1.2 ผู้ให้ข้อมูลประวัติเหตุการณ์',
              icon: 'users',
              colorClass: 'bg-sky-100 text-sky-700'
            })}
            ${renderAmGrid('grid-cols-1 sm:grid-cols-2', [
              { kind: 'radio', name: 'alteredMentalReporter', value: 'caregiver_family', title: ['ญาติ / ผู้ดูแล', 'ที่อยู่ด้วยกันประจำ'] },
              { kind: 'radio', name: 'alteredMentalReporter', value: 'relative_occasional', title: ['ญาติที่เพิ่ง', 'มาเยี่ยม'] },
              { kind: 'radio', name: 'alteredMentalReporter', value: 'witness_rescuer', title: ['ผู้พบเหตุ / เพื่อน', '/ กู้ชีพ'] },
              { kind: 'radio', name: 'alteredMentalReporter', value: 'patient_confused', title: ['ผู้ป่วยเล่าเอง', 'แต่สับสน'] }
            ])}
            <div class="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] font-semibold text-slate-700 mb-1">ความสัมพันธ์กับผู้ป่วย (ถ้ามี):</label>
                <input type="text" id="alteredMentalReporterRelation" placeholder="เช่น บุตรสาว, ภรรยา, ผู้ดูแล"
                  class="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400">
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-slate-700 mb-1">เบอร์ติดต่อผู้ให้ประวัติ (ถ้ามี):</label>
                <input type="tel" id="alteredMentalReporterPhone" placeholder="เช่น 081-234-5678"
                  class="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400">
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100">
            ${renderAmSysHeader({
              label: '1.3 ระดับความสามารถเดิมก่อนป่วยครั้งนี้',
              icon: 'user-check',
              colorClass: 'bg-sky-100 text-sky-700'
            })}
            <p class="text-[11px] text-slate-600 mb-2">หมายเหตุ: ประเมินสภาพปกติในชีวิตประจำวัน <strong class="font-bold text-slate-800">ก่อนเริ่มมีอาการซึมลงในครั้งนี้</strong></p>
            ${renderAmGrid('grid-cols-1 sm:grid-cols-2', [
              { kind: 'radio', name: 'alteredMentalBaselineStatus', value: 'normal_independent', title: ['เดิมปกติ', 'ช่วยเหลือตัวเองได้'], desc: 'พูดคุยรู้เรื่อง เดินเหินและทำกิจวัตรประจำวันเองได้', onchange: 'handleAlteredMentalBaselineChange(this.value)' },
              { kind: 'radio', name: 'alteredMentalBaselineStatus', value: 'mild_cognitive_independent', title: ['หลงลืมเล็กน้อย', 'ตามวัย'], desc: 'ยังช่วยเหลือตัวเองในชีวิตประจำวันได้', onchange: 'handleAlteredMentalBaselineChange(this.value)' },
              { kind: 'radio', name: 'alteredMentalBaselineStatus', value: 'known_dementia_partially_dependent', title: ['มีสมองเสื่อมเดิม', 'แต่ทรุดลงชัดเจน'], desc: 'เดิมพอสื่อสารหรือช่วยตัวเองได้บางส่วน แต่ครั้งนี้แย่ลงมาก', onchange: 'handleAlteredMentalBaselineChange(this.value)' },
              { kind: 'radio', name: 'alteredMentalBaselineStatus', value: 'bedridden_totally_dependent', title: ['ผู้ป่วยติดเตียงเดิม', 'ซึมลงผิดปกติ'], desc: 'เดิมนอนติดเตียง แต่ครั้งนี้ปลุกไม่ค่อยตื่นหรือตอบสนองน้อยลง', onchange: 'handleAlteredMentalBaselineChange(this.value)' }
            ])}
            ${AM_BEDRIDDEN_SUB_HTML}
          </div>

          <div class="pt-4 border-t border-slate-100">
            ${renderAmSysHeader({
              label: '1.4 รูปแบบการเริ่มมีอาการ และเวลาปกติครั้งสุดท้าย',
              icon: 'calendar-clock',
              colorClass: 'bg-sky-100 text-sky-700'
            })}
            ${renderAmGrid('grid-cols-1 sm:grid-cols-2', [
              { kind: 'radio', name: 'alteredMentalOnsetPattern', value: 'hyperacute_minutes', title: ['เกิดขึ้นทันทีทันใด', 'ในหลักนาที'] },
              { kind: 'radio', name: 'alteredMentalOnsetPattern', value: 'acute_hours', title: ['ทรุดลงชัดเจน', 'ในไม่กี่ชั่วโมง'] },
              { kind: 'radio', name: 'alteredMentalOnsetPattern', value: 'subacute_days', title: ['ค่อยๆ ซึมลง', 'สะสมมาหลายวัน'] },
              { kind: 'radio', name: 'alteredMentalOnsetPattern', value: 'fluctuating_day_night', title: ['เป็นๆ หายๆ', 'หรือสับสน', 'ช่วงเย็น-กลางคืน'] }
            ])}
            <div class="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <div class="text-xs font-semibold text-slate-700">เวลาปกติครั้งสุดท้ายที่ยังรู้สึกตัวดี (Last Seen Normal)</div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] font-semibold text-slate-600 mb-1">วันที่ปกติครั้งสุดท้าย (วว/ดด/ปปปป):</label>
                  <input type="text" id="alteredMentalLsnDate" data-universal-date="true" placeholder="วว/ดด/ปปปป" autocomplete="off"
                    class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 font-medium">
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-slate-600 mb-1">เวลาปกติครั้งสุดท้าย (24 ชม.):</label>
                  <input type="text" id="alteredMentalLsnTime" data-universal-time="true" placeholder="เช่น 14:30" autocomplete="off"
                    class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 font-medium">
                </div>
              </div>
              <label class="selectable-card bg-white flex items-center p-2.5 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" id="alteredMentalLsnUnknown" onchange="handleAlteredMentalLsnUnknownToggle(this)" class="rounded text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 flex-shrink-0">
                <span class="ml-3 text-xs font-semibold text-slate-800">ไม่ทราบเวลาปกติครั้งสุดท้ายแน่ชัด (ไม่ได้สังเกต / ไม่มีผู้พบเห็น)</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 2: ระดับการตื่นตัว พฤติกรรม และอาการทางสมอง -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="eye" class="w-5 h-5"></i>
          </div>
          <h2 class="text-base font-bold text-slate-900">2. ระดับการตื่นตัว พฤติกรรม และอาการทางสมอง</h2>
        </div>

        <div class="space-y-4">
          <div>
            ${renderAmSysHeader({
              label: '2.1 ระดับการตื่นตัวในขณะนี้',
              icon: 'eye',
              colorClass: 'bg-teal-100 text-teal-700'
            })}
            ${renderAmGrid('grid-cols-1 sm:grid-cols-2', [
              { kind: 'radio', name: 'alteredMentalLevelOfConsciousness', value: 'drowsy_lethargic', title: ['ซึมลง ปลุกตื่นง่าย', 'เมื่อเรียก'], desc: 'หยุดคุยจะผล็อยหลับไปใหม่' },
              { kind: 'radio', name: 'alteredMentalLevelOfConsciousness', value: 'stupor_pain_only', title: ['หลับลึก', 'ต้องกระตุ้นเจ็บ'], desc: 'เรียกเสียงดังไม่ตื่น ต้องเขย่าแรงๆ' },
              { kind: 'radio', name: 'alteredMentalLevelOfConsciousness', value: 'coma_unresponsive', title: ['หมดสติ ไม่ลืมตา', 'ไม่ตอบสนอง'] },
              { kind: 'radio', name: 'alteredMentalLevelOfConsciousness', value: 'awake_but_confused', title: ['ตื่นลืมตาได้เอง', 'แต่พูดคุยสับสน'] }
            ])}
          </div>

          <div class="pt-4 border-t border-slate-100">
            ${renderAmSysHeader({
              label: '2.2 พฤติกรรมและการรับรู้ที่เปลี่ยนไป (เลือกได้หลายข้อ)',
              icon: 'brain',
              colorClass: 'bg-teal-100 text-teal-700',
              toggleId: 'alteredMental_cog_none',
              toggleLabel: 'ไม่มีอาการในหมวดนี้',
              toggleOnchange: 'handleAlteredMentalCogNoneToggle(this)'
            })}
            ${renderAmGrid('grid-cols-1 sm:grid-cols-2', [
              { name: 'alteredMentalCognitiveBehaviors', value: 'inattention_unfocused', title: ['ขาดสมาธิ เหม่อลอย', 'เรียกไม่ค่อยหัน'], onchange: 'handleAlteredMentalCogItemChange(this)' },
              { name: 'alteredMentalCognitiveBehaviors', value: 'disoriented_time_place', title: ['สับสนวันเวลา', 'สถานที่ / บุคคล'], onchange: 'handleAlteredMentalCogItemChange(this)' },
              { name: 'alteredMentalCognitiveBehaviors', value: 'agitated_restless', title: ['กระสับกระส่าย', 'เอะอะโวยวาย'], onchange: 'handleAlteredMentalCogItemChange(this)' },
              { name: 'alteredMentalCognitiveBehaviors', value: 'hallucinations_paranoid', title: ['เห็นภาพหลอน /', 'หวาดระแวง'], onchange: 'handleAlteredMentalCogItemChange(this)' },
              { name: 'alteredMentalCognitiveBehaviors', value: 'speech_slurred_or_incoherent', title: ['พูดเลอะเลือน /', 'พูดไม่ชัด'], onchange: 'handleAlteredMentalCogItemChange(this)' },
              { name: 'alteredMentalCognitiveBehaviors', value: 'apathy_mute', title: ['นิ่งเฉย ไม่พูด', 'ไม่สบตา'], onchange: 'handleAlteredMentalCogItemChange(this)' },
              { name: 'alteredMentalCognitiveBehaviors', value: 'poor_intake_refusal', title: ['ไม่ทานอาหาร /', 'ดื่มน้ำได้น้อยมาก'], onchange: 'handleAlteredMentalCogItemChange(this)', colSpan2: true }
            ])}
          </div>

          <div class="pt-4 border-t border-slate-100">
            ${renderAmSysHeader({
              label: '2.3 อาการทางระบบประสาทและการบาดเจ็บศีรษะ (เลือกได้หลายข้อ)',
              icon: 'alert-triangle',
              colorClass: 'bg-amber-100 text-amber-700',
              toggleId: 'alteredMentalNeuroNoneCb',
              toggleName: 'alteredMentalNeuroFlags',
              toggleValue: 'none_neuro_flags',
              toggleLabel: 'ไม่มีอาการในหมวดนี้',
              toggleOnchange: 'handleAlteredMentalNeuroNoneToggle(this)'
            })}
            ${renderAmGrid('grid-cols-1 sm:grid-cols-2', [
              { name: 'alteredMentalNeuroFlags', value: 'focal_weakness_numbness', title: ['แขนขาอ่อนแรง', 'ครึ่งซีก / ปากเบี้ยว'], onchange: 'handleAlteredMentalNeuroItemChange(this)' },
              { name: 'alteredMentalNeuroFlags', value: 'seizure_or_abnormal_movement', title: ['ชักเกร็ง กระตุก', '/ ตาค้าง เหม่อลอย'], onchange: 'handleAlteredMentalNeuroItemChange(this)' },
              { name: 'alteredMentalNeuroFlags', value: 'stiff_neck_or_severe_headache', title: ['คอแข็งก้มไม่ลง /', 'ปวดหัวรุนแรงมาก'], onchange: 'handleAlteredMentalNeuroItemChange(this)' },
              { name: 'alteredMentalNeuroFlags', value: 'gaze_deviation_or_fixed', title: ['ตากลอกไม่มา /', 'มองค้างข้างเดียว'], onchange: 'handleAlteredMentalNeuroItemChange(this)' },
              { id: 'alteredMentalHeadTraumaCb', name: 'alteredMentalNeuroFlags', value: 'head_trauma_history', title: ['ประวัติล้ม /', 'ศีรษะกระแทก'], desc: 'ทั้งเพิ่งเกิดหรือหลายสัปดาห์/เดือนก่อน', onchange: 'handleAlteredMentalHeadTraumaToggle(this)' },
              { id: 'alteredMentalVisibleHeadWoundCb', name: 'alteredMentalNeuroFlags', value: 'visible_head_wound', title: ['มีแผล / บวมโน', 'ที่ศีรษะ / ใบหน้า'], onchange: 'handleAlteredMentalHeadWoundToggle(this)' }
            ])}
            ${AM_NEURO_SUBS_HTML}
          </div>
        </div>
      </div>

      <!-- CARD 3: อาการทางร่างกาย การติดเชื้อ และทางเดินอาหาร -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="thermometer" class="w-5 h-5"></i>
          </div>
          <h2 class="text-base font-bold text-slate-900">3. อาการทางร่างกาย การติดเชื้อ และทางเดินอาหาร</h2>
        </div>

        <div class="space-y-4">
          <div>
            ${renderAmSysHeader({
              label: '3.1 อาการติดเชื้อและสัญญาณชีพผิดปกติ (เลือกได้หลายข้อ)',
              icon: 'thermometer',
              colorClass: 'bg-amber-100 text-amber-700',
              toggleId: 'alteredMental_sys_none',
              toggleLabel: 'ไม่มีอาการในหมวดนี้',
              toggleOnchange: 'handleAlteredMentalSysNoneToggle(this)'
            })}
            ${renderAmGrid('grid-cols-1 sm:grid-cols-2', [
              { name: 'alteredMentalSystemicFlags', value: 'high_fever_or_hypothermia', title: ['ไข้สูง หนาวสั่น', 'หรือตัวเย็นเฉียบ'], onchange: 'handleAlteredMentalSysItemChange(this)' },
              { name: 'alteredMentalSystemicFlags', value: 'tachypnea_labored_breathing', title: ['หายใจหอบเร็ว', 'เหนื่อยรุนแรง'], onchange: 'handleAlteredMentalSysItemChange(this)' },
              { name: 'alteredMentalSystemicFlags', value: 'cyanosis_cold_clammy', title: ['มือเท้าเย็นเฉียบ', 'หน้าซีด / ปากเขียว'], onchange: 'handleAlteredMentalSysItemChange(this)' },
              { name: 'alteredMentalSystemicFlags', value: 'cough_purulent_sputum', title: ['มีอาการไอ', 'เสมหะเหลืองเขียว'], onchange: 'handleAlteredMentalSysItemChange(this)' },
              { name: 'alteredMentalSystemicFlags', value: 'rhinorrhea_sore_throat', title: ['มีน้ำมูก คัดจมูก', 'หรือเจ็บคอ'], onchange: 'handleAlteredMentalSysItemChange(this)' },
              { name: 'alteredMentalSystemicFlags', value: 'foul_cloudy_urine', title: ['ปัสสาวะขุ่น', 'กลิ่นเหม็น / ปนเลือด'], onchange: 'handleAlteredMentalSysItemChange(this)' },
              { name: 'alteredMentalSystemicFlags', value: 'infected_bedsore_wound', title: ['มีแผลกดทับ /', 'แผลมีหนองติดเชื้อ'], onchange: 'handleAlteredMentalSysItemChange(this)', colSpan2: true }
            ])}
          </div>

          <div class="pt-4 border-t border-slate-100">
            ${renderAmSysHeader({
              label: '3.2 อาการทางเดินอาหารร่วม (เลือกได้หลายข้อ)',
              icon: 'activity',
              colorClass: 'bg-sky-100 text-sky-700',
              toggleId: 'alteredMental_gi_none',
              toggleLabel: 'ไม่มีอาการในหมวดนี้',
              toggleOnchange: 'handleAlteredMentalGiNoneToggle(this)'
            })}
            ${renderAmGrid('grid-cols-1 sm:grid-cols-3', [
              { id: 'alteredMentalGiAbdpain', title: ['ปวดท้อง'], onchange: 'handleAlteredMentalGiToggle()' },
              { id: 'alteredMentalGiDiarrhea', title: ['ถ่ายเหลว /', 'ท้องเสีย'], onchange: 'handleAlteredMentalGiToggle()' },
              { id: 'alteredMentalGiVomit', title: ['คลื่นไส้ /', 'อาเจียน'], onchange: 'handleAlteredMentalGiToggle()' }
            ])}
            ${AM_GI_SUBS_HTML}
          </div>
        </div>
      </div>

      <!-- CARD 4: โรคประจำตัวเสี่ยงสูง ยา สุรา และสารพิษ -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="shield-alert" class="w-5 h-5"></i>
          </div>
          <h2 class="text-base font-bold text-slate-900">4. โรคประจำตัวเสี่ยงสูง ยา สุรา และสารพิษ</h2>
        </div>

        <div>
          ${renderAmSysHeader({
            label: 'ประวัติความเสี่ยงเฉพาะโรค ยา และสารพิษ (เลือกได้หลายข้อ)',
            icon: 'pill',
            colorClass: 'bg-indigo-100 text-indigo-700',
            toggleId: 'alteredMentalRiskNoneCb',
            toggleName: 'alteredMentalRiskPrecipitants',
            toggleValue: 'none_risk_factors',
            toggleLabel: 'ไม่มีในหมวดนี้',
            toggleOnchange: 'handleAlteredMentalRiskNoneToggle(this)'
          })}
          ${renderAmGrid('grid-cols-1 sm:grid-cols-2', [
            { name: 'alteredMentalRiskPrecipitants', value: 'diabetic_insulin_meds', title: ['เบาหวาน /', 'ฉีดอินซูลิน /', 'ยาลดน้ำตาล'], onchange: 'handleAlteredMentalRiskItemChange(this)' },
            { name: 'alteredMentalRiskPrecipitants', value: 'chronic_kidney_missed_dialysis', title: ['ไตวายเรื้อรัง /', 'ขาดฟอกไต /', 'ปัสสาวะไม่ออก'], onchange: 'handleAlteredMentalRiskItemChange(this)' },
            { name: 'alteredMentalRiskPrecipitants', value: 'cirrhosis_jaundice_ascites', title: ['โรคตับแข็ง', 'ตาเหลือง / ท้องมาน'], onchange: 'handleAlteredMentalRiskItemChange(this)' },
            { name: 'alteredMentalRiskPrecipitants', value: 'new_meds_or_sedatives', title: ['เพิ่งเริ่มยาใหม่ /', 'ยานอนหลับ /', 'ยาแก้ปวดแรง'], onchange: 'handleAlteredMentalRiskItemChange(this)' },
            { name: 'alteredMentalRiskPrecipitants', value: 'alcohol_heavy_or_abrupt_stop', title: ['ดื่มสุราหนัก /', 'เพิ่งหยุดดื่ม', '1–4 วัน'], onchange: 'handleAlteredMentalRiskItemChange(this)' },
            { id: 'alteredMentalSuspectedToxinCb', name: 'alteredMentalRiskPrecipitants', value: 'suspected_overdose_toxin', title: ['สงสัยกินยาเกินขนาด', '/ สารพิษ / เคมี'], onchange: 'handleAlteredMentalToxinToggle(this)' },
            { name: 'alteredMentalRiskPrecipitants', value: 'baseline_psychiatric_history', title: ['ประวัติโรค', 'ทางจิตเวช'], onchange: 'handleAlteredMentalRiskItemChange(this)', colSpan2: true }
          ])}
          <div id="alteredMentalToxinDetailsWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-3 space-y-2">
            <label class="block text-xs font-semibold text-slate-700">ระบุชนิดของยา สารเคมี หรือสารพิษที่สงสัย (ถ้าทราบ)</label>
            <input type="text" id="alteredMentalToxinDetails" placeholder="เช่น ยานอนหลับ, ยาลดความดัน, พาราเซตามอล, ยาฆ่าหญ้า"
              class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400">
          </div>
        </div>
      </div>

      <!-- อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100">
          <div class="bg-slate-100 text-slate-600 p-2 rounded-xl"><i data-lucide="message-square-plus" class="w-5 h-5"></i></div>
          <h2 class="text-base font-bold text-slate-800">อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2>
        </div>
        <textarea id="alteredMentalAdditionalNotes" rows="2" placeholder="พิมพ์ระบุข้อสังเกตเพิ่มเติม เช่น พบซองยาข้างตัว, ได้กลิ่นสุรา/สารเคมี (ถ้ามี)..."
          class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"></textarea>
      </div>
    </div>
  `,

  // --- Lifecycle Hooks ---
  onMounted: function() {},
  onSelectForm: function() {},
  onActivate: function() {},
  onTitleChange: function() {},

  populateForm(patient) {
    if (!patient) return;
    this.resetForm();

    const setVal = (id, val) => {
      const el = getAmEl(id);
      if (el) el.value = val !== undefined && val !== null ? val : '';
    };
    const setRadio = (name, val) => {
      if (!val) return;
      const el = queryAmOne(`input[name="${name}"][value="${val}"]`);
      if (el) el.checked = true;
    };
    const setChecks = (name, arr) => {
      if (!Array.isArray(arr)) return;
      queryAmAll(`input[name="${name}"]`).forEach(cb => {
        cb.checked = arr.includes(cb.value);
      });
    };

    setVal('alteredMentalDurationVal', patient.durationVal || '');
    setVal('alteredMentalDurationUnit', patient.durationUnit || 'hours');
    setRadio('alteredMentalReporter', patient.alteredMentalReporter);
    setVal('alteredMentalReporterRelation', patient.alteredMentalReporterRelation || '');
    setVal('alteredMentalReporterPhone', patient.alteredMentalReporterPhone || '');

    setRadio('alteredMentalBaselineStatus', patient.alteredMentalBaselineStatus);
    handleAlteredMentalBaselineChange(patient.alteredMentalBaselineStatus);
    if (patient.alteredMentalBaselineStatus === 'bedridden_totally_dependent') {
      setRadio('alteredMentalBedriddenCommunication', patient.alteredMentalBedriddenCommunication);
      setRadio('alteredMentalBedriddenMobility', patient.alteredMentalBedriddenMobility);
      setRadio('alteredMentalBedriddenFeeding', patient.alteredMentalBedriddenFeeding);
      setRadio('alteredMentalBedriddenElimination', patient.alteredMentalBedriddenElimination);
    }

    setRadio('alteredMentalOnsetPattern', patient.alteredMentalOnsetPattern);
    setVal('alteredMentalLsnDate', safeAmFormatDate(patient.alteredMentalLsnDate || ''));
    setVal('alteredMentalLsnTime', safeAmFormatTime(patient.alteredMentalLsnTime || ''));
    const lsnUnknownEl = getAmEl('alteredMentalLsnUnknown');
    if (lsnUnknownEl) {
      lsnUnknownEl.checked = Boolean(patient.alteredMentalLsnUnknown);
      handleAlteredMentalLsnUnknownToggle(lsnUnknownEl);
    }

    setRadio('alteredMentalLevelOfConsciousness', patient.alteredMentalLevelOfConsciousness);

    const cogList = Array.isArray(patient.alteredMentalCognitiveBehaviors) ? patient.alteredMentalCognitiveBehaviors : [];
    setChecks('alteredMentalCognitiveBehaviors', cogList);
    if (patient.alteredMentalCogNone && cogList.length === 0) {
      const cogNone = getAmEl('alteredMental_cog_none');
      if (cogNone) cogNone.checked = true;
    }

    const neuroList = [...(patient.alteredMentalNeuroFlags || [])];
    if (neuroList.includes('anisocoria_or_fixed_pupil') && !neuroList.includes('gaze_deviation_or_fixed')) {
      neuroList.push('gaze_deviation_or_fixed');
    }
    if ((neuroList.includes('head_injury_recent_24h') || neuroList.includes('remote_trauma_weeks')) && !neuroList.includes('head_trauma_history')) {
      neuroList.push('head_trauma_history');
    }
    setChecks('alteredMentalNeuroFlags', neuroList);

    const hasTrauma = neuroList.includes('head_trauma_history');
    safeAmToggleBranch('alteredMentalHeadTraumaWrap', hasTrauma);
    if (hasTrauma) {
      const traumaTime = patient.alteredMentalHeadTraumaTime || patient.alteredMentalRemoteTraumaTime || (patient.alteredMentalNeuroFlags?.includes('head_injury_recent_24h') ? 'within_24h' : '');
      setRadio('alteredMentalHeadTraumaTime', traumaTime);
    }

    const hasWound = neuroList.includes('visible_head_wound');
    safeAmToggleBranch('alteredMentalHeadWoundDetailsWrap', hasWound);
    if (hasWound) setVal('alteredMentalHeadWoundLocation', patient.alteredMentalHeadWoundLocation || '');

    const sysList = Array.isArray(patient.alteredMentalSystemicFlags) ? patient.alteredMentalSystemicFlags : [];
    const sysPos = sysList.filter(k => k !== 'none_systemic_flags');
    setChecks('alteredMentalSystemicFlags', sysPos);
    if ((patient.alteredMentalSysNone || sysList.includes('none_systemic_flags')) && sysPos.length === 0) {
      const sysNone = getAmEl('alteredMental_sys_none');
      if (sysNone) sysNone.checked = true;
    }

    const abdpainCb = getAmEl('alteredMentalGiAbdpain');
    if (abdpainCb) abdpainCb.checked = Boolean(patient.alteredMentalGiAbdpain);
    setChecks('alteredMentalAbdpainLocs', patient.alteredMentalAbdpainLocs || []);
    setRadio('alteredMentalAbdpainChar', patient.alteredMentalAbdpainChar);

    const diarrheaCb = getAmEl('alteredMentalGiDiarrhea');
    if (diarrheaCb) diarrheaCb.checked = Boolean(patient.alteredMentalGiDiarrhea);
    setVal('alteredMentalDiarrheaFreq', patient.alteredMentalDiarrheaFreq || '');
    setChecks('alteredMentalDiarrheaStools', patient.alteredMentalDiarrheaStools || []);

    const vomitCb = getAmEl('alteredMentalGiVomit');
    if (vomitCb) vomitCb.checked = Boolean(patient.alteredMentalGiVomit);
    setVal('alteredMentalVomitFreq', patient.alteredMentalVomitFreq || '');
    setChecks('alteredMentalVomitContents', patient.alteredMentalVomitContents || []);
    handleAlteredMentalGiToggle();

    if (patient.alteredMentalGiNone && !patient.alteredMentalGiAbdpain && !patient.alteredMentalGiDiarrhea && !patient.alteredMentalGiVomit) {
      const giNone = getAmEl('alteredMental_gi_none');
      if (giNone) giNone.checked = true;
    }

    const riskList = Array.isArray(patient.alteredMentalRiskPrecipitants) ? patient.alteredMentalRiskPrecipitants : [];
    setChecks('alteredMentalRiskPrecipitants', riskList);
    const hasToxin = riskList.includes('suspected_overdose_toxin');
    safeAmToggleBranch('alteredMentalToxinDetailsWrap', hasToxin);
    if (hasToxin) setVal('alteredMentalToxinDetails', patient.alteredMentalToxinDetails || '');

    setVal('alteredMentalAdditionalNotes', patient.alteredMentalAdditionalNotes || patient.otherSymptomsFree || '');
  },

  hydrateForm(patient) {
    this.populateForm(patient);
  },

  resetForm() {
    this.inputIdsToClear.forEach(id => {
      const el = getAmEl(id);
      if (el) el.value = '';
    });
    const durUnit = getAmEl('alteredMentalDurationUnit');
    if (durUnit) durUnit.value = 'hours';

    const lsnDate = getAmEl('alteredMentalLsnDate');
    const lsnTime = getAmEl('alteredMentalLsnTime');
    if (lsnDate) { lsnDate.value = ''; lsnDate.disabled = false; }
    if (lsnTime) { lsnTime.value = ''; lsnTime.disabled = false; }

    [
      'alteredMentalReporter', 'alteredMentalBaselineStatus',
      'alteredMentalBedriddenCommunication', 'alteredMentalBedriddenMobility',
      'alteredMentalBedriddenFeeding', 'alteredMentalBedriddenElimination',
      'alteredMentalOnsetPattern', 'alteredMentalLevelOfConsciousness',
      'alteredMentalHeadTraumaTime', 'alteredMentalAbdpainChar'
    ].forEach(n => queryAmAll(`input[name="${n}"]`).forEach(r => { r.checked = false; }));

    [
      'alteredMentalCognitiveBehaviors', 'alteredMentalNeuroFlags',
      'alteredMentalSystemicFlags', 'alteredMentalAbdpainLocs',
      'alteredMentalDiarrheaStools', 'alteredMentalVomitContents',
      'alteredMentalRiskPrecipitants'
    ].forEach(n => queryAmAll(`input[name="${n}"]`).forEach(cb => { cb.checked = false; }));

    [
      'alteredMentalLsnUnknown', 'alteredMental_cog_none',
      'alteredMental_sys_none', 'alteredMental_gi_none',
      'alteredMentalGiAbdpain', 'alteredMentalGiDiarrhea', 'alteredMentalGiVomit'
    ].forEach(id => {
      const el = getAmEl(id);
      if (el) el.checked = false;
    });

    this.branchIds.forEach(id => {
      const el = getAmEl(id);
      if (el) el.classList.add('hidden');
    });
  },

  collectIntake(ctx) {
    ctx = ctx || {};
    const _rawDur = parseFloat(getAmEl('alteredMentalDurationVal')?.value);
    const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
    const durationUnit = getAmEl('alteredMentalDurationUnit')?.value || 'hours';

    const getRadio = (name) => queryAmOne(`input[name="${name}"]:checked`)?.value || '';
    const getChecks = (name) => queryAmAll(`input[name="${name}"]:checked`).map(cb => cb.value);

    const alteredMentalReporter = getRadio('alteredMentalReporter');
    const alteredMentalReporterRelation = getAmEl('alteredMentalReporterRelation')?.value?.trim() || '';
    const alteredMentalReporterPhone = getAmEl('alteredMentalReporterPhone')?.value?.trim() || '';

    const alteredMentalBaselineStatus = getRadio('alteredMentalBaselineStatus');
    let alteredMentalBedriddenCommunication = null;
    let alteredMentalBedriddenMobility = null;
    let alteredMentalBedriddenFeeding = null;
    let alteredMentalBedriddenElimination = null;
    if (alteredMentalBaselineStatus === 'bedridden_totally_dependent') {
      alteredMentalBedriddenCommunication = getRadio('alteredMentalBedriddenCommunication') || null;
      alteredMentalBedriddenMobility = getRadio('alteredMentalBedriddenMobility') || null;
      alteredMentalBedriddenFeeding = getRadio('alteredMentalBedriddenFeeding') || null;
      alteredMentalBedriddenElimination = getRadio('alteredMentalBedriddenElimination') || null;
    }

    const alteredMentalOnsetPattern = getRadio('alteredMentalOnsetPattern');
    const alteredMentalLsnUnknown = Boolean(getAmEl('alteredMentalLsnUnknown')?.checked);
    const alteredMentalLsnDate = alteredMentalLsnUnknown ? '' : (getAmEl('alteredMentalLsnDate')?.value?.trim() || '');
    const alteredMentalLsnTime = alteredMentalLsnUnknown ? '' : (getAmEl('alteredMentalLsnTime')?.value?.trim() || '');

    const alteredMentalLevelOfConsciousness = getRadio('alteredMentalLevelOfConsciousness');
    const alteredMentalCognitiveBehaviors = getChecks('alteredMentalCognitiveBehaviors');
    const alteredMentalCogNone = Boolean(getAmEl('alteredMental_cog_none')?.checked) && alteredMentalCognitiveBehaviors.length === 0;

    const alteredMentalNeuroFlags = getChecks('alteredMentalNeuroFlags');
    const hasHeadTrauma = alteredMentalNeuroFlags.includes('head_trauma_history') || alteredMentalNeuroFlags.includes('remote_trauma_weeks') || alteredMentalNeuroFlags.includes('head_injury_recent_24h');
    const alteredMentalHeadTraumaTime = hasHeadTrauma ? (getRadio('alteredMentalHeadTraumaTime') || null) : null;
    const alteredMentalRemoteTraumaTime = alteredMentalHeadTraumaTime;
    const alteredMentalHeadWoundLocation = alteredMentalNeuroFlags.includes('visible_head_wound') ? (getAmEl('alteredMentalHeadWoundLocation')?.value?.trim() || '') : '';

    const alteredMentalSystemicFlags = getChecks('alteredMentalSystemicFlags');
    const alteredMentalSysNone = Boolean(getAmEl('alteredMental_sys_none')?.checked) && alteredMentalSystemicFlags.length === 0;

    const alteredMentalGiAbdpain = Boolean(getAmEl('alteredMentalGiAbdpain')?.checked);
    const alteredMentalAbdpainLocs = alteredMentalGiAbdpain ? getChecks('alteredMentalAbdpainLocs') : [];
    const alteredMentalAbdpainChar = alteredMentalGiAbdpain ? getRadio('alteredMentalAbdpainChar') : '';

    const alteredMentalGiDiarrhea = Boolean(getAmEl('alteredMentalGiDiarrhea')?.checked);
    const alteredMentalDiarrheaFreq = alteredMentalGiDiarrhea ? (parseInt(getAmEl('alteredMentalDiarrheaFreq')?.value, 10) || 0) : 0;
    const alteredMentalDiarrheaStools = alteredMentalGiDiarrhea ? getChecks('alteredMentalDiarrheaStools') : [];

    const alteredMentalGiVomit = Boolean(getAmEl('alteredMentalGiVomit')?.checked);
    const alteredMentalVomitFreq = alteredMentalGiVomit ? (parseInt(getAmEl('alteredMentalVomitFreq')?.value, 10) || 0) : 0;
    const alteredMentalVomitContents = alteredMentalGiVomit ? getChecks('alteredMentalVomitContents') : [];

    const alteredMentalGiNone = Boolean(getAmEl('alteredMental_gi_none')?.checked) && !alteredMentalGiAbdpain && !alteredMentalGiDiarrhea && !alteredMentalGiVomit;

    const alteredMentalRiskPrecipitants = getChecks('alteredMentalRiskPrecipitants');
    const alteredMentalToxinDetails = alteredMentalRiskPrecipitants.includes('suspected_overdose_toxin') ? (getAmEl('alteredMentalToxinDetails')?.value?.trim() || '') : '';

    const alteredMentalAdditionalNotes = getAmEl('alteredMentalAdditionalNotes')?.value?.trim() || '';
    const hospRecordStatus = ctx.hospRecordStatus || 'unspecified';

    const rec = {
      id: ctx.recordId || ctx.id || `case-${Date.now()}`,
      queue_number: ctx.queueNumber || ctx.queue_number || 'ER-NEW',
      hn: ctx.randomHn || ctx.hn || '-',
      name: ctx.patientName || ctx.name || 'ไม่ระบุชื่อ',
      age: ctx.patientAge !== undefined ? ctx.patientAge : (ctx.age !== undefined ? ctx.age : 'ไม่ได้ระบุ'),
      gender: ctx.gender || 'ไม่ระบุ',
      chief_complaint: 'altered_mental',
      chief_complaint_title: 'ซึมลง / สับสนเฉียบพลัน / ระดับความรู้สึกตัวเปลี่ยนแปลง',
      status: ctx.recordStatus || ctx.status || 'waiting',
      timestamp: new Date().toISOString(),
      durationVal,
      durationUnit,
      hospRecordStatus,
      underlying: Array.isArray(ctx.underlying) ? ctx.underlying : [],
      drugAllergy: ctx.drugAllergy || 'ไม่ได้ระบุ',
      currentMeds: ctx.currentMeds || 'ไม่ได้ระบุ',
      otherSymptomsFree: ctx.otherSymptomsFree || alteredMentalAdditionalNotes || '',
      doctor_notes: ctx.preservedDoctorNotes || ctx.doctor_notes || { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },

      alteredMentalReporter,
      alteredMentalReporterRelation,
      alteredMentalReporterPhone,
      alteredMentalBaselineStatus,
      alteredMentalBedriddenCommunication,
      alteredMentalBedriddenMobility,
      alteredMentalBedriddenFeeding,
      alteredMentalBedriddenElimination,
      alteredMentalOnsetPattern,
      alteredMentalLsnUnknown,
      alteredMentalLsnDate,
      alteredMentalLsnTime,
      alteredMentalLevelOfConsciousness,
      alteredMentalCognitiveBehaviors,
      alteredMentalCogNone,
      alteredMentalNeuroFlags,
      alteredMentalHeadTraumaTime,
      alteredMentalRemoteTraumaTime,
      alteredMentalHeadWoundLocation,
      alteredMentalSystemicFlags,
      alteredMentalSysNone,
      alteredMentalGiAbdpain,
      alteredMentalAbdpainLocs,
      alteredMentalAbdpainChar,
      alteredMentalGiDiarrhea,
      alteredMentalDiarrheaFreq,
      alteredMentalDiarrheaStools,
      alteredMentalGiVomit,
      alteredMentalVomitFreq,
      alteredMentalVomitContents,
      alteredMentalGiNone,
      alteredMentalRiskPrecipitants,
      alteredMentalToxinDetails,
      alteredMentalAdditionalNotes
    };

    updateAlteredMentalOutputs(rec);
    return rec;
  },

  isRedFlag(p) {
    return detectAlteredMentalRedFlags(p).length > 0;
  },
  evaluateRedFlags: detectAlteredMentalRedFlags,
  updateOutputs: updateAlteredMentalOutputs,

  seedPatients: [
    {
      id: 'case-101',
      queue_number: 'A-101',
      hn: '6710281',
      name: 'นางสมทรง อุ่นจิตต์',
      age: 74,
      gender: 'หญิง',
      chief_complaint: 'altered_mental',
      chief_complaint_title: 'ซึมลง / สับสนเฉียบพลัน / ระดับความรู้สึกตัวเปลี่ยนแปลง',
      status: 'waiting',
      hospRecordStatus: 'complete',
      timestamp: '2026-10-26T02:11:26.425Z',
      durationVal: 2,
      durationUnit: 'hours',
      alteredMentalReporter: 'caregiver_family',
      alteredMentalReporterRelation: 'บุตรสาว',
      alteredMentalReporterPhone: '089-765-4321',
      alteredMentalBaselineStatus: 'normal_independent',
      alteredMentalOnsetPattern: 'acute_hours',
      alteredMentalLsnDate: '22/10/2026',
      alteredMentalLsnTime: '06:30',
      alteredMentalLsnUnknown: false,
      alteredMentalLevelOfConsciousness: 'stupor_pain_only',
      alteredMentalCognitiveBehaviors: ['inattention_unfocused', 'speech_slurred_or_incoherent', 'poor_intake_refusal'],
      alteredMentalNeuroFlags: ['none_neuro_flags'],
      alteredMentalHeadWoundLocation: '',
      alteredMentalSystemicFlags: ['cyanosis_cold_clammy'],
      alteredMentalGiAbdpain: false,
      alteredMentalGiDiarrhea: false,
      alteredMentalGiVomit: false,
      alteredMentalGiNone: true,
      alteredMentalRiskPrecipitants: ['diabetic_insulin_meds'],
      alteredMentalToxinDetails: '',
      alteredMentalAdditionalNotes: 'เช้านี้ฉีดอินซูลินแต่ทานข้าวได้เพียง 2-3 คำ จากนั้นนอนปลุกไม่ตื่น เหงื่อแตกท่วมตัว',
      otherSymptomsFree: 'เช้านี้ฉีดอินซูลินแต่ทานข้าวได้เพียง 2-3 คำ จากนั้นนอนปลุกไม่ตื่น เหงื่อแตกท่วมตัว',
      underlying: ['เบาหวานชนิดที่ 2 (DM type 2 ฉีดอินซูลิน)', 'ความดันโลหิตสูง (HT)'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Mixtard 30/70 (14-0-8 units SC), Metformin (500) 1x2 pc, Amlodipine (5) 1x1 pc',
      vital_signs: { bt: 36.2, sbp: 138, dbp: 82, bp: '138/82', pr: 108, rr: 20, spo2: 98 },
      doctor_notes: {
        additional_hpi: 'หญิงอายุ 74 ปี เป็นเบาหวานฉีดอินซูลิน เช้านี้ฉีดอินซูลิน 14 ยูนิตตามปกติแต่รับประทานข้าวต้มได้เพียง 2-3 คำเนื่องจากเบื่ออาหาร 2 ชั่วโมงต่อมาบุตรสาวเข้าไปปลุกพบว่านอนหลับลึก เหงื่อแตกท่วมตัว',
        physical_exam: 'BT 36.2 C, PR 108/min, RR 20/min, BP 138/82 mmHg, SpO2 98%. E2V2M4, Bedside DTX 26 mg/dL.',
        preliminary_dx: 'Severe Hypoglycemia (DTX 26 mg/dL)',
        plan: 'STAT 50% Glucose 50 mL IV push, then D10W drip, serial DTX q 15-30 min.'
      }
    },
    {
      id: 'case-102',
      queue_number: 'A-102',
      hn: '6710395',
      name: 'นายประวิทย์ ชัยชนะกิจ',
      age: 81,
      gender: 'ชาย',
      chief_complaint: 'altered_mental',
      chief_complaint_title: 'ซึมลง / สับสนเฉียบพลัน / ระดับความรู้สึกตัวเปลี่ยนแปลง',
      status: 'waiting',
      hospRecordStatus: 'complete',
      timestamp: '2026-10-26T01:56:26.425Z',
      durationVal: 1,
      durationUnit: 'days',
      alteredMentalReporter: 'caregiver_family',
      alteredMentalReporterRelation: 'ผู้ดูแลประจำ',
      alteredMentalReporterPhone: '081-234-5678',
      alteredMentalBaselineStatus: 'bedridden_totally_dependent',
      alteredMentalBedriddenCommunication: 'talk_normal',
      alteredMentalBedriddenMobility: 'turn_sit',
      alteredMentalBedriddenFeeding: 'ng_tube',
      alteredMentalBedriddenElimination: 'foley_catheter',
      alteredMentalOnsetPattern: 'acute_hours',
      alteredMentalLsnDate: '21/10/2026',
      alteredMentalLsnTime: '18:00',
      alteredMentalLsnUnknown: false,
      alteredMentalLevelOfConsciousness: 'awake_but_confused',
      alteredMentalCognitiveBehaviors: ['inattention_unfocused', 'disoriented_time_place', 'agitated_restless', 'hallucinations_paranoid', 'speech_slurred_or_incoherent'],
      alteredMentalNeuroFlags: ['none_neuro_flags'],
      alteredMentalHeadWoundLocation: '',
      alteredMentalSystemicFlags: ['high_fever_or_hypothermia', 'tachypnea_labored_breathing', 'foul_cloudy_urine'],
      alteredMentalGiAbdpain: true,
      alteredMentalAbdpainLocs: ['suprapubic'],
      alteredMentalAbdpainChar: 'colicky_spasm',
      alteredMentalGiDiarrhea: false,
      alteredMentalGiVomit: false,
      alteredMentalRiskPrecipitants: ['chronic_kidney_missed_dialysis'],
      alteredMentalToxinDetails: '',
      alteredMentalAdditionalNotes: 'ปัสสาวะในถุงสีขุ่นมีกลิ่นฉุนรุนแรง เอะอะโวยวายพยายามดึงสายยางให้อาหารและสายสวนปัสสาวะ',
      otherSymptomsFree: 'ปัสสาวะในถุงสีขุ่นมีกลิ่นฉุนรุนแรง เอะอะโวยวายพยายามดึงสายยางให้อาหารและสายสวนปัสสาวะ',
      underlying: ['ผู้ป่วยติดเตียงหลังกระดูกสะโพกหัก', 'ต่อมลูกหมากโต คาสายสวนปัสสาวะ', 'โรคไตเรื้อรังระยะ 3'],
      drugAllergy: 'แพ้ยา Penicillin (ผื่นคัน แน่นหน้าอก)',
      currentMeds: 'Omeprazole (20) 1x1 ac, Calcium carbonate 1x3 pc',
      vital_signs: { bt: 38.9, sbp: 92, dbp: 58, bp: '92/58', pr: 122, rr: 26, spo2: 96 },
      doctor_notes: {
        additional_hpi: 'ชายอายุ 81 ปี ผู้ป่วยติดเตียงคาสายสวนปัสสาวะ มีไข้สูง ปัสสาวะขุ่นกลิ่นเหม็น เอะอะโวยวายสับสน 1 วัน',
        physical_exam: 'BT 38.9 C, PR 122/min, RR 26/min, BP 92/58 mmHg, SpO2 96%. Turbid urine in Foley bag.',
        preliminary_dx: 'Hyperactive Delirium secondary to Urosepsis / CAUTI',
        plan: 'Sepsis 1-hr bundle, IV NSS 30 mL/kg, Hemoculture x 2, Urine C/S, STAT IV Antibiotics, change Foley.'
      }
    },
    {
      id: 'case-103',
      queue_number: 'A-103',
      hn: '6710442',
      name: 'นายวิชาญ ธนะสมบัติ',
      age: 68,
      gender: 'ชาย',
      chief_complaint: 'altered_mental',
      chief_complaint_title: 'ซึมลง / สับสนเฉียบพลัน / ระดับความรู้สึกตัวเปลี่ยนแปลง',
      status: 'waiting',
      hospRecordStatus: 'complete',
      timestamp: '2026-10-26T01:41:26.425Z',
      durationVal: 3,
      durationUnit: 'days',
      alteredMentalReporter: 'relative_occasional',
      alteredMentalReporterRelation: 'ลูกชาย',
      alteredMentalReporterPhone: '086-555-8899',
      alteredMentalBaselineStatus: 'normal_independent',
      alteredMentalOnsetPattern: 'subacute_days',
      alteredMentalLsnDate: '19/10/2026',
      alteredMentalLsnTime: '08:00',
      alteredMentalLsnUnknown: false,
      alteredMentalLevelOfConsciousness: 'drowsy_lethargic',
      alteredMentalCognitiveBehaviors: ['inattention_unfocused', 'speech_slurred_or_incoherent', 'apathy_mute'],
      alteredMentalNeuroFlags: ['focal_weakness_numbness', 'gaze_deviation_or_fixed', 'head_trauma_history', 'visible_head_wound'],
      alteredMentalHeadTraumaTime: 'remote_2_4w',
      alteredMentalRemoteTraumaTime: 'remote_2_4w',
      alteredMentalHeadWoundLocation: 'ขมับซ้าย มีรอยฟกช้ำจางๆ และบวมเล็กน้อย',
      alteredMentalSystemicFlags: [],
      alteredMentalSysNone: true,
      alteredMentalGiAbdpain: false,
      alteredMentalGiDiarrhea: false,
      alteredMentalGiVomit: false,
      alteredMentalGiNone: true,
      alteredMentalRiskPrecipitants: ['alcohol_heavy_or_abrupt_stop'],
      alteredMentalToxinDetails: '',
      alteredMentalAdditionalNotes: 'เดินเซ ขาลากข้างขวา ซึมลงเรื่อยๆ เคยหกล้มหัวฟาดพื้นเมื่อเกือบเดือนก่อน',
      otherSymptomsFree: 'เดินเซ ขาลากข้างขวา ซึมลงเรื่อยๆ เคยหกล้มหัวฟาดพื้นเมื่อเกือบเดือนก่อน',
      underlying: ['ความดันโลหิตสูง (HT)', 'ดื่มสุราขาวเป็นประจำ'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Amlodipine (5) 1x1 pc',
      vital_signs: { bt: 36.8, sbp: 164, dbp: 92, bp: '164/92', pr: 68, rr: 16, spo2: 99 },
      doctor_notes: {
        additional_hpi: 'ชายอายุ 68 ปี ประวัติสะดุดล้มศีรษะกระแทกเมื่อ 3–4 สัปดาห์ก่อน เริ่มเดินเซ ซึมลง และแขนขาขวาอ่อนแรง 3 วัน',
        physical_exam: 'BP 164/92 mmHg, PR 68/min. E3V4M5, Left pupil 4 mm sluggish, Right 2 mm prompt, Right hemiparesis 3/5.',
        preliminary_dx: 'Subacute / Chronic Subdural Hematoma (Left frontoparietal SDH)',
        plan: 'STAT Non-contrast CT Brain, elevate HOB 30 deg, STAT Neurosurgery consult.'
      }
    },
    {
      id: 'case-104',
      queue_number: 'A-104',
      hn: '6710520',
      name: 'นายบุญเลิศ วรทัศน์',
      age: 54,
      gender: 'ชาย',
      chief_complaint: 'altered_mental',
      chief_complaint_title: 'ซึมลง / สับสนเฉียบพลัน / ระดับความรู้สึกตัวเปลี่ยนแปลง',
      status: 'waiting',
      hospRecordStatus: 'complete',
      timestamp: '2026-10-26T01:26:26.425Z',
      durationVal: 2,
      durationUnit: 'days',
      alteredMentalReporter: 'caregiver_family',
      alteredMentalReporterRelation: 'ภรรยา',
      alteredMentalReporterPhone: '082-999-1122',
      alteredMentalBaselineStatus: 'normal_independent',
      alteredMentalOnsetPattern: 'subacute_days',
      alteredMentalLsnDate: '20/10/2026',
      alteredMentalLsnTime: '12:00',
      alteredMentalLsnUnknown: false,
      alteredMentalLevelOfConsciousness: 'drowsy_lethargic',
      alteredMentalCognitiveBehaviors: ['inattention_unfocused', 'disoriented_time_place', 'speech_slurred_or_incoherent', 'apathy_mute'],
      alteredMentalNeuroFlags: ['none_neuro_flags'],
      alteredMentalHeadWoundLocation: '',
      alteredMentalSystemicFlags: [],
      alteredMentalSysNone: true,
      alteredMentalGiAbdpain: true,
      alteredMentalAbdpainLocs: ['epigastrium', 'diffuse'],
      alteredMentalAbdpainChar: 'dull_aching',
      alteredMentalGiDiarrhea: false,
      alteredMentalGiVomit: true,
      alteredMentalVomitFreq: 2,
      alteredMentalVomitContents: ['coffee_ground_blood'],
      alteredMentalRiskPrecipitants: ['cirrhosis_jaundice_ascites', 'alcohol_heavy_or_abrupt_stop'],
      alteredMentalToxinDetails: '',
      alteredMentalAdditionalNotes: 'ท้องอืดแน่น ท้องผูกไม่ถ่าย 3 วัน อาเจียนเป็นสีกาแฟดำ ซึมลงมาก มือสั่นพะงาบๆ',
      otherSymptomsFree: 'ท้องอืดแน่น ท้องผูกไม่ถ่าย 3 วัน อาเจียนเป็นสีกาแฟดำ ซึมลงมาก มือสั่นพะงาบๆ',
      underlying: ['โรคตับแข็งจากแอลกอฮอล์', 'ประวัติเส้นเลือดขอดในหลอดอาหาร'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Propranolol (10) 1x2 pc, Spironolactone (25) 1x1 pc, Furosemide (40) 1/2x1 pc',
      vital_signs: { bt: 37.0, sbp: 106, dbp: 66, bp: '106/66', pr: 96, rr: 18, spo2: 98 },
      doctor_notes: {
        additional_hpi: 'ชายอายุ 54 ปี ตับแข็ง ท้องมาน ตาเหลือง ท้องผูก 3 วัน อาเจียนสีกาแฟ 2 ครั้ง เริ่มซึมสับสนและมือสั่นพะงาบ',
        physical_exam: 'BP 106/66 mmHg, PR 96/min. Jaundice, ascites with shifting dullness, asterixis positive.',
        preliminary_dx: 'Hepatic Encephalopathy secondary to UGIB & Constipation',
        plan: 'NPO, IV Pantoprazole, IV Terlipressin, Lactulose, STAT CBC/LFT/Ammonia, GI consult.'
      }
    }
  ]
};

// --- Register Module to Core Knowledge Base ---
if (typeof registerCcModule === 'function') {
  registerCcModule(alteredMentalModule);
} else if (typeof window !== 'undefined' && typeof window.registerCcModule === 'function') {
  window.registerCcModule(alteredMentalModule);
}

if (typeof window !== 'undefined') {
  window.handleAlteredMentalBaselineChange = handleAlteredMentalBaselineChange;
  window.handleAlteredMentalLsnUnknownToggle = handleAlteredMentalLsnUnknownToggle;
  window.handleAlteredMentalCogItemChange = handleAlteredMentalCogItemChange;
  window.handleAlteredMentalCogNoneToggle = handleAlteredMentalCogNoneToggle;
  window.handleAlteredMentalNeuroItemChange = handleAlteredMentalNeuroItemChange;
  window.handleAlteredMentalHeadTraumaToggle = handleAlteredMentalHeadTraumaToggle;
  window.handleAlteredMentalRemoteTraumaToggle = handleAlteredMentalRemoteTraumaToggle;
  window.handleAlteredMentalHeadWoundToggle = handleAlteredMentalHeadWoundToggle;
  window.handleAlteredMentalNeuroNoneToggle = handleAlteredMentalNeuroNoneToggle;
  window.handleAlteredMentalSysItemChange = handleAlteredMentalSysItemChange;
  window.handleAlteredMentalSysNoneToggle = handleAlteredMentalSysNoneToggle;
  window.handleAlteredMentalGiToggle = handleAlteredMentalGiToggle;
  window.handleAlteredMentalGiNoneToggle = handleAlteredMentalGiNoneToggle;
  window.handleAlteredMentalRiskItemChange = handleAlteredMentalRiskItemChange;
  window.handleAlteredMentalToxinToggle = handleAlteredMentalToxinToggle;
  window.handleAlteredMentalRiskNoneToggle = handleAlteredMentalRiskNoneToggle;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = alteredMentalModule;
}
