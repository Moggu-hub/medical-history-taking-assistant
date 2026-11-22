// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 17_urinary_retention.js
// อาการนำ: ปัสสาวะไม่ออก / เล็ดราด / กะปริดกะปรอย (Urinary Retention)
// ปรับปรุงตามมาตรฐาน plan_urinary_retention.md, plan-cc และ code-cc (กลุ่ม B2)
// =========================================================================

// --- Internal DOM & UI Helpers ---
function getUrEl(id) {
  return typeof document !== 'undefined' ? document.getElementById(id) : null;
}

function queryUrOne(selector) {
  return typeof document !== 'undefined' ? document.querySelector(selector) : null;
}

function queryUrAll(selector) {
  return typeof document !== 'undefined' ? Array.from(document.querySelectorAll(selector)) : [];
}

function wrapUrWords(chunks) {
  if (!Array.isArray(chunks)) return chunks;
  return chunks.map(c => `<span class="inline-block whitespace-nowrap">${c}</span>`).join(' ');
}

function renderUrOption(cfg) {
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
  const titleHtml = Array.isArray(title) ? wrapUrWords(title) : title;
  const bodyHtml = desc
    ? `<div class="ml-3 leading-snug"><span class="block text-xs sm:text-sm font-semibold text-slate-800">${titleHtml}</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">${desc}</span></div>`
    : `<span class="ml-3 ${compact ? 'text-xs' : 'text-xs sm:text-sm'} font-semibold text-slate-800 leading-snug">${titleHtml}</span>`;
  return `<label class="selectable-card bg-white flex ${alignCls} ${padCls} rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition${spanCls}"><input type="${kind}" ${idAttr}${nameAttr}${valAttr}${chgAttr}class="${topCls}${roundCls}text-medical-600 focus:ring-medical-500 ${szCls} flex-shrink-0">${bodyHtml}</label>`;
}

function renderUrGrid(colsCls, items, shared = {}) {
  return `<div class="grid ${colsCls} gap-2.5">${items.map(it => renderUrOption({ ...shared, ...it })).join('\n')}</div>`;
}

function renderUrSysHeader({
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

function clearUrBranchValues(wrapEl) {
  if (!wrapEl) return;
  wrapEl.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(inp => {
    inp.checked = false;
  });
  wrapEl.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach(inp => {
    inp.value = '';
  });
}

function uncheckUrNone(noneId, noneVal) {
  const noneEl = noneId ? getUrEl(noneId) : null;
  if (noneEl && noneEl.checked) noneEl.checked = false;
  if (noneVal) {
    queryUrAll(`input[value="${noneVal}"]`).forEach(el => { el.checked = false; });
  }
}

// --- Pain Score Slider State & Handlers ---
let urinaryPainScoreTouched = false;

function clearUrinaryPainScore() {
  urinaryPainScoreTouched = false;
  const slider = getUrEl('urinaryPainScore');
  if (slider) slider.value = 0;
  const emojiEl = getUrEl('urinaryPainScoreEmoji');
  const textEl = getUrEl('urinaryPainScoreText');
  const badgeEl = getUrEl('urinaryPainScoreBadge');
  const clearBtn = getUrEl('urinaryPainScoreClearBtn');
  if (emojiEl) emojiEl.textContent = '⚪';
  if (textEl) textEl.textContent = 'ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)';
  if (badgeEl) badgeEl.className = 'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all';
  if (clearBtn) clearBtn.classList.add('hidden');
}

function handleUrinaryPainScoreChange(val) {
  urinaryPainScoreTouched = true;
  const num = parseInt(val, 10);
  const emojiEl = getUrEl('urinaryPainScoreEmoji');
  const textEl = getUrEl('urinaryPainScoreText');
  const badgeEl = getUrEl('urinaryPainScoreBadge');
  const clearBtn = getUrEl('urinaryPainScoreClearBtn');
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
  const slider = getUrEl('urinaryPainScore');
  if (slider) {
    slider.value = score;
    handleUrinaryPainScoreChange(score);
  }
}

// --- Progressive Disclosure & Mutual Exclusion Handlers ---
function handleUrinaryLutsNoneToggle(el) {
  if (el && el.checked) {
    queryUrAll('input[name="urinaryLuts"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleUrinaryLutsItemChange(el) {
  if (el && el.checked) uncheckUrNone('urinaryLutsNoneCb', 'luts_none_acute');
}

function handleUrinaryUrineNoneToggle(el) {
  if (el && el.checked) {
    queryUrAll('input[name="urinaryUrineCharacteristics"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleUrinaryUrineItemChange(el) {
  if (el && el.checked) uncheckUrNone('urinaryUrineNoneCb', 'urine_none_normal');
}

function handleUrinaryNeuroNoneToggle(el) {
  if (el && el.checked) {
    queryUrAll('input[name="urinaryNeuroSigns"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleUrinaryNeuroItemChange(el) {
  if (el && el.checked) uncheckUrNone('urinaryNeuroNoneCb', 'urinary_rf_neuro_none');
}

function handleUrinarySystemicNoneToggle(el) {
  if (el && el.checked) {
    queryUrAll('input[name="urinarySystemicSigns"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleUrinarySystemicItemChange(el) {
  if (el && el.checked) uncheckUrNone('urinarySystemicNoneCb', 'urinary_rf_systemic_none');
}

function handleUrinaryMedsNoneToggle(el) {
  if (el && el.checked) {
    queryUrAll('input[name="urinaryMeds"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleUrinaryMedsItemChange(el) {
  if (el && el.checked) uncheckUrNone('urinaryMedsNoneCb', 'med_none');
}

function handleUrinaryTraumaNoneToggle(el) {
  if (el && el.checked) {
    queryUrAll('input[name="urinaryTrauma"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleUrinaryTraumaItemChange(el) {
  if (el && el.checked) uncheckUrNone('urinaryTraumaNoneCb', 'trauma_none');
}

function handleUrinaryPmhUrologyNoneToggle(el) {
  if (el && el.checked) {
    queryUrAll('input[name="urinaryPmhUrology"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
    const wrap = getUrEl('urinaryPmhOtherWrap');
    if (wrap) {
      wrap.classList.add('hidden');
      clearUrBranchValues(wrap);
    }
  }
}

function handleUrinaryPmhOtherToggle(el) {
  const isChecked = el ? el.checked : (getUrEl('urinaryPmhOtherCb')?.checked || false);
  const wrap = getUrEl('urinaryPmhOtherWrap');
  if (isChecked) uncheckUrNone('urinaryPmhNoneCb', 'pmh_urology_none');
  if (!wrap) return;
  if (isChecked) {
    wrap.classList.remove('hidden');
  } else {
    wrap.classList.add('hidden');
    clearUrBranchValues(wrap);
  }
}

function handleUrinaryPmhItemChange(el) {
  if (el && el.checked) uncheckUrNone('urinaryPmhNoneCb', 'pmh_urology_none');
}

function handleUrinaryGynNoneToggle(el) {
  if (el && el.checked) {
    queryUrAll('input[name="urinaryGynConditions"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleUrinaryGynItemChange(el) {
  if (el && el.checked) uncheckUrNone('urinaryGynNoneCb', 'gyn_none');
}

// --- Red Flag Evaluator (All 5 Criteria Preserved) ---
function evaluateUrinaryRetentionRedFlags(patient) {
  const flags = [];
  if (!patient) return flags;

  const neuroSigns = Array.isArray(patient.urinaryNeuroSigns) ? patient.urinaryNeuroSigns : [];
  const systemicSigns = Array.isArray(patient.urinarySystemicSigns) ? patient.urinarySystemicSigns : [];
  const traumaSigns = Array.isArray(patient.urinaryTrauma) ? patient.urinaryTrauma : [];
  const urineChars = Array.isArray(patient.urinaryUrineCharacteristics) ? patient.urinaryUrineCharacteristics : [];

  // 1. Cauda Equina Syndrome / Acute Spinal Cord Compression
  if (
    neuroSigns.includes('urinary_rf_saddle_anesthesia') ||
    (neuroSigns.includes('urinary_rf_leg_weakness') && neuroSigns.includes('urinary_rf_severe_back_pain')) ||
    neuroSigns.includes('urinary_rf_fecal_incontinence')
  ) {
    flags.push({
      key: 'urinary_rf_cauda_equina',
      level: 1,
      textTh: 'สงสัยภาวะรากประสาทหางม้าถูกกดทับเฉียบพลัน (Suspected Cauda Equina Syndrome)',
      risk: 'เสี่ยงต่ออัมพาตท่อนล่างและการสูญเสียการควบคุมระบบขับถ่ายถาวร (Neurosurgical Emergency)',
      suggestedAction: 'Triage Level 1-2: สวนระบายปัสสาวะอย่างนุ่มนวล, Stat Urgent MRI Lumbosacral spine, ปรึกษาประสาทศัลยแพทย์/ศัลยแพทย์กระดูกสันหลังเพื่อผ่าตัด Decompressive Laminectomy ด่วน'
    });
  }

  // 2. Suspected Urethral Disruption / Straddle Injury (Absolute CI to Blind Urethral Foley)
  if (
    traumaSigns.includes('trauma_meatal_bleeding') ||
    (traumaSigns.includes('trauma_straddle_pelvis') && urineChars.includes('urine_gross_hematuria'))
  ) {
    flags.push({
      key: 'urinary_rf_urethral_trauma_ci',
      level: 1,
      textTh: 'สงสัยการบาดเจ็บหรือฉีกขาดของท่อปัสสาวะ (Suspected Urethral Disruption / Trauma)',
      risk: 'ห้ามใส่สายสวนปัสสาวะทางท่อปัสสาวะเด็ดขาด (Absolute CI to Blind Urethral Catheterization) เพราะอาจทำให้ท่อปัสสาวะฉีกขาดทะลุสมบูรณ์',
      suggestedAction: 'Triage Level 1-2: ห้ามพยายามใส่สาย Foley ทางท่อปัสสาวะ, ปรึกษาศัลยแพทย์ระบบทางเดินปัสสาวะ (Urologist), พิจารณา Retrograde Urethrography (RUG) หรือ Suprapubic Cystostomy'
    });
  }

  // 3. Obstructive Urosepsis / Sepsis Alert
  if (
    systemicSigns.includes('urinary_rf_high_fever_chills') ||
    systemicSigns.includes('urinary_rf_shock_syncope') ||
    (systemicSigns.includes('urinary_rf_flank_pain') && systemicSigns.includes('urinary_rf_altered_mental'))
  ) {
    flags.push({
      key: 'urinary_rf_obstructive_urosepsis',
      level: 1,
      textTh: 'ภาวะติดเชื้อในกระแสเลือดจากการอุดกั้นทางเดินปัสสาวะ (Obstructive Urosepsis / Septic Shock)',
      risk: 'เสี่ยงต่อภาวะช็อก ความดันตก อวัยวะล้มเหลวหลายระบบ และเสียชีวิต',
      suggestedAction: 'Triage Level 1: เปิด IV 2 เส้น, Hemoculture x 2, Broad-spectrum IV Antibiotics ทันที และระบายปัสสาวะที่อุดกั้นด่วนที่สุด (Urgent Decompression)'
    });
  }

  // 4. True Anuria / Severe AKI / Pulmonary Edema
  if (
    patient.urinarySensation === 'painless_anuria' ||
    systemicSigns.includes('urinary_rf_dyspnea_edema')
  ) {
    flags.push({
      key: 'urinary_rf_uremic_anuria',
      level: 2,
      textTh: 'ภาวะไม่มีปัสสาวะ หรือไตวายเฉียบพลันร่วมกับน้ำเกิน (Anuria / Severe AKI / Pulmonary Edema)',
      risk: 'เสี่ยงต่อภาวะโพแทสเซียมในเลือดสูงวิกฤต (Severe Hyperkalemia), เลือดเป็นกรดรุนแรง และปอดบวมน้ำ',
      suggestedAction: 'Triage Level 2: Stat 12-lead EKG, Stat BUN, Cr, Electrolytes, ABG/VBG, เตรียมยาขับโพแทสเซียมและฟอกไตฉุกเฉิน'
    });
  }

  // 5. Blocked Indwelling Catheter with Acute Retention
  if (patient.urinaryCatheterStatus === 'catheter_indwelling_blocked') {
    flags.push({
      key: 'urinary_rf_blocked_catheter',
      level: 3,
      textTh: 'สายสวนปัสสาวะอุดตันเฉียบพลัน (Obstructed Indwelling Foley Catheter)',
      risk: 'เสี่ยงต่อกระเพาะปัสสาวะอักเสบแตก การติดเชื้อย้อนกลับ และความดันโลหิตพุ่งสูงจากความปวด',
      suggestedAction: 'Triage Level 3: ตรวจสายสวนว่าพับหักงอหรือไม่, ล้างสายสวนด้วย NSS ปลอดเชื้อ หรือเปลี่ยนใส่สายสวนใหม่ทันที'
    });
  }

  return flags;
}

// --- Output Rendering Helpers (Zero 🚩/🛑 Outside Red Flags & Zero Raw Enums) ---
function formatUrinaryRetentionOutputBundle(patient) {
  const unitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durationText = patient.durationVal
    ? `${patient.durationVal} ${unitMap[patient.durationUnit] || 'ชั่วโมง'}`
    : 'ไม่ระบุ';

  const sensationMap = {
    acute_painful_retention: 'ปวดแน่นท้องน้อยรุนแรง ปวดเบ่งแต่ไม่มีปัสสาวะออกเลย',
    overflow_dribbling: 'ปวดตึงท้องน้อย มีน้ำปัสสาวะไหลเล็ดซึมทีละน้อย แต่เบ่งไม่ออก',
    painless_anuria: 'ไม่รู้สึกปวดปัสสาวะเลย และไม่มีปัสสาวะออกเลย (ท้องน้อยแฟบปกติ)'
  };

  const lutsMap = {
    luts_hesitancy: 'ปัสสาวะรอนาน ลำพุ่งช้า ลำเล็ก ต้องเบ่ง',
    luts_intermittency: 'ปัสสาวะสะดุด ไหลๆ หยุดๆ ขาดตอน',
    luts_nocturia: 'ตื่นปัสสาวะกลางคืนบ่อย (>2–3 ครั้ง/คืน)',
    luts_stone_history: 'เคยมีนิ่ว เศษกรวดทราย หรือปัสสาวะสะดุดเฉียบพลัน'
  };

  const urineCharMap = {
    urine_gross_hematuria: 'ปัสสาวะมีเลือดสด ลิ่มเลือด หรือสีน้ำล้างเนื้อปน',
    urine_turbid_foul: 'ปัสสาวะขุ่น มีตะกอนขาว หรือกลิ่นเหม็นรุนแรง',
    urine_urethral_discharge: 'มีมูก หนอง หรือน้ำคัดหลั่งผิดปกติจากท่อปัสสาวะ'
  };

  const neuroMap = {
    urinary_rf_saddle_anesthesia: 'ชาบริเวณก้น แก้มก้น รอบทวารหนัก หรือหว่างขา',
    urinary_rf_leg_weakness: 'ขาทั้งสองข้างอ่อนแรง เดินลำบาก',
    urinary_rf_fecal_incontinence: 'กลั้นอุจจาระไม่ได้ มีอุจจาระเล็ดราด',
    urinary_rf_severe_back_pain: 'ปวดหลังช่วงเอวรุนแรงร้าวลงขาทั้งสองข้าง'
  };

  const systemicMap = {
    urinary_rf_high_fever_chills: 'ไข้สูง หนาวสั่นสะท้าน หรือตัวเย็นสั่น',
    urinary_rf_flank_pain: 'ปวดบั้นเอวหรือสีข้างข้างใดข้างหนึ่งรุนแรง',
    urinary_rf_altered_mental: 'ซึมลง สับสน เอะอะโวยวาย',
    urinary_rf_shock_syncope: 'หน้ามืด วูบหมดสติ เหงื่อแตกตัวเย็นซีด',
    urinary_rf_dyspnea_edema: 'หายใจหอบเหนื่อย นอนราบไม่ได้ หรือบวมทั่วตัว'
  };

  const medsMap = {
    med_cold_decongestant: 'ยาแก้หวัด/ลดน้ำมูก/แก้แพ้ (Antihistamines / Decongestants)',
    med_psychiatric_tca: 'ยานอนหลับ/ยาคลายกังวล/ยาต้านซึมเศร้า (TCA / Psychotropics)',
    med_opioids: 'ยาแก้ปวดกลุ่มมอร์ฟีน/ทรามาดอล (Opioids / Tramadol)',
    med_alcohol_binge: 'ดื่มแอลกอฮอล์ปริมาณมากก่อนเริ่มอาการ',
    med_anesthesia_recent: 'เพิ่งผ่าตัด ดมยาสลบ หรือฉีดยาชาบล็อกหลังใน 24–48 ชม.'
  };

  const traumaMap = {
    trauma_straddle_pelvis: 'อุบัติเหตุกระแทกเชิงกราน หว่างขา หรือตกคร่อมของแข็ง',
    trauma_meatal_bleeding: 'มีเลือดสดซึมจากรูเปิดท่อปัสสาวะ'
  };

  const catheterMap = {
    catheter_none: 'ไม่ได้คาสายสวนปัสสาวะ',
    catheter_indwelling_blocked: 'คาสายสวนปัสสาวะเดิมอยู่ แต่น้ำปัสสาวะไม่ไหลลงถุง ปวดแน่นท้องน้อย',
    catheter_intermittent_cic: 'สวนปัสสาวะทิ้งเป็นระยะด้วยตนเอง'
  };

  const pmhUrologyMap = {
    pmh_bph_prostate: 'โรคต่อมลูกหมากโต (BPH) หรือมะเร็งต่อมลูกหมาก',
    pmh_urethral_stricture: 'ท่อปัสสาวะตีบ หรือเคยขยายท่อปัสสาวะ',
    pmh_urinary_stone: 'โรคนิ่วในระบบทางเดินปัสสาวะ',
    pmh_neurogenic_bladder: 'กระเพาะปัสสาวะจากระบบประสาท (เบาหวาน/สโตรก/กระดูกสันหลัง)',
    pmh_urology_other: patient.urinaryPmhOtherText ? `โรคทางเดินปัสสาวะเดิมอื่นๆ: ${patient.urinaryPmhOtherText}` : 'โรคทางเดินปัสสาวะเดิมอื่นๆ'
  };

  const gynMap = {
    gyn_pelvic_organ_prolapse: 'มดลูกหย่อน/ก้อนยื่นช่องคลอด',
    gyn_genital_herpes: 'แผลพุพองหรือแผลเริมที่อวัยวะเพศภายนอก'
  };

  const neuroSigns = Array.isArray(patient.urinaryNeuroSigns) ? patient.urinaryNeuroSigns : [];
  const systemicSigns = Array.isArray(patient.urinarySystemicSigns) ? patient.urinarySystemicSigns : [];
  const meds = Array.isArray(patient.urinaryMeds) ? patient.urinaryMeds : [];
  const trauma = Array.isArray(patient.urinaryTrauma) ? patient.urinaryTrauma : [];
  const pmhUrology = Array.isArray(patient.urinaryPmhUrology) ? patient.urinaryPmhUrology : [];
  const luts = Array.isArray(patient.urinaryLuts) ? patient.urinaryLuts : [];
  const urineChars = Array.isArray(patient.urinaryUrineCharacteristics) ? patient.urinaryUrineCharacteristics : [];
  const gynConditions = Array.isArray(patient.urinaryGynConditions) ? patient.urinaryGynConditions : [];

  // Pertinent Positives & Negatives (Zero 🚩 / 🛑!)
  const positives = [];
  const negatives = [];

  luts.forEach(k => {
    if (k !== 'luts_none_acute' && lutsMap[k]) positives.push(lutsMap[k]);
  });
  if (luts.includes('luts_none_acute')) negatives.push('ไม่มีอาการปัสสาวะลำบากนำมาก่อนหน้า (เฉียบพลัน)');

  urineChars.forEach(k => {
    if (k !== 'urine_none_normal' && urineCharMap[k]) positives.push(urineCharMap[k]);
  });
  if (urineChars.includes('urine_none_normal')) negatives.push('ปัสสาวะใสปกติ ไม่มีเลือดหรือหนอง');

  neuroSigns.forEach(k => {
    if (k !== 'urinary_rf_neuro_none' && neuroMap[k]) positives.push(neuroMap[k]);
  });
  if (neuroSigns.includes('urinary_rf_neuro_none')) negatives.push('ปฏิเสธชาบริเวณก้น ขาไม่อ่อนแรง กลั้นอุจจาระได้ปกติ');

  systemicSigns.forEach(k => {
    if (k !== 'urinary_rf_systemic_none' && systemicMap[k]) positives.push(systemicMap[k]);
  });
  if (systemicSigns.includes('urinary_rf_systemic_none')) negatives.push('ปฏิเสธไข้หนาวสั่น ไม่อ่อนเพลียรุนแรง');

  trauma.forEach(k => {
    if (k !== 'trauma_none' && traumaMap[k]) positives.push(traumaMap[k]);
  });
  if (trauma.includes('trauma_none')) negatives.push('ปฏิเสธอุบัติเหตุกระแทกเชิงกราน/หว่างขา');

  if (patient.urinaryCatheterStatus && patient.urinaryCatheterStatus !== 'catheter_none') {
    if (catheterMap[patient.urinaryCatheterStatus]) positives.push(catheterMap[patient.urinaryCatheterStatus]);
  } else if (patient.urinaryCatheterStatus === 'catheter_none') {
    negatives.push('ไม่ได้คาสายสวนปัสสาวะเดิม');
  }

  if (patient.gender === 'หญิง' || patient.gender === 'Female') {
    if (patient.urinaryLmpDate) positives.push(`ประจำเดือนครั้งสุดท้าย (LMP): ${patient.urinaryLmpDate}`);
    if (patient.urinaryFemalePregnancyWarning) positives.push('ขาดประจำเดือนหรือสงสัยภาวะตั้งครรภ์');
    gynConditions.forEach(k => {
      if (k !== 'gyn_none' && gynMap[k]) positives.push(gynMap[k]);
    });
    if (gynConditions.includes('gyn_none')) negatives.push('ไม่มีภาวะมดลูกหย่อนหรือแผลอวัยวะเพศภายนอก');
  }

  if (meds.includes('med_none')) negatives.push('ปฏิเสธยาแก้หวัด ยานอนหลับ หรือสารกระตุ้นใน 24–48 ชม.');
  if (pmhUrology.includes('pmh_urology_none')) negatives.push('ปฏิเสธโรคระบบทางเดินปัสสาวะเดิม');
  if (patient.otherSymptomsFree) positives.push(patient.otherSymptomsFree);

  patient.pertinentPositives = positives.length > 0 ? positives : ['ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม'];
  patient.pertinentNegatives = negatives.length > 0 ? negatives : ['ผู้ป่วยไม่ได้ระบุคำตอบยืนยันในหมวดอาการร่วม'];

  const redFlags = evaluateUrinaryRetentionRedFlags(patient);
  patient.redFlags = redFlags;

  const docNotes = patient.doctor_notes || {};
  const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ') ? 'ไม่ได้ระบุ' : patient.currentMeds;
  const hospLabel = {
    complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน',
    additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
    has_history: 'มีประวัติการรักษาเดิมที่ รพ.ราชบุรี',
    first_time: 'มารับการตรวจที่ รพ.ราชบุรี ครั้งแรก',
    self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด'
  }[patient.hospRecordStatus] || 'ไม่ได้ระบุ';

  const udExplicitDeny = Array.isArray(patient.underlying) && patient.underlying.some(u => u && u.includes('ปฏิเสธ'));
  let udDisplay = (patient.hospRecordStatus === 'self' || patient.hospRecordStatus === 'additional' || udExplicitDeny) ? 'ปฏิเสธ' : 'ไม่ได้ระบุ';
  if (patient.underlying && patient.underlying.length > 0) {
    const filteredUd = (Array.isArray(patient.underlying) ? patient.underlying : [patient.underlying])
      .filter(u => u && !u.includes('ปฏิเสธ') && u !== 'ไม่มี' && u !== 'ไม่มีโรคประจำตัว');
    if (filteredUd.length > 0) udDisplay = filteredUd.join(', ');
  }
  const allergyDisplay = (!patient.drugAllergy || patient.drugAllergy === 'ไม่ได้ระบุ')
    ? 'ไม่ได้ระบุ'
    : ((patient.drugAllergy.includes('ปฏิเสธ') || patient.drugAllergy === 'ไม่มี') ? 'ปฏิเสธ' : patient.drugAllergy);

  const uroPmhList = pmhUrology.filter(k => k !== 'pmh_urology_none').map(k => pmhUrologyMap[k]).filter(Boolean);
  const uroPmhText = uroPmhList.length > 0 ? uroPmhList.join(', ') : (pmhUrology.includes('pmh_urology_none') ? 'ปฏิเสธ' : 'ไม่ได้ระบุ');
  const uroMedsList = meds.filter(k => k !== 'med_none').map(k => medsMap[k]).filter(Boolean);
  const uroMedsText = uroMedsList.length > 0 ? uroMedsList.join(', ') : (meds.includes('med_none') ? 'ปฏิเสธ' : 'ไม่ได้ระบุ');

  const hasPainScore = patient.painScore !== null && patient.painScore !== undefined;
  const sensationLabel = sensationMap[patient.urinarySensation] || 'ไม่ได้ระบุ';

  const defaultRapid =
`[Chief Complaint (CC)]
ปัสสาวะไม่ออก / เล็ดราด / กะปริดกะปรอย มา ${durationText}

[History of Present Illness (HPI)]
• ลักษณะอาการ: ${sensationLabel}${hasPainScore ? ` (Pain Score: ${patient.painScore}/10)` : ''}

• Pertinent Positives:
${positives.length > 0 ? positives.map(p => `  - ${p}`).join('\n') : '  - ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม'}

• Pertinent Negatives:
${patient.pertinentNegatives.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• โรคระบบทางเดินปัสสาวะเดิม: ${uroPmhText}
• ยา/สารกระตุ้นก่อนเกิดอาการ: ${uroMedsText}
• โรคประจำตัว (U/D): ${udDisplay}
• ยาประจำตัว (Current Meds): ${medsText}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${allergyDisplay}

[Emergency Risk Assessment (Red Flags)]
${redFlags.length > 0
  ? `🚩 RED FLAGS DETECTED:\n${redFlags.map(rf => `  * ${rf.textTh}\n    ความเสี่ยง: ${rf.risk}`).join('\n')}`
  : '✓ ไม่พบสัญญาณวิกฤต (No Immediate Red Flag)'}

[Doctor's Clinical Addendum & Exam]
• ประวัติเพิ่มเติม/แก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}
• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}
• แผนการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

  const genderLabel = (patient.gender && patient.gender !== 'ไม่ระบุ') ? patient.gender : '';
  let narrative = `ผู้ป่วย${genderLabel} อายุ ${patient.age || 'ไม่ได้ระบุ'} ปี มาด้วยอาการปัสสาวะไม่ออก/เล็ดราด/กะปริดกะปรอย มา ${durationText} ลักษณะ: ${sensationLabel}`;
  if (hasPainScore) narrative += ` (Pain Score ${patient.painScore}/10)`;
  narrative += '.';
  if (positives.length > 0) narrative += ` อาการร่วมและประวัติสำคัญ: ${positives.join('; ')}.`;
  if (negatives.length > 0) narrative += ` อาการปฏิเสธสำคัญ: ${negatives.join(', ')}.`;
  narrative += `\nประวัติเดิม: ${hospLabel}, โรคทางเดินปัสสาวะ: ${uroPmhText}, ยากระตุ้น 24–48 ชม.: ${uroMedsText}, โรคประจำตัว: ${udDisplay}, ยาประจำตัว: ${medsText}, แพ้ยา: ${allergyDisplay}.`;
  if (redFlags.length > 0) {
    narrative += `\n[แจ้งเตือนความเสี่ยงสูง]: ${redFlags.map(rf => rf.textTh).join(', ')}`;
  }

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
      age: patient.age !== undefined ? patient.age : null,
      gender: patient.gender || null
    },
    retention_assessment: {
      sensation_type: patient.urinarySensation || null,
      pain_score: hasPainScore ? patient.painScore : null,
      preceding_luts: luts,
      urine_characteristics: urineChars,
      neuro_spinal_signs: neuroSigns,
      systemic_infection_signs: systemicSigns,
      medications_and_triggers: meds,
      trauma_signs: trauma,
      catheter_status: patient.urinaryCatheterStatus || null,
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

  return { defaultRapid, narrative, jsonOutput };
}

function updateUrinaryRetentionOutputs(patient) {
  if (!patient) return { rapid: '', narrative: '', json: null };
  const { defaultRapid, narrative, jsonOutput } = formatUrinaryRetentionOutputBundle(patient);
  const finalRapid = patient.custom_rapid_note || defaultRapid;
  const finalNarrative = patient.custom_narrative_note || narrative;
  patient.rapidHpi = finalRapid;
  patient.narrativeHpi = finalNarrative;
  patient.medicalJson = jsonOutput;

  if (typeof document !== 'undefined') {
    const rapidEl = getUrEl('rapidTextView');
    const narrativeEl = getUrEl('narrativeTextView');
    const jsonEl = getUrEl('jsonViewer');
    if (rapidEl) rapidEl.value = finalRapid;
    if (narrativeEl) narrativeEl.value = finalNarrative;
    if (jsonEl) jsonEl.textContent = JSON.stringify(jsonOutput, null, 2);
  }
  return { rapid: finalRapid, narrative: finalNarrative, json: jsonOutput };
}

// --- Seed Patient Cases (4 Cases Preserved) ---
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
    hospRecordStatus: 'self',
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
    hospRecordStatus: 'self',
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
    hospRecordStatus: 'self',
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
    hospRecordStatus: 'self',
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

// --- Patient Form HTML Builder (4 Main Cards + Female Card + Additional Notes) ---
function buildUrinaryRetentionFormHtml() {
  return `
    <div id="urinaryRetentionQuestionnaireSection" class="hidden space-y-6">
      <div data-cc-top-banner="urinary_retention">
        <div class="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-3 shadow-sm">
          <i data-lucide="alert-triangle" class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"></i>
          <div class="text-xs sm:text-sm text-amber-900 leading-relaxed">
            <span class="font-bold block mb-0.5">คำแนะนำจุดคัดกรองฉุกเฉิน:</span>
            หากท่านมีอาการ <strong>ปัสสาวะไม่ออก</strong> ร่วมกับ <strong>ปวดท้องน้อยมาก</strong> หรือ <strong>ชาบริเวณก้น/หว่างขา ขาอ่อนแรงทั้งสองข้าง มีไข้สูงหนาวสั่น</strong> กรุณาแจ้งพยาบาลคัดกรองเพื่อประเมินความฉุกเฉิน
          </div>
        </div>
      </div>

      <!-- Card 1: Duration, Voiding Sensation & Pain Score -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
        <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="clock" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">1. ระยะเวลา ความรู้สึกปวดตึงท้องน้อย และระดับความปวด</h2>
            <p class="text-xs text-slate-500">ระบุระยะเวลาตั้งแต่ปัสสาวะออกครั้งสุดท้ายและระดับความปวดแน่นท้องน้อย</p>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-800 mb-1.5">ปัสสาวะไม่ออกหรือเริ่มมีอาการมานานเท่าไรแล้ว</label>
          <div class="flex items-center gap-2 max-w-sm">
            <input type="number" id="urinaryDurationVal" min="1" max="999" placeholder="เช่น 6" class="w-28 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500">
            <select id="urinaryDurationUnit" class="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
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
          <label class="block text-xs font-semibold text-slate-800 mb-1.5">ความรู้สึกปวดและความตึงแน่นบริเวณท้องน้อย</label>
          ${renderUrGrid('grid-cols-1', [
            { kind: 'radio', name: 'urinarySensation', value: 'acute_painful_retention', title: ['ปวดแน่นท้องน้อย', 'ปวดเบ่งแต่ไม่มีออก'], desc: 'ปวดเบ่งตลอดเวลา ไม่มีปัสสาวะออกเลยแม้แต่หยดเดียว' },
            { kind: 'radio', name: 'urinarySensation', value: 'overflow_dribbling', title: ['ปวดตึงท้องน้อย', 'ไหลเล็ดซึมทีละน้อย'], desc: 'เบ่งไม่ออกและไม่โล่งท้อง มีหยดซึมค้างตลอด' },
            { kind: 'radio', name: 'urinarySensation', value: 'painless_anuria', title: ['ไม่รู้สึกปวดปัสสาวะ', 'และไม่มีปัสสาวะเลย'], desc: 'ท้องน้อยแฟบปกติ ไม่มีน้ำปัสสาวะออกมาเลย' }
          ])}
        </div>

        <!-- Pain Score Slider -->
        <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label class="block text-xs font-semibold text-slate-800">ระดับความปวดแน่นท้องน้อยในขณะนี้ (0–10)</label>
            <div class="flex items-center space-x-2">
              <span id="urinaryPainScoreBadge" class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all">
                <span id="urinaryPainScoreEmoji" class="text-base">⚪</span>
                <span id="urinaryPainScoreText">ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)</span>
              </span>
              <button type="button" id="urinaryPainScoreClearBtn" onclick="clearUrinaryPainScore()" class="text-xs text-slate-500 hover:text-slate-800 underline hidden transition">ล้างค่า</button>
            </div>
          </div>
          <div class="px-1 pt-1">
            <input type="range" id="urinaryPainScore" min="0" max="10" value="0" step="1" oninput="handleUrinaryPainScoreChange(this.value)" class="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-600 focus:outline-none focus:ring-2 focus:ring-medical-500">
          </div>
          <div class="grid grid-cols-5 text-center text-[10px] sm:text-[11px] pt-1 gap-1 text-slate-500 font-medium">
            <div class="cursor-pointer hover:text-medical-600 transition" onclick="setUrinaryPainScore(0)"><span class="text-lg block">😊</span><span>0: สบายดี</span></div>
            <div class="cursor-pointer hover:text-medical-600 transition" onclick="setUrinaryPainScore(2)"><span class="text-lg block">🙂</span><span>1-3: น้อย</span></div>
            <div class="cursor-pointer hover:text-medical-600 transition" onclick="setUrinaryPainScore(5)"><span class="text-lg block">😐</span><span>4-6: กลาง</span></div>
            <div class="cursor-pointer hover:text-medical-600 transition" onclick="setUrinaryPainScore(8)"><span class="text-lg block">😣</span><span>7-9: มาก</span></div>
            <div class="cursor-pointer hover:text-medical-600 transition" onclick="setUrinaryPainScore(10)"><span class="text-lg block">😭</span><span>10: สุดขีด</span></div>
          </div>
        </div>
      </div>

      <!-- Card 2: Preceding LUTS & Urine Characteristics -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
        <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="droplet" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">2. ลักษณะการขับถ่ายเดิม และสิ่งผิดปกติในน้ำปัสสาวะ</h2>
            <p class="text-xs text-slate-500">ประเมินประวัติปัสสาวะขัดเดิมและสีหรือตะกอนที่พบก่อนมีอาการ</p>
          </div>
        </div>

        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          ${renderUrSysHeader({
            label: '2.1 อาการขับถ่ายเดิมก่อนหน้านี้ (เลือกได้หลายข้อ)',
            icon: 'activity',
            colorClass: 'bg-blue-100 text-blue-700',
            toggleId: 'urinaryLutsNoneCb',
            toggleLabel: 'ไม่มีอาการเดิม',
            toggleName: 'urinaryLuts',
            toggleValue: 'luts_none_acute',
            toggleOnchange: 'handleUrinaryLutsNoneToggle(this)'
          })}
          ${renderUrGrid('grid-cols-1 sm:grid-cols-2', [
            { name: 'urinaryLuts', value: 'luts_hesitancy', title: ['ปัสสาวะรอนาน', 'ลำพุ่งช้า ต้องเบ่ง'], onchange: 'handleUrinaryLutsItemChange(this)', compact: true },
            { name: 'urinaryLuts', value: 'luts_intermittency', title: ['ปัสสาวะสะดุด', 'ไหลๆ หยุดๆ ขาดตอน'], onchange: 'handleUrinaryLutsItemChange(this)', compact: true },
            { name: 'urinaryLuts', value: 'luts_nocturia', title: ['ตื่นปัสสาวะกลางคืน', 'มากกว่า 2–3 ครั้ง'], onchange: 'handleUrinaryLutsItemChange(this)', compact: true },
            { name: 'urinaryLuts', value: 'luts_stone_history', title: ['เคยมีนิ่ว กรวดทราย', 'หรือสะดุดเฉียบพลัน'], onchange: 'handleUrinaryLutsItemChange(this)', compact: true }
          ])}
        </div>

        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          ${renderUrSysHeader({
            label: '2.2 สิ่งผิดปกติที่สังเกตเห็นในน้ำปัสสาวะ',
            icon: 'search',
            colorClass: 'bg-amber-100 text-amber-700',
            toggleId: 'urinaryUrineNoneCb',
            toggleLabel: 'ปัสสาวะใสปกติ',
            toggleName: 'urinaryUrineCharacteristics',
            toggleValue: 'urine_none_normal',
            toggleOnchange: 'handleUrinaryUrineNoneToggle(this)'
          })}
          ${renderUrGrid('grid-cols-1 sm:grid-cols-3', [
            { name: 'urinaryUrineCharacteristics', value: 'urine_gross_hematuria', title: ['มีเลือดสด ลิ่มเลือด', 'หรือสีน้ำล้างเนื้อ'], onchange: 'handleUrinaryUrineItemChange(this)', compact: true },
            { name: 'urinaryUrineCharacteristics', value: 'urine_turbid_foul', title: ['ปัสสาวะขุ่น มีตะกอน', 'หรือกลิ่นเหม็นแรง'], onchange: 'handleUrinaryUrineItemChange(this)', compact: true },
            { name: 'urinaryUrineCharacteristics', value: 'urine_urethral_discharge', title: ['มีมูก หนอง', 'จากปลายท่อปัสสาวะ'], onchange: 'handleUrinaryUrineItemChange(this)', compact: true }
          ])}
        </div>
      </div>

      <!-- Card 3: Neurologic & Systemic Warning Signs -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
        <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div class="bg-red-100 text-red-700 p-2 rounded-xl"><i data-lucide="shield-alert" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">3. อาการเตือนทางระบบประสาท การติดเชื้อ และระบบร่างกาย</h2>
            <p class="text-xs text-slate-500">คัดกรองภาวะกดทับไขสันหลังและการติดเชื้อรุนแรง (เลือกได้หลายข้อ)</p>
          </div>
        </div>

        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          ${renderUrSysHeader({
            label: '3.1 อาการทางระบบประสาทและหลัง',
            icon: 'zap',
            colorClass: 'bg-red-100 text-red-700',
            toggleId: 'urinaryNeuroNoneCb',
            toggleLabel: 'ไม่มีอาการในหมวดนี้',
            toggleName: 'urinaryNeuroSigns',
            toggleValue: 'urinary_rf_neuro_none',
            toggleOnchange: 'handleUrinaryNeuroNoneToggle(this)'
          })}
          ${renderUrGrid('grid-cols-1 sm:grid-cols-2', [
            { name: 'urinaryNeuroSigns', value: 'urinary_rf_saddle_anesthesia', title: ['ชาบริเวณก้น', 'รอบทวาร หรือหว่างขา'], onchange: 'handleUrinaryNeuroItemChange(this)', compact: true },
            { name: 'urinaryNeuroSigns', value: 'urinary_rf_leg_weakness', title: ['ขาสองข้างอ่อนแรง', 'หรือเดินลำบาก'], onchange: 'handleUrinaryNeuroItemChange(this)', compact: true },
            { name: 'urinaryNeuroSigns', value: 'urinary_rf_fecal_incontinence', title: ['กลั้นอุจจาระไม่ได้', 'หรือเล็ดราดไม่รู้ตัว'], onchange: 'handleUrinaryNeuroItemChange(this)', compact: true },
            { name: 'urinaryNeuroSigns', value: 'urinary_rf_severe_back_pain', title: ['ปวดหลังเอวรุนแรง', 'ร้าวลงขาสองข้าง'], onchange: 'handleUrinaryNeuroItemChange(this)', compact: true }
          ])}
        </div>

        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          ${renderUrSysHeader({
            label: '3.2 สัญญาณการติดเชื้อและระบบร่างกาย',
            icon: 'thermometer',
            colorClass: 'bg-rose-100 text-rose-700',
            toggleId: 'urinarySystemicNoneCb',
            toggleLabel: 'ไม่มีอาการในหมวดนี้',
            toggleName: 'urinarySystemicSigns',
            toggleValue: 'urinary_rf_systemic_none',
            toggleOnchange: 'handleUrinarySystemicNoneToggle(this)'
          })}
          ${renderUrGrid('grid-cols-1 sm:grid-cols-2', [
            { name: 'urinarySystemicSigns', value: 'urinary_rf_high_fever_chills', title: ['มีไข้สูง หนาวสั่น', 'หรือตัวเย็นสั่น'], onchange: 'handleUrinarySystemicItemChange(this)', compact: true },
            { name: 'urinarySystemicSigns', value: 'urinary_rf_flank_pain', title: ['ปวดบั้นเอวหรือสีข้าง', 'ข้างใดข้างหนึ่ง', 'รุนแรง'], onchange: 'handleUrinarySystemicItemChange(this)', compact: true },
            { name: 'urinarySystemicSigns', value: 'urinary_rf_altered_mental', title: ['ซึมลง สับสน', 'หรือไม่ค่อยรู้ตัว'], onchange: 'handleUrinarySystemicItemChange(this)', compact: true },
            { name: 'urinarySystemicSigns', value: 'urinary_rf_shock_syncope', title: ['หน้ามืด วูบหมดสติ', 'เหงื่อแตกตัวเย็น'], onchange: 'handleUrinarySystemicItemChange(this)', compact: true },
            { name: 'urinarySystemicSigns', value: 'urinary_rf_dyspnea_edema', title: ['หายใจหอบเหนื่อย', 'นอนราบไม่ได้/บวม'], colSpan2: true, onchange: 'handleUrinarySystemicItemChange(this)', compact: true }
          ])}
        </div>
      </div>

      <!-- Card 4: Medications, Trauma, Catheter Status & Urological PMH -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
        <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="file-text" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">4. สิ่งกระตุ้น ประวัติยา อุบัติเหตุ สายสวน และโรคทางเดินปัสสาวะเดิม</h2>
            <p class="text-xs text-slate-500">ตรวจสอบยาที่ใช้ อุบัติเหตุบริเวณเชิงกราน สถานะสายสวน และโรคประจำตัวเฉพาะด้าน</p>
          </div>
        </div>

        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          ${renderUrSysHeader({
            label: '4.1 ยาและสิ่งกระตุ้นใน 24–48 ชั่วโมงที่ผ่านมา',
            icon: 'pill',
            colorClass: 'bg-amber-100 text-amber-700',
            toggleId: 'urinaryMedsNoneCb',
            toggleLabel: 'ไม่ได้ทานยากลุ่มนี้',
            toggleName: 'urinaryMeds',
            toggleValue: 'med_none',
            toggleOnchange: 'handleUrinaryMedsNoneToggle(this)'
          })}
          ${renderUrGrid('grid-cols-1 sm:grid-cols-2', [
            { name: 'urinaryMeds', value: 'med_cold_decongestant', title: ['ยาแก้หวัด / ลดน้ำมูก', '/ ยาแก้แพ้'], desc: 'เช่น CPM, Hydroxyzine, Pseudoephedrine', onchange: 'handleUrinaryMedsItemChange(this)', compact: true },
            { name: 'urinaryMeds', value: 'med_psychiatric_tca', title: ['ยานอนหลับ คลายกังวล', '/ ยาต้านซึมเศร้า'], desc: 'เช่น Amitriptyline', onchange: 'handleUrinaryMedsItemChange(this)', compact: true },
            { name: 'urinaryMeds', value: 'med_opioids', title: ['ยาแก้ปวดกลุ่มมอร์ฟีน', '/ ทรามาดอล'], onchange: 'handleUrinaryMedsItemChange(this)', compact: true },
            { name: 'urinaryMeds', value: 'med_alcohol_binge', title: ['ดื่มแอลกอฮอล์มาก', 'ก่อนเริ่มมีอาการ'], onchange: 'handleUrinaryMedsItemChange(this)', compact: true },
            { name: 'urinaryMeds', value: 'med_anesthesia_recent', title: ['เพิ่งผ่าตัด ดมยาสลบ', 'หรือฉีดยาชาบล็อกหลัง'], colSpan2: true, onchange: 'handleUrinaryMedsItemChange(this)', compact: true }
          ])}
        </div>

        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          ${renderUrSysHeader({
            label: '4.2 ประวัติอุบัติเหตุและการบาดเจ็บเฉพาะที่',
            icon: 'alert-triangle',
            colorClass: 'bg-orange-100 text-orange-700',
            toggleId: 'urinaryTraumaNoneCb',
            toggleLabel: 'ไม่มีอุบัติเหตุ',
            toggleName: 'urinaryTrauma',
            toggleValue: 'trauma_none',
            toggleOnchange: 'handleUrinaryTraumaNoneToggle(this)'
          })}
          ${renderUrGrid('grid-cols-1 sm:grid-cols-2', [
            { name: 'urinaryTrauma', value: 'trauma_straddle_pelvis', title: ['กระแทกเชิงกราน', 'หว่างขา หรือตกคร่อม'], onchange: 'handleUrinaryTraumaItemChange(this)', compact: true },
            { name: 'urinaryTrauma', value: 'trauma_meatal_bleeding', title: ['มีรอยเลือดสดซึม', 'จากปลายท่อปัสสาวะ'], onchange: 'handleUrinaryTraumaItemChange(this)', compact: true }
          ])}
        </div>

        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          ${renderUrSysHeader({ label: '4.3 สถานะการคาสายสวนปัสสาวะในปัจจุบัน', icon: 'sliders', colorClass: 'bg-teal-100 text-teal-700' })}
          ${renderUrGrid('grid-cols-1 sm:grid-cols-3', [
            { kind: 'radio', name: 'urinaryCatheterStatus', value: 'catheter_none', title: ['ไม่ได้คาสายสวน', '(ปัสสาวะเองปกติ)'], compact: true },
            { kind: 'radio', name: 'urinaryCatheterStatus', value: 'catheter_indwelling_blocked', title: ['คาสายสวนเดิมอยู่', 'แต่น้ำไม่ไหล/ปวดตึง'], compact: true },
            { kind: 'radio', name: 'urinaryCatheterStatus', value: 'catheter_intermittent_cic', title: ['สวนปัสสาวะทิ้งเอง', 'เป็นระยะอยู่เดิม'], compact: true }
          ])}
        </div>

        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          ${renderUrSysHeader({
            label: '4.4 ประวัติโรคระบบทางเดินปัสสาวะเดิม',
            icon: 'clipboard-list',
            colorClass: 'bg-indigo-100 text-indigo-700',
            toggleId: 'urinaryPmhNoneCb',
            toggleLabel: 'ไม่มีในหมวดนี้',
            toggleName: 'urinaryPmhUrology',
            toggleValue: 'pmh_urology_none',
            toggleOnchange: 'handleUrinaryPmhUrologyNoneToggle(this)'
          })}
          ${renderUrGrid('grid-cols-1 sm:grid-cols-2', [
            { name: 'urinaryPmhUrology', value: 'pmh_bph_prostate', title: 'โรคต่อมลูกหมากโต หรือมะเร็งต่อมลูกหมาก', onchange: 'handleUrinaryPmhItemChange(this)', compact: true },
            { name: 'urinaryPmhUrology', value: 'pmh_urethral_stricture', title: ['ท่อปัสสาวะตีบ', 'หรือเคยขยายท่อ'], onchange: 'handleUrinaryPmhItemChange(this)', compact: true },
            { name: 'urinaryPmhUrology', value: 'pmh_urinary_stone', title: ['เคยมีนิ่วในระบบ', 'ทางเดินปัสสาวะ'], onchange: 'handleUrinaryPmhItemChange(this)', compact: true },
            { name: 'urinaryPmhUrology', value: 'pmh_neurogenic_bladder', title: 'เบาหวานนาน / โรคหลอดเลือดสมอง / โรคกระดูกสันหลัง', onchange: 'handleUrinaryPmhItemChange(this)', compact: true },
            { id: 'urinaryPmhOtherCb', name: 'urinaryPmhUrology', value: 'pmh_urology_other', title: ['โรคทางเดินปัสสาวะ', 'อื่นๆ (ระบุ)'], colSpan2: true, onchange: 'handleUrinaryPmhOtherToggle(this)', compact: true }
          ])}
          <div id="urinaryPmhOtherWrap" class="hidden mt-3 p-3 bg-white border border-slate-200 rounded-xl">
            <label class="block text-xs font-semibold text-slate-700 mb-1">ระบุรายละเอียดโรคทางเดินปัสสาวะเดิม</label>
            <input type="text" id="urinaryPmhOtherText" placeholder="เช่น เคยผ่าตัดกระเพาะปัสสาวะ หรือกระเพาะปัสสาวะอักเสบเรื้อรัง" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
          </div>
        </div>
      </div>

      <!-- Conditional Card 5 (Female Only) -->
      <div id="urinary_branch_female" class="hidden bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
        <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div class="bg-pink-100 text-pink-700 p-2 rounded-xl"><i data-lucide="heart-pulse" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">5. ข้อมูลเฉพาะสตรี</h2>
            <p class="text-xs text-slate-500">ประเมินประวัติประจำเดือนและภาวะทางนรีเวชที่เกี่ยวข้อง</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div>
            <label class="block text-xs font-semibold text-slate-800 mb-1.5">วันแรกของประจำเดือนรอบล่าสุด (วว/ดด/ปปปป)</label>
            <input type="text" id="urinaryLmpDate" data-universal-date="true" placeholder="เช่น 27/10/2026" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
          </div>
          <div>
            ${renderUrOption({ id: 'urinaryFemalePregnancyWarning', title: ['ขาดประจำเดือน', 'หรือสงสัยตั้งครรภ์'], compact: true })}
          </div>
        </div>

        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          ${renderUrSysHeader({
            label: 'ภาวะทางนรีเวชร่วม',
            icon: 'shield',
            colorClass: 'bg-pink-100 text-pink-700',
            toggleId: 'urinaryGynNoneCb',
            toggleLabel: 'ไม่มีในหมวดนี้',
            toggleName: 'urinaryGynConditions',
            toggleValue: 'gyn_none',
            toggleOnchange: 'handleUrinaryGynNoneToggle(this)'
          })}
          ${renderUrGrid('grid-cols-1 sm:grid-cols-2', [
            { name: 'urinaryGynConditions', value: 'gyn_pelvic_organ_prolapse', title: ['มดลูกหย่อน', '/ ก้อนยื่นช่องคลอด'], onchange: 'handleUrinaryGynItemChange(this)', compact: true },
            { name: 'urinaryGynConditions', value: 'gyn_genital_herpes', title: ['แผลพุพองหรือแผลเริม', 'ที่อวัยวะเพศภายนอก'], onchange: 'handleUrinaryGynItemChange(this)', compact: true }
          ])}
        </div>
      </div>

      <!-- Unnumbered Card: Additional Notes -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100">
          <div class="bg-slate-100 text-slate-600 p-2 rounded-xl"><i data-lucide="message-square-plus" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-800">อาการอื่น ๆ หรือข้อความเพิ่มเติมถึงแพทย์</h2>
            <p class="text-xs text-slate-500">ระบุรายละเอียดอื่นๆ ที่สังเกตเห็น หรือความกังวลเพิ่มเติม (ไม่บังคับ)</p>
          </div>
        </div>
        <textarea id="urinary_other_free" rows="2" placeholder="ระบุอาการ หรือข้อสังเกตเพิ่มเติม (ถ้ามี)..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500"></textarea>
      </div>
    </div>
  `;
}

// --- Registration with Core Engine ---
registerCcModule({
  id: 'urinary_retention',
  recordCc: 'urinary_retention',
  titleTh: 'ปัสสาวะไม่ออก / เล็ดราด / กะปริดกะปรอย',
  titleEn: 'Urinary retention / Overflow dribbling / Inability to void',
  sectionDomId: 'urinaryRetentionQuestionnaireSection',
  headerTh: 'แบบฟอร์มซักประวัติ: ปัสสาวะไม่ออก / เล็ดราด / กะปริดกะปรอย',
  headerEn: '(Urinary Retention & Neurogenic Bladder Triage)',
  patientBadgeHtml: '<i data-lucide="droplet" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-amber-500"></i><span class="whitespace-nowrap">ปัสสาวะไม่ออก/เล็ด</span>',
  doctorCcBadgeHtml: '<i data-lucide="droplet" class="w-4 h-4 mr-1.5 text-amber-500 flex-shrink-0"></i><span class="font-bold text-slate-800">CC: ปัสสาวะไม่ออก / เล็ดราด / กะปริดกะปรอย</span>',
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
    version: '2.1.0',
    redFlagDefinitions: [
      { key: 'urinary_rf_cauda_equina', level: 1, textTh: 'สงสัย Cauda Equina Syndrome / ไขสันหลังถูกกดทับเฉียบพลัน' },
      { key: 'urinary_rf_urethral_trauma_ci', level: 1, textTh: 'สงสัยการบาดเจ็บของท่อปัสสาวะ (ข้อห้ามใส่สายสวน Foley โดยตรง)' },
      { key: 'urinary_rf_obstructive_urosepsis', level: 1, textTh: 'สงสัยภาวะติดเชื้อในกระแสเลือดจากการอุดกั้น (Obstructive Urosepsis)' },
      { key: 'urinary_rf_uremic_anuria', level: 2, textTh: 'ไม่มีปัสสาวะออกมาเลย (True Anuria / เสี่ยงภาวะไตวายเฉียบพลันและเกลือแร่ผิดปกติ)' },
      { key: 'urinary_rf_blocked_catheter', level: 2, textTh: 'สายสวนปัสสาวะอุดตัน (Catheter Obstruction / Encrustation)' }
    ]
  },
  getPmhSectionNumber: function() {
    const fCard = getUrEl('urinary_branch_female');
    return (fCard && !fCard.classList.contains('hidden')) ? 6 : 5;
  },
  onTitleChange: function({ isFemale }) {
    const fCard = getUrEl('urinary_branch_female');
    if (!fCard) return;
    if (isFemale) {
      fCard.classList.remove('hidden');
    } else {
      fCard.classList.add('hidden');
      clearUrBranchValues(fCard);
    }
  },
  resetForm: function() {
    (this.branchIds || []).forEach(id => {
      const el = getUrEl(id);
      if (el) el.classList.add('hidden');
    });
    (this.inputIdsToClear || []).forEach(id => {
      const el = getUrEl(id);
      if (el) el.value = '';
    });
    const durUnit = getUrEl('urinaryDurationUnit');
    if (durUnit) durUnit.value = 'hours';
    clearUrinaryPainScore();
    const root = getUrEl('urinaryRetentionQuestionnaireSection');
    if (root) {
      root.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(inp => { inp.checked = false; });
    }
  },
  clearForm: function() { this.resetForm(); },
  evaluateRedFlags: evaluateUrinaryRetentionRedFlags,
  updateOutputs: updateUrinaryRetentionOutputs,
  seedPatients: urinaryRetentionSeedCases,
  formHtml: buildUrinaryRetentionFormHtml(),

  collectIntake: function(ctx) {
    const c = ctx || {};
    const _rawDur = parseFloat(getUrEl('urinaryDurationVal')?.value);
    const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
    const durationUnit = getUrEl('urinaryDurationUnit')?.value || 'hours';

    const urinarySensation = queryUrOne('input[name="urinarySensation"]:checked')?.value || '';
    const painScore = urinaryPainScoreTouched ? parseInt(getUrEl('urinaryPainScore')?.value, 10) : null;

    const urinaryLuts = queryUrAll('input[name="urinaryLuts"]:checked').map(cb => cb.value);
    const urinaryUrineCharacteristics = queryUrAll('input[name="urinaryUrineCharacteristics"]:checked').map(cb => cb.value);
    const urinaryNeuroSigns = queryUrAll('input[name="urinaryNeuroSigns"]:checked').map(cb => cb.value);
    const urinarySystemicSigns = queryUrAll('input[name="urinarySystemicSigns"]:checked').map(cb => cb.value);
    const urinaryMeds = queryUrAll('input[name="urinaryMeds"]:checked').map(cb => cb.value);
    const urinaryTrauma = queryUrAll('input[name="urinaryTrauma"]:checked').map(cb => cb.value);

    const urinaryCatheterStatus = queryUrOne('input[name="urinaryCatheterStatus"]:checked')?.value || '';
    const urinaryPmhUrology = queryUrAll('input[name="urinaryPmhUrology"]:checked').map(cb => cb.value);
    const urinaryPmhOtherText = getUrEl('urinaryPmhOtherText')?.value?.trim() || '';

    const otherSymptomsFree = getUrEl('urinary_other_free')?.value?.trim() || c.otherSymptomsFree || '';
    const urinaryLmpDate = getUrEl('urinaryLmpDate')?.value?.trim() || '';
    const urinaryFemalePregnancyWarning = Boolean(getUrEl('urinaryFemalePregnancyWarning')?.checked);
    const urinaryGynConditions = queryUrAll('input[name="urinaryGynConditions"]:checked').map(cb => cb.value);

    return {
      id: c.recordId || '',
      queue_number: c.queueNumber || '',
      hn: c.randomHn || '',
      name: c.patientName || '',
      age: c.patientAge !== undefined ? c.patientAge : null,
      gender: c.gender || '',
      chief_complaint: 'urinary_retention',
      chief_complaint_title: 'ปัสสาวะไม่ออก / เล็ดราด / กะปริดกะปรอย',
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
  },

  populateForm: function(patient) {
    if (!patient) return;
    this.resetForm();

    const setVal = (id, val) => {
      const el = getUrEl(id);
      if (el) el.value = (val !== undefined && val !== null) ? val : '';
    };
    const setRadio = (name, val) => {
      if (!val) return;
      const el = queryUrOne(`input[name="${name}"][value="${val}"]`);
      if (el) el.checked = true;
    };
    const setChkGroup = (name, arr) => {
      if (!Array.isArray(arr)) return;
      queryUrAll(`input[name="${name}"]`).forEach(cb => {
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
      const wrap = getUrEl('urinaryPmhOtherWrap');
      if (wrap) wrap.classList.remove('hidden');
      setVal('urinaryPmhOtherText', patient.urinaryPmhOtherText || '');
    }

    setVal('urinary_other_free', patient.otherSymptomsFree || '');

    if (patient.gender === 'หญิง' || patient.gender === 'Female') {
      const fCard = getUrEl('urinary_branch_female');
      if (fCard) fCard.classList.remove('hidden');
      setVal('urinaryLmpDate', patient.urinaryLmpDate || '');
      const pregEl = getUrEl('urinaryFemalePregnancyWarning');
      if (pregEl) pregEl.checked = Boolean(patient.urinaryFemalePregnancyWarning);
      setChkGroup('urinaryGynConditions', patient.urinaryGynConditions);
    }
  },
  hydrateForm: function(patient) { this.populateForm(patient); },
  onSelectForm: function() { this.resetForm(); },
  onActivate: function() {
    if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') lucide.createIcons();
  },
  onMounted: function() { this.onActivate(); },
  init: function() { this.onActivate(); },
  isRedFlag: function(patient) {
    return evaluateUrinaryRetentionRedFlags(patient).length > 0;
  }
});

if (typeof window !== 'undefined') {
  window.clearUrinaryPainScore = clearUrinaryPainScore;
  window.handleUrinaryPainScoreChange = handleUrinaryPainScoreChange;
  window.setUrinaryPainScore = setUrinaryPainScore;
  window.handleUrinaryLutsNoneToggle = handleUrinaryLutsNoneToggle;
  window.handleUrinaryLutsItemChange = handleUrinaryLutsItemChange;
  window.handleUrinaryUrineNoneToggle = handleUrinaryUrineNoneToggle;
  window.handleUrinaryUrineItemChange = handleUrinaryUrineItemChange;
  window.handleUrinaryNeuroNoneToggle = handleUrinaryNeuroNoneToggle;
  window.handleUrinaryNeuroItemChange = handleUrinaryNeuroItemChange;
  window.handleUrinarySystemicNoneToggle = handleUrinarySystemicNoneToggle;
  window.handleUrinarySystemicItemChange = handleUrinarySystemicItemChange;
  window.handleUrinaryMedsNoneToggle = handleUrinaryMedsNoneToggle;
  window.handleUrinaryMedsItemChange = handleUrinaryMedsItemChange;
  window.handleUrinaryTraumaNoneToggle = handleUrinaryTraumaNoneToggle;
  window.handleUrinaryTraumaItemChange = handleUrinaryTraumaItemChange;
  window.handleUrinaryPmhUrologyNoneToggle = handleUrinaryPmhUrologyNoneToggle;
  window.handleUrinaryPmhOtherToggle = handleUrinaryPmhOtherToggle;
  window.handleUrinaryPmhItemChange = handleUrinaryPmhItemChange;
  window.handleUrinaryGynNoneToggle = handleUrinaryGynNoneToggle;
  window.handleUrinaryGynItemChange = handleUrinaryGynItemChange;
}
