// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 10_altered_mental.js
// อาการนำ: ซึมลง / สับสนเฉียบพลัน / ระดับความรู้สึกตัวเปลี่ยนแปลง (Altered Mental Status / Delirium / Lethargy)
// ไฟล์นี้แยกอิสระสำหรับอาการนำ altered_mental เพื่อให้ทีมแพทย์และ IT โรงพยาบาลนำไปพัฒนาต่อได้โดยไม่กระทบระบบหลัก
// =========================================================================

function handleAlteredMentalBaselineChange(val) {
  const wrap = document.getElementById('alteredMentalBedriddenDetailsWrap');
  if (val === 'bedridden_totally_dependent') {
    if (wrap) wrap.classList.remove('hidden');
  } else {
    if (wrap) wrap.classList.add('hidden');
    document.querySelectorAll('input[name="alteredMentalBedriddenCommunication"]').forEach(r => { r.checked = false; });
    document.querySelectorAll('input[name="alteredMentalBedriddenMobility"]').forEach(r => { r.checked = false; });
    document.querySelectorAll('input[name="alteredMentalBedriddenFeeding"]').forEach(r => { r.checked = false; });
    document.querySelectorAll('input[name="alteredMentalBedriddenElimination"]').forEach(r => { r.checked = false; });
  }
}

function handleAlteredMentalLsnUnknownToggle(el) {
  const dateInput = document.getElementById('alteredMentalLsnDate');
  const timeInput = document.getElementById('alteredMentalLsnTime');
  if (el && el.checked) {
    if (dateInput) { dateInput.value = ''; dateInput.disabled = true; }
    if (timeInput) { timeInput.value = ''; timeInput.disabled = true; }
  } else {
    if (dateInput) dateInput.disabled = false;
    if (timeInput) timeInput.disabled = false;
  }
}

function handleAlteredMentalHeadTraumaToggle(el) {
  const wrap = document.getElementById('alteredMentalHeadTraumaWrap');
  if (el && el.checked) {
    if (wrap) wrap.classList.remove('hidden');
    const noneCb = document.getElementById('alteredMentalNeuroNoneCb');
    if (noneCb) noneCb.checked = false;
  } else {
    if (wrap) wrap.classList.add('hidden');
    document.querySelectorAll('input[name="alteredMentalHeadTraumaTime"]').forEach(r => { r.checked = false; });
    document.querySelectorAll('input[name="alteredMentalRemoteTraumaTime"]').forEach(r => { r.checked = false; });
  }
}

function handleAlteredMentalRemoteTraumaToggle(el) {
  handleAlteredMentalHeadTraumaToggle(el);
}

function handleAlteredMentalHeadWoundToggle(el) {
  const wrap = document.getElementById('alteredMentalHeadWoundDetailsWrap');
  if (el && el.checked) {
    if (wrap) wrap.classList.remove('hidden');
    const noneCb = document.getElementById('alteredMentalNeuroNoneCb');
    if (noneCb) noneCb.checked = false;
  } else {
    if (wrap) wrap.classList.add('hidden');
    const locInput = document.getElementById('alteredMentalHeadWoundLocation');
    if (locInput) locInput.value = '';
  }
}

function handleAlteredMentalNeuroNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="alteredMentalNeuroFlags"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
    const traumaWrap = document.getElementById('alteredMentalHeadTraumaWrap');
    if (traumaWrap) traumaWrap.classList.add('hidden');
    document.querySelectorAll('input[name="alteredMentalHeadTraumaTime"]').forEach(r => { r.checked = false; });
    document.querySelectorAll('input[name="alteredMentalRemoteTraumaTime"]').forEach(r => { r.checked = false; });
    const woundWrap = document.getElementById('alteredMentalHeadWoundDetailsWrap');
    if (woundWrap) woundWrap.classList.add('hidden');
    const locInput = document.getElementById('alteredMentalHeadWoundLocation');
    if (locInput) locInput.value = '';
  }
}

function handleAlteredMentalGiToggle() {
  const abdpainCb = document.getElementById('alteredMentalGiAbdpain');
  const abdpainWrap = document.getElementById('alteredMentalAbdpainWrap');
  if (abdpainCb && abdpainWrap) {
    if (abdpainCb.checked) {
      abdpainWrap.classList.remove('hidden');
    } else {
      abdpainWrap.classList.add('hidden');
      document.querySelectorAll('input[name="alteredMentalAbdpainLocs"]').forEach(cb => { cb.checked = false; });
      document.querySelectorAll('input[name="alteredMentalAbdpainChar"]').forEach(r => { r.checked = false; });
    }
  }

  const diarrheaCb = document.getElementById('alteredMentalGiDiarrhea');
  const diarrheaWrap = document.getElementById('alteredMentalDiarrheaWrap');
  if (diarrheaCb && diarrheaWrap) {
    if (diarrheaCb.checked) {
      diarrheaWrap.classList.remove('hidden');
    } else {
      diarrheaWrap.classList.add('hidden');
      const f = document.getElementById('alteredMentalDiarrheaFreq');
      if (f) f.value = '';
      document.querySelectorAll('input[name="alteredMentalDiarrheaStools"]').forEach(cb => { cb.checked = false; });
    }
  }

  const vomitCb = document.getElementById('alteredMentalGiVomit');
  const vomitWrap = document.getElementById('alteredMentalVomitWrap');
  if (vomitCb && vomitWrap) {
    if (vomitCb.checked) {
      vomitWrap.classList.remove('hidden');
    } else {
      vomitWrap.classList.add('hidden');
      const f = document.getElementById('alteredMentalVomitFreq');
      if (f) f.value = '';
      document.querySelectorAll('input[name="alteredMentalVomitContents"]').forEach(cb => { cb.checked = false; });
    }
  }
}

function handleAlteredMentalToxinToggle(el) {
  const wrap = document.getElementById('alteredMentalToxinDetailsWrap');
  if (el && el.checked) {
    if (wrap) wrap.classList.remove('hidden');
    const noneCb = document.getElementById('alteredMentalRiskNoneCb');
    if (noneCb) noneCb.checked = false;
  } else {
    if (wrap) wrap.classList.add('hidden');
    const input = document.getElementById('alteredMentalToxinDetails');
    if (input) input.value = '';
  }
}

function handleAlteredMentalRiskNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="alteredMentalRiskPrecipitants"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
    const wrap = document.getElementById('alteredMentalToxinDetailsWrap');
    if (wrap) wrap.classList.add('hidden');
    const input = document.getElementById('alteredMentalToxinDetails');
    if (input) input.value = '';
  }
}

function detectAlteredMentalRedFlags(patient) {
  if (!patient || patient.chief_complaint !== 'altered_mental') return [];
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


    function updateAlteredMentalOutputs(patient) {
      const unitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
      const durationText = patient.durationVal ? `${patient.durationVal} ${unitMap[patient.durationUnit] || 'ชั่วโมง'}` : 'ไม่ระบุ';

      const reporterMap = {
        caregiver_family: 'ญาติหรือผู้ดูแลใกล้ชิดที่อาศัยอยู่ร่วมกับผู้ป่วยทุกวัน (Primary caregiver)',
        relative_occasional: 'ญาติที่ไม่ได้อยู่ด้วยกันประจำ เพิ่งมาเยี่ยมและสังเกตเห็น (Occasional visiting relative)',
        witness_rescuer: 'ผู้พบเห็นเหตุการณ์ / เพื่อนร่วมงาน / กู้ชีพ (Bystander / EMS)',
        patient_confused: 'ผู้ป่วยพยายามเล่าเองแต่สับสน (Confused patient self-report)',
        unspecified: 'ไม่ได้ระบุผู้ให้ประวัติ'
      };

      const baselineMap = {
        normal_independent: 'เดิมปกติ ช่วยเหลือตัวเองได้สมบูรณ์ จำเหตุการณ์และบุคคลได้แม่นยำ (Baseline intact cognition)',
        mild_cognitive_independent: 'เดิมหลงลืมเล็กน้อยตามวัย แต่ช่วยเหลือตัวเองในชีวิตประจำวันได้ (Mild cognitive impairment)',
        known_dementia_partially_dependent: 'มีภาวะสมองเสื่อมเดิม ช่วยเหลือตัวเองได้บางส่วน แต่ครั้งนี้ทรุดลงเฉียบพลัน 🚩 (Acute-on-Chronic Delirium)',
        bedridden_totally_dependent: 'ผู้ป่วยติดเตียง ช่วยเหลือตัวเองไม่ได้เดิม แต่ครั้งนี้ระดับการตื่นตัวลดลงผิดปกติ 🚩 (Bedridden with Acute Deterioration)'
      };

      const bedriddenCommMap = {
        talk_normal: 'เดิมพูดคุยสื่อสารเป็นประโยคได้รู้เรื่อง',
        talk_limited: 'เดิมพูดได้เป็นคำสั้นๆ ถามตอบช้า',
        mute_sounds: 'เดิมไม่พูด ส่งเสียงอืออา'
      };
      const bedriddenMobMap = {
        turn_sit: 'เดิมพลิกตัว/พยุงนั่งบนเตียงได้',
        limb_move_only: 'เดิมขยับแขนขาได้ แต่นั่งไม่ได้',
        flaccid_no_move: 'เดิมนอนนิ่ง ไม่ขยับแขนขาเอง'
      };
      const bedriddenFeedMap = {
        oral_self: 'เดิมรับประทานอาหารเองได้',
        oral_assisted: 'เดิมญาติต้องป้อนอาหาร',
        ng_tube: 'เดิมให้อาหารทางสายยางจมูก (NG tube)',
        peg_tube: 'เดิมให้อาหารทางสายหน้าท้อง (PEG tube)'
      };
      const bedriddenElimMap = {
        continent: 'เดิมขับถ่ายรู้ตัว บอกได้',
        foley_catheter: 'เดิมคาสายสวนปัสสาวะ (Foley catheter)',
        diapers: 'เดิมใส่ผ้าอ้อมสำเร็จรูป ขับถ่ายไม่รู้ตัว'
      };

      const onsetPatternMap = {
        hyperacute_minutes: 'เกิดขึ้นทันทีทันใด ปุบปับในหลักนาที 🚩 (Hyperacute onset)',
        acute_hours: 'ค่อยๆ เป็นมากขึ้นชัดเจนภายในไม่กี่ชั่วโมงของวันนี้ 🚩 (Acute deterioration)',
        subacute_days: 'ค่อยๆ ซึมลง สับสน หรือพฤติกรรมเปลี่ยนสะสมมาหลายวัน (Subacute course)',
        fluctuating_day_night: 'อาการขึ้นๆ ลงๆ เดี๋ยวรู้เรื่องเดี๋ยวสับสน โดยเฉพาะช่วงพลบค่ำหรือกลางคืน (Fluctuating course / Delirium)'
      };

      const consciousLevelMap = {
        drowsy_lethargic: 'ซึมลง ปลุกตื่นง่ายเมื่อเรียก ลืมตาตอบสนองได้ช้า แต่เมื่อหยุดคุยจะผล็อยหลับไปใหม่ (Drowsy / Lethargic)',
        stupor_pain_only: 'หลับลึก ปลุกด้วยเสียงไม่ตื่น ต้องเขย่าตัวแรงๆ หรือกดเจ็บจึงจะลืมตาหรือขยับตัว 🚩 (Stupor)',
        coma_unresponsive: 'ไม่ลืมตา ไม่ตอบสนองต่อเสียงเรียกและการเขย่าตัวแรงๆ 🚩 (Coma / GCS <= 8)',
        awake_but_confused: 'ลืมตาได้เอง แต่พูดคุยสับสน สื่อสารไม่รู้เรื่อง จำบุคคล/เวลา/สถานที่ไม่ได้ (Awake but Confused / Delirious)'
      };

      const cognitiveMap = {
        inattention_unfocused: 'ขาดสมาธิ เหม่อลอย ไม่สามารถจดจ่อกับการพูดคุยได้ (Inattention)',
        disoriented_time_place: 'สับสนวันเวลา สถานที่ หรือบุคคล (Disorientation to time/place/person)',
        agitated_restless: 'กระสับกระส่าย เอะอะโวยวาย ลุกเดินพล่าน พยายามดึงสายน้ำเกลือหรือปีนเตียง (Hyperactive Agitation)',
        hallucinations_paranoid: 'มองเห็นภาพหลอน ได้ยินเสียงแว่ว หรือมีความคิดหวาดระแวง (Visual/Auditory Hallucinations)',
        speech_slurred_or_incoherent: 'พูดจาเลอะเลือน วกไปวนมา ไม่เป็นประโยค หรือพูดไม่ชัด (Incoherent speech / Dysarthria)',
        apathy_mute: 'นิ่งเฉย ไม่ยอมพูด ไม่ยอมสบตา (Hypoactive Apathy / Mutism)',
        poor_intake_refusal: 'ไม่รับประทานอาหารและน้ำเลย หรือดื่มน้ำได้น้อยมาก (Poor oral intake refusal)'
      };

      const neuroFlagsMap = {
        focal_weakness_numbness: 'แขนหรือขาอ่อนแรงครึ่งซีก ปากเบี้ยว ยิ้มไม่เท่ากัน หรือชาครึ่งซีก 🚩 (Focal Neurologic Deficit / Acute Stroke)',
        seizure_or_abnormal_movement: 'มีอาการชักเกร็ง กระตุก ตาค้าง เหม่อลอย เคี้ยวปาก หรือสะบัดมือเท้าผิดปกติ 🚩 (Seizure / Non-convulsive status)',
        stiff_neck_or_severe_headache: 'คอแข็งเกร็ง ก้มคอไม่ลง หรือปวดศีรษะรุนแรงมากนำมาก่อน 🚩 (Meningismus / SAH / CNS Infection)',
        gaze_deviation_or_fixed: 'ตากลอกไม่มา หรือมองค้างไปข้างใดข้างหนึ่ง 🚩 (Conjugate Gaze Deviation / Herniation sign)',
        anisocoria_or_fixed_pupil: 'ตากลอกไม่มา หรือมองค้างไปข้างใดข้างหนึ่ง 🚩 (Conjugate Gaze Deviation / Herniation sign)',
        head_trauma_history: 'มีประวัติลื่นล้ม ศีรษะกระแทก หรือเกิดอุบัติเหตุที่ศีรษะมาก่อนหน้านี้ 🚩 (Head Trauma History)',
        head_injury_recent_24h: 'ศีรษะกระแทก ลื่นล้ม หรืออุบัติเหตุภายใน 24 ชม. ที่ผ่านมา 🚩 (Acute Head Injury / TBI)',
        remote_trauma_weeks: 'มีประวัติลื่นล้ม ศีรษะกระแทกเบาๆ ในช่วงที่ผ่านมา 🚩 (Suspected Subacute/Chronic Subdural Hematoma)',
        visible_head_wound: 'มีบาดแผล บวมโน หรือรอยฟกช้ำที่บริเวณศีรษะหรือใบหน้า',
        none_neuro_flags: 'ไม่มีอาการทางระบบประสาทหรือการบาดเจ็บข้างต้น'
      };

      const headTraumaTimeMap = {
        within_24h: 'ภายใน 24 ชั่วโมงที่ผ่านมา',
        gt24h_to_1w: 'มากกว่า 24 ชั่วโมง ถึง 1 สัปดาห์ (1–7 วันก่อน)',
        remote_1_2w: 'ประมาณ 1–2 สัปดาห์ก่อน',
        remote_2_4w: 'ประมาณ 2–4 สัปดาห์ (1 เดือน) ก่อน',
        remote_1_2m: 'ประมาณ 1–2 เดือนก่อน',
        remote_gt_2m: 'มากกว่า 2 เดือนขึ้นไป',
        remote_unknown: 'จำระยะเวลาที่แน่นอนไม่ได้'
      };
      const remoteTraumaTimeMap = headTraumaTimeMap;

      const systemicFlagsMap = {
        high_fever_or_hypothermia: 'มีไข้สูง หนาวสั่น หรือตัวเย็นเฉียบผิดปกติ 🚩 (Severe Sepsis / Hypothermia)',
        tachypnea_labored_breathing: 'หายใจหอบเร็ว หายใจเหนื่อยรุนแรง หรือมีเสียงครืดคราดในคอ 🚩 (Respiratory Distress / Metabolic Acidosis)',
        cyanosis_cold_clammy: 'ปลายมือปลายเท้าเย็นเฉียบ หน้าซีด ลายพร้อย หรือริมฝีปากเขียวคล้ำ 🚩 (Impending Shock / Hypoperfusion)',
        cough_purulent_sputum: 'มีอาการไอ มีเสมหะข้นสีเหลืองหรือเขียว (Suspected Pneumonia / Aspiration)',
        rhinorrhea_sore_throat: 'มีน้ำมูก คัดจมูก หรือเจ็บคอ (URI / Cold symptoms)',
        foul_cloudy_urine: 'ปัสสาวะมีกลิ่นเหม็น ขุ่น หรือมีสีส้มปนเลือด (Suspected UTI / Urosepsis / CAUTI)',
        infected_bedsore_wound: 'มีแผลกดทับ แผลเบาหวานที่เท้า หรือแผลผ่าตัดที่มีหนองหรือบวมแดงร้อน (Infected Bedsore / SSTI Sepsis)'
      };

      const riskPrecipitantsMap = {
        diabetic_insulin_meds: 'ผู้ป่วยโรคเบาหวานที่ฉีดอินซูลินหรือทานยาลดน้ำตาล 🚩 (Severe Hypoglycemia / HHS / DKA Risk)',
        chronic_kidney_missed_dialysis: 'เป็นโรคไตวายเรื้อรัง (CKD) โดยเฉพาะผู้ที่ขาดการฟอกเลือด หรือปัสสาวะไม่ออก 🚩 (Uremic Encephalopathy / Hyperkalemia)',
        cirrhosis_jaundice_ascites: 'เป็นโรคตับแข็ง มีตาเหลือง ท้องมาน หรือถ่ายดำ/ท้องผูกรุนแรงนำมาก่อน 🚩 (Hepatic Encephalopathy)',
        new_meds_or_sedatives: 'เพิ่งเริ่มรับประทานยาใหม่ หรือทานยานอนหลับ ยาคลายกังวล ยาแก้แพ้ หรือยาแก้ปวด Opioid 🚩 (Sedative-induced Delirium / Overdose)',
        alcohol_heavy_or_abrupt_stop: 'ดื่มสุราหนักเป็นประจำ หรือเพิ่งหยุดดื่มกะทันหันใน 1–4 วันนี้ 🚩 (Delirium Tremens / Wernicke Encephalopathy)',
        suspected_overdose_toxin: 'สงสัยรับประทานยาเกินขนาด กินยาพิษ ยาฆ่าแมลง/สารเคมีกำจัดศัตรูพืช 🚩 (Acute Toxic Ingestion / Poisoning)',
        baseline_psychiatric_history: 'มีประวัติโรคทางจิตเวช (เช่น ซึมเศร้า ไบโพลาร์ จิตเภท)',
        none_risk_factors: 'ไม่มีประวัติความเสี่ยงหรือการใช้ยาข้างต้น'
      };

      // Pertinent Positives & Negatives lists
      const positives = [];
      const negatives = [];

      // Informant, Baseline, Onset, LSN & Consciousness Level stay in top HPI; not pushed to positives
      let lsnText = 'ไม่ระบุ';
      if (patient.alteredMentalLsnUnknown) {
        lsnText = 'ไม่ทราบเวลาปกติครั้งสุดท้ายแน่ชัด (Unwitnessed / Found confused/unresponsive)';
      } else if (patient.alteredMentalLsnDate || patient.alteredMentalLsnTime) {
        lsnText = `${formatDateDdMmYyyy(patient.alteredMentalLsnDate) || 'ไม่ระบุวันที่'} เวลา ${formatTime24h(patient.alteredMentalLsnTime) || 'ไม่ระบุเวลา'} น.`;
      }

      // Cognitive behaviors
      const cogs = patient.alteredMentalCognitiveBehaviors || [];
      if (cogs.length === 0) {
        negatives.push('ไม่พบพฤติกรรมกระสับกระส่าย เอะอะโวยวาย หรือภาพหลอนชัดเจน');
      }

      // Neuro flags
      const neuro = patient.alteredMentalNeuroFlags || [];
      if (neuro.includes('none_neuro_flags')) {
        negatives.push('ปฏิเสธแขนขาอ่อนแรง ชัก คอแข็ง รูม่านตาผิดปกติ และประวัติศีรษะกระแทก');
      } else {
        if (neuro.includes('focal_weakness_numbness')) positives.push(neuroFlagsMap.focal_weakness_numbness);
        else negatives.push('ไม่มีแขนขาอ่อนแรงครึ่งซีกหรือปากเบี้ยว');

        if (neuro.includes('seizure_or_abnormal_movement')) positives.push(neuroFlagsMap.seizure_or_abnormal_movement);
        else negatives.push('ไม่มีอาการชักเกร็งหรือกระตุก');

        if (neuro.includes('stiff_neck_or_severe_headache')) positives.push(neuroFlagsMap.stiff_neck_or_severe_headache);
        else negatives.push('ไม่มีอาการคอแข็งเกร็งหรือปวดศีรษะรุนแรงนำมาก่อน');

        if (neuro.includes('anisocoria_or_fixed_pupil')) positives.push(neuroFlagsMap.anisocoria_or_fixed_pupil);
        else negatives.push('รูม่านตาสองข้างเท่ากันและตอบสนองต่อแสงปกติ');

        if (neuro.includes('head_injury_recent_24h')) positives.push(neuroFlagsMap.head_injury_recent_24h);
        else negatives.push('ไม่มีประวัติศีรษะกระแทกหรืออุบัติเหตุใน 24 ชั่วโมงที่ผ่านมา');

        if (neuro.includes('remote_trauma_weeks')) {
          let rDesc = neuroFlagsMap.remote_trauma_weeks;
          if (patient.alteredMentalRemoteTraumaTime && remoteTraumaTimeMap[patient.alteredMentalRemoteTraumaTime]) {
            rDesc += ` [ช่วงเวลาที่เกิดเหตุ: ${remoteTraumaTimeMap[patient.alteredMentalRemoteTraumaTime]}]`;
          }
          positives.push(rDesc);
        } else {
          negatives.push('ไม่มีประวัติศีรษะกระแทกหรือลื่นล้มในช่วงสัปดาห์-เดือนที่ผ่านมา');
        }

        if (neuro.includes('visible_head_wound')) {
          let wDesc = 'มีบาดแผลหรือรอยฟกช้ำที่ศีรษะ/ใบหน้า';
          if (patient.alteredMentalHeadWoundLocation) wDesc += ` (ตำแหน่ง: ${patient.alteredMentalHeadWoundLocation})`;
          positives.push(wDesc);
        }
      }

      // Systemic flags
      const systemic = patient.alteredMentalSystemicFlags || [];
      if (systemic.length > 0) {
        systemic.forEach(k => {
          if (systemicFlagsMap[k]) positives.push(systemicFlagsMap[k]);
        });
      }
      if (!systemic.includes('high_fever_or_hypothermia')) negatives.push('ไม่มีไข้สูงหรือตัวเย็นเฉียบ');
      if (!systemic.includes('tachypnea_labored_breathing')) negatives.push('ไม่มีหายใจหอบเร็วเหนื่อยรุนแรง');
      if (!systemic.includes('cyanosis_cold_clammy')) negatives.push('ไม่มีตัวเย็นซีด ปลายมือเท้าเขียวคล้ำ');
      if (!systemic.includes('cough_purulent_sputum')) negatives.push('ไม่มีไอเสมหะข้น');
      if (!systemic.includes('foul_cloudy_urine')) negatives.push('ไม่มีปัสสาวะขุ่นกลิ่นเหม็นรุนแรง');
      if (!systemic.includes('infected_bedsore_wound')) negatives.push('ไม่มีแผลกดทับติดเชื้อบวมแดง');

      // GI review
      if (patient.alteredMentalGiAbdpain) {
        let abdDesc = 'มีอาการปวดท้องร่วมด้วย';
        const locs = patient.alteredMentalAbdpainLocs || [];
        if (locs.length > 0) abdDesc += ` ตำแหน่ง: ${locs.join(', ')}`;
        if (patient.alteredMentalAbdpainChar) abdDesc += ` ลักษณะ: ${patient.alteredMentalAbdpainChar}`;
        positives.push(abdDesc);
      } else {
        negatives.push('ไม่มีอาการปวดท้อง');
      }

      if (patient.alteredMentalGiDiarrhea) {
        let diaDesc = `มีอาการถ่ายเหลว ${patient.alteredMentalDiarrheaFreq || 0} ครั้ง/วัน`;
        const stools = patient.alteredMentalDiarrheaStools || [];
        if (stools.length > 0) diaDesc += ` [ลักษณะ: ${stools.join(', ')}]`;
        positives.push(diaDesc);
      } else {
        negatives.push('ไม่มีอาการถ่ายเหลว/ท้องเสีย');
      }

      if (patient.alteredMentalGiVomit) {
        let vomDesc = `มีอาการอาเจียน ${patient.alteredMentalVomitFreq || 0} ครั้ง/วัน`;
        const contents = patient.alteredMentalVomitContents || [];
        if (contents.length > 0) vomDesc += ` [สิ่งที่อาเจียน: ${contents.join(', ')}]`;
        positives.push(vomDesc);
      } else {
        negatives.push('ไม่มีอาการคลื่นไส้อาเจียน');
      }

      // Risk Precipitants
      const risks = patient.alteredMentalRiskPrecipitants || [];
      if (risks.includes('none_risk_factors')) {
        negatives.push('ปฏิเสธประวัติเบาหวานขาดน้ำตาล ไตวายขาดการฟอก ตับแข็ง ยานอนหลับ สุรา หรือสารพิษ');
      } else {
        risks.forEach(k => {
          if (k === 'suspected_overdose_toxin') {
            let toxDesc = riskPrecipitantsMap.suspected_overdose_toxin;
            if (patient.alteredMentalToxinDetails) toxDesc += ` [สงสัย: ${patient.alteredMentalToxinDetails}]`;
            positives.push(toxDesc);
          } else if (riskPrecipitantsMap[k]) {
            positives.push(riskPrecipitantsMap[k]);
          }
        });
      }

      if (patient.alteredMentalAdditionalNotes) {
        positives.push(`ข้อสังเกตเพิ่มเติมของผู้ให้ประวัติ: ${patient.alteredMentalAdditionalNotes}`);
      }

      // CAM-ICU Assessment
      const cam1 = Boolean(
        patient.alteredMentalOnsetPattern === 'hyperacute_minutes' ||
        patient.alteredMentalOnsetPattern === 'acute_hours' ||
        patient.alteredMentalOnsetPattern === 'fluctuating_day_night'
      );
      const cam2 = cogs.includes('inattention_unfocused');
      const cam3 = Boolean(patient.alteredMentalLevelOfConsciousness && patient.alteredMentalLevelOfConsciousness !== 'normal_alert');
      const cam4 = Boolean(cogs.includes('speech_slurred_or_incoherent') || cogs.includes('disoriented_time_place') || cogs.includes('hallucinations_paranoid'));
      const camPositive = (cam1 && cam2 && (cam3 || cam4));
      const camStatusText = camPositive
        ? 'CAM Positive: เข้าได้กับภาวะเพ้อเฉียบพลัน (Delirium) ต้องหาสาเหตุกระตุ้นทันที'
        : 'CAM Incomplete / Stupor-Coma: ระดับความรู้สึกตัวลดลง จำเป็นต้องแยกโรค Metabolic / Sepsis / Structural Brain Lesion';

      const hospLabel = {
        complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
        additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
        self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
        unspecified: 'ไม่ได้ระบุ'
      }[patient.hospRecordStatus] || 'ไม่ได้ระบุ';

      const docNotes = patient.doctor_notes || {};
      const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ' || patient.currentMeds === 'ไม่มี') ? 'ไม่มี' : patient.currentMeds;

      // A) Rapid Bullet Format for Altered Mental Status
      const defaultRapid =
`[Chief Complaint (CC)]
ซึมลง / สับสนเฉียบพลัน / ระดับความรู้สึกตัวเปลี่ยนแปลง (Altered Mental Status / Delirium / Coma) มา ${durationText}

[History of Present Illness (HPI)]
• ผู้ให้ประวัติ: ${reporterMap[patient.alteredMentalReporter] || 'ไม่ระบุ'} ${patient.alteredMentalReporterRelation ? `(${patient.alteredMentalReporterRelation})` : ''} ${patient.alteredMentalReporterPhone ? `โทร: ${patient.alteredMentalReporterPhone}` : ''}
• ระดับความสามารถเดิม (Baseline Status): ${baselineMap[patient.alteredMentalBaselineStatus] || 'ไม่ระบุ'}
• รูปแบบการเริ่มมีอาการ: ${onsetPatternMap[patient.alteredMentalOnsetPattern] || 'ไม่ระบุ'}
• เวลาปกติครั้งสุดท้าย (Last Seen Normal - LSN): ${lsnText}
• ระดับการตื่นตัวหลักในขณะนี้: ${consciousLevelMap[patient.alteredMentalLevelOfConsciousness] || 'ไม่ระบุ'}
• พฤติกรรมและการรู้คิดผิดปกติ: ${cogs.length > 0 ? cogs.map(k => cognitiveMap[k] || k).join('; ') : 'ไม่มีพฤติกรรมกระสับกระส่าย/เพ้อชัดเจน'}

• Pertinent Positives:
${positives.length > 0 ? positives.map(p => `  - ${p}`).join('\n') : '  - ไม่มีอาการร่วมอื่นที่เด่นชัด'}

• Pertinent Negatives:
${negatives.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• โรคประจำตัว (U/D): ${patient.underlying?.length > 0 ? patient.underlying.join(', ') : 'ปฏิเสธ'}
• ยาประจำตัว (Current Meds): ${medsText}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${patient.drugAllergy || 'ปฏิเสธ'}

[Emergency Risk Assessment (Red Flags)]
${patient.redFlags?.length > 0
  ? `🚩 RED FLAGS DETECTED:\n${patient.redFlags.map(rf => `  * ${rf.textTh} — ${rf.risk}`).join('\n')}`
  : '✓ ไม่พบสัญญาณเตือนวิกฤตเฉียบพลันเบื้องต้น'}

[Doctor's Clinical Addendum & Exam]
• ประวัติเพิ่มเติม/แก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}
• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}
• แผนการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

      // B) Narrative Paragraph Format for Altered Mental Status
      const defaultNarrative =
`ผู้ป่วย [${patient.name}] อายุ ${patient.age || '-'} ปี เพศ ${patient.gender || 'ไม่ระบุ'} มารับการตรวจที่ห้องฉุกเฉิน รพ.ราชบุรี ด้วยอาการซึมลง / สับสนเฉียบพลัน / ระดับความรู้สึกตัวเปลี่ยนแปลง มา ${durationText}
ข้อมูลประวัติ: ให้ประวัติโดย [${reporterMap[patient.alteredMentalReporter] || 'ไม่ระบุ'}] ${patient.alteredMentalReporterRelation ? `ความสัมพันธ์: ${patient.alteredMentalReporterRelation} ` : ''}${patient.alteredMentalReporterPhone ? `โทร: ${patient.alteredMentalReporterPhone} ` : ''}ระดับความสามารถเดิมก่อนเกิดเหตุ: [${baselineMap[patient.alteredMentalBaselineStatus] || 'ไม่ระบุ'}] รูปแบบการเริ่มมีอาการ: [${onsetPatternMap[patient.alteredMentalOnsetPattern] || 'ไม่ระบุ'}] เวลาปกติครั้งสุดท้าย (LSN): [${lsnText}]
ระดับการตื่นตัวในขณะนี้ตรวจพบเป็น [${consciousLevelMap[patient.alteredMentalLevelOfConsciousness] || 'ไม่ระบุ'}] พฤติกรรมการรู้คิด: [${cogs.length > 0 ? cogs.map(k => cognitiveMap[k] || k).join(', ') : 'ไม่มีพฤติกรรมกระสับกระส่ายผิดปกติ'}]
การประเมินสัญญาณอันตรายทางสมองและระบบประสาท: [${neuro.length > 0 ? neuro.map(k => neuroFlagsMap[k] || k).join(', ') : 'ปฏิเสธอาการทางระบบประสาท'}] การประเมินสัญญาณการติดเชื้อและระบบหายใจ: [${systemic.length > 0 ? systemic.map(k => systemicFlagsMap[k] || k).join(', ') : 'ไม่พบสัญญาณติดเชื้อชัดเจน'}] ประวัติความเสี่ยง ยาที่ใช้ สารพิษ: [${risks.length > 0 ? risks.map(k => riskPrecipitantsMap[k] || k).join(', ') : 'ปฏิเสธ'}] ${patient.alteredMentalToxinDetails ? `สงสัยสารพิษ: ${patient.alteredMentalToxinDetails} ` : ''}

ผลการประเมินภาวะเพ้อสับสน (Delirium Screening): ${camStatusText}
อาการสำคัญที่ตรวจพบ (Pertinent Positives): ${positives.join(', ')}
อาการสำคัญที่ให้ผลลบ (Pertinent Negatives): ${negatives.join(', ')}

ประวัติการเจ็บป่วยเดิม: โรคประจำตัว: ${patient.underlying?.length > 0 ? patient.underlying.join(', ') : 'ปฏิเสธ'}, ยาประจำตัว: ${medsText}, ประวัติแพ้ยา/แพ้อาหาร: ${patient.drugAllergy || 'ปฏิเสธ'}
${patient.redFlags?.length > 0 ? `\n[🚩 สัญญาณเตือนอันตราย (Red Flags)]: ${patient.redFlags.map(rf => `${rf.textTh} (${rf.risk})`).join('; ')}` : ''}

[บันทึกการตรวจและการประเมินโดยแพทย์]:
• ผลตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น: ${docNotes.preliminary_dx || '-'}
• แผนการรักษา: ${docNotes.plan || '-'}`;

      // C) JSON Payload for Altered Mental Status
      const jsonPayload = {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "encounter": {
          "hospital_site": "Ratchaburi Hospital",
          "queue_id": patient.queue_number,
          "hn": patient.hn,
          "patient_name": patient.name,
          "age": patient.age,
          "gender": patient.gender,
          "timestamp": patient.timestamp,
          "status": patient.status,
          "triage_urgency_flag": patient.redFlags?.length > 0,
          "red_flags_count": patient.redFlags?.length || 0,
          "hospital_record_status": patient.hospRecordStatus
        },
        "chief_complaint": "altered_mental",
        "altered_mental_status_profile": {
          "duration_value": patient.durationVal || null,
          "duration_unit": patient.durationUnit || null,
          "informant": {
            "type": patient.alteredMentalReporter || null,
            "relationship": patient.alteredMentalReporterRelation || "",
            "phone": patient.alteredMentalReporterPhone || ""
          },
          "baseline_functional_status": {
            "category": patient.alteredMentalBaselineStatus || null,
            "bedridden_details": patient.alteredMentalBaselineStatus === 'bedridden_totally_dependent' ? {
              "communication": patient.alteredMentalBedriddenCommunication || null,
              "mobility": patient.alteredMentalBedriddenMobility || null,
              "feeding": patient.alteredMentalBedriddenFeeding || null,
              "elimination": patient.alteredMentalBedriddenElimination || null
            } : null
          },
          "onset_pattern": patient.alteredMentalOnsetPattern || null,
          "last_seen_normal": {
            "unknown": Boolean(patient.alteredMentalLsnUnknown),
            "date": formatDateDdMmYyyy(patient.alteredMentalLsnDate) || null,
            "time": formatTime24h(patient.alteredMentalLsnTime) || null
          },
          "level_of_consciousness": patient.alteredMentalLevelOfConsciousness || null,
          "cognitive_and_behavioral_manifestations": cogs,
          "neurological_red_flags": {
            "flags": neuro,
            "head_trauma_timeframe": patient.alteredMentalHeadTraumaTime || patient.alteredMentalRemoteTraumaTime || null,
            "remote_head_trauma_timeframe": patient.alteredMentalHeadTraumaTime || patient.alteredMentalRemoteTraumaTime || null,
            "head_wound_location": patient.alteredMentalHeadWoundLocation || ""
          },
          "systemic_and_infection_signs": systemic,
          "gastrointestinal_review": {
            "abdominal_pain": Boolean(patient.alteredMentalGiAbdpain),
            "abdominal_pain_locations": patient.alteredMentalAbdpainLocs || [],
            "abdominal_pain_character": patient.alteredMentalAbdpainChar || "",
            "diarrhea": Boolean(patient.alteredMentalGiDiarrhea),
            "diarrhea_frequency_per_day": patient.alteredMentalDiarrheaFreq || 0,
            "diarrhea_stool_character": patient.alteredMentalDiarrheaStools || [],
            "vomiting": Boolean(patient.alteredMentalGiVomit),
            "vomiting_frequency_per_day": patient.alteredMentalVomitFreq || 0,
            "vomiting_contents": patient.alteredMentalVomitContents || []
          },
          "precipitants_and_toxic_history": {
            "risks": risks,
            "suspected_toxin_details": patient.alteredMentalToxinDetails || ""
          },
          "clinical_screening": {
            "cam_icu_delirium_screen": {
              "is_cam_positive": camPositive,
              "feature_1_acute_onset_fluctuating": cam1,
              "feature_2_inattention": cam2,
              "feature_3_altered_consciousness": cam3,
              "feature_4_disorganized_thinking": cam4
            }
          }
        },
        "pertinent_positives": positives,
        "pertinent_negatives": negatives,
        "informant_additional_notes": patient.alteredMentalAdditionalNotes || "",
        "underlying_diseases": patient.underlying || [],
        "current_medications": patient.currentMeds || "",
        "drug_allergies": patient.drugAllergy || "",
        "red_flags": patient.redFlags || [],
        "doctor_addendum": docNotes
      };

      patient.pertinentPositives = positives.length > 0 ? positives : ['ไม่มีอาการร่วมผิดปกติ'];
      patient.pertinentNegatives = negatives;

      const rapidEl = document.getElementById('rapidTextView');
      const narrativeEl = document.getElementById('narrativeTextView');
      const jsonEl = document.getElementById('jsonViewer');

      if (rapidEl) rapidEl.value = patient.custom_rapid_note || defaultRapid;
      if (narrativeEl) narrativeEl.value = patient.custom_narrative_note || defaultNarrative;
      if (jsonEl) jsonEl.textContent = JSON.stringify(jsonPayload, null, 2);
    }


registerCcModule({
  id: 'altered_mental',
  recordCc: 'altered_mental',
  titleTh: 'ซึมลง / สับสนเฉียบพลัน / ระดับความรู้สึกตัวเปลี่ยนแปลง',
  titleEn: 'Altered Mental Status / Delirium / Lethargy',
  sectionDomId: 'alteredMentalQuestionnaireSection',
  doctorCcBadgeHtml: "<i data-lucide=\"help-circle\" class=\"w-3 h-3 mr-1\"></i> CC: ซึมลง / สับสนเฉียบพลัน / ระดับความรู้สึกตัวเปลี่ยนแปลง (Altered Mental Status)",
  formHtml: "        <div id=\"alteredMentalQuestionnaireSection\" class=\"hidden space-y-6\">\n\n          <!-- CARD 1: ข้อมูลผู้ให้ประวัติ ระดับความสามารถเดิม และเวลาปกติครั้งสุดท้าย (Context, Baseline & LSN) -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"help-circle\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-900\"><span id=\"alteredMentalCard1Num\">1</span>. ข้อมูลผู้ให้ประวัติ ระดับความสามารถเดิม และเวลาปกติครั้งสุดท้าย</h2>\n                <p class=\"text-xs text-slate-500\">ระบุผู้ให้ข้อมูล ระดับความรู้สึกตัวเดิม และเวลาที่พบว่าปกติครั้งสุดท้ายอย่างละเอียด</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4\">\n              <!-- 1.1 ระยะเวลาตั้งแต่เริ่มสังเกตเห็นอาการ -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2\">\n                  1. เริ่มสังเกตเห็นอาการซึมลงหรือสับสนมานานเท่าไรแล้ว? <span class=\"text-rose-500\">*</span>\n                </label>\n                <div class=\"grid grid-cols-2 gap-3\">\n                  <div>\n                    <input type=\"number\" id=\"alteredMentalDurationVal\" min=\"0\" placeholder=\"ระบุตัวเลข เช่น 2, 4\" class=\"w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-medium placeholder:text-slate-400\">\n                  </div>\n                  <div>\n                    <select id=\"alteredMentalDurationUnit\" class=\"w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-medium\">\n                      <option value=\"minutes\">นาที</option>\n                      <option value=\"hours\" selected>ชั่วโมง</option>\n                      <option value=\"days\">วัน</option>\n                      <option value=\"weeks\">สัปดาห์</option>\n                      <option value=\"months\">เดือน</option>\n                      <option value=\"years\">ปี</option>\n                    </select>\n                  </div>\n                </div>\n              </div>\n\n              <!-- 1.2 ผู้ให้ข้อมูลประวัติเหตุการณ์ -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2\">\n                  2. ผู้ให้ข้อมูลประวัติเหตุการณ์ในครั้งนี้คือใคร? <span class=\"text-rose-500\">*</span>\n                </label>\n                <div class=\"space-y-2\">\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"alteredMentalReporter\" value=\"caregiver_family\" class=\"text-medical-600 focus:ring-medical-500 mt-1\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">ญาติหรือผู้ดูแลใกล้ชิดที่อาศัยอยู่ร่วมกับผู้ป่วยทุกวัน</span>\n                      <span class=\"block text-[11px] text-slate-500\">สังเกตเห็นความเปลี่ยนแปลงได้อย่างใกล้ชิดและทราบข้อมูลประจำวัน</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"alteredMentalReporter\" value=\"relative_occasional\" class=\"text-medical-600 focus:ring-medical-500 mt-1\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">ญาติที่ไม่ได้อยู่ด้วยกันประจำ เพิ่งมาเยี่ยมและสังเกตเห็น</span>\n                      <span class=\"block text-[11px] text-slate-500\">เพิ่งมาพบผู้ป่วยวันนี้หรือช่วงไม่กี่วัน ไม่ทราบระดับเดิมที่แน่นอน</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"alteredMentalReporter\" value=\"witness_rescuer\" class=\"text-medical-600 focus:ring-medical-500 mt-1\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">ผู้พบเห็นเหตุการณ์ / เพื่อนร่วมงาน / เจ้าหน้าที่กู้ชีพกู้ภัย</span>\n                      <span class=\"block text-[11px] text-slate-500\">พบนอนหมดสติหรือสับสนนอกบ้าน/ที่ทำงาน ไม่มีญาติมาด้วยในตอนแรก</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"alteredMentalReporter\" value=\"patient_confused\" class=\"text-medical-600 focus:ring-medical-500 mt-1\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">ผู้ป่วยพยายามเล่าเองแต่สับสนหรือไม่สามารถให้ข้อมูลที่ต่อเนื่องได้</span>\n                      <span class=\"block text-[11px] text-slate-500\">จำเหตุการณ์ไม่ได้ ตอบคำถามวกวน หรือไม่ทราบว่ามาโรงพยาบาลทำไม</span>\n                    </div>\n                  </label>\n                </div>\n\n                <!-- ช่องพิมพ์ระบุความสัมพันธ์และเบอร์โทรศัพท์ของผู้ดูแล/ญาติที่ให้ประวัติ (ไม่บังคับ) -->\n                <div class=\"mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3\">\n                  <div>\n                    <label class=\"block text-[11px] font-semibold text-slate-700 mb-1\">ความสัมพันธ์กับผู้ป่วย (ถ้ามี):</label>\n                    <input type=\"text\" id=\"alteredMentalReporterRelation\" placeholder=\"เช่น บุตรสาว, ภรรยา, ผู้ดูแลมืออาชีพ\" class=\"w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400\">\n                  </div>\n                  <div>\n                    <label class=\"block text-[11px] font-semibold text-slate-700 mb-1\">เบอร์โทรศัพท์ติดต่อผู้ให้ประวัติ (ถ้ามี):</label>\n                    <input type=\"tel\" id=\"alteredMentalReporterPhone\" placeholder=\"เช่น 081-234-5678\" class=\"w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400\">\n                  </div>\n                </div>\n              </div>\n\n              <!-- 1.3 ระดับความรู้สึกตัวและความสามารถเดิมก่อนเกิดอาการในครั้งนี้ (Baseline Status) -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2\">\n                  3. <span class=\"bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold border border-amber-300\">[ระดับเดิมในภาวะปกติ]</span> ระดับความรู้สึกตัวและความสามารถเดิมของผู้ป่วย <span class=\"text-rose-600 font-bold underline\">ก่อนหน้าที่จะเริ่มมีอาการในครั้งนี้</span> เป็นอย่างไร? <span class=\"text-rose-500\">*</span>\n                </label>\n                <p class=\"text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 mb-2.5\">💡 <strong>หมายเหตุสำคัญ:</strong> ข้อนี้ต้องการทราบระดับความจำและความสามารถเดิมในชีวิตประจำวัน <strong>ก่อนที่จะเริ่มมีอาการซึมลงในครั้งนี้</strong> (ไม่ใช่สภาพที่เป็นอยู่ ณ ขณะนี้)</p>\n                <div class=\"space-y-2\">\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"alteredMentalBaselineStatus\" value=\"normal_independent\" onchange=\"handleAlteredMentalBaselineChange(this.value)\" class=\"text-medical-600 focus:ring-medical-500 mt-1\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">ปกติ ช่วยเหลือตัวเองได้สมบูรณ์ จำเหตุการณ์และบุคคลได้แม่นยำ</span>\n                      <span class=\"block text-[11px] text-slate-500\">ไม่มีภาวะหลงลืม ใช้ชีวิตและทำงานได้ตามปกติ</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"alteredMentalBaselineStatus\" value=\"mild_cognitive_independent\" onchange=\"handleAlteredMentalBaselineChange(this.value)\" class=\"text-medical-600 focus:ring-medical-500 mt-1\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">หลงลืมเล็กน้อยตามวัย แต่ช่วยเหลือตัวเองในชีวิตประจำวันได้</span>\n                      <span class=\"block text-[11px] text-slate-500\">อาจลืมของหรือถามซ้ำบ้าง แต่เดินเหิน ทานอาหาร และเข้าห้องน้ำเองได้</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"alteredMentalBaselineStatus\" value=\"known_dementia_partially_dependent\" onchange=\"handleAlteredMentalBaselineChange(this.value)\" class=\"text-medical-600 focus:ring-medical-500 mt-1\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">มีภาวะสมองเสื่อมเดิม ช่วยเหลือตัวเองได้บางส่วน แต่ครั้งนี้ซึมลง/สับสนชัดเจนกว่าเดิมมาก</span>\n                      <span class=\"block text-[11px] text-slate-500\">มีอาการทรุดลงเฉียบพลันจากภาวะเดิมอย่างเห็นได้ชัด</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"alteredMentalBaselineStatus\" value=\"bedridden_totally_dependent\" onchange=\"handleAlteredMentalBaselineChange(this.value)\" class=\"text-medical-600 focus:ring-medical-500 mt-1\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">ผู้ป่วยติดเตียง ช่วยเหลือตัวเองไม่ได้เดิม แต่ครั้งนี้ระดับการตื่นตัวลดลงผิดปกติ</span>\n                      <span class=\"block text-[11px] text-slate-500\">เรียกไม่ค่อยตื่น หรือซึมลงกว่าปกติประจำวันอย่างชัดเจน</span>\n                    </div>\n                  </label>\n                </div>\n\n                <!-- Progressive Disclosure: รายละเอียดสถานะเดิมของผู้ป่วยติดเตียง -->\n                <div id=\"alteredMentalBedriddenDetailsWrap\" class=\"hidden mt-3 p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3\">\n                  <div class=\"text-xs font-bold text-amber-900 flex items-center space-x-1.5\">\n                    <i data-lucide=\"info\" class=\"w-4 h-4 text-amber-700\"></i>\n                    <span>ข้อมูลสถานะเดิมก่อนเกิดอาการ (Baseline Functional Status สำหรับผู้ป่วยติดเตียง):</span>\n                  </div>\n\n                  <!-- การสื่อสารเดิม -->\n                  <div>\n                    <label class=\"block text-[11px] font-semibold text-slate-700 mb-1\">การพูดคุยสื่อสารเดิม:</label>\n                    <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2\">\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer text-xs\">\n                        <input type=\"radio\" name=\"alteredMentalBedriddenCommunication\" value=\"talk_normal\" class=\"text-medical-600\">\n                        <span class=\"ml-2 text-slate-800\">พูดคุยเป็นประโยครู้เรื่อง</span>\n                      </label>\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer text-xs\">\n                        <input type=\"radio\" name=\"alteredMentalBedriddenCommunication\" value=\"talk_limited\" class=\"text-medical-600\">\n                        <span class=\"ml-2 text-slate-800\">พูดได้เป็นคำสั้นๆ</span>\n                      </label>\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer text-xs\">\n                        <input type=\"radio\" name=\"alteredMentalBedriddenCommunication\" value=\"mute_sounds\" class=\"text-medical-600\">\n                        <span class=\"ml-2 text-slate-800\">ไม่พูด / ส่งเสียงอืออา</span>\n                      </label>\n                    </div>\n                  </div>\n\n                  <!-- การเคลื่อนไหวเดิม -->\n                  <div>\n                    <label class=\"block text-[11px] font-semibold text-slate-700 mb-1\">การขยับตัวเคลื่อนไหวเดิม:</label>\n                    <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2\">\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer text-xs\">\n                        <input type=\"radio\" name=\"alteredMentalBedriddenMobility\" value=\"turn_sit\" class=\"text-medical-600\">\n                        <span class=\"ml-2 text-slate-800\">พลิกตัว/พยุงนั่งเตียงได้</span>\n                      </label>\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer text-xs\">\n                        <input type=\"radio\" name=\"alteredMentalBedriddenMobility\" value=\"limb_move_only\" class=\"text-medical-600\">\n                        <span class=\"ml-2 text-slate-800\">ขยับแขนขาได้ แต่นั่งไม่ได้</span>\n                      </label>\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer text-xs\">\n                        <input type=\"radio\" name=\"alteredMentalBedriddenMobility\" value=\"flaccid_no_move\" class=\"text-medical-600\">\n                        <span class=\"ml-2 text-slate-800\">นอนนิ่ง ไม่ขยับแขนขาเอง</span>\n                      </label>\n                    </div>\n                  </div>\n\n                  <!-- การรับประทานอาหารเดิม -->\n                  <div>\n                    <label class=\"block text-[11px] font-semibold text-slate-700 mb-1\">การรับประทานอาหารเดิม:</label>\n                    <div class=\"grid grid-cols-2 sm:grid-cols-4 gap-2\">\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer text-xs\">\n                        <input type=\"radio\" name=\"alteredMentalBedriddenFeeding\" value=\"oral_self\" class=\"text-medical-600\">\n                        <span class=\"ml-2 text-slate-800\">ทานเองได้</span>\n                      </label>\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer text-xs\">\n                        <input type=\"radio\" name=\"alteredMentalBedriddenFeeding\" value=\"oral_assisted\" class=\"text-medical-600\">\n                        <span class=\"ml-2 text-slate-800\">ญาติต้องป้อน</span>\n                      </label>\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer text-xs\">\n                        <input type=\"radio\" name=\"alteredMentalBedriddenFeeding\" value=\"ng_tube\" class=\"text-medical-600\">\n                        <span class=\"ml-2 text-slate-800\">สายยางจมูก (NG)</span>\n                      </label>\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer text-xs\">\n                        <input type=\"radio\" name=\"alteredMentalBedriddenFeeding\" value=\"peg_tube\" class=\"text-medical-600\">\n                        <span class=\"ml-2 text-slate-800\">สายหน้าท้อง (PEG)</span>\n                      </label>\n                    </div>\n                  </div>\n\n                  <!-- การขับถ่ายเดิม -->\n                  <div>\n                    <label class=\"block text-[11px] font-semibold text-slate-700 mb-1\">การขับถ่ายเดิม:</label>\n                    <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2\">\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer text-xs\">\n                        <input type=\"radio\" name=\"alteredMentalBedriddenElimination\" value=\"continent\" class=\"text-medical-600\">\n                        <span class=\"ml-2 text-slate-800\">ขับถ่ายรู้ตัว บอกได้</span>\n                      </label>\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer text-xs\">\n                        <input type=\"radio\" name=\"alteredMentalBedriddenElimination\" value=\"foley_catheter\" class=\"text-medical-600\">\n                        <span class=\"ml-2 text-slate-800\">คาสายสวนปัสสาวะ (Foley)</span>\n                      </label>\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer text-xs\">\n                        <input type=\"radio\" name=\"alteredMentalBedriddenElimination\" value=\"diapers\" class=\"text-medical-600\">\n                        <span class=\"ml-2 text-slate-800\">ใส่ผ้าอ้อม ขับถ่ายไม่รู้ตัว</span>\n                      </label>\n                    </div>\n                  </div>\n                </div>\n              </div>\n\n              <!-- 1.4 รูปแบบการเริ่มสังเกตเห็นอาการผิดปกติ (Onset Pattern) -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2\">\n                  4. รูปแบบการเริ่มสังเกตเห็นอาการผิดปกติชัดเจน <span class=\"text-rose-500\">*</span>\n                </label>\n                <div class=\"space-y-2\">\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"alteredMentalOnsetPattern\" value=\"hyperacute_minutes\" class=\"text-medical-600 focus:ring-medical-500 mt-1\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">เกิดขึ้นทันทีทันใด ปุบปับในหลักนาที</span>\n                      <span class=\"block text-[11px] text-slate-500\">ก่อนหน้านี้พูดคุยได้ปกติ แล้วทรุดลงหรือสับสนเฉียบพลันทันที</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"alteredMentalOnsetPattern\" value=\"acute_hours\" class=\"text-medical-600 focus:ring-medical-500 mt-1\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">ค่อยๆ เป็นมากขึ้นชัดเจนภายในไม่กี่ชั่วโมงของวันนี้</span>\n                      <span class=\"block text-[11px] text-slate-500\">เช่น เริ่มสังเกตเห็นช่วงเช้า/บ่าย และซึมลงหรือสับสนมากขึ้นเรื่อยๆ ภายในวันนี้</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"alteredMentalOnsetPattern\" value=\"subacute_days\" class=\"text-medical-600 focus:ring-medical-500 mt-1\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">ค่อยๆ ซึมลง สับสน หรือพฤติกรรมเปลี่ยนสะสมมาหลายวัน</span>\n                      <span class=\"block text-[11px] text-slate-500\">เริ่มเป็นมา 2–3 วันขึ้นไป หรือเป็นสัปดาห์ จนกระทั่งวันนี้ผิดปกติมาก</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"alteredMentalOnsetPattern\" value=\"fluctuating_day_night\" class=\"text-medical-600 focus:ring-medical-500 mt-1\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">อาการขึ้นๆ ลงๆ เดี๋ยวรู้เรื่องเดี๋ยวสับสน โดยเฉพาะช่วงพลบค่ำหรือกลางคืน</span>\n                      <span class=\"block text-[11px] text-slate-500\">กลางวันอาจหลับหรือนิ่ง กลางคืนกระสับกระส่าย เอะอะโวยวาย หรือเพ้อ</span>\n                    </div>\n                  </label>\n                </div>\n              </div>\n\n              <!-- 1.5 เวลาปกติครั้งสุดท้าย (Last Seen Normal - LSN) -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2\">\n                  5. เวลาปกติครั้งสุดท้ายที่เห็นว่าผู้ป่วยยังรู้สึกตัวดี พูดคุยรู้เรื่อง (Last Seen Normal):\n                </label>\n                <div class=\"p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3\">\n                  <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-3\">\n                    <div>\n                      <label class=\"block text-[11px] font-semibold text-slate-700 mb-1\">วันที่ปกติครั้งสุดท้าย: <span class=\"text-[10px] text-slate-500 font-normal\">(วว/ดด/ปปปป)</span></label>\n                      <input type=\"text\" id=\"alteredMentalLsnDate\" data-universal-date=\"true\" placeholder=\"วว/ดด/ปปปป (dd/mm/yyyy)\" autocomplete=\"off\" class=\"w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 font-medium\">\n                    </div>\n                    <div>\n                      <label class=\"block text-[11px] font-semibold text-slate-700 mb-1\">เวลาที่ปกติครั้งสุดท้าย (ประมาณ): <span class=\"text-[10px] text-slate-500 font-normal\">(24 ชม. เช่น 14:30)</span></label>\n                      <input type=\"text\" id=\"alteredMentalLsnTime\" data-universal-time=\"true\" placeholder=\"เช่น 14:30 (24 ชม.)\" autocomplete=\"off\" class=\"w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 font-medium\">\n                    </div>\n                  </div>\n                  <div class=\"pt-1\">\n                    <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer\">\n                      <input type=\"checkbox\" id=\"alteredMentalLsnUnknown\" onchange=\"handleAlteredMentalLsnUnknownToggle(this)\" class=\"text-medical-600 rounded\">\n                      <span class=\"ml-2.5 text-xs text-slate-700 font-medium\">ไม่ทราบเวลาปกติครั้งสุดท้ายแน่ชัด (เช่น หลับไปแล้วตื่นมาพบว่าซึมลง หรือไม่มีผู้พบเห็น)</span>\n                    </label>\n                  </div>\n                </div>\n              </div>\n\n            </div>\n          </div>\n\n          <!-- CARD 2: ระดับการตื่นตัวและพฤติกรรมการรู้คิด (Consciousness Level & Cognitive Behaviors) -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"eye\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-900\"><span id=\"alteredMentalCard2Num\">2</span>. ระดับการตื่นตัวและพฤติกรรมการรู้คิดในขณะนี้</h2>\n                <p class=\"text-xs text-slate-500\">ประเมินระดับการตอบสนองต่อสิ่งกระตุ้น และพฤติกรรมความผิดปกติที่สังเกตพบ</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4\">\n              <!-- 2.1 ระดับการตื่นตัวหลักในขณะนี้ -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2\">\n                  1. ลักษณะระดับการตื่นตัวหลักในขณะนี้ (เลือกข้อที่ตรงที่สุด) <span class=\"text-rose-500\">*</span>\n                </label>\n                <div class=\"space-y-2\">\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"alteredMentalLevelOfConsciousness\" value=\"drowsy_lethargic\" class=\"text-medical-600 focus:ring-medical-500 mt-1\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">ซึมลง ปลุกตื่นง่ายเมื่อเรียก ลืมตาตอบสนองได้ช้า แต่เมื่อหยุดคุยจะผล็อยหลับไปใหม่</span>\n                      <span class=\"block text-[11px] text-slate-500\">เรียกชื่อแล้วลืมตา ตอบคำถามได้สั้นๆ แต่ดูง่วงซึมผิดปกติ</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"alteredMentalLevelOfConsciousness\" value=\"stupor_pain_only\" class=\"text-medical-600 focus:ring-medical-500 mt-1\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">หลับลึก ปลุกด้วยเสียงไม่ตื่น ต้องเขย่าตัวแรงๆ หรือกดเจ็บจึงจะลืมตาหรือขยับตัว</span>\n                      <span class=\"block text-[11px] text-slate-500\">ตอบสนองเพียงส่งเสียงคราง หรือปัดมือเมื่อเจ็บ แต่ไม่พูดคุยเป็นภาษา</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"alteredMentalLevelOfConsciousness\" value=\"coma_unresponsive\" class=\"text-medical-600 focus:ring-medical-500 mt-1\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">ไม่ลืมตา ไม่ตอบสนองต่อเสียงเรียกและการเขย่าตัวแรงๆ</span>\n                      <span class=\"block text-[11px] text-slate-500\">นอนนิ่งสนิท ไม่ขยับเขยื้อนตัว ไม่ลืมตา และไม่ส่งเสียงใดๆ</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"alteredMentalLevelOfConsciousness\" value=\"awake_but_confused\" class=\"text-medical-600 focus:ring-medical-500 mt-1\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">ลืมตาได้เอง แต่พูดคุยสับสน สื่อสารไม่รู้เรื่อง จำบุคคล/เวลา/สถานที่ไม่ได้</span>\n                      <span class=\"block text-[11px] text-slate-500\">ตื่นตาค้าง หรือมองตาม แต่ถามอะไรตอบไม่ถูก สับสนอย่างมาก</span>\n                    </div>\n                  </label>\n                </div>\n              </div>\n\n              <!-- 2.2 พฤติกรรมและการรู้คิดที่ผิดปกติ (เลือกได้หลายข้อ) -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2\">\n                  2. มีพฤติกรรมหรือการรู้คิดที่ผิดปกติต่อไปนี้ร่วมด้วยหรือไม่? (เลือกได้หลายข้อ)\n                </label>\n                <div class=\"space-y-2\">\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"alteredMentalCognitiveBehaviors\" value=\"inattention_unfocused\" class=\"text-medical-600 rounded mt-0.5\">\n                    <span class=\"ml-3 text-xs text-slate-800\">ขาดสมาธิ เหม่อลอย ไม่สามารถจดจ่อกับการพูดคุยได้ เรียกไม่ค่อยหัน</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"alteredMentalCognitiveBehaviors\" value=\"disoriented_time_place\" class=\"text-medical-600 rounded mt-0.5\">\n                    <span class=\"ml-3 text-xs text-slate-800\">สับสนวันเวลา สถานที่ หรือจำบ้านและญาติพี่น้องไม่ได้</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"alteredMentalCognitiveBehaviors\" value=\"agitated_restless\" class=\"text-medical-600 rounded mt-0.5\">\n                    <span class=\"ml-3 text-xs text-slate-800\">กระสับกระส่าย เอะอะโวยวาย ลุกเดินพล่าน พยายามดึงสายน้ำเกลือหรือปีนเตียง</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"alteredMentalCognitiveBehaviors\" value=\"hallucinations_paranoid\" class=\"text-medical-600 rounded mt-0.5\">\n                    <span class=\"ml-3 text-xs text-slate-800\">มองเห็นภาพหลอน ได้ยินเสียงแว่ว หรือมีความคิดหวาดระแวง กลัวคนมาทำร้าย</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"alteredMentalCognitiveBehaviors\" value=\"speech_slurred_or_incoherent\" class=\"text-medical-600 rounded mt-0.5\">\n                    <span class=\"ml-3 text-xs text-slate-800\">พูดจาเลอะเลือน วกไปวนมา ไม่เป็นประโยค หรือพูดไม่ชัด ลิ้นแข็ง</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"alteredMentalCognitiveBehaviors\" value=\"apathy_mute\" class=\"text-medical-600 rounded mt-0.5\">\n                    <span class=\"ml-3 text-xs text-slate-800\">นิ่งเฉย ไม่ยอมพูด ไม่ยอมสบตา เซื่องซึมผิดปกติ</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"alteredMentalCognitiveBehaviors\" value=\"poor_intake_refusal\" class=\"text-medical-600 rounded mt-0.5\">\n                    <span class=\"ml-3 text-xs text-slate-800\">ไม่รับประทานอาหารและน้ำเลย หรือดื่มน้ำได้น้อยมาก อ่อนเพลียหมดแรง</span>\n                  </label>\n                </div>\n              </div>\n\n            </div>\n          </div>\n\n          <!-- CARD 3: สัญญาณอันตรายทางสมองและระบบประสาท (Red Flags: Neurological & Intracranial) -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"shield-alert\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-900\"><span id=\"alteredMentalCard3Num\">3</span>. สัญญาณอันตรายทางสมองและระบบประสาท</h2>\n                <p class=\"text-xs text-slate-500\">ตรวจสอบอาการแขนขาอ่อนแรง ชักเกร็ง คอแข็ง รูม่านตา และประวัติการบาดเจ็บที่ศีรษะ</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4\">\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2\">\n                  มีอาการทางระบบประสาทหรือการบาดเจ็บต่อไปนี้ร่วมด้วยหรือไม่? (เลือกได้หลายข้อ)\n                </label>\n                <div class=\"space-y-2\">\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"alteredMentalNeuroFlags\" value=\"focal_weakness_numbness\" class=\"text-medical-600 rounded mt-0.5\">\n                    <span class=\"ml-3 text-xs text-slate-800\">แขนหรือขาอ่อนแรงครึ่งซีก ปากเบี้ยว ยิ้มไม่เท่ากัน หรือชาครึ่งซีก</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"alteredMentalNeuroFlags\" value=\"seizure_or_abnormal_movement\" class=\"text-medical-600 rounded mt-0.5\">\n                    <span class=\"ml-3 text-xs text-slate-800\">มีอาการชักเกร็ง กระตุก ตาค้าง เหม่อลอย เคี้ยวปาก หรือสะบัดมือเท้าผิดปกติ</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"alteredMentalNeuroFlags\" value=\"stiff_neck_or_severe_headache\" class=\"text-medical-600 rounded mt-0.5\">\n                    <span class=\"ml-3 text-xs text-slate-800\">มีอาการคอแข็งเกร็ง ก้มคอไม่ลง หรือมีอาการปวดศีรษะรุนแรงมากนำมาก่อน</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"alteredMentalNeuroFlags\" value=\"gaze_deviation_or_fixed\" class=\"text-medical-600 rounded mt-0.5\">\n                    <span class=\"ml-3 text-xs text-slate-800\">ตากลอกไม่มา หรือมองค้างไปข้างใดข้างหนึ่ง</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"alteredMentalNeuroFlags\" id=\"alteredMentalHeadTraumaCb\" value=\"head_trauma_history\" onchange=\"handleAlteredMentalHeadTraumaToggle(this)\" class=\"text-medical-600 rounded mt-0.5\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">มีประวัติลื่นล้ม ศีรษะกระแทก หรือเกิดอุบัติเหตุที่ศีรษะมาก่อนหน้านี้ (แม้ไม่มีบาดแผลชัดเจน)</span>\n                      <span class=\"block text-[11px] text-slate-500\">รวมถึงการกระแทกเบาๆ ทั้งที่เพิ่งเกิด หรือเกิดขึ้นมาหลายวัน/สัปดาห์/เดือน</span>\n                    </div>\n                  </label>\n\n                  <!-- Progressive Disclosure: ช่วงเวลาอุบัติเหตุศีรษะที่ครอบคลุมทุกช่วงเวลา -->\n                  <div id=\"alteredMentalHeadTraumaWrap\" class=\"hidden ml-7 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2\">\n                    <label class=\"block text-[11px] font-semibold text-slate-700\">ระบุช่วงเวลาที่เกิดเหตุศีรษะกระแทกหรือลื่นล้ม:</label>\n                    <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2\">\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer text-xs\">\n                        <input type=\"radio\" name=\"alteredMentalHeadTraumaTime\" value=\"within_24h\" class=\"text-medical-600\">\n                        <span class=\"ml-2 text-slate-800\">ภายใน 24 ชั่วโมงที่ผ่านมา</span>\n                      </label>\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer text-xs\">\n                        <input type=\"radio\" name=\"alteredMentalHeadTraumaTime\" value=\"gt24h_to_1w\" class=\"text-medical-600\">\n                        <span class=\"ml-2 text-slate-800\">มากกว่า 24 ชั่วโมง ถึง 1 สัปดาห์ (1–7 วันก่อน)</span>\n                      </label>\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer text-xs\">\n                        <input type=\"radio\" name=\"alteredMentalHeadTraumaTime\" value=\"remote_1_2w\" class=\"text-medical-600\">\n                        <span class=\"ml-2 text-slate-800\">ประมาณ 1–2 สัปดาห์ก่อน</span>\n                      </label>\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer text-xs\">\n                        <input type=\"radio\" name=\"alteredMentalHeadTraumaTime\" value=\"remote_2_4w\" class=\"text-medical-600\">\n                        <span class=\"ml-2 text-slate-800\">ประมาณ 2–4 สัปดาห์ (1 เดือน) ก่อน</span>\n                      </label>\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer text-xs\">\n                        <input type=\"radio\" name=\"alteredMentalHeadTraumaTime\" value=\"remote_1_2m\" class=\"text-medical-600\">\n                        <span class=\"ml-2 text-slate-800\">ประมาณ 1–2 เดือนก่อน</span>\n                      </label>\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer text-xs\">\n                        <input type=\"radio\" name=\"alteredMentalHeadTraumaTime\" value=\"remote_gt_2m\" class=\"text-medical-600\">\n                        <span class=\"ml-2 text-slate-800\">มากกว่า 2 เดือนขึ้นไป</span>\n                      </label>\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer text-xs sm:col-span-2\">\n                        <input type=\"radio\" name=\"alteredMentalHeadTraumaTime\" value=\"remote_unknown\" class=\"text-medical-600\">\n                        <span class=\"ml-2 text-slate-800\">จำระยะเวลาที่แน่นอนไม่ได้</span>\n                      </label>\n                    </div>\n                  </div>\n\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"alteredMentalNeuroFlags\" id=\"alteredMentalVisibleHeadWoundCb\" value=\"visible_head_wound\" onchange=\"handleAlteredMentalHeadWoundToggle(this)\" class=\"text-medical-600 rounded mt-0.5\">\n                    <span class=\"ml-3 text-xs text-slate-800\">มีบาดแผล บวมโน หรือรอยฟกช้ำที่บริเวณศีรษะหรือใบหน้า</span>\n                  </label>\n\n                  <!-- Progressive Disclosure: ตำแหน่งบาดแผลศีรษะ -->\n                  <div id=\"alteredMentalHeadWoundDetailsWrap\" class=\"hidden ml-7 p-3 bg-slate-50 border border-slate-200 rounded-xl\">\n                    <label class=\"block text-[11px] font-semibold text-slate-700 mb-1\">ระบุตำแหน่งบาดแผล รอยบวมโน หรือรอยฟกช้ำบนศีรษะ/ใบหน้า:</label>\n                    <input type=\"text\" id=\"alteredMentalHeadWoundLocation\" placeholder=\"เช่น ขมับขวา, หน้าผาก, ท้ายทอย, รอบเบ้าตา\" class=\"w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400\">\n                  </div>\n\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"alteredMentalNeuroFlags\" id=\"alteredMentalNeuroNoneCb\" value=\"none_neuro_flags\" onchange=\"handleAlteredMentalNeuroNoneToggle(this)\" class=\"text-medical-600 rounded mt-0.5\">\n                    <span class=\"ml-3 text-xs text-slate-800\">ไม่มีอาการทางระบบประสาทหรือการบาดเจ็บข้างต้นเลย</span>\n                  </label>\n                </div>\n              </div>\n\n            </div>\n          </div>\n\n          <!-- CARD 4: อาการทางร่างกายและการติดเชื้อร่วม (Systemic Review & Potential Infection Sources) -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"thermometer\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-900\"><span id=\"alteredMentalCard4Num\">4</span>. อาการทางร่างกายและการติดเชื้อร่วม</h2>\n                <p class=\"text-xs text-slate-500\">คัดกรองภาวะติดเชื้อในกระแสเลือด ทางเดินหายใจ ทางเดินปัสสาวะ ผิวหนัง และทางเดินอาหาร</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4\">\n              <!-- 4.1 อาการแสดงทางร่างกายและการติดเชื้อ -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2\">\n                  1. มีอาการทางร่างกายหรืออาการติดเชื้อต่อไปนี้หรือไม่? (เลือกได้หลายข้อ)\n                </label>\n                <div class=\"space-y-2\">\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"alteredMentalSystemicFlags\" value=\"high_fever_or_hypothermia\" class=\"text-medical-600 rounded mt-0.5\">\n                    <span class=\"ml-3 text-xs text-slate-800\">มีไข้สูง หนาวสั่น หรือตัวเย็นเฉียบผิดปกติ</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"alteredMentalSystemicFlags\" value=\"tachypnea_labored_breathing\" class=\"text-medical-600 rounded mt-0.5\">\n                    <span class=\"ml-3 text-xs text-slate-800\">หายใจหอบเร็ว หายใจเหนื่อยรุนแรง หรือมีเสียงครืดคราดในคอ</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"alteredMentalSystemicFlags\" value=\"cyanosis_cold_clammy\" class=\"text-medical-600 rounded mt-0.5\">\n                    <span class=\"ml-3 text-xs text-slate-800\">ปลายมือปลายเท้าเย็นเฉียบ หน้าซีด ลายพร้อย หรือริมฝีปากเขียวคล้ำ</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"alteredMentalSystemicFlags\" value=\"cough_purulent_sputum\" class=\"text-medical-600 rounded mt-0.5\">\n                    <span class=\"ml-3 text-xs text-slate-800\">มีอาการไอ มีเสมหะข้นสีเหลืองหรือเขียว</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"alteredMentalSystemicFlags\" value=\"rhinorrhea_sore_throat\" class=\"text-medical-600 rounded mt-0.5\">\n                    <span class=\"ml-3 text-xs text-slate-800\">มีน้ำมูก คัดจมูก หรือเจ็บคอ</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"alteredMentalSystemicFlags\" value=\"foul_cloudy_urine\" class=\"text-medical-600 rounded mt-0.5\">\n                    <span class=\"ml-3 text-xs text-slate-800\">ปัสสาวะมีกลิ่นเหม็น ขุ่น หรือมีสีส้มปนเลือด</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"alteredMentalSystemicFlags\" value=\"infected_bedsore_wound\" class=\"text-medical-600 rounded mt-0.5\">\n                    <span class=\"ml-3 text-xs text-slate-800\">มีแผลกดทับ แผลเบาหวานที่เท้า หรือแผลผ่าตัดที่มีหนองหรือบวมแดงร้อน</span>\n                  </label>\n                </div>\n              </div>\n\n              <!-- 4.2 ระบบทางเดินอาหาร (Progressive GI Branching) -->\n              <div class=\"pt-2 border-t border-slate-100\">\n                <label class=\"block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2\">\n                  2. อาการทางระบบทางเดินอาหาร (ถ้ามี ให้เลือกและระบุรายละเอียด):\n                </label>\n                <div class=\"space-y-3\">\n                  <!-- ก. ปวดท้อง -->\n                  <div class=\"p-3 bg-slate-50 rounded-xl border border-slate-200\">\n                    <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer\">\n                      <input type=\"checkbox\" id=\"alteredMentalGiAbdpain\" onchange=\"handleAlteredMentalGiToggle()\" class=\"text-medical-600 rounded\">\n                      <span class=\"ml-2.5 text-xs text-slate-800 font-semibold\">มีอาการปวดท้อง (Abdominal pain)</span>\n                    </label>\n                    <div id=\"alteredMentalAbdpainWrap\" class=\"hidden mt-3 pl-2 space-y-2 border-t border-slate-200 pt-2\">\n                      <label class=\"block text-[11px] font-semibold text-slate-700\">ตำแหน่งที่ปวดท้อง (เลือกได้หลายตำแหน่ง):</label>\n                      <div class=\"grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs\">\n                        <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer\">\n                          <input type=\"checkbox\" name=\"alteredMentalAbdpainLocs\" value=\"ruq\" class=\"text-medical-600 rounded\">\n                          <span class=\"ml-2 text-slate-700\">ชายโครงขวา</span>\n                        </label>\n                        <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer\">\n                          <input type=\"checkbox\" name=\"alteredMentalAbdpainLocs\" value=\"epigastrium\" class=\"text-medical-600 rounded\">\n                          <span class=\"ml-2 text-slate-700\">ลิ้นปี่</span>\n                        </label>\n                        <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer\">\n                          <input type=\"checkbox\" name=\"alteredMentalAbdpainLocs\" value=\"luq\" class=\"text-medical-600 rounded\">\n                          <span class=\"ml-2 text-slate-700\">ชายโครงซ้าย</span>\n                        </label>\n                        <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer\">\n                          <input type=\"checkbox\" name=\"alteredMentalAbdpainLocs\" value=\"rlq\" class=\"text-medical-600 rounded\">\n                          <span class=\"ml-2 text-slate-700\">ท้องน้อยขวา</span>\n                        </label>\n                        <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer\">\n                          <input type=\"checkbox\" name=\"alteredMentalAbdpainLocs\" value=\"suprapubic\" class=\"text-medical-600 rounded\">\n                          <span class=\"ml-2 text-slate-700\">เหนือหัวเหน่า</span>\n                        </label>\n                        <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer\">\n                          <input type=\"checkbox\" name=\"alteredMentalAbdpainLocs\" value=\"llq\" class=\"text-medical-600 rounded\">\n                          <span class=\"ml-2 text-slate-700\">ท้องน้อยซ้าย</span>\n                        </label>\n                        <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer col-span-2\">\n                          <input type=\"checkbox\" name=\"alteredMentalAbdpainLocs\" value=\"diffuse\" class=\"text-medical-600 rounded\">\n                          <span class=\"ml-2 text-slate-700\">ปวดทั่วท้อง / ระบุตำแหน่งไม่ได้</span>\n                        </label>\n                      </div>\n                      <label class=\"block text-[11px] font-semibold text-slate-700 pt-1\">ลักษณะการปวดท้อง:</label>\n                      <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs\">\n                        <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer\">\n                          <input type=\"radio\" name=\"alteredMentalAbdpainChar\" value=\"colicky_spasm\" class=\"text-medical-600\">\n                          <span class=\"ml-2 text-slate-700\">ปวดบิดเกร็งเป็นพักๆ</span>\n                        </label>\n                        <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer\">\n                          <input type=\"radio\" name=\"alteredMentalAbdpainChar\" value=\"dull_aching\" class=\"text-medical-600\">\n                          <span class=\"ml-2 text-slate-700\">ปวดตื้อแน่นถ่วงๆ ตลอดเวลา</span>\n                        </label>\n                        <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer\">\n                          <input type=\"radio\" name=\"alteredMentalAbdpainChar\" value=\"burning\" class=\"text-medical-600\">\n                          <span class=\"ml-2 text-slate-700\">ปวดแสบร้อนกลางอก/ลิ้นปี่</span>\n                        </label>\n                        <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer\">\n                          <input type=\"radio\" name=\"alteredMentalAbdpainChar\" value=\"sharp_severe\" class=\"text-medical-600\">\n                          <span class=\"ml-2 text-slate-700\">ปวดรุนแรงเฉียบพลัน/เสียดแทง</span>\n                        </label>\n                      </div>\n                    </div>\n                  </div>\n\n                  <!-- ข. ถ่ายเหลว / ท้องเสีย -->\n                  <div class=\"p-3 bg-slate-50 rounded-xl border border-slate-200\">\n                    <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer\">\n                      <input type=\"checkbox\" id=\"alteredMentalGiDiarrhea\" onchange=\"handleAlteredMentalGiToggle()\" class=\"text-medical-600 rounded\">\n                      <span class=\"ml-2.5 text-xs text-slate-800 font-semibold\">มีอาการถ่ายเหลว / ท้องเสีย (Diarrhea)</span>\n                    </label>\n                    <div id=\"alteredMentalDiarrheaWrap\" class=\"hidden mt-3 pl-2 space-y-2 border-t border-slate-200 pt-2\">\n                      <div class=\"flex items-center space-x-2\">\n                        <label class=\"text-[11px] font-semibold text-slate-700\">จำนวนครั้งที่ถ่ายเหลวต่อวัน:</label>\n                        <input type=\"number\" id=\"alteredMentalDiarrheaFreq\" min=\"0\" placeholder=\"เช่น 3, 5\" class=\"w-24 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800\">\n                        <span class=\"text-xs text-slate-500\">ครั้ง/วัน</span>\n                      </div>\n                      <label class=\"block text-[11px] font-semibold text-slate-700 pt-1\">ลักษณะอุจจาระ (เลือกได้หลายข้อ):</label>\n                      <div class=\"grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs\">\n                        <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer\">\n                          <input type=\"checkbox\" name=\"alteredMentalDiarrheaStools\" value=\"watery\" class=\"text-medical-600 rounded\">\n                          <span class=\"ml-2 text-slate-700\">ถ่ายเป็นน้ำเหลว</span>\n                        </label>\n                        <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer\">\n                          <input type=\"checkbox\" name=\"alteredMentalDiarrheaStools\" value=\"mucous\" class=\"text-medical-600 rounded\">\n                          <span class=\"ml-2 text-slate-700\">มีมูกปน</span>\n                        </label>\n                        <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer\">\n                          <input type=\"checkbox\" name=\"alteredMentalDiarrheaStools\" value=\"bloody\" class=\"text-medical-600 rounded\">\n                          <span class=\"ml-2 text-slate-700\">มีเลือดสดปน</span>\n                        </label>\n                        <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer\">\n                          <input type=\"checkbox\" name=\"alteredMentalDiarrheaStools\" value=\"melena_tarry\" class=\"text-medical-600 rounded\">\n                          <span class=\"ml-2 text-slate-700\">อุจจาระสีดำเหมือนยางมะตอย</span>\n                        </label>\n                      </div>\n                    </div>\n                  </div>\n\n                  <!-- ค. คลื่นไส้ / อาเจียน -->\n                  <div class=\"p-3 bg-slate-50 rounded-xl border border-slate-200\">\n                    <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer\">\n                      <input type=\"checkbox\" id=\"alteredMentalGiVomit\" onchange=\"handleAlteredMentalGiToggle()\" class=\"text-medical-600 rounded\">\n                      <span class=\"ml-2.5 text-xs text-slate-800 font-semibold\">มีอาการคลื่นไส้ / อาเจียน (Vomiting)</span>\n                    </label>\n                    <div id=\"alteredMentalVomitWrap\" class=\"hidden mt-3 pl-2 space-y-2 border-t border-slate-200 pt-2\">\n                      <div class=\"flex items-center space-x-2\">\n                        <label class=\"text-[11px] font-semibold text-slate-700\">จำนวนครั้งที่อาเจียนต่อวัน:</label>\n                        <input type=\"number\" id=\"alteredMentalVomitFreq\" min=\"0\" placeholder=\"เช่น 2, 4\" class=\"w-24 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800\">\n                        <span class=\"text-xs text-slate-500\">ครั้ง/วัน</span>\n                      </div>\n                      <label class=\"block text-[11px] font-semibold text-slate-700 pt-1\">ลักษณะสิ่งที่อาเจียนออกมา (เลือกได้หลายข้อ):</label>\n                      <div class=\"grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs\">\n                        <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer\">\n                          <input type=\"checkbox\" name=\"alteredMentalVomitContents\" value=\"food_content\" class=\"text-medical-600 rounded\">\n                          <span class=\"ml-2 text-slate-700\">เศษอาหาร</span>\n                        </label>\n                        <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer\">\n                          <input type=\"checkbox\" name=\"alteredMentalVomitContents\" value=\"bile_green\" class=\"text-medical-600 rounded\">\n                          <span class=\"ml-2 text-slate-700\">น้ำดีสีเขียว/เหลือง</span>\n                        </label>\n                        <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer\">\n                          <input type=\"checkbox\" name=\"alteredMentalVomitContents\" value=\"coffee_ground_blood\" class=\"text-medical-600 rounded\">\n                          <span class=\"ml-2 text-slate-700\">มีเลือดสดหรือสีกาแฟคั่ว</span>\n                        </label>\n                        <label class=\"selectable-card flex items-center p-2 rounded-lg bg-white border border-slate-200 cursor-pointer\">\n                          <input type=\"checkbox\" name=\"alteredMentalVomitContents\" value=\"projectile\" class=\"text-medical-600 rounded\">\n                          <span class=\"ml-2 text-slate-700\">อาเจียนพุ่งรุนแรง</span>\n                        </label>\n                      </div>\n                    </div>\n                  </div>\n                </div>\n              </div>\n\n            </div>\n          </div>\n\n          <!-- CARD 5: ประวัติความเสี่ยงเฉพาะโรค ยาที่ใช้ สารพิษ และสารกระตุ้น (Precipitants, Toxic & Metabolic Risks) -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"alert-triangle\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-900\"><span id=\"alteredMentalCard5Num\">5</span>. ประวัติความเสี่ยงเฉพาะโรค ยาที่ใช้ สารพิษ และสารกระตุ้น</h2>\n                <p class=\"text-xs text-slate-500\">ตรวจสอบโรคประจำตัว ยาที่ได้รับ สารเคมี สุรา และสารพิษที่อาจเป็นสาเหตุ</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4\">\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2\">\n                  มีประวัติความเสี่ยง โรคประจำตัว หรือการใช้ยา/สารต่อไปนี้หรือไม่? (เลือกได้หลายข้อ)\n                </label>\n                <div class=\"space-y-2\">\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"alteredMentalRiskPrecipitants\" value=\"diabetic_insulin_meds\" class=\"text-medical-600 rounded mt-0.5\">\n                    <span class=\"ml-3 text-xs text-slate-800\">ผู้ป่วยโรคเบาหวาน หรือฉีดอินซูลินหรือทานยาลดน้ำตาล (เสี่ยงภาวะน้ำตาลในเลือดต่ำ)</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"alteredMentalRiskPrecipitants\" value=\"chronic_kidney_missed_dialysis\" class=\"text-medical-600 rounded mt-0.5\">\n                    <span class=\"ml-3 text-xs text-slate-800\">เป็นโรคไตวายเรื้อรัง (CKD) โดยเฉพาะผู้ที่ฟอกเลือด/ล้างไตแล้วขาดการฟอก หรือปัสสาวะไม่ออก</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"alteredMentalRiskPrecipitants\" value=\"cirrhosis_jaundice_ascites\" class=\"text-medical-600 rounded mt-0.5\">\n                    <span class=\"ml-3 text-xs text-slate-800\">เป็นโรคตับแข็ง มีตาเหลือง ท้องมาน หรือมีอาการถ่ายดำ/ท้องผูกรุนแรงนำมาก่อน</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"alteredMentalRiskPrecipitants\" value=\"new_meds_or_sedatives\" class=\"text-medical-600 rounded mt-0.5\">\n                    <span class=\"ml-3 text-xs text-slate-800\">เพิ่งเริ่มรับประทานยาใหม่ หรือทานยานอนหลับ ยาคลายกังวล ยาแก้แพ้แก้เมา หรือยาแก้ปวดกลุ่ม Tramadol/Morphine</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"alteredMentalRiskPrecipitants\" value=\"alcohol_heavy_or_abrupt_stop\" class=\"text-medical-600 rounded mt-0.5\">\n                    <span class=\"ml-3 text-xs text-slate-800\">ดื่มสุราหนักเป็นประจำ หรือเพิ่งหยุดดื่มกะทันหันใน 1–4 วันนี้</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"alteredMentalRiskPrecipitants\" id=\"alteredMentalSuspectedToxinCb\" value=\"suspected_overdose_toxin\" onchange=\"handleAlteredMentalToxinToggle(this)\" class=\"text-medical-600 rounded mt-0.5\">\n                    <span class=\"ml-3 text-xs text-slate-800\">สงสัยรับประทานยาเกินขนาด กินยาพิษ ยาฆ่าหญ้า/สารเคมีกำจัดแมลง</span>\n                  </label>\n\n                  <!-- Progressive Disclosure: รายละเอียดสารพิษ/ยาเกินขนาด -->\n                  <div id=\"alteredMentalToxinDetailsWrap\" class=\"hidden ml-7 p-3 bg-slate-50 border border-slate-200 rounded-xl\">\n                    <label class=\"block text-[11px] font-semibold text-slate-700 mb-1\">ระบุชนิดของยา สารเคมี หรือสารพิษที่สงสัย (ถ้าทราบ):</label>\n                    <input type=\"text\" id=\"alteredMentalToxinDetails\" placeholder=\"เช่น ยานอนหลับ, ยาลดความดัน, พาราเซตามอล, ยาฆ่าหญ้า, สารเคมีในบ้าน\" class=\"w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400\">\n                  </div>\n\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"alteredMentalRiskPrecipitants\" value=\"baseline_psychiatric_history\" class=\"text-medical-600 rounded mt-0.5\">\n                    <span class=\"ml-3 text-xs text-slate-800\">มีประวัติโรคทางจิตเวช (เช่น ซึมเศร้า ไบโพลาร์ จิตเภท)</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"alteredMentalRiskPrecipitants\" id=\"alteredMentalRiskNoneCb\" value=\"none_risk_factors\" onchange=\"handleAlteredMentalRiskNoneToggle(this)\" class=\"text-medical-600 rounded mt-0.5\">\n                    <span class=\"ml-3 text-xs text-slate-800\">ไม่มีประวัติความเสี่ยงหรือการใช้ยาข้างต้น</span>\n                  </label>\n                </div>\n              </div>\n\n            </div>\n          </div>\n\n          <!-- CARD 6: ข้อมูลเพิ่มเติมและความเห็นของผู้ให้ข้อมูล (Additional Notes & Informant Observations) -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-slate-100 text-slate-600 p-2 rounded-xl\">\n                <i data-lucide=\"message-square-plus\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-900\"><span id=\"alteredMentalCard6Num\">6</span>. อาการอื่น ๆ หรือข้อความเพิ่มเติมถึงแพทย์ (Additional Notes)</h2>\n                <p class=\"text-xs text-slate-500\">ระบุรายละเอียดอื่นๆ ที่สังเกตเห็น หรือสิ่งที่พบเห็นในที่เกิดเหตุ (ไม่บังคับ)</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4\">\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2\">\n                  ข้อสังเกตหรือข้อมูลอื่นๆ เพิ่มเติม:\n                </label>\n                <textarea id=\"alteredMentalAdditionalNotes\" rows=\"3\" placeholder=\"เช่น พบซองยาตกอยู่ข้างตัว, ได้กลิ่นสุราหรือสารเคมี, ก่อนหน้านี้บ่นปวดหัวมาก, ญาติเพิ่งสังเกตเห็นเมื่อเข้ามาปลุกตอนเช้า ฯลฯ\" class=\"w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 placeholder:text-slate-400\"></textarea>\n              </div>\n            </div>\n          </div>\n\n        </div>\n",
  algorithm: {
  "id": "altered_mental",
  "schemaCode": "altered_mental_status",
  "titleTh": "ซึมลง / สับสนเฉียบพลัน / ระดับความรู้สึกตัวเปลี่ยนแปลง (Altered Mental Status / Delirium / Coma)",
  "titleEn": "Altered Mental Status / Delirium / Coma Workup",
  "sections": [
    {
      "sectionNo": 1,
      "titleTh": "ข้อมูลผู้ให้ประวัติ ระดับความสามารถเดิม และเวลาปกติครั้งสุดท้าย (Context, Baseline & LSN)",
      "questions": [
        {
          "key": "duration",
          "labelTh": "เริ่มสังเกตเห็นอาการซึมลงหรือสับสนมานานเท่าไรแล้ว?",
          "type": "duration_with_unit",
          "units": "UNIVERSAL_DURATION_UNITS"
        },
        {
          "key": "alteredMentalReporter",
          "labelTh": "ผู้ให้ข้อมูลประวัติเหตุการณ์",
          "type": "single_choice",
          "options": [
            {
              "value": "caregiver_family",
              "patientTh": "ญาติหรือผู้ดูแลใกล้ชิดที่อาศัยอยู่ร่วมกับผู้ป่วยทุกวัน",
              "doctorTh": "ญาติหรือผู้ดูแลใกล้ชิดประจำ (Primary caregiver)"
            },
            {
              "value": "relative_occasional",
              "patientTh": "ญาติที่ไม่ได้อยู่ด้วยกันประจำ เพิ่งมาเยี่ยมและสังเกตเห็น",
              "doctorTh": "ญาติที่ไม่ได้อยู่ด้วยกันประจำ เพิ่งมาเยี่ยมพบ (Occasional visiting relative)"
            },
            {
              "value": "witness_rescuer",
              "patientTh": "ผู้พบเห็นเหตุการณ์ / เพื่อนร่วมงาน / เจ้าหน้าที่กู้ชีพกู้ภัย",
              "doctorTh": "ผู้พบเห็นเหตุการณ์หรือกู้ชีพ (Bystander / EMS rescuer)"
            },
            {
              "value": "patient_confused",
              "patientTh": "ผู้ป่วยพยายามเล่าเองแต่สับสนหรือไม่สามารถให้ข้อมูลที่ต่อเนื่องได้",
              "doctorTh": "ผู้ป่วยพยายามให้ประวัติเองแต่สับสน (Confused patient self-report)"
            }
          ]
        },
        {
          "key": "alteredMentalBaselineStatus",
          "labelTh": "ระดับความรู้สึกตัวและความสามารถเดิมก่อนเกิดอาการในครั้งนี้ (Baseline Mental & Functional Status)",
          "type": "single_choice",
          "options": [
            {
              "value": "normal_independent",
              "patientTh": "ปกติ ช่วยเหลือตัวเองได้สมบูรณ์ จำเหตุการณ์และบุคคลได้แม่นยำ",
              "doctorTh": "เดิมปกติ ช่วยเหลือตัวเองได้ดี (Baseline independent / intact cognition)"
            },
            {
              "value": "mild_cognitive_independent",
              "patientTh": "หลงลืมเล็กน้อยตามวัย แต่ช่วยเหลือตัวเองในชีวิตประจำวันได้",
              "doctorTh": "เดิมหลงลืมเล็กน้อยตามวัย ช่วยเหลือตัวเองได้ (Mild cognitive impairment)"
            },
            {
              "value": "known_dementia_partially_dependent",
              "patientTh": "มีภาวะสมองเสื่อมเดิม ช่วยเหลือตัวเองได้บางส่วน แต่ครั้งนี้ซึมลง/สับสนชัดเจนกว่าเดิมมาก",
              "doctorTh": "มีภาวะสมองเสื่อมเดิม แต่ครั้งนี้ซึมลง/สับสนเฉียบพลันทรุดลงจากเดิม 🚩 (Acute-on-Chronic Delirium)",
              "isRedFlag": true
            },
            {
              "value": "bedridden_totally_dependent",
              "patientTh": "ผู้ป่วยติดเตียง ช่วยเหลือตัวเองไม่ได้เดิม แต่ครั้งนี้ระดับการตื่นตัวลดลงผิดปกติ",
              "doctorTh": "ผู้ป่วยติดเตียงเดิม แต่ครั้งนี้ระดับการตื่นตัวลดลงผิดปกติ 🚩 (Bedridden with Acute Deterioration)",
              "isRedFlag": true
            }
          ]
        },
        {
          "key": "alteredMentalOnsetPattern",
          "labelTh": "รูปแบบการเริ่มสังเกตเห็นอาการผิดปกติชัดเจน",
          "type": "single_choice",
          "options": [
            {
              "value": "hyperacute_minutes",
              "patientTh": "เกิดขึ้นทันทีทันใด ปุบปับในหลักนาที",
              "doctorTh": "เกิดขึ้นทันทีทันใดในหลักนาที 🚩 (Hyperacute onset - Stroke/Seizure/Hypoglycemia)",
              "isRedFlag": true
            },
            {
              "value": "acute_hours",
              "patientTh": "เช่น เริ่มสังเกตเห็นช่วงเช้า/บ่าย และซึมลงหรือสับสนมากขึ้นเรื่อยๆ ภายในวันนี้",
              "doctorTh": "เป็นมากขึ้นเฉียบพลันภายในไม่กี่ชั่วโมง 🚩 (Acute onset - Sepsis/Metabolic/Toxin)",
              "isRedFlag": true
            },
            {
              "value": "subacute_days",
              "patientTh": "ค่อยๆ ซึมลง สับสน หรือพฤติกรรมเปลี่ยนสะสมมาหลายวัน",
              "doctorTh": "ค่อยๆ เป็นสะสมมาหลายวัน (Subacute - Sepsis/SDH/Electrolytes)"
            },
            {
              "value": "fluctuating_day_night",
              "patientTh": "อาการขึ้นๆ ลงๆ เดี๋ยวรู้เรื่องเดี๋ยวสับสน โดยเฉพาะช่วงพลบค่ำหรือกลางคืน",
              "doctorTh": "อาการขึ้นๆ ลงๆ ผันผวนตามช่วงเวลา (Fluctuating course / Delirium)"
            }
          ]
        }
      ]
    },
    {
      "sectionNo": 2,
      "titleTh": "ระดับการตื่นตัวและพฤติกรรมการรู้คิด (Consciousness Level & Cognitive Behaviors)",
      "questions": [
        {
          "key": "alteredMentalLevelOfConsciousness",
          "labelTh": "ลักษณะระดับการตื่นตัวหลักในขณะนี้",
          "type": "single_choice",
          "options": [
            {
              "value": "drowsy_lethargic",
              "patientTh": "ซึมลง ปลุกตื่นง่ายเมื่อเรียก ลืมตาตอบสนองได้ช้า แต่เมื่อหยุดคุยจะผล็อยหลับไปใหม่",
              "doctorTh": "ซึมลง ปลุกตื่นง่าย (Drowsy / Lethargic)"
            },
            {
              "value": "stupor_pain_only",
              "patientTh": "หลับลึก ปลุกด้วยเสียงไม่ตื่น ต้องเขย่าตัวแรงๆ หรือกดเจ็บจึงจะลืมตาหรือขยับตัว",
              "doctorTh": "หลับลึก ต้องกระตุ้นเจ็บจึงจะตอบสนอง 🚩 (Stupor / Depressed sensorium)",
              "isRedFlag": true
            },
            {
              "value": "coma_unresponsive",
              "patientTh": "ไม่ลืมตา ไม่ตอบสนองต่อเสียงเรียกและการเขย่าตัวแรงๆ",
              "doctorTh": "ไม่ลืมตา ไม่ตอบสนองต่อเสียงเรียกและการเขย่าตัวแรงๆ 🚩 (Coma / GCS <= 8)",
              "isRedFlag": true
            },
            {
              "value": "awake_but_confused",
              "patientTh": "ลืมตาได้เอง แต่พูดคุยสับสน สื่อสารไม่รู้เรื่อง จำบุคคล/เวลา/สถานที่ไม่ได้",
              "doctorTh": "ลืมตาได้เอง แต่พูดคุยสับสน สื่อสารไม่รู้เรื่อง (Awake but confused / Delirious)"
            }
          ]
        },
        {
          "key": "alteredMentalCognitiveBehaviors",
          "labelTh": "พฤติกรรมและการรู้คิดที่ผิดปกติ",
          "type": "multiple_choice",
          "options": [
            {
              "key": "inattention_unfocused",
              "patientTh": "ขาดสมาธิ เหม่อลอย ไม่สามารถจดจ่อกับการพูดคุยได้ เรียกไม่ค่อยหัน",
              "doctorTh": "ขาดสมาธิ เหม่อลอย (Inattention)"
            },
            {
              "key": "disoriented_time_place",
              "patientTh": "สับสนวันเวลา สถานที่ หรือจำบ้านและญาติพี่น้องไม่ได้",
              "doctorTh": "สับสนเวลา สถานที่ และบุคคล (Disorientation)"
            },
            {
              "key": "agitated_restless",
              "patientTh": "กระสับกระส่าย เอะอะโวยวาย ลุกเดินพล่าน พยายามดึงสายน้ำเกลือหรือปีนเตียง",
              "doctorTh": "กระสับกระส่าย เอะอะโวยวาย (Hyperactive Agitation)"
            },
            {
              "key": "hallucinations_paranoid",
              "patientTh": "มองเห็นภาพหลอน ได้ยินเสียงแว่ว หรือมีความคิดหวาดระแวง กลัวคนมาทำร้าย",
              "doctorTh": "ภาพหลอน เสียงแว่ว หรือหวาดระแวง (Visual/Auditory Hallucinations)"
            },
            {
              "key": "speech_slurred_or_incoherent",
              "patientTh": "พูดจาเลอะเลือน วกไปวนมา ไม่เป็นประโยค หรือพูดไม่ชัด",
              "doctorTh": "พูดจาเลอะเลือน ไม่ปะติดปะต่อ หรือพูดไม่ชัด (Incoherent speech / Dysarthria)"
            },
            {
              "key": "apathy_mute",
              "patientTh": "นิ่งเฉย ไม่ยอมพูด ไม่ยอมสบตา",
              "doctorTh": "นิ่งเฉย ไม่พูด ไม่สบตา (Apathy / Mute)"
            },
            {
              "key": "poor_intake_refusal",
              "patientTh": "ไม่รับประทานอาหารและน้ำเลย หรือดื่มน้ำได้น้อยมาก",
              "doctorTh": "ไม่รับประทานอาหารและน้ำเลย (Poor intake / Refusal of feeding)"
            }
          ]
        }
      ]
    },
    {
      "sectionNo": 3,
      "titleTh": "สัญญาณเตือนวิกฤตทางระบบประสาทและศีรษะ (Neurological & Trauma Red Flags)",
      "questions": [
        {
          "key": "alteredMentalNeuroSigns",
          "labelTh": "อาการทางระบบประสาทเฉพาะที่",
          "type": "multiple_choice",
          "options": [
            {
              "key": "focal_weakness_face_limb",
              "patientTh": "มีมุมปากเบี้ยว แขนหรือขาอ่อนแรงข้างใดข้างหนึ่งชัดเจน",
              "doctorTh": "ปากเบี้ยว แขนขาอ่อนแรงครึ่งซีก 🚩 (Acute Focal Deficit / Stroke / ICH)",
              "isRedFlag": true
            },
            {
              "key": "gaze_deviation_or_fixed",
              "patientTh": "ตากลอกไม่มา หรือมองค้างไปข้างใดข้างหนึ่ง",
              "doctorTh": "ตากลอกไม่มา หรือมองค้างไปข้างใดข้างหนึ่ง 🚩 (Conjugate Gaze Deviation / Herniation sign)",
              "isRedFlag": true
            },
            {
              "key": "stiff_neck_headache",
              "patientTh": "มีอาการคอแข็งเกร็ง ก้มคอไม่ลง หรือมีอาการปวดศีรษะรุนแรงมากนำมาก่อน",
              "doctorTh": "คอแข็งเกร็ง ก้มคอไม่ได้ หรือปวดศีรษะรุนแรงมาก 🚩 (Meningitis / SAH)",
              "isRedFlag": true
            },
            {
              "key": "subtle_twitching_seizure",
              "patientTh": "มีอาการกระตุกเบาๆ ที่มุมปาก หนังตา หรือปลายนิ้วมือเป็นจังหวะต่อเนื่อง",
              "doctorTh": "กระตุกเบาๆ ที่มุมปาก/หนังตา/นิ้วมือ 🚩 (Non-convulsive Status Epilepticus)",
              "isRedFlag": true
            },
            {
              "key": "no_focal_neuro",
              "patientTh": "ตรวจไม่พบอาการปากเบี้ยวหรือแขนขาอ่อนแรงชัดเจน",
              "doctorTh": "ไม่พบอาการทางระบบประสาทเฉพาะที่ชัดเจน"
            }
          ]
        },
        {
          "key": "alteredMentalHeadTrauma",
          "labelTh": "ประวัติอุบัติเหตุกระแทกศีรษะ (ครอบคลุมทุกช่วงเวลา)",
          "type": "single_choice",
          "options": [
            {
              "value": "within_24h",
              "patientTh": "ภายใน 24 ชั่วโมงที่ผ่านมา",
              "doctorTh": "ศีรษะกระแทกภายใน 24 ชม. 🚩 (Acute TBI / Acute SDH / EDH)",
              "isRedFlag": true
            },
            {
              "value": "gt24h_to_1w",
              "patientTh": "มากกว่า 24 ชั่วโมง ถึง 1 สัปดาห์ (1–7 วันก่อน)",
              "doctorTh": "ศีรษะกระแทก 1-7 วันก่อน 🚩 (Subacute SDH Risk)",
              "isRedFlag": true
            },
            {
              "value": "remote_1_2w",
              "patientTh": "ประมาณ 1–2 สัปดาห์ก่อน",
              "doctorTh": "ศีรษะกระแทก 1-2 สัปดาห์ก่อน 🚩 (Subacute/Chronic SDH)",
              "isRedFlag": true
            },
            {
              "value": "remote_2_4w",
              "patientTh": "ประมาณ 2–4 สัปดาห์ (1 เดือน) ก่อน",
              "doctorTh": "ศีรษะกระแทก 2-4 สัปดาห์ก่อน 🚩 (Chronic SDH)",
              "isRedFlag": true
            },
            {
              "value": "remote_1_2m",
              "patientTh": "ประมาณ 1–2 เดือนก่อน",
              "doctorTh": "ศีรษะกระแทก 1-2 เดือนก่อน 🚩 (Chronic SDH)",
              "isRedFlag": true
            },
            {
              "value": "remote_gt_2m",
              "patientTh": "มากกว่า 2 เดือนขึ้นไป",
              "doctorTh": "ศีรษะกระแทก >2 เดือนก่อน 🚩 (Chronic SDH)",
              "isRedFlag": true
            },
            {
              "value": "remote_unknown",
              "patientTh": "จำระยะเวลาที่แน่นอนไม่ได้",
              "doctorTh": "ศีรษะกระแทก ไม่แน่ชัดช่วงเวลา 🚩",
              "isRedFlag": true
            }
          ]
        }
      ]
    },
    {
      "sectionNo": 4,
      "titleTh": "สัญญาณการติดเชื้อ การหายใจ และระบบทางเดินอาหาร (Systemic Infection, Sepsis & Detailed GI)",
      "questions": [
        {
          "key": "alteredMentalSystemicSigns",
          "labelTh": "อาการทางร่างกายและการติดเชื้อที่พบร่วมด้วย",
          "type": "multiple_choice",
          "options": [
            {
              "key": "high_fever_or_hypothermia",
              "patientTh": "มีไข้สูง หนาวสั่น หรือตัวเย็นเฉียบผิดปกติ",
              "doctorTh": "ไข้สูงหนาวสั่น หรือตัวเย็นผิดปกติ 🚩 (Systemic Infection / Sepsis)",
              "isRedFlag": true
            },
            {
              "key": "tachypnea_labored_breathing",
              "patientTh": "หายใจหอบเร็ว หายใจเหนื่อยรุนแรง หรือมีเสียงครืดคราดในคอ",
              "doctorTh": "หายใจหอบเร็วเหนื่อยรุนแรง 🚩 (Respiratory Distress / Metabolic Acidosis)",
              "isRedFlag": true
            },
            {
              "key": "cyanosis_cold_clammy",
              "patientTh": "ปลายมือปลายเท้าเย็นเฉียบ หน้าซีด ลายพร้อย หรือริมฝีปากเขียวคล้ำ",
              "doctorTh": "ตัวเย็นซีด ปลายมือเท้าเขียวคล้ำ 🚩 (Impending Shock / Hypoxia)",
              "isRedFlag": true
            },
            {
              "key": "cough_purulent_sputum",
              "patientTh": "มีอาการไอ มีเสมหะข้นสีเหลืองหรือเขียว",
              "doctorTh": "ไอเสมหะข้น (Suspected Pneumonia)"
            },
            {
              "key": "rhinorrhea_sore_throat",
              "patientTh": "มีน้ำมูก คัดจมูก หรือเจ็บคอ",
              "doctorTh": "มีน้ำมูก เจ็บคอ (URI / Cold symptoms)"
            },
            {
              "key": "foul_cloudy_urine",
              "patientTh": "ปัสสาวะมีกลิ่นเหม็น ขุ่น หรือมีสีส้มปนเลือด",
              "doctorTh": "ปัสสาวะขุ่นกลิ่นเหม็นรุนแรง (Suspected Urosepsis / CAUTI)"
            },
            {
              "key": "infected_bedsore_wound",
              "patientTh": "มีแผลกดทับ แผลเบาหวานที่เท้า หรือแผลผ่าตัดที่มีหนองหรือบวมแดงร้อน",
              "doctorTh": "แผลกดทับติดเชื้อ/มีหนอง (Infected Bedsore / Soft Tissue Sepsis)"
            }
          ]
        }
      ]
    },
    {
      "sectionNo": 5,
      "titleTh": "ประวัติความเสี่ยงเฉพาะโรค ยาที่ใช้ สารพิษ และสารกระตุ้น (Precipitants, Toxic & Metabolic History)",
      "questions": [
        {
          "key": "alteredMentalRiskPrecipitants",
          "labelTh": "ประวัติความเสี่ยงเฉพาะโรคและการใช้ยา",
          "type": "multiple_choice",
          "options": [
            {
              "key": "diabetic_insulin_meds",
              "patientTh": "ผู้ป่วยโรคเบาหวาน หรือฉีดอินซูลินหรือทานยาลดน้ำตาล (เสี่ยงภาวะน้ำตาลในเลือดต่ำ)",
              "doctorTh": "ผู้ป่วยโรคเบาหวาน หรือฉีดอินซูลินหรือทานยาลดน้ำตาล 🚩 (Severe Hypoglycemia Risk)",
              "isRedFlag": true
            },
            {
              "key": "chronic_kidney_missed_dialysis",
              "patientTh": "เป็นโรคไตวายเรื้อรัง (CKD) โดยเฉพาะผู้ที่ฟอกเลือด/ล้างไตแล้วขาดการฟอก หรือปัสสาวะไม่ออก",
              "doctorTh": "โรคไตวายเรื้อรัง ขาดการฟอกเลือด หรือปัสสาวะไม่ออก 🚩 (Uremic Encephalopathy / Hyperkalemia)",
              "isRedFlag": true
            },
            {
              "key": "cirrhosis_jaundice_ascites",
              "patientTh": "เป็นโรคตับแข็ง มีตาเหลือง ท้องมาน หรือมีอาการถ่ายดำ/ท้องผูกรุนแรงนำมาก่อน",
              "doctorTh": "ตับแข็ง ตาเหลือง ท้องมาน 🚩 (Hepatic Encephalopathy)",
              "isRedFlag": true
            },
            {
              "key": "new_meds_or_sedatives",
              "patientTh": "เพิ่งเริ่มรับประทานยาใหม่ หรือทานยานอนหลับ ยาคลายกังวล ยาแก้แพ้แก้เมา หรือยาแก้ปวดกลุ่ม Tramadol/Morphine",
              "doctorTh": "เริ่มยาใหม่ / ได้รับยานอนหลับ ยากดประสาท หรือ Opioids 🚩 (Sedative-induced Delirium)",
              "isRedFlag": true
            },
            {
              "key": "alcohol_heavy_or_abrupt_stop",
              "patientTh": "ดื่มสุราหนักเป็นประจำ หรือเพิ่งหยุดดื่มกะทันหันใน 1–4 วันนี้",
              "doctorTh": "ดื่มสุราหนักหรือเพิ่งหยุดดื่ม 1-4 วัน 🚩 (Delirium Tremens / Wernicke encephalopathy)",
              "isRedFlag": true
            },
            {
              "key": "suspected_overdose_toxin",
              "patientTh": "สงสัยรับประทานยาเกินขนาด กินยาพิษ ยาฆ่าหญ้า/สารเคมีกำจัดแมลง",
              "doctorTh": "สงสัยกินยาเกินขนาดหรือสารพิษ 🚩 (Acute Toxic Ingestion / Overdose)",
              "isRedFlag": true
            },
            {
              "key": "baseline_psychiatric_history",
              "patientTh": "มีประวัติโรคทางจิตเวช (เช่น ซึมเศร้า ไบโพลาร์ จิตเภท)",
              "doctorTh": "มีประวัติโรคทางจิตเวช (Psychiatric history)"
            }
          ]
        }
      ]
    }
  ]
},
  seedPatients: [
  {
    "id": "case-101",
    "queue_number": "A-101",
    "hn": "6710281",
    "name": "นางสมทรง อุ่นจิตต์",
    "age": 74,
    "gender": "หญิง",
    "chief_complaint": "altered_mental",
    "chief_complaint_title": "ซึมลง / สับสนเฉียบพลัน / ระดับความรู้สึกตัวเปลี่ยนแปลง",
    "status": "waiting",
    "timestamp": "2026-10-26T02:11:26.425Z",
    "durationVal": 2,
    "durationUnit": "hours",
    "alteredMentalReporter": "caregiver_family",
    "alteredMentalReporterRelation": "บุตรสาว",
    "alteredMentalReporterPhone": "089-765-4321",
    "alteredMentalBaselineStatus": "normal_independent",
    "alteredMentalOnsetPattern": "acute_hours",
    "alteredMentalLsnDate": "22/10/2026",
    "alteredMentalLsnTime": "06:30",
    "alteredMentalLsnUnknown": false,
    "alteredMentalLevelOfConsciousness": "stupor_pain_only",
    "alteredMentalCognitiveBehaviors": [
      "inattention_unfocused",
      "speech_slurred_or_incoherent",
      "poor_intake_refusal"
    ],
    "alteredMentalNeuroFlags": [
      "none_neuro_flags"
    ],
    "alteredMentalNeuroSigns": [
      "no_focal_neuro"
    ],
    "alteredMentalHeadTrauma": "no_trauma",
    "alteredMentalVisibleHeadWound": false,
    "alteredMentalHeadWoundLocation": "",
    "alteredMentalSystemicFlags": [
      "cyanosis_cold_clammy"
    ],
    "alteredMentalSystemicSigns": [
      "cyanosis_cold_clammy"
    ],
    "alteredMentalGiAbdpain": false,
    "alteredMentalGiDiarrhea": false,
    "alteredMentalGiVomit": false,
    "altered_mental_has_abdpain": false,
    "altered_mental_has_diarrhea": false,
    "altered_mental_has_vomit": false,
    "alteredMentalRiskPrecipitants": [
      "diabetic_insulin_meds"
    ],
    "alteredMentalToxinDetails": "",
    "otherSymptomsFree": "เช้านี้ฉีดอินซูลินแต่ทานข้าวได้เพียง 2-3 คำ จากนั้นนอนปลุกไม่ตื่น เหงื่อแตกท่วมตัว",
    "underlying": [
      "เบาหวานชนิดที่ 2 (DM type 2 ฉีดอินซูลิน)",
      "ความดันโลหิตสูง (HT)"
    ],
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "Mixtard 30/70 (14-0-8 units SC), Metformin (500) 1x2 pc, Amlodipine (5) 1x1 pc",
    "doctor_notes": {
      "additional_hpi": "หญิงอายุ 74 ปี เป็นเบาหวานฉีดอินซูลิน เช้านี้ฉีดอินซูลิน 14 ยูนิตตามปกติแต่รับประทานข้าวต้มได้เพียง 2-3 คำเนื่องจากเบื่ออาหาร 2 ชั่วโมงต่อมาบุตรสาวเข้าไปปลุกพบว่านอนหลับลึก ปลุกไม่ตื่น เหงื่อแตกท่วมตัว เสื้อเปียกชุ่ม ตัวเย็นเฉียบ ปลุกเขย่าตัวแรงๆ จึงลืมตาแต่ไม่สบตาและไม่พูดจา จึงรีบโทรเรียกรถพยาบาลนำส่ง ER",
      "physical_exam": "BT 36.2 C, PR 108/min, RR 20/min, BP 138/82 mmHg, SpO2 98% on room air. General: Drowsy to stuporous, marked diaphoresis, cool clammy skin. Neuro: E2V2M4 (GCS 8), pupils 3 mm RTLBE, no facial asymmetry, moving all 4 extremities symmetrically to pain stimulus, no neck stiffness. Bedside DTX: 26 mg/dL (Severe Hypoglycemia).",
      "preliminary_dx": "Severe Hypoglycemia (DTX 26 mg/dL) induced by Insulin with Poor Oral Intake in Elderly Diabetic Patient",
      "plan": "1. Immediate IV 50% Glucose 50 mL IV push STAT.\n2. Continuous IV infusion 10% Dextrose in Water (D10W) at 80-100 mL/hr.\n3. Re-check capillary DTX every 15-30 minutes until DTX > 100 mg/dL and mental status fully returns to baseline.\n4. Screen for precipitating factors: Send CBC, Electrolytes, BUN, Cr (evaluate renal function/insulin clearance), UA.\n5. Admit to Intermediate/Observation Ward for continuous hypoglycemia monitoring (long-acting insulin effect)."
    }
  },
  {
    "id": "case-102",
    "queue_number": "A-102",
    "hn": "6710395",
    "name": "นายประวิทย์ ชัยชนะกิจ",
    "age": 81,
    "gender": "ชาย",
    "chief_complaint": "altered_mental",
    "chief_complaint_title": "ซึมลง / สับสนเฉียบพลัน / ระดับความรู้สึกตัวเปลี่ยนแปลง",
    "status": "waiting",
    "timestamp": "2026-10-26T01:56:26.425Z",
    "durationVal": 1,
    "durationUnit": "days",
    "alteredMentalReporter": "caregiver_family",
    "alteredMentalReporterRelation": "ผู้ดูแลประจำ",
    "alteredMentalReporterPhone": "081-234-5678",
    "alteredMentalBaselineStatus": "bedridden_totally_dependent",
    "alteredMentalBedriddenCommunication": "talk_normal",
    "alteredMentalBedriddenMobility": "turn_sit",
    "alteredMentalBedriddenFeeding": "ng_tube",
    "alteredMentalBedriddenElimination": "foley_catheter",
    "bedridden_baseline_speech": "speech_normal",
    "bedridden_baseline_mobility": "mobility_turn_sit",
    "bedridden_baseline_feeding": "feed_ng_tube",
    "bedridden_baseline_elimination": "elim_foley",
    "alteredMentalOnsetPattern": "acute_hours",
    "alteredMentalLsnDate": "21/10/2026",
    "alteredMentalLsnTime": "18:00",
    "alteredMentalLsnUnknown": false,
    "alteredMentalLevelOfConsciousness": "awake_but_confused",
    "alteredMentalCognitiveBehaviors": [
      "inattention_unfocused",
      "disoriented_time_place",
      "agitated_restless",
      "hallucinations_paranoid",
      "speech_slurred_or_incoherent"
    ],
    "alteredMentalNeuroFlags": [
      "none_neuro_flags"
    ],
    "alteredMentalNeuroSigns": [
      "no_focal_neuro"
    ],
    "alteredMentalHeadTrauma": "no_trauma",
    "alteredMentalVisibleHeadWound": false,
    "alteredMentalHeadWoundLocation": "",
    "alteredMentalSystemicFlags": [
      "high_fever_or_hypothermia",
      "tachypnea_labored_breathing",
      "foul_cloudy_urine"
    ],
    "alteredMentalSystemicSigns": [
      "high_fever_or_hypothermia",
      "tachypnea_labored_breathing",
      "foul_cloudy_urine"
    ],
    "alteredMentalGiAbdpain": true,
    "alteredMentalGiDiarrhea": false,
    "alteredMentalGiVomit": false,
    "altered_mental_has_abdpain": true,
    "alteredMentalAbdpainLocs": [
      "lower"
    ],
    "alteredMentalAbdpainLocations": [
      "lower_abd"
    ],
    "alteredMentalAbdpainChar": "colicky",
    "alteredMentalAbdpainChars": [
      "cramping_colicky"
    ],
    "altered_mental_has_diarrhea": false,
    "altered_mental_has_vomit": false,
    "alteredMentalRiskPrecipitants": [
      "chronic_kidney_missed_dialysis"
    ],
    "alteredMentalToxinDetails": "",
    "otherSymptomsFree": "ปัสสาวะในถุงสีขุ่นมีกลิ่นฉุนรุนแรง เอะอะโวยวายพยายามดึงสายยางให้อาหารและสายสวนปัสสาวะ",
    "underlying": [
      "ผู้ป่วยติดเตียงหลังกระดูกสะโพกหัก (Bedridden post Hip Fracture)",
      "ต่อมลูกหมากโต คาสายสวนปัสสาวะ (BPH with Foley catheter)",
      "โรคไตเรื้อรังระยะ 3 (CKD stage 3)"
    ],
    "drugAllergy": "แพ้ยา Penicillin (ผื่นคัน แน่นหน้าอก)",
    "currentMeds": "Omeprazole (20) 1x1 ac, Calcium carbonate 1x3 pc",
    "doctor_notes": {
      "additional_hpi": "ชายอายุ 81 ปี เป็นผู้ป่วยติดเตียงคาสายสวนปัสสาวะ เดิมให้อาหารทางสายยาง NG Tube สื่อสารรู้เรื่อง ทักทายญาติได้ปกติ 1 วันก่อนเริ่มมีไข้สูง หนาวสั่น ปัสสาวะในถุงยูรีนแบ็กขุ่นเป็นตะกอนสีส้มเข้มและมีกลิ่นเหม็นรุนแรง คืนที่ผ่านมามีอาการเอะอะโวยวาย สับสน จำญาติไม่ได้ กระสับกระส่าย เอามือดึงสายยางให้อาหารและพยายามกระชากสายสวนปัสสาวะ เพ้อเห็นภาพหลอนว่ามีคนจะมาขโมยของ หายใจหอบเร็ว จึงนำส่ง ER",
      "physical_exam": "BT 38.9 C, PR 122/min (tachycardia), RR 26/min (tachypnea), BP 92/58 mmHg (MAP 69 mmHg), SpO2 96% on room air. General: Elderly male, confused, agitated, pulling at sheets and lines, flushed skin. Abdomen: Distended, moderate tenderness at suprapubic area, Foley catheter in situ draining cloudy turbid urine with sediment. Neuro: Awake but agitated and severely disoriented, no focal limb weakness, no neck stiffness.",
      "preliminary_dx": "Hyperactive Delirium secondary to Urosepsis / Catheter-Associated Urinary Tract Infection (CAUTI) with Impending Septic Shock",
      "plan": "1. Sepsis 1-Hour Bundle: IV Fluid Resuscitation 30 mL/kg (NSS 1,500 mL IV rapid infusion over 2-3 hrs), monitor MAP > 65 mmHg.\n2. Send STAT Blood: Hemoculture x 2, Urine Gram stain & C/S, CBC, Electrolytes, BUN, Cr, Venous Blood Gas, Serum Lactate.\n3. Empiric IV Antibiotics STAT within 1 hr: IV Ceftriaxone 2 g (or IV Meropenem if history of ESBL; patient allergic to Penicillin - evaluate cephalosporin cross-reactivity or give IV Ciprofloxacin/Aztreonam).\n4. Change Foley catheter and urinary drainage bag under strict aseptic technique.\n5. Non-pharmacological Delirium management: Reorientation by family, adequate lighting, avoid physical restraints if possible (use mittens), consider low-dose IV Haloperidol (0.5-1 mg) only if severe agitation risks pulling lines/injuries."
    }
  },
  {
    "id": "case-103",
    "queue_number": "A-103",
    "hn": "6710442",
    "name": "นายวิชาญ ธนะสมบัติ",
    "age": 68,
    "gender": "ชาย",
    "chief_complaint": "altered_mental",
    "chief_complaint_title": "ซึมลง / สับสนเฉียบพลัน / ระดับความรู้สึกตัวเปลี่ยนแปลง",
    "status": "waiting",
    "timestamp": "2026-10-26T01:41:26.425Z",
    "durationVal": 3,
    "durationUnit": "days",
    "alteredMentalReporter": "relative_occasional",
    "alteredMentalReporterRelation": "ลูกชาย",
    "alteredMentalReporterPhone": "086-555-8899",
    "alteredMentalBaselineStatus": "normal_independent",
    "alteredMentalOnsetPattern": "subacute_days",
    "alteredMentalLsnDate": "19/10/2026",
    "alteredMentalLsnTime": "08:00",
    "alteredMentalLsnUnknown": false,
    "alteredMentalLevelOfConsciousness": "drowsy_lethargic",
    "alteredMentalCognitiveBehaviors": [
      "inattention_unfocused",
      "speech_slurred_or_incoherent",
      "apathy_mute"
    ],
    "alteredMentalNeuroFlags": [
      "focal_weakness_numbness",
      "gaze_deviation_or_fixed",
      "head_trauma_history",
      "visible_head_wound"
    ],
    "alteredMentalNeuroSigns": [
      "focal_weakness_face_limb",
      "gaze_deviation_or_fixed"
    ],
    "alteredMentalHeadTrauma": "head_trauma_history",
    "alteredMentalHeadTraumaTime": "remote_2_4w",
    "alteredMentalRemoteTraumaTime": "remote_2_4w",
    "alteredMentalVisibleHeadWound": true,
    "alteredMentalHeadWoundLocation": "ขมับซ้าย มีรอยฟกช้ำจางๆ และบวมเล็กน้อย",
    "alteredMentalSystemicFlags": [
      "none_systemic_flags"
    ],
    "alteredMentalSystemicSigns": [],
    "alteredMentalGiAbdpain": false,
    "alteredMentalGiDiarrhea": false,
    "alteredMentalGiVomit": false,
    "altered_mental_has_abdpain": false,
    "altered_mental_has_diarrhea": false,
    "altered_mental_has_vomit": false,
    "alteredMentalRiskPrecipitants": [
      "alcohol_heavy_or_abrupt_stop"
    ],
    "alteredMentalToxinDetails": "",
    "otherSymptomsFree": "เดินเซ ขาลากข้างขวา ซึมลงเรื่อยๆ เคยหกล้มหัวฟาดพื้นเมื่อเกือบเดือนก่อน",
    "underlying": [
      "ความดันโลหิตสูง (HT)",
      "ดื่มสุราขาวเป็นประจำ"
    ],
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "Amlodipine (5) 1x1 pc",
    "doctor_notes": {
      "additional_hpi": "ชายอายุ 68 ปี ดื่มสุราเป็นประจำ 3-4 สัปดาห์ก่อนมีประวัติสะดุดบันไดหกล้มศีรษะกระแทกพื้น มีรอยฟกช้ำที่ขมับซ้าย ตอนนั้นรู้สึกตัวดีไม่สลบ ไม่ได้มาพบแพทย์ ในช่วง 3-4 วันที่ผ่านมา ญาติสังเกตเห็นว่าผู้ป่วยเริ่มเดินเซ ขาข้างขวาลาก เดินสะดุดบ่อย พูดช้าลง ลิ้นคับปาก และซึมลงเรื่อยๆ เช้าวันนี้เรียกแล้วตื่นช้า ถามคำถามแล้วไม่ค่อยตอบ แขนและขาข้างขวาไม่มีแรงยกไม่ขึ้น",
      "physical_exam": "BT 36.8 C, PR 68/min, RR 16/min, BP 164/92 mmHg, SpO2 99% on room air. General: Drowsy, slow mentation, responds slowly to commands. HEENT: Old resolving ecchymosis at left frontotemporal region, no active bleeding. Neuro: E3V4M5 (GCS 12), Pupils: Left 4 mm (sluggish), Right 2 mm (prompt) — Anisocoria / Left mydriasis. Motor power: Right upper & lower extremity grade 3/5, Left side grade 5/5 (Right hemiparesis). Left Babinski positive.",
      "preliminary_dx": "Subacute / Chronic Subdural Hematoma (Left frontoparietal SDH) with Mass Effect, Brain Herniation (Left Uncal Herniation Sign / Anisocoria) and Right Hemiparesis",
      "plan": "1. STAT Non-contrast CT Brain immediately (Emergency Stroke / Trauma code).\n2. Maintain Head of Bed elevated 30 degrees, head in neutral midline position.\n3. STAT Neurosurgical consultation for emergency burr hole evacuation / craniotomy.\n4. Send STAT CBC, Coagulation (PT, INR, PTT), Platelets, Type & Crossmatch 2 units PRC.\n5. Keep NPO, prepare for emergency operative intervention."
    }
  },
  {
    "id": "case-104",
    "queue_number": "A-104",
    "hn": "6710520",
    "name": "นายบุญเลิศ วรทัศน์",
    "age": 54,
    "gender": "ชาย",
    "chief_complaint": "altered_mental",
    "chief_complaint_title": "ซึมลง / สับสนเฉียบพลัน / ระดับความรู้สึกตัวเปลี่ยนแปลง",
    "status": "waiting",
    "timestamp": "2026-10-26T01:26:26.425Z",
    "durationVal": 2,
    "durationUnit": "days",
    "alteredMentalReporter": "caregiver_family",
    "alteredMentalReporterRelation": "ภรรยา",
    "alteredMentalReporterPhone": "082-999-1122",
    "alteredMentalBaselineStatus": "normal_independent",
    "alteredMentalOnsetPattern": "subacute_days",
    "alteredMentalLsnDate": "20/10/2026",
    "alteredMentalLsnTime": "12:00",
    "alteredMentalLsnUnknown": false,
    "alteredMentalLevelOfConsciousness": "drowsy_lethargic",
    "alteredMentalCognitiveBehaviors": [
      "inattention_unfocused",
      "disoriented_time_place",
      "speech_slurred_or_incoherent",
      "apathy_mute"
    ],
    "alteredMentalNeuroFlags": [
      "none_neuro_flags"
    ],
    "alteredMentalNeuroSigns": [
      "no_focal_neuro"
    ],
    "alteredMentalHeadTrauma": "no_trauma",
    "alteredMentalVisibleHeadWound": false,
    "alteredMentalHeadWoundLocation": "",
    "alteredMentalSystemicFlags": [
      "none_systemic_flags"
    ],
    "alteredMentalSystemicSigns": [],
    "alteredMentalGiAbdpain": true,
    "alteredMentalGiDiarrhea": false,
    "alteredMentalGiVomit": true,
    "altered_mental_has_abdpain": true,
    "alteredMentalAbdpainLocs": [
      "upper",
      "generalized"
    ],
    "alteredMentalAbdpainLocations": [
      "epigastric_ruq",
      "whole_abd"
    ],
    "alteredMentalAbdpainChar": "dull",
    "alteredMentalAbdpainChars": [
      "dull_aching_distended"
    ],
    "altered_mental_has_diarrhea": false,
    "altered_mental_has_vomit": true,
    "alteredMentalVomitFreq": 2,
    "alteredMentalVomitContents": [
      "coffee_ground_blood",
      "bloody_coffee_ground"
    ],
    "alteredMentalRiskPrecipitants": [
      "cirrhosis_jaundice_ascites",
      "alcohol_heavy_or_abrupt_stop"
    ],
    "alteredMentalToxinDetails": "",
    "otherSymptomsFree": "ท้องอืดแน่น ท้องผูกไม่ถ่าย 3 วัน อาเจียนเป็นสีกาแฟดำ ซึมลงมาก มือสั่นพะงาบๆ",
    "underlying": [
      "โรคตับแข็งจากแอลกอฮอล์ (Alcoholic Cirrhosis Child-Pugh B)",
      "ประวัติเส้นเลือดขอดในหลอดอาหาร (Esophageal varices)"
    ],
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "Propranolol (10) 1x2 pc, Spironolactone (25) 1x1 pc, Furosemide (40) 1/2x1 pc",
    "doctor_notes": {
      "additional_hpi": "ชายอายุ 54 ปี มีโรคประจำตัวตับแข็งจากดื่มสุรา ท้องมานตาเหลือง ทานยาขับปัสสาวะอยู่ 2 วันก่อนมีอาการท้องอืดแน่น ท้องผูกไม่ถ่ายอุจจาระ ญาติสังเกตว่าเริ่มซึมลง สับสนวันเวลา เรียกชื่อลูกผิด มีอาการมือสั่นพะงาบๆ (Asterixis) เมื่อเช้าอาเจียนเป็นน้ำสีดำคล้ำคล้ายกากกาแฟ 2 ครั้ง ปนลิ่มเลือด และบ่นปวดแน่นท้องตลอดเวลา ซึมลงมากขึ้นจนพูดจาอ้อแอ้",
      "physical_exam": "BT 37.0 C, PR 96/min, RR 18/min, BP 106/66 mmHg, SpO2 98% on room air. General: Drowsy, marked jaundice (scleral icterus), spider nevi on chest, palmar erythema, fetor hepaticus. Abdomen: Distended with tense ascites, shifting dullness positive, mild diffuse tenderness without rebound. Neuro: Drowsy, disoriented to time and place, Asterixis / Flapping tremor positive, no focal limb weakness, DTR 2+ all.",
      "preliminary_dx": "Hepatic Encephalopathy (West Haven Grade 2-3) secondary to Decompensated Alcoholic Cirrhosis triggered by Acute Upper GI Bleeding and Constipation",
      "plan": "1. Maintain airway, place in semi-Fowler position, NPO.\n2. NG tube insertion on gentle suction to assess ongoing upper GI bleeding and decompress.\n3. IV Pantoprazole 80 mg bolus, then 8 mg/hr continuous infusion.\n4. IV Terlipressin 2 mg IV bolus STAT (or Somatostatin/Octreotide) to reduce splanchnic portal pressure.\n5. Lactulose 30 mL orally / via NG tube or Lactulose retention enema (300 mL in 700 mL water) to induce bowel movement and clear nitrogenous blood from gut.\n6. Urgent GI endoscopy (EGD) once hemodynamically stable.\n7. Send STAT Labs: CBC (Hb, Hct, Platelets), Coagulation (PT, INR), LFT (Total/Direct Bilirubin, Albumin), Ammonia, Electrolytes, BUN, Cr."
    }
  }
],

  hydrateForm(patient) {
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val !== undefined && val !== null ? val : '';
    };
    let setChk = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.checked = Boolean(val);
    };
    setVal('alteredMentalDurationVal', patient.durationVal || '');
    setVal('alteredMentalDurationUnit', patient.durationUnit || 'hours');
    setRadioValue('alteredMentalReporter', patient.alteredMentalReporter);
    setVal('alteredMentalReporterRelation', patient.alteredMentalReporterRelation || '');
    setVal('alteredMentalReporterPhone', patient.alteredMentalReporterPhone || '');

    setRadioValue('alteredMentalBaselineStatus', patient.alteredMentalBaselineStatus);
    if (patient.alteredMentalBaselineStatus === 'bedridden_totally_dependent') {
      toggleBranch('alteredMentalBedriddenDetailsWrap', true);
      setRadioValue('alteredMentalBedriddenCommunication', patient.alteredMentalBedriddenCommunication);
      setRadioValue('alteredMentalBedriddenMobility', patient.alteredMentalBedriddenMobility);
      setRadioValue('alteredMentalBedriddenFeeding', patient.alteredMentalBedriddenFeeding);
      setRadioValue('alteredMentalBedriddenElimination', patient.alteredMentalBedriddenElimination);
    } else {
      toggleBranch('alteredMentalBedriddenDetailsWrap', false);
    }

    setRadioValue('alteredMentalOnsetPattern', patient.alteredMentalOnsetPattern);
    setVal('alteredMentalLsnDate', formatDateDdMmYyyy(patient.alteredMentalLsnDate || ''));
    setVal('alteredMentalLsnTime', formatTime24h(patient.alteredMentalLsnTime || ''));
    const lsnUnknownEl = document.getElementById('alteredMentalLsnUnknown');
    if (lsnUnknownEl) {
      lsnUnknownEl.checked = Boolean(patient.alteredMentalLsnUnknown);
      handleAlteredMentalLsnUnknownToggle(lsnUnknownEl);
    }

    setRadioValue('alteredMentalLevelOfConsciousness', patient.alteredMentalLevelOfConsciousness);

    // Cognitive Behaviors
    const cogList = patient.alteredMentalCognitiveBehaviors || [];
    document.querySelectorAll('input[name="alteredMentalCognitiveBehaviors"]').forEach(cb => {
      cb.checked = cogList.includes(cb.value);
    });

    // Neurological Red Flags
    const neuroList = [ ...(patient.alteredMentalNeuroFlags || []) ];
    if (neuroList.includes('anisocoria_or_fixed_pupil') && !neuroList.includes('gaze_deviation_or_fixed')) {
      neuroList.push('gaze_deviation_or_fixed');
    }
    if ((neuroList.includes('head_injury_recent_24h') || neuroList.includes('remote_trauma_weeks')) && !neuroList.includes('head_trauma_history')) {
      neuroList.push('head_trauma_history');
    }
    document.querySelectorAll('input[name="alteredMentalNeuroFlags"]').forEach(cb => {
      cb.checked = neuroList.includes(cb.value);
    });
    const hasTrauma = neuroList.includes('head_trauma_history') || neuroList.includes('remote_trauma_weeks') || neuroList.includes('head_injury_recent_24h');
    const traumaWrap = document.getElementById('alteredMentalHeadTraumaWrap');
    if (hasTrauma) {
      if (traumaWrap) traumaWrap.classList.remove('hidden');
      const traumaTime = patient.alteredMentalHeadTraumaTime || patient.alteredMentalRemoteTraumaTime || (neuroList.includes('head_injury_recent_24h') ? 'within_24h' : '');
      setRadioValue('alteredMentalHeadTraumaTime', traumaTime);
      setRadioValue('alteredMentalRemoteTraumaTime', traumaTime);
    } else {
      if (traumaWrap) traumaWrap.classList.add('hidden');
    }
    if (neuroList.includes('visible_head_wound')) {
      toggleBranch('alteredMentalHeadWoundDetailsWrap', true);
      setVal('alteredMentalHeadWoundLocation', patient.alteredMentalHeadWoundLocation || '');
    } else {
      toggleBranch('alteredMentalHeadWoundDetailsWrap', false);
    }

    // Systemic Flags
    const sysList = patient.alteredMentalSystemicFlags || [];
    document.querySelectorAll('input[name="alteredMentalSystemicFlags"]').forEach(cb => {
      cb.checked = sysList.includes(cb.value);
    });

    // GI
    const abdpainCb = document.getElementById('alteredMentalGiAbdpain');
    if (abdpainCb) abdpainCb.checked = Boolean(patient.alteredMentalGiAbdpain);
    const abdpainLocs = patient.alteredMentalAbdpainLocs || [];
    document.querySelectorAll('input[name="alteredMentalAbdpainLocs"]').forEach(cb => {
      cb.checked = abdpainLocs.includes(cb.value);
    });
    setRadioValue('alteredMentalAbdpainChar', patient.alteredMentalAbdpainChar);

    const diarrheaCb = document.getElementById('alteredMentalGiDiarrhea');
    if (diarrheaCb) diarrheaCb.checked = Boolean(patient.alteredMentalGiDiarrhea);
    setVal('alteredMentalDiarrheaFreq', patient.alteredMentalDiarrheaFreq || '');
    const diarrheaStools = patient.alteredMentalDiarrheaStools || [];
    document.querySelectorAll('input[name="alteredMentalDiarrheaStools"]').forEach(cb => {
      cb.checked = diarrheaStools.includes(cb.value);
    });

    const vomitCb = document.getElementById('alteredMentalGiVomit');
    if (vomitCb) vomitCb.checked = Boolean(patient.alteredMentalGiVomit);
    setVal('alteredMentalVomitFreq', patient.alteredMentalVomitFreq || '');
    const vomitContents = patient.alteredMentalVomitContents || [];
    document.querySelectorAll('input[name="alteredMentalVomitContents"]').forEach(cb => {
      cb.checked = vomitContents.includes(cb.value);
    });
    handleAlteredMentalGiToggle();

    // Risk Precipitants
    const riskList = patient.alteredMentalRiskPrecipitants || [];
    document.querySelectorAll('input[name="alteredMentalRiskPrecipitants"]').forEach(cb => {
      cb.checked = riskList.includes(cb.value);
    });
    if (riskList.includes('suspected_overdose_toxin')) {
      toggleBranch('alteredMentalToxinDetailsWrap', true);
      setVal('alteredMentalToxinDetails', patient.alteredMentalToxinDetails || '');
    } else {
      toggleBranch('alteredMentalToxinDetailsWrap', false);
    }

    setVal('alteredMentalAdditionalNotes', patient.alteredMentalAdditionalNotes || '');
  },

  collectIntake(ctx) {
    const {
      recordId,
      queueNumber,
      randomHn,
      patientName,
      patientAge,
      gender,
      recordStatus,
      hospRecordStatus,
      underlying,
      drugAllergy,
      currentMeds,
      preservedDoctorNotes
    } = ctx;
    let { otherSymptomsFree } = ctx;
    let newPatient;
      // ------------------ ALTERED MENTAL STATUS INTAKE ------------------
      const _rawDur = parseFloat(document.getElementById('alteredMentalDurationVal')?.value); const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
      const durationUnit = document.getElementById('alteredMentalDurationUnit')?.value || 'hours';

      const alteredMentalReporter = document.querySelector('input[name="alteredMentalReporter"]:checked')?.value || 'unspecified';
      const alteredMentalReporterRelation = document.getElementById('alteredMentalReporterRelation')?.value.trim() || '';
      const alteredMentalReporterPhone = document.getElementById('alteredMentalReporterPhone')?.value.trim() || '';

      const alteredMentalBaselineStatus = document.querySelector('input[name="alteredMentalBaselineStatus"]:checked')?.value || 'unspecified';
      let alteredMentalBedriddenCommunication = null;
      let alteredMentalBedriddenMobility = null;
      let alteredMentalBedriddenFeeding = null;
      let alteredMentalBedriddenElimination = null;
      if (alteredMentalBaselineStatus === 'bedridden_totally_dependent') {
        alteredMentalBedriddenCommunication = document.querySelector('input[name="alteredMentalBedriddenCommunication"]:checked')?.value || null;
        alteredMentalBedriddenMobility = document.querySelector('input[name="alteredMentalBedriddenMobility"]:checked')?.value || null;
        alteredMentalBedriddenFeeding = document.querySelector('input[name="alteredMentalBedriddenFeeding"]:checked')?.value || null;
        alteredMentalBedriddenElimination = document.querySelector('input[name="alteredMentalBedriddenElimination"]:checked')?.value || null;
      }

      const alteredMentalOnsetPattern = document.querySelector('input[name="alteredMentalOnsetPattern"]:checked')?.value || 'unspecified';
      const alteredMentalLsnUnknown = document.getElementById('alteredMentalLsnUnknown')?.checked || false;
      const alteredMentalLsnDate = alteredMentalLsnUnknown ? '' : (document.getElementById('alteredMentalLsnDate')?.value || '');
      const alteredMentalLsnTime = alteredMentalLsnUnknown ? '' : (document.getElementById('alteredMentalLsnTime')?.value || '');

      const alteredMentalLevelOfConsciousness = document.querySelector('input[name="alteredMentalLevelOfConsciousness"]:checked')?.value || 'unspecified';

      const alteredMentalCognitiveBehaviors = Array.from(document.querySelectorAll('input[name="alteredMentalCognitiveBehaviors"]:checked')).map(cb => cb.value);

      const alteredMentalNeuroFlags = Array.from(document.querySelectorAll('input[name="alteredMentalNeuroFlags"]:checked')).map(cb => cb.value);
      const hasHeadTrauma = alteredMentalNeuroFlags.includes('head_trauma_history') || alteredMentalNeuroFlags.includes('remote_trauma_weeks') || alteredMentalNeuroFlags.includes('head_injury_recent_24h');
      const alteredMentalHeadTraumaTime = hasHeadTrauma
        ? (document.querySelector('input[name="alteredMentalHeadTraumaTime"]:checked')?.value || document.querySelector('input[name="alteredMentalRemoteTraumaTime"]:checked')?.value || null)
        : null;
      const alteredMentalRemoteTraumaTime = alteredMentalHeadTraumaTime; // backward compatibility
      const alteredMentalHeadWoundLocation = alteredMentalNeuroFlags.includes('visible_head_wound') ? (document.getElementById('alteredMentalHeadWoundLocation')?.value.trim() || '') : '';

      const alteredMentalSystemicFlags = Array.from(document.querySelectorAll('input[name="alteredMentalSystemicFlags"]:checked')).map(cb => cb.value);

      const alteredMentalGiAbdpain = document.getElementById('alteredMentalGiAbdpain')?.checked || false;
      const alteredMentalAbdpainLocs = alteredMentalGiAbdpain ? Array.from(document.querySelectorAll('input[name="alteredMentalAbdpainLocs"]:checked')).map(cb => cb.value) : [];
      const alteredMentalAbdpainChar = alteredMentalGiAbdpain ? (document.querySelector('input[name="alteredMentalAbdpainChar"]:checked')?.value || '') : '';

      const alteredMentalGiDiarrhea = document.getElementById('alteredMentalGiDiarrhea')?.checked || false;
      const alteredMentalDiarrheaFreq = alteredMentalGiDiarrhea ? (parseInt(document.getElementById('alteredMentalDiarrheaFreq')?.value, 10) || 0) : 0;
      const alteredMentalDiarrheaStools = alteredMentalGiDiarrhea ? Array.from(document.querySelectorAll('input[name="alteredMentalDiarrheaStools"]:checked')).map(cb => cb.value) : [];

      const alteredMentalGiVomit = document.getElementById('alteredMentalGiVomit')?.checked || false;
      const alteredMentalVomitFreq = alteredMentalGiVomit ? (parseInt(document.getElementById('alteredMentalVomitFreq')?.value, 10) || 0) : 0;
      const alteredMentalVomitContents = alteredMentalGiVomit ? Array.from(document.querySelectorAll('input[name="alteredMentalVomitContents"]:checked')).map(cb => cb.value) : [];

      const alteredMentalRiskPrecipitants = Array.from(document.querySelectorAll('input[name="alteredMentalRiskPrecipitants"]:checked')).map(cb => cb.value);
      const alteredMentalToxinDetails = alteredMentalRiskPrecipitants.includes('suspected_overdose_toxin') ? (document.getElementById('alteredMentalToxinDetails')?.value.trim() || '') : '';

      const alteredMentalAdditionalNotes = document.getElementById('alteredMentalAdditionalNotes')?.value.trim() || '';

      newPatient = {
        id: recordId,
        queue_number: queueNumber,
        hn: randomHn,
        name: patientName,
        age: patientAge,
        gender: gender,
        chief_complaint: 'altered_mental',
        chief_complaint_title: 'ซึมลง / สับสนเฉียบพลัน / ระดับความรู้สึกตัวเปลี่ยนแปลง',
        status: recordStatus,
        timestamp: new Date().toISOString(),
        durationVal,
        durationUnit,
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
        alteredMentalNeuroFlags,
        alteredMentalHeadTraumaTime,
        alteredMentalRemoteTraumaTime,
        alteredMentalHeadWoundLocation,
        alteredMentalSystemicFlags,
        alteredMentalGiAbdpain,
        alteredMentalAbdpainLocs,
        alteredMentalAbdpainChar,
        alteredMentalGiDiarrhea,
        alteredMentalDiarrheaFreq,
        alteredMentalDiarrheaStools,
        alteredMentalGiVomit,
        alteredMentalVomitFreq,
        alteredMentalVomitContents,
        alteredMentalRiskPrecipitants,
        alteredMentalToxinDetails,
        alteredMentalAdditionalNotes,
        otherSymptomsFree,
        hospRecordStatus,
        underlying: underlying.length > 0 ? underlying: ['ปฏิเสธ'],
        drugAllergy,
        currentMeds,
        doctor_notes: preservedDoctorNotes
      };
    return newPatient;
  },

  isRedFlag(p) {
    const neuro = p.alteredMentalNeuroFlags || p.alteredMentalNeuroSigns || [];
    const systemic = p.alteredMentalSystemicFlags || p.alteredMentalSystemicSigns || [];
    const risks = p.alteredMentalRiskPrecipitants || [];
    const diarrheaStools = p.alteredMentalDiarrheaStools || [];
    const vomitContents = p.alteredMentalVomitContents || p.altered_mental_vomit_contents || [];
    return Boolean(
      p.alteredMentalLevelOfConsciousness === 'stupor_pain_only' ||
      p.alteredMentalLevelOfConsciousness === 'coma_unresponsive' ||
      p.alteredMentalOnsetPattern === 'hyperacute_minutes' ||
      p.alteredMentalOnsetPattern === 'acute_hours' ||
      p.alteredMentalBaselineStatus === 'known_dementia_partially_dependent' ||
      p.alteredMentalBaselineStatus === 'bedridden_totally_dependent' ||
      (neuro.includes('focal_weakness_numbness') || neuro.includes('focal_weakness_face_limb')) ||
      neuro.includes('seizure_or_abnormal_movement') ||
      neuro.includes('stiff_neck_or_severe_headache') ||
      (neuro.includes('anisocoria_or_fixed_pupil') || neuro.includes('unequal_pupils_or_deviation')) ||
      neuro.includes('head_injury_recent_24h') ||
      (neuro.includes('remote_trauma_weeks') || p.alteredMentalHeadTrauma === 'remote_trauma_weeks') ||
      systemic.includes('high_fever_or_hypothermia') ||
      systemic.includes('tachypnea_labored_breathing') ||
      systemic.includes('cyanosis_cold_clammy') ||
      diarrheaStools.includes('bloody') ||
      diarrheaStools.includes('melena_tarry') ||
      ((((vomitContents.includes('coffee_ground_blood') || vomitContents.includes('bloody_coffee_ground')) || vomitContents.includes('bloody_coffee_ground')) || vomitContents.includes('bloody_coffee_ground')) || vomitContents.includes('coffee_ground') || vomitContents.includes('bloody')) ||
      vomitContents.includes('projectile') ||
      risks.includes('diabetic_insulin_meds') ||
      risks.includes('chronic_kidney_missed_dialysis') ||
      risks.includes('cirrhosis_jaundice_ascites') ||
      risks.includes('new_meds_or_sedatives') ||
      risks.includes('alcohol_heavy_or_abrupt_stop') ||
      risks.includes('suspected_overdose_toxin')
    );
  },

  evaluateRedFlags(patient) {
    const redFlags = [];
    redFlags.push(...detectAlteredMentalRedFlags(patient));
    return redFlags;
  },

  updateOutputs(patient) {
    updateAlteredMentalOutputs(patient);
  },

  generateCds(patient, ctx) {
    const { rfs, ddxList, workupList, managementList } = ctx;
    const neuro = patient.alteredMentalNeuroFlags || patient.alteredMentalNeuroSigns || [];
    const systemic = patient.alteredMentalSystemicFlags || patient.alteredMentalSystemicSigns || [];
    const risks = patient.alteredMentalRiskPrecipitants || [];
    const cogs = patient.alteredMentalCognitiveBehaviors || [];
    const diarrheaStools = patient.alteredMentalDiarrheaStools || [];
    const vomitContents = patient.alteredMentalVomitContents || patient.altered_mental_vomit_contents || [];

    const isHypoglycemiaRisk = Boolean(risks.includes('diabetic_insulin_meds'));
    const isComaAirwayRisk = Boolean(patient.alteredMentalLevelOfConsciousness === 'coma_unresponsive' || patient.alteredMentalLevelOfConsciousness === 'stupor_pain_only');
    const isStrokeOrIntracranialRisk = Boolean(
      neuro.includes('focal_weakness_numbness') ||
      neuro.includes('focal_weakness_face_limb') ||
      neuro.includes('anisocoria_or_fixed_pupil') ||
      neuro.includes('unequal_pupils_or_deviation') ||
      neuro.includes('head_injury_recent_24h') ||
      neuro.includes('remote_trauma_weeks') ||
      patient.alteredMentalHeadTrauma === 'remote_trauma_weeks' ||
      patient.alteredMentalOnsetPattern === 'hyperacute_minutes'
    );
    const isSepsisRisk = Boolean(
      systemic.includes('high_fever_or_hypothermia') ||
      systemic.includes('tachypnea_labored_breathing') ||
      systemic.includes('cyanosis_cold_clammy') ||
      systemic.includes('cough_purulent_sputum') ||
      systemic.includes('foul_cloudy_urine') ||
      systemic.includes('infected_bedsore_wound')
    );
    const isCnsInfectionRisk = Boolean(
      (neuro.includes('stiff_neck_or_severe_headache') || neuro.includes('neck_stiffness_headache')) &&
      systemic.includes('high_fever_or_hypothermia')
    );
    const isAlcoholWithdrawalRisk = Boolean(risks.includes('alcohol_heavy_or_abrupt_stop'));
    const isToxinRisk = Boolean(risks.includes('suspected_overdose_toxin') || risks.includes('new_meds_or_sedatives'));
    const isHepaticOrUremicRisk = Boolean(risks.includes('cirrhosis_jaundice_ascites') || risks.includes('chronic_kidney_missed_dialysis'));
    const isGiBleedRisk = Boolean(
      diarrheaStools.includes('bloody') ||
      diarrheaStools.includes('melena_tarry') ||
      vomitContents.includes('coffee_ground_blood') ||
      vomitContents.includes('bloody_coffee_ground') ||
      vomitContents.includes('coffee_ground') ||
      vomitContents.includes('bloody')
    );

    // 1) Ranked Differential Diagnoses (ddxList)
    if (isHypoglycemiaRisk) {
      ddxList.push('1. Severe Hypoglycemia / Neuroglycopenia (ความเสี่ยงสูงมาก: ผู้ป่วยเบาหวานใช้ยา/อินซูลิน)');
    }
    if (isSepsisRisk) {
      ddxList.push((ddxList.length + 1) + '. Sepsis-Associated Encephalopathy (SAE) / Urosepsis / Pneumonia / Severe Sepsis');
    }
    if (isStrokeOrIntracranialRisk) {
      const isCsdh = neuro.includes('remote_trauma_weeks') || patient.alteredMentalHeadTrauma === 'remote_trauma_weeks';
      ddxList.push((ddxList.length + 1) + '. ' + (isCsdh ? 'Chronic Subdural Hematoma (cSDH) — ประวัติศีรษะกระแทก/ลื่นล้มนำมาก่อน' : 'Acute Stroke / Intracranial Hemorrhage (ICH)'));
    }
    if (isHepaticOrUremicRisk) {
      const isCirrhosis = risks.includes('cirrhosis_jaundice_ascites');
      ddxList.push((ddxList.length + 1) + '. ' + (isCirrhosis ? 'Hepatic Encephalopathy (กระตุ้นโดยการติดเชื้อ / เลือดออกทางเดินอาหาร / ท้องผูก)' : 'Uremic Encephalopathy / Severe Hyperkalemia'));
    }
    if (isAlcoholWithdrawalRisk) {
      ddxList.push((ddxList.length + 1) + '. Delirium Tremens (DT) / Wernicke Encephalopathy (ประวัติดื่มสุราหนักหรือหยุดดื่ม 1-4 วัน)');
    }
    if (isToxinRisk) {
      ddxList.push((ddxList.length + 1) + '. Drug-induced Delirium / Sedative Intoxication / Acute Poisoning');
    }
    if (ddxList.length < 3) {
      ddxList.push((ddxList.length + 1) + '. Acute Delirium / Multifactorial Encephalopathy (CAM-ICU Positive)');
    }

    // 2) Recommended ER Workup (workupList)
    workupList.push('• Bedside STAT: Capillary Blood Glucose (DTX STAT) ทันที เพื่อ Rule out Severe Hypoglycemia');
    workupList.push('• Cardiac & Vitals: 12-lead EKG STAT, Continuous SpO2, Continuous Cardiac Telemetry');
    workupList.push('• Blood Chemistry: CBC with diff & platelets, Electrolytes (Na, K, Cl, HCO3), BUN, Creatinine, Calcium, Magnesium, Phosphate');
    workupList.push('• Organ & Metabolic: Liver Function Test (LFT), Venous/Arterial Blood Gas with Lactate STAT, PT/INR, PTT');
    workupList.push('• Sepsis Workup: Hemoculture 2 specimens (คนละตำแหน่งก่อนให้ ATB), Urinalysis & Urine C/S, Sputum C/S');
    workupList.push('• Imaging: Non-contrast CT Brain STAT (Rule out ICH, cSDH, Acute Stroke, Herniation), Portable Chest X-ray');
    if (isToxinRisk) {
      workupList.push('• Toxicology Screen: Urine Drug Screen, Serum Acetaminophen, Serum Salicylate, Serum Osmolality');
    }
    if (isCnsInfectionRisk) {
      workupList.push('• CSF Study: Lumbar Puncture (Cell count, Protein, Glucose, Gram stain, C/S) หลังทำ CT Brain');
    }

    // 3) Initial ER Management & Safety Precautions (managementList)
    if (isComaAirwayRisk) {
      managementList.push('• Airway Protection: ประเมิน GCS และ Airway reflexes หาก GCS <= 8 ให้เตรียม Rapid Sequence Intubation (RSI)');
    }
    if (isHypoglycemiaRisk) {
      managementList.push('• Hypoglycemia Protocol: หาก DTX < 70 mg/dL ให้ 50% Dextrose (D50W) 50 mL IV push STAT ทันที ตามด้วย 10% Dextrose IV infusion');
    }
    if (isAlcoholWithdrawalRisk) {
      managementList.push('• Thiamine STAT: ให้ Thiamine 100-500 mg IV "ก่อน" ให้ Dextrose IV เสมอ เพื่อป้องกัน Acute Wernicke Encephalopathy ทรุดลง');
    }
    if (isSepsisRisk) {
      managementList.push('• Sepsis Bundle: IV Crystalloid (NSS / Ringer\'s Lactate) 30 mL/kg ภายใน 3 ชม. + ให้ Broad-spectrum IV Antibiotics ภายใน 1 ชม.');
    }
    if (isStrokeOrIntracranialRisk) {
      managementList.push('• Neuroprotection: ยกระดับศีรษะ 30 องศา, เลี่ยงการบิดคอ, ปรึกษาประสาทศัลยแพทย์ (Neurosurgery) หากพบก้อนเลือดหรือ cSDH กดสมอง');
    }
    if (isToxinRisk) {
      managementList.push('• Antidote Protocol: เตรียม Naloxone IV titration หากสงสัย Opioid กดการหายใจ; หลีกเลี่ยง Flumazenil หากสงสัย Benzodiazepine ในผู้ติดเรื้อรัง');
    }
    managementList.push('• Delirium Precautions: จัดสิ่งแวดล้อมสงบ มีแสงสว่างเหมาะสม หลีกเลี่ยง Physical Restraints หากไม่จำเป็น หลีกเลี่ยง Benzodiazepines (ยกเว้น alcohol withdrawal)');
  }
});
