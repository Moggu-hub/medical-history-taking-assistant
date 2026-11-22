// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 31_traffic_accident.js
// อาการนำ: ได้รับบาดเจ็บจากอุบัติเหตุจราจร (Traffic Accident Injury)
// รองรับ ATLS Criteria, Context-Aware Dynamic Branching (1.3),
// 7 ตำแหน่งร่างกาย + ด้าน (ซ้าย/ขวา/กลาง) + ชนิดการบาดเจ็บ (แผล/ปวดบวม/ผิดรูป),
// Female LMP Auto-detection, NPO Time, Pain Slider, และ Core Guard TDD 100%
// =========================================================================

// --- Module-scoped State & Helpers ---
let trafficPainScoreTouched = false;

function wrapTrafficWords(chunks) {
  if (!Array.isArray(chunks)) return chunks;
  return chunks.map(c => `<span class="inline-block whitespace-nowrap">${c}</span>`).join(' ');
}

function renderTrafficOption(cfg) {
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
  const titleHtml = Array.isArray(title) ? wrapTrafficWords(title) : title;
  const bodyHtml = desc
    ? `<div class="ml-3 leading-snug"><span class="block text-xs sm:text-sm font-semibold text-slate-800">${titleHtml}</span><span class="block text-xs text-slate-500 font-normal mt-0.5">${desc}</span></div>`
    : `<span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800 leading-snug">${titleHtml}</span>`;
  return `<label class="selectable-card bg-white flex ${alignCls} ${padCls} rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition${spanCls}"><input type="${kind}" ${idAttr}${nameAttr}${valAttr}${chgAttr}class="${topCls}${roundCls}text-medical-600 focus:ring-medical-500 ${szCls} flex-shrink-0">${bodyHtml}</label>`;
}

function renderTrafficGrid(colsCls, items, shared = {}) {
  return `<div class="grid ${colsCls} gap-2.5">${items.map(it => renderTrafficOption({ ...shared, ...it })).join('\n')}</div>`;
}

function renderTrafficSysHeader({
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

function handleTrafficGroupNoneToggle(noneEl, inputName) {
  if (!noneEl || !noneEl.checked || typeof document === 'undefined') return;
  document.querySelectorAll(`input[name="${inputName}"]`).forEach(cb => {
    if (cb !== noneEl) cb.checked = false;
  });
}

function handleTrafficGroupItemChange(itemEl, noneId) {
  if (!itemEl || !itemEl.checked || !noneId || typeof document === 'undefined') return;
  const noneEl = document.getElementById(noneId);
  if (noneEl) noneEl.checked = false;
}

function renderTrafficPart(id, label, hasCenter = false, deformLabel = 'ผิดรูป') {
  return `<div class="p-2.5 rounded-xl border border-slate-200 bg-white">
  <label class="flex items-center cursor-pointer">
    <input type="checkbox" id="${id}" name="${id}" onchange="toggleTrafficGroup('${id}Detail', this.checked)" class="text-medical-600 h-4 w-4 rounded flex-shrink-0">
    <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">${label}</span>
  </label>
  <div id="${id}Detail" class="hidden mt-2 pl-6 flex flex-col gap-1.5 text-xs border-t border-slate-100 pt-2">
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
      <label class="inline-flex items-center cursor-pointer"><input type="checkbox" name="${id}Injuries" value="deformity" class="mr-1 text-medical-600 rounded"> ${deformLabel}</label>
    </div>
  </div>
</div>`;
}

function renderTrafficDigits(prefix, label) {
  const digits = [['thumb', 'โป้ง'], ['index', 'ชี้'], ['middle', 'กลาง'], ['ring', 'นาง'], ['little', 'ก้อย']];
  const row = (side, sl) => `<div class="flex items-center flex-wrap gap-2"><span class="text-xs font-semibold text-slate-500 w-9">${sl}:</span>${digits.map(([k, th]) => `<label class="inline-flex items-center cursor-pointer"><input type="checkbox" name="${prefix}${side}Digits" value="${k}" class="mr-1 text-medical-600 rounded"> ${th}</label>`).join('')}</div>`;
  return `<div class="p-2.5 rounded-xl border border-slate-200 bg-white">
  <label class="flex items-center cursor-pointer">
    <input type="checkbox" id="${prefix}" name="${prefix}" onchange="toggleTrafficGroup('${prefix}Detail', this.checked)" class="text-medical-600 h-4 w-4 rounded flex-shrink-0">
    <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">${label}</span>
  </label>
  <div id="${prefix}Detail" class="hidden mt-2 pl-6 flex flex-col gap-1.5 text-xs border-t border-slate-100 pt-2">
    ${row('Left', 'ซ้าย')}${row('Right', 'ขวา')}
    <div class="flex items-center flex-wrap gap-x-3 gap-y-1 pt-1 border-t border-slate-50">
      <span class="text-xs font-semibold text-slate-500">ลักษณะบาดเจ็บ:</span>
      <label class="inline-flex items-center cursor-pointer"><input type="checkbox" name="${prefix}Injuries" value="wound" class="mr-1 text-medical-600 rounded"> มีแผล</label>
      <label class="inline-flex items-center cursor-pointer"><input type="checkbox" name="${prefix}Injuries" value="pain_swelling" class="mr-1 text-medical-600 rounded"> ปวด/บวม</label>
      <label class="inline-flex items-center cursor-pointer"><input type="checkbox" name="${prefix}Injuries" value="deformity" class="mr-1 text-medical-600 rounded"> ผิดรูป</label>
    </div>
  </div>
</div>`;
}

function renderTrafficRegionBox({
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
      <input type="checkbox" id="${parentId}" onchange="toggleTrafficGroup('${subGroupId}', this.checked)" class="text-medical-600 focus:ring-medical-500 h-5 w-5 rounded flex-shrink-0">
      <div class="ml-3 leading-snug">
        <span class="text-xs sm:text-sm font-bold text-slate-900">${Array.isArray(title) ? wrapTrafficWords(title) : title}</span>
        ${desc ? `<p class="text-xs text-slate-500 mt-0.5">${desc}</p>` : ''}
      </div>
    </label>
    <div id="${subGroupId}" class="hidden pl-4 sm:pl-6 space-y-4 border-l-2 border-medical-200">
      <div>
        <p class="text-xs sm:text-sm text-slate-700 font-semibold mb-2">จุดที่บาดเจ็บ (เลือกแล้วระบุด้านและลักษณะบาดเจ็บ):</p>
        <div class="space-y-2">${partsHtml}</div>
      </div>
      <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
        ${renderTrafficSysHeader({
          label: 'อาการสำคัญที่พบร่วมด้วย (เลือกได้หลายข้อ)',
          icon: 'alert-circle',
          colorClass: 'bg-amber-100 text-amber-700',
          toggleId: signsNoneId,
          toggleLabel: 'ไม่มีอาการร่วม',
          toggleOnchange: `handleTrafficGroupNoneToggle(this, '${signsName}')`
        })}
        ${renderTrafficGrid(signsCols, signs, {
          name: signsName,
          compact: true,
          onchange: `handleTrafficGroupItemChange(this, '${signsNoneId}')`
        })}
      </div>
    </div>
  </div>`;
}

function toggleTrafficGroup(subId, show) {
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

function handleTrafficVehicleChange() {
  const checked = document.querySelector('input[name="trafficVehicleRole"]:checked');
  const role = checked ? checked.value : '';

  toggleTrafficGroup('trafficBranchMotorcycle', role === 'motorcycle');
  toggleTrafficGroup('trafficBranchCarTruck', role === 'car_truck');
  toggleTrafficGroup('trafficBranchPedestrian', role === 'pedestrian');
  toggleTrafficGroup('trafficBranchBicycleScooter', role === 'bicycle_scooter');
  toggleTrafficGroup('trafficBranchOtherVehicle', role === 'other_vehicle');
}

function handleTrafficMotoCollisionChange() {
  const cb = document.querySelector('input[name="trafficMotoMechs"][value="collision_vehicle"]');
  toggleTrafficGroup('trafficMotoOpponentContainer', cb && cb.checked);
}

function handleTrafficCarCollisionChange() {
  const cb = document.querySelector('input[name="trafficCarMechs"][value="high_impact_collision"]');
  toggleTrafficGroup('trafficCarOpponentContainer', cb && cb.checked);
}

function handleTrafficPedVehicleChange() {
  const otherRb = document.querySelector('input[name="trafficPedVehicleType"][value="other_vehicle"]');
  toggleTrafficGroup('trafficPedOtherContainer', otherRb && otherRb.checked);
}

function handleTrafficOtherVehicleCollisionChange() {
  const cb = document.querySelector('input[name="trafficOtherVehicleMechs"][value="collision_other"]');
  toggleTrafficGroup('trafficOtherOpponentContainer', cb && cb.checked);
}

function isTrafficFemalePatient(p) {
  if (!p) return false;
  if (p.gender === 'หญิง' || p.gender === 'female') return true;
  if (p.gender === 'ชาย' || p.gender === 'male') return false;
  const label = `${p.patientTitle || ''} ${p.name || p.patientName || ''}`;
  return /นาง|น\.ส\.|ด\.ญ\.|\(หญิง\)|Mrs|Miss|Ms/i.test(label);
}

function isTrafficFemaleCtx(ctx = {}) {
  if (ctx.gender === 'หญิง' || ctx.gender === 'female') return true;
  if (ctx.gender === 'ชาย' || ctx.gender === 'male') return false;
  if (ctx.patientTitle || ctx.title || ctx.name || ctx.patientName) return isTrafficFemalePatient(ctx);
  const femSec = typeof document !== 'undefined' ? document.getElementById('trafficFemaleSection') : null;
  if (femSec && !femSec.classList.contains('hidden')) return true;
  if (typeof document === 'undefined') return false;
  const title = document.getElementById('patientTitleSelect')?.value || '';
  const name = document.getElementById('patientNameInput')?.value || '';
  const gender = document.getElementById('triageGenderSelect')?.value || '';
  return isTrafficFemalePatient({ gender, patientTitle: title, name });
}

function toggleTrafficFemaleSection(isFemale) {
  const femSec = document.getElementById('trafficFemaleSection');
  if (!femSec) return;
  femSec.classList.toggle('hidden', !isFemale);
  if (!isFemale) {
    const lmpEl = document.getElementById('trafficLmpDate');
    if (lmpEl) lmpEl.value = '';
    document.querySelectorAll('input[name="trafficPregnancyStatus"]').forEach(r => { r.checked = false; });
  }
}

function checkAndDisplayTrafficLmp(patient) {
  if (patient && (patient.gender || patient.name || patient.patientName || patient.patientTitle)) {
    toggleTrafficFemaleSection(isTrafficFemalePatient(patient));
    return;
  }
  const title = document.getElementById('patientTitleSelect')?.value || '';
  const name = document.getElementById('patientNameInput')?.value || '';
  const gender = document.getElementById('triageGenderSelect')?.value || '';
  toggleTrafficFemaleSection(gender === 'หญิง' || /นาง|น\.ส\.|ด\.ญ\.|\(หญิง\)|Mrs|Miss|Ms/i.test(`${title} ${name}`));
}

function clearTrafficPainScore() {
  trafficPainScoreTouched = false;
  const slider = document.getElementById('trafficPainScore');
  if (slider) slider.value = 0;
  const emojiEl = document.getElementById('trafficPainScoreEmoji');
  const textEl = document.getElementById('trafficPainScoreText');
  const badgeEl = document.getElementById('trafficPainScoreBadge');
  const clearBtn = document.getElementById('trafficPainScoreClearBtn');
  if (emojiEl) emojiEl.textContent = '⚪';
  if (textEl) textEl.textContent = 'ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)';
  if (badgeEl) badgeEl.className = 'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all';
  if (clearBtn) clearBtn.classList.add('hidden');
}

function handleTrafficPainScoreChange(val) {
  trafficPainScoreTouched = true;
  const num = parseInt(val, 10) || 0;
  const slider = document.getElementById('trafficPainScore');
  if (slider && String(slider.value) !== String(num)) slider.value = num;
  const emojiEl = document.getElementById('trafficPainScoreEmoji'), textEl = document.getElementById('trafficPainScoreText');
  const badgeEl = document.getElementById('trafficPainScoreBadge'), clearBtn = document.getElementById('trafficPainScoreClearBtn');
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
function setTrafficPainScore(score) { trafficPainScoreTouched = true; const s = document.getElementById('trafficPainScore'); if (s) s.value = score; handleTrafficPainScoreChange(score); }
if (typeof window !== 'undefined') {
  window.toggleTrafficGroup = toggleTrafficGroup;
  window.handleTrafficGroupNoneToggle = handleTrafficGroupNoneToggle;
  window.handleTrafficGroupItemChange = handleTrafficGroupItemChange;
  window.handleTrafficVehicleChange = handleTrafficVehicleChange;
  window.handleTrafficMotoCollisionChange = handleTrafficMotoCollisionChange;
  window.handleTrafficCarCollisionChange = handleTrafficCarCollisionChange;
  window.handleTrafficPedVehicleChange = handleTrafficPedVehicleChange;
  window.handleTrafficOtherVehicleCollisionChange = handleTrafficOtherVehicleCollisionChange;
  window.clearTrafficPainScore = clearTrafficPainScore;
  window.handleTrafficPainScoreChange = handleTrafficPainScoreChange;
  window.setTrafficPainScore = setTrafficPainScore;
}

// Formatters for Digits and Anatomy
function fmtTrafficDigits(leftDigits, rightDigits) {
  const digitNames = { thumb: 'นิ้วโป้ง', index: 'นิ้วชี้', middle: 'นิ้วกลาง', ring: 'นิ้วนาง', little: 'นิ้วก้อย' };
  const parts = [];
  if (Array.isArray(leftDigits) && leftDigits.length > 0) {
    parts.push(`ซ้าย: ${leftDigits.map(d => digitNames[d] || d).join(', ')}`);
  }
  if (Array.isArray(rightDigits) && rightDigits.length > 0) {
    parts.push(`ขวา: ${rightDigits.map(d => digitNames[d] || d).join(', ')}`);
  }
  return parts.length > 0 ? ` (${parts.join(' | ')})` : '';
}

function fmtTrafficSideAndInjury(sides, injuries) {
  const sideMap = { left: 'ซ้าย', right: 'ขวา', center: 'ตรงกลาง' };
  const injuryMap = { wound: 'มีแผล', pain_swelling: 'ปวด/บวม', deformity: 'ผิดรูป' };
  const sidePart = Array.isArray(sides) && sides.length > 0 ? sides.map(s => sideMap[s] || s).join('/') : '';
  const injPart = Array.isArray(injuries) && injuries.length > 0 ? injuries.map(i => injuryMap[i] || i).join('+') : '';
  if (sidePart && injPart) return ` [${sidePart} : ${injPart}]`;
  if (sidePart) return ` [ข้าง${sidePart}]`;
  if (injPart) return ` [${injPart}]`;
  return '';
}

function formatTrafficMechanism(patient) {
  const role = patient.trafficVehicleRole;
  if (role === 'motorcycle') {
    const roleTxt = patient.trafficMotoRole === 'passenger' ? 'ผู้ซ้อนท้าย จยย.' : (patient.trafficMotoRole === 'driver' ? 'ผู้ขับขี่ จยย.' : 'ผู้ประสบเหตุ จยย.');
    const helmetMap = { helmet_kept: 'สวมหมวกกันน็อก (ไม่หลุด)', helmet_ejected_damaged: 'สวมหมวกแต่วิบหลุด/แตก', no_helmet: 'ไม่ได้สวมหมวกกันน็อก' };
    const helmetTxt = helmetMap[patient.trafficMotoHelmet] || '';
    const mechs = Array.isArray(patient.trafficMotoMechs) ? patient.trafficMotoMechs : [];
    const mechNames = [];
    if (mechs.includes('lost_control_alone')) mechNames.push('ล้มเอง/แฉลบลื่นไถล');
    if (mechs.includes('collision_vehicle')) {
      const opps = Array.isArray(patient.trafficMotoOpponentTypes) ? patient.trafficMotoOpponentTypes : [];
      const oppMap = { motorcycle: 'จยย.', car_pickup_van: 'รถเก๋ง/กระบะ', truck_trailer_bus: 'รถบรรทุก/รถเมล์', other_opponent: patient.trafficMotoOpponentOtherDetail || 'อื่นๆ' };
      const oppTxt = opps.length > 0 ? ` (ชนกับ ${opps.map(o => oppMap[o] || o).join(', ')})` : ' (ชนรถคันอื่น)';
      mechNames.push(`ชนปะทะรถคันอื่น${oppTxt}`);
    }
    if (mechs.includes('collision_obstacle')) mechNames.push('ชนสิ่งกีดขวาง');
    if (mechs.includes('ejected_thrown')) mechNames.push('ร่างกระเด็นลอยตกจากรถ');
    if (mechs.includes('run_over_trapped')) mechNames.push('ถูกรถทับ/ติดใต้ท้องรถ');
    if (mechs.includes('severe_injury_fatality')) mechNames.push('มีผู้บาดเจ็บสาหัส/เสียชีวิต');
    return `${roleTxt}${helmetTxt ? ' • ' + helmetTxt : ''}${mechNames.length > 0 ? ' • ' + mechNames.join(', ') : ''}`;
  }
  if (role === 'car_truck') {
    const seatMap = { driver: 'คนขับ', front_passenger: 'นั่งข้างคนขับ (เบาะหน้า)', rear_passenger: 'โดยสารเบาะหลัง', cargo_bed: 'นั่งท้ายกระบะ' };
    const seatTxt = seatMap[patient.trafficCarRoleSeat] || 'ผู้ขับขี่/โดยสารรถยนต์';
    const beltMap = { belt_worn: 'คาดเข็มขัดนิรภัย', no_belt: 'ไม่ได้คาดเข็มขัดนิรภัย' };
    const beltTxt = beltMap[patient.trafficCarSeatbelt] || '';
    const vType = patient.trafficCarVehicleTypeDetail ? ` (${patient.trafficCarVehicleTypeDetail})` : '';
    const mechs = Array.isArray(patient.trafficCarMechs) ? patient.trafficCarMechs : [];
    const mechNames = [];
    if (mechs.includes('minor_collision')) mechNames.push('เฉี่ยวชนความเร็วไม่สูง');
    if (mechs.includes('high_impact_collision')) {
      const opp = patient.trafficCarOpponentDetail ? ` (ชน ${patient.trafficCarOpponentDetail})` : '';
      mechNames.push(`ชนปะทะรุนแรง${opp}`);
    }
    if (mechs.includes('airbag_deployed_windshield')) mechNames.push('Airbag ทำงาน/กระจกหน้าแตกยุบ');
    if (mechs.includes('rollover')) mechNames.push('รถพลิกคว่ำ');
    if (mechs.includes('ejected_from_vehicle')) mechNames.push('ร่างกระเด็นหลุดจากรถ/ตกท้ายกระบะ');
    if (mechs.includes('trapped_in_vehicle')) mechNames.push('ร่างติดในซากรถ (ใช้อุปกรณ์ตัดถ่าง)');
    if (mechs.includes('severe_injury_fatality')) mechNames.push('มีผู้บาดเจ็บสาหัส/เสียชีวิต');
    return `${seatTxt}${vType}${beltTxt ? ' • ' + beltTxt : ''}${mechNames.length > 0 ? ' • ' + mechNames.join(', ') : ''}`;
  }
  if (role === 'pedestrian') {
    const pedVMap = { motorcycle: 'รถจักรยานยนต์', car_pickup_van: 'รถเก๋ง/กระบะ/ตู้', truck_bus: 'รถขนาดใหญ่ (บรรทุก/เมล์)', other_vehicle: patient.trafficPedVehicleOtherDetail || 'อื่นๆ', unknown_hit_and_run: 'ไม่ทราบชนิดรถ (ชนแล้วหนี)' };
    const pedVTxt = pedVMap[patient.trafficPedVehicleType] || 'ไม่ระบุชนิดรถ';
    const mechs = Array.isArray(patient.trafficPedMechs) ? patient.trafficPedMechs : [];
    const mechNames = [];
    if (mechs.includes('sideswiped_fall')) mechNames.push('ถูกเฉี่ยวล้ม');
    if (mechs.includes('direct_impact_thrown')) mechNames.push('พุ่งชนปะทะตรง ร่างกระเด็นลอยกระแทก');
    if (mechs.includes('run_over_limbs_body')) mechNames.push('ถูกรถทับ/เหยียบ');
    if (mechs.includes('trapped_under_dragged')) mechNames.push('ติดใต้ท้องรถ/ถูกลาก');
    if (mechs.includes('severe_injury_fatality')) mechNames.push('มีผู้บาดเจ็บสาหัส/เสียชีวิต');
    return `คนเดินเท้าถูกชน (คู่กรณี: ${pedVTxt})${mechNames.length > 0 ? ' • ' + mechNames.join(', ') : ''}`;
  }
  if (role === 'bicycle_scooter') {
    const beltTxt = patient.trafficBikeHelmet === 'helmet_worn' ? 'สวมหมวกกันน็อก' : (patient.trafficBikeHelmet === 'no_helmet' ? 'ไม่สวมหมวกกันน็อก' : '');
    const mechs = Array.isArray(patient.trafficBikeMechs) ? patient.trafficBikeMechs : [];
    const mechNames = [];
    if (mechs.includes('fall_alone')) mechNames.push('ล้มเอง');
    if (mechs.includes('hit_by_motorcycle')) mechNames.push('ถูก จยย. ชน');
    if (mechs.includes('hit_by_car_truck')) mechNames.push('ถูกรถยนต์/บรรทุกชน');
    if (mechs.includes('thrown_or_run_over')) mechNames.push('กระเด็นตกรุนแรง/ถูกทับ');
    return `ปั่นจักรยาน/สกู๊ตเตอร์${beltTxt ? ' • ' + beltTxt : ''}${mechNames.length > 0 ? ' • ' + mechNames.join(', ') : ''}`;
  }
  if (role === 'other_vehicle') {
    const vTxt = patient.trafficOtherVehicleTypeDetail || 'ยานพาหนะอื่นๆ';
    const mechs = Array.isArray(patient.trafficOtherVehicleMechs) ? patient.trafficOtherVehicleMechs : [];
    const mechNames = [];
    if (mechs.includes('rollover_alone')) mechNames.push('เสียหลักล้ม/ตกข้างทาง');
    if (mechs.includes('collision_other')) mechNames.push(`ชนปะทะ ${patient.trafficOtherOpponentDetail || ''}`);
    if (mechs.includes('rollover_thrown')) mechNames.push('พลิกคว่ำ/กระเด็นตก');
    if (mechs.includes('run_over_trapped')) mechNames.push('ถูกทับ/ติดในรถ');
    return `${vTxt}${mechNames.length > 0 ? ' • ' + mechNames.join(', ') : ''}`;
  }
  return 'อุบัติเหตุจราจร (ไม่ระบุประเภทยานพาหนะ)';
}

function formatTrafficAnatomy(patient) {
  const parts = [];

  if (patient.trafficParentHeadFace) {
    const subs = [];
    if (patient.trafficHeadScalp) subs.push(`หนังศีรษะ/หน้าผาก${fmtTrafficSideAndInjury(patient.trafficHeadScalpSides, patient.trafficHeadScalpInjuries)}`);
    if (patient.trafficHeadFace) subs.push(`ใบหน้า/โหนกแก้ม/คาง${fmtTrafficSideAndInjury(patient.trafficHeadFaceSides, patient.trafficHeadFaceInjuries)}`);
    if (patient.trafficHeadEye) subs.push(`ดวงตา/เบ้าตา${fmtTrafficSideAndInjury(patient.trafficHeadEyeSides, patient.trafficHeadEyeInjuries)}`);
    if (patient.trafficHeadEar) subs.push(`ใบหู${fmtTrafficSideAndInjury(patient.trafficHeadEarSides, patient.trafficHeadEarInjuries)}`);
    if (patient.trafficHeadNoseMouth) subs.push(`จมูก/ปาก/ฟัน${fmtTrafficSideAndInjury(patient.trafficHeadNoseMouthSides, patient.trafficHeadNoseMouthInjuries)}`);
    parts.push(`ศีรษะ/ใบหน้า: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  if (patient.trafficParentNeck) {
    const subs = [];
    if (patient.trafficNeckBack) subs.push(`ต้นคอด้านหลัง${fmtTrafficSideAndInjury(patient.trafficNeckBackSides, patient.trafficNeckBackInjuries)}`);
    if (patient.trafficNeckFront) subs.push(`ลำคอด้านหน้า${fmtTrafficSideAndInjury(patient.trafficNeckFrontSides, patient.trafficNeckFrontInjuries)}`);
    if (patient.trafficNeckSide) subs.push(`ลำคอด้านข้าง${fmtTrafficSideAndInjury(patient.trafficNeckSideSides, patient.trafficNeckSideInjuries)}`);
    parts.push(`ลำคอ: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  if (patient.trafficParentChest) {
    const subs = [];
    if (patient.trafficChestWall) subs.push(`หน้าอก/ซี่โครง${fmtTrafficSideAndInjury(patient.trafficChestWallSides, patient.trafficChestWallInjuries)}`);
    if (patient.trafficChestClavicle) subs.push(`ไหปลาร้า${fmtTrafficSideAndInjury(patient.trafficChestClavicleSides, patient.trafficChestClavicleInjuries)}`);
    if (patient.trafficChestUpperBack) subs.push(`หลังส่วนบน/สะบัก${fmtTrafficSideAndInjury(patient.trafficChestUpperBackSides, patient.trafficChestUpperBackInjuries)}`);
    parts.push(`หน้าอก/หลังบน: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  if (patient.trafficParentAbdomen) {
    const subs = [];
    if (patient.trafficAbdWall) subs.push(`หน้าท้อง/ชายโครง${fmtTrafficSideAndInjury(patient.trafficAbdWallSides, patient.trafficAbdWallInjuries)}`);
    if (patient.trafficAbdFlank) subs.push(`สีข้าง/บั้นเอว${fmtTrafficSideAndInjury(patient.trafficAbdFlankSides, patient.trafficAbdFlankInjuries)}`);
    if (patient.trafficAbdLowerBack) subs.push(`หลังส่วนล่าง${fmtTrafficSideAndInjury(patient.trafficAbdLowerBackSides, patient.trafficAbdLowerBackInjuries)}`);
    if (patient.trafficAbdPelvis) subs.push(`สะโพก/เชิงกราน${fmtTrafficSideAndInjury(patient.trafficAbdPelvisSides, patient.trafficAbdPelvisInjuries)}`);
    if (patient.trafficAbdGenitalia) subs.push(`ขาหนีบ/อวัยวะเพศ${fmtTrafficSideAndInjury(patient.trafficAbdGenitaliaSides, patient.trafficAbdGenitaliaInjuries)}`);
    parts.push(`หน้าท้อง/เชิงกราน: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  if (patient.trafficParentUpperExtremity) {
    const subs = [];
    if (patient.trafficArmShoulder) subs.push(`หัวไหล่/ต้นแขน${fmtTrafficSideAndInjury(patient.trafficArmShoulderSides, patient.trafficArmShoulderInjuries)}`);
    if (patient.trafficArmElbowForearm) subs.push(`ข้อศอก/แขนท่อนล่าง${fmtTrafficSideAndInjury(patient.trafficArmElbowForearmSides, patient.trafficArmElbowForearmInjuries)}`);
    if (patient.trafficArmWristHand) subs.push(`ข้อมือ/มือ${fmtTrafficSideAndInjury(patient.trafficArmWristHandSides, patient.trafficArmWristHandInjuries)}`);
    if (patient.trafficArmFingers) {
      const dStr = fmtTrafficDigits(patient.trafficArmFingersLeftDigits, patient.trafficArmFingersRightDigits);
      subs.push(`นิ้วมือ${dStr}${fmtTrafficSideAndInjury([], patient.trafficArmFingersInjuries)}`);
    }
    parts.push(`แขน/มือ: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  if (patient.trafficParentLowerExtremity) {
    const subs = [];
    if (patient.trafficLegThigh) subs.push(`ต้นขา${fmtTrafficSideAndInjury(patient.trafficLegThighSides, patient.trafficLegThighInjuries)}`);
    if (patient.trafficLegKneeShin) subs.push(`เข่า/หน้าแข้ง/น่อง${fmtTrafficSideAndInjury(patient.trafficLegKneeShinSides, patient.trafficLegKneeShinInjuries)}`);
    if (patient.trafficLegAnkleFoot) subs.push(`ข้อเท้า/เท้า${fmtTrafficSideAndInjury(patient.trafficLegAnkleFootSides, patient.trafficLegAnkleFootInjuries)}`);
    if (patient.trafficLegToes) {
      const dStr = fmtTrafficDigits(patient.trafficLegToesLeftDigits, patient.trafficLegToesRightDigits);
      subs.push(`นิ้วเท้า${dStr}${fmtTrafficSideAndInjury([], patient.trafficLegToesInjuries)}`);
    }
    parts.push(`ขา/เท้า: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  if (patient.trafficParentOther && patient.trafficOtherLocationDetail && patient.trafficOtherLocationDetail.trim()) {
    const injTxt = fmtTrafficSideAndInjury([], patient.trafficOtherLocationInjuries);
    parts.push(`ตำแหน่งอื่นๆ: ${patient.trafficOtherLocationDetail.trim()}${injTxt}`);
  }

  return parts.length > 0 ? parts.join(' | ') : 'ไม่ได้ระบุตำแหน่งบาดเจ็บชัดเจน';
}

// Red Flag Evaluator
function evaluateTrafficRedFlags(patient) {
  const redFlags = [];
  const addRf = (key, level, textTh, risk, action) => {
    redFlags.push({ key, level, textTh, title: textTh, risk, detail: risk, suggestedAction: action, action });
  };

  const bleeding = patient.trafficBleedingStatus;
  const sysSigns = Array.isArray(patient.trafficSystemicSigns) ? patient.trafficSystemicSigns : [];
  const headSigns = Array.isArray(patient.trafficHeadSigns) ? patient.trafficHeadSigns : [];
  const neckSigns = Array.isArray(patient.trafficNeckSigns) ? patient.trafficNeckSigns : [];
  const chestSigns = Array.isArray(patient.trafficChestSigns) ? patient.trafficChestSigns : [];
  const abdSigns = Array.isArray(patient.trafficAbdSigns) ? patient.trafficAbdSigns : [];
  const upperSigns = Array.isArray(patient.trafficUpperExtSigns) ? patient.trafficUpperExtSigns : [];
  const lowerSigns = Array.isArray(patient.trafficLowerExtSigns) ? patient.trafficLowerExtSigns : [];
  const prodromes = Array.isArray(patient.trafficProdromeSigns) ? patient.trafficProdromeSigns : [];
  const anticoag = patient.trafficAnticoagulantHx;
  const lmpStatus = patient.trafficLmpStatus;
  const pregStatus = patient.trafficPregnancyStatus;

  // ESI 1: Active Hemorrhagic Shock / Critical Bleeding
  if (bleeding === 'pulsatile_or_massive' || sysSigns.includes('palpitation_cold_sweat_pallor') || sysSigns.includes('drowsy_confused_weakness')) {
    addRf(
      'rf_traffic_shock_active_massive_bleed',
      'ESI 1',
      'สงสัยภาวะช็อกจากเสียเลือด หรือมีเลือดไหลออกรุนแรง (Hemorrhagic Shock / Massive Bleeding)',
      'ความดันโลหิตตก เสียเลือดปริมาณมากจากบาดแผลภายนอกหรืออวัยวะภายใน เสี่ยงต่อภาวะช็อกวิกฤต',
      'เปิดเส้น IV ขนาดใหญ่ 2 เส้น, ทำ Bedside eFAST ประเมินเลือดออกในช่องอก/ช่องท้อง, ให้สารน้ำ/จองเลือด และเตรียมผ่าตัดห้ามเลือดฉุกเฉิน'
    );
  }

  // ESI 1: Airway / Respiratory Failure
  if (neckSigns.includes('airway_compromise_hoarseness') || chestSigns.includes('chest_dyspnea_tightness')) {
    addRf(
      'rf_traffic_airway_respiratory_failure',
      'ESI 1',
      'ทางเดินหายใจอุดกั้น หรือมีภาวะหายใจล้มเหลวเฉียบพลันหลังบาดเจ็บ (Airway / Respiratory Failure)',
      'กล่องเสียงแตกยุบ เลือด/เนื้อเยื่อบวมกดหลอดลม หรือภาวะ Tension pneumothorax / Flail chest',
      'ประเมิน Primary Survey A-B ทันที ดาม Hard C-Collar, ให้ออกซิเจน High-flow, ตรวจ CXR/eFAST และเตรียม Intubation / Chest tube'
    );
  }

  // ESI 1: Acute Traumatic Limb Threatening Ischemia
  if (upperSigns.includes('pallor_pulseless_cold_cyanosis') || lowerSigns.includes('numbness_drop_foot_cyanosis')) {
    addRf(
      'rf_traffic_acute_limb_ischemia',
      'ESI 1',
      'สงสัยหลอดเลือดแดงส่วนปลายฉีกขาดหรืออุดตัน แขนขาซีดเย็นคล้ำ (Acute Limb Threatening Ischemia)',
      'การขาดเลือดไปเลี้ยงรยางค์เกิน 6 ชั่วโมง เสี่ยงต่อภาวะเนื้อตาย (Gangrene) และการสูญเสียแขนขาถาวร',
      'ตรวจคลำชีพจรส่วนปลายและ Capillary refill เร่งด่วน, ปรึกษาศัลยแพทย์หลอดเลือด/ศัลยแพทย์กระดูกเพื่อ Revascularization ภายใน 6 ชั่วโมง'
    );
  }

  // ESI 2: High-Risk TBI
  const hasTbi = headSigns.includes('loc_amnesia') || headSigns.includes('severe_headache_vomiting') || headSigns.includes('basilar_ear_nose_discharge') || (patient.trafficParentHeadFace && anticoag === 'anticoagulant_antiplatelet');
  if (hasTbi) {
    addRf(
      'rf_traffic_tbi_loc_amnesia',
      'ESI 2',
      'สงสัยการบาดเจ็บทางสมอง (TBI Risk: มีประวัติสลบ/จำไม่ได้/อาเจียน หรือทานยาละลายลิ่มเลือด)',
      'เลือดออกในกะโหลกศีรษะ (Epidural/Subdural hematoma) หรือกะโหลกศีรษะแตกร้าว เสี่ยงต่อความดันในกะโหลกศีรษะสูง',
      'เฝ้าระวัง Neurological signs ทุก 15-30 นาที, พิจารณาส่ง CT Brain ฉุกเฉิน และ C-Spine X-ray/CT ตามเกณฑ์ Canadian CT Head'
    );
  }

  // ESI 2: Cervical Spine Injury
  if (neckSigns.includes('cspine_severe_pain_stiff') || neckSigns.includes('radiculopathy_weakness_numbness')) {
    addRf(
      'rf_traffic_cspine_instability_deficit',
      'ESI 2',
      'ปวดตึงแนวกระดูกต้นคอรุนแรง หรือมีอาการชา/อ่อนแรงร้าวลงแขนขา (Potential Cervical Spine Injury)',
      'กระดูกต้นคอหักหรือเคลื่อน และการกดทับไขสันหลัง (Spinal cord injury) เสี่ยงต่ออัมพาตแขนขา',
      'คง Hard C-Collar ไว้อย่างเคร่งครัด ห้ามก้มเงยหรือบิดคอ, ตรวจระดับ Motor/Sensory, และส่ง CT/X-ray C-Spine'
    );
  }

  // ESI 2: Blunt Torso / Pelvic Trauma
  if (abdSigns.includes('peritonitis_seatbelt_sign') || abdSigns.includes('pelvic_instability_pain') || abdSigns.includes('hematuria_anuria')) {
    addRf(
      'rf_traffic_blunt_torso_pelvic',
      'ESI 2',
      'สงสัยอวัยวะภายในช่องท้องบาดเจ็บ หรือกระดูกเชิงกรานหัก (Blunt Abdominal / Pelvic Trauma)',
      'ตับ/ม้ามแตก ไตบาดเจ็บ หรือเลือดออกปริมาณมากจาก Pelvic ring fracture นำไปสู่ภาวะเสียเลือดรุนแรง',
      'ตรวจ eFAST ข้างเตียง, CXR + Pelvis X-ray, ผูก Pelvic sheet/binder หากสงสัย Pelvic injury, และงดน้ำงดอาหาร (NPO)'
    );
  }

  // ESI 2: Open Fracture / Gross Deformity
  const hasOpenFx = upperSigns.includes('open_fracture_bone_exposed') || lowerSigns.includes('open_fracture_spoke_injury');
  const hasDeformity = upperSigns.includes('deformity_fracture_dislocation') || lowerSigns.includes('deformity_fracture_shortening');
  if (hasOpenFx || hasDeformity) {
    addRf(
      'rf_traffic_open_fracture_neurovascular',
      'ESI 2',
      'กระดูกหักเปิดมองเห็นกระดูก หรือแขนขาผิดรูปบิดเบี้ยวชัดเจน (Open Fracture / Gross Deformity)',
      'การติดเชื้อกระดูกรุนแรง (Osteomyelitis) และการบาดเจ็บของเส้นประสาท/หลอดเลือดข้างเคียง',
      'ดาม Splint ชั่วคราว, ให้ IV Antibiotics เร็วที่สุดหากเป็นแผลเปิด, ปิด sterile dressing, ตรวจ NPO Time เตรียมผ่าตัด OR'
    );
  }

  // ESI 2: Medical Syncope Crash or Pregnancy Trauma
  if (prodromes.includes('prodrome_syncope_medical') || pregStatus === 'confirmed_pregnant' || pregStatus === 'suspected_or_missed' || lmpStatus === 'pregnant' || lmpStatus === 'missed_period') {
    addRf(
      'rf_traffic_medical_crash_or_pregnant',
      'ESI 2',
      'มีอาการวูบ/เจ็บหน้าอกนำมาก่อนเกิดอุบัติเหตุ หรือผู้ป่วยตั้งครรภ์ (Medical Syncope Crash / Obstetric Trauma)',
      'ภาวะกล้ามเนื้อหัวใจขาดเลือดเฉียบพลัน เส้นเลือดสมองตีบ หัวใจเต้นผิดจังหวะ หรือภาวะรกลอกตัวก่อนกำหนดในสตรีมีครรภ์',
      'ตรวจ EKG 12-leads, DTX, ติดตาม Fetal Heart Sound และเฝ้าระวังภาวะรกลอกตัวก่อนกำหนด (Abruptio placentae)'
    );
  }

  return redFlags;
}

function renderTrafficRapidHpi(patient) {
  const durVal = patient.durationVal !== undefined && patient.durationVal !== null ? patient.durationVal : '';
  const durUnitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durStr = durVal ? `${durVal} ${durUnitMap[patient.durationUnit] || 'นาที'}` : 'ไม่ระบุระยะเวลา';

  const exactDate = patient.trafficExactDate || '';
  const exactTime = patient.trafficExactTime || '';
  const dateStr = (exactDate || exactTime) ? ` (เกิดเหตุเมื่อ: ${exactDate || 'ไม่ระบุวันที่'} เวลา ${exactTime || 'ไม่ระบุเวลา'} น.)` : '';

  const mechStr = formatTrafficMechanism(patient);
  const anatomyStr = formatTrafficAnatomy(patient);

  const bleedMap = {
    none_or_contusion: 'ไม่มีแผลเปิด (มีรอยฟกช้ำ/ปวดบวม)',
    abrasion_or_stopped: 'มีแผลถลอก/แตก เลือดหยุดแล้ว',
    oozing_continuous: 'มีแผลฉีกขาด เลือดไหลซึมต่อเนื่อง',
    pulsatile_or_massive: 'แผลเลือดไหลพุ่ง หรือออกมากผิดปกติ'
  };
  const bleedStr = bleedMap[patient.trafficBleedingStatus] || 'ไม่ได้ระบุสถานะเลือดออก';

  // Systemic Signs & Pertinent Positives
  const headSigns = Array.isArray(patient.trafficHeadSigns) ? patient.trafficHeadSigns : [];
  const neckSigns = Array.isArray(patient.trafficNeckSigns) ? patient.trafficNeckSigns : [];
  const chestSigns = Array.isArray(patient.trafficChestSigns) ? patient.trafficChestSigns : [];
  const abdSigns = Array.isArray(patient.trafficAbdSigns) ? patient.trafficAbdSigns : [];
  const upperSigns = Array.isArray(patient.trafficUpperExtSigns) ? patient.trafficUpperExtSigns : [];
  const lowerSigns = Array.isArray(patient.trafficLowerExtSigns) ? patient.trafficLowerExtSigns : [];
  const sysSigns = Array.isArray(patient.trafficSystemicSigns) ? patient.trafficSystemicSigns : [];
  const prodromes = Array.isArray(patient.trafficProdromeSigns) ? patient.trafficProdromeSigns : [];

  const positives = [];
  const negatives = [];

  if (headSigns.includes('loc_amnesia')) positives.push('มีอาการสลบ หมดสติชั่วขณะ หรือจำเหตุการณ์ไม่ได้');
  if (headSigns.includes('severe_headache_vomiting')) positives.push('ปวดศีรษะรุนแรง มึนงงสับสน หรืออาเจียน');
  if (headSigns.includes('diplopia_blurred_foreign_body')) positives.push('ตาพร่ามัว มองเห็นภาพซ้อน หรือสิ่งแปลกปลอมเข้าตา');
  if (headSigns.includes('basilar_ear_nose_discharge')) positives.push('มีเลือดหรือน้ำใสไหลออกจากรูหูหรือรูจมูก');
  if (headSigns.includes('malocclusion_jaw_locked') || headSigns.includes('maxillofacial_malocclusion')) positives.push('ขากรรไกรค้าง อ้าปากไม่ขึ้น หรือสบฟันไม่สนิท');
  if (headSigns.includes('broken_loose_tooth')) positives.push('ฟันหัก บิ่น หรือฟันโยกคลอน');

  if (neckSigns.includes('cspine_severe_pain_stiff')) positives.push('ปวดตึงแนวกระดูกต้นคอมาก หันคอไม่ได้');
  if (neckSigns.includes('radiculopathy_weakness_numbness')) positives.push('ชาแปล๊บเหมือนไฟช็อต หรืออ่อนแรงร้าวลงแขนขา');
  if (neckSigns.includes('airway_compromise_hoarseness')) positives.push('หายใจลำบาก กลืนลำบาก หรือเสียงแหบหลังกระแทก');

  if (chestSigns.includes('chest_dyspnea_tightness')) positives.push('แน่นหน้าอก หายใจหอบเหนื่อยไม่อิ่ม');
  if (chestSigns.includes('pleuritic_pain_cough')) positives.push('เจ็บแปล๊บที่หน้าอกหรือซี่โครงเวลาหายใจลึกๆ หรือไอ');
  if (chestSigns.includes('rib_clavicle_deformity_tenderness')) positives.push('กระดูกไหปลาร้าหรือซี่โครงปูดนูน ผิดรูป หรือกดเจ็บมาก');

  if (abdSigns.includes('peritonitis_seatbelt_sign')) positives.push('ปวดท้องรุนแรง ท้องอืดตึง หรือมีรอยช้ำคาดเข็มขัดนิรภัย');
  if (abdSigns.includes('pelvic_instability_pain')) positives.push('ปวดสะโพกหรือเชิงกรานมากจนขยับขาไม่ได้');
  if (abdSigns.includes('cauda_equina_sciatica')) positives.push('ปวดหลังร้าวลงขา ชาขา หรือกลั้นปัสสาวะไม่ได้');
  if (abdSigns.includes('hematuria_anuria')) positives.push('ปัสสาวะเป็นเลือดสด หรือปัสสาวะไม่ออก');

  if (upperSigns.includes('deformity_fracture_dislocation')) positives.push('แขน ข้อมือ หรือนิ้วมือผิดรูป บิดเบี้ยว สงสัยกระดูกหัก/ข้อหลุด');
  if (upperSigns.includes('inability_to_move')) positives.push('ปวดมากจนยกแขน ขยับข้อมือ หรือกำเหยียดนิ้วไม่ได้');
  if (upperSigns.includes('numbness_sensory_loss')) positives.push('มีอาการชา หรือไร้ความรู้สึกที่แขน/ฝ่ามือ');
  if (upperSigns.includes('pallor_pulseless_cold_cyanosis')) positives.push('ปลายนิ้วมือซีดขาว เย็นเฉียบ หรือเขียวคล้ำ');
  if (upperSigns.includes('open_fracture_bone_exposed')) positives.push('มีแผลเปิดลึกบริเวณกระดูกหัก มองเห็นกระดูกโผล่');

  if (lowerSigns.includes('deformity_fracture_shortening')) positives.push('ขา เข่า หน้าแข้ง หรือข้อเท้าผิดรูป หรือขาสั้นยาวไม่เท่ากัน');
  if (lowerSigns.includes('inability_to_bear_weight')) positives.push('ปวดมากจนไม่สามารถยืนลงน้ำหนักหรือก้าวขาได้เลย');
  if (lowerSigns.includes('numbness_drop_foot_cyanosis')) positives.push('ชาปลายเท้า กระดกข้อเท้าไม่ขึ้น หรือปลายเท้าซีดเย็น');
  if (lowerSigns.includes('open_fracture_spoke_injury')) positives.push('มีแผลเปิดลึกกระดูกโผล่ หรือแผลถูกซี่ล้อรถบาดลึก');

  if (sysSigns.includes('presyncope_dizziness')) positives.push('หน้ามืด เวียนศีรษะจะเป็นลม หรือตาพร่ามัว');
  if (sysSigns.includes('palpitation_cold_sweat_pallor')) positives.push('ใจสั่น เหงื่อแตกตัวเย็น ซีด หรือกระหายน้ำมาก');
  if (sysSigns.includes('drowsy_confused_weakness')) positives.push('ง่วงซึมลง สับสน หรืออ่อนเพลียไม่มีแรง');
  if (sysSigns.includes('no_systemic_signs')) negatives.push('ไม่มีอาการหน้ามืด ใจสั่น เหงื่อแตกตัวเย็น หรือซึมลง');

  if (prodromes.includes('prodrome_syncope_medical')) positives.push('มีอาการวูบ หน้ามืด เจ็บหน้าอก หรือแขนขาอ่อนแรงนำมาก่อนเกิดอุบัติเหตุ');
  if (prodromes.includes('prodrome_drowsy_sleep')) positives.push('มีอาการง่วงนอน หรือหลับในก่อนเกิดเหตุ');
  if (prodromes.includes('prodrome_alcohol_drugs')) positives.push('มีประวัติดื่มแอลกอฮอล์หรือทานยาที่ทำให้ง่วงก่อนเกิดเหตุ');
  if (prodromes.includes('prodrome_none')) negatives.push('ไม่มีอาการผิดปกตินำมาก่อน และไม่ได้ดื่มแอลกอฮอล์');

  if (patient.trafficParentHeadFace && !headSigns.includes('loc_amnesia') && !headSigns.includes('severe_headache_vomiting')) negatives.push('ไม่มีอาการสลบ ไม่ปวดศีรษะและไม่อาเจียน');
  if (patient.trafficParentNeck && !neckSigns.includes('cspine_severe_pain_stiff') && !neckSigns.includes('radiculopathy_weakness_numbness')) negatives.push('ไม่ปวดตึงต้นคอ และไม่มีแขนขาชาอ่อนแรง');
  if (patient.trafficParentChest && !chestSigns.includes('chest_dyspnea_tightness')) negatives.push('ไม่เจ็บแน่นหน้าอก และไม่หายใจไม่อิ่ม');
  if (patient.trafficParentAbdomen && !abdSigns.includes('peritonitis_seatbelt_sign') && !abdSigns.includes('hematuria_anuria')) negatives.push('ไม่ปวดท้อง และปัสสาวะไม่มีเลือดปน');

  if (patient.otherSymptomsFree && String(patient.otherSymptomsFree).trim()) {
    positives.push(`ข้อมูลเพิ่มเติมจากผู้ป่วย: ${String(patient.otherSymptomsFree).trim()}`);
  }

  const pScore = patient.painScore !== null && patient.painScore !== undefined ? `${patient.painScore}/10` : 'ไม่ได้ระบุ';

  // Female LMP & Pregnancy formatting (C-AP13 Male Guard & C-AP14 Thai Dictionary)
  const pregMap = {
    not_pregnant: 'ไม่ได้ตั้งครรภ์ / ประจำเดือนมาปกติ',
    suspected_or_missed: 'ขาดประจำเดือน / สงสัยอาจตั้งครรภ์',
    confirmed_pregnant: 'ยืนยันกำลังตั้งครรภ์',
    menopause_or_hysterectomy: 'วัยหมดประจำเดือน / ผ่าตัดมดลูกแล้ว',
    unknown: 'ไม่ทราบสถานะการตั้งครรภ์'
  };
  const legacyLmpMap = {
    exact_date: `ระบุวันแรกของรอบล่าสุด: ${patient.trafficLmpExactDate || 'ไม่ระบุ'}`,
    approximate: `ประมาณ ${patient.trafficLmpApproximate || '1-2 สัปดาห์ก่อน'}`,
    missed_period: 'ขาดประจำเดือน / สงสัยตั้งครรภ์',
    pregnant: `กำลังตั้งครรภ์ ${patient.trafficLmpGestationalAge ? '(' + patient.trafficLmpGestationalAge + ')' : ''}`,
    premenarche: 'ยังไม่เคยมีประจำเดือน (ก่อนวัยเจริญพันธุ์)',
    menopause_hysterectomy: 'วัยหมดประจำเดือน หรือผ่าตัดมดลูกแล้ว'
  };
  const isFemalePatient = isTrafficFemalePatient(patient);
  let femStr = '';
  if (isFemalePatient && (patient.trafficLmpDate || patient.trafficPregnancyStatus)) {
    femStr = `LMP ${patient.trafficLmpDate || 'ไม่ระบุ'} (${pregMap[patient.trafficPregnancyStatus] || 'ไม่ได้ระบุ'})`;
  } else if (isFemalePatient && patient.trafficLmpStatus) {
    femStr = legacyLmpMap[patient.trafficLmpStatus] || '';
  }

  // NPO Time formatting
  const npoDurMap = { less_than_2_hours: '< 2 ชม.', '2_to_6_hours': '2–6 ชม.', over_6_hours: '> 6 ชม.', unknown: 'ไม่แน่ชัด' };
  const npoTime = patient.trafficNpoExactTime ? `เวลา ${patient.trafficNpoExactTime} น.` : '';
  const npoDur = npoDurMap[patient.trafficNpoDuration] || '';
  const npoFood = patient.trafficNpoLastFoodDetail ? `(${patient.trafficNpoLastFoodDetail})` : '';
  const npoStr = (npoTime || npoDur || npoFood) ? `${npoTime} [อดมาแล้ว ${npoDur}] ${npoFood}`.trim() : 'ไม่ได้ระบุ';

  const anticoagMap = {
    anticoagulant_antiplatelet: 'ใช้ยาละลายลิ่มเลือด/ต้านเกล็ดเลือด',
    bleeding_disorder_cirrhosis: 'มีโรคเลือดหยุดยาก/ตับแข็ง',
    no_anticoagulant: 'ปฏิเสธยาละลายลิ่มเลือดและโรคเลือดหยุดยาก'
  };
  const anticoagStr = anticoagMap[patient.trafficAnticoagulantHx] || 'ไม่ได้ระบุ';

  const tetanusMap = {
    within_5_years: 'เคยฉีดเข็มกระตุ้นภายใน 5 ปีที่ผ่านมา',
    within_5y: 'เคยฉีดเข็มกระตุ้นภายใน 5 ปีที่ผ่านมา',
    '5_to_10_years': 'เคยฉีดในช่วง 5–10 ปีที่ผ่านมา',
    '5_to_10y': 'เคยฉีดในช่วง 5–10 ปีที่ผ่านมา',
    over_10_years: 'เคยฉีดครบ แต่เกิน 10 ปีแล้ว',
    over_10y: 'เคยฉีดครบ แต่เกิน 10 ปีแล้ว',
    unknown_or_never: 'ไม่เคยฉีด หรือจำประวัติไม่ได้',
    over_10_years_or_never: 'เกิน 10 ปีแล้ว หรือไม่เคยฉีด/จำไม่ได้'
  };
  const tetanusStr = tetanusMap[patient.trafficTetanusHx] || 'ไม่ได้ระบุ';

  let hpi = `[Chief Complaint (CC)]
ได้รับบาดเจ็บจากอุบัติเหตุจราจร เป็นมา ${durStr}${dateStr}

[History of Present Illness (HPI)]
• ยานพาหนะ บทบาท และกลไกการเกิดเหตุ: ${mechStr}
• ตำแหน่งบาดเจ็บและชนิดการบาดเจ็บ: ${anatomyStr}
• สถานะบาดแผลและเลือดออก: ${bleedStr}
• ระดับความปวด: ${pScore}
• NPO Time (อาหาร/น้ำมื้อล่าสุด): ${npoStr}
• ประวัติยาละลายลิ่มเลือด/โรคเลือดออกง่าย: ${anticoagStr}
• วัคซีนป้องกันบาดทะยัก: ${tetanusStr}`;

  if (femStr) {
    hpi += `\n• ประวัติสตรี: ${femStr}`;
  }

  const rfs = evaluateTrafficRedFlags(patient);
  const rfText = rfs.length > 0
    ? `🚩 RED FLAGS DETECTED:\n${rfs.map(rf => `  * ${rf.title}\n    ความเสี่ยง: ${rf.detail}\n    ข้อแนะนำการดูแลเร่งด่วน: ${rf.action}`).join('\n\n')}`
    : '✅ ไม่พบสัญญาณเตือนวิกฤตความเสี่ยงสูง (Non-Red Flag)';

  hpi += `\n\n• Pertinent Positives:\n  - ${positives.length > 0 ? positives.join('\n  - ') : 'ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม'}`;
  hpi += `\n\n• Pertinent Negatives:\n  - ${negatives.length > 0 ? negatives.join('\n  - ') : 'ผู้ป่วยไม่ได้ระบุคำตอบยืนยันในหมวดอาการร่วม'}`;
  hpi += `\n\n[Emergency Risk Assessment (Red Flags)]\n${rfText}`;

  return hpi;
}

function renderTrafficNarrativeHpi(patient) {
  return renderTrafficRapidHpi(patient);
}

function updateTrafficOutputs(rec) {
  if (!rec) return;
  const rapidText = renderTrafficRapidHpi(rec);
  const narrativeText = renderTrafficNarrativeHpi(rec);

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

  const redFlags = evaluateTrafficRedFlags(rec);
  rec.redFlags = redFlags;

  const jsonOutput = {
    encounter: {
      chief_complaint: 'traffic_accident',
      schema_code: 'traffic_accident',
      chief_complaint_title_th: 'ได้รับบาดเจ็บจากอุบัติเหตุจราจร',
      timestamp: rec.timestamp || new Date().toISOString(),
      duration_val: rec.durationVal || null,
      duration_unit: rec.durationUnit || 'minutes',
      exact_date: rec.trafficExactDate || '',
      exact_time: rec.trafficExactTime || ''
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
      vehicle_role: rec.trafficVehicleRole || null,
      bleeding_status: rec.trafficBleedingStatus || null,
      systemic_signs: Array.isArray(rec.trafficSystemicSigns) ? rec.trafficSystemicSigns : [],
      pain_score: rec.painScore,
      prodrome_signs: Array.isArray(rec.trafficProdromeSigns) ? rec.trafficProdromeSigns : [],
      anticoagulant_hx: rec.trafficAnticoagulantHx || null,
      tetanus_history: rec.trafficTetanusHx || null,
      npo_exact_time: rec.trafficNpoExactTime || '',
      npo_duration: rec.trafficNpoDuration || null,
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

// --- QUESTIONNAIRE FORM HTML ---
const TRAFFIC_ACCIDENT_FORM_HTML = `
<div id="cc-traffic-accident-section" class="space-y-6">
  <div data-cc-top-banner="traffic_accident"><div class="flex flex-col gap-4">
  <!-- First-Aid Guidance Banner -->
  <div class="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs sm:text-sm text-amber-900 flex items-start space-x-3 shadow-xs">
    <i data-lucide="alert-triangle" class="w-5 h-5 text-amber-600 shrink-0 mt-0.5"></i>
    <div class="space-y-1">
      <strong class="font-bold block text-amber-950 text-sm">คำแนะนำเบื้องต้นระหว่างรอตรวจ:</strong>
      <ul class="list-disc list-inside space-y-0.5 text-amber-800 text-xs sm:text-sm">
        <li><strong>ควรงดน้ำและอาหารชั่วคราว:</strong> เผื่อกรณีแพทย์ต้องส่งตรวจพิเศษทางรังสีหรือผ่าตัดฉุกเฉิน</li>
        <li><strong>อาการฉุกเฉิน:</strong> ปวดต้นคอรุนแรง ชาอ่อนแรง ปวดท้อง แน่นหน้าอก หน้ามืด หรือเลือดไหลไม่หยุด รีบแจ้งพยาบาลทันที</li>
      </ul>
    </div>
  </div>
  </div></div>

  <!-- CARD 1: ข้อมูลเวลาเกิดเหตุ ยานพาหนะ และความรุนแรง -->
  <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
    <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
      <div class="p-2 rounded-xl bg-medical-100 text-medical-700"><i data-lucide="car" class="w-5 h-5"></i></div>
      <div>
        <h2 class="text-base font-bold text-slate-900">1. ข้อมูลเวลาเกิดเหตุ ยานพาหนะ และความรุนแรงของอุบัติเหตุ</h2>
        <p class="text-xs text-slate-500">ระบุเวลาเกิดเหตุ ยานพาหนะที่เกี่ยวข้อง และสถานะเลือดออก</p>
      </div>
    </div>

    <!-- 1.1 ระยะเวลาและวันที่/เวลาเกิดเหตุ -->
    <div class="space-y-2.5">
      <label class="block text-xs sm:text-sm font-semibold text-slate-800">1.1 อุบัติเหตุจราจรเกิดขึ้นมานานเท่าใด และวันที่/เวลาที่เกิดเหตุ:</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <span class="text-xs sm:text-sm text-slate-600 mb-1 block">ระยะเวลาตั้งแต่เกิดเหตุจนถึงปัจจุบัน:</span>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <input type="number" id="trafficDurationVal" min="0" placeholder="เช่น 30" class="col-span-1 sm:col-span-2 w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-medical-500 focus:bg-white">
            <select id="trafficDurationUnit" class="col-span-1 w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-medical-500 focus:bg-white">
              <option value="minutes" selected>นาที</option>
              <option value="hours">ชั่วโมง</option>
              <option value="days">วัน</option>
              <option value="weeks">สัปดาห์</option>
              <option value="months">เดือน</option>
            </select>
          </div>
        </div>
        <div>
          <span class="text-xs sm:text-sm text-slate-600 mb-1 block">ระบุวันที่และเวลาที่เกิดอุบัติเหตุ:</span>
          <div class="grid grid-cols-2 gap-2">
            <input type="text" id="trafficExactDate" data-universal-date="true" placeholder="วว/ดด/ปปปป" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-medical-500 focus:bg-white">
            <input type="text" id="trafficExactTime" data-universal-time="true" placeholder="เช่น 14:30 (24 ชม.)" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-medical-500 focus:bg-white">
          </div>
        </div>
      </div>
    </div>

    <!-- 1.2 ลักษณะของผู้บาดเจ็บและยานพาหนะ -->
    <div class="pt-3 border-t border-slate-100 space-y-2.5">
      <label class="block text-xs sm:text-sm font-semibold text-slate-800">1.2 ลักษณะของผู้บาดเจ็บและยานพาหนะในขณะเกิดเหตุ:</label>
      ${renderTrafficGrid('grid-cols-1 sm:grid-cols-2', [
        { kind: 'radio', name: 'trafficVehicleRole', value: 'motorcycle', title: ['ผู้ขับขี่ / ผู้ซ้อน', 'รถจักรยานยนต์'], onchange: 'handleTrafficVehicleChange()' },
        { kind: 'radio', name: 'trafficVehicleRole', value: 'car_truck', title: ['ผู้ขับขี่ / โดยสาร', 'รถยนต์ / กระบะ / ตู้'], desc: 'รวมรถบรรทุก รถตู้ และรถโดยสารส่วนบุคคล', onchange: 'handleTrafficVehicleChange()' },
        { kind: 'radio', name: 'trafficVehicleRole', value: 'pedestrian', title: ['คนเดินเท้า', '(ถูกรถชน/เฉี่ยว)'], onchange: 'handleTrafficVehicleChange()' },
        { kind: 'radio', name: 'trafficVehicleRole', value: 'bicycle_scooter', title: ['ผู้ปั่นจักรยาน /', 'สกู๊ตเตอร์ไฟฟ้า'], onchange: 'handleTrafficVehicleChange()' },
        { kind: 'radio', name: 'trafficVehicleRole', value: 'other_vehicle', title: ['ยานพาหนะอื่นๆ'], desc: 'รถสามล้อ รถอีแต๋น รถไถ หรือรถโดยสาร', onchange: 'handleTrafficVehicleChange()', colSpan2: true }
      ])}
    </div>

    <!-- 1.3 DYNAMIC BRANCHING BY VEHICLE ROLE -->
    <div class="pt-3 border-t border-slate-100 space-y-3">
      <label class="block text-xs sm:text-sm font-semibold text-slate-800">1.3 รายละเอียดอุปกรณ์นิรภัย ลักษณะการเกิดอุบัติเหตุ และความรุนแรง:</label>

      <!-- กิ่งที่ 1: รถจักรยานยนต์ -->
      <div id="trafficBranchMotorcycle" class="hidden space-y-3 p-3.5 sm:p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm">
        <span class="font-bold text-slate-900 block">🛵 ข้อมูลเฉพาะสำหรับรถจักรยานยนต์:</span>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span class="text-slate-700 font-medium block mb-1">ตำแหน่งขณะเกิดเหตุ:</span>
            <div class="flex items-center space-x-3">
              <label class="flex items-center cursor-pointer"><input type="radio" name="trafficMotoRole" value="driver" class="text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">ผู้ขับขี่</span></label>
              <label class="flex items-center cursor-pointer"><input type="radio" name="trafficMotoRole" value="passenger" class="text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">ผู้ซ้อนท้าย</span></label>
            </div>
          </div>
          <div>
            <span class="text-slate-700 font-medium block mb-1">การสวมหมวกกันน็อก:</span>
            <div class="space-y-1">
              <label class="flex items-center cursor-pointer"><input type="radio" name="trafficMotoHelmet" value="helmet_kept" class="text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">สวมหมวกกันน็อก (ไม่หลุด)</span></label>
              <label class="flex items-center cursor-pointer"><input type="radio" name="trafficMotoHelmet" value="helmet_ejected_damaged" class="text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">สวมหมวก แต่หมวกหลุดหรือแตก</span></label>
              <label class="flex items-center cursor-pointer"><input type="radio" name="trafficMotoHelmet" value="no_helmet" class="text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">ไม่ได้สวมหมวกกันน็อก</span></label>
            </div>
          </div>
        </div>
        <div class="pt-2 border-t border-slate-200 space-y-1.5">
          <span class="text-slate-700 font-medium block">ลักษณะการเกิดเหตุ (เลือกได้หลายข้อ):</span>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="trafficMotoMechs" value="lost_control_alone" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">รถเสียหลักล้มเอง แฉลบลื่นไถล หรือตกหลุม (ไม่มีคู่กรณี)</span></label>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="trafficMotoMechs" value="collision_vehicle" onchange="handleTrafficMotoCollisionChange()" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">เฉี่ยวชน หรือชนปะทะกับรถคันอื่น</span></label>
          <div id="trafficMotoOpponentContainer" class="hidden ml-6 p-2.5 bg-white border border-slate-200 rounded-lg space-y-1.5 text-xs sm:text-sm">
            <span class="font-medium text-slate-700 block">ระบุรถคู่กรณี:</span>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              <label class="flex items-center cursor-pointer"><input type="checkbox" name="trafficMotoOpponentTypes" value="motorcycle" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">จยย. ด้วยกัน</span></label>
              <label class="flex items-center cursor-pointer"><input type="checkbox" name="trafficMotoOpponentTypes" value="car_pickup_van" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">เก๋ง/กระบะ/ตู้</span></label>
              <label class="flex items-center cursor-pointer"><input type="checkbox" name="trafficMotoOpponentTypes" value="truck_trailer_bus" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">บรรทุก/พ่วง/เมล์</span></label>
              <label class="flex items-center cursor-pointer"><input type="checkbox" name="trafficMotoOpponentTypes" value="other_opponent" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">อื่นๆ/สัตว์</span></label>
            </div>
            <input type="text" id="trafficMotoOpponentOtherDetail" placeholder="ระบุเพิ่มเติม (ถ้ามี)" class="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs sm:text-sm">
          </div>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="trafficMotoMechs" value="collision_obstacle" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">ชนสิ่งกีดขวาง (เสาไฟฟ้า ต้นไม้ ขอบฟุตบาท ราวสะพาน)</span></label>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="trafficMotoMechs" value="ejected_thrown" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">ร่างกระเด็นลอยตกจากรถ หรือไถลไปไกล</span></label>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="trafficMotoMechs" value="run_over_trapped" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">ถูกรถทับบริเวณร่างกาย หรือติดใต้ท้องรถ</span></label>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="trafficMotoMechs" value="severe_injury_fatality" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">มีผู้บาดเจ็บสาหัส หรือเสียชีวิตในเหตุการณ์เดียวกัน</span></label>
        </div>
      </div>

      <!-- กิ่งที่ 2: รถยนต์ / กระบะ / ตู้ / บรรทุก -->
      <div id="trafficBranchCarTruck" class="hidden space-y-3 p-3.5 sm:p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm">
        <span class="font-bold text-slate-900 block">🚗 ข้อมูลเฉพาะสำหรับรถยนต์ / รถกระบะ / รถตู้ / รถบรรทุก:</span>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div>
            <span class="text-slate-700 font-medium block mb-1">ประเภทรถที่โดยสาร:</span>
            <input type="text" id="trafficCarVehicleTypeDetail" placeholder="เช่น รถเก๋ง, รถกระบะ..." class="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs sm:text-sm bg-white">
          </div>
          <div>
            <span class="text-slate-700 font-medium block mb-1">ตำแหน่งที่นั่งในรถ:</span>
            <div class="space-y-1">
              <label class="flex items-center cursor-pointer"><input type="radio" name="trafficCarRoleSeat" value="driver" class="text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">คนขับ</span></label>
              <label class="flex items-center cursor-pointer"><input type="radio" name="trafficCarRoleSeat" value="front_passenger" class="text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">นั่งข้างคนขับ (เบาะหน้า)</span></label>
              <label class="flex items-center cursor-pointer"><input type="radio" name="trafficCarRoleSeat" value="rear_passenger" class="text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">ผู้โดยสารเบาะหลัง</span></label>
              <label class="flex items-center cursor-pointer"><input type="radio" name="trafficCarRoleSeat" value="cargo_bed" class="text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">นั่งท้ายกระบะ/ส่วนบรรทุก</span></label>
            </div>
          </div>
          <div>
            <span class="text-slate-700 font-medium block mb-1">การคาดเข็มขัดนิรภัย:</span>
            <div class="space-y-1">
              <label class="flex items-center cursor-pointer"><input type="radio" name="trafficCarSeatbelt" value="belt_worn" class="text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">คาดเข็มขัดนิรภัย</span></label>
              <label class="flex items-center cursor-pointer"><input type="radio" name="trafficCarSeatbelt" value="no_belt" class="text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">ไม่ได้คาดเข็มขัดนิรภัย</span></label>
            </div>
          </div>
        </div>
        <div class="pt-2 border-t border-slate-200 space-y-1.5">
          <span class="text-slate-700 font-medium block">ลักษณะการชนและความรุนแรง (เลือกได้หลายข้อ):</span>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="trafficCarMechs" value="minor_collision" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">เฉี่ยวชน หรือชนท้ายในความเร็วไม่สูงมาก</span></label>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="trafficCarMechs" value="high_impact_collision" onchange="handleTrafficCarCollisionChange()" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">ชนปะทะอย่างรุนแรง (ประสานงา / เสาไฟฟ้า / ต้นไม้ / ตกข้างทาง)</span></label>
          <div id="trafficCarOpponentContainer" class="hidden ml-6 p-2 bg-white border border-slate-200 rounded-lg">
            <input type="text" id="trafficCarOpponentDetail" placeholder="ระบุสิ่งที่ชน เช่น ชนท้ายรถบรรทุกสิบล้อ, ชนต้นไม้..." class="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs sm:text-sm">
          </div>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="trafficCarMechs" value="airbag_deployed_windshield" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">ถุงลมนิรภัยทำงาน หรือพวงมาลัย/กระจกหน้ารถแตกยุบ</span></label>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="trafficCarMechs" value="rollover" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">รถพลิกคว่ำ หรือหมุนหลายตลบ</span></label>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="trafficCarMechs" value="ejected_from_vehicle" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">ร่างกระเด็นหลุดออกจากตัวรถ หรือตกท้ายรถกระบะ</span></label>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="trafficCarMechs" value="trapped_in_vehicle" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">ร่างติดอยู่ในซากรถ (ต้องใช้เครื่องตัดถ่าง)</span></label>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="trafficCarMechs" value="severe_injury_fatality" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">มีผู้บาดเจ็บสาหัส หรือเสียชีวิตในเหตุการณ์เดียวกัน</span></label>
        </div>
      </div>

      <!-- กิ่งที่ 3: คนเดินเท้า -->
      <div id="trafficBranchPedestrian" class="hidden space-y-3 p-3.5 sm:p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm">
        <span class="font-bold text-slate-900 block">🚶 ข้อมูลเฉพาะสำหรับคนเดินเท้า:</span>
        <div class="space-y-1.5">
          <span class="text-slate-700 font-medium block">รถที่พุ่งชนหรือเฉี่ยวชนคือรถชนิดใด:</span>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label class="flex items-center cursor-pointer"><input type="radio" name="trafficPedVehicleType" value="motorcycle" onchange="handleTrafficPedVehicleChange()" class="text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">รถจักรยานยนต์</span></label>
            <label class="flex items-center cursor-pointer"><input type="radio" name="trafficPedVehicleType" value="car_pickup_van" onchange="handleTrafficPedVehicleChange()" class="text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">รถยนต์ส่วนบุคคล (เก๋ง/กระบะ/ตู้)</span></label>
            <label class="flex items-center cursor-pointer"><input type="radio" name="trafficPedVehicleType" value="truck_bus" onchange="handleTrafficPedVehicleChange()" class="text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">รถขนาดใหญ่ (บรรทุก/พ่วง/บัส)</span></label>
            <label class="flex items-center cursor-pointer"><input type="radio" name="trafficPedVehicleType" value="other_vehicle" onchange="handleTrafficPedVehicleChange()" class="text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">จักรยาน/สามล้อ หรืออื่นๆ</span></label>
            <label class="flex items-center cursor-pointer sm:col-span-2"><input type="radio" name="trafficPedVehicleType" value="unknown_hit_and_run" onchange="handleTrafficPedVehicleChange()" class="text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">ไม่ทราบชนิดรถแน่ชัด (เช่น ชนแล้วหลบหนี)</span></label>
          </div>
          <div id="trafficPedOtherContainer" class="hidden mt-1">
            <input type="text" id="trafficPedVehicleOtherDetail" placeholder="ระบุชนิดรถ..." class="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs sm:text-sm bg-white">
          </div>
        </div>
        <div class="pt-2 border-t border-slate-200 space-y-1.5">
          <span class="text-slate-700 font-medium block">ลักษณะการถูกชนและความรุนแรง (เลือกได้หลายข้อ):</span>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="trafficPedMechs" value="sideswiped_fall" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">ถูกรถเฉี่ยวชนแล้วล้มลงกับพื้น</span></label>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="trafficPedMechs" value="direct_impact_thrown" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">ถูกรถพุ่งชนโดยตรงจนร่างกระเด็น</span></label>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="trafficPedMechs" value="run_over_limbs_body" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">ถูกรถทับ หรือล้อรถเหยียบร่างกาย/แขนขา</span></label>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="trafficPedMechs" value="trapped_under_dragged" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">ร่างติดอยู่ใต้ท้องรถ หรือถูกลากไปกับพื้น</span></label>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="trafficPedMechs" value="severe_injury_fatality" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">มีผู้บาดเจ็บสาหัส หรือเสียชีวิตในเหตุการณ์เดียวกัน</span></label>
        </div>
      </div>

      <!-- กิ่งที่ 4: จักรยาน / สกู๊ตเตอร์ -->
      <div id="trafficBranchBicycleScooter" class="hidden space-y-3 p-3.5 sm:p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm">
        <span class="font-bold text-slate-900 block">🚲 ข้อมูลเฉพาะสำหรับจักรยาน / สกู๊ตเตอร์ไฟฟ้า:</span>
        <div>
          <span class="text-slate-700 font-medium block mb-1">การสวมหมวกกันน็อก:</span>
          <div class="flex items-center space-x-3">
            <label class="flex items-center cursor-pointer"><input type="radio" name="trafficBikeHelmet" value="helmet_worn" class="text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">สวมหมวกกันน็อก</span></label>
            <label class="flex items-center cursor-pointer"><input type="radio" name="trafficBikeHelmet" value="no_helmet" class="text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">ไม่ได้สวมหมวกกันน็อก</span></label>
          </div>
        </div>
        <div class="pt-2 border-t border-slate-200 space-y-1.5">
          <span class="text-slate-700 font-medium block">ลักษณะการเกิดอุบัติเหตุ:</span>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="trafficBikeMechs" value="fall_alone" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">เสียหลักล้มเอง หรือชนสิ่งกีดขวาง</span></label>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="trafficBikeMechs" value="hit_by_motorcycle" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">ถูกรถจักรยานยนต์เฉี่ยวชน</span></label>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="trafficBikeMechs" value="hit_by_car_truck" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">ถูกรถยนต์ กระบะ หรือรถบรรทุกชน</span></label>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="trafficBikeMechs" value="thrown_or_run_over" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">ร่างกระเด็นตกรุนแรง หรือถูกรถทับ/ติดใต้ท้องรถ</span></label>
        </div>
      </div>

      <!-- กิ่งที่ 5: ยานพาหนะอื่นๆ -->
      <div id="trafficBranchOtherVehicle" class="hidden space-y-3 p-3.5 sm:p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm">
        <span class="font-bold text-slate-900 block">🚜 ข้อมูลสำหรับยานพาหนะอื่นๆ:</span>
        <div>
          <span class="text-slate-700 font-medium block mb-1">ระบุประเภทยานพาหนะ:</span>
          <input type="text" id="trafficOtherVehicleTypeDetail" placeholder="เช่น รถสามล้อพ่วงข้าง, รถไถนา, รถสองแถว..." class="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs sm:text-sm bg-white">
        </div>
        <div class="pt-2 border-t border-slate-200 space-y-1.5">
          <span class="text-slate-700 font-medium block">ลักษณะการเกิดเหตุ:</span>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="trafficOtherVehicleMechs" value="rollover_alone" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">รถเสียหลักล้มเอง หรือตกข้างทาง</span></label>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="trafficOtherVehicleMechs" value="collision_other" onchange="handleTrafficOtherVehicleCollisionChange()" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">ชนปะทะกับรถคันอื่น หรือสิ่งกีดขวาง</span></label>
          <div id="trafficOtherOpponentContainer" class="hidden ml-6">
            <input type="text" id="trafficOtherOpponentDetail" placeholder="ระบุสิ่งที่ชน..." class="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs sm:text-sm bg-white">
          </div>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="trafficOtherVehicleMechs" value="rollover_thrown" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">รถพลิกคว่ำ หรือร่างกระเด็นตกจากรถ</span></label>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="trafficOtherVehicleMechs" value="run_over_trapped" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">ถูกรถทับร่าง หรือติดอยู่ใต้ซากรถ</span></label>
        </div>
      </div>
    </div>

    <!-- 1.4 สถานะเลือดออก -->
    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
      ${renderTrafficSysHeader({
        label: '1.4 สถานะบาดแผลเปิดหรือเลือดออกภายนอก <span class="text-rose-500">*</span>',
        icon: 'droplets',
        colorClass: 'bg-rose-100 text-rose-700',
        toggleKind: 'radio',
        toggleId: 'trafficBleedNoneRb',
        toggleName: 'trafficBleedingStatus',
        toggleValue: 'none_or_contusion',
        toggleLabel: 'ไม่มีเลือดออก'
      })}
      ${renderTrafficGrid('grid-cols-1 sm:grid-cols-3', [
        { kind: 'radio', name: 'trafficBleedingStatus', value: 'abrasion_or_stopped', title: ['แผลถลอก / แผลแตก', 'เลือดหยุดไหลแล้ว'], compact: true },
        { kind: 'radio', name: 'trafficBleedingStatus', value: 'oozing_continuous', title: ['มีแผลฉีกขาดและ', 'เลือดไหลซึมต่อเนื่อง'], compact: true },
        { kind: 'radio', name: 'trafficBleedingStatus', value: 'pulsatile_or_massive', title: ['แผลเลือดไหลพุ่ง /', 'ไหลออกมากผิดปกติ'], compact: true }
      ])}
    </div>
  </div>

  <!-- CARD 2: ตำแหน่งของร่างกายที่ได้รับบาดเจ็บและชนิดการบาดเจ็บ -->
  <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
    <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
      <div class="p-2 rounded-xl bg-medical-100 text-medical-700"><i data-lucide="user-check" class="w-5 h-5"></i></div>
      <div>
        <h2 class="text-base font-bold text-slate-900">2. ตำแหน่งของร่างกายที่ได้รับบาดเจ็บและชนิดการบาดเจ็บ</h2>
        <p class="text-xs text-slate-500">เลือกโซนร่างกายที่ได้รับบาดเจ็บ จากนั้นระบุด้านและลักษณะบาดเจ็บ</p>
      </div>
    </div>

    ${renderTrafficRegionBox({
      parentId: 'trafficParentHeadFace',
      subGroupId: 'trafficHeadFaceSubGroup',
      title: ['2.1 ศีรษะ ใบหน้า', 'ดวงตา หู จมูก ปาก'],
      partsHtml: [
        renderTrafficPart('trafficHeadScalp', 'หนังศีรษะ / หน้าผาก / ท้ายทอย', true, 'ผิดรูป/ยุบ'),
        renderTrafficPart('trafficHeadFace', 'ใบหน้า / โหนกแก้ม / คาง', true),
        renderTrafficPart('trafficHeadEye', 'ดวงตา / เปลือกตา / เบ้าตา'),
        renderTrafficPart('trafficHeadEar', 'ใบหู / กกหู'),
        renderTrafficPart('trafficHeadNoseMouth', 'จมูก / ริมฝีปาก / ฟัน / ในช่องปาก', true, 'ผิดรูป/ฟันหัก')
      ].join('\n'),
      signsName: 'trafficHeadSigns',
      signsNoneId: 'trafficHeadSignsNoneCb',
      signs: [
        { value: 'loc_amnesia', title: ['สลบ หมดสติชั่วขณะ', 'จำเหตุการณ์ไม่ได้'] },
        { value: 'severe_headache_vomiting', title: ['ปวดศีรษะรุนแรง', 'มึนงง ซึม อาเจียน'] },
        { value: 'diplopia_blurred_foreign_body', title: ['ตาพร่ามัว ภาพซ้อน', 'หรือเศษแก้วเข้าตา'], desc: 'มีเลือดออกในตา หรือสิ่งแปลกปลอมเข้าตา' },
        { value: 'basilar_ear_nose_discharge', title: ['เลือดหรือน้ำใสไหล', 'ออกจากรูหู / จมูก'] },
        { value: 'malocclusion_jaw_locked', title: ['ขากรรไกรค้าง /', 'สบไม่สนิท'], desc: 'อ้าปากไม่ขึ้น หรือสบฟันไม่ตรง' },
        { value: 'broken_loose_tooth', title: ['ฟันหัก / โยก'], desc: 'ฟันแตก บิ่น หลุด หรือโยกคลอน' }
      ]
    })}

    ${renderTrafficRegionBox({
      parentId: 'trafficParentNeck',
      subGroupId: 'trafficNeckSubGroup',
      title: ['2.2 ลำคอ / ต้นคอ'],
      partsHtml: [
        renderTrafficPart('trafficNeckBack', 'ต้นคอด้านหลัง (แนวกระดูกคอ)', true),
        renderTrafficPart('trafficNeckFront', 'ลำคอด้านหน้า (หลอดลม)', true),
        renderTrafficPart('trafficNeckSide', 'ลำคอด้านข้าง')
      ].join('\n'),
      signsName: 'trafficNeckSigns',
      signsNoneId: 'trafficNeckSignsNoneCb',
      signsCols: 'grid-cols-1 sm:grid-cols-3',
      signs: [
        { value: 'cspine_severe_pain_stiff', title: ['ปวดตึงต้นคอมาก', 'หันหรือก้มเงยไม่ได้'] },
        { value: 'radiculopathy_weakness_numbness', title: ['ชา แปล๊บไฟช็อต', 'อ่อนแรงร้าวแขนขา'] },
        { value: 'airway_compromise_hoarseness', title: ['หายใจ / กลืนลำบาก', 'เสียงแหบ คอบวมโต'] }
      ]
    })}

    ${renderTrafficRegionBox({
      parentId: 'trafficParentChest',
      subGroupId: 'trafficChestSubGroup',
      title: ['2.3 หน้าอก ซี่โครง', 'ไหปลาร้า / หลังบน'],
      partsHtml: [
        renderTrafficPart('trafficChestWall', 'หน้าอก / ซี่โครง / ราวนม', true, 'ผิดรูป/ยุบ'),
        renderTrafficPart('trafficChestClavicle', 'ไหปลาร้า', false, 'ผิดรูป/ปูดนูน'),
        renderTrafficPart('trafficChestUpperBack', 'หลังส่วนบน / สะบัก', true)
      ].join('\n'),
      signsName: 'trafficChestSigns',
      signsNoneId: 'trafficChestSignsNoneCb',
      signsCols: 'grid-cols-1 sm:grid-cols-3',
      signs: [
        { value: 'chest_dyspnea_tightness', title: ['หายใจหอบเหนื่อย', 'แน่นหน้าอก'], desc: 'รู้สึกหายใจเข้าได้ไม่สุด' },
        { value: 'pleuritic_pain_cough', title: ['เจ็บแปล๊บหน้าอก /', 'ซี่โครงเวลาหายใจ'], desc: 'เจ็บเวลาหายใจเข้าลึกๆ หรือไอ' },
        { value: 'rib_clavicle_deformity_tenderness', title: ['ไหปลาร้า / ซี่โครง', 'ปูดนูนหรือกดเจ็บมาก'] }
      ]
    })}

    ${renderTrafficRegionBox({
      parentId: 'trafficParentAbdomen',
      subGroupId: 'trafficAbdSubGroup',
      title: ['2.4 หน้าท้อง เอว', 'หลังล่าง เชิงกราน'],
      partsHtml: [
        renderTrafficPart('trafficAbdWall', 'หน้าท้อง / ชายโครง', true, 'ท้องอืดตึง'),
        renderTrafficPart('trafficAbdFlank', 'สีข้าง / บั้นเอว'),
        renderTrafficPart('trafficAbdLowerBack', 'หลังส่วนล่าง (แนวกระดูกเอว)', true),
        renderTrafficPart('trafficAbdPelvis', 'สะโพก / เชิงกราน / ก้นกบ', true),
        renderTrafficPart('trafficAbdGenitalia', 'ขาหนีบ / อวัยวะเพศ', true)
      ].join('\n'),
      signsName: 'trafficAbdSigns',
      signsNoneId: 'trafficAbdSignsNoneCb',
      signs: [
        { value: 'peritonitis_seatbelt_sign', title: ['ปวดท้องรุนแรง', 'ท้องตึง'], desc: 'หรือมีรอยช้ำพาดขวางหน้าท้อง' },
        { value: 'pelvic_instability_pain', title: ['ปวดสะโพก เชิงกราน', 'ขยับขาไม่ไหว'], desc: 'ปวดมากจนขยับขาหรือยืนลงน้ำหนักไม่ได้' },
        { value: 'cauda_equina_sciatica', title: ['ปวดร้าวลงขา ชาขา', 'กลั้นขับถ่ายไม่ได้'] },
        { value: 'hematuria_anuria', title: ['ปัสสาวะไม่ออก', 'หรือมีเลือดปน'] }
      ]
    })}

    ${renderTrafficRegionBox({
      parentId: 'trafficParentUpperExtremity',
      subGroupId: 'trafficUpperExtSubGroup',
      title: ['2.5 ไหล่ แขน มือ', 'และนิ้วมือ'],
      partsHtml: [
        renderTrafficPart('trafficArmShoulder', 'หัวไหล่ / ต้นแขน'),
        renderTrafficPart('trafficArmElbowForearm', 'ข้อศอก / แขนท่อนล่าง'),
        renderTrafficPart('trafficArmWristHand', 'ข้อมือ / ฝ่ามือ / หลังมือ'),
        renderTrafficDigits('trafficArmFingers', 'นิ้วมือ')
      ].join('\n'),
      signsName: 'trafficUpperExtSigns',
      signsNoneId: 'trafficUpperExtSignsNoneCb',
      signs: [
        { value: 'deformity_fracture_dislocation', title: ['แขน มือ นิ้วผิดรูป', 'บวมโตบิดเบี้ยว'] },
        { value: 'inability_to_move', title: ['ปวดจนยกแขนไม่ได้', 'กำ/เหยียดนิ้วไม่ลง'] },
        { value: 'numbness_sensory_loss', title: ['มีอาการชา', 'หรือไร้ความรู้สึก'], desc: 'บริเวณแขน ฝ่ามือ หรือปลายนิ้วมือ' },
        { value: 'pallor_pulseless_cold_cyanosis', title: ['ปลายนิ้วมือซีดขาว', 'เย็นเฉียบ / ม่วงคล้ำ'] },
        { value: 'open_fracture_bone_exposed', title: ['มีแผลเปิดลึก', 'มองเห็นกระดูกโผล่'], colSpan2: true }
      ]
    })}

    ${renderTrafficRegionBox({
      parentId: 'trafficParentLowerExtremity',
      subGroupId: 'trafficLowerExtSubGroup',
      title: ['2.6 ต้นขา เข่า', 'ข้อเท้าและนิ้วเท้า'],
      partsHtml: [
        renderTrafficPart('trafficLegThigh', 'ต้นขา'),
        renderTrafficPart('trafficLegKneeShin', 'หัวเข่า / หน้าแข้ง / น่อง'),
        renderTrafficPart('trafficLegAnkleFoot', 'ข้อเท้า / ส้นเท้า / ฝ่าเท้า / หลังเท้า'),
        renderTrafficDigits('trafficLegToes', 'นิ้วเท้า')
      ].join('\n'),
      signsName: 'trafficLowerExtSigns',
      signsNoneId: 'trafficLowerExtSignsNoneCb',
      signs: [
        { value: 'deformity_fracture_shortening', title: ['ขา เข่า ข้อเท้า', 'บวมผิดรูป'], desc: 'หรือขาสั้นยาวไม่เท่ากัน' },
        { value: 'inability_to_bear_weight', title: ['เดินหรือยืน', 'ลงน้ำหนักไม่ได้เลย'] },
        { value: 'numbness_drop_foot_cyanosis', title: ['ชาปลายเท้า ซีดเย็น', 'กระดกข้อเท้าไม่ขึ้น'] },
        { value: 'open_fracture_spoke_injury', title: ['แผลเปิดเห็นกระดูก', 'หรือซี่ล้อบาดลึก'] }
      ]
    })}

    <!-- 2.7 ตำแหน่งอื่นๆ -->
    <div class="space-y-3">
      <label class="selectable-card flex items-center p-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 hover:border-medical-400 transition cursor-pointer">
        <input type="checkbox" id="trafficParentOther" onchange="toggleTrafficGroup('trafficOtherSubGroup', this.checked)" class="text-medical-600 focus:ring-medical-500 h-5 w-5 rounded flex-shrink-0">
        <span class="ml-3 text-xs sm:text-sm font-bold text-slate-900">2.7 ตำแหน่งอื่นๆ (พิมพ์ระบุ)</span>
      </label>
      <div id="trafficOtherSubGroup" class="hidden space-y-2 pl-4 sm:pl-6 border-l-2 border-medical-200 text-xs sm:text-sm">
        <div class="flex flex-wrap items-center gap-3">
          <span class="font-medium text-slate-600">ลักษณะบาดเจ็บ:</span>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="trafficOtherLocationInjuries" value="wound" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">มีแผล</span></label>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="trafficOtherLocationInjuries" value="pain_swelling" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">ปวด/บวม</span></label>
          <label class="flex items-center cursor-pointer"><input type="checkbox" name="trafficOtherLocationInjuries" value="deformity" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">ผิดรูป</span></label>
        </div>
        <input type="text" id="trafficOtherLocationDetail" placeholder="พิมพ์ระบุตำแหน่งบาดแผลหรืออาการบาดเจ็บเพิ่มเติม..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-medical-500 focus:bg-white">
      </div>
    </div>
  </div>

  <!-- CARD 3: อาการผิดปกติของร่างกายและระดับความปวด -->
  <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
    <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
      <div class="p-2 rounded-xl bg-medical-100 text-medical-700"><i data-lucide="activity" class="w-5 h-5"></i></div>
      <div>
        <h2 class="text-base font-bold text-slate-900">3. อาการผิดปกติของร่างกาย และระดับความปวด</h2>
        <p class="text-xs text-slate-500">คัดกรองอาการหน้ามืด เป็นลม ภาวะเสียเลือด และระดับความปวด</p>
      </div>
    </div>
    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
      ${renderTrafficSysHeader({
        label: '3.1 อาการผิดปกติของร่างกายที่พบร่วมด้วย (เลือกได้หลายข้อ)',
        icon: 'alert-triangle',
        colorClass: 'bg-amber-100 text-amber-700',
        toggleKind: 'checkbox',
        toggleId: 'trafficSystemicNoneCb',
        toggleName: 'trafficSystemicSigns',
        toggleValue: 'no_systemic_signs',
        toggleLabel: 'ไม่มีอาการในหมวดนี้',
        toggleOnchange: "handleTrafficGroupNoneToggle(this, 'trafficSystemicSigns')"
      })}
      ${renderTrafficGrid('grid-cols-1 sm:grid-cols-3', [
        { name: 'trafficSystemicSigns', value: 'presyncope_dizziness', title: ['หน้ามืด เวียนศีรษะ', 'ตาพร่าเวลาลุกนั่ง'], onchange: "handleTrafficGroupItemChange(this, 'trafficSystemicNoneCb')", compact: true },
        { name: 'trafficSystemicSigns', value: 'palpitation_cold_sweat_pallor', title: ['ใจสั่น เหงื่อแตก', 'ตัวเย็นซีด'], desc: 'หรือกระหายน้ำมาก', onchange: "handleTrafficGroupItemChange(this, 'trafficSystemicNoneCb')", compact: true },
        { name: 'trafficSystemicSigns', value: 'drowsy_confused_weakness', title: ['ง่วงซึม สับสน', 'อ่อนเพลียไม่มีแรง'], onchange: "handleTrafficGroupItemChange(this, 'trafficSystemicNoneCb')", compact: true }
      ])}
    </div>
    <div class="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label class="block text-xs sm:text-sm font-semibold text-slate-800 tracking-wider">3.2 ระดับความปวดในขณะนี้ (0 – 10)</label>
        <div class="flex items-center space-x-2">
          <span id="trafficPainScoreBadge" class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all">
            <span id="trafficPainScoreEmoji" class="text-base">⚪</span>
            <span id="trafficPainScoreText">ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)</span>
          </span>
          <button type="button" id="trafficPainScoreClearBtn" onclick="clearTrafficPainScore()" class="text-xs text-slate-400 hover:text-rose-600 underline hidden transition" title="ล้างค่าเพื่อให้เป็นไม่ได้ระบุ">ล้างค่า</button>
        </div>
      </div>
      <div class="px-1 pt-1"><input type="range" id="trafficPainScore" min="0" max="10" value="0" step="1" oninput="handleTrafficPainScoreChange(this.value)" class="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-600 focus:outline-none focus:ring-2 focus:ring-medical-500"></div>
      <div class="grid grid-cols-5 text-center text-[10px] sm:text-[11px] pt-1 gap-1 text-slate-500 font-medium">
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setTrafficPainScore(0)"><span class="text-lg sm:text-xl block">😊</span><span>0: สบายดี</span></div>
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setTrafficPainScore(2)"><span class="text-lg sm:text-xl block">🙂</span><span>1–3: เล็กน้อย</span></div>
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setTrafficPainScore(5)"><span class="text-lg sm:text-xl block">😐</span><span>4–6: ปานกลาง</span></div>
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setTrafficPainScore(8)"><span class="text-lg sm:text-xl block">😣</span><span>7–9: ปวดมาก</span></div>
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setTrafficPainScore(10)"><span class="text-lg sm:text-xl block">😭</span><span>10: ปวดที่สุด</span></div>
      </div>
    </div>
  </div>

  <!-- CARD 4: อาการนำก่อนเกิดเหตุ ยาประจำตัว บาดทะยัก อาหารมื้อล่าสุด และข้อมูลสตรี -->
  <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
    <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
      <div class="p-2 rounded-xl bg-medical-100 text-medical-700"><i data-lucide="shield-plus" class="w-5 h-5"></i></div>
      <div>
        <h2 class="text-base font-bold text-slate-900">4. อาการนำก่อนเกิดเหตุ ยาประจำตัว วัคซีนบาดทะยัก และอาหารมื้อล่าสุด</h2>
        <p class="text-xs text-slate-500">ประวัติสาเหตุก่อนเกิดเหตุ ยาละลายลิ่มเลือด วัคซีน และเวลาที่รับประทานมื้อล่าสุด</p>
      </div>
    </div>

    <!-- 4.1 อาการนำก่อนเกิดเหตุ -->
    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
      ${renderTrafficSysHeader({
        label: '4.1 ก่อนเกิดอุบัติเหตุ มีอาการผิดปกตินำมาก่อน หรือดื่มแอลกอฮอล์หรือไม่',
        icon: 'zap',
        colorClass: 'bg-amber-100 text-amber-700',
        toggleKind: 'checkbox',
        toggleId: 'trafficProdromeNoneCb',
        toggleName: 'trafficProdromeSigns',
        toggleValue: 'prodrome_none',
        toggleLabel: 'ไม่มีอาการนำ',
        toggleOnchange: "handleTrafficGroupNoneToggle(this, 'trafficProdromeSigns')"
      })}
      ${renderTrafficGrid('grid-cols-1 sm:grid-cols-3', [
        { name: 'trafficProdromeSigns', value: 'prodrome_syncope_medical', title: ['วูบ แน่นหน้าอก ชัก', 'หรืออ่อนแรงก่อนเกิด'], onchange: "handleTrafficGroupItemChange(this, 'trafficProdromeNoneCb')", compact: true },
        { name: 'trafficProdromeSigns', value: 'prodrome_drowsy_sleep', title: ['ง่วงนอน หรือหลับใน', 'ก่อนเกิดเหตุ'], onchange: "handleTrafficGroupItemChange(this, 'trafficProdromeNoneCb')", compact: true },
        { name: 'trafficProdromeSigns', value: 'prodrome_alcohol_drugs', title: ['ดื่มแอลกอฮอล์', 'หรือกินยาง่วงซึม'], onchange: "handleTrafficGroupItemChange(this, 'trafficProdromeNoneCb')", compact: true }
      ])}
    </div>

    <!-- 4.2 ยาละลายลิ่มเลือด -->
    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
      ${renderTrafficSysHeader({
        label: '4.2 ยาละลายลิ่มเลือด หรือโรคเลือดหยุดยาก <span class="text-rose-500">*</span>',
        icon: 'pill',
        colorClass: 'bg-blue-100 text-blue-700',
        toggleKind: 'radio',
        toggleId: 'trafficAnticoagNoneRb',
        toggleName: 'trafficAnticoagulantHx',
        toggleValue: 'no_anticoagulant',
        toggleLabel: 'ไม่มี / ไม่ได้ใช้'
      })}
      ${renderTrafficGrid('grid-cols-1 sm:grid-cols-2', [
        { kind: 'radio', name: 'trafficAnticoagulantHx', value: 'anticoagulant_antiplatelet', title: ['ใช้ยาละลายลิ่มเลือด', '/ ต้านเกล็ดเลือด'], desc: 'เช่น วาร์ฟาริน แอสไพริน', compact: true },
        { kind: 'radio', name: 'trafficAnticoagulantHx', value: 'bleeding_disorder_cirrhosis', title: ['มีโรคเลือดหยุดยาก', 'หรือโรคตับแข็ง'], compact: true }
      ])}
    </div>

    <!-- 4.3 ประวัติการได้รับวัคซีนป้องกันบาดทะยัก (Locked Tetanus Standard) -->
    <div class="pt-3 border-t border-slate-100">
      <label class="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">4.3 ประวัติการได้รับวัคซีนป้องกันบาดทะยัก</label>
      ${renderTrafficGrid('grid-cols-1 sm:grid-cols-2', [
        {
          kind: 'radio',
          name: 'trafficTetanusHx',
          value: 'within_5_years',
          title: ['ฉีดกระตุ้น', 'ภายใน 5 ปี'],
          desc: 'เคยฉีดครบ (3 เข็ม) มาก่อน และเข็มสุดท้ายหรือกระตุ้นไม่เกิน 5 ปี',
          compact: true
        },
        {
          kind: 'radio',
          name: 'trafficTetanusHx',
          value: '5_to_10_years',
          title: ['ฉีดล่าสุด', '5–10 ปีก่อน'],
          desc: 'เคยฉีดครบ (3 เข็ม) มาก่อน และเข็มสุดท้ายหรือกระตุ้นอยู่ในช่วง 5–10 ปี',
          compact: true
        },
        {
          kind: 'radio',
          name: 'trafficTetanusHx',
          value: 'over_10_years',
          title: ['ฉีดครบ', 'เกิน 10 ปีแล้ว'],
          desc: 'เคยฉีดครบ (3 เข็ม) มาก่อน แต่เข็มสุดท้ายนานเกิน 10 ปีแล้ว',
          compact: true
        },
        {
          kind: 'radio',
          name: 'trafficTetanusHx',
          value: 'unknown_or_never',
          title: ['ไม่เคยฉีด', '/ จำไม่ได้'],
          desc: 'ไม่เคยได้รับวัคซีนบาดทะยัก ฉีดไม่ครบ 3 เข็ม หรือไม่ทราบประวัติ',
          compact: true
        }
      ])}
    </div>

    <!-- 4.4 ประวัติการรับประทานอาหารหรือดื่มน้ำครั้งสุดท้าย -->
    <div class="pt-3 border-t border-slate-100 space-y-2.5">
      <div>
        <label class="block text-xs sm:text-sm font-semibold text-slate-800">4.4 ประวัติการรับประทานอาหารหรือดื่มน้ำครั้งสุดท้าย:</label>
        <p class="text-xs text-slate-500">สำหรับวางแผนกรณีต้องตรวจพิเศษหรือผ่าตัด</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <span class="text-xs sm:text-sm text-slate-600 block mb-1">เวลาที่รับประทานครั้งสุดท้าย:</span>
          <input type="text" id="trafficNpoExactTime" data-universal-time="true" placeholder="เช่น 12:30 (24 ชม.)" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-medical-500 focus:bg-white">
        </div>
        <div>
          <span class="text-xs sm:text-sm text-slate-600 block mb-1">ระยะเวลาที่งดน้ำ/อาหารมาแล้ว:</span>
          <div class="space-y-1 text-xs sm:text-sm">
            <label class="flex items-center cursor-pointer"><input type="radio" name="trafficNpoDuration" value="less_than_2_hours" class="text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">ไม่เกิน 2 ชั่วโมง</span></label>
            <label class="flex items-center cursor-pointer"><input type="radio" name="trafficNpoDuration" value="2_to_6_hours" class="text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">ประมาณ 2 – 6 ชั่วโมง</span></label>
            <label class="flex items-center cursor-pointer"><input type="radio" name="trafficNpoDuration" value="over_6_hours" class="text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">มากกว่า 6 ชั่วโมงขึ้นไป</span></label>
            <label class="flex items-center cursor-pointer"><input type="radio" name="trafficNpoDuration" value="unknown" class="text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">จำไม่ได้แน่ชัด</span></label>
          </div>
        </div>
        <div>
          <span class="text-xs sm:text-sm text-slate-600 block mb-1">สิ่งที่รับประทานครั้งสุดท้าย:</span>
          <input type="text" id="trafficNpoLastFoodDetail" placeholder="เช่น ข้าวผัดและน้ำเปล่า..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-medical-500 focus:bg-white">
        </div>
      </div>
    </div>

    <!-- 4.5 ส่วนเฉพาะผู้ป่วยสตรี (Hidden by default - C-AP13) -->
    <div id="trafficFemaleSection" class="hidden pt-3 border-t border-slate-100">
      <div class="p-3.5 bg-pink-50/40 rounded-xl border border-pink-100 space-y-3">
        ${renderTrafficSysHeader({
          label: '4.5 ประจำเดือนและการตั้งครรภ์ (เฉพาะสตรี)',
          icon: 'heart-pulse',
          colorClass: 'bg-pink-100 text-pink-700',
          toggleKind: 'radio',
          toggleId: 'trafficPregNotPregRb',
          toggleName: 'trafficPregnancyStatus',
          toggleValue: 'not_pregnant',
          toggleLabel: 'ไม่ได้ตั้งครรภ์'
        })}
        ${renderTrafficGrid('grid-cols-1 sm:grid-cols-2', [
          { kind: 'radio', name: 'trafficPregnancyStatus', value: 'suspected_or_missed', title: ['ขาดประจำเดือน', '/ สงสัยตั้งครรภ์'], compact: true },
          { kind: 'radio', name: 'trafficPregnancyStatus', value: 'confirmed_pregnant', title: ['ยืนยัน', 'กำลังตั้งครรภ์'], compact: true },
          { kind: 'radio', name: 'trafficPregnancyStatus', value: 'menopause_or_hysterectomy', title: ['หมดประจำเดือน', '/ ผ่าตัดมดลูกแล้ว'], compact: true },
          { kind: 'radio', name: 'trafficPregnancyStatus', value: 'unknown', title: ['ไม่ทราบ'], compact: true }
        ])}
        <div class="max-w-xs">
          <label class="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">วันแรกของประจำเดือนครั้งล่าสุด (ถ้าจำได้):</label>
          <input type="text" id="trafficLmpDate" data-universal-date="true" placeholder="วว/ดด/ปปปป เช่น 28/10/2026" class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
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
    <textarea id="traffic_accident_other_free" rows="2" placeholder="พิมพ์ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)..."
      class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"></textarea>
  </div>

</div>
`;


// --- MODULE OBJECT DEFINITION ---
const trafficAccidentModule = {
  id: 'traffic_accident',
  recordCc: 'traffic_accident',
  schemaCode: 'traffic_accident',
  titleTh: 'ได้รับบาดเจ็บจากอุบัติเหตุจราจร',
  titleEn: 'Traffic accident injury',
  icon: 'car',
  doctorCcBadgeHtml: '<i data-lucide="car" class="w-3.5 h-3.5 mr-1 text-medical-600"></i> CC: ได้รับบาดเจ็บจากอุบัติเหตุจราจร (Traffic Accident)',
  pmhSectionNumber: 5,
  dateFields: ['trafficExactDate', 'trafficLmpDate'],
  timeFields: ['trafficExactTime', 'trafficNpoExactTime'],
  algorithm: 'traffic-accident-protocol',
  sectionDomId: 'cc-traffic-accident-section',
  formHtml: TRAFFIC_ACCIDENT_FORM_HTML,

  // --- Mounting & Lifecycle Hooks ---
  init() {
    clearTrafficPainScore();
  },

  onTitleChange(arg) {
    let isFemale = false;
    if (typeof arg === 'boolean') isFemale = arg;
    else if (typeof arg === 'object' && arg !== null) {
      isFemale = typeof arg.isFemale === 'boolean' ? arg.isFemale : (typeof arg.title === 'string' ? /นาง|น\.ส\.|ด\.ญ\.|หญิง|Mrs|Miss|Ms/i.test(arg.title) : isTrafficFemalePatient(arg));
    } else if (typeof arg === 'string') {
      isFemale = /นาง|น\.ส\.|ด\.ญ\.|หญิง|Mrs|Miss|Ms/i.test(arg);
    }
    toggleTrafficFemaleSection(isFemale);
  },

  onSelectForm() { checkAndDisplayTrafficLmp(); },
  onActivate(patient) { checkAndDisplayTrafficLmp(patient); },
  resetForm() { this.clearForm(); },

  // --- Form Data Extraction Hook ---
  collectIntake(ctx = {}) {
    const _rawDur = parseFloat(document.getElementById('trafficDurationVal')?.value);
    const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
    const durationUnit = document.getElementById('trafficDurationUnit')?.value || 'minutes';

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
      chief_complaint: 'traffic_accident',
      chief_complaint_title: 'ได้รับบาดเจ็บจากอุบัติเหตุจราจร',
      timestamp: new Date().toISOString(),
      status: ctx.recordStatus || 'waiting',
      durationVal,
      durationUnit,
      trafficExactDate: getText('trafficExactDate'),
      trafficExactTime: getText('trafficExactTime'),
      hospRecordStatus: ctx.hospRecordStatus || '',
      underlying: ctx.underlying || [],
      drugAllergy: ctx.drugAllergy || 'ไม่ได้ระบุ',
      currentMeds: ctx.currentMeds || 'ไม่ได้ระบุ',
      otherSymptomsFree: getText('traffic_accident_other_free') || ctx.otherSymptomsFree || '',
      doctor_notes: ctx.preservedDoctorNotes || { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.8, sbp: 120, dbp: 80, bp: '120/80', pr: 76, rr: 16, spo2: 99 },
      esi_level: 3,

      // Vehicle & Mechanisms
      trafficVehicleRole: getRadioValue('trafficVehicleRole'),
      trafficMotoRole: getRadioValue('trafficMotoRole'),
      trafficMotoHelmet: getRadioValue('trafficMotoHelmet'),
      trafficMotoMechs: getCheckedValues('trafficMotoMechs'),
      trafficMotoOpponentTypes: getCheckedValues('trafficMotoOpponentTypes'),
      trafficMotoOpponentOtherDetail: getText('trafficMotoOpponentOtherDetail'),

      trafficCarVehicleTypeDetail: getText('trafficCarVehicleTypeDetail'),
      trafficCarRoleSeat: getRadioValue('trafficCarRoleSeat'),
      trafficCarSeatbelt: getRadioValue('trafficCarSeatbelt'),
      trafficCarMechs: getCheckedValues('trafficCarMechs'),
      trafficCarOpponentDetail: getText('trafficCarOpponentDetail'),

      trafficPedVehicleType: getRadioValue('trafficPedVehicleType'),
      trafficPedVehicleOtherDetail: getText('trafficPedVehicleOtherDetail'),
      trafficPedMechs: getCheckedValues('trafficPedMechs'),

      trafficBikeHelmet: getRadioValue('trafficBikeHelmet'),
      trafficBikeMechs: getCheckedValues('trafficBikeMechs'),

      trafficOtherVehicleTypeDetail: getText('trafficOtherVehicleTypeDetail'),
      trafficOtherVehicleMechs: getCheckedValues('trafficOtherVehicleMechs'),
      trafficOtherOpponentDetail: getText('trafficOtherOpponentDetail'),

      trafficBleedingStatus: getRadioValue('trafficBleedingStatus'),

      // 7 Anatomical Regions + Sides + Injuries
      trafficParentHeadFace: getChecked('trafficParentHeadFace'),
      trafficParentNeck: getChecked('trafficParentNeck'),
      trafficParentChest: getChecked('trafficParentChest'),
      trafficParentAbdomen: getChecked('trafficParentAbdomen'),
      trafficParentUpperExtremity: getChecked('trafficParentUpperExtremity'),
      trafficParentLowerExtremity: getChecked('trafficParentLowerExtremity'),
      trafficParentOther: getChecked('trafficParentOther'),
      trafficOtherLocationInjuries: getCheckedValues('trafficOtherLocationInjuries'),
      trafficOtherLocationDetail: getText('trafficOtherLocationDetail'),

      trafficHeadSigns: getCheckedValues('trafficHeadSigns'),
      trafficNeckSigns: getCheckedValues('trafficNeckSigns'),
      trafficChestSigns: getCheckedValues('trafficChestSigns'),
      trafficAbdSigns: getCheckedValues('trafficAbdSigns'),
      trafficUpperExtSigns: getCheckedValues('trafficUpperExtSigns'),
      trafficLowerExtSigns: getCheckedValues('trafficLowerExtSigns'),

      trafficArmFingers: getChecked('trafficArmFingers'),
      trafficArmFingersLeftDigits: getCheckedValues('trafficArmFingersLeftDigits'),
      trafficArmFingersRightDigits: getCheckedValues('trafficArmFingersRightDigits'),
      trafficArmFingersInjuries: getCheckedValues('trafficArmFingersInjuries'),

      trafficLegToes: getChecked('trafficLegToes'),
      trafficLegToesLeftDigits: getCheckedValues('trafficLegToesLeftDigits'),
      trafficLegToesRightDigits: getCheckedValues('trafficLegToesRightDigits'),
      trafficLegToesInjuries: getCheckedValues('trafficLegToesInjuries'),

      ...(() => {
        const pts = {};
        ['HeadScalp', 'HeadFace', 'HeadEye', 'HeadEar', 'HeadNoseMouth', 'NeckBack', 'NeckFront', 'NeckSide', 'ChestWall', 'ChestClavicle', 'ChestUpperBack', 'AbdWall', 'AbdFlank', 'AbdLowerBack', 'AbdPelvis', 'AbdGenitalia', 'ArmShoulder', 'ArmElbowForearm', 'ArmWristHand', 'LegThigh', 'LegKneeShin', 'LegAnkleFoot'].forEach(k => {
          pts['traffic' + k] = getChecked('traffic' + k);
          pts['traffic' + k + 'Sides'] = getCheckedValues('traffic' + k + 'Sides');
          pts['traffic' + k + 'Injuries'] = getCheckedValues('traffic' + k + 'Injuries');
        });
        return pts;
      })(),
      trafficSystemicSigns: getCheckedValues('trafficSystemicSigns'),
      painScore: trafficPainScoreTouched ? parseInt(document.getElementById('trafficPainScore')?.value || '0', 10) : null,

      trafficProdromeSigns: getCheckedValues('trafficProdromeSigns'),
      trafficAnticoagulantHx: getRadioValue('trafficAnticoagulantHx'),

      // Female LMP & Pregnancy (C-AP13 Male Guard)
      ...(isTrafficFemaleCtx(ctx) ? {
        trafficLmpDate: getText('trafficLmpDate'),
        trafficPregnancyStatus: getRadioValue('trafficPregnancyStatus') || ''
      } : {}),

      // Tetanus & NPO
      trafficTetanusHx: getRadioValue('trafficTetanusHx'),
      trafficNpoExactTime: getText('trafficNpoExactTime'),
      trafficNpoDuration: getRadioValue('trafficNpoDuration'),
      trafficNpoLastFoodDetail: getText('trafficNpoLastFoodDetail')
    };

    return rec;
  },

  // --- Form Hydration Hook ---
  hydrateForm(patient) {
    this.clearForm();
    if (!patient) return;

    if (patient.durationVal) {
      const valEl = document.getElementById('trafficDurationVal');
      if (valEl) valEl.value = patient.durationVal;
    }
    if (patient.durationUnit) {
      const unitEl = document.getElementById('trafficDurationUnit');
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

    setText('trafficExactDate', patient.trafficExactDate);
    setText('trafficExactTime', patient.trafficExactTime);

    setRadioValue('trafficVehicleRole', patient.trafficVehicleRole);
    setRadioValue('trafficMotoRole', patient.trafficMotoRole);
    setRadioValue('trafficMotoHelmet', patient.trafficMotoHelmet);
    setCheckedValues('trafficMotoMechs', patient.trafficMotoMechs);
    setCheckedValues('trafficMotoOpponentTypes', patient.trafficMotoOpponentTypes);
    setText('trafficMotoOpponentOtherDetail', patient.trafficMotoOpponentOtherDetail);

    setText('trafficCarVehicleTypeDetail', patient.trafficCarVehicleTypeDetail);
    setRadioValue('trafficCarRoleSeat', patient.trafficCarRoleSeat);
    setRadioValue('trafficCarSeatbelt', patient.trafficCarSeatbelt);
    setCheckedValues('trafficCarMechs', patient.trafficCarMechs);
    setText('trafficCarOpponentDetail', patient.trafficCarOpponentDetail);

    setRadioValue('trafficPedVehicleType', patient.trafficPedVehicleType);
    setText('trafficPedVehicleOtherDetail', patient.trafficPedVehicleOtherDetail);
    setCheckedValues('trafficPedMechs', patient.trafficPedMechs);

    setRadioValue('trafficBikeHelmet', patient.trafficBikeHelmet);
    setCheckedValues('trafficBikeMechs', patient.trafficBikeMechs);

    setText('trafficOtherVehicleTypeDetail', patient.trafficOtherVehicleTypeDetail);
    setCheckedValues('trafficOtherVehicleMechs', patient.trafficOtherVehicleMechs);
    setText('trafficOtherOpponentDetail', patient.trafficOtherOpponentDetail);

    setRadioValue('trafficBleedingStatus', patient.trafficBleedingStatus);

    // Anatomy
    ['ParentHeadFace', 'ParentNeck', 'ParentChest', 'ParentAbdomen', 'ParentUpperExtremity', 'ParentLowerExtremity', 'ParentOther'].forEach(p => setChecked('traffic' + p, patient['traffic' + p]));
    ['HeadSigns', 'NeckSigns', 'ChestSigns', 'AbdSigns', 'UpperExtSigns', 'LowerExtSigns'].forEach(s => {
      const rawArr = patient['traffic' + s];
      const vals = (s === 'HeadSigns' && Array.isArray(rawArr))
        ? rawArr.flatMap(x => (x === 'maxillofacial_malocclusion' ? ['malocclusion_jaw_locked', 'broken_loose_tooth'] : [x]))
        : rawArr;
      setCheckedValues('traffic' + s, vals);
    });

    setChecked('trafficArmFingers', patient.trafficArmFingers);
    setCheckedValues('trafficArmFingersLeftDigits', patient.trafficArmFingersLeftDigits);
    setCheckedValues('trafficArmFingersRightDigits', patient.trafficArmFingersRightDigits);
    setCheckedValues('trafficArmFingersInjuries', patient.trafficArmFingersInjuries);

    setChecked('trafficLegToes', patient.trafficLegToes);
    setCheckedValues('trafficLegToesLeftDigits', patient.trafficLegToesLeftDigits);
    setCheckedValues('trafficLegToesRightDigits', patient.trafficLegToesRightDigits);
    setCheckedValues('trafficLegToesInjuries', patient.trafficLegToesInjuries);

    setCheckedValues('trafficOtherLocationInjuries', patient.trafficOtherLocationInjuries);
    setText('trafficOtherLocationDetail', patient.trafficOtherLocationDetail);

    ['HeadScalp', 'HeadFace', 'HeadEye', 'HeadEar', 'HeadNoseMouth', 'NeckBack', 'NeckFront', 'NeckSide', 'ChestWall', 'ChestClavicle', 'ChestUpperBack', 'AbdWall', 'AbdFlank', 'AbdLowerBack', 'AbdPelvis', 'AbdGenitalia', 'ArmShoulder', 'ArmElbowForearm', 'ArmWristHand', 'LegThigh', 'LegKneeShin', 'LegAnkleFoot'].forEach(k => {
      setChecked('traffic' + k, patient['traffic' + k]);
      setCheckedValues('traffic' + k + 'Sides', patient['traffic' + k + 'Sides']);
      setCheckedValues('traffic' + k + 'Injuries', patient['traffic' + k + 'Injuries']);
      toggleTrafficGroup('traffic' + k + 'Detail', patient['traffic' + k]);
    });

    setCheckedValues('trafficSystemicSigns', patient.trafficSystemicSigns);
    setCheckedValues('trafficProdromeSigns', patient.trafficProdromeSigns);
    setRadioValue('trafficAnticoagulantHx', patient.trafficAnticoagulantHx);

    const isFem = isTrafficFemalePatient(patient);
    toggleTrafficFemaleSection(isFem);
    if (isFem) {
      setText('trafficLmpDate', patient.trafficLmpDate || patient.trafficLmpExactDate || '');
      const legacyStatusMap = { missed_period: 'suspected_or_missed', pregnant: 'confirmed_pregnant', menopause_hysterectomy: 'menopause_or_hysterectomy' };
      const resolvedStatus = patient.trafficPregnancyStatus || legacyStatusMap[patient.trafficLmpStatus] || '';
      setRadioValue('trafficPregnancyStatus', resolvedStatus);
    }

    const legacyTetanusMap = { over_10_years_or_never: 'unknown_or_never', within_5y: 'within_5_years', '5_to_10y': '5_to_10_years', over_10y: 'over_10_years' };
    setRadioValue('trafficTetanusHx', legacyTetanusMap[patient.trafficTetanusHx] || patient.trafficTetanusHx);
    setText('trafficNpoExactTime', patient.trafficNpoExactTime);
    setRadioValue('trafficNpoDuration', patient.trafficNpoDuration);
    setText('trafficNpoLastFoodDetail', patient.trafficNpoLastFoodDetail);
    setText('traffic_accident_other_free', patient.otherSymptomsFree);

    // Refresh UI display states
    handleTrafficVehicleChange();
    handleTrafficMotoCollisionChange();
    handleTrafficCarCollisionChange();
    handleTrafficPedVehicleChange();
    handleTrafficOtherVehicleCollisionChange();
    checkAndDisplayTrafficLmp(patient);

    toggleTrafficGroup('trafficHeadFaceSubGroup', patient.trafficParentHeadFace);
    toggleTrafficGroup('trafficNeckSubGroup', patient.trafficParentNeck);
    toggleTrafficGroup('trafficChestSubGroup', patient.trafficParentChest);
    toggleTrafficGroup('trafficAbdSubGroup', patient.trafficParentAbdomen);
    toggleTrafficGroup('trafficUpperExtSubGroup', patient.trafficParentUpperExtremity);
    toggleTrafficGroup('trafficLowerExtSubGroup', patient.trafficParentLowerExtremity);
    toggleTrafficGroup('trafficArmFingersDetail', patient.trafficArmFingers);
    toggleTrafficGroup('trafficLegToesDetail', patient.trafficLegToes);
    toggleTrafficGroup('trafficOtherSubGroup', patient.trafficParentOther);

    if (patient.painScore !== null && patient.painScore !== undefined) {
      handleTrafficPainScoreChange(patient.painScore);
    } else {
      clearTrafficPainScore();
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
    sec.querySelectorAll('input[type="number"]').forEach(ni => { ni.value = ''; });

    sec.querySelectorAll('select').forEach(el => { el.selectedIndex = 0; });

    const hiddenContainers = [
      'trafficBranchMotorcycle', 'trafficMotoOpponentContainer', 'trafficBranchCarTruck', 'trafficCarOpponentContainer',
      'trafficBranchPedestrian', 'trafficPedOtherContainer', 'trafficBranchBicycleScooter', 'trafficBranchOtherVehicle',
      'trafficOtherOpponentContainer', 'trafficHeadFaceSubGroup', 'trafficNeckSubGroup', 'trafficChestSubGroup',
      'trafficAbdSubGroup', 'trafficUpperExtSubGroup', 'trafficLowerExtSubGroup', 'trafficArmFingersDetail', 'trafficLegToesDetail',
      'trafficOtherSubGroup', 'trafficFemaleSection',
      ...['HeadScalp', 'HeadFace', 'HeadEye', 'HeadEar', 'HeadNoseMouth', 'NeckBack', 'NeckFront', 'NeckSide', 'ChestWall', 'ChestClavicle', 'ChestUpperBack', 'AbdWall', 'AbdFlank', 'AbdLowerBack', 'AbdPelvis', 'AbdGenitalia', 'ArmShoulder', 'ArmElbowForearm', 'ArmWristHand', 'LegThigh', 'LegKneeShin', 'LegAnkleFoot'].map(k => 'traffic' + k + 'Detail')
    ];
    hiddenContainers.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });

    clearTrafficPainScore();
  },

  // --- Evaluation & CDS Interface ---
  isRedFlag(patient) {
    const rfs = evaluateTrafficRedFlags(patient);
    return rfs.length > 0;
  },

  evaluateRedFlags(patient) {
    return evaluateTrafficRedFlags(patient);
  },

  updateOutputs(patient) {
    return updateTrafficOutputs(patient);
  },

  renderRapidHpi(patient) {
    return renderTrafficRapidHpi(patient);
  },

  renderNarrativeHpi(patient) {
    return renderTrafficNarrativeHpi(patient);
  },

  // --- 4 Clinical Seed Cases (บริบทประเทศไทย) ---
  seedPatients: [
    // Case 1: Motorcycle vs Pickup High Impact, No Helmet, LOC, Hemorrhagic Shock Signs (ESI 1)
    {
      id: 'case-traffic-01', queue_number: 'E1-113', hn: '8901901',
      name: 'นายกฤษดา ขับขี่จยย.ชนประสานงารถกระบะ ไม่สวมหมวก สลบ หอบเหนื่อย ปวดท้องซ้ายบน', age: 22, gender: 'ชาย',
      chief_complaint: 'traffic_accident', chief_complaint_title: 'ได้รับบาดเจ็บจากอุบัติเหตุจราจร',
      timestamp: '2026-11-10T18:30:00.000Z', status: 'waiting',
      durationVal: 30, durationUnit: 'minutes', trafficExactDate: '10/11/2026', trafficExactTime: '18:30',
      hospRecordStatus: 'self', underlying: [], drugAllergy: 'ปฏิเสธ', currentMeds: 'ไม่มี',
      otherSymptomsFree: 'ขับขี่รถจักรยานยนต์ชนประสานงากับรถกระบะ ร่างกระเด็นตกจากรถ ไม่ได้สวมหมวกกันน็อก สลบไปชั่วขณะ จำเหตุการณ์ไม่ได้ มีแผลแตกที่หน้าผากขวา เจ็บซี่โครงซ้าย หายใจหอบเหนื่อย ปวดท้องซ้ายบน และเหงื่อแตกตัวเย็น',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.5, sbp: 88, dbp: 54, bp: '88/54', pr: 124, rr: 28, spo2: 94 },
      esi_level: 1,
      trafficVehicleRole: 'motorcycle', trafficMotoRole: 'driver', trafficMotoHelmet: 'no_helmet',
      trafficMotoMechs: ['collision_vehicle', 'ejected_thrown'],
      trafficMotoOpponentTypes: ['car_pickup_van'], trafficMotoOpponentOtherDetail: '',
      trafficBleedingStatus: 'oozing_continuous',
      trafficParentHeadFace: true, trafficHeadScalp: true, trafficHeadScalpSides: ['right'], trafficHeadScalpInjuries: ['wound', 'pain_swelling'],
      trafficHeadSigns: ['loc_amnesia', 'severe_headache_vomiting'],
      trafficParentNeck: false,
      trafficParentChest: true, trafficChestWall: true, trafficChestWallSides: ['left'], trafficChestWallInjuries: ['pain_swelling'],
      trafficChestSigns: ['chest_dyspnea_tightness', 'pleuritic_pain_cough'],
      trafficParentAbdomen: true, trafficAbdWall: true, trafficAbdWallSides: ['left'], trafficAbdWallInjuries: ['pain_swelling'],
      trafficAbdSigns: ['peritonitis_seatbelt_sign'],
      trafficParentUpperExtremity: false, trafficParentLowerExtremity: false, trafficParentOther: false,
      trafficSystemicSigns: ['palpitation_cold_sweat_pallor', 'presyncope_dizziness'],
      painScore: 9,
      trafficProdromeSigns: ['prodrome_none'], trafficAnticoagulantHx: 'no_anticoagulant',
      trafficTetanusHx: 'unknown_or_never',
      trafficNpoExactTime: '17:00', trafficNpoDuration: 'less_than_2_hours', trafficNpoLastFoodDetail: 'ข้าวราดแกงและน้ำเปล่า'
    },

    // Case 2: Car Rear-End Collision, Drowsy Driving, C-Spine Radiculopathy, Seatbelt Sign, Female LMP (ESI 2)
    {
      id: 'case-traffic-02', queue_number: 'E2-114', hn: '8901902',
      name: 'นางสาวพิมลพรรณ ขับเก๋งชนท้ายรถบรรทุก หลับใน ปวดตึงคอชาแขนขวา รอยช้ำคาดหน้าท้อง', age: 38, gender: 'หญิง',
      chief_complaint: 'traffic_accident', chief_complaint_title: 'ได้รับบาดเจ็บจากอุบัติเหตุจราจร',
      timestamp: '2026-11-10T18:15:00.000Z', status: 'waiting',
      durationVal: 45, durationUnit: 'minutes', trafficExactDate: '10/11/2026', trafficExactTime: '18:15',
      hospRecordStatus: 'self', underlying: ['ภูมิแพ้ (Allergy)'], drugAllergy: 'ปฏิเสธ', currentMeds: 'Cetirizine',
      otherSymptomsFree: 'ขับรถเก๋งชนท้ายรถบรรทุกสิบล้อ มีอาการหลับในก่อนชน คาดเข็มขัดนิรภัย ถุงลมนิรภัยทำงาน ไม่สลบ ปวดตึงแนวกระดูกต้นคอด้านหลังมาก ชาแปล๊บลงแขนขวาและนิ้วโป้ง-ชี้ขวา เจ็บหน้าอกตรงกลาง มีรอยช้ำคาดเข็มขัดที่หน้าท้อง',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.8, sbp: 136, dbp: 84, bp: '136/84', pr: 92, rr: 20, spo2: 98 },
      esi_level: 2,
      trafficVehicleRole: 'car_truck', trafficCarVehicleTypeDetail: 'รถเก๋ง', trafficCarRoleSeat: 'driver', trafficCarSeatbelt: 'belt_worn',
      trafficCarMechs: ['high_impact_collision', 'airbag_deployed_windshield'], trafficCarOpponentDetail: 'ชนท้ายรถบรรทุกสิบล้อ',
      trafficBleedingStatus: 'none_or_contusion',
      trafficParentHeadFace: false,
      trafficParentNeck: true, trafficNeckBack: true, trafficNeckBackSides: ['center'], trafficNeckBackInjuries: ['pain_swelling'],
      trafficNeckSigns: ['cspine_severe_pain_stiff', 'radiculopathy_weakness_numbness'],
      trafficParentChest: true, trafficChestWall: true, trafficChestWallSides: ['center'], trafficChestWallInjuries: ['pain_swelling'],
      trafficChestSigns: ['pleuritic_pain_cough'],
      trafficParentAbdomen: true, trafficAbdWall: true, trafficAbdWallSides: ['center'], trafficAbdWallInjuries: ['pain_swelling'],
      trafficAbdSigns: ['peritonitis_seatbelt_sign'],
      trafficParentUpperExtremity: true, trafficArmWristHand: false, trafficArmFingers: true,
      trafficArmFingersRightDigits: ['thumb', 'index'], trafficArmFingersInjuries: ['pain_swelling'],
      trafficUpperExtSigns: ['numbness_sensory_loss'],
      trafficParentLowerExtremity: false, trafficParentOther: false,
      trafficSystemicSigns: ['no_systemic_signs'],
      painScore: 7,
      trafficProdromeSigns: ['prodrome_drowsy_sleep'], trafficAnticoagulantHx: 'no_anticoagulant',
      trafficLmpDate: '25/10/2026', trafficPregnancyStatus: 'not_pregnant',
      trafficTetanusHx: '5_to_10_years',
      trafficNpoExactTime: '13:00', trafficNpoDuration: '2_to_6_hours', trafficNpoLastFoodDetail: 'กาแฟเย็นและขนมปัง'
    },

    // Case 3: Pedestrian Struck by Motorcycle, Open Leg Fracture, On Aspirin (ESI 2)
    {
      id: 'case-traffic-03', queue_number: 'E2-115', hn: '8901903',
      name: 'นายสมบัติ คนเดินเท้าถูกจยย.พุ่งชน หน้าแข้งขวาบวมผิดรูปแผลเปิดเห็นกระดูก ทานแอสไพริน', age: 64, gender: 'ชาย',
      chief_complaint: 'traffic_accident', chief_complaint_title: 'ได้รับบาดเจ็บจากอุบัติเหตุจราจร',
      timestamp: '2026-11-10T18:20:00.000Z', status: 'waiting',
      durationVal: 40, durationUnit: 'minutes', trafficExactDate: '10/11/2026', trafficExactTime: '18:20',
      hospRecordStatus: 'self', underlying: ['ความดันสูง (HT)', 'ไขมันในเลือดสูง (DLP)'], drugAllergy: 'ปฏิเสธ', currentMeds: 'Aspirin, Amlodipine, Atorvastatin',
      otherSymptomsFree: 'เดินข้ามถนนถูกรถจักรยานยนต์พุ่งชนอย่างแรง ล้มกระแทกพื้น ไม่สลบ ไม่เจ็บคอ ขาและหน้าแข้งขวาบวมผิดรูป มีแผลฉีกขาดลึกเห็นกระดูกโผล่ เลือดไหลซึมต่อเนื่อง ยืนลงน้ำหนักไม่ได้ ประจำทานยา Aspirin',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.7, sbp: 148, dbp: 88, bp: '148/88', pr: 88, rr: 18, spo2: 99 },
      esi_level: 2,
      trafficVehicleRole: 'pedestrian', trafficPedVehicleType: 'motorcycle',
      trafficPedMechs: ['direct_impact_thrown'],
      trafficBleedingStatus: 'oozing_continuous',
      trafficParentHeadFace: false, trafficParentNeck: false, trafficParentChest: false, trafficParentAbdomen: false, trafficParentUpperExtremity: false,
      trafficParentLowerExtremity: true, trafficLegKneeShin: true, trafficLegKneeShinSides: ['right'], trafficLegKneeShinInjuries: ['wound', 'pain_swelling', 'deformity'],
      trafficLowerExtSigns: ['deformity_fracture_shortening', 'inability_to_bear_weight', 'open_fracture_spoke_injury'],
      trafficParentOther: false,
      trafficSystemicSigns: ['no_systemic_signs'],
      painScore: 8,
      trafficProdromeSigns: ['prodrome_none'], trafficAnticoagulantHx: 'anticoagulant_antiplatelet',
      trafficTetanusHx: 'within_5_years',
      trafficNpoExactTime: '12:00', trafficNpoDuration: 'over_6_hours', trafficNpoLastFoodDetail: 'ก๋วยเตี๋ยวและน้ำเปล่า'
    },

    // Case 4: Motorcycle Fell Alone on Sand, Helmet Kept, Abrasions on Elbow/Knee/Fingers (ESI 3)
    {
      id: 'case-traffic-04', queue_number: 'E3-116', hn: '8901904',
      name: 'นางสาวจิราภรณ์ จยย.เสียหลักล้มเอง ใส่หมวก แผลถลอกศอกซ้าย เข่าซ้าย นิ้วมือนาง-ก้อยซ้าย', age: 27, gender: 'หญิง',
      chief_complaint: 'traffic_accident', chief_complaint_title: 'ได้รับบาดเจ็บจากอุบัติเหตุจราจร',
      timestamp: '2026-11-10T18:10:00.000Z', status: 'waiting',
      durationVal: 50, durationUnit: 'minutes', trafficExactDate: '10/11/2026', trafficExactTime: '18:10',
      hospRecordStatus: 'self', underlying: [], drugAllergy: 'ปฏิเสธ', currentMeds: 'ไม่มี',
      otherSymptomsFree: 'ขับรถจักรยานยนต์เสียหลักลื่นทรายล้มเอง สวมหมวกกันน็อก ไม่สลบ ไม่ปวดศีรษะ ไม่เจ็บคอ มีแผลถลอกที่ข้อศอกซ้าย หัวเข่าซ้าย และนิ้วนาง-นิ้วก้อยมือซ้าย เลือดหยุดไหลแล้ว ขยับและเดินลงน้ำหนักได้ตามปกติ',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.6, sbp: 118, dbp: 74, bp: '118/74', pr: 74, rr: 16, spo2: 99 },
      esi_level: 3,
      trafficVehicleRole: 'motorcycle', trafficMotoRole: 'driver', trafficMotoHelmet: 'helmet_kept',
      trafficMotoMechs: ['lost_control_alone'],
      trafficBleedingStatus: 'abrasion_or_stopped',
      trafficParentHeadFace: false, trafficParentNeck: false, trafficParentChest: false, trafficParentAbdomen: false,
      trafficParentUpperExtremity: true,
      trafficArmElbowForearm: true, trafficArmElbowForearmSides: ['left'], trafficArmElbowForearmInjuries: ['wound', 'pain_swelling'],
      trafficArmFingers: true, trafficArmFingersLeftDigits: ['ring', 'little'], trafficArmFingersInjuries: ['wound', 'pain_swelling'],
      trafficUpperExtSigns: [],
      trafficParentLowerExtremity: true,
      trafficLegKneeShin: true, trafficLegKneeShinSides: ['left'], trafficLegKneeShinInjuries: ['wound', 'pain_swelling'],
      trafficLowerExtSigns: [],
      trafficParentOther: false,
      trafficSystemicSigns: ['no_systemic_signs'],
      painScore: 3,
      trafficProdromeSigns: ['prodrome_none'], trafficAnticoagulantHx: 'no_anticoagulant',
      trafficLmpDate: '28/10/2026', trafficPregnancyStatus: 'not_pregnant',
      trafficTetanusHx: 'within_5_years',
      trafficNpoExactTime: '12:30', trafficNpoDuration: 'over_6_hours', trafficNpoLastFoodDetail: 'ข้าวผัดกะเพราและน้ำดื่ม'
    }
  ]
};

// Aliases for compatibility
trafficAccidentModule.seedCases = trafficAccidentModule.seedPatients;

// Register module in Ratchaburi ER Core Registry
if (typeof registerCcModule === 'function') registerCcModule(trafficAccidentModule);
else if (typeof window !== 'undefined' && typeof window.registerCcModule === 'function') window.registerCcModule(trafficAccidentModule);

if (typeof module !== 'undefined' && module.exports) {
  module.exports = trafficAccidentModule;
}
