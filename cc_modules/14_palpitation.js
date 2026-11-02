// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 14_palpitation.js
// อาการนำ: ใจสั่น (Palpitations / Cardiac Arrhythmia & Hemodynamic Instability Triage)
// ไฟล์นี้แยกอิสระสำหรับอาการนำ palpitation เพื่อให้ทีมแพทย์และ IT โรงพยาบาลนำไปพัฒนาต่อได้โดยไม่กระทบระบบหลัก
// =========================================================================

// --- UI Toggle Handlers ---
function handlePalpitationWarningNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="palpitationWarningSigns"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handlePalpitationSubstancesNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="palpitationSubstances"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handlePalpitationMedsNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="palpitationMeds"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handlePalpitationCustomTriggerChange(val) {
  const wrap = document.getElementById('palpitationCustomTriggerWrap');
  if (wrap) {
    if (val === 'has_custom_trigger') {
      wrap.classList.remove('hidden');
    } else {
      wrap.classList.add('hidden');
      const inp = document.getElementById('palpitationCustomTriggerText');
      if (inp) inp.value = '';
    }
  }
}

function handlePalpitationCardiacNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="palpitationCardiacHistory"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handlePalpitationNonCardiacNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="palpitationNonCardiacHistory"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handlePalpitationHeartToggle(el) {
  const wrap = document.getElementById('palpitationHeartSubWrap');
  if (wrap) {
    if (el && el.checked) {
      wrap.classList.remove('hidden');
      const noneCb = document.querySelector('input[name="palpitationImportantConditions"][value="none_important_pmh"]');
      if (noneCb) noneCb.checked = false;
    } else {
      wrap.classList.add('hidden');
      document.querySelectorAll('input[name="palpitationCardiacHistory"]').forEach(cb => { cb.checked = false; });
    }
  }
}

function handlePalpitationImportantNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="palpitationImportantConditions"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
    const wrap = document.getElementById('palpitationHeartSubWrap');
    if (wrap) {
      wrap.classList.add('hidden');
      document.querySelectorAll('input[name="palpitationCardiacHistory"]').forEach(cb => { cb.checked = false; });
    }
  }
}

function handlePalpitationImportantItemChange(el) {
  if (el && el.checked) {
    const noneCb = document.querySelector('input[name="palpitationImportantConditions"][value="none_important_pmh"]');
    if (noneCb) noneCb.checked = false;
  }
}

// --- Red Flag Evaluator ---
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

  // 1. Unstable Hemodynamics & Shock (ACLS Red Flag)
  if (hasSyncope || hasChestPain || hasHeartFailure || (hasPresyncope && hasColdDiaphoresis)) {
    flags.push({
      key: 'palpitation_rf_unstable_hemodynamics',
      textTh: 'หัวใจเต้นผิดจังหวะร่วมกับระบบไหลเวียนโลหิตไม่คงที่ (Unstable Arrhythmia / Shock Risk)',
      risk: 'มีอาการใจสั่นร่วมกับหมดสติ เจ็บแน่นหน้าอกรุนแรง หายใจหอบเหนื่อยรุนแรง หรือมือเท้าเย็นเหงื่อแตกท่วมตัว',
      triageLevel: 1,
      severity: 'CRITICAL',
      suggestedAction: 'Triage Level 1: ย้ายเข้าห้อง Resuscitation ทันที, ติด Monitor + EKG 12 ลีด ด่วนภายใน 10 นาที, เตรียมเครื่อง Defibrillator สำหรับ Synchronized Cardioversion หรือ External Pacing, เปิด IV และเตรียมยาตาม ACLS'
    });
  }

  // 2. High Risk for Malignant Ventricular Arrhythmias (VT/VF Risk)
  if ((hasCadStent || hasPriorHf || hasPpmIcd) && (rhythm === 'rapid_regular' || hasSyncope)) {
    flags.push({
      key: 'palpitation_rf_malignant_ventricular',
      textTh: 'สงสัยภาวะหัวใจเต้นผิดจังหวะรุนแรงชนิดห้องล่าง (Suspected Ventricular Tachycardia in Structural Heart Disease)',
      risk: 'ผู้ป่วยมีโรคกล้ามเนื้อหัวใจขาดเลือดเดิม ใส่ขดลวด หรือหัวใจล้มเหลว ร่วมกับใจสั่นเต้นเร็วรัวทันทีหรือหมดสติ เสี่ยงต่อภาวะใหลตายและหัวใจหยุดเต้นกะทันหัน',
      triageLevel: 1,
      severity: 'CRITICAL',
      suggestedAction: 'Stat EKG 12 leads ทันที, Stat Electrolytes (K+, Mg2+), Troponin-T, เตรียม IV Amiodarone หรือ Lidocaine และเตรียมเตียงวิกฤตโรคหัวใจ (CCU)'
    });
  }

  // 3. Family History of Sudden Death / Channelopathy
  if (familySuddenDeath && (hasSyncope || rhythm === 'rapid_regular')) {
    flags.push({
      key: 'palpitation_rf_channelopathy_scd',
      textTh: 'เสี่ยงต่อกลุ่มโรคหัวใจเต้นผิดจังหวะทางพันธุกรรม/ใหลตาย (Risk of Inherited Arrhythmia / Brugada / Long QT Syndrome)',
      risk: 'มีประวัติคนในครอบครัวเสียชีวิตกะทันหันในวัยหนุ่มสาว ร่วมกับผู้ป่วยมีใจสั่นเต้นเร็วรัวหรือวูบหมดสติ',
      triageLevel: 2,
      severity: 'HIGH',
      suggestedAction: 'ตรวจ High-precordial leads EKG (V1-V2 ช่องซี่โครงที่ 2-3) หา Brugada pattern, วัดค่า QTc อย่างละเอียด, ห้ามจำหน่ายกลับบ้าน ต้อง Admit สังเกตอาการบน Telemetry Monitor'
    });
  }

  // 4. Rapid Atrial Fibrillation with Thromboembolic Risk
  const isElderly = Number(patient.age) >= 65;
  if (rhythm === 'rapid_irregular' && (isElderly || hasHtn || hasDm)) {
    flags.push({
      key: 'palpitation_rf_rapid_af_stroke',
      textTh: 'สงสัยภาวะหัวใจห้องบนสั่นพลิ้วเต้นเร็ว (Atrial Fibrillation with RVR & Stroke Risk)',
      risk: 'ใจสั่นแบบไม่สม่ำเสมอ พลิกคว่ำพลิกหงาย ในผู้สูงอายุหรือมีปัจจัยเสี่ยงหลอดเลือด เสี่ยงต่อภาวะหัวใจล้มเหลวและลิ่มเลือดอุดตันในสมอง (Stroke)',
      triageLevel: 2,
      severity: 'HIGH',
      suggestedAction: 'ตรวจยืนยันจังหวะด้วย EKG 12 leads, พิจารณา Rate Control (IV Beta-blocker หรือ Diltiazem), ประเมิน CHA2DS2-VASc Score เพื่อพิจารณายาต้านการแข็งตัวของเลือด'
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
      suggestedAction: 'ประเมิน Burch-Wartofsky Point Scale, ส่ง Stat Thyroid Panel (Free T3, Free T4, TSH), Electrolytes, ให้การรักษาด้วย Beta-blocker (Propranolol), ยาต้านไทรอยด์ (PTU) และ Hydrocortisone IV'
    });
  }

  // 6. Sympathomimetic / Drug-Induced Tachycardia
  if (hasIllicit || hasEnergyDrinks) {
    flags.push({
      key: 'palpitation_rf_sympathomimetic_toxicity',
      textTh: 'ใจสั่นจากสารกระตุ้นระบบประสาทซิมพาเทติก (Sympathomimetic / Stimulant Toxicity)',
      risk: 'มีประวัติใช้ยาบ้า ยาไอซ์ ยาลดความอ้วน หรือดื่มเครื่องดื่มชูกำลังปริมาณมาก เสี่ยงต่อ Tachyarrhythmias และ Myocardial Ischemia',
      triageLevel: 2,
      severity: 'HIGH',
      suggestedAction: 'ตรวจ EKG เฝ้าระวัง Tachyarrhythmias และ Ischemia, ให้ IV Fluid และ Benzodiazepines (Diazepam IV) เพื่อลด Sympathetic tone, หลีกเลี่ยง Beta-blocker เดี่ยวๆ'
    });
  }

  return flags;
}

function isPalpitationRedFlag(patient) {
  const flags = evaluatePalpitationRedFlags(patient);
  return flags.length > 0;
}

// --- Output Formatting & Medical Translation ---
function updatePalpitationOutputs(patient) {
  if (!patient) return;

  const rfs = evaluatePalpitationRedFlags(patient);
  const warningSigns = Array.isArray(patient.palpitationWarningSigns) ? patient.palpitationWarningSigns : [];
  const triggers = Array.isArray(patient.palpitationTriggers) ? patient.palpitationTriggers : [];
  const substances = Array.isArray(patient.palpitationSubstances) ? patient.palpitationSubstances : [];
  const meds = Array.isArray(patient.palpitationMeds) ? patient.palpitationMeds : [];
  const cardiacHistory = Array.isArray(patient.palpitationCardiacHistory) ? patient.palpitationCardiacHistory : [];
  const nonCardiac = Array.isArray(patient.palpitationNonCardiacHistory) ? patient.palpitationNonCardiacHistory : [];

  const unitMapTh = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durationStr = patient.durationVal ? `${patient.durationVal} ${unitMapTh[patient.durationUnit] || patient.durationUnit || 'ชั่วโมง'}` : 'ไม่ระบุ';

  let statusTh = patient.palpitationCurrentStatus === 'currently_ongoing'
    ? 'ขณะนี้ยังคงมีอาการใจสั่นเต้นเร็วต่อเนื่องตลอดเวลา (Currently Ongoing)'
    : (patient.palpitationCurrentStatus === 'intermittent_resolved' ? 'อาการใจสั่นหยุดไปแล้ว แต่มีอาการกำเริบเป็นพักๆ (Intermittent / Resolved)' : 'ไม่ระบุ');

  let rhythmTh = 'ไม่ระบุ';
  if (patient.palpitationRhythmPattern === 'rapid_regular') rhythmTh = 'เต้นเร็วรัวและสม่ำเสมอเป็นจังหวะเป๊ะ (Rapid & Regular — สงสัย PSVT/VT)';
  else if (patient.palpitationRhythmPattern === 'rapid_irregular') rhythmTh = 'เต้นเร็วและไม่สม่ำเสมอเลย สะเปะสะปะ (Rapid & Irregular — สงสัย AF with RVR)';
  else if (patient.palpitationRhythmPattern === 'ectopic_skipped') rhythmTh = 'เต้นสะดุดเป็นครั้งคราว ตุ๊บๆ หายๆ (Skipped / Extra beats — สงสัย PVCs/PACs)';
  else if (patient.palpitationRhythmPattern === 'abnormally_slow') rhythmTh = 'เต้นช้ามากผิดปกติ จนเหนื่อยเพลีย (Abnormally Slow / Bradycardia)';
  else if (patient.palpitationRhythmPattern === 'forceful_normal_rate') rhythmTh = 'เต้นแรงขึ้น ตึกๆ ในอก อัตราเร็วปกติ (Forceful beats)';

  let onsetOffsetTh = patient.palpitationOnsetOffset === 'sudden_both'
    ? 'เริ่มต้นเต้นเร็วขึ้นทันที และหยุดทันทีเหมือนเปิด-ปิดสวิตช์ไฟ (Sudden Onset & Offset)'
    : (patient.palpitationOnsetOffset === 'gradual_both' ? 'ค่อยๆ เต้นเร็วขึ้นเรื่อยๆ และค่อยๆ ช้าลง (Gradual Onset & Offset)' : 'ไม่ระบุ');

  let triggerListTh = [];
  if (triggers.includes('valsalva_relieved')) triggerListTh.push('ทุเลาลงเมื่อกลั้นหายใจเบ่ง (Valsalva response)');
  if (triggers.includes('exertional')) triggerListTh.push('กำเริบขณะออกแรงหรือออกกำลังกาย');
  if (triggers.includes('rest_or_nocturnal')) triggerListTh.push('กำเริบขณะพักผ่อนหรือตื่นขึ้นมากลางดึก');
  if (triggers.includes('anxiety_panic')) triggerListTh.push('สัมพันธ์กับความวิตกกังวลหรือตกใจกลัว');

  let substText = 'ปฏิเสธสารกระตุ้น';
  if (substances.length > 0 && !substances.includes('none_substances')) {
    substText = substances.map(s => {
      if (s === 'energy_drinks') return 'เครื่องดื่มชูกำลัง';
      if (s === 'caffeine_heavy') return 'กาแฟ/ชาเข้มข้น';
      if (s === 'alcohol_binge') return 'ดื่มแอลกอฮอล์หนัก';
      if (s === 'cannabis_kratom') return 'กัญชา/กระท่อม';
      if (s === 'illicit_stimulants') return 'สารเสพติดกระตุ้นประสาท/ยาลดความอ้วน';
      return s;
    }).join(', ');
  }

  let medText = 'ปฏิเสธยาประจำตัวกลุ่มเสี่ยง';
  if (meds.length > 0 && !meds.includes('none_meds')) {
    medText = meds.map(m => {
      if (m === 'decongestants') return 'ยาลดน้ำมูก (Pseudoephedrine)';
      if (m === 'asthma_inhalers') return 'ยาพ่นขยายหลอดลม';
      if (m === 'thyroid_hormone') return 'ฮอร์โมนไทรอยด์';
      if (m === 'antiarrhythmics') return 'ยารักษาหัวใจเต้นผิดจังหวะ';
      if (m === 'diuretics') return 'ยาขับปัสสาวะ';
      return m;
    }).join(', ');
  }

  let cardHistText = 'ปฏิเสธประวัติโรคหัวใจเดิม';
  if (cardiacHistory.length > 0 && !cardiacHistory.includes('none_cardiac_pmh')) {
    cardHistText = cardiacHistory.map(c => {
      if (c === 'cad_stent') return 'โรคหลอดเลือดหัวใจตีบ/ใส่ขดลวด (CAD/Stent)';
      if (c === 'prior_arrhythmia') return 'ประวัติหัวใจเต้นผิดจังหวะเดิม';
      if (c === 'prior_ablation') return 'เคยสวนจี้ไฟฟ้าหัวใจ';
      if (c === 'heart_failure') return 'หัวใจล้มเหลว (Heart Failure)';
      if (c === 'valvular_disease') return 'โรคลิ้นหัวใจ/เปลี่ยนลิ้นเทียม';
      if (c === 'pacemaker_icd') return 'ใส่ Pacemaker หรือ ICD ในร่างกาย';
      return c;
    }).join(', ');
  }

  let famText = patient.palpitationFamilyHistory === 'sudden_death_under50'
    ? 'มีคนในครอบครัวสายตรงเสียชีวิตกะทันหันก่อนอายุ 50 ปี หรือใหลตาย (Positive Family History of SCD)'
    : 'ปฏิเสธประวัติคนในครอบครัวเสียชีวิตกะทันหันในวัยหนุ่มสาว';

  const hemodynIssues = [];
  if (warningSigns.includes('syncope')) hemodynIssues.push('วูบหมดสติ (Syncope) 🚩');
  if (warningSigns.includes('presyncope_dizziness')) hemodynIssues.push('หน้ามืดวิงเวียนทรงตัวไม่อยู่');
  if (warningSigns.includes('ischemic_chest_pain')) hemodynIssues.push('เจ็บแน่นหน้าอกรุนแรง 🚩');
  if (warningSigns.includes('acute_heart_failure')) hemodynIssues.push('หอบเหนื่อยนอนราบไม่ได้ 🚩');
  if (warningSigns.includes('cold_diaphoresis')) hemodynIssues.push('เหงื่อแตกตัวเย็นชืด 🚩');
  if (warningSigns.includes('altered_mental')) hemodynIssues.push('ซึมลง สับสน 🚩');
  const hemodynamicSummary = hemodynIssues.length > 0 ? hemodynIssues.join(', ') : 'คงที่ รู้สึกตัวดี ไม่มีหมดสติหรือแน่นหน้าอก';

  // Calculate Pertinent Positives and Negatives for Patient Review & Core Summary
  const positives = [];
  const negatives = [];

  // Warning signs (ACLS)
  if (warningSigns.includes('syncope')) positives.push('วูบหมดสติ (Syncope) 🚩');
  else negatives.push('ปฏิเสธวูบหมดสติ');

  if (warningSigns.includes('presyncope_dizziness')) positives.push('หน้ามืด วิงเวียน ตาพร่ามัว');
  else negatives.push('ไม่มีหน้ามืดวิงเวียน');

  if (warningSigns.includes('ischemic_chest_pain')) positives.push('เจ็บแน่นหน้าอกรุนแรง 🚩');
  else negatives.push('ปฏิเสธเจ็บแน่นหน้าอก');

  if (warningSigns.includes('acute_heart_failure')) positives.push('หายใจหอบเหนื่อย นอนราบไม่ได้ 🚩');
  else negatives.push('ปฏิเสธหายใจหอบเหนื่อย');

  if (warningSigns.includes('cold_diaphoresis')) positives.push('เหงื่อแตกท่วมตัว มือเท้าเย็นชืด 🚩');
  else negatives.push('ไม่มีเหงื่อแตกตัวเย็นชืด');

  if (warningSigns.includes('altered_mental')) positives.push('ซึมลง สับสน 🚩');
  else negatives.push('รู้สึกตัวดี ถามตอบรู้เรื่อง');

  if (warningSigns.includes('hyperventilation_tingling')) positives.push('มือเท้าชา หายใจเร็วตื้น นิ้วเกร็ง');

  const importantConditions = Array.isArray(patient.palpitationImportantConditions) ? patient.palpitationImportantConditions : [];
  if (importantConditions.includes('hyperthyroidism') || nonCardiac.includes('hyperthyroidism')) {
    positives.push('อาการเข้าได้กับภาวะไทรอยด์เป็นพิษ (มือสั่น/ขี้ร้อน/น้ำหนักลด) 🚩');
  }
  if (patient.otherSymptomsFree) {
    positives.push(patient.otherSymptomsFree);
  }

  patient.pertinentPositives = positives.length > 0 ? positives : ['ไม่มีอาการร่วมผิดปกติ'];
  patient.pertinentNegatives = negatives;

  const docNotes = patient.doctor_notes || {};
  const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ' || patient.currentMeds === 'ไม่มี') ? 'ไม่มี' : patient.currentMeds;
  const hospLabel = {
    complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
    additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
    self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
    unspecified: 'ไม่ได้ระบุ'
  }[patient.hospRecordStatus] || 'ไม่ได้ระบุ';

  // 1. Rapid Bullet Mode (Standardized: Primary arrhythmia descriptors at top, ACLS/associated signs in Pertinent only)
  const defaultRapid =
`[Chief Complaint (CC)]
ใจสั่น / หัวใจเต้นผิดจังหวะ (Palpitations) มา ${durationStr}

[History of Present Illness (HPI)]
• สถานะปัจจุบัน: ${statusTh}
• ลักษณะจังหวะการเต้น (Rhythm): ${rhythmTh}
• รูปแบบการเริ่มและหยุด (Onset/Offset): ${onsetOffsetTh}
• ปัจจัยกระตุ้น/บรรเทา: ${triggerListTh.join(', ') || 'ไม่มีสิ่งกระตุ้นจำเพาะ'}

• Pertinent Positives:
${positives.length > 0 ? positives.map(p => `  - ${p}`).join('\n') : '  - ไม่มีอาการร่วมอื่นที่เด่นชัด'}

• Pertinent Negatives:
${negatives.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• ประวัติโรคหัวใจเดิม: ${cardHistText}
• ประวัติครอบครัว (Sudden Death): ${famText}
• สารกระตุ้น/เครื่องดื่ม: ${substText}
• ยาประจำตัวกลุ่มเสี่ยง: ${medText}
• โรคประจำตัว (U/D): ${patient.underlying?.length > 0 ? patient.underlying.join(', ') : 'ปฏิเสธ'}
• ยาประจำตัว (Current Meds): ${medsText}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${patient.drugAllergy || 'ปฏิเสธ'}

[Emergency Risk Assessment (Red Flags)]
${rfs.length > 0
  ? `🚩 RED FLAGS DETECTED:\n${rfs.map(rf => `  * ${rf.textTh}`).join('\n')}`
  : '✓ ไม่พบสัญญาณเตือนวิกฤตเฉียบพลันเบื้องต้น'}

[Doctor's Clinical Addendum & Exam]
• ประวัติเพิ่มเติม/แก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}
• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}
• แผนการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

  // 2. Narrative Note Mode
  let narrative = `History of Present Illness (HPI):\n`;
  narrative += `ผู้ป่วย${patient.gender === 'หญิง' ? 'หญิง' : 'ชาย'}ไทย อายุ ${patient.age || '-'} ปี มาโรงพยาบาลด้วยอาการใจสั่น ${durationStr} ก่อนมาโรงพยาบาล `;
  narrative += `ลักษณะการเต้นของหัวใจคือ ${rhythmTh} โดย${onsetOffsetTh} `;
  
  if (patient.palpitationCurrentStatus === 'currently_ongoing') {
    narrative += `ขณะมาถึงห้องฉุกเฉินผู้ป่วยยังคงรู้สึกใจสั่นเต้นเร็วต่อเนื่องอยู่ตลอดเวลา `;
  } else {
    narrative += `อาการใจสั่นขณะนี้หยุดไปแล้วแต่มีอาการกำเริบเป็นๆ หายๆ `;
  }

  if (triggers.length > 0) {
    narrative += `มีประวัติเกี่ยวกับสิ่งกระตุ้นคือ ${triggerListTh.join(' และ ')} `;
  }

  const posWarn = [];
  if (warningSigns.includes('syncope')) posWarn.push('มีอาการวูบหมดสติ (Syncope)');
  if (warningSigns.includes('presyncope_dizziness')) posWarn.push('หน้ามืด วิงเวียน ตาพร่ามัว');
  if (warningSigns.includes('ischemic_chest_pain')) posWarn.push('เจ็บแน่นหน้าอกรุนแรง');
  if (warningSigns.includes('acute_heart_failure')) posWarn.push('หายใจหอบเหนื่อย นอนราบไม่ได้');
  if (warningSigns.includes('cold_diaphoresis')) posWarn.push('เหงื่อแตกท่วมตัว มือเท้าเย็นจัด');
  if (warningSigns.includes('altered_mental')) posWarn.push('ซึมลง สับสน');

  if (posWarn.length > 0) {
    narrative += `\nอาการร่วมที่ตรวจพบ: ผู้ป่วยมี ${posWarn.join(', ')} เข้าได้กับภาวะความไม่คงที่ของระบบไหลเวียนโลหิต `;
  } else {
    narrative += `\nอาการร่วม: ปฏิเสธอาการวูบหมดสติ หน้ามืด เจ็บแน่นหน้าอก หรือหายใจหอบเหนื่อย `;
  }

  narrative += `\n\nExposures & Medical History:\n`;
  narrative += `ประวัติการรับประทานสารกระตุ้น: ${substText}\n`;
  narrative += `ประวัติยาประจำตัว: ${medText}\n`;
  narrative += `ประวัติโรคหัวใจเดิม: ${cardHistText}\n`;
  narrative += `ประวัติครอบครัว: ${famText}`;

  // 3. JSON Schema v2.0
  const jsonSchema = {
    encounter: {
      chief_complaint: 'palpitations',
      chief_complaint_title_th: 'ใจสั่น',
      triage_category: 'emergency_medicine',
      calculated_triage_level: rfs.some(r => r.triageLevel === 1) ? 1 : (rfs.some(r => r.triageLevel === 2) ? 2 : 4),
      door_to_ekg_target_minutes: 10,
      entry_timestamp: patient.timestamp || new Date().toISOString()
    },
    clinical_assessment: {
      onset: {
        duration_value: patient.durationVal || null,
        duration_unit: patient.durationUnit || 'hours',
        currently_ongoing: patient.palpitationCurrentStatus === 'currently_ongoing',
        episode_frequency: patient.palpitationEpisodeFreq || 'unspecified',
        exact_onset_date: patient.palpitationOnsetExactDate || null,
        exact_onset_time: patient.palpitationOnsetExactTime || null
      },
      rhythm_profile: {
        perceived_rhythm: patient.palpitationRhythmPattern || null,
        onset_offset_pattern: patient.palpitationOnsetOffset || null,
        valsalva_responsive: triggers.includes('valsalva_relieved'),
        exertional_trigger: triggers.includes('exertional'),
        nocturnal_trigger: triggers.includes('rest_or_nocturnal')
      },
      hemodynamic_instability: {
        is_unstable: rfs.some(r => r.key === 'palpitation_rf_unstable_hemodynamics'),
        syncope: warningSigns.includes('syncope'),
        presyncope_dizziness: warningSigns.includes('presyncope_dizziness'),
        ischemic_chest_pain: warningSigns.includes('ischemic_chest_pain'),
        acute_heart_failure: warningSigns.includes('acute_heart_failure'),
        cold_diaphoresis: warningSigns.includes('cold_diaphoresis'),
        altered_mental_status: warningSigns.includes('altered_mental')
      },
      exposures_and_meds: {
        caffeine_or_energy_drinks: substances.includes('caffeine_heavy') || substances.includes('energy_drinks'),
        alcohol_binge: substances.includes('alcohol_binge'),
        sympathomimetic_illicit: substances.includes('illicit_stimulants'),
        takes_decongestants: meds.includes('decongestants'),
        takes_antiarrhythmics: meds.includes('antiarrhythmics'),
        suspected_custom_trigger: patient.palpitationCustomTriggerText || null
      },
      cardiac_history: {
        has_cad_stent: cardiacHistory.includes('cad_stent'),
        has_prior_arrhythmia: cardiacHistory.includes('prior_arrhythmia'),
        has_heart_failure: cardiacHistory.includes('heart_failure'),
        has_pacemaker_icd: cardiacHistory.includes('pacemaker_icd'),
        has_prior_ablation: cardiacHistory.includes('prior_ablation'),
        family_sudden_death: patient.palpitationFamilyHistory === 'sudden_death_under50'
      },
      red_flags: rfs.map(rf => ({
        id: rf.key,
        severity: rf.severity,
        title: rf.textTh,
        triage_level: rf.triageLevel
      }))
    }
  };

  // Render to Doctor dashboard DOM elements
  const rapidBox = document.getElementById('rapidTextView');
  if (rapidBox) rapidBox.value = patient.custom_rapid_note || defaultRapid;

  const narrativeBox = document.getElementById('narrativeTextView');
  if (narrativeBox) narrativeBox.value = patient.custom_narrative_note || narrative;

  const jsonBox = document.getElementById('jsonViewer');
  if (jsonBox) jsonBox.textContent = JSON.stringify(jsonSchema, null, 2);
}

// --- Module Registration ---
registerCcModule({
  id: 'palpitation',
  recordCc: 'palpitations',
  titleTh: 'ใจสั่น',
  sectionDomId: 'palpitationQuestionnaireSection',
  headerTh: 'แบบฟอร์มซักประวัติ: ใจสั่น (Palpitations / Cardiac Arrhythmia)',
  headerEn: '(Cardiac Arrhythmia & Hemodynamic Triage)',
  patientBadgeHtml: '<i data-lucide="activity" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-rose-500"></i><span class="whitespace-nowrap">ใจสั่น</span>',
  doctorCcBadgeHtml: '<i data-lucide="activity" class="w-3.5 h-3.5 mr-1 text-rose-500"></i> CC: ใจสั่น',
  pmhSectionNumber: 7,
  dateFields: ['palpitationOnsetExactDate'],
  timeFields: ['palpitationOnsetExactTime'],
  branchIds: ['palpitationCustomTriggerWrap', 'palpitationHeartSubWrap'],
  inputIdsToClear: ['palpitationDurationVal', 'palpitationOnsetExactDate', 'palpitationOnsetExactTime', 'palpitationCustomTriggerText', 'palpitation_other_free'],

  algorithm: {
    chiefComplaint: 'palpitations',
    titleTh: 'ใจสั่น',
    schemaCode: 'palpitations',
    version: '2.0.0',
    redFlagDefinitions: [
      { key: 'palpitation_rf_unstable_hemodynamics', level: 1, textTh: 'หัวใจเต้นผิดจังหวะร่วมกับระบบไหลเวียนโลหิตไม่คงที่ (Unstable Arrhythmia)' },
      { key: 'palpitation_rf_malignant_ventricular', level: 1, textTh: 'สงสัยภาวะหัวใจเต้นผิดจังหวะรุนแรงชนิดห้องล่าง (Suspected VT in CAD)' },
      { key: 'palpitation_rf_channelopathy_scd', level: 2, textTh: 'เสี่ยงต่อโรคหัวใจเต้นผิดจังหวะทางพันธุกรรม/ใหลตาย (Brugada / Long QT)' },
      { key: 'palpitation_rf_rapid_af_stroke', level: 2, textTh: 'สงสัยภาวะหัวใจห้องบนสั่นพลิ้วเต้นเร็ว (AF with RVR & Stroke Risk)' },
      { key: 'palpitation_rf_thyroid_storm', level: 2, textTh: 'สงสัยภาวะต่อมไทรอยด์เป็นพิษวิกฤต (Suspected Thyroid Storm)' },
      { key: 'palpitation_rf_sympathomimetic_toxicity', level: 2, textTh: 'ใจสั่นจากสารกระตุ้นประสาทซิมพาเทติก (Sympathomimetic Toxicity)' }
    ]
  },

  formHtml: `
    <div id="palpitationQuestionnaireSection" class="space-y-6 hidden">
      <!-- Card 1: Onset & Duration -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="clock" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">1. ระยะเวลาและสถานะอาการใจสั่น (Onset & Duration)</h2>
            <p class="text-xs text-slate-500">ประเมินระยะเวลาการเริ่มต้นและสถานะอาการใจสั่นในขณะนี้</p>
          </div>
        </div>
        <div class="space-y-5">
          <!-- 1.1 ระยะเวลาตั้งแต่เริ่มมีอาการ -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              ระยะเวลาตั้งแต่เริ่มมีอาการใจสั่นในรอบปัจจุบัน <span class="text-rose-500">*</span>
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div class="col-span-1 sm:col-span-2">
                <input type="number" id="palpitationDurationVal" min="1" max="1000" placeholder="เช่น 2" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm placeholder:text-slate-400 placeholder:font-normal">
              </div>
              <div class="col-span-1">
                <select id="palpitationDurationUnit" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm">
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

          <!-- 1.2 สถานะอาการใจสั่นในขณะนี้ -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              สถานะอาการใจสั่นในขณะนี้
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="palpitationCurrentStatus" value="currently_ongoing" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ขณะนี้ยังคงมีอาการใจสั่น เต้นเร็ว ต่อเนื่องตลอดเวลา</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="palpitationCurrentStatus" value="intermittent_resolved" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">อาการใจสั่นหยุดไปแล้ว แต่มีอาการกำเริบเป็นพักๆ</span>
              </label>
            </div>
          </div>

          <!-- 1.3 ความถี่ในการเกิดอาการ -->
          <div class="pt-3 border-t border-slate-100">
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              ความถี่ในการเกิดอาการใจสั่น
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="palpitationEpisodeFreq" value="first_time" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เพิ่งเป็นครั้งนี้เป็นครั้งแรกในชีวิต</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="palpitationEpisodeFreq" value="recent_days_intermittent" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เพิ่งเริ่มมีอาการภายในไม่กี่วันนี้ แต่เป็นๆ หายๆ</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="palpitationEpisodeFreq" value="daily" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีอาการบ่อยเกือบทุกวัน หรือวันละหลายครั้ง</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="palpitationEpisodeFreq" value="weekly" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีอาการสัปดาห์ละ 1–3 ครั้ง</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="palpitationEpisodeFreq" value="monthly" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีอาการเดือนละ 1–2 ครั้ง</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="palpitationEpisodeFreq" value="infrequent_yearly" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">นานๆ เป็นครั้งหนึ่ง (หลายเดือนหรือปีละ 1–2 ครั้ง)</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Universal Date & Time -->
        <div id="palpitationOnsetExactWrap" class="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">วันที่เริ่มมีอาการใจสั่น (Universal Date: วว/ดด/ปปปป)</label>
            <input type="text" id="palpitationOnsetExactDate" data-universal-date="true" placeholder="วว/ดด/ปปปป เช่น 26/10/2026" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">เวลาที่เริ่มมีอาการ (Universal Time 24-hr: ชช:นน)</label>
            <input type="text" id="palpitationOnsetExactTime" data-universal-time="true" placeholder="เช่น 10:15 (เวลา 24 ชม.)" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
          </div>
        </div>
      </div>

      <!-- Card 2: Rhythm Pattern & Characteristics -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="activity" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">2. รูปแบบและลักษณะของจังหวะหัวใจ (Pattern & Rhythm Characteristics)</h2>
            <p class="text-xs text-slate-500">ผู้ป่วยรู้สึกถึงลักษณะการเต้นของหัวใจแบบใดเด่นชัดที่สุด</p>
          </div>
        </div>
        
        <div class="space-y-2">
          <label class="selectable-card flex items-start p-3.5 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
            <input type="radio" name="palpitationRhythmPattern" value="rapid_regular" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
            <div class="ml-3">
              <span class="text-xs sm:text-sm font-semibold text-slate-800">เต้นเร็วรัวและสม่ำเสมอเป็นจังหวะเป๊ะ</span>
              <p class="text-[11px] text-slate-500 mt-0.5">รู้สึกเหมือนมีเสียงกลองรัวสม่ำเสมอในอก หรือหัวใจเต้นเร็วมากแบบไม่สะดุด</p>
            </div>
          </label>
          <label class="selectable-card flex items-start p-3.5 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
            <input type="radio" name="palpitationRhythmPattern" value="rapid_irregular" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
            <div class="ml-3">
              <span class="text-xs sm:text-sm font-semibold text-slate-800">เต้นเร็วและไม่สม่ำเสมอเลย</span>
              <p class="text-[11px] text-slate-500 mt-0.5">จังหวะกระโดดไปมา เต้นกระตุกสลับเบาบ้างแรงบ้าง สะเปะสะปะจับจังหวะไม่ได้</p>
            </div>
          </label>
          <label class="selectable-card flex items-start p-3.5 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
            <input type="radio" name="palpitationRhythmPattern" value="ectopic_skipped" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
            <div class="ml-3">
              <span class="text-xs sm:text-sm font-semibold text-slate-800">เต้นสะดุดเป็นครั้งคราว</span>
              <p class="text-[11px] text-slate-500 mt-0.5">รู้สึกเหมือนหัวใจหยุดเต้นไป 1 จังหวะแล้วเต้นแรงตามมา หรือมีจังหวะสะดุดเป็นพักๆ</p>
            </div>
          </label>
          <label class="selectable-card flex items-start p-3.5 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
            <input type="radio" name="palpitationRhythmPattern" value="abnormally_slow" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
            <div class="ml-3">
              <span class="text-xs sm:text-sm font-semibold text-slate-800">เต้นช้ามากผิดปกติ</span>
              <p class="text-[11px] text-slate-500 mt-0.5">รู้สึกหัวใจเต้นช้ามากจนหมดแรง เหนื่อยล้า อ่อนเพลีย</p>
            </div>
          </label>
          <label class="selectable-card flex items-start p-3.5 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
            <input type="radio" name="palpitationRhythmPattern" value="forceful_normal_rate" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
            <div class="ml-3">
              <span class="text-xs sm:text-sm font-semibold text-slate-800">เต้นแรงขึ้น ตึกๆ ในอก แต่อัตราเร็วยังดูปกติ</span>
              <p class="text-[11px] text-slate-500 mt-0.5">รู้สึกหัวใจเต้นกระทบผนังอกแรงขึ้น แต่ไม่ได้เต้นรัวเร็วผิดปกติ</p>
            </div>
          </label>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">รูปแบบการเริ่มและหยุดของอาการใจสั่น:</label>
            <div class="space-y-1.5">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="palpitationOnsetOffset" value="sudden_both" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เริ่มเต้นเร็วรัวทันที และหยุดทันที (เหมือนเปิด-ปิดสวิตช์ไฟ)</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="palpitationOnsetOffset" value="gradual_both" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ค่อยๆ เต้นเร็วขึ้นเรื่อยๆ และค่อยๆ ช้าลงช้าๆ</span>
              </label>
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">สิ่งกระตุ้นหรือท่าทางที่ส่งผลต่ออาการ (เลือกได้หลายข้อ):</label>
            <div class="space-y-1.5">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="palpitationTriggers" value="valsalva_relieved" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">หัวใจหยุดเต้นเร็วทันทีเมื่อกลั้นหายใจเบ่ง (Valsalva) หรือล้างหน้าน้ำเย็น</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="palpitationTriggers" value="exertional" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">อาการมักกำเริบขณะออกแรง ออกกำลังกาย หรือทำงานหนัก</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="palpitationTriggers" value="rest_or_nocturnal" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">อาการกำเริบขึ้นขณะนอนพักผ่อนเฉยๆ หรือสะดุ้งตื่นขึ้นมากลางดึก</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="palpitationTriggers" value="anxiety_panic" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">สัมพันธ์กับความวิตกกังวล ความเครียด หรือตกใจกลัวอย่างรุนแรง</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 3: Red Flags & Perfusion Signs -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="shield-alert" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">3. สัญญาณอันตรายและระบบไหลเวียนโลหิต (Red Flags & Perfusion Signs)</h2>
            <p class="text-xs text-slate-500">ผู้ป่วยมีอาการเตือนดังต่อไปนี้ร่วมด้วยหรือไม่ (เลือกได้มากกว่า 1 ข้อตามจริง)</p>
          </div>
        </div>
        
        <div class="space-y-2">
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
            <input type="checkbox" name="palpitationWarningSigns" value="presyncope_dizziness" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
            <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีอาการหน้ามืด วิงเวียนศีรษะ ตาพร่ามัว ทรงตัวไม่อยู่ (Pre-syncope / Lightheadedness)</span>
          </label>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
            <input type="checkbox" name="palpitationWarningSigns" value="syncope" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
            <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีอาการเป็นลม วูบหมดสติ หรือล้มพับไปชั่วขณะ (Syncope)</span>
          </label>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
            <input type="checkbox" name="palpitationWarningSigns" value="ischemic_chest_pain" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
            <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีอาการเจ็บแน่นหน้าอก (แน่นอึดอัด เหมือนมีของหนักทับ หายใจไม่สะดวก หรือร้าวไปกราม/แขน)</span>
          </label>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
            <input type="checkbox" name="palpitationWarningSigns" value="acute_heart_failure" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
            <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีอาการหายใจหอบเหนื่อยรุนแรง นอนราบไม่ได้ หรือตื่นขึ้นมาไอหอบเหนื่อยกลางดึก</span>
          </label>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
            <input type="checkbox" name="palpitationWarningSigns" value="cold_diaphoresis" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
            <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เหงื่อแตกท่วมตัว ตัวเย็นชืด ซีด หรือปลายมือปลายเท้าเย็นเฉียบ (Diaphoresis / Cold extremities)</span>
          </label>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
            <input type="checkbox" name="palpitationWarningSigns" value="altered_mental" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
            <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">รู้สึกซึมลง สับสน พูดคุยไม่รู้เรื่อง หรือตอบสนองช้าลง</span>
          </label>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
            <input type="checkbox" name="palpitationWarningSigns" value="hyperventilation_tingling" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
            <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีอาการมือเท้าชา หายใจเร็วตื้น นิ้วมือเกร็งจีบ</span>
          </label>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
            <input type="checkbox" name="palpitationWarningSigns" value="none_warning" onchange="handlePalpitationWarningNoneToggle(this)" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
            <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่มีอาการเหล่านี้เลย (สัญญาณชีพและระบบไหลเวียนปกติ)</span>
          </label>
        </div>
      </div>

      <!-- Card 4: Triggers, Beverages & Medications -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="coffee" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">4. สารกระตุ้น เครื่องดื่ม และประวัติการใช้ยา (Triggers & Medications)</h2>
            <p class="text-xs text-slate-500">ตรวจสอบคาเฟอีน ยาลดน้ำมูก เครื่องดื่มชูกำลัง และยาประจำตัว</p>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Stimulants & Beverages -->
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <label class="block text-xs font-semibold text-slate-800 mb-1.5">เครื่องดื่มหรือสารกระตุ้นในรอบ 24–48 ชม.:</label>
            <div class="space-y-1.5">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="palpitationSubstances" value="energy_drinks" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เครื่องดื่มชูกำลัง (เช่น M-150, กระทิงแดง, คาราบาว, Monster)</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="palpitationSubstances" value="caffeine_heavy" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">กาแฟสดเข้มข้น, ชาเข้มข้น, น้ำอัดลม หรือช็อกโกแลตปริมาณมาก</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="palpitationSubstances" value="alcohol_binge" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เครื่องดื่มแอลกอฮอล์ (เบียร์, เหล้า, ไวน์) หรือดื่มหนักติดต่อกัน</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="palpitationSubstances" value="cannabis_kratom" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">กัญชา, พืชกระท่อม หรือสารสกัดจากสมุนไพร</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="palpitationSubstances" value="illicit_stimulants" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ยาลดความอ้วน, ยาบ้า, ยาไอซ์ หรือสารกระตุ้นประสาท</span>
              </label>
              <label class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1 border-t border-slate-200">
                <input type="checkbox" name="palpitationSubstances" value="none_substances" onchange="handlePalpitationSubstancesNoneToggle(this)" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่ได้รับประทานสารหรือเครื่องดื่มกระตุ้นเหล่านี้</span>
              </label>
            </div>
          </div>

          <!-- Medications -->
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <label class="block text-xs font-semibold text-slate-800 mb-1.5">ประวัติการใช้ยาประจำตัว หรือยาที่เพิ่งได้รับ:</label>
            <div class="space-y-1.5">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="palpitationMeds" value="decongestants" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ยาแก้หวัด ยาลดน้ำมูกกลุ่ม Pseudoephedrine หรือ Phenylephrine</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="palpitationMeds" value="asthma_inhalers" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ยาพ่นขยายหลอดลมรักษาโรคหอบหืด/ถุงลมโป่งพอง (Salbutamol)</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="palpitationMeds" value="thyroid_hormone" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ยารักษาโรคต่อมไทรอยด์ หรือฮอร์โมนไทรอยด์ (Levothyroxine)</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="palpitationMeds" value="antiarrhythmics" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ยารักษาโรคหัวใจเต้นผิดจังหวะ (Amiodarone, Digoxin, Beta-blockers)</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="palpitationMeds" value="diuretics" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ยาขับปัสสาวะ (Furosemide, HCTZ - เสี่ยงต่อเกลือแร่ต่ำ)</span>
              </label>
              <label class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1 border-t border-slate-200">
                <input type="checkbox" name="palpitationMeds" value="none_meds" onchange="handlePalpitationMedsNoneToggle(this)" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่ได้รับประทานยากลุ่มเหล่านี้</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Custom trigger branch -->
        <div class="mt-3 pt-3 border-t border-slate-100">
          <label class="block text-xs font-medium text-slate-700 mb-1">มีประวัติการใช้ ยา อาหาร หรือสาร อื่นๆ ที่สงสัยว่าเป็นสาเหตุหรือไม่:</label>
          <div class="space-y-1">
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="palpitationCustomTriggerCheck" value="no_custom_trigger" onchange="handlePalpitationCustomTriggerChange('no_custom_trigger')" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
              <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่มี</span>
            </label>
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="palpitationCustomTriggerCheck" value="has_custom_trigger" onchange="handlePalpitationCustomTriggerChange('has_custom_trigger')" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
              <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มี (ระบุชื่อยา อาหาร หรือสารที่สงสัย)</span>
            </label>
          </div>
          <div id="palpitationCustomTriggerWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-3">
            <input type="text" id="palpitationCustomTriggerText" placeholder="ระบุชื่อยา อาหาร หรือสารที่สงสัย" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
          </div>
        </div>
      </div>

      <!-- Card 5: PMH & Family History -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="file-text" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">5. ประวัติโรคประจำตัวที่สำคัญ และประวัติครอบครัว (PMH & Family History)</h2>
            <p class="text-xs text-slate-500">ตรวจสอบประวัติโรคหัวใจ ไทรอยด์ และประวัติครอบครัวเสียชีวิตกะทันหัน</p>
          </div>
        </div>
        <div class="space-y-4">
          <!-- Important Chronic Conditions -->
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <label class="block text-xs font-semibold text-slate-800 mb-1.5">ประวัติโรคประจำตัวที่สำคัญ (เลือกได้ตามจริง):</label>
            <div class="space-y-2">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="palpitationImportantConditions" value="heart_disease" onchange="handlePalpitationHeartToggle(this)" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">โรคหัวใจ</span>
              </label>

              <!-- Heart Disease Sub-branch -->
              <div id="palpitationHeartSubWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-3 space-y-2">
                <label class="block text-[11px] font-semibold text-slate-800 mb-1">ระบุรายละเอียดโรคหัวใจเดิม:</label>
                <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="checkbox" name="palpitationCardiacHistory" value="cad_stent" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                  <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เคยมีประวัติโรคหลอดเลือดหัวใจตีบ หรือเคยใส่ขดลวดหัวใจ (CAD / Stent)</span>
                </label>
                <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="checkbox" name="palpitationCardiacHistory" value="prior_arrhythmia" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                  <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เคยได้รับการวินิจฉัยโรคหัวใจเต้นผิดจังหวะ (เช่น AF, SVT, VT)</span>
                </label>
                <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="checkbox" name="palpitationCardiacHistory" value="prior_ablation" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                  <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เคยได้รับการรักษาด้วยการสวนจี้ไฟฟ้าหัวใจ (Radiofrequency Catlation)</span>
                </label>
                <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="checkbox" name="palpitationCardiacHistory" value="heart_failure" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                  <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">โรคหัวใจล้มเหลว (Heart Failure) หรือหัวใจโต (Cardiomegaly)</span>
                </label>
                <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="checkbox" name="palpitationCardiacHistory" value="valvular_disease" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                  <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีโรคลิ้นหัวใจ หรือเคยผ่าตัดเปลี่ยนลิ้นหัวใจเทียม</span>
                </label>
                <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="checkbox" name="palpitationCardiacHistory" value="pacemaker_icd" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                  <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ใส่เครื่องกระตุ้นหัวใจ (Pacemaker) หรือเครื่องกระตุกไฟฟ้าหัวใจ (ICD) ในร่างกาย</span>
                </label>
              </div>

              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="palpitationImportantConditions" value="hyperthyroidism" onchange="handlePalpitationImportantItemChange(this)" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">โรคต่อมไทรอยด์ทำงานเกิน หรือคอพอกเป็นพิษ (Hyperthyroidism / Toxic Goiter)</span>
              </label>

              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="palpitationImportantConditions" value="diabetes" onchange="handlePalpitationImportantItemChange(this)" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">โรคเบาหวาน (เสี่ยงต่อน้ำตาลในเลือดต่ำ Hypoglycemia)</span>
              </label>

              <label class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1 border-t border-slate-200">
                <input type="checkbox" name="palpitationImportantConditions" value="none_important_pmh" onchange="handlePalpitationImportantNoneToggle(this)" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่มีโรคประจำตัวเหล่านี้</span>
              </label>
            </div>
            <p class="text-[11px] text-slate-400 mt-2">* โรคประจำตัวอื่นๆ สามารถระบุได้ในขั้นตอนถัดไป (ประวัติสุขภาพและยาประจำตัว)</p>
          </div>

          <!-- Family History -->
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <label class="block text-xs font-semibold text-slate-800 mb-1.5">ประวัติครอบครัวเกี่ยวกับการเสียชีวิตกะทันหัน:</label>
            <div class="space-y-1.5">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="palpitationFamilyHistory" value="sudden_death_under50" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีคนในครอบครัวสายตรง (พ่อ แม่ พี่ น้อง) เสียชีวิตกะทันหันก่อนอายุ 50 ปี หรือใหลตาย</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="palpitationFamilyHistory" value="no_family_sudden_death" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่มีประวัติคนในครอบครัวเสียชีวิตกะทันหันในวัยหนุ่มสาว</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 6: อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100">
          <div class="bg-slate-100 text-slate-600 p-2 rounded-xl">
            <i data-lucide="message-square-plus" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-800">6. อาการอื่น ๆ หรือข้อความเพิ่มเติมถึงแพทย์ (Additional Notes)</h2>
            <p class="text-xs text-slate-500">ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)</p>
          </div>
        </div>
        <textarea id="palpitation_other_free" rows="2" placeholder="ระบุอาการอื่นๆ เพิ่มเติม (ถ้ามี)..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500"></textarea>
      </div>
    </div>
  `,

  collectIntake: function(ctx) {
    const _rawDur = parseFloat(document.getElementById('palpitationDurationVal')?.value); const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
    const durationUnit = document.getElementById('palpitationDurationUnit')?.value || 'hours';

    const palpitationCurrentStatus = document.querySelector('input[name="palpitationCurrentStatus"]:checked')?.value || '';
    const palpitationEpisodeFreq = document.querySelector('input[name="palpitationEpisodeFreq"]:checked')?.value || '';
    const palpitationOnsetExactDate = document.getElementById('palpitationOnsetExactDate')?.value?.trim() || '';
    const palpitationOnsetExactTime = document.getElementById('palpitationOnsetExactTime')?.value?.trim() || '';

    const palpitationRhythmPattern = document.querySelector('input[name="palpitationRhythmPattern"]:checked')?.value || '';
    const palpitationOnsetOffset = document.querySelector('input[name="palpitationOnsetOffset"]:checked')?.value || '';
    const palpitationTriggers = Array.from(document.querySelectorAll('input[name="palpitationTriggers"]:checked')).map(el => el.value);

    const palpitationWarningSigns = Array.from(document.querySelectorAll('input[name="palpitationWarningSigns"]:checked')).map(el => el.value);
    const palpitationSubstances = Array.from(document.querySelectorAll('input[name="palpitationSubstances"]:checked')).map(el => el.value);
    const palpitationMeds = Array.from(document.querySelectorAll('input[name="palpitationMeds"]:checked')).map(el => el.value);

    const palpitationCustomTriggerCheck = document.querySelector('input[name="palpitationCustomTriggerCheck"]:checked')?.value || 'no_custom_trigger';
    const palpitationCustomTriggerText = document.getElementById('palpitationCustomTriggerText')?.value?.trim() || '';

    const palpitationImportantConditions = Array.from(document.querySelectorAll('input[name="palpitationImportantConditions"]:checked')).map(el => el.value);
    const palpitationCardiacHistory = Array.from(document.querySelectorAll('input[name="palpitationCardiacHistory"]:checked')).map(el => el.value);
    const palpitationNonCardiacHistory = palpitationImportantConditions.filter(c => c !== 'heart_disease');
    const palpitationFamilyHistory = document.querySelector('input[name="palpitationFamilyHistory"]:checked')?.value || 'no_family_sudden_death';
    const otherSymptomsFree = document.getElementById('palpitation_other_free')?.value?.trim() || ctx.otherSymptomsFree || '';

    return {
      id: ctx.recordId,
      queue_number: ctx.queueNumber,
      hn: ctx.randomHn,
      name: ctx.patientName,
      age: ctx.patientAge,
      gender: ctx.gender,
      chief_complaint: 'palpitation',
      chief_complaint_title: 'ใจสั่น',
      timestamp: new Date().toISOString(),
      status: ctx.recordStatus,
      durationVal,
      durationUnit,
      hospRecordStatus: ctx.hospRecordStatus,
      underlying: ctx.underlying,
      drugAllergy: ctx.drugAllergy,
      currentMeds: ctx.currentMeds,
      otherSymptomsFree,
      doctor_notes: ctx.preservedDoctorNotes,

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

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val !== undefined && val !== null ? val : '';
    };

    const setRadio = (name, val) => {
      if (!val) return;
      const el = document.querySelector(`input[name="${name}"][value="${val}"]`);
      if (el) el.checked = true;
    };

    setVal('palpitationDurationVal', patient.durationVal || '');
    setVal('palpitationDurationUnit', patient.durationUnit || 'hours');

    setRadio('palpitationCurrentStatus', patient.palpitationCurrentStatus);
    setRadio('palpitationEpisodeFreq', patient.palpitationEpisodeFreq);
    setVal('palpitationOnsetExactDate', patient.palpitationOnsetExactDate || '');
    setVal('palpitationOnsetExactTime', patient.palpitationOnsetExactTime || '');

    setRadio('palpitationRhythmPattern', patient.palpitationRhythmPattern);
    setRadio('palpitationOnsetOffset', patient.palpitationOnsetOffset);

    if (Array.isArray(patient.palpitationTriggers)) {
      patient.palpitationTriggers.forEach(val => {
        const el = document.querySelector(`input[name="palpitationTriggers"][value="${val}"]`);
        if (el) el.checked = true;
      });
    }

    if (Array.isArray(patient.palpitationWarningSigns)) {
      patient.palpitationWarningSigns.forEach(val => {
        const el = document.querySelector(`input[name="palpitationWarningSigns"][value="${val}"]`);
        if (el) el.checked = true;
      });
    }

    if (Array.isArray(patient.palpitationSubstances)) {
      patient.palpitationSubstances.forEach(val => {
        const el = document.querySelector(`input[name="palpitationSubstances"][value="${val}"]`);
        if (el) el.checked = true;
      });
    }

    if (Array.isArray(patient.palpitationMeds)) {
      patient.palpitationMeds.forEach(val => {
        const el = document.querySelector(`input[name="palpitationMeds"][value="${val}"]`);
        if (el) el.checked = true;
      });
    }

    setRadio('palpitationCustomTriggerCheck', patient.palpitationCustomTriggerCheck);
    setVal('palpitationCustomTriggerText', patient.palpitationCustomTriggerText || '');
    if (patient.palpitationCustomTriggerCheck === 'has_custom_trigger') {
      const wrap = document.getElementById('palpitationCustomTriggerWrap');
      if (wrap) wrap.classList.remove('hidden');
    }

    if (Array.isArray(patient.palpitationImportantConditions)) {
      patient.palpitationImportantConditions.forEach(val => {
        const el = document.querySelector(`input[name="palpitationImportantConditions"][value="${val}"]`);
        if (el) el.checked = true;
      });
      if (patient.palpitationImportantConditions.includes('heart_disease')) {
        const wrap = document.getElementById('palpitationHeartSubWrap');
        if (wrap) wrap.classList.remove('hidden');
      }
    } else {
      if (Array.isArray(patient.palpitationCardiacHistory) && patient.palpitationCardiacHistory.length > 0 && !patient.palpitationCardiacHistory.includes('none_cardiac_pmh')) {
        const hd = document.querySelector('input[name="palpitationImportantConditions"][value="heart_disease"]');
        if (hd) hd.checked = true;
        const wrap = document.getElementById('palpitationHeartSubWrap');
        if (wrap) wrap.classList.remove('hidden');
      }
      if (Array.isArray(patient.palpitationNonCardiacHistory)) {
        if (patient.palpitationNonCardiacHistory.includes('hyperthyroidism')) {
          const ht = document.querySelector('input[name="palpitationImportantConditions"][value="hyperthyroidism"]');
          if (ht) ht.checked = true;
        }
        if (patient.palpitationNonCardiacHistory.includes('diabetes')) {
          const dm = document.querySelector('input[name="palpitationImportantConditions"][value="diabetes"]');
          if (dm) dm.checked = true;
        }
      }
    }

    if (Array.isArray(patient.palpitationCardiacHistory)) {
      patient.palpitationCardiacHistory.forEach(val => {
        const el = document.querySelector(`input[name="palpitationCardiacHistory"][value="${val}"]`);
        if (el) el.checked = true;
      });
    }

    setRadio('palpitationFamilyHistory', patient.palpitationFamilyHistory);
    setVal('palpitation_other_free', patient.otherSymptomsFree || '');
  },

  populateForm: function(patient) {
    return this.hydrateForm(patient);
  },

  isRedFlag: function(patient) {
    return isPalpitationRedFlag(patient);
  },

  evaluateRedFlags: function(patient) {
    return evaluatePalpitationRedFlags(patient);
  },

  updateOutputs: function(patient) {
    updatePalpitationOutputs(patient);
  },

  generateCds: function(patient, { rfs, ddxList, workupList, managementList }) {
    if (!patient) return;

    const rhythm = patient.palpitationRhythmPattern || '';
    const warningSigns = Array.isArray(patient.palpitationWarningSigns) ? patient.palpitationWarningSigns : [];
    const cardiacHistory = Array.isArray(patient.palpitationCardiacHistory) ? patient.palpitationCardiacHistory : [];
    const substances = Array.isArray(patient.palpitationSubstances) ? patient.palpitationSubstances : [];
    const nonCardiac = Array.isArray(patient.palpitationNonCardiacHistory) ? patient.palpitationNonCardiacHistory : [];

    // 1. Differential Diagnoses
    if (rfs.some(r => r.key === 'palpitation_rf_unstable_hemodynamics')) {
      ddxList.push('1. 🚨 Unstable Tachyarrhythmia (Monomorphic Ventricular Tachycardia vs Fast PSVT with Hemodynamic Collapse)');
      ddxList.push('2. Acute Coronary Syndrome (STEMI / NSTEMI with secondary malignant arrhythmia)');
      ddxList.push('3. Cardiogenic Shock secondary to Acute Heart Failure');
    } else if (rhythm === 'rapid_regular') {
      if (cardiacHistory.includes('cad_stent') || cardiacHistory.includes('heart_failure')) {
        ddxList.push('1. Ventricular Tachycardia (VT) in Structural Heart Disease / Prior Myocardial Infarction');
        ddxList.push('2. Supraventricular Tachycardia with Aberrancy (SVT with BBB)');
      } else {
        ddxList.push('1. Paroxysmal Supraventricular Tachycardia (PSVT — AVNRT / AVRT / WPW Syndrome)');
        ddxList.push('2. Atrial Flutter with 2:1 Regular AV Conduction');
        ddxList.push('3. Sinus Tachycardia secondary to fever, dehydration, or anxiety');
      }
    } else if (rhythm === 'rapid_irregular') {
      ddxList.push('1. Atrial Fibrillation (AF) with Rapid Ventricular Response (RVR)');
      ddxList.push('2. Atrial Flutter with Variable AV Block');
      ddxList.push('3. Multifocal Atrial Tachycardia (MAT — มักพบในผู้ป่วย COPD/โรคปอดเรื้อรัง)');
    } else if (rhythm === 'ectopic_skipped') {
      ddxList.push('1. Frequent Premature Ventricular Contractions (PVCs) / Premature Atrial Contractions (PACs)');
      ddxList.push('2. Electrolyte Imbalance-induced ectopy (Hypokalemia, Hypomagnesemia)');
    } else if (rhythm === 'abnormally_slow') {
      ddxList.push('1. High-Grade Atrioventricular Block (Mobitz Type II / Complete Heart Block)');
      ddxList.push('2. Sick Sinus Syndrome (Sinus Bradycardia / Sinus Arrest / Tachy-Brady Syndrome)');
      ddxList.push('3. Drug-induced Bradycardia (Beta-blockers, Non-DHP CCB, Digoxin toxicity)');
    } else {
      if (substances.includes('energy_drinks') || substances.includes('caffeine_heavy')) {
        ddxList.push('1. Stimulant-Induced Sinus Tachycardia (Caffeine / Energy Drink / Sympathomimetic)');
      } else if (warningSigns.includes('hyperventilation_tingling')) {
        ddxList.push('1. Panic Attack / Hyperventilation Syndrome with Sinus Tachycardia');
      } else {
        ddxList.push('1. Sinus Tachycardia / Benign Palpitations');
      }
    }

    // 2. Workup Investigations
    workupList.push('Stat 12-Lead EKG bedside within 10 minutes (Door-to-EKG <= 10 min benchmark)');
    workupList.push('Continuous Cardiac Telemetry Monitor with non-invasive BP & Pulse Oximetry');
    workupList.push('Stat Electrolytes (Potassium K+, Magnesium Mg2+, Sodium, Calcium)');
    workupList.push('Cardiac Biomarkers: High-Sensitivity Troponin-T / Troponin-I and CBC, BUN, Cr');
    if (nonCardiac.includes('hyperthyroidism') || rhythm === 'rapid_irregular') {
      workupList.push('Thyroid Function Test: Stat Free T3, Free T4, TSH');
    }
    if (patient.palpitationFamilyHistory === 'sudden_death_under50') {
      workupList.push('High-Precordial Leads EKG (V1-V2 in 2nd and 3rd intercostal spaces) to screen for Brugada pattern');
    }

    // 3. Management
    if (rfs.some(r => r.key === 'palpitation_rf_unstable_hemodynamics')) {
      managementList.push('Resuscitation: ย้ายเข้าห้อง Resuscitation, ให้ออกซิเจน, เตรียม Synchronized Cardioversion (เริ่ม 100-200 Joules) ทันที');
      managementList.push('เตรียมยากลุ่ม Sedative (Midazolam / Fentanyl) สำหรับ Synchronized Cardioversion หากผู้ป่วยยังรู้สึกตัว');
    } else if (rhythm === 'rapid_regular') {
      managementList.push('Vagal Maneuvers: สอน Modified Valsalva Maneuver (เป่า syringe 10 mL นาน 15 วินาทีแล้วยกขาสูง 45 องศา)');
      managementList.push('Pharmacologic Cardioversion: IV Adenosine 6 mg rapid push with 20 mL NSS flush (เพิ่มเป็น 12 mg หากไม่ตอบสนอง)');
    } else if (rhythm === 'rapid_irregular') {
      managementList.push('Rate Control: IV Metoprolol 2.5-5 mg หรือ IV Diltiazem 0.25 mg/kg bolus (ระวังในภาวะ Heart Failure หรือความดันต่ำ)');
      managementList.push('Anticoagulation assessment: คำนวณ CHA2DS2-VASc Score เพื่อพิจารณา NOAC/Warfarin ป้องกันลิ่มเลือดอุดตัน');
    }
    if (substances.includes('illicit_stimulants') || substances.includes('energy_drinks')) {
      managementList.push('Sedation: IV Diazepam 5-10 mg เพื่อลด Sympathetic stimulation (หลีกเลี่ยง Beta-blocker เดี่ยวๆ)');
    }
    managementList.push('Consult: ปรึกษาอายุรแพทย์โรคหัวใจ (Cardiologist) หรือ CCU Fellow ด่วน');
  },

  seedPatients: [
    {
      id: 'case-140',
      queue_number: 'Q-001',
      hn: '6714012',
      name: 'นายเกียรติศักดิ์ มั่นคง',
      age: 62,
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
