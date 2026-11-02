// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 09_syncope.js
// อาการนำ: หมดสติ / วูบ / เป็นลม (Syncope / Blackout / Collapse)
// ไฟล์นี้แยกอิสระสำหรับอาการนำ syncope เพื่อให้ทีมแพทย์และ IT โรงพยาบาลนำไปพัฒนาต่อได้โดยไม่กระทบระบบหลัก
// =========================================================================

function handleSyncopePostureChange() {
  const val = document.querySelector('input[name="syncopePosture"]:checked')?.value;
  const wrap = document.getElementById('syncopePostureOtherWrap');
  if (wrap) {
    if (val === 'other') wrap.classList.remove('hidden');
    else wrap.classList.add('hidden');
  }
}

function handleSyncopeConsciousnessLevelChange() {
  const val = document.querySelector('input[name="syncopeConsciousnessLevel"]:checked')?.value;
  const wrap = document.getElementById('syncopeUnconsciousDurationWrap');
  if (wrap) {
    if (val === 'true_syncope') wrap.classList.remove('hidden');
    else {
      wrap.classList.add('hidden');
      document.querySelectorAll('input[name="syncopeUnconsciousDuration"]').forEach(r => r.checked = false);
      const gte5Wrap = document.getElementById('syncopeDurationGte5mWrap');
      if (gte5Wrap) gte5Wrap.classList.add('hidden');
    }
  }
}

function handleSyncopeUnconsciousDurationChange() {
  const val = document.querySelector('input[name="syncopeUnconsciousDuration"]:checked')?.value;
  const wrap = document.getElementById('syncopeDurationGte5mWrap');
  if (wrap) {
    if (val === 'prolonged_gte_5m') wrap.classList.remove('hidden');
    else wrap.classList.add('hidden');
  }
}

function handleSyncopeEpisodeCountChange() {
  const val = document.querySelector('input[name="syncopeEpisodeCount"]:checked')?.value;
  const wrap = document.getElementById('syncopeEpisodeCountWrap');
  if (wrap) {
    if (val === 'multiple_cluster') wrap.classList.remove('hidden');
    else wrap.classList.add('hidden');
  }
}

function handleSyncopeWarningChange(el) {
  if (!el) return;
  if (el.value === 'none_sudden' && el.checked) {
    document.querySelectorAll('input[name="syncopeProdromes"]').forEach(cb => {
      if (cb.value !== 'none_sudden') cb.checked = false;
    });
  } else if (el.checked && el.value !== 'none_sudden') {
    const noneCb = document.querySelector('input[name="syncopeProdromes"][value="none_sudden"]');
    if (noneCb) noneCb.checked = false;
  }
}

function handleSyncopeMotorCategoryChange() {
  const val = document.querySelector('input[name="syncopeMotorCategory"]:checked')?.value;
  const wrap = document.getElementById('syncopeMotorSubWrap');
  if (wrap) {
    if (val === 'abnormal_movements') wrap.classList.remove('hidden');
    else {
      wrap.classList.add('hidden');
      document.querySelectorAll('input[name="syncopeMotorSign"]').forEach(r => r.checked = false);
    }
  }
}

function handleSyncopeRiskChange(el) {
  if (!el) return;
  if (el.value === 'none_unremarkable' && el.checked) {
    document.querySelectorAll('input[name="syncopeRiskFactors"]').forEach(cb => {
      if (cb.value !== 'none_unremarkable') cb.checked = false;
    });
    toggleBranch('syncope_branch_female_lmp', false);
    return;
  } else if (el.checked && el.value !== 'none_unremarkable') {
    const noneCb = document.querySelector('input[name="syncopeRiskFactors"][value="none_unremarkable"]');
    if (noneCb) noneCb.checked = false;
  }
  const femaleCb = document.querySelector('input[name="syncopeRiskFactors"][value="female_missed_period"]');
  toggleBranch('syncope_branch_female_lmp', femaleCb ? femaleCb.checked : false);
}

function handleSyncopeLmpToggle(val) {
  toggleBranch('syncope_lmp_date_wrap', val === 'exact_date');
  toggleBranch('syncope_lmp_approx_wrap', val === 'approx');
}

    function updateSyncopeOutputs(patient) {
      const unitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
      const durationText = patient.durationVal ? `${patient.durationVal} ${unitMap[patient.durationUnit] || 'ชั่วโมง'}` : 'ไม่ระบุ';

      const sheldon = calculateSheldonScore(patient);
      const hvs = evaluateHyperventilationScreen(patient);

      const reporterMap = {
        patient_self: 'ผู้ป่วยรู้สึกตัวดีและเป็นผู้เล่าประวัติเอง',
        witness_relative: 'ญาติหรือผู้เห็นเหตุการณ์ในขณะหมดสติ/เป็นลมเป็นผู้เล่า',
        both_patient_witness: 'ทั้งผู้ป่วยและผู้เห็นเหตุการณ์ร่วมกันให้ข้อมูล',
        unspecified: 'ไม่ได้ระบุผู้ให้ประวัติ'
      };

      const postureMap = {
        prolonged_standing: 'ยืนอยู่เป็นเวลานาน หรืออยู่ในที่แออัด/ร้อนอบอ้าว (Vasovagal trigger)',
        sudden_standing: 'เพิ่งเปลี่ยนท่า ลุกขึ้นยืนเร็วๆ จากท่านั่งหรือท่านอน (Orthostatic trigger)',
        during_exertion: 'เกิดขึ้นขณะกำลังออกแรง ทำงานหนัก หรือออกกำลังกาย 🚩 (High-Risk Cardiac risk)',
        standing_or_walking_normal: 'ขณะยืนหรือเดินธรรมดา ไม่ได้ออกแรงทำอะไร',
        supine_or_resting: 'เกิดขึ้นขณะนอนหงาย หรือนั่งพักผ่อนอยู่เฉยๆ 🚩 (Cardiac/Arrhythmic risk)',
        micturition_defecation: 'เกิดขึ้นขณะหรือทันทีหลังปัสสาวะ อุจจาระ หรือไอแรงๆ (Situational reflex)',
        other: patient.syncopePostureOtherText ? `อื่นๆ: ${patient.syncopePostureOtherText}` : 'อื่นๆ',
        unspecified: 'ไม่ได้ระบุท่าทาง'
      };

      const consciousLevelMap = {
        true_syncope: 'หมดสติไปเลยชั่วขณะ ไม่รู้สึกตัว (True Syncope / TLOC)',
        near_syncope: 'เกือบหมดสติหรือแค่วูบหน้ามืด แต่ยังรู้สึกตัวตลอดเวลา (Near-Syncope / Presyncope)',
        unspecified: 'ไม่ได้ระบุระดับความรู้สึกตัว'
      };

      const lossDurationMap = {
        brief_seconds: 'สั้นมากเพียงไม่กี่วินาที (ประมาณ 10–30 วินาที) แล้วเริ่มรู้สึกตัว',
        typical_1_to_2m: 'นานประมาณ 1–2 นาที',
        prolonged_gte_5m: `นานตั้งแต่ 5 นาทีขึ้นไป${patient.syncopeDurationGte5mVal ? ` (ประมาณ ${patient.syncopeDurationGte5mVal} นาที)` : ''} 🚩 (Prolonged Coma / Seizure)`,
        continuous_unconscious: 'ยังไม่ฟื้นสติจนถึงปัจจุบัน (Active Unconscious / Coma) 🚩',
        unspecified: 'ไม่ได้ระบุระยะเวลาหมดสติ'
      };

      const prodromeMap = {
        none_sudden: 'ไม่มีอาการเตือนใดๆ ล้มลงหรือหมดสติทันทีทันใด 🚩 (Stokes-Adams / Arrhythmia)',
        lightheaded_tunnel_vision: 'รู้สึกหน้ามืด วิงเวียน ตาพร่ามัวเห็นภาพมืดลงเป็นอุโมงค์ หรือมีเสียงหูอื้อ (Presyncope / Prodrome)',
        cold_sweat_pallor_nausea: 'มีเหงื่อแตกตัวเย็นท่วมตัว หน้าซีด คลื่นไส้ ใจหวิวพะอืดพะอม (Autonomic activation)',
        sudden_palpitation: 'รู้สึกใจสั่นรัว หัวใจเต้นสะดุด หรือเต้นเร็วผิดปกติอย่างกะทันหันก่อนวูบ 🚩 (Arrhythmic Syncope)',
        chest_pain_pressure: 'มีอาการเจ็บแน่นหน้าอก อึดอัด หรือปวดร้าวที่หน้าอก 🚩 (ACS / Aortic Dissection)',
        severe_dyspnea: 'มีอาการหายใจหอบเหนื่อยรุนแรง หรือหายใจไม่อิ่ม 🚩 (PE / Acute Heart Failure)',
        thunderclap_headache: 'ปวดศีรษะรุนแรงเฉียบพลันแบบฟ้าผ่าก่อนหมดสติ 🚩 (SAH / Intracranial Hemorrhage)',
        hyperventilation_tingling: 'มีอาการหายใจหอบเร็ว ลึก แน่นหน้าอก ชารอบปาก หรือชาตามปลายนิ้วมือ (Hyperventilation syndrome)',
        unspecified: 'ไม่ได้ระบุอาการเตือน'
      };

      const prodromesList = Array.isArray(patient.syncopeProdromes) && patient.syncopeProdromes.length > 0
        ? patient.syncopeProdromes
        : ['unspecified'];
      const prodromesText = prodromesList.map(p => prodromeMap[p] || p).join(', ');

      const motorCatText = patient.syncopeMotorCategory === 'abnormal_movements'
        ? 'มีอาการเกร็ง กระตุก หรือเคลื่อนไหวผิดปกติร่วมด้วย'
        : (patient.syncopeMotorCategory === 'limp_flaccid' ? 'ตัวอ่อนปวกเปียกล้มพับลงกับพื้นทันที โดยไม่มีการเกร็งกระตุก (Limp / Flaccid)' : 'ไม่ระบุลักษณะการเคลื่อนไหว');

      const motorSignMap = {
        brief_myoclonic_jerks: 'ตัวอ่อนล้มลง แต่มีอาการกระตุกเบาๆ สั้นๆ เพียงไม่กี่ครั้ง (สั้นๆ 5–15 วินาที - Convulsive Syncope)',
        generalized_tonic_clonic: 'ตัวแข็งเกร็งแล้วกระตุกรุนแรงเป็นจังหวะพร้อมกันทั้งตัว ต่อเนื่องเป็นหลักนาที หรือหลายนาที 🚩 (GTCS / Epileptic Seizure)',
        carpopedal_spasm: 'มือจีบเกร็ง ปลายนิ้วมืองุ้มเข้าหากันทั้งสองข้าง หรือเกร็งปลายเท้างุ้ม (Carpopedal Spasm / Tetany)',
        thrashing_closed_eyes: 'ดิ้นสะบัดไปมา ส่ายศีรษะไปมา ลำตัวแอ่น หรือหลับตาแน่น (Psychogenic Pseudosyncope)',
        unknown_unobserved: 'ไม่ทราบแน่ชัด หรือไม่ได้สังเกตลักษณะการเคลื่อนไหว',
        unspecified: 'ไม่ได้ระบุลักษณะการเคลื่อนไหว'
      };

      const motorDetailText = patient.syncopeMotorCategory === 'abnormal_movements'
        ? `${motorCatText}: ${motorSignMap[patient.syncopeMotorSign] || 'ไม่ระบุ'}`
        : motorCatText;

      const recoveryMap = {
        rapid_spontaneous: 'ฟื้นคืนสติและคุยรู้เรื่องเป็นปกติอย่างรวดเร็ว (ภายใน 1–2 นาที) ไม่งง ไม่ง่วง (Typical Syncope)',
        prolonged_confusion: 'สับสน มึนงง จำเหตุการณ์ไม่ได้ นานเกิน 5–15 นาที หรือหลับลึก ปลุกตื่นยาก 🚩 (Post-ictal confusion)',
        persistent_drowsy_coma: 'ซึมตลอดเวลา ยังไม่ตื่นหรือยังไม่รู้เรื่องจนถึงปัจจุบัน 🚩 (Coma / Prolonged Encephalopathy)',
        unspecified: 'ไม่ได้ระบุการฟื้นตัว'
      };

      const postSymptomMap = {
        post_mild_fatigue: 'รู้สึกอ่อนเพลียเล็กน้อย แต่ไม่มีอาการปวดศีรษะหรือปวดเมื่อย',
        post_severe_headache_myalgia: 'มีอาการปวดศีรษะตุบๆ รุนแรง หรือปวดเมื่อยระบมกล้ามเนื้อทั่วร่างกาย',
        post_focal_weakness: 'มีอาการแขนขาอ่อนแรงครึ่งซีก ปากเบี้ยว หรือพูดไม่ชัดหลังฟื้น 🚩 (Todd\'s Paresis / Acute Stroke)',
        post_ongoing_chestpain: 'ยังมีอาการเจ็บแน่นหน้าอก หอบเหนื่อย หรือใจสั่นต่อเนื่องหลังฟื้น 🚩 (Ongoing Ischemia / PE)',
        post_severe_abdpain_melena: 'ยังมีอาการปวดท้องรุนแรง แน่นท้อง หรือถ่ายดำ/อาเจียนเป็นเลือด 🚩 (Occult Hemorrhage / Ectopic / GI Bleed)'
      };

      const postSxList = Array.isArray(patient.syncopePostSymptoms) && patient.syncopePostSymptoms.length > 0
        ? patient.syncopePostSymptoms.map(s => postSymptomMap[s] || s)
        : ['ไม่มีอาการผิดปกติเด่นชัดหลังฟื้น'];
      const postSxText = postSxList.join(', ');

      const riskFactorMap = {
        known_heart_disease: 'มีประวัติโรคหัวใจ (หลอดเลือดหัวใจตีบ/กล้ามเนื้อหัวใจหนา/ลิ้นหัวใจตีบ) 🚩',
        known_arrhythmia_pacemaker: 'มีภาวะหัวใจเต้นผิดจังหวะ หรือเคยใส่เครื่องกระตุ้นหัวใจ Pacemaker/ICD 🚩',
        family_sudden_death_young: 'ประวัติครอบครัวเสียชีวิตกะทันหันโดยไม่ทราบสาเหตุในวัยหนุ่มสาว (< 50 ปี) 🚩',
        diabetic_on_meds: 'เป็นเบาหวานที่ฉีดอินซูลินหรือรับประทานยาลดน้ำตาล (เสี่ยง Hypoglycemia 🚩)',
        suspected_gi_bleeding: 'มีอาการถ่ายอุจจาระเป็นสีดำ อาเจียนเป็นเลือด หรือมีภาวะซีดเฉียบพลัน 🚩',
        female_missed_period: 'ขาดประจำเดือน หรือสงสัยตั้งครรภ์ (ในผู้ป่วยหญิงวัยเจริญพันธุ์) 🚩',
        recurrent_syncope_history: 'เคยมีอาการวูบ เป็นลม หรือหมดสติตั้งแต่ 2 ครั้งขึ้นไปในอดีต'
      };

      const risksList = Array.isArray(patient.syncopeRiskFactors) && patient.syncopeRiskFactors.length > 0
        ? patient.syncopeRiskFactors.map(r => riskFactorMap[r] || r)
        : [];

      // Pertinent Positives & Negatives
      const positives = [];
      const negatives = [];

      const signs = Array.isArray(patient.syncopeSigns) ? patient.syncopeSigns : [];
      if (signs.includes('syncope_cyanosis_apnea')) positives.push('มีริมฝีปากเขียวคล้ำ ตัวเขียว หรือหยุดหายใจชั่วขณะ 🚩');
      else negatives.push('ไม่มีตัวเขียวหรือหยุดหายใจ');

      if (signs.includes('syncope_marked_pallor_sweat')) positives.push('มีใบหน้าซีดเผือด ตัวเย็น และเหงื่อออกเปียกชุ่ม');
      else negatives.push('ไม่มีหน้าซีดเหงื่อท่วมผิดปกติ');

      if (signs.includes('syncope_lateral_tongue_bite')) positives.push('มีแผลกัดลิ้นด้านข้างหรือเลือดออกในปาก 🚩');
      else negatives.push('ไม่มีแผลกัดลิ้น');

      if (signs.includes('syncope_incontinence')) positives.push('มีปัสสาวะราดหรืออุจจาระราดขณะหมดสติ');
      else negatives.push('ไม่มีปัสสาวะ/อุจจาระราด');

      if (signs.includes('syncope_head_facial_injury')) positives.push('มีร่างกายหรือศีรษะกระแทกพื้น ได้รับบาดเจ็บ/แผลฟกช้ำ 🚩');
      else negatives.push('ไม่มีบาดเจ็บรุนแรงจากการล้ม');

      // Female LMP details
      let lmpText = 'ไม่ระบุ';
      if (patient.gender === 'หญิง' || patient.syncope_lmp_status) {
        const lmpApproxMap = {
          within_1_month: 'ไม่เกิน 1 เดือนที่ผ่านมา (ปกติ)',
          '1_to_2_months': 'ประมาณ 1 - 2 เดือนที่ผ่านมา 🚩',
          '2_to_3_months': 'ประมาณ 2 - 3 เดือนที่ผ่านมา 🚩',
          gt_3_months: 'มากกว่า 3 เดือนขึ้นไป 🚩',
          unknown: 'จำไม่ได้แน่ชัด'
        };
        const status = patient.syncope_lmp_status;
        if (status === 'exact_date') {
          lmpText = `ประจำเดือนครั้งสุดท้าย (LMP) วันที่: ${formatDateDdMmYyyy(patient.syncopeLmpDate) || 'ไม่ได้ระบุวันที่'}`;
        } else if (status === 'approx') {
          lmpText = `ประจำเดือนครั้งสุดท้าย (LMP) โดยประมาณ: ${lmpApproxMap[patient.syncope_lmp_approx] || 'ไม่ระบุ'}`;
        } else if (status === 'missed_period') {
          lmpText = 'ขาดประจำเดือน / เลยกำหนดรอบเดือนแล้ว 🚩 (สงสัยตั้งครรภ์/ท้องนอกมดลูก)';
        } else if (status === 'pregnant') {
          lmpText = 'ทราบว่ากำลังตั้งครรภ์ 🚩 (เสี่ยง Ectopic / Obstetric emergency)';
        } else if (status === 'premenarche') {
          lmpText = 'ยังไม่เคยมีประจำเดือน (ก่อนวัยเจริญพันธุ์)';
        } else if (status === 'menopause') {
          lmpText = 'วัยหมดประจำเดือน / ผ่าตัดมดลูก-รังไข่แล้ว';
        }
      }

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

      // A) Rapid Bullet Format for Syncope & TLOC
      const defaultRapid =
`[Chief Complaint (CC)]
หมดสติ / วูบ / เป็นลม (Syncope / Transient Loss of Consciousness Workup) มา ${durationText}

[History of Present Illness (HPI)]
• ผู้ให้ประวัติ: ${reporterMap[patient.syncopeReporter] || 'ไม่ระบุ'}
• ระดับความรู้สึกตัว: ${consciousLevelMap[patient.syncopeConsciousnessLevel] || 'ไม่ระบุ'}
• ท่าทางก่อนเกิดเหตุ: ${postureMap[patient.syncopePosture] || 'ไม่ระบุ'}
• อาการเตือนล่วงหน้า (Prodrome): ${prodromesText}
• ลักษณะการเคลื่อนไหวขณะเกิดเหตุ: ${motorDetailText}
${patient.syncopeConsciousnessLevel === 'true_syncope' ? `• ระยะเวลาที่หมดสติ: ${lossDurationMap[patient.syncopeUnconsciousDuration] || 'ไม่ระบุ'}\n` : ''}• ความถี่และรอบการเกิดเหตุ: ${patient.syncopeEpisodeCount === 'multiple_cluster' ? `วูบ/หมดสติซ้ำ ${patient.syncopeEpisodeCountVal || 2} ครั้ง 🚩` : 'มีอาการเพียงครั้งเดียว'}
• การฟื้นตัวหลังเกิดเหตุ: ${recoveryMap[patient.syncopeRecoveryPattern] || 'ไม่ระบุ'}
• อาการทางกายหลังฟื้น: ${postSxText}
${patient.gender === 'หญิง' || patient.syncope_lmp_status ? `• ประวัติประจำเดือน (LMP): ${lmpText}\n` : ''}
• Pertinent Positives:
${positives.length > 0 ? positives.map(p => `  - ${p}`).join('\n') : '  - ไม่มีอาการร่วมอื่นที่เด่นชัด'}

• Pertinent Negatives:
${negatives.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• ความเสี่ยงโรคหัวใจ/หลอดเลือดเดิม: ${risksList.length > 0 ? risksList.join('; ') : 'ปฏิเสธ'}
• โรคประจำตัว (U/D): ${patient.underlying?.length > 0 ? patient.underlying.join(', ') : 'ปฏิเสธ'}
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

      // B) Narrative Paragraph Format for Syncope
      const defaultNarrative =
`ผู้ป่วย [${patient.name}] อายุ ${patient.age || '-'} ปี เพศ ${patient.gender || 'ไม่ระบุ'} มารับการตรวจที่ห้องฉุกเฉิน รพ.ราชบุรี ด้วยอาการหมดสติ / วูบ / เป็นลม หรือเกือบหมดสติ มา ${durationText}
ข้อมูลเหตุการณ์: ให้ประวัติโดย [${reporterMap[patient.syncopeReporter] || 'ไม่ระบุ'}] อาการเข้าได้กับ [${consciousLevelMap[patient.syncopeConsciousnessLevel] || 'ไม่ระบุ'}] เกิดเหตุขณะ [${postureMap[patient.syncopePosture] || 'ไม่ระบุ'}] อาการเตือนล่วงหน้า: [${prodromesText}] ขณะเกิดเหตุมีลักษณะ [${motorDetailText}] ${patient.syncopeConsciousnessLevel === 'true_syncope' ? `ระยะเวลาหมดสติประมาณ [${lossDurationMap[patient.syncopeUnconsciousDuration] || 'ไม่ระบุ'}] ` : ''}โดยเกิดอาการ [${patient.syncopeEpisodeCount === 'multiple_cluster' ? `ซ้ำ ${patient.syncopeEpisodeCountVal || 2} ครั้ง` : 'เพียงครั้งเดียว'}] การฟื้นคืนสติหลังเกิดเหตุ: [${recoveryMap[patient.syncopeRecoveryPattern] || 'ไม่ระบุ'}] อาการหลังฟื้น: [${postSxText}]

การประเมินแยกโรค TLOC: Sheldon Seizure vs Syncope Score ได้ ${sheldon.score} คะแนน (${sheldon.interpretation}); การประเมินกลุ่มอาการหายใจหอบเร็ว: ${hvs.label}
${patient.gender === 'หญิง' || patient.syncope_lmp_status ? `ประวัติทางนรีเวช (LMP): [${lmpText}]\n` : ''}อาการร่วมสำคัญที่ตรวจพบ: ${positives.join(', ')}
อาการสำคัญที่ปฏิเสธ: ${negatives.join(', ')}

ประวัติการเจ็บป่วยเดิม: [${hospLabel}], โรคประจำตัว: ${patient.underlying?.length > 0 ? patient.underlying.join(', ') : 'ปฏิเสธ'}, ยาประจำตัว: ${medsText}, ประวัติแพ้ยา/แพ้อาหาร: ${patient.drugAllergy || 'ปฏิเสธประวัติแพ้ยา/แพ้อาหาร'}
${patient.redFlags?.length > 0 ? `\n[🚩 สัญญาณเตือนอันตราย (Red Flags)]: ${patient.redFlags.map(rf => rf.textTh).join('; ')}` : ''}

[บันทึกการตรวจและการประเมินโดยแพทย์]:
• ผลตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น: ${docNotes.preliminary_dx || '-'}
• แผนการรักษา: ${docNotes.plan || '-'}`;

      // C) JSON Payload for Syncope
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
        "chief_complaint": "syncope",
        "syncope_tloc_profile": {
          "duration_value": patient.durationVal || null,
          "duration_unit": patient.durationUnit || null,
          "history_informant": patient.syncopeReporter,
          "consciousness_level": patient.syncopeConsciousnessLevel,
          "preceding_posture": patient.syncopePosture,
          "preceding_posture_other_text": patient.syncopePostureOtherText || "",
          "warning_prodromes": prodromesList,
          "motor_manifestation": {
            "category": patient.syncopeMotorCategory,
            "pattern": patient.syncopeMotorSign
          },
          "unconscious_duration": patient.syncopeUnconsciousDuration,
          "unconscious_duration_gte_5m_approx_minutes": patient.syncopeDurationGte5mVal || null,
          "episode_frequency": {
            "type": patient.syncopeEpisodeCount,
            "total_count": patient.syncopeEpisodeCountVal || 1
          },
          "associated_physical_signs": {
            "cyanosis_ictal_apnea": signs.includes('syncope_cyanosis_apnea'),
            "marked_pallor_cold_sweating": signs.includes('syncope_marked_pallor_sweat'),
            "lateral_tongue_biting": signs.includes('syncope_lateral_tongue_bite'),
            "urinary_fecal_incontinence": signs.includes('syncope_incontinence'),
            "head_facial_trauma": signs.includes('syncope_head_facial_injury')
          },
          "post_event_recovery": {
            "recovery_pattern": patient.syncopeRecoveryPattern,
            "post_symptoms": patient.syncopePostSymptoms || []
          },
          "high_risk_and_etiology_factors": patient.syncopeRiskFactors || [],
          "female_lmp_data": patient.gender === 'หญิง' || patient.syncope_lmp_status ? {
            "status": patient.syncope_lmp_status || null,
            "exact_date": formatDateDdMmYyyy(patient.syncopeLmpDate) || null,
            "approx_interval": patient.syncope_lmp_approx || null
          } : null,
          "clinical_differentiation_scores": {
            "sheldon_score": sheldon.score,
            "sheldon_interpretation": sheldon.interpretation,
            "hyperventilation_suspected": hvs.isSuspected
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
  id: 'syncope',
  recordCc: 'syncope',
  titleTh: 'หมดสติ / วูบ / เป็นลม',
  titleEn: 'Syncope / Blackout / Collapse',
  sectionDomId: 'syncopeQuestionnaireSection',
  doctorCcBadgeHtml: "<i data-lucide=\"sparkles\" class=\"w-3 h-3 mr-1\"></i> CC: หมดสติ / วูบ / เป็นลม (Syncope / TLOC)",
  formHtml: "        <div id=\"syncopeQuestionnaireSection\" class=\"hidden space-y-6\">\n\n          <!-- CARD 1: ข้อมูลเวลา ท่าทางก่อนเกิดเหตุ ระดับความรู้สึกตัว และความถี่ -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"sparkles\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-900\"><span id=\"syncopeCard1Num\">1</span>. ข้อมูลเหตุการณ์ เวลา ท่าทางก่อนเกิดเหตุ และระดับความรู้สึกตัว</h2>\n                <p class=\"text-xs text-slate-500\">โปรดระบุช่วงเวลา ท่าทางก่อนวูบ และลักษณะการหมดสติอย่างละเอียด</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4\">\n              <!-- 1.1 ระยะเวลาตั้งแต่เริ่มมีอาการ -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2\">\n                  1. มีอาการวูบหรือหมดสตินี้เกิดขึ้นมานานเท่าไรแล้ว? <span class=\"text-rose-500\">*</span>\n                </label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-3\">\n                  <div>\n                    <input type=\"number\" id=\"syncopeDurationVal\" min=\"0\" step=\"any\" placeholder=\"ระบุตัวเลข เช่น 30, 2, 1\"\n                      class=\"w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white font-medium\">\n                  </div>\n                  <div>\n                    <select id=\"syncopeDurationUnit\"\n                      class=\"w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white font-medium\">\n                      <option value=\"minutes\">นาที</option>\n                      <option value=\"hours\" selected>ชั่วโมง</option>\n                      <option value=\"days\">วัน</option>\n                      <option value=\"weeks\">สัปดาห์</option>\n                      <option value=\"months\">เดือน</option>\n                      <option value=\"years\">ปี</option>\n                    </select>\n                  </div>\n                </div>\n              </div>\n\n              <!-- 1.2 ผู้ให้ข้อมูลประวัติเหตุการณ์ -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2\">\n                  2. ผู้ให้ข้อมูลประวัติเหตุการณ์ในครั้งนี้:\n                </label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs\">\n                  <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-center cursor-pointer border border-transparent\">\n                    <input type=\"radio\" name=\"syncopeReporter\" value=\"patient_self\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800\">ผู้ป่วยเล่าเอง (รู้สึกตัวดี)</span>\n                  </label>\n                  <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-center cursor-pointer border border-transparent\">\n                    <input type=\"radio\" name=\"syncopeReporter\" value=\"witness_relative\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800\">ญาติ/ผู้เห็นเหตุการณ์เล่า</span>\n                  </label>\n                  <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-center cursor-pointer border border-transparent\">\n                    <input type=\"radio\" name=\"syncopeReporter\" value=\"both_patient_witness\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800\">ผู้ป่วยและญาติร่วมกันเล่า</span>\n                  </label>\n                </div>\n              </div>\n\n              <!-- 1.3 ท่าทางหรือกิจกรรมก่อนเกิดเหตุ -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2\">\n                  3. ท่าทางหรือกิจกรรมที่กำลังทำก่อนเกิดอาการทันที: (เลือกข้อที่ตรงที่สุด)\n                </label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                  <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                    <input type=\"radio\" name=\"syncopePosture\" value=\"prolonged_standing\" onchange=\"handleSyncopePostureChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">ยืนอยู่นาน หรืออยู่ในที่แออัด ร้อนอบอ้าว</span>\n                  </label>\n                  <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                    <input type=\"radio\" name=\"syncopePosture\" value=\"sudden_standing\" onchange=\"handleSyncopePostureChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">เพิ่งเปลี่ยนท่า ลุกขึ้นยืนเร็วๆ จากท่านั่งหรือนอน</span>\n                  </label>\n                  <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                    <input type=\"radio\" name=\"syncopePosture\" value=\"during_exertion\" onchange=\"handleSyncopePostureChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">เกิดขึ้นขณะกำลังออกแรง ทำงานหนัก หรือออกกำลังกาย</span>\n                  </label>\n                  <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                    <input type=\"radio\" name=\"syncopePosture\" value=\"standing_or_walking_normal\" onchange=\"handleSyncopePostureChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">ขณะยืนหรือเดินธรรมดา ไม่ได้ออกแรงทำอะไร</span>\n                  </label>\n                  <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                    <input type=\"radio\" name=\"syncopePosture\" value=\"supine_or_resting\" onchange=\"handleSyncopePostureChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">เกิดขึ้นขณะนอนหงาย หรือนั่งพักผ่อนอยู่เฉยๆ</span>\n                  </label>\n                  <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                    <input type=\"radio\" name=\"syncopePosture\" value=\"micturition_defecation\" onchange=\"handleSyncopePostureChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">ขณะหรือทันทีหลังปัสสาวะ ถ่ายอุจจาระ กลืนอาหาร หรือไอแรงๆ</span>\n                  </label>\n                  <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                    <input type=\"radio\" name=\"syncopePosture\" value=\"neck_movement\" onchange=\"handleSyncopePostureChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">เกิดขึ้นขณะหันศีรษะ เงยหน้า หรือสวมเสื้อคอแน่น</span>\n                  </label>\n                  <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                    <input type=\"radio\" name=\"syncopePosture\" value=\"other\" onchange=\"handleSyncopePostureChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">อื่นๆ (ระบุข้อความอิสระ)</span>\n                  </label>\n                </div>\n\n                <!-- Progressive Disclosure: Other Posture -->\n                <div id=\"syncopePostureOtherWrap\" class=\"hidden mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl\">\n                  <label class=\"block text-xs font-semibold text-slate-700 mb-1\">ระบุท่าทางหรือกิจกรรมก่อนเกิดเหตุ:</label>\n                  <input type=\"text\" id=\"syncopePostureOtherText\" placeholder=\"เช่น กำลังขับรถ, นั่งทำงานหน้าจอคอมพิวเตอร์...\"\n                    class=\"w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500\">\n                </div>\n              </div>\n\n              <!-- 1.4 ระดับความรู้สึกตัวขณะเกิดอาการ (Syncope vs Near-Syncope) -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2\">\n                  4. ระดับความรู้สึกตัวขณะเกิดอาการ (ลักษณะการหมดสติ): (เลือกข้อที่ตรงที่สุด)\n                </label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                  <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                    <input type=\"radio\" name=\"syncopeConsciousnessLevel\" value=\"true_syncope\" onchange=\"handleSyncopeConsciousnessLevelChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2\">\n                      <span class=\"font-bold text-slate-900 block\">หมดสติไปเลยชั่วขณะ</span>\n                      <span class=\"text-[11px] text-slate-600 block mt-0.5\">ไม่รู้สึกตัวเลย จำช่วงที่ล้มหรือช่วงที่หมดสติไม่ได้</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                    <input type=\"radio\" name=\"syncopeConsciousnessLevel\" value=\"near_syncope\" onchange=\"handleSyncopeConsciousnessLevelChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2\">\n                      <span class=\"font-bold text-slate-900 block\">เกือบหมดสติ หรือแค่วูบหน้ามืด</span>\n                      <span class=\"text-[11px] text-slate-600 block mt-0.5\">รู้สึกเหมือนจะเป็นลม ทรงตัวไม่อยู่ แต่ยังรู้สึกตัวตลอดเวลา จำเหตุการณ์ได้</span>\n                    </div>\n                  </label>\n                </div>\n\n                <!-- Progressive Disclosure: ระยะเวลาหมดสติ (เฉพาะกรณีหมดสติจริง) -->\n                <div id=\"syncopeUnconsciousDurationWrap\" class=\"hidden mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2\">\n                  <label class=\"block text-xs font-semibold text-slate-800 mb-1\">\n                    ระยะเวลาที่หมดสติหรือไม่รู้ตัว (โดยประมาณ):\n                  </label>\n                  <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                    <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer border border-slate-200\">\n                      <input type=\"radio\" name=\"syncopeUnconsciousDuration\" value=\"brief_seconds\" onchange=\"handleSyncopeUnconsciousDurationChange()\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                      <span class=\"ml-2 font-medium text-slate-800\">สั้นมากเพียงไม่กี่วินาที (ประมาณ 10–30 วินาที) แล้วเริ่มรู้สึกตัว</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer border border-slate-200\">\n                      <input type=\"radio\" name=\"syncopeUnconsciousDuration\" value=\"typical_minutes\" onchange=\"handleSyncopeUnconsciousDurationChange()\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                      <span class=\"ml-2 font-medium text-slate-800\">นานประมาณ 1–3 นาที</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer border border-slate-200\">\n                      <input type=\"radio\" name=\"syncopeUnconsciousDuration\" value=\"prolonged_gte_5m\" onchange=\"handleSyncopeUnconsciousDurationChange()\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                      <span class=\"ml-2 font-medium text-slate-800\">นานตั้งแต่ 5 นาทีขึ้นไป</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer border border-slate-200\">\n                      <input type=\"radio\" name=\"syncopeUnconsciousDuration\" value=\"continuous_unconscious\" onchange=\"handleSyncopeUnconsciousDurationChange()\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                      <span class=\"ml-2 font-medium text-slate-800\">ยังคงหมดสติต่อเนื่อง ไม่ฟื้นจนถึงโรงพยาบาล</span>\n                    </label>\n                  </div>\n\n                  <!-- Sub-wrap: กรอกเวลากรณี >= 5 นาที -->\n                  <div id=\"syncopeDurationGte5mWrap\" class=\"hidden mt-2 p-2.5 bg-amber-50/70 border border-amber-200 rounded-lg flex items-center space-x-2\">\n                    <label class=\"text-xs font-semibold text-slate-700 whitespace-nowrap\">ระบุระยะเวลาที่หมดสติโดยประมาณ:</label>\n                    <input type=\"number\" id=\"syncopeDurationGte5mVal\" min=\"5\" placeholder=\"เช่น 5, 10, 15\"\n                      class=\"w-24 bg-white border border-slate-300 rounded-md px-2 py-1 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-medical-500\">\n                    <span class=\"text-xs text-slate-600\">นาที</span>\n                  </div>\n                </div>\n              </div>\n\n              <!-- 1.5 จำนวนครั้งในรอบ 24 ชั่วโมง -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2\">\n                  5. จำนวนครั้งที่มีอาการวูบหรือหมดสติในวันนี้ (รอบ 24 ชั่วโมง):\n                </label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                  <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-center cursor-pointer border border-transparent\">\n                    <input type=\"radio\" name=\"syncopeEpisodeCount\" value=\"single\" onchange=\"handleSyncopeEpisodeCountChange()\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800\">เกิดขึ้นเพียงครั้งเดียว</span>\n                  </label>\n                  <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-center cursor-pointer border border-transparent\">\n                    <input type=\"radio\" name=\"syncopeEpisodeCount\" value=\"multiple_cluster\" onchange=\"handleSyncopeEpisodeCountChange()\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800\">เกิดซ้ำตั้งแต่ 2 ครั้งขึ้นไป</span>\n                  </label>\n                </div>\n\n                <!-- Progressive Disclosure: จำนวนครั้ง -->\n                <div id=\"syncopeEpisodeCountWrap\" class=\"hidden mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-2\">\n                  <label class=\"text-xs font-semibold text-slate-700 whitespace-nowrap\">ระบุจำนวนครั้งที่มีอาการในวันนี้:</label>\n                  <input type=\"number\" id=\"syncopeEpisodeCountVal\" min=\"2\" placeholder=\"เช่น 2, 3, 5\"\n                    class=\"w-24 bg-white border border-slate-300 rounded-md px-2 py-1 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-medical-500\">\n                  <span class=\"text-xs text-slate-600\">ครั้ง</span>\n                </div>\n              </div>\n            </div>\n          </div>\n\n          <!-- CARD 2: อาการเตือนนำก่อนวูบหมดสติ -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"bell-ring\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-900\"><span id=\"syncopeCard2Num\">2</span>. อาการเตือนนำก่อนวูบหมดสติ</h2>\n                <p class=\"text-xs text-slate-500\">อาการที่รู้สึกได้ก่อนที่จะหมดสติหรือวูบล้มลง (เลือกได้หลายข้อตามความเป็นจริง)</p>\n              </div>\n            </div>\n\n            <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n              <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                <input type=\"checkbox\" name=\"syncopeProdromes\" value=\"none_sudden\" onchange=\"handleSyncopeWarningChange(this)\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded\">\n                <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">ไม่มีอาการเตือนใดๆ ล้มลงหรือหมดสติทันทีทันใด</span>\n              </label>\n              <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                <input type=\"checkbox\" name=\"syncopeProdromes\" value=\"lightheaded_tunnel_vision\" onchange=\"handleSyncopeWarningChange(this)\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded\">\n                <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">รู้สึกหน้ามืด วิงเวียน ตาพร่ามัวเห็นภาพมืดลงเรื่อยๆ หรือมีเสียงหูอื้อ</span>\n              </label>\n              <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                <input type=\"checkbox\" name=\"syncopeProdromes\" value=\"cold_sweat_pallor_nausea\" onchange=\"handleSyncopeWarningChange(this)\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded\">\n                <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">มีเหงื่อแตกตัวเย็นท่วมตัว หน้าซีด คลื่นไส้ ใจหวิว พะอืดพะอม</span>\n              </label>\n              <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                <input type=\"checkbox\" name=\"syncopeProdromes\" value=\"sudden_palpitation\" onchange=\"handleSyncopeWarningChange(this)\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded\">\n                <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">รู้สึกใจสั่นรัว หัวใจเต้นสะดุด หรือเต้นเร็วผิดปกติอย่างกะทันหันก่อนวูบ</span>\n              </label>\n              <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                <input type=\"checkbox\" name=\"syncopeProdromes\" value=\"chest_pain_pressure\" onchange=\"handleSyncopeWarningChange(this)\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded\">\n                <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">มีอาการเจ็บแน่นหน้าอก อึดอัดหน้าอก หรือปวดร้าวไปกราม/สะบักหลัง</span>\n              </label>\n              <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                <input type=\"checkbox\" name=\"syncopeProdromes\" value=\"severe_dyspnea\" onchange=\"handleSyncopeWarningChange(this)\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded\">\n                <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">มีอาการหายใจหอบเหนื่อยรุนแรง หายใจไม่อิ่มอย่างกะทันหันก่อนวูบ</span>\n              </label>\n              <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                <input type=\"checkbox\" name=\"syncopeProdromes\" value=\"thunderclap_headache\" onchange=\"handleSyncopeWarningChange(this)\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded\">\n                <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">ปวดศีรษะรุนแรงอย่างกะทันหันเหมือนศีรษะจะระเบิดก่อนหมดสติ</span>\n              </label>\n              <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                <input type=\"checkbox\" name=\"syncopeProdromes\" value=\"hyperventilation_tingling\" onchange=\"handleSyncopeWarningChange(this)\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded\">\n                <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">มีอาการหายใจหอบเร็วลึก แน่นหน้าอก ชารอบปาก หรือชาตามปลายนิ้วมือ</span>\n              </label>\n              <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent sm:col-span-2\">\n                <input type=\"checkbox\" name=\"syncopeProdromes\" value=\"aura_epigastric_olfactory\" onchange=\"handleSyncopeWarningChange(this)\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded\">\n                <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">รู้สึกจุกแน่นลอยจากช่องท้องขึ้นคอ ได้กลิ่นแปลกประหลาด หรือเห็นแสงวาบ</span>\n              </label>\n            </div>\n          </div>\n\n          <!-- CARD 3: ลักษณะขณะหมดสติจากผู้เห็นเหตุการณ์ -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"eye\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-900\"><span id=\"syncopeCard3Num\">3</span>. ลักษณะขณะหมดสติจากผู้เห็นเหตุการณ์</h2>\n                <p class=\"text-xs text-slate-500\">ลักษณะการเคลื่อนไหวของกล้ามเนื้อ และอาการผิดปกติร่วมขณะหมดสติ</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4\">\n              <!-- 3.1 ลักษณะการเคลื่อนไหวของร่างกาย (2 ข้อใหญ่) -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2\">\n                  1. ลักษณะการเคลื่อนไหวของร่างกายขณะหมดสติหรือวูบ: (เลือกข้อที่ตรงที่สุด)\n                </label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                  <label class=\"selectable-card bg-slate-50 p-3 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                    <input type=\"radio\" name=\"syncopeMotorCategory\" value=\"limp_flaccid\" onchange=\"handleSyncopeMotorCategoryChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">ตัวอ่อนปวกเปียกล้มพับลงกับพื้นทันที โดยไม่มีการเกร็งกระตุก</span>\n                  </label>\n                  <label class=\"selectable-card bg-slate-50 p-3 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                    <input type=\"radio\" name=\"syncopeMotorCategory\" value=\"abnormal_movements\" onchange=\"handleSyncopeMotorCategoryChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">มีอาการเกร็ง กระตุก หรือเคลื่อนไหวผิดปกติร่วมด้วย</span>\n                  </label>\n                </div>\n\n                <!-- Progressive Disclosure: กิ่งย่อยลักษณะการเกร็งกระตุก -->\n                <div id=\"syncopeMotorSubWrap\" class=\"hidden mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2\">\n                  <label class=\"block text-xs font-semibold text-slate-800 mb-1\">\n                    โปรดระบุลักษณะการเกร็ง กระตุก หรือการเคลื่อนไหวที่สังเกตได้:\n                  </label>\n                  <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                    <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-start cursor-pointer border border-slate-200\">\n                      <input type=\"radio\" name=\"syncopeMotorSign\" value=\"brief_myoclonic_jerks\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                      <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">ตัวอ่อนล้มลง แต่มีอาการกระตุกเบาๆ สั้นๆ เพียงไม่กี่ครั้ง (สั้นๆ 5–15 วินาที) หลังล้มลง</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-start cursor-pointer border border-slate-200\">\n                      <input type=\"radio\" name=\"syncopeMotorSign\" value=\"generalized_tonic_clonic\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                      <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">ตัวแข็งเกร็งแล้วกระตุกรุนแรงเป็นจังหวะพร้อมกันทั้งตัว ต่อเนื่องเป็นหลักนาที หรือหลายนาที</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-start cursor-pointer border border-slate-200\">\n                      <input type=\"radio\" name=\"syncopeMotorSign\" value=\"carpopedal_spasm\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                      <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">มือจีบเกร็ง ปลายนิ้วมืองุ้มเข้าหากันทั้งสองข้าง หรือเกร็งปลายเท้างุ้ม</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-start cursor-pointer border border-slate-200\">\n                      <input type=\"radio\" name=\"syncopeMotorSign\" value=\"thrashing_closed_eyes\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                      <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">ดิ้นสะบัดไปมา ส่ายศีรษะ ลำตัวแอ่น หรือหลับตาแน่นเกร็งต้านการลืมตา</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-start cursor-pointer border border-slate-200 sm:col-span-2\">\n                      <input type=\"radio\" name=\"syncopeMotorSign\" value=\"unknown_unobserved\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                      <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">ไม่ทราบแน่ชัด หรือไม่ได้สังเกต</span>\n                    </label>\n                  </div>\n                </div>\n              </div>\n\n              <!-- 3.2 อาการร่วมขณะเกิดเหตุ -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2\">\n                  2. อาการผิดปกติหรือสภาพร่างกายที่เกิดขึ้นร่วมด้วยขณะเกิดเหตุ: (เลือกได้หลายข้อ)\n                </label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                  <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                    <input type=\"checkbox\" name=\"syncopeSigns\" value=\"syncope_marked_pallor_sweat\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded\">\n                    <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">ใบหน้าซีดเผือด ตัวเย็น มีเหงื่อออกท่วมตัว</span>\n                  </label>\n                  <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                    <input type=\"checkbox\" name=\"syncopeSigns\" value=\"syncope_cyanosis_apnea\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded\">\n                    <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">ริมฝีปากเขียวคล้ำ ใบหน้าคล้ำ หรือหยุดหายใจชั่วขณะ</span>\n                  </label>\n                  <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                    <input type=\"checkbox\" name=\"syncopeSigns\" value=\"syncope_lateral_tongue_bite\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded\">\n                    <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">กัดลิ้นบริเวณด้านข้างจนมีแผลหรือมีเลือดออกในปาก</span>\n                  </label>\n                  <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                    <input type=\"checkbox\" name=\"syncopeSigns\" value=\"syncope_incontinence\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded\">\n                    <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">มีปัสสาวะราด หรืออุจจาระราดขณะหมดสติ</span>\n                  </label>\n                  <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                    <input type=\"checkbox\" name=\"syncopeSigns\" value=\"syncope_head_facial_injury\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded\">\n                    <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">ศีรษะหรือใบหน้ากระแทกพื้นอย่างรุนแรง มีบาดแผลแตกหรือฟกช้ำ</span>\n                  </label>\n                  <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                    <input type=\"checkbox\" name=\"syncopeSigns\" value=\"syncope_eyes_open_deviated\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded\">\n                    <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">ตาค้าง ตาเหลือกขึ้นบน หรือเบนไปข้างใดข้างหนึ่ง</span>\n                  </label>\n                </div>\n              </div>\n            </div>\n          </div>\n\n          <!-- CARD 4: การฟื้นคืนสติและสภาพหลังเกิดเหตุ -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"rotate-ccw\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-900\"><span id=\"syncopeCard4Num\">4</span>. การฟื้นคืนสติและสภาพหลังเกิดเหตุ</h2>\n                <p class=\"text-xs text-slate-500\">ระยะเวลาการฟื้นตัว และอาการผิดปกติที่ยังคงหลงเหลืออยู่หลังฟื้น</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4\">\n              <!-- 4.1 การฟื้นคืนสติ -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2\">\n                  1. การฟื้นคืนสติหลังจากล้มลงหรือหมดสติ: (เลือกข้อที่ตรงที่สุด)\n                </label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs\">\n                  <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                    <input type=\"radio\" name=\"syncopeRecoveryPattern\" value=\"rapid_spontaneous\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">ฟื้นคืนสติเป็นปกติอย่างรวดเร็ว (ภายใน 1–2 นาที) พูดคุยรู้เรื่องทันที ไม่งง</span>\n                  </label>\n                  <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                    <input type=\"radio\" name=\"syncopeRecoveryPattern\" value=\"prolonged_confusion\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">มีอาการสับสน มึนงง จำอะไรไม่ได้ หลับลึก หรือปลุกตื่นยาก นานเกิน 5–15 นาที</span>\n                  </label>\n                  <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                    <input type=\"radio\" name=\"syncopeRecoveryPattern\" value=\"persistent_drowsy_coma\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">ยังคงซึมมาก ปลุกไม่ค่อยตื่น หรือความรู้สึกตัวลดลงต่อเนื่องจนถึง รพ.</span>\n                  </label>\n                </div>\n              </div>\n\n              <!-- 4.2 อาการผิดปกติหลังฟื้นสติ -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2\">\n                  2. อาการผิดปกติที่ยังคงหลงเหลืออยู่หลังฟื้นคืนสติ: (เลือกได้หลายข้อ)\n                </label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                  <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                    <input type=\"checkbox\" name=\"syncopePostSymptoms\" value=\"post_focal_weakness\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded\">\n                    <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">มีแขนหรือขาอ่อนแรงครึ่งซีก ปากเบี้ยว หรือพูดไม่ชัดหลังฟื้น</span>\n                  </label>\n                  <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                    <input type=\"checkbox\" name=\"syncopePostSymptoms\" value=\"post_ongoing_chestpain\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded\">\n                    <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">ยังคงมีอาการเจ็บแน่นหน้าอก หรือใจสั่นต่อเนื่องหลังฟื้นสติ</span>\n                  </label>\n                  <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                    <input type=\"checkbox\" name=\"syncopePostSymptoms\" value=\"post_severe_abdpain_melena\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded\">\n                    <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">มีอาการปวดท้องรุนแรง ท้องอืด หรือหน้ามืดจะเป็นลมซ้ำเวลานั่งหรือลุกยืน</span>\n                  </label>\n                  <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                    <input type=\"checkbox\" name=\"syncopePostSymptoms\" value=\"post_diffuse_muscle_pain\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded\">\n                    <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">มีอาการปวดเมื่อยระบมกล้ามเนื้อทั่วตัวอย่างรุนแรง</span>\n                  </label>\n                  <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                    <input type=\"checkbox\" name=\"syncopePostSymptoms\" value=\"post_severe_headache\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded\">\n                    <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">มีอาการปวดศีรษะรุนแรงต่อเนื่อง</span>\n                  </label>\n                  <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                    <input type=\"checkbox\" name=\"syncopePostSymptoms\" value=\"post_none_asymptomatic\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded\">\n                    <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">ไม่มีอาการผิดปกติใดๆ หลังฟื้น รู้สึกสบายดีเป็นปกติ</span>\n                  </label>\n                </div>\n              </div>\n            </div>\n          </div>\n\n          <!-- CARD 5: ปัจจัยเสี่ยง สัญญาณเตือนวิกฤต และข้อมูล LMP สตรี -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"shield-alert\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-900\"><span id=\"syncopeCard5Num\">5</span>. ปัจจัยเสี่ยง สัญญาณเตือนวิกฤต และข้อมูลสุขภาพสำคัญ</h2>\n                <p class=\"text-xs text-slate-500\">ประวัติสุขภาพเดิมที่มีความสำคัญต่อการวินิจฉัยแยกโรค (เลือกได้หลายข้อ)</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4\">\n              <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                  <input type=\"checkbox\" name=\"syncopeRiskFactors\" value=\"known_heart_disease\" onchange=\"handleSyncopeRiskChange(this)\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded\">\n                  <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">มีโรคประจำตัวเกี่ยวกับหัวใจ (เช่น กล้ามเนื้อหัวใจขาดเลือด, หัวใจโต, หัวใจล้มเหลว, ลิ้นหัวใจตีบ, เคยผ่าตัดหัวใจ)</span>\n                </label>\n                <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                  <input type=\"checkbox\" name=\"syncopeRiskFactors\" value=\"known_arrhythmia_pacemaker\" onchange=\"handleSyncopeRiskChange(this)\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded\">\n                  <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">มีประวัติหัวใจเต้นผิดจังหวะ หรือเคยใส่เครื่องกระตุ้นหัวใจ (Pacemaker / ICD)</span>\n                </label>\n                <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                  <input type=\"checkbox\" name=\"syncopeRiskFactors\" value=\"family_sudden_death_young\" onchange=\"handleSyncopeRiskChange(this)\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded\">\n                  <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">มีคนในครอบครัวสายตรงเสียชีวิตกะทันหันโดยไม่ทราบสาเหตุในวัยหนุ่มสาว (อายุน้อยกว่า 40–50 ปี)</span>\n                </label>\n                <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                  <input type=\"checkbox\" name=\"syncopeRiskFactors\" value=\"recent_bp_med_adjustment\" onchange=\"handleSyncopeRiskChange(this)\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded\">\n                  <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">เพิ่งเริ่มทานยาความดัน ยาขับปัสสาวะ ยาขยายหลอดเลือด หรือเพิ่งมีการปรับเพิ่มขนาดยา</span>\n                </label>\n                <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                  <input type=\"checkbox\" name=\"syncopeRiskFactors\" value=\"dehydration_diarrhea\" onchange=\"handleSyncopeRiskChange(this)\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded\">\n                  <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">มีอาการท้องเสียรุนแรง อาเจียน ดื่มน้ำน้อย หรือขาดน้ำมาก่อนหน้า</span>\n                </label>\n                <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                  <input type=\"checkbox\" name=\"syncopeRiskFactors\" value=\"suspected_gi_bleeding\" onchange=\"handleSyncopeRiskChange(this)\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded\">\n                  <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">มีอาการถ่ายอุจจาระเป็นสีดำเหมือนยางมะตอย ถ่ายเป็นเลือดสด หรืออาเจียนเป็นเลือด</span>\n                </label>\n                <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                  <input type=\"checkbox\" name=\"syncopeRiskFactors\" value=\"female_missed_period\" onchange=\"handleSyncopeRiskChange(this)\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded\">\n                  <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">• (สำหรับสตรี) มีอาการขาดประจำเดือน หรือสงสัยว่าอาจกำลังตั้งครรภ์</span>\n                </label>\n                <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                  <input type=\"checkbox\" name=\"syncopeRiskFactors\" value=\"known_epilepsy_seizure\" onchange=\"handleSyncopeRiskChange(this)\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded\">\n                  <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">มีโรคประจำตัวเป็นโรคลมชัก หรือเคยมีประวัติชักมาก่อน</span>\n                </label>\n                <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                  <input type=\"checkbox\" name=\"syncopeRiskFactors\" value=\"known_diabetes_insulin\" onchange=\"handleSyncopeRiskChange(this)\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded\">\n                  <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">มีโรคประจำตัวเป็นเบาหวาน (ทานยาเบาหวานหรือฉีดอินซูลิน)</span>\n                </label>\n                <label class=\"selectable-card bg-slate-50 p-2.5 rounded-xl flex items-start cursor-pointer border border-transparent\">\n                  <input type=\"checkbox\" name=\"syncopeRiskFactors\" value=\"none_unremarkable\" onchange=\"handleSyncopeRiskChange(this)\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded\">\n                  <span class=\"ml-2 font-medium text-slate-800 leading-relaxed\">ไม่มีปัจจัยเสี่ยงหรือประวัติโรคดังกล่าวข้างต้น</span>\n                </label>\n              </div>\n\n              <!-- PROGRESSIVE DISCLOSURE: ข้อมูลประจำเดือนสำหรับสตรี (LMP) - อ้างอิงตาม CC ปวดท้อง -->\n              <div id=\"syncope_branch_female_lmp\" class=\"hidden bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4\">\n                <div class=\"flex items-center space-x-2 pb-2 border-b border-slate-200\">\n                  <i data-lucide=\"heart-pulse\" class=\"w-4 h-4 text-medical-600\"></i>\n                  <h3 class=\"text-xs sm:text-sm font-bold text-slate-900\">ประวัติประจำเดือนและสุขภาพสตรี (LMP)</h3>\n                </div>\n\n                <div class=\"bg-white border border-slate-200 rounded-xl p-3 text-xs space-y-1\">\n                  <div class=\"font-bold flex items-center text-slate-800\">\n                    <i data-lucide=\"info\" class=\"w-3.5 h-3.5 mr-1 text-medical-600\"></i>\n                    <span>คำอธิบาย: ประจำเดือนรอบล่าสุด (Last Menstrual Period: LMP)</span>\n                  </div>\n                  <p class=\"text-[11px] text-slate-600 leading-relaxed\">\n                    LMP หมายถึง <strong>วันแรกที่ประจำเดือนรอบล่าสุดเริ่มออก</strong> (ไม่ใช่รอบประจำเดือนหมด)\n                  </p>\n                </div>\n\n                <div>\n                  <label class=\"block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2\">\n                    วันแรกของประจำเดือนรอบล่าสุด (LMP) ของท่าน:\n                  </label>\n                  <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-2\">\n                    <label class=\"selectable-card bg-white p-2.5 rounded-xl flex items-center cursor-pointer border border-slate-200\">\n                      <input type=\"radio\" name=\"syncope_lmp_status\" value=\"exact_date\" onchange=\"handleSyncopeLmpToggle('exact_date')\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                      <span class=\"ml-2 font-medium text-slate-800\">จำวันได้แน่นอน (ใส่วันที่)</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2.5 rounded-xl flex items-center cursor-pointer border border-slate-200\">\n                      <input type=\"radio\" name=\"syncope_lmp_status\" value=\"approx\" onchange=\"handleSyncopeLmpToggle('approx')\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                      <span class=\"ml-2 font-medium text-slate-800\">จำวันได้คร่าวๆ (เลือกช่วงเวลาโดยประมาณ)</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2.5 rounded-xl flex items-center cursor-pointer border border-slate-200\">\n                      <input type=\"radio\" name=\"syncope_lmp_status\" value=\"missed_period\" onchange=\"handleSyncopeLmpToggle('missed_period')\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                      <span class=\"ml-2 font-medium text-slate-800\">ขาดประจำเดือน / สงสัยตั้งครรภ์</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2.5 rounded-xl flex items-center cursor-pointer border border-slate-200\">\n                      <input type=\"radio\" name=\"syncope_lmp_status\" value=\"pregnant\" onchange=\"handleSyncopeLmpToggle('pregnant')\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                      <span class=\"ml-2 font-medium text-slate-800\">กำลังตั้งครรภ์ในปัจจุบัน</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2.5 rounded-xl flex items-center cursor-pointer border border-slate-200\">\n                      <input type=\"radio\" name=\"syncope_lmp_status\" value=\"premenarche\" onchange=\"handleSyncopeLmpToggle('premenarche')\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                      <span class=\"ml-2 font-medium text-slate-800\">วัยก่อนมีประจำเดือน (ยังไม่เคยมีประจำเดือน)</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2.5 rounded-xl flex items-center cursor-pointer border border-slate-200\">\n                      <input type=\"radio\" name=\"syncope_lmp_status\" value=\"menopause\" onchange=\"handleSyncopeLmpToggle('menopause')\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                      <span class=\"ml-2 font-medium text-slate-800\">หมดประจำเดือน (Menopause) หรือผ่าตัดมดลูกแล้ว</span>\n                    </label>\n                  </div>\n\n                  <!-- ช่องเลือกวันที่ LMP (เปิดเฉพาะเลือก exact_date) -->\n                  <div id=\"syncope_lmp_date_wrap\" class=\"hidden bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2\">\n                    <label class=\"text-xs font-semibold text-slate-700\">ระบุวันแรกของประจำเดือนรอบล่าสุด: <span class=\"text-[10px] text-slate-500 font-normal\">(วว/ดด/ปปปป)</span></label>\n                    <input type=\"text\" id=\"syncopeLmpDate\" data-universal-date=\"true\" placeholder=\"วว/ดด/ปปปป (dd/mm/yyyy)\" autocomplete=\"off\" class=\"bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-medical-500\">\n                  </div>\n\n                  <!-- ช่วงเวลาประมาณ (เปิดเฉพาะเลือก approx) -->\n                  <div id=\"syncope_lmp_approx_wrap\" class=\"hidden bg-white border border-slate-200 rounded-xl p-3.5 space-y-2\">\n                    <label class=\"text-xs font-semibold text-slate-800 block\">ช่วงเวลาที่มีประจำเดือนรอบล่าสุดโดยประมาณ:</label>\n                    <div class=\"grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs\">\n                      <label class=\"selectable-card bg-slate-50 p-2.5 rounded-lg flex items-center cursor-pointer\">\n                        <input type=\"radio\" name=\"syncope_lmp_approx\" value=\"1_week_ago\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                        <span class=\"ml-2 font-medium text-slate-700\">1 สัปดาห์ก่อน</span>\n                      </label>\n                      <label class=\"selectable-card bg-slate-50 p-2.5 rounded-lg flex items-center cursor-pointer\">\n                        <input type=\"radio\" name=\"syncope_lmp_approx\" value=\"2_weeks_ago\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                        <span class=\"ml-2 font-medium text-slate-700\">2 สัปดาห์ก่อน</span>\n                      </label>\n                      <label class=\"selectable-card bg-slate-50 p-2.5 rounded-lg flex items-center cursor-pointer\">\n                        <input type=\"radio\" name=\"syncope_lmp_approx\" value=\"3_4_weeks_ago\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                        <span class=\"ml-2 font-medium text-slate-700\">3-4 สัปดาห์ก่อน</span>\n                      </label>\n                      <label class=\"selectable-card bg-slate-50 p-2.5 rounded-lg flex items-center cursor-pointer\">\n                        <input type=\"radio\" name=\"syncope_lmp_approx\" value=\"1_2_months_ago\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                        <span class=\"ml-2 font-medium text-slate-700\">1-2 เดือนก่อน</span>\n                      </label>\n                      <label class=\"selectable-card bg-slate-50 p-2.5 rounded-lg flex items-center cursor-pointer col-span-2 sm:col-span-1\">\n                        <input type=\"radio\" name=\"syncope_lmp_approx\" value=\"gt_2_months_ago\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                        <span class=\"ml-2 font-medium text-slate-700\">มากกว่า 2 เดือน</span>\n                      </label>\n                    </div>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n\n          <!-- CARD 6: อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"message-square-plus\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-900\"><span id=\"syncopeCard6Num\">6</span>. อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2>\n                <p class=\"text-xs text-slate-500\">ระบุรายละเอียดหรือข้อสังเกตเพิ่มเติมที่ต้องการแจ้งแพทย์ (ถ้ามี)</p>\n              </div>\n            </div>\n            <textarea id=\"syncope_other_free\" rows=\"2\" placeholder=\"พิมพ์ระบุอาการอื่นๆ หรือข้อสังเกตเพิ่มเติม (ถ้ามี)...\"\n              class=\"w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white\"></textarea>\n          </div>\n\n        </div> <!-- END SYNCOPE QUESTIONNAIRE SECTION -->\n\n\n",
  algorithm: {
  "id": "syncope",
  "schemaCode": "syncope",
  "titleTh": "หมดสติ / วูบ / เป็นลม และการคัดกรองภาวะหมดสติชั่วขณะ (Syncope / TLOC Differential)",
  "titleEn": "Syncope / Transient Loss of Consciousness (TLOC) Differential",
  "sections": [
    {
      "sectionNo": 1,
      "titleTh": "ข้อมูลเวลา ท่าทางก่อนเกิดเหตุ ระดับความรู้สึกตัว และความถี่ (Timing, Posture & Consciousness Level)",
      "questions": [
        {
          "key": "duration",
          "labelTh": "มีอาการวูบ/หมดสตินี้เกิดขึ้นมานานเท่าไรแล้ว?",
          "type": "duration_with_unit",
          "units": "UNIVERSAL_DURATION_UNITS"
        },
        {
          "key": "syncopeReporter",
          "labelTh": "ผู้ให้ข้อมูลประวัติเหตุการณ์",
          "type": "single_choice",
          "options": [
            {
              "value": "patient_self",
              "patientTh": "ผู้ป่วยรู้สึกตัวดีและเป็นผู้เล่าเหตุการณ์เอง",
              "doctorTh": "ผู้ป่วยรู้สึกตัวดีและเป็นผู้ให้ข้อมูลเอง (Patient self-report)"
            },
            {
              "value": "witness_relative",
              "patientTh": "ญาติหรือผู้เห็นเหตุการณ์ขณะหมดสติเป็นผู้เล่า",
              "doctorTh": "ญาติหรือผู้เห็นเหตุการณ์ขณะเกิดเหตุเป็นผู้เล่า (Eyewitness report)"
            },
            {
              "value": "both_patient_witness",
              "patientTh": "ผู้ป่วยและผู้เห็นเหตุการณ์ร่วมกันให้ข้อมูล",
              "doctorTh": "ผู้ป่วยและผู้เห็นเหตุการณ์ร่วมกันให้ข้อมูล (Combined report)"
            }
          ]
        },
        {
          "key": "syncopePosture",
          "labelTh": "ท่าทางหรือกิจกรรมที่กำลังทำก่อนเกิดอาการทันที",
          "type": "single_choice",
          "options": [
            {
              "value": "prolonged_standing",
              "patientTh": "ยืนอยู่นาน หรืออยู่ในที่แออัด ร้อนอบอ้าว",
              "doctorTh": "ยืนอยู่นานในที่แออัด/ร้อนอบอ้าว (Prolonged standing - Reflex/Vasovagal trigger)"
            },
            {
              "value": "sudden_standing",
              "patientTh": "เพิ่งเปลี่ยนท่า ลุกขึ้นยืนเร็วๆ จากท่านั่งหรือท่านอน",
              "doctorTh": "เปลี่ยนท่าลุกขึ้นยืนเร็วๆ จากท่านั่งหรือท่านอน (Orthostatic trigger)"
            },
            {
              "value": "during_exertion",
              "patientTh": "เกิดขึ้นขณะกำลังออกแรง ทำงานหนัก หรือออกกำลังกาย",
              "doctorTh": "เกิดขึ้นขณะกำลังออกแรงหรือออกกำลังกาย 🚩 (High-Risk Cardiac trigger)",
              "isRedFlag": true
            },
            {
              "value": "standing_or_walking_normal",
              "patientTh": "ขณะยืนหรือเดินธรรมดา ไม่ได้ออกแรงทำอะไร",
              "doctorTh": "ขณะยืนหรือเดินธรรมดา ไม่ได้ออกแรงทำอะไร (Normal standing/walking)"
            },
            {
              "value": "supine_or_resting",
              "patientTh": "เกิดขึ้นขณะนอนหงาย หรือนั่งพักผ่อนอยู่เฉยๆ",
              "doctorTh": "เกิดขึ้นขณะนอนหงายหรือนั่งพักผ่อนเฉยๆ 🚩 (Cardiac / Seizure trigger)",
              "isRedFlag": true
            },
            {
              "value": "micturition_defecation",
              "patientTh": "เกิดขึ้นขณะหรือทันทีหลังปัสสาวะ ถ่ายอุจจาระ กลืนอาหาร หรือไอแรงๆ",
              "doctorTh": "เกิดขึ้นขณะ/หลังปัสสาวะ ถ่ายอุจจาระ หรือไอแรงๆ (Situational syncope trigger)"
            },
            {
              "value": "neck_movement",
              "patientTh": "เกิดขึ้นขณะหันศีรษะ เงยหน้า หรือสวมเสื้อคอแน่น",
              "doctorTh": "เกิดขึ้นขณะหันศีรษะ เงยหน้า หรือคอเสื้อแน่น (Carotid sinus trigger)"
            },
            {
              "value": "other",
              "patientTh": "อื่นๆ (ระบุข้อความอิสระ)",
              "doctorTh": "กิจกรรมอื่นๆ ก่อนเกิดเหตุ"
            }
          ]
        },
        {
          "key": "syncopeConsciousnessLevel",
          "labelTh": "ระดับความรู้สึกตัวขณะเกิดอาการ (ลักษณะการหมดสติ)",
          "type": "single_choice",
          "options": [
            {
              "value": "true_syncope",
              "patientTh": "หมดสติไปเลยชั่วขณะ (ไม่รู้สึกตัวเลย จำช่วงที่ล้มหรือช่วงที่หมดสติไม่ได้)",
              "doctorTh": "หมดสติไปเลยชั่วขณะ ไม่รู้สึกตัว (True Syncope / Complete TLOC)"
            },
            {
              "value": "near_syncope",
              "patientTh": "เกือบหมดสติ หรือแค่วูบหน้ามืด (รู้สึกเหมือนจะเป็นลม ทรงตัวไม่อยู่ แต่ยังรู้สึกตัวตลอดเวลา จำเหตุการณ์ได้)",
              "doctorTh": "เกือบหมดสติหรือแค่วูบหน้ามืด ยังรู้สึกตัวตลอดเวลา (Near-Syncope / Presyncope)"
            }
          ]
        },
        {
          "key": "syncopeUnconsciousDuration",
          "labelTh": "ระยะเวลาที่หมดสติหรือไม่รู้ตัว (โดยประมาณ)",
          "type": "single_choice",
          "options": [
            {
              "value": "brief_seconds",
              "patientTh": "สั้นมากเพียงไม่กี่วินาที (ประมาณ 10–30 วินาที) แล้วเริ่มรู้สึกตัว",
              "doctorTh": "หมดสติสั้นมากเพียงไม่กี่วินาที (< 30-60 วินาที - Favors Syncope)"
            },
            {
              "value": "typical_minutes",
              "patientTh": "นานประมาณ 1–3 นาที",
              "doctorTh": "หมดสตินานประมาณ 1–3 นาที"
            },
            {
              "value": "prolonged_gte_5m",
              "patientTh": "นานตั้งแต่ 5 นาทีขึ้นไป",
              "doctorTh": "หมดสตินานตั้งแต่ 5 นาทีขึ้นไป 🚩 (Prolonged Coma / Seizure Risk)",
              "isRedFlag": true
            },
            {
              "value": "continuous_unconscious",
              "patientTh": "ยังคงหมดสติต่อเนื่อง ไม่ฟื้นจนถึงโรงพยาบาล",
              "doctorTh": "ยังคงหมดสติต่อเนื่อง ไม่ฟื้นสติจนถึง รพ. 🚩 (Persistent Coma / Emergency)",
              "isRedFlag": true
            }
          ]
        },
        {
          "key": "syncopeEpisodeCount",
          "labelTh": "จำนวนครั้งที่มีอาการวูบ/หมดสติในวันนี้ (รอบ 24 ชั่วโมง)",
          "type": "single_choice",
          "options": [
            {
              "value": "single",
              "patientTh": "เกิดขึ้นเพียงครั้งเดียว",
              "doctorTh": "เกิดเพียงครั้งเดียวในรอบ 24 ชั่วโมง (Single episode)"
            },
            {
              "value": "multiple_cluster",
              "patientTh": "เกิดซ้ำตั้งแต่ 2 ครั้งขึ้นไป",
              "doctorTh": "เกิดซ้ำตั้งแต่ 2 ครั้งขึ้นไปในรอบ 24 ชั่วโมง 🚩 (Recurrent episodes)",
              "isRedFlag": true
            }
          ]
        }
      ]
    },
    {
      "sectionNo": 2,
      "titleTh": "อาการเตือนนำก่อนวูบหมดสติ (Prodrome & Warning Symptoms)",
      "type": "multiple_choice",
      "options": [
        {
          "key": "none_sudden",
          "patientTh": "ไม่มีอาการเตือนใดๆ ล้มลงหรือหมดสติทันทีทันใด",
          "doctorTh": "ไม่มีอาการเตือน ล้มลงหมดสติทันทีทันใด 🚩 (Sudden drop attack - Arrhythmic / Cardiac syncope)",
          "isRedFlag": true
        },
        {
          "key": "lightheaded_tunnel_vision",
          "patientTh": "รู้สึกหน้ามืด วิงเวียน ตาพร่ามัวเห็นภาพมืดลงเรื่อยๆ หรือมีเสียงหูอื้อ",
          "doctorTh": "หน้ามืด วิงเวียน ตาพร่ามัวภาพมืดลง หูอื้อ (Classic Hypoperfusion prodrome)"
        },
        {
          "key": "cold_sweat_pallor_nausea",
          "patientTh": "มีเหงื่อแตกตัวเย็นท่วมตัว หน้าซีด คลื่นไส้ ใจหวิว พะอืดพะอม",
          "doctorTh": "เหงื่อแตกตัวเย็น หน้าซีด คลื่นไส้ ใจหวิว (Autonomic vasovagal prodrome)"
        },
        {
          "key": "sudden_palpitation",
          "patientTh": "รู้สึกใจสั่นรัว หัวใจเต้นสะดุด หรือเต้นเร็วผิดปกติอย่างกะทันหันก่อนวูบ",
          "doctorTh": "ใจสั่นรัว หรือหัวใจเต้นสะดุดผิดปกติกะทันหันก่อนวูบ 🚩 (Arrhythmic Syncope)",
          "isRedFlag": true
        },
        {
          "key": "chest_pain_pressure",
          "patientTh": "มีอาการเจ็บแน่นหน้าอก อึดอัดหน้าอก หรือปวดร้าวไปกราม/สะบักหลัง",
          "doctorTh": "เจ็บแน่นหน้าอก อึดอัดหน้าอก หรือปวดร้าว 🚩 (Suspected ACS / Aortic Dissection / PE)",
          "isRedFlag": true
        },
        {
          "key": "severe_dyspnea",
          "patientTh": "มีอาการหายใจหอบเหนื่อยรุนแรง หายใจไม่อิ่มอย่างกะทันหันก่อนวูบ",
          "doctorTh": "หายใจหอบเหนื่อยรุนแรง หายใจไม่อิ่มกะทันหัน 🚩 (Suspected PE / Acute Heart Failure)",
          "isRedFlag": true
        },
        {
          "key": "thunderclap_headache",
          "patientTh": "ปวดศีรษะรุนแรงอย่างกะทันหันเหมือนศีรษะจะระเบิดก่อนหมดสติ",
          "doctorTh": "ปวดศีรษะรุนแรงเฉียบพลันแบบฟ้าผ่า 🚩 (Thunderclap headache - Suspected SAH)",
          "isRedFlag": true
        },
        {
          "key": "hyperventilation_tingling",
          "patientTh": "มีอาการหายใจหอบเร็วลึก แน่นหน้าอก ชารอบปาก หรือชาตามปลายนิ้วมือ",
          "doctorTh": "หายใจหอบเร็วลึก แน่นหน้าอก ชารอบปากและนิ้วมือ (Hyperventilation / Tetany prodrome)"
        },
        {
          "key": "aura_epigastric_olfactory",
          "patientTh": "รู้สึกจุกแน่นลอยจากช่องท้องขึ้นคอ ได้กลิ่นแปลกประหลาด หรือเห็นแสงวาบ",
          "doctorTh": "จุกแน่นลิ้นปี่ย้อนขึ้นคอ ได้กลิ่นแปลก หรือเห็นแสงวาบ (Epileptic Aura)"
        }
      ]
    },
    {
      "sectionNo": 3,
      "titleTh": "ลักษณะขณะหมดสติจากผู้เห็นเหตุการณ์ (Observations During Event)",
      "questions": [
        {
          "key": "syncopeMotorCategory",
          "labelTh": "ลักษณะการเคลื่อนไหวของร่างกายขณะหมดสติหรือวูบ",
          "type": "single_choice",
          "options": [
            {
              "value": "limp_flaccid",
              "patientTh": "ตัวอ่อนปวกเปียกล้มพับลงกับพื้นทันที โดยไม่มีการเกร็งกระตุก",
              "doctorTh": "ตัวอ่อนปวกเปียกล้มพับลงทันที ไม่มีการเกร็งกระตุก (Flaccid syncopal collapse)"
            },
            {
              "value": "abnormal_movements",
              "patientTh": "มีอาการเกร็ง กระตุก หรือเคลื่อนไหวผิดปกติร่วมด้วย",
              "doctorTh": "มีอาการเกร็ง กระตุก หรือเคลื่อนไหวผิดปกติร่วมด้วย (Abnormal motor activity)"
            }
          ]
        },
        {
          "key": "syncopeMotorSign",
          "labelTh": "ลักษณะการเกร็ง กระตุก หรือการเคลื่อนไหวที่สังเกตได้",
          "type": "single_choice",
          "options": [
            {
              "value": "brief_myoclonic_jerks",
              "patientTh": "ตัวอ่อนล้มลง แต่มีอาการกระตุกเบาๆ สั้นๆ เพียงไม่กี่ครั้ง (สั้นๆ 5–15 วินาที) หลังล้มลง",
              "doctorTh": "มีกระตุกสั้นๆ ไม่กี่ครั้ง 5–15 วินาทีหลังล้มลง (Brief myoclonic twitches - Convulsive Syncope)"
            },
            {
              "value": "generalized_tonic_clonic",
              "patientTh": "ตัวแข็งเกร็งแล้วกระตุกรุนแรงเป็นจังหวะพร้อมกันทั้งตัว ต่อเนื่องเป็นหลักนาที หรือหลายนาที",
              "doctorTh": "เกร็งกระตุกทั้งตัวรุนแรงเป็นจังหวะต่อเนื่องหลายนาที 🚩 (GTCS - Epileptic Seizure)",
              "isRedFlag": true
            },
            {
              "value": "carpopedal_spasm",
              "patientTh": "มือจีบเกร็ง ปลายนิ้วมืองุ้มเข้าหากันทั้งสองข้าง หรือเกร็งปลายเท้างุ้ม",
              "doctorTh": "มือจีบเกร็ง ปลายนิ้วมืองุ้มสองข้าง หรือเกร็งปลายเท้า (Carpopedal spasm / Tetany)"
            },
            {
              "value": "thrashing_closed_eyes",
              "patientTh": "ดิ้นสะบัดไปมา ส่ายศีรษะ ลำตัวแอ่น หรือหลับตาแน่นเกร็งต้านการลืมตา",
              "doctorTh": "ดิ้นสะบัด ส่ายหัว ลำตัวแอ่น หลับตาแน่นต้านการลืมตา (Features suggestive of PPS / PNES)"
            },
            {
              "value": "unknown_unobserved",
              "patientTh": "ไม่ทราบแน่ชัด หรือไม่ได้สังเกต",
              "doctorTh": "ไม่ทราบแน่ชัด หรือไม่ได้สังเกต (Unobserved)"
            }
          ]
        }
      ],
      "associatedSigns": [
        {
          "key": "syncope_marked_pallor_sweat",
          "patientTh": "ใบหน้าซีดเผือด ตัวเย็น มีเหงื่อออกท่วมตัว",
          "doctorTh": "ใบหน้าซีดเผือด ตัวเย็น เหงื่อท่วม (Marked facial pallor, diaphoresis - Vasovagal)"
        },
        {
          "key": "syncope_cyanosis_apnea",
          "patientTh": "ริมฝีปากเขียวคล้ำ ใบหน้าคล้ำ หรือหยุดหายใจชั่วขณะ",
          "doctorTh": "ริมฝีปากเขียวคล้ำ หรือหยุดหายใจชั่วขณะ 🚩 (Cyanosis / Apnea)",
          "isRedFlag": true
        },
        {
          "key": "syncope_lateral_tongue_bite",
          "patientTh": "กัดลิ้นบริเวณด้านข้างจนมีแผลหรือมีเลือดออกในปาก",
          "doctorTh": "กัดลิ้นบริเวณด้านข้างจนมีแผลเลือดออก (Lateral tongue biting - High specificity for Seizure)"
        },
        {
          "key": "syncope_incontinence",
          "patientTh": "มีปัสสาวะราด หรืออุจจาระราดขณะหมดสติ",
          "doctorTh": "ปัสสาวะหรืออุจจาระราดขณะหมดสติ (Incontinence)"
        },
        {
          "key": "syncope_head_facial_injury",
          "patientTh": "ศีรษะหรือใบหน้ากระแทกพื้นอย่างรุนแรง มีบาดแผลแตกหรือฟกช้ำ",
          "doctorTh": "ศีรษะหรือใบหน้ากระแทกพื้น มีบาดแผลแตกหรือฟกช้ำ 🚩 (Significant fall injury)",
          "isRedFlag": true
        },
        {
          "key": "syncope_eyes_open_deviated",
          "patientTh": "ตาค้าง ตาเหลือกขึ้นบน หรือเบนไปข้างใดข้างหนึ่ง",
          "doctorTh": "ตาค้าง ตาเหลือกขึ้นบน หรือเบนข้างใดข้างหนึ่ง (Eye deviation - Seizure feature)"
        }
      ]
    },
    {
      "sectionNo": 4,
      "titleTh": "การฟื้นคืนสติและสภาพหลังเกิดเหตุ (Recovery Pattern & Post-Event Phase)",
      "questions": [
        {
          "key": "syncopeRecoveryPattern",
          "labelTh": "การฟื้นคืนสติหลังจากล้มลงหรือหมดสติ",
          "type": "single_choice",
          "options": [
            {
              "value": "rapid_spontaneous",
              "patientTh": "ฟื้นคืนสติเป็นปกติอย่างรวดเร็ว (ภายใน 1–2 นาที) พูดคุยรู้เรื่องทันที ไม่งง",
              "doctorTh": "ฟื้นคืนสติรวดเร็วภายใน 1–2 นาที พูดคุยรู้เรื่องทันที ไม่งง (Rapid recovery - Classic Syncope)"
            },
            {
              "value": "prolonged_confusion",
              "patientTh": "มีอาการสับสน มึนงง จำอะไรไม่ได้ หลับลึก หรือปลุกตื่นยาก นานเกิน 5–15 นาที",
              "doctorTh": "สับสน มึนงง จำอะไรไม่ได้ หลับลึก ปลุกตื่นยาก นาน > 5–15 นาที 🚩 (Post-ictal confusion / Seizure)",
              "isRedFlag": true
            },
            {
              "value": "persistent_drowsy_coma",
              "patientTh": "ยังคงซึมมาก ปลุกไม่ค่อยตื่น หรือความรู้สึกตัวลดลงต่อเนื่องจนถึง รพ.",
              "doctorTh": "ยังคงซึมมาก ปลุกไม่ค่อยตื่น หรือความรู้สึกตัวลดลงต่อเนื่อง 🚩 (Coma / Persistent Stupor)",
              "isRedFlag": true
            }
          ]
        }
      ],
      "postSymptoms": [
        {
          "key": "post_focal_weakness",
          "patientTh": "มีแขนหรือขาอ่อนแรงครึ่งซีก ปากเบี้ยว หรือพูดไม่ชัดหลังฟื้น",
          "doctorTh": "มีแขนขาอ่อนแรงครึ่งซีก ปากเบี้ยว พูดไม่ชัดหลังฟื้น 🚩 (Todd\\'s paresis / Acute Stroke)",
          "isRedFlag": true
        },
        {
          "key": "post_ongoing_chestpain",
          "patientTh": "ยังคงมีอาการเจ็บแน่นหน้าอก หรือใจสั่นต่อเนื่องหลังฟื้นสติ",
          "doctorTh": "ยังคงมีอาการเจ็บแน่นหน้าอก หรือใจสั่นต่อเนื่องหลังฟื้น 🚩 (Ongoing Cardiac Ischemia / Arrhythmia)",
          "isRedFlag": true
        },
        {
          "key": "post_severe_abdpain_melena",
          "patientTh": "มีอาการปวดท้องรุนแรง ท้องอืด หรือหน้ามืดจะเป็นลมซ้ำเวลานั่งหรือลุกยืน",
          "doctorTh": "ปวดท้องรุนแรง ท้องอืด หรือหน้ามืดซ้ำเวลานั่ง/ยืน 🚩 (Suspected Occult Bleeding / Ruptured AAA / Ectopic)",
          "isRedFlag": true
        },
        {
          "key": "post_diffuse_muscle_pain",
          "patientTh": "มีอาการปวดเมื่อยระบมกล้ามเนื้อทั่วตัวอย่างรุนแรง",
          "doctorTh": "ปวดเมื่อยระบมกล้ามเนื้อทั่วตัวอย่างรุนแรง (Post-convulsive myalgia)"
        },
        {
          "key": "post_severe_headache",
          "patientTh": "มีอาการปวดศีรษะรุนแรงต่อเนื่อง",
          "doctorTh": "มีอาการปวดศีรษะรุนแรงต่อเนื่องหลังฟื้น (Post-event headache)"
        },
        {
          "key": "post_none_asymptomatic",
          "patientTh": "ไม่มีอาการผิดปกติใดๆ หลังฟื้น รู้สึกสบายดีเป็นปกติ",
          "doctorTh": "ไม่มีอาการผิดปกติใดๆ หลังฟื้น รู้สึกสบายดี (Asymptomatic recovery)"
        }
      ]
    },
    {
      "sectionNo": 5,
      "titleTh": "ปัจจัยเสี่ยง สัญญาณเตือนวิกฤต และข้อมูล LMP สตรี (Red Flags, Risks & Female LMP)",
      "riskFactors": [
        {
          "key": "known_heart_disease",
          "patientTh": "มีโรคประจำตัวเกี่ยวกับหัวใจ (เช่น กล้ามเนื้อหัวใจขาดเลือด, หัวใจโต, หัวใจล้มเหลว, ลิ้นหัวใจตีบ, เคยผ่าตัดหัวใจ)",
          "doctorTh": "มีโรคประจำตัวทางหัวใจ (CAD / HFrEF / Severe Valvular Disease / Past MI) 🚩",
          "isRedFlag": true
        },
        {
          "key": "known_arrhythmia_pacemaker",
          "patientTh": "มีประวัติหัวใจเต้นผิดจังหวะ หรือเคยใส่เครื่องกระตุ้นหัวใจ (Pacemaker / ICD)",
          "doctorTh": "ประวัติหัวใจเต้นผิดจังหวะ หรือมีเครื่องกระตุ้นหัวใจ Pacemaker/ICD 🚩",
          "isRedFlag": true
        },
        {
          "key": "family_sudden_death_young",
          "patientTh": "มีคนในครอบครัวสายตรงเสียชีวิตกะทันหันโดยไม่ทราบสาเหตุในวัยหนุ่มสาว (อายุน้อยกว่า 40–50 ปี)",
          "doctorTh": "ประวัติครอบครัวเสียชีวิตกะทันหันอายุน้อย < 50 ปี (Inherited Channelopathy / HCM Risk) 🚩",
          "isRedFlag": true
        },
        {
          "key": "recent_bp_med_adjustment",
          "patientTh": "เพิ่งเริ่มทานยาความดัน ยาขับปัสสาวะ ยาขยายหลอดเลือด หรือเพิ่งมีการปรับเพิ่มขนาดยา",
          "doctorTh": "เพิ่งเริ่มหรือปรับเพิ่มขนาดยาลดความดัน/ยาขับปัสสาวะ/ยาขยายหลอดเลือด (Drug-induced OH)"
        },
        {
          "key": "dehydration_diarrhea",
          "patientTh": "มีอาการท้องเสียรุนแรง อาเจียน ดื่มน้ำน้อย หรือขาดน้ำมาก่อนหน้า",
          "doctorTh": "มีอาการขาดน้ำ ท้องเสียรุนแรง หรืออาเจียนก่อนหน้า (Volume Depletion)"
        },
        {
          "key": "suspected_gi_bleeding",
          "patientTh": "มีอาการถ่ายอุจจาระเป็นสีดำเหมือนยางมะตอย ถ่ายเป็นเลือดสด หรืออาเจียนเป็นเลือด",
          "doctorTh": "มีอาการถ่ายดำ ถ่ายเป็นเลือดสด หรืออาเจียนเป็นเลือด 🚩 (Acute GI Bleeding with Hemorrhagic Presyncope)",
          "isRedFlag": true
        },
        {
          "key": "female_missed_period",
          "patientTh": "• (สำหรับสตรี) มีอาการขาดประจำเดือน หรือสงสัยว่าอาจกำลังตั้งครรภ์",
          "doctorTh": "สตรีวัยเจริญพันธุ์ ขาดประจำเดือน หรือสงสัยตั้งครรภ์ 🚩 (Ruptured Ectopic Pregnancy Risk)",
          "isRedFlag": true
        },
        {
          "key": "known_epilepsy_seizure",
          "patientTh": "มีโรคประจำตัวเป็นโรคลมชัก หรือเคยมีประวัติชักมาก่อน",
          "doctorTh": "มีโรคประจำตัวเป็นโรคลมชัก (Known Epilepsy)"
        },
        {
          "key": "known_diabetes_insulin",
          "patientTh": "มีโรคประจำตัวเป็นเบาหวาน (ทานยาเบาหวานหรือฉีดอินซูลิน)",
          "doctorTh": "เป็นเบาหวานใช้ยาหรืออินซูลิน (Hypoglycemia risk)"
        },
        {
          "key": "none_unremarkable",
          "patientTh": "ไม่มีปัจจัยเสี่ยงหรือประวัติโรคดังกล่าวข้างต้น",
          "doctorTh": "ปฏิเสธโรคประจำตัวหรือปัจจัยเสี่ยงทางหัวใจ"
        }
      ]
    }
  ]
},
  seedPatients: [
  {
    "id": "case-095",
    "queue_number": "A-095",
    "hn": "6709841",
    "name": "นายเกริกเกียรติ สว่างวงศ์",
    "age": 48,
    "gender": "ชาย",
    "chief_complaint": "syncope",
    "chief_complaint_title": "หมดสติ / วูบ / เป็นลม",
    "status": "waiting",
    "timestamp": "2026-10-26T02:11:26.425Z",
    "durationVal": 1,
    "durationUnit": "hours",
    "syncopeReporter": "both_patient_witness",
    "syncopePosture": "during_exertion",
    "syncopePostureOtherText": "",
    "syncopeConsciousnessLevel": "true_syncope",
    "syncopeUnconsciousDuration": "brief_seconds",
    "syncopeDurationGte5mVal": "",
    "syncopeEpisodeCount": "single",
    "syncopeEpisodeCountVal": 1,
    "syncopeProdromes": [
      "sudden_palpitation",
      "chest_pain_pressure"
    ],
    "syncopeMotorCategory": "abnormal_movements",
    "syncopeMotorSign": "brief_myoclonic_jerks",
    "syncopeSigns": [
      "syncope_marked_pallor_sweat",
      "syncope_head_facial_injury"
    ],
    "syncopeRecoveryPattern": "rapid_spontaneous",
    "syncopePostSymptoms": [
      "post_ongoing_chestpain"
    ],
    "syncopeRiskFactors": [
      "known_heart_disease",
      "family_sudden_death_young"
    ],
    "syncope_lmp_status": "",
    "syncopeLmpDate": "",
    "syncope_lmp_approx": "",
    "syncopeOtherNotes": "หมดสติขณะกำลังวิ่งจ็อกกิ้งรอบสวนสาธารณะ มีอาการใจสั่นรัวและแน่นหน้าอกนำ ล้มหน้ากระแทกพื้นมีแผลคิ้วแตก",
    "otherSymptomsFree": "หมดสติขณะกำลังวิ่งจ็อกกิ้งรอบสวนสาธารณะ มีอาการใจสั่นรัวและแน่นหน้าอกนำ ล้มหน้ากระแทกพื้นมีแผลคิ้วแตก",
    "underlying": [
      "โรคหลอดเลือดหัวใจตีบ (CAD s/p PCI 2 ปีก่อน)",
      "ไขมันในเลือดสูง"
    ],
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "Aspirin (81) 1x1 pc, Atorvastatin (40) 1x1 hs, Metoprolol (50) 1/2x2 pc",
    "doctor_notes": {
      "additional_hpi": "ผู้ป่วยชาย 48 ปี ประวัติ CAD เคยทำบอลลูนขยายหลอดเลือด 2 ปีก่อน วันนี้ขณะกำลังวิ่งจ็อกกิ้งได้ประมาณ 15 นาที เกิดอาการใจสั่นรัวผิดปกติกะทันหันร่วมกับแน่นหน้าอกร้าวไปกรามซ้าย จากนั้นหน้ามืดล้มหมดสติไปทันที ภรรยาผู้วิ่งข้างๆ เล่าว่าตัวอ่อนล้มพับลงกับพื้น คิ้วขวากระแทกพื้นแตก มีกระตุกแขนขาสั้นๆ ประมาณ 3-4 ครั้ง นานราว 10 วินาที ไม่มีกัดลิ้น ไม่มีตาเหลือกค้าง หลังจากล้มประมาณ 30-40 วินาที ผู้ป่วยเริ่มฟื้นคืนสติตามปกติ จำเหตุการณ์ตอนล้มไม่ได้ แต่จำช่วงก่อนล้มที่มีใจสั่นแน่นหน้าอกได้ชัดเจน ฟื้นแล้วไม่งง แต่ยังมีอาการแน่นอึดอัดหน้าอกต่อเนื่อง จึงเรียกรถพยาบาลนำส่ง ER",
      "physical_exam": "BT 36.6 C, PR 112/min (irregularly irregular), RR 20/min, BP 98/62 mmHg, SpO2 96% on room air. Neuro: Alert, oriented x 3, pupils 3 mm RTLBE, E4V5M6, motor power grade V all extremities, no facial palsy. Head: 2.5 cm laceration at right eyebrow with active oozing. Heart: Tachycardia, irregular rhythm, normal S1S2, no cardiac murmur, no gallop. Lungs: Clear, no crackles or wheezing. Extremities: Mild pallor, cold clammy extremities, peripheral pulses palpable but rapid.",
      "preliminary_dx": "Exertional Syncope (High-Risk Arrhythmic / Cardiogenic Syncope) with Acute Coronary Syndrome (ACS) / Ventricular Arrhythmia in known CAD, with Facial laceration from fall",
      "plan": "1. Resuscitation area with continuous cardiac telemetry and pulse oximetry.\n2. Immediate 12-lead EKG within 10 min: Showed runs of Non-Sustained Ventricular Tachycardia (NSVT) followed by ST depression in leads V4-V6 and II, III, aVF.\n3. Stat Blood work: High-sensitivity Troponin-I, CBC, BUN/Cr, Electrolytes, Mg, Ca.\n4. Urgent Cardiology Consultation for emergent coronary angiogram / admission to CCU.\n5. Suture wound care for right eyebrow laceration after hemodynamic stabilization."
    }
  },
  {
    "id": "case-096",
    "queue_number": "A-096",
    "hn": "6709952",
    "name": "น.ส.แพรวพรรณ โสภณพิทักษ์",
    "age": 21,
    "gender": "หญิง",
    "chief_complaint": "syncope",
    "chief_complaint_title": "หมดสติ / วูบ / เป็นลม",
    "status": "waiting",
    "timestamp": "2026-10-26T01:56:26.425Z",
    "durationVal": 1,
    "durationUnit": "hours",
    "syncopeReporter": "both_patient_witness",
    "syncopePosture": "prolonged_standing",
    "syncopePostureOtherText": "",
    "syncopeConsciousnessLevel": "true_syncope",
    "syncopeUnconsciousDuration": "brief_seconds",
    "syncopeDurationGte5mVal": "",
    "syncopeEpisodeCount": "single",
    "syncopeEpisodeCountVal": 1,
    "syncopeProdromes": [
      "lightheaded_tunnel_vision",
      "cold_sweat_pallor_nausea"
    ],
    "syncopeMotorCategory": "limp_flaccid",
    "syncopeMotorSign": "",
    "syncopeSigns": [
      "syncope_marked_pallor_sweat"
    ],
    "syncopeRecoveryPattern": "rapid_spontaneous",
    "syncopePostSymptoms": [
      "post_none_asymptomatic"
    ],
    "syncopeRiskFactors": [
      "none_unremarkable"
    ],
    "syncope_lmp_status": "exact_date",
    "syncopeLmpDate": "10/10/2026",
    "syncope_lmp_approx": "",
    "syncopeOtherNotes": "ยืนเข้าแถวเคารพธงชาติกลางแดดนาน ร้อนอบอ้าวมาก เพื่อนช่วยพยุงล้มลง ไม่ศีรษะกระแทก",
    "otherSymptomsFree": "ยืนเข้าแถวเคารพธงชาติกลางแดดนาน ร้อนอบอ้าวมาก เพื่อนช่วยพยุงล้มลง ไม่ศีรษะกระแทก",
    "underlying": ["ปฏิเสธ"],
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "ไม่มี",
    "doctor_notes": {
      "additional_hpi": "นักศึกษาหญิงอายุ 21 ปี ยืนเข้าแถวกลางแจ้งในลานพิธีการมหาวิทยาลัยนานเกือบ 45 นาที สภาพอากาศร้อนอบอ้าว ไม่ได้รับประทานอาหารเช้าและดื่มน้ำน้อย รู้สึกหน้ามืด วิงเวียน ตาพร่ามัวเห็นภาพมืดลงคล้ายมองผ่านอุโมงค์ มีเสียงหูอื้อ เหงื่อแตกตัวเย็นท่วมตัว คลื่นไส้ใจหวิว จากนั้นตัวอ่อนล้มพับลง เพื่อนข้างๆ ช่วยประคองตัวลงนั่งกับพื้น ไม่ได้หมดสติกระแทกพื้น หมดสติไปประมาณ 15-20 วินาที เพื่อนพัดวีและดมแอมโมเนีย รู้สึกตัวตื่นขึ้นมาอย่างรวดเร็ว พูดคุยรู้เรื่องดี จำเหตุการณ์ก่อนวูบได้ครบถ้วน ไม่งง ไม่ง่วงซึม ไม่มีชักเกร็ง ไม่มีกัดลิ้น ไม่มีปัสสาวะราด",
      "physical_exam": "BT 36.8 C, PR 72/min, RR 16/min, BP 106/68 mmHg, SpO2 99% on room air. Orthostatic BP (Supine): 110/70 mmHg, PR 70/min; (Standing 3 min): 104/66 mmHg, PR 76/min (Normal). Neuro: Alert, fully conscious, oriented x 3, pupils 3 mm RTLBE, motor power grade V all. HEENT: No trauma, no tongue bite. Heart: Regular rate and rhythm, normal S1S2, no murmur. Lungs: Clear.",
      "preliminary_dx": "Simple Vasovagal / Reflex Syncope (Neurocardiogenic syncope) secondary to prolonged standing in warm environment and dehydration (Low Risk - San Francisco Rule 0)",
      "plan": "1. Reassurance and patient education on vasovagal triggers and counter-pressure maneuvers (leg crossing, hand gripping).\n2. Oral hydration with electrolyte solution (ORS).\n3. Normal baseline 12-lead EKG: Normal Sinus Rhythm, normal intervals (PR 140 ms, QTc 410 ms).\n4. Safe for discharge home with advice to avoid skipping breakfast and prolonged standing."
    }
  },
  {
    "id": "case-097",
    "queue_number": "A-097",
    "hn": "6710063",
    "name": "นายอัครเดช บวรเกียรติ",
    "age": 33,
    "gender": "ชาย",
    "chief_complaint": "syncope",
    "chief_complaint_title": "หมดสติ / วูบ / เป็นลม",
    "status": "waiting",
    "timestamp": "2026-10-26T01:31:26.425Z",
    "durationVal": 2,
    "durationUnit": "hours",
    "syncopeReporter": "both_patient_witness",
    "syncopePosture": "supine_or_resting",
    "syncopePostureOtherText": "",
    "syncopeConsciousnessLevel": "true_syncope",
    "syncopeUnconsciousDuration": "typical_minutes",
    "syncopeDurationGte5mVal": "",
    "syncopeEpisodeCount": "single",
    "syncopeEpisodeCountVal": 1,
    "syncopeProdromes": [
      "aura_epigastric_olfactory"
    ],
    "syncopeMotorCategory": "abnormal_movements",
    "syncopeMotorSign": "generalized_tonic_clonic",
    "syncopeSigns": [
      "syncope_cyanosis_apnea",
      "syncope_lateral_tongue_bite",
      "syncope_incontinence",
      "syncope_eyes_open_deviated"
    ],
    "syncopeRecoveryPattern": "prolonged_confusion",
    "syncopePostSymptoms": [
      "post_diffuse_muscle_pain",
      "post_severe_headache"
    ],
    "syncopeRiskFactors": [
      "known_epilepsy_seizure"
    ],
    "syncope_lmp_status": "",
    "syncopeLmpDate": "",
    "syncope_lmp_approx": "",
    "syncopeOtherNotes": "หมดสติขณะนั่งพิมพ์งานที่โต๊ะทำงาน เพื่อนร่วมงานเห็นเกร็งกระตุกทั้งตัว ตาเหลือก กัดลิ้นเลือดออก มีปัสสาวะราด ฟื้นแล้วงงมาก",
    "otherSymptomsFree": "หมดสติขณะนั่งพิมพ์งานที่โต๊ะทำงาน เพื่อนร่วมงานเห็นเกร็งกระตุกทั้งตัว ตาเหลือก กัดลิ้นเลือดออก มีปัสสาวะราด ฟื้นแล้วงงมาก",
    "underlying": [
      "โรคลมชัก (Epilepsy - ขาดยา 3 วัน)"
    ],
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "Sodium Valproate (Depakine Chrono 500 mg) 1x2 pc (ขาดยา 3 วันเนื่องจากยาหมด)",
    "doctor_notes": {
      "additional_hpi": "ผู้ป่วยชาย 33 ปี มีโรคประจำตัวโรคลมชัก ทาน Depakine สม่ำเสมอมาตลอด แต่ช่วง 3 วันก่อนงานยุ่งและยาหมดจึงไม่ได้ทานยา วันนี้ขณะนั่งทำงานหน้าคอมพิวเตอร์ เกิดอาการรู้สึกโหวงจุกแน่นในท้องลอยขึ้นคอ และได้กลิ่นเหม็นไหม้ประหลาดในจมูก จากนั้นหมดสติล้มตกจากเก้าอี้ เพื่อนร่วมงานเห็นตัวแข็งเกร็ง ตามด้วยแขนขากระตุกเป็นจังหวะพร้อมกันทั้งตัว ตาเหลือกค้างขึ้นบน ริมฝีปากเขียวคล้ำ หายใจมีเสียงครืดคราด นานประมาณ 2 นาที มีปัสสาวะราดรดกางเกง และมีเลือดออกที่มุมปากด้านซ้ายจากการกัดลิ้น หลังหยุดกระตุกผู้ป่วยหลับลึก ปลุกตื่นยากและสับสนมึนงง จำอะไรไม่ได้นานกว่า 20 นาที มีอาการปวดศีรษะและระบมกล้ามเนื้อทั้งตัว",
      "physical_exam": "BT 37.1 C, PR 88/min, RR 18/min, BP 124/78 mmHg, SpO2 98% on room air, DTX 114 mg/dL. Neuro: Post-ictal drowsiness, slowly oriented to person and place, E4V4M6, pupils 3 mm RTLBE, no focal motor weakness, cranial nerves intact. Oral cavity: 1 cm laceration with fresh blood clot at left lateral tongue border. No signs of meningismus.",
      "preliminary_dx": "Generalized Tonic-Clonic Seizure (TLOC mimic) triggered by Antiepileptic Drug Non-adherence (Missed Valproate doses) with Lateral tongue bite",
      "plan": "1. Maintain airway, suction oral secretions, continuous SpO2 and vital signs monitoring.\n2. Stat Blood: Antiepileptic drug level (Valproic acid level), CBC, Electrolytes, Ca, Mg, BUN/Cr, LFT.\n3. Administer Loading IV Sodium Valproate or resume regular antiepileptic therapy.\n4. Local wound care for lateral tongue laceration.\n5. Counsel patient on absolute compliance with antiepileptic medications and driving precautions."
    }
  },
  {
    "id": "case-098",
    "queue_number": "A-098",
    "hn": "6710174",
    "name": "น.ส.กมลวรรณ ธนสารเจริญ",
    "age": 27,
    "gender": "หญิง",
    "chief_complaint": "syncope",
    "chief_complaint_title": "หมดสติ / วูบ / เป็นลม",
    "status": "waiting",
    "timestamp": "2026-10-26T02:06:26.425Z",
    "durationVal": 2,
    "durationUnit": "hours",
    "syncopeReporter": "both_patient_witness",
    "syncopePosture": "sudden_standing",
    "syncopePostureOtherText": "",
    "syncopeConsciousnessLevel": "true_syncope",
    "syncopeUnconsciousDuration": "brief_seconds",
    "syncopeDurationGte5mVal": "",
    "syncopeEpisodeCount": "single",
    "syncopeEpisodeCountVal": 1,
    "syncopeProdromes": [
      "lightheaded_tunnel_vision",
      "cold_sweat_pallor_nausea"
    ],
    "syncopeMotorCategory": "limp_flaccid",
    "syncopeMotorSign": "",
    "syncopeSigns": [
      "syncope_marked_pallor_sweat"
    ],
    "syncopeRecoveryPattern": "rapid_spontaneous",
    "syncopePostSymptoms": [
      "post_severe_abdpain_melena"
    ],
    "syncopeRiskFactors": [
      "female_missed_period"
    ],
    "syncope_lmp_status": "missed_period",
    "syncopeLmpDate": "",
    "syncope_lmp_approx": "gt_2_months_ago",
    "syncopeOtherNotes": "มีอาการปวดท้องน้อยรุนแรง ปวดร้าวขึ้นสะบักไหล่ขวา ขาดประจำเดือนประมาณ 6 สัปดาห์ ลุกจากเตียงแล้ววูบล้มลง หน้ามืดตลอดเวลานั่ง",
    "otherSymptomsFree": "มีอาการปวดท้องน้อยรุนแรง ปวดร้าวขึ้นสะบักไหล่ขวา ขาดประจำเดือนประมาณ 6 สัปดาห์ ลุกจากเตียงแล้ววูบล้มลง หน้ามืดตลอดเวลานั่ง",
    "underlying": ["ปฏิเสธ"],
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "ไม่มี",
    "doctor_notes": {
      "additional_hpi": "หญิงอายุ 27 ปี ขาดประจำเดือนประมาณ 6 สัปดาห์ (LMP ประมาณ 1 เดือนครึ่งก่อน) ไม่เคยตรวจการตั้งครรภ์ 2 ชั่วโมงก่อนมา รพ. มีอาการปวดบิดเกร็งรุนแรงบริเวณท้องน้อยด้านขวา ปวดร้าวขึ้นสะบักไหล่ข้างขวา จากนั้นลุกขึ้นยืนจะไปห้องน้ำ เกิดอาการหน้ามืด ตาวูบ เหงื่อแตกตัวเย็นและหมดสติล้มพับลงกับพื้นห้องนอน แฟนช่วยประคองขึ้นเตียง หมดสติไปราว 20-30 วินาที ฟื้นสติแล้วรู้สึกหน้ามืดตลอดเวลาเมื่อพยายามลุกขึ้นนั่ง หน้าซีดเผือด ตัวเย็น มีเลือดออกกะปริบกะปรอยทางช่องคลอด จึงเรียกรถกู้ชีพนำส่ง ER",
      "physical_exam": "BT 36.4 C, PR 118/min (tachycardia, thready), RR 22/min, BP 86/52 mmHg (Hypotension / Shock), SpO2 97% on room air. General: Marked pallor, cold clammy extremities, distress from abdominal pain. Abdomen: Distended, severe tenderness and marked guarding with rebound tenderness at right lower quadrant and suprapubic area. Pelvic: Cervical motion tenderness positive, blood in vaginal vault.",
      "preliminary_dx": "Hemorrhagic Shock secondary to Ruptured Ectopic Pregnancy presenting as Syncope / TLOC (Life-threatening Obstetric Emergency)",
      "plan": "1. Immediate Transfer to Resuscitation Area (Code Shock Red).\n2. Two large-bore IV lines (16G/18G), aggressive crystalloid resuscitation (Warm NSS 1,000 mL bolus).\n3. Stat Bedside UPT: Strongly POSITIVE.\n4. Stat Bedside POCUS (FAST Pelvic/Abdominal Exam): Marked free fluid (anechoic) in Morrison pouch, splenorenal recess, and pouch of Douglas, consistent with hemoperitoneum.\n5. Stat Lab: CBC (Hb 7.2 g/dL, Hct 22%), Coagulation, Type & Screen, Emergency Crossmatch 4 units PRC.\n6. Immediate Emergency Obstetric & Gynecologic Consult for emergency exploratory laparoscopy / laparotomy."
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
    setVal('syncopeDurationVal', patient.durationVal || '');
    setVal('syncopeDurationUnit', patient.durationUnit || 'hours');
    setRadioValue('syncopeReporter', patient.syncopeReporter);
    setRadioValue('syncopePosture', patient.syncopePosture);
    if (patient.syncopePosture === 'other') {
      setVal('syncopePostureOtherText', patient.syncopePostureOtherText || '');
      toggleBranch('syncopePostureOtherWrap', true);
    } else {
      toggleBranch('syncopePostureOtherWrap', false);
    }

    setRadioValue('syncopeConsciousnessLevel', patient.syncopeConsciousnessLevel);
    if (patient.syncopeConsciousnessLevel === 'true_syncope') {
      toggleBranch('syncopeUnconsciousDurationWrap', true);
      setRadioValue('syncopeUnconsciousDuration', patient.syncopeUnconsciousDuration);
      if (patient.syncopeUnconsciousDuration === 'prolonged_gte_5m') {
        setVal('syncopeDurationGte5mVal', patient.syncopeDurationGte5mVal || '');
        toggleBranch('syncopeDurationGte5mWrap', true);
      } else {
        toggleBranch('syncopeDurationGte5mWrap', false);
      }
    } else {
      toggleBranch('syncopeUnconsciousDurationWrap', false);
      toggleBranch('syncopeDurationGte5mWrap', false);
    }

    setRadioValue('syncopeEpisodeCount', patient.syncopeEpisodeCount);
    if (patient.syncopeEpisodeCount === 'multiple_cluster') {
      setVal('syncopeEpisodeCountVal', patient.syncopeEpisodeCountVal || '');
      toggleBranch('syncopeEpisodeCountWrap', true);
    } else {
      toggleBranch('syncopeEpisodeCountWrap', false);
    }

    document.querySelectorAll('input[name="syncopeProdromes"]').forEach(cb => cb.checked = false);
    const prodromes = Array.isArray(patient.syncopeProdromes) ? patient.syncopeProdromes : [];
    prodromes.forEach(val => {
      const cb = document.querySelector(`input[name="syncopeProdromes"][value="${val}"]`);
      if (cb) cb.checked = true;
    });

    setRadioValue('syncopeMotorCategory', patient.syncopeMotorCategory);
    if (patient.syncopeMotorCategory === 'abnormal_movements') {
      toggleBranch('syncopeMotorSubWrap', true);
      setRadioValue('syncopeMotorSign', patient.syncopeMotorSign);
    } else {
      toggleBranch('syncopeMotorSubWrap', false);
    }

    document.querySelectorAll('input[name="syncopeSigns"]').forEach(cb => cb.checked = false);
    const signs = Array.isArray(patient.syncopeSigns) ? patient.syncopeSigns : [];
    signs.forEach(val => {
      const cb = document.querySelector(`input[name="syncopeSigns"][value="${val}"]`);
      if (cb) cb.checked = true;
    });

    setRadioValue('syncopeRecoveryPattern', patient.syncopeRecoveryPattern);

    document.querySelectorAll('input[name="syncopePostSymptoms"]').forEach(cb => cb.checked = false);
    const postSx = Array.isArray(patient.syncopePostSymptoms) ? patient.syncopePostSymptoms : [];
    postSx.forEach(val => {
      const cb = document.querySelector(`input[name="syncopePostSymptoms"][value="${val}"]`);
      if (cb) cb.checked = true;
    });

    document.querySelectorAll('input[name="syncopeRiskFactors"]').forEach(cb => cb.checked = false);
    const risks = Array.isArray(patient.syncopeRiskFactors) ? patient.syncopeRiskFactors : [];
    risks.forEach(val => {
      const cb = document.querySelector(`input[name="syncopeRiskFactors"][value="${val}"]`);
      if (cb) cb.checked = true;
    });

    const isFemaleRisk = risks.includes('female_missed_period') || patient.gender === 'หญิง';
    if (risks.includes('female_missed_period')) {
      toggleBranch('syncope_branch_female_lmp', true);
      setRadioValue('syncope_lmp_status', patient.syncope_lmp_status);
      handleSyncopeLmpToggle(patient.syncope_lmp_status);
      setVal('syncopeLmpDate', patient.syncopeLmpDate || '');
      setRadioValue('syncope_lmp_approx', patient.syncope_lmp_approx);
    } else {
      toggleBranch('syncope_branch_female_lmp', false);
    }

    setVal('syncope_other_free', patient.otherSymptomsFree || '');
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
      // ------------------ SYNCOPE & TLOC INTAKE ------------------
      const _rawDur = parseFloat(document.getElementById('syncopeDurationVal')?.value); const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
      const durationUnit = document.getElementById('syncopeDurationUnit')?.value || 'hours';

      const syncopeReporter = document.querySelector('input[name="syncopeReporter"]:checked')?.value || 'unspecified';
      const syncopePosture = document.querySelector('input[name="syncopePosture"]:checked')?.value || 'unspecified';
      const syncopePostureOtherText = syncopePosture === 'other' ? (document.getElementById('syncopePostureOtherText')?.value.trim() || '') : '';

      const syncopeConsciousnessLevel = document.querySelector('input[name="syncopeConsciousnessLevel"]:checked')?.value || 'unspecified';
      const syncopeUnconsciousDuration = syncopeConsciousnessLevel === 'true_syncope'
        ? (document.querySelector('input[name="syncopeUnconsciousDuration"]:checked')?.value || 'unspecified')
        : 'brief_seconds';
      const syncopeDurationGte5mVal = syncopeUnconsciousDuration === 'prolonged_gte_5m'
        ? (parseInt(document.getElementById('syncopeDurationGte5mVal')?.value, 10) || null)
        : null;

      const syncopeEpisodeCount = document.querySelector('input[name="syncopeEpisodeCount"]:checked')?.value || 'unspecified';
      const syncopeEpisodeCountVal = syncopeEpisodeCount === 'multiple_cluster'
        ? (parseInt(document.getElementById('syncopeEpisodeCountVal')?.value, 10) || 2)
        : 1;

      const syncopeProdromes = Array.from(document.querySelectorAll('input[name="syncopeProdromes"]:checked')).map(cb => cb.value);
      const syncopeMotorCategory = document.querySelector('input[name="syncopeMotorCategory"]:checked')?.value || 'unspecified';
      const syncopeMotorSign = syncopeMotorCategory === 'abnormal_movements'
        ? (document.querySelector('input[name="syncopeMotorSign"]:checked')?.value || 'unknown_unobserved')
        : 'limp_flaccid';

      const syncopeSigns = Array.from(document.querySelectorAll('input[name="syncopeSigns"]:checked')).map(cb => cb.value);
      const syncopeRecoveryPattern = document.querySelector('input[name="syncopeRecoveryPattern"]:checked')?.value || 'unspecified';
      const syncopePostSymptoms = Array.from(document.querySelectorAll('input[name="syncopePostSymptoms"]:checked')).map(cb => cb.value);
      const syncopeRiskFactors = Array.from(document.querySelectorAll('input[name="syncopeRiskFactors"]:checked')).map(cb => cb.value);

      const syncope_lmp_status = document.querySelector('input[name="syncope_lmp_status"]:checked')?.value || '';
      const syncopeLmpDate = document.getElementById('syncopeLmpDate')?.value || '';
      const syncope_lmp_approx = document.querySelector('input[name="syncope_lmp_approx"]:checked')?.value || '';
      otherSymptomsFree = document.getElementById('syncope_other_free')?.value.trim() || '';

      newPatient = {
        id: recordId,
        queue_number: queueNumber,
        hn: randomHn,
        name: patientName,
        age: patientAge,
        gender: gender,
        chief_complaint: 'syncope',
        chief_complaint_title: 'หมดสติ / วูบ / เป็นลม',
        status: recordStatus,
        timestamp: new Date().toISOString(),
        durationVal,
        durationUnit,
        syncopeReporter,
        syncopePosture,
        syncopePostureOtherText,
        syncopeConsciousnessLevel,
        syncopeUnconsciousDuration,
        syncopeDurationGte5mVal,
        syncopeEpisodeCount,
        syncopeEpisodeCountVal,
        syncopeProdromes,
        syncopeMotorCategory,
        syncopeMotorSign,
        syncopeSigns,
        syncopeRecoveryPattern,
        syncopePostSymptoms,
        syncopeRiskFactors,
        syncope_lmp_status,
        syncopeLmpDate,
        syncope_lmp_approx,
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
    const prodromes = p.syncopeProdromes || [];
    const signs = p.syncopeSigns || [];
    const postSx = p.syncopePostSymptoms || [];
    const risks = p.syncopeRiskFactors || [];
    return Boolean(
      p.syncopePosture === 'during_exertion' ||
      p.syncopePosture === 'supine_or_resting' ||
      p.syncopeUnconsciousDuration === 'prolonged_gte_5m' ||
      p.syncopeUnconsciousDuration === 'continuous_unconscious' ||
      p.syncopeRecoveryPattern === 'persistent_drowsy_coma' ||
      p.syncopeEpisodeCount === 'multiple_cluster' ||
      prodromes.includes('none_sudden') ||
      prodromes.includes('sudden_palpitation') ||
      prodromes.includes('chest_pain_pressure') ||
      prodromes.includes('severe_dyspnea') ||
      prodromes.includes('thunderclap_headache') ||
      p.syncopeMotorSign === 'generalized_tonic_clonic' ||
      signs.includes('syncope_cyanosis_apnea') ||
      signs.includes('syncope_head_facial_injury') ||
      p.syncopeRecoveryPattern === 'prolonged_confusion' ||
      postSx.includes('post_focal_weakness') ||
      postSx.includes('post_ongoing_chestpain') ||
      postSx.includes('post_severe_abdpain_melena') ||
      risks.includes('known_heart_disease') ||
      risks.includes('known_arrhythmia_pacemaker') ||
      risks.includes('family_sudden_death_young') ||
      risks.includes('suspected_gi_bleeding') ||
      risks.includes('female_missed_period') ||
      p.syncope_lmp_status === 'missed_period' ||
      p.syncope_lmp_status === 'pregnant'
    );
  },

  evaluateRedFlags(patient) {
    const redFlags = [];
    // Syncope & TLOC Red Flags
    const prodromes = patient.syncopeProdromes || [];
    const signs = patient.syncopeSigns || [];
    const postSx = patient.syncopePostSymptoms || [];
    const risks = patient.syncopeRiskFactors || [];

    if (patient.syncopePosture === 'during_exertion') {
      redFlags.push({
        key: 'syncope_exertional',
        textTh: 'หมดสติเกิดขึ้นขณะกำลังออกแรงหรือออกกำลังกาย (Exertional Syncope)',
        risk: 'สงสัย Arrhythmia, HOCM หรือ Severe Aortic Stenosis ต้องตรวจ EKG 12 lead ด่วน ติด Telemetry และงดออกแรงเด็ดขาด'
      });
    }
    if (patient.syncopePosture === 'supine_or_resting') {
      redFlags.push({
        key: 'syncope_supine',
        textTh: 'หมดสติเกิดขึ้นขณะนอนหงายหรือนั่งพักผ่อนเฉยๆ (Supine Syncope)',
        risk: 'บ่งชี้ Cardiac Arrhythmia หรือ Seizure มากกว่า Reflex syncope ต้องตรวจ EKG และ Monitor คลื่นหัวใจ'
      });
    }
    if (prodromes.includes('sudden_palpitation')) {
      redFlags.push({
        key: 'syncope_palpitation',
        textTh: 'มีอาการใจสั่นรัวหรือหัวใจเต้นสะดุดกะทันหันก่อนวูบ (Arrhythmic Syncope)',
        risk: 'เสี่ยง Malignant Ventricular Arrhythmia, Brugada, Long QT หรือ High-grade AV block ต้องตรวจ EKG ด่วนภายใน 10 นาที'
      });
    }
    if (prodromes.includes('none_sudden')) {
      redFlags.push({
        key: 'syncope_no_prodrome',
        textTh: 'หมดสติฉับพลันโดยไม่มีสัญญาณเตือนล่วงหน้า (Sudden Collapse Without Prodrome)',
        risk: 'ลักษณะจำเพาะของ Arrhythmic Syncope หรือ Stokes-Adams attack เสี่ยงต่อภาวะหัวใจหยุดเต้น ต้องตรวจ EKG เร่งด่วน'
      });
    }
    if (prodromes.includes('chest_pain_pressure') || postSx.includes('post_ongoing_chestpain')) {
      redFlags.push({
        key: 'syncope_chest_pain',
        textTh: 'มีอาการเจ็บแน่นหน้าอก อึดอัดหน้าอก หรือปวดร้าว (Cardiogenic Syncope / ACS / Aortic Dissection)',
        risk: 'เสี่ยง Acute Coronary Syndrome, Acute Aortic Dissection หรือ PE ต้องตรวจ EKG, Troponin, CXR และวัดความดัน 2 แขน'
      });
    }
    if (prodromes.includes('severe_dyspnea') || signs.includes('syncope_cyanosis_apnea')) {
      redFlags.push({
        key: 'syncope_dyspnea',
        textTh: 'มีอาการหายใจหอบเหนื่อยรุนแรง หายใจไม่อิ่ม หรือริมฝีปากเขียวคล้ำ (Acute Hypoxia / PE / Heart Failure)',
        risk: 'เสี่ยง Massive Pulmonary Embolism หรือ Acute Heart Failure ต้องตรวจ SpO2, EKG (RV strain), POCUS และ CTA Chest'
      });
    }
    if (prodromes.includes('thunderclap_headache')) {
      redFlags.push({
        key: 'syncope_thunderclap',
        textTh: 'ปวดศีรษะรุนแรงเฉียบพลันแบบฟ้าผ่าก่อนหมดสติ (Thunderclap Headache / SAH)',
        risk: 'เสี่ยง Subarachnoid Hemorrhage (SAH) หรือ Intracranial Hemorrhage ต้องส่ง Urgent Non-contrast CT Brain ทันที'
      });
    }
    if (postSx.includes('post_focal_weakness')) {
      redFlags.push({
        key: 'syncope_focal_neuro',
        textTh: 'มีแขนขาอ่อนแรงครึ่งซีก ปากเบี้ยว หรือพูดไม่ชัดหลังฟื้น (Focal Deficit / Todd\'s Paresis / Stroke)',
        risk: 'ต้องประเมิน Stroke Fast Track, คัดกรอง NIHSS และส่ง Non-contrast CT Brain ด่วน'
      });
    }
    if ((patient.syncopeMotorCategory === 'abnormal_movements' && patient.syncopeMotorSign === 'generalized_tonic_clonic') || patient.syncopeMotorSign === 'generalized_tonic_clonic' || patient.syncopeRecoveryPattern === 'prolonged_confusion') {
      redFlags.push({
        key: 'syncope_epileptic_seizure',
        textTh: 'มีอาการเกร็งกระตุกทั้งตัวรุนแรง หรือสับสนมึนงงหลับลึกนานหลังฟื้น (True Epileptic Seizure / Post-ictal)',
        risk: 'เข้าได้กับ Epileptic Seizure ต้องตรวจ DTX, Electrolytes, Antiepileptic levels และส่งตรวจ CT Brain'
      });
    }
    if (risks.includes('known_heart_disease') || risks.includes('known_arrhythmia_pacemaker')) {
      redFlags.push({
        key: 'syncope_structural_heart',
        textTh: 'มีประวัติโรคหัวใจเดิม/เคยผ่าตัดหัวใจ/ใส่เครื่องกระตุ้นหัวใจ Pacemaker (High-Risk Cardiac Syncope)',
        risk: 'ความเสี่ยงสูงต่อ Sudden Cardiac Death (CSRS High Risk) ต้องตรวจ EKG และพิจารณา Admit Telemetry / CCU'
      });
    }
    if (risks.includes('family_sudden_death_young')) {
      redFlags.push({
        key: 'syncope_family_sudden_death',
        textTh: 'ประวัติครอบครัวเสียชีวิตกะทันหันโดยไม่ทราบสาเหตุในวัยหนุ่มสาว < 50 ปี (Inherited Channelopathy / HCM)',
        risk: 'เสี่ยงต่อ Inherited Arrhythmia syndrome (Brugada, Long QT, ARVD, HCM) ต้องตรวจ EKG ละเอียดและปรึกษาอายุรแพทย์โรคหัวใจ'
      });
    }
    if (risks.includes('female_missed_period') || patient.syncope_lmp_status === 'missed_period' || patient.syncope_lmp_status === 'pregnant' || (patient.gender === 'หญิง' && postSx.includes('post_severe_abdpain_melena'))) {
      redFlags.push({
        key: 'syncope_ectopic_risk',
        textTh: 'สตรีมีอาการขาดประจำเดือน สงสัยตั้งครรภ์ หรือปวดท้องรุนแรงร่วมด้วย (Suspected Ruptured Ectopic Pregnancy)',
        risk: 'เสี่ยงภาวะท้องนอกมดลูกแตก ช็อกจากการเสียเลือดภายใน ต้องส่ง Urine Pregnancy Test ด่วนที่สุดและทำ FAST Ultrasound'
      });
    }
    if (risks.includes('suspected_gi_bleeding')) {
      redFlags.push({
        key: 'syncope_gi_bleeding',
        textTh: 'มีประวัติถ่ายดำ ถ่ายเป็นเลือดสด หรืออาเจียนเป็นเลือด (Acute Gastrointestinal Bleeding)',
        risk: 'เสี่ยงต่อ Hemorrhagic Shock ต้องเปิดเส้น IV เบอร์ใหญ่ 2 เส้น, เจาะ CBC, จองเลือด และปรึกษาแพทย์เฉพาะทาง'
      });
    }
    if (patient.syncopeUnconsciousDuration === 'prolonged_gte_5m' || patient.syncopeUnconsciousDuration === 'continuous_unconscious' || patient.syncopeRecoveryPattern === 'persistent_drowsy_coma') {
      redFlags.push({
        key: 'syncope_prolonged_coma',
        textTh: 'หมดสตินานต่อเนื่องตั้งแต่ 5 นาทีขึ้นไป หรือยังไม่ฟื้นสติจนถึง รพ. (Prolonged Coma / Status Epilepticus)',
        risk: 'ภาวะวิกฤตฉุกเฉิน เสี่ยงสมองขาดออกซิเจนรุนแรง ต้องดูแลทางเดินหายใจ (ABC) ทันทีในห้อง Resuscitation'
      });
    }
    if (signs.includes('syncope_head_facial_injury')) {
      redFlags.push({
        key: 'syncope_head_injury',
        textTh: 'มีบาดเจ็บที่ศีรษะหรือใบหน้าจากการล้มหมดสติ (Head / Facial Injury from Fall)',
        risk: 'เสี่ยง Traumatic Brain Injury / Intracranial Hemorrhage จากการล้มกระแทก ต้องประเมินตาม CCHR / Canadian CT Head Rule'
      });
    }
    if (patient.syncopeEpisodeCount === 'multiple_cluster') {
      redFlags.push({
        key: 'syncope_cluster',
        textTh: `มีอาการวูบ/หมดสติซ้ำหลายครั้งในรอบนี้ (${patient.syncopeEpisodeCountVal || 2} ครั้ง)`,
        risk: 'บ่งชี้ความไม่คงที่ของการไหลเวียนเลือดสมอง หรือ Arrhythmia ต่อเนื่อง ต้องเฝ้าระวังอย่างใกล้ชิด'
      });
    }
    return redFlags;
  },

  updateOutputs(patient) {
    updateSyncopeOutputs(patient);
  },

  generateCds(patient, ctx) {
    const { rfs, ddxList, workupList, managementList } = ctx;
    const sheldon = calculateSheldonScore(patient);
    const hvs = evaluateHyperventilationScreen(patient);
    const prodromes = patient.syncopeProdromes || [];
    const signs = patient.syncopeSigns || [];
    const postSx = patient.syncopePostSymptoms || [];
    const risks = patient.syncopeRiskFactors || [];

    const isEctopic = Boolean(
      risks.includes('female_missed_period') ||
      patient.syncope_lmp_status === 'missed_period' ||
      patient.syncope_lmp_status === 'pregnant' ||
      (patient.gender === 'หญิง' && postSx.includes('post_severe_abdpain_melena')) ||
      rfs.some(r => r.key === 'syncope_ectopic_risk')
    );

    const isCardiacSyncope = Boolean(
      patient.syncopePosture === 'during_exertion' ||
      patient.syncopePosture === 'supine_or_resting' ||
      prodromes.includes('sudden_palpitation') ||
      prodromes.includes('none_sudden') ||
      risks.includes('known_heart_disease') ||
      risks.includes('known_arrhythmia_pacemaker') ||
      risks.includes('family_sudden_death_young') ||
      rfs.some(r => r.key === 'syncope_exertional' || r.key === 'syncope_supine' || r.key === 'syncope_palpitation' || r.key === 'syncope_structural_heart' || r.key === 'syncope_family_sudden_death' || r.key === 'syncope_no_prodrome')
    );

    const isGiBleed = Boolean(
      risks.includes('suspected_gi_bleeding') ||
      postSx.includes('post_severe_abdpain_melena') ||
      rfs.some(r => r.key === 'syncope_gi_bleeding')
    );

    const isAcsOrAorticOrPe = Boolean(
      prodromes.includes('chest_pain_pressure') ||
      prodromes.includes('severe_dyspnea') ||
      postSx.includes('post_ongoing_chestpain') ||
      signs.includes('syncope_cyanosis_apnea') ||
      rfs.some(r => r.key === 'syncope_chest_pain' || r.key === 'syncope_dyspnea')
    );

    const isSahOrNeuro = Boolean(
      prodromes.includes('thunderclap_headache') ||
      postSx.includes('post_focal_weakness') ||
      rfs.some(r => r.key === 'syncope_thunderclap' || r.key === 'syncope_focal_neuro')
    );

    const isSeizureOrProlonged = Boolean(
      sheldon.score >= 1 ||
      (patient.syncopeMotorCategory === 'abnormal_movements' && patient.syncopeMotorSign === 'generalized_tonic_clonic') ||
      patient.syncopeMotorSign === 'generalized_tonic_clonic' ||
      patient.syncopeRecoveryPattern === 'prolonged_confusion' ||
      patient.syncopeRecoveryPattern === 'persistent_drowsy_coma' ||
      patient.syncopeUnconsciousDuration === 'prolonged_gte_5m' ||
      patient.syncopeUnconsciousDuration === 'continuous_unconscious' ||
      rfs.some(r => r.key === 'syncope_epileptic_seizure' || r.key === 'syncope_prolonged_coma')
    );

    if (isEctopic) {
      ddxList.push('1. Ruptured Ectopic Pregnancy with Hemoperitoneum & Hypovolemic Shock 🚩 [OBSTETRIC EMERGENCY]');
      ddxList.push('2. Hemorrhagic Ovarian Cyst Rupture');
      ddxList.push('3. Spontaneous Abortion with Severe Hemorrhage');
      workupList.push('• STAT Bedside Urine Pregnancy Test (UPT) ทันทีทุกรายในสตรีวัยเจริญพันธุ์');
      workupList.push('• STAT Bedside Focused Assessment with Sonography for Trauma (FAST) ดู Free fluid ใน Morison\'s pouch และ Cul-de-sac');
      workupList.push('• STAT Labs: CBC (Hb/Hct), Blood group ABO/Rh, Type & Crossmatch PRBC 2-4 units, Coagulation studies (PT, PTT, INR)');
      managementList.push('• ⚡ Resuscitation: เปิดหลอดเลือดดำเบอร์ใหญ่ (18G) อย่างน้อย 2 เส้น, ให้ IV Normal Saline / Acetar NSS เร่งด่วน');
      managementList.push('• 🛑 แจ้งสูตินรีแพทย์ (OB-GYN) STAT ทันที เพื่อนำผู้ป่วยเข้าห้องผ่าตัดฉุกเฉิน (Emergent Exploratory Laparoscopy/Laparotomy)');
      managementList.push('• ประสานห้องผ่าตัดและเตรียม Packed Red Cells (PRBC) ด่วนที่สุด');
    } else if (isSeizureOrProlonged) {
      ddxList.push(`1. Epileptic Seizure / Convulsive Syncope (Sheldon Score = ${sheldon.score})`);
      ddxList.push('2. Acute Provoked Seizure (Hypoglycemia, Electrolytes, Toxic, Alcohol withdrawal)');
      ddxList.push('3. Non-epileptic Psychogenic Seizure / Pseudosyncope');
      workupList.push('• Bedside DTX ทันที (ตัดภาวะน้ำตาลต่ำ)');
      workupList.push('• CBC, Electrolytes (Na, K, Ca, Mg), BUN, Cr');
      workupList.push('• พิจารณา STAT Non-contrast CT Brain หากมี Head injury, Focal neurological deficit, หรือเป็นชักครั้งแรก');
      managementList.push('• ดูแลทางเดินหายใจ (ABC), นอนตะแคงกึ่งคว่ำ (Recovery position) ป้องกันการสำลัก');
      managementList.push('• หากยังมีอาการชักต่อเนื่องเกิน 5 นาที: ให้ IV Diazepam 10 mg หรือ IV Lorazepam 4 mg ทันที');
    } else if (isCardiacSyncope) {
      ddxList.push('1. High-Risk Cardiac Syncope (Malignant Ventricular Arrhythmia / Sick Sinus / AV Block) 🚩');
      ddxList.push('2. Structural / Obstructive Heart Disease (Severe Aortic Stenosis / HOCM / Cardiac Tamponade)');
      ddxList.push('3. Acute Coronary Syndrome (ACS) with acute conduction failure');
      workupList.push('• STAT 12-lead EKG ภายใน 10 นาทีแรกที่มาถึง รพ. (มองหา Ischemia, Arrhythmia, Brugada, Long QT, WPW, Delta wave)');
      workupList.push('• Continuous Cardiac Monitor / Telemetry ตลอดเวลา');
      workupList.push('• STAT Labs: High-sensitivity Troponin-T, Electrolytes (K, Mg, Ca), CBC, BUN, Cr');
      workupList.push('• Bedside Echocardiography (POCUS): ประเมิน LV function, Wall motion abnormality, Pericardial effusion และ Aortic valve lesion');
      managementList.push('• ให้นอนพักบนเตียงราบเด็ดขาด (Strict Bed Rest) ห้ามลุกเดินหรือเปลี่ยนท่าเอง');
      managementList.push('• เตรียมเครื่อง Defibrillator / External Pacer ไว้ข้างเตียงเสมอ');
      managementList.push('• ปรึกษาอายุรแพทย์โรคหัวใจ (Cardiology) พิจารณารับไว้รักษาใน CCU / Telemetry Unit ตาม ESC 2018 / CSRS High-Risk criteria');
    } else if (isGiBleed) {
      ddxList.push('1. Acute Upper Gastrointestinal Bleeding with Hemorrhagic Shock (Bleeding Peptic Ulcer / Ruptured Varices) 🚩');
      ddxList.push('2. Acute Lower Gastrointestinal Bleeding with severe hypovolemia');
      ddxList.push('3. Occult Internal Bleeding / Ruptured Abdominal Aortic Aneurysm (AAA)');
      workupList.push('• Bedside DTX, Vital Signs (เช็ค Orthostatic Hypotension หากสัญญาณชีพคงที่)');
      workupList.push('• STAT Labs: CBC (Hct), BUN/Cr (BUN:Cr ratio > 20:1 ชี้ Upper GI bleed), PT/INR, PTT, Electrolytes, Type & Screen');
      workupList.push('• ใส่สาย NG Tube เพื่อประเมิน Active gastric bleeding');
      managementList.push('• เปิดเส้น IV เบอร์ใหญ่ 18G 2 ข้าง ให้ IV Crystalloid resuscitation ทันที');
      managementList.push('• ให้ IV Proton Pump Inhibitor (Pantoprazole 80 mg IV bolus ต่อด้วย continuous infusion 8 mg/hr)');
      managementList.push('• จองเลือด PRC ด่วน และปรึกษาอายุรแพทย์โรคระบบทางเดินอาหารหรือศัลยแพทย์เพื่อเตรียม Urgent Endoscopy (EGD)');
    } else if (isAcsOrAorticOrPe) {
      ddxList.push('1. Acute Coronary Syndrome (STEMI / NSTEMI) with Cardiogenic Syncope 🚩');
      ddxList.push('2. Acute Aortic Dissection with Hemopericardium / Malperfusion');
      ddxList.push('3. Massive Pulmonary Embolism (PE) with acute right ventricular strain');
      workupList.push('• STAT 12-lead EKG ทันที, วัด SpO2, วัดความดันโลหิต 2 ข้าง (Bilateral BP comparison)');
      workupList.push('• STAT Troponin-T, D-dimer (หากสงสัย PE), CXR upright/portable');
      workupList.push('• Bedside POCUS: ประเมิน RV dilation (McConnell\'s sign) และ Aortic root dilation');
      workupList.push('• พิจารณา Urgent CTA Chest / CTPA ตามข้อบ่งชี้ทางคลินิก');
      managementList.push('• ให้ออกซิเจน Supplemental O2, เปิดหลอดเลือดดำ IV');
      managementList.push('• หากเข้าได้กับ STEMI: ปรึกษา Fast Track Primary PCI ทันที');
      managementList.push('• 🛑 ระวัง: ห้ามให้ Heparin/Antiplatelet หากยังไม่สามารถตัดภาวะ Aortic Dissection ได้');
    } else if (isSahOrNeuro) {
      ddxList.push('1. Acute Subarachnoid Hemorrhage (SAH) / Ruptured Cerebral Aneurysm 🚩');
      ddxList.push('2. Acute Intracerebral Hemorrhage (ICH) / Basilar Artery Occlusion');
      ddxList.push('3. Todd\'s Paresis following unrecognized focal epileptic seizure');
      workupList.push('• STAT Non-contrast CT Brain ทันที');
      workupList.push('• ประเมิน Glasgow Coma Scale (GCS), Pupil size & light reflex, Motor power');
      workupList.push('• หากผล CT ปกติแต่สงสัย SAH ชัดเจน: พิจารณาทำ Lumbar Puncture (LP) หลังเกิดอาการ > 6 ชม.');
      managementList.push('• ควบคุมความดันโลหิต (SBP < 140-160 mmHg ด้วย IV Nicardipine)');
      managementList.push('• ปรึกษาประสาทศัลยแพทย์ (Neurosurgery) หรือแพทย์ระบบประสาท (Neurology) ทันที');
    } else if (hvs.isSuspected) {
      ddxList.push('1. Acute Hyperventilation Syndrome (HVS) with Presyncope / Carpopedal Spasm');
      ddxList.push('2. Panic Disorder with Acute Panic Attack');
      ddxList.push('3. Hypocalcemia / Respiratory Alkalosis');
      workupList.push('• Vital Signs, SpO2, Venous Blood Gas (ประเมิน pH, pCO2, HCO3)');
      workupList.push('• ตรวจ Ionized Calcium, Electrolytes, 12-lead EKG');
      managementList.push('• การสื่อสารปลอบประโลมสร้างความมั่นใจ (Reassurance) ในสภาพแวดล้อมที่สงบ');
      managementList.push('• แนะนำเทคนิคฝึกการหายใจช้าๆ (Coached breathing: สูดทางจมูก 4 วินาที ผ่อนทางปาก 6 วินาที)');
      managementList.push('• 🛑 ห้ามใช้ถุงกระดาษครอบปาก-จมูกเด็ดขาด');
    } else {
      // Benign Reflex / Vasovagal Syncope / Orthostatic Hypotension
      ddxList.push(`1. Reflex / Vasovagal Syncope (Neurocardiogenic Syncope — Sheldon Score = ${sheldon.score})`);
      ddxList.push('2. Orthostatic Hypotension (Volume Depletion / Autonomic / Drug-induced)');
      ddxList.push('3. Situational Syncope (Micturition / Cough / Defecation)');
      workupList.push('• 12-lead EKG ทุกรายเพื่อตัดภาวะ Arrhythmia แฝง (Standard recommendation)');
      workupList.push('• ตรวจ Orthostatic Vital Signs (วัดความดันโลหิตและชีพจร ท่านอน และหลังยืน 1 และ 3 นาที — ค่า SBP ลดลง ≥ 20 หรือ DBP ลดลง ≥ 10 บ่งชี้ Orthostatic Hypotension)');
      workupList.push('• DTX, CBC, Electrolytes หากสงสัยภาวะขาดน้ำหรือซีด');
      managementList.push('• จัดให้นอนราบและยกขาสูง (Trendelenburg position) ช่วยให้เลือดไหลเวียนกลับสู่สมอง');
      managementList.push('• แนะนำการดื่มน้ำทดแทนให้เพียงพอ (2-3 ลิตรต่อวันหากไม่มีข้อห้ามเรื่องโรคไต/หัวใจ)');
      managementList.push('• สอนเทคนิคบริหารกล้ามเนื้อเพิ่มความดันโลหิต (Physical Counterpressure Maneuvers: ยืนไขว้ขาเกร็งกล้ามเนื้อสะโพกและต้นขา, กำหมัดแน่น 2 ข้าง เมื่อเริ่มรู้สึกหน้ามืด)');
      managementList.push('• แนะนำให้หลีกเลี่ยงปัจจัยกระตุ้น: การยืนนานในที่ร้อนจัด, การเปลี่ยนท่าลุกขึ้นเร็วๆ, และการอดน้ำอดอาหาร');
    }
  }
});
