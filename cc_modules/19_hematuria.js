// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 19_hematuria.js
// อาการนำ: ปัสสาวะเป็นเลือด (Hematuria / Blood in Urine)
// รองรับ Zero Default Bias, ซ่อน Red Flags, Progressive Disclosure,
// Universal Date/Time, Rapid Note De-duplication และ TDD Core Guard
// =========================================================================

// --- Pain Score Touch State Tracking ---
let hematuriaPainScoreTouched = false;

function clearHematuriaPainScore() {
  hematuriaPainScoreTouched = false;
  const slider = document.getElementById('hematuriaPainScore');
  if (slider) slider.value = 0;
  const emojiEl = document.getElementById('hematuriaPainScoreEmoji');
  const textEl = document.getElementById('hematuriaPainScoreText');
  const badgeEl = document.getElementById('hematuriaPainScoreBadge');
  const clearBtn = document.getElementById('hematuriaPainScoreClearBtn');
  if (emojiEl) emojiEl.textContent = '⚪';
  if (textEl) textEl.textContent = 'ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)';
  if (badgeEl) badgeEl.className = 'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all';
  if (clearBtn) clearBtn.classList.add('hidden');
}

function handleHematuriaPainScoreChange(val) {
  hematuriaPainScoreTouched = true;
  const num = parseInt(val, 10);
  const emojiEl = document.getElementById('hematuriaPainScoreEmoji');
  const textEl = document.getElementById('hematuriaPainScoreText');
  const badgeEl = document.getElementById('hematuriaPainScoreBadge');
  const clearBtn = document.getElementById('hematuriaPainScoreClearBtn');
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

function setHematuriaPainScore(score) {
  hematuriaPainScoreTouched = true;
  const slider = document.getElementById('hematuriaPainScore');
  if (slider) {
    slider.value = score;
    handleHematuriaPainScoreChange(score);
  }
}

// --- Progressive Disclosure Handlers ---
function handleHematuriaClotToggle(cb) {
  const subContainer = document.getElementById('hematuriaClotSubContainer');
  if (cb && cb.checked) {
    if (subContainer) subContainer.classList.remove('hidden');
  } else {
    if (subContainer) subContainer.classList.add('hidden');
    document.querySelectorAll('input[name="hematuriaClotTypes"]').forEach(el => { el.checked = false; });
  }
}

function handleHematuriaObsToggle(cb) {
  const subContainer = document.getElementById('hematuriaObsSubContainer');
  if (cb && cb.checked) {
    if (subContainer) subContainer.classList.remove('hidden');
  } else {
    if (subContainer) subContainer.classList.add('hidden');
    document.querySelectorAll('input[name="hematuriaObsTypes"]').forEach(el => { el.checked = false; });
  }
}

function handleHematuriaPainToggle(cb) {
  const subContainer = document.getElementById('hematuriaPainSubContainer');
  if (cb && cb.checked) {
    if (subContainer) subContainer.classList.remove('hidden');
  } else {
    if (subContainer) subContainer.classList.add('hidden');
    document.querySelectorAll('input[name="hematuriaPainType"]').forEach(el => { el.checked = false; });
    clearHematuriaPainScore();
  }
}

function handleHematuriaVoidingItemChange(cb) {
  if (cb && cb.checked) {
    const sysNoneCb = document.querySelector('input[name="hematuriaSystemicSigns"][value="rf_systemic_none"]');
    if (sysNoneCb) sysNoneCb.checked = false;
  }
}

function handleHematuriaVoidingNone(cb) {
  // Deprecated: No-op for backward compatibility
}

function handleHematuriaPainTypeChange(radio) {
  const container = document.getElementById('hematuriaPainSliderContainer');
  if (!container) return;
  if (radio && radio.value === 'pain_painless' && radio.checked) {
    container.classList.add('hidden');
    clearHematuriaPainScore();
  } else if (radio && radio.checked) {
    container.classList.remove('hidden');
  }
}

function handleHematuriaClotMasterChange(radio) {
  const subContainer = document.getElementById('hematuriaClotSubContainer');
  if (!subContainer) return;
  if (radio && radio.value === 'clot_master_yes' && radio.checked) {
    subContainer.classList.remove('hidden');
    const clotCb = document.getElementById('hematuriaHasClots');
    if (clotCb) clotCb.checked = true;
  } else {
    subContainer.classList.add('hidden');
    document.querySelectorAll('input[name="hematuriaClotTypes"]').forEach(cb => { cb.checked = false; });
    const clotCb = document.getElementById('hematuriaHasClots');
    if (clotCb) clotCb.checked = false;
  }
}

function handleHematuriaObsMasterChange(radio) {
  const subContainer = document.getElementById('hematuriaObsSubContainer');
  if (!subContainer) return;
  if (radio && radio.value === 'obs_master_yes' && radio.checked) {
    subContainer.classList.remove('hidden');
    const obsCb = document.getElementById('hematuriaHasObs');
    if (obsCb) obsCb.checked = true;
  } else {
    subContainer.classList.add('hidden');
    document.querySelectorAll('input[name="hematuriaObsTypes"]').forEach(cb => { cb.checked = false; });
    const obsCb = document.getElementById('hematuriaHasObs');
    if (obsCb) obsCb.checked = false;
  }
}

function handleHematuriaTraumaMasterChange(radio) {
  const subContainer = document.getElementById('hematuriaTraumaSubContainer');
  if (!subContainer) return;
  if (radio && radio.value === 'trauma_master_yes' && radio.checked) {
    subContainer.classList.remove('hidden');
  } else {
    subContainer.classList.add('hidden');
    document.querySelectorAll('input[name="hematuriaTraumaTypes"]').forEach(cb => { cb.checked = false; });
  }
}

function handleHematuriaSystemicNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="hematuriaSystemicSigns"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function handleHematuriaSystemicItemChange(el) {
  if (el && el.checked) {
    const noneCb = document.querySelector('input[name="hematuriaSystemicSigns"][value="rf_systemic_none"]');
    if (noneCb) noneCb.checked = false;
  }
}

function handleHematuriaMedsNoneToggle(el) {
  if (el && el.checked) {
    document.querySelectorAll('input[name="hematuriaMeds"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
    const unkEl = document.getElementById('currentMedsUnknown');
    if (unkEl) unkEl.checked = false;
  }
}

function handleHematuriaMedsItemChange(el) {
  if (el && el.checked) {
    const noneCb = document.querySelector('input[name="hematuriaMeds"][value="med_bleeding_none"]');
    if (noneCb) noneCb.checked = false;
  }
}

function handleHematuriaMedsUnknownToggle(el) {
  if (el && el.checked) {
    const noneCb = document.querySelector('input[name="hematuriaMeds"][value="med_bleeding_none"]');
    if (noneCb) noneCb.checked = false;
  }
}

// --- CDS Logic ---
function evaluateHematuriaRedFlags(patient) {
  const redFlags = [];
  if (!patient || (patient.chief_complaint !== 'hematuria' && patient.chief_complaint_title !== 'ปัสสาวะเป็นเลือด')) return redFlags;

  const systemic = Array.isArray(patient.hematuriaSystemicSigns) ? patient.hematuriaSystemicSigns : [];
  const clots = Array.isArray(patient.hematuriaClotTypes) ? patient.hematuriaClotTypes : [];
  const obs = Array.isArray(patient.hematuriaObsTypes) ? patient.hematuriaObsTypes : [];
  const trauma = Array.isArray(patient.hematuriaTraumaTypes) ? patient.hematuriaTraumaTypes : [];
  const meds = Array.isArray(patient.hematuriaMeds) ? patient.hematuriaMeds : [];
  const malignancy = Array.isArray(patient.hematuriaMalignancyRisks) ? patient.hematuriaMalignancyRisks : [];

  const age = parseInt(patient.age, 10) || 0;
  const vs = patient.vital_signs || {};
  const sbp = vs.sbp ? parseInt(vs.sbp, 10) : null;
  const pr = vs.pr ? parseInt(vs.pr, 10) : null;
  const shockIndex = (sbp && pr) ? (pr / sbp) : 0;

  // 1. Hemorrhagic Shock / Hemodynamic Instability
  const hasShockSigns = systemic.includes('rf_syncope_hypotension') || systemic.includes('rf_marked_pallor') ||
    (sbp !== null && sbp < 90) || (pr !== null && pr > 120) || (shockIndex >= 0.9);
  if (hasShockSigns) {
    redFlags.push({
      key: 'rf_hemodynamic_shock',
      level: 1,
      textTh: 'Active Massive Hematuria / เสี่ยงภาวะช็อกจากการเสียเลือด',
      risk: 'เสี่ยงต่อภาวะเสียเลือดเฉียบพลัน ความดันตก และภาวะแทรกซ้อนของภาวะช็อก',
      suggestedAction: 'เปิดเส้น IV สารน้ำเบอร์ใหญ่ (18G) 2 เส้น, เจาะ CBC, Coagulogram, Type & Screen จองเลือด PRC, เตรียมห้อง Resuscitation',
      title: 'Active Massive Hematuria / เสี่ยงภาวะช็อกจากการเสียเลือด',
      severity: 'critical',
      guidance: 'เปิดเส้น IV สารน้ำเบอร์ใหญ่ (18G) จำนวน 2 เส้น, เจาะ CBC, Coagulogram, Type & Screen จองเลือด PRC, เตรียมห้อง Resuscitation'
    });
  }

  // 2. Clot Retention & Bladder Tamponade
  const hasClotRetention = (patient.hematuriaClotMaster === 'clot_master_yes' && clots.includes('clot_large_amorphous') &&
    (patient.hematuriaObsMaster === 'obs_master_yes' && obs.includes('obs_unable_to_void')));
  if (hasClotRetention) {
    redFlags.push({
      key: 'rf_clot_retention_tamponade',
      level: 1,
      textTh: 'Clot Retention / Bladder Tamponade (ก้อนเลือดอุดตันท่อปัสสาวะเฉียบพลัน)',
      risk: 'กระเพาะปัสสาวะขยายตัวตึงแน่น เสี่ยงต่อภาวะกระเพาะปัสสาวะแตกและไตวายเฉียบพลัน',
      suggestedAction: 'ใส่ Three-way Foley Catheter ขนาด 20-24 Fr ล้างลิ่มเลือด (Manual clot irrigation) และต่อ Continuous Bladder Irrigation (CBI) ทันที',
      title: 'Clot Retention / Bladder Tamponade (ก้อนเลือดอุดตันท่อปัสสาวะเฉียบพลัน)',
      severity: 'critical',
      guidance: 'ภาวะฉุกเฉินทางศัลยกรรมระบบปัสสาวะ ใส่ Three-way Foley Catheter ขนาด 20-24 Fr ล้างลิ่มเลือด (Manual clot irrigation) และต่อ Continuous Bladder Irrigation (CBI) ทันที'
    });
  }

  // 3. Painless Gross Hematuria in Older Adults (Urologic Malignancy Suspicion)
  const isPainless = patient.hematuriaPainType === 'pain_painless';
  const hasMalignancyRisk = age >= 50 || malignancy.includes('risk_heavy_smoker') || malignancy.includes('risk_chemical_dyes');
  if (isPainless && hasMalignancyRisk) {
    redFlags.push({
      key: 'rf_painless_gross_hematuria_malignancy',
      level: 2,
      textTh: 'Painless Gross Hematuria / สงสัยโรคมะเร็งระบบทางเดินปัสสาวะ (Bladder/Renal Cancer)',
      risk: 'เสี่ยงต่อโรคมะเร็งกระเพาะปัสสาวะหรือมะเร็งไตที่ยังไม่แสดงอาการปวด',
      suggestedAction: 'ตรวจ Urinalysis, Urine Cytology, นัดทำ Flexible Cystoscopy และ CT Urogram ภายใน 1-2 สัปดาห์',
      title: 'Painless Gross Hematuria / สงสัยโรคมะเร็งระบบทางเดินปัสสาวะ (Bladder/Renal Cancer)',
      severity: 'high',
      guidance: 'ปัสสาวะเป็นเลือดสดโดยไม่ปวดในผู้สูงอายุหรือผู้สูบบุหรี่จัด ห้ามมองข้าม ต้องตรวจ Urinalysis, Urine Cytology, นัดทำ Flexible Cystoscopy และ CT Urogram'
    });
  }

  // 4. Acute Glomerulonephritis / Nephritic Syndrome
  const isColaUrine = patient.hematuriaColor === 'color_cola_tea';
  const hasNephriticSigns = systemic.includes('rf_facial_pedal_edema') || systemic.includes('rf_oliguria_anuria') || (sbp !== null && sbp >= 140);
  if (isColaUrine && hasNephriticSigns) {
    redFlags.push({
      key: 'rf_nephritic_syndrome',
      level: 2,
      textTh: 'Nephritic Syndrome / สงสัยภาวะเนื้อไตอักเสบเฉียบพลัน (Glomerulonephritis)',
      risk: 'เสี่ยงต่อภาวะไตวายเฉียบพลัน ความดันโลหิตสูงวิกฤต และน้ำคั่งปอด',
      suggestedAction: 'ตรวจ Urine RBC casts, Proteinuria, BUN/Cr, Electrolytes, C3/C4, ปรึกษาอายุรแพทย์โรคไต',
      title: 'Nephritic Syndrome / สงสัยภาวะเนื้อไตอักเสบเฉียบพลัน (Glomerulonephritis)',
      severity: 'high',
      guidance: 'ปัสสาวะสีน้ำโคล่า/ชาแก่ ร่วมกับหน้าบวม ขาบวม หรือความดันสูง ตรวจ Urine RBC casts, Proteinuria, BUN/Cr, Electrolytes, C3/C4, ปรึกษาอายุรแพทย์โรคไต'
    });
  }

  // 5. Obstructive Urolithiasis with Hematuria (Renal Colic)
  const isColicPain = patient.hematuriaPainType === 'pain_flank_colic';
  if (isColicPain) {
    redFlags.push({
      key: 'rf_obstructive_urolithiasis',
      level: 2,
      textTh: 'Renal / Ureteral Colic with Hematuria (สงสัยนิ่วท่อไตอุดกั้น)',
      risk: 'เสี่ยงต่อการอุดกั้นทางเดินปัสสาวะ ภาวะไตบวมน้ำ (Hydronephrosis) และการติดเชื้อรุนแรง',
      suggestedAction: 'ส่งตรวจ KUB Plain film หรือ CT KUB Non-contrast, ให้ยาแก้ปวด NSAIDs/Opioids IV, เฝ้าระวังไข้ติดเชื้อร่วม',
      title: 'Renal / Ureteral Colic with Hematuria (สงสัยนิ่วท่อไตอุดกั้น)',
      severity: 'medium',
      guidance: 'ปวดบิดเกร็งบั้นเอวร้าวลงขาหนีบร่วมกับปัสสาวะเป็นเลือด ส่งตรวจ KUB Plain film หรือ CT KUB Non-contrast, ให้ยาแก้ปวด NSAIDs/Opioids IV, เฝ้าระวังไข้ติดเชื้อร่วม'
    });
  }

  // 6. Urologic Trauma (Renal or Urethral Disruption)
  const hasTrauma = patient.hematuriaTraumaMaster === 'trauma_master_yes' &&
    (trauma.includes('hist_trauma_flank_pelvis') || trauma.includes('hist_straddle_injury') ||
     trauma.includes('hist_direct_genital_urethral_trauma') || trauma.includes('hist_blood_at_meatus'));
  if (hasTrauma) {
    const isMeatalBleed = trauma.includes('hist_blood_at_meatus') || trauma.includes('hist_straddle_injury');
    redFlags.push({
      key: 'rf_urologic_trauma',
      level: 1,
      textTh: 'Urologic Trauma / สงสัยการบาดเจ็บของไตหรือท่อทางเดินปัสสาวะ',
      risk: 'เสี่ยงต่อการฉีกขาดของไตหรือท่อปัสสาวะ (Urethral / Bladder disruption)',
      suggestedAction: isMeatalBleed
        ? '⚠️ ห้ามใส่สายสวนปัสสาวะทางท่อเด็ดขาด (ห้าม Blind Foley) ต้องทำ Retrograde Urethrogram (RUG) ก่อน'
        : 'ส่งตรวจ CT Abdomen with IV Contrast เพื่อประเมิน Renal injury AAST Grade',
      title: 'Urologic Trauma / สงสัยการบาดเจ็บของไตหรือท่อทางเดินปัสสาวะ',
      severity: 'high',
      guidance: isMeatalBleed
        ? '⚠️ ห้ามใส่สายสวนปัสสาวะทางท่อเด็ดขาด (ห้าม Blind Foley) หากมีเลือดออกที่ปลายท่อปัสสาวะหรือกระแทกหว่างขา ต้องทำ Retrograde Urethrogram (RUG) ก่อน'
        : 'มีประวัติอุบัติเหตุบั้นเอวหรือเชิงกราน ส่งตรวจ CT Abdomen with IV Contrast เพื่อประเมิน Renal injury AAST Grade'
    });
  }

  // 7. Anticoagulant-Induced Hematuria
  const hasAnticoagulant = meds.includes('med_warfarin') || meds.includes('med_doac');
  if (hasAnticoagulant) {
    redFlags.push({
      key: 'rf_anticoagulant_coagulopathy',
      level: 2,
      textTh: 'Anticoagulant-Associated Hematuria / ภาวะเลือดออกจากยาต้านการแข็งตัวของเลือด',
      risk: 'เสี่ยงต่อภาวะเลือดออกต่อเนื่องจากฤทธิ์ยาต้านการแข็งตัวของเลือดเกินขนาด',
      suggestedAction: 'ส่งตรวจ PT/INR, PTT, CBC และสืบค้นพยาธิสภาพทางเดินปัสสาวะซ่อนเร้นเสมอ',
      title: 'Anticoagulant-Associated Hematuria / ภาวะเลือดออกจากยาต้านการแข็งตัวของเลือด',
      severity: 'medium',
      guidance: 'ผู้ป่วยใช้ยา Warfarin หรือ DOACs ส่งตรวจ PT/INR, PTT, CBC และสืบค้นพยาธิสภาพทางเดินปัสสาวะซ่อนเร้นเสมอ'
    });
  }

  return redFlags;
}

// Register Module in Core System
registerCcModule({
  id: 'hematuria',
  recordCc: 'hematuria',
  titleTh: 'ปัสสาวะเป็นเลือด',
  titleEn: 'Hematuria / Blood in urine',
  icon: 'droplets',
  sectionDomId: 'hematuriaQuestionnaireSection',

  algorithm: {
    chiefComplaint: 'hematuria',
    titleTh: 'ปัสสาวะเป็นเลือด',
    schemaCode: 'hematuria',
    version: '2.0.0',
    redFlagDefinitions: [
      { key: 'rf_hemodynamic_shock', level: 1, textTh: 'Active Massive Hematuria / เสี่ยงภาวะช็อกจากการเสียเลือด (Hemorrhagic Shock)' },
      { key: 'rf_clot_retention_tamponade', level: 1, textTh: 'Clot Retention / Bladder Tamponade (ก้อนเลือดอุดตันท่อปัสสาวะเฉียบพลัน)' },
      { key: 'rf_urologic_trauma', level: 1, textTh: 'Urologic Trauma / สงสัยการบาดเจ็บของไตหรือท่อทางเดินปัสสาวะ' },
      { key: 'rf_painless_gross_hematuria_malignancy', level: 2, textTh: 'Painless Gross Hematuria / สงสัยโรคมะเร็งระบบทางเดินปัสสาวะ (Bladder/Renal Cancer)' },
      { key: 'rf_nephritic_syndrome', level: 2, textTh: 'Nephritic Syndrome / สงสัยภาวะเนื้อไตอักเสบเฉียบพลัน (Glomerulonephritis)' },
      { key: 'rf_obstructive_urolithiasis', level: 2, textTh: 'Renal / Ureteral Colic with Hematuria (สงสัยนิ่วท่อไตอุดกั้น)' },
      { key: 'rf_anticoagulant_coagulopathy', level: 2, textTh: 'Anticoagulant-Associated Hematuria / ภาวะเลือดออกจากยาต้านการแข็งตัวของเลือด' }
    ]
  },

  // --- HTML Template for Patient Intake Form ---
  formHtml: `
    <div id="hematuriaQuestionnaireSection" class="hidden space-y-6">

      <!-- CARD 1: ระยะเวลา ลักษณะสีปัสสาวะ และช่วงเวลาที่เลือดออก (Pain/Symptom Profile) -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="clock" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">1. ระยะเวลาและลักษณะของสีปัสสาวะ (Hematuria Profile)</h2>
            <p class="text-xs text-slate-500">ข้อมูลเริ่มต้นเกี่ยวกับระยะเวลา สี และช่วงเวลาที่ปัสสาวะเป็นเลือดของท่าน</p>
          </div>
        </div>

        <div class="space-y-5">
          <!-- 1.1 ระยะเวลาตั้งแต่เริ่มสังเกตเห็น -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              1.1 เริ่มสังเกตเห็นปัสสาวะเป็นเลือดมานานเท่าไรแล้ว? <span class="text-rose-500">*</span>
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div class="col-span-1 sm:col-span-2">
                <input type="number" id="hematuriaDurationVal" min="1" max="1000"
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm placeholder:text-slate-400 placeholder:font-normal"
                  placeholder="เช่น 2">
              </div>
              <div class="col-span-1">
                <select id="hematuriaDurationUnit"
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm">
                  <option value="minutes">นาที</option>
                  <option value="hours">ชั่วโมง</option>
                  <option value="days" selected>วัน</option>
                  <option value="weeks">สัปดาห์</option>
                  <option value="months">เดือน</option>
                  <option value="years">ปี</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 1.2 ลักษณะสีของน้ำปัสสาวะ -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              1.2 ลักษณะสีของน้ำปัสสาวะที่ท่านสังเกตเห็น <span class="text-rose-500">*</span>
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <label class="selectable-card relative flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="hematuriaColor" value="color_bright_red" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
                <div class="ml-2.5">
                  <span class="text-xs sm:text-sm font-semibold block text-slate-800">สีแดงสด หรือแดงเข้มเหมือนเลือดสด</span>
                  <span class="text-[11px] text-slate-500">มีสีแดงจัดเหมือนเลือด ปริมาณเลือดออกค่อนข้างมาก</span>
                </div>
              </label>

              <label class="selectable-card relative flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="hematuriaColor" value="color_pink_wash" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
                <div class="ml-2.5">
                  <span class="text-xs sm:text-sm font-semibold block text-slate-800">สีชมพูหรือแดงจาง เหมือนน้ำล้างเนื้อ</span>
                  <span class="text-[11px] text-slate-500">สีชมพูเรื่อๆ หรือสีจางคล้ายน้ำล้างเนื้อสัตว์</span>
                </div>
              </label>

              <label class="selectable-card relative flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="hematuriaColor" value="color_cola_tea" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
                <div class="ml-2.5">
                  <span class="text-xs sm:text-sm font-semibold block text-slate-800">สีน้ำตาลเข้ม สีน้ำโคล่า หรือสีน้ำชาแก่</span>
                  <span class="text-[11px] text-slate-500">สีเข้มคล้ำเหมือนน้ำอัดลมโคล่า ชาดำ หรือน้ำปลา</span>
                </div>
              </label>

              <label class="selectable-card relative flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="hematuriaColor" value="color_turbid_cloudy" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
                <div class="ml-2.5">
                  <span class="text-xs sm:text-sm font-semibold block text-slate-800">ปัสสาวะขุ่น มีตะกอนสีแดงหรือชมพู</span>
                  <span class="text-[11px] text-slate-500">น้ำปัสสาวะไม่ใส มีฝ้าขาวหรือตะกอนสีแดงปน</span>
                </div>
              </label>
            </div>
          </div>

          <!-- 1.3 ช่วงเวลาที่เลือดออกในสายปัสสาวะ -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              1.3 ช่วงเวลาที่สังเกตเห็นเลือดขณะปัสสาวะ (Timing) <span class="text-rose-500">*</span>
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <label class="selectable-card relative flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="hematuriaTiming" value="timing_total" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
                <div class="ml-2.5">
                  <span class="text-xs sm:text-sm font-semibold block text-slate-800">แดงตลอดสายตั้งแต่เริ่มจนสุด</span>
                  <span class="text-[11px] text-slate-500">ปัสสาวะเป็นสีแดงสม่ำเสมอตั้งแต่หยดแรกจนหมด</span>
                </div>
              </label>

              <label class="selectable-card relative flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="hematuriaTiming" value="timing_initial" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
                <div class="ml-2.5">
                  <span class="text-xs sm:text-sm font-semibold block text-slate-800">แดงเฉพาะช่วงแรกที่เริ่มปัสสาวะ</span>
                  <span class="text-[11px] text-slate-500">ช่วงแรกที่ปล่อยปัสสาวะเป็นเลือด หลังจากนั้นค่อยๆ ใสขึ้น</span>
                </div>
              </label>

              <label class="selectable-card relative flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="hematuriaTiming" value="timing_terminal" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
                <div class="ml-2.5">
                  <span class="text-xs sm:text-sm font-semibold block text-slate-800">แดงเฉพาะช่วงท้ายตอนใกล้สุด</span>
                  <span class="text-[11px] text-slate-500">เริ่มแรกปัสสาวะใสดี แต่มีเลือดหยดหรือสีแดงเข้มขึ้นช่วงท้าย</span>
                </div>
              </label>

              <label class="selectable-card relative flex items-start p-3 rounded-xl cursor-pointer">
                <input type="radio" name="hematuriaTiming" value="timing_intermittent" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
                <div class="ml-2.5">
                  <span class="text-xs sm:text-sm font-semibold block text-slate-800">เป็นบางครั้ง สลับกับใสเป็นปกติ</span>
                  <span class="text-[11px] text-slate-500">บางครั้งถ่ายเป็นเลือด บางครั้งก็ใสปกติ เป็นๆ หายๆ</span>
                </div>
              </label>

              <label class="selectable-card relative flex items-start p-3 rounded-xl cursor-pointer sm:col-span-2">
                <input type="radio" name="hematuriaTiming" value="timing_unnoticed" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
                <div class="ml-2.5">
                  <span class="text-xs sm:text-sm font-semibold block text-slate-800">ไม่ได้สังเกต</span>
                  <span class="text-[11px] text-slate-500">ไม่ได้สังเกตช่วงเวลาที่ออกชัดเจน หรือจำไม่ได้</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 2: ปัญหาการขับถ่ายปัสสาวะและอาการปวด (Voiding Issues & Pain) -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="droplet" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">2. ปัญหาการขับถ่ายปัสสาวะ (Voiding Issues & Associated Pain)</h2>
            <p class="text-xs text-slate-500">ประเมินภาวะลิ่มเลือด ปัญหาการขับถ่ายปัสสาวะ และอาการปวดร่วม (เลือกได้มากกว่า 1 ข้อ)</p>
          </div>
        </div>

        <div class="space-y-3 text-xs sm:text-sm">
          <!-- 1. มีลิ่มเลือดออกมากับปัสสาวะ -->
          <div>
            <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer border border-slate-200">
              <input type="checkbox" id="hematuriaHasClots" onchange="handleHematuriaClotToggle(this)" class="rounded text-medical-600 focus:ring-medical-500 h-4 w-4">
              <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีลิ่มเลือดออกมากับปัสสาวะ</span>
            </label>

            <!-- Sub-container for Clots -->
            <div id="hematuriaClotSubContainer" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2 space-y-2">
              <span class="block text-xs font-bold text-slate-800 mb-1 flex items-center">
                <i data-lucide="corner-down-right" class="w-3.5 h-3.5 mr-1 text-medical-600"></i> ระบุลักษณะของลิ่มเลือดที่พบ (เลือกได้มากกว่า 1 ข้อ):
              </span>
              <div class="space-y-1.5 text-xs">
                <label class="selectable-card bg-white p-2.5 rounded-lg flex items-start cursor-pointer border border-slate-200">
                  <input type="checkbox" name="hematuriaClotTypes" value="clot_small_specks" class="mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4">
                  <span class="ml-3 font-medium text-slate-800">มีลิ่มเลือดเป็นขุย หรือเศษเส้นเลือดเล็กๆ ปนเล็กน้อย</span>
                </label>
                <label class="selectable-card bg-white p-2.5 rounded-lg flex items-start cursor-pointer border border-slate-200">
                  <input type="checkbox" name="hematuriaClotTypes" value="clot_large_amorphous" class="mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4">
                  <span class="ml-3 font-semibold text-slate-800">มีลิ่มเลือดก้อนใหญ่ เป็นก้อนวุ้นหนา หรือแผ่นลิ่มเลือดสีคล้ำ</span>
                </label>
                <label class="selectable-card bg-white p-2.5 rounded-lg flex items-start cursor-pointer border border-slate-200">
                  <input type="checkbox" name="hematuriaClotTypes" value="clot_vermiform_string" class="mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4">
                  <span class="ml-3 font-semibold text-slate-800">มีลิ่มเลือดลักษณะเป็นเส้นยาวเรียวคล้ายไส้เดือน (Ureteral cast)</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 2. ปัญหาปัสสาวะไม่ออก หรือสะดุด/ขัด -->
          <div>
            <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer border border-slate-200">
              <input type="checkbox" id="hematuriaHasObs" onchange="handleHematuriaObsToggle(this)" class="rounded text-medical-600 focus:ring-medical-500 h-4 w-4">
              <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">ปัญหาปัสสาวะไม่ออก หรือสะดุด/ขัด</span>
            </label>

            <!-- Sub-container for Obstruction -->
            <div id="hematuriaObsSubContainer" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2 space-y-2">
              <span class="block text-xs font-bold text-slate-800 mb-1 flex items-center">
                <i data-lucide="corner-down-right" class="w-3.5 h-3.5 mr-1 text-medical-600"></i> ระบุลักษณะปัญหาการขับถ่ายปัสสาวะ (เลือกได้มากกว่า 1 ข้อ):
              </span>
              <div class="space-y-1.5 text-xs">
                <label class="selectable-card bg-white p-2.5 rounded-lg flex items-start cursor-pointer border border-slate-200">
                  <input type="checkbox" name="hematuriaObsTypes" value="obs_unable_to_void" class="mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4">
                  <span class="ml-3 font-bold text-slate-800">ปัสสาวะไม่ออกเลย ปวดเบ่งตึงแน่นท้องน้อยอย่างรุนแรง (Acute Clot Retention)</span>
                </label>
                <label class="selectable-card bg-white p-2.5 rounded-lg flex items-start cursor-pointer border border-slate-200">
                  <input type="checkbox" name="hematuriaObsTypes" value="obs_interrupted_stream" class="mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4">
                  <span class="ml-3 font-semibold text-slate-800">ลำปัสสาวะสะดุด หยุดไหลกะทันหันขณะปัสสาวะ</span>
                </label>
                <label class="selectable-card bg-white p-2.5 rounded-lg flex items-start cursor-pointer border border-slate-200">
                  <input type="checkbox" name="hematuriaObsTypes" value="obs_straining_dribbling" class="mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4">
                  <span class="ml-3 font-medium text-slate-800">ต้องออกแรงเบ่งอย่างมาก ปัสสาวะออกทีละหยด</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 3. มีอาการปวดร่วมด้วย -->
          <div>
            <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer border border-slate-200">
              <input type="checkbox" id="hematuriaHasPain" onchange="handleHematuriaPainToggle(this)" class="rounded text-medical-600 focus:ring-medical-500 h-4 w-4">
              <span class="ml-3 text-xs sm:text-sm font-semibold text-slate-800">มีอาการปวดร่วมด้วย</span>
            </label>

            <!-- Sub-container for Pain & Pain Score -->
            <div id="hematuriaPainSubContainer" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2 space-y-4">
              <div>
                <span class="block text-xs font-bold text-slate-800 mb-2 flex items-center">
                  <i data-lucide="corner-down-right" class="w-3.5 h-3.5 mr-1 text-medical-600"></i> ระบุลักษณะและตำแหน่งอาการปวด (เลือกข้อที่ตรงที่สุด):
                </span>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <label class="selectable-card bg-white relative flex items-start p-3 rounded-xl cursor-pointer border border-slate-200">
                    <input type="radio" name="hematuriaPainType" value="pain_flank_colic" onchange="handleHematuriaPainTypeChange(this)" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
                    <div class="ml-2.5">
                      <span class="text-xs sm:text-sm font-semibold block text-slate-800">ปวดบิดเกร็งบั้นเอว</span>
                      <span class="text-[11px] text-slate-500">ปวดบิดเป็นพักๆ ที่เอวหรือสีข้าง ร้าวลงขาหนีบ (Colicky)</span>
                    </div>
                  </label>

                  <label class="selectable-card bg-white relative flex items-start p-3 rounded-xl cursor-pointer border border-slate-200">
                    <input type="radio" name="hematuriaPainType" value="pain_suprapubic" onchange="handleHematuriaPainTypeChange(this)" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
                    <div class="ml-2.5">
                      <span class="text-xs sm:text-sm font-semibold block text-slate-800">ปวดตื้อแน่นท้องน้อย</span>
                      <span class="text-[11px] text-slate-500">ปวดหน่วง ตึงแน่นบริเวณหัวเหน่าหรือท้องน้อย</span>
                    </div>
                  </label>

                  <label class="selectable-card bg-white relative flex items-start p-3 rounded-xl cursor-pointer border border-slate-200">
                    <input type="radio" name="hematuriaPainType" value="pain_dysuria_burning" onchange="handleHematuriaPainTypeChange(this)" class="mt-0.5 text-medical-600 focus:ring-medical-500 h-4 w-4">
                    <div class="ml-2.5">
                      <span class="text-xs sm:text-sm font-semibold block text-slate-800">ปวดแสบขัดปลายท่อปัสสาวะ</span>
                      <span class="text-[11px] text-slate-500">เจ็บแปลบหรือแสบร้อนขณะปัสสาวะ (Dysuria)</span>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Pain Score Scale (0-10) with Emoji Faces -->
              <div id="hematuriaPainSliderContainer" class="pt-2 border-t border-slate-200">
                <div class="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label class="block text-xs font-semibold text-slate-800 uppercase tracking-wider">
                      ระดับความเจ็บปวดในขณะนี้ (Pain Score: 0 - 10)
                    </label>
                    <div class="flex items-center space-x-2">
                      <span id="hematuriaPainScoreBadge" class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all">
                        <span id="hematuriaPainScoreEmoji" class="text-base">⚪</span>
                        <span id="hematuriaPainScoreText">ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)</span>
                      </span>
                      <button type="button" id="hematuriaPainScoreClearBtn" onclick="clearHematuriaPainScore()" class="text-xs text-slate-400 hover:text-rose-600 underline hidden transition" title="ล้างค่าเพื่อให้เป็นไม่ได้ระบุ">ล้างค่า</button>
                    </div>
                  </div>

                  <!-- Range Slider -->
                  <div class="px-1 pt-1">
                    <input type="range" id="hematuriaPainScore" min="0" max="10" value="0" step="1"
                      oninput="handleHematuriaPainScoreChange(this.value)"
                      class="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-600 focus:outline-none focus:ring-2 focus:ring-medical-500">
                  </div>

                  <!-- Visual Emoji Scale Guide -->
                  <div class="grid grid-cols-5 text-center text-[10px] sm:text-[11px] pt-1 gap-1 text-slate-500 font-medium">
                    <div class="cursor-pointer hover:text-medical-600 transition" onclick="setHematuriaPainScore(0)">
                      <span class="text-lg sm:text-xl block">😊</span>
                      <span>0: สบายดี</span>
                    </div>
                    <div class="cursor-pointer hover:text-medical-600 transition" onclick="setHematuriaPainScore(2)">
                      <span class="text-lg sm:text-xl block">🙂</span>
                      <span>1-3: เล็กน้อย</span>
                    </div>
                    <div class="cursor-pointer hover:text-medical-600 transition" onclick="setHematuriaPainScore(5)">
                      <span class="text-lg sm:text-xl block">😐</span>
                      <span>4-6: ปานกลาง</span>
                    </div>
                    <div class="cursor-pointer hover:text-medical-600 transition" onclick="setHematuriaPainScore(8)">
                      <span class="text-lg sm:text-xl block">😣</span>
                      <span>7-9: ปวดมาก</span>
                    </div>
                    <div class="cursor-pointer hover:text-medical-600 transition" onclick="setHematuriaPainScore(10)">
                      <span class="text-lg sm:text-xl block">😭</span>
                      <span>10: ปวดรุนแรงที่สุด</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 4. ปัสสาวะออกน้อยมากผิดปกติ (ย้ายมาจากหมวด Systemic) -->
          <div>
            <label class="selectable-card p-3 rounded-xl flex items-start cursor-pointer border border-slate-200">
              <input type="checkbox" name="hematuriaSystemicSigns" value="rf_oliguria_anuria" onchange="handleHematuriaVoidingItemChange(this)" class="mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4">
              <div class="ml-3">
                <span class="font-semibold text-slate-800 block text-xs sm:text-sm">ปัสสาวะออกน้อยมากผิดปกติ (ตลอดทั้งวันออกไม่ถึง 1–2 แก้ว)</span>
                <span class="text-[11px] text-slate-500">ปัสสาวะลดลงอย่างชัดเจน หรือแทบไม่มีปัสสาวะออกเลยตลอดทั้งวัน (Oliguria/Anuria)</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- CARD 3: สัญญาณเตือนสำคัญทางร่างกาย (Systemic Warning Signs) -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="activity" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">3. สัญญาณเตือนสำคัญทางร่างกาย (Systemic Warning Signs)</h2>
            <p class="text-xs text-slate-500">กรุณาเลือกหากท่านมีอาการดังต่อไปนี้ เพื่อให้แพทย์ประเมินความเร่งด่วนได้อย่างแม่นยำ</p>
          </div>
        </div>

        <div class="space-y-2 text-xs">
          <label class="selectable-card p-3 rounded-xl flex items-start cursor-pointer border-slate-200">
            <input type="checkbox" name="hematuriaSystemicSigns" value="rf_high_fever_chills" onchange="handleHematuriaSystemicItemChange(this)" class="mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4">
            <div class="ml-2.5">
              <span class="font-semibold text-slate-800 block text-xs sm:text-sm">มีไข้สูง หนาวสั่นสะท้านจับไข้ หรือตัวเย็นสั่น</span>
              <span class="text-[11px] text-slate-500">ตัวร้อนจัด สั่นสะท้าน อาจสัมพันธ์กับการติดเชื้อกรวยไต</span>
            </div>
          </label>

          <label class="selectable-card p-3 rounded-xl flex items-start cursor-pointer border-slate-200">
            <input type="checkbox" name="hematuriaSystemicSigns" value="rf_syncope_hypotension" onchange="handleHematuriaSystemicItemChange(this)" class="mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4">
            <div class="ml-2.5">
              <span class="font-semibold text-slate-800 block text-xs sm:text-sm">หน้ามืด วูบหมดสติ วิงเวียนรุนแรง เหงื่อแตกตัวเย็น</span>
              <span class="text-[11px] text-slate-500">รู้สึกจะเป็นลม ลุกขึ้นแล้ววูบ ความดันโลหิตตกจากการเสียเลือด</span>
            </div>
          </label>

          <label class="selectable-card p-3 rounded-xl flex items-start cursor-pointer border-slate-200">
            <input type="checkbox" name="hematuriaSystemicSigns" value="rf_marked_pallor" onchange="handleHematuriaSystemicItemChange(this)" class="mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4">
            <div class="ml-2.5">
              <span class="font-semibold text-slate-800 block text-xs sm:text-sm">หน้าซีด ปากซีดลงอย่างรวดเร็ว อ่อนเพลียแทบยืนไม่ไหว</span>
              <span class="text-[11px] text-slate-500">ริมฝีปากและเล็บซีดขาว อ่อนแรงผิดปกติจากภาวะซีดเฉียบพลัน</span>
            </div>
          </label>

          <label class="selectable-card p-3 rounded-xl flex items-start cursor-pointer border-slate-200">
            <input type="checkbox" name="hematuriaSystemicSigns" value="rf_facial_pedal_edema" onchange="handleHematuriaSystemicItemChange(this)" class="mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4">
            <div class="ml-2.5">
              <span class="font-semibold text-slate-800 block text-xs sm:text-sm">หน้าบวม หนังตาบวม หรือขาบวมกดบุ๋มทั้งสองข้าง</span>
              <span class="text-[11px] text-slate-500">ตื่นเช้าตาบวม ชายกางเกง/ถุงเท้ารัดแน่นผิดปกติ</span>
            </div>
          </label>

          <label class="selectable-card p-3 rounded-xl flex items-start cursor-pointer border-slate-200">
            <input type="checkbox" name="hematuriaSystemicSigns" value="rf_unexplained_weight_loss" onchange="handleHematuriaSystemicItemChange(this)" class="mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4">
            <div class="ml-2.5">
              <span class="font-semibold text-slate-800 block text-xs sm:text-sm">น้ำหนักตัวลดลงฮวบผิดปกติโดยไม่ได้ตั้งใจลด เบื่ออาหาร</span>
              <span class="text-[11px] text-slate-500">น้ำหนักลดลงต่อเนื่อง เสื้อผ้าหลวม ทานอาหารได้น้อยลง</span>
            </div>
          </label>

          <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer bg-slate-50/60 border-slate-200">
            <input type="checkbox" name="hematuriaSystemicSigns" value="rf_systemic_none" onchange="handleHematuriaSystemicNoneToggle(this)" class="rounded text-medical-600 focus:ring-medical-500 h-4 w-4">
            <span class="ml-2.5 font-bold text-slate-700 text-xs sm:text-sm">ไม่มีอาการผิดปกติข้างต้นเลย (None of the above)</span>
          </label>
        </div>
      </div>

      <!-- CARD 4: ประวัติอุบัติเหตุ บาดเจ็บ และหัตถการ (Trauma & Interventions) -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="shield" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">4. ประวัติอุบัติเหตุ บาดเจ็บ และหัตถการ (Trauma & Interventions)</h2>
            <p class="text-xs text-slate-500">ประวัติการกระทบกระแทกหรือการใส่สายสวนทางเดินปัสสาวะนำมาก่อน</p>
          </div>
        </div>

        <div class="space-y-4 text-xs sm:text-sm">
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              4.1 มีอุบัติเหตุ บาดเจ็บ หรือหัตถการทางเดินปัสสาวะนำมาก่อนหรือไม่? <span class="text-rose-500">*</span>
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer">
                <input type="radio" name="hematuriaTraumaMaster" value="trauma_master_yes" onchange="handleHematuriaTraumaMasterChange(this)" class="text-medical-600 focus:ring-medical-500 h-4 w-4">
                <span class="ml-2.5 font-semibold text-slate-800">มี</span>
              </label>
              <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer">
                <input type="radio" name="hematuriaTraumaMaster" value="trauma_master_no" onchange="handleHematuriaTraumaMasterChange(this)" class="text-medical-600 focus:ring-medical-500 h-4 w-4">
                <span class="ml-2.5 font-medium text-slate-700">ไม่มี</span>
              </label>
            </div>

            <!-- Sub-options for Trauma -->
            <div id="hematuriaTraumaSubContainer" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 mt-3">
              <span class="block text-xs font-bold text-slate-800">ระบุเหตุการณ์หรือประวัติที่เกี่ยวข้อง (เลือกได้มากกว่า 1 ข้อ):</span>
              <div class="space-y-2 text-xs">
                <label class="selectable-card bg-white p-2.5 rounded-lg flex items-start cursor-pointer border-slate-200">
                  <input type="checkbox" name="hematuriaTraumaTypes" value="hist_trauma_flank_pelvis" class="mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4">
                  <div class="ml-2.5">
                    <span class="text-xs font-semibold text-slate-800 block">เพิ่งประสบอุบัติเหตุ หกล้ม รถชน หรือถูกกระแทกบริเวณบั้นเอว ท้องน้อย หรือเชิงกราน</span>
                  </div>
                </label>
                <label class="selectable-card bg-white p-2.5 rounded-lg flex items-start cursor-pointer border-slate-200">
                  <input type="checkbox" name="hematuriaTraumaTypes" value="hist_straddle_injury" class="mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4">
                  <div class="ml-2.5">
                    <span class="text-xs font-semibold text-slate-800 block">พลัดตกกระแทกหว่างขา กระแทกอานจักรยาน หรือขี่คาน (Straddle injury)</span>
                  </div>
                </label>
                <label class="selectable-card bg-white p-2.5 rounded-lg flex items-start cursor-pointer border-slate-200">
                  <input type="checkbox" name="hematuriaTraumaTypes" value="hist_direct_genital_urethral_trauma" class="mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4">
                  <div class="ml-2.5">
                    <span class="text-xs font-bold text-slate-900 block">บาดเจ็บ หรือกระทบกระแทกที่อวัยวะเพศ หรือท่อทางเดินปัสสาวะโดยตรง</span>
                  </div>
                </label>
                <label class="selectable-card bg-white p-2.5 rounded-lg flex items-start cursor-pointer border-slate-200">
                  <input type="checkbox" name="hematuriaTraumaTypes" value="hist_blood_at_meatus" class="mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4">
                  <div class="ml-2.5">
                    <span class="text-xs font-bold text-slate-900 block">สังเกตเห็นหยดเลือดสดไหลซึมออกจากปลายท่อปัสสาวะโดยไม่ได้ปัสสาวะ (Blood at meatus)</span>
                  </div>
                </label>
                <label class="selectable-card bg-white p-2.5 rounded-lg flex items-start cursor-pointer border-slate-200">
                  <input type="checkbox" name="hematuriaTraumaTypes" value="hist_recent_catheter" class="mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4">
                  <div class="ml-2.5">
                    <span class="text-xs font-medium text-slate-700 block">มีการใส่สายสวนปัสสาวะ คาสายสวน หรือเพิ่งถูกดึงกระชากสายสวนปัสสาวะออก</span>
                  </div>
                </label>
                <label class="selectable-card bg-white p-2.5 rounded-lg flex items-start cursor-pointer border-slate-200">
                  <input type="checkbox" name="hematuriaTraumaTypes" value="hist_recent_urologic_op" class="mt-0.5 rounded text-medical-600 focus:ring-medical-500 h-4 w-4">
                  <div class="ml-2.5">
                    <span class="text-xs font-medium text-slate-700 block">เพิ่งได้รับการส่องกล้อง สลายนิ่ว หรือผ่าตัดทางเดินปัสสาวะ/ต่อมลูกหมากมาไม่เกิน 2–4 สัปดาห์</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 5: ยาที่รับประทานและปัจจัยเสี่ยง (Medications & Risk Factors) -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
          <div class="bg-medical-100 text-medical-700 p-2 rounded-xl">
            <i data-lucide="pill" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">5. ยาที่รับประทานและปัจจัยเสี่ยง (Medications & Risk Factors)</h2>
            <p class="text-xs text-slate-500">ประวัติการใช้ยาละลายลิ่มเลือด การสูบบุหรี่ และการสัมผัสสารเคมี</p>
          </div>
        </div>

        <div class="space-y-4 text-xs sm:text-sm">
          <!-- 5.1 ยาที่รับประทาน -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              5.1 ยาที่รับประทาน (อาจเป็นสาเหตุที่ทำให้เลือดออกง่าย) (เลือกได้หลายข้อ)
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label class="selectable-card p-2.5 rounded-xl flex items-center cursor-pointer">
                <input type="checkbox" name="hematuriaMeds" value="med_warfarin" onchange="handleHematuriaMedsItemChange(this)" class="rounded text-medical-600 focus:ring-medical-500 h-4 w-4">
                <span class="ml-2.5 text-slate-800 font-medium">ยาวาร์ฟาริน (Warfarin - ยาละลายลิ่มเลือด)</span>
              </label>

              <label class="selectable-card p-2.5 rounded-xl flex items-center cursor-pointer">
                <input type="checkbox" name="hematuriaMeds" value="med_doac" onchange="handleHematuriaMedsItemChange(this)" class="rounded text-medical-600 focus:ring-medical-500 h-4 w-4">
                <span class="ml-2.5 text-slate-800 font-medium">ยาต้านการแข็งตัวกลุ่มใหม่ (DOACs เช่น Xarelto, Eliquis)</span>
              </label>

              <label class="selectable-card p-2.5 rounded-xl flex items-center cursor-pointer">
                <input type="checkbox" name="hematuriaMeds" value="med_antiplatelet" onchange="handleHematuriaMedsItemChange(this)" class="rounded text-medical-600 focus:ring-medical-500 h-4 w-4">
                <span class="ml-2.5 text-slate-800 font-medium">ยาต้านเกล็ดเลือด (Aspirin, Clopidogrel / Plavix)</span>
              </label>

              <label class="selectable-card p-2.5 rounded-xl flex items-center cursor-pointer">
                <input type="checkbox" name="hematuriaMeds" value="med_nsaids" onchange="handleHematuriaMedsItemChange(this)" class="rounded text-medical-600 focus:ring-medical-500 h-4 w-4">
                <span class="ml-2.5 text-slate-800 font-medium">ยาแก้ปวดข้อ แก้ปวดกล้ามเนื้อ (NSAIDs / ยาชุด)</span>
              </label>

              <label class="selectable-card p-2.5 rounded-xl flex items-center cursor-pointer">
                <input type="checkbox" name="hematuriaMeds" value="med_rifampicin" onchange="handleHematuriaMedsItemChange(this)" class="rounded text-medical-600 focus:ring-medical-500 h-4 w-4">
                <span class="ml-2.5 text-slate-800 font-medium">ยารักษาวัณโรคไรแฟมพิซิน (Rifampicin - ปัสสาวะสีส้มแดง)</span>
              </label>

              <label class="selectable-card p-2.5 rounded-xl flex items-center cursor-pointer">
                <input type="checkbox" id="currentMedsUnknown" onchange="handleHematuriaMedsUnknownToggle(this)" class="rounded text-medical-600 focus:ring-medical-500 h-4 w-4">
                <span class="ml-2.5 text-slate-800 font-medium">ไม่แน่ใจ ไม่ทราบชื่อยา</span>
              </label>

              <label class="selectable-card p-2.5 rounded-xl flex items-center cursor-pointer bg-slate-50/60 sm:col-span-2">
                <input type="checkbox" name="hematuriaMeds" value="med_bleeding_none" onchange="handleHematuriaMedsNoneToggle(this)" class="rounded text-medical-600 focus:ring-medical-500 h-4 w-4">
                <span class="ml-2.5 font-bold text-slate-700">ไม่ได้ใช้ยาในกลุ่มข้างต้นเลย</span>
              </label>
            </div>
          </div>

          <!-- 5.2 ข้อมูลเฉพาะเพศหญิง (Female branch) -->
          <div id="hematuria_branch_female" class="hidden pt-3 border-t border-slate-100">
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              5.2 สำหรับผู้ป่วยหญิง: ภาวะเลือดออกทางช่องคลอด
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer">
                <input type="radio" name="hematuriaFemaleBleeding" value="female_menstruation_active" class="text-medical-600 focus:ring-medical-500 h-4 w-4">
                <span class="ml-2.5 text-slate-800 font-medium">กำลังมีประจำเดือน หรือมีเลือดออกทางช่องคลอดปนเปื้อน</span>
              </label>
              <label class="selectable-card p-3 rounded-xl flex items-center cursor-pointer">
                <input type="radio" name="hematuriaFemaleBleeding" value="female_no_vaginal_bleed" class="text-medical-600 focus:ring-medical-500 h-4 w-4">
                <span class="ml-2.5 text-slate-800 font-semibold">ปฏิเสธเลือดออกทางช่องคลอด เลือดออกจากรูท่อปัสสาวะแน่นอน</span>
              </label>
            </div>
          </div>

          <!-- 5.3 ปัจจัยเสี่ยงโรคมะเร็งทางเดินปัสสาวะ -->
          <div class="pt-3 border-t border-slate-100">
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              5.3 ปัจจัยเสี่ยงอื่นๆ (เลือกได้หลายข้อ)
            </label>
            <div class="space-y-2 text-xs">
              <label class="selectable-card p-2.5 rounded-xl flex items-center cursor-pointer">
                <input type="checkbox" name="hematuriaMalignancyRisks" value="risk_heavy_smoker" class="rounded text-medical-600 focus:ring-medical-500 h-4 w-4">
                <span class="ml-2.5 text-slate-800 font-medium">สูบบุหรี่จัดเป็นประจำ (หรือเคยสูบต่อเนื่องเกิน 10–20 ปี)</span>
              </label>
              <label class="selectable-card p-2.5 rounded-xl flex items-center cursor-pointer">
                <input type="checkbox" name="hematuriaMalignancyRisks" value="risk_chemical_dyes" class="rounded text-medical-600 focus:ring-medical-500 h-4 w-4">
                <span class="ml-2.5 text-slate-800 font-medium">ทำงานสัมผัสสารเคมีอุตสาหกรรม สีย้อมผ้า ยาง สีทา พลาสติก...เป็นประจำ</span>
              </label>
              <label class="selectable-card p-2.5 rounded-xl flex items-center cursor-pointer">
                <input type="checkbox" name="hematuriaMalignancyRisks" value="risk_family_cancer" class="rounded text-medical-600 focus:ring-medical-500 h-4 w-4">
                <span class="ml-2.5 text-slate-800 font-medium">มีประวัติคนในครอบครัวสายตรงเป็นโรคมะเร็งไตหรือมะเร็งกระเพาะปัสสาวะ</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 6: อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม (ตรงตามต้นแบบ CC ปวดท้อง 100%) -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center space-x-3 mb-3 pb-2 border-b border-slate-100">
          <div class="bg-slate-100 text-slate-600 p-2 rounded-xl">
            <i data-lucide="message-square-plus" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-800">อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม</h2>
            <p class="text-xs text-slate-500">ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี เช่น อ่อนเพลียมาก, แน่นหน้าอก, วิงเวียนศีรษะ)</p>
          </div>
        </div>
        <textarea id="hematuria_other_free" rows="2" placeholder="พิมพ์ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี)..." 
          class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white"></textarea>
      </div>

    </div>
  `,

  // --- Mounting & Event Listeners Hook ---
  onMounted: function() {
    clearHematuriaPainScore();
  },

  // --- Collect Intake Hook ---
  collectIntake: function(ctx) {
    const _rawDur = parseFloat(document.getElementById('hematuriaDurationVal')?.value); const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
    const durationUnit = document.getElementById('hematuriaDurationUnit')?.value || 'days';

    const hematuriaColor = document.querySelector('input[name="hematuriaColor"]:checked')?.value || '';
    const hematuriaTiming = document.querySelector('input[name="hematuriaTiming"]:checked')?.value || '';

    const hematuriaHasClots = Boolean(document.getElementById('hematuriaHasClots')?.checked);
    const hematuriaClotMaster = hematuriaHasClots ? 'clot_master_yes' : 'clot_master_no';
    const hematuriaClotTypes = hematuriaHasClots ? Array.from(document.querySelectorAll('input[name="hematuriaClotTypes"]:checked')).map(el => el.value) : [];

    const hematuriaHasObs = Boolean(document.getElementById('hematuriaHasObs')?.checked);
    const hematuriaObsMaster = hematuriaHasObs ? 'obs_master_yes' : 'obs_master_no';
    const hematuriaObsTypes = hematuriaHasObs ? Array.from(document.querySelectorAll('input[name="hematuriaObsTypes"]:checked')).map(el => el.value) : [];

    const hematuriaHasPain = Boolean(document.getElementById('hematuriaHasPain')?.checked);
    let hematuriaPainType = '';
    let painScore = 0;
    if (hematuriaHasPain) {
      hematuriaPainType = document.querySelector('input[name="hematuriaPainType"]:checked')?.value || '';
      if (hematuriaPainScoreTouched) {
        const pSlider = document.getElementById('hematuriaPainScore');
        if (pSlider) painScore = parseInt(pSlider.value, 10);
      }
    }

    const hematuriaSystemicSigns = Array.from(document.querySelectorAll('input[name="hematuriaSystemicSigns"]:checked')).map(el => el.value);

    const hematuriaTraumaMaster = document.querySelector('input[name="hematuriaTraumaMaster"]:checked')?.value || '';
    const hematuriaTraumaTypes = Array.from(document.querySelectorAll('input[name="hematuriaTraumaTypes"]:checked')).map(el => el.value);

    const hematuriaMeds = Array.from(document.querySelectorAll('input[name="hematuriaMeds"]:checked')).map(el => el.value);
    const currentMedsUnknown = Boolean(document.getElementById('currentMedsUnknown')?.checked);

    const hematuriaFemaleBleeding = document.querySelector('input[name="hematuriaFemaleBleeding"]:checked')?.value || '';
    const hematuriaMalignancyRisks = Array.from(document.querySelectorAll('input[name="hematuriaMalignancyRisks"]:checked')).map(el => el.value);

    const otherSymptomsFree = document.getElementById('hematuria_other_free')?.value?.trim() || ctx.otherSymptomsFree || '';

    const rec = {
      id: ctx.recordId,
      queue_number: ctx.queueNumber,
      hn: ctx.randomHn,
      name: ctx.patientName,
      age: ctx.patientAge,
      gender: ctx.gender,
      chief_complaint: 'hematuria',
      chief_complaint_title: 'ปัสสาวะเป็นเลือด',
      timestamp: new Date().toISOString(),
      status: ctx.recordStatus,
      durationVal,
      durationUnit,
      hospRecordStatus: ctx.hospRecordStatus,
      underlying: ctx.underlying,
      drugAllergy: ctx.drugAllergy,
      currentMeds: ctx.currentMeds,
      otherSymptomsFree,
      doctor_notes: ctx.preservedDoctorNotes,

      hematuriaColor,
      hematuriaTiming,
      hematuriaClotMaster,
      hematuriaClotTypes,
      hematuriaObsMaster,
      hematuriaObsTypes,
      hematuriaPainType,
      painScore,
      hematuriaSystemicSigns,
      hematuriaTraumaMaster,
      hematuriaTraumaTypes,
      hematuriaMeds,
      currentMedsUnknown,
      hematuriaFemaleBleeding,
      hematuriaMalignancyRisks
    };

    updateHematuriaOutputs(rec);
    return rec;
  },

  // --- Populate / Hydrate Form Hook ---
  populateForm: function(patient) {
    if (!patient) return;

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val !== undefined && val !== null ? val : '';
    };

    const setRadio = (name, val) => {
      if (!val) return;
      const el = document.querySelector(`input[name="${name}"][value="${val}"]`);
      if (el) {
        el.checked = true;
        if (typeof el.onchange === 'function') el.onchange();
      }
    };

    const setChkGroup = (name, arr) => {
      if (!Array.isArray(arr)) return;
      document.querySelectorAll(`input[name="${name}"]`).forEach(cb => {
        cb.checked = arr.includes(cb.value);
      });
    };

    setVal('hematuriaDurationVal', patient.durationVal || '');
    setVal('hematuriaDurationUnit', patient.durationUnit || 'days');

    setRadio('hematuriaColor', patient.hematuriaColor);
    setRadio('hematuriaTiming', patient.hematuriaTiming);

    // Clots
    const hasClots = patient.hematuriaClotMaster === 'clot_master_yes' || (Array.isArray(patient.hematuriaClotTypes) && patient.hematuriaClotTypes.length > 0);
    const clotCb = document.getElementById('hematuriaHasClots');
    if (clotCb) {
      clotCb.checked = hasClots;
      const clotSub = document.getElementById('hematuriaClotSubContainer');
      if (clotSub) clotSub.classList.toggle('hidden', !hasClots);
    }
    setChkGroup('hematuriaClotTypes', patient.hematuriaClotTypes);

    // Obstruction
    const hasObs = patient.hematuriaObsMaster === 'obs_master_yes' || (Array.isArray(patient.hematuriaObsTypes) && patient.hematuriaObsTypes.length > 0);
    const obsCb = document.getElementById('hematuriaHasObs');
    if (obsCb) {
      obsCb.checked = hasObs;
      const obsSub = document.getElementById('hematuriaObsSubContainer');
      if (obsSub) obsSub.classList.toggle('hidden', !hasObs);
    }
    setChkGroup('hematuriaObsTypes', patient.hematuriaObsTypes);

    // Pain
    const hasPain = Boolean(patient.hematuriaPainType && patient.hematuriaPainType !== 'pain_painless');
    const painCb = document.getElementById('hematuriaHasPain');
    if (painCb) {
      painCb.checked = hasPain;
      const painSub = document.getElementById('hematuriaPainSubContainer');
      if (painSub) painSub.classList.toggle('hidden', !hasPain);
    }
    if (hasPain) {
      setRadio('hematuriaPainType', patient.hematuriaPainType);
      if (patient.painScore !== null && patient.painScore !== undefined) {
        setHematuriaPainScore(patient.painScore);
      } else {
        clearHematuriaPainScore();
      }
    } else {
      clearHematuriaPainScore();
    }

    setChkGroup('hematuriaSystemicSigns', patient.hematuriaSystemicSigns);

    setRadio('hematuriaTraumaMaster', patient.hematuriaTraumaMaster);
    setChkGroup('hematuriaTraumaTypes', patient.hematuriaTraumaTypes);

    setChkGroup('hematuriaMeds', patient.hematuriaMeds);
    const unkEl = document.getElementById('currentMedsUnknown');
    if (unkEl) unkEl.checked = Boolean(patient.currentMedsUnknown);

    const fCard = document.getElementById('hematuria_branch_female');
    if (patient.gender === 'หญิง' || patient.gender === 'Female') {
      if (fCard) fCard.classList.remove('hidden');
      setRadio('hematuriaFemaleBleeding', patient.hematuriaFemaleBleeding);
    } else {
      if (fCard) fCard.classList.add('hidden');
    }

    setChkGroup('hematuriaMalignancyRisks', patient.hematuriaMalignancyRisks);
    setVal('hematuria_other_free', patient.otherSymptomsFree || '');
  },

  hydrateForm: function(patient) {
    this.populateForm(patient);
  },

  isRedFlag: function(patient) {
    return evaluateHematuriaRedFlags(patient).length > 0;
  },
  evaluateRedFlags: evaluateHematuriaRedFlags,
  updateOutputs: updateHematuriaOutputs,
  generateCds: generateHematuriaCds,

  // --- Seed Patients for TDD & Clinical Verification ---
  seedPatients: [
    {
      id: 'seed-hematuria-01',
      queue_number: 'C-081',
      hn: '6788451',
      name: 'นายสมบัติ ปัสสาวะแดง',
      age: 68,
      gender: 'ชาย',
      chief_complaint: 'hematuria',
      chief_complaint_title: 'ปัสสาวะเป็นเลือด',
      timestamp: '2026-10-30T00:10:00.000Z',
      status: 'waiting',
      durationVal: 3,
      durationUnit: 'days',
      hospRecordStatus: 'complete',
      underlying: ['ความดันสูง (HT)'],
      drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร',
      currentMeds: 'Amlodipine (5 mg) 1 tab po od',
      otherSymptomsFree: 'สูบบุหรี่วันละ 1 ซองมานาน 30 ปี ปัสสาวะเป็นเลือดสดไม่มีปวด',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.6, sbp: 130, dbp: 80, bp: '130/80', pr: 76, rr: 16, spo2: 99 },
      esi_level: 3,

      hematuriaColor: 'color_bright_red',
      hematuriaTiming: 'timing_total',
      hematuriaClotMaster: 'clot_master_no',
      hematuriaClotTypes: [],
      hematuriaObsMaster: 'obs_master_no',
      hematuriaObsTypes: [],
      hematuriaPainType: 'pain_painless',
      painScore: 0,
      hematuriaSystemicSigns: ['rf_systemic_none'],
      hematuriaTraumaMaster: 'trauma_master_no',
      hematuriaTraumaTypes: [],
      hematuriaMeds: ['med_bleeding_none'],
      currentMedsUnknown: false,
      hematuriaFemaleBleeding: '',
      hematuriaMalignancyRisks: ['risk_heavy_smoker']
    },
    {
      id: 'seed-hematuria-02',
      queue_number: 'B-082',
      hn: '6788452',
      name: 'นายประสิทธิ์ ลิ่มเลือดอุดกั้น',
      age: 72,
      gender: 'ชาย',
      chief_complaint: 'hematuria',
      chief_complaint_title: 'ปัสสาวะเป็นเลือด',
      timestamp: '2026-10-30T00:15:00.000Z',
      status: 'waiting',
      durationVal: 6,
      durationUnit: 'hours',
      hospRecordStatus: 'complete',
      underlying: ['ต่อมลูกหมากโต (BPH)'],
      drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร',
      currentMeds: 'Tamsulosin 0.4 mg hs',
      otherSymptomsFree: 'ปวดเบ่งตึงท้องน้อยอย่างมาก ปัสสาวะไม่ออก มีลิ่มเลือดก้อนใหญ่ออกมา',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 37.0, sbp: 150, dbp: 95, bp: '150/95', pr: 98, rr: 20, spo2: 97 },
      esi_level: 2,

      hematuriaColor: 'color_bright_red',
      hematuriaTiming: 'timing_total',
      hematuriaClotMaster: 'clot_master_yes',
      hematuriaClotTypes: ['clot_large_amorphous'],
      hematuriaObsMaster: 'obs_master_yes',
      hematuriaObsTypes: ['obs_unable_to_void'],
      hematuriaPainType: 'pain_suprapubic',
      painScore: 8,
      hematuriaSystemicSigns: ['rf_systemic_none'],
      hematuriaTraumaMaster: 'trauma_master_no',
      hematuriaTraumaTypes: [],
      hematuriaMeds: ['med_bleeding_none'],
      currentMedsUnknown: false,
      hematuriaFemaleBleeding: '',
      hematuriaMalignancyRisks: []
    },
    {
      id: 'seed-hematuria-03',
      queue_number: 'C-083',
      hn: '6788453',
      name: 'นายชูเกียรติ นิ่วท่อไต',
      age: 42,
      gender: 'ชาย',
      chief_complaint: 'hematuria',
      chief_complaint_title: 'ปัสสาวะเป็นเลือด',
      timestamp: '2026-10-30T00:20:00.000Z',
      status: 'waiting',
      durationVal: 4,
      durationUnit: 'hours',
      hospRecordStatus: 'complete',
      underlying: ['เคยเป็นนิ่วท่อไต (Ureteric stone)'],
      drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร',
      currentMeds: 'ไม่มี',
      otherSymptomsFree: 'ปวดบิดเกร็งบั้นเอวขวาร้าวลงขาหนีบรุนแรง ปัสสาวะสีน้ำล้างเนื้อ',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.8, sbp: 140, dbp: 85, bp: '140/85', pr: 92, rr: 18, spo2: 98 },
      esi_level: 3,

      hematuriaColor: 'color_pink_wash',
      hematuriaTiming: 'timing_total',
      hematuriaClotMaster: 'clot_master_no',
      hematuriaClotTypes: [],
      hematuriaObsMaster: 'obs_master_yes',
      hematuriaObsTypes: ['obs_interrupted_stream'],
      hematuriaPainType: 'pain_flank_colic',
      painScore: 9,
      hematuriaSystemicSigns: ['rf_systemic_none'],
      hematuriaTraumaMaster: 'trauma_master_no',
      hematuriaTraumaTypes: [],
      hematuriaMeds: ['med_bleeding_none'],
      currentMedsUnknown: false,
      hematuriaFemaleBleeding: '',
      hematuriaMalignancyRisks: []
    },
    {
      id: 'seed-hematuria-04',
      queue_number: 'C-084',
      hn: '6788454',
      name: 'น.ส.กนกพร เนื้อไตอักเสบ',
      age: 24,
      gender: 'หญิง',
      chief_complaint: 'hematuria',
      chief_complaint_title: 'ปัสสาวะเป็นเลือด',
      timestamp: '2026-10-30T00:25:00.000Z',
      status: 'waiting',
      durationVal: 2,
      durationUnit: 'days',
      hospRecordStatus: 'complete',
      underlying: [],
      drugAllergy: 'ปฏิเสธประวัติแพ้ยาและแพ้อาหาร',
      currentMeds: 'ไม่ได้ระบุ',
      otherSymptomsFree: 'ปัสสาวะสีน้ำโคล่า หน้าบวม ตาบวม ขาบวม ตรวจพบความดันโลหิตสูง',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 37.1, sbp: 155, dbp: 95, bp: '155/95', pr: 82, rr: 16, spo2: 99 },
      esi_level: 3,

      hematuriaColor: 'color_cola_tea',
      hematuriaTiming: 'timing_total',
      hematuriaClotMaster: 'clot_master_no',
      hematuriaClotTypes: [],
      hematuriaObsMaster: 'obs_master_no',
      hematuriaObsTypes: [],
      hematuriaPainType: 'pain_painless',
      painScore: 0,
      hematuriaSystemicSigns: ['rf_facial_pedal_edema', 'rf_oliguria_anuria'],
      hematuriaTraumaMaster: 'trauma_master_no',
      hematuriaTraumaTypes: [],
      hematuriaMeds: ['med_bleeding_none'],
      currentMedsUnknown: false,
      hematuriaFemaleBleeding: 'female_no_vaginal_bleed',
      hematuriaMalignancyRisks: []
    }
  ]
});

// --- Output Generator (Rapid Bullet, Narrative & JSON Schema) ---
function updateHematuriaOutputs(patient) {
  if (!patient) return;

  const durVal = patient.durationVal;
  const durUnitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durUnit = durUnitMap[patient.durationUnit] || 'วัน';
  const durationStr = durVal ? `${durVal} ${durUnit}` : 'ไม่ระบุ';

  const colorMap = {
    color_bright_red: 'สีแดงสด หรือแดงเข้มเหมือนเลือดสด',
    color_pink_wash: 'สีชมพูหรือแดงจาง เหมือนน้ำล้างเนื้อ',
    color_cola_tea: 'สีน้ำตาลเข้ม สีน้ำโคล่า หรือสีน้ำชาแก่',
    color_turbid_cloudy: 'ปัสสาวะขุ่น มีตะกอนสีแดงหรือชมพู'
  };
  const colorText = colorMap[patient.hematuriaColor] || 'ไม่ระบุ';

  const timingMap = {
    timing_total: 'แดงตลอดสายตั้งแต่เริ่มจนสุด (Total hematuria)',
    timing_initial: 'แดงเฉพาะช่วงแรกที่เริ่มปัสสาวะ (Initial hematuria)',
    timing_terminal: 'แดงเฉพาะช่วงท้ายตอนใกล้สุด (Terminal hematuria)',
    timing_intermittent: 'เป็นบางครั้ง สลับกับใสเป็นปกติ (Intermittent)',
    timing_unnoticed: 'ไม่ได้สังเกตช่วงเวลาที่ออกชัดเจน'
  };
  const timingText = timingMap[patient.hematuriaTiming] || 'ไม่ระบุ';

  const painMap = {
    pain_painless: 'ไม่มีอาการปวดใดๆ เลย (Painless gross hematuria)',
    pain_flank_colic: 'ปวดบิดเกร็งบั้นเอวด้านหลังร้าวลงขาหนีบ (Colicky flank pain)',
    pain_suprapubic: 'ปวดตื้อ หน่วง แน่นเกร็งท้องน้อย (Suprapubic pain)',
    pain_dysuria_burning: 'ปวดแสบขัด แสบร้อนปลายท่อปัสสาวะ (Dysuria)'
  };
  const painText = painMap[patient.hematuriaPainType] || 'ไม่ระบุ';

  // Clots
  const clotTypes = Array.isArray(patient.hematuriaClotTypes) ? patient.hematuriaClotTypes : [];
  let clotSummary = 'ไม่มีลิ่มเลือด';
  if (patient.hematuriaClotMaster === 'clot_master_yes') {
    const cParts = [];
    if (clotTypes.includes('clot_small_specks')) cParts.push('ลิ่มเลือดเป็นขุย/เส้นเล็ก');
    if (clotTypes.includes('clot_large_amorphous')) cParts.push('ลิ่มเลือดก้อนใหญ่วุ้นหนา');
    if (clotTypes.includes('clot_vermiform_string')) cParts.push('ลิ่มเลือดเส้นยาวคล้ายไส้เดือน (Ureteral cast)');
    clotSummary = `มีลิ่มเลือดปน (${cParts.length ? cParts.join(', ') : 'มีลิ่มเลือด'})`;
  }

  // Voiding Obstruction
  const obsTypes = Array.isArray(patient.hematuriaObsTypes) ? patient.hematuriaObsTypes : [];
  let obsSummary = 'การขับถ่ายปัสสาวะพุ่งออกดีตามปกติ ไม่สะดุด';
  if (patient.hematuriaObsMaster === 'obs_master_yes') {
    const oParts = [];
    if (obsTypes.includes('obs_unable_to_void')) oParts.push('ปัสสาวะไม่ออกเลย ปวดเบ่งตึงท้องน้อยรุนแรง (Acute Clot Retention)');
    if (obsTypes.includes('obs_interrupted_stream')) oParts.push('ลำปัสสาวะสะดุดหยุดไหลกะทันหัน');
    if (obsTypes.includes('obs_straining_dribbling')) oParts.push('ออกแรงเบ่งมาก ออกทีละหยด');
    obsSummary = `ปัญหาขับถ่าย: ${oParts.length ? oParts.join(', ') : 'ปัสสาวะขัดข้อง'}`;
  }

  const redFlags = evaluateHematuriaRedFlags(patient);

  // Pertinent Positives & Negatives
  const systemic = Array.isArray(patient.hematuriaSystemicSigns) ? patient.hematuriaSystemicSigns : [];
  const trauma = Array.isArray(patient.hematuriaTraumaTypes) ? patient.hematuriaTraumaTypes : [];
  const meds = Array.isArray(patient.hematuriaMeds) ? patient.hematuriaMeds : [];
  const risks = Array.isArray(patient.hematuriaMalignancyRisks) ? patient.hematuriaMalignancyRisks : [];

  const positives = [];
  const negatives = [];

  // Clots
  if (patient.hematuriaClotMaster === 'clot_master_yes') {
    if (clotTypes.includes('clot_large_amorphous')) positives.push('มีลิ่มเลือดก้อนใหญ่วุ้นหนา 🚩');
    if (clotTypes.includes('clot_vermiform_string')) positives.push('มีลิ่มเลือดเส้นยาวคล้ายไส้เดือน (Ureteral clot cast)');
    if (clotTypes.includes('clot_small_specks')) positives.push('มีลิ่มเลือดปนเป็นขุยหรือเส้นเล็กๆ');
    if (clotTypes.length === 0) positives.push('มีลิ่มเลือดปนในปัสสาวะ');
  } else {
    negatives.push('ไม่มีลิ่มเลือดปนในปัสสาวะ');
  }

  // Voiding obstruction
  if (patient.hematuriaObsMaster === 'obs_master_yes') {
    if (obsTypes.includes('obs_unable_to_void')) positives.push('ปัสสาวะไม่ออกเลย ปวดเบ่งตึงท้องน้อยรุนแรง (Acute Clot Retention) 🚩');
    if (obsTypes.includes('obs_interrupted_stream')) positives.push('ลำปัสสาวะสะดุดหยุดไหลกะทันหัน');
    if (obsTypes.includes('obs_straining_dribbling')) positives.push('ต้องออกแรงเบ่งมาก ปัสสาวะออกทีละหยด');
    if (obsTypes.length === 0) positives.push('มีปัญหาปัสสาวะขัดข้องหรือสะดุด');
  } else {
    negatives.push('ปัสสาวะพุ่งออกดีตามปกติ ไม่สะดุด');
  }

  // Pain
  if (patient.hematuriaPainType === 'pain_painless') {
    positives.push('ปัสสาวะเป็นเลือดสดโดยไม่มีอาการปวดเลย (Painless gross hematuria)');
  } else if (patient.hematuriaPainType && painMap[patient.hematuriaPainType]) {
    positives.push(`มีอาการ${painText}${patient.painScore !== null && patient.painScore !== undefined ? ` (Pain Score: ${patient.painScore}/10)` : ''}`);
  }

  // Systemic signs
  if (systemic.includes('rf_high_fever_chills')) positives.push('มีไข้สูง หนาวสั่นสะท้านจับไข้');
  if (systemic.includes('rf_syncope_hypotension')) positives.push('หน้ามืด วูบหมดสติ วิงเวียนรุนแรง เหงื่อแตกตัวเย็น 🚩');
  if (systemic.includes('rf_marked_pallor')) positives.push('หน้าซีด ปากซีดลงอย่างรวดเร็ว อ่อนเพลียแทบยืนไม่ไหว 🚩');
  if (systemic.includes('rf_facial_pedal_edema')) positives.push('หน้าบวม หนังตาบวม หรือขาบวมกดบุ๋มทั้งสองข้าง');
  if (systemic.includes('rf_oliguria_anuria')) positives.push('ปัสสาวะออกน้อยมากผิดปกติ (Oliguria/Anuria) 🚩');
  if (systemic.includes('rf_unexplained_weight_loss')) positives.push('น้ำหนักตัวลดลงฮวบผิดปกติ เบื่ออาหาร');

  if (systemic.includes('rf_systemic_none')) {
    negatives.push('ปฏิเสธไข้หนาวสั่น ปฏิเสธหน้ามืดวูบ ปฏิเสธหน้า/ขาบวม และไม่มีอาการซีดเฉียบพลัน');
  }

  // Trauma
  if (patient.hematuriaTraumaMaster === 'trauma_master_yes') {
    if (trauma.includes('hist_trauma_flank_pelvis')) positives.push('อุบัติเหตุกระแทกบั้นเอว ท้องน้อย หรือกระดูกเชิงกราน');
    if (trauma.includes('hist_straddle_injury')) positives.push('พลัดตกกระแทกหว่างขา (Straddle injury) 🚩');
    if (trauma.includes('hist_direct_genital_urethral_trauma')) positives.push('บาดเจ็บหรือกระแทกที่อวัยวะเพศหรือท่อปัสสาวะโดยตรง 🚩');
    if (trauma.includes('hist_blood_at_meatus')) positives.push('มีเลือดสดหยดออกมาจากปลายท่อทางเดินปัสสาวะ (Blood at meatus) 🚩');
    if (trauma.includes('hist_recent_catheter')) positives.push('เพิ่งได้รับการใส่ คาสายสวน หรือดึงกระชากสายสวนปัสสาวะ');
    if (trauma.includes('hist_recent_urologic_op')) positives.push('เพิ่งได้รับการผ่าตัด ส่องกล้อง หรือเจาะตรวจชิ้นเนื้อทางเดินปัสสาวะ');
  } else {
    negatives.push('ปฏิเสธประวัติอุบัติเหตุ บาดเจ็บ หรือหัตถการทางเดินปัสสาวะ');
  }

  // Female
  if (patient.gender === 'หญิง' || patient.gender === 'Female') {
    if (patient.hematuriaFemaleBleeding === 'female_menstruation_active') positives.push('มีประจำเดือนหรือเลือดออกทางช่องคลอดในระยะนี้');
    else if (patient.hematuriaFemaleBleeding === 'female_no_vaginal_bleed') negatives.push('ปฏิเสธเลือดออกทางช่องคลอด ไม่ตรงกับรอบประจำเดือน');
  }

  // Risks
  if (risks.includes('risk_heavy_smoker')) positives.push('มีประวัติสูบบุหรี่จัด (> 10-20 ปี)');
  if (risks.includes('risk_chemical_dyes')) positives.push('สัมผัสสารเคมี อุตสาหกรรมสีย้อม หนัง ยาง หรือพลาสติกเป็นประจำ');
  if (risks.includes('risk_family_cancer')) positives.push('มีคนในครอบครัวสายตรงป่วยเป็นโรคมะเร็งทางเดินปัสสาวะหรือมะเร็งไต');
  if (risks.includes('risk_malignancy_none')) negatives.push('ปฏิเสธประวัติสูบบุหรี่จัด และไม่มีประวัติสัมผัสสารเคมีหรือสีย้อมอุตสาหกรรม');

  // Meds
  const medList = [];
  if (meds.includes('med_warfarin')) medList.push('Warfarin');
  if (meds.includes('med_doac')) medList.push('DOACs (Eliquis, Xarelto, Pradaxa, Lixiana)');
  if (meds.includes('med_antiplatelet')) medList.push('Aspirin/Antiplatelet');
  if (meds.includes('med_nsaids')) medList.push('NSAIDs');
  if (meds.includes('med_rifampicin')) medList.push('Rifampicin');
  if (patient.currentMedsUnknown) medList.push('มียาประจำตัว (ไม่ทราบชื่อยา)');

  if (medList.length > 0) positives.push(`รับประทานยาที่มีความเสี่ยงเลือดออก: ${medList.join(', ')}`);
  if (meds.includes('med_bleeding_none')) negatives.push('ปฏิเสธยาละลายลิ่มเลือด ยาต้านเกล็ดเลือด หรือยาที่มีผลต่อการแข็งตัวของเลือด');

  if (patient.otherSymptomsFree) positives.push(patient.otherSymptomsFree);

  patient.pertinentPositives = positives.length > 0 ? positives : ['ไม่มีอาการร่วมผิดปกติ'];
  patient.pertinentNegatives = negatives;

  const docNotes = patient.doctor_notes || {};
  const medsText = (!patient.currentMeds || patient.currentMeds === 'ไม่ได้ระบุ' || patient.currentMeds === 'ไม่มี') ? 'ไม่มี' : patient.currentMeds;
  const hospLabel = {
    complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
    additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
    self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
    unspecified: 'ไม่ได้ระบุ'
  }[patient.hospRecordStatus] || 'ไม่ได้ระบุ';

  let udDisplay = 'ปฏิเสธ';
  if (patient.underlying && patient.underlying.length > 0) {
    const filteredUd = (Array.isArray(patient.underlying) ? patient.underlying : [patient.underlying])
      .filter(u => u && !u.includes('ปฏิเสธ') && u !== 'ไม่มี' && u !== 'ไม่มีโรคประจำตัว');
    if (filteredUd.length > 0) udDisplay = filteredUd.join(', ');
  }
  const allergyDisplay = (!patient.drugAllergy || patient.drugAllergy.includes('ปฏิเสธ') || patient.drugAllergy === 'ไม่มี') ? 'ปฏิเสธ' : patient.drugAllergy;

  const defaultRapid =
`[Chief Complaint (CC)]
ปัสสาวะเป็นเลือด (Hematuria) มา ${durationStr}

[History of Present Illness (HPI)]
• ลักษณะสีของน้ำปัสสาวะ: ${colorText}
• ช่วงเวลาที่เลือดออก: ${timingText}
• ลักษณะการปวด: ${painText}${patient.painScore !== null && patient.painScore !== undefined ? ` (Pain Score: ${patient.painScore}/10)` : ''}

• Pertinent Positives:
${positives.length > 0 ? positives.map(p => `  - ${p}`).join('\n') : '  - ไม่มีอาการร่วมอื่นที่เด่นชัด'}

• Pertinent Negatives:
${negatives.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• โรคประจำตัว (U/D): ${udDisplay}
• ยาประจำตัว (Current Meds): ${medsText}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${allergyDisplay}

[Emergency Risk Assessment (Red Flags)]
${redFlags.length > 0
  ? `🚩 RED FLAGS DETECTED:\n${redFlags.map(rf => `  * ${rf.textTh}`).join('\n')}`
  : '✓ ไม่พบสัญญาณเตือนวิกฤตเฉียบพลันเบื้องต้น'}

[Doctor's Clinical Addendum & Exam]
• ประวัติเพิ่มเติม/แก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}
• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}
• แผนการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

  let narrative = `ผู้ป่วย${patient.gender || ''}ไทย อายุ ${patient.age || '-'} ปี มารับการตรวจที่ห้องฉุกเฉินด้วยอาการปัสสาวะเป็นเลือด เป็นมา ${durationStr} ก่อนมาโรงพยาบาล `;
  narrative += `สังเกตเห็นน้ำปัสสาวะมีลักษณะ${colorText} ${timingText} `;
  narrative += `${clotSummary} ${obsSummary} `;
  if (patient.hematuriaPainType === 'pain_painless') {
    narrative += `ไม่มีอาการปวดบั้นเอวหรือท้องน้อยแต่อย่างใด `;
  } else {
    narrative += `มีอาการ${painText}${patient.painScore !== null && patient.painScore !== undefined ? ` ประเมินความปวดได้ ${patient.painScore}/10 คะแนน` : ''} `;
  }

  if (systemic.length > 0 && !systemic.includes('rf_systemic_none')) {
    narrative += `ร่วมกับมีอาการทางร่างกาย ได้แก่ ${positives.filter(p => p.includes('ไข้') || p.includes('หน้ามืด') || p.includes('บวม') || p.includes('ซีด') || p.includes('น้ำหนัก')).join(', ')} `;
  } else {
    narrative += `ปฏิเสธไข้หนาวสั่น ปฏิเสธหน้ามืดวิงเวียน ไม่มีหน้าบวมหรือขาบวม `;
  }

  if (patient.hematuriaTraumaMaster === 'trauma_master_yes' && trauma.length > 0) {
    narrative += `ประวัติอุบัติเหตุ/หัตถการ: ${trauma.map(t => {
      if (t === 'hist_trauma_flank_pelvis') return 'กระแทกบั้นเอว/เชิงกราน';
      if (t === 'hist_straddle_injury') return 'กระแทกหว่างขา (Straddle)';
      if (t === 'hist_direct_genital_urethral_trauma') return 'บาดเจ็บที่อวัยวะเพศ/ท่อปัสสาวะโดยตรง';
      if (t === 'hist_blood_at_meatus') return 'มีเลือดหยดที่ปลายท่อปัสสาวะ';
      if (t === 'hist_recent_catheter') return 'เพิ่งคาสายสวนปัสสาวะ';
      if (t === 'hist_recent_urologic_op') return 'เพิ่งผ่าตัด/ส่องกล้อง';
      return t;
    }).join(', ')} `;
  }

  if (patient.otherSymptomsFree) {
    narrative += `ข้อมูลเพิ่มเติมที่ผู้ป่วยแจ้ง: ${patient.otherSymptomsFree} `;
  }

  const jsonOutput = {
    encounter: {
      id: patient.id,
      queue_number: patient.queue_number,
      hn: patient.hn,
      patient_name: patient.name,
      age: patient.age,
      gender: patient.gender,
      chief_complaint: 'hematuria',
      timestamp: patient.timestamp,
      esi_level: patient.esi_level || 3,
      vital_signs: patient.vital_signs || {}
    },
    clinical_history: {
      duration: durationStr,
      color: patient.hematuriaColor,
      timing: patient.hematuriaTiming,
      clots: {
        has_clots: patient.hematuriaClotMaster === 'clot_master_yes',
        types: clotTypes
      },
      voiding_obstruction: {
        has_obstruction: patient.hematuriaObsMaster === 'obs_master_yes',
        types: obsTypes
      },
      pain: {
        type: patient.hematuriaPainType,
        score: patient.painScore
      },
      systemic_signs: systemic,
      trauma_and_interventions: {
        has_trauma: patient.hematuriaTraumaMaster === 'trauma_master_yes',
        types: trauma
      },
      medications_risk: meds,
      malignancy_risk_factors: risks,
      female_bleeding_context: (patient.gender === 'หญิง' || patient.gender === 'Female') ? patient.hematuriaFemaleBleeding : null,
      other_symptoms_free: patient.otherSymptomsFree || ''
    },
    safety_and_red_flags: {
      red_flags_detected: redFlags.map(rf => ({
        key: rf.key,
        level: rf.level,
        title_th: rf.textTh,
        clinical_risk: rf.risk,
        action: rf.suggestedAction
      })),
      total_red_flags: redFlags.length,
      hemodynamic_shock: redFlags.some(rf => rf.key === 'rf_hemodynamic_shock'),
      clot_retention_tamponade: redFlags.some(rf => rf.key === 'rf_clot_retention_tamponade'),
      painless_malignancy: redFlags.some(rf => rf.key === 'rf_painless_gross_hematuria_malignancy'),
      nephritic_syndrome: redFlags.some(rf => rf.key === 'rf_nephritic_syndrome'),
      obstructive_urolithiasis: redFlags.some(rf => rf.key === 'rf_obstructive_urolithiasis'),
      urologic_trauma: redFlags.some(rf => rf.key === 'rf_urologic_trauma'),
      anticoagulant_coagulopathy: redFlags.some(rf => rf.key === 'rf_anticoagulant_coagulopathy')
    }
  };

  const rapidEl = document.getElementById('rapidTextView');
  if (rapidEl) rapidEl.value = patient.custom_rapid_note || defaultRapid;

  const narrativeEl = document.getElementById('narrativeTextView');
  if (narrativeEl) narrativeEl.value = patient.custom_narrative_note || narrative;

  const jsonEl = document.getElementById('jsonViewer');
  if (jsonEl) jsonEl.textContent = JSON.stringify(jsonOutput, null, 2);
}

// --- Built-in Clinical Decision Support (CDS) Generator ---
function generateHematuriaCds(patient, { rfs, ddxList = [], workupList = [], managementList = [] } = {}) {
  if (!patient) return;
  const redFlags = rfs || evaluateHematuriaRedFlags(patient);

  if (redFlags.some(r => r.key === 'rf_hemodynamic_shock')) {
    ddxList.push('1. 🚨 Active Massive Hematuria with Hemorrhagic Shock');
    ddxList.push('2. Ruptured Renal Angiomyolipoma (AML) or Renal Vascular Malformation');
    ddxList.push('3. Severe Bleeding Bladder Neoplasm / Post-procedural Hemorrhage');
    workupList.push('Stat Type & Crossmatch PRC 2-4 units, Platelet conc, FFP');
    workupList.push('CBC, Coagulogram (PT, PTT, INR), BUN, Cr, Electrolytes, Arterial Blood Gas');
    workupList.push('Bedside FAST / Ultrasound KUB, Urgent CT Abdomen Angiography');
    managementList.push('Triage Level 1: ย้ายเข้า Resuscitation Room ทันที');
    managementList.push('เปิดเส้น IV สารน้ำเบอร์ใหญ่ (18G) 2 เส้น ให้ Balanced Crystalloid Resuscitation');
    managementList.push('Transfusion Protocol: ให้เลือด PRC และส่วนประกอบของเลือดตามดุลยพินิจแพทย์');
    managementList.push('Urgent Urology & Interventional Radiology Consultation เพื่อประเมินการผ่าตัดหรือ Embolization');
  } else if (redFlags.some(r => r.key === 'rf_clot_retention_tamponade')) {
    ddxList.push('1. 🚨 Acute Urinary Clot Retention / Bladder Tamponade');
    ddxList.push('2. Bleeding Bladder Tumor (Urothelial Carcinoma)');
    ddxList.push('3. Bleeding Benign Prostatic Hyperplasia (BPH) / Prostatic Varices');
    workupList.push('Bedside Bladder Ultrasound (ประเมินปริมาตรน้ำปัสสาวะและก้อน Clot คั่งค้าง)');
    workupList.push('CBC, BUN, Cr, Electrolytes, Coagulogram (PT, PTT, INR)');
    workupList.push('Stat Urinalysis and Urine Cytology');
    managementList.push('Triage Level 1-2: ห้ามใส่สายสวนโฟเลย์ธรรมดา! ให้ใส่ Three-way Foley catheter ขนาดใหญ่ (20-24 Fr)');
    managementList.push('Manual Clot Irrigation ด้วยกระบอกฉีด Toomey syringe และ NSS จนกว่าน้ำล้างจะใสปราศจากลิ่มเลือด');
    managementList.push('Continuous Bladder Irrigation (CBI) ด้วย 0.9% NSS ทันทีเพื่อป้องกันลิ่มเลือดจับตัวซ้ำ');
    managementList.push('Urgent Urology Consultation หากไม่สามารถระบายลิ่มเลือดออกได้หรือปวดตึงท้องน้อยรุนแรงต่อเนื่อง');
  } else if (redFlags.some(r => r.key === 'rf_urologic_trauma')) {
    ddxList.push('1. 🚨 Urologic Trauma (Renal Laceration / Bladder Rupture / Urethral Disruption)');
    ddxList.push('2. Pelvic Fracture with associated lower urinary tract injury');
    ddxList.push('3. Traumatic Hematuria secondary to straddle impact');
    workupList.push('Stat Retrograde Urethrogram (RUG) ก่อนใส่สายสวนปัสสาวะ หากมี blood at meatus หรือ straddle injury');
    workupList.push('CT Abdomen and Pelvis with IV contrast (AAST Renal Injury Staging & Cystography phase)');
    workupList.push('CBC, Coagulogram, BUN, Cr, Type & Screen จองเลือด');
    managementList.push('Triage Level 1-2: ⚠️ ห้ามใส่สายสวนปัสสาวะทางท่อเด็ดขาด (ห้าม Blind Foley) จนกว่าผล RUG จะยืนยันว่าท่อปัสสาวะสมบูรณ์');
    managementList.push('Immobilization: ตรึงกระดูกเชิงกราน (Pelvic binder) หากสงสัย Pelvic Fracture');
    managementList.push('Urgent Trauma Surgery / Urology Consultation ทันที');
  } else if (redFlags.some(r => r.key === 'rf_nephritic_syndrome')) {
    ddxList.push('1. ⚠️ Acute Post-Streptococcal Glomerulonephritis (PSGN) / Post-infectious GN');
    ddxList.push('2. IgA Nephropathy / IgA Vasculitis (Henoch-Schönlein Purpura)');
    ddxList.push('3. Lupus Nephritis / Rapidly Progressive Glomerulonephritis (RPGN)');
    workupList.push('Stat Urinalysis: ตรวจหา Dysmorphic RBC > 80%, Red Blood Cell Casts, Proteinuria');
    workupList.push('BUN, Cr, eGFR, Serum Electrolytes, Serum Albumin, Uric acid');
    workupList.push('ASO titer, Anti-DNase B, Complement C3, C4, ANA, Anti-dsDNA');
    workupList.push('Urine protein/creatinine ratio (UPCR) หรือ 24-hr urine protein');
    managementList.push('Triage Level 2: ชั่งน้ำหนัก วัดความดันโลหิตซ้ำ บันทึก Intake/Output อย่างเคร่งครัด');
    managementList.push('Salt & Water Restriction: จำกัดโซเดียมและน้ำดื่มเพื่อลดภาวะน้ำคั่งบวมและความดันสูง');
    managementList.push('Loop Diuretics: ให้ Furosemide IV/PO เพื่อควบคุมปริมาตรน้ำส่วนเกินและความดันโลหิต');
    managementList.push('Nephrology Consultation: ปรึกษาอายุรแพทย์โรคไตเพื่อวางแผน Renal Biopsy และการรักษาด้วยยากดภูมิคุ้มกัน');
  } else if (redFlags.some(r => r.key === 'rf_painless_gross_hematuria_malignancy')) {
    ddxList.push('1. ⚠️ Urothelial Carcinoma of Bladder (Bladder Cancer - ต้องแยกโรคเป็นอันดับแรก)');
    ddxList.push('2. Renal Cell Carcinoma (RCC) / Upper Tract Urothelial Carcinoma (UTUC)');
    ddxList.push('3. Prostate Cancer with bladder invasion');
    workupList.push('Urinalysis and Urine Cytology (3 consecutive morning voids)');
    workupList.push('CT Urogram (Triple-phase: Non-contrast, Nephrographic, Excretory phase)');
    workupList.push('CBC, BUN, Cr, Electrolytes, Liver function test, PSA (ในเพศชาย)');
    workupList.push('นัดตรวจ Flexible / Rigid Cystoscopy ในห้องส่องกล้องระบบปัสสาวะ');
    managementList.push('Triage Level 3: สื่อสารให้ผู้ป่วยและญาติเข้าใจว่า "ปัสสาวะเป็นเลือดสดไม่เจ็บปวดในผู้สูงอายุหรือผู้สูบบุหรี่จัด ถือเป็นภาวะสงสัยเนื้องอกทางเดินปัสสาวะจนกว่าจะพิสูจน์ได้ว่าไม่ใช่"');
    managementList.push('ส่งต่อระบบนัดด่วน แผนกศัลยกรรมระบบทางเดินปัสสาวะ (Urology Outpatient Clinic) ภายใน 1-2 สัปดาห์');
    managementList.push('หลีกเลี่ยงการให้ยาปฏิชีวนะโดยไม่จำเป็นหากผลปัสสาวะไม่พบการติดเชื้อ');
  } else if (redFlags.some(r => r.key === 'rf_obstructive_urolithiasis')) {
    ddxList.push('1. Ureteral Calculus / Renal Calculus causing mucosal abrasion');
    ddxList.push('2. Sloughed Renal Papilla (Papillary necrosis)');
    ddxList.push('3. Hemorrhagic Cystitis secondary to stone irritation');
    workupList.push('Stat Non-contrast CT KUB (Gold standard สำหรับการวินิจฉัยนิ่วท่อไต)');
    workupList.push('Plain KUB (ตรวจดู Radio-opaque stone)');
    workupList.push('Urinalysis (RBC, Crystals, WBC เพื่อดูภาวะติดเชื้อซ้อนทับ)');
    workupList.push('CBC, BUN, Cr, Electrolytes');
    managementList.push('Triage Level 3: Pain Control ด้วย NSAIDs เช่น Ketorolac 30 mg IV (หากการทำงานของไตปกติ) หรือ Opioids (Morphine/Fentanyl IV)');
    managementList.push('Medical Expulsive Therapy: พิจารณา Tamsulosin 0.4 mg PO OD หากนิ่วท่อไตส่วนปลายขนาด 5-10 mm');
    managementList.push('IV Hydration เพื่อกระตุ้นการขับตะกอนนิ่ว และเฝ้าระวังไข้ติดเชื้อร่วม (Sepsis from obstructed stone)');
  } else if (redFlags.some(r => r.key === 'rf_anticoagulant_coagulopathy')) {
    ddxList.push('1. Anticoagulant-Associated Gross Hematuria (Over-anticoagulation / Supratherapeutic INR)');
    ddxList.push('2. Occult Urologic Lesion unmasked by anticoagulation therapy');
    ddxList.push('3. Antiplatelet-induced urothelial hemorrhage');
    workupList.push('Stat PT, INR, PTT, CBC, Platelet count');
    workupList.push('BUN, Cr, Electrolytes (ประเมิน Renal clearance ของ DOACs)');
    workupList.push('Urinalysis และส่ง Ultrasound KUB / CT KUB');
    managementList.push('Triage Level 2-3: ประเมินการหยุดยาละลายลิ่มเลือดชั่วคราวตามดุลยพินิจแพทย์');
    managementList.push('พิจารณา Reversal Agent หากเลือดออกมากหรือ INR สูงเกินเกณฑ์ (Vitamin K, Fresh Frozen Plasma, หรือ 4-Factor PCC สำหรับ Warfarin; Idarucizumab หรือ Andexanet alfa สำหรับ DOACs)');
    managementList.push('เน้นย้ำสืบค้นพยาธิสภาพของทางเดินปัสสาวะ (Cystoscopy / Imaging) เสมอ เพราะยาละลายลิ่มเลือดมักทำให้เนื้องอกหรือนิ่วที่ซ่อนอยู่แสดงอาการ');
  } else {
    ddxList.push('1. Acute Hemorrhagic Cystitis (Bacterial Lower UTI)');
    ddxList.push('2. Exercise-Induced Hematuria (March hematuria)');
    ddxList.push('3. Benign Prostatic Hyperplasia (BPH) with microscopic/gross bleeding');
    workupList.push('Urinalysis (UA) - ประเมิน RBC, WBC, Protein, Bacteria');
    workupList.push('Urine Culture and Sensitivity');
    workupList.push('CBC, BUN, Cr');
    workupList.push('Urine Pregnancy Test (ในสตรีวัยเจริญพันธุ์)');
    managementList.push('Triage Level 4: ดื่มน้ำสะอาดปริมาณมาก (2-3 ลิตร/วัน หากไม่มีข้อห้ามเรื่องโรคหัวใจหรือไต)');
    managementList.push('ยาปฏิชีวนะตามแนวทาง UTI หากผลปัสสาวะสงสัย Bacterial Cystitis (เช่น Fosfomycin trometamol 3 g ครั้งเดียว หรือ Nitrofurantoin)');
    managementList.push('แนะนำให้กลับมาตรวจซ้ำทันทีหากมีลิ่มเลือด ปัสสาวะไม่ออก มีไข้หนาวสั่น หรือหน้ามืดเป็นลม');
  }
}
