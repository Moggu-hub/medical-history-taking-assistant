// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 23_epistaxis.js
// อาการนำ: เลือดกำเดาไหล (Epistaxis / Nosebleed)
// รองรับ Zero Default Bias, Progressive Disclosure, Universal Date/Time,
// Rapid Note De-duplication, และ TDD Core Guard
// =========================================================================

// --- Progressive Disclosure Helper Functions ---
function toggleEpistaxisGroup(subId, show) {
  const el = document.getElementById(subId);
  if (!el) return;
  if (show) {
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
    el.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    const textInput = el.querySelector('input[type="text"]');
    if (textInput) textInput.value = '';
  }
}

function handleEpistaxisMedChange(clickedEl) {
  if (!clickedEl) return;
  if (clickedEl.value === 'none') {
    if (clickedEl.checked) {
      document.querySelectorAll('input[name="epistaxisMeds"]').forEach(cb => {
        if (cb.value !== 'none') cb.checked = false;
      });
    }
  } else {
    if (clickedEl.checked) {
      const noneCb = document.querySelector('input[name="epistaxisMeds"][value="none"]');
      if (noneCb) noneCb.checked = false;
    }
  }
}

// --- Clinical Decision Support & Evaluation Functions ---
function evaluateEpistaxisRedFlags(patient) {
  const rfs = [];
  const vs = patient.vital_signs || {};
  const sbp = vs.sbp !== undefined && vs.sbp !== null ? parseInt(vs.sbp, 10) : null;
  const dbp = vs.dbp !== undefined && vs.dbp !== null ? parseInt(vs.dbp, 10) : null;
  const pr = vs.pr !== undefined && vs.pr !== null ? parseInt(vs.pr, 10) : null;

  const warnSigns = Array.isArray(patient.epistaxisWarningSigns) ? patient.epistaxisWarningSigns : [];
  const direction = Array.isArray(patient.epistaxisDirection) ? patient.epistaxisDirection : [];
  const cranialSigns = Array.isArray(patient.epistaxisAcuteCranial) ? patient.epistaxisAcuteCranial : [];
  const traumaSigns = Array.isArray(patient.epistaxisTraumaSigns) ? patient.epistaxisTraumaSigns : [];
  const meds = Array.isArray(patient.epistaxisMeds) ? patient.epistaxisMeds : [];
  const underlying = Array.isArray(patient.epistaxisUnderlying) ? patient.epistaxisUnderlying : [];

  // 1. Massive Hemorrhage / Airway Threat / Shock (ESI 1)
  const isAirwayThreat = warnSigns.includes('warn_stridor_airway_tight') || warnSigns.includes('warn_choking_swallow');
  const isShock = warnSigns.includes('warn_dizziness_presyncope') || warnSigns.includes('warn_profuse_sweat_cold_shock') || (sbp !== null && sbp < 90) || (pr !== null && pr > 120);
  if (patient.epistaxisVolume === 'heavy_clots' && (isAirwayThreat || isShock)) {
    rfs.push({
      key: 'rf_massive_epistaxis_shock',
      level: 1,
      textTh: 'Massive Epistaxis / Airway Threat & Hemorrhagic Shock / เลือดกำเดาทะลักปริมาณมาก คุกคามทางเดินหายใจหรือช็อก',
      risk: 'Asphyxiation from blood aspiration, profound hypovolemia, and circulatory collapse.',
      suggestedAction: 'Immediate ABC stabilization, suction airway, lean forward, 2 large-bore IVs, urgent anterior/posterior packing, stat ENT consult.'
    });
  }

  // 2. Maxillofacial / Basilar Skull Fracture with CSF Leak (ESI 2)
  if (patient.epistaxisTrauma && (traumaSigns.includes('trauma_csf_leak_rhinorrhea') || traumaSigns.includes('trauma_raccoon_eyes') || traumaSigns.includes('trauma_nasal_deformity'))) {
    rfs.push({
      key: 'rf_basilar_skull_trauma_csf',
      level: 2,
      textTh: 'Maxillofacial Trauma / Basilar Skull Fracture with CSF Leak / สงสัยฐานกะโหลกศีรษะแตกและน้ำไขสันหลังรั่ว',
      risk: 'Direct intracranial penetration if packed blindly, meningitis, pneumocephalus.',
      suggestedAction: 'Absolute CONTRAINDICATION to blind nasal packing or NG tube. Stat CT Facial bones and CT Brain, Neurosurgery & ENT consult.'
    });
  }

  // 3. Suspected Posterior Epistaxis / Refractory to Compression (ESI 2)
  const isPosteriorFlow = direction.includes('dripping_throat') || direction.includes('failed_compression') || direction.includes('vomited_blood_clots');
  const isElderlyBilateral = patient.epistaxisSide === 'bilateral' && patient.age >= 60;
  if (isPosteriorFlow || isElderlyBilateral) {
    rfs.push({
      key: 'rf_posterior_epistaxis',
      level: 2,
      textTh: 'Suspected Posterior Epistaxis / Refractory to Compression / สงสัยเลือดออกจากหลอดเลือดส่วนหลังโพรงจมูก',
      risk: 'Uncontrolled bleeding from sphenopalatine branches, high risk of aspiration and refractory hemorrhage.',
      suggestedAction: 'Inspect posterior oropharynx, suction clots, apply topical vasoconstrictor, prepare posterior packing / balloon catheter tamponade.'
    });
  }

  // 4. Anticoagulant / Antiplatelet-associated Epistaxis / Coagulopathy (ESI 3)
  const hasAnticoag = meds.includes('anticoagulant_warfarin') || meds.includes('antiplatelet_aspirin') || meds.includes('meds_unknown');
  const hasCoagulopathy = underlying.includes('cirrhosis') || underlying.includes('esrd') || underlying.includes('coagulopathy');
  const hasBleedingSigns = warnSigns.includes('warn_petechiae_purpura') || warnSigns.includes('warn_mucosal_or_melena');
  if (hasAnticoag || hasCoagulopathy || hasBleedingSigns) {
    rfs.push({
      key: 'rf_anticoagulant_bleeding',
      level: 3,
      textTh: 'Anticoagulant-Associated Epistaxis / Coagulopathy / ภาวะเลือดออกจากยาต้านการแข็งตัวของเลือดหรือโรคเลือด',
      risk: 'Impaired clot formation leading to prolonged, recurrent or severe hemorrhage.',
      suggestedAction: 'Hold anticoagulants, stat CBC (Platelet), PT/INR, PTT. Consider reversal agents (Vit K, FFP, PCC) if severe; use dissolvable packing.'
    });
  }

  // 5. Hypertensive Urgency / Emergency with Epistaxis (ESI 3)
  const hasSevereBP = (sbp !== null && sbp >= 180) || (dbp !== null && dbp >= 110);
  const hasCranialSymptoms = cranialSigns.includes('severe_headache');
  if (hasSevereBP || (hasCranialSymptoms && underlying.includes('htn'))) {
    rfs.push({
      key: 'rf_hypertensive_urgency',
      level: 3,
      textTh: 'Hypertensive Urgency / Severe Hypertension with Epistaxis / ความดันโลหิตสูงวิกฤตร่วมกับเลือดกำเดาไหล',
      risk: 'Target organ damage and increased arterial bleeding pressure.',
      suggestedAction: 'Direct local hemostasis first. Check for target organ damage (ECG, renal function). Controlled, gradual BP reduction.'
    });
  }

  // 6. Recurrent Epistaxis / Suspected Head & Neck Mass (NPC) (ESI 3)
  const hasHeadNeckSigns = warnSigns.includes('warn_cervical_lymph_node') || warnSigns.includes('warn_unilateral_obstruction') || warnSigns.includes('warn_unilateral_tinnitus');
  if (hasHeadNeckSigns) {
    rfs.push({
      key: 'rf_suspected_npc_mass',
      level: 3,
      textTh: 'Recurrent Epistaxis / Suspected Head & Neck Mass (NPC) / เลือดออกร่วมกับก้อนที่คอหรืออาการหูอื้อคัดจมูกข้างเดียว',
      risk: 'Underlying neoplastic lesion such as Nasopharyngeal Carcinoma (NPC) or vascular malformation.',
      suggestedAction: 'Hemostasis according to protocol, schedule outpatient Nasoendoscopy and biopsy by ENT specialist.'
    });
  }

  return rfs;
}

// --- Formatters for Doctor Rapid Note ---
function formatEpistaxisSide(patient) {
  const map = {
    left: 'ข้างซ้ายข้างเดียว (Left)',
    right: 'ข้างขวาข้างเดียว (Right)',
    bilateral: 'ไหลทั้งสองข้างพร้อมกัน (Bilateral) 🚩'
  };
  return map[patient.epistaxisSide] || 'ไม่ได้ระบุ';
}

function formatEpistaxisActiveStatus(patient) {
  const map = {
    active: 'ยังมีเลือดไหลต่อเนื่องอยู่ขณะนี้ (Active bleeding) 🚩',
    stopped: 'เลือดหยุดไหลแล้วก่อนมาถึง (Bleeding stopped)'
  };
  return map[patient.epistaxisActiveStatus] || 'ไม่ได้ระบุ';
}

function formatEpistaxisRecurrence(patient) {
  const map = {
    highest_in_life: 'ไหลมากที่สุดในชีวิต (Severe primary episode)',
    recurrent_episodes: 'เคยมีเลือดกำเดาไหลซ้ำๆ แบบนี้มาก่อน (Recurrent episodes)'
  };
  return map[patient.epistaxisRecurrence] || 'ไม่ได้ระบุ';
}

function formatEpistaxisVolume(patient) {
  const map = {
    mild_oozing: 'ไหลซึมๆ หยดช้าๆ หรือเปื้อนกระดาษทิชชู (Mild / oozing)',
    moderate_flow: 'ไหลเป็นสายต่อเนื่อง ชุ่มกระดาษ/ผ้าหลายผืน (Moderate flow)',
    heavy_clots: 'ไหลทะลักปริมาณมาก มีก้อนลิ่มเลือดขนาดใหญ่หลุดออกมา (Heavy / Clots) 🚩'
  };
  return map[patient.epistaxisVolume] || 'ไม่ได้ระบุ';
}

// --- Rapid Note Generator (5 Standardized Sections) ---
function renderEpistaxisRapidHpi(patient) {
  const durVal = patient.durationVal;
  const durUnitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durUnit = durUnitMap[patient.durationUnit] || 'นาที';
  const durationStr = durVal ? `${durVal} ${durUnit}` : 'ไม่ระบุ';

  const warnSigns = Array.isArray(patient.epistaxisWarningSigns) ? patient.epistaxisWarningSigns : [];
  const direction = Array.isArray(patient.epistaxisDirection) ? patient.epistaxisDirection : [];
  const cranialSigns = Array.isArray(patient.epistaxisAcuteCranial) ? patient.epistaxisAcuteCranial : [];
  const traumaSigns = Array.isArray(patient.epistaxisTraumaSigns) ? patient.epistaxisTraumaSigns : [];
  const triggers = Array.isArray(patient.epistaxisTriggers) ? patient.epistaxisTriggers : [];
  const meds = Array.isArray(patient.epistaxisMeds) ? patient.epistaxisMeds : [];
  const underlying = Array.isArray(patient.epistaxisUnderlying) ? patient.epistaxisUnderlying : [];

  const posList = [];
  const negList = [];

  // Positives evaluation
  if (patient.epistaxisVolume === 'heavy_clots') {
    posList.push('เลือดกำเดาไหลทะลักปริมาณมาก มีก้อนลิ่มเลือดขนาดใหญ่ (Heavy bleeding / Clots) 🚩');
  } else if (patient.epistaxisVolume === 'moderate_flow') {
    posList.push('เลือดกำเดาไหลเป็นสายต่อเนื่อง ชุ่มกระดาษหรือผ้าหลายผืน');
  }

  if (patient.epistaxisActiveStatus === 'active') {
    posList.push('ยังมีเลือดไหลต่อเนื่องอยู่ขณะนี้ (Active bleeding) 🚩');
  }

  if (direction.includes('dripping_throat')) {
    posList.push('รู้สึกมีเลือดไหลรินลงคอตลอดเวลา / ต้องคอยกลืนเลือด (Suspected Posterior Epistaxis) 🚩');
  }
  if (direction.includes('failed_compression')) {
    posList.push('บีบปีกจมูกแน่น 15-20 นาทีแล้วไม่หยุด (Failed direct compression) 🚩');
  }
  if (direction.includes('vomited_blood_clots')) {
    posList.push('มีอาการไอหรืออาเจียนออกมาเป็นลิ่มเลือด/สีกาแฟ (Swallowed blood / Hematemesis) 🚩');
  }

  if (cranialSigns.includes('severe_headache')) {
    posList.push('มีอาการปวดศีรษะรุนแรง ตามัว ตาพร่า หรือแน่นหน้าอก (Suspected Hypertensive Urgency) 🚩');
  }

  if (patient.epistaxisTrauma) {
    const tSigns = [];
    if (traumaSigns.includes('trauma_csf_leak_rhinorrhea')) tSigns.push('มีน้ำใสๆ ไหลปนออกมาจากจมูกคล้ายน้ำมูก (Suspected CSF rhinorrhea) 🚩');
    if (traumaSigns.includes('trauma_raccoon_eyes')) tSigns.push('รอยฟกช้ำม่วงคล้ำรอบตาทั้งสองข้างหรือหลังใบหู (Raccoon eyes / Battle sign) 🚩');
    if (traumaSigns.includes('trauma_nasal_deformity')) tSigns.push('กระดูกดั้งจมูกเบี้ยว ผิดรูป 🚩');
    const details = patient.epistaxisTraumaDetails ? `: "${patient.epistaxisTraumaDetails}"` : '';
    posList.push(`มีประวัติได้รับอุบัติเหตุกระแทกใบหน้าหรือศีรษะ${details} ${tSigns.length > 0 ? `[${tSigns.join(', ')}]` : ''}`);
  }

  // Warning signs positives
  if (warnSigns.includes('warn_choking_swallow')) posList.push('สำลักเลือด หรือกลืนลำบาก 🚩');
  if (warnSigns.includes('warn_stridor_airway_tight')) posList.push('หายใจติดขัด หายใจมีเสียงหวีด หรือรู้สึกแน่นคอแทบหายใจไม่ออก (Airway threat) 🚩');
  if (warnSigns.includes('warn_dizziness_presyncope')) posList.push('หน้ามืด เวียนศีรษะ วูบ หรือหมดสติไปชั่วขณะ 🚩');
  if (warnSigns.includes('warn_profuse_sweat_cold_shock')) posList.push('เหงื่อแตกท่วมตัว ผิวหนังซีดเย็น ใจสั่นรัวเร็ว (Shock sign) 🚩');
  if (warnSigns.includes('warn_petechiae_purpura')) posList.push('จุดเลือดออกสีแดงเล็กๆ หรือรอยช้ำจ้ำเลือดตามแขนขาและลำตัว 🚩');
  if (warnSigns.includes('warn_mucosal_or_melena')) posList.push('เลือดออกตามไรฟัน ปัสสาวะเป็นเลือด หรือถ่ายอุจจาระสีดำสนิท 🚩');
  if (warnSigns.includes('warn_cervical_lymph_node')) posList.push('คลำได้ก้อนบวมแข็งที่ลำคอ หรือข้างกราม 🚩');
  if (warnSigns.includes('warn_unilateral_obstruction')) posList.push('คัดจมูกข้างเดียวเรื้อรัง หรือน้ำมูกปนเลือดกลิ่นเหม็น 🚩');
  if (warnSigns.includes('warn_unilateral_tinnitus')) posList.push('มีอาการหูอื้อหรือการได้ยินลดลงข้างเดียวกับที่มีเลือดออก 🚩');

  // Triggers positives
  if (triggers.includes('trig_nose_picking')) posList.push('มีประวัติแคะแกะเกาหรือสั่งน้ำมูกแรงๆ ในโพรงจมูก');
  if (triggers.includes('trig_nasal_spray_dry_air')) posList.push('เพิ่งใช้ยาพ่นจมูก หรือสัมผัสอากาศแห้ง/เย็นจัด');

  // Meds positives
  if (meds.includes('anticoagulant_warfarin')) posList.push('รับประทานยาต้านการแข็งตัวของเลือด (Warfarin, Eliquis, Xarelto, Pradaxa) 🚩');
  if (meds.includes('antiplatelet_aspirin')) posList.push('รับประทานยาต้านเกล็ดเลือด (Aspirin, Clopidogrel / Plavix) 🚩');
  if (meds.includes('meds_unknown')) posList.push('มียาประจำตัว แต่ไม่ทราบชื่อยาที่ใช้ 🚩');

  if (patient.otherSymptomsFree) {
    posList.push(patient.otherSymptomsFree);
  }

  // Negatives evaluation
  if (patient.epistaxisActiveStatus === 'stopped') negList.push('เลือดหยุดไหลแล้วก่อนมาถึง (Bleeding stopped)');
  if (!direction.includes('dripping_throat')) negList.push('ปฏิเสธประวัติเลือดไหลรินลงคอ');
  if (!direction.includes('vomited_blood_clots')) negList.push('ปฏิเสธการไอหรืออาเจียนเป็นเลือด');
  if (!cranialSigns.includes('severe_headache')) negList.push('ปฏิเสธอาการปวดศีรษะรุนแรง ตาพร่ามัว หรือแน่นหน้าอก');
  if (!patient.epistaxisTrauma) negList.push('ปฏิเสธประวัติอุบัติเหตุกระแทกใบหน้าหรือศีรษะ');
  if (!warnSigns.includes('warn_choking_swallow') && !warnSigns.includes('warn_stridor_airway_tight')) negList.push('ปฏิเสธการสำลักเลือด หายใจติดขัด หรือแน่นคอ');
  if (!warnSigns.includes('warn_dizziness_presyncope') && !warnSigns.includes('warn_profuse_sweat_cold_shock')) negList.push('ปฏิเสธหน้ามืด วูบ เป็นลม และไม่มีเหงื่อแตกตัวเย็น');
  if (!warnSigns.includes('warn_petechiae_purpura') && !warnSigns.includes('warn_mucosal_or_melena')) negList.push('ไม่มีจุดเลือดออก จ้ำเลือดตามตัว เลือดออกตามไรฟัน หรือถ่ายดำ');
  if (!warnSigns.includes('warn_cervical_lymph_node') && !warnSigns.includes('warn_unilateral_obstruction') && !warnSigns.includes('warn_unilateral_tinnitus')) negList.push('คลำไม่พบก้อนที่คอ ไม่มีคัดจมูกหรือหูอื้อข้างเดียว');
  if (!meds.includes('anticoagulant_warfarin') && !meds.includes('antiplatelet_aspirin')) negList.push('ปฏิเสธยาต้านการแข็งตัวของเลือดและยาต้านเกล็ดเลือด');

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
  const redFlags = evaluateEpistaxisRedFlags(patient);

  const defaultRapid =
`[Chief Complaint (CC)]
เลือดกำเดาไหล (Epistaxis) มา ${durationStr}

[History of Present Illness (HPI)]
• ระยะเวลาที่มีอาการ: ${durVal ? `เลือดกำเดาไหลมา ${durationStr}` : 'ไม่ระบุ'} (ตำแหน่ง: ${formatEpistaxisSide(patient)}, สถานะ: ${formatEpistaxisActiveStatus(patient)})
• ประวัติความรุนแรงและการเป็นซ้ำ: ${formatEpistaxisRecurrence(patient)}
• ปริมาณเลือดที่ออก: ${formatEpistaxisVolume(patient)}
• การตอบสนองต่อการบีบปีกจมูก: ${direction.includes('failed_compression') ? 'บีบปีกจมูกแน่น 15-20 นาทีแล้วไม่หยุด (Failed compression) 🚩' : 'เลือดหยุดได้ด้วยการบีบจมูก หรือยังไม่ได้ลองบีบต่อเนื่อง'}

• Pertinent Positives:
${posList.length > 0 ? posList.map(p => `  - ${p}`).join('\n') : '  - ไม่มีอาการร่วมอื่นที่เด่นชัด'}

• Pertinent Negatives:
${negList.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• โรคประจำตัว (U/D): ${udDisplay}
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

  return defaultRapid;
}

// --- Narrative Note Generator (Doctor View) ---
function renderEpistaxisNarrative(patient) {
  const durVal = patient.durationVal;
  const durUnitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durUnit = durUnitMap[patient.durationUnit] || 'นาที';
  const durStr = durVal ? `${durVal} ${durUnit}` : 'ไม่ระบุระยะเวลา';

  const sideStr = formatEpistaxisSide(patient);
  const activeStr = formatEpistaxisActiveStatus(patient);
  const volStr = formatEpistaxisVolume(patient);
  const recurStr = formatEpistaxisRecurrence(patient);

  const warnSigns = Array.isArray(patient.epistaxisWarningSigns) ? patient.epistaxisWarningSigns : [];
  const direction = Array.isArray(patient.epistaxisDirection) ? patient.epistaxisDirection : [];

  let note = `ผู้ป่วย${patient.gender || ''} อายุ ${patient.age || 'ไม่ระบุ'} ปี มารับการตรวจที่ห้องฉุกเฉินด้วยอาการเลือดกำเดาไหล เป็นมา ${durStr} ก่อนมาโรงพยาบาล ตำแหน่งที่เลือดออกคือ${sideStr} สถานะปัจจุบัน${activeStr} ประวัติความรุนแรง${recurStr} ปริมาณเลือดที่ออกคือ${volStr}`;

  if (direction.includes('dripping_throat')) {
    note += ' มีประวัติเลือดไหลรินลงคออย่างต่อเนื่องต้องคอยกลืนเลือดตลอดเวลา';
  }
  if (direction.includes('failed_compression')) {
    note += ' บีบปีกจมูกแน่นต่อเนื่องเกิน 15-20 นาทีแล้วเลือดยังไม่ยอมหยุด';
  }
  if (direction.includes('vomited_blood_clots')) {
    note += ' มีอาการกลืนเลือดจนไอหรืออาเจียนออกมาเป็นลิ่มเลือด';
  }

  if (patient.epistaxisTrauma) {
    note += ` มีประวัติได้รับอุบัติเหตุกระแทกใบหน้าหรือศีรษะ (${patient.epistaxisTraumaDetails || 'ไม่ระบุรายละเอียด'})`;
  }

  if (warnSigns.length > 0) {
    const warnTexts = [];
    if (warnSigns.includes('warn_choking_swallow')) warnTexts.push('สำลักเลือดหรือกลืนลำบาก');
    if (warnSigns.includes('warn_stridor_airway_tight')) warnTexts.push('หายใจติดขัดแน่นคอ');
    if (warnSigns.includes('warn_dizziness_presyncope')) warnTexts.push('หน้ามืดวูบเป็นลม');
    if (warnSigns.includes('warn_profuse_sweat_cold_shock')) warnTexts.push('เหงื่อแตกตัวเย็นใจสั่น');
    if (warnSigns.includes('warn_petechiae_purpura')) warnTexts.push('มีจุดเลือดออกตามตัว');
    if (warnSigns.includes('warn_cervical_lymph_node')) warnTexts.push('คลำได้ก้อนที่ลำคอ');
    note += ` ร่วมกับมีอาการเตือนสำคัญ: ${warnTexts.join(', ')}`;
  } else {
    note += ' ผู้ป่วยปฏิเสธอาการสำลักเลือด หายใจติดขัด ปฏิเสธหน้ามืดวูบ และไม่มีจุดเลือดออกตามตัว';
  }

  return note;
}

function renderEpistaxisDoctorHpi(patient) {
  return renderEpistaxisRapidHpi(patient);
}

// --- Output Dispatcher ---
function updateEpistaxisOutputs(rec) {
  if (!rec) return;
  const rapidText = renderEpistaxisRapidHpi(rec);
  const narrativeText = renderEpistaxisNarrative(rec);

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

  const redFlags = evaluateEpistaxisRedFlags(rec);
  rec.redFlags = redFlags;

  const jsonOutput = {
    encounter: {
      chief_complaint: 'epistaxis',
      chief_complaint_title_th: 'เลือดกำเดาไหล',
      timestamp: rec.timestamp || new Date().toISOString(),
      duration_val: rec.durationVal || null,
      duration_unit: rec.durationUnit || 'minutes'
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
      side: rec.epistaxisSide || null,
      active_status: rec.epistaxisActiveStatus || null,
      recurrence: rec.epistaxisRecurrence || null,
      volume: rec.epistaxisVolume || null,
      direction: Array.isArray(rec.epistaxisDirection) ? rec.epistaxisDirection : [],
      acute_cranial: Array.isArray(rec.epistaxisAcuteCranial) ? rec.epistaxisAcuteCranial : [],
      trauma: {
        occurred: Boolean(rec.epistaxisTrauma),
        details: rec.epistaxisTraumaDetails || '',
        signs: Array.isArray(rec.epistaxisTraumaSigns) ? rec.epistaxisTraumaSigns : []
      },
      warning_signs: Array.isArray(rec.epistaxisWarningSigns) ? rec.epistaxisWarningSigns : [],
      triggers: Array.isArray(rec.epistaxisTriggers) ? rec.epistaxisTriggers : [],
      medications: Array.isArray(rec.epistaxisMeds) ? rec.epistaxisMeds : [],
      underlying_conditions: Array.isArray(rec.epistaxisUnderlying) ? rec.epistaxisUnderlying : [],
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
function generateEpistaxisCds(patient, { rfs, ddxList = [], workupList = [], managementList = [] } = {}) {
  if (!patient) return '';
  const redFlags = rfs || evaluateEpistaxisRedFlags(patient);

  const hasMassive = redFlags.some(r => r.key === 'rf_massive_epistaxis_shock');
  const hasTrauma = redFlags.some(r => r.key === 'rf_basilar_skull_trauma_csf');
  const hasPosterior = redFlags.some(r => r.key === 'rf_posterior_epistaxis');
  const hasAnticoag = redFlags.some(r => r.key === 'rf_anticoagulant_bleeding');
  const hasHTN = redFlags.some(r => r.key === 'rf_hypertensive_urgency');
  const hasNPC = redFlags.some(r => r.key === 'rf_suspected_npc_mass');

  if (hasMassive) {
    ddxList.push('1. 🚨 Massive Epistaxis with Impending Airway Compromise & Hemorrhagic Shock');
    ddxList.push('2. Ruptured Sphenopalatine / Internal Carotid Pseudoaneurysm');
    ddxList.push('3. Posterior Epistaxis with Severe Blood Aspiration');
    workupList.push('Stat Suction Airway, เตรียมพร้อม Endotracheal Intubation');
    workupList.push('Stat Type and Crossmatch PRC 4 units + FFP 2 units');
    workupList.push('CBC, Coagulogram (PT, INR, PTT), BUN, Cr, Electrolytes');
    workupList.push('Stat Urgent ENT and Interventional Radiology (IR) Consultation');
    managementList.push('Triage Level 1: ย้ายเข้าห้องกู้ชีพ (Resuscitation Room) ทันที');
    managementList.push('จัดท่านั่งโน้มตัวไปข้างหน้าเล็กน้อยเพื่อป้องกันการสำลักเลือดลงหลอดลม');
    managementList.push('Two Large-Bore IVs (18G x 2 เส้น) และให้ IV Fluid Resuscitation');
    managementList.push('ทำ Anterior & Posterior packing ทันที (Rapid Rhino หรือ Foley catheter balloon tamponade)');
  } else if (hasTrauma) {
    ddxList.push('1. 🚨 Maxillofacial Trauma / Basilar Skull Fracture with CSF Rhinorrhea');
    ddxList.push('2. Traumatic Ethmoidal / Sphenopalatine Artery Laceration');
    workupList.push('Stat CT Facial bones with 3D reconstruction and CT Brain');
    workupList.push('Stat Neurosurgery and ENT Consultation');
    workupList.push('CBC, Coagulation profile, Blood crossmatch');
    managementList.push('Triage Level 2: ⚠️ ห้ามทำ Blind Nasal Packing หรือใส่ Nasogastric Tube โดยเด็ดขาด');
    managementList.push('ใส่ Cervical Collar ดามคอไว้จนกว่าจะตัดภาวะกระดูกสันหลังส่วนคอหัก');
    managementList.push('หากจำเป็นต้องห้ามเลือด ให้ใช้ Direct compression หรือ Anterior packing ภายใต้การมองเห็นโดยตรง');
  } else if (hasPosterior) {
    ddxList.push('1. ⚠️ Suspected Posterior Epistaxis / Woodruff’s Plexus Bleeding');
    ddxList.push('2. Refractory Anterior Epistaxis');
    workupList.push('ส่องตรวจ Posterior Oropharynx ประเมินสายเลือดที่ไหลรินลงคอ');
    workupList.push('CBC, PT, INR, PTT, BUN, Cr');
    workupList.push('Stat ENT Consultation for Endoscopic Cauterization / Sphenopalatine Artery Ligation');
    managementList.push('Triage Level 2: ดูดลิ่มเลือดออกและใส่ Cotton swab ชุบ 0.05% Oxymetazoline / Adrenaline 1:1000');
    managementList.push('ทำ Posterior Nasal Packing หรือใส่ Double-balloon epistaxis catheter (หรือ 12-14 Fr Foley catheter balloon 5-7 ml ใน nasopharynx)');
    managementList.push('รับไว้รักษาในโรงพยาบาลเพื่อเฝ้าระวังทางเดินหายใจ (Admit for observation with posterior pack)');
  } else if (hasAnticoag) {
    ddxList.push('1. ⚠️ Anticoagulant / Antiplatelet-Induced Epistaxis');
    ddxList.push('2. Coagulopathy-Associated Epistaxis (Liver Disease / ESRD)');
    workupList.push('Stat Coagulogram (PT, INR, PTT, Thrombin Time)');
    workupList.push('CBC (Platelet count), BUN, Cr, LFT');
    managementList.push('Triage Level 3: หยุดยาต้านการแข็งตัวของเลือด/เกล็ดเลือดทันที (Hold Warfarin / DOACs / Antiplatelets)');
    managementList.push('พิจารณาให้ Reversal Agent (Vitamin K 5-10 mg IV, FFP หรือ PCC ในกรณี Warfarin toxicity)');
    managementList.push('หลีกเลี่ยงการทำ Nasal packing รุนแรง พิจารณาใช้วัสดุห้ามเลือดชนิดละลายได้ (Surgicel / Gelita-Spon)');
  } else if (hasHTN) {
    ddxList.push('1. ⚠️ Hypertensive Urgency with Epistaxis');
    ddxList.push('2. Severe Hypertension exacerbating Nasal Bleeding');
    workupList.push('ตรวจวัดความดันโลหิตซ้ำทั้ง 2 แขน');
    workupList.push('12-lead ECG, BUN, Cr, Electrolytes (ประเมิน End-Organ Damage)');
    managementList.push('Triage Level 3: ห้ามเลือดเฉพาะที่ด้วยการกดปีกจมูกและประคบเย็นก่อนเป็นลำดับแรก');
    managementList.push('เมื่อห้ามเลือดได้แล้ว ให้ยาลดความดันโลหิตชนิดรับประทานอย่างนุ่มนวล หลีกเลี่ยงความดันตกฮวบ');
  } else if (hasNPC) {
    ddxList.push('1. ⚠️ Recurrent Epistaxis / Suspected Nasopharyngeal Carcinoma (NPC)');
    ddxList.push('2. Benign Vascular Neoplasm / Juvenile Nasopharyngeal Angiofibroma');
    workupList.push('CBC (Hb, Hct) ประเมินภาวะซีดเรื้อรัง');
    workupList.push('ส่งต่อพบแพทย์เฉพาะทาง ENT เพื่อทำ Rigid/Flexible Nasoendoscopy และ Biopsy');
    managementList.push('Triage Level 3/4: ห้ามเลือดเบื้องต้นและส่งต่อแผนกตรวจผู้ป่วยนอก ENT');
  } else {
    ddxList.push('1. Simple Anterior Epistaxis (Kiesselbach’s plexus / Little’s area)');
    ddxList.push('2. Digital Trauma / Dry Mucosal Erosion');
    workupList.push('ตรวจดูโพรงจมูกด้านหน้าด้วย Nasal Speculum และไฟส่องสว่าง');
    managementList.push('Triage Level 4/5: สอนและแนะนำวิธีกดปีกจมูกที่ถูกต้อง: นั่งตัวตรง โน้มตัวไปข้างหน้าเล็กน้อย ใช้นิ้วชี้และนิ้วหัวแม่มือกดบีบปีกจมูกค้างไว้ 10-15 นาที หายใจทางปาก');
    managementList.push('ประคบเย็นบริเวณสันจมูกและหน้าผาก');
    managementList.push('ทาปิโตรเลียมเจลลี่หรือยาขี้ผึ้งปฏิชีวนะบางๆ ในรูจมูก เลี่ยงการแคะจมูกหรือสั่งน้ำมูกแรง 24-48 ชม.');
  }

  return { ddxList, workupList, managementList };
}

// =========================================================================
// MODULE DEFINITION: epistaxisModule
// =========================================================================
const epistaxisModule = {
  id: 'epistaxis',
  recordCc: 'epistaxis',
  algorithm: 'epistaxis-clinical-protocol',
  sectionDomId: 'cc-epistaxis-section',

  formHtml: `
    <div id="cc-epistaxis-section" class="cc-module-card border border-slate-200 rounded-2xl bg-white shadow-sm p-4 sm:p-6 mb-6">
      <div class="flex items-center space-x-3 mb-5 border-b border-slate-100 pb-3">
        <div class="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
          <i data-lucide="droplets" class="w-6 h-6"></i>
        </div>
        <div>
          <h2 class="text-base sm:text-lg font-bold text-slate-800">แบบประเมินอาการเลือดกำเดาไหล (Epistaxis)</h2>
          <p class="text-xs text-slate-500">กรุณาระบุข้อมูลเพื่อการคัดกรองและประเมินความเร่งด่วนเบื้องต้น</p>
        </div>
      </div>

      <!-- ส่วนที่ 1: ข้อมูลอาการเริ่มต้นและลักษณะการไหล -->
      <div class="space-y-4 mb-6">
        <h3 class="text-sm font-semibold text-slate-800 flex items-center">
          <span class="w-2 h-2 rounded-full bg-rose-500 mr-2"></span>
          1. ข้อมูลอาการเริ่มต้นและลักษณะการไหล
        </h3>

        <!-- 1.1 ระยะเวลาที่เป็นมา -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">ระยะเวลาที่เป็นมา (Duration)</label>
          <div class="flex items-center space-x-2">
            <input type="number" id="epistaxisDurationVal" min="1" max="999" placeholder="ระบุตัวเลข"
              class="w-32 px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-medical-500">
            <select id="epistaxisDurationUnit" class="px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-medical-500">
              <option value="minutes">นาที</option>
              <option value="hours">ชั่วโมง</option>
              <option value="days">วัน</option>
              <option value="weeks">สัปดาห์</option>
              <option value="months">เดือน</option>
              <option value="years">ปี</option>
            </select>
          </div>
        </div>

        <!-- 1.2 ข้างที่มีเลือดกำเดาไหล -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">ข้างที่มีเลือดกำเดาไหล (Side Affected)</label>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition">
              <input type="radio" name="epistaxisSide" value="left" class="text-medical-600 focus:ring-medical-500 h-4 w-4">
              <span class="ml-2.5 text-xs sm:text-sm font-medium text-slate-800">ข้างซ้ายข้างเดียว</span>
            </label>
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition">
              <input type="radio" name="epistaxisSide" value="right" class="text-medical-600 focus:ring-medical-500 h-4 w-4">
              <span class="ml-2.5 text-xs sm:text-sm font-medium text-slate-800">ข้างขวาข้างเดียว</span>
            </label>
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition">
              <input type="radio" name="epistaxisSide" value="bilateral" class="text-medical-600 focus:ring-medical-500 h-4 w-4">
              <span class="ml-2.5 text-xs sm:text-sm font-medium text-slate-800">ไหลทั้งสองข้างพร้อมกัน</span>
            </label>
          </div>
        </div>

        <!-- 1.3 สถานะการไหลในปัจจุบัน -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">สถานะการไหลในขณะนี้</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition">
              <input type="radio" name="epistaxisActiveStatus" value="active" class="text-medical-600 focus:ring-medical-500 h-4 w-4">
              <div class="ml-2.5">
                <span class="text-xs sm:text-sm font-medium text-slate-800 block">ยังมีเลือดไหลอยู่ขณะนี้</span>
                <span class="text-[11px] text-slate-500">เลือดยังไม่ยอมหยุด หรือไหลซึมต่อเนื่อง</span>
              </div>
            </label>
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition">
              <input type="radio" name="epistaxisActiveStatus" value="stopped" class="text-medical-600 focus:ring-medical-500 h-4 w-4">
              <div class="ml-2.5">
                <span class="text-xs sm:text-sm font-medium text-slate-800 block">เลือดหยุดไหลแล้ว</span>
                <span class="text-[11px] text-slate-500">เลือดหยุดไหลแล้วก่อนมาถึงโรงพยาบาล</span>
              </div>
            </label>
          </div>
        </div>

        <!-- 1.4 การเกิดซ้ำหรือความรุนแรง -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">ประวัติความรุนแรงและการเป็นซ้ำ</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition">
              <input type="radio" name="epistaxisRecurrence" value="highest_in_life" class="text-medical-600 focus:ring-medical-500 h-4 w-4">
              <span class="ml-2.5 text-xs sm:text-sm font-medium text-slate-800">ไหลมากที่สุดในชีวิต</span>
            </label>
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition">
              <input type="radio" name="epistaxisRecurrence" value="recurrent_episodes" class="text-medical-600 focus:ring-medical-500 h-4 w-4">
              <span class="ml-2.5 text-xs sm:text-sm font-medium text-slate-800">เคยมีเลือดกำเดาไหลซ้ำๆแบบนี้ มาก่อน</span>
            </label>
          </div>
        </div>

        <!-- 1.5 ปริมาณและความแรงของเลือดที่ออก -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">ปริมาณและความแรงของเลือดที่ออก</label>
          <div class="space-y-2">
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition">
              <input type="radio" name="epistaxisVolume" value="mild_oozing" class="text-medical-600 focus:ring-medical-500 h-4 w-4">
              <div class="ml-2.5">
                <span class="text-xs sm:text-sm font-medium text-slate-800 block">ไหลซึมๆ หยดช้าๆ หรือเปื้อนกระดาษทิชชู</span>
                <span class="text-[11px] text-slate-500">ปริมาณเล็กน้อย เลือดออกเพียงเล็กน้อย</span>
              </div>
            </label>
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition">
              <input type="radio" name="epistaxisVolume" value="moderate_flow" class="text-medical-600 focus:ring-medical-500 h-4 w-4">
              <div class="ml-2.5">
                <span class="text-xs sm:text-sm font-medium text-slate-800 block">ไหลเป็นสายต่อเนื่อง ชุ่มกระดาษ/ผ้าหลายผืน</span>
                <span class="text-[11px] text-slate-500">ปริมาณปานกลาง ไหลไม่หยุดทันที</span>
              </div>
            </label>
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition">
              <input type="radio" name="epistaxisVolume" value="heavy_clots" class="text-medical-600 focus:ring-medical-500 h-4 w-4">
              <div class="ml-2.5">
                <span class="text-xs sm:text-sm font-medium text-slate-800 block">ไหลทะลักปริมาณมาก หรือมีก้อนลิ่มเลือดขนาดใหญ่หลุดออกมา</span>
                <span class="text-[11px] text-slate-500">ปริมาณมาก มีก้อนเลือดลิ่มขนาดใหญ่ หรือสำลักเลือด</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- ส่วนที่ 2: อาการแสดงและทิศทางการไหล -->
      <div class="space-y-4 mb-6 border-t border-slate-100 pt-5">
        <h3 class="text-sm font-semibold text-slate-800 flex items-center">
          <span class="w-2 h-2 rounded-full bg-rose-500 mr-2"></span>
          2. อาการแสดงและทิศทางการไหล
        </h3>

        <!-- 2.1 ทิศทางและการตอบสนองต่อการบีบจมูก และปฐมพยาบาลเบื้องต้นอย่างถูกวิธี -->
        <div class="space-y-2">
          <!-- การ์ดแนะนำการปฐมพยาบาลอย่างถูกวิธีระหว่างรอตรวจ -->
          <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
            <div class="font-semibold flex items-center text-amber-800 mb-1">
              <i data-lucide="info" class="w-3.5 h-3.5 mr-1.5 flex-shrink-0"></i>
              ข้อแนะนำการปฐมพยาบาลเบื้องต้นอย่างถูกวิธี:
            </div>
            นั่งตัวตรงและโน้มตัวไปข้างหน้าเล็กน้อย ก้มหน้าเล็กน้อย บีบปีกจมูกทั้ง 2 ข้างค้างไว้ต่อเนื่อง 10–15 นาทีเต็ม โดยหายใจทางปากแทน และห้ามปล่อยนิ้วออกมาดูบ่อย ๆ
          </div>

          <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition">
            <input type="checkbox" name="epistaxisDirection" value="dripping_throat" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
            <div class="ml-2.5">
              <span class="text-xs sm:text-sm font-medium text-slate-800 block">รู้สึกมีเลือดไหลรินลงคอ หรือต้องคอยกลืนเลือดตลอดเวลา</span>
              <span class="text-[11px] text-slate-500">รู้สึกเหมือนมีน้ำหรือเลือดไหลย้อนลงไปในลำคอ</span>
            </div>
          </label>
          <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition">
            <input type="checkbox" name="epistaxisDirection" value="failed_compression" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
            <div class="ml-2.5">
              <span class="text-xs sm:text-sm font-medium text-slate-800 block">บีบปีกจมูกแน่นๆ ติดต่อกันเกิน 15-20 นาทีแล้ว เลือดยังไม่ยอมหยุดไหล</span>
              <span class="text-[11px] text-slate-500">บีบปีกจมูกค้างไว้นานแล้วเลือดยังคงทะลักออกต่อเนื่อง</span>
            </div>
          </label>
          <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition">
            <input type="checkbox" name="epistaxisDirection" value="vomited_blood_clots" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
            <div class="ml-2.5">
              <span class="text-xs sm:text-sm font-medium text-slate-800 block">มีอาการไอ หรืออาเจียนออกมาเป็นลิ่มเลือด/สีกาแฟ</span>
              <span class="text-[11px] text-slate-500">เนื่องจากกลืนเลือดกำเดาลงกระเพาะอาหาร</span>
            </div>
          </label>
        </div>

        <!-- 2.2 อาการเฉียบพลันร่วมทางศีรษะและความดันโลหิต -->
        <div>
          <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition">
            <input type="checkbox" name="epistaxisAcuteCranial" value="severe_headache" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
            <div class="ml-2.5">
              <span class="text-xs sm:text-sm font-medium text-slate-800 block">มีอาการปวดศีรษะรุนแรง ตามัว ตาพร่า หรือแน่นหน้าอกร่วมด้วย</span>
              <span class="text-[11px] text-slate-500">คัดกรองภาวะความดันโลหิตสูงรุนแรงเฉียบพลัน</span>
            </div>
          </label>
        </div>

        <!-- 2.3 ประวัติอุบัติเหตุกระแทก (Progressive Disclosure) -->
        <div class="border border-slate-200 rounded-xl p-3 bg-white hover:border-medical-300 transition">
          <label class="flex items-start cursor-pointer">
            <input type="checkbox" id="epistaxisTraumaParent"
              onchange="toggleEpistaxisGroup('epistaxisTraumaSub', this.checked)"
              class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
            <div class="ml-3">
              <span class="text-xs sm:text-sm font-semibold text-slate-800 block">มีประวัติได้รับอุบัติเหตุกระแทกที่ใบหน้าหรือศีรษะก่อนเลือดออก</span>
              <span class="text-[11px] text-slate-500 font-normal block mt-0.5">เช่น ถูกชกต่อย รถล้ม ตกจากที่สูง หรือของแข็งกระแทกใบหน้า</span>
            </div>
          </label>
          <div id="epistaxisTraumaSub" class="hidden pl-7 pt-2.5 mt-2 border-t border-slate-100 space-y-2.5 text-xs">
            <div>
              <label class="block text-slate-700 font-medium mb-1">ระบุเหตุการณ์อุบัติเหตุ (ช่องกรอกอิสระ):</label>
              <input type="text" id="epistaxisTraumaDetails" placeholder="เช่น ถูกชกต่อย, รถจักรยานยนต์ล้ม, ของแข็งกระแทกหน้า"
                class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-medical-500">
            </div>
            <label class="flex items-center p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
              <input type="checkbox" name="epistaxisTraumaSigns" value="trauma_csf_leak_rhinorrhea" class="text-medical-600 mr-2 rounded">
              <span>มีน้ำใสๆ ไหลปนออกมาจากจมูกคล้ายน้ำมูกแต่ไม่ข้น</span>
            </label>
            <label class="flex items-center p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
              <input type="checkbox" name="epistaxisTraumaSigns" value="trauma_raccoon_eyes" class="text-medical-600 mr-2 rounded">
              <span>มีรอยฟกช้ำม่วงคล้ำรอบตาทั้งสองข้าง หรือหลังใบหู</span>
            </label>
            <label class="flex items-center p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
              <input type="checkbox" name="epistaxisTraumaSigns" value="trauma_nasal_deformity" class="text-medical-600 mr-2 rounded">
              <span>กระดูกดั้งจมูกเบี้ยว ผิดรูป</span>
            </label>
          </div>
        </div>
      </div>

      <!-- ส่วนที่ 3: สัญญาณเตือน สภาวะอันตราย (Progressive Parent Checkboxes) -->
      <div class="space-y-3 mb-6 border-t border-slate-100 pt-5">
        <h3 class="text-sm font-semibold text-slate-800 flex items-center">
          <span class="w-2 h-2 rounded-full bg-rose-500 mr-2"></span>
          3. สัญญาณเตือน สภาวะอันตราย
        </h3>
        <p class="text-xs text-slate-500 mb-2">แตะเลือกหัวข้อหลักหากท่านมีอาการในกลุ่มดังกล่าว</p>

        <!-- กลุ่ม 1: อาการผิดปกติเกี่ยวกับการหายใจ หรือการกลืน -->
        <div class="border border-slate-200 rounded-xl p-3 bg-white hover:border-medical-300 transition">
          <label class="flex items-start cursor-pointer">
            <input type="checkbox" id="epistaxisWarnAirwayParent"
              onchange="toggleEpistaxisGroup('epistaxisWarnAirwaySub', this.checked)"
              class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
            <div class="ml-3">
              <span class="text-xs sm:text-sm font-semibold text-slate-800 block">มีปัญหาการหายใจ หรือสำลักเลือด</span>
              <span class="text-[11px] text-slate-500 font-normal block mt-0.5">สำลักเลือด หายใจติดขัด หรือรู้สึกแน่นคอ</span>
            </div>
          </label>
          <div id="epistaxisWarnAirwaySub" class="hidden pl-7 pt-2.5 mt-2 border-t border-slate-100 space-y-2 text-xs">
            <label class="flex items-center p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
              <input type="checkbox" name="epistaxisWarningSigns" value="warn_choking_swallow" class="text-medical-600 mr-2 rounded">
              <span>สำลักเลือด หรือกลืนลำบาก</span>
            </label>
            <label class="flex items-center p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
              <input type="checkbox" name="epistaxisWarningSigns" value="warn_stridor_airway_tight" class="text-medical-600 mr-2 rounded">
              <span>หายใจติดขัด หายใจมีเสียงหวีด หรือรู้สึกแน่นคอแทบหายใจไม่ออก</span>
            </label>
          </div>
        </div>

        <!-- กลุ่ม 2: อาการหน้ามืด วูบ หรือมีอาการช็อก -->
        <div class="border border-slate-200 rounded-xl p-3 bg-white hover:border-medical-300 transition">
          <label class="flex items-start cursor-pointer">
            <input type="checkbox" id="epistaxisWarnShockParent"
              onchange="toggleEpistaxisGroup('epistaxisWarnShockSub', this.checked)"
              class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
            <div class="ml-3">
              <span class="text-xs sm:text-sm font-semibold text-slate-800 block">หน้ามืด เวียนศีรษะรุนแรง หรือตัวเย็น</span>
              <span class="text-[11px] text-slate-500 font-normal block mt-0.5">อาการจากการสูญเสียเลือดมากหรือความดันตก</span>
            </div>
          </label>
          <div id="epistaxisWarnShockSub" class="hidden pl-7 pt-2.5 mt-2 border-t border-slate-100 space-y-2 text-xs">
            <label class="flex items-center p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
              <input type="checkbox" name="epistaxisWarningSigns" value="warn_dizziness_presyncope" class="text-medical-600 mr-2 rounded">
              <span>หน้ามืด เวียนศีรษะ วูบ หรือหมดสติไปชั่วขณะ</span>
            </label>
            <label class="flex items-center p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
              <input type="checkbox" name="epistaxisWarningSigns" value="warn_profuse_sweat_cold_shock" class="text-medical-600 mr-2 rounded">
              <span>เหงื่อแตกท่วมตัว ผิวหนังซีดเย็น หรือใจสั่นรัวเร็วผิดปกติ</span>
            </label>
          </div>
        </div>

        <!-- กลุ่ม 3: กลุ่มอาการเลือดออกผิดปกติที่ตำแหน่งอื่น -->
        <div class="border border-slate-200 rounded-xl p-3 bg-white hover:border-medical-300 transition">
          <label class="flex items-start cursor-pointer">
            <input type="checkbox" id="epistaxisWarnBleedingParent"
              onchange="toggleEpistaxisGroup('epistaxisWarnBleedingSub', this.checked)"
              class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
            <div class="ml-3">
              <span class="text-xs sm:text-sm font-semibold text-slate-800 block">มีเลือดออกผิดปกติที่ตำแหน่งอื่นร่วมด้วย</span>
              <span class="text-[11px] text-slate-500 font-normal block mt-0.5">จุดจ้ำเลือด เลือดออกตามไรฟัน ปัสสาวะหรืออุจจาระผิดปกติ</span>
            </div>
          </label>
          <div id="epistaxisWarnBleedingSub" class="hidden pl-7 pt-2.5 mt-2 border-t border-slate-100 space-y-2 text-xs">
            <label class="flex items-center p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
              <input type="checkbox" name="epistaxisWarningSigns" value="warn_petechiae_purpura" class="text-medical-600 mr-2 rounded">
              <span>มีจุดเลือดออกสีแดงเล็กๆ หรือรอยช้ำจ้ำเลือดตามแขนขาและลำตัว</span>
            </label>
            <label class="flex items-center p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
              <input type="checkbox" name="epistaxisWarningSigns" value="warn_mucosal_or_melena" class="text-medical-600 mr-2 rounded">
              <span>มีเลือดออกตามไรฟัน ปัสสาวะเป็นเลือด หรือถ่ายอุจจาระเป็นสีดำสนิท</span>
            </label>
          </div>
        </div>

        <!-- กลุ่ม 4: อาการผิดปกติเรื้อรังบริเวณใบหน้า คอ หรือการได้ยิน -->
        <div class="border border-slate-200 rounded-xl p-3 bg-white hover:border-medical-300 transition">
          <label class="flex items-start cursor-pointer">
            <input type="checkbox" id="epistaxisWarnHeadNeckParent"
              onchange="toggleEpistaxisGroup('epistaxisWarnHeadNeckSub', this.checked)"
              class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
            <div class="ml-3">
              <span class="text-xs sm:text-sm font-semibold text-slate-800 block">มีก้อนที่คอ หรืออาการผิดปกติเรื้อรังที่ใบหน้าและหู</span>
              <span class="text-[11px] text-slate-500 font-normal block mt-0.5">คลำได้ก้อน คัดจมูกข้างเดียวเรื้อรัง หรือหูอื้อข้างเดียว</span>
            </div>
          </label>
          <div id="epistaxisWarnHeadNeckSub" class="hidden pl-7 pt-2.5 mt-2 border-t border-slate-100 space-y-2 text-xs">
            <label class="flex items-center p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
              <input type="checkbox" name="epistaxisWarningSigns" value="warn_cervical_lymph_node" class="text-medical-600 mr-2 rounded">
              <span>คลำได้ก้อนบวมแข็งที่ลำคอ หรือบริเวณข้างกราม</span>
            </label>
            <label class="flex items-center p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
              <input type="checkbox" name="epistaxisWarningSigns" value="warn_unilateral_obstruction" class="text-medical-600 mr-2 rounded">
              <span>คัดจมูกข้างเดียวเรื้อรัง หรือมีน้ำมูกปนเลือดกลิ่นเหม็น</span>
            </label>
            <label class="flex items-center p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
              <input type="checkbox" name="epistaxisWarningSigns" value="warn_unilateral_tinnitus" class="text-medical-600 mr-2 rounded">
              <span>มีอาการหูอื้อ หรือการได้ยินลดลงข้างเดียวกับที่มีเลือดออก</span>
            </label>
          </div>
        </div>
      </div>

      <!-- ส่วนที่ 4: ปัจจัยกระตุ้นและประวัติการใช้ยา -->
      <div class="space-y-4 mb-6 border-t border-slate-100 pt-5">
        <h3 class="text-sm font-semibold text-slate-800 flex items-center">
          <span class="w-2 h-2 rounded-full bg-rose-500 mr-2"></span>
          4. ปัจจัยกระตุ้นและประวัติการใช้ยา
        </h3>

        <!-- 4.1 ปัจจัยกระตุ้นเฉพาะที่ -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">ปัจจัยกระตุ้นเฉพาะที่</label>
          <div class="space-y-1.5">
            <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition">
              <input type="checkbox" name="epistaxisTriggers" value="trig_nose_picking" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <span class="ml-2.5 text-xs sm:text-sm font-medium text-slate-800">ล้วง แคะ แกะ เกา หรือสั่งน้ำมูกแรงๆ ในโพรงจมูก</span>
            </label>
            <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition">
              <input type="checkbox" name="epistaxisTriggers" value="trig_nasal_spray_dry_air" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <span class="ml-2.5 text-xs sm:text-sm font-medium text-slate-800">เพิ่งใช้ยาพ่นจมูก หรือสัมผัสอากาศแห้ง/เย็นจัด</span>
            </label>
            <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition">
              <input type="checkbox" name="epistaxisTriggers" value="trig_spontaneous" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <span class="ml-2.5 text-xs sm:text-sm font-medium text-slate-800">ไม่มีปัจจัยกระตุ้นชัดเจน (อยู่ดีๆ เลือดก็ไหลออกมาเอง)</span>
            </label>
          </div>
        </div>

        <!-- 4.2 การใช้ยาที่มีผลต่อการแข็งตัวของเลือด -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">การใช้ยาที่มีผลต่อการแข็งตัวของเลือด</label>
          <div class="space-y-1.5">
            <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition">
              <input type="checkbox" name="epistaxisMeds" value="anticoagulant_warfarin"
                onchange="handleEpistaxisMedChange(this)"
                class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <span class="ml-2.5 text-xs sm:text-sm font-medium text-slate-800">ยาต้านการแข็งตัวของเลือด (เช่น Warfarin, Eliquis, Xarelto, Pradaxa)</span>
            </label>
            <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition">
              <input type="checkbox" name="epistaxisMeds" value="antiplatelet_aspirin"
                onchange="handleEpistaxisMedChange(this)"
                class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <span class="ml-2.5 text-xs sm:text-sm font-medium text-slate-800">ยาต้านเกล็ดเลือด (เช่น Aspirin, Clopidogrel / Plavix)</span>
            </label>
            <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition">
              <input type="checkbox" name="epistaxisMeds" value="meds_unknown"
                onchange="handleEpistaxisMedChange(this)"
                class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <span class="ml-2.5 text-xs sm:text-sm font-medium text-slate-800">มียาประจำตัว แต่ไม่แน่ใจ / ไม่ทราบชื่อยาที่ใช้</span>
            </label>
            <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition">
              <input type="checkbox" name="epistaxisMeds" value="none"
                onchange="handleEpistaxisMedChange(this)"
                class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <span class="ml-2.5 text-xs sm:text-sm font-medium text-slate-800">ไม่ได้รับประทานยากลุ่มนี้</span>
            </label>
          </div>
        </div>

        <!-- 4.3 โรคประจำตัวที่เกี่ยวข้อง -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">โรคประจำตัวที่เกี่ยวข้อง</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition">
              <input type="checkbox" name="epistaxisUnderlying" value="htn" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <span class="ml-2.5 text-xs sm:text-sm font-medium text-slate-800">โรคความดันโลหิตสูง</span>
            </label>
            <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition">
              <input type="checkbox" name="epistaxisUnderlying" value="cirrhosis" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <span class="ml-2.5 text-xs sm:text-sm font-medium text-slate-800">โรคตับแข็ง หรือภาวะตับวายเรื้อรัง</span>
            </label>
            <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition">
              <input type="checkbox" name="epistaxisUnderlying" value="esrd" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <span class="ml-2.5 text-xs sm:text-sm font-medium text-slate-800">โรคไตเรื้อรัง หรือกำลังฟอกไต</span>
            </label>
            <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition">
              <input type="checkbox" name="epistaxisUnderlying" value="coagulopathy" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <span class="ml-2.5 text-xs sm:text-sm font-medium text-slate-800">โรคเลือดผิดปกติ หรือเกล็ดเลือดต่ำ</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  `,

  // --- Lifecycle Hooks ---
  init: function() {
    if (typeof lucide !== 'undefined') lucide.createIcons();
  },

  collectIntake: function(ctx = {}) {
    const durVal = parseInt(document.getElementById('epistaxisDurationVal')?.value, 10);
    const durUnit = document.getElementById('epistaxisDurationUnit')?.value || 'minutes';

    const getRadio = (name) => {
      const el = document.querySelector(`input[name="${name}"]:checked`);
      return el ? el.value : null;
    };
    const getChecks = (name) => {
      return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(el => el.value);
    };

    const side = getRadio('epistaxisSide');
    const activeStatus = getRadio('epistaxisActiveStatus');
    const recurrence = getRadio('epistaxisRecurrence');
    const volume = getRadio('epistaxisVolume');

    const direction = getChecks('epistaxisDirection');
    const acuteCranial = getChecks('epistaxisAcuteCranial');

    const traumaChecked = document.getElementById('epistaxisTraumaParent')?.checked || false;
    const traumaDetails = document.getElementById('epistaxisTraumaDetails')?.value?.trim() || '';
    const traumaSigns = getChecks('epistaxisTraumaSigns');

    const warningSigns = getChecks('epistaxisWarningSigns');
    const triggers = getChecks('epistaxisTriggers');
    const meds = getChecks('epistaxisMeds');
    const underlying = getChecks('epistaxisUnderlying');
    const otherSymptomsFree = document.getElementById('sx_other_free')?.value?.trim() || ctx.otherSymptomsFree || '';

    const rec = {
      id: ctx.recordId || ctx.id,
      queue_number: ctx.queueNumber || ctx.queue_number,
      hn: ctx.randomHn || ctx.hn,
      name: ctx.patientName || ctx.name,
      age: ctx.patientAge !== undefined ? ctx.patientAge : ctx.age,
      gender: ctx.gender,
      chief_complaint: 'epistaxis',
      chief_complaint_title: 'เลือดกำเดาไหล',
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

      epistaxisSide: side,
      epistaxisActiveStatus: activeStatus,
      epistaxisRecurrence: recurrence,
      epistaxisVolume: volume,
      epistaxisDirection: direction,
      epistaxisAcuteCranial: acuteCranial,
      epistaxisTrauma: traumaChecked,
      epistaxisTraumaDetails: traumaDetails,
      epistaxisTraumaSigns: traumaSigns,
      epistaxisWarningSigns: warningSigns,
      epistaxisTriggers: triggers,
      epistaxisMeds: meds,
      epistaxisUnderlying: underlying
    };

    updateEpistaxisOutputs(rec);
    return rec;
  },

  collectFormData: function(ctx = {}) {
    return this.collectIntake(ctx);
  },

  hydrateForm: function(data = {}) {
    if (data.durationVal) {
      const valEl = document.getElementById('epistaxisDurationVal');
      if (valEl) valEl.value = data.durationVal;
    }
    if (data.durationUnit) {
      const unitEl = document.getElementById('epistaxisDurationUnit');
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

    setRadio('epistaxisSide', data.epistaxisSide);
    setRadio('epistaxisActiveStatus', data.epistaxisActiveStatus);
    setRadio('epistaxisRecurrence', data.epistaxisRecurrence);
    setRadio('epistaxisVolume', data.epistaxisVolume);

    setChecks('epistaxisDirection', data.epistaxisDirection);
    setChecks('epistaxisAcuteCranial', data.epistaxisAcuteCranial);

    if (data.epistaxisTrauma) {
      const traumaParent = document.getElementById('epistaxisTraumaParent');
      if (traumaParent) {
        traumaParent.checked = true;
        toggleEpistaxisGroup('epistaxisTraumaSub', true);
      }
      if (data.epistaxisTraumaDetails) {
        const dEl = document.getElementById('epistaxisTraumaDetails');
        if (dEl) dEl.value = data.epistaxisTraumaDetails;
      }
      setChecks('epistaxisTraumaSigns', data.epistaxisTraumaSigns);
    }

    if (Array.isArray(data.epistaxisWarningSigns) && data.epistaxisWarningSigns.length > 0) {
      const ws = data.epistaxisWarningSigns;
      if (ws.some(k => k === 'warn_choking_swallow' || k === 'warn_stridor_airway_tight')) {
        const p = document.getElementById('epistaxisWarnAirwayParent');
        if (p) { p.checked = true; toggleEpistaxisGroup('epistaxisWarnAirwaySub', true); }
      }
      if (ws.some(k => k === 'warn_dizziness_presyncope' || k === 'warn_profuse_sweat_cold_shock')) {
        const p = document.getElementById('epistaxisWarnShockParent');
        if (p) { p.checked = true; toggleEpistaxisGroup('epistaxisWarnShockSub', true); }
      }
      if (ws.some(k => k === 'warn_petechiae_purpura' || k === 'warn_mucosal_or_melena')) {
        const p = document.getElementById('epistaxisWarnBleedingParent');
        if (p) { p.checked = true; toggleEpistaxisGroup('epistaxisWarnBleedingSub', true); }
      }
      if (ws.some(k => k === 'warn_cervical_lymph_node' || k === 'warn_unilateral_obstruction' || k === 'warn_unilateral_tinnitus')) {
        const p = document.getElementById('epistaxisWarnHeadNeckParent');
        if (p) { p.checked = true; toggleEpistaxisGroup('epistaxisWarnHeadNeckSub', true); }
      }
      setChecks('epistaxisWarningSigns', data.epistaxisWarningSigns);
    }

    setChecks('epistaxisTriggers', data.epistaxisTriggers);
    setChecks('epistaxisMeds', data.epistaxisMeds);
    setChecks('epistaxisUnderlying', data.epistaxisUnderlying);
  },

  isRedFlag: function(patient) {
    const rfs = evaluateEpistaxisRedFlags(patient);
    return rfs.length > 0;
  },

  evaluateRedFlags: evaluateEpistaxisRedFlags,
  updateOutputs: updateEpistaxisOutputs,
  renderRapidHpi: renderEpistaxisRapidHpi,
  renderNarrative: renderEpistaxisNarrative,
  renderDoctorHpi: renderEpistaxisDoctorHpi,
  generateCds: generateEpistaxisCds,

  // --- Seed Patients Registry ---
  seedPatients: [
    // Case 1: Posterior Epistaxis on Warfarin with Hypertensive Urgency (ESI 2)
    {
      id: 'case-epistaxis-01',
      queue_number: 'E2-101',
      hn: '7890201',
      name: 'นายสมศักดิ์ นาสิกธารา',
      age: 72,
      gender: 'ชาย',
      chief_complaint: 'epistaxis',
      chief_complaint_title: 'เลือดกำเดาไหล',
      timestamp: '2026-11-03T09:30:00.000Z',
      status: 'waiting',
      durationVal: 45,
      durationUnit: 'minutes',
      hospRecordStatus: 'complete',
      underlying: ['ความดันสูง (HT)', 'หัวใจเต้นผิดจังหวะ (AF)'],
      drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร',
      currentMeds: 'Warfarin 3 mg 1 tab po hs, Amlodipine 5 mg 1 tab po od',
      otherSymptomsFree: 'เลือดกำเดาไหลทะลักสองข้าง เลือดไหลรินลงคอตลอดเวลา บีบจมูกแน่น 20 นาทีแล้วไม่หยุด กลืนเลือดจนอาเจียนออกมาเป็นลิ่มเลือด ปวดศีรษะตื้อๆ',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.8, sbp: 185, dbp: 105, bp: '185/105', pr: 98, rr: 22, spo2: 97 },
      esi_level: 2,

      epistaxisSide: 'bilateral',
      epistaxisActiveStatus: 'active',
      epistaxisRecurrence: 'highest_in_life',
      epistaxisVolume: 'heavy_clots',
      epistaxisDirection: ['dripping_throat', 'failed_compression', 'vomited_blood_clots'],
      epistaxisAcuteCranial: ['severe_headache'],
      epistaxisTrauma: false,
      epistaxisTraumaDetails: '',
      epistaxisTraumaSigns: [],
      epistaxisWarningSigns: ['warn_dizziness_presyncope'],
      epistaxisTriggers: ['trig_spontaneous'],
      epistaxisMeds: ['anticoagulant_warfarin'],
      epistaxisUnderlying: ['htn']
    },

    // Case 2: Maxillofacial / Basilar Skull Fracture with CSF Leak (ESI 2)
    {
      id: 'case-epistaxis-02',
      queue_number: 'E2-102',
      hn: '7890202',
      name: 'นายอดิศร บาดเจ็บหน้า',
      age: 26,
      gender: 'ชาย',
      chief_complaint: 'epistaxis',
      chief_complaint_title: 'เลือดกำเดาไหล',
      timestamp: '2026-11-03T10:15:00.000Z',
      status: 'waiting',
      durationVal: 1,
      durationUnit: 'hours',
      hospRecordStatus: 'complete',
      underlying: [],
      drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร',
      currentMeds: 'ไม่มี',
      otherSymptomsFree: 'อุบัติเหตุรถจักรยานยนต์ล้ม หน้ากระแทกแฮนด์รถอย่างแรง เลือดกำเดาไหลสองข้าง มีน้ำใสปนเลือดไหลตลอดเวลา ดั้งจมูกเบี้ยวผิดรูป ช้ำรอบตาสองข้าง',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.6, sbp: 115, dbp: 75, bp: '115/75', pr: 104, rr: 20, spo2: 99 },
      esi_level: 2,

      epistaxisSide: 'bilateral',
      epistaxisActiveStatus: 'active',
      epistaxisRecurrence: 'highest_in_life',
      epistaxisVolume: 'moderate_flow',
      epistaxisDirection: [],
      epistaxisAcuteCranial: [],
      epistaxisTrauma: true,
      epistaxisTraumaDetails: 'อุบัติเหตุรถจักรยานยนต์ล้ม หน้ากระแทกแฮนด์รถอย่างแรง',
      epistaxisTraumaSigns: ['trauma_csf_leak_rhinorrhea', 'trauma_raccoon_eyes', 'trauma_nasal_deformity'],
      epistaxisWarningSigns: [],
      epistaxisTriggers: [],
      epistaxisMeds: ['none'],
      epistaxisUnderlying: []
    },

    // Case 3: Recurrent Unilateral Epistaxis / Suspected Head & Neck Mass (NPC) (ESI 3)
    {
      id: 'case-epistaxis-03',
      queue_number: 'E3-103',
      hn: '7890203',
      name: 'นางกานดา ก้อนคอบวม',
      age: 54,
      gender: 'หญิง',
      chief_complaint: 'epistaxis',
      chief_complaint_title: 'เลือดกำเดาไหล',
      timestamp: '2026-11-03T11:00:00.000Z',
      status: 'waiting',
      durationVal: 3,
      durationUnit: 'weeks',
      hospRecordStatus: 'complete',
      underlying: [],
      drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร',
      currentMeds: 'ไม่มี',
      otherSymptomsFree: 'เลือดกำเดาไหลข้างขวาเป็นๆ หายๆ มา 3 สัปดาห์ คัดจมูกข้างขวาข้างเดียวเรื้อรัง หูอื้อข้างขวา คลำได้ก้อนบวมที่คอด้านขวา',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.7, sbp: 128, dbp: 82, bp: '128/82', pr: 76, rr: 18, spo2: 99 },
      esi_level: 3,

      epistaxisSide: 'right',
      epistaxisActiveStatus: 'stopped',
      epistaxisRecurrence: 'recurrent_episodes',
      epistaxisVolume: 'mild_oozing',
      epistaxisDirection: [],
      epistaxisAcuteCranial: [],
      epistaxisTrauma: false,
      epistaxisTraumaDetails: '',
      epistaxisTraumaSigns: [],
      epistaxisWarningSigns: ['warn_cervical_lymph_node', 'warn_unilateral_obstruction', 'warn_unilateral_tinnitus'],
      epistaxisTriggers: ['trig_spontaneous'],
      epistaxisMeds: ['none'],
      epistaxisUnderlying: []
    },

    // Case 4: Simple Anterior Epistaxis from Digital Trauma (ESI 4)
    {
      id: 'case-epistaxis-04',
      queue_number: 'E4-104',
      hn: '7890204',
      name: 'ด.ช.ธนภัทร แคะจมูก',
      age: 8,
      gender: 'ชาย',
      chief_complaint: 'epistaxis',
      chief_complaint_title: 'เลือดกำเดาไหล',
      timestamp: '2026-11-03T11:30:00.000Z',
      status: 'waiting',
      durationVal: 20,
      durationUnit: 'minutes',
      hospRecordStatus: 'self',
      underlying: [],
      drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร',
      currentMeds: 'ไม่มี',
      otherSymptomsFree: 'เลือดกำเดาไหลข้างซ้ายหลังแคะขี้มูกในห้องแอร์ กดบีบปีกจมูก 10 นาทีแล้วเลือดหยุดสนิท ไม่มีอาการผิดปกติอื่น',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.5, sbp: 100, dbp: 65, bp: '100/65', pr: 84, rr: 18, spo2: 100 },
      esi_level: 4,

      epistaxisSide: 'left',
      epistaxisActiveStatus: 'stopped',
      epistaxisRecurrence: 'recurrent_episodes',
      epistaxisVolume: 'mild_oozing',
      epistaxisDirection: [],
      epistaxisAcuteCranial: [],
      epistaxisTrauma: false,
      epistaxisTraumaDetails: '',
      epistaxisTraumaSigns: [],
      epistaxisWarningSigns: [],
      epistaxisTriggers: ['trig_nose_picking'],
      epistaxisMeds: ['none'],
      epistaxisUnderlying: ['nose_picking_digital_trauma']
    }
  ]
};

// Register module in Ratchaburi ER Core Registry
if (typeof registerCcModule === 'function') {
  registerCcModule(epistaxisModule);
} else if (typeof window !== 'undefined' && typeof window.registerCcModule === 'function') {
  window.registerCcModule(epistaxisModule);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = epistaxisModule;
}
