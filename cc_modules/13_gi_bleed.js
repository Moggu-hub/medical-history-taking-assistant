// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 13_gi_bleed.js
// อาการนำ: อาเจียนเป็นเลือด / ถ่ายดำ / ถ่ายเป็นเลือดสด (Hematemesis / Melena / Hematochezia / Acute GI Bleeding)
// ไฟล์นี้แยกอิสระสำหรับอาการนำ gi_bleed เพื่อให้ทีมแพทย์และ IT โรงพยาบาลนำไปพัฒนาต่อได้โดยไม่กระทบระบบหลัก
// =========================================================================

// --- UI Toggle Handlers ---
function handleGiHematemesisToggle(el) {
  const isChecked = el ? el.checked : (document.getElementById('gi_hematemesis_cb')?.checked || false);
  const wrap = document.getElementById('giHematemesisWrap');
  if (wrap) {
    if (isChecked) {
      wrap.classList.remove('hidden');
    } else {
      wrap.classList.add('hidden');
      document.querySelectorAll('input[name="giHematemesisChar"]').forEach(r => r.checked = false);
      document.querySelectorAll('input[name="giHematemesisVolume"]').forEach(r => r.checked = false);
      document.querySelectorAll('input[name="giHematemesisFreq"]').forEach(r => r.checked = false);
      document.querySelectorAll('input[name="giPrecedingRetching"]').forEach(r => r.checked = false);
    }
  }
}

function handleGiMelenaToggle(el) {
  const isChecked = el ? el.checked : (document.getElementById('gi_melena_cb')?.checked || false);
  const wrap = document.getElementById('giMelenaWrap');
  if (wrap) {
    if (isChecked) {
      wrap.classList.remove('hidden');
    } else {
      wrap.classList.add('hidden');
      document.querySelectorAll('input[name="giMelenaChar"]').forEach(r => r.checked = false);
      document.querySelectorAll('input[name="giMelenaFreq"]').forEach(r => r.checked = false);
      document.querySelectorAll('input[name="giMelenaPreceded"]').forEach(r => r.checked = false);
      const dWrap = document.getElementById('giMelenaDaysWrap');
      if (dWrap) dWrap.classList.add('hidden');
      const dInp = document.getElementById('giMelenaDays');
      if (dInp) dInp.value = '';
      document.querySelectorAll('input[name="giMelenaActive"]').forEach(r => r.checked = false);
      document.querySelectorAll('input[name="giPseudoMelenaMeds"]').forEach(cb => cb.checked = false);
    }
  }
}

function handleGiMelenaPrecededChange(val) {
  const wrap = document.getElementById('giMelenaDaysWrap');
  if (wrap) {
    if (val === 'yes') {
      wrap.classList.remove('hidden');
    } else {
      wrap.classList.add('hidden');
      const inp = document.getElementById('giMelenaDays');
      if (inp) inp.value = '';
    }
  }
}

function handleGiPseudoMelenaNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="giPseudoMelenaMeds"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleGiHematocheziaToggle(el) {
  const isChecked = el ? el.checked : (document.getElementById('gi_hematochezia_cb')?.checked || false);
  const wrap = document.getElementById('giHematocheziaWrap');
  if (wrap) {
    if (isChecked) {
      wrap.classList.remove('hidden');
    } else {
      wrap.classList.add('hidden');
      document.querySelectorAll('input[name="giHematocheziaChar"]').forEach(r => r.checked = false);
      document.querySelectorAll('input[name="giHematocheziaFreq"]').forEach(r => r.checked = false);
      document.querySelectorAll('input[name="giAnalPain"]').forEach(r => r.checked = false);
      document.querySelectorAll('input[name="giProlapsedMass"]').forEach(r => r.checked = false);
    }
  }
}

function handleGiShockNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="giShockSigns"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleGiAbdpainChange(val) {
  const wrap = document.getElementById('giAbdpainWrap');
  if (wrap) {
    if (val === 'yes') {
      wrap.classList.remove('hidden');
    } else {
      wrap.classList.add('hidden');
      document.querySelectorAll('input[name="giAbdpainLoc"]').forEach(r => r.checked = false);
      document.querySelectorAll('input[name="giAbdpainChars"]').forEach(cb => cb.checked = false);
    }
  }
}

function handleGiAnticoagNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="giAnticoagMeds"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleGiNsaidsNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="giNsaidMeds"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleGiLiverNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="giLiverAlcohol"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleGiPastPudBleedToggle(el) {
  const isChecked = el ? el.checked : (document.getElementById('gi_past_pud_cb')?.checked || false);
  const wrap = document.getElementById('giPastPudBleedWrap');
  if (wrap) {
    if (isChecked) {
      wrap.classList.remove('hidden');
    } else {
      wrap.classList.add('hidden');
      document.querySelectorAll('input[name="giPastPudType"]').forEach(r => r.checked = false);
      document.querySelectorAll('input[name="giPastPudHospital"]').forEach(r => r.checked = false);
    }
  }
}

// --- Red Flag Evaluator ---
function evaluateGiBleedRedFlags(patient) {
  const flags = [];
  if (!patient) return flags;

  const hasHema = !!patient.giHematemesis;
  const hasMelena = !!patient.giMelena;
  const hasChezia = !!patient.giHematochezia;
  const hasActiveBleed = hasHema || hasMelena || hasChezia;

  const shockSigns = Array.isArray(patient.giShockSigns) ? patient.giShockSigns : [];
  const hasSyncope = shockSigns.includes('syncope');
  const hasCold = shockSigns.includes('cold_extremities');
  const hasOliguria = shockSigns.includes('oliguria_anuria');
  const hasDizziness = shockSigns.includes('postural_dizziness');
  const hasAlteredMental = shockSigns.includes('altered_mental');
  const hasPalpitations = shockSigns.includes('palpitations');
  const hasSevereDyspnea = shockSigns.includes('severe_dyspnea_fatigue');

  const liverAlcohol = Array.isArray(patient.giLiverAlcohol) ? patient.giLiverAlcohol : [];
  const hasCirrhosis = liverAlcohol.includes('cirrhosis_varices');
  const hasHeavyAlcohol = liverAlcohol.includes('heavy_alcohol');
  const hasJaundiceAscites = liverAlcohol.includes('jaundice_ascites');

  const pastHistory = Array.isArray(patient.giPastHistory) ? patient.giPastHistory : [];
  const hasAaaRepair = pastHistory.includes('past_aaa_repair');

  const anticoagMeds = Array.isArray(patient.giAnticoagMeds) ? patient.giAnticoagMeds : [];
  const takesWarfarin = anticoagMeds.includes('warfarin');
  const takesDoac = anticoagMeds.includes('doac');
  const takesAntiplatelet = anticoagMeds.includes('antiplatelet');
  const hasBleedingRiskMeds = takesWarfarin || takesDoac || takesAntiplatelet;

  const nsaidMeds = Array.isArray(patient.giNsaidMeds) ? patient.giNsaidMeds : [];
  const takesNsaids = nsaidMeds.includes('nsaids');
  const takesHerbalBolus = nsaidMeds.includes('herbal_bolus');

  const abdpainChars = Array.isArray(patient.giAbdpainChars) ? patient.giAbdpainChars : [];
  const hasPeritonitis = abdpainChars.includes('peritonitis_rigid');

  // 1. Hemorrhagic Shock & Hemodynamic Collapse (CRITICAL)
  if (hasSyncope || hasCold || hasOliguria || (hasDizziness && hasActiveBleed)) {
    flags.push({
      key: 'gi_rf_hemorrhagic_shock',
      textTh: 'ภาวะช็อกจากการเสียเลือดเฉียบพลัน (Hemorrhagic Shock / Volume Collapse)',
      risk: 'มีเลือดออกในทางเดินอาหารร่วมกับหน้ามืดเป็นลม มือเท้าเย็น เหงื่อแตกท่วม หรือปัสสาวะไม่ออก เสี่ยงต่อภาวะช็อกและหัวใจหยุดเต้น',
      triageLevel: 1,
      severity: 'CRITICAL',
      suggestedAction: 'Triage Level 1: ย้ายเข้าห้อง Resuscitation ทันที, เปิด IV No.18/16 จำนวน 2 เส้น, Start IV Fluid, Stat CBC Coagulogram BUN/Cr, จอง PRC 2-4 units ด่วน, เตรียม Massive Transfusion Protocol'
    });
  }

  // 2. Suspected Variceal Bleeding in Cirrhosis / Chronic Liver Disease (CRITICAL)
  if ((hasCirrhosis || hasHeavyAlcohol || hasJaundiceAscites) && (hasHema || hasMelena)) {
    flags.push({
      key: 'gi_rf_variceal_bleeding',
      textTh: 'สงสัยเส้นเลือดขอดในหลอดอาหารแตกในผู้ป่วยโรคตับแข็ง (Suspected Bleeding Esophageal Varices)',
      risk: 'เลือดออกในทางเดินอาหารส่วนบนในผู้ป่วยตับแข็ง ดื่มสุราหนัก หรือมีตาเหลืองท้องมาน เสี่ยงต่อการเสียเลือดรุนแรงและอัตราเสียชีวิตสูง',
      triageLevel: 1,
      severity: 'CRITICAL',
      suggestedAction: 'ให้ยา Vasoactive drug ทันที (IV Terlipressin 2 mg หรือ Octreotide 50 mcg bolus + 50 mcg/hr), IV Ceftriaxone 1g OD, เตรียม EGD ด่วนสำหรับทำ EVL และเตรียม Sengstaken-Blakemore Tube'
    });
  }

  // 3. Massive / Brisk Upper GI Bleed with Rapid Transit (HIGH)
  const isLargeHema = patient.giHematemesisVolume === 'large' || patient.giHematemesisChar === 'bright_red_clots';
  const isBriskChezia = patient.giHematocheziaChar === 'profuse_bright_red' && hasDizziness;
  if (isLargeHema || isBriskChezia) {
    flags.push({
      key: 'gi_rf_massive_bleeding',
      textTh: 'เลือดออกปริมาณมหาศาลเฉียบพลัน (Massive Active Gastrointestinal Bleeding)',
      risk: 'อาเจียนเป็นเลือดสดหรือลิ่มเลือดก้อนใหญ่ปริมาณมาก หรือถ่ายเลือดสดปริมาณมากพุ่งเต็มโถร่วมกับหน้ามืด เสี่ยงต่อการเกิด Decompensation',
      triageLevel: 2,
      severity: 'HIGH',
      suggestedAction: 'NPO งดน้ำและอาหารทุกชนิด, ให้ IV Pantoprazole 80 mg bolus ตามด้วย 8 mg/hr, ปรึกษาศัลยแพทย์เพื่อทำ Emergency EGD / Colonoscopy หรือผ่าตัดห้ามเลือด'
    });
  }

  // 4. Perforated Peptic Ulcer / Acute Peritonitis (CRITICAL)
  if (hasPeritonitis) {
    flags.push({
      key: 'gi_rf_perforated_ulcer',
      textTh: 'สงสัยแผลในกระเพาะอาหารทะลุร่วมกับเลือดออก (Suspected Perforated Peptic Ulcer / Peritonitis)',
      risk: 'มีอาการปวดท้องรุนแรงตลอดเวลา หน้าท้องแข็งเกร็งสะเทือน ร่วมกับมีเลือดออก บ่งชี้ภาวะเยื่อบุช่องท้องอักเสบเฉียบพลัน',
      triageLevel: 1,
      severity: 'CRITICAL',
      suggestedAction: 'NPO ทันที, ใส่สายระบายกระเพาะ NG Tube, ส่ง Stat Upright Chest X-ray หรือ Plain Abdomen ดู Free air, ปรึกษาศัลยแพทย์ทั่วไปทันทีเพื่อพิจารณา Emergency Exploratory Laparotomy'
    });
  }

  // 5. Anticoagulant / Antiplatelet-Associated Bleeding (HIGH)
  if (hasBleedingRiskMeds && hasActiveBleed) {
    const medNames = [];
    if (takesWarfarin) medNames.push('Warfarin');
    if (takesDoac) medNames.push('DOAC');
    if (takesAntiplatelet) medNames.push('Antiplatelet (Aspirin/Clopidogrel)');
    flags.push({
      key: 'gi_rf_anticoagulant_induced',
      textTh: `เลือดออกขณะใช้ยาละลายลิ่มเลือดหรือยาต้านเกล็ดเลือด (${medNames.join(', ')})`,
      risk: 'การแข็งตัวของเลือดบกพร่องจากฤทธิ์ยา ทำให้เลือดออกต่อเนื่อง หยุดยาก และเพิ่มความเสี่ยงต่อการเสียชีวิต',
      triageLevel: 2,
      severity: 'HIGH',
      suggestedAction: 'หยุดยาต้านการแข็งตัวของเลือดทันที, ส่ง Stat PT/INR PTT Platelet, เตรียมพิจารณา Reversal Agents (Vitamin K 10 mg IV, PCC, FFP หรือ Specific Antidotes) ร่วมกับการส่องกล้องห้ามเลือด'
    });
  }

  // 6. Suspected Aortoenteric Fistula (CRITICAL)
  if (hasAaaRepair && hasActiveBleed) {
    flags.push({
      key: 'gi_rf_aortoenteric_fistula',
      textTh: 'สงสัยรูทะลุระหว่างหลอดเลือดแดงใหญ่และลำไส้ (Suspected Aortoenteric Fistula - Herald Bleed)',
      risk: 'มีประวัติผ่าตัดใส่หลอดเลือดเทียม AAA ร่วมกับมีเลือดออกในทางเดินอาหาร อาจเป็นสัญญาณเตือน (Herald Bleed) ก่อนเกิดเลือดทะลักเสียชีวิตฉับพลัน',
      triageLevel: 1,
      severity: 'CRITICAL',
      suggestedAction: 'ส่ง Stat CTA Whole Abdomen ทันที, ปรึกษาศัลยแพทย์หลอดเลือด (Vascular Surgeon) ด่วนที่สุด, เตรียมพร้อมสำหรับการผ่าตัดเปิดช่องท้องฉุกเฉิน'
    });
  }

  return flags;
}

function isGiBleedRedFlag(patient) {
  const flags = evaluateGiBleedRedFlags(patient);
  return flags.length > 0;
}

// --- Output Formatting & Medical Translation ---
function updateGiBleedOutputs(patient) {
  if (!patient) return;

  const hasHema = !!patient.giHematemesis;
  const hasMelena = !!patient.giMelena;
  const hasChezia = !!patient.giHematochezia;

  const shockSigns = Array.isArray(patient.giShockSigns) ? patient.giShockSigns : [];
  const liverAlcohol = Array.isArray(patient.giLiverAlcohol) ? patient.giLiverAlcohol : [];
  const pastHistory = Array.isArray(patient.giPastHistory) ? patient.giPastHistory : [];
  const anticoagMeds = Array.isArray(patient.giAnticoagMeds) ? patient.giAnticoagMeds : [];
  const nsaidMeds = Array.isArray(patient.giNsaidMeds) ? patient.giNsaidMeds : [];
  const abdpainChars = Array.isArray(patient.giAbdpainChars) ? patient.giAbdpainChars : [];

  const takesWarfarin = anticoagMeds.includes('warfarin');
  const takesDoac = anticoagMeds.includes('doac');
  const takesAntiplatelet = anticoagMeds.includes('antiplatelet');
  const hasBleedingRiskMeds = takesWarfarin || takesDoac || takesAntiplatelet;

  const takesNsaids = nsaidMeds.includes('nsaids');
  const takesHerbalBolus = nsaidMeds.includes('herbal_bolus');

  const hasCirrhosis = liverAlcohol.includes('cirrhosis_varices');
  const hasHeavyAlcohol = liverAlcohol.includes('heavy_alcohol');
  const hasJaundiceAscites = liverAlcohol.includes('jaundice_ascites');

  const hasAaaRepair = pastHistory.includes('past_aaa_repair');

  const rfs = evaluateGiBleedRedFlags(patient);

  const unitMapTh = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durationStr = patient.durationVal ? `${patient.durationVal} ${unitMapTh[patient.durationUnit] || patient.durationUnit || 'ชั่วโมง'}` : 'ไม่ระบุ';
  
  let bleedTypesTh = [];
  if (hasHema) bleedTypesTh.push('อาเจียนเป็นเลือดสด/สีกาแฟ (Hematemesis)');
  if (hasMelena) bleedTypesTh.push('ถ่ายดำเหนียวยางมะตอย (Melena)');
  if (hasChezia) bleedTypesTh.push('ถ่ายเป็นเลือดสดทางทวารหนัก (Hematochezia)');
  if (bleedTypesTh.length === 0) bleedTypesTh.push('สงสัยภาวะเลือดออกในทางเดินอาหาร');

  let onsetModeTh = 'ไม่ระบุ';
  if (patient.giOnsetMode === 'sudden_severe') onsetModeTh = 'เกิดขึ้นเฉียบพลันทันที';
  else if (patient.giOnsetMode === 'gradual_increase') onsetModeTh = 'ค่อยๆ มีอาการเพิ่มขึ้นเรื่อยๆ';
  else if (patient.giOnsetMode === 'chronic_intermittent') onsetModeTh = 'เป็นๆ หายๆ เรื้อรัง';

  let onsetExactStr = '';
  if (patient.giOnsetExactDate || patient.giOnsetExactTime) {
    onsetExactStr = ` (ระบุเวลาเริ่ม: ${patient.giOnsetExactDate || '-'} ${patient.giOnsetExactTime || '-'})`;
  }

  // Bleeding details
  let hemaCharTh = 'สีกาแฟ/เลือด';
  let hemaVolTh = 'ไม่ระบุปริมาณ';
  let hemaFreqTh = '1–2 ครั้ง';
  let hemaRetchTh = 'ไม่มีอาการอาเจียนนำ อาเจียนออกมาเป็นเลือดสดทันที';
  if (hasHema) {
    if (patient.giHematemesisChar === 'bright_red_clots') hemaCharTh = 'เลือดสดสีแดงล้วน/มีลิ่มเลือดก้อนใหญ่';
    else if (patient.giHematemesisChar === 'pink_streaks') hemaCharTh = 'สายเลือดจางๆ หรือเศษอาหารปนเลือดเล็กน้อย';
    else if (patient.giHematemesisChar === 'coffee_ground') hemaCharTh = 'สีน้ำตาลเข้ม คล้ายกากกาแฟ (Coffee-ground)';

    if (patient.giHematemesisVolume === 'large') hemaVolTh = 'ปริมาณมาก (เต็มถ้วย/ชาม หรือ > 1 แก้ว)';
    else if (patient.giHematemesisVolume === 'moderate') hemaVolTh = 'ปริมาณปานกลาง (~ครึ่งแก้ว)';
    else if (patient.giHematemesisVolume === 'small') hemaVolTh = 'ปริมาณเล็กน้อย (สายเลือดปนน้ำลาย)';

    if (patient.giHematemesisFreq === 'freq_1_2') hemaFreqTh = '1–2 ครั้ง';
    else if (patient.giHematemesisFreq === 'freq_3_5') hemaFreqTh = '3–5 ครั้ง';
    else if (patient.giHematemesisFreq === 'freq_gt_5') hemaFreqTh = '> 5 ครั้ง';

    if (patient.giPrecedingRetching === 'yes') {
      hemaRetchTh = 'มีอาการไอแรง/อาเจียนเศษอาหารนำมาก่อนแล้วมีเลือดปน (Mallory-Weiss pattern)';
    }
  }

  let melenaCharTh = 'ดำคล้ำ';
  let melenaFreqTh = '1–2 ครั้ง';
  let melenaStatusTh = patient.giMelenaActive === 'active_continuous' ? 'ปัจจุบันยังคงถ่ายดำอยู่' : 'ถ่ายดำครั้งล่าสุดแล้วหยุดไป';
  let daysStr = patient.giMelenaPreceded === 'yes' && patient.giMelenaDays ? ` (มีอาการนำมาก่อน ${patient.giMelenaDays} วัน)` : '';
  const pseudoMeds = Array.isArray(patient.giPseudoMelenaMeds) ? patient.giPseudoMelenaMeds : [];
  let pseudoStr = '';
  if (pseudoMeds.includes('ferrous')) pseudoStr += ' [ประวัติทานยาบำรุงธาตุเหล็ก]';
  if (pseudoMeds.includes('bismuth')) pseudoStr += ' [ประวัติทานยา Bismuth]';
  if (hasMelena) {
    if (patient.giMelenaChar === 'tarry_foul') melenaCharTh = 'ดำสนิท เหนียวคล้ายยางมะตอย กลิ่นคาวจัด (Tarry stool)';
    else if (patient.giMelenaChar === 'dark_brown_formed') melenaCharTh = 'สีน้ำตาลเข้มหรือดำคล้ำ ก้อนปกติ ไม่เหนียว';

    if (patient.giMelenaFreq === 'freq_1_2') melenaFreqTh = '1–2 ครั้ง';
    else if (patient.giMelenaFreq === 'freq_3_5') melenaFreqTh = '3–5 ครั้ง';
    else if (patient.giMelenaFreq === 'freq_gt_5') melenaFreqTh = '> 5 ครั้ง';
  }

  let cheziaCharTh = 'มีเลือดปน';
  let cheziaFreqTh = '1–2 ครั้ง';
  let cheziaAnalPainTh = patient.giAnalPain === 'sharp_tearing_pain' ? 'เจ็บแปลบปวดแสบรูทวารหนักขณะถ่าย' : 'ไม่มีอาการเจ็บปวดที่รูทวารหนัก';
  let cheziaMassTh = patient.giProlapsedMass === 'has_mass' ? 'มีติ่งเนื้อ/ก้อนยื่นที่ทวารหนัก' : 'ไม่มีก้อนยื่น';
  if (hasChezia) {
    if (patient.giHematocheziaChar === 'profuse_bright_red') cheziaCharTh = 'เลือดสดล้วนๆ หรือลิ่มเลือดปริมาณมาก ไหลพุ่งเต็มโถส้วม (Brisk Hematochezia)';
    else if (patient.giHematocheziaChar === 'surface_streak_or_drip') cheziaCharTh = 'เลือดสดเคลือบผิวก้อนอุจจาระ หรือหยดติ๋งๆ ลงโถหลังถ่ายเสร็จ';
    else if (patient.giHematocheziaChar === 'toilet_paper_only') cheziaCharTh = 'เลือดสดเปื้อนเฉพาะกระดาษชำระ';
    else if (patient.giHematocheziaChar === 'bloody_mucus_loose') cheziaCharTh = 'อุจจาระเหลวมูกปนเลือดสด หรือมูกหนอง';

    if (patient.giHematocheziaFreq === 'freq_1_2') cheziaFreqTh = '1–2 ครั้ง';
    else if (patient.giHematocheziaFreq === 'freq_3_5') cheziaFreqTh = '3–5 ครั้ง';
    else if (patient.giHematocheziaFreq === 'freq_gt_5') cheziaFreqTh = '> 5 ครั้ง';
  }

  let locTh = 'ไม่ระบุตำแหน่ง';
  let charListTh = [];
  if (patient.giHasAbdpain === 'yes') {
    if (patient.giAbdpainLoc === 'epigastric_ruq') locTh = 'ใต้ลิ้นปี่ หรือ ชายโครงขวา (Epigastrium/RUQ)';
    else if (patient.giAbdpainLoc === 'periumbilical') locTh = 'รอบสะดือ (Periumbilical)';
    else if (patient.giAbdpainLoc === 'llq') locTh = 'ท้องน้อยซ้าย (LLQ)';
    else if (patient.giAbdpainLoc === 'rlq') locTh = 'ท้องน้อยขวา (RLQ)';
    else if (patient.giAbdpainLoc === 'diffuse') locTh = 'บิดเกร็งทั่วท้อง (Diffuse)';

    if (abdpainChars.includes('burning_gnawing')) charListTh.push('แสบ จุก ร้อน หรือปวดตื้อใต้ลิ้นปี่ สัมพันธ์กับอาหาร');
    if (abdpainChars.includes('colicky_spasm')) charListTh.push('ปวดบิดเกร็งเป็นพักๆ สัมพันธ์กับการถ่าย');
    if (abdpainChars.includes('peritonitis_rigid')) charListTh.push('ปวดรุนแรงตลอดเวลา หน้าท้องแข็งเกร็งสะเทือน (Peritoneal signs)');
  }

  let anticoagText = 'ปฏิเสธการใช้ยาละลายลิ่มเลือด/ยาต้านเกล็ดเลือด';
  if (anticoagMeds.length > 0 && !anticoagMeds.includes('none_anticoag')) {
    anticoagText = anticoagMeds.map(m => {
      if (m === 'warfarin') return 'Warfarin';
      if (m === 'doac') return 'DOACs (Eliquis/Xarelto/Pradaxa)';
      if (m === 'antiplatelet') return 'Antiplatelets (Aspirin/Clopidogrel)';
      return m;
    }).join(', ');
  }

  let nsaidText = 'ปฏิเสธการใช้ NSAIDs/สเตียรอยด์/ยาลูกกลอน';
  if (nsaidMeds.length > 0 && !nsaidMeds.includes('none_nsaids')) {
    nsaidText = nsaidMeds.map(m => {
      if (m === 'nsaids') return 'NSAIDs (Ibuprofen/Diclofenac)';
      if (m === 'steroids') return 'สเตียรอยด์';
      if (m === 'herbal_bolus') return 'ยาชุด/ยาหม้อ/ยาสมุนไพรลูกกลอน';
      return m;
    }).join(', ');
  }

  let liverText = 'ปฏิเสธประวัติดื่มสุราและโรคตับแข็ง';
  if (liverAlcohol.length > 0 && !liverAlcohol.includes('none_liver')) {
    liverText = liverAlcohol.map(l => {
      if (l === 'heavy_alcohol') return 'ดื่มสุราหนักเป็นประจำ';
      if (l === 'cirrhosis_varices') return 'ประวัติตับแข็ง/เส้นเลือดขอดหลอดอาหาร';
      if (l === 'jaundice_ascites') return 'ตาเหลือง ตัวเหลือง ท้องมาน';
      return l;
    }).join(', ');
  }

  const pudAaaParts = [];
  if (pastHistory.includes('past_pud_bleed')) {
    pudAaaParts.push(`เคยมีประวัติแผล/เลือดออกในทางเดินอาหาร (${patient.giPastPudHospital === 'rachaburi_hospital' ? 'รพ.ราชบุรี' : 'สถานพยาบาลอื่น'})`);
  }
  if (hasAaaRepair) {
    pudAaaParts.push('เคยผ่าตัดใส่หลอดเลือดเทียมช่องท้อง (AAA Repair) 🚩');
  }
  const pudAaaText = pudAaaParts.length > 0 ? pudAaaParts.join('; ') : 'ปฏิเสธ';

  const hemodynIssues = [];
  if (shockSigns.includes('syncope')) hemodynIssues.push('วูบหมดสติ 🚩');
  if (shockSigns.includes('postural_dizziness')) hemodynIssues.push('หน้ามืดวิงเวียนขณะลุกยืน');
  if (shockSigns.includes('cold_extremities')) hemodynIssues.push('เหงื่อแตกตัวเย็นชืด 🚩');
  if (shockSigns.includes('palpitations')) hemodynIssues.push('ใจสั่นหัวใจเต้นเร็ว');
  if (shockSigns.includes('oliguria_anuria')) hemodynIssues.push('ปัสสาวะออกน้อยมาก 🚩');
  if (shockSigns.includes('altered_mental')) hemodynIssues.push('ซึมลง สับสน 🚩');
  const hemodynamicSummary = hemodynIssues.length > 0 ? hemodynIssues.join(', ') : 'คงที่ รู้สึกตัวดี ไม่มีหน้ามืดหรือหมดสติ';

  // Pertinent Positives & Negatives
  const positives = [];
  const negatives = [];

  if (hasHema) {
    positives.push(patient.giHematemesisChar === 'bright_red_clots' ? 'อาเจียนเป็นเลือดสดล้วน/ลิ่มเลือดก้อนใหญ่' : (patient.giHematemesisChar === 'coffee_ground' ? 'อาเจียนสีกากกาแฟ' : 'อาเจียนเป็นเลือดสด/สีกาแฟ'));
  } else {
    negatives.push('ปฏิเสธการอาเจียนเป็นเลือดหรือสีกาแฟ');
  }

  if (hasMelena) {
    positives.push(patient.giMelenaChar === 'tarry_foul' ? 'ถ่ายดำสนิทเหนียวคล้ายยางมะตอย กลิ่นคาวจัด' : 'ถ่ายอุจจาระดำเหนียวยางมะตอย (Melena)');
  } else {
    negatives.push('ปฏิเสธการถ่ายดำเหนียวยางมะตอย');
  }

  if (hasChezia) {
    positives.push(patient.giHematocheziaChar === 'profuse_bright_red' ? 'ถ่ายเป็นเลือดสดล้วนหรือลิ่มเลือดปริมาณมาก' : 'ถ่ายเป็นเลือดสดทางทวารหนัก (Hematochezia)');
  } else {
    negatives.push('ปฏิเสธการถ่ายเป็นเลือดสดล้วนทางทวารหนัก');
  }

  if (shockSigns.includes('postural_dizziness')) positives.push('หน้ามืดวิงเวียนเวลาเปลี่ยนท่าลุกยืน');
  if (shockSigns.includes('syncope')) positives.push('วูบหมดสติ (Syncope) 🚩');
  if (shockSigns.includes('cold_extremities')) positives.push('เหงื่อแตกตัวเย็นชืด ปลายมือปลายเท้าซีด 🚩');
  if (shockSigns.includes('palpitations')) positives.push('ใจสั่นหัวใจเต้นเร็ว');
  if (shockSigns.includes('oliguria_anuria')) positives.push('ปัสสาวะออกน้อยมากสีเข้มจัด 🚩');
  if (shockSigns.includes('altered_mental')) positives.push('ซึมลง สับสน 🚩');

  if (!shockSigns.includes('syncope') && !shockSigns.includes('postural_dizziness')) {
    negatives.push('ปฏิเสธหน้ามืดวิงเวียนหรือวูบหมดสติ');
  }
  if (!shockSigns.includes('cold_extremities')) {
    negatives.push('ไม่มีเหงื่อแตกตัวเย็นชืด');
  }
  if (!shockSigns.includes('palpitations')) {
    negatives.push('ไม่มีใจสั่นหัวใจเต้นเร็ว');
  }
  if (!shockSigns.includes('oliguria_anuria')) {
    negatives.push('ปัสสาวะออกปกติ');
  }
  if (!shockSigns.includes('altered_mental')) {
    negatives.push('รู้สึกตัวดี ถามตอบรู้เรื่อง');
  }

  if (patient.giHasAbdpain === 'yes') {
    const locSuffix = locTh && locTh !== 'ไม่ระบุตำแหน่ง' ? ` (ตำแหน่ง: ${locTh})` : '';
    if (abdpainChars.includes('burning_gnawing')) positives.push(`ปวดแสบจุกแน่นเหนือลิ้นปี่/ใต้ลิ้นปี่${locSuffix}`);
    if (abdpainChars.includes('peritonitis_rigid')) positives.push(`ปวดท้องรุนแรงตลอดเวลา หน้าท้องแข็งเกร็ง${locSuffix} 🚩`);
    if (abdpainChars.includes('colicky_spasm')) positives.push(`ปวดบิดมวนเกร็งเป็นพักๆ สัมพันธ์กับการถ่าย${locSuffix}`);
    if (abdpainChars.length === 0) positives.push(`ปวดท้องบริเวณ ${locTh}`);
  } else {
    negatives.push('ปฏิเสธอาการปวดท้อง (Painless GI bleeding)');
  }

  if (takesWarfarin || takesDoac || takesAntiplatelet) positives.push('รับประทานยาต้านการแข็งตัวของเลือด/ยาละลายลิ่มเลือด');
  if (takesNsaids || takesHerbalBolus) positives.push('รับประทานยาแก้ปวดกลุ่ม NSAIDs / ยาลูกกลอน');
  if (hasCirrhosis) positives.push('มีประวัติโรคตับแข็ง / เส้นเลือดขอดในหลอดอาหาร');
  if (patient.otherSymptomsFree) positives.push(patient.otherSymptomsFree);

  const rapidPositives = positives.filter(p =>
    !p.startsWith('อาเจียนเป็นเลือด') &&
    !p.startsWith('ถ่ายดำ') &&
    !p.startsWith('ถ่ายอุจจาระดำ') &&
    !p.startsWith('ถ่ายเป็นเลือดสด') &&
    !p.startsWith('รับประทานยา') &&
    !p.startsWith('มีประวัติโรคตับแข็ง')
  );

  patient.pertinentPositives = rapidPositives.length > 0 ? rapidPositives : ['ไม่มีอาการร่วมผิดปกติ'];
  patient.pertinentNegatives = negatives;

  const docNotes = patient.doctor_notes || {};
  const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ' || patient.currentMeds === 'ไม่มี') ? 'ไม่มี' : patient.currentMeds;
  const hospLabel = {
    complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
    additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
    self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
    unspecified: 'ไม่ได้ระบุ'
  }[patient.hospRecordStatus] || 'ไม่ได้ระบุ';

  // 1. Rapid Bullet Mode (Standardized: Primary bleeding descriptors at top, associated symptoms in Pertinent only)
  const defaultRapid =
`[Chief Complaint (CC)]
${bleedTypesTh.join(' & ')} มา ${durationStr}

[History of Present Illness (HPI)]
• รูปแบบการเริ่มมีอาการ: ${onsetModeTh}${onsetExactStr}
${hasHema ? `• อาเจียนเป็นเลือด (Hematemesis): อาเจียน${hemaCharTh}, ${hemaVolTh}, ความถี่ ${hemaFreqTh} ใน 24 ชม., ${hemaRetchTh}\n` : ''}${hasMelena ? `• ถ่ายดำ (Melena): ถ่าย${melenaCharTh}, ความถี่ ${melenaFreqTh} ใน 24 ชม., ${melenaStatusTh}${daysStr}${pseudoStr}\n` : ''}${hasChezia ? `• ถ่ายเป็นเลือดสด (Hematochezia): ถ่าย${cheziaCharTh}, ความถี่ ${cheziaFreqTh} ใน 24 ชม., ${cheziaAnalPainTh}, ${cheziaMassTh}\n` : ''}
• Pertinent Positives:
${rapidPositives.length > 0 ? rapidPositives.map(p => `  - ${p}`).join('\n') : '  - ไม่มีอาการร่วมอื่นที่เด่นชัด'}

• Pertinent Negatives:
${negatives.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• ประวัติแผลในทางเดินอาหาร/ผ่าตัดหลอดเลือด: ${pudAaaText}
• ประวัติโรคตับและแอลกอฮอล์: ${liverText}
• ยาต้านการแข็งตัวของเลือด/เกล็ดเลือด: ${anticoagText}
• ยา NSAIDs/สเตียรอยด์/สมุนไพร: ${nsaidText}
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
  narrative += `ผู้ป่วย${patient.gender === 'หญิง' ? 'หญิง' : 'ชาย'}ไทย อายุ ${patient.age || '-'} ปี มาโรงพยาบาลด้วยอาการ${bleedTypesTh.join(' และ ')} เป็นมาประมาณ ${durationStr} ก่อนมาโรงพยาบาล `;
  
  if (patient.giOnsetMode === 'sudden_severe') {
    narrative += `โดยอาการเกิดขึ้นเฉียบพลันทันที `;
  } else if (patient.giOnsetMode === 'gradual_increase') {
    narrative += `โดยค่อยๆ มีอาการเพิ่มขึ้นเรื่อยๆ `;
  }

  if (hasHema) {
    narrative += `ผู้ป่วยมีอาการอาเจียนเป็นเลือดสดหรือสีกาแฟ `;
    if (patient.giHematemesisChar === 'bright_red_clots') narrative += `ลักษณะเป็นเลือดสีแดงสดล้วนปนลิ่มเลือดก้อนใหญ่ `;
    else if (patient.giHematemesisChar === 'pink_streaks') narrative += `ลักษณะเป็นสายเลือดจางๆ ปนเศษอาหาร `;
    else if (patient.giHematemesisChar === 'coffee_ground') narrative += `ลักษณะเป็นสีกากกาแฟคั่ว (Coffee-ground emesis) `;

    if (patient.giHematemesisVolume === 'large') narrative += `ปริมาณมาก (เต็มถ้วยหรือมากกว่า 1 แก้ว) `;
    else if (patient.giHematemesisVolume === 'moderate') narrative += `ปริมาณปานกลาง `;
    else if (patient.giHematemesisVolume === 'small') narrative += `ปริมาณเล็กน้อย `;

    if (patient.giPrecedingRetching === 'yes') {
      narrative += `โดยมีอาการไอแรงหรืออาเจียนเศษอาหารติดต่อกันหลายครั้งนำมาก่อน แล้วจึงมีเลือดปนตามมา `;
    } else {
      narrative += `โดยไม่มีอาการอาเจียนเศษอาหารนำมาก่อน อาเจียนครั้งแรกเป็นเลือดสดทันที `;
    }
  }

  if (hasMelena) {
    narrative += `ร่วมกับมีอาการถ่ายอุจจาระสีดำ `;
    if (patient.giMelenaChar === 'tarry_foul') narrative += `ลักษณะดำสนิท เหนียวคล้ายยางมะตอย กลิ่นคาวเหม็นรุนแรงมาก `;
    else narrative += `ลักษณะสีน้ำตาลเข้มหรือดำคล้ำ แต่เนื้ออุจจาระเป็นก้อนปกติ `;

    if (patient.giMelenaPreceded === 'yes' && patient.giMelenaDays) {
      narrative += `มีอาการถ่ายดำนำมาก่อนหน้านี้ประมาณ ${patient.giMelenaDays} วัน `;
    }
    if (patient.giMelenaActive === 'active_continuous') {
      narrative += `และปัจจุบันยังคงถ่ายดำต่อเนื่อง `;
    } else {
      narrative += `ถ่ายดำครั้งล่าสุดแล้วหยุดไป `;
    }
  }

  if (hasChezia) {
    narrative += `และมีอาการถ่ายเป็นเลือดสดทางทวารหนัก `;
    if (patient.giHematocheziaChar === 'profuse_bright_red') narrative += `ถ่ายออกมาเป็นเลือดสดล้วนหรือลิ่มเลือดปริมาณมาก ไหลพุ่งเต็มโถส้วม `;
    else if (patient.giHematocheziaChar === 'surface_streak_or_drip') narrative += `เลือดสดหยดติ๋งๆ ลงโถหรือเคลือบผิวอุจจาระหลังถ่ายเสร็จ `;
    else if (patient.giHematocheziaChar === 'toilet_paper_only') narrative += `เปื้อนเฉพาะกระดาษชำระ `;
    else if (patient.giHematocheziaChar === 'bloody_mucus_loose') narrative += `ถ่ายเหลวมูกปนเลือดสด `;

    if (patient.giAnalPain === 'sharp_tearing_pain') narrative += `มีอาการเจ็บแปลบปวดแสบรูทวารหนักขณะเบ่งถ่าย `;
    else narrative += `ปฏิเสธอาการเจ็บปวดที่รูทวารหนัก `;

    if (patient.giProlapsedMass === 'has_mass') narrative += `มีก้อนหรือติ่งเนื้อยื่นปลิ้นออกมาทางทวารหนัก `;
  }

  const posShock = [];
  if (shockSigns.includes('postural_dizziness')) posShock.push('หน้ามืดวิงเวียนตาพร่ามัวเวลาเปลี่ยนท่า');
  if (shockSigns.includes('syncope')) posShock.push('วูบหมดสติ (Syncope)');
  if (shockSigns.includes('cold_extremities')) posShock.push('เหงื่อแตกตัวเย็นชืด ปลายมือปลายเท้าซีด');
  if (shockSigns.includes('palpitations')) posShock.push('ใจสั่นหัวใจเต้นเร็ว');
  if (shockSigns.includes('oliguria_anuria')) posShock.push('ปัสสาวะออกน้อยมากสีเข้มจัด');
  if (shockSigns.includes('severe_dyspnea_fatigue')) posShock.push('หายใจหอบเหนื่อย อ่อนเพลียมาก');
  if (shockSigns.includes('altered_mental')) posShock.push('ซึมลง สับสน');

  if (posShock.length > 0) {
    narrative += `ผู้ป่วยมีอาการเตือนภาวะเสียเลือดและระบบไหลเวียนโลหิตบกพร่อง ได้แก่ ${posShock.join(', ')} `;
  } else {
    narrative += `ปฏิเสธอาการหน้ามืด เป็นลม วูบหมดสติ หรือใจสั่น ปัสสาวะออกได้ตามปกติ `;
  }

  if (patient.giHasAbdpain === 'yes') {
    narrative += `มีอาการปวดท้องร่วมด้วย `;
    if (patient.giAbdpainLoc === 'epigastric_ruq') narrative += `บริเวณใต้ลิ้นปี่/ชายโครงขวา `;
    else if (patient.giAbdpainLoc === 'periumbilical') narrative += `บริเวณรอบสะดือ `;
    else if (patient.giAbdpainLoc === 'llq') narrative += `บริเวณท้องน้อยซ้าย `;
    else if (patient.giAbdpainLoc === 'rlq') narrative += `บริเวณท้องน้อยขวา `;
    else if (patient.giAbdpainLoc === 'diffuse') narrative += `ทั่วทั้งท้อง `;

    if (abdpainChars.includes('burning_gnawing')) narrative += `ลักษณะปวดแสบจุกแน่นสัมพันธ์กับอาหาร `;
    if (abdpainChars.includes('peritonitis_rigid')) narrative += `ปวดรุนแรงตลอดเวลาหน้าท้องแข็งเกร็งสะเทือน `;
  } else {
    narrative += `ไม่มีอาการปวดท้อง `;
  }

  narrative += `\n\nMedications & Past History:\n`;
  narrative += `ประวัติยาต้านการแข็งตัวของเลือด/ต้านเกล็ดเลือด: ${anticoagText}\n`;
  narrative += `ประวัติยาแก้ปวด NSAIDs/ยาลูกกลอน: ${nsaidText}\n`;
  narrative += `ประวัติโรคตับและแอลกอฮอล์: ${liverText}\n`;

  if (pastHistory.includes('past_pud_bleed')) {
    narrative += `มีประวัติเคยเป็นแผลหรือเลือดออกในทางเดินอาหารมาก่อน `;
    if (patient.giPastPudHospital === 'rachaburi_hospital') narrative += `เคยตรวจรักษาหรือส่องกล้องกับทางโรงพยาบาลราชบุรี\n`;
    else narrative += `ตรวจรักษาที่สถานพยาบาลอื่น\n`;
  }
  if (pastHistory.includes('past_aaa_repair')) {
    narrative += `ผู้ป่วยมีประวัติเคยผ่าตัดใส่หลอดเลือดเทียมรักษาหลอดเลือดแดงใหญ่ในช่องท้องโป่งพอง (AAA Repair)\n`;
  }

  // 3. JSON Schema v2.0
  const jsonSchema = {
    encounter: {
      chief_complaint: 'gi_bleeding',
      chief_complaint_title_th: 'อาเจียนเป็นเลือด / ถ่ายดำ / ถ่ายเป็นเลือดสด',
      triage_category: 'emergency_medicine',
      calculated_triage_level: rfs.some(r => r.triageLevel === 1) ? 1 : (rfs.some(r => r.triageLevel === 2) ? 2 : 4),
      entry_timestamp: patient.timestamp || new Date().toISOString()
    },
    clinical_assessment: {
      onset: {
        duration_value: patient.durationVal || null,
        duration_unit: patient.durationUnit || 'hours',
        onset_pattern: patient.giOnsetMode || 'unknown',
        exact_onset_date: patient.giOnsetExactDate || null,
        exact_onset_time: patient.giOnsetExactTime || null
      },
      bleeding_profile: {
        has_hematemesis: hasHema,
        hematemesis_character: patient.giHematemesisChar || null,
        hematemesis_volume: patient.giHematemesisVolume || null,
        hematemesis_frequency_24h: patient.giHematemesisFreq || null,
        preceding_retching_vomiting: patient.giPrecedingRetching === 'yes',
        has_melena: hasMelena,
        melena_character: patient.giMelenaChar || null,
        melena_frequency_24h: patient.giMelenaFreq || null,
        melena_preceded_days: patient.giMelenaDays || null,
        melena_active: patient.giMelenaActive === 'active_continuous',
        takes_iron_or_bismuth: (Array.isArray(patient.giPseudoMelenaMeds) && patient.giPseudoMelenaMeds.some(m => m === 'ferrous' || m === 'bismuth')),
        has_hematochezia: hasChezia,
        hematochezia_character: patient.giHematocheziaChar || null,
        hematochezia_frequency_24h: patient.giHematocheziaFreq || null,
        has_anal_pain: patient.giAnalPain === 'sharp_tearing_pain',
        has_prolapsed_anal_mass: patient.giProlapsedMass === 'has_mass'
      },
      hemodynamic_profile: {
        postural_dizziness: shockSigns.includes('postural_dizziness'),
        syncope_witnessed: shockSigns.includes('syncope'),
        palpitations_tachycardia: shockSigns.includes('palpitations'),
        cold_extremities_diaphoresis: shockSigns.includes('cold_extremities'),
        severe_dyspnea_fatigue: shockSigns.includes('severe_dyspnea_fatigue'),
        oliguria_anuria: shockSigns.includes('oliguria_anuria'),
        altered_mental_status: shockSigns.includes('altered_mental')
      },
      abdominal_profile: {
        has_pain: patient.giHasAbdpain === 'yes',
        pain_location: patient.giAbdpainLoc || null,
        pain_characters: abdpainChars,
        peritoneal_signs: abdpainChars.includes('peritonitis_rigid')
      },
      medication_profile: {
        antiplatelets: takesAntiplatelet,
        anticoagulant_warfarin: takesWarfarin,
        anticoagulant_doac: takesDoac,
        nsaids: takesNsaids,
        herbal_bolus: takesHerbalBolus,
        high_risk_drug_burden: hasBleedingRiskMeds || takesNsaids || takesHerbalBolus
      },
      risk_factors: {
        chronic_liver_disease: hasCirrhosis,
        alcohol_abuse: hasHeavyAlcohol,
        jaundice_or_ascites: hasJaundiceAscites,
        previous_pud_or_gi_bleed: {
          has_history: pastHistory.includes('past_pud_bleed'),
          history_type: patient.giPastPudType || null,
          treated_at_rachaburi_hospital: patient.giPastPudHospital === 'rachaburi_hospital'
        },
        previous_aaa_repair: hasAaaRepair
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
  id: 'gi_bleed',
  recordCc: 'gi_bleeding',
  titleTh: 'อาเจียนเป็นเลือด / ถ่ายดำ / ถ่ายเป็นเลือดสด',
  sectionDomId: 'giBleedQuestionnaireSection',
  headerTh: 'แบบฟอร์มซักประวัติ: อาเจียนเป็นเลือด / ถ่ายดำ / ถ่ายเป็นเลือดสด (Hematemesis / Melena / Hematochezia)',
  headerEn: '(Acute Gastrointestinal Bleeding)',
  patientBadgeHtml: '<i data-lucide="alert-triangle" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-red-600"></i><span class="whitespace-nowrap">อาเจียนเป็นเลือด / ถ่ายดำ / ถ่ายเป็นเลือดสด</span>',
  doctorCcBadgeHtml: '<i data-lucide="alert-triangle" class="w-4 h-4 text-red-600 mr-1.5 flex-shrink-0"></i><span class="font-bold text-slate-800">อาเจียนเป็นเลือด / ถ่ายดำ / ถ่ายเป็นเลือดสด</span>',
  pmhSectionNumber: 8,
  dateFields: ['giOnsetExactDate'],
  timeFields: ['giOnsetExactTime'],
  branchIds: [
    'giHematemesisWrap', 'giMelenaWrap', 'giMelenaDaysWrap',
    'giHematocheziaWrap', 'giAbdpainWrap', 'giPastPudBleedWrap'
  ],
  inputIdsToClear: [
    'giDurationVal', 'giOnsetExactDate', 'giOnsetExactTime', 'giMelenaDays', 'gi_bleed_other_free'
  ],

  algorithm: {
    chiefComplaint: 'gi_bleeding',
    titleTh: 'อาเจียนเป็นเลือด / ถ่ายดำ / ถ่ายเป็นเลือดสด',
    schemaCode: 'gi_bleeding',
    version: '2.0.0',
    redFlagDefinitions: [
      { key: 'gi_rf_hemorrhagic_shock', level: 1, textTh: 'ภาวะช็อกจากการเสียเลือดเฉียบพลัน (Hemorrhagic Shock)' },
      { key: 'gi_rf_variceal_bleeding', level: 1, textTh: 'สงสัยเส้นเลือดขอดในหลอดอาหารแตกในผู้ป่วยโรคตับแข็ง (Bleeding Varices)' },
      { key: 'gi_rf_massive_bleeding', level: 2, textTh: 'เลือดออกปริมาณมหาศาลเฉียบพลัน (Massive GI Bleeding)' },
      { key: 'gi_rf_perforated_ulcer', level: 1, textTh: 'สงสัยแผลในกระเพาะอาหารทะลุร่วมกับเลือดออก (Perforated Peptic Ulcer)' },
      { key: 'gi_rf_anticoagulant_induced', level: 2, textTh: 'เลือดออกขณะใช้ยาละลายลิ่มเลือดหรือต้านเกล็ดเลือด (Anticoagulant-Induced)' },
      { key: 'gi_rf_aortoenteric_fistula', level: 1, textTh: 'สงสัยรูทะลุหลอดเลือดแดงใหญ่และลำไส้ (Aortoenteric Fistula)' }
    ]
  },

  formHtml: `
    <div id="giBleedQuestionnaireSection" class="space-y-6 hidden">
      <!-- Card 1: Onset & Duration -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="clock" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">1. ระยะเวลาและลักษณะการเริ่มมีเลือดออก (Onset & Duration)</h2>
            <p class="text-xs text-slate-500">ประเมินระยะเวลาการเริ่มต้นและลักษณะของการมีเลือดออก</p>
          </div>
        </div>
        <div class="space-y-5">
          <!-- 1.1 ระยะเวลาที่เป็นมา -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              ระยะเวลาตั้งแต่เริ่มสังเกตเห็นเลือดออกครั้งแรก <span class="text-rose-500">*</span>
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div class="col-span-1 sm:col-span-2">
                <input type="number" id="giDurationVal" min="1" max="1000" placeholder="เช่น 2" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm placeholder:text-slate-400 placeholder:font-normal">
              </div>
              <div class="col-span-1">
                <select id="giDurationUnit" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm">
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

          <!-- 1.2 รูปแบบการเริ่มต้น -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              ลักษณะการเริ่มต้นของอาการเลือดออก
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="giOnsetMode" value="sudden_severe" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เกิดขึ้นเฉียบพลันทันที</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="giOnsetMode" value="gradual_increase" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ค่อยๆ เพิ่มขึ้นใน 1–2 วัน</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="radio" name="giOnsetMode" value="chronic_intermittent" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เป็นๆ หายๆ ต่อเนื่อง</span>
              </label>
            </div>
          </div>
        </div>
        <!-- Universal Date & Time -->
        <div id="giOnsetExactWrap" class="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">วันที่เริ่มมีเลือดออกครั้งแรก (Universal Date: วว/ดด/ปปปป)</label>
            <input type="text" id="giOnsetExactDate" data-universal-date="true" placeholder="วว/ดด/ปปปป เช่น 26/10/2026" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">เวลาที่เริ่มมีเลือดออก (Universal Time 24-hr: ชช:นน)</label>
            <input type="text" id="giOnsetExactTime" data-universal-time="true" placeholder="เช่น 08:30 (เวลา 24 ชม.)" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
          </div>
        </div>
      </div>

      <!-- Card 2: Bleeding Source & Characteristics -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="droplet" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">2. ช่องทางและลักษณะของเลือดที่ออก (Bleeding Source & Characteristics)</h2>
            <p class="text-xs text-slate-500">ผู้ป่วยสังเกตเห็นเลือดออกทางช่องทางใดบ้าง (เลือกได้มากกว่า 1 ข้อตามอาการจริง)</p>
          </div>
        </div>
        
        <div class="space-y-4">
          <!-- Branch 1: Hematemesis -->
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs font-semibold text-slate-800">
              <input type="checkbox" id="gi_hematemesis_cb" onchange="handleGiHematemesisToggle(this)" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
              <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">1. อาเจียนเป็นเลือด หรืออาเจียนเป็นสีกาแฟ (Hematemesis / Coffee-ground)</span>
            </label>
            <div id="giHematemesisWrap" class="mt-3 pl-6 space-y-3 hidden bg-slate-50 border border-slate-200 rounded-xl p-4 ml-2">
              <div>
                <label class="block text-[11px] font-medium text-slate-700 mb-1">ลักษณะของสิ่งที่อาเจียน:</label>
                <div class="space-y-1">
                  <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                    <input type="radio" name="giHematemesisChar" value="bright_red_clots" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                    <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">อาเจียนเป็นเลือดสดสีแดงล้วน หรือมีลิ่มเลือดก้อนใหญ่ปน</span>
                  </label>
                  <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                    <input type="radio" name="giHematemesisChar" value="pink_streaks" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                    <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">น้ำอาเจียนปนสายเลือดสีแดงจางๆ หรือมีเศษอาหารปนเลือดเล็กน้อย</span>
                  </label>
                  <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                    <input type="radio" name="giHematemesisChar" value="coffee_ground" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                    <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">อาเจียนเป็นสีน้ำตาลเข้ม คล้ายกากกาแฟ/สีกาแฟคั่ว (Coffee-ground)</span>
                  </label>
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label class="block text-[11px] font-medium text-slate-700 mb-1">ปริมาณเลือดในแต่ละครั้งโดยประมาณ:</label>
                  <div class="space-y-1">
                    <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                      <input type="radio" name="giHematemesisVolume" value="large" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                      <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ปริมาณมาก (เต็มถ้วย/เต็มชาม หรือ > 1 แก้วน้ำ)</span>
                    </label>
                    <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                      <input type="radio" name="giHematemesisVolume" value="moderate" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                      <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ปริมาณปานกลาง (~ครึ่งแก้วน้ำ)</span>
                    </label>
                    <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                      <input type="radio" name="giHematemesisVolume" value="small" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                      <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ปริมาณเล็กน้อย (สายเลือดปนน้ำลาย/เศษอาหาร)</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label class="block text-[11px] font-medium text-slate-700 mb-1">จำนวนครั้งที่อาเจียนเป็นเลือดใน 24 ชม.:</label>
                  <div class="space-y-1">
                    <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                      <input type="radio" name="giHematemesisFreq" value="freq_1_2" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                      <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">1–2 ครั้ง</span>
                    </label>
                    <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                      <input type="radio" name="giHematemesisFreq" value="freq_3_5" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                      <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">3–5 ครั้ง</span>
                    </label>
                    <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                      <input type="radio" name="giHematemesisFreq" value="freq_gt_5" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                      <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มากกว่า 5 ครั้งขึ้นไป</span>
                    </label>
                  </div>
                </div>
              </div>
              <div class="pt-2 border-t border-slate-200">
                <label class="block text-[11px] font-medium text-slate-700 mb-1">ก่อนอาเจียนเป็นเลือด มีอาการไอแรงๆ หรืออาเจียนเศษอาหารติดต่อกันหลายครั้งนำมาก่อนหรือไม่:</label>
                <div class="space-y-1">
                  <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                    <input type="radio" name="giPrecedingRetching" value="yes" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                    <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มี (อาเจียนเศษอาหารหรือไอแรงๆ ติดๆ กันก่อน แล้วครั้งหลังๆ จึงเริ่มมีเลือดปน)</span>
                  </label>
                  <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                    <input type="radio" name="giPrecedingRetching" value="no" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                    <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่มี (อาเจียนออกมาครั้งแรกก็เป็นเลือดสด/สีกาแฟทันที)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Branch 2: Melena -->
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs font-semibold text-slate-800">
              <input type="checkbox" id="gi_melena_cb" onchange="handleGiMelenaToggle(this)" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
              <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">2. ถ่ายอุจจาระเป็นสีดำ หรือถ่ายดำเหนียวยางมะตอย (Melena)</span>
            </label>
            <div id="giMelenaWrap" class="mt-3 pl-6 space-y-3 hidden bg-slate-50 border border-slate-200 rounded-xl p-4 ml-2">
              <div>
                <label class="block text-[11px] font-medium text-slate-700 mb-1">ลักษณะของอุจจาระสีดำ:</label>
                <div class="space-y-1">
                  <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                    <input type="radio" name="giMelenaChar" value="tarry_foul" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                    <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">สีดำสนิท เหนียวคล้ายยางมะตอย/น้ำมันดิน และมีกลิ่นคาวเหม็นรุนแรงมาก</span>
                  </label>
                  <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                    <input type="radio" name="giMelenaChar" value="dark_brown_formed" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                    <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">อุจจาระสีน้ำตาลเข้มหรือดำคล้ำ แต่เนื้ออุจจาระเป็นก้อนปกติ ไม่เหนียว</span>
                  </label>
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label class="block text-[11px] font-medium text-slate-700 mb-1">จำนวนครั้งที่ถ่ายดำใน 24 ชม.:</label>
                  <div class="space-y-1">
                    <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                      <input type="radio" name="giMelenaFreq" value="freq_1_2" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                      <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">1–2 ครั้ง</span>
                    </label>
                    <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                      <input type="radio" name="giMelenaFreq" value="freq_3_5" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                      <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">3–5 ครั้ง</span>
                    </label>
                    <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                      <input type="radio" name="giMelenaFreq" value="freq_gt_5" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                      <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มากกว่า 5 ครั้งขึ้นไป</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label class="block text-[11px] font-medium text-slate-700 mb-1">สถานะการถ่ายดำในปัจจุบัน:</label>
                  <div class="space-y-1">
                    <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                      <input type="radio" name="giMelenaActive" value="active_continuous" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                      <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ยังคงถ่ายดำอยู่เรื่อยๆ จนถึงปัจจุบัน</span>
                    </label>
                    <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                      <input type="radio" name="giMelenaActive" value="stopped_recently" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                      <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ถ่ายดำครั้งล่าสุดแล้วหยุดไปแล้ว</span>
                    </label>
                  </div>
                </div>
              </div>
              <div class="pt-2 border-t border-slate-200">
                <label class="block text-[11px] font-medium text-slate-700 mb-1">มีอาการถ่ายดำนำมาก่อนหน้านี้หลายวันหรือไม่:</label>
                <div class="space-y-1">
                  <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                    <input type="radio" name="giMelenaPreceded" value="yes" onchange="handleGiMelenaPrecededChange('yes')" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                    <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีอาการถ่ายดำนำมาก่อนหลายวัน</span>
                  </label>
                  <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                    <input type="radio" name="giMelenaPreceded" value="no" onchange="handleGiMelenaPrecededChange('no')" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                    <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่มี (เพิ่งเริ่มมีอาการถ่ายดำวันนี้ หรือภายใน 24 ชม. ที่ผ่านมา)</span>
                  </label>
                </div>
                <div id="giMelenaDaysWrap" class="mt-2 hidden">
                  <label class="block text-[11px] font-medium text-slate-700 mb-1">ระบุจำนวนวันที่มีอาการถ่ายดำนำมาก่อน:</label>
                  <div class="flex items-center gap-2">
                    <input type="number" id="giMelenaDays" min="1" placeholder="ระบุจำนวนวัน" class="w-32 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
                    <span class="text-xs text-slate-600">วัน</span>
                  </div>
                </div>
              </div>
              <div class="pt-2 border-t border-slate-200">
                <label class="block text-[11px] font-medium text-slate-700 mb-1">ประวัติการรับประทานยาที่อาจทำให้อุจจาระสีดำ:</label>
                <div class="space-y-1">
                  <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                    <input type="checkbox" name="giPseudoMelenaMeds" value="ferrous" class="text-medical-600 rounded focus:ring-medical-500">
                    <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">รับประทานยาบำรุงเลือด (ธาตุเหล็ก / Ferrous Fumarate) เป็นประจำ</span>
                  </label>
                  <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                    <input type="checkbox" name="giPseudoMelenaMeds" value="bismuth" class="text-medical-600 rounded focus:ring-medical-500">
                    <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">รับประทานยาเคลือบกระเพาะอาหารที่มีสารบิสมัท (Bismuth / Pepto-Bismol)</span>
                  </label>
                  <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                    <input type="checkbox" name="giPseudoMelenaMeds" value="none_pseudo" onchange="handleGiPseudoMelenaNoneToggle(this)" class="text-medical-600 rounded focus:ring-medical-500">
                    <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่ได้รับประทานยาเหล่านี้</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Branch 3: Hematochezia -->
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs font-semibold text-slate-800">
              <input type="checkbox" id="gi_hematochezia_cb" onchange="handleGiHematocheziaToggle(this)" class="h-4 w-4 rounded flex-shrink-0 text-medical-600 focus:ring-medical-500">
              <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">3. ถ่ายอุจจาระมีเลือดสด หรือถ่ายเป็นเลือดสีแดงคล้ำ (Hematochezia / Rectal Bleeding)</span>
            </label>
            <div id="giHematocheziaWrap" class="mt-3 pl-6 space-y-3 hidden bg-slate-50 border border-slate-200 rounded-xl p-4 ml-2">
              <div>
                <label class="block text-[11px] font-medium text-slate-700 mb-1">ลักษณะของเลือดที่ถ่ายออกทางทวารหนัก:</label>
                <div class="space-y-1">
                  <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                    <input type="radio" name="giHematocheziaChar" value="profuse_bright_red" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                    <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ถ่ายออกมาเป็นเลือดสีแดงสดล้วนๆ หรือลิ่มเลือดปริมาณมาก ไหลพุ่งเต็มโถส้วม</span>
                  </label>
                  <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                    <input type="radio" name="giHematocheziaChar" value="surface_streak_or_drip" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                    <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีเลือดสดเคลือบอยู่ที่ผิวก้อนอุจจาระ หรือเลือดสดหยดติ๋งๆ ลงโถส้วมหลังถ่ายเสร็จ</span>
                  </label>
                  <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                    <input type="radio" name="giHematocheziaChar" value="toilet_paper_only" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                    <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เลือดสดเปื้อนเฉพาะกระดาษชำระเวลาเช็ดทำความสะอาดก้น</span>
                  </label>
                  <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                    <input type="radio" name="giHematocheziaChar" value="bloody_mucus_loose" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                    <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ถ่ายอุจจาระเหลวเป็นมูกปนเลือดสด หรือมูกปนหนอง</span>
                  </label>
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label class="block text-[11px] font-medium text-slate-700 mb-1">จำนวนครั้งที่ถ่ายมีเลือดใน 24 ชม.:</label>
                  <div class="space-y-1">
                    <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                      <input type="radio" name="giHematocheziaFreq" value="freq_1_2" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                      <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">1–2 ครั้ง</span>
                    </label>
                    <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                      <input type="radio" name="giHematocheziaFreq" value="freq_3_5" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                      <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">3–5 ครั้ง</span>
                    </label>
                    <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                      <input type="radio" name="giHematocheziaFreq" value="freq_gt_5" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                      <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มากกว่า 5 ครั้งขึ้นไป</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label class="block text-[11px] font-medium text-slate-700 mb-1">อาการเจ็บหรือปวดบริเวณรูทวารหนัก:</label>
                  <div class="space-y-1">
                    <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                      <input type="radio" name="giAnalPain" value="sharp_tearing_pain" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                      <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีอาการเจ็บแปลบ ปวดแสบ หรือบาดลึกที่รูทวารขณะเบ่งถ่าย</span>
                    </label>
                    <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                      <input type="radio" name="giAnalPain" value="no_anal_pain" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                      <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่มีอาการเจ็บปวดที่รูทวารหนักเลย</span>
                    </label>
                  </div>
                </div>
              </div>
              <div class="pt-2 border-t border-slate-200">
                <label class="block text-[11px] font-medium text-slate-700 mb-1">มีก้อนหรือติ่งเนื้อยื่นออกทางรูทวารหนักหรือไม่:</label>
                <div class="space-y-1">
                  <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                    <input type="radio" name="giProlapsedMass" value="has_mass" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                    <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีก้อนหรือติ่งเนื้อยื่นปลิ้นออกมาทางรูทวารหนัก (ยุบเองได้ หรือต้องดันกลับ)</span>
                  </label>
                  <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                    <input type="radio" name="giProlapsedMass" value="no_mass" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                    <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่มีก้อนหรือติ่งเนื้อยื่นออกมา</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 3: Shock & Hemodynamic Warning Signs -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="shield-alert" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">3. สัญญาณเตือนภาวะเสียเลือดและระบบไหลเวียนโลหิตบกพร่อง (Shock & Perfusion Signs)</h2>
            <p class="text-xs text-slate-500">ผู้ป่วยมีอาการเตือนดังต่อไปนี้ร่วมด้วยหรือไม่ (เลือกได้มากกว่า 1 ข้อตามจริง)</p>
          </div>
        </div>
        
        <div class="space-y-2">
          <label class="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
            <input type="checkbox" name="giShockSigns" value="postural_dizziness" class="mt-0.5 text-medical-600 rounded focus:ring-medical-500">
            <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีอาการหน้ามืด วิงเวียน ตาพร่ามัว ทรงตัวไม่อยู่เมื่อเปลี่ยนท่าหรือลุกขึ้นยืน (Postural Dizziness)</span>
          </label>
          <label class="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
            <input type="checkbox" name="giShockSigns" value="syncope" class="mt-0.5 text-medical-600 rounded focus:ring-medical-500">
            <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีอาการเป็นลม วูบหมดสติ หรือล้มพับไปชั่วขณะ (Syncope / Near-syncope)</span>
          </label>
          <label class="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
            <input type="checkbox" name="giShockSigns" value="palpitations" class="mt-0.5 text-medical-600 rounded focus:ring-medical-500">
            <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">รู้สึกใจสั่น หัวใจเต้นเร็วรัวผิดปกติ หรือรู้สึกแน่นอึดอัดหน้าอก (Tachycardia / Palpitations)</span>
          </label>
          <label class="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
            <input type="checkbox" name="giShockSigns" value="cold_extremities" class="mt-0.5 text-medical-600 rounded focus:ring-medical-500">
            <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เหงื่อแตกท่วมตัว ตัวเย็นชืด มือและเท้าเย็นจัด หรือปลายมือปลายเท้าซีดเผือด (Cold extremities / Diaphoresis)</span>
          </label>
          <label class="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
            <input type="checkbox" name="giShockSigns" value="severe_dyspnea_fatigue" class="mt-0.5 text-medical-600 rounded focus:ring-medical-500">
            <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">หายใจหอบเร็ว รู้สึกเหนื่อยล้าผิดปกติ หรืออ่อนเพลียมากจนลุกเดินไม่ไหว (Dyspnea / Severe fatigue)</span>
          </label>
          <label class="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
            <input type="checkbox" name="giShockSigns" value="oliguria_anuria" class="mt-0.5 text-medical-600 rounded focus:ring-medical-500">
            <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ปัสสาวะออกน้อยมาก สีเข้มจัด หรือไม่มีปัสสาวะออกเลยนานเกิน 6 ชั่วโมง (Oliguria / Anuria)</span>
          </label>
          <label class="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
            <input type="checkbox" name="giShockSigns" value="altered_mental" class="mt-0.5 text-medical-600 rounded focus:ring-medical-500">
            <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">รู้สึกซึมลง สับสน พูดคุยไม่รู้เรื่อง หรือตอบสนองช้าลง (Altered mental status)</span>
          </label>
          <label class="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer pt-1 border-t border-slate-100">
            <input type="checkbox" name="giShockSigns" value="none_shock" onchange="handleGiShockNoneToggle(this)" class="mt-0.5 text-medical-600 rounded focus:ring-medical-500">
            <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่มีอาการเหล่านี้เลย (สัญญาณชีพและระบบไหลเวียนปกติ)</span>
          </label>
        </div>
      </div>

      <!-- Card 4: Abdominal Symptoms -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="utensils" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">4. อาการปวดท้องและอาการทางเดินอาหารร่วม (Abdominal Symptoms)</h2>
            <p class="text-xs text-slate-500">คัดกรองอาการปวดท้องและการขับถ่ายที่สัมพันธ์กับภาวะเลือดออก</p>
          </div>
        </div>
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">มีอาการปวดท้องร่วมด้วยหรือไม่:</label>
            <div class="space-y-1">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                <input type="radio" name="giHasAbdpain" value="no" onchange="handleGiAbdpainChange('no')" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่มีอาการปวดท้องเลย (มีเลือดออกโดยไม่รู้สึกปวดท้อง)</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                <input type="radio" name="giHasAbdpain" value="yes" onchange="handleGiAbdpainChange('yes')" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีอาการปวดท้องร่วมด้วย</span>
              </label>
            </div>
          </div>
          
          <div id="giAbdpainWrap" class="mt-3 pl-4 space-y-3 hidden bg-slate-50 border border-slate-200 rounded-xl p-4 ml-1">
            <div>
              <label class="block text-[11px] font-medium text-slate-700 mb-1">ตำแหน่งที่ปวดท้องเด่นชัด:</label>
              <div class="space-y-1">
                <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                  <input type="radio" name="giAbdpainLoc" value="epigastric_ruq" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ปวดใต้ลิ้นปี่ หรือชายโครงด้านขวา (Epigastric / RUQ)</span>
                </label>
                <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                  <input type="radio" name="giAbdpainLoc" value="periumbilical" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ปวดรอบสะดือ (Periumbilical)</span>
                </label>
                <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                  <input type="radio" name="giAbdpainLoc" value="llq" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ปวดท้องน้อยด้านซ้าย (LLQ)</span>
                </label>
                <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                  <input type="radio" name="giAbdpainLoc" value="rlq" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ปวดท้องน้อยด้านขวา (RLQ)</span>
                </label>
                <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                  <input type="radio" name="giAbdpainLoc" value="diffuse" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                  <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ปวดบิดเกร็งทั่วทั้งท้อง (Diffuse)</span>
                </label>
              </div>
            </div>
            <div class="pt-2 border-t border-slate-200">
              <label class="block text-[11px] font-medium text-slate-700 mb-1">ลักษณะอาการปวดท้อง (เลือกได้มากกว่า 1 ข้อ):</label>
              <div class="space-y-1.5">
                <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                  <input type="checkbox" name="giAbdpainChars" value="burning_gnawing" class="text-medical-600 rounded focus:ring-medical-500">
                  <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ปวดแสบ จุก ร้อน หรือปวดตื้อใต้ลิ้นปี่ มักสัมพันธ์กับเวลาก่อนหรือหลังอาหาร</span>
                </label>
                <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                  <input type="checkbox" name="giAbdpainChars" value="colicky_spasm" class="text-medical-600 rounded focus:ring-medical-500">
                  <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ปวดบิดมวนเกร็งเป็นพักๆ สัมพันธ์กับการอยากถ่ายอุจจาระ</span>
                </label>
                <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                  <input type="checkbox" name="giAbdpainChars" value="peritonitis_rigid" class="text-medical-600 rounded focus:ring-medical-500">
                  <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ปวดท้องรุนแรงมากตลอดเวลา หน้าท้องแข็งเกร็ง ขยับตัวแล้วเจ็บสะเทือนมาก</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 5: High-Risk Medications -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="alert-triangle" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">5. ประวัติการใช้ยาความเสี่ยงสูง (High-Risk Medications)</h2>
            <p class="text-xs text-slate-500">ตรวจสอบยาละลายลิ่มเลือด ยาต้านเกล็ดเลือด และยาแก้ปวดที่อาจกระตุ้นเลือดออก</p>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Anticoagulants / Antiplatelets -->
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <label class="block text-xs font-semibold text-slate-800 mb-1.5">ยาละลายลิ่มเลือดและยาต้านเกล็ดเลือด:</label>
            <div class="space-y-1.5">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                <input type="checkbox" name="giAnticoagMeds" value="warfarin" class="text-medical-600 rounded focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ยาละลายลิ่มเลือดกลุ่ม Warfarin (Coumadin)</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                <input type="checkbox" name="giAnticoagMeds" value="doac" class="text-medical-600 rounded focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ยาละลายลิ่มเลือดกลุ่มใหม่ (DOACs เช่น Eliquis, Xarelto, Pradaxa)</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                <input type="checkbox" name="giAnticoagMeds" value="antiplatelet" class="text-medical-600 rounded focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ยาต้านเกล็ดเลือด (เช่น Aspirin, Clopidogrel / Plavix, Brilinta)</span>
              </label>
              <label class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1 border-t border-slate-200">
                <input type="checkbox" name="giAnticoagMeds" value="none_anticoag" onchange="handleGiAnticoagNoneToggle(this)" class="text-medical-600 rounded focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่ได้รับประทานยาละลายลิ่มเลือดหรือยาต้านเกล็ดเลือด</span>
              </label>
            </div>
          </div>

          <!-- NSAIDs / Steroids / Herbs -->
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <label class="block text-xs font-semibold text-slate-800 mb-1.5">ยาแก้ปวดข้อ ยาลูกกลอน และยาสเตียรอยด์:</label>
            <div class="space-y-1.5">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                <input type="checkbox" name="giNsaidMeds" value="nsaids" class="text-medical-600 rounded focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ยาแก้ปวดข้อ/กล้ามเนื้อกลุ่ม NSAIDs (Ibuprofen, Diclofenac, Naproxen, Arcoxia)</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                <input type="checkbox" name="giNsaidMeds" value="steroids" class="text-medical-600 rounded focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ยาสเตียรอยด์ (เช่น Prednisolone, Dexamethasone)</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                <input type="checkbox" name="giNsaidMeds" value="herbal_bolus" class="text-medical-600 rounded focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ยาชุด ยาหม้อ ยาสมุนไพร ยาลูกกลอน หรือยาต้มแก้ปวดเมื่อย</span>
              </label>
              <label class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1 border-t border-slate-200">
                <input type="checkbox" name="giNsaidMeds" value="none_nsaids" onchange="handleGiNsaidsNoneToggle(this)" class="text-medical-600 rounded focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่ได้รับประทานยากลุ่มนี้</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 6: PMH & Risk Factors -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="file-text" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">6. ประวัติโรคประจำตัวเดิม การผ่าตัด และแอลกอฮอล์ (PMH & Risk Factors)</h2>
            <p class="text-xs text-slate-500">ตรวจสอบประวัติแผลในกระเพาะอาหาร โรคตับแข็ง และการดื่มแอลกอฮอล์</p>
          </div>
        </div>
        <div class="space-y-4">
          <!-- Liver / Alcohol -->
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <label class="block text-xs font-semibold text-slate-800 mb-1.5">ประวัติโรคตับและพฤติกรรมการดื่มแอลกอฮอล์:</label>
            <div class="space-y-1.5">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                <input type="checkbox" name="giLiverAlcohol" value="heavy_alcohol" class="text-medical-600 rounded focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ดื่มสุรา เบียร์ หรือเครื่องดื่มแอลกอฮอล์เป็นประจำ หรือดื่มหนักต่อเนื่อง</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                <input type="checkbox" name="giLiverAlcohol" value="cirrhosis_varices" class="text-medical-600 rounded focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เคยได้รับการวินิจฉัยว่าเป็นโรคตับแข็ง หรือมีประวัติเส้นเลือดขอดในหลอดอาหาร</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                <input type="checkbox" name="giLiverAlcohol" value="jaundice_ascites" class="text-medical-600 rounded focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีอาการตาเหลือง ตัวเหลือง หรือท้องมานน้ำบวมโต</span>
              </label>
              <label class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1 border-t border-slate-200">
                <input type="checkbox" name="giLiverAlcohol" value="none_liver" onchange="handleGiLiverNoneToggle(this)" class="text-medical-600 rounded focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่มีประวัติโรคตับและไม่ดื่มแอลกอฮอล์เป็นประจำ</span>
              </label>
            </div>
          </div>

          <!-- Past GI History & Surgery -->
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <label class="block text-xs font-semibold text-slate-800 mb-1.5">ประวัติโรคทางเดินอาหารและการผ่าตัดในอดีต:</label>
            <div class="space-y-2">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                <input type="checkbox" id="gi_past_pud_cb" name="giPastHistory" value="past_pud_bleed" onchange="handleGiPastPudBleedToggle(this)" class="text-medical-600 rounded focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เคยเป็นแผล หรือมีเลือดออกในทางเดินอาหารมาก่อน</span>
              </label>
              <div id="giPastPudBleedWrap" class="pl-6 space-y-2 hidden bg-slate-50 border border-slate-200 rounded-xl p-4 ml-2">
                <div>
                  <label class="block text-[11px] font-medium text-slate-700 mb-1">ลักษณะประวัติเดิม:</label>
                  <div class="space-y-1">
                    <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                      <input type="radio" name="giPastPudType" value="peptic_ulcer_only" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                      <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เคยเป็นแผลในกระเพาะอาหาร/ลำไส้เล็กอย่างเดียว (ไม่เคยมีเลือดออก)</span>
                    </label>
                    <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                      <input type="radio" name="giPastPudType" value="previous_bleeding" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                      <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เคยมีภาวะเลือดออกในทางเดินอาหารมาก่อน</span>
                    </label>
                    <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                      <input type="radio" name="giPastPudType" value="both_pud_and_bleeding" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                      <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เคยเป็นทั้งแผลในกระเพาะอาหารและเคยมีเลือดออกร่วมกันทั้งสองอย่าง</span>
                    </label>
                  </div>
                </div>
                <div class="pt-2 border-t border-slate-200">
                  <label class="block text-[11px] font-medium text-slate-700 mb-1">ประวัติการส่องกล้อง/ตรวจรักษากับโรงพยาบาลราชบุรี:</label>
                  <div class="space-y-1">
                    <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                      <input type="radio" name="giPastPudHospital" value="rachaburi_hospital" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                      <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีประวัติเคยตรวจรักษา หรือเคยได้รับการส่องกล้องกับโรงพยาบาลราชบุรี</span>
                    </label>
                    <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                      <input type="radio" name="giPastPudHospital" value="other_hospital" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                      <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เคยตรวจรักษาหรือส่องกล้องที่โรงพยาบาลอื่น (ไม่ใช่ รพ.ราชบุรี)</span>
                    </label>
                    <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                      <input type="radio" name="giPastPudHospital" value="never_unsure" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                      <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่เคยได้รับการส่องกล้องทางเดินอาหารมาก่อน / ไม่แน่ใจ</span>
                    </label>
                  </div>
                </div>
              </div>

              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                <input type="checkbox" name="giPastHistory" value="past_gi_surgery" class="text-medical-600 rounded focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เคยผ่าตัดกระเพาะอาหาร หรือผ่าตัดส่วนของลำไส้</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                <input type="checkbox" name="giPastHistory" value="past_aaa_repair" class="text-medical-600 rounded focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เคยผ่าตัดใส่หลอดเลือดเทียมรักษาหลอดเลือดแดงใหญ่ในช่องท้องโป่งพอง (AAA Repair)</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition text-xs text-slate-700">
                <input type="checkbox" name="giPastHistory" value="underlying_cvd_ckd" class="text-medical-600 rounded focus:ring-medical-500">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีโรคประจำตัว: โรคหลอดเลือดหัวใจ, โรคหลอดเลือดสมอง, หรือโรคไตเรื้อรัง (CKD/ฟอกไต)</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 7: อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100">
          <div class="bg-slate-100 text-slate-600 p-2 rounded-xl">
            <i data-lucide="message-square-plus" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-800">7. อาการอื่น ๆ หรือข้อความเพิ่มเติมถึงแพทย์ (Additional Notes)</h2>
            <p class="text-xs text-slate-500">ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)</p>
          </div>
        </div>
        <textarea id="gi_bleed_other_free" rows="2" placeholder="ระบุอาการ หรือข้อสังเกตเพิ่มเติม (ถ้ามี)..."
          class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"></textarea>
      </div>
    </div>
  `,

  collectIntake: function(ctx) {
    const _rawDur = parseFloat(document.getElementById('giDurationVal')?.value); const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
    const durationUnit = document.getElementById('giDurationUnit')?.value || 'hours';

    const giOnsetMode = document.querySelector('input[name="giOnsetMode"]:checked')?.value || '';
    const giOnsetExactDate = document.getElementById('giOnsetExactDate')?.value?.trim() || '';
    const giOnsetExactTime = document.getElementById('giOnsetExactTime')?.value?.trim() || '';

    const giHematemesis = !!document.getElementById('gi_hematemesis_cb')?.checked;
    const giHematemesisChar = document.querySelector('input[name="giHematemesisChar"]:checked')?.value || '';
    const giHematemesisVolume = document.querySelector('input[name="giHematemesisVolume"]:checked')?.value || '';
    const giHematemesisFreq = document.querySelector('input[name="giHematemesisFreq"]:checked')?.value || '';
    const giPrecedingRetching = document.querySelector('input[name="giPrecedingRetching"]:checked')?.value || '';

    const giMelena = !!document.getElementById('gi_melena_cb')?.checked;
    const giMelenaChar = document.querySelector('input[name="giMelenaChar"]:checked')?.value || '';
    const giMelenaFreq = document.querySelector('input[name="giMelenaFreq"]:checked')?.value || '';
    const giMelenaPreceded = document.querySelector('input[name="giMelenaPreceded"]:checked')?.value || '';
    const giMelenaDays = Number(document.getElementById('giMelenaDays')?.value) || 0;
    const giMelenaActive = document.querySelector('input[name="giMelenaActive"]:checked')?.value || '';
    const giPseudoMelenaMeds = Array.from(document.querySelectorAll('input[name="giPseudoMelenaMeds"]:checked')).map(el => el.value);

    const giHematochezia = !!document.getElementById('gi_hematochezia_cb')?.checked;
    const giHematocheziaChar = document.querySelector('input[name="giHematocheziaChar"]:checked')?.value || '';
    const giHematocheziaFreq = document.querySelector('input[name="giHematocheziaFreq"]:checked')?.value || '';
    const giAnalPain = document.querySelector('input[name="giAnalPain"]:checked')?.value || '';
    const giProlapsedMass = document.querySelector('input[name="giProlapsedMass"]:checked')?.value || '';

    const giShockSigns = Array.from(document.querySelectorAll('input[name="giShockSigns"]:checked')).map(el => el.value);

    const giHasAbdpain = document.querySelector('input[name="giHasAbdpain"]:checked')?.value || 'no';
    const giAbdpainLoc = document.querySelector('input[name="giAbdpainLoc"]:checked')?.value || '';
    const giAbdpainChars = Array.from(document.querySelectorAll('input[name="giAbdpainChars"]:checked')).map(el => el.value);

    const giAnticoagMeds = Array.from(document.querySelectorAll('input[name="giAnticoagMeds"]:checked')).map(el => el.value);
    const giNsaidMeds = Array.from(document.querySelectorAll('input[name="giNsaidMeds"]:checked')).map(el => el.value);
    const giLiverAlcohol = Array.from(document.querySelectorAll('input[name="giLiverAlcohol"]:checked')).map(el => el.value);

    const giPastHistory = Array.from(document.querySelectorAll('input[name="giPastHistory"]:checked')).map(el => el.value);
    const giPastPudType = document.querySelector('input[name="giPastPudType"]:checked')?.value || '';
    const giPastPudHospital = document.querySelector('input[name="giPastPudHospital"]:checked')?.value || '';

    return {
      id: ctx.recordId,
      queue_number: ctx.queueNumber,
      hn: ctx.randomHn,
      name: ctx.patientName,
      age: ctx.patientAge,
      gender: ctx.gender,
      chief_complaint: 'gi_bleed',
      chief_complaint_title: 'อาเจียนเป็นเลือด / ถ่ายดำ / ถ่ายเป็นเลือดสด',
      timestamp: new Date().toISOString(),
      status: ctx.recordStatus,
      durationVal,
      durationUnit,
      hospRecordStatus: ctx.hospRecordStatus,
      underlying: ctx.underlying,
      drugAllergy: ctx.drugAllergy,
      currentMeds: ctx.currentMeds,
      otherSymptomsFree: document.getElementById('gi_bleed_other_free')?.value?.trim() || ctx.otherSymptomsFree || '',
      doctor_notes: ctx.preservedDoctorNotes,

      giOnsetMode,
      giOnsetExactDate,
      giOnsetExactTime,
      giHematemesis,
      giHematemesisChar,
      giHematemesisVolume,
      giHematemesisFreq,
      giPrecedingRetching,
      giMelena,
      giMelenaChar,
      giMelenaFreq,
      giMelenaPreceded,
      giMelenaDays,
      giMelenaActive,
      giPseudoMelenaMeds,
      giHematochezia,
      giHematocheziaChar,
      giHematocheziaFreq,
      giAnalPain,
      giProlapsedMass,
      giShockSigns,
      giHasAbdpain,
      giAbdpainLoc,
      giAbdpainChars,
      giAnticoagMeds,
      giNsaidMeds,
      giLiverAlcohol,
      giPastHistory,
      giPastPudType,
      giPastPudHospital
    };
  },

  hydrateForm: function(patient) {
    if (!patient) return;

    // Reset all sub-wraps
    const wrapsToHide = [
      'giHematemesisWrap', 'giMelenaWrap', 'giMelenaDaysWrap',
      'giHematocheziaWrap', 'giAbdpainWrap', 'giPastPudBleedWrap'
    ];
    wrapsToHide.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val !== undefined && val !== null ? val : '';
    };

    const setRadio = (name, val) => {
      if (!val) return;
      const el = document.querySelector(`input[name="${name}"][value="${val}"]`);
      if (el) el.checked = true;
    };

    const setChk = (id, checked) => {
      const el = document.getElementById(id);
      if (el) el.checked = !!checked;
    };

    setVal('giDurationVal', patient.durationVal || '');
    setVal('giDurationUnit', patient.durationUnit || 'hours');

    setRadio('giOnsetMode', patient.giOnsetMode);
    setVal('giOnsetExactDate', patient.giOnsetExactDate || '');
    setVal('giOnsetExactTime', patient.giOnsetExactTime || '');

    setChk('gi_hematemesis_cb', patient.giHematemesis);
    if (patient.giHematemesis) {
      const wrap = document.getElementById('giHematemesisWrap');
      if (wrap) wrap.classList.remove('hidden');
      setRadio('giHematemesisChar', patient.giHematemesisChar);
      setRadio('giHematemesisVolume', patient.giHematemesisVolume);
      setRadio('giHematemesisFreq', patient.giHematemesisFreq);
      setRadio('giPrecedingRetching', patient.giPrecedingRetching);
    }

    setChk('gi_melena_cb', patient.giMelena);
    if (patient.giMelena) {
      const wrap = document.getElementById('giMelenaWrap');
      if (wrap) wrap.classList.remove('hidden');
      setRadio('giMelenaChar', patient.giMelenaChar);
      setRadio('giMelenaFreq', patient.giMelenaFreq);
      setRadio('giMelenaPreceded', patient.giMelenaPreceded);
      if (patient.giMelenaPreceded === 'yes') {
        const dWrap = document.getElementById('giMelenaDaysWrap');
        if (dWrap) dWrap.classList.remove('hidden');
        setVal('giMelenaDays', patient.giMelenaDays || '');
      }
      setRadio('giMelenaActive', patient.giMelenaActive);
      if (Array.isArray(patient.giPseudoMelenaMeds)) {
        patient.giPseudoMelenaMeds.forEach(val => {
          const el = document.querySelector(`input[name="giPseudoMelenaMeds"][value="${val}"]`);
          if (el) el.checked = true;
        });
      }
    }

    setChk('gi_hematochezia_cb', patient.giHematochezia);
    if (patient.giHematochezia) {
      const wrap = document.getElementById('giHematocheziaWrap');
      if (wrap) wrap.classList.remove('hidden');
      setRadio('giHematocheziaChar', patient.giHematocheziaChar);
      setRadio('giHematocheziaFreq', patient.giHematocheziaFreq);
      setRadio('giAnalPain', patient.giAnalPain);
      setRadio('giProlapsedMass', patient.giProlapsedMass);
    }

    if (Array.isArray(patient.giShockSigns)) {
      patient.giShockSigns.forEach(val => {
        const el = document.querySelector(`input[name="giShockSigns"][value="${val}"]`);
        if (el) el.checked = true;
      });
    }

    setRadio('giHasAbdpain', patient.giHasAbdpain);
    if (patient.giHasAbdpain === 'yes') {
      const wrap = document.getElementById('giAbdpainWrap');
      if (wrap) wrap.classList.remove('hidden');
      setRadio('giAbdpainLoc', patient.giAbdpainLoc);
      if (Array.isArray(patient.giAbdpainChars)) {
        patient.giAbdpainChars.forEach(val => {
          const el = document.querySelector(`input[name="giAbdpainChars"][value="${val}"]`);
          if (el) el.checked = true;
        });
      }
    }

    if (Array.isArray(patient.giAnticoagMeds)) {
      patient.giAnticoagMeds.forEach(val => {
        const el = document.querySelector(`input[name="giAnticoagMeds"][value="${val}"]`);
        if (el) el.checked = true;
      });
    }

    if (Array.isArray(patient.giNsaidMeds)) {
      patient.giNsaidMeds.forEach(val => {
        const el = document.querySelector(`input[name="giNsaidMeds"][value="${val}"]`);
        if (el) el.checked = true;
      });
    }

    if (Array.isArray(patient.giLiverAlcohol)) {
      patient.giLiverAlcohol.forEach(val => {
        const el = document.querySelector(`input[name="giLiverAlcohol"][value="${val}"]`);
        if (el) el.checked = true;
      });
    }

    if (Array.isArray(patient.giPastHistory)) {
      patient.giPastHistory.forEach(val => {
        const el = document.querySelector(`input[name="giPastHistory"][value="${val}"]`);
        if (el) el.checked = true;
      });
    }

    if (Array.isArray(patient.giPastHistory) && patient.giPastHistory.includes('past_pud_bleed')) {
      const wrap = document.getElementById('giPastPudBleedWrap');
      if (wrap) wrap.classList.remove('hidden');
      setRadio('giPastPudType', patient.giPastPudType);
      setRadio('giPastPudHospital', patient.giPastPudHospital);
    }

    setVal('gi_bleed_other_free', patient.otherSymptomsFree || '');
  },

  populateForm: function(patient) {
    return this.hydrateForm(patient);
  },

  isRedFlag: function(patient) {
    return isGiBleedRedFlag(patient);
  },

  evaluateRedFlags: function(patient) {
    return evaluateGiBleedRedFlags(patient);
  },

  updateOutputs: function(patient) {
    updateGiBleedOutputs(patient);
  },

  generateCds: function(patient, { rfs, ddxList, workupList, managementList }) {
    if (!patient) return;

    const hasHema = !!patient.giHematemesis;
    const hasMelena = !!patient.giMelena;
    const hasChezia = !!patient.giHematochezia;

    const liverAlcohol = Array.isArray(patient.giLiverAlcohol) ? patient.giLiverAlcohol : [];
    const hasCirrhosis = liverAlcohol.includes('cirrhosis_varices');
    const hasHeavyAlcohol = liverAlcohol.includes('heavy_alcohol');
    const hasJaundiceAscites = liverAlcohol.includes('jaundice_ascites');

    const anticoagMeds = Array.isArray(patient.giAnticoagMeds) ? patient.giAnticoagMeds : [];
    const takesWarfarin = anticoagMeds.includes('warfarin');
    const takesDoac = anticoagMeds.includes('doac');
    const takesAntiplatelet = anticoagMeds.includes('antiplatelet');

    const nsaidMeds = Array.isArray(patient.giNsaidMeds) ? patient.giNsaidMeds : [];
    const takesNsaids = nsaidMeds.includes('nsaids');
    const takesHerbalBolus = nsaidMeds.includes('herbal_bolus');

    const pastHistory = Array.isArray(patient.giPastHistory) ? patient.giPastHistory : [];
    const hasAaa = pastHistory.includes('past_aaa_repair');

    // 1. Differential Diagnoses
    if (hasCirrhosis || hasHeavyAlcohol || hasJaundiceAscites) {
      ddxList.push('1. Suspected Bleeding Esophageal / Gastric Varices in Chronic Liver Disease / Cirrhosis (โอกาสเป็นไปได้สูงมาก)');
      ddxList.push('2. Portal Hypertensive Gastropathy (PHG) / Bleeding Peptic Ulcer');
      ddxList.push('3. Spontaneous Bacterial Peritonitis (หากมีไข้หรือปวดท้องร่วมด้วย)');
    } else if (hasAaa) {
      ddxList.push('1. 🚨 Suspected Primary/Secondary Aortoenteric Fistula (ต้องรีบแยกโรคด่วนที่สุด)');
      ddxList.push('2. Peptic Ulcer Disease / Severe Gastritis');
    } else if (hasHema || hasMelena) {
      if (takesNsaids || takesHerbalBolus || takesAntiplatelet) {
        ddxList.push('1. Drug-Induced Bleeding Peptic Ulcer Disease (Gastric / Duodenal Ulcer) secondary to NSAIDs/Antiplatelet');
      } else {
        ddxList.push('1. Peptic Ulcer Disease (Gastric / Duodenal Ulcer with active bleeding)');
      }
      if (patient.giPrecedingRetching === 'yes') {
        ddxList.push('2. Mallory-Weiss Tear (Gastroesophageal laceration post-retching)');
      } else {
        ddxList.push('2. Acute Erosive Gastritis / Stress-related mucosal disease');
      }
      ddxList.push('3. Dieulafoy lesion / Upper GI Malignancy');
    } else if (hasChezia) {
      if (patient.giAnalPain === 'sharp_tearing_pain' || patient.giProlapsedMass === 'has_mass') {
        ddxList.push('1. Bleeding Internal/External Hemorrhoids or Acute Anal Fissure');
        ddxList.push('2. Proctitis / Distal Colorectal Polyps');
      } else if (patient.giHematocheziaChar === 'profuse_bright_red') {
        ddxList.push('1. Severe Lower GI Bleeding (Diverticular Bleeding / Angiodysplasia / Colonic AVM)');
        ddxList.push('2. Massive Upper GI Bleeding with Rapid Transit (Brish UGIB)');
      } else {
        ddxList.push('1. Lower Gastrointestinal Bleeding (Diverticulosis / Hemorrhoids / Colitis)');
      }
    }

    // 2. Workup Investigations
    workupList.push('Stat CBC, Hct/Hb, Platelet count, PT/INR, PTT (Coagulogram)');
    workupList.push('Stat Blood for Type & Crossmatch (PRC 2–4 units) and Blood Chemistry (BUN, Cr, Electrolytes)');
    if (hasCirrhosis || hasHeavyAlcohol || hasJaundiceAscites) {
      workupList.push('Stat Liver Function Test (LFT: AST, ALT, Total/Direct Bilirubin, Albumin, Globulin)');
    }
    if (hasAaa) {
      workupList.push('Stat CTA Whole Abdomen with IV contrast to evaluate Aortoenteric Fistula');
    }
    workupList.push('Emergency Endoscopy (EGD for upper GI bleed / Colonoscopy for massive lower GI bleed)');
    workupList.push('12-Lead EKG bedside to evaluate myocardial ischemia secondary to acute blood loss');

    // 3. Management
    if (rfs.some(r => r.key === 'gi_rf_hemorrhagic_shock')) {
      managementList.push('Resuscitation: เปิดเส้น IV Catheter No. 18 หรือ 16 จำนวน 2 เส้นทันที, โหลด IV NSS หรือ Acetar');
      managementList.push('Stat PRC Transfusion ตามระดับสัญญาณชีพและค่า Hct');
    }
    managementList.push('NPO: งดน้ำ งดอาหาร และงดยากินทุกชนิด');
    if (hasCirrhosis || hasHeavyAlcohol || hasJaundiceAscites) {
      managementList.push('Vasoactive drug: IV Terlipressin 2 mg IV q 4 hr หรือ Somatostatin / Octreotide 50 mcg bolus ตามด้วย 50 mcg/hr infusion');
      managementList.push('Antibiotic prophylaxis: IV Ceftriaxone 1 g OD (ป้องกัน Spontaneous Bacterial Peritonitis ในตับแข็ง)');
    }
    if (hasHema || hasMelena || takesNsaids || takesHerbalBolus) {
      managementList.push('Proton Pump Inhibitor: IV Pantoprazole 80 mg bolus ตามด้วย 8 mg/hr continuous infusion');
    }
    if (takesWarfarin) {
      managementList.push('Warfarin Reversal: Stat Vitamin K 10 mg IV ช้าๆ + พิจารณา Prothrombin Complex Concentrate (PCC) หรือ Fresh Frozen Plasma (FFP)');
    } else if (takesDoac) {
      managementList.push('DOAC Reversal: พิจารณา Specific Antidote (เช่น Idarucizumab หรือ Andexanet alfa ตามข้อบ่งชี้)');
    }
    managementList.push('Consult: ปรึกษาศัลยแพทย์ เพื่อเตรียมส่องกล้อง EGD/Colonoscopy หรือผ่าตัดห้ามเลือด');
  },

  seedPatients: [
    {
      id: 'case-130',
      queue_number: 'Q-001',
      hn: '6713012',
      name: 'นายประสิทธิ์ ศรีสวัสดิ์',
      age: 64,
      gender: 'ชาย',
      chief_complaint: 'gi_bleed',
      chief_complaint_title: 'อาเจียนเป็นเลือด / ถ่ายดำ / ถ่ายเป็นเลือดสด',
      timestamp: '2026-10-26T06:00:00.000Z',
      status: 'waiting',
      durationVal: 6,
      durationUnit: 'hours',
      hospRecordStatus: 'self',
      underlying: ['โรคหลอดเลือดหัวใจ (CAD)', 'ความดันสูง (HT)'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Aspirin 81 mg OD, Amlodipine 5 mg OD',
      otherSymptomsFree: '',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },

      giOnsetMode: 'sudden_severe',
      giOnsetExactDate: '26/10/2026',
      giOnsetExactTime: '06:00',
      giHematemesis: true,
      giHematemesisChar: 'bright_red_clots',
      giHematemesisVolume: 'large',
      giHematemesisFreq: 'freq_1_2',
      giPrecedingRetching: 'no',
      giMelena: true,
      giMelenaChar: 'tarry_foul',
      giMelenaFreq: 'freq_3_5',
      giMelenaPreceded: 'yes',
      giMelenaDays: 2,
      giMelenaActive: 'active_continuous',
      giPseudoMelenaMeds: ['none_pseudo'],
      giHematochezia: false,
      giHematocheziaChar: '',
      giHematocheziaFreq: '',
      giAnalPain: '',
      giProlapsedMass: '',
      giShockSigns: ['postural_dizziness', 'syncope', 'palpitations', 'cold_extremities', 'severe_dyspnea_fatigue', 'oliguria_anuria'],
      giHasAbdpain: 'yes',
      giAbdpainLoc: 'epigastric_ruq',
      giAbdpainChars: ['burning_gnawing'],
      giAnticoagMeds: ['antiplatelet'],
      giNsaidMeds: ['herbal_bolus'],
      giLiverAlcohol: ['none_liver'],
      giPastHistory: ['past_pud_bleed', 'underlying_cvd_ckd'],
      giPastPudType: 'both_pud_and_bleeding',
      giPastPudHospital: 'rachaburi_hospital'
    },
    {
      id: 'case-131',
      queue_number: 'Q-002',
      hn: '6713123',
      name: 'นายวิชัย เกียรติดำรงค์',
      age: 52,
      gender: 'ชาย',
      chief_complaint: 'gi_bleed',
      chief_complaint_title: 'อาเจียนเป็นเลือด / ถ่ายดำ / ถ่ายเป็นเลือดสด',
      timestamp: '2026-10-26T07:30:00.000Z',
      status: 'waiting',
      durationVal: 4,
      durationUnit: 'hours',
      hospRecordStatus: 'self',
      underlying: ['โรคตับแข็งจากแอลกอฮอล์ (Alcoholic Cirrhosis)'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Spironolactone 100 mg, Propranolol 10 mg',
      otherSymptomsFree: '',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },

      giOnsetMode: 'sudden_severe',
      giOnsetExactDate: '26/10/2026',
      giOnsetExactTime: '07:30',
      giHematemesis: true,
      giHematemesisChar: 'bright_red_clots',
      giHematemesisVolume: 'large',
      giHematemesisFreq: 'freq_3_5',
      giPrecedingRetching: 'no',
      giMelena: true,
      giMelenaChar: 'tarry_foul',
      giMelenaFreq: 'freq_1_2',
      giMelenaPreceded: 'no',
      giMelenaDays: 0,
      giMelenaActive: 'active_continuous',
      giPseudoMelenaMeds: ['none_pseudo'],
      giHematochezia: false,
      giHematocheziaChar: '',
      giHematocheziaFreq: '',
      giAnalPain: '',
      giProlapsedMass: '',
      giShockSigns: ['postural_dizziness', 'cold_extremities', 'severe_dyspnea_fatigue', 'altered_mental', 'palpitations'],
      giHasAbdpain: 'no',
      giAbdpainLoc: '',
      giAbdpainChars: [],
      giAnticoagMeds: ['none_anticoag'],
      giNsaidMeds: ['none_nsaids'],
      giLiverAlcohol: ['heavy_alcohol', 'cirrhosis_varices', 'jaundice_ascites'],
      giPastHistory: ['past_pud_bleed'],
      giPastPudType: 'previous_bleeding',
      giPastPudHospital: 'rachaburi_hospital'
    },
    {
      id: 'case-132',
      queue_number: 'Q-003',
      hn: '6713234',
      name: 'นางทองดี บุญประเสริฐ',
      age: 76,
      gender: 'หญิง',
      chief_complaint: 'gi_bleed',
      chief_complaint_title: 'อาเจียนเป็นเลือด / ถ่ายดำ / ถ่ายเป็นเลือดสด',
      timestamp: '2026-10-26T08:15:00.000Z',
      status: 'waiting',
      durationVal: 8,
      durationUnit: 'hours',
      hospRecordStatus: 'self',
      underlying: ['ลิ้นหัวใจเทียม (Mechanical Mitral Valve)', 'หัวใจเต้นผิดจังหวะ (Atrial Fibrillation)'],
      drugAllergy: 'แพ้ยา Sulfa',
      currentMeds: 'Warfarin 3 mg OD, Digoxin 0.125 mg',
      otherSymptomsFree: '',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },

      giOnsetMode: 'sudden_severe',
      giOnsetExactDate: '26/10/2026',
      giOnsetExactTime: '08:15',
      giHematemesis: false,
      giHematemesisChar: '',
      giHematemesisVolume: '',
      giHematemesisFreq: '',
      giPrecedingRetching: '',
      giMelena: false,
      giMelenaChar: '',
      giMelenaFreq: '',
      giMelenaPreceded: '',
      giMelenaDays: 0,
      giMelenaActive: '',
      giPseudoMelenaMeds: [],
      giHematochezia: true,
      giHematocheziaChar: 'profuse_bright_red',
      giHematocheziaFreq: 'freq_3_5',
      giAnalPain: 'no_anal_pain',
      giProlapsedMass: 'no_mass',
      giShockSigns: ['postural_dizziness', 'palpitations'],
      giHasAbdpain: 'no',
      giAbdpainLoc: '',
      giAbdpainChars: [],
      giAnticoagMeds: ['warfarin'],
      giNsaidMeds: ['none_nsaids'],
      giLiverAlcohol: ['none_liver'],
      giPastHistory: ['underlying_cvd_ckd'],
      giPastPudType: '',
      giPastPudHospital: ''
    },
    {
      id: 'case-133',
      queue_number: 'Q-004',
      hn: '6713345',
      name: 'นายอานนท์ เจริญสุข',
      age: 28,
      gender: 'ชาย',
      chief_complaint: 'gi_bleed',
      chief_complaint_title: 'อาเจียนเป็นเลือด / ถ่ายดำ / ถ่ายเป็นเลือดสด',
      timestamp: '2026-10-26T09:45:00.000Z',
      status: 'waiting',
      durationVal: 2,
      durationUnit: 'days',
      hospRecordStatus: 'self',
      underlying: ['ปฏิเสธ'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'ไม่มี',
      otherSymptomsFree: '',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },

      giOnsetMode: 'gradual_increase',
      giOnsetExactDate: '24/10/2026',
      giOnsetExactTime: '09:00',
      giHematemesis: false,
      giHematemesisChar: '',
      giHematemesisVolume: '',
      giHematemesisFreq: '',
      giPrecedingRetching: '',
      giMelena: false,
      giMelenaChar: '',
      giMelenaFreq: '',
      giMelenaPreceded: '',
      giMelenaDays: 0,
      giMelenaActive: '',
      giPseudoMelenaMeds: [],
      giHematochezia: true,
      giHematocheziaChar: 'surface_streak_or_drip',
      giHematocheziaFreq: 'freq_1_2',
      giAnalPain: 'sharp_tearing_pain',
      giProlapsedMass: 'has_mass',
      giShockSigns: ['none_shock'],
      giHasAbdpain: 'no',
      giAbdpainLoc: '',
      giAbdpainChars: [],
      giAnticoagMeds: ['none_anticoag'],
      giNsaidMeds: ['none_nsaids'],
      giLiverAlcohol: ['none_liver'],
      giPastHistory: [],
      giPastPudType: '',
      giPastPudHospital: ''
    }
  ]
});
