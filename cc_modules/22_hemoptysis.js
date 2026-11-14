// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 22_hemoptysis.js
// อาการนำ: ไอเป็นเลือด (Hemoptysis / Coughing Up Blood)
// รองรับ Zero Default Bias, Progressive Disclosure, Universal Date/Time,
// Rapid Note De-duplication, และ TDD Core Guard
// =========================================================================

// --- Pain Score Touch State Tracking ---
let hemoPainScoreTouched = false;

function clearHemoPainScore() {
  hemoPainScoreTouched = false;
  const slider = document.getElementById('hemoPainScore');
  if (slider) slider.value = 0;
  const emojiEl = document.getElementById('hemoPainScoreEmoji');
  const textEl = document.getElementById('hemoPainScoreText');
  const badgeEl = document.getElementById('hemoPainScoreBadge');
  const clearBtn = document.getElementById('hemoPainScoreClearBtn');
  if (emojiEl) emojiEl.textContent = '⚪';
  if (textEl) textEl.textContent = 'ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)';
  if (badgeEl) badgeEl.className = 'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all';
  if (clearBtn) clearBtn.classList.add('hidden');
}

function handleHemoPainScoreChange(val) {
  hemoPainScoreTouched = true;
  const num = parseInt(val, 10);
  const emojiEl = document.getElementById('hemoPainScoreEmoji');
  const textEl = document.getElementById('hemoPainScoreText');
  const badgeEl = document.getElementById('hemoPainScoreBadge');
  const clearBtn = document.getElementById('hemoPainScoreClearBtn');
  if (clearBtn) clearBtn.classList.remove('hidden');
  if (!emojiEl || !textEl || !badgeEl) return;

  let emoji = '😐';
  let label = 'ปวดปานกลาง';
  let badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';

  if (num === 0) {
    emoji = '😊';
    label = 'สบายดี (ไม่เจ็บเลย)';
    badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  } else if (num <= 3) {
    emoji = '🙂';
    label = 'เจ็บเล็กน้อย (ทนได้)';
    badgeClass = 'bg-lime-100 text-lime-800 border-lime-300';
  } else if (num <= 6) {
    emoji = '😐';
    label = 'เจ็บปานกลาง (รบกวนการหายใจ)';
    badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
  } else if (num <= 8) {
    emoji = '😣';
    label = 'เจ็บรุนแรง (หายใจเข้าลึกไม่ได้)';
    badgeClass = 'bg-orange-100 text-orange-800 border-orange-300';
  } else {
    emoji = '😫';
    label = 'เจ็บรุนแรงมากที่สุด';
    badgeClass = 'bg-rose-100 text-rose-800 border-rose-300';
  }

  emojiEl.textContent = emoji;
  textEl.textContent = `${num}/10 คะแนน - ${label}`;
  badgeEl.className = `inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-auto transition-all ${badgeClass}`;
}

// --- Toggle UI Helper Functions ---
function toggleHemoPreCoughSub(isVisible) {
  const el = document.getElementById('hemoPreCoughSub');
  if (el) {
    el.classList.toggle('hidden', !isVisible);
    if (!isVisible) {
      const valInput = document.getElementById('hemoPreCoughDurVal');
      if (valInput) valInput.value = '';
    }
  }
}

function toggleHemoChestPainSub(isVisible) {
  const el = document.getElementById('hemoChestPainSub');
  if (el) {
    el.classList.toggle('hidden', !isVisible);
    if (!isVisible) {
      el.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
      clearHemoPainScore();
    }
  }
}

function toggleHemoWarningGroup(groupId, isVisible) {
  const el = document.getElementById(groupId);
  if (el) {
    el.classList.toggle('hidden', !isVisible);
    if (!isVisible) {
      el.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    }
  }
}

function toggleHemoSmokingSub(isVisible) {
  const el = document.getElementById('hemoSmokingSub');
  if (el) {
    el.classList.toggle('hidden', !isVisible);
    if (!isVisible) {
      const yrs = document.getElementById('hemoSmokingYears');
      const pks = document.getElementById('hemoSmokingPacks');
      if (yrs) yrs.value = '';
      if (pks) pks.value = '';
    }
  }
}

// --- Red Flag Evaluator ---
function evaluateHemoptysisRedFlags(patient) {
  const rfs = [];
  if (!patient) return rfs;

  const warnSigns = Array.isArray(patient.hemoWarningSigns) ? patient.hemoWarningSigns : [];
  const chestPainTypes = Array.isArray(patient.hemoChestPainType) ? patient.hemoChestPainType : [];
  const meds = Array.isArray(patient.hemoBleedingMeds) ? patient.hemoBleedingMeds : [];
  const pastPulm = Array.isArray(patient.hemoPastPulmonary) ? patient.hemoPastPulmonary : [];
  const vs = patient.vital_signs || {};

  // SBP and Shock Index calculation
  const sbp = typeof vs.sbp === 'number' ? vs.sbp : (parseInt(vs.sbp, 10) || null);
  const pr = typeof vs.pr === 'number' ? vs.pr : (parseInt(vs.pr, 10) || null);
  const spo2 = typeof vs.spo2 === 'number' ? vs.spo2 : (parseInt(vs.spo2, 10) || null);
  const shockIndex = (sbp && pr && sbp > 0) ? (pr / sbp) : null;

  // 1. Massive Hemoptysis with Impending Asphyxiation (ESI 1)
  if (patient.hemoBloodVolume === 'vol_massive_over_cup' || warnSigns.includes('warn_choking_airway_threat')) {
    rfs.push({
      key: 'rf_massive_asphyxiation',
      level: 1,
      textTh: 'Massive Hemoptysis with Impending Asphyxiation / เลือดออกปริมาณมากเสี่ยงทางเดินหายใจอุดกั้นเฉียบพลัน',
      risk: 'Asphyxiation from blood flooding the airways; high mortality if not protected immediately.',
      suggestedAction: 'Immediate Resuscitation Room placement, prepare for immediate large-bore ETT intubation or Rigid Bronchoscopy, stat Blood crossmatch.'
    });
  }

  // 2. Hemodynamic Instability / Hypovolemic Shock (ESI 1)
  if (warnSigns.includes('warn_fainting_syncope') || warnSigns.includes('warn_profuse_sweat_cold_shock') || (sbp !== null && sbp < 90) || (shockIndex !== null && shockIndex >= 0.9)) {
    rfs.push({
      key: 'rf_hemodynamic_shock',
      level: 1,
      textTh: 'Hemodynamic Instability / Hypovolemic Shock (สัญญาณชีพไม่คงที่จากภาวะเลือดออกในปอด)',
      risk: 'Circulatory collapse secondary to ongoing blood loss.',
      suggestedAction: 'Two large-bore IV lines (18G), aggressive fluid resuscitation, type and crossmatch PRC 4 units.'
    });
  }

  // 3. Acute Respiratory Failure / Severe Hypoxemia (ESI 1)
  if (patient.hemoDyspnea === 'dyspnea_severe_rest_orthopnea' || (spo2 !== null && spo2 < 90)) {
    rfs.push({
      key: 'rf_respiratory_failure',
      level: 1,
      textTh: 'Acute Respiratory Failure / Severe Hypoxemia (หายใจหอบเหนื่อยรุนแรง หรือ SpO2 < 90%)',
      risk: 'Severe gas exchange failure due to alveolar flooding and bronchial obstruction.',
      suggestedAction: 'High-flow oxygen or HFNC, maintain SpO2 >= 95%, prepare airway equipment.'
    });
  }

  // 4. Suspected Thoracic Aortic Dissection / Tearing Chest Pain (ESI 1)
  if (chestPainTypes.includes('tearing_ripping_back')) {
    rfs.push({
      key: 'rf_aortic_dissection_chest',
      level: 1,
      textTh: 'Suspected Thoracic Aortic Dissection / Aortobronchial Fistula (สงสัยหลอดเลือดเอออร์ตาฉีกขาดร้าวทะลุหลัง)',
      risk: 'Aortobronchial fistula or acute aortic dissection rupture with catastrophic hemoptysis.',
      suggestedAction: 'Stat CT Angiography Chest, emergent Cardiothoracic surgery consultation, avoid anticoagulants.'
    });
  }

  // 5. Suspected Pulmonary Embolism (PE) with Infarction (ESI 2)
  if (chestPainTypes.includes('pleuritic_sharp') || warnSigns.includes('warn_unilateral_leg_swelling') || warnSigns.includes('warn_long_travel_immobility') || warnSigns.includes('warn_post_op_bedridden') || warnSigns.includes('warn_history_dvt_pe')) {
    rfs.push({
      key: 'rf_suspected_pe_dvt',
      level: 2,
      textTh: 'Suspected Pulmonary Embolism (PE) with Infarction / สงสัยลิ่มเลือดอุดกั้นปอด',
      risk: 'Pulmonary infarction from thromboembolism; risk of sudden hemodynamic collapse.',
      suggestedAction: 'Stat CTPA (CT Pulmonary Angiography), 12-lead ECG, bedside cardiac echo, evaluate for anticoagulation.'
    });
  }

  // 6. Submassive Hemoptysis with Active Bleeding (ESI 2)
  if (patient.hemoBloodVolume === 'vol_half_to_full_cup' && patient.hemoActiveStatus === 'status_active_bleeding') {
    rfs.push({
      key: 'rf_submassive_active',
      level: 2,
      textTh: 'Submassive Hemoptysis with Active Bleeding / ไอเลือดสดปานกลางและยังมีเลือดออกต่อเนื่อง',
      risk: 'Progression to massive hemoptysis; bronchial artery erosion.',
      suggestedAction: 'Admit to intermediate/ICU bed, urgent Chest CT Angiogram, consult Pulmonology/Interventional Radiology.'
    });
  }

  // 7. Suspected Active Cavitary Pulmonary TB (ESI 2)
  if ((warnSigns.includes('warn_fever_afternoon_night_sweat') || warnSigns.includes('warn_unintentional_weight_loss')) && (pastPulm.includes('tb_prior_or_contact') || patient.hemoBloodChar === 'char_true_frothy_red')) {
    rfs.push({
      key: 'rf_cavitary_tb',
      level: 2,
      textTh: 'Suspected Active Cavitary Tuberculosis (TB) with Hemoptysis / สงสัยวัณโรคปอดระยะลุกลาม',
      risk: 'Airborne transmission to healthcare workers and patients, Rasmussen aneurysm erosion.',
      suggestedAction: 'Strict Airborne Isolation in Negative Pressure room, Sputum AFB x 3, GeneXpert MTB/RIF, stat CXR.'
    });
  }

  // 8. Anticoagulant-Associated Hemoptysis / Coagulopathy (ESI 2)
  if (meds.includes('med_anticoagulant') || meds.includes('med_antiplatelet') || meds.includes('med_unknown_prescribed')) {
    rfs.push({
      key: 'rf_anticoagulant_bleeding',
      level: 2,
      textTh: 'Anticoagulant-Associated Hemoptysis / ภาวะเลือดออกจากยาต้านการแข็งตัวของเลือด',
      risk: 'Uncontrolled pulmonary hemorrhage due to impaired coagulation cascade.',
      suggestedAction: 'Hold anticoagulants immediately, stat Coagulogram (PT, INR, PTT), prepare reversal agents (Vit K, PCC, Protamine).'
    });
  }

  // 9. Necrotizing Pneumonia / Lung Abscess with Sepsis (ESI 2)
  if (patient.hemoPriorSputum === 'sputum_foul_abscess_green' || (warnSigns.includes('warn_high_fever_chills') && patient.hemoDyspnea !== 'dyspnea_none')) {
    rfs.push({
      key: 'rf_necrotizing_abscess',
      level: 2,
      textTh: 'Necrotizing Pneumonia / Lung Abscess / สงสัยปอดอักเสบเนื้อตายหรือฝีในปอด',
      risk: 'Pulmonary necrosis, cavitary lung destruction, sepsis.',
      suggestedAction: 'Blood and sputum cultures, stat IV Broad-spectrum antibiotics (covering anaerobes and MRSA/Pseudomonas), CXR/CT Chest.'
    });
  }

  // 10. Suspected Bronchogenic Carcinoma (Lung Cancer) (ESI 3)
  if (warnSigns.includes('warn_unintentional_weight_loss') || warnSigns.includes('warn_hoarseness_weeks') || pastPulm.includes('past_lung_cancer') || (patient.age >= 50 && patient.hemoSmokingStatus === 'smoking_regular' && (patient.hemoSmokingYears || 0) >= 20)) {
    if (!rfs.some(r => r.key === 'rf_cavitary_tb')) {
      rfs.push({
        key: 'rf_lung_malignancy',
        level: 3,
        textTh: 'Suspected Bronchogenic Carcinoma (Lung Cancer) / สงสัยโรคมะเร็งปอด',
        risk: 'Endobronchial tumor vascular invasion.',
        suggestedAction: 'Stat CXR, schedule Contrast-enhanced CT Chest, outpatient or inpatient Pulmonology referral.'
      });
    }
  }

  return rfs;
}

// --- Formatters for Doctor Rapid Note ---
function formatHemoBloodChar(patient) {
  const map = {
    char_true_frothy_red: 'เลือดสดสีแดง มีฟองอากาศปน ออกมาเวลาไออย่างรุนแรง (True hemoptysis)',
    char_streaked_sputum: 'เสมหะปนเลือดเป็นเส้นๆ สีแดงเรื่อๆ หรือสีน้ำตาลปน (Blood-streaked)',
    char_coffee_ground_vomit: 'ขย้อนหรืออาเจียนเป็นสีกาแฟ/มีเศษอาหารปน (Hematemesis risk)',
    char_postnasal_epistaxis: 'เลือดกำเดาไหลลงคอแล้วบ้วนออกมา (Pseudohemoptysis risk)'
  };
  return map[patient.hemoBloodChar] || 'ไม่ได้ระบุ';
}

function formatHemoBloodVolume(patient) {
  const map = {
    vol_streaks_sputum: 'เลือดออกเป็นเส้นๆ ปนในเสมหะ (< 1 ช้อนชา)',
    vol_tablespoon: 'ประมาณ 1-2 ช้อนโต๊ะ (10-30 มล.)',
    vol_half_to_full_cup: 'ประมาณครึ่งแก้วถึงเต็มแก้วน้ำ (50-100 มล.)',
    vol_massive_over_cup: 'เลือดสดทะลักมากกว่าแก้วน้ำ (> 100-200 มล. หรือก้อนลิ่มเลือดต่อเนื่อง) 🚩'
  };
  return map[patient.hemoBloodVolume] || 'ไม่ได้ระบุ';
}

function formatHemoFrequency(patient) {
  const map = {
    episodes_single: 'ครั้งเดียวแล้วหยุด',
    episodes_two_four: '2-4 ครั้ง',
    episodes_over_5: 'มากกว่า 5 ครั้งขึ้นไป',
    episodes_frequent_continuous: 'แทบทุกครั้งที่ไอ / ต่อเนื่องตลอดเวลา 🚩'
  };
  return map[patient.hemoEpisodeCount] || 'ไม่ได้ระบุ';
}

function formatHemoActiveStatus(patient) {
  const map = {
    status_active_bleeding: 'ยังมีอาการไอเป็นเลือดสดอยู่เรื่อยๆ (Active bleeding) 🚩',
    status_streaks_only: 'เลือดหยุดแล้ว เหลือเพียงเสมหะปนเลือดจางๆ',
    status_stopped_completely: 'เลือดหยุดสนิทแล้ว (Bleeding stopped)'
  };
  return map[patient.hemoActiveStatus] || 'ไม่ได้ระบุ';
}

function formatHemoDyspnea(patient) {
  const map = {
    dyspnea_none: 'หายใจปกติ ไม่เหนื่อย',
    dyspnea_exertional: 'หายใจหอบเหนื่อยเวลาออกแรงหรือเดิน',
    dyspnea_severe_rest_orthopnea: 'หายใจหอบเหนื่อยรุนแรงเฉียบพลัน นอนราบไม่ได้ 🚩'
  };
  return map[patient.hemoDyspnea] || 'ไม่ได้ระบุ';
}

function formatHemoSputum(patient) {
  const map = {
    sputum_none_dry_cough: 'ไอแห้งๆ ไม่มีเสมหะ',
    sputum_normal_white_yellow: 'เสมหะสีขาวใสหรือเหลืองปกติ',
    sputum_foul_abscess_green: 'เสมหะสีเขียวข้น หรือมีกลิ่นเหม็นเน่ารุนแรง 🚩',
    sputum_pink_frothy_edema: 'เสมหะเป็นฟองสีชมพูจางๆ (Pink frothy) 🚩'
  };
  return map[patient.hemoPriorSputum] || 'ไม่ได้ระบุ';
}

function formatHemoChestPain(patient) {
  if (patient.hemoChestPainMaster === 'no') return 'ปฏิเสธอาการเจ็บหน้าอก';
  if (patient.hemoChestPainMaster === 'yes') {
    const types = Array.isArray(patient.hemoChestPainType) ? patient.hemoChestPainType : [];
    const typeMap = {
      pleuritic_sharp: 'เจ็บแปล๊บเวลาหายใจเข้าลึก/ไอ (Pleuritic pain)',
      ischemic_pressure: 'เจ็บแน่นอึดอัดกลางอกคล้ายของหนักทับ (Ischemia)',
      tearing_ripping_back: 'เจ็บฉีกขาดในอกร้าวทะลุหลัง (Tearing dissection risk) 🚩'
    };
    const desc = types.map(t => typeMap[t] || t).join(', ') || 'มีอาการเจ็บหน้าอก';
    const scoreStr = (typeof patient.painScore === 'number') ? ` (Pain Score: ${patient.painScore}/10)` : '';
    return `${desc}${scoreStr}`;
  }
  return 'ไม่ได้ระบุ';
}

// --- Rapid Note Renderer (Doctor View) ---
function renderHemoptysisRapidHpi(patient) {
  const durVal = patient.durationVal;
  const durUnitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durUnit = durUnitMap[patient.durationUnit] || 'วัน';
  const durationStr = durVal ? `${durVal} ${durUnit}` : 'ไม่ระบุ';

  const warnSigns = Array.isArray(patient.hemoWarningSigns) ? patient.hemoWarningSigns : [];
  const meds = Array.isArray(patient.hemoBleedingMeds) ? patient.hemoBleedingMeds : [];
  const pastPulm = Array.isArray(patient.hemoPastPulmonary) ? patient.hemoPastPulmonary : [];

  const posList = [];
  const negList = [];

  // Positives evaluation
  if (patient.hemoPreCoughMaster === 'yes') {
    const preDurStr = patient.hemoPreCoughDurVal
      ? `${patient.hemoPreCoughDurVal} ${durUnitMap[patient.hemoPreCoughDurUnit] || 'วัน'}`
      : 'ระยะเวลาไม่ระบุ';
    posList.push(`มีอาการไอนำมาก่อนหน้าเป็นเวลา ${preDurStr}`);
  }
  if (patient.hemoBloodVolume === 'vol_massive_over_cup') {
    posList.push('ไอเลือดสดทะลักปริมาณมากกว่าแก้วน้ำ (> 100-200 มล.) 🚩');
  } else if (patient.hemoBloodVolume === 'vol_half_to_full_cup') {
    posList.push('ไอเลือดสดปริมาณครึ่งแก้วถึงหนึ่งแก้ว (50-100 มล.)');
  }
  if (patient.hemoActiveStatus === 'status_active_bleeding') {
    posList.push('ยังมีอาการไอเป็นเลือดสดอยู่เรื่อยๆ (Active bleeding) 🚩');
  }
  if (patient.hemoDyspnea === 'dyspnea_severe_rest_orthopnea') {
    posList.push('หายใจหอบเหนื่อยรุนแรงเฉียบพลัน นอนราบไม่ได้ 🚩');
  } else if (patient.hemoDyspnea === 'dyspnea_exertional') {
    posList.push('หายใจหอบเหนื่อยเวลาออกแรงหรือเดิน');
  }
  if (Array.isArray(patient.hemoChestPainType) && patient.hemoChestPainType.includes('pleuritic_sharp')) {
    posList.push('เจ็บแปล๊บหน้าอกเวลาหายใจเข้าลึกๆ หรือเวลาไอ (Pleuritic chest pain)');
  }
  if (Array.isArray(patient.hemoChestPainType) && patient.hemoChestPainType.includes('tearing_ripping_back')) {
    posList.push('เจ็บเหมือนอะไรฉีกขาดในอก ร้าวทะลุไปหลัง (Tearing dissection risk) 🚩');
  }

  // Warning signs positives
  if (warnSigns.includes('warn_choking_airway_threat')) posList.push('ไอสำลักเลือด หายใจติดขัด กลืนไม่ลง (Airway threat) 🚩');
  if (warnSigns.includes('warn_fainting_syncope')) posList.push('หน้ามืด วูบ หรือหมดสติไปชั่วขณะ 🚩');
  if (warnSigns.includes('warn_profuse_sweat_cold_shock')) posList.push('เหงื่อแตกท่วมตัว ผิวหนังซีดเย็น ตัวสั่น (Shock sign) 🚩');
  if (warnSigns.includes('warn_palpitation_tachycardia')) posList.push('ใจสั่น หัวใจเต้นรัวเร็ว รู้สึกเหนื่อยแทบขาดใจ');
  if (warnSigns.includes('warn_unilateral_leg_swelling')) posList.push('ขาบวมโต หรือปวดตึงน่องข้างใดข้างหนึ่งชัดเจน (Suspected DVT) 🚩');
  if (warnSigns.includes('warn_long_travel_immobility')) posList.push('ประวัตินั่งรถยนต์หรือเครื่องบินเดินทางไกลต่อเนื่องเกิน 4-6 ชม.');
  if (warnSigns.includes('warn_post_op_bedridden')) posList.push('เพิ่งผ่านการผ่าตัดใหญ่หรือนอนพักรักษาตัวติดเตียงเกิน 3 วัน');
  if (warnSigns.includes('warn_history_dvt_pe')) posList.push('มีประวัติเคยเป็นโรคลิ่มเลือดอุดตันในเส้นเลือดที่แขนหรือขามาก่อน');
  if (warnSigns.includes('warn_high_fever_chills')) posList.push('มีไข้สูง หนาวสั่นสะท้านจับไข้');
  if (warnSigns.includes('warn_fever_afternoon_night_sweat')) posList.push('มีไข้ต่ำๆ รุมๆ ตอนบ่าย ร่วมกับเหงื่อออกท่วมตัวตอนกลางคืน (B-symptoms / TB)');
  if (warnSigns.includes('warn_unintentional_weight_loss')) posList.push('น้ำหนักตัวลดลงฮวบผิดปกติโดยไม่ได้ตั้งใจลด หรือเบื่ออาหารมาก');
  if (warnSigns.includes('warn_hoarseness_weeks')) posList.push('มีอาการเสียงแหบลงผิดปกติ ต่อเนื่องหลายสัปดาห์');

  // Past pulmonary & Smoking positives
  if (pastPulm.includes('tb_prior_or_contact')) posList.push('เคยป่วยเป็นวัณโรคปอด หรือมีคนในบ้านกำลังรักษาวัณโรค');
  if (pastPulm.includes('past_bronchiectasis')) posList.push('มีโรคประจำตัวหลอดลมโป่งพอง (Bronchiectasis)');
  if (pastPulm.includes('past_copd_asthma')) posList.push('มีโรคประจำตัวถุงลมโป่งพอง (COPD) หรือหอบหืด');
  if (pastPulm.includes('past_lung_cancer')) posList.push('มีประวัติโรคมะเร็งปอด');
  if (pastPulm.includes('past_heart_failure_valvular')) posList.push('มีโรคประจำตัวทางหัวใจ (ลิ้นหัวใจตีบ หรือหัวใจล้มเหลว)');
  if (patient.hemoSmokingStatus === 'smoking_regular') {
    posList.push(`ประวัติสูบบุหรี่เป็นประจำ (${patient.hemoSmokingYears || 0} ปี, ${patient.hemoSmokingPacks || 0} ซอง/วัน)`);
  }

  // Meds positives
  if (meds.includes('med_anticoagulant')) posList.push('รับประทานยาต้านการแข็งตัวของเลือด (Warfarin/DOACs) 🚩');
  if (meds.includes('med_antiplatelet')) posList.push('รับประทานยาต้านเกล็ดเลือด (Aspirin/Clopidogrel)');
  if (meds.includes('med_unknown_prescribed')) posList.push('มียาประจำตัว แต่ไม่แน่ใจหรือจำชื่อยาไม่ได้ 🚩');

  if (patient.otherSymptomsFree) {
    posList.push(patient.otherSymptomsFree);
  }

  // Negatives evaluation
  if (patient.hemoPreCoughMaster === 'no') negList.push('ไม่มีอาการไอนำมาก่อนหน้า (เพิ่งเริ่มไอและมีเลือดออกทันที)');
  if (patient.hemoActiveStatus === 'status_stopped_completely') negList.push('เลือดหยุดไหลสนิทแล้ว (No active bleeding)');
  if (patient.hemoDyspnea === 'dyspnea_none') negList.push('ปฏิเสธหายใจหอบเหนื่อย หายใจปกติ');
  if (patient.hemoChestPainMaster === 'no') negList.push('ปฏิเสธอาการเจ็บหน้าอกทุกรูปแบบ');
  if (!warnSigns.includes('warn_choking_airway_threat')) negList.push('ปฏิเสธไอสำลักหรือรู้สึกมีก้อนเลือดขวางทางเดินหายใจ');
  if (!warnSigns.includes('warn_fainting_syncope') && !warnSigns.includes('warn_profuse_sweat_cold_shock')) {
    negList.push('ปฏิเสธหน้ามืด วูบ เป็นลม และไม่มีเหงื่อแตกตัวเย็น');
  }
  if (!warnSigns.includes('warn_unilateral_leg_swelling')) negList.push('ขาไม่อ่อนแรง ขาไม่บวมโตข้างเดียว ไม่ปวดน่อง (No DVT signs)');
  if (!warnSigns.includes('warn_high_fever_chills') && !warnSigns.includes('warn_fever_afternoon_night_sweat')) {
    negList.push('ปฏิเสธไข้หนาวสั่น และไม่มีไข้ต่ำเหงื่อออกตอนกลางคืน');
  }
  if (!warnSigns.includes('warn_unintentional_weight_loss')) negList.push('น้ำหนักตัวไม่ลดฮวบ เบื่ออาหารปฏิเสธ');
  if (!warnSigns.includes('warn_hoarseness_weeks')) negList.push('ปฏิเสธเสียงแหบ');
  if (pastPulm.includes('pulm_none')) negList.push('ปฏิเสธโรคประจำตัวทางปอดและหัวใจ');
  if (meds.includes('meds_none')) negList.push('ปฏิเสธยาต้านการแข็งตัวของเลือดและยาต้านเกล็ดเลือด');

  const hospLabel = {
    complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
    additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
    self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
    unspecified: 'ไม่ได้ระบุ'
  }[patient.hospRecordStatus] || 'ไม่ได้ระบุ';

  let udDisplay = 'ปฏิเสธ';
  if (patient.underlying && patient.underlying.length > 0) {
    const filteredUd = (Array.isArray(patient.underlying) ? patient.underlying : [patient.underlying])
      .filter(u => u && !u.includes('ปฏิเสธ') && u !== 'ไม่มี' && u !== 'ไม่มีโรคประจำตัว');
    if (filteredUd.length > 0) udDisplay = filteredUd.join(', ');
  }
  const allergyDisplay = (!patient.drugAllergy || patient.drugAllergy.includes('ปฏิเสธ') || patient.drugAllergy === 'ไม่มี') ? 'ปฏิเสธ' : patient.drugAllergy;
  const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ' || patient.currentMeds === 'ไม่มี') ? 'ไม่มี' : patient.currentMeds;
  const docNotes = patient.doctor_notes || {};
  const redFlags = evaluateHemoptysisRedFlags(patient);

  const defaultRapid =
`[Chief Complaint (CC)]
ไอเป็นเลือด (Hemoptysis) มา ${durationStr}

[History of Present Illness (HPI)]
• ระยะเวลาที่มีอาการ: ${durVal ? `ไอเป็นเลือดมา ${durationStr}` : 'ไม่ระบุ'} (สถานะ: ${formatHemoActiveStatus(patient)}, ความถี่: ${formatHemoFrequency(patient)})
• ลักษณะของเลือด: ${formatHemoBloodChar(patient)}
• ปริมาณเลือดในครั้งที่ออกมากที่สุด: ${formatHemoBloodVolume(patient)}
• ประวัติไอนำมาก่อน: ${patient.hemoPreCoughMaster === 'yes' ? `มีไอนำมาก่อน ${patient.hemoPreCoughDurVal || ''} ${durUnitMap[patient.hemoPreCoughDurUnit] || 'วัน'} (เสมหะเดิม: ${formatHemoSputum(patient)})` : 'ไม่มีไอนำมาก่อนหน้า'}
• อาการเหนื่อยหอบ: ${formatHemoDyspnea(patient)}
• อาการเจ็บหน้าอก: ${formatHemoChestPain(patient)}

• Pertinent Positives:
${posList.length > 0 ? posList.map(p => `  - ${p}`).join('\n') : '  - ไม่มีอาการร่วมอื่นที่เด่นชัด'}

• Pertinent Negatives:
${negList.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• โรคประจำตัว (U/D): ${udDisplay}
• ประวัติโรคปอดเดิม: ${pastPulm.length > 0 && !pastPulm.includes('pulm_none') ? pastPulm.join(', ') : 'ปฏิเสธ'}
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

  return defaultRapid;
}

// --- Narrative Note Generator (Doctor View) ---
function renderHemoptysisNarrative(patient) {
  const durVal = patient.durationVal;
  const durUnitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durUnit = durUnitMap[patient.durationUnit] || 'วัน';
  const durStr = durVal ? `${durVal} ${durUnit}` : 'ไม่ระบุระยะเวลา';

  const charStr = formatHemoBloodChar(patient);
  const volStr = formatHemoBloodVolume(patient);
  const freqStr = formatHemoFrequency(patient);
  const activeStr = formatHemoActiveStatus(patient);
  const dyspneaStr = formatHemoDyspnea(patient);
  const chestPainStr = formatHemoChestPain(patient);

  const warnSigns = Array.isArray(patient.hemoWarningSigns) ? patient.hemoWarningSigns : [];

  let note = `ผู้ป่วย${patient.gender || ''} อายุ ${patient.age || 'ไม่ระบุ'} ปี มารับการตรวจที่ห้องฉุกเฉินด้วยอาการไอเป็นเลือด เป็นมา ${durStr} ก่อนมาโรงพยาบาล ลักษณะเลือดที่ไอออกมาคือ${charStr} ปริมาณในครั้งที่ออกมากที่สุดคือ${volStr} มีความถี่คือ${freqStr} และสถานะปัจจุบัน${activeStr} การหายใจประเมินได้ว่า${dyspneaStr} และ${chestPainStr}`;

  if (warnSigns.length > 0) {
    const warnTexts = [];
    if (warnSigns.includes('warn_choking_airway_threat')) warnTexts.push('มีอาการไอสำลักเลือดทางเดินหายใจอุดกั้น');
    if (warnSigns.includes('warn_fainting_syncope')) warnTexts.push('มีอาการหน้ามืดวูบหมดสติ');
    if (warnSigns.includes('warn_profuse_sweat_cold_shock')) warnTexts.push('เหงื่อแตกตัวเย็นซีด');
    if (warnSigns.includes('warn_unilateral_leg_swelling')) warnTexts.push('ขาบวมโตข้างเดียว');
    if (warnSigns.includes('warn_long_travel_immobility')) warnTexts.push('มีประวัติต้องอยู่นิ่งหรือเดินทางไกล');
    if (warnSigns.includes('warn_high_fever_chills')) warnTexts.push('มีไข้สูงหนาวสั่น');
    if (warnSigns.includes('warn_fever_afternoon_night_sweat')) warnTexts.push('มีไข้ต่ำบ่ายเหงื่อแตกกลางคืน');
    if (warnSigns.includes('warn_unintentional_weight_loss')) warnTexts.push('น้ำหนักตัวลดลงฮวบผิดปกติ');
    note += ` ร่วมกับมีอาการเตือนสำคัญ: ${warnTexts.join(', ')}`;
  } else {
    note += ' ผู้ป่วยปฏิเสธอาการสำลักเลือด หายใจติดขัด ปฏิเสธหน้ามืดวูบ ขาไม่บวมโตข้างเดียว และไม่มีไข้หนาวสั่น';
  }

  return note;
}

function renderHemoptysisDoctorHpi(patient) {
  return renderHemoptysisRapidHpi(patient);
}

// --- Output Dispatcher ---
function updateHemoptysisOutputs(rec) {
  if (!rec) return;
  const rapidText = renderHemoptysisRapidHpi(rec);
  const narrativeText = renderHemoptysisNarrative(rec);

  const rapidEl = document.getElementById('rapidTextView');
  const narrativeEl = document.getElementById('narrativeTextView');
  if (rapidEl) rapidEl.value = rec.custom_rapid_note || rapidText;
  if (narrativeEl) narrativeEl.value = rec.custom_narrative_note || narrativeText;

  const posMatch = rapidText.match(/• Pertinent Positives:\n((?:\s*-[^\n]+\n?)+)/);
  if (posMatch) {
    rec.pertinentPositives = posMatch[1].trim().split('\n').map(l => l.replace(/^[-*\s]+/, '').trim());
  } else {
    rec.pertinentPositives = ['ไม่มีอาการร่วมผิดปกติ'];
  }

  const negMatch = rapidText.match(/• Pertinent Negatives:\n((?:\s*-[^\n]+\n?)+)/);
  if (negMatch) {
    rec.pertinentNegatives = negMatch[1].trim().split('\n').map(l => l.replace(/^[-*\s]+/, '').trim());
  } else {
    rec.pertinentNegatives = [];
  }

  const redFlags = evaluateHemoptysisRedFlags(rec);
  rec.redFlags = redFlags;

  const jsonOutput = {
    encounter: {
      chief_complaint: 'hemoptysis',
      chief_complaint_title_th: 'ไอเป็นเลือด',
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
      blood_character: rec.hemoBloodChar || null,
      blood_volume: rec.hemoBloodVolume || null,
      episode_frequency: rec.hemoEpisodeCount || null,
      active_bleeding_status: rec.hemoActiveStatus || null,
      pre_existing_cough: {
        present: rec.hemoPreCoughMaster === 'yes',
        duration_val: rec.hemoPreCoughDurVal || null,
        duration_unit: rec.hemoPreCoughDurUnit || 'days',
        prior_sputum: rec.hemoPriorSputum || null
      },
      dyspnea_grade: rec.hemoDyspnea || null,
      chest_pain: {
        present: rec.hemoChestPainMaster === 'yes',
        types: rec.hemoChestPainType || [],
        pain_score: rec.painScore !== null && rec.painScore !== undefined ? rec.painScore : null
      },
      warning_signs: Array.isArray(rec.hemoWarningSigns) ? rec.hemoWarningSigns : [],
      past_pulmonary_cardiac: Array.isArray(rec.hemoPastPulmonary) ? rec.hemoPastPulmonary : [],
      smoking: {
        status: rec.hemoSmokingStatus || 'smoking_never',
        years: rec.hemoSmokingYears || null,
        packs_per_day: rec.hemoSmokingPacks || null
      },
      bleeding_meds: Array.isArray(rec.hemoBleedingMeds) ? rec.hemoBleedingMeds : [],
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
}

// --- CDS Generator ---
function generateHemoptysisCds(patient, { rfs, ddxList = [], workupList = [], managementList = [] } = {}) {
  if (!patient) return '';
  const redFlags = rfs || evaluateHemoptysisRedFlags(patient);

  const hasMassive = redFlags.some(r => r.key === 'rf_massive_asphyxiation' || r.key === 'rf_hemodynamic_shock' || r.key === 'rf_respiratory_failure');
  const hasAortic = redFlags.some(r => r.key === 'rf_aortic_dissection_chest');
  const hasPe = redFlags.some(r => r.key === 'rf_suspected_pe_dvt');
  const hasTb = redFlags.some(r => r.key === 'rf_cavitary_tb');
  const hasAnticoag = redFlags.some(r => r.key === 'rf_anticoagulant_bleeding');
  const hasAbscess = redFlags.some(r => r.key === 'rf_necrotizing_abscess');
  const hasMalignancy = redFlags.some(r => r.key === 'rf_lung_malignancy');

  if (hasMassive) {
    ddxList.push('1. 🚨 Massive Hemoptysis with Impending Asphyxiation & Airway Compromise');
    ddxList.push('2. Ruptured Bronchial Artery Aneurysm / Rasmussen Aneurysm');
    ddxList.push('3. Cavitary Tuberculosis or Bronchiectasis with Severe Bleeding');
    workupList.push('Stat Endotracheal Intubation with large tube (Size 8.0-8.5) เตรียมพร้อม Rigid/Flexible Bronchoscopy');
    workupList.push('Stat Type and Crossmatch PRC 4 units + FFP 2 units');
    workupList.push('CBC, Coagulogram (PT, INR, PTT), BUN, Cr, Electrolytes, Arterial Blood Gas (ABG)');
    workupList.push('Stat Urgent Interventional Radiology (IR) Consult for Bronchial Artery Embolization (BAE)');
    managementList.push('Triage Level 1: ย้ายเข้า Resuscitation Room ทันที');
    managementList.push('Dependent Positioning: จัดท่านอนตะแคงเอาปอดข้างที่สงสัยว่าเลือดออกลงด้านล่าง เพื่อป้องกันเลือดไหลท่วมปอดข้างดี');
    managementList.push('Two Large-Bore IVs (18G x 2 เส้น) และให้ IV Fluid Resuscitation');
    managementList.push('Hemostatic Agent: พิจารณา IV Tranexamic Acid (TXA) 1 g IV infuse over 10 mins หรือ Nebulized TXA 500 mg');
  } else if (hasAortic) {
    ddxList.push('1. 🚨 Thoracic Aortic Dissection / Aortobronchial Fistula');
    ddxList.push('2. Massive Hemoptysis secondary to Vascular Rupture');
    workupList.push('Stat CT Angiography of Chest (Aorta protocol)');
    workupList.push('Stat Urgent Cardiothoracic Surgery Consultation');
    workupList.push('12-lead ECG, Troponin-T, CBC, Coagulogram');
    managementList.push('Triage Level 1: ควบคุมความดันโลหิตและอัตราการเต้นของหัวใจ (Target SBP 100-120 mmHg, HR < 60 bpm)');
    managementList.push('งดให้ยาต้านการแข็งตัวของเลือดและยาละลายลิ่มเลือดโดยเด็ดขาด');
  } else if (hasPe) {
    ddxList.push('1. ⚠️ Acute Pulmonary Embolism (PE) with Pulmonary Infarction');
    ddxList.push('2. Deep Vein Thrombosis (DVT) with Embolization');
    workupList.push('Stat CT Pulmonary Angiography (CTPA) - Gold Standard');
    workupList.push('Stat 12-lead ECG (ดู S1Q3T3, Sinus Tachycardia, RV Strain)');
    workupList.push('D-dimer (หากมีความเสี่ยงปานกลาง), Troponin, Bedside Echocardiography');
    workupList.push('Venous Duplex Ultrasound of Lower Extremities');
    managementList.push('Triage Level 2: ให้ออกซิเจน cannula/mask เพื่อคุม SpO2 >= 95%');
    managementList.push('Anticoagulation: หากไม่มีข้อห้ามเลือดออกปริมาณมาก พิจารณา Low Molecular Weight Heparin (Enoxaparin 1 mg/kg SC q 12h)');
  } else if (hasTb) {
    ddxList.push('1. ⚠️ Active Cavitary Pulmonary Tuberculosis (TB) with Hemoptysis');
    ddxList.push('2. Rasmussen Aneurysm / Post-TB Bronchiectasis Bleeding');
    workupList.push('Stat Chest X-ray (CXR)');
    workupList.push('Sputum AFB x 3 days และ GeneXpert MTB/RIF');
    workupList.push('CBC, Electrolytes, BUN, Cr, LFT');
    managementList.push('Triage Level 2: แยกกักตัวผู้ป่วยในห้องความดันลบ (Negative Pressure Airborne Isolation Room) ทันที');
    managementList.push('ให้ผู้ป่วยสวมหน้ากาก N95 ตลอดเวลา');
    managementList.push('ปรึกษาอายุรแพทย์โรคปอดเพื่อพิจารณาเริ่มสูตรยารักษาวัณโรค (HRZE)');
  } else if (hasAnticoag) {
    ddxList.push('1. ⚠️ Anticoagulant-Induced Hemoptysis / Coagulopathy');
    ddxList.push('2. Secondary Bronchial Bleeding in Anticoagulated Patient');
    workupList.push('Stat Coagulogram (PT, INR, PTT, Thrombin Time)');
    workupList.push('CBC (Hb, Hct, Platelet count), BUN, Cr');
    workupList.push('Stat CXR');
    managementList.push('Triage Level 2: หยุดยาต้านการแข็งตัวของเลือด/ยาต้านเกล็ดเลือดทันที');
    managementList.push('Reversal Agent: หาก INR สูงผิดปกติ พิจารณาให้ IV Vitamin K1 10 mg ร่วมกับ Prothrombin Complex Concentrate (PCC) หรือ FFP');
  } else if (hasAbscess) {
    ddxList.push('1. ⚠️ Necrotizing Pneumonia / Lung Abscess with Hemoptysis');
    ddxList.push('2. Severe Anaerobic Pulmonary Infection');
    workupList.push('Stat Sputum Gram stain, Culture & Sensitivity, Blood culture x 2');
    workupList.push('Stat CXR / CT Chest');
    workupList.push('CBC, BUN, Cr, Electrolytes');
    managementList.push('Triage Level 2: ให้ IV Broad-spectrum Antibiotics ครอบคลุมเชื้อแบคทีเรียกลุ่ม Anaerobes (เช่น IV Ceftriaxone + Clindamycin หรือ IV Piperacillin/Tazobactam)');
  } else if (hasMalignancy) {
    ddxList.push('1. ⚠️ Suspected Bronchogenic Carcinoma (Lung Cancer)');
    ddxList.push('2. Chronic Lung Disease with Secondary Hemoptysis');
    workupList.push('Stat CXR');
    workupList.push('Contrast-enhanced CT Chest');
    workupList.push('Sputum Cytology x 3');
    managementList.push('Triage Level 3: ส่งตรวจประเมินทางรังสีวิทยา และส่งต่ออายุรแพทย์โรคปอดเพื่อตรวจส่องกล้อง Bronchoscopy');
  } else {
    ddxList.push('1. Acute Bronchitis / Tracheitis with Blood-Streaked Sputum');
    ddxList.push('2. Post-tussive Airway Mucosal Erosion');
    workupList.push('Chest X-ray (CXR) เพื่อคัดกรองก้อนหรือรอยโรคในปอด');
    workupList.push('CBC (ตรวจดูการติดเชื้อและภาวะซีด)');
    managementList.push('Triage Level 4: แนะนำยาแก้ไอ (Cough suppressant / Dextromethorphan), ยาละลายเสมหะ');
    managementList.push('สังเกตอาการ: หากไอเป็นเลือดสดปริมาณเพิ่มขึ้น หรือมีเหนื่อยหอบให้รีบกลับมา รพ. ทันที');
  }

  let text = '[PROVISIONAL_DDX]\n';
  text += ddxList.join('\n') + '\n\n';
  text += '[ER_ORDERS]\n';
  workupList.forEach(w => { text += `- [ ] ${w}\n`; });
  managementList.forEach(m => { text += `- [ ] ${m}\n`; });
  return text;
}

// --- Module Definition Object ---
const hemoptysisModule = {
  id: 'hemoptysis',
  recordCc: 'hemoptysis',
  titleTh: 'ไอเป็นเลือด',
  titleEn: 'Hemoptysis / Coughing up blood',
  icon: 'droplet',
  sectionDomId: 'hemoptysisQuestionnaireSection',
  doctorCcBadgeHtml: '<i data-lucide="droplet" class="w-3.5 h-3.5 mr-1 text-rose-500"></i> CC: ไอเป็นเลือด (Hemoptysis)',

  algorithm: {
    chiefComplaint: 'hemoptysis',
    titleTh: 'ไอเป็นเลือด',
    schemaCode: 'hemoptysis',
    version: '2.0.0',
    redFlagDefinitions: [
      { key: 'rf_massive_asphyxiation', level: 1, textTh: 'Massive Hemoptysis with Impending Asphyxiation / เสี่ยงทางเดินหายใจอุดกั้นเฉียบพลัน' },
      { key: 'rf_hemodynamic_shock', level: 1, textTh: 'Hemodynamic Instability / Hypovolemic Shock (สัญญาณชีพไม่คงที่/เสี่ยงภาวะช็อกจากการเสียเลือด)' },
      { key: 'rf_respiratory_failure', level: 1, textTh: 'Acute Respiratory Failure / หายใจหอบเหนื่อยรุนแรงเฉียบพลัน (SpO2 < 90%)' },
      { key: 'rf_aortic_dissection_chest', level: 1, textTh: 'Suspected Thoracic Aortic Dissection / สงสัยหลอดเลือดเอออร์ตาฉีกขาดร้าวทะลุหลัง' },
      { key: 'rf_suspected_pe_dvt', level: 2, textTh: 'Suspected Pulmonary Embolism (PE) with Infarction / สงสัยลิ่มเลือดอุดกั้นปอด' },
      { key: 'rf_submassive_active', level: 2, textTh: 'Submassive Hemoptysis with Active Bleeding / ไอเลือดสดปานกลางและยังมีเลือดออกต่อเนื่อง' },
      { key: 'rf_cavitary_tb', level: 2, textTh: 'Suspected Active Cavitary Pulmonary Tuberculosis (TB) / สงสัยวัณโรคปอดระยะลุกลาม' },
      { key: 'rf_anticoagulant_bleeding', level: 2, textTh: 'Anticoagulant-Associated Hemoptysis / ภาวะเลือดออกจากยาต้านการแข็งตัวของเลือด' },
      { key: 'rf_necrotizing_abscess', level: 2, textTh: 'Necrotizing Pneumonia / Lung Abscess / สงสัยปอดอักเสบเนื้อตายหรือฝีในปอด' },
      { key: 'rf_lung_malignancy', level: 3, textTh: 'Suspected Bronchogenic Carcinoma (Lung Cancer) / สงสัยโรคมะเร็งปอด' }
    ]
  },

  // --- HTML Form Intake Template ---
  formHtml: `
    <div id="hemoptysisQuestionnaireSection" class="hidden space-y-6">

      <!-- CARD 1: ระยะเวลา ลักษณะเลือด ปริมาณ และสถานะเลือดออก -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="droplet" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">1. ระยะเวลา ลักษณะของเลือด และปริมาณ (Bleeding Profile)</h2>
            <p class="text-xs text-slate-500">ข้อมูลลักษณะเลือด ปริมาณที่ออก และสถานะความต่อเนื่องของการมีเลือดออก</p>
          </div>
        </div>

        <div class="space-y-4">
          <!-- 1.1 ระยะเวลาตั้งแต่เริ่มไอเป็นเลือด -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              เริ่มมีอาการไอเป็นเลือดมานานเท่าไรแล้ว? <span class="text-rose-500">*</span>
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div class="col-span-1 sm:col-span-2">
                <input type="number" id="hemoDurationVal" min="1" max="1000"
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm"
                  placeholder="เช่น 2">
              </div>
              <div class="col-span-1">
                <select id="hemoDurationUnit"
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm">
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

          <!-- 1.2 ลักษณะของเลือดที่ออกมา -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              ลักษณะของเลือดที่ออกมา (เลือกข้อที่ตรงที่สุด) <span class="text-rose-500">*</span>
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <label class="selectable-card relative flex items-start p-3 rounded-xl cursor-pointer border border-slate-200 bg-white hover:border-medical-300 transition">
                <input type="radio" name="hemoBloodChar" value="char_true_frothy_red" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
                <div class="ml-2.5">
                  <span class="text-xs sm:text-sm font-semibold block text-slate-800">เลือดสดสีแดง หรือมีฟองอากาศปน</span>
                  <span class="text-[11px] text-slate-500">ออกมาเวลาไออย่างรุนแรง ออกมาจากหลอดลมหรือปอดโดยตรง</span>
                </div>
              </label>

              <label class="selectable-card relative flex items-start p-3 rounded-xl cursor-pointer border border-slate-200 bg-white hover:border-medical-300 transition">
                <input type="radio" name="hemoBloodChar" value="char_streaked_sputum" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
                <div class="ml-2.5">
                  <span class="text-xs sm:text-sm font-semibold block text-slate-800">เสมหะปนเลือดเป็นเส้นๆ</span>
                  <span class="text-[11px] text-slate-500">มีเส้นเลือดสีแดงเรื่อๆ หรือสีน้ำตาลปนในก้อนเสมหะ</span>
                </div>
              </label>

              <label class="selectable-card relative flex items-start p-3 rounded-xl cursor-pointer border border-slate-200 bg-white hover:border-medical-300 transition">
                <input type="radio" name="hemoBloodChar" value="char_coffee_ground_vomit" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
                <div class="ml-2.5">
                  <span class="text-xs sm:text-sm font-semibold block text-slate-800">ขย้อนหรืออาเจียนเป็นสีกาแฟ/มีเศษอาหาร</span>
                  <span class="text-[11px] text-slate-500">สีน้ำตาลคล้ำ มีเศษอาหารปน อาจเกิดจากทางเดินอาหาร</span>
                </div>
              </label>

              <label class="selectable-card relative flex items-start p-3 rounded-xl cursor-pointer border border-slate-200 bg-white hover:border-medical-300 transition">
                <input type="radio" name="hemoBloodChar" value="char_postnasal_epistaxis" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
                <div class="ml-2.5">
                  <span class="text-xs sm:text-sm font-semibold block text-slate-800">เลือดกำเดาไหลลงคอแล้วบ้วนออกมา</span>
                  <span class="text-[11px] text-slate-500">รู้สึกมีน้ำเลือดไหลจากหลังโพรงจมูกหยดลงคอหอย</span>
                </div>
              </label>
            </div>
          </div>

          <!-- 1.3 ปริมาณเลือดในครั้งที่ออกมากที่สุด -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              ปริมาณเลือดในครั้งที่ออกมากที่สุด (Volume Assessment) <span class="text-rose-500">*</span>
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <label class="selectable-card relative flex items-start p-3 rounded-xl cursor-pointer border border-slate-200 bg-white hover:border-medical-300 transition">
                <input type="radio" name="hemoBloodVolume" value="vol_streaks_sputum" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
                <div class="ml-2.5">
                  <span class="text-xs sm:text-sm font-semibold block text-slate-800">เลือดออกเป็นเส้นๆ ปนเสมหะ</span>
                  <span class="text-[11px] text-slate-500">ปริมาณเล็กน้อย (น้อยกว่า 1 ช้อนชา)</span>
                </div>
              </label>

              <label class="selectable-card relative flex items-start p-3 rounded-xl cursor-pointer border border-slate-200 bg-white hover:border-medical-300 transition">
                <input type="radio" name="hemoBloodVolume" value="vol_tablespoon" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
                <div class="ml-2.5">
                  <span class="text-xs sm:text-sm font-semibold block text-slate-800">ประมาณ 1 - 2 ช้อนโต๊ะ</span>
                  <span class="text-[11px] text-slate-500">ประมาณ 10 - 30 มล. เป็นเลือดสดปนเสมหะ</span>
                </div>
              </label>

              <label class="selectable-card relative flex items-start p-3 rounded-xl cursor-pointer border border-slate-200 bg-white hover:border-medical-300 transition">
                <input type="radio" name="hemoBloodVolume" value="vol_half_to_full_cup" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
                <div class="ml-2.5">
                  <span class="text-xs sm:text-sm font-semibold block text-slate-800">ประมาณครึ่งแก้ว ถึงเต็มแก้วน้ำ</span>
                  <span class="text-[11px] text-slate-500">ประมาณ 50 - 100 มล. ปริมาณปานกลาง</span>
                </div>
              </label>

              <label class="selectable-card relative flex items-start p-3 rounded-xl cursor-pointer border border-slate-200 bg-white hover:border-medical-300 transition">
                <input type="radio" name="hemoBloodVolume" value="vol_massive_over_cup" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
                <div class="ml-2.5">
                  <span class="text-xs sm:text-sm font-semibold block text-slate-800">ทะลักมากกว่าแก้วน้ำ / ลิ่มเลือดต่อเนื่อง</span>
                  <span class="text-[11px] text-slate-500">เลือดสดทะลักปริมาณมาก (> 100-200 มล.) หรือไอลิ่มเลือดไม่หยุด</span>
                </div>
              </label>
            </div>
          </div>

          <!-- 1.4 และ 1.5 ความถี่ และสถานะการมีเลือดออก -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                1.4 จำนวนครั้งที่ไอเป็นเลือด
              </label>
              <div class="space-y-1.5 text-xs">
                <label class="selectable-card gap-2.5 flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                  <input type="radio" name="hemoEpisodeCount" value="episodes_single" class="text-medical-600 focus:ring-medical-500 h-4 w-4">
                  <span class="text-xs text-slate-800">เป็นเพียงครั้งเดียวแล้วหยุด</span>
                </label>
                <label class="selectable-card gap-2.5 flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                  <input type="radio" name="hemoEpisodeCount" value="episodes_two_four" class="text-medical-600 focus:ring-medical-500 h-4 w-4">
                  <span class="text-xs text-slate-800">เป็น 2 - 4 ครั้ง</span>
                </label>
                <label class="selectable-card gap-2.5 flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                  <input type="radio" name="hemoEpisodeCount" value="episodes_over_5" class="text-medical-600 focus:ring-medical-500 h-4 w-4">
                  <span class="text-xs text-slate-800">เป็นมากกว่า 5 ครั้งขึ้นไป</span>
                </label>
                <label class="selectable-card gap-2.5 flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                  <input type="radio" name="hemoEpisodeCount" value="episodes_frequent_continuous" class="text-medical-600 focus:ring-medical-500 h-4 w-4">
                  <span class="text-xs font-semibold text-slate-800">ไอเป็นเลือดแทบทุกครั้ง / ต่อเนื่องตลอด</span>
                </label>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                1.5 สถานะการมีเลือดออกในปัจจุบัน
              </label>
              <div class="space-y-1.5 text-xs">
                <label class="selectable-card gap-2.5 flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                  <input type="radio" name="hemoActiveStatus" value="status_active_bleeding" class="text-medical-600 focus:ring-medical-500 h-4 w-4">
                  <span class="text-xs font-semibold text-slate-800">ยังมีอาการไอเป็นเลือดสดอยู่เรื่อยๆ</span>
                </label>
                <label class="selectable-card gap-2.5 flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                  <input type="radio" name="hemoActiveStatus" value="status_streaks_only" class="text-medical-600 focus:ring-medical-500 h-4 w-4">
                  <span class="text-xs text-slate-800">เลือดหยุดแล้ว เหลือเพียงเสมหะปนเลือดจางๆ</span>
                </label>
                <label class="selectable-card gap-2.5 flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                  <input type="radio" name="hemoActiveStatus" value="status_stopped_completely" class="text-medical-600 focus:ring-medical-500 h-4 w-4">
                  <span class="text-xs text-slate-800">เลือดหยุดไหลสนิทแล้ว</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 2: ประวัติไอนำมาก่อน เสมหะเดิม การหายใจ และอาการเจ็บหน้าอก -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="wind" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">2. การหายใจ เสมหะเดิม และอาการเจ็บหน้าอก (Respiratory & Chest Profile)</h2>
            <p class="text-xs text-slate-500">ประวัติการไอนำมาก่อน อาการหอบเหนื่อย และอาการเจ็บหน้าอก</p>
          </div>
        </div>

        <div class="space-y-4">
          <!-- 2.1 ประวัติอาการไอนำมาก่อน -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              2.1 ก่อนไอเป็นเลือด มีอาการไอเรื้อรังนำมาก่อนหรือไม่?
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition"
                onclick="toggleHemoPreCoughSub(false)">
                <input type="radio" name="hemoPreCoughMaster" value="no" class="text-medical-600 h-4 w-4">
                <span class="ml-2.5 text-xs font-semibold text-slate-800">ไม่มีอาการไอนำมาก่อน (เพิ่งเริ่มไอและมีเลือดทันที)</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition"
                onclick="toggleHemoPreCoughSub(true)">
                <input type="radio" name="hemoPreCoughMaster" value="yes" class="text-medical-600 h-4 w-4">
                <span class="ml-2.5 text-xs font-semibold text-slate-800">มีอาการไอนำมาก่อนหน้านี้</span>
              </label>
            </div>

            <!-- กล่องแตกกิ่ง: ระยะเวลาที่ไอนำมาก่อน -->
            <div id="hemoPreCoughSub" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-3 space-y-2">
              <span class="text-xs font-bold text-slate-800 block">ระบุระยะเวลาที่มีอาการไอนำมาก่อนหน้านี้:</span>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div class="col-span-1 sm:col-span-2">
                  <input type="number" id="hemoPreCoughDurVal" min="1" max="365"
                    class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800"
                    placeholder="เช่น 2">
                </div>
                <div class="col-span-1">
                  <select id="hemoPreCoughDurUnit"
                    class="w-full bg-white border border-slate-300 rounded-lg px-2 py-2 text-xs font-medium text-slate-800">
                    <option value="days">วัน</option>
                    <option value="weeks" selected>สัปดาห์</option>
                    <option value="months">เดือน</option>
                    <option value="years">ปี</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- 2.2 ลักษณะเสมหะเดิม (ก่อนมีเลือดปน) -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              2.2 ลักษณะเสมหะเดิม (ก่อนมีเลือดปน)
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label class="selectable-card gap-2.5 flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                <input type="radio" name="hemoPriorSputum" value="sputum_none_dry_cough" class="text-medical-600 ">
                <span>ไอแห้งๆ ไม่มีเสมหะ</span>
              </label>
              <label class="selectable-card gap-2.5 flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                <input type="radio" name="hemoPriorSputum" value="sputum_normal_white_yellow" class="text-medical-600 ">
                <span>เสมหะสีขาวใส หรือสีเหลืองปกติ</span>
              </label>
              <label class="selectable-card gap-2.5 flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                <input type="radio" name="hemoPriorSputum" value="sputum_foul_abscess_green" class="text-medical-600 ">
                <span>เสมหะสีเขียวข้น หรือมีกลิ่นเหม็นเน่ารุนแรง</span>
              </label>
              <label class="selectable-card gap-2.5 flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                <input type="radio" name="hemoPriorSputum" value="sputum_pink_frothy_edema" class="text-medical-600 ">
                <span>เสมหะเป็นฟองสีชมพูจางๆ</span>
              </label>
            </div>
          </div>

          <!-- 2.3 อาการเหนื่อยหอบและการหายใจ -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              2.3 อาการเหนื่อยหอบและการหายใจ
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 bg-white cursor-pointer">
                <input type="radio" name="hemoDyspnea" value="dyspnea_none" class="text-medical-600 mt-0.5">
                <div class="ml-2">
                  <span class="font-semibold block text-slate-800">หายใจปกติ ไม่เหนื่อย</span>
                  <span class="text-[11px] text-slate-500">สามารถพูดคุยและเดินได้ตามปกติ</span>
                </div>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 bg-white cursor-pointer">
                <input type="radio" name="hemoDyspnea" value="dyspnea_exertional" class="text-medical-600 mt-0.5">
                <div class="ml-2">
                  <span class="font-semibold block text-slate-800">เหนื่อยเวลาออกแรง</span>
                  <span class="text-[11px] text-slate-500">เดินหรือขยับตัวแล้วเหนื่อยหอบ</span>
                </div>
              </label>
              <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 bg-white cursor-pointer">
                <input type="radio" name="hemoDyspnea" value="dyspnea_severe_rest_orthopnea" class="text-medical-600 mt-0.5">
                <div class="ml-2">
                  <span class="font-semibold block text-slate-800">เหนื่อยรุนแรงเฉียบพลัน</span>
                  <span class="text-[11px] text-slate-500">แม้ขณะนั่งพัก หรือนอนราบไม่ได้</span>
                </div>
              </label>
            </div>
          </div>

          <!-- 2.4 อาการเจ็บหน้าอก และระดับคะแนนความเจ็บ (กิ่งย่อย) -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              2.4 อาการเจ็บหน้าอก
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition"
                onclick="toggleHemoChestPainSub(false)">
                <input type="radio" name="hemoChestPainMaster" value="no" class="text-medical-600 h-4 w-4">
                <span class="ml-2.5 text-xs font-semibold text-slate-800">ไม่มีอาการเจ็บหน้าอก</span>
              </label>
              <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 hover:border-medical-300 cursor-pointer transition"
                onclick="toggleHemoChestPainSub(true)">
                <input type="radio" name="hemoChestPainMaster" value="yes" class="text-medical-600 h-4 w-4">
                <span class="ml-2.5 text-xs font-semibold text-slate-800">มีอาการเจ็บหน้าอกร่วมด้วย</span>
              </label>
            </div>

            <!-- กล่องแตกกิ่ง: ลักษณะเจ็บหน้าอก และ Pain Slider -->
            <div id="hemoChestPainSub" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-3 space-y-3">
              <div>
                <span class="text-xs font-bold text-slate-800 block mb-1.5">ลักษณะอาการเจ็บหน้าอก (เลือกได้หลายข้อ):</span>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <label class="selectable-card gap-2.5 flex items-start p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                    <input type="checkbox" name="hemoChestPainType" value="pleuritic_sharp" class="text-medical-600 mt-0.5 rounded">
                    <div>
                      <span class="font-semibold block text-slate-800">เจ็บแปล๊บเวลาหายใจลึก</span>
                      <span class="text-[11px] text-slate-500">หรือเจ็บแปล๊บเวลาไอ</span>
                    </div>
                  </label>
                  <label class="selectable-card gap-2.5 flex items-start p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                    <input type="checkbox" name="hemoChestPainType" value="ischemic_pressure" class="text-medical-600 mt-0.5 rounded">
                    <div>
                      <span class="font-semibold block text-slate-800">เจ็บแน่นอึดอัดกลางอก</span>
                      <span class="text-[11px] text-slate-500">คล้ายมีของหนักทับ</span>
                    </div>
                  </label>
                  <label class="selectable-card gap-2.5 flex items-start p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                    <input type="checkbox" name="hemoChestPainType" value="tearing_ripping_back" class="text-medical-600 mt-0.5 rounded">
                    <div>
                      <span class="font-semibold block text-slate-800">เจ็บเหมือนฉีกขาด</span>
                      <span class="text-[11px] text-slate-500">ร้าวทะลุหลังรุนแรง</span>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Nested Pain Slider -->
              <div class="pt-2 border-t border-slate-200">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    ระดับความเจ็บแน่นหน้าอก (Pain Score 0-10)
                  </label>
                  <div class="flex items-center space-x-2">
                    <span id="hemoPainScoreBadge" class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all">
                      <span id="hemoPainScoreEmoji">⚪</span>
                      <span id="hemoPainScoreText">ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)</span>
                    </span>
                    <button type="button" id="hemoPainScoreClearBtn" onclick="clearHemoPainScore()" class="hidden text-xs text-slate-400 hover:text-slate-600 underline">ล้างค่า</button>
                  </div>
                </div>
                <div class="pt-1 px-1">
                  <input type="range" id="hemoPainScore" min="0" max="10" value="0"
                    oninput="handleHemoPainScoreChange(this.value)"
                    class="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-600">
                  <div class="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                    <span>0 ไม่เจ็บเลย</span>
                    <span>5 เจ็บปานกลาง</span>
                    <span>10 เจ็บมากที่สุด</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 3: สัญญาณเตือนอันตรายในมุมมองคนไข้ (Warning Signs) -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="shield-alert" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">3. สัญญาณเตือน สภาวะอันตราย / ความเสี่ยงสูง (Warning Signs)</h2>
            <p class="text-xs text-slate-500">คัดกรองอาการทางระบบไหลเวียนโลหิต ลิ่มเลือด การติดเชื้อ และทางเดินหายใจ</p>
          </div>
        </div>

        <div class="space-y-3">
          <!-- กลุ่ม 1: มีอาการวูบ หน้ามืด เวียนศีรษะ หรือจะเป็นลม -->
          <div class="border border-slate-200 rounded-xl p-3 bg-white hover:border-medical-300 transition">
            <label class="flex items-start cursor-pointer">
              <input type="checkbox" id="hemoWarningSyncopeParent"
                onchange="toggleHemoWarningGroup('hemoWarningSyncopeSub', this.checked)"
                class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
              <div class="ml-3">
                <span class="text-xs sm:text-sm font-semibold text-slate-800 block">มีอาการวูบ หน้ามืด เวียนศีรษะ หรือจะเป็นลม</span>
                <span class="text-[11px] text-slate-500 font-normal block mt-0.5">คัดกรองภาวะความดันโลหิตตก เสียเลือด หรือร่างกายขาดออกซิเจน</span>
              </div>
            </label>
            <div id="hemoWarningSyncopeSub" class="hidden pl-7 pt-2.5 mt-2 border-t border-slate-100 space-y-2 text-xs">
              <label class="flex items-center p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
                <input type="checkbox" name="hemoWarningSigns" value="warn_fainting_syncope" class="text-medical-600 mr-2 rounded">
                <span>หน้ามืด วูบ หรือหมดสติไปชั่วขณะ</span>
              </label>
              <label class="flex items-center p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
                <input type="checkbox" name="hemoWarningSigns" value="warn_profuse_sweat_cold_shock" class="text-medical-600 mr-2 rounded">
                <span>เหงื่อแตกท่วมตัว ผิวหนังซีดเย็น ตัวสั่น</span>
              </label>
              <label class="flex items-center p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
                <input type="checkbox" name="hemoWarningSigns" value="warn_palpitation_tachycardia" class="text-medical-600 mr-2 rounded">
                <span>ใจสั่น หัวใจเต้นรัวเร็ว รู้สึกเหนื่อยแทบขาดใจ</span>
              </label>
            </div>
          </div>

          <!-- กลุ่ม 2: มีอาการผิดปกติที่ขา หรือมีประวัติต้องอยู่นิ่งๆนานๆ / เดินทางไกล -->
          <div class="border border-slate-200 rounded-xl p-3 bg-white hover:border-medical-300 transition">
            <label class="flex items-start cursor-pointer">
              <input type="checkbox" id="hemoWarningDvtPeParent"
                onchange="toggleHemoWarningGroup('hemoWarningDvtPeSub', this.checked)"
                class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
              <div class="ml-3">
                <span class="text-xs sm:text-sm font-semibold text-slate-800 block">มีอาการผิดปกติที่ขา หรือมีประวัติต้องอยู่นิ่งๆนานๆ / เดินทางไกล</span>
                <span class="text-[11px] text-slate-500 font-normal block mt-0.5">คัดกรองภาวะลิ่มเลือดในหลอดเลือดดำและหลอดเลือดปอด</span>
              </div>
            </label>
            <div id="hemoWarningDvtPeSub" class="hidden pl-7 pt-2.5 mt-2 border-t border-slate-100 space-y-2 text-xs">
              <label class="flex items-center p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
                <input type="checkbox" name="hemoWarningSigns" value="warn_unilateral_leg_swelling" class="text-medical-600 mr-2 rounded">
                <span>ขาบวมโต หรือปวดตึงน่องข้างใดข้างหนึ่งชัดเจน</span>
              </label>
              <label class="flex items-center p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
                <input type="checkbox" name="hemoWarningSigns" value="warn_long_travel_immobility" class="text-medical-600 mr-2 rounded">
                <span>นั่งรถยนต์หรือเครื่องบินเดินทางไกลต่อเนื่องเกิน 4-6 ชั่วโมง</span>
              </label>
              <label class="flex items-center p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
                <input type="checkbox" name="hemoWarningSigns" value="warn_post_op_bedridden" class="text-medical-600 mr-2 rounded">
                <span>เพิ่งผ่านการผ่าตัดใหญ่ หรือต้องนอนพักรักษาตัวติดเตียงเกิน 3 วัน</span>
              </label>
              <label class="flex items-center p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
                <input type="checkbox" name="hemoWarningSigns" value="warn_history_dvt_pe" class="text-medical-600 mr-2 rounded">
                <span>เคยมีประวัติเป็นโรคลิ่มเลือดอุดตันในเส้นเลือดที่แขนหรือขามาก่อน</span>
              </label>
            </div>
          </div>

          <!-- กลุ่ม 3: มีไข้ หรือเหงื่อออกผิดปกติ -->
          <div class="border border-slate-200 rounded-xl p-3 bg-white hover:border-medical-300 transition">
            <label class="flex items-start cursor-pointer">
              <input type="checkbox" id="hemoWarningFeverParent"
                onchange="toggleHemoWarningGroup('hemoWarningFeverSub', this.checked)"
                class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded flex-shrink-0 mt-0.5">
              <div class="ml-3">
                <span class="text-xs sm:text-sm font-semibold text-slate-800 block">มีไข้ หรือเหงื่อออกผิดปกติ</span>
                <span class="text-[11px] text-slate-500 font-normal block mt-0.5">คัดกรองการติดเชื้อในปอดและวัณโรค</span>
              </div>
            </label>
            <div id="hemoWarningFeverSub" class="hidden pl-7 pt-2.5 mt-2 border-t border-slate-100 space-y-2 text-xs">
              <label class="flex items-center p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
                <input type="checkbox" name="hemoWarningSigns" value="warn_high_fever_chills" class="text-medical-600 mr-2 rounded">
                <span>มีไข้สูง หนาวสั่นสะท้านจับไข้</span>
              </label>
              <label class="flex items-center p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
                <input type="checkbox" name="hemoWarningSigns" value="warn_fever_afternoon_night_sweat" class="text-medical-600 mr-2 rounded">
                <span>มีไข้ต่ำๆ รุมๆ ตอนบ่าย ร่วมกับเหงื่อออกท่วมตัวตอนกลางคืน</span>
              </label>
            </div>
          </div>

          <!-- กลุ่มอาการเดี่ยวสังเกตชัดเจน (Standalone) -->
          <div class="space-y-2 pt-1 text-xs">
            <label class="flex items-start p-3 bg-rose-50/50 hover:bg-rose-50 border border-rose-200 rounded-xl cursor-pointer">
              <input type="checkbox" name="hemoWarningSigns" value="warn_choking_airway_threat" class="text-rose-600 mr-2.5 mt-0.5 rounded">
              <div>
                <span class="font-semibold text-slate-800 block">ไอสำลักเลือด หายใจติดขัด กลืนไม่ลง</span>
                <span class="text-[11px] text-slate-500">รู้สึกเหมือนมีก้อนเลือดหรือเสมหะขวางหลอดลมแทบขาดใจ</span>
              </div>
            </label>

            <label class="flex items-start p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
              <input type="checkbox" name="hemoWarningSigns" value="warn_unintentional_weight_loss" class="text-medical-600 mr-2.5 mt-0.5 rounded">
              <div>
                <span class="font-semibold text-slate-800 block">น้ำหนักตัวลดลงฮวบผิดปกติ หรือเบื่ออาหารมาก</span>
                <span class="text-[11px] text-slate-500">น้ำหนักลดลงโดยไม่ได้ตั้งใจลด หรือผอมลงอย่างเห็นได้ชัด</span>
              </div>
            </label>

            <label class="flex items-start p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
              <input type="checkbox" name="hemoWarningSigns" value="warn_hoarseness_weeks" class="text-medical-600 mr-2.5 mt-0.5 rounded">
              <div>
                <span class="font-semibold text-slate-800 block">มีอาการเสียงแหบลงผิดปกติ ต่อเนื่องหลายสัปดาห์</span>
                <span class="text-[11px] text-slate-500">เสียงเปลี่ยนหรือแหบแห้งโดยไม่ทราบสาเหตุ</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- CARD 4: ประวัติโรคประจำตัว ปัจจัยเสี่ยง และยาที่ใช้ -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="file-text" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">4. ประวัติโรคปอด การสูบบุหรี่ และยาที่ใช้ (Risk Factors & Medications)</h2>
            <p class="text-xs text-slate-500">คัดกรองวัณโรคเดิม มะเร็งปอด ประวัติการสูบบุหรี่ และยาต้านการแข็งตัวของเลือด</p>
          </div>
        </div>

        <div class="space-y-4">
          <!-- 4.1 ประวัติโรคปอดและโรคประจำตัวเดิม -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              4.1 ประวัติโรคระบบทางเดินหายใจและหัวใจเดิม (เลือกได้หลายข้อ)
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label class="selectable-card gap-2.5 flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                <input type="checkbox" name="hemoPastPulmonary" value="tb_prior_or_contact" class="text-medical-600 rounded">
                <span>เคยป่วยเป็นวัณโรคปอด หรือมีคนในบ้านเป็นวัณโรค</span>
              </label>
              <label class="selectable-card gap-2.5 flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                <input type="checkbox" name="hemoPastPulmonary" value="past_bronchiectasis" class="text-medical-600 rounded">
                <span>โรคหลอดลมโป่งพอง (Bronchiectasis)</span>
              </label>
              <label class="selectable-card gap-2.5 flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                <input type="checkbox" name="hemoPastPulmonary" value="past_copd_asthma" class="text-medical-600 rounded">
                <span>โรคถุงลมโป่งพอง (COPD) หรือหอบหืด</span>
              </label>
              <label class="selectable-card gap-2.5 flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                <input type="checkbox" name="hemoPastPulmonary" value="past_lung_cancer" class="text-medical-600 rounded">
                <span>โรคมะเร็งปอด หรือมะเร็งอวัยวะอื่น</span>
              </label>
              <label class="selectable-card gap-2.5 flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                <input type="checkbox" name="hemoPastPulmonary" value="past_heart_failure_valvular" class="text-medical-600 rounded">
                <span>โรคหัวใจ (ลิ้นหัวใจตีบ หรือหัวใจล้มเหลว)</span>
              </label>
              <label class="selectable-card gap-2.5 flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                <input type="checkbox" name="hemoPastPulmonary" value="pulm_none" class="text-medical-600 rounded">
                <span>ปฏิเสธโรคประจำตัวทางปอดและหัวใจ</span>
              </label>
            </div>
          </div>

          <!-- 4.2 ประวัติการสูบบุหรี่ -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              4.2 ประวัติการสูบบุหรี่
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <label class="selectable-card gap-2.5 flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer"
                onclick="toggleHemoSmokingSub(true)">
                <input type="radio" name="hemoSmokingStatus" value="smoking_regular" class="text-medical-600 ">
                <span>สูบบุหรี่เป็นประจำ</span>
              </label>
              <label class="selectable-card gap-2.5 flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer"
                onclick="toggleHemoSmokingSub(false)">
                <input type="radio" name="hemoSmokingStatus" value="smoking_quit" class="text-medical-600 ">
                <span>เคยสูบแต่เลิกแล้ว</span>
              </label>
              <label class="selectable-card gap-2.5 flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer"
                onclick="toggleHemoSmokingSub(false)">
                <input type="radio" name="hemoSmokingStatus" value="smoking_never" class="text-medical-600 ">
                <span>ไม่เคยสูบบุหรี่</span>
              </label>
            </div>

            <!-- กล่องแตกกิ่ง: ปริมาณและปีที่สูบ -->
            <div id="hemoSmokingSub" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label class="block font-medium text-slate-700 mb-1">สูบมานานกี่ปี?</label>
                <input type="number" id="hemoSmokingYears" min="1" max="80"
                  class="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs"
                  placeholder="เช่น 20">
              </div>
              <div>
                <label class="block font-medium text-slate-700 mb-1">เฉลี่ยวันละกี่ซอง?</label>
                <input type="number" step="0.5" id="hemoSmokingPacks" min="0.1" max="10"
                  class="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs"
                  placeholder="เช่น 1">
              </div>
            </div>
          </div>

          <!-- 4.3 การใช้ยาที่มีผลต่อการแข็งตัวของเลือด -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              4.3 การรับประทานยาต้านการแข็งตัวของเลือด / ยาละลายลิ่มเลือด (เลือกได้หลายข้อ)
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label class="selectable-card gap-2.5 flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                <input type="checkbox" name="hemoBleedingMeds" value="med_anticoagulant" class="text-medical-600 rounded">
                <span>ยาต้านการแข็งตัวของเลือด (Warfarin, Eliquis, Xarelto, Pradaxa)</span>
              </label>
              <label class="selectable-card gap-2.5 flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                <input type="checkbox" name="hemoBleedingMeds" value="med_antiplatelet" class="text-medical-600 rounded">
                <span>ยาต้านเกล็ดเลือด (Aspirin, Clopidogrel / Plavix)</span>
              </label>
              <label class="selectable-card gap-2.5 flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                <input type="checkbox" name="hemoBleedingMeds" value="med_unknown_prescribed" class="text-medical-600 rounded">
                <span>มียาประจำตัว แต่ไม่แน่ใจ / ไม่ทราบชื่อยาที่ใช้</span>
              </label>
              <label class="selectable-card gap-2.5 flex items-center p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                <input type="checkbox" name="hemoBleedingMeds" value="meds_none" class="text-medical-600 rounded">
                <span>ไม่ได้รับประทานยากลุ่มนี้</span>
              </label>
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
        <textarea id="hemoptysis_other_free" rows="2" placeholder="พิมพ์ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)..."
          class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"></textarea>
      </div>

    </div>
  `,

  // --- Lifecycle Hooks ---
  init: function() {
    if (typeof lucide !== 'undefined') lucide.createIcons();
    clearHemoPainScore();
  },

  collectIntake: function(ctx = {}) {
    const durVal = parseInt(document.getElementById('hemoDurationVal')?.value, 10);
    const durUnit = document.getElementById('hemoDurationUnit')?.value || 'hours';

    const getRadio = (name) => {
      const el = document.querySelector(`input[name="${name}"]:checked`);
      return el ? el.value : null;
    };
    const getChecks = (name) => {
      return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(el => el.value);
    };

    const hemoBloodChar = getRadio('hemoBloodChar');
    const hemoBloodVolume = getRadio('hemoBloodVolume');
    const hemoEpisodeCount = getRadio('hemoEpisodeCount');
    const hemoActiveStatus = getRadio('hemoActiveStatus');
    const hemoPreCoughMaster = getRadio('hemoPreCoughMaster') || 'no';
    const hemoPreCoughDurVal = parseInt(document.getElementById('hemoPreCoughDurVal')?.value, 10) || null;
    const hemoPreCoughDurUnit = document.getElementById('hemoPreCoughDurUnit')?.value || 'days';
    const hemoPriorSputum = getRadio('hemoPriorSputum');
    const hemoDyspnea = getRadio('hemoDyspnea');
    const hemoChestPainMaster = getRadio('hemoChestPainMaster') || 'no';
    const hemoChestPainType = getChecks('hemoChestPainType');
    const hemoWarningSigns = getChecks('hemoWarningSigns');
    const hemoPastPulmonary = getChecks('hemoPastPulmonary');
    const hemoSmokingStatus = getRadio('hemoSmokingStatus') || 'smoking_never';
    const hemoSmokingYears = parseInt(document.getElementById('hemoSmokingYears')?.value, 10) || null;
    const hemoSmokingPacks = parseFloat(document.getElementById('hemoSmokingPacks')?.value) || null;
    const hemoBleedingMeds = getChecks('hemoBleedingMeds');
    const otherSymptomsFree = document.getElementById('hemoptysis_other_free')?.value?.trim() || ctx.otherSymptomsFree || '';

    const rec = {
      id: ctx.recordId || ctx.id,
      queue_number: ctx.queueNumber || ctx.queue_number,
      hn: ctx.randomHn || ctx.hn,
      name: ctx.patientName || ctx.name,
      age: ctx.patientAge !== undefined ? ctx.patientAge : ctx.age,
      gender: ctx.gender,
      chief_complaint: 'hemoptysis',
      chief_complaint_title: 'ไอเป็นเลือด',
      timestamp: new Date().toISOString(),
      status: ctx.recordStatus || ctx.status || 'waiting',
      durationVal: !isNaN(durVal) ? durVal : null,
      durationUnit: durUnit,
      hospRecordStatus: ctx.hospRecordStatus || 'unspecified',
      underlying: ctx.underlying || [],
      drugAllergy: ctx.drugAllergy || 'ไม่ได้ระบุ',
      currentMeds: ctx.currentMeds || 'ไม่ได้ระบุ',
      otherSymptomsFree,
      doctor_notes: ctx.preservedDoctorNotes || ctx.doctor_notes || { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      hemoBloodChar,
      hemoBloodVolume,
      hemoEpisodeCount,
      hemoActiveStatus,
      hemoPreCoughMaster,
      hemoPreCoughDurVal,
      hemoPreCoughDurUnit,
      hemoPriorSputum,
      hemoDyspnea,
      hemoChestPainMaster,
      hemoChestPainType,
      painScore: hemoPainScoreTouched ? parseInt(document.getElementById('hemoPainScore')?.value || '0', 10) : null,
      hemoWarningSigns,
      hemoPastPulmonary,
      hemoSmokingStatus,
      hemoSmokingYears,
      hemoSmokingPacks,
      hemoBleedingMeds
    };

    updateHemoptysisOutputs(rec);
    return rec;
  },

  populateForm: function(patient) {
    if (!patient) return;
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el && val !== undefined && val !== null) el.value = val;
    };
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

    setVal('hemoDurationVal', patient.durationVal);
    setVal('hemoDurationUnit', patient.durationUnit || 'hours');

    setRadio('hemoBloodChar', patient.hemoBloodChar);
    setRadio('hemoBloodVolume', patient.hemoBloodVolume);
    setRadio('hemoEpisodeCount', patient.hemoEpisodeCount);
    setRadio('hemoActiveStatus', patient.hemoActiveStatus);

    setRadio('hemoPreCoughMaster', patient.hemoPreCoughMaster || (patient.hemoPreCoughDurVal ? 'yes' : 'no'));
    toggleHemoPreCoughSub(patient.hemoPreCoughMaster === 'yes' || Boolean(patient.hemoPreCoughDurVal));
    setVal('hemoPreCoughDurVal', patient.hemoPreCoughDurVal);
    setVal('hemoPreCoughDurUnit', patient.hemoPreCoughDurUnit || 'days');

    setRadio('hemoPriorSputum', patient.hemoPriorSputum);
    setRadio('hemoDyspnea', patient.hemoDyspnea);

    setRadio('hemoChestPainMaster', patient.hemoChestPainMaster || (patient.hemoChestPainType?.length > 0 ? 'yes' : 'no'));
    toggleHemoChestPainSub(patient.hemoChestPainMaster === 'yes' || patient.hemoChestPainType?.length > 0);
    setChecks('hemoChestPainType', patient.hemoChestPainType);

    if (typeof patient.painScore === 'number' && patient.painScore >= 0) {
      const slider = document.getElementById('hemoPainScore');
      if (slider) slider.value = patient.painScore;
      handleHemoPainScoreChange(patient.painScore);
    } else {
      clearHemoPainScore();
    }

    setChecks('hemoWarningSigns', patient.hemoWarningSigns);
    const warnSigns = Array.isArray(patient.hemoWarningSigns) ? patient.hemoWarningSigns : [];
    const hasSyncope = warnSigns.some(w => ['warn_fainting_syncope', 'warn_profuse_sweat_cold_shock', 'warn_palpitation_tachycardia'].includes(w));
    const hasDvt = warnSigns.some(w => ['warn_unilateral_leg_swelling', 'warn_long_travel_immobility', 'warn_post_op_bedridden', 'warn_history_dvt_pe'].includes(w));
    const hasFever = warnSigns.some(w => ['warn_high_fever_chills', 'warn_fever_afternoon_night_sweat'].includes(w));

    const syncopeParent = document.getElementById('hemoWarningSyncopeParent');
    if (syncopeParent) syncopeParent.checked = hasSyncope;
    toggleHemoWarningGroup('hemoWarningSyncopeSub', hasSyncope);

    const dvtParent = document.getElementById('hemoWarningDvtPeParent');
    if (dvtParent) dvtParent.checked = hasDvt;
    toggleHemoWarningGroup('hemoWarningDvtPeSub', hasDvt);

    const feverParent = document.getElementById('hemoWarningFeverParent');
    if (feverParent) feverParent.checked = hasFever;
    toggleHemoWarningGroup('hemoWarningFeverSub', hasFever);

    setChecks('hemoPastPulmonary', patient.hemoPastPulmonary);
    setRadio('hemoSmokingStatus', patient.hemoSmokingStatus);
    toggleHemoSmokingSub(patient.hemoSmokingStatus === 'smoking_regular');
    setVal('hemoSmokingYears', patient.hemoSmokingYears);
    setVal('hemoSmokingPacks', patient.hemoSmokingPacks);

    setChecks('hemoBleedingMeds', patient.hemoBleedingMeds);
    const otherFreeEl = document.getElementById('hemoptysis_other_free');
    if (otherFreeEl) otherFreeEl.value = patient.otherSymptomsFree || '';
  },

  clearForm: function() {
    ['hemoDurationVal', 'hemoPreCoughDurVal', 'hemoSmokingYears', 'hemoSmokingPacks', 'hemoptysis_other_free'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });

    const durUnit = document.getElementById('hemoDurationUnit');
    if (durUnit) durUnit.value = 'hours';

    const radios = document.querySelectorAll('#hemoptysisQuestionnaireSection input[type="radio"]');
    radios.forEach(r => { r.checked = false; });

    const checks = document.querySelectorAll('#hemoptysisQuestionnaireSection input[type="checkbox"]');
    checks.forEach(c => { c.checked = false; });

    ['hemoPreCoughSub', 'hemoChestPainSub', 'hemoWarningSyncopeSub', 'hemoWarningDvtPeSub',
     'hemoWarningFeverSub', 'hemoSmokingSub'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });

    clearHemoPainScore();
  },

  hydrateForm: function(patient) {
    this.populateForm(patient);
  },
  isRedFlag: function(patient) {
    return evaluateHemoptysisRedFlags(patient).length > 0;
  },
  updateOutputs: updateHemoptysisOutputs,
  renderRapidHpi: renderHemoptysisRapidHpi,
  renderNarrative: renderHemoptysisNarrative,
  renderDoctorHpi: renderHemoptysisDoctorHpi,
  evaluateRedFlags: evaluateHemoptysisRedFlags,
  generateCds: generateHemoptysisCds,

  // --- Seed Patients Registry ---
  seedPatients: [
    // Case 1: Massive Hemoptysis & Shock (ESI 1)
    {
      id: 'case-hemo-01',
      queue_number: 'E1-101',
      hn: '7890101',
      name: 'นายบุญช่วย สำลักโลหิต',
      age: 58,
      gender: 'ชาย',
      chief_complaint: 'hemoptysis',
      chief_complaint_title: 'ไอเป็นเลือด',
      timestamp: '2026-11-03T09:15:00.000Z',
      status: 'waiting',
      durationVal: 2,
      durationUnit: 'hours',
      hospRecordStatus: 'complete',
      underlying: ['ความดันสูง (HT)'],
      drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร',
      currentMeds: 'Amlodipine (5 mg) 1 tab od pc',
      otherSymptomsFree: 'ไอสำลักเลือดสดทะลักพุ่งต่อเนื่อง หน้ามืด วูบ ตัวสั่น เหงื่อแตกท่วมตัว',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.5, sbp: 85, dbp: 50, bp: '85/50', pr: 124, rr: 26, spo2: 88 },
      esi_level: 1,

      hemoBloodChar: 'char_true_frothy_red',
      hemoBloodVolume: 'vol_massive_over_cup',
      hemoEpisodeCount: 'episodes_frequent_continuous',
      hemoActiveStatus: 'status_active_bleeding',
      hemoPreCoughMaster: 'no',
      hemoPriorSputum: 'sputum_none_dry_cough',
      hemoDyspnea: 'dyspnea_severe_rest_orthopnea',
      hemoChestPainMaster: 'no',
      hemoChestPainType: [],
      hemoWarningSigns: ['warn_choking_airway_threat', 'warn_fainting_syncope', 'warn_profuse_sweat_cold_shock'],
      hemoPastPulmonary: ['pulm_none'],
      hemoSmokingStatus: 'smoking_quit',
      hemoBleedingMeds: ['meds_none']
    },

    // Case 2: Pulmonary Embolism with DVT (ESI 2)
    {
      id: 'case-hemo-02',
      queue_number: 'E2-102',
      hn: '7890102',
      name: 'น.ส.วิภาภรณ์ แน่นอกเฉียบพลัน',
      age: 42,
      gender: 'หญิง',
      chief_complaint: 'hemoptysis',
      chief_complaint_title: 'ไอเป็นเลือด',
      timestamp: '2026-11-03T10:00:00.000Z',
      status: 'waiting',
      durationVal: 6,
      durationUnit: 'hours',
      hospRecordStatus: 'complete',
      underlying: [],
      drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร',
      currentMeds: 'ไม่มี',
      otherSymptomsFree: 'ไอเป็นเลือดสด เจ็บแปล๊บหน้าอกเวลาหายใจลึก น่องซ้ายบวมตึงมาก เพิ่งบินกลับจากต่างประเทศ',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 37.0, sbp: 125, dbp: 80, bp: '125/80', pr: 108, rr: 22, spo2: 94 },
      esi_level: 2,

      hemoBloodChar: 'char_true_frothy_red',
      hemoBloodVolume: 'vol_tablespoon',
      hemoEpisodeCount: 'episodes_two_four',
      hemoActiveStatus: 'status_active_bleeding',
      hemoPreCoughMaster: 'no',
      hemoPriorSputum: 'sputum_none_dry_cough',
      hemoDyspnea: 'dyspnea_exertional',
      hemoChestPainMaster: 'yes',
      hemoChestPainType: ['pleuritic_sharp'],
      painScore: 7,
      hemoWarningSigns: ['warn_unilateral_leg_swelling', 'warn_long_travel_immobility'],
      hemoPastPulmonary: ['pulm_none'],
      hemoSmokingStatus: 'smoking_never',
      hemoBleedingMeds: ['meds_none']
    },

    // Case 3: Active Cavitary TB / Malignancy Risk (ESI 2)
    {
      id: 'case-hemo-03',
      queue_number: 'E2-103',
      hn: '7890103',
      name: 'นายสมศักดิ์ ไอเรื้อรังผอมลง',
      age: 64,
      gender: 'ชาย',
      chief_complaint: 'hemoptysis',
      chief_complaint_title: 'ไอเป็นเลือด',
      timestamp: '2026-11-03T10:30:00.000Z',
      status: 'waiting',
      durationVal: 3,
      durationUnit: 'days',
      hospRecordStatus: 'complete',
      underlying: ['ถุงลมโป่งพอง (COPD)'],
      drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร',
      currentMeds: 'Seretide accuhaler 1 puff bid, Ventolin inhaler 2 puffs prn',
      otherSymptomsFree: 'ไอเรื้อรังมา 1 เดือน วันนี้ไอเลือดสดออกมากกว่าครึ่งแก้ว มีไข้รุมๆ เหงื่อท่วมตอนกลางคืน น้ำหนักลด 7 กก.',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 37.8, sbp: 118, dbp: 72, bp: '118/72', pr: 86, rr: 18, spo2: 96 },
      esi_level: 2,

      hemoBloodChar: 'char_true_frothy_red',
      hemoBloodVolume: 'vol_half_to_full_cup',
      hemoEpisodeCount: 'episodes_over_5',
      hemoActiveStatus: 'status_active_bleeding',
      hemoPreCoughMaster: 'yes',
      hemoPreCoughDurVal: 1,
      hemoPreCoughDurUnit: 'months',
      hemoPriorSputum: 'sputum_foul_abscess_green',
      hemoDyspnea: 'dyspnea_exertional',
      hemoChestPainMaster: 'no',
      hemoChestPainType: [],
      hemoWarningSigns: ['warn_fever_afternoon_night_sweat', 'warn_unintentional_weight_loss'],
      hemoPastPulmonary: ['tb_prior_or_contact', 'past_copd_asthma'],
      hemoSmokingStatus: 'smoking_regular',
      hemoSmokingYears: 30,
      hemoSmokingPacks: 1,
      hemoBleedingMeds: ['meds_none']
    },

    // Case 4: Acute Bronchitis with Blood-Streaked Sputum (ESI 4)
    {
      id: 'case-hemo-04',
      queue_number: 'E4-104',
      hn: '7890104',
      name: 'นายกิตติวัฒน์ ไอหลอดลมอักเสบ',
      age: 26,
      gender: 'ชาย',
      chief_complaint: 'hemoptysis',
      chief_complaint_title: 'ไอเป็นเลือด',
      timestamp: '2026-11-03T11:00:00.000Z',
      status: 'waiting',
      durationVal: 2,
      durationUnit: 'days',
      hospRecordStatus: 'self',
      underlying: [],
      drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร',
      currentMeds: 'ไม่มี',
      otherSymptomsFree: 'ไอมีเสมหะปนเส้นเลือดแดงเล็กน้อยหลังไอสะบัดแรงๆ 2 วัน ตอนนี้เลือดหยุดแล้ว ไม่เหนื่อย',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.8, sbp: 120, dbp: 78, bp: '120/78', pr: 74, rr: 16, spo2: 99 },
      esi_level: 4,

      hemoBloodChar: 'char_streaked_sputum',
      hemoBloodVolume: 'vol_streaks_sputum',
      hemoEpisodeCount: 'episodes_single',
      hemoActiveStatus: 'status_stopped_completely',
      hemoPreCoughMaster: 'yes',
      hemoPreCoughDurVal: 3,
      hemoPreCoughDurUnit: 'days',
      hemoPriorSputum: 'sputum_normal_white_yellow',
      hemoDyspnea: 'dyspnea_none',
      hemoChestPainMaster: 'no',
      hemoChestPainType: [],
      hemoWarningSigns: [],
      hemoPastPulmonary: ['pulm_none'],
      hemoSmokingStatus: 'smoking_never',
      hemoBleedingMeds: ['meds_none']
    }
  ]
};

// Register module in Ratchaburi ER Core Registry
if (typeof registerCcModule === 'function') {
  registerCcModule(hemoptysisModule);
} else if (typeof window !== 'undefined' && typeof window.registerCcModule === 'function') {
  window.registerCcModule(hemoptysisModule);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = hemoptysisModule;
}
