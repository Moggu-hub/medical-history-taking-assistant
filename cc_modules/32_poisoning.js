// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 32_poisoning.js
// อาการนำ: ได้รับสารพิษ / กินยาเกินขนาด (Poisoning / Drug Overdose / Toxic Exposure)
// สอดคล้องตามมาตรฐาน: SKILL_PLAN_CC.md, SKILL_CODE_CC.md และ PROJECT_RULES.md
// รองรับ Dynamic Exposure Timeline Repeater, Dynamic Substance & Amount Repeater,
// Route-Aware Dynamic Symptom Filtering, Universal Date/Time (24h) และ CDS ครบถ้วน
// =========================================================================

// --- Module-scoped State & Helpers ---
let poisoningPainScoreTouched = false;
let poisoningTimeRowCount = 1;
let poisoningSubstanceRowCount = 1;

// จัดการ Dynamic Time Rows
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
    </div>
  `;
  container.appendChild(rowDiv);
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons({ root: rowDiv });
  }
  if (typeof initUniversalDateTimeInputs === 'function') {
    initUniversalDateTimeInputs();
  }
}

function removePoisoningTimeRow(rowElementId) {
  const row = document.getElementById(rowElementId);
  if (row) {
    row.remove();
  }
}

function handlePoisoningTimeUnknownChange() {
  const cb = document.getElementById('poisoningTimeUnknown');
  const detailsWrap = document.getElementById('poisoningTimeDetailsWrap');
  if (!cb || !detailsWrap) return;
  if (cb.checked) {
    detailsWrap.classList.add('hidden');
  } else {
    detailsWrap.classList.remove('hidden');
  }
}

// จัดการ Dynamic Substance & Amount Rows
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
    </div>
  `;
  container.appendChild(rowDiv);
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons({ root: rowDiv });
  }
  if (typeof initUniversalDateTimeInputs === 'function') {
    initUniversalDateTimeInputs();
  }
}

function removePoisoningSubstanceRow(rowElementId) {
  const row = document.getElementById(rowElementId);
  if (row) {
    row.remove();
  }
}

// Route-Aware Dynamic Symptom Filtering ใน Card 3
function updatePoisoningRouteSymptoms() {
  const ingCb = document.getElementById('poisoningRoute_ingestion');
  const inhCb = document.getElementById('poisoningRoute_inhalation');
  const skinCb = document.getElementById('poisoningRoute_skin_contact');
  const eyeCb = document.getElementById('poisoningRoute_eye_contact');
  const injCb = document.getElementById('poisoningRoute_injection');

  const isIngestion = ingCb ? ingCb.checked : false;
  const isInhalation = inhCb ? inhCb.checked : false;
  const isSkin = skinCb ? skinCb.checked : false;
  const isEye = eyeCb ? eyeCb.checked : false;
  const isInjection = injCb ? injCb.checked : false;

  // Toggle Route-Specific Symptom Wrappers
  const wrapIngestion = document.getElementById('poisoningRouteSymptoms_ingestion');
  const wrapThroat = document.getElementById('poisoningRouteSymptoms_throat');
  const wrapInhalation = document.getElementById('poisoningRouteSymptoms_inhalation');
  const wrapSkin = document.getElementById('poisoningRouteSymptoms_skin');
  const wrapEye = document.getElementById('poisoningRouteSymptoms_eye');
  const wrapInjection = document.getElementById('poisoningRouteSymptoms_injection');
  const wrapSystemic = document.getElementById('poisoningSystemicSymptomsWrap');

  if (wrapIngestion) wrapIngestion.classList.toggle('hidden', !isIngestion);
  if (wrapThroat) wrapThroat.classList.toggle('hidden', !(isIngestion || isInhalation));
  if (wrapInhalation) wrapInhalation.classList.toggle('hidden', !isInhalation);
  if (wrapSkin) wrapSkin.classList.toggle('hidden', !isSkin);
  if (wrapEye) wrapEye.classList.toggle('hidden', !isEye);
  if (wrapInjection) wrapInjection.classList.toggle('hidden', !isInjection);

  // Systemic Symptoms: ซ่อนเฉพาะเมื่อเลือก eye_contact อย่างเดียว (ไม่มีการดูดซึมเข้าระบบร่างกาย)
  const isOnlyEyeContact = isEye && !isIngestion && !isInhalation && !isSkin && !isInjection;
  if (wrapSystemic) {
    wrapSystemic.classList.toggle('hidden', isOnlyEyeContact);
  }
}

// Intent and Circumstance Branching
function handlePoisoningIntentChange() {
  const checked = document.querySelector('input[name="poisoningIntent"]:checked');
  const branch = document.getElementById('poisoningSuicideRiskBranch');
  if (branch) {
    branch.classList.toggle('hidden', !(checked && checked.value === 'intentional_self_harm'));
  }
}

function handlePoisoningAlcoholChange() {
  const checked = document.querySelector('input[name="poisoningAlcoholUse"]:checked');
  const container = document.getElementById('poisoningAlcoholDetailWrap');
  if (container) {
    container.classList.toggle('hidden', !(checked && checked.value === 'yes'));
  }
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

// Pain Scale Helpers
function setPoisoningPainScore(val) {
  poisoningPainScoreTouched = true;
  const slider = document.getElementById('poisoningPainScore');
  const display = document.getElementById('poisoningPainScoreDisplay');
  if (slider) slider.value = val;
  if (display) display.textContent = `${val}/10`;
}

function clearPoisoningPainScore() {
  poisoningPainScoreTouched = false;
  const slider = document.getElementById('poisoningPainScore');
  const display = document.getElementById('poisoningPainScoreDisplay');
  if (slider) slider.value = 0;
  if (display) display.textContent = 'ไม่ได้ระบุ';
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
  onSelectForm: function({ editingPatientId } = {}) {
    syncPoisoningFemaleSection();
    if (!editingPatientId) {
      clearPoisoningPainScore();
      updatePoisoningRouteSymptoms();
    }
  },
  onActivate: function(patient) {
    const g = patient?.gender;
    syncPoisoningFemaleSection(g === 'หญิง' ? true : (g === 'ชาย' ? false : undefined));
  },
  onTitleChange: function({ title, isFemale } = {}) {
    const effective = (typeof title === 'string' && /น\.ส\./.test(title)) ? true : isFemale;
    syncPoisoningFemaleSection(effective);
  },
  resetForm: function() {
    this.clearForm();
  },

  // -----------------------------------------------------------------------
  // CLINICAL ALGORITHM METADATA
  // -----------------------------------------------------------------------
  algorithm: {
    triageLevelRules: [
      { level: 1, criteria: 'Coma, Seizure, Upper airway edema, Severe respiratory distress, Severe caustic burn with shock, Cholinergic crisis' },
      { level: 2, criteria: 'High lethal potential (Staggered paracetamol, Cardiotoxic, Sedative overdose, Active suicidal intent, Caustic ingestion)' },
      { level: 3, criteria: 'Moderate exposure, Ocular chemical burn after irrigation, Mild systemic symptoms, Stable vital signs' },
      { level: 4, criteria: 'Minor exposure, Asymptomatic with non-toxic dose or low-risk substances' }
    ]
  },

  // -----------------------------------------------------------------------
  // SEED PATIENTS (4 CLINICAL REALISTIC CASES)
  // -----------------------------------------------------------------------
  seedPatients: [
    // Case 1: Organophosphate Insecticide Poisoning - Cholinergic Crisis (ESI 1)
    {
      id: 'case-poison-01',
      queue_number: 'E1-131',
      hn: '7890401',
      name: 'นายสมศักดิ์ พ่นยาฆ่าแมลง',
      age: 52,
      gender: 'ชาย',
      chief_complaint: 'poisoning',
      chief_complaint_title: 'ได้รับสารพิษ / กินยาเกินขนาด',
      timestamp: '2026-11-12T16:00:00.000Z',
      status: 'waiting',
      durationVal: 2,
      durationUnit: 'hours',
      hospRecordStatus: 'complete',
      underlying: ['เบาหวาน (DM)'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Metformin 500 mg 1 tab po bid',
      otherSymptomsFree: 'ฉีดพ่นยาฆ่าแมลงในสวนแล้วมีน้ำลายฟูมปาก เหงื่อแตกท่วมตัว เสมหะมาก หายใจเหนื่อย ปัสสาวะราด',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.5, sbp: 90, dbp: 55, bp: '90/55', pr: 48, rr: 28, spo2: 89 },
      esi_level: 1,

      poisoningInformant: 'relative_bystander',
      poisoningTimeUnknown: false,
      poisoningTimeline: [{ date: '12/11/2026', time: '14:00' }],
      poisoningRoutes: ['inhalation', 'skin_contact'],
      poisoningSubstances: [{ name: 'ยาฆ่าแมลงกลุ่มออร์กาโนฟอสเฟต (ขวดสีเขียว)', amount: 'ฉีดพ่นประมาณ 2 ถัง หกเปื้อนเสื้อผ้าและผิวหนัง' }],
      poisoningCategories: ['pesticides'],
      poisoningFirstAid: ['washed'],
      poisoningContainerStatus: 'photo_only',
      poisoningSymptoms: ['dyspnea_abnormal_resp', 'salivation_secretions', 'diaphoresis', 'incontinence'],
      poisoningPainScoreVal: 0,
      poisoningWeightKg: 65,
      poisoningIntent: 'occupational_environmental',
      poisoningSuicideActiveRisk: '',
      poisoningAlcoholUsed: 'no',
      poisoningAlcoholDetail: '',
      poisoningNpoTime: '12:00',
      poisoningNpoLastMeal: 'ก๋วยเตี๋ยวเมื่อเที่ยง'
    },

    // Case 2: Caustic Acid Cleaning Agent Ingestion - Caustic Burn (ESI 1)
    {
      id: 'case-poison-02',
      queue_number: 'E1-132',
      hn: '7890402',
      name: 'นางกานดา ดื่มน้ำยาล้างห้องน้ำ',
      age: 46,
      gender: 'หญิง',
      chief_complaint: 'poisoning',
      chief_complaint_title: 'ได้รับสารพิษ / กินยาเกินขนาด',
      timestamp: '2026-11-12T16:30:00.000Z',
      status: 'waiting',
      durationVal: 1,
      durationUnit: 'hours',
      hospRecordStatus: 'complete',
      underlying: ['โรคซึมเศร้า (Major Depression)'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Sertraline 50 mg 1 tab po od',
      otherSymptomsFree: 'ดื่มน้ำยาล้างห้องน้ำเป็ดโปรกรดเข้มข้น แสบไหม้ปากและลำคอรุนแรง กลืนน้ำลายไม่ได้ อาเจียนมีเลือดปน เสียงแหบ แน่นคอ',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.8, sbp: 130, dbp: 80, bp: '130/80', pr: 110, rr: 24, spo2: 95 },
      esi_level: 1,

      poisoningInformant: 'relative_bystander',
      poisoningTimeUnknown: false,
      poisoningTimeline: [{ date: '12/11/2026', time: '15:30' }],
      poisoningRoutes: ['ingestion'],
      poisoningSubstances: [{ name: 'น้ำยาล้างห้องน้ำกรดเข้มข้น (เป็ดสีม่วง)', amount: 'ประมาณ 1 แก้วน้ำ (200 มล.)' }],
      poisoningCategories: ['corrosives'],
      poisoningFirstAid: ['vomited'],
      poisoningContainerStatus: 'brought_container',
      poisoningSymptoms: ['oral_burn', 'stridor_hoarseness', 'hematemesis_melena', 'nausea_vomit_abdpain'],
      poisoningPainScoreVal: 9,
      poisoningWeightKg: 55,
      poisoningIntent: 'intentional_self_harm',
      poisoningSuicideActiveRisk: 'active_ideation',
      poisoningAlcoholUsed: 'no',
      poisoningAlcoholDetail: '',
      poisoningLmpDate: '28/10/2026',
      poisoningPregnancyStatus: 'not_pregnant',
      poisoningPregnancyWeeks: '',
      poisoningNpoTime: '15:30',
      poisoningNpoLastMeal: 'น้ำยาล้างห้องน้ำ'
    },

    // Case 3: Staggered Paracetamol Overdose with Active Suicidal Intent (ESI 2)
    {
      id: 'case-poison-03',
      queue_number: 'E2-133',
      hn: '7890403',
      name: 'น.ส.พิมพ์ใจ ทานพาราซ้ำสองรอบ',
      age: 24,
      gender: 'หญิง',
      chief_complaint: 'poisoning',
      chief_complaint_title: 'ได้รับสารพิษ / กินยาเกินขนาด',
      timestamp: '2026-11-12T17:00:00.000Z',
      status: 'waiting',
      durationVal: 6,
      durationUnit: 'hours',
      hospRecordStatus: 'complete',
      underlying: ['ปฏิเสธ'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'ไม่มี',
      otherSymptomsFree: 'กินยาพาราเซตามอลรอบแรก 20 เม็ดตอนเที่ยง และกินซ้ำอีก 20 เม็ดตอนบ่ายสาม รวม 40 เม็ด คลื่นไส้ ปวดแสบท้อง ปัสสาวะสีเข้มขึ้น',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.7, sbp: 115, dbp: 70, bp: '115/70', pr: 88, rr: 18, spo2: 99 },
      esi_level: 2,

      poisoningInformant: 'patient',
      poisoningTimeUnknown: false,
      poisoningTimeline: [
        { date: '12/11/2026', time: '12:00' },
        { date: '12/11/2026', time: '15:00' }
      ],
      poisoningRoutes: ['ingestion'],
      poisoningSubstances: [{ name: 'ยาพาราเซตามอล 500 มก. (เม็ดสีขาว)', amount: 'รวม 40 เม็ด (รอบแรก 20 เม็ด รอบสอง 20 เม็ด)' }],
      poisoningCategories: ['paracetamol'],
      poisoningFirstAid: ['none'],
      poisoningContainerStatus: 'brought_container',
      poisoningSymptoms: ['nausea_vomit_abdpain', 'dark_urine_jaundice'],
      poisoningPainScoreVal: 4,
      poisoningWeightKg: 48,
      poisoningIntent: 'intentional_self_harm',
      poisoningSuicideActiveRisk: 'uncertain_confused',
      poisoningAlcoholUsed: 'yes',
      poisoningAlcoholDetail: 'เบียร์ 1 กระป๋องช่วงบ่าย',
      poisoningLmpDate: '01/11/2026',
      poisoningPregnancyStatus: 'not_pregnant',
      poisoningPregnancyWeeks: '',
      poisoningNpoTime: '11:30',
      poisoningNpoLastMeal: 'ข้าวไข่เจียว'
    },

    // Case 4: Accidental Multivitamin Ingestion - Asymptomatic Low-Risk (ESI 4)
    {
      id: 'case-poison-04',
      queue_number: 'E4-134',
      hn: '7890404',
      name: 'ด.ช.ธนกร เผลอหยิบวิตามินซีทาน',
      age: 6,
      gender: 'ชาย',
      chief_complaint: 'poisoning',
      chief_complaint_title: 'ได้รับสารพิษ / กินยาเกินขนาด',
      timestamp: '2026-11-12T17:30:00.000Z',
      status: 'waiting',
      durationVal: 45,
      durationUnit: 'minutes',
      hospRecordStatus: 'complete',
      underlying: ['ภูมิแพ้'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Cetirizine syrup',
      otherSymptomsFree: 'เด็กเผลอหยิบวิตามินซีชนิดเคี้ยวไปรับประทานประมาณ 4 เม็ด มารดาพามาตรวจดูอาการ ขณะนี้รู้สึกตัวดี วิ่งเล่นได้ ไม่มีอาการผิดปกติใดๆ',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.6, sbp: 100, dbp: 60, bp: '100/60', pr: 92, rr: 20, spo2: 100 },
      esi_level: 4,

      poisoningInformant: 'relative_bystander',
      poisoningTimeUnknown: false,
      poisoningTimeline: [{ date: '12/11/2026', time: '16:45' }],
      poisoningRoutes: ['ingestion'],
      poisoningSubstances: [{ name: 'วิตามินซีชนิดเคี้ยวรสส้ม (Vitamin C 100 mg)', amount: '4 เม็ด' }],
      poisoningCategories: ['other_meds'],
      poisoningFirstAid: ['none'],
      poisoningContainerStatus: 'brought_container',
      poisoningSymptoms: ['asymptomatic'],
      poisoningPainScoreVal: 0,
      poisoningWeightKg: 20,
      poisoningIntent: 'accident',
      poisoningSuicideActiveRisk: '',
      poisoningAlcoholUsed: 'no',
      poisoningAlcoholDetail: '',
      poisoningNpoTime: '15:00',
      poisoningNpoLastMeal: 'นมกล่องรสจืด'
    }
  ],

  // -----------------------------------------------------------------------
  // PATIENT FORM HTML
  // -----------------------------------------------------------------------
  formHtml: `
    <div id="ccPoisoningSection" class="space-y-6">

      <!-- First-Aid Guidance Banner (ส่วนต้น) -->
      <div class="bg-teal-50 border border-teal-200 rounded-2xl p-4 sm:p-5 text-teal-900 shadow-2xs space-y-2">
        <div class="flex items-center space-x-2 text-teal-800 font-bold text-sm">
          <i data-lucide="info" class="w-5 h-5 text-teal-600 flex-shrink-0"></i>
          <span>ข้อแนะนำการดูแลตนเองเบื้องต้นระหว่างรอพบแพทย์</span>
        </div>
        <ul class="text-xs text-teal-800 space-y-1.5 pl-6 list-disc">
          <li><strong>ห้ามล้วงคอให้อาเจียน และห้ามดื่มน้ำหรือนมตามเข้าไปอีก:</strong> เพื่อป้องกันสารเคมีไหลย้อนทำลายหลอดอาหารและสำลักเข้าปอด</li>
          <li><strong>หากนำซองยา ขวดสารเคมี หรือมีภาพถ่ายฉลากติดตัวมา:</strong> กรุณาเตรียมส่งมอบให้พยาบาลคัดกรองทันที เพื่อช่วยระบุชนิดสารและเตรียมยาต้านพิษ</li>
          <li><strong>กรณีสารเคมีกระเด็นเข้าตาหรือสัมผัสถูกผิวหนัง:</strong> ให้รีบแจ้งพยาบาลทันทีเพื่อทำการล้างตาหรือล้างผิวหนังด้วยน้ำสะอาดอย่างต่อเนื่อง</li>
          <li><strong>อาการที่ต้องรีบแจ้งพยาบาลทันที:</strong> ง่วงซึมลง หายใจลำบาก กลืนน้ำลายไม่ได้ เสียงแหบ น้ำลายฟูมปาก ชักเกร็ง ตามัว หรือหน้ามืดคล้ายจะเป็นลม</li>
        </ul>
      </div>

      <!-- CARD 1: ช่วงเวลา ช่องทาง และรายการยา/สารพิษ -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
        <div class="flex items-center space-x-3 mb-2">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="clock" class="h-5 w-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">1. ช่วงเวลา ช่องทาง และรายการยาหรือสารพิษ (Timeline, Route & Substances)</h2>
            <p class="text-xs text-slate-500">ข้อมูลเวลาที่ได้รับสาร ช่องทาง และชนิดของยาหรือสารเคมีที่ได้รับ</p>
          </div>
        </div>

        <!-- 1.1 ผู้ให้ข้อมูล -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">1.1 ผู้ให้ข้อมูลในแบบสอบถามนี้</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="poisoningInformant" value="patient" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded-full flex-shrink-0">
              <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ผู้ป่วยให้ข้อมูลด้วยตนเอง</span>
            </label>
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="poisoningInformant" value="relative_bystander" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded-full flex-shrink-0">
              <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ญาติ คนใกล้ชิด หรือผู้ช่วยเหลือ เป็นผู้ให้ข้อมูล</span>
            </label>
          </div>
        </div>

        <!-- 1.2 ช่วงเวลาที่ได้รับสารพิษ -->
        <div class="space-y-3 pt-2 border-t border-slate-100">
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">1.2 ช่วงเวลาที่ได้รับสารพิษหรือรับประทานยา</label>

          <!-- 1.2.1 ระยะเวลาตั้งแต่ได้รับสารจนถึงขณะนี้ -->
          <div>
            <span class="block text-xs font-medium text-slate-600 mb-1.5">ระยะเวลาตั้งแต่ได้รับสารพิษ/กินยา (ครั้งล่าสุด) จนถึงขณะนี้:</span>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div class="col-span-1 sm:col-span-2">
                <input type="number" id="poisoningDurationVal" min="1" max="1000" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm placeholder:text-slate-400 placeholder:font-normal" placeholder="เช่น 30, 2...">
              </div>
              <div class="col-span-1">
                <select id="poisoningDurationUnit" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm">
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

          <!-- 1.2.2 ระบุวันที่และเวลาที่ได้รับสาร -->
          <div class="space-y-2 pt-2">
            <span class="block text-xs font-medium text-slate-600">ระบุวันที่และเวลาที่ได้รับสารพิษ:</span>

            <!-- Checkbox ไม่ทราบช่วงเวลา -->
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="poisoningTimeUnknown" onchange="handlePoisoningTimeUnknownChange()" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3">
                <span class="block text-xs sm:text-sm font-semibold text-slate-800">ไม่ทราบช่วงเวลาที่ได้รับสารพิษแน่ชัด</span>
                <span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น พบผู้ป่วยหมดสติ หรือจำเวลาที่ได้รับสารไม่ได้</span>
              </div>
            </label>

            <!-- Container แถวช่วงเวลา -->
            <div id="poisoningTimeDetailsWrap" class="space-y-2.5">
              <div id="poisoningTimeRowsContainer" class="space-y-2.5">
                <!-- แถวที่ 1 (ค่าเริ่มต้น) -->
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

              <!-- คำอธิบายและปุ่มเพิ่มช่วงเวลา -->
              <div class="pt-1">
                <p class="text-[11px] text-slate-500 mb-1.5">กรณีมีการทานยา หรือสัมผัสสารพิษซ้ำหลายครั้งในต่างช่วงเวลากัน สามารถกดปุ่มด้านล่างเพื่อระบุเวลาของแต่ละครั้งเพิ่มได้</p>
                <button type="button" id="poisoningAddTimeBtn" onclick="addPoisoningTimeRow()"
                  class="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-medical-50 hover:text-medical-700 text-slate-700 border border-slate-300 hover:border-medical-300 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5">
                  <i data-lucide="plus" class="w-4 h-4 text-medical-600"></i>
                  <span>เพิ่มช่วงเวลาที่ได้รับสาร (กรณีทานยาหรือสัมผัสสารซ้ำหลายครั้ง)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 1.3 ช่องทางที่ได้รับสารพิษเข้าสู่ร่างกาย -->
        <div class="space-y-2 pt-2 border-t border-slate-100">
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">1.3 ช่องทางที่ได้รับสารพิษเข้าสู่ร่างกาย (เลือกได้หลายข้อ)</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="poisoningRoute_ingestion" onchange="updatePoisoningRouteSymptoms()" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3">
                <span class="block text-xs sm:text-sm font-semibold text-slate-800">กิน หรือกลืนลงคอ</span>
                <span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น กินยาเม็ด ยาน้ำ ดื่มสารเคมี หรือรับประทานอาหาร/พืชที่มีพิษ</span>
              </div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="poisoningRoute_inhalation" onchange="updatePoisoningRouteSymptoms()" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3">
                <span class="block text-xs sm:text-sm font-semibold text-slate-800">สูดดมควัน ก๊าซ หรือไอระเหยเข้าทางเดินหายใจ</span>
                <span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น สูดดมควันไฟ ควันเตาถ่าน กลิ่นสารเคมีรุนแรง หรือก๊าซรั่วไหล</span>
              </div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="poisoningRoute_skin_contact" onchange="updatePoisoningRouteSymptoms()" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3">
                <span class="block text-xs sm:text-sm font-semibold text-slate-800">สัมผัสถูกผิวหนัง</span>
                <span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น น้ำยาเคมีหกรดตัว หรือยาฆ่าแมลงเปื้อนผิวหนังและเสื้อผ้า</span>
              </div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="poisoningRoute_eye_contact" onchange="updatePoisoningRouteSymptoms()" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3">
                <span class="block text-xs sm:text-sm font-semibold text-slate-800">กระเด็นเข้าตา</span>
                <span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น น้ำยาทำความสะอาด กรด-ด่าง หรือสารเคมีกระเด็นเข้าดวงตา</span>
              </div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition sm:col-span-2">
              <input type="checkbox" id="poisoningRoute_injection" onchange="updatePoisoningRouteSymptoms()" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3">
                <span class="block text-xs sm:text-sm font-semibold text-slate-800">ฉีดเข้าสู่ร่างกาย</span>
                <span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น การฉีดยารักษาโรคเกินขนาด หรือฉีดสารเข้าเส้นเลือด/ใต้ผิวหนัง</span>
              </div>
            </label>
          </div>
        </div>

        <!-- 1.4 รายการชื่อยาหรือสารพิษ และปริมาณ -->
        <div class="space-y-2.5 pt-2 border-t border-slate-100">
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">1.4 รายการชื่อยาหรือชนิดของสารพิษ และปริมาณหรือจำนวนที่ได้รับ</label>
            <p class="text-xs text-slate-500">กรุณาระบุชื่อยาหรือสารเคมีเท่าที่ทราบ หากไม่ทราบชื่อสามารถระบุลักษณะเม็ดยา สี หรือลักษณะขวดได้ และกดปุ่ม + หากได้รับมากกว่า 1 ชนิด</p>
          </div>

          <div id="poisoningSubstanceRowsContainer" class="space-y-2.5">
            <!-- แถวที่ 1 (ค่าเริ่มต้น) -->
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
                <input type="text" id="poisoningSubstanceAmount_0" placeholder="เช่น 20 เม็ด, 2 แผง, ประมาณ 2 อึก (ครึ่งแก้ว)..."
                  class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500">
              </div>
            </div>
          </div>

          <!-- ปุ่มเพิ่มรายการสาร -->
          <div>
            <button type="button" id="poisoningAddSubstanceBtn" onclick="addPoisoningSubstanceRow()"
              class="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-medical-50 hover:text-medical-700 text-slate-700 border border-slate-300 hover:border-medical-300 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5">
              <i data-lucide="plus" class="w-4 h-4 text-medical-600"></i>
              <span>เพิ่มชื่อยา หรือชนิดของสารพิษ และปริมาณที่ได้รับ</span>
            </button>
          </div>
        </div>
      </div>

      <!-- CARD 2: หมวดหมู่สารพิษ การปฐมพยาบาลเบื้องต้น และตัวอย่างฉลาก -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
        <div class="flex items-center space-x-3 mb-2">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="flask-conical" class="h-5 w-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">2. หมวดหมู่ของยาหรือสารพิษ การปฐมพยาบาล และตัวอย่างฉลาก (Substance & First Aid)</h2>
            <p class="text-xs text-slate-500">เพื่อช่วยแพทย์ประเมินกลุ่มสารพิษและเตรียมยาต้านพิษจำเพาะได้อย่างทันท่วงที</p>
          </div>
        </div>

        <!-- 2.1 หมวดหมู่ของสารพิษ -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">2.1 ยาหรือสารพิษที่ได้รับ อยู่ในกลุ่มใดต่อไปนี้ (เลือกได้หลายข้อ)</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="poisoningCat_paracetamol" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3">
                <span class="block text-xs sm:text-sm font-semibold text-slate-800">ยาพาราเซตามอล (ยาลดไข้แก้ปวด)</span>
                <span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น Tylenol, Sara, ยาพาราเซตามอลเม็ดสีขาว/เหลือง หรือยาคลายกล้ามเนื้อที่มีพาราเซตามอลผสม</span>
              </div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="poisoningCat_sedative_psych" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3">
                <span class="block text-xs sm:text-sm font-semibold text-slate-800">ยานอนหลับ ยาคลายเครียด หรือยารักษาโรคทางจิตเวช</span>
                <span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น ยาช่วยให้นอนหลับ ยาลดความวิตกกังวล ยารักษาโรคซึมเศร้า หรือยาปรับอารมณ์</span>
              </div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="poisoningCat_cardio_diabetic" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3">
                <span class="block text-xs sm:text-sm font-semibold text-slate-800">ยารักษาโรคความดันโลหิตสูง โรคหัวใจ หรือโรคเบาหวาน</span>
                <span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น ยาลดความดัน ยาควบคุมการเต้นของหัวใจ ยาลดน้ำตาลในเลือดชนิดเม็ด หรือยาฉีดอินซูลิน</span>
              </div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="poisoningCat_nsaids_anticoag" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3">
                <span class="block text-xs sm:text-sm font-semibold text-slate-800">ยาแก้ปวดต้านการอักเสบ (NSAIDs) แอสไพริน หรือยาละลายลิ่มเลือด</span>
                <span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น Ibuprofen, Ponstan, Arcoxia, Aspirin, Warfarin หรือยาต้านเกล็ดเลือด</span>
              </div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="poisoningCat_other_meds" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3">
                <span class="block text-xs sm:text-sm font-semibold text-slate-800">ยารักษาโรคอื่นๆ หรือวิตามิน/อาหารเสริม</span>
                <span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น ยาแก้แพ้ ยาแก้ไอ ยาปฏิชีวนะ ยาบำรุงเลือดธาตุเหล็ก หรือยารักษาโรคเก๊าท์</span>
              </div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="poisoningCat_corrosives" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3">
                <span class="block text-xs sm:text-sm font-semibold text-slate-800">น้ำยาล้างห้องน้ำ น้ำยาซักผ้าขาว หรือสารกัดกร่อน (กรด/ด่าง)</span>
                <span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น น้ำยาล้างห้องน้ำ น้ำยาฟอกขาวไฮเตอร์ โซดาไฟ น้ำกรด หรือน้ำยาล้างท่อ</span>
              </div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="poisoningCat_pesticides" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3">
                <span class="block text-xs sm:text-sm font-semibold text-slate-800">ยาฆ่าแมลง ยาฆ่าหญ้า ยาเบื่อหนู หรือสารเคมีทางการเกษตร</span>
                <span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น สารกำจัดศัตรูพืช สารกำจัดวัชพืช ยากำจัดหนู หรือปุ๋ยเคมี</span>
              </div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="poisoningCat_household_hydrocarbon" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3">
                <span class="block text-xs sm:text-sm font-semibold text-slate-800">ผลิตภัณฑ์ใช้ในบ้าน น้ำมันก๊าด ทินเนอร์ หรือลูกเหม็น</span>
                <span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น น้ำยาล้างจาน แชมพู น้ำมันสน ลูกเหม็น หรือน้ำยาล้างเล็บ</span>
              </div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="poisoningCat_illicit_alcohol" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3">
                <span class="block text-xs sm:text-sm font-semibold text-slate-800">สุราเถื่อน ไม่มียี่ห้อ หรือยาดอง</span>
                <span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น เหล้าต้มเอง สุราแบ่งขายไม่มียี่ห้อ ยาดองเหล้า หรือสงสัยแอลกอฮอล์ปลอม/เมทานอล</span>
              </div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="poisoningCat_plants_animals" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3">
                <span class="block text-xs sm:text-sm font-semibold text-slate-800">พืชพิษ เห็ดพิษ หรืออาหารมีพิษ</span>
                <span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น เห็ดป่า พืชสมุนไพรไม่ทราบชนิด แมงดาทะเล หรือปลาปักเป้า</span>
              </div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="poisoningCat_narcotics" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3">
                <span class="block text-xs sm:text-sm font-semibold text-slate-800">สารเสพติด</span>
                <span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น กัญชา กระท่อม ยาบ้า ไอซ์ เฮโรอีน หรือสารเสพติดชนิดอื่นๆ</span>
              </div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="poisoningCat_toxic_gas_smoke" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3">
                <span class="block text-xs sm:text-sm font-semibold text-slate-800">ควันไฟ ก๊าซพิษ หรือควันจากการจุดเตาถ่านในที่ปิด</span>
                <span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น ควันจากเหตุเพลิงไหม้ ควันเตาถ่านในห้อง/รถยนต์ที่ปิดมิดชิด หรือก๊าซรั่ว</span>
              </div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition sm:col-span-2">
              <input type="checkbox" id="poisoningCat_unknown" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3">
                <span class="block text-xs sm:text-sm font-semibold text-slate-800">ไม่ทราบกลุ่มหรือชนิดของสารพิษแน่ชัด</span>
                <span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น ไม่เห็นขวดหรือซองยา หรือกินยาหลายชนิดปนกันโดยไม่ทราบชื่อ</span>
              </div>
            </label>
          </div>
        </div>

        <!-- 2.2 การปฐมพยาบาลเบื้องต้น -->
        <div class="space-y-2 pt-2 border-t border-slate-100">
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">2.2 หลังได้รับสารพิษ มีการอาเจียนหรือการปฐมพยาบาลเบื้องต้นอย่างไรบ้าง (เลือกได้หลายข้อ)</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="poisoningFirstAid_vomited" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3">
                <span class="block text-xs sm:text-sm font-semibold text-slate-800">มีอาการอาเจียนออกมาเองหลังได้รับสาร</span>
                <span class="block text-[11px] text-slate-500 font-normal mt-0.5">มีเศษอาหาร น้ำ หรือเม็ดยาถูกอาเจียนออกมาบางส่วน</span>
              </div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="poisoningFirstAid_induced" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3">
                <span class="block text-xs sm:text-sm font-semibold text-slate-800">มีการล้วงคอให้อาเจียน หรือดื่มน้ำ/นม/ไข่ดิบเข้าไปหลังเกิดเหตุ (เป็นวิธีที่ผิด ไม่ควรทำ)</span>
                <span class="block text-[11px] text-slate-500 font-normal mt-0.5">ข้อมูลสำคัญเพื่อให้แพทย์ประเมินความเสี่ยงของการสำลักและการระคายเคืองหลอดอาหาร</span>
              </div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="poisoningFirstAid_washed" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3">
                <span class="block text-xs sm:text-sm font-semibold text-slate-800">ได้ล้างตา หรือล้างผิวหนังด้วยน้ำสะอาด และถอดเสื้อผ้าที่เปื้อนออกแล้ว</span>
                <span class="block text-[11px] text-slate-500 font-normal mt-0.5">กรณีสารเคมีกระเด็นเข้าตาหรือสัมผัสถูกผิวหนัง</span>
              </div>
            </label>
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="poisoningFirstAid_none" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ยังไม่ได้ทำการปฐมพยาบาล และยังไม่ได้อาเจียน</span>
            </label>
          </div>
        </div>

        <!-- 2.3 นำซองยา/ขวดสารเคมีมาด้วยหรือไม่ -->
        <div class="space-y-2 pt-2 border-t border-slate-100">
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">2.3 ท่านได้นำซองยา ขวดสารพิษ หรือมีภาพถ่ายฉลากมาด้วยหรือไม่</label>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="poisoningContainerStatus" value="brought_container" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded-full flex-shrink-0">
              <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">นำซองยา ขวดสารเคมี หรือตัวอย่างสารมาด้วย</span>
            </label>
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="poisoningContainerStatus" value="photo_only" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded-full flex-shrink-0">
              <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่ได้นำขวดจริงมา แต่มีภาพถ่ายฉลากในโทรศัพท์</span>
            </label>
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="poisoningContainerStatus" value="none" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded-full flex-shrink-0">
              <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่ได้นำมา และไม่มีภาพถ่ายฉลาก</span>
            </label>
          </div>
        </div>
      </div>

      <!-- CARD 3: อาการผิดปกติทางร่างกายในขณะนี้ (Route-Aware Dynamic Filtering) -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
        <div class="flex items-center space-x-3 mb-2">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="activity" class="h-5 w-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">3. อาการผิดปกติทางร่างกายในขณะนี้ และระดับความปวด (Symptoms & Pain Score)</h2>
            <p class="text-xs text-slate-500">แสดงเฉพาะอาการที่เกี่ยวข้องกับช่องทางที่ได้รับสารพิษเข้าสู่ร่างกาย เพื่อลดภาระการอ่าน</p>
          </div>
        </div>

        <!-- 3.1 รายการอาการผิดปกติ -->
        <div class="space-y-4">
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider">3.1 ขณะนี้ผู้ป่วยมีอาการผิดปกติใดต่อไปนี้บ้าง (เลือกได้หลายข้อ)</label>

          <!-- ก. อาการเฉพาะช่องทางที่ได้รับสารพิษ (Dynamic Display) -->
          <div id="poisoningRouteSpecificWrap" class="space-y-2.5">
            
            <!-- Ingestion Specific -->
            <div id="poisoningRouteSymptoms_ingestion" class="space-y-2.5">
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" id="poisoningSym_oral_burn" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <div class="ml-3">
                  <span class="block text-xs sm:text-sm font-semibold text-slate-800">แสบไหม้ในช่องปาก ลำคอ กลืนลำบาก หรือกลืนน้ำลายไม่ได้</span>
                  <span class="block text-[11px] text-slate-500 font-normal mt-0.5">ปวดแสบในปาก คอ หรือหน้าอกหลังกลืนสาร หรือมีแผลไหม้ในช่องปาก</span>
                </div>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" id="poisoningSym_nausea_vomit_abdpain" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <div class="ml-3">
                  <span class="block text-xs sm:text-sm font-semibold text-slate-800">คลื่นไส้ อาเจียน หรือปวดแสบท้อง</span>
                  <span class="block text-[11px] text-slate-500 font-normal mt-0.5">พะอืดพะอม อาเจียนซ้ำๆ หรือปวดจุกแน่นบริเวณลิ้นปี่และหน้าท้อง</span>
                </div>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" id="poisoningSym_hematemesis_melena" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <div class="ml-3">
                  <span class="block text-xs sm:text-sm font-semibold text-slate-800">อาเจียนเป็นเลือด หรือถ่ายอุจจาระเป็นสีดำ/มีเลือดปน</span>
                  <span class="block text-[11px] text-slate-500 font-normal mt-0.5">อาเจียนมีเลือดสดหรือสีคล้ำปน หรือถ่ายอุจจาระสีดำเข้ม</span>
                </div>
              </label>
            </div>

            <!-- Ingestion or Inhalation Specific (Throat) -->
            <div id="poisoningRouteSymptoms_throat" class="space-y-2.5">
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" id="poisoningSym_stridor_hoarseness" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <div class="ml-3">
                  <span class="block text-xs sm:text-sm font-semibold text-slate-800">เสียงแหบ หายใจมีเสียงดังผิดปกติ หรือรู้สึกแน่นตีบในลำคอ</span>
                  <span class="block text-[11px] text-slate-500 font-normal mt-0.5">อาการที่บ่งชี้ว่าทางเดินหายใจส่วนต้นอาจเกิดการระคายเคืองหรือบวม</span>
                </div>
              </label>
            </div>

            <!-- Inhalation Specific -->
            <div id="poisoningRouteSymptoms_inhalation" class="space-y-2.5 hidden">
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" id="poisoningSym_cough_soot" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <div class="ml-3">
                  <span class="block text-xs sm:text-sm font-semibold text-slate-800">ไอสำลัก แสบจมูกแสบคอ หรือมีเสมหะปนเขม่าควันไฟ</span>
                  <span class="block text-[11px] text-slate-500 font-normal mt-0.5">ระคายเคืองทางเดินหายใจหลังสูดดมควันไฟ ก๊าซ หรือไอระเหยของสารเคมี</span>
                </div>
              </label>
            </div>

            <!-- Skin Contact Specific -->
            <div id="poisoningRouteSymptoms_skin" class="space-y-2.5 hidden">
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" id="poisoningSym_skin_burn" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <div class="ml-3">
                  <span class="block text-xs sm:text-sm font-semibold text-slate-800">ผิวหนังปวดแสบ แดง พุพอง หรือเนื้อเยื่อเปลี่ยนสีบริเวณที่สัมผัสสาร</span>
                  <span class="block text-[11px] text-slate-500 font-normal mt-0.5">มีรอยไหม้ พุพอง หรือปวดแสบปวดร้อนบริเวณผิวหนังที่โดนสารเคมี</span>
                </div>
              </label>
            </div>

            <!-- Eye Contact Specific -->
            <div id="poisoningRouteSymptoms_eye" class="space-y-2.5 hidden">
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" id="poisoningSym_eye_burn" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <div class="ml-3">
                  <span class="block text-xs sm:text-sm font-semibold text-slate-800">ปวดแสบตา ตาแดง น้ำตาไหล ลืมตาไม่ขึ้น หรือตามัวลงในข้างที่สารกระเด็นเข้าตา</span>
                  <span class="block text-[11px] text-slate-500 font-normal mt-0.5">ระคายเคืองตารุนแรงหรือการมองเห็นลดลงหลังสารเคมีกระเด็นเข้าดวงตา</span>
                </div>
              </label>
            </div>

            <!-- Injection Specific -->
            <div id="poisoningRouteSymptoms_injection" class="space-y-2.5 hidden">
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" id="poisoningSym_injection_site" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <div class="ml-3">
                  <span class="block text-xs sm:text-sm font-semibold text-slate-800">ปวด บวม แดง ร้อน หรือมีรอยคล้ำบริเวณตำแหน่งที่ฉีดสารเข้าสู่ร่างกาย</span>
                  <span class="block text-[11px] text-slate-500 font-normal mt-0.5">มีอาการอักเสบหรือเนื้อเยื่อบวมบริเวณรอยเข็มฉีด</span>
                </div>
              </label>
            </div>
          </div>

          <!-- ข. อาการทางระบบร่างกายส่วนกลาง (Systemic Toxidromes) -->
          <div id="poisoningSystemicSymptomsWrap" class="space-y-2.5 pt-2 border-t border-slate-100">
            <span class="block text-xs font-semibold text-slate-700">อาการผิดปกติทั่วไป หรืออาการทั่วร่างกาย:</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" id="poisoningSym_drowsy_unconscious" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <div class="ml-3">
                  <span class="block text-xs sm:text-sm font-semibold text-slate-800">ง่วงซึมมาก ปลุกตื่นยาก หรือไม่รู้สึกตัว</span>
                  <span class="block text-[11px] text-slate-500 font-normal mt-0.5">สะลึมสะลือ ตอบสนองช้าลง หรือหลับลึกปลุกไม่ตื่น</span>
                </div>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" id="poisoningSym_seizure" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <div class="ml-3">
                  <span class="block text-xs sm:text-sm font-semibold text-slate-800">ชักเกร็ง หรือกล้ามเนื้อกระตุก</span>
                  <span class="block text-[11px] text-slate-500 font-normal mt-0.5">มีอาการชัก เกร็งกระตุกทั้งตัว หรือกล้ามเนื้อสั่นกระตุกควบคุมไม่ได้</span>
                </div>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" id="poisoningSym_confusion_agitation" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <div class="ml-3">
                  <span class="block text-xs sm:text-sm font-semibold text-slate-800">สับสน กระสับกระส่าย พูดเพ้อ หรือเห็นภาพหลอน</span>
                  <span class="block text-[11px] text-slate-500 font-normal mt-0.5">วุ่นวาย อยู่ไม่นิ่ง จำวันเวลาสถานที่ไม่ได้ หรือพูดคุยไม่รู้เรื่อง</span>
                </div>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" id="poisoningSym_dyspnea_abnormal_resp" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <div class="ml-3">
                  <span class="block text-xs sm:text-sm font-semibold text-slate-800">หายใจหอบเหนื่อย หายใจเร็วลึก หรือหายใจแผ่วช้าผิดปกติ</span>
                  <span class="block text-[11px] text-slate-500 font-normal mt-0.5">รู้สึกหายใจไม่เต็มอิ่ม เหนื่อยหอบ หรือหายใจช้าลง</span>
                </div>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" id="poisoningSym_salivation_secretions" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">น้ำลายฟูมปาก หรือมีเสมหะในคอมากผิดปกติ</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" id="poisoningSym_diaphoresis" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">เหงื่อแตกท่วมตัว</span>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" id="poisoningSym_incontinence" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <div class="ml-3">
                  <span class="block text-xs sm:text-sm font-semibold text-slate-800">ปัสสาวะหรืออุจจาระราด</span>
                  <span class="block text-[11px] text-slate-500 font-normal mt-0.5">กลั้นปัสสาวะหรืออุจจาระไม่อยู่ หรือถ่ายไหลออกมาโดยไม่รู้ตัว</span>
                </div>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" id="poisoningSym_dry_mouth_anhidrosis" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <div class="ml-3">
                  <span class="block text-xs sm:text-sm font-semibold text-slate-800">ปากแห้งคอแห้งมาก ตัวร้อนผ่าวผิวแห้ง หรือปัสสาวะไม่ออก</span>
                  <span class="block text-[11px] text-slate-500 font-normal mt-0.5">รู้สึกคอแห้งผาก ผิวหนังร้อนแดงแต่ไม่มีเหงื่อออก</span>
                </div>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" id="poisoningSym_blurred_vision" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <div class="ml-3">
                  <span class="block text-xs sm:text-sm font-semibold text-slate-800">ตามัว มองเห็นภาพซ้อน หรือตาพร่ามัวเหมือนมองผ่านหมอก</span>
                  <span class="block text-[11px] text-slate-500 font-normal mt-0.5">การมองเห็นลดลงเฉียบพลัน ภาพมืดมัว หรือหนังตาตก</span>
                </div>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" id="poisoningSym_numbness_weakness" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <div class="ml-3">
                  <span class="block text-xs sm:text-sm font-semibold text-slate-800">ชาตามรอบปาก ลิ้น ปลายมือปลายเท้า หรือแขนขาอ่อนแรง</span>
                  <span class="block text-[11px] text-slate-500 font-normal mt-0.5">รู้สึกชาซ่าๆ รอบริมฝีปาก ลิ้นแข็ง พูดไม่ชัด หรือยกแขนขาไม่ค่อยขึ้น</span>
                </div>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" id="poisoningSym_palpitations_syncope" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <div class="ml-3">
                  <span class="block text-xs sm:text-sm font-semibold text-slate-800">ใจสั่น หัวใจเต้นเร็ว เต้นช้า หรือหน้ามืดคล้ายจะเป็นลม</span>
                  <span class="block text-[11px] text-slate-500 font-normal mt-0.5">รู้สึกหัวใจเต้นแรงผิดจังหวะ เวียนศีรษะ วูบ หรือทรงตัวไม่อยู่</span>
                </div>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                <input type="checkbox" id="poisoningSym_dark_urine_jaundice" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
                <div class="ml-3">
                  <span class="block text-xs sm:text-sm font-semibold text-slate-800">ปัสสาวะสีเข้มผิดปกติ หรือตัวเหลืองตาเหลือง</span>
                  <span class="block text-[11px] text-slate-500 font-normal mt-0.5">สีปัสสาวะเปลี่ยนเป็นสีน้ำตาลเข้ม แดงเข้ม หรือปัสสาวะออกน้อยลง</span>
                </div>
              </label>
            </div>
          </div>

          <!-- ค. กรณีไม่มีอาการผิดปกติ -->
          <div class="pt-2 border-t border-slate-100">
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="checkbox" id="poisoningSym_asymptomatic" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0">
              <div class="ml-3">
                <span class="block text-xs sm:text-sm font-semibold text-slate-800">ยังไม่มีอาการผิดปกติใดๆ ในขณะนี้</span>
                <span class="block text-[11px] text-slate-500 font-normal mt-0.5">รู้สึกตัวดีและยังไม่มีอาการผิดปกติ แต่มาตรวจประเมินหลังได้รับยาหรือสารพิษ</span>
              </div>
            </label>
          </div>
        </div>

        <!-- 3.2 ระดับความปวดหรือความแสบทรมาน (Visual Emoji Pain Scale 0-10) -->
        <div class="space-y-3 pt-4 border-t border-slate-100">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider">3.2 ระดับความปวดหรือความแสบทรมานในขณะนี้ (0–10)</label>
            <span id="poisoningPainScoreDisplay" class="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg">ไม่ได้ระบุ</span>
          </div>
          <input type="range" id="poisoningPainScore" min="0" max="10" value="0"
            oninput="setPoisoningPainScore(this.value)"
            class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-600">
          <div class="grid grid-cols-6 gap-1 text-center">
            <button type="button" onclick="setPoisoningPainScore(0)" class="p-1 rounded hover:bg-slate-100 text-xs text-slate-700">😊 0<br><span class="text-[10px] text-slate-400">ไม่ปวด</span></button>
            <button type="button" onclick="setPoisoningPainScore(2)" class="p-1 rounded hover:bg-slate-100 text-xs text-slate-700">🙂 1-2<br><span class="text-[10px] text-slate-400">เล็กน้อย</span></button>
            <button type="button" onclick="setPoisoningPainScore(4)" class="p-1 rounded hover:bg-slate-100 text-xs text-slate-700">😐 3-4<br><span class="text-[10px] text-slate-400">ปานกลาง</span></button>
            <button type="button" onclick="setPoisoningPainScore(6)" class="p-1 rounded hover:bg-slate-100 text-xs text-slate-700">😣 5-6<br><span class="text-[10px] text-slate-400">มาก</span></button>
            <button type="button" onclick="setPoisoningPainScore(8)" class="p-1 rounded hover:bg-slate-100 text-xs text-slate-700">😫 7-8<br><span class="text-[10px] text-slate-400">รุนแรง</span></button>
            <button type="button" onclick="setPoisoningPainScore(10)" class="p-1 rounded hover:bg-slate-100 text-xs text-slate-700">😭 9-10<br><span class="text-[10px] text-slate-400">ที่สุด</span></button>
          </div>
          <div class="flex justify-end">
            <button type="button" onclick="clearPoisoningPainScore()" class="text-[11px] text-slate-400 hover:text-slate-600 underline">ล้างค่าความปวด</button>
          </div>
        </div>
      </div>

      <!-- CARD 4: ลักษณะเหตุการณ์ น้ำหนักตัว ประวัติสุขภาพร่วม และเวลางดน้ำ/อาหาร -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
        <div class="flex items-center space-x-3 mb-2">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="shield-alert" class="h-5 w-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">4. ลักษณะเหตุการณ์ น้ำหนักตัว และเวลางดน้ำ/อาหาร (Context & Vitals)</h2>
            <p class="text-xs text-slate-500">ข้อมูลสำคัญสำหรับการคำนวณขนาดยาต้านพิษและการวางแผนรักษา</p>
          </div>
        </div>

        <!-- 4.1 น้ำหนักตัวโดยประมาณ -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">4.1 น้ำหนักตัวโดยประมาณของผู้ป่วย (กิโลกรัม)</label>
          <p class="text-xs text-slate-500 mb-2">ข้อมูลสำคัญเพื่อให้แพทย์คำนวณปริมาณสารพิษต่อน้ำหนักตัวและกำหนดขนาดยาต้านพิษได้อย่างปลอดภัย</p>
          <div class="w-full sm:w-64">
            <div class="relative">
              <input type="number" id="poisoningWeightKg" min="1" max="250" placeholder="เช่น 60"
                class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm">
              <span class="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">กก. (kg)</span>
            </div>
          </div>
        </div>

        <!-- 4.2 สาเหตุหรือลักษณะเหตุการณ์ -->
        <div class="space-y-2 pt-2 border-t border-slate-100">
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">4.2 สาเหตุหรือลักษณะของเหตุการณ์ที่ทำให้ได้รับสารพิษ/กินยาเกินขนาด</label>
          <div class="grid grid-cols-1 gap-2.5">
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="poisoningIntent" value="accident" onchange="handlePoisoningIntentChange()" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded-full flex-shrink-0">
              <div class="ml-3">
                <span class="block text-xs sm:text-sm font-semibold text-slate-800">อุบัติเหตุ หรือความเข้าใจผิด</span>
                <span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น หยิบขวดผิด ดื่มน้ำจากขวดที่แบ่งสารเคมีใส่ไว้ กินยาซ้ำเพราะลืม หรือเด็กหยิบกินเอง</span>
              </div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="poisoningIntent" value="intentional_self_harm" onchange="handlePoisoningIntentChange()" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded-full flex-shrink-0">
              <div class="ml-3">
                <span class="block text-xs sm:text-sm font-semibold text-slate-800">ตั้งใจรับประทานยาหรือสารพิษเนื่องจากความเครียด หรือต้องการทำร้ายตนเอง</span>
                <span class="block text-[11px] text-slate-500 font-normal mt-0.5">ข้อมูลทั้งหมดจะได้รับการดูแลอย่างเป็นความลับ เพื่อให้ทีมแพทย์ดูแลทั้งร่างกายและจิตใจของท่านอย่างปลอดภัย</span>
              </div>
            </label>

            <!-- กิ่งย่อยประเมินความปลอดภัยจิตเวชปัจจุบัน -->
            <div id="poisoningSuicideRiskBranch" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 ml-6 space-y-2.5">
              <span class="text-xs font-bold text-slate-800 block flex items-center">
                <i data-lucide="corner-down-right" class="w-3.5 h-3.5 mr-1 text-medical-600"></i>
                ในขณะนี้ ท่านยังมีความคิดอยากทำร้ายตนเองซ้ำอีกหรือไม่:
              </span>
              <div class="grid grid-cols-1 gap-2">
                <label class="selectable-card flex items-center p-2.5 bg-white rounded-lg border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="radio" name="poisoningSuicideActiveRisk" value="active_ideation" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded-full flex-shrink-0">
                  <span class="ml-3 text-xs font-semibold text-slate-800">ยังมีความคิดอยากทำร้ายตนเองอยู่ หรือรู้สึกไม่อยากมีชีวิตอยู่</span>
                </label>
                <label class="selectable-card flex items-center p-2.5 bg-white rounded-lg border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="radio" name="poisoningSuicideActiveRisk" value="regretful_no_repeat" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded-full flex-shrink-0">
                  <span class="ml-3 text-xs font-semibold text-slate-800">รู้สึกเสียใจกับสิ่งที่เกิดขึ้น และไม่ต้องการทำซ้ำอีก</span>
                </label>
                <label class="selectable-card flex items-center p-2.5 bg-white rounded-lg border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="radio" name="poisoningSuicideActiveRisk" value="uncertain_confused" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded-full flex-shrink-0">
                  <span class="ml-3 text-xs font-semibold text-slate-800">ไม่แน่ใจ / ยังรู้สึกเครียดและสับสนมาก</span>
                </label>
              </div>
            </div>

            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="poisoningIntent" value="occupational_environmental" onchange="handlePoisoningIntentChange()" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded-full flex-shrink-0">
              <div class="ml-3">
                <span class="block text-xs sm:text-sm font-semibold text-slate-800">ได้รับสารพิษขณะทำงาน หรือจากสภาพแวดล้อม</span>
                <span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น ฉีดพ่นสารเคมีเกษตร ทำความสะอาดด้วยสารเคมีในที่อับอากาศ หรืออยู่ในที่เกิดเหตุไฟไหม้/ก๊าซรั่ว</span>
              </div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="poisoningIntent" value="food_plant_animal" onchange="handlePoisoningIntentChange()" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded-full flex-shrink-0">
              <div class="ml-3">
                <span class="block text-xs sm:text-sm font-semibold text-slate-800">รับประทานอาหาร เห็ด พืช หรือเครื่องดื่มโดยไม่ทราบว่ามีพิษ</span>
                <span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น กินเห็ดป่า พืชสมุนไพร แมงดาทะเล หรืออาหารที่มีสารปนเปื้อน</span>
              </div>
            </label>
            <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="poisoningIntent" value="suspected_poisoned" onchange="handlePoisoningIntentChange()" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded-full flex-shrink-0">
              <div class="ml-3">
                <span class="block text-xs sm:text-sm font-semibold text-slate-800">สงสัยว่าอาจได้รับสารพิษโดยผู้อื่นผสมให้รับประทาน</span>
                <span class="block text-[11px] text-slate-500 font-normal mt-0.5">เช่น สงสัยว่าถูกผสมยาหรือสารแปลกปลอมในอาหารหรือเครื่องดื่ม</span>
              </div>
            </label>
          </div>
        </div>

        <!-- 4.3 การดื่มเครื่องดื่มแอลกอฮอล์ร่วมด้วย -->
        <div class="space-y-2 pt-2 border-t border-slate-100">
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">4.3 มีการดื่มเครื่องดื่มแอลกอฮอล์ (สุรา/เบียร์/ยาดอง) ร่วมด้วยในช่วงก่อนหรือหลังเกิดเหตุหรือไม่</label>
          <p class="text-xs text-slate-500 mb-2">แอลกอฮอล์สามารถเสริมฤทธิ์กับยานอนหลับและส่งผลต่อการกำจัดสารพิษของตับ</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="poisoningAlcoholUse" value="no" onchange="handlePoisoningAlcoholChange()" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded-full flex-shrink-0">
              <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ไม่ได้ดื่มเครื่องดื่มแอลกอฮอล์ร่วมด้วย</span>
            </label>
            <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition">
              <input type="radio" name="poisoningAlcoholUse" value="yes" onchange="handlePoisoningAlcoholChange()" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded-full flex-shrink-0">
              <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีการดื่มเครื่องดื่มแอลกอฮอล์ร่วมด้วย</span>
            </label>
          </div>
          <div id="poisoningAlcoholDetailWrap" class="hidden pt-1">
            <input type="text" id="poisoningAlcoholDetail" placeholder="ระบุชนิดและปริมาณเครื่องดื่มแอลกอฮอล์ เช่น เบียร์ 2 กระป๋อง, เหล้าขาวครึ่งขวด..."
              class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500">
          </div>
        </div>

        <!-- 4.4 ประวัติประจำเดือนและการตั้งครรภ์ (แสดงเฉพาะหญิง) -->
        <div id="poisoningFemaleSection" class="hidden space-y-2.5 pt-2 border-t border-slate-100">
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">4.4 ประวัติประจำเดือนและการตั้งครรภ์ (สำหรับผู้ป่วยหญิง)</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div>
              <span class="block text-xs font-medium text-slate-600 mb-1">วันแรกของประจำเดือนครั้งสุดท้าย (LMP):</span>
              <input type="text" data-universal-date="true" id="poisoningLmpDate" placeholder="วว/ดด/ปปปป (dd/mm/yyyy)"
                class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500">
            </div>
            <div>
              <span class="block text-xs font-medium text-slate-600 mb-1">โอกาสตั้งครรภ์ในปัจจุบัน:</span>
              <div class="grid grid-cols-3 gap-1.5 text-xs">
                <label class="selectable-card flex items-center p-2 rounded-lg border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="radio" name="poisoningPregnancyStatus" value="not_pregnant" onchange="handlePoisoningPregnancyChange()" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded-full flex-shrink-0">
                  <span class="ml-2.5 text-[11px] font-semibold text-slate-800">ไม่ตั้งครรภ์</span>
                </label>
                <label class="selectable-card flex items-center p-2 rounded-lg border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="radio" name="poisoningPregnancyStatus" value="pregnant" onchange="handlePoisoningPregnancyChange()" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded-full flex-shrink-0">
                  <span class="ml-2.5 text-[11px] font-semibold text-slate-800">ตั้งครรภ์</span>
                </label>
                <label class="selectable-card flex items-center p-2 rounded-lg border border-slate-200 hover:border-medical-300 cursor-pointer transition">
                  <input type="radio" name="poisoningPregnancyStatus" value="uncertain" onchange="handlePoisoningPregnancyChange()" class="text-medical-600 focus:ring-medical-500 h-3.5 w-3.5 rounded-full flex-shrink-0">
                  <span class="ml-2.5 text-[11px] font-semibold text-slate-800">ไม่แน่ใจ</span>
                </label>
              </div>
            </div>
          </div>
          <div id="poisoningPregnancyWeeksWrap" class="hidden w-full sm:w-64 pt-1">
            <input type="number" id="poisoningPregnancyWeeks" min="1" max="42" placeholder="ระบุอายุครรภ์ (สัปดาห์)"
              class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500">
          </div>
        </div>

        <!-- 4.5 เวลางดน้ำและอาหาร (NPO Time) -->
        <div class="space-y-2 pt-2 border-t border-slate-100">
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">4.5 เวลาที่รับประทานอาหารหรือดื่มน้ำครั้งสุดท้าย (NPO Time)</label>
          <p class="text-xs text-slate-500 mb-2">ข้อมูลจำเป็นสำหรับแพทย์ในกรณีที่ต้องส่องกล้องทางเดินอาหารหรือให้ยาระงับความรู้สึกฉุกเฉิน</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span class="block text-xs font-medium text-slate-600 mb-1">เวลารับประทานล่าสุด (ระบบ 24 ชม.):</span>
              <input type="text" data-universal-time="true" id="poisoningNpoTime" placeholder="เช่น 18:00 (24 ชม.)"
                class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500">
            </div>
            <div>
              <span class="block text-xs font-medium text-slate-600 mb-1">ระบุสิ่งที่รับประทานล่าสุด (ถ้ามี):</span>
              <input type="text" id="poisoningNpoLastMeal" placeholder="เช่น ข้าวสวยและน้ำเปล่า..."
                class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500">
            </div>
          </div>
        </div>
      </div>

      <!-- อาการอื่นๆ เป็นช่องกรอกอิสระ -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100">
          <div class="bg-slate-100 text-slate-600 p-2 rounded-xl"><i data-lucide="message-square-plus" class="w-5 h-5"></i></div>
          <div><h2 class="text-base font-bold text-slate-800">อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2><p class="text-xs text-slate-500">ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)</p></div>
        </div>
        <textarea id="poisoning_other_free" rows="2" placeholder="พิมพ์ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"></textarea>
      </div>
    </div>
  `,

  collectIntake: function(ctx = {}) {
    const { recordId, queueNumber, randomHn, patientName, patientAge, gender, recordStatus, hospRecordStatus, underlying, drugAllergy, currentMeds, preservedDoctorNotes, otherSymptomsFree } = ctx;

    const _rawDur = parseFloat(document.getElementById('poisoningDurationVal')?.value);
    const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
    const durationUnit = document.getElementById('poisoningDurationUnit')?.value || 'minutes';

    const unknownTimeCb = document.getElementById('poisoningTimeUnknown');
    const poisoningTimeUnknown = unknownTimeCb ? unknownTimeCb.checked : false;

    const poisoningTimeline = [];
    if (!poisoningTimeUnknown) {
      const date0 = document.getElementById('poisoningDate_0')?.value?.trim() || '';
      const time0 = document.getElementById('poisoningTime_0')?.value?.trim() || '';
      if (date0 || time0) {
        poisoningTimeline.push({ date: date0, time: time0 });
      }
      const container = document.getElementById('poisoningTimeRowsContainer');
      if (container) {
        const rows = container.querySelectorAll('[id^="poisoningTimeRow_"]');
        rows.forEach(r => {
          const idx = r.id.replace('poisoningTimeRow_', '');
          if (idx !== '0') {
            const d = document.getElementById(`poisoningDate_${idx}`)?.value?.trim() || '';
            const t = document.getElementById(`poisoningTime_${idx}`)?.value?.trim() || '';
            if (d || t) {
              poisoningTimeline.push({ date: d, time: t });
            }
          }
        });
      }
    }

    const poisoningRoutes = [];
    const routeKeys = ['ingestion', 'inhalation', 'skin_contact', 'eye_contact', 'injection'];
    routeKeys.forEach(k => {
      const cb = document.getElementById(`poisoningRoute_${k}`);
      if (cb && cb.checked) poisoningRoutes.push(k);
    });

    const poisoningSubstances = [];
    const sub0Name = document.getElementById('poisoningSubstanceName_0')?.value?.trim() || '';
    const sub0Amt = document.getElementById('poisoningSubstanceAmount_0')?.value?.trim() || '';
    if (sub0Name || sub0Amt) {
      poisoningSubstances.push({ name: sub0Name, amount: sub0Amt });
    }
    const subContainer = document.getElementById('poisoningSubstanceRowsContainer');
    if (subContainer) {
      const sRows = subContainer.querySelectorAll('[id^="poisoningSubstanceRow_"]');
      sRows.forEach(r => {
        const idx = r.id.replace('poisoningSubstanceRow_', '');
        if (idx !== '0') {
          const sName = document.getElementById(`poisoningSubstanceName_${idx}`)?.value?.trim() || '';
          const sAmt = document.getElementById(`poisoningSubstanceAmount_${idx}`)?.value?.trim() || '';
          if (sName || sAmt) {
            poisoningSubstances.push({ name: sName, amount: sAmt });
          }
        }
      });
    }

    const poisoningCategories = [];
    const catKeys = [
      'paracetamol', 'sedative_psych', 'cardio_diabetic', 'nsaids_anticoag', 'other_meds',
      'corrosives', 'pesticides', 'household_hydrocarbon', 'illicit_alcohol', 'plants_animals',
      'narcotics', 'toxic_gas_smoke', 'unknown'
    ];
    catKeys.forEach(k => {
      const cb = document.getElementById(`poisoningCat_${k}`);
      if (cb && cb.checked) poisoningCategories.push(k);
    });

    const poisoningFirstAid = [];
    ['vomited', 'induced', 'washed', 'none'].forEach(k => {
      const cb = document.getElementById(`poisoningFirstAid_${k}`);
      if (cb && cb.checked) poisoningFirstAid.push(k);
    });

    const contRb = document.querySelector('input[name="poisoningContainerStatus"]:checked');
    const poisoningContainerStatus = contRb ? contRb.value : '';

    const symKeys = [
      'oral_burn', 'nausea_vomit_abdpain', 'hematemesis_melena', 'stridor_hoarseness', 'cough_soot',
      'skin_burn', 'eye_burn', 'injection_site', 'drowsy_unconscious', 'seizure', 'confusion_agitation',
      'dyspnea_abnormal_resp', 'salivation_secretions', 'diaphoresis', 'incontinence', 'dry_mouth_anhidrosis',
      'blurred_vision', 'numbness_weakness', 'palpitations_syncope', 'dark_urine_jaundice', 'asymptomatic'
    ];
    const poisoningSymptoms = symKeys.filter(k => document.getElementById(`poisoningSym_${k}`)?.checked);

    const poisoningPainScoreVal = poisoningPainScoreTouched ? parseInt(document.getElementById('poisoningPainScore')?.value || '0', 10) : null;
    const poisoningWeightKg = document.getElementById('poisoningWeightKg')?.value ? parseFloat(document.getElementById('poisoningWeightKg').value) : null;
    const intentRb = document.querySelector('input[name="poisoningIntent"]:checked');
    const poisoningIntent = intentRb ? intentRb.value : '';
    const suicideRb = document.querySelector('input[name="poisoningSuicideActiveRisk"]:checked');
    const poisoningSuicideActiveRisk = poisoningIntent === 'intentional_self_harm' && suicideRb ? suicideRb.value : '';
    const alcRb = document.querySelector('input[name="poisoningAlcoholUse"]:checked');
    const poisoningAlcoholUsed = alcRb ? alcRb.value : '';
    const poisoningAlcoholDetail = poisoningAlcoholUsed === 'yes' ? (document.getElementById('poisoningAlcoholDetail')?.value?.trim() || '') : '';

    const isFemaleCase = gender === 'หญิง';
    const poisoningLmpDate = isFemaleCase ? (document.getElementById('poisoningLmpDate')?.value?.trim() || '') : '';
    const pregRb = document.querySelector('input[name="poisoningPregnancyStatus"]:checked');
    const poisoningPregnancyStatus = isFemaleCase && pregRb ? pregRb.value : '';
    const poisoningPregnancyWeeks = (isFemaleCase && poisoningPregnancyStatus === 'pregnant')
      ? (document.getElementById('poisoningPregnancyWeeks')?.value?.trim() || '')
      : '';

    const poisoningNpoTime = document.getElementById('poisoningNpoTime')?.value?.trim() || '';
    const poisoningNpoLastMeal = document.getElementById('poisoningNpoLastMeal')?.value?.trim() || '';
    const informantRb = document.querySelector('input[name="poisoningInformant"]:checked');
    const poisoningInformant = informantRb ? informantRb.value : '';

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
      hospRecordStatus: hospRecordStatus || 'complete',
      underlying: underlying || [],
      drugAllergy: drugAllergy || 'ปฏิเสธ',
      currentMeds: currentMeds || 'ไม่มี',
      otherSymptomsFree: document.getElementById('poisoning_other_free')?.value?.trim() || otherSymptomsFree || '',
      doctor_notes: preservedDoctorNotes || { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' }
    };

    Object.assign(p, {
      durationVal, durationUnit, poisoningInformant, poisoningTimeUnknown, poisoningTimeline,
      poisoningRoutes, poisoningSubstances, poisoningCategories, poisoningFirstAid, poisoningContainerStatus,
      poisoningSymptoms, poisoningPainScoreVal, poisoningWeightKg, poisoningIntent, poisoningSuicideActiveRisk,
      poisoningAlcoholUsed, poisoningAlcoholDetail, poisoningLmpDate, poisoningPregnancyStatus,
      poisoningPregnancyWeeks, poisoningNpoTime, poisoningNpoLastMeal
    });

    const outputs = this.updateOutputs(p);
    p.rapidHpi = outputs.rapid;
    p.narrativeHpi = outputs.narrative;
    p.medicalJson = outputs.json;
    return p;
  },

  hydrateForm: function(patient) {
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
    setCheckboxes('poisoningSym', [
      'oral_burn', 'nausea_vomit_abdpain', 'hematemesis_melena', 'stridor_hoarseness', 'cough_soot',
      'skin_burn', 'eye_burn', 'injection_site', 'drowsy_unconscious', 'seizure', 'confusion_agitation',
      'dyspnea_abnormal_resp', 'salivation_secretions', 'diaphoresis', 'incontinence', 'dry_mouth_anhidrosis',
      'blurred_vision', 'numbness_weakness', 'palpitations_syncope', 'dark_urine_jaundice', 'asymptomatic'
    ], p.poisoningSymptoms);
    updatePoisoningRouteSymptoms();

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

  clearForm: function() {
    const sec = document.getElementById(this.sectionDomId);
    if (!sec) return;
    sec.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    sec.querySelectorAll('input[type="radio"]').forEach(rb => { rb.checked = false; });
    sec.querySelectorAll('input[type="text"], textarea').forEach(ti => { ti.value = ''; });
    sec.querySelectorAll('input[type="number"]').forEach(ni => { ni.value = ''; });

    const durUnit = document.getElementById('poisoningDurationUnit');
    if (durUnit) durUnit.value = 'minutes';
    const timeWrap = document.getElementById('poisoningTimeDetailsWrap');
    if (timeWrap) timeWrap.classList.remove('hidden');

    ['poisoningSuicideRiskBranch', 'poisoningAlcoholDetailWrap', 'poisoningFemaleSection', 'poisoningPregnancyWeeksWrap'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });

    const timeContainer = document.getElementById('poisoningTimeRowsContainer');
    if (timeContainer) {
      timeContainer.querySelectorAll('[id^="poisoningTimeRow_"]').forEach(r => { if (r.id !== 'poisoningTimeRow_0') r.remove(); });
    }
    poisoningTimeRowCount = 1;

    const subContainer = document.getElementById('poisoningSubstanceRowsContainer');
    if (subContainer) {
      subContainer.querySelectorAll('[id^="poisoningSubstanceRow_"]').forEach(r => { if (r.id !== 'poisoningSubstanceRow_0') r.remove(); });
    }
    poisoningSubstanceRowCount = 1;

    clearPoisoningPainScore();
    updatePoisoningRouteSymptoms();
  },

  populateForm: function(patient) {
    this.hydrateForm(patient);
  },

  renderRapidHpi: function(patient) {
    return this.updateOutputs(patient).rapid;
  },

  renderNarrativeHpi: function(patient) {
    return this.updateOutputs(patient).narrative;
  },

  // -----------------------------------------------------------------------
  // RED FLAG EVALUATION
  // -----------------------------------------------------------------------
  isRedFlag: function(patient) {
    const rfs = this.evaluateRedFlags(patient);
    return rfs.length > 0;
  },

  evaluateRedFlags: function(patient) {
    const p = patient;
    const rfs = [];
    const syms = Array.isArray(p.poisoningSymptoms) ? p.poisoningSymptoms : [];
    const cats = Array.isArray(p.poisoningCategories) ? p.poisoningCategories : [];
    const routes = Array.isArray(p.poisoningRoutes) ? p.poisoningRoutes : [];
    const tLines = Array.isArray(p.poisoningTimeline) ? p.poisoningTimeline : [];

    // 1. Airway / CNS Emergency
    if (
      syms.includes('drowsy_unconscious') ||
      syms.includes('seizure') ||
      syms.includes('stridor_hoarseness') ||
      syms.includes('dyspnea_abnormal_resp')
    ) {
      rfs.push({
        key: 'rf_poison_airway_cns_emergency',
        textTh: 'ภาวะทางเดินหายใจถูกคุกคาม ซึมหมดสติ หรือชักเกร็งจากสารพิษ (Toxicological Airway / CNS Emergency)',
        risk: 'ความเสี่ยงสูงต่อทางเดินหายใจอุดกั้น โคม่า หรือภาวะหยุดหายใจ (ESI 1)'
      });
    }

    // 2. Corrosive Ingestion
    if (
      cats.includes('corrosives') ||
      syms.includes('oral_burn') ||
      syms.includes('hematemesis_melena')
    ) {
      rfs.push({
        key: 'rf_poison_corrosive_ingestion',
        textTh: 'พิษจากสารกัดกร่อนกรด-ด่างรุนแรง (Corrosive Ingestion — Contraindication to Lavage & Charcoal)',
        risk: 'เสี่ยงต่อหลอดอาหารและกระเพาะอาหารทะลุ ห้ามใส่สาย NG ล้างท้อง และห้ามให้ผงถ่านกัมมันต์เด็ดขาด (ESI 1/2)'
      });
    }

    // 3. Cholinergic Crisis
    if (
      cats.includes('pesticides') ||
      (syms.includes('salivation_secretions') && (syms.includes('diaphoresis') || syms.includes('incontinence') || syms.includes('dyspnea_abnormal_resp')))
    ) {
      rfs.push({
        key: 'rf_poison_cholinergic_crisis',
        textTh: 'กลุ่มอาการพิษโคลิเนอร์จิกเฉียบพลัน / พิษจากยาฆ่าแมลงและสารเคมีเกษตร (Cholinergic Crisis / Pesticide Poisoning)',
        risk: 'เสี่ยงต่อสารคัดหลั่งท่วมปอดและหัวใจเต้นช้าหยุดเต้น ต้องให้ยาต้านพิษ Atropine IV + 2-PAM ทันที (ESI 1)'
      });
    }

    // 4. Paracetamol Overdose / Staggered Ingestion
    const isStaggered = tLines.length > 1;
    if (cats.includes('paracetamol') || (isStaggered && cats.length > 0)) {
      rfs.push({
        key: 'rf_poison_paracetamol_staggered',
        textTh: 'ได้รับยาพาราเซตามอลเกินขนาด หรือได้รับยาซ้ำหลายช่วงเวลา (Paracetamol Overdose / Staggered Ingestion)',
        risk: 'เสี่ยงต่อตับวายเฉียบพลัน กรณีทานซ้ำหลายรอบไม่สามารถใช้ Rumack Nomogram ได้ ต้องตรวจเอนไซม์ตับและให้ NAC ทันที (ESI 2)'
      });
    }

    // 5. Cardiotoxic / Sedative / Narcotics Overdose
    if (
      cats.includes('cardio_diabetic') ||
      cats.includes('sedative_psych') ||
      cats.includes('narcotics') ||
      syms.includes('palpitations_syncope')
    ) {
      rfs.push({
        key: 'rf_poison_cardiotoxic_sedative_narcotics',
        textTh: 'พิษต่อระบบหัวใจและหลอดเลือด / ยานอนหลับ / ยาจิตเวช / สารเสพติด (Cardiotoxic / Sedative / Narcotics Overdose)',
        risk: 'เสี่ยงต่อภาวะหัวใจเต้นผิดจังหวะรุนแรง ความดันโลหิตตก หรือกดการหายใจ (ESI 1/2)'
      });
    }

    // 6. Neurotoxic / Toxic Alcohol / Gas Poisoning
    if (
      syms.includes('numbness_weakness') ||
      cats.includes('illicit_alcohol') ||
      syms.includes('blurred_vision') ||
      cats.includes('toxic_gas_smoke')
    ) {
      rfs.push({
        key: 'rf_poison_neurotoxic_toxic_alcohol_gas',
        textTh: 'พิษต่อระบบประสาทอัมพาต / เมทานอล-สุราเถื่อน / ก๊าซพิษ (Neurotoxic / Toxic Alcohol / CO Inhalation)',
        risk: 'เสี่ยงต่อกล้ามเนื้อหายใจอ่อนแรง ภาวะเลือดเป็นกรดรุนแรง หรือตาบอดถาวร (ESI 1/2)'
      });
    }

    // 7. Ocular / Dermal Burn
    if (
      routes.includes('eye_contact') ||
      syms.includes('eye_burn') ||
      syms.includes('skin_burn')
    ) {
      rfs.push({
        key: 'rf_poison_ocular_dermal_burn',
        textTh: 'สารเคมีกระเด็นเข้าดวงตาหรือทำลายผิวหนังเฉียบพลัน (Ocular / Dermal Chemical Burn)',
        risk: 'เสี่ยงต่อกระจกตาถูกทำลายตาบอดถาวร ต้องล้างตาด้วย 0.9% NSS ต่อเนื่องทันที (ESI 2/3)'
      });
    }

    // 8. Active Suicidal Risk
    if (
      p.poisoningIntent === 'intentional_self_harm' &&
      (p.poisoningSuicideActiveRisk === 'active_ideation' || p.poisoningSuicideActiveRisk === 'uncertain_confused')
    ) {
      rfs.push({
        key: 'rf_poison_active_suicide_risk',
        textTh: 'ความเสี่ยงสูงในการทำร้ายตนเองซ้ำ (Active Suicidal Risk / Intentional Overdose)',
        risk: 'ต้องจัดให้มีการเฝ้าระวังความปลอดภัยใกล้ชิดในห้องฉุกเฉิน (1:1 Suicide Precaution) (ESI 2)'
      });
    }

    return rfs;
  },

  // -----------------------------------------------------------------------
  // UPDATE OUTPUTS (RAPID NOTE, NARRATIVE, JSON SCHEMA & PERTINENT LIST)
  // -----------------------------------------------------------------------
  updateOutputs: function(patient) {
    const p = patient;
    if (!p) return null;
    const durStr = p.durationVal ? `${p.durationVal} ${UNIVERSAL_DURATION_UNITS[p.durationUnit] || p.durationUnit}` : 'ไม่ระบุระยะเวลา';

    // Informant & Hospital Status Dicts
    const informantDict = {
      patient: 'ผู้ป่วยให้ข้อมูลเอง',
      relative_bystander: 'ญาติหรือผู้อยู่ในเหตุการณ์ให้ข้อมูลแทน'
    };
    const informantText = informantDict[p.poisoningInformant] || 'ไม่ได้ระบุ';
    const hospLabel = {
      complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
      additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
      self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
      unspecified: 'ไม่ได้ระบุ'
    }[p.hospRecordStatus] || 'ไม่ได้ระบุ';

    // Routes Dict
    const routeDict = {
      ingestion: 'กิน/กลืนลงคอ',
      inhalation: 'สูดดมควัน/ก๊าซ/ไอระเหย',
      skin_contact: 'สัมผัสถูกผิวหนัง',
      eye_contact: 'กระเด็นเข้าตา',
      injection: 'ฉีดเข้าสู่ร่างกาย'
    };
    const rList = Array.isArray(p.poisoningRoutes) ? p.poisoningRoutes : [];
    const routeText = rList.length > 0 ? rList.map(k => routeDict[k] || k).join(', ') : 'ไม่ได้ระบุช่องทาง';

    // Substances
    const sList = Array.isArray(p.poisoningSubstances) ? p.poisoningSubstances : [];
    const subText = sList.length > 0
      ? sList.map(s => `${s.name || 'ไม่ทราบชื่อยา/สาร'} (ปริมาณ: ${s.amount || 'ไม่ระบุ'})`).join(', ')
      : 'ไม่ระบุชื่อสารและปริมาณ';

    // Categories
    const catDict = {
      paracetamol: 'ยาพาราเซตามอล',
      sedative_psych: 'ยานอนหลับ/ยาจิตเวช',
      cardio_diabetic: 'ยาลดความดัน/โรคหัวใจ/เบาหวาน',
      nsaids_anticoag: 'ยาแก้ปวด NSAIDs/แอสไพริน/ยาละลายลิ่มเลือด',
      other_meds: 'ยารักษาโรคอื่นๆ/วิตามิน',
      corrosives: 'สารกัดกร่อนกรด-ด่าง/น้ำยาล้างห้องน้ำ',
      pesticides: 'ยาฆ่าแมลง/ยาฆ่าหญ้า/สารเคมีเกษตร',
      household_hydrocarbon: 'ผลิตภัณฑ์ใช้ในบ้าน/ทินเนอร์/น้ำมันก๊าด',
      illicit_alcohol: 'สุราเถื่อน/ยาดอง/สงสัยเมทานอล',
      plants_animals: 'พืชพิษ/เห็ดพิษ/อาหารมีพิษ',
      narcotics: 'สารเสพติด/กัญชา/กระท่อม',
      toxic_gas_smoke: 'ควันไฟ/ก๊าซพิษ/ควันเตาถ่าน',
      unknown: 'ไม่ทราบกลุ่มแน่ชัด'
    };
    const cList = Array.isArray(p.poisoningCategories) ? p.poisoningCategories : [];
    const catText = cList.length > 0 ? cList.map(k => catDict[k] || k).join(', ') : 'ไม่ได้ระบุกลุ่มสาร';

    // Timeline Summary
    const tLines = Array.isArray(p.poisoningTimeline) ? p.poisoningTimeline : [];
    let timelineText = '';
    if (p.poisoningTimeUnknown) {
      timelineText = 'ไม่ทราบเวลาที่ได้รับสารพิษแน่ชัด';
    } else if (tLines.length > 1) {
      timelineText = `ได้รับสารซ้ำหลายครั้ง (${tLines.length} รอบ): ` + tLines.map((t, idx) => `ครั้งที่ ${idx + 1} [${t.date || '-'} ${t.time || '-'}]`).join(', ');
    } else if (tLines.length === 1) {
      timelineText = `ครั้งที่ 1 เมื่อ [${tLines[0].date || '-'} เวลา ${tLines[0].time || '-'}]`;
    } else {
      timelineText = 'ไม่ได้ระบุเวลาแน่ชัด';
    }

    // First Aid Summary
    const faDict = {
      vomited: 'อาเจียนออกมาเองหลังได้รับสาร',
      induced: 'ล้วงคอให้อาเจียน/ดื่มน้ำนมไข่ดิบ (เป็นวิธีที่ผิด ไม่ควรทำ)',
      washed: 'ล้างตา/ล้างผิวหนังและเปลี่ยนเสื้อผ้าแล้ว',
      none: 'ยังไม่ได้ปฐมพยาบาลและยังไม่อาเจียน'
    };
    const faList = Array.isArray(p.poisoningFirstAid) ? p.poisoningFirstAid : [];
    const firstAidText = faList.length > 0 ? faList.map(k => faDict[k] || k).join(', ') : 'ไม่ได้ระบุ';

    // Container
    const contDict = {
      brought_container: 'นำซองยา/ขวดสารเคมีมาด้วย',
      photo_only: 'มีภาพถ่ายฉลากในโทรศัพท์มือถือ',
      none: 'ไม่ได้นำมาและไม่มีภาพถ่าย'
    };
    const containerText = contDict[p.poisoningContainerStatus] || 'ไม่ได้ระบุ';

    // Intent
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

    // Symptoms Dict
    const symDict = {
      oral_burn: 'แสบไหม้ในช่องปาก ลำคอ กลืนลำบาก',
      nausea_vomit_abdpain: 'คลื่นไส้ อาเจียน ปวดแสบท้อง',
      hematemesis_melena: 'อาเจียนเป็นเลือด ถ่ายอุจจาระสีดำ',
      stridor_hoarseness: 'เสียงแหบ หายใจมีเสียงดัง แน่นตีบในลำคอ',
      cough_soot: 'ไอสำลัก แสบจมูกคอ เสมหะปนเขม่าควันไฟ',
      skin_burn: 'ผิวหนังปวดแสบ แดง พุพอง',
      eye_burn: 'ปวดแสบตา ตาแดง ลืมตาไม่ขึ้น ตามัวลง',
      injection_site: 'ปวดบวมแดงร้อนรอยเข็มฉีด',
      drowsy_unconscious: 'ง่วงซึมมาก ปลุกตื่นยาก ไม่รู้สึกตัว',
      seizure: 'ชักเกร็ง กล้ามเนื้อกระตุก',
      confusion_agitation: 'สับสน กระสับกระส่าย พูดเพ้อ เห็นภาพหลอน',
      dyspnea_abnormal_resp: 'หายใจหอบเหนื่อย เร็วลึก หรือแผ่วช้า',
      salivation_secretions: 'น้ำลายฟูมปาก มีเสมหะในคอมากผิดปกติ',
      diaphoresis: 'เหงื่อแตกท่วมตัว',
      incontinence: 'ปัสสาวะหรืออุจจาระราด',
      dry_mouth_anhidrosis: 'ปากแห้งคอแห้งมาก ตัวร้อนผ่าวผิวแห้ง ปัสสาวะไม่ออก',
      blurred_vision: 'ตามัว มองเห็นภาพซ้อน ภาพมัวเหมือนมองผ่านหมอก',
      numbness_weakness: 'ชาตามรอบปาก ลิ้น ปลายมือปลายเท้า แขนขาอ่อนแรง',
      palpitations_syncope: 'ใจสั่น หัวใจเต้นผิดจังหวะ หน้ามืดคล้ายจะเป็นลม',
      dark_urine_jaundice: 'ปัสสาวะสีเข้มผิดปกติ ตัวเหลืองตาเหลือง',
      asymptomatic: 'ยังไม่มีอาการผิดปกติใดๆ ในขณะนี้'
    };

    const syms = Array.isArray(p.poisoningSymptoms) ? p.poisoningSymptoms : [];
    const positives = [];
    const negatives = [];

    Object.keys(symDict).forEach(k => {
      if (k === 'asymptomatic') return;
      if (syms.includes(k)) {
        positives.push(symDict[k]);
      } else {
        negatives.push(`ปฏิเสธ${symDict[k]}`);
      }
    });

    if (syms.includes('asymptomatic')) {
      positives.push('ยังไม่มีอาการผิดปกติใดๆ ในขณะนี้');
    }
    if (p.otherSymptomsFree && String(p.otherSymptomsFree).trim()) {
      positives.push(`ประวัติเพิ่มเติมจากผู้ป่วย: ${String(p.otherSymptomsFree).trim()}`);
    }

    // Set pertinentPositives for Patient Status View
    p.pertinentPositives = positives.length > 0 ? positives : ['ได้รับสารพิษ/ยาเกินขนาด (ยังไม่มีอาการผิดปกติชัดเจน)'];

    // Pain Score & Alcohol & Female LMP/Pregnancy
    const painStr = p.poisoningPainScoreVal !== null && p.poisoningPainScoreVal !== undefined
      ? `${p.poisoningPainScoreVal}/10`
      : 'ไม่ได้ระบุ';
    const alcoholText = p.poisoningAlcoholUsed === 'yes'
      ? `มีดื่มแอลกอฮอล์ร่วม (${p.poisoningAlcoholDetail || 'ไม่ระบุรายละเอียด'})`
      : p.poisoningAlcoholUsed === 'no' ? 'ปฏิเสธการดื่มแอลกอฮอล์' : 'ไม่ได้ระบุ';
    const isFemalePatient = p.gender === 'หญิง' || (typeof p.patientTitle === 'string' && isPoisoningPatientFemale(p.patientTitle));
    const femaleText = p.poisoningPregnancyStatus === 'pregnant'
      ? `กำลังตั้งครรภ์ (${p.poisoningPregnancyWeeks || '-'} สัปดาห์)`
      : p.poisoningPregnancyStatus === 'uncertain'
        ? 'ไม่แน่ใจว่าตั้งครรภ์'
        : p.poisoningPregnancyStatus === 'not_pregnant'
          ? 'ปฏิเสธการตั้งครรภ์'
          : 'ไม่ได้ระบุ';
    const femaleLine = isFemalePatient ? `\n• ประวัติสตรี: LMP ${p.poisoningLmpDate || 'ไม่ระบุ'}, ตั้งครรภ์: ${femaleText}` : '';
    const medsText = (!p.currentMeds || p.currentMeds === 'ไม่ได้ระบุ' || p.currentMeds === 'ไม่มี') ? 'ไม่มี' : p.currentMeds;
    const effectiveRfs = (Array.isArray(p.redFlags) && p.redFlags.length > 0) ? p.redFlags : this.evaluateRedFlags(p);
    const docNotes = p.doctor_notes || {};

    // 1. RAPID NOTE
    const rapidNote = `[Chief Complaint (CC)]
ได้รับสารพิษ / กินยาเกินขนาด เป็นมาประมาณ ${durStr}

[History of Present Illness (HPI)]
ผู้ป่วย [${p.name || 'ไม่ระบุชื่อ'}] ${p.gender || 'ไม่ระบุเพศ'} อายุ ${p.age !== undefined && p.age !== null ? p.age + ' ปี' : 'ไม่ระบุอายุ'} มา รพ. ด้วยอาการได้รับสารพิษหรือกินยาเกินขนาด เป็นมาประมาณ ${durStr}
• ผู้ให้ข้อมูล: ${informantText}
• ลำดับเวลาที่ได้รับสาร: ${timelineText}
• ช่องทางที่ได้รับสาร: ${routeText}
• รายการยา/สารพิษและปริมาณ: ${subText}
• กลุ่มยา/สารพิษ: ${catText}
• การปฐมพยาบาลเบื้องต้น: ${firstAidText}
• ภาชนะบรรจุ/ฉลาก: ${containerText}
• น้ำหนักตัวโดยประมาณ: ${p.poisoningWeightKg ? p.poisoningWeightKg + ' กก.' : 'ไม่ระบุ'}
• ลักษณะเหตุการณ์: ${intentText}
• การดื่มแอลกอฮอล์ร่วมด้วย: ${alcoholText}
• ระดับความปวด/แสบทรมาน: ${painStr}
• NPO Time: ${p.poisoningNpoTime ? p.poisoningNpoTime + ' น. (' + (p.poisoningNpoLastMeal || 'ไม่ระบุอาหาร') + ')' : 'ไม่ระบุ'}${femaleLine}

• Pertinent Positives:
${positives.length > 0 ? positives.map(s => `  - ${s}`).join('\n') : '  - ยังไม่มีอาการผิดปกติชัดเจนในขณะนี้'}

• Pertinent Negatives:
${negatives.slice(0, 10).map(s => `  - ${s}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• โรคประจำตัว (U/D): ${(p.underlying && p.underlying.length > 0) ? p.underlying.join(', ') : 'ปฏิเสธ'}
• ยาประจำตัว (Current Meds): ${medsText}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${p.drugAllergy || 'ปฏิเสธ'}

[Emergency Risk Assessment (Red Flags)]
${effectiveRfs.length > 0 ? `🚩 RED FLAGS DETECTED:\n${effectiveRfs.map(r => `  * ${r.textTh}`).join('\n')}` : '✓ ไม่พบสัญญาณวิกฤต (Low-Risk Exposure)'}
• ESI Triage Level: ESI ${p.esi_level || 3}

[Doctor's Clinical Addendum & Exam]
• ประวัติเพิ่มเติม/แก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}
• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}
• แผนการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

    // 2. NARRATIVE NOTE
    const narrativeNote = `ผู้ป่วย [${p.name || 'ไม่ระบุชื่อ'}] อายุ ${p.age !== undefined && p.age !== null ? p.age + ' ปี' : '-'} เพศ ${p.gender || 'ไม่ระบุ'} มารับการตรวจที่ห้องฉุกเฉิน รพ.ราชบุรี ด้วยอาการได้รับสารพิษหรือกินยาเกินขนาด เป็นมาประมาณ ${durStr} (ผู้ให้ข้อมูล: ${informantText})
ได้รับสารผ่านช่องทาง: ${routeText} รายการสารได้แก่ ${subText} (กลุ่มสาร: ${catText}) ${timelineText} ภายหลังเกิดเหตุได้รับการปฐมพยาบาลเบื้องต้นคือ ${firstAidText} สถานะฉลาก/ภาชนะ: ${containerText} เหตุการณ์เกิดจาก: ${intentText} ร่วมกับดื่มแอลกอฮอล์: ${alcoholText} น้ำหนักตัวโดยประมาณ ${p.poisoningWeightKg ? p.poisoningWeightKg + ' กก.' : 'ไม่ระบุ'} ระดับความปวด ${painStr} งดน้ำอาหารล่าสุด ${p.poisoningNpoTime ? p.poisoningNpoTime + ' น.' : 'ไม่ระบุ'}${isFemalePatient ? ` ประวัติสตรี LMP ${p.poisoningLmpDate || 'ไม่ระบุ'} (${femaleText})` : ''}

อาการสำคัญที่ตรวจพบ: ${positives.length > 0 ? positives.join(', ') : 'ยังไม่มีอาการผิดปกติชัดเจน'}
อาการสำคัญที่ปฏิเสธ: ${negatives.slice(0, 6).join(', ')}

ประวัติการเจ็บป่วยในอดีต: [${hospLabel}], โรคประจำตัว: ${(p.underlying && p.underlying.length > 0) ? p.underlying.join(', ') : 'ปฏิเสธ'}, ยาประจำตัว: ${medsText}, ประวัติแพ้ยา/แพ้อาหาร: ${p.drugAllergy || 'ปฏิเสธ'}${effectiveRfs.length > 0 ? `\n\n[🚩 แจ้งเตือนสัญญาณวิกฤต (Red Flags)]: ตรวจพบ ${effectiveRfs.map(r => r.textTh).join(', ')}` : ''}

[บันทึกการตรวจและการประเมินโดยแพทย์]:
${docNotes.additional_hpi ? `• ประวัติเพิ่มเติม: ${docNotes.additional_hpi}\n` : ''}${docNotes.physical_exam ? `• การตรวจร่างกาย: ${docNotes.physical_exam}\n` : ''}${docNotes.preliminary_dx ? `• การวินิจฉัย: ${docNotes.preliminary_dx}\n` : ''}${docNotes.plan ? `• แผนการรักษา: ${docNotes.plan}` : ''}`;

    // 3. JSON SCHEMA
    const jsonSchema = {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      encounter: {
        hospital_site: 'Ratchaburi Hospital',
        queue_id: p.queue_number || null,
        hn: p.hn || null,
        patient_name: p.name || null,
        age: p.age !== undefined ? p.age : null,
        gender: p.gender || null,
        chief_complaint: 'poisoning_overdose',
        duration_value: p.durationVal,
        duration_unit: p.durationUnit,
        timeline_summary: timelineText,
        staggered_exposure: tLines.length > 1,
        triage_urgency_flag: effectiveRfs.length > 0,
        hospital_record_status: p.hospRecordStatus || null
      },
      exposure_details: {
        informant: p.poisoningInformant,
        routes: p.poisoningRoutes,
        substances: p.poisoningSubstances,
        categories: p.poisoningCategories,
        first_aid: p.poisoningFirstAid,
        container_brought: p.poisoningContainerStatus,
        intent: p.poisoningIntent,
        suicide_active_risk: p.poisoningSuicideActiveRisk || null,
        alcohol_co_ingestion: p.poisoningAlcoholUsed === 'yes',
        alcohol_detail: p.poisoningAlcoholDetail || null,
        body_weight_kg: p.poisoningWeightKg,
        pain_score: p.poisoningPainScoreVal,
        npo_time: p.poisoningNpoTime || null,
        npo_last_meal: p.poisoningNpoLastMeal || null,
        female_lmp: isFemalePatient ? (p.poisoningLmpDate || null) : null,
        pregnancy_status: isFemalePatient ? (p.poisoningPregnancyStatus || null) : null
      },
      clinical_symptoms: {
        other_symptoms_free: p.otherSymptomsFree || '',
        pertinent_positives: positives,
        pertinent_negatives: negatives
      },
      red_flags: effectiveRfs.map(r => r.key),
      doctor_clinical_addendum: docNotes
    };

    // DOM Binding for Doctor View
    const rapidEl = document.getElementById('rapidTextView');
    if (rapidEl) {
      rapidEl.value = p.custom_rapid_note || rapidNote;
    }
    const narrativeEl = document.getElementById('narrativeTextView');
    if (narrativeEl) {
      narrativeEl.value = p.custom_narrative_note || narrativeNote;
    }
    const jsonEl = document.getElementById('jsonViewer');
    if (jsonEl) {
      jsonEl.textContent = JSON.stringify(jsonSchema, null, 2);
    }

    p.rapidHpi = p.custom_rapid_note || rapidNote;
    p.narrativeHpi = p.custom_narrative_note || narrativeNote;
    p.medicalJson = jsonSchema;

    return {
      rapid: rapidNote,
      narrative: narrativeNote,
      json: jsonSchema
    };
  },

  // -----------------------------------------------------------------------
  // BUILT-IN CLINICAL DECISION SUPPORT (CDS)
  // -----------------------------------------------------------------------
  generateCds: function(patient, ctx) {
    const p = patient || {};
    const cats = Array.isArray(p.poisoningCategories) ? p.poisoningCategories : [];
    const syms = Array.isArray(p.poisoningSymptoms) ? p.poisoningSymptoms : [];
    const routes = Array.isArray(p.poisoningRoutes) ? p.poisoningRoutes : [];
    const rfs = (ctx && Array.isArray(ctx.rfs)) ? ctx.rfs : this.evaluateRedFlags(p);

    const ddxLines = [];
    if (cats.includes('pesticides') || syms.includes('salivation_secretions')) {
      ddxLines.push('1. Acute Organophosphate / Carbamate Poisoning (ความน่าจะเป็นสูงมาก: 85%)', '2. Cholinergic Toxidrome from other anticholinesterase agents (15%)');
    } else if (cats.includes('corrosives') || syms.includes('oral_burn')) {
      ddxLines.push('1. Severe Caustic / Corrosive Ingestion with Chemical Burn (ความน่าจะเป็น: 90%)', '2. Upper gastrointestinal perforation / transmural necrosis (Rule out)');
    } else if (cats.includes('paracetamol')) {
      ddxLines.push('1. Acute or Staggered Paracetamol (Acetaminophen) Hepatotoxicity (ความน่าจะเป็น: 90%)', '2. Co-ingestion with other hidden antipyretic / sedatives');
    } else if (cats.includes('illicit_alcohol') || syms.includes('blurred_vision')) {
      ddxLines.push('1. Acute Methanol Toxicity / Toxic Alcohol Ingestion (ความน่าจะเป็นสูง: 80%)', '2. High Anion Gap Metabolic Acidosis');
    } else if (routes.includes('eye_contact')) {
      ddxLines.push('1. Chemical Ocular Burn (Corneal / Conjunctival burn) (ความน่าจะเป็น: 95%)');
    } else {
      ddxLines.push('1. Acute Poisoning / Drug Overdose (To be differentiated by toxidrome and lab) (70%)', '2. Unintentional Polypharmacy Adverse Reaction (30%)');
    }

    const workups = [
      '• Stat capillary blood glucose (DTX stat) & 12-lead EKG (monitor QRS/QTc duration)',
      '• CBC, Electrolytes, BUN, Cr, AST, ALT, Total Bilirubin, PT/INR, PTT',
      '• Venous or Arterial Blood Gas (VBG/ABG with Anion Gap and Lactate)'
    ];
    if (cats.includes('paracetamol') || p.poisoningTimeline?.length > 1) {
      workups.push('• Stat Serum Acetaminophen (Paracetamol) level (draw at >= 4 hours post-ingestion)');
    }
    if (cats.includes('illicit_alcohol') || syms.includes('blurred_vision')) {
      workups.push('• Serum Osmolality & calculated Osmolar Gap (suspected Methanol)');
    }
    if (routes.includes('inhalation') || syms.includes('dyspnea_abnormal_resp')) {
      workups.push('• Portable Chest X-ray (CXR) & SpO2 monitoring');
    }

    const managements = [];
    if (cats.includes('corrosives') || syms.includes('oral_burn')) {
      managements.push(
        '• **CONTRAINDICATION WARNING**: ห้ามใส่สาย NG ล้างท้อง และห้ามให้ผงถ่านกัมมันต์ (NO Activated Charcoal) โดยเด็ดขาด',
        '• Strict NPO, IV fluid resuscitation, Early airway evaluation',
        '• Consult GI specialist for urgent EGD within 12-24 hours'
      );
    } else if (cats.includes('pesticides') || syms.includes('salivation_secretions')) {
      managements.push(
        '• Dermal decontamination: ถอดเสื้อผ้า ล้างตัวด้วยสบู่และน้ำสะอาดอย่างทั่วถึง',
        '• Suction airway, Pre-oxygenate',
        '• **Antidote**: Atropine IV 2-4 mg every 5-10 min until lungs are clear (Atropinization)',
        '• **Antidote**: Pralidoxime (2-PAM) IV 1-2 g in 100 mL NSS over 30 min, then 500 mg/hr'
      );
    } else if (cats.includes('paracetamol')) {
      managements.push(
        '• Calculate toxic dose (mg/kg based on body weight)',
        '• **Antidote**: N-acetylcysteine (NAC) IV or Oral protocol immediately if high dose or staggered ingestion',
        '• Oral Activated charcoal 50g (if ingestion within 1-2 hours and airway intact)'
      );
    } else if (routes.includes('eye_contact')) {
      managements.push(
        '• Continuous eye irrigation with 0.9% NSS (at least 1-2 liters) until eye pH 7.0-7.4',
        '• Consult Ophthalmologist stat after irrigation'
      );
    } else {
      managements.push(
        '• Consider Activated Charcoal 50 g PO if ingested within 1-2 hours and patient alert',
        '• Continuous cardiac and SpO2 monitoring'
      );
    }
    if (p.poisoningIntent === 'intentional_self_harm') {
      managements.push('• **SAFETY**: 1:1 Close Suicide Precaution in ER, remove sharp objects, psychiatric consultation after medical stabilization');
    }

    if (ctx) {
      if (Array.isArray(ctx.ddxList)) ctx.ddxList.push(...ddxLines);
      if (Array.isArray(ctx.workupList)) ctx.workupList.push(...workups);
      if (Array.isArray(ctx.managementList)) ctx.managementList.push(...managements);
    }

    return `[PROVISIONAL_DDX]
${ddxLines.map(d => `• ${d}`).join('\n')}

**ภาวะวิกฤตที่ต้องเฝ้าระวังหรือ Rule out:**
${rfs.length > 0 ? rfs.map(r => `- 🚩 ${r.textTh}`).join('\n') : '- ภาวะแทรกซ้อนจากการดูดซึมยาและสารพิษล่าช้า (Delayed absorption/toxicity)'}

[ER_ORDERS]
2.1 Immediate Investigations & Triage Workup:
${workups.join('\n')}

2.2 Initial Management & Antidote Protocol:
${managements.join('\n')}`;
  }
});
