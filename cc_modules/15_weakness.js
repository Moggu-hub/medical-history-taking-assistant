// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 15_weakness.js
// อาการนำ: อ่อนเพลีย / กินไม่ได้ / ไม่มีแรง (Generalized Weakness / Failure to Thrive & Occult Sepsis Triage)
// ไฟล์นี้แยกอิสระสำหรับอาการนำ weakness เพื่อให้ทีมแพทย์และ IT โรงพยาบาลนำไปพัฒนาต่อได้โดยไม่กระทบระบบหลัก
// =========================================================================

// --- UI Toggle Handlers ---
function handleWeaknessWarningNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="weaknessWarningSigns"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleWeaknessInfectionNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="weaknessInfectionSigns"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleWeaknessGiAnemiaNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="weaknessGiAnemiaSigns"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleWeaknessMedsNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="weaknessCurrentMedsList"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleWeaknessFoodIntakeChange(val) {
  const wrap = document.getElementById('weaknessFoodSubWrap');
  if (wrap) {
    if (val === 'reduced') {
      wrap.classList.remove('hidden');
    } else {
      wrap.classList.add('hidden');
      document.querySelectorAll('input[name="weaknessFoodSubLevel"]').forEach(r => { r.checked = false; });
    }
  }
}

function handleWeaknessCustomSubstanceChange(val) {
  const wrap = document.getElementById('weaknessCustomSubstanceWrap');
  if (wrap) {
    if (val === 'has_custom_substance') {
      wrap.classList.remove('hidden');
    } else {
      wrap.classList.add('hidden');
      const inp = document.getElementById('weaknessCustomSubstanceText');
      if (inp) inp.value = '';
    }
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

  const steroidHistory = patient.weaknessSteroidHistory || '';
  const takesSteroidOrHerbal = steroidHistory === 'steroid_withdrawal';

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
      suggestedAction: 'Triage Level 1/2: เข้าสู่แนวทาง Sepsis Fast-Track ทันที, ส่ง Stat Hemoculture 2 ขวด และตรวจ CBC, BUN, Cr, Electrolytes, Lactate, Urine Analysis, เปิดเส้น IV และเริ่ม IV Crystalloid Resuscitation 30 mL/kg หากมีความดันตกหรือ Lactate >= 4, ให้ยาปฏิชีวนะครอบคลุม (Empiric IV Antibiotics) ภายใน 1 ชั่วโมงแรก (Sepsis Hour-1 Bundle)'
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
      suggestedAction: 'ตรวจหาระดับน้ำตาลปลายนิ้ว (Stat DTX / Bedside Glucose) ทันที, หาก DTX < 70 mg/dL: ให้ 50% Glucose 50 mL IV Push ทันที, เฝ้าระวังอาการน้ำตาลต่ำซ้ำซ้อน โดยเฉพาะผู้ที่ใช้ยากลุ่ม Sulfonylurea หรือ Insulin'
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
      suggestedAction: 'ส่ง Stat Cortisol, ACTH, Electrolytes (มักพบ Na+ ต่ำ และ K+ สูง), Blood Sugar, ให้ IV Fluid Resuscitation ด้วย D5NSS, ให้ IV Hydrocortisone 100 mg stat ทันที โดยไม่ต้องรอผลตรวจเลือด'
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
      suggestedAction: 'ตรวจ Stat BUN, Cr, Electrolytes เพื่อประเมินการทำงานของไตและเกลือแร่, ตรวจ EKG 12 leads เฝ้าระวังคลื่นไฟฟ้าหัวใจผิดปกติจากเกลือแร่ผิดปกติ, ให้สารน้ำ IV Fluid Replacement อย่างเหมาะสมตามสถานะทางหัวใจ'
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
      suggestedAction: 'ตรวจ Stat EKG 12 leads ภายใน 10 นาที, ส่ง Stat Troponin-T และประเมินซ้ำ, ติด Cardiac Monitor เฝ้าระวัง Tachy/Bradyarrhythmias'
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
      suggestedAction: 'Activate Stroke Fast-Track ทันที, ส่ง Stat Non-contrast CT Brain ด่วนที่สุด, ประเมินข้อบ่งชี้และข้อห้ามใช้ยาละลายลิ่มเลือด (IV rtPA)'
    });
  } else if (focalNeuro === 'ascending_paralysis') {
    flags.push({
      key: 'weakness_rf_focal_stroke',
      textTh: 'ตรวจพบอาการอ่อนแรงจากปลายเท้าไล่ขึ้นมา สงสัยกลุ่มอาการ Guillain-Barré (Acute Ascending Paralysis)',
      risk: 'อาการแขนขาอ่อนแรงเริ่มจากปลายเท้าไล่ขึ้นมาที่มือและลำตัวอย่างรวดเร็ว เสี่ยงต่อกล้ามเนื้อหายใจล้มเหลว',
      triageLevel: 1,
      severity: 'CRITICAL',
      suggestedAction: 'ประเมิน Single Breath Count และ Vital Capacity ทันที, เฝ้าระวังภาวะ Respiratory failure, ส่งตรวจ Electrolytes และปรึกษาอายุรแพทย์ประสาทวิทยา'
    });
  }

  return flags;
}

// --- Outputs Updater (Rapid, Narrative, JSON Schema) ---
function updateWeaknessOutputs(patient) {
  if (!patient) return;

  const rfs = evaluateWeaknessRedFlags(patient);
  const warningSigns = Array.isArray(patient.weaknessWarningSigns) ? patient.weaknessWarningSigns : [];
  const infectionSigns = Array.isArray(patient.weaknessInfectionSigns) ? patient.weaknessInfectionSigns : [];
  const giAnemiaSigns = Array.isArray(patient.weaknessGiAnemiaSigns) ? patient.weaknessGiAnemiaSigns : [];
  const medsList = Array.isArray(patient.weaknessCurrentMedsList) ? patient.weaknessCurrentMedsList : [];

  const unitMapTh = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durationStr = patient.durationVal ? `${patient.durationVal} ${unitMapTh[patient.durationUnit] || patient.durationUnit || 'วัน'}` : 'ไม่ระบุ';

  let onsetTh = 'ไม่ระบุ';
  if (patient.weaknessOnsetPattern === 'sudden') onsetTh = 'เกิดขึ้นฉับพลันทันที (ภายในไม่กี่นาทีถึงชั่วโมง)';
  else if (patient.weaknessOnsetPattern === 'acute_rapid') onsetTh = 'เกิดขึ้นอย่างรวดเร็ว (ทรุดลงภายใน 1-2 วัน)';
  else if (patient.weaknessOnsetPattern === 'chronic_gradual') onsetTh = 'ค่อยๆ เป็นมากขึ้นเรื่อยๆ ต่อเนื่องหลายวันถึงสัปดาห์';
  else if (patient.weaknessOnsetPattern === 'chronic_intermittent') onsetTh = 'มีอาการเป็นๆ หายๆ อ่อนเพลียเรื้อรังมานาน';

  let onsetExactStr = '';
  if (patient.weaknessOnsetExactDate || patient.weaknessOnsetExactTime) {
    onsetExactStr = ` (ระบุเวลาเริ่ม: ${patient.weaknessOnsetExactDate || '-'} ${patient.weaknessOnsetExactTime || '-'})`;
  }

  let baselineTh = 'ช่วยเหลือตัวเองได้ปกติ';
  if (patient.weaknessBaselineFunctional === 'needs_assistance') baselineTh = 'เดิมเดินได้แต่ต้องมีคนช่วยพยุง/ใช้อุปกรณ์ช่วยเดิน';
  else if (patient.weaknessBaselineFunctional === 'wheelchair_bound') baselineTh = 'เดิมนั่งได้บนเตียง/รถเข็น แต่เดินไม่ได้';
  else if (patient.weaknessBaselineFunctional === 'bedbound') baselineTh = 'เดิมเป็นผู้ป่วยนอนติดเตียงอยู่แล้ว (Bed-bound)';
  else if (patient.weaknessBaselineFunctional === 'independent') baselineTh = 'เดิมเดินได้ปกติและช่วยเหลือตัวเองได้ดี';

  let currentTh = 'ทำกิจวัตรได้เองแต่อ่อนเพลีย';
  if (patient.weaknessCurrentFunctional === 'fatigued_mobile') currentTh = 'พอลุกเดินได้เอง แต่อ่อนเพลียเหนื่อยล้ากว่าเดิม';
  else if (patient.weaknessCurrentFunctional === 'needs_assistance') currentTh = 'เดินไม่ค่อยไหว ขาสั่น ต้องมีคนช่วยพยุงตลอดเวลา';
  else if (patient.weaknessCurrentFunctional === 'bedbound') currentTh = 'ลุกไม่ไหว เดินไม่ได้ ต้องนอนบนเตียงตลอดเวลา';
  else if (patient.weaknessCurrentFunctional === 'unresponsive') currentTh = 'ซึมลงมาก ปลุกไม่ค่อยตื่น หรือไม่ตอบสนอง';

  let foodTh = 'ทานได้ปกติ';
  if (patient.weaknessFoodIntake === 'none') foodTh = 'กินอาหารไม่ได้เลยแม้แต่คำเดียว ไม่ยอมกลืนอาหารเลย';
  else if (patient.weaknessFoodIntake === 'reduced') {
    if (patient.weaknessFoodSubLevel === 'reduced_mild') foodTh = 'เบื่ออาหารแต่ทานได้ใกล้เคียงเดิม (> 75%)';
    else if (patient.weaknessFoodSubLevel === 'reduced_moderate') foodTh = 'ทานได้ประมาณครึ่งหนึ่งของมื้อปกติ (~50%)';
    else if (patient.weaknessFoodSubLevel === 'reduced_severe') foodTh = 'ทานได้น้อยลงมากผิดปกติ ไม่เกิน 1-2 คำ (< 25%)';
    else foodTh = 'เบื่ออาหาร ทานได้น้อยลง';
  }

  let drinkTh = 'ดื่มน้ำได้ตามปกติ';
  if (patient.weaknessDrinkStatus === 'minimal_dry') drinkTh = 'ดื่มน้ำได้น้อยมาก ปากแห้ง คอแห้ง ลิ้นแตกแห้ง';
  else if (patient.weaknessDrinkStatus === 'none_or_vomit') drinkTh = 'ดื่มน้ำไม่ได้เลย จิบแล้วสำลักหรืออาเจียนออกหมด';

  let urineTh = 'ปริมาณปกติ';
  if (patient.weaknessUrineOutput === 'oliguria_dark') urineTh = 'ปัสสาวะออกน้อยมากผิดปกติ สีเหลืองเข้มจัด';
  else if (patient.weaknessUrineOutput === 'anuria_gte8h') urineTh = 'ไม่มีปัสสาวะออกเลย นานเกิน 8–12 ชั่วโมง';
  else if (patient.weaknessUrineOutput === 'unnoticed') urineTh = 'ไม่ได้สังเกต';

  let neuroTh = 'ไม่มีอาการอ่อนแรงเฉพาะที่';
  if (patient.weaknessFocalNeuro === 'unilateral_weakness') neuroTh = 'แขนหรือขาข้างใดข้างหนึ่งยกไม่ขึ้น ปากเบี้ยว พูดไม่ชัด (Focal Neurologic Deficit / Stroke Mimic)';
  else if (patient.weaknessFocalNeuro === 'generalized_symmetric') neuroTh = 'แขนขาไม่มีแรงทั้งสองข้างเท่าๆ กัน ปฏิเสธปากเบี้ยว ปฏิเสธชาครึ่งซีก (Symmetric Weakness)';
  else if (patient.weaknessFocalNeuro === 'ascending_paralysis') neuroTh = 'อ่อนแรงเริ่มจากปลายเท้าไล่ขึ้นมาที่มือและลำตัวอย่างรวดเร็ว (Ascending Paralysis / GBS suspect)';
  else if (patient.weaknessFocalNeuro === 'no_motor_weakness') neuroTh = 'ไม่มีอาการแขนขาอ่อนแรงชัดเจน เพียงแต่อ่อนเพลียเหนื่อยล้าทั้งตัว';

  const infThs = [];
  if (infectionSigns.includes('urti')) infThs.push('น้ำมูก/เจ็บคอ/ครั่นเนื้อครั่นตัว (URTI)');
  if (infectionSigns.includes('uti')) infThs.push('ปัสสาวะแสบขัด/ขุ่น/มีกลิ่นเหม็นผิดปกติ (Suspected UTI/Urosepsis)');
  if (infectionSigns.includes('pneumonia')) infThs.push('ไอมีเสมหะเหลืองเขียว/หายใจครืดคราด (Suspected Pneumonia)');

  const warnThs = [];
  if (warningSigns.includes('altered_mental')) warnThs.push('ซึมลงมาก/สับสน/ปลุกตื่นยาก');
  if (warningSigns.includes('tachypnea')) warnThs.push('หายใจหอบเร็ว/หายใจเหนื่อยลึก');
  if (warningSigns.includes('syncope_orthostasis')) warnThs.push('หน้ามืด/วูบหมดสติขณะพยายามลุกยืน');
  if (warningSigns.includes('cold_diaphoresis')) warnThs.push('เหงื่อแตกท่วมตัว/ตัวเย็นชืด/มือเท้าเย็น');
  if (warningSigns.includes('fever_hypothermia')) warnThs.push('ไข้สูงหรือตัวเย็นจัดผิดปกติ');
  if (warningSigns.includes('chest_tightness')) warnThs.push('แน่นอึดอัดกลางหน้าอก/จุกคอหอย');

  const steroidTh = patient.weaknessSteroidHistory === 'steroid_withdrawal'
    ? 'มีประวัติรับประทานยาชุด/ยาหม้อ/ยาสมุนไพรลูกกลอน/สเตียรอยด์แก้ปวดเมื่อย แล้วเพิ่งหยุดยาไป (High Risk Adrenal Crisis)'
    : 'ปฏิเสธประวัติการใช้ยาสเตียรอยด์และยาลูกกลอน';

  const medsThs = [];
  if (medsList.includes('diabetic_meds')) medsThs.push('ยารักษาโรคเบาหวาน (Sulfonylurea/Insulin - Risk of Hypoglycemia)');
  if (medsList.includes('diuretics')) medsThs.push('ยาขับปัสสาวะ (Furosemide/HCTZ - Risk of Electrolyte Imbalance/Dehydration)');
  if (medsList.includes('cardiac_meds')) medsThs.push('ยารักษาโรคหัวใจ (Digoxin/Amiodarone - Risk of Digoxin Toxicity)');
  if (medsList.includes('sedatives')) medsThs.push('ยานอนหลับ/ยากล่อมประสาท');

  // Calculate Pertinent Positives and Negatives for Patient Review & Core Summary
  const positives = [];
  const negatives = [];

  // Warning signs
  if (warningSigns.includes('altered_mental')) positives.push('ซึมลงมาก ปลุกตื่นยาก สับสน 🚩');
  else negatives.push('ปฏิเสธซึมลงสับสน');

  if (warningSigns.includes('tachypnea')) positives.push('หายใจหอบเร็ว/หายใจเหนื่อยลึก 🚩');
  else negatives.push('ปฏิเสธหายใจหอบเร็ว');

  if (warningSigns.includes('syncope_orthostasis')) positives.push('หน้ามืด วูบหมดสติขณะลุกยืน 🚩');
  else negatives.push('ปฏิเสธหน้ามืดหรือวูบหมดสติ');

  if (warningSigns.includes('cold_diaphoresis')) positives.push('เหงื่อแตกท่วมตัว มือเท้าเย็นจัด 🚩');
  else negatives.push('ไม่มีเหงื่อแตกตัวเย็นชืด');

  if (warningSigns.includes('fever_hypothermia')) positives.push('ไข้สูง หรือตัวเย็นจัด 🚩');
  if (warningSigns.includes('chest_tightness')) positives.push('แน่นอึดอัดกลางหน้าอก 🚩');
  else negatives.push('ปฏิเสธแน่นหน้าอก');

  // Focal neuro
  if (patient.weaknessFocalNeuro === 'unilateral_weakness') {
    positives.push('แขนขาอ่อนแรงครึ่งซีก / ปากเบี้ยว / พูดไม่ชัด 🚩');
  } else if (patient.weaknessFocalNeuro === 'ascending_paralysis') {
    positives.push('แขนขาอ่อนแรงไล่จากล่างขึ้นบน 🚩');
  } else if (patient.weaknessFocalNeuro === 'generalized_symmetric') {
    positives.push('แขนขาไม่มีแรงทั้งสองข้างเท่ากัน');
  } else {
    negatives.push('ไม่มีแขนขาอ่อนแรงครึ่งซีก ปากไม่เบี้ยว');
  }

  // Infection signs
  if (infectionSigns.includes('uti')) positives.push('ปัสสาวะแสบขัด/ขุ่น 🚩');
  if (infectionSigns.includes('pneumonia')) positives.push('ไอมีเสมหะ/หายใจครืดคราด 🚩');
  if (infectionSigns.includes('urti')) positives.push('น้ำมูก/เจ็บคอ');

  // GI / Anemia
  if (giAnemiaSigns.includes('melena_hematochezia')) positives.push('ถ่ายดำ/ถ่ายเป็นเลือด 🚩');
  if (giAnemiaSigns.includes('pallor')) positives.push('ผิว/เยื่อบุตาซีดลงมาก');
  if (giAnemiaSigns.includes('nausea_vomiting')) positives.push('คลื่นไส้อาเจียน');
  if (giAnemiaSigns.includes('weight_loss')) positives.push('น้ำหนักลดรวดเร็ว');

  if (patient.weaknessCustomSubstanceCheck === 'has_custom_substance' && patient.weaknessCustomSubstanceText) {
    positives.push(`สงสัยการได้รับสาร/ยา: ${patient.weaknessCustomSubstanceText}`);
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

  // 1. Rapid Bullet Mode (Standardized: Primary weakness/functional/intake descriptors at top, associated signs in Pertinent only)
  const defaultRapid =
`[Chief Complaint (CC)]
อ่อนเพลีย / กินไม่ได้ / ไม่มีแรง (Generalized Weakness) มา ${durationStr}

[History of Present Illness (HPI)]
• รูปแบบการเริ่มมีอาการ: ${onsetTh}${onsetExactStr}
• ความสามารถทางกายภาพ: เดิม (${baselineTh}) ➔ ปัจจุบัน (${currentTh})
• การรับประทานอาหารและน้ำ: อาหาร (${foodTh}), น้ำ (${drinkTh}), ปัสสาวะ (${urineTh})

• Pertinent Positives:
${positives.length > 0 ? positives.map(p => `  - ${p}`).join('\n') : '  - ไม่มีอาการร่วมอื่นที่เด่นชัด'}

• Pertinent Negatives:
${negatives.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• ประวัติการใช้ยาสเตียรอยด์/ยาลูกกลอน: ${steroidTh}
• ยาประจำตัวกลุ่มเสี่ยงสูง: ${medsThs.length > 0 ? medsThs.join(', ') : 'ไม่มีกลุ่มยาเสี่ยงสูง'}
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

  // 2. NARRATIVE NOTE
  let narrative = `ผู้ป่วย${patient.gender || ''} อายุ ${patient.age || '-'} ปี `;
  if (Array.isArray(patient.underlying) && patient.underlying.length > 0) {
    narrative += `มีโรคประจำตัวได้แก่ ${patient.underlying.join(', ')} `;
  } else {
    narrative += `ไม่มีโรคประจำตัว `;
  }
  narrative += `มารับบริการที่ห้องฉุกเฉินด้วยอาการอ่อนเพลีย กินไม่ได้ หรือไม่มีแรง ระยะเวลาประมาณ ${durationStr} ก่อนมาโรงพยาบาล `;
  narrative += `รูปแบบการเริ่มมีอาการ: ${onsetTh}${onsetExactStr} `;

  narrative += `การเปลี่ยนแปลงของความสามารถทางกายภาพ: ${baselineTh} ปัจจุบันเปลี่ยนเป็น ${currentTh} `;
  narrative += `ด้านการรับประทานอาหาร: ${foodTh} ด้านการดื่มน้ำ: ${drinkTh} และการขับถ่ายปัสสาวะ: ${urineTh} `;

  if (warnThs.length > 0) {
    narrative += `ผู้ป่วยมีอาการเตือนอันตรายร่วม ได้แก่ ${warnThs.join(', ')} `;
  } else {
    narrative += `ปฏิเสธอาการซึม สับสน หายใจหอบเหนื่อย หน้ามืดเป็นลม หรือเหงื่อแตกตัวเย็น `;
  }

  narrative += `การตรวจคัดกรองระบบประสาท: ${neuroTh} `;

  if (infThs.length > 0) {
    narrative += `พบอาการร่วมที่สงสัยการติดเชื้อ ได้แก่ ${infThs.join(', ')} `;
  }

  if (giAnemiaSigns.length > 0 && !giAnemiaSigns.includes('none_gi_anemia')) {
    const giThs = [];
    if (giAnemiaSigns.includes('nausea_vomiting')) giThs.push('คลื่นไส้อาเจียน');
    if (giAnemiaSigns.includes('constipation')) giThs.push('ท้องผูกไม่ถ่ายหลายวัน');
    if (giAnemiaSigns.includes('melena_hematochezia')) giThs.push('ถ่ายดำหรือถ่ายเป็นเลือด');
    if (giAnemiaSigns.includes('pallor')) giThs.push('ผิวหรือเยื่อบุตาซีดลงมาก');
    if (giAnemiaSigns.includes('weight_loss')) giThs.push('น้ำหนักลดรวดเร็ว');
    narrative += `อาการทางระบบทางเดินอาหารและภาวะซีด: ${giThs.join(', ')} `;
  }

  narrative += `ประวัติด้านยา: ${steroidTh} `;
  if (patient.currentMeds) {
    narrative += `ยาเดิมประจำตัว: ${patient.currentMeds} `;
  }
  if (patient.weaknessCustomSubstanceCheck === 'has_custom_substance' && patient.weaknessCustomSubstanceText) {
    narrative += `ประวัติสารหรือยาที่สงสัย: ${patient.weaknessCustomSubstanceText} `;
  }

  if (rfs.length > 0) {
    narrative += `\n\nการประเมินสัญญาณวิกฤตห้องฉุกเฉิน: ตรวจพบ ${rfs.map(r => r.textTh).join(', ')}`;
  } else {
    narrative += `\n\nการประเมินสัญญาณวิกฤตห้องฉุกเฉิน: อาการทั่วไปคงที่ ไม่พบสัญญาณวิกฤตที่ต้องช่วยชีวิตเร่งด่วน`;
  }

  // 3. JSON SCHEMA v2.0
  const jsonSchema = {
    encounter: {
      chief_complaint: 'generalized_weakness',
      chief_complaint_title_th: 'อ่อนเพลีย / กินไม่ได้ / ไม่มีแรง',
      triage_category: 'emergency_medicine',
      calculated_triage_level: rfs.length > 0 ? Math.min(...rfs.map(r => r.triageLevel)) : 4,
      entry_timestamp: new Date().toISOString()
    },
    clinical_assessment: {
      onset: {
        duration_value: patient.durationVal || null,
        duration_unit: patient.durationUnit || 'days',
        onset_pattern: patient.weaknessOnsetPattern || null,
        exact_onset_date: patient.weaknessOnsetExactDate || null,
        exact_onset_time: patient.weaknessOnsetExactTime || null
      },
      functional_trajectory: {
        baseline: patient.weaknessBaselineFunctional || null,
        current: patient.weaknessCurrentFunctional || null,
        bedbound_or_unresponsive: patient.weaknessCurrentFunctional === 'bedbound' || patient.weaknessCurrentFunctional === 'unresponsive'
      },
      intake_and_hydration: {
        food_intake: patient.weaknessFoodIntake || null,
        food_intake_sublevel: patient.weaknessFoodSubLevel || null,
        fluid_intake: patient.weaknessDrinkStatus || null,
        urine_output: patient.weaknessUrineOutput || null,
        anuria_gte8h: patient.weaknessUrineOutput === 'anuria_gte8h'
      },
      neurologic_and_perfusion: {
        focal_neurologic_deficit: patient.weaknessFocalNeuro === 'unilateral_weakness',
        ascending_paralysis: patient.weaknessFocalNeuro === 'ascending_paralysis',
        altered_mental: warningSigns.includes('altered_mental'),
        tachypnea: warningSigns.includes('tachypnea'),
        syncope_or_orthostasis: warningSigns.includes('syncope_orthostasis'),
        cold_diaphoresis: warningSigns.includes('cold_diaphoresis'),
        fever_or_hypothermia: warningSigns.includes('fever_hypothermia'),
        chest_tightness: warningSigns.includes('chest_tightness')
      },
      infection_screening: {
        suspected_urti: infectionSigns.includes('urti'),
        suspected_uti: infectionSigns.includes('uti'),
        suspected_pneumonia: infectionSigns.includes('pneumonia')
      },
      associated_gi_and_anemia: {
        nausea_vomiting: giAnemiaSigns.includes('nausea_vomiting'),
        melena_or_hematochezia: giAnemiaSigns.includes('melena_hematochezia'),
        marked_pallor: giAnemiaSigns.includes('pallor'),
        rapid_weight_loss: giAnemiaSigns.includes('weight_loss')
      },
      medications_and_substances: {
        steroid_or_herbal_bolus_use: patient.weaknessSteroidHistory === 'steroid_withdrawal',
        takes_diabetic_meds: medsList.includes('diabetic_meds'),
        takes_diuretics: medsList.includes('diuretics'),
        takes_cardiac_meds: medsList.includes('cardiac_meds'),
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
  id: 'weakness',
  recordCc: 'generalized_weakness',
  titleTh: 'อ่อนเพลีย / กินไม่ได้ / ไม่มีแรง',
  sectionDomId: 'weaknessQuestionnaireSection',
  headerTh: 'แบบฟอร์มซักประวัติ: อ่อนเพลีย / กินไม่ได้ / ไม่มีแรง (Generalized Weakness / Fatigue / Poor Intake)',
  headerEn: '(Failure to Thrive, Occult Sepsis & Metabolic Triage)',
  patientBadgeHtml: '<i data-lucide="battery-low" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-amber-500"></i><span class="whitespace-nowrap">อ่อนเพลีย / กินไม่ได้ / ไม่มีแรง</span>',
  doctorCcBadgeHtml: '<i data-lucide="battery-low" class="w-3.5 h-3.5 mr-1 text-amber-500"></i> CC: อ่อนเพลีย / กินไม่ได้ / ไม่มีแรง',
  pmhSectionNumber: 7,
  dateFields: ['weaknessOnsetExactDate'],
  timeFields: ['weaknessOnsetExactTime'],
  branchIds: ['weaknessFoodSubWrap', 'weaknessCustomSubstanceWrap'],
  inputIdsToClear: ['weaknessDurationVal', 'weaknessOnsetExactDate', 'weaknessOnsetExactTime', 'weaknessCustomSubstanceText', 'weakness_other_free'],

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
      <!-- Card 1: Onset, Duration & Functional Base -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="clock" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">1. ระยะเวลาและลักษณะการเริ่มมีอาการ (Onset, Duration & Functional Base)</h2>
            <p class="text-xs text-slate-500">ประเมินระยะเวลาการเริ่มต้น รูปแบบการอ่อนแรง และระดับความสามารถเดิม</p>
          </div>
        </div>
        <div class="space-y-5">
          <!-- 1.1 ระยะเวลาตั้งแต่เริ่มมีอาการ -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              ระยะเวลาตั้งแต่เริ่มมีอาการอ่อนเพลียรอบนี้ <span class="text-rose-500">*</span>
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div class="col-span-1 sm:col-span-2">
                <input type="number" id="weaknessDurationVal" min="1" max="1000" placeholder="เช่น 2" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm placeholder:text-slate-400 placeholder:font-normal">
              </div>
              <div class="col-span-1">
                <select id="weaknessDurationUnit" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm">
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

          <!-- 1.2 รูปแบบการเริ่มมีอาการ -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              รูปแบบการเริ่มมีอาการ
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="weaknessOnsetPattern" value="sudden" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เกิดขึ้นฉับพลันทันที (ทรุดลงใน 1–2 ชม.)</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="weaknessOnsetPattern" value="acute_rapid" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เกิดขึ้นอย่างรวดเร็ว (ทรุดลงภายใน 1–2 วันนี้)</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="weaknessOnsetPattern" value="chronic_gradual" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ค่อยๆ เป็นมากขึ้นต่อเนื่องมาหลายวันถึงสัปดาห์</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="weaknessOnsetPattern" value="chronic_intermittent" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีอาการเป็นๆ หายๆ อ่อนเพลียเรื้อรังมาหลายเดือน</span>
              </label>
            </div>
          </div>

          <!-- 1.3 ความสามารถในการทำกิจวัตรเดิมก่อนป่วย -->
          <div class="pt-3 border-t border-slate-100">
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              ความสามารถในการทำกิจวัตรเดิมก่อนป่วย (Baseline Functional Status)
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="weaknessBaselineFunctional" value="independent" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เดิมเดินได้ปกติและช่วยเหลือตัวเองได้ดี</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="weaknessBaselineFunctional" value="needs_assistance" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เดิมเดินได้แต่ต้องมีคนช่วยพยุง หรือใช้อุปกรณ์ช่วยเดิน</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="weaknessBaselineFunctional" value="wheelchair_bound" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เดิมนั่งได้บนเตียงหรือรถเข็น แต่เดินไม่ได้</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="weaknessBaselineFunctional" value="bedbound" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เดิมเป็นผู้ป่วยนอนติดเตียงอยู่แล้ว (Bed-bound)</span>
              </label>
            </div>
          </div>

          <!-- 1.4 สภาพร่างกายและความสามารถในปัจจุบัน -->
          <div class="pt-3 border-t border-slate-100">
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              สภาพร่างกายและความสามารถในปัจจุบัน (Current Functional Status)
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="weaknessCurrentFunctional" value="fatigued_mobile" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ยังพอลุกเดินได้เอง แต่อ่อนเพลียเหนื่อยล้ากว่าเดิม</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="weaknessCurrentFunctional" value="needs_assistance" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เดินไม่ค่อยไหว ขาสั่น ต้องมีคนช่วยพยุงตลอดเวลา</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="weaknessCurrentFunctional" value="bedbound" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ลุกไม่ไหว เดินไม่ได้ ต้องนอนอยู่บนเตียงตลอดเวลา</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="weaknessCurrentFunctional" value="unresponsive" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ซึมลงมาก ปลุกไม่ค่อยตื่น หรือไม่ตอบสนองต่อคนดูแล</span>
              </label>
            </div>
          </div>

          <!-- 1.5 วันที่และเวลาที่เริ่มสังเกตเห็นอาการ -->
          <div class="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">วันที่เริ่มสังเกตเห็นอาการ (Universal Date: วว/ดด/ปปปป)</label>
              <input type="text" id="weaknessOnsetExactDate" placeholder="วว/ดด/ปปปป เช่น 26/10/2026" data-universal-date="true" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">เวลาที่เริ่มสังเกตเห็นอาการ (Universal Time 24-hr: ชช:นน)</label>
              <input type="text" id="weaknessOnsetExactTime" placeholder="เช่น 10:15 (เวลา 24 ชม.)" data-universal-time="true" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
            </div>
          </div>
        </div>
      </div>

      <!-- Card 2: Intake & Hydration Status -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="droplet" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">2. การรับประทานอาหาร น้ำดื่ม และปัสสาวะ (Intake & Hydration Status)</h2>
            <p class="text-xs text-slate-500">ประเมินการดื่มน้ำ การรับประทานอาหาร และปริมาณการขับถ่ายปัสสาวะ</p>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">ความสามารถในการรับประทานอาหารในรอบ 24–48 ชั่วโมงที่ผ่านมา</label>
            <div class="space-y-1.5">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="weaknessFoodIntake" value="normal" onchange="handleWeaknessFoodIntakeChange('normal')" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ทานได้ปกติ ไม่เบื่ออาหาร</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="weaknessFoodIntake" value="reduced" onchange="handleWeaknessFoodIntakeChange('reduced')" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เบื่ออาหาร หรือทานได้น้อยลง</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="weaknessFoodIntake" value="none" onchange="handleWeaknessFoodIntakeChange('none')" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">กินอาหารไม่ได้เลยแม้แต่คำเดียว หรือไม่ยอมกลืนอาหารเลย</span>
              </label>
            </div>

            <!-- Subwrap: Food intake reduced levels -->
            <div id="weaknessFoodSubWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-3 space-y-2">
              <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">ระดับความสามารถในการทานอาหารที่ลดลง:</label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="weaknessFoodSubLevel" value="reduced_mild" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เบื่ออาหาร แต่ยังทานได้ใกล้เคียงเดิม (> 75% ของมื้อปกติ)</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="weaknessFoodSubLevel" value="reduced_moderate" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ทานได้น้อยลงปานกลาง (ทานได้ประมาณครึ่งหนึ่งของมื้อปกติ ~50%)</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="weaknessFoodSubLevel" value="reduced_severe" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ทานได้น้อยลงมากผิดปกติ (ทานได้ไม่เกิน 1–2 คำ หรือน้อยกว่า 25%)</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">การดื่มน้ำและของเหลว</label>
            <div class="space-y-1.5">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="weaknessDrinkStatus" value="normal" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ยังดื่มน้ำหรือของเหลวได้ตามปกติ</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="weaknessDrinkStatus" value="minimal_dry" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ดื่มน้ำได้น้อยมาก ปากแห้ง คอแห้ง ลิ้นแตกแห้ง</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="weaknessDrinkStatus" value="none_or_vomit" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ดื่มน้ำไม่ได้เลย จิบน้ำแล้วสำลัก หรืออาเจียนออกหมด</span>
              </label>
            </div>

            <div class="mt-3 pt-3 border-t border-slate-100">
              <label class="block text-xs font-medium text-slate-700 mb-1">ปริมาณปัสสาวะและการขับถ่าย</label>
              <div class="space-y-1.5">
                <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="radio" name="weaknessUrineOutput" value="normal" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                  <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ปัสสาวะออกปริมาณปกติ</span>
                </label>
                <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="radio" name="weaknessUrineOutput" value="oliguria_dark" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                  <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ปัสสาวะออกน้อยมากผิดปกติ และมีสีเหลืองเข้มจัด</span>
                </label>
                <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="radio" name="weaknessUrineOutput" value="anuria_gte8h" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                  <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่มีปัสสาวะออกเลย หรือไม่ปัสสาวะเลยนานเกิน 8–12 ชั่วโมง</span>
                </label>
                <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="radio" name="weaknessUrineOutput" value="unnoticed" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                  <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่ได้สังเกต</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 3: Red Flags & Neurologic Screen -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="shield-alert" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">3. สัญญาณเตือนอันตรายและระบบประสาท (Red Flags & Neurologic Screen)</h2>
            <p class="text-xs text-slate-500">คัดกรองภาวะหลอดเลือดสมองเฉียบพลัน กลืนลำบาก และอาการชาครึ่งซีก</p>
          </div>
        </div>

        <label class="block text-xs font-medium text-slate-700 mb-1">สัญญาณอันตรายร่วมระดับวิกฤต (เลือกได้หลายข้อหากมี):</label>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
            <input type="checkbox" name="weaknessWarningSigns" value="altered_mental" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
            <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ซึมลงมาก ปลุกตื่นยาก สับสน เพ้อ หรือตอบสนองช้าลงอย่างเห็นได้ชัด</span>
          </label>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
            <input type="checkbox" name="weaknessWarningSigns" value="tachypnea" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
            <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">หายใจหอบเร็ว หายใจเหนื่อยลึก หรือดูเหนื่อยหายใจลำบาก</span>
          </label>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
            <input type="checkbox" name="weaknessWarningSigns" value="syncope_orthostasis" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
            <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">หน้ามืด วิงเวียน ตาพร่ามัว เป็นลม หรือวูบหมดสติขณะพยายามลุกยืน</span>
          </label>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
            <input type="checkbox" name="weaknessWarningSigns" value="cold_diaphoresis" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
            <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เหงื่อแตกท่วมตัว ตัวเย็นชืด มือและเท้าเย็นจัด หรือปลายมือปลายเท้าซีดเผือด</span>
          </label>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
            <input type="checkbox" name="weaknessWarningSigns" value="fever_hypothermia" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
            <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีไข้สูง หนาวสั่นสะท้าน หรือตัวเย็นจัดผิดปกติ</span>
          </label>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
            <input type="checkbox" name="weaknessWarningSigns" value="chest_tightness" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
            <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">แน่นอึดอัดกลางหน้าอก หรือรู้สึกเหนื่อยจุกคอหอย</span>
          </label>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
            <input type="checkbox" name="weaknessWarningSigns" value="none_warning" onchange="handleWeaknessWarningNoneToggle(this)" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
            <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่มีอาการเตือนอันตรายเหล่านี้เลย</span>
          </label>
        </div>

        <div class="pt-4 border-t border-slate-100">
          <label class="block text-xs font-medium text-slate-700 mb-1">การตรวจคัดกรองอาการทางระบบประสาทเฉพาะที่ (Neurologic Differential Screen):</label>
          <div class="space-y-1.5">
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="weaknessFocalNeuro" value="unilateral_weakness" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
              <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีอาการแขนหรือขาข้างใดข้างหนึ่งยกไม่ขึ้น, ปากเบี้ยว, หรือพูดไม่ชัดร่วมด้วย</span>
            </label>
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="weaknessFocalNeuro" value="generalized_symmetric" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
              <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีอาการแขนขาไม่มีแรงทั้งสองข้างเท่าๆ กัน แต่ไม่มีปากเบี้ยว และไม่มีชาครึ่งซีก</span>
            </label>
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="weaknessFocalNeuro" value="ascending_paralysis" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
              <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีอาการแขนขาอ่อนแรงเริ่มจากปลายเท้าไล่ขึ้นมาที่มือและลำตัวอย่างรวดเร็ว</span>
            </label>
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="weaknessFocalNeuro" value="no_motor_weakness" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
              <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่มีอาการแขนขาอ่อนแรงชัดเจน เพียงแต่อ่อนเพลียเหนื่อยล้าทั้งตัว</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Card 4: Associated Systemic Symptoms -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="activity" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">4. อาการผิดปกติร่วมในระบบอื่นๆ (Associated Systemic Symptoms)</h2>
            <p class="text-xs text-slate-500">ตรวจสอบไข้ การหายใจเหนื่อย ปวดเมื่อย และอาการทางระบบอื่นๆ</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">อาการร่วมในระบบทางเดินปัสสาวะและทางเดินหายใจ (คัดกรองการติดเชื้อ):</label>
            <div class="space-y-1.5">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="weaknessInfectionSigns" value="urti" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีน้ำมูก, เจ็บคอ, หรือครั่นเนื้อครั่นตัว</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="weaknessInfectionSigns" value="uti" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ปัสสาวะแสบขัด, ปัสสาวะขุ่น, หรือปัสสาวะมีกลิ่นเหม็นผิดปกติ</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="weaknessInfectionSigns" value="pneumonia" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีอาการไอ, มีเสมหะสีเหลืองเขียว, หรือหายใจมีเสียงดังครืดคราดในคอ</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="weaknessInfectionSigns" value="none_infection" onchange="handleWeaknessInfectionNoneToggle(this)" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่มีอาการเหล่านี้</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">อาการร่วมในระบบทางเดินอาหารและภาวะซีด:</label>
            <div class="space-y-1.5">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="weaknessGiAnemiaSigns" value="nausea_vomiting" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีอาการคลื่นไส้ หรืออาเจียนติดต่อกันหลายครั้ง</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="weaknessGiAnemiaSigns" value="constipation" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ท้องผูก ไม่ถ่ายอุจจาระและไม่ผายลมติดต่อกันหลายวัน</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="weaknessGiAnemiaSigns" value="melena_hematochezia" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ถ่ายอุจจาระเป็นสีดำเหนียวยางมะตอย หรือถ่ายเป็นเลือดสด</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="weaknessGiAnemiaSigns" value="pallor" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">สังเกตเห็นว่าผิวซีดลงมาก หรือเยื่อบุตาซีดขาวผิดปกติ</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="weaknessGiAnemiaSigns" value="weight_loss" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">น้ำหนักตัวลดลงฮวบฮาบอย่างรวดเร็วโดยไม่ได้ตั้งใจ</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="weaknessGiAnemiaSigns" value="none_gi_anemia" onchange="handleWeaknessGiAnemiaNoneToggle(this)" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่มีอาการเหล่านี้</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 5: Meds, Steroids & Suspected Substances -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="alert-triangle" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">5. ประวัติยา สเตียรอยด์ และสารต้องสงสัย (Meds, Steroids & Suspected Substances)</h2>
            <p class="text-xs text-slate-500">ตรวจสอบยาลดความดัน ยาขับปัสสาวะ สเตียรอยด์ และยาชุดสมุนไพร</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">ประวัติการใช้ยาสเตียรอยด์และยาลูกกลอน:</label>
            <div class="space-y-1.5">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="weaknessSteroidHistory" value="steroid_withdrawal" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีประวัติรับประทานยาชุด, ยาหม้อ, ยาสมุนไพรลูกกลอน, หรือยาสเตียรอยด์ (เช่น Prednisolone, Dexamethasone) แก้ปวดเมื่อยต่อเนื่อง แล้วเพิ่งหยุดยาไป</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="weaknessSteroidHistory" value="none_steroid" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่มีประวัติใช้ยาสเตียรอยด์ ยาชุด หรือยาลูกกลอน</span>
              </label>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-100">
              <label class="block text-xs font-medium text-slate-700 mb-1">ประวัติการใช้ ยา อาหาร หรือสาร อื่นๆ ที่สงสัยว่าเป็นสาเหตุ:</label>
              <div class="space-y-1.5">
                <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="radio" name="weaknessCustomSubstanceCheck" value="no_custom_substance" onchange="handleWeaknessCustomSubstanceChange('no_custom_substance')" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                  <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่มี</span>
                </label>
                <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="radio" name="weaknessCustomSubstanceCheck" value="has_custom_substance" onchange="handleWeaknessCustomSubstanceChange('has_custom_substance')" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                  <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีประวัติยา อาหาร หรือสารที่สงสัย</span>
                </label>
              </div>

              <div id="weaknessCustomSubstanceWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-3">
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">ระบุชื่อยา อาหาร หรือสารที่สงสัย:</label>
                <input type="text" id="weaknessCustomSubstanceText" placeholder="เช่น ยาสมุนไพร ยาต้ม ยาชุด..." class="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
              </div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">ประวัติยาประจำตัวอื่นๆ ที่ใช้อยู่ในปัจจุบัน:</label>
            <div class="space-y-1.5">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="weaknessCurrentMedsList" value="diabetic_meds" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ยารักษาโรคเบาหวาน (ทั้งชนิดยากินลดน้ำตาล หรือยาฉีดอินซูลิน)</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="weaknessCurrentMedsList" value="diuretics" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ยาขับปัสสาวะ (เช่น Furosemide, HCTZ)</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="weaknessCurrentMedsList" value="cardiac_meds" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ยารักษาโรคหัวใจ (เช่น Digoxin, Amiodarone)</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="weaknessCurrentMedsList" value="sedatives" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ยานอนหลับ ยาคลายเครียด หรือยากล่อมประสาท</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="weaknessCurrentMedsList" value="none_meds" onchange="handleWeaknessMedsNoneToggle(this)" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่ได้รับประทานยากลุ่มเหล่านี้</span>
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
        <textarea id="weakness_other_free" rows="2" placeholder="ระบุอาการอื่นๆ เพิ่มเติม (ถ้ามี)..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500"></textarea>
      </div>
    </div>
  `,

  collectIntake: function(ctx) {
    const _rawDur = parseFloat(document.getElementById('weaknessDurationVal')?.value); const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
    const durationUnit = document.getElementById('weaknessDurationUnit')?.value || 'days';

    const weaknessOnsetPattern = document.querySelector('input[name="weaknessOnsetPattern"]:checked')?.value || '';
    const weaknessOnsetExactDate = document.getElementById('weaknessOnsetExactDate')?.value?.trim() || '';
    const weaknessOnsetExactTime = document.getElementById('weaknessOnsetExactTime')?.value?.trim() || '';

    const weaknessBaselineFunctional = document.querySelector('input[name="weaknessBaselineFunctional"]:checked')?.value || '';
    const weaknessCurrentFunctional = document.querySelector('input[name="weaknessCurrentFunctional"]:checked')?.value || '';

    const weaknessFoodIntake = document.querySelector('input[name="weaknessFoodIntake"]:checked')?.value || '';
    const weaknessFoodSubLevel = document.querySelector('input[name="weaknessFoodSubLevel"]:checked')?.value || '';
    const weaknessDrinkStatus = document.querySelector('input[name="weaknessDrinkStatus"]:checked')?.value || '';
    const weaknessUrineOutput = document.querySelector('input[name="weaknessUrineOutput"]:checked')?.value || '';

    const weaknessWarningSigns = Array.from(document.querySelectorAll('input[name="weaknessWarningSigns"]:checked')).map(el => el.value);
    const weaknessFocalNeuro = document.querySelector('input[name="weaknessFocalNeuro"]:checked')?.value || '';

    const weaknessInfectionSigns = Array.from(document.querySelectorAll('input[name="weaknessInfectionSigns"]:checked')).map(el => el.value);
    const weaknessGiAnemiaSigns = Array.from(document.querySelectorAll('input[name="weaknessGiAnemiaSigns"]:checked')).map(el => el.value);

    const weaknessSteroidHistory = document.querySelector('input[name="weaknessSteroidHistory"]:checked')?.value || '';
    const weaknessCurrentMedsList = Array.from(document.querySelectorAll('input[name="weaknessCurrentMedsList"]:checked')).map(el => el.value);
    const weaknessCustomSubstanceCheck = document.querySelector('input[name="weaknessCustomSubstanceCheck"]:checked')?.value || '';
    const weaknessCustomSubstanceText = document.getElementById('weaknessCustomSubstanceText')?.value?.trim() || '';

    return {
      id: ctx.recordId,
      queue_number: ctx.queueNumber,
      hn: ctx.randomHn,
      name: ctx.patientName,
      age: ctx.patientAge,
      gender: ctx.gender,
      chief_complaint: 'weakness',
      chief_complaint_title: 'อ่อนเพลีย / กินไม่ได้ / ไม่มีแรง',
      timestamp: new Date().toISOString(),
      status: ctx.recordStatus,
      durationVal,
      durationUnit,
      hospRecordStatus: ctx.hospRecordStatus,
      underlying: ctx.underlying,
      drugAllergy: ctx.drugAllergy,
      currentMeds: ctx.currentMeds,
      otherSymptomsFree: document.getElementById('weakness_other_free')?.value?.trim() || ctx.otherSymptomsFree || '',
      doctor_notes: ctx.preservedDoctorNotes,

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
      weaknessGiAnemiaSigns,
      weaknessSteroidHistory,
      weaknessCurrentMedsList,
      weaknessCustomSubstanceCheck,
      weaknessCustomSubstanceText
    };
  },

  populateForm: function(patient) {
    if (!patient) return;

    const durVal = document.getElementById('weaknessDurationVal');
    if (durVal) durVal.value = patient.durationVal || '';

    const durUnit = document.getElementById('weaknessDurationUnit');
    if (durUnit) durUnit.value = patient.durationUnit || 'days';

    const onDate = document.getElementById('weaknessOnsetExactDate');
    if (onDate) onDate.value = patient.weaknessOnsetExactDate || '';

    const onTime = document.getElementById('weaknessOnsetExactTime');
    if (onTime) onTime.value = patient.weaknessOnsetExactTime || '';

    if (patient.weaknessOnsetPattern) {
      const r = document.querySelector(`input[name="weaknessOnsetPattern"][value="${patient.weaknessOnsetPattern}"]`);
      if (r) r.checked = true;
    }

    if (patient.weaknessBaselineFunctional) {
      const r = document.querySelector(`input[name="weaknessBaselineFunctional"][value="${patient.weaknessBaselineFunctional}"]`);
      if (r) r.checked = true;
    }

    if (patient.weaknessCurrentFunctional) {
      const r = document.querySelector(`input[name="weaknessCurrentFunctional"][value="${patient.weaknessCurrentFunctional}"]`);
      if (r) r.checked = true;
    }

    if (patient.weaknessFoodIntake) {
      const r = document.querySelector(`input[name="weaknessFoodIntake"][value="${patient.weaknessFoodIntake}"]`);
      if (r) {
        r.checked = true;
        handleWeaknessFoodIntakeChange(patient.weaknessFoodIntake);
      }
    }

    if (patient.weaknessFoodSubLevel) {
      const r = document.querySelector(`input[name="weaknessFoodSubLevel"][value="${patient.weaknessFoodSubLevel}"]`);
      if (r) r.checked = true;
    }

    if (patient.weaknessDrinkStatus) {
      const r = document.querySelector(`input[name="weaknessDrinkStatus"][value="${patient.weaknessDrinkStatus}"]`);
      if (r) r.checked = true;
    }

    if (patient.weaknessUrineOutput) {
      const r = document.querySelector(`input[name="weaknessUrineOutput"][value="${patient.weaknessUrineOutput}"]`);
      if (r) r.checked = true;
    }

    if (Array.isArray(patient.weaknessWarningSigns)) {
      document.querySelectorAll('input[name="weaknessWarningSigns"]').forEach(cb => {
        cb.checked = patient.weaknessWarningSigns.includes(cb.value);
      });
    }

    if (patient.weaknessFocalNeuro) {
      const r = document.querySelector(`input[name="weaknessFocalNeuro"][value="${patient.weaknessFocalNeuro}"]`);
      if (r) r.checked = true;
    }

    if (Array.isArray(patient.weaknessInfectionSigns)) {
      document.querySelectorAll('input[name="weaknessInfectionSigns"]').forEach(cb => {
        cb.checked = patient.weaknessInfectionSigns.includes(cb.value);
      });
    }

    if (Array.isArray(patient.weaknessGiAnemiaSigns)) {
      document.querySelectorAll('input[name="weaknessGiAnemiaSigns"]').forEach(cb => {
        cb.checked = patient.weaknessGiAnemiaSigns.includes(cb.value);
      });
    }

    if (patient.weaknessSteroidHistory) {
      const r = document.querySelector(`input[name="weaknessSteroidHistory"][value="${patient.weaknessSteroidHistory}"]`);
      if (r) r.checked = true;
    }

    if (Array.isArray(patient.weaknessCurrentMedsList)) {
      document.querySelectorAll('input[name="weaknessCurrentMedsList"]').forEach(cb => {
        cb.checked = patient.weaknessCurrentMedsList.includes(cb.value);
      });
    }

    if (patient.weaknessCustomSubstanceCheck) {
      const r = document.querySelector(`input[name="weaknessCustomSubstanceCheck"][value="${patient.weaknessCustomSubstanceCheck}"]`);
      if (r) {
        r.checked = true;
        handleWeaknessCustomSubstanceChange(patient.weaknessCustomSubstanceCheck);
      }
    }
    const cText = document.getElementById('weaknessCustomSubstanceText');
    if (cText) cText.value = patient.weaknessCustomSubstanceText || '';

    const oText = document.getElementById('weakness_other_free');
    if (oText) oText.value = patient.otherSymptomsFree || '';
  },

  hydrateForm: function(patient) {
    this.populateForm(patient);
  },

  isRedFlag: function(patient) {
    return evaluateWeaknessRedFlags(patient).length > 0;
  },

  evaluateRedFlags: evaluateWeaknessRedFlags,
  updateOutputs: updateWeaknessOutputs,

  generateCds: function(patient, { rfs, ddxList = [], workupList = [], managementList = [] } = {}) {
    if (!patient) return;
    const foodIntake = patient.weaknessFoodIntake || '';
    const urineOutput = patient.weaknessUrineOutput || '';
    const infectionSigns = Array.isArray(patient.weaknessInfectionSigns) ? patient.weaknessInfectionSigns : [];
    const warningSigns = Array.isArray(patient.weaknessWarningSigns) ? patient.weaknessWarningSigns : [];
    const steroidHistory = patient.weaknessSteroidHistory || '';
    const medsList = Array.isArray(patient.weaknessCurrentMedsList) ? patient.weaknessCurrentMedsList : [];

    // 1. Differential Diagnoses
    if (rfs && rfs.some(r => r.key === 'weakness_rf_septic_shock')) {
      ddxList.push('1. 🚨 Sepsis / Septic Shock (secondary to Urosepsis or Pneumonia in Elderly/Diabetic)');
      ddxList.push('2. Severe Dehydration with Prerenal Acute Kidney Injury (AKI)');
      ddxList.push('3. Severe Metabolic Acidosis with Hyper/Hypokalemia');
    } else if (rfs && rfs.some(r => r.key === 'weakness_rf_hypoglycemia')) {
      ddxList.push('1. 🚨 Drug-Induced Severe Hypoglycemia (Sulfonylurea or Insulin with poor oral intake)');
      ddxList.push('2. Sepsis-induced Hypoglycemia / Hepatic dysfunction');
      ddxList.push('3. Adrenal Insufficiency');
    } else if (rfs && rfs.some(r => r.key === 'weakness_rf_adrenal_crisis')) {
      ddxList.push('1. 🚨 Acute Adrenal Crisis (Secondary to sudden withdrawal of steroids/herbal bolus)');
      ddxList.push('2. Hypovolemic / Distributive Shock');
      ddxList.push('3. Severe Electrolyte Derangement (Hyponatremia & Hyperkalemia)');
    } else if (rfs && rfs.some(r => r.key === 'weakness_rf_focal_stroke')) {
      ddxList.push('1. 🚨 Acute Ischemic Stroke / Intracranial Hemorrhage (Focal Neurologic Deficit)');
      ddxList.push('2. Acute Inflammatory Demyelinating Polyneuropathy (Guillain-Barré Syndrome)');
      ddxList.push('3. Hypokalemic Periodic Paralysis');
    } else {
      ddxList.push('1. Benign Post-viral Fatigue / Convalescence');
      ddxList.push('2. Mild Dehydration / Inadequate Caloric Intake');
      ddxList.push('3. Occult Chronic Anemia / Endocrine disorder');
    }

    // 2. Bedside & Rapid Workup
    workupList.push('Bedside Glucose (Stat DTX) ทุกรายเพื่อตัดภาวะ Severe Hypoglycemia');
    workupList.push('12-lead EKG ด่วนเพื่อตรวจหา Arrhythmia, Silent Ischemia และคลื่นผิดปกติจาก Electrolyte Imbalance');
    workupList.push('Stat Electrolytes, BUN, Cr, Blood Sugar และ CBC');

    if ((rfs && rfs.some(r => r.key === 'weakness_rf_septic_shock')) || infectionSigns.includes('uti') || infectionSigns.includes('pneumonia') || warningSigns.includes('fever_hypothermia')) {
      workupList.push('Sepsis Workup: Hemoculture x 2 bottles, Stat Venous/Arterial Lactate, Urine Analysis and Urine Culture');
      if (infectionSigns.includes('pneumonia') || warningSigns.includes('tachypnea')) {
        workupList.push('Chest X-ray (Portable CXR) ประเมินภาวะ Pneumonia และ Pulmonary edema');
      }
    }

    if ((rfs && rfs.some(r => r.key === 'weakness_rf_adrenal_crisis')) || steroidHistory === 'steroid_withdrawal') {
      workupList.push('Adrenal Crisis Workup: Stat Morning Cortisol, ACTH level, Serum Osmolality');
    }

    // 3. Initial Management & Safety Alerts
    if (rfs && rfs.some(r => r.key === 'weakness_rf_hypoglycemia')) {
      managementList.push('Hypoglycemia: ให้ 50% Glucose 50 mL IV Push ทันที และเริ่ม IV Infusion 10% Dextrose ตรวจซ้ำ DTX q 15-30 นาที');
    }
    if (rfs && rfs.some(r => r.key === 'weakness_rf_septic_shock')) {
      managementList.push('Sepsis Resuscitation: IV Acetated Ringer or NSS 30 mL/kg ภายใน 3 ชม. หากมีภาวะ Hypotension หรือ Lactate >= 4');
      managementList.push('Empiric IV Antibiotics ภายใน 60 นาทีหลังวินิจฉัย (Sepsis Hour-1 Bundle)');
    }
    if (rfs && rfs.some(r => r.key === 'weakness_rf_adrenal_crisis')) {
      managementList.push('Adrenal Resuscitation: IV Hydrocortisone 100 mg stat ทันทีร่วมกับ IV D5NSS (ห้ามรอผลเลือด)');
    }
    if ((rfs && rfs.some(r => r.key === 'weakness_rf_severe_dehydration_aki')) || urineOutput === 'anuria_gte8h') {
      managementList.push('Fluid Rehydration: ให้ IV Isotonic Crystalloid อย่างระมัดระวัง ติดตาม Urine Output ด้วย Foley Catheter');
    }
    if (rfs && rfs.some(r => r.key === 'weakness_rf_focal_stroke')) {
      managementList.push('Stroke Alert: Activate Acute Stroke Fast-Track และส่ง Stat Non-contrast CT Brain ทันที');
    }
    managementList.push('Consult: ปรึกษาอายุรแพทย์ (Internal Medicine) เพื่อรับไว้รักษาในหอผู้ป่วย');
  },

  appendCdsRecommendations: function(patient, rfs, workupList, managementList) {
    this.generateCds(patient, { rfs, ddxList: [], workupList, managementList });
  },

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
});
