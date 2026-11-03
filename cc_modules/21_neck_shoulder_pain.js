// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 21_neck_shoulder_pain.js
// อาการนำ: ปวดต้นคอ / บ่า / หลังช่วงบน (Neck, Shoulder & Upper Back Pain)
// รองรับ Zero Default Bias, Progressive Disclosure, Universal Date/Time,
// Rapid Note De-duplication, และ TDD Core Guard
// =========================================================================

// --- Pain Score Touch State Tracking ---
let neckpainPainScoreTouched = false;

function clearNeckpainPainScore() {
  neckpainPainScoreTouched = false;
  const slider = document.getElementById('neckpainPainScore');
  if (slider) slider.value = 0;
  const emojiEl = document.getElementById('neckpainPainScoreEmoji');
  const textEl = document.getElementById('neckpainPainScoreText');
  const badgeEl = document.getElementById('neckpainPainScoreBadge');
  const clearBtn = document.getElementById('neckpainPainScoreClearBtn');
  if (emojiEl) emojiEl.textContent = '⚪';
  if (textEl) textEl.textContent = 'ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)';
  if (badgeEl) badgeEl.className = 'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all';
  if (clearBtn) clearBtn.classList.add('hidden');
}

function handleNeckpainPainScoreChange(val) {
  neckpainPainScoreTouched = true;
  const num = parseInt(val, 10);
  const emojiEl = document.getElementById('neckpainPainScoreEmoji');
  const textEl = document.getElementById('neckpainPainScoreText');
  const badgeEl = document.getElementById('neckpainPainScoreBadge');
  const clearBtn = document.getElementById('neckpainPainScoreClearBtn');
  if (clearBtn) clearBtn.classList.remove('hidden');
  if (!emojiEl || !textEl || !badgeEl) return;

  let emoji = '😐';
  let label = 'ปวดปานกลาง';
  let badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';

  if (num === 0) {
    emoji = '😊';
    label = 'สบายดี (ไม่ปวดเลย)';
    badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  } else if (num <= 3) {
    emoji = '🙂';
    label = 'ปวดเล็กน้อย (ทนได้)';
    badgeClass = 'bg-lime-100 text-lime-800 border-lime-300';
  } else if (num <= 6) {
    emoji = '😐';
    label = 'ปวดปานกลาง (รบกวนสมาธิ)';
    badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
  } else if (num <= 8) {
    emoji = '😣';
    label = 'ปวดรุนแรง (ทนแทบไม่ไหว)';
    badgeClass = 'bg-orange-100 text-orange-800 border-orange-300';
  } else {
    emoji = '😫';
    label = 'ปวดรุนแรงที่สุดในชีวิต';
    badgeClass = 'bg-rose-100 text-rose-800 border-rose-300';
  }

  emojiEl.textContent = emoji;
  textEl.textContent = `${num}/10 คะแนน - ${label}`;
  badgeEl.className = `inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-auto transition-all ${badgeClass}`;
}

// --- Toggle UI Helper Functions ---
function toggleNeckpainSideGroup(groupId, isVisible) {
  const el = document.getElementById(groupId);
  if (el) {
    el.classList.toggle('hidden', !isVisible);
    if (!isVisible) {
      el.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    }
  }
}

function toggleNeckpainRadiationSub(isVisible) {
  const el = document.getElementById('neckpainRadiationSub');
  if (el) {
    el.classList.toggle('hidden', !isVisible);
    if (!isVisible) {
      el.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    }
  }
}

function toggleNeckpainWarningGroup(groupId, isVisible) {
  const el = document.getElementById(groupId);
  if (el) {
    el.classList.toggle('hidden', !isVisible);
    if (!isVisible) {
      el.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    }
  }
}

function toggleNeckpainTraumaSub(isVisible) {
  const el = document.getElementById('neckpainTraumaSub');
  if (el) {
    el.classList.toggle('hidden', !isVisible);
    if (!isVisible) {
      el.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
      const otherWrap = document.getElementById('neckpainTraumaOtherWrap');
      if (otherWrap) otherWrap.classList.add('hidden');
      const otherInput = document.getElementById('neckpainTraumaOtherText');
      if (otherInput) otherInput.value = '';
    }
  }
}

function toggleNeckpainTraumaOther(isVisible) {
  const el = document.getElementById('neckpainTraumaOtherWrap');
  if (el) {
    el.classList.toggle('hidden', !isVisible);
    if (!isVisible) {
      const input = document.getElementById('neckpainTraumaOtherText');
      if (input) input.value = '';
    }
  }
}

// --- Clinical Red Flag Evaluator ---
function evaluateNeckpainRedFlags(patient) {
  const rfs = [];
  if (!patient) return rfs;

  const warnSigns = Array.isArray(patient.neckpainWarningSigns) ? patient.neckpainWarningSigns : [];
  const traumaTypes = Array.isArray(patient.neckpainTraumaTypes) ? patient.neckpainTraumaTypes : [];
  const radLocs = Array.isArray(patient.neckpainRadLoc) ? patient.neckpainRadLoc : [];
  const charTypes = Array.isArray(patient.neckpainChar) ? patient.neckpainChar : [];
  const locs = Array.isArray(patient.neckpainLoc) ? patient.neckpainLoc : [];
  const vs = patient.vital_signs || {};
  const sbp = typeof vs.sbp === 'number' ? vs.sbp : parseFloat(vs.sbp);
  const pr = typeof vs.pr === 'number' ? vs.pr : parseFloat(vs.pr);
  const bt = typeof vs.bt === 'number' ? vs.bt : parseFloat(vs.bt);
  const shockIndex = (sbp && pr) ? (pr / sbp) : 0;
  const isHypotensive = (sbp && sbp < 90) || (shockIndex >= 0.9);

  // 1. Vertebral / Carotid Artery Dissection with Brainstem/Cerebral Ischemia (ESI 1)
  const isSudden = patient.neckpainOnsetMode === 'sudden_severe';
  const hasOcciputHead = radLocs.includes('rad_head_occiput') || locs.includes('suboccipital_posterior') || locs.includes('lateral_neck');
  const hasNeuroDissection = warnSigns.includes('diplopia_ptosis_horner') || warnSigns.includes('facial_numb_speech') || warnSigns.includes('ataxia_vertigo_syncope');

  if (hasNeuroDissection && (isSudden || hasOcciputHead)) {
    rfs.push({
      key: 'rf_vertebral_carotid_dissection',
      level: 1,
      textTh: 'สงสัยหลอดเลือดแดงคอหรือท้ายทอยฉีกขาดร่วมกับภาวะสมองขาดเลือด (Vertebral / Carotid Artery Dissection with Stroke)',
      risk: 'วิกฤตเฉียบพลัน: เสี่ยงหลอดเลือดสมองขาดเลือดรุนแรง, Stat CT/CTA Brain & Neck Whole Cervical Vessels, ปรึกษาอายุรแพทย์ประสาท/ศัลยแพทย์หลอดเลือดทันที'
    });
  }

  // 2. Suspected ACS / Stanford Type A Aortic Dissection with Interscapular / Neck Radiation (ESI 1)
  const hasChestRad = radLocs.includes('rad_jaw_chest') || radLocs.includes('rad_interscapular_tearing');
  const isTearing = charTypes.includes('tearing_ripping');
  const hasChestSweat = warnSigns.includes('chest_dyspnea_sweat');

  if (hasChestSweat || (hasChestRad && (isTearing || isHypotensive || isSudden))) {
    rfs.push({
      key: 'rf_acs_aortic_dissection_referred',
      level: 1,
      textTh: 'สงสัยภาวะหลอดเลือดหัวใจอุดกั้นเฉียบพลัน หรือหลอดเลือดแดงใหญ่ฉีกขาดทะลุสะบัก (Suspected ACS / Type A Aortic Dissection)',
      risk: 'วิกฤตระบบไหลเวียน: Stat 12-lead EKG, Trop-T, เปิดเส้น IV 2 เส้น, สารน้ำ, Stat CTA Aorta หากสงสัย Dissection และเตรียมทีมกู้ชีพ'
    });
  }

  // 3. Cervical Spondylotic Myelopathy (CSM) / Acute Spinal Cord Compression (ESI 2)
  const hasClumsyHand = warnSigns.includes('hand_clumsy_weak');
  const hasSpasticGait = warnSigns.includes('gait_ataxia_spastic');
  const hasArmNumb = warnSigns.includes('arm_numbness_fingers');

  if (hasClumsyHand || (hasSpasticGait && hasArmNumb)) {
    rfs.push({
      key: 'rf_cervical_myelopathy',
      level: 2,
      textTh: 'สงสัยภาวะไขสันหลังระดับคอถูกกดทับวิกฤต (Cervical Spondylotic Myelopathy - CSM)',
      risk: 'เสี่ยงอัมพาตทั้งสี่รยางค์ถาวร: ตรวจ Motor power C5-T1, Deep tendon reflexes, Hoffmann sign, Stat MRI Cervical Spine, ปรึกษาศัลยแพทย์กระดูกสันหลัง'
    });
  }

  // 4. Meningitis / Retropharyngeal Abscess / Deep Neck Space Infection (ESI 2)
  const hasFever = warnSigns.includes('fever_chills') || (bt && bt >= 38.5);
  const hasAirwayDysphagia = warnSigns.includes('dysphagia_stridor');
  const hasNuchalStiff = warnSigns.includes('nuchal_rigidity_headache');
  const hasLocalPus = warnSigns.includes('local_mass_wound_pus');

  if (hasAirwayDysphagia || (hasFever && (hasNuchalStiff || hasLocalPus))) {
    rfs.push({
      key: 'rf_cervical_infection_airway',
      level: 2,
      textTh: 'สงสัยการติดเชื้อรุนแรง คอแข็ง หรือฝีในช่องคอกดเบียดทางเดินหายใจ (Meningitis / Retropharyngeal Abscess / Airway Threat)',
      risk: 'เสี่ยงอุดกั้นทางเดินหายใจและติดเชื้อในกระแสเลือด: ประเมิน Stridor/Airway ทันที, เตรียมอุปกรณ์ใส่ท่อช่วยหายใจ, Stat CT Soft Tissue Neck with Contrast, Hemoculture และเริ่ม IV Antibiotics'
    });
  }

  // 5. Unstable Cervical Spine Trauma / High-Risk Canadian C-Spine (ESI 2)
  const isHighImpactTrauma = traumaTypes.includes('high_impact_mva_whiplash') || traumaTypes.includes('fall_diving_head_neck');
  const hasWeakness = warnSigns.includes('arm_weakness_abduction');
  const isElderlyTrauma = isHighImpactTrauma && (patient.age >= 65 || hasWeakness);

  if (isHighImpactTrauma || isElderlyTrauma) {
    rfs.push({
      key: 'rf_cervical_trauma_unstable',
      level: 2,
      textTh: 'สงสัยกระดูกต้นคอหักหรือบาดเจ็บไขสันหลังชนิดไม่มั่นคง (Cervical Spine Fracture / Cord Injury - Canadian C-Spine High Risk)',
      risk: 'อันตรายต่อไขสันหลัง: ใส่ Hard Cervical Collar ทันที, ห้ามขยับดัดคอ, Spinal Immobilization (Log-roll), Stat CT Cervical Spine'
    });
  }

  // 6. Acute Cervical Radiculopathy with Motor Deficit (ESI 3)
  if (hasWeakness) {
    rfs.push({
      key: 'rf_cervical_radiculopathy_motor',
      level: 3,
      textTh: 'รากประสาทคอถูกกดทับร่วมกับกล้ามเนื้อแขนอ่อนแรง (Cervical Radiculopathy with Motor Deficit)',
      risk: 'ประเมิน Motor power แขน/ข้อมือ/นิ้วมือ C5-T1, พักการใช้งานคอ, ให้ยาแก้ปวดลดการอักเสบ และพิจารณาส่งต่อศัลยแพทย์กระดูกและข้อ'
    });
  }

  // 7. Cervical Spine Malignancy / Metastasis Risk (ESI 2-3)
  const hasCancer = warnSigns.includes('cancer_weight_loss');
  if (hasCancer) {
    rfs.push({
      key: 'rf_cervical_malignancy',
      level: 2,
      textTh: 'สงสัยมะเร็งแพร่กระจายมายังกระดูกต้นคอ (Cervical Spine Malignancy / Metastasis)',
      risk: 'ตรวจ Plain Film C-Spine, พิจารณา MRI C-Spine เพื่อประเมิน Cord compression, ปรึกษาแพทย์เฉพาะทาง'
    });
  }

  return rfs;
}

// --- Clinical Decision Support Generator ---
function generateNeckpainCds(patient, context) {
  const { rfs, ddxList, workupList, managementList } = context;
  const radLocs = Array.isArray(patient.neckpainRadLoc) ? patient.neckpainRadLoc : [];

  const hasDissection = rfs.some(r => r.key === 'rf_vertebral_carotid_dissection');
  const hasAcsAorta = rfs.some(r => r.key === 'rf_acs_aortic_dissection_referred');
  const hasCsm = rfs.some(r => r.key === 'rf_cervical_myelopathy');
  const hasInfection = rfs.some(r => r.key === 'rf_cervical_infection_airway');
  const hasTrauma = rfs.some(r => r.key === 'rf_cervical_trauma_unstable');
  const hasRadiculopathy = rfs.some(r => r.key === 'rf_cervical_radiculopathy_motor') || radLocs.includes('rad_arm_fingers');

  if (hasDissection) {
    ddxList.push('1. Vertebral / Carotid Artery Dissection with Posterior Circulation Stroke / TIA');
    ddxList.push('2. Subarachnoid Hemorrhage (SAH) / Thunderclap Headache');
    ddxList.push('3. Cervicogenic Headache with Acute Labyrinthitis');
    workupList.push('Stat CT Brain Non-contrast & CTA Whole Cervical & Intracranial Vessels');
    workupList.push('ตรวจประเมินระบบประสาทครบ 12 คู่ (Cranial nerves), Horner syndrome, Ataxia');
    workupList.push('เปิดเส้น IV, สารน้ำ, เฝ้าระวังความดันโลหิตและสัญญาณชีพทุก 15 นาที');
    managementList.push('งดน้ำและอาหาร (NPO) ทันที');
    managementList.push('ปรึกษา อายุรแพทย์ประสาทวิทยา (Neurologist) / ศัลยแพทย์หลอดเลือดด่วน');
    managementList.push('ห้ามบิด ดัด ดึง หรือกดนวดบริเวณต้นคอโดยเด็ดขาด');
    return;
  }

  if (hasAcsAorta) {
    ddxList.push('1. Acute Coronary Syndrome (NSTEMI / STEMI) with Atypical Neck/Shoulder Radiation');
    ddxList.push('2. Acute Aortic Dissection (Stanford Type A / DeBakey I)');
    ddxList.push('3. Acute Pericarditis / Myocarditis');
    workupList.push('Stat 12-lead EKG ภายใน 10 นาทีแรกรับ');
    workupList.push('เจาะเลือดตรวจ Cardiac Biomarkers: High-sensitivity Troponin-T, CK-MB, CBC, Electrolytes');
    workupList.push('Stat Chest X-ray หรือ CTA Whole Aorta หากสงสัย Aortic dissection');
    managementList.push('เปิดเส้น IV เบอร์ใหญ่ 2 เส้น พร้อมให้ออกซิเจนหาก SpO2 < 94%');
    managementList.push('ให้ยาตามมาตรฐาน ACS (ASA, Clopidogrel, Heparin) ภายหลัง Rule out Aortic Dissection แล้วเท่านั้น');
    managementList.push('ประสานทีมห้องฉุกเฉินและปรึกษาอายุรแพทย์โรคหัวใจทันที');
    return;
  }

  if (hasCsm) {
    ddxList.push('1. Cervical Spondylotic Myelopathy (CSM) with Cord Compression');
    ddxList.push('2. Cervical Spinal Epidural Abscess / Mass compressing Cervical Cord');
    ddxList.push('3. Amyotrophic Lateral Sclerosis (ALS) / Motor Neuron Disease');
    workupList.push('Stat MRI Cervical Spine Whole Spine ประเมินความรุนแรงของการกดทับไขสันหลัง');
    workupList.push('ตรวจประเมิน Hoffmann sign, Inverted radial reflex, Babinski sign, Spastic gait');
    managementList.push('ใส่ Hard/Soft Cervical Collar เพื่อจำกัดการเคลื่อนไหวของคอ');
    managementList.push('งดการดัดดึงหรือบิดคอทุกชนิด');
    managementList.push('ประสานส่งต่อ ศัลยแพทย์กระดูกสันหลัง (Spine Surgeon) เพื่อพิจารณาผ่าตัดคลายการกดทับ');
    return;
  }

  if (hasInfection) {
    ddxList.push('1. Retropharyngeal / Deep Neck Space Abscess (Ludwig Angina / Parapharyngeal)');
    ddxList.push('2. Acute Bacterial Meningitis');
    ddxList.push('3. Acute Epiglottitis / Severe Pharyngotonsillitis with Airway Compromise');
    workupList.push('ประเมินทางเดินหายใจทันที (Airway assessment: Stridor, Drooling, Tripod position)');
    workupList.push('Stat CT Soft Tissue Neck with IV Contrast (เตรียมพร้อมก่อนส่งตรวจหากเสี่ยงทางเดินหายใจ)');
    workupList.push('เพาะเชื้อในเลือด (Hemoculture x 2 bottles), CBC, ESR, hs-CRP');
    managementList.push('เตรียมอุปกรณ์ใส่ท่อช่วยหายใจ (Difficult Airway Cart) ข้างเตียงคนไข้');
    managementList.push('เริ่มยาปฏิชีวนะทางหลอดเลือดดำ (Empiric IV Broad-spectrum Antibiotics) ทันที');
    managementList.push('ปรึกษา ศัลยแพทย์หูคอจมูก (ENT) และแพทย์กู้ชีพฉุกเฉินร่วมดูแล');
    return;
  }

  if (hasTrauma) {
    ddxList.push('1. Acute Cervical Spine Fracture / Subluxation (High-Risk Trauma)');
    ddxList.push('2. Severe Cervical Ligamentous Injury with Instability');
    ddxList.push('3. Traumatic Cervical Disc Herniation');
    workupList.push('ใส่ Hard Cervical Collar ขนาดพอดีทันที และตรึงกระดูกสันหลัง (Spinal Immobilization)');
    workupList.push('Stat CT Cervical Spine with 3D Reconstruction ครอบคลุม C1-T1');
    managementList.push('ห้ามถอด Hard Collar จนกว่าจะได้รับการ Clear C-Spine โดยแพทย์ผู้เชี่ยวชาญ');
    managementList.push('ควบคุมการเคลื่อนไหวด้วยวิธี Log-roll เท่านั้น');
    managementList.push('ปรึกษา ศัลยแพทย์กระดูกและข้อ (Orthopedics) หรือ ประสาทศัลยแพทย์');
    return;
  }

  if (hasRadiculopathy) {
    ddxList.push('1. Cervical Radiculopathy (Herniated Disc C5-C6 / C6-C7)');
    ddxList.push('2. Cervical Spondylosis with Foraminal Stenosis');
    ddxList.push('3. Thoracic Outlet Syndrome / Brachial Plexopathy');
    workupList.push('ตรวจ Spurling test, Shoulder abduction relief test, Motor/Sensory C5, C6, C7, C8, T1');
    workupList.push('พิจารณา Plain Film Cervical Spine AP/Lateral/Oblique');
    managementList.push('ให้ยาบรรเทาอาการปวด: Oral NSAIDs ร่วมกับยาลดปวดประสาท (Pregabalin / Gabapentin)');
    managementList.push('ใส่ Soft Cervical Collar ระยะสั้น (1-2 สัปดาห์) เพื่อพักกล้ามเนื้อ');
    managementList.push('แนะนำหลีกเลี่ยงการก้มเงยคอสุด และนัดตรวจติดตามที่คลินิกกระดูกและข้อ');
    return;
  }

  // Musculoskeletal Strain / MPS (Standard Low-Risk)
  ddxList.push('1. Myofascial Pain Syndrome (MPS) of Upper Trapezius / Levator Scapulae');
  ddxList.push('2. Acute Cervical Strain / Torticollis (ตกหมอน / คอเคล็ด)');
  ddxList.push('3. Postural Neck Pain / Office Syndrome');
  workupList.push('ตรวจคลำหากล้ามเนื้อเกร็งตัว (Trigger points) บริเวณบ่า สะบัก และต้นคอ');
  workupList.push('ตรวจ Range of Motion ของคอ (ก้ม เงย หันซ้ายขวา)');
  managementList.push('ให้ยาแก้ปวดลดการอักเสบ: Oral Paracetamol หรือ Short-course NSAIDs (3-5 วัน)');
  managementList.push('ให้ยาคลายกล้ามเนื้อ (Muscle Relaxants) รับประทานหลังอาหาร');
  managementList.push('แนะนำการประคบอุ่น ยืดเหยียดกล้ามเนื้อ และปรับหลักสรีรศาสตร์ในการทำงาน (Ergonomics)');
}

// --- Register Module to Core Knowledge Base ---
registerCcModule({
  id: 'neck_shoulder_pain',
  recordCc: 'neck_shoulder_pain',
  titleTh: 'ปวดต้นคอ / บ่า / หลังช่วงบน',
  titleEn: 'Neck / Shoulder / Upper back pain',
  icon: 'activity',
  sectionDomId: 'neck_shoulder_painQuestionnaireSection',

  algorithm: {
    chiefComplaint: 'neck_shoulder_pain',
    titleTh: 'ปวดต้นคอ / บ่า / หลังช่วงบน',
    schemaCode: 'neck_shoulder_pain',
    version: '2.0.0',
    redFlagDefinitions: [
      { key: 'rf_vertebral_carotid_dissection', level: 1, textTh: 'Vertebral / Carotid Artery Dissection (สงสัยหลอดเลือดแดงคอฉีกขาดร่วมกับภาวะสมองขาดเลือด)' },
      { key: 'rf_acs_aortic_dissection_referred', level: 1, textTh: 'Acute Coronary Syndrome / Aortic Dissection (สงสัยหลอดเลือดหัวใจอุดกั้นหรือหลอดเลือดใหญ่ฉีกขาดทะลุสะบัก)' },
      { key: 'rf_cervical_myelopathy', level: 2, textTh: 'Cervical Spondylotic Myelopathy (สงสัยไขสันหลังระดับคอถูกกดทับวิกฤต/มือล้า/เดินเซ)' },
      { key: 'rf_cervical_infection_airway', level: 2, textTh: 'Meningitis / Retropharyngeal Abscess (สงสัยติดเชื้อรุนแรง คอแข็ง หรือฝีกดเบียดทางเดินหายใจ)' },
      { key: 'rf_cervical_trauma_unstable', level: 2, textTh: 'Unstable Cervical Spine Trauma (สงสัยกระดูกต้นคอหักหรือบาดเจ็บไขสันหลังชนิดไม่มั่นคง)' },
      { key: 'rf_cervical_radiculopathy_motor', level: 3, textTh: 'Cervical Radiculopathy with Motor Deficit (รากประสาทคอถูกกดทับร่วมกับกล้ามเนื้อแขนอ่อนแรง)' },
      { key: 'rf_cervical_malignancy', level: 2, textTh: 'Cervical Spine Malignancy (สงสัยมะเร็งแพร่กระจายมายังกระดูกต้นคอ)' }
    ]
  },

  // --- HTML Template for Patient Intake Form ---
  formHtml: `
    <div id="neck_shoulder_painQuestionnaireSection" class="hidden space-y-6">

      <!-- CARD 1: ระยะเวลา และตำแหน่งที่ปวด -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="clock" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">1. ระยะเวลาและตำแหน่งที่ปวด (Duration & Location)</h2>
            <p class="text-xs text-slate-500">ข้อมูลเบื้องต้นเกี่ยวกับระยะเวลาและตำแหน่งที่ท่านมีอาการปวด</p>
          </div>
        </div>

        <div class="space-y-4">
          <!-- 1.1 ระยะเวลาที่มีอาการ -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              มีอาการปวดมานานเท่าไรแล้ว?
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div class="col-span-1 sm:col-span-2">
                <input type="number" id="neckpainDurationVal" min="1" max="1000" placeholder="เช่น 2"
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm placeholder:text-slate-400">
              </div>
              <div class="col-span-1">
                <select id="neckpainDurationUnit"
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm">
                  <option value="minutes">นาที</option>
                  <option value="hours">ชั่วโมง</option>
                  <option value="days">วัน</option>
                  <option value="weeks">สัปดาห์</option>
                  <option value="months">เดือน</option>
                  <option value="years">ปี</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 1.2 ตำแหน่งที่ปวด (เลือกได้หลายข้อ พร้อมระบุข้าง) -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              ตำแหน่งที่ปวด (เลือกได้หลายข้อ และระบุข้าง)
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <!-- 1. ต้นคอด้านหลัง -->
              <div class="border border-slate-200 rounded-xl p-3 bg-white hover:border-medical-300 transition">
                <label class="flex items-start cursor-pointer">
                  <input type="checkbox" name="neckpainLoc" value="suboccipital_posterior"
                    onchange="toggleNeckpainSideGroup('neckPostSideGroup', this.checked)"
                    class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                  <div class="ml-3">
                    <span class="text-xs sm:text-sm font-semibold text-slate-800 block">ต้นคอด้านหลัง</span>
                    <span class="text-[11px] text-slate-500 font-normal block mt-0.5">บริเวณท้ายทอยลงมาถึงหลังคอ</span>
                  </div>
                </label>
                <div id="neckPostSideGroup" class="hidden pl-7 pt-2.5 mt-2 border-t border-slate-100 flex items-center space-x-2 text-xs">
                  <span class="text-slate-500 text-[11px] font-medium mr-1">ข้างที่ปวด:</span>
                  <label class="inline-flex items-center px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer">
                    <input type="checkbox" name="neckpainLocPostSide" value="left" class="mr-1.5 h-3.5 w-3.5 text-medical-600 rounded">
                    <span>ซ้าย</span>
                  </label>
                  <label class="inline-flex items-center px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer">
                    <input type="checkbox" name="neckpainLocPostSide" value="right" class="mr-1.5 h-3.5 w-3.5 text-medical-600 rounded">
                    <span>ขวา</span>
                  </label>
                  <label class="inline-flex items-center px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer">
                    <input type="checkbox" name="neckpainLocPostSide" value="both" class="mr-1.5 h-3.5 w-3.5 text-medical-600 rounded">
                    <span>ทั้งสองข้าง</span>
                  </label>
                </div>
              </div>

              <!-- 2. ต้นคอด้านข้าง -->
              <div class="border border-slate-200 rounded-xl p-3 bg-white hover:border-medical-300 transition">
                <label class="flex items-start cursor-pointer">
                  <input type="checkbox" name="neckpainLoc" value="lateral_neck"
                    onchange="toggleNeckpainSideGroup('neckLatSideGroup', this.checked)"
                    class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                  <div class="ml-3">
                    <span class="text-xs sm:text-sm font-semibold text-slate-800 block">ต้นคอด้านข้าง</span>
                    <span class="text-[11px] text-slate-500 font-normal block mt-0.5">แนวด้านข้างลำคอ ใต้ใบหูหรือขากรรไกร</span>
                  </div>
                </label>
                <div id="neckLatSideGroup" class="hidden pl-7 pt-2.5 mt-2 border-t border-slate-100 flex items-center space-x-2 text-xs">
                  <span class="text-slate-500 text-[11px] font-medium mr-1">ข้างที่ปวด:</span>
                  <label class="inline-flex items-center px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer">
                    <input type="checkbox" name="neckpainLocLatSide" value="left" class="mr-1.5 h-3.5 w-3.5 text-medical-600 rounded">
                    <span>ซ้าย</span>
                  </label>
                  <label class="inline-flex items-center px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer">
                    <input type="checkbox" name="neckpainLocLatSide" value="right" class="mr-1.5 h-3.5 w-3.5 text-medical-600 rounded">
                    <span>ขวา</span>
                  </label>
                  <label class="inline-flex items-center px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer">
                    <input type="checkbox" name="neckpainLocLatSide" value="both" class="mr-1.5 h-3.5 w-3.5 text-medical-600 rounded">
                    <span>ทั้งสองข้าง</span>
                  </label>
                </div>
              </div>

              <!-- 3. บ่า / ไหล่ -->
              <div class="border border-slate-200 rounded-xl p-3 bg-white hover:border-medical-300 transition">
                <label class="flex items-start cursor-pointer">
                  <input type="checkbox" name="neckpainLoc" value="trapezius_shoulder"
                    onchange="toggleNeckpainSideGroup('neckTrapSideGroup', this.checked)"
                    class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                  <div class="ml-3">
                    <span class="text-xs sm:text-sm font-semibold text-slate-800 block">บ่า / ไหล่</span>
                    <span class="text-[11px] text-slate-500 font-normal block mt-0.5">แนวกล้ามเนื้อบ่าและหัวไหล่</span>
                  </div>
                </label>
                <div id="neckTrapSideGroup" class="hidden pl-7 pt-2.5 mt-2 border-t border-slate-100 flex items-center space-x-2 text-xs">
                  <span class="text-slate-500 text-[11px] font-medium mr-1">ข้างที่ปวด:</span>
                  <label class="inline-flex items-center px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer">
                    <input type="checkbox" name="neckpainLocTrapSide" value="left" class="mr-1.5 h-3.5 w-3.5 text-medical-600 rounded">
                    <span>ซ้าย</span>
                  </label>
                  <label class="inline-flex items-center px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer">
                    <input type="checkbox" name="neckpainLocTrapSide" value="right" class="mr-1.5 h-3.5 w-3.5 text-medical-600 rounded">
                    <span>ขวา</span>
                  </label>
                  <label class="inline-flex items-center px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer">
                    <input type="checkbox" name="neckpainLocTrapSide" value="both" class="mr-1.5 h-3.5 w-3.5 text-medical-600 rounded">
                    <span>ทั้งสองข้าง</span>
                  </label>
                </div>
              </div>

              <!-- 4. สะบัก / หลังช่วงบน -->
              <div class="border border-slate-200 rounded-xl p-3 bg-white hover:border-medical-300 transition">
                <label class="flex items-start cursor-pointer">
                  <input type="checkbox" name="neckpainLoc" value="interscapular_upper"
                    onchange="toggleNeckpainSideGroup('neckScapSideGroup', this.checked)"
                    class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                  <div class="ml-3">
                    <span class="text-xs sm:text-sm font-semibold text-slate-800 block">สะบัก / หลังช่วงบน</span>
                    <span class="text-[11px] text-slate-500 font-normal block mt-0.5">ร่องระหว่างสะบักสองข้างหรือหลังช่วงบน</span>
                  </div>
                </label>
                <div id="neckScapSideGroup" class="hidden pl-7 pt-2.5 mt-2 border-t border-slate-100 flex items-center space-x-2 text-xs">
                  <span class="text-slate-500 text-[11px] font-medium mr-1">ข้างที่ปวด:</span>
                  <label class="inline-flex items-center px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer">
                    <input type="checkbox" name="neckpainLocScapSide" value="left" class="mr-1.5 h-3.5 w-3.5 text-medical-600 rounded">
                    <span>ซ้าย</span>
                  </label>
                  <label class="inline-flex items-center px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer">
                    <input type="checkbox" name="neckpainLocScapSide" value="right" class="mr-1.5 h-3.5 w-3.5 text-medical-600 rounded">
                    <span>ขวา</span>
                  </label>
                  <label class="inline-flex items-center px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer">
                    <input type="checkbox" name="neckpainLocScapSide" value="both" class="mr-1.5 h-3.5 w-3.5 text-medical-600 rounded">
                    <span>ทั้งสองข้าง</span>
                  </label>
                </div>
              </div>

              <!-- 5. ปวดเมื่อยระบมทั่วคอบ่าไหล่ -->
              <div class="border border-slate-200 rounded-xl p-3 bg-white hover:border-medical-300 transition flex items-center sm:col-span-2">
                <label class="flex items-start cursor-pointer w-full">
                  <input type="checkbox" name="neckpainLoc" value="diffuse"
                    class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                  <div class="ml-3">
                    <span class="text-xs sm:text-sm font-semibold text-slate-800 block">ปวดเมื่อยระบมทั่วคอบ่าไหล่</span>
                    <span class="text-[11px] text-slate-500 font-normal block mt-0.5">ตึงเกร็งกระจายทั่วบริเวณ ไม่จำเพาะจุด</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- 1.3 ลักษณะการเริ่มปวด -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              ลักษณะการเริ่มปวด
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label class="selectable-card flex items-start p-3.5 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="neckpainOnsetMode" value="sudden_severe" class="text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0 mt-0.5">
                <div class="ml-3">
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 block">ปวดรุนแรงทันทีทันใด (ฉับพลัน)</span>
                  <span class="text-[11px] text-slate-500 font-normal block mt-0.5">ปวดพุ่งขึ้นสูงสุดในไม่กี่วินาทีหรือนาทีแรก</span>
                </div>
              </label>
              <label class="selectable-card flex items-start p-3.5 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="neckpainOnsetMode" value="gradual_worsening" class="text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0 mt-0.5">
                <div class="ml-3">
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 block">ค่อยๆ ปวดเพิ่มขึ้นเรื่อยๆ</span>
                  <span class="text-[11px] text-slate-500 font-normal block mt-0.5">เริ่มจากเมื่อย ตึง แล้วค่อยๆ รุนแรงขึ้นตามเวลา</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 2: การปวดร้าว ลักษณะปวด และระดับความปวด -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="activity" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">2. การปวดร้าว ลักษณะปวด และระดับความปวด (Pain Profile)</h2>
            <p class="text-xs text-slate-500">ลักษณะความเจ็บปวด การร้าวไปยังอวัยวะอื่น และคะแนนความปวด</p>
          </div>
        </div>

        <div class="space-y-4">
          <!-- 2.1 อาการปวดร้าว -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              อาการปวดร้าวไปบริเวณอื่น
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label class="selectable-card flex items-center p-3.5 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition"
                onclick="toggleNeckpainRadiationSub(false)">
                <input type="radio" name="neckpainRadMaster" value="none" class="text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ปวดเฉพาะที่ ไม่ร้าวไปไหน</span>
              </label>
              <label class="selectable-card flex items-center p-3.5 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition"
                onclick="toggleNeckpainRadiationSub(true)">
                <input type="radio" name="neckpainRadMaster" value="yes" class="text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีปวดร้าวไปบริเวณอื่น</span>
              </label>
            </div>

            <!-- กล่องแตกกิ่ง: บริเวณที่ปวดร้าว -->
            <div id="neckpainRadiationSub" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-3 space-y-2">
              <span class="text-xs font-bold text-slate-800 block mb-1 flex items-center">
                <i data-lucide="corner-down-right" class="w-3.5 h-3.5 mr-1 text-medical-600"></i> ระบุบริเวณที่ปวดร้าว (เลือกได้หลายข้อ)
              </span>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                  <input type="checkbox" name="neckpainRadLoc" value="rad_arm_fingers" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <span class="ml-2.5 text-xs font-medium text-slate-800">ร้าวลงแขน ข้อศอก หรือปลายนิ้วมือ</span>
                </label>
                <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                  <input type="checkbox" name="neckpainRadLoc" value="rad_head_occiput" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <span class="ml-2.5 text-xs font-medium text-slate-800">ร้าวขึ้นศีรษะ ท้ายทอย หรือขมับ</span>
                </label>
                <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                  <input type="checkbox" name="neckpainRadLoc" value="rad_jaw_chest" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <span class="ml-2.5 text-xs font-medium text-slate-800">ร้าวไปขากรรไกร คอหอย หรือหน้าอก</span>
                </label>
                <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                  <input type="checkbox" name="neckpainRadLoc" value="rad_interscapular_tearing" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <span class="ml-2.5 text-xs font-medium text-slate-800">ร้าวทะลุหลังไประหว่างสะบักสองข้าง</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 2.2 ลักษณะอาการปวด -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              ลักษณะอาการปวด (เลือกได้หลายข้อ)
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="neckpainChar" value="dull_muscle_tight" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                <div class="ml-3">
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 block">ปวดเมื่อย ตึง ระบม</span>
                  <span class="text-[11px] text-slate-500 font-normal block mt-0.5">เมื่อยล้า กล้ามเนื้อตึงเกร็ง</span>
                </div>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="neckpainChar" value="sharp_electric" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                <div class="ml-3">
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 block">ปวดแปล๊บ เหมือนไฟช็อต</span>
                  <span class="text-[11px] text-slate-500 font-normal block mt-0.5">เสียวแปล๊บแล่นลงแขนตามแนวประสาท</span>
                </div>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="neckpainChar" value="throbbing_pulsatile" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                <div class="ml-3">
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 block">ปวดเต้นตุบๆ ตามชีพจร</span>
                  <span class="text-[11px] text-slate-500 font-normal block mt-0.5">เต้นตุบๆ ที่ขมับหรือต้นคอ</span>
                </div>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="neckpainChar" value="tearing_ripping" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                <div class="ml-3">
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 block">ปวดฉีกขาด รุนแรงจัด</span>
                  <span class="text-[11px] text-slate-500 font-normal block mt-0.5">เจ็บรุนแรงคล้ายมีอะไรฉีกขาดอยู่ลึกๆ</span>
                </div>
              </label>
            </div>
          </div>

          <!-- 2.3 ระดับความเจ็บปวด (Universal Slider 0-10) -->
          <div>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
              <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                ระดับความเจ็บปวด (Pain Score 0-10)
              </label>
              <div class="flex items-center space-x-2">
                <span id="neckpainPainScoreBadge" class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all">
                  <span id="neckpainPainScoreEmoji">⚪</span>
                  <span id="neckpainPainScoreText">ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)</span>
                </span>
                <button type="button" id="neckpainPainScoreClearBtn" onclick="clearNeckpainPainScore()" class="hidden text-xs text-slate-400 hover:text-slate-600 underline">ล้างค่า</button>
              </div>
            </div>
            <div class="pt-2 px-1">
              <input type="range" id="neckpainPainScore" min="0" max="10" value="0"
                oninput="handleNeckpainPainScoreChange(this.value)"
                class="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-600">
              <div class="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                <span>0 ไม่ปวดเลย</span>
                <span>5 ปวดปานกลาง</span>
                <span>10 ปวดมากที่สุด</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 3: สัญญาณเตือน สภาวะอันตราย / ความเสี่ยงสูง -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="shield-alert" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">3. สัญญาณเตือน สภาวะอันตราย / ความเสี่ยงสูง (Warning Signs)</h2>
            <p class="text-xs text-slate-500">คัดกรองอาการทางระบบประสาท แขน การเคลื่อนไหว และหลอดเลือด</p>
          </div>
        </div>

        <div class="space-y-3">
          <!-- กลุ่ม 1: มีความผิดปกติที่แขน มือ หรือการเคลื่อนไหว -->
          <div class="border border-slate-200 rounded-xl p-3 bg-white hover:border-medical-300 transition">
            <label class="flex items-start cursor-pointer">
              <input type="checkbox" id="neckWarningArmMovementParent"
                onchange="toggleNeckpainWarningGroup('neckWarningArmMovementSub', this.checked)"
                class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
              <div class="ml-3">
                <span class="text-xs sm:text-sm font-semibold text-slate-800 block">มีความผิดปกติที่แขน มือ หรือการเคลื่อนไหว</span>
                <span class="text-[11px] text-slate-500 font-normal block mt-0.5">กล้ามเนื้อแขนอ่อนแรง มือหยิบของหลุด หรือเดินเซ</span>
              </div>
            </label>
            <div id="neckWarningArmMovementSub" class="hidden pl-7 pt-3 mt-2 border-t border-slate-100 space-y-2">
              <span class="text-[11px] font-bold text-slate-700 block mb-1">
                ระบุรายละเอียดอาการที่พบ (เลือกได้หลายข้อ):
              </span>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" name="neckpainWarningSigns" value="hand_clumsy_weak" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <span class="ml-2.5 text-xs font-medium text-slate-800">มืออ่อนแรง หยิบจับของหลุดง่าย หรือติดกระดุมเสื้อลำบาก</span>
                </label>
                <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" name="neckpainWarningSigns" value="arm_weakness_abduction" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <span class="ml-2.5 text-xs font-medium text-slate-800">แขนอ่อนแรง ยกแขนไม่ขึ้น หรืองอข้อศอกไม่ได้</span>
                </label>
                <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" name="neckpainWarningSigns" value="arm_numbness_fingers" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <span class="ml-2.5 text-xs font-medium text-slate-800">ชาตามแนวแขน ฝ่ามือ หรือปลายนิ้ว</span>
                </label>
                <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" name="neckpainWarningSigns" value="gait_ataxia_spastic" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <span class="ml-2.5 text-xs font-medium text-slate-800">เดินเซ ขาแข็งกระตุก หรือก้าวขาลำบาก</span>
                </label>
              </div>
            </div>
          </div>

          <!-- กลุ่ม 2: มีอาการทางระบบประสาท ศีรษะ และการมองเห็น -->
          <div class="border border-slate-200 rounded-xl p-3 bg-white hover:border-medical-300 transition">
            <label class="flex items-start cursor-pointer">
              <input type="checkbox" id="neckWarningNeuroHeadParent"
                onchange="toggleNeckpainWarningGroup('neckWarningNeuroHeadSub', this.checked)"
                class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
              <div class="ml-3">
                <span class="text-xs sm:text-sm font-semibold text-slate-800 block">มีอาการทางระบบประสาท ศีรษะ และการมองเห็น</span>
                <span class="text-[11px] text-slate-500 font-normal block mt-0.5">ปวดท้ายทอยเฉับพลัน ตาพร่ามัว หน้าชา หรือพูดไม่ชัด</span>
              </div>
            </label>
            <div id="neckWarningNeuroHeadSub" class="hidden pl-7 pt-3 mt-2 border-t border-slate-100 space-y-2">
              <span class="text-[11px] font-bold text-slate-700 block mb-1">
                ระบุรายละเอียดอาการที่พบ (เลือกได้หลายข้อ):
              </span>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" name="neckpainWarningSigns" value="nuchal_rigidity_headache" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <span class="ml-2.5 text-xs font-medium text-slate-800">ปวดท้ายทอยรุนแรงฉับพลัน หรือคอแข็งก้มไม่ลง</span>
                </label>
                <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" name="neckpainWarningSigns" value="diplopia_ptosis_horner" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <span class="ml-2.5 text-xs font-medium text-slate-800">ตาพร่ามัว เห็นภาพซ้อน หรือหนังตาตกข้างหนึ่ง</span>
                </label>
                <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" name="neckpainWarningSigns" value="facial_numb_speech" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <span class="ml-2.5 text-xs font-medium text-slate-800">หน้าชา ปากเบี้ยว หรือพูดไม่ชัด</span>
                </label>
                <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" name="neckpainWarningSigns" value="ataxia_vertigo_syncope" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <span class="ml-2.5 text-xs font-medium text-slate-800">วูบ หน้ามืด หรือมีอาการบ้านหมุนโคลงเคลงรุนแรง</span>
                </label>
              </div>
            </div>
          </div>

          <!-- รายการเตือน Standalone (5 ข้อ) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div class="border border-slate-200 rounded-xl p-3 bg-white hover:border-medical-300 transition">
              <label class="flex items-start cursor-pointer">
                <input type="checkbox" name="neckpainWarningSigns" value="fever_chills"
                  class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                <div class="ml-3">
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 block">มีไข้สูง หนาวสั่นสะท้าน</span>
                  <span class="text-[11px] text-slate-500 font-normal block mt-0.5">ตัวร้อน วัดอุณหภูมิได้สูง หรือมีไข้สั่น</span>
                </div>
              </label>
            </div>
            <div class="border border-slate-200 rounded-xl p-3 bg-white hover:border-medical-300 transition">
              <label class="flex items-start cursor-pointer">
                <input type="checkbox" name="neckpainWarningSigns" value="dysphagia_stridor"
                  class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                <div class="ml-3">
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 block">กลืนลำบาก เจ็บคอมาก หรือหายใจมีเสียงหวีด</span>
                  <span class="text-[11px] text-slate-500 font-normal block mt-0.5">กลืนน้ำลายเจ็บ หายใจติดขัด หรือเสียงเปลี่ยน</span>
                </div>
              </label>
            </div>
            <div class="border border-slate-200 rounded-xl p-3 bg-white hover:border-medical-300 transition">
              <label class="flex items-start cursor-pointer">
                <input type="checkbox" name="neckpainWarningSigns" value="chest_dyspnea_sweat"
                  class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                <div class="ml-3">
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 block">แน่นหน้าอก หอบเหนื่อย หรือเหงื่อแตกตัวเย็น</span>
                  <span class="text-[11px] text-slate-500 font-normal block mt-0.5">รู้สึกอึดอัดแน่นหน้าอก หายใจไม่อิ่มร่วมด้วย</span>
                </div>
              </label>
            </div>
            <div class="border border-slate-200 rounded-xl p-3 bg-white hover:border-medical-300 transition">
              <label class="flex items-start cursor-pointer">
                <input type="checkbox" name="neckpainWarningSigns" value="local_mass_wound_pus"
                  class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                <div class="ml-3">
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 block">มีก้อน แผล หนอง ผื่น ฝี บริเวณที่มีอาการ</span>
                  <span class="text-[11px] text-slate-500 font-normal block mt-0.5">คลำได้ก้อนบวม รอยแผล ตุ่มหนอง หรือผื่นแดงแสบร้อน</span>
                </div>
              </label>
            </div>
            <div class="border border-slate-200 rounded-xl p-3 bg-white hover:border-medical-300 transition sm:col-span-2">
              <label class="flex items-start cursor-pointer">
                <input type="checkbox" name="neckpainWarningSigns" value="cancer_weight_loss"
                  class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                <div class="ml-3">
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 block">มีประวัติโรคมะเร็ง และน้ำหนักลดลงฮวบผิดปกติ</span>
                  <span class="text-[11px] text-slate-500 font-normal block mt-0.5">มีประวัติมะเร็งเดิม หรือปวดทรมานตอนกลางคืนจนนอนไม่ได้</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 4: ประวัติอุบัติเหตุ และการบาดเจ็บที่คอ -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="alert-triangle" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">4. ประวัติอุบัติเหตุ และการบาดเจ็บที่คอ (Trauma History)</h2>
            <p class="text-xs text-slate-500">ประวัติการกระแทก การสะบัดของคอ หรืออุบัติเหตุจราจร</p>
          </div>
        </div>

        <div class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label class="selectable-card flex items-center p-3.5 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition"
              onclick="toggleNeckpainTraumaSub(false)">
              <input type="radio" name="neckpainTraumaMaster" value="no" class="text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0">
              <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่มีประวัติอุบัติเหตุ (เริ่มปวดเอง)</span>
            </label>
            <label class="selectable-card flex items-center p-3.5 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition"
              onclick="toggleNeckpainTraumaSub(true)">
              <input type="radio" name="neckpainTraumaMaster" value="yes" class="text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0">
              <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีประวัติอุบัติเหตุนำมาก่อน</span>
            </label>
          </div>

          <!-- กล่องแตกกิ่ง: ระบุประเภทอุบัติเหตุ -->
          <div id="neckpainTraumaSub" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <span class="text-xs font-bold text-slate-800 block mb-1 flex items-center">
              <i data-lucide="corner-down-right" class="w-3.5 h-3.5 mr-1 text-medical-600"></i> ระบุประเภทอุบัติเหตุ (เลือกได้หลายข้อ)
            </span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                <input type="checkbox" name="neckpainTraumaTypes" value="high_impact_mva_whiplash" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-2.5 text-xs font-medium text-slate-800">รถชน ถูกชนท้าย หรือคอกระชากสะบัดอย่างแรง (Whiplash)</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                <input type="checkbox" name="neckpainTraumaTypes" value="fall_diving_head_neck" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-2.5 text-xs font-medium text-slate-800">พลัดตกจากที่สูง หกล้ม หรือกระโดดน้ำศีรษะกระแทก</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                <input type="checkbox" name="neckpainTraumaTypes" value="sports_neck_injury" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-2.5 text-xs font-medium text-slate-800">อุบัติเหตุจากการเล่นกีฬาที่มีการกระแทกคอ</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer"
                onchange="toggleNeckpainTraumaOther(this.querySelector('input').checked)">
                <input type="checkbox" name="neckpainTraumaTypes" value="trauma_other" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-2.5 text-xs font-medium text-slate-800">อุบัติเหตุอื่นๆ (ระบุ)</span>
              </label>
            </div>
            <div id="neckpainTraumaOtherWrap" class="hidden pt-2">
              <input type="text" id="neckpainTraumaOtherText" placeholder="ระบุเหตุการณ์ เช่น ศีรษะชนขอบประตูบานเลื่อน..."
                class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 5: พฤติกรรมการทำงาน ท่าทาง และปัจจัยกระตุ้น -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="laptop" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">5. พฤติกรรมการทำงาน ท่าทาง และอาการร่วมอื่นๆ</h2>
            <p class="text-xs text-slate-500">ประวัติการทำงานหน้าจอ ท่าทางการนอน และรายละเอียดเพิ่มเติม</p>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              พฤติกรรม ท่าทาง และปัจจัยกระตุ้น (เลือกได้หลายข้อ)
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="neckpainErgonomics" value="office_tech_neck" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                <div class="ml-3">
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 block">นั่งหน้าคอมฯ หรือก้มดูจอนาน</span>
                  <span class="text-[11px] text-slate-500 font-normal block mt-0.5">ทำงานออฟฟิศ หรือใช้มือถือนานหลายชั่วโมง</span>
                </div>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="neckpainErgonomics" value="awkward_twist_strain" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                <div class="ml-3">
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 block">บิดตัว หรือออกแรงผิดท่า</span>
                  <span class="text-[11px] text-slate-500 font-normal block mt-0.5">เอี้ยวตัวเร็ว หรือเกร็งกล้ามเนื้อผิดจังหวะ</span>
                </div>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="neckpainErgonomics" value="poor_sleep_posture" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                <div class="ml-3">
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 block">นอนตกหมอน หรือคอบิดเกร็ง</span>
                  <span class="text-[11px] text-slate-500 font-normal block mt-0.5">ตื่นเช้ามาคอแข็ง หันคอลำบากเฉับพลัน</span>
                </div>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="neckpainErgonomics" value="heavy_bag_shoulder" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                <div class="ml-3">
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 block">สะพายกระเป๋าหนักข้างเดียว</span>
                  <span class="text-[11px] text-slate-500 font-normal block mt-0.5">สะพายของหนักเป็นประจำจนบ่าเอียง</span>
                </div>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition sm:col-span-2">
                <input type="checkbox" name="neckpainErgonomics" value="worse_neck_motion" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                <div class="ml-3">
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 block">ปวดมากขึ้นเมื่อก้ม เงย หรือเอียงคอ</span>
                  <span class="text-[11px] text-slate-500 font-normal block mt-0.5">ขยับคอแล้วเจ็บสะดุ้ง หรือมีอาการร้าว</span>
                </div>
              </label>
            </div>
          </div>

          <!-- บันทึกอาการเพิ่มเติมอิสระ -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              อาการอื่นๆ เพิ่มเติม (กรอกอิสระ ถ้ามี)
            </label>
            <textarea id="neckpain_other_free" rows="2" placeholder="เช่น เคยไปนวดดัดคอมาก่อนหน้านี้ 2 วัน, รู้สึกตึงรั้งขึ้นขมับ..."
              class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500"></textarea>
          </div>
        </div>
      </div>
    </div>
  `,

  onMounted: function() {
    clearNeckpainPainScore();
  },

  // --- Collect Intake Hook ---
  collectIntake: function(ctx) {
    const _rawDur = parseFloat(document.getElementById('neckpainDurationVal')?.value);
    const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
    const durationUnit = document.getElementById('neckpainDurationUnit')?.value || 'days';

    const neckpainLoc = Array.from(document.querySelectorAll('input[name="neckpainLoc"]:checked')).map(el => el.value);
    const neckpainLocPostSide = Array.from(document.querySelectorAll('input[name="neckpainLocPostSide"]:checked')).map(el => el.value);
    const neckpainLocLatSide = Array.from(document.querySelectorAll('input[name="neckpainLocLatSide"]:checked')).map(el => el.value);
    const neckpainLocTrapSide = Array.from(document.querySelectorAll('input[name="neckpainLocTrapSide"]:checked')).map(el => el.value);
    const neckpainLocScapSide = Array.from(document.querySelectorAll('input[name="neckpainLocScapSide"]:checked')).map(el => el.value);

    const neckpainOnsetMode = document.querySelector('input[name="neckpainOnsetMode"]:checked')?.value || '';

    const neckpainRadMaster = document.querySelector('input[name="neckpainRadMaster"]:checked')?.value || 'none';
    const neckpainRadLoc = neckpainRadMaster === 'yes'
      ? Array.from(document.querySelectorAll('input[name="neckpainRadLoc"]:checked')).map(el => el.value)
      : [];

    const neckpainChar = Array.from(document.querySelectorAll('input[name="neckpainChar"]:checked')).map(el => el.value);

    let painScore = 0;
    if (neckpainPainScoreTouched) {
      const pSlider = document.getElementById('neckpainPainScore');
      if (pSlider) painScore = parseInt(pSlider.value, 10);
    }

    const neckpainWarningSigns = Array.from(document.querySelectorAll('input[name="neckpainWarningSigns"]:checked')).map(el => el.value);
    const neckWarningArmMovementParent = !!document.getElementById('neckWarningArmMovementParent')?.checked;
    const neckWarningNeuroHeadParent = !!document.getElementById('neckWarningNeuroHeadParent')?.checked;

    const neckpainTraumaMaster = document.querySelector('input[name="neckpainTraumaMaster"]:checked')?.value || 'no';
    const neckpainTraumaTypes = neckpainTraumaMaster === 'yes'
      ? Array.from(document.querySelectorAll('input[name="neckpainTraumaTypes"]:checked')).map(el => el.value)
      : [];
    const neckpainTraumaOtherText = document.getElementById('neckpainTraumaOtherText')?.value?.trim() || '';

    const neckpainErgonomics = Array.from(document.querySelectorAll('input[name="neckpainErgonomics"]:checked')).map(el => el.value);
    const otherSymptomsFree = document.getElementById('neckpain_other_free')?.value?.trim() || ctx.otherSymptomsFree || '';

    const rec = {
      id: ctx.recordId,
      queue_number: ctx.queueNumber,
      hn: ctx.randomHn,
      name: ctx.patientName,
      age: ctx.patientAge,
      gender: ctx.gender,
      chief_complaint: 'neck_shoulder_pain',
      chief_complaint_title: 'ปวดต้นคอ / บ่า / หลังช่วงบน',
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

      neckpainLoc,
      neckpainLocPostSide,
      neckpainLocLatSide,
      neckpainLocTrapSide,
      neckpainLocScapSide,
      neckpainOnsetMode,
      neckpainRadMaster,
      neckpainRadLoc,
      neckpainChar,
      painScore,
      neckpainWarningSigns,
      neckWarningArmMovementParent,
      neckWarningNeuroHeadParent,
      neckpainTraumaMaster,
      neckpainTraumaTypes,
      neckpainTraumaOtherText,
      neckpainErgonomics
    };

    updateNeckpainOutputs(rec);
    return rec;
  },

  // --- Populate / Hydrate Form Hook ---
  populateForm: function(patient) {
    if (!patient) return;

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val !== undefined && val !== null ? val : '';
    };

    setVal('neckpainDurationVal', patient.durationVal);
    setVal('neckpainDurationUnit', patient.durationUnit || 'days');

    const setCheckedArr = (name, arr) => {
      if (!Array.isArray(arr)) return;
      document.querySelectorAll(`input[name="${name}"]`).forEach(cb => {
        cb.checked = arr.includes(cb.value);
      });
    };

    setCheckedArr('neckpainLoc', patient.neckpainLoc);
    setCheckedArr('neckpainLocPostSide', patient.neckpainLocPostSide);
    setCheckedArr('neckpainLocLatSide', patient.neckpainLocLatSide);
    setCheckedArr('neckpainLocTrapSide', patient.neckpainLocTrapSide);
    setCheckedArr('neckpainLocScapSide', patient.neckpainLocScapSide);

    const locs = Array.isArray(patient.neckpainLoc) ? patient.neckpainLoc : [];
    toggleNeckpainSideGroup('neckPostSideGroup', locs.includes('suboccipital_posterior'));
    toggleNeckpainSideGroup('neckLatSideGroup', locs.includes('lateral_neck'));
    toggleNeckpainSideGroup('neckTrapSideGroup', locs.includes('trapezius_shoulder'));
    toggleNeckpainSideGroup('neckScapSideGroup', locs.includes('interscapular_upper'));

    if (patient.neckpainOnsetMode) {
      const r = document.querySelector(`input[name="neckpainOnsetMode"][value="${patient.neckpainOnsetMode}"]`);
      if (r) r.checked = true;
    }

    if (patient.neckpainRadMaster) {
      const r = document.querySelector(`input[name="neckpainRadMaster"][value="${patient.neckpainRadMaster}"]`);
      if (r) r.checked = true;
    }
    toggleNeckpainRadiationSub(patient.neckpainRadMaster === 'yes');
    setCheckedArr('neckpainRadLoc', patient.neckpainRadLoc);

    setCheckedArr('neckpainChar', patient.neckpainChar);

    if (typeof patient.painScore === 'number' && patient.painScore >= 0) {
      const slider = document.getElementById('neckpainPainScore');
      if (slider) slider.value = patient.painScore;
      handleNeckpainPainScoreChange(patient.painScore);
    } else {
      clearNeckpainPainScore();
    }

    setCheckedArr('neckpainWarningSigns', patient.neckpainWarningSigns);
    const warnSigns = Array.isArray(patient.neckpainWarningSigns) ? patient.neckpainWarningSigns : [];

    const armKeys = ['hand_clumsy_weak', 'arm_weakness_abduction', 'arm_numbness_fingers', 'gait_ataxia_spastic'];
    const hasArm = patient.neckWarningArmMovementParent || warnSigns.some(k => armKeys.includes(k));
    const pArm = document.getElementById('neckWarningArmMovementParent');
    if (pArm) pArm.checked = !!hasArm;
    toggleNeckpainWarningGroup('neckWarningArmMovementSub', !!hasArm);

    const neuroKeys = ['nuchal_rigidity_headache', 'diplopia_ptosis_horner', 'facial_numb_speech', 'ataxia_vertigo_syncope'];
    const hasNeuro = patient.neckWarningNeuroHeadParent || warnSigns.some(k => neuroKeys.includes(k));
    const pNeuro = document.getElementById('neckWarningNeuroHeadParent');
    if (pNeuro) pNeuro.checked = !!hasNeuro;
    toggleNeckpainWarningGroup('neckWarningNeuroHeadSub', !!hasNeuro);

    if (patient.neckpainTraumaMaster) {
      const r = document.querySelector(`input[name="neckpainTraumaMaster"][value="${patient.neckpainTraumaMaster}"]`);
      if (r) r.checked = true;
    }
    toggleNeckpainTraumaSub(patient.neckpainTraumaMaster === 'yes');
    setCheckedArr('neckpainTraumaTypes', patient.neckpainTraumaTypes);

    const hasOtherTrauma = Array.isArray(patient.neckpainTraumaTypes) && patient.neckpainTraumaTypes.includes('trauma_other');
    toggleNeckpainTraumaOther(hasOtherTrauma);
    setVal('neckpainTraumaOtherText', patient.neckpainTraumaOtherText);

    setCheckedArr('neckpainErgonomics', patient.neckpainErgonomics);
    setVal('neckpain_other_free', patient.otherSymptomsFree);
  },

  // --- Reset Form Hook ---
  resetForm: function() {
    const ids = ['neckpainDurationVal', 'neckpainTraumaOtherText', 'neckpain_other_free'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const unitEl = document.getElementById('neckpainDurationUnit');
    if (unitEl) unitEl.value = 'days';

    const radios = ['neckpainOnsetMode', 'neckpainRadMaster', 'neckpainTraumaMaster'];
    radios.forEach(name => {
      document.querySelectorAll(`input[name="${name}"]`).forEach(r => { r.checked = false; });
    });

    const cbs = [
      'neckpainLoc', 'neckpainLocPostSide', 'neckpainLocLatSide', 'neckpainLocTrapSide',
      'neckpainLocScapSide', 'neckpainRadLoc', 'neckpainChar', 'neckpainWarningSigns',
      'neckpainTraumaTypes', 'neckpainErgonomics'
    ];
    cbs.forEach(name => {
      document.querySelectorAll(`input[name="${name}"]`).forEach(cb => { cb.checked = false; });
    });

    ['neckWarningArmMovementParent', 'neckWarningNeuroHeadParent'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.checked = false;
    });

    ['neckPostSideGroup', 'neckLatSideGroup', 'neckTrapSideGroup', 'neckScapSideGroup',
     'neckpainRadiationSub', 'neckWarningArmMovementSub', 'neckWarningNeuroHeadSub',
     'neckpainTraumaSub', 'neckpainTraumaOtherWrap'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });

    clearNeckpainPainScore();
  },

  // --- Clinical Output Generators ---
  hydrateForm: function(patient) {
    this.populateForm(patient);
  },
  isRedFlag: function(patient) {
    return evaluateNeckpainRedFlags(patient).length > 0;
  },
  updateOutputs: updateNeckpainOutputs,
  renderRapidHpi: renderNeckpainRapidHpi,
  renderNarrative: renderNeckpainNarrative,
  renderDoctorHpi: renderNeckpainDoctorHpi,
  evaluateRedFlags: evaluateNeckpainRedFlags,
  generateCds: generateNeckpainCds,

  // --- Seed Patients Registry ---
  seedPatients: [
    // Case 1: Cervical Spondylotic Myelopathy (CSM) (ESI 2)
    {
      id: 'case-neck-01',
      queue_number: 'E2-101',
      hn: '6789101',
      name: 'นายสมศักดิ์ มือชาติดกระดุมไม่ได้',
      age: 64,
      gender: 'ชาย',
      chief_complaint: 'neck_shoulder_pain',
      chief_complaint_title: 'ปวดต้นคอ / บ่า / หลังช่วงบน',
      timestamp: '2026-11-03T08:15:00.000Z',
      status: 'waiting',
      durationVal: 2,
      durationUnit: 'months',
      hospRecordStatus: 'complete',
      underlying: ['เบาหวาน (DM)', 'ความดันสูง (HT)'],
      drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร',
      currentMeds: 'Metformin (500 mg) 1 tab bid pc, Enalapril (10 mg) 1 tab od pc',
      otherSymptomsFree: 'ปวดคอร้าวลงบ่า มือล้าหยิบช้อนหล่น ติดกระดุมเสื้อลำบาก เดินขากระตุกก้าวขาลำบาก',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.8, sbp: 138, dbp: 82, bp: '138/82', pr: 76, rr: 18, spo2: 98 },
      esi_level: 2,

      neckpainLoc: ['suboccipital_posterior', 'trapezius_shoulder'],
      neckpainLocPostSide: ['both'],
      neckpainLocLatSide: [],
      neckpainLocTrapSide: ['both'],
      neckpainLocScapSide: [],
      neckpainOnsetMode: 'gradual_worsening',
      neckpainRadMaster: 'yes',
      neckpainRadLoc: ['rad_arm_fingers'],
      neckpainChar: ['dull_muscle_tight', 'sharp_electric'],
      painScore: 6,
      neckpainWarningSigns: ['hand_clumsy_weak', 'arm_numbness_fingers', 'gait_ataxia_spastic'],
      neckWarningArmMovementParent: true,
      neckWarningNeuroHeadParent: false,
      neckpainTraumaMaster: 'no',
      neckpainTraumaTypes: [],
      neckpainTraumaOtherText: '',
      neckpainErgonomics: ['worse_neck_motion']
    },

    // Case 2: Vertebral Artery Dissection with Brainstem Ischemia (ESI 1)
    {
      id: 'case-neck-02',
      queue_number: 'E1-102',
      hn: '6789102',
      name: 'นางวราภรณ์ ปวดคอเห็นภาพซ้อน',
      age: 42,
      gender: 'หญิง',
      chief_complaint: 'neck_shoulder_pain',
      chief_complaint_title: 'ปวดต้นคอ / บ่า / หลังช่วงบน',
      timestamp: '2026-11-03T08:45:00.000Z',
      status: 'waiting',
      durationVal: 3,
      durationUnit: 'hours',
      hospRecordStatus: 'complete',
      underlying: ['ไมเกรน (Migraine)'],
      drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร',
      currentMeds: 'ไม่มี',
      otherSymptomsFree: 'ปวดคอด้านซ้ายร้าวขึ้นท้ายทอยรุนแรงฉับพลันหลังไปนวดดัดคอ ตาเห็นภาพซ้อน เวียนศีรษะเดินเซ ทรงตัวไม่อยู่',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.6, sbp: 155, dbp: 95, bp: '155/95', pr: 88, rr: 20, spo2: 99 },
      esi_level: 1,

      neckpainLoc: ['lateral_neck', 'suboccipital_posterior'],
      neckpainLocPostSide: ['left'],
      neckpainLocLatSide: ['left'],
      neckpainLocTrapSide: [],
      neckpainLocScapSide: [],
      neckpainOnsetMode: 'sudden_severe',
      neckpainRadMaster: 'yes',
      neckpainRadLoc: ['rad_head_occiput'],
      neckpainChar: ['throbbing_pulsatile', 'tearing_ripping'],
      painScore: 9,
      neckpainWarningSigns: ['diplopia_ptosis_horner', 'ataxia_vertigo_syncope'],
      neckWarningArmMovementParent: false,
      neckWarningNeuroHeadParent: true,
      neckpainTraumaMaster: 'no',
      neckpainTraumaTypes: [],
      neckpainTraumaOtherText: '',
      neckpainErgonomics: []
    },

    // Case 3: Acute Cervical Radiculopathy with Motor Deficit C6/C7 (ESI 3)
    {
      id: 'case-neck-03',
      queue_number: 'E3-103',
      hn: '6789103',
      name: 'นายธีระ แปล๊บลงแขนยกของไม่ขึ้น',
      age: 47,
      gender: 'ชาย',
      chief_complaint: 'neck_shoulder_pain',
      chief_complaint_title: 'ปวดต้นคอ / บ่า / หลังช่วงบน',
      timestamp: '2026-11-03T09:15:00.000Z',
      status: 'waiting',
      durationVal: 4,
      durationUnit: 'days',
      hospRecordStatus: 'complete',
      underlying: [],
      drugAllergy: 'Aspirin (แน่นหน้าอกผื่นลมพิษ)',
      currentMeds: 'ไม่มี',
      otherSymptomsFree: 'ปวดคอร้าวแปล๊บเหมือนไฟช็อตลงแขนขวาถึงนิ้วชี้และกลาง งอข้อศอกและยกแขนขวาไม่ค่อยขึ้น',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.7, sbp: 126, dbp: 78, bp: '126/78', pr: 72, rr: 16, spo2: 100 },
      esi_level: 3,

      neckpainLoc: ['suboccipital_posterior', 'trapezius_shoulder'],
      neckpainLocPostSide: ['right'],
      neckpainLocLatSide: [],
      neckpainLocTrapSide: ['right'],
      neckpainLocScapSide: [],
      neckpainOnsetMode: 'gradual_worsening',
      neckpainRadMaster: 'yes',
      neckpainRadLoc: ['rad_arm_fingers'],
      neckpainChar: ['sharp_electric'],
      painScore: 7,
      neckpainWarningSigns: ['arm_weakness_abduction', 'arm_numbness_fingers'],
      neckWarningArmMovementParent: true,
      neckWarningNeuroHeadParent: false,
      neckpainTraumaMaster: 'no',
      neckpainTraumaTypes: [],
      neckpainTraumaOtherText: '',
      neckpainErgonomics: ['awkward_twist_strain', 'worse_neck_motion']
    },

    // Case 4: Musculoskeletal Trapezius Myalgia / Office Syndrome (ESI 4)
    {
      id: 'case-neck-04',
      queue_number: 'E4-104',
      hn: '6789104',
      name: 'นางสาวกุลธิดา ตึงบ่าทำงานหน้าจอ',
      age: 28,
      gender: 'หญิง',
      chief_complaint: 'neck_shoulder_pain',
      chief_complaint_title: 'ปวดต้นคอ / บ่า / หลังช่วงบน',
      timestamp: '2026-11-03T09:40:00.000Z',
      status: 'waiting',
      durationVal: 3,
      durationUnit: 'weeks',
      hospRecordStatus: 'complete',
      underlying: [],
      drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร',
      currentMeds: 'ไม่มี',
      otherSymptomsFree: 'นั่งทำงานคอมพิวเตอร์วันละ 8-10 ชม. ปวดเมื่อยตึงบ่าและสะบักทั้งสองข้าง ขยับแล้วตึงตัว ไม่ชา ไม่อ่อนแรง',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.5, sbp: 118, dbp: 74, bp: '118/74', pr: 68, rr: 16, spo2: 99 },
      esi_level: 4,

      neckpainLoc: ['trapezius_shoulder', 'interscapular_upper'],
      neckpainLocPostSide: [],
      neckpainLocLatSide: [],
      neckpainLocTrapSide: ['both'],
      neckpainLocScapSide: ['both'],
      neckpainOnsetMode: 'gradual_worsening',
      neckpainRadMaster: 'none',
      neckpainRadLoc: [],
      neckpainChar: ['dull_muscle_tight'],
      painScore: 4,
      neckpainWarningSigns: [],
      neckWarningArmMovementParent: false,
      neckWarningNeuroHeadParent: false,
      neckpainTraumaMaster: 'no',
      neckpainTraumaTypes: [],
      neckpainTraumaOtherText: '',
      neckpainErgonomics: ['office_tech_neck', 'poor_sleep_posture']
    }
  ]
});

// --- Helper Formatting Functions for Neck Pain ---
function formatNeckpainLocations(patient) {
  const locs = Array.isArray(patient.neckpainLoc) ? patient.neckpainLoc : [];
  if (locs.length === 0) return 'ไม่ได้ระบุ';

  const parts = [];
  const sideFormat = (sides) => {
    if (!Array.isArray(sides) || sides.length === 0) return '';
    const map = { left: 'ซ้าย', right: 'ขวา', both: 'ทั้งสองข้าง' };
    return ` (ข้าง${sides.map(s => map[s] || s).join(', ')})`;
  };

  locs.forEach(l => {
    if (l === 'suboccipital_posterior') parts.push(`ต้นคอด้านหลัง${sideFormat(patient.neckpainLocPostSide)}`);
    else if (l === 'lateral_neck') parts.push(`ต้นคอด้านข้าง${sideFormat(patient.neckpainLocLatSide)}`);
    else if (l === 'trapezius_shoulder') parts.push(`บ่า/ไหล่${sideFormat(patient.neckpainLocTrapSide)}`);
    else if (l === 'interscapular_upper') parts.push(`สะบัก/หลังช่วงบน${sideFormat(patient.neckpainLocScapSide)}`);
    else if (l === 'diffuse') parts.push('ปวดเมื่อยระบมทั่วคอบ่าไหล่');
    else parts.push(l);
  });

  return parts.join(', ');
}

function formatNeckpainChars(patient) {
  const chars = Array.isArray(patient.neckpainChar) ? patient.neckpainChar : [];
  if (chars.length === 0) return 'ไม่ได้ระบุ';
  const map = {
    dull_muscle_tight: 'ปวดเมื่อย ตึง ระบม',
    sharp_electric: 'ปวดแปล๊บ เหมือนไฟช็อต',
    throbbing_pulsatile: 'ปวดเต้นตุบๆ ตามชีพจร',
    tearing_ripping: 'ปวดฉีกขาด รุนแรงจัด'
  };
  return chars.map(c => map[c] || c).join(', ');
}

function formatNeckpainRadiation(patient) {
  if (patient.neckpainRadMaster === 'none') return 'ปวดเฉพาะที่ ไม่ร้าวไปไหน';
  const rads = Array.isArray(patient.neckpainRadLoc) ? patient.neckpainRadLoc : [];
  if (rads.length === 0) return 'มีปวดร้าว (ไม่ได้ระบุตำแหน่ง)';
  const map = {
    rad_arm_fingers: 'ร้าวลงแขน ข้อศอก หรือปลายนิ้วมือ (Radiculopathy)',
    rad_head_occiput: 'ร้าวขึ้นศีรษะ ท้ายทอย หรือขมับ',
    rad_jaw_chest: 'ร้าวไปขากรรไกร คอหอย หรือหน้าอก (ACS/Aortic risk)',
    rad_interscapular_tearing: 'ร้าวทะลุหลังไประหว่างสะบักสองข้าง'
  };
  return `ปวดร้าวไปยัง: ${rads.map(r => map[r] || r).join(', ')}`;
}

function formatNeckpainErgonomics(patient) {
  const ergos = Array.isArray(patient.neckpainErgonomics) ? patient.neckpainErgonomics : [];
  if (ergos.length === 0) return 'ไม่มีพฤติกรรมกระตุ้นชัดเจน';
  const map = {
    office_tech_neck: 'นั่งทำงานหน้าจอคอมฯ หรือก้มดูจอนาน',
    awkward_twist_strain: 'บิดตัวหรือออกแรงผิดท่าก่อนมีอาการ',
    poor_sleep_posture: 'นอนตกหมอนหรือคอบิดเกร็ง',
    heavy_bag_shoulder: 'สะพายกระเป๋าหนักข้างเดียวบ่อยๆ',
    worse_neck_motion: 'ปวดมากขึ้นเมื่อก้ม เงย หรือเอียงคอ'
  };
  return ergos.map(e => map[e] || e).join(', ');
}

// --- Rapid Note HPI Renderer (Doctor View) ---
function renderNeckpainRapidHpi(patient) {
  const durStr = patient.durationVal
    ? `ปวดมา ${patient.durationVal} ${patient.durationUnit === 'minutes' ? 'นาที' : (patient.durationUnit === 'hours' ? 'ชั่วโมง' : (patient.durationUnit === 'weeks' ? 'สัปดาห์' : (patient.durationUnit === 'months' ? 'เดือน' : (patient.durationUnit === 'years' ? 'ปี' : 'วัน'))))}`
    : 'ระยะเวลาไม่ระบุ';

  const onsetMap = {
    sudden_severe: 'ปวดรุนแรงทันทีทันใด (ฉับพลัน)',
    gradual_worsening: 'ค่อยๆ ปวดเพิ่มขึ้นเรื่อยๆ'
  };
  const onsetStr = onsetMap[patient.neckpainOnsetMode] || 'ไม่ได้ระบุ';

  const pScore = (typeof patient.painScore === 'number' && patient.painScore > 0)
    ? `${patient.painScore}/10 คะแนน`
    : (patient.painScore === 0 ? '0/10 คะแนน (ไม่ปวด)' : 'ไม่ได้ระบุ');

  const warnSigns = Array.isArray(patient.neckpainWarningSigns) ? patient.neckpainWarningSigns : [];
  const traumaTypes = Array.isArray(patient.neckpainTraumaTypes) ? patient.neckpainTraumaTypes : [];

  const posList = [];
  const negList = [];

  // Positives evaluation
  if (patient.neckpainOnsetMode === 'sudden_severe') posList.push('ปวดรุนแรงทันทีทันใด (ฉับพลัน)');
  if (Array.isArray(patient.neckpainRadLoc) && patient.neckpainRadLoc.includes('rad_arm_fingers')) {
    posList.push('ปวดร้าวลงแขนถึงปลายนิ้ว (Cervical Radiculopathy signs)');
  }
  if (Array.isArray(patient.neckpainRadLoc) && patient.neckpainRadLoc.includes('rad_jaw_chest')) {
    posList.push('ปวดร้าวไปขากรรไกรหรือหน้าอก (ACS/Angina referred pain risk)');
  }
  if (Array.isArray(patient.neckpainRadLoc) && patient.neckpainRadLoc.includes('rad_interscapular_tearing')) {
    posList.push('ปวดร้าวทะลุหลังระหว่างสะบักสองข้าง (Aortic dissection risk)');
  }

  // Warning signs positives
  if (warnSigns.includes('hand_clumsy_weak')) posList.push('มืออ่อนแรง หยิบของหลุดง่าย ติดกระดุมเสื้อลำบาก (Myelopathy/Clumsy hand)');
  if (warnSigns.includes('arm_weakness_abduction')) posList.push('แขนอ่อนแรง ยกแขนไม่ขึ้น หรืองอข้อศอกไม่ได้ (Motor deficit)');
  if (warnSigns.includes('arm_numbness_fingers')) posList.push('ชาตามแนวแขน ฝ่ามือ หรือปลายนิ้ว (Sensory deficit)');
  if (warnSigns.includes('gait_ataxia_spastic')) posList.push('เดินเซ ขาแข็งกระตุก ทรงตัวไม่อยู่ (Spastic gait / Ataxia)');
  if (warnSigns.includes('nuchal_rigidity_headache')) posList.push('ปวดท้ายทอยรุนแรงฉับพลัน หรือคอแข็งก้มไม่ลง (Nuchal rigidity / Meningeal signs)');
  if (warnSigns.includes('diplopia_ptosis_horner')) posList.push('ตาพร่ามัว เห็นภาพซ้อน หรือหนังตาตกข้างหนึ่ง (Horner / Dissection signs)');
  if (warnSigns.includes('facial_numb_speech')) posList.push('หน้าชา ปากเบี้ยว หรือพูดไม่ชัด (Stroke / Brainstem ischemia signs)');
  if (warnSigns.includes('ataxia_vertigo_syncope')) posList.push('วูบ หน้ามืด หรือมีอาการบ้านหมุนโคลงเคลงรุนแรง (Vertebrobasilar)');
  if (warnSigns.includes('fever_chills')) posList.push('มีไข้สูง หนาวสั่นสะท้าน (Spinal/Deep neck infection)');
  if (warnSigns.includes('dysphagia_stridor')) posList.push('กลืนอาหารลำบาก เจ็บคอมาก หรือหายใจมีเสียงหวีด (Airway threat)');
  if (warnSigns.includes('chest_dyspnea_sweat')) posList.push('แน่นหน้าอก หอบเหนื่อย หรือเหงื่อแตกตัวเย็น (Cardiovascular compromise)');
  if (warnSigns.includes('local_mass_wound_pus')) posList.push('มีก้อน แผล หนอง ผื่น หรือฝีบริเวณคอบ่า (Local lesion / Abscess)');
  if (warnSigns.includes('cancer_weight_loss')) posList.push('มีประวัติโรคมะเร็ง และน้ำหนักลดลงฮวบผิดปกติ (Malignancy risk)');

  // Trauma positives
  if (patient.neckpainTraumaMaster === 'yes') {
    if (traumaTypes.includes('high_impact_mva_whiplash')) posList.push('ประวัติรถชน/ถูกชนท้าย/คอกระชากสะบัดแรง (Whiplash trauma)');
    if (traumaTypes.includes('fall_diving_head_neck')) posList.push('พลัดตกจากที่สูง/หกล้ม/กระโดดน้ำศีรษะกระแทก');
    if (traumaTypes.includes('sports_neck_injury')) posList.push('อุบัติเหตุจากการเล่นกีฬาที่มีการกระแทกคอ');
    if (traumaTypes.includes('trauma_other') && patient.neckpainTraumaOtherText) {
      posList.push(`อุบัติเหตุอื่นๆ: ${patient.neckpainTraumaOtherText}`);
    }
  }

  // Negatives
  if (!warnSigns.includes('hand_clumsy_weak') && !warnSigns.includes('arm_weakness_abduction')) {
    negList.push('แขนและมือไม่อ่อนแรง ติดกระดุมได้ปกติ (No motor deficit)');
  }
  if (!warnSigns.includes('arm_numbness_fingers')) {
    negList.push('ไม่มีอาการชาตามแขนหรือปลายนิ้ว (No sensory deficit)');
  }
  if (!warnSigns.includes('gait_ataxia_spastic')) {
    negList.push('เดินได้ปกติ ขาไม่แข็งกระตุก ไม่เดินเซ (No spastic gait)');
  }
  if (!warnSigns.includes('nuchal_rigidity_headache') && !warnSigns.includes('diplopia_ptosis_horner') && !warnSigns.includes('facial_numb_speech')) {
    negList.push('ปฏิเสธคอแข็งก้มไม่ลง ภาพซ้อน หนังตาตก หรือปากเบี้ยว (No dissection/stroke signs)');
  }
  if (!warnSigns.includes('fever_chills')) {
    negList.push('ปฏิเสธไข้หนาวสั่น');
  }
  if (!warnSigns.includes('dysphagia_stridor')) {
    negList.push('กลืนได้ปกติ หายใจไม่มีเสียงหวีด (No airway compromise)');
  }
  if (!warnSigns.includes('chest_dyspnea_sweat')) {
    negList.push('ปฏิเสธแน่นหน้าอก หายใจหอบเหนื่อย หรือเหงื่อแตกตัวเย็น');
  }
  if (!warnSigns.includes('local_mass_wound_pus')) {
    negList.push('ไม่มีก้อนบวม แผล ตุ่มหนอง หรือฝีบริเวณคอบ่า');
  }
  if (!warnSigns.includes('cancer_weight_loss')) {
    negList.push('ปฏิเสธประวัติมะเร็งเดิม และน้ำหนักไม่ลดฮวบ');
  }
  if (patient.neckpainTraumaMaster === 'no') {
    negList.push('ปฏิเสธประวัติอุบัติเหตุหรือแรงกระแทกนำมาก่อน');
  }

  let text = `• ระยะเวลาที่มีอาการ: ${durStr}\n`;
  text += `• ตำแหน่งที่ปวด: ${formatNeckpainLocations(patient)}\n`;
  text += `• ลักษณะการเริ่มปวด: ${onsetStr}\n`;
  text += `• ลักษณะอาการปวด: ${formatNeckpainChars(patient)}\n`;
  text += `• การปวดร้าว: ${formatNeckpainRadiation(patient)}\n`;
  text += `• พฤติกรรมและปัจจัยกระตุ้น: ${formatNeckpainErgonomics(patient)}\n`;
  text += `• ระดับความเจ็บปวด (Pain Score): ${pScore}\n`;

  if (posList.length > 0) {
    text += `\n• Pertinent Positives:\n  - ${posList.join('\n  - ')}\n`;
  }
  if (negList.length > 0) {
    text += `\n• Pertinent Negatives:\n  - ${negList.join('\n  - ')}\n`;
  }

  return text.trim();
}

// --- Narrative Note Generator (Doctor View) ---
function renderNeckpainNarrative(patient) {
  const durStr = patient.durationVal
    ? `${patient.durationVal} ${patient.durationUnit === 'minutes' ? 'นาที' : (patient.durationUnit === 'hours' ? 'ชั่วโมง' : (patient.durationUnit === 'weeks' ? 'สัปดาห์' : (patient.durationUnit === 'months' ? 'เดือน' : (patient.durationUnit === 'years' ? 'ปี' : 'วัน'))))}`
    : 'ไม่ระบุระยะเวลา';

  const locStr = formatNeckpainLocations(patient);
  const charStr = formatNeckpainChars(patient);
  const radStr = formatNeckpainRadiation(patient);
  const pScore = (typeof patient.painScore === 'number' && patient.painScore > 0) ? `${patient.painScore}/10` : 'ไม่ได้ระบุ';

  const warnSigns = Array.isArray(patient.neckpainWarningSigns) ? patient.neckpainWarningSigns : [];

  let note = `ผู้ป่วย${patient.gender || ''} อายุ ${patient.age || 'ไม่ระบุ'} ปี มารับการตรวจที่ห้องฉุกเฉินด้วยอาการปวดต้นคอ/บ่า/หลังช่วงบน เป็นมา ${durStr} ก่อนมาโรงพยาบาล ตำแหน่งปวดบริเวณ${locStr} ลักษณะปวดเป็นแบบ${charStr} ${radStr} ระดับความเจ็บปวดประเมินได้ ${pScore} คะแนน`;

  if (warnSigns.length > 0) {
    const warnTexts = [];
    if (warnSigns.includes('hand_clumsy_weak')) warnTexts.push('มืออ่อนแรงหยิบของหลุดง่าย');
    if (warnSigns.includes('arm_weakness_abduction')) warnTexts.push('แขนอ่อนแรงยกไม่ขึ้น');
    if (warnSigns.includes('arm_numbness_fingers')) warnTexts.push('ชาตามแนวแขนหรือปลายนิ้ว');
    if (warnSigns.includes('gait_ataxia_spastic')) warnTexts.push('เดินเซขากระตุก');
    if (warnSigns.includes('nuchal_rigidity_headache')) warnTexts.push('ปวดท้ายทอยคอแข็งก้มไม่ลง');
    if (warnSigns.includes('diplopia_ptosis_horner')) warnTexts.push('เห็นภาพซ้อนหรือหนังตาตก');
    if (warnSigns.includes('facial_numb_speech')) warnTexts.push('หน้าชาหรือพูดไม่ชัด');
    if (warnSigns.includes('ataxia_vertigo_syncope')) warnTexts.push('วูบหน้ามืดหรือบ้านหมุน');
    if (warnSigns.includes('fever_chills')) warnTexts.push('มีไข้สูงหนาวสั่น');
    if (warnSigns.includes('dysphagia_stridor')) warnTexts.push('กลืนลำบากหรือหายใจมีเสียงหวีด');
    if (warnSigns.includes('chest_dyspnea_sweat')) warnTexts.push('แน่นหน้าอกหอบเหนื่อยเหงื่อแตก');
    if (warnSigns.includes('local_mass_wound_pus')) warnTexts.push('มีก้อน แผล หนอง ผื่น หรือฝีบริเวณคอบ่า');
    if (warnSigns.includes('cancer_weight_loss')) warnTexts.push('น้ำหนักลดลงฮวบผิดปกติ');
    note += ` ร่วมกับมีอาการสำคัญ: ${warnTexts.join(', ')}`;
  } else {
    note += ' ผู้ป่วยปฏิเสธอาการมืออ่อนแรง ชาตามแขน เดินเซ คอแข็งก้มไม่ลง ภาพซ้อน กลืนลำบาก และไม่มีไข้หนาวสั่น';
  }

  if (patient.neckpainTraumaMaster === 'yes') {
    const tTypes = Array.isArray(patient.neckpainTraumaTypes) ? patient.neckpainTraumaTypes : [];
    const tTexts = [];
    if (tTypes.includes('high_impact_mva_whiplash')) tTexts.push('อุบัติเหตุรถชน/คอกระชากสะบัด');
    if (tTypes.includes('fall_diving_head_neck')) tTexts.push('ตกจากที่สูง/หกล้ม/กระโดดน้ำศีรษะกระแทก');
    if (tTypes.includes('sports_neck_injury')) tTexts.push('อุบัติเหตุกระแทกคอจากการเล่นกีฬา');
    if (tTypes.includes('trauma_other') && patient.neckpainTraumaOtherText) tTexts.push(patient.neckpainTraumaOtherText);
    if (tTexts.length > 0) note += ` โดยมีประวัตินำมาก่อนคือ: ${tTexts.join(', ')}`;
  }

  return note;
}

function renderNeckpainDoctorHpi(patient) {
  return renderNeckpainRapidHpi(patient);
}

function updateNeckpainOutputs(rec) {
  const rapidText = renderNeckpainRapidHpi(rec);
  const narrativeText = renderNeckpainNarrative(rec);

  const rapidEl = document.getElementById('rapidTextView');
  const narrativeEl = document.getElementById('narrativeTextView');
  if (rapidEl) rapidEl.value = rapidText;
  if (narrativeEl) narrativeEl.value = narrativeText;

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

  rec.redFlags = evaluateNeckpainRedFlags(rec);
}
