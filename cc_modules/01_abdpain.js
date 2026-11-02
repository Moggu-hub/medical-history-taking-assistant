// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 01_abdpain.js
// อาการนำ: ปวดท้อง (Abdominal pain)
// ไฟล์นี้แยกอิสระสำหรับอาการนำ abdpain เพื่อให้ทีมแพทย์และ IT โรงพยาบาลนำไปพัฒนาต่อได้โดยไม่กระทบระบบหลัก
// =========================================================================

let abdpainPainScoreTouched = false;

function clearAbdpainPainScore() {
  abdpainPainScoreTouched = false;
  const slider = document.getElementById('abdpainPainScore');
  if (slider) slider.value = 0;
  const emojiEl = document.getElementById('abdpainPainScoreEmoji');
  const textEl = document.getElementById('abdpainPainScoreText');
  const badgeEl = document.getElementById('abdpainPainScoreBadge');
  const clearBtn = document.getElementById('abdpainPainScoreClearBtn');
  if (emojiEl) emojiEl.textContent = '⚪';
  if (textEl) textEl.textContent = 'ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)';
  if (badgeEl) badgeEl.className = 'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all';
  if (clearBtn) clearBtn.classList.add('hidden');
}

function handleAbdpainPainScoreChange(val) {
  abdpainPainScoreTouched = true;
  const num = parseInt(val, 10);
  const emojiEl = document.getElementById('abdpainPainScoreEmoji');
  const textEl = document.getElementById('abdpainPainScoreText');
  const badgeEl = document.getElementById('abdpainPainScoreBadge');
  const clearBtn = document.getElementById('abdpainPainScoreClearBtn');
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

function setAbdpainPainScore(score) {
  abdpainPainScoreTouched = true;
  const slider = document.getElementById('abdpainPainScore');
  if (slider) {
    slider.value = score;
    handleAbdpainPainScoreChange(score);
  }
}

function handleAbdpainLocationChange() {
  const selectedLocs = Array.from(document.querySelectorAll('input[name="abdpain_loc"]:checked')).map(cb => cb.value);
  toggleBranch('abdpain_branch_rlq', selectedLocs.includes('rlq'));
  toggleBranch('abdpain_branch_epigastric_ruq', selectedLocs.includes('epigastrium') || selectedLocs.includes('ruq'));
  toggleBranch('abdpain_branch_suprapubic', selectedLocs.includes('suprapubic'));
  handlePatientTitleChange();
}

function handleAbdpainRadiationChange() {
  const checkedVals = Array.from(document.querySelectorAll('input[name="abdpain_rad"]:checked')).map(cb => cb.value);
  const hasFlankOrGroin = checkedVals.includes('back_left') || checkedVals.includes('back_right') || checkedVals.includes('groin_thigh_genitalia');
  toggleBranch('abdpain_branch_flank_groin', hasFlankOrGroin);
}

function handleAbdpainVomitToggle(status) {
  const wrap = document.getElementById('abdpain_vomit_detail_wrap');
  if (!wrap) return;
  if (status === 'vomiting') {
    wrap.classList.remove('hidden');
  } else {
    wrap.classList.add('hidden');
    const freq = document.getElementById('abdpainVomitFreq');
    if (freq) freq.value = '';
    document.querySelectorAll('input[name="abdpain_vomit_content"]').forEach(cb => cb.checked = false);
  }
}

function handleAbdpainStoolToggle(status) {
  const wrap = document.getElementById('abdpain_diarrhea_freq_wrap');
  if (!wrap) return;
  if (status === 'diarrhea') {
    wrap.classList.remove('hidden');
  } else {
    wrap.classList.add('hidden');
    const freq = document.getElementById('abdpainDiarrheaFreq');
    if (freq) freq.value = '';
  }
}

function handleAbdpainLmpToggle(status) {
  const dateWrap = document.getElementById('abdpain_lmp_date_wrap');
  const approxWrap = document.getElementById('abdpain_lmp_approx_wrap');
  
  if (status === 'exact_date') {
    if (dateWrap) dateWrap.classList.remove('hidden');
    if (approxWrap) approxWrap.classList.add('hidden');
    document.querySelectorAll('input[name="abdpain_lmp_approx"]').forEach(r => r.checked = false);
  } else if (status === 'approx') {
    if (approxWrap) approxWrap.classList.remove('hidden');
    if (dateWrap) dateWrap.classList.add('hidden');
    const dateInput = document.getElementById('abdpainLmpDate');
    if (dateInput) dateInput.value = '';
  } else {
    if (dateWrap) dateWrap.classList.add('hidden');
    if (approxWrap) approxWrap.classList.add('hidden');
    const dateInput = document.getElementById('abdpainLmpDate');
    if (dateInput) dateInput.value = '';
    document.querySelectorAll('input[name="abdpain_lmp_approx"]').forEach(r => r.checked = false);
  }
}

    function updateAbdominalPainOutputs(patient) {
      const unitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
      const durationText = patient.durationVal ? `${patient.durationVal} ${unitMap[patient.durationUnit] || 'ชั่วโมง'}` : 'ไม่ระบุ';

      const onsetMap = {
        sudden_severe: 'ปวดรุนแรงทันทีทันใดในไม่กี่วินาที (Sudden onset)',
        gradual_worsening: 'ค่อยๆ ปวดมากขึ้นเรื่อยๆ (Gradual worsening)',
        intermittent_cramps: 'ปวดเป็นพักๆ บิดๆ แล้วคลาย (Colicky/Intermittent)',
        unspecified: 'ไม่ได้ระบุรูปแบบการเริ่มปวด'
      };

      const charMap = {
        sharp_stabbing: 'แหลมคมเหมือนถูกแทง/เสียบแทง',
        burning: 'แสบร้อน/ร้อนท้อง',
        crampy_colic: 'บิดเกร็งเป็นระลอก (Colicky)',
        dull_aching: 'ตื้อๆ แน่นๆ หน่วงๆ',
        throbbing: 'ตุบๆ ตามจังหวะชีพจร'
      };

      const locMap = {
        epigastrium: 'ใต้ลิ้นปี่',
        ruq: 'ชายโครงขวา (RUQ)',
        luq: 'ชายโครงซ้าย (LUQ)',
        periumbilical: 'รอบสะดือ',
        rlq: 'ท้องน้อยขวา (RLQ)',
        llq: 'ท้องน้อยซ้าย (LLQ)',
        suprapubic: 'ท้องน้อยตรงกลาง/เหนือหัวหน่าว',
        diffuse: 'ทั่วทั้งท้อง'
      };

      const radMap = {
        back_right: 'ร้าวไปหลังขวา/สะบักขวา',
        back_left: 'ร้าวไปหลังซ้าย',
        back_mid: 'ร้าวทะลุหลังตรงกลาง',
        groin_thigh_genitalia: 'ร้าวลงขาหนีบ/ต้นขา/อวัยวะเพศ',
        chest_neck: 'ร้าวขึ้นเหนือลิ้นปี่/คอ',
        none: 'ไม่มีอาการปวดร้าว'
      };

      const factorMap = {
        fatty_food_worse: 'ปวดมากขึ้นหลังทานอาหารมัน/มื้อใหญ่',
        empty_stomach_worse: 'ปวดมากขึ้นช่วงท้องว่าง/หิวจัด',
        food_relieves: 'ทานอาหารแล้วทุเลาลง',
        antacid_relief: 'ทานยาลดกรดแล้วทุเลาลง',
        forward_bend_relief: 'ก้มตัวโน้มไปข้างหน้าแล้วทุเลาลง',
        jarring_movement: 'เดิน/ขยับตัว/ไอ/นั่งรถสะเทือนแล้วเจ็บสะท้านท้อง'
      };

      const positives = [];
      const negatives = [];

      // 1. Pain Profile
      const charsStr = (patient.abdpainChars && patient.abdpainChars.length > 0)
        ? patient.abdpainChars.map(c => charMap[c] || c).join(', ')
        : 'ไม่ระบุลักษณะ';
      const locsStr = (patient.abdpainLocs && patient.abdpainLocs.length > 0)
        ? patient.abdpainLocs.map(l => locMap[l] || l).join(', ')
        : 'ไม่ระบุตำแหน่งชัดเจน';
      const radsStr = (patient.abdpainRads && patient.abdpainRads.length > 0)
        ? patient.abdpainRads.map(r => radMap[r] || r).join(', ')
        : 'ไม่พบอาการปวดร้าว';
      const factorsStr = (patient.abdpainFactors && patient.abdpainFactors.length > 0)
        ? patient.abdpainFactors.map(f => factorMap[f] || f).join(', ')
        : '';

      const painScoreText = (patient.abdpainPainScore !== undefined && patient.abdpainPainScore !== null) ? `${patient.abdpainPainScore}/10` : 'ไม่ได้ระบุ';

      // 2. GI & Associated (Strict De-duplication: Primary OPQRST descriptors are stated in HPI above, do not repeat in positives)
      if (patient.abdpain_anorexia === 'loss_appetite') {
        positives.push('เบื่ออาหารชัดเจน รับประทานอาหารไม่ได้');
      } else {
        negatives.push('รับประทานอาหารได้ปกติ');
      }

      if (patient.abdpain_vomit_status === 'vomiting') {
        const vMap = {
          food_gastric: 'เศษอาหาร/น้ำย่อยกระเพาะ',
          bilious_green: 'สีเขียวน้ำดี (Bilious)',
          coffee_ground_blood: 'สีกาแฟ/มีเลือดปน (Coffee-ground / Hematemesis)'
        };
        const vContents = patient.abdpain_vomit_contents?.map(c => vMap[c] || c).join(', ') || 'ไม่ระบุ';
        positives.push(`มีอาเจียน ${patient.abdpainVomitFreq || 1} ครั้ง (${vContents})`);
      } else if (patient.abdpain_vomit_status === 'nausea_only') {
        positives.push('มีอาการคลื่นไส้ แต่ยังไม่อาเจียน');
      } else {
        negatives.push('ปฏิเสธคลื่นไส้อาเจียน');
      }

      if (patient.abdpain_stool_status === 'diarrhea') {
        positives.push(`ถ่ายเหลว/ท้องเสีย ${patient.abdpainDiarrheaFreq || 1} ครั้ง/วัน`);
      } else if (patient.abdpain_stool_status === 'melena_bloody') {
        positives.push('ถ่ายอุจจาระสีดำเหนียวคล้ายยางมะตอย หรือมีเลือดปน (Melena / Hematochezia)');
      } else if (patient.abdpain_stool_status === 'constipation_no_gas') {
        positives.push('ท้องผูก ท้องอืดตึงมาก ไม่ถ่ายและไม่ผายลม (Obstipation)');
      } else {
        negatives.push('การขับถ่ายอุจจาระปกติ');
      }

      if (patient.abdpain_jaundice) {
        positives.push('มีตาเหลือง ตัวเหลือง หรือปัสสาวะสีน้ำชาเข้ม (Jaundice)');
      } else {
        negatives.push('ไม่มีภาวะตาเหลืองตัวเหลือง');
      }

      // 3. Anatomical Branch Specific Findings
      // RLQ / Appendix
      if (patient.abdpainLocs?.includes('rlq') || patient.abdpain_rlq_migration || patient.abdpain_rlq_jarring) {
        if (patient.abdpain_rlq_migration) positives.push('มี Pain Migration: เริ่มปวดรอบสะดือหรือลิ้นปี่ แล้วย้ายมาปวดที่ท้องน้อยขวา');
        else negatives.push('ไม่มีประวัติปวดย้ายที่ (No pain migration)');

        if (patient.abdpain_rlq_jarring) positives.push('Jarring sign positive: เดิน/กระแทกส้นเท้า/ไอแล้วเจ็บสะเทือนท้องน้อยขวา');
        else negatives.push('ไม่มีอาการเจ็บสะท้านท้องน้อยขวาเมื่อกระแทกส้นเท้า');
      }

      // Epigastric / RUQ
      if (patient.abdpainLocs?.includes('epigastrium') || patient.abdpainLocs?.includes('ruq') || patient.abdpain_epi_fatty_meal || patient.abdpain_epi_gallstone_alcohol) {
        if (patient.abdpain_epi_fatty_meal) positives.push('ปวดจุกแน่นบิดเกร็งรุนแรงหลังรับประทานอาหารมื้อใหญ่หรือของมัน (Biliary colic pattern)');
        if (patient.abdpain_epi_gallstone_alcohol) positives.push('มีประวัตินิ่วในถุงน้ำดี หรือ ดื่มสุราเป็นประจำ');
      }

      // Flank / Groin
      const hasFlankRad = patient.abdpainRads?.includes('back_left') || patient.abdpainRads?.includes('back_right') || patient.abdpainRads?.includes('groin_thigh_genitalia');
      if (hasFlankRad || patient.abdpain_flank_restless || patient.abdpain_flank_hematuria) {
        if (patient.abdpain_flank_restless) positives.push('ปวดบิดบั้นเอวรุนแรงจนกระสับกระส่าย ทนนอนนิ่งไม่ได้ (Renal colic behavior)');
        else negatives.push('ไม่มีอาการปวดบิดบั้นเอวกระสับกระส่าย');

        if (patient.abdpain_flank_hematuria) positives.push('ปัสสาวะมีสีแดง/สีน้ำล้างเนื้อ/มีเลือดปน (Gross hematuria)');
        else negatives.push('ปัสสาวะไม่มีเลือดปน');
      }

      // Suprapubic
      if (patient.abdpainLocs?.includes('suprapubic') || patient.abdpain_supra_dysuria) {
        if (patient.abdpain_supra_dysuria) positives.push('ปัสสาวะแสบขัดปลาย กะปริบกะปรอย กลั้นปัสสาวะไม่อยู่ (Dysuria/Frequency/Urgency)');
        else negatives.push('ไม่มีปัสสาวะแสบขัด');
      }

      // Female Gyn
      if (patient.gender === 'หญิง' || patient.abdpain_lmp_status !== 'unspecified' || patient.abdpain_gyn_bleeding) {
        let lmpText = 'ไม่ได้ระบุ';
        if (patient.abdpain_lmp_status === 'exact_date') {
          lmpText = `วันที่ ${formatDateDdMmYyyy(patient.abdpainLmpDate) || 'ไม่ระบุวัน'}`;
        } else if (patient.abdpain_lmp_status === 'approx') {
          const approxMap = {
            '1_week_ago': 'ประมาณ 1 สัปดาห์ก่อน',
            '2_weeks_ago': 'ประมาณ 2 สัปดาห์ก่อน',
            '3_4_weeks_ago': 'ประมาณ 3-4 สัปดาห์ก่อน',
            '1_2_months_ago': 'ประมาณ 1-2 เดือนก่อน',
            'gt_2_months_ago': 'มากกว่า 2 เดือนก่อน'
          };
          lmpText = approxMap[patient.abdpain_lmp_approx] || 'จำวันที่ไม่ได้แน่ชัด (โดยประมาณ)';
        } else if (patient.abdpain_lmp_status === 'missed_period') {
          lmpText = 'ขาดประจำเดือน / สงสัยตั้งครรภ์';
        } else if (patient.abdpain_lmp_status === 'pregnant') {
          lmpText = 'กำลังตั้งครรภ์';
        } else if (patient.abdpain_lmp_status === 'premenarche') {
          lmpText = 'วัยก่อนมีประจำเดือน (ยังไม่เคยมีประจำเดือน)';
        } else if (patient.abdpain_lmp_status === 'menopause') {
          lmpText = 'วัยหมดประจำเดือน (Menopause) หรือผ่าตัดมดลูกแล้ว';
        }
        positives.push(`ประวัติประจำเดือนล่าสุด (LMP): ${lmpText}`);
        if (patient.abdpain_gyn_bleeding) positives.push('มีเลือดออกกะปริบกะปรอยทางช่องคลอดผิดปกติ');
        else negatives.push('ไม่มีเลือดออกทางช่องคลอดผิดปกติ');

        if (patient.abdpain_gyn_discharge) positives.push('มีตกขาวผิดปกติ/มีกลิ่นเหม็น/คัน');
      }

      // 4. Surgical & Medication Risk
      if (patient.abdpain_surgery_status === 'yes') {
        positives.push(`มีประวัติเคยผ่าตัดช่องท้อง: ${patient.abdpainSurgeryDetail || 'ไม่ระบุการผ่าตัด'}`);
      } else {
        negatives.push('ปฏิเสธประวัติเคยผ่าตัดช่องท้อง');
      }

      const riskMeds = [];
      if (patient.abdpain_med_nsaids) riskMeds.push('ยาแก้ปวดกลุ่ม NSAIDs/ยาชุด/ยาแก้ปวดข้อ');
      if (patient.abdpain_med_steroids) riskMeds.push('ยาสเตียรอยด์/ยาลูกกลอน');
      if (patient.abdpain_med_anticoagulants) riskMeds.push('ยาละลายลิ่มเลือด/ยาต้านเกล็ดเลือด');
      if (riskMeds.length > 0) {
        positives.push(`ประวัติการใช้ยาความเสี่ยงสูง: ${riskMeds.join(', ')}`);
      }

      const alcMap = {
        daily_heavy: 'ดื่มเป็นประจำทุกวัน (ปริมาณมาก)',
        regular_heavy: 'ดื่มเป็นประจำสัปดาห์ละหลายครั้ง',
        social: 'ดื่มนานๆ ครั้งตามงานสังคม',
        none: 'ไม่ดื่มแอลกอฮอล์'
      };
      if (patient.abdpain_alcohol && patient.abdpain_alcohol !== 'none') {
        positives.push(`ประวัติดื่มแอลกอฮอล์: ${alcMap[patient.abdpain_alcohol] || patient.abdpain_alcohol}`);
      }

      if (patient.otherSymptomsFree) {
        positives.push(`อาการเพิ่มเติมที่ผู้ป่วยระบุ: "${patient.otherSymptomsFree}"`);
      }

      patient.pertinentPositives = positives;
      patient.pertinentNegatives = negatives;

      const hospLabel = {
        complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
        additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
        self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
        unspecified: 'ไม่ได้ระบุ'
      }[patient.hospRecordStatus] || 'ไม่ได้ระบุ';

      const docNotes = patient.doctor_notes || {};
      const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ' || patient.currentMeds === 'ไม่มี') ? 'ไม่มี' : patient.currentMeds;

      const rapidPositives = positives.filter(p => 
        !p.startsWith('มีประวัติเคยผ่าตัด') && 
        !p.startsWith('ประวัติการใช้ยาความเสี่ยงสูง') && 
        !p.startsWith('ประวัติดื่มแอลกอฮอล์') &&
        !p.startsWith('Jarring sign positive')
      );
      const rapidNegatives = negatives.filter(n =>
        !n.startsWith('ปฏิเสธประวัติเคยผ่าตัด')
      );

      // A) Rapid Bullet Format for Abdominal Pain
      const defaultRapid = 
`[Chief Complaint (CC)]
ปวดท้อง (Abdominal pain) มา ${durationText}

[History of Present Illness (HPI)]
• การเริ่มต้นและระยะเวลา: ปวดมา ${durationText}, ลักษณะการเริ่ม: ${onsetMap[patient.abdpainOnsetMode] || 'ไม่ได้ระบุ'}
• ลักษณะอาการปวด: ${charsStr}
• ตำแหน่งปวด: ${locsStr}
• อาการปวดร้าว: ${radsStr}
• ระดับความปวด (Pain Score): ${painScoreText}
• ปัจจัยกระตุ้น/บรรเทา: ${factorsStr || 'ไม่มี'}

• Pertinent Positives:
${rapidPositives.length > 0 ? rapidPositives.map(p => `  - ${p}`).join('\n') : '  - ไม่มีอาการร่วมอื่นที่เด่นชัด'}

• Pertinent Negatives:
${rapidNegatives.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• โรคประจำตัว (U/D): ${patient.underlying?.length > 0 ? patient.underlying.join(', ') : 'ปฏิเสธ'}
• ประวัติผ่าตัดช่องท้อง: ${patient.abdpain_surgery_status === 'yes' ? (patient.abdpainSurgeryDetail || 'มีประวัติผ่าตัด') : 'ปฏิเสธ'}
• ยาประจำตัว (Current Meds): ${medsText}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${patient.drugAllergy || 'ปฏิเสธ'}
• ประวัติยาความเสี่ยง (NSAIDs/Steroids/Anticoagulants): ${riskMeds.length > 0 ? riskMeds.join(', ') : 'ไม่มี'}
• ประวัติดื่มสุรา: ${alcMap[patient.abdpain_alcohol] || 'ไม่ดื่ม'}

[Emergency Risk Assessment (Red Flags)]
${patient.redFlags?.length > 0
  ? `🚩 RED FLAGS DETECTED:\n${patient.redFlags.map(rf => `  * ${rf.textTh}`).join('\n')}`
  : '✓ ไม่พบสัญญาณวิกฤต (No Immediate Red Flag)'}

[Doctor's Clinical Addendum & Exam]
• ประวัติเพิ่มเติม/แก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}
• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}
• แผนการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

      // B) Narrative Paragraph Format for Abdominal Pain
      const defaultNarrative = 
`ผู้ป่วย [${patient.name}] อายุ ${patient.age || '-'} ปี เพศ ${patient.gender || 'ไม่ระบุ'} มารับการตรวจที่ห้องฉุกเฉิน รพ.ราชบุรี ด้วยอาการปวดท้องมา ${durationText}
การเริ่มปวด: ${onsetMap[patient.abdpainOnsetMode] || 'ไม่ระบุ'} ตำแหน่งปวดชัดเจนที่สุด: ${locsStr} ลักษณะปวด: ${charsStr} ระดับความเจ็บปวด (Pain Score): ${painScoreText} ${patient.abdpainRads?.length > 0 && !patient.abdpainRads.includes('none') ? `มีอาการปวดร้าวไปที่ ${radsStr}` : 'ไม่มีอาการปวดร้าว'} ${factorsStr ? `โดยมีปัจจัยร่วมคือ ${factorsStr}` : ''}

อาการร่วมและการซักประวัติตามระบบ: ผู้ป่วยให้ประวัติ ${positives.join(', ')}
อาการสำคัญที่ปฏิเสธ (Pertinent negatives): ${negatives.join(', ')}

ประวัติการเจ็บป่วยในอดีต: [${hospLabel}] ประวัติผ่าตัดช่องท้อง: ${patient.abdpain_surgery_status === 'yes' ? (patient.abdpainSurgeryDetail || 'มี') : 'ปฏิเสธ'}, โรคประจำตัว: ${patient.underlying?.length > 0 ? patient.underlying.join(', ') : 'ปฏิเสธโรคประจำตัว'}, ยาประจำตัว: ${medsText}, ประวัติแพ้ยา/แพ้อาหาร: ${patient.drugAllergy || 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร'}, ประวัติยาความเสี่ยง: ${riskMeds.length > 0 ? riskMeds.join(', ') : 'ไม่มี'}
${patient.redFlags?.length > 0 ? `\n[🚩 แจ้งเตือนสัญญาณวิกฤต (Red Flags)]: ตรวจพบอาการ ${patient.redFlags.map(rf => rf.textTh).join(', ')}` : ''}

[บันทึกการตรวจและการประเมินโดยแพทย์]:
${docNotes.additional_hpi ? `• ประวัติเพิ่มเติม: ${docNotes.additional_hpi}\n` : ''}${docNotes.physical_exam ? `• การตรวจร่างกาย: ${docNotes.physical_exam}\n` : ''}${docNotes.preliminary_dx ? `• การวินิจฉัย: ${docNotes.preliminary_dx}\n` : ''}${docNotes.plan ? `• แผนการรักษา: ${docNotes.plan}` : ''}`;

      document.getElementById('rapidTextView').value = patient.custom_rapid_note || defaultRapid;
      document.getElementById('narrativeTextView').value = patient.custom_narrative_note || defaultNarrative;

      // JSON Payload for Abdominal Pain
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
        "chief_complaint": "abdominal_pain",
        "abdominal_pain_profile": {
          "duration_value": patient.durationVal || null,
          "duration_unit": patient.durationUnit || null,
          "pain_score": (patient.abdpainPainScore !== undefined && patient.abdpainPainScore !== null) ? patient.abdpainPainScore : null,
          "onset_mode": patient.abdpainOnsetMode || null,
          "pain_characteristics": patient.abdpainChars || [],
          "pain_locations": patient.abdpainLocs || [],
          "pain_radiation": patient.abdpainRads || [],
          "aggravating_and_relieving_factors": patient.abdpainFactors || []
        },
        "associated_gi_symptoms": {
          "anorexia": patient.abdpain_anorexia || null,
          "nausea_vomiting": {
            "status": patient.abdpain_vomit_status || 'none',
            "vomit_frequency_per_day": patient.abdpainVomitFreq || 0,
            "contents": patient.abdpain_vomit_contents || []
          },
          "bowel_habits": {
            "status": patient.abdpain_stool_status || 'normal',
            "diarrhea_frequency_per_day": patient.abdpainDiarrheaFreq || 0
          },
          "jaundice": Boolean(patient.abdpain_jaundice)
        },
        "focused_anatomical_evaluations": {
          "rlq_appendicitis_signs": {
            "pain_migration_periumbilical_to_rlq": Boolean(patient.abdpain_rlq_migration),
            "jarring_pain_positive": Boolean(patient.abdpain_rlq_jarring)
          },
          "epigastric_ruq_hepatobiliary": {
            "post_fatty_meal_colic": Boolean(patient.abdpain_epi_fatty_meal),
            "hx_gallstone_or_alcohol": Boolean(patient.abdpain_epi_gallstone_alcohol)
          },
          "flank_groin_urological": {
            "restless_renal_colic": Boolean(patient.abdpain_flank_restless),
            "gross_hematuria": Boolean(patient.abdpain_flank_hematuria)
          },
          "suprapubic_urinary": {
            "dysuria_frequency_urgency": Boolean(patient.abdpain_supra_dysuria)
          },
          "female_reproductive_gyn": {
            "lmp_status": patient.abdpain_lmp_status || null,
            "lmp_approx": patient.abdpain_lmp_approx || null,
            "lmp_date": formatDateDdMmYyyy(patient.abdpainLmpDate) || null,
            "abnormal_vaginal_bleeding": Boolean(patient.abdpain_gyn_bleeding),
            "abnormal_vaginal_discharge": Boolean(patient.abdpain_gyn_discharge)
          }
        },
        "surgical_and_medication_risks": {
          "prior_abdominal_surgery": {
            "has_surgery": patient.abdpain_surgery_status === 'yes',
            "detail": patient.abdpainSurgeryDetail || ""
          },
          "high_risk_medications": {
            "nsaids": Boolean(patient.abdpain_med_nsaids),
            "steroids": Boolean(patient.abdpain_med_steroids),
            "anticoagulants": Boolean(patient.abdpain_med_anticoagulants)
          },
          "alcohol_use": patient.abdpain_alcohol || "none",
          "other_symptoms_free_text": patient.otherSymptomsFree || ""
        },
        "red_flags_detected": patient.redFlags?.map(rf => ({ code: rf.key, label: rf.textTh, clinical_risk: rf.risk })) || [],
        "pertinent_positives": positives,
        "pertinent_negatives": negatives,
        "patient_background": {
          "hospital_record_status": patient.hospRecordStatus,
          "underlying_diseases": patient.underlying || [],
          "drug_and_food_allergies": patient.drugAllergy || "",
          "current_medications": patient.currentMeds || ""
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
    // OUTPUT GENERATION: ไข้ / หนาวสั่น (Fever & Chills)

registerCcModule({
  id: 'abdpain',
  recordCc: 'abdominal_pain',
  titleTh: 'ปวดท้อง',
  titleEn: 'Abdominal pain',
  sectionDomId: 'abdpainQuestionnaireSection',
  doctorCcBadgeHtml: "<i data-lucide=\"utensils\" class=\"w-3 h-3 mr-1\"></i> CC: ปวดท้อง (Abdominal pain)",
  formHtml: "        <div id=\"abdpainQuestionnaireSection\" class=\"hidden space-y-6\">\n\n          <!-- CARD 1: OPQRST of Abdominal Pain -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"clock\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-900\">1. ระยะเวลาและลักษณะของอาการปวดท้อง (Pain Profile)</h2>\n                <p class=\"text-xs text-slate-500\">ข้อมูลเริ่มต้นเกี่ยวกับอาการปวดท้องของท่าน</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-5\">\n              <!-- 1.1 Onset & Duration: ข้อ 2 รูปแบบตรงกันทุก CC -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">\n                  ปวดท้องมานานเท่าไรแล้ว? <span class=\"text-rose-500\">*</span>\n                </label>\n                <div class=\"grid grid-cols-2 sm:grid-cols-3 gap-3\">\n                  <div class=\"col-span-1 sm:col-span-2\">\n                    <input type=\"number\" id=\"abdpainDurationVal\" min=\"1\" max=\"1000\"\n                      class=\"w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm placeholder:text-slate-400 placeholder:font-normal\"\n                      placeholder=\"เช่น 4\">\n                  </div>\n                  <div class=\"col-span-1\">\n                    <select id=\"abdpainDurationUnit\"\n                      class=\"w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm\">\n                      <option value=\"minutes\">นาที</option>\n                      <option value=\"hours\" selected>ชั่วโมง</option>\n                      <option value=\"days\">วัน</option>\n                      <option value=\"weeks\">สัปดาห์</option>\n                      <option value=\"months\">เดือน</option>\n                      <option value=\"years\">ปี</option>\n                    </select>\n                  </div>\n                </div>\n              </div>\n\n              <!-- 1.2 Mode of Onset -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">\n                  ลักษณะการเริ่มต้นของอาการปวด\n                </label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2.5\">\n                  <label class=\"selectable-card relative flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"abdpainOnsetMode\" value=\"sudden_severe\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">ปวดรุนแรงทันทีทันใด</span>\n                      <span class=\"text-[11px] text-slate-500\">ปวดขึ้นมาฉับพลันเหมือนฟ้าผ่า เสียบแทงรุนแรงทันที</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card relative flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"abdpainOnsetMode\" value=\"gradual_worsening\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">ค่อยๆ ปวดเพิ่มขึ้นเรื่อยๆ</span>\n                      <span class=\"text-[11px] text-slate-500\">เริ่มจากปวดตื้อๆ แล้วค่อยๆ รุนแรงขึ้นต่อเนื่องในไม่กี่ชั่วโมง</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card relative flex items-start p-3 rounded-xl cursor-pointer\">\n                    <input type=\"radio\" name=\"abdpainOnsetMode\" value=\"intermittent_chronic\" class=\"mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"text-xs sm:text-sm font-semibold block text-slate-800\">เป็นๆ หายๆ</span>\n                      <!-- ข้อ 5: แก้ข้อความอธิบาย -->\n                      <span class=\"text-[11px] text-slate-500\">มีอาการเป็นพักๆ มีช่วงเว้นหายปวดหรือบรรเทาลงเป็นครั้งคราว</span>\n                    </div>\n                  </label>\n                </div>\n              </div>\n\n              <!-- 1.3 Pain Quality / Characteristics -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">\n                  ลักษณะอาการปวด (เลือกได้หลายข้อ)\n                </label>\n                <div class=\"grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs\">\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpain_char\" value=\"colicky\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-semibold text-slate-800\">บิดเกร็ง เป็นพักๆ</span>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpain_char\" value=\"burning\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-semibold text-slate-800\">แสบร้อน จุกแน่น</span>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpain_char\" value=\"dull\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-semibold text-slate-800\">ตื้อๆ แน่นๆ ถ่วงๆ</span>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpain_char\" value=\"sharp_stabbing\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-semibold text-slate-800\">เสียบแทง / ฉีกขาด</span>\n                  </label>\n                </div>\n              </div>\n\n              <!-- 1.4 Pain Locations: ข้อ 3 ตำแหน่งที่ปวดชัดเจนที่สุด 8 ตำแหน่ง -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1\">\n                  ตำแหน่งที่ปวดชัดเจนที่สุดในขณะนี้ (เลือกได้หลายจุด) <span class=\"text-rose-500\">*</span>\n                </label>\n                <p class=\"text-[11px] text-slate-500 mb-2\">ระบบจะเปิดคำถามเจาะลึกเฉพาะจุดให้ท่านโดยอัตโนมัติ</p>\n                <div class=\"grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs\">\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpain_loc\" value=\"diffuse\" onchange=\"handleAbdpainLocationChange()\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-semibold text-slate-800\">ทั่วทั้งท้อง</span>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpain_loc\" value=\"epigastrium\" onchange=\"handleAbdpainLocationChange()\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-semibold text-slate-800\">ใต้ลิ้นปี่</span>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpain_loc\" value=\"ruq\" onchange=\"handleAbdpainLocationChange()\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-semibold text-slate-800\">ชายโครงขวา (RUQ)</span>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpain_loc\" value=\"luq\" onchange=\"handleAbdpainLocationChange()\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-semibold text-slate-800\">ชายโครงซ้าย (LUQ)</span>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpain_loc\" value=\"periumbilical\" onchange=\"handleAbdpainLocationChange()\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-semibold text-slate-800\">รอบสะดือ</span>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpain_loc\" value=\"rlq\" onchange=\"handleAbdpainLocationChange()\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-semibold text-slate-800\">ท้องน้อยขวา (RLQ)</span>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpain_loc\" value=\"llq\" onchange=\"handleAbdpainLocationChange()\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-semibold text-slate-800\">ท้องน้อยซ้าย (LLQ)</span>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpain_loc\" value=\"suprapubic\" onchange=\"handleAbdpainLocationChange()\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-semibold text-slate-800\">ท้องน้อยตรงกลาง/หัวหน่าว</span>\n                  </label>\n                  <!-- ข้อ 6: ตำแหน่งอื่นๆ (ระบุ) พร้อมช่องกรอกข้อความที่จะเปิดออกเมื่อเลือก -->\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer col-span-2 sm:col-span-4\">\n                    <input type=\"checkbox\" id=\"abdpain_loc_other_chk\" onchange=\"toggleOtherInput('abdpain_loc_other_wrap', this.checked)\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-700\">ตำแหน่งอื่นๆ (ระบุ)</span>\n                  </label>\n                </div>\n                <!-- กล่องข้อความเจาะลึกเฉพาะเมื่อเลือก (ข้อ 4 & 6) -->\n                <div id=\"abdpain_loc_other_wrap\" class=\"hidden mt-2\">\n                  <input type=\"text\" id=\"abdpain_loc_other_text\" placeholder=\"ระบุตำแหน่งปวดท้องเพิ่มเติม...\" class=\"w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white\">\n                </div>\n              </div>\n\n              <!-- 1.5 Radiation of Pain -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">\n                  มีอาการปวดร้าวไปตำแหน่งอื่นหรือไม่? (เลือกได้หลายข้อ)\n                </label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpain_rad\" value=\"none\" onchange=\"handleAbdpainRadiationChange()\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-700\">ไม่ร้าวไปตำแหน่งอื่น (ปวดเฉพาะที่)</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpain_rad\" value=\"back_mid\" onchange=\"handleAbdpainRadiationChange()\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-semibold text-slate-800\">ร้าวทะลุหลังตรงกลาง</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpain_rad\" value=\"back_right\" onchange=\"handleAbdpainRadiationChange()\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-semibold text-slate-800\">ร้าวไปหลังขวา หรือ สะบักขวา</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpain_rad\" value=\"back_left\" onchange=\"handleAbdpainRadiationChange()\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-semibold text-slate-800\">ร้าวไปหลังซ้าย</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpain_rad\" value=\"groin_thigh_genitalia\" onchange=\"handleAbdpainRadiationChange()\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-semibold text-slate-800\">ร้าวลงต้นขา / ขาหนีบ / อวัยวะเพศ</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpain_rad\" value=\"chest\" onchange=\"handleAbdpainRadiationChange()\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-semibold text-slate-800\">ร้าวขึ้นหน้าอก</span>\n                  </label>\n                  <!-- ข้อ 6: ร้าวไปตำแหน่งอื่น (ระบุ) พร้อมช่องกรอกข้อความที่จะเปิดออกเมื่อเลือก -->\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer sm:col-span-2\">\n                    <input type=\"checkbox\" id=\"abdpain_rad_other_chk\" onchange=\"toggleOtherInput('abdpain_rad_other_wrap', this.checked)\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-700\">ร้าวไปตำแหน่งอื่น (ระบุ)</span>\n                  </label>\n                </div>\n                <!-- กล่องข้อความเจาะลึกเฉพาะเมื่อเลือก (ข้อ 4 & 6) -->\n                <div id=\"abdpain_rad_other_wrap\" class=\"hidden mt-2\">\n                  <input type=\"text\" id=\"abdpain_rad_other_text\" placeholder=\"ระบุตำแหน่งที่ร้าวไปเพิ่มเติม...\" class=\"w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white\">\n                </div>\n              </div>\n\n              <!-- 1.6 Provoking & Palliating Factors -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">\n                  สิ่งที่ทำให้อาการปวดมากขึ้น หรือ บรรเทาลง (เลือกได้หลายข้อ)\n                </label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpain_factor\" value=\"jarring_movement\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-semibold text-slate-800\">ขยับตัว ไอ หรือเดินสะเทือนแล้วเจ็บสะท้านท้อง</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpain_factor\" value=\"lean_forward_relief\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-700\">นั่งก้มตัวไปข้างหน้า หรือ นอนงอเข่าคุดคู้แล้วทุเลาลง</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpain_factor\" value=\"postprandial_worse\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-700\">ปวดมากขึ้นหลังรับประทานอาหาร</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpain_factor\" value=\"empty_stomach_worse\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-700\">ปวดมากขึ้นตอนท้องว่าง หรือ ก่อนอาหาร</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpain_factor\" value=\"antacid_relief\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-700\">ทานยาลดกรดหรือดื่มนมแล้วดีขึ้น</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpain_factor\" value=\"defecation_relief\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-700\">ถ่ายอุจจาระหรือผายลมแล้วทุเลาลง</span>\n                  </label>\n                </div>\n              </div>\n\n              <!-- 1.7 Pain Score Scale (0-10) with Emoji Faces (มาตรฐานเดียวกับทุก CC ที่เกี่ยวกับอาการปวด) -->\n              <div class=\"bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3\">\n                <div class=\"flex flex-col sm:flex-row sm:items-center justify-between gap-2\">\n                  <label class=\"block text-xs font-semibold text-slate-800 uppercase tracking-wider\">\n                    1.7 ระดับความเจ็บปวดในขณะนี้ (Pain Score: 0 - 10)\n                  </label>\n                  <div class=\"flex items-center space-x-2\">\n                    <span id=\"abdpainPainScoreBadge\" class=\"inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all\">\n                      <span id=\"abdpainPainScoreEmoji\" class=\"text-base\">⚪</span>\n                      <span id=\"abdpainPainScoreText\">ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)</span>\n                    </span>\n                    <button type=\"button\" id=\"abdpainPainScoreClearBtn\" onclick=\"clearAbdpainPainScore()\" class=\"text-xs text-slate-400 hover:text-rose-600 underline hidden transition\" title=\"ล้างค่าเพื่อให้เป็นไม่ได้ระบุ\">ล้างค่า</button>\n                  </div>\n                </div>\n\n                <!-- Range Slider -->\n                <div class=\"px-1 pt-1\">\n                  <input type=\"range\" id=\"abdpainPainScore\" min=\"0\" max=\"10\" value=\"0\" step=\"1\"\n                    oninput=\"handleAbdpainPainScoreChange(this.value)\"\n                    class=\"w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-600 focus:outline-none focus:ring-2 focus:ring-medical-500\">\n                </div>\n\n                <!-- Visual Emoji Scale Guide -->\n                <div class=\"grid grid-cols-5 text-center text-[10px] sm:text-[11px] pt-1 gap-1 text-slate-500 font-medium\">\n                  <div class=\"cursor-pointer hover:text-medical-600 transition\" onclick=\"setAbdpainPainScore(0)\">\n                    <span class=\"text-lg sm:text-xl block\">😊</span>\n                    <span>0: สบายดี</span>\n                  </div>\n                  <div class=\"cursor-pointer hover:text-medical-600 transition\" onclick=\"setAbdpainPainScore(2)\">\n                    <span class=\"text-lg sm:text-xl block\">🙂</span>\n                    <span>1-3: เล็กน้อย</span>\n                  </div>\n                  <div class=\"cursor-pointer hover:text-medical-600 transition\" onclick=\"setAbdpainPainScore(5)\">\n                    <span class=\"text-lg sm:text-xl block\">😐</span>\n                    <span>4-6: ปานกลาง</span>\n                  </div>\n                  <div class=\"cursor-pointer hover:text-medical-600 transition\" onclick=\"setAbdpainPainScore(8)\">\n                    <span class=\"text-lg sm:text-xl block\">😣</span>\n                    <span>7-9: ปวดมาก</span>\n                  </div>\n                  <div class=\"cursor-pointer hover:text-medical-600 transition\" onclick=\"setAbdpainPainScore(10)\">\n                    <span class=\"text-lg sm:text-xl block\">😭</span>\n                    <span>10: ปวดรุนแรงที่สุด</span>\n                  </div>\n                </div>\n              </div>\n\n            </div>\n          </div>\n\n\n          <!-- CARD 2: อาการผิดปกติสำคัญที่อาจพบร่วมด้วย (ข้อ 3: ปรับให้รูปแบบตัวอักษรและกล่องเป็นกลาง ป้องกัน bias) -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"activity\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-900\">2. อาการผิดปกติสำคัญที่อาจพบร่วมด้วย</h2>\n                <p class=\"text-xs text-slate-500\">กรุณาเลือกหากท่านมีอาการดังต่อไปนี้ เพื่อให้แพทย์ประเมินความเร่งด่วนได้อย่างแม่นยำ</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-2 text-xs\">\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer border-slate-200\">\n                <input type=\"checkbox\" id=\"abdpain_rf_syncope\" class=\"mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block text-xs sm:text-sm\">หน้ามืด วูบ เป็นลม หรือหมดสติร่วมด้วย (Syncope)</span>\n                  <span class=\"text-[11px] text-slate-500\">รู้สึกจะเป็นลม ลุกนั่งแล้วหน้ามืด ตัวเบาหวิว ความดันตก</span>\n                </div>\n              </label>\n\n              <!-- ข้อ 1: ถ่ายดำ / ถ่ายปนเลือด (แยกเฉพาะ) -->\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer border-slate-200\">\n                <input type=\"checkbox\" id=\"abdpain_rf_melena\" class=\"mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block text-xs sm:text-sm\">ถ่ายดำ หรือ ถ่ายปนเลือดสด (Melena / Hematochezia)</span>\n                  <span class=\"text-[11px] text-slate-500\">อุจจาระเป็นสีดำสนิทเหนียวเหมือนยางมะตอย หรือมีเลือดสด/ลิ่มเลือดปน</span>\n                </div>\n              </label>\n\n              <!-- ข้อ 1: อาเจียนดำ / อาเจียนปนเลือด (แยกเฉพาะ) -->\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer border-slate-200\">\n                <input type=\"checkbox\" id=\"abdpain_rf_hematemesis\" class=\"mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block text-xs sm:text-sm\">อาเจียนดำ หรือ อาเจียนปนเลือดสด (Coffee-ground / Hematemesis)</span>\n                  <span class=\"text-[11px] text-slate-500\">อาเจียนเป็นเลือดสด มีลิ่มเลือด หรืออาเจียนเป็นตะกอนสีดำคล้ายสีกาแฟ/โค้ก</span>\n                </div>\n              </label>\n\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer border-slate-200\">\n                <input type=\"checkbox\" id=\"abdpain_rf_obstruction\" class=\"mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block text-xs sm:text-sm\">ท้องอืดตึงมาก ไม่ถ่ายอุจจาระและไม่ผายลมเลย (Complete Bowel Obstruction)</span>\n                  <span class=\"text-[11px] text-slate-500\">ท้องบวมป่อง อึดอัดแน่น คลื่นไส้อาเจียน และไม่ผายลมเลย</span>\n                </div>\n              </label>\n\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer border-slate-200\">\n                <input type=\"checkbox\" id=\"abdpain_rf_shock\" class=\"mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block text-xs sm:text-sm\">ปวดท้องรุนแรงเฉียบพลันร่วมกับเหงื่อแตกท่วม ตัวเย็น ซีดลงชัดเจน</span>\n                  <span class=\"text-[11px] text-slate-500\">เหงื่อออกมือเท้า ตัวซีดเผือด หายใจเร็ว หัวใจเต้นเร็วมาก</span>\n                </div>\n              </label>\n\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer border-slate-200\">\n                <input type=\"checkbox\" id=\"abdpain_rf_fever\" class=\"mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block text-xs sm:text-sm\">มีไข้สูง หนาวสั่นสะท้านร่วมกับปวดท้อง (High fever with chills)</span>\n                  <span class=\"text-[11px] text-slate-500\">ตัวร้อนจัด สั่นสะท้าน คลื่นไส้ ปวดเกร็งช่องท้อง</span>\n                </div>\n              </label>\n            </div>\n          </div>\n\n\n          <!-- CARD 3: อาการร่วมทางเดินอาหาร (Associated Symptoms) -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"utensils\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-900\">3. อาการร่วมทางเดินอาหาร (Associated Symptoms)</h2>\n                <p class=\"text-xs text-slate-500\">อาการทางระบบทางเดินอาหารและการขับถ่ายที่สัมพันธ์กับอาการปวดท้อง</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4\">\n              <!-- 3.1 ความอยากอาหาร -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">ความอยากอาหาร</label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"abdpain_anorexia\" value=\"loss_appetite\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-semibold text-slate-800\">เบื่ออาหาร ไม่อยากทานอะไรเลย (Anorexia)</span>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"abdpain_anorexia\" value=\"normal\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-700\">ยังรับประทานอาหารได้ตามปกติ</span>\n                  </label>\n                </div>\n              </div>\n\n              <!-- 3.2 อาการคลื่นไส้ / อาเจียน -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">อาการคลื่นไส้ / อาเจียน</label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs mb-2\">\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"abdpain_vomit_status\" value=\"none\" onchange=\"handleAbdpainVomitToggle('none')\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-700\">ไม่มีคลื่นไส้อาเจียน</span>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"abdpain_vomit_status\" value=\"nausea_only\" onchange=\"handleAbdpainVomitToggle('nausea_only')\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-700\">คลื่นไส้อย่างเดียว ยังไม่อาเจียน</span>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"abdpain_vomit_status\" value=\"vomiting\" onchange=\"handleAbdpainVomitToggle('vomiting')\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-semibold text-slate-800\">มีอาการอาเจียน</span>\n                  </label>\n                </div>\n\n                <!-- กล่องเจาะลึกเฉพาะเมื่อมีอาการอาเจียน (ข้อ 4) -->\n                <div id=\"abdpain_vomit_detail_wrap\" class=\"hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3\">\n                  <div class=\"flex items-center space-x-2\">\n                    <label class=\"text-xs font-semibold text-slate-700\">อาเจียนประมาณกี่ครั้งต่อวัน?</label>\n                    <input type=\"number\" id=\"abdpainVomitFreq\" min=\"1\" max=\"50\" placeholder=\"เช่น 3\" class=\"w-20 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-semibold\">\n                    <span class=\"text-xs text-slate-500\">ครั้ง/วัน</span>\n                  </div>\n                  <div>\n                    <label class=\"text-xs font-semibold text-slate-700 block mb-1.5\">ลักษณะสิ่งที่อาเจียนออกมา (เลือกได้หลายข้อ)</label>\n                    <div class=\"grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs\">\n                      <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer\">\n                        <input type=\"checkbox\" name=\"abdpain_vomit_content\" value=\"food_gastric\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                        <span class=\"ml-1.5 font-medium text-slate-700\">เศษอาหาร / น้ำย่อยเหลือง</span>\n                      </label>\n                      <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer\">\n                        <input type=\"checkbox\" name=\"abdpain_vomit_content\" value=\"bilious\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                        <span class=\"ml-1.5 font-medium text-slate-700\">น้ำดีสีเขียว</span>\n                      </label>\n                      <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer\">\n                        <input type=\"checkbox\" name=\"abdpain_vomit_content\" value=\"coffee_ground_blood\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                        <span class=\"ml-1.5 font-semibold text-slate-800\">ดำสีกาแฟ หรือ มีเลือดปน</span>\n                      </label>\n                      <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer\">\n                        <input type=\"checkbox\" name=\"abdpain_vomit_content\" value=\"feculent\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                        <span class=\"ml-1.5 font-medium text-slate-700\">กลิ่นเหม็นคล้ายอุจจาระ</span>\n                      </label>\n                    </div>\n                  </div>\n                </div>\n              </div>\n\n              <!-- 3.3 การขับถ่ายอุจจาระ -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">การขับถ่ายอุจจาระในปัจจุบัน</label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-2\">\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"abdpain_stool_status\" value=\"normal\" onchange=\"handleAbdpainStoolToggle('normal')\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-700\">ถ่ายอุจจาระได้ปกติทุกวัน</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"abdpain_stool_status\" value=\"diarrhea\" onchange=\"handleAbdpainStoolToggle('diarrhea')\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-semibold text-slate-800\">ถ่ายเหลว หรือ ถ่ายเป็นน้ำ</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"abdpain_stool_status\" value=\"constipation\" onchange=\"handleAbdpainStoolToggle('constipation')\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-700\">ท้องผูก ไม่ถ่ายมาหลายวัน</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"abdpain_stool_status\" value=\"melena_bloody\" onchange=\"handleAbdpainStoolToggle('melena_bloody')\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-semibold text-slate-800\">ถ่ายดำ หรือ ถ่ายปนเลือด (Melena/Blood)</span>\n                  </label>\n                </div>\n                <!-- กล่องเจาะลึกเฉพาะเมื่อถ่ายเหลว (ข้อ 4) -->\n                <div id=\"abdpain_diarrhea_freq_wrap\" class=\"hidden bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center space-x-2\">\n                  <label class=\"text-xs font-semibold text-slate-700\">ถ่ายเหลวประมาณกี่ครั้งต่อวัน?</label>\n                  <input type=\"number\" id=\"abdpainDiarrheaFreq\" min=\"1\" max=\"50\" placeholder=\"เช่น 4\" class=\"w-20 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-semibold\">\n                  <span class=\"text-xs text-slate-500\">ครั้ง/วัน</span>\n                </div>\n              </div>\n\n              <!-- 3.4 ตาเหลือง ตัวเหลือง ปัสสาวะสีน้ำชา -->\n              <div class=\"pt-2\">\n                <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                  <input type=\"checkbox\" id=\"abdpain_jaundice\" class=\"rounded text-medical-600 h-4 w-4\">\n                  <span class=\"ml-2 text-xs sm:text-sm font-semibold text-slate-800\">สังเกตเห็นตาเหลือง ตัวเหลือง หรือ ปัสสาวะสีชาเข้มผิดปกติ (Jaundice)</span>\n                </label>\n              </div>\n\n            </div>\n          </div>\n\n\n          <!-- CARD 4: คำถามเจาะลึกเฉพาะจุดที่ปวด (Dynamic Anatomical Branching) -->\n          <div id=\"abdpainBranchesContainer\" class=\"space-y-4\">\n\n            <!-- กิ่งที่ 1: RLQ (ไส้ติ่งอักเสบ) - ข้อ 4 & ข้อ 7: แก้คำผิดและรูปแบบกล่อง -->\n            <div id=\"abdpain_branch_rlq\" class=\"hidden bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3\">\n              <div class=\"flex items-center space-x-2 pb-2 border-b border-slate-200\">\n                <i data-lucide=\"crosshair\" class=\"w-4 h-4 text-medical-600\"></i>\n                <h3 class=\"text-xs sm:text-sm font-bold text-slate-900\">คำถามเจาะลึก: อาการปวดท้องน้อยด้านขวา (RLQ)</h3>\n              </div>\n              <div class=\"space-y-2.5 text-xs\">\n                <!-- ข้อ 7: แก้คำผิด <มีการปวดย้ายที่ เริ่มปวดรอบสะดือหรือลิ้นปี่ แล้วย้ายมาปวดที่ท้องน้อยขวาใช่หรือไม่?> -->\n                <label class=\"selectable-card bg-white p-3 rounded-xl flex items-start cursor-pointer border-slate-200\">\n                  <input type=\"checkbox\" id=\"abdpain_rlq_migration\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block text-xs sm:text-sm\">มีการปวดย้ายที่ เริ่มปวดรอบสะดือหรือลิ้นปี่ แล้วย้ายมาปวดที่ท้องน้อยขวาใช่หรือไม่?</span>\n                    <span class=\"text-[11px] text-slate-500\">ตอนแรกเริ่มปวดตื้อๆ แถวรอบสะดือหรือใต้ลิ้นปี่ ต่อมาย้ายมาชัดเจนที่ท้องน้อยด้านขวา (Pain migration to RLQ)</span>\n                  </div>\n                </label>\n                <label class=\"selectable-card bg-white p-3 rounded-xl flex items-start cursor-pointer border-slate-200\">\n                  <input type=\"checkbox\" id=\"abdpain_rlq_jarring\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block text-xs sm:text-sm\">เวลาไอ จาม เดินลงส้นเท้า หรือนั่งรถตกหลุม มีอาการสะท้านเจ็บแปลบที่ท้องน้อยขวาหรือไม่?</span>\n                    <span class=\"text-[11px] text-slate-500\">ขยับตัวหรือเดินกระแทกส้นเท้าแล้วเจ็บเสียวสะท้านที่ขวาล่างชัดเจน (Jarring pain / Peritoneal sign)</span>\n                  </div>\n                </label>\n              </div>\n            </div>\n\n            <!-- กิ่งที่ 2: Epigastrium / RUQ (แผลกระเพาะ / นิ่วถุงน้ำดี / ตับอ่อน) -->\n            <div id=\"abdpain_branch_epigastric_ruq\" class=\"hidden bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3\">\n              <div class=\"flex items-center space-x-2 pb-2 border-b border-slate-200\">\n                <i data-lucide=\"activity\" class=\"w-4 h-4 text-medical-600\"></i>\n                <h3 class=\"text-xs sm:text-sm font-bold text-slate-900\">คำถามเจาะลึก: อาการปวดใต้ลิ้นปี่ หรือ ชายโครงขวา (Epigastrium / RUQ)</h3>\n              </div>\n              <div class=\"space-y-2.5 text-xs\">\n                <label class=\"selectable-card bg-white p-3 rounded-xl flex items-start cursor-pointer border-slate-200\">\n                  <input type=\"checkbox\" id=\"abdpain_epi_fatty_meal\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block text-xs sm:text-sm\">อาการปวดจุกแน่นเป็นมากขึ้นหลังรับประทานอาหารมื้อหนัก หรืออาหารที่มีไขมันสูงหรือไม่?</span>\n                    <span class=\"text-[11px] text-slate-500\">เช่น หลังทานของทอด ของมัน หมูกระทะ แล้วปวดแน่นชายโครงขวาหรือลิ้นปี่รุนแรง (Biliary colic)</span>\n                  </div>\n                </label>\n                <label class=\"selectable-card bg-white p-3 rounded-xl flex items-start cursor-pointer border-slate-200\">\n                  <input type=\"checkbox\" id=\"abdpain_epi_gallstone_alcohol\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block text-xs sm:text-sm\">มีประวัตินิ่วในถุงน้ำดี หรือ มีประวัติดื่มเครื่องดื่มแอลกอฮอล์หนักก่อนเริ่มปวดหรือไม่?</span>\n                    <span class=\"text-[11px] text-slate-500\">อาจสัมพันธ์กับภาวะถุงน้ำดีอักเสบเฉียบพลัน หรือ ตับอ่อนอักเสบเฉียบพลัน (Cholecystitis / Acute Pancreatitis)</span>\n                  </div>\n                </label>\n              </div>\n            </div>\n\n            <!-- กิ่งที่ 3: Radiation to Flank / Groin (นิ่วทางเดินปัสสาวะ) -->\n            <div id=\"abdpain_branch_flank_groin\" class=\"hidden bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3\">\n              <div class=\"flex items-center space-x-2 pb-2 border-b border-slate-200\">\n                <i data-lucide=\"shield\" class=\"w-4 h-4 text-medical-600\"></i>\n                <h3 class=\"text-xs sm:text-sm font-bold text-slate-900\">คำถามเจาะลึก: อาการปวดร้าวบั้นเอว หรือ ร้าวลงขาหนีบ/อวัยวะเพศ</h3>\n              </div>\n              <div class=\"space-y-2.5 text-xs\">\n                <label class=\"selectable-card bg-white p-3 rounded-xl flex items-start cursor-pointer border-slate-200\">\n                  <input type=\"checkbox\" id=\"abdpain_flank_restless\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block text-xs sm:text-sm\">ปวดบิดเกร็งรุนแรงจนทนอยู่นิ่งไม่ได้ ต้องบิดตัวไปมาตลอดเวลาใช่หรือไม่?</span>\n                    <span class=\"text-[11px] text-slate-500\">อาการปวดแบบ Colic มักทำให้กระสับกระส่าย เปลี่ยนท่าทางไปมา</span>\n                  </div>\n                </label>\n                <label class=\"selectable-card bg-white p-3 rounded-xl flex items-start cursor-pointer border-slate-200\">\n                  <input type=\"checkbox\" id=\"abdpain_flank_hematuria\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block text-xs sm:text-sm\">สังเกตเห็นปัสสาวะมีสีแดง น้ำล้างเนื้อ หรือมีเลือดปนหรือไม่?</span>\n                    <span class=\"text-[11px] text-slate-500\">ปัสสาวะมีเลือดปน (Gross hematuria) จากการระคายเคืองของทางเดินปัสสาวะ</span>\n                  </div>\n                </label>\n              </div>\n            </div>\n\n            <!-- กิ่งที่ 4: Suprapubic (กระเพาะปัสสาวะอักเสบ) -->\n            <div id=\"abdpain_branch_suprapubic\" class=\"hidden bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3\">\n              <div class=\"flex items-center space-x-2 pb-2 border-b border-slate-200\">\n                <i data-lucide=\"droplet\" class=\"w-4 h-4 text-medical-600\"></i>\n                <h3 class=\"text-xs sm:text-sm font-bold text-slate-900\">คำถามเจาะลึก: ปวดท้องน้อยส่วนล่าง / เหนือหัวหน่าว (Cystitis / UTI)</h3>\n              </div>\n              <div class=\"text-xs\">\n                <label class=\"selectable-card bg-white p-3 rounded-xl flex items-start cursor-pointer border-slate-200\">\n                  <input type=\"checkbox\" id=\"abdpain_supra_dysuria\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block text-xs sm:text-sm\">มีอาการปัสสาวะแสบขัด ปัสสาวะบ่อย กะปริดกะปรอย หรือปัสสาวะไม่สุดหรือไม่?</span>\n                    <span class=\"text-[11px] text-slate-500\">แสบปลายท่อปัสสาวะตอนสุด กลั้นปัสสาวะไม่อยู่ (Dysuria / Urgency)</span>\n                  </div>\n                </label>\n              </div>\n            </div>\n\n            <!-- กิ่งที่ 5: เฉพาะสตรีวัยเจริญพันธุ์ (Female Reproductive & LMP) - ข้อ 3, 4, 8 -->\n            <div id=\"abdpain_branch_female\" class=\"hidden bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4\">\n              <div class=\"flex items-center justify-between pb-2 border-b border-slate-200\">\n                <div class=\"flex items-center space-x-2\">\n                  <i data-lucide=\"heart-pulse\" class=\"w-4 h-4 text-medical-600\"></i>\n                  <h3 class=\"text-xs sm:text-sm font-bold text-slate-900\">ประวัติประจำเดือนและสุขภาพสตรี</h3>\n                </div>\n              </div>\n\n              <!-- ข้อ 5: อธิบายความหมายของ LMP ชัดเจน -->\n              <div class=\"bg-white border border-slate-200 rounded-xl p-3 text-xs space-y-1\">\n                <div class=\"font-bold flex items-center text-slate-800\">\n                  <i data-lucide=\"info\" class=\"w-3.5 h-3.5 mr-1 text-medical-600\"></i>\n                  <span>คำอธิบาย: ประจำเดือนครั้งสุดท้าย (Last Menstrual Period: LMP)</span>\n                </div>\n                <p class=\"text-[11px] text-slate-600 leading-relaxed\">\n                  LMP หมายถึง <strong>วันแรกที่เริ่มมีเลือดประจำเดือนรอบล่าสุดออกมา</strong> (ไม่ใช่ วันที่ประจำเดือนหมด)\n                </p>\n              </div>\n\n              <!-- ตัวเลือก LMP -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2\">\n                  วันแรกของประจำเดือนรอบล่าสุด (LMP) ของท่าน\n                </label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-2\">\n                  <label class=\"selectable-card bg-white p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"abdpain_lmp_status\" value=\"exact_date\" onchange=\"handleAbdpainLmpToggle('exact_date')\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800\">จำวันที่ได้แน่นอน (เลือกวันที่)</span>\n                  </label>\n                  <label class=\"selectable-card bg-white p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"abdpain_lmp_status\" value=\"approx\" onchange=\"handleAbdpainLmpToggle('approx')\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800\">จำวันที่ไม่ได้แน่ชัด (เลือกช่วงเวลาโดยประมาณ)</span>\n                  </label>\n                  <label class=\"selectable-card bg-white p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"abdpain_lmp_status\" value=\"missed_period\" onchange=\"handleAbdpainLmpToggle('missed_period')\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800\">ขาดประจำเดือน / สงสัยตั้งครรภ์</span>\n                  </label>\n                  <label class=\"selectable-card bg-white p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"abdpain_lmp_status\" value=\"pregnant\" onchange=\"handleAbdpainLmpToggle('pregnant')\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800\">กำลังตั้งครรภ์อยู่ในปัจจุบัน</span>\n                  </label>\n                  <label class=\"selectable-card bg-white p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"abdpain_lmp_status\" value=\"premenarche\" onchange=\"handleAbdpainLmpToggle('premenarche')\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800\">วัยก่อนมีประจำเดือน (ยังไม่เคยมีประจำเดือน)</span>\n                  </label>\n                  <label class=\"selectable-card bg-white p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"abdpain_lmp_status\" value=\"menopause\" onchange=\"handleAbdpainLmpToggle('menopause')\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800\">วัยหมดประจำเดือน (Menopause) หรือ ผ่าตัดมดลูกแล้ว</span>\n                  </label>\n                </div>\n\n                <!-- ช่องเลือกวันที่ LMP (เปิดเฉพาะเมื่อเลือก exact_date) -->\n                <div id=\"abdpain_lmp_date_wrap\" class=\"hidden bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2\">\n                  <label class=\"text-xs font-semibold text-slate-700\">ระบุวันแรกของประจำเดือนรอบล่าสุด: <span class=\"text-[10px] text-slate-500 font-normal\">(วว/ดด/ปปปป)</span></label>\n                  <input type=\"text\" id=\"abdpainLmpDate\" data-universal-date=\"true\" placeholder=\"วว/ดด/ปปปป (dd/mm/yyyy)\" autocomplete=\"off\" class=\"bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-medical-500\">\n                </div>\n\n                <!-- ข้อ 8: กลุ่ม <จำวันที่ไม่ได้แน่ชัด> ให้เลือกประมาณ (เปิดเฉพาะเมื่อเลือก approx) -->\n                <div id=\"abdpain_lmp_approx_wrap\" class=\"hidden bg-white border border-slate-200 rounded-xl p-3.5 space-y-2\">\n                  <label class=\"text-xs font-semibold text-slate-800 block\">ช่วงเวลาที่เริ่มมีประจำเดือนรอบล่าสุดโดยประมาณ:</label>\n                  <div class=\"grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs\">\n                    <label class=\"selectable-card bg-slate-50 p-2.5 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"radio\" name=\"abdpain_lmp_approx\" value=\"1_week_ago\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium text-slate-700\">1 สัปดาห์ก่อน</span>\n                    </label>\n                    <label class=\"selectable-card bg-slate-50 p-2.5 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"radio\" name=\"abdpain_lmp_approx\" value=\"2_weeks_ago\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium text-slate-700\">2 สัปดาห์ก่อน</span>\n                    </label>\n                    <label class=\"selectable-card bg-slate-50 p-2.5 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"radio\" name=\"abdpain_lmp_approx\" value=\"3_4_weeks_ago\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium text-slate-700\">3-4 สัปดาห์ก่อน</span>\n                    </label>\n                    <label class=\"selectable-card bg-slate-50 p-2.5 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"radio\" name=\"abdpain_lmp_approx\" value=\"1_2_months_ago\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium text-slate-700\">1-2 เดือนก่อน</span>\n                    </label>\n                    <label class=\"selectable-card bg-slate-50 p-2.5 rounded-lg flex items-center cursor-pointer col-span-2 sm:col-span-1\">\n                      <input type=\"radio\" name=\"abdpain_lmp_approx\" value=\"gt_2_months_ago\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium text-slate-700\">มากกว่า 2 เดือน</span>\n                    </label>\n                  </div>\n                </div>\n              </div>\n\n              <!-- อาการเลือดออกผิดปกติ / ตกขาว (ข้อ 3: ปรับรูปแบบเป็นกลาง) -->\n              <div class=\"space-y-2 pt-1 border-t border-slate-200\">\n                <label class=\"selectable-card bg-white p-3 rounded-xl flex items-start cursor-pointer border-slate-200\">\n                  <input type=\"checkbox\" id=\"abdpain_gyn_bleeding\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block text-xs sm:text-sm\">มีเลือดออกกะปริดกะปรอยทางช่องคลอดผิดปกติร่วมด้วย</span>\n                    <span class=\"text-[11px] text-slate-500\">มีเลือดออกทางช่องคลอดที่ไม่ใช่รอบประจำเดือนปกติ</span>\n                  </div>\n                </label>\n                <label class=\"selectable-card bg-white p-3 rounded-xl flex items-start cursor-pointer border-slate-200\">\n                  <input type=\"checkbox\" id=\"abdpain_gyn_discharge\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                  <div class=\"ml-2.5\">\n                    <span class=\"font-semibold text-slate-800 block text-xs\">มีตกขาวผิดปกติ สีเหลืองเขียว มีกลิ่น หรือมีไข้ร่วมด้วย</span>\n                    <span class=\"text-[11px] text-slate-500\">ตกขาวมีปริมาณมาก เปลี่ยนสี หรือมีกลิ่นผิดปกติ</span>\n                  </div>\n                </label>\n              </div>\n\n            </div>\n\n          </div>\n\n\n          <!-- CARD 5: ประวัติผ่าตัดในช่องท้อง & ยาที่เสี่ยงต่อทางเดินอาหาร -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"scissors\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-900\">4. ประวัติผ่าตัดช่องท้องและยาที่เสี่ยงต่อทางเดินอาหาร</h2>\n                <p class=\"text-xs text-slate-500\">ประวัติสำคัญเพื่อช่วยแพทย์วินิจฉัยภาวะพังผืดลำไส้และแผลในทางเดินอาหาร</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4 text-xs\">\n              <!-- ผ่าตัดช่องท้องเดิม -->\n              <div>\n                <label class=\"block font-semibold text-slate-700 uppercase tracking-wider mb-2\">ประวัติการเคยผ่าตัดในช่องท้อง</label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2\">\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"abdpain_surgery_status\" value=\"no\" onchange=\"toggleBranch('abdpain_surgery_detail_wrap', false)\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium\">ไม่เคยผ่าตัดในช่องท้อง</span>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"abdpain_surgery_status\" value=\"yes\" onchange=\"toggleBranch('abdpain_surgery_detail_wrap', true)\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-semibold text-slate-800\">เคยผ่าตัดในช่องท้อง หรือ ผ่าคลอด</span>\n                  </label>\n                </div>\n                <!-- กล่องระบุรายละเอียดการผ่าตัด (ข้อ 4) -->\n                <div id=\"abdpain_surgery_detail_wrap\" class=\"hidden\">\n                  <input type=\"text\" id=\"abdpainSurgeryDetail\" placeholder=\"ระบุการผ่าตัด เช่น เคยผ่าไส้ติ่ง, ผ่าคลอดทางหน้าท้อง 2 ครั้ง, ผ่าตัดนิ่วในถุงน้ำดี...\" class=\"w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white\">\n                </div>\n              </div>\n\n              <!-- ยาที่มีความเสี่ยงต่อทางเดินอาหาร (ข้อ 9: เพิ่ม ,ฯลฯ) -->\n              <div>\n                <label class=\"block font-semibold text-slate-700 uppercase tracking-wider mb-1.5\">ยาที่รับประทานประจำหรือทานก่อนเริ่มปวดท้อง (เลือกได้หลายข้อ)</label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2\">\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" id=\"abdpain_med_nsaids\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-medium\">ยาแก้ปวดข้อ/กล้ามเนื้อ (NSAIDs, ยาชุด, ยาแก้เส้น, ฯลฯ)</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" id=\"abdpain_med_steroids\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-medium\">ยาสเตียรอยด์ (ยาลูกกลอน, ยาต้ม, Prednisolone, ฯลฯ)</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" id=\"abdpain_med_anticoagulants\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-medium\">ยาละลายลิ่มเลือด / ยาต้านเกล็ดเลือด (Warfarin, Aspirin, ฯลฯ)</span>\n                  </label>\n                </div>\n              </div>\n\n              <!-- แอลกอฮอล์ -->\n              <div>\n                <label class=\"block font-semibold text-slate-700 uppercase tracking-wider mb-1.5\">พฤติกรรมการดื่มเครื่องดื่มแอลกอฮอล์</label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2\">\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"abdpain_alcohol\" value=\"none\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium\">ไม่ดื่มแอลกอฮอล์</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"abdpain_alcohol\" value=\"occasional\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium\">ดื่มสังสรรค์นานๆ ครั้ง</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"abdpain_alcohol\" value=\"regular_heavy\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-semibold text-slate-800\">ดื่มประจำ หรือ ดื่มหนักก่อนปวด</span>\n                  </label>\n                </div>\n              </div>\n\n            </div>\n          </div>\n\n          <!-- อาการอื่นๆ เป็นช่องกรอกอิสระ -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100\">\n              <div class=\"bg-slate-100 text-slate-600 p-2 rounded-xl\">\n                <i data-lucide=\"message-square-plus\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-800\">อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2>\n                <p class=\"text-xs text-slate-500\">ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี เช่น อ่อนเพลียมาก, แน่นหน้าอก, วิงเวียนศีรษะ)</p>\n              </div>\n            </div>\n            <textarea id=\"abdpain_other_free\" rows=\"2\" placeholder=\"พิมพ์ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)...\" \n              class=\"w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white\"></textarea>\n          </div>\n\n        </div> <!-- END ABDOMINAL PAIN QUESTIONNAIRE SECTION -->",
  algorithm: {
  "id": "abdpain",
  "schemaCode": "abdominal_pain",
  "titleTh": "ปวดท้อง",
  "titleEn": "Abdominal pain",
  "sections": [
    {
      "sectionNo": 1,
      "titleTh": "ลักษณะและตำแหน่งของอาการปวดท้อง (OPQRST of Abdominal Pain)",
      "questions": [
        {
          "key": "duration",
          "labelTh": "เริ่มปวดท้องมานานเท่าไรแล้ว?",
          "type": "duration_with_unit",
          "units": "UNIVERSAL_DURATION_UNITS"
        },
        {
          "key": "abdpainOnsetMode",
          "labelTh": "อาการปวดเริ่มต้นแบบใด?",
          "type": "single_choice",
          "options": [
            {
              "value": "sudden_severe",
              "patientTh": "ปวดรุนแรงขึ้นมาทันทีทันใด (บอกเวลานาทีที่เริ่มปวดได้ชัดเจน)",
              "doctorTh": "Sudden/Abrupt severe onset"
            },
            {
              "value": "gradual_worsening",
              "patientTh": "ค่อยๆ ปวดมากขึ้นเรื่อยๆ ตามลำดับ",
              "doctorTh": "Gradual progressive worsening"
            },
            {
              "value": "intermittent_crampy",
              "patientTh": "ปวดๆ หายๆ เป็นพักๆ สลับช่วงสบายดี",
              "doctorTh": "Intermittent/Episodic pain"
            }
          ]
        },
        {
          "key": "abdpainLocs",
          "labelTh": "ตำแหน่งที่ปวดท้องมากที่สุด (เลือกได้มากกว่า 1 ตำแหน่ง)",
          "type": "multi_choice",
          "options": [
            {
              "value": "epigastrium",
              "patientTh": "เหนือลิ้นปี่ (Epigastrium)",
              "triggersBranch": "abdpain_branch_epigastric_ruq"
            },
            {
              "value": "ruq",
              "patientTh": "ใต้ชายโครงขวา (RUQ)",
              "triggersBranch": "abdpain_branch_epigastric_ruq"
            },
            {
              "value": "luq",
              "patientTh": "ใต้ชายโครงซ้าย (LUQ)"
            },
            {
              "value": "periumbilical",
              "patientTh": "รอบสะดือ (Periumbilical)"
            },
            {
              "value": "rlq",
              "patientTh": "ท้องน้อยด้านขวา (RLQ)",
              "triggersBranch": "abdpain_branch_rlq"
            },
            {
              "value": "llq",
              "patientTh": "ท้องน้อยด้านซ้าย (LLQ)"
            },
            {
              "value": "suprapubic",
              "patientTh": "หัวเหน่า / ท้องน้อยตรงกลาง (Suprapubic)",
              "triggersBranch": "abdpain_branch_suprapubic"
            },
            {
              "value": "generalized",
              "patientTh": "ปวดทั่วทั้งท้อง (Generalized)"
            }
          ]
        },
        {
          "key": "abdpainChars",
          "labelTh": "ลักษณะอาการปวดเป็นอย่างไร?",
          "type": "multi_choice",
          "options": [
            {
              "value": "colicky_crampy",
              "patientTh": "ปวดบิดเป็นพักๆ เหมือนลำไส้บีบตัว (Colicky)"
            },
            {
              "value": "constant_dull",
              "patientTh": "ปวดตื้อๆ จุกแน่นต่อเนื่องตลอดเวลา (Constant dull)"
            },
            {
              "value": "burning_gnawing",
              "patientTh": "ปวดแสบท้อง ร้อนท้อง (Burning)"
            },
            {
              "value": "sharp_stabbing",
              "patientTh": "ปวดแปล๊บๆ เหมือนถูกแทง หรือฉีกขาด (Sharp/Tearing)"
            }
          ]
        },
        {
          "key": "abdpainRads",
          "labelTh": "มีอาการปวดร้าวไปที่อื่นหรือไม่?",
          "type": "multi_choice",
          "options": [
            {
              "value": "none",
              "patientTh": "ไม่ร้าวไปที่ใด"
            },
            {
              "value": "back_mid",
              "patientTh": "ร้าวทะลุไปกลางหลัง (Mid-back)"
            },
            {
              "value": "scapula_right_shoulder",
              "patientTh": "ร้าวไปสะบักขวา หรือไหล่ขวา"
            },
            {
              "value": "back_right",
              "patientTh": "ร้าวไปบั้นเอว/สีข้างด้านขวา",
              "triggersBranch": "abdpain_branch_flank_groin"
            },
            {
              "value": "back_left",
              "patientTh": "ร้าวไปบั้นเอว/สีข้างด้านซ้าย",
              "triggersBranch": "abdpain_branch_flank_groin"
            },
            {
              "value": "groin_thigh_genitalia",
              "patientTh": "ร้าวลงขาหนีบ หรืออวัยวะเพศ",
              "triggersBranch": "abdpain_branch_flank_groin"
            },
            {
              "value": "chest",
              "patientTh": "ร้าวขึ้นหน้าอก"
            }
          ]
        },
        {
          "key": "abdpainPainScore",
          "labelTh": "ระดับความเจ็บปวดในขณะนี้ (Pain Score 0 - 10 พร้อม Emoji)",
          "type": "nullable_slider_0_to_10",
          "note": "ห้ามค้างค่า Default หากผู้ป่วยไม่ได้เลื่อนแถบ ค่าต้องเป็น null"
        }
      ]
    },
    {
      "sectionNo": 2,
      "titleTh": "อาการร่วมทางระบบทางเดินอาหารและสัญญาณเตือน (GI Symptoms & Embedded Red Flags)",
      "items": [
        {
          "key": "abdpain_rf_shock",
          "patientTh": "เหงื่อแตก ตัวเย็น ซีด เพลียมากเหมือนจะเป็นลม",
          "isRedFlag": true
        },
        {
          "key": "abdpain_rf_syncope",
          "patientTh": "มีอาการหน้ามืด วูบ หรือหมดสติ",
          "isRedFlag": true
        },
        {
          "key": "abdpain_rf_hematemesis",
          "patientTh": "อาเจียนเป็นเลือดสด หรืออาเจียนเป็นสีดำคล้ายกากกาแฟ",
          "isRedFlag": true
        },
        {
          "key": "abdpain_rf_melena",
          "patientTh": "ถ่ายอุจจาระดำเหนียวเหมือนยางมะตอย หรือถ่ายเป็นเลือดสด",
          "isRedFlag": true
        },
        {
          "key": "abdpain_rf_obstruction",
          "patientTh": "ท้องอืดตึงมาก ไม่ถ่ายอุจจาระและไม่ผายลมเลย",
          "isRedFlag": true
        },
        {
          "key": "abdpain_rf_fever",
          "patientTh": "มีไข้สูง หนาวสั่นสะท้านร่วมด้วย",
          "isRedFlag": true
        }
      ]
    }
  ]
},
  seedPatients: [
  {
    "id": "case-043",
    "queue_number": "A-043",
    "hn": "6704512",
    "name": "นายวีระชัย บุญส่ง",
    "age": 28,
    "gender": "ชาย",
    "chief_complaint": "abdominal_pain",
    "chief_complaint_title": "ปวดท้อง",
    "status": "waiting",
    "timestamp": "2026-10-26T02:31:26.423Z",
    "durationVal": 18,
    "durationUnit": "hours",
    "abdpainPainScore": 7,
    "abdpainOnsetMode": "gradual_worsening",
    "abdpainChars": [
      "dull",
      "sharp_stabbing"
    ],
    "abdpainLocs": [
      "rlq",
      "periumbilical"
    ],
    "abdpainRads": [
      "none"
    ],
    "abdpainFactors": [
      "jarring_movement"
    ],
    "abdpain_rf_syncope": false,
    "abdpain_rf_melena": false,
    "abdpain_rf_hematemesis": false,
    "abdpain_rf_obstruction": false,
    "abdpain_rf_shock": false,
    "abdpain_rf_fever": false,
    "abdpain_anorexia": "loss_appetite",
    "abdpain_vomit_status": "nausea_only",
    "abdpainVomitFreq": 0,
    "abdpain_vomit_contents": [],
    "abdpain_stool_status": "normal",
    "abdpainDiarrheaFreq": 0,
    "abdpain_jaundice": false,
    "abdpain_rlq_migration": true,
    "abdpain_rlq_jarring": true,
    "abdpain_epi_fatty_meal": false,
    "abdpain_epi_gallstone_alcohol": false,
    "abdpain_flank_restless": false,
    "abdpain_flank_hematuria": false,
    "abdpain_supra_dysuria": false,
    "abdpain_lmp_status": "unspecified",
    "abdpainLmpDate": "",
    "abdpain_gyn_bleeding": false,
    "abdpain_gyn_discharge": false,
    "abdpain_surgery_status": "no",
    "abdpainSurgeryDetail": "",
    "abdpain_med_nsaids": false,
    "abdpain_med_steroids": false,
    "abdpain_med_anticoagulants": false,
    "abdpain_alcohol": "none",
    "hospRecordStatus": "self",
    "underlying": ["ปฏิเสธ"],
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "ไม่มี",
    "doctor_notes": {
      "additional_hpi": "18 ชั่วโมงก่อนมา เริ่มปวดตื้อๆ แถวรอบสะดือ หลังจากนั้นประมาณ 8 ชั่วโมง ย้ายมาปวดชัดเจนที่ท้องน้อยด้านขวา เดินกระแทกส้นเท้าแล้วเจ็บสะท้าน",
      "physical_exam": "BT 37.8 C, PR 92/min, RR 20/min, BP 122/78 mmHg. Abdomen: Guarding and marked tenderness at McBurney point, Rovsing sign positive, Psoas sign positive",
      "preliminary_dx": "Acute Appendicitis",
      "plan": "NPO, IV Acetar 1000 ml IV drip 100 ml/hr, IV Cefazolin 1g, Consult General Surgery for Emergency Appendectomy"
    }
  },
  {
    "id": "case-044",
    "queue_number": "A-044",
    "hn": "6707823",
    "name": "นางสาวสุดารัตน์ ใจดี",
    "age": 26,
    "gender": "หญิง",
    "chief_complaint": "abdominal_pain",
    "chief_complaint_title": "ปวดท้อง",
    "status": "waiting",
    "timestamp": "2026-10-26T02:41:26.423Z",
    "durationVal": 3,
    "durationUnit": "hours",
    "abdpainPainScore": 9,
    "abdpainOnsetMode": "sudden_severe",
    "abdpainChars": [
      "sharp_stabbing"
    ],
    "abdpainLocs": [
      "rlq",
      "suprapubic"
    ],
    "abdpainRads": [
      "groin_thigh_genitalia"
    ],
    "abdpainFactors": [
      "jarring_movement"
    ],
    "abdpain_rf_syncope": true,
    "abdpain_rf_melena": false,
    "abdpain_rf_hematemesis": false,
    "abdpain_rf_obstruction": false,
    "abdpain_rf_shock": true,
    "abdpain_rf_fever": false,
    "abdpain_anorexia": "loss_appetite",
    "abdpain_vomit_status": "vomiting",
    "abdpainVomitFreq": 2,
    "abdpain_vomit_contents": [
      "food_gastric"
    ],
    "abdpain_stool_status": "normal",
    "abdpainDiarrheaFreq": 0,
    "abdpain_jaundice": false,
    "abdpain_rlq_migration": false,
    "abdpain_rlq_jarring": true,
    "abdpain_epi_fatty_meal": false,
    "abdpain_epi_gallstone_alcohol": false,
    "abdpain_flank_restless": false,
    "abdpain_flank_hematuria": false,
    "abdpain_supra_dysuria": false,
    "abdpain_lmp_status": "missed_period",
    "abdpainLmpDate": "",
    "abdpain_gyn_bleeding": true,
    "abdpain_gyn_discharge": false,
    "abdpain_surgery_status": "no",
    "abdpainSurgeryDetail": "",
    "abdpain_med_nsaids": false,
    "abdpain_med_steroids": false,
    "abdpain_med_anticoagulants": false,
    "abdpain_alcohol": "none",
    "hospRecordStatus": "self",
    "underlying": ["ปฏิเสธ"],
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "ไม่มี",
    "doctor_notes": {
      "additional_hpi": "หญิงวัยเจริญพันธุ์ ขาดประจำเดือนประมาณ 6 สัปดาห์ ปวดท้องน้อยขวาเฉียบพลันรุนแรง 3 ชั่วโมงก่อนมา มีเลือดออกกะปริดกะปรอยทางช่องคลอด หน้ามืดวูบคล้ายจะเป็นลม เหงื่อแตกตัวเย็น",
      "physical_exam": "BT 36.8 C, PR 118/min, RR 22/min, BP 88/56 mmHg, SpO2 98%. Marked pallor, cold clammy skin. Abdomen: Distended, marked tenderness and rebound at RLQ and suprapubic",
      "preliminary_dx": "Ruptured Right Ectopic Pregnancy with Hypovolemic Shock",
      "plan": "STAT 2 Large-bore IV lines (18G), Rush Normal Saline 1000 ml IV, STAT UPT (Positive), STAT CBC, Coagulogram, G/M PRC 2 units, STAT emergency consult Ob-Gyn for Emergency Laparotomy"
    }
  },
  {
    "id": "case-045",
    "queue_number": "A-045",
    "hn": "6709120",
    "name": "นายประวิทย์ มงคลศิลป์",
    "age": 62,
    "gender": "ชาย",
    "chief_complaint": "abdominal_pain",
    "chief_complaint_title": "ปวดท้อง",
    "status": "waiting",
    "timestamp": "2026-10-26T02:26:26.423Z",
    "durationVal": 2,
    "durationUnit": "days",
    "abdpainPainScore": 6,
    "abdpainOnsetMode": "gradual_worsening",
    "abdpainChars": [
      "burning"
    ],
    "abdpainLocs": [
      "epigastrium"
    ],
    "abdpainRads": [
      "back_mid"
    ],
    "abdpainFactors": [
      "empty_stomach_worse",
      "antacid_relief"
    ],
    "abdpain_rf_syncope": true,
    "abdpain_rf_melena": true,
    "abdpain_rf_hematemesis": true,
    "abdpain_rf_obstruction": false,
    "abdpain_rf_shock": false,
    "abdpain_rf_fever": false,
    "abdpain_anorexia": "loss_appetite",
    "abdpain_vomit_status": "vomiting",
    "abdpainVomitFreq": 3,
    "abdpain_vomit_contents": [
      "coffee_ground_blood"
    ],
    "abdpain_stool_status": "melena_bloody",
    "abdpainDiarrheaFreq": 0,
    "abdpain_jaundice": false,
    "abdpain_rlq_migration": false,
    "abdpain_rlq_jarring": false,
    "abdpain_epi_fatty_meal": false,
    "abdpain_epi_gallstone_alcohol": true,
    "abdpain_flank_restless": false,
    "abdpain_flank_hematuria": false,
    "abdpain_supra_dysuria": false,
    "abdpain_lmp_status": "unspecified",
    "abdpainLmpDate": "",
    "abdpain_gyn_bleeding": false,
    "abdpain_gyn_discharge": false,
    "abdpain_surgery_status": "no",
    "abdpainSurgeryDetail": "",
    "abdpain_med_nsaids": true,
    "abdpain_med_steroids": false,
    "abdpain_med_anticoagulants": false,
    "abdpain_alcohol": "regular_heavy",
    "hospRecordStatus": "additional",
    "underlying": [
      "ความดันสูง (HT)",
      "ข้อเข่าเสื่อม (OA Knee)"
    ],
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "Amlodipine 5mg, Ibuprofen 400mg tid pc (ซื้อทานเองจากร้านขายยา 2 สัปดาห์)",
    "doctor_notes": {
      "additional_hpi": "มีประวัติซื้อยา NSAIDs ทานแก้ปวดข้อเข่าต่อเนื่อง 2 สัปดาห์ ปวดแสบลิ้นปี่ 2 วัน วันนี้อาเจียนสีกาแฟ 3 ครั้ง และถ่ายดำเหนียวยางมะตอย 2 ครั้ง หน้ามืดตอนลุกยืน",
      "physical_exam": "BT 37.0 C, PR 104/min, RR 20/min, BP 102/64 mmHg. Mild pale conjunctivae. Abdomen: Mild epigastric tenderness, no guarding, no rebound. DRE: Melena stool on examining glove",
      "preliminary_dx": "Acute Upper GI Bleeding secondary to NSAID-induced Gastric/Duodenal Ulcer",
      "plan": "NPO, NG tube on gravity, Pantoprazole 80 mg IV bolus then 8 mg/hr continuous infusion, NSS 1000 ml IV rate 120 ml/hr, CBC, BUN/Cr, Electrolytes, Coagulogram, CXR upright, Consult GI for urgent EGD within 24 hr"
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
    const durVal = document.getElementById('abdpainDurationVal');
    const durUnit = document.getElementById('abdpainDurationUnit');
    if (durVal) durVal.value = patient.durationVal || '';
    if (durUnit && patient.durationUnit) durUnit.value = patient.durationUnit;

    setRadioValue('abdpainOnsetMode', patient.abdpainOnsetMode);
    setMultiCheckboxes('abdpain_char', patient.abdpainChars);
    setMultiCheckboxes('abdpain_loc', patient.abdpainLocs, 'abdpain_loc_other_chk', 'abdpain_loc_other_wrap', 'abdpain_loc_other_text');
    setMultiCheckboxes('abdpain_rad', patient.abdpainRads, 'abdpain_rad_other_chk', 'abdpain_rad_other_wrap', 'abdpain_rad_other_text');
    setMultiCheckboxes('abdpain_factor', patient.abdpainFactors);

    handleAbdpainLocationChange();
    handleAbdpainRadiationChange();

    if (patient.abdpainPainScore !== null && patient.abdpainPainScore !== undefined) {
      setAbdpainPainScore(patient.abdpainPainScore);
    } else {
      clearAbdpainPainScore();
    }

    setChk = (id, val) => { const el = document.getElementById(id); if (el) el.checked = Boolean(val); };
    setChk('abdpain_rf_syncope', patient.abdpain_rf_syncope);
    setChk('abdpain_rf_melena', patient.abdpain_rf_melena);
    setChk('abdpain_rf_hematemesis', patient.abdpain_rf_hematemesis);
    setChk('abdpain_rf_obstruction', patient.abdpain_rf_obstruction);
    setChk('abdpain_rf_shock', patient.abdpain_rf_shock);
    setChk('abdpain_rf_fever', patient.abdpain_rf_fever);

    setRadioValue('abdpain_anorexia', patient.abdpain_anorexia);
    setRadioValue('abdpain_vomit_status', patient.abdpain_vomit_status);
    handleAbdpainVomitToggle(patient.abdpain_vomit_status);
    if (patient.abdpain_vomit_status === 'vomiting') {
      const vf = document.getElementById('abdpainVomitFreq');
      if (vf) vf.value = patient.abdpainVomitFreq || 1;
      setMultiCheckboxes('abdpain_vomit_content', patient.abdpain_vomit_contents);
    }

    setRadioValue('abdpain_stool_status', patient.abdpain_stool_status);
    handleAbdpainStoolToggle(patient.abdpain_stool_status);
    if (patient.abdpain_stool_status === 'diarrhea') {
      const df = document.getElementById('abdpainDiarrheaFreq');
      if (df) df.value = patient.abdpainDiarrheaFreq || 1;
    }

    setChk('abdpain_jaundice', patient.abdpain_jaundice);
    setChk('abdpain_rlq_migration', patient.abdpain_rlq_migration);
    setChk('abdpain_rlq_jarring', patient.abdpain_rlq_jarring);
    setChk('abdpain_epi_fatty_meal', patient.abdpain_epi_fatty_meal);
    setChk('abdpain_epi_gallstone_alcohol', patient.abdpain_epi_gallstone_alcohol);
    setChk('abdpain_flank_restless', patient.abdpain_flank_restless);
    setChk('abdpain_flank_hematuria', patient.abdpain_flank_hematuria);
    setChk('abdpain_supra_dysuria', patient.abdpain_supra_dysuria);

    setRadioValue('abdpain_lmp_status', patient.abdpain_lmp_status);
    handleAbdpainLmpToggle(patient.abdpain_lmp_status);
    if (patient.abdpain_lmp_status === 'exact_date' && document.getElementById('abdpainLmpDate')) {
      document.getElementById('abdpainLmpDate').value = patient.abdpainLmpDate || '';
    } else if (patient.abdpain_lmp_status === 'approx') {
      setRadioValue('abdpain_lmp_approx', patient.abdpain_lmp_approx);
    }
    setChk('abdpain_gyn_bleeding', patient.abdpain_gyn_bleeding);
    setChk('abdpain_gyn_discharge', patient.abdpain_gyn_discharge);

    setRadioValue('abdpain_surgery_status', patient.abdpain_surgery_status);
    toggleBranch('abdpain_surgery_detail_wrap', patient.abdpain_surgery_status === 'yes');
    if (patient.abdpain_surgery_status === 'yes' && document.getElementById('abdpainSurgeryDetail')) {
      document.getElementById('abdpainSurgeryDetail').value = patient.abdpainSurgeryDetail || '';
    }
    setChk('abdpain_med_nsaids', patient.abdpain_med_nsaids);
    setChk('abdpain_med_steroids', patient.abdpain_med_steroids);
    setChk('abdpain_med_anticoagulants', patient.abdpain_med_anticoagulants);
    setRadioValue('abdpain_alcohol', patient.abdpain_alcohol);

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
      // ------------------ ABDOMINAL PAIN INTAKE ------------------
      const _rawDur = parseFloat(document.getElementById('abdpainDurationVal')?.value); const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
      const durationUnit = document.getElementById('abdpainDurationUnit')?.value || 'hours';
      const abdpainOnsetMode = document.querySelector('input[name="abdpainOnsetMode"]:checked')?.value || 'unspecified';
      const abdpainChars = Array.from(document.querySelectorAll('input[name="abdpain_char"]:checked')).map(cb => cb.value);

      const abdpainLocs = Array.from(document.querySelectorAll('input[name="abdpain_loc"]:checked')).map(cb => cb.value);
      if (document.getElementById('abdpain_loc_other_chk')?.checked) {
        const txt = document.getElementById('abdpain_loc_other_text')?.value.trim();
        if (txt) abdpainLocs.push(`อื่นๆ: ${txt}`);
      }

      const abdpainRads = Array.from(document.querySelectorAll('input[name="abdpain_rad"]:checked')).map(cb => cb.value);
      if (document.getElementById('abdpain_rad_other_chk')?.checked) {
        const txt = document.getElementById('abdpain_rad_other_text')?.value.trim();
        if (txt) abdpainRads.push(`อื่นๆ: ${txt}`);
      }

      const abdpainFactors = Array.from(document.querySelectorAll('input[name="abdpain_factor"]:checked')).map(cb => cb.value);
      const abdpainPainScore = abdpainPainScoreTouched ? (parseInt(document.getElementById('abdpainPainScore')?.value, 10) ?? null) : null;

      const abdpain_rf_syncope = document.getElementById('abdpain_rf_syncope')?.checked || false;
      const abdpain_rf_melena = document.getElementById('abdpain_rf_melena')?.checked || false;
      const abdpain_rf_hematemesis = document.getElementById('abdpain_rf_hematemesis')?.checked || false;
      const abdpain_rf_obstruction = document.getElementById('abdpain_rf_obstruction')?.checked || false;
      const abdpain_rf_shock = document.getElementById('abdpain_rf_shock')?.checked || false;
      const abdpain_rf_fever = document.getElementById('abdpain_rf_fever')?.checked || false;

      const abdpain_anorexia = document.querySelector('input[name="abdpain_anorexia"]:checked')?.value || 'normal';
      const abdpain_vomit_status = document.querySelector('input[name="abdpain_vomit_status"]:checked')?.value || 'none';
      const abdpainVomitFreq = (abdpain_vomit_status === 'vomiting') ? (parseInt(document.getElementById('abdpainVomitFreq')?.value) || 1) : 0;
      const abdpain_vomit_contents = Array.from(document.querySelectorAll('input[name="abdpain_vomit_content"]:checked')).map(cb => cb.value);
      const abdpain_stool_status = document.querySelector('input[name="abdpain_stool_status"]:checked')?.value || 'normal';
      const abdpainDiarrheaFreq = (abdpain_stool_status === 'diarrhea') ? (parseInt(document.getElementById('abdpainDiarrheaFreq')?.value) || 1) : 0;
      const abdpain_jaundice = document.getElementById('abdpain_jaundice')?.checked || false;

      const abdpain_rlq_migration = document.getElementById('abdpain_rlq_migration')?.checked || false;
      const abdpain_rlq_jarring = document.getElementById('abdpain_rlq_jarring')?.checked || false;
      const abdpain_epi_fatty_meal = document.getElementById('abdpain_epi_fatty_meal')?.checked || false;
      const abdpain_epi_gallstone_alcohol = document.getElementById('abdpain_epi_gallstone_alcohol')?.checked || false;
      const abdpain_flank_restless = document.getElementById('abdpain_flank_restless')?.checked || false;
      const abdpain_flank_hematuria = document.getElementById('abdpain_flank_hematuria')?.checked || false;
      const abdpain_supra_dysuria = document.getElementById('abdpain_supra_dysuria')?.checked || false;

      const abdpain_lmp_status = document.querySelector('input[name="abdpain_lmp_status"]:checked')?.value || 'unspecified';
      const abdpain_lmp_approx = document.querySelector('input[name="abdpain_lmp_approx"]:checked')?.value || '';
      const abdpainLmpDate = document.getElementById('abdpainLmpDate')?.value || '';
      const abdpain_gyn_bleeding = document.getElementById('abdpain_gyn_bleeding')?.checked || false;
      const abdpain_gyn_discharge = document.getElementById('abdpain_gyn_discharge')?.checked || false;

      const abdpain_surgery_status = document.querySelector('input[name="abdpain_surgery_status"]:checked')?.value || 'no';
      const abdpainSurgeryDetail = document.getElementById('abdpainSurgeryDetail')?.value.trim() || '';
      const abdpain_med_nsaids = document.getElementById('abdpain_med_nsaids')?.checked || false;
      const abdpain_med_steroids = document.getElementById('abdpain_med_steroids')?.checked || false;
      const abdpain_med_anticoagulants = document.getElementById('abdpain_med_anticoagulants')?.checked || false;
      const abdpain_alcohol = document.querySelector('input[name="abdpain_alcohol"]:checked')?.value || 'none';

      newPatient = {
        id: recordId,
        queue_number: queueNumber,
        hn: randomHn,
        name: patientName,
        age: patientAge,
        gender: gender,
        chief_complaint: 'abdominal_pain',
        chief_complaint_title: 'ปวดท้อง',
        status: recordStatus,
        timestamp: new Date().toISOString(),
        durationVal,
        durationUnit,
        abdpainPainScore,
        abdpainOnsetMode,
        abdpainChars,
        abdpainLocs,
        abdpainRads,
        abdpainFactors,
        abdpain_rf_syncope,
        abdpain_rf_melena,
        abdpain_rf_hematemesis,
        abdpain_rf_obstruction,
        abdpain_rf_shock,
        abdpain_rf_fever,
        abdpain_anorexia,
        abdpain_vomit_status,
        abdpainVomitFreq,
        abdpain_vomit_contents,
        abdpain_stool_status,
        abdpainDiarrheaFreq,
        abdpain_jaundice,
        abdpain_rlq_migration,
        abdpain_rlq_jarring,
        abdpain_epi_fatty_meal,
        abdpain_epi_gallstone_alcohol,
        abdpain_flank_restless,
        abdpain_flank_hematuria,
        abdpain_supra_dysuria,
        abdpain_lmp_status,
        abdpain_lmp_approx,
        abdpainLmpDate,
        abdpain_gyn_bleeding,
        abdpain_gyn_discharge,
        abdpain_surgery_status,
        abdpainSurgeryDetail,
        abdpain_med_nsaids,
        abdpain_med_steroids,
        abdpain_med_anticoagulants,
        abdpain_alcohol,
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
      p.abdpain_rf_syncope || p.abdpain_rf_melena || p.abdpain_rf_hematemesis || 
      p.abdpain_rf_obstruction || p.abdpain_rf_shock || p.abdpain_rf_fever ||
      p.abdpain_stool_status === 'melena_bloody' ||
      (p.abdpain_vomit_contents && p.abdpain_vomit_contents.includes('coffee_ground_blood')) ||
      (p.gender === 'หญิง' && (p.abdpain_gyn_bleeding || p.abdpain_lmp_status === 'missed_period')) ||
      (p.abdpainLocs?.includes('rlq') && p.abdpain_rlq_migration && p.abdpain_rlq_jarring) ||
      (p.abdpainFactors?.includes('jarring_movement') && (p.abdpainOnsetMode === 'sudden_severe' || p.abdpainChars?.includes('sharp_stabbing')))
    );
  },

  evaluateRedFlags(patient) {
    const redFlags = [];
    if (patient.abdpain_rf_shock || (patient.abdpain_rf_syncope && (patient.abdpain_rf_melena || patient.abdpain_rf_hematemesis))) {
      redFlags.push({
        key: 'shock_collapse',
        textTh: 'ภาวะช็อก / เหงื่อแตกตัวเย็นซีด / หน้ามืดหมดสติ (Impending Shock / Collapse)',
        risk: 'เสี่ยงภาวะช็อกจากเสียเลือดรุนแรง หรือ อวัยวะภายในฉีกขาด (Ruptured AAA / Massive GI Bleed / Ruptured Ectopic Pregnancy)'
      });
    }
    if (patient.abdpain_rf_melena || patient.abdpain_stool_status === 'melena_bloody') {
      redFlags.push({
        key: 'melena',
        textTh: 'ถ่ายดำเหนียวเหมือนยางมะตอย หรือ ถ่ายเป็นเลือดสด (Melena / Hematochezia)',
        risk: 'เสี่ยงภาวะเลือดออกในทางเดินอาหารเฉียบพลัน (Severe Upper/Lower GI Hemorrhage)'
      });
    }
    if (patient.abdpain_rf_hematemesis || (patient.abdpain_vomit_contents && patient.abdpain_vomit_contents.includes('coffee_ground_blood'))) {
      redFlags.push({
        key: 'hematemesis',
        textTh: 'อาเจียนเป็นเลือดสดหรือสีกาแฟ (Coffee-ground emesis / Hematemesis)',
        risk: 'เสี่ยงภาวะเลือดออกในกระเพาะอาหารหรือหลอดอาหารเฉียบพลัน (Acute Upper GI Bleeding)'
      });
    }
    if (patient.abdpain_rf_obstruction) {
      redFlags.push({
        key: 'obstruction',
        textTh: 'ท้องอืดตึงมาก ไม่ถ่ายอุจจาระและไม่ผายลมเลย (Complete Bowel Obstruction)',
        risk: 'เสี่ยงภาวะลำไส้อุดตันเฉียบพลัน / ลำไส้ขาดเลือด (Mechanical Bowel Obstruction / Strangulation)'
      });
    }
    if (patient.abdpain_rf_fever) {
      redFlags.push({
        key: 'fever_acute_abdomen',
        textTh: 'มีไข้สูง หนาวสั่นสะท้านร่วมกับปวดท้อง (High Fever with Acute Abdomen)',
        risk: 'เสี่ยงการติดเชื้อรุนแรงในช่องท้อง (Acute Cholangitis / Intra-abdominal Sepsis / Peritonitis)'
      });
    }
    if (patient.gender === 'หญิง' && (patient.abdpain_gyn_bleeding || patient.abdpain_lmp_status === 'missed_period')) {
      redFlags.push({
        key: 'ectopic_pregnancy',
        textTh: 'สตรีวัยเจริญพันธุ์ปวดท้องร่วมกับเลือดออกทางช่องคลอด หรือ ขาดประจำเดือน (Suspected Ectopic Pregnancy)',
        risk: 'เสี่ยงภาวะตั้งครรภ์นอกมดลูกแตก (Ruptured Ectopic Pregnancy) ต้องส่งตรวจ UPT และประเมินสัญญาณชีพทันที'
      });
    }
    if (patient.abdpainLocs?.includes('rlq') && patient.abdpain_rlq_migration && patient.abdpain_rlq_jarring) {
      redFlags.push({
        key: 'acute_appendicitis',
        textTh: 'ปวดท้องน้อยขวา มี Pain Migration และ Jarring Pain ชัดเจน (Classic Appendicitis Triad)',
        risk: 'เสี่ยงไส้ติ่งอักเสบเฉียบพลัน (Acute Appendicitis) เสี่ยงต่อการแตกทะลุ ต้องปรึกษาศัลยแพทย์'
      });
    }
    if (patient.abdpainFactors?.includes('jarring_movement') && (patient.abdpainOnsetMode === 'sudden_severe' || patient.abdpainChars?.includes('sharp_stabbing'))) {
      redFlags.push({
        key: 'peritonitis',
        textTh: 'ปวดท้องรุนแรงฉับพลัน ขยับตัวแล้วเจ็บสะท้านท้อง (Peritoneal Irritation / Suspected Perforation)',
        risk: 'เสี่ยงภาวะกระเพาะ/ลำไส้ทะลุ หรือ เยื่อบุช่องท้องอักเสบทั่วไป (Hollow Viscus Perforation / Generalized Peritonitis)'
      });
    }
    if (patient.abdpain_rf_syncope && !redFlags.some(r => r.key === 'shock_collapse')) {
      redFlags.push({
        key: 'syncope',
        textTh: 'หน้ามืด วูบ หรือหมดสติ (Syncope / Orthostatic Hypotension)',
        risk: 'เสี่ยงภาวะความดันโลหิตตกเฉียบพลันจากภาวะขาดน้ำหรือเสียเลือด'
      });
    }
    return redFlags;
  },

  updateOutputs(patient) {
    updateAbdominalPainOutputs(patient);
  },

  generateCds(patient, ctx) {
    const { rfs, ddxList, workupList, managementList } = ctx;
    if (rfs.some(r => r.key === 'ectopic_pregnancy')) {
      ddxList.push('1. Ruptured Ectopic Pregnancy (ต้องตัดออกเป็นอันดับแรกในหญิงวัยเจริญพันธุ์!)');
      ddxList.push('2. Ruptured Ovarian Cyst / Pelvic Inflammatory Disease (PID) / Tubo-ovarian Abscess');
      ddxList.push('3. Acute Appendicitis');
      workupList.push('• Urine Pregnancy Test (UPT) ด่วนที่สุด + Bedside Pelvic/FAST Ultrasound ดู Free fluid ในช่องท้อง');
      workupList.push('• CBC, Crossmatch จองเลือด, Serum beta-hCG');
      managementList.push('• เปิดเส้น IV เข็มใหญ่ 2 เส้น, Resuscitate ด้วย Crystalloid หากมีภาวะช็อก และปรึกษาสูตินรีแพทย์ฉุกเฉินทันที');
    } else if (rfs.some(r => r.key === 'acute_appendicitis' || r.key === 'peritonitis')) {
      ddxList.push('1. Acute Appendicitis (with/without localized perforation)');
      ddxList.push('2. Hollow Viscus Perforation (เช่น Peptic Ulcer Perforation) / Acute Peritonitis');
      ddxList.push('3. Acute Cholecystitis / Acute Diverticulitis');
      workupList.push('• CBC, UA, Electrolytes, BUN/Cr, UPT (ถ้าเป็นหญิงวัยเจริญพันธุ์)');
      workupList.push('• Acute Abdomen Series (CXR upright ดู Free air ใต้กะบังลม) / Ultrasound หรือ CT Whole Abdomen');
      managementList.push('• งดน้ำและอาหารทางปาก (NPO), เปิดเส้นให้สารน้ำ IV, ให้ยาแก้ปวดเหมาะสม และปรึกษาศัลยแพทย์');
    } else {
      ddxList.push('1. Acute Gastritis / Peptic Ulcer Disease / Upper GI Bleeding');
      ddxList.push('2. Biliary Colic / Acute Cholecystitis / Acute Pancreatitis');
      ddxList.push('3. Acute Gastroenteritis / Ureteric Calculi (Renal Colic)');
      workupList.push('• CBC, BUN/Cr, Electrolytes, LFT, Serum Amylase/Lipase, UA, EKG (ในผู้สูงอายุที่ปวด Epigastrium เพื่อแยก Inferior MI)');
      managementList.push('• ประเมินภาวะขาดน้ำ/เสียเลือด หลีกเลี่ยงการใช้ยากลุ่ม NSAIDs ในผู้ป่วยสงสัยแผลในกระเพาะหรือเลือดออกทางเดินอาหาร');
    }
  }
});
