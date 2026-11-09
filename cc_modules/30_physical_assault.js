// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 30_physical_assault.js
// อาการนำ: ถูกทำร้ายร่างกาย (Physical Assault / Interpersonal Violence)
// รองรับ Zero Default Bias, Uniform Option Patterns, Progressive Parent Checkboxes
// 7 ตำแหน่งร่างกาย (พร้อมนิ้วมือ/นิ้วเท้าแยกซ้าย-ขวา โป้ง ชี้ กลาง นาง ก้อย),
// OSCC / Domestic Violence / Strangulation Screening, Pain Slider, และ Core Guard TDD 100%
// =========================================================================

// --- Module-scoped State & Helpers ---
let assaultPainScoreTouched = false;

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
  const num = parseInt(val, 10);
  const slider = document.getElementById('assaultPainScore');
  if (slider) slider.value = num;
  const emojiEl = document.getElementById('assaultPainScoreEmoji');
  const textEl = document.getElementById('assaultPainScoreText');
  const badgeEl = document.getElementById('assaultPainScoreBadge');
  const clearBtn = document.getElementById('assaultPainScoreClearBtn');
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
const handleAssaultPainSliderTouch = handleAssaultPainScoreChange;

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
  const hasBlowout = headSigns.includes('diplopia_blurred_vision') || headSigns.includes('malocclusion_tooth_avulsion');

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
    rec.pertinentPositives = ['มีรอยฟกช้ำหรือบาดแผลจากการถูกทำร้ายร่างกาย'];
  }

  const negMatch = rapidText.match(/• Pertinent Negatives:\n((?:\s*-[^\n]+\n?)+)/);
  if (negMatch) {
    rec.pertinentNegatives = negMatch[1].trim().split('\n').map(l => l.replace(/^[-*\s]+/, '').trim());
  } else {
    rec.pertinentNegatives = [];
  }

  const redFlags = evaluateAssaultRedFlags(rec);
  rec.redFlags = redFlags;
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
  const sideLabel = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return '';
    const thMap = { left: 'ซ้าย', right: 'ขวา', center: 'ตรงกลาง' };
    return ` [${arr.map(s => thMap[s] || s).join(', ')}]`;
  };
  const digitMap = { thumb: 'นิ้วโป้ง', index: 'นิ้วชี้', middle: 'นิ้วกลาง', ring: 'นิ้วนาง', little: 'นิ้วก้อย' };
  const fmtDigitsBySide = (leftD, rightD) => {
    const dParts = [];
    if (Array.isArray(leftD) && leftD.length > 0) dParts.push(`ซ้าย: ${leftD.map(x => digitMap[x] || x).join(', ')}`);
    if (Array.isArray(rightD) && rightD.length > 0) dParts.push(`ขวา: ${rightD.map(x => digitMap[x] || x).join(', ')}`);
    return dParts.length > 0 ? ` [${dParts.join('; ')}]` : '';
  };

  if (patient.assaultParentHeadFace) {
    const subs = [];
    if (patient.assaultHeadScalp) subs.push(`หนังศีรษะ/ท้ายทอย${sideLabel(patient.assaultHeadScalpSides)}`);
    if (patient.assaultHeadFace) subs.push(`ใบหน้า/โหนกแก้ม/คาง${sideLabel(patient.assaultHeadFaceSides)}`);
    if (patient.assaultHeadEye) subs.push(`ดวงตา/เบ้าตา${sideLabel(patient.assaultHeadEyeSides)}`);
    if (patient.assaultHeadEar) subs.push(`ใบหู${sideLabel(patient.assaultHeadEarSides)}`);
    if (patient.assaultHeadNoseMouth) subs.push(`จมูก/ปาก/ฟัน${sideLabel(patient.assaultHeadNoseMouthSides)}`);
    parts.push(`ศีรษะ/ใบหน้า: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  if (patient.assaultParentNeck) {
    const subs = [];
    if (patient.assaultNeckFront) subs.push(`คอด้านหน้า${sideLabel(patient.assaultNeckFrontSides)}`);
    if (patient.assaultNeckSide) subs.push(`คอด้านข้าง${sideLabel(patient.assaultNeckSideSides)}`);
    if (patient.assaultNeckBack) subs.push(`ต้นคอด้านหลัง${sideLabel(patient.assaultNeckBackSides)}`);
    parts.push(`ลำคอ: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  if (patient.assaultParentChest) {
    const subs = [];
    if (patient.assaultChestFront) subs.push(`หน้าอก/ซี่โครง${sideLabel(patient.assaultChestFrontSides)}`);
    if (patient.assaultChestClavicle) subs.push(`ไหปลาร้า${sideLabel(patient.assaultChestClavicleSides)}`);
    if (patient.assaultChestBack) subs.push(`หลังส่วนบน/สะบัก${sideLabel(patient.assaultChestBackSides)}`);
    parts.push(`หน้าอก/หลังบน: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  if (patient.assaultParentAbdomen) {
    const subs = [];
    if (patient.assaultAbdFront) subs.push(`หน้าท้อง${sideLabel(patient.assaultAbdFrontSides)}`);
    if (patient.assaultAbdFlank) subs.push(`สีข้าง/บั้นเอว${sideLabel(patient.assaultAbdFlankSides)}`);
    if (patient.assaultAbdLowBack) subs.push(`หลังส่วนล่าง${sideLabel(patient.assaultAbdLowBackSides)}`);
    if (patient.assaultAbdButtock) subs.push(`สะโพก/ก้น${sideLabel(patient.assaultAbdButtockSides)}`);
    if (patient.assaultAbdGroinGenitalia) subs.push(`ขาหนีบ/อวัยวะเพศ${sideLabel(patient.assaultAbdGroinGenitaliaSides)}`);
    parts.push(`หน้าท้อง/เอว/ก้น: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  if (patient.assaultParentUpperExtremity) {
    const subs = [];
    if (patient.assaultArmShoulder) subs.push(`หัวไหล่/ต้นแขน${sideLabel(patient.assaultArmShoulderSides)}`);
    if (patient.assaultArmElbowForearm) subs.push(`ข้อศอก/แขนท่อนล่าง${sideLabel(patient.assaultArmElbowForearmSides)}`);
    if (patient.assaultArmWristHand) subs.push(`ข้อมือ/ฝ่ามือ/หลังมือ${sideLabel(patient.assaultArmWristHandSides)}`);
    if (patient.assaultArmFingers) {
      const dStr = fmtDigitsBySide(patient.assaultArmFingersLeftDigits, patient.assaultArmFingersRightDigits);
      subs.push(`นิ้วมือ${dStr}`);
    }
    parts.push(`แขน/มือ (แผลป้องกันตัว): ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  if (patient.assaultParentLowerExtremity) {
    const subs = [];
    if (patient.assaultLegThigh) subs.push(`ต้นขา${sideLabel(patient.assaultLegThighSides)}`);
    if (patient.assaultLegKneeShinCalf) subs.push(`เข่า/หน้าแข้ง/น่อง${sideLabel(patient.assaultLegKneeShinCalfSides)}`);
    if (patient.assaultLegAnkleFoot) subs.push(`ข้อเท้า/เท้า${sideLabel(patient.assaultLegAnkleFootSides)}`);
    if (patient.assaultLegToes) {
      const dStr = fmtDigitsBySide(patient.assaultLegToesLeftDigits, patient.assaultLegToesRightDigits);
      subs.push(`นิ้วเท้า${dStr}`);
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
  if (headSigns.includes('malocclusion_tooth_avulsion')) positives.push('ขากรรไกรค้าง สบฟันไม่สนิท หรือฟันโยกหัก');

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

  if (headSigns.length === 0 && !patient.assaultParentHeadFace) negatives.push('ไม่มีการบาดเจ็บที่ศีรษะ ไม่สลบ ไม่ปวดศีรษะและไม่อาเจียน');
  if (neckSigns.length === 0 && !patient.assaultParentNeck) negatives.push('ไม่ได้ถูกบีบคอ ไม่มีเสียงแหบหรือกลืนลำบาก');
  if (chestSigns.length === 0 && !patient.assaultParentChest) negatives.push('ไม่เจ็บแน่นหน้าอก และหายใจเหนื่อยหอบ');
  if (abdSigns.length === 0 && !patient.assaultParentAbdomen) negatives.push('ไม่ปวดท้อง และปัสสาวะไม่มีเลือดปน');

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

  const tetanusMap = { within_5_years: '< 5 ปี', '5_to_10_years': '5-10 ปี', over_10_years: '> 10 ปี', unknown_or_never: 'ไม่เคย/จำไม่ได้' };
  const tetanusStr = tetanusMap[patient.assaultTetanusHx] || 'ไม่ได้ระบุ';

  return `[Chief Complaint (CC)]
ถูกทำร้ายร่างกาย เป็นมา ${durStr}

[History of Present Illness (HPI)]
• กลไกการถูกทำร้ายและอาวุธ: ${mechStr} เป็นมา ${durStr}
• สถานะเลือดออกภายนอก: ${bleedStr}
• ตำแหน่งที่ได้รับบาดเจ็บ: ${anatomyStr}
• ระดับความปวด (Pain Score): ${pScore}

• Pertinent Positives:
${positives.length > 0 ? positives.map(p => `  - ${p}`).join('\n') : '  - มีอาการปวดบวมฟกช้ำเฉพาะจุดที่ถูกทำร้าย'}

• Pertinent Negatives:
${negatives.length > 0 ? negatives.map(n => `  - ${n}`).join('\n') : '  - ปฏิเสธอาการสลบ แน่นคอ เจ็บหน้าอก หรือปวดท้องรุนแรง'}

[Past Medical History & Medico-Legal Care Profile]
• สถานะประวัติ รพ.ราชบุรี: ${patient.hospRecordStatus === 'complete' ? 'มีประวัติครบถ้วน' : (patient.hospRecordStatus === 'additional' ? 'มีประวัติเดิมและขอเพิ่ม' : 'ให้ข้อมูลใหม่ทั้งหมด')}
• การคัดกรองศูนย์พึ่งได้ (OSCC) / ความรุนแรง: ${osccStr}
• ประวัติยาละลายลิ่มเลือด/โรคเลือดออกง่าย: ${anticoagStr}
• ประวัติวัคซีนบาดทะยัก: ${tetanusStr}
• โรคประจำตัว (U/D): ${Array.isArray(patient.underlying) && patient.underlying.length > 0 ? patient.underlying.join(', ') : 'ปฏิเสธ'}
• ยาประจำตัว: ${patient.currentMeds || 'ไม่มี'} | แพ้ยา: ${patient.drugAllergy || 'ปฏิเสธ'}`;
}

function renderAssaultNarrativeHpi(patient) {
  const durVal = patient.durationVal !== undefined && patient.durationVal !== null ? patient.durationVal : '';
  const durUnitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durStr = durVal ? `${durVal} ${durUnitMap[patient.durationUnit] || 'ชั่วโมง'}` : 'ไม่ระบุระยะเวลา';

  const mechStr = formatAssaultMechanism(patient);
  const anatomyStr = formatAssaultAnatomy(patient);

  let text = `ผู้ป่วยมาด้วยอาการถูกทำร้ายร่างกายโดย${mechStr} เป็นมาประมาณ ${durStr} ก่อนมาโรงพยาบาล ได้รับบาดเจ็บบริเวณ ${anatomyStr}`;

  const headSigns = Array.isArray(patient.assaultHeadSigns) ? patient.assaultHeadSigns : [];
  if (headSigns.includes('loc_amnesia')) text += ` มีประวัติสลบหมดสติชั่วขณะหลังเกิดเหตุ`;

  const neckSigns = Array.isArray(patient.assaultNeckSigns) ? patient.assaultNeckSigns : [];
  if (neckSigns.includes('strangulation_dysphonia_dysphagia')) text += ` มีอาการแน่นคอกลืนลำบากและเสียงแหบ`;

  const chestSigns = Array.isArray(patient.assaultChestSigns) ? patient.assaultChestSigns : [];
  const abdSigns = Array.isArray(patient.assaultAbdSigns) ? patient.assaultAbdSigns : [];
  if (chestSigns.includes('dyspnea_chest_tightness') || abdSigns.includes('severe_abd_pain_distension')) {
    text += ` ร่วมกับมีอาการแน่นหน้าอกหายใจเหนื่อยหรือปวดท้องรุนแรง`;
  }

  return text;
}

function generateAssaultCds(patient) {
  const rfs = evaluateAssaultRedFlags(patient);
  let highestEsi = 4;
  if (rfs.some(r => r.level.includes('ESI 1'))) highestEsi = 1;
  else if (rfs.some(r => r.level.includes('ESI 2'))) highestEsi = 2;
  else if (rfs.some(r => r.level.includes('ESI 3'))) highestEsi = 3;

  const ddx = [];
  const plan = [];
  const setPlan = (d, p) => { ddx.push(d); plan.push(...p); };

  if (rfs.some(r => r.key === 'rf_assault_penetrating_torso_neck_shock')) {
    setPlan('Penetrating Assault (Stab/Gunshot Wound) with Potential Hemorrhagic Shock / Torso Trauma', [
      'ATLS Primary Survey: Airway with C-spine, Breathing, Circulation with Hemorrhage control',
      'เปิด IV line เบอร์ 18 จำนวน 2 เส้น, จอง PRC 2-4 ยูนิต stat, ตรวจ Bedside eFAST ทันที',
      'Film Chest AP portable, Pelvis AP, ปรึกษา Trauma Surgeon ด่วนเพื่อประเมินผ่าตัดฉุกเฉิน'
    ]);
  }

  if (rfs.some(r => r.key === 'rf_assault_strangulation_airway_compromise')) {
    setPlan('Strangulation Injury with Impending Upper Airway Compromise / Laryngeal Trauma', [
      'เฝ้าระวังทางเดินหายใจใกล้ชิด, เตรียมอุปกรณ์ใส่ท่อช่วยหายใจยาก (Difficult Airway Cart / Video Laryngoscope)',
      'ส่งตรวจ Soft tissue neck X-ray (AP/Lateral) หรือ CTA Neck เพื่อ Rule out Laryngotracheal fracture & Carotid dissection',
      'สังเกตอาการทางเดินหายใจที่ ER หรือ Admit เพื่อเฝ้าระวัง Delayed Laryngeal Edema อย่างน้อย 12-24 ชม.'
    ]);
  }

  if (rfs.some(r => r.key === 'rf_assault_tbi_anticoagulant_maxillofacial')) {
    setPlan('Assault Head & Maxillofacial Trauma with Traumatic Brain Injury / Orbital Blowout', [
      'ส่งตรวจ Stat Non-contrast CT Brain (+/- CT Facial bones 3D reconstruction)',
      'ประเมิน Serial Neurological Observation (GCS, Pupillary light reflex) ทุก 1 ชม.',
      'งดใส่สาย NG tube ทางจมูกหากสงสัย Basilar skull fracture, ปรึกษาจักษุแพทย์หากมี Diplopia/Enophthalmos'
    ]);
  }

  if (rfs.some(r => r.key === 'rf_assault_chemical_eye_or_sexual_oscc')) {
    setPlan('Specialized Trauma Care: Chemical Burn / Sexual Assault / Domestic Violence (OSCC Protocol)', [
      'กรณีสารเคมีเข้าตา: ล้างตาด้วย 0.9% NaCl ปริมาณมากทันที (Copious eye irrigation) อย่างน้อย 1,000-2,000 mL',
      'กรณีล่วงละเมิดทางเพศ/ความรุนแรง: เปิดระบบศูนย์พึ่งได้ (OSCC), จัดห้องตรวจมิดชิด, เก็บหลักฐานทางนิติเวช',
      'ส่งตรวจ CBC, Anti-HIV, HBsAg, VDRL, UPT, ให้ยาต้านไวรัส HIV PEP ภายใน 72 ชม. และยาคุมฉุกเฉิน'
    ]);
  }

  if (ddx.length === 0) {
    setPlan('Contusion / Superficial Soft Tissue Injury from Physical Assault without Red Flags', [
      'ทำความสะอาดบาดแผลด้วยน้ำเกลือและสบู่, เย็บปิดแผลฉีกขาดหากมีข้อบ่งชี้',
      'ให้ยาแก้ปวด (Paracetamol หรือ NSAIDs), ประคบเย็นบริเวณฟกช้ำใน 24-48 ชม. แรก',
      'พิจารณาฉีด Tetanus toxoid booster หากเข็มล่าสุดเกิน 5-10 ปี และออกใบชันสูตรบาดแผลตามระเบียบ'
    ]);
  }

  return {
    chiefComplaint: 'physical_assault',
    calculatedEsi: highestEsi,
    redFlags: rfs,
    differentialDiagnosis: ddx,
    suggestedInvestigations: plan.filter(p => p.includes('ตรวจ') || p.includes('CT') || p.includes('Film') || p.includes('eFAST')),
    suggestedManagement: plan.filter(p => !p.includes('ตรวจ') && !p.includes('CT') && !p.includes('Film') && !p.includes('eFAST'))
  };
}

// --- FORM HTML TEMPLATE ---
const PHYSICAL_ASSAULT_FORM_HTML = `
<div id="cc-physical-assault-section" class="space-y-6">

  <!-- First-Aid Guidance Banner -->
  <div class="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs sm:text-sm text-amber-900 flex items-start space-x-3 shadow-xs">
    <i data-lucide="shield-alert" class="w-5 h-5 text-amber-600 shrink-0 mt-0.5"></i>
    <div class="space-y-1">
      <strong class="font-bold block text-amber-950 text-sm sm:text-base">ข้อแนะนำการดูแลตนเองเบื้องต้นระหว่างรอพบแพทย์:</strong>
      <ol class="list-decimal list-inside space-y-0.5 text-amber-800">
        <li><strong>กรณีมีบาดแผลเลือดออก:</strong> ให้ใช้ผ้าสะอาดหรือผ้าก๊อซกดลงบนบาดแผลโดยตรงให้แน่นและต่อเนื่องเพื่อห้ามเลือด</li>
        <li><strong>กรณีถูกสาดสารเคมีหรือของเหลวเข้าตา/ผิวหนัง:</strong> กรุณาแจ้งพยาบาลทันทีเพื่อล้างด้วยน้ำสะอาดหรือน้ำเกลือปริมาณมากโดยด่วน</li>
        <li><strong>ควรงดน้ำและอาหารไว้ก่อน:</strong> หากมีอาการปวดท้อง ปวดศีรษะรุนแรง หรือมีบาดแผลฉกรรจ์ ควรงดน้ำและอาหารชั่วคราวเผื่อกรณีต้องตรวจพิเศษหรือผ่าตัดฉุกเฉิน (ข้อมูลทั้งหมดของท่านจะได้รับการดูแลและบันทึกทางการแพทย์อย่างเป็นความลับ)</li>
      </ol>
    </div>
  </div>

  <!-- CARD 1: ข้อมูลเหตุการณ์ กลไกการถูกทำร้าย และสถานะเลือดออก -->
  <div class="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-5">
    <div class="flex items-center space-x-2 border-b border-slate-100 pb-3">
      <div class="p-2 rounded-xl bg-medical-100 text-medical-700">
        <i data-lucide="shield-alert" class="w-5 h-5"></i>
      </div>
      <div>
        <h3 class="text-sm sm:text-base font-bold text-slate-900">1. ข้อมูลเหตุการณ์ กลไกการถูกทำร้าย และสถานะเลือดออก</h3>
        <p class="text-xs text-slate-500">ระบุลักษณะการถูกทำร้าย อาวุธที่ใช้ และสถานะเลือดออกในขณะนี้</p>
      </div>
    </div>

    <!-- 1.1 เหตุการณ์ถูกทำร้ายร่างกายเกิดขึ้นมานานเท่าใด -->
    <div>
      <label class="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
        1.1 เหตุการณ์ถูกทำร้ายร่างกายเกิดขึ้นมานานเท่าใด:
      </label>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div class="col-span-1 sm:col-span-2">
          <input type="number" id="assaultDurationVal" min="1" max="365" placeholder="ระบุตัวเลข เช่น 30"
            class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white transition">
        </div>
        <div class="col-span-1">
          <select id="assaultDurationUnit"
            class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white transition">
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
    <div>
      <label class="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">1.2 ลักษณะการถูกทำร้าย หรือสิ่งที่ใช้ทำร้าย (เลือกได้หลายข้อตามเหตุการณ์จริง):</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="assaultMechanisms" value="physical_force" onchange="handleAssaultMechanismChange()" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2.5 text-slate-800">ถูกทำร้ายด้วยร่างกาย (เช่น ชก ต่อย ตบ เตะ กระทืบ หรือผลักล้มกระแทก)</span>
        </label>
        <div>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
            <input type="checkbox" name="assaultMechanisms" value="blunt_weapon" onchange="handleAssaultMechanismChange()" class="rounded text-medical-600 h-4 w-4">
            <span class="ml-2.5 text-slate-800">ถูกตีหรือฟาดด้วยของแข็งไม่มีคม (เช่น ท่อนไม้ ท่อนเหล็ก ขวด หมวกกันน็อก เก้าอี้ หรือก้อนหิน)</span>
          </label>
          <div id="assaultBluntDetailContainer" class="hidden mt-2">
            <input type="text" id="assaultBluntDetail" placeholder="พิมพ์ระบุสิ่งของที่ใช้ตี เช่น ขวดแก้ว, ท่อนเหล็ก..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-medical-500">
          </div>
        </div>
        <div>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
            <input type="checkbox" name="assaultMechanisms" value="sharp_weapon" onchange="handleAssaultMechanismChange()" class="rounded text-medical-600 h-4 w-4">
            <span class="ml-2.5 text-slate-800">ถูกแทง ฟัน หรือบาดด้วยของมีคม (เช่น มีด คัตเตอร์ ปากฉลาม เศษแก้ว หรือเหล็กแหลม)</span>
          </label>
          <div id="assaultSharpDetailContainer" class="hidden mt-2">
            <input type="text" id="assaultSharpDetail" placeholder="พิมพ์ระบุชนิดของมีคม เช่น มีดพก, เศษขวดแก้ว..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-medical-500">
          </div>
        </div>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="assaultMechanisms" value="gunshot" onchange="handleAssaultMechanismChange()" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2.5 text-slate-800">ถูกยิงด้วยอาวุธปืน หรือสิ่งเทียมอาวุธปืน</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="assaultMechanisms" value="strangulation_choking" onchange="handleAssaultMechanismChange()" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2.5 text-slate-800">ถูกบีบคอ รัดคอ ล็อกคอ หรือกดทับใบหน้าจนหายใจไม่ออก</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="assaultMechanisms" value="human_bite_scratch" onchange="handleAssaultMechanismChange()" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2.5 text-slate-800">ถูกกัด หรือถูกข่วนโดยบุคคลอื่น</span>
        </label>
        <div>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
            <input type="checkbox" name="assaultMechanisms" value="chemical_thermal_burn" onchange="handleAssaultMechanismChange()" class="rounded text-medical-600 h-4 w-4">
            <span class="ml-2.5 text-slate-800">ถูกสาดด้วยน้ำร้อน น้ำกรด น้ำด่าง สารเคมี หรือถูกพ่นสเปรย์พริกไทย</span>
          </label>
          <div id="assaultChemicalDetailContainer" class="hidden mt-2">
            <input type="text" id="assaultChemicalDetail" placeholder="พิมพ์ระบุสิ่งที่ถูกสาดหรือพ่น เช่น น้ำร้อน, น้ำกรด..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-medical-500">
          </div>
        </div>
        <div>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
            <input type="checkbox" name="assaultMechanisms" value="other_mechanism" onchange="handleAssaultMechanismChange()" class="rounded text-medical-600 h-4 w-4">
            <span class="ml-2.5 text-slate-800">ลักษณะอื่นๆ (พิมพ์ระบุ)</span>
          </label>
          <div id="assaultOtherMechDetailContainer" class="hidden mt-2">
            <input type="text" id="assaultOtherMechDetail" placeholder="พิมพ์ระบุลักษณะการถูกทำร้ายเพิ่มเติม..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-medical-500">
          </div>
        </div>
      </div>
    </div>

    <!-- 1.3 สถานะเลือดออกภายนอก -->
    <div class="pt-3 border-t border-slate-100">
      <label class="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">1.3 มีบาดแผลเปิดหรือเลือดออกภายนอกร่วมด้วยหรือไม่:</label>
      <div class="space-y-2 text-xs sm:text-sm">
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="radio" name="assaultBleedingStatus" value="none_or_contusion" class="text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-800">ไม่มีบาดแผลเปิดหรือเลือดออก (มีเฉพาะอาการปวด บวม หรือรอยฟกช้ำ)</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="radio" name="assaultBleedingStatus" value="abrasion_or_stopped" class="text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-800">มีแผลถลอก รอยข่วน หรือแผลแตกแต่ขณะนี้เลือดหยุดไหลแล้ว</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="radio" name="assaultBleedingStatus" value="active_oozing" class="text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-800">มีบาดแผลและเลือดยังไหลซึมออกมาต่อเนื่อง</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="radio" name="assaultBleedingStatus" value="active_spurting_profuse" class="text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-800">มีบาดแผลเลือดไหลพุ่ง หรือไหลออกมามากผิดปกติ (กดห้ามเลือดแล้วยังชุ่มผ้าอย่างรวดเร็ว)</span>
        </label>
      </div>
    </div>
  </div>

  <!-- CARD 2: ตำแหน่งของร่างกายที่ได้รับบาดเจ็บ (7 ส่วนร่างกาย) -->
  <div class="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-5">
    <div class="flex items-center space-x-2 border-b border-slate-100 pb-3">
      <div class="p-2 rounded-xl bg-medical-100 text-medical-700">
        <i data-lucide="user-check" class="w-5 h-5"></i>
      </div>
      <div>
        <h3 class="text-sm sm:text-base font-bold text-slate-900">2. ตำแหน่งของร่างกายที่ได้รับบาดเจ็บ และอาการสำคัญร่วมด้วย</h3>
        <p class="text-xs text-slate-500">เลือกตำแหน่งร่างกายที่มีบาดแผลหรือปวดบวม และระบุข้างอย่างละเอียด</p>
      </div>
    </div>

    <!-- 2.1 ศีรษะ ใบหน้า ดวงตา -->
    <div class="border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
      <label class="flex items-center cursor-pointer">
        <input type="checkbox" id="assaultParentHeadFace" onchange="toggleAssaultGroup('assaultHeadFaceSubGroup', this.checked)" class="rounded text-medical-600 h-4 w-4">
        <span class="ml-2 text-xs sm:text-sm font-bold text-slate-900">2.1 บาดเจ็บที่ศีรษะ ใบหน้า ดวงตา หู จมูก หรือในช่องปาก</span>
      </label>
      <div id="assaultHeadFaceSubGroup" class="hidden space-y-3 pl-6 pt-2 border-t border-slate-100 text-xs sm:text-sm">
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="assaultHeadScalp" onchange="toggleAssaultGroup('assaultHeadScalpSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">หนังศีรษะ/หน้าผาก/ท้ายทอย</span></label>
            <div id="assaultHeadScalpSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ด้าน:</span>
              <label class="flex items-center"><input type="checkbox" name="assaultHeadScalpSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="assaultHeadScalpSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ขวา</span></label>
              <label class="flex items-center"><input type="checkbox" name="assaultHeadScalpSides" value="center" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ตรงกลาง</span></label>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="assaultHeadFace" onchange="toggleAssaultGroup('assaultHeadFaceSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">ใบหน้า/คิ้ว/โหนกแก้ม/ขากรรไกร/คาง</span></label>
            <div id="assaultHeadFaceSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ด้าน:</span>
              <label class="flex items-center"><input type="checkbox" name="assaultHeadFaceSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="assaultHeadFaceSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ขวา</span></label>
              <label class="flex items-center"><input type="checkbox" name="assaultHeadFaceSides" value="center" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ตรงกลาง</span></label>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="assaultHeadEye" onchange="toggleAssaultGroup('assaultHeadEyeSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">ดวงตา/เปลือกตา/เบ้าตา</span></label>
            <div id="assaultHeadEyeSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ข้าง:</span>
              <label class="flex items-center"><input type="checkbox" name="assaultHeadEyeSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="assaultHeadEyeSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ขวา</span></label>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="assaultHeadEar" onchange="toggleAssaultGroup('assaultHeadEarSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">ใบหู/กกหู</span></label>
            <div id="assaultHeadEarSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ข้าง:</span>
              <label class="flex items-center"><input type="checkbox" name="assaultHeadEarSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="assaultHeadEarSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ขวา</span></label>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="assaultHeadNoseMouth" onchange="toggleAssaultGroup('assaultHeadNoseMouthSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">จมูก/ริมฝีปาก/ฟัน/ในช่องปาก</span></label>
            <div id="assaultHeadNoseMouthSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ด้าน:</span>
              <label class="flex items-center"><input type="checkbox" name="assaultHeadNoseMouthSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="assaultHeadNoseMouthSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ขวา</span></label>
              <label class="flex items-center"><input type="checkbox" name="assaultHeadNoseMouthSides" value="center" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ตรงกลาง</span></label>
            </div>
          </div>
        </div>
        <div class="pt-2 border-t border-slate-100 space-y-1.5">
          <span class="font-semibold text-slate-700 block">อาการสำคัญที่พบร่วมด้วย:</span>
          <label class="flex items-center"><input type="checkbox" name="assaultHeadSigns" value="loc_amnesia" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">มีอาการสลบ หมดสติไปชั่วขณะ หรือจำเหตุการณ์ก่อน/หลังถูกทำร้ายไม่ได้</span></label>
          <label class="flex items-center"><input type="checkbox" name="assaultHeadSigns" value="severe_headache_vomiting" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">ปวดศีรษะรุนแรง มึนงงสับสน ง่วงซึมลง หรือมีอาเจียน</span></label>
          <label class="flex items-center"><input type="checkbox" name="assaultHeadSigns" value="diplopia_blurred_vision" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">ตาพร่ามัว มองเห็นภาพซ้อน เลือดออกในตา หรือตาบวมปิดจนลืมตาไม่ขึ้น</span></label>
          <label class="flex items-center"><input type="checkbox" name="assaultHeadSigns" value="blood_csf_ear_nose_deformity" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">มีเลือดหรือน้ำใสไหลออกจากรูหู หูอื้อได้ยินลดลง หรือดั้งจมูกบวมเบี้ยวผิดรูป</span></label>
          <label class="flex items-center"><input type="checkbox" name="assaultHeadSigns" value="malocclusion_tooth_avulsion" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">อ้าปากไม่ได้ ขากรรไกรค้าง/สบฟันไม่สนิท หรือมีฟันหัก/ฟันโยก</span></label>
        </div>
      </div>
    </div>

    <!-- 2.2 ลำคอ -->
    <div class="border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
      <label class="flex items-center cursor-pointer">
        <input type="checkbox" id="assaultParentNeck" onchange="toggleAssaultGroup('assaultNeckSubGroup', this.checked)" class="rounded text-medical-600 h-4 w-4">
        <span class="ml-2 text-xs sm:text-sm font-bold text-slate-900">2.2 บาดเจ็บที่ลำคอ หรือต้นคอ</span>
      </label>
      <div id="assaultNeckSubGroup" class="hidden space-y-3 pl-6 pt-2 border-t border-slate-100 text-xs sm:text-sm">
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="assaultNeckFront" onchange="toggleAssaultGroup('assaultNeckFrontSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">ลำคอด้านหน้า (ลูกกระเดือก / หลอดลม)</span></label>
            <div id="assaultNeckFrontSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ด้าน:</span>
              <label class="flex items-center"><input type="checkbox" name="assaultNeckFrontSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="assaultNeckFrontSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ขวา</span></label>
              <label class="flex items-center"><input type="checkbox" name="assaultNeckFrontSides" value="center" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ตรงกลาง</span></label>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="assaultNeckSide" onchange="toggleAssaultGroup('assaultNeckSideSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">ลำคอด้านข้าง</span></label>
            <div id="assaultNeckSideSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ข้าง:</span>
              <label class="flex items-center"><input type="checkbox" name="assaultNeckSideSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="assaultNeckSideSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ขวา</span></label>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="assaultNeckBack" onchange="toggleAssaultGroup('assaultNeckBackSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">ต้นคอด้านหลัง (แนวกระดูกต้นคอ)</span></label>
            <div id="assaultNeckBackSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ด้าน:</span>
              <label class="flex items-center"><input type="checkbox" name="assaultNeckBackSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="assaultNeckBackSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ขวา</span></label>
              <label class="flex items-center"><input type="checkbox" name="assaultNeckBackSides" value="center" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ตรงกลาง</span></label>
            </div>
          </div>
        </div>
        <div class="pt-2 border-t border-slate-100 space-y-1.5">
          <span class="font-semibold text-slate-700 block">อาการสำคัญที่พบร่วมด้วย:</span>
          <label class="flex items-center"><input type="checkbox" name="assaultNeckSigns" value="strangulation_dysphonia_dysphagia" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">หายใจลำบาก อึดอัดแน่นคอ กลืนน้ำลายลำบาก เจ็บคอมากเวลาพูด/กลืน หรือเสียงแหบเปลี่ยนไป</span></label>
          <label class="flex items-center"><input type="checkbox" name="assaultNeckSigns" value="penetrating_neck_rapid_swelling" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">มีแผลถูกแทง/ปาดที่ลำคอ หรือบริเวณลำคอบวมโตขึ้นอย่างรวดเร็ว</span></label>
          <label class="flex items-center"><input type="checkbox" name="assaultNeckSigns" value="cspine_tenderness_radicular_deficit" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">ปวดตึงแนวกระดูกต้นคอมาก หรือมีอาการชา/อ่อนแรงร้าวลงไปที่แขนหรือขา</span></label>
        </div>
      </div>
    </div>

    <!-- 2.3 หน้าอก / หลังบน -->
    <div class="border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
      <label class="flex items-center cursor-pointer">
        <input type="checkbox" id="assaultParentChest" onchange="toggleAssaultGroup('assaultChestSubGroup', this.checked)" class="rounded text-medical-600 h-4 w-4">
        <span class="ml-2 text-xs sm:text-sm font-bold text-slate-900">2.3 บาดเจ็บที่หน้าอก ซี่โครง ไหปลาร้า หรือแผ่นหลังส่วนบน/สะบัก</span>
      </label>
      <div id="assaultChestSubGroup" class="hidden space-y-3 pl-6 pt-2 border-t border-slate-100 text-xs sm:text-sm">
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="assaultChestFront" onchange="toggleAssaultGroup('assaultChestFrontSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">หน้าอก/ซี่โครง/ราวนม</span></label>
            <div id="assaultChestFrontSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ด้าน:</span>
              <label class="flex items-center"><input type="checkbox" name="assaultChestFrontSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="assaultChestFrontSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ขวา</span></label>
              <label class="flex items-center"><input type="checkbox" name="assaultChestFrontSides" value="center" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ตรงกลาง</span></label>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="assaultChestClavicle" onchange="toggleAssaultGroup('assaultChestClavicleSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">ไหปลาร้า</span></label>
            <div id="assaultChestClavicleSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ข้าง:</span>
              <label class="flex items-center"><input type="checkbox" name="assaultChestClavicleSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="assaultChestClavicleSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ขวา</span></label>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="assaultChestBack" onchange="toggleAssaultGroup('assaultChestBackSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">แผ่นหลังส่วนบน/สะบัก</span></label>
            <div id="assaultChestBackSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ด้าน:</span>
              <label class="flex items-center"><input type="checkbox" name="assaultChestBackSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="assaultChestBackSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ขวา</span></label>
              <label class="flex items-center"><input type="checkbox" name="assaultChestBackSides" value="center" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ตรงกลาง</span></label>
            </div>
          </div>
        </div>
        <div class="pt-2 border-t border-slate-100 space-y-1.5">
          <span class="font-semibold text-slate-700 block">อาการสำคัญที่พบร่วมด้วย:</span>
          <label class="flex items-center"><input type="checkbox" name="assaultChestSigns" value="dyspnea_chest_tightness" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">หายใจหอบเหนื่อย แน่นหน้าอก หรือรู้สึกหายใจเข้าได้ไม่สุด</span></label>
          <label class="flex items-center"><input type="checkbox" name="assaultChestSigns" value="pleuritic_rib_pain" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">เจ็บแปล๊บที่หน้าอกหรือซี่โครงมากเวลาหายใจเข้าลึกๆ ไอ หรือขยับตัว</span></label>
          <label class="flex items-center"><input type="checkbox" name="assaultChestSigns" value="penetrating_chest_wound" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">มีแผลถูกแทง ถูกฟัน หรือถูกยิง บริเวณหน้าอกหรือแผ่นหลัง</span></label>
        </div>
      </div>
    </div>

    <!-- 2.4 หน้าท้อง / เอว / ก้น -->
    <div class="border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
      <label class="flex items-center cursor-pointer">
        <input type="checkbox" id="assaultParentAbdomen" onchange="toggleAssaultGroup('assaultAbdomenSubGroup', this.checked)" class="rounded text-medical-600 h-4 w-4">
        <span class="ml-2 text-xs sm:text-sm font-bold text-slate-900">2.4 บาดเจ็บที่หน้าท้อง บั้นเอว หลังส่วนล่าง สะโพก หรืออวัยวะเพศ</span>
      </label>
      <div id="assaultAbdomenSubGroup" class="hidden space-y-3 pl-6 pt-2 border-t border-slate-100 text-xs sm:text-sm">
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="assaultAbdFront" onchange="toggleAssaultGroup('assaultAbdFrontSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">หน้าท้อง/ชายโครง</span></label>
            <div id="assaultAbdFrontSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ด้าน:</span>
              <label class="flex items-center"><input type="checkbox" name="assaultAbdFrontSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="assaultAbdFrontSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ขวา</span></label>
              <label class="flex items-center"><input type="checkbox" name="assaultAbdFrontSides" value="center" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ตรงกลาง</span></label>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="assaultAbdFlank" onchange="toggleAssaultGroup('assaultAbdFlankSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">สีข้าง/บั้นเอว</span></label>
            <div id="assaultAbdFlankSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ข้าง:</span>
              <label class="flex items-center"><input type="checkbox" name="assaultAbdFlankSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="assaultAbdFlankSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ขวา</span></label>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="assaultAbdLowBack" onchange="toggleAssaultGroup('assaultAbdLowBackSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">หลังส่วนล่าง</span></label>
            <div id="assaultAbdLowBackSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ด้าน:</span>
              <label class="flex items-center"><input type="checkbox" name="assaultAbdLowBackSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="assaultAbdLowBackSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ขวา</span></label>
              <label class="flex items-center"><input type="checkbox" name="assaultAbdLowBackSides" value="center" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ตรงกลาง</span></label>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="assaultAbdButtock" onchange="toggleAssaultGroup('assaultAbdButtockSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">สะโพก/ก้น</span></label>
            <div id="assaultAbdButtockSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ด้าน:</span>
              <label class="flex items-center"><input type="checkbox" name="assaultAbdButtockSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="assaultAbdButtockSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ขวา</span></label>
              <label class="flex items-center"><input type="checkbox" name="assaultAbdButtockSides" value="center" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ตรงกลาง</span></label>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="assaultAbdGroinGenitalia" onchange="toggleAssaultGroup('assaultAbdGroinGenitaliaSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">ขาหนีบ/อวัยวะเพศ/ทวารหนัก</span></label>
            <div id="assaultAbdGroinGenitaliaSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ด้าน:</span>
              <label class="flex items-center"><input type="checkbox" name="assaultAbdGroinGenitaliaSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="assaultAbdGroinGenitaliaSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ขวา</span></label>
              <label class="flex items-center"><input type="checkbox" name="assaultAbdGroinGenitaliaSides" value="center" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ตรงกลาง</span></label>
            </div>
          </div>
        </div>
        <div class="pt-2 border-t border-slate-100 space-y-1.5">
          <span class="font-semibold text-slate-700 block">อาการสำคัญที่พบร่วมด้วย:</span>
          <label class="flex items-center"><input type="checkbox" name="assaultAbdSigns" value="severe_abd_pain_distension" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">ปวดท้องรุนแรง ท้องอืดตึง หรือกดเจ็บทั่วหน้าท้อง</span></label>
          <label class="flex items-center"><input type="checkbox" name="assaultAbdSigns" value="penetrating_abd_wound" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">มีแผลถูกแทง ถูกฟัน หรือถูกยิง บริเวณหน้าท้อง สีข้าง หรือบั้นเอว</span></label>
          <label class="flex items-center"><input type="checkbox" name="assaultAbdSigns" value="hematuria_anuria" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">ปัสสาวะเป็นเลือด หรือปัสสาวะไม่ออก</span></label>
          <label class="flex items-center"><input type="checkbox" name="assaultAbdSigns" value="genital_trauma_bleeding" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">มีบาดแผล เลือดออก หรือปวดบวมมากบริเวณอวัยวะเพศหรือทวารหนัก</span></label>
        </div>
      </div>
    </div>

    <!-- 2.5 ไหล่ แขน มือ นิ้วมือ (แผลป้องกันตัว) -->
    <div class="border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
      <label class="flex items-center cursor-pointer">
        <input type="checkbox" id="assaultParentUpperExtremity" onchange="toggleAssaultGroup('assaultUpperExtSubGroup', this.checked)" class="rounded text-medical-600 h-4 w-4">
        <span class="ml-2 text-xs sm:text-sm font-bold text-slate-900">2.5 บาดเจ็บที่ไหล่ แขน ข้อศอก ข้อมือ หรือมือ/นิ้วมือ (รวมแผลป้องกันตัว)</span>
      </label>
      <div id="assaultUpperExtSubGroup" class="hidden space-y-3 pl-6 pt-2 border-t border-slate-100 text-xs sm:text-sm">
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="assaultArmShoulder" onchange="toggleAssaultGroup('assaultArmShoulderSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">หัวไหล่/ต้นแขน</span></label>
            <div id="assaultArmShoulderSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ข้าง:</span>
              <label class="flex items-center"><input type="checkbox" name="assaultArmShoulderSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="assaultArmShoulderSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ขวา</span></label>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="assaultArmElbowForearm" onchange="toggleAssaultGroup('assaultArmElbowForearmSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">ข้อศอก/แขนท่อนล่าง</span></label>
            <div id="assaultArmElbowForearmSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ข้าง:</span>
              <label class="flex items-center"><input type="checkbox" name="assaultArmElbowForearmSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="assaultArmElbowForearmSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ขวา</span></label>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="assaultArmWristHand" onchange="toggleAssaultGroup('assaultArmWristHandSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">ข้อมือ/ฝ่ามือ/หลังมือ</span></label>
            <div id="assaultArmWristHandSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ข้าง:</span>
              <label class="flex items-center"><input type="checkbox" name="assaultArmWristHandSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="assaultArmWristHandSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ขวา</span></label>
            </div>
          </div>
          <!-- นิ้วมือแยกแถวซ้ายขวา -->
          <div class="space-y-1">
            <label class="flex items-center"><input type="checkbox" id="assaultArmFingers" onchange="toggleAssaultGroup('assaultArmFingersSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">นิ้วมือ</span></label>
            <div id="assaultArmFingersSidesContainer" class="hidden ml-5 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
              <div class="flex flex-wrap items-center gap-2">
                <span class="font-medium text-slate-600 w-10">ซ้าย:</span>
                <label class="flex items-center"><input type="checkbox" name="assaultArmFingersLeftDigits" value="thumb" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">โป้ง</span></label>
                <label class="flex items-center"><input type="checkbox" name="assaultArmFingersLeftDigits" value="index" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ชี้</span></label>
                <label class="flex items-center"><input type="checkbox" name="assaultArmFingersLeftDigits" value="middle" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">กลาง</span></label>
                <label class="flex items-center"><input type="checkbox" name="assaultArmFingersLeftDigits" value="ring" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">นาง</span></label>
                <label class="flex items-center"><input type="checkbox" name="assaultArmFingersLeftDigits" value="little" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ก้อย</span></label>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <span class="font-medium text-slate-600 w-10">ขวา:</span>
                <label class="flex items-center"><input type="checkbox" name="assaultArmFingersRightDigits" value="thumb" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">โป้ง</span></label>
                <label class="flex items-center"><input type="checkbox" name="assaultArmFingersRightDigits" value="index" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ชี้</span></label>
                <label class="flex items-center"><input type="checkbox" name="assaultArmFingersRightDigits" value="middle" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">กลาง</span></label>
                <label class="flex items-center"><input type="checkbox" name="assaultArmFingersRightDigits" value="ring" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">นาง</span></label>
                <label class="flex items-center"><input type="checkbox" name="assaultArmFingersRightDigits" value="little" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ก้อย</span></label>
              </div>
            </div>
          </div>
        </div>
        <div class="pt-2 border-t border-slate-100 space-y-1.5">
          <span class="font-semibold text-slate-700 block">อาการสำคัญที่พบร่วมด้วย:</span>
          <label class="flex items-center"><input type="checkbox" name="assaultUpperExtSigns" value="arm_deformity_suspected_fracture" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">ไหล่ แขน ข้อมือ หรือนิ้วมือ บวมโต ผิดรูป บิดเบี้ยว หรือสงสัยกระดูกหัก/ข้อหลุด</span></label>
          <label class="flex items-center"><input type="checkbox" name="assaultUpperExtSigns" value="tendon_injury_inability_to_move" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">ขยับข้อมือ กำมือ หรือเหยียด/งอนิ้วมือไม่ได้ตามปกติ (สงสัยเอ็นฉีกขาด)</span></label>
          <label class="flex items-center"><input type="checkbox" name="assaultUpperExtSigns" value="numbness_pallor_cold_finger" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">มีอาการชา ไร้ความรู้สึก หรือปลายนิ้วมือซีดขาว/เย็นเฉียบ</span></label>
        </div>
      </div>
    </div>

    <!-- 2.6 ขา ข้อเท้า เท้า นิ้วเท้า -->
    <div class="border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
      <label class="flex items-center cursor-pointer">
        <input type="checkbox" id="assaultParentLowerExtremity" onchange="toggleAssaultGroup('assaultLowerExtSubGroup', this.checked)" class="rounded text-medical-600 h-4 w-4">
        <span class="ml-2 text-xs sm:text-sm font-bold text-slate-900">2.6 บาดเจ็บที่ต้นขา เข่า หน้าแข้ง น่อง ข้อเท้า หรือเท้า/นิ้วเท้า</span>
      </label>
      <div id="assaultLowerExtSubGroup" class="hidden space-y-3 pl-6 pt-2 border-t border-slate-100 text-xs sm:text-sm">
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="assaultLegThigh" onchange="toggleAssaultGroup('assaultLegThighSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">ต้นขา</span></label>
            <div id="assaultLegThighSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ข้าง:</span>
              <label class="flex items-center"><input type="checkbox" name="assaultLegThighSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="assaultLegThighSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ขวา</span></label>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="assaultLegKneeShinCalf" onchange="toggleAssaultGroup('assaultLegKneeShinCalfSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">เข่า/หน้าแข้ง/น่อง</span></label>
            <div id="assaultLegKneeShinCalfSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ข้าง:</span>
              <label class="flex items-center"><input type="checkbox" name="assaultLegKneeShinCalfSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="assaultLegKneeShinCalfSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ขวา</span></label>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="assaultLegAnkleFoot" onchange="toggleAssaultGroup('assaultLegAnkleFootSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">ข้อเท้า/ส้นเท้า/ฝ่าเท้า/หลังเท้า</span></label>
            <div id="assaultLegAnkleFootSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ข้าง:</span>
              <label class="flex items-center"><input type="checkbox" name="assaultLegAnkleFootSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="assaultLegAnkleFootSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ขวา</span></label>
            </div>
          </div>
          <!-- นิ้วเท้าแยกแถวซ้ายขวา -->
          <div class="space-y-1">
            <label class="flex items-center"><input type="checkbox" id="assaultLegToes" onchange="toggleAssaultGroup('assaultLegToesSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-800">นิ้วเท้า</span></label>
            <div id="assaultLegToesSidesContainer" class="hidden ml-5 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
              <div class="flex flex-wrap items-center gap-2">
                <span class="font-medium text-slate-600 w-10">ซ้าย:</span>
                <label class="flex items-center"><input type="checkbox" name="assaultLegToesLeftDigits" value="thumb" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">โป้ง</span></label>
                <label class="flex items-center"><input type="checkbox" name="assaultLegToesLeftDigits" value="index" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ชี้</span></label>
                <label class="flex items-center"><input type="checkbox" name="assaultLegToesLeftDigits" value="middle" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">กลาง</span></label>
                <label class="flex items-center"><input type="checkbox" name="assaultLegToesLeftDigits" value="ring" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">นาง</span></label>
                <label class="flex items-center"><input type="checkbox" name="assaultLegToesLeftDigits" value="little" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ก้อย</span></label>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <span class="font-medium text-slate-600 w-10">ขวา:</span>
                <label class="flex items-center"><input type="checkbox" name="assaultLegToesRightDigits" value="thumb" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">โป้ง</span></label>
                <label class="flex items-center"><input type="checkbox" name="assaultLegToesRightDigits" value="index" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ชี้</span></label>
                <label class="flex items-center"><input type="checkbox" name="assaultLegToesRightDigits" value="middle" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">กลาง</span></label>
                <label class="flex items-center"><input type="checkbox" name="assaultLegToesRightDigits" value="ring" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">นาง</span></label>
                <label class="flex items-center"><input type="checkbox" name="assaultLegToesRightDigits" value="little" class="rounded text-medical-600 h-3 w-3"><span class="ml-1 text-slate-800">ก้อย</span></label>
              </div>
            </div>
          </div>
        </div>
        <div class="pt-2 border-t border-slate-100 space-y-1.5">
          <span class="font-semibold text-slate-700 block">อาการสำคัญที่พบร่วมด้วย:</span>
          <label class="flex items-center"><input type="checkbox" name="assaultLowerExtSigns" value="leg_deformity_suspected_fracture" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">ขา เข่า หรือข้อเท้า บวมโต ผิดรูป หรือบิดเบี้ยว</span></label>
          <label class="flex items-center"><input type="checkbox" name="assaultLowerExtSigns" value="inability_to_bear_weight" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">เดินหรือยืนลงน้ำหนักที่ขา/เท้าข้างที่เจ็บไม่ได้เลย</span></label>
          <label class="flex items-center"><input type="checkbox" name="assaultLowerExtSigns" value="foot_drop_numbness_pallor" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 text-slate-800">มีอาการชา กระดกข้อเท้าไม่ได้ หรือปลายเท้าซีดขาว/เย็นเฉียบ</span></label>
        </div>
      </div>
    </div>

    <!-- 2.7 ตำแหน่งอื่นๆ -->
    <div class="border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
      <label class="flex items-center cursor-pointer">
        <input type="checkbox" id="assaultParentOther" onchange="toggleAssaultGroup('assaultOtherSubGroup', this.checked)" class="rounded text-medical-600 h-4 w-4">
        <span class="ml-2 text-xs sm:text-sm font-bold text-slate-900">2.7 บาดแผลที่ตำแหน่งอื่นๆ (พิมพ์ระบุ)</span>
      </label>
      <div id="assaultOtherSubGroup" class="hidden pl-6 pt-2 border-t border-slate-100">
        <input type="text" id="assaultOtherLocationDetail" placeholder="ระบุตำแหน่งของร่างกายที่ได้รับบาดเจ็บ เช่น ซอกคอ, ใต้รักแร้..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-medical-500">
      </div>
    </div>
  </div>

  <!-- CARD 3: อาการผิดปกติของร่างกาย และระดับความปวด -->
  <div class="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-5">
    <div class="flex items-center space-x-2 border-b border-slate-100 pb-3">
      <div class="p-2 rounded-xl bg-medical-100 text-medical-700">
        <i data-lucide="activity" class="w-5 h-5"></i>
      </div>
      <div>
        <h3 class="text-sm sm:text-base font-bold text-slate-900">3. อาการผิดปกติของร่างกาย และระดับความปวด</h3>
        <p class="text-xs text-slate-500">คัดกรองภาวะช็อก อาการทางสมอง และระดับความปวด</p>
      </div>
    </div>

    <!-- 3.1 อาการผิดปกติของร่างกาย -->
    <div>
      <label class="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">3.1 อาการผิดปกติของร่างกายที่พบร่วมด้วยในขณะนี้ (เลือกได้หลายข้อหากมีอาการ):</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="assaultSystemicSigns" value="presyncope_dizziness" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-800">หน้ามืด เวียนศีรษะ วูบ หรือรู้สึกเหมือนจะเป็นลม</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="assaultSystemicSigns" value="palpitation_cold_sweat_pallor" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-800">ใจสั่น เหงื่อแตกท่วมตัว ตัวเย็น หรือหน้าซีดปากซีด</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="assaultSystemicSigns" value="suspected_drugged_intoxicated" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-800">รู้สึกมึนงง สะลึมสะลือผิดปกติ หรือจำเหตุการณ์ไม่ได้โดยสงสัยว่าอาจถูกวางยา/ผสมสารในเครื่องดื่ม</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="assaultSystemicSigns" value="no_systemic_signs" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-600">ไม่มีอาการผิดปกติของร่างกายดังกล่าว</span>
        </label>
      </div>
    </div>

    <!-- 3.2 ระดับความปวด Pain Score -->
    <div class="pt-3 border-t border-slate-100">
      <div class="flex items-center justify-between mb-2">
        <label class="text-xs sm:text-sm font-semibold text-slate-800">3.2 ระดับความปวดบริเวณที่ได้รับบาดเจ็บในขณะนี้ (Pain Score 0-10):</label>
        <button type="button" id="assaultPainScoreClearBtn" onclick="clearAssaultPainScore()" class="hidden text-xs text-medical-600 hover:text-medical-700 underline font-medium">ล้างค่า</button>
      </div>
      <div class="space-y-3">
        <input type="range" id="assaultPainScore" min="0" max="10" value="0" step="1" oninput="handleAssaultPainScoreChange(this.value)" onchange="handleAssaultPainScoreChange(this.value)" class="w-full accent-medical-600 cursor-pointer h-2 bg-slate-200 rounded-lg">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs text-slate-500">
          <div id="assaultPainScoreBadge" class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all">
            <span id="assaultPainScoreEmoji">⚪</span>
            <span id="assaultPainScoreText">ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)</span>
          </div>
          <span class="text-[11px] text-slate-400">0 = ไม่ปวดเลย, 10 = ปวดรุนแรงที่สุดในชีวิต</span>
        </div>
      </div>
    </div>
  </div>

  <!-- CARD 4: ข้อมูลเพิ่มเติมเพื่อการดูแล ยา และวัคซีนบาดทะยัก -->
  <div class="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-5">
    <div class="flex items-center space-x-2 border-b border-slate-100 pb-3">
      <div class="p-2 rounded-xl bg-medical-100 text-medical-700">
        <i data-lucide="shield-plus" class="w-5 h-5"></i>
      </div>
      <div>
        <h3 class="text-sm sm:text-base font-bold text-slate-900">4. ข้อมูลเพิ่มเติมเพื่อการดูแล ยาละลายลิ่มเลือด และวัคซีนบาดทะยัก</h3>
        <p class="text-xs text-slate-500">ข้อมูลประวัติเพื่อความปลอดภัยและการดูแลรักษาอย่างเหมาะสม</p>
      </div>
    </div>

    <!-- 4.1 การดูแลพิเศษ / OSCC -->
    <div>
      <label class="block text-xs sm:text-sm font-semibold text-slate-800 mb-1">
        4.1 เหตุการณ์นี้มีการถูกล่วงละเมิดทางเพศ หรือเป็นความรุนแรงจากคนใกล้ชิด หรือคนในครอบครัวด้วยหรือไม่:
      </label>
      <p class="text-[11px] sm:text-xs text-slate-500 mb-2">
        (ข้อมูลส่วนนี้เป็นความลับทางการแพทย์ เพื่อช่วยให้ทีมแพทย์และพยาบาลจัดห้องตรวจที่มิดชิดและให้การดูแลได้อย่างครบถ้วน)
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="radio" name="assaultOsccScreen" value="general_assault" class="text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-800">ไม่มีการถูกล่วงละเมิดทางเพศ (เป็นการทำร้ายร่างกายทั่วไป)</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="radio" name="assaultOsccScreen" value="sexual_assault" class="text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-800">มีการถูกบังคับ ลวนลาม หรือล่วงละเมิดทางเพศร่วมด้วย</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="radio" name="assaultOsccScreen" value="domestic_violence" class="text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-800">ถูกทำร้ายโดยคนในครอบครัว/คู่ครอง และกังวลเรื่องความปลอดภัยในการกลับบ้าน</span>
        </label>
      </div>
    </div>

    <!-- 4.2 ยาละลายลิ่มเลือด -->
    <div class="pt-3 border-t border-slate-100">
      <label class="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">4.2 ประวัติการใช้ยาละลายลิ่มเลือด หรือโรคเลือดหยุดยาก:</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="radio" name="assaultAnticoagulantHx" value="anticoagulant_antiplatelet" class="text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-800">รับประทานยาละลายลิ่มเลือด หรือยาต้านเกล็ดเลือด (เช่น Warfarin, Aspirin, Plavix, DOACs)</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="radio" name="assaultAnticoagulantHx" value="bleeding_disorder" class="text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-800">มีโรคประจำตัวที่ทำให้เลือดออกง่ายหรือหยุดยาก (เช่น โรคตับแข็ง, เกล็ดเลือดต่ำ)</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="radio" name="assaultAnticoagulantHx" value="unknown_regular_meds" class="text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-800">มียาประจำตัวรับประทานอยู่ แต่ไม่ทราบชื่อยาแน่ชัด</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="radio" name="assaultAnticoagulantHx" value="no_anticoagulant" class="text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-600">ไม่ได้ใช้ยากลุ่มนี้ และไม่มีโรคเลือดหยุดยาก</span>
        </label>
      </div>
    </div>

    <!-- 4.3 วัคซีนบาดทะยัก -->
    <div class="pt-3 border-t border-slate-100">
      <label class="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">4.3 ประวัติการฉีดวัคซีนป้องกันโรคบาดทะยัก:</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="radio" name="assaultTetanusHx" value="within_5_years" class="text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-800">เข็มล่าสุดไม่เกิน 5 ปีที่ผ่านมา</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="radio" name="assaultTetanusHx" value="5_to_10_years" class="text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-800">เข็มล่าสุดนานเกิน 5 ปี แต่ไม่เกิน 10 ปี</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="radio" name="assaultTetanusHx" value="over_10_years" class="text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-800">เข็มล่าสุดนานเกิน 10 ปีแล้ว</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="radio" name="assaultTetanusHx" value="unknown_or_never" class="text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-600">ไม่เคยฉีดมาก่อน หรือจำไม่ได้</span>
        </label>
      </div>
    </div>
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
  algorithm: 'physical-assault-protocol',
  sectionDomId: 'cc-physical-assault-section',
  formHtml: PHYSICAL_ASSAULT_FORM_HTML,

  // --- Mounting & Event Listeners Hook ---
  init() {
    clearAssaultPainScore();
  },

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
      hospRecordStatus: ctx.hospRecordStatus || 'unspecified',
      underlying: ctx.underlying || [],
      drugAllergy: ctx.drugAllergy || 'ไม่ได้ระบุ',
      currentMeds: ctx.currentMeds || 'ไม่ได้ระบุ',
      otherSymptomsFree: ctx.otherSymptomsFree || '',
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
      assaultTetanusHx: getRadioValue('assaultTetanusHx')
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
    setCheckedValues('assaultHeadSigns', patient.assaultHeadSigns);

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
    setRadioValue('assaultTetanusHx', patient.assaultTetanusHx);

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
    sec.querySelectorAll('input[type="text"]').forEach(ti => { ti.value = ''; });
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
      'assaultOtherSubGroup'
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

  generateCds(patient) {
    return generateAssaultCds(patient);
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
