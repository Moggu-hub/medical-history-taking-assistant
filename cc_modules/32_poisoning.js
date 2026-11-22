// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 32_poisoning.js
// อาการนำ: ได้รับสารพิษ / กินยาเกินขนาด (Poisoning / Drug Overdose — Golden 4-Card UX)
// ปรับปรุงตาม SKILL_PLAN_CC (P-AP1–P-AP14) และ SKILL_CODE_CC (C-AP1–C-AP20)
// รองรับ Dynamic Exposure Timeline Repeater, Substance & Amount Repeater และ Route-Aware Filtering
// =========================================================================

let poisoningPainScoreTouched = false;
let poisoningTimeRowCount = 1;
let poisoningSubstanceRowCount = 1;

function wrapPoisWords(...chunks) {
  return chunks.map(c => `<span class="inline-block whitespace-nowrap">${c}</span>`).join(' ');
}

function renderPoisCard(cfg) {
  const {
    kind = 'radio', id = '', name = '', value = '', title,
    desc = '', onchange = '', compact = false, bgWhite = false
  } = cfg;
  const idAttr = id ? `id="${id}" ` : '';
  const nameAttr = name ? `name="${name}" ` : '';
  const valAttr = value ? `value="${value}" ` : '';
  const chgAttr = onchange ? `onchange="${onchange}" ` : '';
  const alignCls = desc ? 'items-start' : 'items-center';
  const padCls = compact ? 'p-2.5' : 'p-3';
  const bgCls = bgWhite ? 'bg-white ' : '';
  const roundCls = kind === 'checkbox' ? 'rounded ' : '';
  const topCls = desc ? 'mt-0.5 ' : '';
  const mlCls = compact ? 'ml-2' : 'ml-3';
  const szCls = compact ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const titleCls = compact ? 'text-xs' : 'text-xs sm:text-sm';
  const bodyHtml = desc
    ? `<div class="${mlCls} leading-snug"><span class="block ${titleCls} font-semibold text-slate-800">${title}</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">${desc}</span></div>`
    : `<span class="${mlCls} ${titleCls} font-semibold text-slate-800 leading-snug">${title}</span>`;
  return `<label class="selectable-card ${bgCls}flex ${alignCls} ${padCls} rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition"><input type="${kind}" ${idAttr}${nameAttr}${valAttr}${chgAttr}class="${topCls}${roundCls}text-medical-600 focus:ring-medical-500 ${szCls} flex-shrink-0">${bodyHtml}</label>`;
}

function renderPoisGrid(colsCls, items, shared = {}) {
  return `<div class="grid ${colsCls} gap-2.5">${items.map(it => renderPoisCard({ ...shared, ...it })).join('\n')}</div>`;
}

function renderPoisSysHeader({ icon, iconBg, iconColor, title, noneId, noneLabel = 'ไม่มีอาการในหมวดนี้', noneOnchange }) {
  return `<div class="flex flex-wrap items-center justify-between gap-2 mb-2.5">
    <div class="flex items-center space-x-2">
      <span class="inline-flex items-center justify-center w-6 h-6 rounded-lg ${iconBg} ${iconColor} flex-shrink-0"><i data-lucide="${icon}" class="w-3.5 h-3.5"></i></span>
      <span class="text-xs font-bold text-slate-700">${title}</span>
    </div>
    <label class="inline-flex items-center px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:border-medical-300 cursor-pointer transition">
      <input type="checkbox" id="${noneId}" onchange="${noneOnchange}" class="rounded text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 flex-shrink-0">
      <span class="ml-2 text-xs font-semibold text-slate-800 whitespace-nowrap">${noneLabel}</span>
    </label>
  </div>`;
}

// --- Dynamic Exposure Timeline & Substance Repeaters ---
function addPoisoningTimeRow(initialDate = '', initialTime = '') {
  const container = document.getElementById('poisoningTimeRowsContainer');
  if (!container) return;
  const rowIndex = poisoningTimeRowCount++;
  const rowDiv = document.createElement('div');
  rowDiv.id = `poisoningTimeRow_${rowIndex}`;
  rowDiv.className = 'grid grid-cols-1 sm:grid-cols-12 gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl items-center relative';
  rowDiv.innerHTML = `
    <div class="sm:col-span-3 text-xs font-semibold text-slate-700 flex items-center space-x-1.5">
      <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-medical-100 text-medical-800 text-[11px] font-bold">${rowIndex + 1}</span>
      <span>ครั้งที่ ${rowIndex + 1}:</span>
    </div>
    <div class="sm:col-span-4">
      <input type="text" data-universal-date="true" id="poisoningDate_${rowIndex}" value="${initialDate}" placeholder="วว/ดด/ปปปป (dd/mm/yyyy)"
        class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500">
    </div>
    <div class="sm:col-span-4">
      <input type="text" data-universal-time="true" id="poisoningTime_${rowIndex}" value="${initialTime}" placeholder="เช่น 14:30 (24 ชม.)"
        class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500">
    </div>
    <div class="sm:col-span-1 flex justify-end">
      <button type="button" onclick="removePoisoningTimeRow('${rowDiv.id}')" class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition" title="ลบช่วงเวลานี้">
        <i data-lucide="trash-2" class="w-4 h-4"></i>
      </button>
    </div>`;
  container.appendChild(rowDiv);
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons({ root: rowDiv });
  if (typeof initUniversalDateTimeInputs === 'function') initUniversalDateTimeInputs();
}

function removePoisoningTimeRow(rowElementId) {
  const row = document.getElementById(rowElementId);
  if (row) row.remove();
}

function handlePoisoningTimeUnknownChange() {
  const cb = document.getElementById('poisoningTimeUnknown');
  const detailsWrap = document.getElementById('poisoningTimeDetailsWrap');
  if (cb && detailsWrap) detailsWrap.classList.toggle('hidden', cb.checked);
}

function addPoisoningSubstanceRow(initialSubstance = '', initialAmount = '') {
  const container = document.getElementById('poisoningSubstanceRowsContainer');
  if (!container) return;
  const rowIndex = poisoningSubstanceRowCount++;
  const rowDiv = document.createElement('div');
  rowDiv.id = `poisoningSubstanceRow_${rowIndex}`;
  rowDiv.className = 'grid grid-cols-1 sm:grid-cols-12 gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl items-center relative';
  rowDiv.innerHTML = `
    <div class="sm:col-span-1 text-xs font-semibold text-slate-700 flex items-center justify-center">
      <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-medical-100 text-medical-800 text-[11px] font-bold">${rowIndex + 1}</span>
    </div>
    <div class="sm:col-span-6">
      <label class="block text-[11px] font-semibold text-slate-600 mb-1">ชื่อยา หรือชนิดของสารพิษ:</label>
      <input type="text" id="poisoningSubstanceName_${rowIndex}" value="${initialSubstance}" placeholder="เช่น พาราเซตามอล, ยานอนหลับ, น้ำยาล้างห้องน้ำ..."
        class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500">
    </div>
    <div class="sm:col-span-4">
      <label class="block text-[11px] font-semibold text-slate-600 mb-1">ปริมาณ หรือจำนวนที่ได้รับ:</label>
      <input type="text" id="poisoningSubstanceAmount_${rowIndex}" value="${initialAmount}" placeholder="เช่น 20 เม็ด, 2 แผง, ครึ่งแก้ว..."
        class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500">
    </div>
    <div class="sm:col-span-1 flex justify-end self-end mb-1">
      <button type="button" onclick="removePoisoningSubstanceRow('${rowDiv.id}')" class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition" title="ลบรายการนี้">
        <i data-lucide="trash-2" class="w-4 h-4"></i>
      </button>
    </div>`;
  container.appendChild(rowDiv);
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons({ root: rowDiv });
  if (typeof initUniversalDateTimeInputs === 'function') initUniversalDateTimeInputs();
}

function removePoisoningSubstanceRow(rowElementId) {
  const row = document.getElementById(rowElementId);
  if (row) row.remove();
}

// --- Route-Aware & Mutual-Exclusion Handlers ---
function updatePoisoningRouteSymptoms() {
  const isIngestion = Boolean(document.getElementById('poisoningRoute_ingestion')?.checked);
  const isInhalation = Boolean(document.getElementById('poisoningRoute_inhalation')?.checked);
  const isSkin = Boolean(document.getElementById('poisoningRoute_skin_contact')?.checked);
  const isEye = Boolean(document.getElementById('poisoningRoute_eye_contact')?.checked);
  const isInjection = Boolean(document.getElementById('poisoningRoute_injection')?.checked);

  const toggle = (id, show) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden', !show);
  };
  toggle('poisoningRouteSymptoms_ingestion', isIngestion);
  toggle('poisoningRouteSymptoms_throat', isIngestion || isInhalation);
  toggle('poisoningRouteSymptoms_inhalation', isInhalation);
  toggle('poisoningRouteSymptoms_skin', isSkin);
  toggle('poisoningRouteSymptoms_eye', isEye);
  toggle('poisoningRouteSymptoms_injection', isInjection);

  const isOnlyEyeContact = isEye && !isIngestion && !isInhalation && !isSkin && !isInjection;
  toggle('poisoningSystemicSymptomsWrap', !isOnlyEyeContact);
}

function handlePoisFirstAidNoneChange() {
  if (!document.getElementById('poisoningFirstAid_none')?.checked) return;
  ['vomited', 'induced', 'washed'].forEach(k => {
    const el = document.getElementById(`poisoningFirstAid_${k}`);
    if (el) el.checked = false;
  });
}

function handlePoisFirstAidItemChange(el) {
  if (el && el.checked) {
    const noneEl = document.getElementById('poisoningFirstAid_none');
    if (noneEl) noneEl.checked = false;
  }
}

const POIS_SYM_ACTIVE_KEYS = [
  'oral_burn', 'nausea_vomit_abdpain', 'hematemesis_melena', 'stridor_hoarseness', 'cough_soot',
  'skin_burn', 'eye_burn', 'injection_site', 'drowsy_unconscious', 'seizure', 'confusion_agitation',
  'dyspnea_abnormal_resp', 'salivation_secretions', 'diaphoresis', 'incontinence', 'dry_mouth_anhidrosis',
  'blurred_vision', 'numbness_weakness', 'palpitations_syncope', 'dark_urine_jaundice'
];

function handlePoisSymNoneChange() {
  if (!document.getElementById('poisoningSym_asymptomatic')?.checked) return;
  POIS_SYM_ACTIVE_KEYS.forEach(k => {
    const el = document.getElementById(`poisoningSym_${k}`);
    if (el) el.checked = false;
  });
}

function handlePoisSymItemChange(el) {
  if (el && el.checked) {
    const noneEl = document.getElementById('poisoningSym_asymptomatic');
    if (noneEl) noneEl.checked = false;
  }
}

function handlePoisoningIntentChange() {
  const checked = document.querySelector('input[name="poisoningIntent"]:checked');
  const branch = document.getElementById('poisoningSuicideRiskBranch');
  if (branch) branch.classList.toggle('hidden', !(checked && checked.value === 'intentional_self_harm'));
}

function handlePoisoningAlcoholChange() {
  const checked = document.querySelector('input[name="poisoningAlcoholUse"]:checked');
  const container = document.getElementById('poisoningAlcoholDetailWrap');
  if (container) container.classList.toggle('hidden', !(checked && checked.value === 'yes'));
}

function handlePoisoningPregnancyChange() {
  const checked = document.querySelector('input[name="poisoningPregnancyStatus"]:checked');
  const container = document.getElementById('poisoningPregnancyWeeksWrap');
  if (container) container.classList.toggle('hidden', !(checked && checked.value === 'pregnant'));
}

function isPoisoningPatientFemale(titleOrBool) {
  if (typeof titleOrBool === 'boolean') return titleOrBool;
  const titleVal = typeof titleOrBool === 'string' ? titleOrBool : (document.getElementById('patientTitleSelect')?.value || '');
  if (/นาง|น\.ส\.|ด\.ญ\.|Mrs|Ms|Miss|Female|หญิง/i.test(titleVal)) return true;
  if (/นาย|ด\.ช\.|\(Mr\.\)|Master|ชาย/i.test(titleVal)) return false;
  if (typeof titleOrBool === 'string') return false;
  const triageGender = document.getElementById('triageGenderSelect')?.value || '';
  return /หญิง|female/i.test(triageGender);
}

function syncPoisoningFemaleSection(overrideIsFemale) {
  const wrap = document.getElementById('poisoningFemaleSection');
  if (!wrap) return;
  const isFemale = isPoisoningPatientFemale(overrideIsFemale);
  wrap.classList.toggle('hidden', !isFemale);
  if (!isFemale) {
    const lmp = document.getElementById('poisoningLmpDate');
    if (lmp) lmp.value = '';
    document.querySelectorAll('input[name="poisoningPregnancyStatus"]').forEach(rb => { rb.checked = false; });
    const pregWeeks = document.getElementById('poisoningPregnancyWeeks');
    if (pregWeeks) pregWeeks.value = '';
    const pregWrap = document.getElementById('poisoningPregnancyWeeksWrap');
    if (pregWrap) pregWrap.classList.add('hidden');
  }
}

function handlePoisPainLocOtherChange() {
  const checked = Boolean(document.getElementById('poisoningPainLoc_other')?.checked);
  const wrap = document.getElementById('poisoningPainLocOtherWrap');
  if (wrap) wrap.classList.toggle('hidden', !checked);
  if (!checked) {
    const txt = document.getElementById('poisoningPainLocOtherText');
    if (txt) txt.value = '';
  }
}

function clearPoisoningPainScore() {
  poisoningPainScoreTouched = false;
  const slider = document.getElementById('poisoningPainScore');
  if (slider) slider.value = 0;
  const emojiEl = document.getElementById('poisoningPainScoreEmoji');
  const textEl = document.getElementById('poisoningPainScoreText');
  const badgeEl = document.getElementById('poisoningPainScoreBadge');
  const clearBtn = document.getElementById('poisoningPainScoreClearBtn');
  if (emojiEl) emojiEl.textContent = '⚪';
  if (textEl) textEl.textContent = 'ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)';
  if (badgeEl) badgeEl.className = 'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all';
  if (clearBtn) clearBtn.classList.add('hidden');
}

function handlePoisoningPainScoreChange(val) {
  poisoningPainScoreTouched = true;
  const num = parseInt(val, 10) || 0;
  const slider = document.getElementById('poisoningPainScore');
  if (slider && String(slider.value) !== String(num)) slider.value = num;
  const emojiEl = document.getElementById('poisoningPainScoreEmoji');
  const textEl = document.getElementById('poisoningPainScoreText');
  const badgeEl = document.getElementById('poisoningPainScoreBadge');
  const clearBtn = document.getElementById('poisoningPainScoreClearBtn');
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

function setPoisoningPainScore(score) {
  poisoningPainScoreTouched = true;
  const slider = document.getElementById('poisoningPainScore');
  if (slider) slider.value = score;
  handlePoisoningPainScoreChange(score);
}

const POIS_UNIT_MAP = {
  minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี'
};

function makePoisSeed(ov) {
  return {
    chief_complaint: 'poisoning', chief_complaint_title: 'ได้รับสารพิษ / กินยาเกินขนาด',
    status: 'waiting', hospRecordStatus: 'complete', drugAllergy: 'ปฏิเสธ',
    poisoningTimeUnknown: false, poisoningAlcoholUsed: 'no', poisoningAlcoholDetail: '',
    poisoningSuicideActiveRisk: '', poisoningPregnancyWeeks: '',
    doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
    ...ov
  };
}

registerCcModule({
  id: 'poisoning',
  recordCc: 'poisoning',
  titleTh: 'ได้รับสารพิษ / กินยาเกินขนาด',
  headerTh: 'แบบฟอร์มซักประวัติ: ได้รับสารพิษ / กินยาเกินขนาด',
  headerEn: '(Poisoning / Drug overdose)',
  doctorCcBadgeHtml: '<i data-lucide="skull" class="w-3.5 h-3.5 mr-1 text-purple-600"></i> CC: ได้รับสารพิษ / กินยาเกินขนาด (Poisoning / Overdose)',
  pmhSectionNumber: 5,
  getPmhSectionNumber: () => 5,
  sectionDomId: 'ccPoisoningSection',
  dateFields: ['poisoningLmpDate'],
  timeFields: ['poisoningNpoTime'],
  branchIds: ['poisoningFemaleSection', 'poisoningPregnancyWeeksWrap', 'poisoningAlcoholDetailWrap', 'poisoningSuicideRiskBranch'],

  onSelectForm: function ({ editingPatientId } = {}) {
    syncPoisoningFemaleSection();
    if (!editingPatientId) {
      clearPoisoningPainScore();
      updatePoisoningRouteSymptoms();
    }
  },
  onActivate: function (patient) {
    const g = patient?.gender;
    syncPoisoningFemaleSection(g === 'หญิง' ? true : (g === 'ชาย' ? false : undefined));
  },
  onTitleChange: function ({ title, isFemale } = {}) {
    const effective = (typeof title === 'string' && /น\.ส\./.test(title)) ? true : isFemale;
    syncPoisoningFemaleSection(effective);
  },
  resetForm: function () {
    this.clearForm();
  },

  algorithm: {
    triageLevelRules: [
      { level: 1, criteria: 'Coma, Seizure, Upper airway edema, Severe respiratory distress, Severe caustic burn with shock, Cholinergic crisis' },
      { level: 2, criteria: 'High lethal potential (Staggered paracetamol, Cardiotoxic, Sedative overdose, Active suicidal intent, Caustic ingestion)' },
      { level: 3, criteria: 'Moderate exposure, Ocular chemical burn after irrigation, Mild systemic symptoms, Stable vital signs' },
      { level: 4, criteria: 'Minor exposure, Asymptomatic with non-toxic dose or low-risk substances' }
    ]
  },

  seedPatients: [
    makePoisSeed({
      id: 'case-poison-01', queue_number: 'E1-131', hn: '7890401', name: 'นายสมศักดิ์ พ่นยาฆ่าแมลง', age: 52, gender: 'ชาย',
      timestamp: '2026-11-12T16:00:00.000Z', durationVal: 2, durationUnit: 'hours',
      underlying: ['เบาหวาน (DM)'], currentMeds: 'Metformin 500 mg 1 tab po bid',
      otherSymptomsFree: 'ฉีดพ่นยาฆ่าแมลงในสวนแล้วมีน้ำลายฟูมปาก เหงื่อแตกท่วมตัว เสมหะมาก หายใจเหนื่อย ปัสสาวะราด',
      vital_signs: { bt: 36.5, sbp: 90, dbp: 55, bp: '90/55', pr: 48, rr: 28, spo2: 89 }, esi_level: 1,
      poisoningInformant: 'relative_bystander', poisoningTimeline: [{ date: '12/11/2026', time: '14:00' }],
      poisoningRoutes: ['inhalation', 'skin_contact'],
      poisoningSubstances: [{ name: 'ยาฆ่าแมลงกลุ่มออร์กาโนฟอสเฟต (ขวดสีเขียว)', amount: 'ฉีดพ่น 2 ถัง หกเปื้อนผิวหนัง' }],
      poisoningCategories: ['pesticides'], poisoningFirstAid: ['washed'], poisoningContainerStatus: 'photo_only',
      poisoningSymptoms: ['dyspnea_abnormal_resp', 'salivation_secretions', 'diaphoresis', 'incontinence'],
      poisoningPainLocations: [], poisoningPainLocOtherText: '',
      poisoningPainScoreVal: null, poisoningWeightKg: 65, poisoningIntent: 'occupational_environmental',
      poisoningNpoTime: '12:00', poisoningNpoLastMeal: 'ก๋วยเตี๋ยวเมื่อเที่ยง'
    }),
    makePoisSeed({
      id: 'case-poison-02', queue_number: 'E1-132', hn: '7890402', name: 'นางกานดา ดื่มน้ำยาล้างห้องน้ำ', age: 46, gender: 'หญิง',
      timestamp: '2026-11-12T16:30:00.000Z', durationVal: 1, durationUnit: 'hours',
      underlying: ['โรคซึมเศร้า (Major Depression)'], currentMeds: 'Sertraline 50 mg 1 tab po od',
      otherSymptomsFree: 'ดื่มน้ำยาล้างห้องน้ำกรดเข้มข้น แสบไหม้ปากและลำคอรุนแรง กลืนน้ำลายไม่ได้ อาเจียนมีเลือดปน เสียงแหบ',
      vital_signs: { bt: 36.8, sbp: 130, dbp: 80, bp: '130/80', pr: 110, rr: 24, spo2: 95 }, esi_level: 1,
      poisoningInformant: 'relative_bystander', poisoningTimeline: [{ date: '12/11/2026', time: '15:30' }],
      poisoningRoutes: ['ingestion'],
      poisoningSubstances: [{ name: 'น้ำยาล้างห้องน้ำกรดเข้มข้น', amount: 'ประมาณ 1 แก้วน้ำ (200 มล.)' }],
      poisoningCategories: ['corrosives'], poisoningFirstAid: ['vomited'], poisoningContainerStatus: 'brought_container',
      poisoningSymptoms: ['oral_burn', 'stridor_hoarseness', 'hematemesis_melena', 'nausea_vomit_abdpain'],
      poisoningPainLocations: ['oral_throat', 'chest', 'abdomen'], poisoningPainLocOtherText: '',
      poisoningPainScoreVal: 9, poisoningWeightKg: 55, poisoningIntent: 'intentional_self_harm',
      poisoningSuicideActiveRisk: 'active_ideation', poisoningLmpDate: '28/10/2026',
      poisoningPregnancyStatus: 'not_pregnant', poisoningNpoTime: '15:30', poisoningNpoLastMeal: 'น้ำยาล้างห้องน้ำ'
    }),
    makePoisSeed({
      id: 'case-poison-03', queue_number: 'E2-133', hn: '7890403', name: 'น.ส.พิมพ์ใจ ทานพาราซ้ำสองรอบ', age: 24, gender: 'หญิง',
      timestamp: '2026-11-12T17:00:00.000Z', durationVal: 6, durationUnit: 'hours',
      underlying: ['ปฏิเสธ'], currentMeds: 'ไม่มี',
      otherSymptomsFree: 'กินยาพาราเซตามอลรอบแรก 20 เม็ดตอนเที่ยง และกินซ้ำอีก 20 เม็ดตอนบ่ายสาม รวม 40 เม็ด คลื่นไส้ ปัสสาวะสีเข้ม',
      vital_signs: { bt: 36.7, sbp: 115, dbp: 70, bp: '115/70', pr: 88, rr: 18, spo2: 99 }, esi_level: 2,
      poisoningInformant: 'patient',
      poisoningTimeline: [{ date: '12/11/2026', time: '12:00' }, { date: '12/11/2026', time: '15:00' }],
      poisoningRoutes: ['ingestion'],
      poisoningSubstances: [{ name: 'ยาพาราเซตามอล 500 มก.', amount: 'รวม 40 เม็ด (แบ่ง 2 รอบ)' }],
      poisoningCategories: ['paracetamol'], poisoningFirstAid: ['none'], poisoningContainerStatus: 'brought_container',
      poisoningSymptoms: ['nausea_vomit_abdpain', 'dark_urine_jaundice'],
      poisoningPainLocations: ['abdomen'], poisoningPainLocOtherText: '',
      poisoningPainScoreVal: 4, poisoningWeightKg: 48, poisoningIntent: 'intentional_self_harm',
      poisoningSuicideActiveRisk: 'uncertain_confused', poisoningAlcoholUsed: 'yes', poisoningAlcoholDetail: 'เบียร์ 1 กระป๋อง',
      poisoningLmpDate: '01/11/2026', poisoningPregnancyStatus: 'not_pregnant', poisoningNpoTime: '11:30', poisoningNpoLastMeal: 'ข้าวไข่เจียว'
    }),
    makePoisSeed({
      id: 'case-poison-04', queue_number: 'E4-134', hn: '7890404', name: 'ด.ช.ธนกร เผลอหยิบวิตามินซีทาน', age: 6, gender: 'ชาย',
      timestamp: '2026-11-12T17:30:00.000Z', durationVal: 45, durationUnit: 'minutes',
      underlying: ['ภูมิแพ้'], currentMeds: 'Cetirizine syrup',
      otherSymptomsFree: 'เด็กเผลอหยิบวิตามินซีชนิดเคี้ยวรับประทาน 4 เม็ด ขณะนี้รู้สึกตัวดี วิ่งเล่นได้ ไม่มีอาการผิดปกติ',
      vital_signs: { bt: 36.6, sbp: 100, dbp: 60, bp: '100/60', pr: 92, rr: 20, spo2: 100 }, esi_level: 4,
      poisoningInformant: 'relative_bystander', poisoningTimeline: [{ date: '12/11/2026', time: '16:45' }],
      poisoningRoutes: ['ingestion'],
      poisoningSubstances: [{ name: 'วิตามินซีชนิดเคี้ยว 100 mg', amount: '4 เม็ด' }],
      poisoningCategories: ['other_meds'], poisoningFirstAid: ['none'], poisoningContainerStatus: 'brought_container',
      poisoningSymptoms: ['asymptomatic'], poisoningPainLocations: [], poisoningPainLocOtherText: '', poisoningPainScoreVal: null, poisoningWeightKg: 20,
      poisoningIntent: 'accident', poisoningNpoTime: '15:00', poisoningNpoLastMeal: 'นมกล่องรสจืด'
    })
  ],

  formHtml: `
    <div id="ccPoisoningSection" class="space-y-6">
      <div data-cc-top-banner="poisoning">
        <div class="bg-teal-50 border border-teal-200 rounded-2xl p-4 sm:p-5 text-teal-900 shadow-2xs space-y-2">
          <div class="flex items-center space-x-2 text-teal-800 font-bold text-sm">
            <i data-lucide="info" class="w-5 h-5 text-teal-600 flex-shrink-0"></i>
            <span>ข้อแนะนำการดูแลตนเองเบื้องต้นระหว่างรอพบแพทย์</span>
          </div>
          <ul class="text-xs text-teal-800 space-y-1.5 pl-6 list-disc">
            <li><strong>ห้ามล้วงคอให้อาเจียน และห้ามดื่มน้ำหรือนมตาม:</strong> เพื่อป้องกันสารเคมีไหลย้อนทำลายหลอดอาหารและสำลักเข้าปอด</li>
            <li><strong>เตรียมซองยา ขวดสารเคมี หรือภาพถ่ายฉลาก:</strong> ส่งมอบให้พยาบาลคัดกรองทันที เพื่อช่วยระบุชนิดสารและเตรียมยาต้านพิษ</li>
            <li><strong>สารเคมีเข้าตาหรือสัมผัสผิวหนัง:</strong> แจ้งพยาบาลทันทีเพื่อล้างตาหรือล้างผิวหนังด้วยน้ำสะอาดอย่างต่อเนื่อง</li>
            <li><strong>อาการที่ต้องรีบแจ้งพยาบาลทันที:</strong> ง่วงซึมลง หายใจลำบาก กลืนน้ำลายไม่ได้ เสียงแหบ น้ำลายฟูมปาก ชักเกร็ง ตามัว หรือหน้ามืดจะเป็นลม</li>
          </ul>
        </div>
      </div>

      <!-- CARD 1: ช่วงเวลา ช่องทาง และรายการยา/สารพิษ -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
        <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="clock" class="h-5 w-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">1. ช่วงเวลา ช่องทาง และรายการยาหรือสารพิษ</h2>
            <p class="text-xs text-slate-500">ระบุเวลาที่ได้รับสาร ช่องทาง และชื่อยาหรือสารเคมีที่ได้รับ</p>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-2">1.1 ผู้ให้ข้อมูลในแบบสอบถามนี้:</label>
          ${renderPoisGrid('grid-cols-1 sm:grid-cols-2', [
            { value: 'patient', title: wrapPoisWords('ผู้ป่วยให้ข้อมูลเอง') },
            { value: 'relative_bystander', title: wrapPoisWords('ญาติ /', 'ผู้อยู่ในเหตุการณ์') }
          ], { kind: 'radio', name: 'poisoningInformant' })}
        </div>

        <div class="space-y-3 pt-2 border-t border-slate-100">
          <label class="block text-xs font-bold text-slate-700">1.2 ช่วงเวลาที่ได้รับสารพิษหรือกินยา:</label>
          <div class="flex flex-wrap items-center gap-3">
            <div class="flex items-center space-x-2">
              <input type="number" id="poisoningDurationVal" min="1" max="1000" placeholder="เช่น 30"
                class="w-24 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 text-center font-bold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white">
              <select id="poisoningDurationUnit" class="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white">
                <option value="minutes" selected>นาที</option>
                <option value="hours">ชั่วโมง</option>
                <option value="days">วัน</option>
                <option value="weeks">สัปดาห์</option>
                <option value="months">เดือน</option>
                <option value="years">ปี</option>
              </select>
            </div>
            <label class="selectable-card inline-flex items-center px-3 py-2 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="poisoningTimeUnknown" onchange="handlePoisoningTimeUnknownChange()" class="rounded text-medical-600 focus:ring-medical-500 h-4 w-4 flex-shrink-0">
              <span class="ml-3 text-xs font-semibold text-slate-800 whitespace-nowrap">ไม่ทราบช่วงเวลาแน่ชัด</span>
            </label>
          </div>

          <div id="poisoningTimeDetailsWrap" class="space-y-2.5">
            <div id="poisoningTimeRowsContainer" class="space-y-2.5">
              <div id="poisoningTimeRow_0" class="grid grid-cols-1 sm:grid-cols-12 gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl items-center">
                <div class="sm:col-span-3 text-xs font-semibold text-slate-700 flex items-center space-x-1.5">
                  <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-medical-100 text-medical-800 text-[11px] font-bold">1</span>
                  <span>ครั้งที่ 1:</span>
                </div>
                <div class="sm:col-span-4">
                  <input type="text" data-universal-date="true" id="poisoningDate_0" placeholder="วว/ดด/ปปปป (dd/mm/yyyy)"
                    class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500">
                </div>
                <div class="sm:col-span-5">
                  <input type="text" data-universal-time="true" id="poisoningTime_0" placeholder="เช่น 14:30 (24 ชม.)"
                    class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500">
                </div>
              </div>
            </div>
            <div class="pt-1">
              <p class="text-[11px] text-slate-500 mb-1.5">กรณีทานยาหรือสัมผัสสารซ้ำหลายครั้งในต่างเวลากัน กดปุ่มเพื่อเพิ่มช่วงเวลาได้</p>
              <button type="button" id="poisoningAddTimeBtn" onclick="addPoisoningTimeRow()"
                class="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-medical-50 hover:text-medical-700 text-slate-700 border border-slate-300 hover:border-medical-300 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5">
                <i data-lucide="plus" class="w-4 h-4 text-medical-600"></i>
                <span>เพิ่มช่วงเวลาที่ได้รับสาร (กรณีได้รับซ้ำหลายครั้ง)</span>
              </button>
            </div>
          </div>
        </div>

        <div class="space-y-2 pt-2 border-t border-slate-100">
          <label class="block text-xs font-bold text-slate-700">1.3 ช่องทางที่ได้รับสารพิษเข้าสู่ร่างกาย (เลือกได้หลายข้อ):</label>
          ${renderPoisGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', [
            { id: 'poisoningRoute_ingestion', title: wrapPoisWords('กิน /', 'กลืนลงคอ'), desc: 'ยาเม็ด ยาน้ำ สารเคมี หรือพืช/อาหาร' },
            { id: 'poisoningRoute_inhalation', title: wrapPoisWords('สูดดมควัน /', 'ก๊าซ /', 'ไอระเหย') },
            { id: 'poisoningRoute_skin_contact', title: wrapPoisWords('สัมผัสถูกผิวหนัง'), desc: 'หกรดตัว หรือเปื้อนเสื้อผ้า' },
            { id: 'poisoningRoute_eye_contact', title: wrapPoisWords('กระเด็นเข้าตา') },
            { id: 'poisoningRoute_injection', title: wrapPoisWords('ฉีดเข้าสู่ร่างกาย') }
          ], { kind: 'checkbox', onchange: 'updatePoisoningRouteSymptoms()' })}
        </div>

        <div class="space-y-2.5 pt-2 border-t border-slate-100">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">1.4 รายการชื่อยา หรือชนิดของสารพิษ และปริมาณที่ได้รับ:</label>
            <p class="text-xs text-slate-500">หากไม่ทราบชื่อสามารถระบุสี ลักษณะเม็ดยา หรือขวดได้ กดปุ่ม + หากได้รับมากกว่า 1 ชนิด</p>
          </div>
          <div id="poisoningSubstanceRowsContainer" class="space-y-2.5">
            <div id="poisoningSubstanceRow_0" class="grid grid-cols-1 sm:grid-cols-12 gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl items-center">
              <div class="sm:col-span-1 text-xs font-semibold text-slate-700 flex items-center justify-center">
                <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-medical-100 text-medical-800 text-[11px] font-bold">1</span>
              </div>
              <div class="sm:col-span-6">
                <label class="block text-[11px] font-semibold text-slate-600 mb-1">ชื่อยา หรือชนิดของสารพิษ:</label>
                <input type="text" id="poisoningSubstanceName_0" placeholder="เช่น พาราเซตามอล 500 mg, ยานอนหลับ, น้ำยาล้างห้องน้ำ..."
                  class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500">
              </div>
              <div class="sm:col-span-5">
                <label class="block text-[11px] font-semibold text-slate-600 mb-1">ปริมาณ หรือจำนวนที่ได้รับ:</label>
                <input type="text" id="poisoningSubstanceAmount_0" placeholder="เช่น 20 เม็ด, 2 แผง, ประมาณ 2 อึก..."
                  class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500">
              </div>
            </div>
          </div>
          <button type="button" id="poisoningAddSubstanceBtn" onclick="addPoisoningSubstanceRow()"
            class="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-medical-50 hover:text-medical-700 text-slate-700 border border-slate-300 hover:border-medical-300 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5">
            <i data-lucide="plus" class="w-4 h-4 text-medical-600"></i>
            <span>เพิ่มชื่อยา หรือชนิดของสารพิษ และปริมาณ</span>
          </button>
        </div>
      </div>

      <!-- CARD 2: หมวดหมู่สารพิษ การปฐมพยาบาล และตัวอย่างฉลาก -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
        <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="flask-conical" class="h-5 w-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">2. หมวดหมู่ของยาหรือสารพิษ การปฐมพยาบาล และตัวอย่างฉลาก</h2>
            <p class="text-xs text-slate-500">ช่วยแพทย์ระบุกลุ่มสารพิษและเตรียมยาต้านพิษจำเพาะได้รวดเร็ว</p>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-2">2.1 ยาหรือสารพิษอยู่ในกลุ่มใด (เลือกได้หลายข้อ):</label>
          ${renderPoisGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-4', [
            { id: 'poisoningCat_paracetamol', title: wrapPoisWords('ยาพาราเซตามอล'), desc: 'เช่น Tylenol, Sara, ยาคลายกล้ามเนื้อผสม' },
            { id: 'poisoningCat_sedative_psych', title: wrapPoisWords('ยานอนหลับ /', 'ยาคลายเครียด /', 'ยาจิตเวช') },
            { id: 'poisoningCat_cardio_diabetic', title: wrapPoisWords('ยาความดัน /', 'โรคหัวใจ /', 'เบาหวาน') },
            { id: 'poisoningCat_nsaids_anticoag', title: wrapPoisWords('ยาแก้ปวด NSAIDs /', 'ละลายลิ่มเลือด'), desc: 'เช่น Ponstan, Arcoxia, Aspirin, Warfarin' },
            { id: 'poisoningCat_other_meds', title: wrapPoisWords('ยารักษาโรคอื่นๆ /', 'วิตามิน') },
            { id: 'poisoningCat_corrosives', title: wrapPoisWords('น้ำยาล้างห้องน้ำ /', 'สารกัดกร่อน'), desc: 'กรด-ด่าง, น้ำยาฟอกขาวไฮเตอร์, โซดาไฟ' },
            { id: 'poisoningCat_pesticides', title: wrapPoisWords('ยาฆ่าแมลง /', 'ยาฆ่าหญ้า /', 'ยาเบื่อหนู') },
            { id: 'poisoningCat_household_hydrocarbon', title: wrapPoisWords('ผลิตภัณฑ์ใช้ในบ้าน /', 'น้ำมันก๊าด /', 'ทินเนอร์'), desc: 'น้ำยาล้างจาน, ลูกเหม็น, น้ำมันสน' },
            { id: 'poisoningCat_illicit_alcohol', title: wrapPoisWords('สุราเถื่อน /', 'ยาดอง'), desc: 'เหล้าต้มเอง หรือเหล้าแบ่งขายไม่มียี่ห้อ' },
            { id: 'poisoningCat_plants_animals', title: wrapPoisWords('พืชพิษ /', 'เห็ดพิษ /', 'อาหารมีพิษ') },
            { id: 'poisoningCat_narcotics', title: wrapPoisWords('สารเสพติด'), desc: 'เช่น กัญชา, กระท่อม, ยาบ้า, ไอซ์' },
            { id: 'poisoningCat_toxic_gas_smoke', title: wrapPoisWords('ควันไฟ /', 'ก๊าซพิษ /', 'ควันเตาถ่าน') },
            { id: 'poisoningCat_unknown', title: wrapPoisWords('ไม่ทราบกลุ่ม /', 'ชนิดสารพิษ') }
          ], { kind: 'checkbox' })}
        </div>

        <div class="pt-2 border-t border-slate-100">
          ${renderPoisSysHeader({
            icon: 'heart-pulse',
            iconBg: 'bg-teal-100',
            iconColor: 'text-teal-700',
            title: '2.2 การอาเจียนหรือการปฐมพยาบาลเบื้องต้น (เลือกได้หลายข้อ)',
            noneId: 'poisoningFirstAid_none',
            noneLabel: 'ยังไม่ได้ปฐมพยาบาล / ไม่อาเจียน',
            noneOnchange: 'handlePoisFirstAidNoneChange()'
          })}
          ${renderPoisGrid('grid-cols-1 sm:grid-cols-3', [
            { id: 'poisoningFirstAid_vomited', title: wrapPoisWords('อาเจียนออกมาเอง') },
            { id: 'poisoningFirstAid_induced', title: wrapPoisWords('ล้วงคอให้อาเจียน /', 'ดื่มน้ำ-นม-ไข่'), desc: 'วิธีที่ไม่ควรทำ (แจ้งเพื่อประเมินการสำลัก)' },
            { id: 'poisoningFirstAid_washed', title: wrapPoisWords('ล้างตา / ล้างผิวหนัง /', 'เปลี่ยนชุดแล้ว') }
          ], { kind: 'checkbox', onchange: 'handlePoisFirstAidItemChange(this)' })}
        </div>

        <div class="pt-2 border-t border-slate-100">
          <label class="block text-xs font-bold text-slate-700 mb-2">2.3 ท่านได้นำซองยา ขวดสารพิษ หรือภาพถ่ายฉลากมาด้วยหรือไม่:</label>
          ${renderPoisGrid('grid-cols-1 sm:grid-cols-3', [
            { value: 'brought_container', title: wrapPoisWords('นำซองยา /', 'ขวดสารมาด้วย') },
            { value: 'photo_only', title: wrapPoisWords('มีภาพถ่ายฉลาก', 'ในโทรศัพท์') },
            { value: 'none', title: wrapPoisWords('ไม่ได้นำมา /', 'ไม่มีภาพถ่าย') }
          ], { kind: 'radio', name: 'poisoningContainerStatus' })}
        </div>
      </div>

      <!-- CARD 3: อาการผิดปกติในขณะนี้ (Route-Aware) และระดับความปวด -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
        <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="activity" class="h-5 w-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">3. อาการผิดปกติในขณะนี้ และระดับความปวด</h2>
            <p class="text-xs text-slate-500">แสดงอาการตามช่องทางที่ได้รับสารเพื่อลดภาระการอ่าน</p>
          </div>
        </div>

        <div class="space-y-3">
          ${renderPoisSysHeader({
            icon: 'activity',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            title: '3.1 อาการผิดปกติในขณะนี้ (เลือกได้หลายข้อ)',
            noneId: 'poisoningSym_asymptomatic',
            noneLabel: 'ยังไม่มีอาการผิดปกติในขณะนี้',
            noneOnchange: 'handlePoisSymNoneChange()'
          })}

          <div id="poisoningRouteSpecificWrap" class="space-y-2.5">
            <div id="poisoningRouteSymptoms_ingestion">
              ${renderPoisGrid('grid-cols-1 sm:grid-cols-3', [
                { id: 'poisoningSym_oral_burn', title: wrapPoisWords('แสบไหม้ในปาก-คอ /', 'กลืนไม่ได้') },
                { id: 'poisoningSym_nausea_vomit_abdpain', title: wrapPoisWords('คลื่นไส้ / อาเจียน /', 'ปวดแสบท้อง') },
                { id: 'poisoningSym_hematemesis_melena', title: wrapPoisWords('อาเจียนเป็นเลือด /', 'ถ่ายอุจจาระดำ') }
              ], { kind: 'checkbox', onchange: 'handlePoisSymItemChange(this)' })}
            </div>

            <div id="poisoningRouteSymptoms_throat">
              ${renderPoisGrid('grid-cols-1 sm:grid-cols-2', [
                { id: 'poisoningSym_stridor_hoarseness', title: wrapPoisWords('เสียงแหบ / หายใจดัง /', 'แน่นตีบในลำคอ') }
              ], { kind: 'checkbox', onchange: 'handlePoisSymItemChange(this)' })}
            </div>

            <div id="poisoningRouteSymptoms_inhalation" class="hidden">
              ${renderPoisGrid('grid-cols-1 sm:grid-cols-2', [
                { id: 'poisoningSym_cough_soot', title: wrapPoisWords('ไอสำลัก / แสบคอ /', 'เสมหะปนเขม่าควัน') }
              ], { kind: 'checkbox', onchange: 'handlePoisSymItemChange(this)' })}
            </div>

            <div id="poisoningRouteSymptoms_skin" class="hidden">
              ${renderPoisGrid('grid-cols-1 sm:grid-cols-2', [
                { id: 'poisoningSym_skin_burn', title: wrapPoisWords('ผิวหนังปวดแสบ / แดง /', 'พุพองบริเวณที่สัมผัส') }
              ], { kind: 'checkbox', onchange: 'handlePoisSymItemChange(this)' })}
            </div>

            <div id="poisoningRouteSymptoms_eye" class="hidden">
              ${renderPoisGrid('grid-cols-1 sm:grid-cols-2', [
                { id: 'poisoningSym_eye_burn', title: wrapPoisWords('ปวดแสบตา / ตาแดง /', 'ลืมตาไม่ขึ้น / ตามัว') }
              ], { kind: 'checkbox', onchange: 'handlePoisSymItemChange(this)' })}
            </div>

            <div id="poisoningRouteSymptoms_injection" class="hidden">
              ${renderPoisGrid('grid-cols-1 sm:grid-cols-2', [
                { id: 'poisoningSym_injection_site', title: wrapPoisWords('ปวด บวม แดง /', 'รอยคล้ำตำแหน่งที่ฉีด') }
              ], { kind: 'checkbox', onchange: 'handlePoisSymItemChange(this)' })}
            </div>
          </div>

          <div id="poisoningSystemicSymptomsWrap" class="space-y-2.5 pt-2 border-t border-slate-100">
            <span class="block text-xs font-semibold text-slate-700">อาการทั่วร่างกาย:</span>
            ${renderPoisGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-4', [
              { id: 'poisoningSym_drowsy_unconscious', title: wrapPoisWords('ง่วงซึมมาก /', 'ปลุกตื่นยาก /', 'ไม่รู้สึกตัว') },
              { id: 'poisoningSym_seizure', title: wrapPoisWords('ชักเกร็ง /', 'กล้ามเนื้อกระตุก') },
              { id: 'poisoningSym_confusion_agitation', title: wrapPoisWords('สับสน / พูดเพ้อ /', 'เห็นภาพหลอน') },
              { id: 'poisoningSym_dyspnea_abnormal_resp', title: wrapPoisWords('หอบเหนื่อย /', 'หายใจเร็วหรือช้าผิดปกติ') },
              { id: 'poisoningSym_salivation_secretions', title: wrapPoisWords('น้ำลายฟูมปาก /', 'เสมหะมาก') },
              { id: 'poisoningSym_diaphoresis', title: wrapPoisWords('เหงื่อแตกท่วมตัว') },
              { id: 'poisoningSym_incontinence', title: wrapPoisWords('ปัสสาวะราด /', 'อุจจาระราด') },
              { id: 'poisoningSym_dry_mouth_anhidrosis', title: wrapPoisWords('ปากแห้งคอแห้ง /', 'ตัวร้อนไม่มีเหงื่อ'), desc: 'หรือปัสสาวะไม่ออก' },
              { id: 'poisoningSym_blurred_vision', title: wrapPoisWords('ตามัว /', 'เห็นภาพซ้อน'), desc: 'คล้ายมองผ่านหมอก' },
              { id: 'poisoningSym_numbness_weakness', title: wrapPoisWords('ชารอบปาก-มือ /', 'แขนขาอ่อนแรง') },
              { id: 'poisoningSym_palpitations_syncope', title: wrapPoisWords('ใจสั่น / เต้นผิดจังหวะ /', 'หน้ามืดวูบ') },
              { id: 'poisoningSym_dark_urine_jaundice', title: wrapPoisWords('ปัสสาวะสีเข้ม /', 'ตัวเหลืองตาเหลือง') }
            ], { kind: 'checkbox', onchange: 'handlePoisSymItemChange(this)' })}
          </div>
        </div>

        <div class="space-y-4 pt-4 border-t border-slate-100">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-2">3.2 มีอาการปวด / เจ็บ (เลือกได้หลายตำแหน่ง):</label>
            ${renderPoisGrid('grid-cols-2 sm:grid-cols-3 lg:grid-cols-5', [
              { id: 'poisoningPainLoc_abdomen', title: wrapPoisWords('ท้อง') },
              { id: 'poisoningPainLoc_chest', title: wrapPoisWords('ทรวงอก') },
              { id: 'poisoningPainLoc_oral_throat', title: wrapPoisWords('ปาก /', 'คอ') },
              { id: 'poisoningPainLoc_skin', title: wrapPoisWords('ผิวหนัง') },
              { id: 'poisoningPainLoc_other', title: wrapPoisWords('อื่นๆ', '(ระบุ)'), onchange: 'handlePoisPainLocOtherChange()' }
            ], { kind: 'checkbox' })}
            <div id="poisoningPainLocOtherWrap" class="hidden mt-2.5">
              <input type="text" id="poisoningPainLocOtherText" placeholder="ระบุตำแหน่งที่ปวดหรือเจ็บเพิ่มเติม เช่น ศีรษะ, แขนขา..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white">
            </div>
          </div>

          <div class="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label class="block text-xs font-semibold text-slate-800 uppercase tracking-wider">ระดับความเจ็บปวดในขณะนี้ (Pain Score: 0 – 10)</label>
              <div class="flex items-center space-x-2">
                <span id="poisoningPainScoreBadge" class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all">
                  <span id="poisoningPainScoreEmoji" class="text-base">⚪</span>
                  <span id="poisoningPainScoreText">ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)</span>
                </span>
                <button type="button" id="poisoningPainScoreClearBtn" onclick="clearPoisoningPainScore()" class="text-xs text-slate-400 hover:text-rose-600 underline hidden transition" title="ล้างค่าเพื่อให้เป็นไม่ได้ระบุ">ล้างค่า</button>
              </div>
            </div>
            <div class="px-1 pt-1">
              <input type="range" id="poisoningPainScore" min="0" max="10" value="0" step="1" oninput="handlePoisoningPainScoreChange(this.value)" class="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-600 focus:outline-none focus:ring-2 focus:ring-medical-500">
            </div>
            <div class="grid grid-cols-5 text-center text-[10px] sm:text-[11px] pt-1 gap-1 text-slate-500 font-medium">
              <div class="cursor-pointer hover:text-medical-600 transition" onclick="setPoisoningPainScore(0)"><span class="text-lg sm:text-xl block">😊</span><span>0: สบายดี</span></div>
              <div class="cursor-pointer hover:text-medical-600 transition" onclick="setPoisoningPainScore(2)"><span class="text-lg sm:text-xl block">🙂</span><span>1–3: เล็กน้อย</span></div>
              <div class="cursor-pointer hover:text-medical-600 transition" onclick="setPoisoningPainScore(5)"><span class="text-lg sm:text-xl block">😐</span><span>4–6: ปานกลาง</span></div>
              <div class="cursor-pointer hover:text-medical-600 transition" onclick="setPoisoningPainScore(8)"><span class="text-lg sm:text-xl block">😣</span><span>7–9: ปวดมาก</span></div>
              <div class="cursor-pointer hover:text-medical-600 transition" onclick="setPoisoningPainScore(10)"><span class="text-lg sm:text-xl block">😭</span><span>10: ปวดที่สุด</span></div>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 4: น้ำหนักตัว ลักษณะเหตุการณ์ ประวัติร่วม และเวลางดน้ำ/อาหาร -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
        <div class="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="shield-alert" class="h-5 w-5"></i></div>
          <div>
            <h2 class="text-base font-bold text-slate-900">4. น้ำหนักตัว ลักษณะเหตุการณ์ ประวัติร่วม และ NPO Time</h2>
            <p class="text-xs text-slate-500">ข้อมูลสำหรับคำนวณขนาดยาต้านพิษ ความปลอดภัย และเวลางดน้ำ/อาหาร</p>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">4.1 น้ำหนักตัวโดยประมาณ (กิโลกรัม):</label>
          <p class="text-xs text-slate-500 mb-2">ใช้คำนวณขนาดยาต้านพิษต่อน้ำหนักตัว</p>
          <div class="w-full sm:w-56 relative">
            <input type="number" id="poisoningWeightKg" min="1" max="250" placeholder="เช่น 60" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm">
            <span class="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">กก. (kg)</span>
          </div>
        </div>

        <div class="space-y-2 pt-2 border-t border-slate-100">
          <label class="block text-xs font-bold text-slate-700 mb-2">4.2 สาเหตุหรือลักษณะของเหตุการณ์:</label>
          ${renderPoisGrid('grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', [
            { value: 'accident', title: wrapPoisWords('อุบัติเหตุ /', 'หยิบผิด / กินซ้ำ') },
            { value: 'intentional_self_harm', title: wrapPoisWords('ตั้งใจทำร้ายตนเอง /', 'ความเครียด') },
            { value: 'occupational_environmental', title: wrapPoisWords('ได้รับขณะทำงาน /', 'สภาพแวดล้อม') },
            { value: 'food_plant_animal', title: wrapPoisWords('กินอาหาร / พืช / เห็ด', 'โดยไม่รู้ว่ามีพิษ') },
            { value: 'suspected_poisoned', title: wrapPoisWords('สงสัยถูกผู้อื่น', 'ผสมสารพิษ') }
          ], { kind: 'radio', name: 'poisoningIntent', onchange: 'handlePoisoningIntentChange()' })}
          <div id="poisoningSuicideRiskBranch" class="hidden mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <span class="text-xs font-bold text-slate-800 block">ในขณะนี้ ท่านยังมีความคิดอยากทำร้ายตนเองซ้ำอีกหรือไม่:</span>
            ${renderPoisGrid('grid-cols-1 sm:grid-cols-3', [
              { value: 'active_ideation', title: wrapPoisWords('ยังคิดอยากทำร้าย', 'ตนเองอยู่') },
              { value: 'regretful_no_repeat', title: wrapPoisWords('เสียใจและไม่ต้องการ', 'ทำซ้ำอีก') },
              { value: 'uncertain_confused', title: wrapPoisWords('ไม่แน่ใจ /', 'ยังเครียดสับสนมาก') }
            ], { kind: 'radio', name: 'poisoningSuicideActiveRisk', compact: true, bgWhite: true })}
          </div>
        </div>

        <div class="space-y-2 pt-2 border-t border-slate-100">
          <label class="block text-xs font-bold text-slate-700">4.3 ดื่มเครื่องดื่มแอลกอฮอล์ (สุรา/เบียร์/ยาดอง) ร่วมด้วยหรือไม่:</label>
          ${renderPoisGrid('grid-cols-1 sm:grid-cols-2', [
            { value: 'no', title: wrapPoisWords('ไม่ได้ดื่มแอลกอฮอล์ร่วมด้วย') },
            { value: 'yes', title: wrapPoisWords('ดื่มแอลกอฮอล์ร่วมด้วย') }
          ], { kind: 'radio', name: 'poisoningAlcoholUse', onchange: 'handlePoisoningAlcoholChange()' })}
          <div id="poisoningAlcoholDetailWrap" class="hidden pt-1">
            <input type="text" id="poisoningAlcoholDetail" placeholder="ระบุชนิดและปริมาณ เช่น เบียร์ 2 กระป๋อง, เหล้าขาวครึ่งขวด..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
          </div>
        </div>

        <div id="poisoningFemaleSection" class="hidden space-y-3 pt-2 border-t border-slate-100">
          <div class="flex items-center space-x-2">
            <span class="px-2 py-0.5 text-[10px] font-bold bg-pink-100 text-pink-700 rounded-md">เฉพาะสตรี</span>
            <label class="block text-xs font-bold text-slate-700">4.4 ประจำเดือนและการตั้งครรภ์ (LMP &amp; Pregnancy)</label>
          </div>
          <div class="space-y-3 bg-pink-50/40 p-3.5 rounded-xl border border-pink-200">
            <div>
              <span class="block text-xs font-semibold text-slate-700 mb-1.5">สถานะการตั้งครรภ์ในปัจจุบัน:</span>
              ${renderPoisGrid('grid-cols-1 sm:grid-cols-3', [
                { value: 'not_pregnant', title: wrapPoisWords('ไม่ตั้งครรภ์') },
                { value: 'pregnant', title: wrapPoisWords('กำลังตั้งครรภ์') },
                { value: 'uncertain', title: wrapPoisWords('ไม่แน่ใจ') }
              ], { kind: 'radio', name: 'poisoningPregnancyStatus', onchange: 'handlePoisoningPregnancyChange()', compact: true, bgWhite: true })}
              <div id="poisoningPregnancyWeeksWrap" class="hidden mt-2.5 max-w-xs">
                <input type="number" id="poisoningPregnancyWeeks" min="1" max="42" placeholder="ระบุอายุครรภ์ (สัปดาห์)" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
              </div>
            </div>
            <div class="max-w-xs">
              <span class="block text-xs font-semibold text-slate-700 mb-1">วันแรกของประจำเดือนครั้งสุดท้าย (LMP):</span>
              <input type="text" data-universal-date="true" id="poisoningLmpDate" placeholder="วว/ดด/ปปปป (dd/mm/yyyy)" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
            </div>
          </div>
        </div>

        <div class="space-y-2 pt-2 border-t border-slate-100">
          <label class="block text-xs font-bold text-slate-700">4.5 เวลาที่รับประทานอาหารหรือดื่มน้ำครั้งสุดท้าย (NPO Time):</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <span class="block text-xs font-semibold text-slate-600 mb-1">เวลารับประทานล่าสุด (24 ชม.):</span>
              <input type="text" data-universal-time="true" id="poisoningNpoTime" placeholder="เช่น 18:00" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
            </div>
            <div>
              <span class="block text-xs font-semibold text-slate-600 mb-1">สิ่งที่รับประทานล่าสุด (ถ้ามี):</span>
              <input type="text" id="poisoningNpoLastMeal" placeholder="เช่น ข้าวสวยและน้ำเปล่า..." class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500">
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 5 (UNIVERSAL): อาการอื่นๆ -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100">
          <div class="bg-slate-100 text-slate-600 p-2 rounded-xl"><i data-lucide="message-square-plus" class="w-5 h-5"></i></div>
          <div><h2 class="text-base font-bold text-slate-800">อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2><p class="text-xs text-slate-500">ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)</p></div>
        </div>
        <textarea id="poisoning_other_free" rows="2" placeholder="พิมพ์ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"></textarea>
      </div>
    </div>`,

  collectIntake: function (ctx = {}) {
    const { recordId, queueNumber, randomHn, patientName, patientAge, gender, recordStatus, hospRecordStatus, underlying, drugAllergy, currentMeds, preservedDoctorNotes, otherSymptomsFree } = ctx;
    const _rawDur = parseFloat(document.getElementById('poisoningDurationVal')?.value);
    const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
    const durationUnit = document.getElementById('poisoningDurationUnit')?.value || 'minutes';
    const poisoningTimeUnknown = Boolean(document.getElementById('poisoningTimeUnknown')?.checked);

    const poisoningTimeline = [];
    if (!poisoningTimeUnknown) {
      const date0 = document.getElementById('poisoningDate_0')?.value?.trim() || '';
      const time0 = document.getElementById('poisoningTime_0')?.value?.trim() || '';
      if (date0 || time0) poisoningTimeline.push({ date: date0, time: time0 });
      const container = document.getElementById('poisoningTimeRowsContainer');
      if (container && typeof container.querySelectorAll === 'function') {
        container.querySelectorAll('[id^="poisoningTimeRow_"]').forEach(r => {
          const idx = r.id.replace('poisoningTimeRow_', '');
          if (idx !== '0') {
            const d = document.getElementById(`poisoningDate_${idx}`)?.value?.trim() || '';
            const t = document.getElementById(`poisoningTime_${idx}`)?.value?.trim() || '';
            if (d || t) poisoningTimeline.push({ date: d, time: t });
          }
        });
      }
    }

    const poisoningRoutes = ['ingestion', 'inhalation', 'skin_contact', 'eye_contact', 'injection']
      .filter(k => Boolean(document.getElementById(`poisoningRoute_${k}`)?.checked));

    const poisoningSubstances = [];
    const sub0Name = document.getElementById('poisoningSubstanceName_0')?.value?.trim() || '';
    const sub0Amt = document.getElementById('poisoningSubstanceAmount_0')?.value?.trim() || '';
    if (sub0Name || sub0Amt) poisoningSubstances.push({ name: sub0Name, amount: sub0Amt });
    const subContainer = document.getElementById('poisoningSubstanceRowsContainer');
    if (subContainer && typeof subContainer.querySelectorAll === 'function') {
      subContainer.querySelectorAll('[id^="poisoningSubstanceRow_"]').forEach(r => {
        const idx = r.id.replace('poisoningSubstanceRow_', '');
        if (idx !== '0') {
          const sName = document.getElementById(`poisoningSubstanceName_${idx}`)?.value?.trim() || '';
          const sAmt = document.getElementById(`poisoningSubstanceAmount_${idx}`)?.value?.trim() || '';
          if (sName || sAmt) poisoningSubstances.push({ name: sName, amount: sAmt });
        }
      });
    }

    const poisoningCategories = [
      'paracetamol', 'sedative_psych', 'cardio_diabetic', 'nsaids_anticoag', 'other_meds',
      'corrosives', 'pesticides', 'household_hydrocarbon', 'illicit_alcohol', 'plants_animals',
      'narcotics', 'toxic_gas_smoke', 'unknown'
    ].filter(k => Boolean(document.getElementById(`poisoningCat_${k}`)?.checked));

    const faNone = Boolean(document.getElementById('poisoningFirstAid_none')?.checked);
    const poisoningFirstAid = faNone
      ? ['none']
      : ['vomited', 'induced', 'washed'].filter(k => Boolean(document.getElementById(`poisoningFirstAid_${k}`)?.checked));

    const poisoningContainerStatus = document.querySelector('input[name="poisoningContainerStatus"]:checked')?.value || '';
    const symNone = Boolean(document.getElementById('poisoningSym_asymptomatic')?.checked);
    const poisoningSymptoms = symNone
      ? ['asymptomatic']
      : POIS_SYM_ACTIVE_KEYS.filter(k => Boolean(document.getElementById(`poisoningSym_${k}`)?.checked));

    const poisoningPainLocations = ['abdomen', 'chest', 'oral_throat', 'skin', 'other']
      .filter(k => Boolean(document.getElementById(`poisoningPainLoc_${k}`)?.checked));
    const poisoningPainLocOtherText = poisoningPainLocations.includes('other')
      ? (document.getElementById('poisoningPainLocOtherText')?.value?.trim() || '')
      : '';
    const poisoningPainScoreVal = poisoningPainScoreTouched ? parseInt(document.getElementById('poisoningPainScore')?.value || '0', 10) : null;
    const rawWt = parseFloat(document.getElementById('poisoningWeightKg')?.value);
    const poisoningWeightKg = (!isNaN(rawWt) && rawWt > 0) ? rawWt : null;
    const poisoningIntent = document.querySelector('input[name="poisoningIntent"]:checked')?.value || '';
    const poisoningSuicideActiveRisk = poisoningIntent === 'intentional_self_harm'
      ? (document.querySelector('input[name="poisoningSuicideActiveRisk"]:checked')?.value || '')
      : '';
    const poisoningAlcoholUsed = document.querySelector('input[name="poisoningAlcoholUse"]:checked')?.value || '';
    const poisoningAlcoholDetail = poisoningAlcoholUsed === 'yes' ? (document.getElementById('poisoningAlcoholDetail')?.value?.trim() || '') : '';

    const isFemaleCase = gender === 'หญิง';
    const poisoningLmpDate = isFemaleCase ? (document.getElementById('poisoningLmpDate')?.value?.trim() || '') : '';
    const poisoningPregnancyStatus = isFemaleCase ? (document.querySelector('input[name="poisoningPregnancyStatus"]:checked')?.value || '') : '';
    const poisoningPregnancyWeeks = (isFemaleCase && poisoningPregnancyStatus === 'pregnant')
      ? (document.getElementById('poisoningPregnancyWeeks')?.value?.trim() || '')
      : '';

    const poisoningNpoTime = document.getElementById('poisoningNpoTime')?.value?.trim() || '';
    const poisoningNpoLastMeal = document.getElementById('poisoningNpoLastMeal')?.value?.trim() || '';
    const poisoningInformant = document.querySelector('input[name="poisoningInformant"]:checked')?.value || '';

    const p = ctx.patient || {
      id: recordId || `case-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      queue_number: queueNumber || 'E1-000',
      hn: randomHn || '6700000',
      name: patientName || 'ผู้ป่วย (ไม่ระบุชื่อ)',
      age: patientAge !== undefined ? patientAge : 'ไม่ระบุ',
      gender: gender || 'ไม่ระบุ',
      chief_complaint: 'poisoning',
      chief_complaint_title: 'ได้รับสารพิษ / กินยาเกินขนาด',
      timestamp: new Date().toISOString(),
      status: recordStatus || 'waiting',
      hospRecordStatus: hospRecordStatus || 'unspecified',
      underlying: underlying || [],
      drugAllergy: drugAllergy || 'ไม่ได้ระบุ',
      currentMeds: currentMeds || 'ไม่ได้ระบุ',
      otherSymptomsFree: document.getElementById('poisoning_other_free')?.value?.trim() || otherSymptomsFree || '',
      doctor_notes: preservedDoctorNotes || { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' }
    };

    Object.assign(p, {
      durationVal, durationUnit, poisoningInformant, poisoningTimeUnknown, poisoningTimeline,
      poisoningRoutes, poisoningSubstances, poisoningCategories, poisoningFirstAid, poisoningContainerStatus,
      poisoningSymptoms, poisoningPainLocations, poisoningPainLocOtherText, poisoningPainScoreVal, poisoningWeightKg,
      poisoningIntent, poisoningSuicideActiveRisk, poisoningAlcoholUsed, poisoningAlcoholDetail,
      poisoningLmpDate, poisoningPregnancyStatus, poisoningPregnancyWeeks, poisoningNpoTime, poisoningNpoLastMeal
    });

    const outputs = this.updateOutputs(p);
    p.rapidHpi = outputs.rapid;
    p.narrativeHpi = outputs.narrative;
    p.medicalJson = outputs.json;
    return p;
  },

  hydrateForm: function (patient) {
    const p = patient;
    if (!p) return;
    this.clearForm();

    poisoningPainScoreTouched = p.poisoningPainScoreVal !== null && p.poisoningPainScoreVal !== undefined;
    const setRadio = (name, val) => {
      if (!val) return;
      const rb = document.querySelector(`input[name="${name}"][value="${val}"]`);
      if (rb) rb.checked = true;
    };
    const setCheckboxes = (prefix, keys, arr) => {
      const list = Array.isArray(arr) ? arr : [];
      keys.forEach(k => {
        const cb = document.getElementById(`${prefix}_${k}`);
        if (cb) cb.checked = list.includes(k);
      });
    };

    setRadio('poisoningInformant', p.poisoningInformant);
    if (document.getElementById('poisoningDurationVal')) document.getElementById('poisoningDurationVal').value = p.durationVal ?? '';
    if (document.getElementById('poisoningDurationUnit')) document.getElementById('poisoningDurationUnit').value = p.durationUnit || 'minutes';

    const unknownCb = document.getElementById('poisoningTimeUnknown');
    if (unknownCb) {
      unknownCb.checked = Boolean(p.poisoningTimeUnknown);
      handlePoisoningTimeUnknownChange();
    }

    const tLines = Array.isArray(p.poisoningTimeline) ? p.poisoningTimeline : [];
    if (tLines.length > 0) {
      if (document.getElementById('poisoningDate_0')) document.getElementById('poisoningDate_0').value = tLines[0].date || '';
      if (document.getElementById('poisoningTime_0')) document.getElementById('poisoningTime_0').value = tLines[0].time || '';
      for (let i = 1; i < tLines.length; i++) addPoisoningTimeRow(tLines[i].date || '', tLines[i].time || '');
    }

    setCheckboxes('poisoningRoute', ['ingestion', 'inhalation', 'skin_contact', 'eye_contact', 'injection'], p.poisoningRoutes);

    const sList = Array.isArray(p.poisoningSubstances) ? p.poisoningSubstances : [];
    if (sList.length > 0) {
      if (document.getElementById('poisoningSubstanceName_0')) document.getElementById('poisoningSubstanceName_0').value = sList[0].name || '';
      if (document.getElementById('poisoningSubstanceAmount_0')) document.getElementById('poisoningSubstanceAmount_0').value = sList[0].amount || '';
      for (let j = 1; j < sList.length; j++) addPoisoningSubstanceRow(sList[j].name || '', sList[j].amount || '');
    }

    setCheckboxes('poisoningCat', [
      'paracetamol', 'sedative_psych', 'cardio_diabetic', 'nsaids_anticoag', 'other_meds',
      'corrosives', 'pesticides', 'household_hydrocarbon', 'illicit_alcohol', 'plants_animals',
      'narcotics', 'toxic_gas_smoke', 'unknown'
    ], p.poisoningCategories);
    setCheckboxes('poisoningFirstAid', ['vomited', 'induced', 'washed', 'none'], p.poisoningFirstAid);
    setRadio('poisoningContainerStatus', p.poisoningContainerStatus);
    setCheckboxes('poisoningSym', [...POIS_SYM_ACTIVE_KEYS, 'asymptomatic'], p.poisoningSymptoms);
    updatePoisoningRouteSymptoms();

    setCheckboxes('poisoningPainLoc', ['abdomen', 'chest', 'oral_throat', 'skin', 'other'], p.poisoningPainLocations);
    handlePoisPainLocOtherChange();
    if (document.getElementById('poisoningPainLocOtherText')) {
      document.getElementById('poisoningPainLocOtherText').value = p.poisoningPainLocOtherText || '';
    }

    if (p.poisoningPainScoreVal !== null && p.poisoningPainScoreVal !== undefined) setPoisoningPainScore(p.poisoningPainScoreVal);
    else clearPoisoningPainScore();
    if (document.getElementById('poisoningWeightKg')) document.getElementById('poisoningWeightKg').value = p.poisoningWeightKg ?? '';

    setRadio('poisoningIntent', p.poisoningIntent);
    handlePoisoningIntentChange();
    setRadio('poisoningSuicideActiveRisk', p.poisoningSuicideActiveRisk);

    setRadio('poisoningAlcoholUse', p.poisoningAlcoholUsed);
    handlePoisoningAlcoholChange();
    if (document.getElementById('poisoningAlcoholDetail')) document.getElementById('poisoningAlcoholDetail').value = p.poisoningAlcoholDetail || '';

    let isFemale;
    if (p.gender === 'หญิง') isFemale = true;
    else if (p.gender === 'ชาย') isFemale = false;
    else {
      const titleVal = document.getElementById('patientTitleSelect')?.value || '';
      isFemale = /นาง|น\.ส\.|ด\.ญ\.|Mrs|Ms|Miss/i.test(titleVal || p.name || '');
    }
    syncPoisoningFemaleSection(isFemale);
    if (isFemale) {
      if (document.getElementById('poisoningLmpDate')) document.getElementById('poisoningLmpDate').value = p.poisoningLmpDate || '';
      setRadio('poisoningPregnancyStatus', p.poisoningPregnancyStatus);
      handlePoisoningPregnancyChange();
      if (document.getElementById('poisoningPregnancyWeeks')) document.getElementById('poisoningPregnancyWeeks').value = p.poisoningPregnancyWeeks || '';
    }

    if (document.getElementById('poisoningNpoTime')) document.getElementById('poisoningNpoTime').value = p.poisoningNpoTime || '';
    if (document.getElementById('poisoningNpoLastMeal')) document.getElementById('poisoningNpoLastMeal').value = p.poisoningNpoLastMeal || '';
    if (document.getElementById('poisoning_other_free')) document.getElementById('poisoning_other_free').value = p.otherSymptomsFree || '';
  },

  clearForm: function () {
    const sec = document.getElementById(this.sectionDomId);
    if (!sec) return;
    if (typeof sec.querySelectorAll === 'function') {
      sec.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(el => { el.checked = false; });
      sec.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach(el => { el.value = ''; });
    }
    const durUnit = document.getElementById('poisoningDurationUnit');
    if (durUnit) durUnit.value = 'minutes';
    const timeWrap = document.getElementById('poisoningTimeDetailsWrap');
    if (timeWrap) timeWrap.classList.remove('hidden');

    ['poisoningPainLocOtherWrap', 'poisoningSuicideRiskBranch', 'poisoningAlcoholDetailWrap', 'poisoningFemaleSection', 'poisoningPregnancyWeeksWrap'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });

    const timeContainer = document.getElementById('poisoningTimeRowsContainer');
    if (timeContainer && typeof timeContainer.querySelectorAll === 'function') {
      timeContainer.querySelectorAll('[id^="poisoningTimeRow_"]').forEach(r => { if (r.id !== 'poisoningTimeRow_0') r.remove(); });
    }
    poisoningTimeRowCount = 1;

    const subContainer = document.getElementById('poisoningSubstanceRowsContainer');
    if (subContainer && typeof subContainer.querySelectorAll === 'function') {
      subContainer.querySelectorAll('[id^="poisoningSubstanceRow_"]').forEach(r => { if (r.id !== 'poisoningSubstanceRow_0') r.remove(); });
    }
    poisoningSubstanceRowCount = 1;

    clearPoisoningPainScore();
    updatePoisoningRouteSymptoms();
  },

  populateForm: function (patient) { this.hydrateForm(patient); },
  renderRapidHpi: function (patient) { return this.updateOutputs(patient).rapid; },
  renderNarrativeHpi: function (patient) { return this.updateOutputs(patient).narrative; },

  isRedFlag: function (patient) {
    return this.evaluateRedFlags(patient).length > 0;
  },

  evaluateRedFlags: function (patient) {
    const p = patient;
    const rfs = [];
    if (!p) return rfs;
    const syms = Array.isArray(p.poisoningSymptoms) ? p.poisoningSymptoms : [];
    const cats = Array.isArray(p.poisoningCategories) ? p.poisoningCategories : [];
    const routes = Array.isArray(p.poisoningRoutes) ? p.poisoningRoutes : [];
    const tLines = Array.isArray(p.poisoningTimeline) ? p.poisoningTimeline : [];

    if (syms.includes('drowsy_unconscious') || syms.includes('seizure') || syms.includes('stridor_hoarseness') || syms.includes('dyspnea_abnormal_resp')) {
      rfs.push({
        key: 'rf_poison_airway_cns_emergency',
        textTh: 'ภาวะทางเดินหายใจถูกคุกคาม ซึมหมดสติ หรือชักเกร็งจากสารพิษ (Toxicological Airway / CNS Emergency)',
        risk: 'ความเสี่ยงสูงต่อทางเดินหายใจอุดกั้น โคม่า หรือภาวะหยุดหายใจ (ESI 1)'
      });
    }
    if (cats.includes('corrosives') || syms.includes('oral_burn') || syms.includes('hematemesis_melena')) {
      rfs.push({
        key: 'rf_poison_corrosive_ingestion',
        textTh: 'พิษจากสารกัดกร่อนกรด-ด่างรุนแรง (Corrosive Ingestion — Contraindication to Lavage & Charcoal)',
        risk: 'เสี่ยงต่อหลอดอาหารและกระเพาะอาหารทะลุ ห้ามใส่สาย NG ล้างท้อง และห้ามให้ผงถ่านกัมมันต์เด็ดขาด (ESI 1/2)'
      });
    }
    if (cats.includes('pesticides') || (syms.includes('salivation_secretions') && (syms.includes('diaphoresis') || syms.includes('incontinence') || syms.includes('dyspnea_abnormal_resp')))) {
      rfs.push({
        key: 'rf_poison_cholinergic_crisis',
        textTh: 'กลุ่มอาการพิษโคลิเนอร์จิกเฉียบพลัน / พิษจากยาฆ่าแมลงและสารเคมีเกษตร (Cholinergic Crisis / Pesticide Poisoning)',
        risk: 'เสี่ยงต่อสารคัดหลั่งท่วมปอดและหัวใจเต้นช้าหยุดเต้น ต้องให้ยาต้านพิษ Atropine IV + 2-PAM ทันที (ESI 1)'
      });
    }
    if (cats.includes('paracetamol') || (tLines.length > 1 && cats.length > 0)) {
      rfs.push({
        key: 'rf_poison_paracetamol_staggered',
        textTh: 'ได้รับยาพาราเซตามอลเกินขนาด หรือได้รับยาซ้ำหลายช่วงเวลา (Paracetamol Overdose / Staggered Ingestion)',
        risk: 'เสี่ยงต่อตับวายเฉียบพลัน กรณีทานซ้ำหลายรอบไม่สามารถใช้ Rumack Nomogram ได้ ต้องตรวจเอนไซม์ตับและให้ NAC ทันที (ESI 2)'
      });
    }
    if (cats.includes('cardio_diabetic') || cats.includes('sedative_psych') || cats.includes('narcotics') || syms.includes('palpitations_syncope')) {
      rfs.push({
        key: 'rf_poison_cardiotoxic_sedative_narcotics',
        textTh: 'พิษต่อระบบหัวใจและหลอดเลือด / ยานอนหลับ / ยาจิตเวช / สารเสพติด (Cardiotoxic / Sedative / Narcotics Overdose)',
        risk: 'เสี่ยงต่อภาวะหัวใจเต้นผิดจังหวะรุนแรง ความดันโลหิตตก หรือกดการหายใจ (ESI 1/2)'
      });
    }
    if (syms.includes('numbness_weakness') || cats.includes('illicit_alcohol') || syms.includes('blurred_vision') || cats.includes('toxic_gas_smoke')) {
      rfs.push({
        key: 'rf_poison_neurotoxic_toxic_alcohol_gas',
        textTh: 'พิษต่อระบบประสาทอัมพาต / เมทานอล-สุราเถื่อน / ก๊าซพิษ (Neurotoxic / Toxic Alcohol / CO Inhalation)',
        risk: 'เสี่ยงต่อกล้ามเนื้อหายใจอ่อนแรง ภาวะเลือดเป็นกรดรุนแรง หรือตาบอดถาวร (ESI 1/2)'
      });
    }
    if (routes.includes('eye_contact') || syms.includes('eye_burn') || syms.includes('skin_burn')) {
      rfs.push({
        key: 'rf_poison_ocular_dermal_burn',
        textTh: 'สารเคมีกระเด็นเข้าดวงตาหรือทำลายผิวหนังเฉียบพลัน (Ocular / Dermal Chemical Burn)',
        risk: 'เสี่ยงต่อกระจกตาถูกทำลายตาบอดถาวร ต้องล้างตาด้วย 0.9% NSS ต่อเนื่องทันที (ESI 2/3)'
      });
    }
    if (p.poisoningIntent === 'intentional_self_harm' && (p.poisoningSuicideActiveRisk === 'active_ideation' || p.poisoningSuicideActiveRisk === 'uncertain_confused')) {
      rfs.push({
        key: 'rf_poison_active_suicide_risk',
        textTh: 'ความเสี่ยงสูงในการทำร้ายตนเองซ้ำ (Active Suicidal Risk / Intentional Overdose)',
        risk: 'ต้องจัดให้มีการเฝ้าระวังความปลอดภัยใกล้ชิดในห้องฉุกเฉิน (1:1 Suicide Precaution) (ESI 2)'
      });
    }
    return rfs;
  },

  updateOutputs: function (patient) {
    const p = patient;
    if (!p) return null;
    const durStr = p.durationVal
      ? `${p.durationVal} ${POIS_UNIT_MAP[p.durationUnit] || 'นาที'}`
      : 'ไม่ได้ระบุระยะเวลา';

    const informantDict = { patient: 'ผู้ป่วยให้ข้อมูลเอง', relative_bystander: 'ญาติหรือผู้อยู่ในเหตุการณ์ให้ข้อมูลแทน' };
    const informantText = informantDict[p.poisoningInformant] || 'ไม่ได้ระบุ';
    const hospLabel = {
      complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
      additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
      self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
      unspecified: 'ไม่ได้ระบุ'
    }[p.hospRecordStatus] || 'ไม่ได้ระบุ';

    const routeDict = {
      ingestion: 'กิน/กลืนลงคอ', inhalation: 'สูดดมควัน/ก๊าซ/ไอระเหย',
      skin_contact: 'สัมผัสถูกผิวหนัง', eye_contact: 'กระเด็นเข้าตา', injection: 'ฉีดเข้าสู่ร่างกาย'
    };
    const rList = Array.isArray(p.poisoningRoutes) ? p.poisoningRoutes : [];
    const routeText = rList.length > 0 ? rList.map(k => routeDict[k] || k).join(', ') : 'ไม่ได้ระบุ';

    const sList = Array.isArray(p.poisoningSubstances) ? p.poisoningSubstances : [];
    const subText = sList.length > 0
      ? sList.map(s => `${s.name || 'ไม่ทราบชื่อยา/สาร'} (ปริมาณ: ${s.amount || 'ไม่ระบุ'})`).join(', ')
      : 'ไม่ได้ระบุชื่อสารและปริมาณ';

    const catDict = {
      paracetamol: 'ยาพาราเซตามอล', sedative_psych: 'ยานอนหลับ/ยาจิตเวช',
      cardio_diabetic: 'ยาความดัน/โรคหัวใจ/เบาหวาน', nsaids_anticoag: 'NSAIDs/แอสไพริน/ยาละลายลิ่มเลือด',
      other_meds: 'ยารักษาโรคอื่นๆ/วิตามิน', corrosives: 'สารกัดกร่อนกรด-ด่าง/น้ำยาล้างห้องน้ำ',
      pesticides: 'ยาฆ่าแมลง/ยาฆ่าหญ้า/สารเคมีเกษตร', household_hydrocarbon: 'ผลิตภัณฑ์ใช้ในบ้าน/น้ำมันก๊าด/ทินเนอร์',
      illicit_alcohol: 'สุราเถื่อน/ยาดอง/สงสัยเมทานอล', plants_animals: 'พืชพิษ/เห็ดพิษ/อาหารมีพิษ',
      narcotics: 'สารเสพติด', toxic_gas_smoke: 'ควันไฟ/ก๊าซพิษ/ควันเตาถ่าน', unknown: 'ไม่ทราบกลุ่มแน่ชัด'
    };
    const cList = Array.isArray(p.poisoningCategories) ? p.poisoningCategories : [];
    const catText = cList.length > 0 ? cList.map(k => catDict[k] || k).join(', ') : 'ไม่ได้ระบุกลุ่มสาร';

    const tLines = Array.isArray(p.poisoningTimeline) ? p.poisoningTimeline : [];
    let timelineText = 'ไม่ได้ระบุเวลาแน่ชัด';
    if (p.poisoningTimeUnknown) {
      timelineText = 'ไม่ทราบช่วงเวลาที่ได้รับสารพิษแน่ชัด';
    } else if (tLines.length > 1) {
      timelineText = `ได้รับสารซ้ำหลายครั้ง (${tLines.length} รอบ): ` + tLines.map((t, idx) => `ครั้งที่ ${idx + 1} [${t.date || '-'} ${t.time || '-'}]`).join(', ');
    } else if (tLines.length === 1) {
      timelineText = `ครั้งที่ 1 เมื่อ [${tLines[0].date || '-'} เวลา ${tLines[0].time || '-'}]`;
    }

    const faDict = {
      vomited: 'อาเจียนออกมาเองหลังได้รับสาร',
      induced: 'ล้วงคอให้อาเจียน/ดื่มน้ำ-นม-ไข่ (เป็นวิธีที่ไม่ควรทำ)',
      washed: 'ล้างตา/ล้างผิวหนังและเปลี่ยนเสื้อผ้าแล้ว',
      none: 'ยังไม่ได้ปฐมพยาบาลและยังไม่อาเจียน'
    };
    const faList = Array.isArray(p.poisoningFirstAid) ? p.poisoningFirstAid : [];
    const firstAidText = faList.length > 0 ? faList.map(k => faDict[k] || k).join(', ') : 'ไม่ได้ระบุ';

    const contDict = {
      brought_container: 'นำซองยา/ขวดสารเคมีมาด้วย',
      photo_only: 'มีภาพถ่ายฉลากในโทรศัพท์มือถือ',
      none: 'ไม่ได้นำมาและไม่มีภาพถ่าย'
    };
    const containerText = contDict[p.poisoningContainerStatus] || 'ไม่ได้ระบุ';

    const intentDict = {
      accident: 'อุบัติเหตุ หรือความเข้าใจผิด',
      intentional_self_harm: 'ตั้งใจรับประทานเพื่อทำร้ายตนเอง',
      occupational_environmental: 'ได้รับสารขณะทำงาน หรือจากสภาพแวดล้อม',
      food_plant_animal: 'รับประทานอาหาร/พืช/เห็ดโดยไม่ทราบว่ามีพิษ',
      suspected_poisoned: 'สงสัยว่าอาจได้รับสารพิษโดยผู้อื่นผสมให้'
    };
    let intentText = intentDict[p.poisoningIntent] || 'ไม่ได้ระบุ';
    if (p.poisoningIntent === 'intentional_self_harm' && p.poisoningSuicideActiveRisk) {
      const sRiskDict = {
        active_ideation: 'ยังมีความคิดอยากทำร้ายตนเองซ้ำ',
        regretful_no_repeat: 'รู้สึกเสียใจและไม่ต้องการทำซ้ำ',
        uncertain_confused: 'ไม่แน่ใจ ยังเครียดและสับสนมาก'
      };
      intentText += ` (${sRiskDict[p.poisoningSuicideActiveRisk] || p.poisoningSuicideActiveRisk})`;
    }

    const symDict = {
      oral_burn: 'แสบไหม้ในช่องปาก ลำคอ กลืนลำบาก',
      nausea_vomit_abdpain: 'คลื่นไส้ อาเจียน ปวดแสบท้อง',
      hematemesis_melena: 'อาเจียนเป็นเลือด ถ่ายอุจจาระสีดำ',
      stridor_hoarseness: 'เสียงแหบ หายใจมีเสียงดัง แน่นตีบในลำคอ',
      cough_soot: 'ไอสำลัก แสบคอ เสมหะปนเขม่าควันไฟ',
      skin_burn: 'ผิวหนังปวดแสบ แดง พุพอง',
      eye_burn: 'ปวดแสบตา ตาแดง ลืมตาไม่ขึ้น ตามัวลง',
      injection_site: 'ปวดบวมแดงร้อน รอยคล้ำตำแหน่งที่ฉีด',
      drowsy_unconscious: 'ง่วงซึมมาก ปลุกตื่นยาก ไม่รู้สึกตัว',
      seizure: 'ชักเกร็ง กล้ามเนื้อกระตุก',
      confusion_agitation: 'สับสน พูดเพ้อ เห็นภาพหลอน',
      dyspnea_abnormal_resp: 'หายใจหอบเหนื่อย เร็วหรือช้าผิดปกติ',
      salivation_secretions: 'น้ำลายฟูมปาก มีเสมหะในคอมาก',
      diaphoresis: 'เหงื่อแตกท่วมตัว',
      incontinence: 'ปัสสาวะหรืออุจจาระราด',
      dry_mouth_anhidrosis: 'ปากแห้งคอแห้งมาก ตัวร้อนไม่มีเหงื่อ ปัสสาวะไม่ออก',
      blurred_vision: 'ตามัว มองเห็นภาพซ้อนคล้ายมองผ่านหมอก',
      numbness_weakness: 'ชารอบปาก ลิ้น ปลายมือเท้า หรือแขนขาอ่อนแรง',
      palpitations_syncope: 'ใจสั่น เต้นผิดจังหวะ หรือหน้ามืดจะเป็นลม',
      dark_urine_jaundice: 'ปัสสาวะสีเข้ม ตัวเหลืองตาเหลือง'
    };

    const syms = Array.isArray(p.poisoningSymptoms) ? p.poisoningSymptoms : [];
    const positives = [];
    const negatives = [];

    // Route-Aware Negatives & Zero Default Bias (P-AP14 / C-AP20)
    if (syms.includes('asymptomatic')) {
      negatives.push('ยืนยันยังไม่มีอาการผิดปกติทางร่างกายในขณะนี้');
    } else if (syms.length > 0) {
      syms.forEach(k => { if (symDict[k]) positives.push(symDict[k]); });

      const hasRouteFilter = rList.length > 0;
      const showIng = !hasRouteFilter || rList.includes('ingestion');
      const showThroat = !hasRouteFilter || rList.includes('ingestion') || rList.includes('inhalation');
      const showSys = !(rList.length === 1 && rList[0] === 'eye_contact');

      if (showIng) {
        if (!syms.includes('oral_burn')) negatives.push('ไม่มีแสบไหม้ในช่องปากหรือลำคอ');
        if (!syms.includes('hematemesis_melena')) negatives.push('ไม่มีอาเจียนเป็นเลือดหรือถ่ายดำ');
      }
      if (showThroat && !syms.includes('stridor_hoarseness')) {
        negatives.push('ไม่มีเสียงแหบหรือแน่นตีบในลำคอ');
      }
      if (showSys) {
        if (!syms.includes('drowsy_unconscious')) negatives.push('ไม่ง่วงซึมหรือหมดสติ');
        if (!syms.includes('seizure')) negatives.push('ไม่มีชักเกร็ง');
        if (!syms.includes('dyspnea_abnormal_resp')) negatives.push('ไม่มีหอบเหนื่อยหรือหายใจผิดปกติ');
      }
    }

    if (p.otherSymptomsFree && String(p.otherSymptomsFree).trim()) {
      positives.push(String(p.otherSymptomsFree).trim());
    }
    if (positives.length === 0) {
      if (syms.includes('asymptomatic')) {
        positives.push('ผู้ป่วยมาตรวจประเมินหลังได้รับยาหรือสารพิษ (ยังไม่มีอาการผิดปกติในขณะนี้)');
      } else {
        positives.push('ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม');
      }
    }

    p.pertinentPositives = positives;
    p.pertinentNegatives = negatives.length > 0 ? negatives : ['ผู้ป่วยไม่ได้ระบุคำตอบยืนยันในหมวดอาการร่วม'];

    const painLocMap = { abdomen: 'ท้อง', chest: 'ทรวงอก', oral_throat: 'ปาก/คอ', skin: 'ผิวหนัง' };
    const painLocList = Array.isArray(p.poisoningPainLocations) ? p.poisoningPainLocations : [];
    const painLocStr = painLocList.length > 0
      ? painLocList.map(k => (k === 'other' ? (p.poisoningPainLocOtherText ? `อื่นๆ (${p.poisoningPainLocOtherText})` : 'ตำแหน่งอื่นๆ') : (painLocMap[k] || k))).join(', ')
      : 'ไม่ได้ระบุ';
    const painStr = (p.poisoningPainScoreVal !== null && p.poisoningPainScoreVal !== undefined)
      ? `${p.poisoningPainScoreVal}/10`
      : 'ไม่ได้ระบุ';
    const alcoholText = p.poisoningAlcoholUsed === 'yes'
      ? `มีดื่มแอลกอฮอล์ร่วม (${p.poisoningAlcoholDetail || 'ไม่ระบุรายละเอียด'})`
      : (p.poisoningAlcoholUsed === 'no' ? 'ปฏิเสธการดื่มแอลกอฮอล์' : 'ไม่ได้ระบุ');

    const isFemalePatient = p.gender === 'หญิง' || (typeof p.patientTitle === 'string' && isPoisoningPatientFemale(p.patientTitle));
    let femaleText = '';
    if (isFemalePatient && (p.poisoningLmpDate || p.poisoningPregnancyStatus)) {
      const fMap = {
        pregnant: p.poisoningPregnancyWeeks ? `กำลังตั้งครรภ์ (GA ${p.poisoningPregnancyWeeks} สัปดาห์)` : 'กำลังตั้งครรภ์',
        uncertain: 'ไม่แน่ใจสถานะการตั้งครรภ์',
        not_pregnant: 'ไม่ได้ตั้งครรภ์'
      };
      const pregPart = fMap[p.poisoningPregnancyStatus] || 'ไม่ได้ระบุสถานะการตั้งครรภ์';
      const lmpPart = p.poisoningLmpDate ? `, LMP ${p.poisoningLmpDate}` : '';
      femaleText = `${pregPart}${lmpPart}`;
    }
    const femaleLine = (isFemalePatient && femaleText) ? `\n• ประวัติสตรี: ${femaleText}` : '';

    const udArr = Array.isArray(p.underlying) ? p.underlying : (p.underlying ? [p.underlying] : []);
    const udFilt = udArr.filter(u => u && !u.includes('ปฏิเสธ') && u !== 'ไม่มี' && u !== 'ไม่มีโรคประจำตัว' && u !== 'ไม่ได้ระบุ');
    const udDeny = udArr.some(u => u && (u.includes('ปฏิเสธ') || u === 'ไม่มี' || u === 'ไม่มีโรคประจำตัว'));
    const udText = udFilt.length > 0 ? udFilt.join(', ') : ((udDeny || p.hospRecordStatus === 'self' || p.hospRecordStatus === 'additional') ? 'ปฏิเสธ' : 'ไม่ได้ระบุ');
    const medsText = (!p.currentMeds || p.currentMeds === 'ไม่ได้ระบุ') ? 'ไม่ได้ระบุ' : (p.currentMeds === 'ไม่มี' ? 'ไม่มี' : p.currentMeds);
    const allergyText = (!p.drugAllergy || p.drugAllergy === 'ไม่ได้ระบุ') ? 'ไม่ได้ระบุ' : ((p.drugAllergy.includes('ปฏิเสธ') || p.drugAllergy === 'ไม่มี') ? 'ปฏิเสธ' : p.drugAllergy);
    const effectiveRfs = (Array.isArray(p.redFlags) && p.redFlags.length > 0) ? p.redFlags : this.evaluateRedFlags(p);
    const docNotes = p.doctor_notes || {};

    const rapidNote = `[Chief Complaint (CC)]
ได้รับสารพิษ / กินยาเกินขนาด เป็นมาประมาณ ${durStr}

[History of Present Illness (HPI)]
• ผู้ให้ข้อมูล: ${informantText}
• ลำดับเวลาที่ได้รับสาร: ${timelineText}
• ช่องทางที่ได้รับสาร: ${routeText}
• รายการยา/สารพิษและปริมาณ: ${subText}
• กลุ่มยา/สารพิษ: ${catText}
• การปฐมพยาบาลเบื้องต้น: ${firstAidText}
• ภาชนะบรรจุ/ฉลาก: ${containerText}
• น้ำหนักตัวโดยประมาณ: ${p.poisoningWeightKg ? p.poisoningWeightKg + ' กก.' : 'ไม่ได้ระบุ'}
• ลักษณะเหตุการณ์: ${intentText}
• การดื่มแอลกอฮอล์ร่วมด้วย: ${alcoholText}
• ตำแหน่งที่ปวด / เจ็บ: ${painLocStr}
• ระดับความปวด (Pain Score): ${painStr}
• NPO Time: ${p.poisoningNpoTime ? p.poisoningNpoTime + ' น.' + (p.poisoningNpoLastMeal ? ' (' + p.poisoningNpoLastMeal + ')' : '') : 'ไม่ได้ระบุ'}${femaleLine}

• Pertinent Positives:
${positives.map(s => `  - ${s}`).join('\n')}

• Pertinent Negatives:
${p.pertinentNegatives.map(s => `  - ${s}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• โรคประจำตัว (U/D): ${udText}
• ยาประจำตัว (Current Meds): ${medsText}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${allergyText}

[Emergency Risk Assessment (Red Flags)]
${effectiveRfs.length > 0 ? `🚩 RED FLAGS DETECTED:\n${effectiveRfs.map(r => `  * ${r.textTh}`).join('\n')}` : '✓ ไม่พบสัญญาณวิกฤต (Low-Risk Exposure)'}
• ESI Triage Level: ESI ${p.esi_level || (effectiveRfs.length > 0 ? 2 : 3)}

[Doctor's Clinical Addendum & Exam]
• ประวัติเพิ่มเติม/แก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}
• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}
• แผนการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

    const narrativeNote = `ผู้ป่วย [${p.name || 'ไม่ระบุชื่อ'}] อายุ ${p.age && p.age !== 'ไม่ระบุ' ? p.age + ' ปี' : 'ไม่ระบุ'}${(p.gender && p.gender !== 'ไม่ระบุ') ? ' เพศ ' + p.gender : ''} มารับการตรวจที่ห้องฉุกเฉิน รพ.ราชบุรี ด้วยอาการได้รับสารพิษหรือกินยาเกินขนาด เป็นมาประมาณ ${durStr} (ผู้ให้ข้อมูล: ${informantText})
ได้รับสารผ่านช่องทาง: ${routeText} รายการสารได้แก่ ${subText} (กลุ่มสาร: ${catText}) ${timelineText} การปฐมพยาบาลเบื้องต้น: ${firstAidText} ภาชนะ/ฉลาก: ${containerText} เหตุการณ์เกิดจาก: ${intentText} แอลกอฮอล์ร่วมด้วย: ${alcoholText} น้ำหนัก ${p.poisoningWeightKg ? p.poisoningWeightKg + ' กก.' : 'ไม่ได้ระบุ'} ตำแหน่งปวด/เจ็บ: ${painLocStr} ระดับความปวด ${painStr} งดน้ำอาหารล่าสุด ${p.poisoningNpoTime ? p.poisoningNpoTime + ' น.' : 'ไม่ได้ระบุ'}${femaleText ? ` ประวัติสตรี: ${femaleText}` : ''}

อาการสำคัญที่ตรวจพบ: ${positives.join(', ')}
อาการสำคัญที่ปฏิเสธ: ${p.pertinentNegatives.join(', ')}

ประวัติการเจ็บป่วยในอดีต: [${hospLabel}], โรคประจำตัว: ${udText}, ยาประจำตัว: ${medsText}, แพ้ยา: ${allergyText}${effectiveRfs.length > 0 ? `\n\n[แจ้งเตือนความเสี่ยงสูง]: ${effectiveRfs.map(r => r.textTh).join(', ')}` : ''}

[บันทึกการตรวจและการประเมินโดยแพทย์]:
${docNotes.additional_hpi ? `• ประวัติเพิ่มเติม: ${docNotes.additional_hpi}\n` : ''}${docNotes.physical_exam ? `• การตรวจร่างกาย: ${docNotes.physical_exam}\n` : ''}${docNotes.preliminary_dx ? `• การวินิจฉัย: ${docNotes.preliminary_dx}\n` : ''}${docNotes.plan ? `• แผนการรักษา: ${docNotes.plan}` : ''}`;

    const jsonSchema = {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      encounter: {
        hospital_site: 'Ratchaburi Hospital', queue_id: p.queue_number || null, hn: p.hn || null,
        patient_name: p.name || null, age: p.age !== undefined ? p.age : null, gender: p.gender || null,
        chief_complaint: 'poisoning_overdose', duration_value: p.durationVal, duration_unit: p.durationUnit,
        timeline_summary: timelineText, staggered_exposure: tLines.length > 1,
        triage_urgency_flag: effectiveRfs.length > 0, hospital_record_status: p.hospRecordStatus || null
      },
      exposure_details: {
        informant: p.poisoningInformant || null, routes: rList, substances: sList, categories: cList,
        first_aid: faList, container_brought: p.poisoningContainerStatus || null,
        intent: p.poisoningIntent || null, suicide_active_risk: p.poisoningSuicideActiveRisk || null,
        alcohol_co_ingestion: p.poisoningAlcoholUsed === 'yes', alcohol_detail: p.poisoningAlcoholDetail || null,
        body_weight_kg: p.poisoningWeightKg, pain_locations: painLocList, pain_location_other: p.poisoningPainLocOtherText || '',
        pain_score: p.poisoningPainScoreVal,
        npo_time: p.poisoningNpoTime || null, npo_last_meal: p.poisoningNpoLastMeal || null,
        female_lmp: isFemalePatient ? (p.poisoningLmpDate || null) : null,
        pregnancy_status: isFemalePatient ? (p.poisoningPregnancyStatus || null) : null
      },
      clinical_symptoms: {
        other_symptoms_free: p.otherSymptomsFree || '',
        pertinent_positives: positives,
        pertinent_negatives: p.pertinentNegatives
      },
      red_flags: effectiveRfs.map(r => r.key),
      doctor_clinical_addendum: docNotes
    };

    const rapidEl = document.getElementById('rapidTextView');
    const narrativeEl = document.getElementById('narrativeTextView');
    const jsonEl = document.getElementById('jsonViewer');
    p.rapidHpi = p.custom_rapid_note || rapidNote;
    p.narrativeHpi = p.custom_narrative_note || narrativeNote;
    p.medicalJson = jsonSchema;
    if (rapidEl) rapidEl.value = p.rapidHpi;
    if (narrativeEl) narrativeEl.value = p.narrativeHpi;
    if (jsonEl) jsonEl.textContent = JSON.stringify(jsonSchema, null, 2);

    return { rapid: p.rapidHpi, narrative: p.narrativeHpi, json: jsonSchema };
  }
});

if (typeof window !== 'undefined') {
  window.addPoisoningTimeRow = addPoisoningTimeRow;
  window.removePoisoningTimeRow = removePoisoningTimeRow;
  window.handlePoisoningTimeUnknownChange = handlePoisoningTimeUnknownChange;
  window.addPoisoningSubstanceRow = addPoisoningSubstanceRow;
  window.removePoisoningSubstanceRow = removePoisoningSubstanceRow;
  window.updatePoisoningRouteSymptoms = updatePoisoningRouteSymptoms;
  window.handlePoisFirstAidNoneChange = handlePoisFirstAidNoneChange;
  window.handlePoisFirstAidItemChange = handlePoisFirstAidItemChange;
  window.handlePoisSymNoneChange = handlePoisSymNoneChange;
  window.handlePoisSymItemChange = handlePoisSymItemChange;
  window.handlePoisPainLocOtherChange = handlePoisPainLocOtherChange;
  window.handlePoisoningIntentChange = handlePoisoningIntentChange;
  window.handlePoisoningAlcoholChange = handlePoisoningAlcoholChange;
  window.handlePoisoningPregnancyChange = handlePoisoningPregnancyChange;
  window.handlePoisoningPainScoreChange = handlePoisoningPainScoreChange;
  window.setPoisoningPainScore = setPoisoningPainScore;
  window.clearPoisoningPainScore = clearPoisoningPainScore;
}
