// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 07_stroke_deficit.js
// อาการนำ: ปากเบี้ยว อ่อนแรง ชา ข้างใดข้างหนึ่ง พูดไม่ชัด (Acute Stroke / Focal Neurological Deficit)
// ไฟล์นี้แยกอิสระสำหรับอาการนำ stroke_deficit เพื่อให้ทีมแพทย์และ IT โรงพยาบาลนำไปพัฒนาต่อได้โดยไม่กระทบระบบหลัก
// =========================================================================

function getStrokeDurationInMinutes(val, unit) {
  const num = parseFloat(val);
  if (isNaN(num) || num <= 0) return null;
  const mult = {
    minutes: 1,
    hours: 60,
    days: 1440,
    weeks: 10080,
    months: 43200,
    years: 525600
  }[unit] || 60;
  return num * mult;
}

function isStrokePatientWithin4_5Hours(p) {
  if (!p) return false;
  const mins = getStrokeDurationInMinutes(p.durationVal, p.durationUnit);
  return mins !== null && mins <= 270;
}

function handleStrokeOnsetContextChange() {
  const onsetCtx = document.querySelector('input[name="strokeOnsetContext"]:checked')?.value || '';
  toggleBranch('stroke_exact_time_wrap', onsetCtx === 'known_exact');
  toggleBranch('stroke_lsn_time_wrap', onsetCtx === 'wake_up_or_unknown');
  toggleBranch('stroke_transient_duration_wrap', onsetCtx === 'transient_resolved');
  checkStrokeFibrinolyticTrigger();
}

function handleStrokeWeaknessChange() {
  const isHemi = document.getElementById('stroke_weakness_hemi')?.checked || false;
  const isArm = document.getElementById('stroke_weakness_arm_only')?.checked || false;
  const isLeg = document.getElementById('stroke_weakness_leg_only')?.checked || false;
  const isBothLegs = document.getElementById('stroke_weakness_both_legs')?.checked || false;
  const hasAnyLimbWeakness = isHemi || isArm || isLeg || isBothLegs;

  toggleBranch('stroke_hemi_side_wrap', isHemi);
  toggleBranch('stroke_arm_side_wrap', isArm);
  toggleBranch('stroke_leg_side_wrap', isLeg);
  toggleBranch('stroke_weakness_severity_wrap', hasAnyLimbWeakness);

  if (!isHemi) {
    document.querySelectorAll('input[name="strokeHemiSide"]').forEach(r => { r.checked = false; });
  }
  if (!isArm) {
    document.querySelectorAll('input[name="strokeArmSide"]').forEach(r => { r.checked = false; });
  }
  if (!isLeg) {
    document.querySelectorAll('input[name="strokeLegSide"]').forEach(r => { r.checked = false; });
  }
  if (!hasAnyLimbWeakness) {
    document.querySelectorAll('input[name="strokeWeaknessSeverity"]').forEach(r => { r.checked = false; });
  }
  checkStrokeFibrinolyticTrigger();
}

function handleStrokeNumbnessChange() {
  const isNumb = document.getElementById('stroke_numbness_hemi')?.checked || false;
  toggleBranch('stroke_numbness_side_wrap', isNumb);
  if (!isNumb) {
    document.querySelectorAll('input[name="strokeNumbnessLoc"]').forEach(cb => { cb.checked = false; });
    document.querySelectorAll('input[name="strokeNumbnessSide"]').forEach(r => { r.checked = false; });
  }
}

function handleStrokeFaceChange() {
  const isFace = document.getElementById('stroke_face_droop')?.checked || false;
  toggleBranch('stroke_face_detail_wrap', isFace);
  if (!isFace) {
    document.querySelectorAll('input[name="strokeFaceSide"]').forEach(r => { r.checked = false; });
    document.querySelectorAll('input[name="strokeFaceUpperPattern"]').forEach(r => { r.checked = false; });
  }
}

function checkStrokeFibrinolyticTrigger() {
  const durVal = document.getElementById('strokeDurationVal')?.value;
  const durUnit = document.getElementById('strokeDurationUnit')?.value || 'hours';
  const mins = getStrokeDurationInMinutes(durVal, durUnit);
  const shouldOpen = mins !== null && mins <= 270;

  const section = document.getElementById('stroke_fibrinolytic_contra_section');
  if (section) {
    if (shouldOpen) section.classList.remove('hidden');
    else section.classList.add('hidden');
  }

  // Update auto-detected notice from already-answered questions in Cards 1-4 (no 'ข้อห้าม' or diagnostic bias on patient UI)
  const noticeEl = document.getElementById('stroke_auto_detected_ci_notice');
  if (noticeEl) {
    const autoItems = [];
    const hasSevereHa = document.getElementById('stroke_rf_severe_headache')?.checked || false;
    const hasStiffNeck = document.getElementById('stroke_rf_neck_stiffness')?.checked || false;
    const hasTearingPain = document.getElementById('stroke_pain_chest_back_tearing')?.checked || false;
    const hasSeizure = document.getElementById('stroke_rf_seizure')?.checked || false;
    const onsetCtx = document.querySelector('input[name="strokeOnsetContext"]:checked')?.value || '';
    const severity = document.querySelector('input[name="strokeWeaknessSeverity"]:checked')?.value || '';

    if (hasSevereHa || hasStiffNeck) {
      autoItems.push('มีอาการปวดศีรษะรุนแรงเฉียบพลัน หรือคอแข็งเกร็ง');
    }
    if (hasTearingPain) {
      autoItems.push('มีอาการเจ็บแน่นหน้าอก ปวดท้องรุนแรง หรือปวดทะลุกลางหลังรุนแรง');
    }
    if (hasSeizure) {
      autoItems.push('มีอาการชักเกร็งขณะเริ่มมีอาการ');
    }
    if (onsetCtx === 'transient_resolved') {
      autoItems.push('อาการเป็นชั่วคราวแล้วทุเลาลงจนหายเป็นปกติ');
    } else if (severity === 'mild') {
      autoItems.push('อาการอ่อนแรงเป็นเพียงเล็กน้อย');
    }

    if (shouldOpen && autoItems.length > 0) {
      noticeEl.classList.remove('hidden');
      noticeEl.innerHTML = `<strong>ข้อมูลจากคำถามก่อนหน้าที่ระบบบันทึกไว้ให้แพทย์ตรวจสอบแล้ว:</strong> ${autoItems.map(item => escapeHtml(item)).join(' • ')}`;
    } else {
      noticeEl.classList.add('hidden');
      noticeEl.innerHTML = '';
    }
  }

  updateSectionNumbering();
}

function evaluateStrokeFibrinolysisContraindications(patient) {
  const unitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durStr = patient.durationVal ? `${patient.durationVal} ${unitMap[patient.durationUnit] || 'ชั่วโมง'}` : 'ไม่ระบุ';
  const durationMinutes = getStrokeDurationInMinutes(patient.durationVal, patient.durationUnit);
  const isWithin4_5Hours = durationMinutes !== null && durationMinutes <= 270;

  let timeSummaryText = `ระยะเวลาตั้งแต่เริ่มมีอาการ/LSN: ${durStr}`;
  if (patient.strokeOnsetContext === 'known_exact') {
    const dtParts = [formatDateDdMmYyyy(patient.strokeExactDate), patient.strokeExactTime ? `${patient.strokeExactTime} น.` : ''].filter(Boolean).join(' เวลา ');
    timeSummaryText += ` • ทราบเวลาเริ่มมีอาการแน่นอน${dtParts ? ` (${dtParts})` : ''}`;
  } else if (patient.strokeOnsetContext === 'wake_up_or_unknown') {
    const lsnParts = [formatDateDdMmYyyy(patient.strokeLsnDate), patient.strokeLsnTime ? `${patient.strokeLsnTime} น.` : ''].filter(Boolean).join(' ');
    const discParts = [formatDateDdMmYyyy(patient.strokeDiscoveryDate), patient.strokeDiscoveryTime ? `${patient.strokeDiscoveryTime} น.` : ''].filter(Boolean).join(' ');
    timeSummaryText += ` • ตื่นมาพบ/ไม่ทราบเวลาแน่นอน [LSN: ${lsnParts || 'ไม่ระบุ'} | เวลาที่พบอาการ: ${discParts || 'ไม่ระบุ'}]`;
  } else if (patient.strokeOnsetContext === 'transient_resolved') {
    const trStr = patient.strokeTransientVal ? `${patient.strokeTransientVal} ${unitMap[patient.strokeTransientUnit] || 'นาที'}` : 'ไม่ระบุ';
    timeSummaryText += ` • อาการเป็นชั่วคราวแล้วทุเลาลงจนหายเป็นปกติ (ระยะเวลาที่เป็น: ${trStr})`;
  }

  const absoluteList = [];
  const relativeList = [];

  // Absolute Exclusion Criteria (from History + Auto-detected from Cards 1-4)
  if (patient.stroke_rf_severe_headache || patient.stroke_rf_neck_stiffness) {
    absoluteList.push('อาการทางคลินิกสงสัยภาวะเลือดออกใต้เยื่อหุ้มสมองชั้นกลาง (Suspected Subarachnoid Hemorrhage: ปวดศีรษะรุนแรงเฉียบพลัน / คอแข็งเกร็ง) [Auto-detected]');
  }
  if (patient.stroke_pain_chest_back_tearing) {
    absoluteList.push('มีอาการเจ็บแน่นหน้าอก ปวดท้องรุนแรง หรือปวดฉีกขาดทะลุกลางหลัง สงสัยหลอดเลือดแดงใหญ่ฉีกขาด (Suspected Acute Aortic Dissection) [Auto-detected]');
  }
  if (patient.stroke_ci_prior_ich) {
    absoluteList.push('มีประวัติเคยเกิดภาวะเลือดออกในกะโหลกศีรษะ / เลือดออกในสมองมาก่อน (Prior Intracranial Hemorrhage)');
  }
  if (patient.stroke_ci_brain_lesion) {
    absoluteList.push('มีรอยโรคในสมองเสี่ยงสูง เช่น Aneurysm ขนาดใหญ่, AVM หรือเนื้องอกในสมอง (High-risk Intracranial Lesion / Neoplasm)');
  }
  if (patient.stroke_ci_cns_surgery_trauma_3m) {
    absoluteList.push('เคยผ่าตัดสมองหรือไขสันหลัง หรือมีภาวะบาดเจ็บที่ศีรษะขั้นรุนแรง ภายใน 3 เดือน (CNS Surgery or Severe Head Trauma < 3 months)');
  }
  if (patient.stroke_ci_ischemic_stroke_3m) {
    absoluteList.push('มีประวัติโรคหลอดเลือดสมองตีบ (Ischemic Stroke) ภายใน 3 เดือน');
  }
  if (patient.stroke_ci_active_bleeding) {
    absoluteList.push('มีภาวะเลือดออกในอวัยวะภายในที่กำลังดำเนินอยู่ (Active Internal Bleeding)');
  }
  if (patient.stroke_ci_gi_bleed_malignancy_21d) {
    absoluteList.push('มีมะเร็งในทางเดินอาหาร (GI Malignancy) หรือมีประวัติเลือดออกในทางเดินอาหาร ภายใน 21 วัน');
  }
  if (patient.stroke_ci_anticoagulant) {
    absoluteList.push('ได้รับยาต้านการแข็งตัวของเลือด (DOAC/NOAC ภายใน 48 ชม., LMWH ขนาดรักษาภายใน 24 ชม., หรือ Warfarin ที่ต้องตรวจ INR > 1.7)');
  }

  // Relative Contraindications / Warnings & Other Considerations Not to Give Thrombolysis (from History + Auto-detected)
  if (patient.strokeOnsetContext === 'transient_resolved') {
    relativeList.push('อาการสมองขาดเลือดชั่วคราวที่ทุเลาลงจนหายเป็นปกติแล้ว (Transient Ischemic Attack - TIA) [Auto-detected — ข้อพิจารณาไม่ให้ยา]');
  } else if (patient.strokeWeaknessSeverity === 'mild') {
    relativeList.push('อาการทางระบบประสาทเป็นเพียงเล็กน้อยและไม่ทำให้ทุพพลภาพ (Nondisabling Minor Stroke) [Auto-detected — ข้อพิจารณาไม่ให้ยา]');
  }
  if (patient.stroke_rf_seizure) {
    relativeList.push('มีอาการชักขณะเริ่มมีอาการ (Seizure at onset) ที่สงสัยภาวะอ่อนแรงหลังชัก (Postictal Todd’s paralysis) [Auto-detected — ข้อพิจารณาไม่ให้ยา]');
  }
  const hasMigraineUd = Array.isArray(patient.underlying) && patient.underlying.some(u => u.includes('ไมเกรน') || u.toLowerCase().includes('migraine'));
  if (hasMigraineUd && patient.stroke_rf_severe_headache) {
    relativeList.push('มีประวัติโรคไมเกรนร่วมกับอาการปวดศีรษะในครั้งนี้ (Suspected Hemiplegic / Complex Migraine Mimic) [Auto-detected — ข้อพิจารณาไม่ให้ยา]');
  }
  if (patient.stroke_ci_major_surgery_trauma_14d) {
    relativeList.push('ได้รับการผ่าตัดใหญ่ภายนอกระบบประสาท หรือการบาดเจ็บรุนแรง ภายใน 14 วัน (Major non-CNS surgery or serious trauma < 14 days)');
  }
  if (patient.stroke_ci_arterial_puncture_7d) {
    relativeList.push('เคยได้รับการเจาะหลอดเลือดแดงในตำแหน่งที่กดห้ามเลือดไม่ได้ ภายใน 7 วัน (Non-compressible arterial puncture < 7 days)');
  }
  if (patient.stroke_ci_recent_mi_3m) {
    relativeList.push('มีประวัติภาวะกล้ามเนื้อหัวใจตายเฉียบพลัน (Acute Myocardial Infarction) ภายใน 3 เดือน (ระวัง Myocardial rupture และ Hemopericardium)');
  }
  if (patient.stroke_ci_pregnancy) {
    relativeList.push('สตรีตั้งครรภ์ (Pregnancy — พิจารณาให้ได้หากประโยชน์ในการลดความพิการสูงกว่าความเสี่ยงอย่างชัดเจน)');
  }

  return {
    isWithin4_5Hours,
    durationMinutes,
    timeSummaryText,
    absoluteList,
    relativeList
  };
}

    function updateStrokeOutputs(patient) {
      const unitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
      const durationText = patient.durationVal ? `${patient.durationVal} ${unitMap[patient.durationUnit] || 'ชั่วโมง'}` : 'ไม่ระบุ';

      const evalCi = evaluateStrokeFibrinolysisContraindications(patient);

      const onsetContextMap = {
        known_exact: `ทราบเวลาที่เริ่มมีอาการแน่นอน${(patient.strokeExactDate || patient.strokeExactTime) ? ` [วันที่ ${formatDateDdMmYyyy(patient.strokeExactDate) || '-'} เวลา ${formatTime24h(patient.strokeExactTime) || '-'} น.]` : ''}`,
        wake_up_or_unknown: `ตื่นนอนมาพบอาการ / ไม่ทราบเวลาเริ่มที่แน่นอน [เวลาสุดท้ายที่เห็นว่าปกติ (LSN): ${formatDateDdMmYyyy(patient.strokeLsnDate) || ''} ${patient.strokeLsnTime ? `${formatTime24h(patient.strokeLsnTime)} น.` : 'ไม่ระบุ'} | เวลาที่พบอาการ: ${formatDateDdMmYyyy(patient.strokeDiscoveryDate) || ''} ${patient.strokeDiscoveryTime ? `${formatTime24h(patient.strokeDiscoveryTime)} น.` : 'ไม่ระบุ'}]`,
        transient_resolved: `มีอาการเป็นชั่วคราวแล้วทุเลาลงจนหายเป็นปกติ [ระยะเวลาที่เป็น: ${patient.strokeTransientVal || '-'} ${unitMap[patient.strokeTransientUnit] || 'นาที'}]`,
        unspecified: 'ไม่ได้ระบุรูปแบบเวลาที่เริ่มมีอาการ'
      };

      const progressionMap = {
        sudden_maximal: 'เป็นขึ้นมาทันทีทันใด และอาการรุนแรงเต็มที่ตั้งแต่แรก (Sudden onset - maximal at onset)',
        gradual_worse: 'อาการค่อยๆ เป็นมากขึ้นเรื่อยๆ ตามลำดับเวลา (Progressive / Stepwise worsening)',
        fluctuating: 'อาการเป็นๆ หายๆ สลับดีขึ้นและแย่ลง (Fluctuating course)',
        unspecified: 'ไม่ได้ระบุการดำเนินโรค'
      };

      const sideMap = { left: 'ข้างซ้าย', right: 'ข้างขวา', both: 'ทั้งสองข้าง', none: '' };
      const severityMap = {
        complete_plegia: 'อ่อนแรงมากจนยกไม่ขึ้นเลย หรือขยับไม่ได้เลย (Complete paralysis / Plegia)',
        moderate_drift: 'พอยกได้บ้างแต่ตกลงมา หรือหยิบจับของหลุดมือ เดินลากขา (Moderate paresis / Drift)',
        mild: 'รู้สึกไม่มีแรงเพียงเล็กน้อย แต่ยังพอหยิบจับหรือเดินเองได้ (Mild weakness)',
        none: ''
      };

      const positives = [];
      const negatives = [];

      // 1. Time Window & Onset (Primary descriptors stay in top HPI; not pushed to positives)

      // 2. Motor Weakness
      const motorItems = [];
      if (patient.stroke_weakness_hemi) {
        const s = sideMap[patient.strokeHemiSide] ? ` [${sideMap[patient.strokeHemiSide]}]` : '';
        motorItems.push(`อ่อนแรงครึ่งซีกทั้งแขนและขาข้างเดียวกัน (Hemiparesis)${s} 🚩`);
      }
      if (patient.stroke_weakness_arm_only) {
        const s = sideMap[patient.strokeArmSide] ? ` [${sideMap[patient.strokeArmSide]}]` : '';
        motorItems.push(`อ่อนแรงเฉพาะแขนหรือมือข้างเดียว (Monoparesis - Upper limb)${s} 🚩`);
      }
      if (patient.stroke_weakness_leg_only) {
        const s = sideMap[patient.strokeLegSide] ? ` [${sideMap[patient.strokeLegSide]}]` : '';
        motorItems.push(`อ่อนแรงเฉพาะขาข้างเดียว (Monoparesis - Lower limb)${s} 🚩`);
      }
      if (patient.stroke_weakness_both_legs) {
        motorItems.push('อ่อนแรงขาทั้งสองข้างพร้อมกัน (Paraparesis) 🚩');
      }

      if (motorItems.length > 0) {
        const sev = severityMap[patient.strokeWeaknessSeverity] ? ` [${severityMap[patient.strokeWeaknessSeverity]}]` : '';
        positives.push(`${motorItems.join(', ')}${sev}`);
      } else {
        negatives.push('ไม่มีอาการแขนขาอ่อนแรง (กำลังแขนขาปกติ)');
      }

      // 3. Sensory & Pain Differential
      if (patient.stroke_numbness_hemi) {
        const numbLocMap = {
          face: 'ใบหน้า/รอบริมฝีปาก',
          arm: 'แขน/มือ',
          leg: 'ขา/เท้า',
          hemi: 'ซีกใดซีกหนึ่งของร่างกาย'
        };
        const locLabels = Array.isArray(patient.strokeNumbnessLocs) && patient.strokeNumbnessLocs.length > 0
          ? ` (ตำแหน่ง: ${patient.strokeNumbnessLocs.map(l => numbLocMap[l] || l).join(', ')})`
          : '';
        const s = sideMap[patient.strokeNumbnessSide] ? ` [${sideMap[patient.strokeNumbnessSide]}]` : '';
        positives.push(`มีอาการชาครึ่งซีก หรือความรู้สึกที่ใบหน้า/แขน/ขาลดลง${locLabels}${s} 🚩`);
      } else {
        negatives.push('ไม่มีอาการชาครึ่งซีก');
      }

      if (patient.stroke_pain_neck_radiating) {
        positives.push('มีอาการปวดต้นคอหรือสะบัก ร้าวลงแขนหรือมือข้างที่อ่อนแรง/ชา (Cervical radiculopathy differential)');
      }
      if (patient.stroke_pain_back_radiating) {
        positives.push('มีอาการปวดหลังหรือบั้นเอว ร้าวลงขาหรือเท้าข้างที่อ่อนแรง/ชา (Lumbosacral radiculopathy differential)');
      }
      if (patient.stroke_pain_limb_cold_pale) {
        positives.push('มีอาการปวดรุนแรงที่แขนหรือขาข้างที่อ่อนแรง ร่วมกับปลายมือ/ปลายเท้าซีดและเย็น (Suspected Acute Limb Ischemia 🚩)');
      }
      if (patient.stroke_pain_chest_back_tearing) {
        positives.push('มีอาการเจ็บแน่นหน้าอก ปวดท้องรุนแรง หรือปวดฉีกขาดทะลุกลางหลังรุนแรงร่วมด้วย (Suspected Acute Aortic Dissection 🚩)');
      }
      if (!patient.stroke_pain_neck_radiating && !patient.stroke_pain_back_radiating && !patient.stroke_pain_limb_cold_pale && !patient.stroke_pain_chest_back_tearing) {
        negatives.push('ไม่มีอาการปวดร้าวต้นคอ/หลัง, ไม่มีแขนขาซีดเย็น, ไม่มีเจ็บหน้าอก/ปวดท้อง/ปวดทะลุหลัง');
      }

      // 4. Facial Palsy, Speech, Bulbar & Vision
      if (patient.stroke_face_droop) {
        const fSide = sideMap[patient.strokeFaceSide] ? ` [${sideMap[patient.strokeFaceSide]}]` : '';
        let fPattern = '';
        if (patient.strokeFaceUpperPattern === 'forehead_spared') {
          fPattern = ' (ยังหลับตาสนิทและยักคิ้วได้ปกติ — Central CN VII pattern 🚩)';
        } else if (patient.strokeFaceUpperPattern === 'forehead_involved') {
          fPattern = ' (หลับตาไม่สนิทและยักคิ้วไม่ขึ้นในข้างที่ปากเบี้ยว — Peripheral CN VII / Bell’s Palsy pattern)';
        }
        positives.push(`มีมุมปากตก ปากเบี้ยว ยิ้มแล้วมุมปากไม่เท่ากัน${fSide}${fPattern}`);
      } else {
        negatives.push('ไม่มีมุมปากตกหรือปากเบี้ยว');
      }

      const speechItems = [];
      if (patient.stroke_speech_dysarthria) speechItems.push('พูดไม่ชัด ลิ้นแข็ง เสียงอ้อแอ้ (Dysarthria) 🚩');
      if (patient.stroke_speech_expressive_aphasia) speechItems.push('พูดไม่ออก นึกคำพูดไม่ได้ พูดเป็นคำสั้นๆ (Expressive aphasia) 🚩');
      if (patient.stroke_speech_receptive_aphasia) speechItems.push('ฟังคนอื่นพูดไม่เข้าใจ ตอบไม่ตรงคำถาม (Receptive aphasia) 🚩');
      if (speechItems.length > 0) {
        positives.push(speechItems.join(', '));
      } else {
        negatives.push('การพูดและการสื่อสารปกติ ไม่พูดอ้อแอ้ ไม่สับสนภาษา');
      }

      if (patient.stroke_has_dysphagia) {
        positives.push('มีอาการกลืนลำบาก หรือดื่มน้ำ/ทานอาหารแล้วสำลัก (Dysphagia) 🚩');
      } else {
        negatives.push('การกลืนปกติ ไม่มีกลืนสำลัก');
      }

      const visionItems = [];
      if (patient.stroke_vision_monocular) visionItems.push('ตามืดมัวลงเฉียบพลันข้างเดียว (Monocular blindness / Amaurosis fugax) 🚩');
      if (patient.stroke_vision_hemianopia) visionItems.push('ลานสายตามืดไปครึ่งซีก มองไม่เห็นด้านซ้ายหรือด้านขวา (Hemianopia) 🚩');
      if (patient.stroke_vision_diplopia) visionItems.push('มองเห็นภาพซ้อนเป็น 2 ภาพ (Diplopia) 🚩');
      if (visionItems.length > 0) {
        positives.push(visionItems.join(', '));
      } else {
        negatives.push('การมองเห็นปกติ ไม่มีภาพซ้อนหรือลานสายตามืดครึ่งซีก');
      }

      // 5. Card 4 Warning Signs
      if (patient.stroke_rf_altered_mental) positives.push('ซึมลง สับสน เรียกปลุกตื่นยาก หรือหมดสติ (Altered mental status) 🚩');
      else negatives.push('รู้สึกตัวดี ถามตอบรู้เรื่อง');

      if (patient.stroke_rf_severe_headache) positives.push('ปวดศีรษะรุนแรงเฉียบพลันร่วมด้วย (Severe headache) 🚩');
      else negatives.push('ไม่มีปวดศีรษะรุนแรงเฉียบพลัน');

      if (patient.stroke_rf_projectile_vomiting) positives.push('คลื่นไส้อาเจียนรุนแรง หรืออาเจียนพุ่ง (Projectile vomiting) 🚩');
      else negatives.push('ไม่มีอาเจียนพุ่ง');

      if (patient.stroke_rf_seizure) positives.push('มีอาการชักเกร็ง กระตุก หรือกัดลิ้นร่วมด้วย (Seizure at onset) 🚩');
      else negatives.push('ไม่มีอาการชักเกร็ง');

      if (patient.stroke_rf_ataxia_dizziness) positives.push('เวียนศีรษะบ้านหมุนรุนแรง ร่วมกับเดินเซมากหรือทรงตัวไม่ได้ (Severe vertigo / Ataxia) 🚩');
      else negatives.push('ไม่มีเวียนศีรษะบ้านหมุนหรือเดินเซ');

      if (patient.stroke_rf_neck_stiffness) positives.push('คอแข็งเกร็ง ก้มคอไม่ลง หรือมีไข้สูงร่วมด้วย (Neck stiffness / Fever) 🚩');
      else negatives.push('ไม่มีคอแข็งเกร็งหรือไข้สูง');

      if (patient.otherSymptomsFree) {
        positives.push(`อาการเพิ่มเติมที่ผู้ป่วยระบุ: "${patient.otherSymptomsFree}"`);
      }

      patient.pertinentPositives = positives.length > 0 ? positives : ['ไม่มีอาการร่วมผิดปกติ'];
      patient.pertinentNegatives = negatives;

      const hospLabel = {
        complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
        additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
        self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
        unspecified: 'ไม่ได้ระบุ'
      }[patient.hospRecordStatus] || 'ไม่ได้ระบุ';

      const docNotes = patient.doctor_notes || {};
      const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ' || patient.currentMeds === 'ไม่มี') ? 'ไม่มี' : patient.currentMeds;

      // A) Rapid Bullet Format for Stroke
      const defaultRapid =
`[Chief Complaint (CC)]
ปากเบี้ยว อ่อนแรง ชา ข้างใดข้างหนึ่ง พูดไม่ชัด มา ${durationText}

[History of Present Illness (HPI)]
• ระยะเวลาและกรอบเวลา (Time Window): ${durationText} (${evalCi.isWithin4_5Hours ? '⚡ ภายใน Golden Period ≤ 4.5 ชม.' : '⏰ เกิน 4.5 ชม.'})
• การเริ่มต้นและเวลาปกติครั้งสุดท้าย (LSN): ${onsetContextMap[patient.strokeOnsetContext] || 'ไม่ระบุ'}
• การดำเนินของอาการ: ${progressionMap[patient.strokeProgression] || 'ไม่ระบุ'}

• Pertinent Positives:
${positives.length > 0 ? positives.map(p => `  - ${p}`).join('\n') : '  - ไม่มีอาการร่วมอื่นที่เด่นชัด'}

• Pertinent Negatives:
${negatives.map(n => `  - ${n}`).join('\n')}

[IV Fibrinolysis (rt-PA / Tenecteplase) Contraindication Screening]
• Absolute Contraindications:
${evalCi.absoluteList.length > 0 ? evalCi.absoluteList.map(c => `  🛑 ${c}`).join('\n') : '  ✓ ไม่พบข้อห้ามเด็ดขาดจากประวัติผู้ป่วย'}
• Relative Contraindications / Warnings:
${evalCi.relativeList.length > 0 ? evalCi.relativeList.map(c => `  ⚠️ ${c}`).join('\n') : '  ✓ ไม่พบข้อห้ามสัมพัทธ์จากประวัติผู้ป่วย'}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• โรคประจำตัว (U/D): ${patient.underlying?.length > 0 ? patient.underlying.join(', ') : 'ปฏิเสธ'}
• ยาประจำตัว (Current Meds): ${medsText}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${patient.drugAllergy || 'ปฏิเสธ'}

[Emergency Risk Assessment (Red Flags)]
${patient.redFlags?.length > 0
  ? `🚩 RED FLAGS DETECTED:\n${patient.redFlags.map(rf => `  * ${rf.textTh}`).join('\n')}`
  : '✓ ไม่พบสัญญาณเตือนวิกฤตของโรคหลอดเลือดสมองเฉียบพลัน'}

[Doctor's Clinical Addendum & Exam]
• ประวัติเพิ่มเติม/แก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}
• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}
• แผนการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

      // B) Narrative Paragraph Format for Stroke
      const defaultNarrative =
`ผู้ป่วย [${patient.name}] อายุ ${patient.age || '-'} ปี เพศ ${patient.gender || 'ไม่ระบุ'} มารับการตรวจที่ห้องฉุกเฉิน รพ.ราชบุรี ด้วยอาการปากเบี้ยว อ่อนแรง ชา ข้างใดข้างหนึ่ง พูดไม่ชัด มา ${durationText}
รายละเอียดเวลาที่เริ่มมีอาการ: ${onsetContextMap[patient.strokeOnsetContext] || 'ไม่ระบุ'} ลักษณะการดำเนินโรค: ${progressionMap[patient.strokeProgression] || 'ไม่ระบุ'}

อาการร่วมและการซักประวัติตามระบบประสาท: ผู้ป่วยให้ประวัติ ${positives.join(', ')}
อาการสำคัญที่ปฏิเสธ (Pertinent negatives): ${negatives.join(', ')}

การคัดกรองข้อห้ามการให้ยาสลายลิ่มเลือด (IV Fibrinolysis): ข้อห้ามเด็ดขาดจากประวัติ: ${evalCi.absoluteList.length > 0 ? evalCi.absoluteList.join('; ') : 'ไม่พบ'} | ข้อควรระวังสัมพัทธ์: ${evalCi.relativeList.length > 0 ? evalCi.relativeList.join('; ') : 'ไม่พบ'}

ประวัติการเจ็บป่วยในอดีต: [${hospLabel}], โรคประจำตัว: ${patient.underlying?.length > 0 ? patient.underlying.join(', ') : 'ปฏิเสธ'}, ยาประจำตัว: ${medsText}, ประวัติแพ้ยา/แพ้อาหาร: ${patient.drugAllergy || 'ปฏิเสธประวัติแพ้ยา/แพ้อาหาร'}
${patient.redFlags?.length > 0 ? `\n[🚩 แจ้งเตือนสัญญาณเตือน (Red Flags)]: ตรวจพบอาการ ${patient.redFlags.map(rf => rf.textTh).join(', ')}` : ''}

[บันทึกการตรวจและการประเมินโดยแพทย์]:
${docNotes.additional_hpi ? `• ประวัติเพิ่มเติม: ${docNotes.additional_hpi}\n` : ''}${docNotes.physical_exam ? `• การตรวจร่างกาย: ${docNotes.physical_exam}\n` : ''}${docNotes.preliminary_dx ? `• การวินิจฉัย: ${docNotes.preliminary_dx}\n` : ''}${docNotes.plan ? `• แผนการรักษา: ${docNotes.plan}` : ''}`;

      document.getElementById('rapidTextView').value = patient.custom_rapid_note || defaultRapid;
      document.getElementById('narrativeTextView').value = patient.custom_narrative_note || defaultNarrative;

      // C) JSON Payload for Stroke
      const jsonPayload = {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "encounter": {
          "hospital_site": "Ratchaburi Hospital",
          "queue_id": patient.queue_number,
          "hn": patient.hn,
          "patient_name": patient.name,
          "age": patient.age,
          "gender": patient.gender,
          "timestamp": patient.timestamp,
          "status": patient.status,
          "triage_urgency_flag": patient.redFlags?.length > 0,
          "red_flags_count": patient.redFlags?.length || 0,
          "hospital_record_status": patient.hospRecordStatus
        },
        "chief_complaint": "stroke_deficit",
        "stroke_onset_and_time_window": {
          "duration_value": patient.durationVal || null,
          "duration_unit": patient.durationUnit || null,
          "duration_in_minutes": evalCi.durationMinutes,
          "within_4_5_hour_fast_track_window": evalCi.isWithin4_5Hours,
          "onset_context": patient.strokeOnsetContext,
          "exact_onset_datetime": {
            "date": formatDateDdMmYyyy(patient.strokeExactDate || ""),
            "time": formatTime24h(patient.strokeExactTime || "")
          },
          "last_seen_normal_and_discovery": {
            "lsn_date": formatDateDdMmYyyy(patient.strokeLsnDate || ""),
            "lsn_time": formatTime24h(patient.strokeLsnTime || ""),
            "discovery_date": formatDateDdMmYyyy(patient.strokeDiscoveryDate || ""),
            "discovery_time": formatTime24h(patient.strokeDiscoveryTime || "")
          },
          "transient_episode_duration": {
            "value": patient.strokeTransientVal || null,
            "unit": patient.strokeTransientUnit || ""
          },
          "symptom_progression": patient.strokeProgression
        },
        "motor_sensory_and_pain_differential": {
          "hemiparesis": {
            "present": Boolean(patient.stroke_weakness_hemi),
            "side": patient.strokeHemiSide || "none"
          },
          "arm_monoparesis": {
            "present": Boolean(patient.stroke_weakness_arm_only),
            "side": patient.strokeArmSide || "none"
          },
          "leg_monoparesis": {
            "present": Boolean(patient.stroke_weakness_leg_only),
            "side": patient.strokeLegSide || "none"
          },
          "paraparesis_both_legs": Boolean(patient.stroke_weakness_both_legs),
          "facial_palsy": {
            "present": Boolean(patient.stroke_face_droop),
            "side": patient.strokeFaceSide || "none",
            "upper_face_pattern": patient.strokeFaceUpperPattern || "none"
          },
          "weakness_severity": patient.strokeWeaknessSeverity || "none",
          "sensory_loss_or_numbness": {
            "present": Boolean(patient.stroke_numbness_hemi),
            "locations": patient.strokeNumbnessLocs || [],
            "side": patient.strokeNumbnessSide || "none"
          },
          "associated_pain_differential": {
            "neck_radiating_to_arm_radiculopathy": Boolean(patient.stroke_pain_neck_radiating),
            "back_radiating_to_leg_radiculopathy": Boolean(patient.stroke_pain_back_radiating),
            "severe_limb_pain_with_pallor_coldness_ali": Boolean(patient.stroke_pain_limb_cold_pale),
            "chest_abdominal_or_tearing_back_pain_aortic_dissection": Boolean(patient.stroke_pain_chest_back_tearing)
          }
        },
        "speech_bulbar_and_visual_deficits": {
          "speech_and_language": {
            "dysarthria": Boolean(patient.stroke_speech_dysarthria),
            "expressive_aphasia": Boolean(patient.stroke_speech_expressive_aphasia),
            "receptive_aphasia": Boolean(patient.stroke_speech_receptive_aphasia)
          },
          "dysphagia": Boolean(patient.stroke_has_dysphagia),
          "visual_symptoms": {
            "monocular_vision_loss": Boolean(patient.stroke_vision_monocular),
            "hemianopia": Boolean(patient.stroke_vision_hemianopia),
            "diplopia": Boolean(patient.stroke_vision_diplopia)
          }
        },
        "neurological_warning_signs": {
          "altered_mental_status": Boolean(patient.stroke_rf_altered_mental),
          "severe_or_thunderclap_headache": Boolean(patient.stroke_rf_severe_headache),
          "projectile_vomiting": Boolean(patient.stroke_rf_projectile_vomiting),
          "seizure_at_onset": Boolean(patient.stroke_rf_seizure),
          "severe_vertigo_or_ataxia": Boolean(patient.stroke_rf_ataxia_dizziness),
          "neck_stiffness_or_fever": Boolean(patient.stroke_rf_neck_stiffness),
          "other_symptoms_free_text": patient.otherSymptomsFree || ""
        },
        "fibrinolysis_contraindication_screening": {
          "auto_triggered_by_4_5_hr_window": evalCi.isWithin4_5Hours,
          "absolute_contraindications_detected": evalCi.absoluteList,
          "relative_contraindications_detected": evalCi.relativeList,
          "raw_history_criteria": {
            "prior_ich": Boolean(patient.stroke_ci_prior_ich),
            "high_risk_brain_lesion_aneurysm_avm_tumor": Boolean(patient.stroke_ci_brain_lesion),
            "cns_surgery_or_severe_head_trauma_within_3m": Boolean(patient.stroke_ci_cns_surgery_trauma_3m),
            "ischemic_stroke_within_3m": Boolean(patient.stroke_ci_ischemic_stroke_3m),
            "active_internal_bleeding": Boolean(patient.stroke_ci_active_bleeding),
            "gi_malignancy_or_gi_bleed_within_21d": Boolean(patient.stroke_ci_gi_bleed_malignancy_21d),
            "anticoagulant_use": Boolean(patient.stroke_ci_anticoagulant),
            "major_non_cns_surgery_or_trauma_within_14d": Boolean(patient.stroke_ci_major_surgery_trauma_14d),
            "acute_mi_within_3m": Boolean(patient.stroke_ci_recent_mi_3m),
            "non_compressible_arterial_puncture_within_7d": Boolean(patient.stroke_ci_arterial_puncture_7d),
            "pregnancy": Boolean(patient.stroke_ci_pregnancy)
          }
        },
        "red_flags_detected": patient.redFlags?.map(rf => ({ code: rf.key, label: rf.textTh, clinical_risk: rf.risk })) || [],
        "pertinent_positives": positives,
        "pertinent_negatives": negatives,
        "patient_background": {
          "hospital_record_status": patient.hospRecordStatus,
          "underlying_diseases": patient.underlying,
          "drug_and_food_allergies": patient.drugAllergy,
          "current_medications": patient.currentMeds
        },
        "doctor_clinical_addendum": {
          "additional_or_corrected_history": docNotes.additional_hpi || "",
          "vitals_and_physical_exam": docNotes.physical_exam || "",
          "provisional_diagnosis": docNotes.preliminary_dx || "",
          "treatment_plan": docNotes.plan || ""
        }
      };

      document.getElementById('jsonViewer').textContent = JSON.stringify(jsonPayload, null, 2);
    }


registerCcModule({
  id: 'stroke_deficit',
  recordCc: 'stroke_deficit',
  titleTh: 'ปากเบี้ยว อ่อนแรง ชา ข้างใดข้างหนึ่ง พูดไม่ชัด',
  titleEn: 'Acute Stroke / Focal Neurological Deficit',
  sectionDomId: 'strokeQuestionnaireSection',
  doctorCcBadgeHtml: "<i data-lucide=\"brain\" class=\"w-3 h-3 mr-1\"></i> CC: ปากเบี้ยว อ่อนแรง ชา ข้างใดข้างหนึ่ง พูดไม่ชัด (Acute Stroke)",
  formHtml: "        <div id=\"strokeQuestionnaireSection\" class=\"hidden space-y-6\">\n\n          <!-- CARD 1: ระยะเวลาที่เริ่มมีอาการ และเวลาสุดท้ายที่เห็นว่าปกติ (Timing, Onset Mode & LSN) -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"clock\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-800 section-title\" data-base-title=\"ระยะเวลาที่เริ่มมีอาการ และเวลาสุดท้ายที่เห็นว่าปกติ\">1. ระยะเวลาที่เริ่มมีอาการ และเวลาสุดท้ายที่เห็นว่าปกติ</h2>\n                <p class=\"text-xs text-slate-500\">ข้อมูลเวลามีความสำคัญอย่างยิ่งต่อการพิจารณาให้ยาสลายลิ่มเลือดและการรักษาเร่งด่วน</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-5\">\n              <!-- 1.1 ระยะเวลาที่เป็นมา -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">\n                  ระยะเวลาที่มีอาการผิดปกติจนถึงปัจจุบัน <span class=\"text-rose-500\">*</span>\n                </label>\n                <div class=\"flex items-center space-x-2 max-w-xs\">\n                  <input type=\"number\" id=\"strokeDurationVal\" min=\"1\" placeholder=\"ระบุตัวเลข เช่น 1\" oninput=\"checkStrokeFibrinolyticTrigger()\"\n                    class=\"w-36 bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 text-sm font-semibold placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-medical-500\">\n                  <select id=\"strokeDurationUnit\" onchange=\"checkStrokeFibrinolyticTrigger()\"\n                    class=\"bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-medical-500\">\n                    <option value=\"minutes\">นาที</option>\n                    <option value=\"hours\" selected>ชั่วโมง</option>\n                    <option value=\"days\">วัน</option>\n                    <option value=\"weeks\">สัปดาห์</option>\n                    <option value=\"months\">เดือน</option>\n                    <option value=\"years\">ปี</option>\n                  </select>\n                </div>\n              </div>\n\n              <!-- 1.2 รูปแบบเวลาที่เริ่มมีอาการ -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">\n                  รูปแบบเวลาที่เริ่มมีอาการ (Onset Mode) <span class=\"text-rose-500\">*</span>\n                </label>\n                <div class=\"grid grid-cols-1 gap-2.5 text-xs\">\n                  <!-- ทราบเวลาแน่นอน -->\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"strokeOnsetContext\" value=\"known_exact\" onchange=\"handleStrokeOnsetContextChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ทราบเวลาที่เริ่มมีอาการแน่นอน</span>\n                      <span class=\"text-[11px] text-slate-500\">มีอาการเกิดขึ้นขณะตื่นอยู่ และสามารถระบุวันที่และเวลาที่เริ่มเป็นได้ชัดเจน</span>\n                    </div>\n                  </label>\n\n                  <!-- กิ่งย่อย 1: เลือกวันที่และเวลาที่เริ่มมีอาการแน่นอน -->\n                  <div id=\"stroke_exact_time_wrap\" class=\"hidden ml-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs\">\n                    <span class=\"font-semibold text-slate-800 block\">ระบุวันที่และเวลาที่เริ่มมีอาการ:</span>\n                    <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md\">\n                      <div>\n                        <label class=\"block text-[11px] text-slate-600 mb-1\">วันที่เริ่มมีอาการ: <span class=\"text-[10px] text-slate-500 font-normal\">(วว/ดด/ปปปป)</span></label>\n                        <input type=\"text\" id=\"strokeExactDate\" data-universal-date=\"true\" placeholder=\"วว/ดด/ปปปป (dd/mm/yyyy)\" autocomplete=\"off\" onchange=\"checkStrokeFibrinolyticTrigger()\" class=\"w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 text-xs\">\n                      </div>\n                      <div>\n                        <label class=\"block text-[11px] text-slate-600 mb-1\">เวลาที่เริ่มมีอาการ: <span class=\"text-[10px] text-slate-500 font-normal\">(ระบบ 24 ชม. เช่น 14:30)</span></label>\n                        <input type=\"text\" id=\"strokeExactTime\" data-universal-time=\"true\" placeholder=\"เช่น 14:30 (24 ชม.)\" autocomplete=\"off\" onchange=\"checkStrokeFibrinolyticTrigger()\" class=\"w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 text-xs\">\n                      </div>\n                    </div>\n                  </div>\n\n                  <!-- ไม่ทราบเวลาแน่นอน หรือตื่นมาพบ -->\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"strokeOnsetContext\" value=\"wake_up_or_unknown\" onchange=\"handleStrokeOnsetContextChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ไม่ทราบเวลาที่แน่นอน หรือตื่นนอนมาแล้วพบว่ามีอาการ</span>\n                      <span class=\"text-[11px] text-slate-500\">เข้านอนแล้วยังปกติแต่ตื่นมาพบว่ามีอาการ หรือมีผู้มาพบเห็นอาการผิดปกติในภายหลัง</span>\n                    </div>\n                  </label>\n\n                  <!-- กิ่งย่อย 2: ระบุทั้งเวลาสุดท้ายที่เห็นว่าปกติ (LSN) และเวลาที่รู้ตัวว่ามีอาการ -->\n                  <div id=\"stroke_lsn_time_wrap\" class=\"hidden ml-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3.5 text-xs\">\n                    <div class=\"space-y-1.5\">\n                      <span class=\"font-semibold text-slate-800 block\">1) เวลาสุดท้ายที่เห็นว่าปกติ (LSN - Last Seen Normal):</span>\n                      <p class=\"text-[11px] text-slate-500\">เช่น ครั้งสุดท้ายที่เห็นว่าผู้ป่วยอาการปกติ หรือเวลาที่เข้านอน (ในกรณีตื่นมาพบ)</p>\n                      <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md pt-1\">\n                        <div>\n                          <label class=\"block text-[11px] text-slate-600 mb-1\">วันที่เห็นว่าปกติครั้งสุดท้าย (LSN): <span class=\"text-[10px] text-slate-500 font-normal\">(วว/ดด/ปปปป)</span></label>\n                          <input type=\"text\" id=\"strokeLsnDate\" data-universal-date=\"true\" placeholder=\"วว/ดด/ปปปป (dd/mm/yyyy)\" autocomplete=\"off\" onchange=\"checkStrokeFibrinolyticTrigger()\" class=\"w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 text-xs\">\n                        </div>\n                        <div>\n                          <label class=\"block text-[11px] text-slate-600 mb-1\">เวลาที่เห็นว่าปกติครั้งสุดท้าย (LSN): <span class=\"text-[10px] text-slate-500 font-normal\">(ระบบ 24 ชม. เช่น 14:30)</span></label>\n                          <input type=\"text\" id=\"strokeLsnTime\" data-universal-time=\"true\" placeholder=\"เช่น 14:30 (24 ชม.)\" autocomplete=\"off\" onchange=\"checkStrokeFibrinolyticTrigger()\" class=\"w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 text-xs\">\n                        </div>\n                      </div>\n                    </div>\n\n                    <div class=\"pt-2.5 border-t border-slate-200 space-y-1.5\">\n                      <span class=\"font-semibold text-slate-800 block\">2) เวลาที่รู้ตัวว่ามีอาการ หรือเวลาที่มีผู้พบเห็นอาการ:</span>\n                      <p class=\"text-[11px] text-slate-500\">เช่น เวลาที่ตื่นนอนแล้วรู้ตัวว่าอ่อนแรง/พูดไม่ชัด หรือเวลาที่ญาติมาพบเห็น</p>\n                      <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md pt-1\">\n                        <div>\n                          <label class=\"block text-[11px] text-slate-600 mb-1\">วันที่รู้ตัว/พบเห็นอาการ: <span class=\"text-[10px] text-slate-500 font-normal\">(วว/ดด/ปปปป)</span></label>\n                          <input type=\"text\" id=\"strokeDiscoveryDate\" data-universal-date=\"true\" placeholder=\"วว/ดด/ปปปป (dd/mm/yyyy)\" autocomplete=\"off\" class=\"w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 text-xs\">\n                        </div>\n                        <div>\n                          <label class=\"block text-[11px] text-slate-600 mb-1\">เวลาที่รู้ตัว/พบเห็นอาการ: <span class=\"text-[10px] text-slate-500 font-normal\">(ระบบ 24 ชม. เช่น 14:30)</span></label>\n                          <input type=\"text\" id=\"strokeDiscoveryTime\" data-universal-time=\"true\" placeholder=\"เช่น 14:30 (24 ชม.)\" autocomplete=\"off\" class=\"w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 text-xs\">\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n\n                  <!-- มีอาการเป็นชั่วคราวแล้วทุเลาลงจนหายเป็นปกติ -->\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"strokeOnsetContext\" value=\"transient_resolved\" onchange=\"handleStrokeOnsetContextChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">มีอาการเป็นชั่วคราวแล้วทุเลาลงจนหายเป็นปกติ</span>\n                      <span class=\"text-[11px] text-slate-500\">เคยมีอาการปากเบี้ยว อ่อนแรง ชา หรือพูดไม่ชัดชั่วครู่ แล้วขณะนี้กลับมาเป็นปกติแล้ว</span>\n                    </div>\n                  </label>\n\n                  <!-- กิ่งย่อย 3: ระยะเวลาที่เป็นชั่วคราว -->\n                  <div id=\"stroke_transient_duration_wrap\" class=\"hidden ml-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs\">\n                    <span class=\"font-semibold text-slate-800 block\">มีอาการอยู่นานเท่าใด ก่อนจะหายเป็นปกติ:</span>\n                    <div class=\"flex items-center space-x-2 max-w-xs\">\n                      <input type=\"number\" id=\"strokeTransientVal\" min=\"1\" placeholder=\"ระบุตัวเลข เช่น 15\"\n                        class=\"w-36 bg-white border border-slate-300 rounded-lg p-2 text-slate-800 text-xs font-semibold placeholder:text-slate-400\">\n                      <select id=\"strokeTransientUnit\" class=\"bg-white border border-slate-300 rounded-lg p-2 text-slate-800 text-xs font-semibold\">\n                        <option value=\"minutes\" selected>นาที</option>\n                        <option value=\"hours\">ชั่วโมง</option>\n                        <option value=\"days\">วัน</option>\n                      </select>\n                    </div>\n                  </div>\n                </div>\n              </div>\n\n              <!-- 1.3 ลักษณะการดำเนินของอาการ -->\n              <div class=\"pt-2 border-t border-slate-100\">\n                <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">\n                  ลักษณะการดำเนินของอาการ (Progression)\n                </label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs\">\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"strokeProgression\" value=\"sudden_maximal\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">เป็นขึ้นมาทันทีทันใด</span>\n                      <span class=\"text-[11px] text-slate-500\">มีอาการชัดเจนเต็มที่ตั้งแต่เริ่มเป็นครั้งแรก</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"strokeProgression\" value=\"gradual_worse\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ค่อยๆ เป็นมากขึ้นเรื่อยๆ</span>\n                      <span class=\"text-[11px] text-slate-500\">อาการอ่อนแรงหรือพูดไม่ชัดค่อยๆ เป็นมากขึ้นตามลำดับ</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"strokeProgression\" value=\"fluctuating\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">เป็นๆ หายๆ สลับกัน</span>\n                      <span class=\"text-[11px] text-slate-500\">อาการเดี๋ยวดีขึ้น เดี๋ยวกลับมาเป็นใหม่</span>\n                    </div>\n                  </label>\n                </div>\n              </div>\n            </div>\n          </div>\n\n          <!-- CARD 2: อาการอ่อนแรง ปากเบี้ยว ชา ปวด หรือสูญเสียความรู้สึก (Motor, Facial Palsy, Sensory & Pain Features) -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"user-check\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-800 section-title\" data-base-title=\"อาการอ่อนแรง ปากเบี้ยว ชา ปวด หรือสูญเสียความรู้สึก\">2. อาการอ่อนแรง ปากเบี้ยว ชา ปวด หรือสูญเสียความรู้สึก</h2>\n                <p class=\"text-xs text-slate-500\">ระบุตำแหน่งและข้างที่มีอาการอ่อนแรง ปากเบี้ยว อาการชา หรืออาการปวดร่วมด้วย</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-5 text-xs\">\n              <!-- 2.1 ตำแหน่งที่อ่อนแรง หรือปากเบี้ยว -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">\n                  อาการอ่อนแรงของแขนขา หรืออาการปากเบี้ยว (เลือกได้หลายข้อ):\n                </label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2.5\">\n                  <!-- อ่อนแรงครึ่งซีก -->\n                  <div>\n                    <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                      <input type=\"checkbox\" id=\"stroke_weakness_hemi\" onchange=\"handleStrokeWeaknessChange()\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                      <div class=\"ml-2.5\">\n                        <span class=\"font-semibold text-slate-800 block\">อ่อนแรงแขนและขาซีกเดียวกัน (ครึ่งซีก)</span>\n                        <span class=\"text-[11px] text-slate-500\">แขนและขาข้างเดียวกันไม่มีแรง ยกไม่ขึ้น หรือขยับได้ลดลง</span>\n                      </div>\n                    </label>\n                    <div id=\"stroke_hemi_side_wrap\" class=\"hidden mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5\">\n                      <span class=\"font-semibold text-slate-700 block\">ระบุซีกที่แขนและขาอ่อนแรง:</span>\n                      <div class=\"grid grid-cols-2 gap-2\">\n                        <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                          <input type=\"radio\" name=\"strokeHemiSide\" value=\"left\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                          <span class=\"ml-2 font-medium\">ซีกซ้าย (แขนและขาซ้าย)</span>\n                        </label>\n                        <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                          <input type=\"radio\" name=\"strokeHemiSide\" value=\"right\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                          <span class=\"ml-2 font-medium\">ซีกขวา (แขนและขาขวา)</span>\n                        </label>\n                      </div>\n                    </div>\n                  </div>\n\n                  <!-- อ่อนแรงเฉพาะแขน -->\n                  <div>\n                    <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                      <input type=\"checkbox\" id=\"stroke_weakness_arm_only\" onchange=\"handleStrokeWeaknessChange()\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                      <div class=\"ml-2.5\">\n                        <span class=\"font-semibold text-slate-800 block\">อ่อนแรงเฉพาะแขนหรือมือข้างเดียว</span>\n                        <span class=\"text-[11px] text-slate-500\">ยกแขนไม่ขึ้น กำมือไม่มีแรง หรือหยิบจับของหล่น โดยที่ขายังมีแรงปกติ</span>\n                      </div>\n                    </label>\n                    <div id=\"stroke_arm_side_wrap\" class=\"hidden mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5\">\n                      <span class=\"font-semibold text-slate-700 block\">ระบุข้างที่แขนอ่อนแรง:</span>\n                      <div class=\"grid grid-cols-2 gap-2\">\n                        <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                          <input type=\"radio\" name=\"strokeArmSide\" value=\"left\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                          <span class=\"ml-2 font-medium\">แขนข้างซ้าย</span>\n                        </label>\n                        <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                          <input type=\"radio\" name=\"strokeArmSide\" value=\"right\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                          <span class=\"ml-2 font-medium\">แขนข้างขวา</span>\n                        </label>\n                      </div>\n                    </div>\n                  </div>\n\n                  <!-- อ่อนแรงเฉพาะขา -->\n                  <div>\n                    <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                      <input type=\"checkbox\" id=\"stroke_weakness_leg_only\" onchange=\"handleStrokeWeaknessChange()\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                      <div class=\"ml-2.5\">\n                        <span class=\"font-semibold text-slate-800 block\">อ่อนแรงเฉพาะขาข้างเดียว</span>\n                        <span class=\"text-[11px] text-slate-500\">ก้าวขาไม่ออก ยกขาไม่ขึ้น หรือเดินลากขาข้างเดียว</span>\n                      </div>\n                    </label>\n                    <div id=\"stroke_leg_side_wrap\" class=\"hidden mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5\">\n                      <span class=\"font-semibold text-slate-700 block\">ระบุข้างที่ขาอ่อนแรง:</span>\n                      <div class=\"grid grid-cols-2 gap-2\">\n                        <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                          <input type=\"radio\" name=\"strokeLegSide\" value=\"left\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                          <span class=\"ml-2 font-medium\">ขาข้างซ้าย</span>\n                        </label>\n                        <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                          <input type=\"radio\" name=\"strokeLegSide\" value=\"right\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                          <span class=\"ml-2 font-medium\">ขาข้างขวา</span>\n                        </label>\n                      </div>\n                    </div>\n                  </div>\n\n                  <!-- อ่อนแรงขาทั้งสองข้าง -->\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"stroke_weakness_both_legs\" onchange=\"handleStrokeWeaknessChange()\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">อ่อนแรงขาทั้งสองข้างพร้อมกัน</span>\n                      <span class=\"text-[11px] text-slate-500\">ขาไม่มีแรงทั้งสองข้าง ลุกยืนหรือเดินไม่ได้</span>\n                    </div>\n                  </label>\n\n                  <!-- อาการมุมปากตก ปากเบี้ยว (Facial Palsy) รวมในหมวดที่ 2 -->\n                  <div class=\"sm:col-span-2\">\n                    <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                      <input type=\"checkbox\" id=\"stroke_face_droop\" onchange=\"handleStrokeFaceChange()\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                      <div class=\"ml-2.5\">\n                        <span class=\"font-semibold text-slate-800 block\">มุมปากตก ปากเบี้ยว ยิ้มไม่เท่ากัน หรือน้ำลายไหลมุมปาก</span>\n                        <span class=\"text-[11px] text-slate-500\">ยิ้มหรือยิงฟันแล้วมุมปากสองข้างยกไม่เท่ากัน หรือดื่มน้ำแล้วน้ำไหลออกมุมปาก (สามารถเลือกเฉพาะข้อนี้ หรือเลือกพร้อมกับข้อแขนขาอ่อนแรงได้)</span>\n                      </div>\n                    </label>\n\n                    <div id=\"stroke_face_detail_wrap\" class=\"hidden mt-2 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3\">\n                      <div>\n                        <span class=\"font-semibold text-slate-800 block mb-1.5\">ระบุข้างที่มุมปากตกหรือใบหน้าเบี้ยว:</span>\n                        <div class=\"grid grid-cols-2 gap-2 max-w-xs\">\n                          <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                            <input type=\"radio\" name=\"strokeFaceSide\" value=\"left\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                            <span class=\"ml-2 font-medium\">ข้างซ้าย</span>\n                          </label>\n                          <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                            <input type=\"radio\" name=\"strokeFaceSide\" value=\"right\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                            <span class=\"ml-2 font-medium\">ข้างขวา</span>\n                          </label>\n                        </div>\n                      </div>\n\n                      <div class=\"pt-2 border-t border-slate-200\">\n                        <span class=\"font-semibold text-slate-800 block mb-1.5\">การหลับตาและการยักคิ้วของใบหน้าข้างที่เบี้ยว:</span>\n                        <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2\">\n                          <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-start cursor-pointer\">\n                            <input type=\"radio\" name=\"strokeFaceUpperPattern\" value=\"forehead_spared\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                            <span class=\"ml-2 font-medium\">ยักคิ้วได้และหลับตาได้สนิทปกติ (เบี้ยวเฉพาะมุมปากด้านล่าง)</span>\n                          </label>\n                          <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-start cursor-pointer\">\n                            <input type=\"radio\" name=\"strokeFaceUpperPattern\" value=\"forehead_involved\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                            <span class=\"ml-2 font-medium\">ยักคิ้วไม่ขึ้น และหลับตาข้างที่ปากเบี้ยวไม่สนิทด้วย</span>\n                          </label>\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n                </div>\n              </div>\n\n              <!-- 2.2 ระดับความรุนแรงของแรงแขนหรือขา (เปิดออกให้ตอบเฉพาะเมื่อมีการเลือกอ่อนแรงแขนขาเท่านั้น) -->\n              <div id=\"stroke_weakness_severity_wrap\" class=\"hidden pt-3 border-t border-slate-100\">\n                <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">\n                  ระดับความรุนแรงของแรงแขนหรือขา:\n                </label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2\">\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"strokeWeaknessSeverity\" value=\"complete_plegia\" onchange=\"checkStrokeFibrinolyticTrigger()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ยกไม่ขึ้นเลย ขยับไม่ได้</span>\n                      <span class=\"text-[11px] text-slate-500\">แขนหรือขาไม่มีแรงเลย ยกลอยพ้นพื้นหรือที่นอนไม่ได้</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"strokeWeaknessSeverity\" value=\"moderate_drift\" onchange=\"checkStrokeFibrinolyticTrigger()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">พอยกได้แต่ต้านแรงไม่ไหว</span>\n                      <span class=\"text-[11px] text-slate-500\">ยกขึ้นได้ชั่วครู่แล้วตกลง หรือกำมือหยิบของแล้วหล่น</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"strokeWeaknessSeverity\" value=\"mild\" onchange=\"checkStrokeFibrinolyticTrigger()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">อ่อนแรงเล็กน้อย พอใช้งานได้</span>\n                      <span class=\"text-[11px] text-slate-500\">ยังขยับและเดินได้เอง แต่รู้สึกแรงลดลงหรือไม่คล่องเหมือนเดิม</span>\n                    </div>\n                  </label>\n                </div>\n              </div>\n\n              <!-- 2.3 อาการชา และอาการปวดร่วมด้วย (แยกโรคอื่นๆ) -->\n              <div class=\"pt-3 border-t border-slate-100\">\n                <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">\n                  อาการชา ปวด หรือสูญเสียความรู้สึก (เลือกได้หลายข้อ):\n                </label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2.5\">\n                  <!-- อาการชา พร้อมให้เลือกตำแหน่งและข้าง -->\n                  <div class=\"sm:col-span-2\">\n                    <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                      <input type=\"checkbox\" id=\"stroke_numbness_hemi\" onchange=\"handleStrokeNumbnessChange()\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                      <div class=\"ml-2.5\">\n                        <span class=\"font-semibold text-slate-800 block\">มีอาการชา หรือความรู้สึกสัมผัสลดลง</span>\n                        <span class=\"text-[11px] text-slate-500\">รู้สึกหนาๆ เหมือนเป็นเหน็บชา หรือหยิก/แตะแล้วไม่ค่อยรู้สึก</span>\n                      </div>\n                    </label>\n                    <div id=\"stroke_numbness_side_wrap\" class=\"hidden mt-2 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3\">\n                      <div>\n                        <span class=\"font-semibold text-slate-700 block mb-1.5\">ระบุตำแหน่งที่มีอาการชา (เลือกได้หลายข้อ):</span>\n                        <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2\">\n                          <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                            <input type=\"checkbox\" name=\"strokeNumbnessLoc\" value=\"face\" class=\"rounded text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                            <span class=\"ml-2 font-medium\">ใบหน้า หรือรอบริมฝีปาก</span>\n                          </label>\n                          <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                            <input type=\"checkbox\" name=\"strokeNumbnessLoc\" value=\"arm\" class=\"rounded text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                            <span class=\"ml-2 font-medium\">แขน หรือมือ</span>\n                          </label>\n                          <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                            <input type=\"checkbox\" name=\"strokeNumbnessLoc\" value=\"leg\" class=\"rounded text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                            <span class=\"ml-2 font-medium\">ขา หรือเท้า</span>\n                          </label>\n                          <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                            <input type=\"checkbox\" name=\"strokeNumbnessLoc\" value=\"hemi\" class=\"rounded text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                            <span class=\"ml-2 font-medium\">ซีกใดซีกหนึ่งของร่างกาย (ใบหน้า แขน และขาซีกเดียวกัน)</span>\n                          </label>\n                        </div>\n                      </div>\n                      <div class=\"pt-2 border-t border-slate-200\">\n                        <span class=\"font-semibold text-slate-700 block mb-1.5\">ระบุข้างที่มีอาการชา:</span>\n                        <div class=\"grid grid-cols-3 gap-2 max-w-md\">\n                          <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                            <input type=\"radio\" name=\"strokeNumbnessSide\" value=\"left\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                            <span class=\"ml-2 font-medium\">ข้างซ้าย</span>\n                          </label>\n                          <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                            <input type=\"radio\" name=\"strokeNumbnessSide\" value=\"right\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                            <span class=\"ml-2 font-medium\">ข้างขวา</span>\n                          </label>\n                          <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                            <input type=\"radio\" name=\"strokeNumbnessSide\" value=\"both\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                            <span class=\"ml-2 font-medium\">ทั้งสองข้าง</span>\n                          </label>\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n\n                  <!-- ปวดต้นคอร้าวลงแขน (แยกข้อ 1: Cervical Radiculopathy) -->\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"stroke_pain_neck_radiating\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">มีอาการปวดต้นคอหรือสะบัก ร้าวลงแขนหรือมือข้างที่อ่อนแรง/ชา</span>\n                      <span class=\"text-[11px] text-slate-500\">ปวดแปล๊บหรือปวดร้าวตามแนวจากต้นคอหรือสะบักลงไปที่แขนหรือมือ</span>\n                    </div>\n                  </label>\n\n                  <!-- ปวดหลังร้าวลงขา (แยกข้อ 2: Lumbar Radiculopathy) -->\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"stroke_pain_back_radiating\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">มีอาการปวดหลังหรือบั้นเอว ร้าวลงขาหรือเท้าข้างที่อ่อนแรง/ชา</span>\n                      <span class=\"text-[11px] text-slate-500\">ปวดแปล๊บหรือปวดร้าวตามแนวจากหลังหรือเอวลงไปที่สะโพก ขา หรือเท้า</span>\n                    </div>\n                  </label>\n\n                  <!-- ปวดตำแหน่งที่อ่อนแรง + ซีด/เย็น (Acute Limb Ischemia) -->\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"stroke_pain_limb_cold_pale\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ปวดบริเวณแขนหรือขาข้างที่อ่อนแรงอย่างรุนแรง ร่วมกับปลายมือปลายเท้าซีดหรือเย็น</span>\n                      <span class=\"text-[11px] text-slate-500\">ปวดรุนแรงที่แขนหรือขาข้างนั้น และผิวหนังดูซีดขาวหรือจับแล้วเย็นผิดปกติ</span>\n                    </div>\n                  </label>\n\n                  <!-- เจ็บหน้าอก / ปวดท้องรุนแรง / ปวดฉีกขาดกลางหลัง (Aortic Dissection) -->\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"stroke_pain_chest_back_tearing\" onchange=\"checkStrokeFibrinolyticTrigger()\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">มีอาการเจ็บแน่นหน้าอก ปวดท้องรุนแรง หรือปวดฉีกขาดทะลุกลางหลังรุนแรงร่วมด้วย</span>\n                      <span class=\"text-[11px] text-slate-500\">เจ็บแน่นหน้าอก ปวดท้องรุนแรง หรือปวดร้าวทะลุสะบักและกลางหลังขึ้นมาพร้อมกับอาการอ่อนแรง</span>\n                    </div>\n                  </label>\n                </div>\n              </div>\n            </div>\n          </div>\n\n          <!-- CARD 3: ความผิดปกติของการพูด การกลืน และการมองเห็น (Speech, Bulbar & Visual Deficits) -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"message-square-warning\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-800 section-title\" data-base-title=\"ความผิดปกติของการพูด การกลืน และการมองเห็น\">3. ความผิดปกติของการพูด การกลืน และการมองเห็น</h2>\n                <p class=\"text-xs text-slate-500\">ประเมินลักษณะการพูด การสื่อสาร การกลืน และการมองเห็น</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4 text-xs\">\n              <!-- 3.1 ความผิดปกติของการพูดและการสื่อสาร -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">\n                  ความผิดปกติของการพูดและการสื่อสาร (เลือกได้หลายข้อ):\n                </label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2\">\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"stroke_speech_dysarthria\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">พูดไม่ชัด ลิ้นแข็ง เสียงอ้อแอ้ ออกเสียงไม่ถนัด</span>\n                      <span class=\"text-[11px] text-slate-500\">ออกเสียงคำพูดไม่ชัด แต่ยังนึกคำพูดออกและฟังคนอื่นเข้าใจปกติ</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"stroke_speech_expressive_aphasia\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">นึกคำพูดไม่ออก พูดไม่ได้ หรือพูดได้เป็นคำๆ ไม่เป็นประโยค</span>\n                      <span class=\"text-[11px] text-slate-500\">เข้าใจสิ่งที่คนอื่นถาม แต่ไม่สามารถพูดโต้ตอบเป็นประโยคได้</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer sm:col-span-2\">\n                    <input type=\"checkbox\" id=\"stroke_speech_receptive_aphasia\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ฟังคนอื่นพูดไม่เข้าใจ ถามตอบไม่ตรงคำถาม หรือพูดจาสับสน</span>\n                      <span class=\"text-[11px] text-slate-500\">ไม่เข้าใจความหมายของคำพูดที่คนอื่นสื่อสาร หรือทำตามคำสั่งไม่ได้</span>\n                    </div>\n                  </label>\n                </div>\n              </div>\n\n              <!-- 3.3 อาการกลืนและการมองเห็น -->\n              <div class=\"pt-2 border-t border-slate-100\">\n                <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">\n                  อาการเกี่ยวกับการกลืนและการมองเห็น (เลือกได้หลายข้อ):\n                </label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2\">\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"stroke_has_dysphagia\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">กลืนลำบาก หรือกลืนน้ำและอาหารแล้วสำลัก</span>\n                      <span class=\"text-[11px] text-slate-500\">ดื่มน้ำหรือกลืนอาหารลำบาก มีอาการไอหรือสำลักทันทีเมื่อกลืน</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"stroke_vision_monocular\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ตาข้างใดข้างหนึ่งมืดบอดหรือมองไม่เห็นกะทันหัน</span>\n                      <span class=\"text-[11px] text-slate-500\">ตามัวมืดลงเหมือนมีม่านบังตาข้างใดข้างหนึ่งอย่างเฉียบพลัน</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"stroke_vision_hemianopia\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ลานสายตามืดดับไปครึ่งซีก</span>\n                      <span class=\"text-[11px] text-slate-500\">มองไม่เห็นสิ่งของหรือคนที่อยู่ในฝั่งซ้ายหรือฝั่งขวาของสายตา</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"stroke_vision_diplopia\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">มองเห็นภาพซ้อน</span>\n                      <span class=\"text-[11px] text-slate-500\">มองเห็นวัตถุชิ้นเดียวแยกออกเป็น 2 ภาพซ้อนกัน</span>\n                    </div>\n                  </label>\n                </div>\n              </div>\n            </div>\n          </div>\n\n          <!-- CARD 4: สัญญาณเตือนและอาการร่วมทางระบบประสาท (Neurological Warning Signs) -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"shield-alert\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-800 section-title\" data-base-title=\"สัญญาณเตือนและอาการร่วมทางระบบประสาท\">4. สัญญาณเตือนและอาการร่วมทางระบบประสาท</h2>\n                <p class=\"text-xs text-slate-500\">กรุณาเลือกอาการที่ท่านมีร่วมด้วยตามความเป็นจริง (เลือกได้หลายข้อ หรือไม่ต้องเลือกหากไม่มี)</p>\n              </div>\n            </div>\n\n            <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs\">\n              <!-- ซึมลง สับสน -->\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                <input type=\"checkbox\" id=\"stroke_rf_altered_mental\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">ซึมลง หลับ ปลุกตื่นยาก สับสน หรือหมดสติ</span>\n                  <span class=\"text-[11px] text-slate-500\">เรียกไม่ค่อยรู้ตัว ง่วงซึมผิดปกติ หรือจำวันเวลาสถานที่ไม่ได้</span>\n                </div>\n              </label>\n\n              <!-- ปวดศีรษะรุนแรงเฉียบพลัน -->\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                <input type=\"checkbox\" id=\"stroke_rf_severe_headache\" onchange=\"checkStrokeFibrinolyticTrigger()\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">ปวดศีรษะรุนแรงเฉียบพลัน หรือปวดรุนแรงที่สุดในชีวิต</span>\n                  <span class=\"text-[11px] text-slate-500\">มีอาการปวดศีรษะรุนแรงมากขึ้นมาพร้อมกับอาการอ่อนแรงหรือปากเบี้ยว</span>\n                </div>\n              </label>\n\n              <!-- คลื่นไส้ อาเจียนพุ่ง -->\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                <input type=\"checkbox\" id=\"stroke_rf_projectile_vomiting\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">มีอาการคลื่นไส้ หรืออาเจียนพุ่งรุนแรง</span>\n                  <span class=\"text-[11px] text-slate-500\">คลื่นไส้อาเจียนร่วมกับอาการทางระบบประสาท</span>\n                </div>\n              </label>\n\n              <!-- ชักเกร็ง -->\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                <input type=\"checkbox\" id=\"stroke_rf_seizure\" onchange=\"checkStrokeFibrinolyticTrigger()\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">มีอาการชักเกร็ง หรือกระตุกขณะเริ่มมีอาการ</span>\n                  <span class=\"text-[11px] text-slate-500\">มีอาการเกร็งกระตุกของใบหน้าหรือแขนขานำมาก่อนหรือพร้อมกับอ่อนแรง</span>\n                </div>\n              </label>\n\n              <!-- เดินเซ ทรงตัวไม่ได้ -->\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                <input type=\"checkbox\" id=\"stroke_rf_ataxia_dizziness\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">เดินเซมาก ทรงตัวไม่ได้ หรือเวียนศีรษะบ้านหมุนรุนแรง</span>\n                  <span class=\"text-[11px] text-slate-500\">ยืนหรือเดินแล้วเซจะล้ม ทรงตัวไม่อยู่อย่างเฉียบพลัน</span>\n                </div>\n              </label>\n\n              <!-- คอแข็งเกร็ง -->\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                <input type=\"checkbox\" id=\"stroke_rf_neck_stiffness\" onchange=\"checkStrokeFibrinolyticTrigger()\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">คอแข็งเกร็ง ก้มคอไม่ลง</span>\n                  <span class=\"text-[11px] text-slate-500\">ก้มคอแล้วคางไม่สามารถแตะถึงอก หรือรู้สึกเจ็บเกร็งท้ายทอยรุนแรงเมื่อก้มคอ</span>\n                </div>\n              </label>\n            </div>\n          </div>\n\n          <!-- CARD 5 (DYNAMIC): คัดกรองความปลอดภัยการใช้ยาสลายลิ่มเลือด (Auto-Triggered เมื่อ Stroke <= 4.5 ชั่วโมง) -->\n          <div id=\"stroke_fibrinolytic_contra_section\" class=\"hidden bg-white rounded-2xl p-6 shadow-sm border border-slate-200 transition-all\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-amber-100 text-amber-800 p-2 rounded-xl\">\n                <i data-lucide=\"shield-check\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-900\">5. คัดกรองความปลอดภัยการใช้ยาสลายลิ่มเลือด</h2>\n                <p class=\"text-xs text-slate-500\">แบบคัดกรองประวัติเพื่อความปลอดภัยก่อนพิจารณาให้ยาสลายลิ่มเลือดทางหลอดเลือดดำ (สำหรับอาการภายใน 4.5 ชั่วโมง)</p>\n              </div>\n            </div>\n\n            <!-- กล่องแจ้งเตือนคำแนะนำ -->\n            <div class=\"bg-amber-50/80 border border-amber-300 rounded-xl p-4 text-xs text-amber-900 flex items-start space-x-3 mb-4\">\n              <i data-lucide=\"alert-circle\" class=\"w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5\"></i>\n              <div class=\"leading-relaxed\">\n                <p class=\"font-medium text-slate-800\">\n                  “เนื่องจากอาการของท่านอยู่ในช่วงเวลาเร่งด่วนไม่เกิน 4.5 ชั่วโมง ท่านอาจมีโอกาสได้รับยาสลายลิ่มเลือดทางหลอดเลือดดำที่มีความเสี่ยงสูง โปรดเลือกประวัติที่ตรงกับท่านอย่างระมัดระวัง (หากไม่มีประวัติใดๆ ไม่ต้องติ๊กเลือก)”\n                </p>\n                <p id=\"stroke_auto_detected_ci_notice\" class=\"hidden mt-1.5 text-[11px] font-semibold text-amber-800\"></p>\n              </div>\n            </div>\n\n            <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs\">\n              <!-- 1. เส้นเลือดในสมองแตก -->\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                <input type=\"checkbox\" id=\"stroke_ci_prior_ich\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">เคยมีประวัติเส้นเลือดในสมองแตก หรือเลือดออกในสมองมาก่อน</span>\n                  <span class=\"text-[11px] text-slate-500\">เคยได้รับการวินิจฉัยว่ามีเลือดออกในสมองในอดีต</span>\n                </div>\n              </label>\n\n              <!-- 2. เนื้องอกในสมอง / เส้นเลือดโป่งพอง / AVM -->\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                <input type=\"checkbox\" id=\"stroke_ci_brain_lesion\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">เคยตรวจพบเนื้องอกในสมอง เส้นเลือดสมองโป่งพอง หรือเส้นเลือดขดผิดปกติในสมอง</span>\n                  <span class=\"text-[11px] text-slate-500\">มีโรคเนื้องอกสมองหรือความผิดปกติของเส้นเลือดในสมองอยู่เดิม</span>\n                </div>\n              </label>\n\n              <!-- 3. ผ่าตัดสมอง/สันหลัง หรือบาดเจ็บศีรษะรุนแรงใน 3 เดือน -->\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                <input type=\"checkbox\" id=\"stroke_ci_cns_surgery_trauma_3m\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">เคยผ่าตัดสมอง ผ่าตัดกระดูกสันหลัง หรือบาดเจ็บที่ศีรษะรุนแรง ภายใน 3 เดือน</span>\n                  <span class=\"text-[11px] text-slate-500\">ได้รับการผ่าตัดสมอง/ไขสันหลัง หรืออุบัติเหตุศีรษะรุนแรงในช่วง 3 เดือนที่ผ่านมา</span>\n                </div>\n              </label>\n\n              <!-- 4. เส้นเลือดสมองตีบใน 3 เดือน -->\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                <input type=\"checkbox\" id=\"stroke_ci_ischemic_stroke_3m\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">เคยเป็นโรคเส้นเลือดสมองตีบ (อัมพฤกษ์/อัมพาต) ภายใน 3 เดือน</span>\n                  <span class=\"text-[11px] text-slate-500\">เพิ่งเคยเป็นเส้นเลือดสมองตีบมาไม่เกิน 3 เดือน</span>\n                </div>\n              </label>\n\n              <!-- 5. กำลังมีเลือดออกผิดปกติในร่างกาย -->\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                <input type=\"checkbox\" id=\"stroke_ci_active_bleeding\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">กำลังมีเลือดออกผิดปกติในร่างกาย เช่น อาเจียนเป็นเลือด ถ่ายดำ หรือปัสสาวะเป็นเลือด</span>\n                  <span class=\"text-[11px] text-slate-500\">มีภาวะเลือดออกภายในร่างกายที่กำลังดำเนินอยู่ในปัจจุบัน (ไม่รวมประจำเดือนปกติ)</span>\n                </div>\n              </label>\n\n              <!-- 6. เลือดออกทางเดินอาหารใน 21 วัน หรือมะเร็งทางเดินอาหาร -->\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                <input type=\"checkbox\" id=\"stroke_ci_gi_bleed_malignancy_21d\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">มีประวัติเลือดออกในทางเดินอาหารภายใน 3 สัปดาห์ (21 วัน) หรือเป็นมะเร็งทางเดินอาหาร</span>\n                  <span class=\"text-[11px] text-slate-500\">เคยถ่ายดำ อาเจียนเป็นเลือดใน 21 วัน หรือป่วยเป็นมะเร็งกระเพาะอาหาร/ลำไส้</span>\n                </div>\n              </label>\n\n              <!-- 7. ยาละลายลิ่มเลือด (DOAC/Warfarin/LMWH) -->\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer sm:col-span-2\">\n                <input type=\"checkbox\" id=\"stroke_ci_anticoagulant\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">รับประทานยาละลายลิ่มเลือด (เช่น Warfarin หรือยากลุ่มใหม่ DOAC) ใน 48 ชั่วโมง หรือฉีดยาละลายลิ่มเลือดใน 24 ชั่วโมงที่ผ่านมา</span>\n                  <span class=\"text-[11px] text-slate-500\">เช่น วาร์ฟาริน (Warfarin), Rivaroxaban (Xarelto), Apixaban (Eliquis), Dabigatran (Pradaxa) หรือยาฉีดใต้ผิวหนัง</span>\n                </div>\n              </label>\n\n              <!-- 8. ผ่าตัดใหญ่ / บาดเจ็บรุนแรงใน 14 วัน -->\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                <input type=\"checkbox\" id=\"stroke_ci_major_surgery_trauma_14d\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">เคยผ่าตัดใหญ่ หรือได้รับบาดเจ็บรุนแรงตามร่างกาย ภายใน 14 วัน</span>\n                  <span class=\"text-[11px] text-slate-500\">ผ่าตัดช่องท้อง ทรวงอก กระดูก หรืออุบัติเหตุรุนแรงในช่วง 2 สัปดาห์ที่ผ่านมา</span>\n                </div>\n              </label>\n\n              <!-- 9. กล้ามเนื้อหัวใจตายเฉียบพลันใน 3 เดือน -->\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                <input type=\"checkbox\" id=\"stroke_ci_recent_mi_3m\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">เคยเป็นโรคกล้ามเนื้อหัวใจตายเฉียบพลัน (หัวใจขาดเลือด) ภายใน 3 เดือน</span>\n                  <span class=\"text-[11px] text-slate-500\">เพิ่งเข้ารับการรักษาภาวะหัวใจขาดเลือดเฉียบพลันในช่วง 3 เดือนที่ผ่านมา</span>\n                </div>\n              </label>\n\n              <!-- 10. เจาะหลอดเลือดแดงกดไม่ได้ใน 7 วัน -->\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                <input type=\"checkbox\" id=\"stroke_ci_arterial_puncture_7d\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">เคยถูกเจาะหลอดเลือดแดงใหญ่ในตำแหน่งที่กดห้ามเลือดไม่ได้ ภายใน 7 วัน</span>\n                  <span class=\"text-[11px] text-slate-500\">มีการทำหัตถการเจาะหลอดเลือดแดงขนาดใหญ่ในช่วง 7 วันที่ผ่านมา</span>\n                </div>\n              </label>\n\n              <!-- 11. ตั้งครรภ์ -->\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                <input type=\"checkbox\" id=\"stroke_ci_pregnancy\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">กำลังตั้งครรภ์</span>\n                  <span class=\"text-[11px] text-slate-500\">อยู่ระหว่างการตั้งครรภ์ในปัจจุบัน</span>\n                </div>\n              </label>\n            </div>\n          </div>\n\n          <!-- อาการอื่นๆ เป็นช่องกรอกอิสระ -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100\">\n              <div class=\"bg-slate-100 text-slate-600 p-2 rounded-xl\">\n                <i data-lucide=\"message-square-plus\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-800\">อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2>\n                <p class=\"text-xs text-slate-500\">ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี เช่น อ่อนเพลียมาก, แน่นหน้าอก, วิงเวียนศีรษะ)</p>\n              </div>\n            </div>\n            <textarea id=\"stroke_other_free\" rows=\"2\" placeholder=\"พิมพ์ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)...\" \n              class=\"w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white\"></textarea>\n          </div>\n\n        </div> <!-- END STROKE QUESTIONNAIRE SECTION -->",
  algorithm: {
  "id": "stroke_deficit",
  "titleTh": "ปากเบี้ยว อ่อนแรง ชา ข้างใดข้างหนึ่ง พูดไม่ชัด",
  "titleEn": "Focal Neurological Deficit / Hemiparesis / Dysarthria",
  "sections": [
    {
      "sectionNo": 1,
      "titleTh": "ระยะเวลาที่เริ่มมีอาการ และเวลาสุดท้ายที่เห็นว่าปกติ (Timing, Onset Mode & LSN)",
      "items": [
        {
          "key": "strokeOnsetContext",
          "labelTh": "รูปแบบเวลาที่เริ่มมีอาการ (Onset Context)",
          "type": "single_choice",
          "options": [
            {
              "value": "known_exact",
              "patientTh": "ทราบเวลาที่เริ่มมีอาการแน่นอน (มีอาการขณะตื่นอยู่ และระบุวันที่/เวลาได้)",
              "doctorTh": "Known exact onset time (Witnessed / Awake onset)"
            },
            {
              "value": "wake_up_or_unknown",
              "patientTh": "ไม่ทราบเวลาที่แน่นอน หรือตื่นนอนมาแล้วพบว่ามีอาการ (ระบุเวลา LSN และเวลาที่รู้ตัวว่ามีอาการ)",
              "doctorTh": "Wake-up stroke / Unknown exact onset (Requires LSN & Discovery Time)"
            },
            {
              "value": "transient_resolved",
              "patientTh": "มีอาการเป็นชั่วคราวแล้วทุเลาลงจนหายเป็นปกติแล้วในขณะนี้ (ระบุระยะเวลาที่มีอาการ)",
              "doctorTh": "Transient neurological deficit, completely resolved (Suspect TIA)"
            }
          ]
        },
        {
          "key": "strokeProgression",
          "labelTh": "ลักษณะการดำเนินของอาการ (Progression)",
          "type": "single_choice",
          "options": [
            {
              "value": "sudden_maximal",
              "patientTh": "เป็นขึ้นมาทันทีทันใด และมีอาการชัดเจนตั้งแต่แรก",
              "doctorTh": "Sudden maximal deficit at onset"
            },
            {
              "value": "gradual_worse",
              "patientTh": "ค่อยๆ เป็นมากขึ้นเรื่อยๆ ในช่วงเวลาต่อมา",
              "doctorTh": "Gradual / Stuttering progression"
            },
            {
              "value": "fluctuating",
              "patientTh": "อาการเป็นๆ หายๆ เดี๋ยวดีขึ้นเดี๋ยวอ่อนแรงใหม่",
              "doctorTh": "Fluctuating course"
            }
          ]
        }
      ]
    },
    {
      "sectionNo": 2,
      "titleTh": "อาการอ่อนแรง ปากเบี้ยว ชา ปวด หรือสูญเสียความรู้สึก (Motor, Facial Palsy, Sensory & Pain Features)",
      "items": [
        {
          "key": "stroke_weakness_hemi",
          "patientTh": "อ่อนแรงแขนและขาซีกเดียวกัน (ครึ่งซีก)",
          "doctorTh": "Hemiparesis / Hemiplegia 🚩",
          "isRedFlag": true
        },
        {
          "key": "stroke_weakness_arm_only",
          "patientTh": "อ่อนแรงเฉพาะแขนข้างเดียว",
          "doctorTh": "Brachial monoparesis 🚩",
          "isRedFlag": true
        },
        {
          "key": "stroke_weakness_leg_only",
          "patientTh": "อ่อนแรงเฉพาะขาข้างเดียว",
          "doctorTh": "Crural monoparesis 🚩",
          "isRedFlag": true
        },
        {
          "key": "stroke_weakness_both_legs",
          "patientTh": "อ่อนแรงขาทั้งสองข้าง",
          "doctorTh": "Paraparesis (Rule out Spinal Cord lesion) 🚩",
          "isRedFlag": true
        },
        {
          "key": "stroke_face_droop",
          "patientTh": "มุมปากตก ปากเบี้ยว ยิ้มไม่เท่ากัน หรือน้ำลายไหลมุมปาก",
          "doctorTh": "Facial droop / CN VII palsy 🚩",
          "isRedFlag": true
        },
        {
          "key": "stroke_numbness_hemi",
          "patientTh": "มีอาการชา หรือความรู้สึกสัมผัสลดลง (ระบุตำแหน่ง: ใบหน้า, แขน/มือ, ขา/เท้า, ครึ่งซีก)",
          "doctorTh": "Sensory loss / Numbness"
        },
        {
          "key": "stroke_pain_neck_radiating",
          "patientTh": "ปวดต้นคอหรือสะบัก ร้าวลงแขนหรือมือข้างที่อ่อนแรง/ชา",
          "doctorTh": "Cervical pain with radicular radiation (Rule out Cervical Radiculopathy / C-spine lesion)"
        },
        {
          "key": "stroke_pain_back_radiating",
          "patientTh": "ปวดหลังหรือบั้นเอว ร้าวลงขาหรือเท้าข้างที่อ่อนแรง/ชา",
          "doctorTh": "Lumbar/back pain with radicular radiation (Rule out Lumbar Radiculopathy / Cauda Equina)"
        },
        {
          "key": "stroke_pain_limb_cold_pale",
          "patientTh": "ปวดบริเวณแขนหรือขาข้างที่อ่อนแรงอย่างรุนแรง ร่วมกับปลายมือปลายเท้าซีดหรือเย็น",
          "doctorTh": "Severe limb pain with pallor/poikilothermia (Rule out Acute Limb Ischemia 🚩)",
          "isRedFlag": true
        },
        {
          "key": "stroke_pain_chest_back_tearing",
          "patientTh": "เจ็บแน่นหน้าอก ปวดท้องรุนแรง หรือปวดฉีกขาดทะลุกลางหลังรุนแรงร่วมด้วย",
          "doctorTh": "Severe chest/abdominal/tearing back pain with neurological deficit (Rule out Acute Aortic Dissection 🚩)",
          "isRedFlag": true
        }
      ]
    },
    {
      "sectionNo": 3,
      "titleTh": "ความผิดปกติของการพูด การกลืน และการมองเห็น (Speech, Bulbar & Visual Deficits)",
      "items": [
        {
          "key": "stroke_speech_dysarthria",
          "patientTh": "พูดไม่ชัด ลิ้นแข็ง เสียงอ้อแอ้ ออกเสียงไม่ถนัด",
          "doctorTh": "Dysarthria 🚩",
          "isRedFlag": true
        },
        {
          "key": "stroke_speech_expressive_aphasia",
          "patientTh": "นึกคำพูดไม่ออก พูดไม่ได้ พูดได้เป็นคำๆ หรือพูดไม่เป็นประโยค",
          "doctorTh": "Expressive (Broca) aphasia 🚩",
          "isRedFlag": true
        },
        {
          "key": "stroke_speech_receptive_aphasia",
          "patientTh": "ฟังคนอื่นพูดไม่เข้าใจ ถามตอบไม่ตรงคำถาม หรือพูดจาสับสน",
          "doctorTh": "Receptive (Wernicke) aphasia 🚩",
          "isRedFlag": true
        },
        {
          "key": "stroke_has_dysphagia",
          "patientTh": "กลืนลำบาก หรือกลืนน้ำและอาหารแล้วสำลัก",
          "doctorTh": "Dysphagia / Bulbar dysfunction 🚩",
          "isRedFlag": true
        },
        {
          "key": "stroke_vision_monocular",
          "patientTh": "ตาข้างใดข้างหนึ่งมืดบอดหรือมองไม่เห็นกะทันหัน",
          "doctorTh": "Acute monocular vision loss / Amaurosis fugax 🚩",
          "isRedFlag": true
        },
        {
          "key": "stroke_vision_hemianopia",
          "patientTh": "ลานสายตามืดดับไปครึ่งซีก (มองไม่เห็นสิ่งของฝั่งซ้ายหรือขวา)",
          "doctorTh": "Homonymous hemianopia / Visual field cut 🚩",
          "isRedFlag": true
        },
        {
          "key": "stroke_vision_diplopia",
          "patientTh": "มองเห็นภาพซ้อน",
          "doctorTh": "Diplopia 🚩",
          "isRedFlag": true
        }
      ]
    },
    {
      "sectionNo": 4,
      "titleTh": "สัญญาณเตือนและอาการร่วมทางระบบประสาท (Neurological Warning Signs)",
      "items": [
        {
          "key": "stroke_rf_altered_mental",
          "patientTh": "ซึมลง หลับ ปลุกตื่นยาก สับสน หรือหมดสติ",
          "doctorTh": "Altered mental status / Decreased consciousness 🚩",
          "isRedFlag": true
        },
        {
          "key": "stroke_rf_severe_headache",
          "patientTh": "ปวดศีรษะรุนแรงเฉียบพลัน หรือปวดศีรษะรุนแรงที่สุดในชีวิต",
          "doctorTh": "Severe acute / Thunderclap headache (Suspect ICH / SAH 🚩)",
          "isRedFlag": true
        },
        {
          "key": "stroke_rf_projectile_vomiting",
          "patientTh": "มีอาการคลื่นไส้ หรืออาเจียนพุ่งรุนแรง",
          "doctorTh": "Nausea / Projectile vomiting (Suspect Raised ICP / ICH 🚩)",
          "isRedFlag": true
        },
        {
          "key": "stroke_rf_seizure",
          "patientTh": "มีอาการชักเกร็ง หรือกระตุกขณะเริ่มมีอาการ",
          "doctorTh": "Seizure at onset (Rule out Postictal Todd paralysis 🚩)",
          "isRedFlag": true
        },
        {
          "key": "stroke_rf_ataxia_dizziness",
          "patientTh": "เดินเซมาก ทรงตัวไม่ได้ หรือเวียนศีรษะบ้านหมุนรุนแรง",
          "doctorTh": "Severe truncal/gait ataxia or acute vertigo (Posterior circulation 🚩)",
          "isRedFlag": true
        },
        {
          "key": "stroke_rf_neck_stiffness",
          "patientTh": "คอแข็งเกร็ง ก้มคอไม่ลง",
          "doctorTh": "Nuchal rigidity / Meningismus (Suspect SAH 🚩)",
          "isRedFlag": true
        }
      ]
    },
    {
      "sectionNo": 5,
      "titleTh": "คัดกรองความปลอดภัยการใช้ยาสลายลิ่มเลือด (Fibrinolysis Contraindications - Auto-Triggered <= 4.5 hr)",
      "items": [
        {
          "key": "stroke_ci_prior_ich",
          "patientTh": "เคยมีประวัติเส้นเลือดในสมองแตก หรือเลือดออกในสมองมาก่อน",
          "doctorTh": "Prior Intracranial Hemorrhage (Absolute CI 🛑)",
          "isRedFlag": true
        },
        {
          "key": "stroke_ci_brain_lesion",
          "patientTh": "เคยตรวจพบเนื้องอกในสมอง เส้นเลือดสมองโป่งพอง หรือเส้นเลือดขดผิดปกติในสมอง",
          "doctorTh": "High-risk intracranial lesion: Brain tumor / Aneurysm / AVM (Absolute CI 🛑)",
          "isRedFlag": true
        },
        {
          "key": "stroke_ci_cns_surgery_trauma_3m",
          "patientTh": "เคยผ่าตัดสมอง ผ่าตัดกระดูกสันหลัง หรือได้รับอุบัติเหตุที่ศีรษะรุนแรง ภายใน 3 เดือน",
          "doctorTh": "Intracranial/Spinal surgery or severe head trauma within 3 months (Absolute CI 🛑)",
          "isRedFlag": true
        },
        {
          "key": "stroke_ci_ischemic_stroke_3m",
          "patientTh": "เคยเป็นโรคเส้นเลือดสมองตีบ (อัมพฤกษ์/อัมพาต) ภายใน 3 เดือน",
          "doctorTh": "Prior Ischemic Stroke within 3 months (Absolute CI 🛑)",
          "isRedFlag": true
        },
        {
          "key": "stroke_ci_active_bleeding",
          "patientTh": "กำลังมีเลือดออกผิดปกติในร่างกาย เช่น อาเจียนเป็นเลือด ถ่ายดำ/ถ่ายเป็นเลือด หรือปัสสาวะเป็นเลือด",
          "doctorTh": "Active internal bleeding (Absolute CI 🛑)",
          "isRedFlag": true
        },
        {
          "key": "stroke_ci_gi_bleed_malignancy_21d",
          "patientTh": "มีประวัติเลือดออกในทางเดินอาหารภายใน 3 สัปดาห์ (21 วัน) หรือเป็นมะเร็งทางเดินอาหาร",
          "doctorTh": "GI malignancy or GI bleeding within 21 days (Absolute CI 🛑)",
          "isRedFlag": true
        },
        {
          "key": "stroke_ci_anticoagulant",
          "patientTh": "รับประทานยาละลายลิ่มเลือด (เช่น Warfarin หรือยากลุ่มใหม่ DOAC) ใน 48 ชั่วโมง หรือฉีดยาละลายลิ่มเลือดใน 24 ชั่วโมงที่ผ่านมา",
          "doctorTh": "Current anticoagulant use (DOAC < 48h / LMWH < 24h / Warfarin) (Absolute CI 🛑)",
          "isRedFlag": true
        },
        {
          "key": "stroke_ci_major_surgery_trauma_14d",
          "patientTh": "เคยผ่าตัดใหญ่ หรือได้รับบาดเจ็บรุนแรงตามร่างกาย ภายใน 14 วัน",
          "doctorTh": "Major non-CNS surgery or serious trauma within 14 days (Relative CI ⚠️)"
        },
        {
          "key": "stroke_ci_recent_mi_3m",
          "patientTh": "เคยเป็นโรคกล้ามเนื้อหัวใจตายเฉียบพลัน (หัวใจขาดเลือด) ภายใน 3 เดือน",
          "doctorTh": "Recent Acute Myocardial Infarction within 3 months (Relative CI ⚠️)"
        },
        {
          "key": "stroke_ci_arterial_puncture_7d",
          "patientTh": "เคยถูกเจาะหลอดเลือดแดงในตำแหน่งที่กดห้ามเลือดไม่ได้ ภายใน 7 วัน",
          "doctorTh": "Non-compressible arterial puncture within 7 days (Relative CI ⚠️)"
        },
        {
          "key": "stroke_ci_pregnancy",
          "patientTh": "กำลังตั้งครรภ์",
          "doctorTh": "Pregnancy (Relative CI ⚠️)"
        }
      ]
    }
  ]
},
  seedPatients: [
  {
    "id": "case-081",
    "queue_number": "A-081",
    "hn": "6709102",
    "name": "นายสมศักดิ์ วงศ์สว่าง",
    "age": 64,
    "gender": "ชาย",
    "chief_complaint": "stroke_deficit",
    "chief_complaint_title": "ปากเบี้ยว อ่อนแรง ชา ข้างใดข้างหนึ่ง พูดไม่ชัด",
    "status": "waiting",
    "timestamp": "2026-10-26T02:26:26.424Z",
    "durationVal": 1,
    "durationUnit": "hours",
    "strokeOnsetContext": "known_exact",
    "strokeExactDate": "20/10/2026",
    "strokeExactTime": "09:00",
    "strokeLsnDate": "",
    "strokeLsnTime": "",
    "strokeDiscoveryDate": "",
    "strokeDiscoveryTime": "",
    "strokeTransientVal": null,
    "strokeTransientUnit": "minutes",
    "strokeProgression": "sudden_maximal",
    "stroke_weakness_hemi": true,
    "strokeHemiSide": "left",
    "stroke_weakness_arm_only": false,
    "strokeArmSide": "none",
    "stroke_weakness_leg_only": false,
    "strokeLegSide": "none",
    "stroke_weakness_both_legs": false,
    "strokeWeaknessSeverity": "complete_plegia",
    "stroke_numbness_hemi": true,
    "strokeNumbnessLocs": [
      "face",
      "arm",
      "leg",
      "hemi"
    ],
    "strokeNumbnessSide": "left",
    "stroke_pain_neck_radiating": false,
    "stroke_pain_back_radiating": false,
    "stroke_pain_limb_cold_pale": false,
    "stroke_pain_chest_back_tearing": false,
    "stroke_face_droop": true,
    "strokeFaceSide": "left",
    "strokeFaceUpperPattern": "forehead_spared",
    "stroke_speech_dysarthria": true,
    "stroke_speech_expressive_aphasia": false,
    "stroke_speech_receptive_aphasia": false,
    "stroke_has_dysphagia": false,
    "stroke_vision_monocular": false,
    "stroke_vision_hemianopia": false,
    "stroke_vision_diplopia": false,
    "stroke_rf_altered_mental": false,
    "stroke_rf_severe_headache": false,
    "stroke_rf_projectile_vomiting": false,
    "stroke_rf_seizure": false,
    "stroke_rf_ataxia_dizziness": false,
    "stroke_rf_neck_stiffness": false,
    "stroke_ci_prior_ich": false,
    "stroke_ci_brain_lesion": false,
    "stroke_ci_cns_surgery_trauma_3m": false,
    "stroke_ci_ischemic_stroke_3m": false,
    "stroke_ci_active_bleeding": false,
    "stroke_ci_gi_bleed_malignancy_21d": false,
    "stroke_ci_anticoagulant": false,
    "stroke_ci_major_surgery_trauma_14d": false,
    "stroke_ci_recent_mi_3m": false,
    "stroke_ci_arterial_puncture_7d": false,
    "stroke_ci_pregnancy": false,
    "hospRecordStatus": "ratchaburi",
    "underlying": [
      "ความดันสูง (HT)",
      "เบาหวาน (DM)",
      "ไขมันในเลือดสูง (DLP)"
    ],
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "Enalapril 5 mg 1 tab po od, Metformin 500 mg 1 tab po bid, Atorvastatin 20 mg 1 tab po hs",
    "doctor_notes": {
      "additional_hpi": "1 ชั่วโมงก่อน ขณะนั่งรับประทานอาหารเช้ากับครอบครัว จู่ๆ ยกตะเกียบไม่ขึ้น แขนและขาซ้ายอ่อนแรงยกไม่ขึ้นทันที มุมปากซ้ายตก พูดไม่ชัดแต่ยังรู้สึกตัวดีและทำตามคำสั่งได้ ปฏิเสธปวดศีรษะ ไม่ชัก ไม่มีประวัติเลือดออกผิดปกติ",
      "physical_exam": "BT 36.8 C, PR 84/min regular, RR 18/min, BP 168/94 mmHg, SpO2 98%, Bedside DTX 138 mg/dL. Neuro: E4V5M6, left facial palsy (UMN type, forehead spared), dysarthria, motor right grade V, left arm grade 0, left leg grade I, left hemisensory decrease. NIHSS = 11.",
      "preliminary_dx": "Acute Right MCA Ischemic Stroke (Onset 1 hr - Stroke Fast Track Candidate for IV rt-PA / TNK) 🚩",
      "plan": "Activate Stroke Fast Track immediately! STAT Non-contrast CT Brain + CTA Brain & Neck. STAT CBC, PT/INR, aPTT, Electrolytes, BUN/Cr. Prepare IV Alteplase (rt-PA) 0.9 mg/kg (10% bolus, 90% over 60 min) once ICH excluded on CT. Keep BP < 185/110 mmHg prior to thrombolysis."
    }
  },
  {
    "id": "case-082",
    "queue_number": "A-082",
    "hn": "6704855",
    "name": "นางวรรณา จิตต์แจ่มใส",
    "age": 58,
    "gender": "หญิง",
    "chief_complaint": "stroke_deficit",
    "chief_complaint_title": "ปากเบี้ยว อ่อนแรง ชา ข้างใดข้างหนึ่ง พูดไม่ชัด",
    "status": "waiting",
    "timestamp": "2026-10-26T02:11:26.424Z",
    "durationVal": 2,
    "durationUnit": "hours",
    "strokeOnsetContext": "wake_up_or_unknown",
    "strokeExactDate": "",
    "strokeExactTime": "",
    "strokeLsnDate": "20/10/2026",
    "strokeLsnTime": "06:00",
    "strokeDiscoveryDate": "20/10/2026",
    "strokeDiscoveryTime": "08:00",
    "strokeTransientVal": null,
    "strokeTransientUnit": "minutes",
    "strokeProgression": "gradual_worse",
    "stroke_weakness_hemi": true,
    "strokeHemiSide": "right",
    "stroke_weakness_arm_only": false,
    "strokeArmSide": "none",
    "stroke_weakness_leg_only": false,
    "strokeLegSide": "none",
    "stroke_weakness_both_legs": false,
    "strokeWeaknessSeverity": "complete_plegia",
    "stroke_numbness_hemi": true,
    "strokeNumbnessLocs": [
      "face",
      "arm",
      "leg",
      "hemi"
    ],
    "strokeNumbnessSide": "right",
    "stroke_pain_neck_radiating": false,
    "stroke_pain_back_radiating": false,
    "stroke_pain_limb_cold_pale": false,
    "stroke_pain_chest_back_tearing": false,
    "stroke_face_droop": true,
    "strokeFaceSide": "right",
    "strokeFaceUpperPattern": "forehead_spared",
    "stroke_speech_dysarthria": true,
    "stroke_speech_expressive_aphasia": true,
    "stroke_speech_receptive_aphasia": false,
    "stroke_has_dysphagia": true,
    "stroke_vision_monocular": false,
    "stroke_vision_hemianopia": false,
    "stroke_vision_diplopia": false,
    "stroke_rf_altered_mental": true,
    "stroke_rf_severe_headache": true,
    "stroke_rf_projectile_vomiting": true,
    "stroke_rf_seizure": false,
    "stroke_rf_ataxia_dizziness": false,
    "stroke_rf_neck_stiffness": false,
    "stroke_ci_prior_ich": false,
    "stroke_ci_brain_lesion": false,
    "stroke_ci_cns_surgery_trauma_3m": false,
    "stroke_ci_ischemic_stroke_3m": false,
    "stroke_ci_active_bleeding": false,
    "stroke_ci_gi_bleed_malignancy_21d": false,
    "stroke_ci_anticoagulant": true,
    "stroke_ci_major_surgery_trauma_14d": false,
    "stroke_ci_recent_mi_3m": false,
    "stroke_ci_arterial_puncture_7d": false,
    "stroke_ci_pregnancy": false,
    "hospRecordStatus": "ratchaburi",
    "underlying": [
      "ความดันสูง (HT)",
      "โรคหัวใจเต้นผิดจังหวะ (AF)"
    ],
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "Warfarin 3 mg 1 tab po od hs, Amlodipine 10 mg 1 tab po od",
    "doctor_notes": {
      "additional_hpi": "ญาติเห็นผู้ป่วยปกติครั้งสุดท้าย (LSN) เวลา 06:00 น. ต่อมาเวลา 08:00 น. พบว่าผู้ป่วยบ่นปวดศีรษะรุนแรงมาก อาเจียนพุ่ง 2 ครั้ง แขนและขาขวาอ่อนแรงยกไม่ขึ้น นึกคำพูดไม่ออก และเริ่มซึมลง ผู้ป่วยมีโรคประจำตัว AF รับประทานยา Warfarin เป็นประจำ",
      "physical_exam": "BT 37.0 C, PR 98/min irregular, RR 22/min, BP 212/114 mmHg, SpO2 96%, DTX 118 mg/dL. Neuro: Drowsy, E3V2M5 (GCS 10), right facial palsy (UMN), right hemiplegia grade 0, Babinski dorsiflexion on right.",
      "preliminary_dx": "Suspected Acute Left Putaminal/Thalamic Intracerebral Hemorrhage (Warfarin-associated ICH) 🚩 [ABSOLUTE CONTRAINDICATION TO FIBRINOLYSIS]",
      "plan": "DO NOT give Fibrinolytics! STAT Non-contrast CT Brain. STAT PT/INR, CBC, Crossmatch. Hold Warfarin immediately; prepare Vitamin K 10 mg IV slow infusion + 4-factor PCC (or FFP) for urgent INR reversal. Titrate IV Nicardipine to lower SBP to 140-160 mmHg. Urgent Neurosurgery consult."
    }
  },
  {
    "id": "case-083",
    "queue_number": "A-083",
    "hn": "6707931",
    "name": "นายธีรเดช สุขเกษม",
    "age": 42,
    "gender": "ชาย",
    "chief_complaint": "stroke_deficit",
    "chief_complaint_title": "ปากเบี้ยว อ่อนแรง ชา ข้างใดข้างหนึ่ง พูดไม่ชัด",
    "status": "waiting",
    "timestamp": "2026-10-26T01:56:26.424Z",
    "durationVal": 6,
    "durationUnit": "hours",
    "strokeOnsetContext": "wake_up_or_unknown",
    "strokeExactDate": "",
    "strokeExactTime": "",
    "strokeLsnDate": "19/10/2026",
    "strokeLsnTime": "23:00",
    "strokeDiscoveryDate": "20/10/2026",
    "strokeDiscoveryTime": "05:00",
    "strokeTransientVal": null,
    "strokeTransientUnit": "minutes",
    "strokeProgression": "sudden_maximal",
    "stroke_weakness_hemi": false,
    "strokeHemiSide": "none",
    "stroke_weakness_arm_only": false,
    "strokeArmSide": "none",
    "stroke_weakness_leg_only": false,
    "strokeLegSide": "none",
    "stroke_weakness_both_legs": false,
    "strokeWeaknessSeverity": "",
    "stroke_numbness_hemi": false,
    "strokeNumbnessLocs": [],
    "strokeNumbnessSide": "none",
    "stroke_pain_neck_radiating": false,
    "stroke_pain_back_radiating": false,
    "stroke_pain_limb_cold_pale": false,
    "stroke_pain_chest_back_tearing": false,
    "stroke_face_droop": true,
    "strokeFaceSide": "right",
    "strokeFaceUpperPattern": "forehead_involved",
    "stroke_speech_dysarthria": false,
    "stroke_speech_expressive_aphasia": false,
    "stroke_speech_receptive_aphasia": false,
    "stroke_has_dysphagia": false,
    "stroke_vision_monocular": false,
    "stroke_vision_hemianopia": false,
    "stroke_vision_diplopia": false,
    "stroke_rf_altered_mental": false,
    "stroke_rf_severe_headache": false,
    "stroke_rf_projectile_vomiting": false,
    "stroke_rf_seizure": false,
    "stroke_rf_ataxia_dizziness": false,
    "stroke_rf_neck_stiffness": false,
    "stroke_ci_prior_ich": false,
    "stroke_ci_brain_lesion": false,
    "stroke_ci_cns_surgery_trauma_3m": false,
    "stroke_ci_ischemic_stroke_3m": false,
    "stroke_ci_active_bleeding": false,
    "stroke_ci_gi_bleed_malignancy_21d": false,
    "stroke_ci_anticoagulant": false,
    "stroke_ci_major_surgery_trauma_14d": false,
    "stroke_ci_recent_mi_3m": false,
    "stroke_ci_arterial_puncture_7d": false,
    "stroke_ci_pregnancy": false,
    "hospRecordStatus": "self",
    "underlying": ["ปฏิเสธ"],
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "ไม่มี",
    "doctor_notes": {
      "additional_hpi": "ตื่นเช้ามาตอน 05:00 น. สังเกตว่าแปรงฟันแล้วน้ำไหลออกทางมุมปากขวา ยิ้มแล้วมุมปากขวาไม่ยก ตาขวาหลับไม่สนิทและยักคิ้วขวาไม่ขึ้น ไม่มีแขนขาอ่อนแรง ไม่มีชา เดินและพูดคุยได้ชัดเจนปกติ",
      "physical_exam": "BT 36.6 C, PR 74/min, RR 16/min, BP 124/78 mmHg. Neuro: Alert, LMN right facial nerve palsy (loss of right nasolabial fold AND loss of right forehead wrinkles, incomplete right eye closure with Bell phenomenon). External ear canal normal, no vesicles. Motor grade V all 4 limbs, cerebellar intact.",
      "preliminary_dx": "Acute Right Bell Palsy (Idiopathic Peripheral Facial Nerve Palsy - House-Brackmann Grade IV)",
      "plan": "Reassurance that this is peripheral CN VII palsy, not central stroke. Prednisolone 60 mg/day po for 5 days then taper over 5 days. Artificial tears q 2h daytime + lubricating eye ointment and eye patch taping at night to prevent exposure keratitis."
    }
  }
],

  hydrateForm(patient) {
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val !== undefined && val !== null ? val : '';
    };
    let setChk = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.checked = Boolean(val);
    };
    const durVal = document.getElementById('strokeDurationVal');
    const durUnit = document.getElementById('strokeDurationUnit');
    if (durVal) durVal.value = patient.durationVal || '';
    if (durUnit && patient.durationUnit) durUnit.value = patient.durationUnit;

    setRadioValue('strokeOnsetContext', patient.strokeOnsetContext);
    handleStrokeOnsetContextChange();
    if (patient.strokeOnsetContext === 'known_exact') {
      const exDate = document.getElementById('strokeExactDate');
      const exTime = document.getElementById('strokeExactTime');
      if (exDate) exDate.value = patient.strokeExactDate || '';
      if (exTime) exTime.value = patient.strokeExactTime || '';
    } else if (patient.strokeOnsetContext === 'wake_up_or_unknown') {
      const lsnDate = document.getElementById('strokeLsnDate');
      const lsnTime = document.getElementById('strokeLsnTime');
      const discDate = document.getElementById('strokeDiscoveryDate');
      const discTime = document.getElementById('strokeDiscoveryTime');
      if (lsnDate) lsnDate.value = patient.strokeLsnDate || '';
      if (lsnTime) lsnTime.value = patient.strokeLsnTime || '';
      if (discDate) discDate.value = patient.strokeDiscoveryDate || '';
      if (discTime) discTime.value = patient.strokeDiscoveryTime || '';
    } else if (patient.strokeOnsetContext === 'transient_resolved') {
      const trVal = document.getElementById('strokeTransientVal');
      const trUnit = document.getElementById('strokeTransientUnit');
      if (trVal) trVal.value = patient.strokeTransientVal || '';
      if (trUnit && patient.strokeTransientUnit) trUnit.value = patient.strokeTransientUnit;
    }

    setRadioValue('strokeProgression', patient.strokeProgression);

    setChk = (id, val) => { const el = document.getElementById(id); if (el) el.checked = Boolean(val); };

    // Card 2: Motor, Facial Palsy, Sensory & Pain Differential
    setChk('stroke_weakness_hemi', patient.stroke_weakness_hemi);
    setChk('stroke_weakness_arm_only', patient.stroke_weakness_arm_only);
    setChk('stroke_weakness_leg_only', patient.stroke_weakness_leg_only);
    setChk('stroke_weakness_both_legs', patient.stroke_weakness_both_legs);
    handleStrokeWeaknessChange();

    if (patient.stroke_weakness_hemi && patient.strokeHemiSide && patient.strokeHemiSide !== 'none') {
      setRadioValue('strokeHemiSide', patient.strokeHemiSide);
    }
    if (patient.stroke_weakness_arm_only && patient.strokeArmSide && patient.strokeArmSide !== 'none') {
      setRadioValue('strokeArmSide', patient.strokeArmSide);
    }
    if (patient.stroke_weakness_leg_only && patient.strokeLegSide && patient.strokeLegSide !== 'none') {
      setRadioValue('strokeLegSide', patient.strokeLegSide);
    }
    if (patient.strokeWeaknessSeverity && patient.strokeWeaknessSeverity !== 'none') {
      setRadioValue('strokeWeaknessSeverity', patient.strokeWeaknessSeverity);
    }

    setChk('stroke_face_droop', patient.stroke_face_droop);
    handleStrokeFaceChange();
    if (patient.stroke_face_droop) {
      if (patient.strokeFaceSide && patient.strokeFaceSide !== 'none') {
        setRadioValue('strokeFaceSide', patient.strokeFaceSide);
      }
      if (patient.strokeFaceUpperPattern && patient.strokeFaceUpperPattern !== 'none') {
        setRadioValue('strokeFaceUpperPattern', patient.strokeFaceUpperPattern);
      }
    }

    setChk('stroke_numbness_hemi', patient.stroke_numbness_hemi);
    handleStrokeNumbnessChange();
    if (patient.stroke_numbness_hemi) {
      if (Array.isArray(patient.strokeNumbnessLocs)) {
        setMultiCheckboxes('strokeNumbnessLoc', patient.strokeNumbnessLocs);
      }
      if (patient.strokeNumbnessSide && patient.strokeNumbnessSide !== 'none') {
        setRadioValue('strokeNumbnessSide', patient.strokeNumbnessSide);
      }
    }

    setChk('stroke_pain_neck_radiating', patient.stroke_pain_neck_radiating || patient.stroke_pain_neck_back_radiating);
    setChk('stroke_pain_back_radiating', patient.stroke_pain_back_radiating || patient.stroke_pain_neck_back_radiating);
    setChk('stroke_pain_limb_cold_pale', patient.stroke_pain_limb_cold_pale);
    setChk('stroke_pain_chest_back_tearing', patient.stroke_pain_chest_back_tearing);

    // Card 3: Speech, Bulbar & Vision

    setChk('stroke_speech_dysarthria', patient.stroke_speech_dysarthria);
    setChk('stroke_speech_expressive_aphasia', patient.stroke_speech_expressive_aphasia);
    setChk('stroke_speech_receptive_aphasia', patient.stroke_speech_receptive_aphasia);
    setChk('stroke_has_dysphagia', patient.stroke_has_dysphagia);
    setChk('stroke_vision_monocular', patient.stroke_vision_monocular);
    setChk('stroke_vision_hemianopia', patient.stroke_vision_hemianopia);
    setChk('stroke_vision_diplopia', patient.stroke_vision_diplopia);

    // Card 4: Neurological Warning Signs
    setChk('stroke_rf_altered_mental', patient.stroke_rf_altered_mental);
    setChk('stroke_rf_severe_headache', patient.stroke_rf_severe_headache);
    setChk('stroke_rf_projectile_vomiting', patient.stroke_rf_projectile_vomiting);
    setChk('stroke_rf_seizure', patient.stroke_rf_seizure);
    setChk('stroke_rf_ataxia_dizziness', patient.stroke_rf_ataxia_dizziness);
    setChk('stroke_rf_neck_stiffness', patient.stroke_rf_neck_stiffness);

    // Card 5: Fibrinolysis Contraindications
    setChk('stroke_ci_prior_ich', patient.stroke_ci_prior_ich);
    setChk('stroke_ci_brain_lesion', patient.stroke_ci_brain_lesion);
    setChk('stroke_ci_cns_surgery_trauma_3m', patient.stroke_ci_cns_surgery_trauma_3m);
    setChk('stroke_ci_ischemic_stroke_3m', patient.stroke_ci_ischemic_stroke_3m);
    setChk('stroke_ci_active_bleeding', patient.stroke_ci_active_bleeding);
    setChk('stroke_ci_gi_bleed_malignancy_21d', patient.stroke_ci_gi_bleed_malignancy_21d);
    setChk('stroke_ci_anticoagulant', patient.stroke_ci_anticoagulant);
    setChk('stroke_ci_major_surgery_trauma_14d', patient.stroke_ci_major_surgery_trauma_14d);
    setChk('stroke_ci_recent_mi_3m', patient.stroke_ci_recent_mi_3m);
    setChk('stroke_ci_arterial_puncture_7d', patient.stroke_ci_arterial_puncture_7d);
    setChk('stroke_ci_pregnancy', patient.stroke_ci_pregnancy);

    checkStrokeFibrinolyticTrigger();
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
      preservedDoctorNotes
    } = ctx;
    let { otherSymptomsFree } = ctx;
    let newPatient;
      // ------------------ STROKE / FOCAL NEURO DEFICIT INTAKE ------------------
      const _rawDur = parseFloat(document.getElementById('strokeDurationVal')?.value); const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
      const durationUnit = document.getElementById('strokeDurationUnit')?.value || 'hours';
      const strokeOnsetContext = document.querySelector('input[name="strokeOnsetContext"]:checked')?.value || 'unspecified';

      const strokeExactDate = strokeOnsetContext === 'known_exact' ? (document.getElementById('strokeExactDate')?.value || '') : '';
      const strokeExactTime = strokeOnsetContext === 'known_exact' ? (document.getElementById('strokeExactTime')?.value || '') : '';

      const strokeLsnDate = strokeOnsetContext === 'wake_up_or_unknown' ? (document.getElementById('strokeLsnDate')?.value || '') : '';
      const strokeLsnTime = strokeOnsetContext === 'wake_up_or_unknown' ? (document.getElementById('strokeLsnTime')?.value || '') : '';
      const strokeDiscoveryDate = strokeOnsetContext === 'wake_up_or_unknown' ? (document.getElementById('strokeDiscoveryDate')?.value || '') : '';
      const strokeDiscoveryTime = strokeOnsetContext === 'wake_up_or_unknown' ? (document.getElementById('strokeDiscoveryTime')?.value || '') : '';

      const strokeTransientVal = strokeOnsetContext === 'transient_resolved' ? (parseFloat(document.getElementById('strokeTransientVal')?.value) || null) : null;
      const strokeTransientUnit = strokeOnsetContext === 'transient_resolved' ? (document.getElementById('strokeTransientUnit')?.value || 'minutes') : '';

      const strokeProgression = document.querySelector('input[name="strokeProgression"]:checked')?.value || 'unspecified';

      // Card 2: Motor, Facial Palsy, Sensory & Pain Differential
      const stroke_weakness_hemi = document.getElementById('stroke_weakness_hemi')?.checked || false;
      const strokeHemiSide = stroke_weakness_hemi ? (document.querySelector('input[name="strokeHemiSide"]:checked')?.value || 'none') : 'none';
      const stroke_weakness_arm_only = document.getElementById('stroke_weakness_arm_only')?.checked || false;
      const strokeArmSide = stroke_weakness_arm_only ? (document.querySelector('input[name="strokeArmSide"]:checked')?.value || 'none') : 'none';
      const stroke_weakness_leg_only = document.getElementById('stroke_weakness_leg_only')?.checked || false;
      const strokeLegSide = stroke_weakness_leg_only ? (document.querySelector('input[name="strokeLegSide"]:checked')?.value || 'none') : 'none';
      const stroke_weakness_both_legs = document.getElementById('stroke_weakness_both_legs')?.checked || false;

      const hasAnyLimbWeakness = stroke_weakness_hemi || stroke_weakness_arm_only || stroke_weakness_leg_only || stroke_weakness_both_legs;
      const strokeWeaknessSeverity = hasAnyLimbWeakness
        ? (document.querySelector('input[name="strokeWeaknessSeverity"]:checked')?.value || 'none')
        : 'none';

      const stroke_face_droop = document.getElementById('stroke_face_droop')?.checked || false;
      const strokeFaceSide = stroke_face_droop
        ? (document.querySelector('input[name="strokeFaceSide"]:checked')?.value || 'none')
        : 'none';
      const strokeFaceUpperPattern = stroke_face_droop
        ? (document.querySelector('input[name="strokeFaceUpperPattern"]:checked')?.value || 'none')
        : 'none';

      const stroke_numbness_hemi = document.getElementById('stroke_numbness_hemi')?.checked || false;
      const strokeNumbnessLocs = stroke_numbness_hemi
        ? Array.from(document.querySelectorAll('input[name="strokeNumbnessLoc"]:checked')).map(cb => cb.value)
        : [];
      const strokeNumbnessSide = stroke_numbness_hemi
        ? (document.querySelector('input[name="strokeNumbnessSide"]:checked')?.value || 'none')
        : 'none';

      const stroke_pain_neck_radiating = document.getElementById('stroke_pain_neck_radiating')?.checked || false;
      const stroke_pain_back_radiating = document.getElementById('stroke_pain_back_radiating')?.checked || false;
      const stroke_pain_limb_cold_pale = document.getElementById('stroke_pain_limb_cold_pale')?.checked || false;
      const stroke_pain_chest_back_tearing = document.getElementById('stroke_pain_chest_back_tearing')?.checked || false;

      // Card 3: Speech, Bulbar & Vision
      const stroke_speech_dysarthria = document.getElementById('stroke_speech_dysarthria')?.checked || false;
      const stroke_speech_expressive_aphasia = document.getElementById('stroke_speech_expressive_aphasia')?.checked || false;
      const stroke_speech_receptive_aphasia = document.getElementById('stroke_speech_receptive_aphasia')?.checked || false;
      const stroke_has_dysphagia = document.getElementById('stroke_has_dysphagia')?.checked || false;
      const stroke_vision_monocular = document.getElementById('stroke_vision_monocular')?.checked || false;
      const stroke_vision_hemianopia = document.getElementById('stroke_vision_hemianopia')?.checked || false;
      const stroke_vision_diplopia = document.getElementById('stroke_vision_diplopia')?.checked || false;

      // Card 4: Neurological Warning Signs
      const stroke_rf_altered_mental = document.getElementById('stroke_rf_altered_mental')?.checked || false;
      const stroke_rf_severe_headache = document.getElementById('stroke_rf_severe_headache')?.checked || false;
      const stroke_rf_projectile_vomiting = document.getElementById('stroke_rf_projectile_vomiting')?.checked || false;
      const stroke_rf_seizure = document.getElementById('stroke_rf_seizure')?.checked || false;
      const stroke_rf_ataxia_dizziness = document.getElementById('stroke_rf_ataxia_dizziness')?.checked || false;
      const stroke_rf_neck_stiffness = document.getElementById('stroke_rf_neck_stiffness')?.checked || false;

      // Card 5: Fibrinolysis Contraindications
      const stroke_ci_prior_ich = document.getElementById('stroke_ci_prior_ich')?.checked || false;
      const stroke_ci_brain_lesion = document.getElementById('stroke_ci_brain_lesion')?.checked || false;
      const stroke_ci_cns_surgery_trauma_3m = document.getElementById('stroke_ci_cns_surgery_trauma_3m')?.checked || false;
      const stroke_ci_ischemic_stroke_3m = document.getElementById('stroke_ci_ischemic_stroke_3m')?.checked || false;
      const stroke_ci_active_bleeding = document.getElementById('stroke_ci_active_bleeding')?.checked || false;
      const stroke_ci_gi_bleed_malignancy_21d = document.getElementById('stroke_ci_gi_bleed_malignancy_21d')?.checked || false;
      const stroke_ci_anticoagulant = document.getElementById('stroke_ci_anticoagulant')?.checked || false;
      const stroke_ci_major_surgery_trauma_14d = document.getElementById('stroke_ci_major_surgery_trauma_14d')?.checked || false;
      const stroke_ci_recent_mi_3m = document.getElementById('stroke_ci_recent_mi_3m')?.checked || false;
      const stroke_ci_arterial_puncture_7d = document.getElementById('stroke_ci_arterial_puncture_7d')?.checked || false;
      const stroke_ci_pregnancy = document.getElementById('stroke_ci_pregnancy')?.checked || false;

      newPatient = {
        id: recordId,
        queue_number: queueNumber,
        hn: randomHn,
        name: patientName,
        age: patientAge,
        gender: gender,
        chief_complaint: 'stroke_deficit',
        chief_complaint_title: 'ปากเบี้ยว อ่อนแรง ชา ข้างใดข้างหนึ่ง พูดไม่ชัด',
        status: recordStatus,
        timestamp: new Date().toISOString(),
        durationVal,
        durationUnit,
        strokeOnsetContext,
        strokeExactDate,
        strokeExactTime,
        strokeLsnDate,
        strokeLsnTime,
        strokeDiscoveryDate,
        strokeDiscoveryTime,
        strokeTransientVal,
        strokeTransientUnit,
        strokeProgression,
        stroke_weakness_hemi,
        strokeHemiSide,
        stroke_weakness_arm_only,
        strokeArmSide,
        stroke_weakness_leg_only,
        strokeLegSide,
        stroke_weakness_both_legs,
        strokeWeaknessSeverity,
        stroke_numbness_hemi,
        strokeNumbnessLocs,
        strokeNumbnessSide,
        stroke_pain_neck_radiating,
        stroke_pain_back_radiating,
        stroke_pain_limb_cold_pale,
        stroke_pain_chest_back_tearing,
        stroke_face_droop,
        strokeFaceSide,
        strokeFaceUpperPattern,
        stroke_speech_dysarthria,
        stroke_speech_expressive_aphasia,
        stroke_speech_receptive_aphasia,
        stroke_has_dysphagia,
        stroke_vision_monocular,
        stroke_vision_hemianopia,
        stroke_vision_diplopia,
        stroke_rf_altered_mental,
        stroke_rf_severe_headache,
        stroke_rf_projectile_vomiting,
        stroke_rf_seizure,
        stroke_rf_ataxia_dizziness,
        stroke_rf_neck_stiffness,
        stroke_ci_prior_ich,
        stroke_ci_brain_lesion,
        stroke_ci_cns_surgery_trauma_3m,
        stroke_ci_ischemic_stroke_3m,
        stroke_ci_active_bleeding,
        stroke_ci_gi_bleed_malignancy_21d,
        stroke_ci_anticoagulant,
        stroke_ci_major_surgery_trauma_14d,
        stroke_ci_recent_mi_3m,
        stroke_ci_arterial_puncture_7d,
        stroke_ci_pregnancy,
        otherSymptomsFree,
        hospRecordStatus,
        underlying: underlying.length > 0 ? underlying: ['ปฏิเสธ'],
        drugAllergy,
        currentMeds,
        doctor_notes: preservedDoctorNotes
      };
    return newPatient;
  },

  isRedFlag(p) {
    const isIsolatedPeripheralFacialPalsy = Boolean(
      !p.stroke_weakness_hemi &&
      !p.stroke_weakness_arm_only &&
      !p.stroke_weakness_leg_only &&
      !p.stroke_weakness_both_legs &&
      !p.stroke_numbness_hemi &&
      !p.stroke_pain_limb_cold_pale &&
      !p.stroke_pain_chest_back_tearing &&
      p.stroke_face_droop &&
      p.strokeFaceUpperPattern === 'forehead_involved' &&
      !p.stroke_speech_dysarthria &&
      !p.stroke_speech_expressive_aphasia &&
      !p.stroke_speech_receptive_aphasia &&
      !p.stroke_has_dysphagia &&
      !p.stroke_vision_monocular &&
      !p.stroke_vision_hemianopia &&
      !p.stroke_vision_diplopia &&
      !p.stroke_rf_altered_mental &&
      !p.stroke_rf_severe_headache &&
      !p.stroke_rf_projectile_vomiting &&
      !p.stroke_rf_seizure &&
      !p.stroke_rf_ataxia_dizziness &&
      !p.stroke_rf_neck_stiffness
    );
    if (isIsolatedPeripheralFacialPalsy) return false;
    return Boolean(
      p.stroke_weakness_hemi ||
      p.stroke_weakness_arm_only ||
      p.stroke_weakness_leg_only ||
      p.stroke_weakness_both_legs ||
      p.stroke_numbness_hemi ||
      p.stroke_pain_limb_cold_pale ||
      p.stroke_pain_chest_back_tearing ||
      (p.stroke_face_droop && p.strokeFaceUpperPattern !== 'forehead_involved') ||
      p.stroke_speech_dysarthria ||
      p.stroke_speech_expressive_aphasia ||
      p.stroke_speech_receptive_aphasia ||
      p.stroke_has_dysphagia ||
      p.stroke_vision_monocular ||
      p.stroke_vision_hemianopia ||
      p.stroke_vision_diplopia ||
      p.stroke_rf_altered_mental ||
      p.stroke_rf_severe_headache ||
      p.stroke_rf_projectile_vomiting ||
      p.stroke_rf_seizure ||
      p.stroke_rf_ataxia_dizziness ||
      p.stroke_rf_neck_stiffness ||
      p.strokeOnsetContext === 'transient_resolved'
    );
  },

  evaluateRedFlags(patient) {
    const redFlags = [];
    const within4_5h = isStrokePatientWithin4_5Hours(patient);
    const hasCentralMotorSpeechFace = Boolean(
      patient.stroke_weakness_hemi ||
      patient.stroke_weakness_arm_only ||
      patient.stroke_weakness_leg_only ||
      patient.stroke_speech_dysarthria ||
      patient.stroke_speech_expressive_aphasia ||
      patient.stroke_speech_receptive_aphasia ||
      (patient.stroke_face_droop && patient.strokeFaceUpperPattern !== 'forehead_involved') ||
      patient.stroke_vision_monocular ||
      patient.stroke_vision_hemianopia ||
      patient.stroke_vision_diplopia
    );

    if (within4_5h && hasCentralMotorSpeechFace && patient.strokeOnsetContext !== 'transient_resolved') {
      redFlags.push({
        key: 'stroke_fast_track_window',
        textTh: 'ผู้ป่วยอยู่ในเกณฑ์เวลา Golden Period ≤ 4.5 ชั่วโมง (Activate Stroke Fast Track / Code Stroke)',
        risk: 'ต้องส่งตรวจ STAT Non-contrast CT Brain ทันที (Door-to-CT < 25 นาที), เจาะ DTX ปลายนิ้ว, CBC, PT/INR, aPTT และประเมิน NIHSS เพื่อพิจารณาให้ยาละลายลิ่มเลือด (IV rt-PA / Tenecteplase) หรือ Mechanical Thrombectomy'
      });
    }

    if (patient.stroke_rf_severe_headache || patient.stroke_rf_projectile_vomiting || patient.stroke_rf_neck_stiffness || patient.stroke_ci_anticoagulant) {
      redFlags.push({
        key: 'suspected_ich_or_sah',
        textTh: 'ปวดศีรษะรุนแรงเฉียบพลัน / อาเจียนพุ่ง / คอแข็งเกร็ง / ทานยาต้านการแข็งตัวของเลือด (Suspected Hemorrhagic Stroke / ICH / SAH)',
        risk: 'เสี่ยงภาวะเลือดออกในสมอง (Intracranial Hemorrhage) หรือเลือดออกใต้เยื่อหุ้มสมอง (SAH) ห้ามให้ยาต้านเกล็ดเลือดหรือยาสลายลิ่มเลือดเด็ดขาดจนกว่าจะเห็นผล CT Brain และเตรียมยาลดความดันโลหิต/ยาต้านฤทธิ์ Anticoagulant'
      });
    }

    if (patient.stroke_rf_altered_mental) {
      redFlags.push({
        key: 'altered_mental_herniation',
        textTh: 'ซึมลง สับสน ปลุกตื่นยาก หรือหมดสติ (Altered Mental Status / Threatened Brain Herniation)',
        risk: 'เสี่ยงภาวะความดันในกะโหลกศีรษะสูงวิกฤต ก้านสมองถูกกดทับ หรือ Basilar Artery Occlusion ต้องประเมิน Airway (GCS ≤ 8 พิจารณาใส่ท่อช่วยหายใจ) ทันที'
      });
    }

    if (hasCentralMotorSpeechFace && patient.strokeOnsetContext !== 'transient_resolved') {
      redFlags.push({
        key: 'acute_focal_neuro_deficit',
        textTh: 'อาการทางระบบประสาทเฉพาะที่เฉียบพลัน: แขนขาอ่อนแรง / ปากเบี้ยวแบบ Central / พูดไม่ชัดหรือสับสนภาษา / การมองเห็นผิดปกติ (BE-FAST Positive)',
        risk: 'บ่งชี้รอยโรคหลอดเลือดสมองส่วนหน้าหรือส่วนหลัง (Anterior / Posterior Circulation Stroke) ประเมิน NIHSS และงดน้ำ-อาหาร (NPO) ป้องกันการสำลัก'
      });
    }

    if (patient.stroke_rf_ataxia_dizziness || patient.stroke_vision_diplopia || patient.stroke_has_dysphagia) {
      redFlags.push({
        key: 'posterior_circulation_brainstem_stroke',
        textTh: 'เดินเซทรงตัวไม่ได้ / เวียนศีรษะบ้านหมุน / เห็นภาพซ้อน / กลืนสำลัก (Suspected Posterior Circulation / Brainstem / Cerebellar Stroke)',
        risk: 'เสี่ยงภาวะหลอดเลือดสมองส่วนหลังหรือก้านสมองตีบ/แตก (Vertebrobasilar / PICA / AICA Stroke) ต้องเฝ้าระวังภาวะสมองน้อยบวมกดก้านสมองและการสำลักอุดกั้นทางเดินหายใจ'
      });
    }

    if (patient.stroke_pain_chest_back_tearing || patient.stroke_pain_limb_cold_pale || patient.stroke_weakness_both_legs || patient.stroke_pain_neck_radiating || patient.stroke_pain_back_radiating || patient.stroke_pain_neck_back_radiating) {
      redFlags.push({
        key: 'vascular_or_spinal_emergency_mimic',
        textTh: 'อาการปวดจำเพาะร่วมกับอ่อนแรง: เจ็บอก/ปวดท้องรุนแรงทะลุหลัง / ปวดขาซีดเย็น / ขาอ่อนแรง 2 ข้างหรือปวดร้าวต้นคอ-หลัง (Suspected Aortic Dissection / Acute Limb Ischemia / Spinal Cord Compression)',
        risk: 'ต้องตรวจคลำชีพจรส่วนปลายทั้ง 4 รยางค์ (4-extremity pulses & BP), ตรวจ Sensory level และตัดโรค Aortic Dissection ก่อนพิจารณาให้ยาสลายลิ่มเลือด'
      });
    }

    if (patient.stroke_rf_seizure) {
      redFlags.push({
        key: 'seizure_at_onset_todd_paralysis',
        textTh: 'มีอาการชักเกร็ง กระตุก หรือกัดลิ้นร่วมด้วย (Seizure at Onset / Suspected Todd’s Paralysis or Cortical Haemorrhage)',
        risk: 'ต้องแยกภาวะอ่อนแรงหลังชัก (Postictal Todd’s paralysis) ออกจาก Cortical Stroke หรือ Intracranial Hemorrhage และเป็นข้อควรระวังในการให้ IV Fibrinolysis'
      });
    }

    if (patient.strokeOnsetContext === 'transient_resolved') {
      redFlags.push({
        key: 'transient_ischemic_attack_high_risk',
        textTh: 'อาการทางระบบประสาทเป็นชั่วคราวแล้วทุเลาลงจนหายสนิท (Suspected High-Risk TIA)',
        risk: 'มีความเสี่ยงสูงที่จะเกิด Acute Ischemic Stroke ซ้ำภายใน 48 ชั่วโมง ต้องประเมิน ABCD2 Score, ตรวจ 12-lead EKG (หา AF), ส่ง CT/MRI Brain และพิจารณา Dual Antiplatelet Therapy เร่งด่วน'
      });
    }
    return redFlags;
  },

  updateOutputs(patient) {
    updateStrokeOutputs(patient);
  },

  generateCds(patient, ctx) {
    const { rfs, ddxList, workupList, managementList } = ctx;
    const evalCi = evaluateStrokeFibrinolysisContraindications(patient);
    const isIsolatedBellsPalsy = Boolean(
      !patient.stroke_weakness_hemi &&
      !patient.stroke_weakness_arm_only &&
      !patient.stroke_weakness_leg_only &&
      !patient.stroke_weakness_both_legs &&
      patient.stroke_face_droop &&
      patient.strokeFaceUpperPattern === 'forehead_involved' &&
      !patient.stroke_speech_dysarthria &&
      !patient.stroke_speech_expressive_aphasia &&
      !patient.stroke_speech_receptive_aphasia &&
      !patient.stroke_vision_monocular &&
      !patient.stroke_vision_hemianopia &&
      !patient.stroke_vision_diplopia &&
      !patient.stroke_rf_severe_headache &&
      !patient.stroke_rf_altered_mental
    );

    if (patient.stroke_rf_severe_headache || patient.stroke_rf_projectile_vomiting || patient.stroke_rf_neck_stiffness || patient.stroke_ci_anticoagulant) {
      ddxList.push('1. Acute Intracerebral Hemorrhage (ICH) / Warfarin or Anticoagulant-Associated ICH 🚩');
      ddxList.push('2. Acute Subarachnoid Hemorrhage (SAH) 🚩');
      ddxList.push('3. Large-Vessel Acute Ischemic Stroke with Hemorrhagic Transformation / Malignant Edema');
      workupList.push('• STAT Non-contrast CT Brain ทันที (Door-to-CT < 25 นาที) เพื่อแยกภาวะเลือดออกในสมอง');
      workupList.push('• Point-of-care Capillary Blood Glucose (DTX) ทันทีเพื่อตัดภาวะ Hypoglycemia mimic');
      workupList.push('• CBC, Platelet count, PT/INR, aPTT, Electrolytes, BUN/Cr, 12-lead EKG');
      managementList.push('• 🛑 ห้ามให้ยาสลายลิ่มเลือด (IV rt-PA / Tenecteplase), Aspirin หรือ Anticoagulant เด็ดขาด!');
      if (patient.stroke_ci_anticoagulant) {
        managementList.push('• 🛑 ผู้ป่วยได้รับยาต้านการแข็งตัวของเลือด: เตรียมให้การรักษาต้านฤทธิ์ยาฉุกเฉิน (Reversal agents: Vitamin K1 IV + 4-factor PCC หรือ FFP สำหรับ Warfarin; Idarucizumab/Andexanet alfa สำหรับ DOAC)');
      }
      managementList.push('• ควบคุมความดันโลหิตอย่างใกล้ชิด (หากพบ ICH และ SBP 150-220 mmHg พิจารณาลด SBP ลงสู่เป้าหมาย ~140 mmHg ด้วย IV Nicardipine), จัดศีรษะสูง 30 องศา และปรึกษาประสาทศัลยแพทย์ (Neurosurgery) ด่วน');
    } else if (patient.stroke_pain_chest_back_tearing || patient.stroke_pain_limb_cold_pale) {
      ddxList.push('1. Acute Aortic Dissection with Carotid/Cerebral or Spinal Malperfusion 🚩');
      ddxList.push('2. Acute Limb Ischemia (ALI - Arterial Embolism / Thrombosis) 🚩');
      ddxList.push('3. Cardioembolic Acute Ischemic Stroke');
      workupList.push('• ตรวจวัดความดันโลหิตทั้ง 4 รยางค์ และคลำชีพจรส่วนปลาย (Radial, Femoral, Popliteal, Dorsalis pedis, Posterior tibial pulses)');
      workupList.push('• STAT Non-contrast CT Brain ร่วมกับ CT Angiography (CTA Brain/Neck + CT Aortogram / Peripheral Run-off)');
      workupList.push('• 12-lead EKG, Bedside Echo / Doppler Ultrasound, CBC, Coagulogram, Creatinine');
      managementList.push('• 🛑 ห้ามให้ IV Fibrinolysis (rt-PA) จนกว่าจะตัดภาวะ Acute Aortic Dissection ได้อย่างเด็ดขาด!');
      managementList.push('• ปรึกษาศัลยแพทย์หลอดเลือด (Vascular Surgery / CVT) และอายุรแพทย์ระบบประสาทเร่งด่วน');
    } else if (isIsolatedBellsPalsy) {
      ddxList.push('1. Idiopathic Peripheral Facial Nerve Palsy (Bell’s Palsy - LMN CN VII Palsy)');
      ddxList.push('2. Ramsay Hunt Syndrome (Herpes Zoster Oticus)');
      ddxList.push('3. Pontine Lacunar Infarct (Fascicular CN VII Lesion - ต้องตรวจระบบประสาทซ้ำให้มั่นใจว่าไม่มี Abducens palsy หรือ Long-tract signs)');
      workupList.push('• ตรวจร่างกายทางระบบประสาทอย่างละเอียด: ยืนยันว่ายักคิ้วไม่ขึ้นและหลับตาไม่สนิทข้างเดียวกับที่ปากเบี้ยว (Forehead involved), กำลังแขนขาปกติ (Motor 5/5), ไม่มี Nystagmus หรือ Ataxia');
      workupList.push('• ตรวจใบหูและช่องหู (Otoscopy) เพื่อดูตุ่มน้ำใสของ Ramsay Hunt Syndrome');
      workupList.push('• เจาะ DTX คัดกรองภาวะเบาหวาน');
      managementList.push('• พิจารณาให้ Corticosteroids ภายใน 72 ชั่วโมงแรก: Prednisolone 1 mg/kg/day (สูงสุด 60 mg/day) นาน 5-7 วัน แล้วค่อยๆ ลดขนาดยา');
      managementList.push('• การดูแลกระจกตาสำคัญมาก (Eye protection): ใช้น้ำตาเทียมหยอดกลางวัน, ป้ายขี้ผึ้งตาและปิดตาเวลานอนป้องกัน Exposure keratitis');
    } else if (patient.strokeOnsetContext === 'transient_resolved') {
      ddxList.push('1. Transient Ischemic Attack (TIA - High Risk for Recurrent Stroke) 🚩');
      ddxList.push('2. Minor Acute Ischemic Stroke with Rapid Improvement');
      ddxList.push('3. Stroke Mimics (Focal Seizure / Hemiplegic Migraine / Hypoglycemia)');
      workupList.push('• คำนวณ ABCD2 Score เพื่อประเมินความเสี่ยงเกิด Stroke ซ้ำใน 48 ชั่วโมง');
      workupList.push('• Urgent Non-contrast CT Brain หรือ MRI Brain (DWI), Carotid Doppler / CTA Neck');
      workupList.push('• Point-of-care DTX, 12-lead EKG (คัดกรอง Atrial Fibrillation), CBC, Lipid profile, HbA1c');
      managementList.push('• หากผล CT Brain ไม่พบเลือดออก พิจารณาเริ่ม Antiplatelet ทันที (Dual Antiplatelet Therapy: Aspirin + Clopidogrel นาน 21 วันในกรณี High-risk TIA / ABCD2 ≥ 4)');
      managementList.push('• สังเกตอาการทางระบบประสาทใกล้ชิด หากกลับมามีอาการอ่อนแรงซ้ำให้เปิด Stroke Fast Track ทันที');
    } else if (evalCi.isWithin4_5Hours) {
      ddxList.push('1. Acute Ischemic Stroke within 4.5-Hour Golden Period (Stroke Fast Track Candidate) 🚩');
      ddxList.push('2. Acute Intracerebral Hemorrhage (ต้องแยกด้วย Non-contrast CT Brain)');
      ddxList.push('3. Stroke Mimics (Hypoglycemia / Postictal Todd’s Paralysis)');
      workupList.push('• ⚡ ACTIVATE STROKE FAST TRACK ทันที: เป้าหมาย Door-to-CT < 25 นาที และ Door-to-Needle < 60 นาที');
      workupList.push('• เจาะ DTX ปลายนิ้วทันที (ต้อง ≥ 50 mg/dL), ส่ง CBC, Platelet count, PT/INR, aPTT, Electrolytes, BUN/Cr');
      workupList.push('• ประเมิน NIHSS Score และส่ง STAT Non-contrast CT Brain (+/- CTA Brain & Neck หากสงสัย Large Vessel Occlusion)');
      if (evalCi.absoluteList.length > 0) {
        managementList.push(`• 🛑 ตรวจพบข้อห้ามเด็ดขาดต่อการให้ IV Fibrinolysis จากประวัติ: ${evalCi.absoluteList.join('; ')} — ห้ามให้ IV rt-PA และพิจารณาปรึกษา Mechanical Thrombectomy หากเป็น LVO`);
      } else {
        managementList.push('• ✓ ไม่พบข้อห้ามเด็ดขาดจากประวัติ: หากผล CT Brain ไม่พบเลือดออกหรือสมองตายเกิน 1/3 MCA และ BP < 185/110 mmHg พิจารณาให้ IV Alteplase (rt-PA) 0.9 mg/kg (สูงสุด 90 mg) หรือ Tenecteplase ตามแนวทาง รพ.ราชบุรี');
      }
      if (evalCi.relativeList.length > 0) {
        managementList.push(`• ⚠️ ข้อควรระวังสัมพัทธ์ที่ต้องชั่งน้ำหนักความเสี่ยง: ${evalCi.relativeList.join('; ')}`);
      }
      managementList.push('• งดน้ำและอาหารทางปาก (NPO) จนกว่าจะผ่านการประเมินการกลืน (Swallowing screen)');
    } else {
      ddxList.push('1. Acute / Subacute Ischemic Stroke (Presenting > 4.5 hours) 🚩');
      ddxList.push('2. Intracerebral Hemorrhage / Subacute Subdural Hematoma');
      ddxList.push('3. Spinal Cord / Radicular Lesion or Metabolic Encephalopathy');
      workupList.push('• Urgent Non-contrast CT Brain (และพิจารณา CTA/CTP หรือ MRI Brain หากอยู่ในช่วง 6-24 ชม. เพื่อคัดกรอง Large Vessel Occlusion สำหรับ Mechanical Thrombectomy)');
      workupList.push('• DTX ปลายนิ้ว, CBC, PT/INR, BUN/Cr, Electrolytes, Lipid profile, 12-lead EKG');
      managementList.push('• ผู้ป่วยมาเกินกรอบเวลา 4.5 ชั่วโมงสำหรับ IV rt-PA มาตรฐาน: หากผล CT Brain ไม่พบเลือดออก ให้พิจารณา Aspirin 160-325 mg (หลังผ่านการประเมินการกลืน หรือทาง NG tube)');
      managementList.push('• รับไว้รักษาในหอผู้ป่วยโรคหลอดเลือดสมอง (Stroke Unit), ดูแลสมดุลสารน้ำ และเฝ้าระวังภาวะแทรกซ้อน');
    }
  }
});
