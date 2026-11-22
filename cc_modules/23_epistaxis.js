// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 23_epistaxis.js
// อาการนำ: เลือดกำเดาไหล (Epistaxis / Nosebleed)
// ปรับปรุงตามมาตรฐาน plan_epistaxis.md, plan-cc และ code-cc (กลุ่ม B1)
// =========================================================================

// --- Internal DOM & UI Helpers ---
function getEpistaxisEl(id) {
  return typeof document !== 'undefined' ? document.getElementById(id) : null;
}

function queryEpistaxisOne(selector) {
  return typeof document !== 'undefined' ? document.querySelector(selector) : null;
}

function queryEpistaxisAll(selector) {
  return typeof document !== 'undefined' ? Array.from(document.querySelectorAll(selector)) : [];
}

function wrapEpistaxisWords(chunks) {
  if (!Array.isArray(chunks)) return chunks;
  return chunks.map(c => `<span class="inline-block whitespace-nowrap">${c}</span>`).join(' ');
}

function renderEpistaxisOption(cfg) {
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
  const titleHtml = Array.isArray(title) ? wrapEpistaxisWords(title) : title;
  const bodyHtml = desc
    ? `<div class="ml-3 leading-snug"><span class="block text-xs sm:text-sm font-semibold text-slate-800">${titleHtml}</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">${desc}</span></div>`
    : `<span class="ml-3 ${compact ? 'text-xs' : 'text-xs sm:text-sm'} font-semibold text-slate-800 leading-snug">${titleHtml}</span>`;
  return `<label class="selectable-card bg-white flex ${alignCls} ${padCls} rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition${spanCls}"><input type="${kind}" ${idAttr}${nameAttr}${valAttr}${chgAttr}class="${topCls}${roundCls}text-medical-600 focus:ring-medical-500 ${szCls} flex-shrink-0">${bodyHtml}</label>`;
}

function renderEpistaxisGrid(colsCls, items, shared = {}) {
  return `<div class="grid ${colsCls} gap-2.5">${items.map(it => renderEpistaxisOption({ ...shared, ...it })).join('\n')}</div>`;
}

function renderEpistaxisSysHeader({
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

function renderEpistaxisSubPanel(subId, title, items, extraHtml = '') {
  return `<div id="${subId}" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-3 space-y-2.5">
    <div class="text-xs font-semibold text-slate-700">${title}</div>
    ${extraHtml}
    ${renderEpistaxisGrid('grid-cols-1 sm:grid-cols-2', items, { compact: true })}
  </div>`;
}

const EPISTAXIS_WARN_PARENT_TO_SUB = {
  epistaxisWarnAirwayParent: 'epistaxisWarnAirwaySub',
  epistaxisWarnShockParent: 'epistaxisWarnShockSub',
  epistaxisWarnBleedingParent: 'epistaxisWarnBleedingSub',
  epistaxisWarnHeadNeckParent: 'epistaxisWarnHeadNeckSub'
};

// --- Progressive Disclosure & Corner-Toggle Handlers ---
function toggleEpistaxisGroup(subId, show) {
  const el = getEpistaxisEl(subId);
  if (!el) return;
  if (show) {
    el.classList.remove('hidden');
    if (subId === 'epistaxisTraumaSub') {
      const trigNone = getEpistaxisEl('epistaxis_trig_none');
      if (trigNone) trigNone.checked = false;
    } else if (subId.startsWith('epistaxisWarn')) {
      const warnNone = getEpistaxisEl('epistaxis_warn_none');
      if (warnNone) warnNone.checked = false;
    }
  } else {
    el.classList.add('hidden');
    el.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    const textInput = el.querySelector('input[type="text"]');
    if (textInput) textInput.value = '';
  }
}

function handleEpistaxisTrigChange(clickedEl) {
  if (!clickedEl) return;
  if (clickedEl.value === 'trig_spontaneous') {
    if (clickedEl.checked) {
      queryEpistaxisAll('input[name="epistaxisTriggers"]').forEach(cb => {
        if (cb.value !== 'trig_spontaneous') cb.checked = false;
      });
      const traumaParent = getEpistaxisEl('epistaxisTraumaParent');
      if (traumaParent) traumaParent.checked = false;
      toggleEpistaxisGroup('epistaxisTraumaSub', false);
    }
  } else if (clickedEl.checked) {
    const noneCb = queryEpistaxisOne('input[name="epistaxisTriggers"][value="trig_spontaneous"]');
    if (noneCb) noneCb.checked = false;
  }
}

function handleEpistaxisMedChange(clickedEl) {
  if (!clickedEl) return;
  if (clickedEl.value === 'none') {
    if (clickedEl.checked) {
      queryEpistaxisAll('input[name="epistaxisMeds"]').forEach(cb => {
        if (cb.value !== 'none') cb.checked = false;
      });
    }
  } else if (clickedEl.checked) {
    const noneCb = queryEpistaxisOne('input[name="epistaxisMeds"][value="none"]');
    if (noneCb) noneCb.checked = false;
  }
}

function handleEpistaxisGroupItemChange(noneId, clickedEl) {
  if (clickedEl && clickedEl.checked) {
    const noneEl = getEpistaxisEl(noneId);
    if (noneEl) noneEl.checked = false;
  }
}

function handleEpistaxisGroupNoneToggle(groupKey, clickedEl) {
  if (!clickedEl || !clickedEl.checked) return;
  if (groupKey === 'dir') {
    queryEpistaxisAll('input[name="epistaxisDirection"]').forEach(cb => { cb.checked = false; });
  } else if (groupKey === 'warn') {
    Object.entries(EPISTAXIS_WARN_PARENT_TO_SUB).forEach(([parentId, subId]) => {
      const pEl = getEpistaxisEl(parentId);
      if (pEl) pEl.checked = false;
      toggleEpistaxisGroup(subId, false);
    });
    queryEpistaxisAll('input[name="epistaxisWarningSigns"]').forEach(cb => { cb.checked = false; });
    queryEpistaxisAll('input[name="epistaxisAcuteCranial"]').forEach(cb => { cb.checked = false; });
  } else if (groupKey === 'ud') {
    queryEpistaxisAll('input[name="epistaxisUnderlying"]').forEach(cb => { cb.checked = false; });
  }
}

// --- Clinical Decision Support & Evaluation Functions ---
function evaluateEpistaxisRedFlags(patient) {
  const rfs = [];
  const vs = patient.vital_signs || {};
  const sbp = vs.sbp !== undefined && vs.sbp !== null ? parseInt(vs.sbp, 10) : null;
  const dbp = vs.dbp !== undefined && vs.dbp !== null ? parseInt(vs.dbp, 10) : null;
  const pr = vs.pr !== undefined && vs.pr !== null ? parseInt(vs.pr, 10) : null;

  const warnSigns = Array.isArray(patient.epistaxisWarningSigns) ? patient.epistaxisWarningSigns : [];
  const direction = Array.isArray(patient.epistaxisDirection) ? patient.epistaxisDirection : [];
  const cranialSigns = Array.isArray(patient.epistaxisAcuteCranial) ? patient.epistaxisAcuteCranial : [];
  const traumaSigns = Array.isArray(patient.epistaxisTraumaSigns) ? patient.epistaxisTraumaSigns : [];
  const meds = Array.isArray(patient.epistaxisMeds) ? patient.epistaxisMeds : [];
  const underlying = Array.isArray(patient.epistaxisUnderlying) ? patient.epistaxisUnderlying : [];

  // 1. Massive Hemorrhage / Airway Threat / Shock (ESI 1)
  const isAirwayThreat = warnSigns.includes('warn_stridor_airway_tight') || warnSigns.includes('warn_choking_swallow');
  const isShock = warnSigns.includes('warn_dizziness_presyncope') || warnSigns.includes('warn_profuse_sweat_cold_shock') || (sbp !== null && sbp < 90) || (pr !== null && pr > 120);
  if (patient.epistaxisVolume === 'heavy_clots' && (isAirwayThreat || isShock)) {
    rfs.push({
      key: 'rf_massive_epistaxis_shock',
      level: 1,
      textTh: 'Massive Epistaxis / Airway Threat & Hemorrhagic Shock / เลือดกำเดาทะลักปริมาณมาก คุกคามทางเดินหายใจหรือช็อก',
      risk: 'Asphyxiation from blood aspiration, profound hypovolemia, and circulatory collapse.',
      suggestedAction: 'Immediate ABC stabilization, suction airway, lean forward, 2 large-bore IVs, urgent anterior/posterior packing, stat ENT consult.'
    });
  }

  // 2. Maxillofacial / Basilar Skull Fracture with CSF Leak (ESI 2)
  if (patient.epistaxisTrauma && (traumaSigns.includes('trauma_csf_leak_rhinorrhea') || traumaSigns.includes('trauma_raccoon_eyes') || traumaSigns.includes('trauma_nasal_deformity'))) {
    rfs.push({
      key: 'rf_basilar_skull_trauma_csf',
      level: 2,
      textTh: 'Maxillofacial Trauma / Basilar Skull Fracture with CSF Leak / สงสัยฐานกะโหลกศีรษะแตกและน้ำไขสันหลังรั่ว',
      risk: 'Direct intracranial penetration if packed blindly, meningitis, pneumocephalus.',
      suggestedAction: 'Absolute CONTRAINDICATION to blind nasal packing or NG tube. Stat CT Facial bones and CT Brain, Neurosurgery & ENT consult.'
    });
  }

  // 3. Suspected Posterior Epistaxis / Refractory to Compression (ESI 2)
  const isPosteriorFlow = direction.includes('dripping_throat') || direction.includes('failed_compression') || direction.includes('vomited_blood_clots');
  const isElderlyBilateral = patient.epistaxisSide === 'bilateral' && patient.age >= 60;
  if (isPosteriorFlow || isElderlyBilateral) {
    rfs.push({
      key: 'rf_posterior_epistaxis',
      level: 2,
      textTh: 'Suspected Posterior Epistaxis / Refractory to Compression / สงสัยเลือดออกจากหลอดเลือดส่วนหลังโพรงจมูก',
      risk: 'Uncontrolled bleeding from sphenopalatine branches, high risk of aspiration and refractory hemorrhage.',
      suggestedAction: 'Inspect posterior oropharynx, suction clots, apply topical vasoconstrictor, prepare posterior packing / balloon catheter tamponade.'
    });
  }

  // 4. Anticoagulant / Antiplatelet-associated Epistaxis / Coagulopathy (ESI 3)
  const hasAnticoag = meds.includes('anticoagulant_warfarin') || meds.includes('antiplatelet_aspirin') || meds.includes('meds_unknown');
  const hasCoagulopathy = underlying.includes('cirrhosis') || underlying.includes('esrd') || underlying.includes('coagulopathy');
  const hasBleedingSigns = warnSigns.includes('warn_petechiae_purpura') || warnSigns.includes('warn_mucosal_or_melena') || warnSigns.includes('warn_hematuria') || warnSigns.includes('warn_melena');
  if (hasAnticoag || hasCoagulopathy || hasBleedingSigns) {
    rfs.push({
      key: 'rf_anticoagulant_bleeding',
      level: 3,
      textTh: 'Anticoagulant-Associated Epistaxis / Coagulopathy / ภาวะเลือดออกจากยาต้านการแข็งตัวของเลือดหรือโรคเลือด',
      risk: 'Impaired clot formation leading to prolonged, recurrent or severe hemorrhage.',
      suggestedAction: 'Hold anticoagulants, stat CBC (Platelet), PT/INR, PTT. Consider reversal agents (Vit K, FFP, PCC) if severe; use dissolvable packing.'
    });
  }

  // 5. Hypertensive Urgency / Emergency with Epistaxis (ESI 3)
  const hasSevereBP = (sbp !== null && sbp >= 180) || (dbp !== null && dbp >= 110);
  const hasCranialSymptoms = cranialSigns.includes('severe_headache');
  if (hasSevereBP || (hasCranialSymptoms && underlying.includes('htn'))) {
    rfs.push({
      key: 'rf_hypertensive_urgency',
      level: 3,
      textTh: 'Hypertensive Urgency / Severe Hypertension with Epistaxis / ความดันโลหิตสูงวิกฤตร่วมกับเลือดกำเดาไหล',
      risk: 'Target organ damage and increased arterial bleeding pressure.',
      suggestedAction: 'Direct local hemostasis first. Check for target organ damage (ECG, renal function). Controlled, gradual BP reduction.'
    });
  }

  // 6. Recurrent Epistaxis / Suspected Head & Neck Mass (NPC) (ESI 3)
  const hasHeadNeckSigns = warnSigns.includes('warn_cervical_lymph_node') || warnSigns.includes('warn_unilateral_obstruction') || warnSigns.includes('warn_unilateral_tinnitus');
  if (hasHeadNeckSigns) {
    rfs.push({
      key: 'rf_suspected_npc_mass',
      level: 3,
      textTh: 'Recurrent Epistaxis / Suspected Head & Neck Mass (NPC) / เลือดออกร่วมกับก้อนที่คอหรืออาการหูอื้อคัดจมูกข้างเดียว',
      risk: 'Underlying neoplastic lesion such as Nasopharyngeal Carcinoma (NPC) or vascular malformation.',
      suggestedAction: 'Hemostasis according to protocol, schedule outpatient Nasoendoscopy and biopsy by ENT specialist.'
    });
  }

  return rfs;
}

// --- Formatters for Doctor Rapid Note ---
const EPISTAXIS_DUR_UNIT_MAP = {
  minutes: 'นาที',
  hours: 'ชั่วโมง',
  days: 'วัน',
  weeks: 'สัปดาห์',
  months: 'เดือน',
  years: 'ปี'
};

const EPISTAXIS_SIDE_MAP = {
  left: 'ข้างซ้ายข้างเดียว',
  right: 'ข้างขวาข้างเดียว',
  bilateral: 'ไหลทั้งสองข้างพร้อมกัน'
};

const EPISTAXIS_ACTIVE_MAP = {
  active: 'ยังมีเลือดไหลอยู่ขณะนี้',
  stopped: 'เลือดหยุดไหลแล้วก่อนมาถึง'
};

const EPISTAXIS_RECURRENCE_MAP = {
  highest_in_life: 'ไหลมากที่สุดในชีวิต',
  recurrent_episodes: 'เคยไหลซ้ำๆ แบบนี้มาก่อน'
};

const EPISTAXIS_VOLUME_MAP = {
  mild_oozing: 'ไหลซึมๆ หยดช้าๆ หรือเปื้อนกระดาษทิชชู',
  moderate_flow: 'ไหลเป็นสายต่อเนื่อง ชุ่มกระดาษหรือผ้าหลายผืน',
  heavy_clots: 'ไหลทะลักปริมาณมาก มีก้อนลิ่มเลือดขนาดใหญ่'
};

const EPISTAXIS_TRAUMA_SIGN_MAP = {
  trauma_csf_leak_rhinorrhea: 'มีน้ำใสไหลปนออกจากจมูก (ไม่ข้นเหมือนน้ำมูก)',
  trauma_raccoon_eyes: 'ช้ำรอบตาหรือหลังใบหู',
  trauma_nasal_deformity: 'ดั้งจมูกเบี้ยวหรือผิดรูป'
};

const EPISTAXIS_WARN_MAP = {
  warn_choking_swallow: 'สำลักเลือดหรือกลืนลำบาก',
  warn_stridor_airway_tight: 'หายใจติดขัด แน่นคอ หรือเสียงหวีด',
  warn_dizziness_presyncope: 'หน้ามืด วูบ หรือหมดสติ',
  warn_profuse_sweat_cold_shock: 'เหงื่อแตกตัวเย็น หรือใจสั่นเร็ว',
  warn_petechiae_purpura: 'จุดเลือดออกหรือจ้ำเลือดตามตัว',
  warn_mucosal_or_melena: 'เลือดออกตามไรฟัน',
  warn_hematuria: 'ปัสสาวะเป็นเลือด',
  warn_melena: 'ถ่ายอุจจาระสีดำ',
  warn_cervical_lymph_node: 'คลำพบก้อนที่คอหรือใต้กราม',
  warn_unilateral_obstruction: 'คัดจมูกข้างเดียวเรื้อรังหรือน้ำมูกกลิ่นเหม็น',
  warn_unilateral_tinnitus: 'หูอื้อหรือได้ยินลดลงข้างเดียว'
};

const EPISTAXIS_TRIGGER_MAP = {
  trig_nose_picking: 'มีประวัติแคะจมูก ขยี้จมูก หรือสั่งน้ำมูกแรง',
  trig_nasal_spray_dry_air: 'เพิ่งใช้ยาพ่นจมูก หรือสัมผัสอากาศแห้ง/เย็นจัด'
};

const EPISTAXIS_MED_MAP = {
  anticoagulant_warfarin: 'รับประทานยาละลายลิ่มเลือด (เช่น Warfarin, Eliquis, Xarelto, Pradaxa)',
  antiplatelet_aspirin: 'รับประทานยาต้านเกล็ดเลือด (เช่น Aspirin, Clopidogrel / Plavix)',
  meds_unknown: 'มียาโรคหัวใจ/หลอดเลือดประจำ แต่ไม่ทราบชื่อยา'
};

const EPISTAXIS_UD_MAP = {
  htn: 'โรคความดันโลหิตสูง',
  cirrhosis: 'โรคตับแข็ง หรือภาวะตับวายเรื้อรัง',
  esrd: 'โรคไตเรื้อรัง หรือกำลังฟอกไต',
  coagulopathy: 'โรคเลือดผิดปกติ หรือเกล็ดเลือดต่ำ'
};

const EPISTAXIS_HOSP_MAP = {
  ratchaburi: 'มีประวัติการรักษาที่ รพ.ราชบุรี',
  complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
  additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
  self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
  unspecified: 'ไม่ได้ระบุ'
};

function formatEpistaxisSide(patient) {
  return EPISTAXIS_SIDE_MAP[patient.epistaxisSide] || 'ไม่ได้ระบุ';
}

function formatEpistaxisActiveStatus(patient) {
  return EPISTAXIS_ACTIVE_MAP[patient.epistaxisActiveStatus] || 'ไม่ได้ระบุ';
}

function formatEpistaxisRecurrence(patient) {
  return EPISTAXIS_RECURRENCE_MAP[patient.epistaxisRecurrence] || 'ไม่ได้ระบุ';
}

function formatEpistaxisVolume(patient) {
  return EPISTAXIS_VOLUME_MAP[patient.epistaxisVolume] || 'ไม่ได้ระบุ';
}

// --- Rapid Note Generator (5 Standardized Sections) ---
function renderEpistaxisRapidHpi(patient) {
  const durVal = patient.durationVal;
  const durUnit = EPISTAXIS_DUR_UNIT_MAP[patient.durationUnit] || 'นาที';
  const durationStr = durVal ? `${durVal} ${durUnit}` : 'ไม่ได้ระบุ';

  const warnSigns = Array.isArray(patient.epistaxisWarningSigns) ? patient.epistaxisWarningSigns : [];
  const warnParents = patient.epistaxisWarnParents || {};
  const direction = Array.isArray(patient.epistaxisDirection) ? patient.epistaxisDirection : [];
  const cranialSigns = Array.isArray(patient.epistaxisAcuteCranial) ? patient.epistaxisAcuteCranial : [];
  const traumaSigns = Array.isArray(patient.epistaxisTraumaSigns) ? patient.epistaxisTraumaSigns : [];
  const triggers = Array.isArray(patient.epistaxisTriggers) ? patient.epistaxisTriggers : [];
  const meds = Array.isArray(patient.epistaxisMeds) ? patient.epistaxisMeds : [];
  const underlying = Array.isArray(patient.epistaxisUnderlying) ? patient.epistaxisUnderlying : [];

  const posList = [];
  const negList = [];

  // Associated symptoms & risk factors (de-duplicated from upper HPI lines)
  if (direction.includes('dripping_throat')) {
    posList.push('รู้สึกมีเลือดไหลลงคอ หรือต้องคอยกลืนเลือดตลอดเวลา');
  }
  if (direction.includes('vomited_blood_clots')) {
    posList.push('มีอาการอาเจียนหรือบ้วนออกมาเป็นลิ่มเลือด / สีกาแฟ');
  }
  if (cranialSigns.includes('severe_headache')) {
    posList.push('มีอาการปวดศีรษะรุนแรง ตาพร่ามัว หรือแน่นหน้าอกร่วมด้วย');
  }

  if (patient.epistaxisTrauma) {
    const tSigns = traumaSigns.map(k => EPISTAXIS_TRAUMA_SIGN_MAP[k]).filter(Boolean);
    const details = patient.epistaxisTraumaDetails ? `: ${patient.epistaxisTraumaDetails}` : '';
    posList.push(`มีประวัติถูกกระแทกที่จมูก ใบหน้า หรือศีรษะ${details}${tSigns.length > 0 ? ` (${tSigns.join(', ')})` : ''}`);
  }

  warnSigns.forEach(k => {
    if (EPISTAXIS_WARN_MAP[k]) posList.push(EPISTAXIS_WARN_MAP[k]);
  });
  // Fallback if patient checked a Progressive Parent checkbox without checking any sub-option
  if (warnParents.airway && !warnSigns.some(k => k === 'warn_choking_swallow' || k === 'warn_stridor_airway_tight')) {
    posList.push('สำลักหรือหายใจลำบาก');
  }
  if (warnParents.shock && !warnSigns.some(k => k === 'warn_dizziness_presyncope' || k === 'warn_profuse_sweat_cold_shock')) {
    posList.push('หน้ามืด วูบ หรือใจสั่นเหงื่อแตก');
  }
  if (warnParents.bleeding && !warnSigns.some(k => k === 'warn_petechiae_purpura' || k === 'warn_mucosal_or_melena' || k === 'warn_hematuria' || k === 'warn_melena')) {
    posList.push('เลือดออกที่อื่นหรือจ้ำเลือดตามตัว');
  }
  if (warnParents.headNeck && !warnSigns.some(k => k === 'warn_cervical_lymph_node' || k === 'warn_unilateral_obstruction' || k === 'warn_unilateral_tinnitus')) {
    posList.push('คัดจมูก หูอื้อ หรือคลำก้อนที่คอ');
  }

  triggers.forEach(k => {
    if (EPISTAXIS_TRIGGER_MAP[k]) posList.push(EPISTAXIS_TRIGGER_MAP[k]);
  });
  meds.forEach(k => {
    if (EPISTAXIS_MED_MAP[k]) posList.push(EPISTAXIS_MED_MAP[k]);
  });
  if (underlying.length > 0) {
    const udMapped = underlying.map(k => EPISTAXIS_UD_MAP[k]).filter(Boolean);
    if (udMapped.length > 0) posList.push(`โรคประจำตัวที่เกี่ยวข้อง: ${udMapped.join(', ')}`);
  }
  if (patient.otherSymptomsFree) {
    posList.push(patient.otherSymptomsFree);
  }

  // Confirmed negatives only (Zero Default Bias)
  if (patient.epistaxisDirNone) {
    negList.push('ปฏิเสธเลือดไหลลงคอ บีบปีกจมูกไม่หยุด และอาเจียนเป็นลิ่มเลือด');
  } else if (direction.length > 0) {
    if (!direction.includes('dripping_throat')) negList.push('ปฏิเสธเลือดไหลลงคอ');
    if (!direction.includes('vomited_blood_clots')) negList.push('ปฏิเสธอาเจียนเป็นลิ่มเลือด');
  }

  if (patient.epistaxisWarnNone) {
    negList.push('ปฏิเสธสำลักเลือด หายใจติดขัด หน้ามืดวูบ ปวดศีรษะรุนแรง จ้ำเลือดตามตัว และอาการเรื้อรังทางจมูก/หู/ก้อนที่คอ');
  } else if (warnSigns.length > 0 || cranialSigns.length > 0) {
    if (!warnSigns.includes('warn_choking_swallow') && !warnSigns.includes('warn_stridor_airway_tight')) {
      negList.push('ปฏิเสธการสำลักเลือด หายใจติดขัด หรือแน่นคอ');
    }
    if (!warnSigns.includes('warn_dizziness_presyncope') && !warnSigns.includes('warn_profuse_sweat_cold_shock')) {
      negList.push('ปฏิเสธหน้ามืด วูบ และเหงื่อแตกตัวเย็น');
    }
    if (!warnSigns.includes('warn_petechiae_purpura') && !warnSigns.includes('warn_mucosal_or_melena') && !warnSigns.includes('warn_hematuria') && !warnSigns.includes('warn_melena')) {
      negList.push('ปฏิเสธจุดจ้ำเลือด เลือดออกตามไรฟัน ปัสสาวะเป็นเลือด และถ่ายอุจจาระสีดำ');
    }
    if (!warnSigns.includes('warn_cervical_lymph_node') && !warnSigns.includes('warn_unilateral_obstruction') && !warnSigns.includes('warn_unilateral_tinnitus')) {
      negList.push('ปฏิเสธก้อนที่คอ คัดจมูกข้างเดียว และหูอื้อข้างเดียว');
    }
  }

  if (triggers.includes('trig_spontaneous') && !patient.epistaxisTrauma) {
    negList.push('ไม่มีสาเหตุนำหรือปัจจัยกระตุ้นชัดเจน (ไหลออกมาเอง)');
  }
  if (meds.includes('none')) {
    negList.push('ปฏิเสธการใช้ยาละลายลิ่มเลือดและยาต้านเกล็ดเลือด');
  }
  if (patient.epistaxisUdNone) {
    negList.push('ปฏิเสธโรคความดันโลหิตสูง โรคตับแข็ง โรคไตเรื้อรัง และโรคเลือด');
  }

  const hospLabel = EPISTAXIS_HOSP_MAP[patient.hospRecordStatus] || 'ไม่ได้ระบุ';
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
  const redFlags = evaluateEpistaxisRedFlags(patient);

  const compressionStr = direction.includes('failed_compression')
    ? 'บีบปีกจมูกแน่นเกิน 15–20 นาทีแล้วเลือดยังไม่หยุด'
    : (patient.epistaxisActiveStatus === 'stopped' ? 'เลือดหยุดไหลแล้วก่อนมาถึง' : 'ไม่ได้ระบุ');

  return `[Chief Complaint (CC)]
เลือดกำเดาไหล (Epistaxis) มา ${durationStr}

[History of Present Illness (HPI)]
• ระยะเวลาที่มีอาการ: ${durVal ? `เลือดกำเดาไหลมา ${durationStr}` : 'ไม่ได้ระบุ'} (ตำแหน่ง: ${formatEpistaxisSide(patient)}, สถานะ: ${formatEpistaxisActiveStatus(patient)})
• ประวัติความรุนแรงและการเป็นซ้ำ: ${formatEpistaxisRecurrence(patient)}
• ปริมาณเลือดที่ออก: ${formatEpistaxisVolume(patient)}
• การตอบสนองต่อการบีบปีกจมูก: ${compressionStr}

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
function renderEpistaxisNarrative(patient) {
  const durVal = patient.durationVal;
  const durUnit = EPISTAXIS_DUR_UNIT_MAP[patient.durationUnit] || 'นาที';
  const durStr = durVal ? `${durVal} ${durUnit}` : 'ไม่ระบุระยะเวลา';

  const sideStr = formatEpistaxisSide(patient);
  const activeStr = formatEpistaxisActiveStatus(patient);
  const volStr = formatEpistaxisVolume(patient);
  const recurStr = formatEpistaxisRecurrence(patient);

  const warnSigns = Array.isArray(patient.epistaxisWarningSigns) ? patient.epistaxisWarningSigns : [];
  const direction = Array.isArray(patient.epistaxisDirection) ? patient.epistaxisDirection : [];
  const triggers = Array.isArray(patient.epistaxisTriggers) ? patient.epistaxisTriggers : [];
  const meds = Array.isArray(patient.epistaxisMeds) ? patient.epistaxisMeds : [];
  const underlying = Array.isArray(patient.epistaxisUnderlying) ? patient.epistaxisUnderlying : [];

  const genderLabel = (patient.gender && patient.gender !== 'ไม่ระบุ') ? patient.gender : '';
  let note = `ผู้ป่วย${genderLabel} อายุ ${patient.age || 'ไม่ได้ระบุ'} ปี มารับการตรวจด้วยอาการเลือดกำเดาไหล เป็นมา ${durStr} ก่อนมาโรงพยาบาล ตำแหน่งที่เลือดออกคือ${sideStr} สถานะปัจจุบัน${activeStr} ประวัติความรุนแรง${recurStr} ปริมาณเลือดที่ออกคือ${volStr}`;

  if (direction.includes('dripping_throat')) {
    note += ' มีประวัติเลือดไหลลงคอต้องคอยกลืนเลือดตลอดเวลา';
  }
  if (direction.includes('failed_compression')) {
    note += ' บีบปีกจมูกแน่นต่อเนื่องเกิน 15–20 นาทีแล้วเลือดยังไม่ยอมหยุด';
  }
  if (direction.includes('vomited_blood_clots')) {
    note += ' มีอาการอาเจียนหรือบ้วนออกมาเป็นลิ่มเลือดหรือสีกาแฟ';
  }

  if (patient.epistaxisTrauma) {
    note += ` มีประวัติถูกกระแทกที่จมูก ใบหน้า หรือศีรษะ (${patient.epistaxisTraumaDetails || 'ไม่ได้ระบุรายละเอียด'})`;
  }

  if (warnSigns.length > 0) {
    const warnTexts = warnSigns.map(k => EPISTAXIS_WARN_MAP[k]).filter(Boolean);
    if (warnTexts.length > 0) note += ` ร่วมกับมีอาการเตือนสำคัญ ได้แก่ ${warnTexts.join(', ')}`;
  }

  const trigTexts = triggers.filter(k => k !== 'trig_spontaneous').map(k => EPISTAXIS_TRIGGER_MAP[k]).filter(Boolean);
  if (trigTexts.length > 0) note += ` ปัจจัยกระตุ้นคือ ${trigTexts.join(', ')}`;
  else if (triggers.includes('trig_spontaneous') && !patient.epistaxisTrauma) note += ' เกิดขึ้นเองโดยไม่มีปัจจัยกระตุ้นชัดเจน';

  const medTexts = meds.filter(k => k !== 'none').map(k => EPISTAXIS_MED_MAP[k]).filter(Boolean);
  if (medTexts.length > 0) note += ` ประวัติการใช้ยา: ${medTexts.join(', ')}`;

  const udTexts = underlying.map(k => EPISTAXIS_UD_MAP[k]).filter(Boolean);
  if (udTexts.length > 0) note += ` โรคประจำตัวที่เกี่ยวข้อง: ${udTexts.join(', ')}`;

  return note;
}

function renderEpistaxisDoctorHpi(patient) {
  return renderEpistaxisRapidHpi(patient);
}

// --- Output Dispatcher ---
function updateEpistaxisOutputs(rec) {
  if (!rec) return null;
  const rapidText = renderEpistaxisRapidHpi(rec);
  const narrativeText = renderEpistaxisNarrative(rec);
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

  const redFlags = evaluateEpistaxisRedFlags(rec);
  rec.redFlags = redFlags;

  const jsonOutput = {
    encounter: {
      chief_complaint: 'epistaxis',
      chief_complaint_title_th: 'เลือดกำเดาไหล',
      timestamp: rec.timestamp || new Date().toISOString(),
      duration_val: rec.durationVal || null,
      duration_unit: rec.durationUnit || 'minutes'
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
      side: rec.epistaxisSide || null,
      active_status: rec.epistaxisActiveStatus || null,
      recurrence: rec.epistaxisRecurrence || null,
      volume: rec.epistaxisVolume || null,
      direction: Array.isArray(rec.epistaxisDirection) ? rec.epistaxisDirection : [],
      acute_cranial: Array.isArray(rec.epistaxisAcuteCranial) ? rec.epistaxisAcuteCranial : [],
      trauma: {
        occurred: Boolean(rec.epistaxisTrauma),
        details: rec.epistaxisTraumaDetails || '',
        signs: Array.isArray(rec.epistaxisTraumaSigns) ? rec.epistaxisTraumaSigns : []
      },
      warning_signs: Array.isArray(rec.epistaxisWarningSigns) ? rec.epistaxisWarningSigns : [],
      triggers: Array.isArray(rec.epistaxisTriggers) ? rec.epistaxisTriggers : [],
      medications: Array.isArray(rec.epistaxisMeds) ? rec.epistaxisMeds : [],
      underlying_conditions: Array.isArray(rec.epistaxisUnderlying) ? rec.epistaxisUnderlying : [],
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
// UI TEMPLATE CONSTANTS (Golden UI/UX — 4 Cards + Universal PMH Card 5)
// =========================================================================
const EPISTAXIS_TRAUMA_SUB_HTML = renderEpistaxisSubPanel(
  'epistaxisTraumaSub',
  'อาการร่วมหลังถูกกระแทก (เลือกได้หลายข้อ)',
  [
    { name: 'epistaxisTraumaSigns', value: 'trauma_csf_leak_rhinorrhea', title: ['น้ำใสไหลปน', 'ออกจากจมูก'], desc: 'ใสคล้ายน้ำ ไม่ข้นเหนียว' },
    { name: 'epistaxisTraumaSigns', value: 'trauma_raccoon_eyes', title: ['ช้ำรอบตา /', 'หลังใบหู'] },
    { name: 'epistaxisTraumaSigns', value: 'trauma_nasal_deformity', title: ['ดั้งจมูกเบี้ยว /', 'ผิดรูป'], colSpan2: true }
  ],
  `<div>
    <label class="block text-slate-700 font-medium mb-1">เหตุการณ์ที่ถูกกระแทก (ถ้ามี):</label>
    <input type="text" id="epistaxisTraumaDetails" placeholder="เช่น รถล้มหน้ากระแทก, ถูกชกจมูก..."
      class="w-full bg-white px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-medical-500 focus:outline-none">
  </div>`
);

const EPISTAXIS_WARN_SUBS_HTML = [
  renderEpistaxisSubPanel('epistaxisWarnAirwaySub', 'ลักษณะอาการสำลักหรือหายใจ (เลือกได้หลายข้อ)', [
    { name: 'epistaxisWarningSigns', value: 'warn_choking_swallow', title: ['สำลักเลือด /', 'กลืนลำบาก'], onchange: `handleEpistaxisGroupItemChange('epistaxis_warn_none', this)` },
    { name: 'epistaxisWarningSigns', value: 'warn_stridor_airway_tight', title: ['หายใจติดขัด /', 'แน่นคอ /', 'เสียงหวีด'], onchange: `handleEpistaxisGroupItemChange('epistaxis_warn_none', this)` }
  ]),
  renderEpistaxisSubPanel('epistaxisWarnShockSub', 'ลักษณะอาการหน้ามืดหรือเสียเลือด (เลือกได้หลายข้อ)', [
    { name: 'epistaxisWarningSigns', value: 'warn_dizziness_presyncope', title: ['หน้ามืด / วูบ', 'หรือหมดสติ'], onchange: `handleEpistaxisGroupItemChange('epistaxis_warn_none', this)` },
    { name: 'epistaxisWarningSigns', value: 'warn_profuse_sweat_cold_shock', title: ['เหงื่อแตกตัวเย็น /', 'ใจสั่นเร็ว'], onchange: `handleEpistaxisGroupItemChange('epistaxis_warn_none', this)` }
  ]),
  renderEpistaxisSubPanel('epistaxisWarnBleedingSub', 'ตำแหน่งเลือดออกผิดปกติ (เลือกได้หลายข้อ)', [
    { name: 'epistaxisWarningSigns', value: 'warn_petechiae_purpura', title: ['จุดเลือดออก /', 'จ้ำเลือดตามตัว'], onchange: `handleEpistaxisGroupItemChange('epistaxis_warn_none', this)` },
    { name: 'epistaxisWarningSigns', value: 'warn_mucosal_or_melena', title: ['เลือดออก', 'ตามไรฟัน'], onchange: `handleEpistaxisGroupItemChange('epistaxis_warn_none', this)` },
    { name: 'epistaxisWarningSigns', value: 'warn_hematuria', title: ['ปัสสาวะเป็นเลือด'], onchange: `handleEpistaxisGroupItemChange('epistaxis_warn_none', this)` },
    { name: 'epistaxisWarningSigns', value: 'warn_melena', title: ['ถ่ายอุจจาระสีดำ'], onchange: `handleEpistaxisGroupItemChange('epistaxis_warn_none', this)` }
  ]),
  renderEpistaxisSubPanel('epistaxisWarnHeadNeckSub', 'อาการทางจมูก หู หรือลำคอ (เลือกได้หลายข้อ)', [
    { name: 'epistaxisWarningSigns', value: 'warn_unilateral_obstruction', title: ['คัดจมูกข้างเดียว', 'เรื้อรัง /', 'น้ำมูกกลิ่นเหม็น'], onchange: `handleEpistaxisGroupItemChange('epistaxis_warn_none', this)` },
    { name: 'epistaxisWarningSigns', value: 'warn_unilateral_tinnitus', title: ['หูอื้อ / ได้ยินลดลง', 'ข้างเดียว'], onchange: `handleEpistaxisGroupItemChange('epistaxis_warn_none', this)` },
    { name: 'epistaxisWarningSigns', value: 'warn_cervical_lymph_node', title: ['คลำพบก้อนที่คอ', '/ ใต้กราม'], onchange: `handleEpistaxisGroupItemChange('epistaxis_warn_none', this)`, colSpan2: true }
  ])
].join('\n');

// =========================================================================
// MODULE DEFINITION: epistaxisModule
// =========================================================================
const epistaxisModule = {
  id: 'epistaxis',
  schemaCode: 'epistaxis',
  recordCc: 'epistaxis',
  titleTh: 'เลือดกำเดาไหล',
  titleEn: 'Epistaxis / Nosebleed',
  icon: 'droplets',
  doctorCcBadgeHtml: '<i data-lucide="droplets" class="w-3.5 h-3.5 mr-1 text-rose-500"></i> CC: เลือดกำเดาไหล (Epistaxis)',
  algorithm: 'epistaxis-clinical-protocol',
  sectionDomId: 'cc-epistaxis-section',
  pmhSectionNumber: 5,
  getPmhSectionNumber: () => 5,
  dateFields: [],
  timeFields: [],
  branchIds: [
    'epistaxisTraumaSub',
    'epistaxisWarnAirwaySub',
    'epistaxisWarnShockSub',
    'epistaxisWarnBleedingSub',
    'epistaxisWarnHeadNeckSub'
  ],
  inputIdsToClear: [
    'epistaxisDurationVal',
    'epistaxisTraumaDetails',
    'epistaxis_other_free'
  ],

  formHtml: `
    <div id="cc-epistaxis-section" class="hidden space-y-6">
      <div data-cc-top-banner="epistaxis">
        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
          <div class="bg-amber-100 text-amber-800 p-2.5 rounded-xl flex-shrink-0 mt-0.5">
            <i data-lucide="alert-circle" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-amber-900 mb-1">คำแนะนำการปฐมพยาบาลเบื้องต้นระหว่างรอตรวจ</h3>
            <p class="text-xs text-amber-800 leading-relaxed">
              นั่งตัวตรง <strong>ก้มหน้าเล็กน้อย</strong> บีบปีกจมูกส่วนนิ่มทั้ง 2 ข้างค้างไว้ต่อเนื่อง 10–15 นาที และหายใจทางปากแทน <strong>ห้ามเงยหน้า และเลี่ยงการกลืนเลือด เพราะเสี่ยงต่อการสำลักเลือดลงหลอดลม</strong> หากเลือดไหลทะลักไม่หยุด สำลักเลือด หายใจติดขัด หรือหน้ามืดวูบ กรุณาแจ้งพยาบาลทันที
            </p>
          </div>
        </div>
      </div>

      <!-- CARD 1: ระยะเวลา ลักษณะเลือดที่ไหล และการห้ามเลือดเบื้องต้น -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="clock" class="w-5 h-5"></i>
          </div>
          <h2 class="text-base font-bold text-slate-900">1. ระยะเวลา ลักษณะเลือดที่ไหล และการห้ามเลือดเบื้องต้น</h2>
        </div>

        <div class="space-y-4">
          <div>
            ${renderEpistaxisSysHeader({
              label: '1.1 ระยะเวลาที่มีเลือดกำเดาไหลในครั้งนี้',
              icon: 'clock',
              colorClass: 'bg-sky-100 text-sky-700'
            })}
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div class="col-span-1 sm:col-span-2">
                <input type="number" id="epistaxisDurationVal" min="1" max="1000" placeholder="ระบุตัวเลข เช่น 20"
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm placeholder:text-slate-400 placeholder:font-normal">
              </div>
              <div class="col-span-1">
                <select id="epistaxisDurationUnit"
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm">
                  <option value="minutes" selected>นาที</option>
                  <option value="hours">ชั่วโมง</option>
                  <option value="days">วัน</option>
                  <option value="weeks">สัปดาห์</option>
                  <option value="months">เดือน</option>
                  <option value="years">ปี</option>
                </select>
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100">
            ${renderEpistaxisSysHeader({
              label: '1.2 ข้างที่มีเลือดกำเดาไหล',
              icon: 'arrow-left-right',
              colorClass: 'bg-sky-100 text-sky-700'
            })}
            ${renderEpistaxisGrid('grid-cols-1 sm:grid-cols-3', [
              { kind: 'radio', name: 'epistaxisSide', value: 'left', title: ['ข้างซ้าย', 'ข้างเดียว'] },
              { kind: 'radio', name: 'epistaxisSide', value: 'right', title: ['ข้างขวา', 'ข้างเดียว'] },
              { kind: 'radio', name: 'epistaxisSide', value: 'bilateral', title: ['ไหลทั้งสองข้าง', 'พร้อมกัน'] }
            ])}
          </div>

          <div class="pt-4 border-t border-slate-100">
            ${renderEpistaxisSysHeader({
              label: '1.3 ปริมาณและความแรงของเลือดที่ออก',
              icon: 'gauge',
              colorClass: 'bg-sky-100 text-sky-700'
            })}
            ${renderEpistaxisGrid('grid-cols-1 sm:grid-cols-2', [
              { kind: 'radio', name: 'epistaxisVolume', value: 'mild_oozing', title: ['ไหลซึมๆ /', 'หยดช้าๆ'], desc: 'เปื้อนกระดาษทิชชูเพียงเล็กน้อย' },
              { kind: 'radio', name: 'epistaxisVolume', value: 'moderate_flow', title: ['ไหลเป็นสาย', 'ต่อเนื่อง'], desc: 'ชุ่มกระดาษทิชชูหรือผ้าหลายผืน' },
              { kind: 'radio', name: 'epistaxisVolume', value: 'heavy_clots', title: ['ไหลทะลักมาก /', 'มีลิ่มเลือด', 'ก้อนใหญ่'], colSpan2: true }
            ])}
          </div>

          <div class="pt-4 border-t border-slate-100">
            ${renderEpistaxisSysHeader({
              label: '1.4 สถานะการไหลในขณะนี้',
              icon: 'activity',
              colorClass: 'bg-sky-100 text-sky-700'
            })}
            ${renderEpistaxisGrid('grid-cols-1 sm:grid-cols-2', [
              { kind: 'radio', name: 'epistaxisActiveStatus', value: 'active', title: ['ยังมีเลือด', 'ไหลอยู่ขณะนี้'] },
              { kind: 'radio', name: 'epistaxisActiveStatus', value: 'stopped', title: ['เลือดหยุดไหลแล้ว'] }
            ])}
          </div>

          <div class="pt-4 border-t border-slate-100">
            ${renderEpistaxisSysHeader({
              label: '1.5 ลักษณะการไหลลงคอและการห้ามเลือดเบื้องต้น (เลือกได้หลายข้อ)',
              icon: 'droplet',
              colorClass: 'bg-sky-100 text-sky-700',
              toggleId: 'epistaxis_dir_none',
              toggleLabel: 'ไม่มีอาการในหมวดนี้',
              toggleOnchange: `handleEpistaxisGroupNoneToggle('dir', this)`
            })}
            ${renderEpistaxisGrid('grid-cols-1 sm:grid-cols-2', [
              { name: 'epistaxisDirection', value: 'dripping_throat', title: ['เลือดไหลลงคอ /', 'ต้องกลืนเลือด'], onchange: `handleEpistaxisGroupItemChange('epistaxis_dir_none', this)` },
              { name: 'epistaxisDirection', value: 'failed_compression', title: ['บีบจมูก 15–20 นาที', 'ยังไม่หยุด'], onchange: `handleEpistaxisGroupItemChange('epistaxis_dir_none', this)` },
              { name: 'epistaxisDirection', value: 'vomited_blood_clots', title: ['อาเจียนเป็นลิ่มเลือด', '/ สีกาแฟ'], onchange: `handleEpistaxisGroupItemChange('epistaxis_dir_none', this)`, colSpan2: true }
            ])}
          </div>
        </div>
      </div>

      <!-- CARD 2: ประวัติการเป็นซ้ำ และสาเหตุหรือปัจจัยกระตุ้นก่อนเลือดออก -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="activity" class="w-5 h-5"></i>
          </div>
          <h2 class="text-base font-bold text-slate-900">2. ประวัติการเป็นซ้ำ และสาเหตุหรือปัจจัยกระตุ้นก่อนเลือดออก</h2>
        </div>

        <div class="space-y-4">
          <div>
            ${renderEpistaxisSysHeader({
              label: '2.1 ประวัติการเกิดเลือดกำเดาไหล',
              icon: 'history',
              colorClass: 'bg-teal-100 text-teal-700'
            })}
            ${renderEpistaxisGrid('grid-cols-1 sm:grid-cols-2', [
              { kind: 'radio', name: 'epistaxisRecurrence', value: 'highest_in_life', title: ['ไหลมากที่สุด', 'ในชีวิต'] },
              { kind: 'radio', name: 'epistaxisRecurrence', value: 'recurrent_episodes', title: ['เคยไหลซ้ำๆ', 'แบบนี้มาก่อน'] }
            ])}
          </div>

          <div class="pt-4 border-t border-slate-100">
            ${renderEpistaxisSysHeader({
              label: '2.2 สาเหตุหรือเหตุการณ์นำก่อนเลือดออกในครั้งนี้ (เลือกได้หลายข้อ)',
              icon: 'wind',
              colorClass: 'bg-teal-100 text-teal-700',
              toggleId: 'epistaxis_trig_none',
              toggleName: 'epistaxisTriggers',
              toggleValue: 'trig_spontaneous',
              toggleLabel: 'ไม่มีปัจจัยในหมวดนี้',
              toggleOnchange: `handleEpistaxisTrigChange(this)`
            })}
            ${renderEpistaxisGrid('grid-cols-1 sm:grid-cols-2', [
              { name: 'epistaxisTriggers', value: 'trig_nose_picking', title: ['แคะจมูก /', 'สั่งน้ำมูกแรง'], onchange: `handleEpistaxisTrigChange(this)` },
              { name: 'epistaxisTriggers', value: 'trig_nasal_spray_dry_air', title: ['ใช้ยาพ่นจมูก /', 'อากาศแห้งเย็น'], onchange: `handleEpistaxisTrigChange(this)` },
              {
                id: 'epistaxisTraumaParent',
                title: ['ถูกกระแทกจมูก /', 'ใบหน้า / ศีรษะ'],
                desc: 'เช่น หกล้ม รถล้ม หรือของแข็งกระแทกก่อนเลือดออก',
                onchange: `toggleEpistaxisGroup('epistaxisTraumaSub', this.checked)`,
                colSpan2: true
              }
            ])}
            ${EPISTAXIS_TRAUMA_SUB_HTML}
          </div>
        </div>
      </div>

      <!-- CARD 3: อาการผิดปกติร่วมและสัญญาณเตือนสำคัญ -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="shield-alert" class="w-5 h-5"></i>
          </div>
          <h2 class="text-base font-bold text-slate-900">3. อาการผิดปกติร่วมและสัญญาณเตือนสำคัญ</h2>
        </div>

        <div>
          ${renderEpistaxisSysHeader({
            label: 'อาการผิดปกติร่วม (เลือกได้หลายข้อ)',
            icon: 'alert-triangle',
            colorClass: 'bg-amber-100 text-amber-700',
            toggleId: 'epistaxis_warn_none',
            toggleLabel: 'ไม่มีอาการในหมวดนี้',
            toggleOnchange: `handleEpistaxisGroupNoneToggle('warn', this)`
          })}
          ${renderEpistaxisGrid('grid-cols-1 sm:grid-cols-2', [
            { id: 'epistaxisWarnAirwayParent', title: ['สำลัก /', 'หายใจลำบาก'], onchange: `toggleEpistaxisGroup('epistaxisWarnAirwaySub', this.checked)` },
            { id: 'epistaxisWarnShockParent', title: ['หน้ามืด วูบ /', 'ใจสั่นเหงื่อแตก'], onchange: `toggleEpistaxisGroup('epistaxisWarnShockSub', this.checked)` },
            { id: 'epistaxisWarnBleedingParent', title: ['เลือดออกที่อื่น /', 'จ้ำเลือดตามตัว'], onchange: `toggleEpistaxisGroup('epistaxisWarnBleedingSub', this.checked)` },
            { id: 'epistaxisWarnHeadNeckParent', title: ['คัดจมูก / หูอื้อ /', 'ก้อนที่คอ'], onchange: `toggleEpistaxisGroup('epistaxisWarnHeadNeckSub', this.checked)` },
            { name: 'epistaxisAcuteCranial', value: 'severe_headache', title: ['ปวดศีรษะรุนแรง /', 'ตามัว / แน่นหน้าอก'], onchange: `handleEpistaxisGroupItemChange('epistaxis_warn_none', this)`, colSpan2: true }
          ])}
          ${EPISTAXIS_WARN_SUBS_HTML}
        </div>
      </div>

      <!-- CARD 4: ประวัติการใช้ยาและโรคประจำตัวที่ส่งผลต่อการแข็งตัวของเลือด -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="pill" class="w-5 h-5"></i>
          </div>
          <h2 class="text-base font-bold text-slate-900">4. ประวัติการใช้ยาและโรคประจำตัวที่ส่งผลต่อการแข็งตัวของเลือด</h2>
        </div>

        <div class="space-y-4">
          <div>
            ${renderEpistaxisSysHeader({
              label: '4.1 ยาประจำตัวที่มีผลต่อการแข็งตัวของเลือด (เลือกได้หลายข้อ)',
              icon: 'pill',
              colorClass: 'bg-indigo-100 text-indigo-700',
              toggleId: 'epistaxis_meds_none',
              toggleName: 'epistaxisMeds',
              toggleValue: 'none',
              toggleLabel: 'ไม่มีประวัติในหมวดนี้',
              toggleOnchange: `handleEpistaxisMedChange(this)`
            })}
            ${renderEpistaxisGrid('grid-cols-1 sm:grid-cols-2', [
              { name: 'epistaxisMeds', value: 'anticoagulant_warfarin', title: ['ยาละลายลิ่มเลือด'], desc: 'เช่น Warfarin, Eliquis, Xarelto, Pradaxa', onchange: `handleEpistaxisMedChange(this)` },
              { name: 'epistaxisMeds', value: 'antiplatelet_aspirin', title: ['ยาต้านเกล็ดเลือด'], desc: 'เช่น Aspirin, Clopidogrel, Plavix', onchange: `handleEpistaxisMedChange(this)` },
              { name: 'epistaxisMeds', value: 'meds_unknown', title: ['มียาโรคหัวใจ /', 'หลอดเลือด', 'ไม่ทราบชื่อยา'], onchange: `handleEpistaxisMedChange(this)`, colSpan2: true }
            ])}
          </div>

          <div class="pt-4 border-t border-slate-100">
            ${renderEpistaxisSysHeader({
              label: '4.2 โรคประจำตัวที่เกี่ยวข้องกับภาวะเลือดกำเดาไหล (เลือกได้หลายข้อ)',
              icon: 'heart-pulse',
              colorClass: 'bg-rose-100 text-rose-700',
              toggleId: 'epistaxis_ud_none',
              toggleLabel: 'ไม่มีประวัติในหมวดนี้',
              toggleOnchange: `handleEpistaxisGroupNoneToggle('ud', this)`
            })}
            ${renderEpistaxisGrid('grid-cols-1 sm:grid-cols-2', [
              { name: 'epistaxisUnderlying', value: 'htn', title: ['โรคความดัน', 'โลหิตสูง'], onchange: `handleEpistaxisGroupItemChange('epistaxis_ud_none', this)` },
              { name: 'epistaxisUnderlying', value: 'cirrhosis', title: ['โรคตับแข็ง /', 'ตับวายเรื้อรัง'], onchange: `handleEpistaxisGroupItemChange('epistaxis_ud_none', this)` },
              { name: 'epistaxisUnderlying', value: 'esrd', title: ['โรคไตเรื้อรัง /', 'กำลังฟอกไต'], onchange: `handleEpistaxisGroupItemChange('epistaxis_ud_none', this)` },
              { name: 'epistaxisUnderlying', value: 'coagulopathy', title: ['โรคเลือดผิดปกติ /', 'เกล็ดเลือดต่ำ'], onchange: `handleEpistaxisGroupItemChange('epistaxis_ud_none', this)` }
            ])}
          </div>
        </div>
      </div>

      <!-- อาการอื่นๆ เป็นช่องกรอกอิสระ -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100">
          <div class="bg-slate-100 text-slate-600 p-2 rounded-xl"><i data-lucide="message-square-plus" class="w-5 h-5"></i></div>
          <h2 class="text-base font-bold text-slate-800">อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2>
        </div>
        <textarea id="epistaxis_other_free" rows="2" placeholder="พิมพ์ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)..."
          class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"></textarea>
      </div>
    </div>
  `,

  // --- Lifecycle Hooks ---
  init: function() {
    if (typeof lucide !== 'undefined') lucide.createIcons();
  },

  resetForm: function() {
    this.inputIdsToClear.forEach(id => {
      const el = getEpistaxisEl(id);
      if (el) el.value = '';
    });
    const durUnit = getEpistaxisEl('epistaxisDurationUnit');
    if (durUnit) durUnit.value = 'minutes';

    [
      'epistaxisSide',
      'epistaxisActiveStatus',
      'epistaxisRecurrence',
      'epistaxisVolume',
      'epistaxisDirection',
      'epistaxisAcuteCranial',
      'epistaxisTraumaSigns',
      'epistaxisWarningSigns',
      'epistaxisTriggers',
      'epistaxisMeds',
      'epistaxisUnderlying'
    ].forEach(name => {
      queryEpistaxisAll(`input[name="${name}"]`).forEach(el => { el.checked = false; });
    });

    [
      'epistaxisTraumaParent',
      'epistaxisWarnAirwayParent',
      'epistaxisWarnShockParent',
      'epistaxisWarnBleedingParent',
      'epistaxisWarnHeadNeckParent',
      'epistaxis_dir_none',
      'epistaxis_warn_none',
      'epistaxis_trig_none',
      'epistaxis_meds_none',
      'epistaxis_ud_none'
    ].forEach(id => {
      const el = getEpistaxisEl(id);
      if (el) el.checked = false;
    });

    this.branchIds.forEach(subId => toggleEpistaxisGroup(subId, false));
  },

  onSelectForm: function() {},
  onActivate: function() {},
  onTitleChange: function() {},

  collectIntake: function(ctx) {
    ctx = ctx || {};
    const durVal = parseInt(getEpistaxisEl('epistaxisDurationVal')?.value, 10);
    const durUnit = getEpistaxisEl('epistaxisDurationUnit')?.value || 'minutes';

    const getRadio = (name) => {
      const el = queryEpistaxisOne(`input[name="${name}"]:checked`);
      return el ? el.value : null;
    };
    const getChecks = (name) => {
      return queryEpistaxisAll(`input[name="${name}"]:checked`).map(el => el.value);
    };

    const side = getRadio('epistaxisSide');
    const activeStatus = getRadio('epistaxisActiveStatus');
    const recurrence = getRadio('epistaxisRecurrence');
    const volume = getRadio('epistaxisVolume');

    const direction = getChecks('epistaxisDirection');
    const acuteCranial = getChecks('epistaxisAcuteCranial');
    const traumaChecked = getEpistaxisEl('epistaxisTraumaParent')?.checked || false;
    const traumaDetails = traumaChecked ? (getEpistaxisEl('epistaxisTraumaDetails')?.value?.trim() || '') : '';
    const traumaSigns = traumaChecked ? getChecks('epistaxisTraumaSigns') : [];

    const warningSigns = getChecks('epistaxisWarningSigns');
    const epistaxisWarnParents = {
      airway: Boolean(getEpistaxisEl('epistaxisWarnAirwayParent')?.checked),
      shock: Boolean(getEpistaxisEl('epistaxisWarnShockParent')?.checked),
      bleeding: Boolean(getEpistaxisEl('epistaxisWarnBleedingParent')?.checked),
      headNeck: Boolean(getEpistaxisEl('epistaxisWarnHeadNeckParent')?.checked)
    };
    const anyWarnParent = Object.values(epistaxisWarnParents).some(Boolean);
    const triggers = getChecks('epistaxisTriggers');
    const meds = getChecks('epistaxisMeds');
    const underlying = getChecks('epistaxisUnderlying');
    const otherSymptomsFree = getEpistaxisEl('epistaxis_other_free')?.value?.trim() || ctx.otherSymptomsFree || '';

    const epistaxisDirNone = (getEpistaxisEl('epistaxis_dir_none')?.checked || false) && direction.length === 0;
    const epistaxisWarnNone = (getEpistaxisEl('epistaxis_warn_none')?.checked || false) && warningSigns.length === 0 && acuteCranial.length === 0 && !anyWarnParent;
    const epistaxisUdNone = (getEpistaxisEl('epistaxis_ud_none')?.checked || false) && underlying.length === 0;

    const rec = {
      id: ctx.recordId || ctx.id || `case-${Date.now()}`,
      queue_number: ctx.queueNumber || ctx.queue_number || 'ER-NEW',
      hn: ctx.randomHn || ctx.hn || '-',
      name: ctx.patientName || ctx.name || 'ไม่ระบุชื่อ',
      age: ctx.patientAge !== undefined ? ctx.patientAge : (ctx.age !== undefined ? ctx.age : 'ไม่ได้ระบุ'),
      gender: ctx.gender || 'ไม่ระบุ',
      chief_complaint: 'epistaxis',
      chief_complaint_title: 'เลือดกำเดาไหล',
      timestamp: new Date().toISOString(),
      status: ctx.recordStatus || ctx.status || 'waiting',
      durationVal: (!isNaN(durVal) && durVal > 0) ? durVal : null,
      durationUnit: durUnit,
      hospRecordStatus: ctx.hospRecordStatus || 'unspecified',
      underlying: Array.isArray(ctx.underlying) ? ctx.underlying : [],
      drugAllergy: ctx.drugAllergy || 'ไม่ได้ระบุ',
      currentMeds: ctx.currentMeds || 'ไม่ได้ระบุ',
      otherSymptomsFree,
      doctor_notes: ctx.preservedDoctorNotes || ctx.doctor_notes || { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },

      epistaxisSide: side,
      epistaxisActiveStatus: activeStatus,
      epistaxisRecurrence: recurrence,
      epistaxisVolume: volume,
      epistaxisDirection: direction,
      epistaxisAcuteCranial: acuteCranial,
      epistaxisTrauma: traumaChecked,
      epistaxisTraumaDetails: traumaDetails,
      epistaxisTraumaSigns: traumaSigns,
      epistaxisWarningSigns: warningSigns,
      epistaxisWarnParents,
      epistaxisTriggers: triggers,
      epistaxisMeds: meds,
      epistaxisUnderlying: underlying,
      epistaxisDirNone,
      epistaxisWarnNone,
      epistaxisUdNone
    };

    updateEpistaxisOutputs(rec);
    return rec;
  },

  collectFormData: function(ctx) {
    return this.collectIntake(ctx);
  },

  hydrateForm: function(data = {}) {
    if (!data) return;
    this.resetForm();

    if (data.durationVal) {
      const valEl = getEpistaxisEl('epistaxisDurationVal');
      if (valEl) valEl.value = data.durationVal;
    }
    if (data.durationUnit) {
      const unitEl = getEpistaxisEl('epistaxisDurationUnit');
      if (unitEl) unitEl.value = data.durationUnit;
    }

    const setRadio = (name, val) => {
      if (!val) return;
      const el = queryEpistaxisOne(`input[name="${name}"][value="${val}"]`);
      if (el) el.checked = true;
    };
    const setChecks = (name, arr) => {
      if (!Array.isArray(arr)) return;
      arr.forEach(val => {
        const el = queryEpistaxisOne(`input[name="${name}"][value="${val}"]`);
        if (el) el.checked = true;
      });
    };

    setRadio('epistaxisSide', data.epistaxisSide);
    setRadio('epistaxisActiveStatus', data.epistaxisActiveStatus);
    setRadio('epistaxisRecurrence', data.epistaxisRecurrence);
    setRadio('epistaxisVolume', data.epistaxisVolume);

    setChecks('epistaxisDirection', data.epistaxisDirection);
    if (data.epistaxisDirNone && (!Array.isArray(data.epistaxisDirection) || data.epistaxisDirection.length === 0)) {
      const dirNoneEl = getEpistaxisEl('epistaxis_dir_none');
      if (dirNoneEl) dirNoneEl.checked = true;
    }

    setChecks('epistaxisAcuteCranial', data.epistaxisAcuteCranial);

    if (data.epistaxisTrauma) {
      const traumaParent = getEpistaxisEl('epistaxisTraumaParent');
      if (traumaParent) {
        traumaParent.checked = true;
        toggleEpistaxisGroup('epistaxisTraumaSub', true);
      }
      if (data.epistaxisTraumaDetails) {
        const dEl = getEpistaxisEl('epistaxisTraumaDetails');
        if (dEl) dEl.value = data.epistaxisTraumaDetails;
      }
      setChecks('epistaxisTraumaSigns', data.epistaxisTraumaSigns);
    }

    const ws = Array.isArray(data.epistaxisWarningSigns) ? data.epistaxisWarningSigns : [];
    const wp = data.epistaxisWarnParents || {};
    if (ws.length > 0 || Object.values(wp).some(Boolean)) {
      if (wp.airway || ws.some(k => k === 'warn_choking_swallow' || k === 'warn_stridor_airway_tight')) {
        const p = getEpistaxisEl('epistaxisWarnAirwayParent');
        if (p) { p.checked = true; toggleEpistaxisGroup('epistaxisWarnAirwaySub', true); }
      }
      if (wp.shock || ws.some(k => k === 'warn_dizziness_presyncope' || k === 'warn_profuse_sweat_cold_shock')) {
        const p = getEpistaxisEl('epistaxisWarnShockParent');
        if (p) { p.checked = true; toggleEpistaxisGroup('epistaxisWarnShockSub', true); }
      }
      if (wp.bleeding || ws.some(k => k === 'warn_petechiae_purpura' || k === 'warn_mucosal_or_melena' || k === 'warn_hematuria' || k === 'warn_melena')) {
        const p = getEpistaxisEl('epistaxisWarnBleedingParent');
        if (p) { p.checked = true; toggleEpistaxisGroup('epistaxisWarnBleedingSub', true); }
      }
      if (wp.headNeck || ws.some(k => k === 'warn_cervical_lymph_node' || k === 'warn_unilateral_obstruction' || k === 'warn_unilateral_tinnitus')) {
        const p = getEpistaxisEl('epistaxisWarnHeadNeckParent');
        if (p) { p.checked = true; toggleEpistaxisGroup('epistaxisWarnHeadNeckSub', true); }
      }
      setChecks('epistaxisWarningSigns', ws);
    } else if (data.epistaxisWarnNone && (!Array.isArray(data.epistaxisAcuteCranial) || data.epistaxisAcuteCranial.length === 0)) {
      const warnNoneEl = getEpistaxisEl('epistaxis_warn_none');
      if (warnNoneEl) warnNoneEl.checked = true;
    }

    setChecks('epistaxisTriggers', data.epistaxisTriggers);
    setChecks('epistaxisMeds', data.epistaxisMeds);
    setChecks('epistaxisUnderlying', data.epistaxisUnderlying);
    if (data.epistaxisUdNone && (!Array.isArray(data.epistaxisUnderlying) || data.epistaxisUnderlying.length === 0)) {
      const udNoneEl = getEpistaxisEl('epistaxis_ud_none');
      if (udNoneEl) udNoneEl.checked = true;
    }

    const otherFreeEl = getEpistaxisEl('epistaxis_other_free');
    if (otherFreeEl) otherFreeEl.value = data.otherSymptomsFree || '';
  },

  isRedFlag: function(patient) {
    return evaluateEpistaxisRedFlags(patient).length > 0;
  },

  evaluateRedFlags: evaluateEpistaxisRedFlags,
  updateOutputs: updateEpistaxisOutputs,
  renderRapidHpi: renderEpistaxisRapidHpi,
  renderNarrative: renderEpistaxisNarrative,
  renderDoctorHpi: renderEpistaxisDoctorHpi,

  // --- Seed Patients Registry ---
  seedPatients: [
    // Case 1: Posterior Epistaxis on Warfarin with Hypertensive Urgency (ESI 2)
    {
      id: 'case-epistaxis-01',
      queue_number: 'E2-101',
      hn: '7890201',
      name: 'นายสมศักดิ์ นาสิกธารา',
      age: 72,
      gender: 'ชาย',
      chief_complaint: 'epistaxis',
      chief_complaint_title: 'เลือดกำเดาไหล',
      timestamp: '2026-11-03T09:30:00.000Z',
      status: 'waiting',
      durationVal: 45,
      durationUnit: 'minutes',
      hospRecordStatus: 'complete',
      underlying: ['ความดันโลหิตสูง', 'หัวใจเต้นผิดจังหวะ (AF)'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Warfarin 3 mg 1 tab po hs, Amlodipine 5 mg 1 tab po od',
      otherSymptomsFree: 'เลือดกำเดาไหลทะลักสองข้าง เลือดไหลรินลงคอตลอดเวลา บีบจมูกแน่น 20 นาทีแล้วไม่หยุด กลืนเลือดจนอาเจียนออกมาเป็นลิ่มเลือด ปวดศีรษะตื้อๆ',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.8, sbp: 185, dbp: 105, bp: '185/105', pr: 98, rr: 22, spo2: 97 },
      esi_level: 2,

      epistaxisSide: 'bilateral',
      epistaxisActiveStatus: 'active',
      epistaxisRecurrence: 'highest_in_life',
      epistaxisVolume: 'heavy_clots',
      epistaxisDirection: ['dripping_throat', 'failed_compression', 'vomited_blood_clots'],
      epistaxisAcuteCranial: ['severe_headache'],
      epistaxisTrauma: false,
      epistaxisTraumaDetails: '',
      epistaxisTraumaSigns: [],
      epistaxisWarningSigns: ['warn_dizziness_presyncope'],
      epistaxisTriggers: ['trig_spontaneous'],
      epistaxisMeds: ['anticoagulant_warfarin'],
      epistaxisUnderlying: ['htn']
    },

    // Case 2: Maxillofacial / Basilar Skull Fracture with CSF Leak (ESI 2)
    {
      id: 'case-epistaxis-02',
      queue_number: 'E2-102',
      hn: '7890202',
      name: 'นายอดิศร บาดเจ็บหน้า',
      age: 26,
      gender: 'ชาย',
      chief_complaint: 'epistaxis',
      chief_complaint_title: 'เลือดกำเดาไหล',
      timestamp: '2026-11-03T10:15:00.000Z',
      status: 'waiting',
      durationVal: 1,
      durationUnit: 'hours',
      hospRecordStatus: 'complete',
      underlying: [],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'ไม่มี',
      otherSymptomsFree: 'อุบัติเหตุรถจักรยานยนต์ล้ม หน้ากระแทกแฮนด์รถอย่างแรง เลือดกำเดาไหลสองข้าง มีน้ำใสปนเลือดไหลตลอดเวลา ดั้งจมูกเบี้ยวผิดรูป ช้ำรอบตาสองข้าง',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.6, sbp: 115, dbp: 75, bp: '115/75', pr: 104, rr: 20, spo2: 99 },
      esi_level: 2,

      epistaxisSide: 'bilateral',
      epistaxisActiveStatus: 'active',
      epistaxisRecurrence: 'highest_in_life',
      epistaxisVolume: 'moderate_flow',
      epistaxisDirection: [],
      epistaxisAcuteCranial: [],
      epistaxisTrauma: true,
      epistaxisTraumaDetails: 'อุบัติเหตุรถจักรยานยนต์ล้ม หน้ากระแทกแฮนด์รถอย่างแรง',
      epistaxisTraumaSigns: ['trauma_csf_leak_rhinorrhea', 'trauma_raccoon_eyes', 'trauma_nasal_deformity'],
      epistaxisWarningSigns: [],
      epistaxisTriggers: [],
      epistaxisMeds: ['none'],
      epistaxisUnderlying: [],
      epistaxisDirNone: true,
      epistaxisWarnNone: true,
      epistaxisUdNone: true
    },

    // Case 3: Recurrent Unilateral Epistaxis / Suspected Head & Neck Mass (NPC) (ESI 3)
    {
      id: 'case-epistaxis-03',
      queue_number: 'E3-103',
      hn: '7890203',
      name: 'นางกานดา ก้อนคอบวม',
      age: 54,
      gender: 'หญิง',
      chief_complaint: 'epistaxis',
      chief_complaint_title: 'เลือดกำเดาไหล',
      timestamp: '2026-11-03T11:00:00.000Z',
      status: 'waiting',
      durationVal: 3,
      durationUnit: 'weeks',
      hospRecordStatus: 'complete',
      underlying: [],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'ไม่มี',
      otherSymptomsFree: 'เลือดกำเดาไหลข้างขวาเป็นๆ หายๆ มา 3 สัปดาห์ คัดจมูกข้างขวาข้างเดียวเรื้อรัง หูอื้อข้างขวา คลำได้ก้อนบวมที่คอด้านขวา',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.7, sbp: 128, dbp: 82, bp: '128/82', pr: 76, rr: 18, spo2: 99 },
      esi_level: 3,

      epistaxisSide: 'right',
      epistaxisActiveStatus: 'stopped',
      epistaxisRecurrence: 'recurrent_episodes',
      epistaxisVolume: 'mild_oozing',
      epistaxisDirection: [],
      epistaxisAcuteCranial: [],
      epistaxisTrauma: false,
      epistaxisTraumaDetails: '',
      epistaxisTraumaSigns: [],
      epistaxisWarningSigns: ['warn_cervical_lymph_node', 'warn_unilateral_obstruction', 'warn_unilateral_tinnitus'],
      epistaxisTriggers: ['trig_spontaneous'],
      epistaxisMeds: ['none'],
      epistaxisUnderlying: [],
      epistaxisDirNone: true,
      epistaxisUdNone: true
    },

    // Case 4: Simple Anterior Epistaxis from Digital Trauma (ESI 4)
    {
      id: 'case-epistaxis-04',
      queue_number: 'E4-104',
      hn: '7890204',
      name: 'ด.ช.ธนภัทร แคะจมูก',
      age: 8,
      gender: 'ชาย',
      chief_complaint: 'epistaxis',
      chief_complaint_title: 'เลือดกำเดาไหล',
      timestamp: '2026-11-03T11:30:00.000Z',
      status: 'waiting',
      durationVal: 20,
      durationUnit: 'minutes',
      hospRecordStatus: 'self',
      underlying: [],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'ไม่มี',
      otherSymptomsFree: 'เลือดกำเดาไหลข้างซ้ายหลังแคะขี้มูกในห้องแอร์ กดบีบปีกจมูก 10 นาทีแล้วเลือดหยุดสนิท ไม่มีอาการผิดปกติอื่น',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.5, sbp: 100, dbp: 65, bp: '100/65', pr: 84, rr: 18, spo2: 100 },
      esi_level: 4,

      epistaxisSide: 'left',
      epistaxisActiveStatus: 'stopped',
      epistaxisRecurrence: 'recurrent_episodes',
      epistaxisVolume: 'mild_oozing',
      epistaxisDirection: [],
      epistaxisAcuteCranial: [],
      epistaxisTrauma: false,
      epistaxisTraumaDetails: '',
      epistaxisTraumaSigns: [],
      epistaxisWarningSigns: [],
      epistaxisTriggers: ['trig_nose_picking'],
      epistaxisMeds: ['none'],
      epistaxisUnderlying: [],
      epistaxisDirNone: true,
      epistaxisWarnNone: true,
      epistaxisUdNone: true
    }
  ]
};

// Register module in Ratchaburi ER Core Registry
if (typeof registerCcModule === 'function') {
  registerCcModule(epistaxisModule);
} else if (typeof window !== 'undefined' && typeof window.registerCcModule === 'function') {
  window.registerCcModule(epistaxisModule);
}

if (typeof window !== 'undefined') {
  window.toggleEpistaxisGroup = toggleEpistaxisGroup;
  window.handleEpistaxisTrigChange = handleEpistaxisTrigChange;
  window.handleEpistaxisMedChange = handleEpistaxisMedChange;
  window.handleEpistaxisGroupItemChange = handleEpistaxisGroupItemChange;
  window.handleEpistaxisGroupNoneToggle = handleEpistaxisGroupNoneToggle;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = epistaxisModule;
}
