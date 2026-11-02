// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 18_dysuria.js
// อาการนำ: ปัสสาวะแสบขัด (Dysuria / Painful Urination)
// ไฟล์นี้แยกอิสระสำหรับอาการนำ dysuria ตามสถาปัตยกรรม Modular Isolation
// รองรับ Zero Default Bias, ซ่อน Red Flags, Universal Date/Time และ TDD Guard
// =========================================================================

// --- Pain Score Touch State Tracking ---
let dysuriaPainScoreTouched = false;

function clearDysuriaPainScore() {
  dysuriaPainScoreTouched = false;
  const slider = document.getElementById('dysuriaPainScore');
  if (slider) slider.value = 0;
  const emojiEl = document.getElementById('dysuriaPainScoreEmoji');
  const textEl = document.getElementById('dysuriaPainScoreText');
  const badgeEl = document.getElementById('dysuriaPainScoreBadge');
  const clearBtn = document.getElementById('dysuriaPainScoreClearBtn');
  if (emojiEl) emojiEl.textContent = '⚪';
  if (textEl) textEl.textContent = 'ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)';
  if (badgeEl) badgeEl.className = 'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all';
  if (clearBtn) clearBtn.classList.add('hidden');
}

function handleDysuriaPainScoreChange(val) {
  dysuriaPainScoreTouched = true;
  const num = parseInt(val, 10);
  const emojiEl = document.getElementById('dysuriaPainScoreEmoji');
  const textEl = document.getElementById('dysuriaPainScoreText');
  const badgeEl = document.getElementById('dysuriaPainScoreBadge');
  const clearBtn = document.getElementById('dysuriaPainScoreClearBtn');
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
  } else if (num <= 9) {
    emoji = '😣';
    label = 'ปวดมาก (ทนแทบไม่ไหว)';
    badgeClass = 'bg-rose-100 text-rose-800 border-rose-300';
  } else {
    emoji = '😭';
    label = 'เจ็บปวดรุนแรงที่สุดในชีวิต';
    badgeClass = 'bg-red-200 text-red-900 border-red-400 animate-pulse';
  }

  emojiEl.textContent = emoji;
  textEl.textContent = `${num} / 10 (${label})`;
  badgeEl.className = `inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border transition ${badgeClass}`;
}

function setDysuriaPainScore(score) {
  dysuriaPainScoreTouched = true;
  const slider = document.getElementById('dysuriaPainScore');
  if (slider) {
    slider.value = score;
    handleDysuriaPainScoreChange(score);
  }
}

// --- Checkbox Exclusion Handlers ---
function handleDysuriaLutsNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="dysuriaLuts"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleDysuriaLutsItemChange(el) {
  if (el && el.checked) {
    const noneCb = document.querySelector('input[name="dysuriaLuts"][value="dysuria_luts_none"]');
    if (noneCb) noneCb.checked = false;
  }
}

function handleDysuriaUrineNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="dysuriaUrineChars"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleDysuriaUrineItemChange(el) {
  if (el && el.checked) {
    const noneCb = document.querySelector('input[name="dysuriaUrineChars"][value="urine_normal_clear"]');
    if (noneCb) noneCb.checked = false;
  }
}

function handleDysuriaSystemicNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="dysuriaSystemicSigns"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleDysuriaSystemicItemChange(el) {
  if (el && el.checked) {
    const noneCb = document.querySelector('input[name="dysuriaSystemicSigns"][value="dysuria_rf_systemic_none"]');
    if (noneCb) noneCb.checked = false;
  }
}

function handleDysuriaMaleNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="dysuriaMaleSigns"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleDysuriaMaleItemChange(el) {
  if (el && el.checked) {
    const noneCb = document.querySelector('input[name="dysuriaMaleSigns"][value="male_none"]');
    if (noneCb) noneCb.checked = false;
  }
}

function handleDysuriaFemaleNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="dysuriaFemaleSigns"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleDysuriaFemaleItemChange(el) {
  if (el && el.checked) {
    const noneCb = document.querySelector('input[name="dysuriaFemaleSigns"][value="female_none"]');
    if (noneCb) noneCb.checked = false;
  }
}

// --- Clinical Red Flag Evaluator ---
function evaluateDysuriaRedFlags(patient) {
  const flags = [];
  if (!patient) return flags;

  const systemicSigns = Array.isArray(patient.dysuriaSystemicSigns) ? patient.dysuriaSystemicSigns : [];
  const urineChars = Array.isArray(patient.dysuriaUrineChars) ? patient.dysuriaUrineChars : [];
  const maleSigns = Array.isArray(patient.dysuriaMaleSigns) ? patient.dysuriaMaleSigns : [];
  const femaleSigns = Array.isArray(patient.dysuriaFemaleSigns) ? patient.dysuriaFemaleSigns : [];
  
  const pmhText = (Array.isArray(patient.underlying) ? patient.underlying.join(' ') : String(patient.underlying || '')) +
                  ' ' + (patient.otherSymptomsFree || '');
  const hasDiabetes = /เบาหวาน|dm|diabetes/i.test(pmhText);

  // 1. Urosepsis / Septic Shock
  if (systemicSigns.includes('dysuria_rf_high_fever_chills') &&
      (systemicSigns.includes('dysuria_rf_hypotension_shock') ||
       systemicSigns.includes('dysuria_rf_altered_mental') ||
       systemicSigns.includes('dysuria_rf_nausea_vomiting'))) {
    flags.push({
      key: 'dysuria_rf_urosepsis',
      level: 1,
      textTh: 'สงสัยภาวะติดเชื้อในกระแสเลือดจากทางเดินปัสสาวะ (Suspected Urosepsis / Septic Shock)',
      risk: 'เสี่ยงต่อภาวะช็อก ความดันตก เลือดไปเลี้ยงอวัยวะไม่เพียงพอ และอวัยวะล้มเหลวเฉียบพลัน',
      suggestedAction: 'Triage Level 1: ย้ายเข้าห้องฉุกเฉินกู้ชีพทันที, เปิด IV สารน้ำ Crystal bolus 30 mL/kg, เจาะ Hemoculture x 2, ส่งตรวจ Stat CBC, BUN, Cr, Electrolytes, Lactate, และให้ Broad-spectrum IV Antibiotics ภายใน 1 ชม.'
    });
  }

  // 2. Fournier's Gangrene / Perineal Necrotizing Fasciitis
  if (systemicSigns.includes('dysuria_rf_perineal_scrotal_severe_pain') ||
      (patient.gender === 'ชาย' && maleSigns.includes('male_testicular_pain_swelling') && (systemicSigns.includes('dysuria_rf_high_fever_chills') || hasDiabetes))) {
    flags.push({
      key: 'dysuria_rf_fournier_gangrene',
      level: 1,
      textTh: 'สงสัยภาวะติดเชื้อเนื้อตายของฝีเย็บและอวัยวะเพศ (Suspected Fournier’s Gangrene / Necrotizing Fasciitis)',
      risk: 'ภาวะฉุกเฉินวิกฤตทางศัลยกรรม มีอัตราเสียชีวิตสูงมากหากไม่ได้รับการผ่าตัดชำระล้างเนื้อตายอย่างทันท่วงที',
      suggestedAction: 'Triage Level 1-2: ปรึกษาศัลยแพทย์ระบบทางเดินปัสสาวะ (Urologist) หรือศัลยแพทย์ทั่วไปเพื่อเตรียมผ่าตัดฉุกเฉิน (Emergent Debridement), เปิด IV Resuscitation, ให้ยาปฏิชีวนะ Triple IV Coverage ทันที'
    });
  }

  // 3. Acute Pyelonephritis (APN) / Complicated Upper UTI
  if ((systemicSigns.includes('dysuria_rf_flank_pain') && systemicSigns.includes('dysuria_rf_high_fever_chills')) ||
      (systemicSigns.includes('dysuria_rf_flank_pain') && systemicSigns.includes('dysuria_rf_nausea_vomiting'))) {
    flags.push({
      key: 'dysuria_rf_acute_pyelonephritis',
      level: 2,
      textTh: 'สงสัยภาวะกรวยไตอักเสบเฉียบพลัน (Suspected Acute Pyelonephritis / Complicated Upper UTI)',
      risk: 'เสี่ยงต่อการเกิดฝีในไต (Renal Abscess), ไตวายเฉียบพลัน และการติดเชื้อลุกลามเข้าสู่กระแสเลือด',
      suggestedAction: 'Triage Level 2: ส่งตรวจ Stat Urinalysis, Urine Gram stain & Culture, CBC, BUN, Cr, ให้ยาปฏิชีวนะทางหลอดเลือดดำ (เช่น IV Ceftriaxone 1-2 g), ทำ Bedside Ultrasound KUB เพื่อแยกภาวะนิ่วอุดกั้นกรวยไต (Obstructive Pyelonephritis)'
    });
  }

  // 4. Gross Hematuria with Clot Retention Risk
  if (urineChars.includes('urine_gross_hematuria')) {
    flags.push({
      key: 'dysuria_rf_gross_hematuria_clots',
      level: 2,
      textTh: 'ปัสสาวะเป็นเลือดสดหรือมีลิ่มเลือด (Gross Hematuria / Risk of Clot Retention)',
      risk: 'เสี่ยงต่อการเกิดลิ่มเลือดอุดกั้นท่อปัสสาวะเฉียบพลัน และอาจเป็นสัญญาณของนิ่วหรือเนื้องอกระบบทางเดินปัสสาวะ',
      suggestedAction: 'Triage Level 2-3: ประเมินความดันโลหิตและภาวะซีด, ตรวจ CBC, Coagulogram, ปัสสาวะ Urinalysis, หากปัสสาวะไม่ออกหรือมีลิ่มเลือดคั่งให้ใส่ 3-way Foley catheter ล้างกระเพาะปัสสาวะ และปรึกษา Urologist'
    });
  }

  // 5. Complicated PID / Severe Pelvic Infection in Female
  if ((patient.gender === 'หญิง' || patient.gender === 'Female') &&
      femaleSigns.includes('female_lower_abd_pelvic_pain') &&
      (femaleSigns.includes('female_vaginal_discharge') || systemicSigns.includes('dysuria_rf_high_fever_chills'))) {
    flags.push({
      key: 'dysuria_rf_pid_complicated',
      level: 2,
      textTh: 'สงสัยภาวะอุ้งเชิงกรานอักเสบเฉียบพลัน (Suspected Pelvic Inflammatory Disease / TOA)',
      risk: 'เสี่ยงต่อการเกิดหนองในอุ้งเชิงกราน (Tubo-ovarian Abscess), เยื่อบุช่องท้องอักเสบ และภาวะมีบุตรยากถาวร',
      suggestedAction: 'Triage Level 2: ตรวจภายใน (Pelvic Examination) ประเมิน Cervical motion tenderness, ตรวจ Urine pregnancy test (hCG) เพื่อแยกการตั้งครรภ์นอกมดลูก, ส่งหนองตรวจ Gram stain/Culture/NAAT, แนะนำ Ceftriaxone 1 g IM ครั้งเดียว ร่วมกับ Doxycycline 100 mg กินวันละ 2 ครั้ง หลังอาหาร นาน 14 วัน ร่วมกับ Metronidazole 400–500 mg กินวันละ 2 ครั้ง หลังอาหาร นาน 14 วัน และรักษาคู่นอนร่วมด้วยเสมอ'
    });
  }

  // 6. Acute Urethritis / STI Discharge in Male
  if ((patient.gender === 'ชาย' || patient.gender === 'Male') &&
      maleSigns.includes('male_urethral_discharge')) {
    flags.push({
      key: 'dysuria_rf_male_urethritis_sti',
      level: 3,
      textTh: 'มีหนองหรือน้ำคัดหลั่งจากท่อปัสสาวะ สงสัยท่อปัสสาวะอักเสบจากโรคติดต่อทางเพศสัมพันธ์ (Urethritis / STI)',
      risk: 'เสี่ยงต่อภาวะอัณฑะและท่อพักอสุจิอักเสบ (Epididymo-orchitis) และการแพร่กระจายเชื้อสู่คู่นอน',
      suggestedAction: 'Triage Level 3-4: ป้ายหนองย้อมสี Gram stain ตรวจหา Gram-negative intracellular diplococci, ให้ Ceftriaxone 1 g IM ครั้งเดียว ร่วมกับ Doxycycline 100 mg รับประทานวันละ 2 ครั้ง 7 วัน, ตรวจคัดกรองซิฟิลิสและเอชไอวี และรักษาคู่นอนร่วมด้วยเสมอ'
    });
  }

  return flags;
}

// --- Output Generator (Rapid Bullet, Narrative & JSON Schema) ---
function updateDysuriaOutputs(patient) {
  if (!patient) return;

  const timing = patient.dysuriaTiming || 'unspecified';
  const luts = Array.isArray(patient.dysuriaLuts) ? patient.dysuriaLuts : [];
  const urineChars = Array.isArray(patient.dysuriaUrineChars) ? patient.dysuriaUrineChars : [];
  const systemicSigns = Array.isArray(patient.dysuriaSystemicSigns) ? patient.dysuriaSystemicSigns : [];
  const maleSigns = Array.isArray(patient.dysuriaMaleSigns) ? patient.dysuriaMaleSigns : [];
  const femaleSigns = Array.isArray(patient.dysuriaFemaleSigns) ? patient.dysuriaFemaleSigns : [];

  const timingMap = {
    timing_initial: 'แสบแปลบช่วงแรกที่เริ่มปล่อยปัสสาวะ (Initial dysuria / Urethral)',
    timing_terminal: 'แสบขัดบีบเกร็งช่วงท้ายตอนปัสสาวะใกล้สุด (Terminal dysuria / Bladder)',
    timing_throughout: 'แสบขัดตลอดเวลาตั้งแต่เริ่มจนสุด และแสบค้างต่อเนื่อง (Continuous dysuria)',
    timing_external_vulvar: 'แสบเฉพาะผิวภายนอกเมื่อน้ำปัสสาวะโดนผิวหนัง/แผล (External dysuria)'
  };

  const lutsMap = {
    dysuria_freq_urgency: 'ปัสสาวะบ่อยทุก 15-30 นาที หรือปวดเบ่งกลั้นแทบไม่ทัน',
    dysuria_incomplete_dribble: 'ปัสสาวะไม่สุด หยดกะปริบกะปรอย',
    dysuria_hesitancy_weak_stream: 'ปัสสาวะรอนาน ลำปัสสาวะพุ่งช้า ลำเล็ก ต้องออกแรงเบ่ง',
    dysuria_strangury: 'ปวดเบ่งบิดเกร็งรุนแรงขณะปัสสาวะ ถ่ายไม่ออกหรือออกทีละหยด',
    dysuria_stone_interruption: 'ลำปัสสาวะสะดุดหยุดไหลกะทันหัน',
    dysuria_luts_none: 'ปฏิเสธปัสสาวะบ่อยหรือกลั้นไม่อยู่ ปัสสาวะพุ่งดีตามปกติ'
  };

  const urineMap = {
    urine_turbid_foul: 'ปัสสาวะขุ่น มีฝ้าขาว ตะกอน หรือกลิ่นเหม็นรุนแรง',
    urine_gross_hematuria: 'ปัสสาวะสีแดงสด สีน้ำล้างเนื้อ หรือมีลิ่มเลือดปน',
    urine_gravel_sediment: 'มีเศษกรวด เม็ดทราย หรือขุยผงเล็กๆ ปนออกมา',
    urine_normal_clear: 'ปัสสาวะใสสีเหลืองปกติ ไม่มีเลือดหรือตะกอน'
  };

  const systemicMap = {
    dysuria_rf_high_fever_chills: 'มีไข้สูง หนาวสั่นสะท้านจับไข้ หรือตัวเย็นสั่น',
    dysuria_rf_flank_pain: 'ปวดบั้นเอวด้านหลัง หรือสะเทือนแล้วเจ็บบริเวณสีข้างรุนแรง',
    dysuria_rf_nausea_vomiting: 'คลื่นไส้ อาเจียนหลายครั้ง อ่อนเพลียจนทานอาหาร/ดื่มน้ำไม่ได้',
    dysuria_rf_perineal_scrotal_severe_pain: 'ปวด บวม แดง ร้อน รุนแรงบริเวณถุงอัณฑะ ฝีเย็บ หว่างขา หรือผิวหนังคล้ำ/มีตุ่มพอง',
    dysuria_rf_hypotension_shock: 'หน้ามืด วูบหมดสติ วิงเวียนรุนแรง เหงื่อแตกตัวเย็นซีด',
    dysuria_rf_altered_mental: 'มีอาการซึมลง สับสน เอะอะโวยวาย หรือพูดจาไม่รู้เรื่อง',
    dysuria_rf_systemic_none: 'ปฏิเสธไข้หนาวสั่น ปฏิเสธปวดหลัง ไม่มีอาการรุนแรงทางร่างกาย'
  };

  const maleMap = {
    male_urethral_discharge: 'มีหนองข้นสีเหลืองหรือเขียว หรือมีมูกใส/ขุ่น ไหลซึมออกจากปลายท่อปัสสาวะ',
    male_testicular_pain_swelling: 'ปวดบวมเจ็บที่ลูกอัณฑะ หรือเจ็บลึกบริเวณฝีเย็บ',
    male_sti_risk: 'มีประวัติเพศสัมพันธ์ไม่ได้สวมถุงยางอนามัย หรือมีคู่นอนใหม่ในช่วง 1-4 สัปดาห์',
    male_none: 'ปฏิเสธหนองไหล ปฏิเสธปวดบวมอัณฑะ ปฏิเสธความเสี่ยง STI'
  };

  const femaleMap = {
    female_vaginal_discharge: 'มีตกขาวผิดปกติ ปริมาณมาก สีเหลือง/เขียว/เป็นก้อน หรือกลิ่นเหม็นคาว',
    female_lower_abd_pelvic_pain: 'ปวดหน่วงท้องน้อย ปวดลึกในอุ้งเชิงกราน หรือเจ็บขณะมีเพศสัมพันธ์',
    female_vulvar_ulcer_itching: 'มีแผลพุพอง ตุ่มน้ำใส หรือคันแสบมากบริเวณอวัยวะเพศภายนอก',
    female_none: 'ปฏิเสธตกขาวผิดปกติ ปฏิเสธปวดหน่วงท้องน้อยอุ้งเชิงกราน'
  };

  const redFlags = evaluateDysuriaRedFlags(patient);

  const durationStr = patient.durationVal ? `${patient.durationVal} ${patient.durationUnit === 'hours' ? 'ชั่วโมง' : patient.durationUnit === 'days' ? 'วัน' : patient.durationUnit === 'minutes' ? 'นาที' : patient.durationUnit === 'weeks' ? 'สัปดาห์' : patient.durationUnit === 'months' ? 'เดือน' : (patient.durationUnit || 'วัน')}` : 'ไม่ระบุ';

  // Compute Pertinent Positives and Negatives
  const positives = [];
  const negatives = [];

  luts.filter(k => k !== 'dysuria_luts_none').forEach(k => {
    if (lutsMap[k]) positives.push(lutsMap[k]);
  });
  if (luts.includes('dysuria_luts_none')) negatives.push('ไม่มีอาการปัสสาวะบ่อยหรือกลั้นไม่อยู่');

  urineChars.filter(k => k !== 'urine_normal_clear').forEach(k => {
    if (urineMap[k]) positives.push(urineMap[k]);
  });
  if (urineChars.includes('urine_normal_clear')) negatives.push('ไม่มีเลือดหรือตะกอนขุ่นในปัสสาวะ');

  systemicSigns.filter(k => k !== 'dysuria_rf_systemic_none').forEach(k => {
    if (systemicMap[k]) positives.push(systemicMap[k]);
  });
  if (systemicSigns.includes('dysuria_rf_systemic_none')) negatives.push('ปฏิเสธไข้หนาวสั่น, ไม่มีปวดบั้นเอว');

  if (patient.gender === 'ชาย' || patient.gender === 'Male') {
    maleSigns.filter(k => k !== 'male_none').forEach(k => {
      if (maleMap[k]) positives.push(maleMap[k]);
    });
    if (maleSigns.includes('male_none')) negatives.push('ปฏิเสธหนองไหลจากท่อปัสสาวะ, อัณฑะไม่บวมเจ็บ');
  } else if (patient.gender === 'หญิง' || patient.gender === 'Female') {
    femaleSigns.filter(k => k !== 'female_none').forEach(k => {
      if (femaleMap[k]) positives.push(femaleMap[k]);
    });
    if (femaleSigns.includes('female_none')) negatives.push('ปฏิเสธตกขาวผิดปกติ, ไม่ปวดหน่วงท้องน้อย');
    if (patient.dysuriaLmpDate) {
      positives.push(`ประจำเดือนครั้งสุดท้าย (LMP): ${patient.dysuriaLmpDate}`);
    }
    if (patient.dysuriaFemalePregnancyWarning) {
      positives.push('ขาดประจำเดือน หรือสงสัยว่ากำลังตั้งครรภ์ 🚩');
    }
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

  // Build Rapid Note (Standardized: Primary descriptor at top, details in Pertinent without category prefixes)
  const defaultRapid =
`[Chief Complaint (CC)]
ปัสสาวะแสบขัด (Dysuria) มา ${durationStr}

[History of Present Illness (HPI)]
• จังหวะที่ปัสสาวะแสบขัด: ${timingMap[timing] || 'ไม่ได้ระบุ'}${patient.painScore !== null && patient.painScore !== undefined ? ` (Pain Score: ${patient.painScore}/10)` : ''}

• Pertinent Positives:
${positives.length > 0 ? positives.map(p => `  - ${p}`).join('\n') : '  - ไม่มีอาการร่วมอื่นที่เด่นชัด'}

• Pertinent Negatives:
${negatives.map(n => `  - ${n}`).join('\n')}

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

  // Build Narrative Note
  let narrative = `ผู้ป่วย${patient.gender || ''}ไทย อายุ ${patient.age || '-'} ปี มารับการตรวจที่ห้องฉุกเฉินด้วยอาการปัสสาวะแสบขัด เป็นมา ${durationStr} ก่อนมาโรงพยาบาล `;
  narrative += `ผู้ป่วยให้ประวัติลักษณะการแสบขัดคือ${timingMap[timing] || 'มีอาการแสบขัดเวลาปัสสาวะ'} `;
  if (patient.painScore !== null && patient.painScore !== undefined) {
    narrative += `ประเมินระดับความปวดแสบได้ ${patient.painScore}/10 คะแนน `;
  }

  if (luts.length > 0 && !luts.includes('dysuria_luts_none')) {
    narrative += `ร่วมกับมีอาการผิดปกติในการขับถ่ายปัสสาวะ ได้แก่ ${luts.map(k => lutsMap[k]).filter(Boolean).join(', ')} `;
  } else {
    narrative += `ไม่มีอาการปัสสาวะบ่อยหรือกลั้นไม่อยู่ ลำปัสสาวะพุ่งดีตามปกติ `;
  }

  if (urineChars.length > 0 && !urineChars.includes('urine_normal_clear')) {
    narrative += `สังเกตเห็นน้ำปัสสาวะมีลักษณะ${urineChars.map(k => urineMap[k]).filter(Boolean).join(', ')} `;
  } else {
    narrative += `น้ำปัสสาวะใสสีเหลืองปกติ ไม่มีเลือดหรือตะกอนปน `;
  }

  if (systemicSigns.length > 0 && !systemicSigns.includes('dysuria_rf_systemic_none')) {
    narrative += `มีอาการร่วมทางร่างกาย ได้แก่ ${systemicSigns.map(k => systemicMap[k]).filter(Boolean).join(', ')} `;
  } else {
    narrative += `ปฏิเสธไข้ ปฏิเสธหนาวสั่น ไม่มีอาการปวดบั้นเอวด้านหลังหรือสะเทือนเจ็บสีข้าง ไม่มีคลื่นไส้อาเจียน และไม่มีอาการหน้ามืดวิงเวียน `;
  }

  if (patient.gender === 'ชาย' || patient.gender === 'Male') {
    if (maleSigns.length > 0 && !maleSigns.includes('male_none')) {
      narrative += `\nข้อมูลเฉพาะเพศชาย: ${maleSigns.map(k => maleMap[k]).filter(Boolean).join(', ')} `;
    } else {
      narrative += `\nปฏิเสธหนองหรือมูกไหลจากปลายท่อปัสสาวะ ลูกอัณฑะไม่บวมเจ็บ `;
    }
  } else if (patient.gender === 'หญิง' || patient.gender === 'Female') {
    if (patient.dysuriaLmpDate) {
      narrative += `\nข้อมูลเฉพาะสตรี: ประจำเดือนรอบล่าสุด (LMP) วันที่ ${patient.dysuriaLmpDate} `;
      if (patient.dysuriaFemalePregnancyWarning) narrative += `(สงสัยภาวะตั้งครรภ์/ขาดประจำเดือน) `;
    }
    if (femaleSigns.length > 0 && !femaleSigns.includes('female_none')) {
      narrative += `มีอาการทางนรีเวชร่วมด้วย ได้แก่ ${femaleSigns.map(k => femaleMap[k]).filter(Boolean).join(', ')} `;
    } else {
      narrative += `ปฏิเสธตกขาวผิดปกติหรือมีกลิ่นเหม็น ปฏิเสธอาการปวดหน่วงลึกในอุ้งเชิงกราน `;
    }
  }

  if (patient.otherSymptomsFree) {
    narrative += `\nข้อสังเกตเพิ่มเติมจากผู้ป่วย/ญาติ: ${patient.otherSymptomsFree}`;
  }

  // Build JSON Output Schema
  const jsonOutput = {
    encounter: {
      chief_complaint: 'dysuria',
      chief_complaint_title_th: 'ปัสสาวะแสบขัด',
      timestamp: patient.timestamp || new Date().toISOString(),
      duration_val: patient.durationVal || null,
      duration_unit: patient.durationUnit || 'days'
    },
    patient_identification: {
      id: patient.id || null,
      queue_number: patient.queue_number || null,
      hn: patient.hn || null,
      name: patient.name || null,
      age: patient.age || null,
      gender: patient.gender || null
    },
    triage_assessment: {
      timing_type: timing,
      pain_score: patient.painScore !== null && patient.painScore !== undefined ? patient.painScore : null,
      associated_luts: luts,
      urine_characteristics: urineChars,
      systemic_signs: systemicSigns,
      gender_specific_signs: {
        male: (patient.gender === 'ชาย' || patient.gender === 'Male') ? maleSigns : null,
        female: (patient.gender === 'หญิง' || patient.gender === 'Female') ? {
          lmp_date: patient.dysuriaLmpDate || null,
          pregnancy_warning: Boolean(patient.dysuriaFemalePregnancyWarning),
          symptoms: femaleSigns
        } : null
      },
      other_symptoms_free: patient.otherSymptomsFree || ''
    },
    safety_and_red_flags: {
      red_flags_detected: redFlags.map(rf => ({
        key: rf.key,
        level: rf.level,
        title_th: rf.textTh,
        clinical_risk: rf.risk,
        action: rf.suggestedAction
      })),
      total_red_flags: redFlags.length,
      urosepsis: redFlags.some(rf => rf.key === 'dysuria_rf_urosepsis'),
      fournier_gangrene: redFlags.some(rf => rf.key === 'dysuria_rf_fournier_gangrene'),
      acute_pyelonephritis: redFlags.some(rf => rf.key === 'dysuria_rf_acute_pyelonephritis'),
      gross_hematuria_clots: redFlags.some(rf => rf.key === 'dysuria_rf_gross_hematuria_clots'),
      pid_complicated: redFlags.some(rf => rf.key === 'dysuria_rf_pid_complicated'),
      male_urethritis_sti: redFlags.some(rf => rf.key === 'dysuria_rf_male_urethritis_sti')
    }
  };

  const rapidEl = document.getElementById('rapidTextView');
  if (rapidEl) rapidEl.value = patient.custom_rapid_note || defaultRapid;

  const narrativeEl = document.getElementById('narrativeTextView');
  if (narrativeEl) narrativeEl.value = patient.custom_narrative_note || narrative;

  const jsonEl = document.getElementById('jsonViewer');
  if (jsonEl) jsonEl.textContent = JSON.stringify(jsonOutput, null, 2);
}

// --- Built-in Clinical Decision Support (CDS) Generator ---
function generateDysuriaCds(patient, { rfs, ddxList = [], workupList = [], managementList = [] } = {}) {
  if (!patient) return;

  const redFlags = rfs || evaluateDysuriaRedFlags(patient);
  const urineChars = Array.isArray(patient.dysuriaUrineChars) ? patient.dysuriaUrineChars : [];
  const luts = Array.isArray(patient.dysuriaLuts) ? patient.dysuriaLuts : [];
  const maleSigns = Array.isArray(patient.dysuriaMaleSigns) ? patient.dysuriaMaleSigns : [];
  const femaleSigns = Array.isArray(patient.dysuriaFemaleSigns) ? patient.dysuriaFemaleSigns : [];

  if (redFlags.some(r => r.key === 'dysuria_rf_urosepsis')) {
    ddxList.push('1. 🚨 Urosepsis / Septic Shock secondary to Complicated UTI');
    ddxList.push('2. Severe Acute Pyelonephritis with bacteremia');
    ddxList.push('3. Obstructive Uropathy with infected hydronephrosis');
    workupList.push('Stat Hemoculture x 2 bottles (ก่อนเริ่มยาปฏิชีวนะ)');
    workupList.push('CBC, BUN, Cr, Electrolytes, Serum Lactate, Venous/Arterial Blood Gas');
    workupList.push('Stat Urinalysis and Urine Culture & Sensitivity');
    workupList.push('Bedside Ultrasound KUB (ดู Hydronephrosis / Stone obstruction / Perinephric fluid)');
    managementList.push('Triage Level 1: ย้ายเข้า Resuscitation Room ทันที');
    managementList.push('Fluid Resuscitation: IV NSS หรือ Acetar 30 mL/kg bolus ภายใน 3 ชม.แรก');
    managementList.push('Antibiotics: ให้ Broad-Spectrum IV Antibiotics (เช่น IV Ceftriaxone 2 g หรือ Meropenem 1 g) ภายใน 1 ชม. (Hour-1 Sepsis Bundle)');
    managementList.push('Decompression: หากมีนิ่วอุดกั้นหรือปัสสาวะคั่ง ให้ปรึกษา Urologist เพื่อใส่ Double-J Stent หรือ Percutaneous Nephrostomy (PCN)');
  } else if (redFlags.some(r => r.key === 'dysuria_rf_fournier_gangrene')) {
    ddxList.push('1. 🚨 Fournier’s Gangrene / Necrotizing Fasciitis of Perineum & Genitalia');
    ddxList.push('2. Acute Severe Epididymo-orchitis with scrotal abscess');
    ddxList.push('3. Perianal / Ischiorectal Abscess');
    workupList.push('Stat Urgent Urology / General Surgery Consultation for Emergent OR Debridement');
    workupList.push('CBC, Electrolytes, BUN, Cr, Coagulogram, Blood Culture x 2');
    workupList.push('Bedside Ultrasound Scrotum / CT Pelvis & Perineum with IV contrast');
    managementList.push('Triage Level 1-2: เซ็นยินยอมเตรียมผ่าตัดชำระล้างเนื้อตายด่วน (Immediate Debridement)');
    managementList.push('Triple Coverage IV Antibiotics: Ceftriaxone 2 g IV + Metronidazole 500 mg IV + Ciprofloxacin หรือ Gentamicin (หรือ Meropenem + Vancomycin)');
    managementList.push('Aggressive IV Fluid Resuscitation และเฝ้าระวังภาวะ Septic Shock');
  } else if (redFlags.some(r => r.key === 'dysuria_rf_acute_pyelonephritis')) {
    ddxList.push('1. ⚠️ Acute Pyelonephritis (APN) / Complicated Upper Urinary Tract Infection');
    ddxList.push('2. Renal / Perinephric Abscess');
    ddxList.push('3. Ureteral Calculus with secondary UTI');
    workupList.push('Stat Urinalysis (ตรวจ WBC, RBC, Leukocyte Esterase, Nitrite)');
    workupList.push('Urine Gram stain, Urine Culture and Sensitivity (Gold standard)');
    workupList.push('CBC, BUN, Cr, Electrolytes, Blood Culture x 2 (หากมีไข้สูงหนาวสั่น)');
    workupList.push('Bedside Ultrasound KUB เพื่อประเมินภาวะ Hydronephrosis / Renal stone');
    managementList.push('Triage Level 2: ให้สารน้ำ IV Hydration เพื่อแก้ไขภาวะขาดน้ำจากอาเจียนและไข้สูง');
    managementList.push('Empiric IV Antibiotics: IV Ceftriaxone 1-2 g OD (หรือ IV Ciprofloxacin / Cefotaxime ตาม Antibiogram)');
    managementList.push('Antipyretics & Antiemetics: Paracetamol 500 mg PO/IV, Ondansetron 4-8 mg IV prn');
    managementList.push('Admission Criteria: พิจารณารับไว้รักษาใน รพ. หากมีอาเจียนทานยาไม่ได้, ตั้งครรภ์, มีโรคเบาหวาน, หรือสูงอายุ');
  } else if (redFlags.some(r => r.key === 'dysuria_rf_pid_complicated')) {
    ddxList.push('1. ⚠️ Pelvic Inflammatory Disease (PID) / Acute Salpingo-oophoritis');
    ddxList.push('2. Ruptured / Threatened Tubo-Ovarian Abscess (TOA)');
    ddxList.push('3. Ectopic Pregnancy with pelvic tenderness (ต้องแยกโรคเสมอ)');
    ddxList.push('4. Acute Appendicitis / Diverticulitis');
    workupList.push('Stat Urine Pregnancy Test (Urine hCG) ทันทีเพื่อคัดกรองการตั้งครรภ์นอกมดลูก');
    workupList.push('Pelvic Examination: ประเมิน Cervical motion tenderness (Chandelier sign), Adnexal tenderness');
    workupList.push('Endocervical Swab for Gram stain, Culture, and NAAT for N. gonorrhoeae & C. trachomatis');
    workupList.push('Transvaginal / Pelvic Ultrasound หากคลำพบก้อนหน่วงหรือสงสัย TOA');
    managementList.push('Triage Level 2: แนะนำ Ceftriaxone 1 g IM ครั้งเดียว ร่วมกับ Doxycycline 100 mg กินวันละ 2 ครั้ง หลังอาหาร นาน 14 วัน ร่วมกับ Metronidazole 400–500 mg กินวันละ 2 ครั้ง หลังอาหาร นาน 14 วัน และรักษาคู่นอนร่วมด้วยเสมอ');
    managementList.push('หากมีไข้สูง คลื่นไส้อาเจียนรุนแรง หรือสงสัย TOA แนะนำรับไว้รักษาใน รพ. ให้ IV Cefoxitin/Ceftriaxone + Doxycycline IV');
  } else if (redFlags.some(r => r.key === 'dysuria_rf_male_urethritis_sti')) {
    ddxList.push('1. ⚠️ Acute Infectious Urethritis (Gonococcal vs Non-Gonococcal Urethritis - NGU)');
    ddxList.push('2. Acute Epididymo-orchitis (หากมีอาการเจ็บอัณฑะร่วมด้วย)');
    ddxList.push('3. Acute Prostatitis');
    workupList.push('Urethral swab / First-void urine for Gram stain (ตรวจหากลุ่ม Gram-negative intracellular diplococci)');
    workupList.push('NAAT for Chlamydia trachomatis & Neisseria gonorrhoeae');
    workupList.push('Serology screening: Anti-HIV, VDRL/RPR, HBsAg');
    managementList.push('Triage Level 3: ให้ Ceftriaxone 1 g IM ครั้งเดียว ร่วมกับ Doxycycline 100 mg รับประทานวันละ 2 ครั้ง นาน 7 วัน');
    managementList.push('Counseling: แนะนำรักษาคู่นอนร่วมด้วยเสมอ งดมีเพศสัมพันธ์จนกว่าจะครบการรักษา 7 วัน และใช้ถุงยางอนามัยทุกครั้ง');
  } else if (redFlags.some(r => r.key === 'dysuria_rf_gross_hematuria_clots') || urineChars.includes('urine_gravel_sediment') || luts.includes('dysuria_stone_interruption')) {
    ddxList.push('1. Urolithiasis (Bladder Calculus / Lower Ureteric Calculus)');
    ddxList.push('2. Hemorrhagic Cystitis (Bacterial vs Viral vs Chemical)');
    ddxList.push('3. Urothelial Carcinoma / Bladder Malignancy (หากเป็นผู้สูงอายุ)');
    workupList.push('Urinalysis (ตรวจ RBC, WBC, Dysmorphic RBC, Crystals)');
    workupList.push('Plain KUB / Bedside Ultrasound KUB / Non-contrast CT KUB');
    workupList.push('CBC, Coagulogram (PT, PTT, INR), BUN, Cr');
    managementList.push('Triage Level 3: ให้ยาแก้ปวด Spasmolytic (Hyoscine) หรือ NSAIDs (Ketorolac/Ibuprofen) หากไตปกติ');
    managementList.push('Fluid hydration เพื่อกระตุ้นการขับตะกอนนิ่ว และเฝ้าระวังลิ่มเลือดอุดกั้น (Clot retention)');
    managementList.push('หากมีลิ่มเลือดปริมาณมากปัสสาวะไม่ออก ให้ใส่สายสวน 3 ทางล้างกระเพาะปัสสาวะ และปรึกษา Urologist');
  } else {
    ddxList.push('1. Acute Simple Cystitis (Uncomplicated Lower UTI)');
    ddxList.push('2. Honeymoon Cystitis / Post-coital Bladder Irritation');
    ddxList.push('3. Chemical / Contact Urethritis');
    workupList.push('Urinalysis (UA) - ตรวจหา WBC > 5-10/HPF, Bacteria, Positive Leukocyte Esterase / Nitrite');
    workupList.push('Urine pregnancy test ในสตรีวัยเจริญพันธุ์');
    managementList.push('Triage Level 4: Oral Antibiotics สูตรมาตรฐาน Uncomplicated Cystitis:');
    managementList.push('- Fosfomycin trometamol 3 g ชงดื่มครั้งเดียว (Single dose)');
    managementList.push('- หรือ Nitrofurantoin 100 mg รับประทานวันละ 2 ครั้ง หลังอาหาร 5 วัน');
    managementList.push('Symptomatic Relief: Phenazopyridine 200 mg รับประทานวันละ 3 ครั้ง หลังอาหาร 1-2 วัน (แจ้งเตือนปัสสาวะเปลี่ยนเป็นสีส้มแดง)');
    managementList.push('Patient Education: ดื่มน้ำสะอาดมากๆ ไม่กลั้นปัสสาวะ และกลับมาตรวจซ้ำทันทีหากมีไข้หรือปวดบั้นเอวด้านหลัง');
  }
}

// --- Seed Patient Cases (4 Cases) ---
const dysuriaSeedCases = [
  {
    id: 'case-180',
    queue_number: 'B080',
    hn: '691800',
    name: 'นางสาว กัญญารัตน์ ปัสสาวะแสบ',
    age: 24,
    gender: 'หญิง',
    chief_complaint: 'dysuria',
    chief_complaint_title: 'ปัสสาวะแสบขัด',
    timestamp: '2026-10-27T09:00:00.000Z',
    status: 'waiting',
    durationVal: 1,
    durationUnit: 'days',
    painScore: 5,
    dysuriaTiming: 'timing_terminal',
    dysuriaLuts: ['dysuria_freq_urgency', 'dysuria_incomplete_dribble'],
    dysuriaUrineChars: ['urine_turbid_foul'],
    dysuriaSystemicSigns: ['dysuria_rf_systemic_none'],
    dysuriaMaleSigns: [],
    dysuriaFemaleSigns: ['female_none'],
    dysuriaLmpDate: '15/10/2026',
    dysuriaFemalePregnancyWarning: false,
    otherSymptomsFree: 'เข้าห้องน้ำทุก 20 นาที ปวดเกร็งตอนปัสสาวะใกล้สุด ไม่มีไข้ ไม่ปวดหลัง',
    underlying: ['ปฏิเสธ'],
    drugAllergy: 'ปฏิเสธ',
    currentMeds: 'ไม่มี',
    doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' }
  },
  {
    id: 'case-181',
    queue_number: 'A081',
    hn: '691801',
    name: 'นาง สมศรี กรวยไตอักเสบ',
    age: 45,
    gender: 'หญิง',
    chief_complaint: 'dysuria',
    chief_complaint_title: 'ปัสสาวะแสบขัด',
    timestamp: '2026-10-27T09:30:00.000Z',
    status: 'waiting',
    durationVal: 3,
    durationUnit: 'days',
    painScore: 8,
    dysuriaTiming: 'timing_throughout',
    dysuriaLuts: ['dysuria_freq_urgency', 'dysuria_strangury'],
    dysuriaUrineChars: ['urine_turbid_foul'],
    dysuriaSystemicSigns: ['dysuria_rf_high_fever_chills', 'dysuria_rf_flank_pain', 'dysuria_rf_nausea_vomiting'],
    dysuriaMaleSigns: [],
    dysuriaFemaleSigns: ['female_none'],
    dysuriaLmpDate: '02/10/2026',
    dysuriaFemalePregnancyWarning: false,
    otherSymptomsFree: 'มีไข้สูงหนาวสั่นจับไข้ 39 องศา ปวดเคาะเจ็บบั้นเอวด้านขวามาก อาเจียน 3 รอบ กินข้าวไม่ได้',
    underlying: ['เบาหวาน (DM)', 'ความดันโลหิตสูง'],
    drugAllergy: 'แพ้ Sulfa (ผื่นคัน)',
    currentMeds: 'Metformin 500 mg, Enalapril 10 mg',
    doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' }
  },
  {
    id: 'case-182',
    queue_number: 'B082',
    hn: '691802',
    name: 'นาย ธีรภัทร ท่อปัสสาวะอักเสบ',
    age: 26,
    gender: 'ชาย',
    chief_complaint: 'dysuria',
    chief_complaint_title: 'ปัสสาวะแสบขัด',
    timestamp: '2026-10-27T10:15:00.000Z',
    status: 'waiting',
    durationVal: 4,
    durationUnit: 'days',
    painScore: 7,
    dysuriaTiming: 'timing_initial',
    dysuriaLuts: ['dysuria_luts_none'],
    dysuriaUrineChars: ['urine_normal_clear'],
    dysuriaSystemicSigns: ['dysuria_rf_systemic_none'],
    dysuriaMaleSigns: ['male_urethral_discharge', 'male_sti_risk'],
    dysuriaFemaleSigns: [],
    dysuriaLmpDate: '',
    dysuriaFemalePregnancyWarning: false,
    otherSymptomsFree: 'แสบปลายท่อปัสสาวะมากตั้งแต่เริ่มปัสสาวะ มีหนองสีเหลืองข้นเปื้อนกางเกงใน มีเพศสัมพันธ์ไม่ได้สวมถุงยางเมื่อ 5 วันก่อน',
    underlying: ['ปฏิเสธ'],
    drugAllergy: 'ปฏิเสธ',
    currentMeds: 'ไม่มี',
    doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' }
  },
  {
    id: 'case-183',
    queue_number: 'A083',
    hn: '691803',
    name: 'นาย ไชยา นิ่วทางเดินปัสสาวะติดเชื้อ',
    age: 62,
    gender: 'ชาย',
    chief_complaint: 'dysuria',
    chief_complaint_title: 'ปัสสาวะแสบขัด',
    timestamp: '2026-10-27T10:45:00.000Z',
    status: 'waiting',
    durationVal: 2,
    durationUnit: 'days',
    painScore: 9,
    dysuriaTiming: 'timing_throughout',
    dysuriaLuts: ['dysuria_stone_interruption', 'dysuria_strangury'],
    dysuriaUrineChars: ['urine_gross_hematuria', 'urine_gravel_sediment'],
    dysuriaSystemicSigns: ['dysuria_rf_high_fever_chills', 'dysuria_rf_flank_pain', 'dysuria_rf_hypotension_shock', 'dysuria_rf_altered_mental'],
    dysuriaMaleSigns: ['male_none'],
    dysuriaFemaleSigns: [],
    dysuriaLmpDate: '',
    dysuriaFemalePregnancyWarning: false,
    otherSymptomsFree: 'เคยมีประวัตินิ่ว ปัสสาวะเป็นเลือดสดสะดุดกลางคัน ปวดบิดบั้นเอวซ้ายร้าวลงขาหนีบ วันนี้ไข้สูง ความดันตก 88/54 ซึมลง เหงื่อแตกตัวเย็น',
    underlying: ['นิ่วในไต (Urolithiasis)', 'โรคเกาต์'],
    drugAllergy: 'ปฏิเสธ',
    currentMeds: 'Allopurinol 100 mg',
    doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' }
  }
];

// --- Registration with Core Engine ---
registerCcModule({
  id: 'dysuria',
  recordCc: 'dysuria',
  titleTh: 'ปัสสาวะแสบขัด',
  titleEn: 'Dysuria / Painful urination',
  sectionDomId: 'dysuriaQuestionnaireSection',
  headerTh: 'แบบฟอร์มซักประวัติ: ปัสสาวะแสบขัด',
  headerEn: '(Dysuria & Genitourinary Triage)',
  patientBadgeHtml: '<i data-lucide="flame" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-amber-500"></i><span class="whitespace-nowrap">ปัสสาวะแสบขัด</span>',
  doctorCcBadgeHtml: '<i data-lucide="flame" class="w-3.5 h-3.5 mr-1 text-amber-500"></i> CC: ปัสสาวะแสบขัด',
  dateFields: ['dysuriaLmpDate'],
  timeFields: [],
  branchIds: ['dysuria_branch_male', 'dysuria_branch_female'],
  inputIdsToClear: [
    'dysuriaDurationVal',
    'dysuriaPainScore',
    'dysuriaLmpDate',
    'dysuria_other_free'
  ],
  getPmhSectionNumber: function() {
    return 7;
  },
  onTitleChange: function({ isFemale }) {
    const mCard = document.getElementById('dysuria_branch_male');
    const fCard = document.getElementById('dysuria_branch_female');
    if (isFemale) {
      if (mCard) mCard.classList.add('hidden');
      if (fCard) fCard.classList.remove('hidden');
    } else {
      if (mCard) mCard.classList.remove('hidden');
      if (fCard) fCard.classList.add('hidden');
      const lmp = document.getElementById('dysuriaLmpDate');
      if (lmp) lmp.value = '';
      const preg = document.getElementById('dysuriaFemalePregnancyWarning');
      if (preg) preg.checked = false;
      document.querySelectorAll('input[name="dysuriaFemaleSigns"]').forEach(cb => { cb.checked = false; });
    }
  },
  algorithm: {
    chiefComplaint: 'dysuria',
    titleTh: 'ปัสสาวะแสบขัด',
    schemaCode: 'dysuria',
    version: '2.0.0',
    redFlagDefinitions: [
      { key: 'dysuria_rf_urosepsis', level: 1, textTh: 'สงสัยภาวะติดเชื้อในกระแสเลือดจากทางเดินปัสสาวะ (Suspected Urosepsis / Septic Shock)' },
      { key: 'dysuria_rf_fournier_gangrene', level: 1, textTh: 'สงสัยภาวะติดเชื้อเนื้อตายของฝีเย็บและอวัยวะเพศ (Suspected Fournier’s Gangrene / Necrotizing Fasciitis)' },
      { key: 'dysuria_rf_acute_pyelonephritis', level: 2, textTh: 'สงสัยภาวะกรวยไตอักเสบเฉียบพลัน (Suspected Acute Pyelonephritis / Complicated Upper UTI)' },
      { key: 'dysuria_rf_gross_hematuria_clots', level: 2, textTh: 'ปัสสาวะเป็นเลือดสดหรือมีลิ่มเลือด (Gross Hematuria / Risk of Clot Retention)' },
      { key: 'dysuria_rf_pid_complicated', level: 2, textTh: 'สงสัยภาวะอุ้งเชิงกรานอักเสบเฉียบพลัน (Suspected Pelvic Inflammatory Disease / TOA)' },
      { key: 'dysuria_rf_male_urethritis_sti', level: 3, textTh: 'มีหนองหรือน้ำคัดหลั่งจากท่อปัสสาวะ สงสัยท่อปัสสาวะอักเสบจากโรคติดต่อทางเพศสัมพันธ์ (Urethritis / STI)' }
    ]
  },
  evaluateRedFlags: evaluateDysuriaRedFlags,
  updateOutputs: updateDysuriaOutputs,
  generateCds: generateDysuriaCds,
  seedPatients: dysuriaSeedCases,

  // --- Form HTML Template (Zero Default Bias, Patient Safety Compliant) ---
  formHtml: `
    <div id="dysuriaQuestionnaireSection" class="hidden space-y-6">

      <!-- Card 1: Onset, Duration, Timing & Pain Score -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="clock" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">1. ระยะเวลา ลักษณะการแสบขัด และระดับความปวดแสบ</h2>
            <p class="text-xs text-slate-500">Onset, Duration, Dysuria Timing & Pain Score</p>
          </div>
        </div>

        <div class="space-y-5">
          <!-- 1.1 ระยะเวลา -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              ระยะเวลาตั้งแต่เริ่มมีอาการปัสสาวะแสบขัดรอบนี้ <span class="text-rose-500">*</span>
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div class="col-span-1 sm:col-span-2">
                <input type="number" id="dysuriaDurationVal" min="1" max="1000"
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm placeholder:text-slate-400 placeholder:font-normal"
                  placeholder="เช่น 1 หรือ 3">
              </div>
              <div class="col-span-1">
                <select id="dysuriaDurationUnit"
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm">
                  <option value="minutes">นาที</option>
                  <option value="hours">ชั่วโมง</option>
                  <option value="days" selected>วัน</option>
                  <option value="weeks">สัปดาห์</option>
                  <option value="months">เดือน</option>
                  <option value="years">ปี</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 1.2 ลักษณะและช่วงเวลาที่รู้สึกแสบขัด -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              ลักษณะและช่วงเวลาที่รู้สึกแสบขัด
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer">
                <input type="radio" name="dysuriaTiming" value="timing_initial" class="text-medical-600 focus:ring-medical-500 h-4 w-4">
                <div class="ml-2.5">
                  <span class="font-semibold text-slate-800 block">แสบแปลบช่วงแรกที่เริ่มปล่อยปัสสาวะ</span>
                  <span class="text-[11px] text-slate-500">แสบในท่อปัสสาวะช่วงแรก (Initial dysuria)</span>
                </div>
              </label>
              <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer">
                <input type="radio" name="dysuriaTiming" value="timing_terminal" class="text-medical-600 focus:ring-medical-500 h-4 w-4">
                <div class="ml-2.5">
                  <span class="font-semibold text-slate-800 block">แสบขัดบีบเกร็งช่วงท้ายตอนปัสสาวะใกล้สุด</span>
                  <span class="text-[11px] text-slate-500">บีบเกร็งกระเพาะปัสสาวะตอนสุด (Terminal dysuria)</span>
                </div>
              </label>
              <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer">
                <input type="radio" name="dysuriaTiming" value="timing_throughout" class="text-medical-600 focus:ring-medical-500 h-4 w-4">
                <div class="ml-2.5">
                  <span class="font-semibold text-slate-800 block">แสบขัดตลอดเวลาตั้งแต่เริ่มจนสุด</span>
                  <span class="text-[11px] text-slate-500">แสบต่อเนื่องตลอดสาย และยังแสบค้างหลังเสร็จ</span>
                </div>
              </label>
              <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer">
                <input type="radio" name="dysuriaTiming" value="timing_external_vulvar" class="text-medical-600 focus:ring-medical-500 h-4 w-4">
                <div class="ml-2.5">
                  <span class="font-semibold text-slate-800 block">แสบเฉพาะผิวภายนอกเมื่อโดนแผล</span>
                  <span class="text-[11px] text-slate-500">แสบเมื่อน้ำปัสสาวะสัมผัสผิวหนังหรือแผลภายนอก</span>
                </div>
              </label>
            </div>
          </div>

          <!-- 1.3 Pain Score Scale (0-10) with Emoji Faces -->
          <div class="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label class="block text-xs font-semibold text-slate-800 uppercase tracking-wider">
                ระดับความเจ็บปวดในขณะนี้ (Pain Score: 0 - 10)
              </label>
              <div class="flex items-center space-x-2">
                <span id="dysuriaPainScoreBadge" class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all">
                  <span id="dysuriaPainScoreEmoji" class="text-base">⚪</span>
                  <span id="dysuriaPainScoreText">ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)</span>
                </span>
                <button type="button" id="dysuriaPainScoreClearBtn" onclick="clearDysuriaPainScore()" class="text-xs text-slate-400 hover:text-rose-600 underline hidden transition" title="ล้างค่าเพื่อให้เป็นไม่ได้ระบุ">ล้างค่า</button>
              </div>
            </div>

            <!-- Range Slider -->
            <div class="px-1 pt-1">
              <input type="range" id="dysuriaPainScore" min="0" max="10" value="0" step="1"
                oninput="handleDysuriaPainScoreChange(this.value)"
                class="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-600 focus:outline-none focus:ring-2 focus:ring-medical-500">
            </div>

            <!-- Visual Emoji Scale Guide -->
            <div class="grid grid-cols-5 text-center text-[10px] sm:text-[11px] pt-1 gap-1 text-slate-500 font-medium">
              <div class="cursor-pointer hover:text-medical-600 transition" onclick="setDysuriaPainScore(0)">
                <span class="text-lg sm:text-xl block">😊</span>
                <span>0: สบายดี</span>
              </div>
              <div class="cursor-pointer hover:text-medical-600 transition" onclick="setDysuriaPainScore(2)">
                <span class="text-lg sm:text-xl block">🙂</span>
                <span>1-3: เล็กน้อย</span>
              </div>
              <div class="cursor-pointer hover:text-medical-600 transition" onclick="setDysuriaPainScore(5)">
                <span class="text-lg sm:text-xl block">😐</span>
                <span>4-6: ปานกลาง</span>
              </div>
              <div class="cursor-pointer hover:text-medical-600 transition" onclick="setDysuriaPainScore(8)">
                <span class="text-lg sm:text-xl block">😣</span>
                <span>7-9: ปวดมาก</span>
              </div>
              <div class="cursor-pointer hover:text-medical-600 transition" onclick="setDysuriaPainScore(10)">
                <span class="text-lg sm:text-xl block">😭</span>
                <span>10: ปวดรุนแรงที่สุด</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Card 2: Voiding LUTS -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="activity" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">2. อาการผิดปกติร่วมในการขับถ่ายปัสสาวะ (LUTS)</h2>
            <p class="text-xs text-slate-500">Associated Lower Urinary Tract Symptoms</p>
          </div>
        </div>

        <div class="space-y-4">
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            อาการร่วมในการขับถ่ายปัสสาวะ (เลือกได้หลายข้อ)
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer">
              <input type="checkbox" name="dysuriaLuts" value="dysuria_freq_urgency" onchange="handleDysuriaLutsItemChange(this)" class="rounded text-medical-600 h-4 w-4">
              <span class="ml-2.5 font-medium text-slate-800">ปัสสาวะบ่อยผิดปกติ (เข้าห้องน้ำบ่อยทุก 15–30 นาที) หรือรู้สึกปวดเบ่งกลั้นแทบไม่ทัน</span>
            </label>
            <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer">
              <input type="checkbox" name="dysuriaLuts" value="dysuria_incomplete_dribble" onchange="handleDysuriaLutsItemChange(this)" class="rounded text-medical-600 h-4 w-4">
              <span class="ml-2.5 font-medium text-slate-800">รู้สึกปัสสาวะไม่สุด หยดกะปริบกะปรอย เดินออกจากห้องน้ำแล้วต้องกลับไปเข้าใหม่</span>
            </label>
            <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer">
              <input type="checkbox" name="dysuriaLuts" value="dysuria_hesitancy_weak_stream" onchange="handleDysuriaLutsItemChange(this)" class="rounded text-medical-600 h-4 w-4">
              <span class="ml-2.5 font-medium text-slate-800">ปัสสาวะรอนาน ลำปัสสาวะพุ่งช้า ลำเล็ก หรือต้องออกแรงเบ่ง</span>
            </label>
            <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer">
              <input type="checkbox" name="dysuriaLuts" value="dysuria_strangury" onchange="handleDysuriaLutsItemChange(this)" class="rounded text-medical-600 h-4 w-4">
              <span class="ml-2.5 font-medium text-slate-800">ปวดเบ่งบิดเกร็งรุนแรงขณะปัสสาวะ แสบจนแทบถ่ายไม่ออกหรือออกทีละไม่กี่หยด</span>
            </label>
            <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer">
              <input type="checkbox" name="dysuriaLuts" value="dysuria_stone_interruption" onchange="handleDysuriaLutsItemChange(this)" class="rounded text-medical-600 h-4 w-4">
              <span class="ml-2.5 font-medium text-slate-800">ลำปัสสาวะสะดุดหยุดไหลกะทันหัน</span>
            </label>
            <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer bg-slate-50 border-slate-200">
              <input type="checkbox" name="dysuriaLuts" value="dysuria_luts_none" onchange="handleDysuriaLutsNoneToggle(this)" class="rounded text-medical-600 h-4 w-4">
              <span class="ml-2.5 font-semibold text-slate-700">ไม่มีอาการผิดปกติอื่น ปัสสาวะพุ่งออกดีตามปกติ</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Card 3: Urine Characteristics -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="droplet" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">3. สีและสิ่งผิดปกติในน้ำปัสสาวะ</h2>
            <p class="text-xs text-slate-500">Urine Characteristics & Gross Hematuria</p>
          </div>
        </div>

        <div class="space-y-4">
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            สิ่งผิดปกติที่สังเกตเห็นในน้ำปัสสาวะ (เลือกได้หลายข้อ)
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer">
              <input type="checkbox" name="dysuriaUrineChars" value="urine_turbid_foul" onchange="handleDysuriaUrineItemChange(this)" class="rounded text-medical-600 h-4 w-4">
              <span class="ml-2.5 font-medium text-slate-800">น้ำปัสสาวะขุ่น มีฝ้าขาว ตะกอน หรือมีกลิ่นเหม็นรุนแรงผิดปกติ</span>
            </label>
            <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer">
              <input type="checkbox" name="dysuriaUrineChars" value="urine_gross_hematuria" onchange="handleDysuriaUrineItemChange(this)" class="rounded text-medical-600 h-4 w-4">
              <span class="ml-2.5 font-medium text-slate-800">น้ำปัสสาวะมีสีแดงสด สีน้ำล้างเนื้อ หรือมีลิ่มเลือดปน</span>
            </label>
            <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer">
              <input type="checkbox" name="dysuriaUrineChars" value="urine_gravel_sediment" onchange="handleDysuriaUrineItemChange(this)" class="rounded text-medical-600 h-4 w-4">
              <span class="ml-2.5 font-medium text-slate-800">มีเศษกรวด เม็ดทราย หรือขุยผงเล็กๆ ปนออกมากับปัสสาวะ</span>
            </label>
            <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer bg-slate-50 border-slate-200">
              <input type="checkbox" name="dysuriaUrineChars" value="urine_normal_clear" onchange="handleDysuriaUrineNoneToggle(this)" class="rounded text-medical-600 h-4 w-4">
              <span class="ml-2.5 font-semibold text-slate-700">น้ำปัสสาวะใสสีเหลืองปกติ ไม่มีเลือดหรือตะกอน</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Card 4: Systemic Symptoms & Red Flags -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="alert-triangle" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">4. อาการร่วมทางระบบร่างกายและสัญญาณเตือน</h2>
            <p class="text-xs text-slate-500">Systemic & Upper Tract Involvement</p>
          </div>
        </div>

        <div class="space-y-4">
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            อาการร่วมทางร่างกาย (เลือกได้หลายข้อ)
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer">
              <input type="checkbox" name="dysuriaSystemicSigns" value="dysuria_rf_high_fever_chills" onchange="handleDysuriaSystemicItemChange(this)" class="rounded text-medical-600 h-4 w-4">
              <span class="ml-2.5 font-medium text-slate-800">มีไข้สูง หนาวสั่นสะท้านจับไข้ หรือมีอาการตัวเย็นสั่น</span>
            </label>
            <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer">
              <input type="checkbox" name="dysuriaSystemicSigns" value="dysuria_rf_flank_pain" onchange="handleDysuriaSystemicItemChange(this)" class="rounded text-medical-600 h-4 w-4">
              <span class="ml-2.5 font-medium text-slate-800">ปวดบั้นเอวด้านหลัง หรือสะเทือนแล้วเจ็บบริเวณสีข้างข้างใดข้างหนึ่งอย่างรุนแรง</span>
            </label>
            <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer">
              <input type="checkbox" name="dysuriaSystemicSigns" value="dysuria_rf_nausea_vomiting" onchange="handleDysuriaSystemicItemChange(this)" class="rounded text-medical-600 h-4 w-4">
              <span class="ml-2.5 font-medium text-slate-800">คลื่นไส้ อาเจียนหลายครั้ง อ่อนเพลียจนรับประทานอาหารหรือดื่มน้ำไม่ได้</span>
            </label>
            <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer">
              <input type="checkbox" name="dysuriaSystemicSigns" value="dysuria_rf_perineal_scrotal_severe_pain" onchange="handleDysuriaSystemicItemChange(this)" class="rounded text-medical-600 h-4 w-4">
              <span class="ml-2.5 font-medium text-slate-800">ปวด บวม แดง ร้อน รุนแรงบริเวณถุงอัณฑะ ฝีเย็บ หว่างขา หรือผิวหนังมีรอยคล้ำ/ตุ่มพอง</span>
            </label>
            <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer">
              <input type="checkbox" name="dysuriaSystemicSigns" value="dysuria_rf_hypotension_shock" onchange="handleDysuriaSystemicItemChange(this)" class="rounded text-medical-600 h-4 w-4">
              <span class="ml-2.5 font-medium text-slate-800">หน้ามืด วูบหมดสติ วิงเวียนรุนแรง เหงื่อแตกตัวเย็นซีด</span>
            </label>
            <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer">
              <input type="checkbox" name="dysuriaSystemicSigns" value="dysuria_rf_altered_mental" onchange="handleDysuriaSystemicItemChange(this)" class="rounded text-medical-600 h-4 w-4">
              <span class="ml-2.5 font-medium text-slate-800">มีอาการซึมลง สับสน เอะอะโวยวาย หรือพูดจาไม่รู้เรื่อง</span>
            </label>
            <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer sm:col-span-2 bg-slate-50 border-slate-200">
              <input type="checkbox" name="dysuriaSystemicSigns" value="dysuria_rf_systemic_none" onchange="handleDysuriaSystemicNoneToggle(this)" class="rounded text-medical-600 h-4 w-4">
              <span class="ml-2.5 font-semibold text-slate-700">ไม่มีไข้ ไม่หนาวสั่น ไม่ปวดหลัง ไม่มีอาการรุนแรงทางร่างกาย</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Card 5 (Male): Male Genitourinary & STI History -->
      <div id="dysuria_branch_male" class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hidden">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="user" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">5. ข้อมูลเฉพาะเพศชายและทางเดินสืบพันธุ์</h2>
            <p class="text-xs text-slate-500">Male Genitourinary & STI Screening</p>
          </div>
        </div>

        <div class="space-y-4">
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            อาการหรือประวัติเฉพาะเพศชาย (เลือกได้หลายข้อ)
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer">
              <input type="checkbox" name="dysuriaMaleSigns" value="male_urethral_discharge" onchange="handleDysuriaMaleItemChange(this)" class="rounded text-medical-600 h-4 w-4">
              <span class="ml-2.5 font-medium text-slate-800">มีหนองข้นสีเหลืองหรือเขียว หรือมีมูกใส/ขุ่น ไหลซึมออกจากปลายท่อปัสสาวะ</span>
            </label>
            <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer">
              <input type="checkbox" name="dysuriaMaleSigns" value="male_testicular_pain_swelling" onchange="handleDysuriaMaleItemChange(this)" class="rounded text-medical-600 h-4 w-4">
              <span class="ml-2.5 font-medium text-slate-800">ปวดบวมเจ็บที่ลูกอัณฑะข้างใดข้างหนึ่ง หรือเจ็บลึกบริเวณระหว่างถุงอัณฑะกับรูทวาร (ฝีเย็บ)</span>
            </label>
            <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer">
              <input type="checkbox" name="dysuriaMaleSigns" value="male_sti_risk" onchange="handleDysuriaMaleItemChange(this)" class="rounded text-medical-600 h-4 w-4">
              <span class="ml-2.5 font-medium text-slate-800">มีประวัติเพศสัมพันธ์โดยไม่ได้ใช้ถุงยางอนามัย หรือมีคู่นอนใหม่ในช่วง 1–4 สัปดาห์</span>
            </label>
            <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer bg-slate-50 border-slate-200">
              <input type="checkbox" name="dysuriaMaleSigns" value="male_none" onchange="handleDysuriaMaleNoneToggle(this)" class="rounded text-medical-600 h-4 w-4">
              <span class="ml-2.5 font-semibold text-slate-700">ไม่มีอาการหรือประวัติดังกล่าว</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Card 5 (Female): Female Gynecologic & LMP History -->
      <div id="dysuria_branch_female" class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hidden">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-pink-100 text-pink-700 p-2 rounded-xl">
            <i data-lucide="user" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">5. ข้อมูลเฉพาะสตรีและทางเดินสืบพันธุ์</h2>
            <p class="text-xs text-slate-500">Female Gynecologic, LMP & Infection History</p>
          </div>
        </div>

        <div class="space-y-4 text-xs">
          <!-- LMP & Pregnancy -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                วันแรกของประจำเดือนรอบล่าสุด (LMP)
              </label>
              <input type="text" id="dysuriaLmpDate" placeholder="วว/ดด/ปปปป" data-universal-date="true"
                class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm placeholder:text-slate-400">
              <p class="text-[11px] text-slate-400 mt-1">ระบุเป็นวันที่สากล เช่น 25/10/2026</p>
            </div>
            <div class="flex items-end">
              <label class="selectable-card w-full p-3 rounded-xl flex items-center cursor-pointer">
                <input type="checkbox" id="dysuriaFemalePregnancyWarning" class="rounded text-medical-600 h-4 w-4">
                <span class="ml-2.5 font-medium text-slate-800">ขาดประจำเดือน หรือสงสัยว่ากำลังตั้งครรภ์</span>
              </label>
            </div>
          </div>

          <!-- Gyn Symptoms -->
          <div>
            <label class="block font-semibold text-slate-700 uppercase tracking-wider mb-2">อาการทางนรีเวชร่วม (เลือกได้หลายข้อ):</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer">
                <input type="checkbox" name="dysuriaFemaleSigns" value="female_vaginal_discharge" onchange="handleDysuriaFemaleItemChange(this)" class="rounded text-medical-600 h-4 w-4">
                <span class="ml-2.5 font-medium text-slate-800">มีตกขาวผิดปกติ ปริมาณมาก สีเหลือง/เขียว/เป็นก้อน หรือมีกลิ่นเหม็นคาว</span>
              </label>
              <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer">
                <input type="checkbox" name="dysuriaFemaleSigns" value="female_lower_abd_pelvic_pain" onchange="handleDysuriaFemaleItemChange(this)" class="rounded text-medical-600 h-4 w-4">
                <span class="ml-2.5 font-medium text-slate-800">ปวดหน่วงท้องน้อย ปวดลึกในอุ้งเชิงกราน หรือเจ็บขณะมีเพศสัมพันธ์</span>
              </label>
              <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer">
                <input type="checkbox" name="dysuriaFemaleSigns" value="female_vulvar_ulcer_itching" onchange="handleDysuriaFemaleItemChange(this)" class="rounded text-medical-600 h-4 w-4">
                <span class="ml-2.5 font-medium text-slate-800">มีแผลพุพอง ตุ่มน้ำใส หรือมีอาการคันแสบมากบริเวณอวัยวะเพศภายนอก</span>
              </label>
              <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer bg-slate-50 border-slate-200">
                <input type="checkbox" name="dysuriaFemaleSigns" value="female_none" onchange="handleDysuriaFemaleNoneToggle(this)" class="rounded text-medical-600 h-4 w-4">
                <span class="ml-2.5 font-semibold text-slate-700">ไม่มีอาการทางสูตินรีเวชข้างต้น</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 6: Other Remarks (Free Text) -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100">
          <div class="bg-slate-100 text-slate-600 p-2 rounded-xl">
            <i data-lucide="message-square-plus" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-800">6. อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2>
            <p class="text-xs text-slate-500">ระบุข้อสังเกต หรืออาการอื่นๆ ที่ต้องการแจ้งพยาบาลและแพทย์เพิ่มเติม (ถ้ามี)</p>
          </div>
        </div>
        <textarea id="dysuria_other_free" rows="2" placeholder="ระบุข้อสังเกต หรืออาการอื่นๆ ที่ต้องการแจ้งพยาบาลและแพทย์เพิ่มเติม (ถ้ามี)..."
          class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"></textarea>
      </div>

    </div>
  `,

  // --- Collect Intake Hook ---
  collectIntake: function(ctx) {
    const _rawDur = parseFloat(document.getElementById('dysuriaDurationVal')?.value); const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
    const durationUnit = document.getElementById('dysuriaDurationUnit')?.value || 'days';
    const dysuriaTiming = document.querySelector('input[name="dysuriaTiming"]:checked')?.value || '';

    let painScore = null;
    if (dysuriaPainScoreTouched) {
      const pSlider = document.getElementById('dysuriaPainScore');
      if (pSlider) painScore = parseInt(pSlider.value, 10);
    }

    const dysuriaLuts = Array.from(document.querySelectorAll('input[name="dysuriaLuts"]:checked')).map(el => el.value);
    const dysuriaUrineChars = Array.from(document.querySelectorAll('input[name="dysuriaUrineChars"]:checked')).map(el => el.value);
    const dysuriaSystemicSigns = Array.from(document.querySelectorAll('input[name="dysuriaSystemicSigns"]:checked')).map(el => el.value);
    const dysuriaMaleSigns = Array.from(document.querySelectorAll('input[name="dysuriaMaleSigns"]:checked')).map(el => el.value);
    const dysuriaFemaleSigns = Array.from(document.querySelectorAll('input[name="dysuriaFemaleSigns"]:checked')).map(el => el.value);

    const dysuriaLmpDate = document.getElementById('dysuriaLmpDate')?.value?.trim() || '';
    const dysuriaFemalePregnancyWarning = Boolean(document.getElementById('dysuriaFemalePregnancyWarning')?.checked);
    const otherSymptomsFree = document.getElementById('dysuria_other_free')?.value?.trim() || ctx.otherSymptomsFree || '';

    return {
      id: ctx.recordId,
      queue_number: ctx.queueNumber,
      hn: ctx.randomHn,
      name: ctx.patientName,
      age: ctx.patientAge,
      gender: ctx.gender,
      chief_complaint: 'dysuria',
      chief_complaint_title: 'ปัสสาวะแสบขัด',
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

      painScore,
      dysuriaTiming,
      dysuriaLuts,
      dysuriaUrineChars,
      dysuriaSystemicSigns,
      dysuriaMaleSigns,
      dysuriaFemaleSigns,
      dysuriaLmpDate,
      dysuriaFemalePregnancyWarning
    };
  },

  // --- Populate / Hydrate Form Hook ---
  populateForm: function(patient) {
    if (!patient) return;

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val !== undefined && val !== null ? val : '';
    };

    const setRadio = (name, val) => {
      if (!val) return;
      const el = document.querySelector(`input[name="${name}"][value="${val}"]`);
      if (el) el.checked = true;
    };

    const setChkGroup = (name, arr) => {
      if (!Array.isArray(arr)) return;
      document.querySelectorAll(`input[name="${name}"]`).forEach(cb => {
        cb.checked = arr.includes(cb.value);
      });
    };

    setVal('dysuriaDurationVal', patient.durationVal || '');
    setVal('dysuriaDurationUnit', patient.durationUnit || 'days');

    setRadio('dysuriaTiming', patient.dysuriaTiming);

    if (patient.painScore !== null && patient.painScore !== undefined) {
      setDysuriaPainScore(patient.painScore);
    } else {
      clearDysuriaPainScore();
    }

    setChkGroup('dysuriaLuts', patient.dysuriaLuts);
    setChkGroup('dysuriaUrineChars', patient.dysuriaUrineChars);
    setChkGroup('dysuriaSystemicSigns', patient.dysuriaSystemicSigns);

    const mCard = document.getElementById('dysuria_branch_male');
    const fCard = document.getElementById('dysuria_branch_female');

    if (patient.gender === 'ชาย' || patient.gender === 'Male') {
      if (mCard) mCard.classList.remove('hidden');
      if (fCard) fCard.classList.add('hidden');
      setChkGroup('dysuriaMaleSigns', patient.dysuriaMaleSigns);
    } else if (patient.gender === 'หญิง' || patient.gender === 'Female') {
      if (mCard) mCard.classList.add('hidden');
      if (fCard) fCard.classList.remove('hidden');
      setVal('dysuriaLmpDate', patient.dysuriaLmpDate || '');
      const pregEl = document.getElementById('dysuriaFemalePregnancyWarning');
      if (pregEl) pregEl.checked = Boolean(patient.dysuriaFemalePregnancyWarning);
      setChkGroup('dysuriaFemaleSigns', patient.dysuriaFemaleSigns);
    }

    setVal('dysuria_other_free', patient.otherSymptomsFree || '');
  },

  hydrateForm: function(patient) {
    this.populateForm(patient);
  },

  isRedFlag: function(patient) {
    return evaluateDysuriaRedFlags(patient).length > 0;
  }
});
