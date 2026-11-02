// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 16_allergy.js
// อาการนำ: ผื่นแพ้เฉียบพลัน / แน่นคอ ตาบวม ปากบวม (Acute Allergic Reaction / Angioedema / Anaphylaxis)
// ไฟล์นี้แยกอิสระสำหรับอาการนำ allergy เพื่อให้ทีมแพทย์และ IT โรงพยาบาลนำไปพัฒนาต่อได้โดยไม่กระทบระบบหลัก
// =========================================================================

// --- UI Toggle Handlers ---
function handleAllergyTriggerFoodToggle(el) {
  const wrap = document.getElementById('allergyTriggerFoodWrap');
  if (wrap) {
    if (el && el.checked) {
      wrap.classList.remove('hidden');
    } else {
      wrap.classList.add('hidden');
      const inp = document.getElementById('allergyTriggerFoodText');
      if (inp) inp.value = '';
    }
  }
}

function handleAllergyTriggerMedToggle(el) {
  const wrap = document.getElementById('allergyTriggerMedWrap');
  if (wrap) {
    if (el && el.checked) {
      wrap.classList.remove('hidden');
    } else {
      wrap.classList.add('hidden');
      const inp = document.getElementById('allergyTriggerMedText');
      if (inp) inp.value = '';
    }
  }
}

function handleAllergyTriggerInsectToggle(el) {
  const wrap = document.getElementById('allergyTriggerInsectWrap');
  if (wrap) {
    if (el && el.checked) {
      wrap.classList.remove('hidden');
    } else {
      wrap.classList.add('hidden');
      const inp = document.getElementById('allergyTriggerInsectText');
      if (inp) inp.value = '';
    }
  }
}

function handleAllergySkinRashNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="allergySkinRash"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleAllergyAngioedemaNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="allergyAngioedema"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleAllergyUpperAirwayNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="allergyUpperAirway"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleAllergyLowerAirwayNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="allergyLowerAirway"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleAllergyCirculationNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="allergyCirculationShock"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleAllergyGiNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="allergyGiSymptoms"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleAllergyPriorAnaphylaxisChange(val) {
  const wrap = document.getElementById('allergyEpipenWrap');
  if (wrap) {
    if (val === 'prior_severe_hosp') {
      wrap.classList.remove('hidden');
    } else {
      wrap.classList.add('hidden');
      document.querySelectorAll('input[name="allergyEpipenUsage"]').forEach(r => { r.checked = false; });
      const tWrap = document.getElementById('allergyEpipenTimeWrap');
      if (tWrap) tWrap.classList.add('hidden');
      const tInp = document.getElementById('allergyEpipenTimeText');
      if (tInp) tInp.value = '';
    }
  }
}

function handleAllergyEpipenUsageChange(val) {
  const wrap = document.getElementById('allergyEpipenTimeWrap');
  if (wrap) {
    if (val === 'used_prehospital') {
      wrap.classList.remove('hidden');
    } else {
      wrap.classList.add('hidden');
      const inp = document.getElementById('allergyEpipenTimeText');
      if (inp) inp.value = '';
    }
  }
}

function handleAllergySpecialMedsNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="allergySpecialMeds"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleAllergyPmhNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="allergyPmhSpecific"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

// --- Red Flag Evaluator ---
function evaluateAllergyRedFlags(patient) {
  const flags = [];
  if (!patient) return flags;

  const skinRash = Array.isArray(patient.allergySkinRash) ? patient.allergySkinRash : [];
  const angioedema = Array.isArray(patient.allergyAngioedema) ? patient.allergyAngioedema : [];
  const upperAirway = Array.isArray(patient.allergyUpperAirway) ? patient.allergyUpperAirway : [];
  const lowerAirway = Array.isArray(patient.allergyLowerAirway) ? patient.allergyLowerAirway : [];
  const circulation = Array.isArray(patient.allergyCirculationShock) ? patient.allergyCirculationShock : [];
  const gi = Array.isArray(patient.allergyGiSymptoms) ? patient.allergyGiSymptoms : [];
  const triggers = Array.isArray(patient.allergySuspectedTriggers) ? patient.allergySuspectedTriggers : [];
  const specialMeds = Array.isArray(patient.allergySpecialMeds) ? patient.allergySpecialMeds : [];

  const hasSkinMucosa = skinRash.includes('urticaria') || skinRash.includes('flushing') ||
                        angioedema.includes('lips') || angioedema.includes('tongue_palate') || angioedema.includes('periorbital_face');
  const hasUpperAirway = upperAirway.includes('throat_tightness') || upperAirway.includes('dysphagia_drooling') ||
                         upperAirway.includes('voice_hoarseness') || upperAirway.includes('stridor');
  const hasLowerAirway = lowerAirway.includes('dyspnea') || lowerAirway.includes('wheezing') || lowerAirway.includes('chest_tightness');
  const hasCirculation = circulation.includes('presyncope_dizziness') || circulation.includes('syncope') || circulation.includes('cold_diaphoresis');
  const hasSevereGi = gi.includes('severe_abd_cramps') || gi.includes('repetitive_vomiting') || gi.includes('watery_diarrhea');

  const hasKnownTrigger = triggers.some(t => ['food', 'medication', 'insect_sting', 'radiocontrast_anesthesia'].includes(t));

  // 1. ANAPHYLAXIS CRITICAL ALERT (WAO 2020 / NIAID Criteria)
  const isAnaphylaxisCriteria1 = hasSkinMucosa && (hasUpperAirway || hasLowerAirway || hasCirculation || hasSevereGi);
  const isAnaphylaxisCriteria2 = hasKnownTrigger && (hasUpperAirway || hasLowerAirway || hasCirculation);

  if (isAnaphylaxisCriteria1 || isAnaphylaxisCriteria2) {
    flags.push({
      key: 'allergy_rf_anaphylaxis_shock',
      textTh: 'ภาวะแพ้รุนแรงคุกคามชีวิต (Anaphylaxis Alert / Impending Anaphylactic Shock)',
      risk: 'มีอาการแพ้เฉียบพลันร่วมกับระบบทางเดินหายใจ (แน่นคอ/เสียงแหบ/หวีด) หรือระบบไหลเวียนโลหิต (หน้ามืด/เป็นลม/ช็อก) หรือระบบทางเดินอาหารรุนแรง เข้าเกณฑ์ Anaphylaxis ตามแนวทาง WAO/NIAID',
      triageLevel: 1,
      severity: 'CRITICAL',
      suggestedAction: 'Triage Level 1: เคลื่อนย้ายเข้าห้อง Resuscitation ทันที, ฉีด Adrenaline (1:1,000) 0.3–0.5 mg IM บริเวณ anterolateral thigh ทันที (ห้ามรอช้า!), ให้นอนราบยกขาสูง (Supine with legs elevated), ให้ออกซิเจน High-flow Mask with Reservoir Bag 10–15 LPM, เปิด IV เส้นใหญ่ 2 เส้น (18G) และให้ IV 0.9% NSS 1,000–2,000 mL bolus อย่างรวดเร็ว, ฉีด Adrenaline ซ้ำได้ทุก 5–15 นาที'
    });
  }

  // 2. IMPENDING UPPER AIRWAY OBSTRUCTION (Laryngeal Angioedema)
  if (upperAirway.includes('stridor') || angioedema.includes('tongue_palate') ||
      upperAirway.includes('voice_hoarseness') || upperAirway.includes('dysphagia_drooling')) {
    flags.push({
      key: 'allergy_rf_airway_obstruction',
      textTh: 'เสี่ยงต่อการอุดกั้นทางเดินหายใจส่วนบนเฉียบพลัน (Impending Upper Airway Obstruction / Laryngeal Edema)',
      risk: 'ตรวจพบลิ้นบวมโตคับปาก เสียงแหบเฉียบพลัน กลืนน้ำลายไม่ได้ หรือมีเสียง Stridor',
      triageLevel: 1,
      severity: 'CRITICAL',
      suggestedAction: 'เตรียมอุปกรณ์เปิดทางเดินหายใจขั้นสูง (Video Laryngoscope / Surgical Cricothyroidotomy) ข้างเตียงทันที, ปรึกษาแพทย์ดมยาและแพทย์ หู คอ จมูก (ENT) ทันที เพื่อประเมินการใส่ท่อช่วยหายใจตั้งแต่เนิ่นๆ, ฉีด Adrenaline IM ทันที และพิจารณา Adrenaline 1:1,000 (2-5 mL) Nebulizer'
    });
  }

  // 3. ACE-INHIBITOR INDUCED ANGIOEDEMA
  const takesAcei = specialMeds.includes('ace_inhibitors') || (Array.isArray(patient.underlying) && patient.underlying.some(u => /acei|enalapril|ramipril|captopril|lisinopril/i.test(u)));
  if (takesAcei && (angioedema.includes('lips') || angioedema.includes('tongue_palate') || upperAirway.includes('throat_tightness'))) {
    flags.push({
      key: 'allergy_rf_acei_angioedema',
      textTh: 'สงสัยภาวะ Angioedema จากยากลุ่ม ACE Inhibitors (ACEi-induced Angioedema)',
      risk: 'ผู้ป่วยที่รับประทานยากลุ่ม ACEi (เช่น Enalapril) มีอาการปากบวม ลิ้นบวม หรือแน่นคอ มักเป็น Bradykinin-mediated',
      triageLevel: 2,
      severity: 'HIGH',
      suggestedAction: 'สั่งหยุดยากลุ่ม ACEi และห้ามใช้ยากลุ่ม ARBs โดยเด็ดขาดตลอดชีวิต, เฝ้าระวังทางเดินหายใจอย่างใกล้ชิดใน ICU/Observation อย่างน้อย 24-48 ชม., พิจารณาให้ Fresh Frozen Plasma (FFP 1–2 units) เพื่อช่วยสลาย Bradykinin (มี Kininase II) ในกรณีที่ไม่มี Icatibant หรือ C1-esterase inhibitor concentrate, เตรียมพร้อมเปิดทางเดินหายใจขั้นสูง'
    });
  }

  // 4. REFRACTORY ANAPHYLAXIS RISK (Beta-blocker user)
  const takesBetaBlockers = specialMeds.includes('beta_blockers');
  if (takesBetaBlockers && (isAnaphylaxisCriteria1 || isAnaphylaxisCriteria2)) {
    flags.push({
      key: 'allergy_rf_beta_blocker_refractory',
      textTh: 'เสี่ยงต่อภาวะดื้อยา Adrenaline จากการใช้ยา Beta-Blockers',
      risk: 'ผู้ป่วยแพ้รุนแรงที่ใช้ยา Beta-blockers อาจไม่ตอบสนองต่อ Adrenaline ในขนาดปกติ',
      triageLevel: 2,
      severity: 'HIGH',
      suggestedAction: 'หากฉีด Adrenaline IM ซ้ำแล้วความดันยังตกหรือไม่ดีขึ้น ให้เตรียม IV Glucagon 1–5 mg IV push over 5 mins ตามด้วย infusion 5–15 mcg/min, ให้ IV Isoproterenol หรือ Atropine ร่วมด้วยตามข้อบ่งชี้ทางโรคหัวใจ'
    });
  }

  // 5. SEVERE CUTANEOUS ADVERSE REACTIONS (SCARs Suspect)
  if (skinRash.includes('blisters_peeling')) {
    flags.push({
      key: 'allergy_rf_blistering_mucocutaneous',
      textTh: 'สงสัยกลุ่มอาการผื่นแพ้ยารุนแรง (Suspected Severe Cutaneous Adverse Reaction - SCARs / SJS / TEN)',
      risk: 'มีตุ่มน้ำพองใส ผิวหนังลอกหลุด เจ็บแสบผิว เสี่ยงต่อการติดเชื้อและการสูญเสียสมดุลสารน้ำ',
      triageLevel: 2,
      severity: 'HIGH',
      suggestedAction: 'หยุดยาทุกชนิดที่สงสัยทันที, ดูแลแผลผิวหนังและเยื่อบุ, ตรวจ Stat CBC, BUN, Cr, Electrolytes, LFTs, ประเมินการรับไว้รักษาในหอผู้ป่วยแผลไฟไหม้ (Burn Unit) หรือ ICU'
    });
  }

  return flags;
}

// --- Outputs Updater (Rapid, Narrative, JSON Schema) ---
function updateAllergyOutputs(patient) {
  if (!patient) return;

  const rfs = evaluateAllergyRedFlags(patient);
  const skinRash = Array.isArray(patient.allergySkinRash) ? patient.allergySkinRash : [];
  const angioedema = Array.isArray(patient.allergyAngioedema) ? patient.allergyAngioedema : [];
  const upperAirway = Array.isArray(patient.allergyUpperAirway) ? patient.allergyUpperAirway : [];
  const lowerAirway = Array.isArray(patient.allergyLowerAirway) ? patient.allergyLowerAirway : [];
  const circulation = Array.isArray(patient.allergyCirculationShock) ? patient.allergyCirculationShock : [];
  const gi = Array.isArray(patient.allergyGiSymptoms) ? patient.allergyGiSymptoms : [];
  const triggers = Array.isArray(patient.allergySuspectedTriggers) ? patient.allergySuspectedTriggers : [];
  const specialMeds = Array.isArray(patient.allergySpecialMeds) ? patient.allergySpecialMeds : [];
  const pmhSpecific = Array.isArray(patient.allergyPmhSpecific) ? patient.allergyPmhSpecific : [];

  const unitMapTh = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durationStr = patient.durationVal ? `${patient.durationVal} ${unitMapTh[patient.durationUnit] || patient.durationUnit || 'นาที'}` : 'ไม่ระบุ';

  let speedTh = 'ไม่ระบุ';
  if (patient.allergyOnsetSpeed === 'rapid_within_minutes') speedTh = 'เกิดขึ้นอย่างรวดเร็วมาก (นาทีถึง 1-2 ชม.)';
  else if (patient.allergyOnsetSpeed === 'gradual_throughout_day') speedTh = 'ค่อยๆ เป็นเพิ่มขึ้นตลอดทั้งวัน';
  else if (patient.allergyOnsetSpeed === 'chronic_gt_6weeks') speedTh = 'ผื่นเรื้อรังเป็นๆ หายๆ มาหลายวัน';

  let onsetExactStr = '';
  if (patient.allergyOnsetExactDate || patient.allergyOnsetExactTime) {
    onsetExactStr = ` (ระบุเวลาเริ่ม: ${patient.allergyOnsetExactDate || '-'} ${patient.allergyOnsetExactTime || '-'})`;
  }

  const trigThs = [];
  if (triggers.includes('food')) trigThs.push(`อาหาร (${patient.allergyTriggerFoodText || 'อาหารทะเล/ถั่ว/ไข่'})`);
  if (triggers.includes('medication')) trigThs.push(`ยา (${patient.allergyTriggerMedText || 'ยาปฏิชีวนะ/NSAIDs'})`);
  if (triggers.includes('insect_sting')) trigThs.push(`แมลงสัตว์กัดต่อย (${patient.allergyTriggerInsectText || 'ผึ้ง/ต่อ/แตน'})`);
  if (triggers.includes('radiocontrast_anesthesia')) trigThs.push('สารทึบรังสี/ยาชา/ยาสลบ');
  if (triggers.includes('contact_latex_chemical')) trigThs.push('สารสัมผัสภายนอก/ลาเท็กซ์/สารเคมี');
  if (triggers.includes('unknown_trigger')) trigThs.push('ไม่ทราบสิ่งกระตุ้นแน่ชัด');

  const rashThs = [];
  if (skinRash.includes('urticaria')) rashThs.push('ผื่นลมพิษนูนหนาสีแดงคันมาก (Urticaria)');
  if (skinRash.includes('flushing')) rashThs.push('ผิวแดงก่ำร้อนวูบวาบ (Flushing)');
  if (skinRash.includes('erythema_maculopapular')) rashThs.push('ผื่นแดงราบ/จุดแดงคัน');
  if (skinRash.includes('blisters_peeling')) rashThs.push('ตุ่มน้ำพองใส/ผิวลอกหลุด (SCARs Alert)');

  const angioThs = [];
  if (angioedema.includes('lips')) angioThs.push('ริมฝีปากบวมเจ่อ');
  if (angioedema.includes('tongue_palate')) angioThs.push('ลิ้นบวมโตคับปาก/เพดานปากบวม');
  if (angioedema.includes('periorbital_face')) angioThs.push('เปลือกตาบวม/ใบหน้าบวมตึง');
  if (angioedema.includes('ears_neck')) angioThs.push('ใบหูบวม/ลำคอด้านนอกบวม');
  if (angioedema.includes('extremities_genitalia')) angioThs.push('มือเท้าบวม/อวัยวะเพศบวม');

  const upperThs = [];
  if (upperAirway.includes('stridor')) upperThs.push('หายใจมีเสียงฮืด/วี้ดแหลมในลำคอ (Stridor)');
  if (upperAirway.includes('throat_tightness')) upperThs.push('แน่นในลำคอเหมือนมีก้อนจุกติดคอหอย');
  if (upperAirway.includes('dysphagia_drooling')) upperThs.push('กลืนลำบาก/กลืนน้ำลายไม่ลง/น้ำลายไหลย้อย');
  if (upperAirway.includes('voice_hoarseness')) upperThs.push('เสียงแหบเฉียบพลัน/เสียงเปลี่ยนเหมือนอมของร้อน');
  if (upperAirway.includes('nasal_congestion')) upperThs.push('แน่นจมูก');

  const lowerThs = [];
  if (lowerAirway.includes('wheezing')) lowerThs.push('หายใจมีเสียงหวีดในหน้าอก (Wheezing)');
  if (lowerAirway.includes('dyspnea')) lowerThs.push('หายใจหอบเหนื่อย/หายใจไม่อิ่ม');
  if (lowerAirway.includes('chest_tightness')) lowerThs.push('แน่นอึดอัดกลางหน้าอก หายใจเข้าไม่เต็มปอด');

  const circThs = [];
  if (circulation.includes('syncope')) circThs.push('วูบหมดสติ (Syncope)');
  if (circulation.includes('presyncope_dizziness')) circThs.push('หน้ามืดวิงเวียนตาพร่าทรงตัวไม่อยู่');
  if (circulation.includes('cold_diaphoresis')) circThs.push('เหงื่อแตกท่วมตัว ตัวเย็นชืด มือเท้าเย็นจัด');

  const giThs = [];
  if (gi.includes('severe_abd_cramps')) giThs.push('ปวดเกร็งท้องรุนแรง');
  if (gi.includes('repetitive_vomiting')) giThs.push('คลื่นไส้อาเจียนหลายครั้ง');
  if (gi.includes('watery_diarrhea')) giThs.push('ถ่ายเหลวเป็นน้ำ');

  let priorTh = 'ครั้งแรกในชีวิต';
  if (patient.allergyPriorAnaphylaxis === 'prior_severe_hosp') priorTh = 'เคยแพ้รุนแรง (Anaphylaxis) นอน รพ./เคยฉีด Adrenaline';
  else if (patient.allergyPriorAnaphylaxis === 'prior_mild_urticaria') priorTh = 'เคยมีเฉพาะผื่นลมพิษธรรมดา';

  let epipenText = 'ไม่ได้ใช้ยา EpiPen';
  if (patient.allergyEpipenUsage === 'used_prehospital') {
    epipenText = `ฉีดยา EpiPen พกพาไปแล้วก่อนมา รพ. (${patient.allergyEpipenTimeText || 'ไม่ระบุเวลา'}) 🚩`;
  } else if (patient.allergyEpipenUsage === 'has_not_used') {
    epipenText = 'มียา EpiPen พกพาประจำตัว แต่ยังไม่ได้ฉีดยา';
  }

  const medThs = [];
  if (specialMeds.includes('ace_inhibitors')) medThs.push('รับประทานยา ACE inhibitors (High Risk Angioedema)');
  if (specialMeds.includes('beta_blockers')) medThs.push('รับประทานยา Beta-blockers (Risk of Epinephrine Resistance)');

  const pmhThs = [];
  if (pmhSpecific.includes('asthma')) pmhThs.push('หอบหืด (Bronchial Asthma — Risk of Fatal Bronchospasm)');
  if (pmhSpecific.includes('cad_cvd')) pmhThs.push('โรคหลอดเลือดหัวใจ (CAD/CVD)');

  // Calculate Pertinent Positives and Negatives for Patient Review & Core Summary
  const positives = [];
  const negatives = [];

  // Rash & skin
  if (skinRash.includes('urticaria')) positives.push('ผื่นลมพิษ (Urticaria) 🚩');
  if (skinRash.includes('flushing')) positives.push('ผิวแดงก่ำร้อนวูบวาบ');
  if (skinRash.includes('erythema_maculopapular')) positives.push('ผื่นแดงราบ/ตุ่มคัน');
  if (skinRash.includes('blisters_peeling')) positives.push('ตุ่มน้ำพองใส/ผิวลอกหลุด 🚩');
  if (skinRash.includes('none_rash')) negatives.push('ปฏิเสธผื่นผิวหนัง');

  // Angioedema
  if (angioedema.includes('lips')) positives.push('ริมฝีปากบวมเจ่อ 🚩');
  if (angioedema.includes('tongue_palate')) positives.push('ลิ้นบวมโตคับปาก/เพดานปากบวม 🚩');
  if (angioedema.includes('periorbital_face')) positives.push('เปลือกตาบวม/หน้าบวม 🚩');
  if (angioedema.includes('ears_neck')) positives.push('ใบหู/ลำคอด้านนอกบวม 🚩');
  if (angioedema.includes('extremities_genitalia')) positives.push('มือเท้า/อวัยวะเพศบวม');
  if (angioedema.includes('none_angioedema')) negatives.push('ปฏิเสธอาการบวมตามใบหน้า');

  // Upper airway
  if (upperAirway.includes('stridor')) positives.push('หายใจมีเสียงฮืดในลำคอ (Stridor) 🚩');
  if (upperAirway.includes('throat_tightness')) positives.push('แน่นในลำคอ จุกคอหอย 🚩');
  if (upperAirway.includes('dysphagia_drooling')) positives.push('กลืนลำบาก น้ำลายไหล 🚩');
  if (upperAirway.includes('voice_hoarseness')) positives.push('เสียงแหบเฉียบพลัน 🚩');
  if (upperAirway.includes('nasal_congestion')) positives.push('แน่นจมูก');
  if (upperAirway.includes('none_upper_airway')) negatives.push('ทางเดินหายใจส่วนบนปกติ');

  // Lower airway
  if (lowerAirway.includes('wheezing')) positives.push('หายใจมีเสียงหวีด (Wheezing) 🚩');
  if (lowerAirway.includes('dyspnea')) positives.push('หายใจหอบเหนื่อย 🚩');
  if (lowerAirway.includes('chest_tightness')) positives.push('แน่นอึดอัดกลางหน้าอก 🚩');
  if (lowerAirway.includes('none_lower_airway')) negatives.push('ทางเดินหายใจส่วนล่างปกติ');

  // Circulation
  if (circulation.includes('syncope')) positives.push('วูบหมดสติ (Syncope) 🚩');
  if (circulation.includes('presyncope_dizziness')) positives.push('หน้ามืดวิงเวียน ตาพร่า');
  if (circulation.includes('cold_diaphoresis')) positives.push('เหงื่อแตกท่วมตัว ตัวเย็นชืด 🚩');
  if (circulation.includes('none_circulation')) negatives.push('ระบบไหลเวียนโลหิตปกติ');

  // GI
  if (gi.includes('severe_abd_cramps')) positives.push('ปวดเกร็งท้องรุนแรง 🚩');
  if (gi.includes('repetitive_vomiting')) positives.push('คลื่นไส้อาเจียนหลายครั้ง 🚩');
  if (gi.includes('watery_diarrhea')) positives.push('ถ่ายเหลวเป็นน้ำเฉียบพลัน 🚩');
  if (gi.includes('none_gi') || giThs.length === 0) negatives.push('ปฏิเสธปวดท้อง/อาเจียน/ถ่ายเหลว');

  if (!skinRash.includes('blisters_peeling') && negatives.length === 0) {
    negatives.push('ปฏิเสธตุ่มน้ำพองใสหรือผิวลอกหลุด');
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

  let udDisplay = 'ปฏิเสธ';
  if (patient.underlying && patient.underlying.length > 0) {
    const filteredUd = (Array.isArray(patient.underlying) ? patient.underlying : [patient.underlying])
      .filter(u => u && !u.includes('ปฏิเสธ') && u !== 'ไม่มี' && u !== 'ไม่มีโรคประจำตัว');
    if (filteredUd.length > 0) udDisplay = filteredUd.join(', ');
  }
  const allergyDisplay = (!patient.drugAllergy || patient.drugAllergy.includes('ปฏิเสธ') || patient.drugAllergy === 'ไม่มี') ? 'ปฏิเสธ' : patient.drugAllergy;

  // 1. Rapid Bullet Mode (Standardized: Primary onset & triggers at top, organ system findings in Pertinent only)
  const defaultRapid =
`[Chief Complaint (CC)]
ผื่นแพ้เฉียบพลัน / แน่นคอ ตาบวม ปากบวม (Allergic Reaction / Anaphylaxis) มา ${durationStr}

[History of Present Illness (HPI)]
• รูปแบบการเริ่มมีอาการและความเร็ว: ${speedTh}${onsetExactStr}
• สิ่งกระตุ้นที่สงสัย (Suspected Triggers): ${trigThs.length > 0 ? trigThs.join(', ') : 'ไม่ระบุสิ่งกระตุ้นแน่ชัด'}

• Pertinent Positives:
${positives.length > 0 ? positives.map(p => `  - ${p}`).join('\n') : '  - ไม่มีอาการร่วมอื่นที่เด่นชัด'}

• Pertinent Negatives:
${negatives.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• ประวัติแพ้รุนแรงในอดีต (Prior Anaphylaxis): ${priorTh}
• การใช้ยา EpiPen ก่อนมา รพ.: ${epipenText}
• ยาประจำตัวกลุ่มเสี่ยง (ACEi / Beta-blockers): ${medThs.length > 0 ? medThs.join(', ') : 'ปฏิเสธ'}
• โรคประจำตัว (U/D): ${udDisplay}
• ยาประจำตัว (Current Meds): ${medsText}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${allergyDisplay}

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
  narrative += `มารับบริการที่ห้องฉุกเฉินด้วยอาการผื่นแพ้เฉียบพลัน แน่นคอ ตาบวม หรือปากบวม ระยะเวลาประมาณ ${durationStr} ก่อนมาโรงพยาบาล `;
  narrative += `รูปแบบการเกิดอาการ: ${speedTh}${onsetExactStr} `;

  if (trigThs.length > 0) {
    narrative += `สงสัยสิ่งกระตุ้นได้แก่ ${trigThs.join(', ')} `;
  }

  if (rashThs.length > 0) {
    narrative += `อาการทางผิวหนังตรวจพบ ${rashThs.join(', ')} `;
  } else {
    narrative += `ปฏิเสธผื่นลมพิษหรือผื่นคันตามร่างกาย `;
  }

  if (angioThs.length > 0) {
    narrative += `อาการบวมใต้ผิวหนังตรวจพบ ${angioThs.join(', ')} `;
  }

  if (upperThs.length > 0) {
    narrative += `อาการทางเดินหายใจส่วนบนตรวจพบ ${upperThs.join(', ')} `;
  } else {
    narrative += `ปฏิเสธอาการแน่นคอ กลืนลำบาก หรือเสียงแหบ `;
  }

  if (lowerThs.length > 0) {
    narrative += `อาการทางเดินหายใจส่วนล่างตรวจพบ ${lowerThs.join(', ')} `;
  } else {
    narrative += `ปฏิเสธเสียงหวีดในหน้าอกหรือหายใจหอบเหนื่อย `;
  }

  if (circThs.length > 0) {
    narrative += `อาการระบบไหลเวียนโลหิตตรวจพบ ${circThs.join(', ')} `;
  } else {
    narrative += `ปฏิเสธอาการหน้ามืด เป็นลม วูบหมดสติ หรือเหงื่อแตกตัวเย็น `;
  }

  if (giThs.length > 0) {
    narrative += `อาการทางเดินอาหารร่วมตรวจพบ ${giThs.join(', ')} `;
  }

  narrative += `ประวัติการแพ้ในอดีต: ${priorTh} `;
  if (patient.allergyEpipenUsage === 'used_prehospital') {
    narrative += `ผู้ป่วยได้ใช้ยาฉีด EpiPen ประจำตัวไปแล้วก่อนมาถึงโรงพยาบาล `;
  }

  if (medThs.length > 0) {
    narrative += `ประวัติด้านยาสำคัญ: ${medThs.join(', ')} `;
  }
  if (patient.currentMeds) {
    narrative += `ยาเดิมประจำตัว: ${patient.currentMeds} `;
  }

  if (rfs.length > 0) {
    narrative += `\n\nการประเมินสัญญาณวิกฤตห้องฉุกเฉิน: ตรวจพบ ${rfs.map(r => r.textTh).join(', ')}`;
  } else {
    narrative += `\n\nการประเมินสัญญาณวิกฤตห้องฉุกเฉิน: อาการทั่วไปคงที่ ไม่พบสัญญาณวิกฤตที่ต้องช่วยชีวิตเร่งด่วน`;
  }

  // 3. JSON SCHEMA v2.0
  const jsonSchema = {
    encounter: {
      chief_complaint: 'allergy',
      chief_complaint_title_th: 'ผื่นแพ้เฉียบพลัน / แน่นคอ ตาบวม ปากบวม',
      triage_category: 'emergency_medicine',
      calculated_triage_level: rfs.length > 0 ? Math.min(...rfs.map(r => r.triageLevel)) : 4,
      entry_timestamp: new Date().toISOString()
    },
    clinical_assessment: {
      onset: {
        duration_value: patient.durationVal || null,
        duration_unit: patient.durationUnit || 'minutes',
        onset_speed: patient.allergyOnsetSpeed || null,
        exact_onset_date: patient.allergyOnsetExactDate || null,
        exact_onset_time: patient.allergyOnsetExactTime || null
      },
      suspected_triggers: {
        food: triggers.includes('food') ? (patient.allergyTriggerFoodText || true) : false,
        medication: triggers.includes('medication') ? (patient.allergyTriggerMedText || true) : false,
        insect_sting: triggers.includes('insect_sting') ? (patient.allergyTriggerInsectText || true) : false,
        radiocontrast_or_anesthesia: triggers.includes('radiocontrast_anesthesia'),
        contact_allergen: triggers.includes('contact_latex_chemical'),
        unknown_trigger: triggers.includes('unknown_trigger')
      },
      dermatologic_and_mucosal: {
        urticaria: skinRash.includes('urticaria'),
        flushing: skinRash.includes('flushing'),
        erythema: skinRash.includes('erythema_maculopapular'),
        blisters_peeling: skinRash.includes('blisters_peeling'),
        angioedema_lips: angioedema.includes('lips'),
        angioedema_tongue_palate: angioedema.includes('tongue_palate'),
        angioedema_periorbital: angioedema.includes('periorbital_face'),
        angioedema_neck: angioedema.includes('ears_neck'),
        angioedema_extremities: angioedema.includes('extremities_genitalia')
      },
      airway_and_respiratory: {
        stridor: upperAirway.includes('stridor'),
        throat_tightness: upperAirway.includes('throat_tightness'),
        dysphagia_or_drooling: upperAirway.includes('dysphagia_drooling'),
        voice_hoarseness: upperAirway.includes('voice_hoarseness'),
        wheezing: lowerAirway.includes('wheezing'),
        dyspnea: lowerAirway.includes('dyspnea'),
        chest_tightness: lowerAirway.includes('chest_tightness')
      },
      circulation_and_shock: {
        syncope: circulation.includes('syncope'),
        presyncope_dizziness: circulation.includes('presyncope_dizziness'),
        cold_diaphoresis: circulation.includes('cold_diaphoresis')
      },
      gastrointestinal: {
        severe_abd_cramps: gi.includes('severe_abd_cramps'),
        repetitive_vomiting: gi.includes('repetitive_vomiting'),
        watery_diarrhea: gi.includes('watery_diarrhea')
      },
      medications_and_history: {
        prior_anaphylaxis: patient.allergyPriorAnaphylaxis === 'prior_severe_hosp',
        epipen_used_prehospital: patient.allergyEpipenUsage === 'used_prehospital',
        epipen_time: patient.allergyEpipenTimeText || null,
        takes_ace_inhibitors: specialMeds.includes('ace_inhibitors'),
        takes_beta_blockers: specialMeds.includes('beta_blockers'),
        has_asthma: pmhSpecific.includes('asthma'),
        has_cad: pmhSpecific.includes('cad_cvd')
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
  id: 'allergy',
  recordCc: 'acute_allergy',
  titleTh: 'ผื่นแพ้เฉียบพลัน / แน่นคอ ตาบวม ปากบวม',
  sectionDomId: 'allergyQuestionnaireSection',
  headerTh: 'แบบฟอร์มซักประวัติ: ผื่นแพ้เฉียบพลัน / แน่นคอ ตาบวม ปากบวม (Acute Allergic Reaction / Angioedema / Anaphylaxis)',
  headerEn: '(Airway & Hemodynamic Triage)',
  patientBadgeHtml: '<i data-lucide="shield-alert" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-rose-500"></i><span class="whitespace-nowrap">ผื่นแพ้เฉียบพลัน / แน่นคอ ตาบวม ปากบวม</span>',
  doctorCcBadgeHtml: '<i data-lucide="shield-alert" class="w-3.5 h-3.5 mr-1 text-rose-500"></i> CC: ผื่นแพ้เฉียบพลัน / แน่นคอ ตาบวม ปากบวม',
  pmhSectionNumber: 7,
  dateFields: ['allergyOnsetExactDate'],
  timeFields: ['allergyOnsetExactTime'],
  branchIds: ['allergyTriggerFoodWrap', 'allergyTriggerMedWrap', 'allergyTriggerInsectWrap', 'allergyEpipenWrap', 'allergyEpipenTimeWrap'],
  inputIdsToClear: ['allergyDurationVal', 'allergyOnsetExactDate', 'allergyOnsetExactTime', 'allergyTriggerFoodText', 'allergyTriggerMedText', 'allergyTriggerInsectText', 'allergyEpipenTimeText', 'allergy_other_free'],

  algorithm: {
    chiefComplaint: 'acute_allergy',
    titleTh: 'ผื่นแพ้เฉียบพลัน / แน่นคอ ตาบวม ปากบวม',
    schemaCode: 'acute_allergy',
    version: '2.0.0',
    redFlagDefinitions: [
      { key: 'allergy_rf_anaphylaxis_shock', level: 1, textTh: 'ภาวะแพ้รุนแรงคุกคามชีวิต (Anaphylaxis Alert / Impending Shock)' },
      { key: 'allergy_rf_airway_obstruction', level: 1, textTh: 'เสี่ยงต่อการอุดกั้นทางเดินหายใจส่วนบนเฉียบพลัน (Upper Airway Angioedema)' },
      { key: 'allergy_rf_acei_angioedema', level: 2, textTh: 'สงสัยภาวะ Angioedema จากยากลุ่ม ACE Inhibitors (ACEi-induced Angioedema)' },
      { key: 'allergy_rf_beta_blocker_refractory', level: 2, textTh: 'เสี่ยงต่อภาวะดื้อยา Adrenaline จากการใช้ยา Beta-Blockers' },
      { key: 'allergy_rf_blistering_mucocutaneous', level: 2, textTh: 'สงสัยกลุ่มอาการผื่นแพ้ยารุนแรง (SCARs / SJS / TEN)' }
    ]
  },

  formHtml: `
    <div id="allergyQuestionnaireSection" class="space-y-6 hidden">
      <!-- Card 1: Onset, Duration & Exposure Triggers -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="clock" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">1. ระยะเวลาและสิ่งกระตุ้นต้องสงสัย (Onset, Duration & Exposure Triggers)</h2>
            <p class="text-xs text-slate-500">ประเมินระยะเวลาการสัมผัสสิ่งกระตุ้น ยา อาหาร หรือแมลงกัดต่อย</p>
          </div>
        </div>
        <div class="space-y-5">
          <!-- 1.1 ระยะเวลาตั้งแต่เริ่มมีอาการ -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              ระยะเวลาตั้งแต่เริ่มมีอาการผื่น คัน หรือบวมรอบนี้ <span class="text-rose-500">*</span>
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div class="col-span-1 sm:col-span-2">
                <input type="number" id="allergyDurationVal" min="1" max="1000" placeholder="เช่น 30" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm placeholder:text-slate-400 placeholder:font-normal">
              </div>
              <div class="col-span-1">
                <select id="allergyDurationUnit" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm">
                  <option value="minutes" selected>นาที</option>
                  <option value="hours">ชั่วโมง</option>
                  <option value="days">วัน</option>
                  <option value="weeks">สัปดาห์</option>
                  <option value="months">เดือน</option>
                  <option value="years">ปี</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 1.2 ความรวดเร็วในการเกิดอาการ -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              ความรวดเร็วในการเกิดอาการ
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="allergyOnsetSpeed" value="rapid_within_minutes" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">รวดเร็วมาก (ในไม่กี่นาที ถึง 1–2 ชม.)</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="allergyOnsetSpeed" value="gradual_throughout_day" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ค่อยๆ เป็นเพิ่มขึ้นตลอดวัน</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="allergyOnsetSpeed" value="chronic_gt_6weeks" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เป็นๆ หายๆ มาหลายวัน</span>
              </label>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">ระบุวันที่และเวลาที่เริ่มสังเกตเห็นอาการ (หากทราบ)</label>
            <div class="grid grid-cols-2 gap-2">
              <input type="text" id="allergyOnsetExactDate" placeholder="วว/ดด/ปปปป" data-universal-date="true" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
              <input type="text" id="allergyOnsetExactTime" placeholder="ชช:นน (24 ชม.)" data-universal-time="true" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">สงสัยว่ามีอาการหลังสัมผัสสิ่งใดในรอบ 2–4 ชั่วโมงที่ผ่านมา (เลือกได้หลายข้อ):</label>
            <div class="space-y-1.5">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergySuspectedTriggers" value="food" onchange="handleAllergyTriggerFoodToggle(this)" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">อาหาร เช่น กุ้ง ปู หอย ถั่วลิสง ไข่ นมวัว แป้งสาลี แมลงทอด</span>
              </label>
              <div id="allergyTriggerFoodWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2">
                <input type="text" id="allergyTriggerFoodText" placeholder="ระบุชื่ออาหารที่สงสัย..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
              </div>

              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergySuspectedTriggers" value="medication" onchange="handleAllergyTriggerMedToggle(this)" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ยาปฏิชีวนะ หรือยาอื่นๆ เช่น ยาฆ่าเชื้อ ยาแก้ปวด NSAIDs ยาที่เพิ่งเริ่มใหม่</span>
              </label>
              <div id="allergyTriggerMedWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2">
                <input type="text" id="allergyTriggerMedText" placeholder="ระบุชื่อยาที่สงสัย..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
              </div>

              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergySuspectedTriggers" value="insect_sting" onchange="handleAllergyTriggerInsectToggle(this)" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ถูกแมลงหรือสัตว์มีพิษกัดต่อย เช่น ผึ้ง ต่อ แตน มดตะนอย</span>
              </label>
              <div id="allergyTriggerInsectWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2">
                <input type="text" id="allergyTriggerInsectText" placeholder="ระบุชนิดแมลงและตำแหน่งที่โดนต่อย..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
              </div>

              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergySuspectedTriggers" value="radiocontrast_anesthesia" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">การฉีดสารทึบรังสี (CT Scan/X-ray) หรือได้รับยาชา/ยาสลบ</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergySuspectedTriggers" value="contact_latex_chemical" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">สัมผัสสิ่งของภายนอก เช่น ถุงมือยางลาเท็กซ์ สารเคมี พืช ดอกไม้ เครื่องสำอาง</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergySuspectedTriggers" value="unknown_trigger" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่ทราบสิ่งกระตุ้นแน่ชัด อยู่ๆ ก็มีอาการขึ้นมาเอง</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 2: Rash & Soft Tissue Angioedema -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="activity" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">2. อาการทางผิวหนังและเนื้อเยื่อบวม (Skin & Soft Tissue Angioedema)</h2>
            <p class="text-xs text-slate-500">ตรวจสอบผื่นลมพิษ คัน บวมตา บวมปาก หรือบวมใบหน้า</p>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">ลักษณะผื่นทางผิวหนังที่พบ (เลือกได้หลายข้อ):</label>
            <div class="space-y-1.5">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergySkinRash" value="urticaria" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีผื่นลมพิษนูนหนา สีแดง คันมาก ย้ายที่ไปมาได้</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergySkinRash" value="flushing" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ผิวหนังแดงก่ำทั่วตัว รู้สึกร้อนวูบวาบตามใบหน้าและลำตัว</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergySkinRash" value="erythema_maculopapular" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีผื่นแดงราบ จุดแดง หรือตุ่มคันเล็กๆ ทั่วไป</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergySkinRash" value="blisters_peeling" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีตุ่มน้ำพองใส หรือผิวหนังลอกหลุด เจ็บแสบผิว</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergySkinRash" value="none_rash" onchange="handleAllergySkinRashNoneToggle(this)" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่มีผื่นคันตามผิวหนังเลย</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">บริเวณที่มีอาการบวมนูนของเนื้อเยื่อ (Angioedema - เลือกได้หลายข้อ):</label>
            <div class="space-y-1.5">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergyAngioedema" value="lips" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ริมฝีปากบวมเจ่อ หรือรู้สึกว่าริมฝีปากหนาขึ้นผิดปกติ</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergyAngioedema" value="tongue_palate" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ลิ้นบวมโตคับปาก ลิ้นคับฟัน หรือรู้สึกเพดานปากบวม</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergyAngioedema" value="periorbital_face" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เปลือกตาบวม ตาปิด ลืมตาไม่ขึ้น หรือคิ้วและใบหน้าบวมตึง</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergyAngioedema" value="ears_neck" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ใบหูบวม ลำคอด้านนอกบวม</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergyAngioedema" value="extremities_genitalia" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มือบวม เท้าบวม หรืออวัยวะเพศบวม</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergyAngioedema" value="none_angioedema" onchange="handleAllergyAngioedemaNoneToggle(this)" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่มีอาการบวมตามใบหน้า ริมฝีปาก หรืออวัยวะใดๆ</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 3: Airway, Breathing & Circulation Symptoms -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="shield-alert" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">3. สัญญาณเตือนทางเดินหายใจและระบบไหลเวียนโลหิต (Airway, Breathing & Circulation Symptoms)</h2>
            <p class="text-xs text-slate-500">คัดกรองภาวะแพ้รุนแรง (Anaphylaxis) แน่นคอ หายใจหวีด หรือหน้ามืดเป็นลม</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <!-- Upper Airway -->
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">ทางเดินหายใจส่วนบนและลำคอ:</label>
            <div class="space-y-1.5">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergyUpperAirway" value="throat_tightness" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">รู้สึกแน่นในลำคอ เหมือนมีก้อนจุกติดคอหอย</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergyUpperAirway" value="dysphagia_drooling" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">กลืนลำบาก กลืนน้ำลายไม่ลง หรือมีน้ำลายไหลย้อย</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergyUpperAirway" value="voice_hoarseness" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เสียงแหบเฉียบพลัน หรือพูดเสียงเปลี่ยนไป (อมของร้อน)</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergyUpperAirway" value="stridor" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">หายใจมีเสียงฮืด หรือเสียงวี้ดสูงแหลมในลำคอ (Stridor)</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergyUpperAirway" value="nasal_congestion" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">แน่นจมูก หายใจทางจมูกลำบาก</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergyUpperAirway" value="none_upper_airway" onchange="handleAllergyUpperAirwayNoneToggle(this)" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่มีอาการทางเดินหายใจส่วนบนเหล่านี้</span>
              </label>
            </div>
          </div>

          <!-- Lower Airway -->
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">ทางเดินหายใจส่วนล่างและปอด:</label>
            <div class="space-y-1.5">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergyLowerAirway" value="dyspnea" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">หายใจหอบเหนื่อย หายใจไม่อิ่ม หรือหายใจเร็ว</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergyLowerAirway" value="wheezing" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">หายใจมีเสียงหวีดดังวี้ดๆ ออกมาจากในหน้าอก</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergyLowerAirway" value="chest_tightness" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">แน่นอึดอัดกลางหน้าอก หายใจเข้าไม่เต็มปอด</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergyLowerAirway" value="none_lower_airway" onchange="handleAllergyLowerAirwayNoneToggle(this)" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่มีอาการทางเดินหายใจส่วนล่างเหล่านี้</span>
              </label>
            </div>
          </div>

          <!-- Circulation & Shock -->
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">ระบบไหลเวียนโลหิตและภาวะช็อก:</label>
            <div class="space-y-1.5">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergyCirculationShock" value="presyncope_dizziness" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">หน้ามืด วิงเวียนศีรษะรุนแรง ตาพร่ามัว ทรงตัวไม่อยู่</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergyCirculationShock" value="syncope" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">วูบ เป็นลม หมดสติไปชั่วคราว หรือทิ้งตัวลงกับพื้น</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergyCirculationShock" value="cold_diaphoresis" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เหงื่อแตกท่วมตัว ตัวเย็นชืด มือเท้าเย็นจัด หรือซีด</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergyCirculationShock" value="none_circulation" onchange="handleAllergyCirculationNoneToggle(this)" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่มีอาการผิดปกติในระบบไหลเวียนโลหิต</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 4: Gastrointestinal Symptoms -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="utensils" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">4. อาการในระบบทางเดินอาหาร (Gastrointestinal Symptoms)</h2>
            <p class="text-xs text-slate-500">ตรวจสอบอาการปวดเกร็งช่องท้อง คลื่นไส้อาเจียน หรือถ่ายเหลว</p>
          </div>
        </div>

        <label class="block text-xs font-medium text-slate-700 mb-1">อาการทางระบบทางเดินอาหารที่พบร่วมด้วย (เลือกได้หลายข้อ):</label>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
            <input type="checkbox" name="allergyGiSymptoms" value="severe_abd_cramps" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
            <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ปวดเกร็งท้องรุนแรง หรือปวดบิดในช่องท้องมากผิดปกติ</span>
          </label>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
            <input type="checkbox" name="allergyGiSymptoms" value="repetitive_vomiting" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
            <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">คลื่นไส้ หรืออาเจียนติดต่อกันหลายครั้ง</span>
          </label>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
            <input type="checkbox" name="allergyGiSymptoms" value="watery_diarrhea" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
            <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ถ่ายเหลวเป็นน้ำเฉียบพลัน หรือถ่ายบ่อยหลายครั้ง</span>
          </label>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
            <input type="checkbox" name="allergyGiSymptoms" value="none_gi" onchange="handleAllergyGiNoneToggle(this)" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
            <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่มีอาการผิดปกติในระบบทางเดินอาหาร</span>
          </label>
        </div>
      </div>

      <!-- Card 5: History, Meds & Prior Care -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="file-text" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">5. ประวัติการแพ้ ยาประจำตัว และการดูแลเบื้องต้น (History, Meds & Prior Care)</h2>
            <p class="text-xs text-slate-500">ตรวจสอบประวัติแพ้เดิม การใช้ยาแก้แพ้ และการพกยาฉีด EpiPen</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">ประวัติการแพ้รุนแรงในอดีต (Prior Anaphylaxis):</label>
            <div class="space-y-1.5">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="allergyPriorAnaphylaxis" value="prior_severe_hosp" onchange="handleAllergyPriorAnaphylaxisChange('prior_severe_hosp')" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เคยมีประวัติแพ้รุนแรง (Anaphylaxis) นอนโรงพยาบาล หรือเคยฉีดยา Adrenaline มาก่อน</span>
              </label>

              <!-- Epipen Subwrap -->
              <div id="allergyEpipenWrap" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-3 space-y-2">
                <label class="block text-[11px] font-medium text-slate-700 mb-1">มียาฉีดแก้แพ้พกพา (EpiPen) ประจำตัวหรือไม่:</label>
                <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="radio" name="allergyEpipenUsage" value="used_prehospital" onchange="handleAllergyEpipenUsageChange('used_prehospital')" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                  <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มี และได้ฉีดยาไปแล้วก่อนมาโรงพยาบาล</span>
                </label>
                <div id="allergyEpipenTimeWrap" class="hidden bg-white border border-slate-200 rounded-xl p-3 mt-2">
                  <input type="text" id="allergyEpipenTimeText" placeholder="ระบุเวลาที่ฉีด (เช่น 11:30 น.)..." class="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
                </div>
                <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="radio" name="allergyEpipenUsage" value="has_not_used" onchange="handleAllergyEpipenUsageChange('has_not_used')" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                  <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มี แต่ยังไม่ได้ฉีดยา</span>
                </label>
                <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="radio" name="allergyEpipenUsage" value="none_epipen" onchange="handleAllergyEpipenUsageChange('none_epipen')" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                  <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่มี</span>
                </label>
              </div>

              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="allergyPriorAnaphylaxis" value="prior_mild_urticaria" onchange="handleAllergyPriorAnaphylaxisChange('prior_mild_urticaria')" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เคยมีเพียงผื่นลมพิษหรือผื่นคันธรรมดา ไม่เคยแน่นคอหรือช็อก</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="allergyPriorAnaphylaxis" value="first_time_never" onchange="handleAllergyPriorAnaphylaxisChange('first_time_never')" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่เคยมีประวัติแพ้อะไรมาก่อน ครั้งนี้เป็นครั้งแรก</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">ประวัติการใช้ยาประจำตัวกลุ่มพิเศษ (สำคัญมาก):</label>
            <div class="space-y-1.5">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergySpecialMeds" value="ace_inhibitors" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">รับประทานยาลดความดันกลุ่ม ACE inhibitors (เช่น Enalapril, Ramipril, Captopril, Lisinopril)</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergySpecialMeds" value="beta_blockers" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">รับประทานยาลดความดันกลุ่ม Beta-blockers (เช่น Atenolol, Propranolol, Carvedilol, Metoprolol)</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" name="allergySpecialMeds" value="none_special_meds" onchange="handleAllergySpecialMedsNoneToggle(this)" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่ได้รับประทานยากลุ่มเหล่านี้</span>
              </label>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-100">
              <label class="block text-xs font-medium text-slate-700 mb-1">ประวัติโรคประจำตัวที่สำคัญ:</label>
              <div class="space-y-1.5">
                <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="checkbox" name="allergyPmhSpecific" value="asthma" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                  <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">โรคหอบหืด (Asthma)</span>
                </label>
                <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="checkbox" name="allergyPmhSpecific" value="cad_cvd" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                  <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">โรคหลอดเลือดหัวใจหรือโรคหัวใจ</span>
                </label>
                <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="checkbox" name="allergyPmhSpecific" value="none_pmh_specific" onchange="handleAllergyPmhNoneToggle(this)" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
                  <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่มีโรคประจำตัวเหล่านี้</span>
                </label>
              </div>
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
        <textarea id="allergy_other_free" rows="2" placeholder="ระบุอาการอื่นๆ เพิ่มเติม (ถ้ามี)..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500"></textarea>
      </div>
    </div>
  `,

  collectIntake: function(ctx) {
    const _rawDur = parseFloat(document.getElementById('allergyDurationVal')?.value); const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
    const durationUnit = document.getElementById('allergyDurationUnit')?.value || 'minutes';

    const allergyOnsetSpeed = document.querySelector('input[name="allergyOnsetSpeed"]:checked')?.value || '';
    const allergyOnsetExactDate = document.getElementById('allergyOnsetExactDate')?.value?.trim() || '';
    const allergyOnsetExactTime = document.getElementById('allergyOnsetExactTime')?.value?.trim() || '';

    const allergySuspectedTriggers = Array.from(document.querySelectorAll('input[name="allergySuspectedTriggers"]:checked')).map(el => el.value);
    const allergyTriggerFoodText = document.getElementById('allergyTriggerFoodText')?.value?.trim() || '';
    const allergyTriggerMedText = document.getElementById('allergyTriggerMedText')?.value?.trim() || '';
    const allergyTriggerInsectText = document.getElementById('allergyTriggerInsectText')?.value?.trim() || '';

    const allergySkinRash = Array.from(document.querySelectorAll('input[name="allergySkinRash"]:checked')).map(el => el.value);
    const allergyAngioedema = Array.from(document.querySelectorAll('input[name="allergyAngioedema"]:checked')).map(el => el.value);

    const allergyUpperAirway = Array.from(document.querySelectorAll('input[name="allergyUpperAirway"]:checked')).map(el => el.value);
    const allergyLowerAirway = Array.from(document.querySelectorAll('input[name="allergyLowerAirway"]:checked')).map(el => el.value);
    const allergyCirculationShock = Array.from(document.querySelectorAll('input[name="allergyCirculationShock"]:checked')).map(el => el.value);
    const allergyGiSymptoms = Array.from(document.querySelectorAll('input[name="allergyGiSymptoms"]:checked')).map(el => el.value);

    const allergyPriorAnaphylaxis = document.querySelector('input[name="allergyPriorAnaphylaxis"]:checked')?.value || '';
    const allergyEpipenUsage = document.querySelector('input[name="allergyEpipenUsage"]:checked')?.value || '';
    const allergyEpipenTimeText = document.getElementById('allergyEpipenTimeText')?.value?.trim() || '';

    const allergySpecialMeds = Array.from(document.querySelectorAll('input[name="allergySpecialMeds"]:checked')).map(el => el.value);
    const allergyPmhSpecific = Array.from(document.querySelectorAll('input[name="allergyPmhSpecific"]:checked')).map(el => el.value);

    return {
      id: ctx.recordId,
      queue_number: ctx.queueNumber,
      hn: ctx.randomHn,
      name: ctx.patientName,
      age: ctx.patientAge,
      gender: ctx.gender,
      chief_complaint: 'allergy',
      chief_complaint_title: 'ผื่นแพ้เฉียบพลัน / แน่นคอ ตาบวม ปากบวม',
      timestamp: new Date().toISOString(),
      status: ctx.recordStatus,
      durationVal,
      durationUnit,
      hospRecordStatus: ctx.hospRecordStatus,
      underlying: ctx.underlying,
      drugAllergy: ctx.drugAllergy,
      currentMeds: ctx.currentMeds,
      otherSymptomsFree: document.getElementById('allergy_other_free')?.value?.trim() || ctx.otherSymptomsFree || '',
      doctor_notes: ctx.preservedDoctorNotes,

      allergyOnsetSpeed,
      allergyOnsetExactDate,
      allergyOnsetExactTime,
      allergySuspectedTriggers,
      allergyTriggerFoodText,
      allergyTriggerMedText,
      allergyTriggerInsectText,
      allergySkinRash,
      allergyAngioedema,
      allergyUpperAirway,
      allergyLowerAirway,
      allergyCirculationShock,
      allergyGiSymptoms,
      allergyPriorAnaphylaxis,
      allergyEpipenUsage,
      allergyEpipenTimeText,
      allergySpecialMeds,
      allergyPmhSpecific
    };
  },

  populateForm: function(patient) {
    if (!patient) return;

    const durVal = document.getElementById('allergyDurationVal');
    if (durVal) durVal.value = patient.durationVal || '';

    const durUnit = document.getElementById('allergyDurationUnit');
    if (durUnit) durUnit.value = patient.durationUnit || 'minutes';

    const onDate = document.getElementById('allergyOnsetExactDate');
    if (onDate) onDate.value = patient.allergyOnsetExactDate || '';

    const onTime = document.getElementById('allergyOnsetExactTime');
    if (onTime) onTime.value = patient.allergyOnsetExactTime || '';

    if (patient.allergyOnsetSpeed) {
      const r = document.querySelector(`input[name="allergyOnsetSpeed"][value="${patient.allergyOnsetSpeed}"]`);
      if (r) r.checked = true;
    }

    if (Array.isArray(patient.allergySuspectedTriggers)) {
      document.querySelectorAll('input[name="allergySuspectedTriggers"]').forEach(cb => {
        cb.checked = patient.allergySuspectedTriggers.includes(cb.value);
        if (cb.value === 'food') handleAllergyTriggerFoodToggle(cb);
        if (cb.value === 'medication') handleAllergyTriggerMedToggle(cb);
        if (cb.value === 'insect_sting') handleAllergyTriggerInsectToggle(cb);
      });
    }
    const fText = document.getElementById('allergyTriggerFoodText');
    if (fText) fText.value = patient.allergyTriggerFoodText || '';
    const mText = document.getElementById('allergyTriggerMedText');
    if (mText) mText.value = patient.allergyTriggerMedText || '';
    const iText = document.getElementById('allergyTriggerInsectText');
    if (iText) iText.value = patient.allergyTriggerInsectText || '';

    if (Array.isArray(patient.allergySkinRash)) {
      document.querySelectorAll('input[name="allergySkinRash"]').forEach(cb => {
        cb.checked = patient.allergySkinRash.includes(cb.value);
      });
    }

    if (Array.isArray(patient.allergyAngioedema)) {
      document.querySelectorAll('input[name="allergyAngioedema"]').forEach(cb => {
        cb.checked = patient.allergyAngioedema.includes(cb.value);
      });
    }

    if (Array.isArray(patient.allergyUpperAirway)) {
      document.querySelectorAll('input[name="allergyUpperAirway"]').forEach(cb => {
        cb.checked = patient.allergyUpperAirway.includes(cb.value);
      });
    }

    if (Array.isArray(patient.allergyLowerAirway)) {
      document.querySelectorAll('input[name="allergyLowerAirway"]').forEach(cb => {
        cb.checked = patient.allergyLowerAirway.includes(cb.value);
      });
    }

    if (Array.isArray(patient.allergyCirculationShock)) {
      document.querySelectorAll('input[name="allergyCirculationShock"]').forEach(cb => {
        cb.checked = patient.allergyCirculationShock.includes(cb.value);
      });
    }

    if (Array.isArray(patient.allergyGiSymptoms)) {
      document.querySelectorAll('input[name="allergyGiSymptoms"]').forEach(cb => {
        cb.checked = patient.allergyGiSymptoms.includes(cb.value);
      });
    }

    if (patient.allergyPriorAnaphylaxis) {
      const r = document.querySelector(`input[name="allergyPriorAnaphylaxis"][value="${patient.allergyPriorAnaphylaxis}"]`);
      if (r) {
        r.checked = true;
        handleAllergyPriorAnaphylaxisChange(patient.allergyPriorAnaphylaxis);
      }
    }

    if (patient.allergyEpipenUsage) {
      const r = document.querySelector(`input[name="allergyEpipenUsage"][value="${patient.allergyEpipenUsage}"]`);
      if (r) {
        r.checked = true;
        handleAllergyEpipenUsageChange(patient.allergyEpipenUsage);
      }
    }
    const epTime = document.getElementById('allergyEpipenTimeText');
    if (epTime) epTime.value = patient.allergyEpipenTimeText || '';

    if (Array.isArray(patient.allergySpecialMeds)) {
      document.querySelectorAll('input[name="allergySpecialMeds"]').forEach(cb => {
        cb.checked = patient.allergySpecialMeds.includes(cb.value);
      });
    }

    if (Array.isArray(patient.allergyPmhSpecific)) {
      document.querySelectorAll('input[name="allergyPmhSpecific"]').forEach(cb => {
        cb.checked = patient.allergyPmhSpecific.includes(cb.value);
      });
    }

    const oText = document.getElementById('allergy_other_free');
    if (oText) oText.value = patient.otherSymptomsFree || '';
  },

  hydrateForm: function(patient) {
    this.populateForm(patient);
  },

  isRedFlag: function(patient) {
    return evaluateAllergyRedFlags(patient).length > 0;
  },

  evaluateRedFlags: evaluateAllergyRedFlags,
  updateOutputs: updateAllergyOutputs,

  generateCds: function(patient, { rfs, ddxList = [], workupList = [], managementList = [] } = {}) {
    if (!patient) return;
    const specialMeds = Array.isArray(patient.allergySpecialMeds) ? patient.allergySpecialMeds : [];
    const pmhSpecific = Array.isArray(patient.allergyPmhSpecific) ? patient.allergyPmhSpecific : [];

    // 1. Differential Diagnoses
    if (rfs && rfs.some(r => r.key === 'allergy_rf_anaphylaxis_shock')) {
      ddxList.push('1. 🚨 Anaphylactic Shock / Severe Anaphylaxis (WAO/NIAID criteria met)');
      ddxList.push('2. Severe Acute Asthma Exacerbation triggered by allergen');
      ddxList.push('3. Vasovagal Syncope with Urticaria');
    } else if (rfs && rfs.some(r => r.key === 'allergy_rf_acei_angioedema')) {
      ddxList.push('1. 🚨 ACE-Inhibitor Induced Angioedema (Bradykinin-mediated)');
      ddxList.push('2. Hereditary / Acquired Angioedema (C1-INH deficiency)');
      ddxList.push('3. Histaminergic Angioedema');
    } else if (rfs && rfs.some(r => r.key === 'allergy_rf_airway_obstruction')) {
      ddxList.push('1. 🚨 Acute Laryngeal Angioedema / Impending Upper Airway Obstruction');
      ddxList.push('2. Acute Epiglottitis / Peritonsillar Abscess');
      ddxList.push('3. Foreign Body Aspiration');
    } else if (rfs && rfs.some(r => r.key === 'allergy_rf_blistering_mucocutaneous')) {
      ddxList.push('1. 🚨 Severe Cutaneous Adverse Reaction (Stevens-Johnson Syndrome / TEN)');
      ddxList.push('2. Staphylococcal Scalded Skin Syndrome (SSSS)');
      ddxList.push('3. Bullous Pemphigoid');
    } else {
      ddxList.push('1. Acute Urticaria (Benign / Histaminergic)');
      ddxList.push('2. Contact Dermatitis');
      ddxList.push('3. Viral Exanthem');
    }

    // 2. Bedside & Rapid Workup
    workupList.push('Continuous Vital Signs & SpO2 Monitor, 12-lead EKG');
    if (rfs && rfs.some(r => r.key === 'allergy_rf_anaphylaxis_shock')) {
      workupList.push('Serum Tryptase (ตรวจวัดภายใน 1-2 ชม. หลังเกิดอาการ เพื่อยืนยัน Mast cell activation)');
      workupList.push('Stat CBC, Electrolytes, BUN, Cr, Venous Blood Gas / Lactate');
    }
    if (rfs && rfs.some(r => r.key === 'allergy_rf_airway_obstruction')) {
      workupList.push('Fiberoptic Nasopharyngolaryngoscopy (โดย ENT หรือแพทย์ดมยา เพื่อประเมิน Vocal cords / Laryngeal edema)');
    }

    // 3. Initial Management & Safety Alerts
    if (rfs && rfs.some(r => r.key === 'allergy_rf_anaphylaxis_shock')) {
      managementList.push('Adrenaline IM STAT: ให้ Adrenaline (1:1,000) 0.3–0.5 mg IM บริเวณ anterolateral thigh ทันที (เด็ก 0.01 mg/kg สูงสุด 0.3 mg)');
      managementList.push('Position: ให้นอนราบยกขาสูง (Supine with legs elevated) ห้ามลุกนั่งหรือยืนกะทันหันเด็ดขาด (ป้องกัน Empty Heart Syndrome)');
      managementList.push('Fluid Resuscitation: IV NSS 1,000–2,000 mL bolus อย่างรวดเร็ว (เด็ก 20 mL/kg)');
      managementList.push('Oxygen: High-flow O2 Mask with Reservoir Bag 10–15 LPM');
      managementList.push('Second-line: IV Chlorpheniramine 10 mg + IV Dexamethasone 10 mg หรือ Hydrocortisone 100-200 mg (ให้หลัง Adrenaline เสมอ)');
    }
    if (rfs && rfs.some(r => r.key === 'allergy_rf_airway_obstruction')) {
      managementList.push('Difficult Airway Alert: เตรียม Video Laryngoscope และ Surgical Airway Kit (Cricothyroidotomy) ข้างเตียงทันที');
      managementList.push('Nebulizer: Adrenaline 1:1,000 (2-5 mL) Nebulize เพื่อลดบวมของกล่องเสียง');
    }
    if (rfs && rfs.some(r => r.key === 'allergy_rf_acei_angioedema')) {
      managementList.push('Discontinue: สั่งหยุดยากลุ่ม ACEi และห้ามใช้ ARBs ตลอดชีวิต');
      managementList.push('FFP: พิจารณาให้ Fresh Frozen Plasma (FFP 1–2 units) เพื่อให้ Kininase II ช่วยสลาย Bradykinin');
    }
    if (rfs && rfs.some(r => r.key === 'allergy_rf_beta_blocker_refractory') || specialMeds.includes('beta_blockers')) {
      managementList.push('Glucagon: หากดื้อต่อ Adrenaline ให้ IV Glucagon 1–5 mg IV over 5 mins ตามด้วย Infusion 5–15 mcg/min');
    }
    if (pmhSpecific.includes('asthma')) {
      managementList.push('Bronchospasm: พ่น Salbutamol + Ipratropium Nebulizer ร่วมด้วยอย่างต่อเนื่อง');
    }
    managementList.push('Observation: เฝ้าระวังอาการใน ER/ICU อย่างน้อย 6–24 ชม. เพื่อป้องกัน Biphasic Anaphylaxis Reaction');
  },

  appendCdsRecommendations: function(patient, rfs, workupList, managementList) {
    this.generateCds(patient, { rfs, ddxList: [], workupList, managementList });
  },

  seedPatients: [
    {
      id: 'case-160',
      queue_number: 'Q-001',
      hn: '6716012',
      name: 'นายกฤษณะ เมธาชัย',
      age: 28,
      gender: 'ชาย',
      chief_complaint: 'allergy',
      chief_complaint_title: 'ผื่นแพ้เฉียบพลัน / แน่นคอ ตาบวม ปากบวม',
      timestamp: '2026-10-26T07:00:00.000Z',
      status: 'waiting',
      durationVal: 30,
      durationUnit: 'minutes',
      hospRecordStatus: 'self',
      underlying: ['หอบหืด (Bronchial Asthma)'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Budesonide/Formoterol Turbuhaler',
      otherSymptomsFree: 'ความดันโลหิต 82/48 mmHg ชีพจร 128 ครั้ง/นาที',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },

      allergyOnsetSpeed: 'rapid_within_minutes',
      allergyOnsetExactDate: '26/10/2026',
      allergyOnsetExactTime: '06:30',
      allergySuspectedTriggers: ['food'],
      allergyTriggerFoodText: 'ต้มยำกุ้ง',
      allergyTriggerMedText: '',
      allergyTriggerInsectText: '',
      allergySkinRash: ['urticaria', 'flushing'],
      allergyAngioedema: ['lips', 'tongue_palate', 'periorbital_face'],
      allergyUpperAirway: ['throat_tightness', 'voice_hoarseness', 'dysphagia_drooling'],
      allergyLowerAirway: ['dyspnea', 'wheezing', 'chest_tightness'],
      allergyCirculationShock: ['presyncope_dizziness', 'cold_diaphoresis'],
      allergyGiSymptoms: ['severe_abd_cramps', 'repetitive_vomiting'],
      allergyPriorAnaphylaxis: 'prior_mild_urticaria',
      allergyEpipenUsage: '',
      allergyEpipenTimeText: '',
      allergySpecialMeds: ['none_special_meds'],
      allergyPmhSpecific: ['asthma']
    },
    {
      id: 'case-161',
      queue_number: 'Q-002',
      hn: '6716123',
      name: 'นางทองดี ศรีสวัสดิ์',
      age: 68,
      gender: 'หญิง',
      chief_complaint: 'allergy',
      chief_complaint_title: 'ผื่นแพ้เฉียบพลัน / แน่นคอ ตาบวม ปากบวม',
      timestamp: '2026-10-26T07:45:00.000Z',
      status: 'waiting',
      durationVal: 2,
      durationUnit: 'hours',
      hospRecordStatus: 'self',
      underlying: ['ความดันสูง (HT)', 'เบาหวาน (DM)'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Enalapril 10 mg วันละ 1 ครั้ง, Metformin 500 mg',
      otherSymptomsFree: 'ตื่นเช้ามาลิ้นบวมคับปาก พูดไม่ชัด น้ำลายย้อย ไม่มีลมพิษ ไม่คัน',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },

      allergyOnsetSpeed: 'rapid_within_minutes',
      allergyOnsetExactDate: '26/10/2026',
      allergyOnsetExactTime: '05:45',
      allergySuspectedTriggers: ['medication'],
      allergyTriggerFoodText: '',
      allergyTriggerMedText: 'Enalapril 10 mg ทานมา 6 เดือน',
      allergyTriggerInsectText: '',
      allergySkinRash: ['none_rash'],
      allergyAngioedema: ['lips', 'tongue_palate'],
      allergyUpperAirway: ['throat_tightness', 'dysphagia_drooling', 'voice_hoarseness'],
      allergyLowerAirway: ['none_lower_airway'],
      allergyCirculationShock: ['none_circulation'],
      allergyGiSymptoms: ['none_gi'],
      allergyPriorAnaphylaxis: 'first_time_never',
      allergyEpipenUsage: '',
      allergyEpipenTimeText: '',
      allergySpecialMeds: ['ace_inhibitors'],
      allergyPmhSpecific: ['none_pmh_specific']
    },
    {
      id: 'case-162',
      queue_number: 'Q-003',
      hn: '6716234',
      name: 'ด.ช. ภัทรพล สุขสม',
      age: 11,
      gender: 'ชาย',
      chief_complaint: 'allergy',
      chief_complaint_title: 'ผื่นแพ้เฉียบพลัน / แน่นคอ ตาบวม ปากบวม',
      timestamp: '2026-10-26T08:30:00.000Z',
      status: 'waiting',
      durationVal: 15,
      durationUnit: 'minutes',
      hospRecordStatus: 'self',
      underlying: ['หอบหืด (Asthma)'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Salbutamol MDI prn',
      otherSymptomsFree: 'โดนแตนต่อยที่ต้นแขนขวา 2 ตัว ลมพิษขึ้นเร็ว แน่นหน้าอก หายใจหวีด',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },

      allergyOnsetSpeed: 'rapid_within_minutes',
      allergyOnsetExactDate: '26/10/2026',
      allergyOnsetExactTime: '08:15',
      allergySuspectedTriggers: ['insect_sting'],
      allergyTriggerFoodText: '',
      allergyTriggerMedText: '',
      allergyTriggerInsectText: 'แตนต่อยที่แขนขวา 2 จุด',
      allergySkinRash: ['urticaria', 'flushing'],
      allergyAngioedema: ['none_angioedema'],
      allergyUpperAirway: ['throat_tightness'],
      allergyLowerAirway: ['dyspnea', 'wheezing', 'chest_tightness'],
      allergyCirculationShock: ['none_circulation'],
      allergyGiSymptoms: ['none_gi'],
      allergyPriorAnaphylaxis: 'first_time_never',
      allergyEpipenUsage: '',
      allergyEpipenTimeText: '',
      allergySpecialMeds: ['none_special_meds'],
      allergyPmhSpecific: ['asthma']
    },
    {
      id: 'case-163',
      queue_number: 'Q-004',
      hn: '6716345',
      name: 'นางสาววรรณภา อินทรา',
      age: 24,
      gender: 'หญิง',
      chief_complaint: 'allergy',
      chief_complaint_title: 'ผื่นแพ้เฉียบพลัน / แน่นคอ ตาบวม ปากบวม',
      timestamp: '2026-10-26T09:15:00.000Z',
      status: 'waiting',
      durationVal: 3,
      durationUnit: 'hours',
      hospRecordStatus: 'self',
      underlying: ['ปฏิเสธ'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'ไม่มี',
      otherSymptomsFree: 'ทานส้มตำปูม้าเมื่อ 3 ชม.ก่อน มีผื่นลมพิษคันตามแขนขาและแผ่นหลัง ไม่แน่นคอ หายใจปกติ',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },

      allergyOnsetSpeed: 'gradual_throughout_day',
      allergyOnsetExactDate: '26/10/2026',
      allergyOnsetExactTime: '06:15',
      allergySuspectedTriggers: ['food'],
      allergyTriggerFoodText: 'ส้มตำปูม้า',
      allergyTriggerMedText: '',
      allergyTriggerInsectText: '',
      allergySkinRash: ['urticaria'],
      allergyAngioedema: ['none_angioedema'],
      allergyUpperAirway: ['none_upper_airway'],
      allergyLowerAirway: ['none_lower_airway'],
      allergyCirculationShock: ['none_circulation'],
      allergyGiSymptoms: ['none_gi'],
      allergyPriorAnaphylaxis: 'first_time_never',
      allergyEpipenUsage: '',
      allergyEpipenTimeText: '',
      allergySpecialMeds: ['none_special_meds'],
      allergyPmhSpecific: ['none_pmh_specific']
    }
  ]
});
