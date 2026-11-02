// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 03_dyspnea.js
// อาการนำ: เหนื่อย / หายใจหอบเหนื่อย / หายใจลำบาก (Shortness of breath / Dyspnea)
// ไฟล์นี้แยกอิสระสำหรับอาการนำ dyspnea เพื่อให้ทีมแพทย์และ IT โรงพยาบาลนำไปพัฒนาต่อได้โดยไม่กระทบระบบหลัก
// =========================================================================

function handleDyspneaPosNone(checked) {
  if (checked) {
    const orthopnea = document.getElementById('dyspnea_pos_orthopnea');
    const pnd = document.getElementById('dyspnea_pos_pnd');
    const trepopnea = document.getElementById('dyspnea_pos_trepopnea');
    if (orthopnea) orthopnea.checked = false;
    if (pnd) pnd.checked = false;
    if (trepopnea) trepopnea.checked = false;
    toggleBranch('dyspnea_orthopnea_wrap', false);
  }
}

function handleDyspneaPosOther(posEl) {
  if (posEl && posEl.checked) {
    const noneEl = document.getElementById('dyspnea_pos_none');
    if (noneEl) noneEl.checked = false;
  }
}

function handleAsthmaCopdToggle() {
  const isAsthma = document.getElementById('ud_asthma')?.checked || false;
  const isCopd = document.getElementById('ud_copd')?.checked || false;
  toggleBranch('ud_inhaler_detail_wrap', isAsthma || isCopd);
}

function updateDyspneaOutputs(patient) {
      const unitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
      const durationText = patient.durationVal ? `${patient.durationVal} ${unitMap[patient.durationUnit] || 'ชั่วโมง'}` : 'ไม่ระบุ';

      const onsetMap = {
        sudden: 'เริ่มหอบเหนื่อยรุนแรงฉับพลันทันที (Sudden onset)',
        gradual: 'ค่อยๆ หอบเหนื่อยมากขึ้นเรื่อยๆ (Gradual worsening)',
        chronic: 'มีอาการหอบเหนื่อยเรื้อรัง เป็นๆ หายๆ มานาน (Chronic/Recurrent dyspnea)',
        unspecified: 'ไม่ได้ระบุรูปแบบการเริ่ม'
      };

      const severityMap = {
        mild_exertion: 'เหนื่อยเฉพาะเวลาออกแรงหนัก/วิ่ง/ขึ้นบันไดหลายชั้น (Exertional - Mild)',
        moderate_walking: 'เหนื่อยเวลาทำกิจวัตรประจำวัน เช่น เดินพื้นราบ อาบน้ำ แต่งตัว (Moderate)',
        at_rest: 'เหนื่อยแม้ขณะนั่งพักหรือนอนเฉยๆ (Dyspnea at rest - Severe)',
        speaks_in_words: 'เหนื่อยหอบรุนแรงจนพูดได้เป็นคำๆ ไม่เป็นประโยค (Too breathless to speak - Critical 🚩)',
        unspecified: 'ไม่ระบุ'
      };

      const pillowsMap = {
        '1_pillow': '1 ใบ',
        '2_pillows': '2 ใบ',
        '3_or_more': '3 ใบขึ้นไป หรือต้องนั่งฟุบหลับ',
        'sitting_up': 'ต้องนั่งหลับ',
        'none': 'ไม่ระบุ'
      };

      const positives = [];
      const negatives = [];

      // 1. Core Profile & Positional triggers (Primary descriptors stay in top HPI; not pushed to positives)
      const posTriggers = [];
      if (patient.dyspnea_pos_orthopnea) {
        posTriggers.push(`นอนราบไม่ได้ ต้องหนุนหมอนสูง ${pillowsMap[patient.dyspneaOrthopneaPillows] || ''} (Orthopnea)`);
      }
      if (patient.dyspnea_pos_pnd) {
        posTriggers.push('สะดุ้งตื่นขึ้นมาหอบเหนื่อยกลางดึก ต้องลุกขึ้นมานั่ง (PND)');
      }
      if (patient.dyspnea_pos_trepopnea) {
        posTriggers.push('เหนื่อยมากขึ้นเวลานอนตะแคงข้างใดข้างหนึ่ง (Trepopnea)');
      }

      // 2. Breathing Characteristics
      const breathChars = [];
      if (patient.dyspnea_char_wheezing) breathChars.push('หายใจมีเสียงวี้ด (Wheezing)');
      if (patient.dyspnea_char_stridor) breathChars.push('หายใจมีเสียงฮืด Stridor (ทางเดินหายใจส่วนบนอุดกั้น 🚩)');
      if (patient.dyspnea_char_air_hunger) breathChars.push('หายใจไม่อิ่ม');
      if (patient.dyspnea_char_tachypnea) breathChars.push('หายใจเร็วถี่ (Tachypnea)');
      if (patient.dyspnea_char_accessory_muscle) breathChars.push('ต้องออกแรงใช้กล้ามเนื้อคอ/หน้าอกช่วยหายใจ (Accessory muscle use 🚩)');
      if (patient.dyspnea_char_chest_tightness) breathChars.push('หายใจขัด หรือแน่นอึดอัดภายในทรวงอก');
      if (patient.dyspnea_char_other) breathChars.push(`อื่นๆ: ${patient.dyspnea_char_other}`);

      // 3. Associated Symptoms
      // Embedded Red Flags
      if (patient.dyspnea_rf_cyanosis) positives.push('ริมฝีปาก เล็บ หรือปลายมือปลายเท้าเขียวคล้ำ (Cyanosis 🚩)');
      else negatives.push('ไม่มีริมฝีปากหรือปลายมือปลายเท้าเขียว');

      if (patient.dyspnea_rf_syncope_shock) positives.push('มีอาการเหงื่อแตกตัวเย็น หน้ามืด วูบ หรือหมดสติ (Shock/Syncope 🚩)');
      else negatives.push('ไม่มีอาการวูบ หน้ามืด หรือเหงื่อแตกตัวเย็น');

      if (patient.dyspnea_rf_altered_mental) positives.push('มีอาการซึมลง สับสน ไม่ค่อยรู้ตัว หรือหลับปลุกตื่นยาก (Altered mental status 🚩)');
      else negatives.push('ผู้ป่วยรู้สึกตัวดี พูดคุยรู้เรื่อง');

      if (patient.dyspnea_rf_hemoptysis) positives.push('มีอาการไอเป็นเลือดสด (Hemoptysis 🚩)');
      else negatives.push('ไม่มีไอเป็นเลือด');

      // Respiratory (Fever, Cough, Sputum, Pleuritic)
      if (patient.dyspnea_has_fever) positives.push('มีไข้หรือหนาวสั่น');
      else negatives.push('ไม่มีไข้');

      if (patient.dyspnea_has_cough) {
        const sputumMap = {
          clear: 'สีใส / สีขาว',
          white_clear: 'สีใส / สีขาว',
          yellow_green: 'สีเหลืองหรือเขียว (Purulent)',
          pink_frothy: 'สีชมพูเป็นฟอง (Pink frothy sputum - Pulmonary Edema 🚩)',
          rust: 'สีสนิมเหล็กหรือน้ำตาล',
          rust_brown: 'สีสนิมเหล็กหรือน้ำตาล',
          blood_tinged: 'มีเลือดปนเสมหะ 🚩'
        };
        const cDesc = patient.dyspneaCoughType === 'productive' ? `ไอมีเสมหะ [ลักษณะ: ${sputumMap[patient.dyspneaSputumColor] || patient.dyspneaSputumColor}]` : 'ไอแห้งๆ';
        positives.push(`มีอาการไอ (${cDesc})`);
      } else {
        negatives.push('ไม่มีอาการไอ');
      }

      if (patient.dyspnea_has_pleuritic) positives.push('เจ็บแปล๊บหน้าอกเวลาหายใจเข้าลึกหรือเวลาไอ (Pleuritic chest pain)');
      else negatives.push('ไม่มีอาการเจ็บแปล๊บเวลาหายใจลึก');

      // Cardiac (Chest Pain, Palpitations)
      if (patient.dyspnea_rf_chestpain) {
        const cpDetails = [];
        if (patient.dyspnea_cp_crushing) cpDetails.push('แน่นเหมือนของหนักทับ');
        if (patient.dyspnea_cp_rad_arm) cpDetails.push('ร้าวไปกราม คอ ไหล่ซ้าย');
        if (patient.dyspnea_cp_gt_20m) cpDetails.push('แน่นนานเกิน 20 นาที');
        positives.push(`มีอาการเจ็บแน่นหน้าอกร่วมด้วย [${cpDetails.join(', ') || 'เจ็บแน่นหน้าอก'}] 🚩`);
      } else {
        negatives.push('ไม่มีอาการเจ็บแน่นหน้าอก');
      }

      if (patient.dyspnea_has_palpitation) positives.push('มีอาการใจสั่น หัวใจเต้นเร็วผิดปกติ (Palpitations)');
      else negatives.push('ไม่มีอาการใจสั่น');

      // Leg swelling / DVT / Travel
      if (patient.dyspnea_has_leg_swelling) {
        const legText = patient.dyspneaLegType === 'unilateral' ? 'ขาบวมข้างเดียว หรือปวดน่องข้างเดียว (สงสัย DVT 🚩)' : 'ขาบวมทั้งสองข้าง (Bilateral leg edema)';
        const wtText = patient.dyspnea_weight_gain ? ' และมีน้ำหนักตัวเพิ่มขึ้นรวดเร็ว' : '';
        positives.push(`มีอาการ${legText}${wtText}`);
      } else {
        negatives.push('ไม่มีอาการขาบวมหรือปวดน่อง');
      }

      if (patient.dyspnea_pe_travel_bedridden) positives.push('ประวัตินั่งเดินทางไกล > 4 ชม. หรือนอนติดเตียง/เข้าเฝือกขาช่วงที่ผ่านมา');
      else negatives.push('ปฏิเสธประวัตินั่งทางไกลหรือนอนติดเตียง');

      // Allergy / Anaphylaxis
      if (patient.dyspnea_has_allergy) {
        const algDetails = [];
        if (patient.dyspnea_allergy_exp_food_med) algDetails.push('เพิ่งรับประทานอาหารแปลกใหม่หรือทานยาใหม่ใน 1-2 ชม.');
        if (patient.dyspnea_allergy_exp_insect) algDetails.push('ถูกแมลงสัตว์กัดต่อย');
        positives.push(`มีประวัติสงสัยภูมิแพ้รุนแรง (ผื่นลมพิษ/ตาบวม/ปากบวม) [${algDetails.join(', ') || 'ไม่ระบุสิ่งกระตุ้น'}] 🚩`);
      } else {
        negatives.push('ไม่มีผื่นลมพิษหรืออาการแพ้ยา/อาหาร');
      }

      // Other systems (Metabolic DKA vs Renal CKD vs Hyperventilation)
      if (patient.dyspnea_metabolic_dka) positives.push('มีอาการหิวน้ำบ่อย ปัสสาวะบ่อย ปากแห้ง (สงสัยภาวะน้ำตาลในเลือดสูง/เลือดเป็นกรด DKA)');
      if (patient.dyspnea_metabolic_ckd) positives.push('มีประวัติไตวาย หรือขาดฟอกเลือด / ปัสสาวะออกน้อยลงมาก');
      if (patient.dyspnea_hypervent_tingling) positives.push('มีอาการชาปลายมือปลายเท้า มือเกร็งจีบ หรือตกใจกังวลใจมาก');

      if (patient.otherSymptomsFree) {
        positives.push(`อาการเพิ่มเติมที่ผู้ป่วยระบุ: "${patient.otherSymptomsFree}"`);
      }

      patient.pertinentPositives = positives.length > 0 ? positives : ['ไม่มีอาการร่วมผิดปกติ'];
      patient.pertinentNegatives = negatives;

      // Inhaler details summary
      let inhalerSummary = 'ไม่มีการใช้ยาพ่นขยายหลอดลม';
      const isAsthmaCopd = patient.underlying?.some(u => u.includes('หอบหืด') || u.includes('Asthma') || u.includes('ถุงลมโป่งพอง') || u.includes('COPD'));
      if (isAsthmaCopd) {
        const freqMap = { none: 'ยังไม่ได้พ่นยา', '1_to_2_times': 'พ่นยาไป 1-2 ครั้ง', gte_3_times: 'พ่นยาไปแล้ว ≥ 3 ครั้ง (บ่อยผิดปกติ 🚩)' };
        const reliefMap = { good: 'พ่นแล้วทุเลาลงชัดเจน', partial: 'พ่นแล้วดีขึ้นเล็กน้อย/แป๊บเดียว', poor: 'พ่นแล้วไม่ดีขึ้นเลย / เหนื่อยมากขึ้น (Refractory 🚩)', unspecified: 'ไม่ระบุ' };
        inhalerSummary = `การใช้ยาพ่นฉุกเฉินใน 24 ชม.: ${freqMap[patient.ud_inhaler_freq] || 'ไม่ระบุ'}, ผลการพ่น: ${reliefMap[patient.ud_inhaler_relief] || 'ไม่ระบุ'}, ประวัติเคยนอน ICU/ใส่ท่อช่วยหายใจ: ${patient.ud_inhaler_prior_icu === 'yes' ? 'เคยมีประวัติ (High risk 🚩)' : 'ไม่เคย'}`;
      }

      const hospLabel = {
        complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
        additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
        self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
        unspecified: 'ไม่ได้ระบุ'
      }[patient.hospRecordStatus] || 'ไม่ได้ระบุ';

      const docNotes = patient.doctor_notes || {};
      const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ' || patient.currentMeds === 'ไม่มี') ? 'ไม่มี' : patient.currentMeds;

      // A) Rapid Bullet Format for Dyspnea
      const defaultRapid = 
`[Chief Complaint (CC)]
เหนื่อย / หายใจหอบเหนื่อยมา ${durationText}

[History of Present Illness (HPI)]
• การเริ่มต้นและระยะเวลา: ${durationText}, ${onsetMap[patient.dyspneaOnsetMode] || 'ไม่ระบุ'}
• ระดับความรุนแรง: ${severityMap[patient.dyspneaSeverity] || 'ไม่ระบุ'}
• อาการเหนื่อยสัมพันธ์กับท่านอน: ${posTriggers.length > 0 ? posTriggers.join(', ') : 'ปฏิเสธ (นอนราบได้ปกติ)'}
• ลักษณะเสียงหายใจ: ${breathChars.length > 0 ? breathChars.join(', ') : 'ไม่มีเสียงหวีดหรือฮืดผิดปกติ'}

• Pertinent Positives:
${positives.length > 0 ? positives.map(p => `  - ${p}`).join('\n') : '  - ไม่มีอาการร่วมอื่นที่เด่นชัด'}

• Pertinent Negatives:
${negatives.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• ประวัติการใช้ยาพ่นฉุกเฉิน (Inhaler): ${inhalerSummary}
• โรคประจำตัว (U/D): ${patient.underlying?.length > 0 ? patient.underlying.join(', ') : 'ปฏิเสธ'}
• ยาประจำตัว (Current Meds): ${medsText}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${patient.drugAllergy || 'ปฏิเสธ'}

[Emergency Risk Assessment (Red Flags)]
${patient.redFlags?.length > 0
  ? `🚩 RED FLAGS DETECTED:\n${patient.redFlags.map(rf => `  * ${rf.textTh}`).join('\n')}`
  : '✓ ไม่พบสัญญาณวิกฤต (No Immediate Red Flag)'}

[Doctor's Clinical Addendum & Exam]
• ประวัติเพิ่มเติม/แก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}
• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}
• แผนการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

      // B) Narrative Paragraph Format for Dyspnea
      const defaultNarrative = 
`ผู้ป่วย [${patient.name}] อายุ ${patient.age || '-'} ปี เพศ ${patient.gender || 'ไม่ระบุ'} มารับการตรวจที่ห้องฉุกเฉิน รพ.ราชบุรี ด้วยอาการเหนื่อย / หายใจหอบเหนื่อยมา ${durationText}
การเริ่มมีอาการ: ${onsetMap[patient.dyspneaOnsetMode] || 'ไม่ระบุ'} ระดับความรุนแรงของอาการเหนื่อย: ${severityMap[patient.dyspneaSeverity] || 'ไม่ระบุ'} ${posTriggers.length > 0 ? `สัมพันธ์กับท่านอนคือ ${posTriggers.join(', ')}` : 'ไม่มีอาการเหนื่อยสัมพันธ์กับท่านอน (นอนราบได้ปกติ)'} ลักษณะการหายใจ: ${breathChars.length > 0 ? breathChars.join(', ') : 'ไม่มีเสียงหวีดหรือฮืดผิดปกติ'}

อาการร่วมและการซักประวัติตามระบบ: ผู้ป่วยให้ประวัติ ${positives.join(', ')}
อาการสำคัญที่ปฏิเสธ (Pertinent negatives): ${negatives.join(', ')}

ประวัติการเจ็บป่วยในอดีต: [${hospLabel}], ข้อมูลการใช้ยาพ่นขยายหลอดลม: ${inhalerSummary}, โรคประจำตัว: ${patient.underlying?.length > 0 ? patient.underlying.join(', ') : 'ปฏิเสธ'}, ยาประจำตัว: ${medsText}, ประวัติแพ้ยา/แพ้อาหาร: ${patient.drugAllergy || 'ปฏิเสธประวัติแพ้ยา/แพ้อาหาร'}
${patient.redFlags?.length > 0 ? `\n[🚩 แจ้งเตือนสัญญาณวิกฤต (Red Flags)]: ตรวจพบอาการ ${patient.redFlags.map(rf => rf.textTh).join(', ')}` : ''}

[บันทึกการตรวจและการประเมินโดยแพทย์]:
${docNotes.additional_hpi ? `• ประวัติเพิ่มเติม: ${docNotes.additional_hpi}\n` : ''}${docNotes.physical_exam ? `• การตรวจร่างกาย: ${docNotes.physical_exam}\n` : ''}${docNotes.preliminary_dx ? `• การวินิจฉัย: ${docNotes.preliminary_dx}\n` : ''}${docNotes.plan ? `• แผนการรักษา: ${docNotes.plan}` : ''}`;

      document.getElementById('rapidTextView').value = patient.custom_rapid_note || defaultRapid;
      document.getElementById('narrativeTextView').value = patient.custom_narrative_note || defaultNarrative;

      // C) JSON Payload for Dyspnea
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
        "chief_complaint": "dyspnea",
        "dyspnea_history": {
          "duration_value": patient.durationVal || null,
          "duration_unit": patient.durationUnit || null,
          "onset_mode": patient.dyspneaOnsetMode,
          "severity": patient.dyspneaSeverity,
          "positional_triggers": {
            "orthopnea": {
              "present": patient.dyspnea_pos_orthopnea,
              "pillow_count": patient.dyspneaOrthopneaPillows
            },
            "paroxysmal_nocturnal_dyspnea": patient.dyspnea_pos_pnd,
            "trepopnea": patient.dyspnea_pos_trepopnea,
            "none": patient.dyspnea_pos_none
          },
          "breathing_characteristics": {
            "wheezing": patient.dyspnea_char_wheezing,
            "stridor": patient.dyspnea_char_stridor,
            "air_hunger": patient.dyspnea_char_air_hunger,
            "tachypnea": patient.dyspnea_char_tachypnea,
            "accessory_muscle_use": patient.dyspnea_char_accessory_muscle,
            "chest_tightness": patient.dyspnea_char_chest_tightness,
            "other": patient.dyspnea_char_other
          }
        },
        "associated_symptoms_and_review_of_systems": {
          "cyanosis": patient.dyspnea_rf_cyanosis,
          "syncope_or_shock": patient.dyspnea_rf_syncope_shock,
          "altered_mental_status": patient.dyspnea_rf_altered_mental,
          "hemoptysis": patient.dyspnea_rf_hemoptysis,
          "fever_or_chills": patient.dyspnea_has_fever,
          "cough": {
            "present": patient.dyspnea_has_cough,
            "cough_type": patient.dyspneaCoughType,
            "sputum_color": patient.dyspneaSputumColor
          },
          "pleuritic_chest_pain": patient.dyspnea_has_pleuritic,
          "crushing_chest_pain": {
            "present": patient.dyspnea_rf_chestpain,
            "crushing_pressure": patient.dyspnea_cp_crushing,
            "radiation_to_arm_or_jaw": patient.dyspnea_cp_rad_arm,
            "duration_over_20m": patient.dyspnea_cp_gt_20m
          },
          "leg_edema": {
            "present": patient.dyspnea_has_leg_swelling,
            "edema_type": patient.dyspneaLegType,
            "rapid_weight_gain": patient.dyspnea_weight_gain
          },
          "prolonged_travel_or_bedridden": patient.dyspnea_pe_travel_bedridden,
          "anaphylaxis_allergy_screen": {
            "present": patient.dyspnea_has_allergy,
            "exposure_food_or_medication": patient.dyspnea_allergy_exp_food_med,
            "exposure_insect_sting": patient.dyspnea_allergy_exp_insect
          },
          "palpitations": patient.dyspnea_has_palpitation,
          "polyuria_polydipsia_dka_screen": Boolean(patient.dyspnea_metabolic_dka),
          "renal_failure_or_missed_dialysis": Boolean(patient.dyspnea_metabolic_ckd),
          "metabolic_oliguria_or_missed_dialysis": Boolean(patient.dyspnea_metabolic_ckd),
          "hyperventilation_or_carpopedal_spasm": patient.dyspnea_hypervent_tingling,
          "other_symptoms_free_text": patient.otherSymptomsFree || ""
        },
        "inhaler_usage_history": {
          "frequency_24h": patient.ud_inhaler_freq,
          "relief_response": patient.ud_inhaler_relief,
          "prior_icu_or_intubation": patient.ud_inhaler_prior_icu
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

    // =========================================================================
    // OUTPUT GENERATION: ปากเบี้ยว อ่อนแรง ชา ข้างใดข้างหนึ่ง พูดไม่ชัด (Stroke / Focal Deficit)

registerCcModule({
  id: 'dyspnea',
  recordCc: 'dyspnea',
  titleTh: 'เหนื่อย / หายใจหอบเหนื่อย / หายใจลำบาก',
  titleEn: 'Shortness of breath / Dyspnea',
  sectionDomId: 'dyspneaQuestionnaireSection',
  doctorCcBadgeHtml: "<i data-lucide=\"wind\" class=\"w-3 h-3 mr-1\"></i> CC: เหนื่อย / หายใจหอบเหนื่อย (Dyspnea)",
  formHtml: "        <div id=\"dyspneaQuestionnaireSection\" class=\"hidden space-y-6\">\n\n          <!-- Triage Advisory Banner -->\n          <div class=\"p-4 bg-amber-50 border-l-4 border-amber-500 rounded-2xl flex items-start space-x-3\">\n            <i data-lucide=\"alert-triangle\" class=\"w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0\"></i>\n            <div class=\"text-xs text-amber-900 leading-relaxed\">\n              <strong class=\"font-bold\">ข้อความแจ้งเตือนจุดคัดกรอง:</strong> หากผู้ป่วยรู้สึกเหนื่อยล้า <strong>อ่อนเพลีย ไม่มีแรง หรือรับประทานอาหารไม่ได้</strong> (โดยไม่มีอาการหอบเหนื่อย หายใจเร็ว หรือหายใจลำบาก) กรุณาเลือกอาการสำคัญใช้: <strong>&lt;อ่อนเพลีย / กินไม่ได้ / ไม่มีแรง&gt;</strong> (Weakness)\n            </div>\n          </div>\n\n          <!-- CARD 1: ระยะเวลา รูปแบบ และระดับความเหนื่อย -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"clock\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-900\">1. ระยะเวลา รูปแบบ และระดับความเหนื่อย</h2>\n                <p class=\"text-xs text-slate-500 font-sans\">Duration, Onset & Severity Assessment</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-5\">\n              <!-- ระยะเวลา -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">\n                  ระยะเวลาที่เริ่มมีอาการเหนื่อย <span class=\"text-rose-500\">*</span>\n                </label>\n                <div class=\"grid grid-cols-2 sm:grid-cols-3 gap-3\">\n                  <div class=\"col-span-1 sm:col-span-2\">\n                    <input type=\"number\" id=\"dyspneaDurationVal\" min=\"1\" max=\"1000\"\n                      class=\"w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm placeholder:text-slate-400 placeholder:font-normal\"\n                      placeholder=\"เช่น 2 หรือ 30\">\n                  </div>\n                  <div class=\"col-span-1\">\n                    <select id=\"dyspneaDurationUnit\"\n                      class=\"w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm\">\n                      <option value=\"minutes\">นาที</option>\n                      <option value=\"hours\" selected>ชั่วโมง</option>\n                      <option value=\"days\">วัน</option>\n                      <option value=\"weeks\">สัปดาห์</option>\n                      <option value=\"months\">เดือน</option>\n                      <option value=\"years\">ปี</option>\n                    </select>\n                  </div>\n                </div>\n              </div>\n\n              <!-- รูปแบบการเริ่มมีอาการ (Onset) -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">\n                  รูปแบบการเริ่มมีอาการเหนื่อย\n                </label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2.5\">\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"dyspneaOnsetMode\" value=\"sudden\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">เกิดขึ้นฉับพลันทันที</span>\n                      <span class=\"text-[11px] text-slate-500\">เหนื่อยหอบรุนแรงขึ้นมาทันทีในไม่กี่นาที</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"dyspneaOnsetMode\" value=\"gradual\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">ค่อยๆ เป็นมากขึ้น</span>\n                      <span class=\"text-[11px] text-slate-500\">เหนื่อยและเป็นเพิ่มขึ้นเรื่อยๆ</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"dyspneaOnsetMode\" value=\"chronic\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">มีอาการเรื้อรัง</span>\n                      <span class=\"text-[11px] text-slate-500\">เหนื่อยเป็นๆ หายๆ มานาน หรือเท่าเดิมเรื้อรัง</span>\n                    </div>\n                  </label>\n                </div>\n              </div>\n\n              <!-- ระดับความเหนื่อย (Severity & Functional Capacity) -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">\n                  ระดับความเหนื่อยในขณะนี้ (เลือกระดับที่เป็นมากที่สุด)\n                </label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2.5\">\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"dyspneaSeverity\" value=\"mild_exertion\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">เหนื่อยเฉพาะเวลาออกแรงหนัก</span>\n                      <span class=\"text-[11px] text-slate-500\">เช่น วิ่ง ยกของหนัก หรือเดินขึ้นบันได</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"dyspneaSeverity\" value=\"moderate_walking\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">เหนื่อยเวลาเดินราบปกติ</span>\n                      <span class=\"text-[11px] text-slate-500\">เดินระยะปกติ หรือทำกิจวัตรประจำวันในบ้าน</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"dyspneaSeverity\" value=\"at_rest\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">เหนื่อยตลอดเวลา แม้อยู่เฉยๆ</span>\n                      <span class=\"text-[11px] text-slate-500\">นั่งพักหรือนอนเฉยๆ ก็ยังรู้สึกเหนื่อยหอบ</span>\n                    </div>\n                  </label>\n                  <!-- สัญญาณเตือนวิกฤตสอดแทรก (Item 5) -->\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer border-slate-200\">\n                    <input type=\"radio\" name=\"dyspneaSeverity\" value=\"speaks_in_words\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">เหนื่อยมากจนพูดได้เพียงทีละคำ</span>\n                      <span class=\"text-[11px] text-slate-500\">หอบเหนื่อยรุนแรงจนพูดติดต่อกันเป็นประโยคไม่ได้</span>\n                    </div>\n                  </label>\n                </div>\n              </div>\n\n              <!-- ความสัมพันธ์กับท่านอน / ท่าทาง (Item 3: เพิ่ม Trepopnea) -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">\n                  ความสัมพันธ์กับท่านอนและท่าทาง (เลือกได้หลายข้อ)\n                </label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2.5\">\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"dyspnea_pos_orthopnea\" onchange=\"handleDyspneaPosOther(this); toggleBranch('dyspnea_orthopnea_wrap', this.checked)\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">เหนื่อยมากขึ้นเวลานอนราบ (Orthopnea)</span>\n                      <span class=\"text-[11px] text-slate-500\">นอนราบไม่ได้ ต้องหนุนหมอนสูงหรือลุกนั่ง</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"dyspnea_pos_pnd\" onchange=\"handleDyspneaPosOther(this)\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">สะดุ้งตื่นขึ้นมากลางดึกเพราะหอบเหนื่อย (PND)</span>\n                      <span class=\"text-[11px] text-slate-500\">หลับไปแล้ว 1-2 ชม. ต้องตื่นขึ้นมาหอบและนั่งห้อยขา</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"dyspnea_pos_trepopnea\" onchange=\"handleDyspneaPosOther(this)\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">เหนื่อยมากขึ้นเวลานอนตะแคงข้างใดข้างหนึ่ง (Trepopnea)</span>\n                      <span class=\"text-[11px] text-slate-500\">นอนตะแคงข้างใดข้างหนึ่งแล้วเหนื่อย ต้องพลิกตัวอีกข้าง</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"dyspnea_pos_none\" onchange=\"handleDyspneaPosNone(this.checked)\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">เหนื่อยเท่าเดิมในทุกท่าทาง</span>\n                      <span class=\"text-[11px] text-slate-500\">ท่านอนหรือการเปลี่ยนท่าไม่มีผลต่อระดับความเหนื่อย</span>\n                    </div>\n                  </label>\n                </div>\n\n                <!-- กิ่งเจาะลึกจำนวนหมอนสำหรับ Orthopnea -->\n                <div id=\"dyspnea_orthopnea_wrap\" class=\"hidden bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-3 space-y-2 text-xs\">\n                  <span class=\"font-semibold text-slate-800 block\">ระบุจำนวนหมอนที่ต้องใช้หนุนเวลานอน:</span>\n                  <div class=\"grid grid-cols-2 sm:grid-cols-4 gap-2\">\n                    <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"radio\" name=\"dyspneaOrthopneaPillows\" value=\"1_pillow\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium\">หนุนหมอน 1 ใบ</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"radio\" name=\"dyspneaOrthopneaPillows\" value=\"2_pillows\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium\">หนุนหมอน 2 ใบ</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"radio\" name=\"dyspneaOrthopneaPillows\" value=\"3_or_more\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium\">หนุนหมอน 3 ใบขึ้นไป</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"radio\" name=\"dyspneaOrthopneaPillows\" value=\"sitting_up\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium text-slate-800\">ต้องนั่งหลับ</span>\n                    </label>\n                  </div>\n                </div>\n              </div>\n\n            </div>\n          </div>\n\n          <!-- CARD 2: เสียงและลักษณะการหายใจ (Item 4) -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"activity\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-900\">2. เสียงและลักษณะการหายใจ</h2>\n                <p class=\"text-xs text-slate-500 font-sans\">Breathing Sounds & Characteristics (เลือกได้หลายข้อ)</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4\">\n              <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">\n                ลักษณะการหายใจที่พบในขณะนี้ (เลือกได้หลายข้อ)\n              </label>\n              <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2.5\">\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dyspnea_char_wheezing\" name=\"dyspnea_char\" value=\"wheezing\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">หายใจมีเสียงหวีดในทรวงอก (Wheezing)</span>\n                    <span class=\"text-[11px] text-slate-500\">มีเสียงหวีดแหลมคล้ายเสียงนกหวีดเวลาหายใจออก</span>\n                  </div>\n                </label>\n                <!-- สัญญาณเตือนวิกฤต Stridor (Item 5) -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer border-slate-200\">\n                  <input type=\"checkbox\" id=\"dyspnea_char_stridor\" name=\"dyspnea_char\" value=\"stridor\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">หายใจมีเสียงฮืด หรือเสียงตีบตันในลำคอ (Stridor)</span>\n                    <span class=\"text-[11px] text-slate-500\">เสียงดังครืดคราดหรือมีเสียงฮืดในคอเวลาหายใจเข้า</span>\n                  </div>\n                </label>\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dyspnea_char_air_hunger\" name=\"dyspnea_char\" value=\"air_hunger\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">หายใจไม่อิ่ม</span>\n                    <span class=\"text-[11px] text-slate-500\">รู้สึกอากาศเข้าปอดไม่เต็มที่ ต้องพยายามสูดลมหายใจลึกๆ</span>\n                  </div>\n                </label>\n                <!-- แยกข้อตามคำขอ: หายใจเร็วถี่ (Item 4) -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dyspnea_char_tachypnea\" name=\"dyspnea_char\" value=\"tachypnea\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">หายใจเร็วถี่</span>\n                    <span class=\"text-[11px] text-slate-500\">อัตราการหายใจเร็วกว่าปกติ หายใจกระชั้นถี่</span>\n                  </div>\n                </label>\n                <!-- แยกข้อตามคำขอ: ต้องออกแรงใช้กล้ามเนื้อคอ/หน้าอกช่วยหายใจ (Item 4 & 5) -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dyspnea_char_accessory_muscle\" name=\"dyspnea_char\" value=\"accessory_muscle\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">ต้องออกแรงใช้กล้ามเนื้อคอ/หน้าอกช่วยหายใจ</span>\n                    <span class=\"text-[11px] text-slate-500\">ปีกจมูกบาน ทรวงอกหรือช่วงคอบุ๋มลึกเวลาหายใจเข้า</span>\n                  </div>\n                </label>\n                <!-- เพิ่มตามคำขอ: หายใจขัด หรือแน่นอึดอัดภายในทรวงอก (Item 4) -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dyspnea_char_chest_tightness\" name=\"dyspnea_char\" value=\"chest_tightness\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">หายใจขัด หรือแน่นอึดอัดภายในทรวงอก</span>\n                    <span class=\"text-[11px] text-slate-500\">รู้สึกแน่นคับหน้าอก หายใจเข้าไม่สะดวก</span>\n                  </div>\n                </label>\n              </div>\n\n              <!-- Other char text -->\n              <div class=\"pt-2\">\n                <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dyspnea_char_other_chk\" onchange=\"toggleOtherInput('dyspnea_char_other_wrap', this.checked)\" class=\"rounded text-medical-600 h-4 w-4\">\n                  <span class=\"ml-2.5 text-xs sm:text-sm font-semibold text-slate-800\">ลักษณะอื่นๆ (ระบุ)</span>\n                </label>\n                <div id=\"dyspnea_char_other_wrap\" class=\"hidden mt-2\">\n                  <input type=\"text\" id=\"dyspnea_char_other_text\" placeholder=\"ระบุลักษณะการหายใจเพิ่มเติม...\"\n                    class=\"w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white placeholder:text-slate-400\">\n                </div>\n              </div>\n            </div>\n          </div>\n\n          <!-- CARD 3: อาการร่วมและคัดกรองระบบที่เกี่ยวข้อง (Item 5: สอดแทรก Red Flags สมบูรณ์) -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"check-square\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-900\">3. อาการร่วมและคัดกรองระบบที่เกี่ยวข้อง</h2>\n                <p class=\"text-xs text-slate-500 font-sans\">Associated Symptoms & Clinical Review (เลือกได้หลายข้อ)</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4\">\n              <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">\n                กรุณาเลือกอาการร่วมที่ตรงกับท่าน (ระบบจะเปิดคำถามเฉพาะจุดให้ท่านโดยอัตโนมัติ)\n              </label>\n\n              <!-- รายการอาการร่วมหลัก (Anti-bias: กล่องและฟอนต์เหมือนกันทุกข้อ) -->\n              <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2.5\">\n\n                <!-- 1. ไข้/หนาวสั่น -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dyspnea_has_fever\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">มีไข้ หรือหนาวสั่น</span>\n                    <span class=\"text-[11px] text-slate-500\">ตัวร้อน รุมๆ หรือมีอาการหนาวสะท้าน</span>\n                  </div>\n                </label>\n\n                <!-- 2. ไอ -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dyspnea_has_cough\" onchange=\"toggleBranch('dyspnea_cough_wrap', this.checked)\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">มีอาการไอ</span>\n                    <span class=\"text-[11px] text-slate-500\">ไอแห้งๆ หรือไอมีเสมหะ</span>\n                  </div>\n                </label>\n\n                <!-- 3. เจ็บแปล๊บหน้าอกเวลาหายใจลึก (Pleuritic) -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dyspnea_has_pleuritic\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">เจ็บแปล๊บหน้าอกเวลาหายใจเข้าลึกหรือเวลาไอ</span>\n                    <span class=\"text-[11px] text-slate-500\">เจ็บเสียวแปล๊บข้างใดข้างหนึ่งตามจังหวะการหายใจ (Pleuritic pain)</span>\n                  </div>\n                </label>\n\n                <!-- 4. เจ็บแน่นหน้าอกรุนแรง (Red Flag ACS สอดแทรก) -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dyspnea_rf_chestpain\" onchange=\"toggleBranch('dyspnea_chestpain_wrap', this.checked)\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">เจ็บแน่นหน้าอกเหมือนโดนของหนักทับ</span>\n                    <span class=\"text-[11px] text-slate-500\">แน่นอึดอัดกลางอก หรือร้าวไปกราม คอ ไหล่ซ้าย</span>\n                  </div>\n                </label>\n\n                <!-- 5. ขาบวม หรือปวดน่อง -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dyspnea_has_leg_swelling\" onchange=\"toggleBranch('dyspnea_leg_wrap', this.checked)\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">มีอาการขาบวม หลังเท้าบวม หรือปวดน่อง</span>\n                    <span class=\"text-[11px] text-slate-500\">กดแล้วบุ๋ม หรือน่องตึงแข็ง</span>\n                  </div>\n                </label>\n\n                <!-- 6. ปากเขียว เล็บเขียว (Red Flag Cyanosis สอดแทรก) -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dyspnea_rf_cyanosis\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">ริมฝีปากเขียวคล้ำ หรือเล็บมือเล็บเท้าเขียวคล้ำ</span>\n                    <span class=\"text-[11px] text-slate-500\">สีผิวหรือปลายมือปลายเท้าเปลี่ยนเป็นสีม่วงคล้ำ</span>\n                  </div>\n                </label>\n\n                <!-- 7. หน้ามืด วูบ หรือเหงื่อแตกตัวเย็นซีด (Red Flag Shock สอดแทรก) -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dyspnea_rf_syncope\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">หน้ามืด วูบ เป็นลม หรือเหงื่อแตกตัวเย็นซีด</span>\n                    <span class=\"text-[11px] text-slate-500\">เหงื่อออกท่วมตัว ตัวเย็นเฉียบ หรือเกือบหมดสติ</span>\n                  </div>\n                </label>\n\n                <!-- 8. ซึม สับสน (Red Flag Hypercapnia / Hypoxia สอดแทรก) -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dyspnea_rf_altered_mental\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">มีอาการซึมลง สับสน หรือกระสับกระส่ายผิดปกติ</span>\n                    <span class=\"text-[11px] text-slate-500\">ถามตอบไม่รู้เรื่อง ปลุกตื่นยาก หรือเอะอะสับสน</span>\n                  </div>\n                </label>\n\n                <!-- 9. ไอเป็นเลือด (Red Flag Hemoptysis สอดแทรก) -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dyspnea_rf_hemoptysis\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">ไอมีเลือดสดปน หรือเสมหะเป็นสีสนิมเหล็ก</span>\n                    <span class=\"text-[11px] text-slate-500\">มีลิ่มเลือดปนในเสมหะ หรือขากเสมหะมีเลือดสด</span>\n                  </div>\n                </label>\n\n                <!-- 10. ผื่นลมพิษ ปากบวม ตาบวม (Red Flag Anaphylaxis สอดแทรก) -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dyspnea_has_allergy\" onchange=\"toggleBranch('dyspnea_allergy_wrap', this.checked)\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">มีผื่นลมพิษ ปากบวม ตาบวม หรือแน่นคอกลืนลำบาก</span>\n                    <span class=\"text-[11px] text-slate-500\">ผื่นแดงคันขึ้นรวดเร็ว ใบหน้าหรือริมฝีปากบวมตุ่ย</span>\n                  </div>\n                </label>\n\n                <!-- 11. ใจสั่น หัวใจเต้นเร็วผิดปกติ -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dyspnea_has_palpitation\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">ใจสั่น หัวใจเต้นเร็ว หรือเต้นผิดจังหวะสะดุด</span>\n                    <span class=\"text-[11px] text-slate-500\">รู้สึกหัวใจเต้นรัวกระหน่ำหรือเต้นไม่สม่ำเสมอ</span>\n                  </div>\n                </label>\n\n                <!-- 12. ปัจจัยเสี่ยงลิ่มเลือด PE -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dyspnea_pe_travel_bedridden\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">มีประวัตินั่งทางไกล &gt; 4 ชม. หรือนอนติดเตียง/เข้าเฝือก</span>\n                    <span class=\"text-[11px] text-slate-500\">นั่งรถ/เครื่องบินนาน, ผ่าตัดใหญ่ หรือไม่ได้ขยับขาช่วงที่ผ่านมา</span>\n                  </div>\n                </label>\n\n                <!-- 13.1 Metabolic / เบาหวาน (DKA) -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dyspnea_metabolic_dka\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">หิวน้ำบ่อย ปัสสาวะบ่อย ปากแห้ง</span>\n                    <span class=\"text-[11px] text-slate-500\">อ่อนเพลียมาก น้ำหนักลด หรือมีประวัติเบาหวานน้ำตาลสูง</span>\n                  </div>\n                </label>\n\n                <!-- 13.2 ไตวาย / ขาดฟอกเลือด (CKD / Volume Overload / Uremia) -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dyspnea_metabolic_ckd\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">มีประวัติไตวาย หรือขาดฟอกเลือด</span>\n                    <span class=\"text-[11px] text-slate-500\">ปัสสาวะออกน้อยลงมาก ตัวบวม หรือไม่ได้ไปฟอกไตตามนัด</span>\n                  </div>\n                </label>\n\n                <!-- 14. ชามือชาเท้า มือจีบเกร็ง (Hyperventilation) -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dyspnea_hypervent_tingling\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">มีอาการชาปลายมือปลายเท้า ชารอบปาก หรือมือจีบเกร็ง</span>\n                    <span class=\"text-[11px] text-slate-500\">สัมพันธ์กับภาวะเครียด ร้องไห้ ตกใจ หรือวิตกกังวล</span>\n                  </div>\n                </label>\n\n              </div>\n\n              <!-- ============================================================= -->\n              <!-- กิ่งเจาะลึกแบบ Dynamic Progressive Disclosure                    -->\n              <!-- ============================================================= -->\n\n              <!-- กิ่งเจาะลึก: ไอ -->\n              <div id=\"dyspnea_cough_wrap\" class=\"hidden bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs\">\n                <span class=\"font-semibold text-slate-800 block\">เจาะลึกลักษณะอาการไอและเสมหะ:</span>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2\">\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"dyspneaCoughType\" value=\"dry\" onchange=\"toggleBranch('dyspnea_sputum_color_wrap', false)\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium\">ไอแห้งๆ ไม่มีเสมหะ</span>\n                  </label>\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"dyspneaCoughType\" value=\"productive\" onchange=\"toggleBranch('dyspnea_sputum_color_wrap', true)\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium\">ไอมีเสมหะ</span>\n                  </label>\n                </div>\n                <div id=\"dyspnea_sputum_color_wrap\" class=\"hidden space-y-2 pt-2 border-t border-slate-200\">\n                  <span class=\"font-medium text-slate-700 block\">สีของเสมหะ:</span>\n                  <div class=\"grid grid-cols-2 sm:grid-cols-4 gap-2\">\n                    <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"radio\" name=\"dyspneaSputumColor\" value=\"white_clear\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium\">ขาวใส / ขาวขุ่น</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"radio\" name=\"dyspneaSputumColor\" value=\"yellow_green\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium\">เหลือง / เขียว</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"radio\" name=\"dyspneaSputumColor\" value=\"rust\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium\">สีสนิมเหล็ก</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"radio\" name=\"dyspneaSputumColor\" value=\"pink_frothy\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-semibold text-slate-800\">ฟองสีชมพู</span>\n                    </label>\n                  </div>\n                </div>\n              </div>\n\n              <!-- กิ่งเจาะลึก: ขาบวม -->\n              <div id=\"dyspnea_leg_wrap\" class=\"hidden bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs\">\n                <span class=\"font-semibold text-slate-800 block\">ลักษณะอาการขาบวม:</span>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2\">\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"dyspneaLegType\" value=\"bilateral\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium text-slate-800\">ขาบวมทั้งสองข้างเท่าๆ กัน</span>\n                  </label>\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"dyspneaLegType\" value=\"unilateral\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium text-slate-800\">ขาบวมข้างเดียว หรือปวดน่องข้างเดียว</span>\n                  </label>\n                </div>\n                <div class=\"pt-2 border-t border-slate-200\">\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" id=\"dyspnea_weight_gain\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium text-slate-800\">มีน้ำหนักตัวเพิ่มขึ้นรวดเร็ว (เช่น เพิ่มขึ้น 2-3 กิโลกรัม ในไม่กี่วัน)</span>\n                  </label>\n                </div>\n              </div>\n\n              <!-- กิ่งเจาะลึก: เจ็บแน่นหน้าอก -->\n              <div id=\"dyspnea_chestpain_wrap\" class=\"hidden bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs\">\n                <span class=\"font-semibold text-slate-800 block\">ลักษณะอาการเจ็บแน่นหน้าอกร่วม:</span>\n                <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2\">\n                  <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" id=\"dyspnea_cp_crushing\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium\">แน่นเหมือนของหนักทับ</span>\n                  </label>\n                  <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" id=\"dyspnea_cp_rad_arm\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium\">ร้าวไปกราม คอ ไหล่ซ้าย</span>\n                  </label>\n                  <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" id=\"dyspnea_cp_gt_20m\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium\">แน่นต่อเนื่องเกิน 20 นาที</span>\n                  </label>\n                </div>\n              </div>\n\n              <!-- กิ่งเจาะลึก: อาการแพ้รุนแรง (Anaphylaxis) -->\n              <div id=\"dyspnea_allergy_wrap\" class=\"hidden bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs\">\n                <span class=\"font-semibold text-slate-800 block\">ประวัติการสัมผัสสิ่งกระตุ้นก่อนเริ่มมีอาการ:</span>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2\">\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" id=\"dyspnea_allergy_exp_food_med\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium\">เพิ่งรับประทานอาหารแปลกใหม่ หรือทานยาใหม่ ภายใน 1-2 ชม.</span>\n                  </label>\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" id=\"dyspnea_allergy_exp_insect\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium\">มีประวัติถูกผึ้ง ต่อ แตน หรือแมลงสัตว์กัดต่อย</span>\n                  </label>\n                </div>\n              </div>\n\n            </div>\n          </div>\n\n          <!-- อาการอื่นๆ เป็นช่องกรอกอิสระ -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100\">\n              <div class=\"bg-slate-100 text-slate-600 p-2 rounded-xl\">\n                <i data-lucide=\"message-square-plus\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-800\">อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2>\n                <p class=\"text-xs text-slate-500\">ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี เช่น อ่อนเพลียมาก, แน่นหน้าอก, วิงเวียนศีรษะ)</p>\n              </div>\n            </div>\n            <textarea id=\"dyspnea_other_free\" rows=\"2\" placeholder=\"พิมพ์ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)...\" \n              class=\"w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white\"></textarea>\n          </div>\n\n        </div> <!-- END DYSPNEA QUESTIONNAIRE SECTION -->\n",
  algorithm: {
  "id": "dyspnea",
  "schemaCode": "dyspnea",
  "titleTh": "เหนื่อย / หายใจหอบเหนื่อย / หายใจลำบาก",
  "titleEn": "Dyspnea / Shortness of breath",
  "preEntryPopupWarning": "สำหรับผู้ป่วย <หายใจหอบเหนื่อย / หายใจลำบาก> หากเหนื่อยอ่อนเพลีย กรุณาเลือกอาการสำคัญใช้ <อ่อนเพลีย / กินไม่ได้ / ไม่มีแรง>",
  "sections": [
    {
      "sectionNo": 1,
      "titleTh": "ระยะเวลา ความรุนแรง และความสัมพันธ์กับท่านอน (Dyspnea Profile & Severity)",
      "questions": [
        {
          "key": "duration",
          "labelTh": "เริ่มมีอาการหอบเหนื่อยมานานเท่าไรแล้ว?",
          "type": "duration_with_unit",
          "units": "UNIVERSAL_DURATION_UNITS"
        },
        {
          "key": "dyspneaOnsetMode",
          "labelTh": "อาการหอบเหนื่อยเริ่มต้นแบบใด? (Sudden / เหนื่อยและเป็นเพิ่มขึ้นเรื่อยๆ / Chronic)"
        },
        {
          "key": "dyspneaSeverity",
          "labelTh": "ระดับความรุนแรงของอาการเหนื่อย (Mild exertion / Walking / At rest / Speaks in single words 🚩)"
        },
        {
          "key": "positionalTriggers",
          "labelTh": "ความสัมพันธ์กับท่านอน (Orthopnea + จำนวนหมอน / PND / Trepopnea / นอนราบได้ปกติ)"
        }
      ]
    },
    {
      "sectionNo": 2,
      "titleTh": "เสียงและลักษณะการหายใจ (Breathing Characteristics - เลือกได้หลายข้อ)",
      "items": [
        {
          "key": "dyspnea_char_wheezing",
          "patientTh": "หายใจมีเสียงวี้ด (Wheezing)"
        },
        {
          "key": "dyspnea_char_stridor",
          "patientTh": "หายใจเข้ามีเสียงฮืดดังที่คอ เหมือนมีอะไรอุดกั้นที่คอ (Stridor)",
          "isRedFlag": true
        },
        {
          "key": "dyspnea_char_air_hunger",
          "patientTh": "รู้สึกหายใจเข้าไม่สุด อึดอัด หายใจไม่อิ่ม"
        },
        {
          "key": "dyspnea_char_tachypnea",
          "patientTh": "หายใจเร็วถี่"
        },
        {
          "key": "dyspnea_char_accessory_muscle",
          "patientTh": "ต้องออกแรงใช้กล้ามเนื้อคอ/หน้าอกช่วยหายใจ",
          "isRedFlag": true
        },
        {
          "key": "dyspnea_char_chest_tightness",
          "patientTh": "หายใจขัด หรือแน่นอึดอัดภายในทรวงอก"
        },
        {
          "key": "dyspnea_char_other",
          "patientTh": "ลักษณะอื่นๆ (ระบุ)"
        }
      ]
    },
    {
      "sectionNo": 3,
      "titleTh": "อาการร่วมและการคัดกรองโรคสาเหตุ (Associated Symptoms & Embedded Red Flags)",
      "items": [
        {
          "key": "dyspnea_rf_cyanosis",
          "patientTh": "ริมฝีปาก เล็บ หรือปลายมือปลายเท้าเขียวคล้ำ",
          "isRedFlag": true
        },
        {
          "key": "dyspnea_rf_syncope_shock",
          "patientTh": "เหงื่อแตกท่วมตัว ตัวเย็น หน้ามืด วูบ หรือเกือบหมดสติ",
          "isRedFlag": true
        },
        {
          "key": "dyspnea_rf_altered_mental",
          "patientTh": "ซึมลง สับสน ง่วงซึมผิดปกติ หรือปลุกตื่นยาก",
          "isRedFlag": true
        },
        {
          "key": "dyspnea_rf_hemoptysis",
          "patientTh": "ไอเป็นเลือดสด",
          "isRedFlag": true
        },
        {
          "key": "dyspnea_has_fever",
          "patientTh": "มีไข้ หรือหนาวสั่น"
        },
        {
          "key": "dyspnea_has_cough",
          "patientTh": "มีอาการไอ (แตกกิ่ง: ไอแห้ง vs ไอมีเสมหะ + สีเสมหะ รวมถึงสีชมพูเป็นฟอง Pink frothy sputum)"
        },
        {
          "key": "dyspnea_has_pleuritic",
          "patientTh": "เจ็บแปล๊บหน้าอกเวลาหายใจเข้าลึกๆ หรือเวลาไอ"
        },
        {
          "key": "dyspnea_rf_chestpain",
          "patientTh": "เจ็บแน่นหน้าอกร่วมด้วย (แตกกิ่งคัดกรอง ACS)",
          "isRedFlag": true
        },
        {
          "key": "dyspnea_has_palpitation",
          "patientTh": "ใจสั่น หัวใจเต้นเร็วหรือเต้นไม่เป็นจังหวะ"
        },
        {
          "key": "dyspnea_has_leg_swelling",
          "patientTh": "ขาบวม หรือเท้าบวม (แตกกิ่ง: ขาบวมทั้งสองข้างเท่าๆ กัน vs ขาบวมข้างเดียว หรือปวดน่องข้างเดียว + น้ำหนักตัวขึ้นเร็ว)"
        },
        {
          "key": "dyspnea_pe_travel_bedridden",
          "patientTh": "มีประวัตินั่งเดินทางไกลติดต่อกัน > 4 ชม. หรือนอนติดเตียง/เข้าเฝือกขา"
        },
        {
          "key": "dyspnea_has_allergy",
          "patientTh": "มีผื่นลมพิษ ตาบวม ปากบวม หรือแน่นคอหลังทานอาหาร/ยา/แมลงกัดต่อย (Anaphylaxis)",
          "isRedFlag": true
        },
        {
          "key": "dyspnea_metabolic_dka",
          "patientTh": "หิวน้ำบ่อย ปัสสาวะบ่อย ปากแห้ง"
        },
        {
          "key": "dyspnea_metabolic_ckd",
          "patientTh": "มีประวัติไตวาย หรือขาดฟอกเลือด"
        },
        {
          "key": "dyspnea_hypervent_tingling",
          "patientTh": "มีอาการชาปลายมือปลายเท้า มือเกร็งจีบ หรือมีเรื่องเครียด/ตกใจนำมาก่อน"
        }
      ]
    }
  ]
},
  seedPatients: [
  {
    "id": "case-051",
    "queue_number": "A-051",
    "hn": "6709841",
    "name": "นายอนุชา วงศ์สวัสดิ์",
    "age": 28,
    "gender": "ชาย",
    "chief_complaint": "dyspnea",
    "chief_complaint_title": "เหนื่อย / หายใจหอบเหนื่อย / หายใจลำบาก",
    "status": "waiting",
    "timestamp": "2026-10-26T02:16:26.424Z",
    "durationVal": 2,
    "durationUnit": "hours",
    "dyspneaOnsetMode": "gradual",
    "dyspneaSeverity": "speaks_in_words",
    "dyspnea_pos_orthopnea": false,
    "dyspneaOrthopneaPillows": "none",
    "dyspnea_pos_pnd": false,
    "dyspnea_pos_trepopnea": false,
    "dyspnea_pos_none": true,
    "dyspnea_char_wheezing": true,
    "dyspnea_char_stridor": false,
    "dyspnea_char_air_hunger": true,
    "dyspnea_char_tachypnea": true,
    "dyspnea_char_accessory_muscle": true,
    "dyspnea_char_chest_tightness": true,
    "dyspnea_char_other": "",
    "dyspnea_rf_cyanosis": false,
    "dyspnea_rf_syncope_shock": false,
    "dyspnea_rf_altered_mental": false,
    "dyspnea_rf_hemoptysis": false,
    "dyspnea_has_fever": false,
    "dyspnea_has_cough": true,
    "dyspneaCoughType": "dry",
    "dyspneaSputumColor": "none",
    "dyspnea_has_pleuritic": false,
    "dyspnea_rf_chestpain": false,
    "dyspnea_cp_crushing": false,
    "dyspnea_cp_rad_arm": false,
    "dyspnea_cp_gt_20m": false,
    "dyspnea_has_leg_swelling": false,
    "dyspneaLegType": "none",
    "dyspnea_weight_gain": false,
    "dyspnea_pe_travel_bedridden": false,
    "dyspnea_has_allergy": false,
    "dyspnea_allergy_exp_food_med": false,
    "dyspnea_allergy_exp_insect": false,
    "dyspnea_has_palpitation": false,
    "dyspnea_metabolic_dka": false,
    "dyspnea_metabolic_ckd": false,
    "dyspnea_hypervent_tingling": false,
    "ud_inhaler_freq": "gte_3_times",
    "ud_inhaler_relief": "poor",
    "ud_inhaler_prior_icu": "yes",
    "hospRecordStatus": "ratchaburi",
    "underlying": [
      "หอบหืด (Asthma)"
    ],
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "Ventolin MDI prn, Seretide Evohaler 25/125 2 puffs bid",
    "doctor_notes": {
      "additional_hpi": "ผู้ป่วยโรคหอบหืดเดิม มีอาการแน่นหน้าอก หายใจมีเสียงวี้ด หอบเหนื่อยมากขึ้นเรื่อยๆ หลังทำความสะอาดห้องเก็บของ พ่นยา Ventolin ไปแล้ว 4 ครั้งที่บ้านอาการไม่ทุเลา พูดได้เป็นคำๆ ไม่สามารถพูดจบประโยคได้",
      "physical_exam": "Alert, severe dyspnea, speaking in single words, suprasternal & intercostal retraction. BT 36.8 C, PR 124/min, RR 32/min, BP 138/88 mmHg, SpO2 91% (room air). Lungs: marked expiratory and inspiratory wheezing bilaterally, decreased air entry globally. Heart: Tachycardia, no murmur.",
      "preliminary_dx": "Acute Severe Asthma Exacerbation with Impending Respiratory Failure",
      "plan": "O2 cannula 3-4 LPM target SpO2 93-95%, Berodual neb 1 neb with 100% O2 q 20 min x 3 doses, Dexamethasone 10 mg IV stat, evaluate for IV Magnesium sulfate 2 g over 20 min if refractory, prepare intubation set at bedside, admit ICU/Med step-down"
    }
  },
  {
    "id": "case-052",
    "queue_number": "A-052",
    "hn": "6704512",
    "name": "นางสมร รัตนโชติ",
    "age": 72,
    "gender": "หญิง",
    "chief_complaint": "dyspnea",
    "chief_complaint_title": "เหนื่อย / หายใจหอบเหนื่อย / หายใจลำบาก",
    "status": "waiting",
    "timestamp": "2026-10-26T01:56:26.424Z",
    "durationVal": 6,
    "durationUnit": "hours",
    "dyspneaOnsetMode": "gradual",
    "dyspneaSeverity": "at_rest",
    "dyspnea_pos_orthopnea": true,
    "dyspneaOrthopneaPillows": "3_or_more",
    "dyspnea_pos_pnd": true,
    "dyspnea_pos_trepopnea": false,
    "dyspnea_pos_none": false,
    "dyspnea_char_wheezing": false,
    "dyspnea_char_stridor": false,
    "dyspnea_char_air_hunger": true,
    "dyspnea_char_tachypnea": true,
    "dyspnea_char_accessory_muscle": true,
    "dyspnea_char_chest_tightness": true,
    "dyspnea_char_other": "",
    "dyspnea_rf_cyanosis": false,
    "dyspnea_rf_syncope_shock": false,
    "dyspnea_rf_altered_mental": false,
    "dyspnea_rf_hemoptysis": false,
    "dyspnea_has_fever": false,
    "dyspnea_has_cough": true,
    "dyspneaCoughType": "productive",
    "dyspneaSputumColor": "pink_frothy",
    "dyspnea_has_pleuritic": false,
    "dyspnea_rf_chestpain": false,
    "dyspnea_cp_crushing": false,
    "dyspnea_cp_rad_arm": false,
    "dyspnea_cp_gt_20m": false,
    "dyspnea_has_leg_swelling": true,
    "dyspneaLegType": "bilateral",
    "dyspnea_weight_gain": true,
    "dyspnea_pe_travel_bedridden": false,
    "dyspnea_has_allergy": false,
    "dyspnea_allergy_exp_food_med": false,
    "dyspnea_allergy_exp_insect": false,
    "dyspnea_has_palpitation": true,
    "dyspnea_metabolic_dka": false,
    "dyspnea_metabolic_ckd": true,
    "dyspnea_hypervent_tingling": false,
    "ud_inhaler_freq": "none",
    "ud_inhaler_relief": "unspecified",
    "ud_inhaler_prior_icu": "no",
    "hospRecordStatus": "ratchaburi",
    "underlying": [
      "ความดันสูง (HT)",
      "เบาหวาน (DM)",
      "หลอดเลือดหัวใจ (CAD)",
      "ไตเรื้อรัง (CKD)"
    ],
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "Aspirin 81 mg 1x1 pc, Enalapril 5 mg 1x1 pc, Furosemide 40 mg 1x1 morning, Metformin 500 mg 1x2 pc",
    "doctor_notes": {
      "additional_hpi": "ผู้ป่วย U/D HT, CAD, CKD stage 3 หอบเหนื่อยมากขึ้นเรื่อยๆ 6 ชม. ก่อนมา นอนราบไม่ได้เลย ต้องนั่งหลับ สะดุ้งตื่นมาสำลักหายใจไม่ออก มีไอเสมหะเป็นฟองสีชมพู ขาบวมสองข้าง น้ำหนักขึ้น 3 กก. ช่วง 4 วันที่ผ่านมา (ทานอาหารเค็มช่วงเทศกาลและขาดยาขับปัสสาวะ 2 วัน)",
      "physical_exam": "Orthopneic posture, pale, diaphoretic. BT 36.6 C, PR 108/min, RR 28/min, BP 178/102 mmHg, SpO2 88% on room air -> 94% on High-flow Mask with reservoir. JVD 4 cm above sternal angle. Heart: S3 gallop present, no murmur. Lungs: Coarse crepitations both lower to mid lung fields bilaterally. Extremities: Pitting edema 2+ both legs.",
      "preliminary_dx": "Acute Decompensated Heart Failure (ADHF) with Flash Pulmonary Edema (Hypertensive Emergency)",
      "plan": "Sit upright 90 degrees with legs dependent, O2 High-flow Mask 10 LPM, Furosemide 80 mg IV stat, Isosorbide dinitrate 5 mg SL, EKG 12 leads, Portable CXR upright, Troponin-T stat, NT-proBNP, admit CCU/Monitored ward"
    }
  },
  {
    "id": "case-053",
    "queue_number": "A-053",
    "hn": "6707833",
    "name": "นางสาวพัชรี สุวรรณ",
    "age": 41,
    "gender": "หญิง",
    "chief_complaint": "dyspnea",
    "chief_complaint_title": "เหนื่อย / หายใจหอบเหนื่อย / หายใจลำบาก",
    "status": "waiting",
    "timestamp": "2026-10-26T01:36:26.424Z",
    "durationVal": 1,
    "durationUnit": "hours",
    "dyspneaOnsetMode": "sudden",
    "dyspneaSeverity": "moderate_walking",
    "dyspnea_pos_orthopnea": false,
    "dyspneaOrthopneaPillows": "none",
    "dyspnea_pos_pnd": false,
    "dyspnea_pos_trepopnea": false,
    "dyspnea_pos_none": true,
    "dyspnea_char_wheezing": false,
    "dyspnea_char_stridor": false,
    "dyspnea_char_air_hunger": true,
    "dyspnea_char_tachypnea": true,
    "dyspnea_char_accessory_muscle": false,
    "dyspnea_char_chest_tightness": true,
    "dyspnea_char_other": "",
    "dyspnea_rf_cyanosis": false,
    "dyspnea_rf_syncope_shock": true,
    "dyspnea_rf_altered_mental": false,
    "dyspnea_rf_hemoptysis": true,
    "dyspnea_has_fever": false,
    "dyspnea_has_cough": true,
    "dyspneaCoughType": "productive",
    "dyspneaSputumColor": "blood_tinged",
    "dyspnea_has_pleuritic": true,
    "dyspnea_rf_chestpain": false,
    "dyspnea_cp_crushing": false,
    "dyspnea_cp_rad_arm": false,
    "dyspnea_cp_gt_20m": false,
    "dyspnea_has_leg_swelling": true,
    "dyspneaLegType": "unilateral",
    "dyspnea_weight_gain": false,
    "dyspnea_pe_travel_bedridden": true,
    "dyspnea_has_allergy": false,
    "dyspnea_allergy_exp_food_med": false,
    "dyspnea_allergy_exp_insect": false,
    "dyspnea_has_palpitation": true,
    "dyspnea_metabolic_dka": false,
    "dyspnea_metabolic_ckd": false,
    "dyspnea_hypervent_tingling": false,
    "ud_inhaler_freq": "none",
    "ud_inhaler_relief": "unspecified",
    "ud_inhaler_prior_icu": "no",
    "hospRecordStatus": "self",
    "underlying": [
      "ทานยาคุมกำเนิดชนิดฮอร์โมนรวม (Combined OCP)"
    ],
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "ยาคุมกำเนิด Yasmin 1 เม็ดก่อนนอน",
    "doctor_notes": {
      "additional_hpi": "ผู้ป่วยหญิงอายุ 41 ปี ปฏิเสธโรคประจำตัว ทานยาคุมกำเนิดมา 3 ปี เพิ่งเดินทางกลับจากต่างประเทศนั่งเครื่องบิน 10 ชม. เมื่อวานเริ่มมีอาการปวดตึงและบวมที่น่องขวา วันนี้ 1 ชม. ก่อนมา มีอาการหอบเหนื่อยฉับพลัน แน่นหน้าอก เจ็บแปล๊บเวลาหายใจเข้าลึก ไอมีเสมหะปนเลือดสด และมีหน้ามืดวิงเวียน ใจสั่น",
      "physical_exam": "Tachypneic, pale, anxious. BT 37.1 C, PR 118/min regular, RR 26/min, BP 98/62 mmHg, SpO2 92% on room air. Lungs: Clear bilaterally, no wheezing or rhonchi. Heart: Tachycardia, prominent P2 component, no murmur. Right calf: Erythematous, warm, tender on palpation, calf circumference right 37 cm vs left 34 cm (difference 3 cm - Positive Homans sign).",
      "preliminary_dx": "High-Risk Acute Pulmonary Embolism (PE) secondary to Deep Vein Thrombosis (DVT) right leg (Wells score: High probability)",
      "plan": "O2 therapy via nasal cannula 3 LPM target SpO2 > 94%, IV fluid 0.9% NSS 500 ml IV loading, EKG 12 leads (S1Q3T3 pattern / Sinus tachycardia), Urgent CT Pulmonary Angiogram (CTPA), Bedside Echocardiogram to evaluate RV strain, Enoxaparin 1 mg/kg SC q 12h or UFH, admit intermediate care/CCU"
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
    const durVal = document.getElementById('dyspneaDurationVal');
    const durUnit = document.getElementById('dyspneaDurationUnit');
    if (durVal) durVal.value = patient.durationVal || '';
    if (durUnit && patient.durationUnit) durUnit.value = patient.durationUnit;

    setRadioValue('dyspneaOnsetMode', patient.dyspneaOnsetMode);
    setRadioValue('dyspneaSeverity', patient.dyspneaSeverity);

    setChk = (id, val) => { const el = document.getElementById(id); if (el) el.checked = Boolean(val); };
    setChk('dyspnea_pos_orthopnea', patient.dyspnea_pos_orthopnea);
    toggleBranch('dyspnea_orthopnea_wrap', Boolean(patient.dyspnea_pos_orthopnea));
    if (patient.dyspnea_pos_orthopnea) {
      setRadioValue('dyspneaOrthopneaPillows', patient.dyspneaOrthopneaPillows);
    }
    setChk('dyspnea_pos_pnd', patient.dyspnea_pos_pnd);
    setChk('dyspnea_pos_trepopnea', patient.dyspnea_pos_trepopnea);
    setChk('dyspnea_pos_none', patient.dyspnea_pos_none);

    setChk('dyspnea_char_wheezing', patient.dyspnea_char_wheezing);
    setChk('dyspnea_char_stridor', patient.dyspnea_char_stridor);
    setChk('dyspnea_char_air_hunger', patient.dyspnea_char_air_hunger);
    setChk('dyspnea_char_tachypnea', patient.dyspnea_char_tachypnea);
    setChk('dyspnea_char_accessory_muscle', patient.dyspnea_char_accessory_muscle);
    setChk('dyspnea_char_chest_tightness', patient.dyspnea_char_chest_tightness);
    if (patient.dyspnea_char_other) {
      setChk('dyspnea_char_other_chk', true);
      toggleBranch('dyspnea_char_other_wrap', true);
      if (document.getElementById('dyspnea_char_other_text')) {
        document.getElementById('dyspnea_char_other_text').value = patient.dyspnea_char_other;
      }
    }

    setChk('dyspnea_rf_cyanosis', patient.dyspnea_rf_cyanosis);
    setChk('dyspnea_rf_syncope', patient.dyspnea_rf_syncope_shock);
    setChk('dyspnea_rf_altered_mental', patient.dyspnea_rf_altered_mental);
    setChk('dyspnea_rf_hemoptysis', patient.dyspnea_rf_hemoptysis);
    setChk('dyspnea_has_fever', patient.dyspnea_has_fever);

    setChk('dyspnea_has_cough', patient.dyspnea_has_cough);
    toggleBranch('dyspnea_cough_wrap', Boolean(patient.dyspnea_has_cough));
    if (patient.dyspnea_has_cough) {
      setRadioValue('dyspneaCoughType', patient.dyspneaCoughType);
      toggleBranch('dyspnea_sputum_color_wrap', patient.dyspneaCoughType === 'productive');
      if (patient.dyspneaCoughType === 'productive') {
        setRadioValue('dyspneaSputumColor', patient.dyspneaSputumColor);
      }
    }

    setChk('dyspnea_has_pleuritic', patient.dyspnea_has_pleuritic);
    setChk('dyspnea_rf_chestpain', patient.dyspnea_rf_chestpain);
    toggleBranch('dyspnea_chestpain_wrap', Boolean(patient.dyspnea_rf_chestpain));
    if (patient.dyspnea_rf_chestpain) {
      setChk('dyspnea_cp_crushing', patient.dyspnea_cp_crushing);
      setChk('dyspnea_cp_rad_arm', patient.dyspnea_cp_rad_arm);
      setChk('dyspnea_cp_gt_20m', patient.dyspnea_cp_gt_20m);
    }

    setChk('dyspnea_has_leg_swelling', patient.dyspnea_has_leg_swelling);
    toggleBranch('dyspnea_leg_wrap', Boolean(patient.dyspnea_has_leg_swelling));
    if (patient.dyspnea_has_leg_swelling) {
      setRadioValue('dyspneaLegType', patient.dyspneaLegType);
      setChk('dyspnea_weight_gain', patient.dyspnea_weight_gain);
    }

    setChk('dyspnea_pe_travel_bedridden', patient.dyspnea_pe_travel_bedridden);
    setChk('dyspnea_has_allergy', patient.dyspnea_has_allergy);
    toggleBranch('dyspnea_allergy_wrap', Boolean(patient.dyspnea_has_allergy));
    if (patient.dyspnea_has_allergy) {
      setChk('dyspnea_allergy_exp_food_med', patient.dyspnea_allergy_exp_food_med);
      setChk('dyspnea_allergy_exp_insect', patient.dyspnea_allergy_exp_insect);
    }

    setChk('dyspnea_has_palpitation', patient.dyspnea_has_palpitation);
    setChk('dyspnea_metabolic_dka', patient.dyspnea_metabolic_dka);
    setChk('dyspnea_metabolic_ckd', patient.dyspnea_metabolic_ckd);
    setChk('dyspnea_hypervent_tingling', patient.dyspnea_hypervent_tingling);

    // Inhaler details in PMH
    const usageVal = patient.ud_inhaler_freq === 'gte_3_times' ? 'ge_3_times' : (patient.ud_inhaler_freq === '1_to_2_times' ? '1_2_times' : 'none');
    setRadioValue('ud_inhaler_usage_24h', usageVal);
    setChk('ud_inhaler_no_relief', patient.ud_inhaler_relief === 'poor');
    setChk('ud_asthma_prior_icu', patient.ud_inhaler_prior_icu === 'yes');
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
      // ------------------ DYSPNEA INTAKE ------------------
      const _rawDur = parseFloat(document.getElementById('dyspneaDurationVal')?.value); const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
      const durationUnit = document.getElementById('dyspneaDurationUnit')?.value || 'hours';
      const dyspneaOnsetMode = document.querySelector('input[name="dyspneaOnsetMode"]:checked')?.value || 'unspecified';
      const dyspneaSeverity = document.querySelector('input[name="dyspneaSeverity"]:checked')?.value || 'unspecified';

      const dyspnea_pos_orthopnea = document.getElementById('dyspnea_pos_orthopnea')?.checked || false;
      const dyspneaOrthopneaPillows = dyspnea_pos_orthopnea ? (document.querySelector('input[name="dyspneaOrthopneaPillows"]:checked')?.value || '2_pillows') : 'none';
      const dyspnea_pos_pnd = document.getElementById('dyspnea_pos_pnd')?.checked || false;
      const dyspnea_pos_trepopnea = document.getElementById('dyspnea_pos_trepopnea')?.checked || false;
      const dyspnea_pos_none = document.getElementById('dyspnea_pos_none')?.checked || false;

      const dyspnea_char_wheezing = document.getElementById('dyspnea_char_wheezing')?.checked || false;
      const dyspnea_char_stridor = document.getElementById('dyspnea_char_stridor')?.checked || false;
      const dyspnea_char_air_hunger = document.getElementById('dyspnea_char_air_hunger')?.checked || false;
      const dyspnea_char_tachypnea = document.getElementById('dyspnea_char_tachypnea')?.checked || false;
      const dyspnea_char_accessory_muscle = document.getElementById('dyspnea_char_accessory_muscle')?.checked || false;
      const dyspnea_char_chest_tightness = document.getElementById('dyspnea_char_chest_tightness')?.checked || false;
      const dyspnea_char_other = document.getElementById('dyspnea_char_other_chk')?.checked ? (document.getElementById('dyspnea_char_other_text')?.value.trim() || '') : '';

      const dyspnea_rf_cyanosis = document.getElementById('dyspnea_rf_cyanosis')?.checked || false;
      const dyspnea_rf_syncope_shock = document.getElementById('dyspnea_rf_syncope')?.checked || false;
      const dyspnea_rf_altered_mental = document.getElementById('dyspnea_rf_altered_mental')?.checked || false;
      const dyspnea_rf_hemoptysis = document.getElementById('dyspnea_rf_hemoptysis')?.checked || false;

      const dyspnea_has_fever = document.getElementById('dyspnea_has_fever')?.checked || false;

      const dyspnea_has_cough = document.getElementById('dyspnea_has_cough')?.checked || false;
      const dyspneaCoughType = dyspnea_has_cough ? (document.querySelector('input[name="dyspneaCoughType"]:checked')?.value || 'dry') : 'none';
      const dyspneaSputumColor = (dyspnea_has_cough && dyspneaCoughType === 'productive') ? (document.querySelector('input[name="dyspneaSputumColor"]:checked')?.value || 'clear') : 'none';

      const dyspnea_has_pleuritic = document.getElementById('dyspnea_has_pleuritic')?.checked || false;

      const dyspnea_rf_chestpain = document.getElementById('dyspnea_rf_chestpain')?.checked || false;
      const dyspnea_cp_crushing = dyspnea_rf_chestpain && (document.getElementById('dyspnea_cp_crushing')?.checked || false);
      const dyspnea_cp_rad_arm = dyspnea_rf_chestpain && (document.getElementById('dyspnea_cp_rad_arm')?.checked || false);
      const dyspnea_cp_gt_20m = dyspnea_rf_chestpain && (document.getElementById('dyspnea_cp_gt_20m')?.checked || false);

      const dyspnea_has_leg_swelling = document.getElementById('dyspnea_has_leg_swelling')?.checked || false;
      const dyspneaLegType = dyspnea_has_leg_swelling ? (document.querySelector('input[name="dyspneaLegType"]:checked')?.value || 'bilateral') : 'none';
      const dyspnea_weight_gain = dyspnea_has_leg_swelling && (document.getElementById('dyspnea_weight_gain')?.checked || false);

      const dyspnea_pe_travel_bedridden = document.getElementById('dyspnea_pe_travel_bedridden')?.checked || false;

      const dyspnea_has_allergy = document.getElementById('dyspnea_has_allergy')?.checked || false;
      const dyspnea_allergy_exp_food_med = dyspnea_has_allergy && (document.getElementById('dyspnea_allergy_exp_food_med')?.checked || false);
      const dyspnea_allergy_exp_insect = dyspnea_has_allergy && (document.getElementById('dyspnea_allergy_exp_insect')?.checked || false);

      const dyspnea_has_palpitation = document.getElementById('dyspnea_has_palpitation')?.checked || false;
      const dyspnea_metabolic_dka = document.getElementById('dyspnea_metabolic_dka')?.checked || false;
      const dyspnea_metabolic_ckd = document.getElementById('dyspnea_metabolic_ckd')?.checked || false;
      const dyspnea_hypervent_tingling = document.getElementById('dyspnea_hypervent_tingling')?.checked || false;

      // Inhaler details in PMH (mapped cleanly from DOM #ud_inhaler_detail_wrap)
      const hasAsthmaCopd = document.getElementById('ud_asthma')?.checked || document.getElementById('ud_copd')?.checked || false;
      const rawInhalerUsage = document.querySelector('input[name="ud_inhaler_usage_24h"]:checked')?.value || document.querySelector('input[name="ud_inhaler_freq"]:checked')?.value || 'none';
      const ud_inhaler_freq = hasAsthmaCopd
        ? (rawInhalerUsage === 'ge_3_times' ? 'gte_3_times' : (rawInhalerUsage === '1_2_times' ? '1_to_2_times' : rawInhalerUsage))
        : 'none';
      const ud_inhaler_relief = hasAsthmaCopd
        ? (document.getElementById('ud_inhaler_no_relief')?.checked
            ? 'poor'
            : (document.querySelector('input[name="ud_inhaler_relief"]:checked')?.value || (ud_inhaler_freq !== 'none' ? 'good' : 'unspecified')))
        : 'unspecified';
      const ud_inhaler_prior_icu = hasAsthmaCopd
        ? (document.getElementById('ud_asthma_prior_icu')?.checked
            ? 'yes'
            : (document.querySelector('input[name="ud_inhaler_prior_icu"]:checked')?.value || 'no'))
        : 'no';

      newPatient = {
        id: recordId,
        queue_number: queueNumber,
        hn: randomHn,
        name: patientName,
        age: patientAge,
        gender: gender,
        chief_complaint: 'dyspnea',
        chief_complaint_title: 'เหนื่อย / หายใจหอบเหนื่อย / หายใจลำบาก',
        status: recordStatus,
        timestamp: new Date().toISOString(),
        durationVal,
        durationUnit,
        dyspneaOnsetMode,
        dyspneaSeverity,
        dyspnea_pos_orthopnea,
        dyspneaOrthopneaPillows,
        dyspnea_pos_pnd,
        dyspnea_pos_trepopnea,
        dyspnea_pos_none,
        dyspnea_char_wheezing,
        dyspnea_char_stridor,
        dyspnea_char_air_hunger,
        dyspnea_char_tachypnea,
        dyspnea_char_accessory_muscle,
        dyspnea_char_chest_tightness,
        dyspnea_char_other,
        dyspnea_rf_cyanosis,
        dyspnea_rf_syncope_shock,
        dyspnea_rf_altered_mental,
        dyspnea_rf_hemoptysis,
        dyspnea_has_fever,
        dyspnea_has_cough,
        dyspneaCoughType,
        dyspneaSputumColor,
        dyspnea_has_pleuritic,
        dyspnea_rf_chestpain,
        dyspnea_cp_crushing,
        dyspnea_cp_rad_arm,
        dyspnea_cp_gt_20m,
        dyspnea_has_leg_swelling,
        dyspneaLegType,
        dyspnea_weight_gain,
        dyspnea_pe_travel_bedridden,
        dyspnea_has_allergy,
        dyspnea_allergy_exp_food_med,
        dyspnea_allergy_exp_insect,
        dyspnea_has_palpitation,
        dyspnea_metabolic_dka,
        dyspnea_metabolic_ckd,
        dyspnea_hypervent_tingling,
        ud_inhaler_freq,
        ud_inhaler_relief,
        ud_inhaler_prior_icu,
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
      p.dyspneaSeverity === 'speaks_in_words' ||
      p.dyspnea_char_accessory_muscle ||
      p.dyspnea_char_stridor ||
      p.dyspnea_rf_cyanosis ||
      p.dyspnea_rf_syncope_shock ||
      p.dyspnea_rf_altered_mental ||
      p.dyspnea_rf_hemoptysis ||
      (p.dyspnea_has_leg_swelling && p.dyspneaLegType === 'unilateral') ||
      (p.dyspnea_has_cough && p.dyspneaSputumColor === 'pink_frothy') ||
      (p.dyspnea_rf_chestpain && (p.dyspnea_cp_crushing || p.dyspnea_cp_rad_arm || p.dyspnea_cp_gt_20m)) ||
      (p.dyspnea_has_allergy && (p.dyspnea_allergy_exp_food_med || p.dyspnea_allergy_exp_insect)) ||
      p.dyspnea_pos_orthopnea || p.dyspnea_pos_pnd ||
      (p.ud_inhaler_freq === 'gte_3_times' || p.ud_inhaler_relief === 'poor' || p.ud_inhaler_prior_icu === 'yes')
    );
  },

  evaluateRedFlags(patient) {
    const redFlags = [];
    if (patient.dyspneaSeverity === 'speaks_in_words' || patient.dyspnea_char_accessory_muscle || patient.dyspnea_char_stridor) {
      redFlags.push({
        key: 'imminent_respiratory_failure',
        textTh: 'เหนื่อยรุนแรงจนพูดได้เป็นคำๆ / ใช้กล้ามเนื้อคอช่วยหายใจ / หายใจมีเสียง Stridor (Imminent Respiratory Failure)',
        risk: 'เสี่ยงภาวะหายใจล้มเหลวเฉียบพลันหรือทางเดินหายใจส่วนบนอุดกั้น (Upper Airway Obstruction / Impending Exhaustion) ต้องเตรียมอุปกรณ์กู้ชีพ ท่อช่วยหายใจ และประเมิน SpO2 ทันที'
      });
    }
    if (patient.dyspnea_rf_cyanosis) {
      redFlags.push({
        key: 'cyanosis_severe_hypoxia',
        textTh: 'ริมฝีปาก เล็บ หรือปลายมือปลายเท้าเขียวคล้ำ (Cyanosis / Severe Hypoxia)',
        risk: 'บ่งชี้ภาวะขาดออกซิเจนในเลือดขั้นรุนแรง (Life-threatening Hypoxemia) ให้ออกซิเจนความเข้มข้นสูงทันที และส่งตรวจ Arterial Blood Gas (ABG)'
      });
    }
    if (patient.dyspnea_rf_syncope_shock) {
      redFlags.push({
        key: 'hemodynamic_shock',
        textTh: 'เหงื่อแตกตัวเย็น หน้ามืด วูบ หรือหมดสติ (Hemodynamic Collapse / Shock)',
        risk: 'เสี่ยงภาวะช็อกร่วมกับการหายใจล้มเหลว (Cardiogenic Shock / Massive PE / Tension Pneumothorax / Septic Shock) ตรวจสัญญาณชีพและเปิดเส้นให้สารน้ำทันที'
      });
    }
    if (patient.dyspnea_rf_altered_mental) {
      redFlags.push({
        key: 'altered_mental_co2_narcosis',
        textTh: 'ซึมลง สับสน เอะอะ หรือหลับปลุกตื่นยาก (Altered Mental Status / CO2 Narcosis)',
        risk: 'เสี่ยงภาวะคาร์บอนไดออกไซด์คั่งในสมอง (Hypercapnic Encephalopathy) หรือสมองขาดออกซิเจนวิกฤต บ่งชี้ภาวะหายใจล้มเหลวระยะสุดท้าย'
      });
    }
    if (patient.dyspnea_rf_hemoptysis || (patient.dyspnea_has_leg_swelling && patient.dyspneaLegType === 'unilateral') || (patient.dyspneaOnsetMode === 'sudden' && (patient.dyspnea_pe_travel_bedridden || patient.dyspnea_has_pleuritic))) {
      redFlags.push({
        key: 'suspected_pulmonary_embolism',
        textTh: 'หอบเหนื่อยฉับพลันร่วมกับขาบวมข้างเดียว / ไอเป็นเลือด / เสี่ยง DVT (Suspected Acute PE)',
        risk: 'เสี่ยงภาวะลิ่มเลือดอุดกั้นในหลอดเลือดปอดเฉียบพลัน (Acute Pulmonary Embolism) ประเมิน Wells’ Score และพิจารณา CTPA / D-dimer ทันที'
      });
    }
    if (patient.dyspnea_rf_chestpain && (patient.dyspnea_cp_crushing || patient.dyspnea_cp_rad_arm || patient.dyspnea_cp_gt_20m)) {
      redFlags.push({
        key: 'suspected_acs',
        textTh: 'เหนื่อยร่วมกับเจ็บแน่นหน้าอกเหมือนของทับ / ร้าวไปกรามหรือแขน / นาน > 20 นาที (Suspected ACS)',
        risk: 'เสี่ยงภาวะกล้ามเนื้อหัวใจขาดเลือดเฉียบพลันที่มีอาการนำด้วย Dyspnea (Angina Equivalent / Acute MI) ต้องทำ EKG 12 สาย ภายใน 10 นาที'
      });
    }
    if (patient.dyspnea_has_allergy && (patient.dyspnea_allergy_exp_food_med || patient.dyspnea_allergy_exp_insect || patient.dyspnea_char_stridor)) {
      redFlags.push({
        key: 'suspected_anaphylaxis',
        textTh: 'หอบเหนื่อยเฉียบพลันร่วมกับผื่นลมพิษ / บวมที่ปาก ตา คอ / หลังรับสัมผัสสิ่งกระตุ้น (Suspected Anaphylaxis)',
        risk: 'เสี่ยงภาวะแพ้รุนแรงทางเดินหายใจบวมอุดกั้น (Anaphylactic Shock / Laryngeal Edema) เตรียมฉีด Adrenaline (1:1,000) IM ทันที'
      });
    }
    if (patient.dyspnea_pos_orthopnea || patient.dyspnea_pos_pnd || (patient.dyspnea_has_cough && patient.dyspneaSputumColor === 'pink_frothy') || (patient.dyspnea_has_leg_swelling && patient.dyspneaLegType === 'bilateral' && patient.dyspnea_weight_gain)) {
      redFlags.push({
        key: 'acute_pulmonary_edema',
        textTh: 'นอนราบไม่ได้ (Orthopnea/PND) / ขาบวมสองข้าง / เสมหะสีชมพูเป็นฟอง (Acute Pulmonary Edema)',
        risk: 'เสี่ยงภาวะน้ำท่วมปอดเฉียบพลันจากหัวใจวาย (Acute Cardiogenic Pulmonary Edema) จัดท่านั่งหย่อนขา ฟังปอด และพิจารณา IV Furosemide'
      });
    }
    if ((patient.underlying?.some(u => u.includes('หอบหืด') || u.includes('Asthma')) || patient.dyspnea_char_wheezing) && (patient.ud_inhaler_freq === 'gte_3_times' || patient.ud_inhaler_relief === 'poor' || patient.ud_inhaler_prior_icu === 'yes')) {
      redFlags.push({
        key: 'severe_asthma_exacerbation',
        textTh: 'หอบหืดกำเริบตอบสนองต่อยาพ่นไม่ดี / พ่นบ่อย ≥ 3 ครั้ง หรือเคยเข้า ICU (Severe Acute Asthma)',
        risk: 'เสี่ยงภาวะหอบหืดกำเริบรุนแรงวิกฤต (Near-fatal / Life-threatening Asthma) เตรียมพ่นยาขยายหลอดลมต่อเนื่องและพิจารณา Systemic Corticosteroids'
      });
    }
    return redFlags;
  },

  updateOutputs(patient) {
    updateDyspneaOutputs(patient);
  },

  generateCds(patient, ctx) {
    const { rfs, ddxList, workupList, managementList } = ctx;
    if (rfs.some(r => r.key === 'acute_pulmonary_edema')) {
      ddxList.push('1. Acute Decompensated Heart Failure (ADHF) / Acute Cardiogenic Pulmonary Edema');
      ddxList.push('2. Acute Coronary Syndrome presenting as Heart Failure (Angina Equivalent)');
      ddxList.push('3. Volume Overload / Renal Failure');
      workupList.push('• 12-lead EKG, Portable CXR upright, Lung Ultrasound (B-lines profile)');
      workupList.push('• Troponin, NT-proBNP, BUN/Cr, Electrolytes, ABG');
      managementList.push('• จัดท่านั่งห้อยขา (Upright position), ให้ออกซิเจน หรือพิจารณา HFNC / Non-invasive Ventilation (BiPAP/CPAP)');
      managementList.push('• พิจารณา IV Loop Diuretic (Furosemide) และ Vasodilator (NTG) หากความดันโลหิตสูง/ปกติ');
    } else if (rfs.some(r => r.key === 'severe_asthma_exacerbation')) {
      ddxList.push('1. Severe Acute Asthma / COPD Exacerbation');
      ddxList.push('2. Secondary Spontaneous Pneumothorax');
      ddxList.push('3. Community-Acquired Pneumonia triggering bronchospasm');
      workupList.push('• SpO2 monitoring, Peak Expiratory Flow Rate (PEFR), ABG หากซึมหรือเหนื่อยรุนแรง');
      workupList.push('• CXR เพื่อแยกภาวะ Pneumothorax หรือ Pneumonia');
      managementList.push('• พ่นยาขยายหลอดลมต่อเนื่อง (SABA + Ipratropium bromide nebulization), ให้ออกซิเจน');
      managementList.push('• ให้ Systemic Corticosteroids เร็วที่สุด และพิจารณา IV Magnesium Sulfate (2 g IV drip) หากอาการรุนแรงไม่ตอบสนอง');
    } else {
      ddxList.push('1. Acute Pulmonary Embolism (PE) / Acute Respiratory Distress');
      ddxList.push('2. Acute Pneumonia / Lower Respiratory Tract Infection');
      ddxList.push('3. Acute Anaphylaxis / Airway Obstruction หรือ Metabolic Acidosis');
      workupList.push('• ตรวจวัด SpO2, Vitals, 12-lead EKG, CXR, Bedside Lung & Cardiac Ultrasound (BLUE protocol)');
      managementList.push('• ประเมิน Airway-Breathing-Circulation (ABC) ทันที เตรียมอุปกรณ์ช่วยหายใจหากมี Stridor หรือใช้ Accessory muscles');
    }
  }
});
