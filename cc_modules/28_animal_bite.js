// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 28_animal_bite.js
// อาการนำ: สุนัข แมว สัตว์เลี้ยงลูกด้วยนมกัด (Animal / Mammalian Bites & Rabies Exposure)
// รองรับ Zero Default Bias, WHO Rabies Category I-III Classification,
// Progressive Disclosure 6 ตำแหน่งร่างกาย, Pain Slider Touch State, และ Core Guard TDD 100%
// =========================================================================

// --- Module-scoped State & Helpers ---
let bitePainScoreTouched = false;

function wrapBiteWords(chunks) {
  if (!Array.isArray(chunks)) return chunks;
  return chunks.map(c => `<span class="inline-block whitespace-nowrap">${c}</span>`).join(' ');
}

function renderBiteOption(cfg) {
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
  const titleHtml = Array.isArray(title) ? wrapBiteWords(title) : title;
  const bodyHtml = desc
    ? `<div class="ml-3 leading-snug"><span class="block text-xs sm:text-sm font-semibold text-slate-800">${titleHtml}</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">${desc}</span></div>`
    : `<span class="ml-3 ${compact ? 'text-xs' : 'text-xs sm:text-sm'} font-semibold text-slate-800 leading-snug">${titleHtml}</span>`;
  return `<label class="selectable-card bg-white flex ${alignCls} ${padCls} rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition${spanCls}"><input type="${kind}" ${idAttr}${nameAttr}${valAttr}${chgAttr}class="${topCls}${roundCls}text-medical-600 focus:ring-medical-500 ${szCls} flex-shrink-0">${bodyHtml}</label>`;
}

function renderBiteGrid(colsCls, items, shared = {}) {
  return `<div class="grid ${colsCls} gap-2.5">${items.map(it => renderBiteOption({ ...shared, ...it })).join('\n')}</div>`;
}

function renderBiteSysHeader({
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

function handleBiteGroupNoneToggle(noneEl, inputName) {
  if (!noneEl || !noneEl.checked || typeof document === 'undefined') return;
  document.querySelectorAll(`input[name="${inputName}"]`).forEach(cb => {
    if (cb !== noneEl) cb.checked = false;
  });
}

function handleBiteGroupItemChange(itemEl, noneId) {
  if (!itemEl || !itemEl.checked || !noneId || typeof document === 'undefined') return;
  const noneEl = document.getElementById(noneId);
  if (noneEl) noneEl.checked = false;
}

function isBiteFemalePatient(p) {
  if (!p) return false;
  if (p.gender === 'หญิง' || p.gender === 'female') return true;
  if (p.gender === 'ชาย' || p.gender === 'male') return false;
  const label = `${p.patientTitle || p.title || ''} ${p.name || p.patientName || ''}`;
  return /นาง|น\.ส\.|ด\.ญ\.|\(หญิง\)|Mrs|Miss|Ms/i.test(label);
}

function isBiteFemaleCtx(ctx = {}) {
  if (ctx.gender === 'หญิง' || ctx.gender === 'female') return true;
  if (ctx.gender === 'ชาย' || ctx.gender === 'male') return false;
  if (ctx.patientTitle || ctx.title || ctx.name || ctx.patientName) return isBiteFemalePatient(ctx);
  const femSec = typeof document !== 'undefined' ? document.getElementById('biteFemaleSection') : null;
  if (femSec && !femSec.classList.contains('hidden')) return true;
  if (typeof document === 'undefined') return false;
  const title = document.getElementById('patientTitleSelect')?.value || '';
  const name = document.getElementById('patientNameInput')?.value || '';
  const gender = document.getElementById('triageGenderSelect')?.value || '';
  return isBiteFemalePatient({ gender, patientTitle: title, name });
}

function toggleBiteFemaleSection(isFemale) {
  const femSec = document.getElementById('biteFemaleSection');
  if (!femSec) return;
  femSec.classList.toggle('hidden', !isFemale);
  if (!isFemale) {
    const lmpEl = document.getElementById('biteLmpDate');
    if (lmpEl) lmpEl.value = '';
    document.querySelectorAll('input[name="bitePregnancyStatus"]').forEach(r => { r.checked = false; });
  }
}

function checkAndDisplayBiteLmp(patient) {
  if (patient && (patient.gender || patient.name || patient.patientName || patient.patientTitle || patient.title)) {
    toggleBiteFemaleSection(isBiteFemalePatient(patient));
    return;
  }
  const title = document.getElementById('patientTitleSelect')?.value || '';
  const name = document.getElementById('patientNameInput')?.value || '';
  const gender = document.getElementById('triageGenderSelect')?.value || '';
  toggleBiteFemaleSection(isBiteFemalePatient({ gender, patientTitle: title, name }));
}

function renderBitePart(id, label, hasCenter = false) {
  return `<div class="p-2.5 rounded-xl border border-slate-200 bg-white">
  <label class="flex items-center cursor-pointer">
    <input type="checkbox" id="${id}" name="${id}" onchange="toggleBiteGroup('${id}SidesContainer', this.checked)" class="text-medical-600 h-4 w-4 rounded flex-shrink-0">
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

function renderBiteDigits(id, label) {
  const digits = [['thumb', 'โป้ง'], ['index', 'ชี้'], ['middle', 'กลาง'], ['ring', 'นาง'], ['little', 'ก้อย']];
  const row = (side, sl) => `<div class="flex items-center flex-wrap gap-2"><span class="text-[11px] font-semibold text-slate-500 w-9">${sl}:</span>${digits.map(([k, th]) => `<label class="inline-flex items-center cursor-pointer"><input type="checkbox" name="${id}${side}Digits" value="${k}" class="mr-1 text-medical-600 rounded"> ${th}</label>`).join('')}</div>`;
  return `<div class="p-2.5 rounded-xl border border-slate-200 bg-white">
  <label class="flex items-center cursor-pointer">
    <input type="checkbox" id="${id}" name="${id}" onchange="toggleBiteGroup('${id}SidesContainer', this.checked)" class="text-medical-600 h-4 w-4 rounded flex-shrink-0">
    <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">${label}</span>
  </label>
  <div id="${id}SidesContainer" class="hidden mt-2 pl-6 flex flex-col gap-1.5 text-xs border-t border-slate-100 pt-2">
    ${row('Left', 'ซ้าย')}${row('Right', 'ขวา')}
    <div class="flex items-center flex-wrap gap-x-3 gap-y-1 pt-1 border-t border-slate-50">
      <span class="text-[11px] font-semibold text-slate-500">ลักษณะบาดเจ็บ:</span>
      <label class="inline-flex items-center cursor-pointer"><input type="checkbox" name="${id}Injuries" value="wound" class="mr-1 text-medical-600 rounded"> มีแผล</label>
      <label class="inline-flex items-center cursor-pointer"><input type="checkbox" name="${id}Injuries" value="pain_swelling" class="mr-1 text-medical-600 rounded"> ปวด/บวม</label>
      <label class="inline-flex items-center cursor-pointer"><input type="checkbox" name="${id}Injuries" value="deformity" class="mr-1 text-medical-600 rounded"> ผิดรูป</label>
    </div>
  </div>
</div>`;
}

function renderBiteRegionBox({
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
      <input type="checkbox" id="${parentId}" onchange="toggleBiteGroup('${subGroupId}', this.checked)" class="text-medical-600 focus:ring-medical-500 h-5 w-5 rounded flex-shrink-0">
      <div class="ml-3 leading-snug">
        <span class="text-sm font-bold text-slate-900">${Array.isArray(title) ? wrapBiteWords(title) : title}</span>
        ${desc ? `<p class="text-xs text-slate-500 mt-0.5">${desc}</p>` : ''}
      </div>
    </label>
    <div id="${subGroupId}" class="hidden pl-4 sm:pl-6 space-y-4 border-l-2 border-medical-200">
      <div>
        <p class="text-xs text-slate-600 font-semibold mb-2">จุดที่บาดเจ็บ (เลือกแล้วระบุด้านและลักษณะบาดเจ็บ):</p>
        <div class="space-y-2">${partsHtml}</div>
      </div>
      <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
        ${renderBiteSysHeader({
          label: 'อาการสำคัญที่พบร่วมด้วย (เลือกได้หลายข้อ)',
          icon: 'alert-circle',
          colorClass: 'bg-amber-100 text-amber-700',
          toggleId: signsNoneId,
          toggleLabel: 'ไม่มีอาการร่วม',
          toggleOnchange: `handleBiteGroupNoneToggle(this, '${signsName}')`
        })}
        ${renderBiteGrid(signsCols, signs, {
          name: signsName,
          compact: true,
          onchange: `handleBiteGroupItemChange(this, '${signsNoneId}')`
        })}
      </div>
    </div>
  </div>`;
}

function toggleBiteGroup(subId, show) {
  const el = document.getElementById(subId);
  if (!el) return;
  if (show) {
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
    el.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    el.querySelectorAll('input[type="radio"]').forEach(rb => { rb.checked = false; });
    el.querySelectorAll('input[type="text"]').forEach(ti => { ti.value = ''; });
    el.querySelectorAll('input[type="number"]').forEach(ni => { ni.value = ''; });
  }
}

function handleBiteBleedingContainerToggle() {
  const biteWoundCb = document.querySelector('input[name="biteExposures"][value="bite_wound"]');
  const scratchWoundCb = document.querySelector('input[name="biteExposures"][value="scratch_wound"]');
  const show = (biteWoundCb && biteWoundCb.checked) || (scratchWoundCb && scratchWoundCb.checked);
  const container = document.getElementById('biteBleedingStatusContainer');
  if (container) {
    if (show) {
      container.classList.remove('hidden');
    } else {
      container.classList.add('hidden');
      container.querySelectorAll('input[type="radio"]').forEach(rb => { rb.checked = false; });
    }
  }
}

function clearBitePainScore() {
  bitePainScoreTouched = false;
  const slider = document.getElementById('bitePainScore');
  if (slider) slider.value = 0;
  const emojiEl = document.getElementById('bitePainScoreEmoji');
  const textEl = document.getElementById('bitePainScoreText');
  const badgeEl = document.getElementById('bitePainScoreBadge');
  const clearBtn = document.getElementById('bitePainScoreClearBtn');
  if (emojiEl) emojiEl.textContent = '⚪';
  if (textEl) textEl.textContent = 'ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)';
  if (badgeEl) badgeEl.className = 'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all';
  if (clearBtn) clearBtn.classList.add('hidden');
}

function handleBitePainScoreChange(val) {
  bitePainScoreTouched = true;
  const num = parseInt(val, 10) || 0;
  const slider = document.getElementById('bitePainScore');
  if (slider && String(slider.value) !== String(num)) slider.value = num;
  const emojiEl = document.getElementById('bitePainScoreEmoji'), textEl = document.getElementById('bitePainScoreText');
  const badgeEl = document.getElementById('bitePainScoreBadge'), clearBtn = document.getElementById('bitePainScoreClearBtn');
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
function setBitePainScore(score) { bitePainScoreTouched = true; const s = document.getElementById('bitePainScore'); if (s) s.value = score; handleBitePainScoreChange(score); }
const handleBitePainSliderTouch = handleBitePainScoreChange;
if (typeof window !== 'undefined') {
  window.toggleBiteGroup = toggleBiteGroup;
  window.handleBiteBleedingContainerToggle = handleBiteBleedingContainerToggle;
  window.handleBiteGroupNoneToggle = handleBiteGroupNoneToggle;
  window.handleBiteGroupItemChange = handleBiteGroupItemChange;
  window.clearBitePainScore = clearBitePainScore;
  window.handleBitePainScoreChange = handleBitePainScoreChange;
  window.setBitePainScore = setBitePainScore;
}

// --- Clinical Decision Support & Evaluation Functions ---
function evaluateBiteRedFlags(patient) {
  const rfs = [];
  const addRf = (key, level, textTh, risk, action) => {
    rfs.push({ key, level, textTh, title: textTh, risk, detail: risk, suggestedAction: action, action });
  };
  const vs = patient.vital_signs || {};
  const sbp = typeof vs.sbp === 'number' ? vs.sbp : (parseInt(vs.sbp, 10) || null);
  const pr = typeof vs.pr === 'number' ? vs.pr : (parseInt(vs.pr, 10) || null);
  const bt = typeof vs.bt === 'number' ? vs.bt : (parseFloat(vs.bt) || null);
  const shockIndex = (sbp && pr) ? (pr / sbp) : 0;

  const bleedingStatus = patient.biteBleedingStatus || '';

  const headSigns = Array.isArray(patient.biteHeadSigns) ? patient.biteHeadSigns : [];
  const neckSigns = Array.isArray(patient.biteNeckSigns) ? patient.biteNeckSigns : [];
  const upperSigns = Array.isArray(patient.biteUpperExtSigns) ? patient.biteUpperExtSigns : [];
  const infectionSigns = Array.isArray(patient.biteInfectionSigns) ? patient.biteInfectionSigns : [];
  const sysSigns = Array.isArray(patient.biteSystemicSigns) ? patient.biteSystemicSigns : [];

  // RED FLAG 1: Severe Neck/Face Mauling, Active Arterial Bleeding, Shock or Rabies Encephalitis (ESI 1 / 2)
  const isSevereAirwayOrShock = (bleedingStatus === 'pulsatile_massive') ||
    (sbp !== null && sbp < 90) || (shockIndex >= 0.9) ||
    sysSigns.includes('hydrophobia_aerophobia_agitation') ||
    (patient.biteParentNeck && (neckSigns.includes('stridor_dysphagia_air_leak') || neckSigns.includes('deep_neck_wound_expanding_hematoma'))) ||
    (patient.biteParentHeadFace && headSigns.includes('large_laceration_tissue_defect'));

  if (isSevereAirwayOrShock) {
    const isEsi1 = (sbp !== null && sbp < 90) || bleedingStatus === 'pulsatile_massive' || sysSigns.includes('hydrophobia_aerophobia_agitation');
    addRf('rf_bite_severe_neck_face_hemorrhagic_shock', isEsi1 ? 'ESI 1' : 'ESI 2', 'แผลสัตว์กัดขย้ำรุนแรงบริเวณลำคอ/ใบหน้า เลือดออกพุ่งตามชีพจร หรือมีภาวะช็อก/สงสัยอาการทางสมอง (Severe Neck/Maxillofacial Mauling, Active Arterial Bleeding, Shock or Rabies Encephalitis)', 'ผู้ป่วยมีแผลฉีกขาดรุนแรงบริเวณใบหน้า/ลำคอ หรือมีเลือดไหลพุ่งตามชีพจร ความดันตกช็อก หรือมีอาการทางสมองกลัวน้ำกลัวลม เสี่ยงต่อการเสียชีวิตฉุกเฉิน', 'ประเมิน ABCDE ทันที, กดห้ามเลือดโดยตรง, ให้สารน้ำทางหลอดเลือดดำ, ตรวจทางเดินหายใจใกล้ชิด และปรึกษาศัลยแพทย์/ศัลยกรรมตกแต่งด่วน');
  }

  // RED FLAG 2: High-Risk Hand Bite / Suspected Flexor Tenosynovitis / Tendon-Nerve Injury (ESI 2)
  const isHandOrFingerWound = (patient.biteParentUpperExtremity && (patient.biteArmWrist || patient.biteArmFingers));
  const hasHandTendonOrNerveThreat = isHandOrFingerWound && (
    upperSigns.includes('finger_joint_swelling_cannot_flex_extend') ||
    upperSigns.includes('hand_numbness_loss_sensation') ||
    upperSigns.includes('tendon_bone_exposed_deformity') ||
    upperSigns.includes('digit_amputation')
  );

  if (hasHandTendonOrNerveThreat) {
    addRf('rf_bite_deep_hand_tendon_joint_infection', 'ESI 2', 'แผลถูกกัดบริเวณมือ/นิ้วมือร่วมกับสงสัยการติดเชื้อในเยื่อหุ้มเอ็น/ข้อต่อ หรือเส้นเอ็น/เส้นประสาทบาดเจ็บ (High-Risk Hand Bite / Suspected Flexor Tenosynovitis / Tendon-Nerve Injury)', 'เขี้ยวสัตว์เจาะลึกบริเวณฝ่ามือหรือนิ้วมือ มีอาการปวดบวมตามแนวเส้นเอ็น ขยับงอเหยียดนิ้วไม่ได้ หรือมีอาการชา เสี่ยงต่อภาวะ Flexor Tenosynovitis / Compartment Syndrome และสูญเสียการทำงานของมือถาวร', 'ตรวจ Kanavel cardinal signs, ห้ามเย็บปิดแผลที่มือเด็ดขาด (Avoid primary closure), ให้ยาปฏิชีวนะทางหลอดเลือดดำ และปรึกษาศัลยแพทย์กระดูกและข้อ/ศัลยศาสตร์ทางมือด่วน');
  }

  // RED FLAG 3: Infected Animal Bite / Lymphangitis-Abscess / Sepsis Risk (ESI 2 / 3)
  const hasLocalInfection = infectionSigns.includes('erythema_edema_throbbing_pain') ||
    infectionSigns.includes('pus_purulent_discharge') ||
    infectionSigns.includes('lymphangitis_lymphadenopathy');
  const hasSystemicInfection = sysSigns.includes('fever_chills') || (bt !== null && bt >= 38.0);

  if (hasLocalInfection || hasSystemicInfection) {
    const isSepsisLevel = hasSystemicInfection || infectionSigns.includes('lymphangitis_lymphadenopathy');
    addRf('rf_bite_infected_wound_sepsis_immunocompromised', isSepsisLevel ? 'ESI 2' : 'ESI 3', 'แผลสัตว์กัดมีการอักเสบติดเชื้อเป็นหนอง รอยแดงลามตามเส้นเลือด หรือมีไข้ (Infected Animal Bite / Lymphangitis-Abscess / Sepsis Risk)', 'พบสัญญาณการติดเชื้อแบคทีเรียเฉียบพลันจากช่องปากสัตว์ (เช่น Pasteurella multocida, Capnocytophaga, Staphylococcus aureus) เสี่ยงต่อการลุกลามเป็นฝีหนองลึกและภาวะติดเชื้อในกระแสเลือด', 'เปิดระบายหนองหากมีฝี (Incision & Drainage), เก็บหนองเพาะเชื้อ, ให้ยาปฏิชีวนะครอบคลุมเชื้อสัตว์กัด (Amoxicillin-Clavulanate เป็น First-line) และพิจารณารับตัวไว้รักษาในรพ.หากมีไข้สูง');
  }

  return rfs;
}

// --- Dynamic Output Update Function ---
function updateBiteOutputs(rec) {
  if (!rec) return;
  const rapidText = renderBiteRapidHpi(rec);
  const narrativeText = renderBiteNarrative(rec);

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

  const redFlags = evaluateBiteRedFlags(rec);
  rec.redFlags = redFlags;

  const jsonOutput = {
    encounter: {
      chief_complaint: 'animal_bite',
      chief_complaint_title_th: 'สุนัข แมว สัตว์เลี้ยงลูกด้วยนมกัด',
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
      animal_types: Array.isArray(rec.biteAnimalTypes) ? rec.biteAnimalTypes : [],
      animal_other_detail: rec.biteAnimalOtherDetail || '',
      exposures: Array.isArray(rec.biteExposures) ? rec.biteExposures : [],
      bleeding_status: rec.biteBleedingStatus || null,
      animal_behavior: Array.isArray(rec.biteAnimalBehavior) ? rec.biteAnimalBehavior : [],
      wound_cleansing: rec.biteWoundCleansing || null,
      pain_score: rec.painScore,
      rabies_vaccine_history: rec.biteRabiesVaccineHx || null,
      tetanus_history: rec.biteTetanusHx || null,
      anatomical_regions: {
        head_face: !!rec.biteParentHeadFace,
        neck: !!rec.biteParentNeck,
        chest: !!rec.biteParentChest,
        abdomen: !!rec.biteParentAbdomen,
        upper_extremity: !!rec.biteParentUpperExtremity,
        lower_extremity: !!rec.biteParentLowerExtremity,
        other: !!rec.biteParentOther,
        other_detail: rec.biteOtherLocationDetail || ''
      },
      fingers_digits: Array.isArray(rec.biteArmFingersDigits) ? rec.biteArmFingersDigits : [],
      fingers_left_digits: Array.isArray(rec.biteArmFingersLeftDigits) ? rec.biteArmFingersLeftDigits : [],
      fingers_right_digits: Array.isArray(rec.biteArmFingersRightDigits) ? rec.biteArmFingersRightDigits : [],
      toes_digits: Array.isArray(rec.biteLegToesDigits) ? rec.biteLegToesDigits : [],
      toes_left_digits: Array.isArray(rec.biteLegToesLeftDigits) ? rec.biteLegToesLeftDigits : [],
      toes_right_digits: Array.isArray(rec.biteLegToesRightDigits) ? rec.biteLegToesRightDigits : [],
      infection_signs: Array.isArray(rec.biteInfectionSigns) ? rec.biteInfectionSigns : [],
      systemic_signs: Array.isArray(rec.biteSystemicSigns) ? rec.biteSystemicSigns : [],
      other_symptoms_free: rec.otherSymptomsFree || ''
    },
    safety_and_red_flags: {
      red_flags_detected: redFlags.map(rf => ({
        key: rf.key,
        level: rf.level,
        title_th: rf.textTh || rf.title,
        clinical_risk: rf.risk || rf.detail,
        action: rf.suggestedAction || rf.action
      })),
      total_red_flags: redFlags.length
    }
  };

  const jsonEl = document.getElementById('jsonViewer');
  if (jsonEl) jsonEl.textContent = JSON.stringify(jsonOutput, null, 2);
  return { rapid: rapidText, narrative: narrativeText, json: jsonOutput };
}

// --- Text Formatter Helpers ---
function formatBiteAnimals(patient) {
  const arr = Array.isArray(patient.biteAnimalTypes) ? patient.biteAnimalTypes : [];
  if (arr.length === 0) return 'ไม่ระบุชนิดสัตว์';
  const map = {
    dog: 'สุนัข',
    cat: 'แมว',
    bat: 'ค้างคาว',
    other_mammal: patient.biteAnimalOtherDetail ? `สัตว์เลี้ยงลูกด้วยนมอื่นๆ (${patient.biteAnimalOtherDetail})` : 'สัตว์เลี้ยงลูกด้วยนมอื่นๆ'
  };
  return arr.map(k => map[k] || k).join(', ');
}

function formatBiteExposures(patient) {
  const arr = Array.isArray(patient.biteExposures) ? patient.biteExposures : [];
  if (arr.length === 0) return 'ไม่ระบุลักษณะการสัมผัส';
  const map = {
    bite_wound: 'ถูกกัดเป็นแผลฉีกขาดหรือรอยเขี้ยวเจาะลึก',
    scratch_wound: 'ถูกข่วนเป็นรอยแผลหรือแผลถลอก',
    bruise_blunt: 'ถูกงับเป็นรอยช้ำ/รอยบุ๋ม (ไม่มีแผลเปิด)',
    saliva_mucosa_wound: 'ถูกสัตว์เลีย/น้ำลายกระเด็นเข้าตา/ปาก/จมูก/แผลเปิดเดิม',
    saliva_intact_skin: 'ถูกสัตว์เลียบนผิวหนังปกติ (ไม่มีแผล)'
  };
  return arr.map(k => map[k] || k).join(', ');
}

function formatBiteBleedingStatus(patient) {
  const map = {
    no_bleeding: 'ไม่มีเลือดออก (แผลถลอกตื้น)',
    oozing_stopped: 'มีเลือดออกซึม แต่ขณะนี้หยุดไหลแล้ว',
    oozing_active: 'ยังมีเลือดไหลซึมออกจากแผลต่อเนื่อง',
    pulsatile_massive: 'เลือดไหลพุ่งเป็นจังหวะตามชีพจร หรือออกมากผิดปกติ'
  };
  return map[patient.biteBleedingStatus] || 'ไม่ระบุ';
}

function formatBiteBehavior(patient) {
  const arr = Array.isArray(patient.biteAnimalBehavior) ? patient.biteAnimalBehavior : [];
  if (arr.length === 0) return 'ไม่ระบุข้อมูลสัตว์';
  const map = {
    owned_quarantine_10d: 'สัตว์มีเจ้าของ กักดูอาการต่อได้ครบ 10 วัน',
    stray_disappeared: 'สัตว์จรจัด/หนีหายไป ติดตามดูอาการไม่ได้',
    unprovoked_abnormal: 'กัดโดยไม่มีสาเหตุจูงใจ หรือมีอาการดุร้ายผิดปกติ/น้ำลายไหลยืด',
    animal_died_killed: 'สัตว์ตายแล้วหรือถูกฆ่าตายหลังเกิดเหตุ',
    animal_vaccinated_criteria: 'สัตว์เคยได้รับวัคซีนตามเกณฑ์ (>= 2 ครั้ง และครั้งหลังสุด <= 1 ปี)'
  };
  return arr.map(k => map[k] || k).join('; ');
}

function formatBiteCleansing(patient) {
  const map = {
    cleaned_soap_water: 'ล้างด้วยน้ำสะอาดและฟอกสบู่เรียบร้อยแล้ว',
    cleaned_water_antiseptic_only: 'ล้างน้ำหรือทายาฆ่าเชื้อ แต่ไม่ได้ฟอกสบู่',
    not_cleaned: 'ยังไม่ได้ล้างแผล'
  };
  return map[patient.biteWoundCleansing] || 'ไม่ระบุ';
}

function formatBiteLocations(patient) {
  const locs = [];
  const sideMap = { left: 'ซ้าย', right: 'ขวา', center: 'ตรงกลาง' };
  const injMap = { wound: 'มีแผล', pain_swelling: 'ปวด/บวม', deformity: 'ผิดรูป' };
  const digitMap = { thumb: 'นิ้วโป้ง', index: 'นิ้วชี้', middle: 'นิ้วกลาง', ring: 'นิ้วนาง', little: 'นิ้วก้อย' };
  const fmtSides = (sd) => (Array.isArray(sd) && sd.length > 0) ? ` [${sd.map(x => sideMap[x] || x).join('/')}]` : '';
  const fmtInj = (inj) => (Array.isArray(inj) && inj.length > 0) ? ` (${inj.map(x => injMap[x] || x).join(', ')})` : '';
  const fmtPart = (sd, inj) => `${fmtSides(sd)}${fmtInj(inj)}`;
  const fmtDigits = (d) => (Array.isArray(d) && d.length > 0) ? ` [${d.map(x => digitMap[x] || x).join(', ')}]` : '';
  const fmtDigitsBySide = (leftD, rightD, fallbackSides, fallbackD, inj) => {
    const parts = [];
    if (Array.isArray(leftD) && leftD.length > 0) parts.push(`ซ้าย: ${leftD.map(x => digitMap[x] || x).join(', ')}`);
    if (Array.isArray(rightD) && rightD.length > 0) parts.push(`ขวา: ${rightD.map(x => digitMap[x] || x).join(', ')}`);
    const base = parts.length > 0 ? ` [${parts.join('; ')}]` : `${fmtSides(fallbackSides)}${fmtDigits(fallbackD)}`;
    return `${base}${fmtInj(inj)}`;
  };

  if (patient.biteParentHeadFace) {
    const subs = [];
    if (patient.biteHeadScalp) subs.push(`หนังศีรษะ${fmtPart(patient.biteHeadScalpSides, patient.biteHeadScalpInjuries)}`);
    if (patient.biteHeadFace) subs.push(`ใบหน้า${fmtPart(patient.biteHeadFaceSides, patient.biteHeadFaceInjuries)}`);
    if (patient.biteHeadEye) subs.push(`ดวงตา${fmtPart(patient.biteHeadEyeSides, patient.biteHeadEyeInjuries)}`);
    if (patient.biteHeadEar) subs.push(`ใบหู${fmtPart(patient.biteHeadEarSides, patient.biteHeadEarInjuries)}`);
    if (patient.biteHeadNoseMouth) subs.push(`จมูก/ปาก${fmtPart(patient.biteHeadNoseMouthSides, patient.biteHeadNoseMouthInjuries)}`);
    locs.push(`ศีรษะและใบหน้า (${subs.length > 0 ? subs.join(', ') : 'บริเวณศีรษะ/ใบหน้า'})`);
  }
  if (patient.biteParentNeck) {
    const subs = [];
    if (patient.biteNeckFront) subs.push(`ลำคอด้านหน้า${fmtPart(patient.biteNeckFrontSides, patient.biteNeckFrontInjuries)}`);
    if (patient.biteNeckSide) subs.push(`ลำคอด้านข้าง${fmtPart(patient.biteNeckSideSides, patient.biteNeckSideInjuries)}`);
    if (patient.biteNeckBack) subs.push(`ต้นคอด้านหลัง${fmtPart(patient.biteNeckBackSides, patient.biteNeckBackInjuries)}`);
    locs.push(`ลำคอ (${subs.length > 0 ? subs.join(', ') : 'บริเวณลำคอ'})`);
  }
  if (patient.biteParentChest) {
    const subs = [];
    if (patient.biteChestFront) subs.push(`หน้าอก${fmtPart(patient.biteChestFrontSides, patient.biteChestFrontInjuries)}`);
    if (patient.biteChestUpperBack) subs.push(`หลังส่วนบน/สะบัก${fmtPart(patient.biteChestUpperBackSides, patient.biteChestUpperBackInjuries)}`);
    locs.push(`ทรวงอก (${subs.length > 0 ? subs.join(', ') : 'บริเวณทรวงอก'})`);
  }
  if (patient.biteParentAbdomen) {
    const subs = [];
    if (patient.biteAbdWall) subs.push(`หน้าท้อง${fmtPart(patient.biteAbdWallSides, patient.biteAbdWallInjuries)}`);
    if (patient.biteAbdFlank) subs.push(`สีข้าง/บั้นเอว${fmtPart(patient.biteAbdFlankSides, patient.biteAbdFlankInjuries)}`);
    if (patient.biteAbdLowerBack) subs.push(`หลังส่วนล่าง${fmtPart(patient.biteAbdLowerBackSides, patient.biteAbdLowerBackInjuries)}`);
    if (patient.biteAbdGluteal) subs.push(`สะโพก/ก้น${fmtPart(patient.biteAbdGlutealSides, patient.biteAbdGlutealInjuries)}`);
    if (patient.biteAbdGenitalia) subs.push(`อวัยวะเพศ${fmtPart(patient.biteAbdGenitaliaSides, patient.biteAbdGenitaliaInjuries)}`);
    locs.push(`ช่องท้อง/สะโพก (${subs.length > 0 ? subs.join(', ') : 'บริเวณช่องท้อง/สะโพก'})`);
  }
  if (patient.biteParentUpperExtremity) {
    const subs = [];
    if (patient.biteArmShoulder) subs.push(`หัวไหล่/ต้นแขน${fmtPart(patient.biteArmShoulderSides, patient.biteArmShoulderInjuries)}`);
    if (patient.biteArmElbow) subs.push(`ข้อศอก/แขนท่อนล่าง${fmtPart(patient.biteArmElbowSides, patient.biteArmElbowInjuries)}`);
    if (patient.biteArmWrist) subs.push(`ข้อมือ/ฝ่ามือ${fmtPart(patient.biteArmWristSides, patient.biteArmWristInjuries)}`);
    if (patient.biteArmFingers) subs.push(`นิ้วมือ${fmtDigitsBySide(patient.biteArmFingersLeftDigits, patient.biteArmFingersRightDigits, patient.biteArmFingersSides, patient.biteArmFingersDigits, patient.biteArmFingersInjuries)}`);
    locs.push(`แขนและมือ (${subs.length > 0 ? subs.join(', ') : 'บริเวณแขน/มือ'})`);
  }
  if (patient.biteParentLowerExtremity) {
    const subs = [];
    if (patient.biteLegThigh) subs.push(`ต้นขา${fmtPart(patient.biteLegThighSides, patient.biteLegThighInjuries)}`);
    if (patient.biteLegKneeShin) subs.push(`เข่า/หน้าแข้ง/น่อง${fmtPart(patient.biteLegKneeShinSides, patient.biteLegKneeShinInjuries)}`);
    if (patient.biteLegAnkleFoot) subs.push(`ข้อเท้า/เท้า${fmtPart(patient.biteLegAnkleFootSides, patient.biteLegAnkleFootInjuries)}`);
    if (patient.biteLegToes) subs.push(`นิ้วเท้า${fmtDigitsBySide(patient.biteLegToesLeftDigits, patient.biteLegToesRightDigits, patient.biteLegToesSides, patient.biteLegToesDigits, patient.biteLegToesInjuries)}`);
    locs.push(`ขาและเท้า (${subs.length > 0 ? subs.join(', ') : 'บริเวณขา/เท้า'})`);
  }
  if (patient.biteParentOther) {
    locs.push(`ตำแหน่งอื่นๆ (${patient.biteOtherLocationDetail || 'ระบุตำแหน่งอื่น'})`);
  }

  return locs.length > 0 ? locs.join('; ') : 'ไม่ระบุตำแหน่ง';
}

function formatBiteInfectionSigns(patient) {
  const arr = Array.isArray(patient.biteInfectionSigns) ? patient.biteInfectionSigns : [];
  if (arr.length === 0) return 'ไม่ได้ระบุ';
  if (arr.includes('no_local_infection')) return 'ไม่มีอาการบวมแดงร้อนหรือหนอง';
  const map = {
    erythema_edema_throbbing_pain: 'รอบแผลบวมแดงร้อน/ปวดตุบๆ',
    pus_purulent_discharge: 'มีหนองหรือน้ำเหลืองขุ่นกลิ่นเหม็น',
    lymphangitis_lymphadenopathy: 'รอยแดงลามตามเส้นเลือด หรือก้อนนูนบวมเจ็บที่รักแร้/ขาหนีบ'
  };
  return arr.map(k => map[k] || k).join(', ');
}

function formatBiteSystemicSigns(patient) {
  const arr = Array.isArray(patient.biteSystemicSigns) ? patient.biteSystemicSigns : [];
  if (arr.length === 0) return 'ไม่ได้ระบุ';
  if (arr.includes('no_systemic_signs')) return 'ไม่มีอาการผิดปกติทางระบบร่างกาย';
  const map = {
    fever_chills: 'มีไข้หนาวสั่น/ครั่นเนื้อตัว',
    dizziness_presyncope_shock: 'หน้ามืด เวียนศีรษะ วูบ ใจสั่นเหงื่อแตกตัวเย็น',
    hydrophobia_aerophobia_agitation: 'กลืนน้ำลำบาก กลัวน้ำ กลัวลม หรือกระสับกระส่าย'
  };
  return arr.map(k => map[k] || k).join(', ');
}

function formatBiteRabiesHx(patient) {
  const map = {
    naive_or_incomplete: 'ไม่เคยฉีดมาก่อน หรือฉีดไม่ครบ (< 3 เข็ม)',
    completed_last_within_3m: 'เคยฉีดครบ (>= 3 เข็ม) โดยเข็มสุดท้าย/กระตุ้น <= 3 เดือน',
    completed_last_3_to_6m: 'เคยฉีดครบ (>= 3 เข็ม) โดยเข็มสุดท้าย/กระตุ้น 3-6 เดือน',
    completed_last_over_6m: 'เคยฉีดครบ (>= 3 เข็ม) โดยเข็มสุดท้าย/กระตุ้น > 6 เดือน',
    unknown_or_unsure: 'จำประวัติไม่ได้ / ไม่แน่ใจ'
  };
  return map[patient.biteRabiesVaccineHx] || 'ไม่ระบุ';
}

function formatBiteTetanusHx(patient) {
  const map = {
    within_5_years: 'เคยฉีดเข็มกระตุ้นภายใน 5 ปีที่ผ่านมา',
    '5_to_10_years': 'เคยฉีดในช่วง 5–10 ปีที่ผ่านมา',
    more_than_10_years: 'เคยฉีดครบ แต่เกิน 10 ปีแล้ว',
    over_10_years: 'เคยฉีดครบ แต่เกิน 10 ปีแล้ว',
    never_or_unsure: 'ไม่เคยฉีด หรือจำประวัติไม่ได้',
    unknown_or_never: 'ไม่เคยฉีด หรือจำประวัติไม่ได้'
  };
  return map[patient.biteTetanusHx] || 'ไม่ได้ระบุ';
}

function formatBiteFemaleHx(patient) {
  if (!isBiteFemalePatient(patient)) return '';
  if (!patient.biteLmpDate && !patient.bitePregnancyStatus) return '';
  const pregMap = {
    not_pregnant: 'ไม่ได้ตั้งครรภ์ / ประจำเดือนมาปกติ',
    suspected_or_missed: 'ขาดประจำเดือน / สงสัยอาจตั้งครรภ์',
    confirmed_pregnant: 'ยืนยันกำลังตั้งครรภ์',
    menopause_or_hysterectomy: 'วัยหมดประจำเดือน / ผ่าตัดมดลูกแล้ว',
    unknown: 'ไม่ทราบสถานะการตั้งครรภ์'
  };
  return `LMP ${patient.biteLmpDate || 'ไม่ระบุ'} (${pregMap[patient.bitePregnancyStatus] || 'ไม่ได้ระบุ'})`;
}

// --- Rapid HPI Note Generator ---
function renderBiteRapidHpi(patient) {
  const durVal = patient.durationVal !== undefined && patient.durationVal !== null ? patient.durationVal : '';
  const durUnit = patient.durationUnit || 'hours';
  const unitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durStr = durVal ? `${durVal} ${unitMap[durUnit] || durUnit}` : 'ไม่ระบุ';

  const painScoreStr = patient.painScore !== null && patient.painScore !== undefined ? `${patient.painScore}/10` : 'ไม่ระบุ';
  const rfs = evaluateBiteRedFlags(patient);

  const posList = [];
  const negList = [];

  const bleedingStatus = patient.biteBleedingStatus || '';
  if (bleedingStatus === 'pulsatile_massive') posList.push('มีเลือดไหลพุ่งตามชีพจร หรือเลือดออกมากผิดปกติ (Active Arterial Bleeding)');
  else if (bleedingStatus === 'oozing_active') posList.push('ยังมีเลือดไหลซึมต่อเนื่องจากบาดแผล');
  else if (bleedingStatus === 'oozing_stopped') posList.push('มีเลือดออกซึมจากแผลแต่หยุดไหลแล้ว (WHO Category III)');
  else if (bleedingStatus === 'no_bleeding') negList.push('ไม่มีเลือดออกจากบาดแผล');
  const animalTypes = Array.isArray(patient.biteAnimalTypes) ? patient.biteAnimalTypes : [];
  if (animalTypes.includes('bat')) posList.push('มีประวัติสัมผัสค้างคาว (Bat Exposure)');
  const animalBehaviors = Array.isArray(patient.biteAnimalBehavior) ? patient.biteAnimalBehavior : [];
  if (animalBehaviors.includes('stray_disappeared')) posList.push('สัตว์จรจัดหรือหนีหายไปแล้ว ติดตามดูอาการไม่ได้');
  if (animalBehaviors.includes('unprovoked_abnormal')) posList.push('สัตว์กัดโดยไม่มีสาเหตุจูงใจ หรือมีอาการดุร้ายผิดปกติ');
  const headSigns = Array.isArray(patient.biteHeadSigns) ? patient.biteHeadSigns : [];
  if (headSigns.includes('large_laceration_tissue_defect')) posList.push('แผลฉีกขาดขนาดใหญ่ที่ศีรษะ/ใบหน้า หรือชิ้นเนื้อแหว่งหาย');
  if (headSigns.includes('eye_injury_vision_loss')) posList.push('แผลถูกลูกตาโดยตรง หรือตามัวลืมตาไม่ขึ้น');
  if (headSigns.includes('saliva_splash_eye')) posList.push('น้ำลายสัตว์กระเด็นเข้าเยื่อบุตา');
  const neckSigns = Array.isArray(patient.biteNeckSigns) ? patient.biteNeckSigns : [];
  if (neckSigns.includes('deep_neck_wound_expanding_hematoma') || neckSigns.includes('stridor_dysphagia_air_leak')) posList.push('แผลขย้ำลึกที่ลำคอ เสี่ยงต่อทางเดินหายใจอุดกั้น');
  const upperSigns = Array.isArray(patient.biteUpperExtSigns) ? patient.biteUpperExtSigns : [];
  if (upperSigns.includes('finger_joint_swelling_cannot_flex_extend')) posList.push('ปวดบวมมากตามแนวข้อนิ้วมือ ขยับงอเหยียดนิ้วไม่ได้ (สงสัย Flexor Tenosynovitis)');
  if (upperSigns.includes('hand_numbness_loss_sensation')) posList.push('มีอาการชาหรือสูญเสียความรู้สึกที่มือ/นิ้วมือ');
  const infectionSigns = Array.isArray(patient.biteInfectionSigns) ? patient.biteInfectionSigns : [];
  if (infectionSigns.includes('lymphangitis_lymphadenopathy')) posList.push('มีรอยแดงลามตามเส้นเลือด หรือก้อนนูนบวมเจ็บที่รักแร้/ขาหนีบ');
  if (infectionSigns.includes('pus_purulent_discharge')) posList.push('มีหนองหรือน้ำเหลืองขุ่นไหลซึมจากแผล');
  const sysSigns = Array.isArray(patient.biteSystemicSigns) ? patient.biteSystemicSigns : [];
  if (sysSigns.includes('fever_chills')) posList.push('มีไข้หนาวสั่น');
  if (sysSigns.includes('dizziness_presyncope_shock')) posList.push('มีอาการหน้ามืด วูบ หรือเหงื่อแตกตัวเย็น');
  if (sysSigns.includes('hydrophobia_aerophobia_agitation')) posList.push('มีอาการกลืนน้ำลำบาก กลัวน้ำ กลัวลม หรือกระสับกระส่าย');
  if (infectionSigns.includes('no_local_infection')) negList.push('ไม่มีอาการบวมแดงร้อนหรือหนอง');
  if (sysSigns.includes('no_systemic_signs')) negList.push('ไม่มีไข้หนาวสั่น และไม่มีอาการหน้ามืดช็อก');

  const hospRecordMap = {
    complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
    additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
    verified: 'มีประวัติในระบบ ยืนยันข้อมูลถูกต้อง',
    self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
    unspecified: 'ไม่ได้ระบุ'
  };
  const hospRecordStr = hospRecordMap[patient.hospRecordStatus] || 'ไม่ได้ระบุ';
  const udArr = Array.isArray(patient.underlying) ? patient.underlying : (patient.underlying ? [patient.underlying] : []);
  const filteredUd = udArr.filter(u => u && !u.includes('ปฏิเสธ') && u !== 'ไม่มี' && u !== 'ไม่มีโรคประจำตัว' && u !== 'ไม่ได้ระบุ');
  const hasExplicitUdDeny = udArr.some(u => u && (u.includes('ปฏิเสธ') || u === 'ไม่มี' || u === 'ไม่มีโรคประจำตัว'));
  const udDisplay = filteredUd.length > 0
    ? filteredUd.join(', ')
    : ((hasExplicitUdDeny || patient.hospRecordStatus === 'self' || patient.hospRecordStatus === 'additional') ? 'ปฏิเสธ' : 'ไม่ได้ระบุ');
  const allergyDisplay = (!patient.drugAllergy || patient.drugAllergy === 'ไม่ได้ระบุ')
    ? 'ไม่ได้ระบุ'
    : ((patient.drugAllergy.includes('ปฏิเสธ') || patient.drugAllergy === 'ไม่มี') ? 'ปฏิเสธ' : patient.drugAllergy);
  const medsDisplay = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ')
    ? 'ไม่ได้ระบุ'
    : (patient.currentMeds === 'ไม่มี' ? 'ไม่มี' : patient.currentMeds);

  return `[Chief Complaint (CC)]
สุนัข แมว สัตว์เลี้ยงลูกด้วยนมกัด เป็นมา ${durStr}

[History of Present Illness (HPI)]
• ชนิดสัตว์: ${formatBiteAnimals(patient)} | พฤติกรรม/สถานะสัตว์: ${formatBiteBehavior(patient)}
• ลักษณะการสัมผัส/บาดแผล: ${formatBiteExposures(patient)} | สถานะเลือดออก: ${formatBiteBleedingStatus(patient)}
• การล้างแผลเบื้องต้นก่อนมารพ.: ${formatBiteCleansing(patient)}
• ตำแหน่งบาดเจ็บและชนิดการบาดเจ็บ: ${formatBiteLocations(patient)}
• อาการอักเสบติดเชื้อเฉพาะที่: ${formatBiteInfectionSigns(patient)}
• อาการแสดงทางระบบร่างกาย: ${formatBiteSystemicSigns(patient)}
• ระดับความเจ็บปวด (Pain Score): ${painScoreStr}

• Pertinent Positives:
${posList.length > 0 ? posList.map(p => `  - ${p}`).join('\n') : '  - ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม'}

• Pertinent Negatives:
${negList.length > 0 ? negList.map(n => `  - ${n}`).join('\n') : '  - ผู้ป่วยไม่ได้ระบุคำตอบยืนยันในหมวดอาการร่วม'}

[Past Medical History & Immunization Profile]
• สถานะประวัติ รพ.ราชบุรี: ${hospRecordStr}
• ประวัติวัคซีนพิษสุนัขบ้าในตัวผู้ป่วย: ${formatBiteRabiesHx(patient)}
• ประวัติวัคซีนบาดทะยัก: ${formatBiteTetanusHx(patient)}${formatBiteFemaleHx(patient) ? `\n• ประวัติสตรี: ${formatBiteFemaleHx(patient)}` : ''}
• โรคประจำตัว (Underlying Diseases): ${udDisplay}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${allergyDisplay}
• ยาประจำตัวที่รับประทานอยู่: ${medsDisplay}
${patient.otherSymptomsFree ? `• ข้อมูลเพิ่มเติมจากผู้ป่วย/ญาติ: ${patient.otherSymptomsFree}\n` : ''}
[Emergency Risk Assessment (Red Flags)]
${rfs.length > 0 ? `🚩 RED FLAGS DETECTED:\n${rfs.map(rf => `  * ${rf.title}\n    ความเสี่ยง: ${rf.detail}\n    ข้อแนะนำการดูแลเร่งด่วน: ${rf.action}`).join('\n\n')}` : '✅ ไม่พบสัญญาณเตือนวิกฤตความเสี่ยงสูง (Non-Red Flag)'}`;
}

// --- Narrative Note Generator ---
function renderBiteNarrative(patient) {
  const durVal = patient.durationVal !== undefined && patient.durationVal !== null ? patient.durationVal : '';
  const durUnit = patient.durationUnit || 'hours';
  const unitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durStr = durVal ? `${durVal} ${unitMap[durUnit] || durUnit}` : 'ไม่ระบุระยะเวลา';

  const animalStr = formatBiteAnimals(patient);
  const exposureStr = formatBiteExposures(patient);
  const bleedingStr = formatBiteBleedingStatus(patient);
  const locStr = formatBiteLocations(patient);
  const cleansingStr = formatBiteCleansing(patient);
  const rabiesHxStr = formatBiteRabiesHx(patient);
  const pScore = (typeof patient.painScore === 'number' && patient.painScore > 0) ? `${patient.painScore}/10` : 'ไม่ระบุ';

  const genderLabel = (patient.gender && patient.gender !== 'ไม่ระบุ') ? patient.gender : '';
  let note = `ผู้ป่วย${genderLabel} อายุ ${patient.age || 'ไม่ระบุ'} ปี ได้รับบาดเจ็บถูก${animalStr} โดยมีลักษณะ${exposureStr} เป็นมาประมาณ ${durStr} ก่อนมาโรงพยาบาล สถานะเลือดออกในขณะนี้: ${bleedingStr} ตรวจพบตำแหน่งบาดเจ็บและชนิดการบาดเจ็บที่บริเวณ${locStr} การปฐมพยาบาลเบื้องต้น: ${cleansingStr} ระดับความเจ็บปวดประเมินได้ ${pScore} ประวัติวัคซีนพิษสุนัขบ้าเดิมในตัวผู้ป่วย: ${rabiesHxStr} ประวัติวัคซีนบาดทะยัก: ${formatBiteTetanusHx(patient)}`;
  const femStr = formatBiteFemaleHx(patient);
  if (femStr) note += ` ประวัติสตรี: ${femStr}`;

  if (patient.otherSymptomsFree) {
    note += ` ข้อมูลเพิ่มเติม: ${patient.otherSymptomsFree}`;
  }

  return note;
}

function renderBiteDoctorHpi(patient) {
  return renderBiteRapidHpi(patient);
}

// --- FORM HTML TEMPLATE ---
const ANIMAL_BITE_FORM_HTML = `
<div id="cc-animal-bite-section" class="hidden space-y-6">
  <div data-cc-top-banner="animal_bite"><div class="flex flex-col gap-4">
  <!-- 💡 ส่วนต้น: ข้อแนะนำการปฐมพยาบาลและการล้างแผลเบื้องต้น -->
  <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs sm:text-sm text-amber-900 shadow-sm flex items-start space-x-3">
    <div class="text-amber-600 mt-0.5 flex-shrink-0">
      <i data-lucide="info" class="w-5 h-5"></i>
    </div>
    <div class="space-y-1">
      <div class="font-bold text-amber-950">ข้อแนะนำระหว่างรอพบแพทย์:</div>
      <ul class="list-disc pl-4 space-y-1 text-amber-800 text-xs">
        <li><strong>ล้างแผลด้วยน้ำสะอาดและฟอกสบู่ทันที:</strong> หากแผลเลือดไม่ออกรุนแรง ให้ล้างฟอกสบู่หลายๆ ครั้งเพื่อลดโอกาสติดเชื้อ</li>
        <li><strong>หากยังมีเลือดออกมาก:</strong> ใช้ผ้าสะอาดกดลงบนแผลโดยตรงให้แน่นต่อเนื่องจนเลือดหยุด</li>
        <li><strong>ห้ามพอกสมุนไพร ผงยา หรือสิ่งแปลกปลอม</strong> ลงในแผล เพราะเสี่ยงติดเชื้อรุนแรง</li>
      </ul>
    </div>
  </div>
  </div></div>

  <!-- CARD 1: ข้อมูลเหตุการณ์ ชนิดสัตว์ ลักษณะแผล และสถานะสัตว์ -->
  <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
    <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
        <i data-lucide="paw-print" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900">1. ข้อมูลเหตุการณ์ ชนิดสัตว์ ลักษณะแผล และสถานะสัตว์</h2>
        <p class="text-xs text-slate-500">ระยะเวลา ชนิดสัตว์ การสัมผัส สถานะเลือดออก พฤติกรรมสัตว์ และล้างแผล</p>
      </div>
    </div>

    <!-- 1.1 ระยะเวลาที่เกิดเหตุ -->
    <div>
      <label class="block text-xs font-semibold text-slate-800 mb-1.5">
        1.1 ถูกสัตว์กัด ข่วน หรือสัมผัสน้ำลายมานานเท่าไรแล้ว <span class="text-rose-500">*</span>
      </label>
      <div class="flex items-center gap-2 max-w-sm">
        <input type="number" id="biteDurationVal" min="1" max="365" placeholder="เช่น 30"
          class="w-24 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white transition">
        <select id="biteDurationUnit"
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

    <!-- 1.2 ชนิดของสัตว์ -->
    <div class="pt-3 border-t border-slate-100">
      <label class="block text-xs font-semibold text-slate-800 mb-2">
        1.2 ชนิดของสัตว์ที่กัด ข่วน หรือสัมผัสน้ำลาย (เลือกได้หลายข้อ):
      </label>
      ${renderBiteGrid('grid-cols-2 sm:grid-cols-4', [
        { name: 'biteAnimalTypes', value: 'dog', title: ['สุนัข'], compact: true },
        { name: 'biteAnimalTypes', value: 'cat', title: ['แมว'], compact: true },
        { name: 'biteAnimalTypes', value: 'bat', title: ['ค้างคาว'], compact: true },
        {
          name: 'biteAnimalTypes',
          value: 'other_mammal',
          title: ['สัตว์อื่นๆ'],
          onchange: "toggleBiteGroup('biteAnimalOtherDetailContainer', this.checked)",
          compact: true
        }
      ])}
      <div id="biteAnimalOtherDetailContainer" class="hidden mt-2.5 pl-3 border-l-2 border-medical-200">
        <input type="text" id="biteAnimalOtherDetail" placeholder="พิมพ์ระบุชนิดสัตว์ เช่น หนู, กระรอก, กระต่าย, ลิง, วัว, ม้า..."
          class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white transition">
      </div>
    </div>

    <!-- 1.3 ลักษณะบาดแผล การสัมผัส และสถานะเลือดออก -->
    <div class="pt-3 border-t border-slate-100">
      <label class="block text-xs font-semibold text-slate-800 mb-2">
        1.3 ลักษณะบาดแผลและการสัมผัส (เลือกได้หลายข้อ):
      </label>
      <div class="space-y-2.5">
        ${renderBiteGrid('grid-cols-1 sm:grid-cols-2', [
          {
            name: 'biteExposures',
            value: 'bite_wound',
            title: ['แผลฉีกขาด', '/ รอยเขี้ยว'],
            desc: 'ถูกกัดเป็นแผลเปิดหรือเขี้ยวเจาะลึก',
            onchange: 'handleBiteBleedingContainerToggle()'
          },
          {
            name: 'biteExposures',
            value: 'scratch_wound',
            title: ['แผลถลอก / ขีดข่วน'],
            desc: 'ถูกกัดหรือข่วนผิวหนังเป็นรอยถลอก',
            onchange: 'handleBiteBleedingContainerToggle()'
          }
        ])}

        <!-- Nested Bleeding Status Container -->
        <div id="biteBleedingStatusContainer" class="hidden ml-3 pl-3 border-l-2 border-medical-300 py-1">
          <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            ${renderBiteSysHeader({
              label: 'สถานะเลือดออกของบาดแผลที่ถูกกัด / ข่วน',
              icon: 'droplet',
              colorClass: 'bg-rose-100 text-rose-700',
              toggleKind: 'radio',
              toggleId: 'biteBleedNoneRb',
              toggleName: 'biteBleedingStatus',
              toggleValue: 'no_bleeding',
              toggleLabel: 'ไม่มีเลือดออก'
            })}
            ${renderBiteGrid('grid-cols-1 sm:grid-cols-3', [
              { kind: 'radio', name: 'biteBleedingStatus', value: 'oozing_stopped', title: ['มีเลือดซึม', 'แต่หยุดไหลแล้ว'], compact: true },
              { kind: 'radio', name: 'biteBleedingStatus', value: 'oozing_active', title: ['ยังมีเลือดซึม', 'ต่อเนื่อง'], compact: true },
              { kind: 'radio', name: 'biteBleedingStatus', value: 'pulsatile_massive', title: ['เลือดไหลพุ่ง', '/ ออกมากผิดปกติ'], compact: true }
            ])}
          </div>
        </div>

        ${renderBiteGrid('grid-cols-1 sm:grid-cols-3', [
          {
            name: 'biteExposures',
            value: 'bruise_blunt',
            title: ['ถูกงับเป็นรอยช้ำ', 'ไม่มีแผลเปิด'],
            desc: 'ไม่มีแผลถลอกและไม่มีเลือดออก',
            compact: true
          },
          {
            name: 'biteExposures',
            value: 'saliva_mucosa_wound',
            title: ['ถูกเลีย / น้ำลาย', 'เข้าเยื่อบุ หรือแผล'],
            desc: 'ตา ปาก จมูก หรือโดนแผลเปิดเดิม',
            compact: true
          },
          {
            name: 'biteExposures',
            value: 'saliva_intact_skin',
            title: ['ถูกเลียผิวหนังปกติ'],
            desc: 'ผิวหนังไม่มีแผลหรือรอยถลอก',
            compact: true
          }
        ])}
      </div>
    </div>

    <!-- 1.4 ข้อมูลสถานะและพฤติกรรมของสัตว์ -->
    <div class="pt-3 border-t border-slate-100">
      <label class="block text-xs font-semibold text-slate-800 mb-2">
        1.4 สถานะและพฤติกรรมของสัตว์ที่กัด (เลือกได้หลายข้อ):
      </label>
      ${renderBiteGrid('grid-cols-1 sm:grid-cols-2', [
        {
          name: 'biteAnimalBehavior',
          value: 'owned_quarantine_10d',
          title: ['มีเจ้าของ', 'กักขังสังเกตได้', 'ครบ 10 วัน'],
          desc: 'เลี้ยงในบ้านและติดตามดูอาการต่อได้',
          compact: true
        },
        {
          name: 'biteAnimalBehavior',
          value: 'stray_disappeared',
          title: ['สัตว์จรจัด / หนีหาย', 'ติดตามอาการไม่ได้'],
          desc: 'ไม่มีเจ้าของ หรือหนีหายหลังเกิดเหตุ',
          compact: true
        },
        {
          name: 'biteAnimalBehavior',
          value: 'unprovoked_abnormal',
          title: ['กัดไม่มีสาเหตุ', '/ มีอาการดุร้าย'],
          desc: 'วิ่งเข้ากัดเอง น้ำลายไหลยืด เดินโซเซ',
          compact: true
        },
        {
          name: 'biteAnimalBehavior',
          value: 'animal_died_killed',
          title: ['สัตว์ที่กัดตายแล้ว', '/ ถูกฆ่าตาย'],
          desc: 'ตายเองหรือถูกฆ่าตายหลังเกิดเหตุ',
          compact: true
        },
        {
          name: 'biteAnimalBehavior',
          value: 'animal_vaccinated_criteria',
          title: ['สัตว์ฉีดวัคซีน', 'ตามเกณฑ์กำหนด'],
          desc: 'ฉีดป้องกันพิษสุนัขบ้า >= 2 ครั้ง และเข็มล่าสุด <= 1 ปี',
          colSpan2: true,
          compact: true
        }
      ])}
    </div>

    <!-- 1.5 การล้างแผลเบื้องต้น -->
    <div class="pt-3 border-t border-slate-100">
      <label class="block text-xs font-semibold text-slate-800 mb-2">
        1.5 การล้างแผลเบื้องต้นก่อนมาโรงพยาบาล
      </label>
      ${renderBiteGrid('grid-cols-1 sm:grid-cols-3', [
        { kind: 'radio', name: 'biteWoundCleansing', value: 'cleaned_soap_water', title: ['ล้างน้ำสะอาด', 'และฟอกสบู่แล้ว'], compact: true },
        { kind: 'radio', name: 'biteWoundCleansing', value: 'cleaned_water_antiseptic_only', title: ['ล้างน้ำ / ทายา', 'แต่ไม่ได้ฟอกสบู่'], compact: true },
        { kind: 'radio', name: 'biteWoundCleansing', value: 'not_cleaned', title: ['ยังไม่ได้ล้างแผลเลย'], compact: true }
      ])}
    </div>
  </div>

  <!-- CARD 2: ตำแหน่งบาดเจ็บ อาการร่วม และการติดเชื้อเฉพาะที่ -->
  <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
        <i data-lucide="user-check" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900">2. ตำแหน่งบาดเจ็บ อาการร่วม และการติดเชื้อเฉพาะที่</h2>
        <p class="text-xs text-slate-500">เลือกตำแหน่งที่ถูกกัด/ข่วน ระบุข้างซ้าย/ขวา และอาการเฉพาะจุด</p>
      </div>
    </div>

    <div class="space-y-4">
      ${renderBiteRegionBox({
        parentId: 'biteParentHeadFace',
        subGroupId: 'biteHeadSubGroup',
        title: ['2.1 ศีรษะ ใบหน้า', 'ดวงตา หรือในปาก'],
        desc: 'หนังศีรษะ หน้าผาก คิ้ว แก้ม คาง ตา หู จมูก ริมฝีปาก',
        partsHtml: [
          renderBitePart('biteHeadScalp', 'หนังศีรษะ / หน้าผาก / ท้ายทอย', true),
          renderBitePart('biteHeadFace', 'ใบหน้า / คิ้ว / แก้ม / คาง', true),
          renderBitePart('biteHeadEye', 'ดวงตา / เปลือกตา'),
          renderBitePart('biteHeadEar', 'ใบหู'),
          renderBitePart('biteHeadNoseMouth', 'จมูก / ริมฝีปาก / ในช่องปาก', true)
        ].join(''),
        signsName: 'biteHeadSigns',
        signsNoneId: 'biteHeadSignsNoneCb',
        signs: [
          { value: 'large_laceration_tissue_defect', title: ['แผลฉีกขาดใหญ่', 'ลึกหรือเนื้อแหว่ง'], desc: 'ลึกถึงกะโหลก หรือชิ้นเนื้อหน้า/หู/ปากแหว่ง' },
          { value: 'eye_injury_vision_loss', title: ['แผลถูกตาโดยตรง', 'ตาพร่า / มองไม่ชัด'], desc: 'หรือบวมจนลืมตาไม่ขึ้น' },
          { value: 'saliva_splash_eye', title: ['น้ำลายสัตว์กระเด็น', 'หรือโดนเลียเข้าตา'] },
          { value: 'head_trauma_loc_vomit', title: ['ศีรษะกระแทกร่วม', 'สลบ / อาเจียน'], desc: 'หรือปวดศีรษะรุนแรง' }
        ]
      })}

      ${renderBiteRegionBox({
        parentId: 'biteParentNeck',
        subGroupId: 'biteNeckSubGroup',
        title: ['2.2 บาดแผลที่ลำคอ'],
        desc: 'คอด้านหน้า ด้านข้าง หรือต้นคอด้านหลัง',
        partsHtml: [
          renderBitePart('biteNeckFront', 'ลำคอด้านหน้า', true),
          renderBitePart('biteNeckSide', 'ลำคอด้านข้าง'),
          renderBitePart('biteNeckBack', 'ต้นคอด้านหลัง', true)
        ].join(''),
        signsName: 'biteNeckSigns',
        signsNoneId: 'biteNeckSignsNoneCb',
        signs: [
          { value: 'deep_neck_wound_expanding_hematoma', title: ['ขย้ำลึกที่คอ', 'หรือก้อนบวมโตเร็ว'] },
          { value: 'stridor_dysphagia_air_leak', title: ['หายใจ / กลืนลำบาก', 'เสียงแหบ / ลมออกคอ'] }
        ]
      })}

      ${renderBiteRegionBox({
        parentId: 'biteParentChest',
        subGroupId: 'biteChestSubGroup',
        title: ['2.3 หน้าอก', 'หรือหลังบน / สะบัก'],
        desc: 'หน้าอก ราวนม แผ่นหลังช่วงบน หรือสะบัก',
        partsHtml: [
          renderBitePart('biteChestFront', 'หน้าอก / ราวนม', true),
          renderBitePart('biteChestUpperBack', 'แผ่นหลังส่วนบน / สะบัก', true)
        ].join(''),
        signsName: 'biteChestSigns',
        signsNoneId: 'biteChestSignsNoneCb',
        signsCols: 'grid-cols-1',
        signs: [
          { value: 'deep_chest_mauling_dyspnea', title: ['แผลถูกขย้ำลึก', 'หอบเหนื่อย แน่นอก'] }
        ]
      })}

      ${renderBiteRegionBox({
        parentId: 'biteParentAbdomen',
        subGroupId: 'biteAbdomenSubGroup',
        title: ['2.4 ช่องท้อง เอว', 'ก้น หรืออวัยวะเพศ'],
        desc: 'หน้าท้อง สีข้าง บั้นเอว หลังล่าง สะโพก ก้น ขาหนีบ',
        partsHtml: [
          renderBitePart('biteAbdWall', 'หน้าท้อง', true),
          renderBitePart('biteAbdFlank', 'สีข้าง / บั้นเอว'),
          renderBitePart('biteAbdLowerBack', 'หลังส่วนล่าง', true),
          renderBitePart('biteAbdGluteal', 'สะโพก / ก้น', true),
          renderBitePart('biteAbdGenitalia', 'ขาหนีบ / อวัยวะเพศ', true)
        ].join(''),
        signsName: 'biteAbdomenSigns',
        signsNoneId: 'biteAbdomenSignsNoneCb',
        signs: [
          { value: 'deep_abdominal_penetration', title: ['แผลกัด / ข่วนลึก', 'ฉีกขาดที่หน้าท้อง'] },
          { value: 'genital_injury', title: ['บาดเจ็บ / มีแผล', 'บริเวณอวัยวะเพศ'] }
        ]
      })}

      ${renderBiteRegionBox({
        parentId: 'biteParentUpperExtremity',
        subGroupId: 'biteUpperExtSubGroup',
        title: ['2.5 ไหล่ แขน ศอก', 'ข้อมือ หรือมือ/นิ้ว'],
        desc: 'ต้นแขน ข้อศอก แขนท่อนล่าง ฝ่ามือ หรือนิ้วมือ',
        partsHtml: [
          renderBitePart('biteArmShoulder', 'หัวไหล่ / ต้นแขน'),
          renderBitePart('biteArmElbow', 'ข้อศอก / แขนท่อนล่าง'),
          renderBitePart('biteArmWrist', 'ข้อมือ / ฝ่ามือ / หลังมือ'),
          renderBiteDigits('biteArmFingers', 'นิ้วมือ')
        ].join(''),
        signsName: 'biteUpperExtSigns',
        signsNoneId: 'biteUpperExtSignsNoneCb',
        signs: [
          { value: 'finger_joint_swelling_cannot_flex_extend', title: ['บวมตามข้อนิ้วมือ', 'งอ / เหยียดไม่ได้'] },
          { value: 'hand_numbness_loss_sensation', title: ['ชา ไร้ความรู้สึก', 'ฝ่ามือ / ปลายนิ้ว'] },
          { value: 'tendon_bone_exposed_deformity', title: ['แผลลึกเห็นเอ็น', 'กระดูก / มือผิดรูป'] },
          { value: 'digit_amputation', title: ['ชิ้นส่วนนิ้วมือ', 'ขาดออกจากกัน'] }
        ]
      })}

      ${renderBiteRegionBox({
        parentId: 'biteParentLowerExtremity',
        subGroupId: 'biteLowerExtSubGroup',
        title: ['2.6 ต้นขา เข่า', 'ข้อเท้า หรือเท้า'],
        desc: 'ต้นขา เข่า หน้าแข้ง น่อง ข้อเท้า ฝ่าเท้า หรือนิ้วเท้า',
        partsHtml: [
          renderBitePart('biteLegThigh', 'ต้นขา'),
          renderBitePart('biteLegKneeShin', 'เข่า / หน้าแข้ง / น่อง'),
          renderBitePart('biteLegAnkleFoot', 'ข้อเท้า / ฝ่าเท้า / หลังเท้า / ส้นเท้า'),
          renderBiteDigits('biteLegToes', 'นิ้วเท้า')
        ].join(''),
        signsName: 'biteLowerExtSigns',
        signsNoneId: 'biteLowerExtSignsNoneCb',
        signsCols: 'grid-cols-1 sm:grid-cols-3',
        signs: [
          { value: 'cannot_bear_weight_ankle_toe_deficit', title: ['เดินลงน้ำหนักไม่ได้', 'ขยับเท้าไม่ได้'] },
          { value: 'foot_numbness', title: ['มีอาการชา', 'ที่เท้า / ปลายนิ้ว'] },
          { value: 'leg_tendon_bone_exposed_deformity', title: ['แผลลึกเห็นเอ็น', 'กระดูก / ขาผิดรูป'] }
        ]
      })}

      <!-- 2.7 บาดแผลที่ตำแหน่งอื่นๆ (พิมพ์ระบุ) -->
      <div class="border border-slate-200 rounded-2xl p-3.5 bg-slate-50/50">
        <label class="selectable-card flex items-center cursor-pointer">
          <input type="checkbox" id="biteParentOther"
            onchange="toggleBiteGroup('biteOtherSubGroup', this.checked)"
            class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
          <span class="ml-3 text-xs sm:text-sm font-bold text-slate-900">2.7 บาดแผลที่ตำแหน่งอื่นๆ (พิมพ์ระบุ)</span>
        </label>
        <div id="biteOtherSubGroup" class="hidden mt-3 pl-6 border-l-2 border-medical-200 space-y-2">
          <label class="text-xs font-semibold text-slate-600 block">ระบุตำแหน่งบาดแผลเพิ่มเติม:</label>
          <input type="text" id="biteOtherLocationDetail" placeholder="เช่น รักแร้, ซอกคอ, ก้นกบ..."
            class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500">
        </div>
      </div>

      <!-- 2.8 อาการอักเสบติดเชื้อบริเวณบาดแผล -->
      <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
        ${renderBiteSysHeader({
          label: '2.8 อาการอักเสบติดเชื้อบริเวณบาดแผล (เลือกได้หลายข้อ)',
          icon: 'flame',
          colorClass: 'bg-amber-100 text-amber-700',
          toggleId: 'biteInfectionNoneCb',
          toggleName: 'biteInfectionSigns',
          toggleValue: 'no_local_infection',
          toggleLabel: 'ไม่มีอาการในหมวดนี้',
          toggleOnchange: "handleBiteGroupNoneToggle(this, 'biteInfectionSigns')"
        })}
        ${renderBiteGrid('grid-cols-1 sm:grid-cols-3', [
          {
            name: 'biteInfectionSigns',
            value: 'erythema_edema_throbbing_pain',
            title: ['รอบแผลบวมแดงร้อน', 'ปวดตุบๆ เพิ่มขึ้น'],
            onchange: "handleBiteGroupItemChange(this, 'biteInfectionNoneCb')",
            compact: true
          },
          {
            name: 'biteInfectionSigns',
            value: 'pus_purulent_discharge',
            title: ['มีหนอง / น้ำเหลือง', 'ขุ่นมีกลิ่นเหม็นซึม'],
            onchange: "handleBiteGroupItemChange(this, 'biteInfectionNoneCb')",
            compact: true
          },
          {
            name: 'biteInfectionSigns',
            value: 'lymphangitis_lymphadenopathy',
            title: ['รอยแดงลาม', 'ตามแนวเส้นเลือด /', 'ก้อนบวมเจ็บขาหนีบ', '/ รักแร้'],
            onchange: "handleBiteGroupItemChange(this, 'biteInfectionNoneCb')",
            compact: true
          }
        ])}
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
        <p class="text-xs text-slate-500">ประเมินภาวะไข้ ติดเชื้อในกระแสเลือด และระดับความปวดบริเวณแผล</p>
      </div>
    </div>

    <!-- 3.1 อาการผิดปกติทางระบบร่างกาย -->
    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
      ${renderBiteSysHeader({
        label: '3.1 อาการผิดปกติของร่างกายที่พบร่วม (เลือกได้หลายข้อ)',
        icon: 'shield-alert',
        colorClass: 'bg-rose-100 text-rose-700',
        toggleId: 'biteSystemicNoneCb',
        toggleName: 'biteSystemicSigns',
        toggleValue: 'no_systemic_signs',
        toggleLabel: 'ไม่มีอาการในหมวดนี้',
        toggleOnchange: "handleBiteGroupNoneToggle(this, 'biteSystemicSigns')"
      })}
      ${renderBiteGrid('grid-cols-1 sm:grid-cols-3', [
        {
          name: 'biteSystemicSigns',
          value: 'fever_chills',
          title: ['มีไข้ หนาวสั่น', 'ครั่นเนื้อครั่นตัว'],
          onchange: "handleBiteGroupItemChange(this, 'biteSystemicNoneCb')",
          compact: true
        },
        {
          name: 'biteSystemicSigns',
          value: 'dizziness_presyncope_shock',
          title: ['หน้ามืด เวียนหัว', 'ใจสั่น เหงื่อแตก'],
          onchange: "handleBiteGroupItemChange(this, 'biteSystemicNoneCb')",
          compact: true
        },
        {
          name: 'biteSystemicSigns',
          value: 'hydrophobia_aerophobia_agitation',
          title: ['กลืนน้ำลำบาก', 'กลัวน้ำ กลัวลม'],
          desc: 'หรือกระสับกระส่ายผิดปกติ',
          onchange: "handleBiteGroupItemChange(this, 'biteSystemicNoneCb')",
          compact: true
        }
      ])}
    </div>

    <!-- 3.2 ระดับความปวดบริเวณบาดแผล -->
    <div class="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label class="block text-xs font-semibold text-slate-800 uppercase tracking-wider">3.2 ระดับความปวดบริเวณบาดแผลในขณะนี้ (0 – 10)</label>
        <div class="flex items-center space-x-2">
          <span id="bitePainScoreBadge" class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all">
            <span id="bitePainScoreEmoji" class="text-base">⚪</span>
            <span id="bitePainScoreText">ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)</span>
          </span>
          <button type="button" id="bitePainScoreClearBtn" onclick="clearBitePainScore()" class="text-xs text-slate-400 hover:text-rose-600 underline hidden transition" title="ล้างค่าเพื่อให้เป็นไม่ได้ระบุ">ล้างค่า</button>
        </div>
      </div>
      <div class="px-1 pt-1"><input type="range" id="bitePainScore" min="0" max="10" value="0" step="1" oninput="handleBitePainScoreChange(this.value)" class="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-600 focus:outline-none focus:ring-2 focus:ring-medical-500"></div>
      <div class="grid grid-cols-5 text-center text-[10px] sm:text-[11px] pt-1 gap-1 text-slate-500 font-medium">
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setBitePainScore(0)"><span class="text-lg sm:text-xl block">😊</span><span>0: สบายดี</span></div>
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setBitePainScore(2)"><span class="text-lg sm:text-xl block">🙂</span><span>1–3: เล็กน้อย</span></div>
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setBitePainScore(5)"><span class="text-lg sm:text-xl block">😐</span><span>4–6: ปานกลาง</span></div>
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setBitePainScore(8)"><span class="text-lg sm:text-xl block">😣</span><span>7–9: ปวดมาก</span></div>
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setBitePainScore(10)"><span class="text-lg sm:text-xl block">😭</span><span>10: ปวดที่สุด</span></div>
      </div>
    </div>
  </div>

  <!-- CARD 4: ประวัติวัคซีนพิษสุนัขบ้า วัคซีนบาดทะยัก และข้อมูลสตรี -->
  <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
    <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
        <i data-lucide="shield-plus" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900">4. ประวัติวัคซีนพิษสุนัขบ้า และวัคซีนป้องกันโรคบาดทะยัก</h2>
        <p class="text-xs text-slate-500">ข้อมูลประวัติวัคซีนเดิมในตัวผู้ป่วย เพื่อวางแผนการฉีดวัคซีนและเซรุ่มป้องกันโรค</p>
      </div>
    </div>

    <!-- 4.1 ประวัติวัคซีนพิษสุนัขบ้า -->
    <div>
      <label class="block text-xs font-semibold text-slate-800 mb-2">
        4.1 ประวัติวัคซีนป้องกันโรคพิษสุนัขบ้าในตัวผู้ป่วยเอง
      </label>
      ${renderBiteGrid('grid-cols-1 sm:grid-cols-2', [
        {
          kind: 'radio',
          name: 'biteRabiesVaccineHx',
          value: 'naive_or_incomplete',
          title: ['ไม่เคยฉีดวัคซีน', '/ ฉีดไม่ครบ 3 เข็ม'],
          desc: 'ไม่เคยฉีดพิษสุนัขบ้ามาก่อนเลย หรือฉีดไม่ครบ (< 3 เข็ม)',
          compact: true
        },
        {
          kind: 'radio',
          name: 'biteRabiesVaccineHx',
          value: 'completed_last_within_3m',
          title: ['ฉีดครบ (>= 3 เข็ม)', 'ไม่เกิน 3 เดือนก่อน'],
          desc: 'เคยฉีดครบคอร์ส และเข็มสุดท้ายหรือกระตุ้น <= 3 เดือน',
          compact: true
        },
        {
          kind: 'radio',
          name: 'biteRabiesVaccineHx',
          value: 'completed_last_3_to_6m',
          title: ['ฉีดครบ (>= 3 เข็ม)', 'ช่วง 3–6 เดือนก่อน'],
          desc: 'เคยฉีดครบคอร์ส และเข็มสุดท้ายหรือกระตุ้นในช่วง 3–6 เดือน',
          compact: true
        },
        {
          kind: 'radio',
          name: 'biteRabiesVaccineHx',
          value: 'completed_last_over_6m',
          title: ['ฉีดครบ (>= 3 เข็ม)', 'นานเกิน 6 เดือนแล้ว'],
          desc: 'เคยฉีดครบคอร์ส แต่เข็มสุดท้ายหรือกระตุ้นนานเกิน 6 เดือน',
          compact: true
        },
        {
          kind: 'radio',
          name: 'biteRabiesVaccineHx',
          value: 'unknown_or_unsure',
          title: ['จำประวัติไม่ได้', '/ ไม่แน่ใจ'],
          desc: 'ไม่แน่ใจจำนวนเข็มหรือวันที่ฉีดครั้งล่าสุด',
          colSpan2: true,
          compact: true
        }
      ])}
    </div>

    <!-- 4.2 ประวัติการได้รับวัคซีนป้องกันบาดทะยัก (Locked Tetanus Standard) -->
    <div class="pt-3 border-t border-slate-100">
      <label class="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
        4.2 ประวัติการได้รับวัคซีนป้องกันบาดทะยัก
      </label>
      ${renderBiteGrid('grid-cols-1 sm:grid-cols-2', [
        {
          kind: 'radio',
          name: 'biteTetanusHx',
          value: 'within_5_years',
          title: ['ฉีดกระตุ้น', 'ภายใน 5 ปี'],
          desc: 'เคยฉีดครบ (3 เข็ม) มาก่อน และเข็มสุดท้ายหรือกระตุ้นไม่เกิน 5 ปี',
          compact: true
        },
        {
          kind: 'radio',
          name: 'biteTetanusHx',
          value: '5_to_10_years',
          title: ['ฉีดล่าสุด', '5–10 ปีก่อน'],
          desc: 'เคยฉีดครบ (3 เข็ม) มาก่อน และเข็มสุดท้ายหรือกระตุ้นอยู่ในช่วง 5–10 ปี',
          compact: true
        },
        {
          kind: 'radio',
          name: 'biteTetanusHx',
          value: 'more_than_10_years',
          title: ['ฉีดครบ', 'เกิน 10 ปีแล้ว'],
          desc: 'เคยฉีดครบ (3 เข็ม) มาก่อน แต่เข็มสุดท้ายนานเกิน 10 ปีแล้ว',
          compact: true
        },
        {
          kind: 'radio',
          name: 'biteTetanusHx',
          value: 'never_or_unsure',
          title: ['ไม่เคยฉีด', '/ จำไม่ได้'],
          desc: 'ไม่เคยได้รับวัคซีนบาดทะยัก ฉีดไม่ครบ 3 เข็ม หรือไม่ทราบประวัติ',
          compact: true
        }
      ])}
    </div>

    <!-- 4.3 ส่วนเฉพาะผู้ป่วยสตรี (Hidden by default - C-AP13) -->
    <div id="biteFemaleSection" class="hidden pt-3 border-t border-slate-100">
      <div class="p-3.5 bg-pink-50/40 rounded-xl border border-pink-100 space-y-3">
        ${renderBiteSysHeader({
          label: '4.3 ประจำเดือนและการตั้งครรภ์ (เฉพาะสตรี)',
          icon: 'heart-pulse',
          colorClass: 'bg-pink-100 text-pink-700',
          toggleKind: 'radio',
          toggleId: 'bitePregNotPregRb',
          toggleName: 'bitePregnancyStatus',
          toggleValue: 'not_pregnant',
          toggleLabel: 'ไม่ได้ตั้งครรภ์'
        })}
        ${renderBiteGrid('grid-cols-1 sm:grid-cols-2', [
          { kind: 'radio', name: 'bitePregnancyStatus', value: 'suspected_or_missed', title: ['ขาดประจำเดือน', '/ สงสัยตั้งครรภ์'], compact: true },
          { kind: 'radio', name: 'bitePregnancyStatus', value: 'confirmed_pregnant', title: ['ยืนยัน', 'กำลังตั้งครรภ์'], compact: true },
          { kind: 'radio', name: 'bitePregnancyStatus', value: 'menopause_or_hysterectomy', title: ['หมดประจำเดือน', '/ ผ่าตัดมดลูกแล้ว'], compact: true },
          { kind: 'radio', name: 'bitePregnancyStatus', value: 'unknown', title: ['ไม่ทราบ'], compact: true }
        ])}
        <div class="max-w-xs">
          <label class="block text-[11px] font-semibold text-slate-700 mb-1">วันแรกของประจำเดือนครั้งสุดท้าย (ถ้าจำได้):</label>
          <input type="text" id="biteLmpDate" data-universal-date="true" placeholder="วว/ดด/ปปปป เช่น 28/10/2026" class="w-full min-w-0 text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-1.5 focus:ring-medical-500 focus:border-medical-500 bg-white">
        </div>
      </div>
    </div>
  </div>

  <!-- อาการอื่นๆ เป็นช่องกรอกอิสระ -->
  <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100">
      <div class="bg-slate-100 text-slate-600 p-2 rounded-xl"><i data-lucide="message-square-plus" class="w-5 h-5"></i></div>
      <div>
        <h2 class="text-base font-bold text-slate-800">อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2>
        <p class="text-xs text-slate-500">ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)</p>
      </div>
    </div>
    <textarea id="animal_bite_other_free" rows="2" placeholder="พิมพ์ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)..."
      class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"></textarea>
  </div>
</div>
`;

// --- MAIN MODULE REGISTRY OBJECT ---
const animalBiteModule = {
  id: 'animal_bite',
  recordCc: 'animal_bite',
  schemaCode: 'mammalian_bite',
  titleTh: 'สุนัข แมว สัตว์เลี้ยงลูกด้วยนมกัด',
  titleEn: 'Animal / Dog / Cat bites (Rabies risk)',
  icon: 'paw-print',
  doctorCcBadgeHtml: '<i data-lucide="paw-print" class="w-3.5 h-3.5 mr-1 text-amber-500"></i> CC: สุนัข แมว สัตว์เลี้ยงลูกด้วยนมกัด (Animal Bites)',
  pmhSectionNumber: 5,
  dateFields: ['biteLmpDate'],
  algorithm: 'animal-bite-protocol',
  sectionDomId: 'cc-animal-bite-section',
  formHtml: ANIMAL_BITE_FORM_HTML,

  // --- Mounting & Event Listeners Hook ---
  init: function() {
    clearBitePainScore();
  },

  onMounted: function() {
    clearBitePainScore();
  },

  onTitleChange: function(arg) {
    let isFemale = false;
    if (typeof arg === 'boolean') isFemale = arg;
    else if (typeof arg === 'object' && arg !== null) {
      isFemale = typeof arg.isFemale === 'boolean' ? arg.isFemale : (typeof arg.title === 'string' ? /นาง|น\.ส\.|ด\.ญ\.|หญิง|Mrs|Miss|Ms/i.test(arg.title) : isBiteFemalePatient(arg));
    } else if (typeof arg === 'string') {
      isFemale = /นาง|น\.ส\.|ด\.ญ\.|หญิง|Mrs|Miss|Ms/i.test(arg);
    }
    toggleBiteFemaleSection(isFemale);
  },

  onSelectForm: function() { checkAndDisplayBiteLmp({}); },
  onActivate: function(patient) { checkAndDisplayBiteLmp(patient || {}); },

  // --- Collect Intake Hook ---
  collectIntake: function(ctx = {}) {
    const _rawDur = parseFloat(document.getElementById('biteDurationVal')?.value);
    const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
    const durationUnit = document.getElementById('biteDurationUnit')?.value || 'hours';

    const getChecks = (name) => {
      const arr = [];
      document.querySelectorAll(`input[name="${name}"]:checked`).forEach(c => arr.push(c.value));
      return arr;
    };

    const getRadio = (name) => {
      const el = document.querySelector(`input[name="${name}"]:checked`);
      return el ? el.value : null;
    };

    const getSubState = (parent, checkName, sidesName) => {
      if (!parent) return { checked: false, sides: [] };
      const cb = document.querySelector(`input[name="${checkName}"]`);
      const checked = cb ? cb.checked : false;
      const sides = [];
      if (checked && sidesName) {
        document.querySelectorAll(`input[name="${sidesName}"]:checked`).forEach(s => sides.push(s.value));
      }
      return { checked, sides };
    };

    const biteAnimalTypes = getChecks('biteAnimalTypes');
    const biteAnimalOtherDetail = document.getElementById('biteAnimalOtherDetail')?.value?.trim() || '';
    const biteExposures = getChecks('biteExposures');
    const biteBleedingStatus = getRadio('biteBleedingStatus');
    const biteAnimalBehavior = getChecks('biteAnimalBehavior');
    const biteWoundCleansing = getRadio('biteWoundCleansing');

    // 6 Anatomical Regions
    const parentHead = !!document.getElementById('biteParentHeadFace')?.checked;
    const sHeadScalp = getSubState(parentHead, 'biteHeadScalp', 'biteHeadScalpSides');
    const sHeadFace = getSubState(parentHead, 'biteHeadFace', 'biteHeadFaceSides');
    const sHeadEye = getSubState(parentHead, 'biteHeadEye', 'biteHeadEyeSides');
    const sHeadEar = getSubState(parentHead, 'biteHeadEar', 'biteHeadEarSides');
    const sHeadNoseMouth = getSubState(parentHead, 'biteHeadNoseMouth', 'biteHeadNoseMouthSides');
    const headSigns = parentHead ? getChecks('biteHeadSigns') : [];

    const parentNeck = !!document.getElementById('biteParentNeck')?.checked;
    const sNeckFront = getSubState(parentNeck, 'biteNeckFront', 'biteNeckFrontSides');
    const sNeckSide = getSubState(parentNeck, 'biteNeckSide', 'biteNeckSideSides');
    const sNeckBack = getSubState(parentNeck, 'biteNeckBack', 'biteNeckBackSides');
    const neckSigns = parentNeck ? getChecks('biteNeckSigns') : [];

    const parentChest = !!document.getElementById('biteParentChest')?.checked;
    const sChestFront = getSubState(parentChest, 'biteChestFront', 'biteChestFrontSides');
    const sChestUpperBack = getSubState(parentChest, 'biteChestUpperBack', 'biteChestUpperBackSides');
    const chestSigns = parentChest ? getChecks('biteChestSigns') : [];

    const parentAbd = !!document.getElementById('biteParentAbdomen')?.checked;
    const sAbdWall = getSubState(parentAbd, 'biteAbdWall', 'biteAbdWallSides');
    const sAbdFlank = getSubState(parentAbd, 'biteAbdFlank', 'biteAbdFlankSides');
    const sAbdLowerBack = getSubState(parentAbd, 'biteAbdLowerBack', 'biteAbdLowerBackSides');
    const sAbdGluteal = getSubState(parentAbd, 'biteAbdGluteal', 'biteAbdGlutealSides');
    const sAbdGenitalia = getSubState(parentAbd, 'biteAbdGenitalia', 'biteAbdGenitaliaSides');
    const abdSigns = parentAbd ? getChecks('biteAbdomenSigns') : [];

    const parentUpperExt = !!document.getElementById('biteParentUpperExtremity')?.checked;
    const sArmShoulder = getSubState(parentUpperExt, 'biteArmShoulder', 'biteArmShoulderSides');
    const sArmElbow = getSubState(parentUpperExt, 'biteArmElbow', 'biteArmElbowSides');
    const sArmWrist = getSubState(parentUpperExt, 'biteArmWrist', 'biteArmWristSides');
    const isArmFingers = parentUpperExt && !!document.querySelector('input[name="biteArmFingers"]:checked');
    const armFingersLeftDigits = isArmFingers ? getChecks('biteArmFingersLeftDigits') : [];
    const armFingersRightDigits = isArmFingers ? getChecks('biteArmFingersRightDigits') : [];
    const armFingersSides = [];
    if (armFingersLeftDigits.length > 0) armFingersSides.push('left');
    if (armFingersRightDigits.length > 0) armFingersSides.push('right');
    const armFingersDigits = [...new Set([...armFingersLeftDigits, ...armFingersRightDigits])];
    const upperSigns = parentUpperExt ? getChecks('biteUpperExtSigns') : [];

    const parentLowerExt = !!document.getElementById('biteParentLowerExtremity')?.checked;
    const sLegThigh = getSubState(parentLowerExt, 'biteLegThigh', 'biteLegThighSides');
    const sLegKneeShin = getSubState(parentLowerExt, 'biteLegKneeShin', 'biteLegKneeShinSides');
    const sLegAnkleFoot = getSubState(parentLowerExt, 'biteLegAnkleFoot', 'biteLegAnkleFootSides');
    const isLegToes = parentLowerExt && !!document.querySelector('input[name="biteLegToes"]:checked');
    const legToesLeftDigits = isLegToes ? getChecks('biteLegToesLeftDigits') : [];
    const legToesRightDigits = isLegToes ? getChecks('biteLegToesRightDigits') : [];
    const legToesSides = [];
    if (legToesLeftDigits.length > 0) legToesSides.push('left');
    if (legToesRightDigits.length > 0) legToesSides.push('right');
    const legToesDigits = [...new Set([...legToesLeftDigits, ...legToesRightDigits])];
    const lowerSigns = parentLowerExt ? getChecks('biteLowerExtSigns') : [];

    const parentOther = !!document.getElementById('biteParentOther')?.checked;
    const otherLocationDetail = parentOther ? (document.getElementById('biteOtherLocationDetail')?.value?.trim() || '') : '';

    const infectionSigns = getChecks('biteInfectionSigns');
    const systemicSigns = getChecks('biteSystemicSigns');
    const painScore = bitePainScoreTouched ? parseInt(document.getElementById('bitePainScore')?.value || 0, 10) : null;
    const rabiesHx = getRadio('biteRabiesVaccineHx');
    const tetanusHx = getRadio('biteTetanusHx');

    const otherSymptomsFree = document.getElementById('animal_bite_other_free')?.value?.trim() || document.getElementById('sx_other_free')?.value?.trim() || ctx.otherSymptomsFree || '';

    const rec = {
      id: ctx.recordId || ctx.id,
      queue_number: ctx.queueNumber || ctx.queue_number,
      hn: ctx.randomHn || ctx.hn,
      name: ctx.patientName || ctx.name,
      age: ctx.patientAge !== undefined ? ctx.patientAge : ctx.age,
      gender: ctx.gender,
      chief_complaint: 'animal_bite',
      chief_complaint_title: 'สุนัข แมว สัตว์เลี้ยงลูกด้วยนมกัด',
      timestamp: ctx.timestamp || new Date().toISOString(),
      status: ctx.recordStatus || ctx.status || 'waiting',
      durationVal: durationVal,
      durationUnit: durationUnit,
      hospRecordStatus: ctx.hospRecordStatus || '',
      underlying: ctx.underlying || [],
      drugAllergy: ctx.drugAllergy || 'ไม่ได้ระบุ',
      currentMeds: ctx.currentMeds || 'ไม่ได้ระบุ',
      otherSymptomsFree: otherSymptomsFree,
      doctor_notes: ctx.preservedDoctorNotes || ctx.doctor_notes || { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: ctx.vital_signs || { bt: 36.8, sbp: 120, dbp: 80, bp: '120/80', pr: 80, rr: 18, spo2: 98 },
      esi_level: ctx.esi_level || 3,

      // Animal Bite Domain Specific Fields
      biteAnimalTypes: biteAnimalTypes,
      biteAnimalOtherDetail: biteAnimalOtherDetail,
      biteExposures: biteExposures,
      biteBleedingStatus: biteBleedingStatus,
      biteAnimalBehavior: biteAnimalBehavior,
      biteWoundCleansing: biteWoundCleansing,

      // 6 Anatomical Regions
      biteParentHeadFace: parentHead,
      biteHeadScalp: sHeadScalp.checked,
      biteHeadScalpSides: sHeadScalp.sides,
      biteHeadFace: sHeadFace.checked,
      biteHeadFaceSides: sHeadFace.sides,
      biteHeadEye: sHeadEye.checked,
      biteHeadEyeSides: sHeadEye.sides,
      biteHeadEar: sHeadEar.checked,
      biteHeadEarSides: sHeadEar.sides,
      biteHeadNoseMouth: sHeadNoseMouth.checked,
      biteHeadNoseMouthSides: sHeadNoseMouth.sides,
      biteHeadSigns: headSigns,

      biteParentNeck: parentNeck,
      biteNeckFront: sNeckFront.checked,
      biteNeckFrontSides: sNeckFront.sides,
      biteNeckSide: sNeckSide.checked,
      biteNeckSideSides: sNeckSide.sides,
      biteNeckBack: sNeckBack.checked,
      biteNeckBackSides: sNeckBack.sides,
      biteNeckSigns: neckSigns,

      biteParentChest: parentChest,
      biteChestFront: sChestFront.checked,
      biteChestFrontSides: sChestFront.sides,
      biteChestUpperBack: sChestUpperBack.checked,
      biteChestUpperBackSides: sChestUpperBack.sides,
      biteChestSigns: chestSigns,

      biteParentAbdomen: parentAbd,
      biteAbdWall: sAbdWall.checked,
      biteAbdWallSides: sAbdWall.sides,
      biteAbdFlank: sAbdFlank.checked,
      biteAbdFlankSides: sAbdFlank.sides,
      biteAbdLowerBack: sAbdLowerBack.checked,
      biteAbdLowerBackSides: sAbdLowerBack.sides,
      biteAbdGluteal: sAbdGluteal.checked,
      biteAbdGlutealSides: sAbdGluteal.sides,
      biteAbdGenitalia: sAbdGenitalia.checked,
      biteAbdGenitaliaSides: sAbdGenitalia.sides,
      biteAbdomenSigns: abdSigns,

      biteParentUpperExtremity: parentUpperExt,
      biteArmShoulder: sArmShoulder.checked,
      biteArmShoulderSides: sArmShoulder.sides,
      biteArmElbow: sArmElbow.checked,
      biteArmElbowSides: sArmElbow.sides,
      biteArmWrist: sArmWrist.checked,
      biteArmWristSides: sArmWrist.sides,
      biteArmFingers: isArmFingers,
      biteArmFingersSides: armFingersSides,
      biteArmFingersLeftDigits: armFingersLeftDigits,
      biteArmFingersRightDigits: armFingersRightDigits,
      biteArmFingersDigits: armFingersDigits,
      biteUpperExtSigns: upperSigns,

      biteParentLowerExtremity: parentLowerExt,
      biteLegThigh: sLegThigh.checked,
      biteLegThighSides: sLegThigh.sides,
      biteLegKneeShin: sLegKneeShin.checked,
      biteLegKneeShinSides: sLegKneeShin.sides,
      biteLegAnkleFoot: sLegAnkleFoot.checked,
      biteLegAnkleFootSides: sLegAnkleFoot.sides,
      biteLegToes: isLegToes,
      biteLegToesSides: legToesSides,
      biteLegToesLeftDigits: legToesLeftDigits,
      biteLegToesRightDigits: legToesRightDigits,
      biteLegToesDigits: legToesDigits,
      biteLowerExtSigns: lowerSigns,

      biteParentOther: parentOther,
      biteOtherLocationDetail: otherLocationDetail,

      biteInfectionSigns: infectionSigns,
      biteSystemicSigns: systemicSigns,
      painScore: painScore,
      biteRabiesVaccineHx: rabiesHx,
      biteTetanusHx: tetanusHx,
      ...(() => {
        const inj = {};
        const parentMap = {
          Head: parentHead, Neck: parentNeck, Chest: parentChest, Abd: parentAbd,
          Arm: parentUpperExt, Leg: parentLowerExt
        };
        ["biteHeadScalp","biteHeadFace","biteHeadEye","biteHeadEar","biteHeadNoseMouth","biteNeckFront","biteNeckSide","biteNeckBack","biteChestFront","biteChestUpperBack","biteAbdWall","biteAbdFlank","biteAbdLowerBack","biteAbdGluteal","biteAbdGenitalia","biteArmShoulder","biteArmElbow","biteArmWrist","biteArmFingers","biteLegThigh","biteLegKneeShin","biteLegAnkleFoot","biteLegToes"].forEach(id => {
          const pKey = Object.keys(parentMap).find(k => id.startsWith('bite' + k));
          const pActive = pKey ? parentMap[pKey] : true;
          const cb = document.querySelector(`input[name="${id}"]`);
          inj[id + 'Injuries'] = (pActive && cb && cb.checked) ? getChecks(id + 'Injuries') : [];
        });
        return inj;
      })(),
      ...(isBiteFemaleCtx(ctx) ? {
        biteLmpDate: document.getElementById('biteLmpDate')?.value?.trim() || '',
        bitePregnancyStatus: getRadio('bitePregnancyStatus') || ''
      } : {})
    };

    updateBiteOutputs(rec);
    return rec;
  },

  collectFormData: function(ctx = {}) {
    return this.collectIntake(ctx);
  },

  // --- Hydrate / Populate Hook ---
  hydrateForm: function(data = {}) {
    if (data.durationVal) {
      const valEl = document.getElementById('biteDurationVal');
      if (valEl) valEl.value = data.durationVal;
    }
    if (data.durationUnit) {
      const unitEl = document.getElementById('biteDurationUnit');
      if (unitEl) unitEl.value = data.durationUnit;
    }

    const setChecks = (name, vals) => {
      const arr = Array.isArray(vals) ? vals : [];
      document.querySelectorAll(`input[name="${name}"]`).forEach(c => {
        c.checked = arr.includes(c.value);
      });
    };

    const setRadio = (name, val) => {
      document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
        r.checked = (r.value === val);
      });
    };

    const setSubGroup = (parentCheckId, groupContainerId, isChecked) => {
      const p = document.getElementById(parentCheckId);
      if (p) {
        p.checked = !!isChecked;
        toggleBiteGroup(groupContainerId, !!isChecked);
      }
    };

    const setSubLocation = (checkName, sidesName, sidesContainerId, isChecked, sidesArr) => {
      const cb = document.querySelector(`input[name="${checkName}"]`);
      if (cb) {
        cb.checked = !!isChecked;
        toggleBiteGroup(sidesContainerId, !!isChecked);
      }
      setChecks(sidesName, sidesArr);
    };

    setChecks('biteAnimalTypes', data.biteAnimalTypes);
    const hasOtherAnimal = Array.isArray(data.biteAnimalTypes) && data.biteAnimalTypes.includes('other_mammal');
    toggleBiteGroup('biteAnimalOtherDetailContainer', hasOtherAnimal);
    const otherDetailEl = document.getElementById('biteAnimalOtherDetail');
    if (otherDetailEl) otherDetailEl.value = data.biteAnimalOtherDetail || '';

    setChecks('biteExposures', data.biteExposures);
    handleBiteBleedingContainerToggle();
    setRadio('biteBleedingStatus', data.biteBleedingStatus);
    setChecks('biteAnimalBehavior', data.biteAnimalBehavior);
    setRadio('biteWoundCleansing', data.biteWoundCleansing);

    // 6 Anatomical Regions
    setSubGroup('biteParentHeadFace', 'biteHeadSubGroup', data.biteParentHeadFace);
    setSubLocation('biteHeadScalp', 'biteHeadScalpSides', 'biteHeadScalpSidesContainer', data.biteHeadScalp, data.biteHeadScalpSides);
    setSubLocation('biteHeadFace', 'biteHeadFaceSides', 'biteHeadFaceSidesContainer', data.biteHeadFace, data.biteHeadFaceSides);
    setSubLocation('biteHeadEye', 'biteHeadEyeSides', 'biteHeadEyeSidesContainer', data.biteHeadEye, data.biteHeadEyeSides);
    setSubLocation('biteHeadEar', 'biteHeadEarSides', 'biteHeadEarSidesContainer', data.biteHeadEar, data.biteHeadEarSides);
    setSubLocation('biteHeadNoseMouth', 'biteHeadNoseMouthSides', 'biteHeadNoseMouthSidesContainer', data.biteHeadNoseMouth, data.biteHeadNoseMouthSides);
    setChecks('biteHeadSigns', data.biteHeadSigns);

    setSubGroup('biteParentNeck', 'biteNeckSubGroup', data.biteParentNeck);
    setSubLocation('biteNeckFront', 'biteNeckFrontSides', 'biteNeckFrontSidesContainer', data.biteNeckFront, data.biteNeckFrontSides);
    setSubLocation('biteNeckSide', 'biteNeckSideSides', 'biteNeckSideSidesContainer', data.biteNeckSide, data.biteNeckSideSides);
    setSubLocation('biteNeckBack', 'biteNeckBackSides', 'biteNeckBackSidesContainer', data.biteNeckBack, data.biteNeckBackSides);
    setChecks('biteNeckSigns', data.biteNeckSigns);

    setSubGroup('biteParentChest', 'biteChestSubGroup', data.biteParentChest);
    setSubLocation('biteChestFront', 'biteChestFrontSides', 'biteChestFrontSidesContainer', data.biteChestFront, data.biteChestFrontSides);
    setSubLocation('biteChestUpperBack', 'biteChestUpperBackSides', 'biteChestUpperBackSidesContainer', data.biteChestUpperBack, data.biteChestUpperBackSides);
    setChecks('biteChestSigns', data.biteChestSigns);

    setSubGroup('biteParentAbdomen', 'biteAbdomenSubGroup', data.biteParentAbdomen);
    setSubLocation('biteAbdWall', 'biteAbdWallSides', 'biteAbdWallSidesContainer', data.biteAbdWall, data.biteAbdWallSides);
    setSubLocation('biteAbdFlank', 'biteAbdFlankSides', 'biteAbdFlankSidesContainer', data.biteAbdFlank, data.biteAbdFlankSides);
    setSubLocation('biteAbdLowerBack', 'biteAbdLowerBackSides', 'biteAbdLowerBackSidesContainer', data.biteAbdLowerBack, data.biteAbdLowerBackSides);
    setSubLocation('biteAbdGluteal', 'biteAbdGlutealSides', 'biteAbdGlutealSidesContainer', data.biteAbdGluteal, data.biteAbdGlutealSides);
    setSubLocation('biteAbdGenitalia', 'biteAbdGenitaliaSides', 'biteAbdGenitaliaSidesContainer', data.biteAbdGenitalia, data.biteAbdGenitaliaSides);
    setChecks('biteAbdomenSigns', data.biteAbdomenSigns);

    setSubGroup('biteParentUpperExtremity', 'biteUpperExtSubGroup', data.biteParentUpperExtremity);
    setSubLocation('biteArmShoulder', 'biteArmShoulderSides', 'biteArmShoulderSidesContainer', data.biteArmShoulder, data.biteArmShoulderSides);
    setSubLocation('biteArmElbow', 'biteArmElbowSides', 'biteArmElbowSidesContainer', data.biteArmElbow, data.biteArmElbowSides);
    setSubLocation('biteArmWrist', 'biteArmWristSides', 'biteArmWristSidesContainer', data.biteArmWrist, data.biteArmWristSides);
    const armFingersCb = document.querySelector('input[name="biteArmFingers"]');
    if (armFingersCb) armFingersCb.checked = !!data.biteArmFingers;
    toggleBiteGroup('biteArmFingersSidesContainer', !!data.biteArmFingers);
    setChecks('biteArmFingersLeftDigits', data.biteArmFingersLeftDigits || (data.biteArmFingersSides?.includes('left') ? data.biteArmFingersDigits : []));
    setChecks('biteArmFingersRightDigits', data.biteArmFingersRightDigits || (data.biteArmFingersSides?.includes('right') ? data.biteArmFingersDigits : []));
    setChecks('biteUpperExtSigns', data.biteUpperExtSigns);

    setSubGroup('biteParentLowerExtremity', 'biteLowerExtSubGroup', data.biteParentLowerExtremity);
    setSubLocation('biteLegThigh', 'biteLegThighSides', 'biteLegThighSidesContainer', data.biteLegThigh, data.biteLegThighSides);
    setSubLocation('biteLegKneeShin', 'biteLegKneeShinSides', 'biteLegKneeShinSidesContainer', data.biteLegKneeShin, data.biteLegKneeShinSides);
    setSubLocation('biteLegAnkleFoot', 'biteLegAnkleFootSides', 'biteLegAnkleFootSidesContainer', data.biteLegAnkleFoot, data.biteLegAnkleFootSides);
    const legToesCb = document.querySelector('input[name="biteLegToes"]');
    if (legToesCb) legToesCb.checked = !!data.biteLegToes;
    toggleBiteGroup('biteLegToesSidesContainer', !!data.biteLegToes);
    setChecks('biteLegToesLeftDigits', data.biteLegToesLeftDigits || (data.biteLegToesSides?.includes('left') ? data.biteLegToesDigits : []));
    setChecks('biteLegToesRightDigits', data.biteLegToesRightDigits || (data.biteLegToesSides?.includes('right') ? data.biteLegToesDigits : []));
    setChecks('biteLowerExtSigns', data.biteLowerExtSigns);

    setSubGroup('biteParentOther', 'biteOtherSubGroup', data.biteParentOther);
    const otherLocEl = document.getElementById('biteOtherLocationDetail');
    if (otherLocEl) otherLocEl.value = data.biteOtherLocationDetail || '';

    setChecks('biteInfectionSigns', data.biteInfectionSigns);
    setChecks('biteSystemicSigns', data.biteSystemicSigns);

    if (data.painScore !== null && data.painScore !== undefined) {
      const slider = document.getElementById('bitePainScore');
      if (slider) slider.value = data.painScore;
      handleBitePainScoreChange(data.painScore);
    } else {
      clearBitePainScore();
    }

    setRadio('biteRabiesVaccineHx', data.biteRabiesVaccineHx);
    const legacyTetanusMap = { over_10_years: 'more_than_10_years', unknown_or_never: 'never_or_unsure' };
    setRadio('biteTetanusHx', legacyTetanusMap[data.biteTetanusHx] || data.biteTetanusHx);

    ["biteHeadScalp","biteHeadFace","biteHeadEye","biteHeadEar","biteHeadNoseMouth","biteNeckFront","biteNeckSide","biteNeckBack","biteChestFront","biteChestUpperBack","biteAbdWall","biteAbdFlank","biteAbdLowerBack","biteAbdGluteal","biteAbdGenitalia","biteArmShoulder","biteArmElbow","biteArmWrist","biteArmFingers","biteLegThigh","biteLegKneeShin","biteLegAnkleFoot","biteLegToes"].forEach(id => {
      setChecks(id + 'Injuries', data[id + 'Injuries']);
    });

    const otherFreeEl = document.getElementById('animal_bite_other_free');
    if (otherFreeEl) otherFreeEl.value = data.otherSymptomsFree || '';

    const isFem = isBiteFemalePatient(data);
    toggleBiteFemaleSection(isFem);
    if (isFem) {
      const lmpEl = document.getElementById('biteLmpDate');
      if (lmpEl) lmpEl.value = data.biteLmpDate || '';
      setRadio('bitePregnancyStatus', data.bitePregnancyStatus);
    }
    checkAndDisplayBiteLmp(data);
  },

  populateForm: function(data = {}) {
    this.hydrateForm(data);
  },

  // --- Clear / Reset Hook ---
  clearForm: function() {
    ['biteDurationVal', 'biteAnimalOtherDetail', 'biteOtherLocationDetail', 'biteLmpDate', 'animal_bite_other_free'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = '';
    });
    const durUnit = document.getElementById('biteDurationUnit');
    if (durUnit) durUnit.value = 'hours';
    clearBitePainScore();

    [
      'biteAnimalOtherDetailContainer', 'biteBleedingStatusContainer',
      'biteHeadSubGroup', 'biteHeadScalpSidesContainer', 'biteHeadFaceSidesContainer', 'biteHeadEyeSidesContainer', 'biteHeadEarSidesContainer', 'biteHeadNoseMouthSidesContainer',
      'biteNeckSubGroup', 'biteNeckFrontSidesContainer', 'biteNeckSideSidesContainer', 'biteNeckBackSidesContainer',
      'biteChestSubGroup', 'biteChestFrontSidesContainer', 'biteChestUpperBackSidesContainer',
      'biteAbdomenSubGroup', 'biteAbdWallSidesContainer', 'biteAbdFlankSidesContainer', 'biteAbdLowerBackSidesContainer', 'biteAbdGlutealSidesContainer', 'biteAbdGenitaliaSidesContainer',
      'biteUpperExtSubGroup', 'biteArmShoulderSidesContainer', 'biteArmElbowSidesContainer', 'biteArmWristSidesContainer', 'biteArmFingersSidesContainer',
      'biteLowerExtSubGroup', 'biteLegThighSidesContainer', 'biteLegKneeShinSidesContainer', 'biteLegAnkleFootSidesContainer', 'biteLegToesSidesContainer',
      'biteOtherSubGroup', 'biteFemaleSection'
    ].forEach(id => { const el = document.getElementById(id); if (el) el.classList.add('hidden'); });

    const radios = document.querySelectorAll('#cc-animal-bite-section input[type="radio"]');
    radios.forEach(r => { r.checked = false; });

    const checks = document.querySelectorAll('#cc-animal-bite-section input[type="checkbox"]');
    checks.forEach(c => { c.checked = false; });
  },

  resetForm: function() {
    this.clearForm();
  },

  isRedFlag: function(patient) {
    const rfs = evaluateBiteRedFlags(patient);
    return rfs.length > 0;
  },

  evaluateRedFlags: evaluateBiteRedFlags,
  updateOutputs: updateBiteOutputs,
  renderRapidHpi: renderBiteRapidHpi,
  renderNarrative: renderBiteNarrative,
  renderDoctorHpi: renderBiteDoctorHpi,

  // --- Seed Patients Registry ---
  seedPatients: [
    // Case 1: Unprovoked stray dog mauling to face & neck in child, naive, WHO Cat III (ESI 2)
    {
      id: 'case-bite-01', queue_number: 'E2-107', hn: '7890701',
      name: 'ด.ช.ธีรเดช สุนัขจรจัดขย้ำแก้มขวาและลำคอเลือดซึม', age: 9, gender: 'ชาย',
      chief_complaint: 'animal_bite', chief_complaint_title: 'สุนัข แมว สัตว์เลี้ยงลูกด้วยนมกัด',
      timestamp: '2026-11-09T08:00:00.000Z', status: 'waiting',
      durationVal: 30, durationUnit: 'minutes', hospRecordStatus: 'self',
      underlying: [], drugAllergy: 'ปฏิเสธ', currentMeds: 'ไม่มี',
      otherSymptomsFree: 'เดินเล่นในซอยถูกสุนัขจรจัดวิ่งเข้ามากัดขย้ำแก้มขวา ริมฝีปาก และลำคอขวา แผลฉีกขาดลึกมีเลือดไหลซึมต่อเนื่อง สุนัขหนีหายไปแล้ว ยังไม่ได้ล้างแผล ไม่เคยฉีดวัคซีนพิษสุนัขบ้ามาก่อน',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.8, sbp: 105, dbp: 68, bp: '105/68', pr: 110, rr: 20, spo2: 99 },
      esi_level: 2,
      biteAnimalTypes: ['dog'], biteAnimalOtherDetail: '',
      biteExposures: ['bite_wound'], biteBleedingStatus: 'oozing_active',
      biteAnimalBehavior: ['stray_disappeared', 'unprovoked_abnormal'],
      biteWoundCleansing: 'not_cleaned',
      biteParentHeadFace: true, biteHeadScalp: false, biteHeadFace: true, biteHeadFaceSides: ['right'],
      biteHeadEye: false, biteHeadEar: false, biteHeadNoseMouth: true, biteHeadNoseMouthSides: ['right'],
      biteHeadSigns: ['large_laceration_tissue_defect'],
      biteParentNeck: true, biteNeckFront: false, biteNeckSide: true, biteNeckSideSides: ['right'], biteNeckBack: false,
      biteNeckSigns: ['deep_neck_wound_expanding_hematoma'],
      biteParentChest: false, biteParentAbdomen: false, biteParentUpperExtremity: false, biteParentLowerExtremity: false,
      biteInfectionSigns: ['no_local_infection'], biteSystemicSigns: ['no_systemic_signs'],
      painScore: 7, biteRabiesVaccineHx: 'naive_or_incomplete', biteTetanusHx: 'within_5_years'
    },

    // Case 2: Infected cat bite on left hand & index finger with suspected flexor tenosynovitis & fever (ESI 2)
    {
      id: 'case-bite-02', queue_number: 'E2-108', hn: '7890702',
      name: 'นางวาสนา แมวกัดฝ่ามือและนิ้วชี้ซ้ายบวมหนองแดงลามมีไข้', age: 52, gender: 'หญิง',
      chief_complaint: 'animal_bite', chief_complaint_title: 'สุนัข แมว สัตว์เลี้ยงลูกด้วยนมกัด',
      timestamp: '2026-11-09T08:30:00.000Z', status: 'waiting',
      durationVal: 2, durationUnit: 'days', hospRecordStatus: 'complete',
      underlying: ['เบาหวานชนิดที่ 2'], drugAllergy: 'ปฏิเสธ', currentMeds: 'Metformin 500 mg 1 tab po bid',
      otherSymptomsFree: 'ถูกแมวที่บ้านกัดจมเขี้ยวที่ฝ่ามือซ้ายและนิ้วชี้ซ้ายเมื่อ 2 วันก่อน วันนี้แผลบวมแดงร้อนมาก ปวดตุบๆ รุนแรง ขยับงอนิ้วชี้ไม่ได้ มีหนองซึม มีรอยแดงลามตามเส้นเลือด และมีไข้หนาวสั่น',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 38.6, sbp: 138, dbp: 82, bp: '138/82', pr: 104, rr: 18, spo2: 98 },
      esi_level: 2,
      biteAnimalTypes: ['cat'], biteAnimalOtherDetail: '',
      biteExposures: ['bite_wound'], biteBleedingStatus: 'oozing_stopped',
      biteAnimalBehavior: ['owned_quarantine_10d'],
      biteWoundCleansing: 'cleaned_soap_water',
      biteParentHeadFace: false, biteParentNeck: false, biteParentChest: false, biteParentAbdomen: false,
      biteParentUpperExtremity: true, biteArmShoulder: false, biteArmElbow: false, biteArmWrist: true, biteArmWristSides: ['left'],
      biteArmFingers: true, biteArmFingersSides: ['left'], biteArmFingersLeftDigits: ['index'], biteArmFingersRightDigits: [], biteArmFingersDigits: ['index'],
      biteUpperExtSigns: ['finger_joint_swelling_cannot_flex_extend'],
      biteParentLowerExtremity: false,
      biteInfectionSigns: ['erythema_edema_throbbing_pain', 'pus_purulent_discharge', 'lymphangitis_lymphadenopathy'],
      biteSystemicSigns: ['fever_chills'],
      painScore: 8, biteRabiesVaccineHx: 'completed_last_over_6m', biteTetanusHx: '5_to_10_years'
    },

    // Case 3: Stray dog bite to right calf with bleeding stopped, naive (ESI 3)
    {
      id: 'case-bite-03', queue_number: 'E3-104', hn: '7890703',
      name: 'นายกิตติศักดิ์ สุนัขจรจัดกัดน่องขวาเลือดหยุดแล้ว', age: 34, gender: 'ชาย',
      chief_complaint: 'animal_bite', chief_complaint_title: 'สุนัข แมว สัตว์เลี้ยงลูกด้วยนมกัด',
      timestamp: '2026-11-09T09:00:00.000Z', status: 'waiting',
      durationVal: 1, durationUnit: 'hours', hospRecordStatus: 'self',
      underlying: [], drugAllergy: 'ปฏิเสธ', currentMeds: 'ไม่มี',
      otherSymptomsFree: 'เดินผ่านซอยถูกสุนัขจรจัดกัดที่น่องขวาเป็นรอยเขี้ยวมีเลือดออกซึม แต่ขณะนี้เลือดหยุดไหลแล้ว ล้างน้ำและสบู่มาแล้ว ขยับข้อเท้าและเดินลงน้ำหนักได้ปกติ ไม่ชา ไม่เคยฉีดวัคซีนพิษสุนัขบ้ามาก่อน และฉีดบาดทะยักนานเกิน 10 ปีแล้ว',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.6, sbp: 122, dbp: 76, bp: '122/76', pr: 76, rr: 16, spo2: 99 },
      esi_level: 3,
      biteAnimalTypes: ['dog'], biteAnimalOtherDetail: '',
      biteExposures: ['bite_wound'], biteBleedingStatus: 'oozing_stopped',
      biteAnimalBehavior: ['stray_disappeared'],
      biteWoundCleansing: 'cleaned_soap_water',
      biteParentHeadFace: false, biteParentNeck: false, biteParentChest: false, biteParentAbdomen: false, biteParentUpperExtremity: false,
      biteParentLowerExtremity: true, biteLegThigh: false, biteLegKneeShin: true, biteLegKneeShinSides: ['right'], biteLegAnkleFoot: false, biteLegToes: false,
      biteLowerExtSigns: [], biteInfectionSigns: ['no_local_infection'], biteSystemicSigns: ['no_systemic_signs'],
      painScore: 5, biteRabiesVaccineHx: 'naive_or_incomplete', biteTetanusHx: 'more_than_10_years'
    },

    // Case 4: Pet cat superficial scratch on left forearm without bleeding, recent booster < 3m (ESI 4)
    {
      id: 'case-bite-04', queue_number: 'E3-105', hn: '7890704',
      name: 'นางสาวพิมพ์ใจ แมวข่วนแขนซ้ายเป็นรอยถลอกไม่มีเลือด', age: 26, gender: 'หญิง',
      chief_complaint: 'animal_bite', chief_complaint_title: 'สุนัข แมว สัตว์เลี้ยงลูกด้วยนมกัด',
      timestamp: '2026-11-09T09:30:00.000Z', status: 'waiting',
      durationVal: 2, durationUnit: 'hours', hospRecordStatus: 'self',
      underlying: [], drugAllergy: 'ปฏิเสธ', currentMeds: 'ไม่มี',
      otherSymptomsFree: 'ถูกแมวเลี้ยงในบ้านข่วนที่แขนท่อนล่างซ้ายขณะอุ้มอาบน้ำ เป็นรอยถลอกตื้นๆ ไม่มีเลือดออก ล้างน้ำและสบู่แล้ว แมวกักดูอาการต่อได้และฉีดวัคซีนตามเกณฑ์ ตัวผู้ป่วยเคยฉีดวัคซีนพิษสุนัขบ้าครบโดยได้รับเข็มสุดท้ายมาไม่เกิน 3 เดือน',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.7, sbp: 114, dbp: 72, bp: '114/72', pr: 72, rr: 16, spo2: 100 },
      esi_level: 4,
      biteAnimalTypes: ['cat'], biteAnimalOtherDetail: '',
      biteExposures: ['scratch_wound'], biteBleedingStatus: 'no_bleeding',
      biteAnimalBehavior: ['owned_quarantine_10d', 'animal_vaccinated_criteria'],
      biteWoundCleansing: 'cleaned_soap_water',
      biteParentHeadFace: false, biteParentNeck: false, biteParentChest: false, biteParentAbdomen: false,
      biteParentUpperExtremity: true, biteArmShoulder: false, biteArmElbow: true, biteArmElbowSides: ['left'], biteArmWrist: false, biteArmFingers: false,
      biteUpperExtSigns: [], biteParentLowerExtremity: false, biteInfectionSigns: ['no_local_infection'], biteSystemicSigns: ['no_systemic_signs'],
      painScore: 2, biteRabiesVaccineHx: 'completed_last_within_3m', biteTetanusHx: 'within_5_years'
    }
  ]
};

// Register module in Ratchaburi ER Core Registry
if (typeof registerCcModule === 'function') registerCcModule(animalBiteModule);
else if (typeof window !== 'undefined' && typeof window.registerCcModule === 'function') window.registerCcModule(animalBiteModule);

if (typeof module !== 'undefined' && module.exports) module.exports = animalBiteModule;
