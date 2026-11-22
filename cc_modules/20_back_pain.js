// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 20_back_pain.js
// อาการนำ: ปวดหลัง (Back Pain / Lumbago)
// ปรับปรุงตามมาตรฐาน plan_back_pain.md, plan-cc และ code-cc (กลุ่ม B1)
// =========================================================================

// --- Internal DOM & UI Helpers ---
function getBackpainEl(id) {
  return typeof document !== 'undefined' ? document.getElementById(id) : null;
}

function queryBackpainOne(selector) {
  return typeof document !== 'undefined' ? document.querySelector(selector) : null;
}

function queryBackpainAll(selector) {
  return typeof document !== 'undefined' ? Array.from(document.querySelectorAll(selector)) : [];
}

function wrapBackpainWords(chunks) {
  if (!Array.isArray(chunks)) return chunks;
  return chunks.map(c => `<span class="inline-block whitespace-nowrap">${c}</span>`).join(' ');
}

function renderBackpainOption(cfg) {
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
  const titleHtml = Array.isArray(title) ? wrapBackpainWords(title) : title;
  const bodyHtml = desc
    ? `<div class="ml-3 leading-snug"><span class="block text-xs sm:text-sm font-semibold text-slate-800">${titleHtml}</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">${desc}</span></div>`
    : `<span class="ml-3 ${compact ? 'text-xs' : 'text-xs sm:text-sm'} font-semibold text-slate-800 leading-snug">${titleHtml}</span>`;
  return `<label class="selectable-card bg-white flex ${alignCls} ${padCls} rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition${spanCls}"><input type="${kind}" ${idAttr}${nameAttr}${valAttr}${chgAttr}class="${topCls}${roundCls}text-medical-600 focus:ring-medical-500 ${szCls} flex-shrink-0">${bodyHtml}</label>`;
}

function renderBackpainGrid(colsCls, items, shared = {}) {
  return `<div class="grid ${colsCls} gap-2.5">${items.map(it => renderBackpainOption({ ...shared, ...it })).join('\n')}</div>`;
}

function renderBackpainSysHeader({
  label,
  icon,
  colorClass,
  toggleId,
  toggleLabel,
  toggleOnchange,
  toggleName = '',
  toggleValue = ''
}) {
  const nameAttr = toggleName ? `name="${toggleName}" ` : '';
  const valAttr = toggleValue ? `value="${toggleValue}" ` : '';
  return `<div class="flex flex-wrap items-center justify-between gap-2 mb-2.5">
    <label class="flex items-center text-xs sm:text-sm font-bold text-slate-800">
      <span class="${colorClass} p-1.5 rounded-lg mr-2 inline-flex items-center justify-center"><i data-lucide="${icon}" class="w-4 h-4"></i></span>
      <span>${label}</span>
    </label>
    <label class="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-medium text-slate-700 cursor-pointer transition select-none flex-shrink-0">
      <input type="checkbox" id="${toggleId}" ${nameAttr}${valAttr}onchange="${toggleOnchange}" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded">
      <span class="ml-1.5 whitespace-nowrap">${toggleLabel}</span>
    </label>
  </div>`;
}

function renderBackpainSidePanel(groupId, title, inputName, sides) {
  return `<div id="${groupId}" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3 mt-2.5 space-y-2">
    <div class="text-xs font-semibold text-slate-700">${title}</div>
    ${renderBackpainGrid(
      sides.length === 2 ? 'grid-cols-2' : 'grid-cols-3',
      sides.map(s => ({ name: inputName, value: s.value, title: s.label })),
      { compact: true }
    )}
  </div>`;
}

// --- Pain Score Touch State Tracking (Matching 01_abdpain.js Emoji Pain Scale) ---
let backpainPainScoreTouched = false;

function clearBackpainPainScore() {
  backpainPainScoreTouched = false;
  const slider = getBackpainEl('backpainPainScore');
  if (slider) slider.value = 0;
  const emojiEl = getBackpainEl('backpainPainScoreEmoji');
  const textEl = getBackpainEl('backpainPainScoreText');
  const badgeEl = getBackpainEl('backpainPainScoreBadge');
  const clearBtn = getBackpainEl('backpainPainScoreClearBtn');
  if (emojiEl) emojiEl.textContent = '⚪';
  if (textEl) textEl.textContent = 'ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)';
  if (badgeEl) badgeEl.className = 'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all';
  if (clearBtn) clearBtn.classList.add('hidden');
}

function handleBackpainPainScoreChange(val) {
  backpainPainScoreTouched = true;
  const parsed = parseInt(val, 10);
  const num = isNaN(parsed) ? 0 : Math.min(10, Math.max(0, parsed));
  const slider = getBackpainEl('backpainPainScore');
  if (slider && String(slider.value) !== String(num)) slider.value = num;
  const emojiEl = getBackpainEl('backpainPainScoreEmoji');
  const textEl = getBackpainEl('backpainPainScoreText');
  const badgeEl = getBackpainEl('backpainPainScoreBadge');
  const clearBtn = getBackpainEl('backpainPainScoreClearBtn');
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

function setBackpainPainScore(score) {
  backpainPainScoreTouched = true;
  const slider = getBackpainEl('backpainPainScore');
  if (slider) slider.value = score;
  handleBackpainPainScoreChange(score);
}

// --- Progressive Disclosure & Corner-Toggle Handlers ---
function toggleBackpainSideGroup(groupId, isVisible) {
  const el = getBackpainEl(groupId);
  if (!el) return;
  el.classList.toggle('hidden', !isVisible);
  if (!isVisible) {
    el.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
  }
}

function toggleBackpainRadiationSub(isVisible) {
  const el = getBackpainEl('backpainRadiationSub');
  if (!el) return;
  el.classList.toggle('hidden', !isVisible);
  if (!isVisible) {
    el.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
  }
}

function toggleBackpainWarningGroup(groupId, isVisible) {
  const el = getBackpainEl(groupId);
  if (!el) return;
  el.classList.toggle('hidden', !isVisible);
  if (isVisible) {
    const noneEl = getBackpainEl('backpain_warn_none');
    if (noneEl) noneEl.checked = false;
  } else {
    el.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
  }
}

function toggleBackpainTraumaSub(isVisible) {
  const el = getBackpainEl('backpainTraumaSub');
  if (!el) return;
  el.classList.toggle('hidden', !isVisible);
  if (!isVisible) {
    el.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    const otherWrap = getBackpainEl('backpainTraumaOtherWrap');
    if (otherWrap) otherWrap.classList.add('hidden');
    const otherInput = getBackpainEl('backpainTraumaOtherText');
    if (otherInput) otherInput.value = '';
  }
}

function toggleBackpainTraumaOther(isVisible) {
  const el = getBackpainEl('backpainTraumaOtherWrap');
  if (!el) return;
  el.classList.toggle('hidden', !isVisible);
  if (!isVisible) {
    const input = getBackpainEl('backpainTraumaOtherText');
    if (input) input.value = '';
  }
}

function toggleBackpainPostureGroup(isVisible) {
  const el = getBackpainEl('backpainBehaviorPostureSub');
  if (!el) return;
  el.classList.toggle('hidden', !isVisible);
  if (isVisible) {
    const noneEl = getBackpainEl('backpain_behavior_none');
    if (noneEl) noneEl.checked = false;
  } else {
    el.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
  }
}

function handleBackpainBehaviorChange(clickedEl) {
  if (clickedEl && clickedEl.checked) {
    const noneEl = getBackpainEl('backpain_behavior_none');
    if (noneEl) noneEl.checked = false;
  }
}

function handleBackpainBehaviorNoneToggle(clickedEl) {
  if (!clickedEl || !clickedEl.checked) return;
  const postureParent = getBackpainEl('backpainBehaviorPostureParent');
  if (postureParent) postureParent.checked = false;
  toggleBackpainPostureGroup(false);
  queryBackpainAll('input[name="backpainBehavior"]').forEach(cb => { cb.checked = false; });
}

function handleBackpainWarnItemChange(clickedEl) {
  if (clickedEl && clickedEl.checked) {
    const noneEl = getBackpainEl('backpain_warn_none');
    if (noneEl) noneEl.checked = false;
  }
}

function handleBackpainWarnNoneToggle(clickedEl) {
  if (!clickedEl || !clickedEl.checked) return;
  ['backpainWarningNeuroParent', 'backpainWarningExcretoryParent'].forEach(id => {
    const p = getBackpainEl(id);
    if (p) p.checked = false;
  });
  toggleBackpainWarningGroup('backpainWarningNeuroSub', false);
  toggleBackpainWarningGroup('backpainWarningExcretorySub', false);
  queryBackpainAll('input[name="backpainWarningSigns"]').forEach(cb => { cb.checked = false; });
}

function handleBackpainRiskChange(clickedEl) {
  if (!clickedEl) return;
  if (clickedEl.value === 'risks_none') {
    if (clickedEl.checked) {
      queryBackpainAll('input[name="backpainRisks"]').forEach(cb => {
        if (cb.value !== 'risks_none') cb.checked = false;
      });
    }
  } else if (clickedEl.checked) {
    const noneEl = getBackpainEl('backpain_risks_none');
    if (noneEl) noneEl.checked = false;
  }
}

// --- Clinical Red Flag Evaluator ---
function evaluateBackpainRedFlags(patient) {
  const rfs = [];
  if (!patient) return rfs;

  const warnSigns = Array.isArray(patient.backpainWarningSigns) ? patient.backpainWarningSigns : [];
  const traumaTypes = Array.isArray(patient.backpainTraumaTypes) ? patient.backpainTraumaTypes : [];
  const risks = Array.isArray(patient.backpainRisks) ? patient.backpainRisks : [];
  const charTypes = Array.isArray(patient.backpainChar) ? patient.backpainChar : [];
  const radLocs = Array.isArray(patient.backpainRadLoc) ? patient.backpainRadLoc : [];
  const behFactors = Array.isArray(patient.backpainBehavior) ? patient.backpainBehavior : [];
  const vs = patient.vital_signs || {};
  const sbp = typeof vs.sbp === 'number' ? vs.sbp : parseFloat(vs.sbp);
  const pr = typeof vs.pr === 'number' ? vs.pr : parseFloat(vs.pr);
  const bt = typeof vs.bt === 'number' ? vs.bt : parseFloat(vs.bt);
  const shockIndex = (sbp && pr) ? (pr / sbp) : 0;

  // 1. Aortic Dissection with Acute Lower Limb Ischemia (ESI 1)
  const isTearing = charTypes.includes('tearing_ripping');
  const isRadThoracoAbdomen = radLocs.includes('rad_abdomen_chest');
  const hasPulsatileMass = warnSigns.includes('pulsatile_abd_mass');
  const hasSyncope = warnSigns.includes('syncope_hypotension');
  const isHypotensive = (sbp && sbp < 90) || (shockIndex >= 0.9);
  const hasLimbIschemia = warnSigns.includes('ischemic_limb_pain') || warnSigns.includes('ischemic_limb_numbness');

  if (hasLimbIschemia) {
    rfs.push({
      key: 'rf_aortic_dissection_limb_ischemia',
      level: 1,
      textTh: 'สงสัยหลอดเลือดแดงใหญ่ฉีกขาดร่วมกับภาวะขาขาดเลือดเฉียบพลัน (Aortic Dissection with Acute Limb Ischemia)',
      risk: 'วิกฤตฉุกเฉินสูงสุด: ตรวจคลำ Femoral/Pedal pulses (Pulse deficit), Stat CT Angiography Whole Aorta with Runoff, ปรึกษาศัลยแพทย์หลอดเลือดทันที'
    });
  }

  // 1.1 Ruptured / Leaking AAA Risk (ESI 1)
  if ((isTearing || isRadThoracoAbdomen || hasPulsatileMass) && (hasSyncope || isHypotensive || hasPulsatileMass)) {
    rfs.push({
      key: 'rf_ruptured_aaa',
      level: 1,
      textTh: 'สงสัยหลอดเลือดแดงใหญ่ในช่องท้องแตกหรือฉีกขาด (Ruptured / Leaking AAA)',
      risk: 'วิกฤตเฉียบพลัน: เปิดเส้น IV เบอร์ใหญ่ 2 เส้น, สารน้ำ, จองเลือด PRC ด่วน, Stat Bedside U/S หรือ CT Angiography, ปรึกษาศัลยแพทย์หลอดเลือดทันที'
    });
  }

  // 2. Cauda Equina Syndrome (CES) Risk (ESI 1-2)
  const hasSaddle = warnSigns.includes('saddle_anesthesia');
  const hasRetention = warnSigns.includes('urinary_retention');
  const hasIncontinence = warnSigns.includes('bowel_incontinence');
  const hasBilateralWeakness = warnSigns.includes('leg_weakness_both');

  if (hasSaddle || (hasRetention && (hasBilateralWeakness || hasIncontinence))) {
    rfs.push({
      key: 'rf_cauda_equina_syndrome',
      level: 1,
      textTh: 'สงสัยภาวะรากประสาทไขสันหลังส่วนปลายถูกกดทับวิกฤต (Cauda Equina Syndrome)',
      risk: 'เสี่ยงอัมพาตและสูญเสียการขับถ่ายถาวร: งดน้ำงดอาหาร (NPO), Stat MRI Lumbosacral spine, ปรึกษาศัลยแพทย์กระดูกสันหลังเพื่อผ่าตัดฉุกเฉินภายใน 24-48 ชม.'
    });
  } else if (hasRetention || hasIncontinence || hasBilateralWeakness) {
    rfs.push({
      key: 'rf_cauda_equina_syndrome',
      level: 2,
      textTh: 'มีอาการเตือนระบบประสาทและขับถ่ายเสี่ยง Cauda Equina Syndrome',
      risk: 'ตรวจทางระบบประสาทอย่างละเอียด ตรวจ Post-void residual volume และพิจารณาเร่งส่งตรวจ MRI Spine'
    });
  }

  // 3. Spinal Epidural Abscess / Infection Risk (ESI 2)
  const hasFever = warnSigns.includes('fever_chills') || (bt && bt >= 38.5);
  const isHighRiskInfection = risks.includes('hemodialysis_catheter') || risks.includes('iv_drug_use') || traumaTypes.includes('recent_spine_procedure');

  if (hasFever && isHighRiskInfection) {
    rfs.push({
      key: 'rf_spinal_infection',
      level: 2,
      textTh: 'สงสัยฝีหรือการติดเชื้อในช่องไขสันหลัง (Spinal Epidural Abscess / Spondylodiscitis)',
      risk: 'เสี่ยงติดเชื้อในกระแสเลือดและกดทับไขสันหลัง: เจาะเลือดเพาะเชื้อ (H/C x 2), CBC, ESR, CRP, Stat MRI Spine with Contrast, เริ่มยาปฏิชีวนะ IV'
    });
  }

  // 4. Traumatic / Osteoporotic Spinal Fracture (ESI 2-3)
  const isSevereTrauma = traumaTypes.includes('severe_trauma_fall_mva');
  const isElderlyFall = traumaTypes.includes('elderly_minor_fall') && (patient.age >= 60 || risks.includes('osteoporosis') || risks.includes('steroid_immunosuppressed'));

  if (isSevereTrauma || isElderlyFall) {
    rfs.push({
      key: 'rf_spinal_fracture',
      level: 2,
      textTh: 'สงสัยกระดูกสันหลังหักหรือยุบตัวจากอุบัติเหตุ (Spinal Fracture)',
      risk: 'ระวังการเคลื่อนไหวของกระดูกสันหลัง (Spinal Immobilization / Log-roll), ส่งตรวจ Plain Film Spine หรือ CT Spine'
    });
  }

  // 5. Malignant Spinal Cord Compression / Metastasis Risk (ESI 2-3)
  const hasCancerHistory = risks.includes('known_cancer');
  const isNightPain = behFactors.includes('worse_night_supine');
  const hasWeightLoss = warnSigns.includes('weight_loss_anorexia');

  if (hasCancerHistory && (isNightPain || hasWeightLoss)) {
    rfs.push({
      key: 'rf_spinal_cord_compression_malignancy',
      level: 2,
      textTh: 'สงสัยมะเร็งลุกลามกระดูกสันหลัง (Spinal Malignancy / Metastasis)',
      risk: 'ส่งตรวจ Plain X-ray Spine, MRI Spine, ปรึกษาแพทย์เฉพาะทางมะเร็งและประเมินภาวะกดทับไขสันหลัง'
    });
  }

  // 6. Acute Radiculopathy with Foot Drop (ESI 3)
  const hasFootDrop = warnSigns.includes('foot_drop_single');
  if (hasFootDrop) {
    rfs.push({
      key: 'rf_radicular_foot_drop',
      level: 3,
      textTh: 'มีอาการปลายเท้าตกเฉียบพลัน (Acute Foot Drop / L5 Nerve Root Deficit)',
      risk: 'ประเมิน Motor power L5-S1, หลีกเลี่ยงการยกของหนัก และพิจารณาส่งต่อศัลยแพทย์กระดูกและข้อ'
    });
  }

  // 7. Urinary Tract Calculus with Obstruction / Renal Colic (ESI 3)
  const hasGravel = warnSigns.includes('gravel_sand_urine');
  const hasDysuria = warnSigns.includes('dysuria_hematuria');
  const hasFlank = Array.isArray(patient.backpainLoc) && patient.backpainLoc.includes('flank_side');
  if (hasGravel || (hasFlank && hasDysuria)) {
    rfs.push({
      key: 'rf_urinary_calculus_colic',
      level: 3,
      textTh: 'สงสัยนิ่วทางเดินปัสสาวะอุดกั้น / กรวยไตอักเสบ (Urinary Tract Calculus / Renal Colic)',
      risk: 'ตรวจปัสสาวะ (Urinalysis), KUB X-ray หรือ Bedside U/S KUB ประเมิน Hydronephrosis และให้ยาแก้ปวดลดการเกร็ง'
    });
  }

  return rfs;
}

// --- Thai Dictionaries & Formatting Helpers ---
const BACKPAIN_DUR_UNIT_MAP = {
  minutes: 'นาที',
  hours: 'ชั่วโมง',
  days: 'วัน',
  weeks: 'สัปดาห์',
  months: 'เดือน',
  years: 'ปี'
};

const BACKPAIN_SIDE_MAP = {
  left: 'ซ้าย',
  right: 'ขวา',
  center: 'ตรงกลาง'
};

const BACKPAIN_ONSET_MAP = {
  sudden_severe: 'ปวดรุนแรงทันทีทันใด',
  gradual_worsening: 'ค่อยๆ ปวดเพิ่มขึ้นเรื่อยๆ'
};

const BACKPAIN_CHAR_MAP = {
  dull_aching: 'ตื้อๆ เมื่อย ระบม',
  sharp_stabbing: 'แปล๊บ/เสียบแทง',
  electric_shock: 'จี๊ดเหมือนไฟช็อต',
  tearing_ripping: 'ฉีกขาดรุนแรงจัด',
  colicky_spasm: 'บิดเกร็งเป็นพักๆ',
  burning: 'แสบร้อนผิวหนัง'
};

const BACKPAIN_RAD_MAP = {
  rad_leg_below_knee: 'ร้าวลงขา/น่อง ต่ำกว่าเข่า',
  rad_buttock_thigh: 'ร้าวลงสะโพก/ต้นขา',
  rad_abdomen_chest: 'ร้าวทะลุหน้าอก/หน้าท้อง',
  rad_groin: 'ร้าวลงขาหนีบ/อัณฑะ'
};

const BACKPAIN_BEHAVIOR_MAP = {
  worse_cough_strain: 'ปวดมากขึ้นเมื่อไอ จาม หรือเบ่ง',
  worse_night_supine: 'ปวดมากตอนกลางคืน นอนพักไม่ทุเลา',
  worse_flexion_sitting: 'ปวดมากเมื่อก้มตัวหรือนั่งนานๆ',
  worse_extension_standing_walking: 'ปวดมากเมื่อแอ่นหลัง ยืน หรือเดินนาน',
  worse_movement: 'ปวดเวลาขยับตัว'
};

const BACKPAIN_WARN_MAP = {
  saddle_anesthesia: 'ชาบริเวณก้น แก้มก้น หว่างขา หรือรอบรูทวาร',
  leg_weakness_both: 'ขาอ่อนแรงทั้งสองข้าง เดินไม่ไหว หรือขาทรุด',
  foot_drop_single: 'ปลายเท้าตก กระดกข้อเท้าหรือไม่ขึ้น',
  numbness_leg_foot: 'ชาตามแนวขา น่อง หรือหลังเท้า',
  ischemic_limb_pain: 'ปวดรุนแรงเหมือนเนื้อจะระเบิดลึกๆ ในน่องหรือเท้า',
  ischemic_limb_numbness: 'ไม่รู้สึกถึงสัมผัสใดๆ ที่ขาหรือปลายเท้า',
  bowel_incontinence: 'กลั้นอุจจาระไม่ได้ เล็ดราดโดยไม่รู้ตัว',
  urinary_retention: 'ปัสสาวะไม่ออก หรือปวดตึงแน่นท้องน้อย',
  dysuria_hematuria: 'ปัสสาวะแสบขัด หรือปัสสาวะเป็นเลือด',
  gravel_sand_urine: 'ปัสสาวะปนตะกอนคล้ายกรวดทราย',
  fever_chills: 'มีไข้สูง หนาวสั่นสะท้าน',
  syncope_hypotension: 'หน้ามืด วูบ เป็นลม เหงื่อแตกตัวเย็น',
  pulsatile_abd_mass: 'คลำได้ก้อนเต้นตุบๆ ในช่องท้อง',
  weight_loss_anorexia: 'น้ำหนักลดลงผิดปกติ เบื่ออาหาร'
};

const BACKPAIN_TRAUMA_MAP = {
  severe_trauma_fall_mva: 'อุบัติเหตุรุนแรง (ตกจากที่สูง/รถชน/กระแทกแรง)',
  elderly_minor_fall: 'ลื่นล้มก้นกระแทก หรือสะดุดล้ม',
  heavy_lifting: 'ยกของหนัก หรือก้มบิดผิดจังหวะ',
  recent_spine_procedure: 'เพิ่งผ่าตัดหลัง เจาะหลัง หรือบล็อกหลังใน 1 เดือน'
};

const BACKPAIN_RISK_MAP = {
  known_cancer: 'มีประวัติโรคมะเร็งเดิม',
  steroid_immunosuppressed: 'กินยาสเตียรอยด์ต่อเนื่อง หรือภูมิคุ้มกันบกพร่อง',
  hemodialysis_catheter: 'ฟอกไตทางเส้นเลือด หรือมีสายสวนค้าง',
  iv_drug_use: 'ประวัติฉีดยาเสพติดเข้าเส้นเลือด',
  osteoporosis: 'ตรวจพบโรคกระดูกพรุนเดิม'
};

const BACKPAIN_HOSP_MAP = {
  ratchaburi: 'มีประวัติการรักษาที่ รพ.ราชบุรี',
  complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
  additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
  self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
  unspecified: 'ไม่ได้ระบุ'
};

function formatBackpainLocations(patient) {
  const locs = Array.isArray(patient.backpainLoc) ? patient.backpainLoc : [];
  if (locs.length === 0) return 'ไม่ได้ระบุ';

  const parts = [];
  const sideFormat = (sides) => {
    if (!Array.isArray(sides) || sides.length === 0) return '';
    return ` (${sides.map(s => BACKPAIN_SIDE_MAP[s] || s).join(', ')})`;
  };

  locs.forEach(l => {
    if (l === 'mid_back_thoracic') parts.push(`หลังช่วงกลาง/สะบัก${sideFormat(patient.backpainLocThoracicSide)}`);
    else if (l === 'flank_side') parts.push(`สีข้าง/บั้นเอวด้านข้าง${sideFormat(patient.backpainLocFlankSide)}`);
    else if (l === 'low_back_lumbar') parts.push(`หลังช่วงล่าง${sideFormat(patient.backpainLocLumbarSide)}`);
    else if (l === 'sacrum_buttock') parts.push(`ก้นกบ/สะโพก${sideFormat(patient.backpainLocSacrumSide)}`);
    else if (l === 'diffuse') parts.push('ปวดระบมทั่วแผ่นหลัง');
    else parts.push(l);
  });

  return parts.join(', ');
}

function formatBackpainChars(patient) {
  const chars = Array.isArray(patient.backpainChar) ? patient.backpainChar : [];
  if (chars.length === 0) return 'ไม่ได้ระบุ';
  return chars.map(c => BACKPAIN_CHAR_MAP[c] || c).join(', ');
}

function formatBackpainRadiation(patient) {
  if (!patient.backpainRadMaster) return 'ไม่ได้ระบุ';
  if (patient.backpainRadMaster === 'none') return 'ปวดเฉพาะที่หลัง ไม่ร้าวไปไหน';
  const rads = Array.isArray(patient.backpainRadLoc) ? patient.backpainRadLoc : [];
  if (rads.length === 0) return 'มีปวดร้าว (ไม่ได้ระบุตำแหน่ง)';
  return `ปวดร้าวไปยัง ${rads.map(r => BACKPAIN_RAD_MAP[r] || r).join(', ')}`;
}

function formatBackpainBehavior(patient) {
  const behs = Array.isArray(patient.backpainBehavior) ? patient.backpainBehavior : [];
  if (behs.length > 0) return behs.map(b => BACKPAIN_BEHAVIOR_MAP[b] || b).join(', ');
  if (patient.backpainBehaviorPostureParent) return 'ปวดมากตามท่าทาง/เคลื่อนไหว (ไม่ได้ระบุท่าย่อย)';
  if (patient.backpainBehaviorNone) return 'ปฏิเสธอาการปวดมากขึ้นเมื่อไอจามเบ่ง ปวดตอนกลางคืน และปวดตามท่าทาง/เคลื่อนไหว';
  return 'ไม่ได้ระบุ';
}

// --- Rapid Note HPI Renderer (Doctor View) ---
function renderBackpainRapidHpi(patient) {
  const durVal = patient.durationVal;
  const durUnit = BACKPAIN_DUR_UNIT_MAP[patient.durationUnit] || 'วัน';
  const durationStr = durVal ? `${durVal} ${durUnit}` : 'ไม่ได้ระบุ';

  const onsetStr = BACKPAIN_ONSET_MAP[patient.backpainOnsetMode] || 'ไม่ได้ระบุ';
  const pScore = (typeof patient.painScore === 'number' && patient.painScore > 0)
    ? `${patient.painScore}/10 คะแนน`
    : (patient.painScore === 0 ? '0/10 คะแนน (ไม่ปวด)' : 'ไม่ได้ระบุ');

  const warnSigns = Array.isArray(patient.backpainWarningSigns) ? patient.backpainWarningSigns : [];
  const traumaTypes = Array.isArray(patient.backpainTraumaTypes) ? patient.backpainTraumaTypes : [];
  const risks = Array.isArray(patient.backpainRisks) ? patient.backpainRisks : [];

  const posList = [];
  const negList = [];

  // Associated warnings, trauma & risks (de-duplicated from upper HPI lines)
  warnSigns.forEach(k => {
    if (BACKPAIN_WARN_MAP[k]) posList.push(BACKPAIN_WARN_MAP[k]);
  });

  if (patient.backpainTraumaMaster === 'yes') {
    traumaTypes.forEach(k => {
      if (BACKPAIN_TRAUMA_MAP[k]) posList.push(BACKPAIN_TRAUMA_MAP[k]);
    });
    if (traumaTypes.includes('trauma_other') && patient.backpainTraumaOtherText) {
      posList.push(`อุบัติเหตุ/หัตถการอื่นๆ: ${patient.backpainTraumaOtherText}`);
    } else if (traumaTypes.length === 0) {
      posList.push('มีประวัติอุบัติเหตุ บาดเจ็บ หรือหัตถการบริเวณหลัง');
    }
  }

  risks.filter(r => r !== 'risks_none').forEach(k => {
    if (BACKPAIN_RISK_MAP[k]) posList.push(BACKPAIN_RISK_MAP[k]);
  });

  if (patient.otherSymptomsFree) {
    posList.push(patient.otherSymptomsFree);
  }

  // Confirmed negatives only (Zero Default Bias)
  if (patient.backpainRadMaster === 'none') {
    negList.push('ปฏิเสธอาการปวดร้าวไปยังบริเวณอื่น');
  }
  if (patient.backpainBehaviorNone) {
    negList.push('ปฏิเสธอาการปวดมากขึ้นเมื่อไอจามเบ่ง ปวดมากตอนกลางคืนนอนพักไม่ทุเลา และปวดมากตามท่าทาง/เคลื่อนไหว');
  }
  if (patient.backpainWarnNone) {
    negList.push('ปฏิเสธชาก้น/หว่างขา ขาอ่อนแรง ปลายเท้าตก ปวด/ชาขาเฉียบพลัน กลั้นขับถ่ายไม่ได้ ปัสสาวะขัด ไข้หนาวสั่น หน้ามืดวูบ ก้อนเต้นในท้อง และน้ำหนักลดฮวบ');
  } else if (warnSigns.length > 0) {
    if (!warnSigns.includes('saddle_anesthesia')) negList.push('ปฏิเสธอาการชาบริเวณก้นและหว่างขา');
    if (!warnSigns.includes('urinary_retention') && !warnSigns.includes('bowel_incontinence')) {
      negList.push('ปฏิเสธปัสสาวะไม่ออกและกลั้นอุจจาระไม่ได้');
    }
    if (!warnSigns.includes('leg_weakness_both') && !warnSigns.includes('foot_drop_single')) {
      negList.push('ปฏิเสธขาอ่อนแรง 2 ข้างและปลายเท้าตก');
    }
    if (!warnSigns.includes('ischemic_limb_pain') && !warnSigns.includes('ischemic_limb_numbness')) {
      negList.push('ปฏิเสธอาการปวดหรือชาขาเฉียบพลันผิดปกติ');
    }
    if (!warnSigns.includes('dysuria_hematuria') && !warnSigns.includes('gravel_sand_urine')) {
      negList.push('ปฏิเสธปัสสาวะแสบขัด เป็นเลือด หรือปนกรวดทราย');
    }
    if (!warnSigns.includes('fever_chills')) negList.push('ปฏิเสธไข้หนาวสั่น');
    if (!warnSigns.includes('syncope_hypotension')) negList.push('ปฏิเสธหน้ามืดหรือวูบหมดสติ');
  }

  if (patient.backpainTraumaMaster === 'no') {
    negList.push('ปฏิเสธประวัติอุบัติเหตุหรือหัตถการบริเวณหลังนำมาก่อน');
  }
  if (risks.includes('risks_none')) {
    negList.push('ปฏิเสธประวัติมะเร็งเดิม การใช้สเตียรอยด์ ฟอกไตทางเส้นเลือด ฉีดสารเสพติด และกระดูกพรุน');
  } else if (risks.length > 0 && !risks.includes('known_cancer')) {
    negList.push('ปฏิเสธประวัติโรคมะเร็งเดิม');
  }

  const hospLabel = BACKPAIN_HOSP_MAP[patient.hospRecordStatus] || 'ไม่ได้ระบุ';
  const udArr = Array.isArray(patient.underlying) ? patient.underlying : (patient.underlying ? [patient.underlying] : []);
  const filteredUd = udArr.filter(u => u && !u.includes('ปฏิเสธ') && u !== 'ไม่มี' && u !== 'ไม่มีโรคประจำตัว' && u !== 'ไม่ได้ระบุ');
  const hasExplicitUdDeny = udArr.some(u => u && (u.includes('ปฏิเสธ') || u === 'ไม่มี' || u === 'ไม่มีโรคประจำตัว'));
  const udDisplay = filteredUd.length > 0
    ? filteredUd.join(', ')
    : ((hasExplicitUdDeny || patient.hospRecordStatus === 'self' || patient.hospRecordStatus === 'additional') ? 'ปฏิเสธ' : 'ไม่ได้ระบุ');

  const allergyDisplay = (!patient.drugAllergy || patient.drugAllergy === 'ไม่ได้ระบุ')
    ? 'ไม่ได้ระบุ'
    : ((patient.drugAllergy.includes('ปฏิเสธ') || patient.drugAllergy === 'ไม่มี') ? 'ปฏิเสธ' : patient.drugAllergy);
  const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ')
    ? 'ไม่ได้ระบุ'
    : (patient.currentMeds === 'ไม่มี' ? 'ไม่มี' : patient.currentMeds);
  const docNotes = patient.doctor_notes || {};
  const redFlags = evaluateBackpainRedFlags(patient);

  return `[Chief Complaint (CC)]
ปวดหลัง (Back pain / Lumbago) มา ${durationStr}

[History of Present Illness (HPI)]
• ระยะเวลาที่มีอาการ: ${durVal ? `ปวดมา ${durationStr}` : 'ไม่ได้ระบุ'}
• ตำแหน่งที่ปวด: ${formatBackpainLocations(patient)}
• ลักษณะการเริ่มปวด: ${onsetStr}
• ลักษณะอาการปวด: ${formatBackpainChars(patient)}
• การปวดร้าว: ${formatBackpainRadiation(patient)}
• พฤติกรรมกับอาการ: ${formatBackpainBehavior(patient)}
• ระดับความเจ็บปวด (Pain Score): ${pScore}

• Pertinent Positives:
${posList.length > 0 ? posList.map(p => `  - ${p}`).join('\n') : '  - ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม'}

• Pertinent Negatives:
${negList.length > 0 ? negList.map(n => `  - ${n}`).join('\n') : '  - ผู้ป่วยไม่ได้ระบุคำตอบยืนยันในหมวดอาการร่วม'}

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
}

// --- Narrative Note Generator (Doctor View) ---
function renderBackpainNarrative(patient) {
  const durUnit = BACKPAIN_DUR_UNIT_MAP[patient.durationUnit] || 'วัน';
  const durStr = patient.durationVal ? `${patient.durationVal} ${durUnit}` : 'ไม่ระบุระยะเวลา';

  const locStr = formatBackpainLocations(patient);
  const onsetStr = BACKPAIN_ONSET_MAP[patient.backpainOnsetMode] || 'ไม่ได้ระบุรูปแบบการเริ่มปวด';
  const charStr = formatBackpainChars(patient);
  const radStr = formatBackpainRadiation(patient);
  const behArr = Array.isArray(patient.backpainBehavior) ? patient.backpainBehavior : [];
  const behStr = behArr.length > 0
    ? behArr.map(b => BACKPAIN_BEHAVIOR_MAP[b] || b).join(', ')
    : (patient.backpainBehaviorPostureParent ? 'ปวดมากตามท่าทาง/เคลื่อนไหว' : '');
  const pScore = (typeof patient.painScore === 'number') ? `${patient.painScore}/10 คะแนน` : 'ไม่ได้ระบุ';
  const warnSigns = Array.isArray(patient.backpainWarningSigns) ? patient.backpainWarningSigns : [];
  const risks = Array.isArray(patient.backpainRisks) ? patient.backpainRisks.filter(r => r !== 'risks_none') : [];
  const genderLabel = (patient.gender && patient.gender !== 'ไม่ระบุ') ? patient.gender : '';

  let note = `ผู้ป่วย${genderLabel} อายุ ${patient.age || 'ไม่ได้ระบุ'} ปี มารับการตรวจด้วยอาการปวดหลัง เป็นมา ${durStr} ก่อนมาโรงพยาบาล ตำแหน่งปวดบริเวณ${locStr} รูปแบบการเริ่มปวด: ${onsetStr} ลักษณะปวดแบบ${charStr} ${radStr}`;
  if (behStr) note += ` อาการสัมพันธ์กับพฤติกรรม: ${behStr}`;
  note += ` ระดับความเจ็บปวดประเมินได้ ${pScore}`;

  if (warnSigns.length > 0) {
    const warnTexts = warnSigns.map(k => BACKPAIN_WARN_MAP[k] || k);
    note += ` ร่วมกับมีอาการสำคัญ ได้แก่ ${warnTexts.join(', ')}`;
  }

  if (patient.backpainTraumaMaster === 'yes') {
    const tTypes = Array.isArray(patient.backpainTraumaTypes) ? patient.backpainTraumaTypes : [];
    const tTexts = tTypes.map(k => BACKPAIN_TRAUMA_MAP[k]).filter(Boolean);
    if (tTypes.includes('trauma_other') && patient.backpainTraumaOtherText) tTexts.push(patient.backpainTraumaOtherText);
    if (tTexts.length > 0) note += ` โดยมีประวัติอุบัติเหตุ/หัตถการนำมาก่อนคือ ${tTexts.join(', ')}`;
  } else if (patient.backpainTraumaMaster === 'no') {
    note += ' ผู้ป่วยปฏิเสธประวัติอุบัติเหตุหรือหัตถการนำมาก่อน';
  }

  if (risks.length > 0) {
    note += ` ปัจจัยเสี่ยงจำเพาะ: ${risks.map(k => BACKPAIN_RISK_MAP[k] || k).join(', ')}`;
  }

  return note;
}

function renderBackpainDoctorHpi(patient) {
  return renderBackpainRapidHpi(patient);
}

function updateBackpainOutputs(rec) {
  if (!rec) return null;
  const rapidText = renderBackpainRapidHpi(rec);
  const narrativeText = renderBackpainNarrative(rec);
  const finalRapid = rec.custom_rapid_note || rapidText;
  const finalNarrative = rec.custom_narrative_note || narrativeText;

  if (typeof document !== 'undefined') {
    const rapidEl = document.getElementById('rapidTextView');
    const narrativeEl = document.getElementById('narrativeTextView');
    if (rapidEl) rapidEl.value = finalRapid;
    if (narrativeEl) narrativeEl.value = finalNarrative;
  }

  const posMatch = rapidText.match(/• Pertinent Positives:\n((?:\s*-[^\n]+\n?)+)/);
  if (posMatch) {
    rec.pertinentPositives = posMatch[1].trim().split('\n').map(l => l.replace(/^[-*\s]+/, '').trim());
  } else {
    rec.pertinentPositives = ['ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม'];
  }

  const negMatch = rapidText.match(/• Pertinent Negatives:\n((?:\s*-[^\n]+\n?)+)/);
  if (negMatch) {
    rec.pertinentNegatives = negMatch[1].trim().split('\n').map(l => l.replace(/^[-*\s]+/, '').trim());
  } else {
    rec.pertinentNegatives = ['ผู้ป่วยไม่ได้ระบุคำตอบยืนยันในหมวดอาการร่วม'];
  }

  const redFlags = evaluateBackpainRedFlags(rec);
  rec.redFlags = redFlags;

  const jsonOutput = {
    encounter: {
      chief_complaint: 'back_pain',
      chief_complaint_title_th: 'ปวดหลัง',
      timestamp: rec.timestamp || new Date().toISOString(),
      duration_val: rec.durationVal || null,
      duration_unit: rec.durationUnit || 'days'
    },
    patient_identification: {
      id: rec.id || null,
      queue_number: rec.queue_number || null,
      hn: rec.hn || null,
      name: rec.name || null,
      age: rec.age || null,
      gender: rec.gender || null
    },
    triage_assessment: {
      locations: Array.isArray(rec.backpainLoc) ? rec.backpainLoc : [],
      onset_mode: rec.backpainOnsetMode || null,
      pain_characteristics: Array.isArray(rec.backpainChar) ? rec.backpainChar : [],
      radiation_master: rec.backpainRadMaster || null,
      radiation: Array.isArray(rec.backpainRadLoc) ? rec.backpainRadLoc : [],
      behavior: Array.isArray(rec.backpainBehavior) ? rec.backpainBehavior : [],
      pain_score: rec.painScore !== null && rec.painScore !== undefined ? rec.painScore : null,
      warning_signs: Array.isArray(rec.backpainWarningSigns) ? rec.backpainWarningSigns : [],
      trauma_master: rec.backpainTraumaMaster || null,
      trauma_types: Array.isArray(rec.backpainTraumaTypes) ? rec.backpainTraumaTypes : [],
      risk_factors: Array.isArray(rec.backpainRisks) ? rec.backpainRisks : [],
      other_symptoms_free: rec.otherSymptomsFree || ''
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

  rec.rapidHpi = finalRapid;
  rec.narrativeHpi = finalNarrative;
  rec.medicalJson = jsonOutput;

  if (typeof document !== 'undefined') {
    const jsonEl = document.getElementById('jsonViewer');
    if (jsonEl) jsonEl.textContent = JSON.stringify(jsonOutput, null, 2);
  }

  return { rapid: finalRapid, narrative: finalNarrative, json: jsonOutput };
}

// =========================================================================
// UI TEMPLATE FRAGMENTS (Golden UI/UX — 4 Cards + Universal PMH Card 5)
// =========================================================================
const BACKPAIN_LOC_SIDES_HTML = [
  renderBackpainSidePanel('thoracicSideGroup', 'ระบุข้างที่ปวดบริเวณหลังช่วงกลาง / สะบัก', 'backpainLocThoracicSide', [
    { value: 'left', label: 'ซ้าย' },
    { value: 'right', label: 'ขวา' },
    { value: 'center', label: 'ตรงกลาง' }
  ]),
  renderBackpainSidePanel('flankSideGroup', 'ระบุข้างที่ปวดบริเวณสีข้าง / บั้นเอวด้านข้าง', 'backpainLocFlankSide', [
    { value: 'left', label: 'ซ้าย' },
    { value: 'right', label: 'ขวา' }
  ]),
  renderBackpainSidePanel('lumbarSideGroup', 'ระบุข้างที่ปวดบริเวณหลังช่วงล่าง', 'backpainLocLumbarSide', [
    { value: 'left', label: 'ซ้าย' },
    { value: 'right', label: 'ขวา' },
    { value: 'center', label: 'ตรงกลาง' }
  ]),
  renderBackpainSidePanel('sacrumSideGroup', 'ระบุข้างที่ปวดบริเวณก้นกบ / สะโพก', 'backpainLocSacrumSide', [
    { value: 'left', label: 'ซ้าย' },
    { value: 'right', label: 'ขวา' },
    { value: 'center', label: 'ตรงกลาง' }
  ])
].join('\n');

const BACKPAIN_RAD_SUB_HTML = `<div id="backpainRadiationSub" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-3 space-y-2.5">
  <div class="text-xs font-semibold text-slate-700">ระบุบริเวณที่ปวดร้าว (เลือกได้หลายข้อ)</div>
  ${renderBackpainGrid('grid-cols-1 sm:grid-cols-2', [
    { name: 'backpainRadLoc', value: 'rad_leg_below_knee', title: ['ร้าวลงขา / น่อง', 'ต่ำกว่าเข่า'] },
    { name: 'backpainRadLoc', value: 'rad_buttock_thigh', title: ['ร้าวลงสะโพก', '/ ต้นขา'] },
    { name: 'backpainRadLoc', value: 'rad_abdomen_chest', title: ['ร้าวทะลุหน้าอก', 'หรือหน้าท้อง'] },
    { name: 'backpainRadLoc', value: 'rad_groin', title: ['ร้าวลงขาหนีบ', '/ อัณฑะ'] }
  ], { compact: true })}
</div>`;

const BACKPAIN_BEHAVIOR_POSTURE_SUB_HTML = `<div id="backpainBehaviorPostureSub" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-3 space-y-2.5">
  <div class="text-xs font-semibold text-slate-700">ระบุท่าทางหรือการเคลื่อนไหวที่ปวดมาก (เลือกได้หลายข้อ)</div>
  ${renderBackpainGrid('grid-cols-1 sm:grid-cols-2', [
    { name: 'backpainBehavior', value: 'worse_flexion_sitting', title: ['ปวดมากเมื่อก้มตัว', 'หรือนั่งนานๆ'], onchange: 'handleBackpainBehaviorChange(this)' },
    { name: 'backpainBehavior', value: 'worse_extension_standing_walking', title: ['ปวดมากเมื่อแอ่นหลัง', 'ยืน หรือเดินนาน'], onchange: 'handleBackpainBehaviorChange(this)' },
    { name: 'backpainBehavior', value: 'worse_movement', title: ['ปวดเวลาขยับตัว'], onchange: 'handleBackpainBehaviorChange(this)', colSpan2: true }
  ], { compact: true })}
</div>`;

const BACKPAIN_WARN_SUBS_HTML = [
  `<div id="backpainWarningNeuroSub" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-3 space-y-2.5">
    <div class="text-xs font-semibold text-slate-700">รายละเอียดอาการอ่อนแรง ชา หรือปวดช่วงล่างและขา (เลือกได้หลายข้อ)</div>
    ${renderBackpainGrid('grid-cols-1 sm:grid-cols-2', [
      { name: 'backpainWarningSigns', value: 'saddle_anesthesia', title: ['ชาก้น แก้มก้น', 'หว่างขา', 'หรือรอบรูทวาร'], onchange: 'handleBackpainWarnItemChange(this)' },
      { name: 'backpainWarningSigns', value: 'leg_weakness_both', title: ['ขาอ่อนแรง 2 ข้าง', 'เดินไม่ไหว', 'หรือขาทรุด'], onchange: 'handleBackpainWarnItemChange(this)' },
      { name: 'backpainWarningSigns', value: 'foot_drop_single', title: ['ปลายเท้าตก', 'กระดกข้อเท้า', 'หรือนิ้วเท้าไม่ขึ้น'], onchange: 'handleBackpainWarnItemChange(this)' },
      { name: 'backpainWarningSigns', value: 'numbness_leg_foot', title: ['ชาตามแนวขา', 'น่อง หรือหลังเท้า'], onchange: 'handleBackpainWarnItemChange(this)' },
      { name: 'backpainWarningSigns', value: 'ischemic_limb_pain', title: ['ปวดรุนแรงเหมือน', 'เนื้อจะระเบิด', 'ที่น่องหรือเท้า'], onchange: 'handleBackpainWarnItemChange(this)' },
      { name: 'backpainWarningSigns', value: 'ischemic_limb_numbness', title: ['ไม่รู้สึกสัมผัส', 'ที่ขาหรือปลายเท้า'], onchange: 'handleBackpainWarnItemChange(this)' }
    ], { compact: true })}
  </div>`,
  `<div id="backpainWarningExcretorySub" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-3 space-y-2.5">
    <div class="text-xs font-semibold text-slate-700">รายละเอียดความผิดปกติในการขับถ่ายอุจจาระและปัสสาวะ (เลือกได้หลายข้อ)</div>
    ${renderBackpainGrid('grid-cols-1 sm:grid-cols-2', [
      { name: 'backpainWarningSigns', value: 'bowel_incontinence', title: ['กลั้นอุจจาระไม่ได้', 'เล็ดราดโดยไม่รู้ตัว'], onchange: 'handleBackpainWarnItemChange(this)' },
      { name: 'backpainWarningSigns', value: 'urinary_retention', title: ['ปัสสาวะไม่ออก', 'ปวดตึงท้องน้อย'], onchange: 'handleBackpainWarnItemChange(this)' },
      { name: 'backpainWarningSigns', value: 'dysuria_hematuria', title: ['ปัสสาวะแสบขัด', 'หรือเป็นเลือด'], onchange: 'handleBackpainWarnItemChange(this)' },
      { name: 'backpainWarningSigns', value: 'gravel_sand_urine', title: ['ปัสสาวะปนตะกอน', 'คล้ายกรวดทราย'], onchange: 'handleBackpainWarnItemChange(this)' }
    ], { compact: true })}
  </div>`
].join('\n');

const BACKPAIN_TRAUMA_SUB_HTML = `<div id="backpainTraumaSub" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-3 space-y-3">
  <div class="text-xs font-semibold text-slate-700">ระบุเหตุการณ์ที่เกิดขึ้น (เลือกได้หลายข้อ)</div>
  ${renderBackpainGrid('grid-cols-1 sm:grid-cols-2', [
    { name: 'backpainTraumaTypes', value: 'severe_trauma_fall_mva', title: ['อุบัติเหตุรุนแรง'], desc: 'เช่น ตกจากที่สูง รถชน กระแทกแรง' },
    { name: 'backpainTraumaTypes', value: 'elderly_minor_fall', title: ['ลื่นล้มก้นกระแทก', '/ สะดุดล้ม'] },
    { name: 'backpainTraumaTypes', value: 'heavy_lifting', title: ['ยกของหนัก', 'ก้มบิดผิดจังหวะ'] },
    { name: 'backpainTraumaTypes', value: 'recent_spine_procedure', title: ['เพิ่งผ่าตัดหลัง', 'เจาะหลัง / บล็อกหลัง'], desc: 'ภายใน 1 เดือนที่ผ่านมา' },
    { id: 'backpainTraumaOtherCb', name: 'backpainTraumaTypes', value: 'trauma_other', title: ['อื่นๆ (ระบุเพิ่มเติม)'], onchange: 'toggleBackpainTraumaOther(this.checked)', colSpan2: true }
  ], { compact: true })}
  <div id="backpainTraumaOtherWrap" class="hidden">
    <input type="text" id="backpainTraumaOtherText" placeholder="พิมพ์ระบุเหตุการณ์หรืออุบัติเหตุเพิ่มเติม..."
      class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500">
  </div>
</div>`;

const BACKPAIN_PAIN_SCALE_HTML = `<div class="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
    <label class="block text-xs font-semibold text-slate-800 tracking-wider">2.4 ระดับความเจ็บปวดในขณะนี้ (Pain Score: 0–10)</label>
    <div class="flex items-center space-x-2">
      <span id="backpainPainScoreBadge" class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all">
        <span id="backpainPainScoreEmoji" class="text-base">⚪</span>
        <span id="backpainPainScoreText">ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)</span>
      </span>
      <button type="button" id="backpainPainScoreClearBtn" onclick="clearBackpainPainScore()" class="text-xs text-slate-500 hover:text-slate-800 underline hidden transition" title="ล้างค่าเพื่อให้เป็นไม่ได้ระบุ">ล้างค่า</button>
    </div>
  </div>
  <div class="px-1 pt-1">
    <input type="range" id="backpainPainScore" min="0" max="10" value="0" step="1" oninput="handleBackpainPainScoreChange(this.value)" class="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-600 focus:outline-none focus:ring-2 focus:ring-medical-500">
  </div>
  <div class="grid grid-cols-5 text-center text-[10px] sm:text-[11px] pt-1 gap-1 text-slate-500 font-medium">
    <div class="cursor-pointer hover:text-medical-600 transition" onclick="setBackpainPainScore(0)"><span class="text-lg sm:text-xl block">😊</span><span>0: สบายดี</span></div>
    <div class="cursor-pointer hover:text-medical-600 transition" onclick="setBackpainPainScore(2)"><span class="text-lg sm:text-xl block">🙂</span><span>1–3: เล็กน้อย</span></div>
    <div class="cursor-pointer hover:text-medical-600 transition" onclick="setBackpainPainScore(5)"><span class="text-lg sm:text-xl block">😐</span><span>4–6: ปานกลาง</span></div>
    <div class="cursor-pointer hover:text-medical-600 transition" onclick="setBackpainPainScore(8)"><span class="text-lg sm:text-xl block">😣</span><span>7–9: ปวดมาก</span></div>
    <div class="cursor-pointer hover:text-medical-600 transition" onclick="setBackpainPainScore(10)"><span class="text-lg sm:text-xl block">😭</span><span>10: ปวดที่สุด</span></div>
  </div>
</div>`;

// =========================================================================
// MODULE DEFINITION & REGISTRATION
// =========================================================================
const backpainModule = {
  id: 'back_pain',
  schemaCode: 'back_pain',
  recordCc: 'back_pain',
  titleTh: 'ปวดหลัง',
  titleEn: 'Back pain / Lumbago',
  icon: 'activity',
  sectionDomId: 'back_painQuestionnaireSection',
  doctorCcBadgeHtml: '<i data-lucide="activity" class="w-3.5 h-3.5 mr-1 text-amber-500"></i> CC: ปวดหลัง (Back pain)',
  pmhSectionNumber: 5,
  getPmhSectionNumber: () => 5,
  dateFields: [],
  timeFields: [],
  branchIds: [
    'thoracicSideGroup',
    'flankSideGroup',
    'lumbarSideGroup',
    'sacrumSideGroup',
    'backpainRadiationSub',
    'backpainBehaviorPostureSub',
    'backpainWarningNeuroSub',
    'backpainWarningExcretorySub',
    'backpainTraumaSub',
    'backpainTraumaOtherWrap'
  ],
  inputIdsToClear: [
    'backpainDurationVal',
    'backpainTraumaOtherText',
    'backpain_other_free'
  ],

  algorithm: {
    chiefComplaint: 'back_pain',
    titleTh: 'ปวดหลัง',
    schemaCode: 'back_pain',
    version: '2.0.0',
    redFlagDefinitions: [
      { key: 'rf_cauda_equina_syndrome', level: 1, textTh: 'Cauda Equina Syndrome / เส้นประสาทไขสันหลังส่วนปลายถูกกดทับวิกฤต (ชาอานม้า/ปัสสาวะคั่ง/ขาอ่อนแรงสองข้าง)' },
      { key: 'rf_aortic_dissection_limb_ischemia', level: 1, textTh: 'Aortic Dissection with Acute Lower Limb Ischemia (หลอดเลือดแดงใหญ่ฉีกขาดร่วมกับขาขาดเลือดเฉียบพลัน)' },
      { key: 'rf_ruptured_aaa', level: 1, textTh: 'Ruptured / Leaking AAA / สงสัยหลอดเลือดแดงใหญ่ในช่องท้องแตกหรือฉีกขาดทะลุหลัง' },
      { key: 'rf_spinal_infection', level: 2, textTh: 'Spinal Epidural Abscess / Spondylodiscitis (สงสัยฝีหรือการติดเชื้อรุนแรงในช่องไขสันหลัง)' },
      { key: 'rf_spinal_fracture', level: 2, textTh: 'Traumatic / Osteoporotic Spinal Fracture (สงสัยกระดูกสันหลังหักหรือยุบตัว)' },
      { key: 'rf_spinal_cord_compression_malignancy', level: 2, textTh: 'Malignant Spinal Cord Compression / สงสัยมะเร็งลุกลามกดทับไขสันหลัง' },
      { key: 'rf_radicular_foot_drop', level: 3, textTh: 'Acute Lumbar Radiculopathy with Foot Drop (รากประสาทถูกกดทับจนปลายเท้าตก)' },
      { key: 'rf_urinary_calculus_colic', level: 3, textTh: 'Urinary Tract Calculus with Obstruction / Renal Colic (สงสัยนิ่วทางเดินปัสสาวะอุดกั้น)' }
    ]
  },

  formHtml: `
    <div id="back_painQuestionnaireSection" class="hidden space-y-6">
      <div data-cc-top-banner="back_pain">
        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
          <div class="bg-amber-100 text-amber-800 p-2.5 rounded-xl flex-shrink-0 mt-0.5">
            <i data-lucide="alert-circle" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-amber-900 mb-1">คำแนะนำเบื้องต้นระหว่างรอตรวจ</h3>
            <p class="text-xs text-amber-800 leading-relaxed">
              กรุณานอนหรือนั่งพักนิ่งๆ ในท่าที่สบาย <strong>หลีกเลี่ยงการนวด ดัดหลัง หรือยกของหนัก</strong> หากมีอาการขาอ่อนแรง ชาก้นหรือหว่างขา กลั้นปัสสาวะอุจจาระไม่ได้ หรือปวดหลังรุนแรงฉับพลันร่วมหน้ามืดวูบ กรุณาแจ้งพยาบาลทันที
            </p>
          </div>
        </div>
      </div>

      <!-- CARD 1: ระยะเวลา ตำแหน่ง และรูปแบบการเริ่มปวด -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="clock" class="w-5 h-5"></i>
          </div>
          <h2 class="text-base font-bold text-slate-900">1. ระยะเวลา ตำแหน่ง และรูปแบบการเริ่มปวด</h2>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 tracking-wider mb-2">
              1.1 มีอาการปวดหลังมานานเท่าไรแล้ว?
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div class="col-span-1 sm:col-span-2">
                <input type="number" id="backpainDurationVal" min="1" max="1000" placeholder="ระบุตัวเลข เช่น 2"
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm placeholder:text-slate-400 placeholder:font-normal">
              </div>
              <div class="col-span-1">
                <select id="backpainDurationUnit"
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm">
                  <option value="hours">ชั่วโมง</option>
                  <option value="days" selected>วัน</option>
                  <option value="weeks">สัปดาห์</option>
                  <option value="months">เดือน</option>
                  <option value="years">ปี</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 tracking-wider mb-2">
              1.2 ตำแหน่งที่ปวด (เลือกได้หลายข้อ)
            </label>
            ${renderBackpainGrid('grid-cols-1 sm:grid-cols-2', [
              { name: 'backpainLoc', value: 'mid_back_thoracic', title: ['หลังช่วงกลาง', '/ สะบัก'], desc: 'ใต้คอลงมาถึงใต้ราวนมด้านหลัง', onchange: `toggleBackpainSideGroup('thoracicSideGroup', this.checked)` },
              { name: 'backpainLoc', value: 'flank_side', title: ['สีข้าง / บั้นเอว', 'ด้านข้าง'], desc: 'ชายโครงด้านข้างลงมาถึงเอว', onchange: `toggleBackpainSideGroup('flankSideGroup', this.checked)` },
              { name: 'backpainLoc', value: 'low_back_lumbar', title: ['หลังช่วงล่าง'], desc: 'ข้างๆ หรือกลางสันหลังช่วงล่าง', onchange: `toggleBackpainSideGroup('lumbarSideGroup', this.checked)` },
              { name: 'backpainLoc', value: 'sacrum_buttock', title: ['ก้นกบ / สะโพก'], desc: 'บริเวณแก้มก้นหรือเชิงกรานด้านหลัง', onchange: `toggleBackpainSideGroup('sacrumSideGroup', this.checked)` },
              { name: 'backpainLoc', value: 'diffuse', title: ['ปวดระบม', 'ทั่วแผ่นหลัง'], colSpan2: true }
            ])}
            ${BACKPAIN_LOC_SIDES_HTML}
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 tracking-wider mb-2">
              1.3 รูปแบบการเริ่มปวด
            </label>
            ${renderBackpainGrid('grid-cols-1 sm:grid-cols-2', [
              { kind: 'radio', name: 'backpainOnsetMode', value: 'sudden_severe', title: ['ปวดรุนแรง', 'ทันทีทันใด'], desc: 'ปวดสูงสุดในไม่กี่วินาทีหรือนาทีแรก' },
              { kind: 'radio', name: 'backpainOnsetMode', value: 'gradual_worsening', title: ['ค่อยๆ ปวด', 'เพิ่มขึ้นเรื่อยๆ'] }
            ])}
          </div>
        </div>
      </div>

      <!-- CARD 2: การร้าว ลักษณะ ปัจจัยกระตุ้น และระดับความปวด -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="activity" class="w-5 h-5"></i>
          </div>
          <h2 class="text-base font-bold text-slate-900">2. การร้าว ลักษณะ ปัจจัยกระตุ้น และระดับความปวด</h2>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 tracking-wider mb-2">
              2.1 อาการปวดร้าวไปบริเวณอื่น
            </label>
            ${renderBackpainGrid('grid-cols-1 sm:grid-cols-2', [
              { kind: 'radio', name: 'backpainRadMaster', value: 'none', title: ['ปวดเฉพาะที่หลัง', 'ไม่ร้าวไปไหน'], onchange: `toggleBackpainRadiationSub(false)` },
              { kind: 'radio', name: 'backpainRadMaster', value: 'yes', title: ['มีปวดร้าว', 'ไปบริเวณอื่น'], onchange: `toggleBackpainRadiationSub(true)` }
            ])}
            ${BACKPAIN_RAD_SUB_HTML}
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 tracking-wider mb-2">
              2.2 ลักษณะอาการปวด (เลือกได้หลายข้อ)
            </label>
            ${renderBackpainGrid('grid-cols-1 sm:grid-cols-2', [
              { name: 'backpainChar', value: 'dull_aching', title: ['ตื้อๆ', 'เมื่อย ระบม'] },
              { name: 'backpainChar', value: 'sharp_stabbing', title: ['แปล๊บ /', 'เสียบแทง'] },
              { name: 'backpainChar', value: 'electric_shock', title: ['จี๊ดเหมือน', 'ไฟช็อต'] },
              { name: 'backpainChar', value: 'tearing_ripping', title: ['ฉีกขาด', 'รุนแรงจัด'] },
              { name: 'backpainChar', value: 'colicky_spasm', title: ['บิดเกร็ง', 'เป็นพักๆ'] },
              { name: 'backpainChar', value: 'burning', title: ['แสบร้อน', 'ผิวหนัง'] }
            ])}
          </div>

          <div>
            ${renderBackpainSysHeader({
              label: '2.3 พฤติกรรมกับอาการปวด (เลือกได้หลายข้อ)',
              icon: 'move',
              colorClass: 'bg-sky-100 text-sky-700',
              toggleId: 'backpain_behavior_none',
              toggleLabel: 'ไม่มีอาการในหมวดนี้',
              toggleOnchange: 'handleBackpainBehaviorNoneToggle(this)'
            })}
            ${renderBackpainGrid('grid-cols-1 sm:grid-cols-2', [
              { name: 'backpainBehavior', value: 'worse_cough_strain', title: ['ปวดมากขึ้นเมื่อ', 'ไอ จาม หรือเบ่ง'], onchange: 'handleBackpainBehaviorChange(this)' },
              { name: 'backpainBehavior', value: 'worse_night_supine', title: ['ปวดตอนกลางคืน', 'นอนพักไม่ทุเลา'], onchange: 'handleBackpainBehaviorChange(this)' },
              { id: 'backpainBehaviorPostureParent', title: ['ปวดมากตามท่าทาง', '/ เคลื่อนไหว'], onchange: 'toggleBackpainPostureGroup(this.checked)', colSpan2: true }
            ])}
            ${BACKPAIN_BEHAVIOR_POSTURE_SUB_HTML}
          </div>

          ${BACKPAIN_PAIN_SCALE_HTML}
        </div>
      </div>

      <!-- CARD 3: สัญญาณเตือนและอาการผิดปกติร่วม -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="shield-alert" class="w-5 h-5"></i>
          </div>
          <h2 class="text-base font-bold text-slate-900">3. สัญญาณเตือนและอาการผิดปกติร่วม</h2>
        </div>

        <div>
          ${renderBackpainSysHeader({
            label: 'อาการร่วมสำคัญในขณะนี้ (เลือกได้หลายข้อ)',
            icon: 'alert-triangle',
            colorClass: 'bg-amber-100 text-amber-700',
            toggleId: 'backpain_warn_none',
            toggleLabel: 'ไม่มีอาการในหมวดนี้',
            toggleOnchange: 'handleBackpainWarnNoneToggle(this)'
          })}
          ${renderBackpainGrid('grid-cols-1 sm:grid-cols-2', [
            { id: 'backpainWarningNeuroParent', title: ['อ่อนแรง ชา ปวด', 'ช่วงล่างหรือขา'], onchange: `toggleBackpainWarningGroup('backpainWarningNeuroSub', this.checked)` },
            { id: 'backpainWarningExcretoryParent', title: ['มีปัญหาขับถ่าย', 'อุจจาระ', 'หรือปัสสาวะ'], onchange: `toggleBackpainWarningGroup('backpainWarningExcretorySub', this.checked)` },
            { name: 'backpainWarningSigns', value: 'fever_chills', title: ['มีไข้สูง', 'หนาวสั่นสะท้าน'], onchange: 'handleBackpainWarnItemChange(this)' },
            { name: 'backpainWarningSigns', value: 'syncope_hypotension', title: ['หน้ามืด วูบ', 'เหงื่อแตกตัวเย็น'], onchange: 'handleBackpainWarnItemChange(this)' },
            { name: 'backpainWarningSigns', value: 'pulsatile_abd_mass', title: ['คลำเจอก้อน', 'เต้นตุบๆ ในท้อง'], onchange: 'handleBackpainWarnItemChange(this)' },
            { name: 'backpainWarningSigns', value: 'weight_loss_anorexia', title: ['น้ำหนักลดผิดปกติ', 'เบื่ออาหาร'], onchange: 'handleBackpainWarnItemChange(this)' }
          ])}
          ${BACKPAIN_WARN_SUBS_HTML}
        </div>
      </div>

      <!-- CARD 4: ประวัติอุบัติเหตุ หัตถการ และปัจจัยเสี่ยงจำเพาะ -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="file-text" class="w-5 h-5"></i>
          </div>
          <h2 class="text-base font-bold text-slate-900">4. ประวัติอุบัติเหตุ หัตถการ และปัจจัยเสี่ยงจำเพาะ</h2>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 tracking-wider mb-2">
              4.1 ประวัติอุบัติเหตุหรือหัตถการบริเวณหลัง
            </label>
            ${renderBackpainGrid('grid-cols-1 sm:grid-cols-2', [
              { kind: 'radio', name: 'backpainTraumaMaster', value: 'no', title: ['ไม่มีประวัติ', 'อุบัติเหตุ', 'หรือหัตถการ'], onchange: 'toggleBackpainTraumaSub(false)' },
              { kind: 'radio', name: 'backpainTraumaMaster', value: 'yes', title: ['มีประวัติบาดเจ็บ', 'อุบัติเหตุ', 'หรือหัตถการ'], onchange: 'toggleBackpainTraumaSub(true)' }
            ])}
            ${BACKPAIN_TRAUMA_SUB_HTML}
          </div>

          <div>
            ${renderBackpainSysHeader({
              label: '4.2 ปัจจัยเสี่ยงจำเพาะ (เลือกได้หลายข้อ)',
              icon: 'shield-check',
              colorClass: 'bg-indigo-100 text-indigo-700',
              toggleId: 'backpain_risks_none',
              toggleName: 'backpainRisks',
              toggleValue: 'risks_none',
              toggleLabel: 'ไม่มีปัจจัยในหมวดนี้',
              toggleOnchange: 'handleBackpainRiskChange(this)'
            })}
            ${renderBackpainGrid('grid-cols-1 sm:grid-cols-2', [
              { name: 'backpainRisks', value: 'known_cancer', title: ['มีประวัติ', 'โรคมะเร็งเดิม'], desc: 'เช่น เต้านม ปอด ต่อมลูกหมาก ไต', onchange: 'handleBackpainRiskChange(this)' },
              { name: 'backpainRisks', value: 'steroid_immunosuppressed', title: ['กินสเตียรอยด์', 'ภูมิคุ้มกันต่ำ'], onchange: 'handleBackpainRiskChange(this)' },
              { name: 'backpainRisks', value: 'hemodialysis_catheter', title: ['ฟอกไตทางเส้น', 'หรือมีสายสวนค้าง'], onchange: 'handleBackpainRiskChange(this)' },
              { name: 'backpainRisks', value: 'iv_drug_use', title: ['ประวัติฉีด', 'ยาเสพติดเข้าเส้น'], onchange: 'handleBackpainRiskChange(this)' },
              { name: 'backpainRisks', value: 'osteoporosis', title: ['ตรวจพบโรค', 'กระดูกพรุนเดิม'], onchange: 'handleBackpainRiskChange(this)' }
            ])}
          </div>
        </div>
      </div>

      <!-- อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100">
          <div class="bg-slate-100 text-slate-600 p-2 rounded-xl">
            <i data-lucide="message-square-plus" class="w-5 h-5"></i>
          </div>
          <h2 class="text-base font-bold text-slate-800">อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2>
        </div>
        <textarea id="backpain_other_free" rows="2" placeholder="พิมพ์ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)..."
          class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"></textarea>
      </div>
    </div>
  `,

  // --- Lifecycle Hooks ---
  onMounted: function() {
    clearBackpainPainScore();
  },
  onSelectForm: function() {},
  onActivate: function() {},
  onTitleChange: function() {},

  // --- Collect Intake Hook ---
  collectIntake: function(ctx) {
    ctx = ctx || {};
    const _rawDur = parseFloat(getBackpainEl('backpainDurationVal')?.value);
    const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
    const durationUnit = getBackpainEl('backpainDurationUnit')?.value || 'days';

    const getCheckedVals = (name) => queryBackpainAll(`input[name="${name}"]:checked`).map(el => el.value);

    const backpainLoc = getCheckedVals('backpainLoc');
    const backpainLocLumbarSide = backpainLoc.includes('low_back_lumbar') ? getCheckedVals('backpainLocLumbarSide') : [];
    const backpainLocThoracicSide = backpainLoc.includes('mid_back_thoracic') ? getCheckedVals('backpainLocThoracicSide') : [];
    const backpainLocSacrumSide = backpainLoc.includes('sacrum_buttock') ? getCheckedVals('backpainLocSacrumSide') : [];
    const backpainLocFlankSide = backpainLoc.includes('flank_side') ? getCheckedVals('backpainLocFlankSide') : [];

    const backpainOnsetMode = queryBackpainOne('input[name="backpainOnsetMode"]:checked')?.value || '';
    const backpainRadMaster = queryBackpainOne('input[name="backpainRadMaster"]:checked')?.value || '';
    const backpainRadLoc = backpainRadMaster === 'yes' ? getCheckedVals('backpainRadLoc') : [];

    const backpainChar = getCheckedVals('backpainChar');
    const backpainBehaviorPostureParent = !!getBackpainEl('backpainBehaviorPostureParent')?.checked;
    const postureSubKeys = ['worse_flexion_sitting', 'worse_extension_standing_walking', 'worse_movement'];
    const backpainBehavior = getCheckedVals('backpainBehavior').filter(v => !postureSubKeys.includes(v) || backpainBehaviorPostureParent);
    const backpainBehaviorNone = (getBackpainEl('backpain_behavior_none')?.checked || false) && backpainBehavior.length === 0 && !backpainBehaviorPostureParent;

    let painScore = null;
    if (backpainPainScoreTouched) {
      const pSlider = getBackpainEl('backpainPainScore');
      if (pSlider) painScore = parseInt(pSlider.value, 10);
    }

    const backpainWarningSigns = getCheckedVals('backpainWarningSigns');
    const backpainWarningNeuroParent = !!getBackpainEl('backpainWarningNeuroParent')?.checked;
    const backpainWarningExcretoryParent = !!getBackpainEl('backpainWarningExcretoryParent')?.checked;
    const backpainWarnNone = (getBackpainEl('backpain_warn_none')?.checked || false) && backpainWarningSigns.length === 0;

    const backpainTraumaMaster = queryBackpainOne('input[name="backpainTraumaMaster"]:checked')?.value || '';
    const backpainTraumaTypes = backpainTraumaMaster === 'yes' ? getCheckedVals('backpainTraumaTypes') : [];
    const backpainTraumaOtherText = (backpainTraumaMaster === 'yes' && backpainTraumaTypes.includes('trauma_other'))
      ? (getBackpainEl('backpainTraumaOtherText')?.value?.trim() || '')
      : '';

    const backpainRisks = getCheckedVals('backpainRisks');
    const otherSymptomsFree = getBackpainEl('backpain_other_free')?.value?.trim() || ctx.otherSymptomsFree || '';

    const rec = {
      id: ctx.recordId || ctx.id || `case-${Date.now()}`,
      queue_number: ctx.queueNumber || ctx.queue_number || 'ER-NEW',
      hn: ctx.randomHn || ctx.hn || '-',
      name: ctx.patientName || ctx.name || 'ไม่ระบุชื่อ',
      age: ctx.patientAge !== undefined ? ctx.patientAge : (ctx.age !== undefined ? ctx.age : 'ไม่ได้ระบุ'),
      gender: ctx.gender || 'ไม่ระบุ',
      chief_complaint: 'back_pain',
      chief_complaint_title: 'ปวดหลัง',
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

      backpainLoc,
      backpainLocLumbarSide,
      backpainLocThoracicSide,
      backpainLocSacrumSide,
      backpainLocFlankSide,
      backpainOnsetMode,
      backpainRadMaster,
      backpainRadLoc,
      backpainChar,
      backpainBehavior,
      backpainBehaviorPostureParent,
      backpainBehaviorNone,
      painScore,
      backpainWarningSigns,
      backpainWarningNeuroParent,
      backpainWarningExcretoryParent,
      backpainWarnNone,
      backpainTraumaMaster,
      backpainTraumaTypes,
      backpainTraumaOtherText,
      backpainRisks
    };

    updateBackpainOutputs(rec);
    return rec;
  },

  // --- Populate / Hydrate Form Hook ---
  populateForm: function(patient) {
    if (!patient) return;
    this.resetForm();

    const setVal = (id, val) => {
      const el = getBackpainEl(id);
      if (el) el.value = val !== undefined && val !== null ? val : '';
    };
    const setCheckedArr = (name, arr) => {
      if (!Array.isArray(arr)) return;
      queryBackpainAll(`input[name="${name}"]`).forEach(cb => {
        cb.checked = arr.includes(cb.value);
      });
    };

    setVal('backpainDurationVal', patient.durationVal);
    setVal('backpainDurationUnit', patient.durationUnit || 'days');

    setCheckedArr('backpainLoc', patient.backpainLoc);
    setCheckedArr('backpainLocLumbarSide', patient.backpainLocLumbarSide);
    setCheckedArr('backpainLocThoracicSide', patient.backpainLocThoracicSide);
    setCheckedArr('backpainLocSacrumSide', patient.backpainLocSacrumSide);
    setCheckedArr('backpainLocFlankSide', patient.backpainLocFlankSide);

    const locs = Array.isArray(patient.backpainLoc) ? patient.backpainLoc : [];
    toggleBackpainSideGroup('lumbarSideGroup', locs.includes('low_back_lumbar'));
    toggleBackpainSideGroup('thoracicSideGroup', locs.includes('mid_back_thoracic'));
    toggleBackpainSideGroup('sacrumSideGroup', locs.includes('sacrum_buttock'));
    toggleBackpainSideGroup('flankSideGroup', locs.includes('flank_side'));

    if (patient.backpainOnsetMode) {
      const r = queryBackpainOne(`input[name="backpainOnsetMode"][value="${patient.backpainOnsetMode}"]`);
      if (r) r.checked = true;
    }

    if (patient.backpainRadMaster) {
      const r = queryBackpainOne(`input[name="backpainRadMaster"][value="${patient.backpainRadMaster}"]`);
      if (r) r.checked = true;
    }
    toggleBackpainRadiationSub(patient.backpainRadMaster === 'yes');
    setCheckedArr('backpainRadLoc', patient.backpainRadLoc);

    setCheckedArr('backpainChar', patient.backpainChar);
    const postureKeys = ['worse_flexion_sitting', 'worse_extension_standing_walking', 'worse_movement'];
    const behArr = Array.isArray(patient.backpainBehavior) ? patient.backpainBehavior : [];
    const hasPosture = !!patient.backpainBehaviorPostureParent || behArr.some(k => postureKeys.includes(k));
    const pPosture = getBackpainEl('backpainBehaviorPostureParent');
    if (pPosture) pPosture.checked = hasPosture;
    toggleBackpainPostureGroup(hasPosture);
    setCheckedArr('backpainBehavior', behArr);
    if (patient.backpainBehaviorNone && behArr.length === 0 && !hasPosture) {
      const behNoneEl = getBackpainEl('backpain_behavior_none');
      if (behNoneEl) behNoneEl.checked = true;
    }

    if (typeof patient.painScore === 'number' && patient.painScore >= 0) {
      setBackpainPainScore(patient.painScore);
    } else {
      clearBackpainPainScore();
    }

    const warnSigns = Array.isArray(patient.backpainWarningSigns) ? patient.backpainWarningSigns : [];
    setCheckedArr('backpainWarningSigns', warnSigns);
    const neuroKeys = ['saddle_anesthesia', 'leg_weakness_both', 'foot_drop_single', 'numbness_leg_foot', 'ischemic_limb_pain', 'ischemic_limb_numbness'];
    const hasNeuro = patient.backpainWarningNeuroParent || warnSigns.some(k => neuroKeys.includes(k));
    const pNeuro = getBackpainEl('backpainWarningNeuroParent');
    if (pNeuro) pNeuro.checked = !!hasNeuro;
    toggleBackpainWarningGroup('backpainWarningNeuroSub', !!hasNeuro);

    const excretoryKeys = ['bowel_incontinence', 'urinary_retention', 'dysuria_hematuria', 'gravel_sand_urine'];
    const hasExcretory = patient.backpainWarningExcretoryParent || warnSigns.some(k => excretoryKeys.includes(k));
    const pExcretory = getBackpainEl('backpainWarningExcretoryParent');
    if (pExcretory) pExcretory.checked = !!hasExcretory;
    toggleBackpainWarningGroup('backpainWarningExcretorySub', !!hasExcretory);

    if (patient.backpainWarnNone && warnSigns.length === 0 && !hasNeuro && !hasExcretory) {
      const warnNoneEl = getBackpainEl('backpain_warn_none');
      if (warnNoneEl) warnNoneEl.checked = true;
    }

    if (patient.backpainTraumaMaster) {
      const r = queryBackpainOne(`input[name="backpainTraumaMaster"][value="${patient.backpainTraumaMaster}"]`);
      if (r) r.checked = true;
    }
    toggleBackpainTraumaSub(patient.backpainTraumaMaster === 'yes');
    setCheckedArr('backpainTraumaTypes', patient.backpainTraumaTypes);

    const hasOtherTrauma = Array.isArray(patient.backpainTraumaTypes) && patient.backpainTraumaTypes.includes('trauma_other');
    toggleBackpainTraumaOther(hasOtherTrauma);
    setVal('backpainTraumaOtherText', patient.backpainTraumaOtherText);

    setCheckedArr('backpainRisks', patient.backpainRisks);
    setVal('backpain_other_free', patient.otherSymptomsFree);
  },

  // --- Reset Form Hook ---
  resetForm: function() {
    this.inputIdsToClear.forEach(id => {
      const el = getBackpainEl(id);
      if (el) el.value = '';
    });
    const unitEl = getBackpainEl('backpainDurationUnit');
    if (unitEl) unitEl.value = 'days';

    ['backpainOnsetMode', 'backpainRadMaster', 'backpainTraumaMaster'].forEach(name => {
      queryBackpainAll(`input[name="${name}"]`).forEach(r => { r.checked = false; });
    });

    [
      'backpainLoc', 'backpainLocLumbarSide', 'backpainLocThoracicSide',
      'backpainLocSacrumSide', 'backpainLocFlankSide', 'backpainRadLoc', 'backpainChar',
      'backpainBehavior', 'backpainWarningSigns', 'backpainTraumaTypes', 'backpainRisks'
    ].forEach(name => {
      queryBackpainAll(`input[name="${name}"]`).forEach(cb => { cb.checked = false; });
    });

    [
      'backpainBehaviorPostureParent',
      'backpainWarningNeuroParent',
      'backpainWarningExcretoryParent',
      'backpain_behavior_none',
      'backpain_warn_none',
      'backpain_risks_none'
    ].forEach(id => {
      const el = getBackpainEl(id);
      if (el) el.checked = false;
    });

    this.branchIds.forEach(id => {
      const el = getBackpainEl(id);
      if (el) el.classList.add('hidden');
    });

    clearBackpainPainScore();
  },

  // --- Clinical Output Generators ---
  hydrateForm: function(patient) {
    this.populateForm(patient);
  },
  isRedFlag: function(patient) {
    return evaluateBackpainRedFlags(patient).length > 0;
  },
  updateOutputs: updateBackpainOutputs,
  renderRapidHpi: renderBackpainRapidHpi,
  renderNarrative: renderBackpainNarrative,
  renderDoctorHpi: renderBackpainDoctorHpi,
  evaluateRedFlags: evaluateBackpainRedFlags,

  // --- Seed Patients Registry ---
  seedPatients: [
    // Case 1: Suspected Cauda Equina Syndrome (ESI 2)
    {
      id: 'case-backpain-01',
      queue_number: 'E2-091',
      hn: '6788501',
      name: 'นายประสิทธิ์ ชาหว่างขา',
      age: 52,
      gender: 'ชาย',
      chief_complaint: 'back_pain',
      chief_complaint_title: 'ปวดหลัง',
      timestamp: '2026-10-31T08:30:00.000Z',
      status: 'waiting',
      durationVal: 8,
      durationUnit: 'hours',
      hospRecordStatus: 'complete',
      underlying: ['ความดันโลหิตสูง'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Amlodipine (5 mg) 1 tab po od',
      otherSymptomsFree: 'ปวดหลังรุนแรง ชาหว่างขา ปัสสาวะไม่ออก ขาไม่มีแรงก้าวเดิน',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.8, sbp: 135, dbp: 85, bp: '135/85', pr: 88, rr: 18, spo2: 99 },
      esi_level: 2,

      backpainLoc: ['low_back_lumbar'],
      backpainLocLumbarSide: ['center', 'left', 'right'],
      backpainLocThoracicSide: [],
      backpainLocSacrumSide: [],
      backpainLocFlankSide: [],
      backpainOnsetMode: 'sudden_severe',
      backpainRadMaster: 'yes',
      backpainRadLoc: ['rad_leg_below_knee', 'rad_buttock_thigh'],
      backpainChar: ['sharp_stabbing', 'electric_shock'],
      backpainBehavior: ['worse_cough_strain'],
      backpainBehaviorNone: false,
      painScore: 8,
      backpainWarningSigns: ['saddle_anesthesia', 'urinary_retention', 'leg_weakness_both'],
      backpainWarningNeuroParent: true,
      backpainWarningExcretoryParent: true,
      backpainWarnNone: false,
      backpainTraumaMaster: 'yes',
      backpainTraumaTypes: ['heavy_lifting'],
      backpainTraumaOtherText: '',
      backpainRisks: ['risks_none']
    },

    // Case 2: Suspected Ruptured/Leaking AAA (ESI 1)
    {
      id: 'case-backpain-02',
      queue_number: 'E1-092',
      hn: '6788502',
      name: 'นายสมชาย แน่นทะลุหลัง',
      age: 71,
      gender: 'ชาย',
      chief_complaint: 'back_pain',
      chief_complaint_title: 'ปวดหลัง',
      timestamp: '2026-10-31T09:00:00.000Z',
      status: 'waiting',
      durationVal: 1,
      durationUnit: 'hours',
      hospRecordStatus: 'complete',
      underlying: ['ความดันโลหิตสูง', 'ไขมันในเลือดสูง'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Enalapril (10 mg), Simvastatin (20 mg)',
      otherSymptomsFree: 'ปวดหลังแน่นทะลุหน้าท้อง วูบจะเป็นลม เหงื่อแตกตัวเย็น',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.4, sbp: 85, dbp: 50, bp: '85/50', pr: 124, rr: 26, spo2: 94 },
      esi_level: 1,

      backpainLoc: ['low_back_lumbar', 'flank_side'],
      backpainLocLumbarSide: ['center'],
      backpainLocThoracicSide: [],
      backpainLocSacrumSide: [],
      backpainLocFlankSide: ['left'],
      backpainOnsetMode: 'sudden_severe',
      backpainRadMaster: 'yes',
      backpainRadLoc: ['rad_abdomen_chest'],
      backpainChar: ['tearing_ripping'],
      backpainBehavior: [],
      backpainBehaviorNone: true,
      painScore: 10,
      backpainWarningSigns: ['syncope_hypotension', 'pulsatile_abd_mass'],
      backpainWarningNeuroParent: false,
      backpainWarningExcretoryParent: false,
      backpainWarnNone: false,
      backpainTraumaMaster: 'no',
      backpainTraumaTypes: [],
      backpainTraumaOtherText: '',
      backpainRisks: ['risks_none']
    },

    // Case 3: Suspected Spinal Epidural Abscess (ESI 2)
    {
      id: 'case-backpain-03',
      queue_number: 'E2-093',
      hn: '6788503',
      name: 'นางสมศรี มีไข้บล็อกหลัง',
      age: 56,
      gender: 'หญิง',
      chief_complaint: 'back_pain',
      chief_complaint_title: 'ปวดหลัง',
      timestamp: '2026-10-31T09:30:00.000Z',
      status: 'waiting',
      durationVal: 3,
      durationUnit: 'days',
      hospRecordStatus: 'complete',
      underlying: ['เบาหวาน', 'ไตวายเรื้อรังฟอกเลือด'],
      drugAllergy: 'Penicillin (ผื่นคัน)',
      currentMeds: 'Insulin Glargine, Folic acid, Calcium carbonate',
      otherSymptomsFree: 'เพิ่งฉีดยาชาบล็อกหลังมา 2 สัปดาห์ มีไข้หนาวสั่น ปวดหลังรุนแรงจนนอนไม่ได้',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 38.9, sbp: 115, dbp: 75, bp: '115/75', pr: 106, rr: 20, spo2: 98 },
      esi_level: 2,

      backpainLoc: ['mid_back_thoracic', 'low_back_lumbar'],
      backpainLocLumbarSide: ['center'],
      backpainLocThoracicSide: ['center'],
      backpainLocSacrumSide: [],
      backpainLocFlankSide: [],
      backpainOnsetMode: 'gradual_worsening',
      backpainRadMaster: 'none',
      backpainRadLoc: [],
      backpainChar: ['sharp_stabbing'],
      backpainBehavior: ['worse_night_supine'],
      backpainBehaviorNone: false,
      painScore: 7,
      backpainWarningSigns: ['fever_chills'],
      backpainWarningNeuroParent: false,
      backpainWarningExcretoryParent: false,
      backpainWarnNone: false,
      backpainTraumaMaster: 'yes',
      backpainTraumaTypes: ['recent_spine_procedure'],
      backpainTraumaOtherText: '',
      backpainRisks: ['hemodialysis_catheter']
    },

    // Case 4: Acute Mechanical Lumbago (ESI 4)
    {
      id: 'case-backpain-04',
      queue_number: 'E4-094',
      hn: '6788504',
      name: 'นายวิชาญ ยกของหนัก',
      age: 36,
      gender: 'ชาย',
      chief_complaint: 'back_pain',
      chief_complaint_title: 'ปวดหลัง',
      timestamp: '2026-10-31T10:00:00.000Z',
      status: 'waiting',
      durationVal: 2,
      durationUnit: 'days',
      hospRecordStatus: 'complete',
      underlying: [],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'ไม่มี',
      otherSymptomsFree: 'ปวดเอวด้านขวาหลังช่วยเพื่อนยกตู้เสื้อผ้า ขับถ่ายปกติ ขาไม่ชา',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.7, sbp: 122, dbp: 78, bp: '122/78', pr: 72, rr: 16, spo2: 99 },
      esi_level: 4,

      backpainLoc: ['low_back_lumbar'],
      backpainLocLumbarSide: ['right'],
      backpainLocThoracicSide: [],
      backpainLocSacrumSide: [],
      backpainLocFlankSide: [],
      backpainOnsetMode: 'gradual_worsening',
      backpainRadMaster: 'none',
      backpainRadLoc: [],
      backpainChar: ['dull_aching'],
      backpainBehavior: [],
      backpainBehaviorNone: true,
      painScore: 4,
      backpainWarningSigns: [],
      backpainWarningNeuroParent: false,
      backpainWarningExcretoryParent: false,
      backpainWarnNone: true,
      backpainTraumaMaster: 'yes',
      backpainTraumaTypes: ['heavy_lifting'],
      backpainTraumaOtherText: '',
      backpainRisks: ['risks_none']
    }
  ]
};

// --- Register Module to Core Knowledge Base ---
if (typeof registerCcModule === 'function') {
  registerCcModule(backpainModule);
} else if (typeof window !== 'undefined' && typeof window.registerCcModule === 'function') {
  window.registerCcModule(backpainModule);
}

if (typeof window !== 'undefined') {
  window.clearBackpainPainScore = clearBackpainPainScore;
  window.handleBackpainPainScoreChange = handleBackpainPainScoreChange;
  window.setBackpainPainScore = setBackpainPainScore;
  window.toggleBackpainSideGroup = toggleBackpainSideGroup;
  window.toggleBackpainRadiationSub = toggleBackpainRadiationSub;
  window.toggleBackpainRadiation = toggleBackpainRadiationSub;
  window.toggleBackpainPostureGroup = toggleBackpainPostureGroup;
  window.toggleBackpainWarningGroup = toggleBackpainWarningGroup;
  window.toggleBackpainTraumaSub = toggleBackpainTraumaSub;
  window.toggleBackpainTrauma = toggleBackpainTraumaSub;
  window.toggleBackpainTraumaOther = toggleBackpainTraumaOther;
  window.handleBackpainBehaviorChange = handleBackpainBehaviorChange;
  window.handleBackpainBehaviorNoneToggle = handleBackpainBehaviorNoneToggle;
  window.handleBackpainWarnItemChange = handleBackpainWarnItemChange;
  window.handleBackpainWarnNoneToggle = handleBackpainWarnNoneToggle;
  window.handleBackpainRiskChange = handleBackpainRiskChange;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = backpainModule;
}
