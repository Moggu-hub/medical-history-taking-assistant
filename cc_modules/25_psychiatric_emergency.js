// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 25_psychiatric_emergency.js
// อาการนำ: เอะอะโวยวาย / จิตเวช (Acute Agitation / Psychiatric Emergency)
// รองรับ Zero Default Bias, Progressive Disclosure, Universal Date/Time,
// Baseline Status Assessment, Rapid Note De-duplication และ Core Guard TDD
// =========================================================================

// --- Progressive Disclosure Helper Functions ---
function togglePsychGroup(subId, show) {
  const el = document.getElementById(subId);
  if (!el) return;
  if (show) {
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
    el.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    el.querySelectorAll('input[type="radio"]').forEach(rb => { rb.checked = false; });
    const textInput = el.querySelector('input[type="text"]');
    if (textInput) textInput.value = '';
    const numInput = el.querySelector('input[type="number"]');
    if (numInput) numInput.value = '';
  }
}

function handlePsychInformantChange(value) {
  const container = document.getElementById('psychInformantRelContainer');
  const input = document.getElementById('psychInformantRel');
  if (!container || !input) return;

  if (value === 'family_relative') {
    container.classList.remove('hidden');
    input.placeholder = 'ระบุความสัมพันธ์ เช่น บิดา, มารดา, สามี, ภรรยา, บุตร, พี่สาว, น้องชาย...';
  } else if (value === 'police_ems') {
    container.classList.remove('hidden');
    input.placeholder = 'ระบุหน่วยงาน/สังกัด หรือสถานที่พบตัว เช่น สภ.เมืองราชบุรี, กู้ภัยสว่างราชบุรี...';
  } else if (value === 'caregiver_neighbor') {
    container.classList.remove('hidden');
    input.placeholder = 'ระบุความเกี่ยวข้อง เช่น เพื่อนบ้าน, ผู้ดูแล, นายจ้าง, ผู้พบเห็นเหตุการณ์...';
  } else {
    container.classList.add('hidden');
    input.value = '';
  }
}

function handlePsychPriorBaselineChange(value) {
  togglePsychGroup('psychPriorBaselineSubContainer', value === 'known_psych_history');
}

function handlePsychBehaviorOtherChange(cb) {
  togglePsychGroup('psychBehaviorOtherDetailContainer', cb.checked);
}

function handlePsychComplianceChange(value) {
  togglePsychGroup('psychMissedDaysContainer', value === 'missed_days');
}

// --- Clinical Decision Support & Evaluation Functions ---
function evaluatePsychiatricRedFlags(patient) {
  const rfs = [];
  const vs = patient.vital_signs || {};
  const pr = vs.pr !== undefined && vs.pr !== null ? parseInt(vs.pr, 10) : null;
  const bt = vs.bt !== undefined && vs.bt !== null ? parseFloat(vs.bt) : null;

  const behaviors = Array.isArray(patient.psychBehaviors) ? patient.psychBehaviors : [];
  const harmRisks = Array.isArray(patient.psychHarmRisks) ? patient.psychHarmRisks : [];
  const hallucinations = Array.isArray(patient.psychHallucinations) ? patient.psychHallucinations : [];
  const delusions = Array.isArray(patient.psychDelusions) ? patient.psychDelusions : [];
  const substances = Array.isArray(patient.psychSubstances) ? patient.psychSubstances : [];
  const organicSigns = Array.isArray(patient.psychOrganicSigns) ? patient.psychOrganicSigns : [];
  const pastViolence = Array.isArray(patient.psychPastViolence) ? patient.psychPastViolence : [];

  // 1. Active Extreme Violence with Weapon / Imminent Danger (ESI 1 / 2)
  const hasWeapon = harmRisks.includes('weapon_possession') || behaviors.includes('weapon_possession');
  const hasPhysicalAssault = harmRisks.includes('physical_assault_others');
  const hasPhysicalViolenceWithThreat = (hasPhysicalAssault || behaviors.includes('property_destruction')) && harmRisks.includes('threat_harm_others');
  if (hasWeapon || hasPhysicalAssault || hasPhysicalViolenceWithThreat) {
    rfs.push({
      key: 'rf_psych_active_violence_weapon',
      level: 1,
      textTh: 'ภาวะก้าวร้าวรุนแรงเฉียบพลัน ทำร้ายร่างกายผู้อื่น หรือมีอาวุธในครอบครอง (Active Extreme Violence with Weapon)',
      risk: 'Severe physical injury or fatality to staff, patient, or bystanders; acute destruction of emergency department property.',
      suggestedAction: 'Immediate Code White Activation (ระงับเหตุฉุกเฉิน). Police/Security perimeter lockdown. Isolate patient in quiet seclusion room. Stat Chemical Restraint (e.g. Haloperidol 5 mg + Lorazepam 2 mg IM or Midazolam 5 mg IM) with standard 4-point physical restraints under continuous medical supervision.'
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
      risk: 'Meningitis, encephalitis, intracranial hemorrhage, severe hypoglycemia, or neuroleptic malignant syndrome (NMS) leading to coma, brain herniation, or death.',
      suggestedAction: 'Medical Clearance First! Stat Bedside DTX to rule out hypoglycemia. Stat CBC, BUN, Cr, Electrolytes, Hemoculture, Stat Non-contrast CT Brain. If febrile with meningismus, perform stat Lumbar Puncture. DO NOT refer to psychiatric hospital until organic medical clearance is secured.'
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
      risk: 'Lethal hyperthermia, rhabdomyolysis, acute renal failure, malignant ventricular arrhythmias, and disseminated intravascular coagulation (DIC).',
      suggestedAction: 'Aggressive IV fluid resuscitation (Normal Saline 1-2 L), active external cooling. Titrate IV Diazepam 5-10 mg or Lorazepam 2-4 mg every 10-15 minutes to control agitation and tachycardia. Stat Urine Tox screen, CPK, Troponin, 12-lead ECG, and monitor core body temperature.'
    });
  }

  // 4. Severe Alcohol Withdrawal / Delirium Tremens (DT) (ESI 2)
  if (substances.includes('alcohol_withdrawal')) {
    rfs.push({
      key: 'rf_psych_alcohol_delirium_tremens',
      level: 2,
      textTh: 'ภาวะถอนสุราขั้นรุนแรง หรือเพ้อคลั่งสับสน (Severe Alcohol Withdrawal / Delirium Tremens)',
      risk: 'Status epilepticus, severe autonomic instability, aspiration pneumonia, cardiovascular collapse, and high mortality (5-15% if untreated).',
      suggestedAction: 'Admission to monitored intermediate bed. Immediate symptom-triggered IV Diazepam protocol (CIWA-Ar titration, e.g. Diazepam 10 mg IV every 1-2 hrs until calm). Administer IV Thiamine 100-200 mg BEFORE any glucose. Correct potassium, magnesium, and hydration.'
    });
  }

  // 5. High-Lethality Suicidal Intent or High-Risk Elopement (ESI 2)
  if (harmRisks.includes('threat_self_harm') || harmRisks.includes('elopement_high_risk') || pastViolence.includes('past_suicide_attempt')) {
    rfs.push({
      key: 'rf_psych_high_suicidal_intent',
      level: 2,
      textTh: 'มีความเสี่ยงสูงต่อการพยายามฆ่าตัวตาย ทำร้ายตนเอง หรือกระโดดตึกหลบหนี (High-Lethality Suicidal Intent or Elopement Risk)',
      risk: 'Completed suicide, jumping from heights, severe laceration, hanging, or wandering into traffic.',
      suggestedAction: 'Immediate strict 1:1 Nursing/Security Observation. Remove all belts, shoelaces, cords, sharps, and medication from patient belongings. Secure windows and exit doors. Stat emergency psychiatric crisis consultation.'
    });
  }

  // 6. Command Auditory Hallucinations with Paranoia (ESI 3)
  if (hallucinations.includes('auditory_command') || delusions.includes('persecutory_paranoia')) {
    rfs.push({
      key: 'rf_psych_command_hallucination',
      level: 3,
      textTh: 'ได้ยินเสียงแว่วสั่งการ หรือมีความคิดหวาดระแวงปองร้ายรุนแรง (Command Auditory Hallucinations with Severe Paranoia)',
      risk: 'Unpredictable impulsive violence or self-harm driven by command auditory voices or intense persecutory delusion.',
      suggestedAction: 'Provide calm, low-stimulation environment with non-confrontational communication. Administer second-generation antipsychotic (e.g. Risperidone 1-2 mg or Olanzapine 5-10 mg po/IM) under physician order. Ensure patient is not left isolated without monitoring.'
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
      risk: 'Underlying structural brain lesion (tumor, subdural hematoma, stroke), autoimmune encephalitis, or metabolic/endocrine derangement.',
      suggestedAction: 'Full neurologic examination, Basic blood workup (CBC, LFT, BUN, Cr, Electrolytes), Thyroid Function Test (TSH/Free T4), VDRL, Anti-HIV. Schedule emergent non-contrast CT or MRI Brain.'
    });
  }

  return rfs;
}

// --- Formatters for Doctor Rapid Note (Thai-Centric) ---
function formatPsychInformant(patient) {
  const map = {
    family_relative: 'ญาติสายตรง หรือบุคคลในครอบครัว',
    police_ems: 'เจ้าหน้าที่ตำรวจ หรือ เจ้าหน้าที่กู้ภัย / EMS',
    caregiver_neighbor: 'ผู้ดูแล หรือเพื่อนบ้าน / ผู้พบเห็นเหตุการณ์',
    patient_self: 'ผู้ป่วยสามารถสื่อสารและให้ข้อมูลได้ด้วยตนเอง'
  };
  const base = map[patient.psychInformant] || 'ไม่ได้ระบุ';
  if (patient.psychInformantRel) {
    return `${base} (${patient.psychInformantRel})`;
  }
  return base;
}

function formatPsychBaselineStatus(patient) {
  if (patient.psychPriorBaseline === 'first_time_never') {
    return 'ไม่เคยมีประวัติความผิดปกติทางจิตเวชมาก่อนเลย (เดิมปกติทุกอย่าง เพิ่งมีอาการครั้งแรกในชีวิต) 🚩';
  }
  if (patient.psychPriorBaseline === 'unsure') {
    return 'ไม่ทราบหรือไม่แน่ใจประวัติเดิม';
  }
  if (patient.psychPriorBaseline === 'known_psych_history') {
    const statusMap = {
      baseline_normal_asymptomatic: 'เดิมอาการสงบดี ใช้ชีวิตประจำวันและทำงานได้เหมือนคนปกติ',
      baseline_mild_independent: 'เดิมมีอาการผิดปกติอยู่บ้าง แต่ยังดูแลช่วยเหลือตัวเองและใช้ชีวิตประจำวันได้ปกติ',
      baseline_chronic_confusion: 'เดิมมีอาการสับสน หลงลืม หรือวุ่นวายอยู่เป็นประจำ แต่ไม่เคยรุนแรงขนาดนี้',
      baseline_intermittent_agitation: 'เดิมมีพฤติกรรมก้าวร้าว หงุดหงิด หรือควบคุมอารมณ์ได้ยากเป็นระยะๆ อยู่แล้ว'
    };
    return statusMap[patient.psychBaselineStatus] || 'มีประวัติโรคจิตเวชเดิม (ไม่ระบุระดับอาการเดิม)';
  }
  return 'ไม่ได้ระบุ';
}

function formatPsychCompliance(patient) {
  const map = {
    regular: 'รับประทานยาจิตเวชสม่ำเสมอครบถ้วนตามแพทย์สั่ง',
    missed_days: patient.psychMissedDays ? `ลืมรับประทานยา หรือขาดยามา ${patient.psychMissedDays} วัน 🚩` : 'ลืมรับประทานยา หรือขาดยามาหลายวัน 🚩',
    self_adjusted: 'ปรับขนาดยาเอง หรือหยุดรับประทานยาเอง 🚩',
    no_prior_rx: 'ไม่เคยมียาจิตเวชมารับประทาน',
    unsure_self_prepared: 'ไม่แน่ใจ หรือ คนไข้จัดยาทานเอง'
  };
  return map[patient.psychCompliance] || 'ไม่ได้ระบุ';
}

// --- Rapid Note Generator (5 Standardized Sections) ---
function renderPsychiatricRapidHpi(patient) {
  const durVal = patient.durationVal;
  const durUnitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durUnit = durUnitMap[patient.durationUnit] || 'ชั่วโมง';
  const durationStr = durVal ? `${durVal} ${durUnit}` : 'ไม่ระบุ';

  const behaviors = Array.isArray(patient.psychBehaviors) ? patient.psychBehaviors : [];
  const harmRisks = Array.isArray(patient.psychHarmRisks) ? patient.psychHarmRisks : [];
  const hallucinations = Array.isArray(patient.psychHallucinations) ? patient.psychHallucinations : [];
  const delusions = Array.isArray(patient.psychDelusions) ? patient.psychDelusions : [];
  const moodSigns = Array.isArray(patient.psychMoodSigns) ? patient.psychMoodSigns : [];
  const sleepSigns = Array.isArray(patient.psychSleepSigns) ? patient.psychSleepSigns : [];
  const substances = Array.isArray(patient.psychSubstances) ? patient.psychSubstances : [];
  const organicSigns = Array.isArray(patient.psychOrganicSigns) ? patient.psychOrganicSigns : [];
  const pastViolence = Array.isArray(patient.psychPastViolence) ? patient.psychPastViolence : [];

  const behaviorMap = {
    verbal_aggression: 'ส่งเสียงดัง เอะอะโวยวาย หรือก้าวร้าวทางวาจา',
    property_destruction: 'ขว้างปา หรือทำลายข้าวของ 🚩',
    restless_pacing: 'กระสับกระส่าย เดินวนไปมา หงุดหงิดฉุนเฉียว',
    talking_alone: 'พูดคนเดียว',
    paranoia_behavior: 'หวาดระแวง',
    spaced_out_withdrawn: 'เหม่อลอย',
    other_behavior: patient.psychBehaviorOtherDetail ? `พฤติกรรมผิดปกติอื่น: ${patient.psychBehaviorOtherDetail}` : 'มีพฤติกรรมผิดปกติอื่นๆ'
  };
  const behaviorsTh = behaviors.map(b => behaviorMap[b] || b).join(', ');

  const harmRiskMap = {
    physical_assault_others: 'ทุบตี ทำร้ายร่างกายผู้อื่น 🚩',
    weapon_possession: 'มีอาวุธในครอบครอง หรือพยายามหยิบจับสิ่งของรอบตัวมาเป็นอาวุธ 🚩',
    threat_harm_others: 'มีพฤติกรรมหรือคำพูดข่มขู่ว่าจะทำร้ายผู้อื่น หรือจะเอาชีวิตผู้อื่น 🚩',
    threat_self_harm: 'มีพฤติกรรมหรือคำพูดว่าจะทำร้ายตนเอง หรือพยายามฆ่าตัวตาย 🚩',
    elopement_high_risk: 'พยายามวิ่งหนี เตลิด หรือปีนป่ายที่สูง/กระโดดออกนอกอาคาร 🚩',
    no_harm_threat: 'ปฏิเสธความคิดทำร้ายตนเองหรือผู้อื่น'
  };
  const harmRisksTh = harmRisks.map(h => harmRiskMap[h] || h).join(', ');

  const posList = [];
  const negList = [];

  // Behavior & Agitation Positives
  if (behaviors.includes('verbal_aggression')) posList.push('ส่งเสียงดัง เอะอะโวยวาย หรือก้าวร้าวทางวาจา');
  if (behaviors.includes('property_destruction')) posList.push('ขว้างปา หรือทำลายข้าวของ 🚩');
  if (behaviors.includes('restless_pacing')) posList.push('กระสับกระส่าย เดินวนไปมา หงุดหงิดฉุนเฉียว');
  if (behaviors.includes('talking_alone')) posList.push('พูดคนเดียว');
  if (behaviors.includes('paranoia_behavior')) posList.push('มีพฤติกรรมหวาดระแวง');
  if (behaviors.includes('spaced_out_withdrawn')) posList.push('เหม่อลอย แยกตัว');
  if (behaviors.includes('other_behavior') && patient.psychBehaviorOtherDetail) {
    posList.push(`พฤติกรรมผิดปกติอื่น: ${patient.psychBehaviorOtherDetail}`);
  }

  // Harm Risks Positives
  if (harmRisks.includes('physical_assault_others')) posList.push('ทุบตี ทำร้ายร่างกายผู้อื่น 🚩');
  if (harmRisks.includes('weapon_possession')) posList.push('มีอาวุธในครอบครอง หรือพยายามหยิบจับสิ่งของรอบตัวมาเป็นอาวุธ 🚩');
  if (harmRisks.includes('threat_harm_others')) posList.push('มีพฤติกรรมหรือคำพูดข่มขู่ว่าจะทำร้ายผู้อื่น หรือจะเอาชีวิตผู้อื่น 🚩');
  if (harmRisks.includes('threat_self_harm')) posList.push('มีพฤติกรรมหรือคำพูดว่าจะทำร้ายตนเอง หรือพยายามฆ่าตัวตาย 🚩');
  if (harmRisks.includes('elopement_high_risk')) posList.push('พยายามวิ่งหนี เตลิด หรือปีนป่ายที่สูง/กระโดดออกนอกอาคาร 🚩');

  // Hallucination Positives
  if (hallucinations.includes('auditory_command')) posList.push('ได้ยินเสียงแว่ว (เสียงคนพูดคุย/ด่าทอ หรือเสียงสั่งการ) 🚩');
  if (hallucinations.includes('visual_hallucination')) posList.push('มองเห็นภาพหลอน (เงาดำ คน สัตว์ หรือสิ่งไม่มีจริง)');
  if (hallucinations.includes('tactile_hallucination')) posList.push('มีความรู้สึกสัมผัสผิดปกติ (เหมือนมีแมลงไต่ตามผิวหนัง หรือกระแสไฟ)');

  // Delusion Positives
  if (delusions.includes('persecutory_paranoia')) posList.push('หวาดระแวงอย่างรุนแรงว่าจะมีคนมาทำร้าย ปองร้าย ลอบวางยา หรือสะกดรอยตาม 🚩');
  if (delusions.includes('grandiosity_delusion')) posList.push('มีความคิดหลงผิดว่าตนเองเป็นบุคคลพิเศษ มีอำนาจวิเศษ ร่ำรวย หรือมีภารกิจลับ');
  if (delusions.includes('mind_control_thought')) posList.push('มีความคิดว่ามีคนกำลังควบคุมสมอง ดักฟัง หรือส่งสัญญาณความคิดเข้ามา');

  // Mood & Sleep Positives
  if (moodSigns.includes('mania_hyperactive')) posList.push('อารมณ์ครื้นเครงผิดปกติ พูดเร็ว พูดไม่หยุด มีพลังงานล้นเหลือ ไม่ยอมอยู่นิ่ง');
  if (moodSigns.includes('irritability_aggression')) posList.push('หงุดหงิด อารมณ์ฉุนเฉียว ก้าวร้าว ระเบิดอารมณ์ง่ายผิดปกติ');
  if (moodSigns.includes('severe_depression_crying')) posList.push('ซึมเศร้า ร้องไห้ เก็บตัว ไม่ยอมทานอาหารและน้ำ ไม่อยากมีชีวิตอยู่');
  if (moodSigns.includes('flat_blunted_affect')) posList.push('อารมณ์ทื่อเฉย ไม่แสดงอารมณ์ หรืออารมณ์ไม่เข้ากับสถานการณ์');

  if (sleepSigns.includes('insomnia_decreased_need')) posList.push('นอนไม่หลับติดต่อกันหลายคืน โดยที่ไม่มีอาการง่วงและยังดูกระปรี้กระเปร่า');
  if (sleepSigns.includes('insomnia_anxiety_paranoia')) posList.push('นอนไม่หลับจากความเครียด วิตกกังวล หรือหวาดระแวงตลอดคืน');
  if (sleepSigns.includes('insomnia_fatigue_day_drowsy')) posList.push('นอนไม่หลับ ง่วงกลางวัน อ่อนเพลีย เหม่อลอย');
  if (sleepSigns.includes('sundowning_day_night_reversal')) posList.push('นอนสลับกลางวันกลางคืน หรือตื่นขึ้นมาเอะอะสับสนช่วงหัวค่ำ/กลางดึก');

  // Substance Positives
  if (substances.includes('meth_stimulants')) posList.push('มีประวัติใช้ยาบ้า, ยาไอซ์, โคเคน หรือสารกระตุ้นประสาท 🚩');
  if (substances.includes('alcohol_withdrawal')) posList.push('มีประวัติดื่มสุราหนักเป็นประจำ หรือเพิ่งหยุด/อดดื่มสุรามา 1-3 วัน (เสี่ยงถอนสุรา DT) 🚩');
  if (substances.includes('cannabis_kratom_cough')) posList.push('มีประวัติใช้กัญชา, น้ำกระท่อม, ยาแก้ไอผสม หรือสารระเหย/ดมกาว');
  if (substances.includes('sedative_overdose')) posList.push('มีประวัติรับประทานยานอนหลับ หรือยากดประสาทเกินขนาด 🚩');
  if (patient.psychSubstanceDetail) {
    posList.push(`รายละเอียดสารเสพติด/การดื่ม: ${patient.psychSubstanceDetail}`);
  }

  // Organic Signs Positives
  if (organicSigns.includes('high_fever_hyperthermia')) posList.push('มีไข้สูง ตัวร้อนจัด เหงื่อแตกพลั่ก หรือตัวสั่นรุนแรง 🚩');
  if (organicSigns.includes('head_trauma_fall')) posList.push('มีประวัติได้รับอุบัติเหตุศีรษะกระแทก หรือหกล้มก่อนมีอาการ 🚩');
  if (organicSigns.includes('seizure_tongue_bite')) posList.push('มีอาการชักเกร็ง ตาค้าง กัดลิ้น หรือปัสสาวะราดก่อนจะเริ่มเอะอะโวยวาย 🚩');
  if (organicSigns.includes('diabetes_hypoglycemia_risk')) posList.push('มีโรคประจำตัวเป็นเบาหวาน ทานอาหารได้น้อย หรือใช้ยาเบาหวาน (เสี่ยงน้ำตาลในเลือดต่ำ) 🚩');
  if (organicSigns.includes('severe_headache_stiff_neck')) posList.push('มีอาการปวดศีรษะรุนแรงเฉียบพลัน คอแข็งเกร็ง หรือแขนขาอ่อนแรง 🚩');
  if (organicSigns.includes('muscle_rigidity_lead_pipe')) posList.push('มีอาการกล้ามเนื้อเกร็งแข็งทั่วตัว หรือขากรรไกรเกร็งค้าง (เสี่ยง NMS) 🚩');

  if (pastViolence.includes('history_violence_assault')) {
    posList.push('เคยมีประวัติทำร้ายร่างกายผู้อื่น หรือมีคดีความเกี่ยวกับความรุนแรงในอดีต 🚩');
  }
  if (pastViolence.includes('past_suicide_attempt')) {
    posList.push('เคยลงมือ พยายามฆ่าตัวตายมาก่อนในอดีต 🚩');
  }

  if (patient.otherSymptomsFree) {
    posList.push(patient.otherSymptomsFree);
  }

  // Negatives evaluation
  if (!harmRisks.includes('weapon_possession') && !behaviors.includes('weapon_possession')) {
    negList.push('ไม่มีอาวุธในครอบครอง');
  }
  if (!harmRisks.includes('physical_assault_others')) {
    negList.push('ไม่มีประวัติทำร้ายร่างกายผู้อื่นในครั้งนี้');
  }
  if (!harmRisks.includes('threat_self_harm') && !harmRisks.includes('threat_harm_others')) {
    negList.push('ปฏิเสธความคิดทำร้ายตนเอง และปฏิเสธความคิดทำร้ายผู้อื่น');
  }
  if (hallucinations.length === 0) {
    negList.push('ไม่มีอาการประสาทหลอน ได้ยินเสียงแว่ว หรือมองเห็นภาพหลอน');
  }
  if (delusions.length === 0) {
    negList.push('ไม่มีความคิดหลงผิด หรือหวาดระแวงปองร้าย');
  }
  if (substances.length === 0) {
    negList.push('ปฏิเสธประวัติการใช้สารเสพติด ยาบ้า กัญชา และปฏิเสธการถอนสุรา');
  }
  if (!organicSigns.includes('high_fever_hyperthermia') && !organicSigns.includes('head_trauma_fall') && !organicSigns.includes('seizure_tongue_bite')) {
    negList.push('ปฏิเสธไข้สูง, ปฏิเสธอุบัติเหตุศีรษะ และปฏิเสธประวัติชักเกร็งนำมาก่อน');
  }
  if (!pastViolence.includes('history_violence_assault') && !pastViolence.includes('past_suicide_attempt')) {
    negList.push('ไม่มีประวัติความรุนแรงหรือพยายามฆ่าตัวตายในอดีต');
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
  const redFlags = evaluatePsychiatricRedFlags(patient);

  const defaultRapid =
`[Chief Complaint (CC)]
เอะอะโวยวาย / อาการทางจิตเวชฉุกเฉิน เริ่มมีอาการหรือกำเริบขึ้นมา ${durationStr}

[History of Present Illness (HPI)]
• ข้อมูลเหตุการณ์และผู้ให้ประวัติ: ผู้ให้ประวัติคือ ${formatPsychInformant(patient)} | เริ่มมีอาการหรือกำเริบขึ้นมา ${durationStr}
• ระดับอาการและสถานะเดิมก่อนกำเริบ: ${formatPsychBaselineStatus(patient)}
• การรับประทานยาจิตเวช: ${formatPsychCompliance(patient)}
• พฤติกรรมและความรุนแรงที่ตรวจพบในขณะนี้: ${behaviorsTh || 'ไม่ได้ระบุ'}
• ความเสี่ยงต่อการทำร้ายตนเองหรือผู้อื่น: ${harmRisksTh || 'ปฏิเสธความคิดทำร้ายตนเองหรือผู้อื่น'}

• Pertinent Positives:
${posList.length > 0 ? posList.map(p => `  - ${p}`).join('\n') : '  - ไม่มีพฤติกรรมก้าวร้าวรุนแรง'}

• Pertinent Negatives:
${negList.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• โรคประจำตัว (U/D): ${udDisplay}
• ยาประจำตัว (Current Meds): ${medsText}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${allergyDisplay}

[Emergency Risk Assessment (Red Flags)]
${redFlags.length > 0
  ? `🚩 สัญญาณเตือนฉุกเฉินที่ตรวจพบ:\n${redFlags.map(rf => `  * ${rf.textTh}`).join('\n')}`
  : '✓ ไม่พบสัญญาณเตือนความรุนแรงวิกฤตเฉียบพลันเบื้องต้น'}

[Doctor's Clinical Addendum & Exam]
• บันทึกประวัติเพิ่มเติมหรือแก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}
• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}
• แผนการรักษาและคำสั่งการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

  return defaultRapid;
}

// --- Narrative Note Generator (Doctor View - Thai-Centric) ---
function renderPsychiatricNarrative(patient) {
  const durVal = patient.durationVal;
  const durUnitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durUnit = durUnitMap[patient.durationUnit] || 'ชั่วโมง';
  const durStr = durVal ? `${durVal} ${durUnit}` : 'ไม่ระบุระยะเวลา';

  const informantStr = formatPsychInformant(patient);
  const baselineStr = formatPsychBaselineStatus(patient);
  const compStr = formatPsychCompliance(patient);

  let note = `ผู้ป่วย${patient.gender || ''} อายุ ${patient.age || 'ไม่ระบุ'} ปี มารับการตรวจที่ห้องฉุกเฉินด้วยอาการเอะอะโวยวาย / อาการทางจิตเวชฉุกเฉิน เริ่มมีอาการหรือกำเริบขึ้นมา ${durStr} ก่อนมารพ. ผู้ให้ข้อมูลคือ${informantStr} ประวัติสถานะเดิมก่อนกำเริบคือ${baselineStr} ประวัติการรับประทานยาจิตเวชคือ${compStr}`;

  const behaviors = Array.isArray(patient.psychBehaviors) ? patient.psychBehaviors : [];
  const harmRisks = Array.isArray(patient.psychHarmRisks) ? patient.psychHarmRisks : [];
  const hallucinations = Array.isArray(patient.psychHallucinations) ? patient.psychHallucinations : [];
  const delusions = Array.isArray(patient.psychDelusions) ? patient.psychDelusions : [];
  const substances = Array.isArray(patient.psychSubstances) ? patient.psychSubstances : [];
  const organicSigns = Array.isArray(patient.psychOrganicSigns) ? patient.psychOrganicSigns : [];
  const pastViolence = Array.isArray(patient.psychPastViolence) ? patient.psychPastViolence : [];

  const syms = [];
  if (harmRisks.includes('weapon_possession')) syms.push('มีอาวุธในครอบครอง');
  if (harmRisks.includes('physical_assault_others')) syms.push('ทำร้ายร่างกายผู้อื่น');
  if (behaviors.includes('property_destruction')) syms.push('ขว้างปาหรือทำลายข้าวของ');
  if (behaviors.includes('verbal_aggression')) syms.push('เอะอะโวยวายหรือก้าวร้าวทางวาจา');
  if (harmRisks.includes('threat_self_harm')) syms.push('มีพฤติกรรมขู่ทำร้ายตนเองหรือฆ่าตัวตาย');
  if (harmRisks.includes('elopement_high_risk')) syms.push('เสี่ยงต่อการหลบหนีหรือกระโดดที่สูง');
  if (hallucinations.includes('auditory_command')) syms.push('ได้ยินเสียงแว่วสั่งการ');
  if (delusions.includes('persecutory_paranoia')) syms.push('หวาดระแวงปองร้าย');
  if (substances.includes('meth_stimulants')) syms.push('มีประวัติใช้ยาบ้า/สารกระตุ้น');
  if (substances.includes('alcohol_withdrawal')) syms.push('เพิ่งหยุดดื่มสุรา (เสี่ยงถอนสุรา DT)');
  if (organicSigns.includes('high_fever_hyperthermia')) syms.push('มีไข้สูงตัวร้อนจัด');
  if (pastViolence.includes('past_suicide_attempt')) syms.push('เคยพยายามฆ่าตัวตายในอดีต');

  if (syms.length > 0) {
    note += ` ร่วมกับมีอาการสำคัญ: ${syms.join(', ')}`;
  } else {
    note += ' ผู้ป่วยไม่มีอาวุธ ปฏิเสธความคิดทำร้ายตนเองหรือผู้อื่น และไม่มีอาการชักหรือไข้สูงนำมาก่อน';
  }

  if (patient.psychSubstanceDetail) {
    note += ` (รายละเอียดสารเสพติด/แอลกอฮอล์: ${patient.psychSubstanceDetail})`;
  }

  return note;
}

function renderPsychiatricDoctorHpi(patient) {
  return renderPsychiatricRapidHpi(patient);
}

// --- Output Dispatcher ---
function updatePsychiatricOutputs(rec) {
  if (!rec) return;
  const rapidText = renderPsychiatricRapidHpi(rec);
  const narrativeText = renderPsychiatricNarrative(rec);

  const rapidEl = document.getElementById('rapidTextView');
  const narrativeEl = document.getElementById('narrativeTextView');
  if (rapidEl) rapidEl.value = rec.custom_rapid_note || rapidText;
  if (narrativeEl) narrativeEl.value = rec.custom_narrative_note || narrativeText;

  const posMatch = rapidText.match(/• Pertinent Positives:\n((?:\s*-[^\n]+\n?)+)/);
  if (posMatch) {
    rec.pertinentPositives = posMatch[1].trim().split('\n').map(l => l.replace(/^[-*\s]+/, '').trim());
  } else {
    rec.pertinentPositives = ['ไม่มีพฤติกรรมก้าวร้าวรุนแรง'];
  }

  const negMatch = rapidText.match(/• Pertinent Negatives:\n((?:\s*-[^\n]+\n?)+)/);
  if (negMatch) {
    rec.pertinentNegatives = negMatch[1].trim().split('\n').map(l => l.replace(/^[-*\s]+/, '').trim());
  } else {
    rec.pertinentNegatives = [];
  }

  const redFlags = evaluatePsychiatricRedFlags(rec);
  rec.redFlags = redFlags;

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
      behaviors: Array.isArray(rec.psychBehaviors) ? rec.psychBehaviors : [],
      behavior_other_detail: rec.psychBehaviorOtherDetail || '',
      harm_risks: Array.isArray(rec.psychHarmRisks) ? rec.psychHarmRisks : [],
      hallucinations: Array.isArray(rec.psychHallucinations) ? rec.psychHallucinations : [],
      delusions: Array.isArray(rec.psychDelusions) ? rec.psychDelusions : [],
      mood_signs: Array.isArray(rec.psychMoodSigns) ? rec.psychMoodSigns : [],
      sleep_signs: Array.isArray(rec.psychSleepSigns) ? rec.psychSleepSigns : [],
      substances: Array.isArray(rec.psychSubstances) ? rec.psychSubstances : [],
      substance_detail: rec.psychSubstanceDetail || '',
      organic_signs: Array.isArray(rec.psychOrganicSigns) ? rec.psychOrganicSigns : [],
      compliance: rec.psychCompliance || null,
      missed_days: rec.psychMissedDays || null,
      past_violence: Array.isArray(rec.psychPastViolence) ? rec.psychPastViolence : [],
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
function generatePsychiatricCds(patient, { rfs, ddxList = [], workupList = [], managementList = [] } = {}) {
  if (!patient) return '';
  const redFlags = rfs || evaluatePsychiatricRedFlags(patient);

  const hasWeaponViolence = redFlags.some(r => r.key === 'rf_psych_active_violence_weapon');
  const hasOrganic = redFlags.some(r => r.key === 'rf_psych_organic_delirium_cns');
  const hasMeth = redFlags.some(r => r.key === 'rf_psych_sympathomimetic_hyperthermia');
  const hasAlcohol = redFlags.some(r => r.key === 'rf_psych_alcohol_delirium_tremens');
  const hasSuicide = redFlags.some(r => r.key === 'rf_psych_high_suicidal_intent');

  if (hasWeaponViolence) {
    ddxList.push('1. 🚨 Acute Behavioral Emergency with Extreme Violence / Weapon Threat');
    ddxList.push('2. Substance-Induced Psychosis (Methamphetamine / Sympathomimetic)');
    ddxList.push('3. Acute Exacerbation of Schizophrenia / Bipolar Mania');
    workupList.push('Emergency Code White activation and security team perimeter control');
    workupList.push('Post-restraint vital signs monitoring (every 15 mins), pulse oximetry, blood glucose');
    workupList.push('Urine Drug Screen, CPK (rhabdomyolysis screen), Electrolytes, BUN, Cr');
    workupList.push('Stat Psychiatric Crisis Consultation after patient is secured and medically cleared');
    managementList.push('Triage Level 1 / 2: เข้าห้องสงบ (Quiet Seclusion Room) ทันที');
    managementList.push('ระงับเหตุฉุกเฉินด้วยทีม รปภ./ตำรวจ และใช้อุปกรณ์ผูกยึด 4 จุดตามมาตรฐานความปลอดภัย');
    managementList.push('Rapid Chemical Restraint: Haloperidol 5 mg + Lorazepam 2 mg IM หรือ Midazolam 5 mg IM');
    managementList.push('เฝ้าระวังทางเดินหายใจและหลีกเลี่ยงการกดทับทรวงอก (Positional Asphyxia Prevention)');
  } else if (hasOrganic) {
    ddxList.push('1. 🚨 Organic Delirium secondary to Medical Illness / Sepsis');
    ddxList.push('2. Central Nervous System Infection (Meningitis / Encephalitis)');
    ddxList.push('3. Intracranial Pathology (Subdural Hematoma / Acute Stroke / Post-ictal State)');
    workupList.push('Stat Bedside DTX (ตรวจระดับน้ำตาลในเลือดทันที)');
    workupList.push('Stat Non-contrast CT Brain, Stat 12-lead ECG, Chest X-ray');
    workupList.push('CBC, BUN, Cr, Electrolytes, LFT, Urinalysis, Hemoculture x 2');
    workupList.push('พิจารณา Lumbar Puncture หากมีไข้และคอแข็งเกร็ง (หลัง CT Brain)');
    managementList.push('Triage Level 2: รักษาทางกายอย่างเร่งด่วน ห้ามส่งต่อ รพ.จิตเวช ก่อน Medical Clearance');
    managementList.push('หากน้ำตาลต่ำ: ให้ 50% Glucose 50 ml IV push ทันที');
    managementList.push('หากสงสัย CNS Infection: เริ่ม Empiric IV Antibiotics/Acyclovir ทันทีหลังเจาะเลือด');
    managementList.push('หลีกเลี่ยงการให้ยาระงับประสาทขนาดสูงที่บดบังระดับความรู้สึกตัว (GCS)');
  } else if (hasMeth) {
    ddxList.push('1. 🚨 Sympathomimetic Toxicity (Methamphetamine / Ice Intoxication)');
    ddxList.push('2. Methamphetamine-Induced Psychotic Disorder with Agitation');
    ddxList.push('3. Heat Stroke / Hyperthermic Crisis');
    workupList.push('Continuous Bedside Cardiac Monitoring, Vital Signs, SpO2');
    workupList.push('Stat Urine Drug Screen, CPK, Electrolytes, BUN, Cr, Urine myoglobin');
    workupList.push('12-lead ECG (Look for ischemia, tachycardia, QTc prolongation)');
    managementList.push('Triage Level 2: ให้สารน้ำ IV Normal Saline ปริมาณมากเพื่อป้องกัน Acute Tubular Necrosis');
    managementList.push('Active external cooling เช็ดตัวลดไข้ทันทีหากอุณหภูมิร่างกายสูง');
    managementList.push('IV Benzodiazepine (Diazepam 5-10 mg IV ทุก 10-15 นาที) เพื่อคุมอาการพลุ่งพล่านและลด sympathetic drive');
    managementList.push('หลีกเลี่ยงการใช้ Haloperidol เดี่ยวๆ ขนาดสูงในภาวะ Hyperthermia เพราะเสี่ยงต่อการชักและขัดขวางการระบายความร้อน');
  } else if (hasAlcohol) {
    ddxList.push('1. 🚨 Delirium Tremens (DT) / Severe Alcohol Withdrawal');
    ddxList.push('2. Alcohol Withdrawal Seizures / Wernicke Encephalopathy');
    ddxList.push('3. Sepsis / Subdural Hematoma in Chronic Alcoholism');
    workupList.push('CIWA-Ar Clinical Assessment Score monitoring');
    workupList.push('CBC, BUN, Cr, Electrolytes (K, Mg, Phosphate), LFT, Coagulogram, DTX');
    workupList.push('Stat Non-contrast CT Brain หากมีประวัติหกล้มศีรษะกระแทก');
    managementList.push('Triage Level 2: ย้ายเข้าห้องสังเกตอาการใกล้ชิด');
    managementList.push('ให้ IV Thiamine 100-200 mg IV push ก่อนให้ Glucose เสมอ');
    managementList.push('Symptom-triggered IV Diazepam protocol (Diazepam 10-20 mg IV) จนกระทั่งผู้ป่วยสงบลง');
    managementList.push('ชดเชยเกลือแร่ Magnesium และ Potassium ทางหลอดเลือดดำ');
  } else if (hasSuicide) {
    ddxList.push('1. 🚨 Acute Suicidal Crisis / Major Depressive Disorder with High Lethality Plan');
    ddxList.push('2. Bipolar Disorder, Depressed / Mixed Episode with Suicidal Intent');
    ddxList.push('3. Borderline Personality Disorder with Acute Crisis');
    workupList.push('Suicide Risk Assessment, Screening for sharp objects, drugs, and toxic ingestion');
    workupList.push('CBC, Electrolytes, Toxicology screen, Acetaminophen level if overdose suspected');
    workupList.push('Stat Psychiatric Consultation for Emergent Inpatient Admission');
    managementList.push('Triage Level 2: จัดเจ้าหน้าที่หรือพยาบาลเฝ้าระวังแบบตัวต่อตัว (1:1 Observation) ห้ามคลาดสายตา');
    managementList.push('จัดให้อยู่ในสิ่งแวดล้อมที่ปลอดภัย ปราศจากของมีคม เชือก กระจก หรือทางออกที่ปีนป่ายได้');
    managementList.push('สื่อสารด้วยท่าทางรับฟัง เข้าใจ ไม่ตัดสิน และประสานญาติร่วมดูแลใกล้ชิด');
  } else {
    ddxList.push('1. Acute Exacerbation of Schizophrenia / Psychotic Disorder');
    ddxList.push('2. Bipolar I Disorder, Current Episode Manic with Psychotic Features');
    ddxList.push('3. Acute Agitation secondary to Medication Non-compliance');
    workupList.push('Vital Signs, Blood Glucose, Urine Toxicology Screen');
    workupList.push('Basic Labs: CBC, BUN, Cr, Electrolytes');
    workupList.push('Review prior psychiatric records and antipsychotic medication history');
    managementList.push('Triage Level 3: จัดให้อยู่ในพื้นที่ที่เงียบสงบ ลดสิ่งกระตุ้น');
    managementList.push('สื่อสารด้วยท่าทางเป็นมิตร ให้ความมั่นใจในความปลอดภัย ไม่โต้เถียงความคิดหลงผิด');
    managementList.push('กลับมารับประทานยาจิตเวชเดิม หรือปรับเพิ่มขนาดยาตามคำสั่งจิตแพทย์');
  }

  return ddxList.join('\n');
}

// --- Patient Form HTML Template ---
const PSYCHIATRIC_FORM_HTML = `
<div id="cc-psychiatric-emergency-section" class="hidden space-y-6">
  <!-- CARD 1: ข้อมูลเหตุการณ์ ผู้ให้ประวัติ สถานะเดิม และระดับความรุนแรง -->
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
        <i data-lucide="alert-octagon" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900">1. ข้อมูลเหตุการณ์ ผู้ให้ประวัติ สถานะเดิม และระดับความรุนแรง</h2>
        <p class="text-xs text-slate-500">ข้อมูลผู้ให้ประวัติ ระยะเวลา สถานะเดิมก่อนกำเริบ และพฤติกรรมในขณะนี้</p>
      </div>
    </div>

    <!-- 1.1 ผู้ให้ข้อมูลอาการในวันนี้ -->
    <div class="mb-5">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        1.1 ผู้ให้ข้อมูลอาการในวันนี้ <span class="text-rose-500">*</span>
      </label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="psychInformant" value="family_relative" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4"
            onchange="handlePsychInformantChange(this.value)">
          <span class="text-xs sm:text-sm text-slate-800">ญาติสายตรง หรือบุคคลในครอบครัว</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="psychInformant" value="police_ems" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4"
            onchange="handlePsychInformantChange(this.value)">
          <span class="text-xs sm:text-sm text-slate-800">เจ้าหน้าที่ตำรวจ หรือ เจ้าหน้าที่กู้ภัย / EMS</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="psychInformant" value="caregiver_neighbor" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4"
            onchange="handlePsychInformantChange(this.value)">
          <span class="text-xs sm:text-sm text-slate-800">ผู้ดูแล หรือเพื่อนบ้าน / ผู้พบเห็นเหตุการณ์</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="psychInformant" value="patient_self" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4"
            onchange="handlePsychInformantChange(this.value)">
          <span class="text-xs sm:text-sm text-slate-800">ผู้ป่วยสามารถสื่อสารและให้ข้อมูลได้ด้วยตนเอง</span>
        </label>
      </div>

      <!-- Progressive disclosure for informant detail -->
      <div id="psychInformantRelContainer" class="hidden mt-3 pl-4 border-l-2 border-medical-200">
        <label class="block text-xs font-medium text-slate-600 mb-1">
          ระบุรายละเอียดผู้ให้ข้อมูล:
        </label>
        <input type="text" id="psychInformantRel" placeholder="ระบุความสัมพันธ์ เช่น บิดา, มารดา, บุตร..."
          class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white transition">
      </div>
    </div>

    <!-- 1.2 ระยะเวลาที่เริ่มมีอาการ หรืออาการกำเริบขึ้นกว่าเดิม -->
    <div class="mb-5">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        1.2 เริ่มมีอาการ หรืออาการกำเริบขึ้นกว่าเดิมมานานเท่าใด <span class="text-rose-500">*</span>
      </label>
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

    <!-- 1.3 ระดับอาการเดิมและการใช้ชีวิตก่อนมีอาการกำเริบในครั้งนี้ -->
    <div class="mb-5">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        1.3 เคยมีอาการทางจิตเวชอยู่เดิมหรือไม่ และระดับอาการเดิมก่อนกำเริบ:
      </label>
      <div class="grid grid-cols-1 gap-2.5 mb-3">
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="psychPriorBaseline" value="known_psych_history" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4"
            onchange="handlePsychPriorBaselineChange(this.value)">
          <span class="text-xs sm:text-sm font-medium text-slate-800">มีประวัติโรคจิตเวช หรือเคยมีอาการผิดปกติทางจิตนำมาก่อน</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="psychPriorBaseline" value="first_time_never" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4"
            onchange="handlePsychPriorBaselineChange(this.value)">
          <span class="text-xs sm:text-sm font-medium text-slate-800">ไม่เคยมีประวัติความผิดปกติทางจิตเวชมาก่อนเลย (เดิมปกติทุกอย่าง เพิ่งมีอาการครั้งแรกในชีวิต)</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="psychPriorBaseline" value="unsure" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4"
            onchange="handlePsychPriorBaselineChange(this.value)">
          <span class="text-xs sm:text-sm font-medium text-slate-800">ไม่ทราบหรือไม่แน่ใจประวัติเดิม</span>
        </label>
      </div>

      <!-- Progressive disclosure for prior baseline details (Baseline Status Only) -->
      <div id="psychPriorBaselineSubContainer" class="hidden pl-4 sm:pl-6 space-y-3 border-l-2 border-medical-200 pt-2 pb-2">
        <p class="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">ระดับอาการและการใช้ชีวิตเดิมของผู้ป่วยก่อนกำเริบ (Baseline Status):</p>
        <div class="space-y-2">
          <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
            <input type="radio" name="psychBaselineStatus" value="baseline_normal_asymptomatic" class="text-medical-600 focus:ring-medical-500 mr-2.5 mt-0.5 h-4 w-4 flex-shrink-0">
            <span class="text-xs sm:text-sm text-slate-800">เดิมอาการสงบดี ใช้ชีวิตประจำวันและทำงานได้เหมือนคนปกติ</span>
          </label>
          <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
            <input type="radio" name="psychBaselineStatus" value="baseline_mild_independent" class="text-medical-600 focus:ring-medical-500 mr-2.5 mt-0.5 h-4 w-4 flex-shrink-0">
            <span class="text-xs sm:text-sm text-slate-800">เดิมมีอาการผิดปกติอยู่บ้าง แต่ยังดูแลช่วยเหลือตัวเองและใช้ชีวิตประจำวันได้ปกติ (เช่น มีเก็บตัว พูดคนเดียวบ้าง แต่ยังทานข้าว อาบน้ำ สื่อสารรู้เรื่อง)</span>
          </label>
          <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
            <input type="radio" name="psychBaselineStatus" value="baseline_chronic_confusion" class="text-medical-600 focus:ring-medical-500 mr-2.5 mt-0.5 h-4 w-4 flex-shrink-0">
            <span class="text-xs sm:text-sm text-slate-800">เดิมมีอาการสับสน หลงลืม หรือวุ่นวายอยู่เป็นประจำ แต่ไม่เคยรุนแรงขนาดนี้ (เช่น ผู้สูงอายุสมองเสื่อม หรือผู้ป่วยจิตเวชเรื้อรังที่ญาติต้องช่วยดูแล)</span>
          </label>
          <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
            <input type="radio" name="psychBaselineStatus" value="baseline_intermittent_agitation" class="text-medical-600 focus:ring-medical-500 mr-2.5 mt-0.5 h-4 w-4 flex-shrink-0">
            <span class="text-xs sm:text-sm text-slate-800">เดิมมีพฤติกรรมก้าวร้าว หงุดหงิด หรือควบคุมอารมณ์ได้ยากเป็นระยะๆ อยู่แล้ว</span>
          </label>
        </div>
      </div>
    </div>

    <!-- 1.4 พฤติกรรมและความรุนแรงที่ตรวจพบในขณะนี้ -->
    <div class="mb-5">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        1.4 พฤติกรรมและความรุนแรงที่ตรวจพบในขณะนี้ (เลือกได้หลายข้อ):
      </label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="psychBehaviors" value="verbal_aggression" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">ส่งเสียงดัง เอะอะโวยวาย หรือก้าวร้าวทางวาจา</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="psychBehaviors" value="property_destruction" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">ขว้างปา หรือทำลายข้าวของ</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="psychBehaviors" value="restless_pacing" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">กระสับกระส่าย เดินวนไปมา หงุดหงิดฉุนเฉียว</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="psychBehaviors" value="talking_alone" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">พูดคนเดียว</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="psychBehaviors" value="paranoia_behavior" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">หวาดระแวง</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="psychBehaviors" value="spaced_out_withdrawn" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">เหม่อลอย</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer sm:col-span-2">
          <input type="checkbox" name="psychBehaviors" value="other_behavior" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0"
            onchange="handlePsychBehaviorOtherChange(this)">
          <span class="text-xs sm:text-sm text-slate-800">มีพฤติกรรมผิดปกติอื่นๆ</span>
        </label>
      </div>

      <!-- Progressive disclosure for other behaviors -->
      <div id="psychBehaviorOtherDetailContainer" class="hidden mt-3 pl-4 border-l-2 border-medical-200">
        <label class="block text-xs font-medium text-slate-600 mb-1">
          ระบุพฤติกรรมผิดปกติเพิ่มเติม:
        </label>
        <input type="text" id="psychBehaviorOtherDetail" placeholder="ระบุ เช่น ร้องไห้ไม่หยุด, ถอดเสื้อผ้า, หัวเราะคนเดียว ฯลฯ"
          class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white transition">
      </div>
    </div>

    <!-- 1.5 ความเสี่ยงต่อการทำร้ายตนเองหรือผู้อื่น -->
    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        1.5 ความเสี่ยงต่อการทำร้ายตนเองหรือผู้อื่น (เลือกได้หลายข้อหากตรวจพบ):
      </label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="psychHarmRisks" value="physical_assault_others" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">ทุบตี ทำร้ายร่างกายผู้อื่น</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="psychHarmRisks" value="weapon_possession" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">มีอาวุธในครอบครอง หรือพยายามหยิบจับสิ่งของรอบตัวมาเป็นอาวุธ</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="psychHarmRisks" value="threat_harm_others" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">มีพฤติกรรมหรือคำพูดข่มขู่ว่าจะทำร้ายผู้อื่น หรือจะเอาชีวิตผู้อื่น</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="psychHarmRisks" value="threat_self_harm" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">มีพฤติกรรมหรือคำพูดว่าจะทำร้ายตนเอง หรือพยายามฆ่าตัวตาย</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="psychHarmRisks" value="elopement_high_risk" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">พยายามวิ่งหนี เตลิด หรือปีนป่ายที่สูง/กระโดดออกนอกอาคาร</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="psychHarmRisks" value="no_harm_threat" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">ปฏิเสธความคิดทำร้ายตนเองหรือผู้อื่น</span>
        </label>
      </div>
    </div>
  </div>

  <!-- CARD 2: อาการทางจิต ประสาทหลอน ความคิดหลงผิด และอารมณ์/การนอน -->
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
        <i data-lucide="brain" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900">2. อาการทางจิต ประสาทหลอน ความคิดหลงผิด และอารมณ์</h2>
        <p class="text-xs text-slate-500">ติ๊กเลือกหัวข้อหลักหากพบอาการผิดปกติ แล้วจึงเลือกรายละเอียดอาการย่อย</p>
      </div>
    </div>

    <div class="space-y-5">
      <!-- 2.1 ประสาทหลอน (Progressive Parent Checkbox) -->
      <div class="space-y-3">
        <label class="selectable-card flex items-center p-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 hover:border-medical-400 transition cursor-pointer">
          <input type="checkbox" id="psychParentHallucination" onchange="togglePsychGroup('psychHallucinationSubGroup', this.checked)"
            class="text-medical-600 focus:ring-medical-500 h-5 w-5 rounded flex-shrink-0">
          <div class="ml-3">
            <span class="text-sm font-bold text-slate-900">2.1 มีอาการประสาทหลอน หรือการรับรู้ผิดปกติ</span>
            <p class="text-xs text-slate-500">ติ๊กเลือกหากได้ยินเสียงแว่ว มองเห็นภาพหลอน หรือรู้สึกมีสิ่งผิดปกติไต่ตามตัว</p>
          </div>
        </label>
        <div id="psychHallucinationSubGroup" class="hidden pl-4 sm:pl-6 space-y-2 border-l-2 border-medical-200">
          <p class="text-xs text-slate-600 font-medium mb-1">เลือกอาการประสาทหลอนที่ตรวจพบ (เลือกได้หลายข้อ):</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
              <input type="checkbox" name="psychHallucinations" value="auditory_command" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
              <span class="text-xs sm:text-sm text-slate-800">ได้ยินเสียงแว่ว (เช่น เสียงคนพูดคุย เสียงด่า หรือเสียงสั่งให้ทำสิ่งต่างๆ)</span>
            </label>
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
              <input type="checkbox" name="psychHallucinations" value="visual_hallucination" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
              <span class="text-xs sm:text-sm text-slate-800">มองเห็นภาพหลอน (เช่น มองเห็นเงาดำ คน สัตว์ หรือสิ่งไม่มีจริง)</span>
            </label>
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer sm:col-span-2">
              <input type="checkbox" name="psychHallucinations" value="tactile_hallucination" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
              <span class="text-xs sm:text-sm text-slate-800">มีความรู้สึกสัมผัสผิดปกติ (เช่น รู้สึกเหมือนมีแมลงไต่ตามผิวหนัง หรือมีกระแสไฟ)</span>
            </label>
          </div>
        </div>
      </div>

      <!-- 2.2 ความคิดหลงผิดและความหวาดระแวง (Progressive Parent Checkbox) -->
      <div class="space-y-3">
        <label class="selectable-card flex items-center p-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 hover:border-medical-400 transition cursor-pointer">
          <input type="checkbox" id="psychParentDelusion" onchange="togglePsychGroup('psychDelusionSubGroup', this.checked)"
            class="text-medical-600 focus:ring-medical-500 h-5 w-5 rounded flex-shrink-0">
          <div class="ml-3">
            <span class="text-sm font-bold text-slate-900">2.2 มีความคิดหลงผิดและความหวาดระแวง</span>
            <p class="text-xs text-slate-500">ติ๊กเลือกหากมีความหวาดระแวงปองร้าย หลงผิดว่ามีอำนาจวิเศษ หรือถูกควบคุมความคิด</p>
          </div>
        </label>
        <div id="psychDelusionSubGroup" class="hidden pl-4 sm:pl-6 space-y-2 border-l-2 border-medical-200">
          <p class="text-xs text-slate-600 font-medium mb-1">เลือกความคิดหลงผิดที่ตรวจพบ (เลือกได้หลายข้อ):</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
              <input type="checkbox" name="psychDelusions" value="persecutory_paranoia" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
              <span class="text-xs sm:text-sm text-slate-800">หวาดระแวงอย่างรุนแรงว่าจะมีคนมาทำร้าย ปองร้าย ลอบวางยา หรือสะกดรอยตาม</span>
            </label>
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
              <input type="checkbox" name="psychDelusions" value="grandiosity_delusion" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
              <span class="text-xs sm:text-sm text-slate-800">มีความคิดหลงผิดว่าตนเองเป็นบุคคลพิเศษ มีอำนาจวิเศษ ร่ำรวย หรือมีภารกิจลับ</span>
            </label>
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer sm:col-span-2">
              <input type="checkbox" name="psychDelusions" value="mind_control_thought" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
              <span class="text-xs sm:text-sm text-slate-800">มีความคิดว่ามีคนกำลังควบคุมสมอง ดักฟัง หรือส่งสัญญาณความคิดเข้ามา</span>
            </label>
          </div>
        </div>
      </div>

      <!-- 2.3 ปัญหาทางอารมณ์ (Progressive Parent Checkbox) -->
      <div class="space-y-3">
        <label class="selectable-card flex items-center p-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 hover:border-medical-400 transition cursor-pointer">
          <input type="checkbox" id="psychParentMood" onchange="togglePsychGroup('psychMoodSubGroup', this.checked)"
            class="text-medical-600 focus:ring-medical-500 h-5 w-5 rounded flex-shrink-0">
          <div class="ml-3">
            <span class="text-sm font-bold text-slate-900">2.3 มีปัญหาทางอารมณ์</span>
            <p class="text-xs text-slate-500">ติ๊กเลือกหากมีอารมณ์ครื้นเครงผิดปกติ ฉุนเฉียวก้าวร้าว หรือซึมเศร้าเก็บตัว</p>
          </div>
        </label>
        <div id="psychMoodSubGroup" class="hidden pl-4 sm:pl-6 space-y-2 border-l-2 border-medical-200">
          <p class="text-xs text-slate-600 font-medium mb-1">เลือกอาการทางอารมณ์ที่ตรวจพบ (เลือกได้หลายข้อ):</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
              <input type="checkbox" name="psychMoodSigns" value="mania_hyperactive" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
              <span class="text-xs sm:text-sm text-slate-800">อารมณ์ครื้นเครงผิดปกติ พูดเร็ว พูดไม่หยุด มีพลังงานล้นเหลือ ไม่ยอมอยู่นิ่ง</span>
            </label>
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
              <input type="checkbox" name="psychMoodSigns" value="irritability_aggression" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
              <span class="text-xs sm:text-sm text-slate-800">หงุดหงิด อารมณ์ฉุนเฉียว ก้าวร้าว ระเบิดอารมณ์ง่ายผิดปกติ</span>
            </label>
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
              <input type="checkbox" name="psychMoodSigns" value="severe_depression_crying" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
              <span class="text-xs sm:text-sm text-slate-800">ซึมเศร้า ร้องไห้ เก็บตัว ไม่ยอมทานอาหารและน้ำ ไม่อยากมีชีวิตอยู่</span>
            </label>
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
              <input type="checkbox" name="psychMoodSigns" value="flat_blunted_affect" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
              <span class="text-xs sm:text-sm text-slate-800">อารมณ์ทื่อเฉย ไม่แสดงอารมณ์ หรืออารมณ์ไม่เข้ากับสถานการณ์</span>
            </label>
          </div>
        </div>
      </div>

      <!-- 2.4 ปัญหาในการนอนหลับ (Progressive Parent Checkbox) -->
      <div class="space-y-3">
        <label class="selectable-card flex items-center p-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 hover:border-medical-400 transition cursor-pointer">
          <input type="checkbox" id="psychParentSleep" onchange="togglePsychGroup('psychSleepSubGroup', this.checked)"
            class="text-medical-600 focus:ring-medical-500 h-5 w-5 rounded flex-shrink-0">
          <div class="ml-3">
            <span class="text-sm font-bold text-slate-900">2.4 มีปัญหาในการนอนหลับ</span>
            <p class="text-xs text-slate-500">ติ๊กเลือกหากนอนไม่หลับหลายคืน นอนสลับกลางวันกลางคืน หรือตื่นมาสับสนช่วงกลางดึก</p>
          </div>
        </label>
        <div id="psychSleepSubGroup" class="hidden pl-4 sm:pl-6 space-y-2 border-l-2 border-medical-200">
          <p class="text-xs text-slate-600 font-medium mb-1">เลือกอาการผิดปกติในการนอน (เลือกได้หลายข้อ):</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
              <input type="checkbox" name="psychSleepSigns" value="insomnia_decreased_need" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
              <span class="text-xs sm:text-sm text-slate-800">นอนไม่หลับติดต่อกันหลายคืน โดยที่ไม่มีอาการง่วงและยังดูกระปรี้กระเปร่า</span>
            </label>
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
              <input type="checkbox" name="psychSleepSigns" value="insomnia_anxiety_paranoia" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
              <span class="text-xs sm:text-sm text-slate-800">นอนไม่หลับจากความเครียด วิตกกังวล หรือหวาดระแวงตลอดคืน</span>
            </label>
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
              <input type="checkbox" name="psychSleepSigns" value="insomnia_fatigue_day_drowsy" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
              <span class="text-xs sm:text-sm text-slate-800">นอนไม่หลับ ง่วงกลางวัน อ่อนเพลีย เหม่อลอย</span>
            </label>
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
              <input type="checkbox" name="psychSleepSigns" value="sundowning_day_night_reversal" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
              <span class="text-xs sm:text-sm text-slate-800">นอนสลับกลางวันกลางคืน หรือตื่นขึ้นมาเอะอะสับสนช่วงหัวค่ำ/กลางดึก</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- CARD 3: การคัดกรองภาวะทางกาย อุบัติเหตุ และสารเสพติด -->
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
        <i data-lucide="shield-alert" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900">3. การคัดกรองภาวะทางกาย อุบัติเหตุ และสารเสพติด</h2>
        <p class="text-xs text-slate-500">คัดกรองสาเหตุทางกาย สารเสพติด และภาวะถอนสุราก่อนส่งตรวจจิตเวช</p>
      </div>
    </div>

    <!-- 3.1 ประวัติการใช้สารเสพติด หรือดื่มเครื่องดื่มแอลกอฮอล์ -->
    <div class="mb-5 space-y-3">
      <label class="selectable-card flex items-center p-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 hover:border-medical-400 transition cursor-pointer">
        <input type="checkbox" id="psychParentSubstance" onchange="togglePsychGroup('psychSubstanceSubGroup', this.checked)"
          class="text-medical-600 focus:ring-medical-500 h-5 w-5 rounded flex-shrink-0">
        <div class="ml-3">
          <span class="text-sm font-bold text-slate-900">3.1 มีประวัติเสพสารเสพติด สารกระตุ้น หรือดื่มเครื่องดื่มแอลกอฮอล์</span>
          <p class="text-xs text-slate-500">ติ๊กเลือกหากมีประวัติใช้ยาบ้า ยาไอซ์ กัญชา หรือดื่มสุราหนัก/เพิ่งหยุดดื่ม</p>
        </div>
      </label>
      <div id="psychSubstanceSubGroup" class="hidden pl-4 sm:pl-6 space-y-3 border-l-2 border-medical-200">
        <p class="text-xs text-slate-600 font-medium mb-1">เลือกสารที่ตรวจพบประวัติการใช้ (เลือกได้หลายข้อ):</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
            <input type="checkbox" name="psychSubstances" value="meth_stimulants" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
            <span class="text-xs sm:text-sm text-slate-800">มีประวัติใช้ยาบ้า, ยาไอซ์, โคเคน หรือสารกระตุ้นประสาท</span>
          </label>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
            <input type="checkbox" name="psychSubstances" value="alcohol_withdrawal" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
            <span class="text-xs sm:text-sm text-slate-800">มีประวัติดื่มสุราหนักเป็นประจำ หรือเพิ่งหยุด/อดดื่มสุรามา 1-3 วัน</span>
          </label>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
            <input type="checkbox" name="psychSubstances" value="cannabis_kratom_cough" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
            <span class="text-xs sm:text-sm text-slate-800">มีประวัติใช้กัญชา, น้ำกระท่อม, ยาแก้ไอผสม หรือสารระเหย/ดมกาว</span>
          </label>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
            <input type="checkbox" name="psychSubstances" value="sedative_overdose" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
            <span class="text-xs sm:text-sm text-slate-800">มีประวัติรับประทานยานอนหลับ หรือยากดประสาทเกินขนาด</span>
          </label>
        </div>

        <!-- กล่องพิมพ์ระบุรายละเอียดสารเสพติด/แอลกอฮอล์เพิ่มเติม -->
        <div id="psychSubstanceDetailContainer" class="mt-3 pt-2 border-t border-slate-100">
          <label class="block text-xs font-medium text-slate-600 mb-1">
            ระบุรายละเอียดสารเสพติด ปริมาณ หรือการดื่มเพิ่มเติม (ถ้ามี):
          </label>
          <input type="text" id="psychSubstanceDetail" placeholder="ระบุ เช่น ยาบ้า 2 เม็ด/วัน, ดื่มเหล้าขาว 1 ขวด/วัน มา 5 ปี, กัญชา..."
            class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white transition">
        </div>
      </div>
    </div>

    <!-- 3.2 สัญญาณเตือนภาวะทางกายเฉียบพลัน -->
    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        3.2 สัญญาณเตือนภาวะทางกายเฉียบพลัน (เลือกได้หลายข้อหากตรวจพบ):
      </label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="psychOrganicSigns" value="high_fever_hyperthermia" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">มีไข้สูง ตัวร้อนจัด เหงื่อแตกพลั่ก หรือตัวสั่นรุนแรง</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="psychOrganicSigns" value="head_trauma_fall" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">มีประวัติได้รับอุบัติเหตุศีรษะกระแทก หรือหกล้มก่อนมีอาการ</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="psychOrganicSigns" value="seizure_tongue_bite" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">มีอาการชักเกร็ง ตาค้าง กัดลิ้น หรือปัสสาวะราดก่อนจะเริ่มเอะอะโวยวาย</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="psychOrganicSigns" value="diabetes_hypoglycemia_risk" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">มีโรคประจำตัวเป็นเบาหวาน และรับประทานอาหารได้น้อยหรือฉีดยาเบาหวาน</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="psychOrganicSigns" value="severe_headache_stiff_neck" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">มีอาการปวดศีรษะรุนแรงเฉียบพลัน คอแข็งเกร็ง หรือแขนขาอ่อนแรง</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="psychOrganicSigns" value="muscle_rigidity_lead_pipe" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">มีอาการกล้ามเนื้อเกร็งแข็งทั่วตัว หรือขากรรไกรเกร็งค้าง</span>
        </label>
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
        <p class="text-xs text-slate-500">ประวัติความสม่ำเสมอในการรับประทานยาจิตเวช และประวัติการทำร้ายร่างกายในอดีต</p>
      </div>
    </div>

    <!-- 4.1 การรับประทานยาจิตเวชของผู้ป่วย -->
    <div class="mb-5">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        4.1 การรับประทานยาจิตเวชของผู้ป่วย:
      </label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-slate-700">
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="psychCompliance" value="regular" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4"
            onchange="handlePsychComplianceChange(this.value)">
          <span class="text-xs sm:text-sm text-slate-800">รับประทานยาจิตเวชสม่ำเสมอครบถ้วนตามแพทย์สั่ง</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="psychCompliance" value="missed_days" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4"
            onchange="handlePsychComplianceChange(this.value)">
          <span class="text-xs sm:text-sm text-slate-800">ลืมรับประทานยา หรือขาดยามาหลายวัน/สัปดาห์</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="psychCompliance" value="self_adjusted" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4"
            onchange="handlePsychComplianceChange(this.value)">
          <span class="text-xs sm:text-sm text-slate-800">ปรับขนาดยาเอง หรือหยุดรับประทานยาเอง</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="psychCompliance" value="no_prior_rx" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4"
            onchange="handlePsychComplianceChange(this.value)">
          <span class="text-xs sm:text-sm text-slate-800">ไม่เคยมียาจิตเวชมารับประทาน</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer sm:col-span-2">
          <input type="radio" name="psychCompliance" value="unsure_self_prepared" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4"
            onchange="handlePsychComplianceChange(this.value)">
          <span class="text-xs sm:text-sm text-slate-800">ไม่แน่ใจ หรือ คนไข้จัดยาทานเอง</span>
        </label>
      </div>

      <!-- Progressive disclosure for missed days -->
      <div id="psychMissedDaysContainer" class="hidden mt-3 pl-4 border-l-2 border-medical-200">
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium text-slate-600">ขาดยามาประมาณ:</label>
          <input type="number" id="psychMissedDays" placeholder="เช่น 7" min="1" max="365"
            class="w-24 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-medical-500 focus:outline-none">
          <span class="text-xs text-slate-600">วัน</span>
        </div>
      </div>
    </div>

    <!-- 4.2 ประวัติพฤติกรรมก้าวร้าวหรือความรุนแรงในอดีต -->
    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        4.2 ประวัติพฤติกรรมก้าวร้าวหรือความรุนแรงในอดีต (เลือกได้หลายข้อหากมีประวัติ):
      </label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="psychPastViolence" value="history_violence_assault" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">เคยมีประวัติทำร้ายร่างกายผู้อื่น หรือมีคดีความเกี่ยวกับความรุนแรง</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="psychPastViolence" value="past_suicide_attempt" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">เคยลงมือ พยายามฆ่าตัวตายมาก่อนในอดีต</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer sm:col-span-2">
          <input type="checkbox" name="psychPastViolence" value="no_past_violence" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">ไม่มีประวัติความรุนแรงในอดีต</span>
        </label>
      </div>
    </div>
  </div>
</div>
`;

// --- Master Module Definition ---
const psychiatricEmergencyModule = {
  id: 'psychiatric_emergency',
  recordCc: 'psychiatric_emergency',
  algorithm: 'psychiatric-emergency-protocol',
  sectionDomId: 'cc-psychiatric-emergency-section',
  formHtml: PSYCHIATRIC_FORM_HTML,

  init: function() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  },

  collectIntake: function(ctx = {}) {
    const durVal = parseInt(document.getElementById('psychDurationVal')?.value, 10);
    const durUnit = document.getElementById('psychDurationUnit')?.value || 'hours';

    const getRadio = (name) => {
      const el = document.querySelector(`input[name="${name}"]:checked`);
      return el ? el.value : null;
    };
    const getChecks = (name) => {
      return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(el => el.value);
    };

    const informant = getRadio('psychInformant');
    const informantRel = document.getElementById('psychInformantRel')?.value?.trim() || '';

    const priorBaseline = getRadio('psychPriorBaseline');
    const baselineStatus = (priorBaseline === 'known_psych_history') ? getRadio('psychBaselineStatus') : null;

    const behaviors = getChecks('psychBehaviors');
    const behaviorOtherDetail = document.getElementById('psychBehaviorOtherDetail')?.value?.trim() || '';
    const harmRisks = getChecks('psychHarmRisks');

    const parentHallucination = document.getElementById('psychParentHallucination')?.checked;
    const hallucinations = parentHallucination ? getChecks('psychHallucinations') : [];

    const parentDelusion = document.getElementById('psychParentDelusion')?.checked;
    const delusions = parentDelusion ? getChecks('psychDelusions') : [];

    const parentMood = document.getElementById('psychParentMood')?.checked;
    const moodSigns = parentMood ? getChecks('psychMoodSigns') : [];

    const parentSleep = document.getElementById('psychParentSleep')?.checked;
    const sleepSigns = parentSleep ? getChecks('psychSleepSigns') : [];

    const parentSubstance = document.getElementById('psychParentSubstance')?.checked;
    const substances = parentSubstance ? getChecks('psychSubstances') : [];
    const substanceDetail = document.getElementById('psychSubstanceDetail')?.value?.trim() || '';

    const organicSigns = getChecks('psychOrganicSigns');
    const compliance = getRadio('psychCompliance');
    const missedDaysVal = parseInt(document.getElementById('psychMissedDays')?.value, 10);
    const pastViolence = getChecks('psychPastViolence');

    const otherSymptomsFree = document.getElementById('sx_other_free')?.value?.trim() || ctx.otherSymptomsFree || '';

    const rec = {
      id: ctx.recordId || ctx.id,
      queue_number: ctx.queueNumber || ctx.queue_number,
      hn: ctx.randomHn || ctx.hn,
      name: ctx.patientName || ctx.name,
      age: ctx.patientAge !== undefined ? ctx.patientAge : ctx.age,
      gender: ctx.gender,
      chief_complaint: 'psychiatric_emergency',
      chief_complaint_title: 'เอะอะโวยวาย / จิตเวช',
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

      psychInformant: informant,
      psychInformantRel: informantRel,
      psychPriorBaseline: priorBaseline,
      psychBaselineStatus: baselineStatus,
      psychBehaviors: behaviors,
      psychBehaviorOtherDetail: behaviorOtherDetail,
      psychHarmRisks: harmRisks,
      psychHallucinations: hallucinations,
      psychDelusions: delusions,
      psychMoodSigns: moodSigns,
      psychSleepSigns: sleepSigns,
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

  hydrateForm: function(data = {}) {
    if (data.durationVal) {
      const valEl = document.getElementById('psychDurationVal');
      if (valEl) valEl.value = data.durationVal;
    }
    const unitEl = document.getElementById('psychDurationUnit');
    if (unitEl) {
      unitEl.value = data.durationUnit || 'hours';
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

    setRadio('psychInformant', data.psychInformant);
    if (data.psychInformant) {
      handlePsychInformantChange(data.psychInformant);
    }
    if (data.psychInformantRel) {
      const relEl = document.getElementById('psychInformantRel');
      if (relEl) relEl.value = data.psychInformantRel;
    }

    setRadio('psychPriorBaseline', data.psychPriorBaseline);
    if (data.psychPriorBaseline) {
      handlePsychPriorBaselineChange(data.psychPriorBaseline);
    }
    setRadio('psychBaselineStatus', data.psychBaselineStatus);

    setChecks('psychBehaviors', data.psychBehaviors);
    if (Array.isArray(data.psychBehaviors) && data.psychBehaviors.includes('other_behavior')) {
      togglePsychGroup('psychBehaviorOtherDetailContainer', true);
      const oEl = document.getElementById('psychBehaviorOtherDetail');
      if (oEl) oEl.value = data.psychBehaviorOtherDetail || '';
    }

    setChecks('psychHarmRisks', data.psychHarmRisks);

    if (Array.isArray(data.psychHallucinations) && data.psychHallucinations.length > 0) {
      const p = document.getElementById('psychParentHallucination');
      if (p) p.checked = true;
      togglePsychGroup('psychHallucinationSubGroup', true);
      setChecks('psychHallucinations', data.psychHallucinations);
    }

    if (Array.isArray(data.psychDelusions) && data.psychDelusions.length > 0) {
      const p = document.getElementById('psychParentDelusion');
      if (p) p.checked = true;
      togglePsychGroup('psychDelusionSubGroup', true);
      setChecks('psychDelusions', data.psychDelusions);
    }

    if (Array.isArray(data.psychMoodSigns) && data.psychMoodSigns.length > 0) {
      const p = document.getElementById('psychParentMood');
      if (p) p.checked = true;
      togglePsychGroup('psychMoodSubGroup', true);
      setChecks('psychMoodSigns', data.psychMoodSigns);
    }

    if (Array.isArray(data.psychSleepSigns) && data.psychSleepSigns.length > 0) {
      const p = document.getElementById('psychParentSleep');
      if (p) p.checked = true;
      togglePsychGroup('psychSleepSubGroup', true);
      setChecks('psychSleepSigns', data.psychSleepSigns);
    }

    if (Array.isArray(data.psychSubstances) && data.psychSubstances.length > 0) {
      const p = document.getElementById('psychParentSubstance');
      if (p) p.checked = true;
      togglePsychGroup('psychSubstanceSubGroup', true);
      setChecks('psychSubstances', data.psychSubstances);
    }

    if (data.psychSubstanceDetail) {
      const sDetEl = document.getElementById('psychSubstanceDetail');
      if (sDetEl) sDetEl.value = data.psychSubstanceDetail;
    }

    setChecks('psychOrganicSigns', data.psychOrganicSigns);

    setRadio('psychCompliance', data.psychCompliance);
    if (data.psychCompliance) {
      handlePsychComplianceChange(data.psychCompliance);
    }
    if (data.psychMissedDays) {
      const mEl = document.getElementById('psychMissedDays');
      if (mEl) mEl.value = data.psychMissedDays;
    }

    setChecks('psychPastViolence', data.psychPastViolence);
  },

  clearForm: function() {
    ['psychDurationVal', 'psychInformantRel', 'psychBehaviorOtherDetail', 'psychSubstanceDetail', 'psychMissedDays'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });

    const durUnit = document.getElementById('psychDurationUnit');
    if (durUnit) durUnit.value = 'hours';

    ['psychParentHallucination', 'psychParentDelusion', 'psychParentMood', 'psychParentSleep', 'psychParentSubstance'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.checked = false;
    });

    [
      'psychInformantRelContainer',
      'psychPriorBaselineSubContainer',
      'psychBehaviorOtherDetailContainer',
      'psychHallucinationSubGroup',
      'psychDelusionSubGroup',
      'psychMoodSubGroup',
      'psychSleepSubGroup',
      'psychSubstanceSubGroup',
      'psychMissedDaysContainer'
    ].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });

    const radios = document.querySelectorAll('#cc-psychiatric-emergency-section input[type="radio"]');
    radios.forEach(r => { r.checked = false; });

    const checks = document.querySelectorAll('#cc-psychiatric-emergency-section input[type="checkbox"]');
    checks.forEach(c => { c.checked = false; });
  },

  isRedFlag: function(patient) {
    const rfs = evaluatePsychiatricRedFlags(patient);
    return rfs.length > 0;
  },

  evaluateRedFlags: evaluatePsychiatricRedFlags,
  updateOutputs: updatePsychiatricOutputs,
  renderRapidHpi: renderPsychiatricRapidHpi,
  renderNarrative: renderPsychiatricNarrative,
  renderDoctorHpi: renderPsychiatricDoctorHpi,
  generateCds: generatePsychiatricCds,

  // --- Seed Patients Registry ---
  seedPatients: [
    // Case 1: Methamphetamine-Induced Psychosis with Severe Agitation & Weapon (ESI 2)
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
      underlying: [],
      drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร',
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
      psychHallucinations: ['auditory_command'],
      psychDelusions: ['persecutory_paranoia'],
      psychMoodSigns: ['irritability_aggression'],
      psychSleepSigns: ['insomnia_decreased_need'],
      psychSubstances: ['meth_stimulants'],
      psychSubstanceDetail: 'เสพยาบ้าต่อเนื่อง 3 วัน',
      psychOrganicSigns: [],
      psychCompliance: 'no_prior_rx',
      psychMissedDays: null,
      psychPastViolence: ['history_violence_assault']
    },

    // Case 2: Organic Delirium from Severe Sepsis / UTI in Elderly (ESI 2)
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
      drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร',
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
      psychHallucinations: ['visual_hallucination', 'tactile_hallucination'],
      psychDelusions: [],
      psychMoodSigns: ['irritability_aggression'],
      psychSleepSigns: ['sundowning_day_night_reversal'],
      psychSubstances: [],
      psychSubstanceDetail: '',
      psychOrganicSigns: ['high_fever_hyperthermia', 'diabetes_hypoglycemia_risk'],
      psychCompliance: 'regular',
      psychMissedDays: null,
      psychPastViolence: ['no_past_violence']
    },

    // Case 3: Schizophrenic Relapse with Command Hallucinations due to Non-compliance (ESI 2)
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
      drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร',
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
      psychHallucinations: ['auditory_command'],
      psychDelusions: ['persecutory_paranoia'],
      psychMoodSigns: ['severe_depression_crying'],
      psychSleepSigns: ['insomnia_anxiety_paranoia'],
      psychSubstances: [],
      psychSubstanceDetail: '',
      psychOrganicSigns: [],
      psychCompliance: 'missed_days',
      psychMissedDays: 30,
      psychPastViolence: ['past_suicide_attempt']
    },

    // Case 4: Severe Alcohol Withdrawal / Impending Delirium Tremens (ESI 2 / 3)
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
      drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร',
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
      psychHallucinations: ['visual_hallucination'],
      psychDelusions: ['persecutory_paranoia'],
      psychMoodSigns: ['irritability_aggression'],
      psychSleepSigns: ['insomnia_anxiety_paranoia'],
      psychSubstances: ['alcohol_withdrawal'],
      psychSubstanceDetail: 'หยุดดื่มเหล้าขาวกะทันหันมาได้ 2 วัน',
      psychOrganicSigns: [],
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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = psychiatricEmergencyModule;
}
