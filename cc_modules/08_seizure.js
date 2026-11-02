// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 08_seizure.js
// อาการนำ: ชัก / เกร็งกระตุก (Seizure / Convulsion)
// ไฟล์นี้แยกอิสระสำหรับอาการนำ seizure เพื่อให้ทีมแพทย์และ IT โรงพยาบาลนำไปพัฒนาต่อได้โดยไม่กระทบระบบหลัก
// =========================================================================

function checkSeizurePediatricAgeGuidance() {
  const ageVal = parseInt(document.getElementById('patientAgeInput')?.value, 10);
  const banner = document.getElementById('seizurePediatricAgeBanner');
  if (!banner) return;
  banner.classList.remove('hidden');
  if (!isNaN(ageVal) && ageVal < 6) {
    banner.classList.add('ring-2', 'ring-amber-500', 'bg-amber-100');
  } else {
    banner.classList.remove('ring-2', 'ring-amber-500', 'bg-amber-100');
  }
}

function hasWarningProdrome(patient, key) {
  if (!patient) return false;
  if (Array.isArray(patient.seizureWarningProdromes)) {
    return patient.seizureWarningProdromes.includes(key);
  }
  return patient.seizureWarningProdrome === key;
}

function handleSeizurePrecedingPostureChange() {
  const checked = document.querySelector('input[name="seizurePrecedingPosture"]:checked')?.value;
  const wrap = document.getElementById('seizurePrecedingPostureOtherWrap');
  if (wrap) {
    if (checked === 'other') wrap.classList.remove('hidden');
    else wrap.classList.add('hidden');
  }
}

function handleSeizureLossOfConsciousDurationChange() {
  const checked = document.querySelector('input[name="seizureLossOfConsciousDuration"]:checked')?.value;
  const wrap = document.getElementById('seizureDurationGte5mWrap');
  if (wrap) {
    if (checked === 'prolonged_gte_5m') wrap.classList.remove('hidden');
    else wrap.classList.add('hidden');
  }
}

function handleSeizureWarningChange(el) {
  if (!el) return;
  if (el.value === 'none_sudden' && el.checked) {
    document.querySelectorAll('input[name="seizureWarningProdrome"]').forEach(cb => {
      if (cb.value !== 'none_sudden') cb.checked = false;
    });
  } else if (el.checked && el.value !== 'none_sudden') {
    const noneCb = document.querySelector('input[name="seizureWarningProdrome"][value="none_sudden"]');
    if (noneCb) noneCb.checked = false;
  }
}

function handleSeizureEpisodeCountChange() {
  const checked = document.querySelector('input[name="seizureEpisodeCount"]:checked')?.value;
  const countWrap = document.getElementById('seizureEpisodeCountWrap');
  const interictalWrap = document.getElementById('seizureInterictalWrap');
  if (checked === 'multiple_cluster') {
    if (countWrap) countWrap.classList.remove('hidden');
    if (interictalWrap) interictalWrap.classList.remove('hidden');
  } else {
    if (countWrap) countWrap.classList.add('hidden');
    if (interictalWrap) interictalWrap.classList.add('hidden');
  }
}

function handleSeizureToddParesisChange() {
  const checked = document.querySelector('input[name="seizureHasToddParesis"]:checked')?.value;
  const wrap = document.getElementById('seizureToddSideWrap');
  if (wrap) {
    if (checked === 'yes') wrap.classList.remove('hidden');
    else wrap.classList.add('hidden');
  }
}

function handleSeizurePriorHistoryChange() {
  const checked = document.querySelector('input[name="seizurePriorHistory"]:checked')?.value;
  const wrap = document.getElementById('seizureMedComplianceWrap');
  if (wrap) {
    if (checked === 'known_epilepsy') wrap.classList.remove('hidden');
    else wrap.classList.add('hidden');
  }
}

function handleSeizureSubstanceToxinChange() {
  const chk = document.getElementById('seizure_rf_substance_toxin')?.checked;
  const wrap = document.getElementById('seizureSubstanceDetailsWrap');
  if (wrap) {
    if (chk) wrap.classList.remove('hidden');
    else wrap.classList.add('hidden');
  }
}



    function calculateSheldonScore(patient) {
      let score = 0;
      let details = [];
      const isSyncope = patient.chief_complaint === 'syncope';

      // Seizure features (+)
      const hasTongueBite = isSyncope
        ? (patient.syncopeSigns || []).includes('syncope_lateral_tongue_bite')
        : patient.seizure_lateral_tongue_bite;
      if (hasTongueBite) {
        score += 2;
        details.push('กัดลิ้นด้านข้าง (+2)');
      }

      const hasAura = isSyncope
        ? (patient.syncopeProdromes || []).some(p => p === 'epigastric_rising' || p === 'olfactory_gustatory')
        : (hasWarningProdrome(patient, 'epigastric_rising') || hasWarningProdrome(patient, 'olfactory_gustatory'));
      if (hasAura) {
        score += 1;
        details.push('มีอาการเตือน Aura ในท้อง/กลิ่นไหม้ (+1)');
      }

      const hasEyeDev = isSyncope
        ? false
        : patient.seizure_eye_deviation;
      if (hasEyeDev) {
        score += 1;
        details.push('ตาค้าง/ตาเหลือกเบนไปข้างหนึ่ง (+1)');
      }

      const hasConfusionGt5m = isSyncope
        ? (patient.syncopeRecoveryPattern === 'prolonged_confusion' || patient.syncopeRecoveryPattern === 'persistent_drowsy_coma')
        : patient.seizureRecoveryDuration === 'confusion_drowsy_gt_5m';
      if (hasConfusionGt5m) {
        score += 1;
        details.push('สับสนมึนงงหลังฟื้นนานเกิน 5 นาที (+1)');
      }

      const hasSevereHeadacheMyalgia = isSyncope
        ? (patient.syncopePostSymptoms || []).includes('post_severe_headache_myalgia')
        : patient.seizurePostEventSymptoms === 'headache_severe_myalgia';
      if (hasSevereHeadacheMyalgia) {
        score += 1;
        details.push('ปวดศีรษะรุนแรงและปวดกล้ามเนื้อระบม (+1)');
      }

      const hasGTCS = isSyncope
        ? ((patient.syncopeMotorCategory === 'abnormal_movements' && patient.syncopeMotorSign === 'generalized_tonic_clonic') || patient.syncopeMotorSign === 'generalized_tonic_clonic')
        : patient.seizureMotorPattern === 'generalized_tonic_clonic';
      if (hasGTCS) {
        score += 1;
        details.push('เกร็งกระตุกเป็นจังหวะต่อเนื่องเป็นหลักนาที (+1)');
      }

      // Syncope features (-)
      const hasTunnelVision = isSyncope
        ? (patient.syncopeProdromes || []).includes('lightheaded_tunnel_vision')
        : hasWarningProdrome(patient, 'lightheaded_tunnel_vision');
      if (hasTunnelVision) {
        score -= 2;
        details.push('มีอาการหน้ามืด/ตามัว/หูอื้อนำมาก่อน (-2)');
      }

      const hasSweatPallorNausea = isSyncope
        ? ((patient.syncopeProdromes || []).includes('cold_sweat_pallor_nausea') || (patient.syncopeSigns || []).includes('syncope_marked_pallor_sweat'))
        : (hasWarningProdrome(patient, 'cold_sweat_pallor_nausea') || patient.seizure_marked_pallor_sweat);
      if (hasSweatPallorNausea) {
        score -= 1;
        details.push('เหงื่อแตกตัวเย็นหน้าซีด (-1)');
      }

      const posture = isSyncope ? patient.syncopePosture : patient.seizurePrecedingPosture;
      if (posture === 'prolonged_standing' || posture === 'sudden_standing') {
        score -= 2;
        details.push('เกิดขึ้นขณะยืนนานหรือลุกเร็ว (-2)');
      }

      const hasRapidRecovery = isSyncope
        ? patient.syncopeRecoveryPattern === 'rapid_spontaneous'
        : patient.seizureRecoveryDuration === 'rapid_under_2m_alert';
      if (hasRapidRecovery) {
        score -= 2;
        details.push('ฟื้นคืนสติอย่างรวดเร็วภายใน 1-2 นาทีไม่งง (-2)');
      }

      return {
        score,
        details,
        interpretation: score >= 1 
          ? `⚡ เข้าได้กับโรคลมชัก (Probable Epileptic Seizure — Sheldon Score = ${score} >= 1)`
          : `💧 เข้าได้กับภาวะเป็นลมหมดสติ (Probable Syncope / Convulsive Syncope — Sheldon Score = ${score} < 1)`
      };
    }

    function evaluateHyperventilationScreen(patient) {
      const isSyncope = patient.chief_complaint === 'syncope';
      const isHvs = isSyncope
        ? Boolean(
            (patient.syncopeMotorCategory === 'abnormal_movements' && patient.syncopeMotorSign === 'carpopedal_spasm') ||
            patient.syncopeMotorSign === 'carpopedal_spasm' ||
            (patient.syncopeProdromes || []).includes('hyperventilation_tingling')
          )
        : Boolean(
            patient.seizureMotorPattern === 'carpopedal_spasm' ||
            hasWarningProdrome(patient, 'hyperventilation_tingling') ||
            patient.seizureRecoveryDuration === 'tearful_emotional_tachypnea' ||
            patient.seizure_rf_emotional_panic_trigger
          );
      return {
        isSuspected: isHvs,
        label: isHvs 
          ? '🫁 เข้าได้กับกลุ่มอาการหายใจหอบเร็วและมือจีบเกร็ง (Suspected Hyperventilation Syndrome with Carpopedal Spasm / Tetany)' 
          : '✓ ไม่พบอาการจำเพาะของกลุ่มอาการหายใจหอบเร็ว'
      };
    }

    function updateSeizureOutputs(patient) {
      const unitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
      const durationText = patient.durationVal ? `${patient.durationVal} ${unitMap[patient.durationUnit] || 'ชั่วโมง'}` : 'ไม่ระบุ';

      const sheldon = calculateSheldonScore(patient);
      const hvs = evaluateHyperventilationScreen(patient);

      const reporterMap = {
        patient_self: 'ผู้ป่วยรู้สึกตัวดีและเป็นผู้เล่าประวัติเอง',
        witness_relative: 'ญาติหรือผู้เห็นเหตุการณ์ในขณะหมดสติ/ชักเป็นผู้เล่า',
        both_patient_witness: 'ทั้งผู้ป่วยและผู้เห็นเหตุการณ์ร่วมกันให้ข้อมูล',
        unspecified: 'ไม่ได้ระบุผู้ให้ประวัติ'
      };

      const postureMap = {
        prolonged_standing: 'ยืนอยู่เป็นเวลานาน หรืออยู่ในที่แออัด/ร้อนอบอ้าว',
        sudden_standing: 'เพิ่งเปลี่ยนท่า ลุกขึ้นยืนเร็วๆ จากท่านั่งหรือท่านอน',
        during_exertion: 'เกิดขึ้นขณะกำลังออกแรง ทำงานหนัก หรือออกกำลังกาย 🚩',
        standing_or_walking_normal: 'ขณะยืนหรือเดินธรรมดา ไม่ได้ออกแรงทำอะไร',
        supine_or_resting: 'เกิดขึ้นขณะนอนหงาย หรือนั่งพักผ่อนอยู่เฉยๆ 🚩',
        micturition_defecation: 'เกิดขึ้นขณะหรือทันทีหลังปัสสาวะ อุจจาระ หรือไอแรงๆ',
        sleep: 'ขณะหลับ',
        sleep_or_unprovoked: 'ขณะหลับ',
        other: patient.seizurePrecedingPostureOtherText ? `อื่นๆ: ${patient.seizurePrecedingPostureOtherText}` : 'อื่นๆ',
        unspecified: 'ไม่ได้ระบุท่าทาง'
      };

      const lossDurationMap = {
        brief_seconds: 'สั้นมากเพียงไม่กี่วินาที (ประมาณ 10–30 วินาที) แล้วเริ่มรู้สึกตัว',
        typical_seizure_minutes: 'นานประมาณ 1–3 นาที',
        prolonged_gte_5m: `นานตั้งแต่ 5 นาทีขึ้นไป${patient.seizureDurationGte5mVal ? ` (ประมาณ ${patient.seizureDurationGte5mVal} นาที)` : ''} (Status Epilepticus) 🚩`,
        continuous_unstopped: 'ชักต่อเนื่องไม่หยุด (Active Status Epilepticus) 🚩',
        unspecified: 'ไม่ได้ระบุระยะเวลาหมดสติ'
      };

      const prodromeMap = {
        none_sudden: 'ไม่มีอาการเตือนใดๆ ล้มลงหรือหมดสติทันทีทันใด',
        lightheaded_tunnel_vision: 'รู้สึกหน้ามืด วิงเวียน ตาพร่ามัวเห็นภาพมืดลงเป็นอุโมงค์ หรือมีเสียงหูอื้อ',
        cold_sweat_pallor_nausea: 'มีเหงื่อแตกตัวเย็นท่วมตัว หน้าซีด คลื่นไส้ ใจหวิวพะอืดพะอม',
        sudden_palpitation: 'รู้สึกใจสั่นรัว หัวใจเต้นสะดุด หรือเต้นเร็วผิดปกติอย่างกะทันหันก่อนวูบ 🚩',
        hyperventilation_tingling: 'มีอาการหายใจหอบเร็ว ลึก แน่นหน้าอก ชารอบปาก หรือชาตามปลายนิ้วมือ',
        epigastric_rising: 'รู้สึกแปลกๆ จุกแน่นหรือโหวงในช่องท้องลอยตีขึ้นมาที่คอ (Aura)',
        olfactory_gustatory: 'ได้กลิ่นแปลกประหลาด กลิ่นเหม็นไหม้ หรือรสชาติแปลกในปาก (Aura)',
        visual_dejavu: 'มองเห็นแสงวูบวาบ ภาพหลอน หรือมีความรู้สึกคุ้นเคยประหลาด (Déjà vu)',
        unspecified: 'ไม่ได้ระบุอาการเตือน'
      };

      const prodromesList = Array.isArray(patient.seizureWarningProdromes) && patient.seizureWarningProdromes.length > 0
        ? patient.seizureWarningProdromes
        : (patient.seizureWarningProdrome ? [patient.seizureWarningProdrome] : ['unspecified']);
      const prodromesText = prodromesList.map(p => prodromeMap[p] || p).join(', ');

      const motorMap = {
        generalized_tonic_clonic: 'ตัวแข็งเกร็งแล้วกระตุกรุนแรงเป็นจังหวะพร้อมกันทั้งตัว ต่อเนื่องเป็นหลักนาที หรือหลายนาที (GTCS)',
        focal_motor: 'กระตุกหรือเกร็งเฉพาะส่วน (แขนข้างเดียว ขาข้างเดียว หรือมุมปากข้างเดียว) 🚩',
        brief_myoclonic_syncope: 'ตัวอ่อนล้มลง แต่มีอาการกระตุกเบาๆ สั้นๆ เพียงไม่กี่ครั้ง (สั้นๆ 5–15 วินาที - Convulsive Syncope)',
        carpopedal_spasm: 'มือจีบเกร็ง ปลายนิ้วมืองุ้มเข้าหากันทั้งสองข้าง หรือเกร็งปลายเท้างุ้ม (Carpopedal Spasm / Tetany)',
        atonic_limp: 'ตัวอ่อนปวกเปียกล้มพับลงกับพื้นทันที โดยไม่มีการเกร็งกระตุก',
        absence_automatism: 'นิ่งค้าง เหม่อลอย เรียกไม่ตอบ มีการเคี้ยวปาก ขยำมือ หรือกระพริบตาถี่ๆ',
        thrashing_closed_eyes: 'ดิ้นสะบัดไปมา ส่ายศีรษะไปมา ลำตัวแอ่น',
        unknown_or_unobserved: 'ไม่ทราบแน่ชัด หรือไม่ได้สังเกตลักษณะการเคลื่อนไหว',
        unspecified: 'ไม่ได้ระบุลักษณะการเกร็ง'
      };

      const recoveryMap = {
        rapid_under_2m_alert: 'ฟื้นคืนสติและคุยรู้เรื่องเป็นปกติอย่างรวดเร็ว (ภายใน 1–2 นาที) ไม่งง ไม่ง่วง',
        confusion_drowsy_gt_5m: 'สับสน มึนงง จำเหตุการณ์ไม่ได้ นานเกิน 5–15 นาที หรือหลับลึก ปลุกตื่นยาก (Post-ictal confusion)',
        tearful_emotional_tachypnea: 'รู้สึกตัวดีแต่ยังเหนื่อยหอบ มือชา ร้องไห้ หรือมีความเครียดตกใจ',
        unspecified: 'ไม่ได้ระบุการฟื้นตัว'
      };

      const postSymptomMap = {
        headache_severe_myalgia: 'มีอาการปวดศีรษะตุบๆ รุนแรง หรือปวดเมื่อยระบมกล้ามเนื้อทั่วร่างกาย',
        mild_fatigue_no_myalgia: 'รู้สึกอ่อนเพลียเล็กน้อย แต่ไม่มีอาการปวดศีรษะหรือปวดเมื่อยกล้ามเนื้อ',
        unspecified: 'ไม่ได้ระบุ'
      };

      const priorHistoryMap = {
        known_epilepsy: 'เป็นโรคลมชักเดิมอยู่แล้ว และเคยรับประทานยากันชัก',
        recurrent_vasovagal: 'เคยมีอาการเป็นลมหน้ามืดบ่อยๆ เวลาตกใจ กลัวเลือด หรือยืนนาน',
        first_time_tloc: 'เพิ่งเคยมีอาการหมดสติหรือชักครั้งนี้เป็นครั้งแรกในชีวิต',
        unspecified: 'ไม่ได้ระบุ'
      };

      const complianceMap = {
        compliant: 'รับประทานยาสม่ำเสมอครบตามแพทย์สั่ง',
        missed_or_stopped: 'ขาดยา ลืมรับประทานยา หรือหยุดยาเองในช่วง 1–7 วันนี้ (Trigger)',
        dose_changed: 'เพิ่งมีการปรับเปลี่ยนขนาดยาหรือชนิดยาเมื่อเร็วๆ นี้',
        unspecified: 'ไม่ได้ระบุ'
      };

      // Pertinent positives & negatives
      const positives = [];
      const negatives = [];

      if (patient.seizure_lateral_tongue_bite) positives.push('มีแผลกัดลิ้นด้านข้างหรือเลือดออกในปาก');
      else negatives.push('ไม่มีแผลกัดลิ้น');

      if (patient.seizure_eye_deviation) positives.push('มีตาค้าง/ตาเหลือกขึ้นบน/เหลอกเบนไปข้างหนึ่ง');
      else negatives.push('ไม่มีตาค้างเหลอก');

      if (patient.seizure_incontinence) positives.push('มีปัสสาวะราดหรืออุจจาระราดขณะหมดสติ');
      else negatives.push('ไม่มีปัสสาวะ/อุจจาระราด');

      if (patient.seizure_cyanosis_apnea) positives.push('มีริมฝีปากเขียวคล้ำ ตัวเขียว หรือหยุดหายใจชั่วขณะ');
      else negatives.push('ไม่มีตัวเขียวหรือหยุดหายใจ');

      if (patient.seizure_marked_pallor_sweat) positives.push('มีใบหน้าซีดเผือด ตัวเย็น และเหงื่อออกเปียกชุ่ม');
      else negatives.push('ไม่มีหน้าซีดเหงื่อท่วม');

      if (patient.seizure_fall_injury) positives.push('มีร่างกายหรือศีรษะกระแทกพื้น ได้รับบาดเจ็บ/แผลฟกช้ำ');
      else negatives.push('ไม่มีบาดเจ็บจากการล้ม');

      if (patient.seizureHasToddParesis === 'yes') positives.push(`มีอาการอ่อนแรงครึ่งซีกหลังหยุดชัก [ข้าง: ${patient.seizureToddSide || 'ไม่ระบุ'}] (Todd Paresis 🚩)`);
      else negatives.push('ไม่มีอาการแขนขาอ่อนแรงหลังหยุดชัก');

      // Specific risk factors
      if (patient.seizure_rf_known_cardiac_disease) positives.push('มีโรคประจำตัวทางหัวใจ (หลอดเลือดหัวใจ/ลิ้นหัวใจ/เต้นผิดจังหวะ) 🚩');
      if (patient.seizure_rf_family_sudden_death) positives.push('มีประวัติครอบครัวเสียชีวิตกะทันหันตั้งแต่อายุน้อย (< 50 ปี) 🚩');
      if (patient.seizure_rf_pregnancy_postpartum) positives.push('กำลังตั้งครรภ์ หรือเพิ่งคลอดบุตร/แท้งบุตรภายใน 6 สัปดาห์ (สงสัย Eclampsia 🚩)');
      if (patient.seizure_rf_diabetic_hypo) positives.push('มีประวัติเบาหวาน และมีอาการใจสั่นเหงื่อแตกตัวเย็นก่อนหมดสติ (สงสัย Hypoglycemia 🚩)');
      if (patient.seizure_rf_alcohol_withdrawal) positives.push('ดื่มสุราเป็นประจำแล้วเพิ่งหยุดดื่ม 1-3 วัน (สงสัย Alcohol withdrawal seizure 🚩)');
      if (patient.seizure_rf_fever_meningismus) positives.push('มีไข้สูง หนาวสั่น คอแข็ง หรือปวดศีรษะรุนแรงนำมาก่อน (สงสัย CNS Infection 🚩)');
      if (patient.seizure_rf_recent_head_trauma) positives.push('เพิ่งได้รับอุบัติเหตุกระแทกศีรษะรุนแรงก่อนหน้าที่จะมีอาการ 🚩');
      if (patient.seizure_rf_emotional_panic_trigger) positives.push('มีความเครียดทางอารมณ์รุนแรง ตื่นตระหนก หรือทะเลาะวิวาทนำมาก่อน');
      if (patient.seizure_rf_substance_toxin) positives.push(`มีประวัติใช้สารเสพติด สารพิษ หรือยาเกินขนาด${patient.seizureSubstanceDetails ? ` [ระบุ: ${patient.seizureSubstanceDetails}]` : ''} 🚩`);

      if (patient.otherSymptomsFree) positives.push(patient.otherSymptomsFree);

      const hospLabel = {
        complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
        additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
        self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
        unspecified: 'ไม่ได้ระบุ'
      }[patient.hospRecordStatus] || 'ไม่ได้ระบุ';

      const docNotes = patient.doctor_notes || {};
      const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ' || patient.currentMeds === 'ไม่มี') ? 'ไม่มี' : patient.currentMeds;

      patient.pertinentPositives = positives.length > 0 ? positives : ['ไม่มีอาการร่วมผิดปกติ'];
      patient.pertinentNegatives = negatives;

      // A) Rapid Bullet Format for Seizure & TLOC
      const defaultRapid =
`[Chief Complaint (CC)]
ชัก / เกร็งกระตุก (Transient Loss of Consciousness / Seizure Workup) มา ${durationText}

[History of Present Illness (HPI)]
• ผู้ให้ประวัติ: ${reporterMap[patient.seizureReporter] || 'ไม่ระบุ'}
• ท่าทางก่อนเกิดเหตุ: ${postureMap[patient.seizurePrecedingPosture] || 'ไม่ระบุ'}
• อาการเตือนล่วงหน้า (Prodrome/Aura): ${prodromesText}
• ลักษณะการเกร็ง/กระตุก: ${motorMap[patient.seizureMotorPattern] || 'ไม่ระบุ'}
• ระยะเวลาที่หมดสติ/ชัก: ${lossDurationMap[patient.seizureLossOfConsciousDuration] || 'ไม่ระบุ'}
• ความถี่และรอบการเกิดเหตุ: ${patient.seizureEpisodeCount === 'multiple_cluster' ? `ชักซ้ำ ${patient.seizureEpisodeCountVal || 2} ครั้ง (สภาพระหว่างรอบ: ${patient.seizureInterictalState === 'unconscious_or_drowsy' ? 'ซึมตลอดเวลา/ไม่ฟื้นสติ 🚩' : 'ฟื้นคืนสติตามปกติ'})` : 'มีอาการเพียงครั้งเดียว'}
• การฟื้นตัวหลังเกิดเหตุ: ${recoveryMap[patient.seizureRecoveryDuration] || 'ไม่ระบุ'}
• อาการทางกายหลังฟื้น: ${postSymptomMap[patient.seizurePostEventSymptoms] || 'ไม่ระบุ'}

• Pertinent Positives:
${positives.length > 0 ? positives.map(p => `  - ${p}`).join('\n') : '  - ไม่มีอาการร่วมอื่นที่เด่นชัด'}

• Pertinent Negatives:
${negatives.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• ประวัติการชัก/เป็นลมเดิม: ${priorHistoryMap[patient.seizurePriorHistory] || 'ไม่ระบุ'}
${patient.seizurePriorHistory === 'known_epilepsy' ? `• การรับประทานยากันชัก: ${complianceMap[patient.seizureMedCompliance] || 'ไม่ระบุ'}\n` : ''}• โรคประจำตัว (U/D): ${patient.underlying?.length > 0 ? patient.underlying.join(', ') : 'ปฏิเสธ'}
• ยาประจำตัว (Current Meds): ${medsText}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${patient.drugAllergy || 'ปฏิเสธ'}

[Emergency Risk Assessment (Red Flags)]
${patient.redFlags?.length > 0
  ? `🚩 RED FLAGS DETECTED:\n${patient.redFlags.map(rf => `  * ${rf.textTh}`).join('\n')}`
  : '✓ ไม่พบสัญญาณเตือนวิกฤตเฉียบพลันเบื้องต้น'}

[Doctor's Clinical Addendum & Exam]
• ประวัติเพิ่มเติม/แก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}
• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}
• แผนการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

      // B) Narrative Paragraph Format for Seizure
      const defaultNarrative =
`ผู้ป่วย [${patient.name}] อายุ ${patient.age || '-'} ปี เพศ ${patient.gender || 'ไม่ระบุ'} มารับการตรวจที่ห้องฉุกเฉิน รพ.ราชบุรี ด้วยอาการชัก / เกร็งกระตุก หรือหมดสติชั่วขณะ มา ${durationText}
ข้อมูลเหตุการณ์: ให้ประวัติโดย [${reporterMap[patient.seizureReporter] || 'ไม่ระบุ'}] เกิดเหตุขณะ [${postureMap[patient.seizurePrecedingPosture] || 'ไม่ระบุ'}] อาการเตือนนำก่อนเกิดเหตุ: [${prodromesText}] ขณะหมดสติมีลักษณะ [${motorMap[patient.seizureMotorPattern] || 'ไม่ระบุ'}] ระยะเวลาที่หมดสติ/ชักประมาณ [${lossDurationMap[patient.seizureLossOfConsciousDuration] || 'ไม่ระบุ'}] โดยมีอาการ [${patient.seizureEpisodeCount === 'multiple_cluster' ? `ซ้ำ ${patient.seizureEpisodeCountVal || 2} ครั้ง` : 'เพียงครั้งเดียว'}] การฟื้นคืนสติหลังเกิดเหตุ: [${recoveryMap[patient.seizureRecoveryDuration] || 'ไม่ระบุ'}]

การซักประวัติแยกโรค TLOC: Sheldon Seizure vs Syncope Score ได้ ${sheldon.score} คะแนน (${sheldon.interpretation}); การประเมินกลุ่มอาการหายใจหอบเร็ว: ${hvs.label}
อาการร่วมสำคัญที่ตรวจพบ: ${positives.join(', ')}
อาการสำคัญที่ปฏิเสธ: ${negatives.join(', ')}

ประวัติเดิมและการใช้ยา: ประวัติการชัก/เป็นลมในอดีต: [${priorHistoryMap[patient.seizurePriorHistory] || 'ไม่ระบุ'}]${patient.seizurePriorHistory === 'known_epilepsy' ? `, การรับประทานยากันชัก: [${complianceMap[patient.seizureMedCompliance] || 'ไม่ระบุ'}]` : ''}, โรคประจำตัว: ${patient.underlying?.length > 0 ? patient.underlying.join(', ') : 'ปฏิเสธ'}, ยาประจำตัว: ${medsText}, ประวัติแพ้ยา/แพ้อาหาร: ${patient.drugAllergy || 'ปฏิเสธประวัติแพ้ยา/แพ้อาหาร'}
${patient.redFlags?.length > 0 ? `\n[🚩 สัญญาณเตือนอันตราย (Red Flags)]: ${patient.redFlags.map(rf => rf.textTh).join('; ')}` : ''}

[บันทึกการตรวจและการประเมินโดยแพทย์]:
• ประวัติเพิ่มเติม: ${docNotes.additional_hpi || '-'}
• ผลตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น: ${docNotes.preliminary_dx || '-'}
• แผนการรักษา: ${docNotes.plan || '-'}`;

      // C) JSON Payload for Seizure
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
        "chief_complaint": "seizure",
        "tloc_and_seizure_profile": {
          "duration_value": patient.durationVal || null,
          "duration_unit": patient.durationUnit || null,
          "history_informant": patient.seizureReporter,
          "preceding_posture_and_activity": patient.seizurePrecedingPosture,
          "preceding_posture_other_text": patient.seizurePrecedingPostureOtherText || "",
          "warning_prodromes": prodromesList,
          "warning_prodromes_text": prodromesText,
          "warning_prodrome_or_aura": patient.seizureWarningProdrome,
          "loss_of_consciousness_duration": patient.seizureLossOfConsciousDuration,
          "loss_of_consciousness_duration_approx_minutes": patient.seizureDurationGte5mVal || null,
          "episode_frequency": {
            "type": patient.seizureEpisodeCount,
            "total_count": patient.seizureEpisodeCountVal || 1,
            "interictal_state": patient.seizureInterictalState
          },
          "motor_manifestation_semiognosis": patient.seizureMotorPattern,
          "associated_physical_signs": {
            "lateral_tongue_biting": patient.seizure_lateral_tongue_bite || false,
            "sustained_eye_deviation": patient.seizure_eye_deviation || false,
            "urinary_or_fecal_incontinence": patient.seizure_incontinence || false,
            "cyanosis_or_ictal_apnea": patient.seizure_cyanosis_apnea || false,
            "marked_pallor_and_cold_sweating": patient.seizure_marked_pallor_sweat || false,
            "trauma_or_fall_injury": patient.seizure_fall_injury || false
          },
          "post_event_recovery": {
            "recovery_time_and_mental_state": patient.seizureRecoveryDuration,
            "physical_symptoms": patient.seizurePostEventSymptoms,
            "todd_paresis": {
              "present": patient.seizureHasToddParesis === 'yes',
              "side": patient.seizureToddSide || 'none'
            }
          },
          "clinical_differentiation_scores": {
            "sheldon_score": sheldon.score,
            "sheldon_interpretation": sheldon.interpretation,
            "hyperventilation_suspected": hvs.isSuspected
          }
        },
        "precipitants_and_seizure_history": {
          "past_seizure_syncope_history": patient.seizurePriorHistory,
          "antiseizure_medication_compliance": patient.seizureMedCompliance,
          "emergency_risk_factors": {
            "known_cardiac_disease": patient.seizure_rf_known_cardiac_disease || false,
            "family_premature_sudden_death": patient.seizure_rf_family_sudden_death || false,
            "pregnancy_or_postpartum_6w": patient.seizure_rf_pregnancy_postpartum || false,
            "diabetic_hypoglycemia_suspected": patient.seizure_rf_diabetic_hypo || false,
            "alcohol_withdrawal_1_to_3d": patient.seizure_rf_alcohol_withdrawal || false,
            "cns_infection_fever_meningismus": patient.seizure_rf_fever_meningismus || false,
            "recent_head_trauma": patient.seizure_rf_recent_head_trauma || false,
            "acute_emotional_panic_trigger": patient.seizure_rf_emotional_panic_trigger || false,
            "substance_or_toxin_overdose": patient.seizure_rf_substance_toxin || false,
            "substance_details": patient.seizureSubstanceDetails || ""
          }
        },
        "pertinent_positives": positives,
        "pertinent_negatives": negatives,
        "other_symptoms_free_text": patient.otherSymptomsFree || "",
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

      document.getElementById('rapidTextView').value = patient.custom_rapid_note || defaultRapid;
      document.getElementById('narrativeTextView').value = patient.custom_narrative_note || defaultNarrative;
      document.getElementById('jsonViewer').textContent = JSON.stringify(jsonPayload, null, 2);
    }

    

registerCcModule({
  id: 'seizure',
  recordCc: 'seizure',
  titleTh: 'ชัก / เกร็งกระตุก',
  titleEn: 'Seizure / Convulsion',
  sectionDomId: 'seizureQuestionnaireSection',
  doctorCcBadgeHtml: "<i data-lucide=\"zap\" class=\"w-3 h-3 mr-1\"></i> CC: ชัก / เกร็งกระตุก (Seizure / TLOC)",
  formHtml: "        <div id=\"seizureQuestionnaireSection\" class=\"hidden space-y-6\">\n\n          <!-- PEDIATRIC AGE (< 6 YEARS) GUIDANCE BANNER -->\n          <div id=\"seizurePediatricAgeBanner\" class=\"p-4 bg-amber-50 border-l-4 border-amber-500 rounded-2xl flex items-start space-x-3\">\n            <i data-lucide=\"alert-triangle\" class=\"w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0\"></i>\n            <div class=\"text-xs text-amber-900 leading-relaxed\">\n              <strong class=\"font-bold\">ข้อความแจ้งเตือนจุดคัดกรอง:</strong> ในกรณีผู้ป่วยเป็นเด็กอายุ &lt; 6 ปี ที่มีอาการชักหรือชักเกร็งจากไข้สูง กรุณาเลือกอาการสำคัญใช้ <strong>&lt;ชักเกร็งในเด็กอายุ &lt; 6 ปี&gt;</strong> แทน เพื่อการประเมินภาวะชักในเด็กอย่างถูกต้อง หรือแจ้งพยาบาลคัดกรองทันที\n            </div>\n          </div>\n\n          <!-- CARD 1: ข้อมูลเหตุการณ์ เวลา ความถี่ และท่าทางก่อนเกิดเหตุ (Timing & Preceding Activity) -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"clock\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-800\"><span id=\"seizureSectionNumber1\">1</span>. ข้อมูลเหตุการณ์ เวลา ความถี่ และท่าทางก่อนเกิดเหตุ</h2>\n                <p class=\"text-xs text-slate-500\">ระบุระยะเวลา ท่าทางขณะเกิดเหตุ และประเมินความเสี่ยงภาวะชักต่อเนื่อง</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4\">\n              <!-- 1.1 ระยะเวลาตั้งแต่เริ่มมีอาการจนถึงปัจจุบัน -->\n              <div>\n                <label class=\"block text-xs font-bold text-slate-700 mb-1.5\">ระยะเวลาตั้งแต่เริ่มเกิดเหตุการณ์จนถึงปัจจุบัน: <span class=\"text-rose-500\">*</span></label>\n                <div class=\"flex items-center space-x-2 max-w-xs\">\n                  <input type=\"number\" id=\"seizureDurationVal\" min=\"0\" placeholder=\"เช่น 30\" \n                    class=\"w-24 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-center font-bold\">\n                  <select id=\"seizureDurationUnit\" class=\"bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white flex-1\">\n                    <option value=\"minutes\">นาที</option>\n                    <option value=\"hours\" selected>ชั่วโมง</option>\n                    <option value=\"days\">วัน</option>\n                    <option value=\"weeks\">สัปดาห์</option>\n                    <option value=\"months\">เดือน</option>\n                    <option value=\"years\">ปี</option>\n                  </select>\n                </div>\n              </div>\n\n              <!-- 1.2 ผู้ให้ข้อมูลประวัติเหตุการณ์ -->\n              <div>\n                <label class=\"block text-xs font-bold text-slate-700 mb-1.5\">ผู้ให้ข้อมูลประวัติเหตุการณ์: <span class=\"text-rose-500\">*</span></label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs\">\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizureReporter\" value=\"patient_self\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ผู้ป่วยเล่าเอง</span>\n                      <span class=\"text-[11px] text-slate-500\">ผู้ป่วยรู้สึกตัวดีและเป็นผู้ให้ข้อมูลเอง</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizureReporter\" value=\"witness_relative\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ญาติ / ผู้เห็นเหตุการณ์</span>\n                      <span class=\"text-[11px] text-slate-500\">ญาติหรือผู้เห็นเหตุการณ์ในขณะหมดสติ/ชักเป็นผู้เล่า</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizureReporter\" value=\"both_patient_witness\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ร่วมกันให้ข้อมูล</span>\n                      <span class=\"text-[11px] text-slate-500\">ทั้งผู้ป่วยและผู้เห็นเหตุการณ์ร่วมกันให้ข้อมูล</span>\n                    </div>\n                  </label>\n                </div>\n              </div>\n\n              <!-- 1.3 ท่าทางหรือกิจกรรมก่อนเกิดอาการทันที -->\n              <div>\n                <label class=\"block text-xs font-bold text-slate-700 mb-1.5\">ท่าทางหรือกิจกรรมที่กำลังทำก่อนเกิดอาการทันที: <span class=\"text-rose-500\">*</span></label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs\">\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizurePrecedingPosture\" value=\"prolonged_standing\" onchange=\"handleSeizurePrecedingPostureChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ยืนนาน หรืออยู่ในที่ร้อนอบอ้าว</span>\n                      <span class=\"text-[11px] text-slate-500\">ยืนอยู่เป็นเวลานาน หรืออยู่ในที่แออัด/อากาศร้อน</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizurePrecedingPosture\" value=\"sudden_standing\" onchange=\"handleSeizurePrecedingPostureChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ลุกขึ้นยืนเร็วๆ</span>\n                      <span class=\"text-[11px] text-slate-500\">เพิ่งเปลี่ยนท่า ลุกขึ้นยืนเร็วๆ จากท่านั่งหรือท่านอน</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizurePrecedingPosture\" value=\"during_exertion\" onchange=\"handleSeizurePrecedingPostureChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ขณะออกแรง หรือออกกำลังกาย</span>\n                      <span class=\"text-[11px] text-slate-500\">เกิดขึ้นขณะกำลังออกแรง ทำงานหนัก หรือเล่นกีฬา</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizurePrecedingPosture\" value=\"standing_or_walking_normal\" onchange=\"handleSeizurePrecedingPostureChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ขณะยืนหรือเดินธรรมดา ไม่ได้ออกแรงทำอะไร</span>\n                      <span class=\"text-[11px] text-slate-500\">เกิดขึ้นขณะยืนอยู่เฉยๆ หรือเดินปกติ ไม่ได้ออกแรงหนัก</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizurePrecedingPosture\" value=\"supine_or_resting\" onchange=\"handleSeizurePrecedingPostureChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ขณะนอนหงาย หรือนั่งพักผ่อนเฉยๆ</span>\n                      <span class=\"text-[11px] text-slate-500\">เกิดขึ้นขณะนอนหงาย หรือนั่งพักผ่อนอยู่สบายๆ</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizurePrecedingPosture\" value=\"micturition_defecation\" onchange=\"handleSeizurePrecedingPostureChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ขณะหรือหลังปัสสาวะ / ถ่ายอุจจาระ / ไอแรงๆ</span>\n                      <span class=\"text-[11px] text-slate-500\">เกิดขึ้นขณะหรือทันทีหลังเบ่งปัสสาวะ ถ่าย หรือไอหนัก</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizurePrecedingPosture\" value=\"sleep\" onchange=\"handleSeizurePrecedingPostureChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ขณะหลับ</span>\n                      <span class=\"text-[11px] text-slate-500\">เกิดขึ้นขณะกำลังนอนหลับ หรือพบอาการขณะตื่นนอน</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizurePrecedingPosture\" value=\"other\" onchange=\"handleSeizurePrecedingPostureChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">อื่นๆ</span>\n                      <span class=\"text-[11px] text-slate-500\">ท่าทางหรือกิจกรรมอื่นๆ (ระบุด้านล่าง)</span>\n                    </div>\n                  </label>\n                </div>\n                <div id=\"seizurePrecedingPostureOtherWrap\" class=\"hidden mt-2.5\">\n                  <input type=\"text\" id=\"seizurePrecedingPostureOtherText\" placeholder=\"ระบุท่าทางหรือกิจกรรมที่กำลังทำก่อนเกิดอาการ...\" \n                    class=\"w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white\">\n                </div>\n              </div>\n\n              <!-- 1.4 ระยะเวลาที่หมดสติหรือไม่รู้ตัว -->\n              <div>\n                <label class=\"block text-xs font-bold text-slate-700 mb-1.5\">ระยะเวลาที่หมดสติหรือไม่รู้ตัวในแต่ละรอบ: <span class=\"text-rose-500\">*</span></label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs\">\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizureLossOfConsciousDuration\" value=\"brief_seconds\" onchange=\"handleSeizureLossOfConsciousDurationChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">สั้นมากเพียงไม่กี่วินาที (&lt; 30–60 วินาที)</span>\n                      <span class=\"text-[11px] text-slate-500\">สั้นมากเพียงไม่กี่วินาที (ประมาณ 10–30 วินาที) แล้วเริ่มรู้สึกตัว</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizureLossOfConsciousDuration\" value=\"typical_seizure_minutes\" onchange=\"handleSeizureLossOfConsciousDurationChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">นานประมาณ 1–3 นาที</span>\n                      <span class=\"text-[11px] text-slate-500\">หมดสติหรือชักนาน 1–3 นาที แล้วหยุด</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizureLossOfConsciousDuration\" value=\"prolonged_gte_5m\" onchange=\"handleSeizureLossOfConsciousDurationChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">นานตั้งแต่ 5 นาทีขึ้นไป</span>\n                      <span class=\"text-[11px] text-slate-500\">หมดสติหรือชักนานตั้งแต่ 5 นาทีขึ้นไป (ระบุประมาณเวลา)</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizureLossOfConsciousDuration\" value=\"continuous_unstopped\" onchange=\"handleSeizureLossOfConsciousDurationChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ชักต่อเนื่องไม่หยุด</span>\n                      <span class=\"text-[11px] text-slate-500\">มีอาการชักต่อเนื่องไม่หยุดตลอดเวลาจนถึงปัจจุบัน</span>\n                    </div>\n                  </label>\n                </div>\n                <!-- กิ่งย่อยระบุประมาณเวลาเมื่อชักนานตั้งแต่ 5 นาทีขึ้นไป -->\n                <div id=\"seizureDurationGte5mWrap\" class=\"hidden mt-3 ml-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs\">\n                  <span class=\"font-semibold text-slate-800 block\">ระบุประมาณเวลาที่เป็น / หมดสติ:</span>\n                  <div class=\"flex items-center space-x-2 max-w-xs\">\n                    <input type=\"number\" id=\"seizureDurationGte5mVal\" min=\"5\" max=\"720\" placeholder=\"เช่น 10, 15, 30\" \n                      class=\"w-28 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 text-center font-bold focus:outline-none focus:ring-2 focus:ring-medical-500\">\n                    <span class=\"text-slate-600 font-medium\">นาที</span>\n                  </div>\n                </div>\n              </div>\n\n              <!-- 1.5 จำนวนครั้งที่มีอาการในวันนี้ (รอบ 24 ชั่วโมง) -->\n              <div>\n                <label class=\"block text-xs font-bold text-slate-700 mb-1.5\">จำนวนครั้งที่มีอาการในวันนี้ (รอบ 24 ชั่วโมง): <span class=\"text-rose-500\">*</span></label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs\">\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizureEpisodeCount\" value=\"single\" onchange=\"handleSeizureEpisodeCountChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">เกิดขึ้นเพียงครั้งเดียว</span>\n                      <span class=\"text-[11px] text-slate-500\">มีอาการชักหรือหมดสติเพียง 1 ครั้งในรอบวันนี้</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizureEpisodeCount\" value=\"multiple_cluster\" onchange=\"handleSeizureEpisodeCountChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">เกิดซ้ำตั้งแต่ 2 ครั้งขึ้นไป</span>\n                      <span class=\"text-[11px] text-slate-500\">มีอาการชักหรือหมดสติซ้ำตั้งแต่ 2 รอบขึ้นไป</span>\n                    </div>\n                  </label>\n                </div>\n\n                <!-- กิ่งย่อย 1: ระบุจำนวนครั้งที่ชัก -->\n                <div id=\"seizureEpisodeCountWrap\" class=\"hidden mt-3 ml-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs\">\n                  <span class=\"font-semibold text-slate-800 block\">ระบุจำนวนครั้งที่มีอาการในวันนี้:</span>\n                  <div class=\"flex items-center space-x-2 max-w-xs\">\n                    <input type=\"number\" id=\"seizureEpisodeCountVal\" min=\"2\" max=\"50\" placeholder=\"เช่น 2 หรือ 3\" \n                      class=\"w-24 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 text-center font-bold focus:outline-none focus:ring-2 focus:ring-medical-500\">\n                    <span class=\"text-slate-600 font-medium\">ครั้ง</span>\n                  </div>\n                </div>\n\n                <!-- กิ่งย่อย 2: สภาพความรู้สึกตัวระหว่างรอบการชัก -->\n                <div id=\"seizureInterictalWrap\" class=\"hidden mt-3 ml-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs\">\n                  <span class=\"font-semibold text-slate-800 block\">สภาพความรู้สึกตัวระหว่างรอบที่เกิดเหตุ:</span>\n                  <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                    <label class=\"selectable-card p-2.5 bg-white rounded-xl flex items-start cursor-pointer\">\n                      <input type=\"radio\" name=\"seizureInterictalState\" value=\"full_recovery\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                      <div class=\"ml-2\">\n                        <span class=\"font-semibold text-slate-800 block\">ฟื้นคืนสติตามปกติ</span>\n                        <span class=\"text-[11px] text-slate-500\">ระหว่างรอบฟื้นคืนสติ พูดคุยรู้เรื่องดี</span>\n                      </div>\n                    </label>\n                    <label class=\"selectable-card p-2.5 bg-white rounded-xl flex items-start cursor-pointer\">\n                      <input type=\"radio\" name=\"seizureInterictalState\" value=\"unconscious_or_drowsy\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                      <div class=\"ml-2\">\n                        <span class=\"font-semibold text-slate-800 block\">ไม่ฟื้นสติ หรือซึมตลอดเวลา</span>\n                        <span class=\"text-[11px] text-slate-500\">ระหว่างรอบไม่ฟื้นสติ ซึมตลอด หรือชักซ้ำทันที</span>\n                      </div>\n                    </label>\n                  </div>\n                </div>\n              </div>\n\n            </div>\n          </div>\n\n\n          <!-- CARD 2: อาการเตือนนำก่อนหมดสติ (Prodrome & Aura) -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"bell\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-800\"><span id=\"seizureSectionNumber2\">2</span>. อาการเตือนนำก่อนหมดสติหรือเกร็งกระตุก</h2>\n                <p class=\"text-xs text-slate-500\">ประเมินอาการเตือนล่วงหน้าเพื่อแยกภาวะเป็นลม หายใจหอบเร็ว หรือโรคลมชัก</p>\n              </div>\n            </div>\n\n            <div>\n              <label class=\"block text-xs font-bold text-slate-700 mb-1.5\">อาการเตือนที่รู้สึกได้ก่อนที่จะหมดสติหรือมีอาการเกร็งกระตุก: (เลือกได้หลายข้อ)</label>\n              <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs\">\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" name=\"seizureWarningProdrome\" value=\"none_sudden\" onchange=\"handleSeizureWarningChange(this)\" class=\"mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block\">ไม่มีอาการเตือน ล้มลงทันที</span>\n                    <span class=\"text-[11px] text-slate-500\">ไม่มีอาการเตือนใดๆ ล้มลงหรือหมดสติทันทีทันใด</span>\n                  </div>\n                </label>\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" name=\"seizureWarningProdrome\" value=\"lightheaded_tunnel_vision\" onchange=\"handleSeizureWarningChange(this)\" class=\"mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block\">หน้ามืด วิงเวียน ตาพร่ามัวภาพมืดลง หูอื้อ</span>\n                    <span class=\"text-[11px] text-slate-500\">รู้สึกหน้ามืด วิงเวียน ตาพร่ามัวเห็นภาพมืดลงเป็นอุโมงค์ หรือมีเสียงหูอื้อ</span>\n                  </div>\n                </label>\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" name=\"seizureWarningProdrome\" value=\"cold_sweat_pallor_nausea\" onchange=\"handleSeizureWarningChange(this)\" class=\"mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block\">เหงื่อแตกตัวเย็น หน้าซีด คลื่นไส้ ใจหวิว</span>\n                    <span class=\"text-[11px] text-slate-500\">มีเหงื่อแตกตัวเย็นท่วมตัว หน้าซีด คลื่นไส้ ใจหวิวพะอืดพะอม</span>\n                  </div>\n                </label>\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" name=\"seizureWarningProdrome\" value=\"sudden_palpitation\" onchange=\"handleSeizureWarningChange(this)\" class=\"mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block\">ใจสั่นรัว หรือหัวใจเต้นสะดุดกะทันหันก่อนวูบ</span>\n                    <span class=\"text-[11px] text-slate-500\">รู้สึกใจสั่นรัว หัวใจเต้นสะดุด หรือเต้นเร็วผิดปกติอย่างกะทันหันก่อนวูบ</span>\n                  </div>\n                </label>\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" name=\"seizureWarningProdrome\" value=\"hyperventilation_tingling\" onchange=\"handleSeizureWarningChange(this)\" class=\"mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block\">หายใจหอบเร็วลึก แน่นหน้าอก ชารอบปากหรือนิ้วมือ</span>\n                    <span class=\"text-[11px] text-slate-500\">มีอาการหายใจหอบเร็ว ลึก แน่นหน้าอก ชารอบปาก หรือชาตามปลายนิ้วมือ</span>\n                  </div>\n                </label>\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" name=\"seizureWarningProdrome\" value=\"epigastric_rising\" onchange=\"handleSeizureWarningChange(this)\" class=\"mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block\">รู้สึกแน่นหรือโหวงในช่องท้องลอยขึ้นมาที่คอ</span>\n                    <span class=\"text-[11px] text-slate-500\">รู้สึกแปลกๆ จุกแน่นหรือโหวงในช่องท้องลอยตีขึ้นมาที่คอ</span>\n                  </div>\n                </label>\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" name=\"seizureWarningProdrome\" value=\"olfactory_gustatory\" onchange=\"handleSeizureWarningChange(this)\" class=\"mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block\">ได้กลิ่นแปลกประหลาด หรือกลิ่นเหม็นไหม้</span>\n                    <span class=\"text-[11px] text-slate-500\">ได้กลิ่นแปลกประหลาด กลิ่นเหม็นไหม้ หรือรสชาติแปลกในปาก</span>\n                  </div>\n                </label>\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" name=\"seizureWarningProdrome\" value=\"visual_dejavu\" onchange=\"handleSeizureWarningChange(this)\" class=\"mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block\">แสงวูบวาบ ภาพหลอน หรือรู้สึกคุ้นเคยประหลาด</span>\n                    <span class=\"text-[11px] text-slate-500\">มองเห็นแสงวูบวาบ ภาพหลอน หรือมีความรู้สึกคุ้นเคยประหลาด (Déjà vu)</span>\n                  </div>\n                </label>\n              </div>\n            </div>\n          </div>\n\n\n          <!-- CARD 3: ลักษณะการเกร็ง กระตุก หรืออาการขณะหมดสติ (Motor Semiognosis & Associated Signs) -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"activity\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-800\"><span id=\"seizureSectionNumber3\">3</span>. ลักษณะการเกร็ง กระตุก หรืออาการขณะหมดสติ</h2>\n                <p class=\"text-xs text-slate-500\">ลักษณะการเคลื่อนไหวของร่างกาย อาการกัดลิ้น และภาวะขาดออกซิเจน</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4\">\n              <!-- 3.1 ลักษณะการเคลื่อนไหวของร่างกาย -->\n              <div>\n                <label class=\"block text-xs font-bold text-slate-700 mb-1.5\">ลักษณะการเคลื่อนไหวของร่างกาย หรือการเกร็งขณะหมดสติ: <span class=\"text-rose-500\">*</span></label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs\">\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizureMotorPattern\" value=\"generalized_tonic_clonic\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">เกร็งกระตุกทั้งตัว ต่อเนื่องเป็นหลักนาที หรือหลายนาที</span>\n                      <span class=\"text-[11px] text-slate-500\">ตัวแข็งเกร็งแล้วกระตุกรุนแรงเป็นจังหวะพร้อมกันทั้งตัว ต่อเนื่องเป็นหลักนาที หรือหลายนาที</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizureMotorPattern\" value=\"focal_motor\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">เกร็งหรือกระตุกเฉพาะส่วน</span>\n                      <span class=\"text-[11px] text-slate-500\">กระตุกหรือเกร็งเฉพาะส่วน (เช่น แขนข้างเดียว ขาข้างเดียว หรือมุมปากข้างเดียว)</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizureMotorPattern\" value=\"brief_myoclonic_syncope\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ตัวอ่อนล้มลง แต่มีกระตุกสั้นๆ ไม่กี่ครั้ง (สั้นๆ 5–15 วินาที)</span>\n                      <span class=\"text-[11px] text-slate-500\">ตัวอ่อนล้มลง แต่มีอาการกระตุกเบาๆ สั้นๆ เพียงไม่กี่ครั้ง (สั้นๆ 5–15 วินาที)</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizureMotorPattern\" value=\"carpopedal_spasm\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">มือจีบเกร็ง ปลายนิ้วมืองุ้มเข้าหากัน หรือเกร็งปลายเท้า</span>\n                      <span class=\"text-[11px] text-slate-500\">มือจีบเกร็ง ปลายนิ้วมืองุ้มเข้าหากันทั้งสองข้าง หรือเกร็งปลายเท้างุ้ม</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizureMotorPattern\" value=\"atonic_limp\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ตัวอ่อนปวกเปียกล้มพับลงกับพื้นทันที</span>\n                      <span class=\"text-[11px] text-slate-500\">ตัวอ่อนปวกเปียกล้มพับลงกับพื้นทันที โดยไม่มีการเกร็งกระตุก</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizureMotorPattern\" value=\"absence_automatism\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">เหม่อลอย นิ่งค้าง เคี้ยวปาก หรือขยำมือ</span>\n                      <span class=\"text-[11px] text-slate-500\">นิ่งค้าง เหม่อลอย เรียกไม่ตอบ มีการเคี้ยวปาก ขยำมือ หรือกระพริบตาถี่ๆ</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizureMotorPattern\" value=\"thrashing_closed_eyes\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ดิ้นสะบัดไปมา ส่ายศีรษะ ลำตัวแอ่น</span>\n                      <span class=\"text-[11px] text-slate-500\">ดิ้นสะบัดไปมา ส่ายศีรษะไปมา ลำตัวแอ่น</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizureMotorPattern\" value=\"unknown_or_unobserved\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ไม่ทราบแน่ชัด หรือไม่ได้สังเกต</span>\n                      <span class=\"text-[11px] text-slate-500\">ไม่มีผู้เห็นเหตุการณ์ หรือไม่ได้สังเกตลักษณะการเคลื่อนไหว</span>\n                    </div>\n                  </label>\n                </div>\n              </div>\n\n              <!-- 3.2 อาการร่วมขณะเกิดเหตุ (Checkbox) -->\n              <div>\n                <label class=\"block text-xs font-bold text-slate-700 mb-1.5\">อาการร่วมขณะเกิดเหตุ (เลือกได้หลายข้อ):</label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"seizure_lateral_tongue_bite\" class=\"mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2.5 text-slate-700 font-medium leading-relaxed\">กัดลิ้นบริเวณด้านข้างของลิ้นจนมีแผลหรือมีเลือดออกในปาก</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"seizure_eye_deviation\" class=\"mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2.5 text-slate-700 font-medium leading-relaxed\">ตาค้าง หรือตาเหลือกขึ้นบน / เหลอกเบนไปข้างใดข้างหนึ่ง</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"seizure_incontinence\" class=\"mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2.5 text-slate-700 font-medium leading-relaxed\">ปัสสาวะราด หรืออุจจาระราดขณะหมดสติ</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"seizure_cyanosis_apnea\" class=\"mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2.5 text-slate-700 font-medium leading-relaxed\">ริมฝีปากเขียวคล้ำ ตัวเขียว หรือหยุดหายใจชั่วขณะ</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"seizure_marked_pallor_sweat\" class=\"mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2.5 text-slate-700 font-medium leading-relaxed\">ใบหน้าซีดเผือด ตัวเย็น และมีเหงื่อออกเปียกชุ่ม</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"seizure_fall_injury\" class=\"mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2.5 text-slate-700 font-medium leading-relaxed\">ร่างกายหรือศีรษะกระแทกพื้น มีบาดแผลฟกช้ำหรือเลือดออกจากแรงกระแทก</span>\n                  </label>\n                </div>\n              </div>\n\n            </div>\n          </div>\n\n\n          <!-- CARD 4: สภาพหลังฟื้นคืนสติและการฟื้นตัว (Recovery Duration & Post-ictal Phase) -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"refresh-cw\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-800\"><span id=\"seizureSectionNumber4\">4</span>. สภาพหลังฟื้นคืนสติและการฟื้นตัว</h2>\n                <p class=\"text-xs text-slate-500\">ประเมินระยะเวลาการฟื้นสติ อาการปวดกล้ามเนื้อ และอาการอ่อนแรงครึ่งซีก</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4\">\n              <!-- 4.1 การฟื้นคืนสติ -->\n              <div>\n                <label class=\"block text-xs font-bold text-slate-700 mb-1.5\">การฟื้นคืนสติและสภาพความรู้สึกตัวหลังเกิดเหตุ: <span class=\"text-rose-500\">*</span></label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs\">\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizureRecoveryDuration\" value=\"rapid_under_2m_alert\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ฟื้นตัวเร็วมาก (&lt; 1–2 นาที)</span>\n                      <span class=\"text-[11px] text-slate-500\">ฟื้นคืนสติและคุยรู้เรื่องเป็นปกติอย่างรวดเร็ว (ภายใน 1–2 นาที) ไม่งง ไม่ง่วง</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizureRecoveryDuration\" value=\"confusion_drowsy_gt_5m\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">สับสน มึนงง นานเกิน 5–15 นาที</span>\n                      <span class=\"text-[11px] text-slate-500\">สับสน มึนงง จำเหตุการณ์ไม่ได้ นานเกิน 5–15 นาที หรือหลับลึก ปลุกตื่นยาก</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizureRecoveryDuration\" value=\"tearful_emotional_tachypnea\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">รู้เรื่องดีแต่ยังเหนื่อยหอบ ร้องไห้</span>\n                      <span class=\"text-[11px] text-slate-500\">รู้สึกตัวดีแต่ยังเหนื่อยหอบ มือชา ร้องไห้ หรือมีความเครียดตกใจ</span>\n                    </div>\n                  </label>\n                </div>\n              </div>\n\n              <!-- 4.2 อาการทางกายหลังเริ่มรู้สึกตัว -->\n              <div>\n                <label class=\"block text-xs font-bold text-slate-700 mb-1.5\">อาการทางกายหลังจากที่เริ่มรู้สึกตัวดีแล้ว: <span class=\"text-rose-500\">*</span></label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs\">\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizurePostEventSymptoms\" value=\"headache_severe_myalgia\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ปวดศีรษะรุนแรง หรือปวดระบมกล้ามเนื้อทั่วตัว</span>\n                      <span class=\"text-[11px] text-slate-500\">มีอาการปวดศีรษะตุบๆ รุนแรง หรือปวดเมื่อยระบมกล้ามเนื้อทั่วร่างกาย</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizurePostEventSymptoms\" value=\"mild_fatigue_no_myalgia\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">เพลียเล็กน้อย ไม่มีปวดกล้ามเนื้อ</span>\n                      <span class=\"text-[11px] text-slate-500\">รู้สึกอ่อนเพลียเล็กน้อย แต่ไม่มีอาการปวดศีรษะหรือปวดเมื่อยกล้ามเนื้อ</span>\n                    </div>\n                  </label>\n                </div>\n              </div>\n\n              <!-- 4.3 แขนหรือขาอ่อนแรงหลังเกิดเหตุ (Todd's Paresis) -->\n              <div>\n                <label class=\"block text-xs font-bold text-slate-700 mb-1.5\">มีอาการแขนหรือขาอ่อนแรงหลังเกิดเหตุหรือไม่: <span class=\"text-rose-500\">*</span></label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs\">\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizureHasToddParesis\" value=\"no\" onchange=\"handleSeizureToddParesisChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ไม่มีอาการอ่อนแรง</span>\n                      <span class=\"text-[11px] text-slate-500\">แขนและขาทั้งสองข้างขยับได้เท่ากันตามปกติ</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizureHasToddParesis\" value=\"yes\" onchange=\"handleSeizureToddParesisChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">มีอาการแขนหรือขาอ่อนแรง หรือมุมปากตก</span>\n                      <span class=\"text-[11px] text-slate-500\">มีอาการแขนหรือขาอ่อนแรง หรือมุมปากตกข้างใดข้างหนึ่งหลังเกิดเหตุ</span>\n                    </div>\n                  </label>\n                </div>\n\n                <!-- กิ่งย่อย: ข้างที่มีอาการอ่อนแรง -->\n                <div id=\"seizureToddSideWrap\" class=\"hidden mt-3 ml-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs\">\n                  <span class=\"font-semibold text-slate-800 block\">ข้างที่มีอาการอ่อนแรงหลังหยุดชัก:</span>\n                  <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs\">\n                    <label class=\"selectable-card p-2.5 bg-white rounded-xl flex items-center cursor-pointer\">\n                      <input type=\"radio\" name=\"seizureToddSide\" value=\"left\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                      <span class=\"ml-2 font-medium text-slate-800\">ซีกซ้าย (Left side)</span>\n                    </label>\n                    <label class=\"selectable-card p-2.5 bg-white rounded-xl flex items-center cursor-pointer\">\n                      <input type=\"radio\" name=\"seizureToddSide\" value=\"right\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                      <span class=\"ml-2 font-medium text-slate-800\">ซีกขวา (Right side)</span>\n                    </label>\n                    <label class=\"selectable-card p-2.5 bg-white rounded-xl flex items-center cursor-pointer\">\n                      <input type=\"radio\" name=\"seizureToddSide\" value=\"both\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                      <span class=\"ml-2 font-medium text-slate-800\">ทั้งสองข้าง (Bilateral)</span>\n                    </label>\n                  </div>\n                </div>\n              </div>\n\n            </div>\n          </div>\n\n\n          <!-- CARD 5: ปัจจัยกระตุ้น ประวัติโรคประจำตัว และสัญญาณเตือนวิกฤต (Precipitants & Red Flags) -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"shield-alert\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-800\"><span id=\"seizureSectionNumber5\">5</span>. ปัจจัยกระตุ้น ประวัติโรคประจำตัว และอาการร่วมสำคัญ</h2>\n                <p class=\"text-xs text-slate-500\">ประวัติโรคลมชัก การรับประทานยา โรคหัวใจ การตั้งครรภ์ และปัจจัยเสี่ยงเฉียบพลัน</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4\">\n              <!-- 5.1 ประวัติการชักหรือหมดสติในอดีต -->\n              <div>\n                <label class=\"block text-xs font-bold text-slate-700 mb-1.5\">ประวัติการเคยมีอาการชักหรือหมดสติในอดีต: <span class=\"text-rose-500\">*</span></label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs\">\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizurePriorHistory\" value=\"known_epilepsy\" onchange=\"handleSeizurePriorHistoryChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">เป็นโรคลมชักเดิมอยู่แล้ว</span>\n                      <span class=\"text-[11px] text-slate-500\">เป็นโรคลมชักเดิมอยู่แล้ว และเคยรับประทานยากันชัก</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizurePriorHistory\" value=\"recurrent_vasovagal\" onchange=\"handleSeizurePriorHistoryChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">เคยเป็นลมหน้ามืดบ่อยๆ</span>\n                      <span class=\"text-[11px] text-slate-500\">เคยมีอาการเป็นลมหน้ามืดบ่อยๆ เวลาตกใจ กลัวเลือด หรือยืนนาน</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"seizurePriorHistory\" value=\"first_time_tloc\" onchange=\"handleSeizurePriorHistoryChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">เพิ่งเคยเป็นครั้งแรกในชีวิต</span>\n                      <span class=\"text-[11px] text-slate-500\">เพิ่งเคยมีอาการหมดสติหรือชักครั้งนี้เป็นครั้งแรกในชีวิต</span>\n                    </div>\n                  </label>\n                </div>\n\n                <!-- กิ่งย่อย: การรับประทานยากันชัก -->\n                <div id=\"seizureMedComplianceWrap\" class=\"hidden mt-3 ml-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs\">\n                  <span class=\"font-semibold text-slate-800 block\">การรับประทานยากันชักในช่วงสัปดาห์ที่ผ่านมา:</span>\n                  <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs\">\n                    <label class=\"selectable-card p-2.5 bg-white rounded-xl flex items-start cursor-pointer\">\n                      <input type=\"radio\" name=\"seizureMedCompliance\" value=\"compliant\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                      <div class=\"ml-2\">\n                        <span class=\"font-semibold text-slate-800 block\">รับประทานยาสม่ำเสมอ</span>\n                        <span class=\"text-[11px] text-slate-500\">กินยาครบตรงเวลาตามแพทย์สั่ง</span>\n                      </div>\n                    </label>\n                    <label class=\"selectable-card p-2.5 bg-white rounded-xl flex items-start cursor-pointer\">\n                      <input type=\"radio\" name=\"seizureMedCompliance\" value=\"missed_or_stopped\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                      <div class=\"ml-2\">\n                        <span class=\"font-semibold text-slate-800 block\">ขาดยา หรือลืมกินยา</span>\n                        <span class=\"text-[11px] text-slate-500\">ขาดยา ลืมกินยา หรือหยุดยาเองในช่วง 1–7 วันนี้</span>\n                      </div>\n                    </label>\n                    <label class=\"selectable-card p-2.5 bg-white rounded-xl flex items-start cursor-pointer\">\n                      <input type=\"radio\" name=\"seizureMedCompliance\" value=\"dose_changed\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                      <div class=\"ml-2\">\n                        <span class=\"font-semibold text-slate-800 block\">เพิ่งปรับเปลี่ยนยา</span>\n                        <span class=\"text-[11px] text-slate-500\">เพิ่งมีการปรับเปลี่ยนขนาดยาหรือชนิดยาเมื่อเร็วๆ นี้</span>\n                      </div>\n                    </label>\n                  </div>\n                </div>\n              </div>\n\n              <!-- 5.2 ปัจจัยเสี่ยงและสัญญาณเตือนวิกฤต (Checkbox) -->\n              <div>\n                <label class=\"block text-xs font-bold text-slate-700 mb-1.5\">ประวัติสุขภาพ ปัจจัยเสี่ยง และอาการร่วมสำคัญ (เลือกได้หลายข้อ):</label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"seizure_rf_known_cardiac_disease\" class=\"mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2.5 text-slate-700 font-medium leading-relaxed\">มีโรคประจำตัวทางหัวใจ (หลอดเลือดหัวใจตีบ ลิ้นหัวใจ หัวใจโต หรือหัวใจเต้นผิดจังหวะ)</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"seizure_rf_family_sudden_death\" class=\"mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2.5 text-slate-700 font-medium leading-relaxed\">มีคนในครอบครัวสายตรงเสียชีวิตกะทันหันจากโรคหัวใจตั้งแต่อายุน้อย (&lt; 50 ปี)</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"seizure_rf_pregnancy_postpartum\" class=\"mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2.5 text-slate-700 font-medium leading-relaxed\">สตรีมีครรภ์ หรือเพิ่งคลอดบุตร/แท้งบุตรภายในช่วง 6 สัปดาห์นี้</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"seizure_rf_diabetic_hypo\" class=\"mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2.5 text-slate-700 font-medium leading-relaxed\">ผู้ป่วยเบาหวาน มีอาการใจสั่น เหงื่อออก ตัวเย็น มือสั่น หรืออดอาหารก่อนหมดสติ</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"seizure_rf_alcohol_withdrawal\" class=\"mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2.5 text-slate-700 font-medium leading-relaxed\">ดื่มสุราเป็นประจำ แล้วเพิ่งหยุดดื่มหรือลดปริมาณสุราลงในช่วง 1–3 วันนี้</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"seizure_rf_fever_meningismus\" class=\"mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2.5 text-slate-700 font-medium leading-relaxed\">มีไข้สูง หนาวสั่น คอแข็ง หรือปวดศีรษะรุนแรงนำมาก่อนเกิดเหตุ</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"seizure_rf_recent_head_trauma\" class=\"mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2.5 text-slate-700 font-medium leading-relaxed\">เพิ่งได้รับอุบัติเหตุกระแทกศีรษะอย่างรุนแรงก่อนหน้าที่จะมีอาการ</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"seizure_rf_emotional_panic_trigger\" class=\"mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2.5 text-slate-700 font-medium leading-relaxed\">มีความเครียดทางอารมณ์อย่างรุนแรง ตื่นตระหนก ทะเลาะวิวาท หรือเสียใจกะทันหัน</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-start cursor-pointer sm:col-span-2\">\n                    <input type=\"checkbox\" id=\"seizure_rf_substance_toxin\" onchange=\"handleSeizureSubstanceToxinChange()\" class=\"mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2.5 text-slate-700 font-medium leading-relaxed\">มีประวัติใช้สารเสพติด สารพิษ หรือรับประทานยาเกินขนาด</span>\n                  </label>\n                </div>\n\n                <!-- กิ่งย่อย: ระบุสารเสพติด สารพิษ หรือยาที่ใช้ -->\n                <div id=\"seizureSubstanceDetailsWrap\" class=\"hidden mt-3 ml-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs\">\n                  <span class=\"font-semibold text-slate-800 block\">ระบุสารเสพติด สารพิษ หรือยาที่ใช้ / ได้รับ:</span>\n                  <input type=\"text\" id=\"seizureSubstanceDetails\" placeholder=\"พิมพ์ระบุชื่อสาร ยา หรือสารเคมี เช่น ยาบ้า, กัญชา, Tramadol, สารเคมีเกษตร...\" \n                    class=\"w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500\">\n                </div>\n              </div>\n\n            </div>\n          </div>\n\n\n          <!-- CARD 6 (UNIVERSAL RULE): อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"message-square-plus\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-800\">อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2>\n                <p class=\"text-xs text-slate-500\">ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี เช่น อ่อนเพลียมาก, แน่นหน้าอก, วิงเวียนศีรษะ)</p>\n              </div>\n            </div>\n            <textarea id=\"seizure_other_free\" rows=\"2\" placeholder=\"พิมพ์ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)...\" \n              class=\"w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white\"></textarea>\n          </div>\n\n        </div> <!-- END SEIZURE QUESTIONNAIRE SECTION -->",
  algorithm: {
  "id": "seizure",
  "titleTh": "ชัก / เกร็งกระตุก และการคัดกรองภาวะหมดสติชั่วขณะ (TLOC & Seizure Mimics)",
  "titleEn": "Seizure / Convulsion / Transient Loss of Consciousness (TLOC) Differential",
  "sections": [
    {
      "sectionNo": 1,
      "titleTh": "ข้อมูลเหตุการณ์ เวลา ความถี่ และท่าทางก่อนเกิดเหตุ (Timing & Preceding Activity)",
      "items": [
        {
          "key": "seizureReporter",
          "labelTh": "ผู้ให้ข้อมูลประวัติเหตุการณ์ (History Informant)",
          "type": "single_choice",
          "options": [
            {
              "value": "patient_self",
              "patientTh": "ผู้ป่วยรู้สึกตัวดีและเป็นผู้ให้ข้อมูลเอง",
              "doctorTh": "Patient self-report"
            },
            {
              "value": "witness_relative",
              "patientTh": "ญาติหรือผู้เห็นเหตุการณ์ในขณะหมดสติ/ชักเป็นผู้เล่า",
              "doctorTh": "Eyewitness / Family report"
            },
            {
              "value": "both_patient_witness",
              "patientTh": "ผู้ป่วยและผู้เห็นเหตุการณ์ร่วมกันให้ข้อมูล",
              "doctorTh": "Both patient and eyewitness report"
            }
          ]
        },
        {
          "key": "seizurePrecedingPosture",
          "labelTh": "ท่าทางหรือกิจกรรมก่อนเกิดอาการทันที (Preceding Posture & Activity)",
          "type": "single_choice",
          "options": [
            {
              "value": "prolonged_standing",
              "patientTh": "ยืนอยู่เป็นเวลานาน หรืออยู่ในที่แออัด/ร้อนอบอ้าว",
              "doctorTh": "Prolonged standing in warm/crowded environment (Vasovagal trigger)"
            },
            {
              "value": "sudden_standing",
              "patientTh": "เพิ่งเปลี่ยนท่า ลุกขึ้นยืนเร็วๆ จากท่านั่งหรือท่านอน",
              "doctorTh": "Sudden standing from sitting/supine (Orthostatic trigger)"
            },
            {
              "value": "during_exertion",
              "patientTh": "เกิดขึ้นขณะกำลังออกแรง ทำงานหนัก หรือออกกำลังกาย",
              "doctorTh": "Occurred during exertion / exercise (High-Risk Cardiac trigger) 🚩",
              "isRedFlag": true
            },
            {
              "value": "standing_or_walking_normal",
              "patientTh": "เกิดขึ้นขณะยืนอยู่เฉยๆ หรือเดินปกติ ไม่ได้ออกแรงหนัก",
              "doctorTh": "Standing or normal walking without exertion"
            },
            {
              "value": "supine_or_resting",
              "patientTh": "เกิดขึ้นขณะนอนหงาย หรือนั่งพักผ่อนอยู่เฉยๆ",
              "doctorTh": "Occurred while supine / resting (Cardiac / Seizure feature) 🚩"
            },
            {
              "value": "micturition_defecation",
              "patientTh": "เกิดขึ้นขณะหรือทันทีหลังปัสสาวะ อุจจาระ หรือไอแรงๆ",
              "doctorTh": "Situational syncope trigger (Post-micturition / Defecation / Cough)"
            },
            {
              "value": "sleep",
              "patientTh": "เกิดขึ้นขณะหลับ",
              "doctorTh": "Occurred during sleep (Nocturnal / Sleep-related Seizure)"
            },
            {
              "value": "other",
              "patientTh": "อื่นๆ (ระบุข้อความ)",
              "doctorTh": "Other preceding posture/activity"
            }
          ]
        },
        {
          "key": "seizureLossOfConsciousDuration",
          "labelTh": "ระยะเวลาที่หมดสติหรือไม่รู้ตัว (Duration of Unconsciousness)",
          "type": "single_choice",
          "options": [
            {
              "value": "brief_seconds",
              "patientTh": "สั้นมากเพียงไม่กี่วินาที (ประมาณ 10–30 วินาที) แล้วเริ่มรู้สึกตัว",
              "doctorTh": "Very brief (< 30-60 seconds, favors Syncope)"
            },
            {
              "value": "typical_seizure_minutes",
              "patientTh": "นานประมาณ 1–3 นาที",
              "doctorTh": "Typical duration (1-3 minutes, favors Seizure)"
            },
            {
              "value": "prolonged_gte_5m",
              "patientTh": "นานตั้งแต่ 5 นาทีขึ้นไป",
              "doctorTh": "Prolonged >= 5 minutes (Status Epilepticus T1) 🚩",
              "isRedFlag": true
            },
            {
              "value": "continuous_unstopped",
              "patientTh": "ชักต่อเนื่องไม่หยุด",
              "doctorTh": "Continuous unstopped seizure (Active Status Epilepticus) 🚩",
              "isRedFlag": true
            }
          ]
        },
        {
          "key": "seizureEpisodeCount",
          "labelTh": "จำนวนครั้งที่มีอาการในวันนี้ (Number of Episodes within 24 Hours)",
          "type": "single_choice",
          "options": [
            {
              "value": "single",
              "patientTh": "เกิดขึ้นเพียงครั้งเดียว",
              "doctorTh": "Single episode"
            },
            {
              "value": "multiple_cluster",
              "patientTh": "เกิดซ้ำตั้งแต่ 2 ครั้งขึ้นไป",
              "doctorTh": "Multiple / Cluster episodes (>= 2 episodes)"
            }
          ]
        },
        {
          "key": "seizureInterictalState",
          "labelTh": "สภาพความรู้สึกตัวระหว่างรอบที่เกิดเหตุ (Interictal Consciousness State)",
          "type": "single_choice",
          "options": [
            {
              "value": "full_recovery",
              "patientTh": "ระหว่างรอบฟื้นคืนสติตามปกติ พูดคุยรู้เรื่อง",
              "doctorTh": "Full consciousness recovery between episodes"
            },
            {
              "value": "unconscious_or_drowsy",
              "patientTh": "ระหว่างรอบไม่ฟื้นสติ ซึมตลอดเวลา หรือเกิดอาการต่อเนื่องทันที",
              "doctorTh": "Persistent coma / Drowsiness between episodes (Status Epilepticus) 🚩",
              "isRedFlag": true
            }
          ]
        }
      ]
    },
    {
      "sectionNo": 2,
      "titleTh": "อาการเตือนนำก่อนหมดสติ (Prodrome & Aura)",
      "items": [
        {
          "key": "seizureWarningProdrome",
          "labelTh": "อาการเตือนก่อนหมดสติหรือเกร็งกระตุก (Pre-event Warning / Prodrome / Aura)",
          "type": "multiple_choice",
          "options": [
            {
              "value": "none_sudden",
              "patientTh": "ไม่มีอาการเตือนใดๆ ล้มลงหรือหมดสติทันทีทันใด",
              "doctorTh": "Sudden collapse without warning"
            },
            {
              "value": "lightheaded_tunnel_vision",
              "patientTh": "รู้สึกหน้ามืด วิงเวียน ตาพร่ามัวเห็นภาพมืดลงเรื่อยๆ หรือมีเสียงหูอื้อ",
              "doctorTh": "Lightheadedness, tunnel vision, tinnitus (Classic Syncope prodrome)"
            },
            {
              "value": "cold_sweat_pallor_nausea",
              "patientTh": "มีเหงื่อแตกตัวเย็นท่วมตัว หน้าซีด คลื่นไส้ ใจหวิวพะอืดพะอม",
              "doctorTh": "Diaphoresis, cold skin, pallor, nausea (Autonomic vasovagal prodrome)"
            },
            {
              "value": "sudden_palpitation",
              "patientTh": "รู้สึกใจสั่นรัว หัวใจเต้นสะดุด หรือเต้นเร็วผิดปกติอย่างกะทันหันก่อนวูบ",
              "doctorTh": "Sudden onset palpitations prior to collapse (Suspected Arrhythmic Syncope) 🚩",
              "isRedFlag": true
            },
            {
              "value": "hyperventilation_tingling",
              "patientTh": "มีอาการหายใจหอบเร็ว ลึก แน่นหน้าอก ชารอบปาก หรือชาตามปลายนิ้วมือ",
              "doctorTh": "Air hunger, hyperventilation, chest tightness, perioral paresthesia (HVS prodrome)"
            },
            {
              "value": "epigastric_rising",
              "patientTh": "รู้สึกแปลกๆ จุกแน่นหรือโหวงในช่องท้องลอยตีขึ้นมาที่คอ",
              "doctorTh": "Epigastric rising sensation (Temporal Lobe Aura)"
            },
            {
              "value": "olfactory_gustatory",
              "patientTh": "ได้กลิ่นแปลกประหลาด กลิ่นเหม็นไหม้ หรือรสชาติแปลกในปาก",
              "doctorTh": "Olfactory / Gustatory aura (Epileptic aura)"
            },
            {
              "value": "visual_dejavu",
              "patientTh": "มองเห็นแสงวูบวาบ ภาพหลอน หรือมีความรู้สึกคุ้นเคยประหลาด (Déjà vu)",
              "doctorTh": "Visual / Psychic aura (Déjà vu phenomenon)"
            }
          ]
        }
      ]
    },
    {
      "sectionNo": 3,
      "titleTh": "ลักษณะการเกร็ง กระตุก หรืออาการขณะหมดสติ (Motor Semiognosis & Signs)",
      "items": [
        {
          "key": "seizureMotorPattern",
          "labelTh": "ลักษณะการเคลื่อนไหวของร่างกายขณะหมดสติ (Motor Semiognosis)",
          "type": "single_choice",
          "options": [
            {
              "value": "generalized_tonic_clonic",
              "patientTh": "ตัวแข็งเกร็งแล้วกระตุกรุนแรงเป็นจังหวะพร้อมกันทั้งตัว ต่อเนื่องเป็นหลักนาที หรือหลายนาที",
              "doctorTh": "Generalized Tonic-Clonic Seizure (GTCS - Rhythmic synchronous jerks)"
            },
            {
              "value": "focal_motor",
              "patientTh": "กระตุกหรือเกร็งเฉพาะส่วน (เช่น แขนข้างเดียว ขาข้างเดียว หรือมุมปากข้างเดียว)",
              "doctorTh": "Focal motor seizure (Suspected focal structural brain lesion) 🚩",
              "isRedFlag": true
            },
            {
              "value": "brief_myoclonic_syncope",
              "patientTh": "ตัวอ่อนล้มลง แต่มีอาการกระตุกเบาๆ สั้นๆ เพียงไม่กี่ครั้ง (สั้นๆ 5–15 วินาที)",
              "doctorTh": "Brief asynchronous myoclonic twitches during syncope (Convulsive Syncope)"
            },
            {
              "value": "carpopedal_spasm",
              "patientTh": "มือจีบเกร็ง ปลายนิ้วมืองุ้มเข้าหากันทั้งสองข้าง หรือเกร็งปลายเท้างุ้ม",
              "doctorTh": "Carpopedal spasm / Tetany (Hyperventilation syndrome / Hypocalcemia)"
            },
            {
              "value": "atonic_limp",
              "patientTh": "ตัวอ่อนปวกเปียกล้มพับลงกับพื้นทันที โดยไม่มีการเกร็งกระตุก",
              "doctorTh": "Atonic collapse / Pure syncopal limpness"
            },
            {
              "value": "absence_automatism",
              "patientTh": "นิ่งค้าง เหม่อลอย เรียกไม่ตอบ มีการเคี้ยวปาก ขยำมือ หรือกระพริบตาถี่ๆ",
              "doctorTh": "Focal impaired awareness with automatisms"
            },
            {
              "value": "thrashing_closed_eyes",
              "patientTh": "ดิ้นสะบัดไปมา ส่ายศีรษะไปมา ลำตัวแอ่น",
              "doctorTh": "Asynchronous thrashing (Features suggestive of PNES)"
            },
            {
              "value": "unknown_or_unobserved",
              "patientTh": "ไม่ทราบแน่ชัด หรือไม่ได้สังเกต",
              "doctorTh": "Unknown or unobserved motor manifestation"
            }
          ]
        },
        {
          "key": "seizure_lateral_tongue_bite",
          "patientTh": "กัดลิ้นบริเวณด้านข้างของลิ้นจนมีแผลหรือมีเลือดออกในปาก",
          "doctorTh": "Lateral border tongue biting (High specificity for Epileptic Seizure)"
        },
        {
          "key": "seizure_eye_deviation",
          "patientTh": "ตาค้าง หรือตาเหลือกขึ้นบน / เหลอกเบนไปข้างใดข้างหนึ่ง",
          "doctorTh": "Upward eye gaze / Sustained eye deviation"
        },
        {
          "key": "seizure_incontinence",
          "patientTh": "ปัสสาวะราด หรืออุจจาระราดขณะหมดสติ",
          "doctorTh": "Urinary or fecal incontinence"
        },
        {
          "key": "seizure_cyanosis_apnea",
          "patientTh": "ริมฝีปากเขียวคล้ำ ตัวเขียว หรือหยุดหายใจชั่วขณะ",
          "doctorTh": "Cyanosis / Ictal apnea (Seizure feature)"
        },
        {
          "key": "seizure_marked_pallor_sweat",
          "patientTh": "ใบหน้าซีดเผือด ตัวเย็น และมีเหงื่อออกเปียกชุ่ม",
          "doctorTh": "Marked facial pallor and profuse cold sweating (Syncope feature)"
        },
        {
          "key": "seizure_fall_injury",
          "patientTh": "ร่างกายหรือศีรษะกระแทกพื้น มีบาดแผลฟกช้ำหรือเลือดออกจากแรงกระแทก",
          "doctorTh": "Fall trauma / Secondary head injury"
        }
      ]
    },
    {
      "sectionNo": 4,
      "titleTh": "สภาพหลังฟื้นคืนสติและการฟื้นตัว (Recovery Duration & Post-ictal Phase)",
      "items": [
        {
          "key": "seizureRecoveryDuration",
          "labelTh": "การฟื้นคืนสติและสภาพความรู้สึกตัวหลังเกิดเหตุ (Post-event Recovery & Consciousness)",
          "type": "single_choice",
          "options": [
            {
              "value": "rapid_under_2m_alert",
              "patientTh": "ฟื้นคืนสติและคุยรู้เรื่องเป็นปกติอย่างรวดเร็ว (ภายใน 1–2 นาที) ไม่งง ไม่ง่วง",
              "doctorTh": "Rapid full recovery within 1-2 min without confusion (Favors Syncope / PNES)"
            },
            {
              "value": "confusion_drowsy_gt_5m",
              "patientTh": "สับสน มึนงง จำเหตุการณ์ไม่ได้ นานเกิน 5–15 นาที หรือหลับลึก ปลุกตื่นยาก",
              "doctorTh": "Prolonged post-ictal confusion > 5-15 min, amnesia, drowsiness (Favors Seizure)"
            },
            {
              "value": "tearful_emotional_tachypnea",
              "patientTh": "รู้สึกตัวดีแต่ยังเหนื่อยหอบ มือชา ร้องไห้ หรือมีความเครียดตกใจ",
              "doctorTh": "Alert but anxious, persistent hyperventilation, emotional distress (HVS)"
            }
          ]
        },
        {
          "key": "seizurePostEventSymptoms",
          "labelTh": "อาการทางกายหลังจากที่เริ่มรู้สึกตัวดีแล้ว (Post-event Physical Symptoms)",
          "type": "single_choice",
          "options": [
            {
              "value": "headache_severe_myalgia",
              "patientTh": "มีอาการปวดศีรษะตุบๆ รุนแรง หรือปวดเมื่อยระบมกล้ามเนื้อทั่วร่างกาย",
              "doctorTh": "Post-ictal severe headache and generalized myalgia (Seizure feature)"
            },
            {
              "value": "mild_fatigue_no_myalgia",
              "patientTh": "รู้สึกอ่อนเพลียเล็กน้อย แต่ไม่มีอาการปวดศีรษะหรือปวดเมื่อยกล้ามเนื้อ",
              "doctorTh": "Mild fatigue without headache or significant myalgia (Syncope feature)"
            }
          ]
        },
        {
          "key": "seizureHasToddParesis",
          "labelTh": "มีอาการแขนหรือขาอ่อนแรงหลังเกิดเหตุหรือไม่ (Post-ictal Focal Deficit / Todd Paresis)",
          "type": "single_choice",
          "options": [
            {
              "value": "no",
              "patientTh": "แขนและขาทั้งสองข้างขยับได้เท่ากันตามปกติ",
              "doctorTh": "No focal motor weakness"
            },
            {
              "value": "yes",
              "patientTh": "มีอาการแขนหรือขาอ่อนแรง หรือมุมปากตกข้างใดข้างหนึ่งหลังเกิดเหตุ",
              "doctorTh": "Post-ictal focal weakness / Todd paresis 🚩",
              "isRedFlag": true
            }
          ]
        }
      ]
    },
    {
      "sectionNo": 5,
      "titleTh": "ปัจจัยกระตุ้น ประวัติโรคประจำตัว และสัญญาณเตือนวิกฤต (Precipitants & Red Flags)",
      "items": [
        {
          "key": "seizurePriorHistory",
          "labelTh": "ประวัติการเคยมีอาการชักหรือหมดสติในอดีต (Past Seizure / Syncope History)",
          "type": "single_choice",
          "options": [
            {
              "value": "known_epilepsy",
              "patientTh": "เป็นโรคลมชักเดิมอยู่แล้ว และเคยรับประทานยากันชัก",
              "doctorTh": "Known Epilepsy on treatment"
            },
            {
              "value": "recurrent_vasovagal",
              "patientTh": "เคยมีอาการเป็นลมหน้ามืดบ่อยๆ เวลาตกใจ กลัวเลือด หรือยืนนาน",
              "doctorTh": "Recurrent history of benign vasovagal syncope"
            },
            {
              "value": "first_time_tloc",
              "patientTh": "เพิ่งเคยมีอาการหมดสติหรือชักครั้งนี้เป็นครั้งแรกในชีวิต",
              "doctorTh": "First-time TLOC / New-onset seizure 🚩"
            }
          ]
        },
        {
          "key": "seizureMedCompliance",
          "labelTh": "การรับประทานยากันชักในช่วงสัปดาห์ที่ผ่านมา (Antiseizure Medication Compliance)",
          "type": "single_choice",
          "options": [
            {
              "value": "compliant",
              "patientTh": "รับประทานยาสม่ำเสมอครบตามแพทย์สั่ง",
              "doctorTh": "Regular medication compliance"
            },
            {
              "value": "missed_or_stopped",
              "patientTh": "ขาดยา ลืมรับประทานยา หรือหยุดยาเองในช่วง 1–7 วันนี้",
              "doctorTh": "Medication non-compliance / Missed doses (Seizure trigger)"
            },
            {
              "value": "dose_changed",
              "patientTh": "เพิ่งมีการปรับเปลี่ยนขนาดยาหรือชนิดยาเมื่อเร็วๆ นี้",
              "doctorTh": "Recent medication adjustment"
            }
          ]
        },
        {
          "key": "seizure_rf_known_cardiac_disease",
          "patientTh": "มีโรคประจำตัวทางหัวใจ (หลอดเลือดหัวใจตีบ ลิ้นหัวใจ หัวใจโต หรือหัวใจเต้นผิดจังหวะ)",
          "doctorTh": "Known Structural Heart Disease / Arrhythmia (High-Risk Cardiac Syncope) 🚩",
          "isRedFlag": true
        },
        {
          "key": "seizure_rf_family_sudden_death",
          "patientTh": "มีคนในครอบครัวสายตรงเสียชีวิตกะทันหันจากโรคหัวใจตั้งแต่อายุน้อย (< 50 ปี)",
          "doctorTh": "Family history of premature sudden cardiac death / Channelopathy 🚩",
          "isRedFlag": true
        },
        {
          "key": "seizure_rf_pregnancy_postpartum",
          "patientTh": "สตรีมีครรภ์ หรือเพิ่งคลอดบุตร/แท้งบุตรภายในช่วง 6 สัปดาห์นี้",
          "doctorTh": "Eclampsia / Postpartum Eclampsia (OB Emergency) 🚩",
          "isRedFlag": true
        },
        {
          "key": "seizure_rf_diabetic_hypo",
          "patientTh": "ผู้ป่วยเบาหวาน มีอาการใจสั่น เหงื่อออก ตัวเย็น มือสั่น หรืออดอาหารก่อนหมดสติ",
          "doctorTh": "Severe Hypoglycemia-induced TLOC / Seizure 🚩",
          "isRedFlag": true
        },
        {
          "key": "seizure_rf_alcohol_withdrawal",
          "patientTh": "ดื่มสุราเป็นประจำ แล้วเพิ่งหยุดดื่มหรือลดปริมาณสุราลงในช่วง 1–3 วันนี้",
          "doctorTh": "Alcohol Withdrawal Seizure / Delirium Tremens Risk 🚩",
          "isRedFlag": true
        },
        {
          "key": "seizure_rf_fever_meningismus",
          "patientTh": "มีไข้สูง หนาวสั่น คอแข็ง หรือปวดศีรษะรุนแรงนำมาก่อนเกิดเหตุ",
          "doctorTh": "Acute CNS Infection (Meningitis / Encephalitis / Brain abscess) 🚩",
          "isRedFlag": true
        },
        {
          "key": "seizure_rf_recent_head_trauma",
          "patientTh": "เพิ่งได้รับอุบัติเหตุกระแทกศีรษะอย่างรุนแรงก่อนหน้าที่จะมีอาการ",
          "doctorTh": "Post-traumatic Seizure / Traumatic Brain Injury (ICH) 🚩",
          "isRedFlag": true
        },
        {
          "key": "seizure_rf_emotional_panic_trigger",
          "patientTh": "มีความเครียดทางอารมณ์อย่างรุนแรง ตื่นตระหนก ทะเลาะวิวาท หรือเสียใจกะทันหัน",
          "doctorTh": "Acute emotional distress / Panic attack trigger (HVS / Vasovagal)"
        },
        {
          "key": "seizure_rf_substance_toxin",
          "patientTh": "มีประวัติใช้สารเสพติด สารพิษ หรือรับประทานยาเกินขนาด",
          "doctorTh": "Drug overdose / Toxin-induced seizure 🚩",
          "isRedFlag": true
        }
      ]
    }
  ]
},
  seedPatients: [
  {
    "id": "case-091",
    "queue_number": "A-091",
    "hn": "6708101",
    "name": "นายภาณุพงศ์ กิตติคุณ",
    "age": 28,
    "gender": "ชาย",
    "chief_complaint": "seizure",
    "chief_complaint_title": "ชัก / เกร็งกระตุก",
    "status": "waiting",
    "timestamp": "2026-10-26T02:31:26.424Z",
    "durationVal": 45,
    "durationUnit": "minutes",
    "seizureReporter": "witness_relative",
    "seizurePrecedingPosture": "sleep",
    "seizureLossOfConsciousDuration": "prolonged_gte_5m",
    "seizureDurationGte5mVal": 45,
    "seizureEpisodeCount": "multiple_cluster",
    "seizureEpisodeCountVal": 2,
    "seizureInterictalState": "unconscious_or_drowsy",
    "seizureWarningProdrome": "none_sudden",
    "seizureWarningProdromes": [
      "none_sudden"
    ],
    "seizureMotorPattern": "generalized_tonic_clonic",
    "seizure_lateral_tongue_bite": true,
    "seizure_eye_deviation": true,
    "seizure_incontinence": true,
    "seizure_cyanosis_apnea": true,
    "seizure_marked_pallor_sweat": false,
    "seizure_fall_injury": true,
    "seizureRecoveryDuration": "confusion_drowsy_gt_5m",
    "seizurePostEventSymptoms": "headache_severe_myalgia",
    "seizureHasToddParesis": "no",
    "seizureToddSide": "none",
    "seizurePriorHistory": "known_epilepsy",
    "seizureMedCompliance": "missed_or_stopped",
    "seizure_rf_known_cardiac_disease": false,
    "seizure_rf_family_sudden_death": false,
    "seizure_rf_pregnancy_postpartum": false,
    "seizure_rf_diabetic_hypo": false,
    "seizure_rf_alcohol_withdrawal": false,
    "seizure_rf_fever_meningismus": false,
    "seizure_rf_recent_head_trauma": false,
    "seizure_rf_emotional_panic_trigger": false,
    "seizure_rf_substance_toxin": false,
    "seizureSubstanceDetails": "",
    "otherSymptomsFree": "ขณะนำส่งโรงพยาบาลยังมีอาการเกร็งกระตุกเป็นช่วงๆ ญาติสังเกตเห็นมีเลือดออกที่ขอบปาก",
    "hospRecordStatus": "ratchaburi",
    "underlying": [
      "โรคลมชัก (Epilepsy)"
    ],
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "Sodium Valproate (Depakine Chrono) 500 mg 1 tab po bid, Levetiracetam (Keppra) 500 mg 1 tab po bid (ญาติแจ้งว่าผู้ป่วยลืมรับประทานยามา 3 วัน)",
    "doctor_notes": {
      "additional_hpi": "45 นาทีก่อนมา รพ. ขณะนอนหลับอยู่บนเตียง ญาติได้ยินเสียงเกร็งคราง พบผู้ป่วยตาค้างเหลือกขึ้นบน กัดลิ้นด้านข้างซ้าย มีเลือดปนน้ำลาย เกร็งกระตุกแขนขาทั้งสองข้างพร้อมกัน นานประมาณ 3-4 นาที หลังหยุดชักผู้ป่วยยังไม่ฟื้นสติ ซึม หายใจมีเสียงกรน ต่อมาอีก 15 นาที มีอาการชักเกร็งกระตุกซ้ำรอบที่สองบนรถพยาบาล",
      "physical_exam": "BT 37.2 C, PR 122/min regular, RR 26/min, BP 148/92 mmHg, SpO2 93% on room air -> 99% on oxygen cannula 4 LPM. DTX 114 mg/dL. Neuro: Post-ictal stupor, GCS E2V2M4, pupils 3 mm RTLBE, active lateral tongue laceration (bleeding stopped), no neck stiffness, motor withdrawal all 4 extremities symmetrically.",
      "preliminary_dx": "Convulsive Status Epilepticus secondary to Antiseizure Medication Non-compliance 🚩",
      "plan": "Open airway, maintain high-flow oxygen. IV Diazepam 10 mg slow push STAT (seizure stopped). IV Levetiracetam (Keppra) 3,000 mg (40-60 mg/kg) in NSS 100 mL IV infusion over 15 min. STAT CBC, Electrolytes, Ca, Mg, Phosphate, BUN, Cr, LFT, Venous Blood Gas, Bedside DTX. STAT Serum Valproate level. Arrange urgent Non-contrast CT Brain once stabilized."
    }
  },
  {
    "id": "case-092",
    "queue_number": "A-092",
    "hn": "6708214",
    "name": "น.ส.ชุติมา ธนสถิตย์",
    "age": 24,
    "gender": "หญิง",
    "chief_complaint": "seizure",
    "chief_complaint_title": "ชัก / เกร็งกระตุก",
    "status": "waiting",
    "timestamp": "2026-10-26T02:21:26.424Z",
    "durationVal": 1,
    "durationUnit": "hours",
    "seizureReporter": "both_patient_witness",
    "seizurePrecedingPosture": "supine_or_resting",
    "seizureLossOfConsciousDuration": "typical_seizure_minutes",
    "seizureEpisodeCount": "single",
    "seizureEpisodeCountVal": 1,
    "seizureInterictalState": "full_recovery",
    "seizureWarningProdrome": "none_sudden",
    "seizureWarningProdromes": [
      "none_sudden"
    ],
    "seizureMotorPattern": "generalized_tonic_clonic",
    "seizure_lateral_tongue_bite": false,
    "seizure_eye_deviation": true,
    "seizure_incontinence": true,
    "seizure_cyanosis_apnea": true,
    "seizure_marked_pallor_sweat": false,
    "seizure_fall_injury": false,
    "seizureRecoveryDuration": "confusion_drowsy_gt_5m",
    "seizurePostEventSymptoms": "headache_severe_myalgia",
    "seizureHasToddParesis": "no",
    "seizureToddSide": "none",
    "seizurePriorHistory": "first_time_tloc",
    "seizureMedCompliance": "compliant",
    "seizure_rf_known_cardiac_disease": false,
    "seizure_rf_family_sudden_death": false,
    "seizure_rf_pregnancy_postpartum": true,
    "seizure_rf_diabetic_hypo": false,
    "seizure_rf_alcohol_withdrawal": false,
    "seizure_rf_fever_meningismus": false,
    "seizure_rf_recent_head_trauma": false,
    "seizure_rf_emotional_panic_trigger": false,
    "seizure_rf_substance_toxin": false,
    "seizureSubstanceDetails": "",
    "otherSymptomsFree": "ผู้ป่วยบ่นปวดศีรษะตื้อๆ ตาพร่ามัว และจุกแน่นลิ้นปี่นำมาก่อนหน้านี้ 2 ชั่วโมง",
    "hospRecordStatus": "ratchaburi",
    "underlying": [
      "ตั้งครรภ์แรก (G1P0 GA 34 สัปดาห์) ฝากครรภ์ที่ รพ.ราชบุรี",
      "ภาวะความดันโลหิตสูงขณะตั้งครรภ์ (Gestational HT)"
    ],
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "Methyldopa 250 mg 1 tab po tid, FBC, Calcium carbonate",
    "doctor_notes": {
      "additional_hpi": "หญิงตั้งครรภ์แรก GA 34 สัปดาห์ 1 ชม. ก่อนมา รพ. ขณะนอนพักผ่อนที่บ้าน บ่นปวดศีรษะบริเวณท้ายทอย ตาพร่ามัว มองเห็นภาพเป็นจุดมัวๆ และจุกแน่นใต้ลิ้นปี่ ต่อมาจู่ๆ มีอาการเกร็งกระตุกทั้งตัว ตาเหลือกขึ้นบน ปัสสาวะราด นานประมาณ 2 นาที หลังชักมีอาการมึนงง สับสน จำเหตุการณ์ช่วงชักไม่ได้ สามีจึงรีบนำส่ง รพ.",
      "physical_exam": "BT 36.8 C, PR 96/min, RR 20/min, BP 178/112 mmHg, SpO2 98%. GA 34 weeks, fundal height 32 cm, fetal heart rate 144 bpm. Neuro: Drowsy but arousable, GCS E3V4M6, pupils 3 mm RTLBE, hyperreflexia 3+ both knee jerks with 2 beats of ankle clonus. Pitting edema 2+ both legs. Urine dipstick: Protein 3+.",
      "preliminary_dx": "Antepartum Eclampsia (Severe Preeclampsia with Seizure onset) 🚩 [OBSTETRIC CRITICAL EMERGENCY]",
      "plan": "Emergency Code Eclampsia! Activate Obstetric Emergency Team STAT. IV Magnesium Sulfate Protocol: Loading dose 4 g IV in 100 mL D5W over 15-20 min, followed by continuous IV infusion 1 g/hr. Control BP: IV Nicardipine titration to maintain SBP 140-150, DBP 90-100 mmHg. STAT CBC, Plt, Coagulogram, LFT, BUN, Cr, Uric acid, Urine protein/Cr ratio. Continuous fetal heart rate monitoring. Prepare for emergent cesarean delivery after maternal stabilization."
    }
  },
  {
    "id": "case-093",
    "queue_number": "A-093",
    "hn": "6708325",
    "name": "น.ส.พิมพ์ชนก สุวรรณเวช",
    "age": 19,
    "gender": "หญิง",
    "chief_complaint": "seizure",
    "chief_complaint_title": "ชัก / เกร็งกระตุก",
    "status": "waiting",
    "timestamp": "2026-10-26T02:11:26.424Z",
    "durationVal": 30,
    "durationUnit": "minutes",
    "seizureReporter": "both_patient_witness",
    "seizurePrecedingPosture": "prolonged_standing",
    "seizureLossOfConsciousDuration": "brief_seconds",
    "seizureEpisodeCount": "single",
    "seizureEpisodeCountVal": 1,
    "seizureInterictalState": "full_recovery",
    "seizureWarningProdrome": "lightheaded_tunnel_vision",
    "seizureWarningProdromes": [
      "lightheaded_tunnel_vision",
      "cold_sweat_pallor_nausea"
    ],
    "seizureMotorPattern": "brief_myoclonic_syncope",
    "seizure_lateral_tongue_bite": false,
    "seizure_eye_deviation": false,
    "seizure_incontinence": false,
    "seizure_cyanosis_apnea": false,
    "seizure_marked_pallor_sweat": true,
    "seizure_fall_injury": false,
    "seizureRecoveryDuration": "rapid_under_2m_alert",
    "seizurePostEventSymptoms": "mild_fatigue_no_myalgia",
    "seizureHasToddParesis": "no",
    "seizureToddSide": "none",
    "seizurePriorHistory": "recurrent_vasovagal",
    "seizureMedCompliance": "compliant",
    "seizure_rf_known_cardiac_disease": false,
    "seizure_rf_family_sudden_death": false,
    "seizure_rf_pregnancy_postpartum": false,
    "seizure_rf_diabetic_hypo": false,
    "seizure_rf_alcohol_withdrawal": false,
    "seizure_rf_fever_meningismus": false,
    "seizure_rf_recent_head_trauma": false,
    "seizure_rf_emotional_panic_trigger": false,
    "seizure_rf_substance_toxin": false,
    "seizureSubstanceDetails": "",
    "otherSymptomsFree": "ไม่ได้ทานข้าวเช้า ยืนเข้าแถวกลางแดดร้อนจัด รู้สึกหูอื้อและภาพตัดวูบไป",
    "hospRecordStatus": "self",
    "underlying": ["ปฏิเสธ"],
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "ไม่มี",
    "doctor_notes": {
      "additional_hpi": "นักศึกษาสาว 30 นาทีก่อนมา รพ. ยืนเข้าแถวเคารพธงชาติและฟังอบรมกลางแดดร้อนจัดนานกว่า 40 นาที โดยไม่ได้ดื่มน้ำและไม่ได้ทานอาหารเช้า บ่นวิงเวียน รู้สึกหน้ามืด ภาพมืดลงเรื่อยๆ หูอื้อ มีเหงื่อเย็นท่วมตัว จากนั้นตัวอ่อนวูบพับลงกับพื้น เพื่อนที่ประคองเห็นมีแขนกระตุกเบาๆ สั้นๆ 2-3 ครั้ง นานไม่เกิน 5-10 วินาที ไม่มีกัดลิ้น ไม่ปัสสาวะราด เมื่อนอนราบลงกับพื้นผู้ป่วยฟื้นคืนสติตื่นรู้เรื่องดีภายในไม่ถึง 1 นาที ไม่งง ไม่มีปวดกล้ามเนื้อระบม Sheldon Seizure vs Syncope Score = -5",
      "physical_exam": "BT 36.7 C, PR 72/min, RR 16/min, BP Supine 112/68 mmHg -> Sitting 108/66 mmHg, SpO2 99%. Alert, fully oriented E4V5M6, skin warm, mucosal pink, cardiovascular normal S1 S2 no murmur, neurological exam normal all modalities. 12-lead EKG: Normal sinus rhythm, rate 70 bpm, normal PR/QRS/QTc intervals, no ischemic change, no Brugada pattern.",
      "preliminary_dx": "Neurocardiogenic / Vasovagal Syncope with Convulsive Myoclonus (Benign Convulsive Syncope)",
      "plan": "Reassurance that this is a benign reflex faint, not epilepsy. Advise avoiding prolonged standing in heat, adequate oral fluid intake (2-3 L/day), and recognition of vasovagal prodrome (lying down/counterpressure maneuvers immediately if lightheaded). Discharge home with instructions."
    }
  },
  {
    "id": "case-094",
    "queue_number": "A-094",
    "hn": "6708436",
    "name": "น.ส.กมลวรรณ รัตนวิชัย",
    "age": 23,
    "gender": "หญิง",
    "chief_complaint": "seizure",
    "chief_complaint_title": "ชัก / เกร็งกระตุก",
    "status": "waiting",
    "timestamp": "2026-10-26T02:06:26.424Z",
    "durationVal": 40,
    "durationUnit": "minutes",
    "seizureReporter": "both_patient_witness",
    "seizurePrecedingPosture": "supine_or_resting",
    "seizureLossOfConsciousDuration": "brief_seconds",
    "seizureEpisodeCount": "single",
    "seizureEpisodeCountVal": 1,
    "seizureInterictalState": "full_recovery",
    "seizureWarningProdrome": "hyperventilation_tingling",
    "seizureWarningProdromes": [
      "hyperventilation_tingling"
    ],
    "seizureMotorPattern": "carpopedal_spasm",
    "seizure_lateral_tongue_bite": false,
    "seizure_eye_deviation": false,
    "seizure_incontinence": false,
    "seizure_cyanosis_apnea": false,
    "seizure_marked_pallor_sweat": false,
    "seizure_fall_injury": false,
    "seizureRecoveryDuration": "tearful_emotional_tachypnea",
    "seizurePostEventSymptoms": "mild_fatigue_no_myalgia",
    "seizureHasToddParesis": "no",
    "seizureToddSide": "none",
    "seizurePriorHistory": "first_time_tloc",
    "seizureMedCompliance": "compliant",
    "seizure_rf_known_cardiac_disease": false,
    "seizure_rf_family_sudden_death": false,
    "seizure_rf_pregnancy_postpartum": false,
    "seizure_rf_diabetic_hypo": false,
    "seizure_rf_alcohol_withdrawal": false,
    "seizure_rf_fever_meningismus": false,
    "seizure_rf_recent_head_trauma": false,
    "seizure_rf_emotional_panic_trigger": true,
    "seizure_rf_substance_toxin": false,
    "seizureSubstanceDetails": "",
    "otherSymptomsFree": "มีเรื่องทะเลาะกับแฟน ร้องไห้หนัก หายใจหอบเร็วมาก ชารอบปากและปลายมือปลายเท้า มือทั้งสองข้างเกร็งจีบ",
    "hospRecordStatus": "self",
    "underlying": ["ปฏิเสธ"],
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "ไม่มี",
    "doctor_notes": {
      "additional_hpi": "40 นาทีก่อนมา รพ. ผู้ป่วยมีปากเสียงทะเลาะกับแฟนอย่างรุนแรง เสียใจมาก ร้องไห้ฟูมฟายและหายใจหอบเร็วลึกต่อเนื่อง บ่นแน่นหน้าอก หายใจไม่อิ่ม ชาหนาๆ บริเวณรอบริมฝีปาก และชาซ่าๆ ตามปลายนิ้วมือปลายนิ้วเท้าทั้งสองข้าง จากนั้นมือทั้งสองข้างเกร็งจีบ ปลายนิ้วงุ้มเข้าหากัน รู้สึกหน้ามืดเวียนศีรษะคล้ายจะวูบหมดสติ ญาติตกใจกลัวเป็นโรคลมชักจึงรีบพาส่ง ER",
      "physical_exam": "BT 36.8 C, PR 108/min, RR 28/min (tachypneic, deep sighs), BP 128/82 mmHg, SpO2 100% on room air. Neuro: Alert, fully conscious, tearful, bilateral carpopedal spasms (Trousseau-like posture of both hands), no facial asymmetry, pupils 3 mm RTLBE. Lungs clear, heart regular tachycardia, no murmur.",
      "preliminary_dx": "Acute Hyperventilation Syndrome with Carpopedal Spasm (Respiratory Alkalosis / Tetany) secondary to Acute Emotional Distress",
      "plan": "Calm and compassionate reassurance. Coached slow abdominal breathing (in through nose 4 sec, out through mouth 6 sec). Do NOT use paper bag rebreathing. Venous blood gas (VBG): pH 7.54, pCO2 24 mmHg, HCO3 21 mEq/L (Acute Respiratory Alkalosis). Serum Ionized Calcium: 1.02 mmol/L (Mild secondary hypocalcemia). After 15 minutes of slow breathing guidance, spasms and paresthesia completely resolved. Discharged with mental health support advice."
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
    setVal('seizureDurationVal', patient.durationVal || '');
    setVal('seizureDurationUnit', patient.durationUnit || 'hours');
    setRadioValue('seizureReporter', patient.seizureReporter);
    setRadioValue('seizurePrecedingPosture', patient.seizurePrecedingPosture);
    if (patient.seizurePrecedingPosture === 'other') {
      setVal('seizurePrecedingPostureOtherText', patient.seizurePrecedingPostureOtherText || '');
      document.getElementById('seizurePrecedingPostureOtherWrap')?.classList.remove('hidden');
    } else {
      document.getElementById('seizurePrecedingPostureOtherWrap')?.classList.add('hidden');
    }

    setRadioValue('seizureLossOfConsciousDuration', patient.seizureLossOfConsciousDuration);
    if (patient.seizureLossOfConsciousDuration === 'prolonged_gte_5m') {
      setVal('seizureDurationGte5mVal', patient.seizureDurationGte5mVal || '');
      document.getElementById('seizureDurationGte5mWrap')?.classList.remove('hidden');
    } else {
      document.getElementById('seizureDurationGte5mWrap')?.classList.add('hidden');
    }

    setRadioValue('seizureEpisodeCount', patient.seizureEpisodeCount);
    setVal('seizureEpisodeCountVal', patient.seizureEpisodeCountVal || '');
    setRadioValue('seizureInterictalState', patient.seizureInterictalState);
    handleSeizureEpisodeCountChange();

    document.querySelectorAll('input[name="seizureWarningProdrome"]').forEach(cb => cb.checked = false);
    const prodromes = Array.isArray(patient.seizureWarningProdromes) && patient.seizureWarningProdromes.length > 0
      ? patient.seizureWarningProdromes
      : (patient.seizureWarningProdrome ? [patient.seizureWarningProdrome] : []);
    prodromes.forEach(val => {
      const cb = document.querySelector(`input[name="seizureWarningProdrome"][value="${val}"]`);
      if (cb) cb.checked = true;
    });

    setRadioValue('seizureMotorPattern', patient.seizureMotorPattern);

    setChk('seizure_lateral_tongue_bite', patient.seizure_lateral_tongue_bite);
    setChk('seizure_eye_deviation', patient.seizure_eye_deviation);
    setChk('seizure_incontinence', patient.seizure_incontinence);
    setChk('seizure_cyanosis_apnea', patient.seizure_cyanosis_apnea);
    setChk('seizure_marked_pallor_sweat', patient.seizure_marked_pallor_sweat);
    setChk('seizure_fall_injury', patient.seizure_fall_injury);

    setRadioValue('seizureRecoveryDuration', patient.seizureRecoveryDuration);
    setRadioValue('seizurePostEventSymptoms', patient.seizurePostEventSymptoms);
    setRadioValue('seizureHasToddParesis', patient.seizureHasToddParesis);
    setRadioValue('seizureToddSide', patient.seizureToddSide);
    handleSeizureToddParesisChange();

    setRadioValue('seizurePriorHistory', patient.seizurePriorHistory);
    setRadioValue('seizureMedCompliance', patient.seizureMedCompliance);
    handleSeizurePriorHistoryChange();

    setChk('seizure_rf_known_cardiac_disease', patient.seizure_rf_known_cardiac_disease);
    setChk('seizure_rf_family_sudden_death', patient.seizure_rf_family_sudden_death);
    setChk('seizure_rf_pregnancy_postpartum', patient.seizure_rf_pregnancy_postpartum);
    setChk('seizure_rf_diabetic_hypo', patient.seizure_rf_diabetic_hypo);
    setChk('seizure_rf_alcohol_withdrawal', patient.seizure_rf_alcohol_withdrawal);
    setChk('seizure_rf_fever_meningismus', patient.seizure_rf_fever_meningismus);
    setChk('seizure_rf_recent_head_trauma', patient.seizure_rf_recent_head_trauma);
    setChk('seizure_rf_emotional_panic_trigger', patient.seizure_rf_emotional_panic_trigger);
    setChk('seizure_rf_substance_toxin', patient.seizure_rf_substance_toxin);
    setVal('seizureSubstanceDetails', patient.seizureSubstanceDetails || '');
    handleSeizureSubstanceToxinChange();
    checkSeizurePediatricAgeGuidance();
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
      // ------------------ SEIZURE & TLOC INTAKE ------------------
      const _rawDur = parseFloat(document.getElementById('seizureDurationVal')?.value); const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
      const durationUnit = document.getElementById('seizureDurationUnit')?.value || 'hours';

      const seizureReporter = document.querySelector('input[name="seizureReporter"]:checked')?.value || 'unspecified';
      const seizurePrecedingPosture = document.querySelector('input[name="seizurePrecedingPosture"]:checked')?.value || 'unspecified';
      const seizurePrecedingPostureOtherText = seizurePrecedingPosture === 'other' ? (document.getElementById('seizurePrecedingPostureOtherText')?.value.trim() || '') : '';
      const seizureLossOfConsciousDuration = document.querySelector('input[name="seizureLossOfConsciousDuration"]:checked')?.value || 'unspecified';
      const seizureDurationGte5mVal = seizureLossOfConsciousDuration === 'prolonged_gte_5m' ? (parseInt(document.getElementById('seizureDurationGte5mVal')?.value, 10) || null) : null;
      const seizureEpisodeCount = document.querySelector('input[name="seizureEpisodeCount"]:checked')?.value || 'unspecified';
      const seizureEpisodeCountVal = seizureEpisodeCount === 'multiple_cluster' ? (parseInt(document.getElementById('seizureEpisodeCountVal')?.value, 10) || 2) : 1;
      const seizureInterictalState = seizureEpisodeCount === 'multiple_cluster' ? (document.querySelector('input[name="seizureInterictalState"]:checked')?.value || 'full_recovery') : 'full_recovery';

      const seizureWarningProdromes = Array.from(document.querySelectorAll('input[name="seizureWarningProdrome"]:checked')).map(cb => cb.value);
      const seizureWarningProdrome = seizureWarningProdromes[0] || 'unspecified';
      const seizureMotorPattern = document.querySelector('input[name="seizureMotorPattern"]:checked')?.value || 'unspecified';

      const seizure_lateral_tongue_bite = document.getElementById('seizure_lateral_tongue_bite')?.checked || false;
      const seizure_eye_deviation = document.getElementById('seizure_eye_deviation')?.checked || false;
      const seizure_incontinence = document.getElementById('seizure_incontinence')?.checked || false;
      const seizure_cyanosis_apnea = document.getElementById('seizure_cyanosis_apnea')?.checked || false;
      const seizure_marked_pallor_sweat = document.getElementById('seizure_marked_pallor_sweat')?.checked || false;
      const seizure_fall_injury = document.getElementById('seizure_fall_injury')?.checked || false;

      const seizureRecoveryDuration = document.querySelector('input[name="seizureRecoveryDuration"]:checked')?.value || 'unspecified';
      const seizurePostEventSymptoms = document.querySelector('input[name="seizurePostEventSymptoms"]:checked')?.value || 'unspecified';
      const seizureHasToddParesis = document.querySelector('input[name="seizureHasToddParesis"]:checked')?.value || 'no';
      const seizureToddSide = seizureHasToddParesis === 'yes' ? (document.querySelector('input[name="seizureToddSide"]:checked')?.value || 'none') : 'none';

      const seizurePriorHistory = document.querySelector('input[name="seizurePriorHistory"]:checked')?.value || 'unspecified';
      const seizureMedCompliance = seizurePriorHistory === 'known_epilepsy' ? (document.querySelector('input[name="seizureMedCompliance"]:checked')?.value || 'compliant') : 'compliant';

      const seizure_rf_known_cardiac_disease = document.getElementById('seizure_rf_known_cardiac_disease')?.checked || false;
      const seizure_rf_family_sudden_death = document.getElementById('seizure_rf_family_sudden_death')?.checked || false;
      const seizure_rf_pregnancy_postpartum = document.getElementById('seizure_rf_pregnancy_postpartum')?.checked || false;
      const seizure_rf_diabetic_hypo = document.getElementById('seizure_rf_diabetic_hypo')?.checked || false;
      const seizure_rf_alcohol_withdrawal = document.getElementById('seizure_rf_alcohol_withdrawal')?.checked || false;
      const seizure_rf_fever_meningismus = document.getElementById('seizure_rf_fever_meningismus')?.checked || false;
      const seizure_rf_recent_head_trauma = document.getElementById('seizure_rf_recent_head_trauma')?.checked || false;
      const seizure_rf_emotional_panic_trigger = document.getElementById('seizure_rf_emotional_panic_trigger')?.checked || false;
      const seizure_rf_substance_toxin = document.getElementById('seizure_rf_substance_toxin')?.checked || false;
      const seizureSubstanceDetails = seizure_rf_substance_toxin ? (document.getElementById('seizureSubstanceDetails')?.value.trim() || '') : '';

      newPatient = {
        id: recordId,
        queue_number: queueNumber,
        hn: randomHn,
        name: patientName,
        age: patientAge,
        gender: gender,
        chief_complaint: 'seizure',
        chief_complaint_title: 'ชัก / เกร็งกระตุก',
        status: recordStatus,
        timestamp: new Date().toISOString(),
        durationVal,
        durationUnit,
        seizureReporter,
        seizurePrecedingPosture,
        seizurePrecedingPostureOtherText,
        seizureLossOfConsciousDuration,
        seizureDurationGte5mVal,
        seizureEpisodeCount,
        seizureEpisodeCountVal,
        seizureInterictalState,
        seizureWarningProdrome,
        seizureWarningProdromes,
        seizureMotorPattern,
        seizure_lateral_tongue_bite,
        seizure_eye_deviation,
        seizure_incontinence,
        seizure_cyanosis_apnea,
        seizure_marked_pallor_sweat,
        seizure_fall_injury,
        seizureRecoveryDuration,
        seizurePostEventSymptoms,
        seizureHasToddParesis,
        seizureToddSide,
        seizurePriorHistory,
        seizureMedCompliance,
        seizure_rf_known_cardiac_disease,
        seizure_rf_family_sudden_death,
        seizure_rf_pregnancy_postpartum,
        seizure_rf_diabetic_hypo,
        seizure_rf_alcohol_withdrawal,
        seizure_rf_fever_meningismus,
        seizure_rf_recent_head_trauma,
        seizure_rf_emotional_panic_trigger,
        seizure_rf_substance_toxin,
        seizureSubstanceDetails,
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
    return Boolean(
      p.seizureLossOfConsciousDuration === 'prolonged_gte_5m' ||
      p.seizureLossOfConsciousDuration === 'continuous_unstopped' ||
      (p.seizureEpisodeCount === 'multiple_cluster' && p.seizureInterictalState === 'unconscious_or_drowsy') ||
      p.seizurePrecedingPosture === 'during_exertion' ||
      hasWarningProdrome(p, 'sudden_palpitation') ||
      p.seizureMotorPattern === 'focal_motor' ||
      p.seizureHasToddParesis === 'yes' ||
      p.seizure_rf_known_cardiac_disease ||
      p.seizure_rf_family_sudden_death ||
      p.seizure_rf_pregnancy_postpartum ||
      p.seizure_rf_diabetic_hypo ||
      p.seizure_rf_alcohol_withdrawal ||
      p.seizure_rf_fever_meningismus ||
      p.seizure_rf_recent_head_trauma ||
      p.seizure_rf_substance_toxin ||
      (p.seizurePriorHistory === 'first_time_tloc' && p.age >= 18 && (p.seizureMotorPattern === 'generalized_tonic_clonic' || p.seizureMotorPattern === 'focal_motor' || p.seizure_lateral_tongue_bite || p.seizure_eye_deviation || p.seizureRecoveryDuration === 'confusion_drowsy_gt_5m'))
    );
  },

  evaluateRedFlags(patient) {
    const redFlags = [];
    // Seizure Red Flags
    if (patient.seizureLossOfConsciousDuration === 'prolonged_gte_5m' || patient.seizureLossOfConsciousDuration === 'continuous_unstopped') {
      const isContinuous = patient.seizureLossOfConsciousDuration === 'continuous_unstopped';
      const durText = patient.seizureDurationGte5mVal ? ` (ประมาณ ${patient.seizureDurationGte5mVal} นาที)` : '';
      redFlags.push({
        key: 'status_epilepticus_duration',
        textTh: isContinuous
          ? 'ชักต่อเนื่องไม่หยุด (Active Convulsive Status Epilepticus - T1)'
          : `ชักเกร็งหรือหมดสตินานต่อเนื่องตั้งแต่ 5 นาทีขึ้นไป${durText} (Prolonged Seizure / Convulsive Status Epilepticus - T1)`,
        risk: 'เข้าเกณฑ์ Time point 1 ของ Status Epilepticus เสี่ยงภาวะสมองขาดออกซิเจน ภาวะเลือดเป็นกรด และเซลล์ประสาทตายถาวร ต้องเปิดหลอดเลือดดำ ให้ O2 High flow, ตรวจ DTX และให้ IV Diazepam/Lorazepam ทันที'
      });
    }

    if (patient.seizureEpisodeCount === 'multiple_cluster' && patient.seizureInterictalState === 'unconscious_or_drowsy') {
      redFlags.push({
        key: 'status_epilepticus_cluster',
        textTh: 'ชักซ้ำหลายครั้งโดยระหว่างพักไม่ฟื้นคืนสติอย่างสมบูรณ์ (Cluster Seizures without Consciousness Recovery - Impending SE)',
        risk: 'เข้าเกณฑ์ Status Epilepticus หรือ Cluster seizures วิกฤต ต้องได้รับ Antiepileptic drugs ทางหลอดเลือดดำเร่งด่วน'
      });
    }

    if (patient.seizurePrecedingPosture === 'during_exertion' || hasWarningProdrome(patient, 'sudden_palpitation') || patient.seizure_rf_known_cardiac_disease || patient.seizure_rf_family_sudden_death) {
      redFlags.push({
        key: 'cardiac_syncope_exertion_palpitation',
        textTh: 'มีอาการขณะออกกำลัง/ใจสั่นนำมาก่อน/มีโรคหัวใจหรือประวัติครอบครัวเสียชีวิตกะทันหัน (High-Risk Cardiac Syncope / Arrhythmia Red Flag)',
        risk: 'เสี่ยงภาวะหัวใจเต้นผิดจังหวะรุนแรงชนิด Malignant Ventricular Arrhythmia, Brugada/Long QT Syndrome หรือ Aortic Stenosis ต้องตรวจ EKG 12 lead ทันที ติด EKG Monitor และส่งพบอายุรแพทย์โรคหัวใจ'
      });
    }

    if (patient.seizure_rf_pregnancy_postpartum) {
      redFlags.push({
        key: 'eclampsia',
        textTh: 'หญิงตั้งครรภ์หรือเพิ่งคลอดบุตรมีอาการชักเกร็ง (Suspected Eclampsia)',
        risk: 'ภาวะฉุกเฉินทางสูติศาสตร์วิกฤต เสี่ยงต่อชีวิตทั้งมารดาและทารก ต้องวัดความดันโลหิต ให้ IV Magnesium Sulfate เป็นยากันชักลำดับแรก (ห้ามให้ Phenytoin) และปรึกษาสูติแพทย์ทันที'
      });
    }

    if (patient.seizure_rf_diabetic_hypo) {
      redFlags.push({
        key: 'hypoglycemia',
        textTh: 'มีประวัติเบาหวาน / สงสัยภาวะน้ำตาลในเลือดต่ำ (Hypoglycemia Induced Seizure)',
        risk: 'ต้องเจาะ DTX ทันที หากน้ำตาลต่ำกว่า 70 mg/dL ให้ 50% Glucose 50 ml IV push ทันที เพื่อป้องกันสมองเสียหายถาวร'
      });
    }

    if (patient.seizureMotorPattern === 'focal_motor' || patient.seizureHasToddParesis === 'yes') {
      redFlags.push({
        key: 'focal_seizure_todd_paresis',
        textTh: 'มีอาการกระตุกเฉพาะที่ / มีแขนขาอ่อนแรงข้างใดข้างหนึ่งหลังชัก (Focal Onset Seizure / Todd’s Paresis)',
        risk: 'บ่งชี้รอยโรคเฉพาะที่ในสมอง (Structural Brain Lesion / Mass / Stroke / Cortical dysplasia) จำเป็นต้องส่งตรวจ Neuroimaging (CT/MRI Brain) เร่งด่วน'
      });
    }

    if (patient.seizure_rf_fever_meningismus) {
      redFlags.push({
        key: 'cns_infection_meningismus',
        textTh: 'มีไข้ร่วมกับคอแข็งเกร็ง ซึมลง หรือสับสนมาก (Suspected CNS Infection: Meningitis / Encephalitis)',
        risk: 'เสี่ยงภาวะเยื่อหุ้มสมองอักเสบหรือเนื้อสมองอักเสบ ต้องส่ง CT Brain แล้วพิจารณาทำ Lumbar Puncture พร้อมให้ Empiric IV Antibiotics/Acyclovir ทันที'
      });
    }

    if (patient.seizure_rf_recent_head_trauma) {
      redFlags.push({
        key: 'recent_head_trauma',
        textTh: 'มีประวัติอุบัติเหตุทางศีรษะก่อนเกิดอาการชัก (Post-Traumatic Seizure / Intracranial Hematoma)',
        risk: 'เสี่ยงภาวะเลือดออกในกะโหลกศีรษะ (Epidural / Subdural / Intracerebral Hemorrhage) ต้องส่ง CT Brain เร่งด่วน'
      });
    }

    if (patient.seizure_rf_substance_toxin) {
      const toxinDetail = patient.seizureSubstanceDetails ? ` [ระบุ: ${patient.seizureSubstanceDetails}]` : '';
      redFlags.push({
        key: 'substance_toxin_overdose',
        textTh: `มีประวัติใช้สารเสพติด สารพิษ หรือรับประทานยาเกินขนาด${toxinDetail} (Tox-induced Seizure / Drug Overdose)`,
        risk: 'ระวังสารกลุ่ม Tramadol, Amphetamine, Theophylline, TCA หรือ สารพิษกำจัดแมลง เตรียม Specific Antidote และเฝ้าระวังทางเดินหายใจ'
      });
    }

    if (patient.seizure_rf_alcohol_withdrawal) {
      redFlags.push({
        key: 'alcohol_withdrawal',
        textTh: 'มีประวัติดื่มสุราหนักหรือเพิ่งหยุด/ลดการดื่มสุรา (Alcohol Withdrawal Seizure / Rum Fits)',
        risk: 'เสี่ยงพัฒนาเป็น Delirium Tremens (DT) ต้องให้ High-dose IV Thiamine (B1) ก่อนหรือพร้อม Glucose และให้ Benzodiazepine titrated dose'
      });
    }

    const hasEpilepticFeatures = patient.seizureMotorPattern === 'generalized_tonic_clonic' ||
      patient.seizureMotorPattern === 'focal_motor' ||
      patient.seizure_lateral_tongue_bite ||
      patient.seizure_eye_deviation ||
      patient.seizureRecoveryDuration === 'confusion_drowsy_gt_5m';

    if (patient.seizurePriorHistory === 'first_time_tloc' && patient.age >= 18 && hasEpilepticFeatures) {
      redFlags.push({
        key: 'adult_first_onset',
        textTh: 'อาการชักเกร็งกระตุกครั้งแรกในผู้ใหญ่ (First-onset Adult Seizure - Age ≥ 18)',
        risk: 'จำเป็นต้องสืบค้นหาสาเหตุทุติยภูมิ (Secondary Causes: Brain Tumor, Stroke, Metabolic disturbance) ต้องตรวจ Electrolytes, DTX, CT/MRI Brain และส่งพบประสาทแพทย์'
      });
    }
    return redFlags;
  },

  updateOutputs(patient) {
    updateSeizureOutputs(patient);
  },

  generateCds(patient, ctx) {
    const { rfs, ddxList, workupList, managementList } = ctx;
    const sheldon = calculateSheldonScore(patient);
    const hvs = evaluateHyperventilationScreen(patient);

    const isStatusEpilepticus = patient.seizureLossOfConsciousDuration === 'prolonged_gte_5m' ||
      patient.seizureLossOfConsciousDuration === 'continuous_unstopped' ||
      (patient.seizureEpisodeCount === 'multiple_cluster' && patient.seizureInterictalState === 'unconscious_or_drowsy') ||
      rfs.some(r => r.key === 'status_epilepticus_duration' || r.key === 'status_epilepticus_cluster' || r.key === 'seizure_rf_status_epilepticus');

    const isEclampsia = Boolean(patient.seizure_rf_pregnancy_postpartum || rfs.some(r => r.key === 'eclampsia' || r.key === 'seizure_rf_eclampsia'));

    const isCardiacSyncope = Boolean(
      patient.seizurePrecedingPosture === 'during_exertion' ||
      hasWarningProdrome(patient, 'sudden_palpitation') ||
      patient.seizure_rf_known_cardiac_disease ||
      patient.seizure_rf_family_sudden_death ||
      rfs.some(r => r.key === 'cardiac_syncope_exertion_palpitation' || r.key === 'seizure_rf_cardiac_syncope')
    );

    if (isStatusEpilepticus) {
      ddxList.push('1. Convulsive Status Epilepticus (Medical & Neurological Critical Emergency) 🚩');
      ddxList.push('2. Acute Symptomatic Seizures (Metabolic / Toxic / CNS Infection / Acute Stroke / ICH)');
      ddxList.push('3. Non-convulsive Status Epilepticus with subtle motor twitches');
      workupList.push('• ⚡ ABC Resuscitation: เปิดทางเดินหายใจ ดูดเสมหะ ให้ออกซิเจน Mask with bag หรือเตรียม ETT หาก Hypoventilation/GCS < 8');
      workupList.push('• Bedside Capillary Blood Glucose (DTX) STAT ทันที (หาก < 70 ให้ 50% Glucose 50 mL IV Push)');
      workupList.push('• STAT Labs: CBC, Electrolytes, Ca, Mg, Phosphate, BUN, Cr, Venous Blood Gas, Antiseizure drug levels, Toxic screen');
      workupList.push('• STAT Non-contrast CT Brain ทันทีเมื่ออาการชักสงบและสัญญาณชีพคงที่');
      managementList.push('• 🛑 First-line Emergent Treatment: IV Diazepam 10 mg (0.15-0.2 mg/kg) slow push หรือ IV Lorazepam 4 mg ทันที หากไม่หยุดใน 5 นาที ให้ซ้ำได้อีก 1 ครั้ง');
      managementList.push('• Second-line Urgent Antiseizure Infusion: IV Levetiracetam (Keppra) 40-60 mg/kg (สูงสุด 4,500 mg) ใน NSS 100 mL IV over 10-15 min หรือ IV Sodium Valproate 40 mg/kg (สูงสุด 3,000 mg) หรือ IV Fosphenytoin 20 mg PE/kg');
      managementList.push('• หากชักต่อเนื่องเกิน 20-30 นาที (Refractory Status): เตรียมใส่ท่อช่วยหายใจ (RSI) และเริ่ม General Anesthesia (IV Midazolam หรือ Propofol infusion) พร้อมย้ายเข้า ICU');
    } else if (isEclampsia) {
      ddxList.push('1. Antepartum / Intrapartum / Postpartum Eclampsia 🚩 [OBSTETRIC CRITICAL EMERGENCY]');
      ddxList.push('2. Posterior Reversible Encephalopathy Syndrome (PRES) secondary to severe hypertension');
      ddxList.push('3. Cerebral Venous Sinus Thrombosis (CVST) in pregnancy/postpartum');
      workupList.push('• Bedside DTX, Vital Signs, Continuous Fetal Heart Rate Monitoring');
      workupList.push('• STAT Labs: CBC, Platelet count, Coagulation studies, LFT, BUN, Cr, Uric acid, Urine Protein/Creatinine ratio');
      managementList.push('• 🛑 First-line Drug of Choice: IV Magnesium Sulfate (MgSO4) Loading dose 4 g IV in 100 mL D5W over 15-20 min, ต่อด้วย Maintenance infusion 1-2 g/hr IV (เฝ้าระวัง Deep tendon reflex, RR > 14/min, Urine output > 30 mL/hr และเตรียม 10% Calcium Gluconate ไว้ข้างเตียงเสมอ)');
      managementList.push('• ควบคุมความดันโลหิตสูงวิกฤต: IV Nicardipine titration (เริ่ม 5 mg/hr) หรือ IV Hydralazine 5-10 mg เป้าหมาย SBP 140-150 mmHg, DBP 90-100 mmHg');
      managementList.push('• ประสานสูตินรีแพทย์ (OB-GYN) และกุมารแพทย์ STAT เพื่อวางแผนยุติการตั้งครรภ์หลังผู้ป่วยอาการคงที่');
    } else if (isCardiacSyncope) {
      ddxList.push('1. High-Risk Cardiac Syncope with Convulsive Myoclonus (Arrhythmic / Structural Heart Disease) 🚩');
      ddxList.push('2. Acute Coronary Syndrome (ACS) with malignant ventricular arrhythmia / AV block');
      ddxList.push('3. Valvular / Outflow Obstruction (Severe Aortic Stenosis / HOCM / Aortic Dissection)');
      workupList.push('• STAT 12-lead EKG ทันที, ติด Cardiac Monitor เฝ้าระวัง Rhythm ตลอดเวลา');
      workupList.push('• High-sensitivity Troponin-T, Electrolytes (K, Mg, Ca), CBC, BUN, Cr');
      workupList.push('• Bedside Echocardiography (POCUS) ดู Wall motion abnormality, Pericardial effusion, และ Valvular lesion');
      managementList.push('• จัดให้นอนราบ ยกขาสูงหากไม่มีภาวะ Heart failure, ให้ออกซิเจน');
      managementList.push('• งดให้ผู้ป่วยลุกเดินหรือเปลี่ยนท่าโดยไม่มีเจ้าหน้าที่ดูแล');
      managementList.push('• ปรึกษาอายุรแพทย์โรคหัวใจ (Cardiology) และเตรียมรับไว้ในหอผู้ป่วยวิกฤตหัวใจ (CCU) หากตรวจพบ Arrhythmia หรือ Ischemic EKG');
    } else if (hvs.isSuspected) {
      ddxList.push('1. Acute Hyperventilation Syndrome (HVS) with Carpopedal Spasm & Presyncope (Respiratory Alkalosis / Tetany)');
      ddxList.push('2. Panic Disorder with Acute Panic Attack');
      ddxList.push('3. Hypocalcemic Tetany secondary to hypoparathyroidism / vitamin D deficiency');
      ddxList.push('4. Psychogenic Non-Epileptic Seizures (PNES)');
      workupList.push('• วัด Vital Signs, SpO2 (มักปกติหรือ 100%)');
      workupList.push('• ตรวจ Venous Blood Gas (VBG): ประเมิน Respiratory Alkalosis (pH สูง, pCO2 ต่ำ)');
      workupList.push('• ตรวจ Serum Ionized Calcium, Magnesium, Potassium');
      workupList.push('• 12-lead EKG เพื่อตัดภาวะ Long QTc หรือ Arrhythmia');
      managementList.push('• การดูแลหลัก: การสื่อสารปลอบประโลมอย่างนุ่มนวลและสร้างความมั่นใจ (Reassurance) ในสภาพแวดล้อมที่เงียบสงบ');
      managementList.push('• แนะนำเทคนิคการหายใจช้าๆ (Coached slow breathing): หายใจเข้าทางจมูกช้าๆ 4 วินาที และผ่อนลมหายใจออกทางปากช้าๆ 6 วินาที');
      managementList.push('• 🛑 ข้อควรระวัง: ห้ามใช้ถุงกระดาษครอบปากและจมูก (Paper bag rebreathing) เนื่องจากเสี่ยงต่อภาวะขาดออกซิเจนในกรณีมีพยาธิสภาพทางปอดหรือหัวใจแฝง');
    } else {
      if (sheldon.score >= 1) {
        ddxList.push(`1. Generalized or Focal Epileptic Seizure (Sheldon Score = ${sheldon.score} — Favors Seizure)`);
        ddxList.push('2. Acute Provoked Seizure (Alcohol withdrawal, Hypoglycemia, Electrolyte imbalance, Toxic)');
        ddxList.push('3. First-onset Unprovoked Seizure / Structural Brain Lesion');
        workupList.push('• Complete Neurological Examination, Vital signs, DTX');
        workupList.push('• CBC, Electrolytes (Na, K, Cl, HCO3, Ca, Mg, Phosphate), BUN, Cr, LFT');
        workupList.push('• หากเป็นโรคลมชักเดิมที่กินยา: ส่งตรวจ Antiseizure medication drug level');
        workupList.push('• หากเป็นชักครั้งแรกในผู้ใหญ่: STAT Non-contrast CT Brain');
        managementList.push('• จัดผู้ป่วยนอนตะแคงกึ่งคว่ำ (Recovery position) ป้องกันการสำลัก');
        managementList.push('• 🛑 ห้ามใช้วัตถุใดๆ สอดงัดเข้าไปในปากผู้ป่วยเด็ดขาด!');
        managementList.push('• ตรวจสอบประวัติยากันชักเดิม: หากขาดยา ให้กินยากันชักขนาดเดิมต่อทันทีหลังฟื้นตัวดีและกลืนได้');
      } else {
        ddxList.push(`1. Neurocardiogenic / Vasovagal Syncope with/without Convulsive Myoclonus (Sheldon Score = ${sheldon.score} — Favors Syncope)`);
        ddxList.push('2. Orthostatic Hypotension / Volume Depletion');
        ddxList.push('3. Situational Reflex Syncope');
        workupList.push('• 12-lead EKG ทุกรายเพื่อตัดภาวะ Arrhythmia / Long QT / Brugada');
        workupList.push('• วัด Orthostatic Vital Signs (BP, HR ท่านอน และหลังยืน 1, 3 นาที)');
        workupList.push('• DTX, CBC, Electrolytes หากมีประวัติขาดน้ำหรือสงสัยภาวะซีด');
        managementList.push('• ให้นอนราบ ยกขาสูง (Trendelenburg position) ช่วยเพิ่ม Venous return สู่สมอง');
        managementList.push('• แนะนำให้ดื่มน้ำเกลือแร่หรือน้ำเปล่าให้เพียงพอ (2-3 ลิตร/วัน)');
        managementList.push('• ให้ความรู้เรื่องท่ากายบริหารป้องกันเป็นลม (Physical Counterpressure Maneuvers: การเกร็งกล้ามเนื้อขา ขาไขว้กัน หรือกำหมัดแน่นเมื่อเริ่มมีอาการหน้ามืด)');
      }
    }
  }
});
