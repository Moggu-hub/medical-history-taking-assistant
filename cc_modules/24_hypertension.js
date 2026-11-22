// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 24_hypertension.js
// อาการนำ: ตรวจพบความดันโลหิตสูง (Severe Hypertension Screen / High BP)
// ปรับปรุงตามมาตรฐาน plan_hypertension.md, plan-cc และ code-cc (กลุ่ม B2)
// =========================================================================

// --- Internal DOM & UI Helpers ---
function getHtnEl(id) {
  return typeof document !== 'undefined' ? document.getElementById(id) : null;
}

function queryHtnOne(selector) {
  return typeof document !== 'undefined' ? document.querySelector(selector) : null;
}

function queryHtnAll(selector) {
  return typeof document !== 'undefined' ? Array.from(document.querySelectorAll(selector)) : [];
}

function wrapHtnWords(chunks) {
  if (!Array.isArray(chunks)) return chunks;
  return chunks.map(c => `<span class="inline-block whitespace-nowrap">${c}</span>`).join(' ');
}

function renderHtnOption(cfg) {
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
  const titleHtml = Array.isArray(title) ? wrapHtnWords(title) : title;
  const bodyHtml = desc
    ? `<div class="ml-3 leading-snug"><span class="block text-xs sm:text-sm font-semibold text-slate-800">${titleHtml}</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">${desc}</span></div>`
    : `<span class="ml-3 ${compact ? 'text-xs' : 'text-xs sm:text-sm'} font-semibold text-slate-800 leading-snug">${titleHtml}</span>`;
  return `<label class="selectable-card bg-white flex ${alignCls} ${padCls} rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition${spanCls}"><input type="${kind}" ${idAttr}${nameAttr}${valAttr}${chgAttr}class="${topCls}${roundCls}text-medical-600 focus:ring-medical-500 ${szCls} flex-shrink-0">${bodyHtml}</label>`;
}

function renderHtnGrid(colsCls, items, shared = {}) {
  return `<div class="grid ${colsCls} gap-2.5">${items.map(it => renderHtnOption({ ...shared, ...it })).join('\n')}</div>`;
}

function renderHtnSysHeader({
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

// --- Progressive Disclosure & Corner-Toggle Handlers ---
function toggleHtnGroup(subId, show) {
  const el = getHtnEl(subId);
  if (!el) return;
  if (show) {
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
    el.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    el.querySelectorAll('input[type="radio"]').forEach(rb => { rb.checked = false; });
    el.querySelectorAll('input[type="text"], input[type="number"]').forEach(inp => { inp.value = ''; });
  }
}

function toggleHtnParentGroup(subId, show) {
  toggleHtnGroup(subId, show);
  if (show) {
    const todNone = getHtnEl('htn_tod_none');
    if (todNone) todNone.checked = false;
  }
}

function handleHtnTodNoneToggle(el) {
  if (el && el.checked) {
    [
      ['htnParentNeuro', 'htnNeuroSubGroup'],
      ['htnParentCardio', 'htnCardioSubGroup'],
      ['htnParentRenal', 'htnRenalSubGroup']
    ].forEach(([parentId, subId]) => {
      const p = getHtnEl(parentId);
      if (p) p.checked = false;
      toggleHtnGroup(subId, false);
    });
  }
}

function handleHtnGeneralNoneToggle(el) {
  if (el && el.checked) {
    queryHtnAll('input[name="htnGeneralSigns"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleHtnGeneralItemChange(el) {
  if (el && el.checked) {
    const noneCb = getHtnEl('htn_general_none') || queryHtnOne('input[name="htnGeneralSigns"][value="no_general_signs"]');
    if (noneCb) noneCb.checked = false;
  }
}

function handleHtnTriggersNoneToggle(el) {
  if (el && el.checked) {
    queryHtnAll('input[name="htnTriggers"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
    [
      'htnTriggerPainDetailContainer',
      'htnTriggerDrinkDetailContainer',
      'htnTriggerMedDetailContainer',
      'htnTriggerSubstanceDetailContainer'
    ].forEach(id => toggleHtnGroup(id, false));
  }
}

function handleHtnTriggerItemChange(el) {
  if (el && el.checked) {
    const noneCb = getHtnEl('htn_triggers_none') || queryHtnOne('input[name="htnTriggers"][value="no_triggers"]');
    if (noneCb) noneCb.checked = false;
  }
  const detailMap = {
    severe_pain_other: 'htnTriggerPainDetailContainer',
    energy_drink_coffee_alc: 'htnTriggerDrinkDetailContainer',
    nsaids_cold_steroid: 'htnTriggerMedDetailContainer',
    substance_stimulants: 'htnTriggerSubstanceDetailContainer'
  };
  if (el && detailMap[el.value]) {
    toggleHtnGroup(detailMap[el.value], Boolean(el.checked));
  }
}

// --- Female Pregnancy Section Sync (C-AP13) ---
function isHtnPatientFemale(overrideGender) {
  if (overrideGender === 'หญิง' || overrideGender === 'female' || overrideGender === 'Female' || overrideGender === true) return true;
  if (overrideGender === 'ชาย' || overrideGender === 'male' || overrideGender === 'Male' || overrideGender === false) return false;
  const titleVal = getHtnEl('patientTitleSelect')?.value || '';
  if (titleVal) {
    return /นาง|น\.ส\.|หญิง|ด\.ญ\.|Mrs|Ms|Miss|Female/i.test(titleVal);
  }
  const triageGender = getHtnEl('triageGenderSelect')?.value || '';
  if (triageGender) {
    return /หญิง|female/i.test(triageGender);
  }
  return false;
}

function syncHtnFemalePregnancySection(overrideGender) {
  const section = getHtnEl('htnFemalePregnancySection');
  if (!section) return;
  const titleVal = (getHtnEl('patientTitleSelect')?.value || '').trim();
  const triageVal = (getHtnEl('triageGenderSelect')?.value || '').trim();

  if (typeof overrideGender !== 'boolean' && typeof overrideGender !== 'string' && !titleVal && !triageVal) {
    section.classList.add('hidden');
    queryHtnAll('#htnFemalePregnancySection input[name="htnPregnancyStatus"]').forEach(r => { r.checked = false; });
    const pregNone = getHtnEl('htn_preg_none');
    if (pregNone) pregNone.checked = false;
    toggleHtnGroup('htnPregnancySymptomsSub', false);
    return;
  }

  const isFemale = isHtnPatientFemale(overrideGender);
  if (isFemale) {
    section.classList.remove('hidden');
  } else {
    section.classList.add('hidden');
    queryHtnAll('#htnFemalePregnancySection input[name="htnPregnancyStatus"]').forEach(r => { r.checked = false; });
    const pregNone = getHtnEl('htn_preg_none');
    if (pregNone) pregNone.checked = false;
    toggleHtnGroup('htnPregnancySymptomsSub', false);
  }
}

function handleHtnVisitReasonChange(value) {
  const needsDetail = (value === 'other_appointment' || value === 'suspected_symptoms' || value === 'other_reasons');
  toggleHtnGroup('htnVisitReasonDetailContainer', needsDetail);
  const detailInput = getHtnEl('htnVisitReasonDetail');
  if (detailInput) {
    if (value === 'other_appointment') {
      detailInput.placeholder = 'ระบุโรคหรือแผนกที่แพทย์นัดตรวจ เช่น เบาหวาน, โรคหัวใจ...';
    } else if (value === 'suspected_symptoms') {
      detailInput.placeholder = 'ระบุอาการที่สงสัย เช่น มึนศีรษะ, แน่นหน้าอก, เหนื่อย...';
    } else if (value === 'other_reasons') {
      detailInput.placeholder = 'ระบุอาการหรือสาเหตุอื่น เช่น ปวดท้อง, ไข้หวัด, ทำแผล...';
    }
  }
}

function handleHtnPregNoneToggle(el) {
  if (el && el.checked) {
    queryHtnAll('input[name="htnPregnancyStatus"]').forEach(rb => { rb.checked = false; });
    toggleHtnGroup('htnPregnancySymptomsSub', false);
  }
}

function handleHtnPregnancyChange(value) {
  const pregNone = getHtnEl('htn_preg_none');
  if (pregNone) pregNone.checked = false;
  toggleHtnGroup('htnPregnancySymptomsSub', value === 'pregnancy_gt_20wks');
}

function handleHtnComplianceChange(value) {
  toggleHtnGroup('htnMissedDaysContainer', value === 'missed_days');
}

function handleHtnUnknownBpChange() {
  // Keeps typed peak BP numbers intact if any while marking uncertainty
}

// --- Clinical Decision Support & Evaluation Functions (Preserving 6 Rules & core_guard_test.js) ---
function evaluateHypertensionRedFlags(patient) {
  const rfs = [];
  if (!patient) return rfs;
  const vs = patient.vital_signs || {};
  const sbp = vs.sbp !== undefined && vs.sbp !== null ? parseInt(vs.sbp, 10) : null;
  const dbp = vs.dbp !== undefined && vs.dbp !== null ? parseInt(vs.dbp, 10) : null;

  const peakSbp = patient.htnPeakSystolic !== undefined && patient.htnPeakSystolic !== null ? parseInt(patient.htnPeakSystolic, 10) : null;
  const peakDbp = patient.htnPeakDiastolic !== undefined && patient.htnPeakDiastolic !== null ? parseInt(patient.htnPeakDiastolic, 10) : null;

  const effectiveSbp = sbp !== null ? sbp : peakSbp;
  const effectiveDbp = dbp !== null ? dbp : peakDbp;
  const isSevereBP = (effectiveSbp !== null && effectiveSbp >= 180) || (effectiveDbp !== null && effectiveDbp >= 110);

  const neuroSigns = Array.isArray(patient.htnNeuroSigns) ? patient.htnNeuroSigns : [];
  const cardioSigns = Array.isArray(patient.htnCardioSigns) ? patient.htnCardioSigns : [];
  const renalSigns = Array.isArray(patient.htnRenalSigns) ? patient.htnRenalSigns : [];
  const pregSigns = Array.isArray(patient.htnPregnancySigns) ? patient.htnPregnancySigns : [];
  const generalSigns = Array.isArray(patient.htnGeneralSigns) ? patient.htnGeneralSigns : [];

  const isFemale = patient.gender === 'หญิง' || patient.gender === 'Female' || patient.gender === 'female';

  // 1. Acute Aortic Dissection with Severe Hypertension (ESI 1)
  if (cardioSigns.includes('tearing_chest_back_pain')) {
    rfs.push({
      key: 'rf_aortic_dissection_htn',
      level: 1,
      textTh: 'Acute Aortic Dissection / ภาวะเส้นเลือดใหญ่เอออร์ตาฉีกขาดเฉียบพลันจากความดันโลหิตสูงวิกฤต',
      risk: 'Catastrophic aortic rupture, cardiac tamponade, acute aortic regurgitation, severe malperfusion syndrome, and sudden death.',
      suggestedAction: 'Immediate Resuscitation (ESI 1). Rapid target BP reduction to SBP < 120 mmHg and HR < 60 bpm within 20 minutes using IV Beta-blocker FIRST before vasodilators. Stat CTA Chest & Abdomen and CVT Surgery consult.'
    });
  }

  // 2. Acute Pulmonary Edema / Acute Decompensated Heart Failure (ESI 1 / 2)
  const hasPulmEdemaSigns = cardioSigns.includes('orthopnea_pulmonary_edema') || cardioSigns.includes('pink_frothy_sputum');
  const hasSpO2Drop = vs.spo2 !== undefined && vs.spo2 !== null && parseInt(vs.spo2, 10) < 92;
  if (hasPulmEdemaSigns || (hasSpO2Drop && isSevereBP)) {
    rfs.push({
      key: 'rf_acute_pulmonary_edema_htn',
      level: 1,
      textTh: 'Acute Pulmonary Edema / ภาวะน้ำท่วมปอดเฉียบพลันจากความดันโลหิตสูงวิกฤต (Hypertensive Heart Failure)',
      risk: 'Severe hypoxemic respiratory failure, alveolar flooding, and cardiopulmonary arrest.',
      suggestedAction: 'Immediate airway stabilization, high-flow O2 or NIV (BiPAP/CPAP). IV Nitroglycerin infusion + IV Furosemide. Avoid Beta-blockers in acute pulmonary edema.'
    });
  }

  // 3. Acute Cerebrovascular Event (Stroke / ICH / SAH) (ESI 2)
  const hasFocalDeficit = neuroSigns.includes('facial_droop_dysarthria') || neuroSigns.includes('hemiparesis_numbness') || neuroSigns.includes('sudden_monocular_vision_loss');
  const hasThunderclap = neuroSigns.includes('severe_headache_occipital') && (isSevereBP || generalSigns.includes('projectile_vomiting'));
  if (hasFocalDeficit || hasThunderclap) {
    rfs.push({
      key: 'rf_stroke_ich_htn',
      level: 2,
      textTh: 'Acute Cerebrovascular Event (Stroke / ICH / SAH) / โรคหลอดเลือดสมองเฉียบพลัน หรือเลือดออกในสมอง',
      risk: 'Permanent irreversible neurologic deficit, hemorrhagic expansion, acute hydrocephalus, and cerebral herniation.',
      suggestedAction: 'Activate Stroke Fast Track. Stat Non-contrast CT Brain. Controlled BP management per ischemic vs hemorrhagic protocol.'
    });
  }

  // 4. Preeclampsia with Severe Features / HELLP / Eclampsia (ESI 1 / 2 — female only)
  if ((isFemale || !patient.gender) && patient.htnPregnancyStatus === 'pregnancy_gt_20wks') {
    const hasPregSymptoms = pregSigns.includes('ruq_epigastric_pain') || pregSigns.includes('flashing_lights_vision') ||
      pregSigns.includes('severe_throbbing_headache') || neuroSigns.includes('severe_headache_occipital') ||
      neuroSigns.includes('blurred_vision_scotoma');
    const isSeverePreeclampsiaBP = (effectiveSbp !== null && effectiveSbp >= 160) || (effectiveDbp !== null && effectiveDbp >= 110);
    if (hasPregSymptoms || isSeverePreeclampsiaBP) {
      rfs.push({
        key: 'rf_preeclampsia_severe',
        level: 2,
        textTh: 'Preeclampsia with Severe Features / ภาวะครรภ์เป็นพิษระยะรุนแรง',
        risk: 'Eclampsia, placental abruption, hepatic rupture, HELLP syndrome, and fetal distress/death.',
        suggestedAction: 'Stat OB/GYN consult. IV Magnesium Sulfate seizure prophylaxis, IV Labetalol or Hydralazine, stat HELLP labs & FHR monitoring.'
      });
    }
  }

  // 5. Acute Coronary Syndrome (ACS / Acute MI) (ESI 2)
  if (cardioSigns.includes('crushing_chest_pressure')) {
    rfs.push({
      key: 'rf_acute_coronary_htn',
      level: 2,
      textTh: 'Acute Coronary Syndrome (ACS) with Severe Hypertension / ภาวะกล้ามเนื้อหัวใจขาดเลือดเฉียบพลันร่วมกับความดันโลหิตสูงวิกฤต',
      risk: 'Myocardial infarction extension, lethal ventricular arrhythmias, cardiogenic shock.',
      suggestedAction: 'Stat 12-lead ECG within 10 minutes, High-Sensitivity Troponin, Nitroglycerin & antiplatelets, Cardiology consult.'
    });
  }

  // 6. Hypertensive Encephalopathy / Acute Kidney Injury (ESI 2)
  const hasEncephalopathy = neuroSigns.includes('confusion_lethargy');
  const hasRenalFailure = renalSigns.includes('anuria_oliguria') || renalSigns.includes('gross_hematuria_coca_cola');
  if (hasEncephalopathy || hasRenalFailure) {
    rfs.push({
      key: 'rf_encephalopathy_renal_htn',
      level: 2,
      textTh: 'Hypertensive Encephalopathy or Acute Kidney Injury / ภาวะสมองหรือไตวายเฉียบพลันจากความดันโลหิตสูงวิกฤต',
      risk: 'Cerebral edema, status epilepticus, irreversible uremic renal failure requiring emergent hemodialysis.',
      suggestedAction: 'Controlled BP reduction <= 20-25% in first hour (IV Nicardipine/Labetalol). Stat BUN, Cr, Electrolytes, UA & hourly urine output.'
    });
  }

  return rfs;
}

// --- Thai Lookup Dictionaries (Zero Raw Enum Leaks) ---
const HTN_UNIT_MAP = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };

const HTN_REASON_MAP = {
  high_bp_detected: 'ตรวจพบความดันโลหิตสูง',
  other_appointment: 'มาตามนัดแพทย์ตรวจโรคอื่น',
  suspected_symptoms: 'มาด้วยอาการที่สงสัยว่าเกิดจากความดันสูง',
  other_reasons: 'มาด้วยอาการอื่นๆ ที่ไม่เกี่ยวกับโรคความดันสูง'
};

const HTN_SOURCE_MAP = {
  home_digital: 'วัดเองที่บ้าน (เครื่องดิจิทัล / มีผู้วัดให้)',
  health_center: 'รพ.สต. / สถานีอนามัย / คลินิกชุมชนอบอุ่น',
  private_clinic: 'คลินิกเอกชน หรือโรงพยาบาลเอกชน',
  triage_hospital: 'จุดคัดกรองของโรงพยาบาล',
  other: 'สถานที่อื่น หรือไม่แน่ชัด'
};

const HTN_KNOWN_HX_MAP = {
  known_htn: 'มีโรคประจำตัวความดันโลหิตสูงเดิม',
  first_time: 'เพิ่งตรวจพบความดันสูงครั้งแรกในชีวิต',
  unsure: 'ไม่แน่ใจประวัติโรคความดันเดิม'
};

const HTN_COMPLIANCE_MAP = {
  regular: 'รับประทานยาลดความดันสม่ำเสมอครบถ้วนตามแพทย์สั่ง',
  self_adjusted: 'ปรับขนาดยาเอง หรือหยุดรับประทานยาเอง',
  no_prior_rx: 'ไม่เคยมียาลดความดันมาก่อน'
};

const HTN_NEURO_MAP = {
  severe_headache_occipital: 'ปวดศีรษะรุนแรงเฉียบพลันหรือปวดตื้อท้ายทอย',
  blurred_vision_scotoma: 'ตามัวลงเฉียบพลัน เห็นภาพซ้อน หรือเห็นแสงวับวาบ',
  facial_droop_dysarthria: 'ปากเบี้ยว หน้าเบี้ยว พูดไม่ชัด หรือกลืนลำบาก',
  hemiparesis_numbness: 'แขนขาอ่อนแรงหรือชาครึ่งซีก',
  confusion_lethargy: 'ซึมลง สับสน พฤติกรรมเปลี่ยน หรือชักเกร็งกระตุก',
  sudden_monocular_vision_loss: 'ตาบอดข้างเดียวฉับพลัน'
};

const HTN_CARDIO_MAP = {
  crushing_chest_pressure: 'เจ็บแน่นอึดอัดกลางหน้าอกคล้ายของหนักทับ ร้าวไปกรามหรือแขนซ้าย',
  tearing_chest_back_pain: 'เจ็บแปลบรุนแรงคล้ายฉีกขาดในอกหรือทะลุหลังสะบัก',
  orthopnea_pulmonary_edema: 'หายใจหอบเหนื่อยรุนแรง นอนราบไม่ได้',
  pink_frothy_sputum: 'ไอมีเสมหะเป็นฟองสีชมพูหรือมีเลือดปน',
  palpitations_racing_heart: 'ใจสั่นมาก รู้สึกหัวใจเต้นเร็วรัวหรือสะดุดแรง'
};

const HTN_RENAL_MAP = {
  anuria_oliguria: 'ปัสสาวะไม่ออก หรือออกน้อยลงมากผิดปกติ',
  gross_hematuria_coca_cola: 'ปัสสาวะเป็นเลือดสด หรือสีน้ำล้างเนื้อ/โค้ก',
  leg_edema_bilateral: 'ขาทั้งสองข้าง หลังเท้า หรือใบหน้าบวมผิดปกติ'
};

const HTN_PREG_SIGNS_MAP = {
  ruq_epigastric_pain: 'จุกแน่นใต้ลิ้นปี่หรือปวดแน่นชายโครงขวาอย่างมาก',
  flashing_lights_vision: 'ตาพร่ามัวหรือเห็นแสงวับวาบ',
  severe_throbbing_headache: 'ปวดศีรษะรุนแรงต่อเนื่อง ทานยาไม่ทุเลา'
};

const HTN_GENERAL_MAP = {
  dizziness_cold_sweat: 'หน้ามืด วูบคล้ายจะเป็นลม เวียนศีรษะ หรือเหงื่อแตกตัวเย็น',
  severe_epistaxis: 'เลือดกำเดาไหลออกทางจมูกปริมาณมาก',
  projectile_vomiting: 'คลื่นไส้อาเจียนพุ่งหลายครั้งติดต่อกัน'
};

const HTN_TRIGGER_MAP = {
  stress_insomnia: 'ความเครียด วิตกกังวล หรือนอนไม่หลับอย่างหนักติดต่อกัน',
  severe_pain_other: 'ปวด/เจ็บที่ตำแหน่งอื่นของร่างกาย',
  energy_drink_coffee_alc: 'ดื่มเครื่องดื่มชูกำลัง กาแฟ หรือแอลกอฮอล์',
  nsaids_cold_steroid: 'รับประทานยาแก้หวัด ยาแก้ปวด หรือสเตียรอยด์',
  substance_stimulants: 'ใช้สารเสพติดหรือสารกระตุ้นประสาท',
  no_triggers: 'ปฏิเสธปัจจัยกระตุ้นความดันสูงร่วม'
};

const HTN_HOSP_MAP = {
  complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
  additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
  self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
  unspecified: 'ไม่ได้ระบุ'
};

function formatHtnVisitReason(patient) {
  const base = HTN_REASON_MAP[patient.htnVisitReason] || 'ไม่ได้ระบุ';
  return patient.htnVisitReasonDetail ? `${base} (${patient.htnVisitReasonDetail})` : base;
}

function formatHtnSource(patient) {
  return HTN_SOURCE_MAP[patient.htnSource] || 'ไม่ได้ระบุ';
}

function formatHtnKnownHx(patient) {
  return HTN_KNOWN_HX_MAP[patient.htnKnownHx] || 'ไม่ได้ระบุ';
}

function formatHtnCompliance(patient) {
  if (patient.htnCompliance === 'missed_days') {
    return patient.htnMissedDays
      ? `ลืมรับประทานยา หรือขาดยามา ${patient.htnMissedDays} วัน`
      : 'ลืมรับประทานยา หรือขาดยามาหลายวัน';
  }
  return HTN_COMPLIANCE_MAP[patient.htnCompliance] || 'ไม่ได้ระบุ';
}

function formatHtnPregnancyStatus(patient) {
  const map = {
    none: 'ไม่ได้ตั้งครรภ์',
    pregnancy_lt_20wks: 'กำลังตั้งครรภ์ (อายุครรภ์น้อยกว่า 20 สัปดาห์)',
    pregnancy_gt_20wks: 'กำลังตั้งครรภ์เกิน 20 สัปดาห์ หรือหลังคลอดไม่เกิน 6 สัปดาห์',
    unsure: 'ไม่ทราบ / ไม่แน่ใจภาวะตั้งครรภ์'
  };
  return map[patient.htnPregnancyStatus] || 'ไม่ได้ระบุ';
}

// --- Rapid Note Generator & Output Dispatcher (Clean Reports, Zero Enum Leak, C-AP13) ---
function updateHypertensionOutputs(rec) {
  if (!rec) return null;

  const durVal = rec.durationVal;
  const durationStr = durVal ? `${durVal} ${HTN_UNIT_MAP[rec.durationUnit] || 'ชั่วโมง'}` : 'ไม่ได้ระบุ';

  const neuroSigns = Array.isArray(rec.htnNeuroSigns) ? rec.htnNeuroSigns : [];
  const cardioSigns = Array.isArray(rec.htnCardioSigns) ? rec.htnCardioSigns : [];
  const renalSigns = Array.isArray(rec.htnRenalSigns) ? rec.htnRenalSigns : [];
  const pregSigns = Array.isArray(rec.htnPregnancySigns) ? rec.htnPregnancySigns : [];
  const generalSigns = Array.isArray(rec.htnGeneralSigns) ? rec.htnGeneralSigns : [];
  const triggers = Array.isArray(rec.htnTriggers) ? rec.htnTriggers : [];

  const isFemale = rec.gender === 'หญิง' || rec.gender === 'Female' || rec.gender === 'female';
  const posList = [];
  const negList = [];

  if (rec.htnPeakSystolic || rec.htnPeakDiastolic) {
    const sbpStr = rec.htnPeakSystolic ? `${rec.htnPeakSystolic}` : '?';
    const dbpStr = rec.htnPeakDiastolic ? `${rec.htnPeakDiastolic}` : '?';
    const prStr = rec.htnPeakPulse ? `, ชีพจร ${rec.htnPeakPulse} ครั้ง/นาที` : '';
    posList.push(`ตรวจพบความดันโลหิตสูงสุดก่อนมารพ.: ${sbpStr}/${dbpStr} mmHg${prStr}`);
  } else if (rec.htnBpUnknownExact) {
    posList.push('ตรวจพบความดันโลหิตสูงมากผิดปกติก่อนมารพ. (จำตัวเลขแน่ชัดไม่ได้)');
  }

  neuroSigns.forEach(k => { if (HTN_NEURO_MAP[k]) posList.push(HTN_NEURO_MAP[k]); });
  cardioSigns.forEach(k => { if (HTN_CARDIO_MAP[k]) posList.push(HTN_CARDIO_MAP[k]); });
  renalSigns.forEach(k => { if (HTN_RENAL_MAP[k]) posList.push(HTN_RENAL_MAP[k]); });

  if (isFemale) {
    if (rec.htnPregnancyStatus === 'pregnancy_gt_20wks') {
      posList.push('กำลังตั้งครรภ์อายุครรภ์เกิน 20 สัปดาห์ หรือหลังคลอดบุตรไม่เกิน 6 สัปดาห์');
      pregSigns.forEach(k => { if (HTN_PREG_SIGNS_MAP[k]) posList.push(HTN_PREG_SIGNS_MAP[k]); });
    } else if (rec.htnPregnancyStatus === 'pregnancy_lt_20wks') {
      posList.push('กำลังตั้งครรภ์ (อายุครรภ์น้อยกว่า 20 สัปดาห์)');
    }
  }

  const generalPos = generalSigns.filter(k => k !== 'no_general_signs');
  generalPos.forEach(k => { if (HTN_GENERAL_MAP[k]) posList.push(HTN_GENERAL_MAP[k]); });

  const triggersPos = triggers.filter(k => k !== 'no_triggers');
  const triggerDetailValueMap = {
    severe_pain_other: rec.htnTriggerPainDetail,
    energy_drink_coffee_alc: rec.htnTriggerDrinkDetail,
    nsaids_cold_steroid: rec.htnTriggerMedDetail,
    substance_stimulants: rec.htnTriggerSubstanceDetail
  };
  const formatHtnTriggerItem = (k) => {
    const label = HTN_TRIGGER_MAP[k];
    if (!label) return '';
    const det = triggerDetailValueMap[k] ? String(triggerDetailValueMap[k]).trim() : '';
    return det ? `${label} (${det})` : label;
  };
  triggersPos.forEach(k => {
    const txt = formatHtnTriggerItem(k);
    if (txt) posList.push(`ปัจจัยกระตุ้น: ${txt}`);
  });

  if (rec.otherSymptomsFree) posList.push(rec.otherSymptomsFree);

  // Negatives (strictly explicit confirmation — Zero Default Bias)
  if (rec.htnTodNone && neuroSigns.length === 0 && cardioSigns.length === 0 && renalSigns.length === 0) {
    negList.push('ปฏิเสธอาการเตือนอวัยวะเป้าหมาย (สมอง หัวใจ ปอด และไตเฉียบพลัน)');
  } else {
    if (cardioSigns.length > 0) {
      if (!cardioSigns.includes('crushing_chest_pressure') && !cardioSigns.includes('tearing_chest_back_pain')) {
        negList.push('ปฏิเสธเจ็บแน่นหน้าอกและอาการเจ็บฉีกขาดทะลุหลัง');
      }
      if (!cardioSigns.includes('orthopnea_pulmonary_edema') && !cardioSigns.includes('pink_frothy_sputum')) {
        negList.push('ปฏิเสธหอบเหนื่อยนอนราบไม่ได้และไอเสมหะฟองสีชมพู');
      }
    }
    if (neuroSigns.length > 0 && !neuroSigns.includes('facial_droop_dysarthria') && !neuroSigns.includes('hemiparesis_numbness')) {
      negList.push('ปฏิเสธปากเบี้ยว พูดไม่ชัด และแขนขาอ่อนแรงครึ่งซีก');
    }
    if (renalSigns.length > 0 && !renalSigns.includes('anuria_oliguria') && !renalSigns.includes('gross_hematuria_coca_cola')) {
      negList.push('ปฏิเสธปัสสาวะออกน้อยและปัสสาวะเป็นเลือด');
    }
  }

  if (generalSigns.includes('no_general_signs') && generalPos.length === 0) {
    negList.push('ปฏิเสธหน้ามืดวูบ เลือดกำเดาไหล และอาเจียนพุ่ง');
  }
  if (triggers.includes('no_triggers') && triggersPos.length === 0) {
    negList.push('ปฏิเสธปัจจัยกระตุ้นความดันสูงและสารเสพติด');
  } else if (triggersPos.length > 0 && !triggersPos.includes('substance_stimulants')) {
    negList.push('ปฏิเสธการใช้สารเสพติดและสารกระตุ้นประสาท');
  }
  if (isFemale && rec.htnPregnancyStatus === 'none') {
    negList.push('ไม่ได้ตั้งครรภ์');
  }

  rec.pertinentPositives = posList.length > 0 ? posList : ['ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม'];
  rec.pertinentNegatives = negList.length > 0 ? negList : ['ผู้ป่วยไม่ได้ระบุคำตอบยืนยันในหมวดอาการร่วม'];

  const hospLabel = HTN_HOSP_MAP[rec.hospRecordStatus] || 'ไม่ได้ระบุ';
  const udArr = Array.isArray(rec.underlying) ? rec.underlying : (rec.underlying ? [rec.underlying] : []);
  const filteredUd = udArr.filter(u => u && !u.includes('ปฏิเสธ') && u !== 'ไม่มี' && u !== 'ไม่มีโรคประจำตัว' && u !== 'ไม่ได้ระบุ');
  const hasExplicitUdDeny = udArr.some(u => u && (u.includes('ปฏิเสธ') || u === 'ไม่มี' || u === 'ไม่มีโรคประจำตัว'));
  const udDisplay = filteredUd.length > 0
    ? filteredUd.join(', ')
    : ((hasExplicitUdDeny || rec.hospRecordStatus === 'self' || rec.hospRecordStatus === 'additional') ? 'ปฏิเสธ' : 'ไม่ได้ระบุ');

  const allergyDisplay = (!rec.drugAllergy || rec.drugAllergy === 'ไม่ได้ระบุ')
    ? 'ไม่ได้ระบุ'
    : ((rec.drugAllergy.includes('ปฏิเสธ') || rec.drugAllergy === 'ไม่มี') ? 'ปฏิเสธ' : rec.drugAllergy);
  const medsText = (!rec.currentMeds || rec.currentMeds === 'ไม่ได้ระบุ')
    ? 'ไม่ได้ระบุ'
    : (rec.currentMeds === 'ไม่มี' ? 'ไม่มี' : rec.currentMeds);
  const docNotes = rec.doctor_notes || {};
  const redFlags = evaluateHypertensionRedFlags(rec);
  rec.redFlags = redFlags;

  let bpString = 'ไม่ได้ระบุ';
  if (rec.htnPeakSystolic || rec.htnPeakDiastolic) {
    const sbp = rec.htnPeakSystolic || '?';
    const dbp = rec.htnPeakDiastolic || '?';
    const pr = rec.htnPeakPulse ? ` mmHg (Pulse ${rec.htnPeakPulse} bpm)` : ' mmHg';
    bpString = `${sbp}/${dbp}${pr}`;
  } else if (rec.htnBpUnknownExact) {
    bpString = 'ตรวจพบสูงมากผิดปกติ (จำตัวเลขแน่ชัดไม่ได้)';
  }

  const triggersDisplay = triggersPos.length > 0
    ? triggersPos.map(formatHtnTriggerItem).filter(Boolean).join(', ')
    : (triggers.includes('no_triggers') ? HTN_TRIGGER_MAP.no_triggers : 'ไม่ได้ระบุ');

  const pregRapidLine = isFemale ? `\n• สถานะการตั้งครรภ์: ${formatHtnPregnancyStatus(rec)}` : '';

  const defaultRapid = `[Chief Complaint (CC)]
ตรวจพบความดันโลหิตสูง (Severe Hypertension Screen) เป็นมา ${durationStr}

[History of Present Illness (HPI)]
• ระยะเวลาและสาเหตุที่มารพ.: เป็นมา ${durationStr} | สาเหตุ: ${formatHtnVisitReason(rec)}
• ค่าความดันโลหิตสูงสุดก่อนมารพ.: ${bpString}
• แหล่งที่ตรวจพบค่าความดัน: ${formatHtnSource(rec)}
• ประวัติโรคความดันเดิม: ${formatHtnKnownHx(rec)}
• การรับประทานยาลดความดัน: ${formatHtnCompliance(rec)}${pregRapidLine}

• Pertinent Positives:
${rec.pertinentPositives.map(p => `  - ${p}`).join('\n')}

• Pertinent Negatives:
${rec.pertinentNegatives.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• โรคประจำตัว (U/D): ${udDisplay}
• ยาประจำตัว (Current Meds): ${medsText}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${allergyDisplay}
• ปัจจัยกระตุ้นร่วม: ${triggersDisplay}

[Emergency Risk Assessment (Red Flags)]
${redFlags.length > 0
  ? `🚩 RED FLAGS DETECTED:\n${redFlags.map(rf => `  * ${rf.textTh}`).join('\n')}`
  : '✓ ไม่พบสัญญาณเตือนวิกฤตเฉียบพลันเบื้องต้น (No Acute Target Organ Damage)'}

[Doctor's Clinical Addendum & Exam]
• ประวัติเพิ่มเติม/แก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}
• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}
• แผนการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

  const genderLabel = (rec.gender && rec.gender !== 'ไม่ระบุ') ? rec.gender : '';
  let bpNarStr = 'ไม่ทราบค่าแน่ชัด';
  if (rec.htnPeakSystolic || rec.htnPeakDiastolic) {
    bpNarStr = `${rec.htnPeakSystolic || '?'}/${rec.htnPeakDiastolic || '?'} mmHg`;
  }
  let narrative = `ผู้ป่วย${genderLabel} อายุ ${rec.age || 'ไม่ได้ระบุ'} ปี มารับการตรวจที่ห้องฉุกเฉินด้วยอาการตรวจพบความดันโลหิตสูง เป็นมา ${durationStr} ` +
    `สาเหตุ: ${formatHtnVisitReason(rec)} ความดันสูงสุด ${bpNarStr} จาก${formatHtnSource(rec)} ` +
    `ประวัติเดิม: ${formatHtnKnownHx(rec)} การรับประทานยา: ${formatHtnCompliance(rec)}`;
  if (posList.length > 0) narrative += ` อาการร่วมที่พบ: ${posList.join(', ')}`;
  if (negList.length > 0) narrative += ` โดยยืนยันปฏิเสธ: ${negList.join(', ')}`;

  const jsonOutput = {
    encounter: {
      chief_complaint: 'hypertension',
      chief_complaint_title_th: 'ตรวจพบความดันโลหิตสูง',
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
      visit_reason: rec.htnVisitReason || null,
      visit_reason_detail: rec.htnVisitReasonDetail || '',
      peak_blood_pressure: {
        systolic: rec.htnPeakSystolic || null,
        diastolic: rec.htnPeakDiastolic || null,
        pulse: rec.htnPeakPulse || null,
        unknown_exact: Boolean(rec.htnBpUnknownExact)
      },
      detection_source: rec.htnSource || null,
      known_ht_history: rec.htnKnownHx || null,
      target_organ_none_confirmed: Boolean(rec.htnTodNone),
      neurologic_symptoms: neuroSigns,
      cardiopulmonary_symptoms: cardioSigns,
      renal_symptoms: renalSigns,
      pregnancy_status: isFemale ? (rec.htnPregnancyStatus || null) : null,
      pregnancy_symptoms: isFemale ? pregSigns : [],
      general_warning_signs: generalSigns,
      compliance: rec.htnCompliance || null,
      missed_days: rec.htnMissedDays || null,
      triggers_and_substances: triggers,
      trigger_details: {
        pain_location: rec.htnTriggerPainDetail || '',
        drink_type: rec.htnTriggerDrinkDetail || '',
        medication_name: rec.htnTriggerMedDetail || '',
        substance_detail: rec.htnTriggerSubstanceDetail || ''
      },
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

  const finalRapid = rec.custom_rapid_note || defaultRapid;
  const finalNarrative = rec.custom_narrative_note || narrative;
  rec.rapidHpi = finalRapid;
  rec.narrativeHpi = finalNarrative;
  rec.medicalJson = jsonOutput;

  if (typeof document !== 'undefined') {
    const rapidEl = getHtnEl('rapidTextView');
    const narrativeEl = getHtnEl('narrativeTextView');
    const jsonEl = getHtnEl('jsonViewer');
    if (rapidEl) rapidEl.value = finalRapid;
    if (narrativeEl) narrativeEl.value = finalNarrative;
    if (jsonEl) jsonEl.textContent = JSON.stringify(jsonOutput, null, 2);
  }

  return { rapid: finalRapid, narrative: finalNarrative, json: jsonOutput };
}

function renderHypertensionRapidHpi(patient) {
  const res = updateHypertensionOutputs(patient);
  return res ? res.rapid : '';
}

function renderHypertensionNarrative(patient) {
  const res = updateHypertensionOutputs(patient);
  return res ? res.narrative : '';
}

function renderHypertensionDoctorHpi(patient) {
  return renderHypertensionRapidHpi(patient);
}

// --- Patient Form HTML Template ---
const HYPERTENSION_FORM_HTML = `
<div id="cc-hypertension-section" class="hidden space-y-6">
  <div data-cc-top-banner="hypertension">
    <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
      <div class="bg-amber-100 text-amber-800 p-2.5 rounded-xl flex-shrink-0 mt-0.5">
        <i data-lucide="alert-circle" class="w-5 h-5"></i>
      </div>
      <div>
        <h3 class="text-sm font-bold text-amber-900 mb-1">คำแนะนำเบื้องต้นระหว่างรอตรวจ</h3>
        <p class="text-xs text-amber-800 leading-relaxed">
          กรุณานั่งพักนิ่งๆ 5–10 นาที ทำใจให้สบาย หลีกเลี่ยงการเดินเร็วหรือเครื่องดื่มคาเฟอีน หากมีอาการเจ็บแน่นหน้าอกหรือปวดฉีกทะลุหลัง หอบเหนื่อยนอนราบไม่ได้ ปากเบี้ยว แขนขาอ่อนแรง ตามัวฉับพลัน หรือตั้งครรภ์ 20 สัปดาห์ขึ้นไป กรุณาแจ้งพยาบาลทันที
        </p>
      </div>
    </div>
  </div>

  <!-- CARD 1: ข้อมูลการตรวจพบความดันโลหิตสูงและประวัติเดิม -->
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
        <i data-lucide="activity" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900">1. ข้อมูลการตรวจพบความดันโลหิตสูงและประวัติเดิม</h2>
        <p class="text-xs text-slate-500">ระยะเวลา สาเหตุที่มา ตัวเลขความดัน และประวัติโรคความดันเดิม</p>
      </div>
    </div>

    <div class="space-y-4">
      <div>
        ${renderHtnSysHeader({
          label: '1.1 ทราบว่าความดันสูง หรือมีอาการมานานเท่าใด',
          icon: 'clock',
          colorClass: 'bg-sky-100 text-sky-700'
        })}
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div class="col-span-1 sm:col-span-2">
            <input type="number" id="htnDurationVal" min="1" max="365" placeholder="ระบุตัวเลข เช่น 2"
              class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white transition">
          </div>
          <div class="col-span-1">
            <select id="htnDurationUnit"
              class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white transition">
              <option value="minutes">นาที</option>
              <option value="hours" selected>ชั่วโมง</option>
              <option value="days">วัน</option>
              <option value="weeks">สัปดาห์</option>
              <option value="months">เดือน</option>
              <option value="years">ปี</option>
            </select>
          </div>
        </div>
      </div>

      <div class="pt-4 border-t border-slate-100">
        ${renderHtnSysHeader({
          label: '1.2 สาเหตุที่มารับการตรวจในวันนี้',
          icon: 'clipboard-list',
          colorClass: 'bg-sky-100 text-sky-700'
        })}
        ${renderHtnGrid('grid-cols-1 sm:grid-cols-2', [
          { kind: 'radio', name: 'htnVisitReason', value: 'high_bp_detected', title: ['ตรวจพบความดันสูง'], onchange: 'handleHtnVisitReasonChange(this.value)' },
          { kind: 'radio', name: 'htnVisitReason', value: 'other_appointment', title: ['มาตามนัด', 'ตรวจโรคอื่น'], onchange: 'handleHtnVisitReasonChange(this.value)' },
          { kind: 'radio', name: 'htnVisitReason', value: 'suspected_symptoms', title: ['มีอาการสงสัย', 'ว่าเกิดจาก', 'ความดันสูง'], onchange: 'handleHtnVisitReasonChange(this.value)' },
          { kind: 'radio', name: 'htnVisitReason', value: 'other_reasons', title: ['มาด้วยอาการอื่น'], onchange: 'handleHtnVisitReasonChange(this.value)' }
        ])}
        <div id="htnVisitReasonDetailContainer" class="hidden mt-3 pl-4 border-l-2 border-medical-200">
          <label class="block text-xs font-medium text-slate-600 mb-1">ระบุรายละเอียดสาเหตุหรืออาการเพิ่มเติม:</label>
          <input type="text" id="htnVisitReasonDetail" placeholder="ระบุรายละเอียด เช่น คลินิกเบาหวาน หรือมึนศีรษะ..."
            class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white transition">
        </div>
      </div>

      <div class="pt-4 border-t border-slate-100">
        ${renderHtnSysHeader({
          label: '1.3 ตัวเลขความดันโลหิตสูงสุดที่วัดได้ก่อนมาโรงพยาบาล',
          icon: 'gauge',
          colorClass: 'bg-teal-100 text-teal-700'
        })}
        <div class="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">ความดันตัวบน (mmHg):</label>
              <input type="number" id="htnPeakSystolic" placeholder="เช่น 180" min="40" max="300"
                class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 transition">
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">ความดันตัวล่าง (mmHg):</label>
              <input type="number" id="htnPeakDiastolic" placeholder="เช่น 110" min="30" max="200"
                class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 transition">
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">ชีพจร (ครั้ง/นาที):</label>
              <input type="number" id="htnPeakPulse" placeholder="เช่น 85" min="30" max="250"
                class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 transition">
            </div>
          </div>
          ${renderHtnOption({
            id: 'htnBpUnknownExact',
            value: 'unknown_exact',
            compact: true,
            title: ['จำตัวเลขแน่ชัดไม่ได้', 'แต่ทราบว่าสูงมาก'],
            onchange: 'handleHtnUnknownBpChange(this)'
          })}
        </div>
      </div>

      <div class="pt-4 border-t border-slate-100">
        ${renderHtnSysHeader({
          label: '1.4 แหล่งหรือสถานที่ที่วัดความดันได้',
          icon: 'map-pin',
          colorClass: 'bg-sky-100 text-sky-700'
        })}
        ${renderHtnGrid('grid-cols-1 sm:grid-cols-2', [
          { kind: 'radio', name: 'htnSource', value: 'home_digital', title: ['วัดเองที่บ้าน', '/ เครื่องดิจิทัล'] },
          { kind: 'radio', name: 'htnSource', value: 'health_center', title: ['รพ.สต. / สถานีอนามัย', '/ คลินิกชุมชน'] },
          { kind: 'radio', name: 'htnSource', value: 'private_clinic', title: ['คลินิกเอกชน', '/ รพ.เอกชน'] },
          { kind: 'radio', name: 'htnSource', value: 'triage_hospital', title: ['จุดคัดกรองโรงพยาบาล', '/ หน้าห้องตรวจ'] },
          { kind: 'radio', name: 'htnSource', value: 'other', title: ['สถานที่อื่น', '/ ไม่แน่ชัด'], colSpan2: true }
        ])}
      </div>

      <div class="pt-4 border-t border-slate-100">
        ${renderHtnSysHeader({
          label: '1.5 ประวัติโรคความดันโลหิตสูงเดิม',
          icon: 'file-text',
          colorClass: 'bg-teal-100 text-teal-700'
        })}
        ${renderHtnGrid('grid-cols-1 sm:grid-cols-3', [
          { kind: 'radio', name: 'htnKnownHx', value: 'known_htn', title: ['มีโรคความดันเดิม'] },
          { kind: 'radio', name: 'htnKnownHx', value: 'first_time', title: ['เพิ่งพบครั้งแรก', 'ในชีวิต'] },
          { kind: 'radio', name: 'htnKnownHx', value: 'unsure', title: ['ไม่แน่ใจประวัติเดิม'] }
        ])}
      </div>
    </div>
  </div>

  <!-- CARD 2: คัดกรองสัญญาณเตือนอวัยวะเป้าหมาย -->
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
        <i data-lucide="shield-alert" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900">2. คัดกรองอาการเตือนอวัยวะเป้าหมายในขณะนี้</h2>
        <p class="text-xs text-slate-500">เลือกหมวดที่พบอาการผิดปกติ หรือเลือกปุ่มไม่มีอาการในหมวดนี้</p>
      </div>
    </div>

    ${renderHtnSysHeader({
      label: 'กลุ่มอาการผิดปกติของสมอง หัวใจ ปอด และไต',
      icon: 'alert-triangle',
      colorClass: 'bg-amber-100 text-amber-700',
      toggleId: 'htn_tod_none',
      toggleLabel: 'ไม่มีอาการในหมวดนี้',
      toggleOnchange: 'handleHtnTodNoneToggle(this)'
    })}

    <div class="space-y-4">
      <!-- 2.1 ระบบประสาท -->
      <div class="space-y-3">
        <label class="selectable-card flex items-center p-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 hover:border-medical-400 transition cursor-pointer">
          <input type="checkbox" id="htnParentNeuro" onchange="toggleHtnParentGroup('htnNeuroSubGroup', this.checked)"
            class="text-medical-600 focus:ring-medical-500 h-5 w-5 rounded flex-shrink-0">
          <div class="ml-3">
            <span class="text-sm font-bold text-slate-800">2.1 อาการทางสมอง ปวดหัวรุนแรง หรือการมองเห็นผิดปกติ</span>
            <p class="text-xs text-slate-500">เช่น ปวดหัวท้ายทอยรุนแรง ตามัวฉับพลัน ปากเบี้ยว แขนขาอ่อนแรง หรือซึมสับสน</p>
          </div>
        </label>
        <div id="htnNeuroSubGroup" class="hidden pl-4 sm:pl-6 space-y-2 border-l-2 border-medical-200">
          <p class="text-xs text-slate-600 font-medium mb-1">เลือกอาการที่พบ (เลือกได้หลายข้อ):</p>
          ${renderHtnGrid('grid-cols-1 sm:grid-cols-2', [
            { name: 'htnNeuroSigns', value: 'severe_headache_occipital', title: ['ปวดหัวรุนแรง', 'เฉียบพลัน', '/ ปวดตื้อท้ายทอย'] },
            { name: 'htnNeuroSigns', value: 'blurred_vision_scotoma', title: ['ตามัวลงเฉียบพลัน', '/ เห็นแสงวับวาบ'] },
            { name: 'htnNeuroSigns', value: 'facial_droop_dysarthria', title: ['ปากเบี้ยว หน้าเบี้ยว', '/ พูดไม่ชัด', 'กลืนลำบาก'] },
            { name: 'htnNeuroSigns', value: 'hemiparesis_numbness', title: ['แขนขาอ่อนแรง', 'หรือชาครึ่งซีก'] },
            { name: 'htnNeuroSigns', value: 'confusion_lethargy', title: ['ซึมลง สับสน', '/ ชักเกร็งกระตุก'] },
            { name: 'htnNeuroSigns', value: 'sudden_monocular_vision_loss', title: ['ตาบอดข้างเดียว', 'ฉับพลัน'] }
          ])}
        </div>
      </div>

      <!-- 2.2 หัวใจและปอด -->
      <div class="space-y-3">
        <label class="selectable-card flex items-center p-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 hover:border-medical-400 transition cursor-pointer">
          <input type="checkbox" id="htnParentCardio" onchange="toggleHtnParentGroup('htnCardioSubGroup', this.checked)"
            class="text-medical-600 focus:ring-medical-500 h-5 w-5 rounded flex-shrink-0">
          <div class="ml-3">
            <span class="text-sm font-bold text-slate-800">2.2 เจ็บหน้าอก ปวดทะลุหลัง หรือหอบเหนื่อย</span>
            <p class="text-xs text-slate-500">เช่น แน่นอกคล้ายของหนักทับ ปวดฉีกทะลุหลัง นอนราบไม่ได้ หรือไอฟองสีชมพู</p>
          </div>
        </label>
        <div id="htnCardioSubGroup" class="hidden pl-4 sm:pl-6 space-y-2 border-l-2 border-medical-200">
          <p class="text-xs text-slate-600 font-medium mb-1">เลือกอาการที่พบ (เลือกได้หลายข้อ):</p>
          ${renderHtnGrid('grid-cols-1 sm:grid-cols-2', [
            { name: 'htnCardioSigns', value: 'crushing_chest_pressure', title: ['เจ็บแน่นกลางหน้าอก', 'ร้าวกราม / แขนซ้าย'] },
            { name: 'htnCardioSigns', value: 'tearing_chest_back_pain', title: ['เจ็บแปลบเหมือนฉีกขาด', 'ร้าวทะลุหลังสะบัก'] },
            { name: 'htnCardioSigns', value: 'orthopnea_pulmonary_edema', title: ['หอบเหนื่อยรุนแรง', 'นอนราบไม่ได้'] },
            { name: 'htnCardioSigns', value: 'pink_frothy_sputum', title: ['ไอมีฟองสีชมพู', 'หรือเสมหะปนเลือด'] },
            { name: 'htnCardioSigns', value: 'palpitations_racing_heart', title: ['ใจสั่นรัว', 'หัวใจเต้นสะดุดแรง'], colSpan2: true }
          ])}
        </div>
      </div>

      <!-- 2.3 ไตและภาวะบวม -->
      <div class="space-y-3">
        <label class="selectable-card flex items-center p-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 hover:border-medical-400 transition cursor-pointer">
          <input type="checkbox" id="htnParentRenal" onchange="toggleHtnParentGroup('htnRenalSubGroup', this.checked)"
            class="text-medical-600 focus:ring-medical-500 h-5 w-5 rounded flex-shrink-0">
          <div class="ml-3">
            <span class="text-sm font-bold text-slate-800">2.3 ปัสสาวะผิดปกติ หรือตัวบวม ขาบวม</span>
            <p class="text-xs text-slate-500">เช่น ปัสสาวะไม่ออก ออกน้อย ปัสสาวะสีแดง/น้ำล้างเนื้อ หรือขาบวมสองข้าง</p>
          </div>
        </label>
        <div id="htnRenalSubGroup" class="hidden pl-4 sm:pl-6 space-y-2 border-l-2 border-medical-200">
          <p class="text-xs text-slate-600 font-medium mb-1">เลือกอาการที่พบ (เลือกได้หลายข้อ):</p>
          ${renderHtnGrid('grid-cols-1 sm:grid-cols-3', [
            { name: 'htnRenalSigns', value: 'anuria_oliguria', title: ['ปัสสาวะไม่ออก', '/ ออกน้อยผิดปกติ'] },
            { name: 'htnRenalSigns', value: 'gross_hematuria_coca_cola', title: ['ปัสสาวะสีแดงสด', '/ สีน้ำล้างเนื้อ'] },
            { name: 'htnRenalSigns', value: 'leg_edema_bilateral', title: ['ขาบวมสองข้าง', 'หรือหน้าตาบวม'] }
          ])}
        </div>
      </div>
    </div>
  </div>

  <!-- CARD 3: อาการร่วมทั่วไป และการคัดกรองภาวะตั้งครรภ์ -->
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
        <i data-lucide="alert-circle" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900">3. อาการร่วมทั่วไป และการคัดกรองภาวะตั้งครรภ์</h2>
        <p class="text-xs text-slate-500">หน้ามืด เลือดกำเดาไหล อาเจียนพุ่ง และภาวะตั้งครรภ์ (เฉพาะสตรี)</p>
      </div>
    </div>

    <div class="space-y-4">
      <div>
        ${renderHtnSysHeader({
          label: '3.1 อาการเตือนและอาการร่วมทั่วไป (เลือกได้หลายข้อ)',
          icon: 'activity',
          colorClass: 'bg-sky-100 text-sky-700',
          toggleId: 'htn_general_none',
          toggleName: 'htnGeneralSigns',
          toggleValue: 'no_general_signs',
          toggleLabel: 'ไม่มีอาการในหมวดนี้',
          toggleOnchange: 'handleHtnGeneralNoneToggle(this)'
        })}
        ${renderHtnGrid('grid-cols-1 sm:grid-cols-3', [
          { name: 'htnGeneralSigns', value: 'dizziness_cold_sweat', title: ['หน้ามืด วูบเวียนหัว', 'เหงื่อแตกตัวเย็น'], onchange: 'handleHtnGeneralItemChange(this)' },
          { name: 'htnGeneralSigns', value: 'severe_epistaxis', title: ['เลือดกำเดาไหล', 'ออกมากผิดปกติ'], onchange: 'handleHtnGeneralItemChange(this)' },
          { name: 'htnGeneralSigns', value: 'projectile_vomiting', title: ['คลื่นไส้', 'อาเจียนพุ่งหลายครั้ง'], onchange: 'handleHtnGeneralItemChange(this)' }
        ])}
      </div>

      <!-- 3.2 สำหรับผู้ป่วยสตรี (hidden เริ่มต้น — C-AP13) -->
      <div id="htnFemalePregnancySection" class="hidden pt-4 border-t border-slate-100 space-y-3">
        ${renderHtnSysHeader({
          label: '3.2 สำหรับผู้ป่วยสตรี: สถานะการตั้งครรภ์และหลังคลอด',
          icon: 'user',
          colorClass: 'bg-pink-100 text-pink-700',
          toggleId: 'htn_preg_none',
          toggleLabel: 'ไม่ได้ตั้งครรภ์',
          toggleOnchange: 'handleHtnPregNoneToggle(this)'
        })}
        ${renderHtnGrid('grid-cols-1 sm:grid-cols-3', [
          { kind: 'radio', name: 'htnPregnancyStatus', value: 'pregnancy_gt_20wks', title: ['ตั้งครรภ์เกิน', '20 สัปดาห์', '/ หลังคลอด', 'ไม่เกิน 6 สัปดาห์'], onchange: 'handleHtnPregnancyChange(this.value)' },
          { kind: 'radio', name: 'htnPregnancyStatus', value: 'pregnancy_lt_20wks', title: ['ตั้งครรภ์น้อยกว่า', '20 สัปดาห์'], onchange: 'handleHtnPregnancyChange(this.value)' },
          { kind: 'radio', name: 'htnPregnancyStatus', value: 'unsure', title: ['ไม่ทราบ', '/ ไม่แน่ใจ'], onchange: 'handleHtnPregnancyChange(this.value)' }
        ])}

        <div id="htnPregnancySymptomsSub" class="hidden mt-3 pl-4 sm:pl-6 space-y-2 border-l-2 border-medical-200">
          <p class="text-xs text-slate-600 font-medium mb-1">อาการร่วมในสตรีตั้งครรภ์/หลังคลอด (เลือกได้หลายข้อ):</p>
          ${renderHtnGrid('grid-cols-1 sm:grid-cols-3', [
            { name: 'htnPregnancySigns', value: 'ruq_epigastric_pain', title: ['จุกแน่นใต้ลิ้นปี่', '/ ชายโครงขวา'] },
            { name: 'htnPregnancySigns', value: 'flashing_lights_vision', title: ['ตาพร่ามัว', '/ เห็นแสงวับวาบ'] },
            { name: 'htnPregnancySigns', value: 'severe_throbbing_headache', title: ['ปวดศีรษะรุนแรง', 'ทานยาไม่ทุเลา'] }
          ])}
        </div>
      </div>
    </div>
  </div>

  <!-- CARD 4: การใช้ยาลดความดันและปัจจัยกระตุ้นร่วม -->
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
        <i data-lucide="pill" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900">4. การใช้ยาลดความดันและปัจจัยกระตุ้นร่วม</h2>
        <p class="text-xs text-slate-500">ความสม่ำเสมอการทานยา และปัจจัยกระตุ้นความดันโลหิตสูง</p>
      </div>
    </div>

    <div class="space-y-4">
      <div>
        ${renderHtnSysHeader({
          label: '4.1 ประวัติการรับประทานยาลดความดันโลหิต',
          icon: 'pill',
          colorClass: 'bg-sky-100 text-sky-700'
        })}
        ${renderHtnGrid('grid-cols-1 sm:grid-cols-2', [
          { kind: 'radio', name: 'htnCompliance', value: 'regular', title: ['ทานยาสม่ำเสมอ', 'ครบตามแพทย์สั่ง'], onchange: 'handleHtnComplianceChange(this.value)' },
          { kind: 'radio', name: 'htnCompliance', value: 'missed_days', title: ['ลืมทานยา', '/ ขาดยามาหลายวัน'], onchange: 'handleHtnComplianceChange(this.value)' },
          { kind: 'radio', name: 'htnCompliance', value: 'self_adjusted', title: ['ปรับขนาดยาเอง', '/ หยุดยาเอง'], onchange: 'handleHtnComplianceChange(this.value)' },
          { kind: 'radio', name: 'htnCompliance', value: 'no_prior_rx', title: ['ไม่เคยมียาลดความดัน'], onchange: 'handleHtnComplianceChange(this.value)' }
        ])}

        <div id="htnMissedDaysContainer" class="hidden mt-3 pl-4 border-l-2 border-medical-200">
          <div class="flex items-center gap-2">
            <label class="text-xs font-medium text-slate-600">ขาดยามาประมาณ:</label>
            <input type="number" id="htnMissedDays" placeholder="เช่น 3" min="1" max="365"
              class="w-24 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-medical-500 focus:outline-none">
            <span class="text-xs text-slate-600">วัน</span>
          </div>
        </div>
      </div>

      <div class="pt-4 border-t border-slate-100">
        ${renderHtnSysHeader({
          label: '4.2 ปัจจัยกระตุ้นความดันสูงเฉียบพลัน (เลือกได้หลายข้อ)',
          icon: 'zap',
          colorClass: 'bg-teal-100 text-teal-700',
          toggleId: 'htn_triggers_none',
          toggleName: 'htnTriggers',
          toggleValue: 'no_triggers',
          toggleLabel: 'ไม่มีในหมวดนี้',
          toggleOnchange: 'handleHtnTriggersNoneToggle(this)'
        })}
        ${renderHtnGrid('grid-cols-1 sm:grid-cols-2', [
          { name: 'htnTriggers', value: 'stress_insomnia', title: ['เครียดหนัก /', 'นอนไม่หลับต่อเนื่อง'], onchange: 'handleHtnTriggerItemChange(this)' },
          { name: 'htnTriggers', value: 'severe_pain_other', title: ['ปวด/เจ็บ', 'ที่ตำแหน่งอื่น', 'ของร่างกาย'], onchange: 'handleHtnTriggerItemChange(this)' },
          { name: 'htnTriggers', value: 'energy_drink_coffee_alc', title: ['เครื่องดื่มชูกำลัง /', 'กาแฟ / แอลกอฮอล์'], onchange: 'handleHtnTriggerItemChange(this)' },
          { name: 'htnTriggers', value: 'nsaids_cold_steroid', title: ['ยาแก้หวัด / ยาแก้ปวด', '/ สเตียรอยด์'], onchange: 'handleHtnTriggerItemChange(this)' },
          { name: 'htnTriggers', value: 'substance_stimulants', title: ['ใช้สารเสพติด', '/ สารกระตุ้น', '(ยาบ้า, กัญชา,', 'กระท่อม)'], onchange: 'handleHtnTriggerItemChange(this)', colSpan2: true }
        ])}

        <div id="htnTriggerPainDetailContainer" class="hidden mt-3 pl-4 border-l-2 border-medical-200">
          <label class="block text-xs font-medium text-slate-600 mb-1">ระบุตำแหน่งหรืออาการปวด/เจ็บ:</label>
          <input type="text" id="htnTriggerPainDetail" placeholder="เช่น ปวดหลัง, ปวดฟัน, ปวดแผลผ่าตัด..."
            class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white transition">
        </div>
        <div id="htnTriggerDrinkDetailContainer" class="hidden mt-3 pl-4 border-l-2 border-medical-200">
          <label class="block text-xs font-medium text-slate-600 mb-1">ระบุเครื่องดื่มหรือปริมาณที่ดื่ม:</label>
          <input type="text" id="htnTriggerDrinkDetail" placeholder="เช่น กาแฟดำ 2 แก้ว, เครื่องดื่มชูกำลัง, สุรา..."
            class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white transition">
        </div>
        <div id="htnTriggerMedDetailContainer" class="hidden mt-3 pl-4 border-l-2 border-medical-200">
          <label class="block text-xs font-medium text-slate-600 mb-1">ระบุชื่อยาหรือลักษณะยาที่รับประทาน:</label>
          <input type="text" id="htnTriggerMedDetail" placeholder="เช่น ยาแก้หวัดคัดจมูก, ยาแก้ปวดข้อ, ยาชุด/สเตียรอยด์..."
            class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white transition">
        </div>
        <div id="htnTriggerSubstanceDetailContainer" class="hidden mt-3 pl-4 border-l-2 border-medical-200">
          <label class="block text-xs font-medium text-slate-600 mb-1">ระบุชนิดสารเสพติด/สารกระตุ้น หรือเวลาที่ใช้ล่าสุด:</label>
          <input type="text" id="htnTriggerSubstanceDetail" placeholder="เช่น ยาบ้า, กัญชา, น้ำกระท่อม..."
            class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white transition">
        </div>
      </div>
    </div>
  </div>

  <!-- อาการอื่นๆ เป็นช่องกรอกอิสระ -->
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100">
      <div class="bg-slate-100 text-slate-600 p-2 rounded-xl"><i data-lucide="message-square-plus" class="w-5 h-5"></i></div>
      <div>
        <h2 class="text-base font-bold text-slate-800">อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2>
        <p class="text-xs text-slate-500">ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)</p>
      </div>
    </div>
    <textarea id="hypertension_other_free" rows="2" placeholder="พิมพ์ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)..."
      class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"></textarea>
  </div>
</div>
`;

// --- Master Module Definition ---
const hypertensionModule = {
  id: 'hypertension',
  recordCc: 'hypertension',
  schemaCode: 'hypertension_detected',
  titleTh: 'ตรวจพบความดันโลหิตสูง',
  titleEn: 'Asymptomatic severe hypertension / High BP screen',
  icon: 'activity',
  doctorCcBadgeHtml: '<i data-lucide="activity" class="w-3.5 h-3.5 mr-1 text-rose-500"></i> CC: ตรวจพบความดันโลหิตสูง (Severe HTN Screen)',
  algorithm: 'hypertension-screen-protocol',
  sectionDomId: 'cc-hypertension-section',
  pmhSectionNumber: 5,
  dateFields: [],
  timeFields: [],
  branchIds: [
    'htnVisitReasonDetailContainer', 'htnNeuroSubGroup', 'htnCardioSubGroup',
    'htnRenalSubGroup', 'htnFemalePregnancySection', 'htnPregnancySymptomsSub',
    'htnMissedDaysContainer', 'htnTriggerPainDetailContainer',
    'htnTriggerDrinkDetailContainer', 'htnTriggerMedDetailContainer',
    'htnTriggerSubstanceDetailContainer'
  ],
  inputIdsToClear: [
    'htnDurationVal', 'htnVisitReasonDetail', 'htnPeakSystolic',
    'htnPeakDiastolic', 'htnPeakPulse', 'htnMissedDays',
    'htnTriggerPainDetail', 'htnTriggerDrinkDetail',
    'htnTriggerMedDetail', 'htnTriggerSubstanceDetail',
    'hypertension_other_free'
  ],
  getPmhSectionNumber: function() {
    return 5;
  },
  formHtml: HYPERTENSION_FORM_HTML,

  init: function() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
    const titleSelect = getHtnEl('patientTitleSelect');
    if (titleSelect && !titleSelect._htnBound) {
      titleSelect.addEventListener('change', () => {
        syncHtnFemalePregnancySection();
      });
      titleSelect._htnBound = true;
    }
    syncHtnFemalePregnancySection();
  },

  onSelectForm: function() {
    syncHtnFemalePregnancySection();
  },

  onActivate: function() {
    syncHtnFemalePregnancySection();
  },

  onTitleChange: function({ isFemale } = {}) {
    syncHtnFemalePregnancySection(isFemale);
  },

  collectIntake: function(ctx = {}) {
    ctx = ctx || {};
    const durVal = parseInt(getHtnEl('htnDurationVal')?.value, 10);
    const durUnit = getHtnEl('htnDurationUnit')?.value || 'hours';

    const getRadio = (name) => {
      const el = queryHtnOne(`input[name="${name}"]:checked`);
      return el ? el.value : null;
    };
    const getChecks = (name) => queryHtnAll(`input[name="${name}"]:checked`).map(el => el.value);

    const visitReason = getRadio('htnVisitReason');
    const needsDetail = (visitReason === 'other_appointment' || visitReason === 'suspected_symptoms' || visitReason === 'other_reasons');
    const visitReasonDetail = needsDetail ? (getHtnEl('htnVisitReasonDetail')?.value?.trim() || '') : '';

    const peakSys = parseInt(getHtnEl('htnPeakSystolic')?.value, 10);
    const peakDia = parseInt(getHtnEl('htnPeakDiastolic')?.value, 10);
    const peakPulse = parseInt(getHtnEl('htnPeakPulse')?.value, 10);
    const bpUnknownExact = Boolean(getHtnEl('htnBpUnknownExact')?.checked);

    const source = getRadio('htnSource');
    const knownHx = getRadio('htnKnownHx');

    const parentNeuro = Boolean(getHtnEl('htnParentNeuro')?.checked);
    const parentCardio = Boolean(getHtnEl('htnParentCardio')?.checked);
    const parentRenal = Boolean(getHtnEl('htnParentRenal')?.checked);

    const neuroSigns = parentNeuro ? getChecks('htnNeuroSigns') : [];
    const cardioSigns = parentCardio ? getChecks('htnCardioSigns') : [];
    const renalSigns = parentRenal ? getChecks('htnRenalSigns') : [];
    const todNone = Boolean(getHtnEl('htn_tod_none')?.checked) && !parentNeuro && !parentCardio && !parentRenal;

    const titleVal = (getHtnEl('patientTitleSelect')?.value || '').trim();
    const resolvedGender = ctx.gender && ctx.gender !== 'ไม่ระบุ'
      ? ctx.gender
      : (titleVal ? (isHtnPatientFemale() ? 'หญิง' : 'ชาย') : 'ไม่ระบุ');
    const isFemale = isHtnPatientFemale(resolvedGender === 'ไม่ระบุ' ? undefined : resolvedGender);

    const radioPreg = getRadio('htnPregnancyStatus');
    const pregNoneChecked = Boolean(getHtnEl('htn_preg_none')?.checked);
    const pregStatus = isFemale ? (radioPreg || (pregNoneChecked ? 'none' : null)) : null;
    const pregSigns = (isFemale && pregStatus === 'pregnancy_gt_20wks') ? getChecks('htnPregnancySigns') : [];

    const generalSigns = getChecks('htnGeneralSigns');
    const compliance = getRadio('htnCompliance');
    const missedDaysVal = compliance === 'missed_days' ? parseInt(getHtnEl('htnMissedDays')?.value, 10) : NaN;
    const triggers = getChecks('htnTriggers');
    const triggerPainDetail = triggers.includes('severe_pain_other') ? (getHtnEl('htnTriggerPainDetail')?.value?.trim() || '') : '';
    const triggerDrinkDetail = triggers.includes('energy_drink_coffee_alc') ? (getHtnEl('htnTriggerDrinkDetail')?.value?.trim() || '') : '';
    const triggerMedDetail = triggers.includes('nsaids_cold_steroid') ? (getHtnEl('htnTriggerMedDetail')?.value?.trim() || '') : '';
    const triggerSubstanceDetail = triggers.includes('substance_stimulants') ? (getHtnEl('htnTriggerSubstanceDetail')?.value?.trim() || '') : '';

    const otherSymptomsFree = getHtnEl('hypertension_other_free')?.value?.trim() || ctx.otherSymptomsFree || '';

    const rec = {
      id: ctx.recordId || ctx.id || `case-${Date.now()}`,
      queue_number: ctx.queueNumber || ctx.queue_number || 'ER-NEW',
      hn: ctx.randomHn || ctx.hn || '-',
      name: ctx.patientName || ctx.name || 'ไม่ระบุชื่อ',
      age: ctx.patientAge !== undefined ? ctx.patientAge : (ctx.age !== undefined ? ctx.age : 'ไม่ได้ระบุ'),
      gender: ctx.gender || resolvedGender || 'ไม่ระบุ',
      chief_complaint: 'hypertension',
      chief_complaint_title: 'ตรวจพบความดันโลหิตสูง',
      timestamp: new Date().toISOString(),
      status: ctx.recordStatus || ctx.status || 'waiting',
      durationVal: !isNaN(durVal) && durVal > 0 ? durVal : null,
      durationUnit: durUnit,
      hospRecordStatus: ctx.hospRecordStatus || 'unspecified',
      underlying: Array.isArray(ctx.underlying) ? ctx.underlying : [],
      drugAllergy: ctx.drugAllergy || 'ไม่ได้ระบุ',
      currentMeds: ctx.currentMeds || 'ไม่ได้ระบุ',
      otherSymptomsFree,
      doctor_notes: ctx.preservedDoctorNotes || ctx.doctor_notes || { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },

      htnVisitReason: visitReason,
      htnVisitReasonDetail: visitReasonDetail,
      htnPeakSystolic: !isNaN(peakSys) ? peakSys : null,
      htnPeakDiastolic: !isNaN(peakDia) ? peakDia : null,
      htnPeakPulse: !isNaN(peakPulse) ? peakPulse : null,
      htnBpUnknownExact: bpUnknownExact,
      htnSource: source,
      htnKnownHx: knownHx,
      htnTodNone: todNone,
      htnNeuroSigns: neuroSigns,
      htnCardioSigns: cardioSigns,
      htnRenalSigns: renalSigns,
      htnPregnancyStatus: pregStatus,
      htnPregnancySigns: pregSigns,
      htnGeneralSigns: generalSigns,
      htnCompliance: compliance,
      htnMissedDays: !isNaN(missedDaysVal) ? missedDaysVal : null,
      htnTriggers: triggers,
      htnTriggerPainDetail: triggerPainDetail,
      htnTriggerDrinkDetail: triggerDrinkDetail,
      htnTriggerMedDetail: triggerMedDetail,
      htnTriggerSubstanceDetail: triggerSubstanceDetail
    };

    updateHypertensionOutputs(rec);
    return rec;
  },

  collectFormData: function(ctx = {}) {
    return this.collectIntake(ctx);
  },

  populateForm: function(data = {}) {
    if (!data) return;
    this.resetForm();

    if (data.durationVal) {
      const valEl = getHtnEl('htnDurationVal');
      if (valEl) valEl.value = data.durationVal;
    }
    const unitEl = getHtnEl('htnDurationUnit');
    if (unitEl) unitEl.value = data.durationUnit || 'hours';

    const setRadio = (name, val) => {
      if (!val) return;
      const el = queryHtnOne(`input[name="${name}"][value="${val}"]`);
      if (el) el.checked = true;
    };
    const setChecks = (name, arr) => {
      if (!Array.isArray(arr)) return;
      arr.forEach(val => {
        const el = queryHtnOne(`input[name="${name}"][value="${val}"]`);
        if (el) el.checked = true;
      });
    };

    setRadio('htnVisitReason', data.htnVisitReason);
    if (data.htnVisitReason) handleHtnVisitReasonChange(data.htnVisitReason);
    if (data.htnVisitReasonDetail) {
      const detailEl = getHtnEl('htnVisitReasonDetail');
      if (detailEl) detailEl.value = data.htnVisitReasonDetail;
    }

    if (data.htnPeakSystolic) { const sEl = getHtnEl('htnPeakSystolic'); if (sEl) sEl.value = data.htnPeakSystolic; }
    if (data.htnPeakDiastolic) { const dEl = getHtnEl('htnPeakDiastolic'); if (dEl) dEl.value = data.htnPeakDiastolic; }
    if (data.htnPeakPulse) { const pEl = getHtnEl('htnPeakPulse'); if (pEl) pEl.value = data.htnPeakPulse; }
    if (data.htnBpUnknownExact) { const unkEl = getHtnEl('htnBpUnknownExact'); if (unkEl) unkEl.checked = true; }

    setRadio('htnSource', data.htnSource);
    setRadio('htnKnownHx', data.htnKnownHx);

    const hasNeuro = Array.isArray(data.htnNeuroSigns) && data.htnNeuroSigns.length > 0;
    const hasCardio = Array.isArray(data.htnCardioSigns) && data.htnCardioSigns.length > 0;
    const hasRenal = Array.isArray(data.htnRenalSigns) && data.htnRenalSigns.length > 0;

    if (hasNeuro) {
      const pNeuro = getHtnEl('htnParentNeuro');
      if (pNeuro) pNeuro.checked = true;
      toggleHtnParentGroup('htnNeuroSubGroup', true);
      setChecks('htnNeuroSigns', data.htnNeuroSigns);
    }
    if (hasCardio) {
      const pCardio = getHtnEl('htnParentCardio');
      if (pCardio) pCardio.checked = true;
      toggleHtnParentGroup('htnCardioSubGroup', true);
      setChecks('htnCardioSigns', data.htnCardioSigns);
    }
    if (hasRenal) {
      const pRenal = getHtnEl('htnParentRenal');
      if (pRenal) pRenal.checked = true;
      toggleHtnParentGroup('htnRenalSubGroup', true);
      setChecks('htnRenalSigns', data.htnRenalSigns);
    }
    if (!hasNeuro && !hasCardio && !hasRenal && data.htnTodNone) {
      const todNone = getHtnEl('htn_tod_none');
      if (todNone) todNone.checked = true;
    }

    const isFemale = data.gender === 'หญิง' || data.gender === 'female' || data.gender === 'Female';
    const isMale = data.gender === 'ชาย' || data.gender === 'male' || data.gender === 'Male';
    if (isFemale) {
      syncHtnFemalePregnancySection(true);
      if (data.htnPregnancyStatus === 'none') {
        const pNone = getHtnEl('htn_preg_none');
        if (pNone) pNone.checked = true;
      } else {
        setRadio('htnPregnancyStatus', data.htnPregnancyStatus);
        if (data.htnPregnancyStatus) handleHtnPregnancyChange(data.htnPregnancyStatus);
        setChecks('htnPregnancySigns', data.htnPregnancySigns);
      }
    } else if (isMale) {
      syncHtnFemalePregnancySection(false);
    } else {
      syncHtnFemalePregnancySection();
    }

    setChecks('htnGeneralSigns', data.htnGeneralSigns);

    setRadio('htnCompliance', data.htnCompliance);
    if (data.htnCompliance) handleHtnComplianceChange(data.htnCompliance);
    if (data.htnMissedDays) {
      const mEl = getHtnEl('htnMissedDays');
      if (mEl) mEl.value = data.htnMissedDays;
    }

    setChecks('htnTriggers', data.htnTriggers);
    const trigArr = Array.isArray(data.htnTriggers) ? data.htnTriggers : [];
    const hydrateTrigDetail = (val, contId, inpId, textVal) => {
      if (trigArr.includes(val)) {
        toggleHtnGroup(contId, true);
        const inp = getHtnEl(inpId);
        if (inp) inp.value = textVal || '';
      }
    };
    hydrateTrigDetail('severe_pain_other', 'htnTriggerPainDetailContainer', 'htnTriggerPainDetail', data.htnTriggerPainDetail);
    hydrateTrigDetail('energy_drink_coffee_alc', 'htnTriggerDrinkDetailContainer', 'htnTriggerDrinkDetail', data.htnTriggerDrinkDetail);
    hydrateTrigDetail('nsaids_cold_steroid', 'htnTriggerMedDetailContainer', 'htnTriggerMedDetail', data.htnTriggerMedDetail);
    hydrateTrigDetail('substance_stimulants', 'htnTriggerSubstanceDetailContainer', 'htnTriggerSubstanceDetail', data.htnTriggerSubstanceDetail);
    const otherFreeEl = getHtnEl('hypertension_other_free');
    if (otherFreeEl) otherFreeEl.value = data.otherSymptomsFree || '';
  },

  hydrateForm: function(data = {}) {
    this.populateForm(data);
  },

  resetForm: function() {
    this.inputIdsToClear.forEach(id => {
      const el = getHtnEl(id);
      if (el) el.value = '';
    });

    const durUnit = getHtnEl('htnDurationUnit');
    if (durUnit) durUnit.value = 'hours';

    ['htnParentNeuro', 'htnParentCardio', 'htnParentRenal', 'htnBpUnknownExact', 'htn_tod_none', 'htn_general_none', 'htn_preg_none', 'htn_triggers_none'].forEach(id => {
      const el = getHtnEl(id);
      if (el) el.checked = false;
    });

    this.branchIds.forEach(id => {
      const el = getHtnEl(id);
      if (el) el.classList.add('hidden');
    });

    [
      'htnVisitReason', 'htnSource', 'htnKnownHx', 'htnPregnancyStatus', 'htnCompliance'
    ].forEach(n => {
      queryHtnAll(`input[name="${n}"]`).forEach(r => { r.checked = false; });
    });

    [
      'htnNeuroSigns', 'htnCardioSigns', 'htnRenalSigns', 'htnPregnancySigns', 'htnGeneralSigns', 'htnTriggers'
    ].forEach(n => {
      queryHtnAll(`input[name="${n}"]`).forEach(c => { c.checked = false; });
    });

    queryHtnAll('#cc-hypertension-section input[type="radio"]').forEach(r => { r.checked = false; });
    queryHtnAll('#cc-hypertension-section input[type="checkbox"]').forEach(c => { c.checked = false; });

    syncHtnFemalePregnancySection();
  },

  clearForm: function() {
    this.resetForm();
  },

  isRedFlag: function(patient) {
    return evaluateHypertensionRedFlags(patient).length > 0;
  },

  evaluateRedFlags: evaluateHypertensionRedFlags,
  updateOutputs: updateHypertensionOutputs,
  renderRapidHpi: renderHypertensionRapidHpi,
  renderNarrative: renderHypertensionNarrative,
  renderDoctorHpi: renderHypertensionDoctorHpi,

  // --- Seed Patients Registry (4 Cases Preserved, C-AP11 Allergy Concise & C-AP13 Male Cleanup) ---
  seedPatients: [
    {
      id: 'case-htn-01',
      queue_number: 'E1-101',
      hn: '7890301',
      name: 'นายมนัส แน่นอกร้าวหลัง',
      age: 58,
      gender: 'ชาย',
      chief_complaint: 'hypertension',
      chief_complaint_title: 'ตรวจพบความดันโลหิตสูง',
      timestamp: '2026-11-03T18:00:00.000Z',
      status: 'waiting',
      durationVal: 2,
      durationUnit: 'hours',
      hospRecordStatus: 'complete',
      underlying: ['ความดันสูง (HT)'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Amlodipine 10 mg 1 tab po od',
      otherSymptomsFree: 'เจ็บแน่นหน้าอกรุนแรงเหมือนอะไรฉีกขาดในอก ร้าวทะลุไปหลัง เหงื่อแตกท่วมตัว วัดความดันที่บ้านได้ 210/120',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.6, sbp: 210, dbp: 120, bp: '210/120', pr: 96, rr: 22, spo2: 98 },
      esi_level: 1,

      htnVisitReason: 'high_bp_detected',
      htnVisitReasonDetail: '',
      htnPeakSystolic: 210,
      htnPeakDiastolic: 120,
      htnPeakPulse: 96,
      htnBpUnknownExact: false,
      htnSource: 'home_digital',
      htnKnownHx: 'known_htn',
      htnTodNone: false,
      htnNeuroSigns: [],
      htnCardioSigns: ['tearing_chest_back_pain'],
      htnRenalSigns: [],
      htnPregnancyStatus: null,
      htnPregnancySigns: [],
      htnGeneralSigns: ['dizziness_cold_sweat'],
      htnCompliance: 'regular',
      htnMissedDays: null,
      htnTriggers: ['no_triggers']
    },
    {
      id: 'case-htn-02',
      queue_number: 'E1-102',
      hn: '7890302',
      name: 'นางสมร หอบเหนื่อยฟองชมพู',
      age: 67,
      gender: 'หญิง',
      chief_complaint: 'hypertension',
      chief_complaint_title: 'ตรวจพบความดันโลหิตสูง',
      timestamp: '2026-11-03T18:30:00.000Z',
      status: 'waiting',
      durationVal: 4,
      durationUnit: 'hours',
      hospRecordStatus: 'complete',
      underlying: ['ความดันสูง (HT)', 'หัวใจล้มเหลว (Heart Failure)'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Enalapril 20 mg 1 tab bid (ขาดยามา 2 สัปดาห์)',
      otherSymptomsFree: 'หายใจหอบเหนื่อยรุนแรง นอนราบไม่ได้ ไอมีฟองเสมหะสีชมพูจางๆ ขาดยาความดันมา 2 สัปดาห์',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.8, sbp: 200, dbp: 110, bp: '200/110', pr: 112, rr: 28, spo2: 88 },
      esi_level: 1,

      htnVisitReason: 'suspected_symptoms',
      htnVisitReasonDetail: 'หายใจไม่อิ่ม แน่นหน้าอก หอบเหนื่อย',
      htnPeakSystolic: 200,
      htnPeakDiastolic: 110,
      htnPeakPulse: 112,
      htnBpUnknownExact: false,
      htnSource: 'triage_hospital',
      htnKnownHx: 'known_htn',
      htnTodNone: false,
      htnNeuroSigns: [],
      htnCardioSigns: ['orthopnea_pulmonary_edema', 'pink_frothy_sputum'],
      htnRenalSigns: ['leg_edema_bilateral'],
      htnPregnancyStatus: 'none',
      htnPregnancySigns: [],
      htnGeneralSigns: ['no_general_signs'],
      htnCompliance: 'missed_days',
      htnMissedDays: 14,
      htnTriggers: ['no_triggers']
    },
    {
      id: 'case-htn-03',
      queue_number: 'E2-103',
      hn: '7890303',
      name: 'น.ส.พัชรา ตั้งครรภ์ความดันสูง',
      age: 29,
      gender: 'หญิง',
      chief_complaint: 'hypertension',
      chief_complaint_title: 'ตรวจพบความดันโลหิตสูง',
      timestamp: '2026-11-03T19:00:00.000Z',
      status: 'waiting',
      durationVal: 1,
      durationUnit: 'days',
      hospRecordStatus: 'complete',
      underlying: ['ปฏิเสธ'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'วิตามินบำรุงครรภ์ Obimin-AZ',
      otherSymptomsFree: 'ตั้งครรภ์ 34 สัปดาห์ ปวดศีรษะรุนแรง ตาพร่ามัวเห็นแสงวับวาบ จุกแน่นใต้ลิ้นปี่และชายโครงขวา ขาบวมสองข้าง',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.7, sbp: 175, dbp: 110, bp: '175/110', pr: 88, rr: 20, spo2: 99 },
      esi_level: 2,

      htnVisitReason: 'high_bp_detected',
      htnVisitReasonDetail: '',
      htnPeakSystolic: 175,
      htnPeakDiastolic: 110,
      htnPeakPulse: 88,
      htnBpUnknownExact: false,
      htnSource: 'health_center',
      htnKnownHx: 'first_time',
      htnTodNone: false,
      htnNeuroSigns: ['severe_headache_occipital', 'blurred_vision_scotoma'],
      htnCardioSigns: [],
      htnRenalSigns: ['leg_edema_bilateral'],
      htnPregnancyStatus: 'pregnancy_gt_20wks',
      htnPregnancySigns: ['ruq_epigastric_pain', 'flashing_lights_vision'],
      htnGeneralSigns: ['no_general_signs'],
      htnCompliance: 'no_prior_rx',
      htnMissedDays: null,
      htnTriggers: ['no_triggers']
    },
    {
      id: 'case-htn-04',
      queue_number: 'E3-104',
      hn: '7890304',
      name: 'นายสมชาย ความดันสูงวัดได้ที่คลินิก',
      age: 52,
      gender: 'ชาย',
      chief_complaint: 'hypertension',
      chief_complaint_title: 'ตรวจพบความดันโลหิตสูง',
      timestamp: '2026-11-03T19:30:00.000Z',
      status: 'waiting',
      durationVal: 3,
      durationUnit: 'days',
      hospRecordStatus: 'self',
      underlying: ['ความดันสูง (HT)'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Amlodipine 5 mg 1 tab po od',
      otherSymptomsFree: 'ไปตรวจตามนัดเบาหวานที่ รพ.สต. พบความดัน 185/105 ไม่มีอาการผิดปกติใดๆ ไม่เจ็บอก ไม่เหนื่อย แขนขาไม่อ่อนแรง ลืมกินยา 3 วัน',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.5, sbp: 185, dbp: 105, bp: '185/105', pr: 78, rr: 16, spo2: 100 },
      esi_level: 3,

      htnVisitReason: 'other_appointment',
      htnVisitReasonDetail: 'มาเจาะเลือดตรวจเบาหวานตามนัด',
      htnPeakSystolic: 185,
      htnPeakDiastolic: 105,
      htnPeakPulse: 78,
      htnBpUnknownExact: false,
      htnSource: 'health_center',
      htnKnownHx: 'known_htn',
      htnTodNone: true,
      htnNeuroSigns: [],
      htnCardioSigns: [],
      htnRenalSigns: [],
      htnPregnancyStatus: null,
      htnPregnancySigns: [],
      htnGeneralSigns: ['no_general_signs'],
      htnCompliance: 'missed_days',
      htnMissedDays: 3,
      htnTriggers: ['stress_insomnia']
    }
  ]
};

// Register module in Ratchaburi ER Core Registry
if (typeof registerCcModule === 'function') {
  registerCcModule(hypertensionModule);
} else if (typeof window !== 'undefined' && typeof window.registerCcModule === 'function') {
  window.registerCcModule(hypertensionModule);
}

// Export inline event handlers to window scope
if (typeof window !== 'undefined') {
  window.toggleHtnGroup = toggleHtnGroup;
  window.toggleHtnParentGroup = toggleHtnParentGroup;
  window.handleHtnTodNoneToggle = handleHtnTodNoneToggle;
  window.handleHtnGeneralNoneToggle = handleHtnGeneralNoneToggle;
  window.handleHtnGeneralItemChange = handleHtnGeneralItemChange;
  window.handleHtnTriggersNoneToggle = handleHtnTriggersNoneToggle;
  window.handleHtnTriggerItemChange = handleHtnTriggerItemChange;
  window.handleHtnVisitReasonChange = handleHtnVisitReasonChange;
  window.handleHtnPregNoneToggle = handleHtnPregNoneToggle;
  window.handleHtnPregnancyChange = handleHtnPregnancyChange;
  window.handleHtnComplianceChange = handleHtnComplianceChange;
  window.handleHtnUnknownBpChange = handleHtnUnknownBpChange;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = hypertensionModule;
}
