// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 05_dizziness.js
// อาการนำ: เวียนศีรษะ / บ้านหมุน (Dizziness / Vertigo)
// ไฟล์นี้แยกอิสระสำหรับอาการนำ dizziness เพื่อให้ทีมแพทย์และ IT โรงพยาบาลนำไปพัฒนาต่อได้โดยไม่กระทบระบบหลัก
// =========================================================================

function handleDizzinessSensationChange() {
  // Sensation selection callback
}

function handleDizzinessEarChange() {
  const isTinnitus = document.getElementById('dizziness_ear_tinnitus')?.checked || false;
  const isHearingLoss = document.getElementById('dizziness_ear_hearing_loss')?.checked || false;
  const isFullnessPain = document.getElementById('dizziness_ear_fullness_pain')?.checked || false;
  toggleBranch('dizziness_tinnitus_side_wrap', isTinnitus);
  toggleBranch('dizziness_hearing_loss_side_wrap', isHearingLoss);
  toggleBranch('dizziness_fullness_side_wrap', isFullnessPain);
  if (!isTinnitus) {
    const radios = document.querySelectorAll('input[name="dizzinessTinnitusSide"]');
    radios.forEach(r => { r.checked = false; });
  }
  if (!isHearingLoss) {
    const radios = document.querySelectorAll('input[name="dizzinessHearingLossSide"]');
    radios.forEach(r => { r.checked = false; });
  }
  if (!isFullnessPain) {
    const radios = document.querySelectorAll('input[name="dizzinessFullnessSide"]');
    radios.forEach(r => { r.checked = false; });
  }
}

function handleDizzinessVomitChange() {
  const hasVomit = document.getElementById('dizziness_has_nausea_vomit')?.checked || false;
  toggleBranch('dizziness_vomit_detail_wrap', hasVomit);
  if (hasVomit) {
    const vomitStatus = document.querySelector('input[name="dizzinessVomitStatus"]:checked')?.value;
    const isActualVomiting = vomitStatus === 'vomiting';
    toggleBranch('dizziness_vomit_actual_wrap', isActualVomiting);
    if (!isActualVomiting) {
      const vf = document.getElementById('dizzinessVomitFreq');
      if (vf) vf.value = '';
      const cbs = document.querySelectorAll('input[name="dizziness_vomit_content"]');
      cbs.forEach(cb => { cb.checked = false; });
    }
  } else {
    toggleBranch('dizziness_vomit_actual_wrap', false);
    const radios = document.querySelectorAll('input[name="dizzinessVomitStatus"]');
    radios.forEach(r => { r.checked = false; });
    const vf = document.getElementById('dizzinessVomitFreq');
    if (vf) vf.value = '';
    const cbs = document.querySelectorAll('input[name="dizziness_vomit_content"]');
    cbs.forEach(cb => { cb.checked = false; });
  }
}

function handleDizzinessDiarrheaChange() {
  const hasDiarrhea = document.getElementById('dizziness_has_abdcramps_diarrhea')?.checked || false;
  toggleBranch('dizziness_diarrhea_detail_wrap', hasDiarrhea);
  if (!hasDiarrhea) {
    const df = document.getElementById('dizzinessDiarrheaFreq');
    if (df) df.value = '';
    const cbs = document.querySelectorAll('input[name="dizziness_diarrhea_stool"]');
    cbs.forEach(cb => { cb.checked = false; });
  }
}

    function updateDizzinessOutputs(patient) {
      const unitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
      const durationText = patient.durationVal ? `${patient.durationVal} ${unitMap[patient.durationUnit] || 'ชั่วโมง'}` : 'ไม่ระบุ';

      const onsetMap = {
        sudden: 'เริ่มมีอาการเวียนฉับพลันทันที (Sudden onset)',
        gradual: 'ค่อยๆ เริ่มมีอาการ และเป็นเพิ่มขึ้นเรื่อยๆ (Gradual onset)',
        chronic: 'มีอาการเรื้อรัง เป็นๆ หายๆ มานาน (Chronic recurrent)',
        unspecified: 'ไม่ได้ระบุรูปแบบการเริ่ม'
      };

      const sensationMap = {
        vertigo: 'รู้สึกสิ่งแวดล้อมหมุนรอบตัว หรือรู้สึกตัวเองหมุนเคว้ง (True Vertigo / บ้านหมุน)',
        presyncope: 'หน้ามืด ตาลาย คล้ายจะเป็นลม (Presyncope / Lightheadedness)',
        disequilibrium: 'ทรงตัวไม่อยู่ รู้สึกโคลงเคลง เดินเซเหมือนจะล้ม (เหมือนเรือโคลง - Disequilibrium / Ataxia)',
        lightheaded_other: 'มึนศีรษะ ตื้อๆ ลอยๆ โหวงๆ บอกไม่ถูก (Non-specific dizziness)',
        unspecified: 'ไม่ระบุลักษณะการเวียน'
      };

      const episodeMap = {
        seconds_to_1m: 'เป็นวูบสั้นๆ ไม่กี่วินาทีถึง 1 นาที แล้วทุเลาลง (Seconds to < 1 min - สงสัย BPPV)',
        minutes_to_hours: 'เป็นครั้งละหลายนาที หรือนาน 2 - 3 ชั่วโมง (Minutes to hours - สงสัย Meniere / TIA / Migraine)',
        continuous_days: 'เวียนต่อเนื่องตลอดเวลาหลายชั่วโมง หรือติดต่อกันหลายวันไม่หยุด (Continuous hours to days - สงสัย Neuritis / Posterior Circulation Stroke 🚩)',
        unspecified: 'ไม่แน่ชัด / เป็นตลอดเวลาแต่ความรุนแรงไม่เท่ากัน'
      };

      // Triggers
      const triggers = [];
      if (patient.dizziness_trig_head_motion) triggers.push('ขยับศีรษะ พลิกตัวบนที่นอน หรือก้ม/เงยหน้า');
      if (patient.dizziness_trig_postural) triggers.push('เปลี่ยนท่า ลุกขึ้นยืนเร็วๆ จากท่านั่งหรือนอน');
      if (patient.dizziness_trig_valsalva) triggers.push('ไอ จาม เบ่ง หรืออยู่ในที่เสียงดัง');
      if (patient.dizziness_trig_salty_meal) triggers.push('อาการมากขึ้น หลังมื้ออาหารเค็ม');
      if (patient.dizziness_trig_spontaneous) triggers.push('เกิดขึ้นเองเฉยๆ ขณะอยู่นิ่งๆ โดยไม่มีสิ่งกระตุ้น');
      if (patient.dizziness_trig_stress_fatigue) triggers.push('อดนอน พักผ่อนน้อย หรือเครียด');
      if (patient.dizziness_trig_other) triggers.push(`อื่นๆ: ${patient.dizziness_trig_other}`);
      const triggersText = triggers.length > 0 ? triggers.join(', ') : 'ไม่มีสิ่งกระตุ้นจำเพาะ / เกิดขึ้นเอง';

      const positives = [];
      const negatives = [];

      // Core Sensation, Episode & Triggers (Primary descriptors stay in top HPI; not pushed to positives)
      if (triggers.length === 0) {
        negatives.push('ไม่มีท่าทางหรือสิ่งกระตุ้นชัดเจน');
      }

      // Central Red Flags (Stroke / Cerebellar)
      if (patient.dizziness_rf_weakness_numb) positives.push('มีอาการแขนขาอ่อนแรง หรือชาครึ่งซีก 🚩');
      else negatives.push('ไม่มีแขนขาอ่อนแรงหรือชาครึ่งซีก');

      if (patient.dizziness_rf_facial_speech) positives.push('มีมุมปากตก ปากเบี้ยว ยิ้มไม่เท่ากัน หรือพูดไม่ชัด 🚩');
      else negatives.push('ไม่มีปากเบี้ยวหรือพูดไม่ชัด');

      if (patient.dizziness_rf_diplopia_vision) positives.push('มองเห็นภาพซ้อน หรือตามัวเฉียบพลัน 🚩');
      else negatives.push('การมองเห็นปกติ ไม่มีภาพซ้อน');

      if (patient.dizziness_rf_ataxia_walk) positives.push('เดินเซมาก ทรงตัวไม่ได้ ปล่อยมือยืนไม่ได้ หรือล้มไปข้างใดข้างหนึ่ง 🚩');
      else negatives.push('ไม่มีเดินเซรุนแรง สามารถทรงตัวได้');

      if (patient.dizziness_rf_dysphagia) positives.push('มีอาการกลืนลำบาก หรือกลืนสำลัก 🚩');
      else negatives.push('ไม่มีกลืนลำบากหรือสำลัก');

      if (patient.dizziness_rf_headache) positives.push('มีอาการปวดศีรษะรุนแรงเฉียบพลัน หรือปวดร้าวท้ายทอย/ต้นคอ 🚩');
      else negatives.push('ไม่มีปวดศีรษะรุนแรงหรือปวดท้ายทอย');

      // Hemodynamic Red Flags
      if (patient.dizziness_rf_syncope) positives.push('มีอาการวูบ หมดสติ หรือหมดความรู้สึกตัวไปชั่วขณะ 🚩');
      else negatives.push('ไม่มีวูบหมดสติ');

      if (patient.dizziness_rf_chestpain_palp) positives.push('มีอาการเจ็บแน่นหน้าอก หรือใจสั่นเต้นผิดจังหวะ 🚩');
      else negatives.push('ไม่มีเจ็บแน่นหน้าอกหรือใจสั่น');

      if (patient.dizziness_rf_gi_bleed) positives.push('มีประวัติถ่ายดำ ถ่ายเป็นเลือด หรืออาเจียนเป็นเลือด/สีกาแฟ 🚩');
      else negatives.push('ไม่มีถ่ายดำหรืออาเจียนเป็นเลือด');

      // Auditory / Ear symptoms
      const sideMap = { left: 'ข้างซ้าย', right: 'ข้างขวา', both: 'ทั้งสองข้าง', unspecified: 'ไม่ระบุข้าง', none: '' };
      if (patient.dizziness_ear_tinnitus) {
        const side = patient.dizzinessTinnitusSide ? ` [${sideMap[patient.dizzinessTinnitusSide] || patient.dizzinessTinnitusSide}]` : '';
        positives.push(`มีเสียงวิ้งๆ อื้อๆ ในหู (Tinnitus)${side}`);
      } else {
        negatives.push('ไม่มีเสียงวิ้งหรืออื้อในหู');
      }

      if (patient.dizziness_ear_hearing_loss) {
        const side = patient.dizzinessHearingLossSide ? ` [${sideMap[patient.dizzinessHearingLossSide] || patient.dizzinessHearingLossSide}]` : '';
        positives.push(`การได้ยินลดลง หรือหูตึงเฉียบพลัน (Acute hearing loss)${side} 🚩`);
      } else {
        negatives.push('การได้ยินปกติ ไม่มีหูอื้อตึงเฉียบพลัน');
      }

      if (patient.dizziness_ear_fullness_pain) {
        const side = (patient.dizzinessFullnessSide && patient.dizzinessFullnessSide !== 'none') ? ` [${sideMap[patient.dizzinessFullnessSide] || patient.dizzinessFullnessSide}]` : '';
        positives.push(`รู้สึกแน่นตึง อัดอั้นในหู หรือปวดหู (Aural fullness / Otalgia)${side}`);
      }
      if (patient.dizziness_ear_recent_uri) positives.push('มีประวัติเป็นหวัด ติดเชื้อทางเดินหายใจ หรือท้องเสียใน 1-2 สัปดาห์ก่อน');

      // GI & General Symptoms
      if (patient.dizziness_has_nausea_vomit) {
        if (patient.dizzinessVomitStatus === 'vomiting') {
          const vomitContentMap = {
            food_gastric: 'เศษอาหาร/น้ำย่อย',
            bilious_green: 'น้ำดีสีเขียว/เหลือง',
            coffee_ground_blood: 'สีกาแฟหรือมีเลือดปน 🚩'
          };
          const contents = (patient.dizzinessVomitContents || []).map(c => vomitContentMap[c] || c).join(', ');
          positives.push(`มีอาการอาเจียน [จำนวน ${patient.dizzinessVomitFreq || 1} ครั้ง${contents ? `, ลักษณะ: ${contents}` : ''}]`);
        } else {
          positives.push('มีอาการคลื่นไส้เด่นชัด (แต่ไม่อาเจียน)');
        }
      } else {
        negatives.push('ไม่มีอาการคลื่นไส้หรืออาเจียน');
      }

      if (patient.dizziness_has_abdcramps_diarrhea) {
        const stoolMap = {
          watery: 'ถ่ายเป็นน้ำเหลว (Watery)',
          mucous_bloody: 'ถ่ายเป็นมูกเลือด (Mucous bloody 🚩)'
        };
        const stools = (patient.dizzinessDiarrheaStools || []).map(s => stoolMap[s] || s).join(', ');
        positives.push(`มีอาการปวดมวนท้อง หรือถ่ายเหลว/ท้องเสีย [จำนวน ${patient.dizzinessDiarrheaFreq || 1} ครั้ง${stools ? `, ลักษณะ: ${stools}` : ''}]`);
      } else {
        negatives.push('ไม่มีปวดมวนท้องหรือถ่ายเหลว');
      }

      if (patient.dizziness_has_photophobia_migraine) positives.push('มีอาการแพ้แสงจ้า กลัวแสง หรือมีประวัติปวดศีรษะไมเกรน');

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

      // A) Rapid Bullet Format for Dizziness
      const defaultRapid = 
`[Chief Complaint (CC)]
เวียนศีรษะ / บ้านหมุนมา ${durationText}

[History of Present Illness (HPI)]
• การเริ่มต้นและระยะเวลา: ${durationText}, ${onsetMap[patient.dizzinessOnsetMode] || 'ไม่ระบุ'}
• ลักษณะอาการเวียน: ${sensationMap[patient.dizzinessSensation] || 'ไม่ระบุ'}
• ระยะเวลาที่มีอาการต่อรอบ: ${episodeMap[patient.dizzinessEpisodeDuration] || 'ไม่ระบุ'}
• ปัจจัยกระตุ้นและท่าทาง: ${triggersText}

• Pertinent Positives:
${positives.length > 0 ? positives.map(p => `  - ${p}`).join('\n') : '  - ไม่มีอาการร่วมอื่นที่เด่นชัด'}

• Pertinent Negatives:
${negatives.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
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

      // B) Narrative Paragraph Format for Dizziness
      const defaultNarrative = 
`ผู้ป่วย [${patient.name}] อายุ ${patient.age || '-'} ปี เพศ ${patient.gender || 'ไม่ระบุ'} มารับการตรวจที่ห้องฉุกเฉิน รพ.ราชบุรี ด้วยอาการเวียนศีรษะ / บ้านหมุนมา ${durationText}
การเริ่มมีอาการ: ${onsetMap[patient.dizzinessOnsetMode] || 'ไม่ระบุ'} ลักษณะความรู้สึกเวียน: ${sensationMap[patient.dizzinessSensation] || 'ไม่ระบุ'} ระยะเวลาในแต่ละครั้ง: ${episodeMap[patient.dizzinessEpisodeDuration] || 'ไม่ระบุ'} ปัจจัยกระตุ้น: ${triggersText}

อาการร่วมและการซักประวัติตามระบบ: ผู้ป่วยให้ประวัติ ${positives.join(', ')}
อาการสำคัญที่ปฏิเสธ (Pertinent negatives): ${negatives.join(', ')}

ประวัติการเจ็บป่วยในอดีต: [${hospLabel}], โรคประจำตัว: ${patient.underlying?.length > 0 ? patient.underlying.join(', ') : 'ปฏิเสธ'}, ยาประจำตัว: ${medsText}, ประวัติแพ้ยา/แพ้อาหาร: ${patient.drugAllergy || 'ปฏิเสธประวัติแพ้ยา/แพ้อาหาร'}
${patient.redFlags?.length > 0 ? `\n[🚩 แจ้งเตือนสัญญาณวิกฤต (Red Flags)]: ตรวจพบอาการ ${patient.redFlags.map(rf => rf.textTh).join(', ')}` : ''}

[บันทึกการตรวจและการประเมินโดยแพทย์]:
${docNotes.additional_hpi ? `• ประวัติเพิ่มเติม: ${docNotes.additional_hpi}\n` : ''}${docNotes.physical_exam ? `• การตรวจร่างกาย: ${docNotes.physical_exam}\n` : ''}${docNotes.preliminary_dx ? `• การวินิจฉัย: ${docNotes.preliminary_dx}\n` : ''}${docNotes.plan ? `• แผนการรักษา: ${docNotes.plan}` : ''}`;

      document.getElementById('rapidTextView').value = patient.custom_rapid_note || defaultRapid;
      document.getElementById('narrativeTextView').value = patient.custom_narrative_note || defaultNarrative;

      // C) JSON Payload for Dizziness
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
        "chief_complaint": "dizziness",
        "dizziness_history": {
          "duration_value": patient.durationVal || null,
          "duration_unit": patient.durationUnit || null,
          "onset_mode": patient.dizzinessOnsetMode,
          "sensation_type": patient.dizzinessSensation,
          "episode_duration": patient.dizzinessEpisodeDuration,
          "triggers": {
            "head_motion": patient.dizziness_trig_head_motion,
            "postural_change": patient.dizziness_trig_postural,
            "valsalva_or_loud_sound": patient.dizziness_trig_valsalva,
            "salty_meal": patient.dizziness_trig_salty_meal,
            "spontaneous": patient.dizziness_trig_spontaneous,
            "stress_or_fatigue": patient.dizziness_trig_stress_fatigue,
            "other": patient.dizziness_trig_other || ""
          }
        },
        "central_and_hemodynamic_red_flags": {
          "focal_weakness_or_numbness": patient.dizziness_rf_weakness_numb,
          "facial_droop_or_dysarthria": patient.dizziness_rf_facial_speech,
          "diplopia_or_visual_field_loss": patient.dizziness_rf_diplopia_vision,
          "ataxia_or_inability_to_stand": patient.dizziness_rf_ataxia_walk,
          "dysphagia": patient.dizziness_rf_dysphagia,
          "severe_headache": patient.dizziness_rf_headache,
          "syncope_or_collapse": patient.dizziness_rf_syncope,
          "chest_pain_or_palpitation": patient.dizziness_rf_chestpain_palp,
          "gi_bleeding": patient.dizziness_rf_gi_bleed
        },
        "auditory_and_ear_symptoms": {
          "tinnitus": {
            "present": patient.dizziness_ear_tinnitus,
            "side": patient.dizzinessTinnitusSide
          },
          "acute_hearing_loss": {
            "present": patient.dizziness_ear_hearing_loss,
            "side": patient.dizzinessHearingLossSide
          },
          "aural_fullness_or_pain": {
            "present": patient.dizziness_ear_fullness_pain,
            "side": patient.dizzinessFullnessSide || "none"
          },
          "recent_uri_or_infection": patient.dizziness_ear_recent_uri
        },
        "gastrointestinal_and_associated_symptoms": {
          "nausea_and_vomiting": {
            "present": patient.dizziness_has_nausea_vomit,
            "status": patient.dizzinessVomitStatus,
            "frequency": patient.dizzinessVomitFreq,
            "vomit_contents": patient.dizzinessVomitContents
          },
          "abdominal_cramps_and_diarrhea": {
            "present": patient.dizziness_has_abdcramps_diarrhea,
            "frequency": patient.dizzinessDiarrheaFreq,
            "stool_types": patient.dizzinessDiarrheaStools
          },
          "photophobia_or_migraine_history": patient.dizziness_has_photophobia_migraine,
          "other_symptoms_free_text": patient.otherSymptomsFree || ""
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
    // OUTPUT GENERATION: ปวดศีรษะ (Headache)

registerCcModule({
  id: 'dizziness',
  recordCc: 'dizziness',
  titleTh: 'เวียนศีรษะ / บ้านหมุน',
  titleEn: 'Dizziness / Vertigo',
  sectionDomId: 'dizzinessQuestionnaireSection',
  doctorCcBadgeHtml: "<i data-lucide=\"compass\" class=\"w-3 h-3 mr-1\"></i> CC: เวียนศีรษะ / บ้านหมุน (Dizziness / Vertigo)",
  formHtml: "        <div id=\"dizzinessQuestionnaireSection\" class=\"hidden space-y-6\">\n\n          <!-- CARD 1: ระยะเวลาและลักษณะของอาการเวียนศีรษะ (Duration, Onset & Sensation) -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"compass\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-800 section-title\" data-base-title=\"ลักษณะอาการเวียนศีรษะ และระยะเวลา\">1. ลักษณะอาการเวียนศีรษะ และระยะเวลา</h2>\n                <p class=\"text-xs text-slate-500\">โปรดระบุระยะเวลา รูปแบบการเกิด และลักษณะความรู้สึกเวียนที่ตรงกับท่านมากที่สุด</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-5\">\n              <!-- 1.1 ระยะเวลาที่เป็นมา (Universal 6 Units) -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 mb-1.5\">\n                  1.1 เริ่มมีอาการเวียนศีรษะมานานเท่าไรแล้ว? <span class=\"text-rose-500\">*</span>\n                </label>\n                <div class=\"flex space-x-2\">\n                  <input type=\"number\" id=\"dizzinessDurationVal\" min=\"1\" placeholder=\"เช่น 2\"\n                    class=\"w-1/2 bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm\">\n                  <select id=\"dizzinessDurationUnit\"\n                    class=\"w-1/2 bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm\">\n                    <option value=\"minutes\">นาที (Minutes)</option>\n                    <option value=\"hours\">ชั่วโมง (Hours)</option>\n                    <option value=\"days\">วัน (Days)</option>\n                    <option value=\"weeks\">สัปดาห์ (Weeks)</option>\n                    <option value=\"months\">เดือน (Months)</option>\n                    <option value=\"years\">ปี (Years)</option>\n                  </select>\n                </div>\n              </div>\n\n              <!-- 1.2 อาการเริ่มต้นเป็นอย่างไร? -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 mb-1.5\">\n                  1.2 อาการเริ่มต้นเป็นอย่างไร? <span class=\"text-rose-500\">*</span>\n                </label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs\">\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"dizzinessOnsetMode\" value=\"sudden\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium\">เป็นขึ้นมาทันทีทันใดในไม่กี่วินาที</span>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"dizzinessOnsetMode\" value=\"gradual\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium\">ค่อยๆ มึนหรือเวียนมากขึ้นเรื่อยๆ</span>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"dizzinessOnsetMode\" value=\"chronic\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium\">มีอาการเรื้อรัง เป็นๆ หายๆ มานาน</span>\n                  </label>\n                </div>\n              </div>\n\n              <!-- 1.3 ลักษณะความรู้สึกเวียนที่เด่นชัดที่สุด (Single Choice) -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 mb-1.5\">\n                  1.3 ลักษณะความรู้สึกเวียนที่เด่นชัดที่สุด (เลือกข้อที่ตรงที่สุด) <span class=\"text-rose-500\">*</span>\n                </label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"dizzinessSensation\" value=\"vertigo\" onchange=\"handleDizzinessSensationChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-bold text-slate-800 block\">รู้สึกสิ่งแวดล้อมหมุนรอบตัว หรือรู้สึกตัวเองหมุนเคว้ง (บ้านหมุน)</span>\n                      <span class=\"text-[11px] text-slate-500\">มองเห็นเพดานหรือห้องหมุนติ้ว หลับตาแล้วรู้สึกโคลงเคลง</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"dizzinessSensation\" value=\"presyncope\" onchange=\"handleDizzinessSensationChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-bold text-slate-800 block\">หน้ามืด ตาลาย คล้ายจะเป็นลม</span>\n                      <span class=\"text-[11px] text-slate-500\">ตามัว ภาพมืดดับ ชั่วขณะ รู้สึกหวิวๆ เหมือนจะวูบหมดสติ</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"dizzinessSensation\" value=\"disequilibrium\" onchange=\"handleDizzinessSensationChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-bold text-slate-800 block\">ทรงตัวไม่อยู่ รู้สึกโคลงเคลง เดินเซเหมือนจะล้ม (เหมือนเรือโคลง)</span>\n                      <span class=\"text-[11px] text-slate-500\">ศีรษะไม่ได้หมุน แขนขาไม่สัมพันธ์กัน เดินไม่ตรงทาง</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"dizzinessSensation\" value=\"lightheaded_other\" onchange=\"handleDizzinessSensationChange()\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-bold text-slate-800 block\">มึนศีรษะ ตื้อๆ ลอยๆ โหวงๆ บอกไม่ถูก</span>\n                      <span class=\"text-[11px] text-slate-500\">หัวตื้อๆ หนักศีรษะ หรือมีอาการลอยๆ โหวงๆ ในหัว</span>\n                    </div>\n                  </label>\n                </div>\n              </div>\n\n              <!-- 1.4 ระยะเวลาของแต่ละครั้งที่เวียน (Duration of Episodes) -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 mb-1.5\">\n                  1.4 เมื่อมีอาการเวียน แต่ละครั้งมีอาการนานเท่าไร? (Duration of Episodes) <span class=\"text-rose-500\">*</span>\n                </label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"dizzinessEpisodeDuration\" value=\"seconds_to_1m\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2\">\n                      <span class=\"font-semibold text-slate-800 block\">เป็นวูบสั้นๆ ไม่กี่วินาทีถึง 1 นาที แล้วทุเลาลง</span>\n                      <span class=\"text-[11px] text-slate-500\">มักเป็นเฉพาะช่วงเปลี่ยนท่า เมื่ออยู่นิ่งๆ อาการจะค่อยๆ สงบ</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"dizzinessEpisodeDuration\" value=\"minutes_to_hours\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2\">\n                      <span class=\"font-semibold text-slate-800 block\">เป็นครั้งละหลายนาที หรือนาน 2 - 3 ชั่วโมง</span>\n                      <span class=\"text-[11px] text-slate-500\">เวียนเป็นพักๆ ครั้งละหลายนาทีจนถึงเป็นชั่วโมงแล้วค่อยดีขึ้น</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"dizzinessEpisodeDuration\" value=\"continuous_days\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2\">\n                      <span class=\"font-semibold text-slate-800 block\">เวียนต่อเนื่องตลอดเวลาหลายชั่วโมง หรือติดต่อกันหลายวันไม่หยุด</span>\n                      <span class=\"text-[11px] text-slate-500\">นอนพักเฉยๆ ก็ยังเวียนต่อเนื่องตลอดเวลา</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"dizzinessEpisodeDuration\" value=\"unspecified\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2\">\n                      <span class=\"font-semibold text-slate-800 block\">ไม่แน่ชัด / เป็นตลอดเวลาแต่ความรุนแรงไม่เท่ากัน</span>\n                      <span class=\"text-[11px] text-slate-500\">บอกระยะเวลาที่แน่นอนไม่ได้</span>\n                    </div>\n                  </label>\n                </div>\n              </div>\n\n            </div>\n          </div>\n\n          <!-- CARD 2: ปัจจัยกระตุ้นและท่าทาง (Triggers & Positional Factors) -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"zap\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-800 section-title\" data-base-title=\"ปัจจัยกระตุ้นและท่าทาง\">2. ปัจจัยกระตุ้นและท่าทาง</h2>\n                <p class=\"text-xs text-slate-500\">สิ่งกระตุ้นหรือท่าทางที่ทำให้อาการเวียนกำเริบหรือเป็นมากขึ้น (เลือกได้หลายข้อ)</p>\n              </div>\n            </div>\n\n            <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                <input type=\"checkbox\" id=\"dizziness_trig_head_motion\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">ขยับศีรษะ พลิกตัวบนที่นอน หรือก้ม/เงยหน้า</span>\n                  <span class=\"text-[11px] text-slate-500\">เช่น ล้มตัวลงนอน ตะแคงซ้าย/ขวา ก้มหยิบของ หรือเงยหน้ามองที่สูง</span>\n                </div>\n              </label>\n\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                <input type=\"checkbox\" id=\"dizziness_trig_postural\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">เปลี่ยนท่า ลุกขึ้นยืนเร็วๆ จากท่านั่งหรือนอน</span>\n                  <span class=\"text-[11px] text-slate-500\">รู้สึกวูบหรือหน้ามืดขึ้นมาทันทีที่ลุกขึ้นยืน</span>\n                </div>\n              </label>\n\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                <input type=\"checkbox\" id=\"dizziness_trig_valsalva\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">ไอ จาม เบ่ง หรืออยู่ในที่เสียงดัง</span>\n                  <span class=\"text-[11px] text-slate-500\">เวียนศีรษะหรือบ้านหมุนขึ้นมาเมื่อไอแรงๆ เบ่งอุจจาระ หรือได้ยินเสียงดัง</span>\n                </div>\n              </label>\n\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                <input type=\"checkbox\" id=\"dizziness_trig_salty_meal\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">อาการมากขึ้น หลังมื้ออาหารเค็ม</span>\n                  <span class=\"text-[11px] text-slate-500\">เช่น รับประทานอาหารรสเค็มจัด ผงชูรส หรืออาหารหมักดอง</span>\n                </div>\n              </label>\n\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                <input type=\"checkbox\" id=\"dizziness_trig_spontaneous\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">เกิดขึ้นเองเฉยๆ ขณะอยู่นิ่งๆ โดยไม่มีสิ่งกระตุ้น</span>\n                  <span class=\"text-[11px] text-slate-500\">นั่งหรือนอนเฉยๆ ก็มีอาการขึ้นมาเอง</span>\n                </div>\n              </label>\n\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                <input type=\"checkbox\" id=\"dizziness_trig_stress_fatigue\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">อดนอน พักผ่อนน้อย หรือเครียด</span>\n                  <span class=\"text-[11px] text-slate-500\">มีภาวะเหนื่อยล้า พักผ่อนไม่เพียงพอ หรือมีความกังวล</span>\n                </div>\n              </label>\n\n              <!-- ปัจจัยกระตุ้นอื่นๆ (พิมพ์ระบุ) -->\n              <div class=\"sm:col-span-2 pt-1\">\n                <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dizziness_trig_other_chk\" onchange=\"toggleOtherInput('dizziness_trig_other_wrap', this.checked)\" class=\"rounded text-medical-600 h-4 w-4\">\n                  <span class=\"ml-2.5 text-xs font-semibold text-slate-800\">อื่นๆ (พิมพ์ระบุสิ่งกระตุ้นเพิ่มเติม)</span>\n                </label>\n                <div id=\"dizziness_trig_other_wrap\" class=\"hidden mt-2\">\n                  <input type=\"text\" id=\"dizziness_trig_other_text\" placeholder=\"ระบุปัจจัยกระตุ้นหรือท่าทางเพิ่มเติม...\"\n                    class=\"w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white placeholder:text-slate-400\">\n                </div>\n              </div>\n            </div>\n          </div>\n\n          <!-- CARD 3: อาการร่วมทางหู คอ จมูก (ENT / Otologic Symptoms) -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"volume-2\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-800 section-title\" data-base-title=\"อาการร่วมทางหู คอ จมูก\">3. อาการร่วมทางหู คอ จมูก</h2>\n                <p class=\"text-xs text-slate-500\">ประเมินอาการทางระบบการได้ยินและการทรงตัวของหูชั้นใน (เลือกได้หลายข้อ หรือไม่ต้องเลือกหากไม่มี)</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4\">\n              <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                <!-- 1. การได้ยินลดลง / หูตึงเฉียบพลัน -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dizziness_ear_hearing_loss\" onchange=\"handleDizzinessEarChange()\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block\">การได้ยินลดลง หรือหูตึงเฉียบพลัน (Acute hearing loss)</span>\n                    <span class=\"text-[11px] text-slate-500\">หูตึงทันทีทันใด ได้ยินเสียงพูดไม่ชัดเจนเหมือนมีอะไรมาอุดหู</span>\n                  </div>\n                </label>\n\n                <!-- 2. มีเสียงวิ้งๆ ในหู (Tinnitus) -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dizziness_ear_tinnitus\" onchange=\"handleDizzinessEarChange()\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block\">มีเสียงวิ้งๆ อื้อๆ ในหู (Tinnitus)</span>\n                    <span class=\"text-[11px] text-slate-500\">ได้ยินเสียงจิ้งหรีด เสียงจักจั่น หรือเสียงลมในหูข้างใดข้างหนึ่ง</span>\n                  </div>\n                </label>\n\n                <!-- 3. แน่นตึงในหู / ปวดหู (เพิ่มการเลือกข้างซ้าย/ขวา/ทั้งสองข้าง) -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dizziness_ear_fullness_pain\" onchange=\"handleDizzinessEarChange()\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block\">รู้สึกแน่นตึง อัดอั้นในหู หรือปวดหู</span>\n                    <span class=\"text-[11px] text-slate-500\">รู้สึกเหมือนมีแรงดันในหู หรือมีน้ำไหลออกจากช่องหู</span>\n                  </div>\n                </label>\n\n                <!-- 4. ประวัติเป็นหวัดนำมาก่อน -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dizziness_ear_recent_uri\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block\">มีประวัติเป็นหวัด ติดเชื้อทางเดินหายใจ หรือท้องเสียนำมาก่อนใน 1-2 สัปดาห์</span>\n                    <span class=\"text-[11px] text-slate-500\">เช่น ไข้หวัด มีน้ำมูก เจ็บคอ หรือถ่ายเหลวก่อนจะเริ่มเวียนศีรษะ</span>\n                  </div>\n                </label>\n              </div>\n\n              <!-- กิ่งเจาะลึก: ตำแหน่งหูที่การได้ยินลดลง (Hearing Loss) -->\n              <div id=\"dizziness_hearing_loss_side_wrap\" class=\"hidden bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs\">\n                <span class=\"font-semibold text-slate-800 block\">ตำแหน่งหูที่มีอาการหูตึง / การได้ยินลดลง:</span>\n                <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2\">\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"dizzinessHearingLossSide\" value=\"left\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium\">หูข้างซ้าย</span>\n                  </label>\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"dizzinessHearingLossSide\" value=\"right\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium\">หูข้างขวา</span>\n                  </label>\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"dizzinessHearingLossSide\" value=\"both\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium\">ทั้งสองข้าง</span>\n                  </label>\n                </div>\n              </div>\n\n              <!-- กิ่งเจาะลึก: ตำแหน่งหูที่มีเสียงวิ้งๆ (Tinnitus) -->\n              <div id=\"dizziness_tinnitus_side_wrap\" class=\"hidden bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs\">\n                <span class=\"font-semibold text-slate-800 block\">ตำแหน่งหูที่มีเสียงวิ้งๆ ในหู:</span>\n                <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2\">\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"dizzinessTinnitusSide\" value=\"left\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium\">หูข้างซ้าย</span>\n                  </label>\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"dizzinessTinnitusSide\" value=\"right\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium\">หูข้างขวา</span>\n                  </label>\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"dizzinessTinnitusSide\" value=\"both\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium\">ทั้งสองข้าง</span>\n                  </label>\n                </div>\n              </div>\n\n              <!-- กิ่งเจาะลึก: ตำแหน่งหูที่รู้สึกแน่นตึง อัดอั้น หรือปวดหู -->\n              <div id=\"dizziness_fullness_side_wrap\" class=\"hidden bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs\">\n                <span class=\"font-semibold text-slate-800 block\">ตำแหน่งหูที่รู้สึกแน่นตึง อัดอั้น หรือปวดหู:</span>\n                <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2\">\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"dizzinessFullnessSide\" value=\"left\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium\">หูข้างซ้าย</span>\n                  </label>\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"dizzinessFullnessSide\" value=\"right\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium\">หูข้างขวา</span>\n                  </label>\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"dizzinessFullnessSide\" value=\"both\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium\">ทั้งสองข้าง</span>\n                  </label>\n                </div>\n              </div>\n\n            </div>\n          </div>\n\n          <!-- CARD 4: อาการร่วมทางระบบประสาท และอาการร่วมสำคัญ (Neurological & Critical Red Flags) -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"shield-alert\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-800 section-title\" data-base-title=\"อาการร่วมทางระบบประสาท และอาการร่วมสำคัญ\">4. อาการร่วมทางระบบประสาท และอาการร่วมสำคัญ</h2>\n                <p class=\"text-xs text-slate-500\">กรุณาเลือกอาการที่ท่านมีร่วมด้วยอย่างตรงไปตรงมา (เลือกได้หลายข้อ หรือไม่ต้องเลือกหากไม่มี)</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4\">\n              <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                <!-- 1. แขนขาอ่อนแรง / ชาครึ่งซีก -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dizziness_rf_weakness_numb\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block\">แขนขาอ่อนแรง หรือชาครึ่งซีก / ยกแขนไม่ขึ้น</span>\n                    <span class=\"text-[11px] text-slate-500\">แรงแขนหรือขาข้างใดข้างหนึ่งลดลง ถือของหล่น หรือเดินเซเนื่องจากขาไม่มีแรง</span>\n                  </div>\n                </label>\n\n                <!-- 2. ปากเบี้ยว / พูดไม่ชัด -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dizziness_rf_facial_speech\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block\">มุมปากตก ปากเบี้ยว ยิ้มไม่เท่ากัน หรือพูดไม่ชัด พูดอ้อแอ้</span>\n                    <span class=\"text-[11px] text-slate-500\">พูดติดขัด พูดไม่เป็นคำ หรือนึกคำพูดไม่ออก</span>\n                  </div>\n                </label>\n\n                <!-- 3. มองเห็นภาพซ้อน -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dizziness_rf_diplopia_vision\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block\">มองเห็นภาพซ้อน หรือลานสายตาดับมืดเฉียบพลัน</span>\n                    <span class=\"text-[11px] text-slate-500\">มองเห็นวัตถุแยกเป็น 2 ภาพเมื่อลืมตาทั้งสองข้าง หรือตาข้างใดข้างหนึ่งมัวลงทันที</span>\n                  </div>\n                </label>\n\n                <!-- 4. เดินเซมาก ทรงตัวไม่ได้เลย -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dizziness_rf_ataxia_walk\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block\">เดินเซมาก ทรงตัวไม่ได้เลย ปล่อยมือยืนเองไม่ได้ หรือล้มไปข้างใดข้างหนึ่ง</span>\n                    <span class=\"text-[11px] text-slate-500\">ไม่สามารถเดินก้าวต่อเท้า หรือนั่งทรงตัวไม่ได้แม้พยายาม</span>\n                  </div>\n                </label>\n\n                <!-- 5. กลืนลำบาก / สำลัก -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dizziness_rf_dysphagia\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block\">กลืนลำบาก หรือกลืนสำลักน้ำและอาหาร</span>\n                    <span class=\"text-[11px] text-slate-500\">กลืนน้ำแล้วสำลักทันที หรือกลืนอาหารไม่ลง</span>\n                  </div>\n                </label>\n\n                <!-- 6. ปวดศีรษะรุนแรงเฉียบพลัน -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dizziness_rf_headache\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block\">ปวดศีรษะรุนแรงเฉียบพลัน หรือปวดร้าวท้ายทอย/ต้นคอรุนแรง</span>\n                    <span class=\"text-[11px] text-slate-500\">ปวดขึ้นมาทันทีอย่างรุนแรงที่สุดในชีวิต หรือปวดเกร็งตึงบริเวณท้ายทอย</span>\n                  </div>\n                </label>\n\n                <!-- 7. วูบหมดสติ -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dizziness_rf_syncope\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block\">มีอาการวูบหมดสติ หรือเกือบหมดสติไปชั่วขณะ</span>\n                    <span class=\"text-[11px] text-slate-500\">หมดสติไปชั่วคราว มีผู้พบเห็นว่าล้มพับไป หรือไม่รู้สึกตัวช่วงสั้นๆ</span>\n                  </div>\n                </label>\n\n                <!-- 8. เจ็บแน่นหน้าอก / ใจสั่น -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"dizziness_rf_chestpain_palp\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block\">มีอาการเจ็บแน่นหน้าอก หรือใจสั่นเต้นผิดจังหวะร่วมด้วย</span>\n                    <span class=\"text-[11px] text-slate-500\">ใจสั่นเต้นรัว หัวใจเต้นสะดุด หรือแน่นหน้าอกก่อนมีอาการเวียน</span>\n                  </div>\n                </label>\n\n                <!-- 9. แพ้แสงจ้า / ประวัติไมเกรน (นำมารวมในหมวดระบบประสาทตามคำสั่งข้อ 3) -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer sm:col-span-2\">\n                  <input type=\"checkbox\" id=\"dizziness_has_photophobia_migraine\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block\">มีอาการแพ้แสงจ้า กลัวแสง หรือมีประวัติปวดไมเกรน</span>\n                    <span class=\"text-[11px] text-slate-500\">รู้สึกเคืองตาเวลาเจอแสงจ้า หรือมีประวัติปวดศีรษะตุ๊บๆ ข้างเดียว (Vestibular Migraine)</span>\n                  </div>\n                </label>\n              </div>\n            </div>\n          </div>\n\n          <!-- CARD 5: อาการทางเดินอาหาร (Gastrointestinal Symptoms) -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"activity\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-800 section-title\" data-base-title=\"อาการทางเดินอาหาร\">5. อาการทางเดินอาหาร</h2>\n                <p class=\"text-xs text-slate-500\">ประเมินภาวะเลือดออกในทางเดินอาหาร คลื่นไส้อาเจียน และการสูญเสียน้ำ (เลือกได้หลายข้อ หรือไม่ต้องเลือกหากไม่มี)</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4 text-xs\">\n              <!-- 1. ถ่ายดำ / อาเจียนเป็นเลือด (ย้ายมาจากหมวด Red Flags เดิม ตามคำสั่งข้อ 3) -->\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                <input type=\"checkbox\" id=\"dizziness_rf_gi_bleed\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">ถ่ายอุจจาระสีดำเหนียวคล้ายยางมะตอย หรืออาเจียนเป็นเลือด</span>\n                  <span class=\"text-[11px] text-slate-500\">สงสัยภาวะเสียเลือดภายในทางเดินอาหาร หรือซีดเพลียมาก</span>\n                </div>\n              </label>\n\n              <!-- 2. คลื่นไส้ หรือ อาเจียน -->\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                <input type=\"checkbox\" id=\"dizziness_has_nausea_vomit\" onchange=\"handleDizzinessVomitChange()\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">มีอาการคลื่นไส้ หรืออาเจียน</span>\n                  <span class=\"text-[11px] text-slate-500\">มักพบร่วมกับอาการเวียนศีรษะหรือบ้านหมุน</span>\n                </div>\n              </label>\n\n              <!-- กิ่งเจาะลึก: คลื่นไส้ / อาเจียน -->\n              <div id=\"dizziness_vomit_detail_wrap\" class=\"hidden bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3\">\n                <span class=\"font-semibold text-slate-800 block\">ลักษณะอาการคลื่นไส้/อาเจียน:</span>\n                \n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2\">\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"dizzinessVomitStatus\" value=\"nausea_only\" onchange=\"handleDizzinessVomitChange()\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium\">มีแต่คลื่นไส้ พะอืดพะอม ยังไม่อาเจียน</span>\n                  </label>\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"dizzinessVomitStatus\" value=\"vomiting\" onchange=\"handleDizzinessVomitChange()\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium\">มีอาเจียนออกมาจริง</span>\n                  </label>\n                </div>\n\n                <!-- ช่องระบุจำนวนครั้งและลักษณะสิ่งอาเจียน (แสดงเมื่อเลือก vomiting) -->\n                <div id=\"dizziness_vomit_actual_wrap\" class=\"hidden space-y-3 pt-2 border-t border-slate-200\">\n                  <div>\n                    <label class=\"block text-slate-700 font-semibold mb-1\">จำนวนครั้งที่อาเจียน (ครั้ง/วัน):</label>\n                    <input type=\"number\" id=\"dizzinessVomitFreq\" min=\"1\" placeholder=\"เช่น 2 หรือ 3 ครั้ง\"\n                      class=\"w-full sm:w-48 bg-white border border-slate-300 rounded-lg p-2 text-slate-800 text-xs\">\n                  </div>\n\n                  <div>\n                    <span class=\"block text-slate-700 font-semibold mb-1\">สิ่งที่อาเจียนออกมา (เลือกได้หลายข้อ):</span>\n                    <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2\">\n                      <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                        <input type=\"checkbox\" name=\"dizziness_vomit_content\" value=\"food_gastric\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                        <span class=\"ml-2 font-medium\">เศษอาหาร / น้ำย่อยกระเพาะ</span>\n                      </label>\n                      <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                        <input type=\"checkbox\" name=\"dizziness_vomit_content\" value=\"bilious_green\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                        <span class=\"ml-2 font-medium\">น้ำดีสีเหลือง/เขียวขม</span>\n                      </label>\n                      <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                        <input type=\"checkbox\" name=\"dizziness_vomit_content\" value=\"coffee_ground_blood\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                        <span class=\"ml-2 font-semibold text-slate-800\">สีกาแฟ หรือมีเลือดปน</span>\n                      </label>\n                    </div>\n                  </div>\n                </div>\n              </div>\n\n              <!-- 3. ปวดมวนท้อง หรือ ถ่ายเหลว/ท้องเสีย -->\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                <input type=\"checkbox\" id=\"dizziness_has_abdcramps_diarrhea\" onchange=\"handleDizzinessDiarrheaChange()\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">มีอาการปวดมวนท้อง หรือถ่ายเหลว/ท้องเสีย</span>\n                  <span class=\"text-[11px] text-slate-500\">อาการของการติดเชื้อทางเดินอาหาร (AGE) หรือภาวะขาดน้ำที่อาจเป็นสาเหตุของอาการเวียน/หน้ามืด</span>\n                </div>\n              </label>\n\n              <!-- กิ่งเจาะลึก: ถ่ายเหลว / ท้องเสีย -->\n              <div id=\"dizziness_diarrhea_detail_wrap\" class=\"hidden bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3\">\n                <span class=\"font-semibold text-slate-800 block\">รายละเอียดการขับถ่าย:</span>\n                <div>\n                  <label class=\"block text-slate-700 font-semibold mb-1\">จำนวนครั้งที่ถ่ายเหลว (ครั้ง/วัน):</label>\n                  <input type=\"number\" id=\"dizzinessDiarrheaFreq\" min=\"1\" placeholder=\"เช่น 3 หรือ 4 ครั้ง\"\n                    class=\"w-full sm:w-48 bg-white border border-slate-300 rounded-lg p-2 text-slate-800 text-xs\">\n                </div>\n                <div>\n                  <span class=\"block text-slate-700 font-semibold mb-1\">ลักษณะอุจจาระ (เลือกได้หลายข้อ):</span>\n                  <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2\">\n                    <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"checkbox\" name=\"dizziness_diarrhea_stool\" value=\"watery\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium\">ถ่ายเป็นน้ำเหลว หรือเนื้อปนน้ำ</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"checkbox\" name=\"dizziness_diarrhea_stool\" value=\"mucous_bloody\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-semibold text-slate-800\">มีมูกเลือดปน</span>\n                    </label>\n                  </div>\n                </div>\n              </div>\n\n            </div>\n          </div>\n\n          <!-- อาการอื่นๆ เป็นช่องกรอกอิสระ -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100\">\n              <div class=\"bg-slate-100 text-slate-600 p-2 rounded-xl\">\n                <i data-lucide=\"message-square-plus\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-800\">อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2>\n                <p class=\"text-xs text-slate-500\">ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี เช่น อ่อนเพลียมาก, แน่นหน้าอก, วิงเวียนศีรษะ)</p>\n              </div>\n            </div>\n            <textarea id=\"dizziness_other_free\" rows=\"2\" placeholder=\"พิมพ์ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)...\" \n              class=\"w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white\"></textarea>\n          </div>\n\n        </div> <!-- END DIZZINESS QUESTIONNAIRE SECTION -->\n",
  algorithm: {
  "id": "dizziness",
  "schemaCode": "dizziness_vertigo",
  "titleTh": "เวียนศีรษะ / บ้านหมุน",
  "titleEn": "Dizziness / Vertigo",
  "sections": [
    {
      "sectionNo": 1,
      "titleTh": "ลักษณะความรู้สึกและระยะเวลา (Quality, Onset & Duration)",
      "questions": [
        {
          "key": "duration",
          "labelTh": "เริ่มมีอาการเวียนศีรษะมานานเท่าไรแล้ว?",
          "type": "duration_with_unit",
          "units": "UNIVERSAL_DURATION_UNITS"
        },
        {
          "key": "dizzinessOnsetMode",
          "labelTh": "อาการเริ่มต้นเป็นอย่างไร?",
          "type": "single_choice",
          "options": [
            {
              "value": "sudden",
              "patientTh": "เป็นขึ้นมาทันทีทันใดในไม่กี่วินาที (Sudden onset)",
              "doctorTh": "Sudden onset"
            },
            {
              "value": "gradual",
              "patientTh": "ค่อยๆ มึนหรือเวียนมากขึ้นเรื่อยๆ (Gradual worsening)",
              "doctorTh": "Gradual onset"
            },
            {
              "value": "chronic",
              "patientTh": "มีอาการเรื้อรัง เป็นๆ หายๆ มานาน (Chronic recurrent)",
              "doctorTh": "Chronic recurrent"
            }
          ]
        },
        {
          "key": "dizzinessSensation",
          "labelTh": "ลักษณะความรู้สึกเวียนที่เด่นชัดที่สุด (เลือกข้อที่ตรงที่สุด)",
          "type": "single_choice",
          "options": [
            {
              "value": "vertigo",
              "patientTh": "รู้สึกสิ่งแวดล้อมหมุนรอบตัว หรือรู้สึกตัวเองหมุนเคว้ง (บ้านหมุน)",
              "doctorTh": "True Vertigo"
            },
            {
              "value": "presyncope",
              "patientTh": "หน้ามืด ตาลาย คล้ายจะเป็นลม",
              "doctorTh": "Presyncope / Lightheadedness"
            },
            {
              "value": "disequilibrium",
              "patientTh": "ทรงตัวไม่อยู่ รู้สึกโคลงเคลง เดินเซเหมือนจะล้ม (เหมือนเรือโคลง)",
              "doctorTh": "Disequilibrium / Ataxia"
            },
            {
              "value": "lightheaded_other",
              "patientTh": "มึนศีรษะ ตื้อๆ ลอยๆ โหวงๆ บอกไม่ถูก",
              "doctorTh": "Non-specific dizziness"
            }
          ]
        },
        {
          "key": "dizzinessEpisodeDuration",
          "labelTh": "ระยะเวลาของแต่ละครั้งที่เวียน (Duration of Episodes)",
          "type": "single_choice",
          "options": [
            {
              "value": "seconds_to_1m",
              "patientTh": "เป็นวูบสั้นๆ ไม่กี่วินาทีถึง 1 นาที แล้วทุเลาลง",
              "doctorTh": "Seconds to < 1 min (Suspect BPPV)"
            },
            {
              "value": "minutes_to_hours",
              "patientTh": "เป็นครั้งละหลายนาที หรือนาน 2 - 3 ชั่วโมง",
              "doctorTh": "Minutes to hours (Suspect Meniere / TIA / Migraine)"
            },
            {
              "value": "continuous_days",
              "patientTh": "เวียนต่อเนื่องตลอดเวลาหลายชั่วโมง หรือติดต่อกันหลายวันไม่หยุด",
              "doctorTh": "Continuous hours to days (Suspect Neuritis / Posterior Stroke 🚩)",
              "isRedFlag": true
            },
            {
              "value": "unspecified",
              "patientTh": "ไม่แน่ชัด / เป็นตลอดเวลาแต่ความรุนแรงไม่เท่ากัน",
              "doctorTh": "Unspecified pattern"
            }
          ]
        }
      ]
    },
    {
      "sectionNo": 2,
      "titleTh": "ปัจจัยกระตุ้นและท่าทาง (Triggers & Positional Factors)",
      "items": [
        {
          "key": "dizziness_trig_head_motion",
          "patientTh": "ขยับศีรษะ พลิกตัวบนที่นอน หรือก้ม/เงยหน้า"
        },
        {
          "key": "dizziness_trig_postural",
          "patientTh": "เปลี่ยนท่า ลุกขึ้นยืนเร็วๆ จากท่านั่งหรือนอน"
        },
        {
          "key": "dizziness_trig_valsalva",
          "patientTh": "ไอ จาม เบ่ง หรืออยู่ในที่เสียงดัง"
        },
        {
          "key": "dizziness_trig_salty_meal",
          "patientTh": "อาการมากขึ้น หลังมื้ออาหารเค็ม"
        },
        {
          "key": "dizziness_trig_spontaneous",
          "patientTh": "เกิดขึ้นเองเฉยๆ ขณะอยู่นิ่งๆ โดยไม่มีสิ่งกระตุ้น"
        },
        {
          "key": "dizziness_trig_stress_fatigue",
          "patientTh": "อดนอน พักผ่อนน้อย หรือเครียด"
        },
        {
          "key": "dizziness_trig_other",
          "patientTh": "อื่นๆ (พิมพ์ระบุสิ่งกระตุ้นเพิ่มเติม)"
        }
      ]
    },
    {
      "sectionNo": 3,
      "titleTh": "อาการร่วมทางหู คอ จมูก (ENT / Otologic Symptoms)",
      "items": [
        {
          "key": "dizziness_ear_hearing_loss",
          "patientTh": "การได้ยินลดลง หรือหูตึงเฉียบพลัน (Acute hearing loss)",
          "isRedFlag": true
        },
        {
          "key": "dizziness_ear_tinnitus",
          "patientTh": "มีเสียงวิ้งๆ อื้อๆ ในหู (Tinnitus)"
        },
        {
          "key": "dizziness_ear_fullness_pain",
          "patientTh": "รู้สึกแน่นตึง อัดอั้นในหู หรือปวดหู"
        },
        {
          "key": "dizziness_ear_recent_uri",
          "patientTh": "มีประวัติเป็นหวัด ติดเชื้อทางเดินหายใจ หรือท้องเสียนำมาก่อนใน 1-2 สัปดาห์"
        }
      ]
    },
    {
      "sectionNo": 4,
      "titleTh": "อาการร่วมทางระบบประสาท และอาการร่วมสำคัญ (Neurological & Critical Red Flags)",
      "items": [
        {
          "key": "dizziness_rf_weakness_numb",
          "patientTh": "แขนขาอ่อนแรง หรือชาครึ่งซีก / ยกแขนไม่ขึ้น",
          "isRedFlag": true
        },
        {
          "key": "dizziness_rf_facial_speech",
          "patientTh": "มุมปากตก ปากเบี้ยว ยิ้มไม่เท่ากัน หรือพูดไม่ชัด พูดอ้อแอ้",
          "isRedFlag": true
        },
        {
          "key": "dizziness_rf_diplopia_vision",
          "patientTh": "มองเห็นภาพซ้อน หรือลานสายตาดับมืดเฉียบพลัน",
          "isRedFlag": true
        },
        {
          "key": "dizziness_rf_ataxia_walk",
          "patientTh": "เดินเซมาก ทรงตัวไม่ได้เลย ปล่อยมือยืนเองไม่ได้ หรือล้มไปข้างใดข้างหนึ่ง",
          "isRedFlag": true
        },
        {
          "key": "dizziness_rf_dysphagia",
          "patientTh": "กลืนลำบาก หรือกลืนสำลักน้ำและอาหาร",
          "isRedFlag": true
        },
        {
          "key": "dizziness_rf_headache",
          "patientTh": "ปวดศีรษะรุนแรงเฉียบพลัน หรือปวดร้าวท้ายทอย/ต้นคอรุนแรง",
          "isRedFlag": true
        },
        {
          "key": "dizziness_rf_syncope",
          "patientTh": "มีอาการวูบหมดสติ หรือเกือบหมดสติไปชั่วขณะ",
          "isRedFlag": true
        },
        {
          "key": "dizziness_rf_chestpain_palp",
          "patientTh": "มีอาการเจ็บแน่นหน้าอก หรือใจสั่นเต้นผิดจังหวะร่วมด้วย",
          "isRedFlag": true
        },
        {
          "key": "dizziness_has_photophobia_migraine",
          "patientTh": "มีอาการแพ้แสงจ้า กลัวแสง หรือมีประวัติปวดไมเกรน"
        }
      ]
    },
    {
      "sectionNo": 5,
      "titleTh": "อาการทางเดินอาหาร (Gastrointestinal Symptoms)",
      "items": [
        {
          "key": "dizziness_rf_gi_bleed",
          "patientTh": "ถ่ายอุจจาระสีดำเหนียวคล้ายยางมะตอย หรืออาเจียนเป็นเลือด",
          "isRedFlag": true
        },
        {
          "key": "dizziness_has_nausea_vomit",
          "patientTh": "มีอาการคลื่นไส้ หรืออาเจียน"
        },
        {
          "key": "dizziness_has_abdcramps_diarrhea",
          "patientTh": "มีอาการปวดมวนท้อง หรือถ่ายเหลว/ท้องเสีย"
        }
      ]
    }
  ]
},
  seedPatients: [
  {
    "id": "case-061",
    "queue_number": "A-061",
    "hn": "6708912",
    "name": "นางสมศรี ศิริพร",
    "age": 54,
    "gender": "หญิง",
    "chief_complaint": "dizziness",
    "chief_complaint_title": "เวียนศีรษะ / บ้านหมุน",
    "status": "waiting",
    "timestamp": "2026-10-26T02:21:26.424Z",
    "durationVal": 2,
    "durationUnit": "days",
    "dizzinessOnsetMode": "sudden",
    "dizzinessSensation": "vertigo",
    "dizzinessEpisodeDuration": "seconds_to_1m",
    "dizziness_trig_head_motion": true,
    "dizziness_trig_postural": false,
    "dizziness_trig_valsalva": false,
    "dizziness_trig_salty_meal": false,
    "dizziness_trig_spontaneous": false,
    "dizziness_trig_stress_fatigue": true,
    "dizziness_trig_other": "",
    "dizziness_rf_weakness_numb": false,
    "dizziness_rf_facial_speech": false,
    "dizziness_rf_diplopia_vision": false,
    "dizziness_rf_ataxia_walk": false,
    "dizziness_rf_dysphagia": false,
    "dizziness_rf_headache": false,
    "dizziness_rf_syncope": false,
    "dizziness_rf_chestpain_palp": false,
    "dizziness_rf_gi_bleed": false,
    "dizziness_ear_tinnitus": false,
    "dizzinessTinnitusSide": "none",
    "dizziness_ear_hearing_loss": false,
    "dizzinessHearingLossSide": "none",
    "dizziness_ear_fullness_pain": false,
    "dizzinessFullnessSide": "none",
    "dizziness_ear_recent_uri": false,
    "dizziness_has_nausea_vomit": true,
    "dizzinessVomitStatus": "vomiting",
    "dizzinessVomitFreq": 2,
    "dizziness_vomit_contents": [
      "food_gastric"
    ],
    "dizziness_has_abdcramps_diarrhea": false,
    "dizzinessDiarrheaFreq": 0,
    "dizziness_diarrhea_stools": [],
    "dizziness_has_photophobia_migraine": false,
    "hospRecordStatus": "self",
    "underlying": [
      "ไขมันในเลือดสูง (DLP)"
    ],
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "Simvastatin 20 mg 1 tab hs",
    "doctor_notes": {
      "additional_hpi": "ผู้ป่วยมีอาการเวียนบ้านหมุนเฉียบพลันเวลาตื่นนอนตอนเช้า หมุนวูบขึ้นมาประมาณ 30 วินาที เฉพาะเวลาล้มตัวลงนอนหรือพลิกตัวตะแคงขวา นอนนิ่งๆ แล้วดีขึ้น มีคลื่นไส้อาเจียนเศษอาหาร 2 ครั้ง ปฏิเสธหูอื้อ หูตึง ไม่มีแขนขาอ่อนแรงหรือพูดไม่ชัด",
      "physical_exam": "Alert, good consciousness. BT 36.7 C, PR 78/min, RR 18/min, BP 128/82 mmHg. Neuro: CN intact, no facial palsy, no motor/sensory deficit, cerebellar signs negative, no spontaneous nystagmus. Dix-Hallpike test on right: positive with torsional upbeating nystagmus with latency 3 sec, lasting 25 sec with reproduction of vertigo.",
      "preliminary_dx": "Benign Paroxysmal Positional Vertigo (BPPV) right posterior semicircular canal",
      "plan": "Perform Epley Maneuver right side, Dimenhydrinate (50) 1 tab po tid pc prn, Post-maneuver instructions, Advice return to ER if any neurological red flags develop"
    }
  },
  {
    "id": "case-062",
    "queue_number": "A-062",
    "hn": "6704192",
    "name": "นายบุญมี ทรัพย์ประเสริฐ",
    "age": 68,
    "gender": "ชาย",
    "chief_complaint": "dizziness",
    "chief_complaint_title": "เวียนศีรษะ / บ้านหมุน",
    "status": "waiting",
    "timestamp": "2026-10-26T02:06:26.424Z",
    "durationVal": 4,
    "durationUnit": "hours",
    "dizzinessOnsetMode": "sudden",
    "dizzinessSensation": "vertigo",
    "dizzinessEpisodeDuration": "continuous_days",
    "dizziness_trig_head_motion": false,
    "dizziness_trig_postural": false,
    "dizziness_trig_valsalva": false,
    "dizziness_trig_salty_meal": false,
    "dizziness_trig_spontaneous": true,
    "dizziness_trig_stress_fatigue": false,
    "dizziness_trig_other": "",
    "dizziness_rf_weakness_numb": false,
    "dizziness_rf_facial_speech": true,
    "dizziness_rf_diplopia_vision": true,
    "dizziness_rf_ataxia_walk": true,
    "dizziness_rf_dysphagia": false,
    "dizziness_rf_headache": true,
    "dizziness_rf_syncope": false,
    "dizziness_rf_chestpain_palp": false,
    "dizziness_rf_gi_bleed": false,
    "dizziness_ear_tinnitus": false,
    "dizzinessTinnitusSide": "none",
    "dizziness_ear_hearing_loss": false,
    "dizzinessHearingLossSide": "none",
    "dizziness_ear_fullness_pain": false,
    "dizzinessFullnessSide": "none",
    "dizziness_ear_recent_uri": false,
    "dizziness_has_nausea_vomit": true,
    "dizzinessVomitStatus": "vomiting",
    "dizzinessVomitFreq": 3,
    "dizziness_vomit_contents": [
      "food_gastric",
      "bilious_green"
    ],
    "dizziness_has_abdcramps_diarrhea": false,
    "dizzinessDiarrheaFreq": 0,
    "dizziness_diarrhea_stools": [],
    "dizziness_has_photophobia_migraine": false,
    "hospRecordStatus": "ratchaburi",
    "underlying": [
      "ความดันสูง (HT)",
      "เบาหวาน (DM)",
      "ไขมันในเลือดสูง (DLP)"
    ],
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "Amlodipine 5 mg 1x1 pc, Metformin 500 mg 1x2 pc, Atorvastatin 20 mg 1 tab hs",
    "doctor_notes": {
      "additional_hpi": "ผู้ป่วยมีโรคประจำตัว HT, DM, DLP 4 ชั่วโมงก่อนมา มีอาการเวียนศีรษะบ้านหมุนเฉียบพลันขณะนั่งดูทีวี หมุนตลอดเวลาไม่ทุเลา มีเดินเซมากปล่อยมือแล้วล้มไปทางซ้าย มีพูดอ้อแอ้ไม่ชัดเล็กน้อย มองเห็นภาพซ้อน 2 ภาพ และปวดท้ายทอยตื้อๆ ร่วมกับอาเจียน 3 ครั้ง",
      "physical_exam": "BT 36.9 C, PR 88/min, RR 20/min, BP 172/96 mmHg, SpO2 98%. Eye: Gaze-evoked horizontal direction-changing nystagmus, Normal Head Impulse Test (HIT negative = Central sign), Mild skew deviation. CN: Mild left facial weakness UMN type, dysarthria present. Motor: Grade V all extremities, Left dysmetria on Finger-to-Nose test, marked truncal ataxia (cannot sit or stand unassisted).",
      "preliminary_dx": "Acute Posterior Circulation Ischemic Stroke (Suspected Left PICA / Cerebellar Infarction) 🚩",
      "plan": "Activate Stroke Fast Track, STAT Non-contrast CT Brain & CTA Head/Neck, IV access, NPO, On cardiac monitor, Evaluate for IV Thrombolytic therapy if within window, Consult Neurologist STAT"
    }
  },
  {
    "id": "case-063",
    "queue_number": "A-063",
    "hn": "6707342",
    "name": "นางจำเนียร สุขสมบัติ",
    "age": 74,
    "gender": "หญิง",
    "chief_complaint": "dizziness",
    "chief_complaint_title": "เวียนศีรษะ / บ้านหมุน",
    "status": "waiting",
    "timestamp": "2026-10-26T01:46:26.424Z",
    "durationVal": 1,
    "durationUnit": "days",
    "dizzinessOnsetMode": "gradual",
    "dizzinessSensation": "presyncope",
    "dizzinessEpisodeDuration": "seconds_to_1m",
    "dizziness_trig_head_motion": false,
    "dizziness_trig_postural": true,
    "dizziness_trig_valsalva": false,
    "dizziness_trig_salty_meal": false,
    "dizziness_trig_spontaneous": false,
    "dizziness_trig_stress_fatigue": true,
    "dizziness_trig_other": "",
    "dizziness_rf_weakness_numb": false,
    "dizziness_rf_facial_speech": false,
    "dizziness_rf_diplopia_vision": false,
    "dizziness_rf_ataxia_walk": false,
    "dizziness_rf_dysphagia": false,
    "dizziness_rf_headache": false,
    "dizziness_rf_syncope": true,
    "dizziness_rf_chestpain_palp": true,
    "dizziness_rf_gi_bleed": false,
    "dizziness_ear_tinnitus": false,
    "dizzinessTinnitusSide": "none",
    "dizziness_ear_hearing_loss": false,
    "dizzinessHearingLossSide": "none",
    "dizziness_ear_fullness_pain": false,
    "dizzinessFullnessSide": "none",
    "dizziness_ear_recent_uri": false,
    "dizziness_has_nausea_vomit": true,
    "dizzinessVomitStatus": "nausea_only",
    "dizzinessVomitFreq": 0,
    "dizziness_vomit_contents": [],
    "dizziness_has_abdcramps_diarrhea": true,
    "dizzinessDiarrheaFreq": 4,
    "dizziness_diarrhea_stools": [
      "watery"
    ],
    "dizziness_has_photophobia_migraine": false,
    "hospRecordStatus": "ratchaburi",
    "underlying": [
      "ความดันสูง (HT)"
    ],
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "Amlodipine 10 mg 1x1 pc, Enalapril 20 mg 1x1 pc, HCTZ 25 mg 1x1 morning (เพิ่งปรับยาเพิ่ม 1 สัปดาห์)",
    "doctor_notes": {
      "additional_hpi": "ผู้ป่วยสูงอายุ U/D HT เพิ่งปรับเพิ่มขนาดยาลดความดัน 1 สัปดาห์ก่อน 1 วันก่อนมีอาการปวดมวนท้อง ถ่ายเหลวเป็นน้ำ 4 ครั้ง อ่อนเพลียมาก ทานอาหารได้น้อย มีหน้ามืดตาลาย วูบเหมือนจะเป็นลม ใจสั่น เวลาลุกขึ้นยืนเร็วๆ มีวูบหมดสติล้มลงบนที่นอนไปประมาณ 10 วินาที ปฏิเสธบ้านหมุน ไม่มีชักเกร็ง ไม่มีปากเบี้ยวหรือแขนขาอ่อนแรง",
      "physical_exam": "Pale, dry lips and mucous membranes. Supine BP 112/68 mmHg, PR 84/min -> Standing BP (at 1 min) 82/50 mmHg, PR 108/min (Drop in SBP > 30 mmHg - Positive Orthostatic Hypotension). BT 37.0 C, RR 18/min. Neuro: Normal motor, sensory, cerebellar. Abdomen: Soft, hyperactive bowel sounds, mild diffuse tenderness, no rebound.",
      "preliminary_dx": "Presyncope with Vasovagal / Orthostatic Syncope secondary to Acute Gastroenteritis with Moderate Dehydration & Antihypertensive Overdose 🚩",
      "plan": "Hold all antihypertensive medications, IV Fluid 0.9% NSS 1000 ml IV loading then 100 ml/hr, EKG 12 leads, STAT CBC, BUN/Cr, Electrolytes, Stool exam, Monitor orthostatic vital signs"
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
    const durVal = document.getElementById('dizzinessDurationVal');
    const durUnit = document.getElementById('dizzinessDurationUnit');
    if (durVal) durVal.value = patient.durationVal || '';
    if (durUnit && patient.durationUnit) durUnit.value = patient.durationUnit;

    setRadioValue('dizzinessOnsetMode', patient.dizzinessOnsetMode);
    setRadioValue('dizzinessSensation', patient.dizzinessSensation);
    setRadioValue('dizzinessEpisodeDuration', patient.dizzinessEpisodeDuration);

    setChk = (id, val) => { const el = document.getElementById(id); if (el) el.checked = Boolean(val); };

    // Triggers
    setChk('dizziness_trig_head_motion', patient.dizziness_trig_head_motion);
    setChk('dizziness_trig_postural', patient.dizziness_trig_postural);
    setChk('dizziness_trig_valsalva', patient.dizziness_trig_valsalva);
    setChk('dizziness_trig_salty_meal', patient.dizziness_trig_salty_meal);
    setChk('dizziness_trig_spontaneous', patient.dizziness_trig_spontaneous);
    setChk('dizziness_trig_stress_fatigue', patient.dizziness_trig_stress_fatigue);
    const hasTrigOther = Boolean(patient.dizziness_trig_other);
    setChk('dizziness_trig_other_chk', hasTrigOther);
    toggleBranch('dizziness_trig_other_wrap', hasTrigOther);
    const trigOtherText = document.getElementById('dizziness_trig_other_text');
    if (trigOtherText) trigOtherText.value = patient.dizziness_trig_other || '';

    // Red Flags (Central / Hemodynamic)
    setChk('dizziness_rf_weakness_numb', patient.dizziness_rf_weakness_numb);
    setChk('dizziness_rf_facial_speech', patient.dizziness_rf_facial_speech);
    setChk('dizziness_rf_diplopia_vision', patient.dizziness_rf_diplopia_vision);
    setChk('dizziness_rf_ataxia_walk', patient.dizziness_rf_ataxia_walk);
    setChk('dizziness_rf_dysphagia', patient.dizziness_rf_dysphagia);
    setChk('dizziness_rf_headache', patient.dizziness_rf_headache);
    setChk('dizziness_rf_syncope', patient.dizziness_rf_syncope);
    setChk('dizziness_rf_chestpain_palp', patient.dizziness_rf_chestpain_palp);
    setChk('dizziness_rf_gi_bleed', patient.dizziness_rf_gi_bleed);

    // Otologic symptoms
    setChk('dizziness_ear_tinnitus', patient.dizziness_ear_tinnitus);
    setChk('dizziness_ear_hearing_loss', patient.dizziness_ear_hearing_loss);
    setChk('dizziness_ear_fullness_pain', patient.dizziness_ear_fullness_pain);
    setChk('dizziness_ear_recent_uri', patient.dizziness_ear_recent_uri);

    handleDizzinessEarChange();
    if (patient.dizziness_ear_tinnitus && patient.dizzinessTinnitusSide) {
      setRadioValue('dizzinessTinnitusSide', patient.dizzinessTinnitusSide);
    }
    if (patient.dizziness_ear_hearing_loss && patient.dizzinessHearingLossSide) {
      setRadioValue('dizzinessHearingLossSide', patient.dizzinessHearingLossSide);
    }
    if (patient.dizziness_ear_fullness_pain && patient.dizzinessFullnessSide) {
      setRadioValue('dizzinessFullnessSide', patient.dizzinessFullnessSide);
    }

    // GI & general
    setChk('dizziness_has_nausea_vomit', patient.dizziness_has_nausea_vomit);
    if (patient.dizziness_has_nausea_vomit) {
      setRadioValue('dizzinessVomitStatus', patient.dizzinessVomitStatus || 'nausea_only');
      handleDizzinessVomitChange();
      if (patient.dizzinessVomitStatus === 'vomiting') {
        const vf = document.getElementById('dizzinessVomitFreq');
        if (vf) vf.value = patient.dizzinessVomitFreq || 1;
        setMultiCheckboxes('dizziness_vomit_content', patient.dizzinessVomitContents);
      }
    } else {
      handleDizzinessVomitChange();
    }

    setChk('dizziness_has_abdcramps_diarrhea', patient.dizziness_has_abdcramps_diarrhea);
    handleDizzinessDiarrheaChange();
    if (patient.dizziness_has_abdcramps_diarrhea) {
      const df = document.getElementById('dizzinessDiarrheaFreq');
      if (df) df.value = patient.dizzinessDiarrheaFreq || 1;
      setMultiCheckboxes('dizziness_diarrhea_stool', patient.dizzinessDiarrheaStools);
    }

    setChk('dizziness_has_photophobia_migraine', patient.dizziness_has_photophobia_migraine);
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
      // ------------------ DIZZINESS INTAKE ------------------
      const _rawDur = parseFloat(document.getElementById('dizzinessDurationVal')?.value); const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
      const durationUnit = document.getElementById('dizzinessDurationUnit')?.value || 'hours';
      const dizzinessOnsetMode = document.querySelector('input[name="dizzinessOnsetMode"]:checked')?.value || 'unspecified';
      const dizzinessSensation = document.querySelector('input[name="dizzinessSensation"]:checked')?.value || 'unspecified';
      const dizzinessEpisodeDuration = document.querySelector('input[name="dizzinessEpisodeDuration"]:checked')?.value || 'unspecified';

      // Triggers
      const dizziness_trig_head_motion = document.getElementById('dizziness_trig_head_motion')?.checked || false;
      const dizziness_trig_postural = document.getElementById('dizziness_trig_postural')?.checked || false;
      const dizziness_trig_valsalva = document.getElementById('dizziness_trig_valsalva')?.checked || false;
      const dizziness_trig_salty_meal = document.getElementById('dizziness_trig_salty_meal')?.checked || false;
      const dizziness_trig_spontaneous = document.getElementById('dizziness_trig_spontaneous')?.checked || false;
      const dizziness_trig_stress_fatigue = document.getElementById('dizziness_trig_stress_fatigue')?.checked || false;
      const dizziness_trig_other_chk = document.getElementById('dizziness_trig_other_chk')?.checked || false;
      const dizziness_trig_other = dizziness_trig_other_chk ? (document.getElementById('dizziness_trig_other_text')?.value.trim() || '') : '';

      // Red Flags (Central / Hemodynamic)
      const dizziness_rf_weakness_numb = document.getElementById('dizziness_rf_weakness_numb')?.checked || false;
      const dizziness_rf_facial_speech = document.getElementById('dizziness_rf_facial_speech')?.checked || false;
      const dizziness_rf_diplopia_vision = document.getElementById('dizziness_rf_diplopia_vision')?.checked || false;
      const dizziness_rf_ataxia_walk = document.getElementById('dizziness_rf_ataxia_walk')?.checked || false;
      const dizziness_rf_dysphagia = document.getElementById('dizziness_rf_dysphagia')?.checked || false;
      const dizziness_rf_headache = document.getElementById('dizziness_rf_headache')?.checked || false;
      const dizziness_rf_syncope = document.getElementById('dizziness_rf_syncope')?.checked || false;
      const dizziness_rf_chestpain_palp = document.getElementById('dizziness_rf_chestpain_palp')?.checked || false;
      const dizziness_rf_gi_bleed = document.getElementById('dizziness_rf_gi_bleed')?.checked || false;

      // Otologic symptoms
      const dizziness_ear_tinnitus = document.getElementById('dizziness_ear_tinnitus')?.checked || false;
      const dizzinessTinnitusSide = dizziness_ear_tinnitus ? (document.querySelector('input[name="dizzinessTinnitusSide"]:checked')?.value || 'unspecified') : 'none';
      const dizziness_ear_hearing_loss = document.getElementById('dizziness_ear_hearing_loss')?.checked || false;
      const dizzinessHearingLossSide = dizziness_ear_hearing_loss ? (document.querySelector('input[name="dizzinessHearingLossSide"]:checked')?.value || 'unspecified') : 'none';
      const dizziness_ear_fullness_pain = document.getElementById('dizziness_ear_fullness_pain')?.checked || false;
      const dizzinessFullnessSide = dizziness_ear_fullness_pain ? (document.querySelector('input[name="dizzinessFullnessSide"]:checked')?.value || 'unspecified') : 'none';
      const dizziness_ear_recent_uri = document.getElementById('dizziness_ear_recent_uri')?.checked || false;

      // GI & general
      const dizziness_has_nausea_vomit = document.getElementById('dizziness_has_nausea_vomit')?.checked || false;
      const dizzinessVomitStatus = dizziness_has_nausea_vomit ? (document.querySelector('input[name="dizzinessVomitStatus"]:checked')?.value || 'nausea_only') : 'none';
      const dizzinessVomitFreq = (dizziness_has_nausea_vomit && dizzinessVomitStatus === 'vomiting') ? (parseInt(document.getElementById('dizzinessVomitFreq')?.value) || 1) : 0;
      const dizzinessVomitContents = (dizziness_has_nausea_vomit && dizzinessVomitStatus === 'vomiting')
        ? Array.from(document.querySelectorAll('input[name="dizziness_vomit_content"]:checked')).map(cb => cb.value)
        : [];

      const dizziness_has_abdcramps_diarrhea = document.getElementById('dizziness_has_abdcramps_diarrhea')?.checked || false;
      const dizzinessDiarrheaFreq = dizziness_has_abdcramps_diarrhea ? (parseInt(document.getElementById('dizzinessDiarrheaFreq')?.value) || 1) : 0;
      const dizzinessDiarrheaStools = dizziness_has_abdcramps_diarrhea
        ? Array.from(document.querySelectorAll('input[name="dizziness_diarrhea_stool"]:checked')).map(cb => cb.value)
        : [];

      const dizziness_has_photophobia_migraine = document.getElementById('dizziness_has_photophobia_migraine')?.checked || false;

      newPatient = {
        id: recordId,
        queue_number: queueNumber,
        hn: randomHn,
        name: patientName,
        age: patientAge,
        gender: gender,
        chief_complaint: 'dizziness',
        chief_complaint_title: 'เวียนศีรษะ / บ้านหมุน',
        status: recordStatus,
        timestamp: new Date().toISOString(),
        durationVal,
        durationUnit,
        dizzinessOnsetMode,
        dizzinessSensation,
        dizzinessEpisodeDuration,
        dizziness_trig_head_motion,
        dizziness_trig_postural,
        dizziness_trig_valsalva,
        dizziness_trig_salty_meal,
        dizziness_trig_spontaneous,
        dizziness_trig_stress_fatigue,
        dizziness_trig_other,
        dizziness_rf_weakness_numb,
        dizziness_rf_facial_speech,
        dizziness_rf_diplopia_vision,
        dizziness_rf_ataxia_walk,
        dizziness_rf_dysphagia,
        dizziness_rf_headache,
        dizziness_rf_syncope,
        dizziness_rf_chestpain_palp,
        dizziness_rf_gi_bleed,
        dizziness_ear_tinnitus,
        dizzinessTinnitusSide,
        dizziness_ear_hearing_loss,
        dizzinessHearingLossSide,
        dizziness_ear_fullness_pain,
        dizzinessFullnessSide,
        dizziness_ear_recent_uri,
        dizziness_has_nausea_vomit,
        dizzinessVomitStatus,
        dizzinessVomitFreq,
        dizzinessVomitContents,
        dizziness_has_abdcramps_diarrhea,
        dizzinessDiarrheaFreq,
        dizzinessDiarrheaStools,
        dizziness_has_photophobia_migraine,
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
      p.dizziness_rf_weakness_numb ||
      p.dizziness_rf_facial_speech ||
      p.dizziness_rf_diplopia_vision ||
      p.dizziness_rf_ataxia_walk ||
      p.dizziness_rf_dysphagia ||
      p.dizziness_rf_headache ||
      p.dizziness_rf_syncope ||
      p.dizziness_rf_chestpain_palp ||
      p.dizziness_rf_gi_bleed ||
      p.dizziness_ear_hearing_loss ||
      (p.dizziness_has_nausea_vomit && p.dizzinessVomitContents?.includes('coffee_ground_blood')) ||
      (p.dizziness_has_abdcramps_diarrhea && p.dizzinessDiarrheaStools?.includes('mucous_bloody'))
    );
  },

  evaluateRedFlags(patient) {
    const redFlags = [];
    if (patient.dizziness_rf_weakness_numb || patient.dizziness_rf_facial_speech || patient.dizziness_rf_diplopia_vision || patient.dizziness_rf_ataxia_walk || patient.dizziness_rf_dysphagia) {
      redFlags.push({
        key: 'central_vestibular_stroke',
        textTh: 'มีอาการระบบประสาทส่วนกลาง: แขนขาอ่อนแรง/ชา / ปากเบี้ยวพูดไม่ชัด / เห็นภาพซ้อน / เดินเซทรงตัวไม่ได้ / กลืนลำบาก (Central Neurological Deficits / Suspected Posterior Circulation Stroke)',
        risk: 'เสี่ยงภาวะหลอดเลือดสมองส่วนหลังตีบ/แตกเฉียบพลัน (PICA/AICA Infarct, Vertebrobasilar Stroke, Cerebellar Hemorrhage) ต้องส่ง Stroke Fast Track, CT/MRI สมอง และประเมิน HINTS exam ทันที'
      });
    }
    if (patient.dizziness_rf_headache) {
      redFlags.push({
        key: 'cerebellar_subarachnoid_hemorrhage',
        textTh: 'เวียนศีรษะร่วมกับปวดศีรษะรุนแรงเฉียบพลัน หรือปวดท้ายทอย (Thunderclap / Severe Occipital Headache)',
        risk: 'เสี่ยงภาวะเลือดออกใต้เยื่อหุ้มสมอง (SAH) หรือเลือดออกในสมองน้อย (Cerebellar Hemorrhage) หรือ Vertebral Artery Dissection'
      });
    }
    if (patient.dizziness_rf_syncope) {
      redFlags.push({
        key: 'cardiogenic_syncope_collapse',
        textTh: 'มีอาการวูบ หมดสติ หรือหมดความรู้สึกตัว (Syncope / Loss of Consciousness)',
        risk: 'เสี่ยงภาวะหัวใจเต้นผิดจังหวะอันตราย (Arrhythmia / AV Block), ลิ้นหัวใจเอออร์ติกตีบ (Aortic Stenosis) หรือความดันโลหิตตกวิกฤต'
      });
    }
    if (patient.dizziness_rf_chestpain_palp) {
      redFlags.push({
        key: 'cardiac_ischemia_arrhythmia',
        textTh: 'เวียนศีรษะร่วมกับเจ็บแน่นหน้าอก หรือใจสั่นเต้นผิดจังหวะ (Chest Pain / Palpitation)',
        risk: 'เสี่ยงภาวะกล้ามเนื้อหัวใจขาดเลือดเฉียบพลัน (ACS) หรือภาวะหัวใจเต้นผิดจังหวะรุนแรงที่ทำให้ Cardiac Output ลดลงฉับพลัน ต้องตรวจ EKG 12 สายทันที'
      });
    }
    if (patient.dizziness_rf_gi_bleed || (patient.dizziness_has_nausea_vomit && patient.dizzinessVomitContents?.includes('coffee_ground_blood')) || (patient.dizziness_has_abdcramps_diarrhea && patient.dizzinessDiarrheaStools?.includes('mucous_bloody'))) {
      redFlags.push({
        key: 'hypovolemic_shock_gi_bleed',
        textTh: 'มีอาการถ่ายดำ ถ่ายเป็นเลือด หรืออาเจียนเป็นเลือด/สีกาแฟ (GI Bleeding / Severe Blood Loss)',
        risk: 'เสี่ยงภาวะช็อกจากเสียเลือดและขาดน้ำรุนแรง (Hypovolemic Shock secondary to GI Hemorrhage) นำไปสู่อาการ Presyncope และความดันตก'
      });
    }
    if (patient.dizziness_ear_hearing_loss) {
      redFlags.push({
        key: 'acute_hearing_loss_warning',
        textTh: 'การได้ยินลดลง หรือหูตึงเฉียบพลัน (Acute Sensorineural Hearing Loss / AICA Infarction)',
        risk: 'ต้องแยกภาวะหลอดเลือดสมองส่วน AICA อุดตัน (AICA Infarction) หรือ Sudden Sensorineural Hearing Loss (SSNHL) ซึ่งต้องได้รับยาสเตียรอยด์โดยเร็ว'
      });
    }
    return redFlags;
  },

  updateOutputs(patient) {
    updateDizzinessOutputs(patient);
  },

  generateCds(patient, ctx) {
    const { rfs, ddxList, workupList, managementList } = ctx;
    if (rfs.some(r => r.key === 'central_vestibular_stroke' || r.key === 'cerebellar_subarachnoid_hemorrhage')) {
      ddxList.push('1. Acute Posterior Circulation Stroke (Cerebellar / Brainstem Infarct - PICA/AICA/Basilar 🚩)');
      ddxList.push('2. Cerebellar Hemorrhage / Subarachnoid Hemorrhage (SAH) / Vertebral Artery Dissection 🚩');
      ddxList.push('3. Vestibular Migraine / Central Demyelinating Disease');
      workupList.push('• ประเมิน HINTS Exam (Head Impulse, Nystagmus, Test of Skew) เพื่อแยก Central vs Peripheral');
      workupList.push('• NIHSS score, แจ้ง Stroke Fast Track');
      workupList.push('• Non-contrast CT Brain ด่วน หรือ MRI Brain with DWI / MRA Brain & Neck');
      workupList.push('• 12-lead EKG, DTX, CBC, Coagulation profile (PT/INR, PTT), Electrolytes');
      managementList.push('• 🛑 เปิดเส้น IV, งดน้ำและอาหาร (NPO) ระวังสำลัก (Aspiration)');
      managementList.push('• ประเมินเกณฑ์ Thrombolytic therapy (IV rt-PA / Tenecteplase) หรือ Endovascular Thrombectomy หากอยู่ใน Time window (< 4.5 ชม.)');
      managementList.push('• ควบคุมความดันโลหิตและสังเกตอาการทางระบบประสาทอย่างใกล้ชิด');
    } else if (rfs.some(r => r.key === 'cardiogenic_syncope_collapse' || r.key === 'cardiac_ischemia_arrhythmia' || r.key === 'hypovolemic_shock_gi_bleed')) {
      ddxList.push('1. Presyncope / Syncope secondary to Cardiac Arrhythmia (Sick Sinus, AV block, VT/SVT 🚩)');
      ddxList.push('2. Acute Coronary Syndrome (ACS) with Hemodynamic Instability 🚩');
      ddxList.push('3. Orthostatic Hypotension secondary to Dehydration / Blood Loss / Medication');
      workupList.push('• 12-lead EKG ทันที, Continuous Cardiac Monitoring');
      workupList.push('• ตรวจ Orthostatic Vitals (BP, HR ท่านอนและท่ายืน), Troponin, CBC, Electrolytes, BUN/Cr');
      workupList.push('• ตรวจ Stool occult blood / Rectal exam หากสงสัย GI Bleed');
      managementList.push('• นอนราบ ยกขาสูงหากความดันตก, ให้ออกซิเจนหาก SpO2 ต่ำ');
      managementList.push('• เปิดเส้น IV ให้สารน้ำ Isotonic Crystalloid หากเกิดจาก Dehydration/Hypovolemia');
      managementList.push('• ทบทวนและชะลอยาลดความดันโลหิต/ยาขับปัสสาวะ');
    } else {
      if (patient.dizzinessSensation === 'vertigo' && patient.dizziness_trig_head_motion && patient.dizzinessEpisodeDuration === 'seconds_to_1m') {
        ddxList.push('1. Benign Paroxysmal Positional Vertigo (BPPV - Posterior/Horizontal Semicircular Canal)');
        ddxList.push('2. Vestibular Neuritis (Convalescent phase)');
        ddxList.push('3. Cervicogenic Dizziness');
        workupList.push('• Dix-Hallpike Test เพื่อยืนยันและระบุด้านที่มี Canalithiasis (ระวังทำในผู้ป่วยโรคหลอดเลือดคอ/กระดูกคอเสื่อม)');
        workupList.push('• ตรวจระบบประสาทและ Otoscopy ตรวจหู');
        managementList.push('• การรักษาหลัก: ท่าบริหารขยับตะกอนหินปูน (Epley Maneuver หรือ Semont Maneuver) ตามข้างที่มีรอยโรค');
        managementList.push('• หลีกเลี่ยงการใช้ยา Vestibular Suppressants (Dimenhydrinate) ต่อเนื่องระยะยาวเพื่อไม่ให้ขัดขวาง Central Compensation');
      } else if (patient.dizziness_ear_tinnitus || patient.dizziness_ear_hearing_loss || patient.dizziness_ear_fullness_pain) {
        ddxList.push('1. Meniere\'s Disease (Endolymphatic Hydrops)');
        ddxList.push('2. Acute Labyrinthitis / Otitis Media with Vestibular Involvement');
        ddxList.push('3. Vestibular Schwannoma (Acoustic Neuroma)');
        workupList.push('• Otoscopic examination, Tuning fork test (Weber & Rinne test)');
        workupList.push('• ส่งตรวจ Audiometry / ปรึกษาโสต ศอ นาสิกแพทย์ (ENT)');
        managementList.push('• Symptomatic relief: Antiemetic, Vestibular suppressant ระยะสั้นช่วงกำเริบ');
        managementList.push('• ในรายสงสัย Meniere: แนะนำจำกัดอาหารเค็ม (Low-salt diet < 2g/day) และหลีกเลี่ยงคาเฟอีน');
      } else {
        ddxList.push('1. Peripheral Vestibulopathy (Vestibular Neuritis / Labyrinthitis)');
        ddxList.push('2. Benign Paroxysmal Positional Vertigo (BPPV)');
        ddxList.push('3. Dizziness secondary to Systemic Cause / Dehydration / AGE / Drug-induced');
        workupList.push('• Complete Neurological Examination, Romberg test, Tandem gait');
        workupList.push('• Otoscopy, Vital signs, Basic blood chemistry if elderly or dehydrated');
        managementList.push('• ให้สารน้ำ IV ทดแทนหากมีคลื่นไส้อาเจียนหรือท้องเสียรุนแรง');
        managementList.push('• ให้ยาแก้อาเจียนและยาบรรเทาอาการเวียนศีรษะระยะสั้น (Dimenhydrinate, Ondansetron)');
      }
    }
  }
});
