// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 26_laceration_bleeding.js
// อาการนำ: บาดแผลฉีกขาด / มีเลือดออก (Laceration / Active Bleeding)
// รองรับ Zero Default Bias, Progressive Disclosure 6 ตำแหน่งร่างกาย,
// Universal Date/Time, Pain Slider Touch State, และ Core Guard TDD 100%
// =========================================================================

// --- Module-scoped State & Helpers ---
let lacPainScoreTouched = false;

function wrapLacWords(chunks) {
  if (!Array.isArray(chunks)) return chunks;
  return chunks.map(c => `<span class="inline-block whitespace-nowrap">${c}</span>`).join(' ');
}

function renderLacOption(cfg) {
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
  const titleHtml = Array.isArray(title) ? wrapLacWords(title) : title;
  const bodyHtml = desc
    ? `<div class="ml-3 leading-snug"><span class="block text-xs sm:text-sm font-semibold text-slate-800">${titleHtml}</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">${desc}</span></div>`
    : `<span class="ml-3 ${compact ? 'text-xs' : 'text-xs sm:text-sm'} font-semibold text-slate-800 leading-snug">${titleHtml}</span>`;
  return `<label class="selectable-card bg-white flex ${alignCls} ${padCls} rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition${spanCls}"><input type="${kind}" ${idAttr}${nameAttr}${valAttr}${chgAttr}class="${topCls}${roundCls}text-medical-600 focus:ring-medical-500 ${szCls} flex-shrink-0">${bodyHtml}</label>`;
}

function renderLacGrid(colsCls, items, shared = {}) {
  return `<div class="grid ${colsCls} gap-2.5">${items.map(it => renderLacOption({ ...shared, ...it })).join('\n')}</div>`;
}

function renderLacSysHeader({
  label,
  icon,
  colorClass,
  toggleKind = 'checkbox',
  toggleId = '',
  toggleLabel = '',
  toggleName = '',
  toggleValue = '',
  toggleOnchange = ''
}) {
  const nameAttr = toggleName ? `name="${toggleName}" ` : '';
  const valAttr = toggleValue ? `value="${toggleValue}" ` : '';
  const chgAttr = toggleOnchange ? `onchange="${toggleOnchange}" ` : '';
  const roundCls = toggleKind === 'checkbox' ? ' rounded' : '';
  const toggleHtml = toggleId
    ? `<label class="inline-flex items-center px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 cursor-pointer transition select-none flex-shrink-0">
      <input type="${toggleKind}" id="${toggleId}" ${nameAttr}${valAttr}${chgAttr}class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5${roundCls}">
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

function renderLacCauseCard(value, title, desc, containerId, inputId, placeholder) {
  return `<div>
    ${renderLacOption({
      name: 'lacCauses',
      value,
      title,
      desc,
      onchange: `toggleLacGroup('${containerId}', this.checked)`
    })}
    <div id="${containerId}" class="hidden mt-2 pl-3 border-l-2 border-medical-200">
      <input type="text" id="${inputId}" placeholder="${placeholder}" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-slate-900 text-xs focus:ring-2 focus:ring-medical-500 focus:bg-white">
    </div>
  </div>`;
}

function handleLacGroupNoneToggle(noneEl, inputName) {
  if (!noneEl || !noneEl.checked || typeof document === 'undefined') return;
  document.querySelectorAll(`input[name="${inputName}"]`).forEach(cb => {
    if (cb !== noneEl) cb.checked = false;
  });
}

function handleLacGroupItemChange(itemEl, noneId) {
  if (!itemEl || !itemEl.checked || !noneId || typeof document === 'undefined') return;
  const noneEl = document.getElementById(noneId);
  if (noneEl) noneEl.checked = false;
}

function handleLacProdromeChange(val) {
  toggleLacGroup('lacProdromeDetailContainer', val === 'has_prodrome');
}

function toggleLacGroup(subId, show) {
  const el = document.getElementById(subId);
  if (!el) return;
  if (show) {
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
    el.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    el.querySelectorAll('input[type="radio"]').forEach(rb => { rb.checked = false; });
    const textInputs = el.querySelectorAll('input[type="text"]');
    textInputs.forEach(ti => { ti.value = ''; });
    const numInputs = el.querySelectorAll('input[type="number"]');
    numInputs.forEach(ni => { ni.value = ''; });
  }
}

function clearLacPainScore() {
  lacPainScoreTouched = false;
  const slider = document.getElementById('lacPainScore');
  if (slider) slider.value = 0;
  const emojiEl = document.getElementById('lacPainScoreEmoji');
  const textEl = document.getElementById('lacPainScoreText');
  const badgeEl = document.getElementById('lacPainScoreBadge');
  const clearBtn = document.getElementById('lacPainScoreClearBtn');
  if (emojiEl) emojiEl.textContent = '⚪';
  if (textEl) textEl.textContent = 'ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)';
  if (badgeEl) badgeEl.className = 'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all';
  if (clearBtn) clearBtn.classList.add('hidden');
}

function handleLacPainScoreChange(val) {
  lacPainScoreTouched = true;
  const num = parseInt(val, 10) || 0;
  const slider = document.getElementById('lacPainScore');
  if (slider && String(slider.value) !== String(num)) slider.value = num;
  const emojiEl = document.getElementById('lacPainScoreEmoji');
  const textEl = document.getElementById('lacPainScoreText');
  const badgeEl = document.getElementById('lacPainScoreBadge');
  const clearBtn = document.getElementById('lacPainScoreClearBtn');
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
function setLacPainScore(score) {
  lacPainScoreTouched = true;
  const slider = document.getElementById('lacPainScore');
  if (slider) slider.value = score;
  handleLacPainScoreChange(score);
}
const handleLacPainSliderTouch = handleLacPainScoreChange;
if (typeof window !== 'undefined') {
  window.toggleLacGroup = toggleLacGroup;
  window.handleLacGroupNoneToggle = handleLacGroupNoneToggle;
  window.handleLacGroupItemChange = handleLacGroupItemChange;
  window.handleLacProdromeChange = handleLacProdromeChange;
  window.clearLacPainScore = clearLacPainScore;
  window.handleLacPainScoreChange = handleLacPainScoreChange;
  window.setLacPainScore = setLacPainScore;
}

// --- Clinical Decision Support & Evaluation Functions ---
function evaluateLacerationRedFlags(patient) {
  const rfs = [];
  const addRf = (key, level, textTh, risk, suggestedAction) => {
    rfs.push({ key, level, textTh, title: textTh, risk, detail: risk, suggestedAction, action: suggestedAction });
  };
  const vs = patient.vital_signs || {};
  const sbp = vs.sbp !== undefined && vs.sbp !== null ? parseInt(vs.sbp, 10) : null;
  const pr = vs.pr !== undefined && vs.pr !== null ? parseInt(vs.pr, 10) : null;

  const bleedingStatus = patient.lacBleedingStatus || '';
  const systemicSigns = Array.isArray(patient.lacSystemicSigns) ? patient.lacSystemicSigns : [];
  const contaminants = Array.isArray(patient.lacContaminants) ? patient.lacContaminants : [];
  const antithrombotic = patient.lacAntithrombotic || '';

  const headSigns = Array.isArray(patient.lacHeadSigns) ? patient.lacHeadSigns : [];
  const neckSigns = Array.isArray(patient.lacNeckSigns) ? patient.lacNeckSigns : [];
  const chestSigns = Array.isArray(patient.lacChestSigns) ? patient.lacChestSigns : [];
  const abdomenSigns = Array.isArray(patient.lacAbdomenSigns) ? patient.lacAbdomenSigns : [];
  const upperExtSigns = Array.isArray(patient.lacUpperExtSigns) ? patient.lacUpperExtSigns : [];
  const lowerExtSigns = Array.isArray(patient.lacLowerExtSigns) ? patient.lacLowerExtSigns : [];

  // 1. Uncontrolled Arterial Bleeding / Hemorrhagic Shock (ESI 1)
  const isShockVs = (sbp !== null && sbp < 90) || (sbp !== null && pr !== null && (pr / sbp) >= 1.0);
  const isSpurting = bleedingStatus === 'active_spurting';
  const hasShockSigns = systemicSigns.includes('palpitation_cold_sweat') && systemicSigns.includes('dizziness_presyncope');

  if (isSpurting || hasShockSigns || isShockVs) {
    addRf('rf_lac_arterial_hemorrhagic_shock', 1,
      'ภาวะเลือดออกรุนแรงพุ่งเป็นจังหวะตามชีพจร หรือมีภาวะช็อกจากการเสียเลือด (Uncontrolled Arterial Bleeding / Hemorrhagic Shock)',
      'Hypovolemic shock, cardiac arrest, irreversible tissue hypoxia secondary to massive blood loss.',
      'Immediate Direct Pressure Dressing. Apply arterial tourniquet proximal to wound if on extremity and direct pressure fails. Establish 2 large-bore IV lines (16-18G), stat fluid resuscitation, Type & Crossmatch PRBCs, notify Trauma Surgeon immediately.');
  }

  // 2. Penetrating Neck / Thoracic / Abdominal Trauma (ESI 1)
  const isNeckCritical = neckSigns.includes('airway_dyspnea_stridor') || neckSigns.includes('expanding_neck_mass');
  const isChestCritical = chestSigns.includes('sucking_chest_wound') || chestSigns.includes('dyspnea_pleuritic_pain');
  const isAbdomenCritical = abdomenSigns.includes('evisceration_internal_organ') || abdomenSigns.includes('severe_abd_pain_rigid');

  if (isNeckCritical || isChestCritical || isAbdomenCritical) {
    addRf('rf_lac_penetrating_neck_torso', 1,
      'บาดแผลลึกหรือทะลุบริเวณลำคอ หน้าอก หรือช่องท้อง (Penetrating Neck / Thoracic / Abdominal Trauma)',
      'Tension/open pneumothorax, major vascular disruption, tracheobronchial injury, visceral rupture with peritonitis.',
      'Apply 3-sided occlusive dressing for sucking chest wound. Cover eviscerated bowel with moist sterile saline gauze (do not push back). Stat eFAST ultrasound, upright/portable CXR, Stat surgical consultation for emergency exploration.');
  }

  // 3. Traumatic Amputation / Acute Limb Ischemia (ESI 1 / 2)
  const hasAmputation = upperExtSigns.includes('amputation_hand') || lowerExtSigns.includes('amputation_leg');
  const hasIschemia = upperExtSigns.includes('vascular_cold_pale_hand') || lowerExtSigns.includes('vascular_cold_pale_foot');

  if (hasAmputation || hasIschemia) {
    addRf('rf_lac_traumatic_amputation_ischemia', 2,
      'ภาวะนิ้วหรืออวัยวะขาด หรือมีภาวะขาดเลือดส่วนปลาย (Traumatic Amputation / Acute Limb Ischemia)',
      'Permanent loss of extremity/digit viability, muscle necrosis, secondary systemic toxicity.',
      'Control stump bleeding with compressive dressing. Wrap amputated part in saline-moistened sterile gauze, seal in plastic bag, place on ice-water bath (avoid direct ice contact). Stat Orthopedic/Plastic Surgery consult for emergent replantation. Stat IV Cefazolin.');
  }

  // 4. Head Laceration with TBI Warning / Open Globe Injury (ESI 2)
  const hasHeadTbi = headSigns.includes('loss_of_consciousness') || headSigns.includes('csf_leak_ear_nose') || headSigns.includes('severe_headache_vomit');
  const hasEyeInjury = headSigns.includes('vision_problem_eye_injury');

  if (hasHeadTbi || hasEyeInjury) {
    addRf('rf_lac_head_ocular_trauma', 2,
      'บาดแผลศีรษะร่วมกับอาการทางสมอง หรือบาดแผลทะลุดวงตา (Head Laceration with TBI Warning / Open Globe Injury)',
      'Intracranial hemorrhage, brain herniation, traumatic optic neuropathy, permanent blindness from globe rupture.',
      'For suspected eye injury: place rigid eye shield immediately, DO NOT apply pressure or remove foreign objects, stat Ophthalmology consult. For TBI signs: perform full Glasgow Coma Scale (GCS) and schedule Stat Non-contrast CT Brain.');
  }

  // 5. Suspected Open Fracture / Tendon or Nerve Injury (ESI 2 / 3)
  const hasOpenFx = upperExtSigns.includes('open_fracture_arm') || lowerExtSigns.includes('open_fracture_leg');
  const hasTendonNerve = upperExtSigns.includes('tendon_deficit_hand') || upperExtSigns.includes('nerve_numbness_hand') || lowerExtSigns.includes('tendon_bone_deficit_leg') || lowerExtSigns.includes('nerve_numbness_foot');

  if (hasOpenFx || hasTendonNerve) {
    addRf('rf_lac_open_fracture_tendon_nerve', hasOpenFx ? 2 : 3,
      hasOpenFx ? 'สงสัยกระดูกหักแบบมีแผลเปิด (Suspected Open Fracture)' : 'สงสัยเส้นเอ็นหรือเส้นประสาทบาดเจ็บ (Suspected Tendon or Peripheral Nerve Injury)',
      'Osteomyelitis, permanent loss of fine motor dexterity, claw hand, drop foot, persistent neuropathy.',
      'Assess and document 2-point discrimination and individual tendon motion BEFORE local anesthesia. Stat X-ray of injured limb. For open fracture: initiate IV Cefazolin within 1 hr, apply sterile dressing and splint, urgent Orthopedic consult.');
  }

  // 6. Suspected Retained Foreign Body / Anticoagulant Use (ESI 3)
  const hasRetainedFb = contaminants.includes('foreign_body_retained');
  const hasAnticoag = antithrombotic === 'on_anticoagulant_antiplatelet' || antithrombotic === 'bleeding_disorder';

  if (hasRetainedFb || hasAnticoag) {
    addRf('rf_lac_retained_fb_anticoagulant', 3,
      hasRetainedFb ? 'สงสัยมีสิ่งแปลกปลอมตกค้างหรือหักคาในบาดแผล (Suspected Retained Foreign Body in Wound)' : 'ผู้ป่วยมีประวัติใช้ยาละลายลิ่มเลือด หรือมีภาวะเลือดออกง่ายหยุดยาก (Anticoagulant / Bleeding Disorder Risk)',
      'Delayed wound healing, chronic infection, granuloma formation, secondary refractory hemorrhage.',
      'Order soft tissue X-ray or bedside POCUS to locate radiopaque/sonographic foreign bodies prior to suturing. Check PT/INR if on Warfarin, prepare for prolonged compression and consider hemostatic adjuncts.');
  }

  return rfs;
}

// --- Formatters for Doctor Rapid Note (Thai-Centric) ---
function formatLacCauses(patient) {
  const causes = Array.isArray(patient.lacCauses) ? patient.lacCauses : [];
  if (causes.length === 0) return 'ไม่ได้ระบุสาเหตุ';
  const parts = [];
  if (causes.includes('sharp_object')) parts.push(patient.lacCauseSharpDetail ? `ของมีคมบาด/ทิ่มแทง (${patient.lacCauseSharpDetail})` : 'ของมีคมบาด หรือทิ่มแทง');
  if (causes.includes('machinery_tools')) parts.push(patient.lacCauseMachineryDetail ? `เครื่องจักรกล/อุปกรณ์ไฟฟ้า (${patient.lacCauseMachineryDetail})` : 'เครื่องจักรกล หรืออุปกรณ์ไฟฟ้า/การเกษตร');
  if (causes.includes('blunt_impact')) parts.push(patient.lacCauseBluntDetail ? `ถูกกระแทกด้วยของแข็ง (${patient.lacCauseBluntDetail})` : 'ถูกกระแทกด้วยของแข็ง');
  if (causes.includes('fall_collision')) parts.push('หกล้ม หรือชนกระแทกจนเกิดแผลแตก');
  if (causes.includes('puncture_wound')) parts.push(patient.lacCausePunctureDetail ? `ของแหลมทิ่มตำ (${patient.lacCausePunctureDetail})` : 'ถูกไม้ ตะปู เสี้ยน หรือของแหลมทิ่มตำ');
  if (causes.includes('other_cause')) parts.push(patient.lacCauseOtherDetail ? `สาเหตุอื่น: ${patient.lacCauseOtherDetail}` : 'สาเหตุอื่นๆ');
  return parts.join(', ');
}

function formatLacContaminants(patient) {
  const conts = Array.isArray(patient.lacContaminants) ? patient.lacContaminants : [];
  if (conts.length === 0) return 'ไม่ได้ระบุ';
  const map = {
    foreign_body_retained: 'มีวัตถุหักคา/ปักคาในแผล',
    dirty_contaminated: 'แผลปนเปื้อนดินโคลน สนิม หรือน้ำสกปรก',
    clean_wound: 'แผลสะอาด ไม่มีสิ่งแปลกปลอม'
  };
  return conts.map(c => map[c] || c).join(', ');
}

function formatLacBleedingStatus(patient) {
  const map = {
    active_spurting: 'เลือดยังไหลพุ่งเป็นจังหวะตามชีพจร หรือไหลทะลักมากผิดปกติ',
    active_oozing: 'เลือดยังไหลซึมต่อเนื่อง',
    stopped: 'เลือดหยุดไหลแล้ว หรือมีเพียงคราบเลือดซึมเล็กน้อย'
  };
  return map[patient.lacBleedingStatus] || 'ไม่ได้ระบุ';
}

function formatLacProdrome(patient) {
  const map = {
    no_prodrome: 'ไม่มีอาการผิดปกตินำมาก่อน (อุบัติเหตุโดยตรง)',
    has_prodrome: 'มีอาการวูบ หน้ามืด เจ็บหน้าอก หรืออ่อนแรงนำมาก่อน'
  };
  if (patient.lacProdrome === 'has_prodrome') {
    return patient.lacProdromeDetail
      ? `${map.has_prodrome} (${patient.lacProdromeDetail})`
      : map.has_prodrome;
  }
  return map[patient.lacProdrome] || 'ไม่ได้ระบุ';
}

function formatLacTetanus(patient) {
  const map = {
    within_5_years: 'เคยฉีดเข็มกระตุ้นภายใน 5 ปีที่ผ่านมา',
    '5_to_10_years': 'เคยฉีดในช่วง 5–10 ปีที่ผ่านมา',
    more_than_10_years: 'เคยฉีดครบ แต่เกิน 10 ปีแล้ว',
    over_10_years: 'เคยฉีดครบ แต่เกิน 10 ปีแล้ว',
    never_or_unsure: 'ไม่เคยฉีด หรือจำประวัติไม่ได้',
    unknown_or_never: 'ไม่เคยฉีด หรือจำประวัติไม่ได้'
  };
  return map[patient.lacTetanusHx] || 'ไม่ได้ระบุ';
}

function formatLacAntithrombotic(patient) {
  const map = {
    on_anticoagulant_antiplatelet: 'รับประทานยาละลายลิ่มเลือด หรือยาต้านเกล็ดเลือด',
    bleeding_disorder: 'มีโรคประจำตัวเลือดออกง่ายหยุดยาก',
    unknown_meds: 'มียาประจำตัวรับประทานอยู่ แต่ไม่ทราบชื่อยา',
    no_antithrombotic: 'ไม่ได้ใช้ยากลุ่มนี้ และไม่มีโรคเลือดหยุดยาก'
  };
  return map[patient.lacAntithrombotic] || 'ไม่ได้ระบุ';
}

function formatLacAnatomy(patient) {
  const parts = [];
  const injMap = { wound: 'มีแผล', pain_swelling: 'ปวด/บวม/ฟกช้ำ', deformity: 'ผิดรูป' };
  const sideLabel = (arr, injArr) => {
    const thMap = { left: 'ซ้าย', right: 'ขวา', center: 'ตรงกลาง' };
    const sStr = Array.isArray(arr) && arr.length > 0 ? arr.map(s => thMap[s] || s).join(', ') : '';
    const iStr = Array.isArray(injArr) && injArr.length > 0 ? injArr.map(i => injMap[i] || i).join('/') : '';
    if (sStr && iStr) return ` [${sStr} — ${iStr}]`;
    if (sStr) return ` [${sStr}]`;
    if (iStr) return ` [${iStr}]`;
    return '';
  };
  const digitMap = { thumb: 'นิ้วโป้ง', index: 'นิ้วชี้', middle: 'นิ้วกลาง', ring: 'นิ้วนาง', little: 'นิ้วก้อย' };
  const fmtDigitsBySide = (leftD, rightD, fallbackSides, fallbackD, injArr) => {
    const dParts = [];
    if (Array.isArray(leftD) && leftD.length > 0) dParts.push(`ซ้าย: ${leftD.map(x => digitMap[x] || x).join(', ')}`);
    if (Array.isArray(rightD) && rightD.length > 0) dParts.push(`ขวา: ${rightD.map(x => digitMap[x] || x).join(', ')}`);
    const iStr = Array.isArray(injArr) && injArr.length > 0 ? ` — ${injArr.map(i => injMap[i] || i).join('/')}` : '';
    if (dParts.length > 0) return ` [${dParts.join('; ')}${iStr}]`;
    return `${sideLabel(fallbackSides, injArr)}${Array.isArray(fallbackD) && fallbackD.length > 0 ? ` [${fallbackD.map(x => digitMap[x] || x).join(', ')}]` : ''}`;
  };

  if (patient.lacParentHeadFace) {
    const headParts = [];
    if (patient.lacHeadScalp) headParts.push(`หนังศีรษะ/หน้าผาก${sideLabel(patient.lacHeadScalpSides, patient.lacHeadScalpInjuries)}`);
    if (patient.lacHeadFace) headParts.push(`ใบหน้า/คิ้ว/แก้ม/คาง${sideLabel(patient.lacHeadFaceSides, patient.lacHeadFaceInjuries)}`);
    if (patient.lacHeadEye) headParts.push(`ดวงตา/เปลือกตา${sideLabel(patient.lacHeadEyeSides, patient.lacHeadEyeInjuries)}`);
    if (patient.lacHeadEar) headParts.push(`ใบหู${sideLabel(patient.lacHeadEarSides, patient.lacHeadEarInjuries)}`);
    if (patient.lacHeadNoseMouth) headParts.push(`จมูก/ปาก/ลิ้น${sideLabel(patient.lacHeadNoseMouthSides, patient.lacHeadNoseMouthInjuries)}`);
    parts.push(`ศีรษะ/ใบหน้า: ${headParts.length > 0 ? headParts.join(', ') : 'มีบาดแผล'}`);
  }
  if (patient.lacParentNeck) {
    const neckParts = [];
    if (patient.lacNeckFront) neckParts.push(`คอด้านหน้า${sideLabel(patient.lacNeckFrontSides, patient.lacNeckFrontInjuries)}`);
    if (patient.lacNeckSide) neckParts.push(`คอด้านข้าง${sideLabel(patient.lacNeckSideSides, patient.lacNeckSideInjuries)}`);
    if (patient.lacNeckBack) neckParts.push(`ต้นคอด้านหลัง${sideLabel(patient.lacNeckBackSides, patient.lacNeckBackInjuries)}`);
    parts.push(`ลำคอ/ต้นคอ: ${neckParts.length > 0 ? neckParts.join(', ') : 'มีบาดแผล'}`);
  }
  if (patient.lacParentChest) {
    const chestParts = [];
    if (patient.lacChestRibs) chestParts.push(`หน้าอก/ซี่โครง${sideLabel(patient.lacChestRibsSides, patient.lacChestRibsInjuries)}`);
    if (patient.lacChestUpperBack) chestParts.push(`หลังส่วนบน/สะบัก${sideLabel(patient.lacChestUpperBackSides, patient.lacChestUpperBackInjuries)}`);
    parts.push(`ทรวงอก/หลังส่วนบน: ${chestParts.length > 0 ? chestParts.join(', ') : 'มีบาดแผล'}`);
  }
  if (patient.lacParentAbdomen) {
    const abdParts = [];
    if (patient.lacAbdWall) abdParts.push(`หน้าท้อง${sideLabel(patient.lacAbdWallSides, patient.lacAbdWallInjuries)}`);
    if (patient.lacAbdFlank) abdParts.push(`สีข้าง/บั้นเอว${sideLabel(patient.lacAbdFlankSides, patient.lacAbdFlankInjuries)}`);
    if (patient.lacAbdLowerBack) abdParts.push(`หลังส่วนล่าง${sideLabel(patient.lacAbdLowerBackSides, patient.lacAbdLowerBackInjuries)}`);
    if (patient.lacAbdButtock) abdParts.push(`ก้น/สะโพก${sideLabel(patient.lacAbdButtockSides, patient.lacAbdButtockInjuries)}`);
    if (patient.lacAbdGenitalia) abdParts.push(`ขาหนีบ/อวัยวะเพศ${sideLabel(patient.lacAbdGenitaliaSides, patient.lacAbdGenitaliaInjuries)}`);
    parts.push(`ช่องท้อง/หลังส่วนล่าง: ${abdParts.length > 0 ? abdParts.join(', ') : 'มีบาดแผล'}`);
  }
  if (patient.lacParentUpperExtremity) {
    const armParts = [];
    if (patient.lacArmShoulder) armParts.push(`ไหล่/ต้นแขน${sideLabel(patient.lacArmShoulderSides, patient.lacArmShoulderInjuries)}`);
    if (patient.lacArmElbow) armParts.push(`ข้อศอก/แขนท่อนล่าง${sideLabel(patient.lacArmElbowSides, patient.lacArmElbowInjuries)}`);
    if (patient.lacArmWrist) armParts.push(`ข้อมือ/ฝ่ามือ/หลังมือ${sideLabel(patient.lacArmWristSides, patient.lacArmWristInjuries)}`);
    if (patient.lacArmFingers) armParts.push(`นิ้วมือ${fmtDigitsBySide(patient.lacArmFingersLeftDigits, patient.lacArmFingersRightDigits, patient.lacArmFingersSides, patient.lacArmFingersDigits, patient.lacArmFingersInjuries)}`);
    parts.push(`แขน/มือ: ${armParts.length > 0 ? armParts.join(', ') : 'มีบาดแผล'}`);
  }
  if (patient.lacParentLowerExtremity) {
    const legParts = [];
    if (patient.lacLegThigh) legParts.push(`ต้นขา${sideLabel(patient.lacLegThighSides, patient.lacLegThighInjuries)}`);
    if (patient.lacLegKneeShin) legParts.push(`เข่า/หน้าแข้ง/น่อง${sideLabel(patient.lacLegKneeShinSides, patient.lacLegKneeShinInjuries)}`);
    if (patient.lacLegAnkleFoot) legParts.push(`ข้อเท้า/เท้า${sideLabel(patient.lacLegAnkleFootSides, patient.lacLegAnkleFootInjuries)}`);
    if (patient.lacLegToes) legParts.push(`นิ้วเท้า${fmtDigitsBySide(patient.lacLegToesLeftDigits, patient.lacLegToesRightDigits, patient.lacLegToesSides, patient.lacLegToesDigits, patient.lacLegToesInjuries)}`);
    parts.push(`ขา/เท้า: ${legParts.length > 0 ? legParts.join(', ') : 'มีบาดแผล'}`);
  }
  if (patient.lacParentOther) {
    parts.push(`ตำแหน่งอื่นๆ: ${patient.lacOtherLocationDetail || 'ระบุตำแหน่งอื่น'}`);
  }
  return parts.length > 0 ? parts.join(' | ') : 'ยังไม่ระบุตำแหน่งเฉพาะ';
}

// --- Rapid Note Generator (5 Standardized Sections) ---
function renderLacerationRapidHpi(patient) {
  const durVal = patient.durationVal;
  const durUnitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durUnit = durUnitMap[patient.durationUnit] || 'ชั่วโมง';
  const durationStr = durVal ? `${durVal} ${durUnit}` : 'ไม่ระบุ';

  const painScoreStr = patient.painScore !== null && patient.painScore !== undefined
    ? `${patient.painScore}/10`
    : 'ไม่ได้ระบุ';

  const headSigns = Array.isArray(patient.lacHeadSigns) ? patient.lacHeadSigns : [];
  const neckSigns = Array.isArray(patient.lacNeckSigns) ? patient.lacNeckSigns : [];
  const chestSigns = Array.isArray(patient.lacChestSigns) ? patient.lacChestSigns : [];
  const abdomenSigns = Array.isArray(patient.lacAbdomenSigns) ? patient.lacAbdomenSigns : [];
  const upperExtSigns = Array.isArray(patient.lacUpperExtSigns) ? patient.lacUpperExtSigns : [];
  const lowerExtSigns = Array.isArray(patient.lacLowerExtSigns) ? patient.lacLowerExtSigns : [];
  const systemicSigns = Array.isArray(patient.lacSystemicSigns) ? patient.lacSystemicSigns : [];
  const contaminants = Array.isArray(patient.lacContaminants) ? patient.lacContaminants : [];

  const posList = [];
  const negList = [];

  // Positives Evaluation
  if (patient.lacBleedingStatus === 'active_spurting') posList.push('เลือดยังไหลพุ่งเป็นจังหวะตามชีพจร หรือไหลทะลักมากผิดปกติ');
  else if (patient.lacBleedingStatus === 'active_oozing') posList.push('เลือดยังไหลซึมต่อเนื่อง');
  if (contaminants.includes('foreign_body_retained')) posList.push('มีวัตถุหักคา หรือปักคาอยู่ในบาดแผล (เช่น เศษแก้ว, เสี้ยนไม้, โลหะ)');
  if (contaminants.includes('dirty_contaminated')) posList.push('บาดแผลปนเปื้อนดินโคลน สนิม น้ำสกปรก หรือเศษอาหาร/มูลสัตว์');

  // Head/Face Positives
  if (headSigns.includes('loss_of_consciousness')) posList.push('มีอาการสลบ หมดสติไปชั่วขณะ หรือจำเหตุการณ์ไม่ได้');
  if (headSigns.includes('severe_headache_vomit')) posList.push('ปวดศีรษะรุนแรง มึนงงสับสน หรือมีอาเจียน');
  if (headSigns.includes('vision_problem_eye_injury')) posList.push('ตาพร่ามัว มองเห็นภาพซ้อน หรือบาดแผลถูกดวงตาโดยตรง');
  if (headSigns.includes('csf_leak_ear_nose')) posList.push('มีเลือดหรือน้ำใสไหลออกจากรูหู หรือรูจมูก');

  // Neck Positives
  if (neckSigns.includes('airway_dyspnea_stridor')) posList.push('หายใจลำบาก กลืนลำบาก เสียงแหบ หรือมีฟองอากาศ/เสียงลมออกทางแผลที่คอ');
  if (neckSigns.includes('expanding_neck_mass')) posList.push('บริเวณแผลที่คอบวมโตขึ้นอย่างรวดเร็ว (เสี่ยง Hematoma กดหลอดลม)');
  if (neckSigns.includes('neck_pain_radiculopathy')) posList.push('ปวดตึงต้นคอ หรือมีอาการชา/อ่อนแรงร้าวลงแขนขา');

  // Chest Positives
  if (chestSigns.includes('dyspnea_pleuritic_pain')) posList.push('หายใจหอบเหนื่อย แน่นหน้าอก หรือเจ็บแปล๊บเวลาหายใจเข้าลึกๆ');
  if (chestSigns.includes('sucking_chest_wound')) posList.push('แผลลึก หรือมีฟองอากาศ/เสียงลมดูดเข้า-ออกทางบาดแผลที่หน้าอก (Open Pneumothorax)');

  // Abdomen Positives
  if (abdomenSigns.includes('severe_abd_pain_rigid')) posList.push('ปวดท้องรุนแรง หรือหน้าท้องแข็งตึง');
  if (abdomenSigns.includes('evisceration_internal_organ')) posList.push('บาดแผลลึกจนมีเนื้อเยื่อหรืออวัยวะภายในโผล่ออกมา (Evisceration)');
  if (abdomenSigns.includes('urinary_symptoms_hematuria')) posList.push('ปัสสาวะไม่ออก หรือมีเลือดปนในปัสสาวะ');

  // Upper Extremity Positives
  if (upperExtSigns.includes('tendon_deficit_hand')) posList.push('ขยับเหยียดหรืองอนิ้วมือ ข้อมือ หรือข้อศอกไม่ได้ตามปกติ (สงสัยเส้นเอ็นขาด)');
  if (upperExtSigns.includes('nerve_numbness_hand')) posList.push('มีอาการชา หรือไร้ความรู้สึกที่ปลายนิ้วมือ/ฝ่ามือ (สงสัยเส้นประสาทบาดเจ็บ)');
  if (upperExtSigns.includes('vascular_cold_pale_hand')) posList.push('ปลายนิ้วมือซีดขาว เย็นเฉียบ หรือม่วงคล้ำ (สงสัยหลอดเลือดแดงบาดเจ็บ)');
  if (upperExtSigns.includes('open_fracture_arm')) posList.push('แขน ข้อมือ หรือนิ้วผิดรูป บิดเบี้ยว หรือแผลลึกจนมองเห็นกระดูก (Open fracture)');
  if (upperExtSigns.includes('amputation_hand')) posList.push('นิ้วมือหรือชิ้นส่วนของมือ/แขนขาดออกจากกัน (Traumatic amputation)');

  // Lower Extremity Positives
  if (lowerExtSigns.includes('tendon_bone_deficit_leg')) posList.push('เดินลงน้ำหนักไม่ได้ หรือกระดกข้อเท้า/ขยับนิ้วเท้าไม่ได้ตามปกติ');
  if (lowerExtSigns.includes('nerve_numbness_foot')) posList.push('มีอาการชา หรือไร้ความรู้สึกที่เท้า/นิ้วเท้า (สงสัยเส้นประสาทบาดเจ็บ)');
  if (lowerExtSigns.includes('vascular_cold_pale_foot')) posList.push('ปลายเท้าซีดขาว เย็นเฉียบ หรือม่วงคล้ำ (สงสัยหลอดเลือดแดงบาดเจ็บ)');
  if (lowerExtSigns.includes('open_fracture_leg')) posList.push('ขา ข้อเท้า หรือเท้าผิดรูป บิดเบี้ยว หรือแผลลึกจนมองเห็นกระดูก (Open fracture)');
  if (lowerExtSigns.includes('amputation_leg')) posList.push('นิ้วเท้าหรือชิ้นส่วนของเท้า/ขาขาดออกจากกัน (Traumatic amputation)');

  // Systemic Positives
  if (systemicSigns.includes('dizziness_presyncope')) posList.push('หน้ามืด เวียนศีรษะ วูบ หรือรู้สึกเหมือนจะเป็นลม');
  if (systemicSigns.includes('palpitation_cold_sweat')) posList.push('ใจสั่น เหงื่อแตกท่วมตัว ตัวเย็น หรือหน้าซีดปากซีด');
  if (systemicSigns.includes('excessive_thirst_weakness')) posList.push('กระหายน้ำมากผิดปกติ หรืออ่อนเพลียไม่มีแรง');
  if (systemicSigns.includes('infection_signs_fever_pus')) posList.push('มีไข้ หนาวสั่น หรือบริเวณแผลเริ่มบวมแดงร้อนและมีหนองซึม');

  if (patient.otherSymptomsFree) posList.push(patient.otherSymptomsFree);

  // Negatives Evaluation (เฉพาะหมวดที่มีการคัดกรองหรือระบุคำตอบยืนยัน)
  if (patient.lacBleedingStatus === 'stopped') negList.push('เลือดหยุดไหลแล้ว ไม่มีเลือดพุ่งหรือซึมต่อเนื่อง');
  if (contaminants.length > 0 && !contaminants.includes('foreign_body_retained')) negList.push('ไม่มีวัตถุปักคาหรือหักคาในบาดแผล');
  if (patient.lacParentHeadFace && !headSigns.includes('loss_of_consciousness') && !headSigns.includes('severe_headache_vomit')) negList.push('ไม่มีอาการสลบ หมดสติ หรืออาเจียน');
  if (patient.lacParentChest && !chestSigns.includes('dyspnea_pleuritic_pain') && !chestSigns.includes('sucking_chest_wound')) negList.push('ไม่มีอาการแน่นหน้าอก หายใจลำบาก หรือลมดูดออกทางแผล');
  if (patient.lacParentAbdomen && !abdomenSigns.includes('severe_abd_pain_rigid') && !abdomenSigns.includes('evisceration_internal_organ')) negList.push('ไม่มีปวดเกร็งหน้าท้อง และไม่มีอวัยวะภายในโผล่');
  if ((patient.lacParentUpperExtremity || patient.lacParentLowerExtremity) && !upperExtSigns.includes('tendon_deficit_hand') && !lowerExtSigns.includes('tendon_bone_deficit_leg')) negList.push('ไม่มีอาการงอหรือเหยียดข้อนิ้วไม่ได้ (ยังขยับได้ปกติ)');
  if ((patient.lacParentUpperExtremity || patient.lacParentLowerExtremity) && !upperExtSigns.includes('nerve_numbness_hand') && !lowerExtSigns.includes('nerve_numbness_foot')) negList.push('ไม่มีอาการชา หรือสูญเสียความรู้สึกที่ปลายมือปลายเท้า');
  if ((patient.lacParentUpperExtremity || patient.lacParentLowerExtremity) && !upperExtSigns.includes('vascular_cold_pale_hand') && !lowerExtSigns.includes('vascular_cold_pale_foot')) negList.push('ปลายมือปลายเท้าไม่ซีด ไม่เย็น คลำชีพจรส่วนปลายได้ดี');
  if (systemicSigns.includes('no_systemic_signs') || (systemicSigns.length > 0 && !systemicSigns.includes('dizziness_presyncope') && !systemicSigns.includes('palpitation_cold_sweat'))) negList.push('ไม่มีอาการหน้ามืด วูบ เหงื่อแตกตัวเย็น หรือสัญญาณภาวะช็อก');

  const hospLabel = {
    complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
    additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
    self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
    unspecified: 'ไม่ได้ระบุ'
  }[patient.hospRecordStatus] || 'ไม่ได้ระบุ';

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
  const redFlags = evaluateLacerationRedFlags(patient);

  const defaultRapid =
`[Chief Complaint (CC)]
บาดแผลฉีกขาด / มีเลือดออก (Laceration / Active Bleeding) เป็นมา ${durationStr}

[History of Present Illness (HPI)]
• สาเหตุและระยะเวลา: ${formatLacCauses(patient)} | เป็นมา ${durationStr}
• อาการนำก่อนเกิดเหตุ: ${formatLacProdrome(patient)}
• ตำแหน่งบาดเจ็บและชนิดการบาดเจ็บ: ${formatLacAnatomy(patient)}
• สถานะเลือดออกในขณะนี้: ${formatLacBleedingStatus(patient)}
• สิ่งปนเปื้อนในบาดแผล: ${formatLacContaminants(patient)}
• ระดับความปวดบริเวณแผล (Pain Score): ${painScoreStr}

• Pertinent Positives:
${posList.length > 0 ? posList.map(p => `  - ${p}`).join('\n') : '  - ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม'}

• Pertinent Negatives:
${negList.length > 0 ? negList.map(n => `  - ${n}`).join('\n') : '  - ผู้ป่วยไม่ได้ระบุคำตอบยืนยันในหมวดอาการร่วม'}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• ประวัติวัคซีนบาดทะยัก: ${formatLacTetanus(patient)}
• ประวัติยาละลายลิ่มเลือด/เลือดหยุดยาก: ${formatLacAntithrombotic(patient)}${(() => {
    const pregMap = { not_pregnant: 'ไม่ได้ตั้งครรภ์ / ประจำเดือนมาปกติ', suspected_or_missed: 'ขาดประจำเดือน / สงสัยอาจตั้งครรภ์', confirmed_pregnant: 'ยืนยันกำลังตั้งครรภ์', menopause_or_hysterectomy: 'วัยหมดประจำเดือน / ผ่าตัดมดลูกแล้ว', unknown: 'ไม่ทราบสถานะการตั้งครรภ์' };
    return (isLacFemalePatient(patient) && (patient.lacLmpDate || patient.lacPregnancyStatus)) ? `\n• ประวัติสตรี: LMP ${patient.lacLmpDate || 'ไม่ระบุ'} (${pregMap[patient.lacPregnancyStatus] || 'ไม่ได้ระบุ'})` : '';
  })()}
• โรคประจำตัว (U/D): ${udDisplay}
• ยาประจำตัว (Current Meds): ${medsText}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${allergyDisplay}

[Emergency Risk Assessment (Red Flags)]
${redFlags.length > 0
  ? `🚩 RED FLAGS DETECTED:\n${redFlags.map(rf => `  * ${rf.textTh}`).join('\n')}`
  : '✓ ไม่พบสัญญาณเตือนความรุนแรงวิกฤตเฉียบพลันเบื้องต้น'}

[Doctor's Clinical Addendum & Exam]
• บันทึกประวัติเพิ่มเติมหรือแก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}
• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}
• แผนการรักษาและคำสั่งการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

  return defaultRapid;
}

// --- Narrative Note Generator (Doctor View - Thai-Centric) ---
function renderLacerationNarrative(patient) {
  const durVal = patient.durationVal;
  const durUnitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durUnit = durUnitMap[patient.durationUnit] || 'ชั่วโมง';
  const durStr = durVal ? `${durVal} ${durUnit}` : 'ไม่ระบุระยะเวลา';

  const causeStr = formatLacCauses(patient);
  const anatStr = formatLacAnatomy(patient);
  const bleedStr = formatLacBleedingStatus(patient);
  const contStr = formatLacContaminants(patient);
  const tetStr = formatLacTetanus(patient);

  const genderLabel = (patient.gender && patient.gender !== 'ไม่ระบุ') ? patient.gender : '';
  let note = `ผู้ป่วย${genderLabel} อายุ ${patient.age || 'ไม่ระบุ'} ปี มารับการตรวจที่ห้องฉุกเฉินด้วยบาดแผลฉีกขาด / มีเลือดออก สาเหตุเกิดจาก${causeStr} เป็นมาประมาณ ${durStr} ก่อนมารพ. ตรวจพบตำแหน่งบาดเจ็บและชนิดการบาดเจ็บ: ${anatStr} สถานะเลือดออกคือ${bleedStr} สภาพแผลคือ${contStr}`;

  const headSigns = Array.isArray(patient.lacHeadSigns) ? patient.lacHeadSigns : [];
  const upperExtSigns = Array.isArray(patient.lacUpperExtSigns) ? patient.lacUpperExtSigns : [];
  const lowerExtSigns = Array.isArray(patient.lacLowerExtSigns) ? patient.lacLowerExtSigns : [];
  const systemicSigns = Array.isArray(patient.lacSystemicSigns) ? patient.lacSystemicSigns : [];

  const syms = [];
  if (patient.lacBleedingStatus === 'active_spurting') syms.push('เลือดพุ่งเป็นจังหวะตามชีพจร');
  if (headSigns.includes('loss_of_consciousness')) syms.push('มีสลบหมดสตินำมาก่อน');
  if (upperExtSigns.includes('tendon_deficit_hand') || lowerExtSigns.includes('tendon_bone_deficit_leg')) syms.push('ขยับเหยียดงอนิ้วไม่ได้');
  if (upperExtSigns.includes('nerve_numbness_hand') || lowerExtSigns.includes('nerve_numbness_foot')) syms.push('มีอาการชาปลายประสาท');
  if (upperExtSigns.includes('open_fracture_arm') || lowerExtSigns.includes('open_fracture_leg')) syms.push('กระดูกผิดรูปเห็นกระดูกโผล่');
  if (systemicSigns.includes('dizziness_presyncope') || systemicSigns.includes('palpitation_cold_sweat')) syms.push('มีหน้ามืดเหงื่อแตกตัวเย็น');

  if (syms.length > 0) {
    note += ` ร่วมกับมีอาการสำคัญ: ${syms.join(', ')}`;
  } else if (systemicSigns.includes('no_systemic_signs')) {
    note += ' ผู้ป่วยไม่มีอาการหน้ามืดเป็นลมหรือภาวะช็อก';
  }

  note += ` ประวัติวัคซีนบาดทะยัก: ${tetStr}`;
  if (isLacFemalePatient(patient) && (patient.lacLmpDate || patient.lacPregnancyStatus)) {
    const pregMap = { not_pregnant: 'ไม่ได้ตั้งครรภ์ / ประจำเดือนมาปกติ', suspected_or_missed: 'ขาดประจำเดือน / สงสัยอาจตั้งครรภ์', confirmed_pregnant: 'ยืนยันกำลังตั้งครรภ์', menopause_or_hysterectomy: 'วัยหมดประจำเดือน / ผ่าตัดมดลูกแล้ว', unknown: 'ไม่ทราบสถานะการตั้งครรภ์' };
    note += ` ประวัติสตรี: LMP ${patient.lacLmpDate || 'ไม่ระบุ'} (${pregMap[patient.lacPregnancyStatus] || 'ไม่ได้ระบุ'})`;
  }
  return note;
}

function renderLacerationDoctorHpi(patient) {
  return renderLacerationRapidHpi(patient);
}

// --- Output Dispatcher ---
function updateLacerationOutputs(rec) {
  if (!rec) return;
  const rapidText = renderLacerationRapidHpi(rec);
  const narrativeText = renderLacerationNarrative(rec);

  const rapidEl = document.getElementById('rapidTextView');
  const narrativeEl = document.getElementById('narrativeTextView');
  if (rapidEl) rapidEl.value = rec.custom_rapid_note || rapidText;
  if (narrativeEl) narrativeEl.value = rec.custom_narrative_note || narrativeText;

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
    rec.pertinentNegatives = [];
  }

  const redFlags = evaluateLacerationRedFlags(rec);
  rec.redFlags = redFlags;

  const jsonOutput = {
    encounter: {
      chief_complaint: 'laceration_bleeding',
      chief_complaint_title_th: 'บาดแผลฉีกขาด / มีเลือดออก',
      timestamp: rec.timestamp || new Date().toISOString(),
      duration_val: rec.durationVal || null,
      duration_unit: rec.durationUnit || 'hours'
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
      causes: Array.isArray(rec.lacCauses) ? rec.lacCauses : [],
      cause_sharp_detail: rec.lacCauseSharpDetail || '',
      cause_machinery_detail: rec.lacCauseMachineryDetail || '',
      cause_blunt_detail: rec.lacCauseBluntDetail || '',
      cause_puncture_detail: rec.lacCausePunctureDetail || '',
      cause_other_detail: rec.lacCauseOtherDetail || '',
      contaminants: Array.isArray(rec.lacContaminants) ? rec.lacContaminants : [],
      bleeding_status: rec.lacBleedingStatus || null,
      prodrome: rec.lacProdrome || null,
      prodrome_detail: rec.lacProdromeDetail || '',
      pain_score: rec.painScore,
      antithrombotic: rec.lacAntithrombotic || null,
      tetanus_history: rec.lacTetanusHx || null,
      anatomical_regions: {
        head_face: !!rec.lacParentHeadFace,
        neck: !!rec.lacParentNeck,
        chest: !!rec.lacParentChest,
        abdomen: !!rec.lacParentAbdomen,
        upper_extremity: !!rec.lacParentUpperExtremity,
        lower_extremity: !!rec.lacParentLowerExtremity,
        other: !!rec.lacParentOther,
        other_detail: rec.lacOtherLocationDetail || ''
      },
      fingers_digits: Array.isArray(rec.lacArmFingersDigits) ? rec.lacArmFingersDigits : [],
      fingers_left_digits: Array.isArray(rec.lacArmFingersLeftDigits) ? rec.lacArmFingersLeftDigits : [],
      fingers_right_digits: Array.isArray(rec.lacArmFingersRightDigits) ? rec.lacArmFingersRightDigits : [],
      toes_digits: Array.isArray(rec.lacLegToesDigits) ? rec.lacLegToesDigits : [],
      toes_left_digits: Array.isArray(rec.lacLegToesLeftDigits) ? rec.lacLegToesLeftDigits : [],
      toes_right_digits: Array.isArray(rec.lacLegToesRightDigits) ? rec.lacLegToesRightDigits : [],
      systemic_signs: Array.isArray(rec.lacSystemicSigns) ? rec.lacSystemicSigns : [],
      other_symptoms_free: rec.otherSymptomsFree || ''
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
  const jsonEl = document.getElementById('jsonViewer');
  if (jsonEl) jsonEl.textContent = JSON.stringify(jsonOutput, null, 2);
  return { rapid: rapidText, narrative: narrativeText, json: jsonOutput };
}

// --- Female LMP & Anatomy Helpers ---
function isLacFemalePatient(p) {
  if (!p) return false;
  if (p.gender === 'หญิง' || p.gender === 'female') return true;
  if (p.gender === 'ชาย' || p.gender === 'male') return false;
  return /นาง|น\.ส\.|ด\.ญ\.|\(หญิง\)|Mrs|Miss|Ms/i.test(`${p.patientTitle || ''} ${p.name || p.patientName || ''}`);
}
function toggleLacFemaleSection(forceShow) {
  const sec = document.getElementById('lacFemaleSection');
  if (!sec) return;
  const show = typeof forceShow === 'boolean' ? forceShow : sec.classList.contains('hidden');
  sec.classList.toggle('hidden', !show);
  if (!show) {
    const lmp = document.getElementById('lacLmpDate'); if (lmp) lmp.value = '';
    document.querySelectorAll('input[name="lacPregnancyStatus"]').forEach(r => { r.checked = false; });
  }
}
function checkAndDisplayLacLmp(patient) {
  if (patient && (patient.gender || patient.name || patient.patientName || patient.patientTitle)) {
    toggleLacFemaleSection(isLacFemalePatient(patient)); return;
  }
  const titleVal = document.getElementById('patientTitleSelect')?.value || '';
  toggleLacFemaleSection(/นาง|น\.ส\.|ด\.ญ\.|\(หญิง\)|Mrs|Miss|Ms/i.test(titleVal));
}
function renderLacPart(id, label, hasCenter = false) {
  return `<div class="p-2.5 rounded-xl border border-slate-200 bg-white">
  <label class="flex items-center cursor-pointer">
    <input type="checkbox" id="${id}" onchange="toggleLacGroup('${id}SidesContainer', this.checked)" class="text-medical-600 h-4 w-4 rounded flex-shrink-0">
    <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">${label}</span>
  </label>
  <div id="${id}SidesContainer" class="hidden mt-2 pl-6 flex flex-col gap-1.5 text-xs border-t border-slate-100 pt-2">
    <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
      <span class="text-[11px] font-semibold text-slate-500">ด้าน / ข้าง:</span>
      <label class="inline-flex items-center cursor-pointer"><input type="checkbox" name="${id}Sides" value="left" class="mr-1 text-medical-600 rounded"> ซ้าย</label>
      <label class="inline-flex items-center cursor-pointer"><input type="checkbox" name="${id}Sides" value="right" class="mr-1 text-medical-600 rounded"> ขวา</label>
      ${hasCenter ? `<label class="inline-flex items-center cursor-pointer"><input type="checkbox" name="${id}Sides" value="center" class="mr-1 text-medical-600 rounded"> ตรงกลาง</label>` : ''}
    </div>
    <div class="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 border-t border-slate-50">
      <span class="text-[11px] font-semibold text-slate-500">ลักษณะบาดเจ็บ:</span>
      <label class="inline-flex items-center cursor-pointer"><input type="checkbox" name="${id}Injuries" value="wound" class="mr-1 text-medical-600 rounded"> มีแผล</label>
      <label class="inline-flex items-center cursor-pointer"><input type="checkbox" name="${id}Injuries" value="pain_swelling" class="mr-1 text-medical-600 rounded"> ปวด/บวม</label>
      <label class="inline-flex items-center cursor-pointer"><input type="checkbox" name="${id}Injuries" value="deformity" class="mr-1 text-medical-600 rounded"> ผิดรูป</label>
    </div>
  </div>
</div>`;
}
function renderLacDigits(id, label) {
  const digits = [['thumb','โป้ง'],['index','ชี้'],['middle','กลาง'],['ring','นาง'],['little','ก้อย']];
  const row = (sideName, sideLabel) => `<div class="flex items-center flex-wrap gap-2"><span class="text-[11px] font-semibold text-slate-500 w-9">${sideLabel}:</span>${digits.map(([v,t]) => `<label class="inline-flex items-center cursor-pointer"><input type="checkbox" name="${id}${sideName}" value="${v}" class="mr-1 text-medical-600 rounded"> ${t}</label>`).join('')}</div>`;
  return `<div class="p-2.5 rounded-xl border border-slate-200 bg-white">
  <label class="flex items-center cursor-pointer">
    <input type="checkbox" id="${id}" onchange="toggleLacGroup('${id}SidesContainer', this.checked)" class="text-medical-600 h-4 w-4 rounded flex-shrink-0">
    <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">${label}</span>
  </label>
  <div id="${id}SidesContainer" class="hidden mt-2 pl-6 flex flex-col gap-1.5 text-xs border-t border-slate-100 pt-2">
    ${row('LeftDigits','ซ้าย')}${row('RightDigits','ขวา')}
    <div class="flex items-center flex-wrap gap-x-3 gap-y-1 pt-1 border-t border-slate-50">
      <span class="text-[11px] font-semibold text-slate-500">ลักษณะบาดเจ็บ:</span>
      <label class="inline-flex items-center cursor-pointer"><input type="checkbox" name="${id}Injuries" value="wound" class="mr-1 text-medical-600 rounded"> มีแผล</label>
      <label class="inline-flex items-center cursor-pointer"><input type="checkbox" name="${id}Injuries" value="pain_swelling" class="mr-1 text-medical-600 rounded"> ปวด/บวม</label>
      <label class="inline-flex items-center cursor-pointer"><input type="checkbox" name="${id}Injuries" value="deformity" class="mr-1 text-medical-600 rounded"> ผิดรูป</label>
    </div>
  </div>
</div>`;
}
function renderLacRegionBox({
  parentId,
  subGroupId,
  title,
  desc,
  partsHtml,
  signsName,
  signsNoneId,
  signsCols = 'grid-cols-1 sm:grid-cols-2',
  signs
}) {
  return `<div class="space-y-3">
    <label class="selectable-card flex items-center p-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 hover:border-medical-400 transition cursor-pointer">
      <input type="checkbox" id="${parentId}" onchange="toggleLacGroup('${subGroupId}', this.checked)" class="text-medical-600 focus:ring-medical-500 h-5 w-5 rounded flex-shrink-0">
      <div class="ml-3 leading-snug">
        <span class="text-sm font-bold text-slate-900">${Array.isArray(title) ? wrapLacWords(title) : title}</span>
        <p class="text-xs text-slate-500 mt-0.5">${desc}</p>
      </div>
    </label>
    <div id="${subGroupId}" class="hidden pl-4 sm:pl-6 space-y-4 border-l-2 border-medical-200">
      <div>
        <p class="text-xs text-slate-600 font-semibold mb-2">จุดที่บาดเจ็บ (เลือกแล้วระบุด้านและลักษณะบาดเจ็บ):</p>
        <div class="space-y-2">${partsHtml}</div>
      </div>
      <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
        ${renderLacSysHeader({
          label: 'อาการสำคัญที่พบร่วมด้วย (เลือกได้หลายข้อ)',
          icon: 'alert-circle',
          colorClass: 'bg-amber-100 text-amber-700',
          toggleId: signsNoneId,
          toggleLabel: 'ไม่มีอาการร่วม',
          toggleOnchange: `handleLacGroupNoneToggle(this, '${signsName}')`
        })}
        ${renderLacGrid(signsCols, signs, {
          name: signsName,
          compact: true,
          onchange: `handleLacGroupItemChange(this, '${signsNoneId}')`
        })}
      </div>
    </div>
  </div>`;
}

// --- Patient Form HTML Template ---
const LACERATION_FORM_HTML = `
<div id="cc-laceration-bleeding-section" class="hidden space-y-6">
  <div data-cc-top-banner="laceration_bleeding"><div class="flex flex-col gap-4">
  <!-- 💡 ส่วนต้น: ข้อแนะนำการห้ามเลือดและดูแลบาดแผลเบื้องต้นระหว่างรอตรวจ -->
  <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs sm:text-sm text-amber-900 shadow-sm flex items-start space-x-3">
    <div class="text-amber-600 mt-0.5 flex-shrink-0">
      <i data-lucide="info" class="w-5 h-5"></i>
    </div>
    <div class="space-y-1">
      <div class="font-bold text-amber-950">ข้อแนะนำระหว่างรอพบแพทย์:</div>
      <ul class="list-disc pl-4 space-y-1 text-amber-800 text-xs">
        <li><strong>หากยังมีเลือดออก:</strong> ใช้ผ้าสะอาดกดลงบนแผลโดยตรงให้แน่นต่อเนื่อง ไม่ควรเปิดผ้าดูบ่อย (เพราะจะทำให้ลิ่มเลือดที่กำลังแข็งตัวหลุดออก) หากชุ่มเลือดให้ใช้ผ้าใหม่ทับอีกชั้น</li>
        <li><strong>หากมีวัตถุปักคา:</strong> <strong>ห้ามดึงออกด้วยตนเองเด็ดขาด</strong> เพราะอาจทำให้เลือดทะลักรุนแรงขึ้น</li>
      </ul>
    </div>
  </div>
  </div></div>

  <!-- CARD 1: ข้อมูลเหตุการณ์ สาเหตุ และสถานะเลือดออก -->
  <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
    <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
        <i data-lucide="scissors" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900">1. ข้อมูลเหตุการณ์ สาเหตุ และสถานะเลือดออก</h2>
        <p class="text-xs text-slate-500">ระยะเวลา สาเหตุ สิ่งแปลกปลอม และสถานะเลือดออกในขณะนี้</p>
      </div>
    </div>

    <!-- 1.1 ระยะเวลาที่เกิดเหตุ / มีบาดแผล -->
    <div>
      <label class="block text-xs font-semibold text-slate-800 mb-1.5">
        1.1 เกิดบาดแผลมานานเท่าไรแล้ว <span class="text-rose-500">*</span>
      </label>
      <div class="flex items-center gap-2 max-w-sm">
        <input type="number" id="lacDurationVal" min="1" max="365" placeholder="เช่น 30"
          class="w-24 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white transition">
        <select id="lacDurationUnit"
          class="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white transition">
          <option value="minutes">นาที</option>
          <option value="hours" selected>ชั่วโมง</option>
          <option value="days">วัน</option>
          <option value="weeks">สัปดาห์</option>
          <option value="months">เดือน</option>
          <option value="years">ปี</option>
        </select>
      </div>
    </div>

    <!-- 1.2 สาเหตุที่ทำให้เกิดบาดแผล -->
    <div class="pt-3 border-t border-slate-100">
      <label class="block text-xs font-semibold text-slate-800 mb-2">
        1.2 สาเหตุของบาดแผล (เลือกได้หลายข้อ):
      </label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        ${renderLacCauseCard('sharp_object', ['ของมีคมบาด', '/ ทิ่มแทง'], 'มีด คัตเตอร์ เศษแก้ว สังกะสี', 'lacCauseSharpDetailContainer', 'lacCauseSharpDetail', 'พิมพ์ระบุ เช่น มีด, คัตเตอร์, เศษแก้ว...')}
        ${renderLacCauseCard('machinery_tools', ['เครื่องจักรกล', '/ อุปกรณ์ไฟฟ้า'], 'หินเจียร เลื่อย เครื่องตัดหญ้า', 'lacCauseMachineryDetailContainer', 'lacCauseMachineryDetail', 'พิมพ์ระบุ เช่น หินเจียร, เลื่อย, เครื่องตัดหญ้า...')}
        ${renderLacCauseCard('blunt_impact', ['ถูกกระแทก', 'ด้วยของแข็ง'], 'ถูกของแข็งกระแทกจนแผลแตก', 'lacCauseBluntDetailContainer', 'lacCauseBluntDetail', 'พิมพ์ระบุวัตถุหรือของแข็งที่มากระแทก...')}
        <div>
          ${renderLacOption({
            name: 'lacCauses',
            value: 'fall_collision',
            title: ['หกล้ม / ชนกระแทก'],
            desc: 'ล้มหรือชนจนเกิดแผลแตก'
          })}
        </div>
        ${renderLacCauseCard('puncture_wound', ['ถูกของแหลม', 'ทิ่มตำ'], 'ตะปู เสี้ยนไม้ หนาม ลวด', 'lacCausePunctureDetailContainer', 'lacCausePunctureDetail', 'พิมพ์ระบุ เช่น ตะปู, เสี้ยนไม้, หนาม, ลวด...')}
        ${renderLacCauseCard('other_cause', ['สาเหตุอื่นๆ'], 'ระบุสาเหตุอื่นเพิ่มเติม', 'lacCauseOtherDetailContainer', 'lacCauseOtherDetail', 'พิมพ์ระบุสาเหตุ...')}
      </div>
    </div>

    <!-- 1.3 สิ่งปนเปื้อน หรือสิ่งแปลกปลอมในบาดแผล -->
    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
      ${renderLacSysHeader({
        label: '1.3 สิ่งปนเปื้อนหรือวัตถุค้างในแผล (เลือกได้หลายข้อ)',
        icon: 'search',
        colorClass: 'bg-amber-100 text-amber-700',
        toggleId: 'lacContamNoneCb',
        toggleName: 'lacContaminants',
        toggleValue: 'clean_wound',
        toggleLabel: 'ไม่มีสิ่งแปลกปลอม',
        toggleOnchange: "handleLacGroupNoneToggle(this, 'lacContaminants')"
      })}
      ${renderLacGrid('grid-cols-1 sm:grid-cols-2', [
        {
          name: 'lacContaminants',
          value: 'foreign_body_retained',
          title: ['มีวัตถุหักคา', '/ ปักคาในแผล'],
          desc: 'เช่น เศษแก้ว เสี้ยนไม้ โลหะ',
          onchange: "handleLacGroupItemChange(this, 'lacContamNoneCb')",
          compact: true
        },
        {
          name: 'lacContaminants',
          value: 'dirty_contaminated',
          title: ['แผลเปื้อนดิน', 'สนิม น้ำสกปรก'],
          desc: 'รวมถึงเศษอาหารหรือมูลสัตว์',
          onchange: "handleLacGroupItemChange(this, 'lacContamNoneCb')",
          compact: true
        }
      ])}
    </div>

    <!-- 1.4 สถานะเลือดออกในขณะนี้ -->
    <div class="pt-3 border-t border-slate-100">
      <label class="block text-xs font-semibold text-slate-800 mb-2">
        1.4 สถานะเลือดออกในขณะนี้ <span class="text-rose-500">*</span>
      </label>
      ${renderLacGrid('grid-cols-1 sm:grid-cols-3', [
        {
          kind: 'radio',
          name: 'lacBleedingStatus',
          value: 'active_spurting',
          title: ['เลือดไหลพุ่ง', '/ ทะลัก'],
          desc: 'พุ่งตามชีพจร หรือกดแล้วชุ่มผ้าเร็ว',
          compact: true
        },
        {
          kind: 'radio',
          name: 'lacBleedingStatus',
          value: 'active_oozing',
          title: ['เลือดยังไหลซึม', 'ต่อเนื่อง'],
          desc: 'ยังไม่หยุดสนิท แต่ไม่พุ่งแรง',
          compact: true
        },
        {
          kind: 'radio',
          name: 'lacBleedingStatus',
          value: 'stopped',
          title: ['เลือดหยุดไหลแล้ว'],
          desc: 'หรือมีเพียงคราบเลือดซึมเล็กน้อย',
          compact: true
        }
      ])}
    </div>

    <!-- 1.5 อาการนำก่อนเกิดเหตุ -->
    <div class="pt-3 border-t border-slate-100">
      <label class="block text-xs font-semibold text-slate-800 mb-2">
        1.5 ก่อนเกิดเหตุ มีอาการผิดปกตินำมาก่อนหรือไม่
      </label>
      ${renderLacGrid('grid-cols-1 sm:grid-cols-2', [
        {
          kind: 'radio',
          name: 'lacProdrome',
          value: 'no_prodrome',
          title: ['ไม่มีอาการนำ'],
          desc: 'เกิดจากอุบัติเหตุโดยตรง',
          onchange: 'handleLacProdromeChange(this.value)',
          compact: true
        },
        {
          kind: 'radio',
          name: 'lacProdrome',
          value: 'has_prodrome',
          title: ['มีอาการนำ', 'ก่อนเกิดเหตุ'],
          desc: 'วูบ หน้ามืด เจ็บอก หรืออ่อนแรงนำมาก่อน',
          onchange: 'handleLacProdromeChange(this.value)',
          compact: true
        }
      ])}
      <div id="lacProdromeDetailContainer" class="hidden mt-2.5 pl-3 border-l-2 border-medical-200">
        <input type="text" id="lacProdromeDetail" placeholder="พิมพ์ระบุอาการนำก่อนเกิดเหตุ เช่น วูบ หน้ามืด เจ็บหน้าอก แขนขาอ่อนแรง..."
          class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-slate-900 text-xs focus:ring-2 focus:ring-medical-500 focus:bg-white">
      </div>
    </div>
  </div>

  <!-- CARD 2: ตำแหน่งและอาการบาดเจ็บร่วม (6 Anatomical Regions) -->
  <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
        <i data-lucide="user-check" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900">2. ตำแหน่งและอาการบาดเจ็บร่วม</h2>
        <p class="text-xs text-slate-500">เลือกเฉพาะส่วนที่มีแผล ระบบจะเปิดช่องระบุด้านและอาการร่วมให้อัตโนมัติ</p>
      </div>
    </div>

    <div class="space-y-4">
      ${renderLacRegionBox({
        parentId: 'lacParentHeadFace',
        subGroupId: 'lacHeadSubGroup',
        title: ['2.1 ศีรษะ ใบหน้า', 'ดวงตา หรือในปาก'],
        desc: 'หนังศีรษะ หน้าผาก คิ้ว แก้ม คาง ตา หู จมูก ริมฝีปาก',
        partsHtml: [
          renderLacPart('lacHeadScalp', 'หนังศีรษะ / หน้าผาก / ท้ายทอย', true),
          renderLacPart('lacHeadFace', 'ใบหน้า / คิ้ว / แก้ม / คาง', true),
          renderLacPart('lacHeadEye', 'ดวงตา / เปลือกตา', false),
          renderLacPart('lacHeadEar', 'ใบหู', false),
          renderLacPart('lacHeadNoseMouth', 'จมูก / ริมฝีปาก / ลิ้น / ในช่องปาก', true)
        ].join(''),
        signsName: 'lacHeadSigns',
        signsNoneId: 'lacHeadSignsNoneCb',
        signs: [
          { value: 'loss_of_consciousness', title: ['สลบ หมดสติ', 'จำเหตุการณ์ไม่ได้'] },
          { value: 'severe_headache_vomit', title: ['ปวดศีรษะรุนแรง', 'สับสน / อาเจียน'] },
          { value: 'vision_problem_eye_injury', title: ['ตาพร่า ภาพซ้อน', 'หรือแผลถูกตาโดยตรง'] },
          { value: 'csf_leak_ear_nose', title: ['เลือดหรือน้ำใส', 'ออกหู / จมูก'] }
        ]
      })}

      ${renderLacRegionBox({
        parentId: 'lacParentNeck',
        subGroupId: 'lacNeckSubGroup',
        title: ['2.2 ลำคอ หรือต้นคอ'],
        desc: 'คอด้านหน้า ด้านข้าง หรือต้นคอด้านหลัง',
        partsHtml: [
          renderLacPart('lacNeckFront', 'ลำคอด้านหน้า', true),
          renderLacPart('lacNeckSide', 'ลำคอด้านข้าง', false),
          renderLacPart('lacNeckBack', 'ต้นคอด้านหลัง', true)
        ].join(''),
        signsName: 'lacNeckSigns',
        signsNoneId: 'lacNeckSignsNoneCb',
        signsCols: 'grid-cols-1 sm:grid-cols-3',
        signs: [
          { value: 'airway_dyspnea_stridor', title: ['หายใจ / กลืนลำบาก', 'เสียงแหบ / ลมออกคอ'] },
          { value: 'expanding_neck_mass', title: ['ก้อนที่คอบวมโต', 'ขึ้นอย่างรวดเร็ว'] },
          { value: 'neck_pain_radiculopathy', title: ['ปวดตึงต้นคอ', 'ชา/อ่อนแรงแขนขา'] }
        ]
      })}

      ${renderLacRegionBox({
        parentId: 'lacParentChest',
        subGroupId: 'lacChestSubGroup',
        title: ['2.3 หน้าอก ซี่โครง', 'หรือหลังส่วนบน'],
        desc: 'ทรวงอก ชายโครง สะบัก หรือแผ่นหลังช่วงบน',
        partsHtml: [
          renderLacPart('lacChestRibs', 'หน้าอก / ซี่โครง', true),
          renderLacPart('lacChestUpperBack', 'หลังส่วนบน / สะบัก', true)
        ].join(''),
        signsName: 'lacChestSigns',
        signsNoneId: 'lacChestSignsNoneCb',
        signs: [
          { value: 'dyspnea_pleuritic_pain', title: ['หอบเหนื่อย', 'แน่นหน้าอก'], desc: 'หรือเจ็บแปล๊บเวลาหายใจเข้าลึก' },
          { value: 'sucking_chest_wound', title: ['แผลลึกมีลมดูด', 'เข้า-ออกหน้าอก'], desc: 'มีฟองอากาศหรือเสียงลมออกทางแผล' }
        ]
      })}

      ${renderLacRegionBox({
        parentId: 'lacParentAbdomen',
        subGroupId: 'lacAbdomenSubGroup',
        title: ['2.4 ช่องท้อง', 'หลังล่าง สะโพก', 'หรืออวัยวะเพศ'],
        desc: 'หน้าท้อง สีข้าง เอว หลังล่าง ก้น ขาหนีบ',
        partsHtml: [
          renderLacPart('lacAbdWall', 'หน้าท้อง', true),
          renderLacPart('lacAbdFlank', 'สีข้าง / บั้นเอว', false),
          renderLacPart('lacAbdLowerBack', 'หลังส่วนล่าง', true),
          renderLacPart('lacAbdButtock', 'ก้น / สะโพก', true),
          renderLacPart('lacAbdGenitalia', 'ขาหนีบ / อวัยวะเพศ', true)
        ].join(''),
        signsName: 'lacAbdomenSigns',
        signsNoneId: 'lacAbdomenSignsNoneCb',
        signsCols: 'grid-cols-1 sm:grid-cols-3',
        signs: [
          { value: 'severe_abd_pain_rigid', title: ['ปวดท้องรุนแรง', 'หน้าท้องแข็งตึง'] },
          { value: 'evisceration_internal_organ', title: ['มีเนื้อเยื่อ', '/ อวัยวะโผล่ออก'] },
          { value: 'urinary_symptoms_hematuria', title: ['ปัสสาวะไม่ออก', '/ ปัสสาวะเป็นเลือด'] }
        ]
      })}

      ${renderLacRegionBox({
        parentId: 'lacParentUpperExtremity',
        subGroupId: 'lacUpperExtSubGroup',
        title: ['2.5 ไหล่ แขน ข้อมือ', 'หรือมือ/นิ้วมือ'],
        desc: 'ต้นแขน ข้อศอก แขนท่อนล่าง ฝ่ามือ หรือนิ้วมือ',
        partsHtml: [
          renderLacPart('lacArmShoulder', 'ไหล่ / รักแร้ / ต้นแขน', false),
          renderLacPart('lacArmElbow', 'ข้อศอก / แขนท่อนล่าง', false),
          renderLacPart('lacArmWrist', 'ข้อมือ / ฝ่ามือ / หลังมือ', false),
          renderLacDigits('lacArmFingers', 'นิ้วมือ')
        ].join(''),
        signsName: 'lacUpperExtSigns',
        signsNoneId: 'lacUpperExtSignsNoneCb',
        signs: [
          { value: 'tendon_deficit_hand', title: ['งอ / เหยียดนิ้ว', 'หรือข้อมือไม่ได้'] },
          { value: 'nerve_numbness_hand', title: ['ชา ไร้ความรู้สึก', 'ปลายนิ้ว / ฝ่ามือ'] },
          { value: 'vascular_cold_pale_hand', title: ['ปลายนิ้วซีดขาว', 'เย็นเฉียบ / คล้ำ'] },
          { value: 'open_fracture_arm', title: ['แขน มือ นิ้วผิดรูป', 'หรือเห็นกระดูก'] },
          { value: 'amputation_hand', title: ['นิ้วมือ มือ หรือแขน', 'ขาดออกจากกัน'], colSpan2: true }
        ]
      })}

      ${renderLacRegionBox({
        parentId: 'lacParentLowerExtremity',
        subGroupId: 'lacLowerExtSubGroup',
        title: ['2.6 ต้นขา เข่า', 'ข้อเท้า', 'หรือเท้า / นิ้วเท้า'],
        desc: 'ต้นขา เข่า หน้าแข้ง น่อง ข้อเท้า ฝ่าเท้า หรือนิ้วเท้า',
        partsHtml: [
          renderLacPart('lacLegThigh', 'ต้นขา', false),
          renderLacPart('lacLegKneeShin', 'เข่า / หน้าแข้ง / น่อง', false),
          renderLacPart('lacLegAnkleFoot', 'ข้อเท้า / ส้นเท้า / ฝ่าเท้า', false),
          renderLacDigits('lacLegToes', 'นิ้วเท้า')
        ].join(''),
        signsName: 'lacLowerExtSigns',
        signsNoneId: 'lacLowerExtSignsNoneCb',
        signs: [
          { value: 'tendon_bone_deficit_leg', title: ['เดินลงน้ำหนักไม่ได้', 'ขยับเท้าไม่ได้'] },
          { value: 'nerve_numbness_foot', title: ['ชา ไร้ความรู้สึก', 'ที่เท้า / นิ้วเท้า'] },
          { value: 'vascular_cold_pale_foot', title: ['ปลายเท้าซีดขาว', 'เย็นเฉียบ / คล้ำ'] },
          { value: 'open_fracture_leg', title: ['ขา เท้า นิ้วผิดรูป', 'หรือเห็นกระดูก'] },
          { value: 'amputation_leg', title: ['นิ้วเท้า เท้า', 'หรือขาขาดจากกัน'], colSpan2: true }
        ]
      })}

      <!-- 2.7 บาดแผลที่ตำแหน่งอื่นๆ (พิมพ์ระบุ) -->
      <div class="border border-slate-200 rounded-2xl p-3.5 bg-slate-50/50">
        <label class="selectable-card flex items-center cursor-pointer">
          <input type="checkbox" id="lacParentOther" onchange="toggleLacGroup('lacOtherSubGroup', this.checked)" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
          <span class="ml-3 text-xs sm:text-sm font-bold text-slate-900">2.7 บาดแผลที่ตำแหน่งอื่นๆ (พิมพ์ระบุ)</span>
        </label>
        <div id="lacOtherSubGroup" class="hidden mt-3 pl-6 border-l-2 border-medical-200 space-y-2">
          <label class="text-xs font-semibold text-slate-600 block">ระบุตำแหน่งบาดแผลเพิ่มเติม:</label>
          <input type="text" id="lacOtherLocationDetail" placeholder="เช่น รักแร้, ซอกคอ, ก้นกบ..." class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500">
        </div>
      </div>
    </div>
  </div>

  <!-- CARD 3: อาการผิดปกติของร่างกาย และระดับความปวด -->
  <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
    <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
        <i data-lucide="activity" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900">3. อาการผิดปกติของร่างกาย และระดับความปวด</h2>
        <p class="text-xs text-slate-500">คัดกรองอาการหน้ามืดช็อกและการประเมินความเจ็บปวด</p>
      </div>
    </div>

    <!-- 3.1 อาการผิดปกติของร่างกาย -->
    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
      ${renderLacSysHeader({
        label: '3.1 อาการผิดปกติของร่างกายที่พบร่วม (เลือกได้หลายข้อ)',
        icon: 'shield-alert',
        colorClass: 'bg-rose-100 text-rose-700',
        toggleId: 'lacSystemicNoneCb',
        toggleName: 'lacSystemicSigns',
        toggleValue: 'no_systemic_signs',
        toggleLabel: 'ไม่มีอาการในหมวดนี้',
        toggleOnchange: "handleLacGroupNoneToggle(this, 'lacSystemicSigns')"
      })}
      ${renderLacGrid('grid-cols-1 sm:grid-cols-2', [
        {
          name: 'lacSystemicSigns',
          value: 'dizziness_presyncope',
          title: ['หน้ามืด เวียนหัว', 'เหมือนจะเป็นลม'],
          onchange: "handleLacGroupItemChange(this, 'lacSystemicNoneCb')",
          compact: true
        },
        {
          name: 'lacSystemicSigns',
          value: 'palpitation_cold_sweat',
          title: ['ใจสั่น เหงื่อแตก', 'ตัวเย็น / หน้าซีด'],
          onchange: "handleLacGroupItemChange(this, 'lacSystemicNoneCb')",
          compact: true
        },
        {
          name: 'lacSystemicSigns',
          value: 'excessive_thirst_weakness',
          title: ['กระหายน้ำมาก', 'อ่อนเพลียไม่มีแรง'],
          onchange: "handleLacGroupItemChange(this, 'lacSystemicNoneCb')",
          compact: true
        },
        {
          name: 'lacSystemicSigns',
          value: 'infection_signs_fever_pus',
          title: ['มีไข้ หนาวสั่น', 'แผลบวมแดง / หนอง'],
          desc: 'กรณีแผลเป็นมาหลายวัน',
          onchange: "handleLacGroupItemChange(this, 'lacSystemicNoneCb')",
          compact: true
        }
      ])}
    </div>

    <!-- 3.2 ระดับความปวดบริเวณบาดแผล -->
    <div class="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label class="block text-xs font-semibold text-slate-800 uppercase tracking-wider">3.2 ระดับความปวดบริเวณบาดแผลในขณะนี้ (0 – 10)</label>
        <div class="flex items-center space-x-2">
          <span id="lacPainScoreBadge" class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all">
            <span id="lacPainScoreEmoji" class="text-base">⚪</span>
            <span id="lacPainScoreText">ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)</span>
          </span>
          <button type="button" id="lacPainScoreClearBtn" onclick="clearLacPainScore()" class="text-xs text-slate-400 hover:text-rose-600 underline hidden transition" title="ล้างค่าเพื่อให้เป็นไม่ได้ระบุ">ล้างค่า</button>
        </div>
      </div>
      <div class="px-1 pt-1">
        <input type="range" id="lacPainScore" min="0" max="10" value="0" step="1" oninput="handleLacPainScoreChange(this.value)" class="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-600 focus:outline-none focus:ring-2 focus:ring-medical-500">
      </div>
      <div class="grid grid-cols-5 text-center text-[10px] sm:text-[11px] pt-1 gap-1 text-slate-500 font-medium">
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setLacPainScore(0)"><span class="text-lg sm:text-xl block">😊</span><span>0: สบายดี</span></div>
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setLacPainScore(2)"><span class="text-lg sm:text-xl block">🙂</span><span>1–3: เล็กน้อย</span></div>
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setLacPainScore(5)"><span class="text-lg sm:text-xl block">😐</span><span>4–6: ปานกลาง</span></div>
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setLacPainScore(8)"><span class="text-lg sm:text-xl block">😣</span><span>7–9: ปวดมาก</span></div>
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setLacPainScore(10)"><span class="text-lg sm:text-xl block">😭</span><span>10: ปวดที่สุด</span></div>
      </div>
    </div>
  </div>

  <!-- CARD 4: ประวัติยาละลายลิ่มเลือด วัคซีนบาดทะยัก และข้อมูลสตรี -->
  <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
    <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
        <i data-lucide="shield-plus" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900">4. ประวัติยาละลายลิ่มเลือด และวัคซีนป้องกันโรคบาดทะยัก</h2>
        <p class="text-xs text-slate-500">ประเมินความเสี่ยงเลือดหยุดยากและประวัติวัคซีนบาดทะยัก</p>
      </div>
    </div>

    <!-- 4.1 ประวัติการใช้ยาละลายลิ่มเลือด -->
    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
      ${renderLacSysHeader({
        label: '4.1 ยาละลายลิ่มเลือด หรือโรคเลือดหยุดยาก',
        icon: 'pill',
        colorClass: 'bg-blue-100 text-blue-700',
        toggleKind: 'radio',
        toggleId: 'lacAntithromboticNoneRb',
        toggleName: 'lacAntithrombotic',
        toggleValue: 'no_antithrombotic',
        toggleLabel: 'ไม่มี / ไม่ได้ใช้'
      })}
      ${renderLacGrid('grid-cols-1 sm:grid-cols-3', [
        {
          kind: 'radio',
          name: 'lacAntithrombotic',
          value: 'on_anticoagulant_antiplatelet',
          title: ['ใช้ยาละลายลิ่มเลือด', '/ ต้านเกล็ดเลือด'],
          desc: 'เช่น วาร์ฟาริน แอสไพริน',
          compact: true
        },
        {
          kind: 'radio',
          name: 'lacAntithrombotic',
          value: 'bleeding_disorder',
          title: ['มีโรคเลือดออกง่าย', '/ หยุดยาก'],
          desc: 'เช่น ตับแข็ง เกล็ดเลือดต่ำ',
          compact: true
        },
        {
          kind: 'radio',
          name: 'lacAntithrombotic',
          value: 'unknown_meds',
          title: ['กินยาประจำตัว', 'แต่ไม่ทราบชื่อยา'],
          desc: 'จำชื่อยาไม่ได้',
          compact: true
        }
      ])}
    </div>

    <!-- 4.2 ประวัติการได้รับวัคซีนป้องกันบาดทะยัก -->
    <div class="pt-3 border-t border-slate-100">
      <label class="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
        4.2 ประวัติการได้รับวัคซีนป้องกันบาดทะยัก
      </label>
      ${renderLacGrid('grid-cols-1 sm:grid-cols-2', [
        {
          kind: 'radio',
          name: 'lacTetanusHx',
          value: 'within_5_years',
          title: ['ฉีดกระตุ้น', 'ภายใน 5 ปี'],
          desc: 'เคยฉีดครบ (3 เข็ม) มาก่อน และเข็มสุดท้ายหรือกระตุ้นไม่เกิน 5 ปี',
          compact: true
        },
        {
          kind: 'radio',
          name: 'lacTetanusHx',
          value: '5_to_10_years',
          title: ['ฉีดล่าสุด', '5–10 ปีก่อน'],
          desc: 'เคยฉีดครบ (3 เข็ม) มาก่อน และเข็มสุดท้ายหรือกระตุ้นอยู่ในช่วง 5–10 ปี',
          compact: true
        },
        {
          kind: 'radio',
          name: 'lacTetanusHx',
          value: 'more_than_10_years',
          title: ['ฉีดครบ', 'เกิน 10 ปีแล้ว'],
          desc: 'เคยฉีดครบ (3 เข็ม) มาก่อน แต่เข็มสุดท้ายนานเกิน 10 ปีแล้ว',
          compact: true
        },
        {
          kind: 'radio',
          name: 'lacTetanusHx',
          value: 'never_or_unsure',
          title: ['ไม่เคยฉีด', '/ จำไม่ได้'],
          desc: 'ไม่เคยได้รับวัคซีนบาดทะยัก ฉีดไม่ครบ 3 เข็ม หรือไม่ทราบประวัติ',
          compact: true
        }
      ])}
    </div>

    <!-- 4.3 เฉพาะสตรี: ประจำเดือนและการตั้งครรภ์ -->
    <div id="lacFemaleSection" class="hidden pt-3 border-t border-slate-100">
      <div class="p-3.5 bg-pink-50/40 rounded-xl border border-pink-100 space-y-3">
        ${renderLacSysHeader({
          label: '4.3 ประจำเดือนและการตั้งครรภ์ (เฉพาะสตรี)',
          icon: 'heart-pulse',
          colorClass: 'bg-pink-100 text-pink-700',
          toggleKind: 'radio',
          toggleId: 'lacPregNotPregRb',
          toggleName: 'lacPregnancyStatus',
          toggleValue: 'not_pregnant',
          toggleLabel: 'ไม่ได้ตั้งครรภ์'
        })}
        ${renderLacGrid('grid-cols-1 sm:grid-cols-2', [
          { kind: 'radio', name: 'lacPregnancyStatus', value: 'suspected_or_missed', title: ['ขาดประจำเดือน', '/ สงสัยตั้งครรภ์'], compact: true },
          { kind: 'radio', name: 'lacPregnancyStatus', value: 'confirmed_pregnant', title: ['ยืนยัน', 'กำลังตั้งครรภ์'], compact: true },
          { kind: 'radio', name: 'lacPregnancyStatus', value: 'menopause_or_hysterectomy', title: ['หมดประจำเดือน', '/ ผ่าตัดมดลูกแล้ว'], compact: true },
          { kind: 'radio', name: 'lacPregnancyStatus', value: 'unknown', title: ['ไม่ทราบ'], compact: true }
        ])}
        <div class="max-w-xs">
          <label class="block text-[11px] font-semibold text-slate-700 mb-1">วันแรกของประจำเดือนครั้งล่าสุด (ถ้าจำได้):</label>
          <input type="text" id="lacLmpDate" data-universal-date="true" placeholder="วว/ดด/ปปปป เช่น 28/10/2026" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
        </div>
      </div>
    </div>
  </div>

  <!-- อาการอื่นๆ เป็นช่องกรอกอิสระ -->
  <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100">
      <div class="bg-slate-100 text-slate-600 p-2 rounded-xl"><i data-lucide="message-square-plus" class="w-5 h-5"></i></div>
      <div><h2 class="text-base font-bold text-slate-800">อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2><p class="text-xs text-slate-500">ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)</p></div>
    </div>
    <textarea id="laceration_bleeding_other_free" rows="2" placeholder="พิมพ์ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"></textarea>
  </div>
</div>
`;

// --- Master Module Definition ---
const lacerationBleedingModule = {
  id: 'laceration_bleeding',
  recordCc: 'laceration_bleeding',
  titleTh: 'บาดแผลฉีกขาด / มีเลือดออก',
  titleEn: 'Laceration / Active bleeding',
  icon: 'bandage',
  doctorCcBadgeHtml: '<i data-lucide="bandage" class="w-3.5 h-3.5 mr-1 text-rose-500"></i> CC: บาดแผลฉีกขาด / มีเลือดออก (Laceration & Bleeding)',
  pmhSectionNumber: 5,
  dateFields: ['lacLmpDate'],
  algorithm: 'laceration-bleeding-protocol',
  sectionDomId: 'cc-laceration-bleeding-section',
  formHtml: LACERATION_FORM_HTML,

  init: function() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  },

  collectIntake: function(ctx = {}) {
    const durVal = parseInt(document.getElementById('lacDurationVal')?.value, 10);
    const durUnit = document.getElementById('lacDurationUnit')?.value || 'hours';

    const getRadio = (name) => {
      const el = document.querySelector(`input[name="${name}"]:checked`);
      return el ? el.value : null;
    };
    const getChecks = (name) => {
      return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(el => el.value);
    };

    const causes = getChecks('lacCauses');
    const causeSharpDetail = document.getElementById('lacCauseSharpDetail')?.value?.trim() || '';
    const causeMachineryDetail = document.getElementById('lacCauseMachineryDetail')?.value?.trim() || '';
    const causeBluntDetail = document.getElementById('lacCauseBluntDetail')?.value?.trim() || '';
    const causePunctureDetail = document.getElementById('lacCausePunctureDetail')?.value?.trim() || '';
    const causeOtherDetail = document.getElementById('lacCauseOtherDetail')?.value?.trim() || '';

    const contaminants = getChecks('lacContaminants');
    const bleedingStatus = getRadio('lacBleedingStatus');
    const prodrome = getRadio('lacProdrome');
    const prodromeDetail = (prodrome === 'has_prodrome') ? (document.getElementById('lacProdromeDetail')?.value?.trim() || '') : '';

    // Anatomical regions, side & injury selections
    const getSubState = (parentActive, elId, sidesName) => {
      const active = parentActive && (document.getElementById(elId)?.checked || false);
      return { active, sides: active ? getChecks(sidesName) : [], injuries: active ? getChecks(elId + 'Injuries') : [] };
    };

    const parentHeadFace = document.getElementById('lacParentHeadFace')?.checked || false;
    const sScalp = getSubState(parentHeadFace, 'lacHeadScalp', 'lacHeadScalpSides');
    const sFace = getSubState(parentHeadFace, 'lacHeadFace', 'lacHeadFaceSides');
    const sEye = getSubState(parentHeadFace, 'lacHeadEye', 'lacHeadEyeSides');
    const sEar = getSubState(parentHeadFace, 'lacHeadEar', 'lacHeadEarSides');
    const sNoseMouth = getSubState(parentHeadFace, 'lacHeadNoseMouth', 'lacHeadNoseMouthSides');
    const headSigns = parentHeadFace ? getChecks('lacHeadSigns') : [];

    const parentNeck = document.getElementById('lacParentNeck')?.checked || false;
    const sNeckFront = getSubState(parentNeck, 'lacNeckFront', 'lacNeckFrontSides');
    const sNeckSide = getSubState(parentNeck, 'lacNeckSide', 'lacNeckSideSides');
    const sNeckBack = getSubState(parentNeck, 'lacNeckBack', 'lacNeckBackSides');
    const neckSigns = parentNeck ? getChecks('lacNeckSigns') : [];

    const parentChest = document.getElementById('lacParentChest')?.checked || false;
    const sChestRibs = getSubState(parentChest, 'lacChestRibs', 'lacChestRibsSides');
    const sChestUpperBack = getSubState(parentChest, 'lacChestUpperBack', 'lacChestUpperBackSides');
    const chestSigns = parentChest ? getChecks('lacChestSigns') : [];

    const parentAbdomen = document.getElementById('lacParentAbdomen')?.checked || false;
    const sAbdWall = getSubState(parentAbdomen, 'lacAbdWall', 'lacAbdWallSides');
    const sAbdFlank = getSubState(parentAbdomen, 'lacAbdFlank', 'lacAbdFlankSides');
    const sAbdLowerBack = getSubState(parentAbdomen, 'lacAbdLowerBack', 'lacAbdLowerBackSides');
    const sAbdButtock = getSubState(parentAbdomen, 'lacAbdButtock', 'lacAbdButtockSides');
    const sAbdGenitalia = getSubState(parentAbdomen, 'lacAbdGenitalia', 'lacAbdGenitaliaSides');
    const abdomenSigns = parentAbdomen ? getChecks('lacAbdomenSigns') : [];

    const parentUpperExt = document.getElementById('lacParentUpperExtremity')?.checked || false;
    const sArmShoulder = getSubState(parentUpperExt, 'lacArmShoulder', 'lacArmShoulderSides');
    const sArmElbow = getSubState(parentUpperExt, 'lacArmElbow', 'lacArmElbowSides');
    const sArmWrist = getSubState(parentUpperExt, 'lacArmWrist', 'lacArmWristSides');
    const isArmFingers = parentUpperExt && !!document.getElementById('lacArmFingers')?.checked;
    const armFingersLeftDigits = isArmFingers ? getChecks('lacArmFingersLeftDigits') : [];
    const armFingersRightDigits = isArmFingers ? getChecks('lacArmFingersRightDigits') : [];
    const armFingersSides = [];
    if (armFingersLeftDigits.length > 0) armFingersSides.push('left');
    if (armFingersRightDigits.length > 0) armFingersSides.push('right');
    const armFingersDigits = [...new Set([...armFingersLeftDigits, ...armFingersRightDigits])];
    const armFingersInjuries = isArmFingers ? getChecks('lacArmFingersInjuries') : [];
    const upperExtSigns = parentUpperExt ? getChecks('lacUpperExtSigns') : [];

    const parentLowerExt = document.getElementById('lacParentLowerExtremity')?.checked || false;
    const sLegThigh = getSubState(parentLowerExt, 'lacLegThigh', 'lacLegThighSides');
    const sLegKneeShin = getSubState(parentLowerExt, 'lacLegKneeShin', 'lacLegKneeShinSides');
    const sLegAnkleFoot = getSubState(parentLowerExt, 'lacLegAnkleFoot', 'lacLegAnkleFootSides');
    const isLegToes = parentLowerExt && !!document.getElementById('lacLegToes')?.checked;
    const legToesLeftDigits = isLegToes ? getChecks('lacLegToesLeftDigits') : [];
    const legToesRightDigits = isLegToes ? getChecks('lacLegToesRightDigits') : [];
    const legToesSides = [];
    if (legToesLeftDigits.length > 0) legToesSides.push('left');
    if (legToesRightDigits.length > 0) legToesSides.push('right');
    const legToesDigits = [...new Set([...legToesLeftDigits, ...legToesRightDigits])];
    const legToesInjuries = isLegToes ? getChecks('lacLegToesInjuries') : [];
    const lowerExtSigns = parentLowerExt ? getChecks('lacLowerExtSigns') : [];

    const parentOther = document.getElementById('lacParentOther')?.checked || false;
    const otherLocationDetail = parentOther ? (document.getElementById('lacOtherLocationDetail')?.value?.trim() || '') : '';

    const systemicSigns = getChecks('lacSystemicSigns');
    const painScore = lacPainScoreTouched ? parseInt(document.getElementById('lacPainScore')?.value || 0, 10) : null;
    const antithrombotic = getRadio('lacAntithrombotic');
    const tetanusHx = getRadio('lacTetanusHx');

    const titleSelVal = document.getElementById('patientTitleSelect')?.value || '';
    const isFemale = ctx.gender ? isLacFemalePatient(ctx) : (titleSelVal ? /นาง|น\.ส\.|ด\.ญ\.|\(หญิง\)|Mrs|Miss|Ms/i.test(titleSelVal) : isLacFemalePatient(ctx));
    const lacLmpDate = isFemale ? (document.getElementById('lacLmpDate')?.value?.trim() || '') : '';
    const lacPregnancyStatus = isFemale ? (getRadio('lacPregnancyStatus') || '') : '';
    const otherSymptomsFree = document.getElementById('laceration_bleeding_other_free')?.value?.trim() || ctx.otherSymptomsFree || '';

    const rec = {
      id: ctx.recordId || ctx.id,
      queue_number: ctx.queueNumber || ctx.queue_number,
      hn: ctx.randomHn || ctx.hn,
      name: ctx.patientName || ctx.name,
      age: ctx.patientAge !== undefined ? ctx.patientAge : ctx.age,
      gender: ctx.gender,
      chief_complaint: 'laceration_bleeding',
      chief_complaint_title: 'บาดแผลฉีกขาด / มีเลือดออก',
      timestamp: new Date().toISOString(),
      status: ctx.recordStatus || ctx.status || 'waiting',
      durationVal: !isNaN(durVal) ? durVal : null,
      durationUnit: durUnit,
      hospRecordStatus: ctx.hospRecordStatus || '',
      underlying: ctx.underlying || [],
      drugAllergy: ctx.drugAllergy || 'ไม่ได้ระบุ',
      currentMeds: ctx.currentMeds || 'ไม่ได้ระบุ',
      otherSymptomsFree,
      doctor_notes: ctx.preservedDoctorNotes || ctx.doctor_notes || { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },

      lacCauses: causes,
      lacCauseSharpDetail: causeSharpDetail,
      lacCauseMachineryDetail: causeMachineryDetail,
      lacCauseBluntDetail: causeBluntDetail,
      lacCausePunctureDetail: causePunctureDetail,
      lacCauseOtherDetail: causeOtherDetail,
      lacContaminants: contaminants,
      lacBleedingStatus: bleedingStatus,
      lacProdrome: prodrome,
      lacProdromeDetail: prodromeDetail,

      lacParentHeadFace: parentHeadFace,
      lacHeadScalp: sScalp.active,
      lacHeadScalpSides: sScalp.sides, lacHeadScalpInjuries: sScalp.injuries,
      lacHeadFace: sFace.active,
      lacHeadFaceSides: sFace.sides, lacHeadFaceInjuries: sFace.injuries,
      lacHeadEye: sEye.active,
      lacHeadEyeSides: sEye.sides, lacHeadEyeInjuries: sEye.injuries,
      lacHeadEar: sEar.active,
      lacHeadEarSides: sEar.sides, lacHeadEarInjuries: sEar.injuries,
      lacHeadNoseMouth: sNoseMouth.active,
      lacHeadNoseMouthSides: sNoseMouth.sides, lacHeadNoseMouthInjuries: sNoseMouth.injuries,
      lacHeadSigns: headSigns,

      lacParentNeck: parentNeck,
      lacNeckFront: sNeckFront.active,
      lacNeckFrontSides: sNeckFront.sides, lacNeckFrontInjuries: sNeckFront.injuries,
      lacNeckSide: sNeckSide.active,
      lacNeckSideSides: sNeckSide.sides, lacNeckSideInjuries: sNeckSide.injuries,
      lacNeckBack: sNeckBack.active,
      lacNeckBackSides: sNeckBack.sides, lacNeckBackInjuries: sNeckBack.injuries,
      lacNeckSigns: neckSigns,

      lacParentChest: parentChest,
      lacChestRibs: sChestRibs.active,
      lacChestRibsSides: sChestRibs.sides, lacChestRibsInjuries: sChestRibs.injuries,
      lacChestUpperBack: sChestUpperBack.active,
      lacChestUpperBackSides: sChestUpperBack.sides, lacChestUpperBackInjuries: sChestUpperBack.injuries,
      lacChestSigns: chestSigns,

      lacParentAbdomen: parentAbdomen,
      lacAbdWall: sAbdWall.active,
      lacAbdWallSides: sAbdWall.sides, lacAbdWallInjuries: sAbdWall.injuries,
      lacAbdFlank: sAbdFlank.active,
      lacAbdFlankSides: sAbdFlank.sides, lacAbdFlankInjuries: sAbdFlank.injuries,
      lacAbdLowerBack: sAbdLowerBack.active,
      lacAbdLowerBackSides: sAbdLowerBack.sides, lacAbdLowerBackInjuries: sAbdLowerBack.injuries,
      lacAbdButtock: sAbdButtock.active,
      lacAbdButtockSides: sAbdButtock.sides, lacAbdButtockInjuries: sAbdButtock.injuries,
      lacAbdGenitalia: sAbdGenitalia.active,
      lacAbdGenitaliaSides: sAbdGenitalia.sides, lacAbdGenitaliaInjuries: sAbdGenitalia.injuries,
      lacAbdomenSigns: abdomenSigns,

      lacParentUpperExtremity: parentUpperExt,
      lacArmShoulder: sArmShoulder.active,
      lacArmShoulderSides: sArmShoulder.sides, lacArmShoulderInjuries: sArmShoulder.injuries,
      lacArmElbow: sArmElbow.active,
      lacArmElbowSides: sArmElbow.sides, lacArmElbowInjuries: sArmElbow.injuries,
      lacArmWrist: sArmWrist.active,
      lacArmWristSides: sArmWrist.sides, lacArmWristInjuries: sArmWrist.injuries,
      lacArmFingers: isArmFingers,
      lacArmFingersSides: armFingersSides,
      lacArmFingersLeftDigits: armFingersLeftDigits,
      lacArmFingersRightDigits: armFingersRightDigits,
      lacArmFingersDigits: armFingersDigits, lacArmFingersInjuries: armFingersInjuries,
      lacUpperExtSigns: upperExtSigns,

      lacParentLowerExtremity: parentLowerExt,
      lacLegThigh: sLegThigh.active,
      lacLegThighSides: sLegThigh.sides, lacLegThighInjuries: sLegThigh.injuries,
      lacLegKneeShin: sLegKneeShin.active,
      lacLegKneeShinSides: sLegKneeShin.sides, lacLegKneeShinInjuries: sLegKneeShin.injuries,
      lacLegAnkleFoot: sLegAnkleFoot.active,
      lacLegAnkleFootSides: sLegAnkleFoot.sides, lacLegAnkleFootInjuries: sLegAnkleFoot.injuries,
      lacLegToes: isLegToes,
      lacLegToesSides: legToesSides,
      lacLegToesLeftDigits: legToesLeftDigits,
      lacLegToesRightDigits: legToesRightDigits,
      lacLegToesDigits: legToesDigits, lacLegToesInjuries: legToesInjuries,
      lacLowerExtSigns: lowerExtSigns,

      lacParentOther: parentOther,
      lacOtherLocationDetail: otherLocationDetail,

      lacSystemicSigns: systemicSigns,
      painScore: painScore,
      lacAntithrombotic: antithrombotic,
      lacTetanusHx: tetanusHx,
      lacLmpDate,
      lacPregnancyStatus
    };

    updateLacerationOutputs(rec);
    return rec;
  },

  collectFormData: function(ctx = {}) {
    return this.collectIntake(ctx);
  },

  hydrateForm: function(data = {}) {
    if (data.durationVal) {
      const valEl = document.getElementById('lacDurationVal');
      if (valEl) valEl.value = data.durationVal;
    }
    const unitEl = document.getElementById('lacDurationUnit');
    if (unitEl) {
      unitEl.value = data.durationUnit || 'hours';
    }

    const setRadio = (name, val) => {
      if (!val) return;
      const el = document.querySelector(`input[name="${name}"][value="${val}"]`);
      if (el) el.checked = true;
    };
    const setChecks = (name, arr) => {
      if (!Array.isArray(arr)) return;
      arr.forEach(val => {
        const el = document.querySelector(`input[name="${name}"][value="${val}"]`);
        if (el) el.checked = true;
      });
    };
    const setCheckById = (id, checked) => {
      const el = document.getElementById(id);
      if (el) el.checked = !!checked;
    };

    setChecks('lacCauses', data.lacCauses);
    if (Array.isArray(data.lacCauses)) {
      [
        ['sharp_object', 'lacCauseSharpDetailContainer', 'lacCauseSharpDetail', data.lacCauseSharpDetail],
        ['machinery_tools', 'lacCauseMachineryDetailContainer', 'lacCauseMachineryDetail', data.lacCauseMachineryDetail],
        ['blunt_impact', 'lacCauseBluntDetailContainer', 'lacCauseBluntDetail', data.lacCauseBluntDetail],
        ['puncture_wound', 'lacCausePunctureDetailContainer', 'lacCausePunctureDetail', data.lacCausePunctureDetail],
        ['other_cause', 'lacCauseOtherDetailContainer', 'lacCauseOtherDetail', data.lacCauseOtherDetail]
      ].forEach(([k, c, inp, v]) => {
        if (data.lacCauses.includes(k)) {
          toggleLacGroup(c, true);
          const el = document.getElementById(inp); if (el) el.value = v || '';
        }
      });
    }

    setChecks('lacContaminants', data.lacContaminants);
    setRadio('lacBleedingStatus', data.lacBleedingStatus);
    setRadio('lacProdrome', data.lacProdrome);
    if (data.lacProdrome === 'has_prodrome') {
      handleLacProdromeChange('has_prodrome');
      const pdEl = document.getElementById('lacProdromeDetail');
      if (pdEl) pdEl.value = data.lacProdromeDetail || '';
    }

    const hydrateSub = (key, id, cont, sidesName, sidesData) => {
      if (data[key]) {
        setCheckById(id, true);
        toggleLacGroup(cont, true);
        if (sidesName && sidesData) setChecks(sidesName, sidesData);
        setChecks(id + 'Injuries', data[id + 'Injuries']);
      }
    };

    if (data.lacParentHeadFace) {
      setCheckById('lacParentHeadFace', true);
      toggleLacGroup('lacHeadSubGroup', true);
      hydrateSub('lacHeadScalp', 'lacHeadScalp', 'lacHeadScalpSidesContainer', 'lacHeadScalpSides', data.lacHeadScalpSides);
      hydrateSub('lacHeadFace', 'lacHeadFace', 'lacHeadFaceSidesContainer', 'lacHeadFaceSides', data.lacHeadFaceSides);
      hydrateSub('lacHeadEye', 'lacHeadEye', 'lacHeadEyeSidesContainer', 'lacHeadEyeSides', data.lacHeadEyeSides);
      hydrateSub('lacHeadEar', 'lacHeadEar', 'lacHeadEarSidesContainer', 'lacHeadEarSides', data.lacHeadEarSides);
      hydrateSub('lacHeadNoseMouth', 'lacHeadNoseMouth', 'lacHeadNoseMouthSidesContainer', 'lacHeadNoseMouthSides', data.lacHeadNoseMouthSides);
      setChecks('lacHeadSigns', data.lacHeadSigns);
    }

    if (data.lacParentNeck) {
      setCheckById('lacParentNeck', true);
      toggleLacGroup('lacNeckSubGroup', true);
      hydrateSub('lacNeckFront', 'lacNeckFront', 'lacNeckFrontSidesContainer', 'lacNeckFrontSides', data.lacNeckFrontSides);
      hydrateSub('lacNeckSide', 'lacNeckSide', 'lacNeckSideSidesContainer', 'lacNeckSideSides', data.lacNeckSideSides);
      hydrateSub('lacNeckBack', 'lacNeckBack', 'lacNeckBackSidesContainer', 'lacNeckBackSides', data.lacNeckBackSides);
      setChecks('lacNeckSigns', data.lacNeckSigns);
    }

    if (data.lacParentChest) {
      setCheckById('lacParentChest', true);
      toggleLacGroup('lacChestSubGroup', true);
      hydrateSub('lacChestRibs', 'lacChestRibs', 'lacChestRibsSidesContainer', 'lacChestRibsSides', data.lacChestRibsSides);
      hydrateSub('lacChestUpperBack', 'lacChestUpperBack', 'lacChestUpperBackSidesContainer', 'lacChestUpperBackSides', data.lacChestUpperBackSides);
      setChecks('lacChestSigns', data.lacChestSigns);
    }

    if (data.lacParentAbdomen) {
      setCheckById('lacParentAbdomen', true);
      toggleLacGroup('lacAbdomenSubGroup', true);
      hydrateSub('lacAbdWall', 'lacAbdWall', 'lacAbdWallSidesContainer', 'lacAbdWallSides', data.lacAbdWallSides);
      hydrateSub('lacAbdFlank', 'lacAbdFlank', 'lacAbdFlankSidesContainer', 'lacAbdFlankSides', data.lacAbdFlankSides);
      hydrateSub('lacAbdLowerBack', 'lacAbdLowerBack', 'lacAbdLowerBackSidesContainer', 'lacAbdLowerBackSides', data.lacAbdLowerBackSides);
      hydrateSub('lacAbdButtock', 'lacAbdButtock', 'lacAbdButtockSidesContainer', 'lacAbdButtockSides', data.lacAbdButtockSides);
      hydrateSub('lacAbdGenitalia', 'lacAbdGenitalia', 'lacAbdGenitaliaSidesContainer', 'lacAbdGenitaliaSides', data.lacAbdGenitaliaSides);
      setChecks('lacAbdomenSigns', data.lacAbdomenSigns);
    }

    if (data.lacParentUpperExtremity) {
      setCheckById('lacParentUpperExtremity', true);
      toggleLacGroup('lacUpperExtSubGroup', true);
      hydrateSub('lacArmShoulder', 'lacArmShoulder', 'lacArmShoulderSidesContainer', 'lacArmShoulderSides', data.lacArmShoulderSides);
      hydrateSub('lacArmElbow', 'lacArmElbow', 'lacArmElbowSidesContainer', 'lacArmElbowSides', data.lacArmElbowSides);
      hydrateSub('lacArmWrist', 'lacArmWrist', 'lacArmWristSidesContainer', 'lacArmWristSides', data.lacArmWristSides);
      if (data.lacArmFingers) {
        setCheckById('lacArmFingers', true);
        toggleLacGroup('lacArmFingersSidesContainer', true);
        setChecks('lacArmFingersLeftDigits', data.lacArmFingersLeftDigits || (data.lacArmFingersSides?.includes('left') ? data.lacArmFingersDigits : []));
        setChecks('lacArmFingersRightDigits', data.lacArmFingersRightDigits || (data.lacArmFingersSides?.includes('right') ? data.lacArmFingersDigits : []));
        setChecks('lacArmFingersInjuries', data.lacArmFingersInjuries);
      }
      setChecks('lacUpperExtSigns', data.lacUpperExtSigns);
    }

    if (data.lacParentLowerExtremity) {
      setCheckById('lacParentLowerExtremity', true);
      toggleLacGroup('lacLowerExtSubGroup', true);
      hydrateSub('lacLegThigh', 'lacLegThigh', 'lacLegThighSidesContainer', 'lacLegThighSides', data.lacLegThighSides);
      hydrateSub('lacLegKneeShin', 'lacLegKneeShin', 'lacLegKneeShinSidesContainer', 'lacLegKneeShinSides', data.lacLegKneeShinSides);
      hydrateSub('lacLegAnkleFoot', 'lacLegAnkleFoot', 'lacLegAnkleFootSidesContainer', 'lacLegAnkleFootSides', data.lacLegAnkleFootSides);
      if (data.lacLegToes) {
        setCheckById('lacLegToes', true);
        toggleLacGroup('lacLegToesSidesContainer', true);
        setChecks('lacLegToesLeftDigits', data.lacLegToesLeftDigits || (data.lacLegToesSides?.includes('left') ? data.lacLegToesDigits : []));
        setChecks('lacLegToesRightDigits', data.lacLegToesRightDigits || (data.lacLegToesSides?.includes('right') ? data.lacLegToesDigits : []));
        setChecks('lacLegToesInjuries', data.lacLegToesInjuries);
      }
      setChecks('lacLowerExtSigns', data.lacLowerExtSigns);
    }

    if (data.lacParentOther) {
      setCheckById('lacParentOther', true);
      toggleLacGroup('lacOtherSubGroup', true);
      const otherEl = document.getElementById('lacOtherLocationDetail');
      if (otherEl) otherEl.value = data.lacOtherLocationDetail || '';
    }

    setChecks('lacSystemicSigns', data.lacSystemicSigns);

    if (data.painScore !== null && data.painScore !== undefined) {
      const slider = document.getElementById('lacPainScore');
      if (slider) slider.value = data.painScore;
      handleLacPainScoreChange(data.painScore);
    } else {
      clearLacPainScore();
    }

    setRadio('lacAntithrombotic', data.lacAntithrombotic);
    setRadio('lacTetanusHx', data.lacTetanusHx);
    checkAndDisplayLacLmp(data);
    if (isLacFemalePatient(data)) {
      const lmpEl = document.getElementById('lacLmpDate'); if (lmpEl) lmpEl.value = data.lacLmpDate || '';
      setRadio('lacPregnancyStatus', data.lacPregnancyStatus);
    }
    const otherFreeEl = document.getElementById('laceration_bleeding_other_free');
    if (otherFreeEl) otherFreeEl.value = data.otherSymptomsFree || '';
  },

  clearForm: function() {
    ['lacDurationVal', 'lacCauseSharpDetail', 'lacCauseMachineryDetail', 'lacCauseBluntDetail', 'lacCausePunctureDetail', 'lacCauseOtherDetail', 'lacProdromeDetail', 'lacOtherLocationDetail', 'lacLmpDate', 'laceration_bleeding_other_free'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = '';
    });
    const durUnit = document.getElementById('lacDurationUnit');
    if (durUnit) durUnit.value = 'hours';
    clearLacPainScore();

    [
      'lacCauseSharpDetailContainer', 'lacCauseMachineryDetailContainer', 'lacCauseBluntDetailContainer', 'lacCausePunctureDetailContainer', 'lacCauseOtherDetailContainer', 'lacProdromeDetailContainer',
      'lacHeadSubGroup', 'lacHeadScalpSidesContainer', 'lacHeadFaceSidesContainer', 'lacHeadEyeSidesContainer', 'lacHeadEarSidesContainer', 'lacHeadNoseMouthSidesContainer',
      'lacNeckSubGroup', 'lacNeckFrontSidesContainer', 'lacNeckSideSidesContainer', 'lacNeckBackSidesContainer',
      'lacChestSubGroup', 'lacChestRibsSidesContainer', 'lacChestUpperBackSidesContainer',
      'lacAbdomenSubGroup', 'lacAbdWallSidesContainer', 'lacAbdFlankSidesContainer', 'lacAbdLowerBackSidesContainer', 'lacAbdButtockSidesContainer', 'lacAbdGenitaliaSidesContainer',
      'lacUpperExtSubGroup', 'lacArmShoulderSidesContainer', 'lacArmElbowSidesContainer', 'lacArmWristSidesContainer', 'lacArmFingersSidesContainer',
      'lacLowerExtSubGroup', 'lacLegThighSidesContainer', 'lacLegKneeShinSidesContainer', 'lacLegAnkleFootSidesContainer', 'lacLegToesSidesContainer', 'lacOtherSubGroup', 'lacFemaleSection'
    ].forEach(id => { const el = document.getElementById(id); if (el) el.classList.add('hidden'); });

    document.querySelectorAll('#cc-laceration-bleeding-section input[type="radio"], #cc-laceration-bleeding-section input[type="checkbox"]').forEach(i => { i.checked = false; });
  },

  onTitleChange: function(arg) {
    if (typeof arg === 'boolean') toggleLacFemaleSection(arg);
    else if (arg && typeof arg === 'object') {
      if (typeof arg.isFemale === 'boolean') toggleLacFemaleSection(arg.isFemale);
      else toggleLacFemaleSection(/นาง|น\.ส\.|ด\.ญ\.|\(หญิง\)|Mrs|Miss|Ms/i.test(arg.title || ''));
    } else toggleLacFemaleSection(/นาง|น\.ส\.|ด\.ญ\.|\(หญิง\)|Mrs|Miss|Ms/i.test(String(arg || '')));
  },
  onSelectForm: function() { checkAndDisplayLacLmp({}); },
  onActivate: function(patient) { checkAndDisplayLacLmp(patient || {}); },
  resetForm: function() { this.clearForm(); },

  isRedFlag: function(patient) {
    const rfs = evaluateLacerationRedFlags(patient);
    return rfs.length > 0;
  },

  evaluateRedFlags: evaluateLacerationRedFlags,
  updateOutputs: updateLacerationOutputs,
  renderRapidHpi: renderLacerationRapidHpi,
  renderNarrative: renderLacerationNarrative,
  renderDoctorHpi: renderLacerationDoctorHpi,

  // --- Seed Patients Registry ---
  seedPatients: [
    // Case 1: Angle grinder cut to left wrist with active spurting & tendon/nerve deficit (ESI 1)
    {
      id: 'case-lac-01', queue_number: 'E1-105', hn: '7890501',
      name: 'นายสมเกียรติ หินเจียรแตกบาดข้อมือเลือดพุ่ง', age: 38, gender: 'ชาย',
      chief_complaint: 'laceration_bleeding', chief_complaint_title: 'บาดแผลฉีกขาด / มีเลือดออก',
      timestamp: '2026-11-06T08:00:00.000Z', status: 'waiting',
      durationVal: 30, durationUnit: 'minutes', hospRecordStatus: 'self', underlying: [], drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร', currentMeds: 'ไม่มี',
      otherSymptomsFree: 'หินเจียรตัดเหล็กแตกสะบัดบาดข้อมือซ้ายลึก เลือดพุ่งกระฉูดตามจังหวะชีพจร กดผ้าแน่นแล้วชุ่มเลือดเร็ว หน้าซีดเหงื่อแตกตัวเย็น นิ้วมืองอไม่ได้และชาปลายนิ้วก้อย-นาง',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.4, sbp: 88, dbp: 52, bp: '88/52', pr: 122, rr: 24, spo2: 98 },
      esi_level: 1,
      lacCauses: ['machinery_tools'], lacCauseMachineryDetail: 'ใบหินเจียรแตกสะบัดใส่',
      lacContaminants: ['foreign_body_retained', 'dirty_contaminated'],
      lacBleedingStatus: 'active_spurting', lacProdrome: 'no_prodrome',
      lacParentHeadFace: false, lacParentNeck: false, lacParentChest: false, lacParentAbdomen: false,
      lacParentUpperExtremity: true, lacArmShoulder: false, lacArmElbow: false, lacArmWrist: true, lacArmWristSides: ['left'], lacArmFingers: false,
      lacUpperExtSigns: ['tendon_deficit_hand', 'nerve_numbness_hand', 'vascular_cold_pale_hand'],
      lacParentLowerExtremity: false,
      lacSystemicSigns: ['dizziness_presyncope', 'palpitation_cold_sweat', 'excessive_thirst_weakness'],
      painScore: 9, lacAntithrombotic: 'no_antithrombotic', lacTetanusHx: 'more_than_10_years'
    },

    // Case 2: Slashed penetrating wound to right chest with open pneumothorax (ESI 1)
    {
      id: 'case-lac-02', queue_number: 'E1-106', hn: '7890502',
      name: 'นายชาญชัย ถูกมีดฟันหน้าอกมีลมดูด', age: 26, gender: 'ชาย',
      chief_complaint: 'laceration_bleeding', chief_complaint_title: 'บาดแผลฉีกขาด / มีเลือดออก',
      timestamp: '2026-11-06T08:30:00.000Z', status: 'waiting',
      durationVal: 45, durationUnit: 'minutes', hospRecordStatus: 'self', underlying: [], drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร', currentMeds: 'ไม่มี',
      otherSymptomsFree: 'ถูกมีดดาบฟันเข้าที่หน้าอกขวาและหลังขวา แผลลึก มีเสียงลมดูดฟ่อๆ เข้าออกตามจังหวะหายใจ แน่นหน้าอก หายใจหอบเหนื่อยรุนแรง',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.8, sbp: 105, dbp: 68, bp: '105/68', pr: 114, rr: 28, spo2: 91 },
      esi_level: 1,
      lacCauses: ['sharp_object'], lacCauseSharpDetail: 'ถูกมีดดาบฟัน',
      lacContaminants: ['dirty_contaminated'],
      lacBleedingStatus: 'active_oozing', lacProdrome: 'no_prodrome',
      lacParentHeadFace: false, lacParentNeck: false,
      lacParentChest: true, lacChestRibs: true, lacChestRibsSides: ['right'], lacChestUpperBack: true, lacChestUpperBackSides: ['right'],
      lacChestSigns: ['dyspnea_pleuritic_pain', 'sucking_chest_wound'],
      lacParentAbdomen: false, lacParentUpperExtremity: false, lacParentLowerExtremity: false,
      lacSystemicSigns: ['palpitation_cold_sweat'],
      painScore: 8, lacAntithrombotic: 'no_antithrombotic', lacTetanusHx: 'never_or_unsure'
    },

    // Case 3: Fall with scalp laceration, brief LOC, and on Warfarin (ESI 2)
    {
      id: 'case-lac-03', queue_number: 'E2-105', hn: '7890503',
      name: 'นางปราณี ลื่นล้มหัวแตกสลบบนยาละลายลิ่มเลือด', age: 69, gender: 'หญิง',
      chief_complaint: 'laceration_bleeding', chief_complaint_title: 'บาดแผลฉีกขาด / มีเลือดออก',
      timestamp: '2026-11-06T09:00:00.000Z', status: 'waiting',
      durationVal: 2, durationUnit: 'hours', hospRecordStatus: 'complete',
      underlying: ['หัวใจเต้นผิดจังหวะ (AF)', 'ความดันโลหิตสูง (HT)'],
      drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร',
      currentMeds: 'Warfarin 3 mg 1 tab po od, Amlodipine 5 mg 1 tab po od',
      otherSymptomsFree: 'ลื่นล้มในห้องน้ำ ศีรษะด้านหลังกระแทกขอบชักโครก หมดสติไปประมาณ 1 นาที ฟื้นมาจำเหตุการณ์ไม่ได้ แผลหนังศีรษะแตกยาว เลือดไหลซึมไม่หยุดเพราะทานยาวาร์ฟาริน',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.6, sbp: 148, dbp: 86, bp: '148/86', pr: 78, rr: 18, spo2: 98 },
      esi_level: 2,
      lacCauses: ['fall_collision', 'blunt_impact'], lacCauseBluntDetail: 'กระแทกขอบชักโครก',
      lacContaminants: ['clean_wound'],
      lacBleedingStatus: 'active_oozing', lacProdrome: 'no_prodrome',
      lacParentHeadFace: true, lacHeadScalp: true, lacHeadScalpSides: ['center'],
      lacHeadFace: false, lacHeadEye: false, lacHeadEar: false, lacHeadNoseMouth: false,
      lacHeadSigns: ['loss_of_consciousness', 'severe_headache_vomit'],
      lacParentNeck: false, lacParentChest: false, lacParentAbdomen: false, lacParentUpperExtremity: false, lacParentLowerExtremity: false,
      lacSystemicSigns: ['no_systemic_signs'],
      painScore: 5, lacAntithrombotic: 'on_anticoagulant_antiplatelet', lacTetanusHx: '5_to_10_years'
    },

    // Case 4: Kitchen knife clean cut to left index finger, bleeding controlled, low risk (ESI 4 / 3)
    {
      id: 'case-lac-04', queue_number: 'E3-101', hn: '7890504',
      name: 'น.ส.กัญญา มีดทำครัวบาดนิ้วชี้ซ้ายเลือดหยุดแล้ว', age: 24, gender: 'หญิง',
      chief_complaint: 'laceration_bleeding', chief_complaint_title: 'บาดแผลฉีกขาด / มีเลือดออก',
      timestamp: '2026-11-06T09:30:00.000Z', status: 'waiting',
      durationVal: 1, durationUnit: 'hours', hospRecordStatus: 'self', underlying: [], drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร', currentMeds: 'ไม่มี',
      otherSymptomsFree: 'มีดทำครัวบาดนิ้วชี้ซ้ายขณะหั่นผัก แผลยาว 1.5 ซม. เลือดออกเล็กน้อยและหยุดสนิทแล้วหลังใช้ผ้ากด งอนิ้วได้ปกติ ปลายนิ้วไม่ชา ไม่หน้ามืด ฉีดวัคซีนบาดทะยักเมื่อ 2 ปีก่อน',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.7, sbp: 118, dbp: 74, bp: '118/74', pr: 72, rr: 16, spo2: 99 },
      esi_level: 4,
      lacCauses: ['sharp_object'], lacCauseSharpDetail: 'มีดทำครัวหั่นผัก',
      lacContaminants: ['clean_wound'],
      lacBleedingStatus: 'stopped', lacProdrome: 'no_prodrome',
      lacParentHeadFace: false, lacParentNeck: false, lacParentChest: false, lacParentAbdomen: false,
      lacParentUpperExtremity: true, lacArmShoulder: false, lacArmElbow: false, lacArmWrist: false,
      lacArmFingers: true, lacArmFingersSides: ['left'], lacArmFingersLeftDigits: ['index'], lacArmFingersRightDigits: [], lacArmFingersDigits: ['index'],
      lacUpperExtSigns: [], lacParentLowerExtremity: false, lacSystemicSigns: ['no_systemic_signs'],
      painScore: 2, lacAntithrombotic: 'no_antithrombotic', lacTetanusHx: 'within_5_years'
    }
  ]
};

// Register module in Ratchaburi ER Core Registry
if (typeof registerCcModule === 'function') registerCcModule(lacerationBleedingModule);
else if (typeof window !== 'undefined' && typeof window.registerCcModule === 'function') window.registerCcModule(lacerationBleedingModule);

if (typeof module !== 'undefined' && module.exports) {
  module.exports = lacerationBleedingModule;
}
