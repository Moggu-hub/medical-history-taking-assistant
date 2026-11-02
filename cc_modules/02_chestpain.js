// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 02_chestpain.js
// อาการนำ: เจ็บแน่นหน้าอก (Chest pain)
// ไฟล์นี้แยกอิสระสำหรับอาการนำ chestpain เพื่อให้ทีมแพทย์และ IT โรงพยาบาลนำไปพัฒนาต่อได้โดยไม่กระทบระบบหลัก
// =========================================================================

function handleChestpainCharChange() {
  const chars = Array.from(document.querySelectorAll('input[name="chestpain_char"]:checked')).map(cb => cb.value);
  const isDyspnea = document.getElementById('chestpain_rf_dyspnea')?.checked || false;
  const isHemoptysis = document.getElementById('chestpain_rf_hemoptysis')?.checked || false;
  const isCalf = document.getElementById('chestpain_rf_calf_swelling')?.checked || false;
  const isAbdpain = document.getElementById('chestpain_abdpain')?.checked || false;

  toggleBranch('chestpain_branch_pulm', chars.includes('pleuritic_sharp') || isDyspnea || isHemoptysis || isCalf);
  toggleBranch('chestpain_branch_gi', chars.includes('burning_heartburn') || isAbdpain);
  toggleBranch('chestpain_branch_msk', chars.includes('aching_tender'));
  checkChestpainHighRiskMedTrigger();
}

function handleChestpainRadChange() {
  checkChestpainHighRiskMedTrigger();
}

let chestpainPainScoreTouched = false;

function clearChestpainPainScore() {
  chestpainPainScoreTouched = false;
  const slider = document.getElementById('chestpainPainScore');
  if (slider) slider.value = 0;
  const emojiEl = document.getElementById('chestpainPainScoreEmoji');
  const textEl = document.getElementById('chestpainPainScoreText');
  const badgeEl = document.getElementById('chestpainPainScoreBadge');
  const clearBtn = document.getElementById('chestpainPainScoreClearBtn');
  if (emojiEl) emojiEl.textContent = '⚪';
  if (textEl) textEl.textContent = 'ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)';
  if (badgeEl) badgeEl.className = 'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all';
  if (clearBtn) clearBtn.classList.add('hidden');
}

function handleChestpainPainScoreChange(val) {
  chestpainPainScoreTouched = true;
  const num = parseInt(val, 10);
  const emojiEl = document.getElementById('chestpainPainScoreEmoji');
  const textEl = document.getElementById('chestpainPainScoreText');
  const badgeEl = document.getElementById('chestpainPainScoreBadge');
  const clearBtn = document.getElementById('chestpainPainScoreClearBtn');
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

function setChestpainPainScore(score) {
  chestpainPainScoreTouched = true;
  const slider = document.getElementById('chestpainPainScore');
  if (slider) {
    slider.value = score;
    handleChestpainPainScoreChange(score);
  }
}

function checkChestpainHighRiskMedTrigger() {
  const isCrushing = document.querySelector('input[name="chestpain_char"][value="crushing_heavy"]')?.checked || false;
  const isRadArm = document.querySelector('input[name="chestpain_rad"][value="left_arm_shoulder"]')?.checked || false;
  const isRadNeck = document.querySelector('input[name="chestpain_rad"][value="neck_jaw"]')?.checked || false;
  const isDiaphoresis = document.getElementById('chestpain_rf_diaphoresis')?.checked || false;
  const isSyncope = document.getElementById('chestpain_rf_syncope')?.checked || false;
  const isDyspnea = document.getElementById('chestpain_rf_dyspnea')?.checked || false;

  const shouldOpen = isCrushing || isRadArm || isRadNeck || isDiaphoresis || isSyncope || isDyspnea;

  const section = document.getElementById('chestpain_high_risk_med_section');
  if (section) {
    if (shouldOpen) section.classList.remove('hidden');
    else section.classList.add('hidden');
  }
  updateSectionNumbering();
}

    function updateChestPainOutputs(patient) {
      const unitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
      const durationText = patient.durationVal ? `${patient.durationVal} ${unitMap[patient.durationUnit] || 'ชั่วโมง'}` : 'ไม่ระบุ';

      const onsetMap = {
        sudden_peak: 'เจ็บรุนแรงทันทีทันใดในไม่กี่วินาที (Sudden onset - maximal at onset)',
        gradual: 'ค่อยๆ แน่นหรือเจ็บมากขึ้นเรื่อยๆ ช้าๆ (Gradual worsening)',
        intermittent: 'เป็นๆ หายๆ แน่นเป็นพักๆ (Intermittent pattern)',
        chronic_stable: 'มีอาการเรื้อรัง (เจ็บเวลาเหนื่อย หรือ เจ็บเท่าๆเดิมมานาน)',
        unspecified: 'ไม่ได้ระบุรูปแบบการเริ่ม'
      };

      const locMap = {
        substernal: 'กลางหน้าอก/หลังกระดูกอก (Substernal)',
        left_chest: 'อกซ้าย (Left chest)',
        right_chest: 'อกขวา (Right chest)',
        epigastrium: 'ใต้ลิ้นปี่/เหนือลิ้นปี่ (Epigastrium)',
        diffuse: 'ทั่วทั้งหน้าอก (Diffuse chest pain)'
      };

      const radMap = {
        scapula: 'ร้าวไปสะบัก/หลัง',
        neck_jaw: 'ร้าวขึ้นคอ/กราม/คาง',
        abdomen: 'ร้าวลงท้อง/ลิ้นปี่',
        left_arm_shoulder: 'ร้าวลงไหล่ซ้าย/แขนซ้าย',
        none: 'ไม่มีอาการปวดร้าว'
      };

      const charMap = {
        crushing_heavy: 'แน่นเหมือนโดนของทับหน้าอก (Crushing pressure)',
        tight_dyspneic: 'แน่นอึดอัดหายใจไม่สะดวก',
        tearing_sharp: 'เจ็บแหลมคมเหมือนถูกฉีกขาด/เสียบแทงทะลุ (Tearing/Ripping pain)',
        pleuritic_sharp: 'เจ็บแปล๊บเวลาหายใจเข้าลึกๆ หรือเวลาไอ (Pleuritic chest pain)',
        burning_heartburn: 'แสบร้อนกลางอก/เหนือลิ้นปี่ (Heartburn)',
        aching_tender: 'เจ็บระบม ตื้อๆ เมื่อขยับตัวหรือกดสัมผัส (Chest wall tenderness)'
      };

      const anginaExertionMap = {
        on_exertion: 'แน่นมากขึ้นเวลาออกแรง/เดินเร็ว/ขึ้นบันได (Exertional)',
        rest: 'แน่นขึ้นมาเองขณะนอนพักเฉยๆ (Rest angina)',
        unrelated: 'ไม่สัมพันธ์กับการออกแรง',
        unspecified: 'ไม่ระบุ'
      };

      const locsStr = patient.chestpainLocs?.map(l => locMap[l] || l).join(', ') || 'ไม่ระบุตำแหน่ง';
      const radsStr = patient.chestpainRads?.map(r => radMap[r] || r).join(', ') || 'ไม่มีอาการปวดร้าว';
      const charsStr = patient.chestpainChars?.map(c => charMap[c] || c).join(', ') || 'ไม่ระบุลักษณะ';

      const positives = [];
      const negatives = [];

      // 1. Pain profile & Ischemia (Primary descriptors stay in top HPI; not pushed to positives)
      const painScoreText = (patient.chestpainPainScore !== undefined && patient.chestpainPainScore !== null) ? `${patient.chestpainPainScore}/10` : 'ไม่ได้ระบุ';
      if (!patient.chestpainRads?.length || patient.chestpainRads.includes('none')) {
        negatives.push('ไม่มีอาการปวดร้าวไปตำแหน่งอื่น');
      }

      if (!patient.chestpainAnginaOver20m) {
        negatives.push('แน่นหน้าอกไม่เกิน 20 นาที (ทุเลาลงได้)');
      }

      if (patient.chestpainNtgHx) {
        const ntgResMap = { relief: 'อมยาใต้ลิ้นแล้วทุเลาลง', no_relief: 'อมยาใต้ลิ้นแล้วไม่ดีขึ้น (Refractory)', not_taken: 'มียาอมใต้ลิ้นแต่รอบนี้ยังไม่ได้ลองอมยา' };
        positives.push(ntgResMap[patient.chestpainNtgCurrent] || 'เคยได้รับยาอมใต้ลิ้น');
      } else {
        negatives.push('ไม่เคยได้รับยาอมใต้ลิ้น');
      }

      // 3. Associated Symptoms
      if (patient.chestpain_rf_diaphoresis) positives.push('มีเหงื่อแตกท่วมตัว ผิวหนังเย็นซีด หรือหน้ามืดคล้ายจะเป็นลม (Diaphoresis)');
      else negatives.push('ไม่มีเหงื่อแตกตัวเย็น');

      if (patient.chestpain_rf_syncope) positives.push('มีอาการวูบ เป็นลมหมดสติชั่วขณะ (Syncope)');
      else negatives.push('ไม่มีอาการวูบหรือหมดสติ');

      if (patient.chestpain_rf_dyspnea) {
        const dysMap = { continuous: 'ตลอดเวลา', on_exertion: 'เมื่อออกแรง', orthopnea: 'เมื่อนอนราบ', sudden_onset: 'ฉับพลันทันที' };
        const pStr = patient.chestpainDyspneaPatterns?.map(p => dysMap[p] || p).join(', ') || 'ไม่ระบุรูปแบบ';
        positives.push(`มีอาการหายใจหอบเหนื่อย (${pStr})`);
      } else {
        negatives.push('ปฏิเสธประวัติหอบเหนื่อย');
      }

      if (patient.chestpain_rf_orthopnea) positives.push('นอนราบไม่ได้ ต้องลุกขึ้นมานั่งหอบ (Orthopnea)');
      else negatives.push('นอนราบได้ปกติ ไม่มี Orthopnea');

      if (patient.chestpain_rf_palpitation) positives.push('มีอาการใจสั่น หัวใจเต้นเร็ว/สะดุด (Palpitations)');
      else negatives.push('ไม่มีอาการใจสั่น');

      if (patient.chestpain_rf_hemoptysis) positives.push('มีอาการไอเป็นเลือดสด (Hemoptysis)');
      else negatives.push('ไม่มีไอเป็นเลือด');

      if (patient.chestpain_rf_calf_swelling) positives.push('มีอาการขาบวมข้างเดียว หรือปวดน่องข้างเดียว (Unilateral leg swelling)');
      else negatives.push('ไม่มีขาบวมข้างเดียวหรือปวดน่องข้างเดียว');

      // 4. Associated Abdominal Pain
      if (patient.chestpain_abdpain) {
        const abLocMap = { diffuse: 'ทั่วท้อง', epigastrium: 'ใต้ลิ้นปี่', ruq: 'ขวาบน', luq: 'ซ้ายบน', periumbilical: 'รอบสะดือ', rlq: 'ขวาล่าง', llq: 'ซ้ายล่าง', suprapubic: 'ท้องน้อย' };
        const abCharMap = { burning: 'แสบร้อน', sharp_tearing: 'เสียบแทง/ฉีกขาด', crampy: 'บิดเกร็ง', dull: 'ตื้อๆ แน่นๆ' };
        const abRadMap = { back_left: 'ร้าวหลังซ้าย', back_right: 'ร้าวหลังขวา', back_mid: 'ร้าวทะลุหลังกลาง', chest: 'ร้าวขึ้นเหนือลิ้นปี่', groin_thigh_genitalia: 'ร้าวลงขาหนีบ/อวัยวะเพศ' };

        const lStr = patient.chestpainAbdpainLocs?.map(l => abLocMap[l] || l).join(', ') || 'ไม่ระบุตำแหน่ง';
        const cStr = patient.chestpainAbdpainChars?.map(c => abCharMap[c] || c).join(', ') || 'ไม่ระบุลักษณะ';
        const rStr = patient.chestpainAbdpainRads?.length > 0 ? `, ร้าวไป: ${patient.chestpainAbdpainRads.map(r => abRadMap[r] || r).join(', ')}` : '';
        positives.push(`มีอาการปวดท้องร่วมด้วย: ตำแหน่ง [${lStr}] ลักษณะ [${cStr}]${rStr}`);
      } else {
        negatives.push('ไม่มีอาการปวดท้อง');
      }

      // 5. Pulm / PE Screen
      if (patient.chestpain_pulm_travel) positives.push('ประวัตินั่งรถหรือเครื่องบินทางไกล > 4 ชม. ในช่วง 4 สัปดาห์');
      if (patient.chestpain_pulm_bedridden) positives.push('ประวัตินอนติดเตียง ผ่าตัดใหญ่ หรือเข้าเฝือกขาช่วงที่ผ่านมา');
      if (patient.chestpain_pulm_cancer_ocp) positives.push('มีประวัติโรคมะเร็ง หรือทานยาคุมกำเนิด/ฮอร์โมน');
      if (!patient.chestpain_pulm_travel && !patient.chestpain_pulm_bedridden && !patient.chestpain_pulm_cancer_ocp) {
        negatives.push('ปฏิเสธปัจจัยเสี่ยง DVT/PE (ไม่มีประวัตินั่งทางไกล/นอนติดเตียง/มะเร็ง)');
      }

      // 6. GI / GERD Screen
      if (patient.chestpain_gi_heartburn_up) positives.push('มีลมดันตีขึ้น หรือแสบร้อนเหนือลิ้นปี่');
      if (patient.chestpain_gi_regurgitation) positives.push('มีขย้อนเปรี้ยว / เรอเปรี้ยว น้ำรสเปรี้ยวขมไหลย้อน');
      if (patient.chestpain_gi_post_meal) positives.push('จุกแน่นหลังรับประทานอาหารมื้อใหญ่หรือเมื่อนอนราบ');
      if (patient.chestpain_gi_dysphagia) positives.push('มีอาการกลืนลำบาก หรือกลืนเจ็บ');
      if (patient.chestpain_gi_severe_emesis) positives.push('มีอาการคลื่นไส้อาเจียนรุนแรงนำมาก่อนเจ็บแน่นหน้าอก');
      if (!patient.chestpain_gi_heartburn_up && !patient.chestpain_gi_regurgitation && !patient.chestpain_gi_severe_emesis) {
        negatives.push('ปฏิเสธประวัติขย้อนเปรี้ยว/ลมดันตีขึ้น หรืออาเจียนรุนแรงก่อนเจ็บอก');
      }

      // 7. MSK / Chest Wall
      if (patient.chestpain_msk_tender) positives.push('มีจุดกดเจ็บบนกระดูกซี่โครง/ผนังอกชัดเจน (Point tenderness)');
      if (patient.chestpain_msk_movement) positives.push('เจ็บมากขึ้นเวลาเอี้ยวตัว บิดตัว หรือขยับทรวงอก');
      if (patient.chestpain_msk_heavy_lifting) positives.push('มีประวัติยกของหนักหรือบิดผิดท่าก่อนเริ่มเจ็บอก');
      if (patient.chestpain_msk_trauma) positives.push(`มีประวัติอุบัติเหตุ: "${patient.chestpainTraumaDetail || 'ไม่ระบุรายละเอียด'}"`);
      if (!patient.chestpain_msk_tender && !patient.chestpain_msk_trauma) {
        negatives.push('ไม่มีจุดกดเจ็บชัดเจนบนผนังอก และปฏิเสธประวัติอุบัติเหตุ');
      }

      if (patient.otherSymptomsFree) {
        positives.push(`อาการเพิ่มเติมที่ผู้ป่วยระบุ: "${patient.otherSymptomsFree}"`);
      }

      patient.pertinentPositives = positives.length > 0 ? positives : ['ไม่มีอาการร่วมผิดปกติ'];
      patient.pertinentNegatives = negatives;

      // CAD Background string
      let cadSummary = 'ปฏิเสธประวัติโรคหลอดเลือดหัวใจเดิม';
      if (patient.underlying?.some(u => u.includes('หลอดเลือดหัวใจ') || u.includes('CAD'))) {
        if (patient.ud_cad_hosp_status === 'ratchaburi') {
          cadSummary = 'มีประวัติรักษาโรคหลอดเลือดหัวใจเดิมกับ รพ.ราชบุรี ครบถ้วน';
        } else {
          const txArr = [];
          if (patient.ud_cad_pci) txArr.push('เคยทำบอลลูนใส่ขดลวด (PCI/Stent)');
          if (patient.ud_cad_cabg) txArr.push('เคยผ่าตัดบายพาส (CABG)');
          if (patient.ud_cad_meds) txArr.push('รักษาด้วยยาควบคุมอาการ');
          cadSummary = `รักษาจาก รพ.อื่น [${patient.ud_cad_hosp_name || 'ไม่ระบุชื่อ รพ.'}] ประวัติการรักษา: ${txArr.join(', ') || 'ไม่ระบุหัตถการ'}`;
        }
      }

      // High-risk Contraindications summary strings
      const absoluteList = [];
      const relativeList = [];
      if (patient.ci_ich_tumor_avm) absoluteList.push('เคยมีเลือดออกในสมอง/เนื้องอก/AVM');
      if (patient.ci_ischemic_stroke === 'within_3m') absoluteList.push('Ischemic Stroke < 3 เดือน');
      if (patient.ci_cns_surgery_3m) absoluteList.push('ผ่าตัดสมอง/ไขสันหลัง < 3 เดือน');
      if (patient.ci_major_surgery_3w) absoluteList.push('ผ่าตัดใหญ่ < 3 สัปดาห์');
      if (patient.ci_head_facial_trauma_3m) absoluteList.push('บาดเจ็บรุนแรงศีรษะ/ใบหน้า < 3 เดือน');
      if (patient.ci_internal_bleeding === 'current_active') absoluteList.push('แผลเลือดออกภายใน/ทางเดินอาหารที่กำลังดำเนินอยู่');
      if (patient.chestpainChars?.includes('tearing_sharp')) absoluteList.push('สงสัย Aortic Dissection');

      if (patient.ci_ischemic_stroke === '3_to_6m') relativeList.push('Ischemic Stroke 3-6 เดือน');
      if (patient.ci_internal_bleeding === 'within_1m') relativeList.push('เลือดออกภายใน/ทางเดินอาหาร < 1 เดือน');
      if (patient.ci_prior_fibrinolytic) relativeList.push('เคยได้รับยาสลายลิ่มเลือดมาก่อน');
      if (patient.ci_coagulopathy_anticoagulant) relativeList.push('เลือดออกผิดปกติ/ทานยา Warfarin');
      if (patient.ci_pregnancy_postpartum_1w) relativeList.push('ตั้งครรภ์/หลังคลอด < 1 สัปดาห์');

      const hospLabel = {
        complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
        additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
        self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
        unspecified: 'ไม่ได้ระบุ'
      }[patient.hospRecordStatus] || 'ไม่ได้ระบุ';

      const docNotes = patient.doctor_notes || {};
      const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ' || patient.currentMeds === 'ไม่มี') ? 'ไม่มี' : patient.currentMeds;

      // A) Rapid Bullet Format for Chest Pain
      const defaultRapid = 
`[Chief Complaint (CC)]
เจ็บแน่นหน้าอกมา ${durationText}

[History of Present Illness (HPI)]
• การเริ่มต้นและระยะเวลา: แน่นมา ${durationText}, ${onsetMap[patient.chestpainOnsetMode] || 'ไม่ระบุ'}
• ตำแหน่งและอาการร้าว: ตำแหน่ง [${locsStr}], ร้าวไป: [${radsStr}]
• ลักษณะอาการแน่น/เจ็บ: ${charsStr}
• ระดับความปวด (Pain Score): ${painScoreText}
• ลักษณะ Angina: ${anginaExertionMap[patient.chestpainAnginaExertion] || 'ไม่ระบุ'}, ${patient.chestpainAnginaOver20m ? 'แน่นต่อเนื่อง > 20 นาที' : 'แน่นไม่เกิน 20 นาที'}

• Pertinent Positives:
${positives.length > 0 ? positives.map(p => `  - ${p}`).join('\n') : '  - ไม่มีอาการร่วมอื่นที่เด่นชัด'}

• Pertinent Negatives:
${negatives.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• โรคหลอดเลือดหัวใจเดิม (CAD Background): ${cadSummary}
• โรคประจำตัว (U/D): ${patient.underlying?.length > 0 ? patient.underlying.join(', ') : 'ปฏิเสธ'}
• ยาประจำตัว (Current Meds): ${medsText}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${patient.drugAllergy || 'ปฏิเสธ'}
• Fibrinolytic Absolute CI: ${absoluteList.length > 0 ? absoluteList.join(', ') : 'ไม่พบข้อห้ามเด็ดขาด (No Absolute CI)'}
• Fibrinolytic Relative CI: ${relativeList.length > 0 ? relativeList.join(', ') : 'ไม่พบข้อห้ามสัมพัทธ์ (No Relative CI)'}
• Nitroglycerin Safety: ${patient.ci_pde5_inhibitor ? '🚫 CONTRAINDICATED (มีประวัติใช้ PDE-5 inhibitor ใน 24-48 ชม.)' : '✓ ปลอดภัย (ปฏิเสธ PDE-5 inhibitor)'}

[Emergency Risk Assessment (Red Flags)]
${patient.redFlags?.length > 0
  ? `🚩 RED FLAGS DETECTED:\n${patient.redFlags.map(rf => `  * ${rf.textTh}`).join('\n')}`
  : '✓ ไม่พบสัญญาณวิกฤต (No Immediate Red Flag)'}

[Doctor's Clinical Addendum & Exam]
• ประวัติเพิ่มเติม/แก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}
• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}
• แผนการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

      // B) Narrative Paragraph Format for Chest Pain
      const defaultNarrative = 
`ผู้ป่วย [${patient.name}] อายุ ${patient.age || '-'} ปี เพศ ${patient.gender || 'ไม่ระบุ'} มารับการตรวจที่ห้องฉุกเฉิน รพ.ราชบุรี ด้วยอาการเจ็บแน่นหน้าอกมา ${durationText}
การเริ่มเจ็บ: ${onsetMap[patient.chestpainOnsetMode] || 'ไม่ระบุ'} ตำแหน่งเจ็บชัดเจนที่สุด: ${locsStr} ลักษณะเจ็บ: ${charsStr} ระดับความเจ็บปวด (Pain Score): ${painScoreText} ${patient.chestpainRads?.length > 0 && !patient.chestpainRads.includes('none') ? `มีอาการปวดร้าวไปที่ ${radsStr}` : 'ไม่มีอาการปวดร้าว'} การสัมพันธ์กับการออกแรง: ${anginaExertionMap[patient.chestpainAnginaExertion] || 'ไม่ระบุ'} ${patient.chestpainAnginaOver20m ? 'แน่นต่อเนื่องเกิน 20 นาที' : 'แน่นไม่เกิน 20 นาที'}

อาการร่วมและการซักประวัติตามระบบ: ผู้ป่วยให้ประวัติ ${positives.join(', ')}
อาการสำคัญที่ปฏิเสธ (Pertinent negatives): ${negatives.join(', ')}

ประวัติการเจ็บป่วยในอดีต: [${hospLabel}] ประวัติ CAD เดิม: ${cadSummary}, โรคประจำตัว: ${patient.underlying?.length > 0 ? patient.underlying.join(', ') : 'ปฏิเสธ'}, ยาประจำตัว: ${medsText}, ประวัติแพ้ยา/แพ้อาหาร: ${patient.drugAllergy || 'ปฏิเสธประวัติแพ้ยา/แพ้อาหาร'}
การคัดกรองข้อห้ามใช้ยาฉุกเฉิน: ข้อห้ามยาสลายลิ่มเลือด (Absolute: ${absoluteList.join(', ') || 'ไม่มี'}, Relative: ${relativeList.join(', ') || 'ไม่มี'}), ข้อห้ามยา Nitroglycerin: ${patient.ci_pde5_inhibitor ? 'มีข้อห้ามเนื่องจากใช้ยากลุ่ม PDE-5 inhibitor' : 'ไม่มีข้อห้าม'}
${patient.redFlags?.length > 0 ? `\n[🚩 แจ้งเตือนสัญญาณวิกฤต (Red Flags)]: ตรวจพบอาการ ${patient.redFlags.map(rf => rf.textTh).join(', ')}` : ''}

[บันทึกการตรวจและการประเมินโดยแพทย์]:
${docNotes.additional_hpi ? `• ประวัติเพิ่มเติม: ${docNotes.additional_hpi}\n` : ''}${docNotes.physical_exam ? `• การตรวจร่างกาย: ${docNotes.physical_exam}\n` : ''}${docNotes.preliminary_dx ? `• การวินิจฉัย: ${docNotes.preliminary_dx}\n` : ''}${docNotes.plan ? `• แผนการรักษา: ${docNotes.plan}` : ''}`;

      document.getElementById('rapidTextView').value = patient.custom_rapid_note || defaultRapid;
      document.getElementById('narrativeTextView').value = patient.custom_narrative_note || defaultNarrative;

      // C) JSON Payload for Chest Pain
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
        "chief_complaint": "chest_pain",
        "chest_pain_history": {
          "duration_value": patient.durationVal || null,
          "duration_unit": patient.durationUnit || null,
          "pain_score": (patient.chestpainPainScore !== undefined && patient.chestpainPainScore !== null) ? patient.chestpainPainScore : null,
          "onset_mode": patient.chestpainOnsetMode,
          "pain_locations": patient.chestpainLocs,
          "pain_radiation": patient.chestpainRads,
          "pain_characteristics": patient.chestpainChars,
          "angina_evaluation": {
            "exertion_relation": patient.chestpainAnginaExertion,
            "duration_over_20_mins": patient.chestpainAnginaOver20m,
            "sublingual_ntg_history": patient.chestpainNtgHx,
            "sublingual_ntg_response": patient.chestpainNtgCurrent
          }
        },
        "associated_symptoms_and_review_of_systems": {
          "diaphoresis": patient.chestpain_rf_diaphoresis,
          "syncope": patient.chestpain_rf_syncope,
          "dyspnea": {
            "present": patient.chestpain_rf_dyspnea,
            "patterns": patient.chestpainDyspneaPatterns
          },
          "orthopnea": patient.chestpain_rf_orthopnea,
          "palpitations": patient.chestpain_rf_palpitation,
          "hemoptysis": patient.chestpain_rf_hemoptysis,
          "unilateral_calf_swelling": patient.chestpain_rf_calf_swelling,
          "associated_abdominal_pain": {
            "present": patient.chestpain_abdpain,
            "locations": patient.chestpainAbdpainLocs,
            "characteristics": patient.chestpainAbdpainChars,
            "radiation": patient.chestpainAbdpainRads
          },
          "pulmonary_embolism_risk_screen": {
            "prolonged_travel_over_4hr": patient.chestpain_pulm_travel,
            "recent_immobilization_or_surgery": patient.chestpain_pulm_bedridden,
            "malignancy_or_hormone_therapy": patient.chestpain_pulm_cancer_ocp
          },
          "gastrointestinal_gerd_screen": {
            "heartburn_or_upward_gas": patient.chestpain_gi_heartburn_up,
            "acid_regurgitation": patient.chestpain_gi_regurgitation,
            "postprandial_or_recumbent": patient.chestpain_gi_post_meal,
            "dysphagia": patient.chestpain_gi_dysphagia,
            "severe_emesis_preceding_pain": patient.chestpain_gi_severe_emesis
          },
          "musculoskeletal_chest_wall": {
            "point_tenderness_on_ribs": patient.chestpain_msk_tender,
            "worse_with_torso_movement": patient.chestpain_msk_movement,
            "heavy_lifting_or_twisting_history": Boolean(patient.chestpain_msk_heavy_lifting),
            "trauma_history": {
              "present": patient.chestpain_msk_trauma,
              "trauma_details": patient.chestpainTraumaDetail
            }
          },
          "other_symptoms_free_text": patient.otherSymptomsFree || ""
        },
        "high_risk_medication_contraindications": {
          "fibrinolytic_absolute_contraindications": absoluteList,
          "fibrinolytic_relative_contraindications": relativeList,
          "nitroglycerin_contraindicated_pde5_use": Boolean(patient.ci_pde5_inhibitor)
        },
        "red_flags_detected": patient.redFlags?.map(rf => ({ code: rf.key, label: rf.textTh, clinical_risk: rf.risk })) || [],
        "pertinent_positives": positives,
        "pertinent_negatives": negatives,
        "patient_background": {
          "hospital_record_status": patient.hospRecordStatus,
          "coronary_artery_disease_background": {
            "known_cad": patient.underlying?.some(u => u.includes('หลอดเลือดหัวใจ') || u.includes('CAD')),
            "ratchaburi_hospital_record": patient.ud_cad_hosp_status === 'ratchaburi',
            "prior_pci_stent": Boolean(patient.ud_cad_pci),
            "prior_cabg": Boolean(patient.ud_cad_cabg),
            "medical_therapy_only": Boolean(patient.ud_cad_meds),
            "original_hospital_name": patient.ud_cad_hosp_name || ""
          },
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
    // OUTPUT GENERATION: ปวดท้อง (Abdominal Pain)

registerCcModule({
  id: 'chestpain',
  recordCc: 'chest_pain',
  titleTh: 'เจ็บแน่นหน้าอก',
  titleEn: 'Chest pain',
  sectionDomId: 'chestpainQuestionnaireSection',
  doctorCcBadgeHtml: "<i data-lucide=\"heart\" class=\"w-3 h-3 mr-1\"></i> CC: เจ็บแน่นหน้าอก (Chest pain)",
  formHtml: "        <div id=\"chestpainQuestionnaireSection\" class=\"hidden space-y-6\">\n\n          <!-- CARD 1: OPQRST & Pain Profile -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"clock\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-900\">1. ระยะเวลา ตำแหน่ง และลักษณะการเจ็บหน้าอก</h2>\n                <p class=\"text-xs text-slate-500\">ข้อมูลเริ่มต้นเกี่ยวกับอาการเจ็บแน่นหน้าอกของท่าน</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-5\">\n              <!-- Onset & Duration -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">\n                  เจ็บแน่นหน้าอกมานานเท่าไรแล้ว? <span class=\"text-rose-500\">*</span>\n                </label>\n                <div class=\"grid grid-cols-2 sm:grid-cols-3 gap-3\">\n                  <div class=\"col-span-1 sm:col-span-2\">\n                    <input type=\"number\" id=\"chestpainDurationVal\" min=\"1\" max=\"1000\"\n                      class=\"w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm placeholder:text-slate-400 placeholder:font-normal\"\n                      placeholder=\"เช่น 1 หรือ 30\">\n                  </div>\n                  <div class=\"col-span-1\">\n                    <select id=\"chestpainDurationUnit\"\n                      class=\"w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm\">\n                      <option value=\"minutes\">นาที</option>\n                      <option value=\"hours\" selected>ชั่วโมง</option>\n                      <option value=\"days\">วัน</option>\n                      <option value=\"weeks\">สัปดาห์</option>\n                      <option value=\"months\">เดือน</option>\n                      <option value=\"years\">ปี</option>\n                    </select>\n                  </div>\n                </div>\n              </div>\n\n              <!-- Onset Mode -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">\n                  การเริ่มมีอาการเจ็บหน้าอกในครั้งนี้เกิดขึ้นอย่างไร?\n                </label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"chestpainOnsetMode\" value=\"sudden_peak\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">เจ็บรุนแรงทันทีทันใดในไม่กี่วินาที</span>\n                      <span class=\"text-[11px] text-slate-500\">รุนแรงสูงสุดตั้งแต่แรกเริ่ม (Sudden onset)</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"chestpainOnsetMode\" value=\"gradual\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ค่อยๆ แน่นหรือเจ็บมากขึ้นเรื่อยๆ</span>\n                      <span class=\"text-[11px] text-slate-500\">ค่อยๆ ทวีความรุนแรงขึ้นช้าๆ (Gradual worsening)</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"chestpainOnsetMode\" value=\"intermittent\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">เป็นๆ หายๆ แน่นเป็นพักๆ</span>\n                      <span class=\"text-[11px] text-slate-500\">มีช่วงเวลาที่อาการทุเลาลง (Intermittent)</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"chestpainOnsetMode\" value=\"chronic_stable\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">มีอาการเรื้อรัง</span>\n                      <span class=\"text-[11px] text-slate-500\">เจ็บเวลาเหนื่อย หรือ เจ็บเท่าๆเดิมมานาน</span>\n                    </div>\n                  </label>\n                </div>\n              </div>\n\n              <!-- Location (ข้อ 2: เพิ่ม อกขวา, ทั่วๆ) -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">\n                  ตำแหน่งที่รู้สึกเจ็บชัดเจนที่สุด (เลือกได้หลายข้อ)\n                </label>\n                <div class=\"grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs\">\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"chestpain_loc\" value=\"substernal\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800\">กลางหน้าอก / หลังกระดูกอก</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"chestpain_loc\" value=\"left_chest\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800\">อกซ้าย</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"chestpain_loc\" value=\"right_chest\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800\">อกขวา</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"chestpain_loc\" value=\"epigastrium\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800\">ใต้ลิ้นปี่ / เหนือลิ้นปี่</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer col-span-2 sm:col-span-1\">\n                    <input type=\"checkbox\" name=\"chestpain_loc\" value=\"diffuse\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800\">ทั่วๆ ทั้งหน้าอก (ระบุจุดไม่ได้)</span>\n                  </label>\n                </div>\n              </div>\n\n              <!-- Radiation (ข้อ 3: สะบัก, คอ, ท้อง) -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">\n                  มีอาการเจ็บร้าว (กระจาย) ไปยังตำแหน่งอื่นร่วมด้วยหรือไม่? (เลือกได้หลายข้อ)\n                </label>\n                <div class=\"grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs\">\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"chestpain_rad\" value=\"scapula\" onchange=\"handleChestpainRadChange()\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800\">ร้าวไปสะบัก / หลัง</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"chestpain_rad\" value=\"neck_jaw\" onchange=\"handleChestpainRadChange()\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800\">ร้าวขึ้นคอ / กราม / คาง</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"chestpain_rad\" value=\"abdomen\" onchange=\"handleChestpainRadChange()\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800\">ร้าวลงท้อง / ลิ้นปี่</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"chestpain_rad\" value=\"left_arm_shoulder\" onchange=\"handleChestpainRadChange()\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800\">ร้าวลงไหล่ซ้าย / แขนซ้าย</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"chestpain_rad\" value=\"none\" onchange=\"handleChestpainRadChange()\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800\">ไม่มีอาการปวดร้าว</span>\n                  </label>\n                  <label class=\"selectable-card p-2.5 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" id=\"chestpain_rad_other_chk\" onchange=\"toggleOtherInput('chestpain_rad_other_wrap', this.checked); handleChestpainRadChange();\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800\">อื่นๆ (ระบุ)</span>\n                  </label>\n                </div>\n                <div id=\"chestpain_rad_other_wrap\" class=\"hidden mt-2\">\n                  <input type=\"text\" id=\"chestpain_rad_other_text\" placeholder=\"ระบุตำแหน่งที่เจ็บร้าวไปเพิ่มเติม...\" class=\"w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white\">\n                </div>\n              </div>\n\n              <!-- Character (ข้อ 1: แน่นเหมือนโดนของทับหน้าอก, แน่นอึดอัดหายใจไม่สะดวก) -->\n              <div>\n                <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">\n                  ลักษณะความรู้สึกเจ็บหน้าอก (เลือกได้หลายข้อ)\n                </label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"chestpain_char\" value=\"crushing_heavy\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">แน่นเหมือนโดนของทับหน้าอก</span>\n                      <span class=\"text-[11px] text-slate-500\">อึดอัดเหมือนมีเข็มขัดรัดแน่นกลางอก</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"chestpain_char\" value=\"tight_dyspneic\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">แน่นอึดอัดหายใจไม่สะดวก</span>\n                      <span class=\"text-[11px] text-slate-500\">รู้สึกหายใจได้ไม่เต็มปอด แน่นทั่วอก</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"chestpain_char\" value=\"tearing_sharp\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">เจ็บแหลมคมเหมือนถูกฉีกขาด / เสียบแทง</span>\n                      <span class=\"text-[11px] text-slate-500\">เจ็บแทงทะลุอย่างรุนแรงทันทีทันใด</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"chestpain_char\" value=\"pleuritic_sharp\" onchange=\"handleChestpainCharChange()\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">เจ็บแปล๊บเวลาหายใจเข้าลึกๆ หรือเวลาไอ</span>\n                      <span class=\"text-[11px] text-slate-500\">เจ็บสัมพันธ์กับจังหวะการขยายของปอด</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"chestpain_char\" value=\"burning_heartburn\" onchange=\"handleChestpainCharChange()\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">แสบร้อนกลางอก / เหนือลิ้นปี่</span>\n                      <span class=\"text-[11px] text-slate-500\">รู้สึกร้อนวูบวาบขึ้นมาตามหลอดอาหาร</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"chestpain_char\" value=\"aching_tender\" onchange=\"handleChestpainCharChange()\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">เจ็บระบม ตื้อๆ เมื่อขยับตัวหรือกดโดน</span>\n                      <span class=\"text-[11px] text-slate-500\">มีจุดเจ็บชัดเจนเวลาเอี้ยวตัวหรือใช้มือกด</span>\n                    </div>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer sm:col-span-2\">\n                    <input type=\"checkbox\" id=\"chestpain_char_other_chk\" onchange=\"toggleOtherInput('chestpain_char_other_wrap', this.checked); handleChestpainCharChange();\" class=\"rounded text-medical-600 h-4 w-4\">\n                    <div class=\"ml-2.5\">\n                      <span class=\"font-semibold text-slate-800 block\">ลักษณะอื่นๆ (ระบุ)</span>\n                      <span class=\"text-[11px] text-slate-500\">ระบุลักษณะความรู้สึกเจ็บหน้าอกเพิ่มเติม</span>\n                    </div>\n                  </label>\n                </div>\n                <div id=\"chestpain_char_other_wrap\" class=\"hidden mt-2\">\n                  <input type=\"text\" id=\"chestpain_char_other_text\" placeholder=\"ระบุลักษณะความรู้สึกเจ็บหน้าอกเพิ่มเติม...\" class=\"w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white\">\n                </div>\n              </div>\n\n              <!-- ข้อ 5: Pain Score Scale (0-10) with Emoji Faces -->\n              <div class=\"bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3\">\n                <div class=\"flex flex-col sm:flex-row sm:items-center justify-between gap-2\">\n                  <label class=\"block text-xs font-semibold text-slate-800 uppercase tracking-wider\">\n                    ระดับความเจ็บปวดในขณะนี้ (Pain Score: 0 - 10)\n                  </label>\n                  <div class=\"flex items-center space-x-2\">\n                    <span id=\"chestpainPainScoreBadge\" class=\"inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all\">\n                      <span id=\"chestpainPainScoreEmoji\" class=\"text-base\">⚪</span>\n                      <span id=\"chestpainPainScoreText\">ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)</span>\n                    </span>\n                    <button type=\"button\" id=\"chestpainPainScoreClearBtn\" onclick=\"clearChestpainPainScore()\" class=\"text-xs text-slate-400 hover:text-rose-600 underline hidden transition\" title=\"ล้างค่าเพื่อให้เป็นไม่ได้ระบุ\">ล้างค่า</button>\n                  </div>\n                </div>\n\n                <!-- Range Slider -->\n                <div class=\"px-1 pt-1\">\n                  <input type=\"range\" id=\"chestpainPainScore\" min=\"0\" max=\"10\" value=\"0\" step=\"1\"\n                    oninput=\"handleChestpainPainScoreChange(this.value)\"\n                    class=\"w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-600 focus:outline-none focus:ring-2 focus:ring-medical-500\">\n                </div>\n\n                <!-- Visual Emoji Scale Guide -->\n                <div class=\"grid grid-cols-5 text-center text-[10px] sm:text-[11px] pt-1 gap-1 text-slate-500 font-medium\">\n                  <div class=\"cursor-pointer hover:text-medical-600 transition\" onclick=\"setChestpainPainScore(0)\">\n                    <span class=\"text-lg sm:text-xl block\">😊</span>\n                    <span>0: สบายดี</span>\n                  </div>\n                  <div class=\"cursor-pointer hover:text-medical-600 transition\" onclick=\"setChestpainPainScore(2)\">\n                    <span class=\"text-lg sm:text-xl block\">🙂</span>\n                    <span>1-3: เล็กน้อย</span>\n                  </div>\n                  <div class=\"cursor-pointer hover:text-medical-600 transition\" onclick=\"setChestpainPainScore(5)\">\n                    <span class=\"text-lg sm:text-xl block\">😐</span>\n                    <span>4-6: ปานกลาง</span>\n                  </div>\n                  <div class=\"cursor-pointer hover:text-medical-600 transition\" onclick=\"setChestpainPainScore(8)\">\n                    <span class=\"text-lg sm:text-xl block\">😣</span>\n                    <span>7-9: ปวดมาก</span>\n                  </div>\n                  <div class=\"cursor-pointer hover:text-medical-600 transition\" onclick=\"setChestpainPainScore(10)\">\n                    <span class=\"text-lg sm:text-xl block\">😭</span>\n                    <span>10: ปวดรุนแรงที่สุด</span>\n                  </div>\n                </div>\n              </div>\n\n            </div>\n          </div>\n\n          <!-- CARD 2: การประเมินภาวะหัวใจขาดเลือด (ข้อ 4: ถามในทุกเคส!) -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"heart\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-900\">2. แบบประเมินความเสี่ยงโรคหัวใจขาดเลือด</h2>\n                <p class=\"text-xs text-slate-500\">คำถามสำคัญเพื่อประเมินความเสี่ยงกล้ามเนื้อหัวใจขาดเลือดเฉียบพลันสำหรับผู้ป่วยทุกราย</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4 text-xs\">\n              <!-- Exertion vs Rest -->\n              <div>\n                <label class=\"block font-semibold text-slate-700 uppercase tracking-wider mb-2\">\n                  อาการแน่นหน้าอกสัมพันธ์กับการออกแรงอย่างไร?\n                </label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2\">\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"chestpainAnginaExertion\" value=\"on_exertion\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800\">แน่นมากขึ้นเวลาออกแรง / เดินเร็ว / ขึ้นบันได</span>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"chestpainAnginaExertion\" value=\"rest\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-semibold text-slate-800\">แน่นขึ้นมาเองแม้ขณะนอนพักเฉยๆ (Rest angina)</span>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"chestpainAnginaExertion\" value=\"unrelated\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800\">ไม่สัมพันธ์กับการออกกำลังกาย</span>\n                  </label>\n                </div>\n              </div>\n\n              <!-- Over 20 min -->\n              <div>\n                <label class=\"block font-semibold text-slate-700 uppercase tracking-wider mb-2\">\n                  อาการแน่นหน้าอกในแต่ละระลอก เป็นนานต่อเนื่องเกิน 20 นาทีหรือไม่?\n                </label>\n                <div class=\"grid grid-cols-2 gap-2\">\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"chestpainAnginaOver20m\" value=\"yes\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-semibold text-slate-800\">ใช่ แน่นต่อเนื่องนานเกิน 20 นาที</span>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"chestpainAnginaOver20m\" value=\"no\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800\">ไม่ใช่ แน่นสั้นๆ ไม่กี่นาทีแล้วทุเลา</span>\n                  </label>\n                </div>\n              </div>\n\n              <!-- Sublingual NTG History -->\n              <div>\n                <label class=\"block font-semibold text-slate-700 uppercase tracking-wider mb-2\">\n                  ท่านเคยมีประวัติได้รับ \"ยาอมใต้ลิ้น\" สำหรับขยายหลอดเลือดหัวใจหรือไม่?\n                </label>\n                <div class=\"grid grid-cols-2 gap-2 mb-2\">\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"chestpainNtgHx\" value=\"yes\" onchange=\"toggleBranch('chestpain_ntg_current_wrap', true)\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-semibold text-slate-800\">เคยได้รับยาอมใต้ลิ้น</span>\n                  </label>\n                  <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                    <input type=\"radio\" name=\"chestpainNtgHx\" value=\"no\" onchange=\"toggleBranch('chestpain_ntg_current_wrap', false)\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                    <span class=\"ml-2 font-medium text-slate-800\">ไม่เคยได้รับยาอมใต้ลิ้น</span>\n                  </label>\n                </div>\n\n                <div id=\"chestpain_ntg_current_wrap\" class=\"hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2\">\n                  <label class=\"font-semibold text-slate-800 block\">ในการเจ็บหน้าอกรอบนี้ ท่านได้ลองอมยาใต้ลิ้นหรือไม่?</label>\n                  <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2\">\n                    <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"radio\" name=\"chestpainNtgCurrent\" value=\"not_taken\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium text-slate-700\">ยังไม่ได้ลองอมยา</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"radio\" name=\"chestpainNtgCurrent\" value=\"relief\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium text-slate-700\">อมยาแล้วอาการทุเลาลง</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"radio\" name=\"chestpainNtgCurrent\" value=\"no_relief\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium text-slate-700\">อมยาแล้วอาการไม่ดีขึ้น</span>\n                    </label>\n                  </div>\n                </div>\n              </div>\n\n            </div>\n          </div>\n\n          <!-- CARD 3: อาการร่วมและกิ่งเจาะลึก (ข้อ 7: เปลี่ยนชื่อเป็น อาการร่วม และเพิ่ม ปวดท้อง) -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n                <i data-lucide=\"activity\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-900\">3. อาการร่วม (Associated Symptoms)</h2>\n                <p class=\"text-xs text-slate-500\">เลือกอาการที่ท่านมีร่วมด้วย เพื่อช่วยให้แพทย์ระบุสาเหตุได้อย่างแม่นยำ</p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4\">\n              <!-- Checklist อาการร่วม 8 ข้อ -->\n              <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                  <input type=\"checkbox\" id=\"chestpain_rf_diaphoresis\" onchange=\"checkChestpainHighRiskMedTrigger()\" class=\"rounded text-medical-600 h-4 w-4\">\n                  <span class=\"ml-2.5 font-medium text-slate-800\">มีเหงื่อแตกท่วมตัว ผิวหนังเย็นซีด หรือหน้ามืดคล้ายจะเป็นลม</span>\n                </label>\n                <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                  <input type=\"checkbox\" id=\"chestpain_rf_syncope\" onchange=\"checkChestpainHighRiskMedTrigger()\" class=\"rounded text-medical-600 h-4 w-4\">\n                  <span class=\"ml-2.5 font-medium text-slate-800\">วูบ เป็นลมหมดสติชั่วขณะ หรือทรงตัวไม่อยู่</span>\n                </label>\n                <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                  <input type=\"checkbox\" id=\"chestpain_rf_dyspnea\" onchange=\"toggleBranch('chestpain_dyspnea_wrap', this.checked); handleChestpainCharChange(); checkChestpainHighRiskMedTrigger();\" class=\"rounded text-medical-600 h-4 w-4\">\n                  <span class=\"ml-2.5 font-medium text-slate-800\">หายใจหอบเหนื่อย</span>\n                </label>\n                <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                  <input type=\"checkbox\" id=\"chestpain_rf_orthopnea\" class=\"rounded text-medical-600 h-4 w-4\">\n                  <span class=\"ml-2.5 font-medium text-slate-800\">นอนราบไม่ได้ ต้องลุกขึ้นมานั่งหอบ</span>\n                </label>\n                <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                  <input type=\"checkbox\" id=\"chestpain_rf_palpitation\" class=\"rounded text-medical-600 h-4 w-4\">\n                  <span class=\"ml-2.5 font-medium text-slate-800\">ใจสั่น หัวใจเต้นเร็วมาก หรือเต้นสะดุดผิดจังหวะ</span>\n                </label>\n                <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                  <input type=\"checkbox\" id=\"chestpain_rf_hemoptysis\" onchange=\"handleChestpainCharChange()\" class=\"rounded text-medical-600 h-4 w-4\">\n                  <span class=\"ml-2.5 font-medium text-slate-800\">ไอมีเสมหะปนเลือดสด</span>\n                </label>\n                <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                  <input type=\"checkbox\" id=\"chestpain_rf_calf_swelling\" onchange=\"handleChestpainCharChange()\" class=\"rounded text-medical-600 h-4 w-4\">\n                  <span class=\"ml-2.5 font-medium text-slate-800\">ขาบวมข้างเดียว หรือปวดน่องข้างเดียว</span>\n                </label>\n                <label class=\"selectable-card p-3 rounded-xl flex items-center cursor-pointer\">\n                  <input type=\"checkbox\" id=\"chestpain_abdpain\" onchange=\"toggleBranch('chestpain_abdpain_wrap', this.checked); handleChestpainCharChange();\" class=\"rounded text-medical-600 h-4 w-4\">\n                  <span class=\"ml-2.5 font-semibold text-slate-800\">มีอาการปวดท้องร่วมด้วย</span>\n                </label>\n              </div>\n\n              <!-- กิ่งเจาะลึกความเหนื่อย (ข้อ 8) -->\n              <div id=\"chestpain_dyspnea_wrap\" class=\"hidden bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs\">\n                <div class=\"font-bold text-slate-800 flex items-center\">\n                  <i data-lucide=\"wind\" class=\"w-4 h-4 mr-1.5 text-medical-600\"></i>\n                  <span>เจาะลึกอาการหายใจเหนื่อย (เลือกได้หลายข้อ):</span>\n                </div>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2\">\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"chestpain_dyspnea_pattern\" value=\"continuous\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium text-slate-700\">เหนื่อยตลอดเวลา แม้อยู่เฉยๆ</span>\n                  </label>\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"chestpain_dyspnea_pattern\" value=\"on_exertion\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium text-slate-700\">เหนื่อยเฉพาะเวลาออกแรงหรือเดิน</span>\n                  </label>\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"chestpain_dyspnea_pattern\" value=\"orthopnea\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium text-slate-700\">เหนื่อยมากขึ้นเวลานอนราบ ต้องหนุนหมอนสูงหรือลุกนั่ง</span>\n                  </label>\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"chestpain_dyspnea_pattern\" value=\"sudden_onset\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium text-slate-700\">เหนื่อยหอบเฉียบพลันทันทีทันใดในไม่กี่นาที</span>\n                  </label>\n                </div>\n              </div>\n\n              <!-- กิ่งเจาะลึกปวดท้อง (ข้อ 8: ยกรูปแบบจาก CC ไข้มาใช้) -->\n              <div id=\"chestpain_abdpain_wrap\" class=\"hidden bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs\">\n                <div class=\"font-bold text-slate-800 flex items-center\">\n                  <i data-lucide=\"utensils\" class=\"w-4 h-4 mr-1.5 text-medical-600\"></i>\n                  <span>เจาะลึกอาการปวดท้องที่พบร่วมด้วย:</span>\n                </div>\n                \n                <!-- ตำแหน่งปวดท้อง -->\n                <div>\n                  <label class=\"block font-semibold text-slate-700 mb-1.5\">ตำแหน่งที่ปวดท้อง (เลือกได้หลายข้อ):</label>\n                  <div class=\"grid grid-cols-2 sm:grid-cols-4 gap-2\">\n                    <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"checkbox\" name=\"chestpain_abdpain_loc\" value=\"epigastrium\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium\">ใต้ลิ้นปี่</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"checkbox\" name=\"chestpain_abdpain_loc\" value=\"ruq\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium\">ขวาบน</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"checkbox\" name=\"chestpain_abdpain_loc\" value=\"luq\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium\">ซ้ายบน</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"checkbox\" name=\"chestpain_abdpain_loc\" value=\"periumbilical\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium\">รอบสะดือ</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"checkbox\" name=\"chestpain_abdpain_loc\" value=\"rlq\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium\">ขวาล่าง</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"checkbox\" name=\"chestpain_abdpain_loc\" value=\"llq\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium\">ซ้ายล่าง</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"checkbox\" name=\"chestpain_abdpain_loc\" value=\"suprapubic\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium\">ท้องน้อย</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"checkbox\" name=\"chestpain_abdpain_loc\" value=\"diffuse\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium\">ทั่วท้อง</span>\n                    </label>\n                  </div>\n                </div>\n\n                <!-- ลักษณะปวดท้อง -->\n                <div>\n                  <label class=\"block font-semibold text-slate-700 mb-1.5\">ลักษณะการปวดท้อง:</label>\n                  <div class=\"grid grid-cols-2 sm:grid-cols-4 gap-2\">\n                    <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"checkbox\" name=\"chestpain_abdpain_char\" value=\"burning\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium\">แสบร้อน</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"checkbox\" name=\"chestpain_abdpain_char\" value=\"sharp_tearing\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium\">เสียบแทง/ฉีกขาด</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"checkbox\" name=\"chestpain_abdpain_char\" value=\"crampy\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium\">บิดเกร็ง</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"checkbox\" name=\"chestpain_abdpain_char\" value=\"dull\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium\">ตื้อๆ แน่นๆ</span>\n                    </label>\n                  </div>\n                </div>\n\n                <!-- การปวดร้าวของท้อง -->\n                <div>\n                  <label class=\"block font-semibold text-slate-700 mb-1.5\">การปวดร้าวจากท้อง:</label>\n                  <div class=\"grid grid-cols-2 sm:grid-cols-3 gap-2\">\n                    <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"checkbox\" name=\"chestpain_abdpain_rad\" value=\"back_left\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium\">ร้าวหลังซ้าย</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"checkbox\" name=\"chestpain_abdpain_rad\" value=\"back_right\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium\">ร้าวหลังขวา</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"checkbox\" name=\"chestpain_abdpain_rad\" value=\"back_mid\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium\">ร้าวทะลุหลังกลาง</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"checkbox\" name=\"chestpain_abdpain_rad\" value=\"chest\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium\">ร้าวขึ้นเหนือลิ้นปี่</span>\n                    </label>\n                    <label class=\"selectable-card bg-white p-2 rounded-lg flex items-center cursor-pointer\">\n                      <input type=\"checkbox\" name=\"chestpain_abdpain_rad\" value=\"groin_thigh_genitalia\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                      <span class=\"ml-2 font-medium\">ร้าวลงขาหนีบ/อวัยวะเพศ</span>\n                    </label>\n                  </div>\n                </div>\n              </div>\n\n              <!-- กิ่ง Pulm / PE screen -->\n              <div id=\"chestpain_branch_pulm\" class=\"hidden bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs\">\n                <div class=\"font-bold text-slate-800 flex items-center\">\n                  <i data-lucide=\"shield-alert\" class=\"w-4 h-4 mr-1.5 text-medical-600\"></i>\n                  <span>ประเมินความเสี่ยงต่อระบบทางเดินหายใจและลิ่มเลือดอุดกั้นปอด:</span>\n                </div>\n                <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2\">\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" id=\"chestpain_pulm_travel\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium text-slate-700\">นั่งรถ/เครื่องบินทางไกล > 4 ชม. ในช่วง 4 สัปดาห์</span>\n                  </label>\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" id=\"chestpain_pulm_bedridden\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium text-slate-700\">นอนติดเตียง ผ่าตัดใหญ่ หรือเข้าเฝือกขาช่วงที่ผ่านมา</span>\n                  </label>\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" id=\"chestpain_pulm_cancer_ocp\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium text-slate-700\">มีประวัติโรคมะเร็ง หรือทานยาคุมกำเนิด/ฮอร์โมน</span>\n                  </label>\n                </div>\n              </div>\n\n              <!-- กิ่ง GI screen (ข้อ 5: ขย้อนเปรี้ยว/เรอเปรี้ยว + ลมดันตีขึ้น) -->\n              <div id=\"chestpain_branch_gi\" class=\"hidden bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs\">\n                <div class=\"font-bold text-slate-800 flex items-center\">\n                  <i data-lucide=\"droplet\" class=\"w-4 h-4 mr-1.5 text-medical-600\"></i>\n                  <span>ประเมินอาการระบบทางเดินอาหารและหลอดอาหาร:</span>\n                </div>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2\">\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" id=\"chestpain_gi_heartburn_up\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium text-slate-700\">แสบร้อนเหนือลิ้นปี่ หรือมี <strong class=\"text-slate-900\">ลมดันตีขึ้น</strong></span>\n                  </label>\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" id=\"chestpain_gi_regurgitation\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium text-slate-700\"><strong class=\"text-slate-900\">ขย้อนเปรี้ยว / เรอเปรี้ยว</strong> มีน้ำรสเปรี้ยวหรือขมไหลย้อนขึ้นมา</span>\n                  </label>\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" id=\"chestpain_gi_post_meal\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium text-slate-700\">จุกแน่นหลังรับประทานอาหารมื้อใหญ่ หรือเมื่อนอนราบ</span>\n                  </label>\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" id=\"chestpain_gi_dysphagia\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium text-slate-700\">มีอาการกลืนลำบาก หรือกลืนเจ็บ</span>\n                  </label>\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer sm:col-span-2\">\n                    <input type=\"checkbox\" id=\"chestpain_gi_severe_emesis\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium text-slate-700\">มีอาการคลื่นไส้ อาเจียนรุนแรงหลายครั้งก่อนจะเริ่มเจ็บหน้าอก</span>\n                  </label>\n                </div>\n              </div>\n\n              <!-- กิ่ง MSK screen (ข้อ 6: ประวัติอุบัติเหตุ + พิมพ์ระบุ) -->\n              <div id=\"chestpain_branch_msk\" class=\"hidden bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs\">\n                <div class=\"font-bold text-slate-800 flex items-center\">\n                  <i data-lucide=\"bone\" class=\"w-4 h-4 mr-1.5 text-medical-600\"></i>\n                  <span>ประเมินอาการทางกระดูกและกล้ามเนื้อทรวงอก:</span>\n                </div>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2\">\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" id=\"chestpain_msk_tender\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium text-slate-700\">เจ็บแปล๊บเฉพาะจุดเมื่อใช้นิ้วกดลงบนกระดูกซี่โครง</span>\n                  </label>\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" id=\"chestpain_msk_movement\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium text-slate-700\">เจ็บมากขึ้นเมื่อเอี้ยวตัว บิดตัว หรือขยับทรวงอก</span>\n                  </label>\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" id=\"chestpain_msk_heavy_lifting\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium text-slate-700\">มีประวัติยกของหนักหรือบิดผิดท่า</span>\n                  </label>\n                  <label class=\"selectable-card bg-white p-2.5 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" id=\"chestpain_msk_trauma\" onchange=\"toggleBranch('chestpain_trauma_detail_wrap', this.checked)\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-semibold text-slate-800\">มีประวัติอุบัติเหตุ</span>\n                  </label>\n                </div>\n\n                <div id=\"chestpain_trauma_detail_wrap\" class=\"hidden pt-1\">\n                  <input type=\"text\" id=\"chestpainTraumaDetail\" placeholder=\"ระบุลักษณะการเกิดอุบัติเหตุ เช่น โดนกระแทกหน้าอก, รถล้ม, อุบัติเหตุจราจร, ยกของหนัก...\" class=\"w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-medical-500\">\n                </div>\n              </div>\n\n            </div>\n          </div>\n\n          <!-- CARD 4: หมวดคัดกรองความปลอดภัยและการใช้ยาความเสี่ยงสูง (ข้อ 10 & 10.1) - Dynamic Progressive Disclosure -->\n          <div id=\"chestpain_high_risk_med_section\" class=\"hidden bg-white rounded-2xl p-6 shadow-sm border border-slate-200 transition-all\">\n            <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n              <div class=\"bg-amber-100 text-amber-800 p-2 rounded-xl\">\n                <i data-lucide=\"shield-check\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-900\">4. คัดกรองความปลอดภัยการใช้ยาความเสี่ยงสูง</h2>\n                <p class=\"text-xs text-slate-500\">คำถามเพื่อความปลอดภัยในการให้ยาสลายลิ่มเลือดและยาขยายหลอดเลือด</p>\n              </div>\n            </div>\n\n            <!-- กล่องแจ้งเตือนคำสั่งแพทย์ (ตามข้อ 10.1) -->\n            <div class=\"bg-amber-50/80 border border-amber-300 rounded-xl p-4 text-xs text-amber-900 flex items-start space-x-3 mb-4\">\n              <i data-lucide=\"alert-circle\" class=\"w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5\"></i>\n              <div class=\"leading-relaxed\">\n                <p class=\"font-medium text-slate-800\">\n                  “จากอาการของท่าน ท่านอาจมีโอกาสต้องได้รับยาที่มีความเสี่ยงสูง เพื่อความรวดเร็วในการรักษา โปรดตอบคำถามเหล่านี้โดยระมัดระวัง ทั้งนี้แพทย์ผู้ทำการรักษาจะทำการสอบถามและให้ข้อมูลท่านซ้ำอีกครั้งก่อนการรักษา”\n                </p>\n              </div>\n            </div>\n\n            <div class=\"space-y-4 text-xs\">\n              <!-- 1. เลือดออกในสมอง/เนื้องอก/หลอดเลือดโป่งพอง -->\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                <input type=\"checkbox\" id=\"ci_ich_tumor_avm\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">เคยมีเลือดออกในสมอง / เนื้องอกในสมอง / เส้นเลือดขดหรือโป่งพองในสมอง มาก่อนในอดีต</span>\n                  <span class=\"text-[11px] text-slate-500\">ประวัติภาวะเลือดออกในสมองหรือความผิดปกติของหลอดเลือดสมอง</span>\n                </div>\n              </label>\n\n              <!-- 2. Ischemic stroke with duration -->\n              <div class=\"selectable-card p-3 rounded-xl space-y-2\">\n                <span class=\"font-semibold text-slate-800 block\">มีประวัติหลอดเลือดสมองตีบหรืออัมพฤกษ์:</span>\n                <div class=\"grid grid-cols-2 sm:grid-cols-4 gap-2\">\n                  <label class=\"bg-slate-50 p-2 rounded-lg flex items-center cursor-pointer border border-slate-200\">\n                    <input type=\"radio\" name=\"ci_ischemic_stroke\" value=\"none\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium\">ไม่มีประวัติ</span>\n                  </label>\n                  <label class=\"bg-slate-50 p-2 rounded-lg flex items-center cursor-pointer border border-slate-200\">\n                    <input type=\"radio\" name=\"ci_ischemic_stroke\" value=\"within_3m\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium\">ภายใน 3 เดือน</span>\n                  </label>\n                  <label class=\"bg-slate-50 p-2 rounded-lg flex items-center cursor-pointer border border-slate-200\">\n                    <input type=\"radio\" name=\"ci_ischemic_stroke\" value=\"3_to_6m\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium\">ในช่วง 3-6 เดือน</span>\n                  </label>\n                  <label class=\"bg-slate-50 p-2 rounded-lg flex items-center cursor-pointer border border-slate-200\">\n                    <input type=\"radio\" name=\"ci_ischemic_stroke\" value=\"gt_6m\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium\">มากกว่า 6 เดือน</span>\n                  </label>\n                </div>\n              </div>\n\n              <!-- 3. ผ่าตัดสมอง/ไขสันหลัง ภายใน 3 เดือน -->\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                <input type=\"checkbox\" id=\"ci_cns_surgery_3m\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">ได้รับการผ่าตัดสมองหรือไขสันหลัง ภายใน 3 เดือน</span>\n                  <span class=\"text-[11px] text-slate-500\">เคยได้รับการผ่าตัดระบบประสาทส่วนกลางในช่วง 3 เดือนที่ผ่านมา</span>\n                </div>\n              </label>\n\n              <!-- 4. ผ่าตัดใหญ่ ภายใน 3 สัปดาห์ -->\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                <input type=\"checkbox\" id=\"ci_major_surgery_3w\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">ได้รับการผ่าตัดใหญ่ ภายใน 3 สัปดาห์</span>\n                  <span class=\"text-[11px] text-slate-500\">เช่น ผ่าตัดช่องท้อง, ผ่าตัดกระดูก, ผ่าตัดทรวงอก ในช่วง 3 สัปดาห์ที่ผ่านมา</span>\n                </div>\n              </label>\n\n              <!-- 5. บาดเจ็บรุนแรงศีรษะ/ใบหน้า ภายใน 3 เดือน -->\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                <input type=\"checkbox\" id=\"ci_head_facial_trauma_3m\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">ได้รับการบาดเจ็บรุนแรงที่ศีรษะหรือใบหน้า ภายใน 3 เดือน</span>\n                  <span class=\"text-[11px] text-slate-500\">เช่น อุบัติเหตุกระแทกศีรษะรุนแรง กะโหลกร้าว หรือหมดสติ</span>\n                </div>\n              </label>\n\n              <!-- 6. แผล/เลือดออกภายใน ทางเดินอาหาร -->\n              <div class=\"selectable-card p-3 rounded-xl space-y-2\">\n                <span class=\"font-semibold text-slate-800 block\">มีแผลหรือเลือดออกจากภายใน เช่น แผลทางเดินอาหาร อาเจียนปนเลือด ถ่ายดำปนเลือด (ไม่รวมประจำเดือน):</span>\n                <div class=\"grid grid-cols-2 sm:grid-cols-4 gap-2\">\n                  <label class=\"bg-slate-50 p-2 rounded-lg flex items-center cursor-pointer border border-slate-200\">\n                    <input type=\"radio\" name=\"ci_internal_bleeding\" value=\"none\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium\">ไม่มีประวัติ</span>\n                  </label>\n                  <label class=\"bg-slate-50 p-2 rounded-lg flex items-center cursor-pointer border border-slate-200\">\n                    <input type=\"radio\" name=\"ci_internal_bleeding\" value=\"current_active\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-semibold text-slate-800\">กำลังมีอยู่ในปัจจุบัน</span>\n                  </label>\n                  <label class=\"bg-slate-50 p-2 rounded-lg flex items-center cursor-pointer border border-slate-200\">\n                    <input type=\"radio\" name=\"ci_internal_bleeding\" value=\"within_1m\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium\">ในช่วง &lt; 1 เดือน</span>\n                  </label>\n                  <label class=\"bg-slate-50 p-2 rounded-lg flex items-center cursor-pointer border border-slate-200\">\n                    <input type=\"radio\" name=\"ci_internal_bleeding\" value=\"gt_1m\" class=\"text-medical-600 focus:ring-medical-500 h-3.5 w-3.5\">\n                    <span class=\"ml-2 font-medium\">มากกว่า 1 เดือน</span>\n                  </label>\n                </div>\n              </div>\n\n              <!-- 7. เคยได้รับยาสลายลิ่มเลือดมาก่อน -->\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                <input type=\"checkbox\" id=\"ci_prior_fibrinolytic\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">เคยมีภาวะเส้นเลือดหัวใจตีบ/หัวใจขาดเลือด ที่ต้องได้รับยาสลายลิ่มเลือดทางหลอดเลือดโดยด่วนมาก่อน</span>\n                  <span class=\"text-[11px] text-slate-500\">เคยได้รับยาฉีดสลายลิ่มเลือดทางหลอดเลือดดำ (เช่น Streptokinase) ในอดีต</span>\n                </div>\n              </label>\n\n              <!-- 8. เลือดออกผิดปกติ / ยาต้านการแข็งตัวของเลือด -->\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                <input type=\"checkbox\" id=\"ci_coagulopathy_anticoagulant\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">มีภาวะเลือดออกผิดปกติ ออกง่ายหยุดยาก หรือกำลังได้รับยาต้านการแข็งตัวของเลือด (เช่น Warfarin)</span>\n                  <span class=\"text-[11px] text-slate-500\">โรคเลือดไหลไม่หยุด หรือทานยาวาร์ฟาริน/ยาละลายลิ่มเลือดเป็นประจำ</span>\n                </div>\n              </label>\n\n              <!-- 9. ตั้งครรภ์ หรือหลังคลอดบุตร 1 สัปดาห์ -->\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer\">\n                <input type=\"checkbox\" id=\"ci_pregnancy_postpartum_1w\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-800 block\">การตั้งครรภ์ หรือหลังคลอดบุตรภายใน 1 สัปดาห์</span>\n                  <span class=\"text-[11px] text-slate-500\">อยู่ในระหว่างการตั้งครรภ์ หรือเพิ่งคลอดบุตรไม่เกิน 7 วัน</span>\n                </div>\n              </label>\n\n              <!-- 10. ยากลุ่มรักษาหย่อนสมรรถภาพทางเพศ (PDE-5 Inhibitor เช่น Viagra) -->\n              <label class=\"selectable-card p-3 rounded-xl flex items-start cursor-pointer bg-amber-50/40 border-amber-200\">\n                <input type=\"checkbox\" id=\"ci_pde5_inhibitor\" class=\"mt-0.5 rounded text-medical-600 h-4 w-4\">\n                <div class=\"ml-2.5\">\n                  <span class=\"font-semibold text-slate-900 block\">รับประทานยากลุ่มรักษาหย่อนสมรรถภาพทางเพศ (เช่น Viagra (Sildenafil), Cialis, Levitra) ในช่วง 24-48 ชั่วโมงที่ผ่านมา</span>\n                  <span class=\"text-[11px] text-slate-500\">ข้อมูลนี้สำคัญต่อความปลอดภัยอย่างยิ่ง เนื่องจากมีผลต่อการสั่งยาขยายหลอดเลือดของแพทย์</span>\n                </div>\n              </label>\n\n            </div>\n          </div>\n\n          <!-- อาการอื่นๆ เป็นช่องกรอกอิสระ -->\n          <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n            <div class=\"flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100\">\n              <div class=\"bg-slate-100 text-slate-600 p-2 rounded-xl\">\n                <i data-lucide=\"message-square-plus\" class=\"w-5 h-5\"></i>\n              </div>\n              <div>\n                <h2 class=\"text-base font-bold text-slate-800\">อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2>\n                <p class=\"text-xs text-slate-500\">ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี เช่น อ่อนเพลียมาก, แน่นหน้าอก, วิงเวียนศีรษะ)</p>\n              </div>\n            </div>\n            <textarea id=\"chestpain_other_free\" rows=\"2\" placeholder=\"พิมพ์ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)...\" \n              class=\"w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white\"></textarea>\n          </div>\n\n        </div> <!-- END CHEST PAIN QUESTIONNAIRE SECTION -->",
  algorithm: {
  "id": "chestpain",
  "schemaCode": "chest_pain",
  "titleTh": "เจ็บแน่นหน้าอก",
  "titleEn": "Chest pain",
  "sections": [
    {
      "sectionNo": 1,
      "titleTh": "ลักษณะอาการเจ็บแน่นหน้าอก (OPQRST & Pain Score)",
      "questions": [
        {
          "key": "duration",
          "labelTh": "เริ่มมีอาการเจ็บแน่นหน้าอกมานานเท่าไรแล้ว?",
          "type": "duration_with_unit",
          "units": "UNIVERSAL_DURATION_UNITS"
        },
        {
          "key": "chestpainOnsetMode",
          "labelTh": "อาการเริ่มต้นเป็นอย่างไร?",
          "type": "single_choice",
          "options": [
            {
              "value": "sudden_peak",
              "patientTh": "เจ็บขึ้นมาทันทีทันใด รุนแรงถึงขีดสุดตั้งแต่แรก",
              "doctorTh": "Abrupt/Maximal at onset (Suspect Aortic Dissection / PE)"
            },
            {
              "value": "gradual_build",
              "patientTh": "ค่อยๆ แน่นหรือเจ็บมากขึ้นเรื่อยๆ ในเวลาเป็นนาที",
              "doctorTh": "Crescendo/Gradual build-up (Typical for ACS)"
            },
            {
              "value": "chronic_exertional",
              "patientTh": "มีอาการเรื้อรัง (เจ็บเวลาเหนื่อย หรือ เจ็บเท่าๆ เดิมมานาน)",
              "doctorTh": "Chronic stable/exertional pattern"
            }
          ]
        },
        {
          "key": "chestpainChars",
          "labelTh": "ลักษณะความรู้สึกเจ็บหน้าอก (เลือกได้มากกว่า 1 ข้อ)",
          "type": "multi_choice",
          "options": [
            {
              "value": "crushing_heavy",
              "patientTh": "แน่นเหมือนโดนของทับหน้าอก บีบรัด",
              "triggersHighRiskMedScreen": true
            },
            {
              "value": "tight_dyspneic",
              "patientTh": "แน่นอึดอัดหายใจไม่สะดวก"
            },
            {
              "value": "tearing_sharp",
              "patientTh": "เจ็บแปล๊บเหมือนถูกมีดกรีด หรือฉีกขาดทะลุหลัง",
              "isRedFlag": true
            },
            {
              "value": "pleuritic_sharp",
              "patientTh": "เจ็บแปล๊บเวลาหายใจเข้าลึกๆ หรือเวลาไอ/ขยับตัว",
              "triggersBranch": "chestpain_branch_pulm"
            },
            {
              "value": "burning_heartburn",
              "patientTh": "แสบร้อนกลางอก (คล้ายกรดไหลย้อน)",
              "triggersBranch": "chestpain_branch_gi"
            },
            {
              "value": "aching_tender",
              "patientTh": "ปวดเมื่อยตึงๆ หรือใช้นิ้วกดแล้วเจ็บตรงจุดที่กด",
              "triggersBranch": "chestpain_branch_msk"
            }
          ]
        },
        {
          "key": "chestpainLocs",
          "labelTh": "ตำแหน่งที่เจ็บแน่นหน้าอก",
          "type": "multi_choice",
          "options": [
            {
              "value": "retrosternal_mid",
              "patientTh": "กลางหน้าอก (Retrosternal)"
            },
            {
              "value": "left_precordial",
              "patientTh": "หน้าอกด้านซ้าย (Left precordial)"
            },
            {
              "value": "right_chest",
              "patientTh": "หน้าอกด้านขวา (Right chest)"
            },
            {
              "value": "epigastric",
              "patientTh": "เหนือลิ้นปี่ (Epigastric)"
            },
            {
              "value": "diffuse_chest",
              "patientTh": "ทั่วๆ หน้าอก บอกจุดชัดเจนไม่ได้ (Diffuse)"
            }
          ]
        },
        {
          "key": "chestpainRads",
          "labelTh": "มีอาการเจ็บร้าวไปบริเวณอื่นหรือไม่?",
          "type": "multi_choice",
          "options": [
            {
              "value": "none",
              "patientTh": "ไม่ร้าวไปที่ใด"
            },
            {
              "value": "left_arm_shoulder",
              "patientTh": "ร้าวไปไหล่ซ้าย แขนซ้าย",
              "triggersHighRiskMedScreen": true
            },
            {
              "value": "neck_jaw",
              "patientTh": "ร้าวไปคอ หรือกราม",
              "triggersHighRiskMedScreen": true
            },
            {
              "value": "scapula",
              "patientTh": "ร้าวทะลุไปสะบักด้านหลัง",
              "isRedFlag": true
            },
            {
              "value": "right_shoulder",
              "patientTh": "ร้าวไปไหล่ขวา หรือแขนขวา"
            },
            {
              "value": "abdomen",
              "patientTh": "ร้าวลงท้อง"
            }
          ]
        },
        {
          "key": "chestpainPainScore",
          "labelTh": "คะแนนความปวด (Pain Score 0 - 10 พร้อม Emoji)",
          "type": "nullable_slider_0_to_10",
          "note": "ห้ามค้างค่า Default หากผู้ป่วยไม่ได้เลื่อนแถบ ค่าต้องเป็น null"
        }
      ]
    },
    {
      "sectionNo": 2,
      "titleTh": "แบบประเมินความเสี่ยงโรคหัวใจขาดเลือด (ถามทุกเคส)",
      "questions": [
        {
          "key": "chestpainAnginaExertion",
          "labelTh": "ความสัมพันธ์กับการออกแรงหรือขณะพัก"
        },
        {
          "key": "chestpainAnginaOver20m",
          "labelTh": "อาการเจ็บแน่นหน้าอกต่อเนื่องนานเกิน 20 นาทีหรือไม่?"
        },
        {
          "key": "chestpainNtgHx",
          "labelTh": "เคยได้รับยาอมใต้ลิ้นขยายหลอดเลือดหัวใจมาก่อนหรือไม่?"
        }
      ]
    },
    {
      "sectionNo": 3,
      "titleTh": "อาการร่วม (Associated Symptoms & Embedded Red Flags)",
      "items": [
        {
          "key": "chestpain_rf_diaphoresis",
          "patientTh": "เหงื่อแตกท่วมตัว ตัวเย็น ซีด",
          "isRedFlag": true,
          "triggersHighRiskMedScreen": true
        },
        {
          "key": "chestpain_rf_syncope",
          "patientTh": "หน้ามืด วูบ หรือหมดสติ",
          "isRedFlag": true,
          "triggersHighRiskMedScreen": true
        },
        {
          "key": "chestpain_rf_dyspnea",
          "patientTh": "หายใจหอบเหนื่อย หายใจไม่อิ่ม",
          "isRedFlag": true,
          "triggersHighRiskMedScreen": true
        },
        {
          "key": "chestpain_rf_orthopnea",
          "patientTh": "นอนราบไม่ได้ ต้องหนุนหมอนสูงหรือลุกนั่งหอบ",
          "isRedFlag": true
        },
        {
          "key": "chestpain_rf_palpitation",
          "patientTh": "ใจสั่น หัวใจเต้นเร็วหรือเต้นผิดจังหวะ"
        },
        {
          "key": "chestpain_rf_hemoptysis",
          "patientTh": "ไอเป็นเลือดสด",
          "isRedFlag": true
        },
        {
          "key": "chestpain_rf_calf_swelling",
          "patientTh": "ขาบวมข้างเดียว หรือปวดน่องข้างเดียว",
          "isRedFlag": true
        },
        {
          "key": "chestpain_abdpain",
          "patientTh": "ปวดท้องร่วมด้วย (เปิดกิ่งเจาะลึกปวดท้อง)"
        }
      ]
    },
    {
      "sectionNo": 4,
      "titleTh": "คัดกรองความปลอดภัยการใช้ยาความเสี่ยงสูง (Fibrinolytic & Nitroglycerin Contraindications)",
      "condition": "เปิดอัตโนมัติเมื่อผู้ป่วยมีอาการสงสัยกล้ามเนื้อหัวใจขาดเลือด (ACS Trigger)",
      "items": [
        {
          "key": "ci_ich_tumor_avm",
          "labelTh": "เคยมีเลือดออกในสมอง / เนื้องอกในสมอง / เส้นเลือดขดหรือโป่งพองในสมอง",
          "category": "Absolute Fibrinolytic CI"
        },
        {
          "key": "ci_ischemic_stroke",
          "labelTh": "ประวัติหลอดเลือดสมองตีบ/อัมพฤกษ์ (ภายใน 3 เดือน = Absolute, 3-6 เดือน = Relative, >6 เดือน = No CI)",
          "category": "Stratified Stroke CI"
        },
        {
          "key": "ci_cns_surgery_3m",
          "labelTh": "ผ่าตัดสมองหรือไขสันหลัง ภายใน 3 เดือน",
          "category": "Absolute Fibrinolytic CI"
        },
        {
          "key": "ci_major_surgery_3w",
          "labelTh": "ผ่าตัดใหญ่ ภายใน 3 สัปดาห์",
          "category": "Absolute Fibrinolytic CI"
        },
        {
          "key": "ci_head_facial_trauma_3m",
          "labelTh": "บาดเจ็บรุนแรงที่ศีรษะหรือใบหน้า ภายใน 3 เดือน",
          "category": "Absolute Fibrinolytic CI"
        },
        {
          "key": "ci_internal_bleeding",
          "labelTh": "แผลหรือเลือดออกจากภายใน/ทางเดินอาหาร (ปัจจุบัน = Absolute, ไม่เกิน 1 เดือน = Relative)",
          "category": "Stratified Bleeding CI"
        },
        {
          "key": "ci_prior_fibrinolytic",
          "labelTh": "เคยได้รับยาฉีดสลายลิ่มเลือดทางหลอดเลือดดำ (เช่น Streptokinase) ในอดีต",
          "category": "Relative Fibrinolytic CI"
        },
        {
          "key": "ci_coagulopathy_anticoagulant",
          "labelTh": "มีภาวะเลือดออกง่ายผิดปกติ หรือทานยาละลายลิ่มเลือด (เช่น Warfarin)",
          "category": "Relative Fibrinolytic CI"
        },
        {
          "key": "ci_pregnancy_postpartum_1w",
          "labelTh": "กำลังตั้งครรภ์ หรือเพิ่งคลอดบุตรภายใน 1 สัปดาห์",
          "category": "Relative Fibrinolytic CI"
        },
        {
          "key": "ci_pde5_inhibitor",
          "labelTh": "ทานยากลุ่มเสริมสมรรถภาพทางเพศ (เช่น Viagra, Sildenafil, Cialis) ภายใน 24-48 ชม.",
          "category": "Absolute Nitroglycerin CI"
        }
      ]
    }
  ]
},
  seedPatients: [
  {
    "id": "case-046",
    "queue_number": "A-046",
    "hn": "6705512",
    "name": "นายสมชาย มั่นคง",
    "age": 58,
    "gender": "ชาย",
    "chief_complaint": "chest_pain",
    "chief_complaint_title": "เจ็บแน่นหน้าอก",
    "status": "waiting",
    "timestamp": "2026-10-26T02:31:26.423Z",
    "durationVal": 1,
    "durationUnit": "hours",
    "chestpainPainScore": 10,
    "chestpainOnsetMode": "sudden_peak",
    "chestpainLocs": [
      "substernal"
    ],
    "chestpainRads": [
      "left_arm_shoulder",
      "neck_jaw"
    ],
    "chestpainChars": [
      "crushing_heavy",
      "tight_dyspneic"
    ],
    "chestpainAnginaExertion": "rest",
    "chestpainAnginaOver20m": true,
    "chestpainNtgHx": true,
    "chestpainNtgCurrent": "no_relief",
    "chestpain_rf_diaphoresis": true,
    "chestpain_rf_syncope": false,
    "chestpain_rf_dyspnea": true,
    "chestpainDyspneaPatterns": [
      "continuous",
      "sudden_onset"
    ],
    "chestpain_rf_orthopnea": false,
    "chestpain_rf_palpitation": false,
    "chestpain_rf_hemoptysis": false,
    "chestpain_rf_calf_swelling": false,
    "chestpain_abdpain": false,
    "chestpainAbdpainLocs": [],
    "chestpainAbdpainChars": [],
    "chestpainAbdpainRads": [],
    "chestpain_pulm_travel": false,
    "chestpain_pulm_bedridden": false,
    "chestpain_pulm_cancer_ocp": false,
    "chestpain_gi_heartburn_up": false,
    "chestpain_gi_regurgitation": false,
    "chestpain_gi_post_meal": false,
    "chestpain_gi_dysphagia": false,
    "chestpain_gi_severe_emesis": false,
    "chestpain_msk_tender": false,
    "chestpain_msk_movement": false,
    "chestpain_msk_heavy_lifting": false,
    "chestpain_msk_trauma": false,
    "chestpainTraumaDetail": "",
    "ci_ich_tumor_avm": false,
    "ci_ischemic_stroke": "none",
    "ci_cns_surgery_3m": false,
    "ci_major_surgery_3w": false,
    "ci_head_facial_trauma_3m": false,
    "ci_internal_bleeding": "none",
    "ci_prior_fibrinolytic": false,
    "ci_coagulopathy_anticoagulant": false,
    "ci_pregnancy_postpartum_1w": false,
    "ci_pde5_inhibitor": false,
    "hospRecordStatus": "additional",
    "underlying": [
      "หลอดเลือดหัวใจ (CAD)",
      "เบาหวาน (DM)",
      "ไขมันในเลือดสูง (DLP)"
    ],
    "ud_cad_hosp_status": "other",
    "ud_cad_pci": true,
    "ud_cad_cabg": false,
    "ud_cad_meds": true,
    "ud_cad_hosp_name": "รพ.ศิริราช (PCI ใส่ Stent 2 ปีก่อน)",
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "Aspirin 81mg, Clopidogrel 75mg, Atorvastatin 40mg, Metformin 500mg, ISDN 5mg SL prn",
    "doctor_notes": {
      "additional_hpi": "ผู้ป่วยชาย 58 ปี ทราบประวัติ CAD s/p PCI จาก รพ.ศิริราช 2 ปีก่อน มีอาการแน่นหน้าอกรุนแรงเหมือนของหนักทับกลางอก ร้าวไปกรามและแขนซ้าย 1 ชม. ก่อนมา มีเหงื่อแตกท่วมตัวตัวเย็น ลองอมยาใต้ลิ้นเดิม 1 เม็ดไม่ทุเลา",
      "physical_exam": "BT 36.6 C, PR 96/min, RR 22/min, BP 138/84 mmHg, SpO2 97%. Marked diaphoresis, pale clammy skin. Heart: Normal S1 S2, no murmur. Lungs: Clear, no adventitious sounds.",
      "preliminary_dx": "Acute ST-elevation Myocardial Infarction (STEMI), Anterior wall with High-Risk Features",
      "plan": "STAT EKG 12 leads (ST elevation V1-V4), Oxygen cannula 3 LPM, ASA 300 mg chew stat, Ticagrelor 180 mg stat, Morphine 2-4 mg IV prn pain, STAT consult Cardiology for Primary PCI via Fast Track Cath Lab Ratchaburi"
    }
  },
  {
    "id": "case-047",
    "queue_number": "A-047",
    "hn": "6708910",
    "name": "นางวันดี สิริโสภา",
    "age": 66,
    "gender": "หญิง",
    "chief_complaint": "chest_pain",
    "chief_complaint_title": "เจ็บแน่นหน้าอก",
    "status": "waiting",
    "timestamp": "2026-10-26T02:16:26.424Z",
    "durationVal": 2,
    "durationUnit": "hours",
    "chestpainOnsetMode": "sudden_peak",
    "chestpainLocs": [
      "substernal"
    ],
    "chestpainRads": [
      "scapula",
      "abdomen"
    ],
    "chestpainChars": [
      "tearing_sharp"
    ],
    "chestpainAnginaExertion": "unrelated",
    "chestpainAnginaOver20m": true,
    "chestpainNtgHx": false,
    "chestpainNtgCurrent": "not_applicable",
    "chestpain_rf_diaphoresis": true,
    "chestpain_rf_syncope": true,
    "chestpain_rf_dyspnea": false,
    "chestpainDyspneaPatterns": [],
    "chestpain_rf_orthopnea": false,
    "chestpain_rf_palpitation": false,
    "chestpain_rf_hemoptysis": false,
    "chestpain_rf_calf_swelling": false,
    "chestpain_abdpain": true,
    "chestpainAbdpainLocs": [
      "epigastrium"
    ],
    "chestpainAbdpainChars": [
      "sharp_tearing"
    ],
    "chestpainAbdpainRads": [
      "back_mid"
    ],
    "chestpain_pulm_travel": false,
    "chestpain_pulm_bedridden": false,
    "chestpain_pulm_cancer_ocp": false,
    "chestpain_gi_heartburn_up": false,
    "chestpain_gi_regurgitation": false,
    "chestpain_gi_post_meal": false,
    "chestpain_gi_dysphagia": false,
    "chestpain_gi_severe_emesis": false,
    "chestpain_msk_tender": false,
    "chestpain_msk_movement": false,
    "chestpain_msk_trauma": false,
    "chestpainTraumaDetail": "",
    "ci_ich_tumor_avm": false,
    "ci_ischemic_stroke": "none",
    "ci_cns_surgery_3m": false,
    "ci_major_surgery_3w": false,
    "ci_head_facial_trauma_3m": false,
    "ci_internal_bleeding": "none",
    "ci_prior_fibrinolytic": false,
    "ci_coagulopathy_anticoagulant": false,
    "ci_pregnancy_postpartum_1w": false,
    "ci_pde5_inhibitor": false,
    "hospRecordStatus": "self",
    "underlying": [
      "ความดันสูง (HT)"
    ],
    "ud_cad_hosp_status": "none",
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "ไม่ได้ทานยาประจำ ขาดยาความดัน 6 เดือน",
    "doctor_notes": {
      "additional_hpi": "มีโรคประจำตัวความดันโลหิตสูงขาดยา เจ็บหน้าอกฉับพลันรุนแรงสูงสุดตั้งแต่เริ่มแรก เหมือนถูกมีดเสียบแทงทะลุไปสะบักหลังและร้าวลงท้อง วูบเกือบหมดสติ",
      "physical_exam": "BT 36.8 C, PR 108/min, RR 24/min, BP Right arm 194/112 mmHg, BP Left arm 146/88 mmHg (Unequal BP > 30 mmHg), SpO2 96%. Heart: Early diastolic murmur at right sternal border (AR murmur). Lungs: Clear.",
      "preliminary_dx": "Suspected Acute Aortic Dissection (Stanford Type A) with Severe Hypertensive Crisis & Asymmetric BP",
      "plan": "CONTRAINDICATED: Do NOT give antiplatelet/anticoagulant/fibrinolytic. STAT 2 IV lines, Labetalol 20 mg IV slow push then continuous infusion target SBP 100-120 and HR < 60, STAT CTA Chest and Whole Aorta, STAT Emergency Consult Cardio-thoracic surgery"
    }
  },
  {
    "id": "case-048",
    "queue_number": "A-048",
    "hn": "6704199",
    "name": "นายธนากร รัตนวิมล",
    "age": 34,
    "gender": "ชาย",
    "chief_complaint": "chest_pain",
    "chief_complaint_title": "เจ็บแน่นหน้าอก",
    "status": "waiting",
    "timestamp": "2026-10-26T01:56:26.424Z",
    "durationVal": 3,
    "durationUnit": "days",
    "chestpainPainScore": 4,
    "chestpainOnsetMode": "gradual",
    "chestpainLocs": [
      "epigastrium",
      "substernal"
    ],
    "chestpainRads": [
      "none"
    ],
    "chestpainChars": [
      "burning_heartburn",
      "aching_tender"
    ],
    "chestpainAnginaExertion": "unrelated",
    "chestpainAnginaOver20m": false,
    "chestpainNtgHx": false,
    "chestpainNtgCurrent": "not_applicable",
    "chestpain_rf_diaphoresis": false,
    "chestpain_rf_syncope": false,
    "chestpain_rf_dyspnea": false,
    "chestpainDyspneaPatterns": [],
    "chestpain_rf_orthopnea": false,
    "chestpain_rf_palpitation": false,
    "chestpain_rf_hemoptysis": false,
    "chestpain_rf_calf_swelling": false,
    "chestpain_abdpain": true,
    "chestpainAbdpainLocs": [
      "epigastrium"
    ],
    "chestpainAbdpainChars": [
      "burning"
    ],
    "chestpainAbdpainRads": [
      "chest"
    ],
    "chestpain_pulm_travel": false,
    "chestpain_pulm_bedridden": false,
    "chestpain_pulm_cancer_ocp": false,
    "chestpain_gi_heartburn_up": true,
    "chestpain_gi_regurgitation": true,
    "chestpain_gi_post_meal": true,
    "chestpain_gi_dysphagia": false,
    "chestpain_gi_severe_emesis": false,
    "chestpain_msk_tender": true,
    "chestpain_msk_movement": true,
    "chestpain_msk_heavy_lifting": true,
    "chestpain_msk_trauma": false,
    "chestpainTraumaDetail": "",
    "ci_ich_tumor_avm": false,
    "ci_ischemic_stroke": "none",
    "ci_cns_surgery_3m": false,
    "ci_major_surgery_3w": false,
    "ci_head_facial_trauma_3m": false,
    "ci_internal_bleeding": "none",
    "ci_prior_fibrinolytic": false,
    "ci_coagulopathy_anticoagulant": false,
    "ci_pregnancy_postpartum_1w": false,
    "ci_pde5_inhibitor": false,
    "hospRecordStatus": "self",
    "underlying": ["ปฏิเสธ"],
    "ud_cad_hosp_status": "none",
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "ไม่มี",
    "doctor_notes": {
      "additional_hpi": "ปวดแสบร้อนกลางอกและมีลมดันตีขึ้น ขย้อนเปรี้ยว เป็นมากขึ้นหลังรับประทานอาหารมื้อดึกและล้มตัวนอนราบ ร่วมกับมีจุดกดเจ็บบนกระดูกซี่โครงด้านหน้า ปฏิเสธประวัติเหนื่อยหอบหรือเหงื่อแตก",
      "physical_exam": "BT 36.8 C, PR 78/min, RR 16/min, BP 122/76 mmHg. Chest: Point tenderness reproducible on 4th-5th costochondral junctions, no swelling. Heart: Normal, no murmur. Lungs: Clear.",
      "preliminary_dx": "Gastroesophageal Reflux Disease (GERD) with Costochondritis (Non-cardiac chest pain)",
      "plan": "EKG 12 leads (Normal sinus rhythm, no ischemic change), Antacid liquid 30 ml po stat, Omeprazole 20 mg bid ac, Paracetamol 500 mg prn for chest wall pain, Educate on lifestyle modification"
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
    const durVal = document.getElementById('chestpainDurationVal');
    const durUnit = document.getElementById('chestpainDurationUnit');
    if (durVal) durVal.value = patient.durationVal || '';
    if (durUnit && patient.durationUnit) durUnit.value = patient.durationUnit;

    setRadioValue('chestpainOnsetMode', patient.chestpainOnsetMode);
    setMultiCheckboxes('chestpain_loc', patient.chestpainLocs);
    setMultiCheckboxes('chestpain_rad', patient.chestpainRads, 'chestpain_rad_other_chk', 'chestpain_rad_other_wrap', 'chestpain_rad_other_text');
    setMultiCheckboxes('chestpain_char', patient.chestpainChars, 'chestpain_char_other_chk', 'chestpain_char_other_wrap', 'chestpain_char_other_text');

    if (patient.chestpainPainScore !== null && patient.chestpainPainScore !== undefined) {
      setChestpainPainScore(patient.chestpainPainScore);
    } else {
      clearChestpainPainScore();
    }

    setRadioValue('chestpainAnginaExertion', patient.chestpainAnginaExertion);
    setRadioValue('chestpainAnginaOver20m', patient.chestpainAnginaOver20m ? 'yes' : 'no');
    setRadioValue('chestpainNtgHx', patient.chestpainNtgHx ? 'yes' : 'no');
    toggleBranch('chestpain_ntg_current_wrap', Boolean(patient.chestpainNtgHx));
    if (patient.chestpainNtgHx) {
      setRadioValue('chestpainNtgCurrent', patient.chestpainNtgCurrent);
    }

    setChk = (id, val) => { const el = document.getElementById(id); if (el) el.checked = Boolean(val); };
    setChk('chestpain_rf_diaphoresis', patient.chestpain_rf_diaphoresis);
    setChk('chestpain_rf_syncope', patient.chestpain_rf_syncope);
    setChk('chestpain_rf_dyspnea', patient.chestpain_rf_dyspnea);
    toggleBranch('chestpain_dyspnea_wrap', Boolean(patient.chestpain_rf_dyspnea));
    if (patient.chestpain_rf_dyspnea) {
      setMultiCheckboxes('chestpain_dyspnea_pattern', patient.chestpainDyspneaPatterns);
    }
    setChk('chestpain_rf_orthopnea', patient.chestpain_rf_orthopnea);
    setChk('chestpain_rf_palpitation', patient.chestpain_rf_palpitation);
    setChk('chestpain_rf_hemoptysis', patient.chestpain_rf_hemoptysis);
    setChk('chestpain_rf_calf_swelling', patient.chestpain_rf_calf_swelling);

    setChk('chestpain_abdpain', patient.chestpain_abdpain);
    toggleBranch('chestpain_abdpain_wrap', Boolean(patient.chestpain_abdpain));
    if (patient.chestpain_abdpain) {
      setMultiCheckboxes('chestpain_abdpain_loc', patient.chestpainAbdpainLocs);
      setMultiCheckboxes('chestpain_abdpain_char', patient.chestpainAbdpainChars);
      setMultiCheckboxes('chestpain_abdpain_rad', patient.chestpainAbdpainRads);
    }

    handleChestpainCharChange();
    handleChestpainRadChange();

    setChk('chestpain_pulm_travel', patient.chestpain_pulm_travel);
    setChk('chestpain_pulm_bedridden', patient.chestpain_pulm_bedridden);
    setChk('chestpain_pulm_cancer_ocp', patient.chestpain_pulm_cancer_ocp);
    setChk('chestpain_gi_heartburn_up', patient.chestpain_gi_heartburn_up);
    setChk('chestpain_gi_regurgitation', patient.chestpain_gi_regurgitation);
    setChk('chestpain_gi_post_meal', patient.chestpain_gi_post_meal);
    setChk('chestpain_gi_dysphagia', patient.chestpain_gi_dysphagia);
    setChk('chestpain_gi_severe_emesis', patient.chestpain_gi_severe_emesis);
    setChk('chestpain_msk_tender', patient.chestpain_msk_tender);
    setChk('chestpain_msk_movement', patient.chestpain_msk_movement);
    setChk('chestpain_msk_heavy_lifting', patient.chestpain_msk_heavy_lifting);
    setChk('chestpain_msk_trauma', patient.chestpain_msk_trauma);
    toggleBranch('chestpain_trauma_detail_wrap', Boolean(patient.chestpain_msk_trauma));
    if (patient.chestpain_msk_trauma && document.getElementById('chestpainTraumaDetail')) {
      document.getElementById('chestpainTraumaDetail').value = patient.chestpainTraumaDetail || '';
    }

    // High-risk medication contraindications
    setChk('ci_ich_tumor_avm', patient.ci_ich_tumor_avm);
    setRadioValue('ci_ischemic_stroke', patient.ci_ischemic_stroke || 'none');
    setChk('ci_cns_surgery_3m', patient.ci_cns_surgery_3m);
    setChk('ci_major_surgery_3w', patient.ci_major_surgery_3w);
    setChk('ci_head_facial_trauma_3m', patient.ci_head_facial_trauma_3m);
    setRadioValue('ci_internal_bleeding', patient.ci_internal_bleeding || 'none');
    setChk('ci_prior_fibrinolytic', patient.ci_prior_fibrinolytic);
    setChk('ci_coagulopathy_anticoagulant', patient.ci_coagulopathy_anticoagulant);
    setChk('ci_pregnancy_postpartum_1w', patient.ci_pregnancy_postpartum_1w);
    setChk('ci_pde5_inhibitor', patient.ci_pde5_inhibitor);

    // CAD details in PMH
    if (patient.ud_cad_hosp_status && patient.ud_cad_hosp_status !== 'none') {
      setRadioValue('ud_cad_hosp_status', patient.ud_cad_hosp_status);
      toggleBranch('ud_cad_other_hosp_wrap', patient.ud_cad_hosp_status === 'other');
      setChk('ud_cad_tx_pci', patient.ud_cad_pci);
      setChk('ud_cad_tx_cabg', patient.ud_cad_cabg);
      setChk('ud_cad_tx_meds', patient.ud_cad_meds);
      if (document.getElementById('ud_cad_hosp_name')) {
        document.getElementById('ud_cad_hosp_name').value = patient.ud_cad_hosp_name || '';
      }
    }

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
      // ------------------ CHEST PAIN INTAKE ------------------
      const _rawDur = parseFloat(document.getElementById('chestpainDurationVal')?.value); const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
      const durationUnit = document.getElementById('chestpainDurationUnit')?.value || 'hours';
      const chestpainOnsetMode = document.querySelector('input[name="chestpainOnsetMode"]:checked')?.value || 'unspecified';
      
      const chestpainLocs = Array.from(document.querySelectorAll('input[name="chestpain_loc"]:checked')).map(cb => cb.value);
      
      const chestpainRads = Array.from(document.querySelectorAll('input[name="chestpain_rad"]:checked')).map(cb => cb.value);
      if (document.getElementById('chestpain_rad_other_chk')?.checked) {
        const txt = document.getElementById('chestpain_rad_other_text')?.value.trim();
        if (txt) chestpainRads.push(`อื่นๆ: ${txt}`);
      }

      const chestpainChars = Array.from(document.querySelectorAll('input[name="chestpain_char"]:checked')).map(cb => cb.value);
      if (document.getElementById('chestpain_char_other_chk')?.checked) {
        const txt = document.getElementById('chestpain_char_other_text')?.value.trim();
        if (txt) chestpainChars.push(`อื่นๆ: ${txt}`);
      }

      const chestpainPainScore = chestpainPainScoreTouched ? (parseInt(document.getElementById('chestpainPainScore')?.value, 10) ?? null) : null;

      const chestpainAnginaExertion = document.querySelector('input[name="chestpainAnginaExertion"]:checked')?.value || 'unspecified';
      const chestpainAnginaOver20m = document.querySelector('input[name="chestpainAnginaOver20m"]:checked')?.value === 'yes';
      const chestpainNtgHx = document.querySelector('input[name="chestpainNtgHx"]:checked')?.value === 'yes';
      const chestpainNtgCurrent = chestpainNtgHx ? (document.querySelector('input[name="chestpainNtgCurrent"]:checked')?.value || 'not_taken') : 'not_applicable';

      const chestpain_rf_diaphoresis = document.getElementById('chestpain_rf_diaphoresis')?.checked || false;
      const chestpain_rf_syncope = document.getElementById('chestpain_rf_syncope')?.checked || false;
      const chestpain_rf_dyspnea = document.getElementById('chestpain_rf_dyspnea')?.checked || false;
      const chestpainDyspneaPatterns = chestpain_rf_dyspnea ? Array.from(document.querySelectorAll('input[name="chestpain_dyspnea_pattern"]:checked')).map(cb => cb.value) : [];
      const chestpain_rf_orthopnea = document.getElementById('chestpain_rf_orthopnea')?.checked || false;
      const chestpain_rf_palpitation = document.getElementById('chestpain_rf_palpitation')?.checked || false;
      const chestpain_rf_hemoptysis = document.getElementById('chestpain_rf_hemoptysis')?.checked || false;
      const chestpain_rf_calf_swelling = document.getElementById('chestpain_rf_calf_swelling')?.checked || false;

      const chestpain_abdpain = document.getElementById('chestpain_abdpain')?.checked || false;
      const chestpainAbdpainLocs = chestpain_abdpain ? Array.from(document.querySelectorAll('input[name="chestpain_abdpain_loc"]:checked')).map(cb => cb.value) : [];
      const chestpainAbdpainChars = chestpain_abdpain ? Array.from(document.querySelectorAll('input[name="chestpain_abdpain_char"]:checked')).map(cb => cb.value) : [];
      const chestpainAbdpainRads = chestpain_abdpain ? Array.from(document.querySelectorAll('input[name="chestpain_abdpain_rad"]:checked')).map(cb => cb.value) : [];

      const chestpain_pulm_travel = document.getElementById('chestpain_pulm_travel')?.checked || false;
      const chestpain_pulm_bedridden = document.getElementById('chestpain_pulm_bedridden')?.checked || false;
      const chestpain_pulm_cancer_ocp = document.getElementById('chestpain_pulm_cancer_ocp')?.checked || false;

      const chestpain_gi_heartburn_up = document.getElementById('chestpain_gi_heartburn_up')?.checked || false;
      const chestpain_gi_regurgitation = document.getElementById('chestpain_gi_regurgitation')?.checked || false;
      const chestpain_gi_post_meal = document.getElementById('chestpain_gi_post_meal')?.checked || false;
      const chestpain_gi_dysphagia = document.getElementById('chestpain_gi_dysphagia')?.checked || false;
      const chestpain_gi_severe_emesis = document.getElementById('chestpain_gi_severe_emesis')?.checked || false;

      const chestpain_msk_tender = document.getElementById('chestpain_msk_tender')?.checked || false;
      const chestpain_msk_movement = document.getElementById('chestpain_msk_movement')?.checked || false;
      const chestpain_msk_heavy_lifting = document.getElementById('chestpain_msk_heavy_lifting')?.checked || false;
      const chestpain_msk_trauma = document.getElementById('chestpain_msk_trauma')?.checked || false;
      const chestpainTraumaDetail = chestpain_msk_trauma ? (document.getElementById('chestpainTraumaDetail')?.value.trim() || '') : '';

      const ci_ich_tumor_avm = document.getElementById('ci_ich_tumor_avm')?.checked || false;
      const ci_ischemic_stroke = document.querySelector('input[name="ci_ischemic_stroke"]:checked')?.value || 'none';
      const ci_cns_surgery_3m = document.getElementById('ci_cns_surgery_3m')?.checked || false;
      const ci_major_surgery_3w = document.getElementById('ci_major_surgery_3w')?.checked || false;
      const ci_head_facial_trauma_3m = document.getElementById('ci_head_facial_trauma_3m')?.checked || false;
      const ci_internal_bleeding = document.querySelector('input[name="ci_internal_bleeding"]:checked')?.value || 'none';
      const ci_prior_fibrinolytic = document.getElementById('ci_prior_fibrinolytic')?.checked || false;
      const ci_coagulopathy_anticoagulant = document.getElementById('ci_coagulopathy_anticoagulant')?.checked || false;
      const ci_pregnancy_postpartum_1w = document.getElementById('ci_pregnancy_postpartum_1w')?.checked || false;
      const ci_pde5_inhibitor = document.getElementById('ci_pde5_inhibitor')?.checked || false;

      const hasCad = document.getElementById('ud_cad')?.checked || false;
      const ud_cad_hosp_status = hasCad ? (document.querySelector('input[name="ud_cad_hosp_status"]:checked')?.value || 'ratchaburi') : 'none';
      const ud_cad_pci = hasCad && document.getElementById('ud_cad_tx_pci')?.checked || false;
      const ud_cad_cabg = hasCad && document.getElementById('ud_cad_tx_cabg')?.checked || false;
      const ud_cad_meds = hasCad && document.getElementById('ud_cad_tx_meds')?.checked || false;
      const ud_cad_hosp_name = hasCad ? (document.getElementById('ud_cad_hosp_name')?.value.trim() || '') : '';

      newPatient = {
        id: recordId,
        queue_number: queueNumber,
        hn: randomHn,
        name: patientName,
        age: patientAge,
        gender: gender,
        chief_complaint: 'chest_pain',
        chief_complaint_title: 'เจ็บแน่นหน้าอก',
        status: recordStatus,
        timestamp: new Date().toISOString(),
        durationVal,
        durationUnit,
        chestpainPainScore,
        chestpainOnsetMode,
        chestpainLocs,
        chestpainRads,
        chestpainChars,
        chestpainAnginaExertion,
        chestpainAnginaOver20m,
        chestpainNtgHx,
        chestpainNtgCurrent,
        chestpain_rf_diaphoresis,
        chestpain_rf_syncope,
        chestpain_rf_dyspnea,
        chestpainDyspneaPatterns,
        chestpain_rf_orthopnea,
        chestpain_rf_palpitation,
        chestpain_rf_hemoptysis,
        chestpain_rf_calf_swelling,
        chestpain_abdpain,
        chestpainAbdpainLocs,
        chestpainAbdpainChars,
        chestpainAbdpainRads,
        chestpain_pulm_travel,
        chestpain_pulm_bedridden,
        chestpain_pulm_cancer_ocp,
        chestpain_gi_heartburn_up,
        chestpain_gi_regurgitation,
        chestpain_gi_post_meal,
        chestpain_gi_dysphagia,
        chestpain_gi_severe_emesis,
        chestpain_msk_tender,
        chestpain_msk_movement,
        chestpain_msk_heavy_lifting,
        chestpain_msk_trauma,
        chestpainTraumaDetail,
        ci_ich_tumor_avm,
        ci_ischemic_stroke,
        ci_cns_surgery_3m,
        ci_major_surgery_3w,
        ci_head_facial_trauma_3m,
        ci_internal_bleeding,
        ci_prior_fibrinolytic,
        ci_coagulopathy_anticoagulant,
        ci_pregnancy_postpartum_1w,
        ci_pde5_inhibitor,
        ud_cad_hosp_status,
        ud_cad_pci,
        ud_cad_cabg,
        ud_cad_meds,
        ud_cad_hosp_name,
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
      p.chestpain_rf_diaphoresis || p.chestpain_rf_syncope || p.chestpain_rf_orthopnea ||
      p.chestpain_rf_hemoptysis || p.chestpain_rf_calf_swelling ||
      (p.chestpain_rf_dyspnea && (p.chestpainDyspneaPatterns?.includes('sudden_onset') || p.chestpainDyspneaPatterns?.includes('continuous'))) ||
      (p.chestpainChars?.includes('tearing_sharp') && p.chestpainOnsetMode === 'sudden_peak') ||
      (p.chestpainChars?.includes('crushing_heavy') && (p.chestpainAnginaOver20m || p.chestpainAnginaExertion === 'rest'))
    );
  },

  evaluateRedFlags(patient) {
    const redFlags = [];
    if (patient.chestpain_rf_diaphoresis || patient.chestpain_rf_syncope) {
      redFlags.push({
        key: 'cardiogenic_shock',
        textTh: 'ภาวะช็อก / เหงื่อแตกตัวเย็นซีด / หน้ามืดหมดสติ (Impending Cardiogenic Shock / Syncope)',
        risk: 'เสี่ยงภาวะกล้ามเนื้อหัวใจขาดเลือดรุนแรงร่วมกับช็อก (Cardiogenic Shock) หรือหัวใจเต้นผิดจังหวะอันตราย (Malignant Arrhythmia) ต้องทำ 12-lead EKG ภายใน 10 นาที'
      });
    }
    if ((patient.chestpainChars?.includes('tearing_sharp') || patient.chestpainRads?.includes('scapula')) && patient.chestpainOnsetMode === 'sudden_peak') {
      redFlags.push({
        key: 'aortic_dissection',
        textTh: 'เจ็บเสียบแทงฉีกขาดรุนแรงฉับพลันทะลุสะบักหลัง (Suspected Acute Aortic Dissection)',
        risk: 'เสี่ยงหลอดเลือดแดงใหญ่ฉีกขาดเฉียบพลัน (Stanford Type A/B) ห้ามให้ยา Antiplatelet/Anticoagulant ก่อนตัดโรค วัด BP 2 แขน'
      });
    }
    if (patient.chestpain_rf_dyspnea && (patient.chestpain_rf_hemoptysis || patient.chestpain_rf_calf_swelling || patient.chestpain_pulm_travel || patient.chestpain_pulm_bedridden)) {
      redFlags.push({
        key: 'pulmonary_embolism',
        textTh: 'เจ็บหน้าอกร่วมกับหอบเหนื่อยฉับพลัน / ขาบวม / ไอเป็นเลือด (Suspected Pulmonary Embolism)',
        risk: 'เสี่ยงภาวะลิ่มเลือดอุดกั้นในปอดเฉียบพลัน (Acute PE with Right Heart Strain) ประเมิน SpO2 และพิจารณา CTPA'
      });
    }
    if ((patient.chestpainChars?.includes('crushing_heavy') || patient.chestpainChars?.includes('tight_dyspneic')) && 
        (patient.chestpainAnginaOver20m || patient.chestpainAnginaExertion === 'rest' || patient.chestpainRads?.includes('left_arm_shoulder') || patient.chestpainRads?.includes('neck_jaw'))) {
      redFlags.push({
        key: 'acute_coronary_syndrome',
        textTh: 'เจ็บแน่นเหมือนโดนของทับหน้าอก ต่อเนื่องเกิน 20 นาที หรือเจ็บขณะพัก (Typical Angina / Suspected ACS)',
        risk: 'เสี่ยงกล้ามเนื้อหัวใจขาดเลือดเฉียบพลัน (STEMI / NSTEMI / High-risk Unstable Angina) ต้องส่งตรวจ EKG 12 สายและ Cardiac Enzymes ทันที'
      });
    }
    if (patient.chestpain_rf_orthopnea || (patient.chestpain_rf_dyspnea && patient.chestpainDyspneaPatterns?.includes('orthopnea'))) {
      redFlags.push({
        key: 'pulmonary_edema',
        textTh: 'แน่นหน้าอกร่วมกับนอนราบไม่ได้ หอบเหนื่อยรุนแรง (Acute Pulmonary Edema / LV Failure)',
        risk: 'เสี่ยงภาวะหัวใจวายน้ำท่วมปอดเฉียบพลัน ควรฟัง Crepitations ในปอด และประเมิน CXR upright'
      });
    }
    if (patient.chestpain_gi_severe_emesis) {
      redFlags.push({
        key: 'boerhaave_perforation',
        textTh: 'มีอาการอาเจียนรุนแรงนำมาก่อนเจ็บแน่นหน้าอก (Suspected Boerhaave Syndrome)',
        risk: 'เสี่ยงภาวะหลอดอาหารฉีกขาดทะลุ (Esophageal Perforation / Mediastinitis) เป็นภาวะฉุกเฉินทางศัลยกรรมทรวงอก'
      });
    }
    return redFlags;
  },

  updateOutputs(patient) {
    updateChestPainOutputs(patient);
  },

  generateCds(patient, ctx) {
    const { rfs, ddxList, workupList, managementList } = ctx;
    if (rfs.some(r => r.key === 'aortic_dissection')) {
      ddxList.push('1. Acute Aortic Dissection (Stanford Type A/B) — เจ็บฉีกขาดรุนแรงฉับพลันร้าวสะบักหลัง');
      ddxList.push('2. Acute Coronary Syndrome (STEMI / NSTEMI)');
      ddxList.push('3. Acute Pulmonary Embolism');
      workupList.push('• ตรวจวัดความดันโลหิตแขนทั้ง 2 ข้าง (Bilateral arm BP) และคลำ Pulse Deficit');
      workupList.push('• 12-lead EKG ภายใน 10 นาที, CXR upright (ดู Widened Mediastinum)');
      workupList.push('• Urgent CT Aortogram (CTA Chest & Abdomen), Bedside Echo / POCUS');
      managementList.push('• 🛑 ห้ามให้ยาละลายลิ่มเลือด (Fibrinolytic) หรือยาต้านเกล็ดเลือดจนกว่าจะตัดภาวะ Aortic Dissection ได้!');
      managementList.push('• ควบคุม Heart Rate (< 60 bpm) และ SBP (100-120 mmHg) ด้วย IV Beta-blocker (เช่น Esmolol / Labetalol)');
    } else if (rfs.some(r => r.key === 'pulmonary_embolism')) {
      ddxList.push('1. Acute Pulmonary Embolism (PE) with/without DVT');
      ddxList.push('2. Acute Coronary Syndrome (ACS)');
      ddxList.push('3. Acute Pleuritis / Pneumothorax / Pneumonia');
      workupList.push('• 12-lead EKG, SpO2 monitoring, Arterial Blood Gas (ABG)');
      workupList.push('• ประเมิน Wells Score for PE, ส่ง D-dimer หรือ CT Pulmonary Angiogram (CTPA) ทันที');
      workupList.push('• Bedside Ultrasound (POCUS): ประเมิน RV Strain (McConnell sign) และ Compression Ultrasound ขา');
      managementList.push('• ให้ออกซิเจนรักษาระดับ SpO2 > 94%, เปิดเส้น IV ระมัดระวังการโหลดสารน้ำมากเกินไปหากมี RV failure');
      managementList.push('• พิจารณา Anticoagulation (UFH / LMWH) ทันทีเมื่อยืนยันหรือสงสัยสูงและไม่มีข้อห้ามเลือดออก');
    } else {
      ddxList.push('1. Acute Coronary Syndrome (STEMI / NSTEMI / Unstable Angina)');
      ddxList.push('2. Gastroesophageal Reflux Disease (GERD) / Esophageal Spasm / Peptic Ulcer');
      ddxList.push('3. Costochondritis / Musculoskeletal Chest Wall Pain');
      workupList.push('• 12-lead EKG ภายใน 10 นาที (เปรียบเทียบแผ่นเดิมถ้ามี) และทำ Serial EKG หากอาการยังไม่ทุเลา');
      workupList.push('• High-sensitivity Troponin I/T, CBC, BUN/Cr, Electrolytes, CXR');
      managementList.push('• ประเมินข้อห้ามใช้ยา Fibrinolytic และ Nitroglycerin (ห้ามให้ NTG เด็ดขาดหากใช้ PDE-5 inhibitor เช่น Viagra หรือ SBP < 90 mmHg)');
      managementList.push('• หากเข้าได้กับ ACS และไม่มีข้อห้าม: Dual Antiplatelet (ASA 300 mg เคี้ยว + P2Y12 inhibitor), พิจารณา PCI / Reperfusion guideline');
    }
  }
});
