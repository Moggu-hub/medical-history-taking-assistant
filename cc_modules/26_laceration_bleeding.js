// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 26_laceration_bleeding.js
// อาการนำ: บาดแผลฉีกขาด / มีเลือดออก (Laceration / Active Bleeding)
// รองรับ Zero Default Bias, Progressive Disclosure 6 ตำแหน่งร่างกาย,
// Universal Date/Time, Pain Slider Touch State, และ Core Guard TDD 100%
// =========================================================================

// --- Module-scoped State & Helpers ---
let lacPainScoreTouched = false;

function toggleLacGroup(subId, show) {
  const el = document.getElementById(subId);
  if (!el) return;
  if (show) {
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
    el.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    el.querySelectorAll('input[type="radio"]').forEach(rb => { rb.checked = false; });
    const textInputs = el.querySelectorAll('input[type="text"]');
    textInputs.forEach(ti => { ti.value = ''; });
    const numInputs = el.querySelectorAll('input[type="number"]');
    numInputs.forEach(ni => { ni.value = ''; });
  }
}

function clearLacPainScore() {
  lacPainScoreTouched = false;
  const slider = document.getElementById('lacPainScore');
  if (slider) slider.value = 0;
  const emojiEl = document.getElementById('lacPainScoreEmoji');
  const textEl = document.getElementById('lacPainScoreText');
  const badgeEl = document.getElementById('lacPainScoreBadge');
  const clearBtn = document.getElementById('lacPainScoreClearBtn');
  if (emojiEl) emojiEl.textContent = '⚪';
  if (textEl) textEl.textContent = 'ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)';
  if (badgeEl) badgeEl.className = 'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all';
  if (clearBtn) clearBtn.classList.add('hidden');
}

function handleLacPainScoreChange(val) {
  lacPainScoreTouched = true;
  const num = parseInt(val, 10);
  const slider = document.getElementById('lacPainScore');
  if (slider) slider.value = num;
  const emojiEl = document.getElementById('lacPainScoreEmoji');
  const textEl = document.getElementById('lacPainScoreText');
  const badgeEl = document.getElementById('lacPainScoreBadge');
  const clearBtn = document.getElementById('lacPainScoreClearBtn');
  if (clearBtn) clearBtn.classList.remove('hidden');
  if (!emojiEl || !textEl || !badgeEl) return;

  let emoji = '😐', label = 'ปวดปานกลาง', badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
  if (num === 0) {
    emoji = '😊'; label = 'สบายดี (ไม่ปวดเลย)'; badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  } else if (num <= 3) {
    emoji = '🙂'; label = 'ปวดเล็กน้อย (ทนได้)'; badgeClass = 'bg-lime-100 text-lime-800 border-lime-300';
  } else if (num <= 6) {
    emoji = '😐'; label = 'ปวดปานกลาง (รบกวนสมาธิ)'; badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
  } else if (num <= 8) {
    emoji = '😣'; label = 'ปวดรุนแรง (ทนแทบไม่ไหว)'; badgeClass = 'bg-orange-100 text-orange-800 border-orange-300';
  } else {
    emoji = '😫'; label = 'ปวดรุนแรงที่สุดในชีวิต'; badgeClass = 'bg-rose-100 text-rose-800 border-rose-300';
  }

  emojiEl.textContent = emoji;
  textEl.textContent = `${num}/10 คะแนน - ${label}`;
  badgeEl.className = `inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-auto transition-all ${badgeClass}`;
}
const handleLacPainSliderTouch = handleLacPainScoreChange;

// --- Clinical Decision Support & Evaluation Functions ---
function evaluateLacerationRedFlags(patient) {
  const rfs = [];
  const addRf = (key, level, textTh, risk, suggestedAction) => {
    rfs.push({ key, level, textTh, title: textTh, risk, detail: risk, suggestedAction, action: suggestedAction });
  };
  const vs = patient.vital_signs || {};
  const sbp = vs.sbp !== undefined && vs.sbp !== null ? parseInt(vs.sbp, 10) : null;
  const pr = vs.pr !== undefined && vs.pr !== null ? parseInt(vs.pr, 10) : null;

  const bleedingStatus = patient.lacBleedingStatus || '';
  const systemicSigns = Array.isArray(patient.lacSystemicSigns) ? patient.lacSystemicSigns : [];
  const contaminants = Array.isArray(patient.lacContaminants) ? patient.lacContaminants : [];
  const antithrombotic = patient.lacAntithrombotic || '';

  const headSigns = Array.isArray(patient.lacHeadSigns) ? patient.lacHeadSigns : [];
  const neckSigns = Array.isArray(patient.lacNeckSigns) ? patient.lacNeckSigns : [];
  const chestSigns = Array.isArray(patient.lacChestSigns) ? patient.lacChestSigns : [];
  const abdomenSigns = Array.isArray(patient.lacAbdomenSigns) ? patient.lacAbdomenSigns : [];
  const upperExtSigns = Array.isArray(patient.lacUpperExtSigns) ? patient.lacUpperExtSigns : [];
  const lowerExtSigns = Array.isArray(patient.lacLowerExtSigns) ? patient.lacLowerExtSigns : [];

  // 1. Uncontrolled Arterial Bleeding / Hemorrhagic Shock (ESI 1)
  const isShockVs = (sbp !== null && sbp < 90) || (sbp !== null && pr !== null && (pr / sbp) >= 1.0);
  const isSpurting = bleedingStatus === 'active_spurting';
  const hasShockSigns = systemicSigns.includes('palpitation_cold_sweat') && systemicSigns.includes('dizziness_presyncope');

  if (isSpurting || hasShockSigns || isShockVs) {
    addRf('rf_lac_arterial_hemorrhagic_shock', 1,
      'ภาวะเลือดออกรุนแรงพุ่งเป็นจังหวะตามชีพจร หรือมีภาวะช็อกจากการเสียเลือด (Uncontrolled Arterial Bleeding / Hemorrhagic Shock)',
      'Hypovolemic shock, cardiac arrest, irreversible tissue hypoxia secondary to massive blood loss.',
      'Immediate Direct Pressure Dressing. Apply arterial tourniquet proximal to wound if on extremity and direct pressure fails. Establish 2 large-bore IV lines (16-18G), stat fluid resuscitation, Type & Crossmatch PRBCs, notify Trauma Surgeon immediately.');
  }

  // 2. Penetrating Neck / Thoracic / Abdominal Trauma (ESI 1)
  const isNeckCritical = neckSigns.includes('airway_dyspnea_stridor') || neckSigns.includes('expanding_neck_mass');
  const isChestCritical = chestSigns.includes('sucking_chest_wound') || chestSigns.includes('dyspnea_pleuritic_pain');
  const isAbdomenCritical = abdomenSigns.includes('evisceration_internal_organ') || abdomenSigns.includes('severe_abd_pain_rigid');

  if (isNeckCritical || isChestCritical || isAbdomenCritical) {
    addRf('rf_lac_penetrating_neck_torso', 1,
      'บาดแผลลึกหรือทะลุบริเวณลำคอ หน้าอก หรือช่องท้อง (Penetrating Neck / Thoracic / Abdominal Trauma)',
      'Tension/open pneumothorax, major vascular disruption, tracheobronchial injury, visceral rupture with peritonitis.',
      'Apply 3-sided occlusive dressing for sucking chest wound. Cover eviscerated bowel with moist sterile saline gauze (do not push back). Stat eFAST ultrasound, upright/portable CXR, Stat surgical consultation for emergency exploration.');
  }

  // 3. Traumatic Amputation / Acute Limb Ischemia (ESI 1 / 2)
  const hasAmputation = upperExtSigns.includes('amputation_hand') || lowerExtSigns.includes('amputation_leg');
  const hasIschemia = upperExtSigns.includes('vascular_cold_pale_hand') || lowerExtSigns.includes('vascular_cold_pale_foot');

  if (hasAmputation || hasIschemia) {
    addRf('rf_lac_traumatic_amputation_ischemia', 2,
      'ภาวะนิ้วหรืออวัยวะขาด หรือมีภาวะขาดเลือดส่วนปลาย (Traumatic Amputation / Acute Limb Ischemia)',
      'Permanent loss of extremity/digit viability, muscle necrosis, secondary systemic toxicity.',
      'Control stump bleeding with compressive dressing. Wrap amputated part in saline-moistened sterile gauze, seal in plastic bag, place on ice-water bath (avoid direct ice contact). Stat Orthopedic/Plastic Surgery consult for emergent replantation. Stat IV Cefazolin.');
  }

  // 4. Head Laceration with TBI Warning / Open Globe Injury (ESI 2)
  const hasHeadTbi = headSigns.includes('loss_of_consciousness') || headSigns.includes('csf_leak_ear_nose') || headSigns.includes('severe_headache_vomit');
  const hasEyeInjury = headSigns.includes('vision_problem_eye_injury');

  if (hasHeadTbi || hasEyeInjury) {
    addRf('rf_lac_head_ocular_trauma', 2,
      'บาดแผลศีรษะร่วมกับอาการทางสมอง หรือบาดแผลทะลุดวงตา (Head Laceration with TBI Warning / Open Globe Injury)',
      'Intracranial hemorrhage, brain herniation, traumatic optic neuropathy, permanent blindness from globe rupture.',
      'For suspected eye injury: place rigid eye shield immediately, DO NOT apply pressure or remove foreign objects, stat Ophthalmology consult. For TBI signs: perform full Glasgow Coma Scale (GCS) and schedule Stat Non-contrast CT Brain.');
  }

  // 5. Suspected Open Fracture / Tendon or Nerve Injury (ESI 2 / 3)
  const hasOpenFx = upperExtSigns.includes('open_fracture_arm') || lowerExtSigns.includes('open_fracture_leg');
  const hasTendonNerve = upperExtSigns.includes('tendon_deficit_hand') || upperExtSigns.includes('nerve_numbness_hand') || lowerExtSigns.includes('tendon_bone_deficit_leg') || lowerExtSigns.includes('nerve_numbness_foot');

  if (hasOpenFx || hasTendonNerve) {
    addRf('rf_lac_open_fracture_tendon_nerve', hasOpenFx ? 2 : 3,
      hasOpenFx ? 'สงสัยกระดูกหักแบบมีแผลเปิด (Suspected Open Fracture)' : 'สงสัยเส้นเอ็นหรือเส้นประสาทบาดเจ็บ (Suspected Tendon or Peripheral Nerve Injury)',
      'Osteomyelitis, permanent loss of fine motor dexterity, claw hand, drop foot, persistent neuropathy.',
      'Assess and document 2-point discrimination and individual tendon motion BEFORE local anesthesia. Stat X-ray of injured limb. For open fracture: initiate IV Cefazolin within 1 hr, apply sterile dressing and splint, urgent Orthopedic consult.');
  }

  // 6. Suspected Retained Foreign Body / Anticoagulant Use (ESI 3)
  const hasRetainedFb = contaminants.includes('foreign_body_retained');
  const hasAnticoag = antithrombotic === 'on_anticoagulant_antiplatelet' || antithrombotic === 'bleeding_disorder';

  if (hasRetainedFb || hasAnticoag) {
    addRf('rf_lac_retained_fb_anticoagulant', 3,
      hasRetainedFb ? 'สงสัยมีสิ่งแปลกปลอมตกค้างหรือหักคาในบาดแผล (Suspected Retained Foreign Body in Wound)' : 'ผู้ป่วยมีประวัติใช้ยาละลายลิ่มเลือด หรือมีภาวะเลือดออกง่ายหยุดยาก (Anticoagulant / Bleeding Disorder Risk)',
      'Delayed wound healing, chronic infection, granuloma formation, secondary refractory hemorrhage.',
      'Order soft tissue X-ray or bedside POCUS to locate radiopaque/sonographic foreign bodies prior to suturing. Check PT/INR if on Warfarin, prepare for prolonged compression and consider hemostatic adjuncts.');
  }

  return rfs;
}

// --- Formatters for Doctor Rapid Note (Thai-Centric) ---
function formatLacCauses(patient) {
  const causes = Array.isArray(patient.lacCauses) ? patient.lacCauses : [];
  if (causes.length === 0) return 'ไม่ได้ระบุสาเหตุ';
  const parts = [];
  if (causes.includes('sharp_object')) parts.push(patient.lacCauseSharpDetail ? `ของมีคมบาด/ทิ่มแทง (${patient.lacCauseSharpDetail})` : 'ของมีคมบาด หรือทิ่มแทง');
  if (causes.includes('machinery_tools')) parts.push(patient.lacCauseMachineryDetail ? `เครื่องจักรกล/อุปกรณ์ไฟฟ้า (${patient.lacCauseMachineryDetail})` : 'เครื่องจักรกล หรืออุปกรณ์ไฟฟ้า/การเกษตร');
  if (causes.includes('blunt_impact')) parts.push(patient.lacCauseBluntDetail ? `ถูกกระแทกด้วยของแข็ง (${patient.lacCauseBluntDetail})` : 'ถูกกระแทกด้วยของแข็ง');
  if (causes.includes('fall_collision')) parts.push('หกล้ม หรือชนกระแทกจนเกิดแผลแตก');
  if (causes.includes('puncture_wound')) parts.push(patient.lacCausePunctureDetail ? `ของแหลมทิ่มตำ (${patient.lacCausePunctureDetail})` : 'ถูกไม้ ตะปู เสี้ยน หรือของแหลมทิ่มตำ');
  if (causes.includes('other_cause')) parts.push(patient.lacCauseOtherDetail ? `สาเหตุอื่น: ${patient.lacCauseOtherDetail}` : 'สาเหตุอื่นๆ');
  return parts.join(', ');
}

function formatLacContaminants(patient) {
  const conts = Array.isArray(patient.lacContaminants) ? patient.lacContaminants : [];
  if (conts.length === 0) return 'ไม่ได้ระบุ';
  const map = {
    foreign_body_retained: 'มีวัตถุหักคา/ปักคาในแผล 🚩',
    dirty_contaminated: 'แผลปนเปื้อนดินโคลน สนิม หรือน้ำสกปรก 🚩',
    clean_wound: 'แผลสะอาด ไม่มีสิ่งแปลกปลอม'
  };
  return conts.map(c => map[c] || c).join(', ');
}

function formatLacBleedingStatus(patient) {
  const map = {
    active_spurting: 'เลือดยังไหลพุ่งเป็นจังหวะตามชีพจร หรือไหลทะลักมากผิดปกติ 🚩',
    active_oozing: 'เลือดยังไหลซึมต่อเนื่อง',
    stopped: 'เลือดหยุดไหลแล้ว หรือมีเพียงคราบเลือดซึมเล็กน้อย'
  };
  return map[patient.lacBleedingStatus] || 'ไม่ได้ระบุ';
}

function formatLacProdrome(patient) {
  const map = {
    no_prodrome: 'ไม่มีอาการผิดปกตินำมาก่อน (อุบัติเหตุโดยตรง)',
    has_prodrome: 'มีอาการวูบ หน้ามืด เจ็บหน้าอก หรืออ่อนแรงนำมาก่อน 🚩'
  };
  return map[patient.lacProdrome] || 'ไม่ได้ระบุ';
}

function formatLacTetanus(patient) {
  const map = {
    within_5_years: 'เคยฉีดเข็มล่าสุดภายในไม่เกิน 5 ปี (ภูมิคุ้มกันยังครอบคลุม)',
    '5_to_10_years': 'เคยฉีดเข็มล่าสุด 5-10 ปี (พิจารณาฉีดกระตุ้นหากแผลสกปรก) 🚩',
    more_than_10_years: 'ฉีดเข็มล่าสุดเกิน 10 ปี (ต้องฉีดวัคซีนกระตุ้น dT) 🚩',
    never_or_unsure: 'ไม่เคยฉีด หรือจำไม่ได้/ไม่แน่ใจ (ต้องฉีดวัคซีนกระตุ้น ± TIG) 🚩'
  };
  return map[patient.lacTetanusHx] || 'ไม่ได้ระบุ';
}

function formatLacAntithrombotic(patient) {
  const map = {
    on_anticoagulant_antiplatelet: 'รับประทานยาละลายลิ่มเลือด หรือยาต้านเกล็ดเลือด 🚩',
    bleeding_disorder: 'มีโรคประจำตัวเลือดออกง่ายหยุดยาก 🚩',
    unknown_meds: 'มียาประจำตัวรับประทานอยู่ แต่ไม่ทราบชื่อยา',
    no_antithrombotic: 'ไม่ได้ใช้ยากลุ่มนี้ และไม่มีโรคเลือดหยุดยาก'
  };
  return map[patient.lacAntithrombotic] || 'ไม่ได้ระบุ';
}

function formatLacAnatomy(patient) {
  const parts = [];

  const sideLabel = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return '';
    const thMap = { left: 'ซ้าย', right: 'ขวา', center: 'ตรงกลาง' };
    return ` [${arr.map(s => thMap[s] || s).join(', ')}]`;
  };
  const digitMap = { thumb: 'นิ้วโป้ง', index: 'นิ้วชี้', middle: 'นิ้วกลาง', ring: 'นิ้วนาง', little: 'นิ้วก้อย' };
  const fmtDigitsBySide = (leftD, rightD, fallbackSides, fallbackD) => {
    const dParts = [];
    if (Array.isArray(leftD) && leftD.length > 0) dParts.push(`ซ้าย: ${leftD.map(x => digitMap[x] || x).join(', ')}`);
    if (Array.isArray(rightD) && rightD.length > 0) dParts.push(`ขวา: ${rightD.map(x => digitMap[x] || x).join(', ')}`);
    if (dParts.length > 0) return ` [${dParts.join('; ')}]`;
    return `${sideLabel(fallbackSides)}${Array.isArray(fallbackD) && fallbackD.length > 0 ? ` [${fallbackD.map(x => digitMap[x] || x).join(', ')}]` : ''}`;
  };

  // 1. Head & Face
  if (patient.lacParentHeadFace) {
    const headParts = [];
    if (patient.lacHeadScalp) headParts.push(`หนังศีรษะ/หน้าผาก${sideLabel(patient.lacHeadScalpSides)}`);
    if (patient.lacHeadFace) headParts.push(`ใบหน้า/คิ้ว/แก้ม/คาง${sideLabel(patient.lacHeadFaceSides)}`);
    if (patient.lacHeadEye) headParts.push(`ดวงตา/เปลือกตา${sideLabel(patient.lacHeadEyeSides)}`);
    if (patient.lacHeadEar) headParts.push(`ใบหู${sideLabel(patient.lacHeadEarSides)}`);
    if (patient.lacHeadNoseMouth) headParts.push(`จมูก/ปาก/ลิ้น${sideLabel(patient.lacHeadNoseMouthSides)}`);
    parts.push(`ศีรษะ/ใบหน้า: ${headParts.length > 0 ? headParts.join(', ') : 'มีบาดแผล'}`);
  }

  // 2. Neck
  if (patient.lacParentNeck) {
    const neckParts = [];
    if (patient.lacNeckFront) neckParts.push(`คอด้านหน้า${sideLabel(patient.lacNeckFrontSides)}`);
    if (patient.lacNeckSide) neckParts.push(`คอด้านข้าง${sideLabel(patient.lacNeckSideSides)}`);
    if (patient.lacNeckBack) neckParts.push(`ต้นคอด้านหลัง${sideLabel(patient.lacNeckBackSides)}`);
    parts.push(`ลำคอ/ต้นคอ: ${neckParts.length > 0 ? neckParts.join(', ') : 'มีบาดแผล'}`);
  }

  // 3. Chest & Upper Back
  if (patient.lacParentChest) {
    const chestParts = [];
    if (patient.lacChestRibs) chestParts.push(`หน้าอก/ซี่โครง${sideLabel(patient.lacChestRibsSides)}`);
    if (patient.lacChestUpperBack) chestParts.push(`หลังส่วนบน/สะบัก${sideLabel(patient.lacChestUpperBackSides)}`);
    parts.push(`ทรวงอก/หลังส่วนบน: ${chestParts.length > 0 ? chestParts.join(', ') : 'มีบาดแผล'}`);
  }

  // 4. Abdomen & Lower Back
  if (patient.lacParentAbdomen) {
    const abdParts = [];
    if (patient.lacAbdWall) abdParts.push(`หน้าท้อง${sideLabel(patient.lacAbdWallSides)}`);
    if (patient.lacAbdFlank) abdParts.push(`สีข้าง/บั้นเอว${sideLabel(patient.lacAbdFlankSides)}`);
    if (patient.lacAbdLowerBack) abdParts.push(`หลังส่วนล่าง${sideLabel(patient.lacAbdLowerBackSides)}`);
    if (patient.lacAbdButtock) abdParts.push(`ก้น/สะโพก${sideLabel(patient.lacAbdButtockSides)}`);
    if (patient.lacAbdGenitalia) abdParts.push(`ขาหนีบ/อวัยวะเพศ${sideLabel(patient.lacAbdGenitaliaSides)}`);
    parts.push(`ช่องท้อง/หลังส่วนล่าง: ${abdParts.length > 0 ? abdParts.join(', ') : 'มีบาดแผล'}`);
  }

  // 5. Upper Extremity
  if (patient.lacParentUpperExtremity) {
    const armParts = [];
    if (patient.lacArmShoulder) armParts.push(`ไหล่/ต้นแขน${sideLabel(patient.lacArmShoulderSides)}`);
    if (patient.lacArmElbow) armParts.push(`ข้อศอก/แขนท่อนล่าง${sideLabel(patient.lacArmElbowSides)}`);
    if (patient.lacArmWrist) armParts.push(`ข้อมือ/ฝ่ามือ/หลังมือ${sideLabel(patient.lacArmWristSides)}`);
    if (patient.lacArmFingers) armParts.push(`นิ้วมือ${fmtDigitsBySide(patient.lacArmFingersLeftDigits, patient.lacArmFingersRightDigits, patient.lacArmFingersSides, patient.lacArmFingersDigits)}`);
    parts.push(`แขน/มือ: ${armParts.length > 0 ? armParts.join(', ') : 'มีบาดแผล'}`);
  }

  // 6. Lower Extremity
  if (patient.lacParentLowerExtremity) {
    const legParts = [];
    if (patient.lacLegThigh) legParts.push(`ต้นขา${sideLabel(patient.lacLegThighSides)}`);
    if (patient.lacLegKneeShin) legParts.push(`เข่า/หน้าแข้ง/น่อง${sideLabel(patient.lacLegKneeShinSides)}`);
    if (patient.lacLegAnkleFoot) legParts.push(`ข้อเท้า/เท้า${sideLabel(patient.lacLegAnkleFootSides)}`);
    if (patient.lacLegToes) legParts.push(`นิ้วเท้า${fmtDigitsBySide(patient.lacLegToesLeftDigits, patient.lacLegToesRightDigits, patient.lacLegToesSides, patient.lacLegToesDigits)}`);
    parts.push(`ขา/เท้า: ${legParts.length > 0 ? legParts.join(', ') : 'มีบาดแผล'}`);
  }

  // 7. Other Location
  if (patient.lacParentOther) {
    parts.push(`ตำแหน่งอื่นๆ: ${patient.lacOtherLocationDetail || 'ระบุตำแหน่งอื่น'}`);
  }

  return parts.length > 0 ? parts.join(' | ') : 'ไม่ได้ระบุตำแหน่งบาดแผลชัดเจน';
}

// --- Rapid Note Generator (5 Standardized Sections) ---
function renderLacerationRapidHpi(patient) {
  const durVal = patient.durationVal;
  const durUnitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durUnit = durUnitMap[patient.durationUnit] || 'ชั่วโมง';
  const durationStr = durVal ? `${durVal} ${durUnit}` : 'ไม่ระบุ';

  const painScoreStr = patient.painScore !== null && patient.painScore !== undefined
    ? `${patient.painScore}/10`
    : 'ไม่ได้ระบุ';

  const headSigns = Array.isArray(patient.lacHeadSigns) ? patient.lacHeadSigns : [];
  const neckSigns = Array.isArray(patient.lacNeckSigns) ? patient.lacNeckSigns : [];
  const chestSigns = Array.isArray(patient.lacChestSigns) ? patient.lacChestSigns : [];
  const abdomenSigns = Array.isArray(patient.lacAbdomenSigns) ? patient.lacAbdomenSigns : [];
  const upperExtSigns = Array.isArray(patient.lacUpperExtSigns) ? patient.lacUpperExtSigns : [];
  const lowerExtSigns = Array.isArray(patient.lacLowerExtSigns) ? patient.lacLowerExtSigns : [];
  const systemicSigns = Array.isArray(patient.lacSystemicSigns) ? patient.lacSystemicSigns : [];
  const contaminants = Array.isArray(patient.lacContaminants) ? patient.lacContaminants : [];

  const posList = [];
  const negList = [];

  // Positives Evaluation
  if (patient.lacBleedingStatus === 'active_spurting') posList.push('เลือดยังไหลพุ่งเป็นจังหวะตามชีพจร หรือไหลทะลักมากผิดปกติ 🚩');
  else if (patient.lacBleedingStatus === 'active_oozing') posList.push('เลือดยังไหลซึมต่อเนื่อง');
  if (contaminants.includes('foreign_body_retained')) posList.push('มีวัตถุหักคา หรือปักคาอยู่ในบาดแผล (เช่น เศษแก้ว, เสี้ยนไม้, โลหะ) 🚩');
  if (contaminants.includes('dirty_contaminated')) posList.push('บาดแผลปนเปื้อนดินโคลน สนิม น้ำสกปรก หรือเศษอาหาร/มูลสัตว์ 🚩');

  // Head/Face Positives
  if (headSigns.includes('loss_of_consciousness')) posList.push('มีอาการสลบ หมดสติไปชั่วขณะ หรือจำเหตุการณ์ไม่ได้ 🚩');
  if (headSigns.includes('severe_headache_vomit')) posList.push('ปวดศีรษะรุนแรง มึนงงสับสน หรือมีอาเจียน 🚩');
  if (headSigns.includes('vision_problem_eye_injury')) posList.push('ตาพร่ามัว มองเห็นภาพซ้อน หรือบาดแผลถูกดวงตาโดยตรง 🚩');
  if (headSigns.includes('csf_leak_ear_nose')) posList.push('มีเลือดหรือน้ำใสไหลออกจากรูหู หรือรูจมูก 🚩');

  // Neck Positives
  if (neckSigns.includes('airway_dyspnea_stridor')) posList.push('หายใจลำบาก กลืนลำบาก เสียงแหบ หรือมีฟองอากาศ/เสียงลมออกทางแผลที่คอ 🚩');
  if (neckSigns.includes('expanding_neck_mass')) posList.push('บริเวณแผลที่คอบวมโตขึ้นอย่างรวดเร็ว (เสี่ยง Hematoma กดหลอดลม) 🚩');
  if (neckSigns.includes('neck_pain_radiculopathy')) posList.push('ปวดตึงต้นคอ หรือมีอาการชา/อ่อนแรงร้าวลงแขนขา 🚩');

  // Chest Positives
  if (chestSigns.includes('dyspnea_pleuritic_pain')) posList.push('หายใจหอบเหนื่อย แน่นหน้าอก หรือเจ็บแปล๊บเวลาหายใจเข้าลึกๆ 🚩');
  if (chestSigns.includes('sucking_chest_wound')) posList.push('แผลลึก หรือมีฟองอากาศ/เสียงลมดูดเข้า-ออกทางบาดแผลที่หน้าอก (Open Pneumothorax) 🚩');

  // Abdomen Positives
  if (abdomenSigns.includes('severe_abd_pain_rigid')) posList.push('ปวดท้องรุนแรง หรือหน้าท้องแข็งตึง 🚩');
  if (abdomenSigns.includes('evisceration_internal_organ')) posList.push('บาดแผลลึกจนมีเนื้อเยื่อหรืออวัยวะภายในโผล่ออกมา (Evisceration) 🚩');
  if (abdomenSigns.includes('urinary_symptoms_hematuria')) posList.push('ปัสสาวะไม่ออก หรือมีเลือดปนในปัสสาวะ 🚩');

  // Upper Extremity Positives
  if (upperExtSigns.includes('tendon_deficit_hand')) posList.push('ขยับเหยียดหรืองอนิ้วมือ ข้อมือ หรือข้อศอกไม่ได้ตามปกติ (สงสัยเส้นเอ็นขาด) 🚩');
  if (upperExtSigns.includes('nerve_numbness_hand')) posList.push('มีอาการชา หรือไร้ความรู้สึกที่ปลายนิ้วมือ/ฝ่ามือ (สงสัยเส้นประสาทบาดเจ็บ) 🚩');
  if (upperExtSigns.includes('vascular_cold_pale_hand')) posList.push('ปลายนิ้วมือซีดขาว เย็นเฉียบ หรือม่วงคล้ำ (สงสัยหลอดเลือดแดงบาดเจ็บ) 🚩');
  if (upperExtSigns.includes('open_fracture_arm')) posList.push('แขน ข้อมือ หรือนิ้วผิดรูป บิดเบี้ยว หรือแผลลึกจนมองเห็นกระดูก (Open fracture) 🚩');
  if (upperExtSigns.includes('amputation_hand')) posList.push('นิ้วมือหรือชิ้นส่วนของมือ/แขนขาดออกจากกัน (Traumatic amputation) 🚩');

  // Lower Extremity Positives
  if (lowerExtSigns.includes('tendon_bone_deficit_leg')) posList.push('เดินลงน้ำหนักไม่ได้ หรือกระดกข้อเท้า/ขยับนิ้วเท้าไม่ได้ตามปกติ 🚩');
  if (lowerExtSigns.includes('nerve_numbness_foot')) posList.push('มีอาการชา หรือไร้ความรู้สึกที่เท้า/นิ้วเท้า (สงสัยเส้นประสาทบาดเจ็บ) 🚩');
  if (lowerExtSigns.includes('vascular_cold_pale_foot')) posList.push('ปลายเท้าซีดขาว เย็นเฉียบ หรือม่วงคล้ำ (สงสัยหลอดเลือดแดงบาดเจ็บ) 🚩');
  if (lowerExtSigns.includes('open_fracture_leg')) posList.push('ขา ข้อเท้า หรือเท้าผิดรูป บิดเบี้ยว หรือแผลลึกจนมองเห็นกระดูก (Open fracture) 🚩');
  if (lowerExtSigns.includes('amputation_leg')) posList.push('นิ้วเท้าหรือชิ้นส่วนของเท้า/ขาขาดออกจากกัน (Traumatic amputation) 🚩');

  // Systemic Positives
  if (systemicSigns.includes('dizziness_presyncope')) posList.push('หน้ามืด เวียนศีรษะ วูบ หรือรู้สึกเหมือนจะเป็นลม 🚩');
  if (systemicSigns.includes('palpitation_cold_sweat')) posList.push('ใจสั่น เหงื่อแตกท่วมตัว ตัวเย็น หรือหน้าซีดปากซีด 🚩');
  if (systemicSigns.includes('excessive_thirst_weakness')) posList.push('กระหายน้ำมากผิดปกติ หรืออ่อนเพลียไม่มีแรง 🚩');
  if (systemicSigns.includes('infection_signs_fever_pus')) posList.push('มีไข้ หนาวสั่น หรือบริเวณแผลเริ่มบวมแดงร้อนและมีหนองซึม 🚩');

  if (patient.otherSymptomsFree) posList.push(patient.otherSymptomsFree);

  // Negatives Evaluation
  if (patient.lacBleedingStatus === 'stopped') negList.push('เลือดหยุดไหลแล้ว ไม่มีเลือดพุ่งหรือซึมต่อเนื่อง');
  if (!contaminants.includes('foreign_body_retained')) negList.push('ไม่มีวัตถุปักคาหรือหักคาในบาดแผล');
  if (!headSigns.includes('loss_of_consciousness') && !headSigns.includes('severe_headache_vomit')) negList.push('ไม่มีอาการสลบ หมดสติ หรืออาเจียน');
  if (!chestSigns.includes('dyspnea_pleuritic_pain') && !chestSigns.includes('sucking_chest_wound')) negList.push('ไม่มีอาการแน่นหน้าอก หายใจลำบาก หรือลมดูดออกทางแผล');
  if (!abdomenSigns.includes('severe_abd_pain_rigid') && !abdomenSigns.includes('evisceration_internal_organ')) negList.push('ไม่มีปวดเกร็งหน้าท้อง และไม่มีอวัยวะภายในโผล่');
  if (!upperExtSigns.includes('tendon_deficit_hand') && !lowerExtSigns.includes('tendon_bone_deficit_leg')) negList.push('ไม่มีอาการงอหรือเหยียดข้อนิ้วไม่ได้ (ยังขยับได้ปกติ)');
  if (!upperExtSigns.includes('nerve_numbness_hand') && !lowerExtSigns.includes('nerve_numbness_foot')) negList.push('ไม่มีอาการชา หรือสูญเสียความรู้สึกที่ปลายมือปลายเท้า');
  if (!upperExtSigns.includes('vascular_cold_pale_hand') && !lowerExtSigns.includes('vascular_cold_pale_foot')) negList.push('ปลายมือปลายเท้าไม่ซีด ไม่เย็น คลำชีพจรส่วนปลายได้ดี');
  if (!systemicSigns.includes('dizziness_presyncope') && !systemicSigns.includes('palpitation_cold_sweat')) negList.push('ไม่มีอาการหน้ามืด วูบ เหงื่อแตกตัวเย็น หรือสัญญาณภาวะช็อก');

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
  const redFlags = evaluateLacerationRedFlags(patient);

  const defaultRapid =
`[Chief Complaint (CC)]
บาดแผลฉีกขาด / มีเลือดออก (Laceration / Active Bleeding) เป็นมา ${durationStr}

[History of Present Illness (HPI)]
• สาเหตุและระยะเวลา: ${formatLacCauses(patient)} | เป็นมา ${durationStr}
• อาการนำก่อนเกิดเหตุ: ${formatLacProdrome(patient)}
• ตำแหน่งบาดแผล: ${formatLacAnatomy(patient)}
• สถานะเลือดออกในขณะนี้: ${formatLacBleedingStatus(patient)}
• สิ่งปนเปื้อนในบาดแผล: ${formatLacContaminants(patient)}
• ระดับความปวดบริเวณแผล (Pain Score): ${painScoreStr}

• Pertinent Positives:
${posList.length > 0 ? posList.map(p => `  - ${p}`).join('\n') : '  - ไม่มีอาการบาดเจ็บรุนแรงเฉพาะจุด'}

• Pertinent Negatives:
${negList.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• ประวัติวัคซีนบาดทะยัก: ${formatLacTetanus(patient)}
• ประวัติยาละลายลิ่มเลือด/เลือดหยุดยาก: ${formatLacAntithrombotic(patient)}
• โรคประจำตัว (U/D): ${udDisplay}
• ยาประจำตัว (Current Meds): ${medsText}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${allergyDisplay}

[Emergency Risk Assessment (Red Flags)]
${redFlags.length > 0
  ? `🚩 สัญญาณเตือนฉุกเฉินที่ตรวจพบ:\n${redFlags.map(rf => `  * ${rf.textTh}`).join('\n')}`
  : '✓ ไม่พบสัญญาณเตือนความรุนแรงวิกฤตเฉียบพลันเบื้องต้น'}

[Doctor's Clinical Addendum & Exam]
• บันทึกประวัติเพิ่มเติมหรือแก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}
• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}
• แผนการรักษาและคำสั่งการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

  return defaultRapid;
}

// --- Narrative Note Generator (Doctor View - Thai-Centric) ---
function renderLacerationNarrative(patient) {
  const durVal = patient.durationVal;
  const durUnitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durUnit = durUnitMap[patient.durationUnit] || 'ชั่วโมง';
  const durStr = durVal ? `${durVal} ${durUnit}` : 'ไม่ระบุระยะเวลา';

  const causeStr = formatLacCauses(patient);
  const anatStr = formatLacAnatomy(patient);
  const bleedStr = formatLacBleedingStatus(patient);
  const contStr = formatLacContaminants(patient);
  const tetStr = formatLacTetanus(patient);

  let note = `ผู้ป่วย${patient.gender || ''} อายุ ${patient.age || 'ไม่ระบุ'} ปี มารับการตรวจที่ห้องฉุกเฉินด้วยบาดแผลฉีกขาด / มีเลือดออก สาเหตุเกิดจาก${causeStr} เป็นมาประมาณ ${durStr} ก่อนมารพ. ตรวจพบบาดแผลบริเวณ: ${anatStr} สถานะเลือดออกคือ${bleedStr} สภาพแผลคือ${contStr}`;

  const headSigns = Array.isArray(patient.lacHeadSigns) ? patient.lacHeadSigns : [];
  const upperExtSigns = Array.isArray(patient.lacUpperExtSigns) ? patient.lacUpperExtSigns : [];
  const lowerExtSigns = Array.isArray(patient.lacLowerExtSigns) ? patient.lacLowerExtSigns : [];
  const systemicSigns = Array.isArray(patient.lacSystemicSigns) ? patient.lacSystemicSigns : [];

  const syms = [];
  if (patient.lacBleedingStatus === 'active_spurting') syms.push('เลือดพุ่งเป็นจังหวะตามชีพจร');
  if (headSigns.includes('loss_of_consciousness')) syms.push('มีสลบหมดสตินำมาก่อน');
  if (upperExtSigns.includes('tendon_deficit_hand') || lowerExtSigns.includes('tendon_bone_deficit_leg')) syms.push('ขยับเหยียดงอนิ้วไม่ได้');
  if (upperExtSigns.includes('nerve_numbness_hand') || lowerExtSigns.includes('nerve_numbness_foot')) syms.push('มีอาการชาปลายประสาท');
  if (upperExtSigns.includes('open_fracture_arm') || lowerExtSigns.includes('open_fracture_leg')) syms.push('กระดูกผิดรูปเห็นกระดูกโผล่');
  if (systemicSigns.includes('dizziness_presyncope') || systemicSigns.includes('palpitation_cold_sweat')) syms.push('มีหน้ามืดเหงื่อแตกตัวเย็น');

  if (syms.length > 0) {
    note += ` ร่วมกับมีอาการสำคัญ: ${syms.join(', ')}`;
  } else {
    note += ' ผู้ป่วยไม่มีอาการหน้ามืดเป็นลม ปลายมือปลายเท้าไม่ชา ยังขยับนิ้วได้ปกติ';
  }

  note += ` ประวัติวัคซีนบาดทะยัก: ${tetStr}`;
  return note;
}

function renderLacerationDoctorHpi(patient) {
  return renderLacerationRapidHpi(patient);
}

// --- Output Dispatcher ---
function updateLacerationOutputs(rec) {
  if (!rec) return;
  const rapidText = renderLacerationRapidHpi(rec);
  const narrativeText = renderLacerationNarrative(rec);

  const rapidEl = document.getElementById('rapidTextView');
  const narrativeEl = document.getElementById('narrativeTextView');
  if (rapidEl) rapidEl.value = rec.custom_rapid_note || rapidText;
  if (narrativeEl) narrativeEl.value = rec.custom_narrative_note || narrativeText;

  const posMatch = rapidText.match(/• Pertinent Positives:\n((?:\s*-[^\n]+\n?)+)/);
  if (posMatch) {
    rec.pertinentPositives = posMatch[1].trim().split('\n').map(l => l.replace(/^[-*\s]+/, '').trim());
  } else {
    rec.pertinentPositives = ['ไม่มีอาการบาดเจ็บรุนแรงเฉพาะจุด'];
  }

  const negMatch = rapidText.match(/• Pertinent Negatives:\n((?:\s*-[^\n]+\n?)+)/);
  if (negMatch) {
    rec.pertinentNegatives = negMatch[1].trim().split('\n').map(l => l.replace(/^[-*\s]+/, '').trim());
  } else {
    rec.pertinentNegatives = [];
  }

  const redFlags = evaluateLacerationRedFlags(rec);
  rec.redFlags = redFlags;

  const jsonOutput = {
    encounter: {
      chief_complaint: 'laceration_bleeding',
      chief_complaint_title_th: 'บาดแผลฉีกขาด / มีเลือดออก',
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
      causes: Array.isArray(rec.lacCauses) ? rec.lacCauses : [],
      cause_sharp_detail: rec.lacCauseSharpDetail || '',
      cause_machinery_detail: rec.lacCauseMachineryDetail || '',
      cause_blunt_detail: rec.lacCauseBluntDetail || '',
      cause_puncture_detail: rec.lacCausePunctureDetail || '',
      cause_other_detail: rec.lacCauseOtherDetail || '',
      contaminants: Array.isArray(rec.lacContaminants) ? rec.lacContaminants : [],
      bleeding_status: rec.lacBleedingStatus || null,
      prodrome: rec.lacProdrome || null,
      pain_score: rec.painScore,
      antithrombotic: rec.lacAntithrombotic || null,
      tetanus_history: rec.lacTetanusHx || null,
      anatomical_regions: {
        head_face: !!rec.lacParentHeadFace,
        neck: !!rec.lacParentNeck,
        chest: !!rec.lacParentChest,
        abdomen: !!rec.lacParentAbdomen,
        upper_extremity: !!rec.lacParentUpperExtremity,
        lower_extremity: !!rec.lacParentLowerExtremity,
        other: !!rec.lacParentOther,
        other_detail: rec.lacOtherLocationDetail || ''
      },
      fingers_digits: Array.isArray(rec.lacArmFingersDigits) ? rec.lacArmFingersDigits : [],
      fingers_left_digits: Array.isArray(rec.lacArmFingersLeftDigits) ? rec.lacArmFingersLeftDigits : [],
      fingers_right_digits: Array.isArray(rec.lacArmFingersRightDigits) ? rec.lacArmFingersRightDigits : [],
      toes_digits: Array.isArray(rec.lacLegToesDigits) ? rec.lacLegToesDigits : [],
      toes_left_digits: Array.isArray(rec.lacLegToesLeftDigits) ? rec.lacLegToesLeftDigits : [],
      toes_right_digits: Array.isArray(rec.lacLegToesRightDigits) ? rec.lacLegToesRightDigits : [],
      systemic_signs: Array.isArray(rec.lacSystemicSigns) ? rec.lacSystemicSigns : [],
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
function generateLacerationCds(patient, { rfs, ddxList = [], workupList = [], managementList = [] } = {}) {
  if (!patient) return '';
  const redFlags = rfs || evaluateLacerationRedFlags(patient);

  const hasArterialShock = redFlags.some(r => r.key === 'rf_lac_arterial_hemorrhagic_shock');
  const hasPenetrating = redFlags.some(r => r.key === 'rf_lac_penetrating_neck_torso');
  const hasAmputation = redFlags.some(r => r.key === 'rf_lac_traumatic_amputation_ischemia');
  const hasHeadEye = redFlags.some(r => r.key === 'rf_lac_head_ocular_trauma');
  const hasOpenFxTendon = redFlags.some(r => r.key === 'rf_lac_open_fracture_tendon_nerve');

  const setPlan = (dxs, wus, mgmts) => {
    ddxList.push(...dxs); workupList.push(...wus); managementList.push(...mgmts);
  };

  if (hasArterialShock) {
    setPlan(
      ['1. 🚨 Major Arterial Laceration with Impending Hemorrhagic Shock', '2. Extremity Vascular Disruption / Pseudoaneurysm', '3. Severe Secondary Coagulopathy from Blood Loss'],
      ['Stat CBC, Hct, Platelet, Coagulogram (PT, PTT, INR)', 'Emergency Type & Crossmatch PRBCs 2-4 units', 'Bedside Doppler Ultrasound of distal arterial pulses'],
      ['Triage Level 1: ย้ายเข้าห้องช่วยชีวิต (Resuscitation Room) ทันที', 'Direct compressive wound packing; ขันชะเนาะ (Tourniquet) หากกดไม่อยู่', 'เปิด IV 16-18G 2 เส้น โหลด IV NSS/Acetar และเตรียมให้เลือดทันที', 'Stat Consultation ศัลยแพทย์ / ศัลยแพทย์หลอดเลือด เพื่อเข้าห้องผ่าตัดด่วน (OR Exploration)']
    );
  } else if (hasPenetrating) {
    setPlan(
      ['1. 🚨 Penetrating Torso Trauma / Open Pneumothorax / Hemothorax', '2. Penetrating Neck Injury (Zone I/II/III Aerodigestive or Vascular Injury)', '3. Penetrating Abdominal Wound with Visceral Perforation'],
      ['Stat portable Chest X-ray, Abdominal X-ray (upright/decubitus)', 'Stat Bedside eFAST (Extended Focused Assessment with Sonography in Trauma)', 'CBC, Electrolytes, BUN, Cr, Coagulation, Type & Hold'],
      ['Triage Level 1 / 2: ประเมินทางเดินหายใจ (ABCs) ทันที', 'หากเป็น Sucking Chest Wound ปิดด้วย Three-Sided Occlusive Dressing ทันที และเตรียม ICD', 'หากมีอวัยวะโผล่ทางหน้าท้อง คลุมด้วยผ้าก๊อซชุบน้ำเกลืออุ่น ห้ามดันกลับเด็ดขาด', 'ห้ามดึงสิ่งแปลกปลอมที่ปักคาออกในห้องฉุกเฉิน และประสานศัลยแพทย์ด่วน']
    );
  } else if (hasAmputation) {
    setPlan(
      ['1. 🚨 Traumatic Amputation of Extremity / Digit', '2. Acute Extremity Arterial Occlusion with Limb Ischemia', '3. Severe Crush Injury with Soft Tissue Loss'],
      ['Plain Film X-ray of amputated part and stump (AP & Lateral)', 'CBC, Coagulogram, Type & Crossmatch, EKG, Chest X-ray'],
      ['Triage Level 2: กดห้ามเลือดที่ตอแผลด้วยผ้าก๊อซสะอาด', 'เก็บชิ้นส่วนที่ขาด: ห่อผ้าก๊อซชุบ NSS หมาด ใส่ถุงพลาสติกแห้งมัดปากถุง แช่ในกระติกน้ำผสมน้ำแข็ง', 'ให้ IV Cefazolin 1-2 g stat + ฉีดวัคซีนป้องกันบาดทะยัก (dT/TIG)', 'โทรประสานด่วนศัลยแพทย์กระดูกและข้อ / ศัลยกรรมตกแต่ง เพื่อประเมิน Replantation']
    );
  } else if (hasHeadEye) {
    setPlan(
      ['1. 🚨 Scalp Laceration with Traumatic Brain Injury (Concussion / Contusion / ICH)', '2. Open Globe Injury / Corneal-Scleral Laceration / Hyphema', '3. Depressed Skull Fracture / Basilar Skull Fracture'],
      ['Stat Non-contrast CT Brain & Bone Window if LOC/amnesia or vomiting present', 'Cervical Spine X-ray / CT C-spine to rule out occult spinal injury', 'Fluorescein stain and Slit lamp exam by Ophthalmologist'],
      ['Triage Level 2: หากสงสัยแผลทะลุลูกตา ครอบ Eye Shield ทันที ห้ามกดทับลูกตาเด็ดขาด', 'เย็บห้ามเลือดหนังศีรษะ (Scalp hemostasis) อย่างรวดเร็วเพื่อป้องกันการเสียเลือดมาก', 'ปรึกษาจักษุแพทย์ทันทีหากมีแผลที่ลูกตา / ปรึกษาประสาทศัลยแพทย์หาก CT พบ Bleeding']
    );
  } else if (hasOpenFxTendon) {
    setPlan(
      ['1. 🚨 Open Fracture (Gustilo-Anderson Classification)', '2. Extensor / Flexor Tendon Transection', '3. Peripheral Nerve Laceration (Median / Ulnar / Radial / Peroneal)'],
      ['Plain Film X-ray of injured joint/bone (at least 2 views: AP & Lateral)', 'Pre-op Blood workup: CBC, BUN, Cr, Electrolytes, PT/INR'],
      ['Triage Level 2 / 3: ตรวจ Neurovascular และ Tendon function อย่างละเอียดก่อนฉีดยาชา', 'กรณี Open Fracture: ให้ IV Antibiotic (Cefazolin 1-2 g IV) ภายใน 1 ชม. และล้างแผลด้วย NSS ปริมาณมาก', 'ดามเฝือกชั่วคราว (Splinting) ในท่าพัก และปรึกษาศัลยแพทย์ออร์โธปิดิกส์เพื่อผ่าตัดซ่อมแซม']
    );
  } else {
    setPlan(
      ['1. Simple Clean Laceration (Uncomplicated cut / tear)', '2. Contaminated Superficial Wound', '3. Minor Blunt Abrasion / Contusion'],
      ['Wound exploration under sterile technique', 'Soft tissue X-ray if high suspicion of radiopaque foreign body (glass/metal)'],
      ['Triage Level 3 / 4: ล้างทำความสะอาดแผลด้วย Normal Saline ชะล้างสิ่งสกปรก', 'Local Anesthesia (1-2% Lidocaine with/without Epinephrine - avoid epi on digits/ear/tip of nose)', 'Primary Wound Closure (Suturing with Nylon/Prolene) ภายใน Golden period (6-12 ชม.)', 'ประเมินและฉีดวัคซีนป้องกันบาดทะยัก (dT) ตามแนวทางกระทรวงสาธารณสุข']
    );
  }

  return ddxList.join('\n');
}

// --- Patient Form HTML Template ---
const LACERATION_FORM_HTML = `
<div id="cc-laceration-bleeding-section" class="hidden space-y-6">
  <!-- 💡 ส่วนต้น: ข้อแนะนำการปฐมพยาบาลเบื้องต้นระหว่างรอตรวจ -->
  <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs sm:text-sm text-amber-900 shadow-sm flex items-start space-x-3">
    <div class="text-amber-600 mt-0.5 flex-shrink-0">
      <i data-lucide="info" class="w-5 h-5"></i>
    </div>
    <div class="space-y-1">
      <div class="font-bold text-amber-950 flex items-center gap-1.5">
        <span>ข้อแนะนำการห้ามเลือดและดูแลบาดแผลเบื้องต้นระหว่างรอพบแพทย์:</span>
      </div>
      <ul class="list-disc pl-4 space-y-1 text-amber-800 text-xs">
        <li><strong>กรณียังมีเลือดออก ให้กดห้ามเลือดโดยตรง:</strong> ใช้ผ้าสะอาดหรือผ้าก๊อซพับหนาๆ <strong>กดลงบนบาดแผลโดยตรงให้แน่นและต่อเนื่อง</strong> (ไม่ควรเปิดผ้าออกดูบ่อยๆ เพราะจะทำให้ลิ่มเลือดที่กำลังแข็งตัวหลุดออก) หากผ้าชุ่มเลือดให้ใช้ผ้าผืนใหม่ทับลงไปอีกชั้น</li>
        <li><strong>ห้ามดึงวัตถุที่ปักคาออกเอง:</strong> หากมีเศษแก้ว มีด ไม้ หรือของมีคมปักคาอยู่ในบาดแผล <strong>ห้ามดึงออกด้วยตนเองเด็ดขาด</strong> เพราะอาจทำให้เลือดทะลักรุนแรงขึ้น</li>
      </ul>
    </div>
  </div>

  <!-- CARD 1: ข้อมูลเหตุการณ์ สาเหตุของบาดแผล และสถานะเลือดออก -->
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
        <i data-lucide="scissors" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900">1. ข้อมูลเหตุการณ์ สาเหตุของบาดแผล และสถานะเลือดออก</h2>
        <p class="text-xs text-slate-500">ระยะเวลา สาเหตุ สิ่งแปลกปลอม และสถานะการไหลของเลือด</p>
      </div>
    </div>

    <!-- 1.1 ระยะเวลาที่เกิดเหตุ / มีบาดแผล -->
    <div class="mb-5">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        1.1 บาดแผลหรืออาการเลือดออกเกิดขึ้นมานานเท่าใด <span class="text-rose-500">*</span>
      </label>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div class="col-span-1 sm:col-span-2">
          <input type="number" id="lacDurationVal" min="1" max="365" placeholder="ระบุตัวเลข เช่น 30"
            class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white transition">
        </div>
        <div class="col-span-1">
          <select id="lacDurationUnit"
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

    <!-- 1.2 สาเหตุที่ทำให้เกิดบาดแผล -->
    <div class="mb-5">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        1.2 สาเหตุที่ทำให้เกิดบาดแผล (เลือกได้หลายข้อ):
      </label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
            <input type="checkbox" name="lacCauses" value="sharp_object" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0"
              onchange="toggleLacGroup('lacCauseSharpDetailContainer', this.checked)">
            <span class="text-xs sm:text-sm text-slate-800">ของมีคมบาด หรือทิ่มแทง</span>
          </label>
          <div id="lacCauseSharpDetailContainer" class="hidden mt-2 pl-3 border-l-2 border-medical-200">
            <input type="text" id="lacCauseSharpDetail" placeholder="พิมพ์ระบุ เช่น มีด, คัตเตอร์, เศษแก้ว, กระจก, สังกะสี..."
              class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-slate-900 text-xs focus:ring-2 focus:ring-medical-500 focus:bg-white">
          </div>
        </div>

        <div>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
            <input type="checkbox" name="lacCauses" value="machinery_tools" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0"
              onchange="toggleLacGroup('lacCauseMachineryDetailContainer', this.checked)">
            <span class="text-xs sm:text-sm text-slate-800">เครื่องจักรกล หรืออุปกรณ์ไฟฟ้า/การเกษตร</span>
          </label>
          <div id="lacCauseMachineryDetailContainer" class="hidden mt-2 pl-3 border-l-2 border-medical-200">
            <input type="text" id="lacCauseMachineryDetail" placeholder="พิมพ์ระบุ เช่น หินเจียร, เลื่อย, เครื่องตัดหญ้า..."
              class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-slate-900 text-xs focus:ring-2 focus:ring-medical-500 focus:bg-white">
          </div>
        </div>

        <div>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
            <input type="checkbox" name="lacCauses" value="blunt_impact" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0"
              onchange="toggleLacGroup('lacCauseBluntDetailContainer', this.checked)">
            <span class="text-xs sm:text-sm text-slate-800">ถูกกระแทกด้วยของแข็ง</span>
          </label>
          <div id="lacCauseBluntDetailContainer" class="hidden mt-2 pl-3 border-l-2 border-medical-200">
            <input type="text" id="lacCauseBluntDetail" placeholder="พิมพ์ระบุวัตถุหรือของแข็งที่มากระแทก..."
              class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-slate-900 text-xs focus:ring-2 focus:ring-medical-500 focus:bg-white">
          </div>
        </div>

        <div>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer h-full">
            <input type="checkbox" name="lacCauses" value="fall_collision" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
            <span class="text-xs sm:text-sm text-slate-800">หกล้ม หรือชนกระแทกจนเกิดแผลแตก</span>
          </label>
        </div>

        <div>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
            <input type="checkbox" name="lacCauses" value="puncture_wound" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0"
              onchange="toggleLacGroup('lacCausePunctureDetailContainer', this.checked)">
            <span class="text-xs sm:text-sm text-slate-800">ถูกไม้ ตะปู เสี้ยน หรือของแหลมทิ่มตำ</span>
          </label>
          <div id="lacCausePunctureDetailContainer" class="hidden mt-2 pl-3 border-l-2 border-medical-200">
            <input type="text" id="lacCausePunctureDetail" placeholder="พิมพ์ระบุสิ่งที่ทิ่มตำ เช่น ตะปู, เสี้ยนไม้, หนาม, ลวด..."
              class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-slate-900 text-xs focus:ring-2 focus:ring-medical-500 focus:bg-white">
          </div>
        </div>

        <div>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
            <input type="checkbox" name="lacCauses" value="other_cause" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0"
              onchange="toggleLacGroup('lacCauseOtherDetailContainer', this.checked)">
            <span class="text-xs sm:text-sm text-slate-800">สาเหตุอื่นๆ</span>
          </label>
          <div id="lacCauseOtherDetailContainer" class="hidden mt-2 pl-3 border-l-2 border-medical-200">
            <input type="text" id="lacCauseOtherDetail" placeholder="พิมพ์ระบุสาเหตุ..."
              class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-slate-900 text-xs focus:ring-2 focus:ring-medical-500 focus:bg-white">
          </div>
        </div>
      </div>
    </div>

    <!-- 1.3 สิ่งปนเปื้อน หรือสิ่งแปลกปลอมในบาดแผล -->
    <div class="mb-5">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        1.3 สิ่งปนเปื้อน หรือสิ่งแปลกปลอมในบาดแผล (เลือกได้หลายข้อหากพบ):
      </label>
      <div class="space-y-2">
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="lacContaminants" value="foreign_body_retained" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">มีวัตถุหักคา หรือปักคาอยู่ในบาดแผล (เช่น เศษแก้ว, เสี้ยนไม้, โลหะ, ของมีคม)</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="lacContaminants" value="dirty_contaminated" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">บาดแผลปนเปื้อนดินโคลน สนิม น้ำสกปรก หรือเศษอาหาร/มูลสัตว์</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="lacContaminants" value="clean_wound" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">บาดแผลสะอาด ไม่มีสิ่งแปลกปลอมค้างอยู่</span>
        </label>
      </div>
    </div>

    <!-- 1.4 สถานะเลือดออกในขณะนี้ -->
    <div class="mb-5">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        1.4 สถานะเลือดออกในขณะนี้ (เลือกข้อที่ตรงกับปัจจุบันมากที่สุด) <span class="text-rose-500">*</span>
      </label>
      <div class="space-y-2">
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="lacBleedingStatus" value="active_spurting" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 flex-shrink-0">
          <span class="text-xs sm:text-sm font-medium text-slate-900">เลือดยังไหลพุ่งเป็นจังหวะตามชีพจร หรือไหลทะลักออกมามากผิดปกติ (กดห้ามเลือดแล้วยังชุ่มผ้าอย่างรวดเร็ว)</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="lacBleedingStatus" value="active_oozing" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">เลือดยังไหลซึมออกมาเรื่อยๆ ต่อเนื่อง</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="lacBleedingStatus" value="stopped" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">เลือดหยุดไหลแล้ว หรือมีเพียงคราบเลือดซึมเล็กน้อย</span>
        </label>
      </div>
    </div>

    <!-- 1.5 อาการนำก่อนเกิดเหตุ -->
    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        1.5 ก่อนเกิดบาดแผล มีอาการผิดปกตินำมาก่อนหรือไม่:
      </label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="lacProdrome" value="no_prodrome" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">ไม่มีอาการผิดปกตินำมาก่อน (เกิดจากอุบัติเหตุโดยตรง)</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="lacProdrome" value="has_prodrome" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">มีอาการวูบ หน้ามืด เวียนศีรษะ เจ็บหน้าอก หรือแขนขาอ่อนแรงนำมาก่อนแล้วจึงเกิดเหตุ</span>
        </label>
      </div>
    </div>
  </div>

  <!-- CARD 2: ตำแหน่งของร่างกายที่มีบาดแผลและอาการบาดเจ็บร่วม (6 Anatomical Regions) -->
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
        <i data-lucide="user-check" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900">2. ตำแหน่งของร่างกายที่มีบาดแผล และอาการบาดเจ็บร่วม</h2>
        <p class="text-xs text-slate-500">ติ๊กเลือกเฉพาะส่วนของร่างกายที่มีแผล และระบุด้าน (ซ้าย/ขวา/กลาง) แยกตามจุดได้อย่างอิสระ</p>
      </div>
    </div>

    <div class="space-y-5">
      <!-- 2.1 ศีรษะ ใบหน้า ดวงตา หรือในช่องปาก -->
      <div class="space-y-3">
        <label class="selectable-card flex items-center p-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 hover:border-medical-400 transition cursor-pointer">
          <input type="checkbox" id="lacParentHeadFace" onchange="toggleLacGroup('lacHeadSubGroup', this.checked)"
            class="text-medical-600 focus:ring-medical-500 h-5 w-5 rounded flex-shrink-0">
          <div class="ml-3">
            <span class="text-sm font-bold text-slate-900">2.1 บาดแผลที่ศีรษะ ใบหน้า ดวงตา หรือในช่องปาก</span>
            <p class="text-xs text-slate-500">ติ๊กเลือกหากมีแผลแตกที่หนังศีรษะ คิ้ว หน้า คาง ตา หู หรือในปาก</p>
          </div>
        </label>

        <div id="lacHeadSubGroup" class="hidden pl-4 sm:pl-6 space-y-4 border-l-2 border-medical-200">
          <div>
            <p class="text-xs text-slate-600 font-semibold mb-2">จุดที่มีบาดแผล (เลือกได้หลายจุด พร้อมระบุด้าน):</p>
            <div class="space-y-2">
              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="lacHeadScalp" onchange="toggleLacGroup('lacHeadScalpSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">หนังศีรษะ / หน้าผาก / ท้ายทอย</span>
                </label>
                <div id="lacHeadScalpSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacHeadScalpSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacHeadScalpSides" value="right" class="mr-1"> ขวา</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacHeadScalpSides" value="center" class="mr-1"> ตรงกลาง</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="lacHeadFace" onchange="toggleLacGroup('lacHeadFaceSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">ใบหน้า / คิ้ว / แก้ม / คาง</span>
                </label>
                <div id="lacHeadFaceSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacHeadFaceSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacHeadFaceSides" value="right" class="mr-1"> ขวา</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacHeadFaceSides" value="center" class="mr-1"> ตรงกลาง</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="lacHeadEye" onchange="toggleLacGroup('lacHeadEyeSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">ดวงตา / เปลือกตา</span>
                </label>
                <div id="lacHeadEyeSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacHeadEyeSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacHeadEyeSides" value="right" class="mr-1"> ขวา</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="lacHeadEar" onchange="toggleLacGroup('lacHeadEarSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">ใบหู</span>
                </label>
                <div id="lacHeadEarSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacHeadEarSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacHeadEarSides" value="right" class="mr-1"> ขวา</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="lacHeadNoseMouth" onchange="toggleLacGroup('lacHeadNoseMouthSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">จมูก / ริมฝีปาก / ลิ้น / ในช่องปาก</span>
                </label>
                <div id="lacHeadNoseMouthSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacHeadNoseMouthSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacHeadNoseMouthSides" value="right" class="mr-1"> ขวา</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacHeadNoseMouthSides" value="center" class="mr-1"> ตรงกลาง</label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p class="text-xs text-slate-600 font-semibold mb-1">อาการสำคัญที่พบร่วมด้วย (เลือกได้หลายข้อหากมีอาการ):</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="lacHeadSigns" value="loss_of_consciousness" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">มีอาการสลบ หมดสติไปชั่วขณะ หรือจำเหตุการณ์ไม่ได้</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="lacHeadSigns" value="severe_headache_vomit" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">ปวดศีรษะรุนแรง มึนงงสับสน หรือมีอาเจียน</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="lacHeadSigns" value="vision_problem_eye_injury" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">ตาพร่ามัว มองเห็นภาพซ้อน หรือบาดแผลถูกดวงตาโดยตรง</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="lacHeadSigns" value="csf_leak_ear_nose" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">มีเลือดหรือน้ำใสไหลออกจากรูหู หรือรูจมูก</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 2.2 ลำคอ หรือต้นคอ -->
      <div class="space-y-3">
        <label class="selectable-card flex items-center p-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 hover:border-medical-400 transition cursor-pointer">
          <input type="checkbox" id="lacParentNeck" onchange="toggleLacGroup('lacNeckSubGroup', this.checked)"
            class="text-medical-600 focus:ring-medical-500 h-5 w-5 rounded flex-shrink-0">
          <div class="ml-3">
            <span class="text-sm font-bold text-slate-900">2.2 บาดแผลที่ลำคอ หรือต้นคอ</span>
            <p class="text-xs text-slate-500">ติ๊กเลือกหากมีแผลที่คอด้านหน้า ด้านข้าง หรือต้นคอด้านหลัง</p>
          </div>
        </label>

        <div id="lacNeckSubGroup" class="hidden pl-4 sm:pl-6 space-y-4 border-l-2 border-medical-200">
          <div>
            <p class="text-xs text-slate-600 font-semibold mb-2">จุดที่มีบาดแผล (เลือกได้หลายจุด พร้อมระบุด้าน):</p>
            <div class="space-y-2">
              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="lacNeckFront" onchange="toggleLacGroup('lacNeckFrontSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">ลำคอด้านหน้า</span>
                </label>
                <div id="lacNeckFrontSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacNeckFrontSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacNeckFrontSides" value="right" class="mr-1"> ขวา</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacNeckFrontSides" value="center" class="mr-1"> ตรงกลาง</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="lacNeckSide" onchange="toggleLacGroup('lacNeckSideSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">ลำคอด้านข้าง</span>
                </label>
                <div id="lacNeckSideSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacNeckSideSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacNeckSideSides" value="right" class="mr-1"> ขวา</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="lacNeckBack" onchange="toggleLacGroup('lacNeckBackSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">ต้นคอด้านหลัง</span>
                </label>
                <div id="lacNeckBackSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacNeckBackSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacNeckBackSides" value="right" class="mr-1"> ขวา</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacNeckBackSides" value="center" class="mr-1"> ตรงกลาง</label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p class="text-xs text-slate-600 font-semibold mb-1">อาการสำคัญที่พบร่วมด้วย (เลือกได้หลายข้อหากมีอาการ):</p>
            <div class="space-y-2">
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="lacNeckSigns" value="airway_dyspnea_stridor" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">หายใจลำบาก กลืนลำบาก เสียงแหบ หรือมีฟองอากาศ/เสียงลมออกทางแผลที่คอ</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="lacNeckSigns" value="expanding_neck_mass" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">บริเวณแผลที่คอบวมโตขึ้นอย่างรวดเร็ว</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="lacNeckSigns" value="neck_pain_radiculopathy" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">ปวดตึงต้นคอ หรือมีอาการชา/อ่อนแรงร้าวลงแขนขา</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 2.3 หน้าอก ซี่โครง หรือหลังส่วนบน/สะบัก -->
      <div class="space-y-3">
        <label class="selectable-card flex items-center p-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 hover:border-medical-400 transition cursor-pointer">
          <input type="checkbox" id="lacParentChest" onchange="toggleLacGroup('lacChestSubGroup', this.checked)"
            class="text-medical-600 focus:ring-medical-500 h-5 w-5 rounded flex-shrink-0">
          <div class="ml-3">
            <span class="text-sm font-bold text-slate-900">2.3 บาดแผลที่หน้าอก ซี่โครง หรือหลังส่วนบน/สะบัก</span>
            <p class="text-xs text-slate-500">ติ๊กเลือกหากมีแผลที่ทรวงอก ชายโครง หรือแผ่นหลังช่วงบน</p>
          </div>
        </label>

        <div id="lacChestSubGroup" class="hidden pl-4 sm:pl-6 space-y-4 border-l-2 border-medical-200">
          <div>
            <p class="text-xs text-slate-600 font-semibold mb-2">จุดที่มีบาดแผล (เลือกได้หลายจุด พร้อมระบุด้าน):</p>
            <div class="space-y-2">
              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="lacChestRibs" onchange="toggleLacGroup('lacChestRibsSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">หน้าอก / ซี่โครง</span>
                </label>
                <div id="lacChestRibsSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacChestRibsSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacChestRibsSides" value="right" class="mr-1"> ขวา</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacChestRibsSides" value="center" class="mr-1"> ตรงกลาง</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="lacChestUpperBack" onchange="toggleLacGroup('lacChestUpperBackSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">หลังส่วนบน / สะบัก</span>
                </label>
                <div id="lacChestUpperBackSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacChestUpperBackSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacChestUpperBackSides" value="right" class="mr-1"> ขวา</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacChestUpperBackSides" value="center" class="mr-1"> ตรงกลาง</label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p class="text-xs text-slate-600 font-semibold mb-1">อาการสำคัญที่พบร่วมด้วย (เลือกได้หลายข้อหากมีอาการ):</p>
            <div class="space-y-2">
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="lacChestSigns" value="dyspnea_pleuritic_pain" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">หายใจหอบเหนื่อย แน่นหน้าอก หรือเจ็บแปล๊บเวลาหายใจเข้าลึกๆ</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="lacChestSigns" value="sucking_chest_wound" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">แผลลึก หรือมีฟองอากาศ/เสียงลมดูดเข้า-ออกทางบาดแผล</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 2.4 ช่องท้อง บั้นเอว หลังส่วนล่าง สะโพก หรืออวัยวะเพศ -->
      <div class="space-y-3">
        <label class="selectable-card flex items-center p-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 hover:border-medical-400 transition cursor-pointer">
          <input type="checkbox" id="lacParentAbdomen" onchange="toggleLacGroup('lacAbdomenSubGroup', this.checked)"
            class="text-medical-600 focus:ring-medical-500 h-5 w-5 rounded flex-shrink-0">
          <div class="ml-3">
            <span class="text-sm font-bold text-slate-900">2.4 บาดแผลที่ช่องท้อง บั้นเอว หลังส่วนล่าง สะโพก หรืออวัยวะเพศ</span>
            <p class="text-xs text-slate-500">ติ๊กเลือกหากมีแผลที่หน้าท้อง สีข้าง บั้นเอว หลังช่วงล่าง ก้น หรือขาหนีบ</p>
          </div>
        </label>

        <div id="lacAbdomenSubGroup" class="hidden pl-4 sm:pl-6 space-y-4 border-l-2 border-medical-200">
          <div>
            <p class="text-xs text-slate-600 font-semibold mb-2">จุดที่มีบาดแผล (เลือกได้หลายจุด พร้อมระบุด้าน):</p>
            <div class="space-y-2">
              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="lacAbdWall" onchange="toggleLacGroup('lacAbdWallSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">หน้าท้อง</span>
                </label>
                <div id="lacAbdWallSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacAbdWallSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacAbdWallSides" value="right" class="mr-1"> ขวา</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacAbdWallSides" value="center" class="mr-1"> ตรงกลาง</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="lacAbdFlank" onchange="toggleLacGroup('lacAbdFlankSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">สีข้าง / บั้นเอว</span>
                </label>
                <div id="lacAbdFlankSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacAbdFlankSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacAbdFlankSides" value="right" class="mr-1"> ขวา</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="lacAbdLowerBack" onchange="toggleLacGroup('lacAbdLowerBackSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">หลังส่วนล่าง</span>
                </label>
                <div id="lacAbdLowerBackSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacAbdLowerBackSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacAbdLowerBackSides" value="right" class="mr-1"> ขวา</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacAbdLowerBackSides" value="center" class="mr-1"> ตรงกลาง</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="lacAbdButtock" onchange="toggleLacGroup('lacAbdButtockSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">ก้น / สะโพก</span>
                </label>
                <div id="lacAbdButtockSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacAbdButtockSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacAbdButtockSides" value="right" class="mr-1"> ขวา</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacAbdButtockSides" value="center" class="mr-1"> ตรงกลาง</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="lacAbdGenitalia" onchange="toggleLacGroup('lacAbdGenitaliaSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">ขาหนีบ / อวัยวะเพศ</span>
                </label>
                <div id="lacAbdGenitaliaSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacAbdGenitaliaSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacAbdGenitaliaSides" value="right" class="mr-1"> ขวา</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacAbdGenitaliaSides" value="center" class="mr-1"> ตรงกลาง</label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p class="text-xs text-slate-600 font-semibold mb-1">อาการสำคัญที่พบร่วมด้วย (เลือกได้หลายข้อหากมีอาการ):</p>
            <div class="space-y-2">
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="lacAbdomenSigns" value="severe_abd_pain_rigid" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">ปวดท้องรุนแรง หรือหน้าท้องแข็งตึง</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="lacAbdomenSigns" value="evisceration_internal_organ" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">บาดแผลลึกจนมีเนื้อเยื่อหรืออวัยวะภายในโผล่ออกมา</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="lacAbdomenSigns" value="urinary_symptoms_hematuria" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">ปัสสาวะไม่ออก หรือมีเลือดปนในปัสสาวะ</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 2.5 ไหล่ แขน ข้อมือ หรือมือ/นิ้วมือ -->
      <div class="space-y-3">
        <label class="selectable-card flex items-center p-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 hover:border-medical-400 transition cursor-pointer">
          <input type="checkbox" id="lacParentUpperExtremity" onchange="toggleLacGroup('lacUpperExtSubGroup', this.checked)"
            class="text-medical-600 focus:ring-medical-500 h-5 w-5 rounded flex-shrink-0">
          <div class="ml-3">
            <span class="text-sm font-bold text-slate-900">2.5 บาดแผลที่ไหล่ แขน ข้อมือ หรือมือ/นิ้วมือ</span>
            <p class="text-xs text-slate-500">ติ๊กเลือกหากมีแผลที่ต้นแขน ข้อศอก แขนท่อนล่าง ข้อมือ ฝ่ามือ หรือนิ้วมือ</p>
          </div>
        </label>

        <div id="lacUpperExtSubGroup" class="hidden pl-4 sm:pl-6 space-y-4 border-l-2 border-medical-200">
          <div>
            <p class="text-xs text-slate-600 font-semibold mb-2">จุดที่มีบาดแผล (เลือกได้หลายจุด พร้อมระบุข้าง ซ้าย/ขวา แยกตามอวัยวะ):</p>
            <div class="space-y-2">
              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="lacArmShoulder" onchange="toggleLacGroup('lacArmShoulderSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">ไหล่ / รักแร้ / ต้นแขน</span>
                </label>
                <div id="lacArmShoulderSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacArmShoulderSides" value="left" class="mr-1"> ข้างซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacArmShoulderSides" value="right" class="mr-1"> ข้างขวา</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="lacArmElbow" onchange="toggleLacGroup('lacArmElbowSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">ข้อศอก / แขนท่อนล่าง</span>
                </label>
                <div id="lacArmElbowSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacArmElbowSides" value="left" class="mr-1"> ข้างซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacArmElbowSides" value="right" class="mr-1"> ข้างขวา</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="lacArmWrist" onchange="toggleLacGroup('lacArmWristSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">ข้อมือ / ฝ่ามือ / หลังมือ</span>
                </label>
                <div id="lacArmWristSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacArmWristSides" value="left" class="mr-1"> ข้างซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacArmWristSides" value="right" class="mr-1"> ข้างขวา</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <div class="flex flex-col sm:flex-row sm:items-start justify-between text-xs py-1.5 gap-2">
                  <label class="flex items-center space-x-2 cursor-pointer mt-0.5">
                    <input type="checkbox" id="lacArmFingers" onchange="toggleLacGroup('lacArmFingersSidesContainer', this.checked)" class="text-medical-600 rounded">
                    <span class="text-xs sm:text-sm font-medium text-slate-800">นิ้วมือ</span>
                  </label>
                  <div id="lacArmFingersSidesContainer" class="hidden flex flex-col space-y-1.5 pl-6 sm:pl-0">
                    <div class="flex items-center flex-wrap gap-1.5">
                      <span class="text-[11px] text-slate-500 font-medium w-8">ซ้าย:</span>
                      <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="lacArmFingersLeftDigits" value="thumb" class="text-medical-600 rounded"><span>โป้ง</span></label>
                      <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="lacArmFingersLeftDigits" value="index" class="text-medical-600 rounded"><span>ชี้</span></label>
                      <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="lacArmFingersLeftDigits" value="middle" class="text-medical-600 rounded"><span>กลาง</span></label>
                      <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="lacArmFingersLeftDigits" value="ring" class="text-medical-600 rounded"><span>นาง</span></label>
                      <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="lacArmFingersLeftDigits" value="little" class="text-medical-600 rounded"><span>ก้อย</span></label>
                    </div>
                    <div class="flex items-center flex-wrap gap-1.5">
                      <span class="text-[11px] text-slate-500 font-medium w-8">ขวา:</span>
                      <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="lacArmFingersRightDigits" value="thumb" class="text-medical-600 rounded"><span>โป้ง</span></label>
                      <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="lacArmFingersRightDigits" value="index" class="text-medical-600 rounded"><span>ชี้</span></label>
                      <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="lacArmFingersRightDigits" value="middle" class="text-medical-600 rounded"><span>กลาง</span></label>
                      <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="lacArmFingersRightDigits" value="ring" class="text-medical-600 rounded"><span>นาง</span></label>
                      <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="lacArmFingersRightDigits" value="little" class="text-medical-600 rounded"><span>ก้อย</span></label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p class="text-xs text-slate-600 font-semibold mb-1">อาการสำคัญที่พบร่วมด้วย (เลือกได้หลายข้อหากมีอาการ):</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="lacUpperExtSigns" value="tendon_deficit_hand" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">ขยับเหยียดหรืองอนิ้วมือ ข้อมือ หรือข้อศอกไม่ได้ตามปกติ</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="lacUpperExtSigns" value="nerve_numbness_hand" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">มีอาการชา หรือไร้ความรู้สึกที่ปลายนิ้วมือ/ฝ่ามือ</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="lacUpperExtSigns" value="vascular_cold_pale_hand" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">ปลายนิ้วมือซีดขาว เย็นเฉียบ หรือม่วงคล้ำ</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="lacUpperExtSigns" value="open_fracture_arm" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">แขน ข้อมือ หรือนิ้วผิดรูป บิดเบี้ยว หรือแผลลึกจนมองเห็นกระดูก</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer sm:col-span-2">
                <input type="checkbox" name="lacUpperExtSigns" value="amputation_hand" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">นิ้วมือหรือชิ้นส่วนของมือ/แขนขาดออกจากกัน</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 2.6 ต้นขา เข่า หน้าแข้ง ข้อเท้า หรือเท้า/นิ้วเท้า -->
      <div class="space-y-3">
        <label class="selectable-card flex items-center p-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 hover:border-medical-400 transition cursor-pointer">
          <input type="checkbox" id="lacParentLowerExtremity" onchange="toggleLacGroup('lacLowerExtSubGroup', this.checked)"
            class="text-medical-600 focus:ring-medical-500 h-5 w-5 rounded flex-shrink-0">
          <div class="ml-3">
            <span class="text-sm font-bold text-slate-900">2.6 บาดแผลที่ต้นขา เข่า หน้าแข้ง ข้อเท้า หรือเท้า/นิ้วเท้า</span>
            <p class="text-xs text-slate-500">ติ๊กเลือกหากมีแผลที่ต้นขา ข้อเข่า หน้าแข้ง น่อง ข้อเท้า ฝ่าเท้า หรือนิ้วเท้า</p>
          </div>
        </label>

        <div id="lacLowerExtSubGroup" class="hidden pl-4 sm:pl-6 space-y-4 border-l-2 border-medical-200">
          <div>
            <p class="text-xs text-slate-600 font-semibold mb-2">จุดที่มีบาดแผล (เลือกได้หลายจุด พร้อมระบุข้าง ซ้าย/ขวา แยกตามอวัยวะ):</p>
            <div class="space-y-2">
              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="lacLegThigh" onchange="toggleLacGroup('lacLegThighSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">ต้นขา</span>
                </label>
                <div id="lacLegThighSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacLegThighSides" value="left" class="mr-1"> ข้างซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacLegThighSides" value="right" class="mr-1"> ข้างขวา</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="lacLegKneeShin" onchange="toggleLacGroup('lacLegKneeShinSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">เข่า / หน้าแข้ง / น่อง</span>
                </label>
                <div id="lacLegKneeShinSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacLegKneeShinSides" value="left" class="mr-1"> ข้างซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacLegKneeShinSides" value="right" class="mr-1"> ข้างขวา</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="lacLegAnkleFoot" onchange="toggleLacGroup('lacLegAnkleFootSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">ข้อเท้า / ส้นเท้า / ฝ่าเท้า / หลังเท้า</span>
                </label>
                <div id="lacLegAnkleFootSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacLegAnkleFootSides" value="left" class="mr-1"> ข้างซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="lacLegAnkleFootSides" value="right" class="mr-1"> ข้างขวา</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <div class="flex flex-col sm:flex-row sm:items-start justify-between text-xs py-1.5 gap-2">
                  <label class="flex items-center space-x-2 cursor-pointer mt-0.5">
                    <input type="checkbox" id="lacLegToes" onchange="toggleLacGroup('lacLegToesSidesContainer', this.checked)" class="text-medical-600 rounded">
                    <span class="text-xs sm:text-sm font-medium text-slate-800">นิ้วเท้า</span>
                  </label>
                  <div id="lacLegToesSidesContainer" class="hidden flex flex-col space-y-1.5 pl-6 sm:pl-0">
                    <div class="flex items-center flex-wrap gap-1.5">
                      <span class="text-[11px] text-slate-500 font-medium w-8">ซ้าย:</span>
                      <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="lacLegToesLeftDigits" value="thumb" class="text-medical-600 rounded"><span>โป้ง</span></label>
                      <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="lacLegToesLeftDigits" value="index" class="text-medical-600 rounded"><span>ชี้</span></label>
                      <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="lacLegToesLeftDigits" value="middle" class="text-medical-600 rounded"><span>กลาง</span></label>
                      <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="lacLegToesLeftDigits" value="ring" class="text-medical-600 rounded"><span>นาง</span></label>
                      <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="lacLegToesLeftDigits" value="little" class="text-medical-600 rounded"><span>ก้อย</span></label>
                    </div>
                    <div class="flex items-center flex-wrap gap-1.5">
                      <span class="text-[11px] text-slate-500 font-medium w-8">ขวา:</span>
                      <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="lacLegToesRightDigits" value="thumb" class="text-medical-600 rounded"><span>โป้ง</span></label>
                      <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="lacLegToesRightDigits" value="index" class="text-medical-600 rounded"><span>ชี้</span></label>
                      <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="lacLegToesRightDigits" value="middle" class="text-medical-600 rounded"><span>กลาง</span></label>
                      <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="lacLegToesRightDigits" value="ring" class="text-medical-600 rounded"><span>นาง</span></label>
                      <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="lacLegToesRightDigits" value="little" class="text-medical-600 rounded"><span>ก้อย</span></label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p class="text-xs text-slate-600 font-semibold mb-1">อาการสำคัญที่พบร่วมด้วย (เลือกได้หลายข้อหากมีอาการ):</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="lacLowerExtSigns" value="tendon_bone_deficit_leg" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">เดินลงน้ำหนักไม่ได้ หรือกระดกข้อเท้า/ขยับนิ้วเท้าไม่ได้ตามปกติ</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="lacLowerExtSigns" value="nerve_numbness_foot" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">มีอาการชา หรือไร้ความรู้สึกที่เท้า/นิ้วเท้า</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="lacLowerExtSigns" value="vascular_cold_pale_foot" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">ปลายเท้าซีดขาว เย็นเฉียบ หรือม่วงคล้ำ</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="lacLowerExtSigns" value="open_fracture_leg" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">ขา ข้อเท้า หรือเท้าผิดรูป บิดเบี้ยว หรือแผลลึกจนมองเห็นกระดูก</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer sm:col-span-2">
                <input type="checkbox" name="lacLowerExtSigns" value="amputation_leg" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">นิ้วเท้าหรือชิ้นส่วนของเท้า/ขาขาดออกจากกัน</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 2.7 บาดแผลที่ตำแหน่งอื่นๆ (พิมพ์ระบุ) -->
      <div class="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
        <label class="flex items-center space-x-2.5 cursor-pointer">
          <input type="checkbox" id="lacParentOther" onchange="toggleLacGroup('lacOtherSubGroup', this.checked)" class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded">
          <span class="text-xs sm:text-sm font-bold text-slate-900">2.7 บาดแผลที่ตำแหน่งอื่นๆ (พิมพ์ระบุ)</span>
        </label>
        <div id="lacOtherSubGroup" class="hidden mt-3 pl-6 border-l-2 border-medical-200 space-y-2">
          <label class="text-xs font-semibold text-slate-600 block">ระบุตำแหน่งบาดแผลเพิ่มเติม:</label>
          <input type="text" id="lacOtherLocationDetail" placeholder="เช่น บริเวณรักแร้, ซอกคอ, ก้นกบ..." class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500">
        </div>
      </div>
    </div>
  </div>

  <!-- CARD 3: อาการผิดปกติของร่างกาย (ภาวะเสียเลือด/ช็อก) และระดับความปวด -->
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
        <i data-lucide="activity" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900">3. อาการผิดปกติของร่างกาย และระดับความปวด</h2>
        <p class="text-xs text-slate-500">คัดกรองภาวะช็อกจากการเสียเลือด และระดับความปวดบริเวณบาดแผล</p>
      </div>
    </div>

    <!-- 3.1 อาการผิดปกติของร่างกาย -->
    <div class="mb-6">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        3.1 อาการผิดปกติของร่างกายที่พบร่วมด้วยในขณะนี้ (เลือกได้หลายข้อหากมีอาการ):
      </label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="lacSystemicSigns" value="dizziness_presyncope" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">หน้ามืด เวียนศีรษะ วูบ หรือรู้สึกเหมือนจะเป็นลม</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="lacSystemicSigns" value="palpitation_cold_sweat" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">ใจสั่น เหงื่อแตกท่วมตัว ตัวเย็น หรือหน้าซีดปากซีด</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="lacSystemicSigns" value="excessive_thirst_weakness" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">กระหายน้ำมากผิดปกติ หรืออ่อนเพลียไม่มีแรง</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="lacSystemicSigns" value="infection_signs_fever_pus" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">มีไข้ หนาวสั่น หรือบริเวณแผลเริ่มบวมแดงร้อนและมีหนองซึม (กรณีแผลเป็นมาหลายวัน)</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer sm:col-span-2">
          <input type="checkbox" name="lacSystemicSigns" value="no_systemic_signs" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">ไม่มีอาการผิดปกติของร่างกายดังกล่าว</span>
        </label>
      </div>
    </div>

    <!-- 3.2 ระดับความปวดบริเวณบาดแผล -->
    <div>
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          3.2 ระดับความปวดบริเวณบาดแผลในขณะนี้ (Pain Score 0–10):
        </label>
        <div class="flex items-center space-x-2">
          <span id="lacPainScoreBadge" class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all">
            <span id="lacPainScoreEmoji" class="text-base">⚪</span>
            <span id="lacPainScoreText">ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)</span>
          </span>
          <button type="button" id="lacPainScoreClearBtn" onclick="clearLacPainScore()" class="hidden text-xs text-slate-400 hover:text-slate-600 underline">ล้างค่า</button>
        </div>
      </div>
      <div class="pt-2 px-1">
        <input type="range" id="lacPainScore" min="0" max="10" value="0"
          oninput="handleLacPainScoreChange(this.value)"
          class="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-600">
        <div class="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
          <span>0 ไม่ปวดเลย</span>
          <span>5 ปวดปานกลาง</span>
          <span>10 ปวดมากที่สุด</span>
        </div>
      </div>
    </div>
  </div>

  <!-- CARD 4: ประวัติยาละลายลิ่มเลือด และวัคซีนป้องกันโรคบาดทะยัก -->
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
        <i data-lucide="shield-plus" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900">4. ประวัติยาละลายลิ่มเลือด และวัคซีนป้องกันโรคบาดทะยัก</h2>
        <p class="text-xs text-slate-500">ประเมินความเสี่ยงเลือดหยุดยาก และความจำเป็นในการฉีดวัคซีนป้องกันโรคบาดทะยัก</p>
      </div>
    </div>

    <!-- 4.1 ประวัติการใช้ยาละลายลิ่มเลือด -->
    <div class="mb-5">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        4.1 ประวัติการใช้ยาละลายลิ่มเลือด ยาต้านเกล็ดเลือด หรือโรคเลือดหยุดยาก:
      </label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="lacAntithrombotic" value="on_anticoagulant_antiplatelet" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">รับประทานยาละลายลิ่มเลือด หรือยาต้านเกล็ดเลือด (เช่น Warfarin, Aspirin, Plavix/Clopidogrel, DOACs)</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="lacAntithrombotic" value="bleeding_disorder" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">มีโรคประจำตัวที่ทำให้เลือดออกง่ายหรือหยุดยาก (เช่น โรคตับแข็ง, เกล็ดเลือดต่ำ, โรคฮีโมฟีเลีย)</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="lacAntithrombotic" value="unknown_meds" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">มียาประจำตัวรับประทานอยู่ แต่ไม่ทราบชื่อยาแน่ชัด</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="lacAntithrombotic" value="no_antithrombotic" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">ไม่ได้ใช้ยากลุ่มนี้ และไม่มีโรคเลือดหยุดยาก</span>
        </label>
      </div>
    </div>

    <!-- 4.2 ประวัติการฉีดวัคซีนป้องกันโรคบาดทะยัก -->
    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        4.2 ประวัติการฉีดวัคซีนป้องกันโรคบาดทะยัก (Tetanus Immunization):
      </label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="lacTetanusHx" value="within_5_years" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">เคยฉีดวัคซีนบาดทะยักเข็มล่าสุด ภายในไม่เกิน 5 ปีที่ผ่านมา</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="lacTetanusHx" value="5_to_10_years" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">เคยฉีดวัคซีนบาดทะยักเข็มล่าสุด นานเกิน 5 ปี แต่ไม่เกิน 10 ปี</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="lacTetanusHx" value="more_than_10_years" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">ฉีดเข็มล่าสุดนานเกิน 10 ปีแล้ว</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="lacTetanusHx" value="never_or_unsure" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">ไม่เคยฉีดมาก่อน หรือจำไม่ได้ / ไม่แน่ใจว่าเคยฉีดครบหรือไม่</span>
        </label>
      </div>
    </div>
  </div>
</div>
`;

// --- Master Module Definition ---
const lacerationBleedingModule = {
  id: 'laceration_bleeding',
  recordCc: 'laceration_bleeding',
  titleTh: 'บาดแผลฉีกขาด / มีเลือดออก',
  titleEn: 'Laceration / Active bleeding',
  icon: 'bandage',
  doctorCcBadgeHtml: '<i data-lucide="bandage" class="w-3.5 h-3.5 mr-1 text-rose-500"></i> CC: บาดแผลฉีกขาด / มีเลือดออก (Laceration & Bleeding)',
  algorithm: 'laceration-bleeding-protocol',
  sectionDomId: 'cc-laceration-bleeding-section',
  formHtml: LACERATION_FORM_HTML,

  init: function() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  },

  collectIntake: function(ctx = {}) {
    const durVal = parseInt(document.getElementById('lacDurationVal')?.value, 10);
    const durUnit = document.getElementById('lacDurationUnit')?.value || 'hours';

    const getRadio = (name) => {
      const el = document.querySelector(`input[name="${name}"]:checked`);
      return el ? el.value : null;
    };
    const getChecks = (name) => {
      return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(el => el.value);
    };

    const causes = getChecks('lacCauses');
    const causeSharpDetail = document.getElementById('lacCauseSharpDetail')?.value?.trim() || '';
    const causeMachineryDetail = document.getElementById('lacCauseMachineryDetail')?.value?.trim() || '';
    const causeBluntDetail = document.getElementById('lacCauseBluntDetail')?.value?.trim() || '';
    const causePunctureDetail = document.getElementById('lacCausePunctureDetail')?.value?.trim() || '';
    const causeOtherDetail = document.getElementById('lacCauseOtherDetail')?.value?.trim() || '';

    const contaminants = getChecks('lacContaminants');
    const bleedingStatus = getRadio('lacBleedingStatus');
    const prodrome = getRadio('lacProdrome');

    // Anatomical regions & side selections
    const getSubState = (parentActive, elId, sidesName) => {
      const active = parentActive && (document.getElementById(elId)?.checked || false);
      return { active, sides: active ? getChecks(sidesName) : [] };
    };

    const parentHeadFace = document.getElementById('lacParentHeadFace')?.checked || false;
    const sScalp = getSubState(parentHeadFace, 'lacHeadScalp', 'lacHeadScalpSides');
    const sFace = getSubState(parentHeadFace, 'lacHeadFace', 'lacHeadFaceSides');
    const sEye = getSubState(parentHeadFace, 'lacHeadEye', 'lacHeadEyeSides');
    const sEar = getSubState(parentHeadFace, 'lacHeadEar', 'lacHeadEarSides');
    const sNoseMouth = getSubState(parentHeadFace, 'lacHeadNoseMouth', 'lacHeadNoseMouthSides');
    const headSigns = parentHeadFace ? getChecks('lacHeadSigns') : [];

    const parentNeck = document.getElementById('lacParentNeck')?.checked || false;
    const sNeckFront = getSubState(parentNeck, 'lacNeckFront', 'lacNeckFrontSides');
    const sNeckSide = getSubState(parentNeck, 'lacNeckSide', 'lacNeckSideSides');
    const sNeckBack = getSubState(parentNeck, 'lacNeckBack', 'lacNeckBackSides');
    const neckSigns = parentNeck ? getChecks('lacNeckSigns') : [];

    const parentChest = document.getElementById('lacParentChest')?.checked || false;
    const sChestRibs = getSubState(parentChest, 'lacChestRibs', 'lacChestRibsSides');
    const sChestUpperBack = getSubState(parentChest, 'lacChestUpperBack', 'lacChestUpperBackSides');
    const chestSigns = parentChest ? getChecks('lacChestSigns') : [];

    const parentAbdomen = document.getElementById('lacParentAbdomen')?.checked || false;
    const sAbdWall = getSubState(parentAbdomen, 'lacAbdWall', 'lacAbdWallSides');
    const sAbdFlank = getSubState(parentAbdomen, 'lacAbdFlank', 'lacAbdFlankSides');
    const sAbdLowerBack = getSubState(parentAbdomen, 'lacAbdLowerBack', 'lacAbdLowerBackSides');
    const sAbdButtock = getSubState(parentAbdomen, 'lacAbdButtock', 'lacAbdButtockSides');
    const sAbdGenitalia = getSubState(parentAbdomen, 'lacAbdGenitalia', 'lacAbdGenitaliaSides');
    const abdomenSigns = parentAbdomen ? getChecks('lacAbdomenSigns') : [];

    const parentUpperExt = document.getElementById('lacParentUpperExtremity')?.checked || false;
    const sArmShoulder = getSubState(parentUpperExt, 'lacArmShoulder', 'lacArmShoulderSides');
    const sArmElbow = getSubState(parentUpperExt, 'lacArmElbow', 'lacArmElbowSides');
    const sArmWrist = getSubState(parentUpperExt, 'lacArmWrist', 'lacArmWristSides');
    const isArmFingers = parentUpperExt && !!document.getElementById('lacArmFingers')?.checked;
    const armFingersLeftDigits = isArmFingers ? getChecks('lacArmFingersLeftDigits') : [];
    const armFingersRightDigits = isArmFingers ? getChecks('lacArmFingersRightDigits') : [];
    const armFingersSides = [];
    if (armFingersLeftDigits.length > 0) armFingersSides.push('left');
    if (armFingersRightDigits.length > 0) armFingersSides.push('right');
    const armFingersDigits = [...new Set([...armFingersLeftDigits, ...armFingersRightDigits])];
    const upperExtSigns = parentUpperExt ? getChecks('lacUpperExtSigns') : [];

    const parentLowerExt = document.getElementById('lacParentLowerExtremity')?.checked || false;
    const sLegThigh = getSubState(parentLowerExt, 'lacLegThigh', 'lacLegThighSides');
    const sLegKneeShin = getSubState(parentLowerExt, 'lacLegKneeShin', 'lacLegKneeShinSides');
    const sLegAnkleFoot = getSubState(parentLowerExt, 'lacLegAnkleFoot', 'lacLegAnkleFootSides');
    const isLegToes = parentLowerExt && !!document.getElementById('lacLegToes')?.checked;
    const legToesLeftDigits = isLegToes ? getChecks('lacLegToesLeftDigits') : [];
    const legToesRightDigits = isLegToes ? getChecks('lacLegToesRightDigits') : [];
    const legToesSides = [];
    if (legToesLeftDigits.length > 0) legToesSides.push('left');
    if (legToesRightDigits.length > 0) legToesSides.push('right');
    const legToesDigits = [...new Set([...legToesLeftDigits, ...legToesRightDigits])];
    const lowerExtSigns = parentLowerExt ? getChecks('lacLowerExtSigns') : [];

    const parentOther = document.getElementById('lacParentOther')?.checked || false;
    const otherLocationDetail = parentOther ? (document.getElementById('lacOtherLocationDetail')?.value?.trim() || '') : '';

    const systemicSigns = getChecks('lacSystemicSigns');
    const painScore = lacPainScoreTouched ? parseInt(document.getElementById('lacPainScore')?.value || 0, 10) : null;
    const antithrombotic = getRadio('lacAntithrombotic');
    const tetanusHx = getRadio('lacTetanusHx');

    const otherSymptomsFree = document.getElementById('sx_other_free')?.value?.trim() || ctx.otherSymptomsFree || '';

    const rec = {
      id: ctx.recordId || ctx.id,
      queue_number: ctx.queueNumber || ctx.queue_number,
      hn: ctx.randomHn || ctx.hn,
      name: ctx.patientName || ctx.name,
      age: ctx.patientAge !== undefined ? ctx.patientAge : ctx.age,
      gender: ctx.gender,
      chief_complaint: 'laceration_bleeding',
      chief_complaint_title: 'บาดแผลฉีกขาด / มีเลือดออก',
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

      lacCauses: causes,
      lacCauseSharpDetail: causeSharpDetail,
      lacCauseMachineryDetail: causeMachineryDetail,
      lacCauseBluntDetail: causeBluntDetail,
      lacCausePunctureDetail: causePunctureDetail,
      lacCauseOtherDetail: causeOtherDetail,
      lacContaminants: contaminants,
      lacBleedingStatus: bleedingStatus,
      lacProdrome: prodrome,

      lacParentHeadFace: parentHeadFace,
      lacHeadScalp: sScalp.active,
      lacHeadScalpSides: sScalp.sides,
      lacHeadFace: sFace.active,
      lacHeadFaceSides: sFace.sides,
      lacHeadEye: sEye.active,
      lacHeadEyeSides: sEye.sides,
      lacHeadEar: sEar.active,
      lacHeadEarSides: sEar.sides,
      lacHeadNoseMouth: sNoseMouth.active,
      lacHeadNoseMouthSides: sNoseMouth.sides,
      lacHeadSigns: headSigns,

      lacParentNeck: parentNeck,
      lacNeckFront: sNeckFront.active,
      lacNeckFrontSides: sNeckFront.sides,
      lacNeckSide: sNeckSide.active,
      lacNeckSideSides: sNeckSide.sides,
      lacNeckBack: sNeckBack.active,
      lacNeckBackSides: sNeckBack.sides,
      lacNeckSigns: neckSigns,

      lacParentChest: parentChest,
      lacChestRibs: sChestRibs.active,
      lacChestRibsSides: sChestRibs.sides,
      lacChestUpperBack: sChestUpperBack.active,
      lacChestUpperBackSides: sChestUpperBack.sides,
      lacChestSigns: chestSigns,

      lacParentAbdomen: parentAbdomen,
      lacAbdWall: sAbdWall.active,
      lacAbdWallSides: sAbdWall.sides,
      lacAbdFlank: sAbdFlank.active,
      lacAbdFlankSides: sAbdFlank.sides,
      lacAbdLowerBack: sAbdLowerBack.active,
      lacAbdLowerBackSides: sAbdLowerBack.sides,
      lacAbdButtock: sAbdButtock.active,
      lacAbdButtockSides: sAbdButtock.sides,
      lacAbdGenitalia: sAbdGenitalia.active,
      lacAbdGenitaliaSides: sAbdGenitalia.sides,
      lacAbdomenSigns: abdomenSigns,

      lacParentUpperExtremity: parentUpperExt,
      lacArmShoulder: sArmShoulder.active,
      lacArmShoulderSides: sArmShoulder.sides,
      lacArmElbow: sArmElbow.active,
      lacArmElbowSides: sArmElbow.sides,
      lacArmWrist: sArmWrist.active,
      lacArmWristSides: sArmWrist.sides,
      lacArmFingers: isArmFingers,
      lacArmFingersSides: armFingersSides,
      lacArmFingersLeftDigits: armFingersLeftDigits,
      lacArmFingersRightDigits: armFingersRightDigits,
      lacArmFingersDigits: armFingersDigits,
      lacUpperExtSigns: upperExtSigns,

      lacParentLowerExtremity: parentLowerExt,
      lacLegThigh: sLegThigh.active,
      lacLegThighSides: sLegThigh.sides,
      lacLegKneeShin: sLegKneeShin.active,
      lacLegKneeShinSides: sLegKneeShin.sides,
      lacLegAnkleFoot: sLegAnkleFoot.active,
      lacLegAnkleFootSides: sLegAnkleFoot.sides,
      lacLegToes: isLegToes,
      lacLegToesSides: legToesSides,
      lacLegToesLeftDigits: legToesLeftDigits,
      lacLegToesRightDigits: legToesRightDigits,
      lacLegToesDigits: legToesDigits,
      lacLowerExtSigns: lowerExtSigns,

      lacParentOther: parentOther,
      lacOtherLocationDetail: otherLocationDetail,

      lacSystemicSigns: systemicSigns,
      painScore: painScore,
      lacAntithrombotic: antithrombotic,
      lacTetanusHx: tetanusHx
    };

    updateLacerationOutputs(rec);
    return rec;
  },

  collectFormData: function(ctx = {}) {
    return this.collectIntake(ctx);
  },

  hydrateForm: function(data = {}) {
    if (data.durationVal) {
      const valEl = document.getElementById('lacDurationVal');
      if (valEl) valEl.value = data.durationVal;
    }
    const unitEl = document.getElementById('lacDurationUnit');
    if (unitEl) {
      unitEl.value = data.durationUnit || 'hours';
    }

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

    setChecks('lacCauses', data.lacCauses);
    if (Array.isArray(data.lacCauses)) {
      [
        ['sharp_object', 'lacCauseSharpDetailContainer', 'lacCauseSharpDetail', data.lacCauseSharpDetail],
        ['machinery_tools', 'lacCauseMachineryDetailContainer', 'lacCauseMachineryDetail', data.lacCauseMachineryDetail],
        ['blunt_impact', 'lacCauseBluntDetailContainer', 'lacCauseBluntDetail', data.lacCauseBluntDetail],
        ['puncture_wound', 'lacCausePunctureDetailContainer', 'lacCausePunctureDetail', data.lacCausePunctureDetail],
        ['other_cause', 'lacCauseOtherDetailContainer', 'lacCauseOtherDetail', data.lacCauseOtherDetail]
      ].forEach(([k, c, inp, v]) => {
        if (data.lacCauses.includes(k)) {
          toggleLacGroup(c, true);
          const el = document.getElementById(inp); if (el) el.value = v || '';
        }
      });
    }

    setChecks('lacContaminants', data.lacContaminants);
    setRadio('lacBleedingStatus', data.lacBleedingStatus);
    setRadio('lacProdrome', data.lacProdrome);

    const hydrateSub = (key, id, cont, sidesName, sidesData) => {
      if (data[key]) {
        setCheckById(id, true);
        toggleLacGroup(cont, true);
        if (sidesName && sidesData) setChecks(sidesName, sidesData);
      }
    };

    if (data.lacParentHeadFace) {
      setCheckById('lacParentHeadFace', true);
      toggleLacGroup('lacHeadSubGroup', true);
      hydrateSub('lacHeadScalp', 'lacHeadScalp', 'lacHeadScalpSidesContainer', 'lacHeadScalpSides', data.lacHeadScalpSides);
      hydrateSub('lacHeadFace', 'lacHeadFace', 'lacHeadFaceSidesContainer', 'lacHeadFaceSides', data.lacHeadFaceSides);
      hydrateSub('lacHeadEye', 'lacHeadEye', 'lacHeadEyeSidesContainer', 'lacHeadEyeSides', data.lacHeadEyeSides);
      hydrateSub('lacHeadEar', 'lacHeadEar', 'lacHeadEarSidesContainer', 'lacHeadEarSides', data.lacHeadEarSides);
      hydrateSub('lacHeadNoseMouth', 'lacHeadNoseMouth', 'lacHeadNoseMouthSidesContainer', 'lacHeadNoseMouthSides', data.lacHeadNoseMouthSides);
      setChecks('lacHeadSigns', data.lacHeadSigns);
    }

    if (data.lacParentNeck) {
      setCheckById('lacParentNeck', true);
      toggleLacGroup('lacNeckSubGroup', true);
      hydrateSub('lacNeckFront', 'lacNeckFront', 'lacNeckFrontSidesContainer', 'lacNeckFrontSides', data.lacNeckFrontSides);
      hydrateSub('lacNeckSide', 'lacNeckSide', 'lacNeckSideSidesContainer', 'lacNeckSideSides', data.lacNeckSideSides);
      hydrateSub('lacNeckBack', 'lacNeckBack', 'lacNeckBackSidesContainer', 'lacNeckBackSides', data.lacNeckBackSides);
      setChecks('lacNeckSigns', data.lacNeckSigns);
    }

    if (data.lacParentChest) {
      setCheckById('lacParentChest', true);
      toggleLacGroup('lacChestSubGroup', true);
      hydrateSub('lacChestRibs', 'lacChestRibs', 'lacChestRibsSidesContainer', 'lacChestRibsSides', data.lacChestRibsSides);
      hydrateSub('lacChestUpperBack', 'lacChestUpperBack', 'lacChestUpperBackSidesContainer', 'lacChestUpperBackSides', data.lacChestUpperBackSides);
      setChecks('lacChestSigns', data.lacChestSigns);
    }

    if (data.lacParentAbdomen) {
      setCheckById('lacParentAbdomen', true);
      toggleLacGroup('lacAbdomenSubGroup', true);
      hydrateSub('lacAbdWall', 'lacAbdWall', 'lacAbdWallSidesContainer', 'lacAbdWallSides', data.lacAbdWallSides);
      hydrateSub('lacAbdFlank', 'lacAbdFlank', 'lacAbdFlankSidesContainer', 'lacAbdFlankSides', data.lacAbdFlankSides);
      hydrateSub('lacAbdLowerBack', 'lacAbdLowerBack', 'lacAbdLowerBackSidesContainer', 'lacAbdLowerBackSides', data.lacAbdLowerBackSides);
      hydrateSub('lacAbdButtock', 'lacAbdButtock', 'lacAbdButtockSidesContainer', 'lacAbdButtockSides', data.lacAbdButtockSides);
      hydrateSub('lacAbdGenitalia', 'lacAbdGenitalia', 'lacAbdGenitaliaSidesContainer', 'lacAbdGenitaliaSides', data.lacAbdGenitaliaSides);
      setChecks('lacAbdomenSigns', data.lacAbdomenSigns);
    }

    if (data.lacParentUpperExtremity) {
      setCheckById('lacParentUpperExtremity', true);
      toggleLacGroup('lacUpperExtSubGroup', true);
      hydrateSub('lacArmShoulder', 'lacArmShoulder', 'lacArmShoulderSidesContainer', 'lacArmShoulderSides', data.lacArmShoulderSides);
      hydrateSub('lacArmElbow', 'lacArmElbow', 'lacArmElbowSidesContainer', 'lacArmElbowSides', data.lacArmElbowSides);
      hydrateSub('lacArmWrist', 'lacArmWrist', 'lacArmWristSidesContainer', 'lacArmWristSides', data.lacArmWristSides);
      if (data.lacArmFingers) {
        setCheckById('lacArmFingers', true);
        toggleLacGroup('lacArmFingersSidesContainer', true);
        setChecks('lacArmFingersLeftDigits', data.lacArmFingersLeftDigits || (data.lacArmFingersSides?.includes('left') ? data.lacArmFingersDigits : []));
        setChecks('lacArmFingersRightDigits', data.lacArmFingersRightDigits || (data.lacArmFingersSides?.includes('right') ? data.lacArmFingersDigits : []));
      }
      setChecks('lacUpperExtSigns', data.lacUpperExtSigns);
    }

    if (data.lacParentLowerExtremity) {
      setCheckById('lacParentLowerExtremity', true);
      toggleLacGroup('lacLowerExtSubGroup', true);
      hydrateSub('lacLegThigh', 'lacLegThigh', 'lacLegThighSidesContainer', 'lacLegThighSides', data.lacLegThighSides);
      hydrateSub('lacLegKneeShin', 'lacLegKneeShin', 'lacLegKneeShinSidesContainer', 'lacLegKneeShinSides', data.lacLegKneeShinSides);
      hydrateSub('lacLegAnkleFoot', 'lacLegAnkleFoot', 'lacLegAnkleFootSidesContainer', 'lacLegAnkleFootSides', data.lacLegAnkleFootSides);
      if (data.lacLegToes) {
        setCheckById('lacLegToes', true);
        toggleLacGroup('lacLegToesSidesContainer', true);
        setChecks('lacLegToesLeftDigits', data.lacLegToesLeftDigits || (data.lacLegToesSides?.includes('left') ? data.lacLegToesDigits : []));
        setChecks('lacLegToesRightDigits', data.lacLegToesRightDigits || (data.lacLegToesSides?.includes('right') ? data.lacLegToesDigits : []));
      }
      setChecks('lacLowerExtSigns', data.lacLowerExtSigns);
    }

    if (data.lacParentOther) {
      setCheckById('lacParentOther', true);
      toggleLacGroup('lacOtherSubGroup', true);
      const otherEl = document.getElementById('lacOtherLocationDetail');
      if (otherEl) otherEl.value = data.lacOtherLocationDetail || '';
    }

    setChecks('lacSystemicSigns', data.lacSystemicSigns);

    if (data.painScore !== null && data.painScore !== undefined) {
      const slider = document.getElementById('lacPainScore');
      if (slider) slider.value = data.painScore;
      handleLacPainScoreChange(data.painScore);
    } else {
      clearLacPainScore();
    }

    setRadio('lacAntithrombotic', data.lacAntithrombotic);
    setRadio('lacTetanusHx', data.lacTetanusHx);
  },

  clearForm: function() {
    ['lacDurationVal', 'lacCauseSharpDetail', 'lacCauseMachineryDetail', 'lacCauseBluntDetail', 'lacCausePunctureDetail', 'lacCauseOtherDetail', 'lacOtherLocationDetail'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = '';
    });
    const durUnit = document.getElementById('lacDurationUnit');
    if (durUnit) durUnit.value = 'hours';
    clearLacPainScore();

    [
      'lacCauseSharpDetailContainer', 'lacCauseMachineryDetailContainer', 'lacCauseBluntDetailContainer', 'lacCausePunctureDetailContainer', 'lacCauseOtherDetailContainer',
      'lacHeadSubGroup', 'lacHeadScalpSidesContainer', 'lacHeadFaceSidesContainer', 'lacHeadEyeSidesContainer', 'lacHeadEarSidesContainer', 'lacHeadNoseMouthSidesContainer',
      'lacNeckSubGroup', 'lacNeckFrontSidesContainer', 'lacNeckSideSidesContainer', 'lacNeckBackSidesContainer',
      'lacChestSubGroup', 'lacChestRibsSidesContainer', 'lacChestUpperBackSidesContainer',
      'lacAbdomenSubGroup', 'lacAbdWallSidesContainer', 'lacAbdFlankSidesContainer', 'lacAbdLowerBackSidesContainer', 'lacAbdButtockSidesContainer', 'lacAbdGenitaliaSidesContainer',
      'lacUpperExtSubGroup', 'lacArmShoulderSidesContainer', 'lacArmElbowSidesContainer', 'lacArmWristSidesContainer', 'lacArmFingersSidesContainer',
      'lacLowerExtSubGroup', 'lacLegThighSidesContainer', 'lacLegKneeShinSidesContainer', 'lacLegAnkleFootSidesContainer', 'lacLegToesSidesContainer', 'lacOtherSubGroup'
    ].forEach(id => { const el = document.getElementById(id); if (el) el.classList.add('hidden'); });

    document.querySelectorAll('#cc-laceration-bleeding-section input[type="radio"], #cc-laceration-bleeding-section input[type="checkbox"]').forEach(i => { i.checked = false; });
  },

  isRedFlag: function(patient) {
    const rfs = evaluateLacerationRedFlags(patient);
    return rfs.length > 0;
  },

  evaluateRedFlags: evaluateLacerationRedFlags,
  updateOutputs: updateLacerationOutputs,
  renderRapidHpi: renderLacerationRapidHpi,
  renderNarrative: renderLacerationNarrative,
  renderDoctorHpi: renderLacerationDoctorHpi,
  generateCds: generateLacerationCds,

  // --- Seed Patients Registry ---
  seedPatients: [
    // Case 1: Angle grinder cut to left wrist with active spurting & tendon/nerve deficit (ESI 1)
    {
      id: 'case-lac-01', queue_number: 'E1-105', hn: '7890501',
      name: 'นายสมเกียรติ หินเจียรแตกบาดข้อมือเลือดพุ่ง', age: 38, gender: 'ชาย',
      chief_complaint: 'laceration_bleeding', chief_complaint_title: 'บาดแผลฉีกขาด / มีเลือดออก',
      timestamp: '2026-11-06T08:00:00.000Z', status: 'waiting',
      durationVal: 30, durationUnit: 'minutes', hospRecordStatus: 'self', underlying: [], drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร', currentMeds: 'ไม่มี',
      otherSymptomsFree: 'หินเจียรตัดเหล็กแตกสะบัดบาดข้อมือซ้ายลึก เลือดพุ่งกระฉูดตามจังหวะชีพจร กดผ้าแน่นแล้วชุ่มเลือดเร็ว หน้าซีดเหงื่อแตกตัวเย็น นิ้วมืองอไม่ได้และชาปลายนิ้วก้อย-นาง',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.4, sbp: 88, dbp: 52, bp: '88/52', pr: 122, rr: 24, spo2: 98 },
      esi_level: 1,
      lacCauses: ['machinery_tools'], lacCauseMachineryDetail: 'ใบหินเจียรแตกสะบัดใส่',
      lacContaminants: ['foreign_body_retained', 'dirty_contaminated'],
      lacBleedingStatus: 'active_spurting', lacProdrome: 'no_prodrome',
      lacParentHeadFace: false, lacParentNeck: false, lacParentChest: false, lacParentAbdomen: false,
      lacParentUpperExtremity: true, lacArmShoulder: false, lacArmElbow: false, lacArmWrist: true, lacArmWristSides: ['left'], lacArmFingers: false,
      lacUpperExtSigns: ['tendon_deficit_hand', 'nerve_numbness_hand', 'vascular_cold_pale_hand'],
      lacParentLowerExtremity: false,
      lacSystemicSigns: ['dizziness_presyncope', 'palpitation_cold_sweat', 'excessive_thirst_weakness'],
      painScore: 9, lacAntithrombotic: 'no_antithrombotic', lacTetanusHx: 'more_than_10_years'
    },

    // Case 2: Slashed penetrating wound to right chest with open pneumothorax (ESI 1)
    {
      id: 'case-lac-02', queue_number: 'E1-106', hn: '7890502',
      name: 'นายชาญชัย ถูกมีดฟันหน้าอกมีลมดูด', age: 26, gender: 'ชาย',
      chief_complaint: 'laceration_bleeding', chief_complaint_title: 'บาดแผลฉีกขาด / มีเลือดออก',
      timestamp: '2026-11-06T08:30:00.000Z', status: 'waiting',
      durationVal: 45, durationUnit: 'minutes', hospRecordStatus: 'self', underlying: [], drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร', currentMeds: 'ไม่มี',
      otherSymptomsFree: 'ถูกมีดดาบฟันเข้าที่หน้าอกขวาและหลังขวา แผลลึก มีเสียงลมดูดฟ่อๆ เข้าออกตามจังหวะหายใจ แน่นหน้าอก หายใจหอบเหนื่อยรุนแรง',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.8, sbp: 105, dbp: 68, bp: '105/68', pr: 114, rr: 28, spo2: 91 },
      esi_level: 1,
      lacCauses: ['sharp_object'], lacCauseSharpDetail: 'ถูกมีดดาบฟัน',
      lacContaminants: ['dirty_contaminated'],
      lacBleedingStatus: 'active_oozing', lacProdrome: 'no_prodrome',
      lacParentHeadFace: false, lacParentNeck: false,
      lacParentChest: true, lacChestRibs: true, lacChestRibsSides: ['right'], lacChestUpperBack: true, lacChestUpperBackSides: ['right'],
      lacChestSigns: ['dyspnea_pleuritic_pain', 'sucking_chest_wound'],
      lacParentAbdomen: false, lacParentUpperExtremity: false, lacParentLowerExtremity: false,
      lacSystemicSigns: ['palpitation_cold_sweat'],
      painScore: 8, lacAntithrombotic: 'no_antithrombotic', lacTetanusHx: 'never_or_unsure'
    },

    // Case 3: Fall with scalp laceration, brief LOC, and on Warfarin (ESI 2)
    {
      id: 'case-lac-03', queue_number: 'E2-105', hn: '7890503',
      name: 'นางปราณี ลื่นล้มหัวแตกสลบบนยาละลายลิ่มเลือด', age: 69, gender: 'หญิง',
      chief_complaint: 'laceration_bleeding', chief_complaint_title: 'บาดแผลฉีกขาด / มีเลือดออก',
      timestamp: '2026-11-06T09:00:00.000Z', status: 'waiting',
      durationVal: 2, durationUnit: 'hours', hospRecordStatus: 'complete',
      underlying: ['หัวใจเต้นผิดจังหวะ (AF)', 'ความดันโลหิตสูง (HT)'],
      drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร',
      currentMeds: 'Warfarin 3 mg 1 tab po od, Amlodipine 5 mg 1 tab po od',
      otherSymptomsFree: 'ลื่นล้มในห้องน้ำ ศีรษะด้านหลังกระแทกขอบชักโครก หมดสติไปประมาณ 1 นาที ฟื้นมาจำเหตุการณ์ไม่ได้ แผลหนังศีรษะแตกยาว เลือดไหลซึมไม่หยุดเพราะทานยาวาร์ฟาริน',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.6, sbp: 148, dbp: 86, bp: '148/86', pr: 78, rr: 18, spo2: 98 },
      esi_level: 2,
      lacCauses: ['fall_collision', 'blunt_impact'], lacCauseBluntDetail: 'กระแทกขอบชักโครก',
      lacContaminants: ['clean_wound'],
      lacBleedingStatus: 'active_oozing', lacProdrome: 'no_prodrome',
      lacParentHeadFace: true, lacHeadScalp: true, lacHeadScalpSides: ['center'],
      lacHeadFace: false, lacHeadEye: false, lacHeadEar: false, lacHeadNoseMouth: false,
      lacHeadSigns: ['loss_of_consciousness', 'severe_headache_vomit'],
      lacParentNeck: false, lacParentChest: false, lacParentAbdomen: false, lacParentUpperExtremity: false, lacParentLowerExtremity: false,
      lacSystemicSigns: ['no_systemic_signs'],
      painScore: 5, lacAntithrombotic: 'on_anticoagulant_antiplatelet', lacTetanusHx: '5_to_10_years'
    },

    // Case 4: Kitchen knife clean cut to left index finger, bleeding controlled, low risk (ESI 4 / 3)
    {
      id: 'case-lac-04', queue_number: 'E3-101', hn: '7890504',
      name: 'น.ส.กัญญา มีดทำครัวบาดนิ้วชี้ซ้ายเลือดหยุดแล้ว', age: 24, gender: 'หญิง',
      chief_complaint: 'laceration_bleeding', chief_complaint_title: 'บาดแผลฉีกขาด / มีเลือดออก',
      timestamp: '2026-11-06T09:30:00.000Z', status: 'waiting',
      durationVal: 1, durationUnit: 'hours', hospRecordStatus: 'self', underlying: [], drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร', currentMeds: 'ไม่มี',
      otherSymptomsFree: 'มีดทำครัวบาดนิ้วชี้ซ้ายขณะหั่นผัก แผลยาว 1.5 ซม. เลือดออกเล็กน้อยและหยุดสนิทแล้วหลังใช้ผ้ากด งอนิ้วได้ปกติ ปลายนิ้วไม่ชา ไม่หน้ามืด ฉีดวัคซีนบาดทะยักเมื่อ 2 ปีก่อน',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.7, sbp: 118, dbp: 74, bp: '118/74', pr: 72, rr: 16, spo2: 99 },
      esi_level: 4,
      lacCauses: ['sharp_object'], lacCauseSharpDetail: 'มีดทำครัวหั่นผัก',
      lacContaminants: ['clean_wound'],
      lacBleedingStatus: 'stopped', lacProdrome: 'no_prodrome',
      lacParentHeadFace: false, lacParentNeck: false, lacParentChest: false, lacParentAbdomen: false,
      lacParentUpperExtremity: true, lacArmShoulder: false, lacArmElbow: false, lacArmWrist: false,
      lacArmFingers: true, lacArmFingersSides: ['left'], lacArmFingersLeftDigits: ['index'], lacArmFingersRightDigits: [], lacArmFingersDigits: ['index'],
      lacUpperExtSigns: [], lacParentLowerExtremity: false, lacSystemicSigns: ['no_systemic_signs'],
      painScore: 2, lacAntithrombotic: 'no_antithrombotic', lacTetanusHx: 'within_5_years'
    }
  ]
};

// Register module in Ratchaburi ER Core Registry
if (typeof registerCcModule === 'function') registerCcModule(lacerationBleedingModule);
else if (typeof window !== 'undefined' && typeof window.registerCcModule === 'function') window.registerCcModule(lacerationBleedingModule);

if (typeof module !== 'undefined' && module.exports) {
  module.exports = lacerationBleedingModule;
}
