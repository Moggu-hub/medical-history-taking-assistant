// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 27_fall_trauma.js
// อาการนำ: พลัดตกหกล้ม / ได้รับบาดเจ็บทางกายภาพ (Falls / Blunt Trauma)
// รองรับ Zero Default Bias, Progressive Disclosure 6 ตำแหน่งร่างกาย,
// Universal Date/Time, Pain Slider Touch State, และ Core Guard TDD 100%
// =========================================================================

// --- Module-scoped State & Helpers ---
let fallPainScoreTouched = false;

function toggleFallGroup(subId, show) {
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

function clearFallPainScore() {
  fallPainScoreTouched = false;
  const slider = document.getElementById('fallPainScore');
  if (slider) slider.value = 0;
  const emojiEl = document.getElementById('fallPainScoreEmoji');
  const textEl = document.getElementById('fallPainScoreText');
  const badgeEl = document.getElementById('fallPainScoreBadge');
  const clearBtn = document.getElementById('fallPainScoreClearBtn');
  if (emojiEl) emojiEl.textContent = '⚪';
  if (textEl) textEl.textContent = 'ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)';
  if (badgeEl) badgeEl.className = 'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all';
  if (clearBtn) clearBtn.classList.add('hidden');
}

function handleFallPainScoreChange(val) {
  fallPainScoreTouched = true;
  const num = parseInt(val, 10);
  const slider = document.getElementById('fallPainScore');
  if (slider) slider.value = num;
  const emojiEl = document.getElementById('fallPainScoreEmoji');
  const textEl = document.getElementById('fallPainScoreText');
  const badgeEl = document.getElementById('fallPainScoreBadge');
  const clearBtn = document.getElementById('fallPainScoreClearBtn');
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
const handleFallPainSliderTouch = handleFallPainScoreChange;

// --- Clinical Decision Support & Evaluation Functions ---
function evaluateFallRedFlags(patient) {
  const rfs = [];
  const vs = patient.vital_signs || {};
  const sbp = typeof vs.sbp === 'number' ? vs.sbp : (parseInt(vs.sbp, 10) || null);
  const pr = typeof vs.pr === 'number' ? vs.pr : (parseInt(vs.pr, 10) || null);
  const spo2 = typeof vs.spo2 === 'number' ? vs.spo2 : (parseInt(vs.spo2, 10) || null);
  const shockIndex = (sbp && pr) ? (pr / sbp) : 0;
  const age = typeof patient.age === 'number' ? patient.age : (parseInt(patient.age, 10) || 0);

  const mechs = Array.isArray(patient.fallMechanisms) ? patient.fallMechanisms : [];
  const heightLevel = patient.fallHeightLevel || '';
  const prodrome = patient.fallProdrome || '';
  const woundStatus = patient.fallWoundStatus || '';
  const antithrombotic = patient.fallAntithrombotic || '';

  const headSigns = Array.isArray(patient.fallHeadSigns) ? patient.fallHeadSigns : [];
  const neckSigns = Array.isArray(patient.fallNeckSigns) ? patient.fallNeckSigns : [];
  const chestSigns = Array.isArray(patient.fallChestSigns) ? patient.fallChestSigns : [];
  const abdSigns = Array.isArray(patient.fallAbdomenSigns) ? patient.fallAbdomenSigns : [];
  const upperSigns = Array.isArray(patient.fallUpperExtSigns) ? patient.fallUpperExtSigns : [];
  const lowerSigns = Array.isArray(patient.fallLowerExtSigns) ? patient.fallLowerExtSigns : [];
  const sysSigns = Array.isArray(patient.fallSystemicSigns) ? patient.fallSystemicSigns : [];

  const hasShock = (sbp !== null && sbp < 90) || (shockIndex >= 0.9) ||
    sysSigns.includes('dizziness_presyncope') || sysSigns.includes('palpitation_cold_sweat') || sysSigns.includes('excessive_thirst_weakness');

  // RED FLAG 1: High-Energy Fall / Hemorrhagic Shock / Severe Blunt Torso Trauma (ESI 1 / 2)
  const isHighEnergy = heightLevel === 'over_3m' || (mechs.includes('height_fall') && heightLevel === '2_to_3m' && hasShock);
  const isBluntTorsoThreat = (patient.fallParentChest && (chestSigns.includes('dyspnea_shortness_of_breath') || (spo2 !== null && spo2 < 92))) ||
    (patient.fallParentAbdomen && (abdSigns.includes('severe_abd_pain_distension') || abdSigns.includes('urinary_retention_hematuria'))) ||
    woundStatus === 'active_spurting';

  if (isHighEnergy || (hasShock && (patient.fallParentChest || patient.fallParentAbdomen || patient.fallParentNeck)) || isBluntTorsoThreat) {
    const t = 'อุบัติเหตุตกจากที่สูงรุนแรง หรือมีภาวะช็อก/สงสัยเลือดออกภายในช่องอก-ช่องท้อง (High-Energy Fall / Internal Hemorrhage / Shock)';
    const d = 'ผู้ป่วยมีประวัติตกจากที่สูง > 3 เมตร, มีภาวะช็อก/สงสัยเลือดออกในช่องอกหรือช่องท้อง หรือมีแผลเลือดพุ่ง เสี่ยงต่อการเสียเลือดเฉียบพลันและภาวะการหายใจล้มเหลว';
    const a = 'ประเมิน ABCDE ตามแนวทาง ATLS, ตรวจ Bedside eFAST, เปิดเส้น IV เบอร์ใหญ่ 2 เส้น, จองเลือด, ส่ง Chest/Pelvis X-ray และปรึกษาศัลยแพทย์ด่วน';
    rfs.push({ key: 'rf_fall_high_energy_shock_internal_bleed', level: (sbp !== null && sbp < 90) || woundStatus === 'active_spurting' || heightLevel === 'over_3m' ? 'ESI 1' : 'ESI 2', textTh: t, title: t, risk: d, detail: d, suggestedAction: a, action: a });
  }

  // RED FLAG 2: Suspected Cervical / Thoracolumbar Spine or Spinal Cord Injury (ESI 1 / 2)
  const hasSpineThreat = (patient.fallParentNeck && (neckSigns.includes('severe_cervical_pain_limited_rom') || neckSigns.includes('radicular_shock_numbness_weakness'))) ||
    (patient.fallParentAbdomen && abdSigns.includes('sciatica_numbness_cauda_equina'));

  if (hasSpineThreat) {
    const t = 'สงสัยการบาดเจ็บกระดูกต้นคอหรือไขสันหลัง (Suspected Cervical / Spinal Cord Injury)';
    const d = 'พบอาการปวดแนวกระดูกต้นคอรุนแรง ขยับคอไม่ได้ หรือมีอาการชา/ไฟช็อต/อ่อนแรงร้าวลงแขนขา หรือสูญเสียการควบคุมการขับถ่าย เสี่ยงต่อภาวะอัมพาตถาวร';
    const a = 'ใส่ Hard Cervical Collar และจัดให้นอนราบบน Long Spinal Board ทันทีด้วยเทคนิค Log-roll, งอข้อ/ดัดคอไม่ได้เด็ดขาด, ตรวจ Motor/Sensory และส่ง Stat CT Spine';
    rfs.push({ key: 'rf_fall_cspine_spinal_cord_injury', level: neckSigns.includes('radicular_shock_numbness_weakness') || abdSigns.includes('sciatica_numbness_cauda_equina') ? 'ESI 1' : 'ESI 2', textTh: t, title: t, risk: d, detail: d, suggestedAction: a, action: a });
  }

  // RED FLAG 3: Head Injury with TBI Warning / Head Trauma on Anticoagulant (ESI 2)
  const isHeadInjured = !!patient.fallParentHeadFace;
  const hasTbiSigns = headSigns.includes('loss_of_consciousness') || headSigns.includes('severe_headache_vomit_drowsy') ||
    headSigns.includes('vision_problem_eye_swelling') || headSigns.includes('csf_leak_ear_nose') || sysSigns.includes('post_fall_seizure');
  const isOnBloodThinner = antithrombotic === 'on_anticoagulant_antiplatelet' || antithrombotic === 'coagulopathy_history';

  if (isHeadInjured && (hasTbiSigns || (isOnBloodThinner && age >= 50) || age >= 65)) {
    const t = 'บาดเจ็บที่ศีรษะร่วมกับอาการทางสมอง หรือศีรษะกระแทกในผู้ที่ใช้ยาละลายลิ่มเลือด (Head Injury with TBI Warning / Anticoagulant Risk)';
    const d = 'พบการบาดเจ็บที่ศีรษะร่วมกับประวัติสลบ/อาเจียน/มึนงงสับสน/น้ำใสออกหูจมูก หรือเป็นผู้สูงอายุที่ใช้ยาละลายลิ่มเลือด เสี่ยงต่อภาวะเลือดออกในกะโหลกศีรษะ (ICH / SDH)';
    const a = 'ประเมิน GCS และรูม่านตาทันที, ส่งตรวจ Stat Non-contrast CT Brain ตามเกณฑ์ Canadian CT Head Rule, ตรวจระดับ PT/INR หากทานยา Warfarin';
    rfs.push({ key: 'rf_fall_tbi_anticoagulant_head', level: 'ESI 2', textTh: t, title: t, risk: d, detail: d, suggestedAction: a, action: a });
  }

  // RED FLAG 4: Fall Secondary to Syncope / Acute Medical Etiology (ESI 2)
  if (prodrome === 'has_prodrome') {
    const t = 'การหกล้มที่มีอาการวูบ หน้ามืด ใจสั่น เจ็บหน้าอก หรืออ่อนแรงนำมาก่อนล้ม (Fall Secondary to Syncope / Medical Etiology)';
    const d = 'ประวัติบ่งชี้ว่าการล้มเกิดจากอาการเจ็บป่วยทางอายุรศาสตร์เฉียบพลัน (เช่น หัวใจเต้นผิดจังหวะ, กล้ามเนื้อหัวใจขาดเลือด, สโตรก หรือน้ำตาลในเลือดต่ำ) ไม่ใช่การสะดุดล้มทั่วไป';
    const a = 'ค้นหาสาเหตุของการวูบล้มควบคู่กับการรักษาการบาดเจ็บ: ทำ 12-Lead ECG ทันที, ตรวจ Stat DTX, ประเมิน FAST Neuro exam และวัดความดันท่านอน/ท่ายืน';
    rfs.push({ key: 'rf_fall_syncopal_medical_cause', level: 'ESI 2', textTh: t, title: t, risk: d, detail: d, suggestedAction: a, action: a });
  }

  // RED FLAG 5: Suspected Hip Fracture / Open Fracture / Neurovascular Compromise (ESI 2)
  const hasOpenFx = upperSigns.includes('open_fracture_arm') || lowerSigns.includes('open_fracture_leg');
  const hasVascularThreat = upperSigns.includes('vascular_cold_pale_hand') || lowerSigns.includes('vascular_cold_pale_foot');
  const hasHipFxSign = patient.fallParentLowerExtremity && lowerSigns.includes('deformity_shortened_external_rotation_leg');
  const hasPelvicThreat = patient.fallParentAbdomen && abdSigns.includes('pelvic_hip_pain_cannot_bear_weight');

  if (hasOpenFx || hasVascularThreat || hasHipFxSign || (hasPelvicThreat && age >= 55)) {
    const t = 'สงสัยกระดูกสะโพกหัก กระดูกหักแบบมีแผลเปิด หรือแขนขาผิดรูปร่วมกับขาดเลือด (Suspected Hip Fracture / Open Fracture / Ischemia)';
    const d = 'พบกระดูกโผล่, ปลายมือปลายเท้าซีดเย็นขาดเลือด, ขาสั้นลงและบิดออกนอก (ลักษณะเฉพาะของกระดูกสะโพกหัก) หรือปวดสะโพกมากจนขยับขาไม่ได้';
    const a = 'ดามเฝือกชั่วคราว (Splinting) โดยตรวจชีพจรส่วนปลายก่อนและหลังดาม, ให้ IV Antibiotics ทันทีหากเป็นแผลเปิด, ส่ง Film X-ray และปรึกษาศัลยแพทย์ออร์โธปิดิกส์ด่วน';
    rfs.push({ key: 'rf_fall_open_fracture_neurovascular_hip', level: 'ESI 2', textTh: t, title: t, risk: d, detail: d, suggestedAction: a, action: a });
  }

  // RED FLAG 6: Suspected Closed Extremity Fracture / Joint Dislocation / Inability to Bear Weight (ESI 3)
  const hasClosedExtremityDeformity = (patient.fallParentUpperExtremity && (upperSigns.includes('deformity_dislocation_arm') || upperSigns.includes('cannot_move_arm_hand') || upperSigns.includes('nerve_numbness_arm'))) ||
    (patient.fallParentLowerExtremity && (lowerSigns.includes('inability_to_bear_weight') || lowerSigns.includes('nerve_numbness_cannot_dorsiflex'))) ||
    (patient.fallParentChest && chestSigns.includes('deformity_crepitus_clavicle_ribs')) ||
    (patient.fallParentHeadFace && headSigns.includes('jaw_malocclusion_broken_tooth'));

  if (hasClosedExtremityDeformity && !rfs.some(r => r.key === 'rf_fall_open_fracture_neurovascular_hip')) {
    const t = 'สงสัยกระดูกแขนขาหัก ข้อเคลื่อนหลุด หรือเดินลงน้ำหนักไม่ได้ (Suspected Closed Fracture / Dislocation)';
    const d = 'ตรวจพบแขนขาผิดรูป บวมตึง ปวดมากจนขยับไม่ได้ หรือยืนลงน้ำหนักไม่ได้ เสี่ยงต่อกระดูกหัก ข้อหลุด หรือเอ็นข้อฉีกขาดรุนแรง';
    const a = 'ดามส่วนที่บาดเจ็บ (Immobilization), ประคบเย็นลดบวม, ให้ยาระงับปวด และส่ง Film X-ray 2 views (AP/Lateral) ตามตำแหน่งที่สงสัย';
    rfs.push({ key: 'rf_fall_extremity_fracture_inability_to_bear_weight', level: 'ESI 3', textTh: t, title: t, risk: d, detail: d, suggestedAction: a, action: a });
  }

  return rfs;
}

// --- Formatters for Output & Notes ---
function formatFallMechanisms(patient) {
  const mechs = Array.isArray(patient.fallMechanisms) ? patient.fallMechanisms : [];
  if (mechs.length === 0) return 'ไม่ได้ระบุกลไกชัดเจน';
  const labels = [];
  if (mechs.includes('ground_level_fall')) {
    labels.push(`ลื่น/สะดุดล้มระดับพื้นราบ${patient.fallMechGroundDetail ? ` (${patient.fallMechGroundDetail})` : ''}`);
  }
  if (mechs.includes('bed_chair_fall')) labels.push('ตกจากเตียง/เก้าอี้');
  if (mechs.includes('stairs_fall')) {
    labels.push(`ตกบันได${patient.fallMechStairsDetail ? ` (${patient.fallMechStairsDetail})` : ''}`);
  }
  if (mechs.includes('height_fall')) {
    const hMap = { under_2m: 'สูง < 2 เมตร', '2_to_3m': 'สูงประมาณ 2–3 เมตร', over_3m: 'สูง > 3 เมตร (High-Energy)' };
    const hStr = hMap[patient.fallHeightLevel] || '';
    labels.push(`พลัดตกจากที่สูง${hStr ? ` [${hStr}]` : ''}${patient.fallMechHeightDetail ? ` (${patient.fallMechHeightDetail})` : ''}`);
  }
  if (mechs.includes('blunt_heavy_impact')) {
    labels.push(`ชนกระแทก/ของหนักทับ${patient.fallMechBluntDetail ? ` (${patient.fallMechBluntDetail})` : ''}`);
  }
  if (mechs.includes('sports_twist')) {
    labels.push(`บาดเจ็บจากการเล่นกีฬา/ข้อพลิกผิดท่า${patient.fallMechSportsDetail ? ` (${patient.fallMechSportsDetail})` : ''}`);
  }
  if (mechs.includes('other_mechanism')) {
    labels.push(`สาเหตุอื่น${patient.fallMechOtherDetail ? ` (${patient.fallMechOtherDetail})` : ''}`);
  }
  return labels.join(', ');
}

function formatFallWoundStatus(patient) {
  const map = {
    no_wound: 'ไม่มีบาดแผลเปิด (เฉพาะปวดบวมฟกช้ำ)',
    abrasion_stopped: 'มีแผลถลอก/แผลแตกแต่เลือดหยุดแล้ว',
    active_oozing: 'มีแผลฉีกขาด เลือดไหลซึมต่อเนื่อง',
    active_spurting: 'มีแผลเลือดไหลพุ่งเป็นจังหวะตามชีพจร (Active Spurting)'
  };
  return map[patient.fallWoundStatus] || 'ไม่ได้ระบุ';
}

function formatFallProdrome(patient) {
  if (patient.fallProdrome === 'has_prodrome') {
    return 'มีอาการวูบ หน้ามืด เวียนศีรษะ ใจสั่น หรืออ่อนแรงนำมาก่อนล้ม (Syncopal Fall)';
  }
  if (patient.fallProdrome === 'no_prodrome') {
    return 'ไม่มีอาการผิดปกตินำมาก่อน (อุบัติเหตุโดยตรง Mechanical Fall)';
  }
  return 'ไม่ได้ระบุ';
}

function formatFallAntithrombotic(patient) {
  const map = {
    on_anticoagulant_antiplatelet: 'รับประทานยาละลายลิ่มเลือด/ต้านเกล็ดเลือด (Warfarin/DOACs/Aspirin)',
    coagulopathy_history: 'มีโรคประจำตัวเลือดออกง่ายหรือหยุดยาก (ตับแข็ง/เกล็ดเลือดต่ำ)',
    unknown_meds: 'มียาประจำตัวแต่ไม่ทราบชื่อยา',
    no_antithrombotic: 'ไม่ได้ใช้ยาละลายลิ่มเลือดและไม่มีโรคเลือดออกง่าย'
  };
  return map[patient.fallAntithrombotic] || 'ไม่ได้ระบุ';
}

function formatFallAnatomy(patient) {
  const parts = [];
  const sideLabel = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return '';
    const thMap = { left: 'ซ้าย', right: 'ขวา', center: 'ตรงกลาง' };
    return ` [${arr.map(s => thMap[s] || s).join(', ')}]`;
  };

  if (patient.fallParentHeadFace) {
    const subs = [];
    if (patient.fallHeadScalp) subs.push(`หนังศีรษะ/ท้ายทอย${sideLabel(patient.fallHeadScalpSides)}`);
    if (patient.fallHeadFace) subs.push(`ใบหน้า/ขากรรไกร${sideLabel(patient.fallHeadFaceSides)}`);
    if (patient.fallHeadEye) subs.push(`ดวงตา/เบ้าตา${sideLabel(patient.fallHeadEyeSides)}`);
    if (patient.fallHeadEar) subs.push(`ใบหู${sideLabel(patient.fallHeadEarSides)}`);
    if (patient.fallHeadNoseMouth) subs.push(`จมูก/ฟัน/ช่องปาก${sideLabel(patient.fallHeadNoseMouthSides)}`);
    parts.push(`ศีรษะ/ใบหน้า: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  if (patient.fallParentNeck) {
    const subs = [];
    if (patient.fallNeckSpine) subs.push(`กระดูกต้นคอ${sideLabel(patient.fallNeckSpineSides)}`);
    if (patient.fallNeckFront) subs.push(`คอด้านหน้า${sideLabel(patient.fallNeckFrontSides)}`);
    if (patient.fallNeckSide) subs.push(`คอด้านข้าง${sideLabel(patient.fallNeckSideSides)}`);
    parts.push(`ลำคอ/ต้นคอ: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  if (patient.fallParentChest) {
    const subs = [];
    if (patient.fallChestRibs) subs.push(`หน้าอก/ซี่โครง${sideLabel(patient.fallChestRibsSides)}`);
    if (patient.fallChestClavicle) subs.push(`ไหปลาร้า${sideLabel(patient.fallChestClavicleSides)}`);
    if (patient.fallChestUpperBack) subs.push(`หลังส่วนบน/สะบัก${sideLabel(patient.fallChestUpperBackSides)}`);
    parts.push(`ทรวงอก/ไหปลาร้า: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  if (patient.fallParentAbdomen) {
    const subs = [];
    if (patient.fallAbdWall) subs.push(`หน้าท้อง${sideLabel(patient.fallAbdWallSides)}`);
    if (patient.fallAbdFlank) subs.push(`สีข้าง/บั้นเอว${sideLabel(patient.fallAbdFlankSides)}`);
    if (patient.fallAbdLowerBack) subs.push(`หลังส่วนล่าง/เอว${sideLabel(patient.fallAbdLowerBackSides)}`);
    if (patient.fallAbdPelvisHip) subs.push(`สะโพก/เชิงกราน/ก้นกบ${sideLabel(patient.fallAbdPelvisHipSides)}`);
    if (patient.fallAbdGenitalia) subs.push(`ขาหนีบ/อวัยวะเพศ${sideLabel(patient.fallAbdGenitaliaSides)}`);
    parts.push(`ช่องท้อง/สะโพก/เชิงกราน: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  if (patient.fallParentUpperExtremity) {
    const subs = [];
    if (patient.fallArmShoulder) subs.push(`หัวไหล่/ต้นแขน${sideLabel(patient.fallArmShoulderSides)}`);
    if (patient.fallArmElbow) subs.push(`ข้อศอก/แขนท่อนล่าง${sideLabel(patient.fallArmElbowSides)}`);
    if (patient.fallArmWrist) subs.push(`ข้อมือ/มือ${sideLabel(patient.fallArmWristSides)}`);
    if (patient.fallArmFingers) subs.push(`นิ้วมือ${sideLabel(patient.fallArmFingersSides)}`);
    parts.push(`แขน/มือ: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  if (patient.fallParentLowerExtremity) {
    const subs = [];
    if (patient.fallLegThigh) subs.push(`ต้นขา${sideLabel(patient.fallLegThighSides)}`);
    if (patient.fallLegKneeShin) subs.push(`เข่า/หน้าแข้ง${sideLabel(patient.fallLegKneeShinSides)}`);
    if (patient.fallLegAnkleFoot) subs.push(`ข้อเท้า/เท้า${sideLabel(patient.fallLegAnkleFootSides)}`);
    if (patient.fallLegToes) subs.push(`นิ้วเท้า${sideLabel(patient.fallLegToesSides)}`);
    parts.push(`ขา/เท้า: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  return parts.length > 0 ? parts.join(' | ') : 'ไม่ได้ระบุตำแหน่งบาดเจ็บชัดเจน';
}

// --- Rapid Note Generator (5 Standardized Sections) ---
function renderFallRapidHpi(patient) {
  const durVal = patient.durationVal;
  const durUnitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durUnit = durUnitMap[patient.durationUnit] || 'ชั่วโมง';
  const durText = durVal ? `${durVal} ${durUnit}` : 'ไม่ระบุระยะเวลา';

  const rfs = evaluateFallRedFlags(patient);
  const mechsText = formatFallMechanisms(patient);
  const prodromeText = formatFallProdrome(patient);
  const woundText = formatFallWoundStatus(patient);
  const anatomyText = formatFallAnatomy(patient);
  const bloodThinnerText = formatFallAntithrombotic(patient);

  const headSigns = Array.isArray(patient.fallHeadSigns) ? patient.fallHeadSigns : [];
  const neckSigns = Array.isArray(patient.fallNeckSigns) ? patient.fallNeckSigns : [];
  const chestSigns = Array.isArray(patient.fallChestSigns) ? patient.fallChestSigns : [];
  const abdSigns = Array.isArray(patient.fallAbdomenSigns) ? patient.fallAbdomenSigns : [];
  const upperSigns = Array.isArray(patient.fallUpperExtSigns) ? patient.fallUpperExtSigns : [];
  const lowerSigns = Array.isArray(patient.fallLowerExtSigns) ? patient.fallLowerExtSigns : [];
  const sysSigns = Array.isArray(patient.fallSystemicSigns) ? patient.fallSystemicSigns : [];

  const positives = [];
  const negatives = [];

  // Positives & Negatives compilation
  if (patient.fallProdrome === 'has_prodrome') positives.push('มีอาการวูบ หน้ามืด หรือใจสั่นนำมาก่อนล้ม');
  else if (patient.fallProdrome === 'no_prodrome') negatives.push('ไม่มีอาการวูบหรือหน้ามืดนำมาก่อน');

  if (patient.fallHeightLevel === 'over_3m') positives.push('ตกจากที่สูง > 3 เมตร (High-Energy Fall)');

  if (headSigns.includes('loss_of_consciousness')) positives.push('มีอาการสลบ/หมดสติชั่วขณะ หรือจำเหตุการณ์ไม่ได้');
  else if (patient.fallParentHeadFace) negatives.push('ไม่มีประวัติสลบหรือหมดสติ');

  if (headSigns.includes('severe_headache_vomit_drowsy')) positives.push('ปวดศีรษะรุนแรง ซึมลง หรือมีอาเจียน');
  if (headSigns.includes('csf_leak_ear_nose')) positives.push('มีเลือดหรือน้ำใสไหลออกจากรูหู/จมูก (สงสัย Basilar skull fracture)');

  if (neckSigns.includes('severe_cervical_pain_limited_rom')) positives.push('ปวดตึงแนวกระดูกต้นคอรุนแรง ขยับคอไม่ได้');
  if (neckSigns.includes('radicular_shock_numbness_weakness')) positives.push('มีอาการชา/ไฟช็อต/อ่อนแรงร้าวลงแขนขา');

  if (chestSigns.includes('dyspnea_shortness_of_breath')) positives.push('หายใจหอบเหนื่อย แน่นหน้าอก');
  if (chestSigns.includes('pleuritic_chest_pain')) positives.push('เจ็บแปล๊บหน้าอกเวลาหายใจเข้าลึก');

  if (abdSigns.includes('severe_abd_pain_distension')) positives.push('ปวดท้องรุนแรง ท้องอืดตึง');
  if (abdSigns.includes('pelvic_hip_pain_cannot_bear_weight')) positives.push('ปวดสะโพก/เชิงกรานมากจนขยับขาไม่ได้');
  if (abdSigns.includes('urinary_retention_hematuria')) positives.push('ปัสสาวะไม่ออกหรือมีเลือดปน');

  if (upperSigns.includes('deformity_dislocation_arm')) positives.push('แขน/ข้อมือ/นิ้วมือ บวมผิดรูปหรือข้อหลุด');
  if (upperSigns.includes('open_fracture_arm')) positives.push('กระดูกแขนหักแบบมีแผลเปิด (Open fracture)');
  if (upperSigns.includes('vascular_cold_pale_hand')) positives.push('ปลายมือซีดเย็นขาดเลือด');

  if (lowerSigns.includes('deformity_shortened_external_rotation_leg')) positives.push('ขาผิดรูป ขาสั้นลงและบิดหมุนออกนอก (สงสัย Hip fracture)');
  if (lowerSigns.includes('inability_to_bear_weight')) positives.push('ยืนหรือเดินลงน้ำหนักไม่ได้เลย');
  if (lowerSigns.includes('open_fracture_leg')) positives.push('กระดูกขาหักแบบมีแผลเปิด (Open fracture)');
  if (lowerSigns.includes('vascular_cold_pale_foot')) positives.push('ปลายเท้าซีดเย็นขาดเลือด');

  if (sysSigns.includes('dizziness_presyncope') || sysSigns.includes('palpitation_cold_sweat')) positives.push('มีอาการหน้ามืด ใจสั่น เหงื่อแตกตัวเย็น (ภาวะช็อก)');

  if (positives.length === 0) positives.push('ไม่มีอาการบาดเจ็บรุนแรงที่ระบุเพิ่มเติม');
  if (negatives.length === 0) negatives.push('ไม่มีอาการทางสมองหรือภาวะช็อก');

  let pScoreStr = 'ไม่ได้ระบุ';
  if (patient.painScore !== null && patient.painScore !== undefined) {
    pScoreStr = `${patient.painScore}/10`;
  }

  let rapid = `[Chief Complaint (CC)]\nพลัดตกหกล้ม / ได้รับบาดเจ็บทางกายภาพ เป็นมา ${durText}\n\n`;
  rapid += `[History of Present Illness (HPI)]\n`;
  rapid += `• กลไกการบาดเจ็บและระยะเวลา: ${mechsText} | เป็นมา ${durText}\n`;
  rapid += `• อาการนำก่อนเกิดเหตุ: ${prodromeText}\n`;
  rapid += `• ตำแหน่งที่ได้รับบาดเจ็บ: ${anatomyText}\n`;
  rapid += `• สถานะบาดแผลภายนอก: ${woundText}\n`;
  rapid += `• ระดับความปวด (Pain Score): ${pScoreStr}\n\n`;

  rapid += `• Pertinent Positives:\n`;
  positives.forEach(p => { rapid += `  - ${p}\n`; });
  rapid += `\n• Pertinent Negatives:\n`;
  negatives.forEach(n => { rapid += `  - ${n}\n`; });

  const udDisplay = (patient.underlying && patient.underlying.length > 0)
    ? (Array.isArray(patient.underlying) ? patient.underlying : [patient.underlying])
        .filter(u => u && !u.includes('ปฏิเสธ') && u !== 'ไม่มี').join(', ') || 'ปฏิเสธ'
    : 'ปฏิเสธ';
  const allergyDisplay = (!patient.drugAllergy || patient.drugAllergy.includes('ปฏิเสธ') || patient.drugAllergy === 'ไม่มี')
    ? 'ปฏิเสธ'
    : patient.drugAllergy;
  const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ' || patient.currentMeds === 'ไม่มี')
    ? 'ไม่มี'
    : patient.currentMeds;
  const docNotes = patient.doctor_notes || {};

  rapid += `\n[Past Medical History & Medications]\n`;
  rapid += `• ประวัติยาละลายลิ่มเลือด/ต้านเกล็ดเลือด: ${bloodThinnerText}\n`;
  if (patient.fallTetanusHx) {
    const tMap = {
      within_5_years: 'ฉีดวัคซีนบาดทะยักภายใน 5 ปี',
      '5_to_10_years': 'ฉีดวัคซีนบาดทะยัก 5-10 ปีที่ผ่านมา',
      more_than_10_years: 'ฉีดวัคซีนบาดทะยักเกิน 10 ปีแล้ว',
      never_or_unsure: 'ไม่เคยฉีด หรือไม่แน่ใจประวัติวัคซีน'
    };
    rapid += `• ประวัติวัคซีนบาดทะยัก: ${tMap[patient.fallTetanusHx] || patient.fallTetanusHx}\n`;
  }
  rapid += `• โรคประจำตัว (U/D): ${udDisplay}\n`;
  rapid += `• ยาประจำตัว (Current Meds): ${medsText}\n`;
  rapid += `• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${allergyDisplay}\n\n`;

  rapid += `[Emergency Risk Assessment (Red Flags)]\n`;
  if (rfs.length > 0) {
    rapid += `🚩 ตรวจพบสัญญาณเตือนฉุกเฉิน (${rfs.length} รายการ):\n`;
    rfs.forEach(r => {
      rapid += `  * [${r.level}] ${r.title}\n`;
    });
  } else {
    rapid += `✓ ไม่พบสัญญาณเตือนวิกฤต ESI 1-2 ในขณะคัดกรอง (Low-Risk Blunt/Fall Trauma)\n`;
  }

  rapid += `\n[Doctor's Clinical Addendum & Exam]\n`;
  rapid += `• บันทึกประวัติเพิ่มเติมหรือแก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}\n`;
  rapid += `• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}\n`;
  rapid += `• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}\n`;
  rapid += `• แผนการรักษาและคำสั่งการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

  return rapid;
}

function renderFallNarrative(patient) {
  const durVal = patient.durationVal;
  const durUnitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durUnit = durUnitMap[patient.durationUnit] || 'ชั่วโมง';
  const durText = durVal ? `${durVal} ${durUnit}` : 'ไม่ระบุเวลา';

  const mechsText = formatFallMechanisms(patient);
  const anatomyText = formatFallAnatomy(patient);
  const prodromeText = formatFallProdrome(patient);
  const woundText = formatFallWoundStatus(patient);

  let pScoreStr = 'ไม่ได้ระบุ';
  if (patient.painScore !== null && patient.painScore !== undefined) {
    pScoreStr = `${patient.painScore}/10`;
  }

  let text = `ผู้ป่วยมาด้วยอาการพลัดตกหกล้ม / ได้รับบาดเจ็บทางกายภาพ เป็นมาประมาณ ${durText} กลไกการเกิดเหตุ: ${mechsText} (${prodromeText}) `;
  text += `ได้รับบาดเจ็บบริเวณ: ${anatomyText} สถานะบาดแผลภายนอก: ${woundText} ระดับความปวด ${pScoreStr} `;

  if (patient.fallAntithrombotic && patient.fallAntithrombotic !== 'no_antithrombotic') {
    text += `ผู้ป่วยมีประวัติ ${formatFallAntithrombotic(patient)} `;
  }

  if (patient.otherSymptomsFree) {
    text += `ข้อมูลเพิ่มเติม: ${patient.otherSymptomsFree}`;
  }

  return text.trim();
}

function renderFallDoctorHpi(patient) {
  return renderFallRapidHpi(patient);
}

function updateFallOutputs(rec) {
  if (!rec) return;
  const rapidText = renderFallRapidHpi(rec);
  const narrativeText = renderFallNarrative(rec);

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

  const redFlags = evaluateFallRedFlags(rec);
  rec.redFlags = redFlags;

  const jsonOutput = {
    encounter: {
      chief_complaint: 'fall_trauma',
      chief_complaint_title_th: 'พลัดตกหกล้ม / ได้รับบาดเจ็บทางกายภาพ',
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
      mechanisms: Array.isArray(rec.fallMechanisms) ? rec.fallMechanisms : [],
      height_level: rec.fallHeightLevel || null,
      prodrome: rec.fallProdrome || null,
      wound_status: rec.fallWoundStatus || null,
      pain_score: rec.painScore,
      antithrombotic: rec.fallAntithrombotic || null,
      tetanus_history: rec.fallTetanusHx || null,
      anatomical_regions: {
        head_face: !!rec.fallParentHeadFace,
        neck: !!rec.fallParentNeck,
        chest: !!rec.fallParentChest,
        abdomen: !!rec.fallParentAbdomen,
        upper_extremity: !!rec.fallParentUpperExtremity,
        lower_extremity: !!rec.fallParentLowerExtremity
      },
      systemic_signs: Array.isArray(rec.fallSystemicSigns) ? rec.fallSystemicSigns : [],
      other_symptoms_free: rec.otherSymptomsFree || ''
    },
    safety_and_red_flags: {
      red_flags_detected: redFlags.map(rf => ({
        key: rf.key,
        level: rf.level,
        title_th: rf.title,
        clinical_risk: rf.detail,
        action: rf.action
      })),
      total_red_flags: redFlags.length
    }
  };
  const jsonEl = document.getElementById('jsonViewer');
  if (jsonEl) jsonEl.textContent = JSON.stringify(jsonOutput, null, 2);
}

function generateFallCds(patient, { rfs, ddxList = [], workupList = [], managementList = [] } = {}) {
  if (!patient) return '';
  const redFlags = rfs || evaluateFallRedFlags(patient);

  if (redFlags.some(r => r.key === 'rf_fall_high_energy_shock_internal_bleed')) {
    ddxList.push('1. 🚨 High-Energy Multiple Trauma with Hemorrhagic Shock');
    ddxList.push('2. Blunt Abdominal Trauma (Liver / Spleen Laceration)');
    ddxList.push('3. Blunt Thoracic Trauma (Hemopneumothorax / Pulmonary Contusion)');
    workupList.push('ATLS Primary Survey (A-B-C-D-E)');
    workupList.push('Bedside eFAST (Focused Assessment with Sonography in Trauma)');
    workupList.push('Portable Chest X-ray & Pelvis AP X-ray');
    workupList.push('CBC, Coagulogram, Type & Screen / Crossmatch, VBG/Lactate');
    managementList.push('2 Large-bore IV lines (16-18G) + Warm crystalloid resuscitation');
    managementList.push('Pelvic binder if suspected unstable pelvic fracture');
    managementList.push('Urgent Surgical / Trauma Consult');
  } else if (redFlags.some(r => r.key === 'rf_fall_cspine_spinal_cord_injury')) {
    ddxList.push('1. 🚨 Cervical Spine Fracture / Subluxation');
    ddxList.push('2. Traumatic Spinal Cord Injury (SCI) / Central Cord Syndrome');
    workupList.push('Stat Non-contrast CT Cervical Spine / Thoracolumbar Spine');
    workupList.push('Complete Neurological Assessment (ASIA Impairment Scale)');
    managementList.push('Rigid Cervical Collar + Full Spinal Motion Restriction (Log-roll)');
    managementList.push('Avoid hypotension (Maintain MAP > 85 mmHg for spinal cord perfusion)');
    managementList.push('Urgent Orthopedic / Neurosurgical Consult');
  } else if (redFlags.some(r => r.key === 'rf_fall_tbi_anticoagulant_head')) {
    ddxList.push('1. 🚨 Traumatic Brain Injury (TBI) / Traumatic Subdural / Epidural Hematoma');
    ddxList.push('2. Traumatic Subarachnoid Hemorrhage (tSAH)');
    workupList.push('Stat Non-contrast CT Brain');
    workupList.push('Coagulation Profile (PT/INR, PTT)');
    managementList.push('Frequent Neuro-vital signs check (every 15-30 min)');
    managementList.push('Anticoagulant reversal protocol if intracranial hemorrhage confirmed');
  } else if (redFlags.some(r => r.key === 'rf_fall_syncopal_medical_cause')) {
    ddxList.push('1. 🚨 Cardiogenic Syncope (Cardiac Arrhythmia / Structural Heart Disease)');
    ddxList.push('2. Acute Coronary Syndrome (ACS) with Secondary Fall');
    ddxList.push('3. Acute Ischemic Stroke with Secondary Fall');
    workupList.push('12-Lead ECG Stat + Cardiac Monitor');
    workupList.push('Stat DTX (Point-of-care Blood Glucose)');
    workupList.push('Troponin-T / I, Electrolytes');
    managementList.push('Continuous cardiac rhythm monitoring');
    managementList.push('Orthostatic vital signs evaluation');
  } else if (redFlags.some(r => r.key === 'rf_fall_open_fracture_neurovascular_hip')) {
    ddxList.push('1. 🚨 Femoral Neck / Intertrochanteric Hip Fracture');
    ddxList.push('2. Open Fracture with Soft Tissue Defect');
    ddxList.push('3. Impending Compartment Syndrome / Acute Limb Ischemia');
    workupList.push('X-ray Pelvis AP & Hip AP/Cross-table Lateral');
    workupList.push('X-ray injured extremity 2 views (AP / Lateral including joints above & below)');
    managementList.push('Early reduction & splinting with neurovascular check pre/post splint');
    managementList.push('IV Antibiotics (Cefazolin) within 1 hour for Open Fracture');
    managementList.push('Multimodal analgesia & Urgent Orthopedic Consult');
  } else {
    ddxList.push('1. Contusion / Sprain / Strain');
    ddxList.push('2. Simple Closed Fracture (Rule-out by X-ray)');
    workupList.push('Plain Radiography (X-ray) of injured area (2 views)');
    managementList.push('RICE protocol (Rest, Ice, Compression, Elevation)');
    managementList.push('Analgesia (Acetaminophen / NSAIDs if no contraindication)');
    managementList.push('Temporary immobilization / Elastic bandage');
  }

  return ddxList.join('\n');
}

// --- FORM HTML TEMPLATE ---
const FALL_TRAUMA_FORM_HTML = `
<div id="cc-fall-trauma-section" class="hidden space-y-6">
  <!-- 💡 ส่วนต้น: ข้อแนะนำการปฏิบัติตัวเบื้องต้นระหว่างรอตรวจ -->
  <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs sm:text-sm text-amber-900 shadow-sm flex items-start space-x-3">
    <div class="text-amber-600 mt-0.5 flex-shrink-0">
      <i data-lucide="info" class="w-5 h-5"></i>
    </div>
    <div class="space-y-1">
      <div class="font-bold text-amber-950 flex items-center gap-1.5">
        <span>ข้อแนะนำการดูแลตนเองเบื้องต้นระหว่างรอพบแพทย์:</span>
      </div>
      <ul class="list-disc pl-4 space-y-1 text-amber-800 text-xs">
        <li><strong>ห้ามขยับ ดึง หรือดัดส่วนที่ปวดบวมผิดรูป:</strong> หากสงสัยกระดูกหัก ข้อหลุด หรือปวดต้นคอและแผ่นหลัง <strong>ให้อยู่นิ่งๆ ในท่าที่สบายที่สุด</strong> ห้ามบีบนวดหรือดัดกระดูกเข้าที่ด้วยตนเองเด็ดขาด</li>
        <li><strong>กรณีมีบาดแผลเลือดออกร่วมด้วย:</strong> ใช้ผ้าสะอาดกดลงบนบาดแผลโดยตรงให้แน่นและต่อเนื่อง</li>
        <li><strong>ควรงดน้ำและอาหารไว้ก่อน:</strong> หากมีอาการปวดรุนแรง แขนขาผิดรูป หรือปวดท้อง/ศีรษะมาก ควรงดน้ำและอาหารชั่วคราว เผื่อกรณีที่แพทย์จำเป็นต้องให้ยาระงับความรู้สึกหรือผ่าตัดฉุกเฉิน</li>
      </ul>
    </div>
  </div>

  <!-- CARD 1: ข้อมูลเหตุการณ์ กลไกการบาดเจ็บ และอาการนำก่อนเกิดเหตุ -->
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
        <i data-lucide="alert-circle" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900">1. ข้อมูลเหตุการณ์ กลไกการบาดเจ็บ และอาการนำก่อนเกิดเหตุ</h2>
        <p class="text-xs text-slate-500">ระยะเวลา ลักษณะเหตุการณ์ ความสูง อาการวูบนำ และสถานะบาดแผล</p>
      </div>
    </div>

    <!-- 1.1 ระยะเวลาที่เกิดเหตุ -->
    <div class="mb-5">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        1.1 เหตุการณ์พลัดตกหกล้มหรือได้รับบาดเจ็บเกิดขึ้นมานานเท่าใด <span class="text-rose-500">*</span>
      </label>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div class="col-span-1 sm:col-span-2">
          <input type="number" id="fallDurationVal" min="1" max="365" placeholder="ระบุตัวเลข เช่น 2"
            class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white transition">
        </div>
        <div class="col-span-1">
          <select id="fallDurationUnit"
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

    <!-- 1.2 ลักษณะเหตุการณ์ หรือกลไกการบาดเจ็บ -->
    <div class="mb-5">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        1.2 ลักษณะเหตุการณ์ หรือกลไกการบาดเจ็บ (เลือกได้หลายข้อ):
      </label>
      <div class="space-y-2">
        <!-- ลื่นล้มระดับพื้นราบ -->
        <div>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
            <input type="checkbox" name="fallMechanisms" value="ground_level_fall"
              onchange="toggleFallGroup('fallMechGroundDetailContainer', this.checked)"
              class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
            <span class="text-xs sm:text-sm text-slate-800">ลื่นล้ม สะดุดล้ม หรือหกล้มในระดับพื้นราบ (เดินหรือยืนอยู่แล้วล้ม)</span>
          </label>
          <div id="fallMechGroundDetailContainer" class="hidden mt-2 pl-6">
            <input type="text" id="fallMechGroundDetail" placeholder="พิมพ์ระบุ เช่น ลื่นในห้องน้ำ, สะดุดขอบฟุตบาท, ก้าวพลาด..."
              class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white">
          </div>
        </div>

        <!-- ตกจากเตียง/เก้าอี้ -->
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="fallMechanisms" value="bed_chair_fall"
            class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">ตกจากเตียง เก้าอี้ โซฟา หรือที่นั่งไม่สูงมาก</span>
        </label>

        <!-- ตกบันได -->
        <div>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
            <input type="checkbox" name="fallMechanisms" value="stairs_fall"
              onchange="toggleFallGroup('fallMechStairsDetailContainer', this.checked)"
              class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
            <span class="text-xs sm:text-sm text-slate-800">ตกบันได หรือก้าวพลาดตกขั้นบันได</span>
          </label>
          <div id="fallMechStairsDetailContainer" class="hidden mt-2 pl-6">
            <input type="text" id="fallMechStairsDetail" placeholder="พิมพ์ระบุ เช่น ตกบันได 5 ขั้น, ก้าวพลาดตกจากชั้นลอย..."
              class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white">
          </div>
        </div>

        <!-- พลัดตกจากที่สูง -->
        <div>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
            <input type="checkbox" name="fallMechanisms" value="height_fall"
              onchange="toggleFallGroup('fallMechHeightContainer', this.checked)"
              class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
            <span class="text-xs sm:text-sm text-slate-800">พลัดตกจากที่สูง (เช่น ต้นไม้, หลังคา, นั่งร้าน, ระเบียง, อาคาร)</span>
          </label>
          <div id="fallMechHeightContainer" class="hidden mt-2 pl-6 space-y-2">
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span class="text-xs font-semibold text-slate-700 block">ระดับความสูงโดยประมาณ:</span>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <label class="flex items-center text-xs text-slate-700 cursor-pointer">
                  <input type="radio" name="fallHeightLevel" value="under_2m" class="mr-1.5 text-medical-600">
                  <span>สูงไม่เกิน 2 เมตร (< 1 ชั้น)</span>
                </label>
                <label class="flex items-center text-xs text-slate-700 cursor-pointer">
                  <input type="radio" name="fallHeightLevel" value="2_to_3m" class="mr-1.5 text-medical-600">
                  <span>สูง 2 – 3 เมตร (~ 1 ชั้น)</span>
                </label>
                <label class="flex items-center text-xs text-slate-700 cursor-pointer">
                  <input type="radio" name="fallHeightLevel" value="over_3m" class="mr-1.5 text-medical-600">
                  <span>สูง > 3 เมตร (ชั้น 2 ขึ้นไป)</span>
                </label>
              </div>
              <input type="text" id="fallMechHeightDetail" placeholder="พิมพ์ระบุสิ่งที่ตกลงมา เช่น ตกต้นไม้สูง 3 เมตร, ตกหลังคา..."
                class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-medical-500">
            </div>
          </div>
        </div>

        <!-- ชนกระแทก/ของหนักทับ -->
        <div>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
            <input type="checkbox" name="fallMechanisms" value="blunt_heavy_impact"
              onchange="toggleFallGroup('fallMechBluntDetailContainer', this.checked)"
              class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
            <span class="text-xs sm:text-sm text-slate-800">ชนกระแทกกับสิ่งของ หรือถูกของแข็ง/ของหนักตกใส่หรือทับ</span>
          </label>
          <div id="fallMechBluntDetailContainer" class="hidden mt-2 pl-6">
            <input type="text" id="fallMechBluntDetail" placeholder="พิมพ์ระบุสิ่งที่มากระแทกหรือทับ เช่น ตู้ล้มทับ, เหล็กหล่นใส่..."
              class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white">
          </div>
        </div>

        <!-- กีฬา/ข้อพลิก -->
        <div>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
            <input type="checkbox" name="fallMechanisms" value="sports_twist"
              onchange="toggleFallGroup('fallMechSportsDetailContainer', this.checked)"
              class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
            <span class="text-xs sm:text-sm text-slate-800">บาดเจ็บจากการเล่นกีฬา ออกกำลังกาย หรือข้อพลิก/แพลง/บิดหมุนผิดท่า</span>
          </label>
          <div id="fallMechSportsDetailContainer" class="hidden mt-2 pl-6">
            <input type="text" id="fallMechSportsDetail" placeholder="พิมพ์ระบุชนิดกีฬาหรือท่าทาง เช่น เตะฟุตบอลข้อเท้าพลิก, กระโดดลงมาเข่าบิด..."
              class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white">
          </div>
        </div>

        <!-- สาเหตุอื่นๆ -->
        <div>
          <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
            <input type="checkbox" name="fallMechanisms" value="other_mechanism"
              onchange="toggleFallGroup('fallMechOtherDetailContainer', this.checked)"
              class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
            <span class="text-xs sm:text-sm text-slate-800">สาเหตุอื่นๆ</span>
          </label>
          <div id="fallMechOtherDetailContainer" class="hidden mt-2 pl-6">
            <input type="text" id="fallMechOtherDetail" placeholder="พิมพ์ระบุสาเหตุ..."
              class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white">
          </div>
        </div>
      </div>
    </div>

    <!-- 1.3 อาการนำก่อนเกิดเหตุ -->
    <div class="mb-5">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        1.3 ก่อนที่จะล้มหรือเกิดอุบัติเหตุ มีอาการผิดปกติของร่างกายนำมาก่อนหรือไม่: <span class="text-rose-500">*</span>
      </label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="fallProdrome" value="no_prodrome" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">ไม่มีอาการผิดปกตินำมาก่อน (เกิดจากลื่น สะดุด หรืออุบัติเหตุโดยตรง)</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="fallProdrome" value="has_prodrome" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">มีอาการวูบ หน้ามืด เวียนศีรษะ ใจสั่น เจ็บหน้าอก หรือแขนขาอ่อนแรงนำมาก่อนแล้วจึงล้ม</span>
        </label>
      </div>
    </div>

    <!-- 1.4 มีบาดแผลฉีกขาดหรือเลือดออกภายนอกร่วมด้วยหรือไม่ -->
    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        1.4 มีบาดแผลฉีกขาดหรือเลือดออกภายนอกร่วมด้วยหรือไม่:
      </label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="fallWoundStatus" value="no_wound" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">ไม่มีบาดแผลเปิดหรือเลือดออก (เฉพาะปวด บวม ฟกช้ำ)</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="fallWoundStatus" value="abrasion_stopped" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">มีแผลถลอก หรือมีแผลแตกแต่เลือดหยุดไหลแล้ว</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="fallWoundStatus" value="active_oozing" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">มีบาดแผลฉีกขาดและเลือดยังไหลซึมต่อเนื่อง</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="fallWoundStatus" value="active_spurting" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 flex-shrink-0">
          <span class="text-xs sm:text-sm font-medium text-slate-900">มีแผลเลือดไหลพุ่งตามชีพจร หรือไหลทะลักมากผิดปกติ</span>
        </label>
      </div>
    </div>
  </div>

  <!-- CARD 2: ตำแหน่งของร่างกายที่ได้รับบาดเจ็บและอาการสำคัญร่วมด้วย (6 Anatomical Regions) -->
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
        <i data-lucide="user-check" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900">2. ตำแหน่งของร่างกายที่ได้รับบาดเจ็บ และอาการสำคัญร่วมด้วย</h2>
        <p class="text-xs text-slate-500">ติ๊กเลือกเฉพาะส่วนของร่างกายที่บาดเจ็บ และระบุด้าน (ซ้าย/ขวา/กลาง) แยกตามจุดได้อย่างอิสระ</p>
      </div>
    </div>

    <div class="space-y-5">
      <!-- 2.1 ศีรษะ ใบหน้า ดวงตา หรือในช่องปาก -->
      <div class="space-y-3">
        <label class="selectable-card flex items-center p-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 hover:border-medical-400 transition cursor-pointer">
          <input type="checkbox" id="fallParentHeadFace" onchange="toggleFallGroup('fallHeadSubGroup', this.checked)"
            class="text-medical-600 focus:ring-medical-500 h-5 w-5 rounded flex-shrink-0">
          <div class="ml-3">
            <span class="text-sm font-bold text-slate-900">2.1 บาดเจ็บที่ศีรษะ ใบหน้า ดวงตา หรือในช่องปาก</span>
            <p class="text-xs text-slate-500">ติ๊กเลือกหากศีรษะกระแทกพื้น มีแผลแตก โนบวม หรือเจ็บใบหน้า/คาง/ฟัน</p>
          </div>
        </label>

        <div id="fallHeadSubGroup" class="hidden pl-4 sm:pl-6 space-y-4 border-l-2 border-medical-200">
          <div>
            <p class="text-xs text-slate-600 font-semibold mb-2">จุดที่ได้รับบาดเจ็บ (เลือกได้หลายจุด พร้อมระบุด้าน):</p>
            <div class="space-y-2">
              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="fallHeadScalp" onchange="toggleFallGroup('fallHeadScalpSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">หนังศีรษะ / หน้าผาก / ท้ายทอย</span>
                </label>
                <div id="fallHeadScalpSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallHeadScalpSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallHeadScalpSides" value="right" class="mr-1"> ขวา</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallHeadScalpSides" value="center" class="mr-1"> ตรงกลาง</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="fallHeadFace" onchange="toggleFallGroup('fallHeadFaceSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">ใบหน้า / คิ้ว / โหนกแก้ม / ขากรรไกร / คาง</span>
                </label>
                <div id="fallHeadFaceSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallHeadFaceSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallHeadFaceSides" value="right" class="mr-1"> ขวา</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallHeadFaceSides" value="center" class="mr-1"> ตรงกลาง</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="fallHeadEye" onchange="toggleFallGroup('fallHeadEyeSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">ดวงตา / เปลือกตา / เบ้าตา</span>
                </label>
                <div id="fallHeadEyeSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallHeadEyeSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallHeadEyeSides" value="right" class="mr-1"> ขวา</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="fallHeadEar" onchange="toggleFallGroup('fallHeadEarSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">ใบหู</span>
                </label>
                <div id="fallHeadEarSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallHeadEarSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallHeadEarSides" value="right" class="mr-1"> ขวา</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="fallHeadNoseMouth" onchange="toggleFallGroup('fallHeadNoseMouthSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">จมูก / ริมฝีปาก / ฟัน / ในช่องปาก</span>
                </label>
                <div id="fallHeadNoseMouthSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallHeadNoseMouthSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallHeadNoseMouthSides" value="right" class="mr-1"> ขวา</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallHeadNoseMouthSides" value="center" class="mr-1"> ตรงกลาง</label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p class="text-xs text-slate-600 font-semibold mb-1">อาการสำคัญที่พบร่วมด้วย (เลือกได้หลายข้อหากมีอาการ):</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="fallHeadSigns" value="loss_of_consciousness" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">มีอาการสลบ หมดสติไปชั่วขณะ หรือจำเหตุการณ์ไม่ได้</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="fallHeadSigns" value="severe_headache_vomit_drowsy" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">ปวดศีรษะรุนแรง ง่วงซึมลง มึนงงสับสน หรือมีอาเจียน</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="fallHeadSigns" value="vision_problem_eye_swelling" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">ตาพร่ามัว มองเห็นภาพซ้อน หรือบวมรอบเบ้าตาจนลืมตาไม่ขึ้น</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="fallHeadSigns" value="csf_leak_ear_nose" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">มีเลือดหรือน้ำใสไหลออกจากรูหู หรือรูจมูก</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="fallHeadSigns" value="jaw_malocclusion_broken_tooth" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">อ้าปากไม่ได้ ขากรรไกรค้าง/สบฟันไม่สนิท หรือมีฟันหัก/โยก</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 2.2 ลำคอ หรือต้นคอ -->
      <div class="space-y-3">
        <label class="selectable-card flex items-center p-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 hover:border-medical-400 transition cursor-pointer">
          <input type="checkbox" id="fallParentNeck" onchange="toggleFallGroup('fallNeckSubGroup', this.checked)"
            class="text-medical-600 focus:ring-medical-500 h-5 w-5 rounded flex-shrink-0">
          <div class="ml-3">
            <span class="text-sm font-bold text-slate-900">2.2 บาดเจ็บที่ลำคอ หรือต้นคอ</span>
            <p class="text-xs text-slate-500">ติ๊กเลือกหากเจ็บแนวกระดูกต้นคอด้านหลัง หรือคอด้านหน้า/ด้านข้าง</p>
          </div>
        </label>

        <div id="fallNeckSubGroup" class="hidden pl-4 sm:pl-6 space-y-4 border-l-2 border-medical-200">
          <div>
            <p class="text-xs text-slate-600 font-semibold mb-2">จุดที่ได้รับบาดเจ็บ (เลือกได้หลายจุด พร้อมระบุด้าน):</p>
            <div class="space-y-2">
              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="fallNeckSpine" onchange="toggleFallGroup('fallNeckSpineSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">ต้นคอด้านหลัง (แนวกระดูกต้นคอ)</span>
                </label>
                <div id="fallNeckSpineSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallNeckSpineSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallNeckSpineSides" value="right" class="mr-1"> ขวา</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallNeckSpineSides" value="center" class="mr-1"> ตรงกลาง</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="fallNeckFront" onchange="toggleFallGroup('fallNeckFrontSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">ลำคอด้านหน้า</span>
                </label>
                <div id="fallNeckFrontSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallNeckFrontSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallNeckFrontSides" value="right" class="mr-1"> ขวา</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallNeckFrontSides" value="center" class="mr-1"> ตรงกลาง</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="fallNeckSide" onchange="toggleFallGroup('fallNeckSideSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">ลำคอด้านข้าง</span>
                </label>
                <div id="fallNeckSideSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallNeckSideSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallNeckSideSides" value="right" class="mr-1"> ขวา</label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p class="text-xs text-slate-600 font-semibold mb-1">อาการสำคัญที่พบร่วมด้วย (เลือกได้หลายข้อหากมีอาการ):</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="fallNeckSigns" value="severe_cervical_pain_limited_rom" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">ปวดตึงแนวกระดูกต้นคอมาก หรือหันคอ/ก้มเงยไม่ได้</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="fallNeckSigns" value="radicular_shock_numbness_weakness" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">มีอาการชา แปล๊บเหมือนไฟช็อต หรืออ่อนแรงร้าวลงแขน/มือ/ขา</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="fallNeckSigns" value="dyspnea_dysphagia_neck_swelling" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">หายใจลำบาก กลืนลำบาก เสียงแหบ หรือบริเวณคอบวมโต</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 2.3 หน้าอก ซี่โครง ไหปลาร้า หรือหลังส่วนบน/สะบัก -->
      <div class="space-y-3">
        <label class="selectable-card flex items-center p-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 hover:border-medical-400 transition cursor-pointer">
          <input type="checkbox" id="fallParentChest" onchange="toggleFallGroup('fallChestSubGroup', this.checked)"
            class="text-medical-600 focus:ring-medical-500 h-5 w-5 rounded flex-shrink-0">
          <div class="ml-3">
            <span class="text-sm font-bold text-slate-900">2.3 บาดเจ็บที่หน้าอก ซี่โครง ไหปลาร้า หรือหลังส่วนบน/สะบัก</span>
            <p class="text-xs text-slate-500">ติ๊กเลือกหากกระแทกหน้าอก ซี่โครง ไหปลาร้า หรือสะบักหลังส่วนบน</p>
          </div>
        </label>

        <div id="fallChestSubGroup" class="hidden pl-4 sm:pl-6 space-y-4 border-l-2 border-medical-200">
          <div>
            <p class="text-xs text-slate-600 font-semibold mb-2">จุดที่ได้รับบาดเจ็บ (เลือกได้หลายจุด พร้อมระบุด้าน):</p>
            <div class="space-y-2">
              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="fallChestRibs" onchange="toggleFallGroup('fallChestRibsSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">หน้าอก / ซี่โครง</span>
                </label>
                <div id="fallChestRibsSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallChestRibsSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallChestRibsSides" value="right" class="mr-1"> ขวา</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallChestRibsSides" value="center" class="mr-1"> ตรงกลาง</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="fallChestClavicle" onchange="toggleFallGroup('fallChestClavicleSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">ไหปลาร้า</span>
                </label>
                <div id="fallChestClavicleSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallChestClavicleSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallChestClavicleSides" value="right" class="mr-1"> ขวา</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="fallChestUpperBack" onchange="toggleFallGroup('fallChestUpperBackSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">หลังส่วนบน / สะบัก</span>
                </label>
                <div id="fallChestUpperBackSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallChestUpperBackSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallChestUpperBackSides" value="right" class="mr-1"> ขวา</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallChestUpperBackSides" value="center" class="mr-1"> ตรงกลาง</label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p class="text-xs text-slate-600 font-semibold mb-1">อาการสำคัญที่พบร่วมด้วย (เลือกได้หลายข้อหากมีอาการ):</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="fallChestSigns" value="dyspnea_shortness_of_breath" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">หายใจหอบเหนื่อย แน่นหน้าอก หรือรู้สึกหายใจไม่อิ่ม</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="fallChestSigns" value="pleuritic_chest_pain" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">เจ็บแปล๊บที่หน้าอกหรือซี่โครงมากเวลาหายใจลึก/ไอ/ขยับตัว</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="fallChestSigns" value="deformity_crepitus_clavicle_ribs" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">กระดูกไหปลาร้าหรือซี่โครงปูดนูน ผิดรูป หรือกดเจ็บมาก</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 2.4 ช่องท้อง บั้นเอว หลังส่วนล่าง สะโพก/เชิงกราน หรือก้นกบ -->
      <div class="space-y-3">
        <label class="selectable-card flex items-center p-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 hover:border-medical-400 transition cursor-pointer">
          <input type="checkbox" id="fallParentAbdomen" onchange="toggleFallGroup('fallAbdomenSubGroup', this.checked)"
            class="text-medical-600 focus:ring-medical-500 h-5 w-5 rounded flex-shrink-0">
          <div class="ml-3">
            <span class="text-sm font-bold text-slate-900">2.4 บาดเจ็บที่ช่องท้อง บั้นเอว หลังส่วนล่าง สะโพก/เชิงกราน หรือก้นกบ</span>
            <p class="text-xs text-slate-500">ติ๊กเลือกหากกระแทกหน้าท้อง เอว หลัง สะโพก หรือก้นกบกระแทกพื้น</p>
          </div>
        </label>

        <div id="fallAbdomenSubGroup" class="hidden pl-4 sm:pl-6 space-y-4 border-l-2 border-medical-200">
          <div>
            <p class="text-xs text-slate-600 font-semibold mb-2">จุดที่ได้รับบาดเจ็บ (เลือกได้หลายจุด พร้อมระบุด้าน):</p>
            <div class="space-y-2">
              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="fallAbdWall" onchange="toggleFallGroup('fallAbdWallSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">หน้าท้อง</span>
                </label>
                <div id="fallAbdWallSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallAbdWallSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallAbdWallSides" value="right" class="mr-1"> ขวา</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallAbdWallSides" value="center" class="mr-1"> ตรงกลาง</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="fallAbdFlank" onchange="toggleFallGroup('fallAbdFlankSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">สีข้าง / บั้นเอว</span>
                </label>
                <div id="fallAbdFlankSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallAbdFlankSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallAbdFlankSides" value="right" class="mr-1"> ขวา</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="fallAbdLowerBack" onchange="toggleFallGroup('fallAbdLowerBackSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">หลังส่วนล่าง (แนวกระดูกสันหลังส่วนเอว)</span>
                </label>
                <div id="fallAbdLowerBackSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallAbdLowerBackSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallAbdLowerBackSides" value="right" class="mr-1"> ขวา</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallAbdLowerBackSides" value="center" class="mr-1"> ตรงกลาง</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="fallAbdPelvisHip" onchange="toggleFallGroup('fallAbdPelvisHipSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">สะโพก / เชิงกราน / ก้นกบ</span>
                </label>
                <div id="fallAbdPelvisHipSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallAbdPelvisHipSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallAbdPelvisHipSides" value="right" class="mr-1"> ขวา</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallAbdPelvisHipSides" value="center" class="mr-1"> ตรงกลาง</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="fallAbdGenitalia" onchange="toggleFallGroup('fallAbdGenitaliaSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">ขาหนีบ / อวัยวะเพศ</span>
                </label>
                <div id="fallAbdGenitaliaSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallAbdGenitaliaSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallAbdGenitaliaSides" value="right" class="mr-1"> ขวา</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallAbdGenitaliaSides" value="center" class="mr-1"> ตรงกลาง</label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p class="text-xs text-slate-600 font-semibold mb-1">อาการสำคัญที่พบร่วมด้วย (เลือกได้หลายข้อหากมีอาการ):</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="fallAbdomenSigns" value="severe_abd_pain_distension" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">ปวดท้องรุนแรง ท้องอืดตึง หรือกดเจ็บมาก</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="fallAbdomenSigns" value="pelvic_hip_pain_cannot_bear_weight" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">ปวดสะโพก/เชิงกรานมากจนขยับขาไม่ได้ หรือยืนลงน้ำหนักไม่ได้</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="fallAbdomenSigns" value="sciatica_numbness_cauda_equina" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">ปวดหลังร้าวลงขา ชาขา/อ่อนแรง หรือกลั้นปัสสาวะ-อุจจาระไม่ได้</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="fallAbdomenSigns" value="urinary_retention_hematuria" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">ปัสสาวะไม่ออก หรือมีเลือดปนในปัสสาวะ</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 2.5 ไหล่ แขน ข้อศอก ข้อมือ หรือมือ/นิ้วมือ -->
      <div class="space-y-3">
        <label class="selectable-card flex items-center p-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 hover:border-medical-400 transition cursor-pointer">
          <input type="checkbox" id="fallParentUpperExtremity" onchange="toggleFallGroup('fallUpperExtSubGroup', this.checked)"
            class="text-medical-600 focus:ring-medical-500 h-5 w-5 rounded flex-shrink-0">
          <div class="ml-3">
            <span class="text-sm font-bold text-slate-900">2.5 บาดเจ็บที่ไหล่ แขน ข้อศอก ข้อมือ หรือมือ/นิ้วมือ</span>
            <p class="text-xs text-slate-500">ติ๊กเลือกหากล้มเอามือยันพื้น ไหล่กระแทก ศอกบวม หรือข้อมือผิดรูป</p>
          </div>
        </label>

        <div id="fallUpperExtSubGroup" class="hidden pl-4 sm:pl-6 space-y-4 border-l-2 border-medical-200">
          <div>
            <p class="text-xs text-slate-600 font-semibold mb-2">จุดที่ได้รับบาดเจ็บ (เลือกได้หลายจุด พร้อมระบุด้าน):</p>
            <div class="space-y-2">
              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="fallArmShoulder" onchange="toggleFallGroup('fallArmShoulderSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">หัวไหล่ / ต้นแขน</span>
                </label>
                <div id="fallArmShoulderSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallArmShoulderSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallArmShoulderSides" value="right" class="mr-1"> ขวา</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="fallArmElbow" onchange="toggleFallGroup('fallArmElbowSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">ข้อศอก / แขนท่อนล่าง</span>
                </label>
                <div id="fallArmElbowSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallArmElbowSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallArmElbowSides" value="right" class="mr-1"> ขวา</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="fallArmWrist" onchange="toggleFallGroup('fallArmWristSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">ข้อมือ / ฝ่ามือ / หลังมือ</span>
                </label>
                <div id="fallArmWristSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallArmWristSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallArmWristSides" value="right" class="mr-1"> ขวา</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="fallArmFingers" onchange="toggleFallGroup('fallArmFingersSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">นิ้วมือ</span>
                </label>
                <div id="fallArmFingersSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallArmFingersSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallArmFingersSides" value="right" class="mr-1"> ขวา</label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p class="text-xs text-slate-600 font-semibold mb-1">อาการสำคัญที่พบร่วมด้วย (เลือกได้หลายข้อหากมีอาการ):</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="fallUpperExtSigns" value="deformity_dislocation_arm" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">แขน ข้อมือ หรือนิ้ว บวมโต ผิดรูป บิดเบี้ยว หรือสงสัยข้อหลุด</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="fallUpperExtSigns" value="cannot_move_arm_hand" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">ปวดมากจนยกแขน ขยับศอก หมุนข้อมือ หรือกำมือไม่ได้</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="fallUpperExtSigns" value="nerve_numbness_arm" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">มีอาการชา หรือไร้ความรู้สึกที่แขน ฝ่ามือ หรือปลายนิ้วมือ</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="fallUpperExtSigns" value="vascular_cold_pale_hand" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">ปลายนิ้วมือซีดขาว เย็นเฉียบ หรือม่วงคล้ำ</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="fallUpperExtSigns" value="open_fracture_arm" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">มีแผลเปิดลึกบริเวณที่กระดูกหัก หรือมองเห็นกระดูกโผล่</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 2.6 ต้นขา เข่า หน้าแข้ง ข้อเท้า หรือเท้า/นิ้วเท้า -->
      <div class="space-y-3">
        <label class="selectable-card flex items-center p-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 hover:border-medical-400 transition cursor-pointer">
          <input type="checkbox" id="fallParentLowerExtremity" onchange="toggleFallGroup('fallLowerExtSubGroup', this.checked)"
            class="text-medical-600 focus:ring-medical-500 h-5 w-5 rounded flex-shrink-0">
          <div class="ml-3">
            <span class="text-sm font-bold text-slate-900">2.6 บาดเจ็บที่ต้นขา เข่า หน้าแข้ง ข้อเท้า หรือเท้า/นิ้วเท้า</span>
            <p class="text-xs text-slate-500">ติ๊กเลือกหากต้นขาบวม เข่าบิดกระแทก ข้อเท้าพลิก หรือยืนลงน้ำหนักไม่ได้</p>
          </div>
        </label>

        <div id="fallLowerExtSubGroup" class="hidden pl-4 sm:pl-6 space-y-4 border-l-2 border-medical-200">
          <div>
            <p class="text-xs text-slate-600 font-semibold mb-2">จุดที่ได้รับบาดเจ็บ (เลือกได้หลายจุด พร้อมระบุด้าน):</p>
            <div class="space-y-2">
              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="fallLegThigh" onchange="toggleFallGroup('fallLegThighSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">ต้นขา</span>
                </label>
                <div id="fallLegThighSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallLegThighSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallLegThighSides" value="right" class="mr-1"> ขวา</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="fallLegKneeShin" onchange="toggleFallGroup('fallLegKneeShinSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">เข่า / หน้าแข้ง / น่อง</span>
                </label>
                <div id="fallLegKneeShinSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallLegKneeShinSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallLegKneeShinSides" value="right" class="mr-1"> ขวา</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="fallLegAnkleFoot" onchange="toggleFallGroup('fallLegAnkleFootSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">ข้อเท้า / ส้นเท้า / ฝ่าเท้า / หลังเท้า</span>
                </label>
                <div id="fallLegAnkleFootSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallLegAnkleFootSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallLegAnkleFootSides" value="right" class="mr-1"> ขวา</label>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border border-slate-200 bg-white">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" id="fallLegToes" onchange="toggleFallGroup('fallLegToesSidesContainer', this.checked)" class="text-medical-600 mr-2 h-4 w-4 rounded">
                  <span class="text-xs sm:text-sm font-medium text-slate-800">นิ้วเท้า</span>
                </label>
                <div id="fallLegToesSidesContainer" class="hidden mt-2 pl-6 flex gap-4 text-xs">
                  <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallLegToesSides" value="left" class="mr-1"> ซ้าย</label> <label class="flex items-center cursor-pointer"><input type="checkbox" name="fallLegToesSides" value="right" class="mr-1"> ขวา</label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p class="text-xs text-slate-600 font-semibold mb-1">อาการสำคัญที่พบร่วมด้วย (เลือกได้หลายข้อหากมีอาการ):</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="fallLowerExtSigns" value="deformity_shortened_external_rotation_leg" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">ขา เข่า ข้อเท้า บวมผิดรูป หรือขาสั้นลง/บิดหมุนออกด้านนอก</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="fallLowerExtSigns" value="inability_to_bear_weight" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">เดินหรือยืนลงน้ำหนักที่ขา/เท้าข้างที่เจ็บไม่ได้เลย</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="fallLowerExtSigns" value="nerve_numbness_cannot_dorsiflex" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">มีอาการชา หรือกระดกข้อเท้า/ขยับนิ้วเท้าไม่ได้ตามปกติ</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="fallLowerExtSigns" value="vascular_cold_pale_foot" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">ปลายเท้าซีดขาว เย็นเฉียบ หรือม่วงคล้ำ</span>
              </label>
              <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
                <input type="checkbox" name="fallLowerExtSigns" value="open_fracture_leg" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
                <span class="text-xs text-slate-800">มีแผลเปิดลึกบริเวณที่กระดูกหัก หรือมองเห็นกระดูกโผล่</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- CARD 3: อาการผิดปกติของร่างกาย และระดับความปวด -->
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
        <i data-lucide="activity" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900">3. อาการผิดปกติของร่างกาย และระดับความปวด</h2>
        <p class="text-xs text-slate-500">ภาวะหน้ามืด เป็นลม เสียเลือดภายใน และแถบประเมินความปวด</p>
      </div>
    </div>

    <!-- 3.1 อาการผิดปกติของร่างกายที่พบร่วมด้วย -->
    <div class="mb-5">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        3.1 อาการผิดปกติของร่างกายที่พบร่วมด้วยในขณะนี้ (เลือกได้หลายข้อหากมีอาการ):
      </label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="fallSystemicSigns" value="dizziness_presyncope" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs text-slate-800">หน้ามืด เวียนศีรษะ วูบ หรือเหมือนจะเป็นลมเวลาขยับตัว/ลุกนั่ง</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="fallSystemicSigns" value="palpitation_cold_sweat" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs text-slate-800">ใจสั่น เหงื่อแตกท่วมตัว ตัวเย็น หรือหน้าซีดปากซีด</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="fallSystemicSigns" value="excessive_thirst_weakness" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs text-slate-800">กระหายน้ำมากผิดปกติ หรืออ่อนเพลียไม่มีแรง</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="fallSystemicSigns" value="post_fall_seizure" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs text-slate-800">มีอาการชักเกร็งหลังเกิดเหตุ</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer col-span-1 sm:col-span-2">
          <input type="checkbox" name="fallSystemicSigns" value="no_systemic_signs" class="text-medical-600 mr-2 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs text-slate-800">ไม่มีอาการผิดปกติของร่างกายดังกล่าว</span>
        </label>
      </div>
    </div>

    <!-- 3.2 Pain Score Slider -->
    <div>
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          3.2 ระดับความปวดในขณะนี้ (Pain Score 0–10):
        </label>
        <div class="flex items-center space-x-2">
          <span id="fallPainScoreBadge" class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all">
            <span id="fallPainScoreEmoji" class="text-base">⚪</span>
            <span id="fallPainScoreText">ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)</span>
          </span>
          <button type="button" id="fallPainScoreClearBtn" onclick="clearFallPainScore()" class="hidden text-xs text-slate-400 hover:text-slate-600 underline">ล้างค่า</button>
        </div>
      </div>
      <div class="pt-2 px-1">
        <input type="range" id="fallPainScore" min="0" max="10" value="0"
          oninput="handleFallPainScoreChange(this.value)"
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
        <p class="text-xs text-slate-500">ยาต้านการแข็งตัวของเลือด ยาต้านเกล็ดเลือด และวัคซีนบาดทะยัก</p>
      </div>
    </div>

    <!-- 4.1 ยาละลายลิ่มเลือด -->
    <div class="mb-5">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        4.1 ประวัติการใช้ยาละลายลิ่มเลือด ยาต้านเกล็ดเลือด หรือโรคเลือดหยุดยาก: <span class="text-rose-500">*</span>
      </label>
      <div class="space-y-2">
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="fallAntithrombotic" value="on_anticoagulant_antiplatelet" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">รับประทานยาละลายลิ่มเลือด หรือยาต้านเกล็ดเลือด (เช่น Warfarin, Aspirin, Plavix/Clopidogrel, DOACs)</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="fallAntithrombotic" value="coagulopathy_history" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">มีโรคประจำตัวที่ทำให้เลือดออกง่ายหรือหยุดยาก (เช่น โรคตับแข็ง, เกล็ดเลือดต่ำ, ฮีโมฟีเลีย)</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="fallAntithrombotic" value="unknown_meds" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">มียาประจำตัวรับประทานอยู่ แต่ไม่ทราบชื่อยาแน่ชัด</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="fallAntithrombotic" value="no_antithrombotic" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">ไม่ได้ใช้ยากลุ่มนี้ และไม่มีโรคเลือดหยุดยาก</span>
        </label>
      </div>
    </div>

    <!-- 4.2 วัคซีนบาดทะยัก -->
    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        4.2 ประวัติการฉีดวัคซีนป้องกันโรคบาดทะยัก (กรณีมีแผลถลอกหรือแผลแตกฉีกขาดร่วมด้วย):
      </label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="fallTetanusHx" value="within_5_years" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">เคยฉีดเข็มล่าสุด ภายในไม่เกิน 5 ปีที่ผ่านมา</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="fallTetanusHx" value="5_to_10_years" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">เคยฉีดเข็มล่าสุด นานเกิน 5 ปี แต่ไม่เกิน 10 ปี</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="fallTetanusHx" value="more_than_10_years" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">ฉีดเข็มล่าสุดนานเกิน 10 ปีแล้ว</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="fallTetanusHx" value="never_or_unsure" class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">ไม่เคยฉีดมาก่อน หรือจำไม่ได้ / ไม่แน่ใจ</span>
        </label>
      </div>
    </div>
  </div>
</div>
`;

// --- MODULE DEFINITION ---
const fallTraumaModule = {
  id: 'fall_trauma',
  recordCc: 'fall_trauma',
  algorithm: 'fall-trauma-protocol',
  sectionDomId: 'cc-fall-trauma-section',
  formHtml: FALL_TRAUMA_FORM_HTML,

  init: function() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  },

  collectIntake: function(ctx = {}) {
    const durVal = parseInt(document.getElementById('fallDurationVal')?.value, 10);
    const durUnit = document.getElementById('fallDurationUnit')?.value || 'hours';

    const getRadio = (name) => {
      const el = document.querySelector(`input[name="${name}"]:checked`);
      return el ? el.value : null;
    };
    const getChecks = (name) => {
      return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(el => el.value);
    };

    const mechanisms = getChecks('fallMechanisms');
    const mechGroundDetail = document.getElementById('fallMechGroundDetail')?.value?.trim() || '';
    const mechStairsDetail = document.getElementById('fallMechStairsDetail')?.value?.trim() || '';
    const heightLevel = getRadio('fallHeightLevel');
    const mechHeightDetail = document.getElementById('fallMechHeightDetail')?.value?.trim() || '';
    const mechBluntDetail = document.getElementById('fallMechBluntDetail')?.value?.trim() || '';
    const mechSportsDetail = document.getElementById('fallMechSportsDetail')?.value?.trim() || '';
    const mechOtherDetail = document.getElementById('fallMechOtherDetail')?.value?.trim() || '';

    const prodrome = getRadio('fallProdrome');
    const woundStatus = getRadio('fallWoundStatus');

    const getSubState = (parentActive, elId, sidesName) => {
      const active = parentActive && (document.getElementById(elId)?.checked || false);
      return { active, sides: active ? getChecks(sidesName) : [] };
    };

    // Head / Face
    const parentHeadFace = document.getElementById('fallParentHeadFace')?.checked || false;
    const sHeadScalp = getSubState(parentHeadFace, 'fallHeadScalp', 'fallHeadScalpSides');
    const sHeadFace = getSubState(parentHeadFace, 'fallHeadFace', 'fallHeadFaceSides');
    const sHeadEye = getSubState(parentHeadFace, 'fallHeadEye', 'fallHeadEyeSides');
    const sHeadEar = getSubState(parentHeadFace, 'fallHeadEar', 'fallHeadEarSides');
    const sHeadNoseMouth = getSubState(parentHeadFace, 'fallHeadNoseMouth', 'fallHeadNoseMouthSides');
    const headSigns = parentHeadFace ? getChecks('fallHeadSigns') : [];

    // Neck
    const parentNeck = document.getElementById('fallParentNeck')?.checked || false;
    const sNeckSpine = getSubState(parentNeck, 'fallNeckSpine', 'fallNeckSpineSides');
    const sNeckFront = getSubState(parentNeck, 'fallNeckFront', 'fallNeckFrontSides');
    const sNeckSide = getSubState(parentNeck, 'fallNeckSide', 'fallNeckSideSides');
    const neckSigns = parentNeck ? getChecks('fallNeckSigns') : [];

    // Chest / Upper Back
    const parentChest = document.getElementById('fallParentChest')?.checked || false;
    const sChestRibs = getSubState(parentChest, 'fallChestRibs', 'fallChestRibsSides');
    const sChestClavicle = getSubState(parentChest, 'fallChestClavicle', 'fallChestClavicleSides');
    const sChestUpperBack = getSubState(parentChest, 'fallChestUpperBack', 'fallChestUpperBackSides');
    const chestSigns = parentChest ? getChecks('fallChestSigns') : [];

    // Abdomen / Pelvis / Lower Back
    const parentAbdomen = document.getElementById('fallParentAbdomen')?.checked || false;
    const sAbdWall = getSubState(parentAbdomen, 'fallAbdWall', 'fallAbdWallSides');
    const sAbdFlank = getSubState(parentAbdomen, 'fallAbdFlank', 'fallAbdFlankSides');
    const sAbdLowerBack = getSubState(parentAbdomen, 'fallAbdLowerBack', 'fallAbdLowerBackSides');
    const sAbdPelvisHip = getSubState(parentAbdomen, 'fallAbdPelvisHip', 'fallAbdPelvisHipSides');
    const sAbdGenitalia = getSubState(parentAbdomen, 'fallAbdGenitalia', 'fallAbdGenitaliaSides');
    const abdSigns = parentAbdomen ? getChecks('fallAbdomenSigns') : [];

    // Upper Extremity
    const parentUpperExt = document.getElementById('fallParentUpperExtremity')?.checked || false;
    const sArmShoulder = getSubState(parentUpperExt, 'fallArmShoulder', 'fallArmShoulderSides');
    const sArmElbow = getSubState(parentUpperExt, 'fallArmElbow', 'fallArmElbowSides');
    const sArmWrist = getSubState(parentUpperExt, 'fallArmWrist', 'fallArmWristSides');
    const sArmFingers = getSubState(parentUpperExt, 'fallArmFingers', 'fallArmFingersSides');
    const upperSigns = parentUpperExt ? getChecks('fallUpperExtSigns') : [];

    // Lower Extremity
    const parentLowerExt = document.getElementById('fallParentLowerExtremity')?.checked || false;
    const sLegThigh = getSubState(parentLowerExt, 'fallLegThigh', 'fallLegThighSides');
    const sLegKneeShin = getSubState(parentLowerExt, 'fallLegKneeShin', 'fallLegKneeShinSides');
    const sLegAnkleFoot = getSubState(parentLowerExt, 'fallLegAnkleFoot', 'fallLegAnkleFootSides');
    const sLegToes = getSubState(parentLowerExt, 'fallLegToes', 'fallLegToesSides');
    const lowerSigns = parentLowerExt ? getChecks('fallLowerExtSigns') : [];

    const systemicSigns = getChecks('fallSystemicSigns');
    const painScore = fallPainScoreTouched ? parseInt(document.getElementById('fallPainScore')?.value || 0, 10) : null;
    const antithrombotic = getRadio('fallAntithrombotic');
    const tetanusHx = getRadio('fallTetanusHx');

    const otherSymptomsFree = document.getElementById('sx_other_free')?.value?.trim() || ctx.otherSymptomsFree || '';

    const rec = {
      id: ctx.recordId || ctx.id,
      queue_number: ctx.queueNumber || ctx.queue_number,
      hn: ctx.randomHn || ctx.hn,
      name: ctx.patientName || ctx.name,
      age: ctx.patientAge !== undefined ? ctx.patientAge : ctx.age,
      gender: ctx.gender,
      chief_complaint: 'fall_trauma',
      chief_complaint_title: 'พลัดตกหกล้ม / ได้รับบาดเจ็บทางกายภาพ',
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

      fallMechanisms: mechanisms,
      fallMechGroundDetail: mechGroundDetail,
      fallMechStairsDetail: mechStairsDetail,
      fallHeightLevel: heightLevel,
      fallMechHeightDetail: mechHeightDetail,
      fallMechBluntDetail: mechBluntDetail,
      fallMechSportsDetail: mechSportsDetail,
      fallMechOtherDetail: mechOtherDetail,
      fallProdrome: prodrome,
      fallWoundStatus: woundStatus,

      fallParentHeadFace: parentHeadFace,
      fallHeadScalp: sHeadScalp.active,
      fallHeadScalpSides: sHeadScalp.sides,
      fallHeadFace: sHeadFace.active,
      fallHeadFaceSides: sHeadFace.sides,
      fallHeadEye: sHeadEye.active,
      fallHeadEyeSides: sHeadEye.sides,
      fallHeadEar: sHeadEar.active,
      fallHeadEarSides: sHeadEar.sides,
      fallHeadNoseMouth: sHeadNoseMouth.active,
      fallHeadNoseMouthSides: sHeadNoseMouth.sides,
      fallHeadSigns: headSigns,

      fallParentNeck: parentNeck,
      fallNeckSpine: sNeckSpine.active,
      fallNeckSpineSides: sNeckSpine.sides,
      fallNeckFront: sNeckFront.active,
      fallNeckFrontSides: sNeckFront.sides,
      fallNeckSide: sNeckSide.active,
      fallNeckSideSides: sNeckSide.sides,
      fallNeckSigns: neckSigns,

      fallParentChest: parentChest,
      fallChestRibs: sChestRibs.active,
      fallChestRibsSides: sChestRibs.sides,
      fallChestClavicle: sChestClavicle.active,
      fallChestClavicleSides: sChestClavicle.sides,
      fallChestUpperBack: sChestUpperBack.active,
      fallChestUpperBackSides: sChestUpperBack.sides,
      fallChestSigns: chestSigns,

      fallParentAbdomen: parentAbdomen,
      fallAbdWall: sAbdWall.active,
      fallAbdWallSides: sAbdWall.sides,
      fallAbdFlank: sAbdFlank.active,
      fallAbdFlankSides: sAbdFlank.sides,
      fallAbdLowerBack: sAbdLowerBack.active,
      fallAbdLowerBackSides: sAbdLowerBack.sides,
      fallAbdPelvisHip: sAbdPelvisHip.active,
      fallAbdPelvisHipSides: sAbdPelvisHip.sides,
      fallAbdGenitalia: sAbdGenitalia.active,
      fallAbdGenitaliaSides: sAbdGenitalia.sides,
      fallAbdomenSigns: abdSigns,

      fallParentUpperExtremity: parentUpperExt,
      fallArmShoulder: sArmShoulder.active,
      fallArmShoulderSides: sArmShoulder.sides,
      fallArmElbow: sArmElbow.active,
      fallArmElbowSides: sArmElbow.sides,
      fallArmWrist: sArmWrist.active,
      fallArmWristSides: sArmWrist.sides,
      fallArmFingers: sArmFingers.active,
      fallArmFingersSides: sArmFingers.sides,
      fallUpperExtSigns: upperSigns,

      fallParentLowerExtremity: parentLowerExt,
      fallLegThigh: sLegThigh.active,
      fallLegThighSides: sLegThigh.sides,
      fallLegKneeShin: sLegKneeShin.active,
      fallLegKneeShinSides: sLegKneeShin.sides,
      fallLegAnkleFoot: sLegAnkleFoot.active,
      fallLegAnkleFootSides: sLegAnkleFoot.sides,
      fallLegToes: sLegToes.active,
      fallLegToesSides: sLegToes.sides,
      fallLowerExtSigns: lowerSigns,

      fallSystemicSigns: systemicSigns,
      painScore: painScore,
      fallAntithrombotic: antithrombotic,
      fallTetanusHx: tetanusHx
    };

    updateFallOutputs(rec);
    return rec;
  },

  collectFormData: function(ctx = {}) {
    return this.collectIntake(ctx);
  },

  hydrateForm: function(data = {}) {
    if (data.durationVal) {
      const valEl = document.getElementById('fallDurationVal');
      if (valEl) valEl.value = data.durationVal;
    }
    const unitEl = document.getElementById('fallDurationUnit');
    if (unitEl) unitEl.value = data.durationUnit || 'hours';

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

    setChecks('fallMechanisms', data.fallMechanisms);
    if (Array.isArray(data.fallMechanisms)) {
      if (data.fallMechanisms.includes('ground_level_fall')) {
        toggleFallGroup('fallMechGroundDetailContainer', true);
        const el = document.getElementById('fallMechGroundDetail');
        if (el) el.value = data.fallMechGroundDetail || '';
      }
      if (data.fallMechanisms.includes('stairs_fall')) {
        toggleFallGroup('fallMechStairsDetailContainer', true);
        const el = document.getElementById('fallMechStairsDetail');
        if (el) el.value = data.fallMechStairsDetail || '';
      }
      if (data.fallMechanisms.includes('height_fall')) {
        toggleFallGroup('fallMechHeightContainer', true);
        setRadio('fallHeightLevel', data.fallHeightLevel);
        const el = document.getElementById('fallMechHeightDetail');
        if (el) el.value = data.fallMechHeightDetail || '';
      }
      if (data.fallMechanisms.includes('blunt_heavy_impact')) {
        toggleFallGroup('fallMechBluntDetailContainer', true);
        const el = document.getElementById('fallMechBluntDetail');
        if (el) el.value = data.fallMechBluntDetail || '';
      }
      if (data.fallMechanisms.includes('sports_twist')) {
        toggleFallGroup('fallMechSportsDetailContainer', true);
        const el = document.getElementById('fallMechSportsDetail');
        if (el) el.value = data.fallMechSportsDetail || '';
      }
      if (data.fallMechanisms.includes('other_mechanism')) {
        toggleFallGroup('fallMechOtherDetailContainer', true);
        const el = document.getElementById('fallMechOtherDetail');
        if (el) el.value = data.fallMechOtherDetail || '';
      }
    }

    setRadio('fallProdrome', data.fallProdrome);
    setRadio('fallWoundStatus', data.fallWoundStatus);

    const hydrateSub = (key, id, cont, sidesName, sidesData) => {
      if (data[key]) {
        setCheckById(id, true);
        toggleFallGroup(cont, true);
        if (sidesName && sidesData) setChecks(sidesName, sidesData);
      }
    };

    if (data.fallParentHeadFace) {
      setCheckById('fallParentHeadFace', true);
      toggleFallGroup('fallHeadSubGroup', true);
      hydrateSub('fallHeadScalp', 'fallHeadScalp', 'fallHeadScalpSidesContainer', 'fallHeadScalpSides', data.fallHeadScalpSides);
      hydrateSub('fallHeadFace', 'fallHeadFace', 'fallHeadFaceSidesContainer', 'fallHeadFaceSides', data.fallHeadFaceSides);
      hydrateSub('fallHeadEye', 'fallHeadEye', 'fallHeadEyeSidesContainer', 'fallHeadEyeSides', data.fallHeadEyeSides);
      hydrateSub('fallHeadEar', 'fallHeadEar', 'fallHeadEarSidesContainer', 'fallHeadEarSides', data.fallHeadEarSides);
      hydrateSub('fallHeadNoseMouth', 'fallHeadNoseMouth', 'fallHeadNoseMouthSidesContainer', 'fallHeadNoseMouthSides', data.fallHeadNoseMouthSides);
      setChecks('fallHeadSigns', data.fallHeadSigns);
    }

    if (data.fallParentNeck) {
      setCheckById('fallParentNeck', true);
      toggleFallGroup('fallNeckSubGroup', true);
      hydrateSub('fallNeckSpine', 'fallNeckSpine', 'fallNeckSpineSidesContainer', 'fallNeckSpineSides', data.fallNeckSpineSides);
      hydrateSub('fallNeckFront', 'fallNeckFront', 'fallNeckFrontSidesContainer', 'fallNeckFrontSides', data.fallNeckFrontSides);
      hydrateSub('fallNeckSide', 'fallNeckSide', 'fallNeckSideSidesContainer', 'fallNeckSideSides', data.fallNeckSideSides);
      setChecks('fallNeckSigns', data.fallNeckSigns);
    }

    if (data.fallParentChest) {
      setCheckById('fallParentChest', true);
      toggleFallGroup('fallChestSubGroup', true);
      hydrateSub('fallChestRibs', 'fallChestRibs', 'fallChestRibsSidesContainer', 'fallChestRibsSides', data.fallChestRibsSides);
      hydrateSub('fallChestClavicle', 'fallChestClavicle', 'fallChestClavicleSidesContainer', 'fallChestClavicleSides', data.fallChestClavicleSides);
      hydrateSub('fallChestUpperBack', 'fallChestUpperBack', 'fallChestUpperBackSidesContainer', 'fallChestUpperBackSides', data.fallChestUpperBackSides);
      setChecks('fallChestSigns', data.fallChestSigns);
    }

    if (data.fallParentAbdomen) {
      setCheckById('fallParentAbdomen', true);
      toggleFallGroup('fallAbdomenSubGroup', true);
      hydrateSub('fallAbdWall', 'fallAbdWall', 'fallAbdWallSidesContainer', 'fallAbdWallSides', data.fallAbdWallSides);
      hydrateSub('fallAbdFlank', 'fallAbdFlank', 'fallAbdFlankSidesContainer', 'fallAbdFlankSides', data.fallAbdFlankSides);
      hydrateSub('fallAbdLowerBack', 'fallAbdLowerBack', 'fallAbdLowerBackSidesContainer', 'fallAbdLowerBackSides', data.fallAbdLowerBackSides);
      hydrateSub('fallAbdPelvisHip', 'fallAbdPelvisHip', 'fallAbdPelvisHipSidesContainer', 'fallAbdPelvisHipSides', data.fallAbdPelvisHipSides);
      hydrateSub('fallAbdGenitalia', 'fallAbdGenitalia', 'fallAbdGenitaliaSidesContainer', 'fallAbdGenitaliaSides', data.fallAbdGenitaliaSides);
      setChecks('fallAbdomenSigns', data.fallAbdomenSigns);
    }

    if (data.fallParentUpperExtremity) {
      setCheckById('fallParentUpperExtremity', true);
      toggleFallGroup('fallUpperExtSubGroup', true);
      hydrateSub('fallArmShoulder', 'fallArmShoulder', 'fallArmShoulderSidesContainer', 'fallArmShoulderSides', data.fallArmShoulderSides);
      hydrateSub('fallArmElbow', 'fallArmElbow', 'fallArmElbowSidesContainer', 'fallArmElbowSides', data.fallArmElbowSides);
      hydrateSub('fallArmWrist', 'fallArmWrist', 'fallArmWristSidesContainer', 'fallArmWristSides', data.fallArmWristSides);
      hydrateSub('fallArmFingers', 'fallArmFingers', 'fallArmFingersSidesContainer', 'fallArmFingersSides', data.fallArmFingersSides);
      setChecks('fallUpperExtSigns', data.fallUpperExtSigns);
    }

    if (data.fallParentLowerExtremity) {
      setCheckById('fallParentLowerExtremity', true);
      toggleFallGroup('fallLowerExtSubGroup', true);
      hydrateSub('fallLegThigh', 'fallLegThigh', 'fallLegThighSidesContainer', 'fallLegThighSides', data.fallLegThighSides);
      hydrateSub('fallLegKneeShin', 'fallLegKneeShin', 'fallLegKneeShinSidesContainer', 'fallLegKneeShinSides', data.fallLegKneeShinSides);
      hydrateSub('fallLegAnkleFoot', 'fallLegAnkleFoot', 'fallLegAnkleFootSidesContainer', 'fallLegAnkleFootSides', data.fallLegAnkleFootSides);
      hydrateSub('fallLegToes', 'fallLegToes', 'fallLegToesSidesContainer', 'fallLegToesSides', data.fallLegToesSides);
      setChecks('fallLowerExtSigns', data.fallLowerExtSigns);
    }

    setChecks('fallSystemicSigns', data.fallSystemicSigns);

    if (data.painScore !== null && data.painScore !== undefined) {
      const slider = document.getElementById('fallPainScore');
      if (slider) slider.value = data.painScore;
      handleFallPainScoreChange(data.painScore);
    } else {
      clearFallPainScore();
    }

    setRadio('fallAntithrombotic', data.fallAntithrombotic);
    setRadio('fallTetanusHx', data.fallTetanusHx);
  },

  clearForm: function() {
    ['fallDurationVal', 'fallMechGroundDetail', 'fallMechStairsDetail', 'fallMechHeightDetail', 'fallMechBluntDetail', 'fallMechSportsDetail', 'fallMechOtherDetail'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const durUnit = document.getElementById('fallDurationUnit');
    if (durUnit) durUnit.value = 'hours';
    clearFallPainScore();

    [
      'fallMechGroundDetailContainer', 'fallMechStairsDetailContainer', 'fallMechHeightContainer', 'fallMechBluntDetailContainer', 'fallMechSportsDetailContainer', 'fallMechOtherDetailContainer',
      'fallHeadSubGroup', 'fallHeadScalpSidesContainer', 'fallHeadFaceSidesContainer', 'fallHeadEyeSidesContainer', 'fallHeadEarSidesContainer', 'fallHeadNoseMouthSidesContainer',
      'fallNeckSubGroup', 'fallNeckSpineSidesContainer', 'fallNeckFrontSidesContainer', 'fallNeckSideSidesContainer',
      'fallChestSubGroup', 'fallChestRibsSidesContainer', 'fallChestClavicleSidesContainer', 'fallChestUpperBackSidesContainer',
      'fallAbdomenSubGroup', 'fallAbdWallSidesContainer', 'fallAbdFlankSidesContainer', 'fallAbdLowerBackSidesContainer', 'fallAbdPelvisHipSidesContainer', 'fallAbdGenitaliaSidesContainer',
      'fallUpperExtSubGroup', 'fallArmShoulderSidesContainer', 'fallArmElbowSidesContainer', 'fallArmWristSidesContainer', 'fallArmFingersSidesContainer',
      'fallLowerExtSubGroup', 'fallLegThighSidesContainer', 'fallLegKneeShinSidesContainer', 'fallLegAnkleFootSidesContainer', 'fallLegToesSidesContainer'
    ].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });

    const radios = document.querySelectorAll('#cc-fall-trauma-section input[type="radio"]');
    radios.forEach(r => { r.checked = false; });

    const checks = document.querySelectorAll('#cc-fall-trauma-section input[type="checkbox"]');
    checks.forEach(c => { c.checked = false; });
  },

  isRedFlag: function(patient) {
    const rfs = evaluateFallRedFlags(patient);
    return rfs.length > 0;
  },

  evaluateRedFlags: evaluateFallRedFlags,
  updateOutputs: updateFallOutputs,
  renderRapidHpi: renderFallRapidHpi,
  renderNarrative: renderFallNarrative,
  renderDoctorHpi: renderFallDoctorHpi,
  generateCds: generateFallCds,

  // --- Seed Patients Registry ---
  seedPatients: [
    // Case 1: Construction worker fall from roof 4m with spinal cord injury & shock (ESI 1)
    {
      id: 'case-fall-01', queue_number: 'E1-107', hn: '7890601',
      name: 'นายวิชัย ช่างก่อสร้างตกหลังคาช็อกและขาสองข้างชาขยับไม่ได้', age: 42, gender: 'ชาย',
      chief_complaint: 'fall_trauma', chief_complaint_title: 'พลัดตกหกล้ม / ได้รับบาดเจ็บทางกายภาพ',
      timestamp: '2026-11-06T08:00:00.000Z', status: 'waiting',
      durationVal: 40, durationUnit: 'minutes', hospRecordStatus: 'self',
      underlying: [], drugAllergy: 'ปฏิเสธ', currentMeds: 'ไม่มี',
      otherSymptomsFree: 'พลัดตกจากหลังคาบ้านเดี่ยวชั้น 2 สูงประมาณ 4 เมตร กระแทกพื้นปูน ปวดต้นคอและแผ่นหลังมาก ขาสองข้างชาและยกไม่ขึ้น แน่นหน้าอก หายใจหอบเหนื่อย ปวดท้องตึง หน้ามืดเหงื่อแตกตัวเย็น',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.5, sbp: 90, dbp: 56, bp: '90/56', pr: 118, rr: 26, spo2: 93 },
      esi_level: 1,
      fallMechanisms: ['height_fall'], fallHeightLevel: 'over_3m', fallMechHeightDetail: 'ตกจากหลังคาบ้าน 4 เมตร',
      fallProdrome: 'no_prodrome', fallWoundStatus: 'abrasion_stopped',
      fallParentHeadFace: false,
      fallParentNeck: true, fallNeckSpine: true, fallNeckSpineSides: ['center'], fallNeckFront: false, fallNeckSide: false,
      fallNeckSigns: ['severe_cervical_pain_limited_rom', 'radicular_shock_numbness_weakness'],
      fallParentChest: true, fallChestRibs: true, fallChestRibsSides: ['left'], fallChestClavicle: false, fallChestUpperBack: true, fallChestUpperBackSides: ['center'],
      fallChestSigns: ['dyspnea_shortness_of_breath', 'pleuritic_chest_pain'],
      fallParentAbdomen: true, fallAbdWall: true, fallAbdWallSides: ['left'], fallAbdFlank: false, fallAbdLowerBack: true, fallAbdLowerBackSides: ['center'], fallAbdPelvisHip: false, fallAbdGenitalia: false,
      fallAbdomenSigns: ['severe_abd_pain_distension', 'sciatica_numbness_cauda_equina'],
      fallParentUpperExtremity: false,
      fallParentLowerExtremity: true, fallLegThigh: false, fallLegKneeShin: false, fallLegAnkleFoot: false, fallLegToes: false,
      fallLowerExtSigns: ['nerve_numbness_cannot_dorsiflex'],
      fallSystemicSigns: ['dizziness_presyncope', 'palpitation_cold_sweat'],
      painScore: 9, fallAntithrombotic: 'no_antithrombotic', fallTetanusHx: 'more_than_10_years'
    },

    // Case 2: Elderly female syncopal fall with right hip fracture and head trauma on Warfarin (ESI 2)
    {
      id: 'case-fall-02', queue_number: 'E2-106', hn: '7890602',
      name: 'นางสุมาลี วูบหมดสติล้มในห้องน้ำสะโพกขวาหักทานยาวาร์ฟาริน', age: 76, gender: 'หญิง',
      chief_complaint: 'fall_trauma', chief_complaint_title: 'พลัดตกหกล้ม / ได้รับบาดเจ็บทางกายภาพ',
      timestamp: '2026-11-06T08:30:00.000Z', status: 'waiting',
      durationVal: 1, durationUnit: 'hours', hospRecordStatus: 'complete',
      underlying: ['หัวใจเต้นผิดจังหวะ (AF)', 'ความดันโลหิตสูง (HT)'],
      drugAllergy: 'ปฏิเสธ', currentMeds: 'Warfarin 2 mg 1 tab po od, Amlodipine 5 mg 1 tab po od',
      otherSymptomsFree: 'ขณะยืนแปรงฟันในห้องน้ำ รู้สึกใจสั่น วูบหน้ามืดภาพตัดไปชั่วขณะแล้วล้มลง ศีรษะกระแทกพื้นห้องน้ำ สลบไปประมาณ 1 นาที ฟื้นมารู้สึกปวดสะโพกขวามาก ขยับขาไม่ได้ ขาขวาสั้นลงและแบะออก ยืนไม่ไหว',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.8, sbp: 142, dbp: 82, bp: '142/82', pr: 94, rr: 18, spo2: 97 },
      esi_level: 2,
      fallMechanisms: ['ground_level_fall'], fallMechGroundDetail: 'วูบล้มในห้องน้ำ',
      fallProdrome: 'has_prodrome', fallWoundStatus: 'abrasion_stopped',
      fallParentHeadFace: true, fallHeadScalp: true, fallHeadScalpSides: ['right'], fallHeadFace: false, fallHeadEye: false, fallHeadEar: false, fallHeadNoseMouth: false,
      fallHeadSigns: ['loss_of_consciousness', 'severe_headache_vomit_drowsy'],
      fallParentNeck: false, fallParentChest: false,
      fallParentAbdomen: true, fallAbdWall: false, fallAbdFlank: false, fallAbdLowerBack: false, fallAbdPelvisHip: true, fallAbdPelvisHipSides: ['right'], fallAbdGenitalia: false,
      fallAbdomenSigns: ['pelvic_hip_pain_cannot_bear_weight'],
      fallParentUpperExtremity: false,
      fallParentLowerExtremity: true, fallLegThigh: true, fallLegThighSides: ['right'], fallLegKneeShin: false, fallLegAnkleFoot: false, fallLegToes: false,
      fallLowerExtSigns: ['deformity_shortened_external_rotation_leg', 'inability_to_bear_weight'],
      fallSystemicSigns: ['no_systemic_signs'],
      painScore: 8, fallAntithrombotic: 'on_anticoagulant_antiplatelet', fallTetanusHx: '5_to_10_years'
    },

    // Case 3: Middle-aged female slip and fall with left Colles wrist deformity (ESI 3)
    {
      id: 'case-fall-03', queue_number: 'E3-102', hn: '7890603',
      name: 'นางสมศรี สะดุดล้มเอามือยันพื้นข้อมือซ้ายบวมผิดรูป', age: 58, gender: 'หญิง',
      chief_complaint: 'fall_trauma', chief_complaint_title: 'พลัดตกหกล้ม / ได้รับบาดเจ็บทางกายภาพ',
      timestamp: '2026-11-06T09:00:00.000Z', status: 'waiting',
      durationVal: 2, durationUnit: 'hours', hospRecordStatus: 'self',
      underlying: ['ไขมันในเลือดสูง'], drugAllergy: 'ปฏิเสธ', currentMeds: 'Simvastatin 20 mg 1 tab po hs',
      otherSymptomsFree: 'เดินสะดุดขอบพรมในบ้าน เสียหลักล้มเอามือซ้ายยันพื้น ไม่มีอาการวูบนำมาก่อน ศีรษะไม่กระแทก รู้สึกปวดและบวมผิดรูปเหมือนส้อม (dinner fork) ที่ข้อมือซ้าย ขยับหมุนข้อมือไม่ได้ ปลายนิ้วไม่ชา สีชมพูดี',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.6, sbp: 128, dbp: 78, bp: '128/78', pr: 76, rr: 16, spo2: 99 },
      esi_level: 3,
      fallMechanisms: ['ground_level_fall'], fallMechGroundDetail: 'สะดุดขอบพรมในบ้าน',
      fallProdrome: 'no_prodrome', fallWoundStatus: 'no_wound',
      fallParentHeadFace: false, fallParentNeck: false, fallParentChest: false, fallParentAbdomen: false,
      fallParentUpperExtremity: true, fallArmShoulder: false, fallArmElbow: false, fallArmWrist: true, fallArmWristSides: ['left'], fallArmFingers: false,
      fallUpperExtSigns: ['deformity_dislocation_arm', 'cannot_move_arm_hand'],
      fallParentLowerExtremity: false,
      fallSystemicSigns: ['no_systemic_signs'],
      painScore: 6, fallAntithrombotic: 'no_antithrombotic', fallTetanusHx: 'within_5_years'
    },

    // Case 4: Young adult twisted right ankle while stepping off sidewalk, able to bear weight (ESI 4)
    {
      id: 'case-fall-04', queue_number: 'E3-103', hn: '7890604',
      name: 'นายธนากร ก้าวพลาดตกขอบฟุตบาทข้อเท้าขวาพลิกเดินลงน้ำหนักได้', age: 25, gender: 'ชาย',
      chief_complaint: 'fall_trauma', chief_complaint_title: 'พลัดตกหกล้ม / ได้รับบาดเจ็บทางกายภาพ',
      timestamp: '2026-11-06T09:30:00.000Z', status: 'waiting',
      durationVal: 3, durationUnit: 'hours', hospRecordStatus: 'self',
      underlying: [], drugAllergy: 'ปฏิเสธ', currentMeds: 'ไม่มี',
      otherSymptomsFree: 'เดินก้าวพลาดตกขอบฟุตบาท ข้อเท้าขวาบิดพลิกเข้าด้านใน ปวดเจ็บและบวมเล็กน้อยบริเวณตาตุ่มด้านนอกขวา ยังพอยืนและเดินลงน้ำหนักได้ ไม่มีแผลเปิด ไม่ชา ไม่หน้ามืด',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.7, sbp: 116, dbp: 72, bp: '116/72', pr: 68, rr: 16, spo2: 99 },
      esi_level: 4,
      fallMechanisms: ['sports_twist'], fallMechSportsDetail: 'ก้าวพลาดตกขอบฟุตบาทข้อเท้าขวาพลิก',
      fallProdrome: 'no_prodrome', fallWoundStatus: 'no_wound',
      fallParentHeadFace: false, fallParentNeck: false, fallParentChest: false, fallParentAbdomen: false, fallParentUpperExtremity: false,
      fallParentLowerExtremity: true, fallLegThigh: false, fallLegKneeShin: false, fallLegAnkleFoot: true, fallLegAnkleFootSides: ['right'], fallLegToes: false,
      fallLowerExtSigns: [],
      fallSystemicSigns: ['no_systemic_signs'],
      painScore: 3, fallAntithrombotic: 'no_antithrombotic', fallTetanusHx: 'within_5_years'
    }
  ]
};

// Register module in Ratchaburi ER Core Registry
if (typeof registerCcModule === 'function') {
  registerCcModule(fallTraumaModule);
} else if (typeof window !== 'undefined' && typeof window.registerCcModule === 'function') {
  window.registerCcModule(fallTraumaModule);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = fallTraumaModule;
}
