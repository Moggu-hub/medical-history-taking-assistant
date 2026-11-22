// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 13_gi_bleed.js
// อาการนำ: อาเจียนเป็นเลือด / ถ่ายดำ / ถ่ายเป็นเลือดสด (Acute GI Bleeding)
// ปรับปรุงตามมาตรฐาน plan_gi_bleed.md, plan-cc และ code-cc (กลุ่ม B2)
// =========================================================================

// --- Internal DOM & UI Helpers ---
function getGiEl(id) {
  return typeof document !== 'undefined' ? document.getElementById(id) : null;
}

function queryGiOne(selector) {
  return typeof document !== 'undefined' ? document.querySelector(selector) : null;
}

function queryGiAll(selector) {
  return typeof document !== 'undefined' ? Array.from(document.querySelectorAll(selector)) : [];
}

function wrapGiWords(chunks) {
  if (!Array.isArray(chunks)) return chunks;
  return chunks.map(c => `<span class="inline-block whitespace-nowrap">${c}</span>`).join(' ');
}

function renderGiOption(cfg) {
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
  const titleHtml = Array.isArray(title) ? wrapGiWords(title) : title;
  const bodyHtml = desc
    ? `<div class="ml-3 leading-snug"><span class="block text-xs sm:text-sm font-semibold text-slate-800">${titleHtml}</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">${desc}</span></div>`
    : `<span class="ml-3 ${compact ? 'text-xs' : 'text-xs sm:text-sm'} font-semibold text-slate-800 leading-snug">${titleHtml}</span>`;
  return `<label class="selectable-card bg-white flex ${alignCls} ${padCls} rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition${spanCls}"><input type="${kind}" ${idAttr}${nameAttr}${valAttr}${chgAttr}class="${topCls}${roundCls}text-medical-600 focus:ring-medical-500 ${szCls} flex-shrink-0">${bodyHtml}</label>`;
}

function renderGiGrid(colsCls, items, shared = {}) {
  return `<div class="grid ${colsCls} gap-2.5">${items.map(it => renderGiOption({ ...shared, ...it })).join('\n')}</div>`;
}

function renderGiSysHeader({
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

function clearGiBranchValues(wrapEl) {
  if (!wrapEl) return;
  wrapEl.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(inp => {
    inp.checked = false;
  });
  wrapEl.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach(inp => {
    inp.value = '';
  });
}

function uncheckGiNone(noneId, noneVal) {
  const noneEl = noneId ? getGiEl(noneId) : null;
  if (noneEl && noneEl.checked) noneEl.checked = false;
  if (noneVal) {
    queryGiAll(`input[value="${noneVal}"]`).forEach(el => { el.checked = false; });
  }
}

// --- Progressive Disclosure & Mutual Exclusion Handlers ---
function handleGiHematemesisToggle(el) {
  const isChecked = el ? el.checked : (getGiEl('gi_hematemesis_cb')?.checked || false);
  const wrap = getGiEl('giHematemesisWrap');
  if (!wrap) return;
  if (isChecked) {
    wrap.classList.remove('hidden');
  } else {
    wrap.classList.add('hidden');
    clearGiBranchValues(wrap);
  }
}

function handleGiMelenaToggle(el) {
  const isChecked = el ? el.checked : (getGiEl('gi_melena_cb')?.checked || false);
  const wrap = getGiEl('giMelenaWrap');
  if (!wrap) return;
  if (isChecked) {
    wrap.classList.remove('hidden');
  } else {
    wrap.classList.add('hidden');
    const dWrap = getGiEl('giMelenaDaysWrap');
    if (dWrap) dWrap.classList.add('hidden');
    clearGiBranchValues(wrap);
  }
}

function handleGiMelenaPrecededChange(val) {
  const wrap = getGiEl('giMelenaDaysWrap');
  if (!wrap) return;
  if (val === 'yes') {
    wrap.classList.remove('hidden');
  } else {
    wrap.classList.add('hidden');
    const inp = getGiEl('giMelenaDays');
    if (inp) inp.value = '';
  }
}

function handleGiPseudoMelenaNoneToggle(el) {
  if (el && el.checked) {
    queryGiAll('input[name="giPseudoMelenaMeds"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleGiPseudoMelenaItemChange(el) {
  if (el && el.checked) uncheckGiNone('giPseudoMelenaNoneCb', 'none_pseudo');
}

function handleGiHematocheziaToggle(el) {
  const isChecked = el ? el.checked : (getGiEl('gi_hematochezia_cb')?.checked || false);
  const wrap = getGiEl('giHematocheziaWrap');
  if (!wrap) return;
  if (isChecked) {
    wrap.classList.remove('hidden');
  } else {
    wrap.classList.add('hidden');
    clearGiBranchValues(wrap);
  }
}

function handleGiShockNoneToggle(el) {
  if (el && el.checked) {
    queryGiAll('input[name="giShockSigns"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleGiShockItemChange(el) {
  if (el && el.checked) uncheckGiNone('giShockNoneCb', 'none_shock');
}

function handleGiAbdpainChange(val) {
  const wrap = getGiEl('giAbdpainWrap');
  if (!wrap) return;
  if (val === 'yes') {
    wrap.classList.remove('hidden');
  } else {
    wrap.classList.add('hidden');
    clearGiBranchValues(wrap);
  }
}

function handleGiAnticoagNoneToggle(el) {
  if (el && el.checked) {
    queryGiAll('input[name="giAnticoagMeds"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleGiAnticoagItemChange(el) {
  if (el && el.checked) uncheckGiNone('giAnticoagNoneCb', 'none_anticoag');
}

function handleGiNsaidsNoneToggle(el) {
  if (el && el.checked) {
    queryGiAll('input[name="giNsaidMeds"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleGiNsaidItemChange(el) {
  if (el && el.checked) uncheckGiNone('giNsaidNoneCb', 'none_nsaids');
}

function handleGiLiverNoneToggle(el) {
  if (el && el.checked) {
    queryGiAll('input[name="giLiverAlcohol"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleGiLiverItemChange(el) {
  if (el && el.checked) uncheckGiNone('giLiverNoneCb', 'none_liver');
}

function handleGiPastPudBleedToggle(el) {
  const isChecked = el ? el.checked : (getGiEl('gi_past_pud_cb')?.checked || false);
  if (isChecked) uncheckGiNone('giPastNoneCb', 'none_past');
  const wrap = getGiEl('giPastPudBleedWrap');
  if (!wrap) return;
  if (isChecked) {
    wrap.classList.remove('hidden');
  } else {
    wrap.classList.add('hidden');
    clearGiBranchValues(wrap);
  }
}

function handleGiPastNoneToggle(el) {
  if (el && el.checked) {
    queryGiAll('input[name="giPastHistory"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
    const wrap = getGiEl('giPastPudBleedWrap');
    if (wrap) {
      wrap.classList.add('hidden');
      clearGiBranchValues(wrap);
    }
  }
}

function handleGiPastItemChange(el) {
  if (el && el.checked) uncheckGiNone('giPastNoneCb', 'none_past');
}

// --- Red Flag Evaluator (6 Criteria Preserved) ---
function evaluateGiBleedRedFlags(patient) {
  const flags = [];
  if (!patient) return flags;

  const shockSigns = Array.isArray(patient.giShockSigns) ? patient.giShockSigns : [];
  const hasSyncope = shockSigns.includes('syncope');
  const hasDizziness = shockSigns.includes('postural_dizziness');
  const hasColdExtremities = shockSigns.includes('cold_extremities');
  const hasOliguria = shockSigns.includes('oliguria_anuria');

  const liverAlcohol = Array.isArray(patient.giLiverAlcohol) ? patient.giLiverAlcohol : [];
  const hasCirrhosis = liverAlcohol.includes('cirrhosis_varices');
  const hasHeavyAlcohol = liverAlcohol.includes('heavy_alcohol');
  const hasJaundice = liverAlcohol.includes('jaundice_ascites');

  const abdpainChars = Array.isArray(patient.giAbdpainChars) ? patient.giAbdpainChars : [];
  const hasRigidAbdomen = abdpainChars.includes('peritonitis_rigid');

  const anticoag = Array.isArray(patient.giAnticoagMeds) ? patient.giAnticoagMeds : [];
  const hasWarfarin = anticoag.includes('warfarin');
  const hasDoac = anticoag.includes('doac');
  const hasAntiplatelet = anticoag.includes('antiplatelet');

  const pastHistory = Array.isArray(patient.giPastHistory) ? patient.giPastHistory : [];
  const hasAaaRepair = pastHistory.includes('past_aaa_repair');

  const hasHema = Boolean(patient.giHematemesis);
  const hasMelena = Boolean(patient.giMelena);
  const hasHemato = Boolean(patient.giHematochezia);
  const hasActiveBleed = hasHema || hasMelena || hasHemato;

  // 1. Hemorrhagic Shock / Severe Hypovolemia
  if (hasSyncope || hasColdExtremities || hasOliguria || (hasDizziness && hasActiveBleed)) {
    flags.push({
      key: 'gi_rf_hemorrhagic_shock',
      textTh: 'ภาวะเสียเลือดรุนแรงหรือเริ่มเข้าสู่ภาวะช็อก (Hemorrhagic Shock / Severe Hypovolemia)',
      risk: 'ผู้ป่วยมีอาการวูบ หน้ามืดเวลาเปลี่ยนท่า ตัวเย็นชืด หรือปัสสาวะออกน้อย ร่วมกับเลือดออกทางเดินอาหาร เสี่ยงต่อระบบไหลเวียนโลหิตล้มเหลว',
      level: 'CRITICAL',
      suggestedAction: 'ย้ายเข้าห้อง Resuscitation ทันที, เปิดเส้นเลือดใหญ่ 2 เส้น (16–18G), Rapid IV Fluid Resuscitation, เจาะ CBC, BUN/Cr, Coagulogram, Crossmatch PRC 2–4 units'
    });
  }

  // 2. Suspected Variceal Bleeding (Upper GI Bleed with Cirrhosis/Alcohol)
  if ((hasCirrhosis || hasHeavyAlcohol || hasJaundice) && (hasHema || hasMelena)) {
    flags.push({
      key: 'gi_rf_variceal_bleeding',
      textTh: 'สงสัยเลือดออกจากเส้นเลือดขอดในหลอดอาหาร (Suspected Acute Variceal Bleeding)',
      risk: 'ผู้ป่วยมีประวัติโรคตับแข็ง ดื่มแอลกอฮอล์หนัก หรือตัวเหลืองท้องมาน ร่วมกับอาเจียนเป็นเลือด/ถ่ายดำ มีความเสี่ยงเสียเลือดทะลักรุนแรงถึงชีวิตสูง',
      level: 'CRITICAL',
      suggestedAction: 'Resuscitation ทันที, พิจารณา Octreotide bolus + continuous infusion, IV Ceftriaxone 1 g prophylaxis, เตรียมส่องกล้องฉุกเฉิน (Urgent EGD) และเฝ้าระวัง Airway'
    });
  }

  // 3. Massive Active Upper/Lower GI Bleeding
  if (
    patient.giHematemesisVolume === 'large' ||
    patient.giHematemesisChar === 'bright_red_clots' ||
    (patient.giHematocheziaChar === 'profuse_bright_red' && hasDizziness)
  ) {
    flags.push({
      key: 'gi_rf_massive_bleeding',
      textTh: 'เลือดออกในทางเดินอาหารปริมาณมากเฉียบพลัน (Massive Active GI Hemorrhage)',
      risk: 'อาเจียนเป็นเลือดสดปริมาณมาก หรือถ่ายเป็นเลือดสดไหลพุ่งร่วมกับอาการหน้ามืด เสี่ยงต่อความดันโลหิตตกและเสียชีวิตอย่างรวดเร็ว',
      level: 'HIGH',
      suggestedAction: 'Keep NPO, Close vital sign monitoring, เตรียม Blood product support, Type & Crossmatch และส่งปรึกษาอายุรแพทย์ทางเดินอาหาร/ศัลยแพทย์ด่วน'
    });
  }

  // 4. Suspected Perforated Peptic Ulcer
  if (hasRigidAbdomen) {
    flags.push({
      key: 'gi_rf_perforated_ulcer',
      textTh: 'สงสัยกระเพาะอาหารทะลุหรือเยื่อบุช่องท้องอักเสบ (Suspected Perforated Peptic Ulcer)',
      risk: 'มีอาการปวดท้องรุนแรงมากตลอดเวลา หน้าท้องแข็งเกร็ง สะเทือน อาจมีภาวะแผลในกระเพาะอาหารทะลุร่วมด้วย',
      level: 'CRITICAL',
      suggestedAction: 'Keep NPO ทันที, IV fluid, ส่ง Upright CXR / Acute Abdomen Series หาลมใต้กะบังลม, พิจารณา Broad-spectrum IV Antibiotics และปรึกษาศัลยแพทย์ด่วน'
    });
  }

  // 5. Anticoagulant / Antiplatelet-Associated Bleeding
  if ((hasWarfarin || hasDoac || hasAntiplatelet) && hasActiveBleed) {
    flags.push({
      key: 'gi_rf_anticoagulant_induced',
      textTh: 'เลือดออกในผู้ป่วยที่ได้รับยาละลายลิ่มเลือดหรือต้านเกล็ดเลือด (Anticoagulant-Associated GI Bleed)',
      risk: 'เลือดมีแนวโน้มหยุดยากและออกต่อเนื่องยาวนานจากฤทธิ์ยา Warfarin, DOACs หรือยาต้านเกล็ดเลือด',
      level: 'HIGH',
      suggestedAction: 'Stat PT/INR, aPTT, Platelet count, พิจารณาหยุดยาชั่วคราว และพิจารณา Reversal agent (Vitamin K, PCC/FFP หรือ Idarucizumab ตามข้อบ่งชี้)'
    });
  }

  // 6. Suspected Aortoenteric Fistula (AAA Repair History)
  if (hasAaaRepair && hasActiveBleed) {
    flags.push({
      key: 'gi_rf_aortoenteric_fistula',
      textTh: 'สงสัยภาวะรูรั่วระหว่างหลอดเลือดแดงใหญ่กับลำไส้ (Suspected Aortoenteric Fistula)',
      risk: 'ผู้ป่วยเคยผ่าตัดใส่หลอดเลือดเทียมในช่องท้อง (AAA Repair) และมาด้วยเลือดออกในทางเดินอาหาร เสี่ยงต่อการตกเลือดพุ่งจนเสียชีวิตเฉียบพลัน',
      level: 'CRITICAL',
      suggestedAction: 'แจ้งศัลยแพทย์หลอดเลือดด่วนที่สุด (STAT Vascular Consult), เตรียม CT Angiography Abdomen ทันทีที่ผู้ป่วยคงที่ และเตรียม Crossmatch เลือดจำนวนมาก'
    });
  }

  return flags;
}

function isGiBleedRedFlag(patient) {
  if (!patient) return false;
  return evaluateGiBleedRedFlags(patient).length > 0;
}

// --- Output Rendering Helpers & Maps (Zero 🚩 & Zero Raw Enum Leaks) ---
function formatGiOutputBundle(patient) {
  const unitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durStr = patient.durationVal
    ? `${patient.durationVal} ${unitMap[patient.durationUnit] || 'ชั่วโมง'}`
    : 'ไม่ระบุระยะเวลา';

  const onsetTextMap = {
    sudden_severe: 'เกิดขึ้นเฉียบพลันทันที',
    gradual_increase: 'ค่อยๆ เพิ่มขึ้นใน 1–2 วัน',
    chronic_intermittent: 'เป็นๆ หายๆ ต่อเนื่อง'
  };
  const onsetStr = onsetTextMap[patient.giOnsetMode] || '';
  const exactDt = [
    patient.giOnsetExactDate ? `วันที่ ${patient.giOnsetExactDate}` : '',
    patient.giOnsetExactTime ? `เวลา ${patient.giOnsetExactTime} น.` : ''
  ].filter(Boolean).join(' ');

  const freqMap = { freq_1_2: '1–2 ครั้ง', freq_3_5: '3–5 ครั้ง', freq_gt_5: 'มากกว่า 5 ครั้ง' };
  const volMap = { large: 'ปริมาณมาก (>1 แก้ว/เต็มชาม)', moderate: 'ปริมาณปานกลาง (~ครึ่งแก้ว)', small: 'ปริมาณเล็กน้อย' };
  const hemaCharMap = {
    bright_red_clots: 'อาเจียนเป็นเลือดสด/มีลิ่มเลือด',
    pink_streaks: 'น้ำอาเจียนปนสายเลือดจางๆ',
    coffee_ground: 'อาเจียนสีน้ำตาลเข้มคล้ายกากกาแฟ'
  };
  const melenaCharMap = {
    tarry_foul: 'สีดำสนิทเหนียวยางมะตอย กลิ่นคาวรุนแรง',
    dark_brown_formed: 'สีน้ำตาลเข้ม/ดำคล้ำ แต่เป็นก้อนปกติ'
  };
  const melenaActiveMap = {
    active_continuous: 'ยังคงถ่ายดำต่อเนื่อง',
    stopped_recently: 'หยุดถ่ายดำไปแล้ว'
  };
  const hematoCharMap = {
    profuse_bright_red: 'เลือดสีแดงสดล้วน/ลิ่มเลือดปริมาณมาก',
    surface_streak_or_drip: 'เลือดสดเคลือบผิวอุจจาระ/หยดหลังถ่าย',
    toilet_paper_only: 'เลือดสดเปื้อนเฉพาะกระดาษชำระ',
    bloody_mucus_loose: 'อุจจาระเหลวปนมูกเลือด'
  };
  const shockLabelMap = {
    postural_dizziness: 'หน้ามืดวิงเวียนเวลาเปลี่ยนท่า',
    syncope: 'วูบหมดสติ',
    palpitations: 'ใจสั่น หัวใจเต้นเร็ว',
    cold_extremities: 'เหงื่อแตกตัวเย็น ปลายมือปลายเท้าซีด',
    severe_dyspnea_fatigue: 'หายใจหอบเหนื่อย อ่อนเพลียมาก',
    oliguria_anuria: 'ปัสสาวะออกน้อยสีเข้ม/ไม่ออก',
    altered_mental: 'ซึมลง สับสน'
  };
  const abdpainLocMap = {
    epigastric_ruq: 'ใต้ลิ้นปี่/ชายโครงขวา',
    periumbilical: 'รอบสะดือ',
    llq: 'ท้องน้อยซ้าย',
    rlq: 'ท้องน้อยขวา',
    diffuse: 'ทั่วทั้งท้อง'
  };
  const abdpainCharMap = {
    burning_gnawing: 'ปวดแสบจุกร้อนสัมพันธ์กับอาหาร',
    colicky_spasm: 'ปวดบิดเกร็งเป็นพักๆ',
    peritonitis_rigid: 'ปวดรุนแรงตลอดเวลา หน้าท้องแข็งเกร็งสะเทือน'
  };
  const anticoagMap = {
    warfarin: 'Warfarin',
    doac: 'ยากลุ่ม DOACs',
    antiplatelet: 'ยาต้านเกล็ดเลือด (Aspirin/Clopidogrel)'
  };
  const nsaidMap = {
    nsaids: 'ยาแก้ปวดกลุ่ม NSAIDs',
    steroids: 'ยาสเตียรอยด์',
    herbal_bolus: 'ยาชุด/ยาลูกกลอน/ยาหม้อสมุนไพร'
  };
  const liverMap = {
    heavy_alcohol: 'ดื่มแอลกอฮอล์เป็นประจำ/ดื่มหนัก',
    cirrhosis_varices: 'โรคตับแข็ง/เส้นเลือดขอดหลอดอาหาร',
    jaundice_ascites: 'ตาเหลืองตัวเหลือง/ท้องมาน'
  };
  const pastMap = {
    past_pud_bleed: 'เคยเป็นแผล/เลือดออกทางเดินอาหาร',
    past_gi_surgery: 'เคยผ่าตัดกระเพาะ/ลำไส้',
    past_aaa_repair: 'เคยผ่าตัดใส่หลอดเลือดเทียมในช่องท้อง (AAA Repair)',
    underlying_cvd_ckd: 'โรคหลอดเลือดหัวใจ/สมอง หรือไตเรื้อรัง'
  };
  const pudTypeMap = {
    peptic_ulcer_only: 'เคยเป็นแผลในกระเพาะอย่างเดียว',
    previous_bleeding: 'เคยมีเลือดออกในทางเดินอาหาร',
    both_pud_and_bleeding: 'เคยเป็นทั้งแผลและเลือดออก'
  };
  const pudHospMap = {
    rachaburi_hospital: 'รักษา/ส่องกล้องที่ รพ.ราชบุรี',
    other_hospital: 'รักษา/ส่องกล้องที่สถานพยาบาลอื่น',
    never_unsure: 'ไม่เคยส่องกล้อง/ไม่แน่ใจ'
  };

  // Bleeding sources lines
  const bleedSummary = [];
  if (patient.giHematemesis) {
    const hDetails = [
      hemaCharMap[patient.giHematemesisChar] || 'อาเจียนมีเลือดปน',
      volMap[patient.giHematemesisVolume] || '',
      freqMap[patient.giHematemesisFreq] ? `${freqMap[patient.giHematemesisFreq]}/24 ชม.` : '',
      patient.giPrecedingRetching === 'yes' ? 'มีขย้อนนำมาก่อน' : (patient.giPrecedingRetching === 'no' ? 'ไม่มีขย้อนนำมาก่อน' : '')
    ].filter(Boolean).join(', ');
    bleedSummary.push(`อาเจียนเป็นเลือด (${hDetails})`);
  }
  if (patient.giMelena) {
    const pseudoList = (Array.isArray(patient.giPseudoMelenaMeds) ? patient.giPseudoMelenaMeds : [])
      .filter(x => x !== 'none_pseudo')
      .map(x => (x === 'ferrous' ? 'ทานยาธาตุเหล็ก' : (x === 'bismuth' ? 'ทานยาบิสมัท' : x)));
    const mDetails = [
      melenaCharMap[patient.giMelenaChar] || 'ถ่ายอุจจาระดำ',
      freqMap[patient.giMelenaFreq] ? `${freqMap[patient.giMelenaFreq]}/24 ชม.` : '',
      melenaActiveMap[patient.giMelenaActive] || '',
      patient.giMelenaPreceded === 'yes' && patient.giMelenaDays ? `ถ่ายดำนำมาก่อน ${patient.giMelenaDays} วัน` : '',
      pseudoList.length > 0 ? `ทาน ${pseudoList.join(', ')}` : ''
    ].filter(Boolean).join(', ');
    bleedSummary.push(`ถ่ายดำ (${mDetails})`);
  }
  if (patient.giHematochezia) {
    const analDetail = patient.giAnalPain === 'sharp_tearing_pain' ? 'เจ็บแสบทวารหนัก' : '';
    const massDetail = patient.giProlapsedMass === 'has_mass' ? 'มีก้อนยื่นปลิ้น' : '';
    const hzDetails = [
      hematoCharMap[patient.giHematocheziaChar] || 'ถ่ายเป็นเลือดสด',
      freqMap[patient.giHematocheziaFreq] ? `${freqMap[patient.giHematocheziaFreq]}/24 ชม.` : '',
      analDetail,
      massDetail
    ].filter(Boolean).join(', ');
    bleedSummary.push(`ถ่ายเป็นเลือดสด (${hzDetails})`);
  }

  const shockSigns = Array.isArray(patient.giShockSigns) ? patient.giShockSigns : [];
  const shockPos = shockSigns.filter(s => s !== 'none_shock').map(s => shockLabelMap[s]).filter(Boolean);
  const abdpainChars = Array.isArray(patient.giAbdpainChars) ? patient.giAbdpainChars : [];
  const abdpainCharText = abdpainChars.map(c => abdpainCharMap[c]).filter(Boolean).join(', ');

  const anticoag = Array.isArray(patient.giAnticoagMeds) ? patient.giAnticoagMeds : [];
  const anticoagPos = anticoag.filter(m => m !== 'none_anticoag').map(m => anticoagMap[m]).filter(Boolean);
  const nsaids = Array.isArray(patient.giNsaidMeds) ? patient.giNsaidMeds : [];
  const nsaidPos = nsaids.filter(m => m !== 'none_nsaids').map(m => nsaidMap[m]).filter(Boolean);
  const liver = Array.isArray(patient.giLiverAlcohol) ? patient.giLiverAlcohol : [];
  const liverPos = liver.filter(l => l !== 'none_liver').map(l => liverMap[l]).filter(Boolean);
  const past = Array.isArray(patient.giPastHistory) ? patient.giPastHistory : [];
  const pastPos = past.filter(p => p !== 'none_past').map(p => pastMap[p]).filter(Boolean);

  // Pertinent Positives (Zero 🚩 in positives!)
  const positives = [];
  if (shockPos.length > 0) positives.push(`อาการเตือนเสียเลือด: ${shockPos.join(', ')}`);
  if (patient.giHasAbdpain === 'yes') {
    const loc = abdpainLocMap[patient.giAbdpainLoc] ? `บริเวณ ${abdpainLocMap[patient.giAbdpainLoc]}` : '';
    const ch = abdpainCharText ? ` (${abdpainCharText})` : '';
    positives.push(`ปวดท้องร่วมด้วย ${loc}${ch}`.trim());
  }
  if (anticoagPos.length > 0) positives.push(`ใช้ยาละลายลิ่มเลือด/ต้านเกล็ดเลือด: ${anticoagPos.join(', ')}`);
  if (nsaidPos.length > 0) positives.push(`ใช้ยาแก้ปวด/สเตียรอยด์/ยาสมุนไพร: ${nsaidPos.join(', ')}`);
  if (liverPos.length > 0) positives.push(`ความเสี่ยงโรคตับ/แอลกอฮอล์: ${liverPos.join(', ')}`);
  if (pastPos.length > 0) {
    let pastStr = pastPos.join(', ');
    if (past.includes('past_pud_bleed')) {
      const pExtra = [pudTypeMap[patient.giPastPudType], pudHospMap[patient.giPastPudHospital]].filter(Boolean).join(' / ');
      if (pExtra) pastStr += ` (${pExtra})`;
    }
    positives.push(`ประวัติโรคทางเดินอาหาร/ผ่าตัด: ${pastStr}`);
  }
  if (patient.otherSymptomsFree) positives.push(`อื่นๆ: ${patient.otherSymptomsFree}`);

  // Pertinent Negatives (strictly from explicit answers)
  const negatives = [];
  const anyBleedAnswered = Boolean(patient.giHematemesis || patient.giMelena || patient.giHematochezia);
  if (anyBleedAnswered) {
    if (!patient.giHematemesis) negatives.push('ไม่มีอาเจียนเป็นเลือด');
    if (!patient.giMelena) negatives.push('ไม่มีถ่ายอุจจาระดำเหนียว');
    if (!patient.giHematochezia) negatives.push('ไม่มีถ่ายเป็นเลือดสด');
  }
  if (shockSigns.includes('none_shock')) {
    negatives.push('ปฏิเสธหน้ามืด วูบ ใจสั่น หรือปัสสาวะออกน้อย');
  } else if (shockSigns.length > 0 && !shockSigns.includes('syncope') && !shockSigns.includes('cold_extremities')) {
    negatives.push('ไม่มีวูบหมดสติหรือตัวเย็นชืด');
  }
  if (patient.giHasAbdpain === 'no') negatives.push('ปฏิเสธอาการปวดท้อง');
  if (anticoag.includes('none_anticoag')) negatives.push('ไม่ได้ใช้ยาละลายลิ่มเลือดหรือยาต้านเกล็ดเลือด');
  if (nsaids.includes('none_nsaids')) negatives.push('ไม่ได้ใช้ยาแก้ปวด NSAIDs สเตียรอยด์ หรือยาสมุนไพร');
  if (liver.includes('none_liver')) negatives.push('ปฏิเสธประวัติโรคตับและการดื่มแอลกอฮอล์ประจำ');
  if (past.includes('none_past')) negatives.push('ปฏิเสธประวัติแผลทางเดินอาหารหรือผ่าตัดช่องท้องเดิม');

  patient.pertinentPositives = positives;
  patient.pertinentNegatives = negatives;

  const redFlags = evaluateGiBleedRedFlags(patient);
  patient.redFlags = redFlags;

  const hospLabel = {
    self: 'ผู้ป่วยขอให้ข้อมูลด้วยตนเองทั้งหมด',
    has_history: 'มีประวัติการรักษาเดิมที่ รพ.ราชบุรี',
    first_time: 'มารับการตรวจที่ รพ.ราชบุรี ครั้งแรก'
  }[patient.hospRecordStatus] || 'ไม่ได้ระบุ';

  const udArr = Array.isArray(patient.underlying)
    ? patient.underlying.filter(u => u && !u.includes('ปฏิเสธ') && u !== 'ไม่มี' && u !== 'ไม่มีโรคประจำตัว')
    : [];
  const udExplicitDeny = Array.isArray(patient.underlying) && patient.underlying.some(u => u && u.includes('ปฏิเสธ'));
  const udText = udArr.length > 0 ? udArr.join(', ') : ((patient.hospRecordStatus === 'self' || udExplicitDeny) ? 'ปฏิเสธ' : 'ไม่ได้ระบุ');
  const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ') ? 'ไม่ได้ระบุ' : patient.currentMeds;
  const allergyText = (!patient.drugAllergy || patient.drugAllergy === 'ไม่ได้ระบุ') ? 'ไม่ได้ระบุ' : patient.drugAllergy;
  const docNotes = patient.doctor_notes || {};

  const rapidLines = [
    `[Chief Complaint (CC)]`,
    `เลือดออกในทางเดินอาหาร (${bleedSummary.length > 0 ? bleedSummary.map(s => s.split(' (')[0]).join(' / ') : 'ประเมินอาการ'}) มา ${durStr}`,
    ``,
    `[History of Present Illness (HPI)]`,
    `• การเริ่มต้นและระยะเวลา: ${[onsetStr, exactDt].filter(Boolean).join(', ') || 'ไม่ได้ระบุ'}`,
    `• ช่องทางและลักษณะเลือดออก: ${bleedSummary.length > 0 ? bleedSummary.join(' | ') : 'ไม่ได้ระบุรายละเอียด'}`,
    `• Pertinent Positives:`,
    positives.length > 0 ? positives.map(p => `  - ${p}`).join('\n') : '  - ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม',
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
  ];
  const defaultRapid = rapidLines.join('\n');

  const genderLabel = (patient.gender && patient.gender !== 'ไม่ระบุ') ? patient.gender : '';
  let defaultNarrative = `ผู้ป่วย${genderLabel} อายุ ${patient.age || 'ไม่ได้ระบุ'} ปี มาด้วยอาการเลือดออกในทางเดินอาหาร มา ${durStr}`;
  if (onsetStr || exactDt) defaultNarrative += ` (${[onsetStr, exactDt].filter(Boolean).join(', ')})`;
  defaultNarrative += `. ลักษณะเลือดออก: ${bleedSummary.length > 0 ? bleedSummary.join('; ') : 'ไม่ได้ระบุ'}.`;
  if (positives.length > 0) defaultNarrative += ` อาการร่วมและปัจจัยเสี่ยงที่พบ: ${positives.join('; ')}.`;
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
    chief_complaint: 'gi_bleed',
    chief_complaint_label: 'อาเจียนเป็นเลือด / ถ่ายดำ / ถ่ายเป็นเลือดสด',
    schema_version: '2.1',
    gi_bleeding_profile: {
      duration: { value: patient.durationVal || null, unit: patient.durationUnit || 'hours' },
      onset_mode: patient.giOnsetMode || null,
      onset_exact_date: patient.giOnsetExactDate || null,
      onset_exact_time: patient.giOnsetExactTime || null,
      hematemesis: {
        present: Boolean(patient.giHematemesis),
        character: patient.giHematemesisChar || null,
        volume: patient.giHematemesisVolume || null,
        frequency_24h: patient.giHematemesisFreq || null,
        preceding_retching: patient.giPrecedingRetching || null
      },
      melena: {
        present: Boolean(patient.giMelena),
        character: patient.giMelenaChar || null,
        frequency_24h: patient.giMelenaFreq || null,
        preceded_days: patient.giMelenaDays || null,
        active_status: patient.giMelenaActive || null,
        pseudo_melena_meds: patient.giPseudoMelenaMeds || []
      },
      hematochezia: {
        present: Boolean(patient.giHematochezia),
        character: patient.giHematocheziaChar || null,
        frequency_24h: patient.giHematocheziaFreq || null,
        anal_pain: patient.giAnalPain || null,
        prolapsed_mass: patient.giProlapsedMass || null
      },
      hemodynamic_shock_signs: shockSigns,
      abdominal_pain: {
        present: patient.giHasAbdpain || null,
        location: patient.giAbdpainLoc || null,
        characters: abdpainChars
      },
      high_risk_medications: {
        anticoagulants_antiplatelets: anticoag,
        nsaids_steroids_herbs: nsaids
      },
      liver_and_alcohol: liver,
      past_history: past,
      past_pud_type: patient.giPastPudType || null,
      past_pud_hospital: patient.giPastPudHospital || null,
      other_symptoms_free: patient.otherSymptomsFree || ''
    },
    clinical_summary: {
      pertinent_positives: positives,
      pertinent_negatives: negatives,
      red_flags: redFlags.map(rf => ({
        code: rf.key,
        text_th: rf.textTh,
        risk_rationale: rf.risk,
        level: rf.level || 'HIGH'
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

function updateGiBleedOutputs(patient) {
  if (!patient) return { rapid: '', narrative: '', json: null };
  const { defaultRapid, defaultNarrative, jsonPayload } = formatGiOutputBundle(patient);
  const finalRapid = patient.custom_rapid_note || defaultRapid;
  const finalNarrative = patient.custom_narrative_note || defaultNarrative;
  patient.rapidHpi = finalRapid;
  patient.narrativeHpi = finalNarrative;
  patient.medicalJson = jsonPayload;

  if (typeof document !== 'undefined') {
    const rapidView = getGiEl('rapidTextView');
    const narrativeView = getGiEl('narrativeTextView');
    const jsonView = getGiEl('jsonViewer');
    if (rapidView) rapidView.value = finalRapid;
    if (narrativeView) narrativeView.value = finalNarrative;
    if (jsonView) jsonView.textContent = JSON.stringify(jsonPayload, null, 2);
  }
  return { rapid: finalRapid, narrative: finalNarrative, json: jsonPayload };
}

// --- Patient Form HTML Builder ---
function buildGiBleedFormHtml() {
  return `
    <div id="giBleedQuestionnaireSection" class="hidden space-y-6">
      <div data-cc-top-banner="gi_bleed">
        <div class="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-3 shadow-sm">
          <i data-lucide="alert-octagon" class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"></i>
          <div class="text-xs sm:text-sm text-red-900 leading-relaxed">
            <span class="font-bold block mb-0.5">คำแนะนำเร่งด่วนสำหรับผู้ป่วยเลือดออกในทางเดินอาหาร:</span>
            หากท่านมีอาการ <strong>หน้ามืด วูบจะเป็นลม เหงื่อแตกตัวเย็น อาเจียนเป็นเลือดสดปริมาณมาก หรือถ่ายเป็นเลือดสดพุ่ง</strong> กรุณาแจ้งพยาบาลคัดกรองทันที และ <strong>งดน้ำ/อาหาร</strong> ระหว่างรอตรวจ
          </div>
        </div>
      </div>

      <!-- Card 1: Duration, Onset & Bleeding Source -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
        <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="droplet" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">1. ระยะเวลาที่เริ่มมีอาการ และลักษณะเลือดที่ออก</h2>
            <p class="text-xs text-slate-500">เลือกช่องทางที่สังเกตเห็นเลือดออก (เลือกได้มากกว่า 1 ช่องทาง)</p>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-800 mb-1.5">เริ่มมีอาการมานานเท่าไรแล้ว</label>
            <div class="flex items-center gap-2 max-w-sm">
              <input type="number" id="giDurationVal" min="1" max="999" placeholder="เช่น 6" class="w-24 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500">
              <select id="giDurationUnit" class="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
                <option value="minutes">นาที</option>
                <option value="hours" selected>ชั่วโมง</option>
                <option value="days">วัน</option>
                <option value="weeks">สัปดาห์</option>
                <option value="months">เดือน</option>
              </select>
            </div>
          </div>
          <div id="giOnsetExactWrap" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-800 mb-1.5">วันที่เริ่มมีเลือดออก <span class="whitespace-nowrap">(วว/ดด/ปปปป)</span> <span class="font-normal text-slate-500">(ถ้าทราบ)</span></label>
              <input type="text" id="giOnsetExactDate" data-universal-date="true" placeholder="เช่น 26/10/2026" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-800 mb-1.5">เวลาที่เริ่มมีอาการ <span class="whitespace-nowrap">(24 ชม.)</span> <span class="font-normal text-slate-500">(ถ้าทราบ)</span></label>
              <input type="text" id="giOnsetExactTime" data-universal-time="true" placeholder="เช่น 08:30" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
            </div>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-800 mb-1.5">รูปแบบการเริ่มต้นของอาการ</label>
          ${renderGiGrid('grid-cols-1 sm:grid-cols-3', [
            { kind: 'radio', name: 'giOnsetMode', value: 'sudden_severe', title: ['เกิดขึ้นเฉียบพลัน', 'ทันที'], compact: true },
            { kind: 'radio', name: 'giOnsetMode', value: 'gradual_increase', title: ['ค่อยๆ เพิ่มขึ้น', 'ใน 1–2 วัน'], compact: true },
            { kind: 'radio', name: 'giOnsetMode', value: 'chronic_intermittent', title: ['เป็นๆ หายๆ ต่อเนื่อง'], compact: true }
          ])}
        </div>

        <div class="pt-3 border-t border-slate-100 space-y-3">
          ${renderGiSysHeader({ label: '1.1 ช่องทางและลักษณะเลือดออกที่พบ', icon: 'activity', colorClass: 'bg-red-100 text-red-700' })}
          <div class="space-y-3">
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
              ${renderGiOption({ kind: 'checkbox', id: 'gi_hematemesis_cb', title: ['อาเจียนเป็นเลือด', 'หรือสีกาแฟ'], desc: 'มีเลือดสด ลิ่มเลือด หรือน้ำสีน้ำตาลเข้มคล้ายกากกาแฟ', onchange: 'handleGiHematemesisToggle(this)' })}
              <div id="giHematemesisWrap" class="hidden mt-3 pt-3 border-t border-slate-200 space-y-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1.5">ลักษณะสิ่งที่อาเจียน</label>
                  ${renderGiGrid('grid-cols-1 sm:grid-cols-3', [
                    { kind: 'radio', name: 'giHematemesisChar', value: 'bright_red_clots', title: ['เลือดสีแดงสด', 'หรือมีลิ่มเลือด'], compact: true },
                    { kind: 'radio', name: 'giHematemesisChar', value: 'pink_streaks', title: ['น้ำย่อยปนสายเลือดจาง'], compact: true },
                    { kind: 'radio', name: 'giHematemesisChar', value: 'coffee_ground', title: ['สีน้ำตาลเข้ม', 'คล้ายกากกาแฟ'], compact: true }
                  ])}
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1.5">ปริมาณต่อครั้ง</label>
                    ${renderGiGrid('grid-cols-1', [
                      { kind: 'radio', name: 'giHematemesisVolume', value: 'large', title: ['มาก', '(เต็มถ้วย / >1 แก้ว)'], compact: true },
                      { kind: 'radio', name: 'giHematemesisVolume', value: 'moderate', title: ['ปานกลาง (~ครึ่งแก้ว)'], compact: true },
                      { kind: 'radio', name: 'giHematemesisVolume', value: 'small', title: ['เล็กน้อย', '(ปนน้ำลาย/อาหาร)'], compact: true }
                    ])}
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1.5">ความถี่ใน 24 ชั่วโมง</label>
                    ${renderGiGrid('grid-cols-1', [
                      { kind: 'radio', name: 'giHematemesisFreq', value: 'freq_1_2', title: ['1–2 ครั้ง'], compact: true },
                      { kind: 'radio', name: 'giHematemesisFreq', value: 'freq_3_5', title: ['3–5 ครั้ง'], compact: true },
                      { kind: 'radio', name: 'giHematemesisFreq', value: 'freq_gt_5', title: ['มากกว่า 5 ครั้ง'], compact: true }
                    ])}
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1.5">มีไอแรงหรืออาเจียนเศษอาหารนำมาก่อนหรือไม่</label>
                  ${renderGiGrid('grid-cols-1 sm:grid-cols-2', [
                    { kind: 'radio', name: 'giPrecedingRetching', value: 'yes', title: ['มี (ขย้อน/ไอแรง', 'หลายครั้ง', 'นำมาก่อนค่อยมีเลือด)'], compact: true },
                    { kind: 'radio', name: 'giPrecedingRetching', value: 'no', title: ['ไม่มี', '(อาเจียนเป็นเลือด', 'เลยตั้งแต่แรก)'], compact: true }
                  ])}
                </div>
              </div>
            </div>

            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
              ${renderGiOption({ kind: 'checkbox', id: 'gi_melena_cb', title: ['ถ่ายอุจจาระดำเหนียว', 'คล้ายยางมะตอย'], desc: 'สีดำสนิท กลิ่นคาวแรง หรืออุจจาระสีคล้ำผิดปกติ', onchange: 'handleGiMelenaToggle(this)' })}
              <div id="giMelenaWrap" class="hidden mt-3 pt-3 border-t border-slate-200 space-y-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1.5">ลักษณะอุจจาระสีดำ</label>
                  ${renderGiGrid('grid-cols-1 sm:grid-cols-2', [
                    { kind: 'radio', name: 'giMelenaChar', value: 'tarry_foul', title: ['ดำสนิท', 'เหนียวคล้ายยางมะตอย', 'กลิ่นคาวแรง'], compact: true },
                    { kind: 'radio', name: 'giMelenaChar', value: 'dark_brown_formed', title: ['สีน้ำตาลเข้ม/ดำคล้ำ', 'เป็นก้อนปกติ'], compact: true }
                  ])}
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1.5">ความถี่ใน 24 ชั่วโมง</label>
                    ${renderGiGrid('grid-cols-1', [
                      { kind: 'radio', name: 'giMelenaFreq', value: 'freq_1_2', title: ['1–2 ครั้ง'], compact: true },
                      { kind: 'radio', name: 'giMelenaFreq', value: 'freq_3_5', title: ['3–5 ครั้ง'], compact: true },
                      { kind: 'radio', name: 'giMelenaFreq', value: 'freq_gt_5', title: ['มากกว่า 5 ครั้ง'], compact: true }
                    ])}
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1.5">สถานะล่าสุด</label>
                    ${renderGiGrid('grid-cols-1', [
                      { kind: 'radio', name: 'giMelenaActive', value: 'active_continuous', title: ['ยังถ่ายดำอยู่เรื่อยๆ'], compact: true },
                      { kind: 'radio', name: 'giMelenaActive', value: 'stopped_recently', title: ['หยุดถ่ายดำไปแล้ว'], compact: true }
                    ])}
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1.5">ถ่ายดำต่อเนื่องมาก่อนวันนี้หรือไม่</label>
                  ${renderGiGrid('grid-cols-1 sm:grid-cols-2', [
                    { kind: 'radio', name: 'giMelenaPreceded', value: 'yes', title: ['มี', '(เป็นมาก่อนหลายวัน)'], onchange: "handleGiMelenaPrecededChange('yes')", compact: true },
                    { kind: 'radio', name: 'giMelenaPreceded', value: 'no', title: ['ไม่มี', '(เพิ่งเป็นวันนี้)'], onchange: "handleGiMelenaPrecededChange('no')", compact: true }
                  ])}
                  <div id="giMelenaDaysWrap" class="hidden mt-2 flex items-center gap-2">
                    <label class="text-xs font-medium text-slate-700">จำนวนวันที่มีอาการนำมาก่อน:</label>
                    <input type="number" id="giMelenaDays" min="1" placeholder="ระบุ" class="w-24 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
                    <span class="text-xs text-slate-600">วัน</span>
                  </div>
                </div>
                <div class="pt-2 border-t border-slate-200">
                  ${renderGiSysHeader({
                    label: 'ยาที่อาจทำให้อุจจาระสีดำ',
                    icon: 'pill',
                    colorClass: 'bg-slate-200 text-slate-700',
                    toggleId: 'giPseudoMelenaNoneCb',
                    toggleLabel: 'ไม่ได้ทานยากลุ่มนี้',
                    toggleName: 'giPseudoMelenaMeds',
                    toggleValue: 'none_pseudo',
                    toggleOnchange: 'handleGiPseudoMelenaNoneToggle(this)'
                  })}
                  ${renderGiGrid('grid-cols-1 sm:grid-cols-2', [
                    { kind: 'checkbox', name: 'giPseudoMelenaMeds', value: 'ferrous', title: ['ยาบำรุงเลือด', '(ธาตุเหล็ก)'], onchange: 'handleGiPseudoMelenaItemChange(this)', compact: true },
                    { kind: 'checkbox', name: 'giPseudoMelenaMeds', value: 'bismuth', title: ['ยาเคลือบกระเพาะ', '(Bismuth)'], onchange: 'handleGiPseudoMelenaItemChange(this)', compact: true }
                  ])}
                </div>
              </div>
            </div>

            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
              ${renderGiOption({ kind: 'checkbox', id: 'gi_hematochezia_cb', title: ['ถ่ายเป็นเลือดสด', 'หรือมูกเลือด'], desc: 'เลือดสีแดงสดปนอุจจาระ หยดลงโถ หรือเปื้อนกระดาษชำระ', onchange: 'handleGiHematocheziaToggle(this)' })}
              <div id="giHematocheziaWrap" class="hidden mt-3 pt-3 border-t border-slate-200 space-y-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1.5">ลักษณะเลือดที่ถ่ายออก</label>
                  ${renderGiGrid('grid-cols-1 sm:grid-cols-2', [
                    { kind: 'radio', name: 'giHematocheziaChar', value: 'profuse_bright_red', title: ['เลือดสดล้วน', '/ ลิ่มเลือดมาก', 'ไหลพุ่งเต็มโถ'], compact: true },
                    { kind: 'radio', name: 'giHematocheziaChar', value: 'surface_streak_or_drip', title: 'เลือดเคลือบผิวอุจจาระ <span class="inline-block whitespace-nowrap">หรือหยดหลังถ่าย</span>', compact: true },
                    { kind: 'radio', name: 'giHematocheziaChar', value: 'toilet_paper_only', title: ['เปื้อนเฉพาะ', 'กระดาษชำระ'], compact: true },
                    { kind: 'radio', name: 'giHematocheziaChar', value: 'bloody_mucus_loose', title: ['ถ่ายเหลวมูกปนเลือดสด'], compact: true }
                  ])}
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1.5">ความถี่ใน 24 ชั่วโมง</label>
                    ${renderGiGrid('grid-cols-1', [
                      { kind: 'radio', name: 'giHematocheziaFreq', value: 'freq_1_2', title: ['1–2 ครั้ง'], compact: true },
                      { kind: 'radio', name: 'giHematocheziaFreq', value: 'freq_3_5', title: ['3–5 ครั้ง'], compact: true },
                      { kind: 'radio', name: 'giHematocheziaFreq', value: 'freq_gt_5', title: ['มากกว่า 5 ครั้ง'], compact: true }
                    ])}
                  </div>
                  <div class="space-y-2.5">
                    <div>
                      <label class="block text-xs font-semibold text-slate-700 mb-1.5">อาการเจ็บแสบทวารหนัก</label>
                      ${renderGiGrid('grid-cols-1', [
                        { kind: 'radio', name: 'giAnalPain', value: 'sharp_tearing_pain', title: ['เจ็บแสบ/บาดทวาร', 'ขณะถ่าย'], compact: true },
                        { kind: 'radio', name: 'giAnalPain', value: 'no_anal_pain', title: ['ไม่เจ็บปวด', 'ที่ทวารหนัก'], compact: true }
                      ])}
                    </div>
                    <div>
                      <label class="block text-xs font-semibold text-slate-700 mb-1.5">ติ่ง/ก้อนยื่นที่ทวารหนัก</label>
                      ${renderGiGrid('grid-cols-1', [
                        { kind: 'radio', name: 'giProlapsedMass', value: 'has_mass', title: ['มีก้อน/ติ่งเนื้อ', 'ยื่นปลิ้นออกมา'], compact: true },
                        { kind: 'radio', name: 'giProlapsedMass', value: 'no_mass', title: ['ไม่มีก้อนยื่นออกมา'], compact: true }
                      ])}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 2: Shock Warning Signs & Abdominal Pain -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
        <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div class="bg-red-100 text-red-700 p-2 rounded-xl"><i data-lucide="shield-alert" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">2. สัญญาณเตือนภาวะเสียเลือด และอาการปวดท้อง</h2>
            <p class="text-xs text-slate-500">คัดกรองอาการหน้ามืด วูบ ภาวะช็อก และปวดท้องร่วมด้วย</p>
          </div>
        </div>

        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          ${renderGiSysHeader({
            label: '2.1 สัญญาณเสียเลือดและระบบไหลเวียน (เลือกได้หลายข้อ)',
            icon: 'heart-pulse',
            colorClass: 'bg-red-100 text-red-700',
            toggleId: 'giShockNoneCb',
            toggleLabel: 'ไม่มีอาการในหมวดนี้',
            toggleName: 'giShockSigns',
            toggleValue: 'none_shock',
            toggleOnchange: 'handleGiShockNoneToggle(this)'
          })}
          ${renderGiGrid('grid-cols-1 sm:grid-cols-2', [
            { name: 'giShockSigns', value: 'postural_dizziness', title: ['หน้ามืด วิงเวียน', 'เวลาเปลี่ยนท่า'], onchange: 'handleGiShockItemChange(this)' },
            { name: 'giShockSigns', value: 'syncope', title: ['วูบหมดสติ หรือเป็นลม'], onchange: 'handleGiShockItemChange(this)' },
            { name: 'giShockSigns', value: 'palpitations', title: ['ใจสั่น หัวใจเต้นเร็ว'], onchange: 'handleGiShockItemChange(this)' },
            { name: 'giShockSigns', value: 'cold_extremities', title: ['เหงื่อแตก ตัวเย็น', 'มือเท้าซีด'], onchange: 'handleGiShockItemChange(this)' },
            { name: 'giShockSigns', value: 'severe_dyspnea_fatigue', title: ['หายใจหอบเหนื่อย', 'อ่อนเพลียมาก'], onchange: 'handleGiShockItemChange(this)' },
            { name: 'giShockSigns', value: 'oliguria_anuria', title: ['ปัสสาวะออกน้อย', 'หรือไม่ปัสสาวะเลย'], onchange: 'handleGiShockItemChange(this)' },
            { name: 'giShockSigns', value: 'altered_mental', title: ['ซึมลง สับสน', 'ตอบสนองช้า'], colSpan2: true, onchange: 'handleGiShockItemChange(this)' }
          ])}
        </div>

        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          ${renderGiSysHeader({ label: '2.2 อาการปวดท้องร่วมด้วย', icon: 'utensils', colorClass: 'bg-amber-100 text-amber-700' })}
          ${renderGiGrid('grid-cols-1 sm:grid-cols-2', [
            { kind: 'radio', name: 'giHasAbdpain', value: 'no', title: ['ไม่มีอาการปวดท้อง'], onchange: "handleGiAbdpainChange('no')" },
            { kind: 'radio', name: 'giHasAbdpain', value: 'yes', title: ['มีอาการปวดท้อง', 'ร่วมด้วย'], onchange: "handleGiAbdpainChange('yes')" }
          ])}
          <div id="giAbdpainWrap" class="hidden mt-3 pt-3 border-t border-slate-200 space-y-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">ตำแหน่งที่ปวดเด่นชัด</label>
              ${renderGiGrid('grid-cols-2 sm:grid-cols-3', [
                { kind: 'radio', name: 'giAbdpainLoc', value: 'epigastric_ruq', title: ['ใต้ลิ้นปี่ /', 'ชายโครงขวา'], compact: true },
                { kind: 'radio', name: 'giAbdpainLoc', value: 'periumbilical', title: ['รอบสะดือ'], compact: true },
                { kind: 'radio', name: 'giAbdpainLoc', value: 'llq', title: ['ท้องน้อยซ้าย'], compact: true },
                { kind: 'radio', name: 'giAbdpainLoc', value: 'rlq', title: ['ท้องน้อยขวา'], compact: true },
                { kind: 'radio', name: 'giAbdpainLoc', value: 'diffuse', title: ['ทั่วทั้งท้อง'], compact: true }
              ])}
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">ลักษณะอาการปวดท้อง (เลือกได้หลายข้อ)</label>
              ${renderGiGrid('grid-cols-1', [
                { kind: 'checkbox', name: 'giAbdpainChars', value: 'burning_gnawing', title: ['ปวดแสบ จุกแน่น', 'สัมพันธ์กับมื้ออาหาร'], compact: true },
                { kind: 'checkbox', name: 'giAbdpainChars', value: 'colicky_spasm', title: ['ปวดบิดเกร็งเป็นพักๆ', 'สัมพันธ์กับอยากถ่าย'], compact: true },
                { kind: 'checkbox', name: 'giAbdpainChars', value: 'peritonitis_rigid', title: ['ปวดรุนแรงตลอดเวลา', 'หน้าท้องแข็งเกร็ง', 'สะเทือน'], compact: true }
              ])}
            </div>
          </div>
        </div>
      </div>

      <!-- Card 3: High-Risk Medications -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
        <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div class="bg-amber-100 text-amber-700 p-2 rounded-xl"><i data-lucide="pill" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">3. ประวัติการใช้ยาความเสี่ยงสูง</h2>
            <p class="text-xs text-slate-500">ตรวจสอบยาละลายลิ่มเลือด ยาต้านเกล็ดเลือด และยาแก้ปวด/ยาสมุนไพร</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            ${renderGiSysHeader({
              label: '3.1 ยาละลายลิ่มเลือด / ต้านเกล็ดเลือด',
              icon: 'shield',
              colorClass: 'bg-rose-100 text-rose-700',
              toggleId: 'giAnticoagNoneCb',
              toggleLabel: 'ไม่ได้ทานยากลุ่มนี้',
              toggleName: 'giAnticoagMeds',
              toggleValue: 'none_anticoag',
              toggleOnchange: 'handleGiAnticoagNoneToggle(this)'
            })}
            <div class="space-y-2">
              ${renderGiOption({ name: 'giAnticoagMeds', value: 'warfarin', title: ['ยาละลายลิ่มเลือด', 'Warfarin'], desc: 'เช่น Coumadin, Orfarin', onchange: 'handleGiAnticoagItemChange(this)', compact: true })}
              ${renderGiOption({ name: 'giAnticoagMeds', value: 'doac', title: ['ยาละลายลิ่มเลือด', 'รุ่นใหม่'], desc: 'เช่น Eliquis, Xarelto, Pradaxa', onchange: 'handleGiAnticoagItemChange(this)', compact: true })}
              ${renderGiOption({ name: 'giAnticoagMeds', value: 'antiplatelet', title: ['ยาต้านเกล็ดเลือด'], desc: 'เช่น Aspirin, Plavix, Brilinta', onchange: 'handleGiAnticoagItemChange(this)', compact: true })}
            </div>
          </div>

          <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            ${renderGiSysHeader({
              label: '3.2 ยาแก้ปวดข้อ / สเตียรอยด์ / ยาชุด',
              icon: 'alert-triangle',
              colorClass: 'bg-amber-100 text-amber-700',
              toggleId: 'giNsaidNoneCb',
              toggleLabel: 'ไม่ได้ทานยากลุ่มนี้',
              toggleName: 'giNsaidMeds',
              toggleValue: 'none_nsaids',
              toggleOnchange: 'handleGiNsaidsNoneToggle(this)'
            })}
            <div class="space-y-2">
              ${renderGiOption({ name: 'giNsaidMeds', value: 'nsaids', title: ['ยาแก้ปวดข้อ', '/ กล้ามเนื้อ'], desc: 'เช่น Ibuprofen, Diclofenac, Naproxen, Arcoxia', onchange: 'handleGiNsaidItemChange(this)', compact: true })}
              ${renderGiOption({ name: 'giNsaidMeds', value: 'steroids', title: ['ยาสเตียรอยด์'], desc: 'เช่น Prednisolone, Dexamethasone', onchange: 'handleGiNsaidItemChange(this)', compact: true })}
              ${renderGiOption({ name: 'giNsaidMeds', value: 'herbal_bolus', title: ['ยาชุด ยาหม้อ', 'ยาลูกกลอน สมุนไพร'], onchange: 'handleGiNsaidItemChange(this)', compact: true })}
            </div>
          </div>
        </div>
      </div>

      <!-- Card 4: Liver/Alcohol & Past GI History -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
        <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="file-text" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">4. ประวัติโรคตับ แอลกอฮอล์ และการรักษาทางเดินอาหารเดิม</h2>
            <p class="text-xs text-slate-500">ตรวจสอบความเสี่ยงเส้นเลือดขอด แผลในกระเพาะเดิม และการผ่าตัดในช่องท้อง</p>
          </div>
        </div>

        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          ${renderGiSysHeader({
            label: '4.1 ประวัติโรคตับและแอลกอฮอล์',
            icon: 'wine',
            colorClass: 'bg-purple-100 text-purple-700',
            toggleId: 'giLiverNoneCb',
            toggleLabel: 'ไม่มีในหมวดนี้',
            toggleName: 'giLiverAlcohol',
            toggleValue: 'none_liver',
            toggleOnchange: 'handleGiLiverNoneToggle(this)'
          })}
          ${renderGiGrid('grid-cols-1 sm:grid-cols-3', [
            { name: 'giLiverAlcohol', value: 'heavy_alcohol', title: ['ดื่มสุรา/เบียร์ประจำ', 'หรือดื่มหนัก', 'ต่อเนื่องเป็นประจำ'], onchange: 'handleGiLiverItemChange(this)', compact: true },
            { name: 'giLiverAlcohol', value: 'cirrhosis_varices', title: ['เป็นโรคตับแข็ง', 'หรือเส้นเลือดขอด', 'หลอดอาหาร'], onchange: 'handleGiLiverItemChange(this)', compact: true },
            { name: 'giLiverAlcohol', value: 'jaundice_ascites', title: ['ตาเหลือง ตัวเหลือง', 'หรือท้องมานบวมโต'], onchange: 'handleGiLiverItemChange(this)', compact: true }
          ])}
        </div>

        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          ${renderGiSysHeader({
            label: '4.2 ประวัติแผลทางเดินอาหารและการผ่าตัดเดิม',
            icon: 'clipboard-list',
            colorClass: 'bg-blue-100 text-blue-700',
            toggleId: 'giPastNoneCb',
            toggleLabel: 'ไม่มีในหมวดนี้',
            toggleName: 'giPastHistory',
            toggleValue: 'none_past',
            toggleOnchange: 'handleGiPastNoneToggle(this)'
          })}
          ${renderGiGrid('grid-cols-1 sm:grid-cols-2', [
            { id: 'gi_past_pud_cb', name: 'giPastHistory', value: 'past_pud_bleed', title: ['เคยเป็นแผล', 'หรือเลือดออก', 'ทางเดินอาหาร'], onchange: 'handleGiPastPudBleedToggle(this)', compact: true },
            { name: 'giPastHistory', value: 'past_gi_surgery', title: ['เคยผ่าตัดกระเพาะ', 'หรือผ่าตัดลำไส้'], onchange: 'handleGiPastItemChange(this)', compact: true },
            { name: 'giPastHistory', value: 'past_aaa_repair', title: ['เคยผ่าตัดใส่', 'หลอดเลือดเทียม', 'ในช่องท้อง (AAA)'], onchange: 'handleGiPastItemChange(this)', compact: true },
            { name: 'giPastHistory', value: 'underlying_cvd_ckd', title: ['มีโรคหัวใจ สมอง', 'หรือโรคไตเรื้อรัง'], onchange: 'handleGiPastItemChange(this)', compact: true }
          ])}
          <div id="giPastPudBleedWrap" class="hidden mt-3 pt-3 border-t border-slate-200 space-y-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">ประวัติแผล/เลือดออกเดิม</label>
              ${renderGiGrid('grid-cols-1 sm:grid-cols-3', [
                { kind: 'radio', name: 'giPastPudType', value: 'peptic_ulcer_only', title: ['เคยเป็นแผลในกระเพาะ', '(ไม่เคยเลือดออก)'], compact: true },
                { kind: 'radio', name: 'giPastPudType', value: 'previous_bleeding', title: ['เคยมีเลือดออกมาก่อน'], compact: true },
                { kind: 'radio', name: 'giPastPudType', value: 'both_pud_and_bleeding', title: ['เคยเป็นทั้งแผล', 'และเลือดออกมาก่อน'], compact: true }
              ])}
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">ประวัติการส่องกล้อง/รักษา</label>
              ${renderGiGrid('grid-cols-1 sm:grid-cols-3', [
                { kind: 'radio', name: 'giPastPudHospital', value: 'rachaburi_hospital', title: ['รักษา/ส่องกล้อง', 'ที่ รพ.ราชบุรี'], compact: true },
                { kind: 'radio', name: 'giPastPudHospital', value: 'other_hospital', title: ['รักษา/ส่องกล้อง', 'ที่ รพ.อื่น'], compact: true },
                { kind: 'radio', name: 'giPastPudHospital', value: 'never_unsure', title: ['ไม่เคยส่องกล้อง', '/ ไม่แน่ใจ'], compact: true }
              ])}
            </div>
          </div>
        </div>
      </div>

      <!-- Unnumbered Card: Additional Notes -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100">
          <div class="bg-slate-100 text-slate-600 p-2 rounded-xl"><i data-lucide="message-square-plus" class="w-5 h-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-800">อาการอื่น ๆ หรือข้อความเพิ่มเติมถึงแพทย์</h2>
            <p class="text-xs text-slate-500">ระบุอาการเพิ่มเติมหรือข้อสังเกตของท่านถึงแพทย์ (ถ้ามี)</p>
          </div>
        </div>
        <textarea id="gi_bleed_other_free" rows="2" placeholder="ระบุอาการอื่นๆ เพิ่มเติม (ถ้ามี)..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500"></textarea>
      </div>
    </div>
  `;
}

// --- Register Chief Complaint Module ---
registerCcModule({
  id: 'gi_bleed',
  recordCc: 'gi_bleeding',
  titleTh: 'อาเจียนเป็นเลือด / ถ่ายดำ / ถ่ายเป็นเลือดสด',
  titleEn: 'Acute GI Bleeding (Hematemesis / Melena / Hematochezia)',
  sectionDomId: 'giBleedQuestionnaireSection',
  doctorCcBadgeHtml: '<i data-lucide="droplet" class="w-4 h-4 text-red-500 mr-1.5 flex-shrink-0"></i><span class="font-bold text-slate-800">CC: อาเจียนเป็นเลือด / ถ่ายดำ / ถ่ายเป็นเลือดสด</span>',
  patientBadgeHtml: '<i data-lucide="droplet" class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"></i><span><span class="inline-block whitespace-nowrap">อาเจียน/</span><span class="inline-block whitespace-nowrap">ถ่ายเป็นเลือด</span></span>',
  pmhSectionNumber: 5,
  dateFields: ['giOnsetExactDate'],
  timeFields: ['giOnsetExactTime'],
  branchIds: [
    'giHematemesisWrap',
    'giMelenaWrap',
    'giMelenaDaysWrap',
    'giHematocheziaWrap',
    'giAbdpainWrap',
    'giPastPudBleedWrap'
  ],
  inputIdsToClear: [
    'giDurationVal',
    'giOnsetExactDate',
    'giOnsetExactTime',
    'giMelenaDays',
    'gi_bleed_other_free'
  ],
  formHtml: buildGiBleedFormHtml(),

  resetForm: function() {
    (this.branchIds || []).forEach(id => {
      const el = getGiEl(id);
      if (el) el.classList.add('hidden');
    });
    (this.inputIdsToClear || []).forEach(id => {
      const el = getGiEl(id);
      if (el) el.value = '';
    });
    const durUnit = getGiEl('giDurationUnit');
    if (durUnit) durUnit.value = 'hours';
    const root = getGiEl('giBleedQuestionnaireSection');
    if (root) {
      root.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(inp => { inp.checked = false; });
    }
  },
  clearForm: function() { this.resetForm(); },

  collectIntake: function(ctx) {
    const c = ctx || {};
    const _rawDur = parseFloat(getGiEl('giDurationVal')?.value);
    const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
    const durationUnit = getGiEl('giDurationUnit')?.value || 'hours';

    const giOnsetMode = queryGiOne('input[name="giOnsetMode"]:checked')?.value || '';
    const giOnsetExactDate = getGiEl('giOnsetExactDate')?.value?.trim() || '';
    const giOnsetExactTime = getGiEl('giOnsetExactTime')?.value?.trim() || '';

    const giHematemesis = Boolean(getGiEl('gi_hematemesis_cb')?.checked);
    const giHematemesisChar = queryGiOne('input[name="giHematemesisChar"]:checked')?.value || '';
    const giHematemesisVolume = queryGiOne('input[name="giHematemesisVolume"]:checked')?.value || '';
    const giHematemesisFreq = queryGiOne('input[name="giHematemesisFreq"]:checked')?.value || '';
    const giPrecedingRetching = queryGiOne('input[name="giPrecedingRetching"]:checked')?.value || '';

    const giMelena = Boolean(getGiEl('gi_melena_cb')?.checked);
    const giMelenaChar = queryGiOne('input[name="giMelenaChar"]:checked')?.value || '';
    const giMelenaFreq = queryGiOne('input[name="giMelenaFreq"]:checked')?.value || '';
    const giMelenaPreceded = queryGiOne('input[name="giMelenaPreceded"]:checked')?.value || '';
    const _rawMelenaDays = parseInt(getGiEl('giMelenaDays')?.value, 10);
    const giMelenaDays = (!isNaN(_rawMelenaDays) && _rawMelenaDays > 0) ? _rawMelenaDays : null;
    const giMelenaActive = queryGiOne('input[name="giMelenaActive"]:checked')?.value || '';
    const giPseudoMelenaMeds = queryGiAll('input[name="giPseudoMelenaMeds"]:checked').map(el => el.value);

    const giHematochezia = Boolean(getGiEl('gi_hematochezia_cb')?.checked);
    const giHematocheziaChar = queryGiOne('input[name="giHematocheziaChar"]:checked')?.value || '';
    const giHematocheziaFreq = queryGiOne('input[name="giHematocheziaFreq"]:checked')?.value || '';
    const giAnalPain = queryGiOne('input[name="giAnalPain"]:checked')?.value || '';
    const giProlapsedMass = queryGiOne('input[name="giProlapsedMass"]:checked')?.value || '';

    const giShockSigns = queryGiAll('input[name="giShockSigns"]:checked').map(el => el.value);
    const giHasAbdpain = queryGiOne('input[name="giHasAbdpain"]:checked')?.value || '';
    const giAbdpainLoc = queryGiOne('input[name="giAbdpainLoc"]:checked')?.value || '';
    const giAbdpainChars = queryGiAll('input[name="giAbdpainChars"]:checked').map(el => el.value);

    const giAnticoagMeds = queryGiAll('input[name="giAnticoagMeds"]:checked').map(el => el.value);
    const giNsaidMeds = queryGiAll('input[name="giNsaidMeds"]:checked').map(el => el.value);
    const giLiverAlcohol = queryGiAll('input[name="giLiverAlcohol"]:checked').map(el => el.value);

    const giPastHistory = queryGiAll('input[name="giPastHistory"]:checked').map(el => el.value);
    const giPastPudType = queryGiOne('input[name="giPastPudType"]:checked')?.value || '';
    const giPastPudHospital = queryGiOne('input[name="giPastPudHospital"]:checked')?.value || '';

    return {
      id: c.recordId || '',
      queue_number: c.queueNumber || '',
      hn: c.randomHn || '',
      name: c.patientName || '',
      age: c.patientAge !== undefined ? c.patientAge : null,
      gender: c.gender || '',
      chief_complaint: 'gi_bleed',
      chief_complaint_title: 'อาเจียนเป็นเลือด / ถ่ายดำ / ถ่ายเป็นเลือดสด',
      timestamp: new Date().toISOString(),
      status: c.recordStatus || 'waiting',
      durationVal,
      durationUnit,
      hospRecordStatus: c.hospRecordStatus || '',
      underlying: Array.isArray(c.underlying) ? c.underlying : [],
      drugAllergy: c.drugAllergy || '',
      currentMeds: c.currentMeds || '',
      otherSymptomsFree: getGiEl('gi_bleed_other_free')?.value?.trim() || c.otherSymptomsFree || '',
      doctor_notes: c.preservedDoctorNotes || { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },

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
    this.resetForm();

    const setVal = (id, val) => {
      const el = getGiEl(id);
      if (el) el.value = (val !== undefined && val !== null) ? val : '';
    };
    const setRadio = (name, val) => {
      if (!val) return;
      const el = queryGiOne(`input[name="${name}"][value="${val}"]`);
      if (el) el.checked = true;
    };
    const setCheckboxes = (name, arr) => {
      if (!Array.isArray(arr)) return;
      arr.forEach(val => {
        const el = queryGiOne(`input[name="${name}"][value="${val}"]`);
        if (el) el.checked = true;
      });
    };

    setVal('giDurationVal', patient.durationVal || '');
    setVal('giDurationUnit', patient.durationUnit || 'hours');
    setRadio('giOnsetMode', patient.giOnsetMode);
    setVal('giOnsetExactDate', patient.giOnsetExactDate || '');
    setVal('giOnsetExactTime', patient.giOnsetExactTime || '');

    const hemaCb = getGiEl('gi_hematemesis_cb');
    if (hemaCb) {
      hemaCb.checked = Boolean(patient.giHematemesis);
      handleGiHematemesisToggle(hemaCb);
    }
    if (patient.giHematemesis) {
      setRadio('giHematemesisChar', patient.giHematemesisChar);
      setRadio('giHematemesisVolume', patient.giHematemesisVolume);
      setRadio('giHematemesisFreq', patient.giHematemesisFreq);
      setRadio('giPrecedingRetching', patient.giPrecedingRetching);
    }

    const melenaCb = getGiEl('gi_melena_cb');
    if (melenaCb) {
      melenaCb.checked = Boolean(patient.giMelena);
      handleGiMelenaToggle(melenaCb);
    }
    if (patient.giMelena) {
      setRadio('giMelenaChar', patient.giMelenaChar);
      setRadio('giMelenaFreq', patient.giMelenaFreq);
      setRadio('giMelenaPreceded', patient.giMelenaPreceded);
      handleGiMelenaPrecededChange(patient.giMelenaPreceded);
      setVal('giMelenaDays', patient.giMelenaDays || '');
      setRadio('giMelenaActive', patient.giMelenaActive);
      setCheckboxes('giPseudoMelenaMeds', patient.giPseudoMelenaMeds);
    }

    const hematoCb = getGiEl('gi_hematochezia_cb');
    if (hematoCb) {
      hematoCb.checked = Boolean(patient.giHematochezia);
      handleGiHematocheziaToggle(hematoCb);
    }
    if (patient.giHematochezia) {
      setRadio('giHematocheziaChar', patient.giHematocheziaChar);
      setRadio('giHematocheziaFreq', patient.giHematocheziaFreq);
      setRadio('giAnalPain', patient.giAnalPain);
      setRadio('giProlapsedMass', patient.giProlapsedMass);
    }

    setCheckboxes('giShockSigns', patient.giShockSigns);
    setRadio('giHasAbdpain', patient.giHasAbdpain);
    handleGiAbdpainChange(patient.giHasAbdpain);
    if (patient.giHasAbdpain === 'yes') {
      setRadio('giAbdpainLoc', patient.giAbdpainLoc);
      setCheckboxes('giAbdpainChars', patient.giAbdpainChars);
    }

    setCheckboxes('giAnticoagMeds', patient.giAnticoagMeds);
    setCheckboxes('giNsaidMeds', patient.giNsaidMeds);
    setCheckboxes('giLiverAlcohol', patient.giLiverAlcohol);
    setCheckboxes('giPastHistory', patient.giPastHistory);
    if (Array.isArray(patient.giPastHistory) && patient.giPastHistory.includes('past_pud_bleed')) {
      handleGiPastPudBleedToggle({ checked: true });
      setRadio('giPastPudType', patient.giPastPudType);
      setRadio('giPastPudHospital', patient.giPastPudHospital);
    }

    setVal('gi_bleed_other_free', patient.otherSymptomsFree || '');
  },
  populateForm: function(patient) { this.hydrateForm(patient); },
  onSelectForm: function() { this.resetForm(); },
  onActivate: function() {
    if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') lucide.createIcons();
  },
  onMounted: function() { this.onActivate(); },
  init: function() { this.onActivate(); },

  isRedFlag: function(patient) { return isGiBleedRedFlag(patient); },
  evaluateRedFlags: function(patient) { return evaluateGiBleedRedFlags(patient); },
  updateOutputs: function(patient) { return updateGiBleedOutputs(patient); },

  algorithm: {
    ccId: 'gi_bleed',
    schemaKey: 'gi_bleed',
    titleTh: 'อาเจียนเป็นเลือด / ถ่ายดำ / ถ่ายเป็นเลือดสด',
    titleEn: 'Acute Gastrointestinal Bleeding',
    triageLevelDefault: 2,
    redFlagCategories: [
      'gi_rf_hemorrhagic_shock',
      'gi_rf_variceal_bleeding',
      'gi_rf_massive_bleeding',
      'gi_rf_perforated_ulcer',
      'gi_rf_anticoagulant_induced',
      'gi_rf_aortoenteric_fistula'
    ]
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

if (typeof window !== 'undefined') {
  window.handleGiHematemesisToggle = handleGiHematemesisToggle;
  window.handleGiMelenaToggle = handleGiMelenaToggle;
  window.handleGiMelenaPrecededChange = handleGiMelenaPrecededChange;
  window.handleGiPseudoMelenaNoneToggle = handleGiPseudoMelenaNoneToggle;
  window.handleGiPseudoMelenaItemChange = handleGiPseudoMelenaItemChange;
  window.handleGiHematocheziaToggle = handleGiHematocheziaToggle;
  window.handleGiShockNoneToggle = handleGiShockNoneToggle;
  window.handleGiShockItemChange = handleGiShockItemChange;
  window.handleGiAbdpainChange = handleGiAbdpainChange;
  window.handleGiAnticoagNoneToggle = handleGiAnticoagNoneToggle;
  window.handleGiAnticoagItemChange = handleGiAnticoagItemChange;
  window.handleGiNsaidsNoneToggle = handleGiNsaidsNoneToggle;
  window.handleGiNsaidItemChange = handleGiNsaidItemChange;
  window.handleGiLiverNoneToggle = handleGiLiverNoneToggle;
  window.handleGiLiverItemChange = handleGiLiverItemChange;
  window.handleGiPastPudBleedToggle = handleGiPastPudBleedToggle;
  window.handleGiPastNoneToggle = handleGiPastNoneToggle;
  window.handleGiPastItemChange = handleGiPastItemChange;
}
