// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 19_hematuria.js
// อาการนำ: ปัสสาวะเป็นเลือด (Hematuria / Blood in Urine)
// ปรับปรุงตามมาตรฐาน plan_hematuria.md, plan-cc และ code-cc (กลุ่ม B2)
// =========================================================================

// --- Internal DOM & UI Helpers ---
function getHemEl(id) {
  return typeof document !== 'undefined' ? document.getElementById(id) : null;
}

function queryHemOne(selector) {
  return typeof document !== 'undefined' ? document.querySelector(selector) : null;
}

function queryHemAll(selector) {
  return typeof document !== 'undefined' ? Array.from(document.querySelectorAll(selector)) : [];
}

function wrapHemWords(chunks) {
  if (!Array.isArray(chunks)) return chunks;
  return chunks.map(c => `<span class="inline-block whitespace-nowrap">${c}</span>`).join(' ');
}

function renderHemOption(cfg) {
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
  const titleHtml = Array.isArray(title) ? wrapHemWords(title) : title;
  const bodyHtml = desc
    ? `<div class="ml-3 leading-snug"><span class="block text-xs sm:text-sm font-semibold text-slate-800">${titleHtml}</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">${desc}</span></div>`
    : `<span class="ml-3 ${compact ? 'text-xs' : 'text-xs sm:text-sm'} font-semibold text-slate-800 leading-snug">${titleHtml}</span>`;
  return `<label class="selectable-card bg-white flex ${alignCls} ${padCls} rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition${spanCls}"><input type="${kind}" ${idAttr}${nameAttr}${valAttr}${chgAttr}class="${topCls}${roundCls}text-medical-600 focus:ring-medical-500 ${szCls} flex-shrink-0">${bodyHtml}</label>`;
}

function renderHemGrid(colsCls, items, shared = {}) {
  return `<div class="grid ${colsCls} gap-2.5">${items.map(it => renderHemOption({ ...shared, ...it })).join('\n')}</div>`;
}

function renderHemSysHeader({
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

// --- Pain Score Touch State Tracking ---
let hematuriaPainScoreTouched = false;

function clearHematuriaPainScore() {
  hematuriaPainScoreTouched = false;
  const slider = getHemEl('hematuriaPainScore');
  if (slider) slider.value = 0;
  const emojiEl = getHemEl('hematuriaPainScoreEmoji');
  const textEl = getHemEl('hematuriaPainScoreText');
  const badgeEl = getHemEl('hematuriaPainScoreBadge');
  const clearBtn = getHemEl('hematuriaPainScoreClearBtn');
  if (emojiEl) emojiEl.textContent = '⚪';
  if (textEl) textEl.textContent = 'ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)';
  if (badgeEl) badgeEl.className = 'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all';
  if (clearBtn) clearBtn.classList.add('hidden');
}

function handleHematuriaPainScoreChange(val) {
  hematuriaPainScoreTouched = true;
  const parsed = parseInt(val, 10);
  const num = isNaN(parsed) ? 0 : Math.min(10, Math.max(0, parsed));
  const slider = getHemEl('hematuriaPainScore');
  if (slider && String(slider.value) !== String(num)) slider.value = num;
  const emojiEl = getHemEl('hematuriaPainScoreEmoji');
  const textEl = getHemEl('hematuriaPainScoreText');
  const badgeEl = getHemEl('hematuriaPainScoreBadge');
  const clearBtn = getHemEl('hematuriaPainScoreClearBtn');
  if (clearBtn) clearBtn.classList.remove('hidden');
  if (!emojiEl || !textEl || !badgeEl) return;

  let emoji = '😐', label = 'ปวดปานกลาง', badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
  if (num === 0) { emoji = '😊'; label = 'สบายดี (ไม่ปวดเลย)'; badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300'; }
  else if (num <= 3) { emoji = '🙂'; label = 'ปวดเล็กน้อย (ทนได้)'; badgeClass = 'bg-lime-100 text-lime-800 border-lime-300'; }
  else if (num <= 6) { emoji = '😐'; label = 'ปวดปานกลาง (รบกวนสมาธิ)'; badgeClass = 'bg-amber-100 text-amber-800 border-amber-300'; }
  else if (num <= 9) { emoji = '😣'; label = 'ปวดมาก (ทนแทบไม่ไหว)'; badgeClass = 'bg-rose-100 text-rose-800 border-rose-300'; }
  else { emoji = '😭'; label = 'ปวดรุนแรงที่สุด'; badgeClass = 'bg-red-200 text-red-900 border-red-400 animate-pulse'; }

  emojiEl.textContent = emoji;
  textEl.textContent = `${num} / 10 (${label})`;
  badgeEl.className = `inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border transition ${badgeClass}`;
}

function setHematuriaPainScore(score) {
  hematuriaPainScoreTouched = true;
  const slider = getHemEl('hematuriaPainScore');
  if (slider) {
    slider.value = score;
    handleHematuriaPainScoreChange(score);
  }
}

// --- Progressive Disclosure & Corner-Toggle Mutual Exclusion Handlers ---
function handleHematuriaClotNoneToggle(el) {
  if (el && el.checked) {
    queryHemAll('input[name="hematuriaClotTypes"]').forEach(cb => { cb.checked = false; });
  }
}

function handleHematuriaClotItemChange(el) {
  if (el && el.checked) {
    const noneCb = getHemEl('hematuria_clot_none');
    if (noneCb) noneCb.checked = false;
  }
}

function handleHematuriaObsNoneToggle(el) {
  if (el && el.checked) {
    queryHemAll('input[name="hematuriaObsTypes"]').forEach(cb => { cb.checked = false; });
  }
}

function handleHematuriaObsItemChange(el) {
  if (el && el.checked) {
    const noneCb = getHemEl('hematuria_obs_none');
    if (noneCb) noneCb.checked = false;
  }
}

function handleHematuriaPainMasterChange(val) {
  const subContainer = getHemEl('hematuriaPainSubContainer');
  if (!subContainer) return;
  if (val === 'pain_yes') {
    subContainer.classList.remove('hidden');
  } else {
    subContainer.classList.add('hidden');
    queryHemAll('input[name="hematuriaPainType"]').forEach(rb => { rb.checked = false; });
    clearHematuriaPainScore();
  }
}

function handleHematuriaSystemicNoneToggle(el) {
  if (el && el.checked) {
    queryHemAll('input[name="hematuriaSystemicSigns"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleHematuriaSystemicItemChange(el) {
  if (el && el.checked) {
    const noneCb = getHemEl('hematuria_sys_none') || queryHemOne('input[name="hematuriaSystemicSigns"][value="rf_systemic_none"]');
    if (noneCb) noneCb.checked = false;
  }
}

function handleHematuriaTraumaMasterChange(radioOrVal) {
  const val = typeof radioOrVal === 'string' ? radioOrVal : (radioOrVal && radioOrVal.checked ? radioOrVal.value : '');
  const subContainer = getHemEl('hematuriaTraumaSubContainer');
  if (!subContainer) return;
  if (val === 'trauma_master_yes') {
    subContainer.classList.remove('hidden');
  } else {
    subContainer.classList.add('hidden');
    queryHemAll('input[name="hematuriaTraumaTypes"]').forEach(cb => { cb.checked = false; });
  }
}

function handleHematuriaMedsNoneToggle(el) {
  if (el && el.checked) {
    queryHemAll('input[name="hematuriaMeds"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
    const unkEl = getHemEl('currentMedsUnknown');
    if (unkEl) unkEl.checked = false;
  }
}

function handleHematuriaMedsItemChange(el) {
  if (el && el.checked) {
    const noneCb = getHemEl('hematuria_meds_none') || queryHemOne('input[name="hematuriaMeds"][value="med_bleeding_none"]');
    if (noneCb) noneCb.checked = false;
  }
}

function handleHematuriaMedsUnknownToggle(el) {
  if (el && el.checked) {
    const noneCb = getHemEl('hematuria_meds_none') || queryHemOne('input[name="hematuriaMeds"][value="med_bleeding_none"]');
    if (noneCb) noneCb.checked = false;
  }
}

function handleHematuriaRiskNoneToggle(el) {
  if (el && el.checked) {
    queryHemAll('input[name="hematuriaMalignancyRisks"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleHematuriaRiskItemChange(el) {
  if (el && el.checked) {
    const noneCb = getHemEl('hematuria_risk_none') || queryHemOne('input[name="hematuriaMalignancyRisks"][value="risk_malignancy_none"]');
    if (noneCb) noneCb.checked = false;
  }
}

// --- Gender Branch Synchronization (C-AP13) ---
function isHematuriaFemaleFromTitle() {
  const titleEl = getHemEl('patientTitleSelect');
  const title = titleEl ? (titleEl.value || '').trim() : '';
  return title.includes('นาง') || title.includes('ด.ญ.') || title.includes('Mrs') || title.includes('Ms') || title.includes('Miss');
}

function syncHematuriaGenderBranch(isFemaleOpt) {
  const fBranch = getHemEl('hematuria_branch_female');
  if (!fBranch) return;
  const titleEl = getHemEl('patientTitleSelect');
  const titleVal = titleEl ? (titleEl.value || '').trim() : '';
  const triageEl = getHemEl('triageGenderSelect');
  const triageVal = triageEl ? (triageEl.value || '').trim() : '';

  if (typeof isFemaleOpt !== 'boolean' && !titleVal && !triageVal) {
    fBranch.classList.add('hidden');
    queryHemAll('input[name="hematuriaFemaleBleeding"]').forEach(r => { r.checked = false; });
    return;
  }

  const isFemale = typeof isFemaleOpt === 'boolean'
    ? isFemaleOpt
    : (titleVal ? isHematuriaFemaleFromTitle() : /หญิง|female/i.test(triageVal));

  if (isFemale) {
    fBranch.classList.remove('hidden');
  } else {
    fBranch.classList.add('hidden');
    queryHemAll('input[name="hematuriaFemaleBleeding"]').forEach(r => { r.checked = false; });
  }
}

// --- Clinical Red Flag Evaluator (7 Rules Preserved) ---
function evaluateHematuriaRedFlags(patient) {
  const redFlags = [];
  if (!patient || (patient.chief_complaint && patient.chief_complaint !== 'hematuria' && patient.chief_complaint_title !== 'ปัสสาวะเป็นเลือด')) {
    return redFlags;
  }

  const systemic = Array.isArray(patient.hematuriaSystemicSigns) ? patient.hematuriaSystemicSigns : [];
  const clots = Array.isArray(patient.hematuriaClotTypes) ? patient.hematuriaClotTypes : [];
  const obs = Array.isArray(patient.hematuriaObsTypes) ? patient.hematuriaObsTypes : [];
  const trauma = Array.isArray(patient.hematuriaTraumaTypes) ? patient.hematuriaTraumaTypes : [];
  const meds = Array.isArray(patient.hematuriaMeds) ? patient.hematuriaMeds : [];
  const malignancy = Array.isArray(patient.hematuriaMalignancyRisks) ? patient.hematuriaMalignancyRisks : [];

  const age = parseInt(patient.age, 10) || 0;
  const vs = patient.vital_signs || {};
  const sbp = vs.sbp ? parseInt(vs.sbp, 10) : null;
  const pr = vs.pr ? parseInt(vs.pr, 10) : null;
  const shockIndex = (sbp && pr) ? (pr / sbp) : 0;

  // 1. Hemorrhagic Shock / Hemodynamic Instability
  const hasShockSigns = systemic.includes('rf_syncope_hypotension') || systemic.includes('rf_marked_pallor') ||
    (sbp !== null && sbp < 90) || (pr !== null && pr > 120) || (shockIndex >= 0.9);
  if (hasShockSigns) {
    redFlags.push({
      key: 'rf_hemodynamic_shock',
      level: 1,
      textTh: 'Active Massive Hematuria / เสี่ยงภาวะช็อกจากการเสียเลือด',
      risk: 'เสี่ยงต่อภาวะเสียเลือดเฉียบพลัน ความดันตก และภาวะแทรกซ้อนของภาวะช็อก',
      suggestedAction: 'เปิดเส้น IV สารน้ำเบอร์ใหญ่ (18G) 2 เส้น, เจาะ CBC, Coagulogram, Type & Screen จองเลือด PRC, เตรียมห้อง Resuscitation',
      title: 'Active Massive Hematuria / เสี่ยงภาวะช็อกจากการเสียเลือด',
      severity: 'critical'
    });
  }

  // 2. Clot Retention & Bladder Tamponade
  const hasClotRetention = (patient.hematuriaClotMaster === 'clot_master_yes' && clots.includes('clot_large_amorphous') &&
    (patient.hematuriaObsMaster === 'obs_master_yes' && obs.includes('obs_unable_to_void')));
  if (hasClotRetention) {
    redFlags.push({
      key: 'rf_clot_retention_tamponade',
      level: 1,
      textTh: 'Clot Retention / Bladder Tamponade (ก้อนเลือดอุดตันท่อปัสสาวะเฉียบพลัน)',
      risk: 'กระเพาะปัสสาวะขยายตัวตึงแน่น เสี่ยงต่อภาวะกระเพาะปัสสาวะแตกและไตวายเฉียบพลัน',
      suggestedAction: 'ใส่ Three-way Foley Catheter ขนาด 20-24 Fr ล้างลิ่มเลือด (Manual clot irrigation) และต่อ Continuous Bladder Irrigation (CBI) ทันที',
      title: 'Clot Retention / Bladder Tamponade (ก้อนเลือดอุดตันท่อปัสสาวะเฉียบพลัน)',
      severity: 'critical'
    });
  }

  // 3. Painless Gross Hematuria in Older Adults (Urologic Malignancy Suspicion)
  const isPainless = patient.hematuriaPainType === 'pain_painless';
  const hasMalignancyRisk = age >= 50 || malignancy.includes('risk_heavy_smoker') || malignancy.includes('risk_chemical_dyes');
  if (isPainless && hasMalignancyRisk) {
    redFlags.push({
      key: 'rf_painless_gross_hematuria_malignancy',
      level: 2,
      textTh: 'Painless Gross Hematuria / สงสัยโรคมะเร็งระบบทางเดินปัสสาวะ (Bladder/Renal Cancer)',
      risk: 'เสี่ยงต่อโรคมะเร็งกระเพาะปัสสาวะหรือมะเร็งไตที่ยังไม่แสดงอาการปวด',
      suggestedAction: 'ตรวจ Urinalysis, Urine Cytology, นัดทำ Flexible Cystoscopy และ CT Urogram ภายใน 1-2 สัปดาห์',
      title: 'Painless Gross Hematuria / สงสัยโรคมะเร็งระบบทางเดินปัสสาวะ (Bladder/Renal Cancer)',
      severity: 'high'
    });
  }

  // 4. Acute Glomerulonephritis / Nephritic Syndrome
  const isColaUrine = patient.hematuriaColor === 'color_cola_tea';
  const hasNephriticSigns = systemic.includes('rf_facial_pedal_edema') || systemic.includes('rf_oliguria_anuria') || (sbp !== null && sbp >= 140);
  if (isColaUrine && hasNephriticSigns) {
    redFlags.push({
      key: 'rf_nephritic_syndrome',
      level: 2,
      textTh: 'Nephritic Syndrome / สงสัยภาวะเนื้อไตอักเสบเฉียบพลัน (Glomerulonephritis)',
      risk: 'เสี่ยงต่อภาวะไตวายเฉียบพลัน ความดันโลหิตสูงวิกฤต และน้ำคั่งปอด',
      suggestedAction: 'ตรวจ Urine RBC casts, Proteinuria, BUN/Cr, Electrolytes, C3/C4, ปรึกษาอายุรแพทย์โรคไต',
      title: 'Nephritic Syndrome / สงสัยภาวะเนื้อไตอักเสบเฉียบพลัน (Glomerulonephritis)',
      severity: 'high'
    });
  }

  // 5. Obstructive Urolithiasis with Hematuria (Renal Colic)
  if (patient.hematuriaPainType === 'pain_flank_colic') {
    redFlags.push({
      key: 'rf_obstructive_urolithiasis',
      level: 2,
      textTh: 'Renal / Ureteral Colic with Hematuria (สงสัยนิ่วท่อไตอุดกั้น)',
      risk: 'เสี่ยงต่อการอุดกั้นทางเดินปัสสาวะ ภาวะไตบวมน้ำ (Hydronephrosis) และการติดเชื้อรุนแรง',
      suggestedAction: 'ส่งตรวจ KUB Plain film หรือ CT KUB Non-contrast, ให้ยาแก้ปวด NSAIDs/Opioids IV, เฝ้าระวังไข้ติดเชื้อร่วม',
      title: 'Renal / Ureteral Colic with Hematuria (สงสัยนิ่วท่อไตอุดกั้น)',
      severity: 'medium'
    });
  }

  // 6. Urologic Trauma (Renal or Urethral Disruption)
  const hasTrauma = patient.hematuriaTraumaMaster === 'trauma_master_yes' &&
    (trauma.includes('hist_trauma_flank_pelvis') || trauma.includes('hist_straddle_injury') ||
     trauma.includes('hist_direct_genital_urethral_trauma') || trauma.includes('hist_blood_at_meatus'));
  if (hasTrauma) {
    const isMeatalBleed = trauma.includes('hist_blood_at_meatus') || trauma.includes('hist_straddle_injury');
    redFlags.push({
      key: 'rf_urologic_trauma',
      level: 1,
      textTh: 'Urologic Trauma / สงสัยการบาดเจ็บของไตหรือท่อทางเดินปัสสาวะ',
      risk: 'เสี่ยงต่อการฉีกขาดของไตหรือท่อปัสสาวะ (Urethral / Bladder disruption)',
      suggestedAction: isMeatalBleed
        ? '⚠️ ห้ามใส่สายสวนปัสสาวะทางท่อเด็ดขาด (ห้าม Blind Foley) ต้องทำ Retrograde Urethrogram (RUG) ก่อน'
        : 'ส่งตรวจ CT Abdomen with IV Contrast เพื่อประเมิน Renal injury AAST Grade',
      title: 'Urologic Trauma / สงสัยการบาดเจ็บของไตหรือท่อทางเดินปัสสาวะ',
      severity: 'high'
    });
  }

  // 7. Anticoagulant-Induced Hematuria
  if (meds.includes('med_warfarin') || meds.includes('med_doac')) {
    redFlags.push({
      key: 'rf_anticoagulant_coagulopathy',
      level: 2,
      textTh: 'Anticoagulant-Associated Hematuria / ภาวะเลือดออกจากยาต้านการแข็งตัวของเลือด',
      risk: 'เสี่ยงต่อภาวะเลือดออกต่อเนื่องจากฤทธิ์ยาต้านการแข็งตัวของเลือดเกินขนาด',
      suggestedAction: 'ส่งตรวจ PT/INR, PTT, CBC และสืบค้นพยาธิสภาพทางเดินปัสสาวะซ่อนเร้นเสมอ',
      title: 'Anticoagulant-Associated Hematuria / ภาวะเลือดออกจากยาต้านการแข็งตัวของเลือด',
      severity: 'medium'
    });
  }

  return redFlags;
}

// --- Thai Lookup Dictionaries ---
const HEM_UNIT_MAP = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };

const HEM_COLOR_MAP = {
  color_bright_red: 'สีแดงสด หรือแดงเข้มเหมือนเลือดสด',
  color_pink_wash: 'สีชมพูหรือแดงจาง เหมือนน้ำล้างเนื้อ',
  color_cola_tea: 'สีน้ำตาลเข้ม สีน้ำโคล่า หรือสีน้ำชาแก่',
  color_turbid_cloudy: 'ปัสสาวะขุ่น มีตะกอนสีแดงหรือชมพู'
};

const HEM_TIMING_MAP = {
  timing_total: 'แดงตลอดสายตั้งแต่เริ่มจนสุด (Total hematuria)',
  timing_initial: 'แดงเฉพาะช่วงแรกที่เริ่มปัสสาวะ (Initial hematuria)',
  timing_terminal: 'แดงเฉพาะช่วงท้ายตอนใกล้สุด (Terminal hematuria)',
  timing_intermittent: 'เป็นบางครั้ง สลับกับใสเป็นปกติ (Intermittent)',
  timing_unnoticed: 'ไม่ได้สังเกตช่วงเวลาที่ออกชัดเจน'
};

const HEM_PAIN_MAP = {
  pain_painless: 'ไม่มีอาการปวดใดๆ เลย (Painless gross hematuria)',
  pain_flank_colic: 'ปวดบิดเกร็งบั้นเอวด้านหลังร้าวลงขาหนีบ (Colicky flank pain)',
  pain_suprapubic: 'ปวดตื้อ หน่วง แน่นเกร็งท้องน้อย (Suprapubic pain)',
  pain_dysuria_burning: 'ปวดแสบขัด แสบร้อนปลายท่อปัสสาวะ (Dysuria)'
};

const HEM_CLOT_MAP = {
  clot_small_specks: 'มีลิ่มเลือดปนเป็นขุยหรือเส้นเล็กๆ',
  clot_large_amorphous: 'มีลิ่มเลือดก้อนใหญ่วุ้นหนาหรือแผ่นลิ่มเลือดสีคล้ำ',
  clot_vermiform_string: 'มีลิ่มเลือดเส้นยาวคล้ายตัวหนอน (Ureteral clot cast)'
};

const HEM_OBS_MAP = {
  obs_unable_to_void: 'ปัสสาวะไม่ออกเลย ปวดเบ่งตึงแน่นท้องน้อยรุนแรง (Acute Clot Retention)',
  obs_interrupted_stream: 'ลำปัสสาวะสะดุดหยุดไหลกะทันหัน',
  obs_straining_dribbling: 'ต้องออกแรงเบ่งมาก ปัสสาวะออกทีละหยด'
};

const HEM_SYS_MAP = {
  rf_high_fever_chills: 'มีไข้สูง หนาวสั่นสะท้านจับไข้',
  rf_syncope_hypotension: 'หน้ามืด วูบหมดสติ วิงเวียนรุนแรง เหงื่อแตกตัวเย็น',
  rf_marked_pallor: 'หน้าซีด ปากซีดลงอย่างรวดเร็ว อ่อนเพลียแทบยืนไม่ไหว',
  rf_facial_pedal_edema: 'หน้าบวม หนังตาบวม หรือขาบวมกดบุ๋มทั้งสองข้าง',
  rf_oliguria_anuria: 'ปัสสาวะออกน้อยมากผิดปกติตลอดทั้งวัน (Oliguria/Anuria)',
  rf_unexplained_weight_loss: 'น้ำหนักตัวลดลงฮวบผิดปกติโดยไม่ได้ตั้งใจลด เบื่ออาหาร'
};

const HEM_TRAUMA_MAP = {
  hist_trauma_flank_pelvis: 'อุบัติเหตุกระแทกบั้นเอว ท้องน้อย หรือกระดูกเชิงกราน',
  hist_straddle_injury: 'พลัดตกกระแทกหว่างขา (Straddle injury)',
  hist_direct_genital_urethral_trauma: 'บาดเจ็บหรือกระแทกที่อวัยวะเพศหรือท่อปัสสาวะโดยตรง',
  hist_blood_at_meatus: 'มีเลือดสดหยดซึมจากปลายท่อทางเดินปัสสาวะ (Blood at meatus)',
  hist_recent_catheter: 'เพิ่งได้รับการใส่ คาสายสวน หรือดึงกระชากสายสวนปัสสาวะ',
  hist_recent_urologic_op: 'เพิ่งได้รับการผ่าตัด ส่องกล้อง หรือสลายนิ่วทางเดินปัสสาวะ'
};

const HEM_MED_MAP = {
  med_warfarin: 'Warfarin',
  med_doac: 'DOACs (Eliquis, Xarelto, Pradaxa, Lixiana)',
  med_antiplatelet: 'Aspirin / Antiplatelet',
  med_nsaids: 'NSAIDs / ยาชุด',
  med_rifampicin: 'Rifampicin'
};

const HEM_RISK_MAP = {
  risk_heavy_smoker: 'สูบบุหรี่จัดเป็นประจำ (> 10–20 ปี)',
  risk_chemical_dyes: 'สัมผัสสารเคมีอุตสาหกรรม สีย้อมผ้า ยาง หรือพลาสติกเป็นประจำ',
  risk_family_cancer: 'ญาติสายตรงป่วยเป็นมะเร็งไตหรือมะเร็งกระเพาะปัสสาวะ'
};

const HEM_HOSP_MAP = {
  complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
  additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
  self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
  unspecified: 'ไม่ได้ระบุ'
};

// --- Output Generator (Rapid Bullet, Narrative & JSON Schema) ---
function updateHematuriaOutputs(patient) {
  if (!patient) return null;

  const durVal = patient.durationVal;
  const durationStr = durVal ? `${durVal} ${HEM_UNIT_MAP[patient.durationUnit] || 'วัน'}` : 'ไม่ได้ระบุ';
  const colorText = HEM_COLOR_MAP[patient.hematuriaColor] || 'ไม่ได้ระบุ';
  const timingText = HEM_TIMING_MAP[patient.hematuriaTiming] || 'ไม่ได้ระบุ';
  const painText = HEM_PAIN_MAP[patient.hematuriaPainType] || 'ไม่ได้ระบุ';

  const clotTypes = Array.isArray(patient.hematuriaClotTypes) ? patient.hematuriaClotTypes : [];
  const obsTypes = Array.isArray(patient.hematuriaObsTypes) ? patient.hematuriaObsTypes : [];
  const systemic = Array.isArray(patient.hematuriaSystemicSigns) ? patient.hematuriaSystemicSigns : [];
  const trauma = Array.isArray(patient.hematuriaTraumaTypes) ? patient.hematuriaTraumaTypes : [];
  const meds = Array.isArray(patient.hematuriaMeds) ? patient.hematuriaMeds : [];
  const risks = Array.isArray(patient.hematuriaMalignancyRisks) ? patient.hematuriaMalignancyRisks : [];

  const isFemale = patient.gender === 'หญิง' || patient.gender === 'Female';
  const positives = [];
  const negatives = [];

  // Clots (Zero Default Bias: only explicit yes/no)
  if (patient.hematuriaClotMaster === 'clot_master_yes' || clotTypes.length > 0) {
    if (clotTypes.length > 0) clotTypes.forEach(c => { if (HEM_CLOT_MAP[c]) positives.push(HEM_CLOT_MAP[c]); });
    else positives.push('มีลิ่มเลือดปนในปัสสาวะ');
  } else if (patient.hematuriaClotMaster === 'clot_master_no') {
    negatives.push('ไม่มีลิ่มเลือดปนในปัสสาวะ');
  }

  // Voiding obstruction
  if (patient.hematuriaObsMaster === 'obs_master_yes' || obsTypes.length > 0) {
    if (obsTypes.length > 0) obsTypes.forEach(o => { if (HEM_OBS_MAP[o]) positives.push(HEM_OBS_MAP[o]); });
    else positives.push('มีปัญหาปัสสาวะขัดข้องหรือสะดุด');
  } else if (patient.hematuriaObsMaster === 'obs_master_no') {
    negatives.push('ปัสสาวะพุ่งออกดีตามปกติ ไม่สะดุด');
  }

  // Pain
  const hasPainScore = typeof patient.painScore === 'number' && patient.painScore >= 0;
  if (patient.hematuriaPainType === 'pain_painless') {
    negatives.push('ไม่มีอาการปวดบั้นเอว ปวดท้องน้อย หรือแสบขัด (Painless hematuria)');
  } else if (patient.hematuriaPainType && HEM_PAIN_MAP[patient.hematuriaPainType]) {
    positives.push(`มีอาการ${painText}${hasPainScore ? ` (Pain Score: ${patient.painScore}/10)` : ''}`);
  } else if (hasPainScore) {
    positives.push(`ระดับความเจ็บปวด (Pain Score: ${patient.painScore}/10)`);
  }

  // Systemic
  const sysPos = systemic.filter(s => s !== 'rf_systemic_none');
  sysPos.forEach(s => { if (HEM_SYS_MAP[s]) positives.push(HEM_SYS_MAP[s]); });
  if (systemic.includes('rf_systemic_none') && sysPos.length === 0) {
    negatives.push('ปฏิเสธไข้หนาวสั่น หน้ามืดวูบ หน้า/ขาบวม และไม่มีอาการซีดเฉียบพลัน');
  }

  // Trauma & procedures
  if (patient.hematuriaTraumaMaster === 'trauma_master_yes') {
    trauma.forEach(t => { if (HEM_TRAUMA_MAP[t]) positives.push(HEM_TRAUMA_MAP[t]); });
    if (trauma.length === 0) positives.push('มีประวัติอุบัติเหตุหรือหัตถการทางเดินปัสสาวะนำมาก่อน');
  } else if (patient.hematuriaTraumaMaster === 'trauma_master_no') {
    negatives.push('ปฏิเสธประวัติอุบัติเหตุ บาดเจ็บ หรือหัตถการทางเดินปัสสาวะ');
  }

  // Female context (C-AP13)
  if (isFemale) {
    if (patient.hematuriaFemaleBleeding === 'female_menstruation_active') {
      positives.push('มีประจำเดือนหรือเลือดออกทางช่องคลอดในระยะนี้');
    } else if (patient.hematuriaFemaleBleeding === 'female_no_vaginal_bleed') {
      negatives.push('ปฏิเสธเลือดออกทางช่องคลอด เลือดออกจากท่อปัสสาวะโดยตรง');
    }
  }

  // Malignancy risks
  const riskPos = risks.filter(r => r !== 'risk_malignancy_none');
  riskPos.forEach(r => { if (HEM_RISK_MAP[r]) positives.push(HEM_RISK_MAP[r]); });
  if (risks.includes('risk_malignancy_none') && riskPos.length === 0) {
    negatives.push('ปฏิเสธประวัติสูบบุหรี่จัดและการสัมผัสสารเคมีอุตสาหกรรม');
  }

  // Medications
  const medPos = meds.filter(m => m !== 'med_bleeding_none').map(m => HEM_MED_MAP[m]).filter(Boolean);
  if (patient.currentMedsUnknown) medPos.push('มียาประจำตัว (จำชื่อยาไม่ได้)');
  if (medPos.length > 0) {
    positives.push(`รับประทานยาที่เกี่ยวข้อง: ${medPos.join(', ')}`);
  } else if (meds.includes('med_bleeding_none')) {
    negatives.push('ปฏิเสธยาละลายลิ่มเลือด ยาต้านเกล็ดเลือด หรือยาที่มีผลต่อสีปัสสาวะ');
  }

  if (patient.otherSymptomsFree) positives.push(patient.otherSymptomsFree);

  patient.pertinentPositives = positives.length > 0 ? positives : ['ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม'];
  patient.pertinentNegatives = negatives.length > 0 ? negatives : ['ผู้ป่วยไม่ได้ระบุคำตอบยืนยันในหมวดอาการร่วม'];

  const redFlags = evaluateHematuriaRedFlags(patient);
  patient.redFlags = redFlags;

  const docNotes = patient.doctor_notes || {};
  const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ')
    ? 'ไม่ได้ระบุ'
    : (patient.currentMeds === 'ไม่มี' ? 'ไม่มี' : patient.currentMeds);
  const hospLabel = HEM_HOSP_MAP[patient.hospRecordStatus] || 'ไม่ได้ระบุ';

  const udArr = Array.isArray(patient.underlying) ? patient.underlying : (patient.underlying ? [patient.underlying] : []);
  const filteredUd = udArr.filter(u => u && !u.includes('ปฏิเสธ') && u !== 'ไม่มี' && u !== 'ไม่มีโรคประจำตัว' && u !== 'ไม่ได้ระบุ');
  const udExplicitDeny = udArr.some(u => u && (u.includes('ปฏิเสธ') || u === 'ไม่มี' || u === 'ไม่มีโรคประจำตัว'));
  const udDisplay = filteredUd.length > 0
    ? filteredUd.join(', ')
    : ((udExplicitDeny || patient.hospRecordStatus === 'self' || patient.hospRecordStatus === 'additional') ? 'ปฏิเสธ' : 'ไม่ได้ระบุ');

  const allergyDisplay = (!patient.drugAllergy || patient.drugAllergy === 'ไม่ได้ระบุ')
    ? 'ไม่ได้ระบุ'
    : ((patient.drugAllergy.includes('ปฏิเสธ') || patient.drugAllergy === 'ไม่มี') ? 'ปฏิเสธ' : patient.drugAllergy);

  const femaleLine = isFemale
    ? `\n• ประวัติสตรี: ${patient.hematuriaFemaleBleeding === 'female_menstruation_active' ? 'กำลังมีประจำเดือนหรือเลือดออกทางช่องคลอดร่วม' : (patient.hematuriaFemaleBleeding === 'female_no_vaginal_bleed' ? 'ปฏิเสธเลือดออกทางช่องคลอด (จากท่อปัสสาวะโดยตรง)' : 'ไม่ได้ระบุ')}`
    : '';

  const defaultRapid = `[Chief Complaint (CC)]
ปัสสาวะเป็นเลือด (Hematuria) มา ${durationStr}

[History of Present Illness (HPI)]
• ลักษณะสีของน้ำปัสสาวะ: ${colorText}
• ช่วงเวลาที่เลือดออก: ${timingText}
• ลักษณะการปวด: ${painText}${patient.hematuriaPainType !== 'pain_painless' && hasPainScore ? ` (Pain Score: ${patient.painScore}/10)` : ''}${femaleLine}

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
  let narrative = `ผู้ป่วย${genderLabel} อายุ ${patient.age || 'ไม่ได้ระบุ'} ปี มารับการตรวจที่ห้องฉุกเฉินด้วยอาการปัสสาวะเป็นเลือด มา ${durationStr} ` +
    `สีปัสสาวะ: ${colorText} ช่วงเวลาที่ออก: ${timingText} อาการปวด: ${painText}`;
  if (patient.hematuriaPainType !== 'pain_painless' && hasPainScore) {
    narrative += ` (Pain Score ${patient.painScore}/10)`;
  }
  if (positives.length > 0) narrative += ` ร่วมกับอาการที่พบ: ${positives.join(', ')}`;
  if (negatives.length > 0) narrative += ` โดยผู้ป่วยยืนยันปฏิเสธ: ${negatives.join(', ')}`;

  const jsonOutput = {
    encounter: {
      id: patient.id || null,
      queue_number: patient.queue_number || null,
      hn: patient.hn || null,
      patient_name: patient.name || null,
      age: patient.age !== undefined ? patient.age : null,
      gender: patient.gender || null,
      chief_complaint: 'hematuria',
      chief_complaint_title_th: 'ปัสสาวะเป็นเลือด',
      timestamp: patient.timestamp || new Date().toISOString(),
      esi_level: patient.esi_level || 3,
      vital_signs: patient.vital_signs || {}
    },
    clinical_history: {
      duration_val: durVal || null,
      duration_unit: patient.durationUnit || 'days',
      color: patient.hematuriaColor || null,
      timing: patient.hematuriaTiming || null,
      clots: {
        has_clots: patient.hematuriaClotMaster === 'clot_master_yes' ? true : (patient.hematuriaClotMaster === 'clot_master_no' ? false : null),
        types: clotTypes
      },
      voiding_obstruction: {
        has_obstruction: patient.hematuriaObsMaster === 'obs_master_yes' ? true : (patient.hematuriaObsMaster === 'obs_master_no' ? false : null),
        types: obsTypes
      },
      pain: {
        type: patient.hematuriaPainType || null,
        score: hasPainScore && patient.hematuriaPainType !== 'pain_painless' ? patient.painScore : null
      },
      systemic_signs: systemic,
      trauma_and_interventions: {
        has_trauma: patient.hematuriaTraumaMaster === 'trauma_master_yes' ? true : (patient.hematuriaTraumaMaster === 'trauma_master_no' ? false : null),
        types: trauma
      },
      medications_risk: meds,
      medications_unknown: Boolean(patient.currentMedsUnknown),
      malignancy_risk_factors: risks,
      female_bleeding_context: isFemale ? (patient.hematuriaFemaleBleeding || null) : null,
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
      total_red_flags: redFlags.length
    }
  };

  const finalRapid = patient.custom_rapid_note || defaultRapid;
  const finalNarrative = patient.custom_narrative_note || narrative;
  patient.rapidHpi = finalRapid;
  patient.narrativeHpi = finalNarrative;
  patient.medicalJson = jsonOutput;

  if (typeof document !== 'undefined') {
    const rapidEl = getHemEl('rapidTextView');
    const narrativeEl = getHemEl('narrativeTextView');
    const jsonEl = getHemEl('jsonViewer');
    if (rapidEl) rapidEl.value = finalRapid;
    if (narrativeEl) narrativeEl.value = finalNarrative;
    if (jsonEl) jsonEl.textContent = JSON.stringify(jsonOutput, null, 2);
  }

  return { rapid: finalRapid, narrative: finalNarrative, json: jsonOutput };
}

function renderHematuriaRapidHpi(patient) {
  const res = updateHematuriaOutputs(patient);
  return res ? res.rapid : '';
}

function renderHematuriaNarrative(patient) {
  const res = updateHematuriaOutputs(patient);
  return res ? res.narrative : '';
}

function renderHematuriaDoctorHpi(patient) {
  return renderHematuriaRapidHpi(patient);
}

// --- Seed Patient Cases (4 Cases Preserved, C-AP11 Allergy Concise) ---
const hematuriaSeedCases = [
  {
    id: 'seed-hematuria-01',
    queue_number: 'C-081',
    hn: '6788451',
    name: 'นายสมบัติ ปัสสาวะแดง',
    age: 68,
    gender: 'ชาย',
    chief_complaint: 'hematuria',
    chief_complaint_title: 'ปัสสาวะเป็นเลือด',
    timestamp: '2026-10-30T00:10:00.000Z',
    status: 'waiting',
    durationVal: 3,
    durationUnit: 'days',
    hospRecordStatus: 'complete',
    underlying: ['ความดันสูง (HT)'],
    drugAllergy: 'ปฏิเสธ',
    currentMeds: 'Amlodipine (5 mg) 1 tab po od',
    otherSymptomsFree: 'สูบบุหรี่วันละ 1 ซองมานาน 30 ปี ปัสสาวะเป็นเลือดสดไม่มีปวด',
    doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
    vital_signs: { bt: 36.6, sbp: 130, dbp: 80, bp: '130/80', pr: 76, rr: 16, spo2: 99 },
    esi_level: 3,

    hematuriaColor: 'color_bright_red',
    hematuriaTiming: 'timing_total',
    hematuriaClotMaster: 'clot_master_no',
    hematuriaClotTypes: [],
    hematuriaObsMaster: 'obs_master_no',
    hematuriaObsTypes: [],
    hematuriaPainType: 'pain_painless',
    painScore: null,
    hematuriaSystemicSigns: ['rf_systemic_none'],
    hematuriaTraumaMaster: 'trauma_master_no',
    hematuriaTraumaTypes: [],
    hematuriaMeds: ['med_bleeding_none'],
    currentMedsUnknown: false,
    hematuriaFemaleBleeding: '',
    hematuriaMalignancyRisks: ['risk_heavy_smoker']
  },
  {
    id: 'seed-hematuria-02',
    queue_number: 'B-082',
    hn: '6788452',
    name: 'นายประสิทธิ์ ลิ่มเลือดอุดกั้น',
    age: 72,
    gender: 'ชาย',
    chief_complaint: 'hematuria',
    chief_complaint_title: 'ปัสสาวะเป็นเลือด',
    timestamp: '2026-10-30T00:15:00.000Z',
    status: 'waiting',
    durationVal: 6,
    durationUnit: 'hours',
    hospRecordStatus: 'complete',
    underlying: ['ต่อมลูกหมากโต (BPH)'],
    drugAllergy: 'ปฏิเสธ',
    currentMeds: 'Tamsulosin 0.4 mg hs',
    otherSymptomsFree: 'ปวดเบ่งตึงท้องน้อยอย่างมาก ปัสสาวะไม่ออก มีลิ่มเลือดก้อนใหญ่ออกมา',
    doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
    vital_signs: { bt: 37.0, sbp: 150, dbp: 95, bp: '150/95', pr: 98, rr: 20, spo2: 97 },
    esi_level: 2,

    hematuriaColor: 'color_bright_red',
    hematuriaTiming: 'timing_total',
    hematuriaClotMaster: 'clot_master_yes',
    hematuriaClotTypes: ['clot_large_amorphous'],
    hematuriaObsMaster: 'obs_master_yes',
    hematuriaObsTypes: ['obs_unable_to_void'],
    hematuriaPainType: 'pain_suprapubic',
    painScore: 8,
    hematuriaSystemicSigns: ['rf_systemic_none'],
    hematuriaTraumaMaster: 'trauma_master_no',
    hematuriaTraumaTypes: [],
    hematuriaMeds: ['med_bleeding_none'],
    currentMedsUnknown: false,
    hematuriaFemaleBleeding: '',
    hematuriaMalignancyRisks: ['risk_malignancy_none']
  },
  {
    id: 'seed-hematuria-03',
    queue_number: 'C-083',
    hn: '6788453',
    name: 'นายชูเกียรติ นิ่วท่อไต',
    age: 42,
    gender: 'ชาย',
    chief_complaint: 'hematuria',
    chief_complaint_title: 'ปัสสาวะเป็นเลือด',
    timestamp: '2026-10-30T00:20:00.000Z',
    status: 'waiting',
    durationVal: 4,
    durationUnit: 'hours',
    hospRecordStatus: 'complete',
    underlying: ['เคยเป็นนิ่วท่อไต (Ureteric stone)'],
    drugAllergy: 'ปฏิเสธ',
    currentMeds: 'ไม่มี',
    otherSymptomsFree: 'ปวดบิดเกร็งบั้นเอวขวาร้าวลงขาหนีบรุนแรง ปัสสาวะสีน้ำล้างเนื้อ',
    doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
    vital_signs: { bt: 36.8, sbp: 140, dbp: 85, bp: '140/85', pr: 92, rr: 18, spo2: 98 },
    esi_level: 3,

    hematuriaColor: 'color_pink_wash',
    hematuriaTiming: 'timing_total',
    hematuriaClotMaster: 'clot_master_no',
    hematuriaClotTypes: [],
    hematuriaObsMaster: 'obs_master_yes',
    hematuriaObsTypes: ['obs_interrupted_stream'],
    hematuriaPainType: 'pain_flank_colic',
    painScore: 9,
    hematuriaSystemicSigns: ['rf_systemic_none'],
    hematuriaTraumaMaster: 'trauma_master_no',
    hematuriaTraumaTypes: [],
    hematuriaMeds: ['med_bleeding_none'],
    currentMedsUnknown: false,
    hematuriaFemaleBleeding: '',
    hematuriaMalignancyRisks: ['risk_malignancy_none']
  },
  {
    id: 'seed-hematuria-04',
    queue_number: 'C-084',
    hn: '6788454',
    name: 'น.ส.กนกพร เนื้อไตอักเสบ',
    age: 24,
    gender: 'หญิง',
    chief_complaint: 'hematuria',
    chief_complaint_title: 'ปัสสาวะเป็นเลือด',
    timestamp: '2026-10-30T00:25:00.000Z',
    status: 'waiting',
    durationVal: 2,
    durationUnit: 'days',
    hospRecordStatus: 'complete',
    underlying: ['ปฏิเสธ'],
    drugAllergy: 'ปฏิเสธ',
    currentMeds: 'ไม่มี',
    otherSymptomsFree: 'ปัสสาวะสีน้ำโคล่า หน้าบวม ตาบวม ขาบวม ตรวจพบความดันโลหิตสูง',
    doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
    vital_signs: { bt: 37.1, sbp: 155, dbp: 95, bp: '155/95', pr: 82, rr: 16, spo2: 99 },
    esi_level: 3,

    hematuriaColor: 'color_cola_tea',
    hematuriaTiming: 'timing_total',
    hematuriaClotMaster: 'clot_master_no',
    hematuriaClotTypes: [],
    hematuriaObsMaster: 'obs_master_no',
    hematuriaObsTypes: [],
    hematuriaPainType: 'pain_painless',
    painScore: null,
    hematuriaSystemicSigns: ['rf_facial_pedal_edema', 'rf_oliguria_anuria'],
    hematuriaTraumaMaster: 'trauma_master_no',
    hematuriaTraumaTypes: [],
    hematuriaMeds: ['med_bleeding_none'],
    currentMedsUnknown: false,
    hematuriaFemaleBleeding: 'female_no_vaginal_bleed',
    hematuriaMalignancyRisks: ['risk_malignancy_none']
  }
];

// --- Master Module Definition ---
const hematuriaModule = {
  id: 'hematuria',
  recordCc: 'hematuria',
  schemaCode: 'hematuria',
  titleTh: 'ปัสสาวะเป็นเลือด',
  titleEn: 'Hematuria / Blood in urine',
  icon: 'droplets',
  sectionDomId: 'hematuriaQuestionnaireSection',
  headerTh: 'แบบฟอร์มซักประวัติ: ปัสสาวะเป็นเลือด',
  headerEn: '(Hematuria & Urological Triage)',
  patientBadgeHtml: '<i data-lucide="droplets" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-rose-500"></i><span class="whitespace-nowrap">ปัสสาวะเป็นเลือด</span>',
  doctorCcBadgeHtml: '<i data-lucide="droplets" class="w-3.5 h-3.5 mr-1 text-rose-500"></i> CC: ปัสสาวะเป็นเลือด',
  pmhSectionNumber: 5,
  dateFields: [],
  timeFields: [],
  branchIds: ['hematuriaPainSubContainer', 'hematuriaTraumaSubContainer', 'hematuria_branch_female'],
  inputIdsToClear: ['hematuriaDurationVal', 'hematuria_other_free'],
  getPmhSectionNumber: function() {
    return 5;
  },

  algorithm: {
    chiefComplaint: 'hematuria',
    titleTh: 'ปัสสาวะเป็นเลือด',
    schemaCode: 'hematuria',
    version: '3.0.0',
    redFlagDefinitions: [
      { key: 'rf_hemodynamic_shock', level: 1, textTh: 'Active Massive Hematuria / เสี่ยงภาวะช็อกจากการเสียเลือด' },
      { key: 'rf_clot_retention_tamponade', level: 1, textTh: 'Clot Retention / Bladder Tamponade (ก้อนเลือดอุดตันท่อปัสสาวะเฉียบพลัน)' },
      { key: 'rf_urologic_trauma', level: 1, textTh: 'Urologic Trauma / สงสัยการบาดเจ็บของไตหรือท่อทางเดินปัสสาวะ' },
      { key: 'rf_painless_gross_hematuria_malignancy', level: 2, textTh: 'Painless Gross Hematuria / สงสัยโรคมะเร็งระบบทางเดินปัสสาวะ (Bladder/Renal Cancer)' },
      { key: 'rf_nephritic_syndrome', level: 2, textTh: 'Nephritic Syndrome / สงสัยภาวะเนื้อไตอักเสบเฉียบพลัน (Glomerulonephritis)' },
      { key: 'rf_obstructive_urolithiasis', level: 2, textTh: 'Renal / Ureteral Colic with Hematuria (สงสัยนิ่วท่อไตอุดกั้น)' },
      { key: 'rf_anticoagulant_coagulopathy', level: 2, textTh: 'Anticoagulant-Associated Hematuria / ภาวะเลือดออกจากยาต้านการแข็งตัวของเลือด' }
    ]
  },

  formHtml: `
    <div id="hematuriaQuestionnaireSection" class="hidden space-y-6">
      <div data-cc-top-banner="hematuria">
        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
          <div class="bg-amber-100 text-amber-800 p-2.5 rounded-xl flex-shrink-0 mt-0.5">
            <i data-lucide="alert-circle" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-amber-900 mb-1">คำแนะนำเบื้องต้นระหว่างรอตรวจ</h3>
            <p class="text-xs text-amber-800 leading-relaxed">
              <strong>ไม่ควรปัสสาวะทิ้งก่อนเข้าตรวจ</strong> (หรือติดต่อพยาบาลเพื่อขอกระปุกเก็บสิ่งส่งตรวจก่อนปัสสาวะ) หากมีอาการปัสสาวะไม่ออกเลยจนปวดท้องมาก หน้ามืดวูบ กรุณาแจ้งพยาบาลทันที
            </p>
          </div>
        </div>
      </div>

      <!-- CARD 1: ระยะเวลา สี และช่วงจังหวะที่ปัสสาวะเป็นเลือด -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="clock" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">1. ระยะเวลา สี และช่วงจังหวะที่ปัสสาวะเป็นเลือด</h2>
            <p class="text-xs text-slate-500">ระยะเวลาที่เริ่มสังเกตเห็น สีของน้ำปัสสาวะ และช่วงเวลาที่เลือดออก</p>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            ${renderHemSysHeader({
              label: '1.1 เริ่มสังเกตเห็นปัสสาวะเป็นเลือดมานานเท่าใด',
              icon: 'clock',
              colorClass: 'bg-sky-100 text-sky-700'
            })}
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div class="col-span-1 sm:col-span-2">
                <input type="number" id="hematuriaDurationVal" min="1" max="1000" placeholder="ระบุตัวเลข เช่น 2"
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm placeholder:text-slate-400 placeholder:font-normal">
              </div>
              <div class="col-span-1">
                <select id="hematuriaDurationUnit"
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
            ${renderHemSysHeader({
              label: '1.2 ลักษณะสีของน้ำปัสสาวะที่สังเกตเห็น',
              icon: 'droplets',
              colorClass: 'bg-sky-100 text-sky-700'
            })}
            ${renderHemGrid('grid-cols-1 sm:grid-cols-2', [
              { kind: 'radio', name: 'hematuriaColor', value: 'color_bright_red', title: ['สีแดงสด หรือ', 'แดงเข้มเหมือนเลือดสด'] },
              { kind: 'radio', name: 'hematuriaColor', value: 'color_pink_wash', title: ['สีชมพู / แดงจาง', 'คล้ายน้ำล้างเนื้อ'] },
              { kind: 'radio', name: 'hematuriaColor', value: 'color_cola_tea', title: ['สีน้ำตาลเข้ม', 'คล้ายสีชาแก่ / โคล่า'] },
              { kind: 'radio', name: 'hematuriaColor', value: 'color_turbid_cloudy', title: ['ปัสสาวะขุ่น', 'มีตะกอนสีแดง/ชมพู'] }
            ])}
          </div>

          <div class="pt-4 border-t border-slate-100">
            ${renderHemSysHeader({
              label: '1.3 ช่วงจังหวะที่เห็นเลือดปนขณะปัสสาวะ',
              icon: 'activity',
              colorClass: 'bg-teal-100 text-teal-700'
            })}
            ${renderHemGrid('grid-cols-1 sm:grid-cols-2', [
              { kind: 'radio', name: 'hematuriaTiming', value: 'timing_total', title: ['แดงตลอดสาย', 'ตั้งแต่เริ่มจนสุด'] },
              { kind: 'radio', name: 'hematuriaTiming', value: 'timing_initial', title: ['แดงเฉพาะช่วงแรก', 'ที่เริ่มปัสสาวะ'] },
              { kind: 'radio', name: 'hematuriaTiming', value: 'timing_terminal', title: ['แดงเฉพาะช่วงท้าย', 'ตอนปัสสาวะใกล้สุด'] },
              { kind: 'radio', name: 'hematuriaTiming', value: 'timing_intermittent', title: ['เป็นบางครั้ง', 'สลับกับใสปกติ'] },
              { kind: 'radio', name: 'hematuriaTiming', value: 'timing_unnoticed', title: ['ไม่ได้สังเกต', '/ จำไม่ได้'], colSpan2: true }
            ])}
          </div>
        </div>
      </div>

      <!-- CARD 2: ลิ่มเลือด ปัญหาการขับถ่าย และอาการปวดร่วม -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="droplet" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">2. ลิ่มเลือด ปัญหาการขับถ่าย และอาการปวดร่วม</h2>
            <p class="text-xs text-slate-500">ประเมินลิ่มเลือดปน การอุดกั้นทางเดินปัสสาวะ และระดับความเจ็บปวด</p>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            ${renderHemSysHeader({
              label: '2.1 ลิ่มเลือดที่ปนออกมากับปัสสาวะ (เลือกได้หลายข้อ)',
              icon: 'droplet',
              colorClass: 'bg-sky-100 text-sky-700',
              toggleId: 'hematuria_clot_none',
              toggleLabel: 'ไม่มีลิ่มเลือดปน',
              toggleOnchange: 'handleHematuriaClotNoneToggle(this)'
            })}
            ${renderHemGrid('grid-cols-1 sm:grid-cols-3', [
              { name: 'hematuriaClotTypes', value: 'clot_small_specks', title: ['ลิ่มเลือดเป็นขุย /', 'เส้นเลือดเล็กๆ'], onchange: 'handleHematuriaClotItemChange(this)' },
              { name: 'hematuriaClotTypes', value: 'clot_large_amorphous', title: ['ลิ่มเลือด', 'เป็นก้อนใหญ่ /', 'ก้อนวุ้นหนา'], onchange: 'handleHematuriaClotItemChange(this)' },
              { name: 'hematuriaClotTypes', value: 'clot_vermiform_string', title: ['ลิ่มเลือดเส้นยาว', 'คล้ายไส้เดือน'], onchange: 'handleHematuriaClotItemChange(this)' }
            ])}
          </div>

          <div class="pt-4 border-t border-slate-100">
            ${renderHemSysHeader({
              label: '2.2 ปัญหาการขับถ่ายปัสสาวะ (เลือกได้หลายข้อ)',
              icon: 'alert-triangle',
              colorClass: 'bg-amber-100 text-amber-700',
              toggleId: 'hematuria_obs_none',
              toggleLabel: 'ปัสสาวะคล่องดี',
              toggleOnchange: 'handleHematuriaObsNoneToggle(this)'
            })}
            ${renderHemGrid('grid-cols-1 sm:grid-cols-3', [
              { name: 'hematuriaObsTypes', value: 'obs_unable_to_void', title: ['ปัสสาวะไม่ออกเลย', 'แน่นท้องน้อยมาก'], onchange: 'handleHematuriaObsItemChange(this)' },
              { name: 'hematuriaObsTypes', value: 'obs_interrupted_stream', title: ['ลำปัสสาวะสะดุด', 'หยุดไหลกะทันหัน'], onchange: 'handleHematuriaObsItemChange(this)' },
              { name: 'hematuriaObsTypes', value: 'obs_straining_dribbling', title: ['ต้องออกแรงเบ่งมาก', 'ออกทีละหยด'], onchange: 'handleHematuriaObsItemChange(this)' }
            ])}
          </div>

          <div class="pt-4 border-t border-slate-100">
            ${renderHemSysHeader({
              label: '2.3 อาการปวดร่วมและระดับความเจ็บปวด',
              icon: 'activity',
              colorClass: 'bg-teal-100 text-teal-700'
            })}
            ${renderHemGrid('grid-cols-1 sm:grid-cols-2', [
              { kind: 'radio', name: 'hematuriaPainMaster', value: 'pain_yes', title: ['มีอาการปวดร่วมด้วย'], onchange: 'handleHematuriaPainMasterChange(this.value)' },
              { kind: 'radio', name: 'hematuriaPainMaster', value: 'pain_painless', title: ['ไม่มีอาการปวดเลย'], onchange: 'handleHematuriaPainMasterChange(this.value)' }
            ])}

            <div id="hematuriaPainSubContainer" class="hidden mt-3 pl-4 border-l-2 border-medical-200 space-y-3">
              <div>
                <span class="block text-xs font-bold text-slate-700 mb-2">ระบุตำแหน่งและลักษณะอาการปวด:</span>
                ${renderHemGrid('grid-cols-1 sm:grid-cols-3', [
                  { kind: 'radio', name: 'hematuriaPainType', value: 'pain_flank_colic', title: ['ปวดบิดบั้นเอว/สีข้าง', 'ร้าวลงขาหนีบ'] },
                  { kind: 'radio', name: 'hematuriaPainType', value: 'pain_suprapubic', title: ['ปวดตื้อแน่นท้องน้อย', 'บริเวณหัวเหน่า'] },
                  { kind: 'radio', name: 'hematuriaPainType', value: 'pain_dysuria_burning', title: ['ปวดแสบขัด', 'ปลายท่อปัสสาวะ'] }
                ])}
              </div>

              <div class="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label class="block text-xs sm:text-sm font-bold text-slate-800">ระดับความเจ็บปวดในขณะนี้ (Pain Score: 0–10)</label>
                  <div class="flex items-center space-x-2">
                    <span id="hematuriaPainScoreBadge" class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all">
                      <span id="hematuriaPainScoreEmoji" class="text-base">⚪</span>
                      <span id="hematuriaPainScoreText">ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)</span>
                    </span>
                    <button type="button" id="hematuriaPainScoreClearBtn" onclick="clearHematuriaPainScore()" class="text-xs text-slate-500 hover:text-slate-800 underline hidden transition" title="ล้างค่าเพื่อให้เป็นไม่ได้ระบุ">ล้างค่า</button>
                  </div>
                </div>
                <div class="px-1 pt-1">
                  <input type="range" id="hematuriaPainScore" min="0" max="10" value="0" step="1"
                    oninput="handleHematuriaPainScoreChange(this.value)"
                    class="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-600 focus:outline-none focus:ring-2 focus:ring-medical-500">
                </div>
                <div class="grid grid-cols-5 text-center text-[10px] sm:text-[11px] pt-1 gap-1 text-slate-500 font-medium">
                  <div class="cursor-pointer hover:text-medical-600 transition" onclick="setHematuriaPainScore(0)"><span class="text-lg sm:text-xl block">😊</span><span>0: สบายดี</span></div>
                  <div class="cursor-pointer hover:text-medical-600 transition" onclick="setHematuriaPainScore(2)"><span class="text-lg sm:text-xl block">🙂</span><span>1–3: เล็กน้อย</span></div>
                  <div class="cursor-pointer hover:text-medical-600 transition" onclick="setHematuriaPainScore(5)"><span class="text-lg sm:text-xl block">😐</span><span>4–6: ปานกลาง</span></div>
                  <div class="cursor-pointer hover:text-medical-600 transition" onclick="setHematuriaPainScore(8)"><span class="text-lg sm:text-xl block">😣</span><span>7–9: ปวดมาก</span></div>
                  <div class="cursor-pointer hover:text-medical-600 transition" onclick="setHematuriaPainScore(10)"><span class="text-lg sm:text-xl block">😭</span><span>10: ปวดที่สุด</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 3: สัญญาณเตือนทางร่างกาย และประวัติอุบัติเหตุ/หัตถการ -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="shield-alert" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">3. สัญญาณเตือนทางร่างกาย และประวัติอุบัติเหตุ/หัตถการ</h2>
            <p class="text-xs text-slate-500">อาการผิดปกติร่วมทางร่างกาย และประวัติการกระทบกระแทกหรือใส่สายสวน</p>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            ${renderHemSysHeader({
              label: '3.1 สัญญาณเตือนสำคัญทางร่างกาย (เลือกได้หลายข้อ)',
              icon: 'alert-triangle',
              colorClass: 'bg-amber-100 text-amber-700',
              toggleId: 'hematuria_sys_none',
              toggleName: 'hematuriaSystemicSigns',
              toggleValue: 'rf_systemic_none',
              toggleLabel: 'ไม่มีอาการในหมวดนี้',
              toggleOnchange: 'handleHematuriaSystemicNoneToggle(this)'
            })}
            ${renderHemGrid('grid-cols-1 sm:grid-cols-2', [
              { name: 'hematuriaSystemicSigns', value: 'rf_high_fever_chills', title: ['มีไข้สูง หนาวสั่น', 'ตัวสั่นสะท้าน'], onchange: 'handleHematuriaSystemicItemChange(this)' },
              { name: 'hematuriaSystemicSigns', value: 'rf_syncope_hypotension', title: ['หน้ามืด วูบเป็นลม', 'เหงื่อแตกตัวเย็น'], onchange: 'handleHematuriaSystemicItemChange(this)' },
              { name: 'hematuriaSystemicSigns', value: 'rf_marked_pallor', title: ['หน้าซีด ปากซีดมาก', 'อ่อนเพลีย', 'แทบยืนไม่ไหว'], onchange: 'handleHematuriaSystemicItemChange(this)' },
              { name: 'hematuriaSystemicSigns', value: 'rf_facial_pedal_edema', title: ['หน้าบวม หนังตาบวม', 'หรือขาบวมสองข้าง'], onchange: 'handleHematuriaSystemicItemChange(this)' },
              { name: 'hematuriaSystemicSigns', value: 'rf_oliguria_anuria', title: ['ปัสสาวะออกน้อยมาก', '(ไม่ถึง', '1–2 แก้ว/วัน)'], onchange: 'handleHematuriaSystemicItemChange(this)' },
              { name: 'hematuriaSystemicSigns', value: 'rf_unexplained_weight_loss', title: ['น้ำหนักลดฮวบผิดปกติ', '/ เบื่ออาหาร', 'ต่อเนื่อง'], onchange: 'handleHematuriaSystemicItemChange(this)' }
            ])}
          </div>

          <div class="pt-4 border-t border-slate-100">
            ${renderHemSysHeader({
              label: '3.2 ประวัติอุบัติเหตุ บาดเจ็บ หรือหัตถการทางเดินปัสสาวะนำมาก่อน',
              icon: 'shield',
              colorClass: 'bg-sky-100 text-sky-700'
            })}
            ${renderHemGrid('grid-cols-1 sm:grid-cols-2', [
              { kind: 'radio', name: 'hematuriaTraumaMaster', value: 'trauma_master_yes', title: ['มีประวัติอุบัติเหตุ', '/ หัตถการ'], onchange: 'handleHematuriaTraumaMasterChange(this.value)' },
              { kind: 'radio', name: 'hematuriaTraumaMaster', value: 'trauma_master_no', title: ['ไม่มีประวัติเหล่านี้'], onchange: 'handleHematuriaTraumaMasterChange(this.value)' }
            ])}

            <div id="hematuriaTraumaSubContainer" class="hidden mt-3 pl-4 border-l-2 border-medical-200 space-y-2">
              <span class="block text-xs font-bold text-slate-700">ระบุเหตุการณ์หรือหัตถการที่เกี่ยวข้อง (เลือกได้หลายข้อ):</span>
              ${renderHemGrid('grid-cols-1 sm:grid-cols-2', [
                { name: 'hematuriaTraumaTypes', value: 'hist_trauma_flank_pelvis', title: ['อุบัติเหตุ', 'กระแทกบั้นเอว', 'ท้องน้อย / เชิงกราน'] },
                { name: 'hematuriaTraumaTypes', value: 'hist_straddle_injury', title: ['พลัดตกกระแทกหว่างขา', '(เช่น อานจักรยาน)'] },
                { name: 'hematuriaTraumaTypes', value: 'hist_direct_genital_urethral_trauma', title: ['บาดเจ็บที่อวัยวะเพศ', 'หรือท่อปัสสาวะโดยตรง'] },
                { name: 'hematuriaTraumaTypes', value: 'hist_blood_at_meatus', title: ['มีเลือดสดซึมปลายท่อ', 'โดยไม่ได้ปัสสาวะ'] },
                { name: 'hematuriaTraumaTypes', value: 'hist_recent_catheter', title: ['เพิ่งใส่ / คาสายสวน', 'หรือดึงกระชากสายสวน'] },
                { name: 'hematuriaTraumaTypes', value: 'hist_recent_urologic_op', title: ['เพิ่งส่องกล้อง', '/ สลายนิ่ว', 'หรือผ่าตัด', 'ทางเดินปัสสาวะ'] }
              ])}
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 4: ยาที่รับประทาน ปัจจัยเสี่ยง และข้อมูลเฉพาะสตรี -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="pill" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">4. ยาที่รับประทาน ปัจจัยเสี่ยง และข้อมูลเฉพาะสตรี</h2>
            <p class="text-xs text-slate-500">ยาละลายลิ่มเลือด ยาที่มีผลต่อสีปัสสาวะ และประวัติความเสี่ยง</p>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            ${renderHemSysHeader({
              label: '4.1 ยาที่มีผลต่อการแข็งตัวของเลือดหรือสีปัสสาวะ (เลือกได้หลายข้อ)',
              icon: 'pill',
              colorClass: 'bg-sky-100 text-sky-700',
              toggleId: 'hematuria_meds_none',
              toggleName: 'hematuriaMeds',
              toggleValue: 'med_bleeding_none',
              toggleLabel: 'ไม่มีในหมวดนี้',
              toggleOnchange: 'handleHematuriaMedsNoneToggle(this)'
            })}
            ${renderHemGrid('grid-cols-1 sm:grid-cols-2', [
              { name: 'hematuriaMeds', value: 'med_warfarin', title: ['ยาวาร์ฟาริน', '(ยาละลายลิ่มเลือด)'], onchange: 'handleHematuriaMedsItemChange(this)' },
              { name: 'hematuriaMeds', value: 'med_doac', title: ['ยาละลายลิ่มเลือด', 'กลุ่มใหม่', '(Eliquis, Xarelto)'], onchange: 'handleHematuriaMedsItemChange(this)' },
              { name: 'hematuriaMeds', value: 'med_antiplatelet', title: ['ยาต้านเกล็ดเลือด', '(Aspirin, Plavix)'], onchange: 'handleHematuriaMedsItemChange(this)' },
              { name: 'hematuriaMeds', value: 'med_nsaids', title: ['ยาแก้ปวดข้อ', '/ กล้ามเนื้อ', '(กลุ่มเอ็นเสด', '/ ยาชุด)'], onchange: 'handleHematuriaMedsItemChange(this)' },
              { name: 'hematuriaMeds', value: 'med_rifampicin', title: ['ยารักษาวัณโรค', 'ไรแฟมพิซิน', '(ปัสสาวะสีส้มแดง)'], onchange: 'handleHematuriaMedsItemChange(this)' },
              { id: 'currentMedsUnknown', value: 'unknown', title: ['จำชื่อยาที่ทานไม่ได้'], onchange: 'handleHematuriaMedsUnknownToggle(this)' }
            ])}
          </div>

          <div id="hematuria_branch_female" class="hidden pt-4 border-t border-slate-100">
            ${renderHemSysHeader({
              label: '4.2 สำหรับผู้ป่วยหญิง: ภาวะเลือดออกทางช่องคลอด',
              icon: 'user',
              colorClass: 'bg-pink-100 text-pink-700'
            })}
            ${renderHemGrid('grid-cols-1 sm:grid-cols-2', [
              { kind: 'radio', name: 'hematuriaFemaleBleeding', value: 'female_menstruation_active', title: ['กำลังมีประจำเดือน /', 'เลือดออกทางช่องคลอด'] },
              { kind: 'radio', name: 'hematuriaFemaleBleeding', value: 'female_no_vaginal_bleed', title: ['ไม่มีเลือดออก', 'ทางช่องคลอด', '(ออกจากท่อปัสสาวะ)'] }
            ])}
          </div>

          <div class="pt-4 border-t border-slate-100">
            ${renderHemSysHeader({
              label: '4.3 ปัจจัยเสี่ยงโรคทางเดินปัสสาวะ (เลือกได้หลายข้อ)',
              icon: 'clipboard-list',
              colorClass: 'bg-teal-100 text-teal-700',
              toggleId: 'hematuria_risk_none',
              toggleName: 'hematuriaMalignancyRisks',
              toggleValue: 'risk_malignancy_none',
              toggleLabel: 'ไม่มีในหมวดนี้',
              toggleOnchange: 'handleHematuriaRiskNoneToggle(this)'
            })}
            ${renderHemGrid('grid-cols-1 sm:grid-cols-2', [
              { name: 'hematuriaMalignancyRisks', value: 'risk_heavy_smoker', title: ['สูบบุหรี่จัด', 'เป็นประจำ', '(เกิน 10–20 ปี)'], onchange: 'handleHematuriaRiskItemChange(this)' },
              { name: 'hematuriaMalignancyRisks', value: 'risk_chemical_dyes', title: ['สัมผัสสารเคมี/สีย้อม', 'ยาง พลาสติก', 'เป็นประจำ'], onchange: 'handleHematuriaRiskItemChange(this)' },
              { name: 'hematuriaMalignancyRisks', value: 'risk_family_cancer', title: ['ญาติสายตรงเป็น', 'มะเร็งไต', '/ กระเพาะปัสสาวะ'], onchange: 'handleHematuriaRiskItemChange(this)', colSpan2: true }
            ])}
          </div>
        </div>
      </div>

      <!-- อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100">
          <div class="bg-slate-100 text-slate-600 p-2 rounded-xl"><i data-lucide="message-square-plus" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-800">อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2>
            <p class="text-xs text-slate-500">ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)</p>
          </div>
        </div>
        <textarea id="hematuria_other_free" rows="2" placeholder="พิมพ์ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)..."
          class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"></textarea>
      </div>
    </div>
  `,

  // --- Lifecycle Hooks ---
  init: function() {
    clearHematuriaPainScore();
    syncHematuriaGenderBranch();
  },

  onMounted: function() {
    this.init();
  },

  onSelectForm: function() {
    syncHematuriaGenderBranch();
  },

  onActivate: function() {
    syncHematuriaGenderBranch();
  },

  onTitleChange: function({ isFemale } = {}) {
    syncHematuriaGenderBranch(isFemale);
  },

  // --- Collect Intake Hook ---
  collectIntake: function(ctx) {
    ctx = ctx || {};
    const _rawDur = parseFloat(getHemEl('hematuriaDurationVal')?.value);
    const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
    const durationUnit = getHemEl('hematuriaDurationUnit')?.value || 'days';

    const hematuriaColor = queryHemOne('input[name="hematuriaColor"]:checked')?.value || '';
    const hematuriaTiming = queryHemOne('input[name="hematuriaTiming"]:checked')?.value || '';

    const hematuriaClotTypes = queryHemAll('input[name="hematuriaClotTypes"]:checked').map(el => el.value);
    const clotNoneChecked = Boolean(getHemEl('hematuria_clot_none')?.checked);
    const hematuriaClotMaster = hematuriaClotTypes.length > 0
      ? 'clot_master_yes'
      : (clotNoneChecked ? 'clot_master_no' : '');

    const hematuriaObsTypes = queryHemAll('input[name="hematuriaObsTypes"]:checked').map(el => el.value);
    const obsNoneChecked = Boolean(getHemEl('hematuria_obs_none')?.checked);
    const hematuriaObsMaster = hematuriaObsTypes.length > 0
      ? 'obs_master_yes'
      : (obsNoneChecked ? 'obs_master_no' : '');

    const painMaster = queryHemOne('input[name="hematuriaPainMaster"]:checked')?.value || '';
    let hematuriaPainType = '';
    let painScore = null;
    if (painMaster === 'pain_painless') {
      hematuriaPainType = 'pain_painless';
    } else if (painMaster === 'pain_yes') {
      hematuriaPainType = queryHemOne('input[name="hematuriaPainType"]:checked')?.value || '';
      if (hematuriaPainScoreTouched) {
        const pSlider = getHemEl('hematuriaPainScore');
        if (pSlider) painScore = parseInt(pSlider.value, 10);
      }
    }

    const hematuriaSystemicSigns = queryHemAll('input[name="hematuriaSystemicSigns"]:checked').map(el => el.value);
    const hematuriaTraumaMaster = queryHemOne('input[name="hematuriaTraumaMaster"]:checked')?.value || '';
    const hematuriaTraumaTypes = hematuriaTraumaMaster === 'trauma_master_yes'
      ? queryHemAll('input[name="hematuriaTraumaTypes"]:checked').map(el => el.value)
      : [];

    const hematuriaMeds = queryHemAll('input[name="hematuriaMeds"]:checked').map(el => el.value);
    const currentMedsUnknown = Boolean(getHemEl('currentMedsUnknown')?.checked);

    const titleEl = getHemEl('patientTitleSelect');
    const titleVal = titleEl ? (titleEl.value || '').trim() : '';
    const resolvedGender = ctx.gender && ctx.gender !== 'ไม่ระบุ'
      ? ctx.gender
      : (titleVal ? (isHematuriaFemaleFromTitle() ? 'หญิง' : 'ชาย') : 'ไม่ระบุ');
    const isFemale = resolvedGender === 'หญิง' || resolvedGender === 'Female';

    const hematuriaFemaleBleeding = isFemale
      ? (queryHemOne('input[name="hematuriaFemaleBleeding"]:checked')?.value || '')
      : '';
    const hematuriaMalignancyRisks = queryHemAll('input[name="hematuriaMalignancyRisks"]:checked').map(el => el.value);
    const otherSymptomsFree = getHemEl('hematuria_other_free')?.value?.trim() || ctx.otherSymptomsFree || '';

    const rec = {
      id: ctx.recordId || ctx.id || `case-${Date.now()}`,
      queue_number: ctx.queueNumber || ctx.queue_number || 'ER-NEW',
      hn: ctx.randomHn || ctx.hn || '-',
      name: ctx.patientName || ctx.name || 'ไม่ระบุชื่อ',
      age: ctx.patientAge !== undefined ? ctx.patientAge : (ctx.age !== undefined ? ctx.age : 'ไม่ได้ระบุ'),
      gender: ctx.gender || resolvedGender || 'ไม่ระบุ',
      chief_complaint: 'hematuria',
      chief_complaint_title: 'ปัสสาวะเป็นเลือด',
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

      hematuriaColor,
      hematuriaTiming,
      hematuriaClotMaster,
      hematuriaClotTypes,
      hematuriaObsMaster,
      hematuriaObsTypes,
      hematuriaPainType,
      painScore,
      hematuriaSystemicSigns,
      hematuriaTraumaMaster,
      hematuriaTraumaTypes,
      hematuriaMeds,
      currentMedsUnknown,
      hematuriaFemaleBleeding,
      hematuriaMalignancyRisks
    };

    updateHematuriaOutputs(rec);
    return rec;
  },

  collectFormData: function(ctx = {}) {
    return this.collectIntake(ctx);
  },

  // --- Populate / Hydrate & Reset Form Hooks ---
  populateForm: function(patient) {
    if (!patient) return;
    this.resetForm();

    const setVal = (id, val) => {
      const el = getHemEl(id);
      if (el) el.value = val !== undefined && val !== null ? val : '';
    };
    const setRadio = (name, val) => {
      if (!val) return;
      const el = queryHemOne(`input[name="${name}"][value="${val}"]`);
      if (el) el.checked = true;
    };
    const setChkGroup = (name, arr) => {
      if (!Array.isArray(arr)) return;
      queryHemAll(`input[name="${name}"]`).forEach(cb => {
        cb.checked = arr.includes(cb.value);
      });
    };

    setVal('hematuriaDurationVal', patient.durationVal || '');
    setVal('hematuriaDurationUnit', patient.durationUnit || 'days');

    setRadio('hematuriaColor', patient.hematuriaColor);
    setRadio('hematuriaTiming', patient.hematuriaTiming);

    // Clots
    const clotTypes = Array.isArray(patient.hematuriaClotTypes) ? patient.hematuriaClotTypes : [];
    if (clotTypes.length > 0) {
      setChkGroup('hematuriaClotTypes', clotTypes);
    } else if (patient.hematuriaClotMaster === 'clot_master_no') {
      const clotNone = getHemEl('hematuria_clot_none');
      if (clotNone) clotNone.checked = true;
    }

    // Obstruction
    const obsTypes = Array.isArray(patient.hematuriaObsTypes) ? patient.hematuriaObsTypes : [];
    if (obsTypes.length > 0) {
      setChkGroup('hematuriaObsTypes', obsTypes);
    } else if (patient.hematuriaObsMaster === 'obs_master_no') {
      const obsNone = getHemEl('hematuria_obs_none');
      if (obsNone) obsNone.checked = true;
    }

    // Pain
    if (patient.hematuriaPainType === 'pain_painless') {
      setRadio('hematuriaPainMaster', 'pain_painless');
      handleHematuriaPainMasterChange('pain_painless');
    } else if (patient.hematuriaPainType || (typeof patient.painScore === 'number' && patient.painScore >= 0)) {
      setRadio('hematuriaPainMaster', 'pain_yes');
      handleHematuriaPainMasterChange('pain_yes');
      setRadio('hematuriaPainType', patient.hematuriaPainType);
      if (typeof patient.painScore === 'number' && patient.painScore >= 0) {
        setHematuriaPainScore(patient.painScore);
      } else {
        clearHematuriaPainScore();
      }
    }

    setChkGroup('hematuriaSystemicSigns', patient.hematuriaSystemicSigns);

    if (patient.hematuriaTraumaMaster) {
      setRadio('hematuriaTraumaMaster', patient.hematuriaTraumaMaster);
      handleHematuriaTraumaMasterChange(patient.hematuriaTraumaMaster);
    }
    setChkGroup('hematuriaTraumaTypes', patient.hematuriaTraumaTypes);

    setChkGroup('hematuriaMeds', patient.hematuriaMeds);
    const unkEl = getHemEl('currentMedsUnknown');
    if (unkEl) unkEl.checked = Boolean(patient.currentMedsUnknown);

    if (patient.gender === 'หญิง' || patient.gender === 'Female') {
      syncHematuriaGenderBranch(true);
      setRadio('hematuriaFemaleBleeding', patient.hematuriaFemaleBleeding);
    } else if (patient.gender === 'ชาย' || patient.gender === 'Male') {
      syncHematuriaGenderBranch(false);
    }

    setChkGroup('hematuriaMalignancyRisks', patient.hematuriaMalignancyRisks);
    setVal('hematuria_other_free', patient.otherSymptomsFree || '');
  },

  resetForm: function() {
    this.inputIdsToClear.forEach(id => {
      const el = getHemEl(id);
      if (el) el.value = '';
    });
    const durUnit = getHemEl('hematuriaDurationUnit');
    if (durUnit) durUnit.value = 'days';

    [
      'hematuriaColor', 'hematuriaTiming', 'hematuriaPainMaster',
      'hematuriaPainType', 'hematuriaTraumaMaster', 'hematuriaFemaleBleeding'
    ].forEach(n => {
      queryHemAll(`input[name="${n}"]`).forEach(r => { r.checked = false; });
    });

    [
      'hematuriaClotTypes', 'hematuriaObsTypes', 'hematuriaSystemicSigns',
      'hematuriaTraumaTypes', 'hematuriaMeds', 'hematuriaMalignancyRisks'
    ].forEach(n => {
      queryHemAll(`input[name="${n}"]`).forEach(cb => { cb.checked = false; });
    });

    [
      'hematuria_clot_none', 'hematuria_obs_none', 'hematuria_sys_none',
      'hematuria_meds_none', 'hematuria_risk_none', 'currentMedsUnknown'
    ].forEach(id => {
      const el = getHemEl(id);
      if (el) el.checked = false;
    });

    this.branchIds.forEach(id => {
      const el = getHemEl(id);
      if (el) el.classList.add('hidden');
    });

    clearHematuriaPainScore();
  },

  clearForm: function() {
    this.resetForm();
  },

  hydrateForm: function(patient) {
    this.populateForm(patient);
  },

  isRedFlag: function(patient) {
    return evaluateHematuriaRedFlags(patient).length > 0;
  },
  evaluateRedFlags: evaluateHematuriaRedFlags,
  updateOutputs: updateHematuriaOutputs,
  renderRapidHpi: renderHematuriaRapidHpi,
  renderNarrative: renderHematuriaNarrative,
  renderDoctorHpi: renderHematuriaDoctorHpi,
  seedPatients: hematuriaSeedCases
};

// Register module in Ratchaburi ER Core Registry
if (typeof registerCcModule === 'function') {
  registerCcModule(hematuriaModule);
} else if (typeof window !== 'undefined' && typeof window.registerCcModule === 'function') {
  window.registerCcModule(hematuriaModule);
}

// Export inline event handlers to window scope
if (typeof window !== 'undefined') {
  window.clearHematuriaPainScore = clearHematuriaPainScore;
  window.handleHematuriaPainScoreChange = handleHematuriaPainScoreChange;
  window.setHematuriaPainScore = setHematuriaPainScore;
  window.handleHematuriaClotNoneToggle = handleHematuriaClotNoneToggle;
  window.handleHematuriaClotItemChange = handleHematuriaClotItemChange;
  window.handleHematuriaObsNoneToggle = handleHematuriaObsNoneToggle;
  window.handleHematuriaObsItemChange = handleHematuriaObsItemChange;
  window.handleHematuriaPainMasterChange = handleHematuriaPainMasterChange;
  window.handleHematuriaSystemicNoneToggle = handleHematuriaSystemicNoneToggle;
  window.handleHematuriaSystemicItemChange = handleHematuriaSystemicItemChange;
  window.handleHematuriaTraumaMasterChange = handleHematuriaTraumaMasterChange;
  window.handleHematuriaMedsNoneToggle = handleHematuriaMedsNoneToggle;
  window.handleHematuriaMedsItemChange = handleHematuriaMedsItemChange;
  window.handleHematuriaMedsUnknownToggle = handleHematuriaMedsUnknownToggle;
  window.handleHematuriaRiskNoneToggle = handleHematuriaRiskNoneToggle;
  window.handleHematuriaRiskItemChange = handleHematuriaRiskItemChange;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = hematuriaModule;
}
