// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 17_urinary_retention.js
// อาการนำ: ปัสสาวะไม่ออก / เล็ดราด / กะปริดกะปรอย (Urinary Retention / Overflow Incontinence / Inability to Void)
// ไฟล์นี้แยกอิสระสำหรับอาการนำ urinary_retention เพื่อให้ทีมแพทย์และ IT โรงพยาบาลนำไปพัฒนาต่อได้โดยไม่กระทบระบบหลัก
// =========================================================================

// --- Pain Score Slider State & Handlers ---
let urinaryPainScoreTouched = false;

function clearUrinaryPainScore() {
  urinaryPainScoreTouched = false;
  const slider = document.getElementById('urinaryPainScore');
  if (slider) slider.value = 0;
  const emojiEl = document.getElementById('urinaryPainScoreEmoji');
  const textEl = document.getElementById('urinaryPainScoreText');
  const badgeEl = document.getElementById('urinaryPainScoreBadge');
  const clearBtn = document.getElementById('urinaryPainScoreClearBtn');
  if (emojiEl) emojiEl.textContent = '⚪';
  if (textEl) textEl.textContent = 'ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)';
  if (badgeEl) badgeEl.className = 'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all';
  if (clearBtn) clearBtn.classList.add('hidden');
}

function handleUrinaryPainScoreChange(val) {
  urinaryPainScoreTouched = true;
  const num = parseInt(val, 10);
  const emojiEl = document.getElementById('urinaryPainScoreEmoji');
  const textEl = document.getElementById('urinaryPainScoreText');
  const badgeEl = document.getElementById('urinaryPainScoreBadge');
  const clearBtn = document.getElementById('urinaryPainScoreClearBtn');
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

function setUrinaryPainScore(score) {
  urinaryPainScoreTouched = true;
  const slider = document.getElementById('urinaryPainScore');
  if (slider) {
    slider.value = score;
    handleUrinaryPainScoreChange(score);
  }
}

// --- UI Toggle Handlers ---
function handleUrinaryNeuroNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="urinaryNeuroSigns"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleUrinaryNeuroItemChange(el) {
  if (el && el.checked) {
    const noneCb = document.querySelector('input[name="urinaryNeuroSigns"][value="urinary_rf_neuro_none"]');
    if (noneCb) noneCb.checked = false;
  }
}

function handleUrinarySystemicNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="urinarySystemicSigns"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleUrinarySystemicItemChange(el) {
  if (el && el.checked) {
    const noneCb = document.querySelector('input[name="urinarySystemicSigns"][value="urinary_rf_systemic_none"]');
    if (noneCb) noneCb.checked = false;
  }
}

function handleUrinaryMedsNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="urinaryMeds"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleUrinaryMedsItemChange(el) {
  if (el && el.checked) {
    const noneCb = document.querySelector('input[name="urinaryMeds"][value="med_none"]');
    if (noneCb) noneCb.checked = false;
  }
}

function handleUrinaryTraumaNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="urinaryTrauma"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleUrinaryTraumaItemChange(el) {
  if (el && el.checked) {
    const noneCb = document.querySelector('input[name="urinaryTrauma"][value="trauma_none"]');
    if (noneCb) noneCb.checked = false;
  }
}

function handleUrinaryPmhUrologyNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="urinaryPmhUrology"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
    const wrap = document.getElementById('urinaryPmhOtherWrap');
    if (wrap) {
      wrap.classList.add('hidden');
      const inp = document.getElementById('urinaryPmhOtherText');
      if (inp) inp.value = '';
    }
  }
}

function handleUrinaryPmhOtherToggle(el) {
  const wrap = document.getElementById('urinaryPmhOtherWrap');
  if (wrap) {
    if (el && el.checked) {
      wrap.classList.remove('hidden');
      const noneCb = document.querySelector('input[name="urinaryPmhUrology"][value="pmh_urology_none"]');
      if (noneCb) noneCb.checked = false;
    } else {
      wrap.classList.add('hidden');
      const inp = document.getElementById('urinaryPmhOtherText');
      if (inp) inp.value = '';
    }
  }
}

function handleUrinaryPmhItemChange(el) {
  if (el && el.checked) {
    const noneCb = document.querySelector('input[name="urinaryPmhUrology"][value="pmh_urology_none"]');
    if (noneCb) noneCb.checked = false;
  }
}

function handleUrinaryGynNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="urinaryGynConditions"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleUrinaryGynItemChange(el) {
  if (el && el.checked) {
    const noneCb = document.querySelector('input[name="urinaryGynConditions"][value="gyn_none"]');
    if (noneCb) noneCb.checked = false;
  }
}

// --- Red Flag Evaluator ---
function evaluateUrinaryRetentionRedFlags(patient) {
  const flags = [];
  if (!patient) return flags;

  const neuroSigns = Array.isArray(patient.urinaryNeuroSigns) ? patient.urinaryNeuroSigns : [];
  const systemicSigns = Array.isArray(patient.urinarySystemicSigns) ? patient.urinarySystemicSigns : [];
  const traumaSigns = Array.isArray(patient.urinaryTrauma) ? patient.urinaryTrauma : [];
  const urineChars = Array.isArray(patient.urinaryUrineCharacteristics) ? patient.urinaryUrineCharacteristics : [];

  // 1. Cauda Equina Syndrome / Acute Spinal Cord Compression
  if (neuroSigns.includes('urinary_rf_saddle_anesthesia') ||
      (neuroSigns.includes('urinary_rf_leg_weakness') && neuroSigns.includes('urinary_rf_severe_back_pain')) ||
      neuroSigns.includes('urinary_rf_fecal_incontinence')) {
    flags.push({
      key: 'urinary_rf_cauda_equina',
      level: 1,
      textTh: 'สงสัยภาวะรากประสาทหางม้าถูกกดทับเฉียบพลัน (Suspected Cauda Equina Syndrome)',
      risk: 'เสี่ยงต่ออัมพาตท่อนล่างและการสูญเสียการควบคุมระบบขับถ่ายถาวร (Neurosurgical Emergency)',
      suggestedAction: 'Triage Level 1-2: สวนระบายปัสสาวะอย่างนุ่มนวล, Stat Urgent MRI Lumbosacral spine, ปรึกษาประสาทศัลยแพทย์ (Neurosurgeon) หรือศัลยแพทย์กระดูกสันหลังเพื่อพิจารณาผ่าตัด Decompressive Laminectomy ด่วนภายใน 24 ชม.'
    });
  }

  // 2. Suspected Urethral Disruption / Straddle Injury (Absolute CI to Blind Urethral Foley)
  if (traumaSigns.includes('trauma_meatal_bleeding') ||
      (traumaSigns.includes('trauma_straddle_pelvis') && urineChars.includes('urine_gross_hematuria'))) {
    flags.push({
      key: 'urinary_rf_urethral_trauma_ci',
      level: 1,
      textTh: 'สงสัยการบาดเจ็บหรือฉีกขาดของท่อปัสสาวะ (Suspected Urethral Disruption / Trauma)',
      risk: '🛑 ห้ามใส่สายสวนปัสสาวะทางท่อปัสสาวะเด็ดขาด (Absolute CI to Blind Urethral Catheterization) เพราะอาจทำให้ท่อปัสสาวะฉีกขาดทะลุสมบูรณ์',
      suggestedAction: 'Triage Level 1-2: ห้ามพยายามใส่สาย Foley ทางท่อปัสสาวะ, ปรึกษาศัลยแพทย์ระบบทางเดินปัสสาวะ (Urologist), พิจารณาทำ Retrograde Urethrography (RUG) หรือเจาะระบายหน้าท้อง (Suprapubic Cystostomy)'
    });
  }

  // 3. Obstructive Urosepsis / Sepsis Alert
  if (systemicSigns.includes('urinary_rf_high_fever_chills') ||
      systemicSigns.includes('urinary_rf_shock_syncope') ||
      (systemicSigns.includes('urinary_rf_flank_pain') && systemicSigns.includes('urinary_rf_altered_mental'))) {
    flags.push({
      key: 'urinary_rf_obstructive_urosepsis',
      level: 1,
      textTh: 'ภาวะติดเชื้อในกระแสเลือดจากการอุดกั้นทางเดินปัสสาวะ (Obstructive Urosepsis / Septic Shock)',
      risk: 'เสี่ยงต่อภาวะช็อก ความดันตก อวัยวะล้มเหลวหลายระบบ และเสียชีวิต',
      suggestedAction: 'Triage Level 1: ย้ายเข้าห้องฉุกเฉินกู้ชีพ, เปิด IV 2 เส้น, เจาะ Hemoculture x 2, ให้ Broad-spectrum IV Antibiotics ทันที, ระบายปัสสาวะที่อุดกั้นด่วนที่สุด (Urgent Decompression)'
    });
  }

  // 4. True Anuria / Severe Acute Kidney Injury (AKI) / Pulmonary Edema
  if (patient.urinarySensation === 'painless_anuria' ||
      systemicSigns.includes('urinary_rf_dyspnea_edema')) {
    flags.push({
      key: 'urinary_rf_uremic_anuria',
      level: 2,
      textTh: 'ภาวะไม่มีปัสสาวะ หรือไตวายเฉียบพลันร่วมกับน้ำเกิน (Anuria / Severe AKI / Pulmonary Edema)',
      risk: 'เสี่ยงต่อภาวะโพแทสเซียมในเลือดสูงวิกฤต (Severe Hyperkalemia), ภาวะเลือดเป็นกรดรุนแรง และปอดบวมน้ำ',
      suggestedAction: 'Triage Level 2: ตรวจคลื่นไฟฟ้าหัวใจ (12-lead EKG) ทันทีเพื่อดู Hyperkalemic changes, Stat BUN, Cr, Electrolytes, เจาะก๊าซในเลือด (ABG/VBG), เตรียมยาขับโพแทสเซียมและพิจารณาฟอกไตฉุกเฉิน'
    });
  }

  // 5. Blocked Indwelling Catheter with Acute Retention
  if (patient.urinaryCatheterStatus === 'catheter_indwelling_blocked') {
    flags.push({
      key: 'urinary_rf_blocked_catheter',
      level: 3,
      textTh: 'สายสวนปัสสาวะอุดตันเฉียบพลัน (Obstructed Indwelling Foley Catheter)',
      risk: 'เสี่ยงต่อกระเพาะปัสสาวะอักเสบแตก การติดเชื้อย้อนกลับ และความดันโลหิตพุ่งสูงจากความปวด (Autonomic Dysreflexia)',
      suggestedAction: 'Triage Level 3: ตรวจสายสวนว่าพับหักงอหรือไม่, ล้างสายสวนด้วย NSS ปลอดเชื้อ (Irrigation) หรือเปลี่ยนใส่สายสวนใหม่ทันทีด้วยเทคนิคปราศจากเชื้อ'
    });
  }

  return flags;
}

// --- Outputs & Translation ---
function updateUrinaryRetentionOutputs(patient) {
  if (!patient) return;

  const durationText = patient.durationVal ? `${patient.durationVal} ${patient.durationUnit === 'minutes' ? 'นาที' : patient.durationUnit === 'hours' ? 'ชั่วโมง' : patient.durationUnit === 'days' ? 'วัน' : patient.durationUnit === 'weeks' ? 'สัปดาห์' : patient.durationUnit === 'months' ? 'เดือน' : 'ปี'}` : 'ไม่ระบุ';

  const sensationMap = {
    acute_painful_retention: 'ปวดแน่นท้องน้อยรุนแรง ปวดเบ่งมากแต่ไม่ออกเลยแม้แต่หยดเดียว',
    overflow_dribbling: 'ปวดตึงแน่นท้องน้อย มีน้ำปัสสาวะไหลเล็ดซึมหรือหยดออกทีละน้อย แต่เบ่งไม่ออกและไม่โล่งท้อง',
    painless_anuria: 'ไม่มีความรู้สึกปวดปัสสาวะเลย และไม่มีปัสสาวะออกมาเลย (ท้องน้อยแฟบปกติ)'
  };

  const lutsMap = {
    luts_hesitancy: 'ปัสสาวะรอนาน ลำปัสสาวะพุ่งช้า ลำเล็ก ต้องเบ่งมาก',
    luts_intermittency: 'ปัสสาวะสะดุด ไหลๆ หยุดๆ ขาดตอน',
    luts_nocturia: 'ตื่นปัสสาวะตอนกลางคืนบ่อยผิดปกติ (>2-3 ครั้ง/คืน)',
    luts_stone_history: 'เคยมีประวัตินิ่ว ปัสสาวะมีเศษกรวดทราย หรือปัสสาวะสะดุดเฉียบพลัน',
    luts_none_acute: 'ปฏิเสธประวัติปัสสาวะผิดปกติเดิม เพิ่งมีอาการเฉียบพลัน'
  };

  const urineCharMap = {
    urine_gross_hematuria: 'ปัสสาวะมีเลือดสด ลิ่มเลือด หรือสีน้ำล้างเนื้อปน',
    urine_turbid_foul: 'ปัสสาวะขุ่น มีตะกอนขาว หรือกลิ่นเหม็นรุนแรง',
    urine_urethral_discharge: 'มีมูก หนอง หรือน้ำคัดหลั่งผิดปกติออกจากท่อปัสสาวะ',
    urine_none_normal: 'ปัสสาวะใสสีเหลืองปกติ ไม่มีเลือดหรือหนองปน'
  };

  const neuroMap = {
    urinary_rf_saddle_anesthesia: 'มีอาการชาบริเวณก้น แก้มก้น รอบรูทวารหนัก หรือหว่างขา (Saddle anesthesia)',
    urinary_rf_leg_weakness: 'ขาทั้งสองข้างอ่อนแรง เดินลำบาก ก้าวขาไม่ออก',
    urinary_rf_fecal_incontinence: 'กลั้นอุจจาระไม่ได้ มีอุจจาระเล็ดราดโดยไม่รู้สึกตัว',
    urinary_rf_severe_back_pain: 'มีอาการปวดหลังช่วงเอวรุนแรง ร้าวแปลบลงขาทั้งสองข้าง',
    urinary_rf_neuro_none: 'ปฏิเสธอาการชาบริเวณก้น ขาไม่อ่อนแรง กลั้นอุจจาระได้ปกติ'
  };

  const systemicMap = {
    urinary_rf_high_fever_chills: 'มีไข้สูง หนาวสั่นสะท้านจับไข้ หรือตัวเย็นสั่น',
    urinary_rf_flank_pain: 'ปวดบั้นเอวหรือสะเทือนแล้วเจ็บบริเวณสีข้างรุนแรง',
    urinary_rf_altered_mental: 'มีอาการซึมลง สับสน เอะอะโวยวาย หรือไม่ค่อยรู้ตัว',
    urinary_rf_shock_syncope: 'หน้ามืด วูบหมดสติ วิงเวียนรุนแรง เหงื่อแตกตัวเย็นซีด',
    urinary_rf_dyspnea_edema: 'หายใจหอบเหนื่อยลึก แน่นหน้าอกนอนราบไม่ได้ หรือบวมทั่วตัว',
    urinary_rf_systemic_none: 'ปฏิเสธไข้หนาวสั่น ไม่อ่อนเพลียรุนแรง'
  };

  const medsMap = {
    med_cold_decongestant: 'ยาแก้หวัด/ลดน้ำมูก/แก้แพ้ (Antihistamines / Decongestants เช่น CPM, Pseudoephedrine)',
    med_psychiatric_tca: 'ยานอนหลับ/ยาคลายกังวล/ยาต้านซึมเศร้า (TCA / Psychotropics เช่น Amitriptyline)',
    med_opioids: 'ยาแก้ปวดกลุ่มมอร์ฟีน ทรามาดอล (Tramadol / Opioids)',
    med_alcohol_binge: 'ดื่มแอลกอฮอล์ปริมาณมากก่อนเริ่มมีอาการ',
    med_anesthesia_recent: 'เพิ่งได้รับการผ่าตัด ดมยาสลบ หรือฉีดยาชาบล็อกหลัง (ภายใน 24-48 ชม.)',
    med_none: 'ปฏิเสธการใช้ยาหรือสารกระตุ้นข้างต้น'
  };

  const traumaMap = {
    trauma_straddle_pelvis: 'อุบัติเหตุกระแทกเชิงกราน หว่างขา หรือตกคร่อมของแข็ง (Straddle injury)',
    trauma_meatal_bleeding: 'มีเลือดสดซึมออกมาจากรูเปิดท่อปัสสาวะ (Blood at urethral meatus)',
    trauma_none: 'ปฏิเสธประวัติอุบัติเหตุหรือบาดเจ็บ'
  };

  const catheterMap = {
    catheter_none: 'ไม่ได้คาสายสวนปัสสาวะ',
    catheter_indwelling_blocked: 'คาสายสวนปัสสาวะเดิมอยู่ (Foley catheter) แต่น้ำปัสสาวะไม่ไหลลงถุง ปวดแน่นท้องน้อย',
    catheter_intermittent_cic: 'สวนปัสสาวะทิ้งเป็นระยะด้วยตนเอง (Clean Intermittent Catheterization)'
  };

  const pmhUrologyMap = {
    pmh_bph_prostate: 'โรคต่อมลูกหมากโต (BPH) หรือมะเร็งต่อมลูกหมาก',
    pmh_urethral_stricture: 'ท่อปัสสาวะตีบ หรือเคยขยายท่อปัสสาวะ',
    pmh_urinary_stone: 'โรคนิ่วในระบบทางเดินปัสสาวะ',
    pmh_neurogenic_bladder: 'กระเพาะปัสสาวะจากระบบประสาท (Neurogenic bladder จากเบาหวาน/สโตรก/กระดูกสันหลัง)',
    pmh_urology_other: `โรคทางเดินปัสสาวะเดิมอื่นๆ: ${patient.urinaryPmhOtherText || 'ระบุเพิ่มเติม'}`,
    pmh_urology_none: 'ปฏิเสธประวัติโรคระบบทางเดินปัสสาวะเดิม'
  };

  const neuroSigns = Array.isArray(patient.urinaryNeuroSigns) ? patient.urinaryNeuroSigns : [];
  const systemicSigns = Array.isArray(patient.urinarySystemicSigns) ? patient.urinarySystemicSigns : [];
  const meds = Array.isArray(patient.urinaryMeds) ? patient.urinaryMeds : [];
  const trauma = Array.isArray(patient.urinaryTrauma) ? patient.urinaryTrauma : [];
  const pmhUrology = Array.isArray(patient.urinaryPmhUrology) ? patient.urinaryPmhUrology : [];
  const luts = Array.isArray(patient.urinaryLuts) ? patient.urinaryLuts : [];
  const urineChars = Array.isArray(patient.urinaryUrineCharacteristics) ? patient.urinaryUrineCharacteristics : [];
  const gynConditions = Array.isArray(patient.urinaryGynConditions) ? patient.urinaryGynConditions : [];

  // Build Pertinent Positives and Negatives (No category header prefixes, no PMH/med duplication)
  const positives = [];
  const negatives = [];

  // 1. Preceding LUTS
  luts.forEach(key => {
    if (key !== 'luts_none_acute' && lutsMap[key]) positives.push(lutsMap[key]);
  });
  if (luts.includes('luts_none_acute')) negatives.push('ไม่มีอาการปัสสาวะลำบากนำมาก่อนหน้า (เฉียบพลัน)');

  // 2. Urine Characteristics
  urineChars.forEach(key => {
    if (key !== 'urine_none_normal' && urineCharMap[key]) positives.push(urineCharMap[key]);
  });
  if (urineChars.includes('urine_none_normal')) negatives.push('ปัสสาวะใสปกติ ไม่มีเลือดหรือหนอง');

  // 3. Neuro signs (Cauda Equina)
  neuroSigns.forEach(key => {
    if (key !== 'urinary_rf_neuro_none' && neuroMap[key]) positives.push(`${neuroMap[key]} 🚩`);
  });
  if (neuroSigns.length === 0 || neuroSigns.includes('urinary_rf_neuro_none')) negatives.push('ปฏิเสธชาบริเวณก้น แขนขาไม่อ่อนแรง กลั้นอุจจาระได้ปกติ');

  // 4. Systemic & Sepsis
  systemicSigns.forEach(key => {
    if (key !== 'urinary_rf_systemic_none' && systemicMap[key]) positives.push(`${systemicMap[key]} 🚩`);
  });
  if (systemicSigns.length === 0 || systemicSigns.includes('urinary_rf_systemic_none')) negatives.push('ปฏิเสธไข้หนาวสั่น ไม่ปวดบั้นเอว');

  // 5. Trauma
  trauma.forEach(key => {
    if (key !== 'trauma_none' && traumaMap[key]) positives.push(`${traumaMap[key]} 🛑`);
  });
  if (trauma.includes('trauma_none')) negatives.push('ปฏิเสธอุบัติเหตุกระแทกเชิงกราน/หว่างขา');

  // 6. Catheter Status
  if (patient.urinaryCatheterStatus && patient.urinaryCatheterStatus !== 'catheter_none') {
    positives.push(catheterMap[patient.urinaryCatheterStatus] || patient.urinaryCatheterStatus);
  } else {
    negatives.push('ไม่ได้คาสายสวนปัสสาวะเดิม');
  }

  // 7. Female History
  if (patient.gender === 'หญิง' || patient.gender === 'Female') {
    if (patient.urinaryLmpDate) positives.push(`ประจำเดือนครั้งสุดท้าย (LMP): ${patient.urinaryLmpDate}`);
    if (patient.urinaryFemalePregnancyWarning) positives.push('สงสัยภาวะตั้งครรภ์/ขาดประจำเดือน 🚩');
    gynConditions.forEach(key => {
      if (key === 'gyn_pelvic_organ_prolapse') positives.push('มดลูกหย่อน/ก้อนยื่นช่องคลอด');
      if (key === 'gyn_genital_herpes') positives.push('แผลเริมที่อวัยวะเพศภายนอก');
    });
  }

  // 8. Other Free Text
  if (patient.otherSymptomsFree) {
    positives.push(patient.otherSymptomsFree);
  }

  // CRITICAL: Assign pertinent positives & negatives to patient object for patient status view rendering
  patient.pertinentPositives = positives.length > 0 ? positives : ['ไม่มีอาการร่วมผิดปกติ'];
  patient.pertinentNegatives = negatives;

  const redFlags = evaluateUrinaryRetentionRedFlags(patient);
  patient.redFlags = redFlags;

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
ปัสสาวะไม่ออก / เล็ดราด / กะปริดกะปรอย มา ${durationText}

[History of Present Illness (HPI)]
• ลักษณะอาการ: ${sensationMap[patient.urinarySensation] || 'ไม่ระบุ'}${patient.painScore !== null && patient.painScore !== undefined ? ` (Pain Score: ${patient.painScore}/10)` : ''}

• Pertinent Positives:
${positives.length > 0 ? positives.map(p => `  - ${p}`).join('\n') : '  - ไม่มีอาการร่วมอื่นที่เด่นชัด'}

• Pertinent Negatives:
${negatives.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• โรคระบบทางเดินปัสสาวะเดิม: ${pmhUrology.length > 0 && !pmhUrology.includes('pmh_urology_none') ? pmhUrology.map(k => pmhUrologyMap[k]).filter(Boolean).join(', ') : 'ปฏิเสธ'}
• ยา/สารกระตุ้นก่อนเกิดอาการ: ${meds.length > 0 && !meds.includes('med_none') ? meds.map(k => medsMap[k]).filter(Boolean).join(', ') : 'ปฏิเสธ'}
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
  let narrative = `ผู้ป่วย [${patient.name || '-'}] อายุ ${patient.age || '-'} ปี เพศ ${patient.gender || 'ไม่ระบุ'} มารับการตรวจที่ห้องฉุกเฉิน รพ.ราชบุรี ด้วยอาการปัสสาวะไม่ออก / เล็ดราด / กะปริดกะปรอย เป็นมา ${durationText} ก่อนมาโรงพยาบาล `;
  narrative += `โดยให้ประวัติลักษณะการขับถ่ายว่า [${sensationMap[patient.urinarySensation] || 'ปัสสาวะไม่ออก'}] `;
  if (patient.painScore !== null && patient.painScore !== undefined) {
    narrative += `ประเมินระดับความปวดแน่นบริเวณท้องน้อยได้ ${patient.painScore}/10 คะแนน `;
  }

  if (luts.length > 0 && !luts.includes('luts_none_acute')) {
    narrative += `ประวัติการขับถ่ายเดิมก่อนหน้านี้พบว่ามีอาการ: ${luts.map(k => lutsMap[k]).filter(Boolean).join(', ')} `;
  } else {
    narrative += `ก่อนหน้านี้ขับถ่ายปัสสาวะได้เป็นปกติมาโดยตลอด ไม่มีอาการปัสสาวะลำบากนำมาก่อน `;
  }

  if (urineChars.length > 0 && !urineChars.includes('urine_none_normal')) {
    narrative += `สังเกตเห็นสิ่งผิดปกติในน้ำปัสสาวะ ได้แก่: ${urineChars.map(k => urineCharMap[k]).filter(Boolean).join(', ')} `;
  } else {
    narrative += `ปฏิเสธปัสสาวะเป็นเลือด ไม่มีหนองหรือตะกอนขุ่น `;
  }

  if (neuroSigns.length > 0 && !neuroSigns.includes('urinary_rf_neuro_none')) {
    narrative += `\nสัญญาณเตือนทางระบบประสาทไขสันหลัง: ตรวจพบอาการ [${neuroSigns.map(k => neuroMap[k]).filter(Boolean).join(', ')}] `;
  } else {
    narrative += `\nปฏิเสธอาการชาบริเวณก้น แก้มก้น หรือรอบรูทวาร (Negative saddle anesthesia), แขนขาไม่อ่อนแรง, สามารถควบคุมการขับถ่ายอุจจาระได้ตามปกติ `;
  }

  if (systemicSigns.length > 0 && !systemicSigns.includes('urinary_rf_systemic_none')) {
    narrative += `อาการร่วมทางระบบร่างกาย: ตรวจพบ [${systemicSigns.map(k => systemicMap[k]).filter(Boolean).join(', ')}] `;
  } else {
    narrative += `ปฏิเสธไข้หนาวสั่นสั่นสะท้าน ไม่มีอาการปวดบั้นเอว `;
  }

  if (meds.length > 0 && !meds.includes('med_none')) {
    narrative += `\nประวัติยาและสิ่งกระตุ้นก่อนเกิดอาการ: มีประวัติ [${meds.map(k => medsMap[k]).filter(Boolean).join(', ')}] `;
  } else {
    narrative += `\nปฏิเสธการรับประทานยาแก้หวัดลดน้ำมูก ยานอนหลับ หรือสารเสพติด/แอลกอฮอล์ `;
  }

  if (trauma.length > 0 && !trauma.includes('trauma_none')) {
    narrative += `\nประวัติอุบัติเหตุ: ตรวจพบ [${trauma.map(k => traumaMap[k]).filter(Boolean).join(', ')}] `;
  } else {
    narrative += `ปฏิเสธประวัติอุบัติเหตุกระแทกเชิงกรานหรือบริเวณหว่างขา ไม่มีเลือดสดซึมที่รูเปิดท่อปัสสาวะ `;
  }

  narrative += `\nสถานะสายสวนปัสสาวะ: ${catheterMap[patient.urinaryCatheterStatus] || 'ไม่ได้คาสายสวนปัสสาวะ'} `;
  if (pmhUrology.length > 0 && !pmhUrology.includes('pmh_urology_none')) {
    narrative += `ประวัติโรคระบบทางเดินปัสสาวะเดิม: ${pmhUrology.map(k => pmhUrologyMap[k]).filter(Boolean).join(', ')} `;
  } else {
    narrative += `ปฏิเสธประวัติโรคระบบทางเดินปัสสาวะเดิม `;
  }

  if ((patient.gender === 'หญิง' || patient.gender === 'Female') && patient.urinaryLmpDate) {
    narrative += `\nข้อมูลเฉพาะสตรี: ประจำเดือนรอบล่าสุด (LMP) วันที่ ${patient.urinaryLmpDate} `;
    if (patient.urinaryFemalePregnancyWarning) narrative += `(สงสัยภาวะตั้งครรภ์/ขาดประจำเดือน) `;
  }

  if (patient.otherSymptomsFree) {
    narrative += `\nข้อสังเกตเพิ่มเติมจากผู้ป่วย/ญาติ: ${patient.otherSymptomsFree}`;
  }

  // Build JSON Output
  const jsonOutput = {
    encounter: {
      chief_complaint: 'urinary_retention',
      chief_complaint_title_th: 'ปัสสาวะไม่ออก / เล็ดราด / กะปริดกะปรอย',
      timestamp: patient.timestamp || new Date().toISOString(),
      duration_val: patient.durationVal || null,
      duration_unit: patient.durationUnit || 'hours'
    },
    patient_identification: {
      id: patient.id || null,
      queue_number: patient.queue_number || null,
      hn: patient.hn || null,
      name: patient.name || null,
      age: patient.age || null,
      gender: patient.gender || null
    },
    retention_assessment: {
      sensation_type: patient.urinarySensation || 'unspecified',
      pain_score: patient.painScore !== null ? patient.painScore : null,
      preceding_luts: luts,
      urine_characteristics: urineChars,
      neuro_spinal_signs: neuroSigns,
      systemic_infection_signs: systemicSigns,
      medications_and_triggers: meds,
      trauma_signs: trauma,
      catheter_status: patient.urinaryCatheterStatus || 'catheter_none',
      urological_pmh: pmhUrology,
      urological_pmh_other: patient.urinaryPmhOtherText || null,
      other_symptoms_free: patient.otherSymptomsFree || ''
    },
    female_reproductive_history: (patient.gender === 'หญิง' || patient.gender === 'Female') ? {
      lmp_date: patient.urinaryLmpDate || null,
      pregnancy_warning: Boolean(patient.urinaryFemalePregnancyWarning),
      gyn_conditions: gynConditions
    } : null,
    safety_and_red_flags: {
      red_flags_detected: redFlags.map(rf => ({
        key: rf.key,
        level: rf.level,
        title_th: rf.textTh,
        clinical_risk: rf.risk,
        action: rf.suggestedAction
      })),
      total_red_flags: redFlags.length,
      cauda_equina_signs: redFlags.some(rf => rf.key === 'urinary_rf_cauda_equina'),
      urethral_trauma_ci: redFlags.some(rf => rf.key === 'urinary_rf_urethral_trauma_ci'),
      obstructive_urosepsis: redFlags.some(rf => rf.key === 'urinary_rf_obstructive_urosepsis'),
      uremic_anuria: redFlags.some(rf => rf.key === 'urinary_rf_uremic_anuria'),
      blocked_catheter: redFlags.some(rf => rf.key === 'urinary_rf_blocked_catheter')
    }
  };

  // Update DOM Elements if present
  const rapidEl = document.getElementById('rapidTextView');
  if (rapidEl) rapidEl.value = patient.custom_rapid_note || defaultRapid;

  const narrativeEl = document.getElementById('narrativeTextView');
  if (narrativeEl) narrativeEl.value = patient.custom_narrative_note || narrative;

  const jsonEl = document.getElementById('jsonViewer');
  if (jsonEl) jsonEl.textContent = JSON.stringify(jsonOutput, null, 2);
}

// --- Built-in CDS Generator ---
function generateUrinaryRetentionCds(patient, { rfs, ddxList = [], workupList = [], managementList = [] } = {}) {
  if (!patient) return;

  const redFlags = rfs || evaluateUrinaryRetentionRedFlags(patient);
  const neuroSigns = Array.isArray(patient.urinaryNeuroSigns) ? patient.urinaryNeuroSigns : [];
  const trauma = Array.isArray(patient.urinaryTrauma) ? patient.urinaryTrauma : [];
  const systemicSigns = Array.isArray(patient.urinarySystemicSigns) ? patient.urinarySystemicSigns : [];
  const meds = Array.isArray(patient.urinaryMeds) ? patient.urinaryMeds : [];
  const pmh = Array.isArray(patient.urinaryPmhUrology) ? patient.urinaryPmhUrology : [];

  if (redFlags.some(r => r.key === 'urinary_rf_cauda_equina')) {
    ddxList.push('1. 🚨 Cauda Equina Syndrome / Acute Spinal Cord Compression (Neurosurgical Emergency)');
    ddxList.push('2. Acute Urinary Retention with severe spinal neuropathy');
    ddxList.push('3. Spinal Epidural Abscess / Hematoma');
    workupList.push('Stat Urgent MRI Lumbosacral Spine (Gold standard)');
    workupList.push('Post-void residual volume (PVR) via Bladder Scan or gentle catheterization');
    managementList.push('Triage Level 1-2: Emergency Neurosurgery / Spine consult for decompressive surgery within 24-48 hours');
    managementList.push('Gentle urethral catheterization with 16-18 Fr Foley catheter');
  } else if (redFlags.some(r => r.key === 'urinary_rf_urethral_trauma_ci')) {
    ddxList.push('1. 🛑 Traumatic Urethral Disruption / Straddle Injury (Absolute CI to Blind Foley)');
    ddxList.push('2. Bladder rupture (Extraperitoneal vs Intraperitoneal)');
    ddxList.push('3. Pelvic fracture with associated lower urinary tract injury');
    workupList.push('Retrograde Urethrography (RUG) prior to any urethral instrumentation');
    workupList.push('Pelvic X-ray / CT Pelvis with cystography');
    managementList.push('🛑 DO NOT attempt blind urethral Foley catheterization');
    managementList.push('Urgent Urology Consult for Suprapubic Cystostomy');
  } else if (redFlags.some(r => r.key === 'urinary_rf_obstructive_urosepsis')) {
    ddxList.push('1. ⚡ Obstructive Urosepsis / Acute Pyelonephritis / Prostatic Abscess');
    ddxList.push('2. Severe Sepsis / Septic Shock secondary to Complicated UTI');
    workupList.push('CBC, BUN, Cr, Electrolytes, Blood Culture x 2, Urine Culture, Bedside U/S KUB');
    managementList.push('Sepsis Resuscitation: IV NSS/Ringer fluid bolus 30 mL/kg, Stat IV Broad-Spectrum Antibiotics (Ceftriaxone / Meropenem)');
    managementList.push('Stat Bladder Decompression: Foley catheterization or Suprapubic cystostomy');
  } else if (redFlags.some(r => r.key === 'urinary_rf_uremic_anuria')) {
    ddxList.push('1. ⚠️ True Anuria secondary to Acute Kidney Injury (Prerenal / Intrinsic / Postrenal)');
    ddxList.push('2. Severe Uremic Emergency with Metabolic Acidosis / Hyperkalemia');
    workupList.push('Stat 12-lead EKG (Hyperkalemia check), Stat BUN, Cr, Electrolytes, ABG/VBG, Bedside U/S Kidneys');
    managementList.push('Assess volume status (Dehydration vs Pulmonary edema), withhold nephrotoxic drugs, prepare emergency hemodialysis if refractory hyperkalemia/acidosis');
  } else if (redFlags.some(r => r.key === 'urinary_rf_blocked_catheter')) {
    ddxList.push('1. Obstructed Indwelling Foley Catheter (Catheter encrustation / Clots / Kinking)');
    ddxList.push('2. Catheter-Associated Urinary Tract Infection (CAUTI)');
    workupList.push('Urinalysis and Urine Gram stain / Culture');
    managementList.push('Aseptic Catheter Irrigation with sterile NSS or Replace with new Foley catheter (16-18 Fr)');
  } else {
    if (pmh.includes('pmh_bph_prostate') || meds.includes('med_cold_decongestant')) {
      ddxList.push('1. Acute Urinary Retention (AUR) secondary to Benign Prostatic Hyperplasia (BPH) precipitated by Sympathomimetic/Anticholinergic medication');
    } else {
      ddxList.push('1. Acute Urinary Retention (AUR) / Lower Urinary Tract Obstruction');
    }
    ddxList.push('2. Urethral Stricture Disease');
    ddxList.push('3. Impacted Urethral / Bladder Calculus');
    workupList.push('Bedside Bladder Scan / Ultrasound Bladder, Urinalysis, BUN, Cr, Electrolytes');
    managementList.push('Urethral catheterization with 16-18 Fr Foley catheter under aseptic technique');
    managementList.push('Monitor post-obstructive diuresis (if drained volume > 1000 mL in first hour)');
    managementList.push('Discontinue offending medications (Antihistamines / Decongestants / Anticholinergics)');
    managementList.push('Refer Urology OPD for alpha-blocker initiation and BPH management');
  }
}

// --- Seed Patient Cases (4 Cases) ---
const urinaryRetentionSeedCases = [
  {
    id: 'case-170',
    queue_number: 'B070',
    hn: '691700',
    name: 'นาย ประเสริฐ มีปัสสาวะขัด',
    age: 68,
    gender: 'ชาย',
    chief_complaint: 'urinary_retention',
    chief_complaint_title: 'ปัสสาวะไม่ออก / เล็ดราด / กะปริดกะปรอย',
    timestamp: '2026-10-27T08:30:00.000Z',
    status: 'waiting',
    durationVal: 8,
    durationUnit: 'hours',
    painScore: 8,
    urinarySensation: 'acute_painful_retention',
    urinaryLuts: ['luts_hesitancy', 'luts_nocturia'],
    urinaryUrineCharacteristics: ['urine_none_normal'],
    urinaryNeuroSigns: ['urinary_rf_neuro_none'],
    urinarySystemicSigns: ['urinary_rf_systemic_none'],
    urinaryMeds: ['med_cold_decongestant'],
    urinaryTrauma: ['trauma_none'],
    urinaryCatheterStatus: 'catheter_none',
    urinaryPmhUrology: ['pmh_bph_prostate'],
    urinaryPmhOtherText: '',
    otherSymptomsFree: 'ซื้อยาแก้หวัดลดน้ำมูกเม็ดสีเหลืองมาทานเมื่อวาน ตกกลางคืนเริ่มปวดเบ่งแต่ปัสสาวะไม่ออกเลย',
    underlying: ['ต่อมลูกหมากโต (BPH)', 'ความดันโลหิตสูง'],
    drugAllergy: 'ปฏิเสธ',
    currentMeds: 'Amlodipine 5 mg, ยาแก้หวัดลดน้ำมูก',
    doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' }
  },
  {
    id: 'case-171',
    queue_number: 'A071',
    hn: '691701',
    name: 'นาย สมพร ปวดหลังขาชา',
    age: 52,
    gender: 'ชาย',
    chief_complaint: 'urinary_retention',
    chief_complaint_title: 'ปัสสาวะไม่ออก / เล็ดราด / กะปริดกะปรอย',
    timestamp: '2026-10-27T07:15:00.000Z',
    status: 'waiting',
    durationVal: 12,
    durationUnit: 'hours',
    painScore: 9,
    urinarySensation: 'acute_painful_retention',
    urinaryLuts: ['luts_none_acute'],
    urinaryUrineCharacteristics: ['urine_none_normal'],
    urinaryNeuroSigns: ['urinary_rf_saddle_anesthesia', 'urinary_rf_leg_weakness', 'urinary_rf_fecal_incontinence', 'urinary_rf_severe_back_pain'],
    urinarySystemicSigns: ['urinary_rf_systemic_none'],
    urinaryMeds: ['med_none'],
    urinaryTrauma: ['trauma_none'],
    urinaryCatheterStatus: 'catheter_none',
    urinaryPmhUrology: ['pmh_urology_none'],
    urinaryPmhOtherText: '',
    otherSymptomsFree: 'ยกของหนักเมื่อวานแล้วปวดหลังร้าวลงขาสองข้าง วันนี้ชาที่ก้นรอบรูทวาร กลั้นอุจจาระไม่ได้ และปัสสาวะไม่ออก',
    underlying: ['ปฏิเสธ'],
    drugAllergy: 'ปฏิเสธ',
    currentMeds: 'ไม่ได้ระบุ',
    doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' }
  },
  {
    id: 'case-172',
    queue_number: 'A072',
    hn: '691702',
    name: 'นาง สมศรี นิ่วไข้สูง',
    age: 63,
    gender: 'หญิง',
    chief_complaint: 'urinary_retention',
    chief_complaint_title: 'ปัสสาวะไม่ออก / เล็ดราด / กะปริดกะปรอย',
    timestamp: '2026-10-27T06:45:00.000Z',
    status: 'waiting',
    durationVal: 10,
    durationUnit: 'hours',
    painScore: 8,
    urinarySensation: 'acute_painful_retention',
    urinaryLuts: ['luts_stone_history'],
    urinaryUrineCharacteristics: ['urine_gross_hematuria', 'urine_turbid_foul'],
    urinaryNeuroSigns: ['urinary_rf_neuro_none'],
    urinarySystemicSigns: ['urinary_rf_high_fever_chills', 'urinary_rf_flank_pain', 'urinary_rf_shock_syncope'],
    urinaryMeds: ['med_none'],
    urinaryTrauma: ['trauma_none'],
    urinaryCatheterStatus: 'catheter_none',
    urinaryPmhUrology: ['pmh_urinary_stone'],
    urinaryPmhOtherText: '',
    urinaryLmpDate: '01/01/2010',
    urinaryFemalePregnancyWarning: false,
    urinaryGynConditions: ['gyn_none'],
    otherSymptomsFree: 'เคยมีนิ่วในไต ปวดบั้นเอวขวารุนแรง หนาวสั่นสะท้านมาก หน้ามืดจะเป็นลม ปัสสาวะเป็นสีน้ำล้างเนื้อก่อนจะไม่ออก',
    underlying: ['นิ่วในระบบทางเดินปัสสาวะ', 'เบาหวานชนิดที่ 2'],
    drugAllergy: 'ปฏิเสธ',
    currentMeds: 'Metformin 500 mg',
    doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' }
  },
  {
    id: 'case-173',
    queue_number: 'B073',
    hn: '691703',
    name: 'นาย ชูเกียรติ สายสวนตัน',
    age: 76,
    gender: 'ชาย',
    chief_complaint: 'urinary_retention',
    chief_complaint_title: 'ปัสสาวะไม่ออก / เล็ดราด / กะปริดกะปรอย',
    timestamp: '2026-10-27T09:15:00.000Z',
    status: 'waiting',
    durationVal: 6,
    durationUnit: 'hours',
    painScore: 6,
    urinarySensation: 'overflow_dribbling',
    urinaryLuts: ['luts_none_acute'],
    urinaryUrineCharacteristics: ['urine_turbid_foul'],
    urinaryNeuroSigns: ['urinary_rf_neuro_none'],
    urinarySystemicSigns: ['urinary_rf_systemic_none'],
    urinaryMeds: ['med_none'],
    urinaryTrauma: ['trauma_none'],
    urinaryCatheterStatus: 'catheter_indwelling_blocked',
    urinaryPmhUrology: ['pmh_neurogenic_bladder', 'pmh_urology_other'],
    urinaryPmhOtherText: 'ผู้ป่วยติดเตียง คาสายสวนปัสสาวะประจำ',
    otherSymptomsFree: 'คาสายสวนปัสสาวะมา 3 สัปดาห์ วันนี้ปัสสาวะไม่ไหลลงถุง มีน้ำปัสสาวะซึมรั่วออกมาข้างสาย ท้องน้อยบวมตึง ร้องครางปวดท้อง',
    underlying: ['โรคหลอดเลือดสมอง (ผู้ป่วยติดเตียง)', 'ความดันโลหิตสูง'],
    drugAllergy: 'แพ้ Penicillin (ผื่นคัน)',
    currentMeds: 'Aspirin 81 mg, Enalapril 10 mg',
    doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' }
  }
];

// --- Registration with Core Engine ---
registerCcModule({
  id: 'urinary_retention',
  recordCc: 'urinary_retention',
  titleTh: 'ปัสสาวะไม่ออก / เล็ดราด / กะปริดกะปรอย',
  titleEn: 'Urinary retention / Overflow dribbling / Inability to void',
  sectionDomId: 'urinaryRetentionQuestionnaireSection',
  headerTh: 'แบบฟอร์มซักประวัติ: ปัสสาวะไม่ออก / เล็ดราด / กะปริดกะปรอย',
  headerEn: '(Urinary Retention & Neurogenic Bladder Triage)',
  patientBadgeHtml: '<i data-lucide="droplet" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-amber-500"></i><span class="whitespace-nowrap">ปัสสาวะไม่ออก / เล็ดราด / กะปริดกะปรอย</span>',
  doctorCcBadgeHtml: '<i data-lucide="droplet" class="w-3.5 h-3.5 mr-1 text-amber-500"></i> CC: ปัสสาวะไม่ออก / เล็ดราด / กะปริดกะปรอย',
  dateFields: ['urinaryLmpDate'],
  timeFields: [],
  branchIds: ['urinaryPmhOtherWrap', 'urinary_branch_female'],
  inputIdsToClear: [
    'urinaryDurationVal',
    'urinaryPainScore',
    'urinaryPmhOtherText',
    'urinaryLmpDate',
    'urinary_other_free'
  ],
  algorithm: {
    chiefComplaint: 'urinary_retention',
    titleTh: 'ปัสสาวะไม่ออก / เล็ดราด / กะปริดกะปรอย',
    schemaCode: 'urinary_retention',
    version: '2.0.0',
    redFlagDefinitions: [
      { key: 'urinary_rf_cauda_equina', level: 1, textTh: 'สงสัย Cauda Equina Syndrome / ไขสันหลังถูกกดทับเฉียบพลัน' },
      { key: 'urinary_rf_urethral_trauma_ci', level: 1, textTh: 'สงสัยการบาดเจ็บของท่อปัสสาวะ (ข้อห้ามใส่สายสวน Foley โดยตรง)' },
      { key: 'urinary_rf_obstructive_urosepsis', level: 1, textTh: 'สงสัยภาวะติดเชื้อในกระแสเลือดจากการอุดกั้น (Obstructive Urosepsis)' },
      { key: 'urinary_rf_uremic_anuria', level: 2, textTh: 'ไม่มีปัสสาวะออกมาเลย (True Anuria / เสี่ยงภาวะไตวายเฉียบพลันและเกลือแร่ผิดปกติ)' },
      { key: 'urinary_rf_blocked_catheter', level: 2, textTh: 'สายสวนปัสสาวะอุดตัน (Catheter Obstruction / Encrustation)' }
    ]
  },
  getPmhSectionNumber: function() {
    const fCard = document.getElementById('urinary_branch_female');
    return (fCard && !fCard.classList.contains('hidden')) ? 8 : 7;
  },
  onTitleChange: function({ isFemale }) {
    const fCard = document.getElementById('urinary_branch_female');
    const noteNum = document.getElementById('urinarySectionNumberNotes');
    if (fCard) {
      if (isFemale) {
        fCard.classList.remove('hidden');
        if (noteNum) noteNum.textContent = '7';
      } else {
        fCard.classList.add('hidden');
        if (noteNum) noteNum.textContent = '6';
        const lmp = document.getElementById('urinaryLmpDate');
        if (lmp) lmp.value = '';
        const preg = document.getElementById('urinaryFemalePregnancyWarning');
        if (preg) preg.checked = false;
        document.querySelectorAll('input[name="urinaryGynConditions"]').forEach(cb => { cb.checked = false; });
      }
    }
  },
  evaluateRedFlags: evaluateUrinaryRetentionRedFlags,
  updateOutputs: updateUrinaryRetentionOutputs,
  generateCds: generateUrinaryRetentionCds,
  seedPatients: urinaryRetentionSeedCases,

  // --- Form HTML Template (Zero Default Bias, Neutral Patient Phrasing) ---
  formHtml: `
    <div id="urinaryRetentionQuestionnaireSection" class="hidden space-y-6">

      <!-- Triage Advisory Banner -->
      <div class="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-2xl flex items-start space-x-3">
        <i data-lucide="alert-triangle" class="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"></i>
        <div class="text-xs text-amber-900 leading-relaxed">
          <strong class="font-bold">ข้อความแจ้งเตือนจุดคัดกรอง:</strong> หากผู้ป่วยมีอาการ <strong>ปัสสาวะไม่ออก</strong> ร่วมกับ <strong>มีอาการชาบริเวณก้น/หว่างขา (Saddle anesthesia)</strong> หรือ <strong>ขาอ่อนแรงทั้งสองข้าง</strong> ถือเป็น <strong>ภาวะฉุกเฉินวิกฤต ให้แจ้งพยาบาลคัดกรองเพื่อส่งตรวจห้องฉุกเฉินทันที</strong>
        </div>
      </div>

      <!-- CARD 1: ระยะเวลา ความรู้สึกปวดตึง และคะแนนความปวด (Duration & Pain Score) -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="clock" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">1. ระยะเวลาและความรู้สึกปวดตึงท้องน้อย (Onset & Suprapubic Pain)</h2>
            <p class="text-xs text-slate-500">ระบุระยะเวลาตั้งแต่ปัสสาวะออกครั้งสุดท้าย และระดับความปวดแน่น</p>
          </div>
        </div>

        <div class="space-y-4">
          <!-- 1.1 ระยะเวลา -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">ปัสสาวะไม่ออก หรือเริ่มมีอาการมานานเท่าไรแล้ว? <span class="text-rose-500">*</span></label>
            <div class="grid grid-cols-2 gap-3">
              <input type="number" id="urinaryDurationVal" min="1" placeholder="ระบุตัวเลข เช่น 6, 12" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-medical-500">
              <select id="urinaryDurationUnit" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-medical-500">
                <option value="minutes">นาที</option>
                <option value="hours" selected>ชั่วโมง</option>
                <option value="days">วัน</option>
                <option value="weeks">สัปดาห์</option>
                <option value="months">เดือน</option>
                <option value="years">ปี</option>
              </select>
            </div>
          </div>

          <!-- 1.2 ความรู้สึกปวดและความตึงแน่นบริเวณท้องน้อย -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">ความรู้สึกปวดและความตึงแน่นบริเวณท้องน้อยเป็นอย่างไร? <span class="text-rose-500">*</span></label>
            <div class="space-y-2">
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="urinarySensation" value="acute_painful_retention" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800 font-medium">ปวดแน่นท้องน้อยรุนแรงมาก ปวดเบ่งตลอดเวลาแต่ไม่มีปัสสาวะออกเลยแม้แต่หยดเดียว</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="urinarySensation" value="overflow_dribbling" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800 font-medium">ปวดตึงแน่นท้องน้อย มีน้ำปัสสาวะไหลเล็ดซึมหรือหยดออกทีละน้อย แต่เบ่งไม่ออกและไม่โล่งท้อง</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="urinarySensation" value="painless_anuria" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800 font-medium">ไม่มีความรู้สึกปวดปัสสาวะเลย และไม่มีปัสสาวะออกมาเลย (ท้องน้อยแฟบปกติ)</span>
              </label>
            </div>
          </div>

          <!-- 1.3 Pain Score Scale (0-10) with Emoji Faces -->
          <div class="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label class="block text-xs font-semibold text-slate-800 uppercase tracking-wider">
                ระดับความปวดแน่นท้องน้อยในขณะนี้ (Pain Score: 0 - 10)
              </label>
              <div class="flex items-center space-x-2">
                <span id="urinaryPainScoreBadge" class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all">
                  <span id="urinaryPainScoreEmoji" class="text-base">⚪</span>
                  <span id="urinaryPainScoreText">ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)</span>
                </span>
                <button type="button" id="urinaryPainScoreClearBtn" onclick="clearUrinaryPainScore()" class="text-xs text-slate-400 hover:text-medical-600 underline hidden transition" title="ล้างค่าเพื่อให้เป็นไม่ได้ระบุ">ล้างค่า</button>
              </div>
            </div>

            <!-- Range Slider -->
            <div class="px-1 pt-1">
              <input type="range" id="urinaryPainScore" min="0" max="10" value="0" step="1"
                oninput="handleUrinaryPainScoreChange(this.value)"
                class="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-600 focus:outline-none focus:ring-2 focus:ring-medical-500">
            </div>

            <!-- Visual Emoji Scale Guide -->
            <div class="grid grid-cols-5 text-center text-[10px] sm:text-[11px] pt-1 gap-1 text-slate-500 font-medium">
              <div class="cursor-pointer hover:text-medical-600 transition" onclick="setUrinaryPainScore(0)">
                <span class="text-lg sm:text-xl block">😊</span>
                <span>0: สบายดี</span>
              </div>
              <div class="cursor-pointer hover:text-medical-600 transition" onclick="setUrinaryPainScore(2)">
                <span class="text-lg sm:text-xl block">🙂</span>
                <span>1-3: เล็กน้อย</span>
              </div>
              <div class="cursor-pointer hover:text-medical-600 transition" onclick="setUrinaryPainScore(5)">
                <span class="text-lg sm:text-xl block">😐</span>
                <span>4-6: ปานกลาง</span>
              </div>
              <div class="cursor-pointer hover:text-medical-600 transition" onclick="setUrinaryPainScore(8)">
                <span class="text-lg sm:text-xl block">😣</span>
                <span>7-9: ปวดมาก</span>
              </div>
              <div class="cursor-pointer hover:text-medical-600 transition" onclick="setUrinaryPainScore(10)">
                <span class="text-lg sm:text-xl block">😭</span>
                <span>10: ปวดรุนแรงที่สุด</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 2: ลักษณะก่อนเกิดอาการ และสิ่งผิดปกติในปัสสาวะ (Preceding LUTS & Urine Chars) -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="droplet" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">2. ลักษณะก่อนเกิดอาการ และสิ่งผิดปกติในปัสสาวะ (Voiding History & Urine Character)</h2>
            <p class="text-xs text-slate-500">ประเมินประวัติการขับถ่ายเดิมและลักษณะของน้ำปัสสาวะ</p>
          </div>
        </div>

        <div class="space-y-4">
          <!-- 2.1 อาการนำในการขับถ่ายเดิม -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">ก่อนหน้าอาการครั้งนี้ ในช่วงสัปดาห์หรือเดือนที่ผ่านมา มีอาการขับถ่ายปัสสาวะอย่างไรบ้าง? (เลือกได้หลายข้อ)</label>
            <div class="space-y-2">
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinaryLuts" value="luts_hesitancy" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">ปัสสาวะรอนาน ลำปัสสาวะพุ่งช้า ลำเล็ก หรือต้องออกแรงเบ่งมาก</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinaryLuts" value="luts_intermittency" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">ปัสสาวะสะดุด ไหลๆ หยุดๆ ขาดตอน</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinaryLuts" value="luts_nocturia" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">ต้องลุกขึ้นมาปัสสาวะตอนกลางคืนบ่อยผิดปกติ (เกิน 2–3 ครั้งต่อคืน)</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinaryLuts" value="luts_stone_history" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">เคยมีประวัตินิ่ว ปัสสาวะมีเศษกรวดทราย หรือปัสสาวะสะดุดเฉียบพลันมาก่อน</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinaryLuts" value="luts_none_acute" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800 font-semibold ">ขับถ่ายปัสสาวะพุ่งดีเป็นปกติมาโดยตลอด เพิ่งเกิดอาการไม่ออกในครั้งนี้อย่างกะทันหัน</span>
              </label>
            </div>
          </div>

          <!-- 2.2 สิ่งผิดปกติในน้ำปัสสาวะ -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">สิ่งผิดปกติที่สังเกตเห็นในน้ำปัสสาวะ (เลือกได้ตามจริง):</label>
            <div class="space-y-2">
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinaryUrineCharacteristics" value="urine_gross_hematuria" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">มีเลือดสด ลิ่มเลือด หรือสีน้ำล้างเนื้อปนออกมาก่อนที่จะปัสสาวะไม่ออก</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinaryUrineCharacteristics" value="urine_turbid_foul" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">ปัสสาวะขุ่น มีตะกอนขาว หรือกลิ่นเหม็นรุนแรงผิดปกติ</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinaryUrineCharacteristics" value="urine_urethral_discharge" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">มีมูก หนอง หรือน้ำคัดหลั่งผิดปกติไหลออกจากปลายท่อปัสสาวะ</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinaryUrineCharacteristics" value="urine_none_normal" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">ปัสสาวะใสสีเหลืองปกติ ไม่มีเลือดหรือหนองปน</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 3: อาการร่วมทางระบบประสาท การติดเชื้อ และระบบร่างกาย (Associated Neurologic, Infection & Systemic Symptoms) -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="shield-alert" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">3. อาการร่วมทางระบบประสาท การติดเชื้อ และระบบร่างกาย (Red Flags & Systemic Signs)</h2>
            <p class="text-xs text-slate-500">ตรวจสอบความผิดปกติทางระบบประสาทและสัญญาณการติดเชื้อ</p>
          </div>
        </div>

        <div class="space-y-4">
          <!-- 3.1 ระบบประสาทและไขสันหลัง -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">อาการร่วมทางระบบประสาทและหลัง (เลือกได้หลายข้อ):</label>
            <div class="space-y-2">
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinaryNeuroSigns" value="urinary_rf_saddle_anesthesia" onchange="handleUrinaryNeuroItemChange(this)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">มีอาการชาบริเวณก้น แก้มก้น รอบรูทวารหนัก หรือบริเวณอวัยวะเพศ/หว่างขา</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinaryNeuroSigns" value="urinary_rf_leg_weakness" onchange="handleUrinaryNeuroItemChange(this)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">ขาทั้งสองข้างอ่อนแรง เดินลำบาก หรือขากระตุกก้าวขาไม่ออก</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinaryNeuroSigns" value="urinary_rf_fecal_incontinence" onchange="handleUrinaryNeuroItemChange(this)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">กลั้นอุจจาระไม่ได้ มีอุจจาระเล็ดราดโดยไม่รู้ตัวหรือไม่รู้สึกเวลาถ่ายอุจจาระ</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinaryNeuroSigns" value="urinary_rf_severe_back_pain" onchange="handleUrinaryNeuroItemChange(this)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">มีอาการปวดหลังช่วงเอวรุนแรง ร่วมกับอาการปวดร้าวแปลบลงขาทั้งสองข้าง</span>
              </label>
            </div>
          </div>

          <!-- 3.2 อาการร่วมทางระบบร่างกายและภาวะติดเชื้อ -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">อาการร่วมทางระบบร่างกายและไข้ (เลือกได้หลายข้อ):</label>
            <div class="space-y-2">
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinarySystemicSigns" value="urinary_rf_high_fever_chills" onchange="handleUrinarySystemicItemChange(this)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">มีไข้สูง หนาวสั่นสะท้านจับไข้ หรือตัวเย็นสั่น</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinarySystemicSigns" value="urinary_rf_flank_pain" onchange="handleUrinarySystemicItemChange(this)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">ปวดบั้นเอวหรือสะเทือนแล้วเจ็บบริเวณสีข้างข้างใดข้างหนึ่งอย่างรุนแรง</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinarySystemicSigns" value="urinary_rf_altered_mental" onchange="handleUrinarySystemicItemChange(this)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">มีอาการซึมลง สับสน เอะอะโวยวาย หรือไม่ค่อยรู้ตัว</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinarySystemicSigns" value="urinary_rf_shock_syncope" onchange="handleUrinarySystemicItemChange(this)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">หน้ามืด วูบหมดสติ วิงเวียนรุนแรง เหงื่อแตกตัวเย็นซีด</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinarySystemicSigns" value="urinary_rf_dyspnea_edema" onchange="handleUrinarySystemicItemChange(this)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">หายใจหอบเหนื่อยลึก แน่นหน้าอกนอนราบไม่ได้ หรือมีอาการบวมทั่วตัว</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 4: สิ่งกระตุ้น ประวัติยา และอุบัติเหตุ (Triggers, Medications & Trauma) -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="alert-triangle" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">4. สิ่งกระตุ้น ประวัติยา และอุบัติเหตุ (Precipitants, Meds & Trauma)</h2>
            <p class="text-xs text-slate-500">ประเมินประวัติการรับประทานยาและอุบัติเหตุที่อาจเกี่ยวข้อง</p>
          </div>
        </div>

        <div class="space-y-4">
          <!-- 4.1 ประวัติยาและสิ่งกระตุ้น -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">ประวัติการรับประทานยาหรือสารกระตุ้นในช่วง 24–48 ชั่วโมงที่ผ่านมา (เลือกได้หลายข้อ):</label>
            <div class="space-y-2">
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinaryMeds" value="med_cold_decongestant" onchange="handleUrinaryMedsItemChange(this)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">รับประทานยาแก้หวัด ยาลดน้ำมูก หรือยาแก้แพ้ (เช่น CPM, Hydroxyzine, Pseudoephedrine)</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinaryMeds" value="med_psychiatric_tca" onchange="handleUrinaryMedsItemChange(this)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">รับประทานยานอนหลับ ยาคลายกังวล หรือยาต้านซึมเศร้า (เช่น Amitriptyline)</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinaryMeds" value="med_opioids" onchange="handleUrinaryMedsItemChange(this)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">รับประทานยาแก้ปวดกลุ่มมอร์ฟีน ทรามาดอล (Tramadol) หรือยาแก้ปวดชนิดรุนแรง</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinaryMeds" value="med_alcohol_binge" onchange="handleUrinaryMedsItemChange(this)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">มีประวัติดื่มแอลกอฮอล์ปริมาณมากก่อนเริ่มมีอาการ</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinaryMeds" value="med_anesthesia_recent" onchange="handleUrinaryMedsItemChange(this)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">เพิ่งได้รับการผ่าตัด ดมยาสลบ หรือฉีดยาชาเข้าไขสันหลัง (ภายใน 24–48 ชม.)</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinaryMeds" value="med_none" onchange="handleUrinaryMedsNoneToggle(this)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800 font-semibold ">ไม่ได้รับประทานยาหรือสารข้างต้น</span>
              </label>
            </div>
          </div>

          <!-- 4.2 ประวัติอุบัติเหตุ -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">ประวัติอุบัติเหตุและการบาดเจ็บเฉพาะที่:</label>
            <div class="space-y-2">
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinaryTrauma" value="trauma_straddle_pelvis" onchange="handleUrinaryTraumaItemChange(this)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">เพิ่งได้รับอุบัติเหตุกระแทกบริเวณเชิงกราน หว่างขา พลัดตกคร่อมของแข็ง หรืออุบัติเหตุจราจร</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinaryTrauma" value="trauma_meatal_bleeding" onchange="handleUrinaryTraumaItemChange(this)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800 font-medium ">สังเกตเห็นรอยเลือดสดซึมออกมาจากรูเปิดท่อปัสสาวะ</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinaryTrauma" value="trauma_none" onchange="handleUrinaryTraumaNoneToggle(this)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800 font-semibold ">ไม่มีประวัติอุบัติเหตุหรือบาดเจ็บใดๆ</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 5: ประวัติโรคประจำตัวเดิมและการคาสายสวน (Urological PMH & Catheter Status) -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="file-text" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">5. ประวัติโรคทางเดินปัสสาวะเดิมและการคาสายสวน (Urologic History & Catheter)</h2>
            <p class="text-xs text-slate-500">ตรวจสอบสถานะสายสวนปัสสาวะและประวัติโรคประจำตัวเฉพาะด้าน</p>
          </div>
        </div>

        <div class="space-y-4">
          <!-- 5.1 สถานะสายสวนปัสสาวะ -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">ปัจจุบันผู้ป่วยมีการคาสายสวนปัสสาวะหรือไม่? <span class="text-rose-500">*</span></label>
            <div class="space-y-2">
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="urinaryCatheterStatus" value="catheter_none" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800 font-medium">ไม่ได้คาสายสวนปัสสาวะ (ปัสสาวะเองตามปกติ)</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="urinaryCatheterStatus" value="catheter_indwelling_blocked" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800 font-medium">มีสายสวนปัสสาวะคาสายอยู่เดิม (Foley catheter) แต่น้ำปัสสาวะไม่ไหลลงถุง มีอาการปวดแน่นท้องน้อย</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="urinaryCatheterStatus" value="catheter_intermittent_cic" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800 font-medium">สวนปัสสาวะทิ้งเป็นระยะด้วยตนเอง (Clean Intermittent Catheterization)</span>
              </label>
            </div>
          </div>

          <!-- 5.2 ประวัติโรคระบบทางเดินปัสสาวะเดิม -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">ประวัติโรคระบบทางเดินปัสสาวะเดิม (เลือกได้หลายข้อ):</label>
            <div class="space-y-2">
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinaryPmhUrology" value="pmh_bph_prostate" onchange="handleUrinaryPmhItemChange(this)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">โรคต่อมลูกหมากโต (BPH) หรือมะเร็งต่อมลูกหมาก</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinaryPmhUrology" value="pmh_urethral_stricture" onchange="handleUrinaryPmhItemChange(this)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">เคยได้รับการวินิจฉัยท่อปัสสาวะตีบ หรือเคยขยายท่อปัสสาวะ</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinaryPmhUrology" value="pmh_urinary_stone" onchange="handleUrinaryPmhItemChange(this)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">เคยมีประวัตินิ่วในระบบทางเดินปัสสาวะ</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinaryPmhUrology" value="pmh_neurogenic_bladder" onchange="handleUrinaryPmhItemChange(this)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">โรคเบาหวานมานาน, โรคหลอดเลือดสมอง หรือโรคกระดูกสันหลังที่มีผลต่อการขับถ่าย</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinaryPmhUrology" value="pmh_urology_other" onchange="handleUrinaryPmhOtherToggle(this)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800 font-semibold text-sky-800">โรคระบบทางเดินปัสสาวะเดิม อื่นๆ (ระบุ)</span>
              </label>
              <!-- Progressive Disclosure: รายละเอียดโรคทางเดินปัสสาวะอื่นๆ -->
              <div id="urinaryPmhOtherWrap" class="hidden ml-7 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <label class="block text-[11px] font-semibold text-slate-700 mb-1">ระบุรายละเอียดโรคระบบทางเดินปัสสาวะเดิม:</label>
                <input type="text" id="urinaryPmhOtherText" placeholder="เช่น เคยผ่าตัดเนื้องอกกระเพาะปัสสาวะ, กระเพาะปัสสาวะอักเสบเรื้อรัง ฯลฯ" class="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400">
              </div>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinaryPmhUrology" value="pmh_urology_none" onchange="handleUrinaryPmhUrologyNoneToggle(this)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800 font-semibold ">ไม่มีโรคประจำตัวทางเดินปัสสาวะเดิม</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 6 (สตรี): ข้อมูลเฉพาะสตรี (Female Specific & LMP) -->
      <div id="urinary_branch_female" class="hidden bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="heart-pulse" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">6. ข้อมูลเฉพาะสตรี (Female Reproductive History)</h2>
            <p class="text-xs text-slate-500">ประเมินประวัติประจำเดือนและภาวะทางนรีเวชที่เกี่ยวข้อง</p>
          </div>
        </div>

        <div class="space-y-4">
          <!-- 6.1 วันแรกของประจำเดือนรอบล่าสุด -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">วันแรกของประจำเดือนรอบล่าสุด (LMP):</label>
            <input type="text" id="urinaryLmpDate" data-universal-date="true" placeholder="วว/ดด/ปปปป เช่น 27/10/2026" class="w-full max-w-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500">
          </div>

          <!-- 6.2 สงสัยตั้งครรภ์ -->
          <div>
            <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
              <input type="checkbox" id="urinaryFemalePregnancyWarning" class="text-medical-600 mt-0.5">
              <span class="ml-2.5 text-xs text-slate-800 font-medium">ขาดประจำเดือน หรือสงสัยว่าอาจกำลังตั้งครรภ์</span>
            </label>
          </div>

          <!-- 6.3 ภาวะทางนรีเวช -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">ภาวะทางนรีเวชอื่นๆ (เลือกได้ตามจริง):</label>
            <div class="space-y-2">
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinaryGynConditions" value="gyn_pelvic_organ_prolapse" onchange="handleUrinaryGynItemChange(this)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">มีประวัติมดลูกหย่อน ก้อนยื่นโผล่ออกมาทางช่องคลอด</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinaryGynConditions" value="gyn_genital_herpes" onchange="handleUrinaryGynItemChange(this)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800">มีแผลพุพองหรือแผลเริมที่อวัยวะเพศภายนอก ซึ่งเจ็บแสบมากจนกลั้นปัสสาวะ</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl cursor-pointer">
                <input type="checkbox" name="urinaryGynConditions" value="gyn_none" onchange="handleUrinaryGynNoneToggle(this)" class="text-medical-600 mt-0.5">
                <span class="ml-2.5 text-xs text-slate-800 font-semibold ">ไม่มีภาวะข้างต้น</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD: อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม (Other Symptoms Free-Text) -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100">
          <div class="bg-slate-100 text-slate-600 p-2 rounded-xl">
            <i data-lucide="message-square-plus" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-800"><span id="urinarySectionNumberNotes">6</span>. อาการอื่น ๆ หรือข้อความเพิ่มเติมถึงแพทย์ (Additional Notes)</h2>
            <p class="text-xs text-slate-500">ระบุรายละเอียดอื่นๆ ที่สังเกตเห็น หรือความกังวลเพิ่มเติม (ไม่บังคับ)</p>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">ข้อสังเกตหรืออาการอื่นๆ ที่ต้องการแจ้งแพทย์เพิ่มเติม:</label>
            <textarea id="urinary_other_free" rows="3" placeholder="เช่น มีอาการปวดแสบขัดปลายท่อปัสสาวะร่วมด้วย, ปวดจนตัวงอ, มีประวัติเคยผ่าตัดต่อมลูกหมากมาก่อน ฯลฯ" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:ring-2 focus:ring-medical-500 placeholder:text-slate-400"></textarea>
          </div>
        </div>
      </div>

    </div>
  `,

  // --- Collect Intake Hook ---
  collectIntake: function(ctx) {
    const _rawDur = parseFloat(document.getElementById('urinaryDurationVal')?.value); const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
    const durationUnit = document.getElementById('urinaryDurationUnit')?.value || 'hours';

    const urinarySensation = document.querySelector('input[name="urinarySensation"]:checked')?.value || '';
    const painScore = urinaryPainScoreTouched ? parseInt(document.getElementById('urinaryPainScore')?.value, 10) : null;

    const urinaryLuts = [];
    document.querySelectorAll('input[name="urinaryLuts"]:checked').forEach(cb => { urinaryLuts.push(cb.value); });

    const urinaryUrineCharacteristics = [];
    document.querySelectorAll('input[name="urinaryUrineCharacteristics"]:checked').forEach(cb => { urinaryUrineCharacteristics.push(cb.value); });

    const urinaryNeuroSigns = [];
    document.querySelectorAll('input[name="urinaryNeuroSigns"]:checked').forEach(cb => { urinaryNeuroSigns.push(cb.value); });

    const urinarySystemicSigns = [];
    document.querySelectorAll('input[name="urinarySystemicSigns"]:checked').forEach(cb => { urinarySystemicSigns.push(cb.value); });

    const urinaryMeds = [];
    document.querySelectorAll('input[name="urinaryMeds"]:checked').forEach(cb => { urinaryMeds.push(cb.value); });

    const urinaryTrauma = [];
    document.querySelectorAll('input[name="urinaryTrauma"]:checked').forEach(cb => { urinaryTrauma.push(cb.value); });

    const urinaryCatheterStatus = document.querySelector('input[name="urinaryCatheterStatus"]:checked')?.value || '';

    const urinaryPmhUrology = [];
    document.querySelectorAll('input[name="urinaryPmhUrology"]:checked').forEach(cb => { urinaryPmhUrology.push(cb.value); });
    const urinaryPmhOtherText = document.getElementById('urinaryPmhOtherText')?.value?.trim() || '';

    const otherSymptomsFree = document.getElementById('urinary_other_free')?.value?.trim() || ctx.otherSymptomsFree || '';

    const urinaryLmpDate = document.getElementById('urinaryLmpDate')?.value?.trim() || '';
    const urinaryFemalePregnancyWarning = Boolean(document.getElementById('urinaryFemalePregnancyWarning')?.checked);

    const urinaryGynConditions = [];
    document.querySelectorAll('input[name="urinaryGynConditions"]:checked').forEach(cb => { urinaryGynConditions.push(cb.value); });

    const patient = {
      id: ctx.recordId,
      queue_number: ctx.queueNumber,
      hn: ctx.randomHn,
      name: ctx.patientName,
      age: ctx.patientAge,
      gender: ctx.gender,
      chief_complaint: 'urinary_retention',
      chief_complaint_title: 'ปัสสาวะไม่ออก / เล็ดราด / กะปริดกะปรอย',
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

      urinarySensation,
      painScore,
      urinaryLuts,
      urinaryUrineCharacteristics,
      urinaryNeuroSigns,
      urinarySystemicSigns,
      urinaryMeds,
      urinaryTrauma,
      urinaryCatheterStatus,
      urinaryPmhUrology,
      urinaryPmhOtherText,
      urinaryLmpDate,
      urinaryFemalePregnancyWarning,
      urinaryGynConditions
    };

    return patient;
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

    setVal('urinaryDurationVal', patient.durationVal || '');
    setVal('urinaryDurationUnit', patient.durationUnit || 'hours');

    setRadio('urinarySensation', patient.urinarySensation);

    if (patient.painScore !== null && patient.painScore !== undefined) {
      setUrinaryPainScore(patient.painScore);
    } else {
      clearUrinaryPainScore();
    }

    setChkGroup('urinaryLuts', patient.urinaryLuts);
    setChkGroup('urinaryUrineCharacteristics', patient.urinaryUrineCharacteristics);
    setChkGroup('urinaryNeuroSigns', patient.urinaryNeuroSigns);
    setChkGroup('urinarySystemicSigns', patient.urinarySystemicSigns);
    setChkGroup('urinaryMeds', patient.urinaryMeds);
    setChkGroup('urinaryTrauma', patient.urinaryTrauma);

    setRadio('urinaryCatheterStatus', patient.urinaryCatheterStatus);
    setChkGroup('urinaryPmhUrology', patient.urinaryPmhUrology);

    if (Array.isArray(patient.urinaryPmhUrology) && patient.urinaryPmhUrology.includes('pmh_urology_other')) {
      const wrap = document.getElementById('urinaryPmhOtherWrap');
      if (wrap) wrap.classList.remove('hidden');
      setVal('urinaryPmhOtherText', patient.urinaryPmhOtherText || '');
    }

    setVal('urinary_other_free', patient.otherSymptomsFree || '');

    if (patient.gender === 'หญิง' || patient.gender === 'Female') {
      const fCard = document.getElementById('urinary_branch_female');
      if (fCard) fCard.classList.remove('hidden');
      setVal('urinaryLmpDate', patient.urinaryLmpDate || '');
      const pregEl = document.getElementById('urinaryFemalePregnancyWarning');
      if (pregEl) pregEl.checked = Boolean(patient.urinaryFemalePregnancyWarning);
      setChkGroup('urinaryGynConditions', patient.urinaryGynConditions);
    }
  },

  hydrateForm: function(patient) {
    this.populateForm(patient);
  },

  isRedFlag: function(patient) {
    return evaluateUrinaryRetentionRedFlags(patient).length > 0;
  }
});
