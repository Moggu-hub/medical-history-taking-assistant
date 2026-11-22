// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 30_physical_assault.js
// อาการนำ: ถูกทำร้ายร่างกาย (Physical Assault / Interpersonal Violence)
// รองรับ Zero Default Bias, Uniform Option Patterns, Progressive Parent Checkboxes
// 7 ตำแหน่งร่างกาย (พร้อมนิ้วมือ/นิ้วเท้าแยกซ้าย-ขวา โป้ง ชี้ กลาง นาง ก้อย),
// OSCC / Domestic Violence / Strangulation Screening, Pain Slider, และ Core Guard TDD 100%
// =========================================================================

// --- Module-scoped State & Helpers ---
let assaultPainScoreTouched = false;

function wrapAssaultWords(chunks) {
  if (!Array.isArray(chunks)) return chunks;
  return chunks.map(c => `<span class="inline-block whitespace-nowrap">${c}</span>`).join(' ');
}

function renderAssaultOption(cfg) {
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
  const titleHtml = Array.isArray(title) ? wrapAssaultWords(title) : title;
  const bodyHtml = desc
    ? `<div class="ml-3 leading-snug"><span class="block text-xs sm:text-sm font-semibold text-slate-800">${titleHtml}</span><span class="block text-xs text-slate-500 font-normal mt-0.5">${desc}</span></div>`
    : `<span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800 leading-snug">${titleHtml}</span>`;
  return `<label class="selectable-card bg-white flex ${alignCls} ${padCls} rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition${spanCls}"><input type="${kind}" ${idAttr}${nameAttr}${valAttr}${chgAttr}class="${topCls}${roundCls}text-medical-600 focus:ring-medical-500 ${szCls} flex-shrink-0">${bodyHtml}</label>`;
}

function renderAssaultGrid(colsCls, items, shared = {}) {
  return `<div class="grid ${colsCls} gap-2.5">${items.map(it => renderAssaultOption({ ...shared, ...it })).join('\n')}</div>`;
}

function renderAssaultSysHeader({
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

function handleAssaultGroupNoneToggle(noneEl, inputName) {
  if (!noneEl || !noneEl.checked || typeof document === 'undefined') return;
  document.querySelectorAll(`input[name="${inputName}"]`).forEach(cb => {
    if (cb !== noneEl) cb.checked = false;
  });
}

function handleAssaultGroupItemChange(itemEl, noneId) {
  if (!itemEl || !itemEl.checked || !noneId || typeof document === 'undefined') return;
  const noneEl = document.getElementById(noneId);
  if (noneEl) noneEl.checked = false;
}

function isAssaultFemalePatient(p) {
  if (!p) return false;
  if (p.gender === 'หญิง' || p.gender === 'female') return true;
  if (p.gender === 'ชาย' || p.gender === 'male') return false;
  const label = `${p.patientTitle || p.title || ''} ${p.name || p.patientName || ''}`;
  return /นาง|น\.ส\.|ด\.ญ\.|\(หญิง\)|Mrs|Miss|Ms/i.test(label);
}

function isAssaultFemaleCtx(ctx = {}) {
  if (ctx.gender === 'หญิง' || ctx.gender === 'female') return true;
  if (ctx.gender === 'ชาย' || ctx.gender === 'male') return false;
  if (ctx.patientTitle || ctx.title || ctx.name || ctx.patientName) return isAssaultFemalePatient(ctx);
  const femSec = typeof document !== 'undefined' ? document.getElementById('assaultFemaleSection') : null;
  if (femSec && !femSec.classList.contains('hidden')) return true;
  if (typeof document === 'undefined') return false;
  const title = document.getElementById('patientTitleSelect')?.value || '';
  const name = document.getElementById('patientNameInput')?.value || '';
  const gender = document.getElementById('triageGenderSelect')?.value || '';
  return isAssaultFemalePatient({ gender, patientTitle: title, name });
}

function toggleAssaultFemaleSection(isFemale) {
  const femSec = document.getElementById('assaultFemaleSection');
  if (!femSec) return;
  femSec.classList.toggle('hidden', !isFemale);
  if (!isFemale) {
    const lmpEl = document.getElementById('assaultLmpDate');
    if (lmpEl) lmpEl.value = '';
    document.querySelectorAll('input[name="assaultPregnancyStatus"]').forEach(r => { r.checked = false; });
  }
}

function checkAndDisplayAssaultLmp(patient) {
  if (patient && (patient.gender || patient.name || patient.patientName || patient.patientTitle || patient.title)) {
    toggleAssaultFemaleSection(isAssaultFemalePatient(patient));
    return;
  }
  const title = document.getElementById('patientTitleSelect')?.value || '';
  const name = document.getElementById('patientNameInput')?.value || '';
  const gender = document.getElementById('triageGenderSelect')?.value || '';
  toggleAssaultFemaleSection(isAssaultFemalePatient({ gender, patientTitle: title, name }));
}

function renderAssaultPart(id, label, hasCenter = false) {
  return `<div class="p-2.5 rounded-xl border border-slate-200 bg-white">
  <label class="flex items-center cursor-pointer">
    <input type="checkbox" id="${id}" name="${id}" onchange="toggleAssaultGroup('${id}SidesContainer', this.checked)" class="text-medical-600 h-4 w-4 rounded flex-shrink-0">
    <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">${label}</span>
  </label>
  <div id="${id}SidesContainer" class="hidden mt-2 pl-6 flex flex-col gap-1.5 text-xs border-t border-slate-100 pt-2">
    <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
      <span class="text-xs font-semibold text-slate-500">ด้าน / ข้าง:</span>
      <label class="inline-flex items-center cursor-pointer"><input type="checkbox" name="${id}Sides" value="left" class="mr-1 text-medical-600 rounded"> ซ้าย</label>
      <label class="inline-flex items-center cursor-pointer"><input type="checkbox" name="${id}Sides" value="right" class="mr-1 text-medical-600 rounded"> ขวา</label>
      ${hasCenter ? `<label class="inline-flex items-center cursor-pointer"><input type="checkbox" name="${id}Sides" value="center" class="mr-1 text-medical-600 rounded"> ตรงกลาง</label>` : ''}
    </div>
    <div class="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 border-t border-slate-50">
      <span class="text-xs font-semibold text-slate-500">ลักษณะบาดเจ็บ:</span>
      <label class="inline-flex items-center cursor-pointer"><input type="checkbox" name="${id}Injuries" value="wound" class="mr-1 text-medical-600 rounded"> มีแผล</label>
      <label class="inline-flex items-center cursor-pointer"><input type="checkbox" name="${id}Injuries" value="pain_swelling" class="mr-1 text-medical-600 rounded"> ปวด/บวม</label>
      <label class="inline-flex items-center cursor-pointer"><input type="checkbox" name="${id}Injuries" value="deformity" class="mr-1 text-medical-600 rounded"> ผิดรูป</label>
    </div>
  </div>
</div>`;
}

function renderAssaultDigits(id, label) {
  const digits = [['thumb', 'โป้ง'], ['index', 'ชี้'], ['middle', 'กลาง'], ['ring', 'นาง'], ['little', 'ก้อย']];
  const row = (side, sl) => `<div class="flex items-center flex-wrap gap-2"><span class="text-xs font-semibold text-slate-500 w-9">${sl}:</span>${digits.map(([k, th]) => `<label class="inline-flex items-center cursor-pointer"><input type="checkbox" name="${id}${side}Digits" value="${k}" class="mr-1 text-medical-600 rounded"> ${th}</label>`).join('')}</div>`;
  return `<div class="p-2.5 rounded-xl border border-slate-200 bg-white">
  <label class="flex items-center cursor-pointer">
    <input type="checkbox" id="${id}" name="${id}" onchange="toggleAssaultGroup('${id}SidesContainer', this.checked)" class="text-medical-600 h-4 w-4 rounded flex-shrink-0">
    <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">${label}</span>
  </label>
  <div id="${id}SidesContainer" class="hidden mt-2 pl-6 flex flex-col gap-1.5 text-xs border-t border-slate-100 pt-2">
    ${row('Left', 'ซ้าย')}${row('Right', 'ขวา')}
    <div class="flex items-center flex-wrap gap-x-3 gap-y-1 pt-1 border-t border-slate-50">
      <span class="text-xs font-semibold text-slate-500">ลักษณะบาดเจ็บ:</span>
      <label class="inline-flex items-center cursor-pointer"><input type="checkbox" name="${id}Injuries" value="wound" class="mr-1 text-medical-600 rounded"> มีแผล</label>
      <label class="inline-flex items-center cursor-pointer"><input type="checkbox" name="${id}Injuries" value="pain_swelling" class="mr-1 text-medical-600 rounded"> ปวด/บวม</label>
      <label class="inline-flex items-center cursor-pointer"><input type="checkbox" name="${id}Injuries" value="deformity" class="mr-1 text-medical-600 rounded"> ผิดรูป</label>
    </div>
  </div>
</div>`;
}

function renderAssaultRegionBox({
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
      <input type="checkbox" id="${parentId}" onchange="toggleAssaultGroup('${subGroupId}', this.checked)" class="text-medical-600 focus:ring-medical-500 h-5 w-5 rounded flex-shrink-0">
      <div class="ml-3 leading-snug">
        <span class="text-xs sm:text-sm font-bold text-slate-900">${Array.isArray(title) ? wrapAssaultWords(title) : title}</span>
        ${desc ? `<p class="text-xs text-slate-500 mt-0.5">${desc}</p>` : ''}
      </div>
    </label>
    <div id="${subGroupId}" class="hidden pl-4 sm:pl-6 space-y-4 border-l-2 border-medical-200">
      <div>
        <p class="text-xs sm:text-sm text-slate-700 font-semibold mb-2">จุดที่บาดเจ็บ (เลือกแล้วระบุด้านและลักษณะบาดเจ็บ):</p>
        <div class="space-y-2">${partsHtml}</div>
      </div>
      <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
        ${renderAssaultSysHeader({
          label: 'อาการสำคัญที่พบร่วมด้วย (เลือกได้หลายข้อ)',
          icon: 'alert-circle',
          colorClass: 'bg-amber-100 text-amber-700',
          toggleId: signsNoneId,
          toggleLabel: 'ไม่มีอาการร่วม',
          toggleOnchange: `handleAssaultGroupNoneToggle(this, '${signsName}')`
        })}
        ${renderAssaultGrid(signsCols, signs, {
          name: signsName,
          compact: true,
          onchange: `handleAssaultGroupItemChange(this, '${signsNoneId}')`
        })}
      </div>
    </div>
  </div>`;
}

function toggleAssaultGroup(subId, show) {
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

function handleAssaultMechanismChange() {
  const bluntCb = document.querySelector('input[name="assaultMechanisms"][value="blunt_weapon"]');
  toggleAssaultGroup('assaultBluntDetailContainer', bluntCb && bluntCb.checked);

  const sharpCb = document.querySelector('input[name="assaultMechanisms"][value="sharp_weapon"]');
  toggleAssaultGroup('assaultSharpDetailContainer', sharpCb && sharpCb.checked);

  const chemCb = document.querySelector('input[name="assaultMechanisms"][value="chemical_thermal_burn"]');
  toggleAssaultGroup('assaultChemicalDetailContainer', chemCb && chemCb.checked);

  const otherMechCb = document.querySelector('input[name="assaultMechanisms"][value="other_mechanism"]');
  toggleAssaultGroup('assaultOtherMechDetailContainer', otherMechCb && otherMechCb.checked);
}

function clearAssaultPainScore() {
  assaultPainScoreTouched = false;
  const slider = document.getElementById('assaultPainScore');
  if (slider) slider.value = 0;
  const emojiEl = document.getElementById('assaultPainScoreEmoji');
  const textEl = document.getElementById('assaultPainScoreText');
  const badgeEl = document.getElementById('assaultPainScoreBadge');
  const clearBtn = document.getElementById('assaultPainScoreClearBtn');
  if (emojiEl) emojiEl.textContent = '⚪';
  if (textEl) textEl.textContent = 'ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)';
  if (badgeEl) badgeEl.className = 'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all';
  if (clearBtn) clearBtn.classList.add('hidden');
}

function handleAssaultPainScoreChange(val) {
  assaultPainScoreTouched = true;
  const num = parseInt(val, 10) || 0;
  const slider = document.getElementById('assaultPainScore');
  if (slider && String(slider.value) !== String(num)) slider.value = num;
  const emojiEl = document.getElementById('assaultPainScoreEmoji'), textEl = document.getElementById('assaultPainScoreText');
  const badgeEl = document.getElementById('assaultPainScoreBadge'), clearBtn = document.getElementById('assaultPainScoreClearBtn');
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
function setAssaultPainScore(score) { assaultPainScoreTouched = true; const s = document.getElementById('assaultPainScore'); if (s) s.value = score; handleAssaultPainScoreChange(score); }
const handleAssaultPainSliderTouch = handleAssaultPainScoreChange;
if (typeof window !== 'undefined') {
  window.toggleAssaultGroup = toggleAssaultGroup;
  window.handleAssaultGroupNoneToggle = handleAssaultGroupNoneToggle;
  window.handleAssaultGroupItemChange = handleAssaultGroupItemChange;
  window.handleAssaultMechanismChange = handleAssaultMechanismChange;
  window.clearAssaultPainScore = clearAssaultPainScore;
  window.handleAssaultPainScoreChange = handleAssaultPainScoreChange;
  window.setAssaultPainScore = setAssaultPainScore;
}

// --- Clinical Decision Support & Evaluation Functions ---
function evaluateAssaultRedFlags(patient) {
  const rfs = [];
  const addRf = (key, level, textTh, risk, action) => {
    rfs.push({ key, level, textTh, title: textTh, risk, detail: risk, suggestedAction: action, action });
  };
  const vs = patient.vital_signs || {};
  const sbp = typeof vs.sbp === 'number' ? vs.sbp : (parseInt(vs.sbp, 10) || null);
  const pr = typeof vs.pr === 'number' ? vs.pr : (parseInt(vs.pr, 10) || null);
  const rr = typeof vs.rr === 'number' ? vs.rr : (parseInt(vs.rr, 10) || null);
  const spo2 = typeof vs.spo2 === 'number' ? vs.spo2 : (parseFloat(vs.spo2) || null);
  const shockIndex = (sbp && pr) ? (pr / sbp) : 0;

  const mechs = Array.isArray(patient.assaultMechanisms) ? patient.assaultMechanisms : [];
  const bleedingStatus = patient.assaultBleedingStatus || '';

  const headSigns = Array.isArray(patient.assaultHeadSigns) ? patient.assaultHeadSigns : [];
  const neckSigns = Array.isArray(patient.assaultNeckSigns) ? patient.assaultNeckSigns : [];
  const chestSigns = Array.isArray(patient.assaultChestSigns) ? patient.assaultChestSigns : [];
  const abdSigns = Array.isArray(patient.assaultAbdSigns) ? patient.assaultAbdSigns : [];
  const upperSigns = Array.isArray(patient.assaultUpperExtSigns) ? patient.assaultUpperExtSigns : [];
  const lowerSigns = Array.isArray(patient.assaultLowerExtSigns) ? patient.assaultLowerExtSigns : [];
  const sysSigns = Array.isArray(patient.assaultSystemicSigns) ? patient.assaultSystemicSigns : [];

  const oscc = patient.assaultOsccScreen || '';
  const anticoag = patient.assaultAnticoagulantHx || '';

  // 1. PENETRATING INJURY TO TORSO/NECK OR SEVERE HEMORRHAGE / SHOCK (ESI 1 / 2)
  const isPenetratingTorsoNeck = mechs.includes('gunshot') ||
                                neckSigns.includes('penetrating_neck_rapid_swelling') ||
                                chestSigns.includes('penetrating_chest_wound') ||
                                abdSigns.includes('penetrating_abd_wound') ||
                                (mechs.includes('sharp_weapon') && (patient.assaultParentNeck || patient.assaultParentChest || patient.assaultParentAbdomen));
  const isSevereBleed = bleedingStatus === 'active_spurting_profuse';
  const hasShock = (sbp && sbp < 90) || (shockIndex >= 1.0) || sysSigns.includes('palpitation_cold_sweat_pallor');

  if (isPenetratingTorsoNeck || isSevereBleed || (hasShock && (mechs.includes('sharp_weapon') || mechs.includes('gunshot')))) {
    const isEsi1 = (sbp && sbp < 90) || shockIndex >= 1.0 || isSevereBleed || (spo2 && spo2 < 92);
    addRf(
      'rf_assault_penetrating_torso_neck_shock',
      isEsi1 ? 'ESI 1' : 'ESI 2',
      'ถูกทำร้ายด้วยอาวุธมีคม/อาวุธปืนบริเวณลำคอ หน้าอก หรือช่องท้อง หรือมีภาวะช็อกจากเสียเลือดรุนแรง',
      'บาดเจ็บทะลุอวัยวะสำคัญภายใน (Hemopneumothorax, Pericardial tamponade, ตับ/ม้ามฉีกขาด) หรือตัดหลอดเลือดแดงใหญ่ เสี่ยงเสียชีวิตจากภาวะช็อก',
      'ประเมิน Primary Survey (A-B-C-D-E) ตามแนวทาง ATLS ทันที, ห้ามเลือดด้วย Direct pressure, เปิดเส้นเลือดดำขนาดใหญ่ 2 เส้น, จอง PRC ด่วน, ทำ Bedside eFAST และปรึกษาศัลยแพทย์อุบัติเหตุทันที'
    );
  }

  // 2. STRANGULATION / CHOKING WITH AIRWAY COMPROMISE (ESI 1 / 2)
  const isStrangulation = mechs.includes('strangulation_choking');
  const hasAirwayCompromise = neckSigns.includes('strangulation_dysphonia_dysphagia') ||
                              neckSigns.includes('penetrating_neck_rapid_swelling') ||
                              (rr && rr >= 24) || (spo2 && spo2 < 95);

  if (isStrangulation || hasAirwayCompromise) {
    const isEsi1 = (spo2 && spo2 < 92) || neckSigns.includes('penetrating_neck_rapid_swelling');
    addRf(
      'rf_assault_strangulation_airway_compromise',
      isEsi1 ? 'ESI 1' : 'ESI 2',
      'ถูกบีบคอ/รัดคอ หรือบาดเจ็บที่ลำคอร่วมกับเสียงแหบ กลืนลำบาก หรือหายใจลำบาก (Strangulation / Laryngeal Injury)',
      'กล่องเสียงหรือกระดูกหลอดลมแตกยุบ (Laryngotracheal fracture), ทางเดินหายใจบวมอุดกั้นเฉียบพลัน/ล่าช้า และหลอดเลือดแดงคาโรติดฉีกขาด (Carotid dissection)',
      'ประเมินทางเดินหายใจใกล้ชิด, เตรียมอุปกรณ์ใส่ท่อช่วยหายใจ (Difficult airway set), ส่งตรวจ Soft tissue neck Film หรือ CTA Neck และสังเกตอาการเฝ้าระวังทางเดินหายใจอุดกั้นอย่างน้อย 12-24 ชม.'
    );
  }

  // 3. TRAUMATIC BRAIN INJURY, MAXILLOFACIAL FRACTURE OR ANTICOAGULANT HEAD TRAUMA (ESI 2)
  const isHeadTrauma = patient.assaultParentHeadFace || headSigns.length > 0;
  const hasTbiSigns = headSigns.includes('loc_amnesia') ||
                      headSigns.includes('severe_headache_vomiting') ||
                      headSigns.includes('blood_csf_ear_nose_deformity');
  const hasAnticoagHead = isHeadTrauma && (anticoag === 'anticoagulant_antiplatelet' || anticoag === 'bleeding_disorder');
  const hasBlowout = headSigns.includes('diplopia_blurred_vision') || headSigns.includes('malocclusion_jaw_locked') || headSigns.includes('malocclusion_tooth_avulsion');

  if ((isHeadTrauma && (hasTbiSigns || hasAnticoagHead)) || hasBlowout) {
    addRf(
      'rf_assault_tbi_anticoagulant_maxillofacial',
      'ESI 2',
      'ถูกทำร้ายที่ศีรษะ/ใบหน้าร่วมกับอาการทางสมอง (สลบ/อาเจียน/สับสน) ตาพร่ามัวเห็นภาพซ้อน หรือทานยาละลายลิ่มเลือด',
      'เลือดออกในกะโหลกศีรษะเฉียบพลัน (Subdural / Epidural / Subarachnoid Hemorrhage), ฐานกะโหลกศีรษะร้าว หรือกระดูกเบ้าตาแตกหนีบกล้ามเนื้อตา (Orbital blowout fracture)',
      'ประเมิน GCS, Pupil size/reactivity และการกลอกตา, ส่งตรวจ Stat Non-contrast CT Brain (+/- CT Facial bones), งดใส่สาย NG ทางจมูกหากสงสัยฐานกะโหลกร้าว และเจาะ PT/INR หากใช้ Warfarin'
    );
  }

  // 4. BLUNT ABDOMINAL / THORACIC INTERNAL INJURY (ESI 2)
  const hasBluntTorsoSigns = abdSigns.includes('severe_abd_pain_distension') ||
                             abdSigns.includes('hematuria_anuria') ||
                             (chestSigns.includes('dyspnea_chest_tightness') && (patient.assaultParentChest || mechs.includes('blunt_weapon') || mechs.includes('physical_force')));

  if (hasBluntTorsoSigns) {
    addRf(
      'rf_assault_blunt_abdominal_internal_bleed',
      'ESI 2',
      'ถูกชก/เตะ/ตีที่หน้าอกหรือช่องท้อง ร่วมกับปวดท้องรุนแรง ท้องอืดตึง ปัสสาวะเป็นเลือด หรือหายใจหอบเหนื่อย',
      'อวัยวะภายในฉีกขาดตกเลือด (ม้ามแตก, ตับฉีกขาด, ไตช้ำฉีกขาด) หรือซี่โครงหักทิ่มลม/เลือดออกในช่องอก',
      'ทำ Bedside eFAST ทันที, ตรวจ CBC, BUN/Cr, Urinalysis, Film CXR, เฝ้าระวังความดันโลหิตและชีพจรใกล้ชิด และพิจารณาส่ง CT Whole Abdomen with IV contrast'
    );
  }

  // 5. CHEMICAL ASSAULT, SEXUAL ASSAULT OR SUSPECTED DRUGGED (OSCC) (ESI 2)
  const isChemicalAssault = mechs.includes('chemical_thermal_burn');
  const isSexualAssault = oscc === 'sexual_assault';
  const isDomesticViolence = oscc === 'domestic_violence';
  const isDrugged = sysSigns.includes('suspected_drugged_intoxicated');

  if (isChemicalAssault || isSexualAssault || isDomesticViolence || isDrugged) {
    addRf(
      'rf_assault_chemical_eye_or_sexual_oscc',
      'ESI 2',
      isChemicalAssault
        ? 'ถูกสาดสารเคมี/น้ำกรด/ของเหลวร้อน เสี่ยงต่อกระจกตาและเนื้อเยื่อถูกทำลายรุนแรง'
        : 'กรณีถูกล่วงละเมิดทางเพศ ความรุนแรงในครอบครัว หรือสงสัยถูกวางยา/มอมยา (ศูนย์พึ่งได้ OSCC)',
      isChemicalAssault
        ? 'กระจกตาถูกกัดกร่อนเป็นแผลลึก (Corneal burn/ulceration) และเนื้อเยื่อผิวหนังไหม้ตาย'
        : 'ความเสี่ยงต่อการตั้งครรภ์ไม่พึงประสงค์, โรคติดต่อทางเพศสัมพันธ์ (HIV, HBV, Syphilis), ความไม่ปลอดภัยในชีวิต และการสูญเสียหลักฐานทางนิติเวช',
      isChemicalAssault
        ? 'ล้างตา/ผิวหนังด้วย 0.9% NaCl ปริมาณมากทันที (Copious irrigation), วัด pH ในตา และปรึกษาจักษุแพทย์'
        : 'เปิดระบบศูนย์พึ่งได้ (OSCC) ทันที, จัดห้องตรวจที่มิดชิดและมีพยาน, เก็บหลักฐานทางนิติเวชตามระเบียบ, ตรวจปัสสาวะ/เลือดหาสารพิษ/ยาเสพติด และให้ยา HIV PEP / STI Prophylaxis / ยาคุมฉุกเฉิน'
    );
  }

  // 6. DEFENSE WOUND, FRACTURE, TENDON INJURY OR HUMAN BITE (ESI 3)
  const isDefenseWound = upperSigns.includes('tendon_injury_inability_to_move') ||
                         upperSigns.includes('arm_deformity_suspected_fracture') ||
                         upperSigns.includes('numbness_pallor_cold_finger') ||
                         lowerSigns.includes('leg_deformity_suspected_fracture') ||
                         lowerSigns.includes('inability_to_bear_weight') ||
                         mechs.includes('human_bite_scratch');

  if (isDefenseWound) {
    addRf(
      'rf_assault_defense_wound_tendon_fracture',
      'ESI 3',
      'บาดแผลป้องกันตัวที่แขน/มือ สงสัยกระดูกหัก เส้นเอ็น/เส้นประสาทฉีกขาด หรือแผลถูกคนกัด (Human Bite)',
      'เส้นเอ็นงอหรือเหยียดนิ้วมือขาด (Extensor/Flexor tendon laceration), กระดูกแขน/นิ้วมือหัก หรือการติดเชื้อแบคทีเรียรุนแรงจากช่องปากมนุษย์ (Fight bite / Eikenella corrodens)',
      'ตรวจการทำงานของเส้นเอ็น (FDP/FDS/EPL) และเส้นประสาทส่วนปลายอย่างละเอียดก่อนฉีดยาชา, ส่ง Film X-ray, ล้างแผลด้วยน้ำเกลือปริมาณมาก, ให้วัคซีนบาดทะยัก และให้ยาปฏิชีวนะ (Amoxicillin-Clavulanate สำหรับแผลคนกัด)'
    );
  }

  return rfs;
}

// --- Dynamic Output Update Function ---
function updateAssaultOutputs(rec) {
  if (!rec) return;
  const rapidText = renderAssaultRapidHpi(rec);
  const narrativeText = renderAssaultNarrativeHpi(rec);

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

  const redFlags = evaluateAssaultRedFlags(rec);
  rec.redFlags = redFlags;

  const jsonOutput = {
    encounter: {
      chief_complaint: 'physical_assault',
      schema_code: 'physical_assault',
      chief_complaint_title_th: 'ถูกทำร้ายร่างกาย',
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
      mechanisms: Array.isArray(rec.assaultMechanisms) ? rec.assaultMechanisms : [],
      bleeding_status: rec.assaultBleedingStatus || null,
      systemic_signs: Array.isArray(rec.assaultSystemicSigns) ? rec.assaultSystemicSigns : [],
      pain_score: rec.painScore,
      oscc_screen: rec.assaultOsccScreen || null,
      anticoagulant_hx: rec.assaultAnticoagulantHx || null,
      tetanus_history: rec.assaultTetanusHx || null,
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
  rec.rapidHpi = rapidText;
  rec.narrativeHpi = narrativeText;
  rec.medicalJson = jsonOutput;

  const jsonEl = document.getElementById('jsonViewer');
  if (jsonEl) jsonEl.textContent = JSON.stringify(jsonOutput, null, 2);
  return { rapid: rapidText, narrative: narrativeText, json: jsonOutput };
}

function formatAssaultMechanism(patient) {
  const mMap = {
    physical_force: 'ใช้ร่างกาย (ชก/ต่อย/เตะ/กระทืบ)',
    blunt_weapon: 'ของแข็งไม่มีคม (ไม้/เหล็ก/ขวด)',
    sharp_weapon: 'ของมีคม (มีด/คัตเตอร์/เศษแก้ว)',
    gunshot: 'อาวุธปืน/สิ่งเทียมอาวุธปืน',
    strangulation_choking: 'บีบคอ/รัดคอ/กดทับทางเดินหายใจ',
    human_bite_scratch: 'ถูกกัดหรือข่วนโดยบุคคลอื่น',
    chemical_thermal_burn: 'สาดน้ำร้อน/น้ำกรด/สารเคมี',
    other_mechanism: 'ลักษณะอื่นๆ'
  };
  const list = Array.isArray(patient.assaultMechanisms) ? patient.assaultMechanisms.map(m => mMap[m] || m) : [];
  if (patient.assaultBluntDetail && patient.assaultBluntDetail.trim()) {
    list.push(`ของแข็ง: ${patient.assaultBluntDetail.trim()}`);
  }
  if (patient.assaultSharpDetail && patient.assaultSharpDetail.trim()) {
    list.push(`ของมีคม: ${patient.assaultSharpDetail.trim()}`);
  }
  if (patient.assaultChemicalDetail && patient.assaultChemicalDetail.trim()) {
    list.push(`สารเคมี/ความร้อน: ${patient.assaultChemicalDetail.trim()}`);
  }
  if (patient.assaultOtherMechDetail && patient.assaultOtherMechDetail.trim()) {
    list.push(`ระบุ: ${patient.assaultOtherMechDetail.trim()}`);
  }
  return list.length > 0 ? list.join('; ') : 'ไม่ได้ระบุกลไกชัดเจน';
}

function formatAssaultAnatomy(patient) {
  const parts = [];
  const thMap = { left: 'ซ้าย', right: 'ขวา', center: 'ตรงกลาง' };
  const injMap = { wound: 'มีแผล', pain_swelling: 'ปวด/บวม', deformity: 'ผิดรูป' };
  const sideLabel = (arr) => (!Array.isArray(arr) || arr.length === 0) ? '' : ` [${arr.map(x => thMap[x] || x).join(', ')}]`;
  const injLabel = (arr) => (!Array.isArray(arr) || arr.length === 0) ? '' : ` (${arr.map(x => injMap[x] || x).join(', ')})`;
  const partLabel = (sd, inj) => `${sideLabel(sd)}${injLabel(inj)}`;
  const digitMap = { thumb: 'นิ้วโป้ง', index: 'นิ้วชี้', middle: 'นิ้วกลาง', ring: 'นิ้วนาง', little: 'นิ้วก้อย' };
  const fmtDigitsBySide = (leftD, rightD, inj) => {
    const dParts = [];
    if (Array.isArray(leftD) && leftD.length > 0) dParts.push(`ซ้าย: ${leftD.map(x => digitMap[x] || x).join(', ')}`);
    if (Array.isArray(rightD) && rightD.length > 0) dParts.push(`ขวา: ${rightD.map(x => digitMap[x] || x).join(', ')}`);
    const base = dParts.length > 0 ? ` [${dParts.join('; ')}]` : '';
    return `${base}${injLabel(inj)}`;
  };

  if (patient.assaultParentHeadFace) {
    const subs = [];
    if (patient.assaultHeadScalp) subs.push(`หนังศีรษะ/ท้ายทอย${partLabel(patient.assaultHeadScalpSides, patient.assaultHeadScalpInjuries)}`);
    if (patient.assaultHeadFace) subs.push(`ใบหน้า/โหนกแก้ม/คาง${partLabel(patient.assaultHeadFaceSides, patient.assaultHeadFaceInjuries)}`);
    if (patient.assaultHeadEye) subs.push(`ดวงตา/เบ้าตา${partLabel(patient.assaultHeadEyeSides, patient.assaultHeadEyeInjuries)}`);
    if (patient.assaultHeadEar) subs.push(`ใบหู${partLabel(patient.assaultHeadEarSides, patient.assaultHeadEarInjuries)}`);
    if (patient.assaultHeadNoseMouth) subs.push(`จมูก/ปาก/ฟัน${partLabel(patient.assaultHeadNoseMouthSides, patient.assaultHeadNoseMouthInjuries)}`);
    parts.push(`ศีรษะ/ใบหน้า: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  if (patient.assaultParentNeck) {
    const subs = [];
    if (patient.assaultNeckFront) subs.push(`คอด้านหน้า${partLabel(patient.assaultNeckFrontSides, patient.assaultNeckFrontInjuries)}`);
    if (patient.assaultNeckSide) subs.push(`คอด้านข้าง${partLabel(patient.assaultNeckSideSides, patient.assaultNeckSideInjuries)}`);
    if (patient.assaultNeckBack) subs.push(`ต้นคอด้านหลัง${partLabel(patient.assaultNeckBackSides, patient.assaultNeckBackInjuries)}`);
    parts.push(`ลำคอ: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  if (patient.assaultParentChest) {
    const subs = [];
    if (patient.assaultChestFront) subs.push(`หน้าอก/ซี่โครง${partLabel(patient.assaultChestFrontSides, patient.assaultChestFrontInjuries)}`);
    if (patient.assaultChestClavicle) subs.push(`ไหปลาร้า${partLabel(patient.assaultChestClavicleSides, patient.assaultChestClavicleInjuries)}`);
    if (patient.assaultChestBack) subs.push(`หลังส่วนบน/สะบัก${partLabel(patient.assaultChestBackSides, patient.assaultChestBackInjuries)}`);
    parts.push(`หน้าอก/หลังบน: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  if (patient.assaultParentAbdomen) {
    const subs = [];
    if (patient.assaultAbdFront) subs.push(`หน้าท้อง${partLabel(patient.assaultAbdFrontSides, patient.assaultAbdFrontInjuries)}`);
    if (patient.assaultAbdFlank) subs.push(`สีข้าง/บั้นเอว${partLabel(patient.assaultAbdFlankSides, patient.assaultAbdFlankInjuries)}`);
    if (patient.assaultAbdLowBack) subs.push(`หลังส่วนล่าง${partLabel(patient.assaultAbdLowBackSides, patient.assaultAbdLowBackInjuries)}`);
    if (patient.assaultAbdButtock) subs.push(`สะโพก/ก้น${partLabel(patient.assaultAbdButtockSides, patient.assaultAbdButtockInjuries)}`);
    if (patient.assaultAbdGroinGenitalia) subs.push(`ขาหนีบ/อวัยวะเพศ${partLabel(patient.assaultAbdGroinGenitaliaSides, patient.assaultAbdGroinGenitaliaInjuries)}`);
    parts.push(`หน้าท้อง/เอว/ก้น: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  if (patient.assaultParentUpperExtremity) {
    const subs = [];
    if (patient.assaultArmShoulder) subs.push(`หัวไหล่/ต้นแขน${partLabel(patient.assaultArmShoulderSides, patient.assaultArmShoulderInjuries)}`);
    if (patient.assaultArmElbowForearm) subs.push(`ข้อศอก/แขนท่อนล่าง${partLabel(patient.assaultArmElbowForearmSides, patient.assaultArmElbowForearmInjuries)}`);
    if (patient.assaultArmWristHand) subs.push(`ข้อมือ/ฝ่ามือ/หลังมือ${partLabel(patient.assaultArmWristHandSides, patient.assaultArmWristHandInjuries)}`);
    if (patient.assaultArmFingers) {
      subs.push(`นิ้วมือ${fmtDigitsBySide(patient.assaultArmFingersLeftDigits, patient.assaultArmFingersRightDigits, patient.assaultArmFingersInjuries)}`);
    }
    parts.push(`แขน/มือ (แผลป้องกันตัว): ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  if (patient.assaultParentLowerExtremity) {
    const subs = [];
    if (patient.assaultLegThigh) subs.push(`ต้นขา${partLabel(patient.assaultLegThighSides, patient.assaultLegThighInjuries)}`);
    if (patient.assaultLegKneeShinCalf) subs.push(`เข่า/หน้าแข้ง/น่อง${partLabel(patient.assaultLegKneeShinCalfSides, patient.assaultLegKneeShinCalfInjuries)}`);
    if (patient.assaultLegAnkleFoot) subs.push(`ข้อเท้า/เท้า${partLabel(patient.assaultLegAnkleFootSides, patient.assaultLegAnkleFootInjuries)}`);
    if (patient.assaultLegToes) {
      subs.push(`นิ้วเท้า${fmtDigitsBySide(patient.assaultLegToesLeftDigits, patient.assaultLegToesRightDigits, patient.assaultLegToesInjuries)}`);
    }
    parts.push(`ขา/เท้า: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  if (patient.assaultParentOther && patient.assaultOtherLocationDetail && patient.assaultOtherLocationDetail.trim()) {
    parts.push(`ตำแหน่งอื่นๆ: ${patient.assaultOtherLocationDetail.trim()}`);
  }

  return parts.length > 0 ? parts.join(' | ') : 'ไม่ได้ระบุตำแหน่งชัดเจน';
}

function renderAssaultRapidHpi(patient) {
  const durVal = patient.durationVal !== undefined && patient.durationVal !== null ? patient.durationVal : '';
  const durUnitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durStr = durVal ? `${durVal} ${durUnitMap[patient.durationUnit] || 'ชั่วโมง'}` : 'ไม่ระบุระยะเวลา';

  const mechStr = formatAssaultMechanism(patient);
  const anatomyStr = formatAssaultAnatomy(patient);

  const bleedMap = {
    none_or_contusion: 'ไม่มีแผลเปิด (ปวดบวมฟกช้ำ)',
    abrasion_or_stopped: 'มีแผลถลอก/แตก เลือดหยุดไหลแล้ว',
    active_oozing: 'มีแผล เลือดไหลซึมต่อเนื่อง',
    active_spurting_profuse: 'แผลเลือดไหลพุ่ง หรือไหลออกมากผิดปกติ'
  };
  const bleedStr = bleedMap[patient.assaultBleedingStatus] || 'ไม่ได้ระบุสถานะเลือดออก';

  // Systemic Positives / Negatives
  const headSigns = Array.isArray(patient.assaultHeadSigns) ? patient.assaultHeadSigns : [];
  const neckSigns = Array.isArray(patient.assaultNeckSigns) ? patient.assaultNeckSigns : [];
  const chestSigns = Array.isArray(patient.assaultChestSigns) ? patient.assaultChestSigns : [];
  const abdSigns = Array.isArray(patient.assaultAbdSigns) ? patient.assaultAbdSigns : [];
  const upperSigns = Array.isArray(patient.assaultUpperExtSigns) ? patient.assaultUpperExtSigns : [];
  const lowerSigns = Array.isArray(patient.assaultLowerExtSigns) ? patient.assaultLowerExtSigns : [];
  const sysSigns = Array.isArray(patient.assaultSystemicSigns) ? patient.assaultSystemicSigns : [];

  const positives = [];
  const negatives = [];

  if (headSigns.includes('loc_amnesia')) positives.push('มีอาการสลบ หมดสติชั่วขณะ หรือจำเหตุการณ์ไม่ได้');
  if (headSigns.includes('severe_headache_vomiting')) positives.push('ปวดศีรษะรุนแรง มึนงง หรืออาเจียน');
  if (headSigns.includes('diplopia_blurred_vision')) positives.push('ตาพร่ามัว มองเห็นภาพซ้อน หรือตาบวมปิด');
  if (headSigns.includes('blood_csf_ear_nose_deformity')) positives.push('เลือด/น้ำใสออกหูจมูก หรือดั้งจมูกเบี้ยวผิดรูป');
  if (headSigns.includes('malocclusion_jaw_locked') || headSigns.includes('malocclusion_tooth_avulsion')) positives.push('ขากรรไกรค้าง อ้าปากไม่ขึ้น หรือสบฟันไม่สนิท');
  if (headSigns.includes('broken_loose_tooth')) positives.push('ฟันหัก บิ่น หรือฟันโยกคลอน');

  if (neckSigns.includes('strangulation_dysphonia_dysphagia')) positives.push('แน่นคอ กลืนลำบาก หรือเสียงแหบหลังถูกบีบคอ');
  if (neckSigns.includes('penetrating_neck_rapid_swelling')) positives.push('มีแผลแทง/ปาดที่คอ หรือคอบวมโตเร็ว');
  if (neckSigns.includes('cspine_tenderness_radicular_deficit')) positives.push('ปวดตึงแนวกระดูกคอ หรือแขนขาชาอ่อนแรง');

  if (chestSigns.includes('dyspnea_chest_tightness')) positives.push('แน่นหน้าอก หายใจหอบเหนื่อยไม่อิ่ม');
  if (chestSigns.includes('pleuritic_rib_pain')) positives.push('เจ็บแปล๊บซี่โครงเวลาหายใจลึกหรือไอ');
  if (chestSigns.includes('penetrating_chest_wound')) positives.push('มีแผลแทง/ฟัน/ยิงที่หน้าอกหรือสะบัก');

  if (abdSigns.includes('severe_abd_pain_distension')) positives.push('ปวดท้องรุนแรง ท้องอืดตึง หรือกดเจ็บ');
  if (abdSigns.includes('penetrating_abd_wound')) positives.push('มีแผลแทง/ฟัน/ยิงที่หน้าท้องหรือบั้นเอว');
  if (abdSigns.includes('hematuria_anuria')) positives.push('ปัสสาวะเป็นเลือด หรือปัสสาวะไม่ออก');
  if (abdSigns.includes('genital_trauma_bleeding')) positives.push('มีบาดแผลหรือเลือดออกจากอวัยวะเพศ/ทวารหนัก');

  if (upperSigns.includes('arm_deformity_suspected_fracture')) positives.push('แขน ข้อมือ หรือนิ้วมือบวมผิดรูป สงสัยกระดูกหัก/ข้อหลุด');
  if (upperSigns.includes('tendon_injury_inability_to_move')) positives.push('ขยับข้อมือหรือกำเหยียดนิ้วมือไม่ได้ (สงสัยเอ็นขาด)');
  if (upperSigns.includes('numbness_pallor_cold_finger')) positives.push('ชาฝ่ามือ หรือปลายนิ้วมือซีดเย็น');

  if (lowerSigns.includes('leg_deformity_suspected_fracture')) positives.push('ขา เข่า หรือข้อเท้า บวมผิดรูป');
  if (lowerSigns.includes('inability_to_bear_weight')) positives.push('เดินหรือยืนลงน้ำหนักที่ขาข้างเจ็บไม่ได้เลย');

  if (sysSigns.includes('presyncope_dizziness')) positives.push('หน้ามืด เวียนศีรษะ วูบจะเป็นลม');
  if (sysSigns.includes('palpitation_cold_sweat_pallor')) positives.push('ใจสั่น เหงื่อแตก ตัวเย็น หน้าซีดปากซีด');
  if (sysSigns.includes('suspected_drugged_intoxicated')) positives.push('มึนงงสะลึมสะลือผิดปกติ สงสัยถูกวางยา/มอมยา');
  if (sysSigns.includes('no_systemic_signs')) negatives.push('ไม่มีอาการหน้ามืด ใจสั่น ตัวเย็น หรือมึนงงสะลึมสะลือ');

  if (patient.assaultParentHeadFace && !headSigns.includes('loc_amnesia') && !headSigns.includes('severe_headache_vomiting')) negatives.push('ไม่มีอาการสลบ ไม่ปวดศีรษะและไม่อาเจียน');
  if (patient.assaultParentNeck && !neckSigns.includes('strangulation_dysphonia_dysphagia')) negatives.push('ไม่มีเสียงแหบหรือกลืนลำบาก');
  if (patient.assaultParentChest && !chestSigns.includes('dyspnea_chest_tightness')) negatives.push('ไม่เจ็บแน่นหน้าอก และไม่หายใจเหนื่อยหอบ');
  if (patient.assaultParentAbdomen && !abdSigns.includes('severe_abd_pain_distension') && !abdSigns.includes('hematuria_anuria')) negatives.push('ไม่ปวดท้อง และปัสสาวะไม่มีเลือดปน');

  const pScore = patient.painScore !== null && patient.painScore !== undefined ? `${patient.painScore}/10` : 'ไม่ได้ระบุ';
  const osccMap = {
    general_assault: 'ทำร้ายร่างกายทั่วไป (ไม่มีล่วงละเมิดทางเพศ)',
    sexual_assault: 'มีการล่วงละเมิดทางเพศร่วมด้วย (ประสาน OSCC)',
    domestic_violence: 'ความรุนแรงในครอบครัว/คู่ครอง กังวลความปลอดภัย (ประสาน OSCC)'
  };
  const osccStr = osccMap[patient.assaultOsccScreen] || 'ไม่ได้ระบุ';

  const anticoagMap = {
    anticoagulant_antiplatelet: 'ใช้ยาละลายลิ่มเลือด/ต้านเกล็ดเลือด',
    bleeding_disorder: 'มีโรคเลือดออกง่าย/หยุดยาก',
    unknown_regular_meds: 'มียาประจำตัวแต่ไม่ทราบชื่อ',
    no_anticoagulant: 'ปฏิเสธการใช้ยาละลายลิ่มเลือด'
  };
  const anticoagStr = anticoagMap[patient.assaultAnticoagulantHx] || 'ไม่ได้ระบุ';

  if (patient.otherSymptomsFree && String(patient.otherSymptomsFree).trim()) {
    positives.push(`ข้อมูลเพิ่มเติมจากผู้ป่วย: ${String(patient.otherSymptomsFree).trim()}`);
  }

  const pregMap = {
    not_pregnant: 'ไม่ได้ตั้งครรภ์ / ประจำเดือนมาปกติ',
    suspected_or_missed: 'ขาดประจำเดือน / สงสัยอาจตั้งครรภ์',
    confirmed_pregnant: 'ยืนยันกำลังตั้งครรภ์',
    menopause_or_hysterectomy: 'วัยหมดประจำเดือน / ผ่าตัดมดลูกแล้ว',
    unknown: 'ไม่ทราบสถานะการตั้งครรภ์'
  };
  let femStr = '';
  if (isAssaultFemalePatient(patient) && (patient.assaultLmpDate || patient.assaultPregnancyStatus)) {
    femStr = `LMP ${patient.assaultLmpDate || 'ไม่ระบุ'} (${pregMap[patient.assaultPregnancyStatus] || 'ไม่ได้ระบุ'})`;
  }

  const tetanusMap = {
    within_5_years: 'เคยฉีดเข็มกระตุ้นภายใน 5 ปีที่ผ่านมา',
    '5_to_10_years': 'เคยฉีดในช่วง 5–10 ปีที่ผ่านมา',
    over_10_years: 'เคยฉีดครบ แต่เกิน 10 ปีแล้ว',
    more_than_10_years: 'เคยฉีดครบ แต่เกิน 10 ปีแล้ว',
    unknown_or_never: 'ไม่เคยฉีด หรือจำประวัติไม่ได้',
    never_or_unsure: 'ไม่เคยฉีด หรือจำประวัติไม่ได้'
  };
  const tetanusStr = tetanusMap[patient.assaultTetanusHx] || 'ไม่ได้ระบุ';

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
  const medsDisplay = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ')
    ? 'ไม่ได้ระบุ'
    : (patient.currentMeds === 'ไม่มี' ? 'ไม่มี' : patient.currentMeds);

  const rfs = evaluateAssaultRedFlags(patient);
  const rfText = rfs.length > 0
    ? `🚩 RED FLAGS DETECTED:\n${rfs.map(rf => `  * ${rf.title}\n    ความเสี่ยง: ${rf.detail}\n    ข้อแนะนำการดูแลเร่งด่วน: ${rf.action}`).join('\n\n')}`
    : '✅ ไม่พบสัญญาณเตือนวิกฤตความเสี่ยงสูง (Non-Red Flag)';

  return `[Chief Complaint (CC)]
ถูกทำร้ายร่างกาย เป็นมา ${durStr}

[History of Present Illness (HPI)]
• กลไกการถูกทำร้ายและอาวุธ: ${mechStr} เป็นมา ${durStr}
• สถานะเลือดออกภายนอก: ${bleedStr}
• ตำแหน่งบาดเจ็บและชนิดการบาดเจ็บ: ${anatomyStr}
• ระดับความปวด (Pain Score): ${pScore}

• Pertinent Positives:
${positives.length > 0 ? positives.map(p => `  - ${p}`).join('\n') : '  - ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม'}

• Pertinent Negatives:
${negatives.length > 0 ? negatives.map(n => `  - ${n}`).join('\n') : '  - ผู้ป่วยไม่ได้ระบุคำตอบยืนยันในหมวดอาการร่วม'}

[Past Medical History & Medico-Legal Care Profile]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• การคัดกรองศูนย์พึ่งได้ (OSCC) / ความรุนแรง: ${osccStr}
• ประวัติยาละลายลิ่มเลือด/โรคเลือดออกง่าย: ${anticoagStr}
• ประวัติวัคซีนบาดทะยัก: ${tetanusStr}${femStr ? `\n• ประวัติสตรี: ${femStr}` : ''}
• โรคประจำตัว (U/D): ${udDisplay}
• ยาประจำตัว: ${medsDisplay} | แพ้ยา: ${allergyDisplay}

[Emergency Risk Assessment (Red Flags)]
${rfText}`;
}

function renderAssaultNarrativeHpi(patient) {
  const durVal = patient.durationVal !== undefined && patient.durationVal !== null ? patient.durationVal : '';
  const durUnitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durStr = durVal ? `${durVal} ${durUnitMap[patient.durationUnit] || 'ชั่วโมง'}` : 'ไม่ระบุระยะเวลา';

  const mechStr = formatAssaultMechanism(patient);
  const anatomyStr = formatAssaultAnatomy(patient);

  let text = `ผู้ป่วยมาด้วยอาการถูกทำร้ายร่างกายโดย${mechStr} เป็นมาประมาณ ${durStr} ก่อนมาโรงพยาบาล ตรวจพบตำแหน่งบาดเจ็บและชนิดการบาดเจ็บที่บริเวณ ${anatomyStr}`;

  const headSigns = Array.isArray(patient.assaultHeadSigns) ? patient.assaultHeadSigns : [];
  if (headSigns.includes('loc_amnesia')) text += ` มีประวัติสลบหมดสติชั่วขณะหลังเกิดเหตุ`;

  const neckSigns = Array.isArray(patient.assaultNeckSigns) ? patient.assaultNeckSigns : [];
  if (neckSigns.includes('strangulation_dysphonia_dysphagia')) text += ` มีอาการแน่นคอกลืนลำบากและเสียงแหบ`;

  const chestSigns = Array.isArray(patient.assaultChestSigns) ? patient.assaultChestSigns : [];
  const abdSigns = Array.isArray(patient.assaultAbdSigns) ? patient.assaultAbdSigns : [];
  if (chestSigns.includes('dyspnea_chest_tightness') || abdSigns.includes('severe_abd_pain_distension')) {
    text += ` ร่วมกับมีอาการแน่นหน้าอกหายใจเหนื่อยหรือปวดท้องรุนแรง`;
  }

  const pregMap = {
    not_pregnant: 'ไม่ได้ตั้งครรภ์ / ประจำเดือนมาปกติ',
    suspected_or_missed: 'ขาดประจำเดือน / สงสัยอาจตั้งครรภ์',
    confirmed_pregnant: 'ยืนยันกำลังตั้งครรภ์',
    menopause_or_hysterectomy: 'วัยหมดประจำเดือน / ผ่าตัดมดลูกแล้ว',
    unknown: 'ไม่ทราบสถานะการตั้งครรภ์'
  };
  if (isAssaultFemalePatient(patient) && (patient.assaultLmpDate || patient.assaultPregnancyStatus)) {
    text += ` ประวัติสตรี: LMP ${patient.assaultLmpDate || 'ไม่ระบุ'} (${pregMap[patient.assaultPregnancyStatus] || 'ไม่ได้ระบุ'})`;
  }
  if (patient.otherSymptomsFree && String(patient.otherSymptomsFree).trim()) {
    text += ` ข้อมูลเพิ่มเติม: ${String(patient.otherSymptomsFree).trim()}`;
  }
  return text;
}

// --- FORM HTML TEMPLATE ---
const PHYSICAL_ASSAULT_FORM_HTML = `
<div id="cc-physical-assault-section" class="space-y-6">
  <div data-cc-top-banner="physical_assault"><div class="flex flex-col gap-4">
  <!-- First-Aid Guidance Banner -->
  <div class="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs sm:text-sm text-amber-900 flex items-start space-x-3 shadow-xs">
    <i data-lucide="shield-alert" class="w-5 h-5 text-amber-600 shrink-0 mt-0.5"></i>
    <div class="space-y-1">
      <strong class="font-bold block text-amber-950 text-sm">คำแนะนำเบื้องต้นระหว่างรอตรวจ:</strong>
      <ul class="list-disc list-inside space-y-0.5 text-amber-800 text-xs sm:text-sm">
        <li><strong>กรณีมีแผลเลือดออก:</strong> ใช้ผ้าสะอาดกดบนแผลโดยตรงให้แน่นต่อเนื่องเพื่อห้ามเลือด</li>
        <li><strong>กรณีถูกสาดสารเคมีเข้าตา/ผิวหนัง:</strong> รีบแจ้งพยาบาลทันทีเพื่อล้างด้วยน้ำสะอาดปริมาณมากโดยด่วน</li>
        <li><strong>ควรงดน้ำ/อาหารชั่วคราว:</strong> หากปวดท้อง ปวดศีรษะรุนแรง หรือแผลฉกรรจ์ (ข้อมูลของท่านเป็นความลับทางการแพทย์)</li>
      </ul>
    </div>
  </div>
  </div></div>

  <!-- CARD 1: ข้อมูลเหตุการณ์ กลไกการถูกทำร้าย และสถานะเลือดออก -->
  <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
    <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
      <div class="p-2 rounded-xl bg-medical-100 text-medical-700">
        <i data-lucide="shield-alert" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900">1. ข้อมูลเหตุการณ์ กลไกการถูกทำร้าย และสถานะเลือดออก</h2>
        <p class="text-xs text-slate-500">ลักษณะการถูกทำร้าย อาวุธที่ใช้ และสถานะเลือดออกในขณะนี้</p>
      </div>
    </div>

    <!-- 1.1 เหตุการณ์เกิดขึ้นมานานเท่าใด -->
    <div>
      <label class="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
        1.1 เหตุการณ์ถูกทำร้ายร่างกายเกิดขึ้นมานานเท่าใด:
      </label>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md">
        <div class="col-span-1 sm:col-span-2">
          <input type="number" id="assaultDurationVal" min="1" max="365" placeholder="ระบุตัวเลข เช่น 30"
            class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white transition">
        </div>
        <div class="col-span-1">
          <select id="assaultDurationUnit"
            class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white transition">
            <option value="minutes">นาที</option>
            <option value="hours" selected>ชั่วโมง</option>
            <option value="days">วัน</option>
            <option value="weeks">สัปดาห์</option>
            <option value="months">เดือน</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 1.2 ลักษณะการถูกทำร้าย หรือสิ่งที่ใช้ทำร้าย -->
    <div class="pt-3 border-t border-slate-100 space-y-2.5">
      <label class="block text-xs sm:text-sm font-semibold text-slate-800">1.2 ลักษณะการถูกทำร้าย หรือสิ่งที่ใช้ทำร้าย (เลือกได้หลายข้อ):</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        ${renderAssaultOption({ name: 'assaultMechanisms', value: 'physical_force', title: ['ทำร้ายด้วยร่างกาย'], desc: 'ชก ต่อย ตบ เตะ กระทืบ หรือผลักล้มกระแทก', onchange: 'handleAssaultMechanismChange()' })}
        <div>
          ${renderAssaultOption({ name: 'assaultMechanisms', value: 'blunt_weapon', title: ['ถูกตีด้วยของแข็ง', 'ไม่มีคม'], desc: 'ท่อนไม้ เหล็ก ขวด หมวกกันน็อก เก้าอี้ ก้อนหิน', onchange: 'handleAssaultMechanismChange()' })}
          <div id="assaultBluntDetailContainer" class="hidden mt-2 pl-3 border-l-2 border-medical-200">
            <input type="text" id="assaultBluntDetail" placeholder="พิมพ์ระบุสิ่งของที่ใช้ตี เช่น ขวดแก้ว, ท่อนเหล็ก..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-medical-500">
          </div>
        </div>
        <div>
          ${renderAssaultOption({ name: 'assaultMechanisms', value: 'sharp_weapon', title: ['ถูกแทง / ฟัน / บาด', 'ด้วยของมีคม'], desc: 'มีด คัตเตอร์ ปากฉลาม เศษแก้ว เหล็กแหลม', onchange: 'handleAssaultMechanismChange()' })}
          <div id="assaultSharpDetailContainer" class="hidden mt-2 pl-3 border-l-2 border-medical-200">
            <input type="text" id="assaultSharpDetail" placeholder="พิมพ์ระบุชนิดของมีคม เช่น มีดพก, เศษขวดแก้ว..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-medical-500">
          </div>
        </div>
        ${renderAssaultOption({ name: 'assaultMechanisms', value: 'gunshot', title: ['ถูกยิงด้วยอาวุธปืน'], desc: 'อาวุธปืนหรือสิ่งเทียมอาวุธปืน', onchange: 'handleAssaultMechanismChange()' })}
        ${renderAssaultOption({ name: 'assaultMechanisms', value: 'strangulation_choking', title: ['ถูกบีบคอ / รัดคอ', 'กดทับทางเดินหายใจ'], desc: 'ล็อกคอ หรือกดทับใบหน้าจนหายใจไม่ออก', onchange: 'handleAssaultMechanismChange()' })}
        ${renderAssaultOption({ name: 'assaultMechanisms', value: 'human_bite_scratch', title: ['ถูกกัด หรือถูกข่วน', 'โดยบุคคลอื่น'], onchange: 'handleAssaultMechanismChange()' })}
        <div>
          ${renderAssaultOption({ name: 'assaultMechanisms', value: 'chemical_thermal_burn', title: ['ถูกสาดน้ำร้อน /', 'สารเคมี'], desc: 'น้ำกรด น้ำด่าง หรือสารเคมีอื่น', onchange: 'handleAssaultMechanismChange()' })}
          <div id="assaultChemicalDetailContainer" class="hidden mt-2 pl-3 border-l-2 border-medical-200">
            <input type="text" id="assaultChemicalDetail" placeholder="พิมพ์ระบุสิ่งที่ถูกสาดหรือพ่น เช่น น้ำร้อน, น้ำกรด..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-medical-500">
          </div>
        </div>
        <div>
          ${renderAssaultOption({ name: 'assaultMechanisms', value: 'other_mechanism', title: ['ลักษณะอื่นๆ', '(พิมพ์ระบุ)'], onchange: 'handleAssaultMechanismChange()' })}
          <div id="assaultOtherMechDetailContainer" class="hidden mt-2 pl-3 border-l-2 border-medical-200">
            <input type="text" id="assaultOtherMechDetail" placeholder="พิมพ์ระบุลักษณะการถูกทำร้ายเพิ่มเติม..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-medical-500">
          </div>
        </div>
      </div>
    </div>

    <!-- 1.3 สถานะเลือดออกภายนอก -->
    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
      ${renderAssaultSysHeader({
        label: '1.3 สถานะบาดแผลเปิดหรือเลือดออกภายนอก <span class="text-rose-500">*</span>',
        icon: 'droplets',
        colorClass: 'bg-rose-100 text-rose-700',
        toggleKind: 'radio',
        toggleId: 'assaultBleedNoneRb',
        toggleName: 'assaultBleedingStatus',
        toggleValue: 'none_or_contusion',
        toggleLabel: 'ไม่มีแผลเปิด'
      })}
      ${renderAssaultGrid('grid-cols-1 sm:grid-cols-3', [
        { kind: 'radio', name: 'assaultBleedingStatus', value: 'abrasion_or_stopped', title: ['แผลถลอก / แผลแตก', 'เลือดหยุดไหลแล้ว'], compact: true },
        { kind: 'radio', name: 'assaultBleedingStatus', value: 'active_oozing', title: ['มีบาดแผลและเลือด', 'ยังไหลซึมต่อเนื่อง'], compact: true },
        { kind: 'radio', name: 'assaultBleedingStatus', value: 'active_spurting_profuse', title: ['เลือดไหลพุ่ง /', 'ไหลออกมากผิดปกติ'], desc: 'กดห้ามเลือดแล้วยังชุ่มผ้าอย่างรวดเร็ว', compact: true }
      ])}
    </div>
  </div>

  <!-- CARD 2: ตำแหน่งของร่างกายที่ได้รับบาดเจ็บ (7 ส่วนร่างกาย) -->
  <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
    <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
      <div class="p-2 rounded-xl bg-medical-100 text-medical-700">
        <i data-lucide="user-check" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900">2. ตำแหน่งของร่างกายที่ได้รับบาดเจ็บและชนิดการบาดเจ็บ</h2>
        <p class="text-xs text-slate-500">เลือกโซนร่างกายที่มีแผลหรือปวดบวม จากนั้นระบุด้านและลักษณะบาดเจ็บ</p>
      </div>
    </div>

    ${renderAssaultRegionBox({
      parentId: 'assaultParentHeadFace',
      subGroupId: 'assaultHeadFaceSubGroup',
      title: ['2.1 ศีรษะ ใบหน้า', 'ดวงตา หู จมูก ปาก'],
      partsHtml: [
        renderAssaultPart('assaultHeadScalp', 'หนังศีรษะ / หน้าผาก / ท้ายทอย', true),
        renderAssaultPart('assaultHeadFace', 'ใบหน้า / คิ้ว / โหนกแก้ม / ขากรรไกร / คาง', true),
        renderAssaultPart('assaultHeadEye', 'ดวงตา / เปลือกตา / เบ้าตา'),
        renderAssaultPart('assaultHeadEar', 'ใบหู / กกหู'),
        renderAssaultPart('assaultHeadNoseMouth', 'จมูก / ริมฝีปาก / ฟัน / ในช่องปาก', true)
      ].join('\n'),
      signsName: 'assaultHeadSigns',
      signsNoneId: 'assaultHeadSignsNoneCb',
      signs: [
        { value: 'loc_amnesia', title: ['สลบ หมดสติชั่วขณะ', 'จำเหตุการณ์ไม่ได้'] },
        { value: 'severe_headache_vomiting', title: ['ปวดศีรษะรุนแรง', 'มึนงง ซึม อาเจียน'] },
        { value: 'diplopia_blurred_vision', title: ['ตาพร่ามัว ภาพซ้อน', 'หรือตาบวมปิด'], desc: 'มีเลือดออกในตา หรือลืมตาไม่ขึ้น' },
        { value: 'blood_csf_ear_nose_deformity', title: ['เลือด/น้ำใสออกหู', 'หรือดั้งจมูกเบี้ยว'], desc: 'หูอื้อได้ยินลดลง หรือจมูกบวมผิดรูป' },
        { value: 'malocclusion_jaw_locked', title: ['ขากรรไกรค้าง /', 'สบไม่สนิท'], desc: 'อ้าปากไม่ขึ้น หรือสบฟันไม่ตรง' },
        { value: 'broken_loose_tooth', title: ['ฟันหัก / โยก'], desc: 'ฟันแตก บิ่น หลุด หรือโยกคลอน' }
      ]
    })}

    ${renderAssaultRegionBox({
      parentId: 'assaultParentNeck',
      subGroupId: 'assaultNeckSubGroup',
      title: ['2.2 ลำคอ / ต้นคอ'],
      partsHtml: [
        renderAssaultPart('assaultNeckFront', 'ลำคอด้านหน้า (ลูกกระเดือก / หลอดลม)', true),
        renderAssaultPart('assaultNeckSide', 'ลำคอด้านข้าง'),
        renderAssaultPart('assaultNeckBack', 'ต้นคอด้านหลัง (แนวกระดูกต้นคอ)', true)
      ].join('\n'),
      signsName: 'assaultNeckSigns',
      signsNoneId: 'assaultNeckSignsNoneCb',
      signsCols: 'grid-cols-1 sm:grid-cols-3',
      signs: [
        { value: 'strangulation_dysphonia_dysphagia', title: ['หายใจ / กลืนลำบาก', 'แน่นคอ หรือเสียงแหบ'], desc: 'เจ็บคอมากเวลาพูดหรือกลืน' },
        { value: 'penetrating_neck_rapid_swelling', title: ['แผลแทง/ปาดลำคอ', 'หรือคอบวมโตเร็ว'] },
        { value: 'cspine_tenderness_radicular_deficit', title: ['ปวดตึงต้นคอมาก', 'ชา/อ่อนแรงแขนขา'], desc: 'ปวดแนวกระดูกต้นคอ หรือชาร้าวลงแขนขา' }
      ]
    })}

    ${renderAssaultRegionBox({
      parentId: 'assaultParentChest',
      subGroupId: 'assaultChestSubGroup',
      title: ['2.3 หน้าอก ซี่โครง', 'ไหปลาร้า / หลังบน'],
      partsHtml: [
        renderAssaultPart('assaultChestFront', 'หน้าอก / ซี่โครง / ราวนม', true),
        renderAssaultPart('assaultChestClavicle', 'ไหปลาร้า'),
        renderAssaultPart('assaultChestBack', 'แผ่นหลังส่วนบน / สะบัก', true)
      ].join('\n'),
      signsName: 'assaultChestSigns',
      signsNoneId: 'assaultChestSignsNoneCb',
      signsCols: 'grid-cols-1 sm:grid-cols-3',
      signs: [
        { value: 'dyspnea_chest_tightness', title: ['หายใจหอบเหนื่อย', 'แน่นหน้าอก'], desc: 'รู้สึกหายใจเข้าได้ไม่สุด' },
        { value: 'pleuritic_rib_pain', title: ['เจ็บแปล๊บหน้าอก /', 'ซี่โครงเวลาหายใจ'], desc: 'เจ็บเวลาหายใจเข้าลึกๆ ไอ หรือขยับตัว' },
        { value: 'penetrating_chest_wound', title: ['แผลถูกแทง ฟัน ยิง', 'บริเวณหน้าอก/หลัง'] }
      ]
    })}

    ${renderAssaultRegionBox({
      parentId: 'assaultParentAbdomen',
      subGroupId: 'assaultAbdomenSubGroup',
      title: ['2.4 หน้าท้อง เอว', 'หลังล่าง สะโพก เพศ'],
      partsHtml: [
        renderAssaultPart('assaultAbdFront', 'หน้าท้อง / ชายโครง', true),
        renderAssaultPart('assaultAbdFlank', 'สีข้าง / บั้นเอว'),
        renderAssaultPart('assaultAbdLowBack', 'หลังส่วนล่าง', true),
        renderAssaultPart('assaultAbdButtock', 'สะโพก / ก้น', true),
        renderAssaultPart('assaultAbdGroinGenitalia', 'ขาหนีบ / อวัยวะเพศ / ทวารหนัก', true)
      ].join('\n'),
      signsName: 'assaultAbdSigns',
      signsNoneId: 'assaultAbdSignsNoneCb',
      signs: [
        { value: 'severe_abd_pain_distension', title: ['ปวดท้องรุนแรง', 'ท้องอืดตึง / กดเจ็บ'] },
        { value: 'penetrating_abd_wound', title: ['แผลถูกแทง ฟัน ยิง', 'หน้าท้อง / บั้นเอว'] },
        { value: 'hematuria_anuria', title: ['ปัสสาวะเป็นเลือด', 'หรือปัสสาวะไม่ออก'] },
        { value: 'genital_trauma_bleeding', title: ['แผล/เลือดออก', 'อวัยวะเพศ / ก้น'], desc: 'บาดแผล เลือดออก หรือปวดบวมมาก' }
      ]
    })}

    ${renderAssaultRegionBox({
      parentId: 'assaultParentUpperExtremity',
      subGroupId: 'assaultUpperExtSubGroup',
      title: ['2.5 ไหล่ แขน มือ', 'และนิ้วมือ'],
      desc: 'รวมแผลป้องกันตัวบริเวณแขนและมือ',
      partsHtml: [
        renderAssaultPart('assaultArmShoulder', 'หัวไหล่ / ต้นแขน'),
        renderAssaultPart('assaultArmElbowForearm', 'ข้อศอก / แขนท่อนล่าง'),
        renderAssaultPart('assaultArmWristHand', 'ข้อมือ / ฝ่ามือ / หลังมือ'),
        renderAssaultDigits('assaultArmFingers', 'นิ้วมือ')
      ].join('\n'),
      signsName: 'assaultUpperExtSigns',
      signsNoneId: 'assaultUpperExtSignsNoneCb',
      signsCols: 'grid-cols-1 sm:grid-cols-3',
      signs: [
        { value: 'arm_deformity_suspected_fracture', title: ['แขน มือ นิ้วผิดรูป', 'บวมโตบิดเบี้ยว'] },
        { value: 'tendon_injury_inability_to_move', title: ['ขยับข้อมือ กำมือ', 'และนิ้วมือไม่ได้'], desc: 'เหยียดหรือกำนิ้วมือไม่ได้ตามปกติ' },
        { value: 'numbness_pallor_cold_finger', title: ['ชา ไร้ความรู้สึก', 'ปลายนิ้วมือซีดเย็น'] }
      ]
    })}

    ${renderAssaultRegionBox({
      parentId: 'assaultParentLowerExtremity',
      subGroupId: 'assaultLowerExtSubGroup',
      title: ['2.6 ต้นขา เข่า', 'ข้อเท้าและนิ้วเท้า'],
      partsHtml: [
        renderAssaultPart('assaultLegThigh', 'ต้นขา'),
        renderAssaultPart('assaultLegKneeShinCalf', 'เข่า / หน้าแข้ง / น่อง'),
        renderAssaultPart('assaultLegAnkleFoot', 'ข้อเท้า / ส้นเท้า / ฝ่าเท้า / หลังเท้า'),
        renderAssaultDigits('assaultLegToes', 'นิ้วเท้า')
      ].join('\n'),
      signsName: 'assaultLowerExtSigns',
      signsNoneId: 'assaultLowerExtSignsNoneCb',
      signsCols: 'grid-cols-1 sm:grid-cols-3',
      signs: [
        { value: 'leg_deformity_suspected_fracture', title: ['ขา เข่า ข้อเท้า', 'บวมโต / ผิดรูป'] },
        { value: 'inability_to_bear_weight', title: ['เดินหรือยืน', 'ลงน้ำหนักไม่ได้เลย'] },
        { value: 'foot_drop_numbness_pallor', title: ['ชา กระดกเท้าไม่ได้', 'ปลายเท้าซีดเย็น'] }
      ]
    })}

    <!-- 2.7 ตำแหน่งอื่นๆ -->
    <div class="space-y-3">
      <label class="selectable-card flex items-center p-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 hover:border-medical-400 transition cursor-pointer">
        <input type="checkbox" id="assaultParentOther" onchange="toggleAssaultGroup('assaultOtherSubGroup', this.checked)" class="text-medical-600 focus:ring-medical-500 h-5 w-5 rounded flex-shrink-0">
        <span class="ml-3 text-xs sm:text-sm font-bold text-slate-900">2.7 ตำแหน่งอื่นๆ (พิมพ์ระบุ)</span>
      </label>
      <div id="assaultOtherSubGroup" class="hidden pl-4 sm:pl-6 border-l-2 border-medical-200">
        <input type="text" id="assaultOtherLocationDetail" placeholder="ระบุตำแหน่งของร่างกายที่ได้รับบาดเจ็บ เช่น ซอกคอ, ใต้รักแร้..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-medical-500 focus:bg-white">
      </div>
    </div>
  </div>

  <!-- CARD 3: อาการผิดปกติของร่างกาย และระดับความปวด -->
  <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
    <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
      <div class="p-2 rounded-xl bg-medical-100 text-medical-700">
        <i data-lucide="activity" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900">3. อาการผิดปกติของร่างกาย และระดับความปวด</h2>
        <p class="text-xs text-slate-500">คัดกรองอาการหน้ามืด เป็นลม ภาวะเสียเลือด และระดับความปวด</p>
      </div>
    </div>

    <!-- 3.1 อาการผิดปกติของร่างกาย -->
    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
      ${renderAssaultSysHeader({
        label: '3.1 อาการผิดปกติของร่างกายที่พบร่วมด้วย (เลือกได้หลายข้อ)',
        icon: 'alert-triangle',
        colorClass: 'bg-amber-100 text-amber-700',
        toggleKind: 'checkbox',
        toggleId: 'assaultSystemicNoneCb',
        toggleName: 'assaultSystemicSigns',
        toggleValue: 'no_systemic_signs',
        toggleLabel: 'ไม่มีอาการในหมวดนี้',
        toggleOnchange: "handleAssaultGroupNoneToggle(this, 'assaultSystemicSigns')"
      })}
      ${renderAssaultGrid('grid-cols-1 sm:grid-cols-3', [
        { name: 'assaultSystemicSigns', value: 'presyncope_dizziness', title: ['หน้ามืด เวียนศีรษะ', 'วูบจะเป็นลม'], onchange: "handleAssaultGroupItemChange(this, 'assaultSystemicNoneCb')", compact: true },
        { name: 'assaultSystemicSigns', value: 'palpitation_cold_sweat_pallor', title: ['ใจสั่น เหงื่อแตก', 'ตัวเย็น หน้าปากซีด'], onchange: "handleAssaultGroupItemChange(this, 'assaultSystemicNoneCb')", compact: true },
        { name: 'assaultSystemicSigns', value: 'suspected_drugged_intoxicated', title: ['มึนงง สะลึมสะลือ', 'สงสัยอาจถูกวางยา'], desc: 'จำเหตุการณ์ไม่ได้ หรือสงสัยมีสารผสมในเครื่องดื่ม', onchange: "handleAssaultGroupItemChange(this, 'assaultSystemicNoneCb')", compact: true }
      ])}
    </div>

    <!-- 3.2 ระดับความปวด -->
    <div class="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label class="block text-xs sm:text-sm font-semibold text-slate-800 tracking-wider">3.2 ระดับความปวดบริเวณที่ได้รับบาดเจ็บในขณะนี้ (0 – 10)</label>
        <div class="flex items-center space-x-2">
          <span id="assaultPainScoreBadge" class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all">
            <span id="assaultPainScoreEmoji" class="text-base">⚪</span>
            <span id="assaultPainScoreText">ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)</span>
          </span>
          <button type="button" id="assaultPainScoreClearBtn" onclick="clearAssaultPainScore()" class="text-xs text-slate-400 hover:text-rose-600 underline hidden transition" title="ล้างค่าเพื่อให้เป็นไม่ได้ระบุ">ล้างค่า</button>
        </div>
      </div>
      <div class="px-1 pt-1">
        <input type="range" id="assaultPainScore" min="0" max="10" value="0" step="1" oninput="handleAssaultPainScoreChange(this.value)" class="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-600 focus:outline-none focus:ring-2 focus:ring-medical-500">
      </div>
      <div class="grid grid-cols-5 text-center text-[10px] sm:text-[11px] pt-1 gap-1 text-slate-500 font-medium">
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setAssaultPainScore(0)"><span class="text-lg sm:text-xl block">😊</span><span>0: สบายดี</span></div>
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setAssaultPainScore(2)"><span class="text-lg sm:text-xl block">🙂</span><span>1–3: เล็กน้อย</span></div>
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setAssaultPainScore(5)"><span class="text-lg sm:text-xl block">😐</span><span>4–6: ปานกลาง</span></div>
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setAssaultPainScore(8)"><span class="text-lg sm:text-xl block">😣</span><span>7–9: ปวดมาก</span></div>
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setAssaultPainScore(10)"><span class="text-lg sm:text-xl block">😭</span><span>10: ปวดที่สุด</span></div>
      </div>
    </div>
  </div>

  <!-- CARD 4: ข้อมูลเพิ่มเติมเพื่อการดูแล ยา และวัคซีนบาดทะยัก -->
  <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
    <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
      <div class="p-2 rounded-xl bg-medical-100 text-medical-700">
        <i data-lucide="shield-plus" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900">4. ข้อมูลเพิ่มเติมเพื่อการดูแล ยาละลายลิ่มเลือด และวัคซีนบาดทะยัก</h2>
        <p class="text-xs text-slate-500">ข้อมูลประวัติเพื่อความปลอดภัยและการดูแลรักษาอย่างเหมาะสม</p>
      </div>
    </div>

    <!-- 4.1 การดูแลพิเศษ / ศูนย์พึ่งได้ -->
    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
      ${renderAssaultSysHeader({
        label: '4.1 มีการถูกล่วงละเมิดทางเพศ หรือความรุนแรงในครอบครัวร่วมด้วยหรือไม่',
        icon: 'lock',
        colorClass: 'bg-purple-100 text-purple-700',
        toggleKind: 'radio',
        toggleId: 'assaultOsccNoneRb',
        toggleName: 'assaultOsccScreen',
        toggleValue: 'general_assault',
        toggleLabel: 'ทำร้ายทั่วไป'
      })}
      <p class="text-xs text-slate-500">ข้อมูลเป็นความลับทางการแพทย์ เพื่อจัดห้องตรวจที่มิดชิดและประสานดูแลอย่างครบถ้วน</p>
      ${renderAssaultGrid('grid-cols-1 sm:grid-cols-2', [
        { kind: 'radio', name: 'assaultOsccScreen', value: 'sexual_assault', title: ['มีเหตุลวนลามหรือ', 'ล่วงละเมิดทางเพศ'], compact: true },
        { kind: 'radio', name: 'assaultOsccScreen', value: 'domestic_violence', title: ['ถูกคนใกล้ชิดทำร้าย', 'กังวลความปลอดภัย'], desc: 'เกิดจากคนในครอบครัว/คู่ครอง และกังวลเรื่องกลับบ้าน', compact: true }
      ])}
    </div>

    <!-- 4.2 ยาละลายลิ่มเลือด -->
    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
      ${renderAssaultSysHeader({
        label: '4.2 ยาละลายลิ่มเลือด หรือโรคเลือดหยุดยาก <span class="text-rose-500">*</span>',
        icon: 'pill',
        colorClass: 'bg-blue-100 text-blue-700',
        toggleKind: 'radio',
        toggleId: 'assaultAnticoagNoneRb',
        toggleName: 'assaultAnticoagulantHx',
        toggleValue: 'no_anticoagulant',
        toggleLabel: 'ไม่มี / ไม่ได้ใช้'
      })}
      ${renderAssaultGrid('grid-cols-1 sm:grid-cols-3', [
        { kind: 'radio', name: 'assaultAnticoagulantHx', value: 'anticoagulant_antiplatelet', title: ['ใช้ยาละลายลิ่มเลือด', '/ ต้านเกล็ดเลือด'], desc: 'เช่น วาร์ฟาริน แอสไพริน', compact: true },
        { kind: 'radio', name: 'assaultAnticoagulantHx', value: 'bleeding_disorder', title: ['มีโรคเลือดออกง่าย', 'หรือเลือดหยุดยาก'], desc: 'เช่น โรคตับแข็ง เกล็ดเลือดต่ำ', compact: true },
        { kind: 'radio', name: 'assaultAnticoagulantHx', value: 'unknown_regular_meds', title: ['กินยาประจำตัว', 'แต่ไม่ทราบชื่อยา'], compact: true }
      ])}
    </div>

    <!-- 4.3 วัคซีนบาดทะยัก (Locked Tetanus Standard) -->
    <div class="pt-3 border-t border-slate-100">
      <label class="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">4.3 ประวัติการได้รับวัคซีนป้องกันบาดทะยัก</label>
      ${renderAssaultGrid('grid-cols-1 sm:grid-cols-2', [
        {
          kind: 'radio',
          name: 'assaultTetanusHx',
          value: 'within_5_years',
          title: ['ฉีดกระตุ้น', 'ภายใน 5 ปี'],
          desc: 'เคยฉีดครบ (3 เข็ม) มาก่อน และเข็มสุดท้ายหรือกระตุ้นไม่เกิน 5 ปี',
          compact: true
        },
        {
          kind: 'radio',
          name: 'assaultTetanusHx',
          value: '5_to_10_years',
          title: ['ฉีดล่าสุด', '5–10 ปีก่อน'],
          desc: 'เคยฉีดครบ (3 เข็ม) มาก่อน และเข็มสุดท้ายหรือกระตุ้นอยู่ในช่วง 5–10 ปี',
          compact: true
        },
        {
          kind: 'radio',
          name: 'assaultTetanusHx',
          value: 'over_10_years',
          title: ['ฉีดครบ', 'เกิน 10 ปีแล้ว'],
          desc: 'เคยฉีดครบ (3 เข็ม) มาก่อน แต่เข็มสุดท้ายนานเกิน 10 ปีแล้ว',
          compact: true
        },
        {
          kind: 'radio',
          name: 'assaultTetanusHx',
          value: 'unknown_or_never',
          title: ['ไม่เคยฉีด', '/ จำไม่ได้'],
          desc: 'ไม่เคยได้รับวัคซีนบาดทะยัก ฉีดไม่ครบ 3 เข็ม หรือไม่ทราบประวัติ',
          compact: true
        }
      ])}
    </div>

    <!-- 4.4 ส่วนเฉพาะผู้ป่วยสตรี (Hidden by default - C-AP13) -->
    <div id="assaultFemaleSection" class="hidden pt-3 border-t border-slate-100">
      <div class="p-3.5 bg-pink-50/40 rounded-xl border border-pink-100 space-y-3">
        ${renderAssaultSysHeader({
          label: '4.4 ประจำเดือนและการตั้งครรภ์ (เฉพาะสตรี)',
          icon: 'heart-pulse',
          colorClass: 'bg-pink-100 text-pink-700',
          toggleKind: 'radio',
          toggleId: 'assaultPregNotPregRb',
          toggleName: 'assaultPregnancyStatus',
          toggleValue: 'not_pregnant',
          toggleLabel: 'ไม่ได้ตั้งครรภ์'
        })}
        ${renderAssaultGrid('grid-cols-1 sm:grid-cols-2', [
          { kind: 'radio', name: 'assaultPregnancyStatus', value: 'suspected_or_missed', title: ['ขาดประจำเดือน', '/ สงสัยตั้งครรภ์'], compact: true },
          { kind: 'radio', name: 'assaultPregnancyStatus', value: 'confirmed_pregnant', title: ['ยืนยัน', 'กำลังตั้งครรภ์'], compact: true },
          { kind: 'radio', name: 'assaultPregnancyStatus', value: 'menopause_or_hysterectomy', title: ['หมดประจำเดือน', '/ ผ่าตัดมดลูกแล้ว'], compact: true },
          { kind: 'radio', name: 'assaultPregnancyStatus', value: 'unknown', title: ['ไม่ทราบ'], compact: true }
        ])}
        <div class="max-w-xs">
          <label class="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">วันแรกของประจำเดือนครั้งล่าสุด (ถ้าจำได้):</label>
          <input type="text" id="assaultLmpDate" data-universal-date="true" placeholder="วว/ดด/ปปปป เช่น 28/10/2026" class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
        </div>
      </div>
    </div>
  </div>

  <!-- อาการอื่นๆ เป็นช่องกรอกอิสระ -->
  <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100">
      <div class="bg-slate-100 text-slate-600 p-2 rounded-xl"><i data-lucide="message-square-plus" class="w-5 h-5"></i></div>
      <div>
        <h2 class="text-base font-bold text-slate-900">อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2>
        <p class="text-xs text-slate-500">ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)</p>
      </div>
    </div>
    <textarea id="physical_assault_other_free" rows="2" placeholder="พิมพ์ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)..."
      class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"></textarea>
  </div>
</div>
`;

// --- MODULE OBJECT DEFINITION ---
const physicalAssaultModule = {
  id: 'physical_assault',
  recordCc: 'physical_assault',
  schemaCode: 'physical_assault',
  titleTh: 'ถูกทำร้ายร่างกาย',
  titleEn: 'Physical assault / Violence injury',
  icon: 'shield-alert',
  doctorCcBadgeHtml: '<i data-lucide="shield-alert" class="w-3.5 h-3.5 mr-1 text-medical-600"></i> CC: ถูกทำร้ายร่างกาย (Physical Assault)',
  pmhSectionNumber: 5,
  dateFields: ['assaultLmpDate'],
  algorithm: 'physical-assault-protocol',
  sectionDomId: 'cc-physical-assault-section',
  formHtml: PHYSICAL_ASSAULT_FORM_HTML,

  // --- Mounting & Event Listeners Hook ---
  init() {
    clearAssaultPainScore();
  },

  onTitleChange(arg) {
    let isFemale = false;
    if (typeof arg === 'boolean') isFemale = arg;
    else if (typeof arg === 'object' && arg !== null) {
      isFemale = typeof arg.isFemale === 'boolean' ? arg.isFemale : (typeof arg.title === 'string' ? /นาง|น\.ส\.|ด\.ญ\.|หญิง|Mrs|Miss|Ms/i.test(arg.title) : isAssaultFemalePatient(arg));
    } else if (typeof arg === 'string') {
      isFemale = /นาง|น\.ส\.|ด\.ญ\.|หญิง|Mrs|Miss|Ms/i.test(arg);
    }
    toggleAssaultFemaleSection(isFemale);
  },

  onSelectForm() { checkAndDisplayAssaultLmp(); },
  onActivate(patient) { checkAndDisplayAssaultLmp(patient); },
  resetForm() { this.clearForm(); },

  // --- Form Data Extraction Hook ---
  collectIntake(ctx = {}) {
    const _rawDur = parseFloat(document.getElementById('assaultDurationVal')?.value);
    const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
    const durationUnit = document.getElementById('assaultDurationUnit')?.value || 'hours';

    const getCheckedValues = (name) => Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(cb => cb.value);
    const getRadioValue = (name) => {
      const checked = document.querySelector(`input[name="${name}"]:checked`);
      return checked ? checked.value : null;
    };
    const getChecked = (id) => {
      const el = document.getElementById(id);
      return el ? el.checked : false;
    };
    const getText = (id) => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : '';
    };

    const rec = {
      id: ctx.recordId || `case-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      queue_number: ctx.queueNumber || 'E1-000',
      hn: ctx.randomHn || '6700000',
      name: ctx.patientName || 'ผู้ป่วย (ไม่ระบุชื่อ)',
      age: ctx.patientAge !== undefined ? ctx.patientAge : 'ไม่ระบุ',
      gender: ctx.gender || 'ไม่ระบุ',
      chief_complaint: 'physical_assault',
      chief_complaint_title: 'ถูกทำร้ายร่างกาย',
      timestamp: new Date().toISOString(),
      status: ctx.recordStatus || 'waiting',
      durationVal,
      durationUnit,
      hospRecordStatus: ctx.hospRecordStatus || '',
      underlying: ctx.underlying || [],
      drugAllergy: ctx.drugAllergy || 'ไม่ได้ระบุ',
      currentMeds: ctx.currentMeds || 'ไม่ได้ระบุ',
      otherSymptomsFree: getText('physical_assault_other_free') || ctx.otherSymptomsFree || '',
      doctor_notes: ctx.preservedDoctorNotes || { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.8, sbp: 120, dbp: 80, bp: '120/80', pr: 76, rr: 16, spo2: 99 },
      esi_level: 3,

      assaultMechanisms: getCheckedValues('assaultMechanisms'),
      assaultBluntDetail: getText('assaultBluntDetail'),
      assaultSharpDetail: getText('assaultSharpDetail'),
      assaultChemicalDetail: getText('assaultChemicalDetail'),
      assaultOtherMechDetail: getText('assaultOtherMechDetail'),
      assaultBleedingStatus: getRadioValue('assaultBleedingStatus'),

      // Anatomy Checkboxes
      assaultParentHeadFace: getChecked('assaultParentHeadFace'),
      assaultHeadScalp: getChecked('assaultHeadScalp'),
      assaultHeadScalpSides: getCheckedValues('assaultHeadScalpSides'),
      assaultHeadFace: getChecked('assaultHeadFace'),
      assaultHeadFaceSides: getCheckedValues('assaultHeadFaceSides'),
      assaultHeadEye: getChecked('assaultHeadEye'),
      assaultHeadEyeSides: getCheckedValues('assaultHeadEyeSides'),
      assaultHeadEar: getChecked('assaultHeadEar'),
      assaultHeadEarSides: getCheckedValues('assaultHeadEarSides'),
      assaultHeadNoseMouth: getChecked('assaultHeadNoseMouth'),
      assaultHeadNoseMouthSides: getCheckedValues('assaultHeadNoseMouthSides'),
      assaultHeadSigns: getCheckedValues('assaultHeadSigns'),

      assaultParentNeck: getChecked('assaultParentNeck'),
      assaultNeckFront: getChecked('assaultNeckFront'),
      assaultNeckFrontSides: getCheckedValues('assaultNeckFrontSides'),
      assaultNeckSide: getChecked('assaultNeckSide'),
      assaultNeckSideSides: getCheckedValues('assaultNeckSideSides'),
      assaultNeckBack: getChecked('assaultNeckBack'),
      assaultNeckBackSides: getCheckedValues('assaultNeckBackSides'),
      assaultNeckSigns: getCheckedValues('assaultNeckSigns'),

      assaultParentChest: getChecked('assaultParentChest'),
      assaultChestFront: getChecked('assaultChestFront'),
      assaultChestFrontSides: getCheckedValues('assaultChestFrontSides'),
      assaultChestClavicle: getChecked('assaultChestClavicle'),
      assaultChestClavicleSides: getCheckedValues('assaultChestClavicleSides'),
      assaultChestBack: getChecked('assaultChestBack'),
      assaultChestBackSides: getCheckedValues('assaultChestBackSides'),
      assaultChestSigns: getCheckedValues('assaultChestSigns'),

      assaultParentAbdomen: getChecked('assaultParentAbdomen'),
      assaultAbdFront: getChecked('assaultAbdFront'),
      assaultAbdFrontSides: getCheckedValues('assaultAbdFrontSides'),
      assaultAbdFlank: getChecked('assaultAbdFlank'),
      assaultAbdFlankSides: getCheckedValues('assaultAbdFlankSides'),
      assaultAbdLowBack: getChecked('assaultAbdLowBack'),
      assaultAbdLowBackSides: getCheckedValues('assaultAbdLowBackSides'),
      assaultAbdButtock: getChecked('assaultAbdButtock'),
      assaultAbdButtockSides: getCheckedValues('assaultAbdButtockSides'),
      assaultAbdGroinGenitalia: getChecked('assaultAbdGroinGenitalia'),
      assaultAbdGroinGenitaliaSides: getCheckedValues('assaultAbdGroinGenitaliaSides'),
      assaultAbdSigns: getCheckedValues('assaultAbdSigns'),

      assaultParentUpperExtremity: getChecked('assaultParentUpperExtremity'),
      assaultArmShoulder: getChecked('assaultArmShoulder'),
      assaultArmShoulderSides: getCheckedValues('assaultArmShoulderSides'),
      assaultArmElbowForearm: getChecked('assaultArmElbowForearm'),
      assaultArmElbowForearmSides: getCheckedValues('assaultArmElbowForearmSides'),
      assaultArmWristHand: getChecked('assaultArmWristHand'),
      assaultArmWristHandSides: getCheckedValues('assaultArmWristHandSides'),
      assaultArmFingers: getChecked('assaultArmFingers'),
      assaultArmFingersLeftDigits: getCheckedValues('assaultArmFingersLeftDigits'),
      assaultArmFingersRightDigits: getCheckedValues('assaultArmFingersRightDigits'),
      assaultUpperExtSigns: getCheckedValues('assaultUpperExtSigns'),

      assaultParentLowerExtremity: getChecked('assaultParentLowerExtremity'),
      assaultLegThigh: getChecked('assaultLegThigh'),
      assaultLegThighSides: getCheckedValues('assaultLegThighSides'),
      assaultLegKneeShinCalf: getChecked('assaultLegKneeShinCalf'),
      assaultLegKneeShinCalfSides: getCheckedValues('assaultLegKneeShinCalfSides'),
      assaultLegAnkleFoot: getChecked('assaultLegAnkleFoot'),
      assaultLegAnkleFootSides: getCheckedValues('assaultLegAnkleFootSides'),
      assaultLegToes: getChecked('assaultLegToes'),
      assaultLegToesLeftDigits: getCheckedValues('assaultLegToesLeftDigits'),
      assaultLegToesRightDigits: getCheckedValues('assaultLegToesRightDigits'),
      assaultLowerExtSigns: getCheckedValues('assaultLowerExtSigns'),

      assaultParentOther: getChecked('assaultParentOther'),
      assaultOtherLocationDetail: getText('assaultOtherLocationDetail'),

      assaultSystemicSigns: getCheckedValues('assaultSystemicSigns'),
      painScore: assaultPainScoreTouched ? parseInt(document.getElementById('assaultPainScore')?.value || '0', 10) : null,
      assaultOsccScreen: getRadioValue('assaultOsccScreen'),
      assaultAnticoagulantHx: getRadioValue('assaultAnticoagulantHx'),
      assaultTetanusHx: getRadioValue('assaultTetanusHx'),
      ...(() => {
        const inj = {};
        const pMap = {
          Head: getChecked('assaultParentHeadFace'), Neck: getChecked('assaultParentNeck'),
          Chest: getChecked('assaultParentChest'), Abd: getChecked('assaultParentAbdomen'),
          Arm: getChecked('assaultParentUpperExtremity'), Leg: getChecked('assaultParentLowerExtremity')
        };
        ["assaultHeadScalp","assaultHeadFace","assaultHeadEye","assaultHeadEar","assaultHeadNoseMouth","assaultNeckFront","assaultNeckSide","assaultNeckBack","assaultChestFront","assaultChestClavicle","assaultChestBack","assaultAbdFront","assaultAbdFlank","assaultAbdLowBack","assaultAbdButtock","assaultAbdGroinGenitalia","assaultArmShoulder","assaultArmElbowForearm","assaultArmWristHand","assaultArmFingers","assaultLegThigh","assaultLegKneeShinCalf","assaultLegAnkleFoot","assaultLegToes"].forEach(id => {
          const pKey = Object.keys(pMap).find(k => id.startsWith('assault' + k));
          const pActive = pKey ? pMap[pKey] : true;
          inj[id + 'Injuries'] = (pActive && getChecked(id)) ? getCheckedValues(id + 'Injuries') : [];
        });
        return inj;
      })(),
      ...(isAssaultFemaleCtx(ctx) ? {
        assaultLmpDate: getText('assaultLmpDate'),
        assaultPregnancyStatus: getRadioValue('assaultPregnancyStatus') || ''
      } : {})
    };

    updateAssaultOutputs(rec);
    return rec;
  },

  collectFormData(ctx = {}) {
    return this.collectIntake(ctx);
  },

  // --- Form Hydration Hook ---
  hydrateForm(patient) {
    this.clearForm();
    if (!patient) return;

    if (patient.durationVal) {
      const valEl = document.getElementById('assaultDurationVal');
      if (valEl) valEl.value = patient.durationVal;
    }
    if (patient.durationUnit) {
      const unitEl = document.getElementById('assaultDurationUnit');
      if (unitEl) unitEl.value = patient.durationUnit;
    }

    const setCheckedValues = (name, arr) => {
      if (!Array.isArray(arr)) return;
      document.querySelectorAll(`input[name="${name}"]`).forEach(cb => {
        cb.checked = arr.includes(cb.value);
      });
    };
    const setRadioValue = (name, val) => {
      if (!val) return;
      const rb = document.querySelector(`input[name="${name}"][value="${val}"]`);
      if (rb) rb.checked = true;
    };
    const setChecked = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.checked = !!val;
    };
    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el && val !== undefined && val !== null) el.value = val;
    };

    setCheckedValues('assaultMechanisms', patient.assaultMechanisms);
    setText('assaultBluntDetail', patient.assaultBluntDetail);
    setText('assaultSharpDetail', patient.assaultSharpDetail);
    setText('assaultChemicalDetail', patient.assaultChemicalDetail);
    setText('assaultOtherMechDetail', patient.assaultOtherMechDetail);
    setRadioValue('assaultBleedingStatus', patient.assaultBleedingStatus);

    // Anatomy
    setChecked('assaultParentHeadFace', patient.assaultParentHeadFace);
    setChecked('assaultHeadScalp', patient.assaultHeadScalp);
    setCheckedValues('assaultHeadScalpSides', patient.assaultHeadScalpSides);
    setChecked('assaultHeadFace', patient.assaultHeadFace);
    setCheckedValues('assaultHeadFaceSides', patient.assaultHeadFaceSides);
    setChecked('assaultHeadEye', patient.assaultHeadEye);
    setCheckedValues('assaultHeadEyeSides', patient.assaultHeadEyeSides);
    setChecked('assaultHeadEar', patient.assaultHeadEar);
    setCheckedValues('assaultHeadEarSides', patient.assaultHeadEarSides);
    setChecked('assaultHeadNoseMouth', patient.assaultHeadNoseMouth);
    setCheckedValues('assaultHeadNoseMouthSides', patient.assaultHeadNoseMouthSides);
    const headSignsHydrate = Array.isArray(patient.assaultHeadSigns)
      ? patient.assaultHeadSigns.flatMap(s => (s === 'malocclusion_tooth_avulsion' ? ['malocclusion_jaw_locked', 'broken_loose_tooth'] : [s]))
      : [];
    setCheckedValues('assaultHeadSigns', headSignsHydrate);

    setChecked('assaultParentNeck', patient.assaultParentNeck);
    setChecked('assaultNeckFront', patient.assaultNeckFront);
    setCheckedValues('assaultNeckFrontSides', patient.assaultNeckFrontSides);
    setChecked('assaultNeckSide', patient.assaultNeckSide);
    setCheckedValues('assaultNeckSideSides', patient.assaultNeckSideSides);
    setChecked('assaultNeckBack', patient.assaultNeckBack);
    setCheckedValues('assaultNeckBackSides', patient.assaultNeckBackSides);
    setCheckedValues('assaultNeckSigns', patient.assaultNeckSigns);

    setChecked('assaultParentChest', patient.assaultParentChest);
    setChecked('assaultChestFront', patient.assaultChestFront);
    setCheckedValues('assaultChestFrontSides', patient.assaultChestFrontSides);
    setChecked('assaultChestClavicle', patient.assaultChestClavicle);
    setCheckedValues('assaultChestClavicleSides', patient.assaultChestClavicleSides);
    setChecked('assaultChestBack', patient.assaultChestBack);
    setCheckedValues('assaultChestBackSides', patient.assaultChestBackSides);
    setCheckedValues('assaultChestSigns', patient.assaultChestSigns);

    setChecked('assaultParentAbdomen', patient.assaultParentAbdomen);
    setChecked('assaultAbdFront', patient.assaultAbdFront);
    setCheckedValues('assaultAbdFrontSides', patient.assaultAbdFrontSides);
    setChecked('assaultAbdFlank', patient.assaultAbdFlank);
    setCheckedValues('assaultAbdFlankSides', patient.assaultAbdFlankSides);
    setChecked('assaultAbdLowBack', patient.assaultAbdLowBack);
    setCheckedValues('assaultAbdLowBackSides', patient.assaultAbdLowBackSides);
    setChecked('assaultAbdButtock', patient.assaultAbdButtock);
    setCheckedValues('assaultAbdButtockSides', patient.assaultAbdButtockSides);
    setChecked('assaultAbdGroinGenitalia', patient.assaultAbdGroinGenitalia);
    setCheckedValues('assaultAbdGroinGenitaliaSides', patient.assaultAbdGroinGenitaliaSides);
    setCheckedValues('assaultAbdSigns', patient.assaultAbdSigns);

    setChecked('assaultParentUpperExtremity', patient.assaultParentUpperExtremity);
    setChecked('assaultArmShoulder', patient.assaultArmShoulder);
    setCheckedValues('assaultArmShoulderSides', patient.assaultArmShoulderSides);
    setChecked('assaultArmElbowForearm', patient.assaultArmElbowForearm);
    setCheckedValues('assaultArmElbowForearmSides', patient.assaultArmElbowForearmSides);
    setChecked('assaultArmWristHand', patient.assaultArmWristHand);
    setCheckedValues('assaultArmWristHandSides', patient.assaultArmWristHandSides);
    setChecked('assaultArmFingers', patient.assaultArmFingers);
    setCheckedValues('assaultArmFingersLeftDigits', patient.assaultArmFingersLeftDigits);
    setCheckedValues('assaultArmFingersRightDigits', patient.assaultArmFingersRightDigits);
    setCheckedValues('assaultUpperExtSigns', patient.assaultUpperExtSigns);

    setChecked('assaultParentLowerExtremity', patient.assaultParentLowerExtremity);
    setChecked('assaultLegThigh', patient.assaultLegThigh);
    setCheckedValues('assaultLegThighSides', patient.assaultLegThighSides);
    setChecked('assaultLegKneeShinCalf', patient.assaultLegKneeShinCalf);
    setCheckedValues('assaultLegKneeShinCalfSides', patient.assaultLegKneeShinCalfSides);
    setChecked('assaultLegAnkleFoot', patient.assaultLegAnkleFoot);
    setCheckedValues('assaultLegAnkleFootSides', patient.assaultLegAnkleFootSides);
    setChecked('assaultLegToes', patient.assaultLegToes);
    setCheckedValues('assaultLegToesLeftDigits', patient.assaultLegToesLeftDigits);
    setCheckedValues('assaultLegToesRightDigits', patient.assaultLegToesRightDigits);
    setCheckedValues('assaultLowerExtSigns', patient.assaultLowerExtSigns);

    setChecked('assaultParentOther', patient.assaultParentOther);
    setText('assaultOtherLocationDetail', patient.assaultOtherLocationDetail);

    setCheckedValues('assaultSystemicSigns', patient.assaultSystemicSigns);
    setRadioValue('assaultOsccScreen', patient.assaultOsccScreen);
    setRadioValue('assaultAnticoagulantHx', patient.assaultAnticoagulantHx);
    const legacyTetanusMap = { more_than_10_years: 'over_10_years', never_or_unsure: 'unknown_or_never' };
    setRadioValue('assaultTetanusHx', legacyTetanusMap[patient.assaultTetanusHx] || patient.assaultTetanusHx);
    ["assaultHeadScalp","assaultHeadFace","assaultHeadEye","assaultHeadEar","assaultHeadNoseMouth","assaultNeckFront","assaultNeckSide","assaultNeckBack","assaultChestFront","assaultChestClavicle","assaultChestBack","assaultAbdFront","assaultAbdFlank","assaultAbdLowBack","assaultAbdButtock","assaultAbdGroinGenitalia","assaultArmShoulder","assaultArmElbowForearm","assaultArmWristHand","assaultArmFingers","assaultLegThigh","assaultLegKneeShinCalf","assaultLegAnkleFoot","assaultLegToes"].forEach(id => setCheckedValues(id + 'Injuries', patient[id + 'Injuries']));
    setText('physical_assault_other_free', patient.otherSymptomsFree);
    const isFem = isAssaultFemalePatient(patient);
    toggleAssaultFemaleSection(isFem);
    if (isFem) {
      setText('assaultLmpDate', patient.assaultLmpDate || '');
      setRadioValue('assaultPregnancyStatus', patient.assaultPregnancyStatus || '');
    }
    checkAndDisplayAssaultLmp(patient);

    // Refresh UI display states
    handleAssaultMechanismChange();

    toggleAssaultGroup('assaultHeadFaceSubGroup', patient.assaultParentHeadFace);
    toggleAssaultGroup('assaultHeadScalpSidesContainer', patient.assaultHeadScalp);
    toggleAssaultGroup('assaultHeadFaceSidesContainer', patient.assaultHeadFace);
    toggleAssaultGroup('assaultHeadEyeSidesContainer', patient.assaultHeadEye);
    toggleAssaultGroup('assaultHeadEarSidesContainer', patient.assaultHeadEar);
    toggleAssaultGroup('assaultHeadNoseMouthSidesContainer', patient.assaultHeadNoseMouth);

    toggleAssaultGroup('assaultNeckSubGroup', patient.assaultParentNeck);
    toggleAssaultGroup('assaultNeckFrontSidesContainer', patient.assaultNeckFront);
    toggleAssaultGroup('assaultNeckSideSidesContainer', patient.assaultNeckSide);
    toggleAssaultGroup('assaultNeckBackSidesContainer', patient.assaultNeckBack);

    toggleAssaultGroup('assaultChestSubGroup', patient.assaultParentChest);
    toggleAssaultGroup('assaultChestFrontSidesContainer', patient.assaultChestFront);
    toggleAssaultGroup('assaultChestClavicleSidesContainer', patient.assaultChestClavicle);
    toggleAssaultGroup('assaultChestBackSidesContainer', patient.assaultChestBack);

    toggleAssaultGroup('assaultAbdomenSubGroup', patient.assaultParentAbdomen);
    toggleAssaultGroup('assaultAbdFrontSidesContainer', patient.assaultAbdFront);
    toggleAssaultGroup('assaultAbdFlankSidesContainer', patient.assaultAbdFlank);
    toggleAssaultGroup('assaultAbdLowBackSidesContainer', patient.assaultAbdLowBack);
    toggleAssaultGroup('assaultAbdButtockSidesContainer', patient.assaultAbdButtock);
    toggleAssaultGroup('assaultAbdGroinGenitaliaSidesContainer', patient.assaultAbdGroinGenitalia);

    toggleAssaultGroup('assaultUpperExtSubGroup', patient.assaultParentUpperExtremity);
    toggleAssaultGroup('assaultArmShoulderSidesContainer', patient.assaultArmShoulder);
    toggleAssaultGroup('assaultArmElbowForearmSidesContainer', patient.assaultArmElbowForearm);
    toggleAssaultGroup('assaultArmWristHandSidesContainer', patient.assaultArmWristHand);
    toggleAssaultGroup('assaultArmFingersSidesContainer', patient.assaultArmFingers);

    toggleAssaultGroup('assaultLowerExtSubGroup', patient.assaultParentLowerExtremity);
    toggleAssaultGroup('assaultLegThighSidesContainer', patient.assaultLegThigh);
    toggleAssaultGroup('assaultLegKneeShinCalfSidesContainer', patient.assaultLegKneeShinCalf);
    toggleAssaultGroup('assaultLegAnkleFootSidesContainer', patient.assaultLegAnkleFoot);
    toggleAssaultGroup('assaultLegToesSidesContainer', patient.assaultLegToes);

    toggleAssaultGroup('assaultOtherSubGroup', patient.assaultParentOther);

    if (patient.painScore !== null && patient.painScore !== undefined) {
      handleAssaultPainScoreChange(patient.painScore);
    } else {
      clearAssaultPainScore();
    }
  },

  populateForm(patient) {
    this.hydrateForm(patient);
  },

  // --- Form Reset Hook ---
  clearForm() {
    const sec = document.getElementById(this.sectionDomId);
    if (!sec) return;
    sec.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    sec.querySelectorAll('input[type="radio"]').forEach(rb => { rb.checked = false; });
    sec.querySelectorAll('input[type="text"], textarea').forEach(ti => { ti.value = ''; });
    sec.querySelectorAll('select').forEach(sel => { sel.selectedIndex = 0; });
    sec.querySelectorAll('input[type="number"]').forEach(ni => { ni.value = ''; });

    ['assaultDurationVal', 'assaultBluntDetail', 'assaultSharpDetail', 'assaultChemicalDetail', 'assaultOtherMechDetail', 'assaultOtherLocationDetail'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = '';
    });
    const durUnit = document.getElementById('assaultDurationUnit');
    if (durUnit) durUnit.value = 'hours';

    const hiddenContainers = [
      'assaultBluntDetailContainer', 'assaultSharpDetailContainer', 'assaultChemicalDetailContainer', 'assaultOtherMechDetailContainer',
      'assaultHeadFaceSubGroup', 'assaultHeadScalpSidesContainer', 'assaultHeadFaceSidesContainer', 'assaultHeadEyeSidesContainer', 'assaultHeadEarSidesContainer', 'assaultHeadNoseMouthSidesContainer',
      'assaultNeckSubGroup', 'assaultNeckFrontSidesContainer', 'assaultNeckSideSidesContainer', 'assaultNeckBackSidesContainer',
      'assaultChestSubGroup', 'assaultChestFrontSidesContainer', 'assaultChestClavicleSidesContainer', 'assaultChestBackSidesContainer',
      'assaultAbdomenSubGroup', 'assaultAbdFrontSidesContainer', 'assaultAbdFlankSidesContainer', 'assaultAbdLowBackSidesContainer', 'assaultAbdButtockSidesContainer', 'assaultAbdGroinGenitaliaSidesContainer',
      'assaultUpperExtSubGroup', 'assaultArmShoulderSidesContainer', 'assaultArmElbowForearmSidesContainer', 'assaultArmWristHandSidesContainer', 'assaultArmFingersSidesContainer',
      'assaultLowerExtSubGroup', 'assaultLegThighSidesContainer', 'assaultLegKneeShinCalfSidesContainer', 'assaultLegAnkleFootSidesContainer', 'assaultLegToesSidesContainer',
      'assaultOtherSubGroup', 'assaultFemaleSection'
    ];
    hiddenContainers.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });

    clearAssaultPainScore();
  },

  // --- Evaluation & CDS Interface ---
  isRedFlag(patient) {
    const rfs = evaluateAssaultRedFlags(patient);
    return rfs.length > 0;
  },

  evaluateRedFlags(patient) {
    return evaluateAssaultRedFlags(patient);
  },

  updateOutputs(patient) {
    return updateAssaultOutputs(patient);
  },

  renderRapidHpi(patient) {
    return renderAssaultRapidHpi(patient);
  },

  renderNarrativeHpi(patient) {
    return renderAssaultNarrativeHpi(patient);
  },

  // --- Standardized Seed Cases (บริบทประเทศไทย) ---
  seedPatients: [
    // Case 1: Penetrating Stab Wound to Left Chest & Abdomen with Shock (ESI 1)
    {
      id: 'case-assault-01', queue_number: 'E1-109', hn: '8901801',
      name: 'นายเอกชัย ถูกแทงชายโครงซ้ายและหน้าท้องมีแผลป้องกันตัวมือซ้ายหน้ามืดเหงื่อแตกตัวเย็น', age: 28, gender: 'ชาย',
      chief_complaint: 'physical_assault', chief_complaint_title: 'ถูกทำร้ายร่างกาย',
      timestamp: '2026-11-09T18:30:00.000Z', status: 'waiting',
      durationVal: 30, durationUnit: 'minutes', hospRecordStatus: 'self', underlying: [], drugAllergy: 'ปฏิเสธ', currentMeds: 'ไม่มี',
      otherSymptomsFree: 'ถูกคู่อริใช้มีดพกแทงที่ชายโครงซ้ายและหน้าท้องซ้าย เลือดไหลออกมาก มีแผลถูกบาดที่ฝ่ามือและนิ้วมือซ้ายจากการยกมือบัง หายใจเหนื่อยหอบ ปวดท้องมาก หน้ามืดเหงื่อแตกตัวเย็น',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.5, sbp: 86, dbp: 52, bp: '86/52', pr: 126, rr: 28, spo2: 92 },
      esi_level: 1,
      assaultMechanisms: ['sharp_weapon'], assaultSharpDetail: 'มีดพกปลายแหลม', assaultBleedingStatus: 'active_spurting_profuse',
      assaultParentHeadFace: false, assaultParentNeck: false,
      assaultParentChest: true, assaultChestFront: true, assaultChestFrontSides: ['left'], assaultChestClavicle: false, assaultChestBack: false,
      assaultChestSigns: ['dyspnea_chest_tightness', 'penetrating_chest_wound'],
      assaultParentAbdomen: true, assaultAbdFront: true, assaultAbdFrontSides: ['left'], assaultAbdFlank: false, assaultAbdLowBack: false, assaultAbdButtock: false, assaultAbdGroinGenitalia: false,
      assaultAbdSigns: ['severe_abd_pain_distension', 'penetrating_abd_wound'],
      assaultParentUpperExtremity: true, assaultArmShoulder: false, assaultArmElbowForearm: false, assaultArmWristHand: true, assaultArmWristHandSides: ['left'],
      assaultArmFingers: true, assaultArmFingersLeftDigits: ['index', 'middle'], assaultArmFingersRightDigits: [],
      assaultUpperExtSigns: ['tendon_injury_inability_to_move'],
      assaultParentLowerExtremity: false, assaultParentOther: false,
      assaultSystemicSigns: ['presyncope_dizziness', 'palpitation_cold_sweat_pallor'],
      painScore: 9, assaultOsccScreen: 'general_assault', assaultAnticoagulantHx: 'no_anticoagulant', assaultTetanusHx: 'over_10_years'
    },

    // Case 2: Domestic Violence with Strangulation / Choking & Hoarseness (ESI 2)
    {
      id: 'case-assault-02', queue_number: 'E2-110', hn: '8901802',
      name: 'นางวราภรณ์ ถูกสามีบีบคอและชกหน้าซ้ายเสียงแหบกลืนลำบากกังวลความปลอดภัย', age: 34, gender: 'หญิง',
      chief_complaint: 'physical_assault', chief_complaint_title: 'ถูกทำร้ายร่างกาย',
      timestamp: '2026-11-09T18:45:00.000Z', status: 'waiting',
      durationVal: 2, durationUnit: 'hours', hospRecordStatus: 'self', underlying: [], drugAllergy: 'ปฏิเสธ', currentMeds: 'ไม่มี',
      otherSymptomsFree: 'มีปากเสียงถูกสามีใช้สองมือบีบคอแน่นและชกที่โหนกแก้มซ้าย หลังเกิดเหตุมีอาการเจ็บในลำคอมาก กลืนน้ำลายลำบาก เสียงแหบพร่า อึดอัดแน่นคอ มีรอยเขียวช้ำรอบคอด้านหน้า กังวลความปลอดภัยหากต้องกลับบ้าน',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.8, sbp: 138, dbp: 86, bp: '138/86', pr: 102, rr: 22, spo2: 97 },
      esi_level: 2,
      assaultMechanisms: ['strangulation_choking', 'physical_force'], assaultBleedingStatus: 'none_or_contusion',
      assaultParentHeadFace: true, assaultHeadScalp: false, assaultHeadFace: true, assaultHeadFaceSides: ['left'], assaultHeadEye: false, assaultHeadEar: false, assaultHeadNoseMouth: false, assaultHeadSigns: [],
      assaultParentNeck: true, assaultNeckFront: true, assaultNeckFrontSides: ['center'], assaultNeckSide: true, assaultNeckSideSides: ['left', 'right'], assaultNeckBack: false,
      assaultNeckSigns: ['strangulation_dysphonia_dysphagia'],
      assaultParentChest: false, assaultParentAbdomen: false, assaultParentUpperExtremity: false, assaultParentLowerExtremity: false, assaultParentOther: false,
      assaultSystemicSigns: ['no_systemic_signs'],
      painScore: 7, assaultOsccScreen: 'domestic_violence', assaultAnticoagulantHx: 'no_anticoagulant', assaultTetanusHx: 'within_5_years'
    },

    // Case 3: Blunt Head & Facial Assault with Brief LOC & Diplopia (ESI 2)
    {
      id: 'case-assault-03', queue_number: 'E2-111', hn: '8901803',
      name: 'นายธีระพล ถูกตีด้วยไม้เบสบอลที่ศีรษะและเบ้าตาขวาสลบชั่วขณะมองเห็นภาพซ้อน', age: 45, gender: 'ชาย',
      chief_complaint: 'physical_assault', chief_complaint_title: 'ถูกทำร้ายร่างกาย',
      timestamp: '2026-11-09T19:00:00.000Z', status: 'waiting',
      durationVal: 1, durationUnit: 'hours', hospRecordStatus: 'self', underlying: ['ความดันสูง (HT)'], drugAllergy: 'ปฏิเสธ', currentMeds: 'Amlodipine',
      otherSymptomsFree: 'ถูกรุมทำร้ายโดยใช้ไม้ตีเข้าที่ศีรษะและเบ้าตาขวา มีสลบไปประมาณ 1 นาที ฟื้นขึ้นมาจำเหตุการณ์ตอนถูกตีไม่ได้ ปวดศีรษะมาก คลื่นไส้อาเจียน 1 ครั้ง เบ้าตาขวาบวมช้ำตามัวมองเห็นภาพซ้อน',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 37.0, sbp: 146, dbp: 90, bp: '146/90', pr: 84, rr: 18, spo2: 99 },
      esi_level: 2,
      assaultMechanisms: ['blunt_weapon', 'physical_force'], assaultBluntDetail: 'ไม้เบสบอล', assaultBleedingStatus: 'abrasion_or_stopped',
      assaultParentHeadFace: true, assaultHeadScalp: true, assaultHeadScalpSides: ['right'], assaultHeadFace: true, assaultHeadFaceSides: ['right'],
      assaultHeadEye: true, assaultHeadEyeSides: ['right'], assaultHeadEar: false, assaultHeadNoseMouth: false,
      assaultHeadSigns: ['loc_amnesia', 'severe_headache_vomiting', 'diplopia_blurred_vision'],
      assaultParentNeck: false, assaultParentChest: false, assaultParentAbdomen: false, assaultParentUpperExtremity: false, assaultParentLowerExtremity: false, assaultParentOther: false,
      assaultSystemicSigns: ['no_systemic_signs'],
      painScore: 8, assaultOsccScreen: 'general_assault', assaultAnticoagulantHx: 'no_anticoagulant', assaultTetanusHx: '5_to_10_years'
    },

    // Case 4: Minor Blunt Assault with Contusion & Superficial Abrasion (ESI 4)
    {
      id: 'case-assault-04', queue_number: 'E4-112', hn: '8901804',
      name: 'นายกิตติกร ถูกชกต่อยมีรอยฟกช้ำที่ต้นแขนซ้ายและแผลถลอกศอกขวาไม่มีสลบ', age: 22, gender: 'ชาย',
      chief_complaint: 'physical_assault', chief_complaint_title: 'ถูกทำร้ายร่างกาย',
      timestamp: '2026-11-09T19:20:00.000Z', status: 'waiting',
      durationVal: 3, durationUnit: 'hours', hospRecordStatus: 'self', underlying: [], drugAllergy: 'ปฏิเสธ', currentMeds: 'ไม่มี',
      otherSymptomsFree: 'มีเรื่องชกต่อยกับเพื่อน ถูกชกที่ต้นแขนซ้าย 2-3 ครั้ง และล้มมีแผลถลอกที่ข้อศอกขวา เลือดหยุดไหลแล้ว ไม่สลบ ไม่ปวดศีรษะ ไม่เจ็บคอ ไม่ปวดท้อง ขยับแขนและนิ้วมือได้ปกติ',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.6, sbp: 122, dbp: 76, bp: '122/76', pr: 78, rr: 16, spo2: 99 },
      esi_level: 4,
      assaultMechanisms: ['physical_force'], assaultBleedingStatus: 'abrasion_or_stopped',
      assaultParentHeadFace: false, assaultParentNeck: false, assaultParentChest: false, assaultParentAbdomen: false,
      assaultParentUpperExtremity: true, assaultArmShoulder: true, assaultArmShoulderSides: ['left'], assaultArmElbowForearm: true, assaultArmElbowForearmSides: ['right'],
      assaultArmWristHand: false, assaultArmFingers: false, assaultUpperExtSigns: [],
      assaultParentLowerExtremity: false, assaultParentOther: false,
      assaultSystemicSigns: ['no_systemic_signs'],
      painScore: 4, assaultOsccScreen: 'general_assault', assaultAnticoagulantHx: 'no_anticoagulant', assaultTetanusHx: 'within_5_years'
    }
  ]
};

// Register module in Ratchaburi ER Core Registry
if (typeof registerCcModule === 'function') registerCcModule(physicalAssaultModule);
else if (typeof window !== 'undefined' && typeof window.registerCcModule === 'function') window.registerCcModule(physicalAssaultModule);

if (typeof module !== 'undefined' && module.exports) {
  module.exports = physicalAssaultModule;
}
