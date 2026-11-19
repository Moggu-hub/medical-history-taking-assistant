// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 06_headache.js
// อาการนำ: ปวดศีรษะ (Headache)
// ปรับปรุงตาม plan_headache.md, SKILL_PLAN_CC และ SKILL_CODE_CC (C-AP1 ถึง C-AP16)
// =========================================================================

let headachePainScoreTouched = false;

function toggleHeadacheBranch(id, show) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('hidden', !show);
}

function renderHeadacheCard(cfg) {
  const {
    kind = 'radio', id = '', name = '', value = '', title,
    desc = '', onchange = '', colSpan2 = false, compact = false, bgWhite = false
  } = cfg;
  const idAttr = id ? `id="${id}" ` : '';
  const nameAttr = name ? `name="${name}" ` : '';
  const valAttr = value ? `value="${value}" ` : '';
  const chgAttr = onchange ? `onchange="${onchange}" ` : '';
  const alignCls = desc ? 'items-start' : 'items-center';
  const padCls = compact ? 'p-2.5' : 'p-3';
  const bgCls = bgWhite ? 'bg-white ' : '';
  const spanCls = colSpan2 ? ' sm:col-span-2' : '';
  const roundCls = kind === 'checkbox' ? 'rounded ' : '';
  const topCls = desc ? 'mt-0.5 ' : '';
  const szCls = compact ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const bodyHtml = desc
    ? `<div class="ml-3"><span class="block text-xs sm:text-sm font-semibold text-slate-800">${title}</span><span class="block text-[11px] text-slate-500 font-normal mt-0.5">${desc}</span></div>`
    : `<span class="ml-3 ${compact ? 'text-xs' : 'text-xs sm:text-sm'} font-semibold text-slate-800">${title}</span>`;
  return `<label class="selectable-card ${bgCls}flex ${alignCls} ${padCls} rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition${spanCls}"><input type="${kind}" ${idAttr}${nameAttr}${valAttr}${chgAttr}class="${topCls}${roundCls}text-medical-600 focus:ring-medical-500 ${szCls} flex-shrink-0">${bodyHtml}</label>`;
}

function renderHeadacheGrid(colsCls, items, shared = {}) {
  return `<div class="grid ${colsCls} gap-2.5">${items.map(it => renderHeadacheCard({ ...shared, ...it })).join('\n')}</div>`;
}

function setHeadacheRadioChecked(name, val) {
  if (val === undefined || val === null || val === '') return;
  const el = document.querySelector(`input[name="${name}"][value="${val}"]`);
  if (el) el.checked = true;
}

function clearHeadacheRadioGroup(name) {
  document.querySelectorAll(`input[name="${name}"]`).forEach(el => {
    el.checked = false;
  });
}

function clearHeadacheCheckboxes(ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.checked = false;
  });
}

function getHeadacheRadioValue(name) {
  return document.querySelector(`input[name="${name}"]:checked`)?.value || '';
}

function isHeadacheFemaleTitle(arg) {
  if (typeof arg === 'boolean') return arg;
  if (typeof arg === 'object' && arg !== null) {
    if (typeof arg.isFemale === 'boolean') return arg.isFemale;
    if (typeof arg.title === 'string') return /นาง|น\.ส\.|ด\.ญ\.|หญิง|Mrs|Miss|Ms/i.test(arg.title);
  }
  if (typeof arg === 'string') return /นาง|น\.ส\.|ด\.ญ\.|หญิง|Mrs|Miss|Ms/i.test(arg);
  const pfx = document.getElementById('patientTitleSelect')?.value || '';
  return /นาง|น\.ส\.|ด\.ญ\.|หญิง|Mrs|Miss|Ms/i.test(pfx);
}

function syncHeadacheFemaleSection(explicitFemale) {
  const isFem = explicitFemale !== undefined ? Boolean(explicitFemale) : isHeadacheFemaleTitle();
  const sec = document.getElementById('headacheFemaleSection');
  if (sec) sec.classList.toggle('hidden', !isFem);
  if (!isFem) {
    clearHeadacheRadioGroup('headachePregnancyStatus');
    toggleHeadacheBranch('headachePregnancyWeeksWrap', false);
    clearHeadacheCheckboxes(['headache_fem_ocp', 'headache_fem_preeclampsia']);
    const wEl = document.getElementById('headachePregnancyWeeks');
    if (wEl) wEl.value = '';
    const lmpEl = document.getElementById('headacheLmpDate');
    if (lmpEl) lmpEl.value = '';
  }
}

function clearHeadachePainScore() {
  headachePainScoreTouched = false;
  const slider = document.getElementById('headachePainScore');
  if (slider) slider.value = 0;
  const emojiEl = document.getElementById('headachePainScoreEmoji');
  const textEl = document.getElementById('headachePainScoreText');
  const badgeEl = document.getElementById('headachePainScoreBadge');
  const clearBtn = document.getElementById('headachePainScoreClearBtn');
  if (emojiEl) emojiEl.textContent = '⚪';
  if (textEl) textEl.textContent = 'ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)';
  if (badgeEl) badgeEl.className = 'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all';
  if (clearBtn) clearBtn.classList.add('hidden');
  syncHeadacheFemaleSection();
}

function handleHeadachePainScoreChange(val) {
  headachePainScoreTouched = true;
  const num = parseInt(val, 10);
  const emojiEl = document.getElementById('headachePainScoreEmoji');
  const textEl = document.getElementById('headachePainScoreText');
  const badgeEl = document.getElementById('headachePainScoreBadge');
  const clearBtn = document.getElementById('headachePainScoreClearBtn');
  if (clearBtn) clearBtn.classList.remove('hidden');
  if (!emojiEl || !textEl || !badgeEl) return;

  let emoji = '😐';
  let label = 'ปวดปานกลาง';
  let badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';

  if (num === 0) {
    emoji = '😊';
    label = 'สบายดี (ไม่ปวดเลย)';
    badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  } else if (num <= 3) {
    emoji = '🙂';
    label = 'ปวดเล็กน้อย (ทนได้)';
    badgeClass = 'bg-lime-100 text-lime-800 border-lime-300';
  } else if (num <= 6) {
    emoji = '😐';
    label = 'ปวดปานกลาง (รบกวนสมาธิ)';
    badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
  } else if (num <= 9) {
    emoji = '😣';
    label = 'ปวดมาก (ทนแทบไม่ไหว)';
    badgeClass = 'bg-rose-100 text-rose-800 border-rose-300';
  } else {
    emoji = '😭';
    label = 'เจ็บปวดรุนแรงที่สุดในชีวิต';
    badgeClass = 'bg-red-200 text-red-900 border-red-400 animate-pulse';
  }

  emojiEl.textContent = emoji;
  textEl.textContent = `${num} / 10 (${label})`;
  badgeEl.className = `inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border transition ${badgeClass}`;
}

function setHeadachePainScore(score) {
  headachePainScoreTouched = true;
  const slider = document.getElementById('headachePainScore');
  if (slider) {
    slider.value = score;
    handleHeadachePainScoreChange(score);
  }
}

function handleHeadacheLocationChange() {
  const isUnilateral = document.getElementById('headache_loc_unilateral')?.checked || false;
  const isPeriorbital = document.getElementById('headache_loc_periorbital')?.checked || false;
  toggleHeadacheBranch('headache_unilateral_side_wrap', isUnilateral);
  toggleHeadacheBranch('headache_periorbital_side_wrap', isPeriorbital);
  if (!isUnilateral) clearHeadacheRadioGroup('headacheUnilateralSide');
  if (!isPeriorbital) clearHeadacheRadioGroup('headachePeriorbitalSide');
}

function handleHeadacheLocOtherToggle(checked) {
  toggleHeadacheBranch('headache_loc_other_wrap', checked);
  if (!checked) {
    const el = document.getElementById('headache_loc_other_text');
    if (el) el.value = '';
  }
}

function handleHeadacheTrigOtherToggle(checked) {
  toggleHeadacheBranch('headache_trig_other_wrap', checked);
  if (!checked) {
    const el = document.getElementById('headache_trig_other_text');
    if (el) el.value = '';
  }
}

function handleHeadacheVomitChange() {
  const hasVomit = document.getElementById('headache_has_nausea_vomit')?.checked || false;
  toggleHeadacheBranch('headache_vomit_detail_wrap', hasVomit);
  if (!hasVomit) clearHeadacheRadioGroup('headacheVomitStatus');
}

function handleHeadachePregnancyChange() {
  const val = getHeadacheRadioValue('headachePregnancyStatus');
  const showWeeks = val === 'pregnant';
  toggleHeadacheBranch('headachePregnancyWeeksWrap', showWeeks);
  if (!showWeeks) {
    const wEl = document.getElementById('headachePregnancyWeeks');
    if (wEl) wEl.value = '';
  }
}

function syncHeadacheCancerPmh() {
  const hasCancer = document.getElementById('headache_risk_cancer')?.checked || false;
  const udCancer = document.getElementById('ud_cancer');
  if (udCancer && hasCancer && !udCancer.checked) {
    udCancer.checked = true;
    toggleHeadacheBranch('cancer_type_wrap', true);
  }
}

// --- Lookup Tables (Thai Labels — Zero Raw Enum Leaks, C-AP14) ---
const HEADACHE_LABELS = {
  units: { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' },
  onset: {
    thunderclap: 'ปวดรุนแรงถึงขีดสุดทันทีใน 1–2 นาที (Thunderclap headache)',
    gradual: 'ค่อยๆ ปวดมากขึ้นเรื่อยๆ (Gradual onset)',
    chronic: 'ปวดตื้อๆ เป็นๆ หายๆ เรื้อรัง (Chronic recurrent)',
    pattern_change: 'ปวดเรื้อรังเดิมแต่ครั้งนี้เปลี่ยนรูปแบบไปชัดเจน',
    unspecified: 'ไม่ได้ระบุรูปแบบการเริ่ม'
  },
  onsetActivity: {
    resting_normal: 'เกิดขึ้นเองขณะพักหรือทำกิจวัตรปกติ',
    exertion_valsalva: 'เริ่มปวดขณะออกแรงหนัก ยกของ เบ่ง หรือมีเพศสัมพันธ์',
    sleep_awakening: 'ปวดตั้งแต่ตื่นนอน หรือปวดจนสะดุ้งตื่นกลางดึก',
    neck_trauma_manipulation: 'เริ่มปวดหลังสะบัดคอ บิดคอ หรือนวดดัดคอ',
    unspecified: 'ไม่ได้ระบุกิจกรรมขณะเริ่มปวด'
  },
  locs: {
    unilateral: 'ปวดขมับซีกเดียว',
    periorbital: 'ปวดรอบเบ้าตา',
    occipital: 'ปวดท้ายทอย/ต้นคอ',
    band: 'ปวดตึงรัดรอบศีรษะ',
    diffuse: 'ปวดทั่วทั้งศีรษะ',
    facial_sinus: 'ปวดหน้าผาก โหนกแก้ม หรือดั้งจมูก'
  },
  sides: {
    left: 'ข้างซ้าย',
    right: 'ข้างขวา',
    alternating: 'สลับข้างซ้าย-ขวา',
    both: 'ทั้งสองข้าง',
    none: ''
  },
  chars: {
    throbbing: 'ปวดตุ๊บๆ ตามจังหวะชีพจร',
    tight_dull: 'ปวดตึงๆ หนักๆ หรือบีบรัดแน่น',
    sharp_stabbing: 'ปวดเสียดแทงเหมือนถูกทิ่ม',
    burning_electric: 'ปวดแปล๊บคล้ายไฟช็อตหรือแสบร้อน',
    boring_severe: 'ปวดลึกๆ รุนแรง'
  },
  vomitStatus: {
    nausea_only: 'มีอาการคลื่นไส้ พะอืดพะอม (ยังไม่อาเจียน)',
    vomiting: 'มีอาการอาเจียนร่วมด้วย',
    projectile: 'มีอาการอาเจียนพุ่งรุนแรงทันทีโดยไม่คลื่นไส้นำมาก่อน',
    none: ''
  },
  pregnancy: {
    not_pregnant: 'ไม่ได้ตั้งครรภ์',
    pregnant: 'กำลังตั้งครรภ์',
    postpartum_6w: 'เพิ่งคลอดบุตรหรือแท้งบุตรภายใน 6 สัปดาห์',
    menopause_hysterectomy: 'วัยหมดประจำเดือนหรือผ่าตัดมดลูกแล้ว',
    unsure: 'ไม่แน่ใจสถานะการตั้งครรภ์',
    not_applicable: ''
  },
  hospStatus: {
    ratchaburi: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
    complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
    additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
    self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
    unspecified: 'ไม่ได้ระบุ'
  }
};

function evaluateHeadacheRedFlags(patient) {
  const redFlags = [];
  if (!patient) return redFlags;

  const isAcuteTimeframe = Boolean(
    patient.durationUnit === 'minutes' ||
    (patient.durationUnit === 'hours' && Number(patient.durationVal) <= 24)
  );
  const isSharpAcuteSevere = Boolean(
    Array.isArray(patient.headacheChars) &&
    patient.headacheChars.includes('sharp_stabbing') &&
    ((patient.headachePainScore !== null && patient.headachePainScore !== undefined && patient.headachePainScore >= 8) || isAcuteTimeframe)
  );

  if (
    patient.headacheOnsetMode === 'thunderclap' ||
    patient.headacheOnsetActivity === 'exertion_valsalva' ||
    patient.headacheOnsetActivity === 'neck_trauma_manipulation' ||
    isSharpAcuteSevere
  ) {
    redFlags.push({
      key: 'thunderclap_sah_rcvs',
      textTh: 'ปวดรุนแรงเฉียบพลันใน 1–2 นาที / ปวดขณะออกแรงเบ่ง / หลังสะบัดคอ (Suspected SAH / RCVS / Cervical Dissection)',
      risk: 'เสี่ยงภาวะเลือดออกใต้เยื่อหุ้มสมองจากหลอดเลือดโป่งพองแตก (Aneurysmal SAH), RCVS หรือหลอดเลือดแดงคอฉีกขาด ต้องประเมิน STAT Non-contrast CT Brain ทันที'
    });
  }

  const hasFever = Boolean(patient.headache_rf_fever ?? patient.headache_rf_fever_stiff_neck);
  const hasStiffNeck = Boolean(patient.headache_rf_stiff_neck ?? patient.headache_rf_fever_stiff_neck);
  if (hasFever && hasStiffNeck) {
    redFlags.push({
      key: 'meningitis_encephalitis',
      textTh: 'มีไข้ร่วมกับคอแข็งเกร็ง ก้มไม่ลง (Suspected Meningitis / Encephalitis)',
      risk: 'เสี่ยงภาวะเยื่อหุ้มสมองอักเสบติดเชื้อเฉียบพลัน ต้องเตรียมส่งตรวจเลือด/น้ำไขสันหลังและให้ยาปฏิชีวนะทางหลอดเลือดดำโดยเร็ว'
    });
  } else if (hasStiffNeck) {
    redFlags.push({
      key: 'nuchal_rigidity_meningismus',
      textTh: 'คอแข็งเกร็ง ก้มไม่ลง (Nuchal Rigidity / Meningismus)',
      risk: 'เสี่ยงภาวะระคายเคืองเยื่อหุ้มสมอง เช่น เลือดออกใต้เยื่อหุ้มสมอง (SAH) หรือระยะเริ่มต้นของการติดเชื้อในระบบประสาทส่วนกลาง'
    });
  } else if (hasFever) {
    redFlags.push({
      key: 'fever_with_headache',
      textTh: 'มีไข้หรือหนาวสั่นร่วมกับปวดศีรษะ (Fever with Headache)',
      risk: 'เสี่ยงต่อการติดเชื้อในระบบประสาทส่วนกลาง (CNS Infection) หรือภาวะติดเชื้อในกระแสเลือด (Sepsis)'
    });
  }

  if (
    patient.headache_rf_weakness_numb ||
    patient.headache_rf_facial_speech ||
    patient.headache_rf_ataxia_walk ||
    patient.headache_rf_seizure_syncope ||
    patient.headache_rf_altered_mental
  ) {
    redFlags.push({
      key: 'neurological_deficit_cns_event',
      textTh: 'มีอาการผิดปกติทางระบบประสาทเฉพาะที่ ชัก หรือระดับความรู้สึกตัวเปลี่ยนแปลง (Focal Deficit / Seizure / Altered Mental Status)',
      risk: 'เสี่ยงภาวะหลอดเลือดสมอง (Stroke / ICH), ก้อนเนื้อในสมอง หรือภาวะความดันในกะโหลกศีรษะสูงวิกฤต ต้องส่งตรวจภาพสมองเร่งด่วน'
    });
  }

  if (patient.headache_rf_acute_glaucoma || patient.headache_rf_diplopia_field) {
    redFlags.push({
      key: 'acute_glaucoma_visual_threat',
      textTh: 'ตาแดง ปวดเบ้าตารุนแรง ตามัวเฉียบพลัน เห็นรุ้งรอบไฟ หรือเห็นภาพซ้อน (Acute Glaucoma / Visual-Threatening Emergency)',
      risk: 'เสี่ยงภาวะต้อหินมุมปิดเฉียบพลันหรือความผิดปกติของเส้นประสาทสมอง ซึ่งเสี่ยงต่อการสูญเสียการมองเห็นถาวร ต้องตรวจวัดความดันลูกตาและปรึกษาจักษุแพทย์ทันที'
    });
  }

  if (
    patient.headacheVomitStatus === 'projectile' ||
    patient.headache_trig_valsalva ||
    patient.headache_trig_supine_morning ||
    patient.headacheOnsetActivity === 'sleep_awakening'
  ) {
    redFlags.push({
      key: 'raised_intracranial_pressure',
      textTh: 'อาเจียนพุ่งรุนแรง / ปวดมากขึ้นเมื่อไอเบ่งหรือนอนราบ / ปวดจนตื่นกลางดึก (Suspected Raised ICP)',
      risk: 'เสี่ยงภาวะความดันในกะโหลกศีรษะสูงผิดปกติ หรือรอยโรคกินเนื้อที่ในสมอง (Brain Mass / Hydrocephalus)'
    });
  }

  const isAge50Plus = Number(patient.age) >= 50;
  const isGcaAge50Risk = Boolean(
    isAge50Plus &&
    (patient.headache_risk_new_onset_age50 || patient.headacheOnsetMode === 'pattern_change' || patient.headacheOnsetMode === 'thunderclap')
  );
  if (patient.headache_trig_jaw_claudication || patient.headache_trig_scalp_tenderness || isGcaAge50Risk) {
    redFlags.push({
      key: 'giant_cell_arteritis',
      textTh: 'ปวดเคี้ยวอาหาร / เจ็บหนังศีรษะเวลาหวีผม / อายุ ≥ 50 ปีเริ่มปวดแบบใหม่ (Suspected Giant Cell Arteritis)',
      risk: 'เสี่ยงภาวะหลอดเลือดแดงขมับอักเสบ (Temporal Arteritis) หรือความผิดปกติใหม่ในสมอง ต้องส่งตรวจ ESR/CRP และประเมินภาพสมองเพื่อป้องกันการสูญเสียการมองเห็น'
    });
  }

  const isFemale = patient.gender === 'หญิง';
  const isPregPostpartum = Boolean(
    patient.headache_risk_pregnancy_postpartum ||
    (isFemale && (patient.headachePregnancyStatus === 'pregnant' || patient.headachePregnancyStatus === 'postpartum_6w'))
  );
  const hasSevereFemaleOcpRisk = Boolean(
    isFemale &&
    patient.headache_fem_ocp &&
    (patient.headacheOnsetMode === 'thunderclap' ||
      patient.headacheOnsetMode === 'pattern_change' ||
      (patient.headachePainScore !== null && patient.headachePainScore >= 8))
  );
  if (isPregPostpartum || (isFemale && patient.headache_fem_preeclampsia) || hasSevereFemaleOcpRisk) {
    redFlags.push({
      key: 'pregnancy_postpartum_cvst_eclampsia',
      textTh: 'ปวดศีรษะในผู้ป่วยตั้งครรภ์/หลังคลอด 6 สัปดาห์ หรือเสี่ยงลิ่มเลือดดำสมอง/ครรภ์เป็นพิษ (CVST / Preeclampsia Risk)',
      risk: 'ต้องเฝ้าระวังภาวะครรภ์เป็นพิษ (Preeclampsia/Eclampsia) และลิ่มเลือดดำในสมองอุดตัน (Cerebral Venous Sinus Thrombosis) ตรวจวัดความดันโลหิตและโปรตีนในปัสสาวะทันที'
    });
  }

  if (
    patient.headache_risk_recent_trauma ||
    patient.headache_risk_cancer ||
    patient.headache_risk_immunocompromised ||
    patient.headache_risk_anticoagulants ||
    patient.headacheOnsetMode === 'pattern_change'
  ) {
    redFlags.push({
      key: 'high_risk_secondary_headache',
      textTh: 'ประวัติเสี่ยงสูง: อุบัติเหตุศีรษะ 3 เดือน / ทานยาต้านการแข็งตัวของเลือด / มะเร็ง / ภูมิคุ้มกันบกพร่อง / ปวดเปลี่ยนรูปแบบ',
      risk: 'เสี่ยงภาวะเลือดออกใต้เยื่อหุ้มสมองเรื้อรัง (Subdural Hematoma), การแพร่กระจายสู่สมอง, ฝีในสมอง หรือรอยโรคโครงสร้างสมอง'
    });
  }

  if (patient.headache_risk_co_exposure) {
    redFlags.push({
      key: 'suspected_co_poisoning',
      textTh: 'ประวัติสูดดมควันในที่อับอากาศ หรือคนใกล้ชิดปวดศีรษะพร้อมกัน (Suspected CO Poisoning)',
      risk: 'เสี่ยงภาวะพิษจากก๊าซคาร์บอนมอนอกไซด์ ต้องให้ออกซิเจน 100% High-flow ทันทีและเจาะตรวจระดับ Carboxyhemoglobin'
    });
  }

  if (patient.headache_risk_severe_htn) {
    redFlags.push({
      key: 'hypertensive_crisis_headache',
      textTh: 'ความดันโลหิตสูงมากผิดปกติร่วมกับปวดศีรษะ (Suspected Hypertensive Emergency / PRES)',
      risk: 'เสี่ยงภาวะความดันโลหิตสูงวิกฤตทำลายอวัยวะเป้าหมาย (Hypertensive Encephalopathy / Intracerebral Hemorrhage) วัดความดันซ้ำและตรวจระบบประสาททันที'
    });
  }

  return redFlags;
}

function updateHeadacheOutputs(patient) {
  const durationText = patient.durationVal
    ? `${patient.durationVal} ${HEADACHE_LABELS.units[patient.durationUnit] || 'ชั่วโมง'}`
    : 'ไม่ระบุระยะเวลา';

  const painScoreText = (patient.headachePainScore !== null && patient.headachePainScore !== undefined)
    ? `${patient.headachePainScore}/10`
    : 'ไม่ได้ระบุระดับความปวด';

  const onsetStr = HEADACHE_LABELS.onset[patient.headacheOnsetMode] || 'ไม่ได้ระบุรูปแบบการเริ่ม';
  const activityStr = HEADACHE_LABELS.onsetActivity[patient.headacheOnsetActivity] || 'ไม่ได้ระบุกิจกรรมขณะเริ่มปวด';

  const locations = [];
  (patient.headacheLocs || []).forEach(l => {
    if (l === 'unilateral') {
      const side = HEADACHE_LABELS.sides[patient.headacheUnilateralSide] || '';
      locations.push(`ปวดขมับซีกเดียว${side ? ` (${side})` : ''}`);
    } else if (l === 'periorbital') {
      const side = HEADACHE_LABELS.sides[patient.headachePeriorbitalSide] || '';
      locations.push(`ปวดรอบเบ้าตา${side ? ` (${side})` : ''}`);
    } else if (HEADACHE_LABELS.locs[l]) {
      locations.push(HEADACHE_LABELS.locs[l]);
    } else if (typeof l === 'string' && l.startsWith('อื่นๆ:')) {
      locations.push(l);
    }
  });
  if (patient.headacheLocOther && !locations.some(l => l.includes(patient.headacheLocOther))) {
    locations.push(`ตำแหน่งอื่นๆ (${patient.headacheLocOther})`);
  }
  const locationsText = locations.length > 0 ? locations.join(', ') : 'ไม่ได้ระบุตำแหน่งชัดเจน';

  const chars = (patient.headacheChars || []).map(c => HEADACHE_LABELS.chars[c] || c);
  const charsText = chars.length > 0 ? chars.join(', ') : 'ไม่ได้ระบุลักษณะอาการปวด';

  const triggers = [];
  if (patient.headache_trig_valsalva) triggers.push('ปวดมากขึ้นเวลาไอ จาม เบ่ง หรือก้มศีรษะ');
  if (patient.headache_trig_supine_morning) triggers.push('ปวดมากขึ้นเวลานอนราบ');
  if (patient.headache_trig_upright) triggers.push('ปวดมากขึ้นเวลาลุกนั่งหรือยืน และดีขึ้นเมื่อนอนราบ');
  if (patient.headache_trig_jaw_claudication) triggers.push('ปวดหรือเมื่อยขากรรไกรเวลาเคี้ยวอาหาร');
  if (patient.headache_trig_scalp_tenderness) triggers.push('เจ็บหนังศีรษะหรือขมับเวลาหวีผมหรือแตะโดน');
  if (patient.headache_trig_light_sound) triggers.push('ปวดมากขึ้นเมื่อเจอแสงจ้า เสียงดัง หรือกลิ่นฉุน');
  if (patient.headache_trig_stress_fatigue) triggers.push('สัมพันธ์กับการอดนอน ความเครียด หรือใช้สายตานาน');
  if (patient.headache_trig_other) triggers.push(`สิ่งกระตุ้นอื่นๆ (${patient.headache_trig_other})`);
  const triggersText = triggers.length > 0 ? triggers.join(', ') : 'ไม่ได้ระบุ';

  const positives = [];
  const negatives = [];
  const hasFever = Boolean(patient.headache_rf_fever ?? patient.headache_rf_fever_stiff_neck);
  const hasStiffNeck = Boolean(patient.headache_rf_stiff_neck ?? patient.headache_rf_fever_stiff_neck);
  const anyHeadacheAssoc = Boolean(
    patient.headache_rf_weakness_numb || patient.headache_rf_facial_speech || patient.headache_rf_ataxia_walk ||
    patient.headache_rf_seizure_syncope || patient.headache_rf_altered_mental || hasFever || hasStiffNeck ||
    patient.headache_rf_acute_glaucoma || patient.headache_rf_diplopia_field || patient.headache_has_visual_aura ||
    patient.headache_has_autonomic || patient.headache_has_nausea_vomit || patient.headache_risk_new_onset_age50 ||
    patient.headache_risk_recent_trauma || patient.headache_risk_anticoagulants || patient.headache_risk_cancer ||
    patient.headache_risk_immunocompromised || patient.headache_risk_co_exposure ||
    patient.headache_risk_severe_htn || patient.headache_risk_med_overuse
  );

  if (patient.headache_rf_weakness_numb) positives.push('มีอาการแขนขาอ่อนแรงหรือชาครึ่งซีก');
  else if (anyHeadacheAssoc) negatives.push('ไม่มีแขนขาอ่อนแรงหรือชาครึ่งซีก');

  if (patient.headache_rf_facial_speech) positives.push('มีอาการปากเบี้ยวหรือพูดไม่ชัด');
  else if (anyHeadacheAssoc) negatives.push('ไม่มีปากเบี้ยวหรือพูดไม่ชัด');

  if (patient.headache_rf_ataxia_walk) positives.push('เดินเซหรือหยิบของไม่ถนัด');
  else if (anyHeadacheAssoc) negatives.push('ไม่มีอาการเดินเซ สามารถทรงตัวได้ปกติ');

  if (patient.headache_rf_seizure_syncope) positives.push('มีอาการชักเกร็งหรือวูบหมดสติร่วมด้วย');
  else if (anyHeadacheAssoc) negatives.push('ไม่มีอาการชักเกร็งหรือวูบหมดสติ');

  if (patient.headache_rf_altered_mental) positives.push('ง่วงซึม สับสน หรือพฤติกรรมเปลี่ยนแปลง');
  else if (anyHeadacheAssoc) negatives.push('รู้สึกตัวดี ไม่ซึมไม่สับสน');

  if (hasStiffNeck) positives.push('คอแข็งเกร็ง ก้มไม่ลง');
  else if (anyHeadacheAssoc) negatives.push('ไม่มีคอแข็งเกร็ง ก้มคอได้ปกติ');

  if (hasFever) positives.push('มีไข้หรือหนาวสั่นร่วมด้วย');
  else if (anyHeadacheAssoc) negatives.push('ไม่มีไข้หรือหนาวสั่น');

  if (patient.headache_rf_acute_glaucoma) positives.push('ตาแดง ปวดเบ้าตารุนแรง ตามัวลงทันที หรือเห็นรุ้งรอบไฟ');
  else if (anyHeadacheAssoc) negatives.push('ไม่มีตาแดง ปวดเบ้าตารุนแรง หรือตามัวฉับพลัน');

  if (patient.headache_rf_diplopia_field) positives.push('มองเห็นภาพซ้อนหรือลานสายตามืดไปบางส่วน');
  else if (anyHeadacheAssoc) negatives.push('ไม่มีภาพซ้อนหรือลานสายตาแคบลง');

  if (patient.headache_has_visual_aura) positives.push('เห็นแสงวูบวาบหรือเส้นซิกแซกนำมาก่อนปวดศีรษะ (Visual Aura)');
  else if (anyHeadacheAssoc) negatives.push('ไม่มีอาการแสงวูบวาบนำมาก่อน');

  if (patient.headache_has_autonomic) positives.push('มีอาการตาแดง น้ำตาไหล หนังตาตก หรือคัดจมูกข้างเดียวกับที่ปวด (Cranial autonomic)');
  else if (anyHeadacheAssoc) negatives.push('ไม่มีน้ำตาไหล ตาแดง หรือคัดจมูกข้างเดียวกับที่ปวด');

  if (patient.headache_has_nausea_vomit) {
    positives.push(HEADACHE_LABELS.vomitStatus[patient.headacheVomitStatus] || 'มีอาการคลื่นไส้หรืออาเจียนร่วมด้วย');
  } else if (anyHeadacheAssoc) {
    negatives.push('ไม่มีคลื่นไส้หรืออาเจียน');
  }

  if (patient.headache_risk_new_onset_age50) positives.push('เพิ่งเคยปวดศีรษะรุนแรงลักษณะนี้เป็นครั้งแรกในชีวิต');
  if (patient.headache_risk_recent_trauma) positives.push('มีประวัติศีรษะกระแทก หกล้ม หรืออุบัติเหตุภายใน 3 เดือน');
  else if (anyHeadacheAssoc) negatives.push('ปฏิเสธประวัติอุบัติเหตุศีรษะใน 3 เดือนที่ผ่านมา');

  if (patient.headache_risk_anticoagulants) positives.push('รับประทานยาละลายลิ่มเลือดหรือยาต้านเกล็ดเลือดอยู่ประจำ');
  if (patient.headache_risk_cancer) positives.push('มีประวัติโรคมะเร็ง');
  if (patient.headache_risk_immunocompromised) positives.push('มีภาวะภูมิคุ้มกันบกพร่องหรือทานยากดภูมิ');
  if (patient.headache_risk_co_exposure) positives.push('สูดดมควันในที่อับอากาศหรือมีคนใกล้ชิดปวดศีรษะพร้อมกัน');
  if (patient.headache_risk_severe_htn) positives.push('ความดันโลหิตสูงมากผิดปกติก่อนมาโรงพยาบาล');
  if (patient.headache_risk_med_overuse) positives.push('รับประทานยาแก้ปวดบ่อยเกือบทุกวันติดต่อกันนาน (MOH risk)');

  if (patient.otherSymptomsFree && String(patient.otherSymptomsFree).trim()) {
    positives.push(`ผู้ป่วยแจ้งอาการเพิ่มเติม: "${String(patient.otherSymptomsFree).trim()}"`);
  }

  if (positives.length === 0) {
    if (locations.length > 0 || (patient.headachePainScore !== null && patient.headachePainScore !== undefined)) {
      positives.push(`ปวดศีรษะ (${locationsText}, ระดับ ${painScoreText})`);
    } else {
      positives.push('ผู้ป่วยไม่ได้ระบุอาการร่วมเพิ่มเติม');
    }
  }

  patient.pertinentPositives = positives;
  patient.pertinentNegatives = negatives.length > 0 ? negatives : ['ผู้ป่วยไม่ได้ระบุคำตอบยืนยันในหมวดอาการร่วม'];

  const isFemale = patient.gender === 'หญิง';
  let femaleLine = '';
  let femaleStr = '';
  if (isFemale && ((patient.headachePregnancyStatus && patient.headachePregnancyStatus !== 'not_applicable') || patient.headacheLmpDate || patient.headache_fem_ocp || patient.headache_fem_preeclampsia)) {
    const pregText = HEADACHE_LABELS.pregnancy[patient.headachePregnancyStatus] || 'ไม่ได้ระบุสถานะการตั้งครรภ์';
    const gaText = (patient.headachePregnancyStatus === 'pregnant' && patient.headachePregnancyWeeks) ? ` (GA ${patient.headachePregnancyWeeks})` : '';
    const lmpText = patient.headacheLmpDate ? `, LMP ${patient.headacheLmpDate}` : '';
    const extraFem = [];
    if (patient.headache_fem_ocp) extraFem.push('ใช้ยาคุมกำเนิด/ฮอร์โมน');
    if (patient.headache_fem_preeclampsia) extraFem.push('เคยมีประวัติครรภ์เป็นพิษ');
    femaleStr = `${pregText}${gaText}${lmpText}${extraFem.length > 0 ? `, ${extraFem.join(', ')}` : ''}`;
    femaleLine = `\n• ประวัติสตรี: ${femaleStr}`;
  }

  const hospLabel = HEADACHE_LABELS.hospStatus[patient.hospRecordStatus] || 'ไม่ได้ระบุ';
  const docNotes = patient.doctor_notes || {};
  const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ') ? 'ไม่ได้ระบุ' : patient.currentMeds;
  const udArr = Array.isArray(patient.underlying) ? patient.underlying.filter(u => u && !u.includes('ปฏิเสธ') && u !== 'ไม่มี' && u !== 'ไม่มีโรคประจำตัว') : [];
  const udExplicitDeny = Array.isArray(patient.underlying) && patient.underlying.some(u => u && u.includes('ปฏิเสธ'));
  const udList = udArr.length > 0 ? udArr.join(', ') : ((patient.hospRecordStatus === 'self' || patient.hospRecordStatus === 'additional' || udExplicitDeny) ? 'ปฏิเสธ' : 'ไม่ได้ระบุ');
  const allergyText = (!patient.drugAllergy || patient.drugAllergy === 'ไม่ได้ระบุ') ? 'ไม่ได้ระบุ' : patient.drugAllergy;
  const effectiveRfs = Array.isArray(patient.redFlags) ? patient.redFlags : evaluateHeadacheRedFlags(patient);

  const defaultRapid =
`[Chief Complaint (CC)]
ปวดศีรษะ (Headache) มา ${durationText}

[History of Present Illness (HPI)]
• การเริ่มต้นและระยะเวลา: ${durationText}, ${onsetStr}
• กิจกรรมขณะเริ่มปวด: ${activityStr}
• ระดับความเจ็บปวด (Pain Score): ${painScoreText}
• ตำแหน่งที่ปวด: ${locationsText}
• ลักษณะอาการปวด: ${charsText}
• ปัจจัยกระตุ้นและท่าทาง: ${triggersText}${femaleLine}

• Pertinent Positives:
${positives.map(p => `  - ${p}`).join('\n')}

• Pertinent Negatives:
${patient.pertinentNegatives.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• โรคประจำตัว (U/D): ${udList}
• ยาประจำตัว (Current Meds): ${medsText}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${allergyText}

[Emergency Risk Assessment (Red Flags)]
${effectiveRfs.length > 0
  ? `🚩 RED FLAGS DETECTED:\n${effectiveRfs.map(rf => `  * ${rf.textTh}`).join('\n')}`
  : '✓ ไม่พบสัญญาณเตือนวิกฤตเฉียบพลันเบื้องต้น'}

[Doctor's Clinical Addendum & Exam]
• ประวัติเพิ่มเติม/แก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}
• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}
• แผนการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

  const defaultNarrative =
`ผู้ป่วย [${patient.name || 'ไม่ระบุชื่อ'}] อายุ ${patient.age || '-'} ปี เพศ ${patient.gender || 'ไม่ระบุ'} มารับการตรวจที่ห้องฉุกเฉิน รพ.ราชบุรี ด้วยอาการปวดศีรษะมา ${durationText} ระดับความเจ็บปวดสูงสุด ${painScoreText}
การเริ่มมีอาการ: [${onsetStr}] ขณะเกิดเหตุ: [${activityStr}] ตำแหน่งที่ปวด: [${locationsText}] ลักษณะความรู้สึกปวด: [${charsText}] ปัจจัยกระตุ้นและท่าทาง: [${triggersText}]${femaleStr ? ` ประวัติสตรี: [${femaleStr}]` : ''}
อาการร่วมสำคัญที่พบ: ${positives.join(', ')}
อาการสำคัญที่ปฏิเสธ: ${patient.pertinentNegatives.join(', ')}
ประวัติการเจ็บป่วยในอดีต: [${hospLabel}], โรคประจำตัว: ${udList}, ยาประจำตัว: ${medsText}, แพ้ยา: ${allergyText}${effectiveRfs.length > 0 ? `\n[🚩 แจ้งเตือนสัญญาณวิกฤต (Red Flags)]: ${effectiveRfs.map(rf => rf.textTh).join('; ')}` : ''}

[บันทึกการตรวจและการประเมินโดยแพทย์]:
${docNotes.additional_hpi ? `• ประวัติเพิ่มเติม: ${docNotes.additional_hpi}\n` : ''}${docNotes.physical_exam ? `• การตรวจร่างกาย: ${docNotes.physical_exam}\n` : ''}${docNotes.preliminary_dx ? `• การวินิจฉัย: ${docNotes.preliminary_dx}\n` : ''}${docNotes.plan ? `• แผนการรักษา: ${docNotes.plan}` : ''}`;

  const jsonPayload = {
    '$schema': 'https://json-schema.org/draft/2020-12/schema',
    encounter: {
      hospital_site: 'Ratchaburi Hospital',
      queue_id: patient.queue_number || null,
      hn: patient.hn || null,
      patient_name: patient.name || null,
      age: patient.age !== undefined ? patient.age : null,
      gender: patient.gender || null,
      timestamp: patient.timestamp || null,
      status: patient.status || null,
      triage_urgency_flag: effectiveRfs.length > 0,
      red_flags_count: effectiveRfs.length,
      hospital_record_status: patient.hospRecordStatus || null
    },
    chief_complaint: 'headache',
    headache_history: {
      duration_value: patient.durationVal || null,
      duration_unit: patient.durationUnit || null,
      onset_mode: patient.headacheOnsetMode || 'unspecified',
      onset_activity: patient.headacheOnsetActivity || 'unspecified',
      pain_score: patient.headachePainScore !== undefined ? patient.headachePainScore : null,
      locations: {
        selected_locations: patient.headacheLocs || [],
        unilateral_side: patient.headacheUnilateralSide || 'none',
        periorbital_side: patient.headachePeriorbitalSide || 'none',
        other_location: patient.headacheLocOther || ''
      },
      characteristics: patient.headacheChars || [],
      triggers: {
        valsalva_or_cough: Boolean(patient.headache_trig_valsalva),
        supine_worsening: Boolean(patient.headache_trig_supine_morning),
        upright_orthostatic: Boolean(patient.headache_trig_upright),
        jaw_claudication: Boolean(patient.headache_trig_jaw_claudication),
        scalp_tenderness: Boolean(patient.headache_trig_scalp_tenderness),
        light_or_sound: Boolean(patient.headache_trig_light_sound),
        stress_or_fatigue: Boolean(patient.headache_trig_stress_fatigue),
        other: patient.headache_trig_other || ''
      }
    },
    neurological_and_ocular_warning_signs: {
      focal_weakness_or_numbness: Boolean(patient.headache_rf_weakness_numb),
      facial_droop_or_speech_deficit: Boolean(patient.headache_rf_facial_speech),
      ataxia_or_incoordination: Boolean(patient.headache_rf_ataxia_walk),
      seizure_or_syncope: Boolean(patient.headache_rf_seizure_syncope),
      altered_mental_status: Boolean(patient.headache_rf_altered_mental),
      high_fever_or_chills: hasFever,
      nuchal_rigidity_stiff_neck: hasStiffNeck,
      fever_with_stiff_neck: hasFever && hasStiffNeck,
      acute_glaucoma_signs: Boolean(patient.headache_rf_acute_glaucoma),
      diplopia_or_visual_field_loss: Boolean(patient.headache_rf_diplopia_field),
      visual_aura: Boolean(patient.headache_has_visual_aura),
      cranial_autonomic_symptoms: Boolean(patient.headache_has_autonomic)
    },
    associated_symptoms_and_high_risk_background: {
      nausea_and_vomiting: {
        present: Boolean(patient.headache_has_nausea_vomit),
        status: patient.headacheVomitStatus || 'none'
      },
      first_lifetime_severe_headache: Boolean(patient.headache_risk_new_onset_age50),
      recent_head_trauma_within_3_months: Boolean(patient.headache_risk_recent_trauma),
      anticoagulant_or_antiplatelet_use: Boolean(patient.headache_risk_anticoagulants),
      cancer_history: Boolean(patient.headache_risk_cancer),
      immunocompromised: Boolean(patient.headache_risk_immunocompromised),
      co_poisoning_exposure: Boolean(patient.headache_risk_co_exposure),
      severe_hypertension_screen: Boolean(patient.headache_risk_severe_htn),
      medication_overuse: Boolean(patient.headache_risk_med_overuse),
      other_symptoms_free_text: patient.otherSymptomsFree || ''
    },
    female_reproductive_history: isFemale ? {
      pregnancy_status: patient.headachePregnancyStatus || 'not_applicable',
      gestational_age_weeks: patient.headachePregnancyWeeks || '',
      ocp_or_hormone_use: Boolean(patient.headache_fem_ocp),
      preeclampsia_history: Boolean(patient.headache_fem_preeclampsia),
      lmp_date: patient.headacheLmpDate || ''
    } : null,
    red_flags_detected: effectiveRfs.map(rf => ({ code: rf.key, label: rf.textTh, clinical_risk: rf.risk })),
    pertinent_positives: positives,
    pertinent_negatives: negatives,
    patient_background: {
      hospital_record_status: patient.hospRecordStatus || null,
      underlying_diseases: patient.underlying,
      drug_and_food_allergies: allergyText,
      current_medications: medsText
    },
    doctor_clinical_addendum: {
      additional_or_corrected_history: docNotes.additional_hpi || '',
      vitals_and_physical_exam: docNotes.physical_exam || '',
      provisional_diagnosis: docNotes.preliminary_dx || '',
      treatment_plan: docNotes.plan || ''
    }
  };

  const finalRapid = patient.custom_rapid_note || defaultRapid;
  const finalNarrative = patient.custom_narrative_note || defaultNarrative;
  patient.rapidHpi = finalRapid;
  patient.narrativeHpi = finalNarrative;
  patient.medicalJson = jsonPayload;

  const rapidEl = document.getElementById('rapidTextView');
  const narrEl = document.getElementById('narrativeTextView');
  const jsonEl = document.getElementById('jsonViewer');
  if (rapidEl) rapidEl.value = finalRapid;
  if (narrEl) narrEl.value = finalNarrative;
  if (jsonEl) jsonEl.textContent = JSON.stringify(jsonPayload, null, 2);

  return { rapid: finalRapid, narrative: finalNarrative, json: jsonPayload };
}

// --- Build Form HTML cleanly using C-AP1 / C-AP16 compliant templates ---
const HEADACHE_CARD1_HTML = `
<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
  <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
    <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="clock" class="w-5 h-5"></i></div>
    <div>
      <h2 class="text-base font-bold text-slate-900">1. ระยะเวลา รูปแบบการเริ่มปวด กิจกรรมขณะเริ่มปวด และระดับความเจ็บปวด</h2>
      <p class="text-xs text-slate-500 font-sans">Duration, Onset, Context &amp; Pain Score Assessment</p>
    </div>
  </div>
  <div class="space-y-5">
    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">1.1 ระยะเวลาที่เริ่มมีอาการปวดศีรษะในครั้งนี้ <span class="text-rose-500">*</span></label>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div class="col-span-1 sm:col-span-2">
          <input type="number" id="headacheDurationVal" min="1" max="1000" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm placeholder:text-slate-400 placeholder:font-normal" placeholder="เช่น 2 หรือ 4">
        </div>
        <div class="col-span-1">
          <select id="headacheDurationUnit" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm">
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

    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">1.2 รูปแบบการเริ่มมีอาการปวดศีรษะ <span class="text-rose-500">*</span></label>
      ${renderHeadacheGrid('grid-cols-1 sm:grid-cols-2', [
        { name: 'headacheOnsetMode', value: 'thunderclap', title: 'ปวดรุนแรงถึงขีดสุดทันทีใน 1 – 2 นาที', desc: 'อยู่ดีๆ ก็ปวดรุนแรงขึ้นมาทันทีทันใด หรือรุนแรงที่สุดในชีวิตภายในไม่กี่วินาทีถึง 2 นาที' },
        { name: 'headacheOnsetMode', value: 'gradual', title: 'ค่อยๆ ปวดมากขึ้นเรื่อยๆ', desc: 'เริ่มจากปวดน้อยๆ แล้วค่อยๆ ปวดแรงขึ้นต่อเนื่องในช่วงหลายชั่วโมงหรือหลายวัน' },
        { name: 'headacheOnsetMode', value: 'chronic', title: 'ปวดตื้อๆ เป็นๆ หายๆ เรื้อรัง', desc: 'มีอาการปวดศีรษะลักษณะเดิมเป็นๆ หายๆ มานานหลายสัปดาห์หรือหลายเดือน' },
        { name: 'headacheOnsetMode', value: 'pattern_change', title: 'ปวดเรื้อรังเดิม แต่ครั้งนี้เปลี่ยนไปชัดเจน', desc: 'เคยปวดศีรษะประจำ แต่ครั้งนี้ปวดแรงกว่าทุกครั้ง หรือตำแหน่งและลักษณะปวดเปลี่ยนไปจากเดิม' }
      ])}
    </div>

    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">1.3 เหตุการณ์หรือกิจกรรมขณะเริ่มปวดศีรษะครั้งนี้</label>
      ${renderHeadacheGrid('grid-cols-1 sm:grid-cols-2', [
        { name: 'headacheOnsetActivity', value: 'resting_normal', title: 'เกิดขึ้นเองขณะพัก หรือทำกิจวัตรปกติ', desc: 'เริ่มปวดขณะนั่งทำงาน เดิน หรืออยู่เฉยๆ ตามปกติ' },
        { name: 'headacheOnsetActivity', value: 'exertion_valsalva', title: 'เริ่มปวดขณะออกแรงหนัก ยกของ หรือเบ่ง', desc: 'เริ่มปวดศีรษะขึ้นมาทันทีขณะออกกำลังกาย ยกของหนัก เบ่งถ่าย หรือขณะมีเพศสัมพันธ์' },
        { name: 'headacheOnsetActivity', value: 'sleep_awakening', title: 'ปวดตั้งแต่ตื่นนอน หรือปวดจนสะดุ้งตื่นกลางดึก', desc: 'นอนหลับอยู่แล้วปวดศีรษะจนต้องตื่นขึ้นมา หรือปวดมากที่สุดทันทีที่ตื่นนอนตอนเช้า' },
        { name: 'headacheOnsetActivity', value: 'neck_trauma_manipulation', title: 'เริ่มปวดหลังสะบัดคอ บิดคอ หรือนวดดัดคอ', desc: 'มีการหันคอแรงๆ นวดดัดต้นคอ หรือเกร็งสะบัดคอก่อนเริ่มปวดศีรษะหรือต้นคอ' }
      ])}
    </div>

    <div class="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label class="block text-xs font-semibold text-slate-800 uppercase tracking-wider">1.4 ระดับความเจ็บปวดขณะปวดมากที่สุด (Pain Score: 0 - 10)</label>
        <div class="flex items-center space-x-2">
          <span id="headachePainScoreBadge" class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all">
            <span id="headachePainScoreEmoji" class="text-base">⚪</span>
            <span id="headachePainScoreText">ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)</span>
          </span>
          <button type="button" id="headachePainScoreClearBtn" onclick="clearHeadachePainScore()" class="text-xs text-slate-400 hover:text-rose-600 underline hidden transition" title="ล้างค่าเพื่อให้เป็นไม่ได้ระบุ">ล้างค่า</button>
        </div>
      </div>

      <div class="px-1 pt-1">
        <input type="range" id="headachePainScore" min="0" max="10" value="0" step="1" oninput="handleHeadachePainScoreChange(this.value)" class="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-600 focus:outline-none focus:ring-2 focus:ring-medical-500">
      </div>

      <div class="grid grid-cols-5 text-center text-[10px] sm:text-[11px] pt-1 gap-1 text-slate-500 font-medium">
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setHeadachePainScore(0)">
          <span class="text-lg sm:text-xl block">😊</span>
          <span>0: สบายดี</span>
        </div>
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setHeadachePainScore(2)">
          <span class="text-lg sm:text-xl block">🙂</span>
          <span>1-3: เล็กน้อย</span>
        </div>
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setHeadachePainScore(5)">
          <span class="text-lg sm:text-xl block">😐</span>
          <span>4-6: ปานกลาง</span>
        </div>
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setHeadachePainScore(8)">
          <span class="text-lg sm:text-xl block">😣</span>
          <span>7-9: ปวดมาก</span>
        </div>
        <div class="cursor-pointer hover:text-medical-600 transition" onclick="setHeadachePainScore(10)">
          <span class="text-lg sm:text-xl block">😭</span>
          <span>10: ปวดรุนแรงที่สุด</span>
        </div>
      </div>
    </div>
  </div>
</div>`;

const HEADACHE_CARD2_HTML = `
<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
  <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
    <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="map-pin" class="w-5 h-5"></i></div>
    <div>
      <h2 class="text-base font-bold text-slate-900">2. ตำแหน่งที่ปวด ลักษณะความปวด และปัจจัยกระตุ้น</h2>
      <p class="text-xs text-slate-500 font-sans">Location, Pain Quality &amp; Aggravating Factors (เลือกได้หลายข้อ)</p>
    </div>
  </div>
  <div class="space-y-5">
    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">2.1 ตำแหน่งที่ปวดศีรษะ (เลือกได้หลายข้อ)</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        ${renderHeadacheCard({
          kind: 'checkbox', id: 'headache_loc_unilateral', onchange: 'handleHeadacheLocationChange()', colSpan2: true,
          title: 'ปวดขมับซีกเดียว', desc: 'ปวดเน้นเฉพาะขมับหรือศีรษะซีกซ้ายหรือซีกขวาเพียงข้างเดียว'
        })}
        <div id="headache_unilateral_side_wrap" class="hidden sm:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
          <span class="font-semibold text-slate-800 block">ระบุข้างที่ปวดศีรษะ:</span>
          ${renderHeadacheGrid('grid-cols-1 sm:grid-cols-3', [
            { name: 'headacheUnilateralSide', value: 'left', title: 'ข้างซ้าย', compact: true, bgWhite: true },
            { name: 'headacheUnilateralSide', value: 'right', title: 'ข้างขวา', compact: true, bgWhite: true },
            { name: 'headacheUnilateralSide', value: 'alternating', title: 'สลับข้างซ้าย-ขวา', compact: true, bgWhite: true }
          ])}
        </div>
        ${renderHeadacheCard({
          kind: 'checkbox', id: 'headache_loc_periorbital', onchange: 'handleHeadacheLocationChange()', colSpan2: true,
          title: 'ปวดรอบเบ้าตา', desc: 'ปวดเจาะลึกอยู่ข้างในลูกตา หลังกระบอกตา หรือรอบเบ้าตา'
        })}
        <div id="headache_periorbital_side_wrap" class="hidden sm:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
          <span class="font-semibold text-slate-800 block">ระบุข้างที่ปวดเบ้าตา:</span>
          ${renderHeadacheGrid('grid-cols-1 sm:grid-cols-3', [
            { name: 'headachePeriorbitalSide', value: 'left', title: 'ข้างซ้าย', compact: true, bgWhite: true },
            { name: 'headachePeriorbitalSide', value: 'right', title: 'ข้างขวา', compact: true, bgWhite: true },
            { name: 'headachePeriorbitalSide', value: 'both', title: 'ทั้งสองข้าง', compact: true, bgWhite: true }
          ])}
        </div>
        ${renderHeadacheCard({ kind: 'checkbox', id: 'headache_loc_occipital', title: 'ปวดท้ายทอย', desc: 'ปวดตึงหรือปวดบริเวณด้านหลังศีรษะ ท้ายทอย หรือร้าวลงต้นคอและบ่า' })}
        ${renderHeadacheCard({ kind: 'checkbox', id: 'headache_loc_band', title: 'ปวดตึงรัดรอบศีรษะ', desc: 'รู้สึกตึงแน่นเหมือนมีแถบยางหรือหมวกรัดรอบหน้าผากและขมับสองข้าง' })}
        ${renderHeadacheCard({ kind: 'checkbox', id: 'headache_loc_diffuse', title: 'ปวดทั่วทั้งศีรษะ', desc: 'ปวดกระจายทั่วทั้งหัว ไม่สามารถชี้ตำแหน่งเดียวได้' })}
        ${renderHeadacheCard({ kind: 'checkbox', id: 'headache_loc_facial_sinus', title: 'ปวดหน้าผาก โหนกแก้ม หรือดั้งจมูก', desc: 'ปวดหน่วงตึงบริเวณใบหน้า หน้าผาก หรือโหนกแก้ม' })}
        ${renderHeadacheCard({ kind: 'checkbox', id: 'headache_loc_other_chk', onchange: 'handleHeadacheLocOtherToggle(this.checked)', title: 'ตำแหน่งอื่นๆ', colSpan2: true, compact: true })}
      </div>
      <div id="headache_loc_other_wrap" class="hidden mt-2">
        <input type="text" id="headache_loc_other_text" placeholder="ระบุตำแหน่งปวดศีรษะเพิ่มเติม เช่น ยอดกระหม่อม หรือหลังใบหู..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white placeholder:text-slate-400">
      </div>
    </div>

    <div class="pt-3 border-t border-slate-100">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">2.2 ลักษณะความรู้สึกปวด (เลือกได้หลายข้อ)</label>
      ${renderHeadacheGrid('grid-cols-1 sm:grid-cols-2', [
        { kind: 'checkbox', id: 'headache_char_throbbing', title: 'ปวดตุ๊บๆ ตามจังหวะชีพจร', desc: 'ปวดเต้นตุ๊บๆ เป็นจังหวะคล้ายเส้นเลือดเต้น' },
        { kind: 'checkbox', id: 'headache_char_tight_dull', title: 'ปวดตึงๆ หนักๆ หรือบีบรัดแน่น', desc: 'รู้สึกมึนตื้อ หนักศีรษะ หรือถูกบีบรัดต่อเนื่อง' },
        { kind: 'checkbox', id: 'headache_char_sharp_stabbing', title: 'ปวดเสียดแทงเหมือนถูกทิ่ม', desc: 'ปวดแปล๊บหรือเสียดแทงรุนแรงเฉพาะจุดเหมือนถูกของแหลมทิ่ม' },
        { kind: 'checkbox', id: 'headache_char_burning_electric', title: 'ปวดแปล๊บคล้ายไฟช็อต หรือแสบร้อน', desc: 'เสียวแปล๊บสั้นๆ ตามแนวเส้นประสาทใบหน้าหรือหนังศีรษะ' },
        { kind: 'checkbox', id: 'headache_char_boring_severe', title: 'ปวดลึกๆ รุนแรง', desc: 'ปวดลึกรุนแรงทรมานมากจนอยู่นิ่งไม่ได้ ต้องลุกเดินไปมาหรือกระสับกระส่าย', colSpan2: true }
      ])}
    </div>

    <div class="pt-3 border-t border-slate-100">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">2.3 ท่าทางหรือสิ่งกระตุ้นที่ทำให้ปวดมากขึ้น (เลือกได้หลายข้อ)</label>
      ${renderHeadacheGrid('grid-cols-1 sm:grid-cols-2', [
        { kind: 'checkbox', id: 'headache_trig_valsalva', title: 'ปวดมากขึ้นเวลาไอ จาม เบ่ง หรือก้มศีรษะ', desc: 'ปวดสะเทือนในศีรษะมากขึ้นทันทีเวลาไอ จาม เบ่งถ่าย หรือก้มหน้าลงต่ำ' },
        { kind: 'checkbox', id: 'headache_trig_supine_morning', title: 'ปวดมากขึ้นเวลานอนราบ', desc: 'เมื่อเอนตัวนอนราบจะปวดตื้อในศีรษะมากขึ้น ต้องลุกนั่งจึงดีขึ้น' },
        { kind: 'checkbox', id: 'headache_trig_upright', title: 'ปวดมากขึ้นเวลาลุกนั่งหรือยืน และดีขึ้นเมื่อนอนราบ', desc: 'ลุกขึ้นนั่งหรือยืนแล้วปวดศีรษะชัดเจน แต่เมื่อนอนราบอาการปวดทุเลาลง' },
        { kind: 'checkbox', id: 'headache_trig_jaw_claudication', title: 'ปวดหรือเมื่อยขากรรไกรเวลาเคี้ยวอาหาร', desc: 'เคี้ยวอาหารแล้วปวดเมื่อยล้าบริเวณขากรรไกรและขมับจนต้องหยุดพัก' },
        { kind: 'checkbox', id: 'headache_trig_scalp_tenderness', title: 'เจ็บหนังศีรษะหรือขมับเวลาหวีผมหรือแตะโดน', desc: 'แตะถูกบริเวณขมับหรือหวีผมแล้วรู้สึกเจ็บแปล๊บผิดปกติ' },
        { kind: 'checkbox', id: 'headache_trig_light_sound', title: 'ปวดมากขึ้นเมื่อเจอแสงจ้า เสียงดัง หรือกลิ่นฉุน', desc: 'ทนแสงสว่างหรือเสียงดังไม่ได้ อยากนอนพักในห้องมืดและเงียบ' },
        { kind: 'checkbox', id: 'headache_trig_stress_fatigue', title: 'สัมพันธ์กับการอดนอน ความเครียด หรือใช้สายตานาน', desc: 'มีประวัติพักผ่อนน้อย เครียดสะสม หรือจ้องหน้าจอนานก่อนเริ่มปวด' },
        { kind: 'checkbox', id: 'headache_trig_other_chk', onchange: 'handleHeadacheTrigOtherToggle(this.checked)', title: 'สิ่งกระตุ้นอื่นๆ', compact: true }
      ])}
      <div id="headache_trig_other_wrap" class="hidden mt-2">
        <input type="text" id="headache_trig_other_text" placeholder="ระบุสิ่งกระตุ้นเพิ่มเติม เช่น ช่วงมีประจำเดือน หรืออากาศร้อน..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white placeholder:text-slate-400">
      </div>
    </div>
  </div>
</div>`;

const HEADACHE_CARD3_HTML = `
<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
  <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
    <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="shield-alert" class="w-5 h-5"></i></div>
    <div>
      <h2 class="text-base font-bold text-slate-900">3. อาการเตือนทางระบบประสาท การมองเห็น และอาการร่วมสำคัญ</h2>
      <p class="text-xs text-slate-500 font-sans">Neurological, Ocular &amp; Systemic Screening (เลือกได้หลายข้อ)</p>
    </div>
  </div>
  <div class="space-y-5">
    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">3.1 อาการทางระบบประสาทและคอแข็งเกร็ง (เลือกได้หลายข้อ)</label>
      ${renderHeadacheGrid('grid-cols-1 sm:grid-cols-2', [
        { kind: 'checkbox', id: 'headache_rf_weakness_numb', title: 'แขนขาอ่อนแรง หรือชาครึ่งซีก', desc: 'ยกแขนหรือขาไม่ขึ้น หยิบจับของหล่น หรือรู้สึกชาซีกใดซีกหนึ่งของร่างกาย' },
        { kind: 'checkbox', id: 'headache_rf_facial_speech', title: 'ปากเบี้ยว หรือพูดไม่ชัด', desc: 'มุมปากตก ยิ้มไม่เท่ากัน พูดอ้อแอ้ นึกคำพูดไม่ออก หรือสื่อสารไม่เข้าใจ' },
        { kind: 'checkbox', id: 'headache_rf_ataxia_walk', title: 'เดินเซ หรือหยิบของไม่ถนัด', desc: 'เดินเซเอียง ทรงตัวไม่ได้ ยืนไม่อยู่ หรือกะระยะมือหยิบจับสิ่งของผิดพลาด' },
        { kind: 'checkbox', id: 'headache_rf_seizure_syncope', title: 'มีอาการชักเกร็ง หรือวูบหมดสติ', desc: 'มีอาการเกร็งกระตุก หรือหมดสติไม่รู้สึกตัวร่วมกับปวดศีรษะ' },
        { kind: 'checkbox', id: 'headache_rf_altered_mental', title: 'ง่วงซึม สับสน พฤติกรรมเปลี่ยนไป', desc: 'ดูซึมลง ปลุกตื่นยาก ถามตอบสับสน หรือจำคนและสถานที่ไม่ได้' },
        { kind: 'checkbox', id: 'headache_rf_stiff_neck', title: 'คอแข็งเกร็ง ก้มไม่ลง', desc: 'รู้สึกตึงแข็งบริเวณต้นคอมาก ก้มคอให้คางชิดอกไม่ได้ หรือก้มแล้วปวดตึงร้าวลงหลัง' },
        { kind: 'checkbox', id: 'headache_rf_fever', title: 'มีไข้ หรือหนาวสั่น', desc: 'ตัวร้อน หนาวสั่น หรือวัดไข้ได้ตั้งแต่ 38.0 องศาเซลเซียสขึ้นไป', colSpan2: true }
      ])}
    </div>

    <div class="pt-3 border-t border-slate-100">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">3.2 อาการทางตาและการมองเห็นผิดปกติ (เลือกได้หลายข้อ)</label>
      ${renderHeadacheGrid('grid-cols-1 sm:grid-cols-2', [
        { kind: 'checkbox', id: 'headache_rf_acute_glaucoma', title: 'ตาแดง ปวดเบ้าตารุนแรง ตามัวลงทันที หรือเห็นรุ้งรอบไฟ', desc: 'ปวดในลูกตาอย่างรุนแรงร่วมกับตาแดง ตามัวลงรวดเร็ว หรือมองไฟเห็นวงสีรุ้ง' },
        { kind: 'checkbox', id: 'headache_rf_diplopia_field', title: 'มองเห็นภาพซ้อน หรือลานสายตามืดไปบางส่วน', desc: 'มองเห็นภาพแยกเป็น 2 ชิ้น หรือมองไม่เห็นภาพด้านซ้าย/ขวา' },
        { kind: 'checkbox', id: 'headache_has_visual_aura', title: 'เห็นแสงวูบวาบ หรือเส้นซิกแซกนำมาก่อนปวดศีรษะ', desc: 'เห็นแสงระยิบระยับ เส้นหยัก หรือจุดบอดในสายตาประมาณ 10–30 นาทีก่อนปวด' },
        { kind: 'checkbox', id: 'headache_has_autonomic', title: 'ตาแดง น้ำตาไหล หนังตาตก หรือคัดจมูกข้างเดียวกับที่ปวด', desc: 'มีน้ำตาไหล เปลือกตาตก หรือน้ำมูกไหลเฉพาะฝั่งเดียวกับข้างที่ปวดศีรษะ' }
      ])}
    </div>

    <div class="pt-3 border-t border-slate-100">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">3.3 อาการคลื่นไส้ อาเจียน</label>
      ${renderHeadacheCard({
        kind: 'checkbox', id: 'headache_has_nausea_vomit', onchange: 'handleHeadacheVomitChange()',
        title: 'มีอาการคลื่นไส้ หรืออาเจียน', desc: 'รู้สึกพะอืดพะอม คลื่นไส้ หรืออาเจียนร่วมกับอาการปวดศีรษะ'
      })}
      <div id="headache_vomit_detail_wrap" class="hidden mt-2.5 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
        <span class="font-semibold text-slate-800 block">ลักษณะอาการคลื่นไส้หรืออาเจียน:</span>
        ${renderHeadacheGrid('grid-cols-1 sm:grid-cols-3', [
          { name: 'headacheVomitStatus', value: 'nausea_only', title: 'คลื่นไส้ พะอืดพะอมอย่างเดียว ยังไม่อาเจียน', compact: true, bgWhite: true },
          { name: 'headacheVomitStatus', value: 'vomiting', title: 'มีอาเจียนออกมาตามปกติ', compact: true, bgWhite: true },
          { name: 'headacheVomitStatus', value: 'projectile', title: 'มีอาการอาเจียนพุ่งรุนแรงทันทีโดยไม่คลื่นไส้นำมาก่อน', compact: true, bgWhite: true }
        ])}
      </div>
    </div>
  </div>
</div>`;

const HEADACHE_CARD4_HTML = `
<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
  <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
    <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="clipboard-check" class="w-5 h-5"></i></div>
    <div>
      <h2 class="text-base font-bold text-slate-900">4. ประวัติเสี่ยงสำคัญ การใช้ยา และข้อมูลเฉพาะสตรี</h2>
      <p class="text-xs text-slate-500 font-sans">High-Risk History, Analgesic Overuse &amp; Female Reproductive History</p>
    </div>
  </div>
  <div class="space-y-5">
    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">4.1 ประวัติเสี่ยงและเหตุการณ์สำคัญที่เกี่ยวข้อง (เลือกได้หลายข้อ)</label>
      ${renderHeadacheGrid('grid-cols-1 sm:grid-cols-2', [
        { kind: 'checkbox', id: 'headache_risk_new_onset_age50', title: 'เพิ่งเคยปวดศีรษะรุนแรงลักษณะนี้เป็นครั้งแรกในชีวิต', desc: 'ไม่เคยมีประวัติปวดศีรษะแบบนี้มาก่อนเลย โดยเฉพาะผู้ที่อายุตั้งแต่ 50 ปีขึ้นไป' },
        { kind: 'checkbox', id: 'headache_risk_recent_trauma', title: 'เคยศีรษะกระแทก หกล้ม หรือเกิดอุบัติเหตุภายใน 3 เดือนที่ผ่านมา', desc: 'มีประวัติศีรษะชนกระแทกหรืออุบัติเหตุ แม้ในตอนนั้นจะดูไม่รุนแรง' },
        { kind: 'checkbox', id: 'headache_risk_anticoagulants', title: 'รับประทานยาละลายลิ่มเลือด หรือยาต้านเกล็ดเลือดอยู่ประจำ', desc: 'เช่น ยาวาร์ฟาริน ยาป้องกันลิ่มเลือด หรือยาแอสไพริน' },
        { kind: 'checkbox', id: 'headache_risk_cancer', onchange: 'syncHeadacheCancerPmh()', title: 'มีประวัติโรคมะเร็ง', desc: 'ได้รับการวินิจฉัยหรืออยู่ระหว่างการรักษาโรคมะเร็งชนิดใดๆ' },
        { kind: 'checkbox', id: 'headache_risk_immunocompromised', title: 'มีภาวะภูมิคุ้มกันบกพร่อง หรือทานยากดภูมิคุ้มกัน', desc: 'ติดเชื้อเอชไอวี หรือรับประทานยาสเตียรอยด์/ยากดภูมิต่อเนื่อง' },
        { kind: 'checkbox', id: 'headache_risk_co_exposure', title: 'สูดดมควันในที่อับ หรือมีคนใกล้ชิดปวดศีรษะพร้อมกัน', desc: 'เช่น อยู่ในห้องปิดที่ใช้เครื่องทำความร้อน/เตาถ่าน ในรถที่ติดเครื่องทิ้งไว้ หรือเพื่อนร่วมบ้านมีอาการคล้ายกัน' },
        { kind: 'checkbox', id: 'headache_risk_severe_htn', title: 'ความดันโลหิต สูงมากผิดปกติ', desc: 'เช่น วัดความดันโลหิตก่อนมาโรงพยาบาลได้ตัวบนตั้งแต่ 180 หรือตัวล่างตั้งแต่ 110 มิลลิเมตรปรอทขึ้นไป' },
        { kind: 'checkbox', id: 'headache_risk_med_overuse', title: 'รับประทานยาแก้ปวดศีรษะบ่อยเกือบทุกวันติดต่อกันนานหลายสัปดาห์', desc: 'ต้องทานยาพาราเซตามอล ยาชุด หรือยาแก้ปวดไมเกรนเกิน 10–15 วันต่อเดือน' }
      ])}
    </div>

    <div id="headacheFemaleSection" class="hidden pt-4 border-t border-slate-100 space-y-4">
      <div class="p-3 bg-pink-50 border border-pink-200 rounded-xl text-xs text-pink-900">
        <strong>4.2 เฉพาะผู้ป่วยหญิง:</strong> ข้อมูลประจำเดือน การตั้งครรภ์ และการใช้ยาฮอร์โมนช่วยคัดกรองภาวะครรภ์เป็นพิษและลิ่มเลือดในหลอดเลือดดำสมอง
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">สถานะการตั้งครรภ์หรือหลังคลอด</label>
        ${renderHeadacheGrid('grid-cols-1 sm:grid-cols-2', [
          { name: 'headachePregnancyStatus', value: 'not_pregnant', onchange: 'handleHeadachePregnancyChange()', title: 'ไม่ได้ตั้งครรภ์', compact: true },
          { name: 'headachePregnancyStatus', value: 'pregnant', onchange: 'handleHeadachePregnancyChange()', title: 'กำลังตั้งครรภ์', compact: true },
          { name: 'headachePregnancyStatus', value: 'postpartum_6w', onchange: 'handleHeadachePregnancyChange()', title: 'เพิ่งคลอดบุตร หรือแท้งบุตรภายใน 6 สัปดาห์ที่ผ่านมา', compact: true },
          { name: 'headachePregnancyStatus', value: 'menopause_hysterectomy', onchange: 'handleHeadachePregnancyChange()', title: 'วัยหมดประจำเดือน หรือผ่าตัดมดลูกแล้ว', compact: true },
          { name: 'headachePregnancyStatus', value: 'unsure', onchange: 'handleHeadachePregnancyChange()', title: 'ไม่แน่ใจ / ไม่ทราบ', compact: true, colSpan2: true }
        ])}
        <div id="headachePregnancyWeeksWrap" class="hidden mt-2.5 bg-slate-50 border border-slate-200 rounded-xl p-3">
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">อายุครรภ์โดยประมาณ</label>
          <input type="text" id="headachePregnancyWeeks" placeholder="ระบุอายุครรภ์ เช่น 28 สัปดาห์" class="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 placeholder:text-slate-400">
        </div>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">การใช้ยาฮอร์โมนและประวัติครรภ์เป็นพิษ (เลือกได้หลายข้อ)</label>
        ${renderHeadacheGrid('grid-cols-1 sm:grid-cols-2', [
          { kind: 'checkbox', id: 'headache_fem_ocp', title: 'กำลังรับประทานยาคุมกำเนิด หรือใช้ฮอร์โมนทดแทน', compact: true },
          { kind: 'checkbox', id: 'headache_fem_preeclampsia', title: 'มีประวัติความดันโลหิตสูงขณะตั้งครรภ์ หรือครรภ์เป็นพิษ', compact: true }
        ])}
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">วันแรกของประจำเดือนครั้งสุดท้าย (LMP)</label>
        <input type="text" id="headacheLmpDate" data-universal-date="true" placeholder="วว/ดด/ปปปป (dd/mm/yyyy)" class="w-full sm:w-72 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white placeholder:text-slate-400">
      </div>
    </div>
  </div>
</div>`;

const HEADACHE_FORM_HTML = `
<div id="headacheQuestionnaireSection" class="hidden space-y-6">
  <div data-cc-top-banner="headache"><div class="flex flex-col gap-4">
  <div class="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-start space-x-3">
    <i data-lucide="info" class="w-5 h-5 text-sky-700 mt-0.5 flex-shrink-0"></i>
    <div class="text-xs text-sky-900 leading-relaxed space-y-1">
      <div class="font-bold">ข้อแนะนำการดูแลตนเองเบื้องต้นระหว่างรอพบแพทย์</div>
      <p>1. <strong>งดน้ำและอาหารไว้ก่อนชั่วคราว:</strong> หากมีอาการปวดศีรษะรุนแรงเฉียบพลัน มีอาเจียน หรือมีอาการชา/อ่อนแรง เผื่อกรณีต้องส่งตรวจพิเศษหรือรับยาฉุกเฉิน</p>
      <p>2. <strong>แจ้งพยาบาลหน้าห้องตรวจทันที:</strong> หากมีอาการ <strong>ปวดรุนแรงขึ้นเฉียบพลัน ซึมลง สับสน ปากเบี้ยว พูดไม่ชัด หรือแขนขาอ่อนแรง</strong></p>
    </div>
  </div>
  </div></div>

  ${HEADACHE_CARD1_HTML}
  ${HEADACHE_CARD2_HTML}
  ${HEADACHE_CARD3_HTML}
  ${HEADACHE_CARD4_HTML}

  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-3 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl"><i data-lucide="message-square-plus" class="w-5 h-5"></i></div>
      <div>
        <h2 class="text-base font-bold text-slate-900">อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2>
        <p class="text-xs text-slate-500 font-sans">Additional Symptoms or Concerns (ระบุอิสระ)</p>
      </div>
    </div>
    <textarea id="headache_other_free" rows="2" placeholder="ระบุอาการผิดปกติอื่นๆ หรือรายละเอียดเพิ่มเติมที่ต้องการแจ้งแพทย์หรือพยาบาล..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white placeholder:text-slate-400"></textarea>
  </div>
</div>`;

const headacheModule = {
  id: 'headache',
  recordCc: 'headache',
  titleTh: 'ปวดศีรษะ',
  titleEn: 'Headache',
  sectionDomId: 'headacheQuestionnaireSection',
  pmhSectionNumber: 5,
  getPmhSectionNumber: () => 5,
  doctorCcBadgeHtml: '<i data-lucide="frown" class="w-3 h-3 mr-1"></i> CC: ปวดศีรษะ (Headache)',
  dateFields: ['headacheLmpDate'],
  branchIds: [
    'headache_unilateral_side_wrap',
    'headache_periorbital_side_wrap',
    'headache_loc_other_wrap',
    'headache_trig_other_wrap',
    'headache_vomit_detail_wrap',
    'headacheFemaleSection',
    'headachePregnancyWeeksWrap'
  ],
  inputIdsToClear: [
    'headacheDurationVal',
    'headache_loc_other_text',
    'headache_trig_other_text',
    'headachePregnancyWeeks',
    'headacheLmpDate',
    'headache_other_free'
  ],
  formHtml: HEADACHE_FORM_HTML,

  algorithm: {
    id: 'headache',
    titleTh: 'ปวดศีรษะ',
    titleEn: 'Headache',
    triageLevelRules: [
      { level: 1, criteria: 'Thunderclap headache with altered mental status / seizure / syncope / focal neurological deficit / meningismus with shock' },
      { level: 2, criteria: 'Thunderclap SAH suspect / exertion or valsalva onset / neck trauma manipulation onset, Meningitis (fever + stiff neck), Focal neuro deficit, Acute angle-closure glaucoma / diplopia, Raised ICP (projectile vomiting / worse with valsalva / supine / morning awakening), GCA / new headache age >= 50, Pregnancy or postpartum <= 6w (CVST/eclampsia), Recent head trauma <= 3m / Anticoagulant / Cancer / Immunocompromised / CO exposure / Severe hypertension' },
      { level: 3, criteria: 'Moderate-to-severe acute migraine or cluster headache flare without secondary red flags' },
      { level: 4, criteria: 'Uncomplicated tension-type headache or mild recurrent primary headache with zero red flags' }
    ]
  },

  onTitleChange(arg) {
    syncHeadacheFemaleSection(isHeadacheFemaleTitle(arg));
  },

  onSelectForm() {
    syncHeadacheFemaleSection();
  },

  onActivate(patient) {
    if (patient && (patient.gender === 'หญิง' || patient.gender === 'ชาย')) {
      syncHeadacheFemaleSection(patient.gender === 'หญิง');
    } else {
      syncHeadacheFemaleSection();
    }
  },

  resetForm() {
    clearHeadachePainScore();
    clearHeadacheRadioGroup('headacheOnsetMode');
    clearHeadacheRadioGroup('headacheOnsetActivity');
    clearHeadacheRadioGroup('headacheUnilateralSide');
    clearHeadacheRadioGroup('headachePeriorbitalSide');
    clearHeadacheRadioGroup('headacheVomitStatus');
    clearHeadacheRadioGroup('headachePregnancyStatus');
    clearHeadacheCheckboxes([
      'headache_loc_unilateral', 'headache_loc_periorbital', 'headache_loc_occipital',
      'headache_loc_band', 'headache_loc_diffuse', 'headache_loc_facial_sinus', 'headache_loc_other_chk',
      'headache_char_throbbing', 'headache_char_tight_dull', 'headache_char_sharp_stabbing',
      'headache_char_burning_electric', 'headache_char_boring_severe',
      'headache_trig_valsalva', 'headache_trig_supine_morning', 'headache_trig_upright',
      'headache_trig_jaw_claudication', 'headache_trig_scalp_tenderness', 'headache_trig_light_sound',
      'headache_trig_stress_fatigue', 'headache_trig_other_chk',
      'headache_rf_weakness_numb', 'headache_rf_facial_speech', 'headache_rf_ataxia_walk',
      'headache_rf_seizure_syncope', 'headache_rf_altered_mental', 'headache_rf_stiff_neck', 'headache_rf_fever',
      'headache_rf_acute_glaucoma', 'headache_rf_diplopia_field', 'headache_has_visual_aura',
      'headache_has_autonomic', 'headache_has_nausea_vomit',
      'headache_risk_new_onset_age50', 'headache_risk_recent_trauma', 'headache_risk_anticoagulants',
      'headache_risk_cancer', 'headache_risk_immunocompromised', 'headache_risk_co_exposure',
      'headache_risk_severe_htn', 'headache_risk_med_overuse',
      'headache_fem_ocp', 'headache_fem_preeclampsia'
    ]);
    this.branchIds.forEach(bId => toggleHeadacheBranch(bId, false));
    this.inputIdsToClear.forEach(iId => {
      const el = document.getElementById(iId);
      if (el) el.value = '';
    });
    const unitEl = document.getElementById('headacheDurationUnit');
    if (unitEl) unitEl.value = 'hours';
  },

  seedPatients: [
    {
      id: 'case-071',
      queue_number: 'A-071',
      hn: '6705519',
      name: 'นางกานดา มณีรัตน์',
      age: 46,
      gender: 'หญิง',
      chief_complaint: 'headache',
      chief_complaint_title: 'ปวดศีรษะ',
      status: 'waiting',
      timestamp: '2026-10-26T02:21:26.424Z',
      durationVal: 1,
      durationUnit: 'hours',
      headachePainScore: 10,
      headacheOnsetMode: 'thunderclap',
      headacheOnsetActivity: 'exertion_valsalva',
      headacheLocs: ['occipital', 'diffuse'],
      headacheUnilateralSide: 'none',
      headachePeriorbitalSide: 'none',
      headacheLocOther: '',
      headacheChars: ['sharp_stabbing', 'throbbing'],
      headache_trig_valsalva: true,
      headache_trig_supine_morning: false,
      headache_trig_upright: false,
      headache_trig_jaw_claudication: false,
      headache_trig_scalp_tenderness: false,
      headache_trig_light_sound: false,
      headache_trig_stress_fatigue: false,
      headache_trig_other: '',
      headache_rf_weakness_numb: false,
      headache_rf_facial_speech: false,
      headache_rf_ataxia_walk: false,
      headache_rf_seizure_syncope: false,
      headache_rf_altered_mental: false,
      headache_rf_fever: false,
      headache_rf_stiff_neck: false,
      headache_rf_fever_stiff_neck: false,
      headache_rf_acute_glaucoma: false,
      headache_rf_diplopia_field: false,
      headache_has_visual_aura: false,
      headache_has_nausea_vomit: true,
      headacheVomitStatus: 'projectile',
      headache_has_autonomic: false,
      headache_risk_recent_trauma: false,
      headache_risk_pregnancy_postpartum: false,
      headache_risk_cancer: false,
      headache_risk_immunocompromised: false,
      headache_risk_anticoagulants: false,
      headache_risk_new_onset_age50: false,
      headache_risk_co_exposure: false,
      headache_risk_severe_htn: true,
      headache_risk_med_overuse: false,
      headachePregnancyStatus: 'not_pregnant',
      headachePregnancyWeeks: '',
      headache_fem_ocp: false,
      headache_fem_preeclampsia: false,
      headacheLmpDate: '04/11/2026',
      otherSymptomsFree: '',
      hospRecordStatus: 'ratchaburi',
      underlying: ['ความดันสูง (HT)'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Amlodipine 5 mg 1 tab po od pc',
      doctor_notes: {
        additional_hpi: 'ผู้ป่วยปวดศีรษะรุนแรงเฉียบพลันระดับ 10/10 ภายใน 30 วินาทีขณะยกถังน้ำ ปวดมากบริเวณท้ายทอย มีอาเจียนพุ่งรุนแรง 2 ครั้ง ปฏิเสธอุบัติเหตุ ไม่มีไข้ ไม่มีแขนขาอ่อนแรง',
        physical_exam: 'BT 36.9 C, PR 92/min, RR 20/min, BP 184/100 mmHg, SpO2 98%. Neuro: Alert, pupils 3 mm RTLBE, motor V all. Neck: Stiff neck positive.',
        preliminary_dx: 'Suspected Spontaneous Aneurysmal Subarachnoid Hemorrhage (SAH)',
        plan: 'STAT Non-contrast CT Brain, Keep SBP < 140 mmHg (Nicardipine IV), Nimodipine 60 mg po q4h, urgent Neurosurgery consult'
      }
    },
    {
      id: 'case-072',
      queue_number: 'A-072',
      hn: '6706188',
      name: 'นายปิยะพงษ์ ศรีวิชัย',
      age: 29,
      gender: 'ชาย',
      chief_complaint: 'headache',
      chief_complaint_title: 'ปวดศีรษะ',
      status: 'waiting',
      timestamp: '2026-10-26T02:01:26.424Z',
      durationVal: 2,
      durationUnit: 'days',
      headachePainScore: 8,
      headacheOnsetMode: 'gradual',
      headacheOnsetActivity: 'resting_normal',
      headacheLocs: ['diffuse', 'occipital'],
      headacheUnilateralSide: 'none',
      headachePeriorbitalSide: 'none',
      headacheLocOther: '',
      headacheChars: ['tight_dull', 'throbbing'],
      headache_trig_valsalva: false,
      headache_trig_supine_morning: false,
      headache_trig_upright: false,
      headache_trig_jaw_claudication: false,
      headache_trig_scalp_tenderness: false,
      headache_trig_light_sound: true,
      headache_trig_stress_fatigue: false,
      headache_trig_other: '',
      headache_rf_weakness_numb: false,
      headache_rf_facial_speech: false,
      headache_rf_ataxia_walk: false,
      headache_rf_seizure_syncope: false,
      headache_rf_altered_mental: true,
      headache_rf_fever: true,
      headache_rf_stiff_neck: true,
      headache_rf_fever_stiff_neck: true,
      headache_rf_acute_glaucoma: false,
      headache_rf_diplopia_field: false,
      headache_has_visual_aura: false,
      headache_has_nausea_vomit: true,
      headacheVomitStatus: 'vomiting',
      headache_has_autonomic: false,
      headache_risk_recent_trauma: false,
      headache_risk_pregnancy_postpartum: false,
      headache_risk_cancer: false,
      headache_risk_immunocompromised: false,
      headache_risk_anticoagulants: false,
      headache_risk_new_onset_age50: false,
      headache_risk_co_exposure: false,
      headache_risk_severe_htn: false,
      headache_risk_med_overuse: false,
      headachePregnancyStatus: 'not_applicable',
      headachePregnancyWeeks: '',
      headache_fem_ocp: false,
      headache_fem_preeclampsia: false,
      headacheLmpDate: '',
      otherSymptomsFree: '',
      hospRecordStatus: 'self',
      underlying: ['ปฏิเสธ'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'ไม่มี (ซื้อ Paracetamol ทานเอง)',
      doctor_notes: {
        additional_hpi: '2 วันก่อนเริ่มมีไข้สูง หนาวสั่น ปวดศีรษะทั่วศีรษะรุนแรงขึ้นเรื่อยๆ วันนี้ญาติสังเกตว่าซึมลง สับสน ก้มคอไม่ได้ มีอาเจียน 3 ครั้ง',
        physical_exam: 'BT 39.2 C, PR 112/min, RR 22/min, BP 118/74 mmHg. Neuro: Lethargic, GCS E3V4M6=13, marked nuchal rigidity, Brudzinski positive.',
        preliminary_dx: 'Acute Bacterial Meningitis with Encephalopathy',
        plan: 'Hemoculture x2, Empirical IV Ceftriaxone 2g + Vancomycin + Dexamethasone 10mg IV, STAT CT Brain prior to LP'
      }
    },
    {
      id: 'case-073',
      queue_number: 'A-073',
      hn: '6708214',
      name: 'นางสาวพิมพ์ชนก รัตนโกสินทร์',
      age: 32,
      gender: 'หญิง',
      chief_complaint: 'headache',
      chief_complaint_title: 'ปวดศีรษะ',
      status: 'waiting',
      timestamp: '2026-10-26T01:46:26.424Z',
      durationVal: 4,
      durationUnit: 'hours',
      headachePainScore: 7,
      headacheOnsetMode: 'gradual',
      headacheOnsetActivity: 'resting_normal',
      headacheLocs: ['unilateral'],
      headacheUnilateralSide: 'left',
      headachePeriorbitalSide: 'none',
      headacheLocOther: '',
      headacheChars: ['throbbing'],
      headache_trig_valsalva: false,
      headache_trig_supine_morning: false,
      headache_trig_upright: false,
      headache_trig_jaw_claudication: false,
      headache_trig_scalp_tenderness: false,
      headache_trig_light_sound: true,
      headache_trig_stress_fatigue: true,
      headache_trig_other: '',
      headache_rf_weakness_numb: false,
      headache_rf_facial_speech: false,
      headache_rf_ataxia_walk: false,
      headache_rf_seizure_syncope: false,
      headache_rf_altered_mental: false,
      headache_rf_fever: false,
      headache_rf_stiff_neck: false,
      headache_rf_fever_stiff_neck: false,
      headache_rf_acute_glaucoma: false,
      headache_rf_diplopia_field: false,
      headache_has_visual_aura: true,
      headache_has_nausea_vomit: true,
      headacheVomitStatus: 'nausea_only',
      headache_has_autonomic: false,
      headache_risk_recent_trauma: false,
      headache_risk_pregnancy_postpartum: false,
      headache_risk_cancer: false,
      headache_risk_immunocompromised: false,
      headache_risk_anticoagulants: false,
      headache_risk_new_onset_age50: false,
      headache_risk_co_exposure: false,
      headache_risk_severe_htn: false,
      headache_risk_med_overuse: false,
      headachePregnancyStatus: 'not_pregnant',
      headachePregnancyWeeks: '',
      headache_fem_ocp: false,
      headache_fem_preeclampsia: false,
      headacheLmpDate: '09/11/2026',
      otherSymptomsFree: '',
      hospRecordStatus: 'self',
      underlying: ['ไมเกรน (Migraine)'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'Paracetamol prn, Ibuprofen 400 mg prn',
      doctor_notes: {
        additional_hpi: 'มีประวัติไมเกรนเดิม 4 ชม. ก่อนเห็นแสงซิกแซกประมาณ 20 นาที จากนั้นปวดตุ๊บๆ ขมับซ้าย 7/10 คลื่นไส้ ทนแสงจ้าเสียงดังไม่ได้ ไม่มีไข้ คอไม่แข็ง',
        physical_exam: 'BT 36.6 C, PR 76/min, RR 16/min, BP 116/72 mmHg. Alert, CN intact, motor V all, normal gait, no meningeal signs.',
        preliminary_dx: 'Acute Migraine with Typical Visual Aura',
        plan: 'Rest in quiet dark room, 0.9% NSS 500 ml IV, Metoclopramide 10 mg IV, Ketorolac 30 mg IV'
      }
    },
    {
      id: 'case-074',
      queue_number: 'A-074',
      hn: '6709322',
      name: 'นายสมศักดิ์ วัฒนากูล',
      age: 36,
      gender: 'ชาย',
      chief_complaint: 'headache',
      chief_complaint_title: 'ปวดศีรษะ',
      status: 'waiting',
      timestamp: '2026-11-16T04:20:00.000Z',
      durationVal: 2,
      durationUnit: 'days',
      headachePainScore: 4,
      headacheOnsetMode: 'chronic',
      headacheOnsetActivity: 'resting_normal',
      headacheLocs: ['band', 'occipital'],
      headacheUnilateralSide: 'none',
      headachePeriorbitalSide: 'none',
      headacheLocOther: '',
      headacheChars: ['tight_dull'],
      headache_trig_valsalva: false,
      headache_trig_supine_morning: false,
      headache_trig_upright: false,
      headache_trig_jaw_claudication: false,
      headache_trig_scalp_tenderness: false,
      headache_trig_light_sound: false,
      headache_trig_stress_fatigue: true,
      headache_trig_other: '',
      headache_rf_weakness_numb: false,
      headache_rf_facial_speech: false,
      headache_rf_ataxia_walk: false,
      headache_rf_seizure_syncope: false,
      headache_rf_altered_mental: false,
      headache_rf_fever: false,
      headache_rf_stiff_neck: false,
      headache_rf_fever_stiff_neck: false,
      headache_rf_acute_glaucoma: false,
      headache_rf_diplopia_field: false,
      headache_has_visual_aura: false,
      headache_has_nausea_vomit: false,
      headacheVomitStatus: 'none',
      headache_has_autonomic: false,
      headache_risk_recent_trauma: false,
      headache_risk_pregnancy_postpartum: false,
      headache_risk_cancer: false,
      headache_risk_immunocompromised: false,
      headache_risk_anticoagulants: false,
      headache_risk_new_onset_age50: false,
      headache_risk_co_exposure: false,
      headache_risk_severe_htn: false,
      headache_risk_med_overuse: false,
      headachePregnancyStatus: 'not_applicable',
      headachePregnancyWeeks: '',
      headache_fem_ocp: false,
      headache_fem_preeclampsia: false,
      headacheLmpDate: '',
      otherSymptomsFree: 'ช่วง 2 วันที่ผ่านมาทำงานหน้าจอคอมพิวเตอร์ดึก พักผ่อนน้อย รู้สึกตึงขมับและท้ายทอย',
      hospRecordStatus: 'self',
      underlying: ['ปฏิเสธ'],
      drugAllergy: 'ปฏิเสธ',
      currentMeds: 'ไม่มี',
      doctor_notes: {
        additional_hpi: 'ชายอายุ 36 ปี แข็งแรงดี ปวดตื้อๆ ตึงรัดรอบศีรษะและท้ายทอยมา 2 วัน หลังนอนดึกทำงานหน้าคอมพิวเตอร์ ไม่คลื่นไส้อาเจียน ไม่มีไข้ ไม่มีสัญญาณอันตรายทางระบบประสาท',
        physical_exam: 'BT 36.7 C, PR 74/min, RR 16/min, BP 122/78 mmHg. Alert, normal cranial nerves, motor V all, mild pericranial & trapezius muscle tenderness.',
        preliminary_dx: 'Tension-Type Headache (TTH)',
        plan: 'Paracetamol 1000 mg po or Ibuprofen 400 mg po pc, ergonomics & sleep hygiene advice, return if red flags'
      }
    }
  ],

  hydrateForm(patient) {
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val !== undefined && val !== null ? val : '';
    };
    const setChk = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.checked = Boolean(val);
    };

    setVal('headacheDurationVal', patient.durationVal || '');
    const durUnit = document.getElementById('headacheDurationUnit');
    if (durUnit) durUnit.value = patient.durationUnit || 'hours';

    setHeadacheRadioChecked('headacheOnsetMode', patient.headacheOnsetMode);
    setHeadacheRadioChecked('headacheOnsetActivity', patient.headacheOnsetActivity);

    if (patient.headachePainScore !== undefined && patient.headachePainScore !== null) {
      setHeadachePainScore(patient.headachePainScore);
    } else {
      clearHeadachePainScore();
    }

    // Locations
    setChk('headache_loc_unilateral', patient.headacheLocs?.includes('unilateral'));
    setChk('headache_loc_periorbital', patient.headacheLocs?.includes('periorbital'));
    setChk('headache_loc_occipital', patient.headacheLocs?.includes('occipital'));
    setChk('headache_loc_band', patient.headacheLocs?.includes('band'));
    setChk('headache_loc_diffuse', patient.headacheLocs?.includes('diffuse'));
    setChk('headache_loc_facial_sinus', patient.headacheLocs?.includes('facial_sinus'));
    const hasLocOther = Boolean(patient.headacheLocOther);
    setChk('headache_loc_other_chk', hasLocOther);
    toggleHeadacheBranch('headache_loc_other_wrap', hasLocOther);
    setVal('headache_loc_other_text', hasLocOther ? patient.headacheLocOther : '');

    handleHeadacheLocationChange();
    if (patient.headacheUnilateralSide && patient.headacheUnilateralSide !== 'none') {
      setHeadacheRadioChecked('headacheUnilateralSide', patient.headacheUnilateralSide);
    }
    if (patient.headachePeriorbitalSide && patient.headachePeriorbitalSide !== 'none') {
      setHeadacheRadioChecked('headachePeriorbitalSide', patient.headachePeriorbitalSide);
    }

    // Characteristics
    setChk('headache_char_throbbing', patient.headacheChars?.includes('throbbing'));
    setChk('headache_char_tight_dull', patient.headacheChars?.includes('tight_dull'));
    setChk('headache_char_sharp_stabbing', patient.headacheChars?.includes('sharp_stabbing'));
    setChk('headache_char_burning_electric', patient.headacheChars?.includes('burning_electric'));
    setChk('headache_char_boring_severe', patient.headacheChars?.includes('boring_severe'));

    // Triggers
    setChk('headache_trig_valsalva', patient.headache_trig_valsalva);
    setChk('headache_trig_supine_morning', patient.headache_trig_supine_morning);
    setChk('headache_trig_upright', patient.headache_trig_upright);
    setChk('headache_trig_jaw_claudication', patient.headache_trig_jaw_claudication);
    setChk('headache_trig_scalp_tenderness', patient.headache_trig_scalp_tenderness);
    setChk('headache_trig_light_sound', patient.headache_trig_light_sound);
    setChk('headache_trig_stress_fatigue', patient.headache_trig_stress_fatigue);
    const hasTrigOther = Boolean(patient.headache_trig_other);
    setChk('headache_trig_other_chk', hasTrigOther);
    toggleHeadacheBranch('headache_trig_other_wrap', hasTrigOther);
    setVal('headache_trig_other_text', hasTrigOther ? patient.headache_trig_other : '');

    // Neuro & Ocular
    setChk('headache_rf_weakness_numb', patient.headache_rf_weakness_numb);
    setChk('headache_rf_facial_speech', patient.headache_rf_facial_speech);
    setChk('headache_rf_ataxia_walk', patient.headache_rf_ataxia_walk);
    setChk('headache_rf_seizure_syncope', patient.headache_rf_seizure_syncope);
    setChk('headache_rf_altered_mental', patient.headache_rf_altered_mental);
    setChk('headache_rf_fever', patient.headache_rf_fever !== undefined ? patient.headache_rf_fever : patient.headache_rf_fever_stiff_neck);
    setChk('headache_rf_stiff_neck', patient.headache_rf_stiff_neck !== undefined ? patient.headache_rf_stiff_neck : patient.headache_rf_fever_stiff_neck);
    setChk('headache_rf_acute_glaucoma', patient.headache_rf_acute_glaucoma);
    setChk('headache_rf_diplopia_field', patient.headache_rf_diplopia_field);
    setChk('headache_has_visual_aura', patient.headache_has_visual_aura);
    setChk('headache_has_autonomic', patient.headache_has_autonomic);

    // Nausea / Vomiting
    setChk('headache_has_nausea_vomit', patient.headache_has_nausea_vomit);
    handleHeadacheVomitChange();
    if (patient.headache_has_nausea_vomit && patient.headacheVomitStatus && patient.headacheVomitStatus !== 'none') {
      setHeadacheRadioChecked('headacheVomitStatus', patient.headacheVomitStatus);
    }

    // High-Risk Background
    setChk('headache_risk_new_onset_age50', patient.headache_risk_new_onset_age50);
    setChk('headache_risk_recent_trauma', patient.headache_risk_recent_trauma);
    setChk('headache_risk_anticoagulants', patient.headache_risk_anticoagulants);
    setChk('headache_risk_cancer', patient.headache_risk_cancer);
    setChk('headache_risk_immunocompromised', patient.headache_risk_immunocompromised);
    setChk('headache_risk_co_exposure', patient.headache_risk_co_exposure);
    setChk('headache_risk_severe_htn', patient.headache_risk_severe_htn);
    setChk('headache_risk_med_overuse', patient.headache_risk_med_overuse);

    // Female section (C-AP13)
    const isFem = patient.gender === 'หญิง' || isHeadacheFemaleTitle();
    syncHeadacheFemaleSection(isFem);
    if (isFem) {
      const resolvedPreg = (patient.headachePregnancyStatus && patient.headachePregnancyStatus !== 'not_applicable')
        ? patient.headachePregnancyStatus
        : (patient.headache_risk_pregnancy_postpartum ? 'pregnant' : '');
      if (resolvedPreg) setHeadacheRadioChecked('headachePregnancyStatus', resolvedPreg);
      const isPreg = resolvedPreg === 'pregnant';
      toggleHeadacheBranch('headachePregnancyWeeksWrap', isPreg);
      setVal('headachePregnancyWeeks', isPreg ? (patient.headachePregnancyWeeks || '') : '');
      setChk('headache_fem_ocp', patient.headache_fem_ocp);
      setChk('headache_fem_preeclampsia', patient.headache_fem_preeclampsia);
      setVal('headacheLmpDate', patient.headacheLmpDate || '');
    }

    setVal('headache_other_free', patient.otherSymptomsFree || '');
  },

  collectIntake(ctx) {
    const {
      recordId,
      queueNumber,
      randomHn,
      patientName,
      patientAge,
      gender,
      recordStatus,
      hospRecordStatus,
      underlying,
      drugAllergy,
      currentMeds,
      preservedDoctorNotes,
      otherSymptomsFree
    } = ctx;

    const rawDur = parseFloat(document.getElementById('headacheDurationVal')?.value);
    const durationVal = (!isNaN(rawDur) && rawDur > 0) ? rawDur : null;
    const durationUnit = document.getElementById('headacheDurationUnit')?.value || 'hours';
    const headacheOnsetMode = getHeadacheRadioValue('headacheOnsetMode') || 'unspecified';
    const headacheOnsetActivity = getHeadacheRadioValue('headacheOnsetActivity') || 'unspecified';
    const headachePainScore = headachePainScoreTouched ? parseInt(document.getElementById('headachePainScore')?.value || '0', 10) : null;

    const headacheLocs = [];
    if (document.getElementById('headache_loc_unilateral')?.checked) headacheLocs.push('unilateral');
    if (document.getElementById('headache_loc_periorbital')?.checked) headacheLocs.push('periorbital');
    if (document.getElementById('headache_loc_occipital')?.checked) headacheLocs.push('occipital');
    if (document.getElementById('headache_loc_band')?.checked) headacheLocs.push('band');
    if (document.getElementById('headache_loc_diffuse')?.checked) headacheLocs.push('diffuse');
    if (document.getElementById('headache_loc_facial_sinus')?.checked) headacheLocs.push('facial_sinus');
    const isLocOther = document.getElementById('headache_loc_other_chk')?.checked || false;
    const headacheLocOther = isLocOther ? (document.getElementById('headache_loc_other_text')?.value.trim() || '') : '';
    if (isLocOther && headacheLocOther) headacheLocs.push(`อื่นๆ: ${headacheLocOther}`);

    const headacheUnilateralSide = document.getElementById('headache_loc_unilateral')?.checked
      ? (getHeadacheRadioValue('headacheUnilateralSide') || 'none')
      : 'none';
    const headachePeriorbitalSide = document.getElementById('headache_loc_periorbital')?.checked
      ? (getHeadacheRadioValue('headachePeriorbitalSide') || 'none')
      : 'none';

    const headacheChars = [];
    if (document.getElementById('headache_char_throbbing')?.checked) headacheChars.push('throbbing');
    if (document.getElementById('headache_char_tight_dull')?.checked) headacheChars.push('tight_dull');
    if (document.getElementById('headache_char_sharp_stabbing')?.checked) headacheChars.push('sharp_stabbing');
    if (document.getElementById('headache_char_burning_electric')?.checked) headacheChars.push('burning_electric');
    if (document.getElementById('headache_char_boring_severe')?.checked) headacheChars.push('boring_severe');

    const headache_trig_valsalva = document.getElementById('headache_trig_valsalva')?.checked || false;
    const headache_trig_supine_morning = document.getElementById('headache_trig_supine_morning')?.checked || false;
    const headache_trig_upright = document.getElementById('headache_trig_upright')?.checked || false;
    const headache_trig_jaw_claudication = document.getElementById('headache_trig_jaw_claudication')?.checked || false;
    const headache_trig_scalp_tenderness = document.getElementById('headache_trig_scalp_tenderness')?.checked || false;
    const headache_trig_light_sound = document.getElementById('headache_trig_light_sound')?.checked || false;
    const headache_trig_stress_fatigue = document.getElementById('headache_trig_stress_fatigue')?.checked || false;
    const isTrigOther = document.getElementById('headache_trig_other_chk')?.checked || false;
    const headache_trig_other = isTrigOther ? (document.getElementById('headache_trig_other_text')?.value.trim() || '') : '';

    const headache_rf_weakness_numb = document.getElementById('headache_rf_weakness_numb')?.checked || false;
    const headache_rf_facial_speech = document.getElementById('headache_rf_facial_speech')?.checked || false;
    const headache_rf_ataxia_walk = document.getElementById('headache_rf_ataxia_walk')?.checked || false;
    const headache_rf_seizure_syncope = document.getElementById('headache_rf_seizure_syncope')?.checked || false;
    const headache_rf_altered_mental = document.getElementById('headache_rf_altered_mental')?.checked || false;
    const headache_rf_fever = document.getElementById('headache_rf_fever')?.checked || false;
    const headache_rf_stiff_neck = document.getElementById('headache_rf_stiff_neck')?.checked || false;
    const headache_rf_fever_stiff_neck = headache_rf_fever && headache_rf_stiff_neck;
    const headache_rf_acute_glaucoma = document.getElementById('headache_rf_acute_glaucoma')?.checked || false;
    const headache_rf_diplopia_field = document.getElementById('headache_rf_diplopia_field')?.checked || false;
    const headache_has_visual_aura = document.getElementById('headache_has_visual_aura')?.checked || false;
    const headache_has_autonomic = document.getElementById('headache_has_autonomic')?.checked || false;

    const headache_has_nausea_vomit = document.getElementById('headache_has_nausea_vomit')?.checked || false;
    const headacheVomitStatus = headache_has_nausea_vomit
      ? (getHeadacheRadioValue('headacheVomitStatus') || 'nausea_only')
      : 'none';

    const headache_risk_new_onset_age50 = document.getElementById('headache_risk_new_onset_age50')?.checked || false;
    const headache_risk_recent_trauma = document.getElementById('headache_risk_recent_trauma')?.checked || false;
    const headache_risk_anticoagulants = document.getElementById('headache_risk_anticoagulants')?.checked || false;
    const headache_risk_cancer = (document.getElementById('headache_risk_cancer')?.checked || document.getElementById('ud_cancer')?.checked) || false;
    const headache_risk_immunocompromised = document.getElementById('headache_risk_immunocompromised')?.checked || false;
    const headache_risk_co_exposure = document.getElementById('headache_risk_co_exposure')?.checked || false;
    const headache_risk_severe_htn = document.getElementById('headache_risk_severe_htn')?.checked || false;
    const headache_risk_med_overuse = document.getElementById('headache_risk_med_overuse')?.checked || false;

    const isFem = gender === 'หญิง' || isHeadacheFemaleTitle();
    const headachePregnancyStatus = isFem ? (getHeadacheRadioValue('headachePregnancyStatus') || '') : 'not_applicable';
    const headachePregnancyWeeks = (isFem && headachePregnancyStatus === 'pregnant')
      ? (document.getElementById('headachePregnancyWeeks')?.value.trim() || '')
      : '';
    const headache_fem_ocp = isFem && (document.getElementById('headache_fem_ocp')?.checked || false);
    const headache_fem_preeclampsia = isFem && (document.getElementById('headache_fem_preeclampsia')?.checked || false);
    const headacheLmpDate = isFem ? (document.getElementById('headacheLmpDate')?.value.trim() || '') : '';
    const headache_risk_pregnancy_postpartum = isFem && (headachePregnancyStatus === 'pregnant' || headachePregnancyStatus === 'postpartum_6w');

    return {
      id: recordId,
      queue_number: queueNumber,
      hn: randomHn,
      name: patientName,
      age: patientAge,
      gender: gender,
      chief_complaint: 'headache',
      chief_complaint_title: 'ปวดศีรษะ',
      status: recordStatus,
      timestamp: new Date().toISOString(),
      durationVal,
      durationUnit,
      headacheOnsetMode,
      headacheOnsetActivity,
      headachePainScore,
      headacheLocs,
      headacheUnilateralSide,
      headachePeriorbitalSide,
      headacheLocOther,
      headacheChars,
      headache_trig_valsalva,
      headache_trig_supine_morning,
      headache_trig_upright,
      headache_trig_jaw_claudication,
      headache_trig_scalp_tenderness,
      headache_trig_light_sound,
      headache_trig_stress_fatigue,
      headache_trig_other,
      headache_rf_weakness_numb,
      headache_rf_facial_speech,
      headache_rf_ataxia_walk,
      headache_rf_seizure_syncope,
      headache_rf_altered_mental,
      headache_rf_fever,
      headache_rf_stiff_neck,
      headache_rf_fever_stiff_neck,
      headache_rf_acute_glaucoma,
      headache_rf_diplopia_field,
      headache_has_visual_aura,
      headache_has_autonomic,
      headache_has_nausea_vomit,
      headacheVomitStatus,
      headache_risk_new_onset_age50,
      headache_risk_recent_trauma,
      headache_risk_pregnancy_postpartum,
      headache_risk_anticoagulants,
      headache_risk_cancer,
      headache_risk_immunocompromised,
      headache_risk_co_exposure,
      headache_risk_severe_htn,
      headache_risk_med_overuse,
      headachePregnancyStatus,
      headachePregnancyWeeks,
      headache_fem_ocp,
      headache_fem_preeclampsia,
      headacheLmpDate,
      otherSymptomsFree: otherSymptomsFree || '',
      hospRecordStatus: hospRecordStatus || 'unspecified',
      underlying: underlying && underlying.length > 0 ? underlying : ((hospRecordStatus === 'self' || hospRecordStatus === 'additional') ? ['ปฏิเสธ'] : []),
      drugAllergy: drugAllergy || 'ไม่ได้ระบุ',
      currentMeds: currentMeds || 'ไม่ได้ระบุ',
      doctor_notes: preservedDoctorNotes
    };
  },

  isRedFlag(p) {
    return evaluateHeadacheRedFlags(p).length > 0;
  },

  evaluateRedFlags(patient) {
    return evaluateHeadacheRedFlags(patient);
  },

  updateOutputs(patient) {
    return updateHeadacheOutputs(patient);
  }
};

if (typeof registerCcModule === 'function') {
  registerCcModule(headacheModule);
} else if (typeof window !== 'undefined' && typeof window.registerCcModule === 'function') {
  window.registerCcModule(headacheModule);
}

if (typeof window !== 'undefined') {
  window.toggleHeadacheBranch = toggleHeadacheBranch;
  window.clearHeadachePainScore = clearHeadachePainScore;
  window.handleHeadachePainScoreChange = handleHeadachePainScoreChange;
  window.setHeadachePainScore = setHeadachePainScore;
  window.handleHeadacheLocationChange = handleHeadacheLocationChange;
  window.handleHeadacheLocOtherToggle = handleHeadacheLocOtherToggle;
  window.handleHeadacheTrigOtherToggle = handleHeadacheTrigOtherToggle;
  window.handleHeadacheVomitChange = handleHeadacheVomitChange;
  window.handleHeadachePregnancyChange = handleHeadachePregnancyChange;
  window.syncHeadacheCancerPmh = syncHeadacheCancerPmh;
}
