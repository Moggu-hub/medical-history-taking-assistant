// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 12_diarrhea.js
// อาการนำ: ถ่ายเหลว / ถ่ายเป็นน้ำ (Acute Diarrhea / Watery Stool / Dysentery)
// ไฟล์นี้แยกอิสระสำหรับอาการนำ diarrhea เพื่อให้ทีมแพทย์และ IT โรงพยาบาลนำไปพัฒนาต่อได้โดยไม่กระทบระบบหลัก
// =========================================================================

function handleDiarrheaStoolConsistencyChange(val) {
  const otherWrap = document.getElementById('diarrheaOtherStoolWrap');
  if (otherWrap) {
    if (val === 'other') {
      otherWrap.classList.remove('hidden');
    } else {
      otherWrap.classList.add('hidden');
      const inp = document.getElementById('diarrheaStoolOtherText');
      if (inp) inp.value = '';
    }
  }
}

function handleDiarrheaAbdpainChange(val) {
  const wrap = document.getElementById('diarrheaAbdpainWrap');
  if (wrap) {
    if (val === 'yes') {
      wrap.classList.remove('hidden');
    } else {
      wrap.classList.add('hidden');
      document.querySelectorAll('input[name="diarrheaAbdpainChar"]').forEach(r => r.checked = false);
      document.querySelectorAll('input[name="diarrheaAbdpainLoc"]').forEach(r => r.checked = false);
    }
  }
}

function handleDiarrheaVomitToggle(el) {
  const isChecked = el ? el.checked : (document.getElementById('diarrhea_vomit_cb')?.checked || false);
  const wrap = document.getElementById('diarrheaVomitDetailWrap');
  if (wrap) {
    if (isChecked) {
      wrap.classList.remove('hidden');
    } else {
      wrap.classList.add('hidden');
      const vFreq = document.getElementById('diarrheaVomitFreq');
      if (vFreq) vFreq.value = '';
      document.querySelectorAll('input[name="diarrheaVomitChar"]').forEach(r => r.checked = false);
    }
  }
}

function handleDiarrheaDehydrationNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="diarrheaDehydrationSigns"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleDiarrheaFoodRiskNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="diarrheaFoodRisks"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleDiarrheaSharedMealChange(val) {
  const wrap = document.getElementById('diarrheaOutbreakWrap');
  if (wrap) {
    if (val === 'outbreak_multiple') {
      wrap.classList.remove('hidden');
    } else {
      wrap.classList.add('hidden');
      const inp = document.getElementById('diarrheaOutbreakDetails');
      if (inp) inp.value = '';
    }
  }
}

function handleDiarrheaTravelToggle(el) {
  const isChecked = el ? el.checked : (document.getElementById('diarrhea_travel_cb')?.checked || false);
  const wrap = document.getElementById('diarrheaTravelWrap');
  if (wrap) {
    if (isChecked) {
      wrap.classList.remove('hidden');
    } else {
      wrap.classList.add('hidden');
      const inp = document.getElementById('diarrheaTravelDetails');
      if (inp) inp.value = '';
    }
  }
}

function handleDiarrheaAbxChange(val) {
  const wrap = document.getElementById('diarrheaAbxWrap');
  if (wrap) {
    if (val === 'recent_abx_yes') {
      wrap.classList.remove('hidden');
    } else {
      wrap.classList.add('hidden');
      const inp = document.getElementById('diarrheaAbxDetails');
      if (inp) inp.value = '';
    }
  }
}

function handleDiarrheaLmpStatusChange(val) {
  const wrap = document.getElementById('diarrhea_lmp_date_wrap');
  if (wrap) {
    if (val === 'regular_lmp_exact') {
      wrap.classList.remove('hidden');
    } else {
      wrap.classList.add('hidden');
      const dateInp = document.getElementById('diarrheaLmpDate');
      if (dateInp) dateInp.value = '';
    }
  }
}

function evaluateDiarrheaRedFlags(patient) {
  const flags = [];
  if (!patient) return flags;

  const stoolFreq = patient.diarrheaFrequency24h || '';
  const stoolVol = patient.diarrheaVolumePerTime || '';
  const stoolChar = patient.diarrheaStoolConsistency || '';
  const oralTol = patient.diarrheaOralTolerance || '';
  const dehy = Array.isArray(patient.diarrheaDehydrationSigns) ? patient.diarrheaDehydrationSigns : [];
  const systemic = Array.isArray(patient.diarrheaSystemicSigns) ? patient.diarrheaSystemicSigns : [];
  const foodRisks = Array.isArray(patient.diarrheaFoodRisks) ? patient.diarrheaFoodRisks : [];
  const abxUse = patient.diarrheaRecentAbx || '';
  const painChar = patient.diarrheaAbdpainChar || '';
  const painLoc = patient.diarrheaAbdpainLoc || '';

  // 1. Hypovolemic Shock / Critical Volume Depletion
  const hasSyncope = dehy.includes('syncope_blackout');
  const hasCold = dehy.includes('cold_clammy_extremities');
  const hasAnuria = dehy.includes('oliguria_anuria_6h');
  const isSevereFreqOralIntol = (stoolFreq === 'freq_gt_10' && oralTol === 'oral_intolerant');
  if (hasSyncope || hasCold || hasAnuria || isSevereFreqOralIntol) {
    flags.push({
      key: 'diarrhea_rf_hypovolemic_shock',
      textTh: 'เสี่ยงต่อภาวะช็อกจากการขาดน้ำรุนแรง (Hypovolemic Shock / Severe Dehydration / Prerenal AKI)',
      risk: 'ผู้ป่วยมีอาการหน้ามืดเป็นลม มือเท้าเย็นชืด ปัสสาวะไม่ออกนานเกิน 6-8 ชม. หรือถ่ายต่อเนื่องรุนแรงโดยดื่มน้ำชดเชยไม่ได้ ต้องเปิดเส้น IV โหลด 0.9% NSS / Acetar ทันที และส่งตรวจ Stat Lab'
    });
  }

  // 2. Severe Watery Diarrhea / Cholera-like Illness
  const isRiceWater = stoolChar === 'rice_water';
  const isProfuseWatery = (stoolFreq === 'freq_gt_10' && stoolVol === 'profuse_gush');
  if (isRiceWater || isProfuseWatery) {
    flags.push({
      key: 'diarrhea_rf_cholera_like',
      textTh: 'สงสัยภาวะอหิวาตกโรคหรือถ่ายเป็นน้ำรุนแรงเฉียบพลัน (Severe Watery / Cholera-like Diarrhea)',
      risk: 'ถ่ายเป็นน้ำซาวข้าวใสปริมาณมหาศาล ไหลพุ่งตลอดเวลา เสี่ยงต่อการเสียชีวิตจาก Hypovolemic shock และ Severe Hypokalemia อย่างรวดเร็ว ต้องชดเชยสารน้ำปริมาณสูงและส่งตรวจ Vibrio culture'
    });
  }

  // 3. Invasive Dysentery / Sepsis Risk
  const isMucousBloody = stoolChar === 'mucous_bloody';
  const isTenesmusFever = (painChar === 'tenesmus' && systemic.includes('fever_chills'));
  if (isMucousBloody || isTenesmusFever) {
    flags.push({
      key: 'diarrhea_rf_invasive_dysentery',
      textTh: 'สงสัยบิดติดเชื้อแบคทีเรียรุกรานและภาวะติดเชื้อในกระแสเลือด (Invasive Dysentery / Sepsis Risk)',
      risk: 'ถ่ายมีมูกปนเลือดสดหรือหนอง ร่วมกับมีไข้สูงหนาวสั่น หรือปวดเบ่งทวารหนักรุนแรง เสี่ยงต่อผนังลำไส้อักเสบทะลุและ Sepsis ต้องส่ง Hemoculture, Stool C/S, หลีกเลี่ยง Loperamide และเริ่มยาฆ่าเชื้อ'
    });
  }

  // 4. Clostridioides difficile Colitis
  const hasAbxHistory = abxUse === 'recent_abx_yes';
  const hasFreqOrFever = (stoolFreq === 'freq_4_6' || stoolFreq === 'freq_7_10' || stoolFreq === 'freq_gt_10' || systemic.includes('fever_chills'));
  if (hasAbxHistory && hasFreqOrFever) {
    flags.push({
      key: 'diarrhea_rf_cdiff',
      textTh: 'สงสัยลำไส้อักเสบจากการใช้ยาปฏิชีวนะ (Suspected Clostridioides difficile Colitis)',
      risk: 'มีประวัติได้รับยาปฏิชีวนะ (Antibiotics) ในช่วง 1-3 เดือน ร่วมกับมีอาการถ่ายเหลว เสี่ยงเกิด Pseudomembranous Colitis / Toxic Megacolon ต้องส่งตรวจ Stool C. diff Toxin A/B assay และพิจารณา Oral Vancomycin'
    });
  }

  // 5. Surgical Abdomen Mimic (Pelvic Appendicitis / Peritonitis)
  const isRlqPain = (patient.diarrheaHasAbdpain === 'yes' && painLoc === 'rlq');
  const isConstantSeverePain = (patient.diarrheaHasAbdpain === 'yes' && painChar === 'constant_severe');
  if (isRlqPain || isConstantSeverePain) {
    flags.push({
      key: 'diarrhea_rf_surgical_mimic',
      textTh: 'สงสัยภาวะฉุกเฉินทางศัลยกรรมช่องท้องเลียนแบบท้องเสีย (Suspected Pelvic Appendicitis / Acute Abdomen)',
      risk: 'ปวดท้องน้อยด้านขวาเด่น หรือปวดท้องรุนแรงต่อเนื่องสะเทือน ไม่ทุเลาหลังถ่ายอุจจาระ อาจเป็นไส้ติ่งอักเสบในอุ้งเชิงกรานระคายเคืองลำไส้ตรง ต้อง NPO และปรึกษาศัลยแพทย์ด่วน'
    });
  }

  // 6. Ectopic Pregnancy in Female
  const isFemaleMissed = patient.gender === 'หญิง' && (patient.diarrheaLmpStatus === 'missed_period' || patient.diarrheaFemaleEctopicWarning);
  if (isFemaleMissed && (hasSyncope || painLoc === 'lower_abdomen' || dehy.includes('postural_dizziness'))) {
    flags.push({
      key: 'diarrhea_rf_ectopic',
      textTh: 'สงสัยภาวะตั้งครรภ์นอกมดลูกแตก (Suspected Ruptured Ectopic Pregnancy)',
      risk: 'สตรีวัยเจริญพันธุ์ขาดประจำเดือน มีอาการปวดหน่วงท้องน้อย ถ่ายกะปริดกะปรอย ร่วมกับหน้ามืดเป็นลม ต้องตรวจ Urine Pregnancy Test (UPT) และปรึกษาสูตินรีแพทย์ด่วน'
    });
  }

  // 7. Food Poisoning Outbreak
  if (patient.diarrheaSharedMeal === 'outbreak_multiple') {
    flags.push({
      key: 'diarrhea_rf_food_outbreak',
      textTh: `ประวัติอาหารเป็นพิษระบาดเป็นกลุ่มก้อน (Food Poisoning Outbreak)${patient.diarrheaOutbreakDetails ? `: [${patient.diarrheaOutbreakDetails}]` : ''}`,
      risk: 'มีผู้ร่วมรับประทานอาหารป่วยพร้อมกันหลายราย เสี่ยงต่อการระบาดของเชื้อก่อโรคทางเดินอาหาร (เช่น Norovirus, Salmonella, Vibrio) ต้องรายงานทีมควบคุมโรคติดต่อ/ระบาดวิทยา'
    });
  }

  // 8. Wild Toxin / Mushroom Poisoning
  if (foodRisks.includes('wild_mushroom_plant')) {
    flags.push({
      key: 'diarrhea_rf_wild_toxin',
      textTh: 'ประวัติรับประทานเห็ดป่า พืชแปลก หรืออาหารป่า (Suspected Natural Botanical / Mushroom Poisoning)',
      risk: 'เสี่ยงต่อสารพิษชีวภาพทำลายตับไตเฉียบพลัน (เช่น Amatoxin ในเห็ดระโงกหิน) ต้องตรวจ LFTs, Coagulation, และปรึกษาศูนย์พิษวิทยารามาธิบดี (สายด่วน 1367)'
    });
  }

  return flags;
}

function isDiarrheaRedFlag(patient) {
  if (!patient) return false;
  const flags = evaluateDiarrheaRedFlags(patient);
  return flags.length > 0;
}

function updateDiarrheaOutputs(patient) {
  const unitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durationText = patient.durationVal ? `${patient.durationVal} ${unitMap[patient.durationUnit] || 'ชั่วโมง'}` : 'ไม่ระบุ';

  const onsetMap = {
    sudden_severe: 'เกิดขึ้นเฉียบพลันทันที (เริ่มถ่ายเยอะตั้งแต่ครั้งแรกๆ)',
    gradual_worsening: 'ค่อยๆ ถ่ายบ่อยหรือเยอะขึ้นเรื่อยๆ',
    chronic_recurrent: 'ท้องเสียเป็นๆ หายๆ (เหมือนจะดี แล้วกลับมาเป็นใหม่)',
    unspecified: 'ไม่ระบุรูปแบบการเริ่มต้น'
  };

  const freqMap = {
    freq_1_3: '1–3 ครั้ง',
    freq_4_6: '4–6 ครั้ง',
    freq_7_10: '7–10 ครั้ง',
    freq_gt_10: 'มากกว่า 10 ครั้งขึ้นไป / ตลอดเวลาจนนับไม่ได้ 🚩',
    unspecified: 'ไม่ระบุความถี่'
  };

  const volMap = {
    profuse_gush: 'ปริมาณมาก (ถ่ายเป็นน้ำไหลพุ่งเต็มโถส้วมทุกครั้ง) 🚩',
    moderate: 'ปริมาณปานกลาง',
    scant_frequent: 'ปริมาณน้อยกะปริดกะปรอย (ถ่ายออกทีละนิดแต่รู้สึกอยากถ่ายบ่อยๆ)',
    unspecified: 'ไม่ระบุปริมาณ'
  };

  const stoolCharMap = {
    rice_water: 'ถ่ายเป็นน้ำเหลวใสล้วน / น้ำซาวข้าวใสไม่มีเนื้อปนเลย 🚩 (Profuse Watery / Rice-water)',
    loose_mushy: 'ถ่ายเหลวเป็นเนื้อเละๆ ปนน้ำ (Loose / Mushy stool)',
    mucus_noblood: 'ถ่ายเป็นมูกเหนียวใสหรือมูกขาวขุ่น ไม่มีเลือดปน',
    mucous_bloody: 'ถ่ายมีมูกปนเลือดสด หรือถ่ายเป็นเลือดปนหนองชัดเจน 🚩 (Dysentery)',
    black_tarry_melena: 'ถ่ายเหลวเป็นสีดำคล้ำ เหนียวคล้ายยางมะตอย มีกลิ่นคาวเหม็นรุนแรง 🚩 (Melena)',
    other: patient.diarrheaStoolOtherText ? `อื่นๆ: ${patient.diarrheaStoolOtherText}` : 'อื่นๆ',
    unspecified: 'ไม่ระบุลักษณะอุจจาระ'
  };

  const oralMap = {
    oral_tolerated: 'สามารถดื่มน้ำ จิบเกลือแร่ (ORS) หรือทานอาหารเหลวได้',
    oral_intolerant: 'ดื่มน้ำหรือจิบอะไรเข้าไปก็อาเจียนออกหมด ไม่สามารถดื่มน้ำหรือทานอาหารได้เลย 🚩',
    unspecified: 'ไม่ระบุการดื่มน้ำ'
  };

  const dehyMap = {
    dry_mouth_thirst: 'กระหายน้ำรุนแรง คอแห้ง ปากแห้ง ผิวแห้ง',
    postural_dizziness: 'หน้ามืด วิงเวียน ตาพร่ามัวขณะเปลี่ยนท่าลุกยืน 🚩',
    syncope_blackout: 'มีอาการเป็นลม หรือวูบหมดสติไปชั่วครู่ 🚩',
    oliguria_anuria_6h: 'ปัสสาวะออกน้อยมาก สีเข้มจัด หรือไม่มีปัสสาวะเลยเกิน 6-8 ชม. 🚩',
    cold_clammy_extremities: 'ปลายมือปลายเท้าเย็น ซีด ตัวเย็นชืด 🚩',
    muscle_cramps: 'กล้ามเนื้อเกร็งกระตุก หรือเป็นตะคริวที่น่อง/มือ/เท้า 🚩'
  };

  const systemicMap = {
    fever_chills: 'มีไข้ ตัวร้อน หรือหนาวสั่นสะท้าน 🚩',
    tachypnea_dyspnea: 'หายใจหอบเร็ว หรือรู้สึกเหนื่อยผิดปกติ 🚩',
    lethargy_confusion: 'รู้สึกซึมลง สับสน อ่อนเพลียมากจนพูดคุยไม่ไหว 🚩'
  };

  const foodRiskMap = {
    raw_seafood: 'อาหารทะเล สุกๆ ดิบๆ (หอยแครงลวก/หอยนางรมสด/กุ้งแช่น้ำปลา/ปูม้าดอง)',
    papaya_salad_raw: 'ส้มตำ ปลาร้า ลาบ/ก้อยดิบ กุ้งเต้น หรืออาหารอีสานปรุงดิบ',
    coconut_milk_overnight: 'อาหารมีกะทิ นม ขนมจีน น้ำยา หรืออาหารปรุงค้างมื้อข้ามคืน',
    fermented_canned: 'อาหารหมักดอง อาหารกระป๋องบวม/มีกลิ่นผิดปกติ',
    untreated_water_ice: 'น้ำดื่ม น้ำแข็งหลอด หรือน้ำจากแหล่งธรรมชาติที่ไม่ผ่านการกรอง/ต้ม',
    street_food_buffet: 'อาหารซื้อจากตลาดนัด สตรีทฟู้ด หรืออาหารบุฟเฟต์',
    wild_mushroom_plant: 'อาหารป่า เห็ดแปลก หรือพืชที่ไม่คุ้นเคย 🚩'
  };

  const abdpainLocMap = {
    periumbilical: 'รอบสะดือ',
    lower_abdomen: 'ท้องน้อยส่วนล่าง',
    rlq: 'ท้องน้อยด้านขวาเป็นหลัก 🚩 (ระวัง Appendicitis)',
    diffuse: 'ปวดทั่วทั้งท้อง ระบุตำแหน่งไม่ได้'
  };

  const abdpainCharMap = {
    crampy_colicky: 'ปวดบิดมวนเกร็งเป็นพักๆ ทุเลาลงหลังถ่ายอุจจาระ',
    tenesmus: 'ปวดเบ่งลึกๆ ที่ทวารหนักตลอดเวลา เหมือนถ่ายไม่สุด 🚩',
    dull_tight: 'ปวดตื้อแน่น อึดอัดแน่นทั่วบริเวณท้อง',
    constant_severe: 'ปวดท้องรุนแรงมากตลอดเวลา ขยับตัวแล้วเจ็บสะเทือน ไม่ทุเลาลง 🚩'
  };

  const dehyList = (patient.diarrheaDehydrationSigns || []).map(k => dehyMap[k] || k);
  const systemicList = (patient.diarrheaSystemicSigns || []).map(k => systemicMap[k] || k);
  const foodList = (patient.diarrheaFoodRisks || []).map(k => foodRiskMap[k] || k);

  const redFlags = evaluateDiarrheaRedFlags(patient);
  patient.redFlags = redFlags;

  const vomitCharMap = {
    food: 'เศษอาหาร',
    juice: 'น้ำย่อย/น้ำใส',
    bile_green: 'น้ำดีสีเขียว',
    blood_vomit: 'มีเลือดปน 🚩'
  };

  const hospLabel = {
    self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
    has_history: 'มีประวัติการรักษาเดิมที่ รพ.ราชบุรี',
    first_time: 'มารับการรักษาที่ รพ.ราชบุรี เป็นครั้งแรก',
    unspecified: 'ไม่ได้ระบุ'
  }[patient.hospRecordStatus] || 'ไม่ได้ระบุ';

  const docNotes = patient.doctor_notes || {};
  const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ' || patient.currentMeds === 'ไม่มี') ? 'ไม่มี' : patient.currentMeds;

  // 1) All Pertinent Positives for Patient Queue Card & Summary
  const positives = [];
  positives.push(`ถ่ายเหลว: ${stoolCharMap[patient.diarrheaStoolConsistency] || 'ถ่ายเหลว'} (${freqMap[patient.diarrheaFrequency24h] || 'ไม่ระบุความถี่'})`);
  if (patient.diarrheaHasAbdpain === 'yes') {
    positives.push(`ปวดท้อง: ${abdpainCharMap[patient.diarrheaAbdpainChar] || 'ไม่ระบุลักษณะ'} ตำแหน่ง [${abdpainLocMap[patient.diarrheaAbdpainLoc] || 'ไม่ระบุ'}]`);
  }
  if (patient.diarrheaNausea && patient.diarrheaVomit) {
    const vChar = vomitCharMap[patient.diarrheaVomitChar] ? ` (ลักษณะ: ${vomitCharMap[patient.diarrheaVomitChar]})` : '';
    positives.push(`มีคลื่นไส้ และอาเจียน (${patient.diarrheaVomitFreq || 1} ครั้ง/วัน)${vChar}`);
  } else if (patient.diarrheaVomit) {
    const vChar = vomitCharMap[patient.diarrheaVomitChar] ? ` (ลักษณะ: ${vomitCharMap[patient.diarrheaVomitChar]})` : '';
    positives.push(`มีอาเจียนร่วมด้วย (${patient.diarrheaVomitFreq || 1} ครั้ง/วัน)${vChar}`);
  } else if (patient.diarrheaNausea) {
    positives.push('มีอาการคลื่นไส้ พะอืดพะอม');
  }
  if (patient.diarrheaBloating) positives.push('ท้องอืดแน่น มีลมในท้อง');
  if (patient.diarrheaAnusBurning) positives.push('แสบร้อนบริเวณทวารหนักหลังถ่าย');
  if (patient.diarrheaOralTolerance === 'oral_intolerant') {
    positives.push('🚩 จิบน้ำหรือทานอาหารไม่ได้เลย อาเจียนออกหมด (Oral intolerance)');
  }
  if (dehyList.length > 0) {
    dehyList.forEach(d => positives.push(d));
  }
  if (systemicList.length > 0) {
    systemicList.forEach(s => positives.push(s));
  }
  if (foodList.length > 0) {
    positives.push(`รับประทานอาหารเสี่ยง (${foodList.join(', ')})`);
  }
  if (patient.diarrheaSharedMeal === 'outbreak_multiple') {
    positives.push(`🚩 อาหารเป็นพิษกลุ่มก้อน (คนร่วมโต๊ะมีอาการคล้ายกัน: ${patient.diarrheaOutbreakDetails || 'หลายราย'})`);
  }
  if (patient.diarrheaRecentAbx === 'recent_abx_yes') {
    positives.push(`🚩 มีประวัติใช้ยาปฏิชีวนะใน 1-3 เดือน (${patient.diarrheaAbxDetails || 'ได้รับยาฆ่าเชื้อ'})`);
  }
  if (patient.diarrheaTravel) {
    positives.push(`มีประวัติเดินทางต่างถิ่น (${patient.diarrheaTravelDetails || 'มีประวัติเดินทาง'})`);
  }
  if (patient.gender === 'หญิง' && patient.diarrheaLmpStatus) {
    const lmpMap = {
      regular_lmp_exact: `ประจำเดือนมาปกติ (LMP: ${patient.diarrheaLmpDate || 'ไม่ระบุ'})`,
      missed_period: '🚩 ขาดประจำเดือน / สงสัยตั้งครรภ์',
      irregular_unsure: 'ประจำเดือนมาไม่สม่ำเสมอ',
      menopause_hysterectomy: 'หมดประจำเดือนแล้ว / ผ่าตัดมดลูกแล้ว'
    };
    positives.push(lmpMap[patient.diarrheaLmpStatus] || patient.diarrheaLmpStatus);
  }
  if (patient.otherSymptomsFree) {
    positives.push(patient.otherSymptomsFree);
  }

  // 2) Pertinent Negatives (Concise rule-outs, non-contradictory)
  const negatives = [];
  if (patient.diarrheaStoolConsistency !== 'mucous_bloody' && patient.diarrheaStoolConsistency !== 'black_tarry_melena') {
    negatives.push('ปฏิเสธการถ่ายเป็นมูกเลือดสดและถ่ายดำยางมะตอย');
  }
  if (patient.diarrheaHasAbdpain !== 'yes') {
    negatives.push('ปฏิเสธอาการปวดท้องรุนแรง');
  }
  if (!patient.diarrheaNausea && !patient.diarrheaVomit) {
    negatives.push('ไม่มีคลื่นไส้อาเจียน');
  } else if (!patient.diarrheaVomit) {
    negatives.push('ไม่มีอาการอาเจียน');
  }
  if (patient.diarrheaOralTolerance !== 'oral_intolerant') {
    negatives.push('ดื่มน้ำและจิบเกลือแร่ (ORS) ได้ ไม่สำลัก');
  }

  const dehySigns = patient.diarrheaDehydrationSigns || [];
  if (!dehySigns.includes('postural_dizziness') && !dehySigns.includes('syncope_blackout') && !dehySigns.includes('cold_clammy_extremities')) {
    negatives.push('ไม่มีอาการหน้ามืด วูบหมดสติ หรือมือเท้าเย็น');
  }
  if (!dehySigns.includes('oliguria_anuria_6h')) {
    negatives.push('ปัสสาวะออกปกติ ไม่อ่อนเพลียรุนแรง');
  }

  const sysSigns = patient.diarrheaSystemicSigns || [];
  if (!sysSigns.includes('fever_chills') && !sysSigns.includes('tachypnea_dyspnea') && !sysSigns.includes('lethargy_confusion')) {
    negatives.push('ปฏิเสธไข้หนาวสั่น หายใจหอบเหนื่อย หรือซึมลง');
  } else {
    if (!sysSigns.includes('fever_chills')) negatives.push('ปฏิเสธไข้หนาวสั่น');
    if (!sysSigns.includes('tachypnea_dyspnea')) negatives.push('ไม่มีอาการหายใจหอบเหนื่อย');
  }
  if (!sysSigns.includes('lethargy_confusion')) {
    negatives.push('รู้สึกตัวดี ถามตอบรู้เรื่อง ช่วยเหลือตัวเองได้');
  }

  if (patient.diarrheaRecentAbx !== 'recent_abx_yes') {
    negatives.push('ปฏิเสธประวัติใช้ยาปฏิชีวนะในช่วง 1-3 เดือนก่อนหน้า');
  }

  patient.pertinentPositives = positives;
  patient.pertinentNegatives = negatives;

  // 3) Rapid Bullet Positives (Strictly non-redundant with top HPI lines)
  const rapidPositives = [];
  if (patient.diarrheaNausea && patient.diarrheaVomit) {
    const vChar = vomitCharMap[patient.diarrheaVomitChar] ? ` (ลักษณะ: ${vomitCharMap[patient.diarrheaVomitChar]})` : '';
    rapidPositives.push(`มีคลื่นไส้ และอาเจียน (${patient.diarrheaVomitFreq || 1} ครั้ง/วัน)${vChar}`);
  } else if (patient.diarrheaVomit) {
    const vChar = vomitCharMap[patient.diarrheaVomitChar] ? ` (ลักษณะ: ${vomitCharMap[patient.diarrheaVomitChar]})` : '';
    rapidPositives.push(`มีอาเจียนร่วมด้วย (${patient.diarrheaVomitFreq || 1} ครั้ง/วัน)${vChar}`);
  } else if (patient.diarrheaNausea) {
    rapidPositives.push('มีอาการคลื่นไส้ พะอืดพะอม');
  }
  if (patient.diarrheaBloating) rapidPositives.push('มีอาการท้องอืด แน่น มีลมในท้อง');
  if (patient.diarrheaAnusBurning) rapidPositives.push('มีอาการแสบร้อนบริเวณทวารหนักหลังถ่าย');
  if (patient.diarrheaOralTolerance === 'oral_intolerant') {
    rapidPositives.push('🚩 จิบน้ำหรือทานอาหารไม่ได้เลย อาเจียนออกหมด (Oral intolerance)');
  }
  if (dehyList.length > 0) {
    dehyList.forEach(d => rapidPositives.push(d));
  }
  if (systemicList.length > 0) {
    systemicList.forEach(s => rapidPositives.push(s));
  }
  if (foodList.length > 0) {
    rapidPositives.push(`ประวัติรับประทานอาหารเสี่ยง: ${foodList.join(', ')}`);
  }
  if (patient.diarrheaSharedMeal === 'outbreak_multiple') {
    rapidPositives.push(`🚩 อาหารเป็นพิษกลุ่มก้อน (คนร่วมโต๊ะมีอาการคล้ายกัน: ${patient.diarrheaOutbreakDetails || 'หลายราย'})`);
  }
  if (patient.diarrheaRecentAbx === 'recent_abx_yes') {
    rapidPositives.push(`🚩 มีประวัติใช้ยาปฏิชีวนะใน 1-3 เดือน (${patient.diarrheaAbxDetails || 'ได้รับยาฆ่าเชื้อ'})`);
  }
  if (patient.diarrheaTravel) {
    rapidPositives.push(`มีประวัติเดินทางต่างถิ่น: ${patient.diarrheaTravelDetails || 'มีประวัติเดินทาง'}`);
  }
  if (patient.gender === 'หญิง' && patient.diarrheaLmpStatus) {
    const lmpMap = {
      regular_lmp_exact: `ประจำเดือนมาปกติ (LMP: ${patient.diarrheaLmpDate || 'ไม่ระบุ'})`,
      missed_period: '🚩 ขาดประจำเดือน / สงสัยตั้งครรภ์',
      irregular_unsure: 'ประจำเดือนมาไม่สม่ำเสมอ',
      menopause_hysterectomy: 'หมดประจำเดือนแล้ว / ผ่าตัดมดลูกแล้ว'
    };
    rapidPositives.push(`ข้อมูลสตรี: ${lmpMap[patient.diarrheaLmpStatus] || patient.diarrheaLmpStatus}`);
  }
  if (patient.otherSymptomsFree) {
    rapidPositives.push(`อาการอื่นๆ: ${patient.otherSymptomsFree}`);
  }

  patient.pertinentPositives = rapidPositives.length > 0 ? rapidPositives : ['ไม่มีอาการร่วมผิดปกติ'];
  patient.pertinentNegatives = negatives;

  // A) Rapid Bullet Format (Standardized Clinical Hierarchy)
  const defaultRapid =
`[Chief Complaint (CC)]
ถ่ายเหลว / ถ่ายเป็นน้ำ (Acute Diarrhea) มา ${durationText}

[History of Present Illness (HPI)]
• ลักษณะอุจจาระ: ${stoolCharMap[patient.diarrheaStoolConsistency] || 'ไม่ระบุ'}
• การเริ่มต้นและความถี่: ${onsetMap[patient.diarrheaOnsetMode] || 'ไม่ระบุ'}, ความถี่ในรอบ 24 ชม.: ${freqMap[patient.diarrheaFrequency24h] || 'ไม่ระบุ'}
• ปริมาณต่อครั้ง: ${volMap[patient.diarrheaVolumePerTime] || 'ไม่ระบุ'}
${patient.diarrheaHasAbdpain === 'yes' ? `• อาการปวดท้อง: ${abdpainCharMap[patient.diarrheaAbdpainChar] || 'ปวดท้อง'} ตำแหน่ง [${abdpainLocMap[patient.diarrheaAbdpainLoc] || 'ไม่ระบุ'}]\n` : ''}
• Pertinent Positives:
${rapidPositives.length > 0 ? rapidPositives.map(p => `  - ${p}`).join('\n') : '  - ไม่มีอาการร่วมอื่นที่เด่นชัด'}

• Pertinent Negatives:
${negatives.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
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

  // B) Narrative Paragraph Format
  const defaultNarrative =
`ผู้ป่วย${patient.gender || ''} อายุ ${patient.age || 'ไม่ระบุ'} ปี มารับการตรวจที่ห้องฉุกเฉิน รพ.ราชบุรี ด้วยอาการถ่ายเหลว / ถ่ายเป็นน้ำ (Acute Diarrhea) มา ${durationText}
ประวัติการเจ็บป่วยปัจจุบัน: ผู้ป่วยมีอาการ${onsetMap[patient.diarrheaOnsetMode] || 'ถ่ายเหลว'} ความถี่ในรอบ 24 ชม. ประมาณ ${freqMap[patient.diarrheaFrequency24h] || 'ไม่ระบุ'} ปริมาณต่อครั้ง [${volMap[patient.diarrheaVolumePerTime] || 'ไม่ระบุ'}] อุจจาระมีลักษณะเด่นคือ [${stoolCharMap[patient.diarrheaStoolConsistency] || 'ไม่ระบุ'}] ${patient.diarrheaHasAbdpain === 'yes' ? `มีอาการปวดท้องลักษณะ ${abdpainCharMap[patient.diarrheaAbdpainChar] || ''} บริเวณ ${abdpainLocMap[patient.diarrheaAbdpainLoc] || ''}` : 'ไม่มีอาการปวดท้องรุนแรง'}

อาการร่วมที่พบ (Pertinent Positives): ${rapidPositives.length > 0 ? rapidPositives.join(', ') : 'ไม่มีอาการร่วมอื่นที่เด่นชัด'}
อาการปฏิเสธสำคัญ (Pertinent Negatives): ${negatives.join(', ')}

ประวัติระบาดวิทยา อาหาร และยา: ${foodList.length > 0 ? `มีประวัติรับประทาน ${foodList.join(', ')}` : 'ปฏิเสธอาหารเสี่ยงชัดเจน'} ${patient.diarrheaSharedMeal === 'outbreak_multiple' ? `(มีผู้ร่วมรับประทานอาหารป่วยด้วย: ${patient.diarrheaOutbreakDetails || 'หลายราย'})` : ''} ${patient.diarrheaRecentAbx === 'recent_abx_yes' ? `มีประวัติได้รับยาปฏิชีวนะ (${patient.diarrheaAbxDetails || 'ใน 1-3 เดือน'})` : 'ปฏิเสธประวัติใช้ยาปฏิชีวนะ'} ${patient.gender === 'หญิง' && patient.diarrheaLmpStatus ? `ข้อมูลประจำเดือน: ${patient.diarrheaLmpStatus === 'regular_lmp_exact' ? (patient.diarrheaLmpDate || 'ปกติ') : patient.diarrheaLmpStatus}` : ''}

ประวัติอดีตและยาประจำตัว: สถานะประวัติ [${hospLabel}], โรคประจำตัว: ${(patient.underlying && patient.underlying.length > 0) ? patient.underlying.join(', ') : 'ปฏิเสธโรคประจำตัว'}, ประวัติแพ้ยา/แพ้อาหาร: ${patient.drugAllergy || 'ปฏิเสธ'}, ยาที่ใช้ประจำ: ${medsText}
${redFlags.length > 0 ? `\n[🚩 แจ้งเตือนสัญญาณวิกฤต]: ตรวจพบอาการ ${redFlags.map(rf => rf.textTh).join(', ')}` : ''}

[บันทึกการตรวจและการประเมินโดยแพทย์]:
${docNotes.additional_hpi ? `• ประวัติเพิ่มเติม: ${docNotes.additional_hpi}\n` : ''}${docNotes.physical_exam ? `• การตรวจร่างกาย: ${docNotes.physical_exam}\n` : ''}${docNotes.preliminary_dx ? `• การวินิจฉัย: ${docNotes.preliminary_dx}\n` : ''}${docNotes.plan ? `• แผนการรักษา: ${docNotes.plan}` : ''}`;

  // C) JSON Schema Payload
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
    "chief_complaint": "diarrhea",
    "chief_complaint_label": "ถ่ายเหลว / ถ่ายเป็นน้ำ",
    "schema_version": "2.0",
    "diarrhea_profile": {
      "duration": {
        "value": patient.durationVal || null,
        "unit": patient.durationUnit || "hours"
      },
      "onset_mode": patient.diarrheaOnsetMode || null,
      "frequency_24h": patient.diarrheaFrequency24h || null,
      "volume_per_time": patient.diarrheaVolumePerTime || null,
      "stool_consistency": patient.diarrheaStoolConsistency || null,
      "has_mucous_blood": patient.diarrheaStoolConsistency === 'mucous_bloody',
      "has_melena": patient.diarrheaStoolConsistency === 'black_tarry_melena',
      "oral_tolerance": patient.diarrheaOralTolerance || null,
      "abdominal_pain": {
        "has_pain": patient.diarrheaHasAbdpain === 'yes',
        "character": patient.diarrheaAbdpainChar || null,
        "location": patient.diarrheaAbdpainLoc || null
      },
      "associated_gi": {
        "nausea": Boolean(patient.diarrheaNausea),
        "vomiting": Boolean(patient.diarrheaVomit),
        "vomit_frequency": patient.diarrheaVomitFreq || 0,
        "bloating": Boolean(patient.diarrheaBloating),
        "anus_burning": Boolean(patient.diarrheaAnusBurning)
      },
      "dehydration_signs": patient.diarrheaDehydrationSigns || [],
      "systemic_signs": patient.diarrheaSystemicSigns || [],
      "epidemiology": {
        "food_risks": patient.diarrheaFoodRisks || [],
        "shared_meal_outbreak": patient.diarrheaSharedMeal === 'outbreak_multiple',
        "outbreak_details": patient.diarrheaOutbreakDetails || null,
        "travel_history": Boolean(patient.diarrheaTravel),
        "travel_details": patient.diarrheaTravelDetails || null,
        "recent_antibiotic_use": patient.diarrheaRecentAbx === 'recent_abx_yes',
        "antibiotic_details": patient.diarrheaAbxDetails || null
      },
      "female_reproductive": {
        "is_female": patient.gender === 'หญิง',
        "lmp_status": patient.diarrheaLmpStatus || null,
        "lmp_date": patient.diarrheaLmpDate || null,
        "ectopic_warning": Boolean(patient.diarrheaFemaleEctopicWarning)
      }
    },
    "clinical_summary": {
      "pertinent_positives": positives,
      "pertinent_negatives": negatives,
      "red_flags": redFlags.map(rf => ({
        "code": rf.key,
        "description_th": rf.textTh,
        "risk_rationale": rf.risk
      }))
    },
    "doctor_clinical_addendum": {
      "additional_hpi": (patient.doctor_notes && patient.doctor_notes.additional_hpi) || "",
      "physical_exam": (patient.doctor_notes && patient.doctor_notes.physical_exam) || "",
      "preliminary_dx": (patient.doctor_notes && patient.doctor_notes.preliminary_dx) || "",
      "plan": (patient.doctor_notes && patient.doctor_notes.plan) || ""
    }
  };

  const rapidView = document.getElementById('rapidTextView');
  const narrativeView = document.getElementById('narrativeTextView');
  const jsonView = document.getElementById('jsonViewer');

  if (rapidView) rapidView.value = patient.custom_rapid_note || defaultRapid;
  if (narrativeView) narrativeView.value = patient.custom_narrative_note || defaultNarrative;
  if (jsonView) jsonView.textContent = JSON.stringify(jsonPayload, null, 2);
}

registerCcModule({
  id: 'diarrhea',
  recordCc: 'diarrhea',
  titleTh: 'ถ่ายเหลว / ถ่ายเป็นน้ำ',
  titleEn: 'Diarrhea / Watery Stool / Dysentery',
  sectionDomId: 'diarrheaQuestionnaireSection',
  doctorCcBadgeHtml: '<i data-lucide="droplets" class="w-4 h-4 text-amber-500 mr-1.5 flex-shrink-0"></i><span class="font-bold text-slate-800">ถ่ายเหลว / ถ่ายเป็นน้ำ (Diarrhea)</span>',
  patientBadgeHtml: '<i data-lucide="droplets" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"></i><span class="whitespace-nowrap">ถ่ายเหลว / ถ่ายเป็นน้ำ</span>',
  dateFields: ['diarrheaLmpDate'],
  timeFields: [],
  branchIds: [
    'diarrheaOtherStoolWrap',
    'diarrheaAbdpainWrap',
    'diarrheaVomitDetailWrap',
    'diarrheaOutbreakWrap',
    'diarrheaTravelWrap',
    'diarrheaAbxWrap',
    'diarrhea_branch_female_lmp',
    'diarrhea_lmp_date_wrap'
  ],
  inputIdsToClear: [
    'diarrheaDurationVal',
    'diarrheaStoolOtherText',
    'diarrheaVomitFreq',
    'diarrheaOutbreakDetails',
    'diarrheaTravelDetails',
    'diarrheaAbxDetails',
    'diarrheaLmpDate',
    'diarrhea_other_free'
  ],
  getPmhSectionNumber: function() {
    const fCard = document.getElementById('diarrhea_branch_female_lmp');
    return (fCard && !fCard.classList.contains('hidden')) ? 7 : 6;
  },
  onTitleChange: function({ isFemale }) {
    const fCard = document.getElementById('diarrhea_branch_female_lmp');
    if (fCard) {
      if (isFemale) fCard.classList.remove('hidden');
      else fCard.classList.add('hidden');
    }
  },
  resetForm: function() {
    [
      'diarrheaOtherStoolWrap', 'diarrheaAbdpainWrap',
      'diarrheaVomitDetailWrap', 'diarrheaOutbreakWrap', 'diarrheaTravelWrap',
      'diarrheaAbxWrap', 'diarrhea_branch_female_lmp', 'diarrhea_lmp_date_wrap'
    ].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });
  },
  formHtml: `
    <div id="diarrheaQuestionnaireSection" class="hidden space-y-6">

      <!-- Triage Advisory Banner -->
      <div class="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-3 shadow-sm">
        <i data-lucide="alert-triangle" class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"></i>
        <div class="text-xs text-amber-800 leading-relaxed">
          <span class="font-bold text-amber-900 block mb-0.5">คำแนะนำจากจุดคัดกรองฉุกเฉิน:</span>
          หากท่านมีอาการ <span class="font-bold underline text-slate-800">ถ่ายเป็นมูกเลือดสดปริมาณมาก</span> หรือ <span class="font-bold underline text-slate-800">ถ่ายอุจจาระสีดำเหนียวคล้ายยางมะตอย</span> เป็นอาการเด่น โปรดแจ้งพยาบาลคัดกรองทันที หรือเลือกอาการสำคัญ 
          <span class="underline font-bold text-amber-950">&lt;อาเจียนเป็นเลือด / ถ่ายดำ / ถ่ายเป็นเลือดสด&gt;</span> เพื่อรับการประเมินภาวะเลือดออกในทางเดินอาหารเฉียบพลัน
        </div>
      </div>

      <!-- CARD 1: วันที่และเวลาที่เริ่มมีอาการ (Onset & Duration) -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="clock" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">1. วันที่และเวลาที่เริ่มมีอาการถ่ายเหลว (Onset & Duration)</h2>
            <p class="text-xs text-slate-500">ประเมินระยะเวลาการเริ่มต้นของอาการเพื่อแยกกลุ่มเฉียบพลันและเรื้อรัง</p>
          </div>
        </div>

        <div class="space-y-4">
          <!-- ระยะเวลาที่เป็นมา -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">เริ่มมีอาการถ่ายเหลวมานานเท่าไรแล้ว?</label>
            <div class="flex items-center space-x-2 max-w-xs">
              <input type="number" id="diarrheaDurationVal" min="1" max="999" placeholder="เช่น 8" class="w-24 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 font-semibold focus:ring-2 focus:ring-medical-500">
              <select id="diarrheaDurationUnit" class="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-medical-500">
                <option value="minutes">นาที</option>
                <option value="hours" selected>ชั่วโมง</option>
                <option value="days">วัน</option>
                <option value="weeks">สัปดาห์</option>
                <option value="months">เดือน</option>
                <option value="years">ปี</option>
              </select>
            </div>
          </div>

          <!-- รูปแบบการเริ่มต้น -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">ลักษณะการเริ่มต้นของอาการ</label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="diarrheaOnsetMode" value="sudden_severe" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800 font-medium">เกิดขึ้นเฉียบพลันทันที (เริ่มถ่ายเยอะตั้งแต่ครั้งแรกๆ)</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="diarrheaOnsetMode" value="gradual_worsening" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800 font-medium">ค่อยๆ ถ่ายบ่อยหรือเยอะขึ้นเรื่อยๆ</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="diarrheaOnsetMode" value="chronic_recurrent" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800 font-medium">ท้องเสียเป็นๆ หายๆ (เหมือนจะดี แล้วกลับมาเป็นใหม่)</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 2: ความถี่และลักษณะของอุจจาระ (Frequency & Stool Characteristics) -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="activity" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">2. ความถี่และลักษณะของอุจจาระ (Frequency & Stool Characteristics)</h2>
            <p class="text-xs text-slate-500">ประเมินปริมาณการสูญเสียสารน้ำและคัดกรองภาวะบิดมูกเลือด</p>
          </div>
        </div>

        <div class="space-y-4">
          <!-- จำนวนครั้งใน 24 ชม. -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">จำนวนครั้งที่ถ่ายในรอบ 24 ชั่วโมงที่ผ่านมา</label>
            <div class="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <label class="selectable-card flex items-center p-3 rounded-xl cursor-pointer">
                <input type="radio" name="diarrheaFrequency24h" value="freq_1_3" class="text-medical-600">
                <span class="ml-2.5 text-xs text-slate-800">1–3 ครั้ง</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl cursor-pointer">
                <input type="radio" name="diarrheaFrequency24h" value="freq_4_6" class="text-medical-600">
                <span class="ml-2.5 text-xs text-slate-800">4–6 ครั้ง</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl cursor-pointer">
                <input type="radio" name="diarrheaFrequency24h" value="freq_7_10" class="text-medical-600">
                <span class="ml-2.5 text-xs text-slate-800">7–10 ครั้ง</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl cursor-pointer">
                <input type="radio" name="diarrheaFrequency24h" value="freq_gt_10" class="text-medical-600">
                <span class="ml-2.5 text-xs text-slate-800 font-medium">มากกว่า 10 ครั้งขึ้นไป / ถ่ายตลอดเวลาจนนับไม่ได้</span>
              </label>
            </div>
          </div>

          <!-- ปริมาณอุจจาระต่อครั้ง -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">ปริมาณอุจจาระในแต่ละครั้ง</label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="diarrheaVolumePerTime" value="profuse_gush" class="text-medical-600 mt-0.5">
                <div class="ml-2.5">
                  <span class="block text-xs font-medium text-slate-800">ปริมาณมาก (ถ่ายเป็นน้ำไหลพุ่งเต็มโถส้วมทุกครั้ง)</span>
                </div>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="diarrheaVolumePerTime" value="moderate" class="text-medical-600 mt-0.5">
                <div class="ml-2.5">
                  <span class="block text-xs font-medium text-slate-800">ปริมาณปานกลาง (ประมาณ 1 ถ้วยแก้ว)</span>
                </div>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="diarrheaVolumePerTime" value="scant_frequent" class="text-medical-600 mt-0.5">
                <div class="ml-2.5">
                  <span class="block text-xs font-medium text-slate-800">ปริมาณน้อยกะปริดกะปรอย (ออกทีละนิดแต่อยากถ่ายบ่อยๆ)</span>
                </div>
              </label>
            </div>
          </div>

          <!-- ลักษณะอุจจาระเด่น -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">ลักษณะเด่นของอุจจาระ (เลือกข้อที่ตรงที่สุด)</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="diarrheaStoolConsistency" value="rice_water" onchange="handleDiarrheaStoolConsistencyChange(this.value)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800 font-medium">ถ่ายเป็นน้ำเหลวใสล้วน / น้ำซาวข้าวใสไม่มีเนื้อปนเลย</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="diarrheaStoolConsistency" value="loose_mushy" onchange="handleDiarrheaStoolConsistencyChange(this.value)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">ถ่ายเหลวเป็นเนื้อเละๆ ปนน้ำ</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="diarrheaStoolConsistency" value="mucus_noblood" onchange="handleDiarrheaStoolConsistencyChange(this.value)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">ถ่ายเป็นมูกเหนียวใสหรือมูกขาวขุ่น ไม่มีเลือดปน</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="diarrheaStoolConsistency" value="mucous_bloody" onchange="handleDiarrheaStoolConsistencyChange(this.value)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800 font-semibold">ถ่ายมีมูกปนเลือดสด หรือถ่ายเป็นเลือดปนหนองชัดเจน</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="diarrheaStoolConsistency" value="black_tarry_melena" onchange="handleDiarrheaStoolConsistencyChange(this.value)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800 font-semibold">ถ่ายเหลวเป็นสีดำคล้ำ เหนียวคล้ายยางมะตอย หรือมีกลิ่นคาวเหม็นรุนแรง</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="diarrheaStoolConsistency" value="other" onchange="handleDiarrheaStoolConsistencyChange(this.value)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">ลักษณะอื่นๆ</span>
              </label>
            </div>

            <!-- อื่นๆ ระบุ -->
            <div id="diarrheaOtherStoolWrap" class="hidden mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <label class="block text-[11px] font-semibold text-slate-700 mb-1">ระบุลักษณะอุจจาระเพิ่มเติม:</label>
              <input type="text" id="diarrheaStoolOtherText" placeholder="เช่น สีเขียว มีกลิ่นเปรี้ยว หรือมีฟองมาก" class="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-medical-500">
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 3: อาการปวดท้องและอาการทางเดินอาหารร่วม (Abdominal Symptoms) -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="utensils" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">3. อาการปวดท้องและอาการทางเดินอาหารร่วม (Abdominal & GI Symptoms)</h2>
            <p class="text-xs text-slate-500">คัดกรองภาวะปวดเกร็ง อาการปวดเบ่งทวาร และภาวะฉุกเฉินทางศัลยกรรม</p>
          </div>
        </div>

        <div class="space-y-4">
          <!-- มีอาการปวดท้องหรือไม่ -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">มีอาการปวดท้องร่วมด้วยหรือไม่?</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label class="selectable-card flex items-center p-3 rounded-xl cursor-pointer">
                <input type="radio" name="diarrheaHasAbdpain" value="no" onchange="handleDiarrheaAbdpainChange(this.value)" class="text-medical-600">
                <span class="ml-2.5 text-xs text-slate-800">ไม่มีอาการปวดท้องเลย (ถ่ายเหลวอย่างเดียวโดยไม่ปวดท้อง)</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl cursor-pointer">
                <input type="radio" name="diarrheaHasAbdpain" value="yes" onchange="handleDiarrheaAbdpainChange(this.value)" class="text-medical-600">
                <span class="ml-2.5 text-xs text-slate-800 font-medium">มีอาการปวดท้องร่วมด้วย</span>
              </label>
            </div>
          </div>

          <!-- กิ่งเจาะลึกอาการปวดท้อง (Progressive Disclosure) -->
          <div id="diarrheaAbdpainWrap" class="hidden p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">ลักษณะอาการปวดท้อง (เลือกข้อที่ตรงที่สุด):</label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label class="selectable-card flex items-start p-2.5 rounded-lg cursor-pointer">
                  <input type="radio" name="diarrheaAbdpainChar" value="crampy_colicky" class="text-medical-600 mt-0.5">
                  <span class="ml-2 text-slate-800">ปวดบิดมวนเกร็งเป็นพักๆ แล้วทุเลาลงหลังได้ถ่ายอุจจาระ</span>
                </label>
                <label class="selectable-card flex items-start p-2.5 rounded-lg cursor-pointer">
                  <input type="radio" name="diarrheaAbdpainChar" value="tenesmus" class="text-medical-600 mt-0.5">
                  <span class="ml-2 text-slate-800 font-medium">ปวดเบ่งลึกๆ ที่ทวารหนักตลอดเวลา เหมือนถ่ายไม่สุด</span>
                </label>
                <label class="selectable-card flex items-start p-2.5 rounded-lg cursor-pointer">
                  <input type="radio" name="diarrheaAbdpainChar" value="dull_tight" class="text-medical-600 mt-0.5">
                  <span class="ml-2 text-slate-800">ปวดตื้อแน่น อึดอัดแน่นทั่วบริเวณท้อง</span>
                </label>
                <label class="selectable-card flex items-start p-2.5 rounded-lg cursor-pointer">
                  <input type="radio" name="diarrheaAbdpainChar" value="constant_severe" class="text-medical-600 mt-0.5">
                  <span class="ml-2 text-slate-800 font-medium">ปวดท้องรุนแรงมากตลอดเวลา ขยับตัวหรือไอแล้วเจ็บสะเทือน ไม่ทุเลาลงเลย</span>
                </label>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">ตำแหน่งที่ปวดท้องเด่นชัด:</label>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <label class="selectable-card flex items-center p-2.5 rounded-lg cursor-pointer">
                  <input type="radio" name="diarrheaAbdpainLoc" value="periumbilical" class="text-medical-600">
                  <span class="ml-2 text-slate-800">รอบสะดือ</span>
                </label>
                <label class="selectable-card flex items-center p-2.5 rounded-lg cursor-pointer">
                  <input type="radio" name="diarrheaAbdpainLoc" value="lower_abdomen" class="text-medical-600">
                  <span class="ml-2 text-slate-800">ท้องน้อยส่วนล่าง</span>
                </label>
                <label class="selectable-card flex items-center p-2.5 rounded-lg cursor-pointer">
                  <input type="radio" name="diarrheaAbdpainLoc" value="rlq" class="text-medical-600">
                  <span class="ml-2 text-slate-800 font-medium">ท้องน้อยด้านขวาเป็นหลัก</span>
                </label>
                <label class="selectable-card flex items-center p-2.5 rounded-lg cursor-pointer">
                  <input type="radio" name="diarrheaAbdpainLoc" value="diffuse" class="text-medical-600">
                  <span class="ml-2 text-slate-800">ทั่วทั้งท้อง ระบุตำแหน่งไม่ได้</span>
                </label>
              </div>
            </div>
          </div>

          <!-- อาการทางเดินอาหารร่วมอื่นๆ -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">อาการทางเดินอาหารร่วมอื่นๆ (เลือกได้หลายข้อ)</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label class="selectable-card flex items-center p-3 rounded-xl cursor-pointer">
                <input type="checkbox" id="diarrhea_nausea_cb" class="text-medical-600 rounded">
                <span class="ml-2.5 text-slate-800">คลื่นไส้ หรือพะอืดพะอม</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl cursor-pointer">
                <input type="checkbox" id="diarrhea_vomit_cb" onchange="handleDiarrheaVomitToggle(this)" class="text-medical-600 rounded">
                <span class="ml-2.5 text-slate-800 font-medium">อาเจียนร่วมด้วย</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl cursor-pointer">
                <input type="checkbox" id="diarrhea_bloating_cb" class="text-medical-600 rounded">
                <span class="ml-2.5 text-slate-800">ท้องอืด แน่นตึง มีลมในท้อง หรือได้ยินเสียงโครกครากบ่อย</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl cursor-pointer">
                <input type="checkbox" id="diarrhea_anus_burning_cb" class="text-medical-600 rounded">
                <span class="ml-2.5 text-slate-800">แสบร้อนบริเวณรูทวารหนักจากการถ่ายบ่อยครั้ง</span>
              </label>
            </div>

            <!-- กิ่งเจาะลึกอาเจียน -->
            <div id="diarrheaVomitDetailWrap" class="hidden mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div class="flex items-center space-x-2">
                <label class="text-xs font-semibold text-slate-700">จำนวนครั้งที่อาเจียนในวันนี้:</label>
                <input type="number" id="diarrheaVomitFreq" min="1" max="50" placeholder="เช่น 3" class="w-20 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800 font-semibold">
                <span class="text-xs text-slate-500">ครั้ง/วัน</span>
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-slate-700 mb-1">ลักษณะสิ่งที่อาเจียนออกมา:</label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                  <label class="selectable-card flex items-center p-2 rounded-lg cursor-pointer">
                    <input type="radio" name="diarrheaVomitChar" value="food" class="text-medical-600">
                    <span class="ml-2 text-slate-800">เศษอาหาร</span>
                  </label>
                  <label class="selectable-card flex items-center p-2 rounded-lg cursor-pointer">
                    <input type="radio" name="diarrheaVomitChar" value="juice" class="text-medical-600">
                    <span class="ml-2 text-slate-800">น้ำใส / น้ำย่อย</span>
                  </label>
                  <label class="selectable-card flex items-center p-2 rounded-lg cursor-pointer">
                    <input type="radio" name="diarrheaVomitChar" value="bile_green" class="text-medical-600">
                    <span class="ml-2 text-slate-800 font-medium">น้ำดีสีเขียว</span>
                  </label>
                  <label class="selectable-card flex items-center p-2 rounded-lg cursor-pointer">
                    <input type="radio" name="diarrheaVomitChar" value="blood_vomit" class="text-medical-600">
                    <span class="ml-2 text-slate-800 font-semibold">มีเลือดปน</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 4: สัญญาณภาวะขาดน้ำและการติดเชื้อทั่วร่างกาย (Dehydration & Systemic Signs) -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="shield-alert" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">4. สัญญาณภาวะขาดน้ำและการติดเชื้อทั่วร่างกาย (Dehydration & Systemic Signs)</h2>
            <p class="text-xs text-slate-500">คัดกรองความเร่งด่วน ภาวะช็อก และการติดเชื้อในกระแสเลือด</p>
          </div>
        </div>

        <div class="space-y-4">
          <!-- การดื่มน้ำและอาหาร -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">ความสามารถในการดื่มน้ำและรับประทานอาหาร</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="diarrheaOralTolerance" value="oral_tolerated" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">ยังสามารถดื่มน้ำ จิบเกลือแร่ (ORS) หรือทานอาหารเหลวได้ตามปกติ</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="diarrheaOralTolerance" value="oral_intolerant" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800 font-medium">ดื่มน้ำหรือจิบอะไรเข้าไปก็อาเจียนออกหมด ไม่สามารถดื่มน้ำหรือทานอาหารได้เลย</span>
              </label>
            </div>
          </div>

          <!-- อาการแสดงของภาวะขาดสารน้ำ -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">อาการแสดงของภาวะขาดสารน้ำและการไหลเวียนโลหิต (เลือกได้หลายข้อ)</label>
            <div class="space-y-2">
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="diarrheaDehydrationSigns" value="dry_mouth_thirst" class="text-medical-600 rounded mt-0.5">
                <span class="ml-3 text-xs text-slate-800 font-medium">กระหายน้ำรุนแรง คอแห้ง ปากแห้ง ผิวแห้ง</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="diarrheaDehydrationSigns" value="postural_dizziness" class="text-medical-600 rounded mt-0.5">
                <span class="ml-3 text-xs text-slate-800 font-medium">หน้ามืด วิงเวียน ตาพร่ามัว ทรงตัวไม่อยู่เมื่อเปลี่ยนท่าหรือลุกยืน</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="diarrheaDehydrationSigns" value="syncope_blackout" class="text-medical-600 rounded mt-0.5">
                <span class="ml-3 text-xs text-slate-800 font-medium">มีอาการเป็นลม หรือวูบหมดสติไปชั่วครู่</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="diarrheaDehydrationSigns" value="oliguria_anuria_6h" class="text-medical-600 rounded mt-0.5">
                <span class="ml-3 text-xs text-slate-800 font-medium">ปัสสาวะออกน้อยมาก สีเข้มจัด หรือไม่มีปัสสาวะออกเลยนานเกิน 6–8 ชั่วโมง</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="diarrheaDehydrationSigns" value="cold_clammy_extremities" class="text-medical-600 rounded mt-0.5">
                <span class="ml-3 text-xs text-slate-800 font-medium">ปลายมือปลายเท้าเย็น ซีด หรือตัวเย็นชืด</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="diarrheaDehydrationSigns" value="muscle_cramps" class="text-medical-600 rounded mt-0.5">
                <span class="ml-3 text-xs text-slate-800 font-medium">มีอาการกล้ามเนื้อเกร็งกระตุก หรือเป็นตะคริวที่น่อง/มือ/เท้า</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl cursor-pointer bg-slate-50 border-slate-300">
                <input type="checkbox" name="diarrheaDehydrationSigns" id="diarrheaDehydrationNoneCb" value="none_dehydration" onchange="handleDiarrheaDehydrationNoneToggle(this)" class="text-medical-600 rounded">
                <span class="ml-3 text-xs font-semibold text-slate-700">ไม่มีอาการหน้ามืด ปากแห้ง หรือปัสสาวะน้อย</span>
              </label>
            </div>
          </div>

          <!-- สัญญาณการติดเชื้อทั่วร่างกาย -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">สัญญาณการติดเชื้อทั่วร่างกาย (เลือกได้หลายข้อ)</label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="diarrheaSystemicSigns" value="fever_chills" class="text-medical-600 rounded mt-0.5">
                <span class="ml-2.5 text-slate-800 font-medium">มีไข้ ตัวร้อน หรือหนาวสั่นสะท้าน</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="diarrheaSystemicSigns" value="tachypnea_dyspnea" class="text-medical-600 rounded mt-0.5">
                <span class="ml-2.5 text-slate-800 font-medium">หายใจหอบเร็ว หรือรู้สึกเหนื่อยผิดปกติ</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="diarrheaSystemicSigns" value="lethargy_confusion" class="text-medical-600 rounded mt-0.5">
                <span class="ml-2.5 text-slate-800 font-medium">รู้สึกซึมลง สับสน อ่อนเพลียมากจนพูดคุยไม่ไหว</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 5: ประวัติอาหาร น้ำดื่ม และปัจจัยทางระบาดวิทยา (Exposure & Outbreak) -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="alert-triangle" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">5. ประวัติอาหาร น้ำดื่ม และปัจจัยทางระบาดวิทยา (Exposure & Outbreak)</h2>
            <p class="text-xs text-slate-500">สืบค้นสาเหตุอาหารเป็นพิษ การระบาด และประวัติการใช้ยาปฏิชีวนะ</p>
          </div>
        </div>

        <div class="space-y-4">
          <!-- อาหารกลุ่มเสี่ยงใน 24-72 ชม. -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">ประวัติรับประทานอาหารกลุ่มเสี่ยงภายใน 24–72 ชั่วโมงที่ผ่านมา (เลือกได้หลายข้อ)</label>
            <div class="space-y-2">
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="diarrheaFoodRisks" value="raw_seafood" class="text-medical-600 rounded mt-0.5">
                <span class="ml-3 text-xs text-slate-800">อาหารทะเล สุกๆ ดิบๆ (หอยแครงลวก, หอยนางรมสด, กุ้งแช่น้ำปลา, ปูม้าดอง, ซาชิมิ)</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="diarrheaFoodRisks" value="papaya_salad_raw" class="text-medical-600 rounded mt-0.5">
                <span class="ml-3 text-xs text-slate-800">ส้มตำ ปลาร้า ลาบ/ก้อยดิบ กุ้งเต้น หรืออาหารอีสานปรุงดิบ</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="diarrheaFoodRisks" value="coconut_milk_overnight" class="text-medical-600 rounded mt-0.5">
                <span class="ml-3 text-xs text-slate-800">อาหารที่มีกะทิ นม ขนมจีน น้ำยา หรืออาหารที่ปรุงค้างมื้อข้ามคืนโดยไม่ได้อุ่นซ้ำ</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="diarrheaFoodRisks" value="fermented_canned" class="text-medical-600 rounded mt-0.5">
                <span class="ml-3 text-xs text-slate-800">อาหารหมักดอง อาหารกระป๋องที่บวมหรือมีกลิ่นผิดปกติ</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="diarrheaFoodRisks" value="untreated_water_ice" class="text-medical-600 rounded mt-0.5">
                <span class="ml-3 text-xs text-slate-800">น้ำดื่ม น้ำแข็งหลอด หรือน้ำจากแหล่งธรรมชาติที่ไม่ผ่านการกรอง/ต้ม</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="diarrheaFoodRisks" value="street_food_buffet" class="text-medical-600 rounded mt-0.5">
                <span class="ml-3 text-xs text-slate-800">อาหารซื้อจากตลาดนัด สตรีทฟู้ด หรืออาหารบุฟเฟต์</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="diarrheaFoodRisks" value="wild_mushroom_plant" class="text-medical-600 rounded mt-0.5">
                <span class="ml-3 text-xs text-slate-800 font-medium">อาหารป่า เห็ดแปลก หรือพืชที่ไม่คุ้นเคย</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl cursor-pointer bg-slate-50 border-slate-300">
                <input type="checkbox" name="diarrheaFoodRisks" id="diarrheaFoodRiskNoneCb" value="none_food_risk" onchange="handleDiarrheaFoodRiskNoneToggle(this)" class="text-medical-600 rounded">
                <span class="ml-3 text-xs font-semibold text-slate-700">ไม่มีประวัติรับประทานอาหารกลุ่มเสี่ยงชัดเจน (รับประทานอาหารปรุงสุกสะอาดปกติ)</span>
              </label>
            </div>
          </div>

          <!-- ประวัติคนรอบข้างที่ทานอาหารร่วมกัน -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">ประวัติคนรอบข้างหรือคนที่ร่วมรับประทานอาหารด้วยกัน</label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="diarrheaSharedMeal" value="outbreak_multiple" onchange="handleDiarrheaSharedMealChange(this.value)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800 font-medium">มีคนอื่นที่ทานอาหารร่วมกันมีอาการถ่ายเหลว คลื่นไส้ หรืออาเจียนพร้อมกัน</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="diarrheaSharedMeal" value="single_case" onchange="handleDiarrheaSharedMealChange(this.value)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">ไม่มีคนอื่นเป็น (มีอาการคนเดียว)</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="diarrheaSharedMeal" value="alone_unknown" onchange="handleDiarrheaSharedMealChange(this.value)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">รับประทานคนเดียว / ไม่ทราบประวัติผู้อื่น</span>
              </label>
            </div>

            <!-- รายละเอียดคนร่วมเป็น -->
            <div id="diarrheaOutbreakWrap" class="hidden mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <label class="block text-[11px] font-semibold text-slate-700 mb-1">ระบุจำนวนคน สถานที่ หรือมื้ออาหารที่ทานร่วมกัน:</label>
              <input type="text" id="diarrheaOutbreakDetails" placeholder="เช่น เพื่อนที่ทานส้มตำด้วยกันเป็นอีก 2 คน หรือเพื่อนร่วมงานที่ไปเลี้ยงบุฟเฟต์" class="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-medical-500">
            </div>
          </div>

          <!-- ประวัติการใช้ยาปฏิชีวนะ (Antibiotics in 3m) -->
          <div class="pt-2 border-t border-slate-100">
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">ประวัติการรับประทานหรือฉีดยาปฏิชีวนะ (ยาฆ่าเชื้อ) ในช่วง 1–3 เดือนที่ผ่านมาก่อนเริ่มมีอาการท้องเสีย</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="diarrheaRecentAbx" value="recent_abx_yes" onchange="handleDiarrheaAbxChange(this.value)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800 font-medium">มีประวัติรับประทานหรือฉีดยาปฏิชีวนะ (ยาฆ่าเชื้อ) ภายใน 1–3 เดือนก่อนเริ่มมีอาการท้องเสีย</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="diarrheaRecentAbx" value="recent_abx_no" onchange="handleDiarrheaAbxChange(this.value)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">ไม่มีประวัติใช้ยาปฏิชีวนะก่อนเริ่มมีอาการท้องเสีย</span>
              </label>
            </div>

            <div id="diarrheaAbxWrap" class="hidden mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <label class="block text-[11px] font-semibold text-slate-700 mb-1">ระบุชื่อยาปฏิชีวนะ หรือโรคที่ได้รับการรักษา (ถ้าทราบ):</label>
              <input type="text" id="diarrheaAbxDetails" placeholder="เช่น Clindamycin จากทำฟัน, Ciprofloxacin, หรือยาฆ่าเชื้อหลังผ่าตัด" class="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-medical-500">
            </div>
          </div>

          <!-- ประวัติการเดินทาง -->
          <div class="pt-2 border-t border-slate-100">
            <label class="selectable-card flex items-center p-3 rounded-xl cursor-pointer">
              <input type="checkbox" id="diarrhea_travel_cb" onchange="handleDiarrheaTravelToggle(this)" class="text-medical-600 rounded">
              <span class="ml-2.5 text-xs font-semibold text-slate-800">เพิ่งเดินทางกลับจากต่างจังหวัด แหล่งท่องเที่ยวธรรมชาติ หรือต่างประเทศ ภายใน 1–2 สัปดาห์</span>
            </label>

            <div id="diarrheaTravelWrap" class="hidden mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <label class="block text-[11px] font-semibold text-slate-700 mb-1">ระบุสถานที่และช่วงเวลาที่เดินทาง:</label>
              <input type="text" id="diarrheaTravelDetails" placeholder="เช่น ไปตั้งแคมป์ริมน้ำตก, ไปต่างประเทศ หรือไปเกาะ" class="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-medical-500">
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 6 (CONDITIONAL FOR FEMALE): ประวัติสตรีวัยเจริญพันธุ์ (LMP & Female Specifics) -->
      <div id="diarrhea_branch_female_lmp" class="hidden bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="heart-pulse" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">6. ข้อมูลเฉพาะสตรีวัยเจริญพันธุ์ (อายุ 12–55 ปี) (Female Reproductive History)</h2>
            <p class="text-xs text-slate-500">คัดกรองภาวะทางสูตินรีเวชฉุกเฉิน เช่น ภาวะตั้งครรภ์นอกมดลูกแตก</p>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">ประวัติประจำเดือนรอบล่าสุด (LMP)</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="diarrheaLmpStatus" value="regular_lmp_exact" onchange="handleDiarrheaLmpStatusChange(this.value)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-slate-800">ประจำเดือนมาตรงตามปกติ</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="diarrheaLmpStatus" value="missed_period" onchange="handleDiarrheaLmpStatusChange(this.value)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-slate-800 font-medium">ขาดประจำเดือน / สงสัยการตั้งครรภ์</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="diarrheaLmpStatus" value="irregular_unsure" onchange="handleDiarrheaLmpStatusChange(this.value)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-slate-800">ประจำเดือนมาไม่สม่ำเสมอ หรือจำวันไม่ได้</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="diarrheaLmpStatus" value="menopause_hysterectomy" onchange="handleDiarrheaLmpStatusChange(this.value)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-slate-800">หมดประจำเดือนแล้ว / ผ่าตัดมดลูก-รังไข่แล้ว</span>
              </label>
            </div>

            <!-- วันที่ LMP -->
            <div id="diarrhea_lmp_date_wrap" class="hidden mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl max-w-xs">
              <label class="block text-[11px] font-semibold text-slate-700 mb-1">วันแรกของประจำเดือนครั้งสุดท้าย:</label>
              <input type="text" id="diarrheaLmpDate" data-universal-date="true" placeholder="วว/ดด/ปปปป (เช่น 12/10/2026)" class="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-medical-500">
            </div>
          </div>

          <div>
            <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer border-slate-200 hover:border-medical-300">
              <input type="checkbox" id="diarrheaFemaleEctopicWarning" class="text-medical-600 rounded mt-0.5">
              <span class="ml-2.5 text-xs text-slate-800 font-medium">มีอาการปวดหน่วงท้องน้อย หรือหน้ามืดเป็นลม ร่วมกับขาดประจำเดือน</span>
            </label>
          </div>
        </div>
      </div>

      <!-- CARD: อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-slate-100 text-slate-600 p-2 rounded-xl">
            <i data-lucide="message-square-plus" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-800">7. อาการอื่น ๆ หรือข้อความเพิ่มเติมถึงแพทย์ (Additional Notes)</h2>
            <p class="text-xs text-slate-500">ระบุรายละเอียดหรือข้อสังเกตของท่านแก่แพทย์ (ถ้ามี)</p>
          </div>
        </div>
        <textarea id="diarrhea_other_free" rows="2" placeholder="ระบุอาการ หรือข้อสังเกตเพิ่มเติม (ถ้ามี)..."
          class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"></textarea>
      </div>

    </div>
  `,
  collectIntake: function(ctx) {
    const _rawDur = parseFloat(document.getElementById('diarrheaDurationVal')?.value); const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
    const durationUnit = document.getElementById('diarrheaDurationUnit')?.value || 'hours';

    const diarrheaOnsetMode = document.querySelector('input[name="diarrheaOnsetMode"]:checked')?.value || 'unspecified';

    const diarrheaFrequency24h = document.querySelector('input[name="diarrheaFrequency24h"]:checked')?.value || 'unspecified';
    const diarrheaVolumePerTime = document.querySelector('input[name="diarrheaVolumePerTime"]:checked')?.value || 'unspecified';
    const diarrheaStoolConsistency = document.querySelector('input[name="diarrheaStoolConsistency"]:checked')?.value || 'unspecified';
    const diarrheaStoolOtherText = document.getElementById('diarrheaStoolOtherText')?.value?.trim() || '';

    const diarrheaHasAbdpain = document.querySelector('input[name="diarrheaHasAbdpain"]:checked')?.value || 'no';
    const diarrheaAbdpainChar = document.querySelector('input[name="diarrheaAbdpainChar"]:checked')?.value || '';
    const diarrheaAbdpainLoc = document.querySelector('input[name="diarrheaAbdpainLoc"]:checked')?.value || '';

    const diarrheaNausea = Boolean(document.getElementById('diarrhea_nausea_cb')?.checked);
    const diarrheaVomit = Boolean(document.getElementById('diarrhea_vomit_cb')?.checked);
    const diarrheaVomitFreq = parseInt(document.getElementById('diarrheaVomitFreq')?.value) || (diarrheaVomit ? 1 : 0);
    const diarrheaVomitChar = document.querySelector('input[name="diarrheaVomitChar"]:checked')?.value || '';
    const diarrheaBloating = Boolean(document.getElementById('diarrhea_bloating_cb')?.checked);
    const diarrheaAnusBurning = Boolean(document.getElementById('diarrhea_anus_burning_cb')?.checked);

    const diarrheaOralTolerance = document.querySelector('input[name="diarrheaOralTolerance"]:checked')?.value || 'unspecified';

    const diarrheaDehydrationSigns = [];
    document.querySelectorAll('input[name="diarrheaDehydrationSigns"]:checked').forEach(cb => {
      if (cb.value !== 'none_dehydration') diarrheaDehydrationSigns.push(cb.value);
    });

    const diarrheaSystemicSigns = [];
    document.querySelectorAll('input[name="diarrheaSystemicSigns"]:checked').forEach(cb => {
      diarrheaSystemicSigns.push(cb.value);
    });

    const diarrheaFoodRisks = [];
    document.querySelectorAll('input[name="diarrheaFoodRisks"]:checked').forEach(cb => {
      if (cb.value !== 'none_food_risk') diarrheaFoodRisks.push(cb.value);
    });

    const diarrheaSharedMeal = document.querySelector('input[name="diarrheaSharedMeal"]:checked')?.value || 'alone_unknown';
    const diarrheaOutbreakDetails = document.getElementById('diarrheaOutbreakDetails')?.value?.trim() || '';

    const diarrheaRecentAbx = document.querySelector('input[name="diarrheaRecentAbx"]:checked')?.value || 'recent_abx_no';
    const diarrheaAbxDetails = document.getElementById('diarrheaAbxDetails')?.value?.trim() || '';

    const diarrheaTravel = Boolean(document.getElementById('diarrhea_travel_cb')?.checked);
    const diarrheaTravelDetails = document.getElementById('diarrheaTravelDetails')?.value?.trim() || '';

    const diarrheaLmpStatus = document.querySelector('input[name="diarrheaLmpStatus"]:checked')?.value || '';
    const diarrheaLmpDate = document.getElementById('diarrheaLmpDate')?.value?.trim() || '';
    const diarrheaFemaleEctopicWarning = Boolean(document.getElementById('diarrheaFemaleEctopicWarning')?.checked);
    const otherSymptomsFree = document.getElementById('diarrhea_other_free')?.value?.trim() || ctx.otherSymptomsFree || '';

    const patient = {
      id: ctx.recordId,
      queue_number: ctx.queueNumber,
      hn: ctx.randomHn,
      name: ctx.patientName,
      age: ctx.patientAge,
      gender: ctx.gender,
      chief_complaint: 'diarrhea',
      chief_complaint_title: 'ถ่ายเหลว / ถ่ายเป็นน้ำ',
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

      diarrheaOnsetMode,
      diarrheaFrequency24h,
      diarrheaVolumePerTime,
      diarrheaStoolConsistency,
      diarrheaStoolOtherText,
      diarrheaHasAbdpain,
      diarrheaAbdpainChar,
      diarrheaAbdpainLoc,
      diarrheaNausea,
      diarrheaVomit,
      diarrheaVomitFreq,
      diarrheaVomitChar,
      diarrheaBloating,
      diarrheaAnusBurning,
      diarrheaOralTolerance,
      diarrheaDehydrationSigns,
      diarrheaSystemicSigns,
      diarrheaFoodRisks,
      diarrheaSharedMeal,
      diarrheaOutbreakDetails,
      diarrheaRecentAbx,
      diarrheaAbxDetails,
      diarrheaTravel,
      diarrheaTravelDetails,
      diarrheaLmpStatus,
      diarrheaLmpDate,
      diarrheaFemaleEctopicWarning
    };

    return patient;
  },
  hydrateForm: function(patient) {
    if (!patient) return;

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = (val !== undefined && val !== null) ? val : '';
    };
    const setRadio = (name, val) => {
      if (!val) return;
      const el = document.querySelector(`input[name="${name}"][value="${val}"]`);
      if (el) el.checked = true;
    };
    const setChk = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.checked = Boolean(val);
    };

    setVal('diarrheaDurationVal', patient.durationVal || '');
    setVal('diarrheaDurationUnit', patient.durationUnit || 'hours');

    setRadio('diarrheaOnsetMode', patient.diarrheaOnsetMode);
    setVal('diarrhea_other_free', patient.otherSymptomsFree || '');

    setRadio('diarrheaFrequency24h', patient.diarrheaFrequency24h);
    setRadio('diarrheaVolumePerTime', patient.diarrheaVolumePerTime);
    setRadio('diarrheaStoolConsistency', patient.diarrheaStoolConsistency);
    setVal('diarrheaStoolOtherText', patient.diarrheaStoolOtherText || '');
    if (patient.diarrheaStoolConsistency === 'other') {
      const wrap = document.getElementById('diarrheaOtherStoolWrap');
      if (wrap) wrap.classList.remove('hidden');
    }

    setRadio('diarrheaHasAbdpain', patient.diarrheaHasAbdpain);
    if (patient.diarrheaHasAbdpain === 'yes') {
      const wrap = document.getElementById('diarrheaAbdpainWrap');
      if (wrap) wrap.classList.remove('hidden');
      setRadio('diarrheaAbdpainChar', patient.diarrheaAbdpainChar);
      setRadio('diarrheaAbdpainLoc', patient.diarrheaAbdpainLoc);
    }

    setChk('diarrhea_nausea_cb', patient.diarrheaNausea);
    setChk('diarrhea_vomit_cb', patient.diarrheaVomit);
    if (patient.diarrheaVomit) {
      const wrap = document.getElementById('diarrheaVomitDetailWrap');
      if (wrap) wrap.classList.remove('hidden');
      setVal('diarrheaVomitFreq', patient.diarrheaVomitFreq || 1);
      setRadio('diarrheaVomitChar', patient.diarrheaVomitChar);
    }
    setChk('diarrhea_bloating_cb', patient.diarrheaBloating);
    setChk('diarrhea_anus_burning_cb', patient.diarrheaAnusBurning);

    setRadio('diarrheaOralTolerance', patient.diarrheaOralTolerance);

    if (Array.isArray(patient.diarrheaDehydrationSigns)) {
      patient.diarrheaDehydrationSigns.forEach(val => {
        const el = document.querySelector(`input[name="diarrheaDehydrationSigns"][value="${val}"]`);
        if (el) el.checked = true;
      });
    }

    if (Array.isArray(patient.diarrheaSystemicSigns)) {
      patient.diarrheaSystemicSigns.forEach(val => {
        const el = document.querySelector(`input[name="diarrheaSystemicSigns"][value="${val}"]`);
        if (el) el.checked = true;
      });
    }

    if (Array.isArray(patient.diarrheaFoodRisks)) {
      patient.diarrheaFoodRisks.forEach(val => {
        const el = document.querySelector(`input[name="diarrheaFoodRisks"][value="${val}"]`);
        if (el) el.checked = true;
      });
    }

    setRadio('diarrheaSharedMeal', patient.diarrheaSharedMeal);
    setVal('diarrheaOutbreakDetails', patient.diarrheaOutbreakDetails || '');
    if (patient.diarrheaSharedMeal === 'outbreak_multiple') {
      const wrap = document.getElementById('diarrheaOutbreakWrap');
      if (wrap) wrap.classList.remove('hidden');
    }

    setRadio('diarrheaRecentAbx', patient.diarrheaRecentAbx);
    setVal('diarrheaAbxDetails', patient.diarrheaAbxDetails || '');
    if (patient.diarrheaRecentAbx === 'recent_abx_yes') {
      const wrap = document.getElementById('diarrheaAbxWrap');
      if (wrap) wrap.classList.remove('hidden');
    }

    setChk('diarrhea_travel_cb', patient.diarrheaTravel);
    setVal('diarrheaTravelDetails', patient.diarrheaTravelDetails || '');
    if (patient.diarrheaTravel) {
      const wrap = document.getElementById('diarrheaTravelWrap');
      if (wrap) wrap.classList.remove('hidden');
    }

    if (patient.gender === 'หญิง') {
      const fCard = document.getElementById('diarrhea_branch_female_lmp');
      if (fCard) fCard.classList.remove('hidden');
      setRadio('diarrheaLmpStatus', patient.diarrheaLmpStatus);
      setVal('diarrheaLmpDate', patient.diarrheaLmpDate || '');
      if (patient.diarrheaLmpStatus === 'regular_lmp_exact') {
        const wrap = document.getElementById('diarrhea_lmp_date_wrap');
        if (wrap) wrap.classList.remove('hidden');
      }
      setChk('diarrheaFemaleEctopicWarning', patient.diarrheaFemaleEctopicWarning);
    }
  },
  populateForm: function(patient) {
    return this.hydrateForm(patient);
  },
  isRedFlag: function(patient) {
    return isDiarrheaRedFlag(patient);
  },
  evaluateRedFlags: function(patient) {
    return evaluateDiarrheaRedFlags(patient);
  },
  updateOutputs: function(patient) {
    updateDiarrheaOutputs(patient);
  },
  generateCds: function(patient, { rfs, ddxList, workupList, managementList }) {
    const stoolChar = patient.diarrheaStoolConsistency || '';
    const stoolFreq = patient.diarrheaFrequency24h || '';
    const dehy = Array.isArray(patient.diarrheaDehydrationSigns) ? patient.diarrheaDehydrationSigns : [];
    const systemic = Array.isArray(patient.diarrheaSystemicSigns) ? patient.diarrheaSystemicSigns : [];
    const painLoc = patient.diarrheaAbdpainLoc || '';
    const painChar = patient.diarrheaAbdpainChar || '';
    const abx = patient.diarrheaRecentAbx || '';
    const outbreak = patient.diarrheaSharedMeal === 'outbreak_multiple';
    const wildToxin = (patient.diarrheaFoodRisks || []).includes('wild_mushroom_plant');

    const isHypovolemicShock = dehy.includes('syncope_blackout') || dehy.includes('cold_clammy_extremities') || dehy.includes('oliguria_anuria_6h');
    const isCholera = stoolChar === 'rice_water' || (stoolFreq === 'freq_gt_10' && patient.diarrheaVolumePerTime === 'profuse_gush');
    const isDysentery = stoolChar === 'mucous_bloody' || (painChar === 'tenesmus' && systemic.includes('fever_chills'));
    const isCdiff = abx === 'recent_abx_yes';
    const isAppendicitis = painLoc === 'rlq' || painChar === 'constant_severe';
    const isEctopic = patient.gender === 'หญิง' && (patient.diarrheaLmpStatus === 'missed_period' || patient.diarrheaFemaleEctopicWarning);

    if (isHypovolemicShock) {
      ddxList.push(`${ddxList.length + 1}. Hypovolemic Shock / Severe Dehydration with Prerenal AKI & Electrolyte Imbalance 🚩`);
    }
    if (isCholera) {
      ddxList.push(`${ddxList.length + 1}. Cholera / Severe Secretory Enteritis (Vibrio cholerae / ETEC) 🚩`);
    }
    if (isDysentery) {
      ddxList.push(`${ddxList.length + 1}. Invasive Bacterial Dysentery / Infectious Colitis (Shigella, Salmonella, Campylobacter, EIEC) 🚩`);
    }
    if (isCdiff) {
      ddxList.push(`${ddxList.length + 1}. Clostridioides difficile Colitis / Pseudomembranous Colitis 🚩`);
    }
    if (isAppendicitis) {
      ddxList.push(`${ddxList.length + 1}. Pelvic Appendicitis / Acute Surgical Abdomen Mimic 🚩`);
    }
    if (isEctopic) {
      ddxList.push(`${ddxList.length + 1}. Ruptured Ectopic Pregnancy in Reproductive-Age Female 🚩`);
    }
    if (wildToxin) {
      ddxList.push(`${ddxList.length + 1}. Natural Botanical / Wild Mushroom Toxin Poisoning 🚩`);
    }
    if (outbreak || ddxList.length === 0) {
      ddxList.push(`${ddxList.length + 1}. Acute Gastroenteritis / Food Poisoning Outbreak (Staphylococcus aureus, Bacillus cereus, Norovirus)`);
    }

    // Workup
    workupList.push('• CBC, BUN/Cr, Electrolytes (Na, K, Cl, HCO3), Dextrostix (DTX)');
    if (isCholera || isDysentery || isHypovolemicShock) {
      workupList.push('• Stool Exam, Stool Occult Blood, Stool Hanging Drop / Vibrio Culture, Stool C/S');
      workupList.push('• Venous Blood Gas (VBG) ประเมิน Metabolic Acidosis และคำนวณ Anion Gap');
    }
    if (systemic.includes('fever_chills') || isDysentery || isHypovolemicShock) {
      workupList.push('• Hemoculture x 2 bottles เพื่อตรวจภาวะ Sepsis / Bacteremia');
    }
    if (isCdiff) {
      workupList.push('• Stool C. difficile Toxin A/B assay และ PCR');
    }
    if (isAppendicitis) {
      workupList.push('• Urgent Ultrasound Whole Abdomen หรือ CT Whole Abdomen, ปรึกษาศัลยแพทย์ด่วน');
    }
    if (isEctopic) {
      workupList.push('• Stat Urine Pregnancy Test (UPT), Pelvic / Transvaginal Ultrasound (TVS), ปรึกษาสูตินรีแพทย์');
    }
    if (wildToxin) {
      workupList.push('• Liver Function Test (LFTs), Coagulogram (PT/INR), Renal Function และโทร 1367 ศูนย์พิษวิทยารามาธิบดี');
    }

    // Management
    if (isHypovolemicShock || isCholera || patient.diarrheaOralTolerance === 'oral_intolerant') {
      managementList.push('• Immediate IV Fluid Resuscitation: เปิดเส้น IV ขนาดใหญ่ 18G 2 เส้น โหลด 0.9% NSS หรือ Ringer\'s Acetate 1,000–2,000 mL IV rapid drip ตาม Volume deficit และประเมิน Vital signs / Urine output ≥ 0.5 mL/kg/hr');
    } else {
      managementList.push('• Oral Rehydration Therapy: จิบ Oral Rehydration Salts (ORS) บ่อยๆ ครั้งละน้อย เพื่อชดเชยน้ำและเกลือแร่ตามปริมาณที่ถ่ายออก');
    }

    if (isDysentery) {
      managementList.push('• Empiric Antibiotics: พิจารณา Ceftriaxone 1–2 g IV OD หรือ Ciprofloxacin 500 mg PO BID หรือ Azithromycin 500 mg PO OD (ห้ามใช้ Antimotility / Loperamide เด็ดขาด)');
    }
    if (isCdiff) {
      managementList.push('• C. diff Management: พิจารณาหยุดยาปฏิชีวนะตัวเดิม และเริ่ม Oral Vancomycin 125 mg PO QID หรือ Fidaxomicin');
    }
    if (isAppendicitis) {
      managementList.push('• NPO & Surgical Consultation: งดน้ำงดอาหารทางปากทันที งดยาระบาย หลีกเลี่ยงยาแก้ปวดที่บดบังอาการ และปรึกษาศัลยแพทย์');
    }
    if (wildToxin) {
      managementList.push('• Poison Center Consultation: ปรึกษาศูนย์พิษวิทยารามาธิบดี (โทร 1367) ทันที พิจารณาให้ Activated Charcoal หากเพิ่งรับประทานมาไม่เกิน 1–2 ชม.');
    }
    managementList.push('• Symptomatic Care: ยาลดอาการปวดเกร็งช่องท้อง (เช่น Hyoscine/Buscopan หากไม่มีภาวะลำไส้อุดตัน), หลีกเลี่ยงการใช้ Loperamide ในกลุ่มที่มีไข้หรือบิดมูกเลือด');
  },
  algorithm: {
    ccId: 'diarrhea',
    schemaKey: 'acute_diarrhea',
    titleTh: 'ถ่ายเหลว / ถ่ายเป็นน้ำ',
    titleEn: 'Acute Diarrhea / Watery Stool / Dysentery / Food Poisoning',
    triageLevelDefault: 3,
    redFlagCategories: [
      'diarrhea_rf_hypovolemic_shock',
      'diarrhea_rf_cholera_like',
      'diarrhea_rf_invasive_dysentery',
      'diarrhea_rf_cdiff',
      'diarrhea_rf_surgical_mimic',
      'diarrhea_rf_ectopic',
      'diarrhea_rf_food_outbreak',
      'diarrhea_rf_wild_toxin'
    ]
  },
  seedPatients: [
    {
      id: 'case-120',
      queue_number: 'A-012',
      hn: '6712034',
      name: 'นายสมชาย ชัยชนะ',
      age: 34,
      gender: 'ชาย',
      chief_complaint: 'diarrhea',
      chief_complaint_title: 'ถ่ายเหลว / ถ่ายเป็นน้ำ',
      timestamp: '2026-10-26T08:15:00.000Z',
      status: 'waiting',
      durationVal: 8,
      durationUnit: 'hours',
      hospRecordStatus: 'self',
      underlying: ['ปฏิเสธ'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'ไม่ได้ระบุ',
      otherSymptomsFree: '',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },

      diarrheaOnsetMode: 'sudden_severe',
      diarrheaFrequency24h: 'freq_4_6',
      diarrheaVolumePerTime: 'moderate',
      diarrheaStoolConsistency: 'loose_mushy',
      diarrheaStoolOtherText: '',
      diarrheaHasAbdpain: 'yes',
      diarrheaAbdpainChar: 'crampy_colicky',
      diarrheaAbdpainLoc: 'periumbilical',
      diarrheaNausea: true,
      diarrheaVomit: true,
      diarrheaVomitFreq: 2,
      diarrheaVomitChar: 'food',
      diarrheaBloating: true,
      diarrheaAnusBurning: false,
      diarrheaOralTolerance: 'oral_tolerated',
      diarrheaDehydrationSigns: [],
      diarrheaSystemicSigns: [],
      diarrheaFoodRisks: ['papaya_salad_raw'],
      diarrheaSharedMeal: 'outbreak_multiple',
      diarrheaOutbreakDetails: 'เพื่อนร่วมโต๊ะส้มตำเป็นด้วย 2 คน',
      diarrheaRecentAbx: 'recent_abx_no',
      diarrheaAbxDetails: '',
      diarrheaTravel: false,
      diarrheaTravelDetails: '',
      diarrheaLmpStatus: '',
      diarrheaLmpDate: '',
      diarrheaFemaleEctopicWarning: false
    },
    {
      id: 'case-121',
      queue_number: 'A-007',
      hn: '6712145',
      name: 'นางสาววรรณา รัตนไพศาล',
      age: 26,
      gender: 'หญิง',
      chief_complaint: 'diarrhea',
      chief_complaint_title: 'ถ่ายเหลว / ถ่ายเป็นน้ำ',
      timestamp: '2026-10-26T07:45:00.000Z',
      status: 'waiting',
      durationVal: 1,
      durationUnit: 'days',
      hospRecordStatus: 'self',
      underlying: ['ปฏิเสธ'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'ไม่ได้ระบุ',
      otherSymptomsFree: '',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },

      diarrheaOnsetMode: 'sudden_severe',
      diarrheaFrequency24h: 'freq_gt_10',
      diarrheaVolumePerTime: 'moderate',
      diarrheaStoolConsistency: 'mucous_bloody',
      diarrheaStoolOtherText: '',
      diarrheaHasAbdpain: 'yes',
      diarrheaAbdpainChar: 'tenesmus',
      diarrheaAbdpainLoc: 'lower_abdomen',
      diarrheaNausea: true,
      diarrheaVomit: false,
      diarrheaVomitFreq: 0,
      diarrheaVomitChar: '',
      diarrheaBloating: false,
      diarrheaAnusBurning: true,
      diarrheaOralTolerance: 'oral_tolerated',
      diarrheaDehydrationSigns: ['postural_dizziness'],
      diarrheaSystemicSigns: ['fever_chills'],
      diarrheaFoodRisks: ['street_food_buffet'],
      diarrheaSharedMeal: 'single_case',
      diarrheaOutbreakDetails: '',
      diarrheaRecentAbx: 'recent_abx_no',
      diarrheaAbxDetails: '',
      diarrheaTravel: false,
      diarrheaTravelDetails: '',
      diarrheaLmpStatus: 'regular_lmp_exact',
      diarrheaLmpDate: '12/10/2026',
      diarrheaFemaleEctopicWarning: false
    },
    {
      id: 'case-122',
      queue_number: 'A-002',
      hn: '6712256',
      name: 'นายประเสริฐ สุขสวัสดิ์',
      age: 74,
      gender: 'ชาย',
      chief_complaint: 'diarrhea',
      chief_complaint_title: 'ถ่ายเหลว / ถ่ายเป็นน้ำ',
      timestamp: '2026-10-26T06:30:00.000Z',
      status: 'waiting',
      durationVal: 12,
      durationUnit: 'hours',
      hospRecordStatus: 'self',
      underlying: ['ความดันสูง (HT)', 'เบาหวาน (DM)'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Amlodipine 5 mg, Metformin 500 mg',
      otherSymptomsFree: '',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },

      diarrheaOnsetMode: 'sudden_severe',
      diarrheaFrequency24h: 'freq_gt_10',
      diarrheaVolumePerTime: 'profuse_gush',
      diarrheaStoolConsistency: 'rice_water',
      diarrheaStoolOtherText: '',
      diarrheaHasAbdpain: 'yes',
      diarrheaAbdpainChar: 'crampy_colicky',
      diarrheaAbdpainLoc: 'periumbilical',
      diarrheaNausea: true,
      diarrheaVomit: true,
      diarrheaVomitFreq: 4,
      diarrheaVomitChar: 'juice',
      diarrheaBloating: false,
      diarrheaAnusBurning: true,
      diarrheaOralTolerance: 'oral_intolerant',
      diarrheaDehydrationSigns: ['dry_mouth_thirst', 'postural_dizziness', 'syncope_blackout', 'oliguria_anuria_6h', 'cold_clammy_extremities', 'muscle_cramps'],
      diarrheaSystemicSigns: ['lethargy_confusion', 'tachypnea_dyspnea'],
      diarrheaFoodRisks: ['raw_seafood'],
      diarrheaSharedMeal: 'alone_unknown',
      diarrheaOutbreakDetails: '',
      diarrheaRecentAbx: 'recent_abx_no',
      diarrheaAbxDetails: '',
      diarrheaTravel: false,
      diarrheaTravelDetails: '',
      diarrheaLmpStatus: '',
      diarrheaLmpDate: '',
      diarrheaFemaleEctopicWarning: false
    },
    {
      id: 'case-123',
      queue_number: 'A-015',
      hn: '6712367',
      name: 'นางสมจิตร์ วงศ์ษา',
      age: 68,
      gender: 'หญิง',
      chief_complaint: 'diarrhea',
      chief_complaint_title: 'ถ่ายเหลว / ถ่ายเป็นน้ำ',
      timestamp: '2026-10-26T09:00:00.000Z',
      status: 'waiting',
      durationVal: 3,
      durationUnit: 'days',
      hospRecordStatus: 'self',
      underlying: ['เบาหวาน (DM)'],
      drugAllergy: 'แพ้ยา Penicillin (ผื่นคัน)',
      currentMeds: 'Glipizide 5 mg',
      otherSymptomsFree: '',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },

      diarrheaOnsetMode: 'gradual_worsening',
      diarrheaFrequency24h: 'freq_7_10',
      diarrheaVolumePerTime: 'moderate',
      diarrheaStoolConsistency: 'loose_mushy',
      diarrheaStoolOtherText: '',
      diarrheaHasAbdpain: 'yes',
      diarrheaAbdpainChar: 'crampy_colicky',
      diarrheaAbdpainLoc: 'diffuse',
      diarrheaNausea: false,
      diarrheaVomit: false,
      diarrheaVomitFreq: 0,
      diarrheaVomitChar: '',
      diarrheaBloating: true,
      diarrheaAnusBurning: true,
      diarrheaOralTolerance: 'oral_tolerated',
      diarrheaDehydrationSigns: ['dry_mouth_thirst'],
      diarrheaSystemicSigns: ['fever_chills'],
      diarrheaFoodRisks: ['none_food_risk'],
      diarrheaSharedMeal: 'single_case',
      diarrheaOutbreakDetails: '',
      diarrheaRecentAbx: 'recent_abx_yes',
      diarrheaAbxDetails: 'Clindamycin จากคลินิกทันตกรรมเมื่อ 1 สัปดาห์ก่อน',
      diarrheaTravel: false,
      diarrheaTravelDetails: '',
      diarrheaLmpStatus: 'menopause_hysterectomy',
      diarrheaLmpDate: '',
      diarrheaFemaleEctopicWarning: false
    }
  ]
});
