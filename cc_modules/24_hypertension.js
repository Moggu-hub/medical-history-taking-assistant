// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 24_hypertension.js
// อาการนำ: ตรวจพบความดันโลหิตสูง (Severe Hypertension Screen / High BP)
// รองรับ Zero Default Bias, Progressive Disclosure, Universal Date/Time,
// Rapid Note De-duplication, และ TDD Core Guard
// =========================================================================

// --- Progressive Disclosure Helper Functions ---
function toggleHtnGroup(subId, show) {
  const el = document.getElementById(subId);
  if (!el) return;
  if (show) {
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
    el.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    const textInput = el.querySelector('input[type="text"]');
    if (textInput) textInput.value = '';
    const numInput = el.querySelector('input[type="number"]');
    if (numInput) numInput.value = '';
  }
}

function handleHtnVisitReasonChange(value) {
  const needsDetail = (value === 'other_appointment' || value === 'suspected_symptoms' || value === 'other_reasons');
  toggleHtnGroup('htnVisitReasonDetailContainer', needsDetail);
  const detailInput = document.getElementById('htnVisitReasonDetail');
  if (detailInput) {
    if (value === 'other_appointment') {
      detailInput.placeholder = 'ระบุโรคหรือแผนกที่แพทย์นัดตรวจ เช่น เบาหวาน, โรคหัวใจ, คลินิกตา...';
    } else if (value === 'suspected_symptoms') {
      detailInput.placeholder = 'ระบุอาการที่สงสัย เช่น มึนศีรษะ, แน่นหน้าอก, อึดอัดหายใจไม่อิ่ม...';
    } else if (value === 'other_reasons') {
      detailInput.placeholder = 'ระบุอาการหรือสาเหตุอื่น เช่น ปวดท้อง, ไข้หวัด, ทำแผล...';
    }
  }
}

function handleHtnPregnancyChange(value) {
  toggleHtnGroup('htnPregnancySymptomsSub', value === 'pregnancy_gt_20wks');
}

function handleHtnComplianceChange(value) {
  toggleHtnGroup('htnMissedDaysContainer', value === 'missed_days');
}

function handleHtnUnknownBpChange(cb) {
  // Checkbox does not clear entered inputs; it only notes that patient does not remember exact values
}

// --- Clinical Decision Support & Evaluation Functions ---
function evaluateHypertensionRedFlags(patient) {
  const rfs = [];
  const vs = patient.vital_signs || {};
  const sbp = vs.sbp !== undefined && vs.sbp !== null ? parseInt(vs.sbp, 10) : null;
  const dbp = vs.dbp !== undefined && vs.dbp !== null ? parseInt(vs.dbp, 10) : null;
  const pr = vs.pr !== undefined && vs.pr !== null ? parseInt(vs.pr, 10) : null;

  const peakSbp = patient.htnPeakSystolic !== undefined && patient.htnPeakSystolic !== null ? parseInt(patient.htnPeakSystolic, 10) : null;
  const peakDbp = patient.htnPeakDiastolic !== undefined && patient.htnPeakDiastolic !== null ? parseInt(patient.htnPeakDiastolic, 10) : null;

  const effectiveSbp = sbp !== null ? sbp : peakSbp;
  const effectiveDbp = dbp !== null ? dbp : peakDbp;
  const isSevereBP = (effectiveSbp !== null && effectiveSbp >= 180) || (effectiveDbp !== null && effectiveDbp >= 110);

  const neuroSigns = Array.isArray(patient.htnNeuroSigns) ? patient.htnNeuroSigns : [];
  const cardioSigns = Array.isArray(patient.htnCardioSigns) ? patient.htnCardioSigns : [];
  const renalSigns = Array.isArray(patient.htnRenalSigns) ? patient.htnRenalSigns : [];
  const pregSigns = Array.isArray(patient.htnPregnancySigns) ? patient.htnPregnancySigns : [];
  const generalSigns = Array.isArray(patient.htnGeneralSigns) ? patient.htnGeneralSigns : [];

  // 1. Acute Aortic Dissection with Severe Hypertension (ESI 1)
  if (cardioSigns.includes('tearing_chest_back_pain')) {
    rfs.push({
      key: 'rf_aortic_dissection_htn',
      level: 1,
      textTh: 'Acute Aortic Dissection / ภาวะเส้นเลือดใหญ่เอออร์ตาฉีกขาดเฉียบพลันจากความดันโลหิตสูงวิกฤต',
      risk: 'Catastrophic aortic rupture, cardiac tamponade, acute aortic regurgitation, severe malperfusion syndrome, and sudden death.',
      suggestedAction: 'Immediate Resuscitation (ESI 1). Rapid target BP reduction to SBP < 120 mmHg and HR < 60 bpm within 20 minutes using IV Beta-blocker FIRST (e.g. IV Esmolol or Labetalol) before vasodilators. Stat CT Angiography Chest & Abdomen (Aorta Protocol) and stat CVT Surgery consult.'
    });
  }

  // 2. Acute Pulmonary Edema / Acute Decompensated Heart Failure (ESI 1 / 2)
  const hasPulmEdemaSigns = cardioSigns.includes('orthopnea_pulmonary_edema') || cardioSigns.includes('pink_frothy_sputum');
  const hasSpO2Drop = vs.spo2 !== undefined && vs.spo2 !== null && parseInt(vs.spo2, 10) < 92;
  if (hasPulmEdemaSigns || (hasSpO2Drop && isSevereBP)) {
    rfs.push({
      key: 'rf_acute_pulmonary_edema_htn',
      level: 1,
      textTh: 'Acute Pulmonary Edema / ภาวะน้ำท่วมปอดเฉียบพลันจากความดันโลหิตสูงวิกฤต (Hypertensive Heart Failure)',
      risk: 'Severe hypoxemic respiratory failure, alveolar flooding, and cardiopulmonary arrest.',
      suggestedAction: 'Immediate airway stabilization, high-flow O2 or Non-invasive ventilation (BiPAP/CPAP) to reduce work of breathing. Aggressive preload/afterload reduction with IV Nitroglycerin infusion + IV Furosemide. AVOID Beta-blockers in acute pulmonary edema.'
    });
  }

  // 3. Acute Cerebrovascular Event (Stroke / ICH / SAH) (ESI 2)
  const hasFocalDeficit = neuroSigns.includes('facial_droop_dysarthria') || neuroSigns.includes('hemiparesis_numbness') || neuroSigns.includes('sudden_monocular_vision_loss');
  const hasThunderclap = neuroSigns.includes('severe_headache_occipital') && (isSevereBP || generalSigns.includes('projectile_vomiting'));
  if (hasFocalDeficit || hasThunderclap) {
    rfs.push({
      key: 'rf_stroke_ich_htn',
      level: 2,
      textTh: 'Acute Cerebrovascular Event (Stroke / ICH / SAH) / โรคหลอดเลือดสมองเฉียบพลัน หรือเลือดออกในสมอง',
      risk: 'Permanent irreversible neurologic deficit, hemorrhagic expansion, acute hydrocephalus, and cerebral herniation.',
      suggestedAction: 'Activate Stroke Fast Track. Stat Non-contrast CT Brain. Target permissive hypertension for ischemic stroke (< 220/120 or < 185/110 if thrombolysis candidate). For ICH, target SBP 140-160 mmHg with IV Nicardipine/Labetalol.'
    });
  }

  // 4. Preeclampsia with Severe Features / HELLP / Eclampsia (ESI 1 / 2)
  if (patient.htnPregnancyStatus === 'pregnancy_gt_20wks') {
    const hasPregSymptoms = pregSigns.includes('ruq_epigastric_pain') || pregSigns.includes('flashing_lights_vision') || pregSigns.includes('severe_throbbing_headache') || neuroSigns.includes('severe_headache_occipital') || neuroSigns.includes('blurred_vision_scotoma');
    const isSeverePreeclampsiaBP = (effectiveSbp !== null && effectiveSbp >= 160) || (effectiveDbp !== null && effectiveDbp >= 110);
    if (hasPregSymptoms || isSeverePreeclampsiaBP) {
      rfs.push({
        key: 'rf_preeclampsia_severe',
        level: 2,
        textTh: 'Preeclampsia with Severe Features / ภาวะครรภ์เป็นพิษระยะรุนแรง',
        risk: 'Eclampsia (maternal convulsions), placental abruption, hepatic rupture, HELLP syndrome, and fetal distress/death.',
        suggestedAction: 'Stat OB/GYN consult. Administer IV Magnesium Sulfate (4g loading then 1-2g/hr) for seizure prophylaxis. IV Labetalol or Hydralazine for BP control (target SBP 140-150, DBP 90-100). Stat CBC, Platelets, LFTs, BUN, Cr, Urine protein/dipstick, and Continuous Fetal Heart Rate Monitoring.'
      });
    }
  }

  // 5. Acute Coronary Syndrome (ACS / Acute MI) (ESI 2)
  if (cardioSigns.includes('crushing_chest_pressure')) {
    rfs.push({
      key: 'rf_acute_coronary_htn',
      level: 2,
      textTh: 'Acute Coronary Syndrome (ACS) with Severe Hypertension / ภาวะกล้ามเนื้อหัวใจขาดเลือดเฉียบพลันร่วมกับความดันโลหิตสูงวิกฤต',
      risk: 'Myocardial infarction extension, lethal ventricular arrhythmias, cardiogenic shock.',
      suggestedAction: 'Stat 12-lead ECG within 10 minutes. Stat High-Sensitivity Cardiac Troponin. Sublingual / IV Nitroglycerin (contraindicated if PDE5 inhibitor use or RV infarct). Aspirin 300 mg po, stat Cardiology consult.'
    });
  }

  // 6. Hypertensive Encephalopathy / Acute Kidney Injury (ESI 2)
  const hasEncephalopathy = neuroSigns.includes('confusion_lethargy');
  const hasRenalFailure = renalSigns.includes('anuria_oliguria') || renalSigns.includes('gross_hematuria_coca_cola');
  if (hasEncephalopathy || hasRenalFailure) {
    rfs.push({
      key: 'rf_encephalopathy_renal_htn',
      level: 2,
      textTh: 'Hypertensive Encephalopathy or Acute Kidney Injury / ภาวะสมองหรือไตวายเฉียบพลันจากความดันโลหิตสูงวิกฤต',
      risk: 'Cerebral edema, status epilepticus, irreversible uremic renal failure requiring emergent hemodialysis.',
      suggestedAction: 'Controlled BP reduction by no more than 20-25% in the first hour using IV Nicardipine or Labetalol infusion to avoid cerebral/renal hypoperfusion. Stat BUN, Cr, Electrolytes, Urinalysis, and strict hourly urine output monitoring.'
    });
  }

  return rfs;
}

// --- Formatters for Doctor Rapid Note ---
function formatHtnVisitReason(patient) {
  const map = {
    high_bp_detected: 'ตรวจพบความดันโลหิตสูง',
    other_appointment: 'มาตามนัดแพทย์ตรวจโรคอื่น',
    suspected_symptoms: 'มาด้วยอาการที่สงสัยว่าเกิดจากความดันสูง',
    other_reasons: 'มาด้วยอาการอื่นๆ ที่ไม่เกี่ยวกับโรคความดันสูง'
  };
  const base = map[patient.htnVisitReason] || 'ไม่ได้ระบุ';
  if (patient.htnVisitReasonDetail) {
    return `${base} (${patient.htnVisitReasonDetail})`;
  }
  return base;
}

function formatHtnSource(patient) {
  const map = {
    home_digital: 'วัดเองที่บ้าน (เครื่องวัดความดันดิจิทัล หรือ มีเจ้าหน้าที่มาวัด)',
    health_center: 'สถานีอนามัย / รพ.สต. / คลินิกชุมชนอบอุ่น',
    private_clinic: 'คลินิกเอกชน หรือ โรงพยาบาลเอกชน',
    triage_hospital: 'จุดคัดกรองที่รพ. (หน้าห้องตรวจ / งานคัดกรอง)',
    other: 'สถานที่อื่น / ไม่แน่ชัด'
  };
  return map[patient.htnSource] || 'ไม่ได้ระบุ';
}

function formatHtnKnownHx(patient) {
  const map = {
    known_htn: 'เคยได้รับการวินิจฉัยว่าเป็นโรคความดันโลหิตสูงมาก่อน (Known HT)',
    first_time: 'เพิ่งตรวจพบค่าสูงเป็นครั้งแรกในชีวิต (Never diagnosed / First time) 🚩',
    unsure: 'ไม่แน่ใจประวัติเดิม'
  };
  return map[patient.htnKnownHx] || 'ไม่ได้ระบุ';
}

function formatHtnCompliance(patient) {
  const map = {
    regular: 'รับประทานยาความดันสม่ำเสมอตามแพทย์สั่ง ครบถ้วน',
    missed_days: patient.htnMissedDays ? `ลืมรับประทานยา หรือขาดยามา ${patient.htnMissedDays} วัน 🚩` : 'ลืมรับประทานยา หรือขาดยามาหลายวัน 🚩',
    self_adjusted: 'ปรับขนาดยาเอง หรือหยุดรับประทานยาเอง 🚩',
    no_prior_rx: 'ไม่เคยมียาลดความดันมาก่อน (ไม่เคยรับการรักษา)'
  };
  return map[patient.htnCompliance] || 'ไม่ได้ระบุ';
}

function formatHtnPregnancyStatus(patient) {
  const map = {
    none: 'ไม่ได้ตั้งครรภ์ / ชาย / ไม่อยู่ในเกณฑ์',
    pregnancy_lt_20wks: 'กำลังตั้งครรภ์ (อายุครรภ์น้อยกว่า 20 สัปดาห์) [ส่งต่อ High-Risk ANC] 🚩',
    pregnancy_gt_20wks: 'กำลังตั้งครรภ์ (> 20 สัปดาห์) หรือเพิ่งคลอดบุตรไม่เกิน 6 สัปดาห์ (เสี่ยง Severe Preeclampsia) 🚩'
  };
  return map[patient.htnPregnancyStatus] || 'ไม่ได้ระบุ';
}

// --- Rapid Note Generator (5 Standardized Sections) ---
function renderHypertensionRapidHpi(patient) {
  const durVal = patient.durationVal;
  const durUnitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durUnit = durUnitMap[patient.durationUnit] || 'วัน';
  const durationStr = durVal ? `${durVal} ${durUnit}` : 'ไม่ระบุ';

  const neuroSigns = Array.isArray(patient.htnNeuroSigns) ? patient.htnNeuroSigns : [];
  const cardioSigns = Array.isArray(patient.htnCardioSigns) ? patient.htnCardioSigns : [];
  const renalSigns = Array.isArray(patient.htnRenalSigns) ? patient.htnRenalSigns : [];
  const pregSigns = Array.isArray(patient.htnPregnancySigns) ? patient.htnPregnancySigns : [];
  const generalSigns = Array.isArray(patient.htnGeneralSigns) ? patient.htnGeneralSigns : [];
  const triggers = Array.isArray(patient.htnTriggers) ? patient.htnTriggers : [];

  const posList = [];
  const negList = [];

  // Positives evaluation
  if (patient.htnPeakSystolic || patient.htnPeakDiastolic) {
    const sbpStr = patient.htnPeakSystolic ? `${patient.htnPeakSystolic}` : '?';
    const dbpStr = patient.htnPeakDiastolic ? `${patient.htnPeakDiastolic}` : '?';
    const prStr = patient.htnPeakPulse ? `, ชีพจร ${patient.htnPeakPulse} ครั้ง/นาที` : '';
    posList.push(`ตรวจพบความดันโลหิตสูงสุดก่อนมารพ.: ${sbpStr}/${dbpStr} mmHg${prStr} 🚩`);
  } else if (patient.htnBpUnknownExact) {
    posList.push('ตรวจพบค่าความดันโลหิตสูงมากผิดปกติก่อนมารพ. (จำตัวเลขแน่ชัดไม่ได้) 🚩');
  }

  // Neuro Positives
  if (neuroSigns.includes('severe_headache_occipital')) posList.push('ปวดศีรษะรุนแรงเฉียบพลัน หรือปวดตื้อท้ายทอยอย่างมาก 🚩');
  if (neuroSigns.includes('blurred_vision_scotoma')) posList.push('ตามัวลงเฉียบพลัน หรือเห็นภาพซ้อน / มองเห็นแสงวับวาบ 🚩');
  if (neuroSigns.includes('facial_droop_dysarthria')) posList.push('ปากเบี้ยว หน้าเบี้ยว หรือพูดไม่ชัด ลิ้นแข็ง กลืนลำบาก (Stroke deficit) 🚩');
  if (neuroSigns.includes('hemiparesis_numbness')) posList.push('แขนขาข้างใดข้างหนึ่งอ่อนแรง ชาครึ่งซีก ยกไม่ขึ้น (Hemiparesis) 🚩');
  if (neuroSigns.includes('confusion_lethargy')) posList.push('ซึมลง สับสน พฤติกรรมเปลี่ยนแปลง หรือมีอาการชัก (Encephalopathy) 🚩');
  if (neuroSigns.includes('sudden_monocular_vision_loss')) posList.push('ตาบอดข้างเดียวฉับพลัน (Amaurosis fugax / CRAO) 🚩');

  // Cardio Positives
  if (cardioSigns.includes('crushing_chest_pressure')) posList.push('เจ็บแน่นอึดอัดกลางหน้าอกคล้ายของหนักทับ ร้าวไปกรามหรือแขนซ้าย (Ischemic chest pain) 🚩');
  if (cardioSigns.includes('tearing_chest_back_pain')) posList.push('เจ็บแปล๊บรุนแรงคล้ายมีอะไรฉีกขาดในอก หรือเจ็บทะลุร้าวไปหลังสะบัก (Suspected Aortic Dissection) 🚩');
  if (cardioSigns.includes('orthopnea_pulmonary_edema')) posList.push('หายใจหอบเหนื่อยรุนแรง แน่นหน้าอกเมื่อนอนราบ ต้องลุกขึ้นมานั่งหายใจ (Orthopnea / Pulmonary Edema) 🚩');
  if (cardioSigns.includes('pink_frothy_sputum')) posList.push('ไอมีฟองเสมหะสีชมพูปน หรือไอมีเลือดปน (Acute Pulmonary Edema) 🚩');
  if (cardioSigns.includes('palpitations_racing_heart')) posList.push('ใจสั่นผิดปกติ รู้สึกหัวใจเต้นเร็วรัวหรือเต้นสะดุดแรง');

  // Renal Positives
  if (renalSigns.includes('anuria_oliguria')) posList.push('ปัสสาวะไม่ออก หรือออกน้อยลงมากผิดปกติใน 24 ชั่วโมงที่ผ่านมา (Oliguria/Anuria) 🚩');
  if (renalSigns.includes('gross_hematuria_coca_cola')) posList.push('ปัสสาวะเป็นเลือดสด มีลิ่มเลือด หรือปัสสาวะสีน้ำล้างเนื้อ/โค้กเข้ม (Gross hematuria / AKI) 🚩');
  if (renalSigns.includes('leg_edema_bilateral')) posList.push('มีอาการบวมขึ้นที่ขาทั้งสองข้าง หลังเท้า หรือใบหน้าและหนังตา');

  // Pregnancy Positives
  if (patient.htnPregnancyStatus === 'pregnancy_gt_20wks') {
    posList.push('หญิงตั้งครรภ์อายุครรภ์เกิน 20 สัปดาห์ หรือหลังคลอดบุตรไม่เกิน 6 สัปดาห์ 🚩');
    if (pregSigns.includes('ruq_epigastric_pain')) posList.push('จุกแน่นใต้ลิ้นปี่ หรือปวดแน่นชายโครงขวาอย่างมาก (Capsular stretch / HELLP) 🚩');
    if (pregSigns.includes('flashing_lights_vision')) posList.push('ตาพร่ามัว มองเห็นแสงวับวาบระยิบระยับ (Photopsia / Scotoma) 🚩');
    if (pregSigns.includes('severe_throbbing_headache')) posList.push('ปวดศีรษะรุนแรงต่อเนื่อง ทานยาแก้ปวดไม่ทุเลา 🚩');
  } else if (patient.htnPregnancyStatus === 'pregnancy_lt_20wks') {
    posList.push('หญิงตั้งครรภ์อายุครรภ์น้อยกว่า 20 สัปดาห์ (ความดันโลหิตสูงก่อนการตั้งครรภ์)');
  }

  // General Warning Signs Positives
  if (generalSigns.includes('dizziness_cold_sweat')) posList.push('หน้ามืด วูบคล้ายจะเป็นลม เวียนศีรษะ หรือเหงื่อแตกตัวเย็น');
  if (generalSigns.includes('severe_epistaxis')) posList.push('มีเลือดกำเดาไหลออกทางจมูกปริมาณมากผิดปกติ 🚩');
  if (generalSigns.includes('projectile_vomiting')) posList.push('คลื่นไส้ อาเจียนพุ่งหลายครั้งติดต่อกัน (Increased ICP) 🚩');

  // Triggers Positives
  if (triggers.includes('stress_insomnia')) posList.push('มีความเครียด วิตกกังวล หรือนอนไม่หลับอย่างหนักติดต่อกัน');
  if (triggers.includes('severe_pain_other')) posList.push('มีอาการปวดรุนแรงที่ตำแหน่งอื่นของร่างกายกระตุ้นความดัน');
  if (triggers.includes('energy_drink_coffee_alc')) posList.push('ดื่มเครื่องดื่มชูกำลัง กาแฟเข้มข้น หรือแอลกอฮอล์');
  if (triggers.includes('nsaids_cold_steroid')) posList.push('เพิ่งรับประทานยาแก้หวัด ยาแก้ปวดข้อ NSAIDs หรือยาสเตียรอยด์');
  if (triggers.includes('substance_stimulants')) posList.push('มีประวัติใช้สารเสพติด หรือสารกระตุ้นประสาท (ยาบ้า, ยาไอซ์, โคเคน, กัญชา, กระท่อม) 🚩');

  if (patient.otherSymptomsFree) {
    posList.push(patient.otherSymptomsFree);
  }

  // Negatives evaluation
  if (!cardioSigns.includes('crushing_chest_pressure') && !cardioSigns.includes('tearing_chest_back_pain')) {
    negList.push('ปฏิเสธเจ็บแน่นหน้าอก และปฏิเสธอาการเจ็บฉีกขาดทะลุหลัง');
  }
  if (!cardioSigns.includes('orthopnea_pulmonary_edema') && !cardioSigns.includes('pink_frothy_sputum')) {
    negList.push('ปฏิเสธหอบเหนื่อยรุนแรง นอนราบได้ ไม่มีไอเสมหะฟองสีชมพู');
  }
  if (!neuroSigns.includes('facial_droop_dysarthria') && !neuroSigns.includes('hemiparesis_numbness')) {
    negList.push('ปฏิเสธปากเบี้ยว พูดไม่ชัด และปฏิเสธแขนขาอ่อนแรงครึ่งซีก');
  }
  if (!neuroSigns.includes('severe_headache_occipital') && !neuroSigns.includes('blurred_vision_scotoma')) {
    negList.push('ปฏิเสธปวดศีรษะรุนแรง และปฏิเสธตามัว/เห็นภาพซ้อน');
  }
  if (!renalSigns.includes('anuria_oliguria') && !renalSigns.includes('gross_hematuria_coca_cola')) {
    negList.push('ปฏิเสธปัสสาวะออกน้อย ปัสสาวะสีปกติไม่มีเลือดปน');
  }
  if (!triggers.includes('substance_stimulants')) {
    negList.push('ปฏิเสธการใช้สารเสพติด สารกระตุ้นประสาท กัญชา หรือกระท่อม');
  }
  if (patient.htnPregnancyStatus === 'none') {
    negList.push('ไม่ได้ตั้งครรภ์');
  }

  const hospLabel = {
    complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
    additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
    self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
    unspecified: 'ไม่ได้ระบุ'
  }[patient.hospRecordStatus] || 'ไม่ได้ระบุ';

  let udDisplay = 'ปฏิเสธ';
  if (patient.underlying && patient.underlying.length > 0) {
    const filteredUd = (Array.isArray(patient.underlying) ? patient.underlying : [patient.underlying])
      .filter(u => u && !u.includes('ปฏิเสธ') && u !== 'ไม่มี' && u !== 'ไม่มีโรคประจำตัว');
    if (filteredUd.length > 0) udDisplay = filteredUd.join(', ');
  }
  const allergyDisplay = (!patient.drugAllergy || patient.drugAllergy.includes('ปฏิเสธ') || patient.drugAllergy === 'ไม่มี') ? 'ปฏิเสธ' : patient.drugAllergy;
  const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ' || patient.currentMeds === 'ไม่มี') ? 'ไม่มี' : patient.currentMeds;
  const docNotes = patient.doctor_notes || {};
  const redFlags = evaluateHypertensionRedFlags(patient);

  let bpString = 'ไม่ระบุแน่ชัด';
  if (patient.htnPeakSystolic || patient.htnPeakDiastolic) {
    const sbp = patient.htnPeakSystolic || '?';
    const dbp = patient.htnPeakDiastolic || '?';
    const pr = patient.htnPeakPulse ? ` mmHg (Pulse ${patient.htnPeakPulse} bpm)` : ' mmHg';
    bpString = `${sbp}/${dbp}${pr}`;
  } else if (patient.htnBpUnknownExact) {
    bpString = 'ตรวจพบสูงมากผิดปกติ (จำตัวเลขแน่ชัดไม่ได้)';
  }

  const defaultRapid =
`[Chief Complaint (CC)]
ตรวจพบความดันโลหิตสูง (Severe Hypertension Screen) เป็นมา ${durationStr}

[History of Present Illness (HPI)]
• ระยะเวลาและสาเหตุที่มารพ.: เป็นมา ${durationStr} | สาเหตุ: ${formatHtnVisitReason(patient)}
• ค่าความดันโลหิตสูงสุดก่อนมารพ.: ${bpString}
• แหล่งที่ตรวจพบค่าความดัน: ${formatHtnSource(patient)}
• ประวัติโรคความดันเดิม: ${formatHtnKnownHx(patient)}
• การรับประทานยาลดความดัน: ${formatHtnCompliance(patient)}
• สถานะการตั้งครรภ์: ${formatHtnPregnancyStatus(patient)}

• Pertinent Positives:
${posList.length > 0 ? posList.map(p => `  - ${p}`).join('\n') : '  - ไม่มีอาการร่วมอื่นที่เด่นชัด'}

• Pertinent Negatives:
${negList.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• โรคประจำตัว (U/D): ${udDisplay}
• ยาประจำตัว (Current Meds): ${medsText}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${allergyDisplay}
• ปัจจัยกระตุ้นร่วม: ${triggers.length > 0 ? triggers.join(', ') : 'ปฏิเสธปัจจัยกระตุ้นเฉียบพลัน'}

[Emergency Risk Assessment (Red Flags)]
${redFlags.length > 0
  ? `🚩 RED FLAGS DETECTED:\n${redFlags.map(rf => `  * ${rf.textTh}`).join('\n')}`
  : '✓ ไม่พบสัญญาณเตือนวิกฤตเฉียบพลันเบื้องต้น (No Acute Target Organ Damage)'}

[Doctor's Clinical Addendum & Exam]
• ประวัติเพิ่มเติม/แก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}
• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}
• แผนการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

  return defaultRapid;
}

// --- Narrative Note Generator (Doctor View) ---
function renderHypertensionNarrative(patient) {
  const durVal = patient.durationVal;
  const durUnitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durUnit = durUnitMap[patient.durationUnit] || 'วัน';
  const durStr = durVal ? `${durVal} ${durUnit}` : 'ไม่ระบุระยะเวลา';

  const reasonStr = formatHtnVisitReason(patient);
  const sourceStr = formatHtnSource(patient);
  const hxStr = formatHtnKnownHx(patient);
  const compStr = formatHtnCompliance(patient);

  let bpStr = 'ไม่ทราบค่าแน่ชัด';
  if (patient.htnPeakSystolic || patient.htnPeakDiastolic) {
    bpStr = `${patient.htnPeakSystolic || '?'}/${patient.htnPeakDiastolic || '?'} mmHg`;
  }

  let note = `ผู้ป่วย${patient.gender || ''} อายุ ${patient.age || 'ไม่ระบุ'} ปี มารับการตรวจที่ห้องฉุกเฉินด้วยอาการตรวจพบความดันโลหิตสูง เป็นมา ${durStr} ก่อนมารพ. สาเหตุที่มาคือ${reasonStr} ค่าความดันสูงสุดที่วัดได้คือ ${bpStr} โดยตรวจพบจาก${sourceStr} ประวัติเดิมคือ${hxStr} ด้านการรับประทานยาความดันคือ${compStr}`;

  const neuroSigns = Array.isArray(patient.htnNeuroSigns) ? patient.htnNeuroSigns : [];
  const cardioSigns = Array.isArray(patient.htnCardioSigns) ? patient.htnCardioSigns : [];
  const renalSigns = Array.isArray(patient.htnRenalSigns) ? patient.htnRenalSigns : [];

  const syms = [];
  if (cardioSigns.includes('tearing_chest_back_pain')) syms.push('เจ็บแปล๊บรุนแรงคล้ายฉีกขาดในอกทะลุหลัง');
  if (cardioSigns.includes('crushing_chest_pressure')) syms.push('เจ็บแน่นกลางอกคล้ายของหนักทับ');
  if (cardioSigns.includes('orthopnea_pulmonary_edema')) syms.push('หอบเหนื่อยนอนราบไม่ได้');
  if (cardioSigns.includes('pink_frothy_sputum')) syms.push('ไอมีเสมหะฟองสีชมพู');
  if (neuroSigns.includes('facial_droop_dysarthria')) syms.push('ปากเบี้ยวพูดไม่ชัด');
  if (neuroSigns.includes('hemiparesis_numbness')) syms.push('แขนขาอ่อนแรงครึ่งซีก');
  if (neuroSigns.includes('severe_headache_occipital')) syms.push('ปวดศีรษะรุนแรงตื้อท้ายทอย');
  if (renalSigns.includes('anuria_oliguria')) syms.push('ปัสสาวะออกน้อยลงมาก');

  if (syms.length > 0) {
    note += ` ร่วมกับมีอาการสำคัญ: ${syms.join(', ')}`;
  } else {
    note += ' ผู้ป่วยปฏิเสธเจ็บแน่นหน้าอก ปฏิเสธหอบเหนื่อยนอนราบไม่ได้ ปฏิเสธปากเบี้ยวหรือแขนขาอ่อนแรง และไม่มีปัสสาวะออกน้อย';
  }

  return note;
}

function renderHypertensionDoctorHpi(patient) {
  return renderHypertensionRapidHpi(patient);
}

// --- Output Dispatcher ---
function updateHypertensionOutputs(rec) {
  if (!rec) return;
  const rapidText = renderHypertensionRapidHpi(rec);
  const narrativeText = renderHypertensionNarrative(rec);

  const rapidEl = document.getElementById('rapidTextView');
  const narrativeEl = document.getElementById('narrativeTextView');
  if (rapidEl) rapidEl.value = rec.custom_rapid_note || rapidText;
  if (narrativeEl) narrativeEl.value = rec.custom_narrative_note || narrativeText;

  const posMatch = rapidText.match(/• Pertinent Positives:\n((?:\s*-[^\n]+\n?)+)/);
  if (posMatch) {
    rec.pertinentPositives = posMatch[1].trim().split('\n').map(l => l.replace(/^[-*\s]+/, '').trim());
  } else {
    rec.pertinentPositives = ['ไม่มีอาการร่วมผิดปกติ'];
  }

  const negMatch = rapidText.match(/• Pertinent Negatives:\n((?:\s*-[^\n]+\n?)+)/);
  if (negMatch) {
    rec.pertinentNegatives = negMatch[1].trim().split('\n').map(l => l.replace(/^[-*\s]+/, '').trim());
  } else {
    rec.pertinentNegatives = [];
  }

  const redFlags = evaluateHypertensionRedFlags(rec);
  rec.redFlags = redFlags;

  const jsonOutput = {
    encounter: {
      chief_complaint: 'hypertension',
      chief_complaint_title_th: 'ตรวจพบความดันโลหิตสูง',
      timestamp: rec.timestamp || new Date().toISOString(),
      duration_val: rec.durationVal || null,
      duration_unit: rec.durationUnit || 'days'
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
      visit_reason: rec.htnVisitReason || null,
      visit_reason_detail: rec.htnVisitReasonDetail || '',
      peak_blood_pressure: {
        systolic: rec.htnPeakSystolic || null,
        diastolic: rec.htnPeakDiastolic || null,
        pulse: rec.htnPeakPulse || null,
        unknown_exact: Boolean(rec.htnBpUnknownExact)
      },
      detection_source: rec.htnSource || null,
      known_ht_history: rec.htnKnownHx || null,
      neurologic_symptoms: Array.isArray(rec.htnNeuroSigns) ? rec.htnNeuroSigns : [],
      cardiopulmonary_symptoms: Array.isArray(rec.htnCardioSigns) ? rec.htnCardioSigns : [],
      renal_symptoms: Array.isArray(rec.htnRenalSigns) ? rec.htnRenalSigns : [],
      pregnancy_status: rec.htnPregnancyStatus || null,
      pregnancy_symptoms: Array.isArray(rec.htnPregnancySigns) ? rec.htnPregnancySigns : [],
      general_warning_signs: Array.isArray(rec.htnGeneralSigns) ? rec.htnGeneralSigns : [],
      compliance: rec.htnCompliance || null,
      missed_days: rec.htnMissedDays || null,
      triggers_and_substances: Array.isArray(rec.htnTriggers) ? rec.htnTriggers : [],
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
  const jsonEl = document.getElementById('jsonViewer');
  if (jsonEl) jsonEl.textContent = JSON.stringify(jsonOutput, null, 2);
}

// --- CDS Generator ---
function generateHypertensionCds(patient, { rfs, ddxList = [], workupList = [], managementList = [] } = {}) {
  if (!patient) return '';
  const redFlags = rfs || evaluateHypertensionRedFlags(patient);

  const hasDissection = redFlags.some(r => r.key === 'rf_aortic_dissection_htn');
  const hasPulmEdema = redFlags.some(r => r.key === 'rf_acute_pulmonary_edema_htn');
  const hasStroke = redFlags.some(r => r.key === 'rf_stroke_ich_htn');
  const hasPreeclampsia = redFlags.some(r => r.key === 'rf_preeclampsia_severe');
  const hasACS = redFlags.some(r => r.key === 'rf_acute_coronary_htn');
  const hasEncephRenal = redFlags.some(r => r.key === 'rf_encephalopathy_renal_htn');

  if (hasDissection) {
    ddxList.push('1. 🚨 Hypertensive Emergency with Acute Aortic Dissection (Stanford Type A / B)');
    ddxList.push('2. Acute Coronary Syndrome (Inferior/Posterior STEMI)');
    ddxList.push('3. Spontaneous Pneumothorax / Esophageal Rupture');
    workupList.push('Stat CT Angiography Chest & Abdomen (Aorta Protocol)');
    workupList.push('Stat 12-lead ECG, Portable Chest X-ray');
    workupList.push('CBC, Coagulogram, BUN, Cr, Electrolytes, Cardiac Troponin, Type and Screen');
    workupList.push('Stat CVT Surgery and Intensive Care (ICU) Consultation');
    managementList.push('Triage Level 1: ย้ายเข้าห้องกู้ชีพ (Resuscitation Room) ทันที');
    managementList.push('เป้าหมายเร่งด่วน: ลด SBP < 120 mmHg และควบคุม HR < 60 bpm ภายใน 20 นาที');
    managementList.push('เริ่ม IV Beta-blocker เป็นอันดับแรก (IV Esmolol หรือ Labetalol) เพื่อลด shear stress ก่อนให้ vasodilator (ห้ามให้ vasodilator เดี่ยวๆ เพราะจะเกิด reflex tachycardia)');
    managementList.push('งดน้ำ งดอาหาร และเตรียมความพร้อมสำหรับการผ่าตัดฉุกเฉิน');
  } else if (hasPulmEdema) {
    ddxList.push('1. 🚨 Hypertensive Emergency with Acute Pulmonary Edema / Flash Pulmonary Edema');
    ddxList.push('2. Acute Decompensated Heart Failure (HFpEF / HFrEF)');
    ddxList.push('3. Non-ST Elevation Myocardial Infarction (NSTEMI)');
    workupList.push('Continuous SpO2, Vital Signs, and Bedside Cardiac Monitor');
    workupList.push('Bedside POCUS Lung & Heart (Look for B-lines, EF assessment, IVC)');
    workupList.push('Stat 12-lead ECG, Portable Chest X-ray (Upright or Semi-erect)');
    workupList.push('CBC, BUN, Cr, Electrolytes, NT-proBNP, High-Sensitivity Troponin, ABG');
    managementList.push('Triage Level 1: ย้ายเข้าห้องวิกฤต จัดท่านั่งห้อยขา (High Fowler Position)');
    managementList.push('High-flow O2 หรือพิจารณาใส่ Non-invasive Ventilation (BiPAP/CPAP) ทันที');
    managementList.push('IV Nitroglycerin infusion ปรับเพิ่มขนาดยาอย่างรวดเร็วเพื่อลด preload และ afterload');
    managementList.push('IV Furosemide 40-80 mg push ช้าๆ');
    managementList.push('⚠️ ข้อห้ามสำคัญ: หลีกเลี่ยงการให้ Beta-blocker ในภาวะ Acute Pulmonary Edema');
  } else if (hasStroke) {
    ddxList.push('1. 🚨 Acute Cerebrovascular Accident (Intracerebral Hemorrhage / Acute Ischemic Stroke)');
    ddxList.push('2. Subarachnoid Hemorrhage (SAH)');
    ddxList.push('3. Hypertensive Encephalopathy');
    workupList.push('Stat Non-contrast CT Brain ทันที (Stroke Fast Track Protocol)');
    workupList.push('Bedside Blood Glucose (DTX) เพื่อตัดภาวะ Hypoglycemia');
    workupList.push('Stat 12-lead ECG, Portable CXR');
    workupList.push('CBC, Platelets, PT, INR, PTT, BUN, Cr, Electrolytes');
    workupList.push('Stat Neurology / Neurosurgery Consultation');
    managementList.push('Triage Level 2: เข้าห้องตรวจด่วน Stroke Unit / ER Observation');
    managementList.push('หากเป็น Ischemic Stroke: ควบคุมความดันแบบ Permissive Hypertension (เว้นแต่ได้รับ rtPA ต้องควบคุม BP < 185/110 mmHg)');
    managementList.push('หากเป็น ICH: ควบคุมความดันเป้าหมาย SBP 140-160 mmHg ด้วย IV Nicardipine/Labetalol');
    managementList.push('NPO ประเมินภาวะกลืนลำบาก ยกหัวเตียงสูง 30 องศา');
  } else if (hasPreeclampsia) {
    ddxList.push('1. 🚨 Preeclampsia with Severe Features');
    ddxList.push('2. HELLP Syndrome (Hemolysis, Elevated Liver enzymes, Low Platelets)');
    ddxList.push('3. Impending Eclampsia');
    workupList.push('Continuous Fetal Heart Rate Monitoring (NST) and Maternal BP');
    workupList.push('Stat CBC (Platelet count), Peripheral Blood Smear');
    workupList.push('Liver Function Test (AST, ALT, LDH, Total Bilirubin), BUN, Cr, Uric acid');
    workupList.push('Urine protein/creatinine ratio หรือ Urine dipstick test');
    workupList.push('Stat OB/GYN Consultation');
    managementList.push('Triage Level 2: ย้ายเข้าห้องคลอด/ห้องตรวจสูติกรรมฉุกเฉิน');
    managementList.push('ให้ IV Magnesium Sulfate (4 g IV loading dose over 15-20 min ตามด้วย 1-2 g/hr infusion) เพื่อป้องกันอาการชัก (Eclampsia Prophylaxis)');
    managementList.push('ลดความดันโลหิตเป้าหมาย SBP 140-150 mmHg และ DBP 90-100 mmHg ด้วย IV Labetalol หรือ IV Hydralazine (หรือ Oral Nifedipine 10 mg swallowed, ห้ามอมใต้ลิ้น)');
    managementList.push('เตรียมพร้อมสำหรับการยุติการตั้งครรภ์ฉุกเฉินตามข้อบ่งชี้ทางสูติกรรม');
  } else if (hasACS) {
    ddxList.push('1. 🚨 Acute Coronary Syndrome (STEMI / NSTEMI / Unstable Angina)');
    ddxList.push('2. Hypertensive Heart Disease with Myocardial Strain');
    ddxList.push('3. Acute Myocarditis / Pericarditis');
    workupList.push('Stat 12-lead ECG ภายใน 10 นาทีแรก และทำซ้ำทุก 15-30 นาทีหากอาการไม่ทุเลา');
    workupList.push('Stat High-Sensitivity Cardiac Troponin I/T');
    workupList.push('CBC, Electrolytes, BUN, Cr, Lipid profile, Portable CXR');
    workupList.push('Stat Cardiology Consultation / Cath Lab Activation (หากพบ STEMI)');
    managementList.push('Triage Level 2: ย้ายเข้า ER Acute Care Bed, Continuous Cardiac Monitor');
    managementList.push('Aspirin 300 mg po เคี้ยวกลืนทันที ร่วมกับ P2Y12 inhibitor ตามโปรโตคอล ACS');
    managementList.push('IV หรือ Sublingual Nitroglycerin (ระวังข้อห้าม: ห้ามใช้ใน RV infarction หรือเพิ่งใช้ยากลุ่ม PDE5 inhibitors)');
    managementList.push('ควบคุมความดันโลหิตด้วย IV Nitroglycerin หรือ IV Beta-blocker เพื่อลด Myocardial Oxygen Consumption');
  } else if (hasEncephRenal) {
    ddxList.push('1. 🚨 Hypertensive Encephalopathy / Acute Kidney Injury (AKI)');
    ddxList.push('2. Thrombotic Microangiopathy (TMA / TTP / HUS)');
    ddxList.push('3. Sepsis / Uremic Encephalopathy');
    workupList.push('Stat BUN, Cr, Electrolytes, Complete Urinalysis (ตรวจหา Proteinuria, RBC casts)');
    workupList.push('Stat CT Brain (Non-contrast) เพื่อแยก Intracranial Hemorrhage');
    workupList.push('CBC, Blood smear (ตรวจหา Schistocytes/Hemolysis)');
    workupList.push('Stat Nephrology / Neurology Consultation');
    managementList.push('Triage Level 2: ติดตามสัญญาณชีพและระดับความรู้สึกตัวอย่างใกล้ชิด');
    managementList.push('ลด Mean Arterial Pressure (MAP) ลงไม่เกิน 20-25% ภายใน 1 ชั่วโมงแรก เพื่อป้องกัน cerebral hypoperfusion');
    managementList.push('เริ่ม IV Nicardipine หรือ IV Labetalol infusion');
    managementList.push('ใส่สายสวนปัสสาวะเพื่อติดตาม Urine output รายชั่วโมง');
  } else if (patient.htnPregnancyStatus === 'pregnancy_lt_20wks') {
    ddxList.push('1. Chronic Hypertension in Pregnancy');
    ddxList.push('2. Essential Hypertension with Early Pregnancy');
    ddxList.push('3. Secondary Hypertension (e.g. Renal Artery Stenosis, Pheochromocytoma)');
    workupList.push('ประเมินตรวจซ้ำว่าไม่มีอาการ Target Organ Damage');
    workupList.push('BUN, Cr, Electrolytes, Urine analysis & Urine protein');
    workupList.push('Ultrasound Obstetric เพื่อประเมินอายุครรภ์และภาวะทารก');
    workupList.push('ส่งต่อ High-Risk Antenatal Care Clinic (ANC)');
    managementList.push('Triage Level 4: นัดตรวจและส่งต่อคลินิกฝากครรภ์กลุ่มเสี่ยงสูง');
    managementList.push('เลือกใช้ยาลดความดันที่ปลอดภัยในสตรีตั้งครรภ์: Methyldopa, Labetalol หรือ Oral Nifedipine');
    managementList.push('⚠️ ห้ามใช้ยาลดความดันกลุ่ม ACE inhibitors (เช่น Enalapril) หรือ ARBs (เช่น Losartan) เด็ดขาดเนื่องจากเป็น Teratogenic');
  } else {
    // CDS-HTN-07: Hypertensive Urgency / Asymptomatic Severe Hypertension
    ddxList.push('1. Hypertensive Urgency / Asymptomatic Severe Hypertension');
    ddxList.push('2. Non-compliance with Antihypertensive Therapy');
    ddxList.push('3. Essential Hypertension with Acute Pain / Stress Reaction');
    workupList.push('ให้ผู้ป่วยนั่งพักในห้องที่เงียบสงบ 15-30 นาที และวัดความดันโลหิตซ้ำ');
    workupList.push('Basic Labs: BUN, Cr, Electrolytes, Urinalysis, 12-lead ECG');
    managementList.push('Triage Level 3 / 4: ผู้ป่วยไม่มีอาการของ Acute Target Organ Damage สามารถรับการดูแลแบบผู้ป่วยนอกได้อย่างปลอดภัย');
    managementList.push('🚨 คำเตือนความปลอดภัยระดับสูง: ห้ามใช้ Sublingual Nifedipine หรือยาลดความดันชนิดฉีดอย่างรวดเร็วโดยเด็ดขาด เนื่องจากเสี่ยงต่อการเกิด Stroke และ Myocardial Infarction จาก Hypoperfusion');
    managementList.push('หากเป็นกรณีขาดยา: แนะนำให้กลับมารับประทานยาเดิม หรือปรับเพิ่มขนาดยารับประทาน (เช่น Amlodipine 5-10 mg po)');
    managementList.push('นัดตรวจติดตามความดันโลหิตที่คลินิกผู้ป่วยนอก (OPD) ภายใน 24-72 ชั่วโมง');
  }

  return ddxList.join('\n');
}

// --- Patient Form HTML Template ---
const HYPERTENSION_FORM_HTML = `
<div id="cc-hypertension-section" class="space-y-6">
  <!-- Card 1: สาเหตุและตัวเลขความดันโลหิต -->
  <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
    <div class="flex items-center gap-2 mb-4 text-rose-700 font-semibold border-b border-rose-100 pb-2">
      <i data-lucide="activity" class="w-5 h-5"></i>
      <span>1. ข้อมูลการตรวจพบความดันโลหิตสูงและสาเหตุที่มารพ.</span>
    </div>

    <!-- 1.0 ระยะเวลาที่มีอาการหรือทราบค่าความดัน -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-slate-700 mb-1">
        1.0 ทราบว่าความดันโลหิตสูง หรือมีอาการผิดปกติมานานเท่าใด:
      </label>
      <div class="flex gap-3 items-center">
        <input type="number" id="htnDurationVal" min="1" max="365" placeholder="ระบุตัวเลข"
          class="w-32 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none">
        <select id="htnDurationUnit"
          class="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none">
          <option value="minutes">นาที</option>
          <option value="hours">ชั่วโมง</option>
          <option value="days">วัน</option>
          <option value="weeks">สัปดาห์</option>
          <option value="months">เดือน</option>
          <option value="years">ปี</option>
        </select>
      </div>
    </div>

    <!-- 1.1 สาเหตุที่มารพ.วันนี้ -->
    <div class="mb-5">
      <label class="block text-sm font-medium text-slate-700 mb-2">
        1.1 สาเหตุที่มารับการตรวจที่โรงพยาบาลในวันนี้:
      </label>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-700">
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="radio" name="htnVisitReason" value="high_bp_detected" class="text-rose-600 focus:ring-rose-500"
            onchange="handleHtnVisitReasonChange(this.value)">
          <span>ตรวจพบความดันโลหิตสูง</span>
        </label>
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="radio" name="htnVisitReason" value="other_appointment" class="text-rose-600 focus:ring-rose-500"
            onchange="handleHtnVisitReasonChange(this.value)">
          <span>มาตามนัดแพทย์ตรวจโรคอื่น</span>
        </label>
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="radio" name="htnVisitReason" value="suspected_symptoms" class="text-rose-600 focus:ring-rose-500"
            onchange="handleHtnVisitReasonChange(this.value)">
          <span>มาด้วยอาการที่สงสัยว่าเกิดจากความดันสูง</span>
        </label>
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="radio" name="htnVisitReason" value="other_reasons" class="text-rose-600 focus:ring-rose-500"
            onchange="handleHtnVisitReasonChange(this.value)">
          <span>มาด้วยอาการอื่นๆ ที่ไม่เกี่ยวกับโรคความดันสูง</span>
        </label>
      </div>

      <!-- Progressive disclosure for visit reason detail -->
      <div id="htnVisitReasonDetailContainer" class="hidden mt-3 pl-4 border-l-2 border-rose-300">
        <label class="block text-xs font-medium text-slate-600 mb-1">
          รายละเอียดเพิ่มเติมของสาเหตุที่มา:
        </label>
        <input type="text" id="htnVisitReasonDetail" placeholder="ระบุรายละเอียด เช่น โรคที่แพทย์นัด หรืออาการที่สงสัย..."
          class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none">
      </div>
    </div>

    <!-- 1.2 ตัวเลขความดันโลหิตสูงสุดที่วัดได้ก่อนมารพ. -->
    <div class="mb-5 bg-rose-50/50 p-4 rounded-lg border border-rose-100">
      <label class="block text-sm font-semibold text-rose-900 mb-2">
        1.2 ตัวเลขความดันโลหิตสูงสุดที่วัดได้ก่อนมารพ.:
      </label>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
        <div>
          <label class="block text-xs font-medium text-slate-600 mb-1">ความดันตัวบน (Systolic mmHg):</label>
          <input type="number" id="htnPeakSystolic" placeholder="เช่น 180" min="40" max="300"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none">
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-600 mb-1">ความดันตัวล่าง (Diastolic mmHg):</label>
          <input type="number" id="htnPeakDiastolic" placeholder="เช่น 110" min="30" max="200"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none">
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-600 mb-1">ชีพจร/อัตราเต้นหัวใจ (Pulse bpm):</label>
          <input type="number" id="htnPeakPulse" placeholder="เช่น 85" min="30" max="250"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none">
        </div>
      </div>
      <label class="flex items-center gap-2 mt-2 text-xs text-slate-700 cursor-pointer">
        <input type="checkbox" id="htnBpUnknownExact" value="unknown_exact" class="rounded text-rose-600 focus:ring-rose-500"
          onchange="handleHtnUnknownBpChange(this)">
        <span>จำตัวเลขแน่ชัดไม่ได้ แต่ทราบว่าสูงมากผิดปกติ</span>
      </label>
    </div>

    <!-- 1.3 แหล่งที่ตรวจพบค่าความดันดังกล่าว -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-slate-700 mb-2">
        1.3 สถานที่หรือแหล่งที่ตรวจพบค่าความดันดังกล่าว:
      </label>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-700">
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="radio" name="htnSource" value="home_digital" class="text-rose-600 focus:ring-rose-500">
          <span>วัดเองที่บ้าน (เครื่องวัดความดันดิจิทัล หรือ มีเจ้าหน้าที่มาวัด)</span>
        </label>
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="radio" name="htnSource" value="health_center" class="text-rose-600 focus:ring-rose-500">
          <span>สถานีอนามัย / รพ.สต. / คลินิกชุมชนอบอุ่น</span>
        </label>
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="radio" name="htnSource" value="private_clinic" class="text-rose-600 focus:ring-rose-500">
          <span>คลินิกเอกชน หรือ โรงพยาบาลเอกชน</span>
        </label>
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="radio" name="htnSource" value="triage_hospital" class="text-rose-600 focus:ring-rose-500">
          <span>จุดคัดกรองที่รพ. (หน้าห้องตรวจ / งานคัดกรอง)</span>
        </label>
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer md:col-span-2">
          <input type="radio" name="htnSource" value="other" class="text-rose-600 focus:ring-rose-500">
          <span>สถานที่อื่น หรือ ไม่แน่ชัด</span>
        </label>
      </div>
    </div>

    <!-- 1.4 ประวัติการเป็นโรคความดันโลหิตสูงเดิม -->
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-2">
        1.4 ประวัติโรคความดันโลหิตสูงเดิมของผู้ป่วย:
      </label>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-slate-700">
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="radio" name="htnKnownHx" value="known_htn" class="text-rose-600 focus:ring-rose-500">
          <span>มีโรคประจำตัวความดันสูงเดิม</span>
        </label>
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="radio" name="htnKnownHx" value="first_time" class="text-rose-600 focus:ring-rose-500">
          <span>เพิ่งตรวจพบครั้งแรกในชีวิต</span>
        </label>
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="radio" name="htnKnownHx" value="unsure" class="text-rose-600 focus:ring-rose-500">
          <span>ไม่แน่ใจประวัติเดิม</span>
        </label>
      </div>
    </div>
  </div>

  <!-- Card 2: การประเมินอวัยวะเป้าหมายเฉียบพลัน (Target Organ Damage Screen) -->
  <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
    <div class="flex items-center gap-2 mb-4 text-rose-700 font-semibold border-b border-rose-100 pb-2">
      <i data-lucide="shield-alert" class="w-5 h-5"></i>
      <span>2. อาการผิดปกติของร่างกายที่พบร่วมด้วยในขณะนี้</span>
    </div>

    <!-- 2.1 สมองและระบบประสาท -->
    <div class="mb-5">
      <label class="block text-sm font-medium text-slate-700 mb-2">
        2.1 อาการทางระบบประสาท ศีรษะ และสายตา (เลือกได้หลายข้อหากมี):
      </label>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-700">
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="checkbox" name="htnNeuroSigns" value="severe_headache_occipital" class="rounded text-rose-600 focus:ring-rose-500">
          <span>ปวดศีรษะรุนแรงเฉียบพลัน หรือปวดตื้อท้ายทอยอย่างมาก</span>
        </label>
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="checkbox" name="htnNeuroSigns" value="blurred_vision_scotoma" class="rounded text-rose-600 focus:ring-rose-500">
          <span>ตามัวลงเฉียบพลัน หรือเห็นภาพซ้อน / มองเห็นแสงวับวาบ</span>
        </label>
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="checkbox" name="htnNeuroSigns" value="facial_droop_dysarthria" class="rounded text-rose-600 focus:ring-rose-500">
          <span>ปากเบี้ยว หน้าเบี้ยว หรือพูดไม่ชัด ลิ้นแข็ง กลืนลำบาก</span>
        </label>
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="checkbox" name="htnNeuroSigns" value="hemiparesis_numbness" class="rounded text-rose-600 focus:ring-rose-500">
          <span>แขนขาข้างใดข้างหนึ่งอ่อนแรง ชาครึ่งซีก ยกไม่ขึ้น</span>
        </label>
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="checkbox" name="htnNeuroSigns" value="confusion_lethargy" class="rounded text-rose-600 focus:ring-rose-500">
          <span>ซึมลง สับสน พฤติกรรมเปลี่ยนแปลง หรือมีอาการชักเกร็งกระตุก</span>
        </label>
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="checkbox" name="htnNeuroSigns" value="sudden_monocular_vision_loss" class="rounded text-rose-600 focus:ring-rose-500">
          <span>ตาบอดข้างเดียวฉับพลันชั่วคราวหรือถาวร</span>
        </label>
      </div>
    </div>

    <!-- 2.2 หัวใจ หลอดเลือด และปอด -->
    <div class="mb-5">
      <label class="block text-sm font-medium text-slate-700 mb-2">
        2.2 อาการทางหน้าอก หัวใจ และการหายใจ (เลือกได้หลายข้อหากมี):
      </label>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-700">
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="checkbox" name="htnCardioSigns" value="crushing_chest_pressure" class="rounded text-rose-600 focus:ring-rose-500">
          <span>เจ็บแน่นอึดอัดกลางหน้าอกคล้ายของหนักทับ หรือร้าวไปกราม/แขนซ้าย</span>
        </label>
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="checkbox" name="htnCardioSigns" value="tearing_chest_back_pain" class="rounded text-rose-600 focus:ring-rose-500">
          <span>เจ็บแปล๊บรุนแรงคล้ายมีอะไรฉีกขาดในอก หรือเจ็บทะลุร้าวไปหลังสะบัก</span>
        </label>
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="checkbox" name="htnCardioSigns" value="orthopnea_pulmonary_edema" class="rounded text-rose-600 focus:ring-rose-500">
          <span>หายใจหอบเหนื่อยรุนแรง แน่นหน้าอกเมื่อนอนราบ ต้องลุกขึ้นมานั่งหายใจ</span>
        </label>
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="checkbox" name="htnCardioSigns" value="pink_frothy_sputum" class="rounded text-rose-600 focus:ring-rose-500">
          <span>ไอมีฟองเสมหะสีชมพูปน หรือไอมีเลือดปน</span>
        </label>
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer md:col-span-2">
          <input type="checkbox" name="htnCardioSigns" value="palpitations_racing_heart" class="rounded text-rose-600 focus:ring-rose-500">
          <span>ใจสั่นผิดปกติ รู้สึกหัวใจเต้นเร็วรัวหรือเต้นสะดุดแรง</span>
        </label>
      </div>
    </div>

    <!-- 2.3 ไตและการขับถ่าย -->
    <div class="mb-5">
      <label class="block text-sm font-medium text-slate-700 mb-2">
        2.3 อาการทางไต ระบบขับถ่ายปัสสาวะ และภาวะบวม (เลือกได้หลายข้อหากมี):
      </label>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-slate-700">
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="checkbox" name="htnRenalSigns" value="anuria_oliguria" class="rounded text-rose-600 focus:ring-rose-500">
          <span>ปัสสาวะไม่ออก หรือออกน้อยลงมากผิดปกติ</span>
        </label>
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="checkbox" name="htnRenalSigns" value="gross_hematuria_coca_cola" class="rounded text-rose-600 focus:ring-rose-500">
          <span>ปัสสาวะสีแดงสด มีลิ่มเลือด หรือสีน้ำล้างเนื้อ/โค้ก</span>
        </label>
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="checkbox" name="htnRenalSigns" value="leg_edema_bilateral" class="rounded text-rose-600 focus:ring-rose-500">
          <span>มีอาการบวมขึ้นที่ขาทั้งสองข้าง หลังเท้า หรือใบหน้า</span>
        </label>
      </div>
    </div>

    <!-- 2.4 สตรีตั้งครรภ์และหลังคลอด -->
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-2">
        2.4 สำหรับผู้ป่วยสตรี: สถานะการตั้งครรภ์และหลังคลอด:
      </label>
      <div class="grid grid-cols-1 gap-2 text-sm text-slate-700">
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="radio" name="htnPregnancyStatus" value="none" class="text-rose-600 focus:ring-rose-500"
            onchange="handleHtnPregnancyChange(this.value)">
          <span>ไม่ได้ตั้งครรภ์ / ชาย / ไม่อยู่ในเกณฑ์</span>
        </label>
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="radio" name="htnPregnancyStatus" value="pregnancy_lt_20wks" class="text-rose-600 focus:ring-rose-500"
            onchange="handleHtnPregnancyChange(this.value)">
          <span>กำลังตั้งครรภ์ (อายุครรภ์น้อยกว่า 20 สัปดาห์)</span>
        </label>
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="radio" name="htnPregnancyStatus" value="pregnancy_gt_20wks" class="text-rose-600 focus:ring-rose-500"
            onchange="handleHtnPregnancyChange(this.value)">
          <span>กำลังตั้งครรภ์ (อายุครรภ์เกิน 20 สัปดาห์) หรือเพิ่งคลอดบุตรไม่เกิน 6 สัปดาห์</span>
        </label>
      </div>

      <!-- Progressive disclosure for pregnancy symptoms > 20 weeks -->
      <div id="htnPregnancySymptomsSub" class="hidden mt-3 pl-4 border-l-2 border-rose-300">
        <label class="block text-xs font-medium text-slate-600 mb-2">
          อาการร่วมสำคัญในสตรีตั้งครรภ์หรือหลังคลอด (เลือกได้หลายข้อหากมี):
        </label>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-slate-700">
          <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <input type="checkbox" name="htnPregnancySigns" value="ruq_epigastric_pain" class="rounded text-rose-600 focus:ring-rose-500">
            <span>มีอาการจุกแน่นใต้ลิ้นปี่ หรือปวดแน่นชายโครงขวาอย่างมาก</span>
          </label>
          <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <input type="checkbox" name="htnPregnancySigns" value="flashing_lights_vision" class="rounded text-rose-600 focus:ring-rose-500">
            <span>ตาพร่ามัว มองเห็นแสงวับวาบระยิบระยับ</span>
          </label>
          <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <input type="checkbox" name="htnPregnancySigns" value="severe_throbbing_headache" class="rounded text-rose-600 focus:ring-rose-500">
            <span>ปวดศีรษะรุนแรงต่อเนื่อง ทานยาแก้ปวดแล้วไม่ทุเลา</span>
          </label>
        </div>
      </div>
    </div>
  </div>

  <!-- Card 3: สัญญาณเตือนและอาการร่วมทั่วไป -->
  <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
    <div class="flex items-center gap-2 mb-4 text-rose-700 font-semibold border-b border-rose-100 pb-2">
      <i data-lucide="alert-circle" class="w-5 h-5"></i>
      <span>3. สัญญาณเตือนและอาการร่วมทั่วไป</span>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-slate-700">
      <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
        <input type="checkbox" name="htnGeneralSigns" value="dizziness_cold_sweat" class="rounded text-rose-600 focus:ring-rose-500">
        <span>หน้ามืด วูบคล้ายจะเป็นลม เวียนศีรษะ หรือเหงื่อแตกตัวเย็น</span>
      </label>
      <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
        <input type="checkbox" name="htnGeneralSigns" value="severe_epistaxis" class="rounded text-rose-600 focus:ring-rose-500">
        <span>มีเลือดกำเดาไหลออกทางจมูกปริมาณมากผิดปกติ</span>
      </label>
      <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
        <input type="checkbox" name="htnGeneralSigns" value="projectile_vomiting" class="rounded text-rose-600 focus:ring-rose-500">
        <span>คลื่นไส้ อาเจียนพุ่งหลายครั้งติดต่อกัน</span>
      </label>
    </div>
  </div>

  <!-- Card 4: การใช้ยาลดความดันและปัจจัยกระตุ้นเฉียบพลัน -->
  <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
    <div class="flex items-center gap-2 mb-4 text-rose-700 font-semibold border-b border-rose-100 pb-2">
      <i data-lucide="pill" class="w-5 h-5"></i>
      <span>4. การใช้ยาลดความดันและปัจจัยกระตุ้นเฉียบพลัน</span>
    </div>

    <!-- 4.1 ประวัติการรับประทานยาลดความดัน -->
    <div class="mb-5">
      <label class="block text-sm font-medium text-slate-700 mb-2">
        4.1 ประวัติการรับประทานยาลดความดันโลหิตของผู้ป่วย:
      </label>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-700">
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="radio" name="htnCompliance" value="regular" class="text-rose-600 focus:ring-rose-500"
            onchange="handleHtnComplianceChange(this.value)">
          <span>รับประทานยาความดันสม่ำเสมอตามแพทย์สั่ง ครบถ้วน</span>
        </label>
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="radio" name="htnCompliance" value="missed_days" class="text-rose-600 focus:ring-rose-500"
            onchange="handleHtnComplianceChange(this.value)">
          <span>ลืมรับประทานยา หรือขาดยามาหลายวัน</span>
        </label>
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="radio" name="htnCompliance" value="self_adjusted" class="text-rose-600 focus:ring-rose-500"
            onchange="handleHtnComplianceChange(this.value)">
          <span>ปรับขนาดยาเอง หรือหยุดรับประทานยาเอง</span>
        </label>
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="radio" name="htnCompliance" value="no_prior_rx" class="text-rose-600 focus:ring-rose-500"
            onchange="handleHtnComplianceChange(this.value)">
          <span>ไม่เคยมียาลดความดันมาก่อน (ไม่เคยรับการรักษา)</span>
        </label>
      </div>

      <!-- Progressive disclosure for missed days -->
      <div id="htnMissedDaysContainer" class="hidden mt-3 pl-4 border-l-2 border-rose-300">
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium text-slate-600">ขาดยามาประมาณ:</label>
          <input type="number" id="htnMissedDays" placeholder="เช่น 3" min="1" max="365"
            class="w-24 px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none">
          <span class="text-xs text-slate-600">วัน</span>
        </div>
      </div>
    </div>

    <!-- 4.2 ปัจจัยกระตุ้นเฉียบพลันและสารที่มีผลต่อความดันโลหิต -->
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-2">
        4.2 ปัจจัยกระตุ้นเฉียบพลันและสารที่มีผลต่อความดันโลหิต (เลือกได้หลายข้อหากมี):
      </label>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-700">
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="checkbox" name="htnTriggers" value="stress_insomnia" class="rounded text-rose-600 focus:ring-rose-500">
          <span>มีความเครียด วิตกกังวล หรือนอนไม่หลับอย่างหนักติดต่อกัน</span>
        </label>
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="checkbox" name="htnTriggers" value="severe_pain_other" class="rounded text-rose-600 focus:ring-rose-500">
          <span>มีอาการปวดรุนแรงที่ตำแหน่งอื่นของร่างกาย</span>
        </label>
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="checkbox" name="htnTriggers" value="energy_drink_coffee_alc" class="rounded text-rose-600 focus:ring-rose-500">
          <span>ดื่มเครื่องดื่มชูกำลัง กาแฟเข้มข้น หรือแอลกอฮอล์</span>
        </label>
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input type="checkbox" name="htnTriggers" value="nsaids_cold_steroid" class="rounded text-rose-600 focus:ring-rose-500">
          <span>เพิ่งรับประทานยาแก้หวัดคัดจมูก ยาแก้ปวดข้อแก้เส้น (NSAIDs) หรือสเตียรอยด์</span>
        </label>
        <label class="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer md:col-span-2">
          <input type="checkbox" name="htnTriggers" value="substance_stimulants" class="rounded text-rose-600 focus:ring-rose-500">
          <span>มีประวัติใช้สารเสพติด หรือสารกระตุ้นประสาท (เช่น ยาบ้า, ยาไอซ์, โคเคน, กัญชา, กระท่อม)</span>
        </label>
      </div>
    </div>
  </div>
</div>
`;

// --- Master Module Definition ---
const hypertensionModule = {
  id: 'hypertension',
  recordCc: 'hypertension',
  algorithm: 'hypertension-screen-protocol',
  sectionDomId: 'cc-hypertension-section',
  formHtml: HYPERTENSION_FORM_HTML,

  init: function() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  },

  collectIntake: function(ctx = {}) {
    const durVal = parseInt(document.getElementById('htnDurationVal')?.value, 10);
    const durUnit = document.getElementById('htnDurationUnit')?.value || 'days';

    const getRadio = (name) => {
      const el = document.querySelector(`input[name="${name}"]:checked`);
      return el ? el.value : null;
    };
    const getChecks = (name) => {
      return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(el => el.value);
    };

    const visitReason = getRadio('htnVisitReason');
    const visitReasonDetail = document.getElementById('htnVisitReasonDetail')?.value?.trim() || '';

    const peakSys = parseInt(document.getElementById('htnPeakSystolic')?.value, 10);
    const peakDia = parseInt(document.getElementById('htnPeakDiastolic')?.value, 10);
    const peakPulse = parseInt(document.getElementById('htnPeakPulse')?.value, 10);
    const bpUnknownExact = document.getElementById('htnBpUnknownExact')?.checked || false;

    const source = getRadio('htnSource');
    const knownHx = getRadio('htnKnownHx');

    const neuroSigns = getChecks('htnNeuroSigns');
    const cardioSigns = getChecks('htnCardioSigns');
    const renalSigns = getChecks('htnRenalSigns');

    const pregStatus = getRadio('htnPregnancyStatus');
    const pregSigns = getChecks('htnPregnancySigns');

    const generalSigns = getChecks('htnGeneralSigns');
    const compliance = getRadio('htnCompliance');
    const missedDaysVal = parseInt(document.getElementById('htnMissedDays')?.value, 10);
    const triggers = getChecks('htnTriggers');

    const otherSymptomsFree = document.getElementById('sx_other_free')?.value?.trim() || ctx.otherSymptomsFree || '';

    const rec = {
      id: ctx.recordId || ctx.id,
      queue_number: ctx.queueNumber || ctx.queue_number,
      hn: ctx.randomHn || ctx.hn,
      name: ctx.patientName || ctx.name,
      age: ctx.patientAge !== undefined ? ctx.patientAge : ctx.age,
      gender: ctx.gender,
      chief_complaint: 'hypertension',
      chief_complaint_title: 'ตรวจพบความดันโลหิตสูง',
      timestamp: new Date().toISOString(),
      status: ctx.recordStatus || ctx.status || 'waiting',
      durationVal: !isNaN(durVal) ? durVal : null,
      durationUnit: durUnit,
      hospRecordStatus: ctx.hospRecordStatus || 'unspecified',
      underlying: ctx.underlying || [],
      drugAllergy: ctx.drugAllergy || 'ไม่ได้ระบุ',
      currentMeds: ctx.currentMeds || 'ไม่ได้ระบุ',
      otherSymptomsFree,
      doctor_notes: ctx.preservedDoctorNotes || ctx.doctor_notes || { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },

      htnVisitReason: visitReason,
      htnVisitReasonDetail: visitReasonDetail,
      htnPeakSystolic: !isNaN(peakSys) ? peakSys : null,
      htnPeakDiastolic: !isNaN(peakDia) ? peakDia : null,
      htnPeakPulse: !isNaN(peakPulse) ? peakPulse : null,
      htnBpUnknownExact: bpUnknownExact,
      htnSource: source,
      htnKnownHx: knownHx,
      htnNeuroSigns: neuroSigns,
      htnCardioSigns: cardioSigns,
      htnRenalSigns: renalSigns,
      htnPregnancyStatus: pregStatus,
      htnPregnancySigns: pregSigns,
      htnGeneralSigns: generalSigns,
      htnCompliance: compliance,
      htnMissedDays: !isNaN(missedDaysVal) ? missedDaysVal : null,
      htnTriggers: triggers
    };

    updateHypertensionOutputs(rec);
    return rec;
  },

  collectFormData: function(ctx = {}) {
    return this.collectIntake(ctx);
  },

  hydrateForm: function(data = {}) {
    if (data.durationVal) {
      const valEl = document.getElementById('htnDurationVal');
      if (valEl) valEl.value = data.durationVal;
    }
    if (data.durationUnit) {
      const unitEl = document.getElementById('htnDurationUnit');
      if (unitEl) unitEl.value = data.durationUnit;
    }

    const setRadio = (name, val) => {
      if (!val) return;
      const el = document.querySelector(`input[name="${name}"][value="${val}"]`);
      if (el) el.checked = true;
    };
    const setChecks = (name, arr) => {
      if (!Array.isArray(arr)) return;
      arr.forEach(val => {
        const el = document.querySelector(`input[name="${name}"][value="${val}"]`);
        if (el) el.checked = true;
      });
    };

    setRadio('htnVisitReason', data.htnVisitReason);
    if (data.htnVisitReason) {
      handleHtnVisitReasonChange(data.htnVisitReason);
    }
    if (data.htnVisitReasonDetail) {
      const detailEl = document.getElementById('htnVisitReasonDetail');
      if (detailEl) detailEl.value = data.htnVisitReasonDetail;
    }

    if (data.htnPeakSystolic) {
      const sEl = document.getElementById('htnPeakSystolic');
      if (sEl) sEl.value = data.htnPeakSystolic;
    }
    if (data.htnPeakDiastolic) {
      const dEl = document.getElementById('htnPeakDiastolic');
      if (dEl) dEl.value = data.htnPeakDiastolic;
    }
    if (data.htnPeakPulse) {
      const pEl = document.getElementById('htnPeakPulse');
      if (pEl) pEl.value = data.htnPeakPulse;
    }
    if (data.htnBpUnknownExact) {
      const unkEl = document.getElementById('htnBpUnknownExact');
      if (unkEl) unkEl.checked = true;
    }

    setRadio('htnSource', data.htnSource);
    setRadio('htnKnownHx', data.htnKnownHx);

    setChecks('htnNeuroSigns', data.htnNeuroSigns);
    setChecks('htnCardioSigns', data.htnCardioSigns);
    setChecks('htnRenalSigns', data.htnRenalSigns);

    setRadio('htnPregnancyStatus', data.htnPregnancyStatus);
    if (data.htnPregnancyStatus) {
      handleHtnPregnancyChange(data.htnPregnancyStatus);
    }
    setChecks('htnPregnancySigns', data.htnPregnancySigns);

    setChecks('htnGeneralSigns', data.htnGeneralSigns);

    setRadio('htnCompliance', data.htnCompliance);
    if (data.htnCompliance) {
      handleHtnComplianceChange(data.htnCompliance);
    }
    if (data.htnMissedDays) {
      const mEl = document.getElementById('htnMissedDays');
      if (mEl) mEl.value = data.htnMissedDays;
    }

    setChecks('htnTriggers', data.htnTriggers);
  },

  isRedFlag: function(patient) {
    const rfs = evaluateHypertensionRedFlags(patient);
    return rfs.length > 0;
  },

  evaluateRedFlags: evaluateHypertensionRedFlags,
  updateOutputs: updateHypertensionOutputs,
  renderRapidHpi: renderHypertensionRapidHpi,
  renderNarrative: renderHypertensionNarrative,
  renderDoctorHpi: renderHypertensionDoctorHpi,
  generateCds: generateHypertensionCds,

  // --- Seed Patients Registry ---
  seedPatients: [
    // Case 1: Hypertensive Emergency with Acute Aortic Dissection (ESI 1)
    {
      id: 'case-htn-01',
      queue_number: 'E1-101',
      hn: '7890301',
      name: 'นายมนัส แน่นอกร้าวหลัง',
      age: 58,
      gender: 'ชาย',
      chief_complaint: 'hypertension',
      chief_complaint_title: 'ตรวจพบความดันโลหิตสูง',
      timestamp: '2026-11-03T18:00:00.000Z',
      status: 'waiting',
      durationVal: 2,
      durationUnit: 'hours',
      hospRecordStatus: 'complete',
      underlying: ['ความดันสูง (HT)'],
      drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร',
      currentMeds: 'Amlodipine 10 mg 1 tab po od',
      otherSymptomsFree: 'เจ็บแน่นหน้าอกรุนแรงเหมือนอะไรฉีกขาดในอก ร้าวทะลุไปหลัง เหงื่อแตกท่วมตัว วัดความดันที่บ้านได้ 210/120',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.6, sbp: 210, dbp: 120, bp: '210/120', pr: 96, rr: 22, spo2: 98 },
      esi_level: 1,

      htnVisitReason: 'high_bp_detected',
      htnVisitReasonDetail: '',
      htnPeakSystolic: 210,
      htnPeakDiastolic: 120,
      htnPeakPulse: 96,
      htnBpUnknownExact: false,
      htnSource: 'home_digital',
      htnKnownHx: 'known_htn',
      htnNeuroSigns: [],
      htnCardioSigns: ['tearing_chest_back_pain'],
      htnRenalSigns: [],
      htnPregnancyStatus: 'none',
      htnPregnancySigns: [],
      htnGeneralSigns: ['dizziness_cold_sweat'],
      htnCompliance: 'regular',
      htnMissedDays: null,
      htnTriggers: []
    },

    // Case 2: Hypertensive Emergency with Acute Pulmonary Edema (ESI 1)
    {
      id: 'case-htn-02',
      queue_number: 'E1-102',
      hn: '7890302',
      name: 'นางสมร หอบเหนื่อยฟองชมพู',
      age: 67,
      gender: 'หญิง',
      chief_complaint: 'hypertension',
      chief_complaint_title: 'ตรวจพบความดันโลหิตสูง',
      timestamp: '2026-11-03T18:30:00.000Z',
      status: 'waiting',
      durationVal: 4,
      durationUnit: 'hours',
      hospRecordStatus: 'complete',
      underlying: ['ความดันสูง (HT)', 'หัวใจล้มเหลว (Heart Failure)'],
      drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร',
      currentMeds: 'Enalapril 20 mg 1 tab bid (ขาดยามา 2 สัปดาห์)',
      otherSymptomsFree: 'หายใจหอบเหนื่อยรุนแรง นอนราบไม่ได้ ไอมีฟองเสมหะสีชมพูจางๆ ขาดยาความดันมา 2 สัปดาห์',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.8, sbp: 200, dbp: 110, bp: '200/110', pr: 112, rr: 28, spo2: 88 },
      esi_level: 1,

      htnVisitReason: 'suspected_symptoms',
      htnVisitReasonDetail: 'หายใจไม่อิ่ม แน่นหน้าอก หอบเหนื่อย',
      htnPeakSystolic: 200,
      htnPeakDiastolic: 110,
      htnPeakPulse: 112,
      htnBpUnknownExact: false,
      htnSource: 'triage_hospital',
      htnKnownHx: 'known_htn',
      htnNeuroSigns: [],
      htnCardioSigns: ['orthopnea_pulmonary_edema', 'pink_frothy_sputum'],
      htnRenalSigns: ['leg_edema_bilateral'],
      htnPregnancyStatus: 'none',
      htnPregnancySigns: [],
      htnGeneralSigns: [],
      htnCompliance: 'missed_days',
      htnMissedDays: 14,
      htnTriggers: []
    },

    // Case 3: Preeclampsia with Severe Features in Pregnancy (ESI 2)
    {
      id: 'case-htn-03',
      queue_number: 'E2-103',
      hn: '7890303',
      name: 'น.ส.พัชรา ตั้งครรภ์ความดันสูง',
      age: 29,
      gender: 'หญิง',
      chief_complaint: 'hypertension',
      chief_complaint_title: 'ตรวจพบความดันโลหิตสูง',
      timestamp: '2026-11-03T19:00:00.000Z',
      status: 'waiting',
      durationVal: 1,
      durationUnit: 'days',
      hospRecordStatus: 'complete',
      underlying: [],
      drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร',
      currentMeds: 'วิตามินบำรุงครรภ์ Obimin-AZ',
      otherSymptomsFree: 'ตั้งครรภ์ 34 สัปดาห์ ปวดศีรษะรุนแรง ตาพร่ามัวเห็นแสงวับวาบ จุกแน่นใต้ลิ้นปี่และชายโครงขวา ขาบวมสองข้าง',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.7, sbp: 175, dbp: 110, bp: '175/110', pr: 88, rr: 20, spo2: 99 },
      esi_level: 2,

      htnVisitReason: 'high_bp_detected',
      htnVisitReasonDetail: '',
      htnPeakSystolic: 175,
      htnPeakDiastolic: 110,
      htnPeakPulse: 88,
      htnBpUnknownExact: false,
      htnSource: 'health_center',
      htnKnownHx: 'first_time',
      htnNeuroSigns: ['severe_headache_occipital', 'blurred_vision_scotoma'],
      htnCardioSigns: [],
      htnRenalSigns: ['leg_edema_bilateral'],
      htnPregnancyStatus: 'pregnancy_gt_20wks',
      htnPregnancySigns: ['ruq_epigastric_pain', 'flashing_lights_vision'],
      htnGeneralSigns: [],
      htnCompliance: 'no_prior_rx',
      htnMissedDays: null,
      htnTriggers: []
    },

    // Case 4: Asymptomatic Hypertensive Urgency from Non-Compliance (ESI 3)
    {
      id: 'case-htn-04',
      queue_number: 'E3-104',
      hn: '7890304',
      name: 'นายสมชาย ความดันสูงวัดได้ที่คลินิก',
      age: 52,
      gender: 'ชาย',
      chief_complaint: 'hypertension',
      chief_complaint_title: 'ตรวจพบความดันโลหิตสูง',
      timestamp: '2026-11-03T19:30:00.000Z',
      status: 'waiting',
      durationVal: 3,
      durationUnit: 'days',
      hospRecordStatus: 'self',
      underlying: ['ความดันสูง (HT)'],
      drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร',
      currentMeds: 'Amlodipine 5 mg 1 tab po od',
      otherSymptomsFree: 'ไปตรวจตามนัดเบาหวานที่ รพ.สต. พบความดัน 185/105 ไม่มีอาการผิดปกติใดๆ ไม่เจ็บอก ไม่เหนื่อย แขนขาไม่อ่อนแรง ลืมกินยา 3 วัน',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.5, sbp: 185, dbp: 105, bp: '185/105', pr: 78, rr: 16, spo2: 100 },
      esi_level: 3,

      htnVisitReason: 'other_appointment',
      htnVisitReasonDetail: 'มาเจาะเลือดตรวจเบาหวานตามนัด',
      htnPeakSystolic: 185,
      htnPeakDiastolic: 105,
      htnPeakPulse: 78,
      htnBpUnknownExact: false,
      htnSource: 'health_center',
      htnKnownHx: 'known_htn',
      htnNeuroSigns: [],
      htnCardioSigns: [],
      htnRenalSigns: [],
      htnPregnancyStatus: 'none',
      htnPregnancySigns: [],
      htnGeneralSigns: [],
      htnCompliance: 'missed_days',
      htnMissedDays: 3,
      htnTriggers: ['stress_insomnia']
    }
  ]
};

// Register module in Ratchaburi ER Core Registry
if (typeof registerCcModule === 'function') {
  registerCcModule(hypertensionModule);
} else if (typeof window !== 'undefined' && typeof window.registerCcModule === 'function') {
  window.registerCcModule(hypertensionModule);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = hypertensionModule;
}
