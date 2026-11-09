// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 29_venomous_bite.js
// อาการนำ: แมลง / งู / สัตว์มีพิษกัดต่อย (Venomous Bites, Snakebites & Arthropod Stings)
// รองรับ Zero Default Bias, Thai Snakebite Syndromic Protocol (สถานเสาวภา),
// Progressive Disclosure 7 ตำแหน่งร่างกาย (พร้อมนิ้วมือ/นิ้วเท้าแยกซ้าย-ขวา โป้ง ชี้ กลาง นาง ก้อย),
// Creature-Specific Progressive Disclosure, Pain Slider Touch State, และ Core Guard TDD 100%
// =========================================================================

// --- Module-scoped State & Helpers ---
let venomPainScoreTouched = false;

function toggleVenomGroup(subId, show) {
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

function handleVenomCreatureChange() {
  const snakeCb = document.querySelector('input[name="venomCreatureTypes"][value="snake"]');
  toggleVenomGroup('venomSnakeDetailsContainer', snakeCb && snakeCb.checked);

  const otherArthropodCb = document.querySelector('input[name="venomCreatureTypes"][value="spider_other_arthropod"]');
  toggleVenomGroup('venomOtherCreatureDetailsContainer', otherArthropodCb && otherArthropodCb.checked);

  // Creature-Specific Progressive Disclosure in Card 3
  const anySnake = (snakeCb && snakeCb.checked) || !!document.querySelector('input[name="venomCreatureTypes"][value="unknown_creature"]:checked');
  toggleVenomGroup('venomSnakeSignsContainer', anySnake);

  const anyHymenoptera = !!document.querySelector('input[name="venomCreatureTypes"][value="bee_wasp_hornet"]:checked') ||
                         !!document.querySelector('input[name="venomCreatureTypes"][value="ant"]:checked');
  toggleVenomGroup('venomHymenopteraSignsContainer', anyHymenoptera);

  const anyArthropod = !!document.querySelector('input[name="venomCreatureTypes"][value="centipede"]:checked') ||
                       !!document.querySelector('input[name="venomCreatureTypes"][value="scorpion"]:checked') ||
                       !!document.querySelector('input[name="venomCreatureTypes"][value="spider_other_arthropod"]:checked');
  toggleVenomGroup('venomArthropodSignsContainer', anyArthropod);

  const anyMarine = !!document.querySelector('input[name="venomCreatureTypes"][value="poisonous_fish"]:checked') ||
                    !!document.querySelector('input[name="venomCreatureTypes"][value="jellyfish_sea_urchin"]:checked');
  toggleVenomGroup('venomMarineSignsContainer', anyMarine);
}

function handleVenomLocalSignsChange() {
  const stingerCb = document.querySelector('input[name="venomLocalSigns"][value="retained_stinger_spine"]');
  toggleVenomGroup('venomStingerStatusContainer', stingerCb && stingerCb.checked);
}

function handleVenomPriorAllergyChange(val) {
  toggleVenomGroup('venomPriorAllergyDetailContainer', val === 'has_prior_allergy');
}

function clearVenomPainScore() {
  venomPainScoreTouched = false;
  const slider = document.getElementById('venomPainScore');
  if (slider) slider.value = 0;
  const emojiEl = document.getElementById('venomPainScoreEmoji');
  const textEl = document.getElementById('venomPainScoreText');
  const badgeEl = document.getElementById('venomPainScoreBadge');
  const clearBtn = document.getElementById('venomPainScoreClearBtn');
  if (emojiEl) emojiEl.textContent = '⚪';
  if (textEl) textEl.textContent = 'ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)';
  if (badgeEl) badgeEl.className = 'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all';
  if (clearBtn) clearBtn.classList.add('hidden');
}

function handleVenomPainScoreChange(val) {
  venomPainScoreTouched = true;
  const num = parseInt(val, 10);
  const slider = document.getElementById('venomPainScore');
  if (slider) slider.value = num;
  const emojiEl = document.getElementById('venomPainScoreEmoji');
  const textEl = document.getElementById('venomPainScoreText');
  const badgeEl = document.getElementById('venomPainScoreBadge');
  const clearBtn = document.getElementById('venomPainScoreClearBtn');
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
const handleVenomPainSliderTouch = handleVenomPainScoreChange;

// --- Clinical Decision Support & Evaluation Functions ---
function evaluateVenomRedFlags(patient) {
  const rfs = [];
  const addRf = (key, level, textTh, risk, action) => {
    rfs.push({ key, level, textTh, title: textTh, risk, detail: risk, suggestedAction: action, action });
  };
  const vs = patient.vital_signs || {};
  const sbp = typeof vs.sbp === 'number' ? vs.sbp : (parseInt(vs.sbp, 10) || null);
  const pr = typeof vs.pr === 'number' ? vs.pr : (parseInt(vs.pr, 10) || null);
  const rr = typeof vs.rr === 'number' ? vs.rr : (parseInt(vs.rr, 10) || null);
  const spo2 = typeof vs.spo2 === 'number' ? vs.spo2 : (parseFloat(vs.spo2) || null);
  const shockIndex = (sbp && pr) ? (pr / sbp) : 0;

  const creatures = Array.isArray(patient.venomCreatureTypes) ? patient.venomCreatureTypes : [];
  const snakeType = patient.venomSnakeType || '';
  const stingsCount = patient.venomStingsCount || '';
  const firstAid = Array.isArray(patient.venomFirstAid) ? patient.venomFirstAid : [];
  const localSigns = Array.isArray(patient.venomLocalSigns) ? patient.venomLocalSigns : [];
  const stingerStatus = patient.venomStingerStatus || '';

  const headSigns = Array.isArray(patient.venomHeadSigns) ? patient.venomHeadSigns : [];
  const neckSigns = Array.isArray(patient.venomNeckSigns) ? patient.venomNeckSigns : [];
  const chestSigns = Array.isArray(patient.venomChestSigns) ? patient.venomChestSigns : [];
  const upperSigns = Array.isArray(patient.venomUpperExtSigns) ? patient.venomUpperExtSigns : [];
  const lowerSigns = Array.isArray(patient.venomLowerExtSigns) ? patient.venomLowerExtSigns : [];

  const allergySigns = Array.isArray(patient.venomSystemicAllergySigns) ? patient.venomSystemicAllergySigns : [];
  const snakeSigns = Array.isArray(patient.venomSnakeSigns) ? patient.venomSnakeSigns : [];
  const hymenopteraSigns = Array.isArray(patient.venomHymenopteraSigns) ? patient.venomHymenopteraSigns : [];
  const marineSigns = Array.isArray(patient.venomMarineSigns) ? patient.venomMarineSigns : [];

  // 1. ANAPHYLAXIS & AIRWAY COMPROMISE (ESI 1 / 2)
  const hasCutaneous = allergySigns.includes('urticaria_itching_erythema') || allergySigns.includes('facial_angioedema');
  const hasRespiratory = allergySigns.includes('laryngeal_edema_hoarseness') || allergySigns.includes('bronchospasm_dyspnea_wheezing') ||
                         headSigns.includes('stung_in_mouth_tongue_swelling') || neckSigns.includes('rapid_neck_swelling_stridor_dysphagia') ||
                         (rr && rr >= 24) || (spo2 && spo2 < 95);
  const hasCirculatory = allergySigns.includes('hypotensive_syncope_shock') || (sbp && sbp < 90) || (shockIndex >= 1.0);
  const hasGi = allergySigns.includes('gi_cramps_vomiting');

  const systemCount = (hasCutaneous ? 1 : 0) + (hasRespiratory ? 1 : 0) + (hasCirculatory ? 1 : 0) + (hasGi ? 1 : 0);
  const isAnaphylaxis = (hasCutaneous && (hasRespiratory || hasCirculatory || hasGi)) ||
                        (systemCount >= 2) ||
                        (hasCirculatory && creatures.some(c => ['bee_wasp_hornet', 'ant'].includes(c))) ||
                        headSigns.includes('stung_in_mouth_tongue_swelling') ||
                        neckSigns.includes('rapid_neck_swelling_stridor_dysphagia');

  if (isAnaphylaxis) {
    const isEsi1 = (sbp && sbp < 90) || shockIndex >= 1.0 || (spo2 && spo2 < 92) || neckSigns.includes('rapid_neck_swelling_stridor_dysphagia');
    addRf(
      'rf_venom_anaphylaxis_airway_shock',
      isEsi1 ? 'ESI 1' : 'ESI 2',
      'ภาวะแพ้รุนแรงเฉียบพลัน (Anaphylaxis) หรือถูกต่อยบริเวณทางเดินหายใจ/ลำคอเสี่ยงต่อการอุดกั้นเฉียบพลัน',
      'ทางเดินหายใจส่วนบนบวมตีบตันเฉียบพลัน (Laryngeal/Tongue edema), หลอดลมหดเกร็งรุนแรง, และภาวะช็อกจากหลอดเลือดขยายตัว',
      'ฉีด Adrenaline (1:1,000) 0.01 mg/kg (ผู้ใหญ่ 0.3-0.5 mg) IM เข้าหน้าขาด้านนอก (Vastus lateralis) ทันที! ให้ออกซิเจน, เปิดเส้นให้ 0.9% NaCl bolus และเตรียมอุปกรณ์ใส่ท่อช่วยหายใจด่วน'
    );
  }

  // 2. NEUROTOXIC SNAKE ENVENOMATION (ESI 1 / 2)
  const isNeuroSnake = ['cobra_king_cobra', 'krait'].includes(snakeType) || (creatures.includes('snake') && snakeType === 'unknown_snake');
  const hasNeuroSigns = snakeSigns.includes('ptosis_diplopia_blurred_vision') ||
                        snakeSigns.includes('dysarthria_bulbar_palsy') ||
                        snakeSigns.includes('motor_weakness_resp_depression');

  if (hasNeuroSigns || (isNeuroSnake && creatures.includes('snake') && firstAid.includes('tourniquet_applied'))) {
    const isEsi1 = snakeSigns.includes('motor_weakness_resp_depression') || snakeSigns.includes('dysarthria_bulbar_palsy') || (spo2 && spo2 < 95);
    addRf(
      'rf_venom_neurotoxic_snake_ptosis_resp',
      isEsi1 ? 'ESI 1' : 'ESI 2',
      'สงสัยพิษงูทำลายระบบประสาท (Neurotoxic Snake Envenomation: งูเห่า/งูจงอาง/งูสามเหลี่ยม/งูทับสมิงคลา)',
      'อัมพาตของกล้ามเนื้อทางเดินหายใจและกล้ามเนื้อกระบังลม (Respiratory failure) อาจหยุดหายใจเฉียบพลัน',
      'ประเมินการหายใจใกล้ชิด, เตรียมใส่ท่อช่วยหายใจ (Endotracheal Intubation), ให้เซรุ่มแก้พิษงูระบบประสาทจำเพาะชนิด (Monovalent หรือ Neuro-polyvalent Antivenom) หากมีขันชะเนาะห้ามคลายสายรัดจนกว่าจะพร้อมใส่ท่อและเตรียมเซรุ่มพร้อม'
    );
  }

  // 3. HEMATOTOXIC SNAKE ENVENOMATION & VICC (ESI 2)
  const isHematoSnake = ['green_pit_viper', 'malayan_pit_viper', 'russells_viper'].includes(snakeType);
  const hasBleedingSigns = snakeSigns.includes('systemic_bleeding_vicc') || localSigns.includes('fang_marks_active_bleeding');
  const hasLocalNecrosis = localSigns.includes('necrosis_hemorrhagic_blebs') || (isHematoSnake && localSigns.includes('severe_rapid_spreading_swelling'));

  if (isHematoSnake || hasBleedingSigns || (creatures.includes('snake') && hasLocalNecrosis)) {
    addRf(
      'rf_venom_hematotoxic_snake_bleeding_vicc',
      'ESI 2',
      'สงสัยพิษงูทำลายระบบเลือด (Hematotoxic Snake: งูกะปะ/งูเขียวหางไหม้/งูแมวเซา) เสี่ยงภาวะ VICC และเลือดออกรุนแรง',
      'ภาวะเลือดไม่แข็งตัว (Venom-Induced Consumption Coagulopathy: VICC), เสี่ยงต่อเลือดออกในอวัยวะสำคัญ, ไตวายเฉียบพลัน และแผลตุ่มน้ำพองเนื้อตายลึก',
      'เจาะตรวจ 20WBCT, VCT, CBC/Platelet, PT/INR, BUN/Cr ทันทีและตรวจซ้ำทุก 6 ชม., พิจารณาให้เซรุ่มแก้พิษงูระบบเลือด (Monovalent หรือ Hemato-polyvalent Antivenom) ตามข้อบ่งชี้ และหลีกเลี่ยงการฉีดยาเข้ากล้ามเนื้อ'
    );
  }

  // 4. MYOTOXIC / MASSIVE STINGS / COMPARTMENT SYNDROME / BOX JELLYFISH (ESI 2)
  const isMassiveStings = stingsCount === 'massive';
  const isSeaSnake = snakeType === 'sea_snake';
  const hasMyoDarkUrine = snakeSigns.includes('severe_myalgia_dark_coke_urine') || hymenopteraSigns.includes('massive_stings_myalgia_jaundice_dark_urine');
  const hasCompartment = upperSigns.includes('arm_tense_compartment_ischemia') || lowerSigns.includes('leg_tense_compartment_ischemia');
  const hasWhipBurns = localSigns.includes('whip_like_burn_tracks') || (creatures.includes('jellyfish_sea_urchin') && marineSigns.includes('excruciating_marine_pain_radiating'));

  if (isMassiveStings || isSeaSnake || hasMyoDarkUrine || hasCompartment || hasWhipBurns) {
    addRf(
      'rf_venom_myotoxic_massive_stings_rhabdo_compartment',
      'ESI 2',
      'ภาวะถูกรุมต่อยหลายจุด / พิษทำลายกล้ามเนื้อ / สงสัยภาวะความดันในช่องกล้ามเนื้อสูง (Compartment Syndrome) หรือพิษแมงกะพรุนไฟ',
      'กล้ามเนื้อสลายตัว (Rhabdomyolysis), ไตวายเฉียบพลัน (AKI), โพแทสเซียมในเลือดสูง หรือกล้ามเนื้อและเส้นประสาทขาดเลือดจาก Compartment syndrome',
      'ตรวจ EKG, CPK, Electrolytes, BUN/Cr, ตรวจปัสสาวะหา Myoglobin, ให้ IV Fluid resuscitation อย่างเพียงพอ, หากขันชะเนาะรัดแน่นมาให้ประเมิน Compartment syndrome ด่วน, หากถูกแมงกะพรุนให้ราดน้ำส้มสายชู 4-6% ทันที'
    );
  }

  // 5. OCULAR SPITTING COBRA / RETAINED SPINE / SECONDARY INFECTION (ESI 2 / 3)
  const isOcularVenom = headSigns.includes('venom_in_eye_pain_blurred') || snakeType === 'spitting_cobra_eye';
  const isRetainedSpineNotRemoved = localSigns.includes('retained_stinger_spine') && stingerStatus === 'not_removed';
  const isSecondaryInfection = localSigns.includes('secondary_infection_pus');

  if (isOcularVenom || isRetainedSpineNotRemoved || isSecondaryInfection) {
    addRf(
      'rf_venom_ocular_spitting_cobra_or_marine_spine',
      isOcularVenom ? 'ESI 2' : 'ESI 3',
      isOcularVenom
        ? 'พิษงูเห่าพ่นพิษเข้าดวงตาโดยตรง (Venom Ophthalmia)'
        : (isRetainedSpineNotRemoved ? 'มีเหล็กในหรือเงี่ยงปลา/หนามสัตว์มีพิษฝังค้างอยู่ในแผล' : 'แผลสัตว์มีพิษกัดต่อยมีการติดเชื้อแบคทีเรียแทรกซ้อน'),
      isOcularVenom
        ? 'กระจกตาอักเสบเป็นแผล (Corneal ulceration/abrasion) และเสี่ยงต่อการติดเชื้อในลูกตา'
        : 'เนื้อเยื่ออักเสบติดเชื้อรุนแรงจากแบคทีเรียในน้ำหรือสิ่งแปลกปลอมฝังลึก',
      isOcularVenom
        ? 'ล้างดวงตาด้วย 0.9% NaCl ปริมาณมากทันที (Copious eye irrigation), ตรวจ Fluorescein stain และปรึกษาจักษุแพทย์ (ไม่ต้องฉีดเซรุ่มแก้พิษงูทางหลอดเลือดดำหากไม่มีแผลถูกกัด)'
        : 'หากถูกเงี่ยงปลาดุก/ปลากระเบนให้แช่น้ำอุ่น 40-45°C นาน 30-90 นาที, ส่งเอกซเรย์หาเงี่ยงหักค้าง, คีบเหล็กในออก และให้ยาปฏิชีวนะครอบคลุมเชื้อทางน้ำ'
    );
  }

  return rfs;
}

// --- Dynamic Output Update Function ---
function updateVenomOutputs(rec) {
  if (!rec) return;
  const rapidText = renderVenomRapidHpi(rec);
  const narrativeText = renderVenomNarrativeHpi(rec);

  const rapidEl = document.getElementById('rapidTextView');
  const narrativeEl = document.getElementById('narrativeTextView');
  if (rapidEl) rapidEl.value = rec.custom_rapid_note || rapidText;
  if (narrativeEl) narrativeEl.value = rec.custom_narrative_note || narrativeText;

  const posMatch = rapidText.match(/• Pertinent Positives:\n((?:\s*-[^\n]+\n?)+)/);
  if (posMatch) {
    rec.pertinentPositives = posMatch[1].trim().split('\n').map(l => l.replace(/^[-*\s]+/, '').trim());
  } else {
    rec.pertinentPositives = ['ปวดบวมเฉพาะจุดตรงที่ถูกกัดต่อย'];
  }

  const negMatch = rapidText.match(/• Pertinent Negatives:\n((?:\s*-[^\n]+\n?)+)/);
  if (negMatch) {
    rec.pertinentNegatives = negMatch[1].trim().split('\n').map(l => l.replace(/^[-*\s]+/, '').trim());
  } else {
    rec.pertinentNegatives = [];
  }

  const redFlags = evaluateVenomRedFlags(rec);
  rec.redFlags = redFlags;
}

function formatVenomCreature(patient) {
  const cMap = {
    snake: 'งู',
    bee_wasp_hornet: 'ผึ้ง / ต่อ / แตน',
    ant: 'มดมีพิษ (มดตะนอย/มดคันไฟ)',
    centipede: 'ตะขาบ',
    scorpion: 'แมงป่อง',
    poisonous_fish: 'ปลามีเงี่ยงพิษ (ปลาดุก/ปลาแขยง/ปลากระเบน)',
    jellyfish_sea_urchin: 'แมงกะพรุน / เม่นทะเล',
    spider_other_arthropod: 'แมงมุม / บึ้ง / สัตว์มีพิษอื่นๆ',
    unknown_creature: 'ไม่ทราบชนิดสัตว์ที่กัดหรือต่อย'
  };
  const list = Array.isArray(patient.venomCreatureTypes) ? patient.venomCreatureTypes.map(c => cMap[c] || c) : [];
  if (patient.venomOtherCreatureDetail && patient.venomOtherCreatureDetail.trim()) {
    list.push(`ระบุ: ${patient.venomOtherCreatureDetail.trim()}`);
  }
  if (Array.isArray(patient.venomCreatureTypes) && patient.venomCreatureTypes.includes('snake')) {
    const sMap = {
      cobra_king_cobra: 'งูเห่า หรือ งูจงอาง',
      spitting_cobra_eye: 'งูเห่าพ่นพิษเข้าตา',
      green_pit_viper: 'งูเขียวหางไหม้',
      malayan_pit_viper: 'งูกะปะ',
      russells_viper: 'งูแมวเซา',
      krait: 'งูสามเหลี่ยม หรือ งูทับสมิงคลา',
      sea_snake: 'งูทะเล',
      non_venomous_snake: 'งูไม่มีพิษ',
      unknown_snake: 'ไม่ทราบชนิดงู/มองไม่ชัด'
    };
    if (patient.venomSnakeType) list.push(`ชนิดงู: ${sMap[patient.venomSnakeType] || patient.venomSnakeType}`);
    if (patient.venomSnakeDetailFree && patient.venomSnakeDetailFree.trim()) {
      list.push(`รายละเอียดงู: ${patient.venomSnakeDetailFree.trim()}`);
    }
  }
  return list.length > 0 ? list.join('; ') : 'ไม่ได้ระบุชนิดสัตว์';
}

function formatVenomFirstAid(patient) {
  const fMap = {
    wash_water_cold_pack: 'ล้างน้ำสะอาด/ประคบเย็น',
    warm_water_soak: 'แช่แผลในน้ำอุ่น (สลายพิษเงี่ยงปลา)',
    vinegar_rinse: 'ราดแผลด้วยน้ำส้มสายชู (แมงกะพรุน)',
    tourniquet_applied: 'ใช้เชือก/ผ้ามัดรัดขันชะเนาะ (วิธีที่ผิด)',
    incision_suction_herbal: 'กรีดแผล/ดูดพิษ/พอกสมุนไพร (วิธีที่ผิด)',
    no_first_aid: 'ยังไม่ได้ทำการปฐมพยาบาลใดๆ'
  };
  const list = Array.isArray(patient.venomFirstAid) ? patient.venomFirstAid.map(f => fMap[f] || f) : [];
  return list.length > 0 ? list.join(', ') : 'ไม่ได้ระบุ';
}

function formatVenomAnatomy(patient) {
  const parts = [];
  const sideLabel = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return '';
    const thMap = { left: 'ซ้าย', right: 'ขวา', center: 'ตรงกลาง' };
    return ` [${arr.map(s => thMap[s] || s).join(', ')}]`;
  };
  const digitMap = { thumb: 'นิ้วโป้ง', index: 'นิ้วชี้', middle: 'นิ้วกลาง', ring: 'นิ้วนาง', little: 'นิ้วก้อย' };
  const fmtDigitsBySide = (leftD, rightD) => {
    const dParts = [];
    if (Array.isArray(leftD) && leftD.length > 0) dParts.push(`ซ้าย: ${leftD.map(x => digitMap[x] || x).join(', ')}`);
    if (Array.isArray(rightD) && rightD.length > 0) dParts.push(`ขวา: ${rightD.map(x => digitMap[x] || x).join(', ')}`);
    return dParts.length > 0 ? ` [${dParts.join('; ')}]` : '';
  };

  if (patient.venomParentHeadFace) {
    const subs = [];
    if (patient.venomHeadScalp) subs.push(`หนังศีรษะ/ท้ายทอย${sideLabel(patient.venomHeadScalpSides)}`);
    if (patient.venomHeadFace) subs.push(`ใบหน้า/แก้ม/คาง${sideLabel(patient.venomHeadFaceSides)}`);
    if (patient.venomHeadEye) subs.push(`ดวงตา/เปลือกตา${sideLabel(patient.venomHeadEyeSides)}`);
    if (patient.venomHeadEar) subs.push(`ใบหู${sideLabel(patient.venomHeadEarSides)}`);
    if (patient.venomHeadNoseMouth) subs.push(`จมูก/ปาก/ลิ้น${sideLabel(patient.venomHeadNoseMouthSides)}`);
    parts.push(`ศีรษะ/ใบหน้า: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  if (patient.venomParentNeck) {
    const subs = [];
    if (patient.venomNeckFront) subs.push(`คอด้านหน้า${sideLabel(patient.venomNeckFrontSides)}`);
    if (patient.venomNeckSide) subs.push(`คอด้านข้าง${sideLabel(patient.venomNeckSideSides)}`);
    if (patient.venomNeckBack) subs.push(`ต้นคอด้านหลัง${sideLabel(patient.venomNeckBackSides)}`);
    parts.push(`ลำคอ: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  if (patient.venomParentChest) {
    const subs = [];
    if (patient.venomChestFront) subs.push(`หน้าอก/ราวนม${sideLabel(patient.venomChestFrontSides)}`);
    if (patient.venomChestBack) subs.push(`หลังส่วนบน/สะบัก${sideLabel(patient.venomChestBackSides)}`);
    parts.push(`หน้าอก/หลังส่วนบน: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  if (patient.venomParentAbdomen) {
    const subs = [];
    if (patient.venomAbdFront) subs.push(`หน้าท้อง${sideLabel(patient.venomAbdFrontSides)}`);
    if (patient.venomAbdFlank) subs.push(`สีข้าง/บั้นเอว${sideLabel(patient.venomAbdFlankSides)}`);
    if (patient.venomAbdLowBack) subs.push(`หลังส่วนล่าง${sideLabel(patient.venomAbdLowBackSides)}`);
    if (patient.venomAbdButtock) subs.push(`สะโพก/ก้น${sideLabel(patient.venomAbdButtockSides)}`);
    if (patient.venomAbdGroinGenitalia) subs.push(`ขาหนีบ/อวัยวะเพศ${sideLabel(patient.venomAbdGroinGenitaliaSides)}`);
    parts.push(`หน้าท้อง/เอว/ก้น: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  if (patient.venomParentUpperExtremity) {
    const subs = [];
    if (patient.venomArmShoulder) subs.push(`หัวไหล่/ต้นแขน${sideLabel(patient.venomArmShoulderSides)}`);
    if (patient.venomArmElbowForearm) subs.push(`ข้อศอก/แขนท่อนล่าง${sideLabel(patient.venomArmElbowForearmSides)}`);
    if (patient.venomArmWristHand) subs.push(`ข้อมือ/ฝ่ามือ/หลังมือ${sideLabel(patient.venomArmWristHandSides)}`);
    if (patient.venomArmFingers) {
      const dStr = fmtDigitsBySide(patient.venomArmFingersLeftDigits, patient.venomArmFingersRightDigits);
      subs.push(`นิ้วมือ${dStr}`);
    }
    parts.push(`แขน/มือ: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  if (patient.venomParentLowerExtremity) {
    const subs = [];
    if (patient.venomLegThigh) subs.push(`ต้นขา${sideLabel(patient.venomLegThighSides)}`);
    if (patient.venomLegKneeShinCalf) subs.push(`เข่า/หน้าแข้ง/น่อง${sideLabel(patient.venomLegKneeShinCalfSides)}`);
    if (patient.venomLegAnkleFoot) subs.push(`ข้อเท้า/ฝ่าเท้า/หลังเท้า${sideLabel(patient.venomLegAnkleFootSides)}`);
    if (patient.venomLegToes) {
      const dStr = fmtDigitsBySide(patient.venomLegToesLeftDigits, patient.venomLegToesRightDigits);
      subs.push(`นิ้วเท้า${dStr}`);
    }
    parts.push(`ขา/เท้า: ${subs.length > 0 ? subs.join(', ') : 'มีบาดเจ็บ'}`);
  }

  if (patient.venomParentOther && patient.venomOtherLocationDetail && patient.venomOtherLocationDetail.trim()) {
    parts.push(`ตำแหน่งอื่นๆ: ${patient.venomOtherLocationDetail.trim()}`);
  }

  return parts.length > 0 ? parts.join(' | ') : 'ไม่ได้ระบุตำแหน่งชัดเจน';
}

function renderVenomRapidHpi(patient) {
  const durVal = patient.durationVal !== undefined && patient.durationVal !== null ? patient.durationVal : '';
  const durUnitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durStr = durVal ? `${durVal} ${durUnitMap[patient.durationUnit] || 'ชั่วโมง'}` : 'ไม่ระบุระยะเวลา';

  const creatureStr = formatVenomCreature(patient);
  const stingsCountMap = { single_or_few: '1-2 จุด', several: '3-9 จุด', massive: 'ถูกรุมต่อยจำนวนมาก (>= 10 จุด)' };
  const stingsStr = stingsCountMap[patient.venomStingsCount] || 'ไม่ได้ระบุจำนวนจุด';
  const firstAidStr = formatVenomFirstAid(patient);
  const anatomyStr = formatVenomAnatomy(patient);

  const localMap = {
    fang_marks_active_bleeding: 'มีรอยเขี้ยว/เลือดไหลซึมไม่หยุด',
    retained_stinger_spine: 'มีเหล็กใน/เงี่ยงหักฝังค้างในแผล',
    severe_rapid_spreading_swelling: 'ปวดบวมรุนแรงลามเร็ว',
    necrosis_hemorrhagic_blebs: 'ตุ่มน้ำพองใส/เลือด หรือเนื้อตายคล้ำ',
    whip_like_burn_tracks: 'รอยไหม้เส้นนูนแดงคล้ายรอยแส้ (แมงกะพรุน)',
    secondary_infection_pus: 'แผลติดเชื้อมีหนอง/รอยแดงลามตามเส้นเลือด',
    mild_local_pain_only: 'ปวดบวมแดงเฉพาะจุดเล็กน้อย'
  };
  let localSigns = Array.isArray(patient.venomLocalSigns) ? patient.venomLocalSigns.map(s => localMap[s] || s) : [];
  if (patient.venomLocalSigns && patient.venomLocalSigns.includes('retained_stinger_spine')) {
    const sMap = { not_removed: 'ยังไม่ได้เอาออก', already_removed: 'เอาออกแล้ว' };
    if (patient.venomStingerStatus) localSigns.push(`สถานะเหล็กใน/เงี่ยง: ${sMap[patient.venomStingerStatus] || patient.venomStingerStatus}`);
  }
  const localStr = localSigns.length > 0 ? localSigns.join(', ') : 'ไม่มีอาการแผลเฉพาะที่ชัดเจน';

  // Systemic Positives / Negatives
  const allergySigns = Array.isArray(patient.venomSystemicAllergySigns) ? patient.venomSystemicAllergySigns : [];
  const snakeSigns = Array.isArray(patient.venomSnakeSigns) ? patient.venomSnakeSigns : [];
  const hymenopteraSigns = Array.isArray(patient.venomHymenopteraSigns) ? patient.venomHymenopteraSigns : [];
  const marineSigns = Array.isArray(patient.venomMarineSigns) ? patient.venomMarineSigns : [];

  const positives = [];
  const negatives = [];

  if (allergySigns.includes('urticaria_itching_erythema')) positives.push('ผื่นลมพิษเห่อคันทั่วตัว');
  if (allergySigns.includes('facial_angioedema')) positives.push('หน้าบวม ตาบวม ริมฝีปากบวม');
  if (allergySigns.includes('laryngeal_edema_hoarseness')) positives.push('แน่นคอ กลืนลำบาก เสียงแหบ');
  if (allergySigns.includes('bronchospasm_dyspnea_wheezing')) positives.push('หายใจหอบเหนื่อย มีเสียงหวีด');
  if (allergySigns.includes('hypotensive_syncope_shock')) positives.push('หน้ามืด วูบจะเป็นลม ใจสั่นเหงื่อแตกตัวเย็น');
  if (allergySigns.includes('gi_cramps_vomiting')) positives.push('ปวดบิดท้อง อาเจียนรุนแรง');
  if (allergySigns.includes('no_systemic_allergy_signs')) negatives.push('ไม่มีอาการผื่นลมพิษ แน่นคอ หายใจหวีด หรือหน้ามืดช็อก');

  if (snakeSigns.includes('ptosis_diplopia_blurred_vision')) positives.push('หนังตาตก ลืมตาไม่ขึ้น มองเห็นภาพซ้อน');
  if (snakeSigns.includes('dysarthria_bulbar_palsy')) positives.push('พูดไม่ชัด ลิ้นแข็ง กลืนน้ำลายลำบาก');
  if (snakeSigns.includes('motor_weakness_resp_depression')) positives.push('แขนขาอ่อนแรง หายใจไม่อิ่ม');
  if (snakeSigns.includes('systemic_bleeding_vicc')) positives.push('มีเลือดออกผิดปกติ (เลือดออกตามไรฟัน/จ้ำเลือด/ปัสสาวะเป็นเลือด)');
  if (snakeSigns.includes('severe_myalgia_dark_coke_urine')) positives.push('ปวดกล้ามเนื้อรุนแรง ปัสสาวะสีโค้ก/เข้มผิดปกติ');
  if (snakeSigns.includes('no_snake_systemic_signs')) negatives.push('ไม่มีอาการหนังตาตก พูดไม่ชัด แขนขาอ่อนแรง หรือเลือดออกผิดปกติ');

  if (hymenopteraSigns.includes('massive_stings_myalgia_jaundice_dark_urine')) positives.push('ปวดเมื่อยกล้ามเนื้อ ตัวเหลือง ปัสสาวะสีเข้ม (พิษแมลงสะสม)');
  if (marineSigns.includes('excruciating_marine_pain_radiating')) positives.push('ปวดแสบปวดร้อนรุนแรงมากร้าวขึ้นรักแร้/ขาหนีบ');

  const pScore = patient.painScore !== null && patient.painScore !== undefined ? `${patient.painScore}/10` : 'ไม่ได้ระบุ';
  const tetanusMap = { within_5_years: '< 5 ปี', '5_to_10_years': '5-10 ปี', over_10_years: '> 10 ปี', unknown_or_never: 'ไม่เคย/จำไม่ได้' };
  const tetanusStr = tetanusMap[patient.venomTetanusHx] || 'ไม่ได้ระบุ';

  let priorAllergyStr = 'ไม่เคยมีประวัติแพ้มาก่อน';
  if (patient.venomPriorAllergyHx === 'has_prior_allergy') {
    priorAllergyStr = `เคยมีอาการแพ้มาก่อน${patient.venomPriorAllergyDetail ? ` (${patient.venomPriorAllergyDetail.trim()})` : ''}`;
  }

  return `[Chief Complaint (CC)]
แมลง / งู / สัตว์มีพิษกัดต่อย เป็นมา ${durStr}

[History of Present Illness (HPI)]
• ชนิดสัตว์มีพิษและจำนวนจุด: ${creatureStr} (จำนวน ${stingsStr}) เป็นมา ${durStr}
• การปฐมพยาบาลก่อนมา รพ.: ${firstAidStr}
• ตำแหน่งที่ถูกกัด/ต่อย: ${anatomyStr}
• ลักษณะบาดแผลเฉพาะที่: ${localStr}
• ระดับความปวด (Pain Score): ${pScore}

• Pertinent Positives:
${positives.length > 0 ? positives.map(p => `  - ${p}`).join('\n') : '  - ปวดบวมเฉพาะที่ตรงจุดที่ถูกกัด/ต่อย'}

• Pertinent Negatives:
${negatives.length > 0 ? negatives.map(n => `  - ${n}`).join('\n') : '  - ปฏิเสธอาการแน่นคอ หายใจลำบาก หรือเลือดออกผิดปกติ'}

[Past Medical History & Immunization Profile]
• สถานะประวัติ รพ.ราชบุรี: ${patient.hospRecordStatus === 'complete' ? 'มีประวัติครบถ้วน' : (patient.hospRecordStatus === 'additional' ? 'มีประวัติเดิมและขอเพิ่ม' : 'ให้ข้อมูลใหม่ทั้งหมด')}
• ประวัติแพ้พิษแมลง/สัตว์มีพิษในอดีต: ${priorAllergyStr}
• ประวัติวัคซีนบาดทะยัก: ${tetanusStr}
• โรคประจำตัว (U/D): ${Array.isArray(patient.underlying) && patient.underlying.length > 0 ? patient.underlying.join(', ') : 'ปฏิเสธ'}
• ยาประจำตัว: ${patient.currentMeds || 'ไม่มี'} | แพ้ยา: ${patient.drugAllergy || 'ปฏิเสธ'}`;
}

function renderVenomNarrativeHpi(patient) {
  const durVal = patient.durationVal !== undefined && patient.durationVal !== null ? patient.durationVal : '';
  const durUnitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
  const durStr = durVal ? `${durVal} ${durUnitMap[patient.durationUnit] || 'ชั่วโมง'}` : 'ไม่ระบุระยะเวลา';

  const creatureStr = formatVenomCreature(patient);
  const anatomyStr = formatVenomAnatomy(patient);
  const firstAidStr = formatVenomFirstAid(patient);

  let text = `ผู้ป่วยมาด้วยอาการถูก${creatureStr}กัดต่อย เป็นมาประมาณ ${durStr} ก่อนมาโรงพยาบาล บริเวณ ${anatomyStr}`;
  if (firstAidStr && firstAidStr !== 'ไม่ได้ระบุ') text += ` ได้รับการปฐมพยาบาลเบื้องต้นโดย${firstAidStr}`;

  const allergySigns = Array.isArray(patient.venomSystemicAllergySigns) ? patient.venomSystemicAllergySigns : [];
  if (allergySigns.includes('urticaria_itching_erythema') || allergySigns.includes('facial_angioedema') || allergySigns.includes('laryngeal_edema_hoarseness') || allergySigns.includes('bronchospasm_dyspnea_wheezing')) {
    text += ` มีอาการผื่นลมพิษ บวม หรือแน่นคอหายใจลำบาก`;
  }
  const snakeSigns = Array.isArray(patient.venomSnakeSigns) ? patient.venomSnakeSigns : [];
  if (snakeSigns.includes('ptosis_diplopia_blurred_vision') || snakeSigns.includes('dysarthria_bulbar_palsy') || snakeSigns.includes('systemic_bleeding_vicc')) {
    text += ` ร่วมกับมีอาการผิดปกติทางระบบประสาทหรือเลือดออกผิดปกติ`;
  }
  return text;
}

function generateVenomCds(patient) {
  const rfs = evaluateVenomRedFlags(patient);
  let highestEsi = 4;
  if (rfs.some(r => r.level.includes('ESI 1'))) highestEsi = 1;
  else if (rfs.some(r => r.level.includes('ESI 2'))) highestEsi = 2;
  else if (rfs.some(r => r.level.includes('ESI 3'))) highestEsi = 3;

  const ddx = [];
  const plan = [];
  const setPlan = (d, p) => { ddx.push(d); plan.push(...p); };

  if (rfs.some(r => r.key === 'rf_venom_anaphylaxis_airway_shock')) {
    setPlan('Acute Anaphylaxis / Severe Hymenoptera Allergy with Airway Compromise', [
      'IM Adrenaline (1:1,000) 0.3-0.5 mg เข้า Vastus lateralis ทันที (ฉีดซ้ำได้ทุก 5-15 นาที)',
      'High-flow Oxygen via Non-rebreather mask, เตรียม Endotracheal Intubation หากมี Stridor/Laryngeal edema',
      '0.9% NaCl 1,000 mL IV bolus, IV Dexamethasone/Hydrocortisone, IV Chlorpheniramine/Diphenhydramine'
    ]);
  }

  if (rfs.some(r => r.key === 'rf_venom_neurotoxic_snake_ptosis_resp')) {
    setPlan('Neurotoxic Snake Envenomation (Cobra / King Cobra / Krait) with Bulbar Palsy', [
      'เฝ้าระวังทางเดินหายใจใกล้ชิด (Negative Inspiratory Force / SpO2), เตรียมใส่ท่อช่วยหายใจทันทีหากมี Bulbar palsy',
      'หากมัดขันชะเนาะมา ห้ามคลายสายรัดจนกว่าจะเตรียมท่อช่วยหายใจและเซรุ่มพร้อม',
      'ให้ Monovalent Cobra Antivenom หรือ Neuro-polyvalent Antivenom ตามข้อบ่งชี้ทางคลินิกของสถานเสาวภา'
    ]);
  }

  if (rfs.some(r => r.key === 'rf_venom_hematotoxic_snake_bleeding_vicc')) {
    setPlan('Hematotoxic Snake Envenomation (Pit Viper / Russell Viper) with Suspected VICC', [
      'เจาะตรวจ 20WBCT, VCT, Venous Platelet, PT/INR, BUN/Cr, Electrolytes ทันทีและตรวจซ้ำทุก 6 ชั่วโมง',
      'พิจารณาให้ Monovalent หรือ Hemato-polyvalent Antivenom หาก 20WBCT ไม่แข็งตัว หรือเกล็ดเลือด < 50,000',
      'งดฉีดยาเข้ากล้ามเนื้อ (Avoid IM injections) และยกขาสูง/ประคบสังเกตอาการบวม'
    ]);
  }

  if (rfs.some(r => r.key === 'rf_venom_myotoxic_massive_stings_rhabdo_compartment')) {
    setPlan('Massive Envenomation / Rhabdomyolysis / Suspected Compartment Syndrome', [
      'ส่งตรวจ EKG, CPK, Electrolytes (เฝ้าระวัง Hyperkalemia), BUN/Cr, และ Urinalysis (Myoglobin)',
      'Aggressive IV Hydration ด้วย Isotonic crystalloid เพื่อป้องกัน Myoglobinuric Acute Tubular Necrosis',
      'วัด Compartment pressure หากแขนขาบวมตึงแข็งและปวดมากเวลา passive stretch'
    ]);
  }

  if (ddx.length === 0) {
    setPlan('Localized Venomous Bite / Arthropod Sting without Systemic Envenomation (Low-Risk)', [
      'ทำความสะอาดบาดแผลด้วยน้ำสะอาดและสบู่, คีบเหล็กในออกหากมีค้าง',
      'ให้ยาแก้ปวด (Paracetamol หรือ NSAIDs) และยาทา/ยากิน Antihistamine ลดอาการคันบวม',
      'หากถูกเงี่ยงปลาดุก/ปลากระเบน ให้แช่น้ำอุ่น 40-45°C นาน 30-90 นาทีเพื่อสลายพิษ',
      'พิจารณาฉีด Tetanus toxoid booster หากเข็มล่าสุดเกิน 5-10 ปี และสังเกตอาการที่ ER อย่างน้อย 1-2 ชม.'
    ]);
  }

  return {
    chiefComplaint: 'venomous_bite',
    calculatedEsi: highestEsi,
    redFlags: rfs,
    differentialDiagnosis: ddx,
    suggestedInvestigations: plan.filter(p => p.includes('ตรวจ') || p.includes('เจาะ') || p.includes('EKG') || p.includes('20WBCT')),
    suggestedManagement: plan.filter(p => !p.includes('ตรวจ') && !p.includes('เจาะ') && !p.includes('EKG') && !p.includes('20WBCT'))
  };
}

// --- FORM HTML TEMPLATE ---
const VENOMOUS_BITE_FORM_HTML = `
<div id="cc-venomous-bite-section" class="space-y-6">

  <!-- First-Aid Guidance Banner -->
  <div class="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs sm:text-sm text-amber-900 flex items-start space-x-3 shadow-xs">
    <i data-lucide="alert-circle" class="w-5 h-5 text-amber-600 shrink-0 mt-0.5"></i>
    <div class="space-y-1">
      <strong class="font-bold block text-amber-950 text-sm sm:text-base">ข้อแนะนำการปฏิบัติตัวเบื้องต้นเมื่อถูกงู แมลง หรือสัตว์มีพิษกัดต่อย:</strong>
      <ol class="list-decimal list-inside space-y-0.5 text-amber-800">
        <li><strong>ถอดแหวน นาฬิกา กำไล หรือเครื่องประดับออกทันที:</strong> ก่อนที่นิ้วมือ ข้อมือ หรือข้อเท้าจะบวมจนรัดแน่นและขาดเลือด</li>
        <li><strong>กรณีถูกงูกัด:</strong> พยายามอยู่นิ่งๆ ขยับส่วนที่ถูกกัดให้น้อยที่สุด <strong>ห้ามขันชะเนาะ</strong> และห้ามกรีดแผลหรือดูดพิษเด็ดขาด</li>
        <li><strong>หากมีอาการแน่นคอ หายใจลำบาก หน้ามืด หรือลืมตาไม่ขึ้น:</strong> กรุณาแจ้งพยาบาลหน้าห้องฉุกเฉินทันที</li>
      </ol>
    </div>
  </div>

  <!-- CARD 1: ชนิดสัตว์มีพิษ ลักษณะเหตุการณ์ และการปฐมพยาบาลเบื้องต้น -->
  <div class="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-5">
    <div class="flex items-center space-x-2 border-b border-slate-100 pb-3">
      <div class="p-2 rounded-xl bg-medical-100 text-medical-700">
        <i data-lucide="bug" class="w-5 h-5"></i>
      </div>
      <div>
        <h3 class="text-sm sm:text-base font-bold text-slate-900">1. ข้อมูลสัตว์มีพิษ จำนวนจุด และการปฐมพยาบาลเบื้องต้น</h3>
        <p class="text-xs text-slate-500">ระบุชนิดสัตว์ที่กัด/ต่อย และสิ่งที่ได้ดูแลเบื้องต้นก่อนมาโรงพยาบาล</p>
      </div>
    </div>

    <!-- 1.1 เหตุการณ์ถูกกัดหรือต่อยเกิดขึ้นมานานเท่าใด -->
    <div>
      <label class="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
        1.1 เหตุการณ์ถูกกัดหรือต่อยเกิดขึ้นมานานเท่าใด:
      </label>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div class="col-span-1 sm:col-span-2">
          <input type="number" id="venomDurationVal" min="1" max="365" placeholder="ระบุตัวเลข เช่น 30"
            class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white transition">
        </div>
        <div class="col-span-1">
          <select id="venomDurationUnit"
            class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white transition">
            <option value="minutes">นาที</option>
            <option value="hours" selected>ชั่วโมง</option>
            <option value="days">วัน</option>
            <option value="weeks">สัปดาห์</option>
            <option value="months">เดือน</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 1.2 ชนิดสัตว์มีพิษ -->
    <div>
      <label class="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">1.2 ชนิดของสัตว์มีพิษหรือแมลงที่กัด/ต่อย (เลือกได้หลายข้อ):</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="venomCreatureTypes" value="snake" onchange="handleVenomCreatureChange()" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2.5 font-bold text-rose-800">งู (มีพิษ / ไม่มีพิษ)</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="venomCreatureTypes" value="bee_wasp_hornet" onchange="handleVenomCreatureChange()" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2.5 font-medium text-slate-800">ผึ้ง / ต่อ / แตน (เช่น ต่อหัวเสือ, ผึ้งหลวง)</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="venomCreatureTypes" value="ant" onchange="handleVenomCreatureChange()" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2.5 font-medium text-slate-800">มดมีพิษ (มดตะนอย / มดคันไฟ)</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="venomCreatureTypes" value="centipede" onchange="handleVenomCreatureChange()" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2.5 font-medium text-slate-800">ตะขาบ</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="venomCreatureTypes" value="scorpion" onchange="handleVenomCreatureChange()" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2.5 font-medium text-slate-800">แมงป่อง (แมงป่องช้าง / แมงป่องบ้าน)</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="venomCreatureTypes" value="poisonous_fish" onchange="handleVenomCreatureChange()" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2.5 font-medium text-slate-800">ปลามีเงี่ยงพิษ (ปลาดุก / ปลาแขยง / ปลากระเบน)</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="venomCreatureTypes" value="jellyfish_sea_urchin" onchange="handleVenomCreatureChange()" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2.5 font-medium text-slate-800">แมงกะพรุน (แมงกะพรุนไฟ / กล่อง) หรือเม่นทะเล</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="venomCreatureTypes" value="spider_other_arthropod" onchange="handleVenomCreatureChange()" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2.5 font-medium text-slate-800">แมงมุม / บึ้ง / ก้นกระดก / บุ้ง / อื่นๆ</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 sm:col-span-2">
          <input type="checkbox" name="venomCreatureTypes" value="unknown_creature" onchange="handleVenomCreatureChange()" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2.5 font-medium text-slate-700">ไม่ทราบชนิดสัตว์ที่กัดหรือต่อย (รู้สึกเจ็บแปล๊บหรือพบรอยแผลโดยไม่เห็นตัว)</span>
        </label>
      </div>
    </div>

    <!-- กิ่งย่อยเมื่องูถูกเลือก -->
    <div id="venomSnakeDetailsContainer" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 sm:p-4 space-y-3">
      <label class="block text-xs sm:text-sm font-bold text-slate-900">ชนิดหรือลักษณะของงูที่กัด (หากทราบหรือถ่ายรูปมา):</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
        <label class="selectable-card flex items-center p-2.5 bg-white rounded-lg border border-slate-200 cursor-pointer">
          <input type="radio" name="venomSnakeType" value="cobra_king_cobra" class="text-medical-600 h-4 w-4">
          <span class="ml-2 font-medium text-slate-800">งูเห่า หรือ งูจงอาง (งูแผ่แม่เบี้ย)</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 bg-white rounded-lg border border-slate-200 cursor-pointer">
          <input type="radio" name="venomSnakeType" value="spitting_cobra_eye" class="text-medical-600 h-4 w-4">
          <span class="ml-2 font-medium text-slate-800">งูเห่าพ่นพิษเข้าตา</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 bg-white rounded-lg border border-slate-200 cursor-pointer">
          <input type="radio" name="venomSnakeType" value="green_pit_viper" class="text-medical-600 h-4 w-4">
          <span class="ml-2 font-medium text-slate-800">งูเขียวหางไหม้ (ตัวสีเขียว หางสีแดงคล้ำ)</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 bg-white rounded-lg border border-slate-200 cursor-pointer">
          <input type="radio" name="venomSnakeType" value="malayan_pit_viper" class="text-medical-600 h-4 w-4">
          <span class="ml-2 font-medium text-slate-800">งูกะปะ (ตัวสีน้ำตาล ลายสามเหลี่ยม)</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 bg-white rounded-lg border border-slate-200 cursor-pointer">
          <input type="radio" name="venomSnakeType" value="russells_viper" class="text-medical-600 h-4 w-4">
          <span class="ml-2 font-medium text-slate-800">งูแมวเซา (ตัวอ้วนสีน้ำตาล ลายวงกลมคล้ายโซ่)</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 bg-white rounded-lg border border-slate-200 cursor-pointer">
          <input type="radio" name="venomSnakeType" value="krait" class="text-medical-600 h-4 w-4">
          <span class="ml-2 font-medium text-slate-800">งูสามเหลี่ยม หรือ งูทับสมิงคลา (มีปล้องดำ-เหลือง / ดำ-ขาว)</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 bg-white rounded-lg border border-slate-200 cursor-pointer">
          <input type="radio" name="venomSnakeType" value="sea_snake" class="text-medical-600 h-4 w-4">
          <span class="ml-2 font-medium text-slate-800">งูทะเล</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 bg-white rounded-lg border border-slate-200 cursor-pointer">
          <input type="radio" name="venomSnakeType" value="non_venomous_snake" class="text-medical-600 h-4 w-4">
          <span class="ml-2 font-medium text-slate-800">งูไม่มีพิษ (งูเหลือม, งูหลาม, งูสิง)</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 bg-white rounded-lg border border-slate-200 cursor-pointer sm:col-span-2">
          <input type="radio" name="venomSnakeType" value="unknown_snake" class="text-medical-600 h-4 w-4">
          <span class="ml-2 font-medium text-slate-700">ไม่ทราบชนิดงู / มองไม่เห็นตัวงูชัดเจน</span>
        </label>
      </div>
      <div>
        <input type="text" id="venomSnakeDetailFree" placeholder="ระบุลักษณะงูเพิ่มเติม หรือระบุว่ามีรูปถ่าย/ซากงูนำมาด้วย..." class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-medical-500">
      </div>
    </div>

    <!-- กิ่งย่อยสัตว์มีพิษอื่นๆ -->
    <div id="venomOtherCreatureDetailsContainer" class="hidden">
      <input type="text" id="venomOtherCreatureDetail" placeholder="พิมพ์ระบุชนิดสัตว์หรือแมลงที่กัดต่อย..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-medical-500">
    </div>

    <!-- 1.3 จำนวนจุดที่ถูกกัด/ต่อย -->
    <div class="pt-3 border-t border-slate-100">
      <label class="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">1.3 จำนวนจุดหรือจำนวนแผลที่ถูกกัด/ต่อย:</label>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="radio" name="venomStingsCount" value="single_or_few" class="text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-800">1 จุด (หรือ 1-2 จุด)</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="radio" name="venomStingsCount" value="several" class="text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-800">หลายจุด (ประมาณ 3-9 จุด)</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="radio" name="venomStingsCount" value="massive" class="text-medical-600 h-4 w-4">
          <span class="ml-2 font-bold text-rose-700">รุมต่อยมาก (>= 10 จุด)</span>
        </label>
      </div>
    </div>

    <!-- 1.4 การปฐมพยาบาลเบื้องต้น -->
    <div class="pt-3 border-t border-slate-100">
      <label class="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">1.4 การปฐมพยาบาลเบื้องต้นที่ได้ทำไปแล้วก่อนมาโรงพยาบาล (เลือกได้หลายข้อ):</label>
      <div class="space-y-2 text-xs sm:text-sm">
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="venomFirstAid" value="wash_water_cold_pack" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-800">ล้างแผลด้วยน้ำสะอาด หรือประคบเย็น</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="venomFirstAid" value="warm_water_soak" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-800">แช่แผลในน้ำอุ่น (กรณีถูกเงี่ยงปลาตำหรือสัตว์น้ำมีพิษ)</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="venomFirstAid" value="vinegar_rinse" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-800">ราดแผลด้วยน้ำส้มสายชู (กรณีถูกแมงกะพรุน)</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-rose-200 bg-rose-50/40 cursor-pointer hover:bg-rose-50">
          <input type="checkbox" name="venomFirstAid" value="tourniquet_applied" class="rounded text-rose-600 h-4 w-4">
          <span class="ml-2 font-medium text-rose-900">ใช้เชือก ผ้า หรือสายรัด มัดรัดเหนือแผลไว้ (ขันชะเนาะ) <span class="font-bold text-rose-700">(เป็นวิธีที่ผิด ไม่ควรทำ)</span></span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-rose-200 bg-rose-50/40 cursor-pointer hover:bg-rose-50">
          <input type="checkbox" name="venomFirstAid" value="incision_suction_herbal" class="rounded text-rose-600 h-4 w-4">
          <span class="ml-2 font-medium text-rose-900">กรีดแผล ใช้ปากดูดพิษ หรือนำสมุนไพร/สิ่งแปลกปลอมพอกแผล <span class="font-bold text-rose-700">(เป็นวิธีที่ผิด ไม่ควรทำ)</span></span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="venomFirstAid" value="no_first_aid" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-600">ยังไม่ได้ทำการปฐมพยาบาลใดๆ</span>
        </label>
      </div>
    </div>
  </div>

  <!-- CARD 2: ตำแหน่งของร่างกายที่ถูกกัด/ต่อย (7 ส่วน) และลักษณะแผลเฉพาะที่ -->
  <div class="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-5">
    <div class="flex items-center space-x-2 border-b border-slate-100 pb-3">
      <div class="p-2 rounded-xl bg-medical-100 text-medical-700">
        <i data-lucide="user-check" class="w-5 h-5"></i>
      </div>
      <div>
        <h3 class="text-sm sm:text-base font-bold text-slate-900">2. ตำแหน่งของร่างกายที่ถูกกัด/ต่อย และลักษณะแผลเฉพาะที่</h3>
        <p class="text-xs text-slate-500">เลือกตำแหน่งร่างกายที่มีบาดแผล และระบุอาการเฉพาะที่</p>
      </div>
    </div>

    <!-- 2.1 ศีรษะ ใบหน้า -->
    <div class="border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
      <label class="flex items-center cursor-pointer">
        <input type="checkbox" id="venomParentHeadFace" onchange="toggleVenomGroup('venomHeadFaceSubGroup', this.checked)" class="rounded text-medical-600 h-4 w-4">
        <span class="ml-2 text-xs sm:text-sm font-bold text-slate-900">2.1 บาดแผลที่ศีรษะ ใบหน้า ดวงตา หรือในช่องปาก</span>
      </label>
      <div id="venomHeadFaceSubGroup" class="hidden space-y-3 pl-6 pt-2 border-t border-slate-100 text-xs sm:text-sm">
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="venomHeadScalp" onchange="toggleVenomGroup('venomHeadScalpSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5">หนังศีรษะ/หน้าผาก/ท้ายทอย</span></label>
            <div id="venomHeadScalpSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ด้าน:</span>
              <label class="flex items-center"><input type="checkbox" name="venomHeadScalpSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="venomHeadScalpSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ขวา</span></label>
              <label class="flex items-center"><input type="checkbox" name="venomHeadScalpSides" value="center" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ตรงกลาง</span></label>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="venomHeadFace" onchange="toggleVenomGroup('venomHeadFaceSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5">ใบหน้า/แก้ม/คาง</span></label>
            <div id="venomHeadFaceSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ด้าน:</span>
              <label class="flex items-center"><input type="checkbox" name="venomHeadFaceSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="venomHeadFaceSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ขวา</span></label>
              <label class="flex items-center"><input type="checkbox" name="venomHeadFaceSides" value="center" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ตรงกลาง</span></label>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="venomHeadEye" onchange="toggleVenomGroup('venomHeadEyeSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5">ดวงตา/เปลือกตา</span></label>
            <div id="venomHeadEyeSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ข้าง:</span>
              <label class="flex items-center"><input type="checkbox" name="venomHeadEyeSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="venomHeadEyeSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ขวา</span></label>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="venomHeadEar" onchange="toggleVenomGroup('venomHeadEarSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5">ใบหู</span></label>
            <div id="venomHeadEarSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ข้าง:</span>
              <label class="flex items-center"><input type="checkbox" name="venomHeadEarSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="venomHeadEarSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ขวา</span></label>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="venomHeadNoseMouth" onchange="toggleVenomGroup('venomHeadNoseMouthSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5">จมูก/ริมฝีปาก/ในปาก/ลิ้น</span></label>
            <div id="venomHeadNoseMouthSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ด้าน:</span>
              <label class="flex items-center"><input type="checkbox" name="venomHeadNoseMouthSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="venomHeadNoseMouthSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ขวา</span></label>
              <label class="flex items-center"><input type="checkbox" name="venomHeadNoseMouthSides" value="center" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ตรงกลาง</span></label>
            </div>
          </div>
        </div>
        <div class="pt-2 border-t border-slate-100 space-y-1.5">
          <span class="font-semibold text-slate-700 block">อาการสำคัญที่พบร่วมด้วย:</span>
          <label class="flex items-center"><input type="checkbox" name="venomHeadSigns" value="venom_in_eye_pain_blurred" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 font-medium text-rose-800">ถูกพิษงูหรือพิษแมลงเข้าตา มีอาการปวดแสบตารุนแรง น้ำตาไหล หรือตามัว</span></label>
          <label class="flex items-center"><input type="checkbox" name="venomHeadSigns" value="stung_in_mouth_tongue_swelling" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 font-medium text-rose-800">ถูกต่อยในปาก ลิ้น หรือริมฝีปาก จนเริ่มบวมคับปาก</span></label>
        </div>
      </div>
    </div>

    <!-- 2.2 ลำคอ -->
    <div class="border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
      <label class="flex items-center cursor-pointer">
        <input type="checkbox" id="venomParentNeck" onchange="toggleVenomGroup('venomNeckSubGroup', this.checked)" class="rounded text-medical-600 h-4 w-4">
        <span class="ml-2 text-xs sm:text-sm font-bold text-slate-900">2.2 บาดแผลที่ลำคอ</span>
      </label>
      <div id="venomNeckSubGroup" class="hidden space-y-3 pl-6 pt-2 border-t border-slate-100 text-xs sm:text-sm">
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="venomNeckFront" onchange="toggleVenomGroup('venomNeckFrontSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5">ลำคอด้านหน้า</span></label>
            <div id="venomNeckFrontSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ด้าน:</span>
              <label class="flex items-center"><input type="checkbox" name="venomNeckFrontSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="venomNeckFrontSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ขวา</span></label>
              <label class="flex items-center"><input type="checkbox" name="venomNeckFrontSides" value="center" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ตรงกลาง</span></label>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="venomNeckSide" onchange="toggleVenomGroup('venomNeckSideSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5">ลำคอด้านข้าง</span></label>
            <div id="venomNeckSideSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ข้าง:</span>
              <label class="flex items-center"><input type="checkbox" name="venomNeckSideSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="venomNeckSideSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ขวา</span></label>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="venomNeckBack" onchange="toggleVenomGroup('venomNeckBackSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5">ต้นคอด้านหลัง</span></label>
            <div id="venomNeckBackSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ด้าน:</span>
              <label class="flex items-center"><input type="checkbox" name="venomNeckBackSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="venomNeckBackSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ขวา</span></label>
              <label class="flex items-center"><input type="checkbox" name="venomNeckBackSides" value="center" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ตรงกลาง</span></label>
            </div>
          </div>
        </div>
        <div class="pt-2 border-t border-slate-100 space-y-1.5">
          <span class="font-semibold text-slate-700 block">อาการสำคัญที่พบร่วมด้วย:</span>
          <label class="flex items-center"><input type="checkbox" name="venomNeckSigns" value="rapid_neck_swelling_stridor_dysphagia" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 font-medium text-rose-800">คอบวมโตขึ้นอย่างรวดเร็ว อึดอัดแน่นคอ หรือกลืนลำบาก</span></label>
        </div>
      </div>
    </div>

    <!-- 2.3 หน้าอก / หลังบน -->
    <div class="border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
      <label class="flex items-center cursor-pointer">
        <input type="checkbox" id="venomParentChest" onchange="toggleVenomGroup('venomChestSubGroup', this.checked)" class="rounded text-medical-600 h-4 w-4">
        <span class="ml-2 text-xs sm:text-sm font-bold text-slate-900">2.3 บาดแผลที่หน้าอก หรือแผ่นหลังส่วนบน/สะบัก</span>
      </label>
      <div id="venomChestSubGroup" class="hidden space-y-3 pl-6 pt-2 border-t border-slate-100 text-xs sm:text-sm">
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="venomChestFront" onchange="toggleVenomGroup('venomChestFrontSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5">หน้าอก/ราวนม</span></label>
            <div id="venomChestFrontSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ด้าน:</span>
              <label class="flex items-center"><input type="checkbox" name="venomChestFrontSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="venomChestFrontSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ขวา</span></label>
              <label class="flex items-center"><input type="checkbox" name="venomChestFrontSides" value="center" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ตรงกลาง</span></label>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="venomChestBack" onchange="toggleVenomGroup('venomChestBackSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5">แผ่นหลังส่วนบน/สะบัก</span></label>
            <div id="venomChestBackSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ด้าน:</span>
              <label class="flex items-center"><input type="checkbox" name="venomChestBackSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="venomChestBackSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ขวา</span></label>
              <label class="flex items-center"><input type="checkbox" name="venomChestBackSides" value="center" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ตรงกลาง</span></label>
            </div>
          </div>
        </div>
        <div class="pt-2 border-t border-slate-100 space-y-1.5">
          <span class="font-semibold text-slate-700 block">อาการสำคัญที่พบร่วมด้วย:</span>
          <label class="flex items-center"><input type="checkbox" name="venomChestSigns" value="chest_tightness_dyspnea" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2">เจ็บแน่นหน้าอก หรือหายใจไม่อิ่ม</span></label>
        </div>
      </div>
    </div>

    <!-- 2.4 หน้าท้อง / เอว / ก้น -->
    <div class="border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
      <label class="flex items-center cursor-pointer">
        <input type="checkbox" id="venomParentAbdomen" onchange="toggleVenomGroup('venomAbdomenSubGroup', this.checked)" class="rounded text-medical-600 h-4 w-4">
        <span class="ml-2 text-xs sm:text-sm font-bold text-slate-900">2.4 บาดแผลที่หน้าท้อง บั้นเอว หลังส่วนล่าง สะโพก หรืออวัยวะเพศ</span>
      </label>
      <div id="venomAbdomenSubGroup" class="hidden space-y-3 pl-6 pt-2 border-t border-slate-100 text-xs sm:text-sm">
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="venomAbdFront" onchange="toggleVenomGroup('venomAbdFrontSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5">หน้าท้อง</span></label>
            <div id="venomAbdFrontSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ด้าน:</span>
              <label class="flex items-center"><input type="checkbox" name="venomAbdFrontSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="venomAbdFrontSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ขวา</span></label>
              <label class="flex items-center"><input type="checkbox" name="venomAbdFrontSides" value="center" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ตรงกลาง</span></label>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="venomAbdFlank" onchange="toggleVenomGroup('venomAbdFlankSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5">สีข้าง/บั้นเอว</span></label>
            <div id="venomAbdFlankSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ข้าง:</span>
              <label class="flex items-center"><input type="checkbox" name="venomAbdFlankSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="venomAbdFlankSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ขวา</span></label>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="venomAbdLowBack" onchange="toggleVenomGroup('venomAbdLowBackSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5">หลังส่วนล่าง</span></label>
            <div id="venomAbdLowBackSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ด้าน:</span>
              <label class="flex items-center"><input type="checkbox" name="venomAbdLowBackSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="venomAbdLowBackSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ขวา</span></label>
              <label class="flex items-center"><input type="checkbox" name="venomAbdLowBackSides" value="center" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ตรงกลาง</span></label>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="venomAbdButtock" onchange="toggleVenomGroup('venomAbdButtockSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5">สะโพก/ก้น</span></label>
            <div id="venomAbdButtockSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ด้าน:</span>
              <label class="flex items-center"><input type="checkbox" name="venomAbdButtockSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="venomAbdButtockSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ขวา</span></label>
              <label class="flex items-center"><input type="checkbox" name="venomAbdButtockSides" value="center" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ตรงกลาง</span></label>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="venomAbdGroinGenitalia" onchange="toggleVenomGroup('venomAbdGroinGenitaliaSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5">ขาหนีบ/อวัยวะเพศ</span></label>
            <div id="venomAbdGroinGenitaliaSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ด้าน:</span>
              <label class="flex items-center"><input type="checkbox" name="venomAbdGroinGenitaliaSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="venomAbdGroinGenitaliaSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ขวา</span></label>
              <label class="flex items-center"><input type="checkbox" name="venomAbdGroinGenitaliaSides" value="center" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ตรงกลาง</span></label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2.5 ไหล่ แขน มือ นิ้วมือ -->
    <div class="border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
      <label class="flex items-center cursor-pointer">
        <input type="checkbox" id="venomParentUpperExtremity" onchange="toggleVenomGroup('venomUpperExtSubGroup', this.checked)" class="rounded text-medical-600 h-4 w-4">
        <span class="ml-2 text-xs sm:text-sm font-bold text-slate-900">2.5 บาดแผลที่ไหล่ แขน ข้อศอก ข้อมือ หรือมือ/นิ้วมือ</span>
      </label>
      <div id="venomUpperExtSubGroup" class="hidden space-y-3 pl-6 pt-2 border-t border-slate-100 text-xs sm:text-sm">
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="venomArmShoulder" onchange="toggleVenomGroup('venomArmShoulderSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5">หัวไหล่/ต้นแขน</span></label>
            <div id="venomArmShoulderSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ข้าง:</span>
              <label class="flex items-center"><input type="checkbox" name="venomArmShoulderSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="venomArmShoulderSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ขวา</span></label>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="venomArmElbowForearm" onchange="toggleVenomGroup('venomArmElbowForearmSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5">ข้อศอก/แขนท่อนล่าง</span></label>
            <div id="venomArmElbowForearmSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ข้าง:</span>
              <label class="flex items-center"><input type="checkbox" name="venomArmElbowForearmSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="venomArmElbowForearmSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ขวา</span></label>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="venomArmWristHand" onchange="toggleVenomGroup('venomArmWristHandSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5">ข้อมือ/ฝ่ามือ/หลังมือ</span></label>
            <div id="venomArmWristHandSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ข้าง:</span>
              <label class="flex items-center"><input type="checkbox" name="venomArmWristHandSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="venomArmWristHandSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ขวา</span></label>
            </div>
          </div>
          <!-- นิ้วมือแยกแถวซ้ายขวา -->
          <div class="space-y-1">
            <label class="flex items-center"><input type="checkbox" id="venomArmFingers" onchange="toggleVenomGroup('venomArmFingersSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5">นิ้วมือ</span></label>
            <div id="venomArmFingersSidesContainer" class="hidden ml-5 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
              <div class="flex flex-wrap items-center gap-2">
                <span class="font-medium text-slate-600 w-10">ซ้าย:</span>
                <label class="flex items-center"><input type="checkbox" name="venomArmFingersLeftDigits" value="thumb" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">โป้ง</span></label>
                <label class="flex items-center"><input type="checkbox" name="venomArmFingersLeftDigits" value="index" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ชี้</span></label>
                <label class="flex items-center"><input type="checkbox" name="venomArmFingersLeftDigits" value="middle" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">กลาง</span></label>
                <label class="flex items-center"><input type="checkbox" name="venomArmFingersLeftDigits" value="ring" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">นาง</span></label>
                <label class="flex items-center"><input type="checkbox" name="venomArmFingersLeftDigits" value="little" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ก้อย</span></label>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <span class="font-medium text-slate-600 w-10">ขวา:</span>
                <label class="flex items-center"><input type="checkbox" name="venomArmFingersRightDigits" value="thumb" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">โป้ง</span></label>
                <label class="flex items-center"><input type="checkbox" name="venomArmFingersRightDigits" value="index" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ชี้</span></label>
                <label class="flex items-center"><input type="checkbox" name="venomArmFingersRightDigits" value="middle" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">กลาง</span></label>
                <label class="flex items-center"><input type="checkbox" name="venomArmFingersRightDigits" value="ring" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">นาง</span></label>
                <label class="flex items-center"><input type="checkbox" name="venomArmFingersRightDigits" value="little" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ก้อย</span></label>
              </div>
            </div>
          </div>
        </div>
        <div class="pt-2 border-t border-slate-100 space-y-1.5">
          <span class="font-semibold text-slate-700 block">อาการสำคัญที่พบร่วมด้วย:</span>
          <label class="flex items-center"><input type="checkbox" name="venomUpperExtSigns" value="arm_tense_compartment_ischemia" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 font-medium text-rose-800">แขน มือ หรือนิ้วมือบวมตึงมาก ขยับนิ้วแล้วปวดรุนแรง หรือมีอาการชา/ปลายนิ้วซีดเย็น</span></label>
        </div>
      </div>
    </div>

    <!-- 2.6 ขา ข้อเท้า เท้า นิ้วเท้า -->
    <div class="border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
      <label class="flex items-center cursor-pointer">
        <input type="checkbox" id="venomParentLowerExtremity" onchange="toggleVenomGroup('venomLowerExtSubGroup', this.checked)" class="rounded text-medical-600 h-4 w-4">
        <span class="ml-2 text-xs sm:text-sm font-bold text-slate-900">2.6 บาดแผลที่ต้นขา เข่า หน้าแข้ง น่อง ข้อเท้า หรือเท้า/นิ้วเท้า</span>
      </label>
      <div id="venomLowerExtSubGroup" class="hidden space-y-3 pl-6 pt-2 border-t border-slate-100 text-xs sm:text-sm">
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="venomLegThigh" onchange="toggleVenomGroup('venomLegThighSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5">ต้นขา</span></label>
            <div id="venomLegThighSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ข้าง:</span>
              <label class="flex items-center"><input type="checkbox" name="venomLegThighSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="venomLegThighSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ขวา</span></label>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="venomLegKneeShinCalf" onchange="toggleVenomGroup('venomLegKneeShinCalfSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5">เข่า/หน้าแข้ง/น่อง</span></label>
            <div id="venomLegKneeShinCalfSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ข้าง:</span>
              <label class="flex items-center"><input type="checkbox" name="venomLegKneeShinCalfSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="venomLegKneeShinCalfSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ขวา</span></label>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex items-center"><input type="checkbox" id="venomLegAnkleFoot" onchange="toggleVenomGroup('venomLegAnkleFootSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5">ข้อเท้า/ฝ่าเท้า/หลังเท้า/ส้นเท้า</span></label>
            <div id="venomLegAnkleFootSidesContainer" class="hidden flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
              <span class="text-slate-500 font-medium">ข้าง:</span>
              <label class="flex items-center"><input type="checkbox" name="venomLegAnkleFootSides" value="left" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ซ้าย</span></label>
              <label class="flex items-center"><input type="checkbox" name="venomLegAnkleFootSides" value="right" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ขวา</span></label>
            </div>
          </div>
          <!-- นิ้วเท้าแยกแถวซ้ายขวา -->
          <div class="space-y-1">
            <label class="flex items-center"><input type="checkbox" id="venomLegToes" onchange="toggleVenomGroup('venomLegToesSidesContainer', this.checked)" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-1.5">นิ้วเท้า</span></label>
            <div id="venomLegToesSidesContainer" class="hidden ml-5 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
              <div class="flex flex-wrap items-center gap-2">
                <span class="font-medium text-slate-600 w-10">ซ้าย:</span>
                <label class="flex items-center"><input type="checkbox" name="venomLegToesLeftDigits" value="thumb" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">โป้ง</span></label>
                <label class="flex items-center"><input type="checkbox" name="venomLegToesLeftDigits" value="index" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ชี้</span></label>
                <label class="flex items-center"><input type="checkbox" name="venomLegToesLeftDigits" value="middle" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">กลาง</span></label>
                <label class="flex items-center"><input type="checkbox" name="venomLegToesLeftDigits" value="ring" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">นาง</span></label>
                <label class="flex items-center"><input type="checkbox" name="venomLegToesLeftDigits" value="little" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ก้อย</span></label>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <span class="font-medium text-slate-600 w-10">ขวา:</span>
                <label class="flex items-center"><input type="checkbox" name="venomLegToesRightDigits" value="thumb" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">โป้ง</span></label>
                <label class="flex items-center"><input type="checkbox" name="venomLegToesRightDigits" value="index" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ชี้</span></label>
                <label class="flex items-center"><input type="checkbox" name="venomLegToesRightDigits" value="middle" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">กลาง</span></label>
                <label class="flex items-center"><input type="checkbox" name="venomLegToesRightDigits" value="ring" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">นาง</span></label>
                <label class="flex items-center"><input type="checkbox" name="venomLegToesRightDigits" value="little" class="rounded text-medical-600 h-3 w-3"><span class="ml-1">ก้อย</span></label>
              </div>
            </div>
          </div>
        </div>
        <div class="pt-2 border-t border-slate-100 space-y-1.5">
          <span class="font-semibold text-slate-700 block">อาการสำคัญที่พบร่วมด้วย:</span>
          <label class="flex items-center"><input type="checkbox" name="venomLowerExtSigns" value="leg_tense_compartment_ischemia" class="rounded text-medical-600 h-3.5 w-3.5"><span class="ml-2 font-medium text-rose-800">ขา ข้อเท้า หรือเท้าบวมตึงมาก เดินลงน้ำหนักไม่ได้ หรือมีอาการชา/ปลายเท้าซีดเย็น</span></label>
        </div>
      </div>
    </div>

    <!-- 2.7 ตำแหน่งอื่นๆ -->
    <div class="border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
      <label class="flex items-center cursor-pointer">
        <input type="checkbox" id="venomParentOther" onchange="toggleVenomGroup('venomOtherSubGroup', this.checked)" class="rounded text-medical-600 h-4 w-4">
        <span class="ml-2 text-xs sm:text-sm font-bold text-slate-900">2.7 บาดแผลที่ตำแหน่งอื่นๆ (พิมพ์ระบุ)</span>
      </label>
      <div id="venomOtherSubGroup" class="hidden pl-6 pt-2 border-t border-slate-100">
        <input type="text" id="venomOtherLocationDetail" placeholder="ระบุตำแหน่งของร่างกายที่ถูกกัดหรือต่อย เช่น ซอกคอ, ใบหู..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-medical-500">
      </div>
    </div>

    <!-- 2.8 ลักษณะบาดแผลเฉพาะที่ -->
    <div class="pt-3 border-t border-slate-100">
      <label class="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">2.8 ลักษณะบาดแผลและอาการเฉพาะที่ในขณะนี้ (เลือกได้หลายข้อหากมีอาการ):</label>
      <div class="space-y-2 text-xs sm:text-sm">
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="venomLocalSigns" value="fang_marks_active_bleeding" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 font-bold text-rose-800">มีรอยเขี้ยวชัดเจน (1-2 รอย) หรือมีเลือดไหลซึมออกจากรอยแผลไม่หยุด</span>
        </label>
        <div>
          <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
            <input type="checkbox" name="venomLocalSigns" value="retained_stinger_spine" onchange="handleVenomLocalSignsChange()" class="rounded text-medical-600 h-4 w-4">
            <span class="ml-2 font-medium text-slate-800">มีเหล็กในแมลง หรือเงี่ยงปลา/หนามสัตว์มีพิษ หักฝังค้างอยู่ในแผล</span>
          </label>
          <div id="venomStingerStatusContainer" class="hidden ml-6 mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
            <span class="font-bold text-slate-700 block">สถานะของเหล็กในหรือเงี่ยงสัตว์มีพิษในขณะนี้:</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label class="flex items-center cursor-pointer"><input type="radio" name="venomStingerStatus" value="not_removed" class="text-rose-600 h-3.5 w-3.5"><span class="ml-1.5 font-medium text-rose-800">ยังไม่ได้เอาออก (ยังคงฝังค้างอยู่ในแผล)</span></label>
              <label class="flex items-center cursor-pointer"><input type="radio" name="venomStingerStatus" value="already_removed" class="text-medical-600 h-3.5 w-3.5"><span class="ml-1.5 text-slate-700">เอาออกเรียบร้อยแล้ว</span></label>
            </div>
          </div>
        </div>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="venomLocalSigns" value="severe_rapid_spreading_swelling" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 font-medium text-slate-800">ปวดบวมรุนแรงและบวมลามเร็ว</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="venomLocalSigns" value="necrosis_hemorrhagic_blebs" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 font-bold text-rose-800">ผิวหนังรอบแผลเปลี่ยนเป็นสีม่วงคล้ำ ดำ หรือมีตุ่มน้ำพองใส/ตุ่มน้ำปนเลือด</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="venomLocalSigns" value="whip_like_burn_tracks" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 font-medium text-slate-800">มีรอยไหม้เป็นเส้นนูนแดงคล้ายรอยแส้ฟาด (พบบ่อยจากแมงกะพรุน)</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="venomLocalSigns" value="secondary_infection_pus" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 font-medium text-slate-800">แผลบวมแดงร้อน มีหนองซึม หรือมีรอยแดงลามตามเส้นเลือด</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="venomLocalSigns" value="mild_local_pain_only" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-600">มีอาการปวด บวม แดง หรือคันเฉพาะจุดเพียงเล็กน้อย</span>
        </label>
      </div>
    </div>
  </div>

  <!-- CARD 3: อาการแพ้รุนแรง อาการจำเพาะตามสัตว์ที่กัด และระดับความปวด -->
  <div class="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-5">
    <div class="flex items-center space-x-2 border-b border-slate-100 pb-3">
      <div class="p-2 rounded-xl bg-medical-100 text-medical-700">
        <i data-lucide="activity" class="w-5 h-5"></i>
      </div>
      <div>
        <h3 class="text-sm sm:text-base font-bold text-slate-900">3. อาการแพ้รุนแรง อาการผิดปกติของร่างกาย และระดับความปวด</h3>
        <p class="text-xs text-slate-500">คัดกรองภาวะแพ้รุนแรง (Anaphylaxis) พิษงู และระดับความปวด</p>
      </div>
    </div>

    <!-- 3.1 อาการแพ้รุนแรง / ทั่วร่างกาย -->
    <div>
      <label class="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">3.1 อาการแพ้รุนแรงเฉียบพลัน หรืออาการผิดปกติทั่วร่างกาย (เลือกได้หลายข้อหากมีอาการ):</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="venomSystemicAllergySigns" value="urticaria_itching_erythema" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-800">มีผื่นลมพิษเห่อขึ้นตามตัว คันทั่วตัว หรือตัวแดงร้อน</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="venomSystemicAllergySigns" value="facial_angioedema" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 font-medium text-rose-800">หน้าบวม ตาบวม หรือริมฝีปากบวม</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="venomSystemicAllergySigns" value="laryngeal_edema_hoarseness" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 font-bold text-rose-800">แน่นในลำคอ กลืนลำบาก เสียงแหบ คอตีบตัน</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="venomSystemicAllergySigns" value="bronchospasm_dyspnea_wheezing" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 font-bold text-rose-800">หายใจหอบเหนื่อย มีเสียงหวีด หรือแน่นหน้าอก</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="venomSystemicAllergySigns" value="hypotensive_syncope_shock" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 font-bold text-rose-800">หน้ามืด เวียนศีรษะ วูบจะเป็นลม หรือเหงื่อแตกตัวเย็น</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="venomSystemicAllergySigns" value="gi_cramps_vomiting" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-800">คลื่นไส้อาเจียนรุนแรง หรือปวดบิดท้อง</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="venomSystemicAllergySigns" value="fever_chills" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-800">มีไข้ หนาวสั่น</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="checkbox" name="venomSystemicAllergySigns" value="no_systemic_allergy_signs" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-600">ไม่มีอาการแพ้รุนแรงหรืออาการผิดปกติทั่วร่างกาย</span>
        </label>
      </div>
    </div>

    <!-- 3.2 กิ่งเจาะลึกอาการพิษงู (เปิดเฉพาะเมื่องูถูกเลือก) -->
    <div id="venomSnakeSignsContainer" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 sm:p-4 space-y-2">
      <label class="block text-xs sm:text-sm font-bold text-slate-900">3.2 อาการผิดปกติจากพิษงู (ระบบประสาท ระบบเลือด และกล้ามเนื้อ):</label>
      <div class="space-y-1.5 text-xs sm:text-sm">
        <label class="selectable-card flex items-center p-2 bg-white rounded-lg border border-slate-200 cursor-pointer">
          <input type="checkbox" name="venomSnakeSigns" value="ptosis_diplopia_blurred_vision" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 font-bold text-rose-800">หนังตาตก ลืมตาไม่ค่อยขึ้น มองเห็นภาพซ้อน หรือตาพร่ามัว <span class="text-xs font-normal text-slate-500">(เตือนพิษงูเห่า/จงอาง/สามเหลี่ยม/ทับสมิงคลา)</span></span>
        </label>
        <label class="selectable-card flex items-center p-2 bg-white rounded-lg border border-slate-200 cursor-pointer">
          <input type="checkbox" name="venomSnakeSigns" value="dysarthria_bulbar_palsy" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 font-bold text-rose-800">พูดไม่ชัด ลิ้นแข็ง อ้าปากหรือกลืนน้ำลายลำบาก ชารอบปาก</span>
        </label>
        <label class="selectable-card flex items-center p-2 bg-white rounded-lg border border-slate-200 cursor-pointer">
          <input type="checkbox" name="venomSnakeSigns" value="motor_weakness_resp_depression" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 font-bold text-rose-800">แขนขาอ่อนแรง ยกแขนขาไม่ขึ้น หรือรู้สึกหายใจเข้าได้ไม่เต็มอิ่ม</span>
        </label>
        <label class="selectable-card flex items-center p-2 bg-white rounded-lg border border-slate-200 cursor-pointer">
          <input type="checkbox" name="venomSnakeSigns" value="systemic_bleeding_vicc" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 font-bold text-rose-800">มีเลือดออกผิดปกติ เช่น เลือดออกตามไรฟัน เลือดกำเดา จ้ำเลือด ปัสสาวะเป็นเลือด <span class="text-xs font-normal text-slate-500">(เตือนพิษงูกะปะ/เขียวหางไหม้/แมวเซา)</span></span>
        </label>
        <label class="selectable-card flex items-center p-2 bg-white rounded-lg border border-slate-200 cursor-pointer">
          <input type="checkbox" name="venomSnakeSigns" value="severe_myalgia_dark_coke_urine" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 font-medium text-slate-800">ปวดเมื่อยกล้ามเนื้อทั่วตัวมาก หรือปัสสาวะสีเข้มผิดปกติ (สีโค้ก/น้ำตาลคล้ำ)</span>
        </label>
        <label class="selectable-card flex items-center p-2 bg-white rounded-lg border border-slate-200 cursor-pointer">
          <input type="checkbox" name="venomSnakeSigns" value="no_snake_systemic_signs" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-600">ไม่มีอาการผิดปกติจากพิษงูดังกล่าว</span>
        </label>
      </div>
    </div>

    <!-- กิ่งเจาะลึกแมลงต่อย (เปิดเฉพาะเมื่อผึ้ง/ต่อ/แตน/มดถูกเลือก) -->
    <div id="venomHymenopteraSignsContainer" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 sm:p-4 space-y-2">
      <label class="block text-xs sm:text-sm font-bold text-slate-900">อาการเพิ่มเติมหลังถูกผึ้ง ต่อ แตน หรือมดกัดต่อย:</label>
      <div class="space-y-1.5 text-xs sm:text-sm">
        <label class="selectable-card flex items-center p-2 bg-white rounded-lg border border-slate-200 cursor-pointer">
          <input type="checkbox" name="venomHymenopteraSigns" value="massive_stings_myalgia_jaundice_dark_urine" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 font-medium text-slate-800">ปวดเมื่อยกล้ามเนื้อทั่วตัวมาก ตัวเหลือง หรือปัสสาวะสีน้ำตาลคล้ำ <span class="text-xs text-slate-500">(สงสัยพิษต่อยหลายจุด)</span></span>
        </label>
        <label class="selectable-card flex items-center p-2 bg-white rounded-lg border border-slate-200 cursor-pointer">
          <input type="checkbox" name="venomHymenopteraSigns" value="no_hymenoptera_signs" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-600">ไม่มีอาการปวดเมื่อยกล้ามเนื้อหรือปัสสาวะสีเข้ม</span>
        </label>
      </div>
    </div>

    <!-- กิ่งเจาะลึกสัตว์ขาปล้อง (ตะขาบ/แมงป่อง/แมงมุม) -->
    <div id="venomArthropodSignsContainer" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 sm:p-4 space-y-2">
      <label class="block text-xs sm:text-sm font-bold text-slate-900">อาการเพิ่มเติมหลังถูกตะขาบ แมงป่อง หรือแมงมุมกัดต่อย:</label>
      <div class="space-y-1.5 text-xs sm:text-sm">
        <label class="selectable-card flex items-center p-2 bg-white rounded-lg border border-slate-200 cursor-pointer">
          <input type="checkbox" name="venomArthropodSigns" value="radicular_pain_cramps_fasciculation" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-800">ปวดชาหรือปวดแปล๊บร้าวไปตามแขนขา หรือกล้ามเนื้อเกร็งกระตุก</span>
        </label>
        <label class="selectable-card flex items-center p-2 bg-white rounded-lg border border-slate-200 cursor-pointer">
          <input type="checkbox" name="venomArthropodSigns" value="autonomic_excess_diaphoresis_salivation" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-800">เหงื่อแตกมากผิดปกติ น้ำลายไหลมาก หรือกระสับกระส่าย</span>
        </label>
      </div>
    </div>

    <!-- กิ่งเจาะลึกสัตว์น้ำมีพิษ (ปลาดุก/ปลากระเบน/แมงกะพรุน) -->
    <div id="venomMarineSignsContainer" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 sm:p-4 space-y-2">
      <label class="block text-xs sm:text-sm font-bold text-slate-900">อาการเพิ่มเติมหลังถูกเงี่ยงปลาตำหรือสัตว์น้ำมีพิษ:</label>
      <div class="space-y-1.5 text-xs sm:text-sm">
        <label class="selectable-card flex items-center p-2 bg-white rounded-lg border border-slate-200 cursor-pointer">
          <input type="checkbox" name="venomMarineSigns" value="excruciating_marine_pain_radiating" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 font-medium text-slate-800">ปวดแสบปวดร้อนรุนแรงมาก หรือปวดร้าวขึ้นไปรักแร้/ขาหนีบ</span>
        </label>
        <label class="selectable-card flex items-center p-2 bg-white rounded-lg border border-slate-200 cursor-pointer">
          <input type="checkbox" name="venomMarineSigns" value="muscle_spasm_confusion" class="rounded text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-800">เป็นตะคริวเกร็งกล้ามเนื้อ หรือรู้สึกสับสนมึนงง</span>
        </label>
      </div>
    </div>

    <!-- 3.3 ระดับความปวด Pain Score -->
    <div class="pt-3 border-t border-slate-100">
      <div class="flex items-center justify-between mb-2">
        <label class="text-xs sm:text-sm font-semibold text-slate-800">3.3 ระดับความปวดบริเวณที่ถูกกัดหรือต่อยในขณะนี้ (Pain Score 0-10):</label>
        <button type="button" id="venomPainScoreClearBtn" onclick="clearVenomPainScore()" class="hidden text-xs text-medical-600 hover:text-medical-700 underline font-medium">ล้างค่า</button>
      </div>
      <div class="space-y-3">
        <input type="range" id="venomPainScore" min="0" max="10" value="0" step="1" oninput="handleVenomPainScoreChange(this.value)" onchange="handleVenomPainScoreChange(this.value)" class="w-full accent-medical-600 cursor-pointer h-2 bg-slate-200 rounded-lg">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs text-slate-500">
          <div id="venomPainScoreBadge" class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto transition-all">
            <span id="venomPainScoreEmoji">⚪</span>
            <span id="venomPainScoreText">ยังไม่ได้ระบุ (แตะแถบเพื่อระบุ)</span>
          </div>
          <span class="text-[11px] text-slate-400">0 = ไม่ปวดเลย, 10 = ปวดรุนแรงที่สุดในชีวิต</span>
        </div>
      </div>
    </div>
  </div>

  <!-- CARD 4: ประวัติการแพ้ในอดีต และประวัติวัคซีนบาดทะยัก -->
  <div class="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-5">
    <div class="flex items-center space-x-2 border-b border-slate-100 pb-3">
      <div class="p-2 rounded-xl bg-medical-100 text-medical-700">
        <i data-lucide="shield-plus" class="w-5 h-5"></i>
      </div>
      <div>
        <h3 class="text-sm sm:text-base font-bold text-slate-900">4. ประวัติการแพ้ในอดีต และประวัติวัคซีนป้องกันบาดทะยัก</h3>
        <p class="text-xs text-slate-500">ข้อมูลประวัติเพื่อความปลอดภัยในการรักษา</p>
      </div>
    </div>

    <!-- 4.1 ประวัติการแพ้ -->
    <div>
      <label class="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">4.1 เคยมีอาการแพ้จากการโดนแมลงหรือสัตว์มีพิษกัดต่อยมาก่อนหรือไม่:</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="radio" name="venomPriorAllergyHx" value="no_prior_allergy" onchange="handleVenomPriorAllergyChange(this.value)" class="text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-800">ไม่เคยมีประวัติแพ้มาก่อน</span>
        </label>
        <label class="selectable-card flex items-center p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="radio" name="venomPriorAllergyHx" value="has_prior_allergy" onchange="handleVenomPriorAllergyChange(this.value)" class="text-medical-600 h-4 w-4">
          <span class="ml-2 font-bold text-rose-800">เคยมีอาการแพ้มาก่อน</span>
        </label>
      </div>
      <div id="venomPriorAllergyDetailContainer" class="hidden mt-2">
        <input type="text" id="venomPriorAllergyDetail" placeholder="พิมพ์ระบุว่าเคยแพ้แมลงหรือสัตว์ชนิดใด และมีอาการแพ้อย่างไร..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-medical-500">
      </div>
    </div>

    <!-- 4.2 ประวัติวัคซีนบาดทะยัก -->
    <div class="pt-3 border-t border-slate-100">
      <label class="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">4.2 ประวัติการฉีดวัคซีนป้องกันโรคบาดทะยัก:</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="radio" name="venomTetanusHx" value="within_5_years" class="text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-800">เข็มล่าสุดไม่เกิน 5 ปีที่ผ่านมา</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="radio" name="venomTetanusHx" value="5_to_10_years" class="text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-800">เข็มล่าสุดนานเกิน 5 ปี แต่ไม่เกิน 10 ปี</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="radio" name="venomTetanusHx" value="over_10_years" class="text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-800">เข็มล่าสุดนานเกิน 10 ปีแล้ว</span>
        </label>
        <label class="selectable-card flex items-center p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
          <input type="radio" name="venomTetanusHx" value="unknown_or_never" class="text-medical-600 h-4 w-4">
          <span class="ml-2 text-slate-600">ไม่เคยฉีดมาก่อน หรือจำไม่ได้</span>
        </label>
      </div>
    </div>
  </div>
</div>
`;

// --- MODULE OBJECT DEFINITION ---
const venomousBiteModule = {
  id: 'venomous_bite',
  recordCc: 'venomous_bite',
  schemaCode: 'venomous_bite_sting',
  titleTh: 'แมลง / งู / สัตว์มีพิษกัดต่อย',
  titleEn: 'Insect sting / Snake & Venomous creature bites',
  icon: 'bug',
  doctorCcBadgeHtml: '<i data-lucide="bug" class="w-3.5 h-3.5 mr-1 text-emerald-600"></i> CC: แมลง / งู / สัตว์มีพิษกัดต่อย (Venomous Bites & Stings)',
  algorithm: 'venomous-bite-protocol',
  sectionDomId: 'cc-venomous-bite-section',
  formHtml: VENOMOUS_BITE_FORM_HTML,

  // --- Mounting & Event Listeners Hook ---
  init() {
    clearVenomPainScore();
  },

  // --- Form Data Extraction Hook ---
  collectIntake(ctx = {}) {
    const _rawDur = parseFloat(document.getElementById('venomDurationVal')?.value);
    const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
    const durationUnit = document.getElementById('venomDurationUnit')?.value || 'hours';

    const getCheckedValues = (name) => Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(cb => cb.value);
    const getRadioValue = (name) => {
      const checked = document.querySelector(`input[name="${name}"]:checked`);
      return checked ? checked.value : null;
    };
    const getChecked = (id) => {
      const el = document.getElementById(id);
      return el ? el.checked : false;
    };
    const getText = (id) => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : '';
    };

    const rec = {
      id: ctx.recordId || `case-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      queue_number: ctx.queueNumber || 'E1-000',
      hn: ctx.randomHn || '6700000',
      name: ctx.patientName || 'ผู้ป่วย (ไม่ระบุชื่อ)',
      age: ctx.patientAge !== undefined ? ctx.patientAge : 'ไม่ระบุ',
      gender: ctx.gender || 'ไม่ระบุ',
      chief_complaint: 'venomous_bite',
      chief_complaint_title: 'แมลง / งู / สัตว์มีพิษกัดต่อย',
      timestamp: new Date().toISOString(),
      status: ctx.recordStatus || 'waiting',
      durationVal,
      durationUnit,
      hospRecordStatus: ctx.hospRecordStatus || 'unspecified',
      underlying: ctx.underlying || [],
      drugAllergy: ctx.drugAllergy || 'ไม่ได้ระบุ',
      currentMeds: ctx.currentMeds || 'ไม่ได้ระบุ',
      otherSymptomsFree: ctx.otherSymptomsFree || '',
      doctor_notes: ctx.preservedDoctorNotes || { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.8, sbp: 120, dbp: 80, bp: '120/80', pr: 76, rr: 16, spo2: 99 },
      esi_level: 3,

      venomCreatureTypes: getCheckedValues('venomCreatureTypes'),
      venomSnakeType: getRadioValue('venomSnakeType'),
      venomSnakeDetailFree: getText('venomSnakeDetailFree'),
      venomOtherCreatureDetail: getText('venomOtherCreatureDetail'),
      venomStingsCount: getRadioValue('venomStingsCount'),
      venomFirstAid: getCheckedValues('venomFirstAid'),

      // Anatomy Checkboxes
      venomParentHeadFace: getChecked('venomParentHeadFace'),
      venomHeadScalp: getChecked('venomHeadScalp'),
      venomHeadScalpSides: getCheckedValues('venomHeadScalpSides'),
      venomHeadFace: getChecked('venomHeadFace'),
      venomHeadFaceSides: getCheckedValues('venomHeadFaceSides'),
      venomHeadEye: getChecked('venomHeadEye'),
      venomHeadEyeSides: getCheckedValues('venomHeadEyeSides'),
      venomHeadEar: getChecked('venomHeadEar'),
      venomHeadEarSides: getCheckedValues('venomHeadEarSides'),
      venomHeadNoseMouth: getChecked('venomHeadNoseMouth'),
      venomHeadNoseMouthSides: getCheckedValues('venomHeadNoseMouthSides'),
      venomHeadSigns: getCheckedValues('venomHeadSigns'),

      venomParentNeck: getChecked('venomParentNeck'),
      venomNeckFront: getChecked('venomNeckFront'),
      venomNeckFrontSides: getCheckedValues('venomNeckFrontSides'),
      venomNeckSide: getChecked('venomNeckSide'),
      venomNeckSideSides: getCheckedValues('venomNeckSideSides'),
      venomNeckBack: getChecked('venomNeckBack'),
      venomNeckBackSides: getCheckedValues('venomNeckBackSides'),
      venomNeckSigns: getCheckedValues('venomNeckSigns'),

      venomParentChest: getChecked('venomParentChest'),
      venomChestFront: getChecked('venomChestFront'),
      venomChestFrontSides: getCheckedValues('venomChestFrontSides'),
      venomChestBack: getChecked('venomChestBack'),
      venomChestBackSides: getCheckedValues('venomChestBackSides'),
      venomChestSigns: getCheckedValues('venomChestSigns'),

      venomParentAbdomen: getChecked('venomParentAbdomen'),
      venomAbdFront: getChecked('venomAbdFront'),
      venomAbdFrontSides: getCheckedValues('venomAbdFrontSides'),
      venomAbdFlank: getChecked('venomAbdFlank'),
      venomAbdFlankSides: getCheckedValues('venomAbdFlankSides'),
      venomAbdLowBack: getChecked('venomAbdLowBack'),
      venomAbdLowBackSides: getCheckedValues('venomAbdLowBackSides'),
      venomAbdButtock: getChecked('venomAbdButtock'),
      venomAbdButtockSides: getCheckedValues('venomAbdButtockSides'),
      venomAbdGroinGenitalia: getChecked('venomAbdGroinGenitalia'),
      venomAbdGroinGenitaliaSides: getCheckedValues('venomAbdGroinGenitaliaSides'),

      venomParentUpperExtremity: getChecked('venomParentUpperExtremity'),
      venomArmShoulder: getChecked('venomArmShoulder'),
      venomArmShoulderSides: getCheckedValues('venomArmShoulderSides'),
      venomArmElbowForearm: getChecked('venomArmElbowForearm'),
      venomArmElbowForearmSides: getCheckedValues('venomArmElbowForearmSides'),
      venomArmWristHand: getChecked('venomArmWristHand'),
      venomArmWristHandSides: getCheckedValues('venomArmWristHandSides'),
      venomArmFingers: getChecked('venomArmFingers'),
      venomArmFingersLeftDigits: getCheckedValues('venomArmFingersLeftDigits'),
      venomArmFingersRightDigits: getCheckedValues('venomArmFingersRightDigits'),
      venomUpperExtSigns: getCheckedValues('venomUpperExtSigns'),

      venomParentLowerExtremity: getChecked('venomParentLowerExtremity'),
      venomLegThigh: getChecked('venomLegThigh'),
      venomLegThighSides: getCheckedValues('venomLegThighSides'),
      venomLegKneeShinCalf: getChecked('venomLegKneeShinCalf'),
      venomLegKneeShinCalfSides: getCheckedValues('venomLegKneeShinCalfSides'),
      venomLegAnkleFoot: getChecked('venomLegAnkleFoot'),
      venomLegAnkleFootSides: getCheckedValues('venomLegAnkleFootSides'),
      venomLegToes: getChecked('venomLegToes'),
      venomLegToesLeftDigits: getCheckedValues('venomLegToesLeftDigits'),
      venomLegToesRightDigits: getCheckedValues('venomLegToesRightDigits'),
      venomLowerExtSigns: getCheckedValues('venomLowerExtSigns'),

      venomParentOther: getChecked('venomParentOther'),
      venomOtherLocationDetail: getText('venomOtherLocationDetail'),

      venomLocalSigns: getCheckedValues('venomLocalSigns'),
      venomStingerStatus: getRadioValue('venomStingerStatus'),

      venomSystemicAllergySigns: getCheckedValues('venomSystemicAllergySigns'),
      venomSnakeSigns: getCheckedValues('venomSnakeSigns'),
      venomHymenopteraSigns: getCheckedValues('venomHymenopteraSigns'),
      venomArthropodSigns: getCheckedValues('venomArthropodSigns'),
      venomMarineSigns: getCheckedValues('venomMarineSigns'),

      painScore: venomPainScoreTouched ? parseInt(document.getElementById('venomPainScore')?.value || '0', 10) : null,
      venomPriorAllergyHx: getRadioValue('venomPriorAllergyHx'),
      venomPriorAllergyDetail: getText('venomPriorAllergyDetail'),
      venomTetanusHx: getRadioValue('venomTetanusHx')
    };

    updateVenomOutputs(rec);
    return rec;
  },

  collectFormData(ctx = {}) {
    return this.collectIntake(ctx);
  },

  // --- Form Hydration Hook ---
  hydrateForm(patient) {
    this.clearForm();
    if (!patient) return;

    if (patient.durationVal) {
      const valEl = document.getElementById('venomDurationVal');
      if (valEl) valEl.value = patient.durationVal;
    }
    if (patient.durationUnit) {
      const unitEl = document.getElementById('venomDurationUnit');
      if (unitEl) unitEl.value = patient.durationUnit;
    }

    const setCheckedValues = (name, arr) => {
      if (!Array.isArray(arr)) return;
      document.querySelectorAll(`input[name="${name}"]`).forEach(cb => {
        cb.checked = arr.includes(cb.value);
      });
    };
    const setRadioValue = (name, val) => {
      if (!val) return;
      const rb = document.querySelector(`input[name="${name}"][value="${val}"]`);
      if (rb) rb.checked = true;
    };
    const setChecked = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.checked = !!val;
    };
    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el && val !== undefined && val !== null) el.value = val;
    };

    setCheckedValues('venomCreatureTypes', patient.venomCreatureTypes);
    setRadioValue('venomSnakeType', patient.venomSnakeType);
    setText('venomSnakeDetailFree', patient.venomSnakeDetailFree);
    setText('venomOtherCreatureDetail', patient.venomOtherCreatureDetail);
    setRadioValue('venomStingsCount', patient.venomStingsCount);
    setCheckedValues('venomFirstAid', patient.venomFirstAid);

    // Anatomy
    setChecked('venomParentHeadFace', patient.venomParentHeadFace);
    setChecked('venomHeadScalp', patient.venomHeadScalp);
    setCheckedValues('venomHeadScalpSides', patient.venomHeadScalpSides);
    setChecked('venomHeadFace', patient.venomHeadFace);
    setCheckedValues('venomHeadFaceSides', patient.venomHeadFaceSides);
    setChecked('venomHeadEye', patient.venomHeadEye);
    setCheckedValues('venomHeadEyeSides', patient.venomHeadEyeSides);
    setChecked('venomHeadEar', patient.venomHeadEar);
    setCheckedValues('venomHeadEarSides', patient.venomHeadEarSides);
    setChecked('venomHeadNoseMouth', patient.venomHeadNoseMouth);
    setCheckedValues('venomHeadNoseMouthSides', patient.venomHeadNoseMouthSides);
    setCheckedValues('venomHeadSigns', patient.venomHeadSigns);

    setChecked('venomParentNeck', patient.venomParentNeck);
    setChecked('venomNeckFront', patient.venomNeckFront);
    setCheckedValues('venomNeckFrontSides', patient.venomNeckFrontSides);
    setChecked('venomNeckSide', patient.venomNeckSide);
    setCheckedValues('venomNeckSideSides', patient.venomNeckSideSides);
    setChecked('venomNeckBack', patient.venomNeckBack);
    setCheckedValues('venomNeckBackSides', patient.venomNeckBackSides);
    setCheckedValues('venomNeckSigns', patient.venomNeckSigns);

    setChecked('venomParentChest', patient.venomParentChest);
    setChecked('venomChestFront', patient.venomChestFront);
    setCheckedValues('venomChestFrontSides', patient.venomChestFrontSides);
    setChecked('venomChestBack', patient.venomChestBack);
    setCheckedValues('venomChestBackSides', patient.venomChestBackSides);
    setCheckedValues('venomChestSigns', patient.venomChestSigns);

    setChecked('venomParentAbdomen', patient.venomParentAbdomen);
    setChecked('venomAbdFront', patient.venomAbdFront);
    setCheckedValues('venomAbdFrontSides', patient.venomAbdFrontSides);
    setChecked('venomAbdFlank', patient.venomAbdFlank);
    setCheckedValues('venomAbdFlankSides', patient.venomAbdFlankSides);
    setChecked('venomAbdLowBack', patient.venomAbdLowBack);
    setCheckedValues('venomAbdLowBackSides', patient.venomAbdLowBackSides);
    setChecked('venomAbdButtock', patient.venomAbdButtock);
    setCheckedValues('venomAbdButtockSides', patient.venomAbdButtockSides);
    setChecked('venomAbdGroinGenitalia', patient.venomAbdGroinGenitalia);
    setCheckedValues('venomAbdGroinGenitaliaSides', patient.venomAbdGroinGenitaliaSides);

    setChecked('venomParentUpperExtremity', patient.venomParentUpperExtremity);
    setChecked('venomArmShoulder', patient.venomArmShoulder);
    setCheckedValues('venomArmShoulderSides', patient.venomArmShoulderSides);
    setChecked('venomArmElbowForearm', patient.venomArmElbowForearm);
    setCheckedValues('venomArmElbowForearmSides', patient.venomArmElbowForearmSides);
    setChecked('venomArmWristHand', patient.venomArmWristHand);
    setCheckedValues('venomArmWristHandSides', patient.venomArmWristHandSides);
    setChecked('venomArmFingers', patient.venomArmFingers);
    setCheckedValues('venomArmFingersLeftDigits', patient.venomArmFingersLeftDigits);
    setCheckedValues('venomArmFingersRightDigits', patient.venomArmFingersRightDigits);
    setCheckedValues('venomUpperExtSigns', patient.venomUpperExtSigns);

    setChecked('venomParentLowerExtremity', patient.venomParentLowerExtremity);
    setChecked('venomLegThigh', patient.venomLegThigh);
    setCheckedValues('venomLegThighSides', patient.venomLegThighSides);
    setChecked('venomLegKneeShinCalf', patient.venomLegKneeShinCalf);
    setCheckedValues('venomLegKneeShinCalfSides', patient.venomLegKneeShinCalfSides);
    setChecked('venomLegAnkleFoot', patient.venomLegAnkleFoot);
    setCheckedValues('venomLegAnkleFootSides', patient.venomLegAnkleFootSides);
    setChecked('venomLegToes', patient.venomLegToes);
    setCheckedValues('venomLegToesLeftDigits', patient.venomLegToesLeftDigits);
    setCheckedValues('venomLegToesRightDigits', patient.venomLegToesRightDigits);
    setCheckedValues('venomLowerExtSigns', patient.venomLowerExtSigns);

    setChecked('venomParentOther', patient.venomParentOther);
    setText('venomOtherLocationDetail', patient.venomOtherLocationDetail);

    setCheckedValues('venomLocalSigns', patient.venomLocalSigns);
    setRadioValue('venomStingerStatus', patient.venomStingerStatus);

    setCheckedValues('venomSystemicAllergySigns', patient.venomSystemicAllergySigns);
    setCheckedValues('venomSnakeSigns', patient.venomSnakeSigns);
    setCheckedValues('venomHymenopteraSigns', patient.venomHymenopteraSigns);
    setCheckedValues('venomArthropodSigns', patient.venomArthropodSigns);
    setCheckedValues('venomMarineSigns', patient.venomMarineSigns);

    setRadioValue('venomPriorAllergyHx', patient.venomPriorAllergyHx);
    setText('venomPriorAllergyDetail', patient.venomPriorAllergyDetail);
    setRadioValue('venomTetanusHx', patient.venomTetanusHx);

    // Refresh UI display states
    handleVenomCreatureChange();
    handleVenomLocalSignsChange();
    handleVenomPriorAllergyChange(patient.venomPriorAllergyHx);

    toggleVenomGroup('venomHeadFaceSubGroup', patient.venomParentHeadFace);
    toggleVenomGroup('venomHeadScalpSidesContainer', patient.venomHeadScalp);
    toggleVenomGroup('venomHeadFaceSidesContainer', patient.venomHeadFace);
    toggleVenomGroup('venomHeadEyeSidesContainer', patient.venomHeadEye);
    toggleVenomGroup('venomHeadEarSidesContainer', patient.venomHeadEar);
    toggleVenomGroup('venomHeadNoseMouthSidesContainer', patient.venomHeadNoseMouth);

    toggleVenomGroup('venomNeckSubGroup', patient.venomParentNeck);
    toggleVenomGroup('venomNeckFrontSidesContainer', patient.venomNeckFront);
    toggleVenomGroup('venomNeckSideSidesContainer', patient.venomNeckSide);
    toggleVenomGroup('venomNeckBackSidesContainer', patient.venomNeckBack);

    toggleVenomGroup('venomChestSubGroup', patient.venomParentChest);
    toggleVenomGroup('venomChestFrontSidesContainer', patient.venomChestFront);
    toggleVenomGroup('venomChestBackSidesContainer', patient.venomChestBack);

    toggleVenomGroup('venomAbdomenSubGroup', patient.venomParentAbdomen);
    toggleVenomGroup('venomAbdFrontSidesContainer', patient.venomAbdFront);
    toggleVenomGroup('venomAbdFlankSidesContainer', patient.venomAbdFlank);
    toggleVenomGroup('venomAbdLowBackSidesContainer', patient.venomAbdLowBack);
    toggleVenomGroup('venomAbdButtockSidesContainer', patient.venomAbdButtock);
    toggleVenomGroup('venomAbdGroinGenitaliaSidesContainer', patient.venomAbdGroinGenitalia);

    toggleVenomGroup('venomUpperExtSubGroup', patient.venomParentUpperExtremity);
    toggleVenomGroup('venomArmShoulderSidesContainer', patient.venomArmShoulder);
    toggleVenomGroup('venomArmElbowForearmSidesContainer', patient.venomArmElbowForearm);
    toggleVenomGroup('venomArmWristHandSidesContainer', patient.venomArmWristHand);
    toggleVenomGroup('venomArmFingersSidesContainer', patient.venomArmFingers);

    toggleVenomGroup('venomLowerExtSubGroup', patient.venomParentLowerExtremity);
    toggleVenomGroup('venomLegThighSidesContainer', patient.venomLegThigh);
    toggleVenomGroup('venomLegKneeShinCalfSidesContainer', patient.venomLegKneeShinCalf);
    toggleVenomGroup('venomLegAnkleFootSidesContainer', patient.venomLegAnkleFoot);
    toggleVenomGroup('venomLegToesSidesContainer', patient.venomLegToes);

    toggleVenomGroup('venomOtherSubGroup', patient.venomParentOther);

    if (patient.painScore !== null && patient.painScore !== undefined) {
      handleVenomPainScoreChange(patient.painScore);
    } else {
      clearVenomPainScore();
    }
  },

  populateForm(patient) {
    this.hydrateForm(patient);
  },

  // --- Form Reset Hook ---
  clearForm() {
    const sec = document.getElementById(this.sectionDomId);
    if (!sec) return;
    sec.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    sec.querySelectorAll('input[type="radio"]').forEach(rb => { rb.checked = false; });
    sec.querySelectorAll('input[type="text"]').forEach(ti => { ti.value = ''; });
    sec.querySelectorAll('input[type="number"]').forEach(ni => { ni.value = ''; });

    ['venomDurationVal', 'venomSnakeDetailFree', 'venomOtherCreatureDetail', 'venomOtherLocationDetail', 'venomPriorAllergyDetail'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = '';
    });
    const durUnit = document.getElementById('venomDurationUnit');
    if (durUnit) durUnit.value = 'hours';

    const hiddenContainers = [
      'venomSnakeDetailsContainer', 'venomOtherCreatureDetailsContainer',
      'venomSnakeSignsContainer', 'venomHymenopteraSignsContainer', 'venomArthropodSignsContainer', 'venomMarineSignsContainer',
      'venomStingerStatusContainer', 'venomPriorAllergyDetailContainer',
      'venomHeadFaceSubGroup', 'venomHeadScalpSidesContainer', 'venomHeadFaceSidesContainer', 'venomHeadEyeSidesContainer', 'venomHeadEarSidesContainer', 'venomHeadNoseMouthSidesContainer',
      'venomNeckSubGroup', 'venomNeckFrontSidesContainer', 'venomNeckSideSidesContainer', 'venomNeckBackSidesContainer',
      'venomChestSubGroup', 'venomChestFrontSidesContainer', 'venomChestBackSidesContainer',
      'venomAbdomenSubGroup', 'venomAbdFrontSidesContainer', 'venomAbdFlankSidesContainer', 'venomAbdLowBackSidesContainer', 'venomAbdButtockSidesContainer', 'venomAbdGroinGenitaliaSidesContainer',
      'venomUpperExtSubGroup', 'venomArmShoulderSidesContainer', 'venomArmElbowForearmSidesContainer', 'venomArmWristHandSidesContainer', 'venomArmFingersSidesContainer',
      'venomLowerExtSubGroup', 'venomLegThighSidesContainer', 'venomLegKneeShinCalfSidesContainer', 'venomLegAnkleFootSidesContainer', 'venomLegToesSidesContainer',
      'venomOtherSubGroup'
    ];
    hiddenContainers.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });

    clearVenomPainScore();
  },

  // --- Evaluation & CDS Interface ---
  isRedFlag(patient) {
    const rfs = evaluateVenomRedFlags(patient);
    return rfs.length > 0;
  },

  evaluateRedFlags(patient) {
    return evaluateVenomRedFlags(patient);
  },

  updateOutputs(patient) {
    return updateVenomOutputs(patient);
  },

  renderRapidHpi(patient) {
    return renderVenomRapidHpi(patient);
  },

  renderNarrativeHpi(patient) {
    return renderVenomNarrativeHpi(patient);
  },

  generateCds(patient) {
    return generateVenomCds(patient);
  },

  // --- Standardized Seed Cases (บริบทประเทศไทย) ---
  seedPatients: [
    // Case 1: Hornet sting anaphylaxis & upper airway angioedema (ESI 1)
    {
      id: 'case-venom-01', queue_number: 'E1-105', hn: '8901701',
      name: 'นายสมชาย โดนต่อหัวเสือต่อยที่คอและแขนมีลมพิษทั้งตัวแน่นคอหอบเหนื่อยหน้ามืด', age: 42, gender: 'ชาย',
      chief_complaint: 'venomous_bite', chief_complaint_title: 'แมลง / งู / สัตว์มีพิษกัดต่อย',
      timestamp: '2026-11-09T08:15:00.000Z', status: 'waiting',
      durationVal: 20, durationUnit: 'minutes', hospRecordStatus: 'self', underlying: [], drugAllergy: 'ปฏิเสธ', currentMeds: 'ไม่มี',
      otherSymptomsFree: 'ตัดแต่งต้นไม้ในสวนถูกต่อหัวเสือต่อยที่คอด้านขวาและต้นแขนขวา 3 จุด 10 นาทีต่อมามีผื่นลมพิษเห่อทั้งตัว ปากบวม แน่นในคอ หายใจหวีด หน้ามืดจะเป็นลม',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.8, sbp: 82, dbp: 48, bp: '82/48', pr: 124, rr: 28, spo2: 91 },
      esi_level: 1,
      venomCreatureTypes: ['bee_wasp_hornet'], venomStingsCount: 'several', venomFirstAid: ['wash_water_cold_pack'],
      venomParentHeadFace: false, venomParentNeck: true, venomNeckFront: false, venomNeckSide: true, venomNeckSideSides: ['right'], venomNeckBack: false, venomNeckSigns: ['rapid_neck_swelling_stridor_dysphagia'],
      venomParentChest: false, venomParentAbdomen: false,
      venomParentUpperExtremity: true, venomArmShoulder: true, venomArmShoulderSides: ['right'], venomArmElbowForearm: false, venomArmWristHand: false, venomArmFingers: false, venomUpperExtSigns: [],
      venomParentLowerExtremity: false, venomParentOther: false,
      venomLocalSigns: ['severe_rapid_spreading_swelling'],
      venomSystemicAllergySigns: ['urticaria_itching_erythema', 'facial_angioedema', 'laryngeal_edema_hoarseness', 'bronchospasm_dyspnea_wheezing', 'hypotensive_syncope_shock'],
      venomSnakeSigns: [], venomHymenopteraSigns: [], venomArthropodSigns: [], venomMarineSigns: [],
      painScore: 8, venomPriorAllergyHx: 'has_prior_allergy', venomPriorAllergyDetail: 'เคยถูกผึ้งต่อยเมื่อ 3 ปีก่อน มีผื่นลมพิษขึ้นทั้งตัวและแน่นหน้าอก', venomTetanusHx: 'within_5_years'
    },

    // Case 2: Cobra bite on left hand with ptosis, dysarthria and tourniquet (ESI 1)
    {
      id: 'case-venom-02', queue_number: 'E1-106', hn: '8901702',
      name: 'นางสมจิตร ถูกงูเห่ากัดมือซ้ายขันชะเนาะมาเริ่มมีหนังตาตกพูดไม่ชัดกลืนลำบาก', age: 58, gender: 'หญิง',
      chief_complaint: 'venomous_bite', chief_complaint_title: 'แมลง / งู / สัตว์มีพิษกัดต่อย',
      timestamp: '2026-11-09T08:45:00.000Z', status: 'waiting',
      durationVal: 1, durationUnit: 'hours', hospRecordStatus: 'self', underlying: ['เบาหวาน (DM)'], drugAllergy: 'ปฏิเสธ', currentMeds: 'Metformin',
      otherSymptomsFree: 'เอื้อมมือหยิบฟางในเล้าไก่ถูกงูเห่ากัดที่หลังมือซ้ายและนิ้วชี้ซ้าย ญาติใช้ผ้าขาวม้ามัดรัดเหนือข้อมือแน่นมาก แผลบวมคล้ำ เริ่มมีอาการหนังตาตกสองข้าง ลืมตาไม่ขึ้น พูดอ้อแอ้และกลืนน้ำลายลำบาก',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 37.0, sbp: 136, dbp: 84, bp: '136/84', pr: 98, rr: 22, spo2: 94 },
      esi_level: 1,
      venomCreatureTypes: ['snake'], venomSnakeType: 'cobra_king_cobra', venomSnakeDetailFree: 'งูเห่าแผ่แม่เบี้ยขู่ ตีตายแล้วนำซากใส่กระสอบมาด้วย',
      venomStingsCount: 'single_or_few', venomFirstAid: ['tourniquet_applied'],
      venomParentHeadFace: false, venomParentNeck: false, venomParentChest: false, venomParentAbdomen: false,
      venomParentUpperExtremity: true, venomArmShoulder: false, venomArmElbowForearm: false, venomArmWristHand: true, venomArmWristHandSides: ['left'],
      venomArmFingers: true, venomArmFingersLeftDigits: ['index'], venomArmFingersRightDigits: [],
      venomUpperExtSigns: ['arm_tense_compartment_ischemia'],
      venomParentLowerExtremity: false, venomParentOther: false,
      venomLocalSigns: ['fang_marks_active_bleeding', 'severe_rapid_spreading_swelling', 'necrosis_hemorrhagic_blebs'],
      venomSystemicAllergySigns: ['no_systemic_allergy_signs'],
      venomSnakeSigns: ['ptosis_diplopia_blurred_vision', 'dysarthria_bulbar_palsy', 'motor_weakness_resp_depression'],
      venomHymenopteraSigns: [], venomArthropodSigns: [], venomMarineSigns: [],
      painScore: 9, venomPriorAllergyHx: 'no_prior_allergy', venomTetanusHx: 'over_10_years'
    },

    // Case 3: Malayan Pit Viper (งูกะปะ) on right ankle with hemorrhagic bleb & bleeding (ESI 2)
    {
      id: 'case-venom-03', queue_number: 'E2-107', hn: '8901703',
      name: 'นายบุญเลิศ ถูกงูกะปะกัดข้อเท้าขวาเลือดไหลซึมไม่หยุดบวมตุ่มน้ำเลือดออกตามไรฟัน', age: 49, gender: 'ชาย',
      chief_complaint: 'venomous_bite', chief_complaint_title: 'แมลง / งู / สัตว์มีพิษกัดต่อย',
      timestamp: '2026-11-09T09:00:00.000Z', status: 'waiting',
      durationVal: 3, durationUnit: 'hours', hospRecordStatus: 'self', underlying: ['ความดันสูง (HT)'], drugAllergy: 'ปฏิเสธ', currentMeds: 'Amlodipine',
      otherSymptomsFree: 'กรีดยางตอนเช้ามืดถูกงูกะปะกัดที่ข้อเท้าขวา มีรอยเขี้ยว 2 รอย เลือดไหลซึมจากแผลตลอดเวลาไม่หยุด ข้อเท้าและหลังเท้าขวาบวมตึงมาก มีตุ่มน้ำพองปนเลือดขึ้นรอบแผล และมีเลือดซึมตามไรฟัน',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.9, sbp: 142, dbp: 86, bp: '142/86', pr: 88, rr: 18, spo2: 98 },
      esi_level: 2,
      venomCreatureTypes: ['snake'], venomSnakeType: 'malayan_pit_viper', venomSnakeDetailFree: 'ถ่ายรูปงูตัวสีน้ำตาลลายสามเหลี่ยมคล้ายหลังคาบ้านมาในมือถือ',
      venomStingsCount: 'single_or_few', venomFirstAid: ['wash_water_cold_pack'],
      venomParentHeadFace: false, venomParentNeck: false, venomParentChest: false, venomParentAbdomen: false, venomParentUpperExtremity: false,
      venomParentLowerExtremity: true, venomLegThigh: false, venomLegKneeShinCalf: false, venomLegAnkleFoot: true, venomLegAnkleFootSides: ['right'], venomLegToes: false,
      venomLowerExtSigns: [],
      venomParentOther: false,
      venomLocalSigns: ['fang_marks_active_bleeding', 'severe_rapid_spreading_swelling', 'necrosis_hemorrhagic_blebs'],
      venomSystemicAllergySigns: ['no_systemic_allergy_signs'],
      venomSnakeSigns: ['systemic_bleeding_vicc'],
      venomHymenopteraSigns: [], venomArthropodSigns: [], venomMarineSigns: [],
      painScore: 8, venomPriorAllergyHx: 'no_prior_allergy', venomTetanusHx: '5_to_10_years'
    },

    // Case 4: Centipede bite on right great toe with localized pain only (ESI 4)
    {
      id: 'case-venom-04', queue_number: 'E4-108', hn: '8901704',
      name: 'น.ส.กมลวรรณ ถูกตะขาบกัดนิ้วโป้งเท้าขวาปวดแสบปวดร้อนเฉพาะที่ไม่มีแพ้', age: 31, gender: 'หญิง',
      chief_complaint: 'venomous_bite', chief_complaint_title: 'แมลง / งู / สัตว์มีพิษกัดต่อย',
      timestamp: '2026-11-09T09:30:00.000Z', status: 'waiting',
      durationVal: 45, durationUnit: 'minutes', hospRecordStatus: 'self', underlying: [], drugAllergy: 'ปฏิเสธ', currentMeds: 'ไม่มี',
      otherSymptomsFree: 'สวมรองเท้าในบ้านถูกตะขาบตัวยาวประมาณ 5 นิ้วกัดที่นิ้วโป้งเท้าขวา ปวดแสบปวดร้อนและบวมแดงเฉพาะที่นิ้วเท้า ล้างน้ำสบู่และประคบเย็นมาแล้ว ไม่มีผื่นคัน ไม่แน่นคอ ไม่หอบเหนื่อย',
      doctor_notes: { additional_hpi: '', physical_exam: '', preliminary_dx: '', plan: '' },
      vital_signs: { bt: 36.6, sbp: 118, dbp: 74, bp: '118/74', pr: 72, rr: 16, spo2: 99 },
      esi_level: 4,
      venomCreatureTypes: ['centipede'], venomStingsCount: 'single_or_few', venomFirstAid: ['wash_water_cold_pack'],
      venomParentHeadFace: false, venomParentNeck: false, venomParentChest: false, venomParentAbdomen: false, venomParentUpperExtremity: false,
      venomParentLowerExtremity: true, venomLegThigh: false, venomLegKneeShinCalf: false, venomLegAnkleFoot: false,
      venomLegToes: true, venomLegToesLeftDigits: [], venomLegToesRightDigits: ['thumb'],
      venomLowerExtSigns: [],
      venomParentOther: false,
      venomLocalSigns: ['mild_local_pain_only'],
      venomSystemicAllergySigns: ['no_systemic_allergy_signs'],
      venomSnakeSigns: [], venomHymenopteraSigns: [], venomArthropodSigns: [], venomMarineSigns: [],
      painScore: 7, venomPriorAllergyHx: 'no_prior_allergy', venomTetanusHx: 'within_5_years'
    }
  ]
};

// Register module in Ratchaburi ER Core Registry
if (typeof registerCcModule === 'function') registerCcModule(venomousBiteModule);
else if (typeof window !== 'undefined' && typeof window.registerCcModule === 'function') window.registerCcModule(venomousBiteModule);

if (typeof module !== 'undefined' && module.exports) {
  module.exports = venomousBiteModule;
}
