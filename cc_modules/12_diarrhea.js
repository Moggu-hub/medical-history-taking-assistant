// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 12_diarrhea.js
// อาการนำ: ท้องเสีย / ถ่ายเหลว / ถ่ายเป็นน้ำ (Acute Diarrhea / Watery Stool / Dysentery)
// ปรับปรุงตามมาตรฐาน plan_diarrhea.md, plan-cc และ code-cc (กลุ่ม B2)
// =========================================================================

// --- Internal DOM & UI Helpers ---
function getDiarEl(id) {
  return typeof document !== 'undefined' ? document.getElementById(id) : null;
}

function queryDiarOne(selector) {
  return typeof document !== 'undefined' ? document.querySelector(selector) : null;
}

function queryDiarAll(selector) {
  return typeof document !== 'undefined' ? Array.from(document.querySelectorAll(selector)) : [];
}

function wrapDiarWords(chunks) {
  if (!Array.isArray(chunks)) return chunks;
  return chunks.map(c => `<span class="inline-block whitespace-nowrap">${c}</span>`).join(' ');
}

function renderDiarOption(cfg) {
  const {
    kind = 'checkbox',
    id = '',
    name = '',
    value = '',
    title,
    desc = '',
    onchange = '',
    compact = false,
    colSpan2 = false
  } = cfg;
  const idAttr = id ? `id="${id}" ` : '';
  const nameAttr = name ? `name="${name}" ` : '';
  const valAttr = value ? `value="${value}" ` : '';
  const chgAttr = onchange ? `onchange="${onchange}" ` : '';
  const alignCls = desc ? 'items-start' : 'items-center';
  const padCls = compact ? 'p-2.5' : 'p-3';
  const spanCls = colSpan2 ? ' sm:col-span-2' : '';
  const roundCls = kind === 'checkbox' ? 'rounded ' : '';
  const topCls = desc ? 'mt-0.5 ' : '';
  const szCls = compact ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const titleHtml = Array.isArray(title) ? wrapDiarWords(title) : title;
  const bodyHtml = desc
    ? `<div class="ml-3 leading-snug"><span class="block text-xs sm:text-sm font-semibold text-slate-800">${titleHtml}</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">${desc}</span></div>`
    : `<span class="ml-3 ${compact ? 'text-xs' : 'text-xs sm:text-sm'} font-semibold text-slate-800 leading-snug">${titleHtml}</span>`;
  return `<label class="selectable-card bg-white flex ${alignCls} ${padCls} rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition${spanCls}"><input type="${kind}" ${idAttr}${nameAttr}${valAttr}${chgAttr}class="${topCls}${roundCls}text-medical-600 focus:ring-medical-500 ${szCls} flex-shrink-0">${bodyHtml}</label>`;
}

function renderDiarGrid(colsCls, items, shared = {}) {
  return `<div class="grid ${colsCls} gap-2.5">${items.map(it => renderDiarOption({ ...shared, ...it })).join('\n')}</div>`;
}

function renderDiarSysHeader({
  label,
  icon,
  colorClass,
  toggleId = '',
  toggleLabel = '',
  toggleOnchange = '',
  toggleName = '',
  toggleValue = ''
}) {
  const nameAttr = toggleName ? `name="${toggleName}" ` : '';
  const valAttr = toggleValue ? `value="${toggleValue}" ` : '';
  const toggleHtml = toggleId
    ? `<label class="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-medium text-slate-700 cursor-pointer transition select-none flex-shrink-0">
      <input type="checkbox" id="${toggleId}" ${nameAttr}${valAttr}onchange="${toggleOnchange}" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded">
      <span class="ml-1.5 whitespace-nowrap">${toggleLabel}</span>
    </label>`
    : '';
  return `<div class="flex flex-wrap items-center justify-between gap-2 mb-2.5">
    <label class="flex items-center text-xs sm:text-sm font-bold text-slate-800">
      <span class="${colorClass} p-1.5 rounded-lg mr-2 inline-flex items-center justify-center"><i data-lucide="${icon}" class="w-4 h-4"></i></span>
      <span>${label}</span>
    </label>
    ${toggleHtml}
  </div>`;
}

function clearDiarBranchValues(wrapEl) {
  if (!wrapEl) return;
  wrapEl.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(inp => {
    inp.checked = false;
  });
  wrapEl.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach(inp => {
    inp.value = '';
  });
}

function uncheckDiarNone(noneId, noneVal) {
  const noneEl = noneId ? getDiarEl(noneId) : null;
  if (noneEl && noneEl.checked) noneEl.checked = false;
  if (noneVal) {
    queryDiarAll(`input[value="${noneVal}"]`).forEach(el => { el.checked = false; });
  }
}

// --- Progressive Disclosure & Mutual Exclusion Handlers ---
function handleDiarrheaStoolConsistencyChange(val) {
  const wrap = getDiarEl('diarrheaOtherStoolWrap');
  if (!wrap) return;
  if (val === 'other') {
    wrap.classList.remove('hidden');
  } else {
    wrap.classList.add('hidden');
    const inp = getDiarEl('diarrheaStoolOtherText');
    if (inp) inp.value = '';
  }
}

function handleDiarrheaAbdpainChange(val) {
  const wrap = getDiarEl('diarrheaAbdpainWrap');
  if (!wrap) return;
  if (val === 'yes') {
    wrap.classList.remove('hidden');
  } else {
    wrap.classList.add('hidden');
    clearDiarBranchValues(wrap);
  }
}

function handleDiarrheaVomitToggle(el) {
  const isChecked = el ? el.checked : (getDiarEl('diarrhea_vomit_cb')?.checked || false);
  const wrap = getDiarEl('diarrheaVomitDetailWrap');
  if (!wrap) return;
  if (isChecked) {
    wrap.classList.remove('hidden');
  } else {
    wrap.classList.add('hidden');
    clearDiarBranchValues(wrap);
  }
}

function handleDiarrheaDehydrationNoneToggle(el) {
  if (el && el.checked) {
    queryDiarAll('input[name="diarrheaDehydrationSigns"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleDiarrheaDehydrationItemChange(el) {
  if (el && el.checked) uncheckDiarNone('diarrheaDehydrationNoneCb', 'none_dehydration');
}

function handleDiarrheaSystemicNoneToggle(el) {
  if (el && el.checked) {
    queryDiarAll('input[name="diarrheaSystemicSigns"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleDiarrheaSystemicItemChange(el) {
  if (el && el.checked) uncheckDiarNone('diarrheaSystemicNoneCb', 'none_systemic');
}

function handleDiarrheaFoodRiskNoneToggle(el) {
  if (el && el.checked) {
    queryDiarAll('input[name="diarrheaFoodRisks"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleDiarrheaFoodRiskItemChange(el) {
  if (el && el.checked) uncheckDiarNone('diarrheaFoodRiskNoneCb', 'none_food_risk');
}

function handleDiarrheaSharedMealChange(val) {
  const wrap = getDiarEl('diarrheaOutbreakWrap');
  if (!wrap) return;
  if (val === 'outbreak_multiple') {
    wrap.classList.remove('hidden');
  } else {
    wrap.classList.add('hidden');
    const inp = getDiarEl('diarrheaOutbreakDetails');
    if (inp) inp.value = '';
  }
}

function handleDiarrheaAbxChange(val) {
  const wrap = getDiarEl('diarrheaAbxWrap');
  if (!wrap) return;
  if (val === 'recent_abx_yes') {
    wrap.classList.remove('hidden');
  } else {
    wrap.classList.add('hidden');
    const inp = getDiarEl('diarrheaAbxDetails');
    if (inp) inp.value = '';
  }
}

function handleDiarrheaTravelToggle(el) {
  const isChecked = el ? el.checked : (getDiarEl('diarrhea_travel_cb')?.checked || false);
  const wrap = getDiarEl('diarrheaTravelWrap');
  if (!wrap) return;
  if (isChecked) {
    wrap.classList.remove('hidden');
  } else {
    wrap.classList.add('hidden');
    const inp = getDiarEl('diarrheaTravelDetails');
    if (inp) inp.value = '';
  }
}

function handleDiarrheaLmpStatusChange(val) {
  const wrap = getDiarEl('diarrhea_lmp_date_wrap');
  if (!wrap) return;
  if (val === 'regular_lmp_exact') {
    wrap.classList.remove('hidden');
  } else {
    wrap.classList.add('hidden');
    const inp = getDiarEl('diarrheaLmpDate');
    if (inp) inp.value = '';
  }
}

// --- Red Flag Evaluator (All 8 Criteria Preserved) ---
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
      risk: 'ผู้ป่วยมีอาการหน้ามืดเป็นลม มือเท้าเย็นชืด ปัสสาวะไม่ออกนานเกิน 6–8 ชม. หรือถ่ายต่อเนื่องรุนแรงโดยดื่มน้ำชดเชยไม่ได้ ต้องเปิดเส้น IV โหลด 0.9% NSS / Acetar ทันที'
    });
  }

  // 2. Severe Watery Diarrhea / Cholera-like Illness
  const isRiceWater = stoolChar === 'rice_water';
  const isProfuseWatery = (stoolFreq === 'freq_gt_10' && stoolVol === 'profuse_gush');
  if (isRiceWater || isProfuseWatery) {
    flags.push({
      key: 'diarrhea_rf_cholera_like',
      textTh: 'สงสัยภาวะอหิวาตกโรคหรือถ่ายเป็นน้ำรุนแรงเฉียบพลัน (Severe Watery / Cholera-like Diarrhea)',
      risk: 'ถ่ายเป็นน้ำซาวข้าวใสปริมาณมหาศาล ไหลพุ่งตลอดเวลา เสี่ยงต่อภาวะช็อกและเกลือแร่ต่ำอย่างรวดเร็ว ต้องชดเชยสารน้ำปริมาณสูงและส่งตรวจ Vibrio culture'
    });
  }

  // 3. Invasive Dysentery / Sepsis Risk
  const isMucousBloody = stoolChar === 'mucous_bloody';
  const isTenesmusFever = (painChar === 'tenesmus' && systemic.includes('fever_chills'));
  if (isMucousBloody || isTenesmusFever) {
    flags.push({
      key: 'diarrhea_rf_invasive_dysentery',
      textTh: 'สงสัยบิดติดเชื้อแบคทีเรียรุกรานและภาวะติดเชื้อในกระแสเลือด (Invasive Dysentery / Sepsis Risk)',
      risk: 'ถ่ายมีมูกปนเลือดสด/หนอง ร่วมกับมีไข้หนาวสั่นหรือปวดเบ่งทวารรุนแรง เสี่ยงลำไส้อักเสบทะลุและ Sepsis ต้องส่ง Hemoculture, Stool C/S และหลีกเลี่ยง Loperamide'
    });
  }

  // 4. Clostridioides difficile Colitis
  const hasAbxHistory = abxUse === 'recent_abx_yes';
  const hasFreqOrFever = (stoolFreq === 'freq_4_6' || stoolFreq === 'freq_7_10' || stoolFreq === 'freq_gt_10' || systemic.includes('fever_chills'));
  if (hasAbxHistory && hasFreqOrFever) {
    flags.push({
      key: 'diarrhea_rf_cdiff',
      textTh: 'สงสัยลำไส้อักเสบจากการใช้ยาปฏิชีวนะ (Suspected Clostridioides difficile Colitis)',
      risk: 'มีประวัติได้รับยาปฏิชีวนะในช่วง 1–3 เดือน ร่วมกับมีอาการถ่ายเหลว เสี่ยง Pseudomembranous Colitis / Toxic Megacolon ต้องส่ง Stool C. diff Toxin A/B assay'
    });
  }

  // 5. Surgical Abdomen Mimic
  const isRlqPain = (patient.diarrheaHasAbdpain === 'yes' && painLoc === 'rlq');
  const isConstantSeverePain = (patient.diarrheaHasAbdpain === 'yes' && painChar === 'constant_severe');
  if (isRlqPain || isConstantSeverePain) {
    flags.push({
      key: 'diarrhea_rf_surgical_mimic',
      textTh: 'สงสัยภาวะฉุกเฉินทางศัลยกรรมช่องท้องเลียนแบบท้องเสีย (Suspected Pelvic Appendicitis / Acute Abdomen)',
      risk: 'ปวดท้องน้อยขวาเด่น หรือปวดรุนแรงต่อเนื่องสะเทือน ไม่ทุเลาหลังถ่าย อาจเป็นไส้ติ่งอักเสบในอุ้งเชิงกราน ต้อง NPO และปรึกษาศัลยแพทย์ด่วน'
    });
  }

  // 6. Ectopic Pregnancy in Female
  const isFemaleMissed = patient.gender === 'หญิง' && (patient.diarrheaLmpStatus === 'missed_period' || patient.diarrheaFemaleEctopicWarning);
  if (isFemaleMissed && (hasSyncope || painLoc === 'lower_abdomen' || dehy.includes('postural_dizziness'))) {
    flags.push({
      key: 'diarrhea_rf_ectopic',
      textTh: 'สงสัยภาวะตั้งครรภ์นอกมดลูกแตก (Suspected Ruptured Ectopic Pregnancy)',
      risk: 'สตรีวัยเจริญพันธุ์ขาดประจำเดือน มีปวดหน่วงท้องน้อย ร่วมกับหน้ามืดเป็นลม ต้องตรวจ Urine Pregnancy Test (UPT) และปรึกษาสูตินรีแพทย์ด่วน'
    });
  }

  // 7. Food Poisoning Outbreak
  if (patient.diarrheaSharedMeal === 'outbreak_multiple') {
    flags.push({
      key: 'diarrhea_rf_food_outbreak',
      textTh: `ประวัติอาหารเป็นพิษระบาดเป็นกลุ่มก้อน (Food Poisoning Outbreak)${patient.diarrheaOutbreakDetails ? `: [${patient.diarrheaOutbreakDetails}]` : ''}`,
      risk: 'มีผู้ร่วมรับประทานอาหารป่วยพร้อมกันหลายราย เสี่ยงต่อการระบาดของเชื้อก่อโรคทางเดินอาหาร ต้องรายงานทีมระบาดวิทยา'
    });
  }

  // 8. Wild Toxin / Mushroom Poisoning
  if (foodRisks.includes('wild_mushroom_plant')) {
    flags.push({
      key: 'diarrhea_rf_wild_toxin',
      textTh: 'ประวัติรับประทานเห็ดป่า พืชแปลก หรืออาหารป่า (Suspected Natural Botanical / Mushroom Poisoning)',
      risk: 'เสี่ยงต่อสารพิษชีวภาพทำลายตับไตเฉียบพลัน ต้องตรวจ LFTs, Coagulation และปรึกษาศูนย์พิษวิทยารามาธิบดี (สายด่วน 1367)'
    });
  }

  return flags;
}

function isDiarrheaRedFlag(patient) {
  if (!patient) return false;
  return evaluateDiarrheaRedFlags(patient).length > 0;
}

// --- Output Rendering Helpers (Zero 🚩 & Zero Raw Enums Outside Red Flags) ---
function formatDiarrheaOutputBundle(patient) {
  const unitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durationText = patient.durationVal
    ? `${patient.durationVal} ${unitMap[patient.durationUnit] || 'ชั่วโมง'}`
    : 'ไม่ระบุระยะเวลา';

  const onsetMap = {
    sudden_severe: 'เกิดขึ้นเฉียบพลันทันที',
    gradual_worsening: 'ค่อยๆ ถ่ายบ่อยหรือเยอะขึ้นเรื่อยๆ',
    chronic_recurrent: 'เป็นๆ หายๆ ต่อเนื่อง'
  };
  const freqMap = {
    freq_1_3: '1–3 ครั้ง/24 ชม.',
    freq_4_6: '4–6 ครั้ง/24 ชม.',
    freq_7_10: '7–10 ครั้ง/24 ชม.',
    freq_gt_10: 'มากกว่า 10 ครั้งขึ้นไป/ถ่ายตลอดเวลา'
  };
  const volMap = {
    profuse_gush: 'ปริมาณมาก (ถ่ายพุ่งเต็มโถส้วม)',
    moderate: 'ปริมาณปานกลาง (~1 แก้ว)',
    scant_frequent: 'ปริมาณน้อยกะปริดกะปรอย'
  };
  const stoolCharMap = {
    rice_water: 'ถ่ายเป็นน้ำใส/น้ำซาวข้าวไม่มีเนื้อปน',
    loose_mushy: 'ถ่ายเหลวเละๆ ปนน้ำ',
    mucus_noblood: 'ถ่ายเป็นมูกใส/มูกขุ่นไม่มีเลือด',
    mucous_bloody: 'ถ่ายมีมูกปนเลือดสดหรือปนหนอง',
    black_tarry_melena: 'ถ่ายเหลวสีดำคล้ำเหนียวคล้ายยางมะตอย',
    other: patient.diarrheaStoolOtherText ? `อื่นๆ (${patient.diarrheaStoolOtherText})` : 'ลักษณะอื่นๆ'
  };
  const oralMap = {
    oral_tolerated: 'ดื่มน้ำ จิบเกลือแร่ และทานอาหารเหลวได้',
    oral_intolerant: 'ดื่มน้ำหรือทานอะไรไม่ได้เลย อาเจียนออกหมด'
  };
  const dehyMap = {
    dry_mouth_thirst: 'กระหายน้ำมาก คอแห้ง ปากแห้ง',
    postural_dizziness: 'หน้ามืดวิงเวียนขณะลุกยืน',
    syncope_blackout: 'เป็นลมหรือวูบหมดสติชั่วครู่',
    oliguria_anuria_6h: 'ปัสสาวะออกน้อยสีเข้ม/ไม่ออกเกิน 6–8 ชม.',
    cold_clammy_extremities: 'ปลายมือปลายเท้าเย็น ซีด ตัวเย็นชืด',
    muscle_cramps: 'กล้ามเนื้อเกร็งหรือเป็นตะคริว'
  };
  const systemicMap = {
    fever_chills: 'มีไข้ตัวร้อนหรือหนาวสั่น',
    tachypnea_dyspnea: 'หายใจหอบเร็วหรือเหนื่อยผิดปกติ',
    lethargy_confusion: 'ซึมลง สับสน อ่อนเพลียมาก'
  };
  const foodRiskMap = {
    raw_seafood: 'อาหารทะเลสุกๆ ดิบๆ',
    papaya_salad_raw: 'ส้มตำปลาร้า/ลาบก้อยดิบ',
    coconut_milk_overnight: 'อาหารกะทิ/ขนมจีน/อาหารค้างคืน',
    fermented_canned: 'อาหารหมักดอง/อาหารกระป๋อง',
    untreated_water_ice: 'น้ำดื่ม/น้ำแข็งไม่สะอาด',
    street_food_buffet: 'อาหารตลาดนัด/บุฟเฟต์',
    wild_mushroom_plant: 'อาหารป่า/เห็ดแปลก/พืชที่ไม่คุ้นเคย'
  };
  const abdpainLocMap = {
    periumbilical: 'รอบสะดือ',
    lower_abdomen: 'ท้องน้อยส่วนล่าง',
    rlq: 'ท้องน้อยขวาเป็นหลัก',
    diffuse: 'ทั่วทั้งท้อง'
  };
  const abdpainCharMap = {
    crampy_colicky: 'ปวดบิดเกร็งทุเลาหลังถ่าย',
    tenesmus: 'ปวดเบ่งลึกที่ทวารหนักตลอดเวลา',
    dull_tight: 'ปวดตื้อแน่นทั่วท้อง',
    constant_severe: 'ปวดรุนแรงตลอดเวลา ขยับแล้วเจ็บสะเทือน'
  };
  const vomitCharMap = {
    food: 'เศษอาหาร',
    juice: 'น้ำใส/น้ำย่อย',
    bile_green: 'น้ำดีสีเขียว',
    blood_vomit: 'มีเลือดปน'
  };
  const lmpMap = {
    regular_lmp_exact: `ประจำเดือนมาปกติ (LMP: ${patient.diarrheaLmpDate || 'ไม่ระบุ'})`,
    missed_period: 'ขาดประจำเดือน / สงสัยตั้งครรภ์',
    irregular_unsure: 'ประจำเดือนมาไม่สม่ำเสมอ / จำวันไม่ได้',
    menopause_hysterectomy: 'หมดประจำเดือนแล้ว / ผ่าตัดมดลูกแล้ว'
  };

  const dehyRaw = Array.isArray(patient.diarrheaDehydrationSigns) ? patient.diarrheaDehydrationSigns : [];
  const dehyList = dehyRaw.filter(k => k !== 'none_dehydration').map(k => dehyMap[k]).filter(Boolean);
  const sysRaw = Array.isArray(patient.diarrheaSystemicSigns) ? patient.diarrheaSystemicSigns : [];
  const sysList = sysRaw.filter(k => k !== 'none_systemic').map(k => systemicMap[k]).filter(Boolean);
  const foodRaw = Array.isArray(patient.diarrheaFoodRisks) ? patient.diarrheaFoodRisks : [];
  const foodList = foodRaw.filter(k => k !== 'none_food_risk').map(k => foodRiskMap[k]).filter(Boolean);

  // Pertinent Positives (Zero 🚩)
  const rapidPositives = [];
  if (patient.diarrheaNausea && patient.diarrheaVomit) {
    const vChar = vomitCharMap[patient.diarrheaVomitChar] ? ` (${vomitCharMap[patient.diarrheaVomitChar]})` : '';
    rapidPositives.push(`คลื่นไส้และอาเจียน${patient.diarrheaVomitFreq ? ` ${patient.diarrheaVomitFreq} ครั้ง/วัน` : ''}${vChar}`);
  } else if (patient.diarrheaVomit) {
    const vChar = vomitCharMap[patient.diarrheaVomitChar] ? ` (${vomitCharMap[patient.diarrheaVomitChar]})` : '';
    rapidPositives.push(`อาเจียนร่วมด้วย${patient.diarrheaVomitFreq ? ` ${patient.diarrheaVomitFreq} ครั้ง/วัน` : ''}${vChar}`);
  } else if (patient.diarrheaNausea) {
    rapidPositives.push('คลื่นไส้ พะอืดพะอม');
  }
  if (patient.diarrheaBloating) rapidPositives.push('ท้องอืดแน่น มีลมในท้อง');
  if (patient.diarrheaAnusBurning) rapidPositives.push('แสบร้อนบริเวณทวารหนักหลังถ่าย');
  if (patient.diarrheaOralTolerance === 'oral_intolerant') {
    rapidPositives.push('ดื่มน้ำหรือทานอาหารไม่ได้ อาเจียนออกหมด');
  }
  dehyList.forEach(d => rapidPositives.push(d));
  sysList.forEach(s => rapidPositives.push(s));
  if (foodList.length > 0) rapidPositives.push(`รับประทานอาหารเสี่ยง: ${foodList.join(', ')}`);
  if (patient.diarrheaSharedMeal === 'outbreak_multiple') {
    rapidPositives.push(`ผู้ร่วมมื้ออาหารป่วยคล้ายกัน${patient.diarrheaOutbreakDetails ? `: ${patient.diarrheaOutbreakDetails}` : ''}`);
  }
  if (patient.diarrheaRecentAbx === 'recent_abx_yes') {
    rapidPositives.push(`ประวัติใช้ยาปฏิชีวนะใน 1–3 เดือน${patient.diarrheaAbxDetails ? `: ${patient.diarrheaAbxDetails}` : ''}`);
  }
  if (patient.diarrheaTravel) {
    rapidPositives.push(`ประวัติเดินทางต่างถิ่น${patient.diarrheaTravelDetails ? `: ${patient.diarrheaTravelDetails}` : ''}`);
  }
  if (patient.gender === 'หญิง' && patient.diarrheaLmpStatus && lmpMap[patient.diarrheaLmpStatus]) {
    rapidPositives.push(`ข้อมูลสตรี: ${lmpMap[patient.diarrheaLmpStatus]}`);
  }
  if (patient.gender === 'หญิง' && patient.diarrheaFemaleEctopicWarning) {
    rapidPositives.push('ปวดหน่วงท้องน้อยหรือหน้ามืดร่วมกับขาดประจำเดือน');
  }
  if (patient.otherSymptomsFree) rapidPositives.push(`อื่นๆ: ${patient.otherSymptomsFree}`);

  // Pertinent Negatives (Strictly explicit patient denials)
  const negatives = [];
  if (patient.diarrheaStoolConsistency && patient.diarrheaStoolConsistency !== 'mucous_bloody' && patient.diarrheaStoolConsistency !== 'black_tarry_melena') {
    negatives.push('ปฏิเสธถ่ายเป็นมูกเลือดสดและถ่ายดำยางมะตอย');
  }
  if (patient.diarrheaHasAbdpain === 'no') negatives.push('ปฏิเสธอาการปวดท้อง');
  if (patient.diarrheaHasAbdpain === 'yes' || patient.diarrheaHasAbdpain === 'no' || patient.diarrheaNausea || patient.diarrheaVomit) {
    if (!patient.diarrheaNausea && !patient.diarrheaVomit) negatives.push('ไม่มีคลื่นไส้อาเจียน');
    else if (!patient.diarrheaVomit) negatives.push('ไม่มีอาการอาเจียน');
  }
  if (patient.diarrheaOralTolerance === 'oral_tolerated') negatives.push('ยังสามารถดื่มน้ำและจิบเกลือแร่ได้');
  if (dehyRaw.includes('none_dehydration')) {
    negatives.push('ปฏิเสธอาการหน้ามืด วูบ มือเท้าเย็น หรือปัสสาวะออกน้อย');
  } else if (dehyRaw.length > 0) {
    if (!dehyRaw.includes('syncope_blackout') && !dehyRaw.includes('cold_clammy_extremities')) negatives.push('ไม่มีวูบหมดสติหรือมือเท้าเย็น');
    if (!dehyRaw.includes('oliguria_anuria_6h')) negatives.push('ปัสสาวะออกปกติ');
  }
  if (sysRaw.includes('none_systemic')) {
    negatives.push('ปฏิเสธไข้หนาวสั่น หายใจหอบเหนื่อย หรือซึมลง');
  } else if (sysRaw.length > 0 && !sysRaw.includes('fever_chills')) {
    negatives.push('ปฏิเสธไข้หนาวสั่น');
  }
  if (foodRaw.includes('none_food_risk')) negatives.push('ปฏิเสธรับประทานอาหารกลุ่มเสี่ยงชัดเจน');
  if (patient.diarrheaRecentAbx === 'recent_abx_no') negatives.push('ปฏิเสธประวัติใช้ยาปฏิชีวนะใน 1–3 เดือนก่อนหน้า');

  patient.pertinentPositives = rapidPositives;
  patient.pertinentNegatives = negatives;

  const redFlags = evaluateDiarrheaRedFlags(patient);
  patient.redFlags = redFlags;

  const hospLabel = {
    self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
    has_history: 'มีประวัติการรักษาเดิมที่ รพ.ราชบุรี',
    first_time: 'มารับการรักษาที่ รพ.ราชบุรี ครั้งแรก'
  }[patient.hospRecordStatus] || 'ไม่ได้ระบุ';

  const udArr = Array.isArray(patient.underlying)
    ? patient.underlying.filter(u => u && !u.includes('ปฏิเสธ') && u !== 'ไม่มี' && u !== 'ไม่มีโรคประจำตัว')
    : [];
  const udExplicitDeny = Array.isArray(patient.underlying) && patient.underlying.some(u => u && u.includes('ปฏิเสธ'));
  const udText = udArr.length > 0 ? udArr.join(', ') : ((patient.hospRecordStatus === 'self' || udExplicitDeny) ? 'ปฏิเสธ' : 'ไม่ได้ระบุ');
  const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ') ? 'ไม่ได้ระบุ' : patient.currentMeds;
  const allergyText = (!patient.drugAllergy || patient.drugAllergy === 'ไม่ได้ระบุ') ? 'ไม่ได้ระบุ' : patient.drugAllergy;
  const docNotes = patient.doctor_notes || {};

  const stoolLabel = stoolCharMap[patient.diarrheaStoolConsistency] || 'ไม่ได้ระบุ';
  const onsetLabel = onsetMap[patient.diarrheaOnsetMode] || 'ไม่ได้ระบุ';
  const freqLabel = freqMap[patient.diarrheaFrequency24h] || 'ไม่ได้ระบุ';
  const volLabel = volMap[patient.diarrheaVolumePerTime] || 'ไม่ได้ระบุ';
  const abdpainLine = patient.diarrheaHasAbdpain === 'yes'
    ? `• อาการปวดท้อง: ${abdpainCharMap[patient.diarrheaAbdpainChar] || 'ปวดท้อง'}${abdpainLocMap[patient.diarrheaAbdpainLoc] ? ` บริเวณ${abdpainLocMap[patient.diarrheaAbdpainLoc]}` : ''}\n`
    : '';

  const defaultRapid = [
    `[Chief Complaint (CC)]`,
    `ท้องเสีย / ถ่ายเหลว / ถ่ายเป็นน้ำ (Acute Diarrhea) มา ${durationText}`,
    ``,
    `[History of Present Illness (HPI)]`,
    `• ลักษณะอุจจาระ: ${stoolLabel}`,
    `• การเริ่มต้นและความถี่: ${onsetLabel}, ความถี่: ${freqLabel}`,
    `• ปริมาณต่อครั้ง: ${volLabel}`,
    abdpainLine ? abdpainLine.trimEnd() : null,
    `• Pertinent Positives:`,
    rapidPositives.length > 0 ? rapidPositives.map(p => `  - ${p}`).join('\n') : '  - ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม',
    ``,
    `• Pertinent Negatives:`,
    negatives.length > 0 ? negatives.map(n => `  - ${n}`).join('\n') : '  - ยังไม่มีคำตอบปฏิเสธเฉพาะในหมวดอาการร่วม',
    ``,
    `[Past Medical History & Medications]`,
    `• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}`,
    `• โรคประจำตัว (U/D): ${udText}`,
    `• ยาประจำตัว (Current Meds): ${medsText}`,
    `• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${allergyText}`,
    ``,
    `[Emergency Risk Assessment (Red Flags)]`,
    redFlags.length > 0
      ? `🚩 RED FLAGS DETECTED:\n${redFlags.map(rf => `  * ${rf.textTh}\n    ความเสี่ยง: ${rf.risk}`).join('\n')}`
      : '✓ ไม่พบสัญญาณวิกฤต (No Immediate Red Flag)',
    ``,
    `[Doctor's Clinical Addendum & Exam]`,
    `• ประวัติเพิ่มเติม/แก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}`,
    `• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}`,
    `• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}`,
    `• แผนการรักษา (Plan/Orders): ${docNotes.plan || '-'}`
  ].filter(line => line !== null).join('\n');

  const genderLabel = (patient.gender && patient.gender !== 'ไม่ระบุ') ? patient.gender : '';
  let defaultNarrative = `ผู้ป่วย${genderLabel} อายุ ${patient.age || 'ไม่ได้ระบุ'} ปี มาด้วยอาการท้องเสีย / ถ่ายเหลว / ถ่ายเป็นน้ำ มา ${durationText} (${onsetLabel}, ${freqLabel}, ${volLabel}) ลักษณะอุจจาระ: ${stoolLabel}.`;
  if (patient.diarrheaHasAbdpain === 'yes') {
    defaultNarrative += ` มีอาการปวดท้อง ${abdpainCharMap[patient.diarrheaAbdpainChar] || ''}${abdpainLocMap[patient.diarrheaAbdpainLoc] ? ` บริเวณ${abdpainLocMap[patient.diarrheaAbdpainLoc]}` : ''}.`;
  }
  if (rapidPositives.length > 0) defaultNarrative += ` อาการร่วมและปัจจัยเสี่ยง: ${rapidPositives.join('; ')}.`;
  if (negatives.length > 0) defaultNarrative += ` อาการปฏิเสธสำคัญ: ${negatives.join(', ')}.`;
  defaultNarrative += `\nประวัติเดิม: ${hospLabel}, โรคประจำตัว: ${udText}, ยาประจำตัว: ${medsText}, แพ้ยา: ${allergyText}.`;
  if (redFlags.length > 0) {
    defaultNarrative += `\n[แจ้งเตือนความเสี่ยงสูง]: ${redFlags.map(rf => rf.textTh).join(', ')}`;
  }

  const jsonPayload = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    encounter: {
      hospital_site: 'Ratchaburi Hospital',
      queue_id: patient.queue_number || '',
      hn: patient.hn || '',
      patient_name: patient.name || '',
      age: patient.age !== undefined ? patient.age : null,
      gender: patient.gender || '',
      timestamp: patient.timestamp || '',
      status: patient.status || 'waiting',
      triage_urgency_flag: redFlags.length > 0,
      red_flags_count: redFlags.length,
      hospital_record_status: patient.hospRecordStatus || ''
    },
    chief_complaint: 'diarrhea',
    chief_complaint_label: 'ท้องเสีย / ถ่ายเหลว / ถ่ายเป็นน้ำ',
    schema_version: '2.1',
    diarrhea_profile: {
      duration: { value: patient.durationVal || null, unit: patient.durationUnit || 'hours' },
      onset_mode: patient.diarrheaOnsetMode || null,
      frequency_24h: patient.diarrheaFrequency24h || null,
      volume_per_time: patient.diarrheaVolumePerTime || null,
      stool_consistency: patient.diarrheaStoolConsistency || null,
      has_mucous_blood: patient.diarrheaStoolConsistency === 'mucous_bloody',
      has_melena: patient.diarrheaStoolConsistency === 'black_tarry_melena',
      oral_tolerance: patient.diarrheaOralTolerance || null,
      abdominal_pain: {
        has_pain: patient.diarrheaHasAbdpain === 'yes' ? true : (patient.diarrheaHasAbdpain === 'no' ? false : null),
        character: patient.diarrheaAbdpainChar || null,
        location: patient.diarrheaAbdpainLoc || null
      },
      associated_gi: {
        nausea: Boolean(patient.diarrheaNausea),
        vomiting: Boolean(patient.diarrheaVomit),
        vomit_frequency: patient.diarrheaVomitFreq || null,
        vomit_character: patient.diarrheaVomitChar || null,
        bloating: Boolean(patient.diarrheaBloating),
        anus_burning: Boolean(patient.diarrheaAnusBurning)
      },
      dehydration_signs: dehyRaw,
      systemic_signs: sysRaw,
      epidemiology: {
        food_risks: foodRaw,
        shared_meal_outbreak: patient.diarrheaSharedMeal === 'outbreak_multiple',
        outbreak_details: patient.diarrheaOutbreakDetails || null,
        travel_history: Boolean(patient.diarrheaTravel),
        travel_details: patient.diarrheaTravelDetails || null,
        recent_antibiotic_use: patient.diarrheaRecentAbx === 'recent_abx_yes' ? true : (patient.diarrheaRecentAbx === 'recent_abx_no' ? false : null),
        antibiotic_details: patient.diarrheaAbxDetails || null
      },
      female_reproductive: {
        is_female: patient.gender === 'หญิง',
        lmp_status: patient.diarrheaLmpStatus || null,
        lmp_date: patient.diarrheaLmpDate || null,
        ectopic_warning: Boolean(patient.diarrheaFemaleEctopicWarning)
      },
      other_symptoms_free: patient.otherSymptomsFree || ''
    },
    clinical_summary: {
      pertinent_positives: rapidPositives,
      pertinent_negatives: negatives,
      red_flags: redFlags.map(rf => ({
        code: rf.key,
        text_th: rf.textTh,
        risk_rationale: rf.risk
      }))
    },
    doctor_clinical_addendum: {
      additional_hpi: docNotes.additional_hpi || '',
      physical_exam: docNotes.physical_exam || '',
      preliminary_dx: docNotes.preliminary_dx || '',
      plan: docNotes.plan || ''
    }
  };

  return { defaultRapid, defaultNarrative, jsonPayload };
}

function updateDiarrheaOutputs(patient) {
  if (!patient) return { rapid: '', narrative: '', json: null };
  const { defaultRapid, defaultNarrative, jsonPayload } = formatDiarrheaOutputBundle(patient);
  const finalRapid = patient.custom_rapid_note || defaultRapid;
  const finalNarrative = patient.custom_narrative_note || defaultNarrative;
  patient.rapidHpi = finalRapid;
  patient.narrativeHpi = finalNarrative;
  patient.medicalJson = jsonPayload;

  if (typeof document !== 'undefined') {
    const rapidView = getDiarEl('rapidTextView');
    const narrativeView = getDiarEl('narrativeTextView');
    const jsonView = getDiarEl('jsonViewer');
    if (rapidView) rapidView.value = finalRapid;
    if (narrativeView) narrativeView.value = finalNarrative;
    if (jsonView) jsonView.textContent = JSON.stringify(jsonPayload, null, 2);
  }
  return { rapid: finalRapid, narrative: finalNarrative, json: jsonPayload };
}

// --- Patient Form HTML Builder ---
function buildDiarrheaFormHtml() {
  return `
    <div id="diarrheaQuestionnaireSection" class="hidden space-y-6">
      <div data-cc-top-banner="diarrhea">
        <div class="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-3 shadow-sm">
          <i data-lucide="alert-triangle" class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"></i>
          <div class="text-xs sm:text-sm text-amber-900 leading-relaxed">
            <span class="font-bold block mb-0.5">คำแนะนำจากจุดคัดกรองฉุกเฉิน:</span>
            หากท่านมีอาการ <strong>ถ่ายเป็นมูกเลือดสดปริมาณมาก</strong> หรือ <strong>ถ่ายอุจจาระสีดำเหนียวคล้ายยางมะตอย</strong> เป็นอาการเด่น โปรดแจ้งพยาบาลคัดกรองทันที หรือสลับไปบันทึกในกลุ่มอาการ <strong>อาเจียนเป็นเลือด / ถ่ายดำ / ถ่ายเป็นเลือดสด</strong>
          </div>
        </div>
      </div>

      <!-- Card 1: Duration, Onset, Frequency & Stool Characteristics -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
        <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="droplets" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">1. ระยะเวลา ความถี่ และลักษณะของอุจจาระ</h2>
            <p class="text-xs text-slate-500">ประเมินปริมาณการสูญเสียสารน้ำและคัดกรองลักษณะบิดหรือถ่ายเป็นเลือด</p>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-800 mb-1.5">เริ่มมีอาการถ่ายเหลวมานานเท่าไรแล้ว</label>
            <div class="flex items-center gap-2 max-w-sm">
              <input type="number" id="diarrheaDurationVal" min="1" max="999" placeholder="เช่น 8" class="w-24 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500">
              <select id="diarrheaDurationUnit" class="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
                <option value="minutes">นาที</option>
                <option value="hours" selected>ชั่วโมง</option>
                <option value="days">วัน</option>
                <option value="weeks">สัปดาห์</option>
                <option value="months">เดือน</option>
                <option value="years">ปี</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-800 mb-1.5">รูปแบบการเริ่มต้น</label>
            ${renderDiarGrid('grid-cols-1 sm:grid-cols-3', [
              { kind: 'radio', name: 'diarrheaOnsetMode', value: 'sudden_severe', title: ['เกิดขึ้นเฉียบพลัน', 'ทันที'], compact: true },
              { kind: 'radio', name: 'diarrheaOnsetMode', value: 'gradual_worsening', title: ['ค่อยๆ ถ่ายบ่อยขึ้น'], compact: true },
              { kind: 'radio', name: 'diarrheaOnsetMode', value: 'chronic_recurrent', title: ['เป็นๆ หายๆ ต่อเนื่อง'], compact: true }
            ])}
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-800 mb-1.5">จำนวนครั้งในรอบ 24 ชั่วโมง</label>
            ${renderDiarGrid('grid-cols-2 sm:grid-cols-4', [
              { kind: 'radio', name: 'diarrheaFrequency24h', value: 'freq_1_3', title: ['1–3 ครั้ง'], compact: true },
              { kind: 'radio', name: 'diarrheaFrequency24h', value: 'freq_4_6', title: ['4–6 ครั้ง'], compact: true },
              { kind: 'radio', name: 'diarrheaFrequency24h', value: 'freq_7_10', title: ['7–10 ครั้ง'], compact: true },
              { kind: 'radio', name: 'diarrheaFrequency24h', value: 'freq_gt_10', title: ['>10 ครั้ง / ตลอดเวลา'], compact: true }
            ])}
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-800 mb-1.5">ปริมาณต่อครั้ง</label>
            ${renderDiarGrid('grid-cols-1 sm:grid-cols-3', [
              { kind: 'radio', name: 'diarrheaVolumePerTime', value: 'profuse_gush', title: ['มาก (ไหลพุ่งเต็มโถ)'], compact: true },
              { kind: 'radio', name: 'diarrheaVolumePerTime', value: 'moderate', title: ['ปานกลาง (1 แก้วน้ำ)'], compact: true },
              { kind: 'radio', name: 'diarrheaVolumePerTime', value: 'scant_frequent', title: ['น้อย (กะปริดกะปรอย)'], compact: true }
            ])}
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100">
          ${renderDiarSysHeader({ label: '1.1 ลักษณะเด่นของอุจจาระ', icon: 'search', colorClass: 'bg-amber-100 text-amber-700' })}
          ${renderDiarGrid('grid-cols-1 sm:grid-cols-2', [
            { kind: 'radio', name: 'diarrheaStoolConsistency', value: 'rice_water', title: ['น้ำเหลวใส', '/ น้ำซาวข้าวใส'], onchange: 'handleDiarrheaStoolConsistencyChange(this.value)', compact: true },
            { kind: 'radio', name: 'diarrheaStoolConsistency', value: 'loose_mushy', title: ['ถ่ายเหลว', 'เป็นเนื้อเละปนน้ำ'], onchange: 'handleDiarrheaStoolConsistencyChange(this.value)', compact: true },
            { kind: 'radio', name: 'diarrheaStoolConsistency', value: 'mucus_noblood', title: ['มูกเหนียวใส/ขุ่น', 'ไม่มีเลือด'], onchange: 'handleDiarrheaStoolConsistencyChange(this.value)', compact: true },
            { kind: 'radio', name: 'diarrheaStoolConsistency', value: 'mucous_bloody', title: ['มูกปนเลือดสด', 'หรือปนหนอง'], onchange: 'handleDiarrheaStoolConsistencyChange(this.value)', compact: true },
            { kind: 'radio', name: 'diarrheaStoolConsistency', value: 'black_tarry_melena', title: ['สีดำคล้ำเหนียว', 'คล้ายยางมะตอย'], onchange: 'handleDiarrheaStoolConsistencyChange(this.value)', compact: true },
            { kind: 'radio', name: 'diarrheaStoolConsistency', value: 'other', title: ['ลักษณะอื่นๆ (ระบุ)'], onchange: 'handleDiarrheaStoolConsistencyChange(this.value)', compact: true }
          ])}
          <div id="diarrheaOtherStoolWrap" class="hidden mt-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <label class="block text-xs font-semibold text-slate-700 mb-1">ระบุลักษณะอุจจาระเพิ่มเติม</label>
            <input type="text" id="diarrheaStoolOtherText" placeholder="เช่น สีเขียว กลิ่นเปรี้ยว หรือมีฟองมาก" class="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
          </div>
        </div>
      </div>

      <!-- Card 2: Abdominal Pain & Associated GI Symptoms -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
        <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="utensils" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">2. อาการปวดท้องและอาการทางเดินอาหารร่วม</h2>
            <p class="text-xs text-slate-500">คัดกรองอาการปวดเกร็ง ปวดเบ่งทวาร คลื่นไส้อาเจียน และภาวะฉุกเฉินในช่องท้อง</p>
          </div>
        </div>

        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          ${renderDiarSysHeader({ label: '2.1 มีอาการปวดท้องร่วมด้วยหรือไม่', icon: 'activity', colorClass: 'bg-blue-100 text-blue-700' })}
          ${renderDiarGrid('grid-cols-1 sm:grid-cols-2', [
            { kind: 'radio', name: 'diarrheaHasAbdpain', value: 'no', title: ['ไม่มีอาการปวดท้อง'], onchange: 'handleDiarrheaAbdpainChange(this.value)', compact: true },
            { kind: 'radio', name: 'diarrheaHasAbdpain', value: 'yes', title: ['มีอาการปวดท้อง', 'ร่วมด้วย'], onchange: 'handleDiarrheaAbdpainChange(this.value)', compact: true }
          ])}
          <div id="diarrheaAbdpainWrap" class="hidden mt-3 pt-3 border-t border-slate-200 space-y-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">ลักษณะอาการปวดท้อง</label>
              ${renderDiarGrid('grid-cols-1 sm:grid-cols-2', [
                { kind: 'radio', name: 'diarrheaAbdpainChar', value: 'crampy_colicky', title: ['ปวดบิดเกร็ง', 'ทุเลาหลังถ่าย'], compact: true },
                { kind: 'radio', name: 'diarrheaAbdpainChar', value: 'tenesmus', title: ['ปวดเบ่งที่ทวารหนัก', 'เหมือนถ่ายไม่สุด'], compact: true },
                { kind: 'radio', name: 'diarrheaAbdpainChar', value: 'dull_tight', title: ['ปวดตื้อแน่นทั่วท้อง'], compact: true },
                { kind: 'radio', name: 'diarrheaAbdpainChar', value: 'constant_severe', title: ['ปวดรุนแรงตลอดเวลา', 'ขยับตัวสะเทือน'], compact: true }
              ])}
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">ตำแหน่งที่ปวดเด่นชัด</label>
              ${renderDiarGrid('grid-cols-2 sm:grid-cols-4', [
                { kind: 'radio', name: 'diarrheaAbdpainLoc', value: 'periumbilical', title: ['รอบสะดือ'], compact: true },
                { kind: 'radio', name: 'diarrheaAbdpainLoc', value: 'lower_abdomen', title: ['ท้องน้อยส่วนล่าง'], compact: true },
                { kind: 'radio', name: 'diarrheaAbdpainLoc', value: 'rlq', title: ['ท้องน้อยด้านขวา'], compact: true },
                { kind: 'radio', name: 'diarrheaAbdpainLoc', value: 'diffuse', title: ['ทั่วทั้งท้อง'], compact: true }
              ])}
            </div>
          </div>
        </div>

        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          ${renderDiarSysHeader({ label: '2.2 อาการทางเดินอาหารร่วมอื่นๆ (เลือกได้หลายข้อ)', icon: 'list-checks', colorClass: 'bg-teal-100 text-teal-700' })}
          ${renderDiarGrid('grid-cols-1 sm:grid-cols-2', [
            { id: 'diarrhea_nausea_cb', title: ['คลื่นไส้ พะอืดพะอม'], compact: true },
            { id: 'diarrhea_vomit_cb', title: ['อาเจียนร่วมด้วย'], onchange: 'handleDiarrheaVomitToggle(this)', compact: true },
            { id: 'diarrhea_bloating_cb', title: ['ท้องอืดแน่น', 'มีลมในท้อง'], compact: true },
            { id: 'diarrhea_anus_burning_cb', title: ['แสบร้อนบริเวณ', 'ทวารหนัก'], compact: true }
          ])}
          <div id="diarrheaVomitDetailWrap" class="hidden mt-3 pt-3 border-t border-slate-200 space-y-2.5">
            <div class="flex flex-wrap items-center gap-2">
              <label class="text-xs font-semibold text-slate-700">จำนวนครั้งที่อาเจียนวันนี้:</label>
              <input type="number" id="diarrheaVomitFreq" min="1" max="50" placeholder="เช่น 3" class="w-20 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500">
              <span class="text-xs text-slate-500">ครั้ง/วัน</span>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">ลักษณะสิ่งที่อาเจียน</label>
              ${renderDiarGrid('grid-cols-2 sm:grid-cols-4', [
                { kind: 'radio', name: 'diarrheaVomitChar', value: 'food', title: ['เศษอาหาร'], compact: true },
                { kind: 'radio', name: 'diarrheaVomitChar', value: 'juice', title: ['น้ำใส / น้ำย่อย'], compact: true },
                { kind: 'radio', name: 'diarrheaVomitChar', value: 'bile_green', title: ['น้ำดีสีเขียว'], compact: true },
                { kind: 'radio', name: 'diarrheaVomitChar', value: 'blood_vomit', title: ['มีเลือดปน'], compact: true }
              ])}
            </div>
          </div>
        </div>
      </div>

      <!-- Card 3: Oral Tolerance, Dehydration & Systemic Signs -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
        <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div class="bg-red-100 text-red-700 p-2 rounded-xl"><i data-lucide="shield-alert" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">3. การดื่มน้ำ ภาวะขาดน้ำ และสัญญาณติดเชื้อ</h2>
            <p class="text-xs text-slate-500">ประเมินความสามารถในการชดเชยสารน้ำทางปากและสัญญาณอันตรายฉุกเฉิน</p>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-800 mb-1.5">ความสามารถในการดื่มน้ำและจิบเกลือแร่</label>
          ${renderDiarGrid('grid-cols-1 sm:grid-cols-2', [
            { kind: 'radio', name: 'diarrheaOralTolerance', value: 'oral_tolerated', title: ['ดื่มน้ำ/เกลือแร่', 'และทานอาหารเหลวได้'], compact: true },
            { kind: 'radio', name: 'diarrheaOralTolerance', value: 'oral_intolerant', title: ['ดื่มน้ำไม่ได้เลย', 'อาเจียนออกหมด'], compact: true }
          ])}
        </div>

        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          ${renderDiarSysHeader({
            label: '3.1 อาการแสดงของภาวะขาดสารน้ำ (เลือกได้หลายข้อ)',
            icon: 'thermometer',
            colorClass: 'bg-rose-100 text-rose-700',
            toggleId: 'diarrheaDehydrationNoneCb',
            toggleLabel: 'ไม่มีอาการในหมวดนี้',
            toggleName: 'diarrheaDehydrationSigns',
            toggleValue: 'none_dehydration',
            toggleOnchange: 'handleDiarrheaDehydrationNoneToggle(this)'
          })}
          ${renderDiarGrid('grid-cols-1 sm:grid-cols-2', [
            { name: 'diarrheaDehydrationSigns', value: 'dry_mouth_thirst', title: ['กระหายน้ำมาก', 'คอแห้ง ปากแห้ง'], onchange: 'handleDiarrheaDehydrationItemChange(this)' },
            { name: 'diarrheaDehydrationSigns', value: 'postural_dizziness', title: ['หน้ามืดวิงเวียน', 'ขณะลุกยืน'], onchange: 'handleDiarrheaDehydrationItemChange(this)' },
            { name: 'diarrheaDehydrationSigns', value: 'syncope_blackout', title: ['เป็นลม หรือวูบหมดสติ'], onchange: 'handleDiarrheaDehydrationItemChange(this)' },
            { name: 'diarrheaDehydrationSigns', value: 'oliguria_anuria_6h', title: ['ปัสสาวะออกน้อย', 'หรือไม่ออก >6–8 ชม.'], onchange: 'handleDiarrheaDehydrationItemChange(this)' },
            { name: 'diarrheaDehydrationSigns', value: 'cold_clammy_extremities', title: ['ปลายมือเท้าเย็น', 'ตัวเย็นชืด ซีด'], onchange: 'handleDiarrheaDehydrationItemChange(this)' },
            { name: 'diarrheaDehydrationSigns', value: 'muscle_cramps', title: ['กล้ามเนื้อเกร็ง', 'หรือเป็นตะคริว'], onchange: 'handleDiarrheaDehydrationItemChange(this)' }
          ])}
        </div>

        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          ${renderDiarSysHeader({
            label: '3.2 สัญญาณการติดเชื้อทั่วร่างกาย (เลือกได้หลายข้อ)',
            icon: 'alert-circle',
            colorClass: 'bg-amber-100 text-amber-700',
            toggleId: 'diarrheaSystemicNoneCb',
            toggleLabel: 'ไม่มีอาการในหมวดนี้',
            toggleName: 'diarrheaSystemicSigns',
            toggleValue: 'none_systemic',
            toggleOnchange: 'handleDiarrheaSystemicNoneToggle(this)'
          })}
          ${renderDiarGrid('grid-cols-1 sm:grid-cols-3', [
            { name: 'diarrheaSystemicSigns', value: 'fever_chills', title: ['มีไข้ ตัวร้อน', 'หรือหนาวสั่น'], onchange: 'handleDiarrheaSystemicItemChange(this)', compact: true },
            { name: 'diarrheaSystemicSigns', value: 'tachypnea_dyspnea', title: ['หายใจหอบเร็ว', 'เหนื่อยผิดปกติ'], onchange: 'handleDiarrheaSystemicItemChange(this)', compact: true },
            { name: 'diarrheaSystemicSigns', value: 'lethargy_confusion', title: ['ซึมลง สับสน', 'อ่อนเพลียมาก'], onchange: 'handleDiarrheaSystemicItemChange(this)', compact: true }
          ])}
        </div>
      </div>

      <!-- Card 4: Epidemiology, Food Risks, Antibiotics & Travel -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
        <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="utensils-crossed" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">4. ประวัติอาหาร การระบาด ยาปฏิชีวนะ และการเดินทาง</h2>
            <p class="text-xs text-slate-500">สืบค้นสาเหตุอาหารเป็นพิษ การระบาดเป็นกลุ่ม และการใช้ยาฆ่าเชื้อ</p>
          </div>
        </div>

        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          ${renderDiarSysHeader({
            label: '4.1 อาหารกลุ่มเสี่ยงใน 24–72 ชั่วโมงที่ผ่านมา',
            icon: 'fish',
            colorClass: 'bg-orange-100 text-orange-700',
            toggleId: 'diarrheaFoodRiskNoneCb',
            toggleLabel: 'ไม่มีในหมวดนี้',
            toggleName: 'diarrheaFoodRisks',
            toggleValue: 'none_food_risk',
            toggleOnchange: 'handleDiarrheaFoodRiskNoneToggle(this)'
          })}
          ${renderDiarGrid('grid-cols-1 sm:grid-cols-2', [
            { name: 'diarrheaFoodRisks', value: 'raw_seafood', title: ['อาหารทะเลสุกๆ ดิบๆ'], desc: 'เช่น หอยนางรม หอยแครง กุ้งแช่น้ำปลา ปูดอง', onchange: 'handleDiarrheaFoodRiskItemChange(this)', compact: true },
            { name: 'diarrheaFoodRisks', value: 'papaya_salad_raw', title: ['ส้มตำปลาร้า', '/ ลาบ ก้อยดิบ'], onchange: 'handleDiarrheaFoodRiskItemChange(this)', compact: true },
            { name: 'diarrheaFoodRisks', value: 'coconut_milk_overnight', title: ['อาหารกะทิ ขนมจีน', 'หรืออาหารค้างคืน'], onchange: 'handleDiarrheaFoodRiskItemChange(this)', compact: true },
            { name: 'diarrheaFoodRisks', value: 'fermented_canned', title: ['อาหารหมักดอง', '/ อาหารกระป๋อง'], onchange: 'handleDiarrheaFoodRiskItemChange(this)', compact: true },
            { name: 'diarrheaFoodRisks', value: 'untreated_water_ice', title: ['น้ำดื่ม / น้ำแข็ง', 'ไม่สะอาด'], onchange: 'handleDiarrheaFoodRiskItemChange(this)', compact: true },
            { name: 'diarrheaFoodRisks', value: 'street_food_buffet', title: ['อาหารตลาดนัด', 'สตรีทฟู้ด / บุฟเฟต์'], onchange: 'handleDiarrheaFoodRiskItemChange(this)', compact: true },
            { name: 'diarrheaFoodRisks', value: 'wild_mushroom_plant', title: ['อาหารป่า เห็ดแปลก', 'หรือพืชที่ไม่คุ้นเคย'], colSpan2: true, onchange: 'handleDiarrheaFoodRiskItemChange(this)', compact: true }
          ])}
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-800 mb-1.5">4.2 คนที่รับประทานอาหารร่วมกันมีอาการคล้ายกันหรือไม่</label>
          ${renderDiarGrid('grid-cols-1 sm:grid-cols-3', [
            { kind: 'radio', name: 'diarrheaSharedMeal', value: 'outbreak_multiple', title: ['มีคนร่วมโต๊ะป่วยด้วย'], onchange: 'handleDiarrheaSharedMealChange(this.value)', compact: true },
            { kind: 'radio', name: 'diarrheaSharedMeal', value: 'single_case', title: ['เป็นคนเดียว'], onchange: 'handleDiarrheaSharedMealChange(this.value)', compact: true },
            { kind: 'radio', name: 'diarrheaSharedMeal', value: 'alone_unknown', title: ['ทานคนเดียว / ไม่ทราบ'], onchange: 'handleDiarrheaSharedMealChange(this.value)', compact: true }
          ])}
          <div id="diarrheaOutbreakWrap" class="hidden mt-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <label class="block text-xs font-semibold text-slate-700 mb-1">ระบุจำนวนคนหรืออาหารที่ทานร่วมกัน</label>
            <input type="text" id="diarrheaOutbreakDetails" placeholder="เช่น เพื่อนร่วมโต๊ะส้มตำเป็นด้วย 2 คน" class="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100">
          <label class="block text-xs font-semibold text-slate-800 mb-1.5">4.3 ประวัติใช้ยาปฏิชีวนะ (ยาฆ่าเชื้อ) ในช่วง 1–3 เดือนที่ผ่านมา <strong class="font-bold text-slate-900 underline">ก่อนเริ่มท้องเสีย</strong></label>
          ${renderDiarGrid('grid-cols-1 sm:grid-cols-2', [
            { kind: 'radio', name: 'diarrheaRecentAbx', value: 'recent_abx_yes', title: ['มีประวัติใช้', 'ยาปฏิชีวนะ 1–3 เดือน'], onchange: 'handleDiarrheaAbxChange(this.value)', compact: true },
            { kind: 'radio', name: 'diarrheaRecentAbx', value: 'recent_abx_no', title: ['ไม่มีประวัติใช้', 'ยาปฏิชีวนะ'], onchange: 'handleDiarrheaAbxChange(this.value)', compact: true }
          ])}
          <div id="diarrheaAbxWrap" class="hidden mt-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <label class="block text-xs font-semibold text-slate-700 mb-1">ระบุชื่อยาหรือโรคที่รักษา (ถ้าทราบ)</label>
            <input type="text" id="diarrheaAbxDetails" placeholder="เช่น Clindamycin จากทำฟัน, Ciprofloxacin" class="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100">
          ${renderDiarOption({ id: 'diarrhea_travel_cb', title: ['เพิ่งเดินทางต่างถิ่น', 'หรือแหล่งธรรมชาติ', 'ภายใน 1–2 สัปดาห์'], onchange: 'handleDiarrheaTravelToggle(this)', compact: true })}
          <div id="diarrheaTravelWrap" class="hidden mt-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <label class="block text-xs font-semibold text-slate-700 mb-1">ระบุสถานที่และช่วงเวลาที่เดินทาง</label>
            <input type="text" id="diarrheaTravelDetails" placeholder="เช่น ตั้งแคมป์ริมน้ำตก เที่ยวเกาะ หรือต่างประเทศ" class="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
          </div>
        </div>
      </div>

      <!-- Conditional Card 5: Female Reproductive History -->
      <div id="diarrhea_branch_female_lmp" class="hidden bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
        <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div class="bg-pink-100 text-pink-700 p-2 rounded-xl"><i data-lucide="heart-pulse" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">5. ข้อมูลเฉพาะสตรีวัยเจริญพันธุ์ (อายุ 12–55 ปี)</h2>
            <p class="text-xs text-slate-500">คัดกรองภาวะฉุกเฉินทางนรีเวช เช่น การตั้งครรภ์นอกมดลูก</p>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-800 mb-1.5">ประวัติประจำเดือนรอบล่าสุด</label>
          ${renderDiarGrid('grid-cols-1 sm:grid-cols-2', [
            { kind: 'radio', name: 'diarrheaLmpStatus', value: 'regular_lmp_exact', title: ['ประจำเดือนมาตรงปกติ'], onchange: 'handleDiarrheaLmpStatusChange(this.value)', compact: true },
            { kind: 'radio', name: 'diarrheaLmpStatus', value: 'missed_period', title: ['ขาดประจำเดือน', '/ สงสัยตั้งครรภ์'], onchange: 'handleDiarrheaLmpStatusChange(this.value)', compact: true },
            { kind: 'radio', name: 'diarrheaLmpStatus', value: 'irregular_unsure', title: ['มาไม่สม่ำเสมอ', '/ จำวันไม่ได้'], onchange: 'handleDiarrheaLmpStatusChange(this.value)', compact: true },
            { kind: 'radio', name: 'diarrheaLmpStatus', value: 'menopause_hysterectomy', title: ['หมดประจำเดือน', '/ ผ่าตัดมดลูกแล้ว'], onchange: 'handleDiarrheaLmpStatusChange(this.value)', compact: true }
          ])}
          <div id="diarrhea_lmp_date_wrap" class="hidden mt-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl max-w-xs">
            <label class="block text-xs font-semibold text-slate-700 mb-1">วันแรกของประจำเดือนครั้งสุดท้าย (วว/ดด/ปปปป)</label>
            <input type="text" id="diarrheaLmpDate" data-universal-date="true" placeholder="เช่น 12/10/2026" class="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
          </div>
        </div>

        <div>
          ${renderDiarOption({ id: 'diarrheaFemaleEctopicWarning', title: ['มีปวดหน่วงท้องน้อย', 'หรือหน้ามืดเป็นลม', 'ร่วมกับขาดประจำเดือน'], compact: true })}
        </div>
      </div>

      <!-- Unnumbered Card: Additional Notes -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100">
          <div class="bg-slate-100 text-slate-600 p-2 rounded-xl"><i data-lucide="message-square-plus" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-800">อาการอื่น ๆ หรือข้อความเพิ่มเติมถึงแพทย์</h2>
            <p class="text-xs text-slate-500">ระบุรายละเอียดหรือข้อสังเกตของท่านแก่แพทย์ (ถ้ามี)</p>
          </div>
        </div>
        <textarea id="diarrhea_other_free" rows="2" placeholder="ระบุอาการ หรือข้อสังเกตเพิ่มเติม (ถ้ามี)..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"></textarea>
      </div>
    </div>
  `;
}

// --- Register Chief Complaint Module ---
registerCcModule({
  id: 'diarrhea',
  recordCc: 'diarrhea',
  titleTh: 'ท้องเสีย / ถ่ายเหลว / ถ่ายเป็นน้ำ',
  titleEn: 'Diarrhea / Watery Stool / Dysentery',
  sectionDomId: 'diarrheaQuestionnaireSection',
  doctorCcBadgeHtml: '<i data-lucide="droplets" class="w-4 h-4 text-amber-500 mr-1.5 flex-shrink-0"></i><span class="font-bold text-slate-800">CC: ท้องเสีย / ถ่ายเหลว / ถ่ายเป็นน้ำ (Diarrhea)</span>',
  patientBadgeHtml: '<i data-lucide="droplets" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"></i><span><span class="inline-block whitespace-nowrap">ท้องเสีย / </span><span class="inline-block whitespace-nowrap">ถ่ายเหลว / </span><span class="inline-block whitespace-nowrap">ถ่ายเป็นน้ำ</span></span>',
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
    const fCard = getDiarEl('diarrhea_branch_female_lmp');
    return (fCard && !fCard.classList.contains('hidden')) ? 6 : 5;
  },
  onTitleChange: function({ isFemale }) {
    const fCard = getDiarEl('diarrhea_branch_female_lmp');
    if (fCard) {
      if (isFemale) fCard.classList.remove('hidden');
      else {
        fCard.classList.add('hidden');
        clearDiarBranchValues(fCard);
        const lmpWrap = getDiarEl('diarrhea_lmp_date_wrap');
        if (lmpWrap) lmpWrap.classList.add('hidden');
      }
    }
  },
  resetForm: function() {
    (this.branchIds || []).forEach(id => {
      const el = getDiarEl(id);
      if (el) el.classList.add('hidden');
    });
    (this.inputIdsToClear || []).forEach(id => {
      const el = getDiarEl(id);
      if (el) el.value = '';
    });
    const durUnit = getDiarEl('diarrheaDurationUnit');
    if (durUnit) durUnit.value = 'hours';
    const root = getDiarEl('diarrheaQuestionnaireSection');
    if (root) {
      root.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(inp => { inp.checked = false; });
    }
  },
  clearForm: function() { this.resetForm(); },
  formHtml: buildDiarrheaFormHtml(),

  collectIntake: function(ctx) {
    const c = ctx || {};
    const _rawDur = parseFloat(getDiarEl('diarrheaDurationVal')?.value);
    const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
    const durationUnit = getDiarEl('diarrheaDurationUnit')?.value || 'hours';

    const diarrheaOnsetMode = queryDiarOne('input[name="diarrheaOnsetMode"]:checked')?.value || '';
    const diarrheaFrequency24h = queryDiarOne('input[name="diarrheaFrequency24h"]:checked')?.value || '';
    const diarrheaVolumePerTime = queryDiarOne('input[name="diarrheaVolumePerTime"]:checked')?.value || '';
    const diarrheaStoolConsistency = queryDiarOne('input[name="diarrheaStoolConsistency"]:checked')?.value || '';
    const diarrheaStoolOtherText = getDiarEl('diarrheaStoolOtherText')?.value?.trim() || '';

    const diarrheaHasAbdpain = queryDiarOne('input[name="diarrheaHasAbdpain"]:checked')?.value || '';
    const diarrheaAbdpainChar = queryDiarOne('input[name="diarrheaAbdpainChar"]:checked')?.value || '';
    const diarrheaAbdpainLoc = queryDiarOne('input[name="diarrheaAbdpainLoc"]:checked')?.value || '';

    const diarrheaNausea = Boolean(getDiarEl('diarrhea_nausea_cb')?.checked);
    const diarrheaVomit = Boolean(getDiarEl('diarrhea_vomit_cb')?.checked);
    const _rawVomitFreq = parseInt(getDiarEl('diarrheaVomitFreq')?.value, 10);
    const diarrheaVomitFreq = (!isNaN(_rawVomitFreq) && _rawVomitFreq > 0) ? _rawVomitFreq : (diarrheaVomit ? null : 0);
    const diarrheaVomitChar = queryDiarOne('input[name="diarrheaVomitChar"]:checked')?.value || '';
    const diarrheaBloating = Boolean(getDiarEl('diarrhea_bloating_cb')?.checked);
    const diarrheaAnusBurning = Boolean(getDiarEl('diarrhea_anus_burning_cb')?.checked);

    const diarrheaOralTolerance = queryDiarOne('input[name="diarrheaOralTolerance"]:checked')?.value || '';
    const diarrheaDehydrationSigns = queryDiarAll('input[name="diarrheaDehydrationSigns"]:checked').map(cb => cb.value);
    const diarrheaSystemicSigns = queryDiarAll('input[name="diarrheaSystemicSigns"]:checked').map(cb => cb.value);
    const diarrheaFoodRisks = queryDiarAll('input[name="diarrheaFoodRisks"]:checked').map(cb => cb.value);

    const diarrheaSharedMeal = queryDiarOne('input[name="diarrheaSharedMeal"]:checked')?.value || '';
    const diarrheaOutbreakDetails = getDiarEl('diarrheaOutbreakDetails')?.value?.trim() || '';
    const diarrheaRecentAbx = queryDiarOne('input[name="diarrheaRecentAbx"]:checked')?.value || '';
    const diarrheaAbxDetails = getDiarEl('diarrheaAbxDetails')?.value?.trim() || '';

    const diarrheaTravel = Boolean(getDiarEl('diarrhea_travel_cb')?.checked);
    const diarrheaTravelDetails = getDiarEl('diarrheaTravelDetails')?.value?.trim() || '';

    const diarrheaLmpStatus = queryDiarOne('input[name="diarrheaLmpStatus"]:checked')?.value || '';
    const diarrheaLmpDate = getDiarEl('diarrheaLmpDate')?.value?.trim() || '';
    const diarrheaFemaleEctopicWarning = Boolean(getDiarEl('diarrheaFemaleEctopicWarning')?.checked);
    const otherSymptomsFree = getDiarEl('diarrhea_other_free')?.value?.trim() || c.otherSymptomsFree || '';

    return {
      id: c.recordId || '',
      queue_number: c.queueNumber || '',
      hn: c.randomHn || '',
      name: c.patientName || '',
      age: c.patientAge !== undefined ? c.patientAge : null,
      gender: c.gender || '',
      chief_complaint: 'diarrhea',
      chief_complaint_title: 'ท้องเสีย / ถ่ายเหลว / ถ่ายเป็นน้ำ',
      timestamp: new Date().toISOString(),
      status: c.recordStatus || 'waiting',
      durationVal,
      durationUnit,
      hospRecordStatus: c.hospRecordStatus || '',
      underlying: Array.isArray(c.underlying) ? c.underlying : [],
      drugAllergy: c.drugAllergy || '',
      currentMeds: c.currentMeds || '',
      otherSymptomsFree,
      doctor_notes: c.preservedDoctorNotes || { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },

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
  },

  hydrateForm: function(patient) {
    if (!patient) return;
    this.resetForm();

    const setVal = (id, val) => {
      const el = getDiarEl(id);
      if (el) el.value = (val !== undefined && val !== null) ? val : '';
    };
    const setRadio = (name, val) => {
      if (!val) return;
      const el = queryDiarOne(`input[name="${name}"][value="${val}"]`);
      if (el) el.checked = true;
    };
    const setChk = (id, val) => {
      const el = getDiarEl(id);
      if (el) el.checked = Boolean(val);
    };
    const setCheckboxes = (name, arr) => {
      if (!Array.isArray(arr)) return;
      arr.forEach(val => {
        const el = queryDiarOne(`input[name="${name}"][value="${val}"]`);
        if (el) el.checked = true;
      });
    };

    setVal('diarrheaDurationVal', patient.durationVal || '');
    setVal('diarrheaDurationUnit', patient.durationUnit || 'hours');

    setRadio('diarrheaOnsetMode', patient.diarrheaOnsetMode);
    setVal('diarrhea_other_free', patient.otherSymptomsFree || '');

    setRadio('diarrheaFrequency24h', patient.diarrheaFrequency24h);
    setRadio('diarrheaVolumePerTime', patient.diarrheaVolumePerTime);
    setRadio('diarrheaStoolConsistency', patient.diarrheaStoolConsistency);
    handleDiarrheaStoolConsistencyChange(patient.diarrheaStoolConsistency);
    setVal('diarrheaStoolOtherText', patient.diarrheaStoolOtherText || '');

    setRadio('diarrheaHasAbdpain', patient.diarrheaHasAbdpain);
    handleDiarrheaAbdpainChange(patient.diarrheaHasAbdpain);
    if (patient.diarrheaHasAbdpain === 'yes') {
      setRadio('diarrheaAbdpainChar', patient.diarrheaAbdpainChar);
      setRadio('diarrheaAbdpainLoc', patient.diarrheaAbdpainLoc);
    }

    setChk('diarrhea_nausea_cb', patient.diarrheaNausea);
    setChk('diarrhea_vomit_cb', patient.diarrheaVomit);
    handleDiarrheaVomitToggle({ checked: Boolean(patient.diarrheaVomit) });
    if (patient.diarrheaVomit) {
      setVal('diarrheaVomitFreq', patient.diarrheaVomitFreq || '');
      setRadio('diarrheaVomitChar', patient.diarrheaVomitChar);
    }
    setChk('diarrhea_bloating_cb', patient.diarrheaBloating);
    setChk('diarrhea_anus_burning_cb', patient.diarrheaAnusBurning);

    setRadio('diarrheaOralTolerance', patient.diarrheaOralTolerance);
    setCheckboxes('diarrheaDehydrationSigns', patient.diarrheaDehydrationSigns);
    setCheckboxes('diarrheaSystemicSigns', patient.diarrheaSystemicSigns);
    setCheckboxes('diarrheaFoodRisks', patient.diarrheaFoodRisks);

    setRadio('diarrheaSharedMeal', patient.diarrheaSharedMeal);
    handleDiarrheaSharedMealChange(patient.diarrheaSharedMeal);
    setVal('diarrheaOutbreakDetails', patient.diarrheaOutbreakDetails || '');

    setRadio('diarrheaRecentAbx', patient.diarrheaRecentAbx);
    handleDiarrheaAbxChange(patient.diarrheaRecentAbx);
    setVal('diarrheaAbxDetails', patient.diarrheaAbxDetails || '');

    setChk('diarrhea_travel_cb', patient.diarrheaTravel);
    handleDiarrheaTravelToggle({ checked: Boolean(patient.diarrheaTravel) });
    setVal('diarrheaTravelDetails', patient.diarrheaTravelDetails || '');

    if (patient.gender === 'หญิง') {
      const fCard = getDiarEl('diarrhea_branch_female_lmp');
      if (fCard) fCard.classList.remove('hidden');
      setRadio('diarrheaLmpStatus', patient.diarrheaLmpStatus);
      handleDiarrheaLmpStatusChange(patient.diarrheaLmpStatus);
      setVal('diarrheaLmpDate', patient.diarrheaLmpDate || '');
      setChk('diarrheaFemaleEctopicWarning', patient.diarrheaFemaleEctopicWarning);
    }
  },
  populateForm: function(patient) { this.hydrateForm(patient); },
  onSelectForm: function() { this.resetForm(); },
  onActivate: function() {
    if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') lucide.createIcons();
  },
  onMounted: function() { this.onActivate(); },
  init: function() { this.onActivate(); },

  isRedFlag: function(patient) { return isDiarrheaRedFlag(patient); },
  evaluateRedFlags: function(patient) { return evaluateDiarrheaRedFlags(patient); },
  updateOutputs: function(patient) { return updateDiarrheaOutputs(patient); },

  algorithm: {
    ccId: 'diarrhea',
    schemaKey: 'acute_diarrhea',
    titleTh: 'ท้องเสีย / ถ่ายเหลว / ถ่ายเป็นน้ำ',
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
      chief_complaint_title: 'ท้องเสีย / ถ่ายเหลว / ถ่ายเป็นน้ำ',
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
      chief_complaint_title: 'ท้องเสีย / ถ่ายเหลว / ถ่ายเป็นน้ำ',
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
      chief_complaint_title: 'ท้องเสีย / ถ่ายเหลว / ถ่ายเป็นน้ำ',
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
      chief_complaint_title: 'ท้องเสีย / ถ่ายเหลว / ถ่ายเป็นน้ำ',
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

if (typeof window !== 'undefined') {
  window.handleDiarrheaStoolConsistencyChange = handleDiarrheaStoolConsistencyChange;
  window.handleDiarrheaAbdpainChange = handleDiarrheaAbdpainChange;
  window.handleDiarrheaVomitToggle = handleDiarrheaVomitToggle;
  window.handleDiarrheaDehydrationNoneToggle = handleDiarrheaDehydrationNoneToggle;
  window.handleDiarrheaDehydrationItemChange = handleDiarrheaDehydrationItemChange;
  window.handleDiarrheaSystemicNoneToggle = handleDiarrheaSystemicNoneToggle;
  window.handleDiarrheaSystemicItemChange = handleDiarrheaSystemicItemChange;
  window.handleDiarrheaFoodRiskNoneToggle = handleDiarrheaFoodRiskNoneToggle;
  window.handleDiarrheaFoodRiskItemChange = handleDiarrheaFoodRiskItemChange;
  window.handleDiarrheaSharedMealChange = handleDiarrheaSharedMealChange;
  window.handleDiarrheaAbxChange = handleDiarrheaAbxChange;
  window.handleDiarrheaTravelToggle = handleDiarrheaTravelToggle;
  window.handleDiarrheaLmpStatusChange = handleDiarrheaLmpStatusChange;
}
