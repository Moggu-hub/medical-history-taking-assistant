// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 28_animal_bite.js
// อาการนำ: สุนัข แมว สัตว์เลี้ยงลูกด้วยนมกัด (Animal / Mammalian Bites & Rabies Exposure)
// รองรับ Zero Default Bias, WHO Rabies Category I-III Classification,
// Progressive Disclosure 6 ตำแหน่งร่างกาย, Pain Slider Touch State, และ Core Guard TDD 100%
// =========================================================================

// --- Module-scoped State & Helpers ---
let bitePainScoreTouched = false;

function toggleBiteGroup(subId, show) {
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

function handleBiteBleedingContainerToggle() {
  const biteWoundCb = document.querySelector('input[name="biteExposures"][value="bite_wound"]');
  const scratchWoundCb = document.querySelector('input[name="biteExposures"][value="scratch_wound"]');
  const show = (biteWoundCb && biteWoundCb.checked) || (scratchWoundCb && scratchWoundCb.checked);
  const container = document.getElementById('biteBleedingStatusContainer');
  if (container) {
    if (show) {
      container.classList.remove('hidden');
    } else {
      container.classList.add('hidden');
      container.querySelectorAll('input[type="radio"]').forEach(rb => { rb.checked = false; });
    }
  }
}

function clearBitePainScore() {
  bitePainScoreTouched = false;
  const slider = document.getElementById('bitePainScore');
  if (slider) slider.value = 0;
  const emojiEl = document.getElementById('bitePainScoreEmoji');
  const textEl = document.getElementById('bitePainScoreText');
  const badgeEl = document.getElementById('bitePainScoreBadge');
  const clearBtn = document.getElementById('bitePainScoreClearBtn');
  if (emojiEl) emojiEl.textContent = '⚪';
  if (textEl) textEl.textContent = 'ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)';
  if (badgeEl) badgeEl.className = 'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all';
  if (clearBtn) clearBtn.classList.add('hidden');
}

function handleBitePainScoreChange(val) {
  bitePainScoreTouched = true;
  const num = parseInt(val, 10);
  const slider = document.getElementById('bitePainScore');
  if (slider) slider.value = num;
  const emojiEl = document.getElementById('bitePainScoreEmoji');
  const textEl = document.getElementById('bitePainScoreText');
  const badgeEl = document.getElementById('bitePainScoreBadge');
  const clearBtn = document.getElementById('bitePainScoreClearBtn');
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
const handleBitePainSliderTouch = handleBitePainScoreChange;

// --- Clinical Decision Support & Evaluation Functions ---
function evaluateBiteRedFlags(patient) {
  const rfs = [];
  const vs = patient.vital_signs || {};
  const sbp = typeof vs.sbp === 'number' ? vs.sbp : (parseInt(vs.sbp, 10) || null);
  const pr = typeof vs.pr === 'number' ? vs.pr : (parseInt(vs.pr, 10) || null);
  const bt = typeof vs.bt === 'number' ? vs.bt : (parseFloat(vs.bt) || null);
  const shockIndex = (sbp && pr) ? (pr / sbp) : 0;

  const animalTypes = Array.isArray(patient.biteAnimalTypes) ? patient.biteAnimalTypes : [];
  const exposures = Array.isArray(patient.biteExposures) ? patient.biteExposures : [];
  const bleedingStatus = patient.biteBleedingStatus || '';
  const rabiesHx = patient.biteRabiesVaccineHx || '';

  const headSigns = Array.isArray(patient.biteHeadSigns) ? patient.biteHeadSigns : [];
  const neckSigns = Array.isArray(patient.biteNeckSigns) ? patient.biteNeckSigns : [];
  const chestSigns = Array.isArray(patient.biteChestSigns) ? patient.biteChestSigns : [];
  const abdSigns = Array.isArray(patient.biteAbdomenSigns) ? patient.biteAbdomenSigns : [];
  const upperSigns = Array.isArray(patient.biteUpperExtSigns) ? patient.biteUpperExtSigns : [];
  const lowerSigns = Array.isArray(patient.biteLowerExtSigns) ? patient.biteLowerExtSigns : [];
  const infectionSigns = Array.isArray(patient.biteInfectionSigns) ? patient.biteInfectionSigns : [];
  const sysSigns = Array.isArray(patient.biteSystemicSigns) ? patient.biteSystemicSigns : [];

  const hasBleeding = ['oozing_stopped', 'oozing_active', 'pulsatile_massive'].includes(bleedingStatus);
  const hasMucosaExposure = exposures.includes('saliva_mucosa_wound') || headSigns.includes('saliva_splash_eye');
  const hasBatExposure = animalTypes.includes('bat');
  const isHighRiskSite = !!(patient.biteParentHeadFace || patient.biteParentNeck || patient.biteArmWrist || patient.biteArmFingers);

  // Determine WHO Category:
  // Cat III: Bite/scratch with bleeding, mucosa saliva, bat exposure, or transdermal bite
  const isWhoCat3 = hasBleeding || hasMucosaExposure || hasBatExposure;
  const isWhoCat2 = !isWhoCat3 && (exposures.includes('bruise_blunt') || (exposures.includes('scratch_wound') && bleedingStatus === 'no_bleeding'));

  // RED FLAG 1: Severe Neck/Face Mauling, Active Arterial Bleeding, Shock or Rabies Encephalitis (ESI 1 / 2)
  const isSevereAirwayOrShock = (bleedingStatus === 'pulsatile_massive') ||
    (sbp !== null && sbp < 90) || (shockIndex >= 0.9) ||
    sysSigns.includes('hydrophobia_aerophobia_agitation') ||
    (patient.biteParentNeck && (neckSigns.includes('stridor_dysphagia_air_leak') || neckSigns.includes('deep_neck_wound_expanding_hematoma'))) ||
    (patient.biteParentHeadFace && headSigns.includes('large_laceration_tissue_defect'));

  if (isSevereAirwayOrShock) {
    const isEsi1 = (sbp !== null && sbp < 90) || bleedingStatus === 'pulsatile_massive' || sysSigns.includes('hydrophobia_aerophobia_agitation');
    rfs.push({
      key: 'rf_bite_severe_neck_face_hemorrhagic_shock',
      level: isEsi1 ? 'ESI 1' : 'ESI 2',
      title: 'แผลสัตว์กัดขย้ำรุนแรงบริเวณลำคอ/ใบหน้า เลือดออกพุ่งตามชีพจร หรือมีภาวะช็อก/สงสัยอาการทางสมอง (Severe Neck/Maxillofacial Mauling, Active Arterial Bleeding, Shock or Rabies Encephalitis)',
      detail: 'ผู้ป่วยมีแผลฉีกขาดรุนแรงบริเวณใบหน้า/ลำคอ หรือมีเลือดไหลพุ่งตามชีพจร ความดันตกช็อก หรือมีอาการทางสมองกลัวน้ำกลัวลม เสี่ยงต่อการเสียชีวิตฉุกเฉิน',
      action: 'ประเมิน ABCDE ทันที, กดห้ามเลือดโดยตรง, ให้สารน้ำทางหลอดเลือดดำ, ตรวจทางเดินหายใจใกล้ชิด และปรึกษาศัลยแพทย์/ศัลยกรรมตกแต่งด่วน'
    });
  }

  // RED FLAG 2: WHO Category III Rabies Exposure Requiring ERIG/HRIG + Vaccine (ESI 2)
  const isRabiesNaiveOrUnsure = rabiesHx === 'naive_or_incomplete' || rabiesHx === 'unknown_or_unsure';
  if (isWhoCat3 && isRabiesNaiveOrUnsure) {
    rfs.push({
      key: 'rf_bite_who_cat3_rig_indicated',
      level: 'ESI 2',
      title: 'บาดแผลสัมผัสโรคพิษสุนัขบ้าระดับรุนแรง (WHO Category III) ที่ต้องได้รับเซรุ่มอิมมูโนโกลบูลิน (RIG) รอบแผลร่วมกับวัคซีน (WHO Category III Rabies Exposure Requiring ERIG/HRIG + Vaccine)',
      detail: 'เข้าเกณฑ์ WHO Category III (แผลมีเลือดออก น้ำลายเข้าเยื่อบุตา/ปาก แผลที่ใบหน้า/คอ/มือ/นิ้ว หรือสัมผัสค้างคาว) ในผู้ที่ไม่เคยฉีดวัคซีนครบมาก่อนหรือจำประวัติไม่ได้ เสี่ยงต่อการติดเชื้อไวรัสพิษสุนัขบ้าเข้าสู่ระบบประสาท',
      action: 'ล้างแผลด้วยน้ำสะอาดและสบู่ทันที, ให้ Rabies Immunoglobulin (ERIG 40 IU/kg หรือ HRIG 20 IU/kg) ฉีดแทรกซึมรอบบาดแผลทุกจุดให้มากที่สุด และเริ่มฉีดวัคซีนป้องกันโรคพิษสุนัขบ้าเข็มแรก (Day 0) ทันที'
    });
  }

  // RED FLAG 3: High-Risk Hand Bite / Suspected Flexor Tenosynovitis / Tendon-Nerve Injury (ESI 2)
  const isHandOrFingerWound = (patient.biteParentUpperExtremity && (patient.biteArmWrist || patient.biteArmFingers));
  const hasHandTendonOrNerveThreat = isHandOrFingerWound && (
    upperSigns.includes('finger_joint_swelling_cannot_flex_extend') ||
    upperSigns.includes('hand_numbness_loss_sensation') ||
    upperSigns.includes('tendon_bone_exposed_deformity') ||
    upperSigns.includes('digit_amputation')
  );

  if (hasHandTendonOrNerveThreat) {
    rfs.push({
      key: 'rf_bite_deep_hand_tendon_joint_infection',
      level: 'ESI 2',
      title: 'แผลถูกกัดบริเวณมือ/นิ้วมือร่วมกับสงสัยการติดเชื้อในเยื่อหุ้มเอ็น/ข้อต่อ หรือเส้นเอ็น/เส้นประสาทบาดเจ็บ (High-Risk Hand Bite / Suspected Flexor Tenosynovitis / Tendon-Nerve Injury)',
      detail: 'เขี้ยวสัตว์เจาะลึกบริเวณฝ่ามือหรือนิ้วมือ มีอาการปวดบวมตามแนวเส้นเอ็น ขยับงอเหยียดนิ้วไม่ได้ หรือมีอาการชา เสี่ยงต่อภาวะ Flexor Tenosynovitis / Compartment Syndrome และสูญเสียการทำงานของมือถาวร',
      action: 'ตรวจ Kanavel cardinal signs, ห้ามเย็บปิดแผลที่มือเด็ดขาด (Avoid primary closure), ให้ยาปฏิชีวนะทางหลอดเลือดดำ และปรึกษาศัลยแพทย์กระดูกและข้อ/ศัลยศาสตร์ทางมือด่วน'
    });
  }

  // RED FLAG 4: Infected Animal Bite / Lymphangitis-Abscess / Sepsis Risk (ESI 2 / 3)
  const hasLocalInfection = infectionSigns.includes('erythema_edema_throbbing_pain') ||
    infectionSigns.includes('pus_purulent_discharge') ||
    infectionSigns.includes('lymphangitis_lymphadenopathy');
  const hasSystemicInfection = sysSigns.includes('fever_chills') || (bt !== null && bt >= 38.0);

  if (hasLocalInfection || hasSystemicInfection) {
    const isSepsisLevel = hasSystemicInfection || infectionSigns.includes('lymphangitis_lymphadenopathy');
    rfs.push({
      key: 'rf_bite_infected_wound_sepsis_immunocompromised',
      level: isSepsisLevel ? 'ESI 2' : 'ESI 3',
      title: 'แผลสัตว์กัดมีการอักเสบติดเชื้อเป็นหนอง รอยแดงลามตามเส้นเลือด หรือมีไข้ (Infected Animal Bite / Lymphangitis-Abscess / Sepsis Risk)',
      detail: 'พบสัญญาณการติดเชื้อแบคทีเรียเฉียบพลันจากช่องปากสัตว์ (เช่น Pasteurella multocida, Capnocytophaga, Staphylococcus aureus) เสี่ยงต่อการลุกลามเป็นฝีหนองลึกและภาวะติดเชื้อในกระแสเลือด',
      action: 'เปิดระบายหนองหากมีฝี (Incision & Drainage), เก็บหนองเพาะเชื้อ, ให้ยาปฏิชีวนะครอบคลุมเชื้อสัตว์กัด (Amoxicillin-Clavulanate เป็น First-line) และพิจารณารับตัวไว้รักษาในรพ.หากมีไข้สูง'
    });
  }

  // RED FLAG 5: Rabies Booster Regimen or WHO Category II Exposure (ESI 3)
  const isPreviouslyVaccinated = rabiesHx.startsWith('completed_last_');
  if (isWhoCat2 || (isWhoCat3 && isPreviouslyVaccinated)) {
    // Only add if not already flagged as severe Category III needing RIG
    if (!rfs.some(r => r.key === 'rf_bite_who_cat3_rig_indicated')) {
      rfs.push({
        key: 'rf_bite_who_cat2_or_booster_regimen',
        level: 'ESI 3',
        title: 'ผู้ป่วยสัมผัสโรคพิษสุนัขบ้าที่เคยได้รับวัคซีนครบมาก่อน (พิจารณาฉีดกระตุ้น 1–2 เข็มโดยไม่ต้องให้ RIG) หรือแผลระดับ WHO Category II (Rabies Booster Regimen or WHO Category II Exposure)',
        detail: 'ผู้ป่วยเคยฉีดวัคซีนพิษสุนัขบ้าครบมาก่อน หรือมีบาดแผลระดับ Category II (ไม่มีเลือดออก) ไม่มีความจำเป็นต้องได้รับเซรุ่มอิมมูโนโกลบูลิน (RIG)',
        action: 'ล้างทำความสะอาดแผล, ฉีดวัคซีนพิษสุนัขบ้ากระตุ้น (1 เข็ม Day 0 หากเข็มล่าสุดไม่เกิน 6 เดือน หรือ 2 เข็ม Day 0, 3 หากเข็มล่าสุดเกิน 6 เดือน โดยไม่ต้องให้ RIG), ประเมินวัคซีนบาดทะยัก และพิจารณาให้ยาปฏิชีวนะป้องกันการติดเชื้อ'
      });
    }
  }

  return rfs;
}

// --- Dynamic Output Update Function ---
function updateBiteOutputs(rec) {
  if (!rec) return;
  const rapidText = renderBiteRapidHpi(rec);
  const narrativeText = renderBiteNarrative(rec);

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

  const redFlags = evaluateBiteRedFlags(rec);
  rec.redFlags = redFlags;

  const jsonOutput = {
    encounter: {
      chief_complaint: 'animal_bite',
      chief_complaint_title_th: 'สุนัข แมว สัตว์เลี้ยงลูกด้วยนมกัด',
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
      animal_types: Array.isArray(rec.biteAnimalTypes) ? rec.biteAnimalTypes : [],
      animal_other_detail: rec.biteAnimalOtherDetail || '',
      exposures: Array.isArray(rec.biteExposures) ? rec.biteExposures : [],
      bleeding_status: rec.biteBleedingStatus || null,
      animal_behavior: Array.isArray(rec.biteAnimalBehavior) ? rec.biteAnimalBehavior : [],
      wound_cleansing: rec.biteWoundCleansing || null,
      pain_score: rec.painScore,
      rabies_vaccine_history: rec.biteRabiesVaccineHx || null,
      tetanus_history: rec.biteTetanusHx || null,
      anatomical_regions: {
        head_face: !!rec.biteParentHeadFace,
        neck: !!rec.biteParentNeck,
        chest: !!rec.biteParentChest,
        abdomen: !!rec.biteParentAbdomen,
        upper_extremity: !!rec.biteParentUpperExtremity,
        lower_extremity: !!rec.biteParentLowerExtremity
      },
      infection_signs: Array.isArray(rec.biteInfectionSigns) ? rec.biteInfectionSigns : [],
      systemic_signs: Array.isArray(rec.biteSystemicSigns) ? rec.biteSystemicSigns : [],
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

// --- Text Formatter Helpers ---
function formatBiteAnimals(patient) {
  const arr = Array.isArray(patient.biteAnimalTypes) ? patient.biteAnimalTypes : [];
  if (arr.length === 0) return 'ไม่ระบุชนิดสัตว์';
  const map = {
    dog: 'สุนัข',
    cat: 'แมว',
    bat: 'ค้างคาว',
    other_mammal: patient.biteAnimalOtherDetail ? `สัตว์เลี้ยงลูกด้วยนมอื่นๆ (${patient.biteAnimalOtherDetail})` : 'สัตว์เลี้ยงลูกด้วยนมอื่นๆ'
  };
  return arr.map(k => map[k] || k).join(', ');
}

function formatBiteExposures(patient) {
  const arr = Array.isArray(patient.biteExposures) ? patient.biteExposures : [];
  if (arr.length === 0) return 'ไม่ระบุลักษณะการสัมผัส';
  const map = {
    bite_wound: 'ถูกกัดเป็นแผลฉีกขาดหรือรอยเขี้ยวเจาะลึก',
    scratch_wound: 'ถูกข่วนเป็นรอยแผลหรือแผลถลอก',
    bruise_blunt: 'ถูกงับเป็นรอยช้ำ/รอยบุ๋ม (ไม่มีแผลเปิด)',
    saliva_mucosa_wound: 'ถูกสัตว์เลีย/น้ำลายกระเด็นเข้าตา/ปาก/จมูก/แผลเปิดเดิม',
    saliva_intact_skin: 'ถูกสัตว์เลียบนผิวหนังปกติ (ไม่มีแผล)'
  };
  return arr.map(k => map[k] || k).join(', ');
}

function formatBiteBleedingStatus(patient) {
  const map = {
    no_bleeding: 'ไม่มีเลือดออก (แผลถลอกตื้น)',
    oozing_stopped: 'มีเลือดออกซึม แต่ขณะนี้หยุดไหลแล้ว',
    oozing_active: 'ยังมีเลือดไหลซึมออกจากแผลต่อเนื่อง',
    pulsatile_massive: 'เลือดไหลพุ่งเป็นจังหวะตามชีพจร หรือออกมากผิดปกติ'
  };
  return map[patient.biteBleedingStatus] || 'ไม่ระบุ';
}

function formatBiteBehavior(patient) {
  const arr = Array.isArray(patient.biteAnimalBehavior) ? patient.biteAnimalBehavior : [];
  if (arr.length === 0) return 'ไม่ระบุข้อมูลสัตว์';
  const map = {
    owned_quarantine_10d: 'สัตว์มีเจ้าของ กักดูอาการต่อได้ครบ 10 วัน',
    stray_disappeared: 'สัตว์จรจัด/หนีหายไป ติดตามดูอาการไม่ได้',
    unprovoked_abnormal: 'กัดโดยไม่มีสาเหตุจูงใจ หรือมีอาการดุร้ายผิดปกติ/น้ำลายไหลยืด',
    animal_died_killed: 'สัตว์ตายแล้วหรือถูกฆ่าตายหลังเกิดเหตุ',
    animal_vaccinated_criteria: 'สัตว์เคยได้รับวัคซีนตามเกณฑ์ (>= 2 ครั้ง และครั้งหลังสุด <= 1 ปี)'
  };
  return arr.map(k => map[k] || k).join('; ');
}

function formatBiteCleansing(patient) {
  const map = {
    cleaned_soap_water: 'ล้างด้วยน้ำสะอาดและฟอกสบู่เรียบร้อยแล้ว',
    cleaned_water_antiseptic_only: 'ล้างน้ำเปล่า/น้ำเกลือ/ยาฆ่าเชื้อเท่านั้น (ไม่ได้ฟอกสบู่)',
    not_cleaned: 'ยังไม่ได้ล้างแผล'
  };
  return map[patient.biteWoundCleansing] || 'ไม่ระบุ';
}

function formatBiteLocations(patient) {
  const locs = [];
  const sideMap = { left: 'ซ้าย', right: 'ขวา', center: 'ตรงกลาง' };
  const fmtSides = (s) => (Array.isArray(s) && s.length > 0) ? ` [${s.map(x => sideMap[x] || x).join('/')}]` : '';

  if (patient.biteParentHeadFace) {
    const subs = [];
    if (patient.biteHeadScalp) subs.push(`หนังศีรษะ${fmtSides(patient.biteHeadScalpSides)}`);
    if (patient.biteHeadFace) subs.push(`ใบหน้า${fmtSides(patient.biteHeadFaceSides)}`);
    if (patient.biteHeadEye) subs.push(`ดวงตา${fmtSides(patient.biteHeadEyeSides)}`);
    if (patient.biteHeadEar) subs.push(`ใบหู${fmtSides(patient.biteHeadEarSides)}`);
    if (patient.biteHeadNoseMouth) subs.push(`จมูก/ปาก${fmtSides(patient.biteHeadNoseMouthSides)}`);
    locs.push(`ศีรษะและใบหน้า (${subs.length > 0 ? subs.join(', ') : 'บริเวณศีรษะ/ใบหน้า'})`);
  }
  if (patient.biteParentNeck) {
    const subs = [];
    if (patient.biteNeckFront) subs.push(`ลำคอด้านหน้า${fmtSides(patient.biteNeckFrontSides)}`);
    if (patient.biteNeckSide) subs.push(`ลำคอด้านข้าง${fmtSides(patient.biteNeckSideSides)}`);
    if (patient.biteNeckBack) subs.push(`ต้นคอด้านหลัง${fmtSides(patient.biteNeckBackSides)}`);
    locs.push(`ลำคอ (${subs.length > 0 ? subs.join(', ') : 'บริเวณลำคอ'})`);
  }
  if (patient.biteParentChest) {
    const subs = [];
    if (patient.biteChestFront) subs.push(`หน้าอก${fmtSides(patient.biteChestFrontSides)}`);
    if (patient.biteChestUpperBack) subs.push(`หลังส่วนบน/สะบัก${fmtSides(patient.biteChestUpperBackSides)}`);
    locs.push(`ทรวงอก (${subs.length > 0 ? subs.join(', ') : 'บริเวณทรวงอก'})`);
  }
  if (patient.biteParentAbdomen) {
    const subs = [];
    if (patient.biteAbdWall) subs.push(`หน้าท้อง${fmtSides(patient.biteAbdWallSides)}`);
    if (patient.biteAbdFlank) subs.push(`สีข้าง/บั้นเอว${fmtSides(patient.biteAbdFlankSides)}`);
    if (patient.biteAbdLowerBack) subs.push(`หลังส่วนล่าง${fmtSides(patient.biteAbdLowerBackSides)}`);
    if (patient.biteAbdGluteal) subs.push(`สะโพก/ก้น${fmtSides(patient.biteAbdGlutealSides)}`);
    if (patient.biteAbdGenitalia) subs.push(`อวัยวะเพศ${fmtSides(patient.biteAbdGenitaliaSides)}`);
    locs.push(`ช่องท้อง/สะโพก (${subs.length > 0 ? subs.join(', ') : 'บริเวณช่องท้อง/สะโพก'})`);
  }
  if (patient.biteParentUpperExtremity) {
    const subs = [];
    if (patient.biteArmShoulder) subs.push(`หัวไหล่/ต้นแขน${fmtSides(patient.biteArmShoulderSides)}`);
    if (patient.biteArmElbow) subs.push(`ข้อศอก/แขนท่อนล่าง${fmtSides(patient.biteArmElbowSides)}`);
    if (patient.biteArmWrist) subs.push(`ข้อมือ/ฝ่ามือ${fmtSides(patient.biteArmWristSides)}`);
    if (patient.biteArmFingers) subs.push(`นิ้วมือ${fmtSides(patient.biteArmFingersSides)}`);
    locs.push(`แขนและมือ (${subs.length > 0 ? subs.join(', ') : 'บริเวณแขน/มือ'})`);
  }
  if (patient.biteParentLowerExtremity) {
    const subs = [];
    if (patient.biteLegThigh) subs.push(`ต้นขา${fmtSides(patient.biteLegThighSides)}`);
    if (patient.biteLegKneeShin) subs.push(`เข่า/หน้าแข้ง/น่อง${fmtSides(patient.biteLegKneeShinSides)}`);
    if (patient.biteLegAnkleFoot) subs.push(`ข้อเท้า/เท้า${fmtSides(patient.biteLegAnkleFootSides)}`);
    if (patient.biteLegToes) subs.push(`นิ้วเท้า${fmtSides(patient.biteLegToesSides)}`);
    locs.push(`ขาและเท้า (${subs.length > 0 ? subs.join(', ') : 'บริเวณขา/เท้า'})`);
  }

  return locs.length > 0 ? locs.join('; ') : 'ไม่ระบุตำแหน่ง';
}

function formatBiteInfectionSigns(patient) {
  const arr = Array.isArray(patient.biteInfectionSigns) ? patient.biteInfectionSigns : [];
  if (arr.includes('no_local_infection') || arr.length === 0) return 'ไม่มีอาการบวมแดงร้อนหรือหนอง';
  const map = {
    erythema_edema_throbbing_pain: 'รอบแผลบวมแดงร้อน/ปวดตุบๆ',
    pus_purulent_discharge: 'มีหนองหรือน้ำเหลืองขุ่นกลิ่นเหม็น',
    lymphangitis_lymphadenopathy: 'รอยแดงลามตามเส้นเลือด หรือก้อนนูนบวมเจ็บที่รักแร้/ขาหนีบ'
  };
  return arr.map(k => map[k] || k).join(', ');
}

function formatBiteSystemicSigns(patient) {
  const arr = Array.isArray(patient.biteSystemicSigns) ? patient.biteSystemicSigns : [];
  if (arr.includes('no_systemic_signs') || arr.length === 0) return 'ไม่มีอาการผิดปกติทางระบบร่างกาย';
  const map = {
    fever_chills: 'มีไข้หนาวสั่น/ครั่นเนื้อตัว',
    dizziness_presyncope_shock: 'หน้ามืด เวียนศีรษะ วูบ ใจสั่นเหงื่อแตกตัวเย็น',
    hydrophobia_aerophobia_agitation: 'กลืนน้ำลำบาก กลัวน้ำ กลัวลม หรือกระสับกระส่าย'
  };
  return arr.map(k => map[k] || k).join(', ');
}

function formatBiteRabiesHx(patient) {
  const map = {
    naive_or_incomplete: 'ไม่เคยฉีดมาก่อน หรือฉีดไม่ครบ (< 3 เข็ม)',
    completed_last_within_3m: 'เคยฉีดครบ (>= 3 เข็ม) โดยเข็มสุดท้าย/กระตุ้น <= 3 เดือน',
    completed_last_3_to_6m: 'เคยฉีดครบ (>= 3 เข็ม) โดยเข็มสุดท้าย/กระตุ้น 3-6 เดือน',
    completed_last_over_6m: 'เคยฉีดครบ (>= 3 เข็ม) โดยเข็มสุดท้าย/กระตุ้น > 6 เดือน',
    unknown_or_unsure: 'จำประวัติไม่ได้ / ไม่แน่ใจ'
  };
  return map[patient.biteRabiesVaccineHx] || 'ไม่ระบุ';
}

function formatBiteTetanusHx(patient) {
  const map = {
    within_5_years: 'ฉีดเข็มล่าสุดภายในไม่เกิน 5 ปี',
    '5_to_10_years': 'ฉีดเข็มล่าสุด 5–10 ปี',
    more_than_10_years: 'ฉีดเข็มล่าสุดนานเกิน 10 ปีแล้ว',
    never_or_unsure: 'ไม่เคยฉีด หรือจำไม่ได้/ไม่แน่ใจ'
  };
  return map[patient.biteTetanusHx] || 'ไม่ระบุ';
}

// --- Rapid HPI Note Generator ---
function renderBiteRapidHpi(patient) {
  const durVal = patient.durationVal !== undefined && patient.durationVal !== null ? patient.durationVal : '';
  const durUnit = patient.durationUnit || 'hours';
  const unitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durStr = durVal ? `${durVal} ${unitMap[durUnit] || durUnit}` : 'ไม่ระบุ';

  const painScoreStr = patient.painScore !== null && patient.painScore !== undefined ? `${patient.painScore}/10` : 'ไม่ระบุ';
  const rfs = evaluateBiteRedFlags(patient);

  const posList = [];
  const negList = [];

  const bleedingStatus = patient.biteBleedingStatus || '';
  if (bleedingStatus === 'pulsatile_massive') posList.push('มีเลือดไหลพุ่งตามชีพจร หรือเลือดออกมากผิดปกติ (Active Arterial Bleeding)');
  else if (bleedingStatus === 'oozing_active') posList.push('ยังมีเลือดไหลซึมต่อเนื่องจากบาดแผล');
  else if (bleedingStatus === 'oozing_stopped') posList.push('มีเลือดออกซึมจากแผลแต่หยุดไหลแล้ว (WHO Category III)');
  else if (bleedingStatus === 'no_bleeding') negList.push('ไม่มีเลือดออกจากบาดแผล');

  const animalTypes = Array.isArray(patient.biteAnimalTypes) ? patient.biteAnimalTypes : [];
  if (animalTypes.includes('bat')) posList.push('มีประวัติสัมผัสค้างคาว (Bat Exposure)');
  const animalBehaviors = Array.isArray(patient.biteAnimalBehavior) ? patient.biteAnimalBehavior : [];
  if (animalBehaviors.includes('stray_disappeared')) posList.push('สัตว์จรจัดหรือหนีหายไปแล้ว ติดตามดูอาการไม่ได้');
  if (animalBehaviors.includes('unprovoked_abnormal')) posList.push('สัตว์กัดโดยไม่มีสาเหตุจูงใจ หรือมีอาการดุร้ายผิดปกติ');

  const headSigns = Array.isArray(patient.biteHeadSigns) ? patient.biteHeadSigns : [];
  if (headSigns.includes('large_laceration_tissue_defect')) posList.push('แผลฉีกขาดขนาดใหญ่ที่ศีรษะ/ใบหน้า หรือชิ้นเนื้อแหว่งหาย');
  if (headSigns.includes('eye_injury_vision_loss')) posList.push('แผลถูกลูกตาโดยตรง หรือตามัวลืมตาไม่ขึ้น');
  if (headSigns.includes('saliva_splash_eye')) posList.push('น้ำลายสัตว์กระเด็นเข้าเยื่อบุตา');

  const neckSigns = Array.isArray(patient.biteNeckSigns) ? patient.biteNeckSigns : [];
  if (neckSigns.includes('deep_neck_wound_expanding_hematoma') || neckSigns.includes('stridor_dysphagia_air_leak')) posList.push('แผลขย้ำลึกที่ลำคอ เสี่ยงต่อทางเดินหายใจอุดกั้น');

  const upperSigns = Array.isArray(patient.biteUpperExtSigns) ? patient.biteUpperExtSigns : [];
  if (upperSigns.includes('finger_joint_swelling_cannot_flex_extend')) posList.push('ปวดบวมมากตามแนวข้อนิ้วมือ ขยับงอเหยียดนิ้วไม่ได้ (สงสัย Flexor Tenosynovitis)');
  if (upperSigns.includes('hand_numbness_loss_sensation')) posList.push('มีอาการชาหรือสูญเสียความรู้สึกที่มือ/นิ้วมือ');

  const infectionSigns = Array.isArray(patient.biteInfectionSigns) ? patient.biteInfectionSigns : [];
  if (infectionSigns.includes('lymphangitis_lymphadenopathy')) posList.push('มีรอยแดงลามตามเส้นเลือด หรือก้อนนูนบวมเจ็บที่รักแร้/ขาหนีบ');
  if (infectionSigns.includes('pus_purulent_discharge')) posList.push('มีหนองหรือน้ำเหลืองขุ่นไหลซึมจากแผล');

  const sysSigns = Array.isArray(patient.biteSystemicSigns) ? patient.biteSystemicSigns : [];
  if (sysSigns.includes('fever_chills')) posList.push('มีไข้หนาวสั่น');
  if (sysSigns.includes('dizziness_presyncope_shock')) posList.push('มีอาการหน้ามืด วูบ หรือเหงื่อแตกตัวเย็น');
  if (sysSigns.includes('hydrophobia_aerophobia_agitation')) posList.push('มีอาการกลืนน้ำลำบาก กลัวน้ำ กลัวลม หรือกระสับกระส่าย');

  if (infectionSigns.includes('no_local_infection') || infectionSigns.length === 0) negList.push('ไม่มีอาการบวมแดงร้อนหรือหนอง');
  if (sysSigns.includes('no_systemic_signs') || sysSigns.length === 0) negList.push('ไม่มีไข้หนาวสั่น และไม่มีอาการหน้ามืดช็อก');

  const hospRecordMap = { complete: 'มีประวัติเดิมครบถ้วนในระบบ รพ.', verified: 'มีประวัติในระบบ ยืนยันข้อมูลถูกต้อง', self: 'ผู้ป่วย/ญาติให้ประวัติตนเอง' };
  const hospRecordStr = hospRecordMap[patient.hospRecordStatus] || 'ผู้ป่วย/ญาติให้ประวัติตนเอง';
  const udDisplay = (Array.isArray(patient.underlying) && patient.underlying.length > 0) ? patient.underlying.join(', ') : 'ปฏิเสธ';
  const allergyDisplay = patient.drugAllergy || 'ปฏิเสธ';
  const medsDisplay = patient.currentMeds || 'ไม่มี';

  return `[Chief Complaint (CC)]
สุนัข แมว สัตว์เลี้ยงลูกด้วยนมกัด เป็นมา ${durStr}

[History of Present Illness (HPI)]
• ชนิดสัตว์: ${formatBiteAnimals(patient)} | พฤติกรรม/สถานะสัตว์: ${formatBiteBehavior(patient)}
• ลักษณะการสัมผัส/บาดแผล: ${formatBiteExposures(patient)} | สถานะเลือดออก: ${formatBiteBleedingStatus(patient)}
• การล้างแผลเบื้องต้นก่อนมารพ.: ${formatBiteCleansing(patient)}
• ตำแหน่งบาดแผลและอาการเฉพาะที่: ${formatBiteLocations(patient)}
• อาการอักเสบติดเชื้อเฉพาะที่: ${formatBiteInfectionSigns(patient)}
• อาการแสดงทางระบบร่างกาย: ${formatBiteSystemicSigns(patient)}
• ระดับความเจ็บปวด (Pain Score): ${painScoreStr}

• Pertinent Positives:
${posList.length > 0 ? posList.map(p => `  - ${p}`).join('\n') : '  - ไม่มีอาการบาดเจ็บรุนแรงเฉพาะจุด'}

• Pertinent Negatives:
${negList.length > 0 ? negList.map(n => `  - ${n}`).join('\n') : '  - ปฏิเสธอาการผิดปกติอื่นๆ'}

[Past Medical History & Immunization Profile]
• สถานะประวัติ รพ.ราชบุรี: ${hospRecordStr}
• ประวัติวัคซีนพิษสุนัขบ้าในตัวผู้ป่วย: ${formatBiteRabiesHx(patient)}
• ประวัติวัคซีนบาดทะยัก: ${formatBiteTetanusHx(patient)}
• โรคประจำตัว (Underlying Diseases): ${udDisplay}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${allergyDisplay}
• ยาประจำตัวที่รับประทานอยู่: ${medsDisplay}
${patient.otherSymptomsFree ? `• ข้อมูลเพิ่มเติมจากผู้ป่วย/ญาติ: ${patient.otherSymptomsFree}\n` : ''}
[Emergency Risk Assessment (Red Flags)]
${rfs.length > 0 ? rfs.map(rf => `🚩 ${rf.title}\n   ความเสี่ยง: ${rf.detail}\n   ข้อแนะนำการดูแลเร่งด่วน: ${rf.action}`).join('\n\n') : '✅ ไม่พบสัญญาณเตือนวิกฤตความเสี่ยงสูง (Non-Red Flag)'}`;
}

// --- Narrative Note Generator ---
function renderBiteNarrative(patient) {
  const durVal = patient.durationVal !== undefined && patient.durationVal !== null ? patient.durationVal : '';
  const durUnit = patient.durationUnit || 'hours';
  const unitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durStr = durVal ? `${durVal} ${unitMap[durUnit] || durUnit}` : 'ไม่ระบุระยะเวลา';

  const animalStr = formatBiteAnimals(patient);
  const exposureStr = formatBiteExposures(patient);
  const bleedingStr = formatBiteBleedingStatus(patient);
  const locStr = formatBiteLocations(patient);
  const cleansingStr = formatBiteCleansing(patient);
  const rabiesHxStr = formatBiteRabiesHx(patient);
  const pScore = (typeof patient.painScore === 'number' && patient.painScore > 0) ? `${patient.painScore}/10` : 'ไม่ระบุ';

  let note = `ผู้ป่วย${patient.gender || ''} อายุ ${patient.age || 'ไม่ระบุ'} ปี ได้รับบาดเจ็บถูก${animalStr} โดยมีลักษณะ${exposureStr} เป็นมาประมาณ ${durStr} ก่อนมาโรงพยาบาล สถานะเลือดออกในขณะนี้: ${bleedingStr} ตำแหน่งบาดแผลตรวจพบที่บริเวณ${locStr} การปฐมพยาบาลเบื้องต้น: ${cleansingStr} ระดับความเจ็บปวดประเมินได้ ${pScore} ประวัติวัคซีนพิษสุนัขบ้าเดิมในตัวผู้ป่วย: ${rabiesHxStr} ประวัติวัคซีนบาดทะยัก: ${formatBiteTetanusHx(patient)}`;

  if (patient.otherSymptomsFree) {
    note += ` ข้อมูลเพิ่มเติม: ${patient.otherSymptomsFree}`;
  }

  return note;
}

function renderBiteDoctorHpi(patient) {
  return renderBiteRapidHpi(patient);
}

// --- Built-in Clinical Decision Support (CDS) Generator ---
function generateBiteCds(patient) {
  const redFlags = evaluateBiteRedFlags(patient);
  const ddxList = [];
  const workupList = [];
  const managementList = [];

  if (redFlags.some(r => r.key === 'rf_bite_severe_neck_face_hemorrhagic_shock')) {
    ddxList.push('1. 🚨 Active Arterial Bleeding / Carotid or Facial Vessel Injury');
    ddxList.push('2. Impending Airway Obstruction secondary to Neck Expanding Hematoma');
    ddxList.push('3. Severe Maxillofacial Soft Tissue Defect');
    workupList.push('Stat CBC, Coagulogram, Type & Crossmatch');
    workupList.push('CT Angiography Neck/Face if hemodynamically stable');
    managementList.push('Direct pressure hemostasis, Do NOT clamp blindly in wound');
    managementList.push('Large-bore IV access (16-18G) + Crystalloid fluid resuscitation');
    managementList.push('Urgent Surgical / ENT / Plastic Consult');
  } else if (redFlags.some(r => r.key === 'rf_bite_who_cat3_rig_indicated')) {
    ddxList.push('1. 🚨 WHO Category III Rabies Exposure (High-Risk Bite with Bleeding/Mucosa Contact)');
    ddxList.push('2. Tetanus-prone Contaminated Wound');
    workupList.push('Wound inspection for foreign bodies/teeth fragments');
    managementList.push('Copious irrigation with sterile normal saline & soap cleaning');
    managementList.push('Rabies Immunoglobulin (ERIG 40 IU/kg or HRIG 20 IU/kg) infiltrate wound thoroughly');
    managementList.push('Rabies Vaccine Day 0 intramuscularly (Deltoid) or intradermally');
    managementList.push('Tetanus Toxoid / TIG as indicated');
    managementList.push('Oral Amoxicillin-Clavulanate (Augmentin) 875/125 mg po bid x 3-5 days');
  } else if (redFlags.some(r => r.key === 'rf_bite_deep_hand_tendon_joint_infection')) {
    ddxList.push('1. 🚨 Acute Suppurative Flexor Tenosynovitis (Kanavel Signs)');
    ddxList.push('2. Deep Space Hand Infection / Septic Arthritis of Finger');
    ddxList.push('3. Tendon Transection / Digital Nerve Injury');
    workupList.push('Plain Radiograph of Hand/Finger (AP & Lateral) rule out retained foreign body/osteomyelitis');
    workupList.push('CBC, ESR/CRP, Wound Gram stain & aerobic/anaerobic culture');
    managementList.push('AVOID primary wound closure (DO NOT SUTURE puncture bites to hands)');
    managementList.push('IV Ampicillin-Sulbactam 1.5-3 g q 6h or Ceftriaxone + Metronidazole');
    managementList.push('Hand splint in position of safety & Urgent Hand Surgery Consult');
  } else if (redFlags.some(r => r.key === 'rf_bite_infected_wound_sepsis_immunocompromised')) {
    ddxList.push('1. 🚨 Infected Animal Bite Wound (Pasteurella multocida / Capnocytophaga canimorsus)');
    ddxList.push('2. Acute Cellulitis / Abscess Formation');
    ddxList.push('3. Sepsis secondary to Bite Wound Infection');
    workupList.push('CBC, Blood Sugar, Hemoculture x 2, Wound swab for Gram stain & Culture');
    workupList.push('VBG/Lactate if febrile or abnormal vital signs');
    managementList.push('Incision and drainage (I&D) if fluctuant abscess present');
    managementList.push('IV Antibiotics (Ampicillin-Sulbactam or Ceftriaxone) if septic; Oral Augmentin if stable');
    managementList.push('Rabies & Tetanus PEP as indicated');
  } else {
    ddxList.push('1. Mammalian Bite / Scratch Wound (WHO Category II or Category III in Vaccinated Host)');
    ddxList.push('2. Superficial Abrasion / Contusion');
    workupList.push('Careful wound cleansing and inspection');
    managementList.push('Wound cleansing with soap and water');
    managementList.push('Rabies Vaccine Booster (Day 0 if < 6m, or Day 0, 3 if > 6m; NO RIG needed)');
    managementList.push('Tetanus booster if last dose > 5 years');
    managementList.push('Prophylactic Amoxicillin-Clavulanate 3-5 days for moderate-risk wounds');
  }

  return ddxList.join('\n');
}

// --- FORM HTML TEMPLATE ---
const ANIMAL_BITE_FORM_HTML = `
<div id="cc-animal-bite-section" class="hidden space-y-6">
  <!-- 💡 ส่วนต้น: ข้อแนะนำการปฐมพยาบาลและการล้างแผลเบื้องต้น -->
  <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs sm:text-sm text-amber-900 shadow-sm flex items-start space-x-3">
    <div class="text-amber-600 mt-0.5 flex-shrink-0">
      <i data-lucide="info" class="w-5 h-5"></i>
    </div>
    <div class="space-y-1">
      <div class="font-bold text-amber-950 flex items-center gap-1.5">
        <span>ข้อแนะนำการดูแลบาดแผลเบื้องต้นหลังถูกสัตว์กัดหรือข่วน:</span>
      </div>
      <ul class="list-disc pl-4 space-y-1 text-amber-800 text-xs">
        <li><strong>ล้างแผลด้วยน้ำสะอาดและสบู่ทันที:</strong> หากแผลไม่ได้มีเลือดไหลพุ่งรุนแรง ควรล้างบาดแผลด้วยน้ำสะอาดและฟอกสบู่หลายๆ ครั้ง เพื่อชะล้างเชื้อไวรัสพิษสุนัขบ้าและแบคทีเรียออกจากแผลให้มากที่สุด</li>
        <li><strong>กรณียังมีเลือดออกมาก:</strong> ให้ใช้ผ้าสะอาดหรือผ้าก๊อซกดลงบนบาดแผลโดยตรงให้แน่นและต่อเนื่องจนกว่าเลือดจะหยุด</li>
        <li><strong>ห้ามนำสมุนไพร ผงยา หรือสิ่งแปลกปลอมพอกแผล</strong> เพราะจะทำให้แผลติดเชื้อรุนแรงขึ้น</li>
      </ul>
    </div>
  </div>

  <!-- CARD 1: ข้อมูลเหตุการณ์ ชนิดของสัตว์ ลักษณะแผล/เลือดออก และสถานะของสัตว์ -->
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
        <i data-lucide="paw-print" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900">1. ข้อมูลเหตุการณ์ ชนิดของสัตว์ ลักษณะแผล และสถานะของสัตว์</h2>
        <p class="text-xs text-slate-500">ระยะเวลา ชนิดสัตว์ ลักษณะการสัมผัส สถานะเลือดออก และพฤติกรรมสัตว์</p>
      </div>
    </div>

    <!-- 1.1 ระยะเวลาที่เกิดเหตุ -->
    <div class="mb-5">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        1.1 เหตุการณ์ถูกสัตว์กัดหรือข่วนเกิดขึ้นมานานเท่าใด <span class="text-rose-500">*</span>
      </label>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div class="col-span-1 sm:col-span-2">
          <input type="number" id="biteDurationVal" min="1" max="365" placeholder="ระบุตัวเลข เช่น 30"
            class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white transition">
        </div>
        <div class="col-span-1">
          <select id="biteDurationUnit"
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

    <!-- 1.2 ชนิดของสัตว์ -->
    <div class="mb-5">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        1.2 ชนิดของสัตว์ที่กัด ข่วน หรือสัมผัสน้ำลาย (เลือกได้หลายข้อ):
      </label>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="biteAnimalTypes" value="dog"
            class="text-medical-600 focus:ring-medical-500 mr-2 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">สุนัข</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="biteAnimalTypes" value="cat"
            class="text-medical-600 focus:ring-medical-500 mr-2 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">แมว</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="biteAnimalTypes" value="bat"
            class="text-medical-600 focus:ring-medical-500 mr-2 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">ค้างคาว</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="biteAnimalTypes" value="other_mammal"
            onchange="toggleBiteGroup('biteAnimalOtherDetailContainer', this.checked)"
            class="text-medical-600 focus:ring-medical-500 mr-2 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">สัตว์อื่นๆ</span>
        </label>
      </div>
      <!-- ช่องพิมพ์ระบุสัตว์อื่นๆ -->
      <div id="biteAnimalOtherDetailContainer" class="hidden mt-2.5">
        <input type="text" id="biteAnimalOtherDetail" placeholder="พิมพ์ระบุชนิดสัตว์ เช่น หนู, กระรอก, กระต่าย, ลิง, วัว, ม้า..."
          class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white transition">
      </div>
    </div>

    <!-- 1.3 ลักษณะบาดแผล การสัมผัส และสถานะเลือดออก -->
    <div class="mb-5">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        1.3 ลักษณะบาดแผล และการสัมผัส (เลือกได้หลายข้อ):
      </label>
      <div class="space-y-2">
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="biteExposures" value="bite_wound"
            onchange="handleBiteBleedingContainerToggle()"
            class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">ถูกกัดหรือข่วนเป็นแผลฉีกขาด หรือแผลรอยเขี้ยวเจาะลึก</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="biteExposures" value="scratch_wound"
            onchange="handleBiteBleedingContainerToggle()"
            class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">ถูกกัดหรือข่วนเป็นรอยถลอก หรือรอยขีดข่วน</span>
        </label>

        <!-- Nested Bleeding Status Container -->
        <div id="biteBleedingStatusContainer" class="hidden ml-2 pl-3 border-l-2 border-medical-300 py-1 space-y-2">
          <span class="block text-xs font-bold text-slate-700">สถานะเลือดออกของบาดแผลที่ถูกกัดหรือข่วน:</span>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition cursor-pointer">
              <input type="radio" name="biteBleedingStatus" value="no_bleeding"
                class="text-medical-600 focus:ring-medical-500 mr-2 h-4 w-4">
              <span class="text-xs text-slate-800">ไม่มีเลือดออกเลย (เป็นเพียงรอยถลอกตื้นๆ)</span>
            </label>
            <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition cursor-pointer">
              <input type="radio" name="biteBleedingStatus" value="oozing_stopped"
                class="text-medical-600 focus:ring-medical-500 mr-2 h-4 w-4">
              <span class="text-xs text-slate-800">มีเลือดออกซึม แต่ขณะนี้หยุดไหลแล้ว</span>
            </label>
            <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition cursor-pointer">
              <input type="radio" name="biteBleedingStatus" value="oozing_active"
                class="text-medical-600 focus:ring-medical-500 mr-2 h-4 w-4">
              <span class="text-xs text-slate-800">ขณะนี้ยังมีเลือดไหลซึมออกจากแผลต่อเนื่อง</span>
            </label>
            <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition cursor-pointer">
              <input type="radio" name="biteBleedingStatus" value="pulsatile_massive"
                class="text-medical-600 focus:ring-medical-500 mr-2 h-4 w-4">
              <span class="text-xs text-slate-800">มีเลือดไหลพุ่งเป็นจังหวะ หรือออกมากผิดปกติ</span>
            </label>
          </div>
        </div>

        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="biteExposures" value="bruise_blunt"
            class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">ถูกงับเป็นรอยช้ำ หรือรอยบุ๋มบนผิวหนัง (ไม่มีแผลเปิดและไม่มีเลือดออก)</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="biteExposures" value="saliva_mucosa_wound"
            class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">ถูกสัตว์เลีย หรือน้ำลายกระเด็นเข้าตา ปาก จมูก หรือโดนแผลเปิดเดิม</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="biteExposures" value="saliva_intact_skin"
            class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">ถูกสัตว์เลียบนผิวหนังปกติ (ไม่มีแผลหรือรอยถลอก)</span>
        </label>
      </div>
    </div>

    <!-- 1.4 ข้อมูลสถานะและพฤติกรรมของสัตว์ -->
    <div class="mb-5">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        1.4 ข้อมูลสถานะและพฤติกรรมของสัตว์ที่กัด (เลือกได้หลายข้อ):
      </label>
      <div class="space-y-2">
        <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="biteAnimalBehavior" value="owned_quarantine_10d"
            class="text-medical-600 focus:ring-medical-500 mr-2.5 mt-0.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">เป็นสัตว์มีเจ้าของ เลี้ยงในบ้าน และสามารถกักขังเพื่อสังเกตอาการต่อหลังจากนี้ได้ครบ 10 วัน</span>
        </label>
        <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="biteAnimalBehavior" value="stray_disappeared"
            class="text-medical-600 focus:ring-medical-500 mr-2.5 mt-0.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">เป็นสัตว์จรจัด ไม่มีเจ้าของ หรือสัตว์หนีหายไปแล้วไม่สามารถติดตามดูอาการได้</span>
        </label>
        <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="biteAnimalBehavior" value="unprovoked_abnormal"
            class="text-medical-600 focus:ring-medical-500 mr-2.5 mt-0.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">สัตว์กัดโดยไม่มีสาเหตุจูงใจ (อยู่ดีๆ วิ่งเข้ามากัดเอง) หรือมีอาการดุร้ายผิดปกติ น้ำลายไหลยืด เดินโซเซ</span>
        </label>
        <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="biteAnimalBehavior" value="animal_died_killed"
            class="text-medical-600 focus:ring-medical-500 mr-2.5 mt-0.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">สัตว์ที่กัดตายแล้ว หรือถูกฆ่าตายหลังเกิดเหตุ</span>
        </label>
        <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="biteAnimalBehavior" value="animal_vaccinated_criteria"
            class="text-medical-600 focus:ring-medical-500 mr-2.5 mt-0.5 h-4 w-4 rounded flex-shrink-0">
          <div>
            <span class="text-xs sm:text-sm text-slate-800 font-medium block">สัตว์เคยได้รับวัคซีนป้องกันโรคพิษสุนัขบ้าตามเกณฑ์ที่กำหนด</span>
            <span class="text-[11px] text-slate-500 block mt-0.5">(ต้องเคยฉีดวัคซีนมาแล้วอย่างน้อย 2 ครั้ง และครั้งหลังสุดต้องฉีดมาแล้วไม่เกิน 1 ปี)</span>
          </div>
        </label>
      </div>
    </div>

    <!-- 1.5 การล้างแผลเบื้องต้น -->
    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        1.5 ได้ล้างแผลเบื้องต้นก่อนมาโรงพยาบาลหรือไม่:
      </label>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="biteWoundCleansing" value="cleaned_soap_water"
            class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4">
          <span class="text-xs sm:text-sm text-slate-800">ล้างด้วยน้ำสะอาดและฟอกสบู่แล้ว</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="biteWoundCleansing" value="cleaned_water_antiseptic_only"
            class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4">
          <span class="text-xs sm:text-sm text-slate-800">ล้างน้ำเปล่าหรือยาฆ่าเชื้อ (ไม่ได้ฟอกสบู่)</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="biteWoundCleansing" value="not_cleaned"
            class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4">
          <span class="text-xs sm:text-sm text-slate-800">ยังไม่ได้ล้างแผลเลย</span>
        </label>
      </div>
    </div>
  </div>

  <!-- CARD 2: ตำแหน่งของร่างกายที่ถูกกัด/ข่วน และอาการอักเสบติดเชื้อ -->
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
        <i data-lucide="user-check" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900">2. ตำแหน่งของร่างกายที่มีบาดแผล และอาการอักเสบติดเชื้อ</h2>
        <p class="text-xs text-slate-500">เลือกตำแหน่งที่ได้รับบาดเจ็บ ระบุข้างซ้าย/ขวา และอาการแทรกซ้อนเฉพาะที่</p>
      </div>
    </div>

    <div class="space-y-4">
      <!-- 2.1 ศีรษะ ใบหน้า ดวงตา หรือในช่องปาก -->
      <div class="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
        <label class="flex items-center space-x-2.5 cursor-pointer">
          <input type="checkbox" id="biteParentHeadFace"
            onchange="toggleBiteGroup('biteHeadSubGroup', this.checked)"
            class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded">
          <span class="text-xs sm:text-sm font-bold text-slate-900">2.1 บาดแผลที่ศีรษะ ใบหน้า ดวงตา หรือในช่องปาก</span>
        </label>

        <div id="biteHeadSubGroup" class="hidden mt-3 pl-6 border-l-2 border-medical-200 space-y-3">
          <span class="text-xs font-semibold text-slate-600 block">ระบุจุดย่อยและข้างที่มีแผล:</span>
          <div class="space-y-2">
            <!-- หนังศีรษะ -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1 border-b border-slate-100 gap-1">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="biteHeadScalp" onchange="toggleBiteGroup('biteHeadScalpSidesContainer', this.checked)" class="text-medical-600 rounded">
                <span class="text-slate-800">หนังศีรษะ / หน้าผาก / ท้ายทอย</span>
              </label>
              <div id="biteHeadScalpSidesContainer" class="hidden flex items-center space-x-3 pl-6 sm:pl-0">
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteHeadScalpSides" value="left" class="text-medical-600 rounded"><span>ซ้าย</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteHeadScalpSides" value="right" class="text-medical-600 rounded"><span>ขวา</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteHeadScalpSides" value="center" class="text-medical-600 rounded"><span>ตรงกลาง</span></label>
              </div>
            </div>
            <!-- ใบหน้า -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1 border-b border-slate-100 gap-1">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="biteHeadFace" onchange="toggleBiteGroup('biteHeadFaceSidesContainer', this.checked)" class="text-medical-600 rounded">
                <span class="text-slate-800">ใบหน้า / คิ้ว / แก้ม / คาง</span>
              </label>
              <div id="biteHeadFaceSidesContainer" class="hidden flex items-center space-x-3 pl-6 sm:pl-0">
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteHeadFaceSides" value="left" class="text-medical-600 rounded"><span>ซ้าย</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteHeadFaceSides" value="right" class="text-medical-600 rounded"><span>ขวา</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteHeadFaceSides" value="center" class="text-medical-600 rounded"><span>ตรงกลาง</span></label>
              </div>
            </div>
            <!-- ดวงตา -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1 border-b border-slate-100 gap-1">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="biteHeadEye" onchange="toggleBiteGroup('biteHeadEyeSidesContainer', this.checked)" class="text-medical-600 rounded">
                <span class="text-slate-800">ดวงตา / เปลือกตา</span>
              </label>
              <div id="biteHeadEyeSidesContainer" class="hidden flex items-center space-x-3 pl-6 sm:pl-0">
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteHeadEyeSides" value="left" class="text-medical-600 rounded"><span>ซ้าย</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteHeadEyeSides" value="right" class="text-medical-600 rounded"><span>ขวา</span></label>
              </div>
            </div>
            <!-- ใบหู -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1 border-b border-slate-100 gap-1">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="biteHeadEar" onchange="toggleBiteGroup('biteHeadEarSidesContainer', this.checked)" class="text-medical-600 rounded">
                <span class="text-slate-800">ใบหู</span>
              </label>
              <div id="biteHeadEarSidesContainer" class="hidden flex items-center space-x-3 pl-6 sm:pl-0">
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteHeadEarSides" value="left" class="text-medical-600 rounded"><span>ซ้าย</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteHeadEarSides" value="right" class="text-medical-600 rounded"><span>ขวา</span></label>
              </div>
            </div>
            <!-- จมูก/ปาก -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1 gap-1">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="biteHeadNoseMouth" onchange="toggleBiteGroup('biteHeadNoseMouthSidesContainer', this.checked)" class="text-medical-600 rounded">
                <span class="text-slate-800">จมูก / ริมฝีปาก / ในช่องปาก</span>
              </label>
              <div id="biteHeadNoseMouthSidesContainer" class="hidden flex items-center space-x-3 pl-6 sm:pl-0">
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteHeadNoseMouthSides" value="left" class="text-medical-600 rounded"><span>ซ้าย</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteHeadNoseMouthSides" value="right" class="text-medical-600 rounded"><span>ขวา</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteHeadNoseMouthSides" value="center" class="text-medical-600 rounded"><span>ตรงกลาง</span></label>
              </div>
            </div>
          </div>

          <!-- อาการสำคัญศีรษะ/ใบหน้า -->
          <div class="pt-2 border-t border-slate-200">
            <span class="text-xs font-semibold text-slate-700 block mb-1.5">อาการสำคัญที่พบร่วมด้วย:</span>
            <div class="space-y-1.5">
              <label class="flex items-start space-x-2 text-xs cursor-pointer text-slate-700">
                <input type="checkbox" name="biteHeadSigns" value="large_laceration_tissue_defect" class="mt-0.5 text-medical-600 rounded">
                <span>แผลฉีกขาดขนาดใหญ่ แผลลึกถึงกะโหลกศีรษะ หรือมีชิ้นเนื้อใบหน้า/ใบหู/ริมฝีปากแหว่งหายไป</span>
              </label>
              <label class="flex items-start space-x-2 text-xs cursor-pointer text-slate-700">
                <input type="checkbox" name="biteHeadSigns" value="eye_injury_vision_loss" class="mt-0.5 text-medical-600 rounded">
                <span>แผลถูกดวงตาโดยตรง ตาพร่ามัว มองไม่ชัด หรือลืมตาไม่ขึ้น</span>
              </label>
              <label class="flex items-start space-x-2 text-xs cursor-pointer text-slate-700">
                <input type="checkbox" name="biteHeadSigns" value="saliva_splash_eye" class="mt-0.5 text-medical-600 rounded">
                <span>โดนเลีย หรือน้ำลายสัตว์กระเด็นเข้าเยื่อบุตา</span>
              </label>
              <label class="flex items-start space-x-2 text-xs cursor-pointer text-slate-700">
                <input type="checkbox" name="biteHeadSigns" value="head_trauma_loc_vomit" class="mt-0.5 text-medical-600 rounded">
                <span>ศีรษะกระแทกพื้นร่วมด้วย มีอาการสลบ ปวดศีรษะรุนแรง หรืออาเจียน</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 2.2 ลำคอ -->
      <div class="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
        <label class="flex items-center space-x-2.5 cursor-pointer">
          <input type="checkbox" id="biteParentNeck"
            onchange="toggleBiteGroup('biteNeckSubGroup', this.checked)"
            class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded">
          <span class="text-xs sm:text-sm font-bold text-slate-900">2.2 บาดแผลที่ลำคอ</span>
        </label>

        <div id="biteNeckSubGroup" class="hidden mt-3 pl-6 border-l-2 border-medical-200 space-y-3">
          <span class="text-xs font-semibold text-slate-600 block">ระบุจุดย่อยและข้างที่มีแผล:</span>
          <div class="space-y-2">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1 border-b border-slate-100 gap-1">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="biteNeckFront" onchange="toggleBiteGroup('biteNeckFrontSidesContainer', this.checked)" class="text-medical-600 rounded">
                <span class="text-slate-800">ลำคอด้านหน้า</span>
              </label>
              <div id="biteNeckFrontSidesContainer" class="hidden flex items-center space-x-3 pl-6 sm:pl-0">
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteNeckFrontSides" value="left" class="text-medical-600 rounded"><span>ซ้าย</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteNeckFrontSides" value="right" class="text-medical-600 rounded"><span>ขวา</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteNeckFrontSides" value="center" class="text-medical-600 rounded"><span>ตรงกลาง</span></label>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1 border-b border-slate-100 gap-1">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="biteNeckSide" onchange="toggleBiteGroup('biteNeckSideSidesContainer', this.checked)" class="text-medical-600 rounded">
                <span class="text-slate-800">ลำคอด้านข้าง</span>
              </label>
              <div id="biteNeckSideSidesContainer" class="hidden flex items-center space-x-3 pl-6 sm:pl-0">
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteNeckSideSides" value="left" class="text-medical-600 rounded"><span>ซ้าย</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteNeckSideSides" value="right" class="text-medical-600 rounded"><span>ขวา</span></label>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1 gap-1">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="biteNeckBack" onchange="toggleBiteGroup('biteNeckBackSidesContainer', this.checked)" class="text-medical-600 rounded">
                <span class="text-slate-800">ต้นคอด้านหลัง</span>
              </label>
              <div id="biteNeckBackSidesContainer" class="hidden flex items-center space-x-3 pl-6 sm:pl-0">
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteNeckBackSides" value="left" class="text-medical-600 rounded"><span>ซ้าย</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteNeckBackSides" value="right" class="text-medical-600 rounded"><span>ขวา</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteNeckBackSides" value="center" class="text-medical-600 rounded"><span>ตรงกลาง</span></label>
              </div>
            </div>
          </div>

          <div class="pt-2 border-t border-slate-200">
            <span class="text-xs font-semibold text-slate-700 block mb-1.5">อาการสำคัญที่พบร่วมด้วย:</span>
            <div class="space-y-1.5">
              <label class="flex items-start space-x-2 text-xs cursor-pointer text-slate-700">
                <input type="checkbox" name="biteNeckSigns" value="deep_neck_wound_expanding_hematoma" class="mt-0.5 text-medical-600 rounded">
                <span>แผลถูกขย้ำลึกที่ลำคอ หรือมีก้อนเลือดบวมโตขึ้นอย่างรวดเร็วบริเวณคอ</span>
              </label>
              <label class="flex items-start space-x-2 text-xs cursor-pointer text-slate-700">
                <input type="checkbox" name="biteNeckSigns" value="stridor_dysphagia_air_leak" class="mt-0.5 text-medical-600 rounded">
                <span>หายใจลำบาก กลืนลำบาก เสียงแหบ หรือมีลม/ฟองอากาศปุดออกจากแผลที่คอ</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 2.3 หน้าอก หรือแผ่นหลังส่วนบน/สะบัก -->
      <div class="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
        <label class="flex items-center space-x-2.5 cursor-pointer">
          <input type="checkbox" id="biteParentChest"
            onchange="toggleBiteGroup('biteChestSubGroup', this.checked)"
            class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded">
          <span class="text-xs sm:text-sm font-bold text-slate-900">2.3 บาดแผลที่หน้าอก หรือแผ่นหลังส่วนบน/สะบัก</span>
        </label>

        <div id="biteChestSubGroup" class="hidden mt-3 pl-6 border-l-2 border-medical-200 space-y-3">
          <span class="text-xs font-semibold text-slate-600 block">ระบุจุดย่อยและข้างที่มีแผล:</span>
          <div class="space-y-2">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1 border-b border-slate-100 gap-1">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="biteChestFront" onchange="toggleBiteGroup('biteChestFrontSidesContainer', this.checked)" class="text-medical-600 rounded">
                <span class="text-slate-800">หน้าอก / ราวนม</span>
              </label>
              <div id="biteChestFrontSidesContainer" class="hidden flex items-center space-x-3 pl-6 sm:pl-0">
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteChestFrontSides" value="left" class="text-medical-600 rounded"><span>ซ้าย</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteChestFrontSides" value="right" class="text-medical-600 rounded"><span>ขวา</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteChestFrontSides" value="center" class="text-medical-600 rounded"><span>ตรงกลาง</span></label>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1 gap-1">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="biteChestUpperBack" onchange="toggleBiteGroup('biteChestUpperBackSidesContainer', this.checked)" class="text-medical-600 rounded">
                <span class="text-slate-800">แผ่นหลังส่วนบน / สะบัก</span>
              </label>
              <div id="biteChestUpperBackSidesContainer" class="hidden flex items-center space-x-3 pl-6 sm:pl-0">
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteChestUpperBackSides" value="left" class="text-medical-600 rounded"><span>ซ้าย</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteChestUpperBackSides" value="right" class="text-medical-600 rounded"><span>ขวา</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteChestUpperBackSides" value="center" class="text-medical-600 rounded"><span>ตรงกลาง</span></label>
              </div>
            </div>
          </div>

          <div class="pt-2 border-t border-slate-200">
            <label class="flex items-start space-x-2 text-xs cursor-pointer text-slate-700">
              <input type="checkbox" name="biteChestSigns" value="deep_chest_mauling_dyspnea" class="mt-0.5 text-medical-600 rounded">
              <span>แผลถูกขย้ำลึก หรือหายใจหอบเหนื่อย แน่นหน้าอก</span>
            </label>
          </div>
        </div>
      </div>

      <!-- 2.4 หน้าท้อง บั้นเอว หลังส่วนล่าง สะโพก หรืออวัยวะเพศ -->
      <div class="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
        <label class="flex items-center space-x-2.5 cursor-pointer">
          <input type="checkbox" id="biteParentAbdomen"
            onchange="toggleBiteGroup('biteAbdomenSubGroup', this.checked)"
            class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded">
          <span class="text-xs sm:text-sm font-bold text-slate-900">2.4 บาดแผลที่หน้าท้อง บั้นเอว หลังส่วนล่าง สะโพก หรืออวัยวะเพศ</span>
        </label>

        <div id="biteAbdomenSubGroup" class="hidden mt-3 pl-6 border-l-2 border-medical-200 space-y-3">
          <span class="text-xs font-semibold text-slate-600 block">ระบุจุดย่อยและข้างที่มีแผล:</span>
          <div class="space-y-2">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1 border-b border-slate-100 gap-1">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="biteAbdWall" onchange="toggleBiteGroup('biteAbdWallSidesContainer', this.checked)" class="text-medical-600 rounded">
                <span class="text-slate-800">หน้าท้อง</span>
              </label>
              <div id="biteAbdWallSidesContainer" class="hidden flex items-center space-x-3 pl-6 sm:pl-0">
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteAbdWallSides" value="left" class="text-medical-600 rounded"><span>ซ้าย</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteAbdWallSides" value="right" class="text-medical-600 rounded"><span>ขวา</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteAbdWallSides" value="center" class="text-medical-600 rounded"><span>ตรงกลาง</span></label>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1 border-b border-slate-100 gap-1">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="biteAbdFlank" onchange="toggleBiteGroup('biteAbdFlankSidesContainer', this.checked)" class="text-medical-600 rounded">
                <span class="text-slate-800">สีข้าง / บั้นเอว</span>
              </label>
              <div id="biteAbdFlankSidesContainer" class="hidden flex items-center space-x-3 pl-6 sm:pl-0">
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteAbdFlankSides" value="left" class="text-medical-600 rounded"><span>ซ้าย</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteAbdFlankSides" value="right" class="text-medical-600 rounded"><span>ขวา</span></label>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1 border-b border-slate-100 gap-1">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="biteAbdLowerBack" onchange="toggleBiteGroup('biteAbdLowerBackSidesContainer', this.checked)" class="text-medical-600 rounded">
                <span class="text-slate-800">หลังส่วนล่าง</span>
              </label>
              <div id="biteAbdLowerBackSidesContainer" class="hidden flex items-center space-x-3 pl-6 sm:pl-0">
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteAbdLowerBackSides" value="left" class="text-medical-600 rounded"><span>ซ้าย</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteAbdLowerBackSides" value="right" class="text-medical-600 rounded"><span>ขวา</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteAbdLowerBackSides" value="center" class="text-medical-600 rounded"><span>ตรงกลาง</span></label>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1 border-b border-slate-100 gap-1">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="biteAbdGluteal" onchange="toggleBiteGroup('biteAbdGlutealSidesContainer', this.checked)" class="text-medical-600 rounded">
                <span class="text-slate-800">สะโพก / ก้น</span>
              </label>
              <div id="biteAbdGlutealSidesContainer" class="hidden flex items-center space-x-3 pl-6 sm:pl-0">
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteAbdGlutealSides" value="left" class="text-medical-600 rounded"><span>ซ้าย</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteAbdGlutealSides" value="right" class="text-medical-600 rounded"><span>ขวา</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteAbdGlutealSides" value="center" class="text-medical-600 rounded"><span>ตรงกลาง</span></label>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1 gap-1">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="biteAbdGenitalia" onchange="toggleBiteGroup('biteAbdGenitaliaSidesContainer', this.checked)" class="text-medical-600 rounded">
                <span class="text-slate-800">ขาหนีบ / อวัยวะเพศ</span>
              </label>
              <div id="biteAbdGenitaliaSidesContainer" class="hidden flex items-center space-x-3 pl-6 sm:pl-0">
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteAbdGenitaliaSides" value="left" class="text-medical-600 rounded"><span>ซ้าย</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteAbdGenitaliaSides" value="right" class="text-medical-600 rounded"><span>ขวา</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteAbdGenitaliaSides" value="center" class="text-medical-600 rounded"><span>ตรงกลาง</span></label>
              </div>
            </div>
          </div>

          <div class="pt-2 border-t border-slate-200">
            <span class="text-xs font-semibold text-slate-700 block mb-1.5">อาการสำคัญที่พบร่วมด้วย:</span>
            <div class="space-y-1.5">
              <label class="flex items-start space-x-2 text-xs cursor-pointer text-slate-700">
                <input type="checkbox" name="biteAbdomenSigns" value="deep_abdominal_penetration" class="mt-0.5 text-medical-600 rounded">
                <span>แผลถูกกัดหรือข่วนฉีกขาดลึกที่หน้าท้อง</span>
              </label>
              <label class="flex items-start space-x-2 text-xs cursor-pointer text-slate-700">
                <input type="checkbox" name="biteAbdomenSigns" value="genital_injury" class="mt-0.5 text-medical-600 rounded">
                <span>บาดเจ็บหรือมีบาดแผลบริเวณอวัยวะเพศ</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 2.5 ไหล่ แขน ข้อศอก ข้อมือ หรือมือ/นิ้วมือ -->
      <div class="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
        <label class="flex items-center space-x-2.5 cursor-pointer">
          <input type="checkbox" id="biteParentUpperExtremity"
            onchange="toggleBiteGroup('biteUpperExtSubGroup', this.checked)"
            class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded">
          <span class="text-xs sm:text-sm font-bold text-slate-900">2.5 บาดแผลที่ไหล่ แขน ข้อศอก ข้อมือ หรือมือ/นิ้วมือ</span>
        </label>

        <div id="biteUpperExtSubGroup" class="hidden mt-3 pl-6 border-l-2 border-medical-200 space-y-3">
          <span class="text-xs font-semibold text-slate-600 block">ระบุจุดย่อยและข้างที่มีแผล:</span>
          <div class="space-y-2">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1 border-b border-slate-100 gap-1">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="biteArmShoulder" onchange="toggleBiteGroup('biteArmShoulderSidesContainer', this.checked)" class="text-medical-600 rounded">
                <span class="text-slate-800">หัวไหล่ / ต้นแขน</span>
              </label>
              <div id="biteArmShoulderSidesContainer" class="hidden flex items-center space-x-3 pl-6 sm:pl-0">
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteArmShoulderSides" value="left" class="text-medical-600 rounded"><span>ซ้าย</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteArmShoulderSides" value="right" class="text-medical-600 rounded"><span>ขวา</span></label>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1 border-b border-slate-100 gap-1">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="biteArmElbow" onchange="toggleBiteGroup('biteArmElbowSidesContainer', this.checked)" class="text-medical-600 rounded">
                <span class="text-slate-800">ข้อศอก / แขนท่อนล่าง</span>
              </label>
              <div id="biteArmElbowSidesContainer" class="hidden flex items-center space-x-3 pl-6 sm:pl-0">
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteArmElbowSides" value="left" class="text-medical-600 rounded"><span>ซ้าย</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteArmElbowSides" value="right" class="text-medical-600 rounded"><span>ขวา</span></label>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1 border-b border-slate-100 gap-1">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="biteArmWrist" onchange="toggleBiteGroup('biteArmWristSidesContainer', this.checked)" class="text-medical-600 rounded">
                <span class="text-slate-800">ข้อมือ / ฝ่ามือ / หลังมือ</span>
              </label>
              <div id="biteArmWristSidesContainer" class="hidden flex items-center space-x-3 pl-6 sm:pl-0">
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteArmWristSides" value="left" class="text-medical-600 rounded"><span>ซ้าย</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteArmWristSides" value="right" class="text-medical-600 rounded"><span>ขวา</span></label>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1 gap-1">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="biteArmFingers" onchange="toggleBiteGroup('biteArmFingersSidesContainer', this.checked)" class="text-medical-600 rounded">
                <span class="text-slate-800">นิ้วมือ</span>
              </label>
              <div id="biteArmFingersSidesContainer" class="hidden flex items-center space-x-3 pl-6 sm:pl-0">
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteArmFingersSides" value="left" class="text-medical-600 rounded"><span>ซ้าย</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteArmFingersSides" value="right" class="text-medical-600 rounded"><span>ขวา</span></label>
              </div>
            </div>
          </div>

          <div class="pt-2 border-t border-slate-200">
            <span class="text-xs font-semibold text-slate-700 block mb-1.5">อาการสำคัญที่พบร่วมด้วย:</span>
            <div class="space-y-1.5">
              <label class="flex items-start space-x-2 text-xs cursor-pointer text-slate-700">
                <input type="checkbox" name="biteUpperExtSigns" value="finger_joint_swelling_cannot_flex_extend" class="mt-0.5 text-medical-600 rounded">
                <span>ปวดบวมมากตามแนวข้อนิ้วมือ หรือขยับงอ/เหยียดนิ้วมือและข้อมือไม่ได้ตามปกติ</span>
              </label>
              <label class="flex items-start space-x-2 text-xs cursor-pointer text-slate-700">
                <input type="checkbox" name="biteUpperExtSigns" value="hand_numbness_loss_sensation" class="mt-0.5 text-medical-600 rounded">
                <span>มีอาการชา หรือไร้ความรู้สึกที่ฝ่ามือหรือปลายนิ้วมือ</span>
              </label>
              <label class="flex items-start space-x-2 text-xs cursor-pointer text-slate-700">
                <input type="checkbox" name="biteUpperExtSigns" value="tendon_bone_exposed_deformity" class="mt-0.5 text-medical-600 rounded">
                <span>แผลฉีกขาดลึกจนมองเห็นเส้นเอ็นหรือกระดูกโผล่ หรือแขน/มือผิดรูป</span>
              </label>
              <label class="flex items-start space-x-2 text-xs cursor-pointer text-slate-700">
                <input type="checkbox" name="biteUpperExtSigns" value="digit_amputation" class="mt-0.5 text-medical-600 rounded">
                <span>มีชิ้นส่วนของนิ้วมือขาดออกจากกัน</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 2.6 ต้นขา เข่า หน้าแข้ง น่อง ข้อเท้า หรือเท้า/นิ้วเท้า -->
      <div class="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
        <label class="flex items-center space-x-2.5 cursor-pointer">
          <input type="checkbox" id="biteParentLowerExtremity"
            onchange="toggleBiteGroup('biteLowerExtSubGroup', this.checked)"
            class="text-medical-600 focus:ring-medical-500 h-4 w-4 rounded">
          <span class="text-xs sm:text-sm font-bold text-slate-900">2.6 บาดแผลที่ต้นขา เข่า หน้าแข้ง น่อง ข้อเท้า หรือเท้า/นิ้วเท้า</span>
        </label>

        <div id="biteLowerExtSubGroup" class="hidden mt-3 pl-6 border-l-2 border-medical-200 space-y-3">
          <span class="text-xs font-semibold text-slate-600 block">ระบุจุดย่อยและข้างที่มีแผล:</span>
          <div class="space-y-2">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1 border-b border-slate-100 gap-1">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="biteLegThigh" onchange="toggleBiteGroup('biteLegThighSidesContainer', this.checked)" class="text-medical-600 rounded">
                <span class="text-slate-800">ต้นขา</span>
              </label>
              <div id="biteLegThighSidesContainer" class="hidden flex items-center space-x-3 pl-6 sm:pl-0">
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteLegThighSides" value="left" class="text-medical-600 rounded"><span>ซ้าย</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteLegThighSides" value="right" class="text-medical-600 rounded"><span>ขวา</span></label>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1 border-b border-slate-100 gap-1">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="biteLegKneeShin" onchange="toggleBiteGroup('biteLegKneeShinSidesContainer', this.checked)" class="text-medical-600 rounded">
                <span class="text-slate-800">เข่า / หน้าแข้ง / น่อง</span>
              </label>
              <div id="biteLegKneeShinSidesContainer" class="hidden flex items-center space-x-3 pl-6 sm:pl-0">
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteLegKneeShinSides" value="left" class="text-medical-600 rounded"><span>ซ้าย</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteLegKneeShinSides" value="right" class="text-medical-600 rounded"><span>ขวา</span></label>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1 border-b border-slate-100 gap-1">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="biteLegAnkleFoot" onchange="toggleBiteGroup('biteLegAnkleFootSidesContainer', this.checked)" class="text-medical-600 rounded">
                <span class="text-slate-800">ข้อเท้า / ฝ่าเท้า / หลังเท้า / ส้นเท้า</span>
              </label>
              <div id="biteLegAnkleFootSidesContainer" class="hidden flex items-center space-x-3 pl-6 sm:pl-0">
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteLegAnkleFootSides" value="left" class="text-medical-600 rounded"><span>ซ้าย</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteLegAnkleFootSides" value="right" class="text-medical-600 rounded"><span>ขวา</span></label>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1 gap-1">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="biteLegToes" onchange="toggleBiteGroup('biteLegToesSidesContainer', this.checked)" class="text-medical-600 rounded">
                <span class="text-slate-800">นิ้วเท้า</span>
              </label>
              <div id="biteLegToesSidesContainer" class="hidden flex items-center space-x-3 pl-6 sm:pl-0">
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteLegToesSides" value="left" class="text-medical-600 rounded"><span>ซ้าย</span></label>
                <label class="inline-flex items-center space-x-1 cursor-pointer"><input type="checkbox" name="biteLegToesSides" value="right" class="text-medical-600 rounded"><span>ขวา</span></label>
              </div>
            </div>
          </div>

          <div class="pt-2 border-t border-slate-200">
            <span class="text-xs font-semibold text-slate-700 block mb-1.5">อาการสำคัญที่พบร่วมด้วย:</span>
            <div class="space-y-1.5">
              <label class="flex items-start space-x-2 text-xs cursor-pointer text-slate-700">
                <input type="checkbox" name="biteLowerExtSigns" value="cannot_bear_weight_ankle_toe_deficit" class="mt-0.5 text-medical-600 rounded">
                <span>ปวดมากจนเดินลงน้ำหนักไม่ได้ หรือกระดกข้อเท้า/ขยับนิ้วเท้าไม่ได้</span>
              </label>
              <label class="flex items-start space-x-2 text-xs cursor-pointer text-slate-700">
                <input type="checkbox" name="biteLowerExtSigns" value="foot_numbness" class="mt-0.5 text-medical-600 rounded">
                <span>มีอาการชาที่เท้าหรือปลายนิ้วเท้า</span>
              </label>
              <label class="flex items-start space-x-2 text-xs cursor-pointer text-slate-700">
                <input type="checkbox" name="biteLowerExtSigns" value="leg_tendon_bone_exposed_deformity" class="mt-0.5 text-medical-600 rounded">
                <span>แผลฉีกขาดลึกจนมองเห็นเส้นเอ็นหรือกระดูกโผล่ หรือขา/ข้อเท้าผิดรูป</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 2.7 อาการอักเสบติดเชื้อบริเวณบาดแผล -->
      <div class="mt-4 pt-3 border-t border-slate-100">
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          2.7 อาการอักเสบติดเชื้อบริเวณบาดแผลในขณะนี้ (เลือกได้หลายข้อ):
        </label>
        <div class="space-y-2">
          <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
            <input type="checkbox" name="biteInfectionSigns" value="erythema_edema_throbbing_pain"
              class="text-medical-600 focus:ring-medical-500 mr-2.5 mt-0.5 h-4 w-4 rounded flex-shrink-0">
            <span class="text-xs sm:text-sm text-slate-800">รอบแผลบวม แดง ร้อน หรือปวดตุบๆ เพิ่มมากขึ้นเรื่อยๆ</span>
          </label>
          <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
            <input type="checkbox" name="biteInfectionSigns" value="pus_purulent_discharge"
              class="text-medical-600 focus:ring-medical-500 mr-2.5 mt-0.5 h-4 w-4 rounded flex-shrink-0">
            <span class="text-xs sm:text-sm text-slate-800">มีหนอง หรือน้ำเหลืองขุ่นมีกลิ่นเหม็นไหลซึมออกจากแผล</span>
          </label>
          <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
            <input type="checkbox" name="biteInfectionSigns" value="lymphangitis_lymphadenopathy"
              class="text-medical-600 focus:ring-medical-500 mr-2.5 mt-0.5 h-4 w-4 rounded flex-shrink-0">
            <span class="text-xs sm:text-sm text-slate-800">มีรอยแดงลามตามเส้นเลือดจากแผลขึ้นไปตามแขนหรือขา หรือมีก้อนนูนบวมเจ็บที่รักแร้/ขาหนีบ</span>
          </label>
          <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
            <input type="checkbox" name="biteInfectionSigns" value="no_local_infection"
              class="text-medical-600 focus:ring-medical-500 mr-2.5 mt-0.5 h-4 w-4 rounded flex-shrink-0">
            <span class="text-xs sm:text-sm text-slate-800">ไม่มีอาการบวมแดงร้อนหรือหนอง</span>
          </label>
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
        <p class="text-xs text-slate-500">ประเมินภาวะไข้ การติดเชื้อในกระแสเลือด และระดับความปวดบริเวณแผล</p>
      </div>
    </div>

    <!-- 3.1 อาการผิดปกติทางระบบร่างกาย -->
    <div class="mb-5">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        3.1 อาการผิดปกติของร่างกายที่พบร่วมด้วยในขณะนี้ (เลือกได้หลายข้อ):
      </label>
      <div class="space-y-2">
        <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="biteSystemicSigns" value="fever_chills"
            class="text-medical-600 focus:ring-medical-500 mr-2.5 mt-0.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">มีไข้ หนาวสั่น หรือครั่นเนื้อครั่นตัว</span>
        </label>
        <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="biteSystemicSigns" value="dizziness_presyncope_shock"
            class="text-medical-600 focus:ring-medical-500 mr-2.5 mt-0.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">หน้ามืด เวียนศีรษะ วูบ หรือใจสั่นเหงื่อแตกตัวเย็น</span>
        </label>
        <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="biteSystemicSigns" value="hydrophobia_aerophobia_agitation"
            class="text-medical-600 focus:ring-medical-500 mr-2.5 mt-0.5 h-4 w-4 rounded flex-shrink-0">
          <span class="text-xs sm:text-sm text-slate-800">มีอาการกลืนน้ำลำบาก กลัวน้ำ กลัวลม หรือกระสับกระส่ายผิดปกติ</span>
        </label>
        <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="checkbox" name="biteSystemicSigns" value="no_systemic_signs"
            class="text-medical-600 focus:ring-medical-500 mr-2.5 mt-0.5 h-4 w-4 rounded flex-shrink-0">
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
          <span id="bitePainScoreBadge" class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all">
            <span id="bitePainScoreEmoji" class="text-base">⚪</span>
            <span id="bitePainScoreText">ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)</span>
          </span>
          <button type="button" id="bitePainScoreClearBtn" onclick="clearBitePainScore()" class="hidden text-xs text-slate-400 hover:text-slate-600 underline">ล้างค่า</button>
        </div>
      </div>
      <div class="pt-2 px-1">
        <input type="range" id="bitePainScore" min="0" max="10" value="0"
          oninput="handleBitePainScoreChange(this.value)"
          class="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-600">
        <div class="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
          <span>0 ไม่ปวดเลย</span>
          <span>5 ปวดปานกลาง</span>
          <span>10 ปวดมากที่สุด</span>
        </div>
      </div>
    </div>
  </div>

  <!-- CARD 4: ประวัติวัคซีนพิษสุนัขบ้า และวัคซีนป้องกันโรคบาดทะยัก -->
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
      <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
        <i data-lucide="shield-plus" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900">4. ประวัติวัคซีนพิษสุนัขบ้า และวัคซีนป้องกันโรคบาดทะยัก</h2>
        <p class="text-xs text-slate-500">ข้อมูลประวัติวัคซีนเดิมในตัวผู้ป่วย เพื่อวางแผนการฉีดวัคซีนและเซรุ่ม RIG</p>
      </div>
    </div>

    <!-- 4.1 ประวัติวัคซีนพิษสุนัขบ้า -->
    <div class="mb-5">
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        4.1 ประวัติการฉีดวัคซีนป้องกันโรคพิษสุนัขบ้าในตัวผู้ป่วยเอง:
      </label>
      <div class="space-y-2">
        <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="biteRabiesVaccineHx" value="naive_or_incomplete"
            class="text-medical-600 focus:ring-medical-500 mr-2.5 mt-0.5 h-4 w-4">
          <span class="text-xs sm:text-sm text-slate-800">ไม่เคยฉีดวัคซีนพิษสุนัขบ้ามาก่อนเลย หรือเคยฉีดไม่ครบ (< 3 เข็ม)</span>
        </label>
        <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="biteRabiesVaccineHx" value="completed_last_within_3m"
            class="text-medical-600 focus:ring-medical-500 mr-2.5 mt-0.5 h-4 w-4">
          <span class="text-xs sm:text-sm text-slate-800">เคยฉีดวัคซีนพิษสุนัขบ้าครบคอร์ส (>= 3 เข็ม) โดยเข็มสุดท้าย หรือได้รับวัคซีนกระตุ้นมา ไม่เกิน 3 เดือน</span>
        </label>
        <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="biteRabiesVaccineHx" value="completed_last_3_to_6m"
            class="text-medical-600 focus:ring-medical-500 mr-2.5 mt-0.5 h-4 w-4">
          <span class="text-xs sm:text-sm text-slate-800">เคยฉีดวัคซีนพิษสุนัขบ้าครบคอร์ส (>= 3 เข็ม) โดยเข็มสุดท้าย หรือได้รับวัคซีนกระตุ้นมา ในช่วง 3 – 6 เดือน</span>
        </label>
        <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="biteRabiesVaccineHx" value="completed_last_over_6m"
            class="text-medical-600 focus:ring-medical-500 mr-2.5 mt-0.5 h-4 w-4">
          <span class="text-xs sm:text-sm text-slate-800">เคยฉีดวัคซีนพิษสุนัขบ้าครบคอร์ส (>= 3 เข็ม) โดยเข็มสุดท้าย หรือได้รับวัคซีนกระตุ้นมา นานเกิน 6 เดือนแล้ว</span>
        </label>
        <label class="selectable-card flex items-start p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="biteRabiesVaccineHx" value="unknown_or_unsure"
            class="text-medical-600 focus:ring-medical-500 mr-2.5 mt-0.5 h-4 w-4">
          <span class="text-xs sm:text-sm text-slate-800">จำประวัติการฉีดวัคซีนพิษสุนัขบ้าไม่ได้ / ไม่แน่ใจ</span>
        </label>
      </div>
    </div>

    <!-- 4.2 ประวัติวัคซีนป้องกันโรคบาดทะยัก -->
    <div>
      <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        4.2 ประวัติการฉีดวัคซีนป้องกันโรคบาดทะยัก:
      </label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="biteTetanusHx" value="within_5_years"
            class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4">
          <span class="text-xs sm:text-sm text-slate-800">ฉีดเข็มล่าสุดไม่เกิน 5 ปี</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="biteTetanusHx" value="5_to_10_years"
            class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4">
          <span class="text-xs sm:text-sm text-slate-800">ฉีดเข็มล่าสุด 5–10 ปี</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="biteTetanusHx" value="more_than_10_years"
            class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4">
          <span class="text-xs sm:text-sm text-slate-800">ฉีดเข็มล่าสุดนานเกิน 10 ปีแล้ว</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-medical-300 transition cursor-pointer">
          <input type="radio" name="biteTetanusHx" value="never_or_unsure"
            class="text-medical-600 focus:ring-medical-500 mr-2.5 h-4 w-4">
          <span class="text-xs sm:text-sm text-slate-800">ไม่เคยฉีด หรือจำไม่ได้/ไม่แน่ใจ</span>
        </label>
      </div>
    </div>
  </div>
</div>
`;

// --- MAIN MODULE REGISTRY OBJECT ---
const animalBiteModule = {
  id: 'animal_bite',
  recordCc: 'animal_bite',
  schemaCode: 'mammalian_bite',
  titleTh: 'สุนัข แมว สัตว์เลี้ยงลูกด้วยนมกัด',
  titleEn: 'Animal / Dog / Cat bites (Rabies risk)',
  icon: 'paw-print',
  algorithm: 'animal-bite-protocol',
  sectionDomId: 'cc-animal-bite-section',
  formHtml: ANIMAL_BITE_FORM_HTML,

  // --- Mounting & Event Listeners Hook ---
  onMounted: function() {
    clearBitePainScore();
  },

  // --- Collect Intake Hook ---
  collectIntake: function(ctx = {}) {
    const _rawDur = parseFloat(document.getElementById('biteDurationVal')?.value);
    const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
    const durationUnit = document.getElementById('biteDurationUnit')?.value || 'hours';

    const getChecks = (name) => {
      const arr = [];
      document.querySelectorAll(`input[name="${name}"]:checked`).forEach(c => arr.push(c.value));
      return arr;
    };

    const getRadio = (name) => {
      const el = document.querySelector(`input[name="${name}"]:checked`);
      return el ? el.value : null;
    };

    const getSubState = (parent, checkName, sidesName) => {
      if (!parent) return { checked: false, sides: [] };
      const cb = document.querySelector(`input[name="${checkName}"]`);
      const checked = cb ? cb.checked : false;
      const sides = [];
      if (checked && sidesName) {
        document.querySelectorAll(`input[name="${sidesName}"]:checked`).forEach(s => sides.push(s.value));
      }
      return { checked, sides };
    };

    const biteAnimalTypes = getChecks('biteAnimalTypes');
    const biteAnimalOtherDetail = document.getElementById('biteAnimalOtherDetail')?.value?.trim() || '';
    const biteExposures = getChecks('biteExposures');
    const biteBleedingStatus = getRadio('biteBleedingStatus');
    const biteAnimalBehavior = getChecks('biteAnimalBehavior');
    const biteWoundCleansing = getRadio('biteWoundCleansing');

    // 6 Anatomical Regions
    const parentHead = !!document.getElementById('biteParentHeadFace')?.checked;
    const sHeadScalp = getSubState(parentHead, 'biteHeadScalp', 'biteHeadScalpSides');
    const sHeadFace = getSubState(parentHead, 'biteHeadFace', 'biteHeadFaceSides');
    const sHeadEye = getSubState(parentHead, 'biteHeadEye', 'biteHeadEyeSides');
    const sHeadEar = getSubState(parentHead, 'biteHeadEar', 'biteHeadEarSides');
    const sHeadNoseMouth = getSubState(parentHead, 'biteHeadNoseMouth', 'biteHeadNoseMouthSides');
    const headSigns = parentHead ? getChecks('biteHeadSigns') : [];

    const parentNeck = !!document.getElementById('biteParentNeck')?.checked;
    const sNeckFront = getSubState(parentNeck, 'biteNeckFront', 'biteNeckFrontSides');
    const sNeckSide = getSubState(parentNeck, 'biteNeckSide', 'biteNeckSideSides');
    const sNeckBack = getSubState(parentNeck, 'biteNeckBack', 'biteNeckBackSides');
    const neckSigns = parentNeck ? getChecks('biteNeckSigns') : [];

    const parentChest = !!document.getElementById('biteParentChest')?.checked;
    const sChestFront = getSubState(parentChest, 'biteChestFront', 'biteChestFrontSides');
    const sChestUpperBack = getSubState(parentChest, 'biteChestUpperBack', 'biteChestUpperBackSides');
    const chestSigns = parentChest ? getChecks('biteChestSigns') : [];

    const parentAbd = !!document.getElementById('biteParentAbdomen')?.checked;
    const sAbdWall = getSubState(parentAbd, 'biteAbdWall', 'biteAbdWallSides');
    const sAbdFlank = getSubState(parentAbd, 'biteAbdFlank', 'biteAbdFlankSides');
    const sAbdLowerBack = getSubState(parentAbd, 'biteAbdLowerBack', 'biteAbdLowerBackSides');
    const sAbdGluteal = getSubState(parentAbd, 'biteAbdGluteal', 'biteAbdGlutealSides');
    const sAbdGenitalia = getSubState(parentAbd, 'biteAbdGenitalia', 'biteAbdGenitaliaSides');
    const abdSigns = parentAbd ? getChecks('biteAbdomenSigns') : [];

    const parentUpperExt = !!document.getElementById('biteParentUpperExtremity')?.checked;
    const sArmShoulder = getSubState(parentUpperExt, 'biteArmShoulder', 'biteArmShoulderSides');
    const sArmElbow = getSubState(parentUpperExt, 'biteArmElbow', 'biteArmElbowSides');
    const sArmWrist = getSubState(parentUpperExt, 'biteArmWrist', 'biteArmWristSides');
    const sArmFingers = getSubState(parentUpperExt, 'biteArmFingers', 'biteArmFingersSides');
    const upperSigns = parentUpperExt ? getChecks('biteUpperExtSigns') : [];

    const parentLowerExt = !!document.getElementById('biteParentLowerExtremity')?.checked;
    const sLegThigh = getSubState(parentLowerExt, 'biteLegThigh', 'biteLegThighSides');
    const sLegKneeShin = getSubState(parentLowerExt, 'biteLegKneeShin', 'biteLegKneeShinSides');
    const sLegAnkleFoot = getSubState(parentLowerExt, 'biteLegAnkleFoot', 'biteLegAnkleFootSides');
    const sLegToes = getSubState(parentLowerExt, 'biteLegToes', 'biteLegToesSides');
    const lowerSigns = parentLowerExt ? getChecks('biteLowerExtSigns') : [];

    const infectionSigns = getChecks('biteInfectionSigns');
    const systemicSigns = getChecks('biteSystemicSigns');
    const painScore = bitePainScoreTouched ? parseInt(document.getElementById('bitePainScore')?.value || 0, 10) : null;
    const rabiesHx = getRadio('biteRabiesVaccineHx');
    const tetanusHx = getRadio('biteTetanusHx');

    const otherSymptomsFree = document.getElementById('sx_other_free')?.value?.trim() || ctx.otherSymptomsFree || '';

    const rec = {
      id: ctx.recordId || ctx.id,
      queue_number: ctx.queueNumber || ctx.queue_number,
      hn: ctx.randomHn || ctx.hn,
      name: ctx.patientName || ctx.name,
      age: ctx.patientAge !== undefined ? ctx.patientAge : ctx.age,
      gender: ctx.gender,
      chief_complaint: 'animal_bite',
      chief_complaint_title: 'สุนัข แมว สัตว์เลี้ยงลูกด้วยนมกัด',
      timestamp: ctx.timestamp || new Date().toISOString(),
      status: ctx.recordStatus || ctx.status || 'waiting',
      durationVal: durationVal,
      durationUnit: durationUnit,
      hospRecordStatus: ctx.hospRecordStatus || 'unspecified',
      underlying: ctx.underlying || [],
      drugAllergy: ctx.drugAllergy || 'ไม่ได้ระบุ',
      currentMeds: ctx.currentMeds || 'ไม่ได้ระบุ',
      otherSymptomsFree: otherSymptomsFree,
      doctor_notes: ctx.preservedDoctorNotes || ctx.doctor_notes || { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: ctx.vital_signs || { bt: 36.8, sbp: 120, dbp: 80, bp: '120/80', pr: 80, rr: 18, spo2: 98 },
      esi_level: ctx.esi_level || 3,

      // Animal Bite Domain Specific Fields
      biteAnimalTypes: biteAnimalTypes,
      biteAnimalOtherDetail: biteAnimalOtherDetail,
      biteExposures: biteExposures,
      biteBleedingStatus: biteBleedingStatus,
      biteAnimalBehavior: biteAnimalBehavior,
      biteWoundCleansing: biteWoundCleansing,

      // 6 Anatomical Regions
      biteParentHeadFace: parentHead,
      biteHeadScalp: sHeadScalp.checked,
      biteHeadScalpSides: sHeadScalp.sides,
      biteHeadFace: sHeadFace.checked,
      biteHeadFaceSides: sHeadFace.sides,
      biteHeadEye: sHeadEye.checked,
      biteHeadEyeSides: sHeadEye.sides,
      biteHeadEar: sHeadEar.checked,
      biteHeadEarSides: sHeadEar.sides,
      biteHeadNoseMouth: sHeadNoseMouth.checked,
      biteHeadNoseMouthSides: sHeadNoseMouth.sides,
      biteHeadSigns: headSigns,

      biteParentNeck: parentNeck,
      biteNeckFront: sNeckFront.checked,
      biteNeckFrontSides: sNeckFront.sides,
      biteNeckSide: sNeckSide.checked,
      biteNeckSideSides: sNeckSide.sides,
      biteNeckBack: sNeckBack.checked,
      biteNeckBackSides: sNeckBack.sides,
      biteNeckSigns: neckSigns,

      biteParentChest: parentChest,
      biteChestFront: sChestFront.checked,
      biteChestFrontSides: sChestFront.sides,
      biteChestUpperBack: sChestUpperBack.checked,
      biteChestUpperBackSides: sChestUpperBack.sides,
      biteChestSigns: chestSigns,

      biteParentAbdomen: parentAbd,
      biteAbdWall: sAbdWall.checked,
      biteAbdWallSides: sAbdWall.sides,
      biteAbdFlank: sAbdFlank.checked,
      biteAbdFlankSides: sAbdFlank.sides,
      biteAbdLowerBack: sAbdLowerBack.checked,
      biteAbdLowerBackSides: sAbdLowerBack.sides,
      biteAbdGluteal: sAbdGluteal.checked,
      biteAbdGlutealSides: sAbdGluteal.sides,
      biteAbdGenitalia: sAbdGenitalia.checked,
      biteAbdGenitaliaSides: sAbdGenitalia.sides,
      biteAbdomenSigns: abdSigns,

      biteParentUpperExtremity: parentUpperExt,
      biteArmShoulder: sArmShoulder.checked,
      biteArmShoulderSides: sArmShoulder.sides,
      biteArmElbow: sArmElbow.checked,
      biteArmElbowSides: sArmElbow.sides,
      biteArmWrist: sArmWrist.checked,
      biteArmWristSides: sArmWrist.sides,
      biteArmFingers: sArmFingers.checked,
      biteArmFingersSides: sArmFingers.sides,
      biteUpperExtSigns: upperSigns,

      biteParentLowerExtremity: parentLowerExt,
      biteLegThigh: sLegThigh.checked,
      biteLegThighSides: sLegThigh.sides,
      biteLegKneeShin: sLegKneeShin.checked,
      biteLegKneeShinSides: sLegKneeShin.sides,
      biteLegAnkleFoot: sLegAnkleFoot.checked,
      biteLegAnkleFootSides: sLegAnkleFoot.sides,
      biteLegToes: sLegToes.checked,
      biteLegToesSides: sLegToes.sides,
      biteLowerExtSigns: lowerSigns,

      biteInfectionSigns: infectionSigns,
      biteSystemicSigns: systemicSigns,
      painScore: painScore,
      biteRabiesVaccineHx: rabiesHx,
      biteTetanusHx: tetanusHx
    };

    updateBiteOutputs(rec);
    return rec;
  },

  collectFormData: function(ctx = {}) {
    return this.collectIntake(ctx);
  },

  // --- Hydrate / Populate Hook ---
  hydrateForm: function(data = {}) {
    if (data.durationVal) {
      const valEl = document.getElementById('biteDurationVal');
      if (valEl) valEl.value = data.durationVal;
    }
    if (data.durationUnit) {
      const unitEl = document.getElementById('biteDurationUnit');
      if (unitEl) unitEl.value = data.durationUnit;
    }

    const setChecks = (name, vals) => {
      const arr = Array.isArray(vals) ? vals : [];
      document.querySelectorAll(`input[name="${name}"]`).forEach(c => {
        c.checked = arr.includes(c.value);
      });
    };

    const setRadio = (name, val) => {
      document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
        r.checked = (r.value === val);
      });
    };

    const setSubGroup = (parentCheckId, groupContainerId, isChecked) => {
      const p = document.getElementById(parentCheckId);
      if (p) {
        p.checked = !!isChecked;
        toggleBiteGroup(groupContainerId, !!isChecked);
      }
    };

    const setSubLocation = (checkName, sidesName, sidesContainerId, isChecked, sidesArr) => {
      const cb = document.querySelector(`input[name="${checkName}"]`);
      if (cb) {
        cb.checked = !!isChecked;
        toggleBiteGroup(sidesContainerId, !!isChecked);
      }
      setChecks(sidesName, sidesArr);
    };

    setChecks('biteAnimalTypes', data.biteAnimalTypes);
    const hasOtherAnimal = Array.isArray(data.biteAnimalTypes) && data.biteAnimalTypes.includes('other_mammal');
    toggleBiteGroup('biteAnimalOtherDetailContainer', hasOtherAnimal);
    const otherDetailEl = document.getElementById('biteAnimalOtherDetail');
    if (otherDetailEl) otherDetailEl.value = data.biteAnimalOtherDetail || '';

    setChecks('biteExposures', data.biteExposures);
    handleBiteBleedingContainerToggle();
    setRadio('biteBleedingStatus', data.biteBleedingStatus);
    setChecks('biteAnimalBehavior', data.biteAnimalBehavior);
    setRadio('biteWoundCleansing', data.biteWoundCleansing);

    // 6 Anatomical Regions
    setSubGroup('biteParentHeadFace', 'biteHeadSubGroup', data.biteParentHeadFace);
    setSubLocation('biteHeadScalp', 'biteHeadScalpSides', 'biteHeadScalpSidesContainer', data.biteHeadScalp, data.biteHeadScalpSides);
    setSubLocation('biteHeadFace', 'biteHeadFaceSides', 'biteHeadFaceSidesContainer', data.biteHeadFace, data.biteHeadFaceSides);
    setSubLocation('biteHeadEye', 'biteHeadEyeSides', 'biteHeadEyeSidesContainer', data.biteHeadEye, data.biteHeadEyeSides);
    setSubLocation('biteHeadEar', 'biteHeadEarSides', 'biteHeadEarSidesContainer', data.biteHeadEar, data.biteHeadEarSides);
    setSubLocation('biteHeadNoseMouth', 'biteHeadNoseMouthSides', 'biteHeadNoseMouthSidesContainer', data.biteHeadNoseMouth, data.biteHeadNoseMouthSides);
    setChecks('biteHeadSigns', data.biteHeadSigns);

    setSubGroup('biteParentNeck', 'biteNeckSubGroup', data.biteParentNeck);
    setSubLocation('biteNeckFront', 'biteNeckFrontSides', 'biteNeckFrontSidesContainer', data.biteNeckFront, data.biteNeckFrontSides);
    setSubLocation('biteNeckSide', 'biteNeckSideSides', 'biteNeckSideSidesContainer', data.biteNeckSide, data.biteNeckSideSides);
    setSubLocation('biteNeckBack', 'biteNeckBackSides', 'biteNeckBackSidesContainer', data.biteNeckBack, data.biteNeckBackSides);
    setChecks('biteNeckSigns', data.biteNeckSigns);

    setSubGroup('biteParentChest', 'biteChestSubGroup', data.biteParentChest);
    setSubLocation('biteChestFront', 'biteChestFrontSides', 'biteChestFrontSidesContainer', data.biteChestFront, data.biteChestFrontSides);
    setSubLocation('biteChestUpperBack', 'biteChestUpperBackSides', 'biteChestUpperBackSidesContainer', data.biteChestUpperBack, data.biteChestUpperBackSides);
    setChecks('biteChestSigns', data.biteChestSigns);

    setSubGroup('biteParentAbdomen', 'biteAbdomenSubGroup', data.biteParentAbdomen);
    setSubLocation('biteAbdWall', 'biteAbdWallSides', 'biteAbdWallSidesContainer', data.biteAbdWall, data.biteAbdWallSides);
    setSubLocation('biteAbdFlank', 'biteAbdFlankSides', 'biteAbdFlankSidesContainer', data.biteAbdFlank, data.biteAbdFlankSides);
    setSubLocation('biteAbdLowerBack', 'biteAbdLowerBackSides', 'biteAbdLowerBackSidesContainer', data.biteAbdLowerBack, data.biteAbdLowerBackSides);
    setSubLocation('biteAbdGluteal', 'biteAbdGlutealSides', 'biteAbdGlutealSidesContainer', data.biteAbdGluteal, data.biteAbdGlutealSides);
    setSubLocation('biteAbdGenitalia', 'biteAbdGenitaliaSides', 'biteAbdGenitaliaSidesContainer', data.biteAbdGenitalia, data.biteAbdGenitaliaSides);
    setChecks('biteAbdomenSigns', data.biteAbdomenSigns);

    setSubGroup('biteParentUpperExtremity', 'biteUpperExtSubGroup', data.biteParentUpperExtremity);
    setSubLocation('biteArmShoulder', 'biteArmShoulderSides', 'biteArmShoulderSidesContainer', data.biteArmShoulder, data.biteArmShoulderSides);
    setSubLocation('biteArmElbow', 'biteArmElbowSides', 'biteArmElbowSidesContainer', data.biteArmElbow, data.biteArmElbowSides);
    setSubLocation('biteArmWrist', 'biteArmWristSides', 'biteArmWristSidesContainer', data.biteArmWrist, data.biteArmWristSides);
    setSubLocation('biteArmFingers', 'biteArmFingersSides', 'biteArmFingersSidesContainer', data.biteArmFingers, data.biteArmFingersSides);
    setChecks('biteUpperExtSigns', data.biteUpperExtSigns);

    setSubGroup('biteParentLowerExtremity', 'biteLowerExtSubGroup', data.biteParentLowerExtremity);
    setSubLocation('biteLegThigh', 'biteLegThighSides', 'biteLegThighSidesContainer', data.biteLegThigh, data.biteLegThighSides);
    setSubLocation('biteLegKneeShin', 'biteLegKneeShinSides', 'biteLegKneeShinSidesContainer', data.biteLegKneeShin, data.biteLegKneeShinSides);
    setSubLocation('biteLegAnkleFoot', 'biteLegAnkleFootSides', 'biteLegAnkleFootSidesContainer', data.biteLegAnkleFoot, data.biteLegAnkleFootSides);
    setSubLocation('biteLegToes', 'biteLegToesSides', 'biteLegToesSidesContainer', data.biteLegToes, data.biteLegToesSides);
    setChecks('biteLowerExtSigns', data.biteLowerExtSigns);

    setChecks('biteInfectionSigns', data.biteInfectionSigns);
    setChecks('biteSystemicSigns', data.biteSystemicSigns);

    if (data.painScore !== null && data.painScore !== undefined) {
      const slider = document.getElementById('bitePainScore');
      if (slider) slider.value = data.painScore;
      handleBitePainScoreChange(data.painScore);
    } else {
      clearBitePainScore();
    }

    setRadio('biteRabiesVaccineHx', data.biteRabiesVaccineHx);
    setRadio('biteTetanusHx', data.biteTetanusHx);
  },

  populateForm: function(data = {}) {
    this.hydrateForm(data);
  },

  // --- Clear / Reset Hook ---
  clearForm: function() {
    ['biteDurationVal', 'biteAnimalOtherDetail'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = '';
    });
    const durUnit = document.getElementById('biteDurationUnit');
    if (durUnit) durUnit.value = 'hours';
    clearBitePainScore();

    [
      'biteAnimalOtherDetailContainer', 'biteBleedingStatusContainer',
      'biteHeadSubGroup', 'biteHeadScalpSidesContainer', 'biteHeadFaceSidesContainer', 'biteHeadEyeSidesContainer', 'biteHeadEarSidesContainer', 'biteHeadNoseMouthSidesContainer',
      'biteNeckSubGroup', 'biteNeckFrontSidesContainer', 'biteNeckSideSidesContainer', 'biteNeckBackSidesContainer',
      'biteChestSubGroup', 'biteChestFrontSidesContainer', 'biteChestUpperBackSidesContainer',
      'biteAbdomenSubGroup', 'biteAbdWallSidesContainer', 'biteAbdFlankSidesContainer', 'biteAbdLowerBackSidesContainer', 'biteAbdGlutealSidesContainer', 'biteAbdGenitaliaSidesContainer',
      'biteUpperExtSubGroup', 'biteArmShoulderSidesContainer', 'biteArmElbowSidesContainer', 'biteArmWristSidesContainer', 'biteArmFingersSidesContainer',
      'biteLowerExtSubGroup', 'biteLegThighSidesContainer', 'biteLegKneeShinSidesContainer', 'biteLegAnkleFootSidesContainer', 'biteLegToesSidesContainer'
    ].forEach(id => { const el = document.getElementById(id); if (el) el.classList.add('hidden'); });

    const radios = document.querySelectorAll('#cc-animal-bite-section input[type="radio"]');
    radios.forEach(r => { r.checked = false; });

    const checks = document.querySelectorAll('#cc-animal-bite-section input[type="checkbox"]');
    checks.forEach(c => { c.checked = false; });
  },

  resetForm: function() {
    this.clearForm();
  },

  isRedFlag: function(patient) {
    const rfs = evaluateBiteRedFlags(patient);
    return rfs.length > 0;
  },

  evaluateRedFlags: evaluateBiteRedFlags,
  updateOutputs: updateBiteOutputs,
  renderRapidHpi: renderBiteRapidHpi,
  renderNarrative: renderBiteNarrative,
  renderDoctorHpi: renderBiteDoctorHpi,
  generateCds: generateBiteCds,

  // --- Seed Patients Registry ---
  seedPatients: [
    // Case 1: Unprovoked stray dog mauling to face & neck in child, naive, WHO Cat III (ESI 2)
    {
      id: 'case-bite-01', queue_number: 'E2-107', hn: '7890701',
      name: 'ด.ช.ธีรเดช สุนัขจรจัดขย้ำแก้มขวาและลำคอเลือดซึม', age: 9, gender: 'ชาย',
      chief_complaint: 'animal_bite', chief_complaint_title: 'สุนัข แมว สัตว์เลี้ยงลูกด้วยนมกัด',
      timestamp: '2026-11-09T08:00:00.000Z', status: 'waiting',
      durationVal: 30, durationUnit: 'minutes', hospRecordStatus: 'self',
      underlying: [], drugAllergy: 'ปฏิเสธ', currentMeds: 'ไม่มี',
      otherSymptomsFree: 'เดินเล่นในซอยถูกสุนัขจรจัดวิ่งเข้ามากัดขย้ำแก้มขวา ริมฝีปาก และลำคอขวา แผลฉีกขาดลึกมีเลือดไหลซึมต่อเนื่อง สุนัขหนีหายไปแล้ว ยังไม่ได้ล้างแผล ไม่เคยฉีดวัคซีนพิษสุนัขบ้ามาก่อน',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.8, sbp: 105, dbp: 68, bp: '105/68', pr: 110, rr: 20, spo2: 99 },
      esi_level: 2,
      biteAnimalTypes: ['dog'], biteAnimalOtherDetail: '',
      biteExposures: ['bite_wound'], biteBleedingStatus: 'oozing_active',
      biteAnimalBehavior: ['stray_disappeared', 'unprovoked_abnormal'],
      biteWoundCleansing: 'not_cleaned',
      biteParentHeadFace: true, biteHeadScalp: false, biteHeadFace: true, biteHeadFaceSides: ['right'],
      biteHeadEye: false, biteHeadEar: false, biteHeadNoseMouth: true, biteHeadNoseMouthSides: ['right'],
      biteHeadSigns: ['large_laceration_tissue_defect'],
      biteParentNeck: true, biteNeckFront: false, biteNeckSide: true, biteNeckSideSides: ['right'], biteNeckBack: false,
      biteNeckSigns: ['deep_neck_wound_expanding_hematoma'],
      biteParentChest: false, biteParentAbdomen: false, biteParentUpperExtremity: false, biteParentLowerExtremity: false,
      biteInfectionSigns: ['no_local_infection'],
      biteSystemicSigns: ['no_systemic_signs'],
      painScore: 7, biteRabiesVaccineHx: 'naive_or_incomplete', biteTetanusHx: 'within_5_years'
    },

    // Case 2: Infected cat bite on left hand & index finger with suspected flexor tenosynovitis & fever (ESI 2)
    {
      id: 'case-bite-02', queue_number: 'E2-108', hn: '7890702',
      name: 'นางวาสนา แมวกัดฝ่ามือและนิ้วชี้ซ้ายบวมหนองแดงลามมีไข้', age: 52, gender: 'หญิง',
      chief_complaint: 'animal_bite', chief_complaint_title: 'สุนัข แมว สัตว์เลี้ยงลูกด้วยนมกัด',
      timestamp: '2026-11-09T08:30:00.000Z', status: 'waiting',
      durationVal: 2, durationUnit: 'days', hospRecordStatus: 'complete',
      underlying: ['เบาหวานชนิดที่ 2'], drugAllergy: 'ปฏิเสธ', currentMeds: 'Metformin 500 mg 1 tab po bid',
      otherSymptomsFree: 'ถูกแมวที่บ้านกัดจมเขี้ยวที่ฝ่ามือซ้ายและนิ้วชี้ซ้ายเมื่อ 2 วันก่อน วันนี้แผลบวมแดงร้อนมาก ปวดตุบๆ รุนแรง ขยับงอนิ้วชี้ไม่ได้ มีหนองซึม มีรอยแดงลามตามเส้นเลือด และมีไข้หนาวสั่น',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 38.6, sbp: 138, dbp: 82, bp: '138/82', pr: 104, rr: 18, spo2: 98 },
      esi_level: 2,
      biteAnimalTypes: ['cat'], biteAnimalOtherDetail: '',
      biteExposures: ['bite_wound'], biteBleedingStatus: 'oozing_stopped',
      biteAnimalBehavior: ['owned_quarantine_10d'],
      biteWoundCleansing: 'cleaned_soap_water',
      biteParentHeadFace: false, biteParentNeck: false, biteParentChest: false, biteParentAbdomen: false,
      biteParentUpperExtremity: true, biteArmShoulder: false, biteArmElbow: false, biteArmWrist: true, biteArmWristSides: ['left'],
      biteArmFingers: true, biteArmFingersSides: ['left'],
      biteUpperExtSigns: ['finger_joint_swelling_cannot_flex_extend'],
      biteParentLowerExtremity: false,
      biteInfectionSigns: ['erythema_edema_throbbing_pain', 'pus_purulent_discharge', 'lymphangitis_lymphadenopathy'],
      biteSystemicSigns: ['fever_chills'],
      painScore: 8, biteRabiesVaccineHx: 'completed_last_over_6m', biteTetanusHx: '5_to_10_years'
    },

    // Case 3: Stray dog bite to right calf with bleeding stopped, naive (ESI 3)
    {
      id: 'case-bite-03', queue_number: 'E3-104', hn: '7890703',
      name: 'นายกิตติศักดิ์ สุนัขจรจัดกัดน่องขวาเลือดหยุดแล้ว', age: 34, gender: 'ชาย',
      chief_complaint: 'animal_bite', chief_complaint_title: 'สุนัข แมว สัตว์เลี้ยงลูกด้วยนมกัด',
      timestamp: '2026-11-09T09:00:00.000Z', status: 'waiting',
      durationVal: 1, durationUnit: 'hours', hospRecordStatus: 'self',
      underlying: [], drugAllergy: 'ปฏิเสธ', currentMeds: 'ไม่มี',
      otherSymptomsFree: 'เดินผ่านซอยถูกสุนัขจรจัดกัดที่น่องขวาเป็นรอยเขี้ยวมีเลือดออกซึม แต่ขณะนี้เลือดหยุดไหลแล้ว ล้างน้ำและสบู่มาแล้ว ขยับข้อเท้าและเดินลงน้ำหนักได้ปกติ ไม่ชา ไม่เคยฉีดวัคซีนพิษสุนัขบ้ามาก่อน และฉีดบาดทะยักนานเกิน 10 ปีแล้ว',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.6, sbp: 122, dbp: 76, bp: '122/76', pr: 76, rr: 16, spo2: 99 },
      esi_level: 3,
      biteAnimalTypes: ['dog'], biteAnimalOtherDetail: '',
      biteExposures: ['bite_wound'], biteBleedingStatus: 'oozing_stopped',
      biteAnimalBehavior: ['stray_disappeared'],
      biteWoundCleansing: 'cleaned_soap_water',
      biteParentHeadFace: false, biteParentNeck: false, biteParentChest: false, biteParentAbdomen: false,
      biteParentUpperExtremity: false,
      biteParentLowerExtremity: true, biteLegThigh: false, biteLegKneeShin: true, biteLegKneeShinSides: ['right'],
      biteLegAnkleFoot: false, biteLegToes: false,
      biteLowerExtSigns: [],
      biteInfectionSigns: ['no_local_infection'],
      biteSystemicSigns: ['no_systemic_signs'],
      painScore: 5, biteRabiesVaccineHx: 'naive_or_incomplete', biteTetanusHx: 'more_than_10_years'
    },

    // Case 4: Pet cat superficial scratch on left forearm without bleeding, recent booster < 3m (ESI 4)
    {
      id: 'case-bite-04', queue_number: 'E3-105', hn: '7890704',
      name: 'นางสาวพิมพ์ใจ แมวข่วนแขนซ้ายเป็นรอยถลอกไม่มีเลือด', age: 26, gender: 'หญิง',
      chief_complaint: 'animal_bite', chief_complaint_title: 'สุนัข แมว สัตว์เลี้ยงลูกด้วยนมกัด',
      timestamp: '2026-11-09T09:30:00.000Z', status: 'waiting',
      durationVal: 2, durationUnit: 'hours', hospRecordStatus: 'self',
      underlying: [], drugAllergy: 'ปฏิเสธ', currentMeds: 'ไม่มี',
      otherSymptomsFree: 'ถูกแมวเลี้ยงในบ้านข่วนที่แขนท่อนล่างซ้ายขณะอุ้มอาบน้ำ เป็นรอยถลอกตื้นๆ ไม่มีเลือดออก ล้างน้ำและสบู่แล้ว แมวกักดูอาการต่อได้และฉีดวัคซีนตามเกณฑ์ ตัวผู้ป่วยเคยฉีดวัคซีนพิษสุนัขบ้าครบโดยได้รับเข็มสุดท้ายมาไม่เกิน 3 เดือน',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.7, sbp: 114, dbp: 72, bp: '114/72', pr: 72, rr: 16, spo2: 100 },
      esi_level: 4,
      biteAnimalTypes: ['cat'], biteAnimalOtherDetail: '',
      biteExposures: ['scratch_wound'], biteBleedingStatus: 'no_bleeding',
      biteAnimalBehavior: ['owned_quarantine_10d', 'animal_vaccinated_criteria'],
      biteWoundCleansing: 'cleaned_soap_water',
      biteParentHeadFace: false, biteParentNeck: false, biteParentChest: false, biteParentAbdomen: false,
      biteParentUpperExtremity: true, biteArmShoulder: false, biteArmElbow: true, biteArmElbowSides: ['left'],
      biteArmWrist: false, biteArmFingers: false,
      biteUpperExtSigns: [],
      biteParentLowerExtremity: false,
      biteInfectionSigns: ['no_local_infection'],
      biteSystemicSigns: ['no_systemic_signs'],
      painScore: 2, biteRabiesVaccineHx: 'completed_last_within_3m', biteTetanusHx: 'within_5_years'
    }
  ]
};

// Register module in Ratchaburi ER Core Registry
if (typeof registerCcModule === 'function') {
  registerCcModule(animalBiteModule);
} else if (typeof window !== 'undefined' && typeof window.registerCcModule === 'function') {
  window.registerCcModule(animalBiteModule);
}
