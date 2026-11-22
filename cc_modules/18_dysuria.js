// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 18_dysuria.js
// อาการนำ: ปัสสาวะแสบขัด (Dysuria / Painful Urination)
// ปรับปรุงตามมาตรฐาน plan_dysuria.md, plan-cc และ code-cc (กลุ่ม B2)
// =========================================================================

// --- Internal DOM & UI Helpers ---
function getDysEl(id) {
  return typeof document !== 'undefined' ? document.getElementById(id) : null;
}

function queryDysOne(selector) {
  return typeof document !== 'undefined' ? document.querySelector(selector) : null;
}

function queryDysAll(selector) {
  return typeof document !== 'undefined' ? Array.from(document.querySelectorAll(selector)) : [];
}

function wrapDysWords(chunks) {
  if (!Array.isArray(chunks)) return chunks;
  return chunks.map(c => `<span class="inline-block whitespace-nowrap">${c}</span>`).join(' ');
}

function renderDysOption(cfg) {
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
  const titleHtml = Array.isArray(title) ? wrapDysWords(title) : title;
  const bodyHtml = desc
    ? `<div class="ml-3 leading-snug"><span class="block text-xs sm:text-sm font-semibold text-slate-800">${titleHtml}</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">${desc}</span></div>`
    : `<span class="ml-3 ${compact ? 'text-xs' : 'text-xs sm:text-sm'} font-semibold text-slate-800 leading-snug">${titleHtml}</span>`;
  return `<label class="selectable-card bg-white flex ${alignCls} ${padCls} rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition${spanCls}"><input type="${kind}" ${idAttr}${nameAttr}${valAttr}${chgAttr}class="${topCls}${roundCls}text-medical-600 focus:ring-medical-500 ${szCls} flex-shrink-0">${bodyHtml}</label>`;
}

function renderDysGrid(colsCls, items, shared = {}) {
  return `<div class="grid ${colsCls} gap-2.5">${items.map(it => renderDysOption({ ...shared, ...it })).join('\n')}</div>`;
}

function renderDysSysHeader({
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

// --- Pain Score Touch State Tracking (Matching 01_abdpain.js Emoji Pain Scale) ---
let dysuriaPainScoreTouched = false;

function clearDysuriaPainScore() {
  dysuriaPainScoreTouched = false;
  const slider = getDysEl('dysuriaPainScore');
  if (slider) slider.value = 0;
  const emojiEl = getDysEl('dysuriaPainScoreEmoji');
  const textEl = getDysEl('dysuriaPainScoreText');
  const badgeEl = getDysEl('dysuriaPainScoreBadge');
  const clearBtn = getDysEl('dysuriaPainScoreClearBtn');
  if (emojiEl) emojiEl.textContent = '⚪';
  if (textEl) textEl.textContent = 'ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)';
  if (badgeEl) badgeEl.className = 'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all';
  if (clearBtn) clearBtn.classList.add('hidden');
}

function handleDysuriaPainScoreChange(val) {
  dysuriaPainScoreTouched = true;
  const parsed = parseInt(val, 10);
  const num = isNaN(parsed) ? 0 : Math.min(10, Math.max(0, parsed));
  const slider = getDysEl('dysuriaPainScore');
  if (slider && String(slider.value) !== String(num)) slider.value = num;
  const emojiEl = getDysEl('dysuriaPainScoreEmoji');
  const textEl = getDysEl('dysuriaPainScoreText');
  const badgeEl = getDysEl('dysuriaPainScoreBadge');
  const clearBtn = getDysEl('dysuriaPainScoreClearBtn');
  if (clearBtn) clearBtn.classList.remove('hidden');
  if (!emojiEl || !textEl || !badgeEl) return;

  let emoji = '😐', label = 'ปวดปานกลาง', badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
  if (num === 0) { emoji = '😊'; label = 'สบายดี (ไม่ปวดเลย)'; badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300'; }
  else if (num <= 3) { emoji = '🙂'; label = 'ปวดเล็กน้อย (ทนได้)'; badgeClass = 'bg-lime-100 text-lime-800 border-lime-300'; }
  else if (num <= 6) { emoji = '😐'; label = 'ปวดปานกลาง (รบกวนสมาธิ)'; badgeClass = 'bg-amber-100 text-amber-800 border-amber-300'; }
  else if (num <= 9) { emoji = '😣'; label = 'ปวดมาก (ทนแทบไม่ไหว)'; badgeClass = 'bg-rose-100 text-rose-800 border-rose-300'; }
  else { emoji = '😭'; label = 'เจ็บปวดรุนแรงที่สุดในชีวิต'; badgeClass = 'bg-red-200 text-red-900 border-red-400 animate-pulse'; }

  emojiEl.textContent = emoji;
  textEl.textContent = `${num} / 10 (${label})`;
  badgeEl.className = `inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border transition ${badgeClass}`;
}

function setDysuriaPainScore(score) {
  dysuriaPainScoreTouched = true;
  const slider = getDysEl('dysuriaPainScore');
  if (slider) {
    slider.value = score;
    handleDysuriaPainScoreChange(score);
  }
}

// --- Gender Branch Synchronization (C-AP13) ---
function isDysuriaFemaleFromTitle() {
  const titleEl = getDysEl('patientTitleSelect');
  const title = titleEl ? (titleEl.value || '').trim() : '';
  return title.includes('นาง') || title.includes('ด.ญ.') || title.includes('Mrs') || title.includes('Ms') || title.includes('Miss');
}

function syncDysuriaGenderBranches(isFemaleOpt) {
  const mCard = getDysEl('dysuria_branch_male');
  const fCard = getDysEl('dysuria_branch_female');
  const titleEl = getDysEl('patientTitleSelect');
  const titleVal = titleEl ? (titleEl.value || '').trim() : '';

  if (typeof isFemaleOpt !== 'boolean' && !titleVal) {
    if (mCard) mCard.classList.add('hidden');
    if (fCard) fCard.classList.add('hidden');
    return;
  }

  const isFemale = typeof isFemaleOpt === 'boolean' ? isFemaleOpt : isDysuriaFemaleFromTitle();
  if (isFemale) {
    if (mCard) mCard.classList.add('hidden');
    if (fCard) fCard.classList.remove('hidden');
    queryDysAll('input[name="dysuriaMaleSigns"]').forEach(cb => { cb.checked = false; });
  } else {
    if (mCard) mCard.classList.remove('hidden');
    if (fCard) fCard.classList.add('hidden');
    const lmp = getDysEl('dysuriaLmpDate');
    if (lmp) lmp.value = '';
    const preg = getDysEl('dysuriaFemalePregnancyWarning');
    if (preg) preg.checked = false;
    queryDysAll('input[name="dysuriaFemaleSigns"]').forEach(cb => { cb.checked = false; });
  }
}

// --- Corner-Toggle Mutual Exclusion Handlers ---
function handleDysuriaLutsNoneToggle(el) {
  if (el && el.checked) {
    queryDysAll('input[name="dysuriaLuts"]').forEach(cb => { if (cb !== el) cb.checked = false; });
  }
}

function handleDysuriaLutsItemChange(el) {
  if (el && el.checked) {
    const noneCb = getDysEl('dysuria_luts_none') || queryDysOne('input[name="dysuriaLuts"][value="dysuria_luts_none"]');
    if (noneCb) noneCb.checked = false;
  }
}

function handleDysuriaUrineNoneToggle(el) {
  if (el && el.checked) {
    queryDysAll('input[name="dysuriaUrineChars"]').forEach(cb => { if (cb !== el) cb.checked = false; });
  }
}

function handleDysuriaUrineItemChange(el) {
  if (el && el.checked) {
    const noneCb = getDysEl('dysuria_urine_none') || queryDysOne('input[name="dysuriaUrineChars"][value="urine_normal_clear"]');
    if (noneCb) noneCb.checked = false;
  }
}

function handleDysuriaSystemicNoneToggle(el) {
  if (el && el.checked) {
    queryDysAll('input[name="dysuriaSystemicSigns"]').forEach(cb => { if (cb !== el) cb.checked = false; });
  }
}

function handleDysuriaSystemicItemChange(el) {
  if (el && el.checked) {
    const noneCb = getDysEl('dysuria_sys_none') || queryDysOne('input[name="dysuriaSystemicSigns"][value="dysuria_rf_systemic_none"]');
    if (noneCb) noneCb.checked = false;
  }
}

function handleDysuriaMaleNoneToggle(el) {
  if (el && el.checked) {
    queryDysAll('input[name="dysuriaMaleSigns"]').forEach(cb => { if (cb !== el) cb.checked = false; });
  }
}

function handleDysuriaMaleItemChange(el) {
  if (el && el.checked) {
    const noneCb = getDysEl('dysuria_male_none') || queryDysOne('input[name="dysuriaMaleSigns"][value="male_none"]');
    if (noneCb) noneCb.checked = false;
  }
}

function handleDysuriaFemaleNoneToggle(el) {
  if (el && el.checked) {
    queryDysAll('input[name="dysuriaFemaleSigns"]').forEach(cb => { if (cb !== el) cb.checked = false; });
  }
}

function handleDysuriaFemaleItemChange(el) {
  if (el && el.checked) {
    const noneCb = getDysEl('dysuria_female_none') || queryDysOne('input[name="dysuriaFemaleSigns"][value="female_none"]');
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
      suggestedAction: 'Triage Level 1: Resuscitation, IV Fluid bolus 30 mL/kg, Hemoculture x 2, STAT Lab & IV Antibiotics ใน 1 ชม.'
    });
  }

  // 2. Fournier's Gangrene / Perineal Necrotizing Fasciitis
  if (systemicSigns.includes('dysuria_rf_perineal_scrotal_severe_pain') ||
      ((patient.gender === 'ชาย' || patient.gender === 'Male') && maleSigns.includes('male_testicular_pain_swelling') && (systemicSigns.includes('dysuria_rf_high_fever_chills') || hasDiabetes))) {
    flags.push({
      key: 'dysuria_rf_fournier_gangrene',
      level: 1,
      textTh: 'สงสัยภาวะติดเชื้อเนื้อตายของฝีเย็บและอวัยวะเพศ (Suspected Fournier’s Gangrene / Necrotizing Fasciitis)',
      risk: 'ภาวะฉุกเฉินวิกฤตทางศัลยกรรม มีอัตราเสียชีวิตสูงมากหากไม่ได้รับการผ่าตัดชำระล้างเนื้อตายอย่างทันท่วงที',
      suggestedAction: 'Triage Level 1-2: ปรึกษาศัลยแพทย์/Urologist ด่วน, เตรียมผ่าตัด Debridement, Triple IV Antibiotics'
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
      suggestedAction: 'Triage Level 2: UA, Urine C/S, CBC/BUN/Cr, IV Ceftriaxone 1–2 g, Ultrasound KUB'
    });
  }

  // 4. Gross Hematuria with Clot Retention Risk
  if (urineChars.includes('urine_gross_hematuria')) {
    flags.push({
      key: 'dysuria_rf_gross_hematuria_clots',
      level: 2,
      textTh: 'ปัสสาวะเป็นเลือดสดหรือมีลิ่มเลือด (Gross Hematuria / Risk of Clot Retention)',
      risk: 'เสี่ยงต่อการเกิดลิ่มเลือดอุดกั้นท่อปัสสาวะเฉียบพลัน และอาจเป็นสัญญาณของนิ่วหรือเนื้องอกระบบทางเดินปัสสาวะ',
      suggestedAction: 'Triage Level 2-3: ประเมิน Vital Signs/CBC/Coagulogram/UA, เตรียม 3-way Foley หากมี Clot Retention'
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
      risk: 'เสี่ยงต่อการเกิดหนองในอุ้งเชิงกราน (Tubo-ovarian Abscess) และเยื่อบุช่องท้องอักเสบ',
      suggestedAction: 'Triage Level 2: Pelvic exam, Urine hCG, Gram stain/Culture, Ceftriaxone IM + Doxycycline + Metronidazole'
    });
  }

  // 6. Acute Urethritis / STI Discharge in Male
  if ((patient.gender === 'ชาย' || patient.gender === 'Male') &&
      maleSigns.includes('male_urethral_discharge')) {
    flags.push({
      key: 'dysuria_rf_male_urethritis_sti',
      level: 3,
      textTh: 'มีหนองหรือน้ำคัดหลั่งจากท่อปัสสาวะ สงสัยท่อปัสสาวะอักเสบจากโรคติดต่อทางเพศสัมพันธ์ (Urethritis / STI)',
      risk: 'เสี่ยงต่อภาวะอัณฑะอักเสบและการแพร่กระจายเชื้อสู่คู่นอน',
      suggestedAction: 'Triage Level 3-4: Urethral Gram stain, Ceftriaxone 1 g IM + Doxycycline 100 mg x 7 วัน, รักษาคู่นอน'
    });
  }

  return flags;
}

// --- Thai Lookup Dictionaries ---
const DYS_UNIT_MAP = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };

const DYS_TIMING_MAP = {
  timing_initial: 'แสบแปลบช่วงแรกที่เริ่มปล่อยปัสสาวะ',
  timing_terminal: 'แสบขัดบีบเกร็งช่วงท้ายตอนปัสสาวะใกล้สุด',
  timing_throughout: 'แสบขัดตลอดเวลาตั้งแต่เริ่มจนสุด',
  timing_external_vulvar: 'แสบเฉพาะผิวภายนอกเมื่อน้ำปัสสาวะโดนแผล'
};

const DYS_LUTS_MAP = {
  dysuria_freq_urgency: 'ปัสสาวะบ่อยหรือปวดเบ่งกลั้นแทบไม่ทัน',
  dysuria_incomplete_dribble: 'ปัสสาวะไม่สุด หยดกะปริบกะปรอย',
  dysuria_hesitancy_weak_stream: 'ปัสสาวะรอนาน ลำเล็ก ต้องออกแรงเบ่ง',
  dysuria_strangury: 'ปวดเบ่งรุนแรง ออกทีละไม่กี่หยด',
  dysuria_stone_interruption: 'ลำปัสสาวะสะดุดหยุดไหลกะทันหัน'
};

const DYS_URINE_MAP = {
  urine_turbid_foul: 'น้ำปัสสาวะขุ่นมีตะกอนหรือกลิ่นเหม็นแรง',
  urine_gross_hematuria: 'น้ำปัสสาวะสีแดงสด สีน้ำล้างเนื้อ หรือมีลิ่มเลือดปน',
  urine_gravel_sediment: 'มีเศษกรวดหรือเม็ดทรายปนออกมากับปัสสาวะ'
};

const DYS_SYS_MAP = {
  dysuria_rf_high_fever_chills: 'มีไข้สูง หนาวสั่น หรือตัวเย็นสั่น',
  dysuria_rf_flank_pain: 'ปวดบั้นเอวด้านหลัง หรือเจ็บสีข้างรุนแรง',
  dysuria_rf_nausea_vomiting: 'คลื่นไส้ อาเจียน',
  dysuria_rf_perineal_scrotal_severe_pain: 'ปวดบวมแดงร้อนบริเวณฝีเย็บหรือถุงอัณฑะ',
  dysuria_rf_hypotension_shock: 'หน้ามืด วูบหมดสติ เหงื่อแตกตัวเย็นซีด',
  dysuria_rf_altered_mental: 'มีอาการซึมลง สับสน หรือพูดจาไม่รู้เรื่อง'
};

const DYS_MALE_MAP = {
  male_urethral_discharge: 'มีหนองข้นหรือมูกไหลซึมจากปลายท่อปัสสาวะ',
  male_testicular_pain_swelling: 'ปวดบวมที่ลูกอัณฑะ หรือเจ็บลึกบริเวณฝีเย็บ',
  male_sti_risk: 'มีเพศสัมพันธ์ไม่ได้สวมถุงยางอนามัย หรือมีคู่นอนใหม่ใน 1–4 สัปดาห์'
};

const DYS_FEMALE_MAP = {
  female_vaginal_discharge: 'มีตกขาวผิดปกติ สีเหลือง/เขียว หรือกลิ่นเหม็น',
  female_lower_abd_pelvic_pain: 'ปวดหน่วงท้องน้อยหรืออุ้งเชิงกราน',
  female_vulvar_ulcer_itching: 'มีแผลพุพอง ตุ่มน้ำใส หรือคันแสบภายนอก'
};

const DYS_HOSP_MAP = {
  ratchaburi: 'มีประวัติการรักษาที่ รพ.ราชบุรี',
  complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
  additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
  self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
  unspecified: 'ไม่ได้ระบุ'
};

// --- Output Generator (Rapid Bullet, Narrative & JSON Schema) ---
function updateDysuriaOutputs(patient) {
  if (!patient) return null;

  const timing = patient.dysuriaTiming || '';
  const luts = Array.isArray(patient.dysuriaLuts) ? patient.dysuriaLuts : [];
  const urineChars = Array.isArray(patient.dysuriaUrineChars) ? patient.dysuriaUrineChars : [];
  const systemicSigns = Array.isArray(patient.dysuriaSystemicSigns) ? patient.dysuriaSystemicSigns : [];
  const maleSigns = Array.isArray(patient.dysuriaMaleSigns) ? patient.dysuriaMaleSigns : [];
  const femaleSigns = Array.isArray(patient.dysuriaFemaleSigns) ? patient.dysuriaFemaleSigns : [];

  const isMale = patient.gender === 'ชาย' || patient.gender === 'Male';
  const isFemale = patient.gender === 'หญิง' || patient.gender === 'Female';

  const redFlags = evaluateDysuriaRedFlags(patient);
  patient.redFlags = redFlags;

  const durVal = patient.durationVal;
  const durationStr = durVal ? `${durVal} ${DYS_UNIT_MAP[patient.durationUnit] || 'วัน'}` : 'ไม่ได้ระบุ';

  const lutsPos = luts.filter(k => k !== 'dysuria_luts_none');
  const urinePos = urineChars.filter(k => k !== 'urine_normal_clear');
  const sysPos = systemicSigns.filter(k => k !== 'dysuria_rf_systemic_none');
  const malePos = maleSigns.filter(k => k !== 'male_none');
  const femalePos = femaleSigns.filter(k => k !== 'female_none');

  const positives = [];
  const negatives = [];

  lutsPos.forEach(k => { if (DYS_LUTS_MAP[k]) positives.push(DYS_LUTS_MAP[k]); });
  if (luts.includes('dysuria_luts_none') && lutsPos.length === 0) {
    negatives.push('ปฏิเสธปัสสาวะบ่อย กลั้นไม่อยู่ หรือปัสสาวะไม่สุด');
  }

  urinePos.forEach(k => { if (DYS_URINE_MAP[k]) positives.push(DYS_URINE_MAP[k]); });
  if (urineChars.includes('urine_normal_clear') && urinePos.length === 0) {
    negatives.push('ปฏิเสธปัสสาวะขุ่นเป็นเลือดหรือปนกรวดทราย');
  }

  sysPos.forEach(k => { if (DYS_SYS_MAP[k]) positives.push(DYS_SYS_MAP[k]); });
  if (systemicSigns.includes('dysuria_rf_systemic_none') && sysPos.length === 0) {
    negatives.push('ปฏิเสธไข้หนาวสั่น ปวดบั้นเอว คลื่นไส้อาเจียน และหน้ามืดวูบ');
  } else if (sysPos.length > 0) {
    if (!sysPos.includes('dysuria_rf_high_fever_chills')) negatives.push('ปฏิเสธไข้สูงหนาวสั่น');
    if (!sysPos.includes('dysuria_rf_flank_pain')) negatives.push('ปฏิเสธปวดบั้นเอวด้านหลัง');
  }

  if (isMale) {
    malePos.forEach(k => { if (DYS_MALE_MAP[k]) positives.push(DYS_MALE_MAP[k]); });
    if (maleSigns.includes('male_none') && malePos.length === 0) {
      negatives.push('ปฏิเสธหนองไหลจากท่อปัสสาวะ และอัณฑะไม่บวมเจ็บ');
    }
  } else if (isFemale) {
    femalePos.forEach(k => { if (DYS_FEMALE_MAP[k]) positives.push(DYS_FEMALE_MAP[k]); });
    if (femaleSigns.includes('female_none') && femalePos.length === 0) {
      negatives.push('ปฏิเสธตกขาวผิดปกติและปวดหน่วงท้องน้อย');
    }
    if (patient.dysuriaFemalePregnancyWarning) {
      positives.push('ขาดประจำเดือน หรือสงสัยว่ากำลังตั้งครรภ์');
    }
  }

  if (patient.otherSymptomsFree) positives.push(patient.otherSymptomsFree);

  patient.pertinentPositives = positives.length > 0 ? positives : ['ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม'];
  patient.pertinentNegatives = negatives.length > 0 ? negatives : ['ผู้ป่วยไม่ได้ระบุคำตอบยืนยันในหมวดอาการร่วม'];

  const docNotes = patient.doctor_notes || {};
  const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ')
    ? 'ไม่ได้ระบุ'
    : (patient.currentMeds === 'ไม่มี' ? 'ไม่มี' : patient.currentMeds);
  const hospLabel = DYS_HOSP_MAP[patient.hospRecordStatus] || 'ไม่ได้ระบุ';

  const udArr = Array.isArray(patient.underlying) ? patient.underlying : (patient.underlying ? [patient.underlying] : []);
  const filteredUd = udArr.filter(u => u && !u.includes('ปฏิเสธ') && u !== 'ไม่มี' && u !== 'ไม่มีโรคประจำตัว' && u !== 'ไม่ได้ระบุ');
  const udExplicitDeny = udArr.some(u => u && (u.includes('ปฏิเสธ') || u === 'ไม่มี' || u === 'ไม่มีโรคประจำตัว'));
  const udDisplay = filteredUd.length > 0
    ? filteredUd.join(', ')
    : ((udExplicitDeny || patient.hospRecordStatus === 'self' || patient.hospRecordStatus === 'additional') ? 'ปฏิเสธ' : 'ไม่ได้ระบุ');

  const allergyDisplay = (!patient.drugAllergy || patient.drugAllergy === 'ไม่ได้ระบุ')
    ? 'ไม่ได้ระบุ'
    : ((patient.drugAllergy.includes('ปฏิเสธ') || patient.drugAllergy === 'ไม่มี') ? 'ปฏิเสธ' : patient.drugAllergy);

  const pScoreText = (typeof patient.painScore === 'number' && patient.painScore >= 0)
    ? `${patient.painScore}/10 คะแนน`
    : 'ไม่ได้ระบุ';

  const femaleInfoLine = isFemale
    ? `\n• ประวัติสตรี: ${patient.dysuriaLmpDate ? `LMP ${patient.dysuriaLmpDate}` : 'ไม่ได้ระบุวันที่มีประจำเดือนรอบล่าสุด'}${patient.dysuriaFemalePregnancyWarning ? ' (ขาดประจำเดือน/สงสัยตั้งครรภ์)' : ''}`
    : '';

  const defaultRapid = `[Chief Complaint (CC)]
ปัสสาวะแสบขัด (Dysuria) มา ${durationStr}

[History of Present Illness (HPI)]
• จังหวะที่ปัสสาวะแสบขัด: ${DYS_TIMING_MAP[timing] || 'ไม่ได้ระบุ'}
• ระดับความเจ็บปวดแสบ (Pain Score): ${pScoreText}${femaleInfoLine}

• Pertinent Positives:
${patient.pertinentPositives.map(p => `  - ${p}`).join('\n')}

• Pertinent Negatives:
${patient.pertinentNegatives.map(n => `  - ${n}`).join('\n')}

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

  const genderLabel = (patient.gender && patient.gender !== 'ไม่ระบุ') ? patient.gender : '';
  let narrative = `ผู้ป่วย${genderLabel} อายุ ${patient.age || 'ไม่ได้ระบุ'} ปี มารับการตรวจด้วยอาการปัสสาวะแสบขัด มา ${durationStr} ` +
    `จังหวะแสบขัด: ${DYS_TIMING_MAP[timing] || 'ไม่ได้ระบุ'} ระดับความปวดแสบ: ${pScoreText}`;
  if (positives.length > 0) narrative += ` อาการร่วมที่พบ: ${positives.join(', ')}`;
  if (isFemale && patient.dysuriaLmpDate) narrative += ` (LMP: ${patient.dysuriaLmpDate})`;

  const jsonOutput = {
    encounter: {
      chief_complaint: 'dysuria',
      chief_complaint_title_th: 'ปัสสาวะแสบขัด',
      timestamp: patient.timestamp || new Date().toISOString(),
      duration_val: durVal || null,
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
      timing_type: timing || null,
      pain_score: typeof patient.painScore === 'number' ? patient.painScore : null,
      associated_luts: luts,
      urine_characteristics: urineChars,
      systemic_signs: systemicSigns,
      gender_specific_signs: {
        male: isMale ? maleSigns : null,
        female: isFemale ? {
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
        clinical_risk: rf.risk
      })),
      total_red_flags: redFlags.length
    }
  };

  const finalRapid = patient.custom_rapid_note || defaultRapid;
  const finalNarrative = patient.custom_narrative_note || narrative;
  patient.rapidHpi = finalRapid;
  patient.narrativeHpi = finalNarrative;
  patient.medicalJson = jsonOutput;

  if (typeof document !== 'undefined') {
    const rapidEl = document.getElementById('rapidTextView');
    const narrativeEl = document.getElementById('narrativeTextView');
    const jsonEl = document.getElementById('jsonViewer');
    if (rapidEl) rapidEl.value = finalRapid;
    if (narrativeEl) narrativeEl.value = finalNarrative;
    if (jsonEl) jsonEl.textContent = JSON.stringify(jsonOutput, null, 2);
  }

  return { rapid: finalRapid, narrative: finalNarrative, json: jsonOutput };
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
    hospRecordStatus: 'self',
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
    vital_signs: { bt: 36.9, sbp: 112, dbp: 72, bp: '112/72', pr: 82, rr: 16, spo2: 99 },
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
    hospRecordStatus: 'complete',
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
    vital_signs: { bt: 39.1, sbp: 102, dbp: 64, bp: '102/64', pr: 114, rr: 22, spo2: 97 },
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
    hospRecordStatus: 'self',
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
    vital_signs: { bt: 37.2, sbp: 120, dbp: 76, bp: '120/76', pr: 84, rr: 16, spo2: 99 },
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
    hospRecordStatus: 'complete',
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
    vital_signs: { bt: 39.4, sbp: 88, dbp: 54, bp: '88/54', pr: 126, rr: 24, spo2: 94 },
    doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' }
  }
];

// --- Registration with Core Engine ---
const dysuriaModule = {
  id: 'dysuria',
  schemaCode: 'dysuria',
  recordCc: 'dysuria',
  titleTh: 'ปัสสาวะแสบขัด',
  titleEn: 'Dysuria / Painful urination',
  icon: 'flame',
  sectionDomId: 'dysuriaQuestionnaireSection',
  headerTh: 'แบบฟอร์มซักประวัติ: ปัสสาวะแสบขัด',
  headerEn: '(Dysuria & Genitourinary Triage)',
  patientBadgeHtml: '<i data-lucide="flame" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-amber-500"></i><span class="whitespace-nowrap">ปัสสาวะแสบขัด</span>',
  doctorCcBadgeHtml: '<i data-lucide="flame" class="w-3.5 h-3.5 mr-1 text-amber-500"></i> CC: ปัสสาวะแสบขัด',
  pmhSectionNumber: 5,
  dateFields: ['dysuriaLmpDate'],
  timeFields: [],
  branchIds: ['dysuria_branch_male', 'dysuria_branch_female'],
  inputIdsToClear: [
    'dysuriaDurationVal',
    'dysuriaLmpDate',
    'dysuria_other_free'
  ],
  getPmhSectionNumber: function() {
    if (typeof document === 'undefined') return 5;
    const mCard = getDysEl('dysuria_branch_male');
    const fCard = getDysEl('dysuria_branch_female');
    if (!mCard || !fCard) return 5;
    const anyVisible = !mCard.classList.contains('hidden') || !fCard.classList.contains('hidden');
    return anyVisible ? 5 : 4;
  },
  onMounted: function() {
    clearDysuriaPainScore();
  },
  onSelectForm: function() {
    syncDysuriaGenderBranches();
  },
  onActivate: function() {
    syncDysuriaGenderBranches();
  },
  onTitleChange: function({ isFemale } = {}) {
    syncDysuriaGenderBranches(isFemale);
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
  seedPatients: dysuriaSeedCases,

  formHtml: `
    <div id="dysuriaQuestionnaireSection" class="hidden space-y-6">
      <div data-cc-top-banner="dysuria">
        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
          <div class="bg-amber-100 text-amber-800 p-2.5 rounded-xl flex-shrink-0 mt-0.5">
            <i data-lucide="alert-circle" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-amber-900 mb-1">คำแนะนำเบื้องต้นระหว่างรอตรวจ</h3>
            <p class="text-xs text-amber-800 leading-relaxed">
              กรุณาดื่มน้ำสะอาดให้เพียงพอหากไม่มีอาการคลื่นไส้อาเจียน และ <strong>ยังไม่ควรปัสสาวะทิ้งก่อนเข้าตรวจ</strong> เพื่อเตรียมพร้อมกรณีแพทย์สั่งเก็บปัสสาวะส่งตรวจ หรือติดต่อพยาบาลเพื่อขอกระปุกเก็บสิ่งส่งตรวจก่อนปัสสาวะ หากมีไข้สูงหนาวสั่น ปวดบั้นเอวรุนแรง ปัสสาวะเป็นลิ่มเลือดสด หรือหน้ามืดวูบ กรุณาแจ้งพยาบาลทันที
            </p>
          </div>
        </div>
      </div>

      <!-- CARD 1: ระยะเวลา จังหวะที่แสบขัด และระดับความปวดแสบ -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="clock" class="w-5 h-5"></i>
          </div>
          <h2 class="text-base font-bold text-slate-900">1. ระยะเวลา จังหวะที่แสบขัด และระดับความปวดแสบ</h2>
        </div>

        <div class="space-y-4">
          <div>
            ${renderDysSysHeader({
              label: '1.1 ระยะเวลาที่มีอาการปัสสาวะแสบขัดในครั้งนี้',
              icon: 'clock',
              colorClass: 'bg-sky-100 text-sky-700'
            })}
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div class="col-span-1 sm:col-span-2">
                <input type="number" id="dysuriaDurationVal" min="1" max="1000" placeholder="ระบุตัวเลข เช่น 1"
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm placeholder:text-slate-400 placeholder:font-normal">
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

          <div class="pt-4 border-t border-slate-100">
            ${renderDysSysHeader({
              label: '1.2 จังหวะที่รู้สึกปัสสาวะแสบขัด',
              icon: 'flame',
              colorClass: 'bg-sky-100 text-sky-700'
            })}
            ${renderDysGrid('grid-cols-1 sm:grid-cols-2', [
              { kind: 'radio', name: 'dysuriaTiming', value: 'timing_initial', title: ['แสบช่วงแรก', 'ที่เริ่มปัสสาวะ'] },
              { kind: 'radio', name: 'dysuriaTiming', value: 'timing_terminal', title: ['แสบเกร็งช่วงท้าย', 'ตอนปัสสาวะใกล้สุด'] },
              { kind: 'radio', name: 'dysuriaTiming', value: 'timing_throughout', title: ['แสบขัดตลอดเวลา', 'ตั้งแต่เริ่มจนสุด'] },
              { kind: 'radio', name: 'dysuriaTiming', value: 'timing_external_vulvar', title: ['แสบเฉพาะผิวภายนอก', 'เมื่อปัสสาวะ', 'โดนแผล'] }
            ])}
          </div>

          <div class="pt-4 border-t border-slate-100">
            <div class="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label class="block text-xs sm:text-sm font-bold text-slate-800">1.3 ระดับความเจ็บปวดแสบในขณะนี้ (Pain Score: 0–10)</label>
                <div class="flex items-center space-x-2">
                  <span id="dysuriaPainScoreBadge" class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all">
                    <span id="dysuriaPainScoreEmoji" class="text-base">⚪</span>
                    <span id="dysuriaPainScoreText">ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)</span>
                  </span>
                  <button type="button" id="dysuriaPainScoreClearBtn" onclick="clearDysuriaPainScore()" class="text-xs text-slate-500 hover:text-slate-800 underline hidden transition" title="ล้างค่าเพื่อให้เป็นไม่ได้ระบุ">ล้างค่า</button>
                </div>
              </div>
              <div class="px-1 pt-1">
                <input type="range" id="dysuriaPainScore" min="0" max="10" value="0" step="1" oninput="handleDysuriaPainScoreChange(this.value)"
                  class="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-600 focus:outline-none focus:ring-2 focus:ring-medical-500">
              </div>
              <div class="grid grid-cols-5 text-center text-[10px] sm:text-[11px] pt-1 gap-1 text-slate-500 font-medium">
                <div class="cursor-pointer hover:text-medical-600 transition" onclick="setDysuriaPainScore(0)"><span class="text-lg sm:text-xl block">😊</span><span>0: สบายดี</span></div>
                <div class="cursor-pointer hover:text-medical-600 transition" onclick="setDysuriaPainScore(2)"><span class="text-lg sm:text-xl block">🙂</span><span>1–3: เล็กน้อย</span></div>
                <div class="cursor-pointer hover:text-medical-600 transition" onclick="setDysuriaPainScore(5)"><span class="text-lg sm:text-xl block">😐</span><span>4–6: ปานกลาง</span></div>
                <div class="cursor-pointer hover:text-medical-600 transition" onclick="setDysuriaPainScore(8)"><span class="text-lg sm:text-xl block">😣</span><span>7–9: ปวดมาก</span></div>
                <div class="cursor-pointer hover:text-medical-600 transition" onclick="setDysuriaPainScore(10)"><span class="text-lg sm:text-xl block">😭</span><span>10: ปวดที่สุด</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 2: อาการขับถ่ายปัสสาวะ และลักษณะน้ำปัสสาวะ -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="droplet" class="w-5 h-5"></i>
          </div>
          <h2 class="text-base font-bold text-slate-900">2. อาการขับถ่ายปัสสาวะ และลักษณะน้ำปัสสาวะ</h2>
        </div>

        <div class="space-y-4">
          <div>
            ${renderDysSysHeader({
              label: '2.1 อาการผิดปกติในการขับถ่ายปัสสาวะ (เลือกได้หลายข้อ)',
              icon: 'activity',
              colorClass: 'bg-teal-100 text-teal-700',
              toggleId: 'dysuria_luts_none',
              toggleName: 'dysuriaLuts',
              toggleValue: 'dysuria_luts_none',
              toggleLabel: 'ไม่มีอาการในหมวดนี้',
              toggleOnchange: 'handleDysuriaLutsNoneToggle(this)'
            })}
            ${renderDysGrid('grid-cols-1 sm:grid-cols-2', [
              { name: 'dysuriaLuts', value: 'dysuria_freq_urgency', title: ['ปัสสาวะบ่อย /', 'ปวดเบ่งกลั้นไม่อยู่'], onchange: 'handleDysuriaLutsItemChange(this)' },
              { name: 'dysuriaLuts', value: 'dysuria_incomplete_dribble', title: ['ปัสสาวะไม่สุด', 'หยดกะปริบกะปรอย'], onchange: 'handleDysuriaLutsItemChange(this)' },
              { name: 'dysuriaLuts', value: 'dysuria_hesitancy_weak_stream', title: ['ปัสสาวะรอนาน /', 'ลำเล็ก ต้องเบ่ง'], onchange: 'handleDysuriaLutsItemChange(this)' },
              { name: 'dysuriaLuts', value: 'dysuria_strangury', title: ['ปวดเบ่งรุนแรง', 'ออกทีละไม่กี่หยด'], onchange: 'handleDysuriaLutsItemChange(this)' },
              { name: 'dysuriaLuts', value: 'dysuria_stone_interruption', title: ['ลำปัสสาวะสะดุด', 'หยุดไหลกะทันหัน'], onchange: 'handleDysuriaLutsItemChange(this)', colSpan2: true }
            ])}
          </div>

          <div class="pt-4 border-t border-slate-100">
            ${renderDysSysHeader({
              label: '2.2 สีและสิ่งผิดปกติในน้ำปัสสาวะ (เลือกได้หลายข้อ)',
              icon: 'droplet',
              colorClass: 'bg-sky-100 text-sky-700',
              toggleId: 'dysuria_urine_none',
              toggleName: 'dysuriaUrineChars',
              toggleValue: 'urine_normal_clear',
              toggleLabel: 'ปัสสาวะใสปกติ',
              toggleOnchange: 'handleDysuriaUrineNoneToggle(this)'
            })}
            ${renderDysGrid('grid-cols-1 sm:grid-cols-3', [
              { name: 'dysuriaUrineChars', value: 'urine_turbid_foul', title: ['ปัสสาวะขุ่นมีตะกอน', '/ กลิ่นเหม็นแรง'], onchange: 'handleDysuriaUrineItemChange(this)' },
              { name: 'dysuriaUrineChars', value: 'urine_gross_hematuria', title: ['ปัสสาวะสีแดงสด /', 'น้ำล้างเนื้อ /', 'มีลิ่มเลือด'], onchange: 'handleDysuriaUrineItemChange(this)' },
              { name: 'dysuriaUrineChars', value: 'urine_gravel_sediment', title: ['มีเศษกรวดทราย', 'ปนออกมา'], onchange: 'handleDysuriaUrineItemChange(this)' }
            ])}
          </div>
        </div>
      </div>

      <!-- CARD 3: อาการร่วมทางร่างกายและสัญญาณเตือนสำคัญ -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="shield-alert" class="w-5 h-5"></i>
          </div>
          <h2 class="text-base font-bold text-slate-900">3. อาการร่วมทางร่างกายและสัญญาณเตือนสำคัญ</h2>
        </div>

        <div>
          ${renderDysSysHeader({
            label: 'อาการร่วมทางร่างกาย (เลือกได้หลายข้อ)',
            icon: 'alert-triangle',
            colorClass: 'bg-amber-100 text-amber-700',
            toggleId: 'dysuria_sys_none',
            toggleName: 'dysuriaSystemicSigns',
            toggleValue: 'dysuria_rf_systemic_none',
            toggleLabel: 'ไม่มีอาการในหมวดนี้',
            toggleOnchange: 'handleDysuriaSystemicNoneToggle(this)'
          })}
          ${renderDysGrid('grid-cols-1 sm:grid-cols-2', [
            { name: 'dysuriaSystemicSigns', value: 'dysuria_rf_high_fever_chills', title: ['ไข้สูง หนาวสั่น', 'หรือตัวเย็นสั่น'], onchange: 'handleDysuriaSystemicItemChange(this)' },
            { name: 'dysuriaSystemicSigns', value: 'dysuria_rf_flank_pain', title: ['ปวดบั้นเอวด้านหลัง', '/ เจ็บสีข้างรุนแรง'], onchange: 'handleDysuriaSystemicItemChange(this)' },
            { name: 'dysuriaSystemicSigns', value: 'dysuria_rf_nausea_vomiting', title: ['คลื่นไส้ อาเจียน'], onchange: 'handleDysuriaSystemicItemChange(this)' },
            { name: 'dysuriaSystemicSigns', value: 'dysuria_rf_perineal_scrotal_severe_pain', title: ['ปวดบวมแดงร้อน', 'ที่ฝีเย็บ(ญ) /', 'ถุงอัณฑะ(ช)'], onchange: 'handleDysuriaSystemicItemChange(this)' },
            { name: 'dysuriaSystemicSigns', value: 'dysuria_rf_hypotension_shock', title: ['หน้ามืด วูบหมดสติ', 'เหงื่อแตกตัวเย็น'], onchange: 'handleDysuriaSystemicItemChange(this)' },
            { name: 'dysuriaSystemicSigns', value: 'dysuria_rf_altered_mental', title: ['ซึมลง สับสน', 'พูดจาไม่รู้เรื่อง'], onchange: 'handleDysuriaSystemicItemChange(this)' }
          ])}
        </div>
      </div>

      <!-- CARD 4 (Male): ข้อมูลเฉพาะเพศชาย (เริ่มต้น hidden) -->
      <div id="dysuria_branch_male" class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hidden">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="user" class="w-5 h-5"></i>
          </div>
          <h2 class="text-base font-bold text-slate-900">4. ข้อมูลเฉพาะเพศชายและทางเดินสืบพันธุ์</h2>
        </div>

        <div>
          ${renderDysSysHeader({
            label: 'อาการหรือประวัติเฉพาะเพศชาย (เลือกได้หลายข้อ)',
            icon: 'user',
            colorClass: 'bg-sky-100 text-sky-700',
            toggleId: 'dysuria_male_none',
            toggleName: 'dysuriaMaleSigns',
            toggleValue: 'male_none',
            toggleLabel: 'ไม่มีอาการในหมวดนี้',
            toggleOnchange: 'handleDysuriaMaleNoneToggle(this)'
          })}
          ${renderDysGrid('grid-cols-1 sm:grid-cols-2', [
            { name: 'dysuriaMaleSigns', value: 'male_urethral_discharge', title: ['มีหนองหรือมูกไหล', 'จากปลายท่อปัสสาวะ'], onchange: 'handleDysuriaMaleItemChange(this)' },
            { name: 'dysuriaMaleSigns', value: 'male_testicular_pain_swelling', title: ['ปวดบวมลูกอัณฑะ', 'หรือเจ็บลึก', 'บริเวณฝีเย็บ'], onchange: 'handleDysuriaMaleItemChange(this)' },
            { name: 'dysuriaMaleSigns', value: 'male_sti_risk', title: ['มีเพศสัมพันธ์', 'ไม่สวมถุงยาง /', 'คู่นอนใหม่'], onchange: 'handleDysuriaMaleItemChange(this)', colSpan2: true }
          ])}
        </div>
      </div>

      <!-- CARD 4 (Female): ข้อมูลเฉพาะสตรี (เริ่มต้น hidden) -->
      <div id="dysuria_branch_female" class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hidden">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-pink-100 text-pink-700 p-2 rounded-xl">
            <i data-lucide="user" class="w-5 h-5"></i>
          </div>
          <h2 class="text-base font-bold text-slate-900">4. ข้อมูลเฉพาะสตรีและทางเดินสืบพันธุ์</h2>
        </div>

        <div class="space-y-4">
          <div>
            ${renderDysSysHeader({
              label: '4.1 ประวัติประจำเดือนและการตั้งครรภ์',
              icon: 'calendar',
              colorClass: 'bg-pink-100 text-pink-700'
            })}
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1.5">วันแรกของประจำเดือนรอบล่าสุด (วว/ดด/ปปปป)</label>
                <input type="text" id="dysuriaLmpDate" placeholder="วว/ดด/ปปปป เช่น 25/10/2026" data-universal-date="true"
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm placeholder:text-slate-400 placeholder:font-normal">
              </div>
              <div class="flex items-end">
                <label class="selectable-card bg-white w-full flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="checkbox" id="dysuriaFemalePregnancyWarning" class="rounded text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0">
                  <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ขาดประจำเดือน / สงสัยว่าตั้งครรภ์</span>
                </label>
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100">
            ${renderDysSysHeader({
              label: '4.2 อาการทางนรีเวชร่วม (เลือกได้หลายข้อ)',
              icon: 'heart-pulse',
              colorClass: 'bg-pink-100 text-pink-700',
              toggleId: 'dysuria_female_none',
              toggleName: 'dysuriaFemaleSigns',
              toggleValue: 'female_none',
              toggleLabel: 'ไม่มีอาการในหมวดนี้',
              toggleOnchange: 'handleDysuriaFemaleNoneToggle(this)'
            })}
            ${renderDysGrid('grid-cols-1 sm:grid-cols-2', [
              { name: 'dysuriaFemaleSigns', value: 'female_vaginal_discharge', title: ['ตกขาวผิดปกติ /', 'สีเหลืองเขียว /', 'กลิ่นเหม็น'], onchange: 'handleDysuriaFemaleItemChange(this)' },
              { name: 'dysuriaFemaleSigns', value: 'female_lower_abd_pelvic_pain', title: ['ปวดหน่วงท้องน้อย', '/ อุ้งเชิงกราน'], onchange: 'handleDysuriaFemaleItemChange(this)' },
              { name: 'dysuriaFemaleSigns', value: 'female_vulvar_ulcer_itching', title: ['มีแผล / ตุ่มน้ำใส', '/ คันแสบภายนอก'], onchange: 'handleDysuriaFemaleItemChange(this)', colSpan2: true }
            ])}
          </div>
        </div>
      </div>

      <!-- อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100">
          <div class="bg-slate-100 text-slate-600 p-2 rounded-xl"><i data-lucide="message-square-plus" class="w-5 h-5"></i></div>
          <h2 class="text-base font-bold text-slate-800">อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2>
        </div>
        <textarea id="dysuria_other_free" rows="2" placeholder="พิมพ์ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)..."
          class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"></textarea>
      </div>
    </div>
  `,

  // --- Collect Intake Hook ---
  collectIntake: function(ctx) {
    ctx = ctx || {};
    const _rawDur = parseFloat(getDysEl('dysuriaDurationVal')?.value);
    const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
    const durationUnit = getDysEl('dysuriaDurationUnit')?.value || 'days';
    const dysuriaTiming = queryDysOne('input[name="dysuriaTiming"]:checked')?.value || '';

    let painScore = null;
    if (dysuriaPainScoreTouched) {
      const pSlider = getDysEl('dysuriaPainScore');
      if (pSlider) painScore = parseInt(pSlider.value, 10);
    }

    const getChecks = (name) => queryDysAll(`input[name="${name}"]:checked`).map(el => el.value);
    const dysuriaLuts = getChecks('dysuriaLuts');
    const dysuriaUrineChars = getChecks('dysuriaUrineChars');
    const dysuriaSystemicSigns = getChecks('dysuriaSystemicSigns');

    const titleEl = getDysEl('patientTitleSelect');
    const titleVal = titleEl ? (titleEl.value || '').trim() : '';
    const resolvedGender = ctx.gender && ctx.gender !== 'ไม่ระบุ'
      ? ctx.gender
      : (titleVal ? (isDysuriaFemaleFromTitle() ? 'หญิง' : 'ชาย') : 'ไม่ระบุ');
    const isFemale = resolvedGender === 'หญิง' || resolvedGender === 'Female';
    const isMale = resolvedGender === 'ชาย' || resolvedGender === 'Male';

    const dysuriaMaleSigns = isFemale ? [] : (isMale ? getChecks('dysuriaMaleSigns') : []);
    const dysuriaFemaleSigns = isFemale ? getChecks('dysuriaFemaleSigns') : [];
    const dysuriaLmpDate = isFemale ? (getDysEl('dysuriaLmpDate')?.value?.trim() || '') : '';
    const dysuriaFemalePregnancyWarning = isFemale ? Boolean(getDysEl('dysuriaFemalePregnancyWarning')?.checked) : false;
    const otherSymptomsFree = getDysEl('dysuria_other_free')?.value?.trim() || ctx.otherSymptomsFree || '';

    const rec = {
      id: ctx.recordId || ctx.id || `case-${Date.now()}`,
      queue_number: ctx.queueNumber || ctx.queue_number || 'ER-NEW',
      hn: ctx.randomHn || ctx.hn || '-',
      name: ctx.patientName || ctx.name || 'ไม่ระบุชื่อ',
      age: ctx.patientAge !== undefined ? ctx.patientAge : (ctx.age !== undefined ? ctx.age : 'ไม่ได้ระบุ'),
      gender: ctx.gender || resolvedGender || 'ไม่ระบุ',
      chief_complaint: 'dysuria',
      chief_complaint_title: 'ปัสสาวะแสบขัด',
      timestamp: new Date().toISOString(),
      status: ctx.recordStatus || ctx.status || 'waiting',
      durationVal,
      durationUnit,
      hospRecordStatus: ctx.hospRecordStatus || 'unspecified',
      underlying: Array.isArray(ctx.underlying) ? ctx.underlying : [],
      drugAllergy: ctx.drugAllergy || 'ไม่ได้ระบุ',
      currentMeds: ctx.currentMeds || 'ไม่ได้ระบุ',
      otherSymptomsFree,
      doctor_notes: ctx.preservedDoctorNotes || ctx.doctor_notes || { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },

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

    updateDysuriaOutputs(rec);
    return rec;
  },

  populateForm: function(patient) {
    if (!patient) return;
    this.resetForm();

    const setVal = (id, val) => {
      const el = getDysEl(id);
      if (el) el.value = val !== undefined && val !== null ? val : '';
    };
    const setRadio = (name, val) => {
      if (!val) return;
      const el = queryDysOne(`input[name="${name}"][value="${val}"]`);
      if (el) el.checked = true;
    };
    const setChkGroup = (name, arr) => {
      if (!Array.isArray(arr)) return;
      queryDysAll(`input[name="${name}"]`).forEach(cb => {
        cb.checked = arr.includes(cb.value);
      });
    };

    setVal('dysuriaDurationVal', patient.durationVal || '');
    setVal('dysuriaDurationUnit', patient.durationUnit || 'days');
    setRadio('dysuriaTiming', patient.dysuriaTiming);

    if (typeof patient.painScore === 'number' && patient.painScore >= 0) {
      setDysuriaPainScore(patient.painScore);
    } else {
      clearDysuriaPainScore();
    }

    setChkGroup('dysuriaLuts', patient.dysuriaLuts);
    setChkGroup('dysuriaUrineChars', patient.dysuriaUrineChars);
    setChkGroup('dysuriaSystemicSigns', patient.dysuriaSystemicSigns);

    if (patient.gender === 'ชาย' || patient.gender === 'Male') {
      syncDysuriaGenderBranches(false);
      setChkGroup('dysuriaMaleSigns', patient.dysuriaMaleSigns);
    } else if (patient.gender === 'หญิง' || patient.gender === 'Female') {
      syncDysuriaGenderBranches(true);
      setVal('dysuriaLmpDate', patient.dysuriaLmpDate || '');
      const pregEl = getDysEl('dysuriaFemalePregnancyWarning');
      if (pregEl) pregEl.checked = Boolean(patient.dysuriaFemalePregnancyWarning);
      setChkGroup('dysuriaFemaleSigns', patient.dysuriaFemaleSigns);
    }

    setVal('dysuria_other_free', patient.otherSymptomsFree || '');
  },

  resetForm: function() {
    this.inputIdsToClear.forEach(id => {
      const el = getDysEl(id);
      if (el) el.value = '';
    });
    const durUnit = getDysEl('dysuriaDurationUnit');
    if (durUnit) durUnit.value = 'days';

    queryDysAll('input[name="dysuriaTiming"]').forEach(r => { r.checked = false; });
    ['dysuriaLuts', 'dysuriaUrineChars', 'dysuriaSystemicSigns', 'dysuriaMaleSigns', 'dysuriaFemaleSigns'].forEach(n => {
      queryDysAll(`input[name="${n}"]`).forEach(cb => { cb.checked = false; });
    });

    const pregEl = getDysEl('dysuriaFemalePregnancyWarning');
    if (pregEl) pregEl.checked = false;

    this.branchIds.forEach(id => {
      const el = getDysEl(id);
      if (el) el.classList.add('hidden');
    });

    clearDysuriaPainScore();
  },

  hydrateForm: function(patient) {
    this.populateForm(patient);
  },

  isRedFlag: function(patient) {
    return evaluateDysuriaRedFlags(patient).length > 0;
  },
  evaluateRedFlags: evaluateDysuriaRedFlags,
  updateOutputs: updateDysuriaOutputs,
  seedPatients: dysuriaSeedCases
};

if (typeof registerCcModule === 'function') {
  registerCcModule(dysuriaModule);
} else if (typeof window !== 'undefined' && typeof window.registerCcModule === 'function') {
  window.registerCcModule(dysuriaModule);
}

if (typeof window !== 'undefined') {
  window.clearDysuriaPainScore = clearDysuriaPainScore;
  window.handleDysuriaPainScoreChange = handleDysuriaPainScoreChange;
  window.setDysuriaPainScore = setDysuriaPainScore;
  window.handleDysuriaLutsNoneToggle = handleDysuriaLutsNoneToggle;
  window.handleDysuriaLutsItemChange = handleDysuriaLutsItemChange;
  window.handleDysuriaUrineNoneToggle = handleDysuriaUrineNoneToggle;
  window.handleDysuriaUrineItemChange = handleDysuriaUrineItemChange;
  window.handleDysuriaSystemicNoneToggle = handleDysuriaSystemicNoneToggle;
  window.handleDysuriaSystemicItemChange = handleDysuriaSystemicItemChange;
  window.handleDysuriaMaleNoneToggle = handleDysuriaMaleNoneToggle;
  window.handleDysuriaMaleItemChange = handleDysuriaMaleItemChange;
  window.handleDysuriaFemaleNoneToggle = handleDysuriaFemaleNoneToggle;
  window.handleDysuriaFemaleItemChange = handleDysuriaFemaleItemChange;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = dysuriaModule;
}
