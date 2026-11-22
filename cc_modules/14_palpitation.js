// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 14_palpitation.js
// อาการนำ: ใจสั่น (Palpitations & Suspected Cardiac Arrhythmias)
// ปรับปรุงตามมาตรฐาน plan_palpitation.md, plan-cc และ code-cc (กลุ่ม B2)
// =========================================================================

// --- Internal DOM & UI Helpers ---
function getPalEl(id) {
  return typeof document !== 'undefined' ? document.getElementById(id) : null;
}

function queryPalOne(selector) {
  return typeof document !== 'undefined' ? document.querySelector(selector) : null;
}

function queryPalAll(selector) {
  return typeof document !== 'undefined' ? Array.from(document.querySelectorAll(selector)) : [];
}

function wrapPalWords(chunks) {
  if (!Array.isArray(chunks)) return chunks;
  return chunks.map(c => `<span class="inline-block whitespace-nowrap">${c}</span>`).join(' ');
}

function renderPalOption(cfg) {
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
  const titleHtml = Array.isArray(title) ? wrapPalWords(title) : title;
  const bodyHtml = desc
    ? `<div class="ml-3 leading-snug"><span class="block text-xs sm:text-sm font-semibold text-slate-800">${titleHtml}</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">${desc}</span></div>`
    : `<span class="ml-3 ${compact ? 'text-xs' : 'text-xs sm:text-sm'} font-semibold text-slate-800 leading-snug">${titleHtml}</span>`;
  return `<label class="selectable-card bg-white flex ${alignCls} ${padCls} rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition${spanCls}"><input type="${kind}" ${idAttr}${nameAttr}${valAttr}${chgAttr}class="${topCls}${roundCls}text-medical-600 focus:ring-medical-500 ${szCls} flex-shrink-0">${bodyHtml}</label>`;
}

function renderPalGrid(colsCls, items, shared = {}) {
  return `<div class="grid ${colsCls} gap-2.5">${items.map(it => renderPalOption({ ...shared, ...it })).join('\n')}</div>`;
}

function renderPalSysHeader({
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

function clearPalBranchValues(wrapEl) {
  if (!wrapEl) return;
  wrapEl.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(inp => {
    inp.checked = false;
  });
  wrapEl.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach(inp => {
    inp.value = '';
  });
}

function uncheckPalNone(noneId, noneVal) {
  const noneEl = noneId ? getPalEl(noneId) : null;
  if (noneEl && noneEl.checked) noneEl.checked = false;
  if (noneVal) {
    queryPalAll(`input[value="${noneVal}"]`).forEach(el => { el.checked = false; });
  }
}

// --- Progressive Disclosure & Mutual Exclusion Handlers ---
function handlePalpitationWarningNoneToggle(el) {
  if (el && el.checked) {
    queryPalAll('input[name="palpitationWarningSigns"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handlePalpitationWarningItemChange(el) {
  if (el && el.checked) uncheckPalNone('palpitationWarningNoneCb', 'none_warning');
}

function handlePalpitationSubstancesNoneToggle(el) {
  if (el && el.checked) {
    queryPalAll('input[name="palpitationSubstances"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handlePalpitationSubstancesItemChange(el) {
  if (el && el.checked) uncheckPalNone('palpitationSubNoneCb', 'none_substances');
}

function handlePalpitationMedsNoneToggle(el) {
  if (el && el.checked) {
    queryPalAll('input[name="palpitationMeds"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handlePalpitationMedsItemChange(el) {
  if (el && el.checked) uncheckPalNone('palpitationMedsNoneCb', 'none_meds');
}

function handlePalpitationCustomTriggerChange(val) {
  const wrap = getPalEl('palpitationCustomTriggerWrap');
  if (!wrap) return;
  if (val === 'has_custom_trigger') {
    wrap.classList.remove('hidden');
  } else {
    wrap.classList.add('hidden');
    const inp = getPalEl('palpitationCustomTriggerText');
    if (inp) inp.value = '';
  }
}

function handlePalpitationHeartToggle(el) {
  const isChecked = el ? el.checked : (getPalEl('palpitationHeartCb')?.checked || false);
  const wrap = getPalEl('palpitationHeartSubWrap');
  if (isChecked) uncheckPalNone('palpitationImportantNoneCb', 'none_important_pmh');
  if (!wrap) return;
  if (isChecked) {
    wrap.classList.remove('hidden');
  } else {
    wrap.classList.add('hidden');
    clearPalBranchValues(wrap);
  }
}

function handlePalpitationImportantItemChange(el) {
  if (el && el.checked) uncheckPalNone('palpitationImportantNoneCb', 'none_important_pmh');
}

function handlePalpitationImportantNoneToggle(el) {
  if (el && el.checked) {
    queryPalAll('input[name="palpitationImportantConditions"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
    const wrap = getPalEl('palpitationHeartSubWrap');
    if (wrap) {
      wrap.classList.add('hidden');
      clearPalBranchValues(wrap);
    }
  }
}

// --- Red Flag Evaluator (6 Criteria Preserved) ---
function evaluatePalpitationRedFlags(patient) {
  const flags = [];
  if (!patient) return flags;

  const warningSigns = Array.isArray(patient.palpitationWarningSigns) ? patient.palpitationWarningSigns : [];
  const hasSyncope = warningSigns.includes('syncope');
  const hasChestPain = warningSigns.includes('ischemic_chest_pain');
  const hasHeartFailure = warningSigns.includes('acute_heart_failure');
  const hasPresyncope = warningSigns.includes('presyncope_dizziness');
  const hasColdDiaphoresis = warningSigns.includes('cold_diaphoresis');
  const hasAlteredMental = warningSigns.includes('altered_mental');

  const rhythm = patient.palpitationRhythmPattern || '';

  const cardiacHistory = Array.isArray(patient.palpitationCardiacHistory) ? patient.palpitationCardiacHistory : [];
  const hasCadStent = cardiacHistory.includes('cad_stent');
  const hasPriorHf = cardiacHistory.includes('heart_failure');
  const hasPpmIcd = cardiacHistory.includes('pacemaker_icd');

  const nonCardiac = Array.isArray(patient.palpitationNonCardiacHistory) ? patient.palpitationNonCardiacHistory : [];
  const importantConditions = Array.isArray(patient.palpitationImportantConditions)
    ? patient.palpitationImportantConditions
    : nonCardiac;
  const hasHyperthyroid = importantConditions.includes('hyperthyroidism') || nonCardiac.includes('hyperthyroidism');
  const hasHtn = nonCardiac.includes('hypertension') || (Array.isArray(patient.underlying) && patient.underlying.some(u => /ความดัน|htn|hypertension/i.test(u)));
  const hasDm = importantConditions.includes('diabetes') || nonCardiac.includes('diabetes') || (Array.isArray(patient.underlying) && patient.underlying.some(u => /เบาหวาน|dm|diabetes/i.test(u)));

  const familySuddenDeath = patient.palpitationFamilyHistory === 'sudden_death_under50';

  const substances = Array.isArray(patient.palpitationSubstances) ? patient.palpitationSubstances : [];
  const hasIllicit = substances.includes('illicit_stimulants');
  const hasEnergyDrinks = substances.includes('energy_drinks');

  // 1. Unstable Hemodynamics & Shock
  if (hasSyncope || hasChestPain || hasHeartFailure || (hasPresyncope && hasColdDiaphoresis)) {
    flags.push({
      key: 'palpitation_rf_unstable_hemodynamics',
      textTh: 'หัวใจเต้นผิดจังหวะร่วมกับระบบไหลเวียนโลหิตไม่คงที่ (Unstable Arrhythmia / Shock Risk)',
      risk: 'มีอาการใจสั่นร่วมกับหมดสติ เจ็บแน่นหน้าอกรุนแรง หายใจหอบเหนื่อยรุนแรง หรือมือเท้าเย็นเหงื่อแตกท่วมตัว',
      triageLevel: 1,
      severity: 'CRITICAL',
      suggestedAction: 'Triage Level 1: ย้ายเข้าห้อง Resuscitation ทันที, ติด Monitor + EKG 12 ลีด ด่วนภายใน 10 นาที, เตรียม Synchronized Cardioversion/External Pacing, เปิด IV'
    });
  }

  // 2. High Risk for Malignant Ventricular Arrhythmias
  if ((hasCadStent || hasPriorHf || hasPpmIcd) && (rhythm === 'rapid_regular' || hasSyncope)) {
    flags.push({
      key: 'palpitation_rf_malignant_ventricular',
      textTh: 'สงสัยภาวะหัวใจเต้นผิดจังหวะรุนแรงชนิดห้องล่าง (Suspected Ventricular Tachycardia in Structural Heart Disease)',
      risk: 'ผู้ป่วยมีโรคกล้ามเนื้อหัวใจขาดเลือดเดิม ใส่ขดลวด หรือหัวใจล้มเหลว ร่วมกับใจสั่นเต้นเร็วรัวทันทีหรือหมดสติ เสี่ยงต่อภาวะหัวใจหยุดเต้นกะทันหัน',
      triageLevel: 1,
      severity: 'CRITICAL',
      suggestedAction: 'Stat EKG 12 leads ทันที, Stat Electrolytes (K+, Mg2+), Troponin-T, เตรียม IV Amiodarone หรือ Lidocaine และเตรียมเตียง CCU'
    });
  }

  // 3. Family History of Sudden Death / Channelopathy
  if (familySuddenDeath && (hasSyncope || rhythm === 'rapid_regular')) {
    flags.push({
      key: 'palpitation_rf_channelopathy_scd',
      textTh: 'เสี่ยงต่อกลุ่มโรคหัวใจเต้นผิดจังหวะทางพันธุกรรม/ใหลตาย (Risk of Inherited Arrhythmia / Brugada / Long QT)',
      risk: 'มีประวัติคนในครอบครัวเสียชีวิตกะทันหันในวัยหนุ่มสาว ร่วมกับผู้ป่วยมีใจสั่นเต้นเร็วรัวหรือวูบหมดสติ',
      triageLevel: 2,
      severity: 'HIGH',
      suggestedAction: 'ตรวจ High-precordial leads EKG (V1-V2 ช่องซี่โครงที่ 2-3) หา Brugada pattern, วัดค่า QTc อย่างละเอียด, Admit สังเกตอาการบน Telemetry Monitor'
    });
  }

  // 4. Rapid Atrial Fibrillation with Thromboembolic Risk
  const isElderly = Number(patient.age) >= 65;
  if (rhythm === 'rapid_irregular' && (isElderly || hasHtn || hasDm)) {
    flags.push({
      key: 'palpitation_rf_rapid_af_stroke',
      textTh: 'สงสัยภาวะหัวใจห้องบนสั่นพลิ้วเต้นเร็ว (Atrial Fibrillation with RVR & Stroke Risk)',
      risk: 'ใจสั่นแบบไม่สม่ำเสมอในผู้สูงอายุหรือมีปัจจัยเสี่ยงหลอดเลือด เสี่ยงต่อภาวะหัวใจล้มเหลวและลิ่มเลือดอุดตันในสมอง (Stroke)',
      triageLevel: 2,
      severity: 'HIGH',
      suggestedAction: 'ตรวจ EKG 12 leads, พิจารณา Rate Control, ประเมิน CHA2DS2-VASc Score เพื่อพิจารณายาต้านการแข็งตัวของเลือด'
    });
  }

  // 5. Suspected Thyroid Storm / Endocrine Crisis
  if (hasHyperthyroid && (hasAlteredMental || rhythm === 'rapid_irregular' || rhythm === 'rapid_regular')) {
    flags.push({
      key: 'palpitation_rf_thyroid_storm',
      textTh: 'สงสัยภาวะต่อมไทรอยด์เป็นพิษวิกฤต (Suspected Thyroid Storm)',
      risk: 'ผู้ป่วยโรคไทรอยด์มีอาการใจสั่นรุนแรง หัวใจเต้นผิดจังหวะ หรือมีอาการซึมสับสน',
      triageLevel: 2,
      severity: 'HIGH',
      suggestedAction: 'ประเมิน Burch-Wartofsky Point Scale, ส่ง Stat Thyroid Panel (FT3, FT4, TSH), พิจารณา Beta-blocker, ยาต้านไทรอยด์ และ Hydrocortisone IV'
    });
  }

  // 6. Sympathomimetic / Drug-Induced Tachycardia
  if (hasIllicit || hasEnergyDrinks) {
    flags.push({
      key: 'palpitation_rf_sympathomimetic_toxicity',
      textTh: 'ภาวะหัวใจเต้นเร็วจากสารกระตุ้นประสาทหรือคาเฟอีนขนาดสูง (Sympathomimetic / Stimulant Toxicity)',
      risk: 'ได้รับสารกระตุ้นประสาท ยาลดความอ้วน หรือเครื่องดื่มชูกำลังในปริมาณมาก เสี่ยงต่อ Arrhythmia และ Hypertensive Crisis',
      triageLevel: 3,
      severity: 'MODERATE',
      suggestedAction: 'Monitor EKG และ Vital signs, ส่ง Electrolytes, พิจารณา Urine Amphetamine/Toxin screen, ให้ Benzodiazepine หากกระสับกระส่ายรุนแรง'
    });
  }

  return flags;
}

function isPalpitationRedFlag(patient) {
  if (!patient) return false;
  return evaluatePalpitationRedFlags(patient).length > 0;
}

// --- Output Rendering Helpers (Zero 🚩 in UI/Positives/Narrative) ---
function formatPalpitationOutputBundle(patient) {
  const unitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durStr = patient.durationVal
    ? `${patient.durationVal} ${unitMap[patient.durationUnit] || 'ชั่วโมง'}`
    : 'ไม่ระบุระยะเวลา';

  const statusMap = {
    currently_ongoing: 'ยังมีอาการใจสั่นอยู่ในขณะนี้',
    resolved_recently: 'อาการใจสั่นหายไปแล้วก่อนมาถึง รพ.'
  };
  const freqMap = {
    first_time: 'เป็นครั้งแรกในชีวิต',
    weekly_frequent: 'เป็นบ่อยสัปดาห์ละหลายครั้ง',
    monthly: 'เป็นเดือนละ 1–2 ครั้ง',
    infrequent_yearly: 'นานๆ เป็นครั้ง (ปีละ 1–2 ครั้ง)'
  };
  const rhythmMap = {
    rapid_regular: 'เต้นเร็วรัวสม่ำเสมอเป็นจังหวะ',
    rapid_irregular: 'เต้นเร็วและไม่สม่ำเสมอ กระโดดไปมา',
    ectopic_skipped: 'เต้นสะดุดเป็นพักๆ เหมือนหยุดไปแล้วเต้นแรง',
    abnormally_slow: 'เต้นช้ามากผิดปกติจนอ่อนเพลีย',
    forceful_normal_rate: 'เต้นแรงตึกๆ ในอก แต่อัตราเร็วปกติ'
  };
  const onsetOffsetMap = {
    sudden_both: 'เริ่มเร็วทันที และหยุดทันที (เหมือนเปิด-ปิดสวิตช์)',
    gradual_both: 'ค่อยๆ เร็วขึ้น และค่อยๆ ช้าลง'
  };
  const triggerMap = {
    valsalva_relieved: 'หยุดเต้นเร็วเมื่อกลั้นหายใจเบ่ง หรือล้างหน้าน้ำเย็น',
    exertional: 'กำเริบขณะออกแรงหรือออกกำลังกาย',
    rest_or_nocturnal: 'กำเริบขณะนอนพัก หรือสะดุ้งตื่นกลางดึก',
    anxiety_panic: 'สัมพันธ์กับความเครียด วิตกกังวล หรือตกใจ'
  };
  const warningMap = {
    presyncope_dizziness: 'หน้ามืด วิงเวียนศีรษะ ตาพร่ามัว',
    syncope: 'เป็นลม วูบหมดสติชั่วขณะ',
    ischemic_chest_pain: 'เจ็บแน่นหน้าอก อึดอัด หรือร้าวไปกราม/แขน',
    acute_heart_failure: 'หายใจหอบเหนื่อย นอนราบไม่ได้ หรือสะดุ้งหอบกลางดึก',
    cold_diaphoresis: 'เหงื่อแตกท่วมตัว ตัวเย็นชืด ซีด',
    altered_mental: 'ซึมลง สับสน ตอบสนองช้า',
    hyperventilation_tingling: 'มือเท้าชา หายใจเร็วตื้น นิ้วเกร็งจีบ'
  };
  const subMap = {
    energy_drinks: 'เครื่องดื่มชูกำลัง',
    caffeine_heavy: 'กาแฟ/ชาเข้มข้น/น้ำอัดลม/ช็อกโกแลตปริมาณมาก',
    alcohol_binge: 'เครื่องดื่มแอลกอฮอล์/ดื่มหนักต่อเนื่อง',
    cannabis_kratom: 'กัญชา/พืชกระท่อม/สารสกัดสมุนไพร',
    illicit_stimulants: 'ยาลดความอ้วน/สารกระตุ้นประสาทต้องห้าม'
  };
  const medMap = {
    decongestants: 'ยาแก้หวัด/ลดน้ำมูก (Pseudoephedrine/Phenylephrine)',
    asthma_inhalers: 'ยาพ่นขยายหลอดลม (Salbutamol)',
    thyroid_hormone: 'ฮอร์โมนไทรอยด์ (Levothyroxine)',
    antiarrhythmics: 'ยาควบคุมจังหวะหัวใจ (Amiodarone/Digoxin/Beta-blockers)',
    diuretics: 'ยาขับปัสสาวะ (Furosemide/HCTZ)'
  };
  const cardiacMap = {
    cad_stent: 'โรคหลอดเลือดหัวใจตีบ/เคยใส่ขดลวดหัวใจ',
    prior_arrhythmia: 'เคยเป็นโรคหัวใจเต้นผิดจังหวะ (AF/SVT/VT)',
    prior_ablation: 'เคยรับการสวนจี้ไฟฟ้าหัวใจ',
    heart_failure: 'โรคหัวใจล้มเหลว/หัวใจโต',
    valvular_disease: 'โรคลิ้นหัวใจ/เคยผ่าตัดเปลี่ยนลิ้นหัวใจ',
    pacemaker_icd: 'ใส่เครื่องกระตุ้น/กระตุกไฟฟ้าหัวใจ (Pacemaker/ICD)'
  };
  const importantMap = {
    heart_disease: 'โรคหัวใจ',
    hyperthyroidism: 'ต่อมไทรอยด์ทำงานเกิน/คอพอกเป็นพิษ',
    diabetes: 'โรคเบาหวาน'
  };
  const nonCardiacMap = {
    hyperthyroidism: 'ต่อมไทรอยด์ทำงานเกิน',
    diabetes: 'โรคเบาหวาน',
    hypertension: 'โรคความดันโลหิตสูง',
    anemia: 'ภาวะโลหิตจาง'
  };

  const exactDt = [
    patient.palpitationOnsetExactDate ? `วันที่ ${patient.palpitationOnsetExactDate}` : '',
    patient.palpitationOnsetExactTime ? `เวลา ${patient.palpitationOnsetExactTime} น.` : ''
  ].filter(Boolean).join(' ');

  const statusText = statusMap[patient.palpitationCurrentStatus] || '';
  const freqText = freqMap[patient.palpitationEpisodeFreq] || '';
  const rhythmText = rhythmMap[patient.palpitationRhythmPattern] || '';
  const onsetOffsetText = onsetOffsetMap[patient.palpitationOnsetOffset] || '';

  const triggers = Array.isArray(patient.palpitationTriggers) ? patient.palpitationTriggers : [];
  const trigPos = triggers.map(t => triggerMap[t]).filter(Boolean);

  const warnings = Array.isArray(patient.palpitationWarningSigns) ? patient.palpitationWarningSigns : [];
  const warnPos = warnings.filter(w => w !== 'none_warning').map(w => warningMap[w]).filter(Boolean);

  const substances = Array.isArray(patient.palpitationSubstances) ? patient.palpitationSubstances : [];
  const subPos = substances.filter(s => s !== 'none_substances').map(s => subMap[s]).filter(Boolean);

  const meds = Array.isArray(patient.palpitationMeds) ? patient.palpitationMeds : [];
  const medPos = meds.filter(m => m !== 'none_meds').map(m => medMap[m]).filter(Boolean);

  const cardH = Array.isArray(patient.palpitationCardiacHistory) ? patient.palpitationCardiacHistory : [];
  const cardPos = cardH.filter(c => c !== 'none_cardiac_pmh').map(c => cardiacMap[c]).filter(Boolean);

  const impCond = Array.isArray(patient.palpitationImportantConditions) ? patient.palpitationImportantConditions : [];
  const impPos = impCond.filter(i => i !== 'none_important_pmh').map(i => importantMap[i]).filter(Boolean);

  const nonCard = Array.isArray(patient.palpitationNonCardiacHistory) ? patient.palpitationNonCardiacHistory : [];
  const nonCardPos = nonCard.filter(n => n !== 'none_noncardiac_pmh' && !impCond.includes(n)).map(n => nonCardiacMap[n]).filter(Boolean);

  // Pertinent Positives (Zero 🚩)
  const positives = [];
  if (warnPos.length > 0) positives.push(`อาการเตือนร่วม: ${warnPos.join(', ')}`);
  if (trigPos.length > 0) positives.push(`ท่าทาง/สิ่งกระตุ้น: ${trigPos.join(', ')}`);
  if (subPos.length > 0) positives.push(`สารกระตุ้นใน 24–48 ชม.: ${subPos.join(', ')}`);
  if (medPos.length > 0) positives.push(`ยาที่ใช้/เพิ่งได้รับ: ${medPos.join(', ')}`);
  if (patient.palpitationCustomTriggerCheck === 'has_custom_trigger' && patient.palpitationCustomTriggerText) {
    positives.push(`ยา/อาหาร/สารสงสัยเพิ่มเติม: ${patient.palpitationCustomTriggerText}`);
  }
  const allPmhPos = [...impPos, ...nonCardPos];
  if (allPmhPos.length > 0) {
    const cStr = cardPos.length > 0 ? ` (${cardPos.join(', ')})` : '';
    positives.push(`โรคประจำตัวสำคัญ: ${allPmhPos.join(', ')}${cStr}`);
  } else if (cardPos.length > 0) {
    positives.push(`ประวัติโรคหัวใจเดิม: ${cardPos.join(', ')}`);
  }
  if (patient.palpitationFamilyHistory === 'sudden_death_under50') {
    positives.push('มีประวัติครอบครัวสายตรงเสียชีวิตกะทันหันก่อนอายุ 50 ปี');
  }
  if (patient.otherSymptomsFree) positives.push(`อื่นๆ: ${patient.otherSymptomsFree}`);

  // Pertinent Negatives (Strictly derived from explicit user inputs)
  const negatives = [];
  if (warnings.includes('none_warning')) {
    negatives.push('ปฏิเสธหน้ามืด วูบหมดสติ เจ็บแน่นหน้าอก หายใจหอบเหนื่อย หรือเหงื่อแตกตัวเย็น');
  } else if (warnings.length > 0) {
    if (!warnings.includes('syncope') && !warnings.includes('presyncope_dizziness')) negatives.push('ไม่มีหน้ามืดหรือวูบหมดสติ');
    if (!warnings.includes('ischemic_chest_pain')) negatives.push('ไม่มีอาการเจ็บแน่นหน้าอก');
    if (!warnings.includes('acute_heart_failure')) negatives.push('ไม่มีหายใจหอบเหนื่อยหรือนอนราบไม่ได้');
  }
  if (substances.includes('none_substances')) negatives.push('ปฏิเสธเครื่องดื่มชูกำลัง คาเฟอีนจัด แอลกอฮอล์ หรือสารกระตุ้น');
  if (meds.includes('none_meds')) negatives.push('ปฏิเสธยาลดน้ำมูก ยาพ่นขยายหลอดลม ฮอร์โมนไทรอยด์ หรือยาขับปัสสาวะ');
  if (patient.palpitationCustomTriggerCheck === 'no_custom_trigger') negatives.push('ไม่มีสารหรือยาอื่นที่สงสัยกระตุ้นเพิ่มเติม');
  if (impCond.includes('none_important_pmh')) negatives.push('ปฏิเสธประวัติโรคหัวใจ โรคไทรอยด์ และเบาหวาน');
  if (patient.palpitationFamilyHistory === 'no_family_sudden_death') {
    negatives.push('ปฏิเสธประวัติครอบครัวเสียชีวิตกะทันหันในวัยหนุ่มสาว');
  }

  patient.pertinentPositives = positives;
  patient.pertinentNegatives = negatives;

  const redFlags = evaluatePalpitationRedFlags(patient);
  patient.redFlags = redFlags;

  const hospLabel = {
    self: 'ผู้ป่วยขอให้ข้อมูลด้วยตนเองทั้งหมด',
    has_history: 'มีประวัติการรักษาเดิมที่ รพ.ราชบุรี',
    first_time: 'มารับการตรวจที่ รพ.ราชบุรี ครั้งแรก'
  }[patient.hospRecordStatus] || 'ไม่ได้ระบุ';

  const udArr = Array.isArray(patient.underlying)
    ? patient.underlying.filter(u => u && !u.includes('ปฏิเสธ') && u !== 'ไม่มี' && u !== 'ไม่มีโรคประจำตัว')
    : [];
  const udExplicitDeny = Array.isArray(patient.underlying) && patient.underlying.some(u => u && u.includes('ปฏิเสธ'));
  const udText = udArr.length > 0 ? udArr.join(', ') : ((patient.hospRecordStatus === 'self' || udExplicitDeny) ? 'ปฏิเสธ' : 'ไม่ได้ระบุ');
  const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ') ? 'ไม่ได้ระบุ' : patient.currentMeds;
  const allergyText = (!patient.drugAllergy || patient.drugAllergy === 'ไม่ได้ระบุ') ? 'ไม่ได้ระบุ' : patient.drugAllergy;
  const docNotes = patient.doctor_notes || {};

  const hpiPatternSummary = [rhythmText, onsetOffsetText].filter(Boolean).join(', ');
  const statusFreqSummary = [statusText, freqText, exactDt].filter(Boolean).join(', ');

  const defaultRapid = [
    `[Chief Complaint (CC)]`,
    `ใจสั่น (Palpitations) มา ${durStr}`,
    ``,
    `[History of Present Illness (HPI)]`,
    `• สถานะและช่วงเวลา: ${statusFreqSummary || 'ไม่ได้ระบุ'}`,
    `• ลักษณะจังหวะหัวใจ: ${hpiPatternSummary || 'ไม่ได้ระบุ'}`,
    `• Pertinent Positives:`,
    positives.length > 0 ? positives.map(p => `  - ${p}`).join('\n') : '  - ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม',
    ``,
    `• Pertinent Negatives:`,
    negatives.length > 0 ? negatives.map(n => `  - ${n}`).join('\n') : '  - ยังไม่มีคำตอบปฏิเสธเฉพาะในหมวดอาการร่วม',
    ``,
    `[Past Medical History & Medications]`,
    `• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}`,
    `• โรคประจำตัว (U/D): ${udText}`,
    `• ยาประจำตัว (Current Meds): ${medsText}`,
    `• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${allergyText}`,
    ``,
    `[Emergency Risk Assessment (Red Flags)]`,
    redFlags.length > 0
      ? `🚩 RED FLAGS DETECTED:\n${redFlags.map(rf => `  * ${rf.textTh}\n    ความเสี่ยง: ${rf.risk}`).join('\n')}`
      : '✓ ไม่พบสัญญาณวิกฤต (No Immediate Red Flag)',
    ``,
    `[Doctor's Clinical Addendum & Exam]`,
    `• ประวัติเพิ่มเติม/แก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}`,
    `• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}`,
    `• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}`,
    `• แผนการรักษา (Plan/Orders): ${docNotes.plan || '-'}`
  ].join('\n');

  const genderLabel = (patient.gender && patient.gender !== 'ไม่ระบุ') ? patient.gender : '';
  let defaultNarrative = `ผู้ป่วย${genderLabel} อายุ ${patient.age || 'ไม่ได้ระบุ'} ปี มาด้วยอาการใจสั่น มา ${durStr}`;
  if (statusFreqSummary) defaultNarrative += ` (${statusFreqSummary})`;
  if (hpiPatternSummary) defaultNarrative += ` ลักษณะ${hpiPatternSummary}`;
  defaultNarrative += '.';
  if (positives.length > 0) defaultNarrative += ` อาการร่วมและปัจจัยเสี่ยง: ${positives.join('; ')}.`;
  if (negatives.length > 0) defaultNarrative += ` อาการปฏิเสธสำคัญ: ${negatives.join(', ')}.`;
  defaultNarrative += `\nประวัติเดิม: ${hospLabel}, โรคประจำตัว: ${udText}, ยาประจำตัว: ${medsText}, แพ้ยา: ${allergyText}.`;
  if (redFlags.length > 0) {
    defaultNarrative += `\n[แจ้งเตือนความเสี่ยงสูง]: ${redFlags.map(rf => rf.textTh).join(', ')}`;
  }

  const jsonPayload = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    encounter: {
      hospital_site: 'Ratchaburi Hospital',
      queue_id: patient.queue_number || '',
      hn: patient.hn || '',
      patient_name: patient.name || '',
      age: patient.age !== undefined ? patient.age : null,
      gender: patient.gender || '',
      timestamp: patient.timestamp || '',
      status: patient.status || 'waiting',
      triage_urgency_flag: redFlags.length > 0,
      red_flags_count: redFlags.length,
      hospital_record_status: patient.hospRecordStatus || ''
    },
    chief_complaint: 'palpitation',
    chief_complaint_label: 'ใจสั่น',
    schema_version: '2.1',
    palpitation_profile: {
      duration: { value: patient.durationVal || null, unit: patient.durationUnit || 'hours' },
      current_status: patient.palpitationCurrentStatus || null,
      episode_frequency: patient.palpitationEpisodeFreq || null,
      onset_exact_date: patient.palpitationOnsetExactDate || null,
      onset_exact_time: patient.palpitationOnsetExactTime || null,
      rhythm_pattern: patient.palpitationRhythmPattern || null,
      onset_offset_mode: patient.palpitationOnsetOffset || null,
      triggers: triggers,
      warning_signs: warnings,
      substances: substances,
      medications_risk: meds,
      custom_trigger_check: patient.palpitationCustomTriggerCheck || null,
      custom_trigger_text: patient.palpitationCustomTriggerText || null,
      important_conditions: impCond,
      cardiac_history: cardH,
      non_cardiac_history: nonCard,
      family_history: patient.palpitationFamilyHistory || null,
      other_symptoms_free: patient.otherSymptomsFree || ''
    },
    clinical_summary: {
      pertinent_positives: positives,
      pertinent_negatives: negatives,
      red_flags: redFlags.map(rf => ({
        code: rf.key,
        text_th: rf.textTh,
        risk_rationale: rf.risk,
        triage_level: rf.triageLevel || 2,
        severity: rf.severity || 'HIGH'
      }))
    },
    doctor_clinical_addendum: {
      additional_hpi: docNotes.additional_hpi || '',
      physical_exam: docNotes.physical_exam || '',
      preliminary_dx: docNotes.preliminary_dx || '',
      plan: docNotes.plan || ''
    }
  };

  return { defaultRapid, defaultNarrative, jsonPayload };
}

function updatePalpitationOutputs(patient) {
  if (!patient) return { rapid: '', narrative: '', json: null };
  const { defaultRapid, defaultNarrative, jsonPayload } = formatPalpitationOutputBundle(patient);
  const finalRapid = patient.custom_rapid_note || defaultRapid;
  const finalNarrative = patient.custom_narrative_note || defaultNarrative;
  patient.rapidHpi = finalRapid;
  patient.narrativeHpi = finalNarrative;
  patient.medicalJson = jsonPayload;

  if (typeof document !== 'undefined') {
    const rapidView = getPalEl('rapidTextView');
    const narrativeView = getPalEl('narrativeTextView');
    const jsonView = getPalEl('jsonViewer');
    if (rapidView) rapidView.value = finalRapid;
    if (narrativeView) narrativeView.value = finalNarrative;
    if (jsonView) jsonView.textContent = JSON.stringify(jsonPayload, null, 2);
  }
  return { rapid: finalRapid, narrative: finalNarrative, json: jsonPayload };
}

// --- Patient Form HTML Builder ---
function buildPalpitationFormHtml() {
  return `
    <div id="palpitationQuestionnaireSection" class="hidden space-y-6">
      <div data-cc-top-banner="palpitation">
        <div class="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 shadow-sm">
          <i data-lucide="heart-pulse" class="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5"></i>
          <div class="text-xs sm:text-sm text-rose-900 leading-relaxed">
            <span class="font-bold block mb-0.5">คำแนะนำเร่งด่วนสำหรับอาการใจสั่น:</span>
            หากท่านมีอาการ <strong>วูบหมดสติ เจ็บแน่นหน้าอก หายใจหอบเหนื่อย หรือเหงื่อแตกตัวเย็น</strong> กรุณาแจ้งพยาบาลคัดกรองทันที เพื่อรับการตรวจคลื่นไฟฟ้าหัวใจด่วน และควรงดเครื่องดื่มคาเฟอีน/ชูกำลัง
          </div>
        </div>
      </div>

      <!-- Card 1: Duration, Status & Rhythm Pattern -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
        <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="activity" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">1. ระยะเวลา ความถี่ และจังหวะการเต้นของหัวใจ</h2>
            <p class="text-xs text-slate-500">ระบุช่วงเวลาที่เกิดอาการและความรู้สึกถึงจังหวะหัวใจที่ผิดปกติ</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-800 mb-1.5">เริ่มมีอาการใจสั่นมานานเท่าไรแล้ว</label>
            <div class="flex items-center gap-2">
              <input type="number" id="palpitationDurationVal" min="1" max="999" placeholder="เช่น 2" class="w-24 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500">
              <select id="palpitationDurationUnit" class="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
                <option value="minutes">นาที</option>
                <option value="hours" selected>ชั่วโมง</option>
                <option value="days">วัน</option>
                <option value="weeks">สัปดาห์</option>
                <option value="months">เดือน</option>
              </select>
            </div>
          </div>
          <div id="palpitationOnsetExactWrap" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-800 mb-1">วันที่เริ่มมีอาการ (วว/ดด/ปปปป)</label>
              <input type="text" id="palpitationOnsetExactDate" data-universal-date="true" placeholder="เช่น 26/10/2026" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-800 mb-1">เวลาที่เริ่มมีอาการ (24 ชม.)</label>
              <input type="text" id="palpitationOnsetExactTime" data-universal-time="true" placeholder="เช่น 10:15" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-800 mb-1.5">อาการในขณะนี้</label>
            ${renderPalGrid('grid-cols-1', [
              { kind: 'radio', name: 'palpitationCurrentStatus', value: 'currently_ongoing', title: ['ยังมีอาการใจสั่น', 'อยู่ในขณะนี้'], compact: true },
              { kind: 'radio', name: 'palpitationCurrentStatus', value: 'resolved_recently', title: ['หายไปแล้ว', 'ก่อนมาโรงพยาบาล'], compact: true }
            ])}
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-800 mb-1.5">ความถี่ที่เคยเป็น</label>
            ${renderPalGrid('grid-cols-2', [
              { kind: 'radio', name: 'palpitationEpisodeFreq', value: 'first_time', title: ['เป็นครั้งแรก'], compact: true },
              { kind: 'radio', name: 'palpitationEpisodeFreq', value: 'weekly_frequent', title: ['สัปดาห์ละหลายครั้ง'], compact: true },
              { kind: 'radio', name: 'palpitationEpisodeFreq', value: 'monthly', title: ['เดือนละ 1–2 ครั้ง'], compact: true },
              { kind: 'radio', name: 'palpitationEpisodeFreq', value: 'infrequent_yearly', title: ['นานๆ ครั้ง', '(ปีละ 1–2 ครั้ง)'], compact: true }
            ])}
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100">
          ${renderPalSysHeader({ label: '1.1 ลักษณะจังหวะหัวใจที่รู้สึกได้เด่นชัดที่สุด', icon: 'heart', colorClass: 'bg-rose-100 text-rose-700' })}
          ${renderPalGrid('grid-cols-1 sm:grid-cols-2', [
            { kind: 'radio', name: 'palpitationRhythmPattern', value: 'rapid_regular', title: ['เต้นเร็วรัวสม่ำเสมอ', 'เป็นจังหวะ'], desc: 'เหมือนเสียงกลองรัวเร็วสม่ำเสมอไม่สะดุด' },
            { kind: 'radio', name: 'palpitationRhythmPattern', value: 'rapid_irregular', title: ['เต้นเร็ว', 'และไม่สม่ำเสมอเลย'], desc: 'จังหวะกระโดดไปมา เบาบ้างแรงบ้าง' },
            { kind: 'radio', name: 'palpitationRhythmPattern', value: 'ectopic_skipped', title: ['เต้นสะดุด', 'เป็นครั้งคราว'], desc: 'เหมือนหยุดไป 1 จังหวะแล้วเต้นแรงตามมา' },
            { kind: 'radio', name: 'palpitationRhythmPattern', value: 'abnormally_slow', title: ['เต้นช้ามากผิดปกติ'], desc: 'รู้สึกหัวใจเต้นช้าจนอ่อนเพลียหมดแรง' },
            { kind: 'radio', name: 'palpitationRhythmPattern', value: 'forceful_normal_rate', title: ['เต้นแรงตึกๆ ในอก', 'แต่อัตราเร็วปกติ'], colSpan2: true }
          ])}
        </div>

        <div class="pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-800 mb-1.5">รูปแบบการเริ่มและหยุด</label>
            ${renderPalGrid('grid-cols-1', [
              { kind: 'radio', name: 'palpitationOnsetOffset', value: 'sudden_both', title: ['เริ่มเร็วทันที', 'และหยุดทันที', '(เหมือนเปิด-ปิด', 'สวิตช์)'], compact: true },
              { kind: 'radio', name: 'palpitationOnsetOffset', value: 'gradual_both', title: ['ค่อยๆ เร็วขึ้น', 'และค่อยๆ ช้าลง'], compact: true }
            ])}
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-800 mb-1.5">ท่าทางหรือสิ่งกระตุ้นที่เกี่ยวข้อง (เลือกได้หลายข้อ)</label>
            ${renderPalGrid('grid-cols-1 sm:grid-cols-2', [
              { kind: 'checkbox', name: 'palpitationTriggers', value: 'valsalva_relieved', title: ['หยุดเมื่อกลั้นเบ่ง', 'หรือล้างหน้าน้ำเย็น'], compact: true },
              { kind: 'checkbox', name: 'palpitationTriggers', value: 'exertional', title: ['กำเริบขณะออกแรง', 'หรือออกกำลังกาย'], compact: true },
              { kind: 'checkbox', name: 'palpitationTriggers', value: 'rest_or_nocturnal', title: ['กำเริบขณะนอนพัก', 'หรือตื่นกลางดึก'], compact: true },
              { kind: 'checkbox', name: 'palpitationTriggers', value: 'anxiety_panic', title: ['สัมพันธ์ความเครียด', 'หรือตกใจกลัว'], compact: true }
            ])}
          </div>
        </div>
      </div>

      <!-- Card 2: Emergency Warning Signs -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-red-100 text-red-700 p-2 rounded-xl"><i data-lucide="shield-alert" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">2. สัญญาณอันตรายฉุกเฉินและอาการร่วม</h2>
            <p class="text-xs text-slate-500">เลือกอาการเตือนที่พบร่วมกับอาการใจสั่นในครั้งนี้ (เลือกได้หลายข้อ)</p>
          </div>
        </div>

        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          ${renderPalSysHeader({
            label: 'อาการเตือนระบบหัวใจและไหลเวียนโลหิต',
            icon: 'alert-octagon',
            colorClass: 'bg-red-100 text-red-700',
            toggleId: 'palpitationWarningNoneCb',
            toggleLabel: 'ไม่มีอาการในหมวดนี้',
            toggleName: 'palpitationWarningSigns',
            toggleValue: 'none_warning',
            toggleOnchange: 'handlePalpitationWarningNoneToggle(this)'
          })}
          ${renderPalGrid('grid-cols-1 sm:grid-cols-2', [
            { name: 'palpitationWarningSigns', value: 'presyncope_dizziness', title: ['หน้ามืด วิงเวียน', 'ตาพร่ามัว'], onchange: 'handlePalpitationWarningItemChange(this)' },
            { name: 'palpitationWarningSigns', value: 'syncope', title: ['เป็นลม วูบหมดสติ', 'ชั่วขณะ'], onchange: 'handlePalpitationWarningItemChange(this)' },
            { name: 'palpitationWarningSigns', value: 'ischemic_chest_pain', title: ['เจ็บแน่นหน้าอก', 'ร้าวกรามหรือแขน'], onchange: 'handlePalpitationWarningItemChange(this)' },
            { name: 'palpitationWarningSigns', value: 'acute_heart_failure', title: ['หายใจหอบเหนื่อย', 'นอนราบไม่ได้'], onchange: 'handlePalpitationWarningItemChange(this)' },
            { name: 'palpitationWarningSigns', value: 'cold_diaphoresis', title: ['เหงื่อแตกท่วมตัว', 'มือเท้าเย็นซีด'], onchange: 'handlePalpitationWarningItemChange(this)' },
            { name: 'palpitationWarningSigns', value: 'altered_mental', title: ['ซึมลง สับสน', 'ตอบสนองช้า'], onchange: 'handlePalpitationWarningItemChange(this)' },
            { name: 'palpitationWarningSigns', value: 'hyperventilation_tingling', title: ['มือเท้าชา', 'หายใจเร็วตื้น มือจีบ'], colSpan2: true, onchange: 'handlePalpitationWarningItemChange(this)' }
          ])}
        </div>
      </div>

      <!-- Card 3: Stimulants, Medications & Custom Triggers -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
        <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div class="bg-amber-100 text-amber-700 p-2 rounded-xl"><i data-lucide="coffee" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">3. สารกระตุ้น เครื่องดื่ม และยาที่อาจเกี่ยวข้อง</h2>
            <p class="text-xs text-slate-500">ตรวจสอบคาเฟอีน เครื่องดื่มชูกำลัง ยาลดน้ำมูก ยาพ่น หรือสารกระตุ้นอื่น</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            ${renderPalSysHeader({
              label: '3.1 เครื่องดื่มหรือสารกระตุ้น (24–48 ชม.)',
              icon: 'cup-soda',
              colorClass: 'bg-amber-100 text-amber-700',
              toggleId: 'palpitationSubNoneCb',
              toggleLabel: 'ไม่มีในหมวดนี้',
              toggleName: 'palpitationSubstances',
              toggleValue: 'none_substances',
              toggleOnchange: 'handlePalpitationSubstancesNoneToggle(this)'
            })}
            <div class="space-y-2">
              ${renderPalOption({ name: 'palpitationSubstances', value: 'energy_drinks', title: ['เครื่องดื่มชูกำลัง'], desc: 'เช่น M-150, กระทิงแดง, คาราบาว, Monster', onchange: 'handlePalpitationSubstancesItemChange(this)', compact: true })}
              ${renderPalOption({ name: 'palpitationSubstances', value: 'caffeine_heavy', title: ['กาแฟเข้มข้น ชา', 'น้ำอัดลม ช็อกโกแลต'], onchange: 'handlePalpitationSubstancesItemChange(this)', compact: true })}
              ${renderPalOption({ name: 'palpitationSubstances', value: 'alcohol_binge', title: ['ดื่มแอลกอฮอล์', 'ดื่มหนักต่อเนื่อง'], onchange: 'handlePalpitationSubstancesItemChange(this)', compact: true })}
              ${renderPalOption({ name: 'palpitationSubstances', value: 'cannabis_kratom', title: ['กัญชา พืชกระท่อม', 'หรือสารสกัดสมุนไพร'], onchange: 'handlePalpitationSubstancesItemChange(this)', compact: true })}
              ${renderPalOption({ name: 'palpitationSubstances', value: 'illicit_stimulants', title: ['ยาลดความอ้วน', 'หรือสารกระตุ้นประสาท'], onchange: 'handlePalpitationSubstancesItemChange(this)', compact: true })}
            </div>
          </div>

          <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            ${renderPalSysHeader({
              label: '3.2 ยาที่เพิ่งใช้หรือยาประจำตัว',
              icon: 'pill',
              colorClass: 'bg-blue-100 text-blue-700',
              toggleId: 'palpitationMedsNoneCb',
              toggleLabel: 'ไม่มีในหมวดนี้',
              toggleName: 'palpitationMeds',
              toggleValue: 'none_meds',
              toggleOnchange: 'handlePalpitationMedsNoneToggle(this)'
            })}
            <div class="space-y-2">
              ${renderPalOption({ name: 'palpitationMeds', value: 'decongestants', title: ['ยาแก้หวัด', '/ ยาลดน้ำมูก'], desc: 'เช่น Pseudoephedrine, Phenylephrine', onchange: 'handlePalpitationMedsItemChange(this)', compact: true })}
              ${renderPalOption({ name: 'palpitationMeds', value: 'asthma_inhalers', title: ['ยาพ่นขยายหลอดลม'], desc: 'เช่น ยาพ่นหอบหืด Salbutamol', onchange: 'handlePalpitationMedsItemChange(this)', compact: true })}
              ${renderPalOption({ name: 'palpitationMeds', value: 'thyroid_hormone', title: ['ยาหรือฮอร์โมนไทรอยด์'], desc: 'เช่น Levothyroxine', onchange: 'handlePalpitationMedsItemChange(this)', compact: true })}
              ${renderPalOption({ name: 'palpitationMeds', value: 'antiarrhythmics', title: ['ยารักษาหัวใจ', 'เต้นผิดจังหวะ'], desc: 'เช่น Amiodarone, Digoxin, Beta-blockers', onchange: 'handlePalpitationMedsItemChange(this)', compact: true })}
              ${renderPalOption({ name: 'palpitationMeds', value: 'diuretics', title: ['ยาขับปัสสาวะ'], desc: 'เช่น Furosemide, HCTZ', onchange: 'handlePalpitationMedsItemChange(this)', compact: true })}
            </div>
          </div>
        </div>

        <div class="pt-2 border-t border-slate-100">
          <label class="block text-xs font-semibold text-slate-800 mb-1.5">3.3 มียา อาหาร หรือสารอื่นๆ ที่สงสัยกระตุ้นอาการหรือไม่</label>
          ${renderGiSafeTriggerGridPal()}
          <div id="palpitationCustomTriggerWrap" class="hidden mt-2.5">
            <input type="text" id="palpitationCustomTriggerText" placeholder="ระบุชื่อยา อาหารเสริม หรือสารที่สงสัย..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
          </div>
        </div>
      </div>

      <!-- Card 4: Important PMH & Family Sudden Death -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
        <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="file-text" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">4. ประวัติโรคประจำตัวที่สำคัญ และประวัติครอบครัว</h2>
            <p class="text-xs text-slate-500">ตรวจสอบโรคหัวใจเดิม โรคไทรอยด์ เบาหวาน และประวัติครอบครัวเสียชีวิตกะทันหัน</p>
          </div>
        </div>

        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          ${renderPalSysHeader({
            label: '4.1 โรคประจำตัวที่สำคัญ',
            icon: 'heart-handshake',
            colorClass: 'bg-purple-100 text-purple-700',
            toggleId: 'palpitationImportantNoneCb',
            toggleLabel: 'ไม่มีในหมวดนี้',
            toggleName: 'palpitationImportantConditions',
            toggleValue: 'none_important_pmh',
            toggleOnchange: 'handlePalpitationImportantNoneToggle(this)'
          })}
          ${renderPalGrid('grid-cols-1 sm:grid-cols-3', [
            { id: 'palpitationHeartCb', name: 'palpitationImportantConditions', value: 'heart_disease', title: ['โรคหัวใจ'], onchange: 'handlePalpitationHeartToggle(this)' },
            { name: 'palpitationImportantConditions', value: 'hyperthyroidism', title: ['ต่อมไทรอยด์ทำงานเกิน', '/ คอพอกเป็นพิษ'], onchange: 'handlePalpitationImportantItemChange(this)' },
            { name: 'palpitationImportantConditions', value: 'diabetes', title: ['โรคเบาหวาน'], onchange: 'handlePalpitationImportantItemChange(this)' }
          ])}
          <div id="palpitationHeartSubWrap" class="hidden mt-3 pt-3 border-t border-slate-200 space-y-2">
            <label class="block text-xs font-semibold text-slate-700 mb-1">ระบุรายละเอียดโรคหัวใจเดิม (เลือกได้หลายข้อ):</label>
            ${renderPalGrid('grid-cols-1 sm:grid-cols-2', [
              { name: 'palpitationCardiacHistory', value: 'cad_stent', title: ['หลอดเลือดหัวใจตีบ', 'หรือเคยใส่ขดลวด'], compact: true },
              { name: 'palpitationCardiacHistory', value: 'prior_arrhythmia', title: ['เคยเป็นโรคหัวใจ', 'เต้นผิดจังหวะ'], compact: true },
              { name: 'palpitationCardiacHistory', value: 'prior_ablation', title: ['เคยรักษาด้วย', 'การสวนจี้ไฟฟ้าหัวใจ'], compact: true },
              { name: 'palpitationCardiacHistory', value: 'heart_failure', title: ['ภาวะหัวใจล้มเหลว', 'หรือหัวใจโต'], compact: true },
              { name: 'palpitationCardiacHistory', value: 'valvular_disease', title: ['โรคลิ้นหัวใจ', '/ ผ่าตัดเปลี่ยนลิ้น'], compact: true },
              { name: 'palpitationCardiacHistory', value: 'pacemaker_icd', title: ['ใส่เครื่องกระตุ้น', 'หัวใจในร่างกาย'], compact: true }
            ])}
          </div>
          <p class="text-[11px] text-slate-500 mt-2">* โรคประจำตัวอื่นๆ สามารถระบุเพิ่มเติมได้ในหัวข้อประวัติสุขภาพและยาประจำตัวถัดไป</p>
        </div>

        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          ${renderPalSysHeader({ label: '4.2 ประวัติครอบครัวเสียชีวิตกะทันหัน', icon: 'users', colorClass: 'bg-indigo-100 text-indigo-700' })}
          ${renderPalGrid('grid-cols-1 sm:grid-cols-2', [
            { kind: 'radio', name: 'palpitationFamilyHistory', value: 'sudden_death_under50', title: ['มีญาติเสียชีวิต', 'กะทันหัน', 'ก่อนอายุ 50 ปี'], desc: 'เช่น พ่อ แม่ พี่ น้อง หรือภาวะใหลตาย' },
            { kind: 'radio', name: 'palpitationFamilyHistory', value: 'no_family_sudden_death', title: ['ไม่มีประวัติครอบครัว', 'เสียชีวิตกะทันหัน'] }
          ])}
        </div>
      </div>

      <!-- Unnumbered Card: Additional Notes -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100">
          <div class="bg-slate-100 text-slate-600 p-2 rounded-xl"><i data-lucide="message-square-plus" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-800">อาการอื่น ๆ หรือข้อความเพิ่มเติมถึงแพทย์</h2>
            <p class="text-xs text-slate-500">ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการแจ้งแพทย์เพิ่มเติม (ถ้ามี)</p>
          </div>
        </div>
        <textarea id="palpitation_other_free" rows="2" placeholder="ระบุอาการอื่นๆ เพิ่มเติม (ถ้ามี)..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500"></textarea>
      </div>
    </div>
  `;
}

function renderGiSafeTriggerGridPal() {
  return renderPalGrid('grid-cols-1 sm:grid-cols-2', [
    { kind: 'radio', name: 'palpitationCustomTriggerCheck', value: 'no_custom_trigger', title: ['ไม่มี'], onchange: "handlePalpitationCustomTriggerChange('no_custom_trigger')", compact: true },
    { kind: 'radio', name: 'palpitationCustomTriggerCheck', value: 'has_custom_trigger', title: ['มี (ระบุยา/สาร', 'ที่สงสัย)'], onchange: "handlePalpitationCustomTriggerChange('has_custom_trigger')", compact: true }
  ]);
}

// --- Register Chief Complaint Module ---
registerCcModule({
  id: 'palpitation',
  recordCc: 'palpitations',
  titleTh: 'ใจสั่น',
  titleEn: 'Palpitations & Arrhythmia Triage',
  sectionDomId: 'palpitationQuestionnaireSection',
  doctorCcBadgeHtml: '<i data-lucide="heart-pulse" class="w-4 h-4 text-rose-500 mr-1.5 flex-shrink-0"></i><span class="font-bold text-slate-800">CC: ใจสั่น (Palpitations)</span>',
  patientBadgeHtml: '<i data-lucide="heart-pulse" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"></i><span><span class="inline-block whitespace-nowrap">ใจสั่น / </span><span class="inline-block whitespace-nowrap">หัวใจเต้นผิดจังหวะ</span></span>',
  pmhSectionNumber: 5,
  dateFields: ['palpitationOnsetExactDate'],
  timeFields: ['palpitationOnsetExactTime'],
  branchIds: [
    'palpitationCustomTriggerWrap',
    'palpitationHeartSubWrap'
  ],
  inputIdsToClear: [
    'palpitationDurationVal',
    'palpitationOnsetExactDate',
    'palpitationOnsetExactTime',
    'palpitationCustomTriggerText',
    'palpitation_other_free'
  ],
  formHtml: buildPalpitationFormHtml(),

  resetForm: function() {
    (this.branchIds || []).forEach(id => {
      const el = getPalEl(id);
      if (el) el.classList.add('hidden');
    });
    (this.inputIdsToClear || []).forEach(id => {
      const el = getPalEl(id);
      if (el) el.value = '';
    });
    const durUnit = getPalEl('palpitationDurationUnit');
    if (durUnit) durUnit.value = 'hours';
    const root = getPalEl('palpitationQuestionnaireSection');
    if (root) {
      root.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(inp => { inp.checked = false; });
    }
  },
  clearForm: function() { this.resetForm(); },

  collectIntake: function(ctx) {
    const c = ctx || {};
    const _rawDur = parseFloat(getPalEl('palpitationDurationVal')?.value);
    const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
    const durationUnit = getPalEl('palpitationDurationUnit')?.value || 'hours';

    const palpitationCurrentStatus = queryPalOne('input[name="palpitationCurrentStatus"]:checked')?.value || '';
    const palpitationEpisodeFreq = queryPalOne('input[name="palpitationEpisodeFreq"]:checked')?.value || '';
    const palpitationOnsetExactDate = getPalEl('palpitationOnsetExactDate')?.value?.trim() || '';
    const palpitationOnsetExactTime = getPalEl('palpitationOnsetExactTime')?.value?.trim() || '';

    const palpitationRhythmPattern = queryPalOne('input[name="palpitationRhythmPattern"]:checked')?.value || '';
    const palpitationOnsetOffset = queryPalOne('input[name="palpitationOnsetOffset"]:checked')?.value || '';
    const palpitationTriggers = queryPalAll('input[name="palpitationTriggers"]:checked').map(el => el.value);

    const palpitationWarningSigns = queryPalAll('input[name="palpitationWarningSigns"]:checked').map(el => el.value);
    const palpitationSubstances = queryPalAll('input[name="palpitationSubstances"]:checked').map(el => el.value);
    const palpitationMeds = queryPalAll('input[name="palpitationMeds"]:checked').map(el => el.value);

    const palpitationCustomTriggerCheck = queryPalOne('input[name="palpitationCustomTriggerCheck"]:checked')?.value || '';
    const palpitationCustomTriggerText = getPalEl('palpitationCustomTriggerText')?.value?.trim() || '';

    const palpitationImportantConditions = queryPalAll('input[name="palpitationImportantConditions"]:checked').map(el => el.value);
    const palpitationCardiacHistory = queryPalAll('input[name="palpitationCardiacHistory"]:checked').map(el => el.value);
    const palpitationNonCardiacHistory = palpitationImportantConditions.filter(x => x !== 'heart_disease' && x !== 'none_important_pmh');
    const palpitationFamilyHistory = queryPalOne('input[name="palpitationFamilyHistory"]:checked')?.value || '';
    const otherSymptomsFree = getPalEl('palpitation_other_free')?.value?.trim() || c.otherSymptomsFree || '';

    return {
      id: c.recordId || '',
      queue_number: c.queueNumber || '',
      hn: c.randomHn || '',
      name: c.patientName || '',
      age: c.patientAge !== undefined ? c.patientAge : null,
      gender: c.gender || '',
      chief_complaint: 'palpitation',
      chief_complaint_title: 'ใจสั่น',
      timestamp: new Date().toISOString(),
      status: c.recordStatus || 'waiting',
      durationVal,
      durationUnit,
      hospRecordStatus: c.hospRecordStatus || '',
      underlying: Array.isArray(c.underlying) ? c.underlying : [],
      drugAllergy: c.drugAllergy || '',
      currentMeds: c.currentMeds || '',
      otherSymptomsFree,
      doctor_notes: c.preservedDoctorNotes || { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },

      palpitationCurrentStatus,
      palpitationEpisodeFreq,
      palpitationOnsetExactDate,
      palpitationOnsetExactTime,
      palpitationRhythmPattern,
      palpitationOnsetOffset,
      palpitationTriggers,
      palpitationWarningSigns,
      palpitationSubstances,
      palpitationMeds,
      palpitationCustomTriggerCheck,
      palpitationCustomTriggerText,
      palpitationImportantConditions,
      palpitationCardiacHistory,
      palpitationNonCardiacHistory,
      palpitationFamilyHistory
    };
  },

  hydrateForm: function(patient) {
    if (!patient) return;
    this.resetForm();

    const setVal = (id, val) => {
      const el = getPalEl(id);
      if (el) el.value = (val !== undefined && val !== null) ? val : '';
    };
    const setRadio = (name, val) => {
      if (!val) return;
      const el = queryPalOne(`input[name="${name}"][value="${val}"]`);
      if (el) el.checked = true;
    };
    const setCheckboxes = (name, arr) => {
      if (!Array.isArray(arr)) return;
      arr.forEach(val => {
        const el = queryPalOne(`input[name="${name}"][value="${val}"]`);
        if (el) el.checked = true;
      });
    };

    setVal('palpitationDurationVal', patient.durationVal || '');
    setVal('palpitationDurationUnit', patient.durationUnit || 'hours');

    setRadio('palpitationCurrentStatus', patient.palpitationCurrentStatus);
    setRadio('palpitationEpisodeFreq', patient.palpitationEpisodeFreq);
    setVal('palpitationOnsetExactDate', patient.palpitationOnsetExactDate || '');
    setVal('palpitationOnsetExactTime', patient.palpitationOnsetExactTime || '');

    setRadio('palpitationRhythmPattern', patient.palpitationRhythmPattern);
    setRadio('palpitationOnsetOffset', patient.palpitationOnsetOffset);
    setCheckboxes('palpitationTriggers', patient.palpitationTriggers);
    setCheckboxes('palpitationWarningSigns', patient.palpitationWarningSigns);
    setCheckboxes('palpitationSubstances', patient.palpitationSubstances);
    setCheckboxes('palpitationMeds', patient.palpitationMeds);

    setRadio('palpitationCustomTriggerCheck', patient.palpitationCustomTriggerCheck);
    handlePalpitationCustomTriggerChange(patient.palpitationCustomTriggerCheck);
    setVal('palpitationCustomTriggerText', patient.palpitationCustomTriggerText || '');

    setCheckboxes('palpitationImportantConditions', patient.palpitationImportantConditions);
    const hasHeart = Array.isArray(patient.palpitationImportantConditions) && patient.palpitationImportantConditions.includes('heart_disease');
    if (hasHeart) {
      handlePalpitationHeartToggle({ checked: true });
      setCheckboxes('palpitationCardiacHistory', patient.palpitationCardiacHistory);
    }

    setRadio('palpitationFamilyHistory', patient.palpitationFamilyHistory);
    setVal('palpitation_other_free', patient.otherSymptomsFree || '');
  },
  populateForm: function(patient) { this.hydrateForm(patient); },
  onSelectForm: function() { this.resetForm(); },
  onActivate: function() {
    if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') lucide.createIcons();
  },
  onMounted: function() { this.onActivate(); },
  init: function() { this.onActivate(); },

  isRedFlag: function(patient) { return isPalpitationRedFlag(patient); },
  evaluateRedFlags: function(patient) { return evaluatePalpitationRedFlags(patient); },
  updateOutputs: function(patient) { return updatePalpitationOutputs(patient); },

  algorithm: {
    ccId: 'palpitation',
    schemaKey: 'palpitation',
    titleTh: 'ใจสั่น',
    titleEn: 'Palpitations / Cardiac Arrhythmia Assessment',
    triageLevelDefault: 3,
    redFlagCategories: [
      'palpitation_rf_unstable_hemodynamics',
      'palpitation_rf_malignant_ventricular',
      'palpitation_rf_channelopathy_scd',
      'palpitation_rf_rapid_af_stroke',
      'palpitation_rf_thyroid_storm',
      'palpitation_rf_sympathomimetic_toxicity'
    ]
  },

  seedPatients: [
    {
      id: 'case-140',
      queue_number: 'Q-001',
      hn: '6714012',
      name: 'นายประยูร สุขสำราญ',
      age: 67,
      gender: 'ชาย',
      chief_complaint: 'palpitation',
      chief_complaint_title: 'ใจสั่น',
      timestamp: '2026-10-26T06:30:00.000Z',
      status: 'waiting',
      durationVal: 2,
      durationUnit: 'hours',
      hospRecordStatus: 'self',
      underlying: ['โรคหลอดเลือดหัวใจ (CAD)', 'ความดันสูง (HT)'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Aspirin 81 mg, Atorvastatin 40 mg, Metoprolol 25 mg',
      otherSymptomsFree: '',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },

      palpitationCurrentStatus: 'currently_ongoing',
      palpitationEpisodeFreq: 'first_time',
      palpitationOnsetExactDate: '26/10/2026',
      palpitationOnsetExactTime: '06:30',
      palpitationRhythmPattern: 'rapid_regular',
      palpitationOnsetOffset: 'sudden_both',
      palpitationTriggers: [],
      palpitationWarningSigns: ['syncope', 'presyncope_dizziness', 'ischemic_chest_pain', 'cold_diaphoresis'],
      palpitationSubstances: ['none_substances'],
      palpitationMeds: ['antiarrhythmics'],
      palpitationCustomTriggerCheck: 'no_custom_trigger',
      palpitationCustomTriggerText: '',
      palpitationCardiacHistory: ['cad_stent'],
      palpitationImportantConditions: ['heart_disease'],
      palpitationNonCardiacHistory: ['hypertension'],
      palpitationFamilyHistory: 'no_family_sudden_death'
    },
    {
      id: 'case-141',
      queue_number: 'Q-002',
      hn: '6714123',
      name: 'นางสาวพิมพ์มาดา วงศ์สุวรรณ',
      age: 28,
      gender: 'หญิง',
      chief_complaint: 'palpitation',
      chief_complaint_title: 'ใจสั่น',
      timestamp: '2026-10-26T07:15:00.000Z',
      status: 'waiting',
      durationVal: 1,
      durationUnit: 'hours',
      hospRecordStatus: 'self',
      underlying: ['ปฏิเสธ'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'ไม่มี',
      otherSymptomsFree: '',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },

      palpitationCurrentStatus: 'currently_ongoing',
      palpitationEpisodeFreq: 'monthly',
      palpitationOnsetExactDate: '26/10/2026',
      palpitationOnsetExactTime: '07:15',
      palpitationRhythmPattern: 'rapid_regular',
      palpitationOnsetOffset: 'sudden_both',
      palpitationTriggers: ['valsalva_relieved'],
      palpitationWarningSigns: ['none_warning'],
      palpitationSubstances: ['none_substances'],
      palpitationMeds: ['none_meds'],
      palpitationCustomTriggerCheck: 'no_custom_trigger',
      palpitationCustomTriggerText: '',
      palpitationCardiacHistory: ['none_cardiac_pmh'],
      palpitationImportantConditions: ['none_important_pmh'],
      palpitationNonCardiacHistory: ['none_noncardiac_pmh'],
      palpitationFamilyHistory: 'no_family_sudden_death'
    },
    {
      id: 'case-142',
      queue_number: 'Q-003',
      hn: '6714234',
      name: 'นายบุญช่วย ธนสาร',
      age: 74,
      gender: 'ชาย',
      chief_complaint: 'palpitation',
      chief_complaint_title: 'ใจสั่น',
      timestamp: '2026-10-26T08:00:00.000Z',
      status: 'waiting',
      durationVal: 1,
      durationUnit: 'days',
      hospRecordStatus: 'self',
      underlying: ['ความดันสูง (HT)', 'ไขมันในเลือดสูง (DLP)'],
      drugAllergy: 'แพ้ยา Penicillin',
      currentMeds: 'Amlodipine 10 mg, Simvastatin 20 mg',
      otherSymptomsFree: '',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },

      palpitationCurrentStatus: 'currently_ongoing',
      palpitationEpisodeFreq: 'first_time',
      palpitationOnsetExactDate: '25/10/2026',
      palpitationOnsetExactTime: '08:00',
      palpitationRhythmPattern: 'rapid_irregular',
      palpitationOnsetOffset: 'gradual_both',
      palpitationTriggers: ['exertional'],
      palpitationWarningSigns: ['presyncope_dizziness'],
      palpitationSubstances: ['caffeine_heavy'],
      palpitationMeds: ['none_meds'],
      palpitationCustomTriggerCheck: 'no_custom_trigger',
      palpitationCustomTriggerText: '',
      palpitationCardiacHistory: ['none_cardiac_pmh'],
      palpitationImportantConditions: ['none_important_pmh'],
      palpitationNonCardiacHistory: ['hypertension'],
      palpitationFamilyHistory: 'no_family_sudden_death'
    },
    {
      id: 'case-143',
      queue_number: 'Q-004',
      hn: '6714345',
      name: 'นายธนภัทร เลิศปัญญา',
      age: 21,
      gender: 'ชาย',
      chief_complaint: 'palpitation',
      chief_complaint_title: 'ใจสั่น',
      timestamp: '2026-10-26T09:30:00.000Z',
      status: 'waiting',
      durationVal: 3,
      durationUnit: 'hours',
      hospRecordStatus: 'self',
      underlying: ['ปฏิเสธ'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'ไม่มี',
      otherSymptomsFree: '',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },

      palpitationCurrentStatus: 'currently_ongoing',
      palpitationEpisodeFreq: 'first_time',
      palpitationOnsetExactDate: '26/10/2026',
      palpitationOnsetExactTime: '09:30',
      palpitationRhythmPattern: 'forceful_normal_rate',
      palpitationOnsetOffset: 'gradual_both',
      palpitationTriggers: ['anxiety_panic'],
      palpitationWarningSigns: ['hyperventilation_tingling'],
      palpitationSubstances: ['energy_drinks'],
      palpitationMeds: ['none_meds'],
      palpitationCustomTriggerCheck: 'no_custom_trigger',
      palpitationCustomTriggerText: '',
      palpitationCardiacHistory: ['none_cardiac_pmh'],
      palpitationImportantConditions: ['none_important_pmh'],
      palpitationNonCardiacHistory: ['none_noncardiac_pmh'],
      palpitationFamilyHistory: 'no_family_sudden_death'
    }
  ]
});

if (typeof window !== 'undefined') {
  window.handlePalpitationWarningNoneToggle = handlePalpitationWarningNoneToggle;
  window.handlePalpitationWarningItemChange = handlePalpitationWarningItemChange;
  window.handlePalpitationSubstancesNoneToggle = handlePalpitationSubstancesNoneToggle;
  window.handlePalpitationSubstancesItemChange = handlePalpitationSubstancesItemChange;
  window.handlePalpitationMedsNoneToggle = handlePalpitationMedsNoneToggle;
  window.handlePalpitationMedsItemChange = handlePalpitationMedsItemChange;
  window.handlePalpitationCustomTriggerChange = handlePalpitationCustomTriggerChange;
  window.handlePalpitationHeartToggle = handlePalpitationHeartToggle;
  window.handlePalpitationImportantItemChange = handlePalpitationImportantItemChange;
  window.handlePalpitationImportantNoneToggle = handlePalpitationImportantNoneToggle;
}
