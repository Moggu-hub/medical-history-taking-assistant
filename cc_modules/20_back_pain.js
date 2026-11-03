// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 20_back_pain.js
// อาการนำ: ปวดหลัง (Back Pain / Lumbago)
// รองรับ Zero Default Bias, ซ่อน Red Flags, Progressive Disclosure,
// Universal Date/Time, Rapid Note De-duplication และ TDD Core Guard
// =========================================================================

// --- Pain Score Touch State Tracking ---
let backpainPainScoreTouched = false;

function clearBackpainPainScore() {
  backpainPainScoreTouched = false;
  const slider = document.getElementById('backpainPainScore');
  if (slider) slider.value = 0;
  const emojiEl = document.getElementById('backpainPainScoreEmoji');
  const textEl = document.getElementById('backpainPainScoreText');
  const badgeEl = document.getElementById('backpainPainScoreBadge');
  const clearBtn = document.getElementById('backpainPainScoreClearBtn');
  if (emojiEl) emojiEl.textContent = '⚪';
  if (textEl) textEl.textContent = 'ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)';
  if (badgeEl) badgeEl.className = 'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all';
  if (clearBtn) clearBtn.classList.add('hidden');
}

function handleBackpainPainScoreChange(val) {
  backpainPainScoreTouched = true;
  const num = parseInt(val, 10);
  const emojiEl = document.getElementById('backpainPainScoreEmoji');
  const textEl = document.getElementById('backpainPainScoreText');
  const badgeEl = document.getElementById('backpainPainScoreBadge');
  const clearBtn = document.getElementById('backpainPainScoreClearBtn');
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
function toggleBackpainSideGroup(groupId, isVisible) {
  const el = document.getElementById(groupId);
  if (el) {
    el.classList.toggle('hidden', !isVisible);
    if (!isVisible) {
      el.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    }
  }
}

function toggleBackpainRadiationSub(isVisible) {
  const el = document.getElementById('backpainRadiationSub');
  if (el) {
    el.classList.toggle('hidden', !isVisible);
    if (!isVisible) {
      el.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    }
  }
}

function toggleBackpainWarningGroup(groupId, isVisible) {
  const el = document.getElementById(groupId);
  if (el) {
    el.classList.toggle('hidden', !isVisible);
    if (!isVisible) {
      el.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    }
  }
}

function toggleBackpainTraumaSub(isVisible) {
  const el = document.getElementById('backpainTraumaSub');
  if (el) {
    el.classList.toggle('hidden', !isVisible);
    if (!isVisible) {
      el.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
      const otherWrap = document.getElementById('backpainTraumaOtherWrap');
      if (otherWrap) otherWrap.classList.add('hidden');
      const otherInput = document.getElementById('backpainTraumaOtherText');
      if (otherInput) otherInput.value = '';
    }
  }
}

function toggleBackpainTraumaOther(isVisible) {
  const el = document.getElementById('backpainTraumaOtherWrap');
  if (el) {
    el.classList.toggle('hidden', !isVisible);
    if (!isVisible) {
      const input = document.getElementById('backpainTraumaOtherText');
      if (input) input.value = '';
    }
  }
}

// --- Clinical Red Flag Evaluator ---
function evaluateBackpainRedFlags(patient) {
  const rfs = [];
  if (!patient) return rfs;

  const warnSigns = Array.isArray(patient.backpainWarningSigns) ? patient.backpainWarningSigns : [];
  const traumaTypes = Array.isArray(patient.backpainTraumaTypes) ? patient.backpainTraumaTypes : [];
  const risks = Array.isArray(patient.backpainRisks) ? patient.backpainRisks : [];
  const charTypes = Array.isArray(patient.backpainChar) ? patient.backpainChar : [];
  const radLocs = Array.isArray(patient.backpainRadLoc) ? patient.backpainRadLoc : [];
  const behFactors = Array.isArray(patient.backpainBehavior) ? patient.backpainBehavior : [];
  const vs = patient.vital_signs || {};
  const sbp = typeof vs.sbp === 'number' ? vs.sbp : parseFloat(vs.sbp);
  const pr = typeof vs.pr === 'number' ? vs.pr : parseFloat(vs.pr);
  const bt = typeof vs.bt === 'number' ? vs.bt : parseFloat(vs.bt);
  const shockIndex = (sbp && pr) ? (pr / sbp) : 0;

  // 1. Aortic Dissection with Acute Lower Limb Ischemia (ESI 1)
  const isTearing = charTypes.includes('tearing_ripping');
  const isRadThoracoAbdomen = radLocs.includes('rad_abdomen_chest');
  const hasPulsatileMass = warnSigns.includes('pulsatile_abd_mass');
  const hasSyncope = warnSigns.includes('syncope_hypotension');
  const isHypotensive = (sbp && sbp < 90) || (shockIndex >= 0.9);
  const hasLimbIschemia = warnSigns.includes('ischemic_limb_pain') || warnSigns.includes('ischemic_limb_numbness');

  if (hasLimbIschemia) {
    rfs.push({
      key: 'rf_aortic_dissection_limb_ischemia',
      level: 1,
      textTh: 'สงสัยหลอดเลือดแดงใหญ่ฉีกขาดร่วมกับภาวะขาขาดเลือดเฉียบพลัน (Aortic Dissection with Acute Limb Ischemia)',
      risk: 'วิกฤตฉุกเฉินสูงสุด: ตรวจคลำ Femoral/Pedal pulses (Pulse deficit), Stat CT Angiography Whole Aorta with Runoff, ปรึกษาศัลยแพทย์หลอดเลือดทันที'
    });
  }

  // 1.1 Ruptured / Leaking AAA Risk (ESI 1)
  if ((isTearing || isRadThoracoAbdomen || hasPulsatileMass) && (hasSyncope || isHypotensive || hasPulsatileMass)) {
    rfs.push({
      key: 'rf_ruptured_aaa',
      level: 1,
      textTh: 'สงสัยหลอดเลือดแดงใหญ่ในช่องท้องแตกหรือฉีกขาด (Ruptured / Leaking AAA)',
      risk: 'วิกฤตเฉียบพลัน: เปิดเส้น IV เบอร์ใหญ่ 2 เส้น, สารน้ำ, จองเลือด PRC ด่วน, Stat Bedside U/S หรือ CT Angiography, ปรึกษาศัลยแพทย์หลอดเลือดทันที'
    });
  }

  // 2. Cauda Equina Syndrome (CES) Risk (ESI 1-2)
  const hasSaddle = warnSigns.includes('saddle_anesthesia');
  const hasRetention = warnSigns.includes('urinary_retention');
  const hasIncontinence = warnSigns.includes('bowel_incontinence');
  const hasBilateralWeakness = warnSigns.includes('leg_weakness_both');

  if (hasSaddle || (hasRetention && (hasBilateralWeakness || hasIncontinence))) {
    rfs.push({
      key: 'rf_cauda_equina_syndrome',
      level: 1,
      textTh: 'สงสัยภาวะรากประสาทไขสันหลังส่วนปลายถูกกดทับวิกฤต (Cauda Equina Syndrome)',
      risk: 'เสี่ยงอัมพาตและสูญเสียการขับถ่ายถาวร: งดน้ำงดอาหาร (NPO), Stat MRI Lumbosacral spine, ปรึกษาศัลยแพทย์กระดูกสันหลังเพื่อผ่าตัดฉุกเฉินภายใน 24-48 ชม.'
    });
  } else if (hasRetention || hasIncontinence || hasBilateralWeakness) {
    rfs.push({
      key: 'rf_cauda_equina_syndrome',
      level: 2,
      textTh: 'มีอาการเตือนระบบประสาทและขับถ่ายเสี่ยง Cauda Equina Syndrome',
      risk: 'ตรวจทางระบบประสาทอย่างละเอียด ตรวจ Post-void residual volume และพิจารณาเร่งส่งตรวจ MRI Spine'
    });
  }

  // 3. Spinal Epidural Abscess / Infection Risk (ESI 2)
  const hasFever = warnSigns.includes('fever_chills') || (bt && bt >= 38.5);
  const isHighRiskInfection = risks.includes('hemodialysis_catheter') || risks.includes('iv_drug_use') || traumaTypes.includes('recent_spine_procedure');

  if (hasFever && isHighRiskInfection) {
    rfs.push({
      key: 'rf_spinal_infection',
      level: 2,
      textTh: 'สงสัยฝีหรือการติดเชื้อในช่องไขสันหลัง (Spinal Epidural Abscess / Spondylodiscitis)',
      risk: 'เสี่ยงติดเชื้อในกระแสเลือดและกดทับไขสันหลัง: เจาะเลือดเพาะเชื้อ (H/C x 2), CBC, ESR, CRP, Stat MRI Spine with Contrast, เริ่มยาปฏิชีวนะ IV'
    });
  }

  // 4. Traumatic / Osteoporotic Spinal Fracture (ESI 2-3)
  const isSevereTrauma = traumaTypes.includes('severe_trauma_fall_mva');
  const isElderlyFall = traumaTypes.includes('elderly_minor_fall') && (patient.age >= 60 || risks.includes('osteoporosis') || risks.includes('steroid_immunosuppressed'));

  if (isSevereTrauma || isElderlyFall) {
    rfs.push({
      key: 'rf_spinal_fracture',
      level: 2,
      textTh: 'สงสัยกระดูกสันหลังหักหรือยุบตัวจากอุบัติเหตุ (Spinal Fracture)',
      risk: 'ระวังการเคลื่อนไหวของกระดูกสันหลัง (Spinal Immobilization / Log-roll), ส่งตรวจ Plain Film Spine หรือ CT Spine'
    });
  }

  // 5. Malignant Spinal Cord Compression / Metastasis Risk (ESI 2-3)
  const hasCancerHistory = risks.includes('known_cancer');
  const isNightPain = behFactors.includes('worse_night_supine');
  const hasWeightLoss = warnSigns.includes('weight_loss_anorexia');

  if (hasCancerHistory && (isNightPain || hasWeightLoss)) {
    rfs.push({
      key: 'rf_spinal_cord_compression_malignancy',
      level: 2,
      textTh: 'สงสัยมะเร็งลุกลามกระดูกสันหลัง (Spinal Malignancy / Metastasis)',
      risk: 'ส่งตรวจ Plain X-ray Spine, MRI Spine, ปรึกษาแพทย์เฉพาะทางมะเร็งและประเมินภาวะกดทับไขสันหลัง'
    });
  }

  // 6. Acute Radiculopathy with Foot Drop (ESI 3)
  const hasFootDrop = warnSigns.includes('foot_drop_single');
  if (hasFootDrop) {
    rfs.push({
      key: 'rf_radicular_foot_drop',
      level: 3,
      textTh: 'มีอาการปลายเท้าตกเฉียบพลัน (Acute Foot Drop / L5 Nerve Root Deficit)',
      risk: 'ประเมิน Motor power L5-S1, หลีกเลี่ยงการยกของหนัก และพิจารณาส่งต่อศัลยแพทย์กระดูกและข้อ'
    });
  }

  // 7. Urinary Tract Calculus with Obstruction / Renal Colic (ESI 3)
  const hasGravel = warnSigns.includes('gravel_sand_urine');
  const hasDysuria = warnSigns.includes('dysuria_hematuria');
  const hasFlank = Array.isArray(patient.backpainLoc) && patient.backpainLoc.includes('flank_side');
  if (hasGravel || (hasFlank && hasDysuria)) {
    rfs.push({
      key: 'rf_urinary_calculus_colic',
      level: 3,
      textTh: 'สงสัยนิ่วทางเดินปัสสาวะอุดกั้น / กรวยไตอักเสบ (Urinary Tract Calculus / Renal Colic)',
      risk: 'ตรวจปัสสาวะ (Urinalysis), KUB X-ray หรือ Bedside U/S KUB ประเมิน Hydronephrosis และให้ยาแก้ปวดลดการเกร็ง'
    });
  }

  return rfs;
}

// --- Clinical Decision Support Generator ---
function generateBackpainCds(patient, context) {
  const { rfs, ddxList, workupList, managementList } = context;
  const charTypes = Array.isArray(patient.backpainChar) ? patient.backpainChar : [];
  const radLocs = Array.isArray(patient.backpainRadLoc) ? patient.backpainRadLoc : [];
  const warnSigns = Array.isArray(patient.backpainWarningSigns) ? patient.backpainWarningSigns : [];
  const traumaTypes = Array.isArray(patient.backpainTraumaTypes) ? patient.backpainTraumaTypes : [];

  const hasLimbIschemia = rfs.some(r => r.key === 'rf_aortic_dissection_limb_ischemia');
  const hasAaa = rfs.some(r => r.key === 'rf_ruptured_aaa');
  const hasCes = rfs.some(r => r.key === 'rf_cauda_equina_syndrome');
  const hasInf = rfs.some(r => r.key === 'rf_spinal_infection');
  const hasFx = rfs.some(r => r.key === 'rf_spinal_fracture');
  const hasCalculus = rfs.some(r => r.key === 'rf_urinary_calculus_colic');
  const hasSciatica = radLocs.includes('rad_leg_below_knee');

  if (hasLimbIschemia) {
    ddxList.push('1. Acute Aortic Dissection (Stanford Type B) with Iliac/Femoral Occlusion');
    ddxList.push('2. Acute Lower Extremity Arterial Embolism / Limb Ischemia');
    ddxList.push('3. Ruptured or Leaking Abdominal Aortic Aneurysm (AAA)');
    workupList.push('ตรวจคลำ Femoral, Popliteal, Posterior Tibial และ Dorsalis Pedis pulses ทั้ง 2 ข้างทันที');
    workupList.push('Stat CT Angiography Whole Aorta with Bilateral Lower Extremities Runoff');
    workupList.push('เปิดเส้น IV เบอร์ 18 จำนวน 2 เส้น พร้อมส่งจองเลือด PRC 4 ยูนิต, FFP และ Coagulogram ด่วน');
    workupList.push('ตรวจ Bedside Vascular Doppler Ultrasound ประเมินสัญญาณชีพจรส่วนปลาย');
    managementList.push('งดน้ำและอาหาร (NPO) ทันที เตรียมเข้าห้องผ่าตัดฉุกเฉิน');
    managementList.push('ปรึกษา ศัลยแพทย์หลอดเลือด (Vascular Surgeon) ด่วนที่สุด');
    managementList.push('ควบคุมความดันโลหิตและอัตราการเต้นของหัวใจ (Target SBP 100-120 mmHg, HR < 60 bpm)');
    return;
  }

  if (hasAaa) {
    ddxList.push('1. Ruptured or Leaking Abdominal Aortic Aneurysm (AAA) (ความเร่งด่วนสูงสุด)');
    ddxList.push('2. Acute Aortic Dissection with Retroperitoneal Extension');
    ddxList.push('3. Severe Acute Mesenteric Ischemia');
    workupList.push('เปิดเส้น IV เบอร์ใหญ่ (18G) 2 เส้น พร้อมโหลด IV NSS/Acetar ด่วน');
    workupList.push('ส่งจองเลือด PRC 4 ยูนิต, FFP, Platelets ด่วน (Emergency Crossmatch)');
    workupList.push('Stat Bedside Ultrasound Abdomen (ประเมิน Aortic diameter) หรือ CT Angiography Whole Aorta');
    workupList.push('ส่งตรวจทางห้องปฏิบัติการ: CBC, Coagulogram, BUN, Cr, Electrolytes, Troponin-T');
    managementList.push('งดน้ำและอาหารทุกชนิด (NPO) ทันที');
    managementList.push('ประสานงานปรึกษา ศัลยแพทย์หลอดเลือด (Vascular Surgeon) เตรียมผ่าตัดฉุกเฉิน');
    managementList.push('ควบคุมความดันโลหิตและชีพจรอย่างใกล้ชิด (Target SBP 90-100 mmHg ในภาวะ permissive hypotension)');
    return;
  }

  if (hasCes) {
    ddxList.push('1. Cauda Equina Syndrome (CES) secondary to Massive Disc Herniation');
    ddxList.push('2. Epidural Hematoma / Epidural Abscess compressing Cauda Equina');
    ddxList.push('3. Acute Conus Medullaris Lesion');
    workupList.push('Stat MRI Lumbosacral Spine Whole Spine');
    workupList.push('สวนปัสสาวะเพื่อวัดปริมาณปัสสาวะคั่งค้าง (Post-Void Residual Volume) และคาสาย Foley catheter');
    workupList.push('ตรวจทางห้องปฏิบัติการเตรียมผ่าตัด: CBC, Coagulogram, BUN, Cr, Electrolytes');
    managementList.push('งดน้ำและอาหาร (NPO) เตรียมความพร้อมสำหรับการผ่าตัดคลายการกดทับ (Emergency Decompression)');
    managementList.push('ปรึกษา ศัลยแพทย์กระดูกสันหลัง (Spine Surgeon) หรือ ประสาทศัลยแพทย์ (Neurosurgeon) ทันที');
    managementList.push('บรรเทาอาการปวดด้วย IV Analgesics (เช่น Paracetamol IV / Tramadol)');
    return;
  }

  if (hasInf) {
    ddxList.push('1. Spinal Epidural Abscess (SEA) / Spondylodiscitis');
    ddxList.push('2. Acute Pyelonephritis with Retroperitoneal Abscess');
    ddxList.push('3. Vertebral Osteomyelitis');
    workupList.push('เพาะเชื้อในเลือด (Hemoculture x 2 bottles ต่างตำแหน่ง)');
    workupList.push('ส่งตรวจการอักเสบและการติดเชื้อ: CBC, ESR, hs-CRP, BUN, Cr, Electrolytes');
    workupList.push('Stat MRI Spine with Gadolinium Contrast');
    workupList.push('ตรวจปัสสาวะ (Urinalysis & Urine Culture)');
    managementList.push('เริ่มยาปฏิชีวนะทางหลอดเลือดดำ (Empiric IV Broad-spectrum Antibiotics) หลังส่ง Hemoculture');
    managementList.push('งดการกดนวดหรือดัดดึงกระดูกสันหลัง');
    managementList.push('ปรึกษา ศัลยแพทย์กระดูกและข้อ (Orthopedics) และ อายุรแพทย์โรคติดเชื้อ');
    return;
  }

  if (hasFx) {
    ddxList.push('1. Traumatic / Osteoporotic Vertebral Compression Fracture');
    ddxList.push('2. Spinal Burst Fracture with canal compromise');
    ddxList.push('3. Acute Severe Lumbar Sprain');
    workupList.push('ส่งตรวจ Plain Film Thoracolumbar / Lumbosacral Spine AP/Lateral');
    workupList.push('พิจารณา CT Spine บริเวณที่สงสัยการหักหรือยุบตัว เพื่อประเมินความมั่นคง (Spine Stability)');
    managementList.push('จำกัดการเคลื่อนไหวของกระดูกสันหลัง (Spinal Precautions, Log-roll)');
    managementList.push('ให้ยาแก้ปวดกลุ่ม Paracetamol และระมัดระวัง NSAIDs ในผู้สูงอายุที่มีไตเสื่อม');
    managementList.push('ปรึกษา ศัลยแพทย์กระดูกและข้อ เพื่อประเมินการใส่กายอุปกรณ์ (Brace) หรือผ่าตัดยึดกระดูก');
    return;
  }

  if (hasCalculus) {
    ddxList.push('1. Urinary Tract Calculus with Ureteric / Renal Colic');
    ddxList.push('2. Acute Pyelonephritis with Obstruction');
    ddxList.push('3. Musculoskeletal Flank Pain / Lumbar Sprain');
    workupList.push('ส่งตรวจปัสสาวะ (Urinalysis) เพื่อตรวจหา Microscopic Hematuria และภาวะติดเชื้อ');
    workupList.push('ส่งตรวจ Plain KUB หรือ Bedside Ultrasound KUB ประเมินภาวะไตบวมน้ำ (Hydronephrosis)');
    workupList.push('ตรวจการทำงานของไต: BUN, Cr, eGFR');
    managementList.push('ให้ยาแก้ปวดลดการอักเสบ: IV/Oral NSAIDs หรือ Paracetamol IV');
    managementList.push('ให้ยาลดการบีบเกร็งกล้ามเนื้อเรียบ (Antispasmodics) ตามดุลยพินิจแพทย์');
    managementList.push('แนะนำดื่มน้ำมากๆ และนัดตรวจติดตามที่คลินิกศัลยกรรมระบบทางเดินปัสสาวะ (Urology)');
    return;
  }

  if (hasSciatica) {
    ddxList.push('1. Acute Lumbar Disc Herniation with Radiculopathy (Sciatica)');
    ddxList.push('2. Lumbar Spinal Stenosis with Neurogenic Claudication');
    ddxList.push('3. Musculoskeletal Lumbago with Paraspinal Myofascial Pain');
    workupList.push('ตรวจประเมิน Straight Leg Raise (SLR), Femoral Stretch Test, Motor & Sensory L4, L5, S1');
    workupList.push('พิจารณา Plain Film L-S Spine AP/Lateral หากอาการไม่ดีขึ้นหรือมีข้อบ่งชี้');
    managementList.push('ให้ยาบรรเทาอาการปวดลดการอักเสบ: Oral NSAIDs (เช่น Ibuprofen หรือ Naproxen) พร้อมยาลดกรด');
    managementList.push('ให้ยารักษาอาการปวดประสาท: Pregabalin หรือ Gabapentin');
    managementList.push('ให้ยาคลายกล้ามเนื้อ (Muscle Relaxants) ในช่วงที่มีการเกร็งตัว');
    managementList.push('แนะนำหลีกเลี่ยงการก้มยกของหนัก การนั่งนาน และนัดตรวจติดตามที่คลินิกกระดูกและข้อ');
    return;
  }

  // Mechanical Lumbago / Strain (Standard Low-Risk)
  ddxList.push('1. Acute Mechanical Low Back Pain / Lumbago');
  ddxList.push('2. Paraspinal Muscle Strain / Sprain');
  ddxList.push('3. Facet Joint Syndrome');
  workupList.push('ตรวจคลำหากล้ามเนื้อเกร็งตัว (Paraspinal Muscle Spasm) และจุดกดเจ็บ (Trigger points)');
  workupList.push('ตรวจปัสสาวะ (Urinalysis) เพื่อแยกภาวะทางเดินปัสสาวะ');
  managementList.push('ให้ยาแก้ปวดลดการอักเสบ: Oral Paracetamol หรือ Short-course NSAIDs (3-5 วัน)');
  managementList.push('ให้ยาคลายกล้ามเนื้อ (Muscle Relaxants) รับประทานหลังอาหาร');
  managementList.push('แนะนำการประคบอุ่นและปรับเปลี่ยนพฤติกรรมท่าทาง ไม่แนะนำให้นอนพักบนเตียงนานเกินไป');
}

// --- Register Module to Core Knowledge Base ---
registerCcModule({
  id: 'back_pain',
  recordCc: 'back_pain',
  titleTh: 'ปวดหลัง',
  titleEn: 'Back pain / Lumbago',
  icon: 'activity',
  sectionDomId: 'back_painQuestionnaireSection',

  algorithm: {
    chiefComplaint: 'back_pain',
    titleTh: 'ปวดหลัง',
    schemaCode: 'back_pain',
    version: '2.0.0',
    redFlagDefinitions: [
      { key: 'rf_cauda_equina_syndrome', level: 1, textTh: 'Cauda Equina Syndrome / เส้นประสาทไขสันหลังส่วนปลายถูกกดทับวิกฤต (ชาอานม้า/ปัสสาวะคั่ง/ขาอ่อนแรงสองข้าง)' },
      { key: 'rf_aortic_dissection_limb_ischemia', level: 1, textTh: 'Aortic Dissection with Acute Lower Limb Ischemia (หลอดเลือดแดงใหญ่ฉีกขาดร่วมกับขาขาดเลือดเฉียบพลัน)' },
      { key: 'rf_ruptured_aaa', level: 1, textTh: 'Ruptured / Leaking AAA / สงสัยหลอดเลือดแดงใหญ่ในช่องท้องแตกหรือฉีกขาดทะลุหลัง' },
      { key: 'rf_spinal_infection', level: 2, textTh: 'Spinal Epidural Abscess / Spondylodiscitis (สงสัยฝีหรือการติดเชื้อรุนแรงในช่องไขสันหลัง)' },
      { key: 'rf_spinal_fracture', level: 2, textTh: 'Traumatic / Osteoporotic Spinal Fracture (สงสัยกระดูกสันหลังหักหรือยุบตัว)' },
      { key: 'rf_spinal_cord_compression_malignancy', level: 2, textTh: 'Malignant Spinal Cord Compression / สงสัยมะเร็งลุกลามกดทับไขสันหลัง' },
      { key: 'rf_radicular_foot_drop', level: 3, textTh: 'Acute Lumbar Radiculopathy with Foot Drop (รากประสาทถูกกดทับจนปลายเท้าตก)' },
      { key: 'rf_urinary_calculus_colic', level: 3, textTh: 'Urinary Tract Calculus with Obstruction / Renal Colic (สงสัยนิ่วทางเดินปัสสาวะอุดกั้น)' }
    ]
  },

  // --- HTML Template for Patient Intake Form ---
  formHtml: `
    <div id="back_painQuestionnaireSection" class="hidden space-y-6">

      <!-- CARD 1: ระยะเวลา และตำแหน่งที่ปวด (Location with Laterality) -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="clock" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">1. ระยะเวลาและตำแหน่งที่ปวด (Duration & Location)</h2>
            <p class="text-xs text-slate-500">ข้อมูลเบื้องต้นเกี่ยวกับระยะเวลาและตำแหน่งที่ท่านมีอาการปวดหลัง</p>
          </div>
        </div>

        <div class="space-y-4">
          <!-- 1.1 ระยะเวลาที่มีอาการ -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              มีอาการปวดหลังมานานเท่าไรแล้ว?
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div class="col-span-1 sm:col-span-2">
                <input type="number" id="backpainDurationVal" min="1" max="1000" placeholder="เช่น 2"
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm placeholder:text-slate-400">
              </div>
              <div class="col-span-1">
                <select id="backpainDurationUnit"
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm">
                  <option value="hours">ชั่วโมง</option>
                  <option value="days">วัน</option>
                  <option value="weeks">สัปดาห์</option>
                  <option value="months">เดือน</option>
                  <option value="years">ปี</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 1.2 ตำแหน่งที่ปวด (เรียงลำดับตาม Anatomy จากบนลงล่าง พร้อมระบุข้าง) -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              ตำแหน่งที่ปวด (เลือกได้หลายข้อ และระบุข้าง)
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <!-- 1. หลังช่วงกลาง / สะบัก (Mid Back / Thoracic) -->
              <div class="border border-slate-200 rounded-xl p-3 bg-white hover:border-medical-300 transition">
                <label class="flex items-start cursor-pointer">
                  <input type="checkbox" name="backpainLoc" value="mid_back_thoracic"
                    onchange="toggleBackpainSideGroup('thoracicSideGroup', this.checked)"
                    class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                  <div class="ml-3">
                    <span class="text-xs sm:text-sm font-semibold text-slate-800 block">หลังช่วงกลาง / สะบัก</span>
                    <span class="text-[11px] text-slate-500 font-normal block mt-0.5">บริเวณใต้คอลงมาถึงระดับใต้ราวนมด้านหลัง</span>
                  </div>
                </label>
                <div id="thoracicSideGroup" class="hidden pl-7 pt-2.5 mt-2 border-t border-slate-100 flex items-center space-x-2 text-xs">
                  <span class="text-slate-500 text-[11px] font-medium mr-1">ข้างที่ปวด:</span>
                  <label class="inline-flex items-center px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer">
                    <input type="checkbox" name="backpainLocThoracicSide" value="left" class="mr-1.5 h-3.5 w-3.5 text-medical-600 rounded">
                    <span>ซ้าย</span>
                  </label>
                  <label class="inline-flex items-center px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer">
                    <input type="checkbox" name="backpainLocThoracicSide" value="right" class="mr-1.5 h-3.5 w-3.5 text-medical-600 rounded">
                    <span>ขวา</span>
                  </label>
                  <label class="inline-flex items-center px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer">
                    <input type="checkbox" name="backpainLocThoracicSide" value="center" class="mr-1.5 h-3.5 w-3.5 text-medical-600 rounded">
                    <span>ตรงกลาง</span>
                  </label>
                </div>
              </div>

              <!-- 2. สีข้าง / บั้นเอวด้านข้าง (Flank Side) -->
              <div class="border border-slate-200 rounded-xl p-3 bg-white hover:border-medical-300 transition">
                <label class="flex items-start cursor-pointer">
                  <input type="checkbox" name="backpainLoc" value="flank_side"
                    onchange="toggleBackpainSideGroup('flankSideGroup', this.checked)"
                    class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                  <div class="ml-3">
                    <span class="text-xs sm:text-sm font-semibold text-slate-800 block">สีข้าง / บั้นเอวด้านข้าง</span>
                    <span class="text-[11px] text-slate-500 font-normal block mt-0.5">ชายโครงด้านข้างลงมาถึงเอว ระวังนิ่วทางเดินปัสสาวะหรือกรวยไต</span>
                  </div>
                </label>
                <div id="flankSideGroup" class="hidden pl-7 pt-2.5 mt-2 border-t border-slate-100 flex items-center space-x-2 text-xs">
                  <span class="text-slate-500 text-[11px] font-medium mr-1">ข้างที่ปวด:</span>
                  <label class="inline-flex items-center px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer">
                    <input type="checkbox" name="backpainLocFlankSide" value="left" class="mr-1.5 h-3.5 w-3.5 text-medical-600 rounded">
                    <span>ซ้าย</span>
                  </label>
                  <label class="inline-flex items-center px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer">
                    <input type="checkbox" name="backpainLocFlankSide" value="right" class="mr-1.5 h-3.5 w-3.5 text-medical-600 rounded">
                    <span>ขวา</span>
                  </label>
                </div>
              </div>

              <!-- 3. บั้นเอว / หลังช่วงล่าง (Low Back / Lumbar) -->
              <div class="border border-slate-200 rounded-xl p-3 bg-white hover:border-medical-300 transition">
                <label class="flex items-start cursor-pointer">
                  <input type="checkbox" name="backpainLoc" value="low_back_lumbar"
                    onchange="toggleBackpainSideGroup('lumbarSideGroup', this.checked)"
                    class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                  <div class="ml-3">
                    <span class="text-xs sm:text-sm font-semibold text-slate-800 block">บั้นเอว / หลังช่วงล่าง</span>
                    <span class="text-[11px] text-slate-500 font-normal block mt-0.5">เหนือสะโพกขึ้นมาถึงระดับเอว พบบ่อยในกล้ามเนื้อและหมอนรองกระดูก</span>
                  </div>
                </label>
                <div id="lumbarSideGroup" class="hidden pl-7 pt-2.5 mt-2 border-t border-slate-100 flex items-center space-x-2 text-xs">
                  <span class="text-slate-500 text-[11px] font-medium mr-1">ข้างที่ปวด:</span>
                  <label class="inline-flex items-center px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer">
                    <input type="checkbox" name="backpainLocLumbarSide" value="left" class="mr-1.5 h-3.5 w-3.5 text-medical-600 rounded">
                    <span>ซ้าย</span>
                  </label>
                  <label class="inline-flex items-center px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer">
                    <input type="checkbox" name="backpainLocLumbarSide" value="right" class="mr-1.5 h-3.5 w-3.5 text-medical-600 rounded">
                    <span>ขวา</span>
                  </label>
                  <label class="inline-flex items-center px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer">
                    <input type="checkbox" name="backpainLocLumbarSide" value="center" class="mr-1.5 h-3.5 w-3.5 text-medical-600 rounded">
                    <span>ตรงกลาง</span>
                  </label>
                </div>
              </div>

              <!-- 4. ก้นกบ / สะโพก (Sacrum / Coccyx / Gluteal) -->
              <div class="border border-slate-200 rounded-xl p-3 bg-white hover:border-medical-300 transition">
                <label class="flex items-start cursor-pointer">
                  <input type="checkbox" name="backpainLoc" value="sacrum_buttock"
                    onchange="toggleBackpainSideGroup('sacrumSideGroup', this.checked)"
                    class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                  <div class="ml-3">
                    <span class="text-xs sm:text-sm font-semibold text-slate-800 block">ก้นกบ / สะโพก</span>
                    <span class="text-[11px] text-slate-500 font-normal block mt-0.5">บริเวณแก้มก้น ข้อต่อเชิงกรานด้านหลัง</span>
                  </div>
                </label>
                <div id="sacrumSideGroup" class="hidden pl-7 pt-2.5 mt-2 border-t border-slate-100 flex items-center space-x-2 text-xs">
                  <span class="text-slate-500 text-[11px] font-medium mr-1">ข้างที่ปวด:</span>
                  <label class="inline-flex items-center px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer">
                    <input type="checkbox" name="backpainLocSacrumSide" value="left" class="mr-1.5 h-3.5 w-3.5 text-medical-600 rounded">
                    <span>ซ้าย</span>
                  </label>
                  <label class="inline-flex items-center px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer">
                    <input type="checkbox" name="backpainLocSacrumSide" value="right" class="mr-1.5 h-3.5 w-3.5 text-medical-600 rounded">
                    <span>ขวา</span>
                  </label>
                  <label class="inline-flex items-center px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer">
                    <input type="checkbox" name="backpainLocSacrumSide" value="center" class="mr-1.5 h-3.5 w-3.5 text-medical-600 rounded">
                    <span>ตรงกลาง</span>
                  </label>
                </div>
              </div>

              <!-- 5. ปวดระบมทั่วแผ่นหลัง (Diffuse) -->
              <div class="border border-slate-200 rounded-xl p-3 bg-white hover:border-medical-300 transition flex items-center sm:col-span-2">
                <label class="flex items-start cursor-pointer w-full">
                  <input type="checkbox" name="backpainLoc" value="diffuse"
                    class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                  <div class="ml-3">
                    <span class="text-xs sm:text-sm font-semibold text-slate-800 block">ปวดระบมทั่วแผ่นหลัง</span>
                    <span class="text-[11px] text-slate-500 font-normal block mt-0.5">ปวดตึงกระจายทั่วหลัง ไม่จำเพาะจุดใดจุดหนึ่ง</span>
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
                <input type="radio" name="backpainOnsetMode" value="sudden_severe" class="text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0 mt-0.5">
                <div class="ml-3">
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 block">ปวดรุนแรงทันทีทันใด (ฉับพลัน)</span>
                  <span class="text-[11px] text-slate-500 font-normal block mt-0.5">อาการปวดพุ่งขึ้นสูงสุดในไม่กี่วินาทีหรือนาทีแรก</span>
                </div>
              </label>
              <label class="selectable-card flex items-start p-3.5 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="backpainOnsetMode" value="gradual_worsening" class="text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0 mt-0.5">
                <div class="ml-3">
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 block">ค่อยๆ ปวดเพิ่มขึ้นเรื่อยๆ</span>
                  <span class="text-[11px] text-slate-500 font-normal block mt-0.5">เริ่มจากเมื่อย ตึง หรือปวดตื้อ แล้วค่อยๆ รุนแรงขึ้นตามเวลา</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 2: การปวดร้าว ลักษณะปวด และระดับความปวด (Radiation & Pain Profile) -->
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
          <!-- 2.1 มีอาการปวดร้าวไปที่อื่นหรือไม่ -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              อาการปวดร้าวไปบริเวณอื่น
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label class="selectable-card flex items-center p-3.5 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition"
                onclick="toggleBackpainRadiationSub(false)">
                <input type="radio" name="backpainRadMaster" value="none" class="text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ปวดเฉพาะที่หลัง ไม่ร้าวไปไหน</span>
              </label>
              <label class="selectable-card flex items-center p-3.5 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition"
                onclick="toggleBackpainRadiationSub(true)">
                <input type="radio" name="backpainRadMaster" value="yes" class="text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีปวดร้าวไปบริเวณอื่น</span>
              </label>
            </div>

            <!-- กล่องแตกกิ่ง: ระบุบริเวณที่ปวดร้าว -->
            <div id="backpainRadiationSub" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-3 space-y-2">
              <span class="text-xs font-bold text-slate-800 block mb-1 flex items-center">
                <i data-lucide="corner-down-right" class="w-3.5 h-3.5 mr-1 text-medical-600"></i> ระบุบริเวณที่ปวดร้าว (เลือกได้หลายข้อ)
              </span>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                  <input type="checkbox" name="backpainRadLoc" value="rad_leg_below_knee" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <span class="ml-2.5 text-xs font-medium text-slate-800">ร้าวลงขา/น่อง ต่ำกว่าเข่า (Sciatica)</span>
                </label>
                <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                  <input type="checkbox" name="backpainRadLoc" value="rad_buttock_thigh" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <span class="ml-2.5 text-xs font-medium text-slate-800">ร้าวลงสะโพก / ต้นขา</span>
                </label>
                <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                  <input type="checkbox" name="backpainRadLoc" value="rad_abdomen_chest" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <span class="ml-2.5 text-xs font-medium text-slate-800">ร้าวทะลุไปหน้าอก หรือหน้าท้อง</span>
                </label>
                <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                  <input type="checkbox" name="backpainRadLoc" value="rad_groin" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <span class="ml-2.5 text-xs font-medium text-slate-800">ร้าวลงขาหนีบ / อัณฑะ</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 2.2 ลักษณะของอาการปวด (พร้อมคำอธิบายเสริม) -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              ลักษณะอาการปวด (เลือกได้หลายข้อ)
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="backpainChar" value="dull_aching" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                <div class="ml-3">
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 block">ปวดตื้อๆ เมื่อย ระบม</span>
                  <span class="text-[11px] text-slate-500 font-normal block mt-0.5">เมื่อยล้า ตึงกล้ามเนื้อ ขยับตัวแล้วระบม</span>
                </div>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="backpainChar" value="sharp_stabbing" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                <div class="ml-3">
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 block">ปวดแปล๊บ / เสียบแทง</span>
                  <span class="text-[11px] text-slate-500 font-normal block mt-0.5">เจ็บแหลมขึ้นมาเป็นจังหวะเวลาขยับตัว</span>
                </div>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="backpainChar" value="electric_shock" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                <div class="ml-3">
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 block">ปวดจี๊ดเหมือนไฟช็อต</span>
                  <span class="text-[11px] text-slate-500 font-normal block mt-0.5">เสียวแปล๊บแล่นเป็นสายตามแนวประสาท</span>
                </div>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="backpainChar" value="tearing_ripping" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                <div class="ml-3">
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 block">ปวดฉีกขาด รุนแรงจัด</span>
                  <span class="text-[11px] text-slate-500 font-normal block mt-0.5">เจ็บรุนแรงเหมือนมีอะไรฉีกขาดอยู่ลึกๆ</span>
                </div>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="backpainChar" value="colicky_spasm" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                <div class="ml-3">
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 block">ปวดบิดเกร็ง เป็นพักๆ</span>
                  <span class="text-[11px] text-slate-500 font-normal block mt-0.5">บิดเกร็งแล้วคลายตัว สลับกันเป็นระลอก</span>
                </div>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="backpainChar" value="burning" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                <div class="ml-3">
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 block">ปวดแสบร้อนผิวหนัง</span>
                  <span class="text-[11px] text-slate-500 font-normal block mt-0.5">แสบร้อนบริเวณผิวหนัง สัมผัสโดนก็เจ็บ</span>
                </div>
              </label>
            </div>
          </div>

          <!-- 2.3 ปัจจัยกระตุ้นและบรรเทา -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              พฤติกรรมกับอาการปวด (เลือกได้หลายข้อ)
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="backpainBehavior" value="worse_cough_strain" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                <div class="ml-3">
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 block">ปวดมากขึ้นเมื่อไอ จาม หรือเบ่ง</span>
                  <span class="text-[11px] text-slate-500 font-normal block mt-0.5">อาการสะเทือนลงหลังหรือลงขาทันที</span>
                </div>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="backpainBehavior" value="worse_night_supine" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                <div class="ml-3">
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 block">ปวดมากตอนกลางคืน นอนพักไม่ทุเลา</span>
                  <span class="text-[11px] text-slate-500 font-normal block mt-0.5">นอนพักนิ่งๆ บนเตียงก็ยังปวดจนสะดุ้งตื่น</span>
                </div>
              </label>
            </div>
          </div>

          <!-- 2.4 ระดับความเจ็บปวด (Universal Slider 0-10) -->
          <div>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
              <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                ระดับความเจ็บปวด (Pain Score 0-10)
              </label>
              <div class="flex items-center space-x-2">
                <span id="backpainPainScoreBadge" class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all">
                  <span id="backpainPainScoreEmoji">⚪</span>
                  <span id="backpainPainScoreText">ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)</span>
                </span>
                <button type="button" id="backpainPainScoreClearBtn" onclick="clearBackpainPainScore()" class="hidden text-xs text-slate-400 hover:text-slate-600 underline">ล้างค่า</button>
              </div>
            </div>
            <div class="pt-2 px-1">
              <input type="range" id="backpainPainScore" min="0" max="10" value="0"
                oninput="handleBackpainPainScoreChange(this.value)"
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

      <!-- CARD 3: สัญญาณเตือน สภาวะอันตราย / ความเสี่ยงสูง (Warning Signs) -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="shield-alert" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">3. สัญญาณเตือน สภาวะอันตราย / ความเสี่ยงสูง (Warning Signs)</h2>
            <p class="text-xs text-slate-500">คัดกรองอาการทางระบบประสาท ขา การขับถ่าย ภาวะติดเชื้อ และหลอดเลือด</p>
          </div>
        </div>

        <div class="space-y-3">
          <!-- กลุ่ม 1: อ่อนแรง / ชา / ปวด ช่วงล่างหรือขาร่วมด้วย (Progressive Parent) -->
          <div class="border border-slate-200 rounded-xl p-3 bg-white hover:border-medical-300 transition">
            <label class="flex items-start cursor-pointer">
              <input type="checkbox" id="backpainWarningNeuroParent"
                onchange="toggleBackpainWarningGroup('backpainWarningNeuroSub', this.checked)"
                class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
              <div class="ml-3">
                <span class="text-xs sm:text-sm font-semibold text-slate-800 block">อ่อนแรง / ชา / ปวด ช่วงล่างหรือขาร่วมด้วย</span>
                <span class="text-[11px] text-slate-500 font-normal block mt-0.5">มีอาการผิดปกติบริเวณขา เท้า หรือความรู้สึกช่วงล่าง</span>
              </div>
            </label>
            <div id="backpainWarningNeuroSub" class="hidden pl-7 pt-3 mt-2 border-t border-slate-100 space-y-2">
              <span class="text-[11px] font-bold text-slate-700 block mb-1">
                ระบุรายละเอียดอาการที่พบ (เลือกได้หลายข้อ):
              </span>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" name="backpainWarningSigns" value="saddle_anesthesia" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <span class="ml-2.5 text-xs font-medium text-slate-800">ชาบริเวณก้น แก้มก้น หว่างขา หรือรอบรูทวาร</span>
                </label>
                <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" name="backpainWarningSigns" value="leg_weakness_both" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <span class="ml-2.5 text-xs font-medium text-slate-800">ขาอ่อนแรงทั้งสองข้าง เดินไม่ไหว หรือขาทรุด</span>
                </label>
                <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" name="backpainWarningSigns" value="foot_drop_single" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <span class="ml-2.5 text-xs font-medium text-slate-800">ปลายเท้าตก กระดกข้อเท้าหรือนิ้วเท้าไม่ขึ้น</span>
                </label>
                <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" name="backpainWarningSigns" value="numbness_leg_foot" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <span class="ml-2.5 text-xs font-medium text-slate-800">ชาตามแนวขา น่อง หรือหลังเท้า</span>
                </label>
                <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" name="backpainWarningSigns" value="ischemic_limb_pain" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <span class="ml-2.5 text-xs font-medium text-slate-800">ปวดรุนแรงเหมือนเนื้อจะระเบิด ลึกๆ อยู่ในน่องหรือเท้า</span>
                </label>
                <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" name="backpainWarningSigns" value="ischemic_limb_numbness" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <span class="ml-2.5 text-xs font-medium text-slate-800">ไม่สามารถรู้สึกถึงสัมผัสใดๆที่ขาหรือปลายเท้าได้เลย</span>
                </label>
              </div>
            </div>
          </div>

          <!-- กลุ่ม 2: มีปัญหาการขับถ่ายอุจจาระ / ปัสสาวะ (Progressive Parent) -->
          <div class="border border-slate-200 rounded-xl p-3 bg-white hover:border-medical-300 transition">
            <label class="flex items-start cursor-pointer">
              <input type="checkbox" id="backpainWarningExcretoryParent"
                onchange="toggleBackpainWarningGroup('backpainWarningExcretorySub', this.checked)"
                class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
              <div class="ml-3">
                <span class="text-xs sm:text-sm font-semibold text-slate-800 block">มีปัญหาการขับถ่ายอุจจาระ / ปัสสาวะ</span>
                <span class="text-[11px] text-slate-500 font-normal block mt-0.5">กลั้นไม่ได้ ปัสสาวะไม่ออก หรือมีความผิดปกติของน้ำปัสสาวะ</span>
              </div>
            </label>
            <div id="backpainWarningExcretorySub" class="hidden pl-7 pt-3 mt-2 border-t border-slate-100 space-y-2">
              <span class="text-[11px] font-bold text-slate-700 block mb-1">
                ระบุรายละเอียดความผิดปกติ (เลือกได้หลายข้อ):
              </span>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" name="backpainWarningSigns" value="bowel_incontinence" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <span class="ml-2.5 text-xs font-medium text-slate-800">กลั้นอุจจาระไม่ได้ เล็ดราดโดยไม่รู้ตัว</span>
                </label>
                <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" name="backpainWarningSigns" value="urinary_retention" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <span class="ml-2.5 text-xs font-medium text-slate-800">ปัสสาวะไม่ออกเลย หรือปวดตึงแน่นท้องน้อย</span>
                </label>
                <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" name="backpainWarningSigns" value="dysuria_hematuria" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <span class="ml-2.5 text-xs font-medium text-slate-800">ปัสสาวะแสบขัด หรือปัสสาวะเป็นเลือด</span>
                </label>
                <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" name="backpainWarningSigns" value="gravel_sand_urine" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <span class="ml-2.5 text-xs font-medium text-slate-800">ปัสสาวะปนตะกอน คล้ายกรวดทราย</span>
                </label>
              </div>
            </div>
          </div>

          <!-- รายการเตือน Standalone (4 ข้อ) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div class="border border-slate-200 rounded-xl p-3 bg-white hover:border-medical-300 transition">
              <label class="flex items-start cursor-pointer">
                <input type="checkbox" name="backpainWarningSigns" value="fever_chills"
                  class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                <div class="ml-3">
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 block">มีไข้สูง หนาวสั่นสะท้าน</span>
                  <span class="text-[11px] text-slate-500 font-normal block mt-0.5">ตัวร้อน วัดอุณหภูมิได้สูง หรือมีอาการสั่นสะท้าน</span>
                </div>
              </label>
            </div>
            <div class="border border-slate-200 rounded-xl p-3 bg-white hover:border-medical-300 transition">
              <label class="flex items-start cursor-pointer">
                <input type="checkbox" name="backpainWarningSigns" value="syncope_hypotension"
                  class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                <div class="ml-3">
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 block">หน้ามืด วูบ เป็นลม เหงื่อแตกตัวเย็น</span>
                  <span class="text-[11px] text-slate-500 font-normal block mt-0.5">รู้สึกวูบคล้ายจะหมดสติ หรือความดันโลหิตตก</span>
                </div>
              </label>
            </div>
            <div class="border border-slate-200 rounded-xl p-3 bg-white hover:border-medical-300 transition">
              <label class="flex items-start cursor-pointer">
                <input type="checkbox" name="backpainWarningSigns" value="pulsatile_abd_mass"
                  class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                <div class="ml-3">
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 block">คลำเจอก้อนเต้นตุบๆ ในช่องท้อง</span>
                  <span class="text-[11px] text-slate-500 font-normal block mt-0.5">คลำได้ก้อนเต้นตามจังหวะชีพจรบริเวณกลางท้อง</span>
                </div>
              </label>
            </div>
            <div class="border border-slate-200 rounded-xl p-3 bg-white hover:border-medical-300 transition">
              <label class="flex items-start cursor-pointer">
                <input type="checkbox" name="backpainWarningSigns" value="weight_loss_anorexia"
                  class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
                <div class="ml-3">
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 block">น้ำหนักลดลงฮวบผิดปกติ เบื่ออาหาร</span>
                  <span class="text-[11px] text-slate-500 font-normal block mt-0.5">น้ำหนักตัวลดลงชัดเจนโดยไม่ได้ตั้งใจลด หรือเบื่ออาหารเรื้อรัง</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 4: ประวัติอุบัติเหตุ และหัตถการกระดูกสันหลัง (พร้อม อื่นๆ กรอกอิสระ) -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="alert-triangle" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">4. ประวัติอุบัติเหตุ และหัตถการกระดูกสันหลัง (Trauma & Procedures)</h2>
            <p class="text-xs text-slate-500">การบาดเจ็บ การยกของหนัก หรือการทำหัตถการบริเวณกระดูกสันหลัง</p>
          </div>
        </div>

        <div class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label class="selectable-card flex items-center p-3.5 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition"
              onclick="toggleBackpainTraumaSub(false)">
              <input type="radio" name="backpainTraumaMaster" value="no" class="text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0">
              <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่มีประวัติอุบัติเหตุหรือหัตถการ</span>
            </label>
            <label class="selectable-card flex items-center p-3.5 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition"
              onclick="toggleBackpainTraumaSub(true)">
              <input type="radio" name="backpainTraumaMaster" value="yes" class="text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0">
              <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีประวัติอุบัติเหตุ บาดเจ็บ หรือหัตถการ</span>
            </label>
          </div>

          <!-- กล่องแตกกิ่ง: เจาะลึกอุบัติเหตุและหัตถการ -->
          <div id="backpainTraumaSub" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <span class="text-xs font-bold text-slate-800 block mb-1 flex items-center">
              <i data-lucide="corner-down-right" class="w-3.5 h-3.5 mr-1 text-medical-600"></i> ระบุเหตุการณ์ที่เกิดขึ้น (เลือกได้หลายข้อ)
            </span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                <input type="checkbox" name="backpainTraumaTypes" value="severe_trauma_fall_mva" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-2.5 text-xs font-medium text-slate-800">อุบัติเหตุรุนแรง (ตกจากที่สูง / รถชน / กระแทกแรง)</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                <input type="checkbox" name="backpainTraumaTypes" value="elderly_minor_fall" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-2.5 text-xs font-medium text-slate-800">ลื่นล้มก้นกระแทก / สะดุดล้ม (ผู้สูงอายุ)</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                <input type="checkbox" name="backpainTraumaTypes" value="heavy_lifting" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-2.5 text-xs font-medium text-slate-800">ยกของหนัก / เอี้ยวตัวก้มบิดผิดจังหวะ</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                <input type="checkbox" name="backpainTraumaTypes" value="recent_spine_procedure" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-2.5 text-xs font-medium text-slate-800">เพิ่งผ่าตัดหลัง / เจาะหลัง / ฉีดยาชาบล็อกหลัง (ใน 1 เดือน)</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer"
                onchange="toggleBackpainTraumaOther(document.getElementById('backpainTraumaOtherCb').checked)">
                <input type="checkbox" id="backpainTraumaOtherCb" name="backpainTraumaTypes" value="trauma_other" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-2.5 text-xs font-medium text-slate-800">อื่นๆ (ระบุเพิ่มเติม)</span>
              </label>
            </div>

            <!-- ช่องพิมพ์ข้อความอิสระเมื่อเลือก อื่นๆ -->
            <div id="backpainTraumaOtherWrap" class="hidden pt-1">
              <input type="text" id="backpainTraumaOtherText" placeholder="พิมพ์ระบุเหตุการณ์หรืออุบัติเหตุเพิ่มเติม..."
                class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500">
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 5: ประวัติความเสี่ยงเฉพาะโรค (Specific Risk Factors) -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="file-text" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">5. ประวัติความเสี่ยงเฉพาะโรค (Specific Risk Factors)</h2>
            <p class="text-xs text-slate-500">ปัจจัยเสี่ยงของโรคกระดูกสันหลังติดเชื้อ มะเร็งลุกลาม และกระดูกพรุน</p>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            ประวัติความเสี่ยงส่วนตัว (เลือกได้หลายข้อ)
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" name="backpainRisks" value="known_cancer" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีประวัติโรคมะเร็งเดิม (เต้านม ปอด ต่อมลูกหมาก ไต)</span>
            </label>
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" name="backpainRisks" value="steroid_immunosuppressed" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">กินยาสเตียรอยด์ต่อเนื่อง / ภูมิคุ้มกันบกพร่อง</span>
            </label>
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" name="backpainRisks" value="hemodialysis_catheter" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ฟอกไตทางเส้นเลือด / มีสายสวนค้างในร่างกาย</span>
            </label>
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" name="backpainRisks" value="iv_drug_use" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ประวัติฉีดยาเสพติดเข้าเส้นเลือด</span>
            </label>
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" name="backpainRisks" value="osteoporosis" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ตรวจพบโรคกระดูกพรุนเดิม</span>
            </label>
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" name="backpainRisks" value="risks_none" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่มีประวัติความเสี่ยงข้างต้น</span>
            </label>
          </div>
        </div>
      </div>

      <!-- CARD 6: อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100">
          <div class="bg-slate-100 text-slate-600 p-2 rounded-xl">
            <i data-lucide="message-square-plus" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-800">อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2>
            <p class="text-xs text-slate-500">ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี เช่น ขาบวม ชาปลายนิ้ว หรือเวียนศีรษะ)</p>
          </div>
        </div>
        <textarea id="backpain_other_free" rows="2" placeholder="พิมพ์ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)..."
          class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"></textarea>
      </div>

    </div>
  `,

  // --- Mounting & Event Listeners Hook ---
  onMounted: function() {
    clearBackpainPainScore();
  },

  // --- Collect Intake Hook ---
  collectIntake: function(ctx) {
    const _rawDur = parseFloat(document.getElementById('backpainDurationVal')?.value);
    const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
    const durationUnit = document.getElementById('backpainDurationUnit')?.value || 'days';

    const backpainLoc = Array.from(document.querySelectorAll('input[name="backpainLoc"]:checked')).map(el => el.value);
    const backpainLocLumbarSide = Array.from(document.querySelectorAll('input[name="backpainLocLumbarSide"]:checked')).map(el => el.value);
    const backpainLocThoracicSide = Array.from(document.querySelectorAll('input[name="backpainLocThoracicSide"]:checked')).map(el => el.value);
    const backpainLocSacrumSide = Array.from(document.querySelectorAll('input[name="backpainLocSacrumSide"]:checked')).map(el => el.value);
    const backpainLocFlankSide = Array.from(document.querySelectorAll('input[name="backpainLocFlankSide"]:checked')).map(el => el.value);

    const backpainOnsetMode = document.querySelector('input[name="backpainOnsetMode"]:checked')?.value || '';

    const backpainRadMaster = document.querySelector('input[name="backpainRadMaster"]:checked')?.value || 'none';
    const backpainRadLoc = backpainRadMaster === 'yes'
      ? Array.from(document.querySelectorAll('input[name="backpainRadLoc"]:checked')).map(el => el.value)
      : [];

    const backpainChar = Array.from(document.querySelectorAll('input[name="backpainChar"]:checked')).map(el => el.value);
    const backpainBehavior = Array.from(document.querySelectorAll('input[name="backpainBehavior"]:checked')).map(el => el.value);

    let painScore = 0;
    if (backpainPainScoreTouched) {
      const pSlider = document.getElementById('backpainPainScore');
      if (pSlider) painScore = parseInt(pSlider.value, 10);
    }

    const backpainWarningSigns = Array.from(document.querySelectorAll('input[name="backpainWarningSigns"]:checked')).map(el => el.value);
    const backpainWarningNeuroParent = !!document.getElementById('backpainWarningNeuroParent')?.checked;
    const backpainWarningExcretoryParent = !!document.getElementById('backpainWarningExcretoryParent')?.checked;

    const backpainTraumaMaster = document.querySelector('input[name="backpainTraumaMaster"]:checked')?.value || 'no';
    const backpainTraumaTypes = backpainTraumaMaster === 'yes'
      ? Array.from(document.querySelectorAll('input[name="backpainTraumaTypes"]:checked')).map(el => el.value)
      : [];
    const backpainTraumaOtherText = document.getElementById('backpainTraumaOtherText')?.value?.trim() || '';

    const backpainRisks = Array.from(document.querySelectorAll('input[name="backpainRisks"]:checked')).map(el => el.value);
    const otherSymptomsFree = document.getElementById('backpain_other_free')?.value?.trim() || ctx.otherSymptomsFree || '';

    const rec = {
      id: ctx.recordId,
      queue_number: ctx.queueNumber,
      hn: ctx.randomHn,
      name: ctx.patientName,
      age: ctx.patientAge,
      gender: ctx.gender,
      chief_complaint: 'back_pain',
      chief_complaint_title: 'ปวดหลัง',
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

      backpainLoc,
      backpainLocLumbarSide,
      backpainLocThoracicSide,
      backpainLocSacrumSide,
      backpainLocFlankSide,
      backpainOnsetMode,
      backpainRadMaster,
      backpainRadLoc,
      backpainChar,
      backpainBehavior,
      painScore,
      backpainWarningSigns,
      backpainWarningNeuroParent,
      backpainWarningExcretoryParent,
      backpainTraumaMaster,
      backpainTraumaTypes,
      backpainTraumaOtherText,
      backpainRisks
    };

    updateBackpainOutputs(rec);
    return rec;
  },

  // --- Populate / Hydrate Form Hook ---
  populateForm: function(patient) {
    if (!patient) return;

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val !== undefined && val !== null ? val : '';
    };

    setVal('backpainDurationVal', patient.durationVal);
    setVal('backpainDurationUnit', patient.durationUnit || 'days');

    const setCheckedArr = (name, arr) => {
      if (!Array.isArray(arr)) return;
      document.querySelectorAll(`input[name="${name}"]`).forEach(cb => {
        cb.checked = arr.includes(cb.value);
      });
    };

    setCheckedArr('backpainLoc', patient.backpainLoc);
    setCheckedArr('backpainLocLumbarSide', patient.backpainLocLumbarSide);
    setCheckedArr('backpainLocThoracicSide', patient.backpainLocThoracicSide);
    setCheckedArr('backpainLocSacrumSide', patient.backpainLocSacrumSide);
    setCheckedArr('backpainLocFlankSide', patient.backpainLocFlankSide);

    // Sync sub-side toggle visibility
    const locs = Array.isArray(patient.backpainLoc) ? patient.backpainLoc : [];
    toggleBackpainSideGroup('lumbarSideGroup', locs.includes('low_back_lumbar'));
    toggleBackpainSideGroup('thoracicSideGroup', locs.includes('mid_back_thoracic'));
    toggleBackpainSideGroup('sacrumSideGroup', locs.includes('sacrum_buttock'));
    toggleBackpainSideGroup('flankSideGroup', locs.includes('flank_side'));

    if (patient.backpainOnsetMode) {
      const r = document.querySelector(`input[name="backpainOnsetMode"][value="${patient.backpainOnsetMode}"]`);
      if (r) r.checked = true;
    }

    if (patient.backpainRadMaster) {
      const r = document.querySelector(`input[name="backpainRadMaster"][value="${patient.backpainRadMaster}"]`);
      if (r) r.checked = true;
    }
    toggleBackpainRadiationSub(patient.backpainRadMaster === 'yes');
    setCheckedArr('backpainRadLoc', patient.backpainRadLoc);

    setCheckedArr('backpainChar', patient.backpainChar);
    setCheckedArr('backpainBehavior', patient.backpainBehavior);

    if (typeof patient.painScore === 'number' && patient.painScore >= 0) {
      const slider = document.getElementById('backpainPainScore');
      if (slider) slider.value = patient.painScore;
      handleBackpainPainScoreChange(patient.painScore);
    } else {
      clearBackpainPainScore();
    }

    setCheckedArr('backpainWarningSigns', patient.backpainWarningSigns);
    const warnSigns = Array.isArray(patient.backpainWarningSigns) ? patient.backpainWarningSigns : [];
    const neuroKeys = ['saddle_anesthesia', 'leg_weakness_both', 'foot_drop_single', 'numbness_leg_foot', 'ischemic_limb_pain', 'ischemic_limb_numbness'];
    const hasNeuro = patient.backpainWarningNeuroParent || warnSigns.some(k => neuroKeys.includes(k));
    const pNeuro = document.getElementById('backpainWarningNeuroParent');
    if (pNeuro) pNeuro.checked = !!hasNeuro;
    toggleBackpainWarningGroup('backpainWarningNeuroSub', !!hasNeuro);

    const excretoryKeys = ['bowel_incontinence', 'urinary_retention', 'dysuria_hematuria', 'gravel_sand_urine'];
    const hasExcretory = patient.backpainWarningExcretoryParent || warnSigns.some(k => excretoryKeys.includes(k));
    const pExcretory = document.getElementById('backpainWarningExcretoryParent');
    if (pExcretory) pExcretory.checked = !!hasExcretory;
    toggleBackpainWarningGroup('backpainWarningExcretorySub', !!hasExcretory);

    if (patient.backpainTraumaMaster) {
      const r = document.querySelector(`input[name="backpainTraumaMaster"][value="${patient.backpainTraumaMaster}"]`);
      if (r) r.checked = true;
    }
    toggleBackpainTraumaSub(patient.backpainTraumaMaster === 'yes');
    setCheckedArr('backpainTraumaTypes', patient.backpainTraumaTypes);

    const hasOtherTrauma = Array.isArray(patient.backpainTraumaTypes) && patient.backpainTraumaTypes.includes('trauma_other');
    toggleBackpainTraumaOther(hasOtherTrauma);
    setVal('backpainTraumaOtherText', patient.backpainTraumaOtherText);

    setCheckedArr('backpainRisks', patient.backpainRisks);
    setVal('backpain_other_free', patient.otherSymptomsFree);
  },

  // --- Reset Form Hook ---
  resetForm: function() {
    const ids = ['backpainDurationVal', 'backpainTraumaOtherText', 'backpain_other_free'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const unitEl = document.getElementById('backpainDurationUnit');
    if (unitEl) unitEl.value = 'days';

    const radios = ['backpainOnsetMode', 'backpainRadMaster', 'backpainTraumaMaster'];
    radios.forEach(name => {
      document.querySelectorAll(`input[name="${name}"]`).forEach(r => { r.checked = false; });
    });

    const cbs = [
      'backpainLoc', 'backpainLocLumbarSide', 'backpainLocThoracicSide',
      'backpainLocSacrumSide', 'backpainLocFlankSide', 'backpainRadLoc', 'backpainChar',
      'backpainBehavior', 'backpainWarningSigns', 'backpainTraumaTypes', 'backpainRisks'
    ];
    cbs.forEach(name => {
      document.querySelectorAll(`input[name="${name}"]`).forEach(cb => { cb.checked = false; });
    });

    ['backpainWarningNeuroParent', 'backpainWarningExcretoryParent'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.checked = false;
    });

    ['lumbarSideGroup', 'thoracicSideGroup', 'sacrumSideGroup', 'flankSideGroup',
     'backpainRadiationSub', 'backpainWarningNeuroSub', 'backpainWarningExcretorySub',
     'backpainTraumaSub', 'backpainTraumaOtherWrap'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });

    clearBackpainPainScore();
  },

  // --- Clinical Output Generators ---
  hydrateForm: function(patient) {
    this.populateForm(patient);
  },
  isRedFlag: function(patient) {
    return evaluateBackpainRedFlags(patient).length > 0;
  },
  updateOutputs: updateBackpainOutputs,
  renderRapidHpi: renderBackpainRapidHpi,
  renderNarrative: renderBackpainNarrative,
  renderDoctorHpi: renderBackpainDoctorHpi,
  evaluateRedFlags: evaluateBackpainRedFlags,
  generateCds: generateBackpainCds,

  // --- Seed Patients Registry ---
  seedPatients: [
    // Case 1: Suspected Cauda Equina Syndrome (ESI 2)
    {
      id: 'case-backpain-01',
      queue_number: 'E2-091',
      hn: '6788501',
      name: 'นายประสิทธิ์ ชาหว่างขา',
      age: 52,
      gender: 'ชาย',
      chief_complaint: 'back_pain',
      chief_complaint_title: 'ปวดหลัง',
      timestamp: '2026-10-31T08:30:00.000Z',
      status: 'waiting',
      durationVal: 8,
      durationUnit: 'hours',
      hospRecordStatus: 'complete',
      underlying: ['ความดันสูง (HT)'],
      drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร',
      currentMeds: 'Amlodipine (5 mg) 1 tab po od',
      otherSymptomsFree: 'ปวดหลังรุนแรง ชาหว่างขา ปัสสาวะไม่ออก ขาไม่มีแรงก้าวเดิน',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.8, sbp: 135, dbp: 85, bp: '135/85', pr: 88, rr: 18, spo2: 99 },
      esi_level: 2,

      backpainLoc: ['low_back_lumbar'],
      backpainLocLumbarSide: ['center', 'left', 'right'],
      backpainLocThoracicSide: [],
      backpainLocSacrumSide: [],
      backpainLocFlankSide: [],
      backpainOnsetMode: 'sudden_severe',
      backpainRadMaster: 'yes',
      backpainRadLoc: ['rad_leg_below_knee', 'rad_buttock_thigh'],
      backpainChar: ['sharp_stabbing', 'electric_shock'],
      backpainBehavior: ['worse_cough_strain'],
      painScore: 8,
      backpainWarningSigns: ['saddle_anesthesia', 'urinary_retention', 'leg_weakness_both'],
      backpainWarningNeuroParent: true,
      backpainWarningExcretoryParent: true,
      backpainTraumaMaster: 'yes',
      backpainTraumaTypes: ['heavy_lifting'],
      backpainTraumaOtherText: '',
      backpainRisks: ['risks_none']
    },

    // Case 2: Suspected Ruptured/Leaking AAA (ESI 1)
    {
      id: 'case-backpain-02',
      queue_number: 'E1-092',
      hn: '6788502',
      name: 'นายสมชาย แน่นทะลุหลัง',
      age: 71,
      gender: 'ชาย',
      chief_complaint: 'back_pain',
      chief_complaint_title: 'ปวดหลัง',
      timestamp: '2026-10-31T09:00:00.000Z',
      status: 'waiting',
      durationVal: 1,
      durationUnit: 'hours',
      hospRecordStatus: 'complete',
      underlying: ['ความดันสูง (HT)', 'ไขมันในเลือดสูง (DLP)'],
      drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร',
      currentMeds: 'Enalapril (10 mg), Simvastatin (20 mg)',
      otherSymptomsFree: 'ปวดหลังแน่นทะลุหน้าท้อง วูบจะเป็นลม เหงื่อแตกตัวเย็น',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.4, sbp: 85, dbp: 50, bp: '85/50', pr: 124, rr: 26, spo2: 94 },
      esi_level: 1,

      backpainLoc: ['low_back_lumbar', 'flank_side'],
      backpainLocLumbarSide: ['center'],
      backpainLocThoracicSide: [],
      backpainLocSacrumSide: [],
      backpainLocFlankSide: ['left'],
      backpainOnsetMode: 'sudden_severe',
      backpainRadMaster: 'yes',
      backpainRadLoc: ['rad_abdomen_chest'],
      backpainChar: ['tearing_ripping'],
      backpainBehavior: [],
      painScore: 10,
      backpainWarningSigns: ['syncope_hypotension', 'pulsatile_abd_mass'],
      backpainWarningNeuroParent: false,
      backpainWarningExcretoryParent: false,
      backpainTraumaMaster: 'no',
      backpainTraumaTypes: [],
      backpainTraumaOtherText: '',
      backpainRisks: ['risks_none']
    },

    // Case 3: Suspected Spinal Epidural Abscess (ESI 2)
    {
      id: 'case-backpain-03',
      queue_number: 'E2-093',
      hn: '6788503',
      name: 'นางสมศรี มีไข้บล็อกหลัง',
      age: 56,
      gender: 'หญิง',
      chief_complaint: 'back_pain',
      chief_complaint_title: 'ปวดหลัง',
      timestamp: '2026-10-31T09:30:00.000Z',
      status: 'waiting',
      durationVal: 3,
      durationUnit: 'days',
      hospRecordStatus: 'complete',
      underlying: ['เบาหวาน (DM)', 'ไตวายเรื้อรังฟอกเลือด (ESRD on HD)'],
      drugAllergy: 'Penicillin (ผื่นคัน)',
      currentMeds: 'Insulin Glargine, Folic acid, Calcium carbonate',
      otherSymptomsFree: 'เพิ่งฉีดยาชาบล็อกหลังมา 2 สัปดาห์ มีไข้หนาวสั่น ปวดหลังรุนแรงจนนอนไม่ได้',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 38.9, sbp: 115, dbp: 75, bp: '115/75', pr: 106, rr: 20, spo2: 98 },
      esi_level: 2,

      backpainLoc: ['mid_back_thoracic', 'low_back_lumbar'],
      backpainLocLumbarSide: ['center'],
      backpainLocThoracicSide: ['center'],
      backpainLocSacrumSide: [],
      backpainLocFlankSide: [],
      backpainOnsetMode: 'gradual_worsening',
      backpainRadMaster: 'none',
      backpainRadLoc: [],
      backpainChar: ['sharp_stabbing'],
      backpainBehavior: ['worse_night_supine'],
      painScore: 7,
      backpainWarningSigns: ['fever_chills'],
      backpainWarningNeuroParent: false,
      backpainWarningExcretoryParent: false,
      backpainTraumaMaster: 'yes',
      backpainTraumaTypes: ['recent_spine_procedure'],
      backpainTraumaOtherText: '',
      backpainRisks: ['hemodialysis_catheter']
    },

    // Case 4: Acute Mechanical Lumbago (ESI 4)
    {
      id: 'case-backpain-04',
      queue_number: 'E4-094',
      hn: '6788504',
      name: 'นายวิชาญ ยกของหนัก',
      age: 36,
      gender: 'ชาย',
      chief_complaint: 'back_pain',
      chief_complaint_title: 'ปวดหลัง',
      timestamp: '2026-10-31T10:00:00.000Z',
      status: 'waiting',
      durationVal: 2,
      durationUnit: 'days',
      hospRecordStatus: 'complete',
      underlying: [],
      drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร',
      currentMeds: 'ไม่มี',
      otherSymptomsFree: 'ปวดเอวด้านขวาหลังช่วยเพื่อนยกตู้เสื้อผ้า ขับถ่ายปกติ ขาไม่ชา',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.7, sbp: 122, dbp: 78, bp: '122/78', pr: 72, rr: 16, spo2: 99 },
      esi_level: 4,

      backpainLoc: ['low_back_lumbar'],
      backpainLocLumbarSide: ['right'],
      backpainLocThoracicSide: [],
      backpainLocSacrumSide: [],
      backpainLocFlankSide: [],
      backpainOnsetMode: 'gradual_worsening',
      backpainRadMaster: 'none',
      backpainRadLoc: [],
      backpainChar: ['dull_aching'],
      backpainBehavior: [],
      painScore: 4,
      backpainWarningSigns: [],
      backpainWarningNeuroParent: false,
      backpainWarningExcretoryParent: false,
      backpainTraumaMaster: 'yes',
      backpainTraumaTypes: ['heavy_lifting'],
      backpainTraumaOtherText: '',
      backpainRisks: ['risks_none']
    }
  ]
});

// --- Helper Formatting Functions for Backpain ---
function formatBackpainLocations(patient) {
  const locs = Array.isArray(patient.backpainLoc) ? patient.backpainLoc : [];
  if (locs.length === 0) return 'ไม่ได้ระบุ';

  const parts = [];
  const sideFormat = (sides) => {
    if (!Array.isArray(sides) || sides.length === 0) return '';
    const map = { left: 'ซ้าย', right: 'ขวา', center: 'ตรงกลาง' };
    return ` (ข้าง${sides.map(s => map[s] || s).join(', ')})`;
  };

  locs.forEach(l => {
    if (l === 'mid_back_thoracic') parts.push(`หลังช่วงกลาง/สะบัก${sideFormat(patient.backpainLocThoracicSide)}`);
    else if (l === 'flank_side') parts.push(`สีข้าง/บั้นเอวด้านข้าง${sideFormat(patient.backpainLocFlankSide)}`);
    else if (l === 'low_back_lumbar') parts.push(`บั้นเอว/หลังช่วงล่าง${sideFormat(patient.backpainLocLumbarSide)}`);
    else if (l === 'sacrum_buttock') parts.push(`ก้นกบ/สะโพก${sideFormat(patient.backpainLocSacrumSide)}`);
    else if (l === 'diffuse') parts.push('ปวดระบมทั่วแผ่นหลัง');
    else parts.push(l);
  });

  return parts.join(', ');
}

function formatBackpainChars(patient) {
  const chars = Array.isArray(patient.backpainChar) ? patient.backpainChar : [];
  if (chars.length === 0) return 'ไม่ได้ระบุ';
  const map = {
    dull_aching: 'ปวดตื้อๆ เมื่อย ระบม',
    sharp_stabbing: 'ปวดแปล๊บ/เสียบแทง',
    electric_shock: 'ปวดจี๊ดเหมือนไฟช็อต',
    tearing_ripping: 'ปวดฉีกขาดรุนแรงจัด',
    colicky_spasm: 'ปวดบิดเกร็งเป็นพักๆ',
    burning: 'ปวดแสบร้อนผิวหนัง'
  };
  return chars.map(c => map[c] || c).join(', ');
}

function formatBackpainRadiation(patient) {
  if (patient.backpainRadMaster === 'none') return 'ปวดเฉพาะที่หลัง ไม่ร้าวไปไหน';
  const rads = Array.isArray(patient.backpainRadLoc) ? patient.backpainRadLoc : [];
  if (rads.length === 0) return 'มีปวดร้าว (ไม่ได้ระบุตำแหน่ง)';
  const map = {
    rad_leg_below_knee: 'ร้าวลงขา/น่อง ต่ำกว่าเข่า (Sciatica)',
    rad_buttock_thigh: 'ร้าวลงสะโพก/ต้นขา',
    rad_abdomen_chest: 'ร้าวทะลุหน้าอก/หน้าท้อง',
    rad_groin: 'ร้าวลงขาหนีบ/อัณฑะ'
  };
  return `ปวดร้าวไปยัง: ${rads.map(r => map[r] || r).join(', ')}`;
}

function formatBackpainBehavior(patient) {
  const behs = Array.isArray(patient.backpainBehavior) ? patient.backpainBehavior : [];
  if (behs.length === 0) return 'ไม่มีพฤติกรรมกระตุ้นชัดเจน';
  const map = {
    worse_cough_strain: 'ปวดมากขึ้นเมื่อไอ จาม หรือเบ่ง',
    worse_night_supine: 'ปวดมากตอนกลางคืน นอนพักไม่ทุเลา'
  };
  return behs.map(b => map[b] || b).join(', ');
}

// --- Rapid Note HPI Renderer (Doctor View) ---
function renderBackpainRapidHpi(patient) {
  const durVal = patient.durationVal;
  const durUnitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durUnit = durUnitMap[patient.durationUnit] || 'วัน';
  const durationStr = durVal ? `${durVal} ${durUnit}` : 'ไม่ระบุ';

  const onsetMap = {
    sudden_severe: 'ปวดรุนแรงทันทีทันใด (ฉับพลัน)',
    gradual_worsening: 'ค่อยๆ ปวดเพิ่มขึ้นเรื่อยๆ'
  };
  const onsetStr = onsetMap[patient.backpainOnsetMode] || 'ไม่ได้ระบุ';

  const pScore = (typeof patient.painScore === 'number' && patient.painScore > 0)
    ? `${patient.painScore}/10 คะแนน`
    : (patient.painScore === 0 ? '0/10 คะแนน (ไม่ปวด)' : 'ไม่ได้ระบุ');

  const warnSigns = Array.isArray(patient.backpainWarningSigns) ? patient.backpainWarningSigns : [];
  const traumaTypes = Array.isArray(patient.backpainTraumaTypes) ? patient.backpainTraumaTypes : [];
  const risks = Array.isArray(patient.backpainRisks) ? patient.backpainRisks : [];

  const posList = [];
  const negList = [];

  // Positives & Negatives evaluation
  if (patient.backpainOnsetMode === 'sudden_severe') posList.push('ปวดรุนแรงทันทีทันใด (ฉับพลัน)');
  if (Array.isArray(patient.backpainRadLoc) && patient.backpainRadLoc.includes('rad_leg_below_knee')) {
    posList.push('ปวดร้าวลงขาต่ำกว่าเข่า (Sciatica)');
  }
  if (Array.isArray(patient.backpainRadLoc) && patient.backpainRadLoc.includes('rad_abdomen_chest')) {
    posList.push('ปวดร้าวทะลุหน้าอกหรือหน้าท้อง');
  }
  if (Array.isArray(patient.backpainBehavior) && patient.backpainBehavior.includes('worse_cough_strain')) {
    posList.push('ปวดมากขึ้นเวลาไอ จาม หรือเบ่ง');
  }
  if (Array.isArray(patient.backpainBehavior) && patient.backpainBehavior.includes('worse_night_supine')) {
    posList.push('ปวดรบกวนการนอนตอนกลางคืน');
  }

  // Warning signs positives
  if (warnSigns.includes('saddle_anesthesia')) posList.push('ชาบริเวณก้น/หว่างขา (Saddle anesthesia)');
  if (warnSigns.includes('urinary_retention')) posList.push('ปัสสาวะไม่ออกเฉียบพลัน/ท้องน้อยตึงแน่น');
  if (warnSigns.includes('bowel_incontinence')) posList.push('กลั้นอุจจาระไม่ได้ เล็ดราด');
  if (warnSigns.includes('leg_weakness_both')) posList.push('ขาอ่อนแรงทั้งสองข้าง เดินไม่ไหว');
  if (warnSigns.includes('foot_drop_single')) posList.push('ปลายเท้าตก (Foot drop)');
  if (warnSigns.includes('numbness_leg_foot')) posList.push('ชาตามแนวขา น่อง หรือหลังเท้า');
  if (warnSigns.includes('ischemic_limb_pain')) posList.push('ปวดรุนแรงเหมือนเนื้อจะระเบิดลึกๆ ในน่อง/เท้า (Limb Ischemia risk)');
  if (warnSigns.includes('ischemic_limb_numbness')) posList.push('ไม่รู้สึกถึงความรู้สึกใดๆ ที่ขาหรือเท้า (Profound limb anesthesia)');
  if (warnSigns.includes('dysuria_hematuria')) posList.push('ปัสสาวะแสบขัด หรือปัสสาวะเป็นเลือด');
  if (warnSigns.includes('gravel_sand_urine')) posList.push('ปัสสาวะปนตะกอน คล้ายกรวดทราย (Urolithiasis/Gravel)');
  if (warnSigns.includes('fever_chills')) posList.push('มีไข้สูง หนาวสั่นสะท้าน');
  if (warnSigns.includes('syncope_hypotension')) posList.push('หน้ามืด วูบ หรือความดันโลหิตตก');
  if (warnSigns.includes('pulsatile_abd_mass')) posList.push('คลำได้ก้อนเต้นตุบๆ ในช่องท้อง');
  if (warnSigns.includes('weight_loss_anorexia')) posList.push('น้ำหนักลดลงฮวบผิดปกติ เบื่ออาหาร');

  // Trauma positives
  if (patient.backpainTraumaMaster === 'yes') {
    if (traumaTypes.includes('severe_trauma_fall_mva')) posList.push('ประวัติอุบัติเหตุรุนแรง (ตกจากที่สูง/รถชน)');
    if (traumaTypes.includes('elderly_minor_fall')) posList.push('ลื่นล้มก้นกระแทกในผู้สูงอายุ');
    if (traumaTypes.includes('heavy_lifting')) posList.push('ยกของหนักนำมาก่อนมีอาการ');
    if (traumaTypes.includes('recent_spine_procedure')) posList.push('เพิ่งทำหัตถการ/ผ่าตัด/บล็อกหลังใน 1 เดือน');
    if (traumaTypes.includes('trauma_other') && patient.backpainTraumaOtherText) {
      posList.push(`อุบัติเหตุอื่นๆ: ${patient.backpainTraumaOtherText}`);
    }
  }

  if (patient.otherSymptomsFree) {
    posList.push(patient.otherSymptomsFree);
  }

  // Negatives
  if (!warnSigns.includes('saddle_anesthesia')) negList.push('ปฏิเสธชาบริเวณก้น/หว่างขา (No saddle anesthesia)');
  if (!warnSigns.includes('urinary_retention') && !warnSigns.includes('bowel_incontinence')) {
    negList.push('ปฏิเสธปัสสาวะไม่ออก หรือกลั้นอุจจาระไม่ได้ (No bowel/bladder dysfunction)');
  }
  if (!warnSigns.includes('leg_weakness_both') && !warnSigns.includes('foot_drop_single')) {
    negList.push('ขาไม่อ่อนแรงทั้งสองข้าง ปลายเท้าไม่ตก');
  }
  if (!warnSigns.includes('ischemic_limb_pain') && !warnSigns.includes('ischemic_limb_numbness')) {
    negList.push('ปฏิเสธปวดรุนแรงเหมือนระเบิดหรือชาหมดความรู้สึกที่ขา/เท้า (No acute limb ischemia signs)');
  }
  if (!warnSigns.includes('dysuria_hematuria') && !warnSigns.includes('gravel_sand_urine')) {
    negList.push('ปฏิเสธปัสสาวะแสบขัด เลือดปน หรือปนตะกอนกรวดทราย');
  }
  if (!warnSigns.includes('fever_chills')) negList.push('ปฏิเสธไข้หนาวสั่น');
  if (!warnSigns.includes('syncope_hypotension')) negList.push('ปฏิเสธหน้ามืดหรือวูบหมดสติ');
  if (!risks.includes('known_cancer') && !warnSigns.includes('weight_loss_anorexia')) {
    negList.push('ปฏิเสธประวัติมะเร็งเดิม และน้ำหนักไม่ลดฮวบ');
  }
  if (patient.backpainTraumaMaster === 'no') {
    negList.push('ปฏิเสธประวัติอุบัติเหตุหรือหัตถการนำมาก่อน');
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
  const redFlags = evaluateBackpainRedFlags(patient);

  const defaultRapid =
`[Chief Complaint (CC)]
ปวดหลัง (Back pain / Lumbago) มา ${durationStr}

[History of Present Illness (HPI)]
• ระยะเวลาที่มีอาการ: ${durVal ? `ปวดมา ${durationStr}` : 'ไม่ระบุ'}
• ตำแหน่งที่ปวด: ${formatBackpainLocations(patient)}
• ลักษณะการเริ่มปวด: ${onsetStr}
• ลักษณะอาการปวด: ${formatBackpainChars(patient)}
• การปวดร้าว: ${formatBackpainRadiation(patient)}
• พฤติกรรมกับอาการ: ${formatBackpainBehavior(patient)}
• ระดับความเจ็บปวด (Pain Score): ${pScore}

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
function renderBackpainNarrative(patient) {
  const durStr = patient.durationVal
    ? `${patient.durationVal} ${patient.durationUnit === 'hours' ? 'ชั่วโมง' : (patient.durationUnit === 'weeks' ? 'สัปดาห์' : (patient.durationUnit === 'months' ? 'เดือน' : (patient.durationUnit === 'years' ? 'ปี' : 'วัน')))}`
    : 'ไม่ระบุระยะเวลา';

  const locStr = formatBackpainLocations(patient);
  const charStr = formatBackpainChars(patient);
  const radStr = formatBackpainRadiation(patient);
  const pScore = (typeof patient.painScore === 'number' && patient.painScore > 0) ? `${patient.painScore}/10` : 'ไม่ได้ระบุ';

  const warnSigns = Array.isArray(patient.backpainWarningSigns) ? patient.backpainWarningSigns : [];

  let note = `ผู้ป่วย${patient.gender || ''} อายุ ${patient.age || 'ไม่ระบุ'} ปี มารับการตรวจที่ห้องฉุกเฉินด้วยอาการปวดหลัง เป็นมา ${durStr} ก่อนมาโรงพยาบาล ตำแหน่งปวดบริเวณ${locStr} ลักษณะปวดเป็นแบบ${charStr} ${radStr} ระดับความเจ็บปวดประเมินได้ ${pScore} คะแนน`;

  if (warnSigns.length > 0) {
    const warnTexts = [];
    if (warnSigns.includes('saddle_anesthesia')) warnTexts.push('มีอาการชาบริเวณก้น/หว่างขา');
    if (warnSigns.includes('urinary_retention')) warnTexts.push('มีปัสสาวะไม่ออก');
    if (warnSigns.includes('bowel_incontinence')) warnTexts.push('กลั้นอุจจาระไม่ได้');
    if (warnSigns.includes('leg_weakness_both')) warnTexts.push('ขาอ่อนแรงทั้งสองข้าง');
    if (warnSigns.includes('foot_drop_single')) warnTexts.push('ปลายเท้าตก');
    if (warnSigns.includes('numbness_leg_foot')) warnTexts.push('ชาตามแนวขาหรือหลังเท้า');
    if (warnSigns.includes('ischemic_limb_pain')) warnTexts.push('ปวดรุนแรงเหมือนเนื้อจะระเบิดลึกๆ ในน่องหรือเท้า');
    if (warnSigns.includes('ischemic_limb_numbness')) warnTexts.push('ไม่รู้สึกถึงความรู้สึกใดๆ ที่ขาหรือเท้า');
    if (warnSigns.includes('dysuria_hematuria')) warnTexts.push('ปัสสาวะแสบขัดหรือเป็นเลือด');
    if (warnSigns.includes('gravel_sand_urine')) warnTexts.push('ปัสสาวะปนตะกอนกรวดทราย');
    if (warnSigns.includes('fever_chills')) warnTexts.push('มีไข้สูงหนาวสั่น');
    if (warnSigns.includes('syncope_hypotension')) warnTexts.push('มีอาการหน้ามืดหรือวูบ');
    if (warnSigns.includes('pulsatile_abd_mass')) warnTexts.push('คลำได้ก้อนเต้นในท้อง');
    if (warnSigns.includes('weight_loss_anorexia')) warnTexts.push('น้ำหนักลดลงฮวบผิดปกติ');
    note += ` ร่วมกับมีอาการสำคัญ: ${warnTexts.join(', ')}`;
  } else {
    note += ' ผู้ป่วยปฏิเสธอาการชาบริเวณก้นหรือหว่างขา (No saddle anesthesia) การขับถ่ายปัสสาวะและอุจจาระปกติ ขาทั้งสองข้างไม่อ่อนแรง ไม่มีความรู้สึกขาขาดเลือดเฉียบพลัน และไม่มีไข้หนาวสั่น';
  }

  if (patient.backpainTraumaMaster === 'yes') {
    const tTypes = Array.isArray(patient.backpainTraumaTypes) ? patient.backpainTraumaTypes : [];
    const tTexts = [];
    if (tTypes.includes('heavy_lifting')) tTexts.push('ยกของหนัก');
    if (tTypes.includes('severe_trauma_fall_mva')) tTexts.push('อุบัติเหตุรุนแรง');
    if (tTypes.includes('elderly_minor_fall')) tTexts.push('ลื่นล้มก้นกระแทก');
    if (tTypes.includes('recent_spine_procedure')) tTexts.push('เพิ่งทำหัตถการหรือบล็อกหลัง');
    if (tTypes.includes('trauma_other') && patient.backpainTraumaOtherText) tTexts.push(patient.backpainTraumaOtherText);
    if (tTexts.length > 0) note += ` โดยมีประวัตินำมาก่อนคือ: ${tTexts.join(', ')}`;
  }

  return note;
}

function renderBackpainDoctorHpi(patient) {
  return renderBackpainRapidHpi(patient);
}

function updateBackpainOutputs(rec) {
  if (!rec) return;
  const rapidText = renderBackpainRapidHpi(rec);
  const narrativeText = renderBackpainNarrative(rec);

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

  const redFlags = evaluateBackpainRedFlags(rec);
  rec.redFlags = redFlags;

  const jsonOutput = {
    encounter: {
      chief_complaint: 'back_pain',
      chief_complaint_title_th: 'ปวดหลัง',
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
      locations: rec.backpainLocations || [],
      onset_mode: rec.backpainOnsetMode || null,
      pain_characteristics: rec.backpainChars || [],
      radiation: rec.backpainRadLoc || [],
      behavior: rec.backpainBehavior || [],
      pain_score: rec.painScore !== null && rec.painScore !== undefined ? rec.painScore : null,
      warning_signs: Array.isArray(rec.backpainWarningSigns) ? rec.backpainWarningSigns : [],
      trauma_master: rec.backpainTraumaMaster || 'no',
      trauma_types: Array.isArray(rec.backpainTraumaTypes) ? rec.backpainTraumaTypes : [],
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
