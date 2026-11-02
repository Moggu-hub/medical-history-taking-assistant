// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 06_headache.js
// อาการนำ: ปวดศีรษะ (Headache)
// ไฟล์นี้แยกอิสระสำหรับอาการนำ headache เพื่อให้ทีมแพทย์และ IT โรงพยาบาลนำไปพัฒนาต่อได้โดยไม่กระทบระบบหลัก
// =========================================================================

let headachePainScoreTouched = false;

function clearHeadachePainScore() {
  headachePainScoreTouched = false;
  const slider = document.getElementById('headachePainScore');
  if (slider) slider.value = 0;
  const emojiEl = document.getElementById('headachePainScoreEmoji');
  const textEl = document.getElementById('headachePainScoreText');
  const badgeEl = document.getElementById('headachePainScoreBadge');
  const clearBtn = document.getElementById('headachePainScoreClearBtn');
  if (emojiEl) emojiEl.textContent = '⚪';
  if (textEl) textEl.textContent = 'ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)';
  if (badgeEl) badgeEl.className = 'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all';
  if (clearBtn) clearBtn.classList.add('hidden');
}

function handleHeadachePainScoreChange(val) {
  headachePainScoreTouched = true;
  const num = parseInt(val, 10);
  const emojiEl = document.getElementById('headachePainScoreEmoji');
  const textEl = document.getElementById('headachePainScoreText');
  const badgeEl = document.getElementById('headachePainScoreBadge');
  const clearBtn = document.getElementById('headachePainScoreClearBtn');
  if (clearBtn) clearBtn.classList.remove('hidden');
  if (!emojiEl || !textEl || !badgeEl) return;

  let emoji = '😐';
  let label = 'ปวดปานกลาง';
  let badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';

  if (num === 0) {
    emoji = '😊';
    label = 'สบายดี (ไม่ปวดเลย)';
    badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  } else if (num <= 3) {
    emoji = '🙂';
    label = 'ปวดเล็กน้อย (ทนได้)';
    badgeClass = 'bg-lime-100 text-lime-800 border-lime-300';
  } else if (num <= 6) {
    emoji = '😐';
    label = 'ปวดปานกลาง (รบกวนสมาธิ)';
    badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
  } else if (num <= 9) {
    emoji = '😣';
    label = 'ปวดมาก (ทนแทบไม่ไหว)';
    badgeClass = 'bg-rose-100 text-rose-800 border-rose-300';
  } else {
    emoji = '😭';
    label = 'เจ็บปวดรุนแรงที่สุดในชีวิต';
    badgeClass = 'bg-red-200 text-red-900 border-red-400 animate-pulse';
  }

  emojiEl.textContent = emoji;
  textEl.textContent = `${num} / 10 (${label})`;
  badgeEl.className = `inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border transition ${badgeClass}`;
}

function setHeadachePainScore(score) {
  headachePainScoreTouched = true;
  const slider = document.getElementById('headachePainScore');
  if (slider) {
    slider.value = score;
    handleHeadachePainScoreChange(score);
  }
}

function handleHeadacheLocationChange() {
  const isUnilateral = document.getElementById('headache_loc_unilateral')?.checked || false;
  const isPeriorbital = document.getElementById('headache_loc_periorbital')?.checked || false;
  toggleBranch('headache_unilateral_side_wrap', isUnilateral);
  toggleBranch('headache_periorbital_side_wrap', isPeriorbital);
  if (!isUnilateral) {
    const radios = document.querySelectorAll('input[name="headacheUnilateralSide"]');
    radios.forEach(r => { r.checked = false; });
  }
  if (!isPeriorbital) {
    const radios = document.querySelectorAll('input[name="headachePeriorbitalSide"]');
    radios.forEach(r => { r.checked = false; });
  }
}

function handleHeadacheVomitChange() {
  const hasVomit = document.getElementById('headache_has_nausea_vomit')?.checked || false;
  toggleBranch('headache_vomit_detail_wrap', hasVomit);
  if (!hasVomit) {
    const radios = document.querySelectorAll('input[name="headacheVomitStatus"]');
    radios.forEach(r => { r.checked = false; });
  }
}


    function updateHeadacheOutputs(patient) {
      const unitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
      const durationText = patient.durationVal ? `${patient.durationVal} ${unitMap[patient.durationUnit] || 'ชั่วโมง'}` : 'ไม่ระบุ';
      const painScoreText = (patient.headachePainScore !== null && patient.headachePainScore !== undefined) ? `${patient.headachePainScore}/10` : 'ไม่ได้ระบุระดับความปวด';

      const onsetMap = {
        thunderclap: 'ปวดรุนแรงทันทีทันใดในไม่กี่วินาที หรือรุนแรงสูงสุดใน 1-2 นาที (Thunderclap / ฟ้าผ่า 🚩)',
        gradual: 'ค่อยๆ เริ่มปวด และเป็นมากขึ้นเรื่อยๆ (Gradual onset)',
        chronic: 'ปวดตื้อๆ เป็นๆ หายๆ เรื้อรัง (Chronic recurrent)',
        pattern_change: 'ปวดศีรษะเรื้อรังอยู่เดิม แต่ครั้งนี้เปลี่ยนรูปแบบไปชัดเจน 🚩',
        unspecified: 'ไม่ได้ระบุรูปแบบการเริ่ม'
      };

      // Locations
      const locMap = {
        unilateral: 'ปวดข้างเดียว',
        periorbital: 'ปวดรอบเบ้าตา หรือลึกหลังกระบอกตา',
        occipital: 'ปวดท้ายทอย หรือร้าวลงต้นคอ/บ่า',
        band: 'ปวดตึงรัดรอบศีรษะ (Band-like)',
        diffuse: 'ปวดตึงทั่วทั้งศีรษะ (Diffuse)',
        facial_sinus: 'ปวดบริเวณหน้าผาก โหนกแก้ม หรือรอบจมูก (Sinus)'
      };
      const sideMap = { left: 'ข้างซ้าย', right: 'ข้างขวา', both: 'ทั้งสองข้าง', none: '' };

      const locations = [];
      (patient.headacheLocs || []).forEach(l => {
        if (l === 'unilateral') {
          const side = (patient.headacheUnilateralSide && patient.headacheUnilateralSide !== 'none') ? ` [${sideMap[patient.headacheUnilateralSide] || patient.headacheUnilateralSide}]` : '';
          locations.push(`ปวดข้างเดียว${side}`);
        } else if (l === 'periorbital') {
          const side = (patient.headachePeriorbitalSide && patient.headachePeriorbitalSide !== 'none') ? ` [${sideMap[patient.headachePeriorbitalSide] || patient.headachePeriorbitalSide}]` : '';
          locations.push(`ปวดรอบเบ้าตา/หลังกระบอกตา${side}`);
        } else if (locMap[l]) {
          locations.push(locMap[l]);
        } else if (typeof l === 'string' && l.startsWith('อื่นๆ:')) {
          locations.push(l);
        }
      });
      if (patient.headacheLocOther && !locations.some(l => l.includes(patient.headacheLocOther))) {
        locations.push(`อื่นๆ: ${patient.headacheLocOther}`);
      }
      const locationsText = locations.length > 0 ? locations.join(', ') : 'ไม่ระบุตำแหน่งชัดเจน';

      // Characteristics
      const charMap = {
        throbbing: 'ปวดตุ๊บๆ ตามจังหวะชีพจร (Pulsatile / Throbbing)',
        tight_dull: 'ปวดตึงๆ หนักๆ ตื้อๆ บีบรัดแน่น (Tight / Pressing / Dull aching)',
        sharp_stabbing: 'ปวดเสียดแทงรุนแรงเหมือนถูกมีดแทง หรือฟ้าผ่า 🚩',
        burning_electric: 'ปวดแสบร้อน หรือเสียวแปล๊บคล้ายไฟช็อต (Burning / Electric shock-like)',
        boring_severe: 'ปวดลึกรุนแรงทรมานจนอยู่นิ่งไม่ได้ ทุรนทุราย (Deep boring / Excruciating)'
      };
      const chars = (patient.headacheChars || []).map(c => charMap[c] || c);
      const charsText = chars.length > 0 ? chars.join(', ') : 'ไม่ระบุลักษณะการปวด';

      // Triggers
      const triggers = [];
      if (patient.headache_trig_valsalva) triggers.push('ปวดมากขึ้นเวลาไอ จาม เบ่ง หรือก้มศีรษะ 🚩');
      if (patient.headache_trig_supine_morning) triggers.push('ปวดมากขึ้นเวลานอนราบ ตื่นนอนตอนเช้า หรือปลุกให้ตื่นกลางดึก 🚩');
      if (patient.headache_trig_upright) triggers.push('ปวดมากขึ้นเวลาลุกขึ้นนั่งหรือยืน นอนราบแล้วทุเลาลงชัดเจน');
      if (patient.headache_trig_jaw_claudication) triggers.push('ปวดเมื่อเคี้ยวอาหาร หรือเคี้ยวแล้วเมื่อยล้าขากรรไกร 🚩');
      if (patient.headache_trig_scalp_tenderness) triggers.push('เจ็บแปล๊บที่หนังศีรษะเวลาหวีผม สระผม หรือแตะโดนหนังศีรษะ 🚩');
      if (patient.headache_trig_light_sound) triggers.push('มีอาการมากขึ้นเมื่อเจอแสงจ้า เสียงดัง หรือกลิ่นฉุน');
      if (patient.headache_trig_stress_fatigue) triggers.push('สัมพันธ์กับการอดนอน พักผ่อนน้อย ความเครียด หรือใช้สายตานาน');
      if (patient.headache_trig_other) triggers.push(`อื่นๆ: ${patient.headache_trig_other}`);
      const triggersText = triggers.length > 0 ? triggers.join(', ') : 'ไม่มีสิ่งกระตุ้นจำเพาะ / เกิดขึ้นเอง';

      const positives = [];
      const negatives = [];

      // Location, Char, Pain score, Triggers (Primary descriptors stay in top HPI; not pushed to positives)
      if (triggers.length === 0) {
        negatives.push('ไม่มีท่าทางหรือสิ่งกระตุ้นชัดเจน');
      }

      // Neurological Warning Signs
      if (patient.headache_rf_weakness_numb) positives.push('มีอาการแขนขาอ่อนแรง หรือชาครึ่งซีก 🚩');
      else negatives.push('ไม่มีแขนขาอ่อนแรงหรือชาครึ่งซีก');

      if (patient.headache_rf_facial_speech) positives.push('มีมุมปากตก ปากเบี้ยว ยิ้มไม่เท่ากัน หรือพูดไม่ชัด 🚩');
      else negatives.push('ไม่มีปากเบี้ยวหรือพูดไม่ชัด');

      if (patient.headache_rf_ataxia_walk) positives.push('เดินเซมาก ทรงตัวไม่ได้ แขนขาไม่สัมพันธ์กัน 🚩');
      else negatives.push('ไม่มีเดินเซ สามารถทรงตัวได้ปกติ');

      if (patient.headache_rf_seizure_syncope) positives.push('มีอาการชักเกร็ง หรือวูบหมดสติ 🚩');
      else negatives.push('ไม่มีชักเกร็งหรือวูบหมดสติ');

      if (patient.headache_rf_altered_mental) positives.push('ซึมลง สับสน ถามตอบไม่รู้เรื่อง หรือบุคลิกภาพเปลี่ยน 🚩');
      else negatives.push('ระดับความรู้สึกตัวปกติ ไม่ซึมไม่สับสน');

      if (patient.headache_rf_fever || (patient.headache_rf_fever_stiff_neck && patient.headache_rf_fever !== false)) {
        positives.push('มีไข้สูง หรือหนาวสั่น 🚩');
      } else {
        negatives.push('ไม่มีไข้สูงหรือหนาวสั่น');
      }

      if (patient.headache_rf_stiff_neck || (patient.headache_rf_fever_stiff_neck && patient.headache_rf_stiff_neck !== false)) {
        positives.push('คอแข็งเกร็ง ก้มคอไม่ลง 🚩');
      } else {
        negatives.push('ไม่มีคอแข็งเกร็ง ก้มคอได้ปกติ');
      }

      // Ocular Warning Signs
      if (patient.headache_rf_acute_glaucoma) positives.push('ตาแดง ปวดเบ้าตารุนแรง ตามัวเฉียบพลัน หรือเห็นรุ้งรอบดวงไฟ 🚩');
      else negatives.push('ไม่มีตาแดง ตามัว หรือปวดเบ้าตารุนแรง');

      if (patient.headache_rf_diplopia_field) positives.push('มองเห็นภาพซ้อน หรือลานสายตาดับมืดไปครึ่งซีก 🚩');
      else negatives.push('การมองเห็นปกติ ไม่มีภาพซ้อนหรือลานสายตาแคบลง');

      if (patient.headache_has_visual_aura) positives.push('มีอาการตาพร่า เห็นแสงวูบวาบ แสงซิกแซกนำมาก่อนปวด (Visual Aura)');
      else negatives.push('ไม่มีอาการเตือนทางสายตานำมาก่อน');

      // GI & Autonomic
      if (patient.headache_has_nausea_vomit) {
        if (patient.headacheVomitStatus === 'projectile') {
          positives.push('มีอาการอาเจียนพุ่งรุนแรง (Projectile Vomiting) 🚩');
        } else if (patient.headacheVomitStatus === 'vomiting') {
          positives.push('มีอาการอาเจียนร่วมกับอาการปวดศีรษะ');
        } else {
          positives.push('มีอาการคลื่นไส้เด่นชัด (ยังไม่อาเจียน)');
        }
      } else {
        negatives.push('ไม่มีคลื่นไส้หรืออาเจียน');
      }

      if (patient.headache_has_autonomic) {
        positives.push('มีอาการตาแดง น้ำตาไหล หนังตาตก หรือคัดจมูกข้างเดียวกับที่ปวด (Cranial Autonomic)');
      } else {
        negatives.push('ไม่มีน้ำตาไหล ตาแดง หรือคัดจมูกข้างเดียวกับที่ปวด');
      }

      // High-Risk Background
      if (patient.headache_risk_recent_trauma) positives.push('มีประวัติอุบัติเหตุทางศีรษะ ล้ม หรือศีรษะกระแทกใน 1-3 เดือน 🚩');
      if (patient.headache_risk_pregnancy_postpartum) positives.push('กำลังตั้งครรภ์ หรือเพิ่งคลอดบุตรไม่เกิน 6 สัปดาห์ 🚩');
      if (patient.headache_risk_cancer) positives.push('มีประวัติโรคมะเร็ง 🚩');
      if (patient.headache_risk_immunocompromised) positives.push('มีภาวะภูมิคุ้มกันบกพร่อง / รับประทานยากดภูมิ 🚩');
      if (patient.headache_risk_anticoagulants) positives.push('รับประทานยาละลายลิ่มเลือด หรือยาต้านเกล็ดเลือด 🚩');
      if (patient.headache_risk_new_onset_age50) positives.push('อายุ 50 ปีขึ้นไปที่เพิ่งเริ่มมีอาการปวดศีรษะแบบใหม่ 🚩');
      if (patient.headache_risk_med_overuse) positives.push('รับประทานยาแก้ปวดบ่อยเกือบทุกวันติดต่อกันเป็นเวลานาน (MOH)');

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

      // A) Rapid Bullet Format for Headache
      const defaultRapid = 
`[Chief Complaint (CC)]
ปวดศีรษะมา ${durationText}

[History of Present Illness (HPI)]
• การเริ่มต้นและระยะเวลา: ${durationText}, ${onsetMap[patient.headacheOnsetMode] || 'ไม่ระบุ'}
• ระดับความปวด (Pain Score): ${painScoreText}
• ตำแหน่งปวด: ${locationsText}
• ลักษณะอาการปวด: ${charsText}
• ปัจจัยกระตุ้นและอาการกำเริบ: ${triggersText}

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
  : '✓ ไม่พบสัญญาณเตือนวิกฤต (No Immediate Red Flag)'}

[Doctor's Clinical Addendum & Exam]
• ประวัติเพิ่มเติม/แก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}
• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}
• แผนการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

      // B) Narrative Paragraph Format for Headache
      const defaultNarrative = 
`ผู้ป่วย [${patient.name}] อายุ ${patient.age || '-'} ปี เพศ ${patient.gender || 'ไม่ระบุ'} มารับการตรวจที่ห้องฉุกเฉิน รพ.ราชบุรี ด้วยอาการปวดศีรษะมา ${durationText} ระดับความเจ็บปวดสูงสุด ${painScoreText}
การเริ่มมีอาการ: ${onsetMap[patient.headacheOnsetMode] || 'ไม่ระบุ'} ตำแหน่งที่ปวด: ${locationsText} ลักษณะความรู้สึกปวด: ${charsText} ปัจจัยกระตุ้นและท่าทาง: ${triggersText}

อาการร่วมและการซักประวัติตามระบบ: ผู้ป่วยให้ประวัติ ${positives.join(', ')}
อาการสำคัญที่ปฏิเสธ (Pertinent negatives): ${negatives.join(', ')}

ประวัติการเจ็บป่วยในอดีต: [${hospLabel}], โรคประจำตัว: ${patient.underlying?.length > 0 ? patient.underlying.join(', ') : 'ปฏิเสธ'}, ยาประจำตัว: ${medsText}, ประวัติแพ้ยา/แพ้อาหาร: ${patient.drugAllergy || 'ปฏิเสธประวัติแพ้ยา/แพ้อาหาร'}
${patient.redFlags?.length > 0 ? `\n[🚩 แจ้งเตือนสัญญาณเตือน (Red Flags)]: ตรวจพบอาการ ${patient.redFlags.map(rf => rf.textTh).join(', ')}` : ''}

[บันทึกการตรวจและการประเมินโดยแพทย์]:
${docNotes.additional_hpi ? `• ประวัติเพิ่มเติม: ${docNotes.additional_hpi}\n` : ''}${docNotes.physical_exam ? `• การตรวจร่างกาย: ${docNotes.physical_exam}\n` : ''}${docNotes.preliminary_dx ? `• การวินิจฉัย: ${docNotes.preliminary_dx}\n` : ''}${docNotes.plan ? `• แผนการรักษา: ${docNotes.plan}` : ''}`;

      document.getElementById('rapidTextView').value = patient.custom_rapid_note || defaultRapid;
      document.getElementById('narrativeTextView').value = patient.custom_narrative_note || defaultNarrative;

      // C) JSON Payload for Headache
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
        "chief_complaint": "headache",
        "headache_history": {
          "duration_value": patient.durationVal || null,
          "duration_unit": patient.durationUnit || null,
          "onset_mode": patient.headacheOnsetMode,
          "pain_score": patient.headachePainScore,
          "locations": {
            "selected_locations": patient.headacheLocs || [],
            "unilateral_side": patient.headacheUnilateralSide || "none",
            "periorbital_side": patient.headachePeriorbitalSide || "none",
            "other_location": patient.headacheLocOther || ""
          },
          "characteristics": patient.headacheChars || [],
          "triggers": {
            "valsalva_or_cough": patient.headache_trig_valsalva,
            "supine_or_morning_awakening": patient.headache_trig_supine_morning,
            "upright_postural": patient.headache_trig_upright,
            "jaw_claudication": patient.headache_trig_jaw_claudication,
            "scalp_tenderness": patient.headache_trig_scalp_tenderness,
            "light_or_sound": patient.headache_trig_light_sound,
            "stress_or_fatigue": patient.headache_trig_stress_fatigue,
            "other": patient.headache_trig_other || ""
          }
        },
        "neurological_and_ocular_warning_signs": {
          "focal_weakness_or_numbness": patient.headache_rf_weakness_numb,
          "facial_droop_or_speech_deficit": patient.headache_rf_facial_speech,
          "ataxia_or_incoordination": patient.headache_rf_ataxia_walk,
          "seizure_or_syncope": patient.headache_rf_seizure_syncope,
          "altered_mental_status": patient.headache_rf_altered_mental,
          "high_fever_or_chills": Boolean(patient.headache_rf_fever ?? patient.headache_rf_fever_stiff_neck),
          "nuchal_rigidity_stiff_neck": Boolean(patient.headache_rf_stiff_neck ?? patient.headache_rf_fever_stiff_neck),
          "fever_with_stiff_neck": Boolean(patient.headache_rf_fever_stiff_neck || (patient.headache_rf_fever && patient.headache_rf_stiff_neck)),
          "acute_glaucoma_signs": patient.headache_rf_acute_glaucoma,
          "diplopia_or_visual_field_loss": patient.headache_rf_diplopia_field,
          "visual_aura": patient.headache_has_visual_aura
        },
        "associated_symptoms_and_high_risk_background": {
          "nausea_and_vomiting": {
            "present": patient.headache_has_nausea_vomit,
            "status": patient.headacheVomitStatus
          },
          "cranial_autonomic_symptoms": patient.headache_has_autonomic,
          "recent_head_trauma_1_to_3_months": patient.headache_risk_recent_trauma,
          "pregnancy_or_postpartum_6_weeks": patient.headache_risk_pregnancy_postpartum,
          "cancer_history": patient.headache_risk_cancer,
          "immunocompromised": patient.headache_risk_immunocompromised,
          "anticoagulant_or_antiplatelet_use": patient.headache_risk_anticoagulants,
          "new_onset_age_ge_50": patient.headache_risk_new_onset_age50,
          "medication_overuse": patient.headache_risk_med_overuse,
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
    // OUTPUT GENERATION: เจ็บแน่นหน้าอก (Chest Pain)

registerCcModule({
  id: 'headache',
  recordCc: 'headache',
  titleTh: 'ปวดศีรษะ',
  titleEn: 'Headache',
  sectionDomId: 'headacheQuestionnaireSection',
  doctorCcBadgeHtml: "<i data-lucide=\"frown\" class=\"w-3 h-3 mr-1\"></i> CC: ปวดศีรษะ (Headache)",
  formHtml: "        <div id=\"headacheQuestionnaireSection\" class=\"hidden space-y-6\">\n\n          <!-- CARD 1: ระยะเวลา รูปแบบการเกิด และระดับความปวด (Duration, Onset & Pain Score) -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"clock\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-800 section-title\" data-base-title=\"ระยะเวลา รูปแบบการเกิด และระดับความปวด\">1. ระยะเวลา รูปแบบการเกิด และระดับความปวด</h2>\n                <p class=\"text-xs text-slate-500\">ระบุระยะเวลา รูปแบบการเริ่มปวด และประเมินระดับความรุนแรง</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4\">\n              <!-- 1.1 ระยะเวลาที่มีอาการ -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5\">\n                  ระยะเวลาที่เริ่มมีอาการปวดศีรษะในครั้งนี้ (Duration) <span class=\"text-rose-500\">*</span>\n                </label>\n                <div class=\"flex items-center space-x-3\">\n                  <input type=\"number\" id=\"headacheDurationVal\" min=\"1\" max=\"999\" placeholder=\"เช่น 2 หรือ 4\"\n                    class=\"w-32 bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-medical-500\">\n                  <select id=\"headacheDurationUnit\"\n                    class=\"bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-medical-500\">\n                    <option value=\"minutes\">นาที</option>\n                    <option value=\"hours\" selected>ชั่วโมง</option>\n                    <option value=\"days\">วัน</option>\n                    <option value=\"weeks\">สัปดาห์</option>\n                    <option value=\"months\">เดือน</option>\n                    <option value=\"years\">ปี</option>\n                  </select>\n                </div>\n              </div>\n\n              <!-- 1.2 รูปแบบการเริ่มมีอาการปวด -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">\n                  รูปแบบการเริ่มมีอาการปวดศีรษะ (Onset Mode) <span class=\"text-rose-500\">*</span>\n                </label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"headacheOnsetMode\" value=\"thunderclap\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ปวดรุนแรงทันทีทันใดในไม่กี่วินาที หรือรุนแรงสูงสุดใน 1-2 นาที</span>\n                      <span class=\"text-[11px] text-slate-500\">ปวดรุนแรงเหมือนฟ้าผ่า หรือปวดรุนแรงที่สุดในชีวิต</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"headacheOnsetMode\" value=\"gradual\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ค่อยๆ เริ่มปวด และเป็นมากขึ้นเรื่อยๆ</span>\n                      <span class=\"text-[11px] text-slate-500\">อาการปวดค่อยๆ เพิ่มขึ้นในช่วงหลายชั่วโมงหรือหลายวัน</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"headacheOnsetMode\" value=\"chronic\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ปวดตื้อๆ เป็นๆ หายๆ เรื้อรัง</span>\n                      <span class=\"text-[11px] text-slate-500\">มีอาการเป็นๆ หายๆ มานานหลายสัปดาห์หรือหลายเดือน</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"radio\" name=\"headacheOnsetMode\" value=\"pattern_change\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ปวดศีรษะเรื้อรังอยู่เดิม แต่ครั้งนี้เปลี่ยนรูปแบบไปชัดเจน</span>\n                      <span class=\"text-[11px] text-slate-500\">ลักษณะปวดหรือตำแหน่งเปลี่ยนไป หรือรุนแรงกว่าทุกครั้งที่เคยเป็น</span>\n                    </div>\n                  </label>\n                </div>\n              </div>\n\n              <!-- 1.3 ระดับความเจ็บปวด (Pain Score 0 - 10) -->\n              <div class=\"pt-2 border-t border-slate-100\">\n                <div class=\"flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1\">\n                  <label class=\"text-xs font-semibold text-slate-700 uppercase tracking-wider\">\n                    ระดับความเจ็บปวดขณะปวดมากที่สุด (Pain Score 0 - 10)\n                  </label>\n                  <div class=\"flex items-center space-x-2\">\n                    <span id=\"headachePainScoreBadge\" class=\"inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all\">\n                      <span id=\"headachePainScoreEmoji\" class=\"text-sm\">⚪</span>\n                      <span id=\"headachePainScoreText\">ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)</span>\n                    </span>\n                    <button type=\"button\" id=\"headachePainScoreClearBtn\" onclick=\"clearHeadachePainScore()\" class=\"hidden text-xs text-slate-400 hover:text-rose-600 underline transition\">\n                      ล้างค่า\n                    </button>\n                  </div>\n                </div>\n\n                <div class=\"space-y-2\">\n                  <input type=\"range\" id=\"headachePainScore\" min=\"0\" max=\"10\" value=\"0\" step=\"1\"\n                    oninput=\"handleHeadachePainScoreChange(this.value)\"\n                    class=\"w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-600 focus:outline-none\">\n                  \n                  <div class=\"flex justify-between text-[11px] text-slate-400 font-semibold px-1\">\n                    <span>0 (ไม่ปวดเลย)</span>\n                    <span>1 - 3 (ปวดเล็กน้อย)</span>\n                    <span>4 - 6 (ปวดปานกลาง)</span>\n                    <span>7 - 9 (ปวดมาก)</span>\n                    <span class=\"text-slate-800 font-bold\">10 (รุนแรงที่สุด)</span>\n                  </div>\n                </div>\n              </div>\n\n            </div>\n          </div>\n\n          <!-- CARD 2: ตำแหน่ง และลักษณะการปวด (Location & Characteristics) -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"map-pin\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-800 section-title\" data-base-title=\"ตำแหน่ง และลักษณะการปวด\">2. ตำแหน่ง และลักษณะการปวด</h2>\n                <p class=\"text-xs text-slate-500\">เลือกตำแหน่งที่ปวดและลักษณะความรู้สึกปวดศีรษะ (เลือกได้หลายข้อ)</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4\">\n              <!-- 2.1 ตำแหน่งที่ปวดศีรษะ -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">ตำแหน่งที่ปวด (เลือกได้หลายข้อ)</label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                  \n                  <!-- ปวดข้างเดียว -->\n                  <div>\n                    <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                      <input type=\"checkbox\" id=\"headache_loc_unilateral\" onchange=\"handleHeadacheLocationChange()\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                      <div class=\"ml-2.5\">\n                        <span class=\"font-semibold text-slate-800 block\">ปวดข้างเดียว (เช่น ขมับข้างซ้าย หรือข้างขวา)</span>\n                        <span class=\"text-[11px] text-slate-500\">ปวดซีกใดซีกหนึ่งของศีรษะ (Unilateral / Hemicranial)</span>\n                      </div>\n                    </label>\n                    <!-- กิ่งเลือกข้าง: ปวดข้างเดียว -->\n                    <div id=\"headache_unilateral_side_wrap\" class=\"hidden mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2\">\n                      <span class=\"font-semibold text-slate-700 block\">ระบุข้างที่ปวด:</span>\n                      <div class=\"grid grid-cols-2 gap-2\">\n                        <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                          <input type=\"radio\" name=\"headacheUnilateralSide\" value=\"left\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                          <span class=\"ml-2 font-medium\">ข้างซ้าย</span>\n                        </label>\n                        <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                          <input type=\"radio\" name=\"headacheUnilateralSide\" value=\"right\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                          <span class=\"ml-2 font-medium\">ข้างขวา</span>\n                        </label>\n                      </div>\n                    </div>\n                  </div>\n\n                  <!-- ปวดรอบเบ้าตา -->\n                  <div>\n                    <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                      <input type=\"checkbox\" id=\"headache_loc_periorbital\" onchange=\"handleHeadacheLocationChange()\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                      <div class=\"ml-2.5\">\n                        <span class=\"font-semibold text-slate-800 block\">ปวดรอบเบ้าตา หรือลึกหลังกระบอกตา</span>\n                        <span class=\"text-[11px] text-slate-500\">ปวดลึกในกระบอกตา (Periorbital / Retro-orbital)</span>\n                      </div>\n                    </label>\n                    <!-- กิ่งเลือกข้าง: ปวดรอบเบ้าตา -->\n                    <div id=\"headache_periorbital_side_wrap\" class=\"hidden mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2\">\n                      <span class=\"font-semibold text-slate-700 block\">ระบุข้างที่ปวดเบ้าตา:</span>\n                      <div class=\"grid grid-cols-3 gap-2\">\n                        <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                          <input type=\"radio\" name=\"headachePeriorbitalSide\" value=\"left\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                          <span class=\"ml-1.5 font-medium\">ข้างซ้าย</span>\n                        </label>\n                        <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                          <input type=\"radio\" name=\"headachePeriorbitalSide\" value=\"right\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                          <span class=\"ml-1.5 font-medium\">ข้างขวา</span>\n                        </label>\n                        <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                          <input type=\"radio\" name=\"headachePeriorbitalSide\" value=\"both\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                          <span class=\"ml-1.5 font-medium\">ทั้งสองข้าง</span>\n                        </label>\n                      </div>\n                    </div>\n                  </div>\n\n                  <!-- ปวดท้ายทอย หรือร้าวลงต้นคอ/บ่า -->\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"headache_loc_occipital\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ปวดท้ายทอย หรือร้าวลงต้นคอ/บ่า</span>\n                      <span class=\"text-[11px] text-slate-500\">ปวดบริเวณด้านหลังศีรษะหรือต้นคอ (Occipital / Neck)</span>\n                    </div>\n                  </label>\n\n                  <!-- ปวดตึงรัดรอบศีรษะ -->\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"headache_loc_band\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ปวดตึงรัดรอบศีรษะ</span>\n                      <span class=\"text-[11px] text-slate-500\">เหมือนมีแถบยางหรือหมวกเหล็กรัดแน่นรอบหน้าผากและขมับ</span>\n                    </div>\n                  </label>\n\n                  <!-- ปวดตึงทั่วทั้งศีรษะ -->\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"headache_loc_diffuse\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ปวดตึงทั่วทั้งศีรษะ ไม่เจาะจงตำแหน่ง</span>\n                      <span class=\"text-[11px] text-slate-500\">ปวดกระจายทั่วทั้งหัว (Diffuse / Generalized)</span>\n                    </div>\n                  </label>\n\n                  <!-- ปวดบริเวณหน้าผาก โหนกแก้ม หรือรอบจมูก -->\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"headache_loc_facial_sinus\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ปวดบริเวณหน้าผาก โหนกแก้ม หรือรอบจมูก</span>\n                      <span class=\"text-[11px] text-slate-500\">ปวดแน่นตึงบริเวณโพรงไซนัส (Facial / Sinus region)</span>\n                    </div>\n                  </label>\n\n                  <!-- ตำแหน่งอื่นๆ -->\n                  <div class=\"sm:col-span-2\">\n                    <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                      <input type=\"checkbox\" id=\"headache_loc_other_chk\" onchange=\"toggleBranch('headache_loc_other_wrap', this.checked)\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                      <div class=\"ml-2.5\">\n                        <span class=\"font-semibold text-slate-800 block\">อื่นๆ (พิมพ์ระบุตำแหน่งเพิ่มเติม)</span>\n                        <span class=\"text-[11px] text-slate-500\">ระบุตำแหน่งปวดอื่นๆ ที่ไม่มีในตัวเลือก</span>\n                      </div>\n                    </label>\n                    <div id=\"headache_loc_other_wrap\" class=\"hidden mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl\">\n                      <label class=\"block text-slate-700 font-semibold mb-1\">พิมพ์ระบุตำแหน่งที่ปวด:</label>\n                      <input type=\"text\" id=\"headache_loc_other_text\" placeholder=\"เช่น บริเวณยอดกระหม่อม หรือหลังหู\"\n                        class=\"w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 text-xs\">\n                    </div>\n                  </div>\n\n                </div>\n              </div>\n\n              <!-- 2.2 ลักษณะความรู้สึกปวด -->\n              <div class=\"pt-2 border-t border-slate-100\">\n                <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">ลักษณะการปวด (เลือกได้หลายข้อ)</label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"headache_char_throbbing\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ปวดตุ๊บๆ ตามจังหวะชีพจร</span>\n                      <span class=\"text-[11px] text-slate-500\">ปวดเต้นตุ๊บๆ คล้ายเส้นเลือดเต้น (Pulsatile / Throbbing)</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"headache_char_tight_dull\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ปวดตึงๆ หนักๆ ตื้อๆ บีบรัดแน่น</span>\n                      <span class=\"text-[11px] text-slate-500\">รู้สึกหนักหัว ตื้อ มึน แน่นตึง (Tight / Pressing / Dull aching)</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"headache_char_sharp_stabbing\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ปวดเสียดแทงรุนแรงเหมือนถูกมีดแทง หรือแปลบฉับพลัน</span>\n                      <span class=\"text-[11px] text-slate-500\">ปวดแปล๊บรุนแรงเฉียบพลัน คล้ายถูกของแหลมทิ่มแทง</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"headache_char_burning_electric\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ปวดแสบร้อน หรือเสียวแปล๊บคล้ายไฟช็อต</span>\n                      <span class=\"text-[11px] text-slate-500\">ปวดตามแนวเส้นประสาท (Burning / Electric shock-like)</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer sm:col-span-2\">\n                    <input type=\"checkbox\" id=\"headache_char_boring_severe\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ปวดลึกรุนแรงทรมานจนอยู่นิ่งไม่ได้ ทุรนทุราย</span>\n                      <span class=\"text-[11px] text-slate-500\">ปวดลึกหลังเบ้าตา ต้องเดินไปเดินมาหรือรู้สึกกระวนกระวาย</span>\n                    </div>\n                  </label>\n                </div>\n              </div>\n\n            </div>\n          </div>\n\n          <!-- CARD 3: ปัจจัยกระตุ้นและท่าทาง (Triggers & Aggravating Factors) -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"zap\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-800 section-title\" data-base-title=\"ปัจจัยกระตุ้นและท่าทาง\">3. ปัจจัยกระตุ้นและท่าทาง</h2>\n                <p class=\"text-xs text-slate-500\">สิ่งที่ทำให้อาการปวดศีรษะกำเริบหรือรุนแรงขึ้น (เลือกได้หลายข้อ หรือไม่ต้องเลือกหากไม่มี)</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4\">\n              <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                \n                <!-- ไอ จาม เบ่ง ก้ม -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"headache_trig_valsalva\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block\">ปวดมากขึ้นเวลาไอ จาม เบ่ง หรือก้มศีรษะ</span>\n                    <span class=\"text-[11px] text-slate-500\">ปวดสะเทือนในศีรษะรุนแรงเวลาเบ่งอุจจาระ ไอ จาม หรือก้มศีรษะลงต่ำ</span>\n                  </div>\n                </label>\n\n                <!-- นอนราบ ตื่นเช้า ปลุกตื่น -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"headache_trig_supine_morning\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block\">ปวดมากขึ้นเวลานอนราบ ตื่นนอนตอนเช้า หรือปลุกให้ตื่นกลางดึก</span>\n                    <span class=\"text-[11px] text-slate-500\">ปวดรุนแรงจนตื่นจากหลับ หรือตื่นเช้ามาปวดมากที่สุด</span>\n                  </div>\n                </label>\n\n                <!-- ลุกนั่งยืน ปวดมากขึ้น -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"headache_trig_upright\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block\">ปวดมากขึ้นเวลาลุกขึ้นนั่งหรือยืน นอนราบแล้วทุเลาลงชัดเจน</span>\n                    <span class=\"text-[11px] text-slate-500\">ปวดสัมพันธ์กับท่านั่งหรือท่ายืน และดีขึ้นชัดเจนเมื่อได้นอนราบ</span>\n                  </div>\n                </label>\n\n                <!-- เคี้ยวอาหารปวดขากรรไกร -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"headache_trig_jaw_claudication\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block\">ปวดเมื่อเคี้ยวอาหาร หรือเคี้ยวแล้วเมื่อยล้าขากรรไกรผิดปกติ</span>\n                    <span class=\"text-[11px] text-slate-500\">เคี้ยวข้าวแล้วเมื่อยตึงหรือปวดบริเวณขากรรไกรจนต้องหยุดพัก</span>\n                  </div>\n                </label>\n\n                <!-- เจ็บหนังศีรษะเวลาหวีผม -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"headache_trig_scalp_tenderness\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block\">เจ็บแปล๊บที่หนังศีรษะเวลาหวีผม สระผม หรือแตะโดนหนังศีรษะ</span>\n                    <span class=\"text-[11px] text-slate-500\">แตะโดนบริเวณขมับหรือหนังศีรษะแล้วเจ็บมากผิดปกติ (Scalp tenderness)</span>\n                  </div>\n                </label>\n\n                <!-- แสงจ้า เสียงดัง กลิ่นฉุน -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"headache_trig_light_sound\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block\">มีอาการมากขึ้นเมื่อเจอแสงจ้า เสียงดัง หรือกลิ่นฉุน</span>\n                    <span class=\"text-[11px] text-slate-500\">กลัวแสง กลัวเสียง ต้องการอยู่ในห้องเงียบมืด (Photophobia / Phonophobia)</span>\n                  </div>\n                </label>\n\n                <!-- อดนอน เครียด สายตา -->\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"headache_trig_stress_fatigue\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block\">สัมพันธ์กับการอดนอน พักผ่อนน้อย ความเครียด หรือใช้สายตานาน</span>\n                    <span class=\"text-[11px] text-slate-500\">นอนดึก ใช้หน้าจอคอมพิวเตอร์/โทรศัพท์นาน หรือมีความเครียดสะสม</span>\n                  </div>\n                </label>\n\n                <!-- สิ่งกระตุ้นอื่นๆ -->\n                <div class=\"sm:col-span-2\">\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"headache_trig_other_chk\" onchange=\"toggleBranch('headache_trig_other_wrap', this.checked)\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">อื่นๆ (พิมพ์ระบุสิ่งกระตุ้นเพิ่มเติม)</span>\n                      <span class=\"text-[11px] text-slate-500\">ระบุปัจจัยหรือสิ่งกระตุ้นอื่นๆ ที่ทำให้อาการปวดกำเริบ</span>\n                    </div>\n                  </label>\n                  <div id=\"headache_trig_other_wrap\" class=\"hidden mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl\">\n                    <label class=\"block text-slate-700 font-semibold mb-1\">พิมพ์ระบุสิ่งกระตุ้นเพิ่มเติม:</label>\n                    <input type=\"text\" id=\"headache_trig_other_text\" placeholder=\"เช่น ช่วงมีประจำเดือน, อาหารบางชนิด, อากาศร้อน\"\n                      class=\"w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 text-xs\">\n                  </div>\n                </div>\n\n              </div>\n            </div>\n          </div>\n\n          <!-- CARD 4: สัญญาณเตือนทางระบบประสาทและตา (Neurological & Ocular Warning Signs) -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"shield-alert\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-800 section-title\" data-base-title=\"สัญญาณเตือนทางระบบประสาทและตา\">4. สัญญาณเตือนทางระบบประสาทและตา</h2>\n                <p class=\"text-xs text-slate-500\">กรุณาเลือกอาการที่ท่านมีร่วมด้วยอย่างตรงไปตรงมา (เลือกได้หลายข้อ หรือไม่ต้องเลือกหากไม่มี)</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4\">\n              \n              <!-- Sub-header 1: สัญญาณเตือนทางระบบประสาท -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">สัญญาณเตือนทางระบบประสาท</label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                  \n                  <!-- แขนขาอ่อนแรง / ชาครึ่งซีก -->\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"headache_rf_weakness_numb\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">แขนขาอ่อนแรง หรือชาครึ่งซีก / ยกแขนไม่ขึ้น</span>\n                      <span class=\"text-[11px] text-slate-500\">แรงแขนหรือขาข้างใดข้างหนึ่งลดลง ยกไม่ขึ้น หรือถือของหล่น</span>\n                    </div>\n                  </label>\n\n                  <!-- ปากเบี้ยว / พูดไม่ชัด -->\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"headache_rf_facial_speech\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">มุมปากตก ปากเบี้ยว ยิ้มไม่เท่ากัน หรือพูดไม่ชัด พูดอ้อแอ้</span>\n                      <span class=\"text-[11px] text-slate-500\">พูดติดขัด พูดไม่เป็นคำ นึกคำพูดไม่ออก หรือฟังคนอื่นไม่เข้าใจ</span>\n                    </div>\n                  </label>\n\n                  <!-- เดินเซมาก ทรงตัวไม่ได้ -->\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"headache_rf_ataxia_walk\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">เดินเซมาก ทรงตัวไม่ได้ แขนขาไม่สัมพันธ์กัน</span>\n                      <span class=\"text-[11px] text-slate-500\">เดินเซเอียงไปข้างใดข้างหนึ่ง หรือทรงตัวไม่ได้แม้พยายาม</span>\n                    </div>\n                  </label>\n\n                  <!-- ชักเกร็ง / วูบหมดสติ -->\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"headache_rf_seizure_syncope\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">มีอาการชักเกร็ง หรือวูบหมดสติ ไม่รู้สึกตัว</span>\n                      <span class=\"text-[11px] text-slate-500\">มีอาการเกร็งกระตุก ตาค้าง หรือหมดสติตาลอยไปชั่วขณะ</span>\n                    </div>\n                  </label>\n\n                  <!-- ซึมลง สับสน พฤติกรรมเปลี่ยน -->\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"headache_rf_altered_mental\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ซึมลง สับสน ถามตอบไม่รู้เรื่อง หรือบุคลิกภาพ/พฤติกรรมเปลี่ยนไปเฉียบพลัน</span>\n                      <span class=\"text-[11px] text-slate-500\">จำวันเวลาสถานที่ไม่ได้ ปลุกตื่นยาก หรือมีอาการเอะอะก้าวร้าวผิดปกติ</span>\n                    </div>\n                  </label>\n\n                  <!-- มีไข้สูง หรือหนาวสั่น -->\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"headache_rf_fever\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">มีไข้สูง หรือหนาวสั่น</span>\n                      <span class=\"text-[11px] text-slate-500\">ตัวร้อนจัด หนาวสั่น หรือวัดอุณหภูมิร่างกายได้ตั้งแต่ 38 องศาเซลเซียสขึ้นไป</span>\n                    </div>\n                  </label>\n\n                  <!-- คอแข็งเกร็ง ก้มคอไม่ลง -->\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"headache_rf_stiff_neck\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">คอแข็งเกร็ง ก้มคอไม่ลง</span>\n                      <span class=\"text-[11px] text-slate-500\">ก้มคอแล้วคางไม่สามารถแตะถึงอก หรือเจ็บเกร็งคอรุนแรงเมื่อก้มคอ</span>\n                    </div>\n                  </label>\n\n                </div>\n              </div>\n\n              <!-- Sub-header 2: สัญญาณเตือนทางตาและการมองเห็น -->\n              <div class=\"pt-2 border-t border-slate-100\">\n                <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">สัญญาณเตือนทางตาและการมองเห็น</label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                  \n                  <!-- ต้อหินเฉียบพลัน (ตาแดง ปวดเบ้าตารุนแรง ตามัว เห็นรุ้ง) -->\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"headache_rf_acute_glaucoma\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ตาแดง ปวดเบ้าตารุนแรง ตามัวลงทันที หรือมองเห็นรุ้งรอบดวงไฟ</span>\n                      <span class=\"text-[11px] text-slate-500\">ปวดลูกตารุนแรงร่วมกับตาพร่ามัวลงอย่างรวดเร็ว หรือเห็นวงรุ้งรอบดวงไฟ</span>\n                    </div>\n                  </label>\n\n                  <!-- ภาพซ้อน / ลานสายตาดับมืด -->\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"headache_rf_diplopia_field\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">มองเห็นภาพซ้อน หรือลานสายตาดับมืดไปครึ่งซีก</span>\n                      <span class=\"text-[11px] text-slate-500\">เห็นวัตถุแยกเป็น 2 ชิ้น หรือตามัวมองไม่เห็นลานสายตาฝั่งใดฝั่งหนึ่ง</span>\n                    </div>\n                  </label>\n\n                  <!-- มีอาการเตือนทางสายตา (Visual Aura) -->\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer sm:col-span-2\">\n                    <input type=\"checkbox\" id=\"headache_has_visual_aura\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">มีอาการตาพร่า เห็นแสงวูบวาบ แสงซิกแซก หรือภาพคล้ายกระจกแตกนำมาก่อนปวดศีรษะ</span>\n                      <span class=\"text-[11px] text-slate-500\">เห็นแสงระยิบระยับ เส้นซิกแซกขยายตัว 10-30 นาทีก่อนเริ่มปวดศีรษะ</span>\n                    </div>\n                  </label>\n\n                </div>\n              </div>\n\n            </div>\n          </div>\n\n          <!-- CARD 5: อาการร่วมทั่วไป และประวัติเสี่ยงสำคัญ (General Associated & High-Risk Background) -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"clipboard-check\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-800 section-title\" data-base-title=\"อาการร่วมทั่วไป และประวัติเสี่ยงสำคัญ\">5. อาการร่วมทั่วไป และประวัติเสี่ยงสำคัญ</h2>\n                <p class=\"text-xs text-slate-500\">ประเมินอาการร่วมทางระบบทางเดินอาหาร ออโตโนมิก และประวัติเสี่ยงทางการแพทย์</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4 text-xs\">\n              \n              <!-- คลื่นไส้ / อาเจียน -->\n              <div>\n                <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                  <input type=\"checkbox\" id=\"headache_has_nausea_vomit\" onchange=\"handleHeadacheVomitChange()\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block\">มีอาการคลื่นไส้ หรืออาเจียน</span>\n                    <span class=\"text-[11px] text-slate-500\">คลื่นไส้ พะอืดพะอม หรืออาเจียนร่วมกับอาการปวดศีรษะ</span>\n                  </div>\n                </label>\n\n                <!-- กิ่งเจาะลึก: คลื่นไส้/อาเจียน -->\n                <div id=\"headache_vomit_detail_wrap\" class=\"hidden mt-2 bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2\">\n                  <span class=\"font-semibold text-slate-800 block\">ลักษณะอาการคลื่นไส้/อาเจียน:</span>\n                  <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2\">\n                    <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"radio\" name=\"headacheVomitStatus\" value=\"nausea_only\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium\">คลื่นไส้อย่างเดียว ยังไม่อาเจียน</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"radio\" name=\"headacheVomitStatus\" value=\"vomiting\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium\">มีอาเจียนออกมาทั่วไป</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"radio\" name=\"headacheVomitStatus\" value=\"projectile\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium\">มีอาการอาเจียนพุ่งรุนแรงทันทีโดยไม่คลื่นไสอนำมาก่อน</span>\n                    </label>\n                  </div>\n                </div>\n              </div>\n\n              <!-- Cranial Autonomic Symptoms -->\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                <input type=\"checkbox\" id=\"headache_has_autonomic\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">ตาแดง น้ำตาไหล หนังตาตก หรือคัดจมูกข้างเดียวกับที่ปวด</span>\n                  <span class=\"text-[11px] text-slate-500\">มีน้ำตาไหล ตาแดง หรือน้ำมูกไหลข้างเดียวกับข้างที่ปวดศีรษะ</span>\n                </div>\n              </label>\n\n              <!-- ประวัติเสี่ยงสำคัญ (High-Risk Background Checkboxes) -->\n              <div class=\"pt-2 border-t border-slate-100\">\n                <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">ประวัติเสี่ยงทางการแพทย์สำคัญ (High-Risk History)</label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2\">\n                  \n                  <!-- อุบัติเหตุศีรษะ 1-3 เดือน -->\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"headache_risk_recent_trauma\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">มีประวัติอุบัติเหตุทางศีรษะ ล้ม หรือศีรษะกระแทกใน 1-3 เดือนที่ผ่านมา</span>\n                      <span class=\"text-[11px] text-slate-500\">เคยประสบอุบัติเหตุกระทบกระแทกบริเวณศีรษะ ล้ม หรือได้รับบาดเจ็บ</span>\n                    </div>\n                  </label>\n\n                  <!-- ตั้งครรภ์ / หลังคลอด 6 สัปดาห์ -->\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"headache_risk_pregnancy_postpartum\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">กำลังตั้งครรภ์ หรือเพิ่งคลอดบุตรไม่เกิน 6 สัปดาห์</span>\n                      <span class=\"text-[11px] text-slate-500\">อยู่ระหว่างการตั้งครรภ์ หรือคลอดบุตรมาไม่เกิน 6 สัปดาห์</span>\n                    </div>\n                  </label>\n\n                  <!-- ประวัติมะเร็ง -->\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"headache_risk_cancer\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">มีประวัติโรคมะเร็ง</span>\n                      <span class=\"text-[11px] text-slate-500\">ได้รับการวินิจฉัยหรืออยู่ระหว่างการรักษาโรคมะเร็งชนิดใดๆ</span>\n                    </div>\n                  </label>\n\n                  <!-- ภูมิคุ้มกันบกพร่อง / สเตียรอยด์ / HIV -->\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"headache_risk_immunocompromised\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">มีภาวะภูมิคุ้มกันบกพร่อง รับประทานยากดภูมิ สเตียรอยด์ หรือติดเชื้อ HIV</span>\n                      <span class=\"text-[11px] text-slate-500\">มีโรคประจำตัวเกี่ยวกับภูมิคุ้มกัน หรือใช้ยากดภูมิต้านทานต่อเนื่อง</span>\n                    </div>\n                  </label>\n\n                  <!-- ยาละลายลิ่มเลือด / ต้านเกล็ดเลือด -->\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"headache_risk_anticoagulants\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">รับประทานยาละลายลิ่มเลือด หรือยาต้านเกล็ดเลือด</span>\n                      <span class=\"text-[11px] text-slate-500\">เช่น วาร์ฟาริน (Warfarin), ยาต้านการแข็งตัวของเลือดรุ่นใหม่ หรือยาแอสไพริน</span>\n                    </div>\n                  </label>\n\n                  <!-- อายุ 50 ปีขึ้นไป เริ่มปวดศีรษะแบบใหม่ -->\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                    <input type=\"checkbox\" id=\"headache_risk_new_onset_age50\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">อายุ 50 ปีขึ้นไป ที่เพิ่งเริ่มมีอาการปวดศีรษะแบบใหม่ที่ไม่เคยเป็นมาก่อน</span>\n                      <span class=\"text-[11px] text-slate-500\">เริ่มมีอาการปวดศีรษะเป็นครั้งแรกในชีวิต หรือลักษณะปวดเปลี่ยนไปจากเดิมอย่างสิ้นเชิง</span>\n                    </div>\n                  </label>\n\n                  <!-- รับประทานยาแก้ปวดบ่อยเกือบทุกวัน (MOH) -->\n                  <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer sm:col-span-2\">\n                    <input type=\"checkbox\" id=\"headache_risk_med_overuse\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">รับประทานยาแก้ปวดบ่อยเกือบทุกวันติดต่อกันเป็นเวลานาน</span>\n                      <span class=\"text-[11px] text-slate-500\">ทานยาพาราเซตามอล ยาแก้ปวดไมเกรน หรือยาแก้ปวดข้อต่อเนื่องเกิน 10-15 วันต่อเดือน</span>\n                    </div>\n                  </label>\n\n                </div>\n              </div>\n\n            </div>\n          </div>\n\n          <!-- อาการอื่นๆ เป็นช่องกรอกอิสระ -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100\">\n              <div class=\"bg-slate-100 text-slate-600 p-2 rounded-xl\">\n                <i data-lucide=\"message-square-plus\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-800\">อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2>\n                <p class=\"text-xs text-slate-500\">ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี เช่น อ่อนเพลียมาก, แน่นหน้าอก, วิงเวียนศีรษะ)</p>\n              </div>\n            </div>\n            <textarea id=\"headache_other_free\" rows=\"2\" placeholder=\"พิมพ์ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)...\" \n              class=\"w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white\"></textarea>\n          </div>\n\n        </div> <!-- END HEADACHE QUESTIONNAIRE SECTION -->\n",
  algorithm: {
  "id": "headache",
  "titleTh": "ปวดศีรษะ",
  "titleEn": "Headache",
  "sections": [
    {
      "sectionNo": 1,
      "titleTh": "ระยะเวลา รูปแบบการเกิด และระดับความปวด (Duration, Onset & Pain Score)",
      "items": [
        {
          "key": "headacheOnsetMode",
          "labelTh": "รูปแบบการเริ่มมีอาการปวดศีรษะ (Onset Mode)",
          "type": "single_choice",
          "options": [
            {
              "value": "thunderclap",
              "patientTh": "ปวดรุนแรงทันทีทันใดในไม่กี่วินาที หรือรุนแรงสูงสุดใน 1-2 นาที (Thunderclap / ฟ้าผ่า / ปวดรุนแรงที่สุดในชีวิต)",
              "doctorTh": "Thunderclap onset (< 1-2 min to peak) (Suspect SAH / RCVS 🚩)",
              "isRedFlag": true
            },
            {
              "value": "gradual",
              "patientTh": "ค่อยๆ เริ่มปวด และเป็นมากขึ้นเรื่อยๆ ในช่วงหลายชั่วโมงหรือหลายวัน",
              "doctorTh": "Gradual onset over hours to days"
            },
            {
              "value": "chronic",
              "patientTh": "ปวดตื้อๆ เป็นๆ หายๆ มานานหลายสัปดาห์หรือหลายเดือน",
              "doctorTh": "Chronic recurrent / episodic"
            },
            {
              "value": "pattern_change",
              "patientTh": "มีประวัติปวดศีรษะเรื้อรังอยู่เดิม แต่ครั้งนี้ปวดเปลี่ยนรูปแบบไปจากเดิมอย่างชัดเจน หรือรุนแรงกว่าทุกครั้งที่เคยเป็น",
              "doctorTh": "New onset or change in pattern of prior chronic headache 🚩",
              "isRedFlag": true
            }
          ]
        },
        {
          "key": "headachePainScore",
          "labelTh": "ระดับความเจ็บปวด (Pain Score 0 - 10)",
          "type": "numeric_scale",
          "min": 0,
          "max": 10
        }
      ]
    },
    {
      "sectionNo": 2,
      "titleTh": "ตำแหน่ง และลักษณะการปวด (Location & Characteristics)",
      "items": [
        {
          "key": "headache_loc_unilateral",
          "patientTh": "ปวดข้างเดียว (เช่น ขมับข้างซ้าย หรือข้างขวา) (Unilateral / Hemicranial)"
        },
        {
          "key": "headache_loc_periorbital",
          "patientTh": "ปวดรอบเบ้าตา หรือลึกหลังกระบอกตา (Periorbital / Retro-orbital)"
        },
        {
          "key": "headache_loc_occipital",
          "patientTh": "ปวดท้ายทอย หรือร้าวลงต้นคอ/บ่า (Occipital / Neck)"
        },
        {
          "key": "headache_loc_band",
          "patientTh": "ปวดตึงรัดรอบศีรษะ เหมือนมีแถบยางหรือหมวกเหล็กรัด (Band-like / Tightness)"
        },
        {
          "key": "headache_loc_diffuse",
          "patientTh": "ปวดตึงทั่วทั้งศีรษะ ไม่เจาะจงตำแหน่ง (Diffuse / Generalized)"
        },
        {
          "key": "headache_loc_facial_sinus",
          "patientTh": "ปวดบริเวณหน้าผาก โหนกแก้ม หรือรอบจมูก (Facial / Sinus region)"
        },
        {
          "key": "headache_loc_other",
          "patientTh": "อื่นๆ (ระบุตำแหน่งเพิ่มเติม)"
        },
        {
          "key": "headache_char_throbbing",
          "patientTh": "ปวดตุ๊บๆ ตามจังหวะชีพจร (Pulsatile / Throbbing)"
        },
        {
          "key": "headache_char_tight_dull",
          "patientTh": "ปวดตึงๆ หนักๆ ตื้อๆ บีบรัดแน่น (Tight / Pressing / Dull aching)"
        },
        {
          "key": "headache_char_sharp_stabbing",
          "patientTh": "ปวดเสียดแทงรุนแรงเหมือนถูกมีดแทง หรือฟ้าผ่า",
          "doctorTh": "Sharp / Stabbing / Severe lancinating 🚩",
          "isRedFlag": true
        },
        {
          "key": "headache_char_burning_electric",
          "patientTh": "ปวดแสบร้อน หรือเสียวแปล๊บคล้ายไฟช็อต (Burning / Electric shock-like)"
        },
        {
          "key": "headache_char_boring_severe",
          "patientTh": "ปวดลึกรุนแรงทรมานจนอยู่นิ่งไม่ได้ ทุรนทุราย (Deep boring / Excruciating)"
        }
      ]
    },
    {
      "sectionNo": 3,
      "titleTh": "ปัจจัยกระตุ้นและท่าทาง (Triggers & Aggravating Factors)",
      "items": [
        {
          "key": "headache_trig_valsalva",
          "patientTh": "ปวดมากขึ้นเวลาไอ จาม เบ่ง หรือก้มศีรษะ",
          "doctorTh": "Worsened by Valsalva / Cough / Bending (Suspect Raised ICP 🚩)",
          "isRedFlag": true
        },
        {
          "key": "headache_trig_supine_morning",
          "patientTh": "ปวดมากขึ้นเวลานอนราบ ตื่นนอนตอนเช้าแล้วปวดมากที่สุด หรือปลุกให้ตื่นกลางดึก",
          "doctorTh": "Worsened by recumbency / Awakening patient from sleep 🚩",
          "isRedFlag": true
        },
        {
          "key": "headache_trig_upright",
          "patientTh": "ปวดมากขึ้นเวลาลุกขึ้นนั่งหรือยืน นอนราบแล้วทุเลาลงชัดเจน (Postural / Orthostatic headache)"
        },
        {
          "key": "headache_trig_jaw_claudication",
          "patientTh": "ปวดเมื่อเคี้ยวอาหาร หรือเคี้ยวแล้วเมื่อยล้าขากรรไกรผิดปกติ",
          "doctorTh": "Jaw claudication (Suspect Giant Cell Arteritis 🚩)",
          "isRedFlag": true
        },
        {
          "key": "headache_trig_scalp_tenderness",
          "patientTh": "เจ็บแปล๊บที่หนังศีรษะเวลาหวีผม สระผม หรือแตะโดนหนังศีรษะ",
          "doctorTh": "Scalp tenderness / Temporal artery tenderness (Suspect Giant Cell Arteritis 🚩)",
          "isRedFlag": true
        },
        {
          "key": "headache_trig_light_sound",
          "patientTh": "มีอาการมากขึ้นเมื่อเจอแสงจ้า เสียงดัง หรือกลิ่นฉุน (Photophobia / Phonophobia)"
        },
        {
          "key": "headache_trig_stress_fatigue",
          "patientTh": "สัมพันธ์กับการอดนอน พักผ่อนน้อย ความเครียด หรือใช้สายตานาน"
        },
        {
          "key": "headache_trig_other",
          "patientTh": "อื่นๆ (ระบุสิ่งกระตุ้นเพิ่มเติม)"
        }
      ]
    },
    {
      "sectionNo": 4,
      "titleTh": "สัญญาณเตือนทางระบบประสาทและตา (Neurological & Ocular Warning Signs)",
      "items": [
        {
          "key": "headache_rf_weakness_numb",
          "patientTh": "แขนขาอ่อนแรง หรือชาครึ่งซีก / ยกแขนไม่ขึ้น",
          "isRedFlag": true
        },
        {
          "key": "headache_rf_facial_speech",
          "patientTh": "มุมปากตก ปากเบี้ยว ยิ้มไม่เท่ากัน หรือพูดไม่ชัด พูดอ้อแอ้",
          "isRedFlag": true
        },
        {
          "key": "headache_rf_ataxia_walk",
          "patientTh": "เดินเซมาก ทรงตัวไม่ได้ แขนขาไม่สัมพันธ์กัน",
          "isRedFlag": true
        },
        {
          "key": "headache_rf_seizure_syncope",
          "patientTh": "มีอาการชักเกร็ง หรือวูบหมดสติ ไม่รู้สึกตัว",
          "isRedFlag": true
        },
        {
          "key": "headache_rf_altered_mental",
          "patientTh": "ซึมลง สับสน ถามตอบไม่รู้เรื่อง หรือบุคลิกภาพ/พฤติกรรมเปลี่ยนไปเฉียบพลัน",
          "isRedFlag": true
        },
        {
          "key": "headache_rf_fever",
          "patientTh": "มีไข้สูง หรือหนาวสั่น",
          "isRedFlag": true
        },
        {
          "key": "headache_rf_stiff_neck",
          "patientTh": "คอแข็งเกร็ง ก้มคอไม่ลง",
          "isRedFlag": true
        },
        {
          "key": "headache_rf_fever_stiff_neck",
          "patientTh": "มีไข้สูง ร่วมกับคอแข็งเกร็ง (Suspect Meningitis)",
          "isRedFlag": true
        },
        {
          "key": "headache_rf_acute_glaucoma",
          "patientTh": "ตาแดง ปวดเบ้าตารุนแรง ตามัวลงทันที หรือมองเห็นรุ้งรอบดวงไฟ",
          "isRedFlag": true
        },
        {
          "key": "headache_rf_diplopia_field",
          "patientTh": "มองเห็นภาพซ้อน หรือลานสายตาดับมืดไปครึ่งซีก",
          "isRedFlag": true
        },
        {
          "key": "headache_has_visual_aura",
          "patientTh": "มีอาการตาพร่า เห็นแสงวูบวาบ แสงซิกแซก หรือภาพคล้ายกระจกแตกนำมาก่อนปวดศีรษะ"
        }
      ]
    },
    {
      "sectionNo": 5,
      "titleTh": "อาการร่วมทั่วไป และประวัติเสี่ยงสำคัญ (General Associated & High-Risk Background)",
      "items": [
        {
          "key": "headache_has_nausea_vomit",
          "patientTh": "มีอาการคลื่นไส้ หรืออาเจียน"
        },
        {
          "key": "headache_has_autonomic",
          "patientTh": "ตาแดง น้ำตาไหล หนังตาตก หรือคัดจมูกข้างเดียวกับที่ปวด (Cranial autonomic symptoms)"
        },
        {
          "key": "headache_risk_recent_trauma",
          "patientTh": "มีประวัติอุบัติเหตุทางศีรษะ ล้ม หรือศีรษะกระแทกใน 1-3 เดือนที่ผ่านมา",
          "isRedFlag": true
        },
        {
          "key": "headache_risk_pregnancy_postpartum",
          "patientTh": "กำลังตั้งครรภ์ หรือเพิ่งคลอดบุตรไม่เกิน 6 สัปดาห์",
          "isRedFlag": true
        },
        {
          "key": "headache_risk_cancer",
          "patientTh": "มีประวัติโรคมะเร็ง",
          "isRedFlag": true
        },
        {
          "key": "headache_risk_immunocompromised",
          "patientTh": "มีภาวะภูมิคุ้มกันบกพร่อง รับประทานยากดภูมิ สเตียรอยด์ หรือติดเชื้อ HIV",
          "isRedFlag": true
        },
        {
          "key": "headache_risk_anticoagulants",
          "patientTh": "รับประทานยาละลายลิ่มเลือด หรือยาต้านเกล็ดเลือด (เช่น Warfarin, DOAC, Aspirin, Clopidogrel)",
          "isRedFlag": true
        },
        {
          "key": "headache_risk_new_onset_age50",
          "patientTh": "อายุ 50 ปีขึ้นไป ที่เพิ่งเริ่มมีอาการปวดศีรษะแบบใหม่ที่ไม่เคยเป็นมาก่อน",
          "isRedFlag": true
        },
        {
          "key": "headache_risk_med_overuse",
          "patientTh": "รับประทานยาแก้ปวดบ่อยเกือบทุกวันติดต่อกันเป็นเวลานาน"
        }
      ]
    }
  ]
},
  seedPatients: [
  {
    "id": "case-071",
    "queue_number": "A-071",
    "hn": "6705519",
    "name": "นางกานดา มณีรัตน์",
    "age": 46,
    "gender": "หญิง",
    "chief_complaint": "headache",
    "chief_complaint_title": "ปวดศีรษะ",
    "status": "waiting",
    "timestamp": "2026-10-26T02:21:26.424Z",
    "durationVal": 1,
    "durationUnit": "hours",
    "headachePainScore": 10,
    "headacheOnsetMode": "thunderclap",
    "headacheLocs": [
      "occipital",
      "diffuse"
    ],
    "headacheUnilateralSide": "none",
    "headachePeriorbitalSide": "none",
    "headacheLocOther": "",
    "headacheChars": [
      "sharp_stabbing",
      "throbbing"
    ],
    "headache_trig_valsalva": true,
    "headache_trig_supine_morning": false,
    "headache_trig_upright": false,
    "headache_trig_jaw_claudication": false,
    "headache_trig_scalp_tenderness": false,
    "headache_trig_light_sound": false,
    "headache_trig_stress_fatigue": false,
    "headache_trig_other": "",
    "headache_rf_weakness_numb": false,
    "headache_rf_facial_speech": false,
    "headache_rf_ataxia_walk": false,
    "headache_rf_seizure_syncope": false,
    "headache_rf_altered_mental": false,
    "headache_rf_fever": false,
    "headache_rf_stiff_neck": false,
    "headache_rf_fever_stiff_neck": false,
    "headache_rf_acute_glaucoma": false,
    "headache_rf_diplopia_field": false,
    "headache_has_visual_aura": false,
    "headache_has_nausea_vomit": true,
    "headacheVomitStatus": "projectile",
    "headache_has_autonomic": false,
    "headache_risk_recent_trauma": false,
    "headache_risk_pregnancy_postpartum": false,
    "headache_risk_cancer": false,
    "headache_risk_immunocompromised": false,
    "headache_risk_anticoagulants": false,
    "headache_risk_new_onset_age50": false,
    "headache_risk_med_overuse": false,
    "hospRecordStatus": "ratchaburi",
    "underlying": [
      "ความดันสูง (HT)"
    ],
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "Amlodipine 5 mg 1 tab po od pc",
    "doctor_notes": {
      "additional_hpi": "ผู้ป่วยมีอาการปวดศีรษะรุนแรงเฉียบพลันเหมือนฟ้าผ่า (Thunderclap headache) ปวดรุนแรงสูงสุดระดับ 10/10 ภายใน 30 วินาที ขณะยกถังน้ำหนัก ปวดมากบริเวณท้ายทอยร้าวลงต้นคอ มีอาเจียนพุ่งรุนแรง 2 ครั้ง ปฏิเสธประวัติอุบัติเหตุ ไม่มีไข้ ไม่มีแขนขาอ่อนแรง",
      "physical_exam": "BT 36.9 C, PR 92/min, RR 20/min, BP 184/100 mmHg, SpO2 98%. Neuro: Alert, cooperative, pupils 3 mm RTLBE, EOM full, no facial palsy, motor grade V all extremities. Neck: Marked stiffness on flexion (Stiff neck positive, Kernig sign positive).",
      "preliminary_dx": "Suspected Spontaneous Aneurysmal Subarachnoid Hemorrhage (SAH) Hunt & Hess Grade II with Severe Hypertension 🚩",
      "plan": "STAT Non-contrast CT Brain immediately. If CT negative within 6 hours or inconclusive, proceed to Lumbar Puncture (LP) for CSF xanthochromia. Keep SBP < 140 with Nicardipine IV infusion. Nimodipine 60 mg po q 4h. Urgent consult Neurosurgery."
    }
  },
  {
    "id": "case-072",
    "queue_number": "A-072",
    "hn": "6706188",
    "name": "นายปิยะพงษ์ ศรีวิชัย",
    "age": 29,
    "gender": "ชาย",
    "chief_complaint": "headache",
    "chief_complaint_title": "ปวดศีรษะ",
    "status": "waiting",
    "timestamp": "2026-10-26T02:01:26.424Z",
    "durationVal": 2,
    "durationUnit": "days",
    "headachePainScore": 8,
    "headacheOnsetMode": "gradual",
    "headacheLocs": [
      "diffuse",
      "occipital"
    ],
    "headacheUnilateralSide": "none",
    "headachePeriorbitalSide": "none",
    "headacheLocOther": "",
    "headacheChars": [
      "tight_dull",
      "throbbing"
    ],
    "headache_trig_valsalva": false,
    "headache_trig_supine_morning": false,
    "headache_trig_upright": false,
    "headache_trig_jaw_claudication": false,
    "headache_trig_scalp_tenderness": false,
    "headache_trig_light_sound": true,
    "headache_trig_stress_fatigue": false,
    "headache_trig_other": "",
    "headache_rf_weakness_numb": false,
    "headache_rf_facial_speech": false,
    "headache_rf_ataxia_walk": false,
    "headache_rf_seizure_syncope": false,
    "headache_rf_altered_mental": true,
    "headache_rf_fever": true,
    "headache_rf_stiff_neck": true,
    "headache_rf_fever_stiff_neck": true,
    "headache_rf_acute_glaucoma": false,
    "headache_rf_diplopia_field": false,
    "headache_has_visual_aura": false,
    "headache_has_nausea_vomit": true,
    "headacheVomitStatus": "vomiting",
    "headache_has_autonomic": false,
    "headache_risk_recent_trauma": false,
    "headache_risk_pregnancy_postpartum": false,
    "headache_risk_cancer": false,
    "headache_risk_immunocompromised": false,
    "headache_risk_anticoagulants": false,
    "headache_risk_new_onset_age50": false,
    "headache_risk_med_overuse": false,
    "hospRecordStatus": "self",
    "underlying": ["ปฏิเสธ"],
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "ไม่มี (ซื้อ Paracetamol ทานเอง)",
    "doctor_notes": {
      "additional_hpi": "2 วันก่อนเริ่มมีไข้สูง หนาวสั่น ปวดศีรษะตึงทั่วทั้งศีรษะรุนแรงขึ้นเรื่อยๆ ทานพาราเซตามอลไม่ทุเลา วันนี้ญาติสังเกตว่าเริ่มซึมลง สับสน ถามตอบช้า ไม่ค่อยรู้เรื่อง ก้มคอไม่ได้ มีอาเจียน 3 ครั้ง",
      "physical_exam": "BT 39.2 C, PR 112/min, RR 22/min, BP 118/74 mmHg. Neuro: Lethargic, confused to time and place, GCS E3V4M6 = 13. Pupils 3 mm RTLBE. Marked nuchal rigidity (Stiff neck positive, Brudzinski sign positive). No focal motor deficit.",
      "preliminary_dx": "Acute Community-Acquired Bacterial Meningitis with Encephalopathy 🚩",
      "plan": "STAT Blood Hemoculture x 2 bottles. Empirical IV Ceftriaxone 2 g q 12h + Vancomycin 1 g q 12h + Dexamethasone 10 mg IV stat (given before/with 1st dose of antibiotics). STAT CT Brain to rule out mass effect prior to Lumbar Puncture (LP) for CSF analysis and culture. Isolation precautions."
    }
  },
  {
    "id": "case-073",
    "queue_number": "A-073",
    "hn": "6708214",
    "name": "นางสาวพิมพ์ชนก รัตนโกสินทร์",
    "age": 32,
    "gender": "หญิง",
    "chief_complaint": "headache",
    "chief_complaint_title": "ปวดศีรษะ",
    "status": "waiting",
    "timestamp": "2026-10-26T01:46:26.424Z",
    "durationVal": 4,
    "durationUnit": "hours",
    "headachePainScore": 7,
    "headacheOnsetMode": "gradual",
    "headacheLocs": [
      "unilateral"
    ],
    "headacheUnilateralSide": "left",
    "headachePeriorbitalSide": "none",
    "headacheLocOther": "",
    "headacheChars": [
      "throbbing"
    ],
    "headache_trig_valsalva": false,
    "headache_trig_supine_morning": false,
    "headache_trig_upright": false,
    "headache_trig_jaw_claudication": false,
    "headache_trig_scalp_tenderness": false,
    "headache_trig_light_sound": true,
    "headache_trig_stress_fatigue": true,
    "headache_trig_other": "",
    "headache_rf_weakness_numb": false,
    "headache_rf_facial_speech": false,
    "headache_rf_ataxia_walk": false,
    "headache_rf_seizure_syncope": false,
    "headache_rf_altered_mental": false,
    "headache_rf_fever": false,
    "headache_rf_stiff_neck": false,
    "headache_rf_fever_stiff_neck": false,
    "headache_rf_acute_glaucoma": false,
    "headache_rf_diplopia_field": false,
    "headache_has_visual_aura": true,
    "headache_has_nausea_vomit": true,
    "headacheVomitStatus": "nausea_only",
    "headache_has_autonomic": false,
    "headache_risk_recent_trauma": false,
    "headache_risk_pregnancy_postpartum": false,
    "headache_risk_cancer": false,
    "headache_risk_immunocompromised": false,
    "headache_risk_anticoagulants": false,
    "headache_risk_new_onset_age50": false,
    "headache_risk_med_overuse": false,
    "hospRecordStatus": "self",
    "underlying": [
      "ไมเกรน (Migraine)"
    ],
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "Paracetamol prn, Ibuprofen 400 mg prn",
    "doctor_notes": {
      "additional_hpi": "มีประวัติปวดไมเกรนเป็นประจำ 4 ชั่วโมงก่อนมีอาการตามัว เห็นเส้นหยักซิกแซกแสงระยิบระยับที่ตาลานสายตาด้านขวาประมาณ 20 นาที จากนั้นเริ่มปวดศีรษะตุ๊บๆ ที่ขมับซ้ายรุนแรง 7/10 มีคลื่นไส้ พะอืดพะอม ทนแสงจ้าและเสียงดังไม่ได้ ต้องการนอนในห้องมืด ปฏิเสธไข้ ไม่มีคอแข็ง แขนขาแรงปกติ",
      "physical_exam": "BT 36.6 C, PR 76/min, RR 16/min, BP 116/72 mmHg. Alert, good consciousness. Neuro: CN intact, no Horner syndrome, motor grade V all extremities, normal gait, no meningeal signs.",
      "preliminary_dx": "Acute Migraine with Typical Aura (Status Migrainosus flare)",
      "plan": "Rest in a quiet dark room. IV hydration 0.9% NSS 500 ml. Metoclopramide 10 mg IV stat. Ketorolac 30 mg IV stat (or Naproxen 500 mg po if tolerating). Triptan education and avoid overuse of analgesics."
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
    const durVal = document.getElementById('headacheDurationVal');
    const durUnit = document.getElementById('headacheDurationUnit');
    if (durVal) durVal.value = patient.durationVal || '';
    if (durUnit && patient.durationUnit) durUnit.value = patient.durationUnit;

    setRadioValue('headacheOnsetMode', patient.headacheOnsetMode);
    if (patient.headachePainScore !== undefined && patient.headachePainScore !== null) {
      setHeadachePainScore(patient.headachePainScore);
    } else {
      clearHeadachePainScore();
    }

    setChk = (id, val) => { const el = document.getElementById(id); if (el) el.checked = Boolean(val); };

    // Locations
    setChk('headache_loc_unilateral', patient.headacheLocs?.includes('unilateral'));
    setChk('headache_loc_periorbital', patient.headacheLocs?.includes('periorbital'));
    setChk('headache_loc_occipital', patient.headacheLocs?.includes('occipital'));
    setChk('headache_loc_band', patient.headacheLocs?.includes('band'));
    setChk('headache_loc_diffuse', patient.headacheLocs?.includes('diffuse'));
    setChk('headache_loc_facial_sinus', patient.headacheLocs?.includes('facial_sinus'));
    const hasLocOther = Boolean(patient.headacheLocOther);
    setChk('headache_loc_other_chk', hasLocOther);
    toggleBranch('headache_loc_other_wrap', hasLocOther);
    const locOtherText = document.getElementById('headache_loc_other_text');
    if (locOtherText) locOtherText.value = patient.headacheLocOther || '';

    handleHeadacheLocationChange();
    if (patient.headacheUnilateralSide && patient.headacheUnilateralSide !== 'none') {
      setRadioValue('headacheUnilateralSide', patient.headacheUnilateralSide);
    }
    if (patient.headachePeriorbitalSide && patient.headachePeriorbitalSide !== 'none') {
      setRadioValue('headachePeriorbitalSide', patient.headachePeriorbitalSide);
    }

    // Characteristics
    setChk('headache_char_throbbing', patient.headacheChars?.includes('throbbing'));
    setChk('headache_char_tight_dull', patient.headacheChars?.includes('tight_dull'));
    setChk('headache_char_sharp_stabbing', patient.headacheChars?.includes('sharp_stabbing'));
    setChk('headache_char_burning_electric', patient.headacheChars?.includes('burning_electric'));
    setChk('headache_char_boring_severe', patient.headacheChars?.includes('boring_severe'));

    // Triggers
    setChk('headache_trig_valsalva', patient.headache_trig_valsalva);
    setChk('headache_trig_supine_morning', patient.headache_trig_supine_morning);
    setChk('headache_trig_upright', patient.headache_trig_upright);
    setChk('headache_trig_jaw_claudication', patient.headache_trig_jaw_claudication);
    setChk('headache_trig_scalp_tenderness', patient.headache_trig_scalp_tenderness);
    setChk('headache_trig_light_sound', patient.headache_trig_light_sound);
    setChk('headache_trig_stress_fatigue', patient.headache_trig_stress_fatigue);
    const hasTrigOther = Boolean(patient.headache_trig_other);
    setChk('headache_trig_other_chk', hasTrigOther);
    toggleBranch('headache_trig_other_wrap', hasTrigOther);
    const trigOtherText = document.getElementById('headache_trig_other_text');
    if (trigOtherText) trigOtherText.value = patient.headache_trig_other || '';

    // Warning Signs (Neurological & Ocular)
    setChk('headache_rf_weakness_numb', patient.headache_rf_weakness_numb);
    setChk('headache_rf_facial_speech', patient.headache_rf_facial_speech);
    setChk('headache_rf_ataxia_walk', patient.headache_rf_ataxia_walk);
    setChk('headache_rf_seizure_syncope', patient.headache_rf_seizure_syncope);
    setChk('headache_rf_altered_mental', patient.headache_rf_altered_mental);
    setChk('headache_rf_fever', patient.headache_rf_fever !== undefined ? patient.headache_rf_fever : patient.headache_rf_fever_stiff_neck);
    setChk('headache_rf_stiff_neck', patient.headache_rf_stiff_neck !== undefined ? patient.headache_rf_stiff_neck : patient.headache_rf_fever_stiff_neck);
    setChk('headache_rf_acute_glaucoma', patient.headache_rf_acute_glaucoma);
    setChk('headache_rf_diplopia_field', patient.headache_rf_diplopia_field);
    setChk('headache_has_visual_aura', patient.headache_has_visual_aura);

    // General Associated & High-Risk Background
    setChk('headache_has_nausea_vomit', patient.headache_has_nausea_vomit);
    handleHeadacheVomitChange();
    if (patient.headache_has_nausea_vomit && patient.headacheVomitStatus) {
      setRadioValue('headacheVomitStatus', patient.headacheVomitStatus);
    }
    setChk('headache_has_autonomic', patient.headache_has_autonomic);

    setChk('headache_risk_recent_trauma', patient.headache_risk_recent_trauma);
    setChk('headache_risk_pregnancy_postpartum', patient.headache_risk_pregnancy_postpartum);
    setChk('headache_risk_cancer', patient.headache_risk_cancer);
    setChk('headache_risk_immunocompromised', patient.headache_risk_immunocompromised);
    setChk('headache_risk_anticoagulants', patient.headache_risk_anticoagulants);
    setChk('headache_risk_new_onset_age50', patient.headache_risk_new_onset_age50);
    setChk('headache_risk_med_overuse', patient.headache_risk_med_overuse);
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
      // ------------------ HEADACHE INTAKE ------------------
      const _rawDur = parseFloat(document.getElementById('headacheDurationVal')?.value); const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
      const durationUnit = document.getElementById('headacheDurationUnit')?.value || 'hours';
      const headacheOnsetMode = document.querySelector('input[name="headacheOnsetMode"]:checked')?.value || 'unspecified';
      const headachePainScore = headachePainScoreTouched ? parseInt(document.getElementById('headachePainScore')?.value || '0', 10) : null;

      // Locations
      const headacheLocs = [];
      if (document.getElementById('headache_loc_unilateral')?.checked) headacheLocs.push('unilateral');
      if (document.getElementById('headache_loc_periorbital')?.checked) headacheLocs.push('periorbital');
      if (document.getElementById('headache_loc_occipital')?.checked) headacheLocs.push('occipital');
      if (document.getElementById('headache_loc_band')?.checked) headacheLocs.push('band');
      if (document.getElementById('headache_loc_diffuse')?.checked) headacheLocs.push('diffuse');
      if (document.getElementById('headache_loc_facial_sinus')?.checked) headacheLocs.push('facial_sinus');
      const isLocOther = document.getElementById('headache_loc_other_chk')?.checked || false;
      const headacheLocOther = isLocOther ? (document.getElementById('headache_loc_other_text')?.value.trim() || '') : '';
      if (isLocOther && headacheLocOther) {
        headacheLocs.push(`อื่นๆ: ${headacheLocOther}`);
      }

      const headacheUnilateralSide = document.getElementById('headache_loc_unilateral')?.checked
        ? (document.querySelector('input[name="headacheUnilateralSide"]:checked')?.value || 'none')
        : 'none';
      const headachePeriorbitalSide = document.getElementById('headache_loc_periorbital')?.checked
        ? (document.querySelector('input[name="headachePeriorbitalSide"]:checked')?.value || 'none')
        : 'none';

      // Characteristics
      const headacheChars = [];
      if (document.getElementById('headache_char_throbbing')?.checked) headacheChars.push('throbbing');
      if (document.getElementById('headache_char_tight_dull')?.checked) headacheChars.push('tight_dull');
      if (document.getElementById('headache_char_sharp_stabbing')?.checked) headacheChars.push('sharp_stabbing');
      if (document.getElementById('headache_char_burning_electric')?.checked) headacheChars.push('burning_electric');
      if (document.getElementById('headache_char_boring_severe')?.checked) headacheChars.push('boring_severe');

      // Triggers
      const headache_trig_valsalva = document.getElementById('headache_trig_valsalva')?.checked || false;
      const headache_trig_supine_morning = document.getElementById('headache_trig_supine_morning')?.checked || false;
      const headache_trig_upright = document.getElementById('headache_trig_upright')?.checked || false;
      const headache_trig_jaw_claudication = document.getElementById('headache_trig_jaw_claudication')?.checked || false;
      const headache_trig_scalp_tenderness = document.getElementById('headache_trig_scalp_tenderness')?.checked || false;
      const headache_trig_light_sound = document.getElementById('headache_trig_light_sound')?.checked || false;
      const headache_trig_stress_fatigue = document.getElementById('headache_trig_stress_fatigue')?.checked || false;
      const isTrigOther = document.getElementById('headache_trig_other_chk')?.checked || false;
      const headache_trig_other = isTrigOther ? (document.getElementById('headache_trig_other_text')?.value.trim() || '') : '';

      // Warning Signs (Neurological & Ocular)
      const headache_rf_weakness_numb = document.getElementById('headache_rf_weakness_numb')?.checked || false;
      const headache_rf_facial_speech = document.getElementById('headache_rf_facial_speech')?.checked || false;
      const headache_rf_ataxia_walk = document.getElementById('headache_rf_ataxia_walk')?.checked || false;
      const headache_rf_seizure_syncope = document.getElementById('headache_rf_seizure_syncope')?.checked || false;
      const headache_rf_altered_mental = document.getElementById('headache_rf_altered_mental')?.checked || false;
      const headache_rf_fever = document.getElementById('headache_rf_fever')?.checked || false;
      const headache_rf_stiff_neck = document.getElementById('headache_rf_stiff_neck')?.checked || false;
      const headache_rf_fever_stiff_neck = headache_rf_fever && headache_rf_stiff_neck;
      const headache_rf_acute_glaucoma = document.getElementById('headache_rf_acute_glaucoma')?.checked || false;
      const headache_rf_diplopia_field = document.getElementById('headache_rf_diplopia_field')?.checked || false;
      const headache_has_visual_aura = document.getElementById('headache_has_visual_aura')?.checked || false;

      // General Associated & High-Risk Background
      const headache_has_nausea_vomit = document.getElementById('headache_has_nausea_vomit')?.checked || false;
      const headacheVomitStatus = headache_has_nausea_vomit
        ? (document.querySelector('input[name="headacheVomitStatus"]:checked')?.value || 'nausea_only')
        : 'none';
      const headache_has_autonomic = document.getElementById('headache_has_autonomic')?.checked || false;

      const headache_risk_recent_trauma = document.getElementById('headache_risk_recent_trauma')?.checked || false;
      const headache_risk_pregnancy_postpartum = document.getElementById('headache_risk_pregnancy_postpartum')?.checked || false;
      const headache_risk_cancer = document.getElementById('headache_risk_cancer')?.checked || false;
      const headache_risk_immunocompromised = document.getElementById('headache_risk_immunocompromised')?.checked || false;
      const headache_risk_anticoagulants = document.getElementById('headache_risk_anticoagulants')?.checked || false;
      const headache_risk_new_onset_age50 = document.getElementById('headache_risk_new_onset_age50')?.checked || false;
      const headache_risk_med_overuse = document.getElementById('headache_risk_med_overuse')?.checked || false;

      newPatient = {
        id: recordId,
        queue_number: queueNumber,
        hn: randomHn,
        name: patientName,
        age: patientAge,
        gender: gender,
        chief_complaint: 'headache',
        chief_complaint_title: 'ปวดศีรษะ',
        status: recordStatus,
        timestamp: new Date().toISOString(),
        durationVal,
        durationUnit,
        headacheOnsetMode,
        headachePainScore,
        headacheLocs,
        headacheUnilateralSide,
        headachePeriorbitalSide,
        headacheLocOther,
        headacheChars,
        headache_trig_valsalva,
        headache_trig_supine_morning,
        headache_trig_upright,
        headache_trig_jaw_claudication,
        headache_trig_scalp_tenderness,
        headache_trig_light_sound,
        headache_trig_stress_fatigue,
        headache_trig_other,
        headache_rf_weakness_numb,
        headache_rf_facial_speech,
        headache_rf_ataxia_walk,
        headache_rf_seizure_syncope,
        headache_rf_altered_mental,
        headache_rf_fever,
        headache_rf_stiff_neck,
        headache_rf_fever_stiff_neck,
        headache_rf_acute_glaucoma,
        headache_rf_diplopia_field,
        headache_has_visual_aura,
        headache_has_nausea_vomit,
        headacheVomitStatus,
        headache_has_autonomic,
        headache_risk_recent_trauma,
        headache_risk_pregnancy_postpartum,
        headache_risk_cancer,
        headache_risk_immunocompromised,
        headache_risk_anticoagulants,
        headache_risk_new_onset_age50,
        headache_risk_med_overuse,
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
      p.headacheOnsetMode === 'thunderclap' ||
      p.headacheOnsetMode === 'pattern_change' ||
      p.headacheChars?.includes('sharp_stabbing') ||
      p.headache_trig_valsalva ||
      p.headache_trig_supine_morning ||
      p.headache_trig_jaw_claudication ||
      p.headache_trig_scalp_tenderness ||
      p.headache_rf_weakness_numb ||
      p.headache_rf_facial_speech ||
      p.headache_rf_ataxia_walk ||
      p.headache_rf_seizure_syncope ||
      p.headache_rf_altered_mental ||
      p.headache_rf_fever ||
      p.headache_rf_stiff_neck ||
      p.headache_rf_fever_stiff_neck ||
      p.headache_rf_acute_glaucoma ||
      p.headache_rf_diplopia_field ||
      (p.headache_has_nausea_vomit && p.headacheVomitStatus === 'projectile') ||
      p.headache_risk_recent_trauma ||
      p.headache_risk_pregnancy_postpartum ||
      p.headache_risk_cancer ||
      p.headache_risk_immunocompromised ||
      p.headache_risk_anticoagulants ||
      p.headache_risk_new_onset_age50
    );
  },

  evaluateRedFlags(patient) {
    const redFlags = [];
    if (patient.headacheOnsetMode === 'thunderclap' || patient.headacheChars?.includes('sharp_stabbing')) {
      redFlags.push({
        key: 'thunderclap_sah_rcvs',
        textTh: 'ปวดรุนแรงทันทีทันใดเหมือนฟ้าผ่า (Thunderclap Headache / Peak within seconds to 2 mins)',
        risk: 'เสี่ยงภาวะเลือดออกใต้เยื่อหุ้มสมองจากหลอดเลือดโป่งพองแตก (Aneurysmal SAH) หรือ RCVS / Cervical Artery Dissection ต้องส่ง STAT Non-contrast CT Brain ทันที'
      });
    }
    if (patient.headache_rf_fever_stiff_neck || (patient.headache_rf_fever && patient.headache_rf_stiff_neck)) {
      redFlags.push({
        key: 'meningitis_encephalitis',
        textTh: 'มีไข้ร่วมกับคอแข็งเกร็ง ก้มคอไม่ลง (Fever with Nuchal Rigidity)',
        risk: 'เสี่ยงภาวะเยื่อหุ้มสมองอักเสบติดเชื้อเฉียบพลัน (Acute Bacterial/Viral Meningitis) ต้องให้ยาปฏิชีวนะทางหลอดเลือดดำและตรวจ Lumbar Puncture เร่งด่วน'
      });
    } else {
      if (patient.headache_rf_stiff_neck) {
        redFlags.push({
          key: 'nuchal_rigidity_meningismus',
          textTh: 'คอแข็งเกร็ง ก้มคอไม่ลง (Nuchal Rigidity / Meningismus)',
          risk: 'เสี่ยงภาวะระคายเคืองเยื่อหุ้มสมอง (Meningeal Irritation เช่น เลือดออกใต้เยื่อหุ้มสมอง SAH หรือระยะเริ่มต้นของการติดเชื้อ CNS) ต้องตรวจยืนยันเร่งด่วน'
        });
      }
      if (patient.headache_rf_fever) {
        redFlags.push({
          key: 'fever_with_headache',
          textTh: 'มีไข้สูง หรือหนาวสั่น ร่วมกับปวดศีรษะ (Systemic Fever with Headache)',
          risk: 'เสี่ยงต่อการติดเชื้อในระบบประสาทส่วนกลาง (CNS Infection) หรือภาวะติดเชื้อในกระแสเลือด (Sepsis)'
        });
      }
    }
    if (patient.headache_rf_weakness_numb || patient.headache_rf_facial_speech || patient.headache_rf_ataxia_walk || patient.headache_rf_seizure_syncope || patient.headache_rf_altered_mental) {
      redFlags.push({
        key: 'neurological_deficit_cns_event',
        textTh: 'มีอาการทางระบบประสาทเฉพาะที่ หรือระดับความรู้สึกตัวเปลี่ยนแปลง (Focal Deficit / Seizure / Altered Mental Status)',
        risk: 'เสี่ยงภาวะหลอดเลือดสมอง (Stroke / ICH), ภาวะความดันในกะโหลกศีรษะสูงวิกฤต หรือก้อนเนื้อในสมอง ต้องส่งเอกซเรย์คอมพิวเตอร์สมองด่วน'
      });
    }
    if (patient.headache_rf_acute_glaucoma || patient.headache_rf_diplopia_field) {
      redFlags.push({
        key: 'acute_glaucoma_visual_threat',
        textTh: 'ตาแดง ปวดเบ้าตารุนแรง ตามัวเฉียบพลัน หรือเห็นภาพซ้อน (Acute Angle-Closure Glaucoma / Optic Neuropathy)',
        risk: 'เสี่ยงภาวะต้อหินมุมปิดเฉียบพลัน ซึ่งทำให้สูญเสียการมองเห็นถาวรได้หากไม่ลดความดันลูกตาทันที หรือรอยโรคกดทับเส้นประสาทสมอง'
      });
    }
    if (patient.headacheVomitStatus === 'projectile' || patient.headache_trig_valsalva || patient.headache_trig_supine_morning) {
      redFlags.push({
        key: 'raised_intracranial_pressure',
        textTh: 'อาเจียนพุ่งรุนแรง หรือปวดมากขึ้นเมื่อไอ/จาม/เบ่ง/นอนราบ (Raised ICP / Mass Effect)',
        risk: 'เสี่ยงภาวะความดันในกะโหลกศีรษะสูงผิดปกติ (Intracranial Hypertension) หรือมีรอยโรคกินเนื้อที่ในสมอง (Brain Tumor / Hydrocephalus)'
      });
    }
    if (patient.headache_trig_jaw_claudication || patient.headache_trig_scalp_tenderness || (patient.age >= 50 && patient.headache_risk_new_onset_age50)) {
      redFlags.push({
        key: 'giant_cell_arteritis',
        textTh: 'ปวดเคี้ยวอาหาร เจ็บหนังศีรษะเวลาแตะ/หวีผม หรืออายุ ≥ 50 ปีเริ่มปวดแบบใหม่ (Suspected Giant Cell Arteritis)',
        risk: 'เสี่ยงภาวะหลอดเลือดแดงขมับอักเสบ (Temporal Arteritis) เสี่ยงต่อการสูญเสียการมองเห็นถาวร ต้องตรวจ ESR/CRP และเริ่มสเตียรอยด์ทันที'
      });
    }
    if (patient.headache_risk_recent_trauma || patient.headache_risk_pregnancy_postpartum || patient.headache_risk_cancer || patient.headache_risk_immunocompromised || patient.headache_risk_anticoagulants) {
      redFlags.push({
        key: 'high_risk_secondary_headache',
        textTh: 'ประวัติเสี่ยงสูง: อุบัติเหตุศีรษะ 1-3 เดือน / ทานยาต้านการแข็งตัวของเลือด / มะเร็ง / ภูมิคุ้มกันบกพร่อง / ตั้งครรภ์หรือหลังคลอด',
        risk: 'เสี่ยงภาวะเลือดออกใต้เยื่อหุ้มสมองเรื้อรัง (Subdural Hematoma), มะเร็งแพร่กระจายสู่สมอง, ฝีในสมอง หรือลิ่มเลือดดำสมอง (CVST)'
      });
    }
    if (patient.headacheOnsetMode === 'pattern_change') {
      redFlags.push({
        key: 'headache_pattern_change',
        textTh: 'รูปแบบหรือความรุนแรงของอาการปวดเปลี่ยนไปจากเดิมอย่างชัดเจน (New or Changed Headache Pattern)',
        risk: 'ต้องระวังภาวะแทรกซ้อนทางโครงสร้างสมองใหม่ที่ซ่อนอยู่ (Secondary Headache)'
      });
    }
    return redFlags;
  },

  updateOutputs(patient) {
    updateHeadacheOutputs(patient);
  },

  generateCds(patient, ctx) {
    const { rfs, ddxList, workupList, managementList } = ctx;
    if (rfs.some(r => r.key === 'thunderclap_sah_rcvs')) {
      ddxList.push('1. Aneurysmal Subarachnoid Hemorrhage (SAH) 🚩 (Rule out first!)');
      ddxList.push('2. Reversible Cerebral Vasoconstriction Syndrome (RCVS) / Cervical Artery Dissection');
      ddxList.push('3. Cerebral Venous Sinus Thrombosis (CVST) / Pituitary Apoplexy');
      workupList.push('• STAT Non-contrast CT Brain ภายใน 6 ชม. (Ottawa SAH Rule)');
      workupList.push('• หาก CT Brain ปกติแต่สงสัยสูง: พิจารณา Lumbar Puncture (LP) ตรวจ RBC count และ Xanthochromia (แนะนำทำหลังเริ่มปวด 6-12 ชม.) หรือ CTA Brain & Neck');
      workupList.push('• CBC, Coagulation profile (PT/INR, PTT), Electrolytes, BUN/Cr, EKG');
      managementList.push('• 🛑 เปิดเส้น IV, งดน้ำและอาหาร (NPO), จัดให้นอนพักในห้องมืดและเงียบสงบ');
      managementList.push('• ควบคุมความดันโลหิตอย่างเคร่งครัด (เป้าหมาย SBP < 140 mmHg ด้วย IV Nicardipine/Labetalol)');
      managementList.push('• พิจารณา Nimodipine 60 mg ทางปาก/NG ทุก 4 ชม. เพื่อป้องกัน Cerebral Vasospasm');
      managementList.push('• ปรึกษาประสาทศัลยแพทย์ (Neurosurgery) STAT เพื่อประเมิน Definitive Intervention (Aneurysm Coiling / Clipping)');
    } else if (rfs.some(r => r.key === 'meningitis_encephalitis' || r.key === 'nuchal_rigidity_meningismus' || r.key === 'fever_with_headache')) {
      ddxList.push('1. Acute Bacterial Meningitis (S. pneumoniae, N. meningitidis) 🚩');
      ddxList.push('2. Viral Meningoencephalitis (HSV-1, Enterovirus) 🚩');
      ddxList.push('3. Cryptococcal / TB Meningitis (โดยเฉพาะหากมีภาวะภูมิคุ้มกันบกพร่อง)');
      workupList.push('• Hemoculture x 2 bottles ทันที, CBC, Electrolytes, BUN/Cr, Coagulation studies');
      workupList.push('• CT Brain ก่อนทำ LP หากมี Focal neurological deficit, New onset seizure, Papilledema หรือ Altered consciousness');
      workupList.push('• Lumbar Puncture (CSF analysis: Cell count with diff, Protein, Glucose vs Blood sugar, Gram stain, Culture, PCR panel)');
      managementList.push('• 🛑 ให้ Empirical Antibiotics ทันทีภายใน 1 ชม. โดยไม่ต้องรอผล LP หากต้องส่งตรวจ CT ก่อน: Ceftriaxone 2 g IV q 12h + Vancomycin 15-20 mg/kg IV q 8-12h');
      managementList.push('• ให้ Dexamethasone 10 mg IV ก่อนหรือพร้อมกับยาปฏิชีวนะเข็มแรก (เพื่อลดภาวะแทรกซ้อนทางหูและระบบประสาทใน Pneumococcal meningitis)');
      managementList.push('• พิจารณา IV Acyclovir 10 mg/kg q 8h หากสงสัย HSV encephalitis');
    } else if (rfs.some(r => r.key === 'acute_glaucoma_visual_threat')) {
      ddxList.push('1. Acute Angle-Closure Glaucoma 🚩 (Visual-threatening emergency!)');
      ddxList.push('2. Optic Neuritis / Anterior Ischemic Optic Neuropathy');
      ddxList.push('3. Cavernous Sinus Thrombosis / Orbital Cellulitis');
      workupList.push('• ตรวจวัดความดันลูกตาฉุกเฉิน (Tonometry / Intraocular Pressure measurement) - ค่าปกติ 10-21 mmHg');
      workupList.push('• Slit-lamp examination, Visual acuity, Pupil reactivity (Mid-dilated, non-reactive pupil)');
      workupList.push('• ปรึกษาจักษุแพทย์ (Ophthalmology) เร่งด่วน');
      managementList.push('• 🛑 ยาลดความดันลูกตาแบบผสมผสาน: Timolol 0.5% eye drops 1 drop, Brimonidine 0.15-0.2% 1 drop');
      managementList.push('• พิจารณา IV Mannitol (1-2 g/kg IV over 30-45 mins) หรือ Acetazolamide 500 mg IV/oral หากความดันลูกตาสูงมาก');
      managementList.push('• หลีกเลี่ยงยาขยายม่านตา (Mydriatics) และยา Anticholinergic เด็ดขาด');
    } else if (rfs.some(r => r.key === 'giant_cell_arteritis')) {
      ddxList.push('1. Giant Cell Arteritis (Temporal Arteritis) 🚩 (เสี่ยงสูญเสียการมองเห็นถาวร)');
      ddxList.push('2. Trigeminal Neuralgia');
      ddxList.push('3. Temporomandibular Joint (TMJ) Dysfunction');
      workupList.push('• ESR (มักสูงเด่น > 50-100 mm/h) และ CRP');
      workupList.push('• CBC (อาจพบ Normocytic anemia, Thrombocytosis)');
      workupList.push('• ปรึกษาอายุรแพทย์/จักษุแพทย์เพื่อทำ Temporal Artery Biopsy (TAB)');
      managementList.push('• 🛑 ให้ Systemic Corticosteroids ขนาดสูงทันทีโดยไม่ต้องรอผล Biopsy: Prednisolone 40-60 mg/day oral (หรือ IV Methylprednisolone 500-1000 mg/day นาน 3 วันหากมี Visual loss นำ)');
      managementList.push('• ให้ยาร่วมป้องกันกระเพาะอาหาร (PPI) และติดตามอาการทางสายตาอย่างใกล้ชิด');
    } else if (rfs.some(r => r.key === 'raised_intracranial_pressure' || r.key === 'neurological_deficit_cns_event' || r.key === 'high_risk_secondary_headache')) {
      ddxList.push('1. Intracranial Space-Occupying Lesion (Brain Tumor / Brain Abscess / Subdural Hematoma 🚩)');
      ddxList.push('2. Acute Stroke (Ischemic Stroke / Intracerebral Hemorrhage 🚩)');
      ddxList.push('3. Cerebral Venous Sinus Thrombosis (CVST) / Idiopathic Intracranial Hypertension');
      workupList.push('• Urgent Non-contrast CT Brain หรือ MRI Brain with/without contrast');
      workupList.push('• Fundoscopy ตรวจหา Papilledema (หากทำได้)');
      workupList.push('• CBC, Coagulation studies, Electrolytes, Renal function');
      managementList.push('• จัดท่านอนศีรษะสูง 30 องศา (Elevate head of bed 30°), แนวคอตรง ไม่พับ');
      managementList.push('• ควบคุมการหายใจและการให้ออกซิเจน หลีกเลี่ยง Hypercapnia หรือ Hypoxia');
      managementList.push('• พิจารณา Osmotherapy (Mannitol 20% หรือ 3% Hypertonic Saline) หากมีสัญญาณ Transtentorial herniation');
      managementList.push('• ปรึกษาประสาทศัลยแพทย์ (Neurosurgery) หรืออายุรแพทย์ระบบประสาท');
    } else {
      // Primary Headache (Migraine, Tension, Cluster, etc.)
      const isMigraineLike = patient.headacheChars?.some(c => c.includes('throbbing')) || patient.headacheLocs?.includes('unilateral') || patient.headache_has_visual_aura || patient.headache_has_aura;
      const isTensionLike = patient.headacheChars?.some(c => c.includes('tight') || c.includes('dull'));
      const isClusterLike = patient.headacheLocs?.includes('periorbital') && (patient.headache_eye_autonomic || patient.headache_has_autonomic);

      if (isClusterLike) {
        ddxList.push('1. Cluster Headache (Trigeminal Autonomic Cephalgia)');
        ddxList.push('2. Paroxysmal Hemicrania');
        ddxList.push('3. Secondary TAC (Aneurysm / Pituitary lesion)');
        workupList.push('• ประเมิน Cranial autonomic symptoms (น้ำตาไหล, ตาแดง, คัดจมูกข้างเดียวกับที่ปวด)');
        workupList.push('• พิจารณา Neuroimaging (MRI Brain) หากเป็นครั้งแรกเพื่อแยก Secondary headache');
        managementList.push('• การรักษาเฉียบพลันอันดับแรก: High-flow Oxygen therapy (100% O2 ผ่าน Non-rebreather mask 12-15 L/min นาน 15 นาที)');
        managementList.push('• ยาจำเพาะ: Subcutaneous / Intranasal Sumatriptan (หากไม่มีโรคหลอดเลือดหัวใจ)');
        managementList.push('• ยาป้องกันระยะยาว: Verapamil, Corticosteroids taper (ปรึกษาแพทย์ระบบประสาท)');
      } else if (isMigraineLike) {
        ddxList.push('1. Migraine with/without Typical Aura');
        ddxList.push('2. Tension-type Headache');
        ddxList.push('3. Medication-Overuse Headache (MOH)');
        workupList.push('• Complete Neurological Examination เพื่อยืนยันว่าไม่มี Focal Neurological Deficits');
        workupList.push('• ทบทวนประวัติการใช้ยาแก้ปวด (Analgesic frequency ต่อเดือน)');
        managementList.push('• จัดให้นอนพักในห้องที่มืดและเงียบ (Dark and quiet environment), IV Rehydration หากดื่มน้ำไม่ได้');
        managementList.push('• ให้ยาแก้อาเจียนและกระตุ้นการดูดซึมยา: Metoclopramide 10 mg IV หรือ Ondansetron 4-8 mg IV');
        managementList.push('• ยาแก้ปวดจำเพาะ: NSAIDs (เช่น Ibuprofen 400-600 mg, Naproxen, Ketorolac 30 mg IV) หรือ Triptans (เช่น Sumatriptan) หากเริ่มปวดและไม่มีข้อห้ามโรคหลอดเลือด');
        managementList.push('• หลีกเลี่ยงการใช้ยากลุ่ม Opioids เพื่อป้องกันการเกิดภาวะเรื้อรังและ Medication overuse');
      } else if (isTensionLike) {
        ddxList.push('1. Tension-Type Headache (TTH)');
        ddxList.push('2. Cervicogenic Headache / Myofascial Pain Syndrome');
        ddxList.push('3. Eye Strain / Refractive Error');
        workupList.push('• ตรวจกล้ามเนื้อต้นคอ บ่า สะบัก (Pericranial tenderness) และข้อต่อขากรรไกร');
        workupList.push('• ตรวจสายตาและการทำงานของกล้ามเนื้อลูกตาเบื้องต้น');
        managementList.push('• ยาแก้ปวดเบื้องต้น: Paracetamol 1000 mg หรือ NSAIDs (Ibuprofen / Naproxen) ทานหลังอาหารทันที');
        managementList.push('• ปรับเปลี่ยนพฤติกรรม: พักผ่อนให้เพียงพอ, ประคบอุ่นบริเวณกล้ามเนื้อต้นคอ, ผ่อนคลายความเครียด');
        managementList.push('• แนะนำไม่ควรใช้ยาแก้ปวดเกิน 2-3 วันต่อสัปดาห์เพื่อป้องกัน Medication-Overuse Headache');
      } else {
        ddxList.push('1. Acute Primary Headache (Migraine vs Tension-Type Headache)');
        ddxList.push('2. Headache secondary to Systemic Infection / Sinusitis / Dehydration');
        ddxList.push('3. Medication-Overuse Headache / Caffeine Withdrawal');
        workupList.push('• Complete Physical & Neurological Examination, Vital Signs, Fundoscopy');
        workupList.push('• ตรวจโพรงไซนัส (Sinus tenderness) และ Otoscopy');
        managementList.push('• บรรเทาอาการตามอาการ (Symptomatic treatment) ด้วยยาแก้ปวดที่ไม่ใช่สเตียรอยด์และพักผ่อน');
        managementList.push('• ให้คำแนะนำสัญญาณเตือน (Red Flags) เช่น มีไข้คอแข็ง ปวดฉับพลันเหมือนฟ้าผ่า หรือมีแขนขาอ่อนแรง ที่ต้องรีบกลับมา รพ. ทันที');
      }
    }
  }
});
