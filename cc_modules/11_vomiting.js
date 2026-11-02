// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 11_vomiting.js
// อาการนำ: คลื่นไส้ / อาเจียนรุนแรง (Nausea & Severe Vomiting)
// ไฟล์นี้แยกอิสระสำหรับอาการนำ vomiting เพื่อให้ทีมแพทย์และ IT โรงพยาบาลนำไปพัฒนาต่อได้โดยไม่กระทบระบบหลัก
// =========================================================================

function handleVomitingAbdpainToggle(el) {
  const isChecked = el ? el.checked : (document.getElementById('vomitingHasAbdominalPain')?.checked || false);
  const wrap = document.getElementById('vomitingAbdpainWrap');
  if (wrap) {
    if (isChecked) {
      wrap.classList.remove('hidden');
    } else {
      wrap.classList.add('hidden');
      document.querySelectorAll('input[name="vomitingAbdpainLocs"]').forEach(cb => cb.checked = false);
      document.querySelectorAll('input[name="vomitingAbdpainChar"]').forEach(r => r.checked = false);
    }
  }
}

function handleVomitingBowelHabitChange(val) {
  const dWrap = document.getElementById('vomitingDiarrheaWrap');
  const bWrap = document.getElementById('vomitingBloodyStoolWrap');
  const cWrap = document.getElementById('vomitingConstipationWrap');

  if (dWrap) dWrap.classList.add('hidden');
  if (bWrap) bWrap.classList.add('hidden');
  if (cWrap) cWrap.classList.add('hidden');

  if (val === 'diarrhea_active') {
    if (dWrap) dWrap.classList.remove('hidden');
    document.querySelectorAll('input[name="vomitingBloodyStoolChar"]').forEach(r => r.checked = false);
    document.querySelectorAll('input[name="vomitingConstipationSub"]').forEach(r => r.checked = false);
    document.querySelectorAll('input[name="vomitingPriorAbdominalSurgery"]').forEach(r => r.checked = false);
  } else if (val === 'bloody_melena_stool') {
    if (bWrap) bWrap.classList.remove('hidden');
    const dFreq = document.getElementById('vomitingDiarrheaFreq'); if (dFreq) dFreq.value = '';
    document.querySelectorAll('input[name="vomitingDiarrheaStools"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('input[name="vomitingConstipationSub"]').forEach(r => r.checked = false);
    document.querySelectorAll('input[name="vomitingPriorAbdominalSurgery"]').forEach(r => r.checked = false);
  } else if (val === 'constipation_obstipation_gte24h') {
    if (cWrap) cWrap.classList.remove('hidden');
    const dFreq = document.getElementById('vomitingDiarrheaFreq'); if (dFreq) dFreq.value = '';
    document.querySelectorAll('input[name="vomitingDiarrheaStools"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('input[name="vomitingBloodyStoolChar"]').forEach(r => r.checked = false);
  } else {
    // Normal or unspecified
    const dFreq = document.getElementById('vomitingDiarrheaFreq'); if (dFreq) dFreq.value = '';
    document.querySelectorAll('input[name="vomitingDiarrheaStools"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('input[name="vomitingBloodyStoolChar"]').forEach(r => r.checked = false);
    document.querySelectorAll('input[name="vomitingConstipationSub"]').forEach(r => r.checked = false);
    document.querySelectorAll('input[name="vomitingPriorAbdominalSurgery"]').forEach(r => r.checked = false);
  }
}

function handleVomitingCardiacNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="vomitingCardiacFlags"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleVomitingNeuroNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="vomitingNeuroFlags"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleVomitingDehydrationNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="vomitingDehydrationSigns"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleVomitingPrecipitantNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="vomitingPrecipitants"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
    const medsWrap = document.getElementById('vomitingMedsWrap');
    if (medsWrap) medsWrap.classList.add('hidden');
    document.querySelectorAll('input[name="vomitingMedList"]').forEach(cb => cb.checked = false);

    const toxinWrap = document.getElementById('vomitingToxinFoodWrap');
    if (toxinWrap) toxinWrap.classList.add('hidden');
    ['vomitingToxinFoodType', 'vomitingToxinFoodTime', 'vomitingToxinFoodPlace', 'vomitingToxinFoodCoEaters', 'vomitingToxinFoodDetails'].forEach(id => {
      const inp = document.getElementById(id);
      if (inp) inp.value = '';
    });

    const chemWrap = document.getElementById('vomitingChemicalWrap');
    if (chemWrap) chemWrap.classList.add('hidden');
    const chemInp = document.getElementById('vomitingChemicalDetails');
    if (chemInp) chemInp.value = '';
  }
}

function handleVomitingChemicalToggle(el) {
  const isChecked = el ? el.checked : (document.getElementById('vomitingChemicalCb')?.checked || false);
  const wrap = document.getElementById('vomitingChemicalWrap');
  if (wrap) {
    if (isChecked) {
      wrap.classList.remove('hidden');
      const noneCb = document.getElementById('vomitingPrecipitantNoneCb');
      if (noneCb) noneCb.checked = false;
    } else {
      wrap.classList.add('hidden');
      const inp = document.getElementById('vomitingChemicalDetails');
      if (inp) inp.value = '';
    }
  }
}

function handleVomitingMedsToggle(el) {
  const isChecked = el ? el.checked : (document.getElementById('vomitingMedsCb')?.checked || false);
  const wrap = document.getElementById('vomitingMedsWrap');
  if (wrap) {
    if (isChecked) {
      wrap.classList.remove('hidden');
      const noneCb = document.getElementById('vomitingPrecipitantNoneCb');
      if (noneCb) noneCb.checked = false;
    } else {
      wrap.classList.add('hidden');
      document.querySelectorAll('input[name="vomitingMedList"]').forEach(cb => cb.checked = false);
    }
  }
}

function handleVomitingToxinFoodToggle(el) {
  const isChecked = el ? el.checked : (document.getElementById('vomitingToxinFoodCb')?.checked || false);
  const wrap = document.getElementById('vomitingToxinFoodWrap');
  if (wrap) {
    if (isChecked) {
      wrap.classList.remove('hidden');
      const noneCb = document.getElementById('vomitingPrecipitantNoneCb');
      if (noneCb) noneCb.checked = false;
    } else {
      wrap.classList.add('hidden');
      ['vomitingToxinFoodType', 'vomitingToxinFoodTime', 'vomitingToxinFoodPlace', 'vomitingToxinFoodCoEaters', 'vomitingToxinFoodDetails'].forEach(id => {
        const inp = document.getElementById(id);
        if (inp) inp.value = '';
      });
    }
  }
}

function handleVomitingLmpStatusChange(val) {
  const wrap = document.getElementById('vomiting_lmp_date_wrap');
  if (wrap) {
    if (val === 'regular_lmp_exact') {
      wrap.classList.remove('hidden');
    } else {
      wrap.classList.add('hidden');
      const dateInp = document.getElementById('vomitingLmpDate');
      if (dateInp) dateInp.value = '';
    }
  }
}

function detectVomitingRedFlags(patient) {
  if (!patient || patient.chief_complaint !== 'vomiting') return [];
  const flags = [];

  const char = patient.vomitusCharacter || '';
  const bowel = patient.vomitingBowelHabit || '';
  const bloodyStoolChar = patient.vomitingBloodyStoolChar || '';
  const diarrheaStools = patient.vomitingDiarrheaStools || [];
  const constipationSub = patient.vomitingConstipationSub || '';
  const distension = patient.vomitingAbdominalDistension || '';
  const priorSurgery = patient.vomitingPriorAbdominalSurgery === 'yes';
  const cardiac = patient.vomitingCardiacFlags || [];
  const neuro = patient.vomitingNeuroFlags || [];
  const dehy = patient.vomitingDehydrationSigns || [];
  const precipitants = patient.vomitingPrecipitants || [];
  const meds = patient.vomitingMedList || [];
  const oralIntol = patient.vomitingOralIntolerance === 'intolerant_vomit_all';

  // 1. Hematemesis / Gross Melena (UGI Bleed / Mallory-Weiss)
  const isHematemesis = char === 'blood_bright_red' || char === 'blood_coffee_ground';
  const isMelenaOrGrossBleed = bowel === 'bloody_melena_stool' && (bloodyStoolChar === 'black_tarry_melena' || bloodyStoolChar === 'pure_bright_red' || bloodyStoolChar === 'dark_clots' || bloodyStoolChar === 'maroon_wash');
  const isDiarrheaBleed = bowel === 'diarrhea_active' && (diarrheaStools.includes('bloody') || diarrheaStools.includes('dark_tarry'));
  if (isHematemesis || isMelenaOrGrossBleed || isDiarrheaBleed) {
    flags.push({
      key: 'vomiting_rf_hematemesis_melena',
      textTh: 'มีอาการอาเจียนเป็นเลือดสด/สีกาแฟคั่ว หรือถ่ายเป็นเลือดสด/ถ่ายดำเหนียวยางมะตอย (Acute GI Bleeding)',
      risk: 'เสี่ยงภาวะเลือดออกในทางเดินอาหารส่วนต้นรุนแรง (Bleeding PUD / Mallory-Weiss tear / Esophageal Varices) ต้องเปิดเส้น IV เบอร์ใหญ่ 2 เส้น, จองเลือด PRC, ให้ PPI IV bolus และส่งส่องกล้อง EGD ด่วน'
    });
  }

  // 2. Feculent Vomiting or Severe Peritonitis
  const isFeculent = char === 'brown_feculent';
  const isPeritonitis = patient.vomitingHasAbdominalPain && patient.vomitingAbdpainChar === 'constant_severe';
  if (isFeculent || isPeritonitis) {
    flags.push({
      key: 'vomiting_rf_feculent_peritonitis',
      textTh: isFeculent ? 'อาเจียนมีกลิ่นเหม็นรุนแรงคล้ายอุจจาระ (Feculent Vomiting)' : 'ปวดท้องรุนแรงต่อเนื่อง ขยับตัวแล้วเจ็บสะเทือนมาก (Peritoneal Irritation)',
      risk: 'บ่งชี้ภาวะลำไส้อุดตันขั้นรุนแรง (Late-stage Bowel Obstruction) หรือเยื่อบุช่องท้องอักเสบ/ลำไส้ขาดเลือด (Strangulated Bowel / Peritonitis) ต้อง NPO, ใส่ NG tube และปรึกษาศัลยแพทย์ด่วน'
    });
  }

  // 3. Obstipation with Marked Distension & Prior Surgery (SBO)
  const isObstipation = bowel === 'constipation_obstipation_gte24h' && (constipationSub === 'no_stool_no_gas' || constipationSub === 'no_stool_can_pass_gas');
  const isMarkedDistension = distension === 'marked_distension_tight';
  if ((isObstipation && isMarkedDistension) || (isObstipation && priorSurgery) || (isMarkedDistension && priorSurgery)) {
    flags.push({
      key: 'vomiting_rf_obstipation_sbo',
      textTh: 'ท้องอืดป่องแน่นตึงมาก + ไม่ถ่ายไม่ผายลม ร่วมกับมีประวัติผ่าตัดช่องท้อง (Suspected Adhesive Bowel Obstruction)',
      risk: 'สงสัยภาวะลำไส้อุดตันเฉียบพลันจากพังผืด (Adhesive Small Bowel Obstruction - SBO) ต้องส่ง Plain Abdomen erect/supine หรือ CT Abdomen, งดน้ำงดอาหาร และใส่สายระบายทางจมูก (NG tube)'
    });
  }

  // 4. Cardiac Warning / Atypical ACS (Inferior STEMI)
  const hasChestTightness = cardiac.includes('chest_tightness_pressure');
  const hasDiaphoresis = cardiac.includes('diaphoresis_cold_sweat');
  const hasSyncope = cardiac.includes('syncope_presyncope');
  if (hasChestTightness || (hasDiaphoresis && (patient.age >= 50 || precipitants.includes('known_diabetes') || hasSyncope))) {
    flags.push({
      key: 'vomiting_rf_atypical_acs',
      textTh: 'มีอาการแน่นหน้าอกร้าวไปกราม/แขนซ้าย หรือเหงื่อแตกท่วมตัวเย็นเฉียบ (Suspected Acute Coronary Syndrome / Inferior STEMI)',
      risk: 'อาการคลื่นไส้อาเจียนอาจเป็นอาการนำของกล้ามเนื้อหัวใจขาดเลือดเฉียบพลันผนังล่าง (Inferior STEMI / Atypical ACS) จากการกระตุ้น Vagus nerve ต้องตรวจคลื่นไฟฟ้าหัวใจ 12-lead EKG ภายใน 10 นาที'
    });
  }

  // 5. Diabetic Ketoacidosis (DKA) / Severe Ketosis
  const isDiabetic = precipitants.includes('known_diabetes');
  const hasExtremeDehy = dehy.includes('marked_dry_mouth_thirst') || dehy.includes('oliguria_anuria');
  if (isDiabetic && (hasExtremeDehy || oralIntol || patient.vomitingFrequencyToday === 'intractable_gt_10')) {
    flags.push({
      key: 'vomiting_rf_dka_ketosis',
      textTh: 'ผู้ป่วยเบาหวานที่มีอาการคลื่นไส้อาเจียนรุนแรง ปากแห้ง กระหายน้ำมาก ปัสสาวะไม่ออก (Suspected Diabetic Ketoacidosis - DKA)',
      risk: 'เสี่ยงภาวะเลือดเป็นกรดจากคีโตนขั้นวิกฤต (DKA / HHS) ต้องเจาะตรวจ DTX ปลายนิ้วทันที และตรวจ Urine Ketone, Electrolytes, Arterial Blood Gas (ABG)'
    });
  }

  // 6. Intracranial Hypertension / Acute Neurological Deficit
  const isProjectile = patient.vomitingPatternType === 'projectile_vomiting';
  const hasSevereHeadache = neuro.includes('severe_sudden_headache');
  const hasStiffNeck = neuro.includes('stiff_neck');
  const hasFocalDeficit = neuro.includes('focal_weakness_numbness') || neuro.includes('diplopia_blurred_vision');
  const hasAlteredSensorium = neuro.includes('confusion_drowsiness');
  if (isProjectile || hasSevereHeadache || hasStiffNeck || hasFocalDeficit || hasAlteredSensorium) {
    flags.push({
      key: 'vomiting_rf_intracranial_hypertension',
      textTh: isProjectile ? 'อาเจียนพุ่งอย่างรุนแรงทันทีโดยไม่มีอาการคลื่นไส้นำ (Projectile Vomiting / Increased ICP)' : 'มีอาการทางระบบประสาทร่วมด้วย: ปวดศีรษะรุนแรง / คอแข็ง / แขนขาอ่อนแรง / สับสนซึมลง',
      risk: 'เสี่ยงภาวะความดันในกะโหลกศีรษะสูง เลือดออกในสมอง (ICH / SAH) หรือการติดเชื้อในเยื่อหุ้มสมอง (Meningitis) ต้องตรวจ Non-contrast CT Brain ด่วน และประเมินทางเดินหายใจ'
    });
  }

  // 7. Severe Dehydration / Impending Hypovolemic Shock
  const hasAnuria = dehy.includes('oliguria_anuria');
  const hasPosturalCollapse = dehy.includes('postural_dizziness_blackout');
  const hasColdExtremities = dehy.includes('cold_clammy_extremities');
  if (oralIntol && (hasAnuria || hasPosturalCollapse || hasColdExtremities)) {
    flags.push({
      key: 'vomiting_rf_acute_hypovolemic_shock',
      textTh: 'ไม่สามารถดื่มน้ำได้เลย ทานคำไหนพุ่งออกหมด ร่วมกับปัสสาวะไม่ออก หรือหน้ามืดเป็นลมเมื่อลุกยืน (Severe Dehydration / Impending Hypovolemic Shock)',
      risk: 'เสี่ยงภาวะไตวายเฉียบพลันจากขาดสารน้ำ (Prerenal AKI) และเกลือแร่ผิดปกติรุนแรง (Hypokalemia, Metabolic Alkalosis) ต้องเปิดเส้น IV โหลด 0.9% NSS ทันที'
    });
  }

  // 8. Natural Food Toxin Poisoning (Comment #10)
  if (precipitants.includes('natural_toxin_food')) {
    flags.push({
      key: 'vomiting_rf_natural_toxin_ingestion',
      textTh: `ประวัติรับประทานอาหารกลุ่มเสี่ยงสารพิษธรรมชาติ (เห็ด กลอย หน่อไม้ แมงดาถ้วย ปลาปักเป้า ลูกเนียง สบู่ดำ/แดง)${patient.vomitingToxinFoodDetails ? `: [${patient.vomitingToxinFoodDetails}]` : ''}`,
      risk: 'เสี่ยงภาวะได้รับสารพิษชีวภาพรุนแรง ตับวายเฉียบพลัน ไตวาย หรือพิษต่อระบบประสาท (Botulism, Amatoxin, Tetrodotoxin) ต้องปรึกษาศูนย์พิษวิทยา (Rama Poison Center 1367) ด่วน'
    });
  }

  // 9. High-Risk Drug Toxicity / Overdose (Comment #9)
  const isHighRiskMeds = precipitants.includes('high_risk_medications');
  const hasDigoxin = meds.includes('digoxin');
  const hasLithium = meds.includes('lithium_psych');
  const isChemicalToxin = precipitants.includes('suspected_toxin_chemical');
  if (isChemicalToxin || (isHighRiskMeds && (hasDigoxin || hasLithium))) {
    const medDesc = hasDigoxin ? 'ยาโรคหัวใจ Digoxin' : (hasLithium ? 'Lithium' : 'สารเคมี/ยาเกินขนาด');
    flags.push({
      key: 'vomiting_rf_high_risk_drug_toxicity',
      textTh: `ประวัติรับประทานยาความเสี่ยงสูงหรือสารพิษ: ${medDesc} (Suspected Drug Toxicity / Overdose)`,
      risk: 'อาการคลื่นไส้อาเจียนรุนแรงอาจเกิดจากพิษยา (Digitalis toxicity / Lithium toxicity) ต้องเจาะวัดระดับยาในเลือด ตรวจ EKG 12 lead และเฝ้าระวังคลื่นหัวใจเต้นผิดจังหวะ'
    });
  }

  // 10. Ruptured Ectopic Pregnancy / Hyperemesis in Reproductive Age Female
  const isFemaleMissedPeriod = patient.gender === 'หญิง' && (patient.vomiting_lmp_status === 'missed_period' || patient.vomitingPregnancyTestSelf === 'tested_positive');
  if (isFemaleMissedPeriod) {
    flags.push({
      key: 'vomiting_rf_ruptured_ectopic',
      textTh: 'สตรีวัยเจริญพันธุ์ที่ประจำเดือนขาด หรือตรวจพบการตั้งครรภ์ ร่วมกับมีอาการคลื่นไส้อาเจียนรุนแรง (Suspected Ectopic Pregnancy / Hyperemesis Gravidarum)',
      risk: 'ต้องแยกโรคภาวะตั้งครรภ์นอกมดลูกแตก (Ruptured Ectopic Pregnancy) หากมีปวดท้องหรือวูบ และภาวะแพ้ท้องรุนแรงขาดน้ำ (Hyperemesis Gravidarum) ต้องตรวจ Urine Pregnancy Test (UPT) และส่งสูตินรีแพทย์ตรวจอัลตราซาวด์ TVS'
    });
  }

  return flags;
}




    // =========================================================================
    // OUTPUT GENERATION: ซึมลง / สับสนเฉียบพลัน / ระดับความรู้สึกตัวเปลี่ยนแปลง (Altered Mental Status / Delirium / Coma)

    function updateVomitingOutputs(patient) {
      const unitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
      const durationText = patient.durationVal ? `${patient.durationVal} ${unitMap[patient.durationUnit] || 'ชั่วโมง'}` : 'ไม่ระบุ';

      const onsetMap = {
        sudden_severe: 'เกิดขึ้นทันทีทันใด ปุบปับ คลื่นไส้อาเจียนรุนแรงตั้งแต่ครั้งแรก',
        gradual_worsening: 'ค่อยๆ รู้สึกพะอืดพะอม คลื่นไส้ แล้วอาเจียนถี่ขึ้นเรื่อยๆ',
        intermittent_spells: 'เป็นๆ หายๆ มีช่วงที่เว้นว่างแล้วกลับมาอาเจียนเป็นระลอก',
        unspecified: 'ไม่ได้ระบุรูปแบบการเริ่มต้น'
      };

      const freqMap = {
        mild_1_2: '1–2 ครั้ง',
        moderate_3_5: '3–5 ครั้ง',
        severe_6_10: '6–10 ครั้ง',
        intractable_gt_10: 'มากกว่า 10 ครั้งขึ้นไป / ตลอดเวลา (Intractable Vomiting)',
        unspecified: 'ไม่ได้ระบุความถี่'
      };

      const foodRelMap = {
        immediate_postprandial: 'อาเจียนทันทีขณะทานหรือหลังทานเสร็จไม่เกิน 15 นาที',
        delayed_postprandial_hours: 'อาเจียนหลังทานอาหารไปแล้ว 1–3 ชั่วโมง (มีเศษอาหารมื้อก่อนตกค้าง)',
        morning_fasting: 'อาเจียนช่วงตื่นนอนตอนเช้าหรือขณะท้องว่าง',
        independent_constant: 'อาเจียนตลอดเวลา ไม่ว่าจะทานหรือไม่ทานอะไรก็ตาม',
        unspecified: 'ไม่ได้ระบุความสัมพันธ์กับอาหาร'
      };

      const vomitusCharMap = {
        clear_gastric_juice: 'น้ำใส น้ำลาย หรือน้ำย่อยใสๆ',
        food_particles: 'เศษอาหารที่เพิ่งรับประทานเข้าไป',
        undigested_old_food: 'เศษอาหารเก่าที่ทานไปหลายชั่วโมงหรือข้ามวัน (Gastric Outlet Obstruction / Gastroparesis)',
        yellow_green_bile: 'น้ำดีสีเขียวจัด หรือสีเหลืองอมเขียวเข้มข้น (Bile-stained)',
        brown_feculent: 'สีน้ำตาลเข้ม มีกลิ่นเหม็นรุนแรงคล้ายอุจจาระ 🚩 (Feculent Vomiting / Bowel Obstruction)',
        blood_bright_red: 'มีเลือดสีแดงสดปนออกมาอย่างชัดเจน 🚩 (Hematemesis / UGI Bleed)',
        blood_coffee_ground: 'สีกาแฟคั่ว หรือเป็นเม็ดสีกากกาแฟดำๆ 🚩 (Coffee-ground vomitus)',
        unspecified: 'ไม่ได้ระบุลักษณะอาเจียน'
      };

      const patternTypeMap = {
        normal_retching: 'มีอาการพะอืดพะอม โก่งคอ ขย้อน และคลื่นไส้นำมาก่อนอย่างชัดเจน',
        projectile_vomiting: 'อาเจียนพุ่งออกมาอย่างรุนแรงทันที โดยแทบไม่มีอาการคลื่นไส้นำมาก่อนเลย 🚩 (Projectile Vomiting / Increased ICP)',
        unspecified: 'ไม่ได้ระบุลักษณะการพุ่ง'
      };

      const volumeMap = {
        small_sip: 'ปริมาณเล็กน้อย (ไม่เกินครึ่งแก้วน้ำ)',
        moderate_cup: 'ปริมาณปานกลาง (ประมาณ 1 แก้วน้ำ)',
        large_bowl: 'ปริมาณมาก (ทะลักเต็มชามหรือกะละมัง)',
        unspecified: 'ไม่ได้ระบุปริมาณ'
      };

      // Abdominal Pain
      let abdpainDesc = 'ไม่มีอาการปวดท้องร่วมด้วย';
      if (patient.vomitingHasAbdominalPain) {
        const locMap = { epigastrium: 'ใต้ลิ้นปี่', ruq: 'ใต้ชายโครงขวา', rlq: 'ท้องน้อยขวา', llq: 'ท้องน้อยซ้าย', periumbilical: 'รอบสะดือ', diffuse: 'ทั่วท้อง' };
        const charMap = { cramping_colicky: 'ปวดบิดเกร็งเป็นพักๆ', constant_severe: 'ปวดรุนแรงต่อเนื่อง ขยับตัวเจ็บสะเทือนมาก 🚩', dull_aching: 'ปวดตื้อๆ แน่นๆ' };
        const locs = (patient.vomitingAbdpainLocs || []).map(l => locMap[l] || l).join(', ');
        abdpainDesc = `มีอาการปวดท้องร่วมด้วย: ตำแหน่ง [${locs || 'ไม่ระบุ'}] ลักษณะ [${charMap[patient.vomitingAbdpainChar] || patient.vomitingAbdpainChar || 'ไม่ระบุ'}]`;
      }

      // Bowel Habit
      let bowelDesc = 'ขับถ่ายและผายลมได้ตามปกติ';
      if (patient.vomitingBowelHabit === 'diarrhea_active') {
        const stoolMap = { watery: 'น้ำเหลวล้วน', mucus: 'มีมูกปน', bloody: 'มีเลือดสดปน 🚩', dark_tarry: 'สีดำคล้ำ 🚩' };
        const stools = (patient.vomitingDiarrheaStools || []).map(s => stoolMap[s] || s).join(', ');
        bowelDesc = `มีอาการถ่ายเหลว ${patient.vomitingDiarrheaFreq || 0} ครั้ง/วัน ลักษณะ [${stools || 'ไม่ระบุ'}]`;
      } else if (patient.vomitingBowelHabit === 'bloody_melena_stool') {
        const bMap = {
          bright_red_coating: 'เลือดสีแดงสดเคลือบก้อนอุจจาระ',
          pure_bright_red: 'ถ่ายเป็นเลือดสีแดงสดล้วนๆ 🚩',
          dark_clots: 'ถ่ายเป็นลิ่มเลือดสีคล้ำๆ 🚩',
          black_tarry_melena: 'ถ่ายเป็นสีดำเหนียวคล้ายยางมะตอย มีกลิ่นคาวเหม็นรุนแรง 🚩',
          maroon_wash: 'ถ่ายเป็นสีแดงคล้ำคล้ายน้ำล้างเนื้อ 🚩'
        };
        bowelDesc = `ถ่ายอุจจาระมีเลือดปนหรือถ่ายดำ 🚩: ${bMap[patient.vomitingBloodyStoolChar] || patient.vomitingBloodyStoolChar || 'ไม่ระบุ'}`;
      } else if (patient.vomitingBowelHabit === 'constipation_obstipation_gte24h') {
        const cMap = {
          no_stool_no_gas: 'ไม่ถ่าย ไม่ผายลมเลย 🚩 (Complete Obstipation)',
          no_stool_can_pass_gas: 'ไม่ถ่าย แต่ยังผายลมได้ (Partial Obstruction)',
          hard_pellet_stool: 'ถ่ายออกเป็นก้อนเม็ดกระสุน (Fecal Impaction)',
          watery_overflow_scant: 'ถ่ายเหลวเป็นน้ำ ครั้งละไม่มาก (Paradoxical Diarrhea / Overflow)'
        };
        bowelDesc = `ไม่ถ่าย ถ่ายลำบาก หรือท้องผูกนานกว่า 24-48 ชม.: ${cMap[patient.vomitingConstipationSub] || patient.vomitingConstipationSub || 'ไม่ระบุ'}`;
      }

      // Distension & Prior Surgery
      const distMap = { none: 'ท้องไม่อืด ผนังหน้าท้องนิ่มปกติ', mild_bloating: 'แน่นอึดอัดท้องเล็กน้อย', marked_distension_tight: 'ท้องอืดป่อง แน่นตึง แข็งเกร็งอย่างชัดเจน 🚩' };
      const distDesc = distMap[patient.vomitingAbdominalDistension] || 'ไม่ระบุ';
      const surgDesc = patient.vomitingPriorAbdominalSurgery === 'yes' ? 'มีประวัติการผ่าตัดทางช่องท้องมาก่อน 🚩 (เสี่ยงพังผืดลำไส้อุดตัน)' : 'ไม่เคยผ่าตัดช่องท้อง';

      // Cardiac & Neuro
      const cardiacMap = {
        chest_tightness_pressure: 'แน่นหน้าอก เจ็บหน้าอก ร้าวไปกราม/แขนซ้าย 🚩',
        diaphoresis_cold_sweat: 'เหงื่อแตกท่วมตัว เสื้อเปียกชุ่ม ตัวเย็นเฉียบ 🚩',
        syncope_presyncope: 'หน้ามืด วูบ หรือหมดสติชั่วคราว 🚩',
        palpitation_racing_heart: 'หัวใจเต้นเร็วรัวผิดปกติ / เต้นสะดุด 🚩',
        none_cardiac: 'ไม่มีอาการผิดปกติทางหัวใจ'
      };
      const cardiacList = (patient.vomitingCardiacFlags || []).map(k => cardiacMap[k] || k);

      const neuroMap = {
        severe_sudden_headache: 'ปวดศีรษะรุนแรงมากผิดปกติ / ปวดฟ้าผ่า 🚩',
        stiff_neck: 'คอแข็งเกร็ง ก้มคอไม่ลง 🚩',
        focal_weakness_numbness: 'แขนขาอ่อนแรงครึ่งซีก / ปากเบี้ยว / ชาครึ่งซีก 🚩',
        diplopia_blurred_vision: 'มองเห็นภาพซ้อน / ตาพร่ามัวเฉียบพลัน 🚩',
        vertigo_ataxia: 'เวียนศีรษะบ้านหมุนรุนแรง / เดินเซ ทรงตัวไม่ได้ 🚩',
        confusion_drowsiness: 'ซึมลง สับสน ถามตอบไม่รู้เรื่อง / ปลุกตื่นยาก 🚩',
        none_neuro: 'ไม่มีอาการทางระบบประสาท'
      };
      const neuroList = (patient.vomitingNeuroFlags || []).map(k => neuroMap[k] || k);

      // Hydration
      const oralDesc = patient.vomitingOralIntolerance === 'intolerant_vomit_all'
        ? 'ไม่สามารถดื่มน้ำหรือทานอะไรได้เลย ทานคำไหนพุ่งออกหมดทันที 🚩 (Intolerant to Oral Intake / Severe Dehydration Risk)'
        : 'จิบน้ำหรือเกลือแร่ได้บ้าง ไม่อาเจียนออกมาทั้งหมด';

      const dehyMap = {
        oliguria_anuria: 'ปัสสาวะออกน้อยมาก สีเข้มจัด หรือไม่ปัสสาวะเลยเกิน 8 ชม. 🚩',
        marked_dry_mouth_thirst: 'ปากแห้ง ลิ้นแห้งแตก กระหายน้ำมาก',
        postural_dizziness_blackout: 'ลุกขึ้นยืนแล้วหน้ามืด เซ ตาพร่า วูบ ต้องนอนราบตลอดเวลา 🚩',
        cold_clammy_extremities: 'ปลายมือปลายเท้าเย็นเฉียบ ชีพจรเร็วเบา 🚩',
        none_dehydration: 'ไม่มีสัญญาณขาดน้ำรุนแรง'
      };
      const dehyList = (patient.vomitingDehydrationSigns || []).map(k => dehyMap[k] || k);

      // Precipitants & Meds
      const precipMap = {
        known_diabetes: 'ผู้ป่วยโรคเบาหวาน (เสี่ยง DKA / Gastroparesis) 🚩',
        high_risk_medications: 'รับประทานยากลุ่มความเสี่ยงสูง 🚩',
        natural_toxin_food: 'เพิ่งรับประทานอาหารกลุ่มเสี่ยงสารพิษธรรมชาติ (เห็ด กลอย หน่อไม้ แมงดาถ้วย ปลาปักเป้า ลูกเนียง สบู่ดำ/แดง) 🚩',
        heavy_alcohol_or_withdrawal: 'ดื่มสุราหนัก หรือเพิ่งหยุดดื่มสุรากะทันหัน',
        suspected_toxin_chemical: 'สงสัยกินยาเกินขนาด สารเคมีเกษตร หรือสารพิษ 🚩',
        general_food_poisoning: 'รับประทานอาหารร่วมกับผู้อื่นแล้วมีอาการคล้ายกัน / อาหารค้างคืน',
        none_precipitants: 'ปฏิเสธประวัติเสี่ยงข้างต้น'
      };
      let precipList = (patient.vomitingPrecipitants || []).map(k => precipMap[k] || k);
      if (patient.vomitingPrecipitants?.includes('high_risk_medications')) {
        const medMap = { digoxin: 'Digoxin (ยาหัวใจ) 🚩', nsaids: 'NSAIDs (ยาแก้ปวดข้อ)', herbal_bolus: 'ยาลูกกลอน/ยาหม้อ', chemotherapy: 'เคมีบำบัด', antibiotics: 'ยาปฏิชีวนะ', lithium_psych: 'Lithium (จิตเวช) 🚩' };
        const meds = (patient.vomitingMedList || []).map(m => medMap[m] || m).join(', ');
        precipList = precipList.map(p => p.includes('รับประทานยากลุ่มความเสี่ยงสูง') ? `รับประทานยากลุ่มเสี่ยง: [${meds || 'ไม่ระบุ'}]` : p);
      }
      if (patient.vomitingPrecipitants?.includes('natural_toxin_food')) {
        const toxParts = [];
        if (patient.vomitingToxinFoodType) toxParts.push(`ชนิด: ${patient.vomitingToxinFoodType}`);
        if (patient.vomitingToxinFoodTime) toxParts.push(`เวลา: ${patient.vomitingToxinFoodTime}`);
        if (patient.vomitingToxinFoodPlace) toxParts.push(`สถานที่: ${patient.vomitingToxinFoodPlace}`);
        if (patient.vomitingToxinFoodCoEaters) toxParts.push(`ผู้ร่วมทาน: ${patient.vomitingToxinFoodCoEaters}`);
        if (toxParts.length > 0) {
          precipList.push(`รายละเอียดอาหารเสี่ยงสารพิษ: [${toxParts.join(' | ')}]`);
        }
      }
      if (patient.vomitingPrecipitants?.includes('suspected_toxin_chemical') && patient.vomitingChemicalDetails) {
        precipList.push(`รายละเอียดสารเคมี/ยาเกินขนาด: [${patient.vomitingChemicalDetails}]`);
      }

      // Female LMP
      let lmpText = 'ไม่เกี่ยวข้อง (ผู้ป่วยชาย หรือพ้นวัยเจริญพันธุ์)';
      if (patient.gender === 'หญิง' || patient.vomiting_lmp_status) {
        const lmpStatusMap = {
          regular_lmp_exact: `จำวันแรกของรอบเดือนล่าสุดได้แน่นอน: ${formatDateDdMmYyyy(patient.vomitingLmpDate) || 'ไม่ได้ระบุวันที่'}`,
          approx_recent: 'จำได้คร่าวๆ (ประมาณ 1–4 สัปดาห์ก่อน)',
          missed_period: 'ประจำเดือนขาดหายไปอย่างน้อย 1 รอบ 🚩 (เสี่ยงตั้งครรภ์/Ectopic)',
          post_menopausal_or_hysterectomy: 'หมดประจำเดือนแล้ว หรือผ่าตัดมดลูก/รังไข่แล้ว',
          not_applicable_child: 'ยังไม่เคยมีประจำเดือน'
        };
        const pregTestMap = {
          not_tested: 'ยังไม่ได้ตรวจการตั้งครรภ์',
          tested_negative: 'ตรวจปัสสาวะทดสอบการตั้งครรภ์แล้ว ได้ผลลบ (1 ขีด)',
          tested_positive: 'ตรวจปัสสาวะทดสอบการตั้งครรภ์แล้ว ได้ผลบวก (2 ขีด / ตั้งครรภ์) 🚩'
        };
        lmpText = `${lmpStatusMap[patient.vomiting_lmp_status] || 'ไม่ได้ระบุ'} | การตรวจการตั้งครรภ์ด้วยตนเอง: ${pregTestMap[patient.vomitingPregnancyTestSelf] || 'ยังไม่ได้ตรวจ'}`;
      }

      const hospLabel = {
        complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
        additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
        self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
        unspecified: 'ไม่ได้ระบุ'
      }[patient.hospRecordStatus] || 'ไม่ได้ระบุ';

      const redFlags = detectVomitingRedFlags(patient);
      patient.redFlags = redFlags;

      const positives = [];
      const negatives = [];
      if (patient.vomitingHasAbdominalPain) {
        // Already in top HPI
      } else {
        negatives.push('ไม่มีอาการปวดท้องร่วมด้วย');
      }
      if (patient.vomitingAbdominalDistension && patient.vomitingAbdominalDistension !== 'none' && distMap[patient.vomitingAbdominalDistension]) {
        positives.push(distMap[patient.vomitingAbdominalDistension]);
      }
      if (patient.vomitingBowelHabit && patient.vomitingBowelHabit !== 'normal_bowel') positives.push(bowelDesc);
      else negatives.push('ขับถ่ายอุจจาระและผายลมปกติ');

      const cardiacPos = (patient.vomitingCardiacFlags || []).filter(k => k !== 'none_cardiac').map(k => cardiacMap[k] || k);
      if (cardiacPos.length > 0) cardiacPos.forEach(c => positives.push(c));
      else negatives.push('ปฏิเสธอาการเจ็บแน่นหน้าอก เหงื่อแตกตัวเย็น หรือวูบ');

      const neuroPos = (patient.vomitingNeuroFlags || []).filter(k => k !== 'none_neuro').map(k => neuroMap[k] || k);
      if (neuroPos.length > 0) neuroPos.forEach(n => positives.push(n));
      else negatives.push('ปฏิเสธอาการปวดศีรษะรุนแรง คอแข็ง หรือแขนขาอ่อนแรง');

      const dehyPos = (patient.vomitingDehydrationSigns || []).filter(k => k !== 'none_dehydration').map(k => dehyMap[k] || k);
      if (dehyPos.length > 0) dehyPos.forEach(d => positives.push(d));
      else negatives.push('ไม่มีสัญญาณขาดน้ำรุนแรง');

      const precipPos = precipList.filter(pr => pr && !pr.includes('ปฏิเสธประวัติเสี่ยง'));
      if (precipPos.length > 0) precipPos.forEach(pr => positives.push(pr));

      if (patient.vomitingAdditionalNotes) positives.push(patient.vomitingAdditionalNotes);
      if (patient.otherSymptomsFree && patient.otherSymptomsFree !== patient.vomitingAdditionalNotes) {
        positives.push(patient.otherSymptomsFree);
      }
      const rapidPositives = positives;

      patient.pertinentPositives = rapidPositives.length > 0 ? rapidPositives : ['ไม่มีอาการร่วมผิดปกติ'];
      patient.pertinentNegatives = negatives;

      const docNotes = patient.doctor_notes || {};
      const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ' || patient.currentMeds === 'ไม่มี') ? 'ไม่มี' : patient.currentMeds;

      // A) Rapid Bullet Format
      const defaultRapid =
`[Chief Complaint (CC)]
คลื่นไส้ / อาเจียนรุนแรง (Nausea & Severe Vomiting) มา ${durationText}

[History of Present Illness (HPI)]
• ลักษณะของสิ่งที่อาเจียน: ${vomitusCharMap[patient.vomitusCharacter] || 'ไม่ระบุ'}
• การเริ่มต้นและความถี่: ${onsetMap[patient.vomitingOnsetMode] || 'ไม่ระบุ'}, ความถี่วันนี้: ${freqMap[patient.vomitingFrequencyToday] || 'ไม่ระบุ'}
• ลักษณะการพุ่งและปริมาณ: ${patternTypeMap[patient.vomitingPatternType] || 'ไม่ระบุ'}, ปริมาณ: ${volumeMap[patient.vomitusVolumePerTime] || 'ไม่ระบุ'}
• ความสัมพันธ์กับอาหาร: ${foodRelMap[patient.vomitingFoodRelation] || 'ไม่ระบุ'}
• การรับประทานอาหารและน้ำ: ${oralDesc}
${patient.vomitingHasAbdominalPain ? `• อาการปวดท้อง: ${abdpainDesc}\n` : ''}
• Pertinent Positives:
${rapidPositives.length > 0 ? rapidPositives.map(p => `  - ${p}`).join('\n') : '  - ไม่มีอาการร่วมอื่นที่เด่นชัด'}

• Pertinent Negatives:
${negatives.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• ประวัติการผ่าตัดช่องท้อง: ${surgDesc}
• โรคประจำตัว (U/D): ${(patient.underlying && patient.underlying.length > 0) ? patient.underlying.join(', ') : 'ปฏิเสธ'}
• ยาประจำตัว (Current Meds): ${medsText}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${patient.drugAllergy || 'ปฏิเสธ'}

[Emergency Risk Assessment (Red Flags)]
${redFlags.length > 0
  ? `🚩 RED FLAGS DETECTED:\n${redFlags.map(rf => `  * ${rf.textTh}\n    ความเสี่ยง: ${rf.risk}`).join('\n')}`
  : '✓ ไม่พบสัญญาณวิกฤต (No Immediate Red Flag)'}

[Doctor's Clinical Addendum & Exam]
• ประวัติเพิ่มเติม/แก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}
• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}
• แผนการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

      // B) Narrative Note Format
      const defaultNarrative =
`ผู้ป่วย${patient.gender || ''} อายุ ${patient.age || 'ไม่ระบุ'} ปี มาด้วยอาการสำคัญ คลื่นไส้ / อาเจียนรุนแรง เป็นมาประมาณ ${durationText}
ประวัติการเจ็บป่วยปัจจุบัน: ผู้ป่วยมีอาการ${onsetMap[patient.vomitingOnsetMode] || 'ไม่ระบุ'} โดยในวันนี้มีอาการอาเจียนประมาณ ${freqMap[patient.vomitingFrequencyToday] || 'ไม่ระบุ'} มีความสัมพันธ์กับการรับประทานอาหารคือ ${foodRelMap[patient.vomitingFoodRelation] || 'ไม่ระบุ'} สิ่งที่อาเจียนออกมามีลักษณะเด่นคือ [${vomitusCharMap[patient.vomitusCharacter] || 'ไม่ระบุ'}] โดยมีรูปแบบการอาเจียนเป็น [${patternTypeMap[patient.vomitingPatternType] || 'ไม่ระบุ'}] ปริมาณต่อครั้งประมาณ [${volumeMap[patient.vomitusVolumePerTime] || 'ไม่ระบุ'}] ด้านความสามารถในการรับประทานพบว่า [${oralDesc}]

การประเมินอาการทางช่องท้อง: ${abdpainDesc} การขับถ่ายพบว่า ${bowelDesc} หน้าท้องตรวจพบ [${distDesc}] และ ${surgDesc}

การทบทวนสัญญาณอันตรายนอกระบบทางเดินอาหาร:
- ระบบหัวใจและไหลเวียนโลหิต: ${cardiacList.length > 0 ? cardiacList.join(', ') : 'ปฏิเสธอาการเจ็บแน่นหน้าอก เหงื่อแตกตัวเย็น วูบหมดสติ'}
- ระบบประสาทและสมอง: ${neuroList.length > 0 ? neuroList.join(', ') : 'ปฏิเสธอาการปวดศีรษะรุนแรง คอแข็ง หรือแขนขาอ่อนแรง'}
- การประเมินภาวะขาดน้ำ: ${dehyList.length > 0 ? dehyList.join(', ') : 'ไม่พบสัญญาณขาดน้ำรุนแรง'}
${patient.gender === 'หญิง' || patient.vomiting_lmp_status ? `ข้อมูลทางนรีเวช (LMP): [${lmpText}]\n` : ''}ประวัติการใช้ยา สิ่งกระตุ้น และสารพิษ: ${precipList.length > 0 ? precipList.join(', ') : 'ปฏิเสธประวัติเสี่ยง'}${patient.vomitingAdditionalNotes ? ` (ข้อสังเกตเพิ่มเติม: ${patient.vomitingAdditionalNotes})` : ''}

ประวัติอดีตและยาประจำตัว: สถานะประวัติ [${hospLabel}], โรคประจำตัว: ${(patient.underlying && patient.underlying.length > 0) ? patient.underlying.join(', ') : 'ปฏิเสธโรคประจำตัว'}, ยาประจำตัว: ${medsText}, ประวัติแพ้ยา/แพ้อาหาร: ${patient.drugAllergy || 'ปฏิเสธ'}
${redFlags.length > 0 ? `\n[🚩 สัญญาณเตือนภาวะวิกฤต]: ${redFlags.map(rf => rf.textTh).join(', ')}` : ''}

[บันทึกการตรวจและการประเมินโดยแพทย์]:
${docNotes.additional_hpi ? `• ประวัติเพิ่มเติม: ${docNotes.additional_hpi}\n` : ''}${docNotes.physical_exam ? `• การตรวจร่างกาย: ${docNotes.physical_exam}\n` : ''}${docNotes.preliminary_dx ? `• การวินิจฉัย: ${docNotes.preliminary_dx}\n` : ''}${docNotes.plan ? `• แผนการรักษา: ${docNotes.plan}` : ''}`;
      const jsonPayload = {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "encounter": {
          "hospital_site": "Ratchaburi Hospital",
          "queue_id": patient.queue_number || "",
          "hn": patient.hn || "",
          "patient_name": patient.name || "",
          "age": patient.age || 0,
          "gender": patient.gender || "",
          "timestamp": patient.timestamp || "",
          "status": patient.status || "waiting",
          "triage_urgency_flag": redFlags.length > 0,
          "red_flags_count": redFlags.length,
          "hospital_record_status": patient.hospRecordStatus || "unspecified"
        },
        "patient_identification": {
          "name": patient.name || "",
          "age": patient.age || 0,
          "gender": patient.gender || "",
          "hn": patient.hn || "",
          "queue_number": patient.queue_number || ""
        },
        "chief_complaint": "vomiting",
        "chief_complaint_label": "คลื่นไส้ / อาเจียนรุนแรง",
        "schema_version": "2.0",
        "vomiting_profile": {
          "duration": {
            "value": patient.durationVal || null,
            "unit": patient.durationUnit || "hours"
          },
          "onset_mode": patient.vomitingOnsetMode || null,
          "frequency_today": patient.vomitingFrequencyToday || null,
          "food_relation": patient.vomitingFoodRelation || null,
          "vomitus_character": patient.vomitusCharacter || null,
          "vomiting_pattern_type": patient.vomitingPatternType || null,
          "vomitus_volume_per_time": patient.vomitusVolumePerTime || null,
          "oral_tolerance": patient.vomitingOralIntolerance || null,
          "abdominal_symptoms": {
            "has_abdominal_pain": Boolean(patient.vomitingHasAbdominalPain),
            "pain_locations": patient.vomitingAbdpainLocs || [],
            "pain_character": patient.vomitingAbdpainChar || null,
            "bowel_habit": patient.vomitingBowelHabit || null,
            "diarrhea_frequency": patient.vomitingDiarrheaFreq || 0,
            "diarrhea_stool_characters": patient.vomitingDiarrheaStools || [],
            "bloody_stool_character": patient.vomitingBloodyStoolChar || null,
            "constipation_sub_type": patient.vomitingConstipationSub || null,
            "abdominal_distension": patient.vomitingAbdominalDistension || null,
            "prior_abdominal_surgery": patient.vomitingPriorAbdominalSurgery === 'yes'
          },
          "extra_abdominal_flags": {
            "cardiac_flags": patient.vomitingCardiacFlags || [],
            "neuro_flags": patient.vomitingNeuroFlags || [],
            "dehydration_signs": patient.vomitingDehydrationSigns || []
          },
          "precipitants_and_toxic": {
            "precipitants": patient.vomitingPrecipitants || [],
            "high_risk_med_list": patient.vomitingMedList || [],
            "natural_toxin_food": {
              "type": patient.vomitingToxinFoodType || "",
              "time": patient.vomitingToxinFoodTime || "",
              "place": patient.vomitingToxinFoodPlace || "",
              "co_eaters": patient.vomitingToxinFoodCoEaters || "",
              "summary": patient.vomitingToxinFoodDetails || ""
            },
            "suspected_chemical_overdose": patient.vomitingChemicalDetails || ""
          },
          "female_reproductive_history": patient.gender === 'หญิง' || patient.vomiting_lmp_status ? {
            "lmp_status": patient.vomiting_lmp_status || null,
            "lmp_date": formatDateDdMmYyyy(patient.vomitingLmpDate) || null,
            "pregnancy_test_self": patient.vomitingPregnancyTestSelf || null
          } : null,
          "informant_additional_notes": patient.vomitingAdditionalNotes || "",
          "other_symptoms_free": patient.otherSymptomsFree || ""
        },
        "pertinent_positives": positives,
        "pertinent_negatives": negatives,
        "red_flags": redFlags,
        "past_medical_history": {
          "hospital_record_status": hospLabel,
          "underlying_diseases": patient.underlying || [],
          "drug_allergies": patient.drugAllergy || "ปฏิเสธ",
          "current_medications": patient.currentMeds || "ไม่มี"
        },
        "doctor_notes": {
          "history": docNotes.additional_hpi || "",
          "vitals_and_physical_exam": docNotes.physical_exam || "",
          "provisional_diagnosis": docNotes.preliminary_dx || "",
          "treatment_plan": docNotes.plan || ""
        }
      };

      // Set Doctor Dashboard views
      const rapidView = document.getElementById('rapidTextView');
      const narrativeView = document.getElementById('narrativeTextView');
      const jsonView = document.getElementById('jsonViewer');

      if (rapidView) rapidView.value = patient.custom_rapid_note || defaultRapid;
      if (narrativeView) narrativeView.value = patient.custom_narrative_note || defaultNarrative;
      if (jsonView) jsonView.textContent = JSON.stringify(jsonPayload, null, 2);
    }

registerCcModule({
  id: 'vomiting',
  recordCc: 'vomiting',
  titleTh: 'คลื่นไส้ / อาเจียนรุนแรง',
  titleEn: 'Nausea & Severe Vomiting',
  sectionDomId: 'vomitingQuestionnaireSection',
  doctorCcBadgeHtml: "<i data-lucide=\"frown\" class=\"w-3 h-3 mr-1\"></i> CC: คลื่นไส้ / อาเจียนรุนแรง (Nausea & Severe Vomiting)",
  formHtml: "        <div id=\"vomitingQuestionnaireSection\" class=\"hidden space-y-6\">\n\n          <!-- Triage Advisory Banner (แจ้งเตือน GI Bleed) -->\n          <div class=\"p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-3 shadow-sm\">\n            <i data-lucide=\"alert-triangle\" class=\"w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5\"></i>\n            <div class=\"text-xs text-amber-800 leading-relaxed\">\n              <span class=\"font-bold text-amber-900 block mb-0.5\">คำแนะนำจากจุดคัดกรองฉุกเฉิน:</span>\n              หากท่านมีอาการ <span class=\"font-bold underline text-slate-800\">อาเจียนเป็นเลือดสีแดงสด</span> หรือ <span class=\"font-bold underline text-slate-800\">อาเจียนเป็นสีกาแฟคั่ว/สีดำ</span> เป็นอาการเด่น โปรดแจ้งพยาบาลคัดกรองทันที หรือเลือกอาการสำคัญ \n              <button type=\"button\" onclick=\"showToast('💡 สำหรับอาการอาเจียนเป็นเลือดสดหรือถ่ายดำ ระบบกำลังอยู่ในคิวพัฒนาถัดไป — ท่านสามารถระบุในหัวข้อที่ 2 (มีเลือดแดงสด/สีกาแฟคั่ว) และหัวข้อที่ 3 (ถ่ายดำ/ถ่ายเป็นเลือด) ในแบบฟอร์มนี้ได้เลยครับ');\" class=\"underline font-bold text-amber-950 hover:text-amber-800\">&lt;อาเจียนเป็นเลือด / ถ่ายดำ / ถ่ายเป็นเลือดสด&gt;</button>\n            </div>\n          </div>\n\n          <!-- CARD 1: ข้อมูลระยะเวลา ความถี่ และความสัมพันธ์กับอาหาร -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-5 border-b border-slate-100 pb-3\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"clock\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-900\">1. ระยะเวลา ความถี่ และความสัมพันธ์กับการรับประทานอาหาร (Onset & Frequency)</h2>\n                <p class=\"text-xs text-slate-500\">ประเมินระยะเวลาของการอาเจียนและระดับความรุนแรงในรอบวัน</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4\">\n              <!-- ระยะเวลาที่เป็นมา -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 mb-1.5\">เริ่มมีอาการคลื่นไส้อาเจียนมานานเท่าไรแล้ว?</label>\n                <div class=\"flex items-center space-x-2 max-w-xs\">\n                  <input type=\"number\" id=\"vomitingDurationVal\" min=\"1\" max=\"999\" placeholder=\"เช่น 6\" class=\"w-24 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 font-semibold focus:ring-2 focus:ring-medical-500\">\n                  <select id=\"vomitingDurationUnit\" class=\"bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-medical-500\">\n                    <option value=\"minutes\">นาที</option>\n                    <option value=\"hours\" selected>ชั่วโมง</option>\n                    <option value=\"days\">วัน</option>\n                    <option value=\"weeks\">สัปดาห์</option>\n                    <option value=\"months\">เดือน</option>\n                    <option value=\"years\">ปี</option>\n                  </select>\n                </div>\n              </div>\n\n              <!-- รูปแบบการเริ่มต้น -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 mb-1.5\">รูปแบบการเริ่มต้นของอาการ</label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2\">\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitingOnsetMode\" value=\"sudden_severe\" class=\"text-medical-600 mt-0.5\">\n                    <span class=\"ml-2.5 text-xs text-slate-800 font-medium\">เกิดขึ้นทันทีทันใด ปุบปับ คลื่นไส้อาเจียนรุนแรงตั้งแต่ครั้งแรก</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitingOnsetMode\" value=\"gradual_worsening\" class=\"text-medical-600 mt-0.5\">\n                    <span class=\"ml-2.5 text-xs text-slate-800 font-medium\">ค่อยๆ รู้สึกพะอืดพะอม คลื่นไส้ แล้วอาเจียนถี่ขึ้นเรื่อยๆ</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitingOnsetMode\" value=\"intermittent_spells\" class=\"text-medical-600 mt-0.5\">\n                    <span class=\"ml-2.5 text-xs text-slate-800 font-medium\">เป็นๆ หายๆ มีช่วงที่เว้นว่างแล้วกลับมาอาเจียนเป็นระลอก</span>\n                  </label>\n                </div>\n              </div>\n\n              <!-- ความถี่ของการอาเจียนในวันนี้ -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 mb-1.5\">ความถี่ของการอาเจียนในวันนี้</label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-4 gap-2\">\n                  <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitingFrequencyToday\" value=\"mild_1_2\" class=\"text-medical-600\">\n                    <span class=\"ml-2.5 text-xs text-slate-800\">1–2 ครั้ง</span>\n                  </label>\n                  <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitingFrequencyToday\" value=\"moderate_3_5\" class=\"text-medical-600\">\n                    <span class=\"ml-2.5 text-xs text-slate-800\">3–5 ครั้ง</span>\n                  </label>\n                  <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitingFrequencyToday\" value=\"severe_6_10\" class=\"text-medical-600\">\n                    <span class=\"ml-2.5 text-xs text-slate-800\">6–10 ครั้ง</span>\n                  </label>\n                  <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitingFrequencyToday\" value=\"intractable_gt_10\" class=\"text-medical-600\">\n                    <span class=\"ml-2.5 text-xs text-slate-800 font-medium\">มากกว่า 10 ครั้งขึ้นไป / ตลอดเวลา</span>\n                  </label>\n                </div>\n              </div>\n\n              <!-- ความสัมพันธ์กับอาหาร -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 mb-1.5\">ความสัมพันธ์กับการรับประทานอาหารหรือน้ำ</label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2\">\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitingFoodRelation\" value=\"immediate_postprandial\" class=\"text-medical-600 mt-0.5\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"block text-xs font-medium text-slate-800\">อาเจียนทันทีขณะทานหรือหลังทานเสร็จไม่เกิน 15 นาที</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitingFoodRelation\" value=\"delayed_postprandial_hours\" class=\"text-medical-600 mt-0.5\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"block text-xs font-medium text-slate-800\">อาเจียนหลังทานอาหารไปแล้ว 1–3 ชั่วโมง (มีเศษอาหารมื้อก่อนตกค้าง)</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitingFoodRelation\" value=\"morning_fasting\" class=\"text-medical-600 mt-0.5\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"block text-xs font-medium text-slate-800\">อาเจียนช่วงตื่นนอนตอนเช้าหรือขณะท้องว่าง</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitingFoodRelation\" value=\"independent_constant\" class=\"text-medical-600 mt-0.5\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"block text-xs font-medium text-slate-800\">อาเจียนตลอดเวลา ไม่ว่าจะทานหรือไม่ทานอะไรก็ตาม</span>\n                    </div>\n                  </label>\n                </div>\n              </div>\n            </div>\n          </div>\n\n          <!-- CARD 2: ลักษณะของสิ่งที่อาเจียนออกมา -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-5 border-b border-slate-100 pb-3\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"activity\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-900\">2. ลักษณะของสิ่งที่อาเจียนออกมา (Vomitus Characteristics)</h2>\n                <p class=\"text-xs text-slate-500\">ระบุลักษณะของอาเจียนเพื่อช่วยแยกโรคทางเดินอาหารและภาวะวิกฤต</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4\">\n              <!-- ลักษณะหลัก -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 mb-1.5\">ลักษณะหลักของสิ่งที่อาเจียนออกมา (เลือกข้อที่ตรงที่สุด)</label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2\">\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitusCharacter\" value=\"clear_gastric_juice\" class=\"text-medical-600 mt-0.5\">\n                    <span class=\"ml-2.5 text-xs text-slate-800\">น้ำใส น้ำลาย หรือน้ำย่อยใสๆ</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitusCharacter\" value=\"food_particles\" class=\"text-medical-600 mt-0.5\">\n                    <span class=\"ml-2.5 text-xs text-slate-800\">เศษอาหารที่เพิ่งรับประทานเข้าไป</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitusCharacter\" value=\"undigested_old_food\" class=\"text-medical-600 mt-0.5\">\n                    <span class=\"ml-2.5 text-xs text-slate-800\">เศษอาหารเก่าที่ทานไปหลายชั่วโมงหรือข้ามวัน</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitusCharacter\" value=\"yellow_green_bile\" class=\"text-medical-600 mt-0.5\">\n                    <span class=\"ml-2.5 text-xs text-slate-800 font-medium\">น้ำดีสีเขียวจัด หรือสีเหลืองอมเขียวเข้มข้น</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitusCharacter\" value=\"brown_feculent\" class=\"text-medical-600 mt-0.5\">\n                    <span class=\"ml-2.5 text-xs text-slate-800 font-medium\">สีน้ำตาลเข้ม มีกลิ่นเหม็นรุนแรงคล้ายอุจจาระ</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitusCharacter\" value=\"blood_bright_red\" class=\"text-medical-600 mt-0.5\">\n                    <span class=\"ml-2.5 text-xs text-slate-800 font-semibold text-slate-800\">มีเลือดสีแดงสดปนออกมาอย่างชัดเจน</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer sm:col-span-2\">\n                    <input type=\"radio\" name=\"vomitusCharacter\" value=\"blood_coffee_ground\" class=\"text-medical-600 mt-0.5\">\n                    <span class=\"ml-2.5 text-xs text-slate-800 font-semibold text-slate-800\">สีกาแฟคั่ว หรือเป็นเม็ดสีกากกาแฟดำๆ</span>\n                  </label>\n                </div>\n              </div>\n\n              <!-- ลักษณะการพุ่ง -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 mb-1.5\">ลักษณะการพุ่งของการอาเจียน</label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2\">\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitingPatternType\" value=\"normal_retching\" class=\"text-medical-600 mt-0.5\">\n                    <span class=\"ml-2.5 text-xs text-slate-800\">มีอาการพะอืดพะอม โก่งคอ ขย้อน และคลื่นไส้นำมาก่อนอย่างชัดเจน</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitingPatternType\" value=\"projectile_vomiting\" class=\"text-medical-600 mt-0.5\">\n                    <span class=\"ml-2.5 text-xs text-slate-800 font-medium\">อาเจียนพุ่งออกมาอย่างรุนแรงทันที โดยแทบไม่มีอาการคลื่นไส้นำมาก่อนเลย</span>\n                  </label>\n                </div>\n              </div>\n\n              <!-- ปริมาณ -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 mb-1.5\">การประเมินปริมาณสิ่งที่อาเจียนต่อครั้ง</label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2\">\n                  <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitusVolumePerTime\" value=\"small_sip\" class=\"text-medical-600\">\n                    <span class=\"ml-2.5 text-xs text-slate-800\">ปริมาณเล็กน้อย (ไม่เกินครึ่งแก้วน้ำ)</span>\n                  </label>\n                  <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitusVolumePerTime\" value=\"moderate_cup\" class=\"text-medical-600\">\n                    <span class=\"ml-2.5 text-xs text-slate-800\">ปริมาณปานกลาง (ประมาณ 1 แก้วน้ำ)</span>\n                  </label>\n                  <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitusVolumePerTime\" value=\"large_bowl\" class=\"text-medical-600\">\n                    <span class=\"ml-2.5 text-xs text-slate-800 font-medium\">ปริมาณมาก (ทะลักเต็มชามหรือกะละมัง)</span>\n                  </label>\n                </div>\n              </div>\n            </div>\n          </div>\n\n          <!-- CARD 3: อาการร่วมทางช่องท้องและระบบทางเดินอาหาร -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-5 border-b border-slate-100 pb-3\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"utensils\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-900\">3. อาการร่วมทางช่องท้องและระบบทางเดินอาหาร (Abdominal & GI Symptoms)</h2>\n                <p class=\"text-xs text-slate-500\">คัดกรองภาวะฉุกเฉินทางศัลยกรรมช่องท้อง ภาวะลำไส้อุดตัน และการขับถ่าย</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4\">\n              <!-- ปวดท้องร่วมด้วย -->\n              <div class=\"p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-3\">\n                <label class=\"flex items-center cursor-pointer\">\n                  <input type=\"checkbox\" id=\"vomitingHasAbdominalPain\" onchange=\"handleVomitingAbdpainToggle(this)\" class=\"text-medical-600 rounded\">\n                  <span class=\"ml-2.5 text-xs font-bold text-slate-800\">มีอาการปวดท้องร่วมด้วย</span>\n                </label>\n\n                <div id=\"vomitingAbdpainWrap\" class=\"hidden pl-6 border-l-2 border-medical-500 space-y-3 pt-1\">\n                  <div>\n                    <label class=\"block text-[11px] font-semibold text-slate-700 mb-1\">ตำแหน่งที่ปวดท้องหลัก (เลือกได้หลายตำแหน่ง):</label>\n                    <div class=\"grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs\">\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg cursor-pointer\">\n                        <input type=\"checkbox\" name=\"vomitingAbdpainLocs\" value=\"epigastrium\" class=\"text-medical-600 rounded\">\n                        <span class=\"ml-2 text-slate-800\">ใต้ลิ้นปี่</span>\n                      </label>\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg cursor-pointer\">\n                        <input type=\"checkbox\" name=\"vomitingAbdpainLocs\" value=\"ruq\" class=\"text-medical-600 rounded\">\n                        <span class=\"ml-2 text-slate-800\">ใต้ชายโครงขวา</span>\n                      </label>\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg cursor-pointer\">\n                        <input type=\"checkbox\" name=\"vomitingAbdpainLocs\" value=\"periumbilical\" class=\"text-medical-600 rounded\">\n                        <span class=\"ml-2 text-slate-800\">รอบสะดือ</span>\n                      </label>\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg cursor-pointer\">\n                        <input type=\"checkbox\" name=\"vomitingAbdpainLocs\" value=\"rlq\" class=\"text-medical-600 rounded\">\n                        <span class=\"ml-2 text-slate-800\">ท้องน้อยขวา</span>\n                      </label>\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg cursor-pointer\">\n                        <input type=\"checkbox\" name=\"vomitingAbdpainLocs\" value=\"llq\" class=\"text-medical-600 rounded\">\n                        <span class=\"ml-2 text-slate-800\">ท้องน้อยซ้าย</span>\n                      </label>\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg cursor-pointer\">\n                        <input type=\"checkbox\" name=\"vomitingAbdpainLocs\" value=\"diffuse\" class=\"text-medical-600 rounded\">\n                        <span class=\"ml-2 text-slate-800\">ปวดทั่วท้องทั้งหมด</span>\n                      </label>\n                    </div>\n                  </div>\n\n                  <div>\n                    <label class=\"block text-[11px] font-semibold text-slate-700 mb-1\">ลักษณะอาการปวดท้อง:</label>\n                    <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-xs\">\n                      <label class=\"selectable-card flex items-start p-2 rounded-lg cursor-pointer\">\n                        <input type=\"radio\" name=\"vomitingAbdpainChar\" value=\"cramping_colicky\" class=\"text-medical-600 mt-0.5\">\n                        <span class=\"ml-2 text-slate-800\">ปวดบิดเกร็งเป็นพักๆ เดี๋ยวบีบเดี๋ยวคลาย</span>\n                      </label>\n                      <label class=\"selectable-card flex items-start p-2 rounded-lg cursor-pointer\">\n                        <input type=\"radio\" name=\"vomitingAbdpainChar\" value=\"constant_severe\" class=\"text-medical-600 mt-0.5\">\n                        <span class=\"ml-2 text-slate-800\">ปวดรุนแรงต่อเนื่อง ขยับตัวแล้วสะเทือนเจ็บมาก</span>\n                      </label>\n                      <label class=\"selectable-card flex items-start p-2 rounded-lg cursor-pointer\">\n                        <input type=\"radio\" name=\"vomitingAbdpainChar\" value=\"dull_aching\" class=\"text-medical-600 mt-0.5\">\n                        <span class=\"ml-2 text-slate-800\">ปวดตื้อๆ แน่นๆ พะอืดพะอม</span>\n                      </label>\n                    </div>\n                  </div>\n                </div>\n              </div>\n\n              <!-- ประวัติการขับถ่ายอุจจาระและอาการท้องผูก/ท้องอืด -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 mb-1.5\">ประวัติการขับถ่ายอุจจาระและการผายลม</label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2\">\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitingBowelHabit\" value=\"normal_bowel\" onchange=\"handleVomitingBowelHabitChange(this.value)\" class=\"text-medical-600 mt-0.5\">\n                    <span class=\"ml-2.5 text-xs text-slate-800\">ขับถ่ายและผายลมได้ตามปกติ</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitingBowelHabit\" value=\"diarrhea_active\" onchange=\"handleVomitingBowelHabitChange(this.value)\" class=\"text-medical-600 mt-0.5\">\n                    <span class=\"ml-2.5 text-xs text-slate-800 font-medium\">มีอาการถ่ายเหลว / ถ่ายเป็นน้ำร่วมด้วย</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitingBowelHabit\" value=\"bloody_melena_stool\" onchange=\"handleVomitingBowelHabitChange(this.value)\" class=\"text-medical-600 mt-0.5\">\n                    <span class=\"ml-2.5 text-xs text-slate-800 font-semibold text-slate-800\">ถ่ายอุจจาระมีเลือดปนหรือถ่ายดำ</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitingBowelHabit\" value=\"constipation_obstipation_gte24h\" onchange=\"handleVomitingBowelHabitChange(this.value)\" class=\"text-medical-600 mt-0.5\">\n                    <span class=\"ml-2.5 text-xs text-slate-800 font-medium\">ไม่ถ่าย ถ่ายลำบาก หรือท้องผูก นานกว่า 24-48 ชั่วโมง</span>\n                  </label>\n                </div>\n\n                <!-- Progressive Disclosure: ถ่ายเหลว (Comment #6) -->\n                <div id=\"vomitingDiarrheaWrap\" class=\"hidden mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2\">\n                  <div class=\"flex items-center space-x-2\">\n                    <label class=\"text-xs font-semibold text-slate-700\">จำนวนครั้งที่ถ่ายเหลวในวันนี้:</label>\n                    <input type=\"number\" id=\"vomitingDiarrheaFreq\" min=\"1\" max=\"50\" placeholder=\"เช่น 3\" class=\"w-20 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800 font-semibold\">\n                    <span class=\"text-xs text-slate-500\">ครั้ง/วัน</span>\n                  </div>\n                  <div>\n                    <label class=\"block text-[11px] font-semibold text-slate-700 mb-1\">ลักษณะอุจจาระที่ถ่าย (เลือกได้หลายข้อ):</label>\n                    <div class=\"grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs\">\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg cursor-pointer\">\n                        <input type=\"checkbox\" name=\"vomitingDiarrheaStools\" value=\"watery\" class=\"text-medical-600 rounded\">\n                        <span class=\"ml-2 text-slate-800\">น้ำเหลวล้วน</span>\n                      </label>\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg cursor-pointer\">\n                        <input type=\"checkbox\" name=\"vomitingDiarrheaStools\" value=\"mucus\" class=\"text-medical-600 rounded\">\n                        <span class=\"ml-2 text-slate-800\">มีมูกปน</span>\n                      </label>\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg cursor-pointer\">\n                        <input type=\"checkbox\" name=\"vomitingDiarrheaStools\" value=\"bloody\" class=\"text-medical-600 rounded\">\n                        <span class=\"ml-2 text-slate-800 font-semibold text-slate-800\">มีเลือดสดปน</span>\n                      </label>\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg cursor-pointer\">\n                        <input type=\"checkbox\" name=\"vomitingDiarrheaStools\" value=\"dark_tarry\" class=\"text-medical-600 rounded\">\n                        <span class=\"ml-2 text-slate-800 font-semibold text-slate-800\">สีดำคล้ำ</span>\n                      </label>\n                    </div>\n                  </div>\n                </div>\n\n                <!-- Progressive Disclosure: ถ่ายเป็นเลือด / ถ่ายดำ (Comment #7) -->\n                <div id=\"vomitingBloodyStoolWrap\" class=\"hidden mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2\">\n                  <label class=\"block text-xs font-semibold text-slate-700 mb-1\">ลักษณะเลือดหรือสีของอุจจาระที่สังเกตพบ:</label>\n                  <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                    <label class=\"selectable-card flex items-start p-2 rounded-lg cursor-pointer\">\n                      <input type=\"radio\" name=\"vomitingBloodyStoolChar\" value=\"bright_red_coating\" class=\"text-medical-600 mt-0.5\">\n                      <span class=\"ml-2 text-slate-800\">เลือดสีแดงสดเคลือบก้อนอุจจาระ</span>\n                    </label>\n                    <label class=\"selectable-card flex items-start p-2 rounded-lg cursor-pointer\">\n                      <input type=\"radio\" name=\"vomitingBloodyStoolChar\" value=\"pure_bright_red\" class=\"text-medical-600 mt-0.5\">\n                      <span class=\"ml-2 text-slate-800\">ถ่ายเป็นเลือดสีแดงสดล้วนๆ ไม่มีก้อนอุจจาระ</span>\n                    </label>\n                    <label class=\"selectable-card flex items-start p-2 rounded-lg cursor-pointer\">\n                      <input type=\"radio\" name=\"vomitingBloodyStoolChar\" value=\"dark_clots\" class=\"text-medical-600 mt-0.5\">\n                      <span class=\"ml-2 text-slate-800\">ถ่ายเป็นลิ่มเลือดสีคล้ำๆ ปนออกมา</span>\n                    </label>\n                    <label class=\"selectable-card flex items-start p-2 rounded-lg cursor-pointer\">\n                      <input type=\"radio\" name=\"vomitingBloodyStoolChar\" value=\"black_tarry_melena\" class=\"text-medical-600 mt-0.5\">\n                      <span class=\"ml-2 text-slate-800 font-semibold\">ถ่ายเป็นสีดำเหนียวคล้ายยางมะตอย มีกลิ่นคาวเหม็นรุนแรง</span>\n                    </label>\n                    <label class=\"selectable-card flex items-start p-2 rounded-lg cursor-pointer sm:col-span-2\">\n                      <input type=\"radio\" name=\"vomitingBloodyStoolChar\" value=\"maroon_wash\" class=\"text-medical-600 mt-0.5\">\n                      <span class=\"ml-2 text-slate-800\">ถ่ายเป็นสีแดงคล้ำคล้ายน้ำล้างเนื้อ</span>\n                    </label>\n                  </div>\n                </div>\n\n                <!-- Progressive Disclosure: ท้องผูก / ไม่ถ่าย / ไม่ผายลม (เปิดเฉพาะเมื่อมีอาการท้องผูก/ไม่ถ่าย) -->\n                <div id=\"vomitingConstipationWrap\" class=\"hidden mt-2 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3\">\n                  <div>\n                    <label class=\"block text-xs font-semibold text-slate-700 mb-1\">ลักษณะการไม่ถ่ายหรือการผายลม (เลือกข้อที่ตรงที่สุด):</label>\n                    <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                      <label class=\"selectable-card flex items-start p-2.5 rounded-lg cursor-pointer\">\n                        <input type=\"radio\" name=\"vomitingConstipationSub\" value=\"no_stool_no_gas\" class=\"text-medical-600 mt-0.5\">\n                        <div class=\"ml-2\">\n                          <span class=\"block font-bold text-slate-800\">ไม่ถ่าย ไม่ผายลมเลย</span>\n                          <span class=\"block text-[11px] text-slate-500\">ไม่มีการผายลมออกทางทวารหนักเลยแม้แต่ครั้งเดียว</span>\n                        </div>\n                      </label>\n                      <label class=\"selectable-card flex items-start p-2.5 rounded-lg cursor-pointer\">\n                        <input type=\"radio\" name=\"vomitingConstipationSub\" value=\"no_stool_can_pass_gas\" class=\"text-medical-600 mt-0.5\">\n                        <div class=\"ml-2\">\n                          <span class=\"block font-bold text-slate-800\">ไม่ถ่าย แต่ยังผายลมได้</span>\n                          <span class=\"block text-[11px] text-slate-500\">ยังสามารถผายลม (ตด) ได้บ้างเป็นระยะ</span>\n                        </div>\n                      </label>\n                      <label class=\"selectable-card flex items-start p-2.5 rounded-lg cursor-pointer\">\n                        <input type=\"radio\" name=\"vomitingConstipationSub\" value=\"hard_pellet_stool\" class=\"text-medical-600 mt-0.5\">\n                        <div class=\"ml-2\">\n                          <span class=\"block font-bold text-slate-800\">ถ่ายออกเป็นก้อนเม็ดกระสุน</span>\n                          <span class=\"block text-[11px] text-slate-500\">อุจจาระแข็งมาก ต้องเบ่งอย่างรุนแรง ออกมาทีละเม็ดเล็กๆ</span>\n                        </div>\n                      </label>\n                      <label class=\"selectable-card flex items-start p-2.5 rounded-lg cursor-pointer\">\n                        <input type=\"radio\" name=\"vomitingConstipationSub\" value=\"watery_overflow_scant\" class=\"text-medical-600 mt-0.5\">\n                        <div class=\"ml-2\">\n                          <span class=\"block font-bold text-slate-800\">ถ่ายเหลวเป็นน้ำ ครั้งละไม่มาก</span>\n                          <span class=\"block text-[11px] text-slate-500\">มีน้ำอุจจาระไหลเล็ดออกทางรูทวารเล็กน้อย</span>\n                        </div>\n                      </label>\n                    </div>\n                  </div>\n\n                  <!-- ประวัติการผ่าตัดทางช่องท้อง (เปิดให้ตอบเฉพาะเมื่อมีอาการไม่ถ่าย/ท้องผูกนาน >24-48 ชม.) -->\n                  <div class=\"pt-3 border-t border-slate-200\">\n                    <label class=\"block text-xs font-semibold text-slate-700 mb-1\">ประวัติการผ่าตัดทางช่องท้อง</label>\n                    <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                      <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                        <input type=\"radio\" name=\"vomitingPriorAbdominalSurgery\" value=\"no\" class=\"text-medical-600\">\n                        <span class=\"ml-2.5 text-xs text-slate-800\">ไม่เคยผ่าตัดช่องท้อง</span>\n                      </label>\n                      <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                        <input type=\"radio\" name=\"vomitingPriorAbdominalSurgery\" value=\"yes\" class=\"text-medical-600 mt-0.5\">\n                        <div class=\"ml-2.5\">\n                          <span class=\"block text-xs font-semibold text-slate-800\">มีประวัติการผ่าตัดทางช่องท้องมาก่อน</span>\n                          <span class=\"block text-[11px] text-slate-500\">เช่น ผ่าคลอด, ผ่าตัดไส้ติ่ง, ผ่าตัดลำไส้, ผ่าตัดนิ่วในถุงน้ำดี</span>\n                        </div>\n                      </label>\n                    </div>\n                  </div>\n                </div>\n              </div>\n\n              <!-- อาการท้องอืด แน่นตึง -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 mb-1.5\">อาการท้องอืด แน่นตึง</label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2\">\n                  <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitingAbdominalDistension\" value=\"none\" class=\"text-medical-600\">\n                    <span class=\"ml-2.5 text-xs text-slate-800\">ท้องไม่อืด ผนังหน้าท้องนิ่มปกติ</span>\n                  </label>\n                  <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitingAbdominalDistension\" value=\"mild_bloating\" class=\"text-medical-600\">\n                    <span class=\"ml-2.5 text-xs text-slate-800\">รู้สึกแน่นอึดอัดท้องเล็กน้อย</span>\n                  </label>\n                  <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitingAbdominalDistension\" value=\"marked_distension_tight\" class=\"text-medical-600\">\n                    <span class=\"ml-2.5 text-xs text-slate-800 font-semibold\">ท้องอืดป่อง แน่นตึง แข็งเกร็งอย่างชัดเจน</span>\n                  </label>\n                </div>\n              </div>\n\n\n            </div>\n          </div>\n\n          <!-- CARD 4: สัญญาณอันตรายนอกระบบทางเดินอาหาร -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-5 border-b border-slate-100 pb-3\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"shield-alert\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-900\">4. สัญญาณอันตรายนอกระบบทางเดินอาหาร (Extra-abdominal Red Flags)</h2>\n                <p class=\"text-xs text-slate-500\">คัดกรองภาวะวิกฤตทางหัวใจขาดเลือด โรคหลอดเลือดสมอง และความดันในกะโหลกศีรษะสูง</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4\">\n              <!-- สัญญาณอันตรายทางหัวใจ -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 mb-1.5\">สัญญาณอันตรายทางระบบหัวใจและหลอดเลือด (เลือกได้หลายข้อ)</label>\n                <div class=\"space-y-2\">\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"vomitingCardiacFlags\" value=\"chest_tightness_pressure\" class=\"text-medical-600 rounded mt-0.5\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">แน่นหน้าอก เจ็บหน้าอก จุกแน่นคอหอย หรือแน่นลิ้นปี่ร้าวไปกราม/แขนซ้าย</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"vomitingCardiacFlags\" value=\"diaphoresis_cold_sweat\" class=\"text-medical-600 rounded mt-0.5\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">เหงื่อแตกท่วมตัว เสื้อเปียกชุ่ม ตัวเย็นเฉียบขณะเกิดอาการ</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"vomitingCardiacFlags\" value=\"syncope_presyncope\" class=\"text-medical-600 rounded mt-0.5\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">หน้ามืด วูบ หรือหมดสติไปชั่วคราวร่วมด้วย</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"vomitingCardiacFlags\" value=\"palpitation_racing_heart\" class=\"text-medical-600 rounded mt-0.5\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">หัวใจเต้นเร็วรัวผิดปกติ หรือเต้นสะดุดเป็นจังหวะ</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer bg-slate-50 border-slate-300\">\n                    <input type=\"checkbox\" name=\"vomitingCardiacFlags\" id=\"vomitingCardiacNoneCb\" value=\"none_cardiac\" onchange=\"handleVomitingCardiacNoneToggle(this)\" class=\"text-medical-600 rounded\">\n                    <span class=\"ml-3 text-xs font-semibold text-slate-700\">ไม่มีอาการผิดปกติทางหัวใจและเหงื่อแตก</span>\n                  </label>\n                </div>\n              </div>\n\n              <!-- สัญญาณอันตรายทางสมองและระบบประสาท -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 mb-1.5\">สัญญาณอันตรายทางสมองและระบบประสาท (เลือกได้หลายข้อ)</label>\n                <div class=\"space-y-2\">\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"vomitingNeuroFlags\" value=\"severe_sudden_headache\" class=\"text-medical-600 rounded mt-0.5\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">ปวดศีรษะรุนแรงมากผิดปกติ หรือปวดแบบฟ้าผ่าเฉียบพลัน</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"vomitingNeuroFlags\" value=\"stiff_neck\" class=\"text-medical-600 rounded mt-0.5\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">คอแข็งเกร็ง ก้มคอไม่ลง คางชิดอกไม่ได้</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"vomitingNeuroFlags\" value=\"focal_weakness_numbness\" class=\"text-medical-600 rounded mt-0.5\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">แขนหรือขาอ่อนแรงครึ่งซีก ปากเบี้ยว ยิ้มไม่เท่ากัน หรือชาครึ่งซีก</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"vomitingNeuroFlags\" value=\"diplopia_blurred_vision\" class=\"text-medical-600 rounded mt-0.5\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">มองเห็นภาพซ้อน หรือตาพร่ามัวเฉียบพลัน</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"vomitingNeuroFlags\" value=\"vertigo_ataxia\" class=\"text-medical-600 rounded mt-0.5\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">เวียนศีรษะบ้านหมุนอย่างรุนแรง ทรงตัวไม่ได้ เดินเซ ปัดไปข้างหนึ่ง</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"vomitingNeuroFlags\" value=\"confusion_drowsiness\" class=\"text-medical-600 rounded mt-0.5\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">ซึมลง สับสน ถามตอบไม่รู้เรื่อง หรือเรียกปลุกตื่นยาก</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer bg-slate-50 border-slate-300\">\n                    <input type=\"checkbox\" name=\"vomitingNeuroFlags\" id=\"vomitingNeuroNoneCb\" value=\"none_neuro\" onchange=\"handleVomitingNeuroNoneToggle(this)\" class=\"text-medical-600 rounded\">\n                    <span class=\"ml-3 text-xs font-semibold text-slate-700\">ไม่มีอาการทางระบบประสาทข้างต้น</span>\n                  </label>\n                </div>\n              </div>\n            </div>\n          </div>\n\n          <!-- CARD 5: ภาวะขาดน้ำ การรับประทานอาหาร ยา และอาหารเป็นพิษ -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-5 border-b border-slate-100 pb-3\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"alert-triangle\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-900\">5. ภาวะขาดน้ำ การรับประทานอาหาร ยา และอาหารเป็นพิษ (Dehydration & Precipitants)</h2>\n                <p class=\"text-xs text-slate-500\">ประเมินระดับการขาดน้ำ ความจำเป็นในการให้สารน้ำ IV และสารพิษเฉพาะกลุ่ม</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4\">\n              <!-- การดื่มน้ำและอาหาร -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 mb-1.5\">ความสามารถในการรับประทานอาหารและน้ำในปัจจุบัน</label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2\">\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitingOralIntolerance\" value=\"can_drink_water\" class=\"text-medical-600 mt-0.5\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"block text-xs font-medium text-slate-800\">จิบน้ำหรือเกลือแร่ได้บ้าง ไม่อาเจียนออกมาทั้งหมด</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitingOralIntolerance\" value=\"intolerant_vomit_all\" class=\"text-medical-600 mt-0.5\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">ไม่สามารถดื่มน้ำหรือทานอะไรได้เลย ทานเข้าไปคำไหนอาเจียนพุ่งออกมาหมดทันที</span>\n                    </div>\n                  </label>\n                </div>\n              </div>\n\n              <!-- สัญญาณขาดน้ำรุนแรง -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 mb-1.5\">สัญญาณของการขาดน้ำรุนแรง (เลือกได้หลายข้อ)</label>\n                <div class=\"space-y-2\">\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"vomitingDehydrationSigns\" value=\"oliguria_anuria\" class=\"text-medical-600 rounded mt-0.5\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">ปัสสาวะออกน้อยมากผิดปกติ สีเข้มจัด หรือไม่ปัสสาวะเลยตั้งแต่เช้า/เกิน 8 ชั่วโมง</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"vomitingDehydrationSigns\" value=\"marked_dry_mouth_thirst\" class=\"text-medical-600 rounded mt-0.5\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">ปากแห้ง ผิวแห้ง ลิ้นแห้งแตก กระหายน้ำมาก</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"vomitingDehydrationSigns\" value=\"postural_dizziness_blackout\" class=\"text-medical-600 rounded mt-0.5\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">ลุกขึ้นยืนแล้วหน้ามืด เซ ตาพร่า วูบ ต้องนอนราบตลอดเวลา</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"vomitingDehydrationSigns\" value=\"cold_clammy_extremities\" class=\"text-medical-600 rounded mt-0.5\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">ปลายมือปลายเท้าเย็นเฉียบ ชีพจรเต้นเร็วและเบา</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer bg-slate-50 border-slate-300\">\n                    <input type=\"checkbox\" name=\"vomitingDehydrationSigns\" id=\"vomitingDehydrationNoneCb\" value=\"none_dehydration\" onchange=\"handleVomitingDehydrationNoneToggle(this)\" class=\"text-medical-600 rounded\">\n                    <span class=\"ml-3 text-xs font-semibold text-slate-700\">ไม่มีสัญญาณขาดน้ำรุนแรง ปัสสาวะออกสีปกติ</span>\n                  </label>\n                </div>\n              </div>\n\n              <!-- ยา สารพิษ และประวัติอาหาร (Comments #9, #10) -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 mb-1.5\">ประวัติการใช้ยา สารพิษ และอาหารเสี่ยง (เลือกได้หลายข้อ)</label>\n                <div class=\"space-y-2\">\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"vomitingPrecipitants\" value=\"known_diabetes\" class=\"text-medical-600 rounded mt-0.5\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">ผู้ป่วยโรคเบาหวาน</span>\n                      <span class=\"block text-[11px] text-slate-500\">เสี่ยงต่อภาวะเลือดเป็นกรดจากคีโตน (Diabetic Ketoacidosis - DKA) หรือกระเพาะอาหารบีบตัวช้า</span>\n                    </div>\n                  </label>\n\n                  <!-- รับประทานยาในกลุ่ม ดังต่อไปนี้ (Comment #9) -->\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"vomitingPrecipitants\" id=\"vomitingMedsCb\" value=\"high_risk_medications\" onchange=\"handleVomitingMedsToggle(this)\" class=\"text-medical-600 rounded mt-0.5\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">รับประทานยาในกลุ่ม ดังต่อไปนี้</span>\n                      <span class=\"block text-[11px] text-slate-500\">ยาโรคหัวใจ Digoxin, ยาแก้ปวดข้อ NSAIDs, ยาต้ม ยาหม้อ ยาลูกกลอน, ยาเคมีบำบัด, Lithium</span>\n                    </div>\n                  </label>\n                  <div id=\"vomitingMedsWrap\" class=\"hidden ml-7 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2\">\n                    <label class=\"block text-[11px] font-semibold text-slate-700\">ระบุกลุ่มยาที่รับประทาน (เลือกได้หลายข้อ):</label>\n                    <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs\">\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg cursor-pointer\">\n                        <input type=\"checkbox\" name=\"vomitingMedList\" value=\"digoxin\" class=\"text-medical-600 rounded\">\n                        <span class=\"ml-2 text-slate-800\">ยาโรคหัวใจ (เช่น Digoxin)</span>\n                      </label>\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg cursor-pointer\">\n                        <input type=\"checkbox\" name=\"vomitingMedList\" value=\"nsaids\" class=\"text-medical-600 rounded\">\n                        <span class=\"ml-2 text-slate-800\">ยาแก้ปวดข้อ/กระดูกกลุ่ม NSAIDs</span>\n                      </label>\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg cursor-pointer\">\n                        <input type=\"checkbox\" name=\"vomitingMedList\" value=\"herbal_bolus\" class=\"text-medical-600 rounded\">\n                        <span class=\"ml-2 text-slate-800\">ยาต้ม ยาหม้อ ยาลูกกลอน สมุนไพร</span>\n                      </label>\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg cursor-pointer\">\n                        <input type=\"checkbox\" name=\"vomitingMedList\" value=\"chemotherapy\" class=\"text-medical-600 rounded\">\n                        <span class=\"ml-2 text-slate-800\">ยาเคมีบำบัดรักษามะเร็ง</span>\n                      </label>\n\n                      <label class=\"selectable-card flex items-center p-2 rounded-lg cursor-pointer\">\n                        <input type=\"checkbox\" name=\"vomitingMedList\" value=\"lithium_psych\" class=\"text-medical-600 rounded\">\n                        <span class=\"ml-2 text-slate-800\">ยารักษาจิตเวช (เช่น Lithium)</span>\n                      </label>\n                    </div>\n                  </div>\n\n                  <!-- เพิ่งรับประทานอาหารกลุ่มเสี่ยง (Comment #10) -->\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"vomitingPrecipitants\" id=\"vomitingToxinFoodCb\" value=\"natural_toxin_food\" onchange=\"handleVomitingToxinFoodToggle(this)\" class=\"text-medical-600 rounded mt-0.5\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">เพิ่งรับประทานอาหารในกลุ่มเหล่านี้ เห็ด กลอย หน่อไม้ แมงดาถ้วย ปลาปักเป้า ลูกเนียง สบู่ดำ สบู่แดง</span>\n                      <span class=\"block text-[11px] text-slate-500\">สงสัยภาวะได้รับสารพิษจากอาหารธรรมชาติเฉียบพลัน</span>\n                    </div>\n                  </label>\n                  <div id=\"vomitingToxinFoodWrap\" class=\"hidden ml-7 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5\">\n                    <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                      <div>\n                        <label class=\"block text-[11px] font-semibold text-slate-700 mb-1\">ระบุชนิดอาหาร:</label>\n                        <input type=\"text\" id=\"vomitingToxinFoodType\" placeholder=\"เช่น เห็ดป่า, หน่อไม้ปี๊บ, แมงดาถ้วย, ปลาปักเป้า...\" class=\"w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400\">\n                      </div>\n                      <div>\n                        <label class=\"block text-[11px] font-semibold text-slate-700 mb-1\">เวลาที่รับประทาน:</label>\n                        <input type=\"text\" id=\"vomitingToxinFoodTime\" placeholder=\"เช่น 2 ชั่วโมงก่อน, เมื่อวานมื้อเย็น...\" class=\"w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400\">\n                      </div>\n                      <div>\n                        <label class=\"block text-[11px] font-semibold text-slate-700 mb-1\">สถานที่รับประทาน:</label>\n                        <input type=\"text\" id=\"vomitingToxinFoodPlace\" placeholder=\"เช่น เก็บจากป่าแถวบ้าน, ร้านอาหาร, งานเลี้ยง...\" class=\"w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400\">\n                      </div>\n                      <div>\n                        <label class=\"block text-[11px] font-semibold text-slate-700 mb-1\">ผู้ร่วมรับประทาน:</label>\n                        <input type=\"text\" id=\"vomitingToxinFoodCoEaters\" placeholder=\"เช่น ทานคนเดียว, ทานร่วมกัน 4 คน มีอาการเหมือนกัน 2 คน...\" class=\"w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400\">\n                      </div>\n                    </div>\n                    <p class=\"text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-start space-x-1.5\">\n                      <i data-lucide=\"info\" class=\"w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-600\"></i>\n                      <span>แจ้งข้อมูลเพื่อประโยชน์ในการสอบสวนโรคและนำผู้ป่วยท่านอื่นที่รับประทานร่วมกันเข้ารับการรักษาอย่างทันท่วงที</span>\n                    </p>\n                  </div>\n\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"vomitingPrecipitants\" value=\"heavy_alcohol_or_withdrawal\" class=\"text-medical-600 rounded mt-0.5\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">ดื่มสุราหนักก่อนเกิดอาการ หรือเพิ่งหยุดดื่มสุรากะทันหันใน 1–3 วันนี้</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"vomitingPrecipitants\" id=\"vomitingChemicalCb\" value=\"suspected_toxin_chemical\" onchange=\"handleVomitingChemicalToggle(this)\" class=\"text-medical-600 rounded mt-0.5\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">สงสัยกินยาเกินขนาด สารเคมีทางการเกษตร ยาฆ่าแมลง หรือสารพิษอื่นๆ</span>\n                    </div>\n                  </label>\n                  <div id=\"vomitingChemicalWrap\" class=\"hidden ml-7 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5\">\n                    <label class=\"block text-[11px] font-semibold text-slate-700\">ระบุชื่อยา สารเคมี ปริมาณ หรือรายละเอียดที่สงสัย:</label>\n                    <input type=\"text\" id=\"vomitingChemicalDetails\" placeholder=\"เช่น ยาพาราเซตามอล 20 เม็ด, สารกำจัดวัชพืช/ยาฆ่าหญ้า, ยาฆ่าแมลง...\" class=\"w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400\">\n                  </div>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"checkbox\" name=\"vomitingPrecipitants\" value=\"general_food_poisoning\" class=\"text-medical-600 rounded mt-0.5\">\n                    <div class=\"ml-3\">\n                      <span class=\"block text-xs font-semibold text-slate-800\">รับประทานอาหารร่วมกับผู้อื่นแล้วมีคนมีอาการคล้ายกัน หรือทานอาหารค้างคืน/อาหารทะเลทั่วไป</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer bg-slate-50 border-slate-300\">\n                    <input type=\"checkbox\" name=\"vomitingPrecipitants\" id=\"vomitingPrecipitantNoneCb\" value=\"none_precipitants\" onchange=\"handleVomitingPrecipitantNoneToggle(this)\" class=\"text-medical-600 rounded\">\n                    <span class=\"ml-3 text-xs font-semibold text-slate-700\">ปฏิเสธประวัติดังกล่าวข้างต้น</span>\n                  </label>\n                </div>\n              </div>\n\n              <!-- ข้อสังเกตเพิ่มเติม -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 mb-1\">อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม (ข้อสังเกตของผู้ให้ประวัติ)</label>\n                <textarea id=\"vomitingAdditionalNotes\" rows=\"2\" placeholder=\"ระบุรายละเอียดหรือข้อสังเกตเพิ่มเติมเกี่ยวกับอาการคลื่นไส้อาเจียน...\" class=\"w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 placeholder:text-slate-400\"></textarea>\n              </div>\n            </div>\n          </div>\n\n          <!-- CARD 6: ข้อมูลเฉพาะสตรีวัยเจริญพันธุ์ (LMP) -->\n          <div id=\"vomiting_branch_female_lmp\" class=\"hidden bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-5 border-b border-slate-100 pb-3\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"heart-pulse\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-900\">6. ข้อมูลเฉพาะสตรีวัยเจริญพันธุ์ (Female Reproductive History)</h2>\n                <p class=\"text-xs text-slate-500\">คัดกรองภาวะแพ้ท้องรุนแรงและภาวะฉุกเฉินทางสูตินรีเวช</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4\">\n              <!-- ประวัติประจำเดือน -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 mb-1.5\">ประวัติประจำเดือนครั้งสุดท้าย (LMP Status)</label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2\">\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomiting_lmp_status\" value=\"regular_lmp_exact\" onchange=\"handleVomitingLmpStatusChange(this.value)\" class=\"text-medical-600 mt-0.5\">\n                    <span class=\"ml-2.5 text-xs text-slate-800\">จำวันแรกของประจำเดือนครั้งสุดท้ายได้แน่นอน</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomiting_lmp_status\" value=\"approx_recent\" onchange=\"handleVomitingLmpStatusChange(this.value)\" class=\"text-medical-600 mt-0.5\">\n                    <span class=\"ml-2.5 text-xs text-slate-800\">จำได้คร่าวๆ (ประมาณ 1–4 สัปดาห์ก่อน)</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomiting_lmp_status\" value=\"missed_period\" onchange=\"handleVomitingLmpStatusChange(this.value)\" class=\"text-medical-600 mt-0.5\">\n                    <span class=\"ml-2.5 text-xs text-slate-800 font-semibold text-slate-800\">ขาดประจำเดือน / ประจำเดือนขาดหายไปอย่างน้อย 1 รอบ</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomiting_lmp_status\" value=\"post_menopausal_or_hysterectomy\" onchange=\"handleVomitingLmpStatusChange(this.value)\" class=\"text-medical-600 mt-0.5\">\n                    <span class=\"ml-2.5 text-xs text-slate-800\">หมดประจำเดือนแล้ว หรือผ่าตัดมดลูก/รังไข่แล้ว</span>\n                  </label>\n                  <label class=\"selectable-card flex items-start p-3 rounded-xl cursor-pointer sm:col-span-2\">\n                    <input type=\"radio\" name=\"vomiting_lmp_status\" value=\"not_applicable_child\" onchange=\"handleVomitingLmpStatusChange(this.value)\" class=\"text-medical-600 mt-0.5\">\n                    <span class=\"ml-2.5 text-xs text-slate-800\">ยังไม่เคยมีประจำเดือน</span>\n                  </label>\n                </div>\n\n                <!-- ช่องเลือกวันที่ LMP -->\n                <div id=\"vomiting_lmp_date_wrap\" class=\"hidden mt-2 p-3 bg-pink-50/50 border border-pink-200 rounded-xl\">\n                  <label class=\"block text-xs font-semibold text-slate-700 mb-1\">ระบุวันแรกของประจำเดือนครั้งสุดท้าย: <span class=\"text-[10px] text-slate-500 font-normal\">(วว/ดด/ปปปป)</span></label>\n                  <input type=\"text\" id=\"vomitingLmpDate\" data-universal-date=\"true\" placeholder=\"วว/ดด/ปปปป (dd/mm/yyyy)\" autocomplete=\"off\" class=\"bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-pink-500\">\n                </div>\n              </div>\n\n              <!-- ตรวจตั้งครรภ์เอง -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 mb-1.5\">การตรวจการตั้งครรภ์เบื้องต้นด้วยตนเอง</label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2\">\n                  <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitingPregnancyTestSelf\" value=\"not_tested\" class=\"text-medical-600\">\n                    <span class=\"ml-2.5 text-xs text-slate-800\">ยังไม่ได้ตรวจ</span>\n                  </label>\n                  <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitingPregnancyTestSelf\" value=\"tested_negative\" class=\"text-medical-600\">\n                    <span class=\"ml-2.5 text-xs text-slate-800\">ตรวจแล้ว ได้ผลลบ (1 ขีด)</span>\n                  </label>\n                  <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"vomitingPregnancyTestSelf\" value=\"tested_positive\" class=\"text-medical-600\">\n                    <span class=\"ml-2.5 text-xs text-slate-800 font-semibold text-slate-800\">ตรวจแล้ว ได้ผลบวก (2 ขีด / ตั้งครรภ์)</span>\n                  </label>\n                </div>\n              </div>\n            </div>\n          </div>\n\n          <!-- CARD 7: อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100\">\n              <div class=\"bg-slate-100 text-slate-600 p-2 rounded-xl\">\n                <i data-lucide=\"message-square-plus\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-800\">7. อาการอื่น ๆ หรือข้อความเพิ่มเติมถึงแพทย์ (Additional Notes)</h2>\n                <p class=\"text-xs text-slate-500\">ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)</p>\n              </div>\n            </div>\n            <textarea id=\"vomitingAdditionalNotes\" rows=\"2\" placeholder=\"พิมพ์ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)...\" class=\"w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white\"></textarea>\n          </div>\n\n        </div>",
  algorithm: {
  "id": "vomiting",
  "schemaCode": "severe_nausea_vomiting",
  "titleTh": "คลื่นไส้ / อาเจียนรุนแรง (Nausea & Severe Vomiting / Intractable Vomiting)",
  "titleEn": "Nausea & Severe Vomiting / Acute Abdomen & Extra-abdominal Triage",
  "sections": [
    {
      "sectionNo": 1,
      "titleTh": "ระยะเวลา ความถี่ และความสัมพันธ์กับการรับประทานอาหาร (Onset, Duration & Frequency)",
      "questions": [
        {
          "key": "duration",
          "labelTh": "เริ่มมีอาการคลื่นไส้อาเจียนมานานเท่าไรแล้ว?",
          "type": "duration_with_unit",
          "units": "UNIVERSAL_DURATION_UNITS"
        },
        {
          "key": "vomitingOnsetMode",
          "labelTh": "รูปแบบการเริ่มต้นของอาการ",
          "type": "single_choice",
          "options": [
            {
              "value": "sudden_severe",
              "patientTh": "เกิดขึ้นทันทีทันใด ปุบปับ คลื่นไส้อาเจียนรุนแรงตั้งแต่ครั้งแรก",
              "doctorTh": "เกิดขึ้นทันทีทันใดรุนแรง (Sudden severe onset)"
            },
            {
              "value": "gradual_worsening",
              "patientTh": "ค่อยๆ รู้สึกพะอืดพะอม คลื่นไส้ แล้วอาเจียนถี่ขึ้นเรื่อยๆ",
              "doctorTh": "ค่อยๆ เป็นถี่ขึ้นเรื่อยๆ (Gradual worsening)"
            },
            {
              "value": "intermittent_spells",
              "patientTh": "เป็นๆ หายๆ มีช่วงที่เว้นว่างแล้วกลับมาอาเจียนเป็นระลอก",
              "doctorTh": "เป็นๆ หายๆ เป็นระลอก (Intermittent spells)"
            }
          ]
        },
        {
          "key": "vomitingFrequencyToday",
          "labelTh": "ความถี่ของการอาเจียนในวันนี้",
          "type": "single_choice",
          "options": [
            {
              "value": "mild_1_2",
              "patientTh": "1–2 ครั้ง",
              "doctorTh": "อาเจียน 1-2 ครั้ง/วัน (Mild emesis)"
            },
            {
              "value": "moderate_3_5",
              "patientTh": "3–5 ครั้ง",
              "doctorTh": "อาเจียน 3-5 ครั้ง/วัน (Moderate emesis)"
            },
            {
              "value": "severe_6_10",
              "patientTh": "6–10 ครั้ง",
              "doctorTh": "อาเจียน 6-10 ครั้ง/วัน 🚩 (Severe emesis)",
              "isRedFlag": true
            },
            {
              "value": "intractable_gt_10",
              "patientTh": "มากกว่า 10 ครั้งขึ้นไป หรืออาเจียนตลอดเวลาทุกครั้งที่ขยับตัว",
              "doctorTh": "อาเจียน >10 ครั้งขึ้นไป/ต่อเนื่อง 🚩 (Intractable vomiting)",
              "isRedFlag": true
            }
          ]
        },
        {
          "key": "vomitingFoodRelation",
          "labelTh": "ความสัมพันธ์กับการรับประทานอาหารหรือน้ำ",
          "type": "single_choice",
          "options": [
            {
              "value": "immediate_postprandial",
              "patientTh": "อาเจียนทันทีขณะทานหรือหลังทานอาหารเสร็จไม่เกิน 15 นาที",
              "doctorTh": "อาเจียนทันทีหลังอาหาร (Immediate postprandial / Gastric outlet)"
            },
            {
              "value": "delayed_postprandial_hours",
              "patientTh": "อาเจียนหลังทานอาหารไปแล้ว 1–3 ชั่วโมง (มักมีเศษอาหารมื้อก่อนตกค้าง)",
              "doctorTh": "อาเจียนหลังอาหาร 1-3 ชม. (Delayed postprandial / Gastroparesis)"
            },
            {
              "value": "morning_fasting",
              "patientTh": "อาเจียนช่วงตื่นนอนตอนเช้าหรือขณะท้องว่าง",
              "doctorTh": "อาเจียนตอนเช้า/ท้องว่าง (Morning / Fasting emesis / Pregnancy / Uremia / IICP)"
            },
            {
              "value": "independent_constant",
              "patientTh": "อาเจียนตลอดเวลา ไม่ว่าจะทานหรือไม่ทานอะไรก็ตาม",
              "doctorTh": "อาเจียนตลอดเวลาไม่สัมพันธ์กับอาหาร (Constant independent emesis)"
            }
          ]
        }
      ]
    },
    {
      "sectionNo": 2,
      "titleTh": "ลักษณะของสิ่งที่อาเจียนออกมา (Characteristics of Vomitus)",
      "questions": [
        {
          "key": "vomitusCharacter",
          "labelTh": "ลักษณะหลักของสิ่งที่อาเจียนออกมา (เลือกข้อที่ตรงที่สุด)",
          "type": "single_choice",
          "options": [
            {
              "value": "clear_gastric_juice",
              "patientTh": "น้ำใส น้ำลาย หรือน้ำย่อยใสๆ",
              "doctorTh": "น้ำย่อยใส/น้ำลาย (Clear gastric juice)"
            },
            {
              "value": "food_particles",
              "patientTh": "เศษอาหารที่เพิ่งรับประทานเข้าไป",
              "doctorTh": "เศษอาหารสด (Fresh food particles)"
            },
            {
              "value": "undigested_old_food",
              "patientTh": "เศษอาหารเก่าที่ทานไปหลายชั่วโมงหรือข้ามวัน",
              "doctorTh": "เศษอาหารเก่าตกค้าง (Old undigested food / Gastric retention)"
            },
            {
              "value": "yellow_green_bile",
              "patientTh": "น้ำดีสีเขียวจัด หรือสีเหลืองอมเขียวเข้มข้น",
              "doctorTh": "อาเจียนเป็นน้ำดีสีเขียวจัด 🚩 (Bilious vomiting / Post-ampullary obstruction)",
              "isRedFlag": true
            },
            {
              "value": "brown_feculent",
              "patientTh": "สีน้ำตาลเข้ม มีกลิ่นเหม็นรุนแรงคล้ายอุจจาระ",
              "doctorTh": "อาเจียนสีน้ำตาลกลิ่นอุจจาระ 🚩 (Feculent vomiting / Distal Bowel Obstruction)",
              "isRedFlag": true
            },
            {
              "value": "blood_bright_red",
              "patientTh": "มีเลือดสีแดงสดปนออกมาอย่างชัดเจน",
              "doctorTh": "อาเจียนมีเลือดสีแดงสด 🚩 (Hematemesis / Upper GI Bleed / Mallory-Weiss)",
              "isRedFlag": true
            },
            {
              "value": "blood_coffee_ground",
              "patientTh": "สีกาแฟคั่ว หรือเป็นเม็ดสีกากกาแฟดำๆ",
              "doctorTh": "อาเจียนสีกาแฟคั่ว 🚩 (Coffee-ground emesis / Bleeding Peptic Ulcer)",
              "isRedFlag": true
            }
          ]
        },
        {
          "key": "vomitingPatternType",
          "labelTh": "ลักษณะการพุ่งของการอาเจียน",
          "type": "single_choice",
          "options": [
            {
              "value": "normal_retching",
              "patientTh": "มีอาการพะอืดพะอม โก่งคอ ขย้อน และคลื่นไส้นำมาก่อนอย่างชัดเจน",
              "doctorTh": "มีคลื่นไส้ขย้อนนำปกติ (Normal retching emesis)"
            },
            {
              "value": "projectile_vomiting",
              "patientTh": "อาเจียนพุ่งออกมาอย่างรุนแรงทันที โดยแทบไม่มีอาการคลื่นไส้นำมาก่อนเลย",
              "doctorTh": "อาเจียนพุ่งรุนแรงไม่มีคลื่นไส้นำ 🚩 (Projectile vomiting / Increased ICP)",
              "isRedFlag": true
            }
          ]
        },
        {
          "key": "vomitusVolumePerTime",
          "labelTh": "การประเมินปริมาณสิ่งที่อาเจียนต่อครั้ง",
          "type": "single_choice",
          "options": [
            {
              "value": "small_sip",
              "patientTh": "ปริมาณเล็กน้อย (ไม่เกินครึ่งแก้วน้ำ / ขย้อนออกมาเล็กน้อย)",
              "doctorTh": "ปริมาณเล็กน้อย (<100 mL)"
            },
            {
              "value": "moderate_cup",
              "patientTh": "ปริมาณปานกลาง (ประมาณ 1 แก้วน้ำ)",
              "doctorTh": "ปริมาณปานกลาง (~200-300 mL)"
            },
            {
              "value": "large_bowl",
              "patientTh": "ปริมาณมาก ทะลักเต็มชามหรือกะละมังในแต่ละครั้ง",
              "doctorTh": "ปริมาณมากทะลัก (>500 mL)"
            }
          ]
        }
      ]
    },
    {
      "sectionNo": 3,
      "titleTh": "อาการร่วมทางช่องท้องและระบบทางเดินอาหาร (Gastrointestinal & Abdominal Symptoms)",
      "questions": [
        {
          "key": "vomitingHasAbdominalPain",
          "labelTh": "มีอาการปวดท้องร่วมด้วยหรือไม่?",
          "type": "boolean_with_branch",
          "options": [
            {
              "value": false,
              "patientTh": "ไม่มีอาการปวดท้อง",
              "doctorTh": "ไม่มีอาการปวดท้อง"
            },
            {
              "value": true,
              "patientTh": "มีอาการปวดท้องร่วมด้วย",
              "doctorTh": "มีอาการปวดท้องร่วมด้วย"
            }
          ]
        },
        {
          "key": "vomitingBowelHabit",
          "labelTh": "ประวัติการขับถ่ายอุจจาระและอาการท้องผูก/ท้องอืด",
          "type": "single_choice",
          "options": [
            {
              "value": "normal_bowel",
              "patientTh": "ขับถ่ายและผายลมได้ตามปกติ",
              "doctorTh": "ขับถ่ายและผายลมปกติ (Normal bowel habit)"
            },
            {
              "value": "diarrhea_active",
              "patientTh": "มีอาการถ่ายเหลว / ถ่ายเป็นน้ำร่วมด้วย",
              "doctorTh": "มีถ่ายเหลวร่วมด้วย (Diarrhea)"
            },
            {
              "value": "bloody_melena_stool",
              "patientTh": "ถ่ายอุจจาระมีเลือดปนหรือถ่ายดำ",
              "doctorTh": "ถ่ายเป็นเลือดสดหรือถ่ายดำยางมะตอย 🚩 (Melena / Hematochezia)",
              "isRedFlag": true
            },
            {
              "value": "constipation_obstipation_gte24h",
              "patientTh": "ไม่ถ่าย ถ่ายลำบาก หรือท้องผูก นานกว่า 24-48 ชั่วโมง",
              "doctorTh": "ไม่ถ่าย/ท้องผูก >24-48 ชม. 🚩 (Constipation / Obstipation)",
              "isRedFlag": true
            }
          ]
        },
        {
          "key": "vomitingAbdominalDistension",
          "labelTh": "อาการท้องอืด แน่นตึง",
          "type": "single_choice",
          "options": [
            {
              "value": "none",
              "patientTh": "ท้องไม่อืด ผนังหน้าท้องนิ่มปกติ",
              "doctorTh": "ท้องไม่อืด ผนังหน้าท้องนิ่ม (Soft, non-distended abdomen)"
            },
            {
              "value": "mild_bloating",
              "patientTh": "รู้สึกแน่นอึดอัดท้องเล็กน้อย",
              "doctorTh": "แน่นอึดอัดท้องเล็กน้อย (Mild bloating)"
            },
            {
              "value": "marked_distension_tight",
              "patientTh": "ท้องอืดป่อง แน่นตึง แข็งเกร็งอย่างชัดเจน",
              "doctorTh": "ท้องอืดป่องแน่นตึงชัดเจน 🚩 (Marked abdominal distension / Guarding)",
              "isRedFlag": true
            }
          ]
        },
        {
          "key": "vomitingPriorAbdominalSurgery",
          "labelTh": "ประวัติการผ่าตัดทางช่องท้อง",
          "type": "single_choice",
          "options": [
            {
              "value": "no",
              "patientTh": "ไม่เคยผ่าตัดช่องท้อง",
              "doctorTh": "ปฏิเสธประวัติผ่าตัดช่องท้อง (No prior abdominal surgery)"
            },
            {
              "value": "yes",
              "patientTh": "มีประวัติการผ่าตัดทางช่องท้องมาก่อน",
              "doctorTh": "มีประวัติการผ่าตัดทางช่องท้อง 🚩 (Prior abdominal surgery / Adhesive SBO risk)",
              "isRedFlag": true
            }
          ]
        }
      ]
    },
    {
      "sectionNo": 4,
      "titleTh": "สัญญาณอันตรายนอกระบบทางเดินอาหาร (Extra-Abdominal Red Flags: Cardiac & Neuro)",
      "questions": [
        {
          "key": "vomitingCardiacFlags",
          "labelTh": "สัญญาณอันตรายทางระบบหัวใจและหลอดเลือด",
          "type": "multiple_choice",
          "options": [
            {
              "key": "chest_tightness_pressure",
              "patientTh": "แน่นหน้าอก เจ็บหน้าอก จุกแน่นคอหอย หรือแน่นลิ้นปี่ร้าวไปกราม/แขนซ้าย",
              "doctorTh": "แน่นหน้าอก/จุกแน่นคอหอย/ร้าวไปกรามแขน 🚩 (Suspected Acute MI / Inferior STEMI)",
              "isRedFlag": true
            },
            {
              "key": "diaphoresis_cold_sweat",
              "patientTh": "เหงื่อแตกท่วมตัว เสื้อเปียกชุ่ม ตัวเย็นเฉียบขณะเกิดอาการ",
              "doctorTh": "เหงื่อแตกท่วมตัวเย็นเฉียบ 🚩 (Profuse diaphoresis / Cardiogenic shock)",
              "isRedFlag": true
            },
            {
              "key": "syncope_presyncope",
              "patientTh": "หน้ามืด วูบ หรือหมดสติไปชั่วคราวร่วมด้วย",
              "doctorTh": "หน้ามืด วูบ หรือหมดสติ 🚩 (Syncope / Cardiogenic collapse)",
              "isRedFlag": true
            },
            {
              "key": "palpitation_racing_heart",
              "patientTh": "หัวใจเต้นเร็วรัวผิดปกติ หรือเต้นสะดุดเป็นจังหวะ",
              "doctorTh": "ใจสั่น เต้นเร็วรัว/สะดุด (Palpitations / Arrhythmia)"
            },
            {
              "key": "none_cardiac",
              "patientTh": "ไม่มีอาการผิดปกติทางหัวใจและเหงื่อแตก",
              "doctorTh": "ไม่มีอาการทางระบบหัวใจ"
            }
          ]
        },
        {
          "key": "vomitingNeuroFlags",
          "labelTh": "สัญญาณอันตรายทางสมองและระบบประสาท",
          "type": "multiple_choice",
          "options": [
            {
              "key": "severe_sudden_headache",
              "patientTh": "ปวดศีรษะรุนแรงมากผิดปกติ หรือปวดแบบฟ้าผ่าเฉียบพลัน",
              "doctorTh": "ปวดศีรษะรุนแรงเฉียบพลัน 🚩 (Thunderclap headache / SAH / Increased ICP)",
              "isRedFlag": true
            },
            {
              "key": "stiff_neck",
              "patientTh": "คอแข็งเกร็ง ก้มคอไม่ลง คางชิดอกไม่ได้",
              "doctorTh": "คอแข็งเกร็ง ก้มคอไม่ลง 🚩 (Nuchal rigidity / Meningismus)",
              "isRedFlag": true
            },
            {
              "key": "focal_weakness_numbness",
              "patientTh": "แขนหรือขาอ่อนแรงครึ่งซีก ปากเบี้ยว ยิ้มไม่เท่ากัน หรือชาครึ่งซีก",
              "doctorTh": "แขนขาอ่อนแรง ปากเบี้ยว ชาครึ่งซีก 🚩 (Focal Neurologic Deficit / Stroke)",
              "isRedFlag": true
            },
            {
              "key": "diplopia_blurred_vision",
              "patientTh": "มองเห็นภาพซ้อน หรือตาพร่ามัวเฉียบพลัน",
              "doctorTh": "เห็นภาพซ้อน ตามัวเฉียบพลัน 🚩 (Diplopia / Blurred vision / Papilledema)",
              "isRedFlag": true
            },
            {
              "key": "vertigo_ataxia",
              "patientTh": "เวียนศีรษะบ้านหมุนอย่างรุนแรง ทรงตัวไม่ได้ เดินเซ ปัดไปข้างหนึ่ง",
              "doctorTh": "เวียนศีรษะบ้านหมุนรุนแรง เดินเซ 🚩 (Severe vertigo / Cerebellar stroke)",
              "isRedFlag": true
            },
            {
              "key": "confusion_drowsiness",
              "patientTh": "ซึมลง สับสน ถามตอบไม่รู้เรื่อง หรือเรียกปลุกตื่นยาก",
              "doctorTh": "ซึมลง สับสน เรียกปลุกยาก 🚩 (Altered mental status / Encephalopathy)",
              "isRedFlag": true
            },
            {
              "key": "none_neuro",
              "patientTh": "ไม่มีอาการทางระบบประสาทข้างต้น",
              "doctorTh": "ไม่มีอาการทางระบบประสาท"
            }
          ]
        }
      ]
    },
    {
      "sectionNo": 5,
      "titleTh": "ภาวะขาดน้ำ การรับประทานอาหาร ยา และอาหารเป็นพิษ (Hydration, Medications & Food Toxins)",
      "questions": [
        {
          "key": "vomitingOralIntolerance",
          "labelTh": "ความสามารถในการรับประทานอาหารและน้ำในปัจจุบัน",
          "type": "single_choice",
          "options": [
            {
              "value": "can_drink_water",
              "patientTh": "จิบน้ำหรือเกลือแร่ได้บ้าง ไม่อาเจียนออกมาทั้งหมด",
              "doctorTh": "จิบน้ำได้บ้าง (Tolerates small sips of fluid)"
            },
            {
              "value": "intolerant_vomit_all",
              "patientTh": "ไม่สามารถดื่มน้ำหรือทานอะไรได้เลย ทานเข้าไปคำไหนอาเจียนพุ่งออกมาหมดทันที",
              "doctorTh": "ทานน้ำอาหารไม่ได้เลย อาเจียนออกหมด 🚩 (Complete oral intolerance / Intractable)",
              "isRedFlag": true
            }
          ]
        },
        {
          "key": "vomitingDehydrationSigns",
          "labelTh": "สัญญาณของการขาดน้ำรุนแรง",
          "type": "multiple_choice",
          "options": [
            {
              "key": "oliguria_anuria",
              "patientTh": "ปัสสาวะออกน้อยมากผิดปกติ สีเข้มจัด หรือไม่ปัสสาวะเลยตั้งแต่เช้า/เกิน 8 ชั่วโมง",
              "doctorTh": "ปัสสาวะไม่ออกหรือออกน้อยมาก 🚩 (Oliguria / Anuria / Prerenal AKI)",
              "isRedFlag": true
            },
            {
              "key": "marked_dry_mouth_thirst",
              "patientTh": "ปากแห้ง ผิวแห้ง ลิ้นแห้งแตก กระหายน้ำมาก",
              "doctorTh": "ปากแห้งผิวแห้งกระหายน้ำมาก 🚩 (Severe dehydration signs)",
              "isRedFlag": true
            },
            {
              "key": "postural_dizziness_blackout",
              "patientTh": "ลุกขึ้นยืนแล้วหน้ามืด เซ ตาพร่า วูบ ต้องนอนราบตลอดเวลา",
              "doctorTh": "ลุกยืนแล้วหน้ามืดวูบ 🚩 (Orthostatic presyncope / Volume depletion)",
              "isRedFlag": true
            },
            {
              "key": "cold_clammy_extremities",
              "patientTh": "ปลายมือปลายเท้าเย็นเฉียบ ชีพจรเต้นเร็วและเบา",
              "doctorTh": "ตัวเย็นซีด ปลายมือเท้าเย็น ชีพจรเบาเร็ว 🚩 (Hypovolemic shock signs)",
              "isRedFlag": true
            },
            {
              "key": "none_dehydration",
              "patientTh": "ไม่มีสัญญาณขาดน้ำรุนแรง ปัสสาวะออกสีปกติ",
              "doctorTh": "ไม่มีภาวะขาดน้ำรุนแรง"
            }
          ]
        },
        {
          "key": "vomitingPrecipitants",
          "labelTh": "ประวัติการใช้ยา สารพิษ และโรคประจำตัว",
          "type": "multiple_choice",
          "options": [
            {
              "key": "known_diabetes",
              "patientTh": "ผู้ป่วยโรคเบาหวาน (เสี่ยงต่อ Diabetic Ketoacidosis - DKA หรือ Severe Gastroparesis)",
              "doctorTh": "ผู้ป่วยเบาหวาน 🚩 (Diabetic Ketoacidosis / Gastroparesis risk)",
              "isRedFlag": true
            },
            {
              "key": "high_risk_medications",
              "patientTh": "รับประทานยาในกลุ่ม ดังต่อไปนี้ (ยาโรคหัวใจ Digoxin, ยาแก้ปวดข้อ NSAIDs, ยาต้ม/ยาลูกกลอน, เคมีบำบัด, ยาปฏิชีวนะ, Lithium)",
              "doctorTh": "รับประทานยาความเสี่ยงสูง 🚩 (High-risk drugs / Digoxin / NSAIDs / Chemo)",
              "isRedFlag": true
            },
            {
              "key": "natural_toxin_food",
              "patientTh": "เพิ่งรับประทานอาหารในกลุ่มเหล่านี้ เห็ด กลอย หน่อไม้ แมงดาถ้วย ปลาปักเป้า ลูกเนียง สบู่ดำ สบู่แดง",
              "doctorTh": "รับประทานอาหารกลุ่มเสี่ยงสารพิษรุนแรง 🚩 (Natural toxin ingestion - Mushrooms/Plants/Seafood)",
              "isRedFlag": true
            },
            {
              "key": "heavy_alcohol_or_withdrawal",
              "patientTh": "ดื่มสุราหนักก่อนเกิดอาการ หรือเพิ่งหยุดดื่มสุรากะทันหันใน 1–3 วันนี้",
              "doctorTh": "ดื่มสุราหนักหรือเพิ่งหยุดดื่ม 🚩 (Alcohol intoxication / Withdrawal / Alcoholic ketoacidosis)",
              "isRedFlag": true
            },
            {
              "key": "suspected_toxin_chemical",
              "patientTh": "สงสัยกินยาเกินขนาด สารเคมีทางการเกษตร ยาฆ่าแมลง หรือสารพิษอื่นๆ",
              "doctorTh": "สงสัยได้รับสารเคมี/กินยาเกินขนาด 🚩 (Acute toxic ingestion / Overdose)",
              "isRedFlag": true
            },
            {
              "key": "general_food_poisoning",
              "patientTh": "รับประทานอาหารร่วมกับผู้อื่นแล้วมีคนมีอาการคล้ายกัน หรือทานอาหารค้างคืน/อาหารทะเลทั่วไป",
              "doctorTh": "รับประทานอาหารร่วมกับผู้อื่นมีอาการคล้ายกัน (Suspected Food poisoning)"
            },
            {
              "key": "none_precipitants",
              "patientTh": "ปฏิเสธประวัติดังกล่าวข้างต้น",
              "doctorTh": "ปฏิเสธประวัติยาและสารพิษ"
            }
          ]
        }
      ]
    }
  ]
},
  seedPatients: [
  {
    "id": "case-105",
    "queue_number": "A-105",
    "hn": "6710512",
    "name": "นายสมพร กิจพาณิชย์",
    "age": 62,
    "gender": "ชาย",
    "chief_complaint": "vomiting",
    "chief_complaint_title": "คลื่นไส้ / อาเจียนรุนแรง",
    "status": "waiting",
    "timestamp": "2026-10-26T02:06:26.425Z",
    "durationVal": 18,
    "durationUnit": "hours",
    "vomitingOnsetMode": "sudden_severe",
    "vomitingFrequencyToday": "severe_6_10",
    "vomitingFoodRelation": "independent_constant",
    "vomitusCharacter": "yellow_green_bile",
    "vomitingPatternType": "normal_retching",
    "vomitusVolumePerTime": "large_bowl",
    "vomitingHasAbdominalPain": true,
    "vomitingAbdpainLocs": [
      "periumbilical",
      "diffuse"
    ],
    "vomitingAbdpainChar": "cramping_colicky",
    "vomitingBowelHabit": "constipation_obstipation_gte24h",
    "vomitingConstipationSub": "no_stool_no_gas",
    "vomitingAbdominalDistension": "marked_distension_tight",
    "vomitingPriorAbdominalSurgery": "yes",
    "vomitingCardiacFlags": [
      "none_cardiac"
    ],
    "vomitingNeuroFlags": [
      "none_neuro"
    ],
    "vomitingOralIntolerance": "intolerant_vomit_all",
    "vomitingDehydrationSigns": [
      "oliguria_anuria",
      "marked_dry_mouth_thirst"
    ],
    "vomitingPrecipitants": [
      "none_precipitants"
    ],
    "vomitingAdditionalNotes": "ปวดท้องบิดเป็นพักๆ ท้องอืดป่องแน่นตึง ไม่ผายลมมา 2 วัน เคยผ่าตัดไส้ติ่งเมื่อ 10 ปีก่อน",
    "underlying": [
      "ความดันโลหิตสูง (HT)",
      "เคยผ่าตัดไส้ติ่งอักเสบ (Appendectomy 10 ปีก่อน)"
    ],
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "Amlodipine (5) 1x1 pc",
    "doctor_notes": {
      "additional_hpi": "ชายอายุ 62 ปี มีประวัติเคยผ่าตัดไส้ติ่ง 10 ปีก่อน 18 ชั่วโมงก่อนมารพ. เริ่มมีอาการปวดท้องบิดเกร็งเป็นพักๆ ทั่วท้อง ท้องอืดแน่นตึงอย่างรวดเร็ว ร่วมกับอาเจียนพุ่งเป็นน้ำดีสีเขียวจัด 7 ครั้ง ปริมาณมาก ทะลักเต็มชาม ทานน้ำทานข้าวไม่ได้เลย อาเจียนออกหมด ไม่ถ่ายอุจจาระและไม่ผายลมมา 2 วัน ปัสสาวะไม่ออกตั้งแต่เมื่อคืน",
      "physical_exam": "BT 37.2 C, PR 104/min, RR 20/min, BP 118/74 mmHg, SpO2 98%. Abdomen: Marked distension, hyperactive high-pitched bowel sounds with rushes and tinkles, appendectomy surgical scar at RLQ, generalized tenderness without frank rebound tenderness. DRE: Empty rectal vault.",
      "preliminary_dx": "Mechanical Small Bowel Obstruction (SBO), likely secondary to Post-operative Peritoneal Adhesions",
      "plan": "1. Strict NPO, insert NG tube for continuous gastrointestinal decompression.\n2. IV fluid resuscitation with 0.9% NSS 1,000 mL load in 1 hour, then continue 120 mL/hr.\n3. STAT Plain Film Abdomen Series (Supine & Upright): Look for multiple air-fluid levels and dilated small bowel loops without colonic gas.\n4. STAT Labs: CBC, Electrolytes, BUN, Cr (Assess prerenal AKI/hypokalemic hypochloremic alkalosis), Coagulation.\n5. Urgent Surgical Consultation for evaluation and possible exploratory laparotomy/laparoscopic adhesiolysis."
    }
  },
  {
    "id": "case-106",
    "queue_number": "A-106",
    "hn": "6710589",
    "name": "นางปราณี ว่องวิชิต",
    "age": 68,
    "gender": "หญิง",
    "chief_complaint": "vomiting",
    "chief_complaint_title": "คลื่นไส้ / อาเจียนรุนแรง",
    "status": "waiting",
    "timestamp": "2026-10-26T02:21:26.425Z",
    "durationVal": 3,
    "durationUnit": "hours",
    "vomitingOnsetMode": "sudden_severe",
    "vomitingFrequencyToday": "moderate_3_5",
    "vomitingFoodRelation": "morning_fasting",
    "vomitusCharacter": "clear_gastric_juice",
    "vomitingPatternType": "normal_retching",
    "vomitusVolumePerTime": "moderate_cup",
    "vomitingHasAbdominalPain": true,
    "vomitingAbdpainLocs": [
      "epigastrium"
    ],
    "vomitingAbdpainChar": "dull_aching",
    "vomitingBowelHabit": "normal_bowel",
    "vomitingAbdominalDistension": "none",
    "vomitingPriorAbdominalSurgery": "no",
    "vomitingCardiacFlags": [
      "chest_tightness_pressure",
      "diaphoresis_cold_sweat",
      "syncope_presyncope"
    ],
    "vomitingNeuroFlags": [
      "none_neuro"
    ],
    "vomitingOralIntolerance": "intolerant_vomit_all",
    "vomitingDehydrationSigns": [
      "cold_clammy_extremities",
      "postural_dizziness_blackout"
    ],
    "vomitingPrecipitants": [
      "known_diabetes"
    ],
    "vomiting_lmp_status": "post_menopausal_or_hysterectomy",
    "vomitingAdditionalNotes": "ตื่นเช้ามาคลื่นไส้อาเจียน เหงื่อแตกท่วมตัว เสื้อเปียกชุ่ม ตัวเย็นเฉียบ จุกแน่นลิ้นปี่และคอหอย",
    "underlying": [
      "เบาหวานชนิดที่ 2 (DM type 2)",
      "ไขมันในเลือดสูง (Dyslipidemia)"
    ],
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "Metformin (500) 1x2 pc, Glipizide (5) 1x1 ac, Atorvastatin (20) 1x1 hs",
    "doctor_notes": {
      "additional_hpi": "หญิงอายุ 68 ปี โรคประจำตัวเบาหวานและไขมันในเลือดสูง เช้าวันนี้เวลาประมาณ 06.00 น. ตื่นนอนขึ้นมามีอาการคลื่นไส้อาเจียนรุนแรง 4 ครั้ง เป็นน้ำย่อยใสๆ ร่วมกับเหงื่อแตกท่วมตัวจนเสื้อเปียกชุ่ม ตัวเย็นเฉียบ หน้ามืดวิงเวียนจะหมดสติ และรู้สึกจุกแน่นอึดอัดที่ใต้ลิ้นปี่ร้าวขึ้นคอหอย ปฏิเสธอาการแสบร้อนกลางอก ญาติสังเกตเห็นหน้าซีดมากจึงรีบนำส่ง ER",
      "physical_exam": "BT 36.4 C, PR 54/min (Bradycardia), RR 20/min, BP 88/56 mmHg (Hypotension), SpO2 97% on room air. General: Pale, marked diaphoresis, cool and clammy extremities. Heart: Bradycardia, regular rhythm, no murmur. Abdomen: Soft, mild epigastric discomfort without guarding or peritoneal signs.",
      "preliminary_dx": "Acute Inferior Wall STEMI with Sinus Bradycardia and Cardiogenic Shock in Elderly Diabetic Female (Atypical ACS Presentation)",
      "plan": "1. Immediate 12-lead EKG STAT within 10 minutes: Assess ST-elevation in leads II, III, aVF (Inferior wall) and perform right-sided leads (V3R, V4R) to rule out RV infarction.\n2. Activate Cardiac Cath Lab / STEMI Fast Track for Primary PCI STAT.\n3. Establish 2 large-bore IV lines, IV fluid resuscitation (caution with RV involvement, avoid nitrates/morphine if BP < 90 or RV infarction suspected).\n4. Send STAT Cardiac Biomarkers: High-sensitivity Troponin-I/T, CK-MB, Electrolytes, BUN, Cr, CBC.\n5. Loading antiplatelets: Aspirin 300 mg chewable + Clopidogrel 300-600 mg / Ticagrelor 180 mg orally as indicated by cardiologist.\n6. Continuous cardiac monitoring for high-degree AV block."
    }
  },
  {
    "id": "case-107",
    "queue_number": "A-107",
    "hn": "6710644",
    "name": "นางสาวกานดา สุขเจริญ",
    "age": 24,
    "gender": "หญิง",
    "chief_complaint": "vomiting",
    "chief_complaint_title": "คลื่นไส้ / อาเจียนรุนแรง",
    "status": "waiting",
    "timestamp": "2026-10-26T02:31:26.425Z",
    "durationVal": 12,
    "durationUnit": "hours",
    "vomitingOnsetMode": "sudden_severe",
    "vomitingFrequencyToday": "intractable_gt_10",
    "vomitingFoodRelation": "independent_constant",
    "vomitusCharacter": "food_particles",
    "vomitingPatternType": "normal_retching",
    "vomitusVolumePerTime": "moderate_cup",
    "vomitingHasAbdominalPain": true,
    "vomitingAbdpainLocs": [
      "diffuse"
    ],
    "vomitingAbdpainChar": "cramping_colicky",
    "vomitingBowelHabit": "normal_bowel",
    "vomitingAbdominalDistension": "mild_bloating",
    "vomitingPriorAbdominalSurgery": "no",
    "vomitingCardiacFlags": [
      "palpitation_racing_heart"
    ],
    "vomitingNeuroFlags": [
      "confusion_drowsiness"
    ],
    "vomitingOralIntolerance": "intolerant_vomit_all",
    "vomitingDehydrationSigns": [
      "oliguria_anuria",
      "marked_dry_mouth_thirst",
      "postural_dizziness_blackout"
    ],
    "vomitingPrecipitants": [
      "known_diabetes"
    ],
    "vomiting_lmp_status": "regular_lmp_exact",
    "vomitingLmpDate": "10/10/2026",
    "vomitingPregnancyTestSelf": "tested_negative",
    "vomitingAdditionalNotes": "เป็นเบาหวานชนิดที่ 1 ขาดยาอินซูลิน 2 วัน อาเจียนเกิน 10 ครั้ง หายใจหอบลึก กระหายน้ำมาก ปัสสาวะไม่ออก",
    "underlying": [
      "เบาหวานชนิดที่ 1 (Type 1 DM on Basal-Bolus Insulin)"
    ],
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "Insulin Glargine 18 units hs, Insulin Lispro 6 units ac (ขาดการฉีดยา 2 วันเนื่องจากยาหมด)",
    "doctor_notes": {
      "additional_hpi": "หญิงอายุ 24 ปี เป็นเบาหวานชนิดที่ 1 ขาดการฉีดอินซูลินมา 2 วันเนื่องจากยาหมดและไม่ได้ไปรับยาตามนัด 12 ชั่วโมงก่อนมารพ. เริ่มมีอาการคลื่นไส้อาเจียนรุนแรง อาเจียนมากกว่า 10 ครั้ง ทานน้ำไม่ได้เลย ปวดเกร็งทั่วท้อง กระหายน้ำมาก ปากแห้งคอแห้ง หายใจหอบลึกและเริ่มมีอาการซึมลง สับสน ถามตอบช้า",
      "physical_exam": "BT 36.8 C, PR 122/min (Sinus Tachycardia), RR 28/min (Deep, labored Kussmaul breathing with sweet fruity acetone breath), BP 94/60 mmHg, SpO2 99% on room air. General: Lethargic, severely dehydrated, parched tongue, sunken eyes, skin turgor markedly decreased. Abdomen: Mild diffuse tenderness without rebound, soft. Point-of-Care DTX: High (> 500 mg/dL). Bedside Urine Dipstick: Ketone 4+, Glucose 4+.",
      "preliminary_dx": "Diabetic Ketoacidosis (DKA) with Severe Dehydration and Impending Hypovolemic Shock secondary to Insulin Non-compliance in Type 1 DM",
      "plan": "1. Establish 2 large-bore IV lines, immediate fluid resuscitation: 0.9% NSS 1,000-1,500 mL IV in the first hour, monitor urine output via Foley catheter.\n2. STAT Blood Gas (VBG/ABG), Electrolytes (assess Potassium prior to insulin), BUN, Cr, Blood Ketone (Beta-hydroxybutyrate), CBC, Urine analysis.\n3. Once serum Potassium > 3.3 mEq/L, initiate Regular Insulin IV Infusion at 0.1 units/kg/hr.\n4. Frequent DTX monitoring every 1 hour, Electrolytes/VBG every 2-4 hours.\n5. Admit to Intensive Care Unit (ICU) / High Dependency Unit (HDU) for severe DKA protocol."
    }
  },
  {
    "id": "case-108",
    "queue_number": "A-108",
    "hn": "6710701",
    "name": "นายชวลิต มณีโชติ",
    "age": 32,
    "gender": "ชาย",
    "chief_complaint": "vomiting",
    "chief_complaint_title": "คลื่นไส้ / อาเจียนรุนแรง",
    "status": "waiting",
    "timestamp": "2026-10-26T02:36:26.425Z",
    "durationVal": 6,
    "durationUnit": "hours",
    "vomitingOnsetMode": "gradual_worsening",
    "vomitingFrequencyToday": "moderate_3_5",
    "vomitingFoodRelation": "delayed_postprandial_hours",
    "vomitusCharacter": "food_particles",
    "vomitingPatternType": "normal_retching",
    "vomitusVolumePerTime": "moderate_cup",
    "vomitingHasAbdominalPain": true,
    "vomitingAbdpainLocs": [
      "epigastrium",
      "periumbilical"
    ],
    "vomitingAbdpainChar": "cramping_colicky",
    "vomitingBowelHabit": "diarrhea_active",
    "vomitingDiarrheaFreq": 3,
    "vomitingDiarrheaStools": [
      "watery"
    ],
    "vomitingAbdominalDistension": "none",
    "vomitingPriorAbdominalSurgery": "no",
    "vomitingCardiacFlags": [
      "none_cardiac"
    ],
    "vomitingNeuroFlags": [
      "none_neuro"
    ],
    "vomitingOralIntolerance": "can_drink_water",
    "vomitingDehydrationSigns": [
      "none_dehydration"
    ],
    "vomitingPrecipitants": [
      "general_food_poisoning"
    ],
    "vomitingAdditionalNotes": "คลื่นไส้อาเจียน 4 ครั้ง ถ่ายเหลวเป็นน้ำ 3 ครั้ง หลังทานส้มตำปูปลาร้าเมื่อคืน ไม่มีไข้ จิบน้ำเกลือแร่ได้",
    "underlying": ["ปฏิเสธ"],
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "ไม่มี",
    "doctor_notes": {
      "additional_hpi": "ชายอายุ 32 ปี ไม่มีโรคประจำตัว เมื่อคืนรับประทานส้มตำปูปลาร้ากับเพื่อน 6 ชั่วโมงก่อนมารพ. เริ่มมีอาการมวนท้อง คลื่นไส้ และอาเจียนเป็นเศษอาหาร 4 ครั้ง ร่วมกับถ่ายอุจจาระเหลวเป็นน้ำ 3 ครั้ง ไม่มีมูกเลือดปน ไม่มีไข้ สามารถจิบน้ำเกลือแร่โออาร์เอสได้บ้าง ปัสสาวะออกสีเหลืองปกติ ไม่มีอาการหน้ามืดเป็นลม",
      "physical_exam": "BT 36.7 C, PR 82/min, RR 16/min, BP 122/78 mmHg, SpO2 99%. General: Alert, cooperative, mild dry lips, good skin turgor. Abdomen: Soft, non-distended, hyperactive bowel sounds, mild diffuse tenderness without guarding or rebound tenderness.",
      "preliminary_dx": "Acute Food Poisoning / Acute Gastroenteritis with Mild-to-Moderate Dehydration",
      "plan": "1. Oral Rehydration Therapy (ORS solution) encouraged in frequent small sips.\n2. IV fluid support if unable to maintain oral hydration: 500-1,000 mL Acetar or Ringer Lactate IV drip.\n3. Antiemetic: Ondansetron 4-8 mg IV or Metoclopramide 10 mg IV STAT.\n4. Antispasmodic for colicky pain: Hyoscine butylbromide 20 mg IV prn.\n5. Discharge home with ORS packets, Paracetamol, Domperidone, and strict return-to-ER warning signs."
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
    setVal('vomitingDurationVal', patient.durationVal || '');
    setVal('vomitingDurationUnit', patient.durationUnit || 'hours');

    setRadioValue('vomitingOnsetMode', patient.vomitingOnsetMode);
    setRadioValue('vomitingFrequencyToday', patient.vomitingFrequencyToday);
    setRadioValue('vomitingFoodRelation', patient.vomitingFoodRelation);
    setRadioValue('vomitusCharacter', patient.vomitusCharacter);
    setRadioValue('vomitingPatternType', patient.vomitingPatternType);
    setRadioValue('vomitusVolumePerTime', patient.vomitusVolumePerTime);

    const abdCb = document.getElementById('vomitingHasAbdominalPain');
    if (abdCb) abdCb.checked = Boolean(patient.vomitingHasAbdominalPain);
    handleVomitingAbdpainToggle(abdCb);
    if (patient.vomitingHasAbdominalPain) {
      const locs = Array.isArray(patient.vomitingAbdpainLocs) ? patient.vomitingAbdpainLocs : [];
      document.querySelectorAll('input[name="vomitingAbdpainLocs"]').forEach(cb => {
        cb.checked = locs.includes(cb.value);
      });
      setRadioValue('vomitingAbdpainChar', patient.vomitingAbdpainChar);
    }

    setRadioValue('vomitingBowelHabit', patient.vomitingBowelHabit);
    handleVomitingBowelHabitChange(patient.vomitingBowelHabit);
    if (patient.vomitingBowelHabit === 'diarrhea_active') {
      setVal('vomitingDiarrheaFreq', patient.vomitingDiarrheaFreq || '');
      const dStools = Array.isArray(patient.vomitingDiarrheaStools) ? patient.vomitingDiarrheaStools : [];
      document.querySelectorAll('input[name="vomitingDiarrheaStools"]').forEach(cb => {
        cb.checked = dStools.includes(cb.value);
      });
    } else if (patient.vomitingBowelHabit === 'bloody_melena_stool') {
      setRadioValue('vomitingBloodyStoolChar', patient.vomitingBloodyStoolChar);
    } else if (patient.vomitingBowelHabit === 'constipation_obstipation_gte24h') {
      setRadioValue('vomitingConstipationSub', patient.vomitingConstipationSub);
      setRadioValue('vomitingPriorAbdominalSurgery', patient.vomitingPriorAbdominalSurgery || 'no');
    }

    setRadioValue('vomitingAbdominalDistension', patient.vomitingAbdominalDistension);

    const cFlags = Array.isArray(patient.vomitingCardiacFlags) ? patient.vomitingCardiacFlags : [];
    document.querySelectorAll('input[name="vomitingCardiacFlags"]').forEach(cb => {
      cb.checked = cFlags.includes(cb.value);
    });

    const nFlags = Array.isArray(patient.vomitingNeuroFlags) ? patient.vomitingNeuroFlags : [];
    document.querySelectorAll('input[name="vomitingNeuroFlags"]').forEach(cb => {
      cb.checked = nFlags.includes(cb.value);
    });

    setRadioValue('vomitingOralIntolerance', patient.vomitingOralIntolerance);

    const dehyFlags = Array.isArray(patient.vomitingDehydrationSigns) ? patient.vomitingDehydrationSigns : [];
    document.querySelectorAll('input[name="vomitingDehydrationSigns"]').forEach(cb => {
      cb.checked = dehyFlags.includes(cb.value);
    });

    const precips = Array.isArray(patient.vomitingPrecipitants) ? patient.vomitingPrecipitants : [];
    document.querySelectorAll('input[name="vomitingPrecipitants"]').forEach(cb => {
      cb.checked = precips.includes(cb.value);
    });

    const medsCb = document.getElementById('vomitingMedsCb');
    handleVomitingMedsToggle(medsCb);
    if (precips.includes('high_risk_medications')) {
      const mList = Array.isArray(patient.vomitingMedList) ? patient.vomitingMedList : [];
      document.querySelectorAll('input[name="vomitingMedList"]').forEach(cb => {
        cb.checked = mList.includes(cb.value);
      });
    }

    const toxFoodCb = document.getElementById('vomitingToxinFoodCb');
    handleVomitingToxinFoodToggle(toxFoodCb);
    if (precips.includes('natural_toxin_food')) {
      setVal('vomitingToxinFoodType', patient.vomitingToxinFoodType || patient.vomitingToxinFoodDetails || '');
      setVal('vomitingToxinFoodTime', patient.vomitingToxinFoodTime || '');
      setVal('vomitingToxinFoodPlace', patient.vomitingToxinFoodPlace || '');
      setVal('vomitingToxinFoodCoEaters', patient.vomitingToxinFoodCoEaters || '');
      setVal('vomitingToxinFoodDetails', patient.vomitingToxinFoodDetails || '');
    }

    const chemCb = document.getElementById('vomitingChemicalCb');
    handleVomitingChemicalToggle(chemCb);
    if (precips.includes('suspected_toxin_chemical')) {
      setVal('vomitingChemicalDetails', patient.vomitingChemicalDetails || '');
    }

    if (patient.gender === 'หญิง' || patient.vomiting_lmp_status) {
      toggleBranch('vomiting_branch_female_lmp', true);
      setRadioValue('vomiting_lmp_status', patient.vomiting_lmp_status);
      handleVomitingLmpStatusChange(patient.vomiting_lmp_status);
      setVal('vomitingLmpDate', formatDateDdMmYyyy(patient.vomitingLmpDate || ''));
      setRadioValue('vomitingPregnancyTestSelf', patient.vomitingPregnancyTestSelf);
    } else {
      toggleBranch('vomiting_branch_female_lmp', false);
    }

    setVal('vomitingAdditionalNotes', patient.vomitingAdditionalNotes || '');
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
      // ------------------ VOMITING INTAKE ------------------
      const _rawDur = parseFloat(document.getElementById('vomitingDurationVal')?.value); const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
      const durationUnit = document.getElementById('vomitingDurationUnit')?.value || 'hours';

      const vomitingOnsetMode = document.querySelector('input[name="vomitingOnsetMode"]:checked')?.value || 'unspecified';
      const vomitingFrequencyToday = document.querySelector('input[name="vomitingFrequencyToday"]:checked')?.value || 'unspecified';
      const vomitingFoodRelation = document.querySelector('input[name="vomitingFoodRelation"]:checked')?.value || 'unspecified';

      const vomitusCharacter = document.querySelector('input[name="vomitusCharacter"]:checked')?.value || 'unspecified';
      const vomitingPatternType = document.querySelector('input[name="vomitingPatternType"]:checked')?.value || 'unspecified';
      const vomitusVolumePerTime = document.querySelector('input[name="vomitusVolumePerTime"]:checked')?.value || 'unspecified';

      // Abdominal & GI
      const vomitingHasAbdominalPain = document.getElementById('vomitingHasAbdominalPain')?.checked || false;
      const vomitingAbdpainLocs = vomitingHasAbdominalPain ? Array.from(document.querySelectorAll('input[name="vomitingAbdpainLocs"]:checked')).map(cb => cb.value) : [];
      const vomitingAbdpainChar = vomitingHasAbdominalPain ? (document.querySelector('input[name="vomitingAbdpainChar"]:checked')?.value || '') : '';

      const vomitingBowelHabit = document.querySelector('input[name="vomitingBowelHabit"]:checked')?.value || 'unspecified';
      const vomitingDiarrheaFreq = vomitingBowelHabit === 'diarrhea_active' ? (parseInt(document.getElementById('vomitingDiarrheaFreq')?.value, 10) || 0) : 0;
      const vomitingDiarrheaStools = vomitingBowelHabit === 'diarrhea_active' ? Array.from(document.querySelectorAll('input[name="vomitingDiarrheaStools"]:checked')).map(cb => cb.value) : [];
      const vomitingBloodyStoolChar = vomitingBowelHabit === 'bloody_melena_stool' ? (document.querySelector('input[name="vomitingBloodyStoolChar"]:checked')?.value || '') : '';
      const vomitingConstipationSub = vomitingBowelHabit === 'constipation_obstipation_gte24h' ? (document.querySelector('input[name="vomitingConstipationSub"]:checked')?.value || '') : '';

      const vomitingAbdominalDistension = document.querySelector('input[name="vomitingAbdominalDistension"]:checked')?.value || 'none';
      const vomitingPriorAbdominalSurgery = vomitingBowelHabit === 'constipation_obstipation_gte24h'
        ? (document.querySelector('input[name="vomitingPriorAbdominalSurgery"]:checked')?.value || 'no')
        : 'no';

      // Extra-abdominal Red Flags
      const vomitingCardiacFlags = Array.from(document.querySelectorAll('input[name="vomitingCardiacFlags"]:checked')).map(cb => cb.value);
      const vomitingNeuroFlags = Array.from(document.querySelectorAll('input[name="vomitingNeuroFlags"]:checked')).map(cb => cb.value);

      // Hydration & Dehydration
      const vomitingOralIntolerance = document.querySelector('input[name="vomitingOralIntolerance"]:checked')?.value || 'unspecified';
      const vomitingDehydrationSigns = Array.from(document.querySelectorAll('input[name="vomitingDehydrationSigns"]:checked')).map(cb => cb.value);

      // Precipitants, Meds & Toxins
      const vomitingPrecipitants = Array.from(document.querySelectorAll('input[name="vomitingPrecipitants"]:checked')).map(cb => cb.value);
      const vomitingMedList = vomitingPrecipitants.includes('high_risk_medications') ? Array.from(document.querySelectorAll('input[name="vomitingMedList"]:checked')).map(cb => cb.value) : [];
      
      const vomitingToxinFoodType = vomitingPrecipitants.includes('natural_toxin_food') ? (document.getElementById('vomitingToxinFoodType')?.value.trim() || '') : '';
      const vomitingToxinFoodTime = vomitingPrecipitants.includes('natural_toxin_food') ? (document.getElementById('vomitingToxinFoodTime')?.value.trim() || '') : '';
      const vomitingToxinFoodPlace = vomitingPrecipitants.includes('natural_toxin_food') ? (document.getElementById('vomitingToxinFoodPlace')?.value.trim() || '') : '';
      const vomitingToxinFoodCoEaters = vomitingPrecipitants.includes('natural_toxin_food') ? (document.getElementById('vomitingToxinFoodCoEaters')?.value.trim() || '') : '';
      const vomitingToxinFoodDetails = [vomitingToxinFoodType, vomitingToxinFoodTime, vomitingToxinFoodPlace, vomitingToxinFoodCoEaters].filter(Boolean).join(', ');

      const vomitingChemicalDetails = vomitingPrecipitants.includes('suspected_toxin_chemical') ? (document.getElementById('vomitingChemicalDetails')?.value.trim() || '') : '';

      const vomitingAdditionalNotes = document.getElementById('vomitingAdditionalNotes')?.value.trim() || '';
      if (vomitingAdditionalNotes) otherSymptomsFree = vomitingAdditionalNotes;

      // Female LMP
      const vomiting_lmp_status = document.querySelector('input[name="vomiting_lmp_status"]:checked')?.value || '';
      const vomitingLmpDate = document.getElementById('vomitingLmpDate')?.value || '';
      const vomitingPregnancyTestSelf = document.querySelector('input[name="vomitingPregnancyTestSelf"]:checked')?.value || '';

      newPatient = {
        id: recordId,
        queue_number: queueNumber,
        hn: randomHn,
        name: patientName,
        age: patientAge,
        gender: gender,
        chief_complaint: 'vomiting',
        chief_complaint_title: 'คลื่นไส้ / อาเจียนรุนแรง',
        status: recordStatus,
        timestamp: new Date().toISOString(),
        durationVal,
        durationUnit,
        vomitingOnsetMode,
        vomitingFrequencyToday,
        vomitingFoodRelation,
        vomitusCharacter,
        vomitingPatternType,
        vomitusVolumePerTime,
        vomitingHasAbdominalPain,
        vomitingAbdpainLocs,
        vomitingAbdpainChar,
        vomitingBowelHabit,
        vomitingDiarrheaFreq,
        vomitingDiarrheaStools,
        vomitingBloodyStoolChar,
        vomitingConstipationSub,
        vomitingAbdominalDistension,
        vomitingPriorAbdominalSurgery,
        vomitingCardiacFlags,
        vomitingNeuroFlags,
        vomitingOralIntolerance,
        vomitingDehydrationSigns,
        vomitingPrecipitants,
        vomitingMedList,
        vomitingToxinFoodType,
        vomitingToxinFoodTime,
        vomitingToxinFoodPlace,
        vomitingToxinFoodCoEaters,
        vomitingToxinFoodDetails,
        vomitingChemicalDetails,
        vomitingAdditionalNotes,
        vomiting_lmp_status,
        vomitingLmpDate,
        vomitingPregnancyTestSelf,
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
    return detectVomitingRedFlags(p).length > 0;
  },

  evaluateRedFlags(patient) {
    const redFlags = [];
    redFlags.push(...detectVomitingRedFlags(patient));
    return redFlags;
  },

  updateOutputs(patient) {
    updateVomitingOutputs(patient);
  },

  generateCds(patient, ctx) {
    const { rfs, ddxList, workupList, managementList } = ctx;
    const char = patient.vomitusCharacter || '';
    const bowel = patient.vomitingBowelHabit || '';
    const bloodyStoolChar = patient.vomitingBloodyStoolChar || '';
    const diarrheaStools = patient.vomitingDiarrheaStools || [];
    const constipationSub = patient.vomitingConstipationSub || '';
    const distension = patient.vomitingAbdominalDistension || '';
    const priorSurgery = patient.vomitingPriorAbdominalSurgery === 'yes';
    const cardiac = patient.vomitingCardiacFlags || [];
    const neuro = patient.vomitingNeuroFlags || [];
    const dehy = patient.vomitingDehydrationSigns || [];
    const precipitants = patient.vomitingPrecipitants || [];
    const meds = patient.vomitingMedList || [];
    const oralIntol = patient.vomitingOralIntolerance === 'intolerant_vomit_all';

    const isSbo = (bowel === 'constipation_obstipation_gte24h' && (constipationSub === 'no_stool_no_gas' || constipationSub === 'no_stool_can_pass_gas')) ||
                  char === 'brown_feculent' || (distension === 'marked_distension_tight' && priorSurgery);

    const isGiBleed = char === 'blood_bright_red' || char === 'blood_coffee_ground' ||
                      (bowel === 'bloody_melena_stool' && (bloodyStoolChar === 'black_tarry_melena' || bloodyStoolChar === 'pure_bright_red' || bloodyStoolChar === 'dark_clots')) ||
                      (bowel === 'diarrhea_active' && (diarrheaStools.includes('bloody') || diarrheaStools.includes('dark_tarry')));

    const isAtypicalAcs = cardiac.includes('chest_tightness_pressure') ||
                          (cardiac.includes('diaphoresis_cold_sweat') && (patient.age >= 50 || precipitants.includes('known_diabetes')));

    const isDka = precipitants.includes('known_diabetes') && (dehy.includes('marked_dry_mouth_thirst') || dehy.includes('oliguria_anuria') || oralIntol);

    const isIncreasedIcpOrCns = patient.vomitingPatternType === 'projectile_vomiting' ||
                                neuro.includes('severe_sudden_headache') ||
                                neuro.includes('stiff_neck') ||
                                neuro.includes('focal_weakness_numbness') ||
                                neuro.includes('confusion_drowsiness');

    const isSevereGeDehydration = bowel === 'diarrhea_active' && (oralIntol || dehy.includes('oliguria_anuria') || dehy.includes('postural_dizziness_blackout'));

    const isNaturalToxin = precipitants.includes('natural_toxin_food');
    const isHighRiskMedTox = precipitants.includes('high_risk_medications') && (meds.includes('digoxin') || meds.includes('lithium_psych'));

    const isEctopic = patient.gender === 'หญิง' && (patient.vomiting_lmp_status === 'missed_period' || patient.vomitingPregnancyTestSelf === 'tested_positive');

    if (isSbo) {
      ddxList.push(`${ddxList.length + 1}. Acute Small Bowel Obstruction (SBO) / Adhesive Strangulated Obstruction 🚩`);
    }
    if (isGiBleed) {
      ddxList.push(`${ddxList.length + 1}. Acute Upper GI Bleeding (Bleeding Peptic Ulcer / Mallory-Weiss Tear / Variceal Bleed) 🚩`);
    }
    if (isAtypicalAcs) {
      ddxList.push(`${ddxList.length + 1}. Acute Coronary Syndrome (Inferior STEMI / NSTEMI with Vagal Stimulation) 🚩`);
    }
    if (isDka) {
      ddxList.push(`${ddxList.length + 1}. Diabetic Ketoacidosis (DKA) / Hyperosmolar Hyperglycemic State (HHS) 🚩`);
    }
    if (isIncreasedIcpOrCns) {
      ddxList.push(`${ddxList.length + 1}. Increased Intracranial Pressure (ICH / Posterior Circulation Stroke / Meningitis) 🚩`);
    }
    if (isNaturalToxin) {
      ddxList.push(`${ddxList.length + 1}. Natural Botanical / Marine Toxin Poisoning (เห็ดป่า / กลอย / แมงดาถ้วย / ปลาปักเป้า / ลูกเนียง) 🚩`);
    }
    if (isHighRiskMedTox) {
      ddxList.push(`${ddxList.length + 1}. High-Risk Drug Toxicity (Digoxin Toxicity / Lithium Toxicity) 🚩`);
    }
    if (isEctopic) {
      ddxList.push(`${ddxList.length + 1}. Ruptured Ectopic Pregnancy / Severe Hyperemesis Gravidarum 🚩`);
    }
    if (isSevereGeDehydration || ddxList.length === 0) {
      ddxList.push(`${ddxList.length + 1}. Acute Gastroenteritis / Food Poisoning with Severe Dehydration & Prerenal AKI`);
    }

    workupList.push('• CBC, BUN/Cr, Electrolytes (Na, K, Cl, HCO3, Mg, PO4), Dextrostix (DTX)');
    if (isSbo || char === 'brown_feculent' || distension === 'marked_distension_tight') {
      workupList.push('• Acute Abdomen Series (Plain Abdomen Erect / Supine + CXR Upright) และพิจารณา CT Whole Abdomen');
    }
    if (isAtypicalAcs || patient.age >= 50 || precipitants.includes('known_diabetes')) {
      workupList.push('• 12-Lead EKG ทันทีภายใน 10 นาที (รวม Right-sided leads V3R, V4R) และ High-sensitivity Troponin');
    }
    if (precipitants.includes('known_diabetes') || isDka) {
      workupList.push('• Serum/Urine Ketone, Venous Blood Gas (VBG), คำนวณ Anion Gap');
    }
    if (isIncreasedIcpOrCns) {
      workupList.push('• Urgent Non-Contrast CT Brain เพื่อประเมินภาวะ ICH / SAH / Increased ICP');
    }
    if (isHighRiskMedTox) {
      workupList.push('• Serum Digoxin Level / Serum Lithium Level, 12-Lead EKG, Renal Function');
    }
    if (patient.gender === 'หญิง' && (patient.vomiting_lmp_status === 'missed_period' || patient.vomitingPregnancyTestSelf === 'tested_positive')) {
      workupList.push('• Urine Pregnancy Test (UPT) และ Pelvic / Transvaginal Ultrasound (TVS)');
    }

    managementList.push('• Airway & Aspiration Precautions: จัดท่านอนตะแคงกึ่งคว่ำ (Recovery position) หรือยกหัวสูง 30–45 องศา เตรียม Suction ป้องกัน Aspiration Pneumonia');
    if (oralIntol || dehy.length > 0 || isGiBleed) {
      managementList.push('• IV Fluid Resuscitation: เปิดเส้น IV ขนาดใหญ่ เริ่มให้ 0.9% NSS หรือ Ringer\'s Acetate 1,000 mL IV drip และติดตาม Urine Output ≥ 0.5 mL/kg/hr');
    }
    if (isSbo || char === 'brown_feculent' || distension === 'marked_distension_tight') {
      managementList.push('• Strict NPO & NG Decompression: งดน้ำและอาหารทางปาก ใส่สาย NG tube ต่อ Low intermittent suction และปรึกษาศัลยแพทย์ด่วน');
    }
    if (isNaturalToxin || isHighRiskMedTox) {
      managementList.push('• Urgent Poison Center Consultation: โทรปรึกษาศูนย์พิษวิทยารามาธิบดี (สายด่วน 1367 ตลอด 24 ชม.) และเก็บตัวอย่างอาหาร/อาเจียนส่งตรวจ');
    }
    managementList.push('• Antiemetic Therapy: พิจารณาให้ Ondansetron 4–8 mg IV ช้าๆ (หลีกเลี่ยง Metoclopramide เด็ดขาดหากสงสัย Mechanical Bowel Obstruction)');
  }
});
