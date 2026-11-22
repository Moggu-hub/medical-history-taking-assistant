// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 27_fall_trauma.js
// อาการนำ: พลัดตกหกล้ม / ได้รับบาดเจ็บทางกายภาพ (Falls / Blunt Trauma)
// รองรับ Zero Default Bias, Progressive Disclosure 6 ตำแหน่งร่างกาย,
// Universal Date/Time, Pain Slider Touch State, และ Core Guard TDD 100%
// =========================================================================

// --- Module-scoped State & Helpers ---
let fallPainScoreTouched = false;

function wrapFallWords(chunks) {
  if (!Array.isArray(chunks)) return chunks;
  return chunks.map(c => `<span class="inline-block whitespace-nowrap">${c}</span>`).join(' ');
}

function renderFallOption(cfg) {
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
  const titleHtml = Array.isArray(title) ? wrapFallWords(title) : title;
  const bodyHtml = desc
    ? `<div class="ml-3 leading-snug"><span class="block text-xs sm:text-sm font-semibold text-slate-800">${titleHtml}</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">${desc}</span></div>`
    : `<span class="ml-3 ${compact ? 'text-xs' : 'text-xs sm:text-sm'} font-semibold text-slate-800 leading-snug">${titleHtml}</span>`;
  return `<label class="selectable-card bg-white flex ${alignCls} ${padCls} rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition${spanCls}"><input type="${kind}" ${idAttr}${nameAttr}${valAttr}${chgAttr}class="${topCls}${roundCls}text-medical-600 focus:ring-medical-500 ${szCls} flex-shrink-0">${bodyHtml}</label>`;
}

function renderFallGrid(colsCls, items, shared = {}) {
  return `<div class="grid ${colsCls} gap-2.5">${items.map(it => renderFallOption({ ...shared, ...it })).join('\n')}</div>`;
}

function renderFallSysHeader({
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

function renderFallMechCard(value, title, desc, containerId, inputId, placeholder) {
  return `<div>
    ${renderFallOption({
      name: 'fallMechanisms',
      value,
      title,
      desc,
      onchange: `toggleFallGroup('${containerId}', this.checked)`
    })}
    <div id="${containerId}" class="hidden mt-2 pl-3 border-l-2 border-medical-200">
      <input type="text" id="${inputId}" placeholder="${placeholder}" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white">
    </div>
  </div>`;
}

function handleFallGroupNoneToggle(noneEl, inputName) {
  if (!noneEl || !noneEl.checked || typeof document === 'undefined') return;
  document.querySelectorAll(`input[name="${inputName}"]`).forEach(cb => {
    if (cb !== noneEl) cb.checked = false;
  });
}

function handleFallGroupItemChange(itemEl, noneId) {
  if (!itemEl || !itemEl.checked || !noneId || typeof document === 'undefined') return;
  const noneEl = document.getElementById(noneId);
  if (noneEl) noneEl.checked = false;
}

function handleFallProdromeChange(val) {
  toggleFallGroup('fallProdromeDetailContainer', val === 'has_prodrome');
}

function toggleFallGroup(subId, show) {
  const el = document.getElementById(subId);
  if (!el) return;
  if (show) el.classList.remove('hidden');
  else {
    el.classList.add('hidden');
    el.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(cb => { cb.checked = false; });
    el.querySelectorAll('input[type="text"], input[type="number"]').forEach(ti => { ti.value = ''; });
  }
}

function clearFallPainScore() {
  fallPainScoreTouched = false;
  const slider = document.getElementById('fallPainScore');
  if (slider) slider.value = 0;
  const emojiEl = document.getElementById('fallPainScoreEmoji'), textEl = document.getElementById('fallPainScoreText');
  const badgeEl = document.getElementById('fallPainScoreBadge'), clearBtn = document.getElementById('fallPainScoreClearBtn');
  if (emojiEl) emojiEl.textContent = '⚪';
  if (textEl) textEl.textContent = 'ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)';
  if (badgeEl) badgeEl.className = 'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all';
  if (clearBtn) clearBtn.classList.add('hidden');
}

function handleFallPainScoreChange(val) {
  fallPainScoreTouched = true;
  const num = parseInt(val, 10) || 0;
  const slider = document.getElementById('fallPainScore');
  if (slider && String(slider.value) !== String(num)) slider.value = num;
  const emojiEl = document.getElementById('fallPainScoreEmoji'), textEl = document.getElementById('fallPainScoreText');
  const badgeEl = document.getElementById('fallPainScoreBadge'), clearBtn = document.getElementById('fallPainScoreClearBtn');
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
function setFallPainScore(score) {
  fallPainScoreTouched = true;
  const slider = document.getElementById('fallPainScore');
  if (slider) slider.value = score;
  handleFallPainScoreChange(score);
}
const handleFallPainSliderTouch = handleFallPainScoreChange;
if (typeof window !== 'undefined') {
  window.toggleFallGroup = toggleFallGroup;
  window.handleFallGroupNoneToggle = handleFallGroupNoneToggle;
  window.handleFallGroupItemChange = handleFallGroupItemChange;
  window.handleFallProdromeChange = handleFallProdromeChange;
  window.clearFallPainScore = clearFallPainScore;
  window.handleFallPainScoreChange = handleFallPainScoreChange;
  window.setFallPainScore = setFallPainScore;
}

// --- Clinical Decision Support & Evaluation Functions ---
function evaluateFallRedFlags(patient) {
  const rfs = [];
  const addRf = (key, level, textTh, risk, suggestedAction) => {
    rfs.push({ key, level, textTh, title: textTh, risk, detail: risk, suggestedAction, action: suggestedAction });
  };
  const vs = patient.vital_signs || {};
  const sbp = typeof vs.sbp === 'number' ? vs.sbp : (parseInt(vs.sbp, 10) || null);
  const pr = typeof vs.pr === 'number' ? vs.pr : (parseInt(vs.pr, 10) || null);
  const spo2 = typeof vs.spo2 === 'number' ? vs.spo2 : (parseInt(vs.spo2, 10) || null);
  const shockIndex = (sbp && pr) ? (pr / sbp) : 0;
  const age = typeof patient.age === 'number' ? patient.age : (parseInt(patient.age, 10) || 0);

  const mechs = Array.isArray(patient.fallMechanisms) ? patient.fallMechanisms : [];
  const heightLevel = patient.fallHeightLevel || '';
  const prodrome = patient.fallProdrome || '';
  const woundStatus = patient.fallWoundStatus || '';
  const antithrombotic = patient.fallAntithrombotic || '';

  const headSigns = Array.isArray(patient.fallHeadSigns) ? patient.fallHeadSigns : [];
  const neckSigns = Array.isArray(patient.fallNeckSigns) ? patient.fallNeckSigns : [];
  const chestSigns = Array.isArray(patient.fallChestSigns) ? patient.fallChestSigns : [];
  const abdSigns = Array.isArray(patient.fallAbdomenSigns) ? patient.fallAbdomenSigns : [];
  const upperSigns = Array.isArray(patient.fallUpperExtSigns) ? patient.fallUpperExtSigns : [];
  const lowerSigns = Array.isArray(patient.fallLowerExtSigns) ? patient.fallLowerExtSigns : [];
  const sysSigns = Array.isArray(patient.fallSystemicSigns) ? patient.fallSystemicSigns : [];

  const hasShock = (sbp !== null && sbp < 90) || (shockIndex >= 0.9) ||
    sysSigns.includes('dizziness_presyncope') || sysSigns.includes('palpitation_cold_sweat') || sysSigns.includes('excessive_thirst_weakness');

  // RED FLAG 1: High-Energy Fall / Hemorrhagic Shock / Severe Blunt Torso Trauma (ESI 1 / 2)
  const isHighEnergy = heightLevel === 'over_3m' || (mechs.includes('height_fall') && heightLevel === '2_to_3m' && hasShock);
  const isBluntTorsoThreat = (patient.fallParentChest && (chestSigns.includes('dyspnea_shortness_of_breath') || (spo2 !== null && spo2 < 92))) ||
    (patient.fallParentAbdomen && (abdSigns.includes('severe_abd_pain_distension') || abdSigns.includes('urinary_retention_hematuria'))) ||
    woundStatus === 'active_spurting';

  if (isHighEnergy || (hasShock && (patient.fallParentChest || patient.fallParentAbdomen || patient.fallParentNeck)) || isBluntTorsoThreat) {
    addRf('rf_fall_high_energy_shock_internal_bleed',
      (sbp !== null && sbp < 90) || woundStatus === 'active_spurting' || heightLevel === 'over_3m' ? 'ESI 1' : 'ESI 2',
      'อุบัติเหตุตกจากที่สูงรุนแรง หรือมีภาวะช็อก/สงสัยเลือดออกภายในช่องอก-ช่องท้อง (High-Energy Fall / Internal Hemorrhage / Shock)',
      'ผู้ป่วยมีประวัติตกจากที่สูง > 3 เมตร, มีภาวะช็อก/สงสัยเลือดออกในช่องอกหรือช่องท้อง หรือมีแผลเลือดพุ่ง เสี่ยงต่อการเสียเลือดเฉียบพลันและภาวะการหายใจล้มเหลว',
      'ประเมิน ABCDE ตามแนวทาง ATLS, ตรวจ Bedside eFAST, เปิดเส้น IV เบอร์ใหญ่ 2 เส้น, จองเลือด, ส่ง Chest/Pelvis X-ray และปรึกษาศัลยแพทย์ด่วน');
  }

  // RED FLAG 2: Suspected Cervical / Thoracolumbar Spine or Spinal Cord Injury (ESI 1 / 2)
  const hasSpineThreat = (patient.fallParentNeck && (neckSigns.includes('severe_cervical_pain_limited_rom') || neckSigns.includes('radicular_shock_numbness_weakness'))) ||
    (patient.fallParentAbdomen && abdSigns.includes('sciatica_numbness_cauda_equina'));

  if (hasSpineThreat) {
    addRf('rf_fall_cspine_spinal_cord_injury',
      neckSigns.includes('radicular_shock_numbness_weakness') || abdSigns.includes('sciatica_numbness_cauda_equina') ? 'ESI 1' : 'ESI 2',
      'สงสัยการบาดเจ็บกระดูกต้นคอหรือไขสันหลัง (Suspected Cervical / Spinal Cord Injury)',
      'พบอาการปวดแนวกระดูกต้นคอรุนแรง ขยับคอไม่ได้ หรือมีอาการชา/ไฟช็อต/อ่อนแรงร้าวลงแขนขา หรือสูญเสียการควบคุมการขับถ่าย เสี่ยงต่อภาวะอัมพาตถาวร',
      'ใส่ Hard Cervical Collar และจัดให้นอนราบบน Long Spinal Board ทันทีด้วยเทคนิค Log-roll, งอข้อ/ดัดคอไม่ได้เด็ดขาด, ตรวจ Motor/Sensory และส่ง Stat CT Spine');
  }

  // RED FLAG 3: Head Injury with TBI Warning / Head Trauma on Anticoagulant (ESI 2)
  const isHeadInjured = !!patient.fallParentHeadFace;
  const hasTbiSigns = headSigns.includes('loss_of_consciousness') || headSigns.includes('severe_headache_vomit_drowsy') ||
    headSigns.includes('vision_problem_eye_swelling') || headSigns.includes('csf_leak_ear_nose') || sysSigns.includes('post_fall_seizure');
  const isOnBloodThinner = antithrombotic === 'on_anticoagulant_antiplatelet' || antithrombotic === 'coagulopathy_history';

  if (isHeadInjured && (hasTbiSigns || (isOnBloodThinner && age >= 50) || age >= 65)) {
    addRf('rf_fall_tbi_anticoagulant_head', 'ESI 2',
      'บาดเจ็บที่ศีรษะร่วมกับอาการทางสมอง หรือศีรษะกระแทกในผู้ที่ใช้ยาละลายลิ่มเลือด (Head Injury with TBI Warning / Anticoagulant Risk)',
      'พบการบาดเจ็บที่ศีรษะร่วมกับประวัติสลบ/อาเจียน/มึนงงสับสน/น้ำใสออกหูจมูก หรือเป็นผู้สูงอายุที่ใช้ยาละลายลิ่มเลือด เสี่ยงต่อภาวะเลือดออกในกะโหลกศีรษะ (ICH / SDH)',
      'ประเมิน GCS และรูม่านตาทันที, ส่งตรวจ Stat Non-contrast CT Brain ตามเกณฑ์ Canadian CT Head Rule, ตรวจระดับ PT/INR หากทานยา Warfarin');
  }

  // RED FLAG 4: Fall Secondary to Syncope / Acute Medical Etiology (ESI 2)
  if (prodrome === 'has_prodrome') {
    addRf('rf_fall_syncopal_medical_cause', 'ESI 2',
      'การหกล้มที่มีอาการวูบ หน้ามืด ใจสั่น เจ็บหน้าอก หรืออ่อนแรงนำมาก่อนล้ม (Fall Secondary to Syncope / Medical Etiology)',
      'ประวัติบ่งชี้ว่าการล้มเกิดจากอาการเจ็บป่วยทางอายุรศาสตร์เฉียบพลัน (เช่น หัวใจเต้นผิดจังหวะ, กล้ามเนื้อหัวใจขาดเลือด, สโตรก หรือน้ำตาลในเลือดต่ำ) ไม่ใช่การสะดุดล้มทั่วไป',
      'ค้นหาสาเหตุของการวูบล้มควบคู่กับการรักษาการบาดเจ็บ: ทำ 12-Lead ECG ทันที, ตรวจ Stat DTX, ประเมิน FAST Neuro exam และวัดความดันท่านอน/ท่ายืน');
  }

  // RED FLAG 5: Suspected Hip Fracture / Open Fracture / Neurovascular Compromise (ESI 2)
  const hasOpenFx = upperSigns.includes('open_fracture_arm') || lowerSigns.includes('open_fracture_leg');
  const hasVascularThreat = upperSigns.includes('vascular_cold_pale_hand') || lowerSigns.includes('vascular_cold_pale_foot');
  const hasHipFxSign = patient.fallParentLowerExtremity && lowerSigns.includes('deformity_shortened_external_rotation_leg');
  const hasPelvicThreat = patient.fallParentAbdomen && abdSigns.includes('pelvic_hip_pain_cannot_bear_weight');

  if (hasOpenFx || hasVascularThreat || hasHipFxSign || (hasPelvicThreat && age >= 55)) {
    addRf('rf_fall_open_fracture_neurovascular_hip', 'ESI 2',
      'สงสัยกระดูกสะโพกหัก กระดูกหักแบบมีแผลเปิด หรือแขนขาผิดรูปร่วมกับขาดเลือด (Suspected Hip Fracture / Open Fracture / Ischemia)',
      'พบกระดูกโผล่, ปลายมือปลายเท้าซีดเย็นขาดเลือด, ขาสั้นลงและบิดออกนอก (ลักษณะเฉพาะของกระดูกสะโพกหัก) หรือปวดสะโพกมากจนขยับขาไม่ได้',
      'ดามเฝือกชั่วคราว (Splinting) โดยตรวจชีพจรส่วนปลายก่อนและหลังดาม, ให้ IV Antibiotics ทันทีหากเป็นแผลเปิด, ส่ง Film X-ray และปรึกษาศัลยแพทย์ออร์โธปิดิกส์ด่วน');
  }

  // RED FLAG 6: Suspected Closed Extremity Fracture / Joint Dislocation / Inability to Bear Weight (ESI 3)
  const hasClosedExtremityDeformity = (patient.fallParentUpperExtremity && (upperSigns.includes('deformity_dislocation_arm') || upperSigns.includes('cannot_move_arm_hand') || upperSigns.includes('nerve_numbness_arm'))) ||
    (patient.fallParentLowerExtremity && (lowerSigns.includes('inability_to_bear_weight') || lowerSigns.includes('nerve_numbness_cannot_dorsiflex'))) ||
    (patient.fallParentChest && chestSigns.includes('deformity_crepitus_clavicle_ribs')) ||
    (patient.fallParentHeadFace && (headSigns.includes('jaw_malocclusion') || headSigns.includes('jaw_malocclusion_broken_tooth')));

  if (hasClosedExtremityDeformity && !rfs.some(r => r.key === 'rf_fall_open_fracture_neurovascular_hip')) {
    addRf('rf_fall_extremity_fracture_inability_to_bear_weight', 'ESI 3',
      'สงสัยกระดูกแขนขาหัก ข้อเคลื่อนหลุด หรือเดินลงน้ำหนักไม่ได้ (Suspected Closed Fracture / Dislocation)',
      'ตรวจพบแขนขาผิดรูป บวมตึง ปวดมากจนขยับไม่ได้ หรือยืนลงน้ำหนักไม่ได้ เสี่ยงต่อกระดูกหัก ข้อหลุด หรือเอ็นข้อฉีกขาดรุนแรง',
      'ดามส่วนที่บาดเจ็บ (Immobilization), ประประคบเย็นลดบวม, ให้ยาระงับปวด และส่ง Film X-ray 2 views (AP/Lateral) ตามตำแหน่งที่สงสัย');
  }

  return rfs;
}

// --- Formatters for Output & Notes ---
function formatFallMechanisms(patient) {
  const mechs = Array.isArray(patient.fallMechanisms) ? patient.fallMechanisms : [];
  if (mechs.length === 0) return 'ไม่ได้ระบุกลไกชัดเจน';
  const labels = [];
  if (mechs.includes('ground_level_fall')) labels.push(`ลื่น/สะดุดล้มระดับพื้นราบ${patient.fallMechGroundDetail ? ` (${patient.fallMechGroundDetail})` : ''}`);
  if (mechs.includes('bed_chair_fall')) labels.push('ตกจากเตียง/เก้าอี้');
  if (mechs.includes('stairs_fall')) labels.push(`ตกบันได${patient.fallMechStairsDetail ? ` (${patient.fallMechStairsDetail})` : ''}`);
  if (mechs.includes('height_fall')) {
    const hMap = { under_2m: 'สูง < 2 เมตร', '2_to_3m': 'สูงประมาณ 2–3 เมตร', over_3m: 'สูง > 3 เมตร (High-Energy)' };
    const hStr = hMap[patient.fallHeightLevel] || '';
    labels.push(`พลัดตกจากที่สูง${hStr ? ` [${hStr}]` : ''}${patient.fallMechHeightDetail ? ` (${patient.fallMechHeightDetail})` : ''}`);
  }
  if (mechs.includes('blunt_heavy_impact')) labels.push(`ชนกระแทก/ของหนักทับ${patient.fallMechBluntDetail ? ` (${patient.fallMechBluntDetail})` : ''}`);
  if (mechs.includes('sports_injury')) labels.push(`บาดเจ็บจากการเล่นกีฬา${patient.fallMechSportsDetail ? ` (${patient.fallMechSportsDetail})` : ''}`);
  if (mechs.includes('ankle_sprain')) labels.push(`ข้อเท้าพลิก${patient.fallMechAnkleDetail ? ` (${patient.fallMechAnkleDetail})` : ''}`);
  if (mechs.includes('sports_twist')) labels.push(`บาดเจ็บจากการเล่นกีฬา/ข้อพลิกผิดท่า${patient.fallMechSportsDetail ? ` (${patient.fallMechSportsDetail})` : ''}`);
  if (mechs.includes('other_mechanism')) labels.push(`สาเหตุอื่น${patient.fallMechOtherDetail ? ` (${patient.fallMechOtherDetail})` : ''}`);
  return labels.join(', ');
}

function formatFallWoundStatus(patient) {
  const map = {
    no_wound: 'ไม่มีบาดแผลเปิด (เฉพาะปวดบวมฟกช้ำ)',
    abrasion_stopped: 'มีแผลถลอก/แผลแตกแต่เลือดหยุดแล้ว',
    active_oozing: 'มีแผลฉีกขาด เลือดไหลซึมต่อเนื่อง',
    active_spurting: 'มีแผลเลือดไหลพุ่งเป็นจังหวะตามชีพจร (Active Spurting)'
  };
  return map[patient.fallWoundStatus] || 'ไม่ได้ระบุ';
}

function formatFallProdrome(patient) {
  if (patient.fallProdrome === 'has_prodrome') {
    return patient.fallProdromeDetail
      ? `มีอาการวูบ หน้ามืด เวียนศีรษะ ใจสั่น หรืออ่อนแรงนำมาก่อนล้ม (${patient.fallProdromeDetail}) (Syncopal Fall)`
      : 'มีอาการวูบ หน้ามืด เวียนศีรษะ ใจสั่น หรืออ่อนแรงนำมาก่อนล้ม (Syncopal Fall)';
  }
  if (patient.fallProdrome === 'no_prodrome') return 'ไม่มีอาการผิดปกตินำมาก่อน (อุบัติเหตุโดยตรง Mechanical Fall)';
  return 'ไม่ได้ระบุ';
}

function formatFallAntithrombotic(patient) {
  const map = {
    on_anticoagulant_antiplatelet: 'รับประทานยาละลายลิ่มเลือด/ต้านเกล็ดเลือด (Warfarin/DOACs/Aspirin)',
    coagulopathy_history: 'มีโรคประจำตัวเลือดออกง่ายหรือหยุดยาก (ตับแข็ง/เกล็ดเลือดต่ำ)',
    unknown_meds: 'มียาประจำตัวแต่ไม่ทราบชื่อยา',
    no_antithrombotic: 'ไม่ได้ใช้ยาละลายลิ่มเลือดและไม่มีโรคเลือดออกง่าย'
  };
  return map[patient.fallAntithrombotic] || 'ไม่ได้ระบุ';
}

function formatFallAnatomy(patient) {
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

  if (patient.fallParentHeadFace) {
    const subs = [];
    if (patient.fallHeadScalp) subs.push(`หนังศีรษะ/ท้ายทอย${sideLabel(patient.fallHeadScalpSides, patient.fallHeadScalpInjuries)}`);
    if (patient.fallHeadFace) subs.push(`ใบหน้า/ขากรรไกร${sideLabel(patient.fallHeadFaceSides, patient.fallHeadFaceInjuries)}`);
    if (patient.fallHeadEye) subs.push(`ดวงตา/เบ้าตา${sideLabel(patient.fallHeadEyeSides, patient.fallHeadEyeInjuries)}`);
    if (patient.fallHeadEar) subs.push(`ใบหู${sideLabel(patient.fallHeadEarSides, patient.fallHeadEarInjuries)}`);
    if (patient.fallHeadNoseMouth) subs.push(`จมูก/ฟัน/ช่องปาก${sideLabel(patient.fallHeadNoseMouthSides, patient.fallHeadNoseMouthInjuries)}`);
    parts.push(`ศีรษะ/ใบหน้า: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }
  if (patient.fallParentNeck) {
    const subs = [];
    if (patient.fallNeckSpine) subs.push(`กระดูกต้นคอ${sideLabel(patient.fallNeckSpineSides, patient.fallNeckSpineInjuries)}`);
    if (patient.fallNeckFront) subs.push(`คอด้านหน้า${sideLabel(patient.fallNeckFrontSides, patient.fallNeckFrontInjuries)}`);
    if (patient.fallNeckSide) subs.push(`คอด้านข้าง${sideLabel(patient.fallNeckSideSides, patient.fallNeckSideInjuries)}`);
    parts.push(`ลำคอ/ต้นคอ: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }
  if (patient.fallParentChest) {
    const subs = [];
    if (patient.fallChestRibs) subs.push(`หน้าอก/ซี่โครง${sideLabel(patient.fallChestRibsSides, patient.fallChestRibsInjuries)}`);
    if (patient.fallChestClavicle) subs.push(`ไหปลาร้า${sideLabel(patient.fallChestClavicleSides, patient.fallChestClavicleInjuries)}`);
    if (patient.fallChestUpperBack) subs.push(`หลังส่วนบน/สะบัก${sideLabel(patient.fallChestUpperBackSides, patient.fallChestUpperBackInjuries)}`);
    parts.push(`ทรวงอก/ไหปลาร้า: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }
  if (patient.fallParentAbdomen) {
    const subs = [];
    if (patient.fallAbdWall) subs.push(`หน้าท้อง${sideLabel(patient.fallAbdWallSides, patient.fallAbdWallInjuries)}`);
    if (patient.fallAbdFlank) subs.push(`สีข้าง/บั้นเอว${sideLabel(patient.fallAbdFlankSides, patient.fallAbdFlankInjuries)}`);
    if (patient.fallAbdLowerBack) subs.push(`หลังส่วนล่าง/เอว${sideLabel(patient.fallAbdLowerBackSides, patient.fallAbdLowerBackInjuries)}`);
    if (patient.fallAbdPelvisHip) subs.push(`สะโพก/เชิงกราน/ก้นกบ${sideLabel(patient.fallAbdPelvisHipSides, patient.fallAbdPelvisHipInjuries)}`);
    if (patient.fallAbdGenitalia) subs.push(`ขาหนีบ/อวัยวะเพศ${sideLabel(patient.fallAbdGenitaliaSides, patient.fallAbdGenitaliaInjuries)}`);
    parts.push(`ช่องท้อง/สะโพก/เชิงกราน: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }
  if (patient.fallParentUpperExtremity) {
    const subs = [];
    if (patient.fallArmShoulder) subs.push(`หัวไหล่/ต้นแขน${sideLabel(patient.fallArmShoulderSides, patient.fallArmShoulderInjuries)}`);
    if (patient.fallArmElbow) subs.push(`ข้อศอก/แขนท่อนล่าง${sideLabel(patient.fallArmElbowSides, patient.fallArmElbowInjuries)}`);
    if (patient.fallArmWrist) subs.push(`ข้อมือ/มือ${sideLabel(patient.fallArmWristSides, patient.fallArmWristInjuries)}`);
    if (patient.fallArmFingers) subs.push(`นิ้วมือ${fmtDigitsBySide(patient.fallArmFingersLeftDigits, patient.fallArmFingersRightDigits, patient.fallArmFingersSides, patient.fallArmFingersDigits, patient.fallArmFingersInjuries)}`);
    parts.push(`แขน/มือ: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }
  if (patient.fallParentLowerExtremity) {
    const subs = [];
    if (patient.fallLegThigh) subs.push(`ต้นขา${sideLabel(patient.fallLegThighSides, patient.fallLegThighInjuries)}`);
    if (patient.fallLegKneeShin) subs.push(`เข่า/หน้าแข้ง${sideLabel(patient.fallLegKneeShinSides, patient.fallLegKneeShinInjuries)}`);
    if (patient.fallLegAnkleFoot) subs.push(`ข้อเท้า/เท้า${sideLabel(patient.fallLegAnkleFootSides, patient.fallLegAnkleFootInjuries)}`);
    if (patient.fallLegToes) subs.push(`นิ้วเท้า${fmtDigitsBySide(patient.fallLegToesLeftDigits, patient.fallLegToesRightDigits, patient.fallLegToesSides, patient.fallLegToesDigits, patient.fallLegToesInjuries)}`);
    parts.push(`ขา/เท้า: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }
  if (patient.fallParentOther) {
    parts.push(`ตำแหน่งอื่นๆ: ${patient.fallOtherLocationDetail || 'ระบุตำแหน่งอื่น'}`);
  }
  return parts.length > 0 ? parts.join(' | ') : 'ไม่ได้ระบุตำแหน่งบาดเจ็บชัดเจน';
}

// --- Rapid Note Generator (5 Standardized Sections) ---
function renderFallRapidHpi(patient) {
  const durVal = patient.durationVal;
  const durUnitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durUnit = durUnitMap[patient.durationUnit] || 'ชั่วโมง';
  const durText = durVal ? `${durVal} ${durUnit}` : 'ไม่ระบุระยะเวลา';

  const rfs = evaluateFallRedFlags(patient);
  const mechsText = formatFallMechanisms(patient);
  const prodromeText = formatFallProdrome(patient);
  const woundText = formatFallWoundStatus(patient);
  const anatomyText = formatFallAnatomy(patient);
  const bloodThinnerText = formatFallAntithrombotic(patient);

  const headSigns = Array.isArray(patient.fallHeadSigns) ? patient.fallHeadSigns : [];
  const neckSigns = Array.isArray(patient.fallNeckSigns) ? patient.fallNeckSigns : [];
  const chestSigns = Array.isArray(patient.fallChestSigns) ? patient.fallChestSigns : [];
  const abdSigns = Array.isArray(patient.fallAbdomenSigns) ? patient.fallAbdomenSigns : [];
  const upperSigns = Array.isArray(patient.fallUpperExtSigns) ? patient.fallUpperExtSigns : [];
  const lowerSigns = Array.isArray(patient.fallLowerExtSigns) ? patient.fallLowerExtSigns : [];
  const sysSigns = Array.isArray(patient.fallSystemicSigns) ? patient.fallSystemicSigns : [];

  const positives = [];
  const negatives = [];
  if (patient.fallProdrome === 'has_prodrome') positives.push('มีอาการวูบ หน้ามืด หรือใจสั่นนำมาก่อนล้ม');
  else if (patient.fallProdrome === 'no_prodrome') negatives.push('ไม่มีอาการวูบหรือหน้ามืดนำมาก่อน');
  if (patient.fallHeightLevel === 'over_3m') positives.push('ตกจากที่สูง > 3 เมตร (High-Energy Fall)');
  if (headSigns.includes('loss_of_consciousness')) positives.push('มีอาการสลบ/หมดสติชั่วขณะ หรือจำเหตุการณ์ไม่ได้');
  else if (patient.fallParentHeadFace) negatives.push('ไม่มีประวัติสลบหรือหมดสติ');
  if (headSigns.includes('severe_headache_vomit_drowsy')) positives.push('ปวดศีรษะรุนแรง ซึมลง หรือมีอาเจียน');
  if (headSigns.includes('csf_leak_ear_nose')) positives.push('มีเลือดหรือน้ำใสไหลออกจากรูหู/จมูก (สงสัย Basilar skull fracture)');
  if (headSigns.includes('jaw_malocclusion') || headSigns.includes('jaw_malocclusion_broken_tooth')) positives.push('อ้าปากไม่ได้ ขากรรไกรค้าง หรือสบฟันไม่สนิท');
  if (headSigns.includes('broken_loose_tooth')) positives.push('ฟันหัก บิ่น หรือฟันโยกคลอน');
  if (neckSigns.includes('severe_cervical_pain_limited_rom')) positives.push('ปวดตึงแนวกระดูกต้นคอรุนแรง ขยับคอไม่ได้');
  if (neckSigns.includes('radicular_shock_numbness_weakness')) positives.push('มีอาการชา/ไฟช็อต/อ่อนแรงร้าวลงแขนขา');
  if (chestSigns.includes('dyspnea_shortness_of_breath')) positives.push('หายใจหอบเหนื่อย แน่นหน้าอก');
  if (chestSigns.includes('pleuritic_chest_pain')) positives.push('เจ็บแปล๊บหน้าอกเวลาหายใจเข้าลึก');
  if (abdSigns.includes('severe_abd_pain_distension')) positives.push('ปวดท้องรุนแรง ท้องอืดตึง');
  if (abdSigns.includes('pelvic_hip_pain_cannot_bear_weight')) positives.push('ปวดสะโพก/เชิงกรานมากจนขยับขาไม่ได้');
  if (abdSigns.includes('sciatica_numbness_cauda_equina')) positives.push('ปวดร้าวลงขา ชาขา หรือกลั้นปัสสาวะ/อุจจาระไม่ได้');
  if (abdSigns.includes('urinary_retention_hematuria')) positives.push('ปัสสาวะไม่ออกหรือมีเลือดปน');
  if (upperSigns.includes('deformity_dislocation_arm')) positives.push('แขน/ข้อมือ/นิ้วมือ บวมผิดรูปหรือข้อหลุด');
  if (upperSigns.includes('open_fracture_arm')) positives.push('กระดูกแขนหักแบบมีแผลเปิด (Open fracture)');
  if (upperSigns.includes('vascular_cold_pale_hand')) positives.push('ปลายมือซีดเย็นขาดเลือด');

  if (lowerSigns.includes('deformity_shortened_external_rotation_leg')) positives.push('ขาผิดรูป ขาสั้นลงและบิดหมุนออกนอก (สงสัย Hip fracture)');
  if (lowerSigns.includes('inability_to_bear_weight')) positives.push('ยืนหรือเดินลงน้ำหนักไม่ได้เลย');
  if (lowerSigns.includes('open_fracture_leg')) positives.push('กระดูกขาหักแบบมีแผลเปิด (Open fracture)');
  if (lowerSigns.includes('vascular_cold_pale_foot')) positives.push('ปลายเท้าซีดเย็นขาดเลือด');

  if (sysSigns.includes('dizziness_presyncope') || sysSigns.includes('palpitation_cold_sweat')) positives.push('มีอาการหน้ามืด ใจสั่น เหงื่อแตกตัวเย็น (ภาวะช็อก)');

  if (sysSigns.includes('no_systemic_signs')) negatives.push('ไม่มีอาการหน้ามืด วูบ หรือภาวะช็อก');
  if (patient.otherSymptomsFree && String(patient.otherSymptomsFree).trim()) positives.push(`ข้อมูลเพิ่มเติมจากผู้ป่วย: ${String(patient.otherSymptomsFree).trim()}`);
  if (positives.length === 0) positives.push('ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม');
  if (negatives.length === 0) negatives.push('ผู้ป่วยไม่ได้ระบุคำตอบยืนยันในหมวดอาการร่วม');

  let pScoreStr = 'ไม่ได้ระบุ';
  if (patient.painScore !== null && patient.painScore !== undefined) {
    pScoreStr = `${patient.painScore}/10`;
  }

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

  const tMap = {
    within_5_years: 'เคยฉีดเข็มกระตุ้นภายใน 5 ปีที่ผ่านมา',
    '5_to_10_years': 'เคยฉีดในช่วง 5–10 ปีที่ผ่านมา',
    more_than_10_years: 'เคยฉีดครบ แต่เกิน 10 ปีแล้ว',
    over_10_years: 'เคยฉีดครบ แต่เกิน 10 ปีแล้ว',
    never_or_unsure: 'ไม่เคยฉีด หรือจำประวัติไม่ได้',
    unknown_or_never: 'ไม่เคยฉีด หรือจำประวัติไม่ได้'
  };
  const pregMap = { not_pregnant: 'ไม่ได้ตั้งครรภ์ / ประจำเดือนมาปกติ', suspected_or_missed: 'ขาดประจำเดือน / สงสัยอาจตั้งครรภ์', confirmed_pregnant: 'ยืนยันกำลังตั้งครรภ์', menopause_or_hysterectomy: 'วัยหมดประจำเดือน / ผ่าตัดมดลูกแล้ว', unknown: 'ไม่ทราบสถานะการตั้งครรภ์' };
  const tetText = patient.fallTetanusHx ? `\n• ประวัติวัคซีนบาดทะยัก: ${tMap[patient.fallTetanusHx] || patient.fallTetanusHx}` : '';
  const femText = (isFallFemalePatient(patient) && (patient.fallLmpDate || patient.fallPregnancyStatus)) ? `\n• ประวัติสตรี: LMP ${patient.fallLmpDate || 'ไม่ระบุ'} (${pregMap[patient.fallPregnancyStatus] || 'ไม่ได้ระบุ'})` : '';
  const rfText = rfs.length > 0
    ? `🚩 RED FLAGS DETECTED (${rfs.length} รายการ):\n${rfs.map(r => `  * [${r.level}] ${r.title}`).join('\n')}`
    : '✓ ไม่พบสัญญาณเตือนวิกฤต ESI 1-2 ในขณะคัดกรอง (Low-Risk Blunt/Fall Trauma)';

  return `[Chief Complaint (CC)]
พลัดตกหกล้ม / ได้รับบาดเจ็บทางกายภาพ เป็นมา ${durText}

[History of Present Illness (HPI)]
• กลไกการบาดเจ็บและระยะเวลา: ${mechsText} | เป็นมา ${durText}
• อาการนำก่อนเกิดเหตุ: ${prodromeText}
• ตำแหน่งบาดเจ็บและชนิดการบาดเจ็บ: ${anatomyText}
• สถานะบาดแผลภายนอก: ${woundText}
• ระดับความปวด (Pain Score): ${pScoreStr}

• Pertinent Positives:
${positives.map(p => `  - ${p}`).join('\n')}

• Pertinent Negatives:
${negatives.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• ประวัติยาละลายลิ่มเลือด/ต้านเกล็ดเลือด: ${bloodThinnerText}${tetText}${femText}
• โรคประจำตัว (U/D): ${udDisplay}
• ยาประจำตัว (Current Meds): ${medsText}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${allergyDisplay}

[Emergency Risk Assessment (Red Flags)]
${rfText}

[Doctor's Clinical Addendum & Exam]
• บันทึกประวัติเพิ่มเติมหรือแก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}
• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}
• แผนการรักษาและคำสั่งการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;
}

function renderFallNarrative(patient) {
  const durVal = patient.durationVal;
  const durUnitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durUnit = durUnitMap[patient.durationUnit] || 'ชั่วโมง';
  const durText = durVal ? `${durVal} ${durUnit}` : 'ไม่ระบุเวลา';

  const mechsText = formatFallMechanisms(patient);
  const anatomyText = formatFallAnatomy(patient);
  const prodromeText = formatFallProdrome(patient);
  const woundText = formatFallWoundStatus(patient);

  let pScoreStr = 'ไม่ได้ระบุ';
  if (patient.painScore !== null && patient.painScore !== undefined) {
    pScoreStr = `${patient.painScore}/10`;
  }

  let text = `ผู้ป่วยมาด้วยอาการพลัดตกหกล้ม / ได้รับบาดเจ็บทางกายภาพ เป็นมาประมาณ ${durText} กลไกการเกิดเหตุ: ${mechsText} (${prodromeText}) `;
  text += `ตรวจพบตำแหน่งบาดเจ็บและชนิดการบาดเจ็บ: ${anatomyText} สถานะบาดแผลภายนอก: ${woundText} ระดับความปวด ${pScoreStr} `;

  if (patient.fallAntithrombotic && patient.fallAntithrombotic !== 'no_antithrombotic') {
    text += `ผู้ป่วยมีประวัติ ${formatFallAntithrombotic(patient)} `;
  }

  if (isFallFemalePatient(patient) && (patient.fallLmpDate || patient.fallPregnancyStatus)) {
    const pregMap = { not_pregnant: 'ไม่ได้ตั้งครรภ์ / ประจำเดือนมาปกติ', suspected_or_missed: 'ขาดประจำเดือน / สงสัยอาจตั้งครรภ์', confirmed_pregnant: 'ยืนยันกำลังตั้งครรภ์', menopause_or_hysterectomy: 'วัยหมดประจำเดือน / ผ่าตัดมดลูกแล้ว', unknown: 'ไม่ทราบสถานะการตั้งครรภ์' };
    text += `ประวัติสตรี: LMP ${patient.fallLmpDate || 'ไม่ระบุ'} (${pregMap[patient.fallPregnancyStatus] || 'ไม่ได้ระบุ'}) `;
  }
  if (patient.otherSymptomsFree) {
    text += `ข้อมูลเพิ่มเติม: ${patient.otherSymptomsFree}`;
  }

  return text.trim();
}

function renderFallDoctorHpi(patient) {
  return renderFallRapidHpi(patient);
}

function updateFallOutputs(rec) {
  if (!rec) return;
  const rapidText = renderFallRapidHpi(rec);
  const narrativeText = renderFallNarrative(rec);

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

  const redFlags = evaluateFallRedFlags(rec);
  rec.redFlags = redFlags;

  const jsonOutput = {
    encounter: {
      chief_complaint: 'fall_trauma',
      chief_complaint_title_th: 'พลัดตกหกล้ม / ได้รับบาดเจ็บทางกายภาพ',
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
      mechanisms: Array.isArray(rec.fallMechanisms) ? rec.fallMechanisms : [],
      height_level: rec.fallHeightLevel || null,
      prodrome: rec.fallProdrome || null,
      prodrome_detail: rec.fallProdromeDetail || '',
      wound_status: rec.fallWoundStatus || null,
      pain_score: rec.painScore,
      antithrombotic: rec.fallAntithrombotic || null,
      tetanus_history: rec.fallTetanusHx || null,
      anatomical_regions: {
        head_face: !!rec.fallParentHeadFace,
        neck: !!rec.fallParentNeck,
        chest: !!rec.fallParentChest,
        abdomen: !!rec.fallParentAbdomen,
        upper_extremity: !!rec.fallParentUpperExtremity,
        lower_extremity: !!rec.fallParentLowerExtremity,
        other: !!rec.fallParentOther,
        other_detail: rec.fallOtherLocationDetail || ''
      },
      fingers_digits: Array.isArray(rec.fallArmFingersDigits) ? rec.fallArmFingersDigits : [],
      fingers_left_digits: Array.isArray(rec.fallArmFingersLeftDigits) ? rec.fallArmFingersLeftDigits : [],
      fingers_right_digits: Array.isArray(rec.fallArmFingersRightDigits) ? rec.fallArmFingersRightDigits : [],
      toes_digits: Array.isArray(rec.fallLegToesDigits) ? rec.fallLegToesDigits : [],
      toes_left_digits: Array.isArray(rec.fallLegToesLeftDigits) ? rec.fallLegToesLeftDigits : [],
      toes_right_digits: Array.isArray(rec.fallLegToesRightDigits) ? rec.fallLegToesRightDigits : [],
      systemic_signs: Array.isArray(rec.fallSystemicSigns) ? rec.fallSystemicSigns : [],
      other_symptoms_free: rec.otherSymptomsFree || ''
    },
    safety_and_red_flags: {
      red_flags_detected: redFlags.map(rf => ({
        key: rf.key,
        level: rf.level,
        title_th: rf.title,
        clinical_risk: rf.detail,
        action: rf.action
      })),
      total_red_flags: redFlags.length
    }
  };
  const jsonEl = document.getElementById('jsonViewer');
  if (jsonEl) jsonEl.textContent = JSON.stringify(jsonOutput, null, 2);
  return { rapid: rapidText, narrative: narrativeText, json: jsonOutput };
}

// --- FEMALE LMP & ANATOMY HELPERS ---
function isFallFemalePatient(p) {
  if (!p) return false;
  if (p.gender === 'หญิง' || p.gender === 'female') return true;
  if (p.gender === 'ชาย' || p.gender === 'male') return false;
  return /นาง|น\.ส\.|ด\.ญ\.|\(หญิง\)|Mrs|Miss|Ms/i.test(`${p.patientTitle || ''} ${p.name || p.patientName || ''}`);
}
function toggleFallFemaleSection(forceShow) {
  const sec = document.getElementById('fallFemaleSection');
  if (!sec) return;
  const show = typeof forceShow === 'boolean' ? forceShow : sec.classList.contains('hidden');
  sec.classList.toggle('hidden', !show);
  if (!show) {
    const lmp = document.getElementById('fallLmpDate'); if (lmp) lmp.value = '';
    document.querySelectorAll('input[name="fallPregnancyStatus"]').forEach(r => { r.checked = false; });
  }
}
function checkAndDisplayFallLmp(patient) {
  if (patient && (patient.gender || patient.name || patient.patientName || patient.patientTitle)) {
    toggleFallFemaleSection(isFallFemalePatient(patient)); return;
  }
  const titleVal = document.getElementById('patientTitleSelect')?.value || '';
  toggleFallFemaleSection(/นาง|น\.ส\.|ด\.ญ\.|\(หญิง\)|Mrs|Miss|Ms/i.test(titleVal));
}
function renderFallPart(id, label, hasCenter = false) {
  return `<div class="p-2.5 rounded-xl border border-slate-200 bg-white">
  <label class="flex items-center cursor-pointer">
    <input type="checkbox" id="${id}" onchange="toggleFallGroup('${id}SidesContainer', this.checked)" class="text-medical-600 h-4 w-4 rounded flex-shrink-0">
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
function renderFallDigits(id, label) {
  const digits = [['thumb','โป้ง'],['index','ชี้'],['middle','กลาง'],['ring','นาง'],['little','ก้อย']];
  const row = (sideName, sideLabel) => `<div class="flex items-center flex-wrap gap-2"><span class="text-[11px] font-semibold text-slate-500 w-9">${sideLabel}:</span>${digits.map(([v,t]) => `<label class="inline-flex items-center cursor-pointer"><input type="checkbox" name="${id}${sideName}" value="${v}" class="mr-1 text-medical-600 rounded"> ${t}</label>`).join('')}</div>`;
  return `<div class="p-2.5 rounded-xl border border-slate-200 bg-white">
  <label class="flex items-center cursor-pointer">
    <input type="checkbox" id="${id}" onchange="toggleFallGroup('${id}SidesContainer', this.checked)" class="text-medical-600 h-4 w-4 rounded flex-shrink-0">
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
function renderFallRegionBox({
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
      <input type="checkbox" id="${parentId}" onchange="toggleFallGroup('${subGroupId}', this.checked)" class="text-medical-600 focus:ring-medical-500 h-5 w-5 rounded flex-shrink-0">
      <div class="ml-3 leading-snug">
        <span class="text-sm font-bold text-slate-900">${Array.isArray(title) ? wrapFallWords(title) : title}</span>
        <p class="text-xs text-slate-500 mt-0.5">${desc}</p>
      </div>
    </label>
    <div id="${subGroupId}" class="hidden pl-4 sm:pl-6 space-y-4 border-l-2 border-medical-200">
      <div>
        <p class="text-xs text-slate-600 font-semibold mb-2">จุดที่บาดเจ็บ (เลือกแล้วระบุด้านและลักษณะบาดเจ็บ):</p>
        <div class="space-y-2">${partsHtml}</div>
      </div>
      <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
        ${renderFallSysHeader({
          label: 'อาการสำคัญที่พบร่วมด้วย (เลือกได้หลายข้อ)',
          icon: 'alert-circle',
          colorClass: 'bg-amber-100 text-amber-700',
          toggleId: signsNoneId,
          toggleLabel: 'ไม่มีอาการร่วม',
          toggleOnchange: `handleFallGroupNoneToggle(this, '${signsName}')`
        })}
        ${renderFallGrid(signsCols, signs, {
          name: signsName,
          compact: true,
          onchange: `handleFallGroupItemChange(this, '${signsNoneId}')`
        })}
      </div>
    </div>
  </div>`;
}

// --- FORM HTML TEMPLATE ---
const FALL_TRAUMA_FORM_HTML = `
<div id="cc-fall-trauma-section" class="hidden space-y-6">
  <div data-cc-top-banner="fall_trauma"><div class="flex flex-col gap-4">
  <!-- 💡 ส่วนต้น: ข้อแนะนำการปฏิบัติตัวเบื้องต้นระหว่างรอตรวจ -->
  <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs sm:text-sm text-amber-900 shadow-sm flex items-start space-x-3">
    <div class="text-amber-600 mt-0.5 flex-shrink-0">
      <i data-lucide="info" class="w-5 h-5"></i>
    </div>
    <div class="space-y-1">
      <div class="font-bold text-amber-950">ข้อแนะนำระหว่างรอพบแพทย์:</div>
      <ul class="list-disc pl-4 space-y-1 text-amber-800 text-xs">
        <li><strong>ห้ามขยับ ดึง หรือดัดส่วนที่ผิดรูป:</strong> หากสงสัยกระดูกหัก ข้อหลุด หรือปวดต้นคอ/หลัง <strong>ให้อยู่นิ่งในท่าที่สบายที่สุด</strong></li>
        <li><strong>หากมีแผลเลือดออก:</strong> ใช้ผ้าสะอาดกดลงบนแผลโดยตรงให้แน่นต่อเนื่อง</li>
        <li><strong>ควรงดน้ำและอาหารชั่วคราว:</strong> หากปวดรุนแรง แขนขาผิดรูป หรือปวดศีรษะ/ท้องมาก เผื่อกรณีต้องให้ยาระงับความรู้สึกหรือผ่าตัด</li>
      </ul>
    </div>
  </div>
  </div></div>

  <!-- CARD 1: ข้อมูลเหตุการณ์ กลไก และอาการนำ -->
  <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
    <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
        <i data-lucide="alert-circle" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900">1. ข้อมูลเหตุการณ์ กลไก และอาการนำก่อนเกิดเหตุ</h2>
        <p class="text-xs text-slate-500">ระยะเวลา กลไกการบาดเจ็บ ความสูง อาการวูบนำ และสถานะแผล</p>
      </div>
    </div>

    <!-- 1.1 ระยะเวลาที่เกิดเหตุ -->
    <div>
      <label class="block text-xs font-semibold text-slate-800 mb-1.5">
        1.1 พลัดตกหกล้มหรือได้รับบาดเจ็บมานานเท่าไรแล้ว <span class="text-rose-500">*</span>
      </label>
      <div class="flex items-center gap-2 max-w-sm">
        <input type="number" id="fallDurationVal" min="1" max="365" placeholder="เช่น 2"
          class="w-24 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white transition">
        <select id="fallDurationUnit"
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

    <!-- 1.2 ลักษณะเหตุการณ์ หรือกลไกการบาดเจ็บ -->
    <div class="pt-3 border-t border-slate-100">
      <label class="block text-xs font-semibold text-slate-800 mb-2">
        1.2 กลไกหรือลักษณะเหตุการณ์ (เลือกได้หลายข้อ):
      </label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        ${renderFallMechCard('ground_level_fall', ['ลื่นล้ม / สะดุดล้ม'], 'หกล้มระดับพื้นราบขณะเดินหรือยืน', 'fallMechGroundDetailContainer', 'fallMechGroundDetail', 'พิมพ์ระบุ เช่น ลื่นในห้องน้ำ, สะดุดขอบฟุตบาท...')}
        <div>
          ${renderFallOption({
            name: 'fallMechanisms',
            value: 'bed_chair_fall',
            title: ['ตกเตียง / เก้าอี้'],
            desc: 'ตกจากเตียง โซฟา หรือที่นั่งไม่สูง'
          })}
        </div>
        ${renderFallMechCard('stairs_fall', ['ตกบันได'], 'ลื่นหรือก้าวพลาดตกขั้นบันได', 'fallMechStairsDetailContainer', 'fallMechStairsDetail', 'พิมพ์ระบุ เช่น ตกบันได 5 ขั้น, ตกชั้นลอย...')}
        <div>
          ${renderFallOption({
            name: 'fallMechanisms',
            value: 'height_fall',
            title: ['พลัดตกจากที่สูง'],
            desc: 'ต้นไม้ หลังคา นั่งร้าน ระเบียง อาคาร',
            onchange: "toggleFallGroup('fallMechHeightContainer', this.checked)"
          })}
          <div id="fallMechHeightContainer" class="hidden mt-2 pl-3 border-l-2 border-medical-200 space-y-2">
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span class="text-xs font-semibold text-slate-700 block">ระดับความสูงโดยประมาณ:</span>
              ${renderFallGrid('grid-cols-1', [
                { kind: 'radio', name: 'fallHeightLevel', value: 'under_2m', title: ['ไม่เกิน 2 เมตร'], desc: 'ต่ำกว่า 1 ชั้น', compact: true },
                { kind: 'radio', name: 'fallHeightLevel', value: '2_to_3m', title: ['2 – 3 เมตร'], desc: 'ประมาณ 1 ชั้น', compact: true },
                { kind: 'radio', name: 'fallHeightLevel', value: 'over_3m', title: ['เกิน 3 เมตร'], desc: 'ชั้น 2 ขึ้นไป', compact: true }
              ])}
              <input type="text" id="fallMechHeightDetail" placeholder="พิมพ์ระบุสิ่งที่ตกลงมา เช่น ตกต้นไม้สูง 3 เมตร, ตกหลังคา..."
                class="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-medical-500">
            </div>
          </div>
        </div>
        ${renderFallMechCard('blunt_heavy_impact', ['ถูกกระแทก', '/ ของหนักทับ'], 'ชนสิ่งของ หรือของหนักหล่นใส่/ทับ', 'fallMechBluntDetailContainer', 'fallMechBluntDetail', 'พิมพ์ระบุสิ่งที่มากระแทกหรือทับ เช่น ตู้ล้มทับ, เหล็กหล่นใส่...')}
        ${renderFallMechCard('sports_injury', ['บาดเจ็บจากกีฬา'], 'ล้ม กระแทก หรือบิดระหว่างเล่นกีฬา', 'fallMechSportsDetailContainer', 'fallMechSportsDetail', 'พิมพ์ระบุ เช่น เล่นฟุตบอลชนกัน, ล้มขณะวิ่ง...')}
        ${renderFallMechCard('ankle_sprain', ['ข้อเท้าพลิก'], 'ก้าวพลาด ตกขอบ หรือข้อเท้าบิดพลิก', 'fallMechAnkleDetailContainer', 'fallMechAnkleDetail', 'พิมพ์ระบุ เช่น ก้าวพลาดตกขอบฟุตบาท, สะดุดพื้นต่างระดับ...')}
        ${renderFallMechCard('other_mechanism', ['สาเหตุอื่นๆ'], 'ระบุกลไกอื่นๆ เพิ่มเติม', 'fallMechOtherDetailContainer', 'fallMechOtherDetail', 'พิมพ์ระบุสาเหตุ...')}
      </div>
    </div>

    <!-- 1.3 อาการนำก่อนเกิดเหตุ -->
    <div class="pt-3 border-t border-slate-100">
      <label class="block text-xs font-semibold text-slate-800 mb-2">
        1.3 ก่อนล้มมีอาการผิดปกตินำมาก่อนหรือไม่ <span class="text-rose-500">*</span>
      </label>
      ${renderFallGrid('grid-cols-1 sm:grid-cols-2', [
        {
          kind: 'radio',
          name: 'fallProdrome',
          value: 'no_prodrome',
          title: ['ไม่มีอาการนำ'],
          desc: 'เกิดจากลื่น สะดุด หรืออุบัติเหตุโดยตรง',
          onchange: 'handleFallProdromeChange(this.value)',
          compact: true
        },
        {
          kind: 'radio',
          name: 'fallProdrome',
          value: 'has_prodrome',
          title: ['มีอาการนำ', 'ก่อนเกิดเหตุ'],
          desc: 'วูบ หน้ามืด ใจสั่น เจ็บอก หรืออ่อนแรงก่อนล้ม',
          onchange: 'handleFallProdromeChange(this.value)',
          compact: true
        }
      ])}
      <div id="fallProdromeDetailContainer" class="hidden mt-2.5 pl-3 border-l-2 border-medical-200">
        <input type="text" id="fallProdromeDetail" placeholder="พิมพ์ระบุอาการนำก่อนล้ม เช่น วูบ หน้ามืด ใจสั่น เจ็บหน้าอก แขนขาอ่อนแรง..."
          class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-slate-900 text-xs focus:ring-2 focus:ring-medical-500 focus:bg-white">
      </div>
    </div>

    <!-- 1.4 บาดแผลเปิดหรือเลือดออกภายนอก -->
    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
      ${renderFallSysHeader({
        label: '1.4 มีบาดแผลฉีกขาดหรือเลือดออกร่วมด้วยหรือไม่',
        icon: 'droplet',
        colorClass: 'bg-rose-100 text-rose-700',
        toggleKind: 'radio',
        toggleId: 'fallWoundNoneRb',
        toggleName: 'fallWoundStatus',
        toggleValue: 'no_wound',
        toggleLabel: 'ไม่มีแผล / เลือดออก'
      })}
      ${renderFallGrid('grid-cols-1 sm:grid-cols-3', [
        {
          kind: 'radio',
          name: 'fallWoundStatus',
          value: 'abrasion_stopped',
          title: ['แผลถลอก / แตก', 'เลือดหยุดแล้ว'],
          desc: 'ไม่มีเลือดไหลซึมต่อแล้ว',
          compact: true
        },
        {
          kind: 'radio',
          name: 'fallWoundStatus',
          value: 'active_oozing',
          title: ['แผลฉีกขาด', 'เลือดซึมต่อเนื่อง'],
          desc: 'ยังมีเลือดไหลซึมเรื่อยๆ',
          compact: true
        },
        {
          kind: 'radio',
          name: 'fallWoundStatus',
          value: 'active_spurting',
          title: ['แผลเลือดไหลพุ่ง', '/ ทะลักมาก'],
          desc: 'พุ่งตามชีพจร หรือออกมากผิดปกติ',
          compact: true
        }
      ])}
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
        <p class="text-xs text-slate-500">เลือกเฉพาะส่วนที่บาดเจ็บ ระบบจะเปิดช่องระบุด้านและอาการร่วมให้อัตโนมัติ</p>
      </div>
    </div>

    <div class="space-y-4">
      ${renderFallRegionBox({
        parentId: 'fallParentHeadFace',
        subGroupId: 'fallHeadSubGroup',
        title: ['2.1 ศีรษะ ใบหน้า', 'ดวงตา หรือในปาก'],
        desc: 'ศีรษะกระแทกพื้น แผลแตก โนบวม เจ็บใบหน้า/คาง/ฟัน',
        partsHtml: [
          renderFallPart('fallHeadScalp', 'หนังศีรษะ / หน้าผาก / ท้ายทอย', true),
          renderFallPart('fallHeadFace', 'ใบหน้า / คิ้ว / โหนกแก้ม / ขากรรไกร / คาง', true),
          renderFallPart('fallHeadEye', 'ดวงตา / เปลือกตา / เบ้าตา', false),
          renderFallPart('fallHeadEar', 'ใบหู', false),
          renderFallPart('fallHeadNoseMouth', 'จมูก / ริมฝีปาก / ฟัน / ในช่องปาก', true)
        ].join(''),
        signsName: 'fallHeadSigns',
        signsNoneId: 'fallHeadSignsNoneCb',
        signs: [
          { value: 'loss_of_consciousness', title: ['สลบ หมดสติ', 'จำเหตุการณ์ไม่ได้'] },
          { value: 'severe_headache_vomit_drowsy', title: ['ปวดหัวมาก ซึมลง', 'สับสน / อาเจียน'] },
          { value: 'vision_problem_eye_swelling', title: ['ตาพร่า ภาพซ้อน', 'บวมรอบเบ้าตา'], desc: 'หรือบวมจนลืมตาไม่ขึ้น' },
          { value: 'csf_leak_ear_nose', title: ['เลือดหรือน้ำใส', 'ออกหู / จมูก'] },
          { value: 'jaw_malocclusion', title: ['อ้าปากไม่ได้ /', 'ขากรรไกรค้าง'], desc: 'หรือสบฟันไม่สนิท เจ็บข้อต่อขากรรไกร' },
          { value: 'broken_loose_tooth', title: ['ฟันหัก / โยก'], desc: 'ฟันแตก บิ่น หลุด หรือโยกคลอน' }
        ]
      })}

      ${renderFallRegionBox({
        parentId: 'fallParentNeck',
        subGroupId: 'fallNeckSubGroup',
        title: ['2.2 ลำคอ หรือต้นคอ'],
        desc: 'เจ็บแนวกระดูกต้นคอ คอด้านหน้า หรือคอด้านข้าง',
        partsHtml: [
          renderFallPart('fallNeckSpine', 'ต้นคอด้านหลัง (แนวกระดูกต้นคอ)', true),
          renderFallPart('fallNeckFront', 'ลำคอด้านหน้า', true),
          renderFallPart('fallNeckSide', 'ลำคอด้านข้าง', false)
        ].join(''),
        signsName: 'fallNeckSigns',
        signsNoneId: 'fallNeckSignsNoneCb',
        signsCols: 'grid-cols-1 sm:grid-cols-3',
        signs: [
          { value: 'severe_cervical_pain_limited_rom', title: ['ปวดตึงต้นคอมาก', 'หัน / ก้มเงยไม่ได้'] },
          { value: 'radicular_shock_numbness_weakness', title: ['ชาแปล๊บไฟช็อต', 'อ่อนแรงแขนขา'] },
          { value: 'dyspnea_dysphagia_neck_swelling', title: ['หายใจ / กลืนลำบาก', 'เสียงแหบ / คอบวม'] }
        ]
      })}

      ${renderFallRegionBox({
        parentId: 'fallParentChest',
        subGroupId: 'fallChestSubGroup',
        title: ['2.3 หน้าอก ซี่โครง', 'ไหปลาร้า หรือหลังบน'],
        desc: 'กระแทกหน้าอก ซี่โครง ไหปลาร้า หรือสะบัก',
        partsHtml: [
          renderFallPart('fallChestRibs', 'หน้าอก / ซี่โครง', true),
          renderFallPart('fallChestClavicle', 'ไหปลาร้า', false),
          renderFallPart('fallChestUpperBack', 'หลังส่วนบน / สะบัก', true)
        ].join(''),
        signsName: 'fallChestSigns',
        signsNoneId: 'fallChestSignsNoneCb',
        signsCols: 'grid-cols-1 sm:grid-cols-3',
        signs: [
          { value: 'dyspnea_shortness_of_breath', title: ['หอบเหนื่อย', 'แน่นหน้าอก'] },
          { value: 'pleuritic_chest_pain', title: ['เจ็บอก / ซี่โครง', 'เวลาหายใจลึก / ไอ'] },
          { value: 'deformity_crepitus_clavicle_ribs', title: ['ไหปลาร้า / ซี่โครง', 'ปูดนูน ผิดรูป'] }
        ]
      })}

      ${renderFallRegionBox({
        parentId: 'fallParentAbdomen',
        subGroupId: 'fallAbdomenSubGroup',
        title: ['2.4 ช่องท้อง', 'หลังล่าง สะโพก', 'หรือก้นกบ'],
        desc: 'กระแทกหน้าท้อง เอว หลัง สะโพก เชิงกราน หรือก้นกบ',
        partsHtml: [
          renderFallPart('fallAbdWall', 'หน้าท้อง', true),
          renderFallPart('fallAbdFlank', 'สีข้าง / บั้นเอว', false),
          renderFallPart('fallAbdLowerBack', 'หลังส่วนล่าง (แนวกระดูกสันหลังส่วนเอว)', true),
          renderFallPart('fallAbdPelvisHip', 'สะโพก / เชิงกราน / ก้นกบ', true),
          renderFallPart('fallAbdGenitalia', 'ขาหนีบ / อวัยวะเพศ', true)
        ].join(''),
        signsName: 'fallAbdomenSigns',
        signsNoneId: 'fallAbdomenSignsNoneCb',
        signs: [
          { value: 'severe_abd_pain_distension', title: ['ปวดท้องรุนแรง', 'ท้องอืดตึง กดเจ็บ'] },
          { value: 'pelvic_hip_pain_cannot_bear_weight', title: ['ปวดสะโพก เชิงกราน', 'ลงน้ำหนักไม่ได้'] },
          { value: 'sciatica_numbness_cauda_equina', title: ['ปวดร้าวลงขา', 'ชาขา หรือ', 'กลั้นขับถ่ายไม่ได้'] },
          { value: 'urinary_retention_hematuria', title: ['ปัสสาวะไม่ออก', '/ ปัสสาวะเป็นเลือด'] }
        ]
      })}

      ${renderFallRegionBox({
        parentId: 'fallParentUpperExtremity',
        subGroupId: 'fallUpperExtSubGroup',
        title: ['2.5 ไหล่ แขน ศอก', 'ข้อมือ หรือมือ/นิ้ว'],
        desc: 'ล้มเอามือยันพื้น ไหล่กระแทก ศอกบวม ข้อมือผิดรูป',
        partsHtml: [
          renderFallPart('fallArmShoulder', 'หัวไหล่ / ต้นแขน', false),
          renderFallPart('fallArmElbow', 'ข้อศอก / แขนท่อนล่าง', false),
          renderFallPart('fallArmWrist', 'ข้อมือ / ฝ่ามือ / หลังมือ', false),
          renderFallDigits('fallArmFingers', 'นิ้วมือ')
        ].join(''),
        signsName: 'fallUpperExtSigns',
        signsNoneId: 'fallUpperExtSignsNoneCb',
        signs: [
          { value: 'deformity_dislocation_arm', title: ['แขน มือ นิ้ว', 'บวมโต ผิดรูป'] },
          { value: 'cannot_move_arm_hand', title: ['ยกแขน ขยับศอก', 'หรือกำมือไม่ได้'] },
          { value: 'nerve_numbness_arm', title: ['ชาแขน ฝ่ามือ', 'หรือปลายนิ้วมือ'] },
          { value: 'vascular_cold_pale_hand', title: ['ปลายนิ้วซีดขาว', 'เย็นเฉียบ / คล้ำ'] },
          { value: 'open_fracture_arm', title: ['แผลเปิดลึก', 'เห็นกระดูกโผล่'], colSpan2: true }
        ]
      })}

      ${renderFallRegionBox({
        parentId: 'fallParentLowerExtremity',
        subGroupId: 'fallLowerExtSubGroup',
        title: ['2.6 ต้นขา เข่า', 'ข้อเท้า หรือเท้า'],
        desc: 'ต้นขาบวม เข่าบิดกระแทก ข้อเท้าพลิก ยืนลงน้ำหนักไม่ได้',
        partsHtml: [
          renderFallPart('fallLegThigh', 'ต้นขา', false),
          renderFallPart('fallLegKneeShin', 'เข่า / หน้าแข้ง / น่อง', false),
          renderFallPart('fallLegAnkleFoot', 'ข้อเท้า / ส้นเท้า / ฝ่าเท้า / หลังเท้า', false),
          renderFallDigits('fallLegToes', 'นิ้วเท้า')
        ].join(''),
        signsName: 'fallLowerExtSigns',
        signsNoneId: 'fallLowerExtSignsNoneCb',
        signs: [
          { value: 'deformity_shortened_external_rotation_leg', title: ['ขา เข่า ข้อเท้า', 'ผิดรูป / ขาสั้นลง'] },
          { value: 'inability_to_bear_weight', title: ['เดินหรือยืน', 'ลงน้ำหนักไม่ได้เลย'] },
          { value: 'nerve_numbness_cannot_dorsiflex', title: ['มีอาการชา', 'กระดกเท้าไม่ได้'] },
          { value: 'vascular_cold_pale_foot', title: ['ปลายเท้าซีดขาว', 'เย็นเฉียบ / คล้ำ'] },
          { value: 'open_fracture_leg', title: ['แผลเปิดลึก', 'เห็นกระดูกโผล่'], colSpan2: true }
        ]
      })}

      <!-- 2.7 บาดแผลที่ตำแหน่งอื่นๆ (พิมพ์ระบุ) -->
      <div class="border border-slate-200 rounded-2xl p-3.5 bg-slate-50/50">
        <label class="selectable-card flex items-center cursor-pointer">
          <input type="checkbox" id="fallParentOther" onchange="toggleFallGroup('fallOtherSubGroup', this.checked)" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
          <span class="ml-3 text-xs sm:text-sm font-bold text-slate-900">2.7 บาดเจ็บที่ตำแหน่งอื่นๆ (พิมพ์ระบุ)</span>
        </label>
        <div id="fallOtherSubGroup" class="hidden mt-3 pl-6 border-l-2 border-medical-200 space-y-2">
          <label class="text-xs font-semibold text-slate-600 block">ระบุตำแหน่งบาดเจ็บเพิ่มเติม:</label>
          <input type="text" id="fallOtherLocationDetail" placeholder="เช่น รักแร้, ซอกคอ, ก้นกบ..." class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500">
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
        <p class="text-xs text-slate-500">ภาวะหน้ามืด เป็นลม ชัก และแถบประเมินความปวด</p>
      </div>
    </div>

    <!-- 3.1 อาการผิดปกติของร่างกายที่พบร่วมด้วย -->
    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
      ${renderFallSysHeader({
        label: '3.1 อาการผิดปกติของร่างกายที่พบร่วม (เลือกได้หลายข้อ)',
        icon: 'shield-alert',
        colorClass: 'bg-rose-100 text-rose-700',
        toggleId: 'fallSystemicNoneCb',
        toggleName: 'fallSystemicSigns',
        toggleValue: 'no_systemic_signs',
        toggleLabel: 'ไม่มีอาการในหมวดนี้',
        toggleOnchange: "handleFallGroupNoneToggle(this, 'fallSystemicSigns')"
      })}
      ${renderFallGrid('grid-cols-1 sm:grid-cols-2', [
        {
          name: 'fallSystemicSigns',
          value: 'dizziness_presyncope',
          title: ['หน้ามืด เวียนหัว', 'เวลาลุก / ขยับตัว'],
          onchange: "handleFallGroupItemChange(this, 'fallSystemicNoneCb')",
          compact: true
        },
        {
          name: 'fallSystemicSigns',
          value: 'palpitation_cold_sweat',
          title: ['ใจสั่น เหงื่อแตก', 'ตัวเย็น / หน้าซีด'],
          onchange: "handleFallGroupItemChange(this, 'fallSystemicNoneCb')",
          compact: true
        },
        {
          name: 'fallSystemicSigns',
          value: 'excessive_thirst_weakness',
          title: ['กระหายน้ำมาก', 'อ่อนเพลียไม่มีแรง'],
          onchange: "handleFallGroupItemChange(this, 'fallSystemicNoneCb')",
          compact: true
        },
        {
          name: 'fallSystemicSigns',
          value: 'post_fall_seizure',
          title: ['มีอาการชักเกร็ง', 'หลังเกิดเหตุ'],
          onchange: "handleFallGroupItemChange(this, 'fallSystemicNoneCb')",
          compact: true
        }
      ])}
    </div>

    <!-- 3.2 Pain Score Slider -->
    <div class="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label class="block text-xs font-semibold text-slate-800 uppercase tracking-wider">3.2 ระดับความเจ็บปวดในขณะนี้ (0 – 10)</label>
        <div class="flex items-center space-x-2">
          <span id="fallPainScoreBadge" class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all">
            <span id="fallPainScoreEmoji" class="text-base">⚪</span>
            <span id="fallPainScoreText">ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)</span>
          </span>
          <button type="button" id="fallPainScoreClearBtn" onclick="clearFallPainScore()" class="text-xs text-slate-400 hover:text-rose-600 underline hidden transition" title="ล้างค่าเพื่อให้เป็นไม่ได้ระบุ">ล้างค่า</button>
        </div>
      </div>
      <div class="px-1 pt-1">
        <input type="range" id="fallPainScore" min="0" max="10" value="0" step="1" oninput="handleFallPainScoreChange(this.value)" class="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-600 focus:outline-none focus:ring-2 focus:ring-medical-500">
      </div>
      <div class="grid grid-cols-5 text-center text-[10px] sm:text-[11px] pt-1 gap-1 text-slate-500 font-medium">
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setFallPainScore(0)"><span class="text-lg sm:text-xl block">😊</span><span>0: สบายดี</span></div>
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setFallPainScore(2)"><span class="text-lg sm:text-xl block">🙂</span><span>1–3: เล็กน้อย</span></div>
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setFallPainScore(5)"><span class="text-lg sm:text-xl block">😐</span><span>4–6: ปานกลาง</span></div>
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setFallPainScore(8)"><span class="text-lg sm:text-xl block">😣</span><span>7–9: ปวดมาก</span></div>
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setFallPainScore(10)"><span class="text-lg sm:text-xl block">😭</span><span>10: ปวดที่สุด</span></div>
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
        <p class="text-xs text-slate-500">ยาต้านการแข็งตัวของเลือด ยาต้านเกล็ดเลือด และวัคซีนบาดทะยัก</p>
      </div>
    </div>

    <!-- 4.1 ยาละลายลิ่มเลือด -->
    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
      ${renderFallSysHeader({
        label: '4.1 ยาละลายลิ่มเลือด หรือโรคเลือดหยุดยาก <span class="text-rose-500">*</span>',
        icon: 'pill',
        colorClass: 'bg-blue-100 text-blue-700',
        toggleKind: 'radio',
        toggleId: 'fallAntithromboticNoneRb',
        toggleName: 'fallAntithrombotic',
        toggleValue: 'no_antithrombotic',
        toggleLabel: 'ไม่มี / ไม่ได้ใช้'
      })}
      ${renderFallGrid('grid-cols-1 sm:grid-cols-3', [
        {
          kind: 'radio',
          name: 'fallAntithrombotic',
          value: 'on_anticoagulant_antiplatelet',
          title: ['ใช้ยาละลายลิ่มเลือด', '/ ต้านเกล็ดเลือด'],
          desc: 'เช่น วาร์ฟาริน แอสไพริน',
          compact: true
        },
        {
          kind: 'radio',
          name: 'fallAntithrombotic',
          value: 'coagulopathy_history',
          title: ['มีโรคเลือดออกง่าย', '/ หยุดยาก'],
          desc: 'เช่น ตับแข็ง เกล็ดเลือดต่ำ',
          compact: true
        },
        {
          kind: 'radio',
          name: 'fallAntithrombotic',
          value: 'unknown_meds',
          title: ['กินยาประจำตัว', 'แต่ไม่ทราบชื่อยา'],
          desc: 'จำชื่อยาไม่ได้',
          compact: true
        }
      ])}
    </div>

    <!-- 4.2 ประวัติการได้รับวัคซีนป้องกันบาดทะยัก (Locked Tetanus Standard) -->
    <div class="pt-3 border-t border-slate-100">
      <label class="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
        4.2 ประวัติการได้รับวัคซีนป้องกันบาดทะยัก
      </label>
      ${renderFallGrid('grid-cols-1 sm:grid-cols-2', [
        {
          kind: 'radio',
          name: 'fallTetanusHx',
          value: 'within_5_years',
          title: ['ฉีดกระตุ้น', 'ภายใน 5 ปี'],
          desc: 'เคยฉีดครบ (3 เข็ม) มาก่อน และเข็มสุดท้ายหรือกระตุ้นไม่เกิน 5 ปี',
          compact: true
        },
        {
          kind: 'radio',
          name: 'fallTetanusHx',
          value: '5_to_10_years',
          title: ['ฉีดล่าสุด', '5–10 ปีก่อน'],
          desc: 'เคยฉีดครบ (3 เข็ม) มาก่อน และเข็มสุดท้ายหรือกระตุ้นอยู่ในช่วง 5–10 ปี',
          compact: true
        },
        {
          kind: 'radio',
          name: 'fallTetanusHx',
          value: 'more_than_10_years',
          title: ['ฉีดครบ', 'เกิน 10 ปีแล้ว'],
          desc: 'เคยฉีดครบ (3 เข็ม) มาก่อน แต่เข็มสุดท้ายนานเกิน 10 ปีแล้ว',
          compact: true
        },
        {
          kind: 'radio',
          name: 'fallTetanusHx',
          value: 'never_or_unsure',
          title: ['ไม่เคยฉีด', '/ จำไม่ได้'],
          desc: 'ไม่เคยได้รับวัคซีนบาดทะยัก ฉีดไม่ครบ 3 เข็ม หรือไม่ทราบประวัติ',
          compact: true
        }
      ])}
    </div>

    <!-- 4.3 เฉพาะสตรี: ประจำเดือนและการตั้งครรภ์ -->
    <div id="fallFemaleSection" class="hidden pt-3 border-t border-slate-100">
      <div class="p-3.5 bg-pink-50/40 rounded-xl border border-pink-100 space-y-3">
        ${renderFallSysHeader({
          label: '4.3 ประจำเดือนและการตั้งครรภ์ (เฉพาะสตรี)',
          icon: 'heart-pulse',
          colorClass: 'bg-pink-100 text-pink-700',
          toggleKind: 'radio',
          toggleId: 'fallPregNotPregRb',
          toggleName: 'fallPregnancyStatus',
          toggleValue: 'not_pregnant',
          toggleLabel: 'ไม่ได้ตั้งครรภ์'
        })}
        ${renderFallGrid('grid-cols-1 sm:grid-cols-2', [
          { kind: 'radio', name: 'fallPregnancyStatus', value: 'suspected_or_missed', title: ['ขาดประจำเดือน', '/ สงสัยตั้งครรภ์'], compact: true },
          { kind: 'radio', name: 'fallPregnancyStatus', value: 'confirmed_pregnant', title: ['ยืนยัน', 'กำลังตั้งครรภ์'], compact: true },
          { kind: 'radio', name: 'fallPregnancyStatus', value: 'menopause_or_hysterectomy', title: ['หมดประจำเดือน', '/ ผ่าตัดมดลูกแล้ว'], compact: true },
          { kind: 'radio', name: 'fallPregnancyStatus', value: 'unknown', title: ['ไม่ทราบ'], compact: true }
        ])}
        <div class="max-w-xs">
          <label class="block text-[11px] font-semibold text-slate-700 mb-1">วันแรกของประจำเดือนครั้งล่าสุด (ถ้าจำได้):</label>
          <input type="text" id="fallLmpDate" data-universal-date="true" placeholder="วว/ดด/ปปปป เช่น 28/10/2026" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
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
    <textarea id="fall_trauma_other_free" rows="2" placeholder="พิมพ์ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"></textarea>
  </div>
</div>
`;

// --- MODULE DEFINITION ---
const fallTraumaModule = {
  id: 'fall_trauma',
  recordCc: 'fall_trauma',
  titleTh: 'พลัดตกหกล้ม / ได้รับบาดเจ็บทางกายภาพ',
  titleEn: 'Falls / Blunt trauma',
  icon: 'user-x',
  doctorCcBadgeHtml: '<i data-lucide="user-x" class="w-3.5 h-3.5 mr-1 text-amber-500"></i> CC: พลัดตกหกล้ม / ได้รับบาดเจ็บทางกายภาพ (Falls / Blunt Trauma)',
  pmhSectionNumber: 5,
  dateFields: ['fallLmpDate'],
  algorithm: 'fall-trauma-protocol',
  sectionDomId: 'cc-fall-trauma-section',
  formHtml: FALL_TRAUMA_FORM_HTML,

  init: function() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  },

  collectIntake: function(ctx = {}) {
    const durVal = parseInt(document.getElementById('fallDurationVal')?.value, 10);
    const durUnit = document.getElementById('fallDurationUnit')?.value || 'hours';

    const getRadio = (name) => {
      const el = document.querySelector(`input[name="${name}"]:checked`);
      return el ? el.value : null;
    };
    const getChecks = (name) => {
      return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(el => el.value);
    };

    const mechanisms = getChecks('fallMechanisms');
    const mechGroundDetail = document.getElementById('fallMechGroundDetail')?.value?.trim() || '';
    const mechStairsDetail = document.getElementById('fallMechStairsDetail')?.value?.trim() || '';
    const heightLevel = getRadio('fallHeightLevel');
    const mechHeightDetail = document.getElementById('fallMechHeightDetail')?.value?.trim() || '';
    const mechBluntDetail = document.getElementById('fallMechBluntDetail')?.value?.trim() || '';
    const mechSportsDetail = document.getElementById('fallMechSportsDetail')?.value?.trim() || '';
    const mechAnkleDetail = document.getElementById('fallMechAnkleDetail')?.value?.trim() || '';
    const mechOtherDetail = document.getElementById('fallMechOtherDetail')?.value?.trim() || '';

    const prodrome = getRadio('fallProdrome');
    const prodromeDetail = (prodrome === 'has_prodrome') ? (document.getElementById('fallProdromeDetail')?.value?.trim() || '') : '';
    const woundStatus = getRadio('fallWoundStatus');

    const getSubState = (parentActive, elId, sidesName) => {
      const active = parentActive && (document.getElementById(elId)?.checked || false);
      return { active, sides: active ? getChecks(sidesName) : [], injuries: active ? getChecks(elId + 'Injuries') : [] };
    };

    // Head / Face
    const parentHeadFace = document.getElementById('fallParentHeadFace')?.checked || false;
    const sHeadScalp = getSubState(parentHeadFace, 'fallHeadScalp', 'fallHeadScalpSides');
    const sHeadFace = getSubState(parentHeadFace, 'fallHeadFace', 'fallHeadFaceSides');
    const sHeadEye = getSubState(parentHeadFace, 'fallHeadEye', 'fallHeadEyeSides');
    const sHeadEar = getSubState(parentHeadFace, 'fallHeadEar', 'fallHeadEarSides');
    const sHeadNoseMouth = getSubState(parentHeadFace, 'fallHeadNoseMouth', 'fallHeadNoseMouthSides');
    const headSigns = parentHeadFace ? getChecks('fallHeadSigns') : [];

    // Neck
    const parentNeck = document.getElementById('fallParentNeck')?.checked || false;
    const sNeckSpine = getSubState(parentNeck, 'fallNeckSpine', 'fallNeckSpineSides');
    const sNeckFront = getSubState(parentNeck, 'fallNeckFront', 'fallNeckFrontSides');
    const sNeckSide = getSubState(parentNeck, 'fallNeckSide', 'fallNeckSideSides');
    const neckSigns = parentNeck ? getChecks('fallNeckSigns') : [];

    // Chest / Upper Back
    const parentChest = document.getElementById('fallParentChest')?.checked || false;
    const sChestRibs = getSubState(parentChest, 'fallChestRibs', 'fallChestRibsSides');
    const sChestClavicle = getSubState(parentChest, 'fallChestClavicle', 'fallChestClavicleSides');
    const sChestUpperBack = getSubState(parentChest, 'fallChestUpperBack', 'fallChestUpperBackSides');
    const chestSigns = parentChest ? getChecks('fallChestSigns') : [];

    // Abdomen / Pelvis / Lower Back
    const parentAbdomen = document.getElementById('fallParentAbdomen')?.checked || false;
    const sAbdWall = getSubState(parentAbdomen, 'fallAbdWall', 'fallAbdWallSides');
    const sAbdFlank = getSubState(parentAbdomen, 'fallAbdFlank', 'fallAbdFlankSides');
    const sAbdLowerBack = getSubState(parentAbdomen, 'fallAbdLowerBack', 'fallAbdLowerBackSides');
    const sAbdPelvisHip = getSubState(parentAbdomen, 'fallAbdPelvisHip', 'fallAbdPelvisHipSides');
    const sAbdGenitalia = getSubState(parentAbdomen, 'fallAbdGenitalia', 'fallAbdGenitaliaSides');
    const abdSigns = parentAbdomen ? getChecks('fallAbdomenSigns') : [];

    // Upper Extremity
    const parentUpperExt = document.getElementById('fallParentUpperExtremity')?.checked || false;
    const sArmShoulder = getSubState(parentUpperExt, 'fallArmShoulder', 'fallArmShoulderSides');
    const sArmElbow = getSubState(parentUpperExt, 'fallArmElbow', 'fallArmElbowSides');
    const sArmWrist = getSubState(parentUpperExt, 'fallArmWrist', 'fallArmWristSides');
    const isArmFingers = parentUpperExt && !!document.getElementById('fallArmFingers')?.checked;
    const armFingersLeftDigits = isArmFingers ? getChecks('fallArmFingersLeftDigits') : [];
    const armFingersRightDigits = isArmFingers ? getChecks('fallArmFingersRightDigits') : [];
    const armFingersSides = [];
    if (armFingersLeftDigits.length > 0) armFingersSides.push('left');
    if (armFingersRightDigits.length > 0) armFingersSides.push('right');
    const armFingersDigits = [...new Set([...armFingersLeftDigits, ...armFingersRightDigits])];
    const armFingersInjuries = isArmFingers ? getChecks('fallArmFingersInjuries') : [];
    const upperSigns = parentUpperExt ? getChecks('fallUpperExtSigns') : [];

    // Lower Extremity
    const parentLowerExt = document.getElementById('fallParentLowerExtremity')?.checked || false;
    const sLegThigh = getSubState(parentLowerExt, 'fallLegThigh', 'fallLegThighSides');
    const sLegKneeShin = getSubState(parentLowerExt, 'fallLegKneeShin', 'fallLegKneeShinSides');
    const sLegAnkleFoot = getSubState(parentLowerExt, 'fallLegAnkleFoot', 'fallLegAnkleFootSides');
    const isLegToes = parentLowerExt && !!document.getElementById('fallLegToes')?.checked;
    const legToesLeftDigits = isLegToes ? getChecks('fallLegToesLeftDigits') : [];
    const legToesRightDigits = isLegToes ? getChecks('fallLegToesRightDigits') : [];
    const legToesSides = [];
    if (legToesLeftDigits.length > 0) legToesSides.push('left');
    if (legToesRightDigits.length > 0) legToesSides.push('right');
    const legToesDigits = [...new Set([...legToesLeftDigits, ...legToesRightDigits])];
    const legToesInjuries = isLegToes ? getChecks('fallLegToesInjuries') : [];
    const lowerSigns = parentLowerExt ? getChecks('fallLowerExtSigns') : [];

    // 2.7 Other
    const parentOther = document.getElementById('fallParentOther')?.checked || false;
    const otherLocationDetail = parentOther ? (document.getElementById('fallOtherLocationDetail')?.value?.trim() || '') : '';

    const systemicSigns = getChecks('fallSystemicSigns');
    const painScore = fallPainScoreTouched ? parseInt(document.getElementById('fallPainScore')?.value || 0, 10) : null;
    const antithrombotic = getRadio('fallAntithrombotic');
    const tetanusHx = getRadio('fallTetanusHx');

    const titleSelVal = document.getElementById('patientTitleSelect')?.value || '';
    const isFemale = ctx.gender ? isFallFemalePatient(ctx) : (titleSelVal ? /นาง|น\.ส\.|ด\.ญ\.|\(หญิง\)|Mrs|Miss|Ms/i.test(titleSelVal) : isFallFemalePatient(ctx));
    const fallLmpDate = isFemale ? (document.getElementById('fallLmpDate')?.value?.trim() || '') : '';
    const fallPregnancyStatus = isFemale ? (getRadio('fallPregnancyStatus') || '') : '';
    const otherSymptomsFree = document.getElementById('fall_trauma_other_free')?.value?.trim() || ctx.otherSymptomsFree || '';

    const rec = {
      id: ctx.recordId || ctx.id,
      queue_number: ctx.queueNumber || ctx.queue_number,
      hn: ctx.randomHn || ctx.hn,
      name: ctx.patientName || ctx.name,
      age: ctx.patientAge !== undefined ? ctx.patientAge : ctx.age,
      gender: ctx.gender,
      chief_complaint: 'fall_trauma',
      chief_complaint_title: 'พลัดตกหกล้ม / ได้รับบาดเจ็บทางกายภาพ',
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

      fallMechanisms: mechanisms,
      fallMechGroundDetail: mechGroundDetail,
      fallMechStairsDetail: mechStairsDetail,
      fallHeightLevel: heightLevel,
      fallMechHeightDetail: mechHeightDetail,
      fallMechBluntDetail: mechBluntDetail,
      fallMechSportsDetail: mechSportsDetail,
      fallMechAnkleDetail: mechAnkleDetail,
      fallMechOtherDetail: mechOtherDetail,
      fallProdrome: prodrome,
      fallProdromeDetail: prodromeDetail,
      fallWoundStatus: woundStatus,

      fallParentHeadFace: parentHeadFace,
      fallHeadScalp: sHeadScalp.active,
      fallHeadScalpSides: sHeadScalp.sides, fallHeadScalpInjuries: sHeadScalp.injuries,
      fallHeadFace: sHeadFace.active,
      fallHeadFaceSides: sHeadFace.sides, fallHeadFaceInjuries: sHeadFace.injuries,
      fallHeadEye: sHeadEye.active,
      fallHeadEyeSides: sHeadEye.sides, fallHeadEyeInjuries: sHeadEye.injuries,
      fallHeadEar: sHeadEar.active,
      fallHeadEarSides: sHeadEar.sides, fallHeadEarInjuries: sHeadEar.injuries,
      fallHeadNoseMouth: sHeadNoseMouth.active,
      fallHeadNoseMouthSides: sHeadNoseMouth.sides, fallHeadNoseMouthInjuries: sHeadNoseMouth.injuries,
      fallHeadSigns: headSigns,

      fallParentNeck: parentNeck,
      fallNeckSpine: sNeckSpine.active,
      fallNeckSpineSides: sNeckSpine.sides, fallNeckSpineInjuries: sNeckSpine.injuries,
      fallNeckFront: sNeckFront.active,
      fallNeckFrontSides: sNeckFront.sides, fallNeckFrontInjuries: sNeckFront.injuries,
      fallNeckSide: sNeckSide.active,
      fallNeckSideSides: sNeckSide.sides, fallNeckSideInjuries: sNeckSide.injuries,
      fallNeckSigns: neckSigns,

      fallParentChest: parentChest,
      fallChestRibs: sChestRibs.active,
      fallChestRibsSides: sChestRibs.sides, fallChestRibsInjuries: sChestRibs.injuries,
      fallChestClavicle: sChestClavicle.active,
      fallChestClavicleSides: sChestClavicle.sides, fallChestClavicleInjuries: sChestClavicle.injuries,
      fallChestUpperBack: sChestUpperBack.active,
      fallChestUpperBackSides: sChestUpperBack.sides, fallChestUpperBackInjuries: sChestUpperBack.injuries,
      fallChestSigns: chestSigns,

      fallParentAbdomen: parentAbdomen,
      fallAbdWall: sAbdWall.active,
      fallAbdWallSides: sAbdWall.sides, fallAbdWallInjuries: sAbdWall.injuries,
      fallAbdFlank: sAbdFlank.active,
      fallAbdFlankSides: sAbdFlank.sides, fallAbdFlankInjuries: sAbdFlank.injuries,
      fallAbdLowerBack: sAbdLowerBack.active,
      fallAbdLowerBackSides: sAbdLowerBack.sides, fallAbdLowerBackInjuries: sAbdLowerBack.injuries,
      fallAbdPelvisHip: sAbdPelvisHip.active,
      fallAbdPelvisHipSides: sAbdPelvisHip.sides, fallAbdPelvisHipInjuries: sAbdPelvisHip.injuries,
      fallAbdGenitalia: sAbdGenitalia.active,
      fallAbdGenitaliaSides: sAbdGenitalia.sides, fallAbdGenitaliaInjuries: sAbdGenitalia.injuries,
      fallAbdomenSigns: abdSigns,

      fallParentUpperExtremity: parentUpperExt,
      fallArmShoulder: sArmShoulder.active,
      fallArmShoulderSides: sArmShoulder.sides, fallArmShoulderInjuries: sArmShoulder.injuries,
      fallArmElbow: sArmElbow.active,
      fallArmElbowSides: sArmElbow.sides, fallArmElbowInjuries: sArmElbow.injuries,
      fallArmWrist: sArmWrist.active,
      fallArmWristSides: sArmWrist.sides, fallArmWristInjuries: sArmWrist.injuries,
      fallArmFingers: isArmFingers,
      fallArmFingersSides: armFingersSides,
      fallArmFingersLeftDigits: armFingersLeftDigits,
      fallArmFingersRightDigits: armFingersRightDigits,
      fallArmFingersDigits: armFingersDigits, fallArmFingersInjuries: armFingersInjuries,
      fallUpperExtSigns: upperSigns,

      fallParentLowerExtremity: parentLowerExt,
      fallLegThigh: sLegThigh.active,
      fallLegThighSides: sLegThigh.sides, fallLegThighInjuries: sLegThigh.injuries,
      fallLegKneeShin: sLegKneeShin.active,
      fallLegKneeShinSides: sLegKneeShin.sides, fallLegKneeShinInjuries: sLegKneeShin.injuries,
      fallLegAnkleFoot: sLegAnkleFoot.active,
      fallLegAnkleFootSides: sLegAnkleFoot.sides, fallLegAnkleFootInjuries: sLegAnkleFoot.injuries,
      fallLegToes: isLegToes,
      fallLegToesSides: legToesSides,
      fallLegToesLeftDigits: legToesLeftDigits,
      fallLegToesRightDigits: legToesRightDigits,
      fallLegToesDigits: legToesDigits, fallLegToesInjuries: legToesInjuries,
      fallLowerExtSigns: lowerSigns,

      fallParentOther: parentOther,
      fallOtherLocationDetail: otherLocationDetail,

      fallSystemicSigns: systemicSigns,
      painScore: painScore,
      fallAntithrombotic: antithrombotic,
      fallTetanusHx: tetanusHx,
      fallLmpDate,
      fallPregnancyStatus
    };

    updateFallOutputs(rec);
    return rec;
  },

  collectFormData: function(ctx = {}) {
    return this.collectIntake(ctx);
  },

  hydrateForm: function(data = {}) {
    if (data.durationVal) {
      const valEl = document.getElementById('fallDurationVal');
      if (valEl) valEl.value = data.durationVal;
    }
    const unitEl = document.getElementById('fallDurationUnit');
    if (unitEl) unitEl.value = data.durationUnit || 'hours';

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

    const hydrateMechList = Array.isArray(data.fallMechanisms)
      ? data.fallMechanisms.map(m => (m === 'sports_twist' ? 'sports_injury' : m))
      : [];
    setChecks('fallMechanisms', hydrateMechList);
    if (hydrateMechList.length > 0) {
      [
        ['ground_level_fall', 'fallMechGroundDetailContainer', 'fallMechGroundDetail', data.fallMechGroundDetail],
        ['stairs_fall', 'fallMechStairsDetailContainer', 'fallMechStairsDetail', data.fallMechStairsDetail],
        ['blunt_heavy_impact', 'fallMechBluntDetailContainer', 'fallMechBluntDetail', data.fallMechBluntDetail],
        ['sports_injury', 'fallMechSportsDetailContainer', 'fallMechSportsDetail', data.fallMechSportsDetail],
        ['ankle_sprain', 'fallMechAnkleDetailContainer', 'fallMechAnkleDetail', data.fallMechAnkleDetail],
        ['other_mechanism', 'fallMechOtherDetailContainer', 'fallMechOtherDetail', data.fallMechOtherDetail]
      ].forEach(([k, c, inp, v]) => {
        if (hydrateMechList.includes(k)) {
          toggleFallGroup(c, true);
          const el = document.getElementById(inp); if (el) el.value = v || '';
        }
      });
      if (hydrateMechList.includes('height_fall')) {
        toggleFallGroup('fallMechHeightContainer', true);
        setRadio('fallHeightLevel', data.fallHeightLevel);
        const el = document.getElementById('fallMechHeightDetail'); if (el) el.value = data.fallMechHeightDetail || '';
      }
    }

    setRadio('fallProdrome', data.fallProdrome);
    if (data.fallProdrome === 'has_prodrome') {
      handleFallProdromeChange('has_prodrome');
      const pdEl = document.getElementById('fallProdromeDetail');
      if (pdEl) pdEl.value = data.fallProdromeDetail || '';
    }
    setRadio('fallWoundStatus', data.fallWoundStatus);

    const hydrateSub = (key, id, cont, sidesName, sidesData) => {
      if (data[key]) {
        setCheckById(id, true);
        toggleFallGroup(cont, true);
        if (sidesName && sidesData) setChecks(sidesName, sidesData);
        setChecks(id + 'Injuries', data[id + 'Injuries']);
      }
    };

    if (data.fallParentHeadFace) {
      setCheckById('fallParentHeadFace', true);
      toggleFallGroup('fallHeadSubGroup', true);
      hydrateSub('fallHeadScalp', 'fallHeadScalp', 'fallHeadScalpSidesContainer', 'fallHeadScalpSides', data.fallHeadScalpSides);
      hydrateSub('fallHeadFace', 'fallHeadFace', 'fallHeadFaceSidesContainer', 'fallHeadFaceSides', data.fallHeadFaceSides);
      hydrateSub('fallHeadEye', 'fallHeadEye', 'fallHeadEyeSidesContainer', 'fallHeadEyeSides', data.fallHeadEyeSides);
      hydrateSub('fallHeadEar', 'fallHeadEar', 'fallHeadEarSidesContainer', 'fallHeadEarSides', data.fallHeadEarSides);
      hydrateSub('fallHeadNoseMouth', 'fallHeadNoseMouth', 'fallHeadNoseMouthSidesContainer', 'fallHeadNoseMouthSides', data.fallHeadNoseMouthSides);
      const headSignsHydrate = Array.isArray(data.fallHeadSigns)
        ? data.fallHeadSigns.flatMap(s => (s === 'jaw_malocclusion_broken_tooth' ? ['jaw_malocclusion', 'broken_loose_tooth'] : [s]))
        : [];
      setChecks('fallHeadSigns', headSignsHydrate);
    }

    if (data.fallParentNeck) {
      setCheckById('fallParentNeck', true);
      toggleFallGroup('fallNeckSubGroup', true);
      hydrateSub('fallNeckSpine', 'fallNeckSpine', 'fallNeckSpineSidesContainer', 'fallNeckSpineSides', data.fallNeckSpineSides);
      hydrateSub('fallNeckFront', 'fallNeckFront', 'fallNeckFrontSidesContainer', 'fallNeckFrontSides', data.fallNeckFrontSides);
      hydrateSub('fallNeckSide', 'fallNeckSide', 'fallNeckSideSidesContainer', 'fallNeckSideSides', data.fallNeckSideSides);
      setChecks('fallNeckSigns', data.fallNeckSigns);
    }

    if (data.fallParentChest) {
      setCheckById('fallParentChest', true);
      toggleFallGroup('fallChestSubGroup', true);
      hydrateSub('fallChestRibs', 'fallChestRibs', 'fallChestRibsSidesContainer', 'fallChestRibsSides', data.fallChestRibsSides);
      hydrateSub('fallChestClavicle', 'fallChestClavicle', 'fallChestClavicleSidesContainer', 'fallChestClavicleSides', data.fallChestClavicleSides);
      hydrateSub('fallChestUpperBack', 'fallChestUpperBack', 'fallChestUpperBackSidesContainer', 'fallChestUpperBackSides', data.fallChestUpperBackSides);
      setChecks('fallChestSigns', data.fallChestSigns);
    }

    if (data.fallParentAbdomen) {
      setCheckById('fallParentAbdomen', true);
      toggleFallGroup('fallAbdomenSubGroup', true);
      hydrateSub('fallAbdWall', 'fallAbdWall', 'fallAbdWallSidesContainer', 'fallAbdWallSides', data.fallAbdWallSides);
      hydrateSub('fallAbdFlank', 'fallAbdFlank', 'fallAbdFlankSidesContainer', 'fallAbdFlankSides', data.fallAbdFlankSides);
      hydrateSub('fallAbdLowerBack', 'fallAbdLowerBack', 'fallAbdLowerBackSidesContainer', 'fallAbdLowerBackSides', data.fallAbdLowerBackSides);
      hydrateSub('fallAbdPelvisHip', 'fallAbdPelvisHip', 'fallAbdPelvisHipSidesContainer', 'fallAbdPelvisHipSides', data.fallAbdPelvisHipSides);
      hydrateSub('fallAbdGenitalia', 'fallAbdGenitalia', 'fallAbdGenitaliaSidesContainer', 'fallAbdGenitaliaSides', data.fallAbdGenitaliaSides);
      setChecks('fallAbdomenSigns', data.fallAbdomenSigns);
    }

    if (data.fallParentUpperExtremity) {
      setCheckById('fallParentUpperExtremity', true);
      toggleFallGroup('fallUpperExtSubGroup', true);
      hydrateSub('fallArmShoulder', 'fallArmShoulder', 'fallArmShoulderSidesContainer', 'fallArmShoulderSides', data.fallArmShoulderSides);
      hydrateSub('fallArmElbow', 'fallArmElbow', 'fallArmElbowSidesContainer', 'fallArmElbowSides', data.fallArmElbowSides);
      hydrateSub('fallArmWrist', 'fallArmWrist', 'fallArmWristSidesContainer', 'fallArmWristSides', data.fallArmWristSides);
      if (data.fallArmFingers) {
        setCheckById('fallArmFingers', true);
        toggleFallGroup('fallArmFingersSidesContainer', true);
        setChecks('fallArmFingersLeftDigits', data.fallArmFingersLeftDigits || (data.fallArmFingersSides?.includes('left') ? data.fallArmFingersDigits : []));
        setChecks('fallArmFingersRightDigits', data.fallArmFingersRightDigits || (data.fallArmFingersSides?.includes('right') ? data.fallArmFingersDigits : []));
        setChecks('fallArmFingersInjuries', data.fallArmFingersInjuries);
      }
      setChecks('fallUpperExtSigns', data.fallUpperExtSigns);
    }

    if (data.fallParentLowerExtremity) {
      setCheckById('fallParentLowerExtremity', true);
      toggleFallGroup('fallLowerExtSubGroup', true);
      hydrateSub('fallLegThigh', 'fallLegThigh', 'fallLegThighSidesContainer', 'fallLegThighSides', data.fallLegThighSides);
      hydrateSub('fallLegKneeShin', 'fallLegKneeShin', 'fallLegKneeShinSidesContainer', 'fallLegKneeShinSides', data.fallLegKneeShinSides);
      hydrateSub('fallLegAnkleFoot', 'fallLegAnkleFoot', 'fallLegAnkleFootSidesContainer', 'fallLegAnkleFootSides', data.fallLegAnkleFootSides);
      if (data.fallLegToes) {
        setCheckById('fallLegToes', true);
        toggleFallGroup('fallLegToesSidesContainer', true);
        setChecks('fallLegToesLeftDigits', data.fallLegToesLeftDigits || (data.fallLegToesSides?.includes('left') ? data.fallLegToesDigits : []));
        setChecks('fallLegToesRightDigits', data.fallLegToesRightDigits || (data.fallLegToesSides?.includes('right') ? data.fallLegToesDigits : []));
        setChecks('fallLegToesInjuries', data.fallLegToesInjuries);
      }
      setChecks('fallLowerExtSigns', data.fallLowerExtSigns);
    }

    if (data.fallParentOther) {
      setCheckById('fallParentOther', true);
      toggleFallGroup('fallOtherSubGroup', true);
      const otherEl = document.getElementById('fallOtherLocationDetail');
      if (otherEl) otherEl.value = data.fallOtherLocationDetail || '';
    }

    setChecks('fallSystemicSigns', data.fallSystemicSigns);

    if (data.painScore !== null && data.painScore !== undefined) {
      const slider = document.getElementById('fallPainScore');
      if (slider) slider.value = data.painScore;
      handleFallPainScoreChange(data.painScore);
    } else {
      clearFallPainScore();
    }

    setRadio('fallAntithrombotic', data.fallAntithrombotic);
    setRadio('fallTetanusHx', data.fallTetanusHx);
    checkAndDisplayFallLmp(data);
    if (isFallFemalePatient(data)) {
      const lmpEl = document.getElementById('fallLmpDate'); if (lmpEl) lmpEl.value = data.fallLmpDate || '';
      setRadio('fallPregnancyStatus', data.fallPregnancyStatus);
    }
    const otherFreeEl = document.getElementById('fall_trauma_other_free');
    if (otherFreeEl) otherFreeEl.value = data.otherSymptomsFree || '';
  },

  clearForm: function() {
    ['fallDurationVal', 'fallMechGroundDetail', 'fallMechStairsDetail', 'fallMechHeightDetail', 'fallMechBluntDetail', 'fallMechSportsDetail', 'fallMechAnkleDetail', 'fallMechOtherDetail', 'fallProdromeDetail', 'fallOtherLocationDetail', 'fallLmpDate', 'fall_trauma_other_free'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const durUnit = document.getElementById('fallDurationUnit');
    if (durUnit) durUnit.value = 'hours';
    clearFallPainScore();

    [
      'fallMechGroundDetailContainer', 'fallMechStairsDetailContainer', 'fallMechHeightContainer', 'fallMechBluntDetailContainer', 'fallMechSportsDetailContainer', 'fallMechAnkleDetailContainer', 'fallMechOtherDetailContainer', 'fallProdromeDetailContainer',
      'fallHeadSubGroup', 'fallHeadScalpSidesContainer', 'fallHeadFaceSidesContainer', 'fallHeadEyeSidesContainer', 'fallHeadEarSidesContainer', 'fallHeadNoseMouthSidesContainer',
      'fallNeckSubGroup', 'fallNeckSpineSidesContainer', 'fallNeckFrontSidesContainer', 'fallNeckSideSidesContainer',
      'fallChestSubGroup', 'fallChestRibsSidesContainer', 'fallChestClavicleSidesContainer', 'fallChestUpperBackSidesContainer',
      'fallAbdomenSubGroup', 'fallAbdWallSidesContainer', 'fallAbdFlankSidesContainer', 'fallAbdLowerBackSidesContainer', 'fallAbdPelvisHipSidesContainer', 'fallAbdGenitaliaSidesContainer',
      'fallUpperExtSubGroup', 'fallArmShoulderSidesContainer', 'fallArmElbowSidesContainer', 'fallArmWristSidesContainer', 'fallArmFingersSidesContainer',
      'fallLowerExtSubGroup', 'fallLegThighSidesContainer', 'fallLegKneeShinSidesContainer', 'fallLegAnkleFootSidesContainer', 'fallLegToesSidesContainer', 'fallOtherSubGroup', 'fallFemaleSection'
    ].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });

    document.querySelectorAll('#cc-fall-trauma-section input[type="radio"], #cc-fall-trauma-section input[type="checkbox"]').forEach(i => { i.checked = false; });
  },

  onTitleChange: function(arg) {
    if (typeof arg === 'boolean') toggleFallFemaleSection(arg);
    else if (arg && typeof arg === 'object') {
      if (typeof arg.isFemale === 'boolean') toggleFallFemaleSection(arg.isFemale);
      else toggleFallFemaleSection(/นาง|น\.ส\.|ด\.ญ\.|\(หญิง\)|Mrs|Miss|Ms/i.test(arg.title || ''));
    } else toggleFallFemaleSection(/นาง|น\.ส\.|ด\.ญ\.|\(หญิง\)|Mrs|Miss|Ms/i.test(String(arg || '')));
  },
  onSelectForm: function() { checkAndDisplayFallLmp({}); },
  onActivate: function(patient) { checkAndDisplayFallLmp(patient || {}); },
  resetForm: function() { this.clearForm(); },

  isRedFlag: function(patient) {
    const rfs = evaluateFallRedFlags(patient);
    return rfs.length > 0;
  },

  evaluateRedFlags: evaluateFallRedFlags,
  updateOutputs: updateFallOutputs,
  renderRapidHpi: renderFallRapidHpi,
  renderNarrative: renderFallNarrative,
  renderDoctorHpi: renderFallDoctorHpi,

  // --- Seed Patients Registry ---
  seedPatients: [
    // Case 1: Construction worker fall from roof 4m with spinal cord injury & shock (ESI 1)
    {
      id: 'case-fall-01', queue_number: 'E1-107', hn: '7890601',
      name: 'นายวิชัย ช่างก่อสร้างตกหลังคาช็อกและขาสองข้างชาขยับไม่ได้', age: 42, gender: 'ชาย',
      chief_complaint: 'fall_trauma', chief_complaint_title: 'พลัดตกหกล้ม / ได้รับบาดเจ็บทางกายภาพ',
      timestamp: '2026-11-06T08:00:00.000Z', status: 'waiting',
      durationVal: 40, durationUnit: 'minutes', hospRecordStatus: 'self', underlying: [], drugAllergy: 'ปฏิเสธ', currentMeds: 'ไม่มี',
      otherSymptomsFree: 'พลัดตกจากหลังคาบ้านเดี่ยวชั้น 2 สูงประมาณ 4 เมตร กระแทกพื้นปูน ปวดต้นคอและแผ่นหลังมาก ขาสองข้างชาและยกไม่ขึ้น แน่นหน้าอก หายใจหอบเหนื่อย ปวดท้องตึง หน้ามืดเหงื่อแตกตัวเย็น',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.5, sbp: 90, dbp: 56, bp: '90/56', pr: 118, rr: 26, spo2: 93 },
      esi_level: 1,
      fallMechanisms: ['height_fall'], fallHeightLevel: 'over_3m', fallMechHeightDetail: 'ตกจากหลังคาบ้าน 4 เมตร',
      fallProdrome: 'no_prodrome', fallWoundStatus: 'abrasion_stopped',
      fallParentHeadFace: false,
      fallParentNeck: true, fallNeckSpine: true, fallNeckSpineSides: ['center'], fallNeckFront: false, fallNeckSide: false,
      fallNeckSigns: ['severe_cervical_pain_limited_rom', 'radicular_shock_numbness_weakness'],
      fallParentChest: true, fallChestRibs: true, fallChestRibsSides: ['left'], fallChestClavicle: false, fallChestUpperBack: true, fallChestUpperBackSides: ['center'],
      fallChestSigns: ['dyspnea_shortness_of_breath', 'pleuritic_chest_pain'],
      fallParentAbdomen: true, fallAbdWall: true, fallAbdWallSides: ['left'], fallAbdFlank: false, fallAbdLowerBack: true, fallAbdLowerBackSides: ['center'], fallAbdPelvisHip: false, fallAbdGenitalia: false,
      fallAbdomenSigns: ['severe_abd_pain_distension', 'sciatica_numbness_cauda_equina'],
      fallParentUpperExtremity: false,
      fallParentLowerExtremity: true, fallLegThigh: false, fallLegKneeShin: false, fallLegAnkleFoot: false, fallLegToes: false,
      fallLowerExtSigns: ['nerve_numbness_cannot_dorsiflex'],
      fallSystemicSigns: ['dizziness_presyncope', 'palpitation_cold_sweat'],
      painScore: 9, fallAntithrombotic: 'no_antithrombotic', fallTetanusHx: 'more_than_10_years'
    },

    // Case 2: Elderly female syncopal fall with right hip fracture and head trauma on Warfarin (ESI 2)
    {
      id: 'case-fall-02', queue_number: 'E2-106', hn: '7890602',
      name: 'นางสุมาลี วูบหมดสติล้มในห้องน้ำสะโพกขวาหักทานยาวาร์ฟาริน', age: 76, gender: 'หญิง',
      chief_complaint: 'fall_trauma', chief_complaint_title: 'พลัดตกหกล้ม / ได้รับบาดเจ็บทางกายภาพ',
      timestamp: '2026-11-06T08:30:00.000Z', status: 'waiting',
      durationVal: 1, durationUnit: 'hours', hospRecordStatus: 'complete',
      underlying: ['หัวใจเต้นผิดจังหวะ (AF)', 'ความดันโลหิตสูง (HT)'],
      drugAllergy: 'ปฏิเสธ', currentMeds: 'Warfarin 2 mg 1 tab po od, Amlodipine 5 mg 1 tab po od',
      otherSymptomsFree: 'ขณะยืนแปรงฟันในห้องน้ำ รู้สึกใจสั่น วูบหน้ามืดภาพตัดไปชั่วขณะแล้วล้มลง ศีรษะกระแทกพื้นห้องน้ำ สลบไปประมาณ 1 นาที ฟื้นมารู้สึกปวดสะโพกขวามาก ขยับขาไม่ได้ ขาขวาสั้นลงและแบะออก ยืนไม่ไหว',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.8, sbp: 142, dbp: 82, bp: '142/82', pr: 94, rr: 18, spo2: 97 },
      esi_level: 2,
      fallMechanisms: ['ground_level_fall'], fallMechGroundDetail: 'วูบล้มในห้องน้ำ',
      fallProdrome: 'has_prodrome', fallWoundStatus: 'abrasion_stopped',
      fallParentHeadFace: true, fallHeadScalp: true, fallHeadScalpSides: ['right'], fallHeadFace: false, fallHeadEye: false, fallHeadEar: false, fallHeadNoseMouth: false,
      fallHeadSigns: ['loss_of_consciousness', 'severe_headache_vomit_drowsy'],
      fallParentNeck: false, fallParentChest: false,
      fallParentAbdomen: true, fallAbdWall: false, fallAbdFlank: false, fallAbdLowerBack: false, fallAbdPelvisHip: true, fallAbdPelvisHipSides: ['right'], fallAbdGenitalia: false,
      fallAbdomenSigns: ['pelvic_hip_pain_cannot_bear_weight'],
      fallParentUpperExtremity: false,
      fallParentLowerExtremity: true, fallLegThigh: true, fallLegThighSides: ['right'], fallLegKneeShin: false, fallLegAnkleFoot: false, fallLegToes: false,
      fallLowerExtSigns: ['deformity_shortened_external_rotation_leg', 'inability_to_bear_weight'],
      fallSystemicSigns: ['no_systemic_signs'],
      painScore: 8, fallAntithrombotic: 'on_anticoagulant_antiplatelet', fallTetanusHx: '5_to_10_years'
    },

    // Case 3: Middle-aged female slip and fall with left Colles wrist deformity (ESI 3)
    {
      id: 'case-fall-03', queue_number: 'E3-102', hn: '7890603',
      name: 'นางสมศรี สะดุดล้มเอามือยันพื้นข้อมือซ้ายบวมผิดรูป', age: 58, gender: 'หญิง',
      chief_complaint: 'fall_trauma', chief_complaint_title: 'พลัดตกหกล้ม / ได้รับบาดเจ็บทางกายภาพ',
      timestamp: '2026-11-06T09:00:00.000Z', status: 'waiting',
      durationVal: 2, durationUnit: 'hours', hospRecordStatus: 'self', underlying: ['ไขมันในเลือดสูง'], drugAllergy: 'ปฏิเสธ', currentMeds: 'Simvastatin 20 mg 1 tab po hs',
      otherSymptomsFree: 'เดินสะดุดขอบพรมในบ้าน เสียหลักล้มเอามือซ้ายยันพื้น ไม่มีอาการวูบนำมาก่อน ศีรษะไม่กระแทก รู้สึกปวดและบวมผิดรูปเหมือนส้อม (dinner fork) ที่ข้อมือซ้าย ขยับหมุนข้อมือไม่ได้ ปลายนิ้วไม่ชา สีชมพูดี',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.6, sbp: 128, dbp: 78, bp: '128/78', pr: 76, rr: 16, spo2: 99 },
      esi_level: 3,
      fallMechanisms: ['ground_level_fall'], fallMechGroundDetail: 'สะดุดขอบพรมในบ้าน',
      fallProdrome: 'no_prodrome', fallWoundStatus: 'no_wound',
      fallParentHeadFace: false, fallParentNeck: false, fallParentChest: false, fallParentAbdomen: false,
      fallParentUpperExtremity: true, fallArmShoulder: false, fallArmElbow: false, fallArmWrist: true, fallArmWristSides: ['left'], fallArmFingers: false,
      fallUpperExtSigns: ['deformity_dislocation_arm', 'cannot_move_arm_hand'],
      fallParentLowerExtremity: false,
      fallSystemicSigns: ['no_systemic_signs'],
      painScore: 6, fallAntithrombotic: 'no_antithrombotic', fallTetanusHx: 'within_5_years'
    },

    // Case 4: Young adult twisted right ankle while stepping off sidewalk, able to bear weight (ESI 4)
    {
      id: 'case-fall-04', queue_number: 'E3-103', hn: '7890604',
      name: 'นายธนากร ก้าวพลาดตกขอบฟุตบาทข้อเท้าขวาพลิกเดินลงน้ำหนักได้', age: 25, gender: 'ชาย',
      chief_complaint: 'fall_trauma', chief_complaint_title: 'พลัดตกหกล้ม / ได้รับบาดเจ็บทางกายภาพ',
      timestamp: '2026-11-06T09:30:00.000Z', status: 'waiting',
      durationVal: 3, durationUnit: 'hours', hospRecordStatus: 'self', underlying: [], drugAllergy: 'ปฏิเสธ', currentMeds: 'ไม่มี',
      otherSymptomsFree: 'เดินก้าวพลาดตกขอบฟุตบาท ข้อเท้าขวาบิดพลิกเข้าด้านใน ปวดเจ็บและบวมเล็กน้อยบริเวณตาตุ่มด้านนอกขวา ยังพอยืนและเดินลงน้ำหนักได้ ไม่มีแผลเปิด ไม่ชา ไม่หน้ามืด',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.7, sbp: 116, dbp: 72, bp: '116/72', pr: 68, rr: 16, spo2: 99 },
      esi_level: 4,
      fallMechanisms: ['ankle_sprain'], fallMechAnkleDetail: 'ก้าวพลาดตกขอบฟุตบาทข้อเท้าขวาพลิก',
      fallProdrome: 'no_prodrome', fallWoundStatus: 'no_wound',
      fallParentHeadFace: false, fallParentNeck: false, fallParentChest: false, fallParentAbdomen: false, fallParentUpperExtremity: false,
      fallParentLowerExtremity: true, fallLegThigh: false, fallLegKneeShin: false, fallLegAnkleFoot: true, fallLegAnkleFootSides: ['right'], fallLegToes: false,
      fallLowerExtSigns: [],
      fallSystemicSigns: ['no_systemic_signs'],
      painScore: 3, fallAntithrombotic: 'no_antithrombotic', fallTetanusHx: 'within_5_years'
    }
  ]
};

// Register module in Ratchaburi ER Core Registry
if (typeof registerCcModule === 'function') registerCcModule(fallTraumaModule);
else if (typeof window !== 'undefined' && typeof window.registerCcModule === 'function') window.registerCcModule(fallTraumaModule);

if (typeof module !== 'undefined' && module.exports) {
  module.exports = fallTraumaModule;
}
